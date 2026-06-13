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
import { UpdatePerfilDto } from '../auth/dto/update-perfil.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PerfilUsuario } from '../auth/users.repository';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { PrestadorCompleto } from '../prestadores/prestadores.repository';
import { AdminService } from './admin.service';
import { AdminCreateJobitDto } from './dto/admin-create-jobit.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('prestadores')
  @ApiOperation({
    summary: 'Alta completa de un Jobit: usuario PROVIDER + perfil de prestador',
  })
  crearJobit(@Body() dto: AdminCreateJobitDto): Promise<PrestadorCompleto> {
    return this.adminService.crearJobit(dto);
  }

  @Get('usuarios/:id')
  @ApiOperation({
    summary: 'Datos de cualquier usuario con contactos y domicilio',
  })
  getUsuario(@Param('id', ParseUUIDPipe) id: string): Promise<PerfilUsuario> {
    return this.adminService.getUsuario(id);
  }

  @Put('usuarios/:id')
  @ApiOperation({
    summary: 'Actualizar datos de cualquier usuario (nombre, teléfono, domicilio)',
  })
  actualizarUsuario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePerfilDto,
  ): Promise<PerfilUsuario> {
    return this.adminService.actualizarUsuario(id, dto);
  }

  @Delete('usuarios/:id')
  @ApiOperation({
    summary: 'Eliminar un usuario y todo lo asociado (no permite auto-eliminarse)',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminarUsuario(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.adminService.eliminarUsuario(id, user.id);
  }
}
