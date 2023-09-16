import { Module } from '@nestjs/common';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './providers/comments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentsRepository } from './repositories/comments.repository';
import { CacheService } from './providers/cache.service';
import { CommentCreatedHandler } from './handelrs/comment-created.handlers';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [PrismaModule, CqrsModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CacheService,
    CommentCreatedHandler,
    CommentsRepository,
  ],
})
export class CommentsModule {}
