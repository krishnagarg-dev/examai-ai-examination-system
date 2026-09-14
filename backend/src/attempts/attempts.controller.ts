import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AttemptsService } from './attempts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('attempts')
@UseGuards(JwtAuthGuard)
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('start')
  async start(
    @CurrentUser() user: any,
    @Body('examId') examId: string,
  ) {
    return this.attemptsService.start(user.id, examId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.attemptsService.findById(id);
  }

  @Post(':id/terminate')
  async terminate(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.attemptsService.terminate(
      id,
      reason || 'Proctoring violation',
    );
  }

  @Post(':id/submit')
  async submit(
    @Param('id') id: string,
    @Body('score') score?: number,
  ) {
    return this.attemptsService.submit(id, Number(score) || 0);
  }
}