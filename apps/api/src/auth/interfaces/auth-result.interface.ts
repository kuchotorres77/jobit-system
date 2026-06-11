import { Sexo } from '@prisma/client';

export interface RegisteredUser {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  sexo: Sexo | null;
}

export interface LoginResult {
  token: string;
  user: {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
  };
}
