import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const baseInclude = {
  user: {
    select: { id: true, nombre: true, apellido: true },
  },
  _count: { select: { votos: true } },
} satisfies Prisma.ReviewInclude;

export type ReviewCompleta = Prisma.ReviewGetPayload<{
  include: typeof baseInclude;
}>;

export interface ReviewConVotos {
  id: string;
  prestadorId: string;
  userId: string;
  puntaje: number;
  comentario: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: { id: string; nombre: string; apellido: string };
  votos: number;
  miVoto: boolean;
}

export interface ReviewsResumen {
  promedio: number;
  total: number;
  distribucion: Record<number, number>;
}

function mapReview(
  r: ReviewCompleta & { votos?: { id: string }[] },
): ReviewConVotos {
  return {
    id: r.id,
    prestadorId: r.prestadorId,
    userId: r.userId,
    puntaje: r.puntaje,
    comentario: r.comentario,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    user: r.user,
    votos: r._count.votos,
    miVoto: (r.votos?.length ?? 0) > 0,
  };
}

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsert(
    prestadorId: string,
    userId: string,
    puntaje: number,
    comentario: string | undefined,
  ): Promise<ReviewCompleta> {
    return this.prisma.review.upsert({
      where: { prestadorId_userId: { prestadorId, userId } },
      create: { prestadorId, userId, puntaje, comentario },
      update: { puntaje, comentario: comentario ?? null },
      include: baseInclude,
    });
  }

  async findByPrestador(
    prestadorId: string,
    skip: number,
    take: number,
    userId?: string,
  ): Promise<{ data: ReviewConVotos[]; total: number }> {
    const include: Prisma.ReviewInclude = {
      ...baseInclude,
      votos: userId ? { where: { userId }, select: { id: true } } : false,
    };

    const [raw, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where: { prestadorId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include,
      }),
      this.prisma.review.count({ where: { prestadorId } }),
    ]);

    return {
      data: (raw as (ReviewCompleta & { votos?: { id: string }[] })[]).map(
        mapReview,
      ),
      total,
    };
  }

  findPropia(
    prestadorId: string,
    userId: string,
  ): Promise<ReviewCompleta | null> {
    return this.prisma.review.findUnique({
      where: { prestadorId_userId: { prestadorId, userId } },
      include: baseInclude,
    });
  }

  async deletePropia(prestadorId: string, userId: string): Promise<boolean> {
    const { count } = await this.prisma.review.deleteMany({
      where: { prestadorId, userId },
    });
    return count > 0;
  }

  async resumen(prestadorId: string): Promise<ReviewsResumen> {
    const grupos = await this.prisma.review.groupBy({
      by: ['puntaje'],
      where: { prestadorId },
      _count: { puntaje: true },
    });

    const distribucion: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    let suma = 0;
    for (const grupo of grupos) {
      distribucion[grupo.puntaje] = grupo._count.puntaje;
      total += grupo._count.puntaje;
      suma += grupo.puntaje * grupo._count.puntaje;
    }

    return {
      promedio: total > 0 ? Math.round((suma / total) * 10) / 10 : 0,
      total,
      distribucion,
    };
  }

  async toggleVoto(
    reviewId: string,
    userId: string,
  ): Promise<{ votos: number; miVoto: boolean }> {
    const existente = await this.prisma.voto.findUnique({
      where: { reviewId_userId: { reviewId, userId } },
    });

    if (existente) {
      await this.prisma.voto.delete({ where: { id: existente.id } });
    } else {
      await this.prisma.voto.create({ data: { reviewId, userId } });
    }

    const votos = await this.prisma.voto.count({ where: { reviewId } });
    return { votos, miVoto: !existente };
  }
}
