// src/lib/api.ts
import axios from "axios";

const BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || "https://omancamps.com";

export const api = axios.create({
  baseURL: BASE_URL.replace(/\/+$/, ""),
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // تطبيع رسائل الأخطاء
    if (err?.response?.data?.message) {
      err.message = err.response.data.message;
    } else if (err?.response?.status) {
      err.message = `HTTP ${err.response.status}`;
    }
    return Promise.reject(err);
  }
);
