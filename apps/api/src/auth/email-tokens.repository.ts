import { Injectable } from '@nestjs/common';
import { EmailToken, TipoEmailToken } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    userId: string,
    token: string,
    tipo: TipoEmailToken,
    expiresAt: Date,
  ): Promise<EmailToken> {
    return this.prisma.emailToken.create({
      data: { userId, token, tipo, expiresAt },
    });
  }

  findByToken(token: string): Promise<EmailToken | null> {
    return this.prisma.emailToken.findUnique({ where: { token } });
  }

  markUsed(id: string): Promise<EmailToken> {
    return this.prisma.emailToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  deleteByUserAndTipo(userId: string, tipo: TipoEmailToken): Promise<void> {
    return this.prisma.emailToken
      .deleteMany({ where: { userId, tipo } })
      .then(() => undefined);
  }
}
