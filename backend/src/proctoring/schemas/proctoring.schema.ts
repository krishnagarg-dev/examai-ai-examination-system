import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProctoringDocument = HydratedDocument<Proctoring>;

export enum ViolationType {
  NO_FACE = 'NO_FACE',
  MULTIPLE_FACES = 'MULTIPLE_FACES',
  FACE_OBSTRUCTED = 'FACE_OBSTRUCTED',
  MOBILE_PHONE = 'MOBILE_PHONE',
  SUSPICIOUS_OBJECT = 'SUSPICIOUS_OBJECT',
  TAB_SWITCH = 'TAB_SWITCH',
  FULLSCREEN_EXIT = 'FULLSCREEN_EXIT',
}

@Schema({ timestamps: true })
export class Proctoring {
  @Prop({
    type: Types.ObjectId,
    ref: 'Attempt',
    required: true,
    index: true,
  })
  attemptId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  studentId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Exam',
    required: true,
    index: true,
  })
  examId!: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(ViolationType),
    required: true,
  })
  violationType!: ViolationType;

  @Prop({
    type: String,
    default: '',
  })
  description!: string;

  @Prop({
    type: Number,
    default: 1,
  })
  severity!: number;

  @Prop({
    type: Date,
    default: Date.now,
  })
  occurredAt!: Date;

  @Prop({
    type: Object,
    default: {},
  })
  metadata!: Record<string, unknown>;
}

export const ProctoringSchema =
  SchemaFactory.createForClass(Proctoring);