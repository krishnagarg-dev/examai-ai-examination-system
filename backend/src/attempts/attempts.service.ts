import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Attempt,
  AttemptDocument,
  AttemptStatus,
} from './schemas/attempt.schema';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectModel(Attempt.name)
    private readonly attemptModel: Model<AttemptDocument>,
  ) {}

  async start(studentId: string, examId: string) {
    if (
      !Types.ObjectId.isValid(studentId) ||
      !Types.ObjectId.isValid(examId)
    ) {
      throw new BadRequestException('Invalid student or exam ID');
    }

    const existingAttempt = await this.attemptModel.findOne({
      studentId: new Types.ObjectId(studentId),
      examId: new Types.ObjectId(examId),
      status: AttemptStatus.IN_PROGRESS,
    });

    if (existingAttempt) {
      return existingAttempt;
    }

    return this.attemptModel.create({
      studentId: new Types.ObjectId(studentId),
      examId: new Types.ObjectId(examId),
      status: AttemptStatus.IN_PROGRESS,
      startedAt: new Date(),
    });
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid attempt ID');
    }

    const attempt = await this.attemptModel.findById(id);

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    return attempt;
  }

  async terminate(id: string, reason: string) {
    const attempt = await this.findById(id);

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      return attempt;
    }

    attempt.status = AttemptStatus.TERMINATED;
    attempt.terminatedAt = new Date();
    attempt.terminationReason =
      reason || 'Proctoring violation';

    return attempt.save();
  }

  async submit(id: string, score = 0) {
    const attempt = await this.findById(id);

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      return attempt;
    }

    attempt.status = AttemptStatus.SUBMITTED;
    attempt.submittedAt = new Date();
    attempt.score = Number(score) || 0;

    return attempt.save();
  }

  async incrementViolation(id: string) {
    const attempt = await this.findById(id);

    attempt.violationCount += 1;

    return attempt.save();
  }
}