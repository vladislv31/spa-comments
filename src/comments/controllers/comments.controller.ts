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
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from '../providers/comments.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/utils/file-upload.utils';
import { SharpPipe } from 'src/pipes/image-processing.pipe';
import { CreateDto } from '../dto/create.dto';
import { GetAllDto } from '../dto/getAll.dto';
import { ValidateFileNamePipe } from 'src/pipes/file-name-validate.pipe';
import { SanitizeHtmlPipe } from 'src/pipes/html-sanitize.pipe';
import { NotificationsGateway } from 'src/gateways/notifications.gateway';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

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
    @Body(new ValidationPipe(), new SanitizeHtmlPipe()) dto: CreateDto,
  ) {
    // TODO: create middleware for recaptcha
    const recaptchaToken = dto.recaptchaToken;

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe&response=${recaptchaToken}`;

    const response = await fetch(verificationUrl, {
      method: 'POST',
    });

    const data = await response.json();

    if (!data.success) {
      throw new HttpException(
        'reCAPTCHA verification failed',
        HttpStatus.FORBIDDEN,
      );
    }

    const result = await this.commentsService.create({
      body: dto.body,
      parentId: +dto.parentId,
      authorId: request.user.id,
      file: {
        path: file?.path,
        name: file?.originalname,
        type: file?.mimetype,
      },
    });

    if (
      result.parent &&
      result.parent.author.username !== request.user.username
    ) {
      this.notificationsGateway.sendNotification(
        result.parent.author.username,
        'You have an reply on your comment.',
      );
    }

    return result;
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
