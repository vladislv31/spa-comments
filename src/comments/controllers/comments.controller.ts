import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from '../providers/comments.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/utils/file-upload.utils';
import { SharpPipe } from 'src/pipes/image-processing.pipe';
import { CreateDto } from '../dto/create.dto';
import { GetAllDto } from '../dto/getAll.dto';
import { ValidateFileNamePipe } from 'src/pipes/file-name-validate.pipe';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
    }),
  )
  @Post('/create')
  async create(
    @UploadedFile(SharpPipe) file,
    @Request() request,
    @Body() dto: CreateDto,
  ) {
    return this.commentsService.create({
      body: dto.body,
      parentId: +dto.parentId,
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
  getAll(@Query(new ValidationPipe({ transform: true })) dto: GetAllDto) {
    return this.commentsService.getAll(dto);
  }

  @Get('/uploads/:filename')
  getFile(@Param('filename', new ValidateFileNamePipe()) file, @Res() res) {
    const response = res.sendFile(file, { root: './uploads' });
    return {
      status: HttpStatus.OK,
      data: response,
    };
  }
}
