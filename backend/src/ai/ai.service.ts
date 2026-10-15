
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  BadGatewayException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateQuestionDto } from './dto/generate-question.dto';

interface ProctoringDetection {
  type: string;
  confidence: number;
}

interface ProctoringInferenceResult {
  detections: ProctoringDetection[];
  modelVersion: string;
}

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async generateQuestion(dto: GenerateQuestionDto): Promise<unknown> {
    const baseUrl = this.configService
      .getOrThrow<string>('AI_SERVICE_URL')
      .replace(/\/+$/, '');

    const apiKey =
      this.configService.getOrThrow<string>('AI_SERVICE_API_KEY');

    const timeout = this.getTimeout();

    const response = await this.makeRequest(
      `${baseUrl}/v1/questions/generate`,
      apiKey,
      dto,
      timeout,
    );

    const data: unknown = await this.readJson(response);

    if (!this.isRecord(data) || !('status' in data)) {
      throw new InternalServerErrorException(
        'AI service returned an invalid response',
      );
    }

    return data;
  }

  async proctoringInference(input: {
    frameData: string;
    modelVersion: string;
  }): Promise<ProctoringInferenceResult> {
    const baseUrl = this.configService
      .getOrThrow<string>('AI_SERVICE_URL')
      .replace(/\/+$/, '');

    const apiKey =
      this.configService.getOrThrow<string>('AI_SERVICE_API_KEY');

    const response = await this.makeRequest(
      `${baseUrl}/v1/proctoring/inference`,
      apiKey,
      {
        frameData: input.frameData,
        modelVersion: input.modelVersion,
      },
      this.getTimeout(),
    );

    const data: unknown = await this.readJson(response);

    if (
      !this.isRecord(data) ||
      !Array.isArray(data.detections) ||
      typeof data.modelVersion !== 'string'
    ) {
      throw new InternalServerErrorException(
        'AI proctoring service returned an invalid response',
      );
    }

    const detections: ProctoringDetection[] = [];

    for (const detection of data.detections) {
      if (
        !this.isRecord(detection) ||
        typeof detection.type !== 'string' ||
        typeof detection.confidence !== 'number' ||
        !Number.isFinite(detection.confidence) ||
        detection.confidence < 0 ||
        detection.confidence > 1
      ) {
        throw new InternalServerErrorException(
          'AI proctoring service returned an invalid detection',
        );
      }

      detections.push({
        type: detection.type,
        confidence: detection.confidence,
      });
    }

    return {
      detections,
      modelVersion: data.modelVersion,
    };
  }

  private async makeRequest(
    url: string,
    apiKey: string,
    body: unknown,
    timeout: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 502 || response.status === 503 ||
            response.status === 504) {
          throw new BadGatewayException(
            'AI service is temporarily unavailable',
          );
        }

        throw new HttpException(
          `AI service request failed with status ${response.status}`,
          response.status >= 400 && response.status < 500
            ? response.status
            : 502,
        );
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (
        error instanceof Error &&
        error.name === 'AbortError'
      ) {
        throw new RequestTimeoutException(
          'AI service request timed out',
        );
      }

      throw new ServiceUnavailableException(
        'Unable to connect to AI service',
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async readJson(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      throw new InternalServerErrorException(
        'AI service returned invalid JSON',
      );
    }
  }

  private getTimeout(): number {
    const configured = Number(
      this.configService.get<string>('AI_SERVICE_TIMEOUT') ?? 10000,
    );

    if (!Number.isFinite(configured) || configured <= 0) {
      return 10000;
    }

    return configured;
  }

  private isRecord(
    value: unknown,
  ): value is Record<string, any> {
    return typeof value === 'object' && value !== null &&
      !Array.isArray(value);
  }
}
