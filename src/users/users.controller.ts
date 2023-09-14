import * as bcrypt from 'bcrypt';
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('homePage') homePage: string,
    @Body('password') password: string,
  ) {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    console.log({ password, salt });
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await this.usersService.createUser({
      username,
      email,
      homePage,
      password: hashedPassword,
    });
    return result;
  }
}
