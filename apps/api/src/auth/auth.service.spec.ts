import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import {
  CredencialesInvalidasException,
  DocumentoYaRegistradoException,
  EmailYaRegistradoException,
} from '../common/exceptions/domain.exception';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const baseUser = {
    id: 'user-1',
    nombre: 'Juan',
    apellido: 'Pérez',
    documento: '30123456',
    email: 'juan@test.com',
    password: 'hashed',
    sexo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            findByDocumento: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    usersRepository = moduleRef.get(UsersRepository);
    jwtService = moduleRef.get(JwtService);
  });

  describe('register', () => {
    const dto = {
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '30123456',
      email: 'juan@test.com',
      password: 'password123',
    };

    it('should create user when email and documento are free', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByDocumento.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(baseUser);

      const result = await service.register(dto);

      expect(result).toEqual({
        id: 'user-1',
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '30123456',
        email: 'juan@test.com',
        sexo: null,
      });
      const createArgs = usersRepository.create.mock.calls[0][0];
      expect(createArgs.password).not.toBe(dto.password);
    });

    it('should throw EmailYaRegistradoException when email already exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(baseUser);

      await expect(service.register(dto)).rejects.toBeInstanceOf(
        EmailYaRegistradoException,
      );
      expect(usersRepository.create).not.toHaveBeenCalled();
    });

    it('should throw DocumentoYaRegistradoException when documento already exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByDocumento.mockResolvedValue(baseUser);

      await expect(service.register(dto)).rejects.toBeInstanceOf(
        DocumentoYaRegistradoException,
      );
      expect(usersRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return token and user when credentials are valid', async () => {
      const passwordHash = await hash('password123', 4);
      usersRepository.findByEmail.mockResolvedValue({
        ...baseUser,
        password: passwordHash,
      });
      jwtService.signAsync.mockResolvedValue('signed-token');

      const result = await service.login({
        email: 'juan@test.com',
        password: 'password123',
      });

      expect(result.token).toBe('signed-token');
      expect(result.user).toEqual({
        id: 'user-1',
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '30123456',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'juan@test.com',
      });
    });

    it('should throw CredencialesInvalidasException when user does not exist', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nadie@test.com', password: 'x' }),
      ).rejects.toBeInstanceOf(CredencialesInvalidasException);
    });

    it('should throw CredencialesInvalidasException when password is wrong', async () => {
      const passwordHash = await hash('password123', 4);
      usersRepository.findByEmail.mockResolvedValue({
        ...baseUser,
        password: passwordHash,
      });

      await expect(
        service.login({ email: 'juan@test.com', password: 'incorrecta' }),
      ).rejects.toBeInstanceOf(CredencialesInvalidasException);
    });
  });
});
