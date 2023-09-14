import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser({
    username,
    email,
    homePage,
    password,
  }: {
    username: string;
    email: string;
    homePage: string;
    password: string;
  }) {
    return this.prisma.user.create({
      data: {
        username,
        email,
        homePage,
        password,
      },
    });
  }

  async getUser(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }
}
