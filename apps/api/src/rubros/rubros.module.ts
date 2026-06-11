import { Module } from '@nestjs/common';
import { RubrosController } from './rubros.controller';
import { RubrosRepository } from './rubros.repository';
import { RubrosService } from './rubros.service';

@Module({
  controllers: [RubrosController],
  providers: [RubrosService, RubrosRepository],
})
export class RubrosModule {}
