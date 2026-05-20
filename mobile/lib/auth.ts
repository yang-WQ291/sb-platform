import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./constants";

const TOKEN_KEY = "auth_token";

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "登录失败");
  }
  const data = await res.json();
  await saveToken(data.token);
  return data.user;
}

export async function logout(): Promise<void> {
  await removeToken();
}

export async function getCurrentUser() {
  const token = await getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}
