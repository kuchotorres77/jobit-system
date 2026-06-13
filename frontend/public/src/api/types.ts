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

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type TipoContacto = "FIJO" | "CELULAR";

export interface DireccionPayload {
  calle: string;
  codigoPostal: string;
  provincia: string;
  departamento?: string;
  localidad?: string;
}

export interface RegisterPayload {
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  password: string;
  sexo?: Sexo;
  telefono?: string;
  direccion?: DireccionPayload;
}

export interface RegisteredUser {
  id: string;
  nombre: string;
  apellido: string;
  documento: string | null;
  email: string;
  sexo: Sexo | null;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
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

export interface PerfilUsuario {
  id: string;
  nombre: string;
  apellido: string;
  documento: string | null;
  email: string;
  sexo: Sexo | null;
  role: Role;
  contactos: Array<{
    id: string;
    tipo: TipoContacto;
    valor: string;
  }>;
  direcciones: Array<{
    id: string;
    calle: string;
    codigoPostal: string;
    provincia: string;
    departamento: string | null;
    localidad: string | null;
    pais: string;
  }>;
}

export interface UpdatePerfilPayload {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  direccion?: DireccionPayload;
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

export interface UpdatePrestadorPayload {
  descripcion?: string;
  servicios?: ServicioPayload[];
}

export interface Prestador {
  id: string;
  descripcion: string | null;
  userId: string;
  user: {
    id: string;
    nombre: string;
    apellido: string;
    documento: string | null;
    email: string;
    contactos: Array<{
      id: string;
      tipo: TipoContacto;
      valor: string;
    }>;
    archivos: Array<{
      id: string;
      fileName: string;
      createdAt: string;
    }>;
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
  // Presente en el listado (GET /prestadores); el detalle usa el endpoint de reviews
  rating?: {
    promedio: number;
    total: number;
  };
}

export interface Review {
  id: string;
  prestadorId: string;
  userId: string;
  puntaje: number;
  comentario: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nombre: string;
    apellido: string;
  };
  votos?: number;
  miVoto?: boolean;
}

export interface ReviewsResumen {
  promedio: number;
  total: number;
  distribucion: Record<number, number>;
}

export interface ReviewsListado extends PaginatedResult<Review> {
  resumen: ReviewsResumen;
}

export interface CreateReviewPayload {
  puntaje: number;
  comentario?: string;
}

export interface AdminCreateJobitPayload extends RegisterPayload {
  descripcion?: string;
  servicios: ServicioPayload[];
}

export interface UpdateRubroPayload {
  nombre?: string;
  // Con id renombra; sin id crea; los existentes que falten se eliminan
  subrubros?: Array<{ id?: string; nombre: string }>;
}

export interface CreateRubroPayload {
  nombre: string;
  subrubros?: Array<{ nombre: string }>;
}

export interface StorageFileInfo {
  id: string;
  fileName: string;
  path: string;
  userId: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
