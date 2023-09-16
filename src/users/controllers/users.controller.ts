import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../providers/users.service';
import { CreateDto } from '../dto/create.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post('/signup')
  async createUser(@Body() dto: CreateDto) {
    return this.usersService.createUser(dto);
  }
}
