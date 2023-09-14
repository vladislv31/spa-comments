import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async create(
    @Request() req,
    @Body('body') body: string,
    @Body('parentId') parentId?: number,
  ) {
    return this.commentsService.create({
      body,
      parentId,
      authorId: req.user.id,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAll')
  getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
  ) {
    return this.commentsService.getAll({
      page,
      perPage,
    });
  }
}
