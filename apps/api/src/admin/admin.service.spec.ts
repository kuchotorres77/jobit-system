import { Test } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { UsersRepository } from '../auth/users.repository';
import {
  OperacionNoPermitidaException,
  UsuarioNoEncontradoException,
} from '../common/exceptions/domain.exception';
import { PrestadoresService } from '../prestadores/prestadores.service';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let authService: jest.Mocked<AuthService>;
  let prestadoresService: jest.Mocked<PrestadoresService>;
  let usersRepository: jest.Mocked<UsersRepository>;

  const usuario = {
    id: 'user-1',
    nombre: 'Juan',
    apellido: 'Pérez',
    documento: '30123456',
    email: 'juan@test.com',
    sexo: null,
    role: Role.PROVIDER,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            updatePerfil: jest.fn(),
          },
        },
        {
          provide: PrestadoresService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AdminService);
    authService = moduleRef.get(AuthService);
    prestadoresService = moduleRef.get(PrestadoresService);
    usersRepository = moduleRef.get(UsersRepository);
  });

  describe('crearJobit', () => {
    it('should register the user and create the prestador profile', async () => {
      const dto = {
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '30123456',
        email: 'juan@test.com',
        password: 'password123',
        descripcion: 'Plomero',
        servicios: [
          { subrubroId: 'sub-1', zonaCobertura: ['Capital'], disponibilidades: [] },
        ],
      };
      authService.register.mockResolvedValue(usuario);
      prestadoresService.create.mockResolvedValue({ id: 'p-1' } as never);

      const result = await service.crearJobit(dto);

      expect(authService.register).toHaveBeenCalledWith({
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '30123456',
        email: 'juan@test.com',
        password: 'password123',
      });
      expect(prestadoresService.create).toHaveBeenCalledWith('user-1', {
        descripcion: 'Plomero',
        servicios: dto.servicios,
      });
      expect(result).toEqual({ id: 'p-1' });
    });
  });

  describe('actualizarUsuario', () => {
    it('should update the user perfil when it exists', async () => {
      usersRepository.findById.mockResolvedValue(usuario as never);
      authService.updatePerfil.mockResolvedValue({} as never);

      await service.actualizarUsuario('user-1', { nombre: 'Nuevo' });

      expect(authService.updatePerfil).toHaveBeenCalledWith('user-1', {
        nombre: 'Nuevo',
      });
    });

    it('should throw UsuarioNoEncontradoException when user does not exist', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(
        service.actualizarUsuario('inexistente', { nombre: 'x' }),
      ).rejects.toBeInstanceOf(UsuarioNoEncontradoException);
    });
  });

  describe('eliminarUsuario', () => {
    it('should delete the user', async () => {
      usersRepository.findById.mockResolvedValue(usuario as never);

      await service.eliminarUsuario('user-1', 'admin-1');

      expect(usersRepository.delete).toHaveBeenCalledWith('user-1');
    });

    it('should not allow the admin to delete itself', async () => {
      await expect(
        service.eliminarUsuario('admin-1', 'admin-1'),
      ).rejects.toBeInstanceOf(OperacionNoPermitidaException);
      expect(usersRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UsuarioNoEncontradoException when user does not exist', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(
        service.eliminarUsuario('inexistente', 'admin-1'),
      ).rejects.toBeInstanceOf(UsuarioNoEncontradoException);
    });
  });
});
