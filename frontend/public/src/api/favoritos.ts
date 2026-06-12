import { api } from "./client";
import { PaginatedResult, Prestador } from "./types";

/** Ids de prestadores marcados como favoritos por el usuario actual. */
export function getFavoritos(): Promise<string[]> {
  return api.get<string[]>("/favoritos", true);
}

/** Prestadores favoritos completos, paginados (página "Mis favoritos"). */
export function getFavoritosPrestadores(
  page = 1,
  limit = 12,
): Promise<PaginatedResult<Prestador>> {
  return api.get<PaginatedResult<Prestador>>(
    `/favoritos/prestadores?page=${page}&limit=${limit}`,
    true,
  );
}

export function agregarFavorito(prestadorId: string): Promise<void> {
  return api.post<void>(`/favoritos/${prestadorId}`, undefined, true);
}

export function quitarFavorito(prestadorId: string): Promise<void> {
  return api.delete<void>(`/favoritos/${prestadorId}`);
}
