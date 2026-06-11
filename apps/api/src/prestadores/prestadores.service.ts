import { Injectable, Logger } from '@nestjs/common';
import {
  PaginatedResult,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import {
  OperacionNoPermitidaException,
  PerfilPrestadorExistenteException,
  PrestadorNoEncontradoException,
  SubrubroNoEncontradoException,
} from '../common/exceptions/domain.exception';
import { CreatePrestadorDto } from './dto/create-prestador.dto';
import { UpdatePrestadorDto } from './dto/update-prestador.dto';
import {
  PrestadorCompleto,
  PrestadoresRepository,
} from './prestadores.repository';

@Injectable()
export class PrestadoresService {
  private readonly logger = new Logger(PrestadoresService.name);

  constructor(private readonly prestadoresRepository: PrestadoresRepository) {}

  async create(
    userId: string,
    dto: CreatePrestadorDto,
  ): Promise<PrestadorCompleto> {
    this.logger.debug(`create: usuario ${userId}`);

    const existing = await this.prestadoresRepository.findByUserId(userId);
    if (existing) {
      throw new PerfilPrestadorExistenteException();
    }

    await this.validarSubrubros(dto.servicios.map((s) => s.subrubroId));

    return this.prestadoresRepository.create(
      userId,
      dto.descripcion,
      dto.servicios,
    );
  }

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<PrestadorCompleto>> {
    this.logger.debug(
      `findAll: page=${pagination.page} limit=${pagination.limit}`,
    );

    const skip = (pagination.page - 1) * pagination.limit;
    const { data, total } = await this.prestadoresRepository.findMany(
      skip,
      pagination.limit,
    );

    return {
      data,
      meta: { total, page: pagination.page, limit: pagination.limit },
    };
  }

  async findById(id: string): Promise<PrestadorCompleto> {
    this.logger.debug(`findById: ${id}`);

    const prestador = await this.prestadoresRepository.findById(id);
    if (!prestador) {
      throw new PrestadorNoEncontradoException(id);
    }
    return prestador;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdatePrestadorDto,
  ): Promise<PrestadorCompleto> {
    this.logger.debug(`update: ${id} por usuario ${userId}`);

    const prestador = await this.findById(id);
    if (prestador.userId !== userId) {
      throw new OperacionNoPermitidaException();
    }

    if (dto.servicios) {
      await this.validarSubrubros(dto.servicios.map((s) => s.subrubroId));
    }

    return this.prestadoresRepository.update(id, dto.descripcion, dto.servicios);
  }

  async remove(id: string, userId: string): Promise<void> {
    this.logger.debug(`remove: ${id} por usuario ${userId}`);

    const prestador = await this.findById(id);
    if (prestador.userId !== userId) {
      throw new OperacionNoPermitidaException();
    }

    await this.prestadoresRepository.delete(id);
  }

  private async validarSubrubros(subrubroIds: string[]): Promise<void> {
    const existen =
      await this.prestadoresRepository.subrubrosExisten(subrubroIds);
    if (!existen) {
      throw new SubrubroNoEncontradoException();
    }
  }
}
