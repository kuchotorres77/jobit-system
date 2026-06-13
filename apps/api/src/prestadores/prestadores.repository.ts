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
      contactos: {
        where: { activo: true },
        select: { id: true, tipo: true, valor: true },
      },
      archivos: {
        select: { id: true, fileName: true, createdAt: true },
        orderBy: { createdAt: 'asc' as const },
      },
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

export interface PrestadorRating {
  promedio: number;
  total: number;
}

export type PrestadorConRating = PrestadorCompleto & {
  rating: PrestadorRating;
};

export interface PrestadorFilters {
  rubroId?: string;
  subrubroId?: string;
  zona?: string;
  q?: string;
}

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
    filters: PrestadorFilters = {},
  ): Promise<{ data: PrestadorConRating[]; total: number }> {
    const where = this.buildWhere(filters);
    if (filters.q) {
      where.id = { in: await this.findIdsPorTexto(filters.q) };
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.prestador.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
        include: prestadorInclude,
      }),
      this.prisma.prestador.count({ where }),
    ]);
    return { data: await this.adjuntarRatings(data), total };
  }

  // Calificación promedio de la página en una sola consulta agregada
  private async adjuntarRatings(
    prestadores: PrestadorCompleto[],
  ): Promise<PrestadorConRating[]> {
    if (prestadores.length === 0) {
      return [];
    }

    const grupos = await this.prisma.review.groupBy({
      by: ['prestadorId'],
      where: { prestadorId: { in: prestadores.map((p) => p.id) } },
      _avg: { puntaje: true },
      _count: { puntaje: true },
    });
    const porPrestador = new Map(grupos.map((g) => [g.prestadorId, g]));

    return prestadores.map((prestador) => {
      const grupo = porPrestador.get(prestador.id);
      return {
        ...prestador,
        rating: {
          promedio: grupo
            ? Math.round((grupo._avg.puntaje ?? 0) * 10) / 10
            : 0,
          total: grupo?._count.puntaje ?? 0,
        },
      };
    });
  }

  private buildWhere(filters: PrestadorFilters): Prisma.PrestadorWhereInput {
    const where: Prisma.PrestadorWhereInput = {};

    const servicioFilter: Prisma.ServicioWhereInput = {};
    if (filters.subrubroId) {
      servicioFilter.subrubroId = filters.subrubroId;
    }
    if (filters.rubroId) {
      servicioFilter.subrubro = { rubroId: filters.rubroId };
    }
    if (filters.zona) {
      servicioFilter.zonaCobertura = { has: filters.zona };
    }
    if (Object.keys(servicioFilter).length > 0) {
      where.servicios = { some: servicioFilter };
    }

    return where;
  }

  // Búsqueda insensible a mayúsculas y tildes (extensión unaccent de Postgres),
  // fuera del where de Prisma porque su API no soporta unaccent.
  // Cubre: nombre, apellido, descripción, rubro, subrubro y zona de cobertura.
  private async findIdsPorTexto(q: string): Promise<string[]> {
    const patron = `%${q.replace(/[\\%_]/g, '\\$&')}%`;
    const rows = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT DISTINCT p.id
      FROM prestadores p
      JOIN users u ON u.id = p."userId"
      LEFT JOIN servicios s ON s."prestadorId" = p.id
      LEFT JOIN subrubros sr ON sr.id = s."subrubroId"
      LEFT JOIN rubros r ON r.id = sr."rubroId"
      WHERE unaccent(coalesce(p.descripcion, '')) ILIKE unaccent(${patron})
         OR unaccent(u.nombre)    ILIKE unaccent(${patron})
         OR unaccent(u.apellido)  ILIKE unaccent(${patron})
         OR unaccent(coalesce(sr.nombre, '')) ILIKE unaccent(${patron})
         OR unaccent(coalesce(r.nombre,  '')) ILIKE unaccent(${patron})
         OR array_to_string(s."zonaCobertura", ',') ILIKE ${patron}
    `;
    return rows.map((row) => row.id);
  }

  findById(id: string): Promise<PrestadorCompleto | null> {
    return this.prisma.prestador.findUnique({
      where: { id },
      include: prestadorInclude,
    });
  }

  // Devuelve los prestadores respetando el orden de los ids recibidos
  async findManyPorIds(ids: string[]): Promise<PrestadorConRating[]> {
    if (ids.length === 0) {
      return [];
    }
    const data = await this.prisma.prestador.findMany({
      where: { id: { in: ids } },
      include: prestadorInclude,
    });
    const conRating = await this.adjuntarRatings(data);
    const porId = new Map(conRating.map((p) => [p.id, p]));
    return ids
      .map((id) => porId.get(id))
      .filter((p): p is PrestadorConRating => p !== undefined);
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
