// src/pages/Admin/AdminCustomers.tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/dialog-alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { Search, Eye, Shield, UserX, UserCheck, ChevronLeft, ChevronRight, Calendar, Mail, Phone } from "lucide-react";
import { api } from "../lib/api";

type PagedResult<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
};

type ApiUser = {
  id: string;
  userName?: string | null;
  displayName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  isActive?: boolean | null;
  createdOn?: string | null;
  roles?: string[] | null;
};

type UserDetails = ApiUser & {
  lastLoginOn?: string | null;
  bookingsCount?: number | null; // اختياري إن توفر من الخادم
};

const StatusPill = ({ active }: { active?: boolean | null }) => (
  <Badge variant="outline" className={active ? "border-emerald-500 text-emerald-600" : "border-rose-500 text-rose-600"}>
    {active ? "نشط" : "مُعطّل"}
  </Badge>
);

export default function AdminCustomers(): JSX.Element {
  // قائمة العملاء
  const [rows, setRows] = useState<ApiUser[]>([]);
  const [count, setCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  // حالة التحميل
  const [loading, setLoading] = useState<boolean>(true);

  // تفاصيل
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  // تعطيل/تفعيل
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [targetUser, setTargetUser] = useState<ApiUser | null>(null);
  const [toggling, setToggling] = useState<boolean>(false);

  // فلتر حالة الحساب
  const [statusFilter, setStatusFilter] = useState<string>("all"); // all | active | disabled

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  // استدعاءات الخدمة (قابلة للتبديل مع Endpoints لديك)
  async function fetchCustomers(signal?: AbortSignal) {
    setLoading(true);
    try {
      const params: any = {
        PageIndex: pageIndex,
        PageSize: pageSize,
        Role: "صاحب_مخيم",
        Search: search?.trim() || undefined,
        Status: statusFilter !== "all" ? statusFilter : undefined,
      };
      debugger
      const res = await api.get<PagedResult<ApiUser>>("/api/User", { params, signal });
      console.log("res", res);
      
      setRows(res.data.data || []);
      setCount(res.data.count || 0);
    } catch (e: any) {
      if (e?.name !== "CanceledError") toast.error(e?.response?.data?.message || "تعذر تحميل العملاء");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserDetails(userId: string) {
    setDetailsLoading(true);
    try {
      const res = await api.get<UserDetails>(`/api/User/${userId}`);
      setDetails(res.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "تعذر جلب تفاصيل العميل");
      setDetailsOpen(false);
      setSelectedId(null);
    } finally {
      setDetailsLoading(false);
    }
  }

  async function toggleActive(user: ApiUser, makeActive: boolean) {
    setToggling(true);
    try {
      // غيّر المسار حسب خادمك: أمثلة ممكنة
      // PUT /api/Users/{id}/activate  أو  /api/Users/{id}/deactivate
      const url = makeActive ? `/api/User/${user.id}/activate` : `/api/User/${user.id}/deactivate`;
      await api.put(url);
      toast.success(makeActive ? "تم تفعيل العميل" : "تم تعطيل العميل");

      // حدّث القائمة محليًا
      setRows(prev => prev.map(r => (r.id === user.id ? { ...r, isActive: makeActive } : r)));
      if (details?.id === user.id) setDetails({ ...(details as UserDetails), isActive: makeActive });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "تعذر تنفيذ العملية");
    } finally {
      setToggling(false);
      setConfirmOpen(false);
      setTargetUser(null);
    }
  }

  // تحميل القائمة
  useEffect(() => {
    const ctrl = new AbortController();
    fetchCustomers(ctrl.signal);
    return () => ctrl.abort();
  }, [pageIndex, pageSize, statusFilter]); // search بديله Debounce أدناه

  // Debounce للبحث
  useEffect(() => {
    const t = setTimeout(() => {
      setPageIndex(1);
      const ctrl = new AbortController();
      fetchCustomers(ctrl.signal);
      return () => ctrl.abort();
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const onOpenDetails = (u: ApiUser) => {
    setSelectedId(u.id);
    setDetails(null);
    setDetailsOpen(true);
    fetchUserDetails(u.id);
  };

  const headerStats = useMemo(() => {
    const active = rows.filter(r => r.isActive).length;
    const disabled = rows.length - active;
    return { active, disabled };
  }, [rows]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-foreground">إدارة العملاء</h1>
          <p className="text-muted-foreground">إشراف كامل على العملاء، البحث، التصفية، والتفعيل/التعطيل.</p>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="بحث بالاسم أو الإيميل أو الهاتف..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="الحالة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="disabled">مُعطّل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Page Size */}
            <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPageIndex(1); }}>
              <SelectTrigger className="w-32"><SelectValue placeholder="عدد السجلات" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 عملاء</SelectItem>
                <SelectItem value="20">20 عميل</SelectItem>
                <SelectItem value="50">50 عميل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-emerald-600">نشطون (صفحة حالية)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{headerStats.active}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-rose-600">مُعطّلون (صفحة حالية)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">{headerStats.disabled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading */}
        {loading && <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">جارٍ التحميل...</p></CardContent></Card>}

        {/* Empty */}
        {!loading && rows.length === 0 && (
          <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">
            {search || statusFilter !== "all" ? "لا توجد نتائج مطابقة للبحث" : "لا يوجد عملاء حالياً."}
          </p></CardContent></Card>
        )}

        {/* Table */}
        {!loading && rows.length > 0 && (
          <Card className="animate-fade-in">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">#</TableHead>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الإيميل</TableHead>
                      <TableHead className="text-right">الهاتف</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      {/* <TableHead className="text-right">تاريخ الإنشاء</TableHead> */}
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((u, idx) => (
                      <TableRow key={u.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{(pageIndex - 1) * pageSize + idx + 1}</TableCell>
                        <TableCell>{u.displayName || u.userName || "-"}</TableCell>
                        <TableCell>{u.email || "-"}</TableCell>
                        <TableCell>{u.phoneNumber || "-"}</TableCell>
                        <TableCell><StatusPill active={u.isActive} /></TableCell>
                        {/* <TableCell>{u.createdOn ? new Date(u.createdOn).toLocaleDateString("ar-SA") : "-"}</TableCell> */}
                        <TableCell className="space-x-2 space-x-reverse">
                          <Button variant="outline" size="sm" onClick={() => onOpenDetails(u)} className="transition-all duration-200 hover:scale-105 active:scale-95">
                            <Eye className="ml-2 h-4 w-4" /> تفاصيل
                          </Button>
                          {u.isActive ? (
                            <Button variant="outline" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-600/10" onClick={() => { setTargetUser(u); setConfirmOpen(true); }}>
                              <UserX className="ml-2 h-4 w-4" /> تعطيل
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-600/10" onClick={() => { setTargetUser(u); setConfirmOpen(true); }}>
                              <UserCheck className="ml-2 h-4 w-4" /> تفعيل
                            </Button>
                          )}
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
            <p className="text-sm text-muted-foreground">صفحة {pageIndex} من {totalPages} — إجمالي {count}</p>
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

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">تفاصيل العميل</DialogTitle>
            <DialogDescription>بيانات أساسية حول العميل المختار</DialogDescription>
          </DialogHeader>

          {detailsLoading && <p className="text-center text-muted-foreground py-6">جارٍ تحميل التفاصيل…</p>}

          {details && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">الاسم</span>
                  <div className="font-medium">{details.displayName || details.userName || "-"}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">الحالة</span>
                  <div><StatusPill active={details.isActive} /></div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">الإيميل</span>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> <span className="font-medium">{details.email || "-"}</span></div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">الهاتف</span>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> <span className="font-medium">{details.phoneNumber || "-"}</span></div>
                </div>
                {/* <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">تاريخ الإنشاء</span>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> <span className="font-medium">{details.createdOn ? new Date(details.createdOn).toLocaleString("ar-SA") : "-"}</span></div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">آخر دخول</span>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> <span className="font-medium">{details.lastLoginOn ? new Date(details.lastLoginOn).toLocaleString("ar-SA") : "-"}</span></div>
                </div> */}
              </div>

              {Array.isArray(details.roles) && details.roles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">الأدوار</span>
                  <div className="flex flex-wrap gap-2">
                    {details.roles.map((r, i) => <Badge key={`${r}-${i}`} variant="secondary">{r}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Toggle Active Confirm */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد العملية</AlertDialogTitle>
            <AlertDialogDescription>
              {targetUser?.isActive
                ? `سيتم تعطيل حساب العميل "${targetUser?.displayName || targetUser?.userName}".`
                : `سيتم تفعيل حساب العميل "${targetUser?.displayName || targetUser?.userName}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={toggling}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              disabled={toggling}
              onClick={() => targetUser && toggleActive(targetUser, !targetUser.isActive)}
              className={targetUser?.isActive ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}
            >
              {toggling ? "جارٍ التنفيذ..." : targetUser?.isActive ? "تعطيل" : "تفعيل"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
