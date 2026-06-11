import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindPrestadoresQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  rubroId?: string;

  @IsOptional()
  @IsUUID()
  subrubroId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  zona?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
