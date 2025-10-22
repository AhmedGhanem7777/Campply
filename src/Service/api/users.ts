// src/Service/api/users.ts
import { api } from "../api/client";

export type UserListItem = {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
};

export type PagedResponse<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
};

export const listUsers = (params: { pageIndex: number; pageSize: number }) =>
  api.get<PagedResponse<UserListItem>>("/api/User", { params });

export const fetchAllUsers = async () => {
  const pageSize = 100;
  let pageIndex = 1;
  const all: UserListItem[] = [];
  for (let i = 0; i < 100; i++) {
    const { data } = await listUsers({ pageIndex, pageSize });
    all.push(...(data.data ?? []));
    const count = data.count ?? 0;
    if (all.length >= count || (data.data ?? []).length === 0) break;
    pageIndex += 1;
  }
  return all;
};



export type UserDto = {
  id: string;
  displayName: string;
  phoneNumber: string;
  email: string;
  role: string;
  isActive: boolean;
};

export function getUserById(id: string) {
  return api.get<UserDto>(`/api/User/${encodeURIComponent(id)}`);
}


export function deleteUser(id: string) {
  return api.delete(`/api/User/${encodeURIComponent(id)}`);
}