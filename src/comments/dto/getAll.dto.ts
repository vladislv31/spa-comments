import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetAllDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(5)
  @Max(50)
  perPage: number;

  @IsOptional()
  @IsIn(['username', 'email', 'createdAt'])
  sortBy: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: string;
}
