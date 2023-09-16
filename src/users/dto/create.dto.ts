import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDto {
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain letters and numbers.',
  })
  @MinLength(3, { message: 'Username min length - 3 symbols.' })
  @MaxLength(30, { message: 'Username max length - 30 symbols.' })
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  @MinLength(3, { message: 'Home page min length - 3 symbols.' })
  @MaxLength(150, { message: 'Home page max length - 150 symbols.' })
  homePage: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must contain letters, numbers, and at least one special character (@, $, !, %, *, ?, &)',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;
}
