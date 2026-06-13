import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly appUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.from = configService.get<string>('MAIL_FROM', 'Jobit <noreply@jobit.app>');
    this.appUrl = configService.get<string>('APP_URL', 'http://localhost');

    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: configService.get<number>('MAIL_PORT', 587),
      secure: configService.get<boolean>('MAIL_SECURE', false),
      auth: {
        user: configService.get<string>('MAIL_USER'),
        pass: configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    nombre: string,
    token: string,
  ): Promise<void> {
    const link = `${this.appUrl}/verificar-email?token=${token}`;
    this.logger.debug(`sendVerificationEmail → ${email}`);

    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: 'Verificá tu cuenta en Jobit',
      html: `
        <p>Hola ${nombre},</p>
        <p>Gracias por registrarte en Jobit. Hacé clic en el siguiente enlace para verificar tu cuenta:</p>
        <p><a href="${link}" style="color:#f97316;font-weight:bold;">Verificar cuenta</a></p>
        <p>El enlace vence en 24 horas.</p>
        <p>Si no creaste una cuenta, ignorá este mensaje.</p>
      `,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    nombre: string,
    token: string,
  ): Promise<void> {
    const link = `${this.appUrl}/nueva-contrasena?token=${token}`;
    this.logger.debug(`sendPasswordResetEmail → ${email}`);

    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: 'Recuperá tu contraseña de Jobit',
      html: `
        <p>Hola ${nombre},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Hacé clic en el siguiente enlace:</p>
        <p><a href="${link}" style="color:#f97316;font-weight:bold;">Restablecer contraseña</a></p>
        <p>El enlace vence en 1 hora. Si no solicitaste el cambio, ignorá este mensaje.</p>
      `,
    });
  }
}
