import { Role } from "./types";

const TOKEN_KEY = "jobit_token";
const REFRESH_TOKEN_KEY = "jobit_refresh_token";
const USER_KEY = "jobit_user";

export const SESSION_CHANGE_EVENT = "jobit:session-change";

function notifySessionChange(): void {
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export interface SessionUser {
  id: string;
  nombre: string;
  apellido: string;
  documento: string | null;
  role?: Role;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function saveSession(
  token: string,
  user: SessionUser,
  refreshToken?: string,
): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  notifySessionChange();
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifySessionChange();
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}
