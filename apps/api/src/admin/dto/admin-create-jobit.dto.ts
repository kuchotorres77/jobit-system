import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { RegisterDto } from '../../auth/dto/register.dto';
import { CreateServicioDto } from '../../prestadores/dto/create-prestador.dto';

// Alta completa de un Jobit por el admin: usuario PROVIDER + perfil de prestador
export class AdminCreateJobitDto extends RegisterDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateServicioDto)
  servicios!: CreateServicioDto[];
}
