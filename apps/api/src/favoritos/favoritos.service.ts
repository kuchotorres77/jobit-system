import { Injectable, Logger } from '@nestjs/common';
import { PaginatedResult } from '../common/dto/pagination-query.dto';
import { PrestadorNoEncontradoException } from '../common/exceptions/domain.exception';
import {
  PrestadorConRating,
  PrestadoresRepository,
} from '../prestadores/prestadores.repository';
import { FavoritosRepository } from './favoritos.repository';

@Injectable()
export class FavoritosService {
  private readonly logger = new Logger(FavoritosService.name);

  constructor(
    private readonly favoritosRepository: FavoritosRepository,
    private readonly prestadoresRepository: PrestadoresRepository,
  ) {}

  listarIds(userId: string): Promise<string[]> {
    this.logger.debug(`listarIds: usuario ${userId}`);
    return this.favoritosRepository.idsDeUsuario(userId);
  }

  async listarPrestadores(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PrestadorConRating>> {
    this.logger.debug(`listarPrestadores: usuario ${userId} page=${page}`);

    const skip = (page - 1) * limit;
    const { prestadorIds, total } =
      await this.favoritosRepository.idsDeUsuarioPaginado(userId, skip, limit);
    const data = await this.prestadoresRepository.findManyPorIds(prestadorIds);

    return {
      data,
      meta: { total, page, limit },
    };
  }

  async agregar(userId: string, prestadorId: string): Promise<void> {
    this.logger.debug(`agregar: prestador ${prestadorId} usuario ${userId}`);

    const prestador = await this.prestadoresRepository.findById(prestadorId);
    if (!prestador) {
      throw new PrestadorNoEncontradoException(prestadorId);
    }
    await this.favoritosRepository.agregar(userId, prestadorId);
  }

  async quitar(userId: string, prestadorId: string): Promise<void> {
    this.logger.debug(`quitar: prestador ${prestadorId} usuario ${userId}`);
    await this.favoritosRepository.quitar(userId, prestadorId);
  }
}
