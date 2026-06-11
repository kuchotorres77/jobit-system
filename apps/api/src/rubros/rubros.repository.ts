import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubrubroDto } from './dto/create-rubro.dto';

const rubroInclude = {
  subrubros: { orderBy: { nombre: 'asc' } },
} satisfies Prisma.RubroInclude;

export type RubroCompleto = Prisma.RubroGetPayload<{
  include: typeof rubroInclude;
}>;

@Injectable()
export class RubrosRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    nombre: string,
    subrubros: CreateSubrubroDto[],
  ): Promise<RubroCompleto> {
    return this.prisma.rubro.create({
      data: {
        nombre,
        subrubros: { create: subrubros.map((s) => ({ nombre: s.nombre })) },
      },
      include: rubroInclude,
    });
  }

  findAll(): Promise<RubroCompleto[]> {
    return this.prisma.rubro.findMany({
      orderBy: { nombre: 'asc' },
      include: rubroInclude,
    });
  }

  findById(id: string): Promise<RubroCompleto | null> {
    return this.prisma.rubro.findUnique({
      where: { id },
      include: rubroInclude,
    });
  }

  findByNombre(nombre: string): Promise<RubroCompleto | null> {
    return this.prisma.rubro.findUnique({
      where: { nombre },
      include: rubroInclude,
    });
  }
}
