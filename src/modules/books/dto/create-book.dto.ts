import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  authorId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  publishDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverUrl?: string;
}
