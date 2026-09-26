import { Test, TestingModule } from "@nestjs/testing";
import { ProctoringGateway } from "./proctoring.gateway";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AttemptsService } from "../attempts/attempts.service";
import { ProctoringService } from "./proctoring.service";
import { Socket } from "socket.io";
import { Types } from "mongoose";
import { AttemptStatus } from "../attempts/schemas/attempt.schema";
import { ViolationType } from "./schemas/proctoring.schema";

describe("ProctoringGateway (Security Matrix & Phase 2B)", () => {
  let gateway: ProctoringGateway;
  let jwtService: JwtService;
  let attemptsService: AttemptsService;
  let proctoringService: ProctoringService;

  const validUserId = "123456789012345678901234";
  const validExamId = "678901234567890123456789";

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue("test-secret"),
  };

  const mockAttemptsService = {
    findById: jest.fn(),
  };

  const mockProctoringService = {
    recordViolation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProctoringGateway,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AttemptsService, useValue: mockAttemptsService },
        { provide: ProctoringService, useValue: mockProctoringService },
      ],
    }).compile();

    gateway = module.get<ProctoringGateway>(ProctoringGateway);
    jwtService = module.get<JwtService>(JwtService);
    attemptsService = module.get<AttemptsService>(AttemptsService);
    proctoringService = module.get<ProctoringService>(ProctoringService);
    jest.clearAllMocks();
  });

  const createMockSocket = (token?: string): Partial<Socket> => ({
    handshake: {
      auth: { token },
      headers: token ? { authorization: `Bearer ${token}` } : {},
    } as any,
    id: "socket-1",
    data: { user: undefined },
    disconnect: jest.fn(),
    emit: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
    rooms: new Set(["socket-1"]),
  });

  it("1. missing JWT -> disconnects client", async () => {
    const socket = createMockSocket(undefined);
    await gateway.handleConnection(socket as Socket);
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it("2. invalid JWT -> disconnects client", async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error("Invalid signature"));
    const socket = createMockSocket("bad-token");
    await gateway.handleConnection(socket as Socket);
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it("3. expired JWT -> disconnects client", async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error("TokenExpiredError"));
    const socket = createMockSocket("expired-token");
    await gateway.handleConnection(socket as Socket);
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it("4. valid JWT -> sets user data", async () => {
    mockJwtService.verifyAsync.mockResolvedValue({ sub: validUserId, email: "test@test.com", role: "student" });
    const socket = createMockSocket("valid-token");
    await gateway.handleConnection(socket as Socket);
    expect(socket.data.user).toEqual({ id: validUserId, email: "test@test.com", role: "student" });
    expect(socket.disconnect).not.toHaveBeenCalled();
  });

  it("5. own attempt -> joins successfully", async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };
    
    mockAttemptsService.findById.mockResolvedValue({
      _id: new Types.ObjectId(attemptId),
      studentId: new Types.ObjectId(validUserId),
      examId: new Types.ObjectId(validExamId),
      status: AttemptStatus.IN_PROGRESS,
    });

    await gateway.joinAttempt(attemptId, socket as Socket);
    expect(socket.join).toHaveBeenCalledWith(`attempt_${attemptId}`);
    expect(socket.data.attemptId).toEqual(attemptId);
    expect(socket.data.examId).toEqual(validExamId);
    expect(socket.emit).toHaveBeenCalledWith("joined-attempt", { attemptId });
  });

  it("6. proctoring-event: valid payload -> records violation and acknowledges", async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };
    socket.data.attemptId = attemptId;
    socket.data.examId = validExamId;

    mockProctoringService.recordViolation.mockResolvedValue({
      violation: {},
      violationCount: 1,
      terminated: false,
    });

    const eventPayload = {
      type: ViolationType.TAB_SWITCH,
      clientOccurredAt: new Date().toISOString(),
    };

    await gateway.handleProctoringEvent(eventPayload, socket as Socket);

    expect(mockProctoringService.recordViolation).toHaveBeenCalledWith(
      attemptId,
      validUserId,
      validExamId,
      ViolationType.TAB_SWITCH,
      "",
      expect.objectContaining({
        clientOccurredAt: eventPayload.clientOccurredAt,
      }),
    );
    expect(socket.emit).toHaveBeenCalledWith("event-acknowledged", { 
      message: "Event recorded successfully" 
    });
  });

  it("7. proctoring-event: invalid payload -> returns error", async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };
    socket.data.attemptId = attemptId;
    socket.data.examId = validExamId;

    const invalidPayload = {
      type: "INVALID_TYPE",
    };

    await gateway.handleProctoringEvent(invalidPayload, socket as Socket);

    expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
    expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
  });

  it("8. proctoring-event: uninitialized socket -> returns unauthorized error", async () => {
    const socket = createMockSocket();
    await gateway.handleProctoringEvent({}, socket as Socket);
    expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
    expect(socket.emit).toHaveBeenCalledWith("error", { message: "Unauthorized event stream" });
  });

  it("9. proctoring-event: invalid timestamps -> returns error", async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };
    socket.data.attemptId = attemptId;
    socket.data.examId = validExamId;

    const payload = {
      type: ViolationType.TAB_SWITCH,
      clientOccurredAt: "not-a-date",
    };

    await gateway.handleProctoringEvent(payload, socket as Socket);
    expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
  });

  it("10. proctoring-event: confidence range -> rejects invalid confidence", async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };
    socket.data.attemptId = attemptId;
    socket.data.examId = validExamId;

    const payload = {
      type: ViolationType.NO_FACE,
      clientOccurredAt: new Date().toISOString(),
      confidence: 1.5,
    };

    await gateway.handleProctoringEvent(payload, socket as Socket);
    expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
    expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
  });

  it("11. Automatic termination ABSENT -> does NOT disconnect socket or emit attempt-terminated even if service returns terminated: true", async () => {
    const attemptId = new Types.ObjectId().toString();
    const socket = createMockSocket();
    socket.data.user = { id: validUserId };
    socket.data.attemptId = attemptId;
    socket.data.examId = validExamId;

    mockAttemptsService.findById.mockResolvedValue({
      _id: new Types.ObjectId(attemptId),
      status: AttemptStatus.IN_PROGRESS,
    });

    mockProctoringService.recordViolation.mockResolvedValue({
      violation: {},
      violationCount: 3,
      terminated: true,
    });

    const eventPayload = {
      type: ViolationType.TAB_SWITCH,
      clientOccurredAt: new Date().toISOString(),
    };

    await gateway.handleProctoringEvent(eventPayload, socket as Socket);

    // Should NOT emit attempt-terminated
    expect(socket.emit).not.toHaveBeenCalledWith("attempt-terminated", expect.anything());
    // Should NOT disconnect
    expect(socket.disconnect).not.toHaveBeenCalled();
    // Should still acknowledge the event
    expect(socket.emit).toHaveBeenCalledWith("event-acknowledged", {
      message: "Event recorded successfully",
    });
  });
});
