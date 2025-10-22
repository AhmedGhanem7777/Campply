// src/pages/DashboardContent.tsx
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Loader2, RefreshCw, Tent, CheckCircle2, Timer, XCircle, Star, CalendarClock, CalendarDays } from "lucide-react";
import { getDashboardStats, getBookingsTrend30d, type DashboardStats, type BookingTrendPoint } from "../Service/api/dashboard";

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trend, setTrend] = useState<BookingTrendPoint[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [errorTrend, setErrorTrend] = useState<string | null>(null);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // تطبيع بيانات الاتجاه لضمان المفاتيح day/count وسلسلة ISO للتاريخ
  const normalizeTrend = (arr: any): BookingTrendPoint[] => {
    if (!Array.isArray(arr)) return [];
    return arr.map((d) => {
      const dayVal = d?.day ?? d?.Day ?? d?.date ?? d?.Date;
      const countVal = d?.count ?? d?.Count ?? 0;
      const iso = dayVal instanceof Date ? dayVal.toISOString() : String(dayVal ?? "");
      return { day: iso, count: Number(countVal) || 0 };
    });
  };

  const loadAll = async () => {
    setLoading(true);
    setLoadingTrend(true);
    setError(null);
    setErrorTrend(null);
    try {
      const [statsRes, trendRes] = await Promise.all([getDashboardStats(), getBookingsTrend30d()]);

      setStats(statsRes.data);
      setTrend(normalizeTrend(trendRes.data));
      setLastUpdated(new Date());
    } catch {
      // جلب كل جزء على حدة
      try {
        const s = await getDashboardStats();
        setStats(s.data);
      } catch {
        setError("تعذر جلب إحصائيات لوحة التحكم");
      }
      try {
        const t = await getBookingsTrend30d();
        setTrend(normalizeTrend(t.data));
      } catch {
        setErrorTrend("تعذر جلب اتجاه الحجوزات");
      }
    } finally {
      setLoading(false);
      setLoadingTrend(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const fmt = (n?: number) => (typeof n === "number" ? n.toLocaleString() : "0");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-1">نظرة عامة سريعة على المخيمات والحجوزات والتقييمات</p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              آخر تحديث: {lastUpdated.toLocaleTimeString()}
            </Badge>
          )}
          <Button variant="outline" onClick={loadAll} disabled={loading || loadingTrend} className="inline-flex items-center gap-2">
            {loading || loadingTrend ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            تحديث
          </Button>
        </div>
      </div>

      {/* Loading / Error for stats */}
      {loading && (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          جارٍ تحميل الإحصائيات...
        </div>
      )}
      {error && !loading && <div className="text-center text-destructive">{error}</div>}

      {/* Stats */}
      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardDescription>إجمالي المخيمات</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Tent className="h-6 w-6 text-primary" />
                  {fmt(stats.totalCamps)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardDescription>المخيمات المفعلة</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  {fmt(stats.activeCamps)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-yellow-500/20">
              <CardHeader className="pb-2">
                <CardDescription>قيد المراجعة</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Timer className="h-6 w-6 text-yellow-500" />
                  {fmt(stats.waitingCamps)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader className="pb-2">
                <CardDescription>المرفوضة</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <XCircle className="h-6 w-6 text-destructive" />
                  {fmt(stats.rejectedCamps)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardDescription>متوسط التقييم</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  {stats.avgRating?.toFixed?.(2) ?? stats.avgRating}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground">
                  إجمالي المراجعات: <span className="font-semibold">{fmt(stats.totalReviews)}</span>
                </p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardDescription>ملخص الحجوزات</CardDescription>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CalendarClock className="h-6 w-6 text-primary" />
                  {fmt(stats.bookings.total)} حجز
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">معلّقة</div>
                  <div className="text-xl font-bold">{fmt(stats.bookings.pending)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">مقبولة</div>
                  <div className="text-xl font-bold">{fmt(stats.bookings.approved)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">مرفوضة</div>
                  <div className="text-xl font-bold">{fmt(stats.bookings.rejected)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">آخر 30 يوم</div>
                  <div className="text-xl font-bold">{fmt(stats.bookings.last30Days)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">آخر 7 أيام</div>
                  <div className="text-xl font-bold">{fmt(stats.bookings.last7Days)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">اليوم</div>
                  <div className="text-xl font-bold">{fmt(stats.bookings.today)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Separator />

      {/* Bookings Trend (30d) */}
      {/* <Card>
        <CardHeader className="pb-1">
          <CardDescription>اتجاه الحجوزات اليومي (آخر 30 يوم)</CardDescription>
          <CardTitle className="text-xl">Bookings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTrend ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              جارٍ تحميل الاتجاه...
            </div>
          ) : errorTrend ? (
            <div className="text-destructive text-sm">{errorTrend}</div>
          ) : trend && trend.length > 0 ? (
            <TrendBars data={trend} />
          ) : (
            <div className="text-muted-foreground">لا توجد بيانات اتجاه للعرض.</div>
          )}
        </CardContent>
      </Card> */}

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {lastUpdated ? `تم التحديث ${lastUpdated.toLocaleString()}` : "—"}
        </div>
        <Button variant="outline" onClick={loadAll} disabled={loading || loadingTrend} className="inline-flex items-center gap-2">
          {loading || loadingTrend ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          تحديث الآن
        </Button>
      </div>
    </div>
  );
}
