// src/Service/api/booking.ts
import { api } from "../api/client";

export type BookingStatus = "قيد_المراجعة" | "مقبول" | "مرفوض" | "ملغي";

export type BookingToReturnDto = {
  id: number;
  campId: number;
  campTitle: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  startDate: string;
  endDate: string;
  guests: number;
  notes?: string | null;
  status: BookingStatus;
  createdOn: string;
  ownerId?: string;
};

export type PagedResult<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
};

export function getOwnerBookingsPaged(params: { pageIndex: number; pageSize: number; status?: BookingStatus | "" }) {
  const query: any = { pageIndex: params.pageIndex, pageSize: params.pageSize };
  if (params.status) query.status = params.status;
  return api.get<PagedResult<BookingToReturnDto>>("/api/Booking/owner", { params: query });
}

export function approveBooking(bookingId: number) {
  return api.put<void>(`/api/Booking/${bookingId}/approve`);
}

export function rejectBooking(bookingId: number) {
  return api.put<void>(`/api/Booking/${bookingId}/reject`);
}
