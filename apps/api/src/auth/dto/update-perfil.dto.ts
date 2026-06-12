import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { RegisterDireccionDto } from './register.dto';

export class UpdatePerfilDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  telefono?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterDireccionDto)
  direccion?: RegisterDireccionDto;
}
