import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeHtmlPipe implements PipeTransform {
  transform(value: any) {
    const clean = sanitizeHtml(value.body);

    if (typeof clean !== 'string') {
      throw new BadRequestException('Validation failed');
    }

    return { ...value, body: clean };
  }
}
