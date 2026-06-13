import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UpdatePerfilDto } from '../auth/dto/update-perfil.dto';
import { PerfilUsuario, UsersRepository } from '../auth/users.repository';
import {
  OperacionNoPermitidaException,
  UsuarioNoEncontradoException,
} from '../common/exceptions/domain.exception';
import { PrestadorCompleto } from '../prestadores/prestadores.repository';
import { PrestadoresService } from '../prestadores/prestadores.service';
import { AdminCreateJobitDto } from './dto/admin-create-jobit.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly authService: AuthService,
    private readonly prestadoresService: PrestadoresService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async crearJobit(dto: AdminCreateJobitDto): Promise<PrestadorCompleto> {
    this.logger.debug(`crearJobit: ${dto.email}`);

    const { descripcion, servicios, ...registro } = dto;
    const usuario = await this.authService.register(registro);
    return this.prestadoresService.create(usuario.id, {
      descripcion,
      servicios,
    });
  }

  async getUsuario(id: string): Promise<PerfilUsuario> {
    this.logger.debug(`getUsuario: ${id}`);

    const perfil = await this.usersRepository.findPerfil(id);
    if (!perfil) {
      throw new UsuarioNoEncontradoException(id);
    }
    return perfil;
  }

  async actualizarUsuario(
    id: string,
    dto: UpdatePerfilDto,
  ): Promise<PerfilUsuario> {
    this.logger.debug(`actualizarUsuario: ${id}`);

    const usuario = await this.usersRepository.findById(id);
    if (!usuario) {
      throw new UsuarioNoEncontradoException(id);
    }
    return this.authService.updatePerfil(id, dto);
  }

  async eliminarUsuario(id: string, actorId: string): Promise<void> {
    this.logger.debug(`eliminarUsuario: ${id}`);

    if (id === actorId) {
      throw new OperacionNoPermitidaException();
    }

    const usuario = await this.usersRepository.findById(id);
    if (!usuario) {
      throw new UsuarioNoEncontradoException(id);
    }
    await this.usersRepository.delete(id);
  }
}
