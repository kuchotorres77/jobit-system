import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import {
  CredencialesInvalidasException,
  DocumentoYaRegistradoException,
  EmailYaRegistradoException,
} from '../common/exceptions/domain.exception';
import { JwtPayload } from '../common/interfaces/authenticated-user.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  LoginResult,
  RegisteredUser,
} from './interfaces/auth-result.interface';
import { UsersRepository } from './users.repository';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
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
    const user = await this.usersRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      documento: dto.documento,
      email: dto.email,
      password: passwordHash,
      sexo: dto.sexo,
    });

    return {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      documento: user.documento,
      email: user.email,
      sexo: user.sexo,
    };
  }

  async login(dto: LoginDto): Promise<LoginResult> {
    this.logger.debug(`login: ${dto.email}`);

    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new CredencialesInvalidasException();
    }

    const passwordOk = await compare(dto.password, user.password);
    if (!passwordOk) {
      throw new CredencialesInvalidasException();
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        documento: user.documento,
      },
    };
  }
}
