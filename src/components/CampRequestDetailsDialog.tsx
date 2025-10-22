// src/components/CampRequestDetailsDialog.tsx
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
import { buildImageUrl } from "../Service/api/camps";

function StatusBadge({ status }: { status: number | string }) {
  const s = String(status);
  const map: Record<string, { text: string; cls: string }> = {
    "0": { text: "قيد المراجعة", cls: "bg-amber-100 text-amber-700" },
    "1": { text: "مقبول", cls: "bg-emerald-100 text-emerald-700" },
    "2": { text: "مرفوض", cls: "bg-rose-100 text-rose-700" },
  };
  const k = map[s] || { text: s, cls: "bg-muted text-foreground" };
  return <span className={`px-2 py-1 text-xs rounded ${k.cls}`}>{k.text}</span>;
}

const FALLBACK = "https://images.unsplash.com/photo-1532555283690-cbf89e69cec7";

function formatDate(v?: string | null) {
  if (!v) return "-";
  try { return new Date(v).toLocaleString("ar-SA"); } catch { return v; }
}
function toArray(v: any) { return Array.isArray(v) ? v : v ? [v] : []; }

const BED_LABELS: Record<string, string> = {
  king: "سرير كينغ", queen: "سرير كوين", double: "سرير مزدوج",
  twin: "سرير مفرد", bunk: "سرير طابقين", sofa: "أريكة",
  crib: "سرير طفل", air: "سرير هوائي"
};

function parseJoinPayload(raw?: any) {
  try {
    const j = typeof raw === "string" ? JSON.parse(raw) : (raw || {});
    const basics = j.basics || {};
    const location = j.location || {};
    const description = j.description || {};
    const capacity = j.capacity || {};
    const facilities = j.facilities || {};
    const amenities = j.amenities || {};
    const sharedSpaces = toArray(j.sharedSpaces);
    const activities = j.activities || {};
    const terrain = j.terrain || {};
    const rules = j.rules || {};
    const booking = j.booking || {};
    const pricing = j.pricing || {};

    const bedsObj = capacity.beds || {};
    const bedsArray = Object.keys(bedsObj)
      .map((k) => ({ key: k, label: BED_LABELS[k] || k, count: Number(bedsObj[k] ?? 0) }))
      .filter((b) => b.count > 0);

    return {
      basics: { name: basics.name ?? "-", propertyType: basics.propertyType ?? "-", website: basics.website ?? "" },
      location: { country: location.country ?? "-", state: location.state ?? "-", city: location.city ?? "-", zip: location.zip ?? "-", street: location.street ?? "-" },
      description: { summary: description.summary ?? "", guestServices: description.guestServices ?? "" },
      capacity: { maxGuests: Number(capacity.maxGuests ?? 0), bedrooms: Number(capacity.bedrooms ?? 0), beds: bedsArray },
      facilities: toArray(facilities.facilities),
      amenities: { basic: toArray(amenities.basic), bath: toArray(amenities.bath), kitchen: toArray(amenities.kitchen), outdoor: toArray(amenities.outdoor) },
      sharedSpaces,
      activities: { options: toArray(activities.options), note: activities.note ?? "" },
      terrain: { options: toArray(terrain.options), surroundings: terrain.surroundings ?? "" },
      rules: { minAge: Number(rules.minAge ?? 0), checkInFrom: rules.checkInFrom ?? "", checkInTo: rules.checkInTo ?? "", checkOut: rules.checkOut ?? "", allowed: toArray(rules.allowed) },
      booking: { method: booking.method ?? "-", advanceNoticeDays: Number(booking.advanceNoticeDays ?? 0), bookingWindowMonths: Number(booking.bookingWindowMonths ?? 0) },
      pricing: { minNights: Number(pricing.minNights ?? 0), nightly: Number(pricing.nightly ?? 0), weeklyDiscountPct: Number(pricing.weeklyDiscountPct ?? 0) },
      raw: j,
    };
  } catch { return null; }
}

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedId?: string | number | null;
  apiBase: string;
  authToken?: string | null;
  onApprove?: (id: string | number) => void;
  onReject?: (id: string | number) => void;
};

