import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import {
  GoogleLoginNoConfiguradoException,
  GoogleTokenInvalidoException,
} from '../common/exceptions/domain.exception';

export interface GoogleUserInfo {
  email: string;
  nombre: string;
  apellido: string;
}

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);
  private readonly clientId: string;
  private readonly client: OAuth2Client | null;

  constructor(configService: ConfigService) {
    this.clientId = configService.get<string>('google.clientId', '');
    this.client = this.clientId ? new OAuth2Client(this.clientId) : null;
  }

  async verificar(credential: string): Promise<GoogleUserInfo> {
    if (!this.client) {
      throw new GoogleLoginNoConfiguradoException();
    }

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: credential,
        audience: this.clientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) {
        throw new Error('payload sin email');
      }
      return {
        email: payload.email,
        nombre: payload.given_name ?? payload.name ?? 'Usuario',
        apellido: payload.family_name ?? '',
      };
    } catch (error) {
      this.logger.warn(
        `verificar: token de Google rechazado (${(error as Error).message})`,
      );
      throw new GoogleTokenInvalidoException();
    }
  }
}
