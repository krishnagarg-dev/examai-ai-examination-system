import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Proctoring,
  ProctoringDocument,
  ViolationType,
} from './schemas/proctoring.schema';


import { AttemptsService } from '../attempts/attempts.service';

@Injectable()
export class ProctoringService {
  constructor(
    @InjectModel(Proctoring.name)
    private readonly proctoringModel: Model<ProctoringDocument>,

    private readonly attemptsService: AttemptsService,
  ) {}

  async recordViolation(
    attemptId: string,
    studentId: string,
    examId: string,
    violationType: ViolationType,
    description = '',
    metadata: Record<string, unknown> = {},
  ) {
    if (
      !Types.ObjectId.isValid(attemptId) ||
      !Types.ObjectId.isValid(studentId) ||
      !Types.ObjectId.isValid(examId)
    ) {
      throw new BadRequestException('Invalid ID');
    }

    const violation =
      await this.proctoringModel.create({
        attemptId: new Types.ObjectId(attemptId),
        studentId: new Types.ObjectId(studentId),
        examId: new Types.ObjectId(examId),
        violationType,
        description,
        metadata,
        occurredAt: new Date(),
      });

    const attempt =
      await this.attemptsService.incrementViolation(
        attemptId,
      );

    if (attempt.violationCount >= 3) {
      await this.attemptsService.terminate(
        attemptId,
        `Maximum proctoring violations reached`,
      );
    }

    return {
      violation,
      violationCount: attempt.violationCount,
      terminated: attempt.violationCount >= 3,
    };
  }

  async getAttemptViolations(attemptId: string) {
    if (!Types.ObjectId.isValid(attemptId)) {
      throw new BadRequestException('Invalid attempt ID');
    }

    return this.proctoringModel
      .find({
        attemptId: new Types.ObjectId(attemptId),
      })
      .sort({ occurredAt: 1 });
  }
}