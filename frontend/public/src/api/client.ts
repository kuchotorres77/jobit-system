import {
  clearSession,
  getRefreshToken,
  getToken,
  saveSession,
} from "./token";
import { LoginResult } from "./types";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3005/api";

export class ApiError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

// Una sola renovación en vuelo aunque fallen varias requests a la vez
let refreshEnCurso: Promise<boolean> | null = null;

async function renovarSesion(): Promise<boolean> {
  refreshEnCurso ??= (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        clearSession();
        return false;
      }
      const data = (await response.json()) as LoginResult;
      saveSession(data.token, data.user, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  })();

  try {
    return await refreshEnCurso;
  } finally {
    refreshEnCurso = null;
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  esReintento = false,
): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Access token vencido: se renueva con el refresh token y se reintenta una vez
  if (response.status === 401 && auth && !esReintento) {
    const renovado = await renovarSesion();
    if (renovado) {
      return request<T>(path, options, true);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message ?? `Error ${response.status}`;
    throw new ApiError(response.status, message);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, auth = false) => request<T>(path, { auth }),
  post: <T>(path: string, body: unknown, auth = false) =>
    request<T>(path, { method: "POST", body, auth }),
  put: <T>(path: string, body: unknown, auth = true) =>
    request<T>(path, { method: "PUT", body, auth }),
  delete: <T>(path: string, auth = true) =>
    request<T>(path, { method: "DELETE", auth }),
};
