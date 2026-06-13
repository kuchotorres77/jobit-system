import { api } from "./client";
import { CreateRubroPayload, Rubro, UpdateRubroPayload } from "./types";

export function getRubros(): Promise<Rubro[]> {
  return api.get<Rubro[]>("/rubros");
}

export function getRubro(id: string): Promise<Rubro> {
  return api.get<Rubro>(`/rubros/${id}`);
}

export function crearRubro(payload: CreateRubroPayload): Promise<Rubro> {
  return api.post<Rubro>("/rubros", payload, true);
}

export function updateRubro(
  id: string,
  payload: UpdateRubroPayload,
): Promise<Rubro> {
  return api.put<Rubro>(`/rubros/${id}`, payload);
}

export function eliminarRubro(id: string): Promise<void> {
  return api.delete<void>(`/rubros/${id}`);
}
