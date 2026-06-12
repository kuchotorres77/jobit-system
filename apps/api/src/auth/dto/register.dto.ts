import { Sexo } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class RegisterDireccionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  calle!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigoPostal!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  provincia!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  localidad?: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  documento!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;

  @IsOptional()
  @IsEnum(Sexo)
  sexo?: Sexo;

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
