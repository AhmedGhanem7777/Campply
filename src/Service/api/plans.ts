import { api } from "../../lib/api";

export type Plan = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  currency?: string | null;
  durationMonths: number;
  isActive: boolean;
  isPopular: boolean;
  features?: string[] | null;
  createdOn?: string;
};

export type PagedPlans = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Plan[];
};

export type PlanRequest = {
  name: string;
  description?: string | null;
  price: number;
  currency?: string | null;
  durationMonths: number;
  isActive: boolean;
  isPopular: boolean;
  features?: string[] | null;
};

export function listPlans(params: { pageIndex: number; pageSize: number; search?: string }) {
  return api.get<PagedPlans>("/api/admin/plans", { params });
}

export function getPlan(id: number) {
  return api.get<Plan>(`/api/admin/plans/${id}`);
}

export function createPlan(payload: PlanRequest) {
  return api.post<Plan>("/api/admin/plans", payload);
}

export function updatePlan(id: number, payload: PlanRequest) {
  return api.put<Plan>(`/api/admin/plans/${id}`, payload);
}

export async function getPublicPlans() {
  return api.get("/api/admin/plans/public");
}

export function deletePlan(id: number) {
  return api.delete(`/api/admin/plans/${id}`);
}

export function setPopular(id: number, popular: boolean) {
  return api.put(`/api/admin/plans/${id}/set-popular`, { isPopular: popular });
}

export function toggleActive(id: number) {
  return api.put(`/api/admin/plans/${id}/toggle-active`);
}
