import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubrubroDto } from './dto/create-rubro.dto';
import { UpdateSubrubroDto } from './dto/update-rubro.dto';

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

  // Reemplazo completo: renombra los subrubros con id, crea los nuevos
  // y elimina los existentes que no vienen en la lista
  update(
    id: string,
    nombre: string | undefined,
    subrubros: UpdateSubrubroDto[] | undefined,
  ): Promise<RubroCompleto> {
    return this.prisma.$transaction(async (tx) => {
      await tx.rubro.update({ where: { id }, data: { nombre } });

      if (subrubros) {
        const idsConservados = subrubros
          .filter((s) => s.id !== undefined)
          .map((s) => s.id as string);

        await tx.subrubro.deleteMany({
          where: { rubroId: id, id: { notIn: idsConservados } },
        });
        for (const subrubro of subrubros) {
          if (subrubro.id) {
            await tx.subrubro.update({
              where: { id: subrubro.id },
              data: { nombre: subrubro.nombre },
            });
          } else {
            await tx.subrubro.create({
              data: { rubroId: id, nombre: subrubro.nombre },
            });
          }
        }
      }

      return tx.rubro.findUniqueOrThrow({
        where: { id },
        include: rubroInclude,
      });
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.rubro.delete({ where: { id } });
  }
}
