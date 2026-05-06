const API_URL = "http://localhost:8000/api";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("mm:token");
  
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "Request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(url: string) => apiFetch<T>(url, { method: "GET" }),
  post: <T>(url: string, data: any) => apiFetch<T>(url, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(url: string, data: any) => apiFetch<T>(url, { method: "PUT", body: JSON.stringify(data) }),
  patch: <T>(url: string, data: any) => apiFetch<T>(url, { method: "PATCH", body: JSON.stringify(data) }),
  delete: <T>(url: string) => apiFetch<T>(url, { method: "DELETE" }),
};

export default api;
