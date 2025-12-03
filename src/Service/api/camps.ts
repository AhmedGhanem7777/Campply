// src/Service/api/camps.ts
import { api } from "../../lib/api";

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL || "https://omancamps.com";

export type CampImage = {
  id?: number;
  imageUrl: string;
  isCover: boolean;
};

export type CampServiceMap =
  | { name: string }
  | { service: { id?: number; name: string; description?: string } };

export type CampTimeSlot = {
  name?: string;
  startTime?: string; 
  endTime?: string;
  dayType?: string;
};

export type CampType = {
  name: string;
  category?: string;
  categoryId?: number;
};

export type CampListItem = {
  id: number;
  title: string;
  ownerId?: string;
  capacity?: number;
  country?: string;
  state?: string;
  city?: string;
  hasAccommodation?: boolean;
  priceWeekdays?: number;
  priceHolidays?: number;
  approvalStatus?: string | number;
  reviewsAverage?: number;
  reviewsCount?: number;
  images: CampImage[];
  campServices: CampServiceMap[];
  timeSlots: CampTimeSlot[];
  campTypes: CampType[];

  // Optional extended fields
  summary?: string | null;
  guestServices?: string | null;
  rentalPolicy?: string | null;
};

export type PagedResponse<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
};

// Convert relative URLs to absolute
export const buildImageUrl = (path?: string | null): string => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = String(API_BASE).replace(/\/+$/, "");
  const rel = String(path).replace(/^\/+/, "");
  return `${base}/${rel}`;
};

// Public listing
export const listCamps = (params?: Record<string, any>) =>
  api.get<PagedResponse<CampListItem>>("/api/Camp", { params });

// Public details for a single camp (Camp + Approved CampRequest summary + RawPayloadJson)
export const getCampDetails = (id: number | string) =>
  api.get(`/api/Camp/${id}/details`);

// Optional admin endpoints (commented out unless available in your backend)
// export const getCampById = (id: number) => api.get<CampListItem>(`/api/admin/camps/${id}`);
// export const approveCamp = (id: number) => api.put<void>(`/api/admin/camps/${id}/approve`);
// export const rejectCamp = (id: number, reason?: string) =>
//   api.put<void>(`/api/admin/camps/${id}/reject`, undefined, { params: reason ? { reason } : undefined });

// Public CRUD (if used outside admin)
export const createCamp = (campData: any, images: File[]) => {
  const formData = new FormData();
  images.forEach((file) => formData.append("images", file));
  formData.append("campDataJson", JSON.stringify(campData));
  return api.post("/api/Camp", formData, { headers: { "Content-Type": "multipart/form-data" } });
};

export const updateCamp = (id: number, campData: any, images: File[]) => {
  const formData = new FormData();
  images.forEach((file) => formData.append("images", file));
  formData.append("campDataJson", JSON.stringify(campData));
  return api.put(`/api/Camp/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
};

export const deleteCamp = (id: number) => api.delete(`/api/Camp/${id}`);
