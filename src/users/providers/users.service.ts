import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dto/create.dto';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async createUser(dto: CreateDto) {
    const hashedPassword = await this.hashPassword(dto.password);
    const result = await this.repository.createUser({
      username: dto.username,
      email: dto.email,
      homePage: dto.homePage,
      password: hashedPassword,
    });
    return result;
  }

  async getByUsername(username: string) {
    return this.repository.getUser(username);
  }

  async comparePasswords(username, password) {
    const user = await this.repository.getUser(username);
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (passwordValid) return user;
  }

  private async hashPassword(password) {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
