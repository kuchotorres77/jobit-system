import { api } from "./client";
import { saveSession } from "./token";
import {
  LoginPayload,
  LoginResult,
  RegisterPayload,
  RegisteredUser,
} from "./types";

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisteredUser> {
  return api.post<RegisteredUser>("/auth/register", payload);
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const result = await api.post<LoginResult>("/auth/login", payload);
  saveSession(result.token, result.user);
  return result;
}
