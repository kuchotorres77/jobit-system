import { api } from "./client";
import {
  CreatePrestadorPayload,
  PaginatedResult,
  Prestador,
  UpdatePrestadorPayload,
} from "./types";

export interface PrestadorFilters {
  page?: number;
  limit?: number;
  rubroId?: string;
  subrubroId?: string;
  zona?: string;
  q?: string;
}

export function getPrestadores(
  filters: PrestadorFilters = {},
): Promise<PaginatedResult<Prestador>> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.rubroId) params.set("rubroId", filters.rubroId);
  if (filters.subrubroId) params.set("subrubroId", filters.subrubroId);
  if (filters.zona) params.set("zona", filters.zona);
  if (filters.q) params.set("q", filters.q);

  const query = params.toString();
  return api.get<PaginatedResult<Prestador>>(
    `/prestadores${query ? `?${query}` : ""}`,
  );
}

export function getPrestador(id: string): Promise<Prestador> {
  return api.get<Prestador>(`/prestadores/${id}`);
}

export function getMiPrestador(): Promise<Prestador> {
  return api.get<Prestador>("/prestadores/me", true);
}

export function createPrestador(
  payload: CreatePrestadorPayload,
): Promise<Prestador> {
  return api.post<Prestador>("/prestadores", payload, true);
}

export function updatePrestador(
  id: string,
  payload: UpdatePrestadorPayload,
): Promise<Prestador> {
  return api.put<Prestador>(`/prestadores/${id}`, payload);
}
