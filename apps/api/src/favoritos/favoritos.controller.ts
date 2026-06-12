import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  PaginatedResult,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { PrestadorConRating } from '../prestadores/prestadores.repository';
import { FavoritosService } from './favoritos.service';

@ApiTags('favoritos')
@Controller('favoritos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Get()
  @ApiOperation({ summary: 'Ids de prestadores favoritos del usuario actual' })
  listar(@CurrentUser() user: AuthenticatedUser): Promise<string[]> {
    return this.favoritosService.listarIds(user.id);
  }

  @Get('prestadores')
  @ApiOperation({
    summary: 'Prestadores favoritos del usuario actual, completos y paginados',
  })
  listarPrestadores(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<PrestadorConRating>> {
    return this.favoritosService.listarPrestadores(
      user.id,
      query.page,
      query.limit,
    );
  }

  @Post(':prestadorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Marcar un prestador como favorito (idempotente)' })
  agregar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
  ): Promise<void> {
    return this.favoritosService.agregar(user.id, prestadorId);
  }

  @Delete(':prestadorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Quitar un prestador de favoritos (idempotente)' })
  quitar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
  ): Promise<void> {
    return this.favoritosService.quitar(user.id, prestadorId);
  }
}
