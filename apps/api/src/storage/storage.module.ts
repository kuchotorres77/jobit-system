import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TipoDeArchivoNoPermitidoException } from '../common/exceptions/domain.exception';
import { StorageController } from './storage.controller';
import { StorageRepository } from './storage.repository';
import { StorageService } from './storage.service';

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dir = configService.get<string>('storage.dir', './storage');
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        return {
          storage: diskStorage({
            destination: dir,
            filename: (_req, file, callback) => {
              const ext = extname(file.originalname);
              callback(null, `file-${Date.now()}${ext}`);
            },
          }),
          fileFilter: (_req, file, callback) => {
            if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
              callback(new TipoDeArchivoNoPermitidoException(), false);
              return;
            }
            callback(null, true);
          },
          limits: {
            fileSize: 5 * 1024 * 1024,
          },
        };
      },
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService, StorageRepository],
})
export class StorageModule {}
