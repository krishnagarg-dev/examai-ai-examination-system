import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProctoringService } from './proctoring.service';
import {
  Proctoring,
  ProctoringSchema,
} from './schemas/proctoring.schema';

import { AttemptsModule } from '../attempts/attempts.module';

@Module({
  imports: [
    AttemptsModule,
    MongooseModule.forFeature([
      {
        name: Proctoring.name,
        schema: ProctoringSchema,
      },
    ]),
  ],
  providers: [ProctoringService],
  exports: [ProctoringService],
})
export class ProctoringModule {}