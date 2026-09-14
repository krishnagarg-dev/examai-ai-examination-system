import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Get(':id')
  @Roles('admin')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles('admin')
  async create(@Body() body: any) {
    return this.usersService.create(body);
  }
}