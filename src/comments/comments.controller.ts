import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  @UseGuards(AuthGuard('jwt'))
  @Get('/getAll')
  getAll() {
    return {
      comments: [
        {
          id: 1,
          user: {
            id: 1,
            username: 'test',
          },
          content: 'test',
        },
      ],
    };
  }
}
