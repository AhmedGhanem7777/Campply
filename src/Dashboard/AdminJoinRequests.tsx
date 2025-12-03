import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "../components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../components/ui/dialog-alert";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { toast } from "../components/ui/use-toast";
import { ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle, Search, Image as ImageIcon, Loader2 } from "lucide-react";

// ===== Types =====
interface CampRequestListItem {
  id: number;
  title: string;
  propertyType?: string | null;
  status: 0 | 1 | 2; // 0=Pending, 1=Approved, 2=Rejected
  ownerId?: string | null;
  createdOn: string;
}

interface CampRequestDetails {
  id: number;
  status: 0 | 1 | 2;
  title: string;
  propertyType?: string | null;
  ownerId?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  zip?: string | null;
  street?: string | null;
  maxGuests?: number;
  bedrooms?: number;
  summary?: string | null;
  images?: string[];
  submittedOn?: string;
  rawPayloadJson: string;
}

// ===== Status Badge =====
const StatusBadge = ({ status }: { status: 0 | 1 | 2 }) => {
  const statusMap = {
    0: { label: "قيد الانتظار", className: "bg-amber-500 hover:bg-amber-500/80" },
    1: { label: "موافق عليه", className: "bg-emerald-500 hover:bg-emerald-500/80" },
    2: { label: "مرفوض", className: "bg-rose-500 hover:bg-rose-500/80" },
  } as const;
  const config = statusMap[status];
  return <Badge variant="default" className={config.className}>{config.label}</Badge>;
};

// ===== Helpers to parse joinDataJson into structured UI data (labels only) =====
const BED_LABELS: Record<string, string> = {
  king: "سرير كينغ",
  queen: "سرير كوين",
  double: "سرير مزدوج",
  twin: "سرير مفرد",
  bunk: "سرير بطابقين",
  sofa: "سرير أريكة",
  crib: "سرير أطفال",
  air: "سرير هوائي",
};

function toArray<T = string>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

// ===== Helper: parse server error =====
async function readErrorMessage(res: Response) {
  try {
    const text = await res.text();
    try {
      const j = JSON.parse(text);
      return j.message || j.title || text || `HTTP ${res.status}`;
    } catch {
      return text || `HTTP ${res.status}`;
    }
  } catch {
    return `HTTP ${res.status}`;
  }
}

