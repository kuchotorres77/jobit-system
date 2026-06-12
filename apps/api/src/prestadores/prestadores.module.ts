import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrestadoresController } from './prestadores.controller';
import { PrestadoresRepository } from './prestadores.repository';
import { PrestadoresService } from './prestadores.service';

@Module({
  imports: [AuthModule],
  controllers: [PrestadoresController],
  providers: [PrestadoresService, PrestadoresRepository],
  exports: [PrestadoresRepository],
})
export class PrestadoresModule {}
