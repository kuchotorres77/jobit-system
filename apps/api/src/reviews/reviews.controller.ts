import {
  Body,
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
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewCompleta } from './reviews.repository';
import { ReviewsListado, ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('prestadores/:prestadorId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Listar opiniones de un prestador con resumen de calificaciones',
  })
  listar(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
    @Query() query: PaginationQueryDto,
    @CurrentUser() user?: AuthenticatedUser,
  ): Promise<ReviewsListado> {
    return this.reviewsService.listar(
      prestadorId,
      query.page,
      query.limit,
      user?.id,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear o reemplazar la opinión propia sobre un prestador',
  })
  opinar(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewCompleta> {
    return this.reviewsService.opinar(prestadorId, user.id, dto);
  }

  @Get('mia')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener la opinión propia (404 si no existe)' })
  propia(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReviewCompleta> {
    return this.reviewsService.propia(prestadorId, user.id);
  }

  @Delete('mia')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar la opinión propia' })
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.reviewsService.eliminarPropia(prestadorId, user.id);
  }

  @Post(':reviewId/votos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar o desmarcar una opinión como útil (toggle)' })
  votar(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ votos: number; miVoto: boolean }> {
    return this.reviewsService.votar(prestadorId, reviewId, user.id);
  }
}
