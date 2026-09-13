import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Exam, ExamDocument } from "./schemas/exam.schema";
import { CreateExamDto } from "./dto/create-exam.dto";

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
    const existingExam = await this.examModel.findOne({
      code: createExamDto.code.toUpperCase(),
    });

    if (existingExam) {
      throw new BadRequestException(
        "An exam with this code already exists",
      );
    }

    const exam = new this.examModel({
      ...createExamDto,
      code: createExamDto.code.toUpperCase(),
      startTime: new Date(createExamDto.startTime),
      endTime: new Date(createExamDto.endTime),
      createdBy: userId,
    });

    return exam.save();
  }

  async findAll(user: {
    id: string;
    role: string;
  }) {
    const filter =
      user.role === "admin"
        ? {}
        : {
            createdBy: user.id,
          };

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