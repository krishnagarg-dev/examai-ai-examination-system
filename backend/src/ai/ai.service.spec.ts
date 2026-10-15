import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import {
  InternalServerErrorException,
  RequestTimeoutException,
  HttpException,
} from '@nestjs/common';
import { Difficulty } from './dto/generate-question.dto';

describe('AiService', () => {
  let service: AiService;

  const createTestingModule = async (configValues: Record<string, any>) => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => configValues[key]),
            getOrThrow: jest.fn().mockImplementation((key) => {
              if (configValues[key] !== undefined) return configValues[key];
              throw new Error(`Missing config ${key}`);
            }),
          },
        },
      ],
    }).compile();

    return module.get<AiService>(AiService);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    service = await createTestingModule({
      AI_SERVICE_URL: 'http://mock-ai',
      AI_SERVICE_API_KEY: 'mock-key',
      AI_SERVICE_TIMEOUT: '1000',
    });
    expect(service).toBeDefined();
  });

  it('1. Successful request & 8. Auth header & 9. Correct endpoint', async () => {
    service = await createTestingModule({
      AI_SERVICE_URL: 'http://mock-ai',
      AI_SERVICE_API_KEY: 'mock-key',
      AI_SERVICE_TIMEOUT: '1000',
    });

    const mockResponse = { status: 'success' };
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const dto = { topic: 'math', difficulty: Difficulty.EASY };
    const result = await service.generateQuestion(dto);

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://mock-ai/v1/questions/generate',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'X-API-KEY': 'mock-key' }),
        body: JSON.stringify(dto),
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('2. Timeout & 10. Configurable timeout', async () => {
    service = await createTestingModule({
      AI_SERVICE_URL: 'http://mock-ai',
      AI_SERVICE_API_KEY: 'mock-key',
      AI_SERVICE_TIMEOUT: '500',
    });

    jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        new Promise((_, reject) => {
          const error = new Error();
          error.name = 'AbortError';
          reject(error);
        }),
    );

    await expect(
      service.generateQuestion({ topic: 'math', difficulty: Difficulty.EASY }),
    ).rejects.toThrow(RequestTimeoutException);
  });

  it('3. AI service unavailable (502)', async () => {
    service = await createTestingModule({
      AI_SERVICE_URL: 'http://mock-ai',
      AI_SERVICE_API_KEY: 'mock-key',
    });

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 502,
    } as any);

    await expect(
      service.generateQuestion({ topic: 'math', difficulty: Difficulty.EASY }),
    ).rejects.toThrow(HttpException);
  });

  it('4. AI service returns 400', async () => {
    service = await createTestingModule({
      AI_SERVICE_URL: 'http://mock-ai',
      AI_SERVICE_API_KEY: 'mock-key',
    });

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
    } as any);

    await expect(
      service.generateQuestion({ topic: 'math', difficulty: Difficulty.EASY }),
    ).rejects.toThrow(HttpException);
  });

  it('5. AI service returns 500', async () => {
    service = await createTestingModule({
      AI_SERVICE_URL: 'http://mock-ai',
      AI_SERVICE_API_KEY: 'mock-key',
    });

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as any);

    await expect(
      service.generateQuestion({ topic: 'math', difficulty: Difficulty.EASY }),
    ).rejects.toThrow(HttpException);
  });

  it('6. Invalid AI response (malformed schema)', async () => {
    service = await createTestingModule({
      AI_SERVICE_URL: 'http://mock-ai',
      AI_SERVICE_API_KEY: 'mock-key',
    });

    const mockResponse = { wrongField: 123 };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    await expect(
      service.generateQuestion({ topic: 'math', difficulty: Difficulty.EASY }),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('7. Missing API key configuration', async () => {
    await expect(
      createTestingModule({
        AI_SERVICE_URL: 'http://mock-ai',
        // Missing AI_SERVICE_API_KEY
      }),
    ).rejects.toThrow('Missing config AI_SERVICE_API_KEY');
  });
});
