import { Module } from '@nestjs/common';
import { PrestadoresController } from './prestadores.controller';
import { PrestadoresRepository } from './prestadores.repository';
import { PrestadoresService } from './prestadores.service';

@Module({
  controllers: [PrestadoresController],
  providers: [PrestadoresService, PrestadoresRepository],
})
export class PrestadoresModule {}
