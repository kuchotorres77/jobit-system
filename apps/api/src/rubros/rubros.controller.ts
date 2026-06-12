import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateRubroDto } from './dto/create-rubro.dto';
import { RubroCompleto } from './rubros.repository';
import { RubrosService } from './rubros.service';

@ApiTags('rubros')
@Controller('rubros')
export class RubrosController {
  constructor(private readonly rubrosService: RubrosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar rubros con sus subrubros' })
  findAll(): Promise<RubroCompleto[]> {
    return this.rubrosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rubro por id' })
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<RubroCompleto> {
    return this.rubrosService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un rubro con subrubros (solo ADMIN)' })
  create(@Body() dto: CreateRubroDto): Promise<RubroCompleto> {
    return this.rubrosService.create(dto);
  }
}
