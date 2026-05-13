import api from "./api";

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await api.get<{ status: string }>("/health");
    return res.status === "ok" || res.status === "up";
  } catch (err) {
    console.error("API Health Check failed:", err);
    return false;
  }
}
