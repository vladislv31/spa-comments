import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateFileNamePipe implements PipeTransform<string> {
  transform(value: string) {
    const isValid = /^[a-zA-Z0-9-_]+\.(jpg|jpeg|png|gif|txt)$/.test(value);
    if (!isValid) {
      throw new BadRequestException('Invalid file name');
    }
    return value;
  }
}
