import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRubroDto } from './dto/create-rubro.dto';
import { RubroCompleto } from './rubros.repository';
import { RubrosService } from './rubros.service';

@Controller('rubros')
export class RubrosController {
  constructor(private readonly rubrosService: RubrosService) {}

  @Get()
  findAll(): Promise<RubroCompleto[]> {
    return this.rubrosService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<RubroCompleto> {
    return this.rubrosService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateRubroDto): Promise<RubroCompleto> {
    return this.rubrosService.create(dto);
  }
}
