import { getToken, removeToken } from "./auth";
import { API_BASE_URL } from "./constants";

const api = {
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    if (res.status === 401) {
      await removeToken();
      throw new Error("请先登录");
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "请求失败");
    }
    return res.json();
  },

  get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },
};

export default api;
