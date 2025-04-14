import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ProgressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  audiobookId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  positionSec: number;
}
