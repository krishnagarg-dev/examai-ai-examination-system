import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";

import { ExamsService } from "./exams.service";
import { CreateExamDto } from "./dto/create-exam.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("exams")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService,
  ) {}

  @Post()
  @Roles("admin", "teacher")
  create(
    @Body() createExamDto: CreateExamDto,
    @CurrentUser() user: any,
  ) {
    return this.examsService.create(
      createExamDto,
      user.id,
    );
  }

  @Get()
  @Roles("admin", "teacher")
  findAll(@CurrentUser() user: any) {
    return this.examsService.findAll(user);
  }

  @Get(":id")
  @Roles("admin", "teacher")
  findOne(@Param("id") id: string) {
    return this.examsService.findOne(id);
  }
}