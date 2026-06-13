import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { hash } from 'bcryptjs';
import {
  CredencialesInvalidasException,
  DocumentoYaRegistradoException,
  EmailYaRegistradoException,
  GoogleTokenInvalidoException,
  RefreshTokenInvalidoException,
} from '../common/exceptions/domain.exception';
import { AuthService } from './auth.service';
import { EmailTokensRepository } from './email-tokens.repository';
import { GoogleAuthService } from './google-auth.service';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { UsersRepository } from './users.repository';
import { MailService } from '../mail/mail.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let refreshTokensRepository: jest.Mocked<RefreshTokensRepository>;
  let googleAuthService: jest.Mocked<GoogleAuthService>;
  let jwtService: jest.Mocked<JwtService>;

  const baseUser = {
    id: 'user-1',
    nombre: 'Juan',
    apellido: 'Pérez',
    documento: '30123456',
    email: 'juan@test.com',
    password: 'hashed',
    sexo: null,
    role: Role.CUSTOMER,
    emailVerificado: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const storedRefreshToken = {
    id: 'rt-1',
    tokenHash: 'hash-guardado',
    userId: 'user-1',
    expiresAt: new Date(Date.now() + 60_000),
    revokedAt: null,
    createdAt: new Date(),
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
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: RefreshTokensRepository,
          useValue: {
            create: jest.fn(),
            findByHash: jest.fn(),
            revoke: jest.fn(),
            revokeAllForUser: jest.fn(),
          },
        },
        {
          provide: GoogleAuthService,
          useValue: {
            verificar: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(7),
          },
        },
        {
          provide: EmailTokensRepository,
          useValue: {
            create: jest.fn(),
            findByToken: jest.fn(),
            markUsed: jest.fn(),
            deleteByUserAndTipo: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
            sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    usersRepository = moduleRef.get(UsersRepository);
    refreshTokensRepository = moduleRef.get(RefreshTokensRepository);
    googleAuthService = moduleRef.get(GoogleAuthService);
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
        role: Role.CUSTOMER,
      });
      const createArgs = usersRepository.create.mock.calls[0][0];
      expect(createArgs.password).not.toBe(dto.password);
      expect(createArgs.role).toBe(Role.PROVIDER);
    });

    it('should pass telefono and direccion through to the repository', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByDocumento.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(baseUser);

      await service.register({
        ...dto,
        telefono: '2645551234',
        direccion: {
          calle: 'Av. Libertador 1500',
          codigoPostal: '5400',
          provincia: 'San Juan',
          departamento: 'Capital',
        },
      });

      const createArgs = usersRepository.create.mock.calls[0][0];
      expect(createArgs.telefono).toBe('2645551234');
      expect(createArgs.direccion).toEqual({
        calle: 'Av. Libertador 1500',
        codigoPostal: '5400',
        provincia: 'San Juan',
        departamento: 'Capital',
      });
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
    it('should return token pair and user when credentials are valid', async () => {
      const passwordHash = await hash('password123', 4);
      usersRepository.findByEmail.mockResolvedValue({
        ...baseUser,
        password: passwordHash,
      });
      jwtService.signAsync.mockResolvedValue('signed-token');
      refreshTokensRepository.create.mockResolvedValue(storedRefreshToken);

      const result = await service.login({
        email: 'juan@test.com',
        password: 'password123',
      });

      expect(result.token).toBe('signed-token');
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(result.refreshToken.length).toBeGreaterThan(0);
      expect(result.user).toEqual({
        id: 'user-1',
        nombre: 'Juan',
        apellido: 'Pérez',
        documento: '30123456',
        role: Role.CUSTOMER,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'juan@test.com',
        role: Role.CUSTOMER,
      });
      const [userId, tokenHash, expiresAt] =
        refreshTokensRepository.create.mock.calls[0];
      expect(userId).toBe('user-1');
      expect(tokenHash).not.toBe(result.refreshToken);
      expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
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

    it('should throw CredencialesInvalidasException for Google-only accounts', async () => {
      usersRepository.findByEmail.mockResolvedValue({
        ...baseUser,
        password: null,
      });

      await expect(
        service.login({ email: 'juan@test.com', password: 'cualquiera' }),
      ).rejects.toBeInstanceOf(CredencialesInvalidasException);
    });
  });

  describe('loginConGoogle', () => {
    it('should issue tokens for an existing user', async () => {
      googleAuthService.verificar.mockResolvedValue({
        email: 'juan@test.com',
        nombre: 'Juan',
        apellido: 'Pérez',
      });
      usersRepository.findByEmail.mockResolvedValue(baseUser);
      jwtService.signAsync.mockResolvedValue('google-token');
      refreshTokensRepository.create.mockResolvedValue(storedRefreshToken);

      const result = await service.loginConGoogle('credential-valido');

      expect(result.token).toBe('google-token');
      expect(usersRepository.create).not.toHaveBeenCalled();
    });

    it('should create a CUSTOMER account when the email is new', async () => {
      googleAuthService.verificar.mockResolvedValue({
        email: 'nueva@test.com',
        nombre: 'Nueva',
        apellido: 'Cuenta',
      });
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue({
        ...baseUser,
        email: 'nueva@test.com',
      });
      jwtService.signAsync.mockResolvedValue('google-token');
      refreshTokensRepository.create.mockResolvedValue(storedRefreshToken);

      await service.loginConGoogle('credential-valido');

      expect(usersRepository.create).toHaveBeenCalledWith({
        nombre: 'Nueva',
        apellido: 'Cuenta',
        email: 'nueva@test.com',
        role: Role.CUSTOMER,
      });
    });

    it('should propagate the exception when the credential is invalid', async () => {
      googleAuthService.verificar.mockRejectedValue(
        new GoogleTokenInvalidoException(),
      );

      await expect(
        service.loginConGoogle('credential-invalido'),
      ).rejects.toBeInstanceOf(GoogleTokenInvalidoException);
      expect(usersRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should rotate the token and return a new pair when it is valid', async () => {
      refreshTokensRepository.findByHash.mockResolvedValue(storedRefreshToken);
      usersRepository.findById.mockResolvedValue(baseUser);
      jwtService.signAsync.mockResolvedValue('nuevo-token');
      refreshTokensRepository.create.mockResolvedValue(storedRefreshToken);

      const result = await service.refresh('refresh-valido');

      expect(refreshTokensRepository.revoke).toHaveBeenCalledWith('rt-1');
      expect(refreshTokensRepository.create).toHaveBeenCalled();
      expect(result.token).toBe('nuevo-token');
      expect(result.refreshToken).toEqual(expect.any(String));
    });

    it('should throw RefreshTokenInvalidoException when token is unknown', async () => {
      refreshTokensRepository.findByHash.mockResolvedValue(null);

      await expect(service.refresh('desconocido')).rejects.toBeInstanceOf(
        RefreshTokenInvalidoException,
      );
      expect(refreshTokensRepository.revoke).not.toHaveBeenCalled();
    });

    it('should revoke all user tokens when a revoked token is reused', async () => {
      refreshTokensRepository.findByHash.mockResolvedValue({
        ...storedRefreshToken,
        revokedAt: new Date(),
      });

      await expect(service.refresh('reusado')).rejects.toBeInstanceOf(
        RefreshTokenInvalidoException,
      );
      expect(refreshTokensRepository.revokeAllForUser).toHaveBeenCalledWith(
        'user-1',
      );
    });

    it('should throw RefreshTokenInvalidoException when token is expired', async () => {
      refreshTokensRepository.findByHash.mockResolvedValue({
        ...storedRefreshToken,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.refresh('expirado')).rejects.toBeInstanceOf(
        RefreshTokenInvalidoException,
      );
      expect(refreshTokensRepository.revoke).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should revoke the token when it is active', async () => {
      refreshTokensRepository.findByHash.mockResolvedValue(storedRefreshToken);

      await service.logout('refresh-valido');

      expect(refreshTokensRepository.revoke).toHaveBeenCalledWith('rt-1');
    });

    it('should do nothing when the token is unknown', async () => {
      refreshTokensRepository.findByHash.mockResolvedValue(null);

      await expect(service.logout('desconocido')).resolves.toBeUndefined();
      expect(refreshTokensRepository.revoke).not.toHaveBeenCalled();
    });
  });
});
