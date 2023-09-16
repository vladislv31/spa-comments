import { Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './controllers/users.controller';
import { JwtStrategy } from 'src/auth/jwt.auth';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [PrismaModule],
  providers: [UsersRepository, UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersRepository],
})
export class UsersModule {}
