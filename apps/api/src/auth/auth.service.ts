import { createHash, randomBytes } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import {
  CredencialesInvalidasException,
  DocumentoYaRegistradoException,
  EmailYaRegistradoException,
  RefreshTokenInvalidoException,
} from '../common/exceptions/domain.exception';
import { JwtPayload } from '../common/interfaces/authenticated-user.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { GoogleAuthService } from './google-auth.service';
import {
  LoginResult,
  RegisteredUser,
} from './interfaces/auth-result.interface';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { PerfilUsuario, UsersRepository } from './users.repository';

const BCRYPT_SALT_ROUNDS = 10;
const REFRESH_TOKEN_BYTES = 48;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly googleAuthService: GoogleAuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisteredUser> {
    this.logger.debug(`register: ${dto.email}`);

    const existingByEmail = await this.usersRepository.findByEmail(dto.email);
    if (existingByEmail) {
      throw new EmailYaRegistradoException(dto.email);
    }

    const existingByDocumento = await this.usersRepository.findByDocumento(
      dto.documento,
    );
    if (existingByDocumento) {
      throw new DocumentoYaRegistradoException(dto.documento);
    }

    const passwordHash = await hash(dto.password, BCRYPT_SALT_ROUNDS);
    // El registro del sitio es el alta de prestadores: el rol es PROVIDER desde el inicio
    const user = await this.usersRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      documento: dto.documento,
      email: dto.email,
      password: passwordHash,
      sexo: dto.sexo,
      role: Role.PROVIDER,
      telefono: dto.telefono,
      direccion: dto.direccion,
    });

    return {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      documento: user.documento,
      email: user.email,
      sexo: user.sexo,
      role: user.role,
    };
  }

  async login(dto: LoginDto): Promise<LoginResult> {
    this.logger.debug(`login: ${dto.email}`);

    const user = await this.usersRepository.findByEmail(dto.email);
    // Las cuentas creadas con Google no tienen password local
    if (!user?.password) {
      throw new CredencialesInvalidasException();
    }

    const passwordOk = await compare(dto.password, user.password);
    if (!passwordOk) {
      throw new CredencialesInvalidasException();
    }

    return this.issueTokens(user);
  }

  async loginConGoogle(credential: string): Promise<LoginResult> {
    this.logger.debug('loginConGoogle');

    const info = await this.googleAuthService.verificar(credential);

    let user = await this.usersRepository.findByEmail(info.email);
    if (!user) {
      user = await this.usersRepository.create({
        nombre: info.nombre,
        apellido: info.apellido,
        email: info.email,
        role: Role.CUSTOMER,
      });
    }

    return this.issueTokens(user);
  }

  async getPerfil(userId: string): Promise<PerfilUsuario> {
    this.logger.debug(`getPerfil: ${userId}`);

    const perfil = await this.usersRepository.findPerfil(userId);
    if (!perfil) {
      throw new CredencialesInvalidasException();
    }
    return perfil;
  }

  updatePerfil(userId: string, dto: UpdatePerfilDto): Promise<PerfilUsuario> {
    this.logger.debug(`updatePerfil: ${userId}`);

    return this.usersRepository.updatePerfil(userId, {
      nombre: dto.nombre,
      apellido: dto.apellido,
      telefono: dto.telefono,
      direccion: dto.direccion,
    });
  }

  async refresh(refreshToken: string): Promise<LoginResult> {
    this.logger.debug('refresh');

    const stored = await this.refreshTokensRepository.findByHash(
      this.hashRefreshToken(refreshToken),
    );
    if (!stored) {
      throw new RefreshTokenInvalidoException();
    }

    // Reuso de un token ya rotado: posible robo — se invalidan todas las sesiones
    if (stored.revokedAt) {
      this.logger.warn(`refresh: reuso detectado para usuario ${stored.userId}`);
      await this.refreshTokensRepository.revokeAllForUser(stored.userId);
      throw new RefreshTokenInvalidoException();
    }

    if (stored.expiresAt.getTime() <= Date.now()) {
      throw new RefreshTokenInvalidoException();
    }

    const user = await this.usersRepository.findById(stored.userId);
    if (!user) {
      throw new RefreshTokenInvalidoException();
    }

    await this.refreshTokensRepository.revoke(stored.id);
    return this.issueTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    this.logger.debug('logout');

    const stored = await this.refreshTokensRepository.findByHash(
      this.hashRefreshToken(refreshToken),
    );
    if (stored && !stored.revokedAt) {
      await this.refreshTokensRepository.revoke(stored.id);
    }
  }

  private async issueTokens(user: User): Promise<LoginResult> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);

    const refreshToken = randomBytes(REFRESH_TOKEN_BYTES).toString('base64url');
    const ttlDays = this.configService.get<number>('jwt.refreshTtlDays', 7);
    await this.refreshTokensRepository.create(
      user.id,
      this.hashRefreshToken(refreshToken),
      new Date(Date.now() + ttlDays * MS_POR_DIA),
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        documento: user.documento,
        role: user.role,
      },
    };
  }

  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }
}
