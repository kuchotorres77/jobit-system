import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('JOBIT API')
    .setDescription(
      'API de la plataforma JOBIT: publicación y búsqueda de prestadores de servicios.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Registro y login de usuarios')
    .addTag('prestadores', 'CRUD de prestadores y búsqueda pública')
    .addTag('rubros', 'Rubros y subrubros de servicios')
    .addTag('upload', 'Carga de archivos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'JOBIT API Docs',
    swaggerOptions: { persistAuthorization: true },
  });
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);

  await app.listen(port);
  Logger.log(`API escuchando en el puerto ${port}`, 'Bootstrap');
}

void bootstrap();
