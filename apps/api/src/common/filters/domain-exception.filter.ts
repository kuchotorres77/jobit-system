import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    this.logger.warn(`${exception.name}: ${exception.message}`);

    response.status(exception.statusCode).json({
      statusCode: exception.statusCode,
      message: exception.message,
      error: HttpStatus[exception.statusCode],
    });
  }
}
