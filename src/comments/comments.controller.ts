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
  Param,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utils/file-upload.utils';
import { SharpPipe } from 'src/pipes/image-processing.pipe';
import { CreateDto } from './dto/create.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
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
