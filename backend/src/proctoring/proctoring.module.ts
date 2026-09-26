import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProctoringService } from './proctoring.service';
import { ProctoringGateway } from './proctoring.gateway';
import { Proctoring, ProctoringSchema } from './schemas/proctoring.schema';

import { AttemptsModule } from '../attempts/attempts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AttemptsModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Proctoring.name,
        schema: ProctoringSchema,
      },
    ]),
  ],
  providers: [ProctoringService, ProctoringGateway],
  exports: [ProctoringService],
})
export class ProctoringModule {}
