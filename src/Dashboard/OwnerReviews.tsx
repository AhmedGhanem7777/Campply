// src/pages/Dashboard/OwnerReviews.tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { toast } from "sonner";
import { Star, Search, RefreshCw } from "lucide-react";
import { api } from "../lib/api";

type CampOption = { id: number; title: string };

type ReviewDto = {
  id: number;
  campId: number;
  userId?: string | null;
  userDisplayName?: string | null;
  email?: string | null;
  stars: number;
  comment?: string | null;
  createdOn?: string | null;
};

export default function OwnerReviews(): JSX.Element {
  // Camps owned by current user
  const [camps, setCamps] = useState<CampOption[]>([]);
  const [selectedCampId, setSelectedCampId] = useState<number | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [avg, setAvg] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>("");
  const [minStars, setMinStars] = useState<string>("all"); // all | 1..5

  // Pagination (client-side)
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const ownerId = localStorage.getItem("userId") || sessionStorage.getItem("userId") || "";

  // Load owner camps
  const loadCamps = async (signal?: AbortSignal) => {
    try {
      const res = await api.get("/api/Camp", {
        params: { OwnerId: ownerId, PageIndex: 1, PageSize: 100 },
        signal,
      });
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      const options = data.map((c: any) => ({ id: c.id, title: c.title as string }));
      setCamps(options);
      if (!selectedCampId && options.length > 0) {
        setSelectedCampId(options[0].id);
      }
    } catch (e: any) {
      if (e?.name !== "CanceledError") toast.error(e?.response?.data?.message || "تعذر تحميل المخيمات");
    }
  };

  const loadReviews = async (campId: number, signal?: AbortSignal) => {
    setLoading(true);
    try {
      const [listRes, avgRes] = await Promise.all([
        api.get<ReviewDto[]>(`/api/camps/${campId}/reviews`, { signal }),
        api.get<number>(`/api/camps/${campId}/reviews/average`, { signal }),
      ]);
      setReviews(Array.isArray(listRes.data) ? listRes.data : []);
      setAvg(typeof avgRes.data === "number" ? avgRes.data : 0);
    } catch (e: any) {
      if (e?.name !== "CanceledError") toast.error(e?.response?.data?.message || "تعذر تحميل التقييمات");
      setReviews([]);
      setAvg(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    loadCamps(ctrl.signal);
    return () => ctrl.abort();
  }, [ownerId]);

  useEffect(() => {
    if (!selectedCampId) return;
    const ctrl = new AbortController();
    loadReviews(selectedCampId, ctrl.signal);
    return () => ctrl.abort();
  }, [selectedCampId]);

  const onRefresh = () => {
    if (!selectedCampId) return;
    const ctrl = new AbortController();
    loadReviews(selectedCampId, ctrl.signal);
    setTimeout(() => ctrl.abort(), 15000);
  };

  // Filtered and paginated data
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minStars === "all" ? 0 : Number(minStars);
    return reviews
      .filter(r => (min === 0 || r.stars >= min))
      .filter(r => {
        if (!q) return true;
        const comment = (r.comment || "").toLowerCase();
        const email = (r.email || "").toLowerCase();
        const name = (r.userDisplayName || "").toLowerCase();
        return comment.includes(q) || email.includes(q) || name.includes(q);
      })
      .sort((a, b) => {
        const da = a.createdOn ? new Date(a.createdOn).getTime() : 0;
        const db = b.createdOn ? new Date(b.createdOn).getTime() : 0;
        if (db !== da) return db - da; // latest first
        return b.stars - a.stars;      // tie-break by stars
      });
  }, [reviews, search, minStars]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageIndex, pageSize]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-foreground">تقييمات مخيماتي</h1>
          <p className="text-muted-foreground">عرض تقييمات الزبائن لمخيماتك، مع بحث وترشيح حسب النجوم.</p>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Camp Selector */}
              <Select
                value={selectedCampId ? String(selectedCampId) : ""}
                onValueChange={(v) => { setSelectedCampId(Number(v)); setPageIndex(1); }}
              >
                <SelectTrigger className="w-full sm:w-80">
                  <SelectValue placeholder="اختر المخيم" />
                </SelectTrigger>
                <SelectContent>
                  {camps.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث في التعليقات أو الإيميل أو الاسم..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPageIndex(1); }}
                  className="pr-10"
                />
              </div>

              {/* Stars filter */}
              <Select value={minStars} onValueChange={(v) => { setMinStars(v); setPageIndex(1); }}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="النجوم" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل التقييمات</SelectItem>
                  <SelectItem value="5">5+ نجوم</SelectItem>
                  <SelectItem value="4">4+ نجوم</SelectItem>
                  <SelectItem value="3">3+ نجوم</SelectItem>
                  <SelectItem value="2">2+ نجوم</SelectItem>
                  <SelectItem value="1">1+ نجوم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onRefresh}><RefreshCw className="h-4 w-4 ml-2" /> تحديث</Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">المتوسط</CardTitle>
              <CardDescription>متوسط تقييم المخيم المختار</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>{avg?.toFixed?.(1) ?? "0.0"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">عدد التقييمات (المعروض)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filtered.length}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">الصفحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">صفحة {pageIndex} من {Math.max(1, totalPages)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading */}
        {loading && <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">جارٍ التحميل...</p></CardContent></Card>}

        {/* Empty */}
        {!loading && selectedCampId && filtered.length === 0 && (
          <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">لا توجد تقييمات.</p></CardContent></Card>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <Card className="animate-fade-in">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center align-middle">#</TableHead>
                      <TableHead className="text-center align-middle">النجوم</TableHead>
                      {/* <TableHead className="text-center align-middle">الإيميل</TableHead> */}
                      <TableHead className="text-center align-middle">التعليق</TableHead>
                      <TableHead className="text-center align-middle">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((r, i) => (
                      <TableRow key={r.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="text-center align-middle">{(pageIndex - 1) * pageSize + i + 1}</TableCell>
                        <TableCell className="text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            {Array.from({ length: r.stars }).map((_, k) => (
                              <Star key={k} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ))}
                            {Array.from({ length: Math.max(0, 5 - r.stars) }).map((_, k) => (
                              <Star key={`o-${k}`} className="h-4 w-4 text-muted-foreground" />
                            ))}
                          </div>
                        </TableCell>
                        {/* <TableCell className="text-center align-middle">{r.userDisplayName || "-"}</TableCell> */}
                        <TableCell className="text-center align-middle max-w-[420px]">
                          <ScrollArea className="max-h-[90px]">
                            <div className="text-sm whitespace-pre-wrap">{r.comment || "-"}</div>
                          </ScrollArea>
                        </TableCell>
                        <TableCell className="text-center align-middle">
                          {r.createdOn ? new Date(r.createdOn).toLocaleString("ar-SA") : "-"}
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
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">صفحة {pageIndex} من {totalPages} — إجمالي {filtered.length}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                disabled={pageIndex === 1}
              >
                السابق
              </Button>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPageIndex(1); }}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
                disabled={pageIndex === totalPages}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
