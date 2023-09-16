import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDto } from '../dto/create.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser({ username, email, homePage, password }: CreateDto) {
    try {
      return await this.prisma.user.create({
        data: {
          username,
          email,
          homePage,
          password,
        },
        select: {
          id: true,
          username: true,
          email: true,
          homePage: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === 'P2002' &&
          typeof error.meta?.target[0] === 'string'
        ) {
          if (error.meta?.target[0].includes('username')) {
            throw new ConflictException('Username already exists');
          }
          if (error.meta?.target[0].includes('email')) {
            throw new ConflictException('Email already exists');
          }
        }
      }

      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  async getUser(username: string) {
    try {
      return this.prisma.user.findFirst({
        where: {
          username,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }
}
