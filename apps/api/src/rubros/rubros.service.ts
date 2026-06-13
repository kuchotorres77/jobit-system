import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  RubroEnUsoException,
  RubroNoEncontradoException,
  RubroYaExisteException,
} from '../common/exceptions/domain.exception';
import { CreateRubroDto } from './dto/create-rubro.dto';
import { UpdateRubroDto } from './dto/update-rubro.dto';
import { RubroCompleto, RubrosRepository } from './rubros.repository';

const FK_CONSTRAINT_ERROR = 'P2003';

function esErrorDeFk(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === FK_CONSTRAINT_ERROR
  );
}

@Injectable()
export class RubrosService {
  private readonly logger = new Logger(RubrosService.name);

  constructor(private readonly rubrosRepository: RubrosRepository) {}

  async create(dto: CreateRubroDto): Promise<RubroCompleto> {
    this.logger.debug(`create: ${dto.nombre}`);

    const existing = await this.rubrosRepository.findByNombre(dto.nombre);
    if (existing) {
      throw new RubroYaExisteException(dto.nombre);
    }

    return this.rubrosRepository.create(dto.nombre, dto.subrubros ?? []);
  }

  findAll(): Promise<RubroCompleto[]> {
    this.logger.debug('findAll');
    return this.rubrosRepository.findAll();
  }

  async findById(id: string): Promise<RubroCompleto> {
    this.logger.debug(`findById: ${id}`);

    const rubro = await this.rubrosRepository.findById(id);
    if (!rubro) {
      throw new RubroNoEncontradoException(id);
    }
    return rubro;
  }

  async update(id: string, dto: UpdateRubroDto): Promise<RubroCompleto> {
    this.logger.debug(`update: ${id}`);

    const rubro = await this.findById(id);

    if (dto.nombre && dto.nombre !== rubro.nombre) {
      const existente = await this.rubrosRepository.findByNombre(dto.nombre);
      if (existente) {
        throw new RubroYaExisteException(dto.nombre);
      }
    }

    try {
      return await this.rubrosRepository.update(id, dto.nombre, dto.subrubros);
    } catch (error) {
      // Restrict de FK: algún subrubro a eliminar tiene servicios asociados
      if (esErrorDeFk(error)) {
        throw new RubroEnUsoException();
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.debug(`remove: ${id}`);

    await this.findById(id);
    try {
      await this.rubrosRepository.delete(id);
    } catch (error) {
      if (esErrorDeFk(error)) {
        throw new RubroEnUsoException();
      }
      throw error;
    }
  }
}
