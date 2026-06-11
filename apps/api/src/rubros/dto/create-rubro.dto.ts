import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateSubrubroDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;
}

export class CreateRubroDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubrubroDto)
  subrubros?: CreateSubrubroDto[];
}
