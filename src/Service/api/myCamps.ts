// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: (import.meta as any)?.env?.VITE_API_BASE_URL || "https://camply.runasp.net",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