export default function AdminJoinRequests({ apiBase = "https://omancamps.com", authToken = "" }: { apiBase?: string; authToken?: string; }) {
  // UI state
  const [list, setList] = useState<CampRequestListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [details, setDetails] = useState<CampRequestDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Actions dialogs
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Action loaders
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPageIndex(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ===== Fetch list =====
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/camp-requests?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
          headers: { Authorization: `Bearer ${authToken}` },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(await readErrorMessage(res));
        const data = await res.json();
        let items: CampRequestListItem[] = data.items || [];

        // Client-side search + filter
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          items = items.filter(r =>
            (r.title || "").toLowerCase().includes(q) ||
            (r.propertyType || "").toLowerCase().includes(q) ||
            (r.ownerId || "").toLowerCase().includes(q)
          );
        }
        if (statusFilter !== "all") {
          const s = parseInt(statusFilter, 10) as 0 | 1 | 2;
          items = items.filter(r => r.status === s);
        }

        setList(items);
        setTotalItems(data.totalItems ?? items.length);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.error(e);
        toast({ title: "خطأ", description: String(e?.message || e) });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
    return () => controller.abort();
  }, [apiBase, authToken, pageIndex, pageSize, debouncedSearch, statusFilter]);

  // Derived
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pendingCount = useMemo(() => list.filter(r => r.status === 0).length, [list]);
  const approvedCount = useMemo(() => list.filter(r => r.status === 1).length, [list]);
  const rejectedCount = useMemo(() => list.filter(r => r.status === 2).length, [list]);

  // ===== Fetch details on open =====
  useEffect(() => {
    if (!selectedId || !detailsOpen) return;
    const controller = new AbortController();
    const load = async () => {
      setDetailsLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/camp-requests/${selectedId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(await readErrorMessage(res));
        const data: CampRequestDetails = await res.json();
        setDetails(data);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.error(e);
        toast({ title: "خطأ", description: String(e?.message || e) });
        setDetailsOpen(false);
        setSelectedId(null);
      } finally {
        setDetailsLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [selectedId, detailsOpen, apiBase, authToken]);

  // Open details
  const openDetails = (id: number) => {
    setSelectedId(id);
    setDetails(null);
    setDetailsOpen(true);
  };

  // Approve
  const approve = async (id: number) => {
    const res = await fetch(`${apiBase}/api/camp-requests/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error(await readErrorMessage(res));
    setList(prev => prev.map(r => (r.id === id ? { ...r, status: 1 } : r)));
    toast({ title: "نجح", description: "تمت الموافقة على الطلب." });
    setDetailsOpen(false);
    setSelectedId(null);
  };

  // Reject
  const reject = async (id: number) => {
    const qs = new URLSearchParams();
    if (rejectReason?.trim()) qs.set("reason", rejectReason.trim().slice(0, 300));
    const res = await fetch(`${apiBase}/api/camp-requests/${id}/reject?${qs.toString()}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) throw new Error(await readErrorMessage(res));
    setList(prev => prev.map(r => (r.id === id ? { ...r, status: 2 } : r)));
    toast({ title: "نجح", description: rejectReason ? `تم رفض الطلب: ${rejectReason}` : "تم رفض الطلب." });
    setDetailsOpen(false);
    setSelectedId(null);
    setRejectReason("");
  };

  const formatDate = (s?: string) => {
    if (!s) return "-";
    try {
      return new Date(s).toLocaleString("ar-SA", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch { return s; }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-foreground">طلبات الانضمام</h1>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="بحث بالاسم، النوع، أو المالك..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10" />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="0">قيد المراجعه</SelectItem>
                  <SelectItem value="1">موافق عليها</SelectItem>
                  <SelectItem value="2">مرفوضة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Page Size */}
            <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPageIndex(1); }}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 طلبات</SelectItem>
                <SelectItem value="20">20 طلب</SelectItem>
                <SelectItem value="50">50 طلب</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-all duration-200"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalItems}</div></CardContent></Card>
          <Card className="hover:shadow-lg transition-all duration-200"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-amber-600">قيد المراجعه</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-amber-600">{pendingCount}</div></CardContent></Card>
          <Card className="hover:shadow-lg transition-all duration-200"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-emerald-600">موافق عليها</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{approvedCount}</div></CardContent></Card>
          <Card className="hover:shadow-lg transition-all duration-200"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-rose-600">مرفوضة</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-rose-600">{rejectedCount}</div></CardContent></Card>
        </div>

        {/* Loading */}
        {loading && <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">جارٍ التحميل...</p></CardContent></Card>}

        {/* Empty */}
        {!loading && list.length === 0 && (
          <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">
            {debouncedSearch || statusFilter !== "all" ? "لا توجد نتائج مطابقة للبحث" : "لا توجد طلبات حالياً."}
          </p></CardContent></Card>
        )}

        {/* Table */}
        {!loading && list.length > 0 && (
          <Card className="animate-fade-in">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">#</TableHead>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">المالك</TableHead>
                      <TableHead className="text-right">تاريخ التقديم</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.title || "-"}</TableCell>
                        <TableCell>{request.propertyType || "-"}</TableCell>
                        <TableCell><StatusBadge status={request.status} /></TableCell>
                        <TableCell>{request.ownerId || "-"}</TableCell>
                        <TableCell>{formatDate(request.createdOn)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => openDetails(request.id)} className="transition-all duration-200 hover:scale-105 active:scale-95">
                            <Eye className="ml-2 h-4 w-4" /> تفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">صفحة {pageIndex} من {totalPages} — إجمالي {totalItems}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.max(1, p - 1))} disabled={pageIndex === 1}>
                <ChevronRight className="ml-2 h-4 w-4" /> السابق
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))} disabled={pageIndex === totalPages}>
                التالي <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details Dialog — MATCH MyCamps */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">تفاصيل الطلب</DialogTitle>
            <DialogDescription>معلومات كاملة عن طلب الانضمام</DialogDescription>
          </DialogHeader>

          {detailsLoading && <p className="text-center text-muted-foreground py-6">جارٍ تحميل التفاصيل…</p>}

          {details && (
            <div className="space-y-6">
              {/* Status and Basic Info (top-level) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">الحالة</label><div><StatusBadge status={details.status} /></div></div>
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">الاسم</label><p className="font-medium">{details.title || "-"}</p></div>
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">النوع</label><p className="font-medium">{details.propertyType || "-"}</p></div>
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">المالك</label><p className="font-medium">{details.ownerId || "-"}</p></div>
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">تاريخ التقديم</label><p className="font-medium">{formatDate(details.submittedOn)}</p></div>
              </div>

              {/* Structured join data — EXACT like MyCamps (inline parsed) */}
              {details.rawPayloadJson && (() => {
                try {
                  const j = details.rawPayloadJson ? JSON.parse(details.rawPayloadJson) : {};
                  const basics = j.basics || {};
                  const location = j.location || {};
                  const description = j.description || {};
                  const capacity = j.capacity || {};
                  const facilities = j.facilities || {};
                  const amenities = j.amenities || {};
                  const sharedSpaces = toArray<string>(j.sharedSpaces);
                  const seclusion = toArray<string>(j.seclusion);
                  const activities = j.activities || {};
                  const terrainRaw = j.terrain || {};
                  const rules = j.rules || {};
                  const booking = j.booking || {};
                  const pricing = j.pricing || {};
                  const profile = j.profile || {};
                  const profileDoc = (profile.document || {}) as { type?: string; number?: string; countryOfIssue?: string };

                  const bedsObj = capacity.beds || {};
                  const bedsArray = Object.keys(bedsObj)
                    .map((k) => ({ key: k, label: BED_LABELS[k] || k, count: Number(bedsObj[k] || 0) }))
                    .filter((b) => b.count > 0);

                  const facilitiesArr = toArray<string>((facilities as any).facilities) || toArray<string>(facilities);
                  const amenitiesObj = {
                    basic: toArray<string>(amenities.basic),
                    bath: toArray<string>(amenities.bath),
                    kitchen: toArray<string>(amenities.kitchen),
                    outdoor: toArray<string>(amenities.outdoor),
                  };
                  const activitiesArr = toArray<string>(activities.options);
                  const terrainArr = Array.isArray(terrainRaw) ? terrainRaw : toArray<string>(terrainRaw.options);

                  const weekday = (pricing.weekday || {}) as any;
                  const holiday = (pricing.holiday || {}) as any;

                  return (
                    <div className="space-y-6">
                      {/* Basics */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">الأساسيات</label>
                        <div className="grid sm:grid-cols-3 gap-3 text-sm">
                          <div><span className="text-muted-foreground">الاسم: </span><span className="font-medium">{basics.name || "-"}</span></div>
                          <div><span className="text-muted-foreground">النوع: </span><span className="font-medium">{basics.propertyType || "-"}</span></div>
                          {basics.website && <div><span className="text-muted-foreground">الموقع: </span><span className="font-medium">{basics.website}</span></div>}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">الموقع</label>
                        <p className="text-sm font-medium">
                          {location.street && `${location.street}, `}
                          {location.city}{location.city && location.state ? ", " : ""}
                          {location.state}{(location.city || location.state) && location.country ? ", " : ""}
                          {location.country}{location.zip && ` - ${location.zip}`}
                        </p>
                      </div>

                      {/* Document info from profile */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">بيانات الوثيقة</label>
                        <div className="grid sm:grid-cols-3 gap-3 text-sm">
                          <div><span className="text-muted-foreground">نوع الوثيقة: </span><span className="font-medium">{profileDoc.type || "-"}</span></div>
                          <div><span className="text-muted-foreground">رقم الوثيقة: </span><span className="font-medium">{profileDoc.number || "-"}</span></div>
                          <div><span className="text-muted-foreground">بلد الإصدار: </span><span className="font-medium">{profileDoc.countryOfIssue || "-"}</span></div>
                        </div>
                      </div>

                      {/* Description */}
                      {(description.summary || description.guestServices) && (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {description.summary && (
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-muted-foreground">الوصف</label>
                              <p className="text-sm bg-muted p-3 rounded">{description.summary}</p>
                            </div>
                          )}
                          {description.guestServices && (
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-muted-foreground">خدمات الضيوف</label>
                              <p className="text-sm bg-muted p-3 rounded">{description.guestServices}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Capacity & Beds */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">السعة والأسِرّة</label>
                        <div className="grid sm:grid-cols-3 gap-3 text-sm">
                          <div><span className="text-muted-foreground">الضيوف: </span><span className="font-medium">{Number(capacity.maxGuests ?? 0)}</span></div>
                          <div><span className="text-muted-foreground">الغرف: </span><span className="font-medium">{Number(capacity.bedrooms ?? 0)}</span></div>
                          <div className="sm:col-span-3">
                            {bedsArray.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {bedsArray.map((b: any) => (
                                  <span key={b.key} className="px-2 py-1 rounded bg-muted text-xs">{b.label} × {b.count}</span>
                                ))}
                              </div>
                            ) : <span className="text-sm text-muted-foreground">لا توجد أسِرّة محددة</span>}
                          </div>
                        </div>
                      </div>

                      {/* Facilities & Amenities */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">المرافق</label>
                          {facilitiesArr.length > 0 ? (
                            <div className="flex flex-wrap gap-2 text-xs">
                              {facilitiesArr.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                            </div>
                          ) : <p className="text-sm text-muted-foreground">لا توجد مرافق</p>}
                        </div> */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">المزايا</label>
                          {["basic","bath","kitchen","outdoor"].map((k) => {
                            const arr = (amenitiesObj as any)[k] as string[];
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
                        {sharedSpaces.length > 0 ? (
                          <div className="flex flex-wrap gap-2 text-xs">
                            {sharedSpaces.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                          </div>
                        ) : <p className="text-sm text-muted-foreground">لا توجد مساحات مشتركة</p>}
                      </div>

                      {/* Seclusion & Activities & Terrain */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">العزلة</label>
                          {seclusion.length > 0 ? (
                            <div className="flex flex-wrap gap-2 text-xs">
                              {seclusion.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                            </div>
                          ) : <p className="text-sm text-muted-foreground">غير محدد</p>}
                          <label className="text-sm font-medium text-muted-foreground mt-3 block">الأنشطة</label>
                          {activitiesArr.length > 0 ? (
                            <div className="flex flex-wrap gap-2 text-xs">
                              {activitiesArr.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                            </div>
                          ) : <p className="text-sm text-muted-foreground">لا توجد أنشطة</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">التضاريس</label>
                          {terrainArr.length > 0 ? (
                            <div className="flex flex-wrap gap-2 text-xs">
                              {terrainArr.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                            </div>
                          ) : <p className="text-sm text-muted-foreground">لا توجد عناصر تضاريس</p>}
                        </div>
                      </div>

                      {/* Rules & Times */}
                      <div className="grid sm:grid-cols-4 gap-3 text-sm">
                        <div><span className="text-muted-foreground">الحد الأدنى للعمر: </span><span className="font-medium">{Number(rules.minAge ?? 0) || "-"}</span></div>
                        <div><span className="text-muted-foreground">تسجيل الدخول : </span><span className="font-medium">{rules.checkInFrom || "-"}</span></div>
                        {/* <div><span className="text-muted-foreground">إلى: </span><span className="font-medium">{rules.checkInTo || "-"}</span></div> */}
                        <div><span className="text-muted-foreground">تسجيل الخروج: </span><span className="font-medium">{rules.checkOut || "-"}</span></div>
                      </div>

                      {/* Pricing (weekday/holiday with/without accommodation) */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">التسعير</label>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">أيام الأسبوع</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="bg-muted rounded p-2">مع المبيت: <span className="font-medium">{Number(weekday.withAccommodation ?? 0)}</span></div>
                              <div className="bg-muted rounded p-2">بدون مبيت: <span className="font-medium">{Number(weekday.withoutAccommodation ?? 0)}</span></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">العطلات</div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="bg-muted rounded p-2">مع المبيت: <span className="font-medium">{Number(holiday.withAccommodation ?? 0)}</span></div>
                              <div className="bg-muted rounded p-2">بدون مبيت: <span className="font-medium">{Number(holiday.withoutAccommodation ?? 0)}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } catch {
                  return null;
                }
              })()}

              {/* Images */}
              {Array.isArray(details.images) && details.images.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> الصور ({details.images.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {details.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-md overflow-hidden bg-muted">
                        <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {details?.status === 0 && (
              <>
                <Button
                  variant="default"
                  onClick={() => setApproveDialogOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-600"
                  disabled={approving || rejecting}
                  aria-busy={approving}
                >
                  {approving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : "موافقة"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setRejectDialogOpen(true)}
                  disabled={approving || rejecting}
                  aria-busy={rejecting}
                >
                  {rejecting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : "رفض"}
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setDetailsOpen(false)} disabled={approving || rejecting}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation */}
      <AlertDialog open={approveDialogOpen} onOpenChange={(o) => !approving && setApproveDialogOpen(o)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الموافقة</AlertDialogTitle>
            <AlertDialogDescription>سيتم اعتماد الطلب على الخادم وتحديث الحالة.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={approving}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!selectedId) return;
                try {
                  setApproving(true);
                  await approve(selectedId);
                  setApproveDialogOpen(false);
                } catch (e: any) {
                  toast({ title: "خطأ", description: String(e?.message || e) });
                } finally {
                  setApproving(false);
                }
              }}
              disabled={approving}
            >
              {approving ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الموافقة...</span> : "موافقة"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={(o) => !rejecting && setRejectDialogOpen(o)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الرفض</AlertDialogTitle>
            <AlertDialogDescription>يرجى إدخال سبب الرفض (اختياري) ثم تأكيد.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="سبب الرفض (اختياري)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="text-right"
              dir="rtl"
              disabled={rejecting}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectReason("")} disabled={rejecting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!selectedId) return;
                try {
                  setRejecting(true);
                  await reject(selectedId);
                  setRejectDialogOpen(false);
                } catch (e: any) {
                  toast({ title: "خطأ", description: String(e?.message || e) });
                } finally {
                  setRejecting(false);
                }
              }}
              disabled={rejecting}
            >
              {rejecting ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الرفض...</span> : "رفض"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
