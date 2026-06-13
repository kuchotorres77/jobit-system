import { api } from "./client";
import { clearSession, getRefreshToken, saveSession } from "./token";
import {
  LoginPayload,
  LoginResult,
  PerfilUsuario,
  RegisterPayload,
  RegisteredUser,
  UpdatePerfilPayload,
} from "./types";

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisteredUser> {
  return api.post<RegisteredUser>("/auth/register", payload);
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const result = await api.post<LoginResult>("/auth/login", payload);
  saveSession(result.token, result.user, result.refreshToken);
  return result;
}

export async function loginConGoogle(credential: string): Promise<LoginResult> {
  const result = await api.post<LoginResult>("/auth/google", { credential });
  saveSession(result.token, result.user, result.refreshToken);
  return result;
}

export function getMe(): Promise<PerfilUsuario> {
  return api.get<PerfilUsuario>("/auth/me", true);
}

export function updateMe(payload: UpdatePerfilPayload): Promise<PerfilUsuario> {
  return api.put<PerfilUsuario>("/auth/me", payload);
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    // Revoca el refresh token en el servidor; la sesión local se limpia igual
    await api.post("/auth/logout", { refreshToken }).catch(() => undefined);
  }
  clearSession();
}

export function verifyEmail(token: string): Promise<void> {
  return api.get<void>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export function forgotPassword(email: string): Promise<void> {
  return api.post<void>("/auth/forgot-password", { email });
}

export function resetPassword(token: string, password: string): Promise<void> {
  return api.post<void>("/auth/reset-password", { token, password });
}
