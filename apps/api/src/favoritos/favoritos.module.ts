import { Module } from '@nestjs/common';
import { PrestadoresModule } from '../prestadores/prestadores.module';
import { FavoritosController } from './favoritos.controller';
import { FavoritosRepository } from './favoritos.repository';
import { FavoritosService } from './favoritos.service';

@Module({
  imports: [PrestadoresModule],
  controllers: [FavoritosController],
  providers: [FavoritosService, FavoritosRepository],
})
export class FavoritosModule {}
