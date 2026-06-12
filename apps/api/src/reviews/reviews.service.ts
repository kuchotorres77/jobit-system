import { Injectable, Logger } from '@nestjs/common';
import {
  NoPuedeOpinarSobreSiMismoException,
  PrestadorNoEncontradoException,
  ReviewNoEncontradaException,
} from '../common/exceptions/domain.exception';
import { PaginatedResult } from '../common/dto/pagination-query.dto';
import { PrestadoresRepository } from '../prestadores/prestadores.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import {
  ReviewCompleta,
  ReviewsRepository,
  ReviewsResumen,
} from './reviews.repository';

export interface ReviewsListado extends PaginatedResult<ReviewCompleta> {
  resumen: ReviewsResumen;
}

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly prestadoresRepository: PrestadoresRepository,
  ) {}

  async opinar(
    prestadorId: string,
    userId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewCompleta> {
    this.logger.debug(`opinar: prestador ${prestadorId} por usuario ${userId}`);

    const prestador = await this.prestadoresRepository.findById(prestadorId);
    if (!prestador) {
      throw new PrestadorNoEncontradoException(prestadorId);
    }
    if (prestador.userId === userId) {
      throw new NoPuedeOpinarSobreSiMismoException();
    }

    return this.reviewsRepository.upsert(
      prestadorId,
      userId,
      dto.puntaje,
      dto.comentario,
    );
  }

  async listar(
    prestadorId: string,
    page: number,
    limit: number,
  ): Promise<ReviewsListado> {
    this.logger.debug(`listar: prestador ${prestadorId} page=${page}`);

    const prestador = await this.prestadoresRepository.findById(prestadorId);
    if (!prestador) {
      throw new PrestadorNoEncontradoException(prestadorId);
    }

    const skip = (page - 1) * limit;
    const [{ data, total }, resumen] = await Promise.all([
      this.reviewsRepository.findByPrestador(prestadorId, skip, limit),
      this.reviewsRepository.resumen(prestadorId),
    ]);

    return {
      data,
      meta: { total, page, limit },
      resumen,
    };
  }

  async propia(prestadorId: string, userId: string): Promise<ReviewCompleta> {
    this.logger.debug(`propia: prestador ${prestadorId} usuario ${userId}`);

    const review = await this.reviewsRepository.findPropia(prestadorId, userId);
    if (!review) {
      throw new ReviewNoEncontradaException();
    }
    return review;
  }

  async eliminarPropia(prestadorId: string, userId: string): Promise<void> {
    this.logger.debug(
      `eliminarPropia: prestador ${prestadorId} usuario ${userId}`,
    );

    const eliminada = await this.reviewsRepository.deletePropia(
      prestadorId,
      userId,
    );
    if (!eliminada) {
      throw new ReviewNoEncontradaException();
    }
  }
}
