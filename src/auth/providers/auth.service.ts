import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const comparePasswords = await this.usersService.comparePasswords(
      username,
      password,
    );
    if (comparePasswords) {
      return comparePasswords;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, id: user.id };
    return {
      username: user.username,
      access_token: this.jwtService.sign(payload),
    };
  }
}
