import { api } from "../api/client";

export type DashboardStats = {
  totalCamps: number;
  activeCamps: number;
  waitingCamps: number;
  rejectedCamps: number;
  avgRating: number;
  totalReviews: number;
  bookings: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    last30Days: number;
    last7Days: number;
    today: number;
  };
};

export type BookingTrendPoint = {
  day: string;   
  count: number;
};

export const getDashboardStats = () => api.get<DashboardStats>("/api/dashboard/statistics");

export const getBookingsTrend30d = () =>
  api.get<BookingTrendPoint[]>("/api/dashboard/statistics/bookings/trend-30d");














// // src/Service/api/dashboard.ts
// import { api } from "../../lib/api";

// // نفس الشكل المتوقع من DashboardContent
// export type DashboardStats = {
//   totalCamps: number;
//   activeCamps: number;
//   waitingCamps: number;
//   rejectedCamps: number;
//   avgRating: number;
//   totalReviews: number;
//   bookings: {
//     total: number;
//     pending: number;
//     approved: number;
//     rejected: number;
//     last30Days: number;
//     last7Days: number;
//     today: number;
//   };
// };

// export type BookingTrendPoint = {
//   day: string;   // ISO date: yyyy-MM-dd
//   count: number;
// };

// // قراءة الدور من التخزين كما هو معمول به بالمشروع
// function getRole(): string {
//   return (
//     localStorage.getItem("role") ||
//     sessionStorage.getItem("role") ||
//     ""
//   );
// }

// // تحديد المسار حسب الدور: مسؤول → /api/admin/statistics، صاحب_مخيم → /api/vendor/statistics
// function getBasePath(): string {
//   const role = getRole();
//   const isAdmin = role === "مسؤول";
//   return isAdmin ? "/api/admin/statistics" : "/api/vendor/statistics";
// }

// // ملخص الإحصاءات (بطاقات الأرقام)
// export function getDashboardStats() {
//   const base = getBasePath();
//   return api.get<DashboardStats>(`${base}/summary`);
// }

// // اتجاه الحجوزات اليومي لآخر 30 يوم
// export function getBookingsTrend30d() {
//   const base = getBasePath();
//   return api.get<BookingTrendPoint[]>(`${base}/bookings/trend-30d`);
// }
