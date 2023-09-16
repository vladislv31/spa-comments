import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDto {
  @MinLength(3, { message: 'Username min length - 3 symbols.' })
  @MaxLength(30, { message: 'Username max length - 30 symbols.' })
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(3, { message: 'Username min length - 3 symbols.' })
  @MaxLength(150, { message: 'Username max length - 150 symbols.' })
  homePage: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
