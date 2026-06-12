import { Role, Sexo } from '@prisma/client';

export interface RegisteredUser {
  id: string;
  nombre: string;
  apellido: string;
  documento: string | null;
  email: string;
  sexo: Sexo | null;
  role: Role;
}

export interface LoginResult {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    nombre: string;
    apellido: string;
    documento: string | null;
    role: Role;
  };
}