export default function CampRequestDetailsDialog({ open, onOpenChange, selectedId, apiBase, authToken, onApprove, onReject }: Props) {
  const [details, setDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => parseJoinPayload(details?.rawPayloadJson), [details?.rawPayloadJson]);

  useEffect(() => {
    if (!open || !selectedId) return;
    const controller = new AbortController();
    (async () => {
      try {
        setDetailsLoading(true);
        setError(null);
        const res = await fetch(`${apiBase}/api/Camp/${selectedId}/details`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDetails(data);
      } catch (e: any) {
        setError("تعذر تحميل التفاصيل");
      } finally {
        setDetailsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [open, selectedId, apiBase, authToken]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl">تفاصيل الطلب</DialogTitle>
          <DialogDescription>معلومات كاملة عن طلب الانضمام</DialogDescription>
        </DialogHeader>

        {detailsLoading && <p className="text-center text-muted-foreground py-6">جارٍ تحميل التفاصيل…</p>}
        {error && <p className="text-center text-destructive py-6">{error}</p>}

        {details && (
          <div className="space-y-6">
            {/* Status and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">الحالة</label><div><StatusBadge status={details?.request?.status ?? "-"} /></div></div>
              <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">الاسم</label><p className="font-medium">{details?.request?.title || details?.camp?.title || "-"}</p></div>
              <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">النوع</label><p className="font-medium">{details?.request?.propertyType || "-"}</p></div>
              <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">المالك</label><p className="font-medium">{details?.camp?.ownerId || "-"}</p></div>
              <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">تاريخ التقديم</label><p className="font-medium">{formatDate(details?.request?.submittedOn)}</p></div>
            </div>

            {/* Structured join data */}
            {parsed && (
              <div className="space-y-6">
                {/* Basics */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">الأساسيات</label>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-muted-foreground">الاسم: </span><span className="font-medium">{parsed.basics.name}</span></div>
                    <div><span className="text-muted-foreground">النوع: </span><span className="font-medium">{parsed.basics.propertyType}</span></div>
                    {parsed.basics.website && <div><span className="text-muted-foreground">الموقع: </span><span className="font-medium">{parsed.basics.website}</span></div>}
                  </div>
                </div>

                {/* Location (from form) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">الموقع (من النموذج)</label>
                  <p className="text-sm font-medium">
                    {parsed.location.street && `${parsed.location.street}, `}
                    {parsed.location.city}{parsed.location.city && parsed.location.state ? ", " : ""}
                    {parsed.location.state}{(parsed.location.city || parsed.location.state) && parsed.location.country ? ", " : ""}
                    {parsed.location.country}{parsed.location.zip && ` - ${parsed.location.zip}`}
                  </p>
                </div>

                {/* Description */}
                {(parsed.description.summary || parsed.description.guestServices) && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {parsed.description.summary && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">الوصف</label>
                        <p className="text-sm bg-muted p-3 rounded">{parsed.description.summary}</p>
                      </div>
                    )}
                    {parsed.description.guestServices && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">خدمات الضيوف</label>
                        <p className="text-sm bg-muted p-3 rounded">{parsed.description.guestServices}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Capacity & Beds */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">السعة والأسِرّة</label>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-muted-foreground">الضيوف: </span><span className="font-medium">{parsed.capacity.maxGuests}</span></div>
                    <div><span className="text-muted-foreground">الغرف: </span><span className="font-medium">{parsed.capacity.bedrooms}</span></div>
                    <div className="sm:col-span-3">
                      {parsed.capacity.beds.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {parsed.capacity.beds.map((b: any) => (
                            <span key={b.key} className="px-2 py-1 rounded bg-muted text-xs">{b.label} × {b.count}</span>
                          ))}
                        </div>
                      ) : <span className="text-sm text-muted-foreground">لا توجد أسِرّة محددة</span>}
                    </div>
                  </div>
                </div>

                {/* Facilities & Amenities */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">المرافق</label>
                    {parsed.facilities.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {parsed.facilities.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                      </div>
                    ) : <p className="text-sm text-muted-foreground">لا توجد مرافق</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">المزايا</label>
                    {["basic","bath","kitchen","outdoor"].map((k) => {
                      const arr = (parsed.amenities as any)[k] as string[];
                      if (!arr || arr.length === 0) return null;
                      const title = k === "basic" ? "أساسية" : k === "bath" ? "حمّام" : k === "kitchen" ? "مطبخ" : "خارجية";
                      return (
                        <div key={k}>
                          <div className="text-xs text-muted-foreground mb-1">({title})</div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {arr.map((x, i) => <span key={`${k}-${i}`} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shared spaces */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">المساحات المشتركة</label>
                  {parsed.sharedSpaces.length > 0 ? (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {parsed.sharedSpaces.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">لا توجد مساحات مشتركة</p>}
                </div>

                {/* Activities & Terrain */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">الأنشطة</label>
                    {parsed.activities.options.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {parsed.activities.options.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                      </div>
                    ) : <p className="text-sm text-muted-foreground">لا توجد أنشطة</p>}
                    {parsed.activities.note && <p className="text-xs text-muted-foreground">ملاحظة: {parsed.activities.note}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">التضاريس</label>
                    {parsed.terrain.options.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {parsed.terrain.options.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                      </div>
                    ) : <p className="text-sm text-muted-foreground">لا توجد عناصر تضاريس</p>}
                    {parsed.terrain.surroundings && <p className="text-xs text-muted-foreground">البيئة المحيطة: {parsed.terrain.surroundings}</p>}
                  </div>
                </div>

                {/* Rules & Times */}
                <div className="grid sm:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-muted-foreground">الحد الأدنى للعمر: </span><span className="font-medium">{parsed.rules.minAge || "-"}</span></div>
                  <div><span className="text-muted-foreground">تسجيل الدخول من: </span><span className="font-medium">{parsed.rules.checkInFrom || "-"}</span></div>
                  <div><span className="text-muted-foreground">إلى: </span><span className="font-medium">{parsed.rules.checkInTo || "-"}</span></div>
                  <div><span className="text-muted-foreground">تسجيل الخروج: </span><span className="font-medium">{parsed.rules.checkOut || "-"}</span></div>
                </div>

                {/* Booking & Pricing */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">الحجز</label>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">الطريقة: </span><span className="font-medium">{parsed.booking.method || "-"}</span></div>
                      <div><span className="text-muted-foreground">إشعار مسبق (يوم): </span><span className="font-medium">{parsed.booking.advanceNoticeDays}</span></div>
                      <div><span className="text-muted-foreground">نافذة الحجز (شهر): </span><span className="font-medium">{parsed.booking.bookingWindowMonths}</span></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">التسعير</label>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">حد أدنى ليالٍ: </span><span className="font-medium">{parsed.pricing.minNights}</span></div>
                      <div><span className="text-muted-foreground">سعر الليلة: </span><span className="font-medium">{parsed.pricing.nightly}</span></div>
                      <div><span className="text-muted-foreground">خصم أسبوعي %: </span><span className="font-medium">{parsed.pricing.weeklyDiscountPct}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Images */}
            {Array.isArray(details?.request?.images) && details.request.images.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> الصور ({details.request.images.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {details.request.images.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-video rounded-md overflow-hidden bg-muted">
                      <img
                        src={buildImageUrl(img) || FALLBACK}
                        alt={`صورة ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          {String(details?.request?.status) === "0" && (
            <>
              <Button variant="default" onClick={() => details && onApprove?.(details.request.id)} className="bg-emerald-500 hover:bg-emerald-600">
                <CheckCircle className="ml-2 h-4 w-4" />
                موافقة
              </Button>
              <Button variant="destructive" onClick={() => details && onReject?.(details.request.id)}>
                <XCircle className="ml-2 h-4 w-4" />
                رفض
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>إغلاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
