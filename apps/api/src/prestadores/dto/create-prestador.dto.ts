import { DiaSemana } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateDisponibilidadDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(DiaSemana, { each: true })
  dias!: DiaSemana[];

  @Matches(HORA_REGEX, { message: 'desde debe tener formato HH:mm' })
  desde!: string;

  @Matches(HORA_REGEX, { message: 'hasta debe tener formato HH:mm' })
  hasta!: string;
}

export class CreateServicioDto {
  @IsUUID()
  subrubroId!: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  zonaCobertura!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDisponibilidadDto)
  disponibilidades!: CreateDisponibilidadDto[];
}

export class CreatePrestadorDto {
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
