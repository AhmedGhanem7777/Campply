// src/pages/Bookings.tsx
import { useEffect, useState } from "react";
import {
  getOwnerBookingsPaged,
  approveBooking,
  rejectBooking,
  type BookingToReturnDto,
  type BookingStatus
} from "../Service/api/booking";
import { Loader2 } from "lucide-react";

const statuses: (BookingStatus | "الكل")[] = ["الكل", "قيد_المراجعة", "مقبول", "مرفوض", "ملغي"];

function statusBadge(status: BookingStatus) {
  switch (status) {
    case "قيد_المراجعة":
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    case "مقبول":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "مرفوض":
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    case "ملغي":
      return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    default:
      return "bg-muted text-foreground/80";
  }
}

export default function Bookings(): JSX.Element {
  const [rows, setRows] = useState<BookingToReturnDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [count, setCount] = useState<number>(0);
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const [statusFilter, setStatusFilter] = useState<BookingStatus | "الكل">("الكل");

  const [workingId, setWorkingId] = useState<number | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const statusParam = statusFilter === "الكل" ? "" : statusFilter;
      const res = await getOwnerBookingsPaged({ pageIndex, pageSize, status: statusParam as any });
      setRows(res.data.data ?? []);
      setCount(res.data.count ?? 0);
    } catch {
      setError("تعذر جلب الحجوزات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [pageIndex, pageSize, statusFilter]);

  async function doApprove(id: number) {
    try {
      setWorkingId(id);
      await approveBooking(id);
      // حدّث الصف محليًا
      setRows(prev => prev.map(b => (b.id === id ? { ...b, status: "مقبول" } : b)));
    } finally {
      setWorkingId(null);
    }
  }

  async function doReject(id: number) {
    try {
      setWorkingId(id);
      await rejectBooking(id);
      setRows(prev => prev.map(b => (b.id === id ? { ...b, status: "مرفوض" } : b)));
    } finally {
      setWorkingId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin inline-block mr-2" />
        جاري التحميل...
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="p-6 space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">الحجوزات</h1>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">الحالة:</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as BookingStatus | "الكل"); setPageIndex(1); }}
            className="h-9 rounded-md border px-3 py-1 text-sm bg-background"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === "الكل" ? "الكل" : String(s).replaceAll("_", " ")}</option>
            ))}
          </select>

          <label className="text-sm text-muted-foreground">عدد الصفوف:</label>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(1); }}
            className="h-9 rounded-md border px-3 py-1 text-sm bg-background"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="text-muted-foreground">لا توجد حجوزات</div>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="border-b text-muted-foreground text-center">
                <th className="py-3 px-3 align-middle">المخيم</th>
                <th className="py-3 px-3 align-middle">العميل</th>
                <th className="py-3 px-3 align-middle">الهاتف</th>
                <th className="py-3 px-3 align-middle">الفترة</th>
                <th className="py-3 px-3 align-middle">الضيوف</th>
                <th className="py-3 px-3 align-middle">الحالة</th>
                <th className="py-3 px-3 align-middle">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b text-center">
                  <td className="py-2 px-3 align-middle truncate" title={b.campTitle}>{b.campTitle}</td>
                  <td className="py-2 px-3 align-middle truncate" title={b.customerName}>
                    {b.customerName}{b.customerEmail ? ` (${b.customerEmail})` : ""}
                  </td>
                  <td className="py-2 px-3 align-middle">{b.customerPhone || "—"}</td>
                  <td className="py-2 px-3 align-middle whitespace-nowrap">
                    {b.startDate?.slice(0,10)} → {b.endDate?.slice(0,10)}
                  </td>
                  <td className="py-2 px-3 align-middle">{b.guests}</td>
                  <td className="py-2 px-3 align-middle">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${statusBadge(b.status)}`}>
                      {String(b.status || "").replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="py-2 px-3 align-middle">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {b.status === "قيد_المراجعة" && (
                        <>
                          <button
                            onClick={() => doApprove(b.id)}
                            disabled={workingId === b.id}
                            className="px-2 py-1 rounded border text-xs hover:bg-emerald-500/10 border-emerald-600 text-emerald-400 cursor-pointer disabled:opacity-50"
                            title="قبول الحجز"
                          >
                            {workingId === b.id ? "..." : "قبول"}
                          </button>
                          <button
                            onClick={() => doReject(b.id)}
                            disabled={workingId === b.id}
                            className="px-2 py-1 rounded border text-xs hover:bg-red-500/10 border-red-600 text-red-400 cursor-pointer disabled:opacity-50"
                            title="رفض الحجز"
                          >
                            {workingId === b.id ? "..." : "رفض"}
                          </button>
                        </>
                      )}
                      {b.status === "مقبول" && (
                        <span className="text-xs text-emerald-400">—</span>
                      )}
                      {(b.status === "مرفوض" || b.status === "ملغي") && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="text-sm text-muted-foreground">
          صفحة {pageIndex} من {totalPages} ({count} عنصر)
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
            disabled={pageIndex === 1 || count === 0}
          >
            السابق
          </button>
          <button
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
            disabled={pageIndex === totalPages || count === 0}
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}
