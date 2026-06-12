import { Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersRepository } from '../auth/users.repository';
import { PaginatedResult } from '../common/dto/pagination-query.dto';
import {
  OperacionNoPermitidaException,
  PerfilPrestadorExistenteException,
  PerfilPrestadorNoEncontradoException,
  PrestadorNoEncontradoException,
  SubrubroNoEncontradoException,
} from '../common/exceptions/domain.exception';
import { CreatePrestadorDto } from './dto/create-prestador.dto';
import { FindPrestadoresQueryDto } from './dto/find-prestadores-query.dto';
import { UpdatePrestadorDto } from './dto/update-prestador.dto';
import {
  PrestadorCompleto,
  PrestadorConRating,
  PrestadoresRepository,
} from './prestadores.repository';

@Injectable()
export class PrestadoresService {
  private readonly logger = new Logger(PrestadoresService.name);

  constructor(
    private readonly prestadoresRepository: PrestadoresRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

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

    const prestador = await this.prestadoresRepository.create(
      userId,
      dto.descripcion,
      dto.servicios,
    );
    await this.usersRepository.updateRole(userId, Role.PROVIDER);
    return prestador;
  }

  async findAll(
    query: FindPrestadoresQueryDto,
  ): Promise<PaginatedResult<PrestadorConRating>> {
    this.logger.debug(`findAll: page=${query.page} limit=${query.limit}`);

    const skip = (query.page - 1) * query.limit;
    const { data, total } = await this.prestadoresRepository.findMany(
      skip,
      query.limit,
      {
        rubroId: query.rubroId,
        subrubroId: query.subrubroId,
        zona: query.zona,
        q: query.q,
      },
    );

    return {
      data,
      meta: { total, page: query.page, limit: query.limit },
    };
  }

  async findByUser(userId: string): Promise<PrestadorCompleto> {
    this.logger.debug(`findByUser: ${userId}`);

    const prestador = await this.prestadoresRepository.findByUserId(userId);
    if (!prestador) {
      throw new PerfilPrestadorNoEncontradoException();
    }
    return prestador;
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
