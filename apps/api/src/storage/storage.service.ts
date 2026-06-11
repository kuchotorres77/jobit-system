import { Injectable, Logger } from '@nestjs/common';
import { StorageFile } from '@prisma/client';
import { StorageRepository } from './storage.repository';

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
}
