import { createReadStream, existsSync } from 'fs';
import { extname } from 'path';
import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { StorageFile } from '@prisma/client';
import { ArchivoNoEncontradoException } from '../common/exceptions/domain.exception';
import { StorageRepository } from './storage.repository';

const CONTENT_TYPE_POR_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly storageRepository: StorageRepository) {}

  registerUpload(
    userId: string,
    fileName: string,
    path: string,
  ): Promise<StorageFile> {
    this.logger.debug(`registerUpload: ${fileName} de usuario ${userId}`);
    return this.storageRepository.create(fileName, path, userId);
  }

  async getArchivo(id: string): Promise<StreamableFile> {
    this.logger.debug(`getArchivo: ${id}`);

    const archivo = await this.storageRepository.findById(id);
    if (!archivo || !existsSync(archivo.path)) {
      throw new ArchivoNoEncontradoException(id);
    }

    const contentType =
      CONTENT_TYPE_POR_EXTENSION[extname(archivo.fileName).toLowerCase()] ??
      'application/octet-stream';

    return new StreamableFile(createReadStream(archivo.path), {
      type: contentType,
    });
  }
}
