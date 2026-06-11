import { Injectable, Logger } from '@nestjs/common';
import {
  RubroNoEncontradoException,
  RubroYaExisteException,
} from '../common/exceptions/domain.exception';
import { CreateRubroDto } from './dto/create-rubro.dto';
import { RubroCompleto, RubrosRepository } from './rubros.repository';

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
}
