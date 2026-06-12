import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StorageFile } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ArchivoRequeridoException } from '../common/exceptions/domain.exception';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { StorageService } from './storage.service';

@ApiTags('upload')
@Controller('upload')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('myfile'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir un archivo (máx. 5 MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['myfile'],
      properties: {
        myfile: { type: 'string', format: 'binary' },
      },
    },
  })
  upload(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<StorageFile> {
    if (!file) {
      throw new ArchivoRequeridoException();
    }
    return this.storageService.registerUpload(user.id, file.filename, file.path);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Descargar un archivo subido (público)' })
  getArchivo(@Param('id', ParseUUIDPipe) id: string): Promise<StreamableFile> {
    return this.storageService.getArchivo(id);
  }
}
