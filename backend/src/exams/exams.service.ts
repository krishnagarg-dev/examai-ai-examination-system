import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Exam, ExamDocument } from "./schemas/exam.schema";

type CreateExamDto = {
  code: string;
  startTime: string | Date;
  endTime: string | Date;
  [key: string]: unknown;
};

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name)
    private readonly examModel: Model<ExamDocument>,
  ) {}

  async create(
    createExamDto: CreateExamDto,
    userId: string,
  ) {
    const normalizedCode = createExamDto.code
      .trim()
      .toUpperCase();

    const existingExam = await this.examModel.findOne({
      code: normalizedCode,
    });

    if (existingExam) {
      throw new BadRequestException(
        "An exam with this code already exists",
      );
    }

    const startTime = new Date(createExamDto.startTime);
    const endTime = new Date(createExamDto.endTime);

    if (
      Number.isNaN(startTime.getTime()) ||
      Number.isNaN(endTime.getTime())
    ) {
      throw new BadRequestException(
        "Invalid examination date or time",
      );
    }

    if (endTime <= startTime) {
      throw new BadRequestException(
        "End time must be after start time",
      );
    }

    const exam = new this.examModel({
      ...createExamDto,
      code: normalizedCode,
      startTime,
      endTime,
      createdBy: userId,
    });

    return exam.save();
  }

  async findAll(user: {
    id: string;
    role: string;
  }) {
    let filter: Record<string, unknown>;

    if (user.role === "admin") {
      // Admin can see all exams.
      filter = {};
    } else if (user.role === "student") {
      // Students can see scheduled and live exams.
      filter = {
        status: {
          $in: ["scheduled", "live"],
        },
      };
    } else {
      // Teachers can see only exams created by them.
      filter = {
        createdBy: user.id,
      };
    }

    return this.examModel
      .find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const exam = await this.examModel
      .findById(id)
      .populate("createdBy", "name email role")
      .exec();

    if (!exam) {
      throw new NotFoundException("Exam not found");
    }

    return exam;
  }
}