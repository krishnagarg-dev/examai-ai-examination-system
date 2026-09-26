import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AttemptsService } from '../attempts/attempts.service';
import { ProctoringService } from './proctoring.service';
import { ProctoringEventDto } from './dto/proctoring-event.dto';
import { Types } from 'mongoose';
import { AttemptStatus } from '../attempts/schemas/attempt.schema';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000');

@WebSocketGateway({
  cors: {
    origin: frontendUrl,
  },
  namespace: 'proctoring',
})
export class ProctoringGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ProctoringGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly attemptsService: AttemptsService,
    private readonly proctoringService: ProctoringService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        this.logger.error('Client attempted to connect without token');
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      client.data.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      this.logger.log(`Client connected to proctoring: ${client.data.user.id}`);
    } catch (error) {
      this.logger.error('JWT verification failed during socket handshake', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.data?.user?.id || 'unknown'}`);
  }

  @SubscribeMessage('join-attempt')
  async joinAttempt(@MessageBody() attemptId: string, @ConnectedSocket() client: Socket) {
    try {
      if (!client.data?.user?.id) {
        this.logger.error('Unauthorized socket operation: missing user context');
        client.emit('error', { message: 'Unauthorized' });
        client.disconnect();
        return;
      }

      if (!attemptId || !Types.ObjectId.isValid(attemptId)) {
        this.logger.warn(`Invalid attempt ID format: ${attemptId}`);
        client.emit('error', { message: 'Invalid attempt ID format' });
        client.disconnect();
        return;
      }

      const attempt = await this.attemptsService.findById(attemptId);

      if (attempt.studentId.toString() !== client.data.user.id) {
        this.logger.warn(`User ${client.data.user.id} attempted to join unauthorized attempt: ${attemptId}`);
        client.emit('error', { message: 'Unauthorized to join this attempt' });
        client.disconnect();
        return;
      }

      if (attempt.status !== AttemptStatus.IN_PROGRESS) {
        this.logger.warn(`Attempt ${attemptId} is not in progress (Status: ${attempt.status})`);
        client.emit('error', { message: 'Attempt is not in progress' });
        client.disconnect();
        return;
      }

      const rooms = Array.from(client.rooms);
      for (const room of rooms) {
        if (room.startsWith('attempt_')) {
          client.leave(room);
        }
      }

      client.join(`attempt_${attemptId}`);
      client.data.attemptId = attemptId;
      client.data.examId = attempt.examId.toString();

      this.logger.log(`Client ${client.data.user.id} securely authorized and joined attempt: ${attemptId}`);
      client.emit('joined-attempt', { attemptId });
    } catch (error) {
      this.logger.error(`Error in joinAttempt: ${error.message}`);
      client.emit('error', { message: 'Internal server error during room join' });
      client.disconnect();
    }
  }

  @SubscribeMessage('proctoring-event')
  async handleProctoringEvent(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    try {
      if (!client.data?.user?.id || !client.data?.attemptId || !client.data?.examId) {
        this.logger.warn('Proctoring event received from uninitialized/unauthorized socket session');
        client.emit('error', { message: 'Unauthorized event stream' });
        return;
      }

      // Validate DTO
      const dto = plainToInstance(ProctoringEventDto, payload);
      const errors = await validate(dto);

      if (errors.length > 0) {
        this.logger.warn('Invalid proctoring event payload received');
        client.emit('error', { message: 'Invalid event payload' });
        return;
      }

      const attemptId = client.data.attemptId;
      const studentId = client.data.user.id;
      const examId = client.data.examId;

      // Record violation via service
      const result = await this.proctoringService.recordViolation(
        attemptId,
        studentId,
        examId,
        dto.type,
        dto.description || '',
        {
          confidence: dto.confidence,
          clientOccurredAt: dto.clientOccurredAt,
          ...dto.metadata,
        },
      );

      // If terminated due to max violations, notify client and disconnect
      if (result.terminated) {
        this.logger.warn(`Attempt ${attemptId} terminated due to proctoring violations.`);
        client.emit('attempt-terminated', { reason: 'Maximum proctoring violations reached' });
        client.disconnect();
      } else {
        client.emit('event-acknowledged', { violationCount: result.violationCount });
      }
    } catch (error) {
      this.logger.error(`Error processing proctoring event: ${error.message}`);
      client.emit('error', { message: 'Failed to process event' });
    }
  }
}
