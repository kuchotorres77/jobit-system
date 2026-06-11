import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StorageController } from './storage.controller';
import { StorageRepository } from './storage.repository';
import { StorageService } from './storage.service';

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
