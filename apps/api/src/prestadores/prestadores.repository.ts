import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicioDto } from './dto/create-prestador.dto';

const prestadorInclude = {
  user: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      documento: true,
      email: true,
    },
  },
  servicios: {
    include: {
      subrubro: {
        include: {
          rubro: { select: { id: true, nombre: true } },
        },
      },
      disponibilidades: true,
    },
  },
} satisfies Prisma.PrestadorInclude;

export type PrestadorCompleto = Prisma.PrestadorGetPayload<{
  include: typeof prestadorInclude;
}>;

@Injectable()
export class PrestadoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    userId: string,
    descripcion: string | undefined,
    servicios: CreateServicioDto[],
  ): Promise<PrestadorCompleto> {
    return this.prisma.prestador.create({
      data: {
        userId,
        descripcion,
        servicios: { create: this.buildServiciosCreate(servicios) },
      },
      include: prestadorInclude,
    });
  }

  async findMany(
    skip: number,
    take: number,
  ): Promise<{ data: PrestadorCompleto[]; total: number }> {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.prestador.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: prestadorInclude,
      }),
      this.prisma.prestador.count(),
    ]);
    return { data, total };
  }

  findById(id: string): Promise<PrestadorCompleto | null> {
    return this.prisma.prestador.findUnique({
      where: { id },
      include: prestadorInclude,
    });
  }

  findByUserId(userId: string): Promise<PrestadorCompleto | null> {
    return this.prisma.prestador.findUnique({
      where: { userId },
      include: prestadorInclude,
    });
  }

  update(
    id: string,
    descripcion: string | undefined,
    servicios: CreateServicioDto[] | undefined,
  ): Promise<PrestadorCompleto> {
    return this.prisma.prestador.update({
      where: { id },
      data: {
        descripcion,
        servicios: servicios
          ? {
              deleteMany: {},
              create: this.buildServiciosCreate(servicios),
            }
          : undefined,
      },
      include: prestadorInclude,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prestador.delete({ where: { id } });
  }

  async subrubrosExisten(subrubroIds: string[]): Promise<boolean> {
    const uniqueIds = [...new Set(subrubroIds)];
    const count = await this.prisma.subrubro.count({
      where: { id: { in: uniqueIds } },
    });
    return count === uniqueIds.length;
  }

  private buildServiciosCreate(
    servicios: CreateServicioDto[],
  ): Prisma.ServicioCreateWithoutPrestadorInput[] {
    return servicios.map((servicio) => ({
      subrubro: { connect: { id: servicio.subrubroId } },
      zonaCobertura: servicio.zonaCobertura,
      disponibilidades: {
        create: servicio.disponibilidades.map((disponibilidad) => ({
          dias: disponibilidad.dias,
          desde: disponibilidad.desde,
          hasta: disponibilidad.hasta,
        })),
      },
    }));
  }
}
