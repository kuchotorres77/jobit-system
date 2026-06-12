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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginatedResult } from '../common/dto/pagination-query.dto';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreatePrestadorDto } from './dto/create-prestador.dto';
import { FindPrestadoresQueryDto } from './dto/find-prestadores-query.dto';
import { UpdatePrestadorDto } from './dto/update-prestador.dto';
import { PrestadorCompleto } from './prestadores.repository';
import { PrestadoresService } from './prestadores.service';

@ApiTags('prestadores')
@Controller('prestadores')
export class PrestadoresController {
  constructor(private readonly prestadoresService: PrestadoresService) {}

  @Get()
  @ApiOperation({ summary: 'Listar prestadores con filtros y paginación' })
  findAll(
    @Query() query: FindPrestadoresQueryDto,
  ): Promise<PaginatedResult<PrestadorCompleto>> {
    return this.prestadoresService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un prestador por id' })
  findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PrestadorCompleto> {
    return this.prestadoresService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear el perfil de prestador del usuario actual' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePrestadorDto,
  ): Promise<PrestadorCompleto> {
    return this.prestadoresService.create(user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un prestador propio' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePrestadorDto,
  ): Promise<PrestadorCompleto> {
    return this.prestadoresService.update(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un prestador propio' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.prestadoresService.remove(id, user.id);
  }
}
