import { Injectable } from '@nestjs/common';
import { StorageFile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StorageRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    fileName: string,
    path: string,
    userId: string,
  ): Promise<StorageFile> {
    return this.prisma.storageFile.create({
      data: { fileName, path, userId },
    });
  }

  findById(id: string): Promise<StorageFile | null> {
    return this.prisma.storageFile.findUnique({ where: { id } });
  }
}
