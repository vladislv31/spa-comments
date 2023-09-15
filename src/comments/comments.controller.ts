import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Req,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { SharpPipe } from 'src/pipes/image-processing.pipe';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  @Post('/create')
  async create(@UploadedFile(SharpPipe) file, @Req() request) {
    console.log('=====', file);
    return this.commentsService.create({
      body: request.body.body,
      parentId: request.body.parentId,
      authorId: request.user.id,
      file: {
        path: file?.path,
        name: file?.originalname,
        type: file?.mimetype,
      },
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getAll')
  getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.commentsService.getAll({
      sortBy,
      sortOrder,
      page,
      perPage,
    });
  }

  @Get('/uploads/:imagename')
  getImage(@Param('imagename') image, @Res() res) {
    const response = res.sendFile(image, { root: './uploads' });
    return {
      status: HttpStatus.OK,
      data: response,
    };
  }
}
