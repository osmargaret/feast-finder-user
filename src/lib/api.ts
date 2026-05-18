const rawApiUrl = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000/api";
const API_URL = rawApiUrl.replace(/\/+$/, "");

import { NIGERIAN_STATES, type NigerianState } from "@/data/nigeria";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("mm:token");

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("mm:token");
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }
    const errorData = await response.json().catch(() => ({ message: "An error occurred" }));

    // Flatten Laravel validation errors if they exist
    let errorMessage = errorData.message || "Request failed";
    if (errorData.errors) {
      const messages = Object.values(errorData.errors).flat();
      if (messages.length > 0) errorMessage = messages[0] as string;
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export type StateResponse = {
  id: number;
  name: string;
  capital: string;
};

function toStateItems(raw: NigerianState[] | StateResponse[]): { id: number; name: string }[] {
  return raw.map((s: any) => ({ id: s.id as number, name: s.name as string }));
}

export const api = {
  get: <T>(url: string) => apiFetch<T>(url, { method: "GET" }),
  post: <T>(url: string, data: any) => apiFetch<T>(url, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(url: string, data: any) => apiFetch<T>(url, { method: "PUT", body: JSON.stringify(data) }),
  patch: <T>(url: string, data: any) => apiFetch<T>(url, { method: "PATCH", body: JSON.stringify(data) }),
  delete: <T>(url: string) => apiFetch<T>(url, { method: "DELETE" }),
  /** Fetch states from the backend; falls back to mock data if the endpoint is unavailable. */
  getStates: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const data = await apiFetch<StateResponse[]>("/states");
      if (!data || data.length === 0) {
        console.error("[api] /states returned empty — check backend, falling back to mock data");
        return toStateItems(NIGERIAN_STATES);
      }
      return data.map((s) => ({ id: s.id, name: s.name }));
    } catch (err) {
      console.error("[api] Failed to fetch /states:", err, " — falling back to mock data");
      return toStateItems(NIGERIAN_STATES);
    }
  },
};

export default api;
