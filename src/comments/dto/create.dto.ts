import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsStringOrNumber } from 'src/utils/is-string-or-number.validator';

export class CreateDto {
  @IsString()
  @MinLength(5, { message: 'Comment body min length - 5 symbols.' })
  @MaxLength(500, { message: 'Comment body max length - 500 symbols.' })
  @Matches(/^((<(a|strong|i|code)[^>]*>.*?<\/(a|strong|i|code)>)|([^<>]*))*$/, {
    message: 'Invalid HTML tags. Allowed tags are <a>, <strong>, <i>, <code>',
  })
  body: string;

  @IsOptional()
  @IsStringOrNumber({ message: 'shit' })
  parentId?: number;

  recaptchaToken: string;
}
