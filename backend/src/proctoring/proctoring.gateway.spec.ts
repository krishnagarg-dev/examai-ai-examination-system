import { Test, TestingModule } from '@nestjs/testing';
import { ProctoringGateway } from './proctoring.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AttemptsService } from '../attempts/attempts.service';
import { Socket } from 'socket.io';
import { Types } from 'mongoose';
import { AttemptStatus } from '../attempts/schemas/attempt.schema';

describe('ProctoringGateway (Security & Phase 2A)', () => {
  let gateway: ProctoringGateway;
  let jwtService: JwtService;
  let attemptsService: AttemptsService;

  const validUserId = '123456789012345678901234';
  const otherUserId = 'abcdef123456abcdef123456';

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  const mockAttemptsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProctoringGateway,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AttemptsService, useValue: mockAttemptsService },
      ],
    }).compile();

    gateway = module.get<ProctoringGateway>(ProctoringGateway);
    jwtService = module.get<JwtService>(JwtService);
    attemptsService = module.get<AttemptsService>(AttemptsService);
    jest.clearAllMocks();
  });

  const createMockSocket = (token?: string): Partial<Socket> => ({
    handshake: {
      auth: { token },
      headers: token ? { authorization: `Bearer ${token}` } : {},
    } as any,
    data: { user: undefined },
    disconnect: jest.fn(),
    emit: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
    rooms: new Set(['socket-id']),
  });

  it('1. missing JWT -> disconnects client', async () => {
    const socket = createMockSocket(undefined);
    await gateway.handleConnection(socket as Socket);
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('2. invalid JWT -> disconnects client', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(
      new Error('Invalid signature'),
    );
    const socket = createMockSocket('bad-token');
    await gateway.handleConnection(socket as Socket);
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('3. expired JWT -> disconnects client', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(
      new Error('TokenExpiredError'),
    );
    const socket = createMockSocket('expired-token');
    await gateway.handleConnection(socket as Socket);
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('4. valid JWT -> sets user data', async () => {
    mockJwtService.verifyAsync.mockResolvedValue({
      sub: validUserId,
      email: 'test@test.com',
      role: 'student',
    });
    const socket = createMockSocket('valid-token');
    await gateway.handleConnection(socket as Socket);
    expect(socket.data.user).toEqual({
      id: validUserId,
      email: 'test@test.com',
      role: 'student',
    });
    expect(socket.disconnect).not.toHaveBeenCalled();
  });

  it('5. own attempt -> joins successfully', async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };

    mockAttemptsService.findById.mockResolvedValue({
      _id: new Types.ObjectId(attemptId),
      studentId: new Types.ObjectId(validUserId),
      status: AttemptStatus.IN_PROGRESS,
    });

    await gateway.joinAttempt(attemptId, socket as Socket);
    expect(socket.join).toHaveBeenCalledWith(`attempt_${attemptId}`);
    expect(socket.data.attemptId).toEqual(attemptId);
    expect(socket.emit).toHaveBeenCalledWith('joined-attempt', { attemptId });
  });

  it('6 & 7. Student A -> Student B attempt -> unauthorized, disconnects', async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: 'studentA' };

    mockAttemptsService.findById.mockResolvedValue({
      _id: new Types.ObjectId(attemptId),
      studentId: new Types.ObjectId(otherUserId),
      status: AttemptStatus.IN_PROGRESS,
    });

    await gateway.joinAttempt(attemptId, socket as Socket);
    expect(socket.emit).toHaveBeenCalledWith('error', {
      message: 'Unauthorized to join this attempt',
    });
    expect(socket.disconnect).toHaveBeenCalled();
    expect(socket.join).not.toHaveBeenCalled();
  });

  it('8. nonexistent attempt -> safe error response & disconnect', async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };

    mockAttemptsService.findById.mockRejectedValue(new Error('Not found'));

    await gateway.joinAttempt(attemptId, socket as Socket);
    expect(socket.emit).toHaveBeenCalledWith('error', {
      message: 'Internal server error during room join',
    });
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('9. invalid attempt ID -> invalid format error & disconnect', async () => {
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };

    await gateway.joinAttempt('not-an-object-id', socket as Socket);
    expect(socket.emit).toHaveBeenCalledWith('error', {
      message: 'Invalid attempt ID format',
    });
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('10. inactive attempt -> status error & disconnect', async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };

    mockAttemptsService.findById.mockResolvedValue({
      _id: new Types.ObjectId(attemptId),
      studentId: new Types.ObjectId(validUserId),
      status: AttemptStatus.SUBMITTED,
    });

    await gateway.joinAttempt(attemptId, socket as Socket);
    expect(socket.emit).toHaveBeenCalledWith('error', {
      message: 'Attempt is not in progress',
    });
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('11. repeated join -> updates state and joins', async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };

    mockAttemptsService.findById.mockResolvedValue({
      _id: new Types.ObjectId(attemptId),
      studentId: new Types.ObjectId(validUserId),
      status: AttemptStatus.IN_PROGRESS,
    });

    await gateway.joinAttempt(attemptId, socket as Socket);
    await gateway.joinAttempt(attemptId, socket as Socket);
    expect(socket.join).toHaveBeenCalledTimes(2);
  });

  it('12 & 13. room isolation -> leaves old attempt rooms', async () => {
    const attemptId1 = new Types.ObjectId().toString();
    const attemptId2 = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };
    socket.rooms = new Set(['socket-id', `attempt_${attemptId1}`]);

    mockAttemptsService.findById.mockResolvedValue({
      _id: new Types.ObjectId(attemptId2),
      studentId: new Types.ObjectId(validUserId),
      status: AttemptStatus.IN_PROGRESS,
    });

    await gateway.joinAttempt(attemptId2, socket as Socket);
    expect(socket.leave).toHaveBeenCalledWith(`attempt_${attemptId1}`);
    expect(socket.join).toHaveBeenCalledWith(`attempt_${attemptId2}`);
  });

  it('14. authoritative socket attempt binding -> binds attemptId securely', async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };

    mockAttemptsService.findById.mockResolvedValue({
      _id: new Types.ObjectId(attemptId),
      studentId: new Types.ObjectId(validUserId),
      status: AttemptStatus.IN_PROGRESS,
    });

    await gateway.joinAttempt(attemptId, socket as Socket);
    expect(socket.data.attemptId).toBe(attemptId);
  });

  it('15. safe error response -> emits error and disconnects without leaking internals', async () => {
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };

    mockAttemptsService.findById.mockRejectedValue(
      new Error('Database connection failed with credentials root:secret'),
    );

    await gateway.joinAttempt(
      new Types.ObjectId().toString(),
      socket as Socket,
    );
    expect(socket.emit).toHaveBeenCalledWith('error', {
      message: 'Internal server error during room join',
    });
    // Ensure raw error message with secrets/stack is NOT sent to client
    expect(socket.emit).not.toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('credentials'),
      }),
    );
    expect(socket.disconnect).toHaveBeenCalled();
  });
});
