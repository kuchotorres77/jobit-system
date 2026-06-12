import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  // Calificación de 1 a 5 estrellas
  @IsInt()
  @Min(1)
  @Max(5)
  puntaje!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  comentario?: string;
}
