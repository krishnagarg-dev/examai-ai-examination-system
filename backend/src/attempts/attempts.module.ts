import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';
import {
  Attempt,
  AttemptSchema,
} from './schemas/attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Attempt.name,
        schema: AttemptSchema,
      },
    ]),
  ],
  controllers: [AttemptsController],
  providers: [AttemptsService],
  exports: [AttemptsService],
})
export class AttemptsModule {}