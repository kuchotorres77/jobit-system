import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateRubroDto } from './dto/create-rubro.dto';
import { UpdateRubroDto } from './dto/update-rubro.dto';
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

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar un rubro y sus subrubros (solo ADMIN)',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRubroDto,
  ): Promise<RubroCompleto> {
    return this.rubrosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un rubro (solo ADMIN; 409 si está en uso)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.rubrosService.remove(id);
  }
}
