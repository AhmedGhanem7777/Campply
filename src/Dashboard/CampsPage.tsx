// src/pages/Dashboard/CampsPage.tsx
import { useState, useEffect, useMemo } from "react";
import { MoreVertical, Eye, Trash, Loader2, Star, Info } from "lucide-react";
import { listCamps, buildImageUrl, CampListItem } from "../Service/api/camps";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";

function getCover(images: CampListItem["images"]) {
  const cover = images?.find(i => i.isCover) ?? images?.[0];
  return cover ? buildImageUrl(cover.imageUrl) : "";
}

function ApprovalBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  if (s.includes("رفض")) return <Badge variant="destructive">مرفوض</Badge>;
  if (s.includes("موافق") || s.includes("approved")) return <Badge>موافق عليه</Badge>;
  return <Badge variant="secondary">قيد المراجعة</Badge>;
}

function formatNumber(n?: number | null) {
  if (n === null || n === undefined) return "-";
  const v = typeof n === "number" && (n as any).toFixed ? Number((n as number).toFixed(1)) : n;
  return v;
}

function formatTime(s?: string | null) {
  if (!s) return "-";
  // يدعم HH:mm أو HH:mm:ss
  return s.slice(0, 5);
}

export default function CampsPage() {
  const [rows, setRows] = useState<CampListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CampListItem | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await listCamps({ pageIndex, pageSize }); // يجب أن تستدعي /api/admin/camps
        setRows(data.data ?? []);
        setCount(data.count ?? 0);
      } catch (e: any) {
        setError("تعذر جلب المخيمات");
      } finally {
        setLoading(false);
      }
    })();
  }, [pageIndex, pageSize]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  // أسماء موقع آمنة
  const locationText = (c: CampListItem) => {
    const parts = [c.country, c.state, c.city].filter(Boolean);
    return parts.join(" / ");
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">المخيمات</h1>
          <p className="text-muted-foreground mt-2">إدارة جميع المخيمات مع التقييمات والتفاصيل</p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-muted-foreground py-10 text-center">لا توجد بيانات</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="text-muted-foreground border-b">
                <th className="py-3 px-3">الصورة</th>
                <th className="py-3 px-3">الاسم</th>
                <th className="py-3 px-3">الموقع</th>
                <th className="py-3 px-3">الأسعار</th>
                <th className="py-3 px-3">السعة</th>
                <th className="py-3 px-3">التقييم</th>
                <th className="py-3 px-3">الحالة</th>
                {/* <th className="py-3 px-3">إجراءات</th> */}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2 px-3">
                    <img src={getCover(c.images)} alt={c.title} className="w-16 h-16 rounded-lg object-cover" />
                  </td>
                  <td className="py-2 px-3">{c.title}</td>
                  <td className="py-2 px-3">{locationText(c)}</td>
                  <td className="py-2 px-3">
                    <div>أيام الاسبوع: <span className="font-semibold">{c.priceWeekdays ?? "-"}</span></div>
                    <div className="text-muted-foreground">أيام العطل: <span className="font-semibold">{c.priceHolidays ?? "-"}</span></div>
                  </td>
                  <td className="py-2 px-3">{c.capacity ?? "-"}</td>
                  <td className="py-2 px-3">
                    <div className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold">{formatNumber(c.reviewsAverage)}</span>
                      <span className="text-muted-foreground">({c.reviewsCount ?? 0})</span>
                    </div>
                  </td>
                  <td className="py-2 px-3"><ApprovalBadge status={c.approvalStatus} /></td>
                  {/* <td className="py-2 px-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelected(c); setOpen(true); }}>
                          <Eye className="ml-2 h-4 w-4" /> عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="ml-2 h-4 w-4" /> حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && count > 0 && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">عدد الصفوف:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(1); }}
              className="h-9 rounded-md border px-3 py-1 text-sm bg-background"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">صفحة {pageIndex} من {Math.max(1, Math.ceil(count / pageSize))}</span>
            <Button variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.max(1, p - 1))} disabled={pageIndex === 1}>السابق</Button>
            <Button variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))} disabled={pageIndex === totalPages}>التالي</Button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]" dir="rtl">
          <DialogHeader><DialogTitle>تفاصيل المخيم</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pl-4">
            {selected && (
              <div className="space-y-6">
                {/* Cover */}
                <img src={getCover(selected.images)} alt={selected.title} className="w-full h-64 object-cover rounded-lg" />

                {/* Title + Location */}
                <div>
                  <h3 className="text-xl font-bold">{selected.title}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">{locationText(selected)}</div>
                </div>

                <Separator />

                {/* Prices + Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-surface">
                    <h4 className="font-semibold mb-2">💰 الأسعار</h4>
                    <p className="text-sm">أيام العمل: <span className="font-bold text-primary">{selected.priceWeekdays ?? "-"}</span></p>
                    <p className="text-sm">العطل: <span className="font-bold text-primary">{selected.priceHolidays ?? "-"}</span></p>
                  </div>
                  <div className="p-4 rounded-lg bg-surface">
                    <h4 className="font-semibold mb-2">⭐ التقييم</h4>
                    <div className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold">{formatNumber(selected.reviewsAverage)}</span>
                      <span className="text-muted-foreground">({selected.reviewsCount ?? 0})</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description + Policy (مشتقة من الكيان الحالي) */}
                {(selected.summary || selected.guestServices || selected.rentalPolicy) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selected.summary && (
                      <div className="p-4 rounded-lg bg-surface">
                        <h4 className="font-semibold mb-2">ℹ️ الوصف</h4>
                        <p className="text-sm leading-6">{selected.summary}</p>
                      </div>
                    )}
                    {(selected.guestServices || selected.rentalPolicy) && (
                      <div className="p-4 rounded-lg bg-surface">
                        <h4 className="font-semibold mb-2">📝 السياسة/الخدمات</h4>
                        {selected.guestServices && <p className="text-sm leading-6 mb-2">{selected.guestServices}</p>}
                        {selected.rentalPolicy && <p className="text-xs text-muted-foreground">السياسة: {selected.rentalPolicy}</p>}
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Services */}
                <div>
                  <h4 className="font-semibold mb-2">🛎️ الخدمات</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selected.campServices ?? []).map((cs: any, idx: number) => (
                      <Badge key={idx} variant="secondary">{cs?.name ?? cs?.service?.name}</Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* TimeSlots */}
                <div>
                  <h4 className="font-semibold mb-2">🕐 أوقات العمل</h4>
                  <div className="space-y-2">
                    {(selected.timeSlots ?? []).map((t: any, i: number) => (
                      <div key={i} className="flex justify-between p-3 bg-surface rounded-lg">
                        <span className="text-sm font-medium">{t.dayType || t.name || "-"}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(t.startTime)} - {formatTime(t.endTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Types */}
                <div>
                  <h4 className="font-semibold mb-2">🏷️ الأنواع</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selected.campTypes ?? []).map((ct: any, i: number) => (
                      <Badge key={i} variant="outline">{ct.name}{ct.category ? ` • ${ct.category}` : ""}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
