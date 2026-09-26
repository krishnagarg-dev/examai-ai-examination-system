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

describe("ProctoringGateway (Security Matrix & Phase 2A/2B)", () => {
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

  describe("Phase 2A Socket Infrastructure & Authentication", () => {
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
  });

  describe("Phase 2B Authoritative Context & Security Matrix", () => {
    it("6. Forged attemptId / studentId / examId -> server persists strictly with authoritative socket context", async () => {
      const authAttemptId = new Types.ObjectId().toString();
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = authAttemptId;
      socket.data.examId = validExamId;

      mockAttemptsService.findById.mockResolvedValue({
        _id: new Types.ObjectId(authAttemptId),
        status: AttemptStatus.IN_PROGRESS,
      });

      mockProctoringService.recordViolation.mockResolvedValue({
        violation: {},
        violationCount: 1,
        terminated: false,
      });

      const maliciousPayload = {
        attemptId: "ATTEMPT_B_FORGED",
        studentId: "STUDENT_B_FORGED",
        examId: "EXAM_B_FORGED",
        type: ViolationType.TAB_SWITCH,
        clientOccurredAt: new Date().toISOString(),
      };

      await gateway.handleProctoringEvent(maliciousPayload, socket as Socket);

      expect(mockProctoringService.recordViolation).toHaveBeenCalledWith(
        authAttemptId,
        validUserId,
        validExamId,
        ViolationType.TAB_SWITCH,
        "",
        expect.objectContaining({
          clientOccurredAt: maliciousPayload.clientOccurredAt,
        })
      );
      expect(socket.emit).toHaveBeenCalledWith("event-acknowledged", {
        message: "Event recorded successfully",
      });
    });

    it("7. Invalid event type -> rejected safely without socket disconnect", async () => {
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = new Types.ObjectId().toString();
      socket.data.examId = validExamId;

      await gateway.handleProctoringEvent({ type: "UNKNOWN_VIOLATION", clientOccurredAt: new Date().toISOString() }, socket as Socket);

      expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
      expect(socket.disconnect).not.toHaveBeenCalled();
    });

    it("8. Malformed timestamp -> rejected safely", async () => {
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = new Types.ObjectId().toString();
      socket.data.examId = validExamId;

      await gateway.handleProctoringEvent({ type: ViolationType.TAB_SWITCH, clientOccurredAt: "invalid-timestamp" }, socket as Socket);

      expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
    });

    it("9. Confidence < 0 -> rejected safely", async () => {
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = new Types.ObjectId().toString();
      socket.data.examId = validExamId;

      await gateway.handleProctoringEvent({ type: ViolationType.NO_FACE, clientOccurredAt: new Date().toISOString(), confidence: -0.1 }, socket as Socket);

      expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
    });

    it("10. Confidence > 1 -> rejected safely", async () => {
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = new Types.ObjectId().toString();
      socket.data.examId = validExamId;

      await gateway.handleProctoringEvent({ type: ViolationType.NO_FACE, clientOccurredAt: new Date().toISOString(), confidence: 1.05 }, socket as Socket);

      expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
    });

    it("11. NaN confidence -> rejected safely", async () => {
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = new Types.ObjectId().toString();
      socket.data.examId = validExamId;

      await gateway.handleProctoringEvent({ type: ViolationType.NO_FACE, clientOccurredAt: new Date().toISOString(), confidence: NaN }, socket as Socket);

      expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
    });

    it("12. Infinity confidence -> rejected safely", async () => {
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = new Types.ObjectId().toString();
      socket.data.examId = validExamId;

      await gateway.handleProctoringEvent({ type: ViolationType.NO_FACE, clientOccurredAt: new Date().toISOString(), confidence: Infinity }, socket as Socket);

      expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
    });

    it("13. Oversized description (> 200 chars) -> rejected safely", async () => {
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = new Types.ObjectId().toString();
      socket.data.examId = validExamId;

      await gateway.handleProctoringEvent({
        type: ViolationType.TAB_SWITCH,
        clientOccurredAt: new Date().toISOString(),
        description: "a".repeat(201),
      }, socket as Socket);

      expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Invalid event payload" });
    });

    it("14. Missing socket attempt binding -> rejected safely", async () => {
      const socket = createMockSocket();
      // Socket without attemptId or examId
      socket.data.user = { id: validUserId };

      await gateway.handleProctoringEvent({
        type: ViolationType.TAB_SWITCH,
        clientOccurredAt: new Date().toISOString(),
      }, socket as Socket);

      expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Unauthorized event stream" });
    });

    it("15. Inactive attempt -> rejected when attempt is SUBMITTED or TERMINATED", async () => {
      const attemptId = new Types.ObjectId().toString();
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = attemptId;
      socket.data.examId = validExamId;

      mockAttemptsService.findById.mockResolvedValue({
        _id: new Types.ObjectId(attemptId),
        status: AttemptStatus.SUBMITTED,
      });

      await gateway.handleProctoringEvent({
        type: ViolationType.TAB_SWITCH,
        clientOccurredAt: new Date().toISOString(),
      }, socket as Socket);

      expect(mockProctoringService.recordViolation).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Attempt is no longer active" });
    });

    it("16. Semantic: TAB_SWITCH without confidence -> accepted", async () => {
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
        violationCount: 1,
        terminated: false,
      });

      await gateway.handleProctoringEvent({
        type: ViolationType.TAB_SWITCH,
        clientOccurredAt: new Date().toISOString(),
      }, socket as Socket);

      expect(mockProctoringService.recordViolation).toHaveBeenCalledWith(
        attemptId,
        validUserId,
        validExamId,
        ViolationType.TAB_SWITCH,
        "",
        expect.any(Object)
      );
      expect(socket.emit).toHaveBeenCalledWith("event-acknowledged", expect.any(Object));
    });

    it("17. Semantic: FULLSCREEN_EXIT without confidence -> accepted", async () => {
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
        violationCount: 1,
        terminated: false,
      });

      await gateway.handleProctoringEvent({
        type: ViolationType.FULLSCREEN_EXIT,
        clientOccurredAt: new Date().toISOString(),
      }, socket as Socket);

      expect(mockProctoringService.recordViolation).toHaveBeenCalledWith(
        attemptId,
        validUserId,
        validExamId,
        ViolationType.FULLSCREEN_EXIT,
        "",
        expect.any(Object)
      );
      expect(socket.emit).toHaveBeenCalledWith("event-acknowledged", expect.any(Object));
    });

    it("18. Semantic: Valid model event with confidence -> accepted", async () => {
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
        violationCount: 1,
        terminated: false,
      });

      await gateway.handleProctoringEvent({
        type: ViolationType.MULTIPLE_FACES,
        clientOccurredAt: new Date().toISOString(),
        confidence: 0.94,
      }, socket as Socket);

      expect(mockProctoringService.recordViolation).toHaveBeenCalledWith(
        attemptId,
        validUserId,
        validExamId,
        ViolationType.MULTIPLE_FACES,
        "",
        expect.objectContaining({ confidence: 0.94 })
      );
    });

    it("19. Database failure -> safe acknowledgement, socket remains stable and not disconnected", async () => {
      const attemptId = new Types.ObjectId().toString();
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = attemptId;
      socket.data.examId = validExamId;

      mockAttemptsService.findById.mockResolvedValue({
        _id: new Types.ObjectId(attemptId),
        status: AttemptStatus.IN_PROGRESS,
      });

      mockProctoringService.recordViolation.mockRejectedValue(new Error("Mongo connection timeout password=root"));

      await gateway.handleProctoringEvent({
        type: ViolationType.TAB_SWITCH,
        clientOccurredAt: new Date().toISOString(),
      }, socket as Socket);

      expect(socket.emit).toHaveBeenCalledWith("error", { message: "Failed to process event" });
      expect(socket.disconnect).not.toHaveBeenCalled();
    });

    it("20. Automatic termination ABSENT in Phase 2B -> does NOT disconnect socket or emit attempt-terminated even if service returns terminated: true", async () => {
      const attemptId = new Types.ObjectId().toString();
      const socket = createMockSocket();
      socket.data.user = { id: validUserId };
      socket.data.attemptId = attemptId;
      socket.data.examId = validExamId;

      mockAttemptsService.findById.mockResolvedValue({
        _id: new Types.ObjectId(attemptId),
        status: AttemptStatus.IN_PROGRESS,
      });

      // Even if underlying service marks terminated
      mockProctoringService.recordViolation.mockResolvedValue({
        violation: {},
        violationCount: 3,
        terminated: true,
      });

      await gateway.handleProctoringEvent({
        type: ViolationType.TAB_SWITCH,
        clientOccurredAt: new Date().toISOString(),
      }, socket as Socket);

      // Phase 2B MUST NOT emit attempt-terminated
      expect(socket.emit).not.toHaveBeenCalledWith("attempt-terminated", expect.anything());
      // Phase 2B MUST NOT disconnect legitimate socket
      expect(socket.disconnect).not.toHaveBeenCalled();
      // Emits standard event acknowledgement
      expect(socket.emit).toHaveBeenCalledWith("event-acknowledged", {
        message: "Event recorded successfully",
      });
    });
  });
});
