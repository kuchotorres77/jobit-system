import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const reviewInclude = {
  user: {
    select: { id: true, nombre: true, apellido: true },
  },
} satisfies Prisma.ReviewInclude;

export type ReviewCompleta = Prisma.ReviewGetPayload<{
  include: typeof reviewInclude;
}>;

export interface ReviewsResumen {
  promedio: number;
  total: number;
  distribucion: Record<number, number>;
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
      include: reviewInclude,
    });
  }

  async findByPrestador(
    prestadorId: string,
    skip: number,
    take: number,
  ): Promise<{ data: ReviewCompleta[]; total: number }> {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where: { prestadorId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: reviewInclude,
      }),
      this.prisma.review.count({ where: { prestadorId } }),
    ]);
    return { data, total };
  }

  findPropia(
    prestadorId: string,
    userId: string,
  ): Promise<ReviewCompleta | null> {
    return this.prisma.review.findUnique({
      where: { prestadorId_userId: { prestadorId, userId } },
      include: reviewInclude,
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
}
