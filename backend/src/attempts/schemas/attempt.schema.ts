import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AttemptDocument = HydratedDocument<Attempt>;

export enum AttemptStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  TERMINATED = 'terminated',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Attempt {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  studentId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Exam',
    required: true,
  })
  examId!: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(AttemptStatus),
    default: AttemptStatus.IN_PROGRESS,
  })
  status!: AttemptStatus;

  @Prop({
    type: Date,
    default: null,
  })
  startedAt!: Date | null;

  @Prop({
    type: Date,
    default: null,
  })
  submittedAt!: Date | null;

  @Prop({
    type: Date,
    default: null,
  })
  terminatedAt!: Date | null;

  @Prop({
    type: String,
    default: null,
  })
  terminationReason!: string | null;

  @Prop({
    type: Number,
    default: 0,
  })
  violationCount!: number;

  @Prop({
    type: Number,
    default: 0,
  })
  score!: number;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);