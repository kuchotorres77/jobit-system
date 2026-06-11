import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageFile } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ArchivoRequeridoException } from '../common/exceptions/domain.exception';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { StorageService } from './storage.service';

@Controller('upload')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('myfile'))
  upload(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<StorageFile> {
    if (!file) {
      throw new ArchivoRequeridoException();
    }
    return this.storageService.registerUpload(user.id, file.filename, file.path);
  }
}
