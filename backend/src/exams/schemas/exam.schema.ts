import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ExamDocument = HydratedDocument<Exam>;

export enum ExamStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  LIVE = "live",
  COMPLETED = "completed",
}

@Schema({ timestamps: true })
export class Exam {
  @Prop({
    required: true,
    trim: true,
  })
  title!: string;

  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  code!: string;

  @Prop({
    required: true,
    trim: true,
  })
  subject!: string;

  @Prop({
    trim: true,
  })
  description?: string;

  @Prop({
    required: true,
    min: 1,
  })
  duration!: number;

  @Prop({
    required: true,
    min: 1,
  })
  totalMarks!: number;

  @Prop({
    required: true,
  })
  startTime!: Date;

  @Prop({
    required: true,
  })
  endTime!: Date;

  @Prop({
    type: String,
    enum: Object.values(ExamStatus),
    default: ExamStatus.DRAFT,
  })
  status!: ExamStatus;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  createdBy!: Types.ObjectId;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);