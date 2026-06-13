import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class UpdateSubrubroDto {
  // Con id: renombra el subrubro existente; sin id: lo crea.
  // Los subrubros existentes que no estén en la lista se eliminan.
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;
}

export class UpdateRubroDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateSubrubroDto)
  subrubros?: UpdateSubrubroDto[];
}
