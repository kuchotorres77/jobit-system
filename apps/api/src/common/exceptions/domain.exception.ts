import { HttpStatus } from '@nestjs/common';

export abstract class DomainException extends Error {
  protected constructor(
    message: string,
    readonly statusCode: HttpStatus,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EmailYaRegistradoException extends DomainException {
  constructor(email: string) {
    super(`El email ${email} ya está registrado`, HttpStatus.CONFLICT);
  }
}

export class DocumentoYaRegistradoException extends DomainException {
  constructor(documento: string) {
    super(`El documento ${documento} ya está registrado`, HttpStatus.CONFLICT);
  }
}

export class CredencialesInvalidasException extends DomainException {
  constructor() {
    super('Email o contraseña incorrectos', HttpStatus.UNAUTHORIZED);
  }
}

export class RefreshTokenInvalidoException extends DomainException {
  constructor() {
    super('La sesión es inválida o expiró', HttpStatus.UNAUTHORIZED);
  }
}

export class GoogleLoginNoConfiguradoException extends DomainException {
  constructor() {
    super(
      'El inicio de sesión con Google no está habilitado',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

export class GoogleTokenInvalidoException extends DomainException {
  constructor() {
    super('No se pudo validar la cuenta de Google', HttpStatus.UNAUTHORIZED);
  }
}

export class PerfilPrestadorNoEncontradoException extends DomainException {
  constructor() {
    super(
      'El usuario no tiene un perfil de prestador',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class PrestadorNoEncontradoException extends DomainException {
  constructor(id: string) {
    super(`No existe el prestador ${id}`, HttpStatus.NOT_FOUND);
  }
}

export class PerfilPrestadorExistenteException extends DomainException {
  constructor() {
    super(
      'El usuario ya tiene un perfil de prestador creado',
      HttpStatus.CONFLICT,
    );
  }
}

export class OperacionNoPermitidaException extends DomainException {
  constructor() {
    super(
      'No tiene permisos para operar sobre este recurso',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class RubroNoEncontradoException extends DomainException {
  constructor(id: string) {
    super(`No existe el rubro ${id}`, HttpStatus.NOT_FOUND);
  }
}

export class RubroYaExisteException extends DomainException {
  constructor(nombre: string) {
    super(`El rubro ${nombre} ya existe`, HttpStatus.CONFLICT);
  }
}

export class SubrubroNoEncontradoException extends DomainException {
  constructor() {
    super(
      'Uno o más subrubros indicados no existen',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class NoPuedeOpinarSobreSiMismoException extends DomainException {
  constructor() {
    super(
      'No podés dejar una opinión sobre tu propio perfil',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class ReviewNoEncontradaException extends DomainException {
  constructor() {
    super('No tenés una opinión sobre este prestador', HttpStatus.NOT_FOUND);
  }
}

export class ArchivoRequeridoException extends DomainException {
  constructor() {
    super('Debe adjuntar un archivo', HttpStatus.BAD_REQUEST);
  }
}

export class TipoDeArchivoNoPermitidoException extends DomainException {
  constructor() {
    super(
      'Solo se permiten imágenes (jpg, png, webp o gif)',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ArchivoNoEncontradoException extends DomainException {
  constructor(id: string) {
    super(`No existe el archivo ${id}`, HttpStatus.NOT_FOUND);
  }
}
