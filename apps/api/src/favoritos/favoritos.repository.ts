import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async idsDeUsuario(userId: string): Promise<string[]> {
    const favoritos = await this.prisma.favorito.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { prestadorId: true },
    });
    return favoritos.map((f) => f.prestadorId);
  }

  async idsDeUsuarioPaginado(
    userId: string,
    skip: number,
    take: number,
  ): Promise<{ prestadorIds: string[]; total: number }> {
    const [favoritos, total] = await this.prisma.$transaction([
      this.prisma.favorito.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: { prestadorId: true },
      }),
      this.prisma.favorito.count({ where: { userId } }),
    ]);
    return { prestadorIds: favoritos.map((f) => f.prestadorId), total };
  }

  async agregar(userId: string, prestadorId: string): Promise<void> {
    await this.prisma.favorito.upsert({
      where: { userId_prestadorId: { userId, prestadorId } },
      update: {},
      create: { userId, prestadorId },
    });
  }

  async quitar(userId: string, prestadorId: string): Promise<void> {
    await this.prisma.favorito.deleteMany({
      where: { userId, prestadorId },
    });
  }
}
