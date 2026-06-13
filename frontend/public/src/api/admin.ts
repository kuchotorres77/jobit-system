import { api } from "./client";
import {
  AdminCreateJobitPayload,
  PerfilUsuario,
  Prestador,
  UpdatePerfilPayload,
} from "./types";

/** Alta completa de un Jobit: usuario PROVIDER + perfil de prestador. */
export function adminCrearJobit(
  payload: AdminCreateJobitPayload,
): Promise<Prestador> {
  return api.post<Prestador>("/admin/prestadores", payload, true);
}

export function adminGetUsuario(userId: string): Promise<PerfilUsuario> {
  return api.get<PerfilUsuario>(`/admin/usuarios/${userId}`, true);
}

export function adminActualizarUsuario(
  userId: string,
  payload: UpdatePerfilPayload,
): Promise<PerfilUsuario> {
  return api.put<PerfilUsuario>(`/admin/usuarios/${userId}`, payload);
}

/** Baja completa del usuario y todo lo asociado (prestador, reviews, etc.). */
export function adminEliminarUsuario(userId: string): Promise<void> {
  return api.delete<void>(`/admin/usuarios/${userId}`);
}
