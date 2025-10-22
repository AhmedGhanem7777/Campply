// src/types/camps.ts
export type ApiImage = { id: number; imageUrl: string; isCover: boolean };
export type ApiService = { id: number; name: string; description: string };
export type ApiCampService = { service: ApiService };
export type ApiTimeSlot = { name: string; startTime: string; endTime: string; dayType: string };

export type ApiCamp = {
  id: number;
  title: string;
  ownerId: string;
  capacity: number;
  country: string | null;
  state: string | null;
  city: string | null;
  hasAccommodation: boolean;
  priceWeekdays: number;
  priceHolidays: number;
  approvalStatus: string;
  reviewsAverage: number;
  reviewsCount: number;
  images: ApiImage[];
  campServices: ApiCampService[];
  timeSlots: ApiTimeSlot[];
  campTypes: any[];
};

export type PagedResponse<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
};
