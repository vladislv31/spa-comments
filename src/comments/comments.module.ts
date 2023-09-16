import { Module } from '@nestjs/common';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './providers/comments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
})
export class CommentsModule {}
