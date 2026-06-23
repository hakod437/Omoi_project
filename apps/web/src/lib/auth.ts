import { api } from "./api-client";
import type { AuthResponse } from "@/types";

function getOrCreateDeviceId(): string {
  const key = "omoi-device-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/login", {
    email,
    password,
    deviceFingerprint: getOrCreateDeviceId(),
    platform: "web",
  });
}

export async function registerApi(
  email: string,
  password: string,
  pseudo: string,
): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/register", {
    email,
    password,
    pseudo,
  });
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await api.post("/auth/logout", { refreshToken });
}
