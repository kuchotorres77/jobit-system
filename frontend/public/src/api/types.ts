export type DiaSemana =
  | "LUNES"
  | "MARTES"
  | "MIERCOLES"
  | "JUEVES"
  | "VIERNES"
  | "SABADO"
  | "DOMINGO"
  | "FERIADOS";

export type Sexo = "FEMENINO" | "MASCULINO";

export interface RegisterPayload {
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  password: string;
  sexo?: Sexo;
}

export interface RegisteredUser {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  sexo: Sexo | null;
}

export interface LoginPayload {
  email: string;
  password: string;
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

export interface Subrubro {
  id: string;
  nombre: string;
  rubroId: string;
}

export interface Rubro {
  id: string;
  nombre: string;
  subrubros: Subrubro[];
}

export interface DisponibilidadPayload {
  dias: DiaSemana[];
  desde: string;
  hasta: string;
}

export interface ServicioPayload {
  subrubroId: string;
  zonaCobertura: string[];
  disponibilidades: DisponibilidadPayload[];
}

export interface CreatePrestadorPayload {
  descripcion?: string;
  servicios: ServicioPayload[];
}

export interface Prestador {
  id: string;
  descripcion: string | null;
  userId: string;
  user: {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    email: string;
  };
  servicios: Array<{
    id: string;
    zonaCobertura: string[];
    subrubro: Subrubro & { rubro: { id: string; nombre: string } };
    disponibilidades: Array<{
      id: string;
      dias: DiaSemana[];
      desde: string;
      hasta: string;
    }>;
  }>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
