
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AttemptsService } from '../attempts/attempts.service';
import { AttemptStatus } from '../attempts/schemas/attempt.schema';
import { AiService } from '../ai/ai.service';
import { ProctoringService } from './proctoring.service';
import { ProctoringEventDto } from './dto/proctoring-event.dto';
import { ViolationType } from './schemas/proctoring.schema';

const frontendUrl =
  process.env.FRONTEND_URL ||
  (process.env.NODE_ENV === 'production'
    ? false
    : 'http://localhost:3000');

@WebSocketGateway({
  cors: {
    origin: frontendUrl,
  },
  namespace: 'proctoring',
})
export class ProctoringGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ProctoringGateway.name);
  private readonly rateLimitMap = new Map<string, number>();

  private readonly frameIntervalMs = 2000;
  private readonly maxFrameDataLength = 7_000_000;

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly attemptsService: AttemptsService,
    private readonly proctoringService: ProctoringService,
    private readonly aiService: AiService,
  ) { }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const authHeader = client.handshake.headers.authorization;
      const headerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined;

      const token = client.handshake.auth?.token || headerToken;

      if (typeof token !== 'string' || !token.trim()) {
        this.logger.warn(
          `Connection rejected: missing token (${client.id})`,
        );
        client.disconnect(true);
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!payload.sub || !Types.ObjectId.isValid(payload.sub)) {
        this.logger.warn(
          `Connection rejected: invalid user ID (${client.id})`,
        );
        client.disconnect(true);
        return;
      }

      client.data.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      this.logger.log(`Client connected to proctoring: ${client.id}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';

      this.logger.warn(
        `JWT verification failed for socket ${client.id}: ${message}`,
      );

      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    this.rateLimitMap.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-attempt')
  async joinAttempt(
    @MessageBody() attemptId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      if (!client.data?.user?.id) {
        client.emit('error', { message: 'Unauthorized' });
        client.disconnect(true);
        return;
      }

      if (
        typeof attemptId !== 'string' ||
        !Types.ObjectId.isValid(attemptId)
      ) {
        this.logger.warn(`Invalid attempt ID format: ${client.id}`);
        client.emit('error', { message: 'Invalid attempt ID format' });
        return;
      }

      const attempt = await this.attemptsService.findById(attemptId);

      if (!attempt) {
        client.emit('error', { message: 'Attempt not found' });
        return;
      }

      if (attempt.studentId.toString() !== client.data.user.id) {
        this.logger.warn(
          `User ${client.data.user.id} attempted unauthorized attempt ${attemptId}`,
        );

        client.emit('error', {
          message: 'Unauthorized to join this attempt',
        });
        return;
      }

      if (attempt.status !== AttemptStatus.IN_PROGRESS) {
        this.logger.warn(
          `Attempt ${attemptId} is not in progress (Status: ${attempt.status})`,
        );

        client.emit('error', {
          message: 'Attempt is not in progress',
        });
        return;
      }

      // Leave any previously joined attempt room.
      for (const room of client.rooms) {
        if (room.startsWith('attempt_')) {
          await client.leave(room);
        }
      }

      const roomName = `attempt_${attemptId}`;
      await client.join(roomName);

      client.data.attemptId = attemptId;
      client.data.examId = attempt.examId.toString();

      this.logger.log(
        `Client ${client.id} securely joined attempt ${attemptId}`,
      );

      client.emit('joined-attempt', { attemptId });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(`Error in joinAttempt: ${message}`);

      client.emit('error', {
        message: 'Internal server error during room join',
      });
    }
  }

  @SubscribeMessage('proctoring-event')
  async handleProctoringEvent(
    @MessageBody() payload: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      if (
        !client.data?.user?.id ||
        !client.data?.attemptId ||
        !client.data?.examId
      ) {
        client.emit('error', {
          message: 'Unauthorized event stream',
        });
        return;
      }

      const dto = plainToInstance(ProctoringEventDto, payload);
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        client.emit('error', {
          message: 'Invalid event payload',
        });
        return;
      }

      const attempt = await this.attemptsService.findById(
        client.data.attemptId,
      );

      if (
        !attempt ||
        attempt.status !== AttemptStatus.IN_PROGRESS ||
        attempt.studentId.toString() !== client.data.user.id ||
        attempt.examId.toString() !== client.data.examId
      ) {
        client.emit('error', {
          message: 'Attempt is no longer active or authorized',
        });
        return;
      }

      await this.proctoringService.recordViolation(
        client.data.attemptId,
        client.data.user.id,
        client.data.examId,
        dto.type,
        dto.description || '',
        {
          confidence: dto.confidence,
          clientOccurredAt: dto.clientOccurredAt,
          ...dto.metadata,
        },
      );

      client.emit('event-acknowledged', {
        message: 'Event recorded successfully',
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(`Error processing proctoring event: ${message}`);

      client.emit('error', {
        message: 'Failed to process event',
      });
    }
  }

  @SubscribeMessage('proctoring-frame')
  async handleProctoringFrame(
    @MessageBody() payload: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      if (
        !client.data?.user?.id ||
        !client.data?.attemptId ||
        !client.data?.examId
      ) {
        client.emit('error', {
          message: 'Unauthorized frame stream',
        });
        return;
      }

      if (
        !payload ||
        typeof payload !== 'object' ||
        !('frameData' in payload) ||
        typeof payload.frameData !== 'string' ||
        payload.frameData.length === 0 ||
        payload.frameData.length > this.maxFrameDataLength
      ) {
        client.emit('error', {
          message: 'Invalid frame data or frame size exceeded',
        });
        return;
      }

      const frameData = payload.frameData;

      // Enforce a per-socket minimum interval between frame requests.
      const now = Date.now();
      const lastFrameTime = this.rateLimitMap.get(client.id) ?? 0;

      if (now - lastFrameTime < this.frameIntervalMs) {
        client.emit('error', {
          message: 'Rate limit exceeded for frame capture',
        });
        return;
      }

      this.rateLimitMap.set(client.id, now);

      const attempt = await this.attemptsService.findById(
        client.data.attemptId,
      );

      if (
        !attempt ||
        attempt.status !== AttemptStatus.IN_PROGRESS ||
        attempt.studentId.toString() !== client.data.user.id ||
        attempt.examId.toString() !== client.data.examId
      ) {
        client.emit('error', {
          message: 'Attempt is no longer active or authorized',
        });
        return;
      }

      // Model selection is controlled by server configuration.
      const modelVersion =
        this.configService.get<string>(
          'AI_PROCTORING_MODEL_VERSION',
        ) || 'v1-mock';

      const proctoringInference = Reflect.get(
        this.aiService,
        'proctoringInference',
      );

      if (typeof proctoringInference !== 'function') {
        throw new Error('AI proctoring inference is unavailable');
      }

      const aiResult = await proctoringInference.call(this.aiService, {
        frameData,
        modelVersion,
      });


      for (const detection of aiResult.detections) {
        let violationType: ViolationType;

        switch (detection.type) {
          case 'NO_FACE':
            violationType = ViolationType.NO_FACE;
            break;

          case 'MULTIPLE_FACES':
            violationType = ViolationType.MULTIPLE_FACES;
            break;

          case 'FACE_OBSTRUCTED':
            violationType = ViolationType.FACE_OBSTRUCTED;
            break;

          case 'MOBILE_PHONE':
            violationType = ViolationType.MOBILE_PHONE;
            break;

          case 'SUSPICIOUS_OBJECT':
            violationType = ViolationType.SUSPICIOUS_OBJECT;
            break;

          case 'FACE_DETECTED':
            // Normal observation; do not record a violation.
            continue;

          default:
            this.logger.warn(
              `Ignoring unknown AI detection type: ${detection.type}`,
            );
            continue;
        }

        await this.proctoringService.recordViolation(
          client.data.attemptId,
          client.data.user.id,
          client.data.examId,
          violationType,
          `AI detected ${detection.type}`,
          {
            confidence: detection.confidence,
            modelVersion: aiResult.modelVersion,
          },
        );
      }


      client.emit('frame-acknowledged', {
        detections: aiResult.detections,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(
        `Error processing proctoring frame: ${message}`,
      );

      client.emit('error', {
        message: 'Failed to process frame inference',
      });
    }
  }
}
