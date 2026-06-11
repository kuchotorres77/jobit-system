import { api } from "./client";
import {
  CreatePrestadorPayload,
  PaginatedResult,
  Prestador,
} from "./types";

export function getPrestadores(
  page = 1,
  limit = 20,
): Promise<PaginatedResult<Prestador>> {
  return api.get<PaginatedResult<Prestador>>(
    `/prestadores?page=${page}&limit=${limit}`,
  );
}

export function getPrestador(id: string): Promise<Prestador> {
  return api.get<Prestador>(`/prestadores/${id}`);
}

export function createPrestador(
  payload: CreatePrestadorPayload,
): Promise<Prestador> {
  return api.post<Prestador>("/prestadores", payload, true);
}
