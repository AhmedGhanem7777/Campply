// src/pages/Favorites.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getFavorites, toggleFavorite } from "../lib/favorites";
import { useToast } from "../components/ui/use-toast";
import { getBasket } from "../Service/api/basket";
import type { CustomerBasketDto } from "../Service/api/basket";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { api } from "../lib/api";

type FavItem = {
  id: number | string;
  imageUrl?: string | null;
  title: string;
  location?: string | null;
  price?: number | null;
  currency?: string | null;
};

const FALLBACK = "https://images.unsplash.com/photo-1532555283690-cbf89e69cec7";

function currencyLabel(code?: string) {
  if (!code) return "USD";
  if (code === "SAR") return "ر.س";
  if (code === "AED") return "د.إ";
  if (code === "EGP") return "ج.م";
  return code;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavItem[]>([]);
  const [basket, setBasket] = useState<CustomerBasketDto | null>(null);
  const [removingId, setRemovingId] = useState<number | string | null>(null);
  const [loadingBasket, setLoadingBasket] = useState<boolean>(true);
  const [removingBasket, setRemovingBasket] = useState<boolean>(false);
  const { toast } = useToast();

  // حجز مثل Home
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingCamp, setBookingCamp] = useState<FavItem | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");

  const header = useMemo(
    () => ({
      pageTitle: "المخيمات المفضلة",
      emptyTitle: "لا توجد مخيمات مفضلة بعد",
      emptyHint: "ابدأ بإضافة مخيماتك المفضلة لتجدها هنا بسهولة",
      browse: "تصفح المخيمات",
      details: "التفاصيل",
      perNight: " / الليلة",
      remove: "حذف",
      clearAll: "مسح كل المفضلة",
      clearAllConfirm: "هل أنت متأكد من مسح جميع المفضلة؟",
      cleared: "تم مسح كل المفضلة",
      currencyFallback: "ر.س",
      basketSection: "عناصر السلة",
      basketEmpty: "السلة فارغة حالياً.",
      basketDelete: "حذف السلة",
      basketDeleteConfirm: "هل أنت متأكد من حذف السلة بالكامل؟",
      basketDeleted: "تم حذف السلة",
      bookNow: "احجز الآن",
    }),
    []
  );

  const loadFavorites = () => {
    const list = getFavorites() as FavItem[] | undefined;
    setFavorites(Array.isArray(list) ? list : []);
  };

  const loadBasket = async () => {
    setLoadingBasket(true);
    try {
      const b = await getBasket();
      setBasket(b);
    } catch {
      setBasket(null);
    } finally {
      setLoadingBasket(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    loadBasket();

    const onFavChanged = () => loadFavorites();
    const onBasketChanged = () => loadBasket();

    window.addEventListener("storage", onFavChanged);
    window.addEventListener("favorites-changed", onFavChanged as EventListener);
    window.addEventListener("basket-changed", onBasketChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onFavChanged);
      window.removeEventListener("favorites-changed", onFavChanged as EventListener);
      window.removeEventListener("basket-changed", onBasketChanged as EventListener);
    };
  }, []);

  const removeFavorite = async (id: number | string) => {
    const idx = favorites.findIndex((c) => String(c.id) === String(id));
    if (idx < 0) return;

    // تحديث متفائل
    const prev = favorites;
    const next = prev.filter((c) => String(c.id) !== String(id));
    setRemovingId(id);
    setFavorites(next);
    try {
      await Promise.resolve(toggleFavorite(prev[idx] as any));
      window.dispatchEvent(new CustomEvent("favorites-changed"));
      toast({ title: "تم حذف المخيم من المفضلة" });
    } catch (e: any) {
      setFavorites(prev);
      toast({ title: "تعذر الحذف", description: String(e?.message || e), variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  // مسح جميع المفضلة
  const clearAllFavorites = () => {
    if (!confirm(header.clearAllConfirm)) return;
    try {
      localStorage.removeItem("favorites");
      setFavorites([]);
      window.dispatchEvent(new CustomEvent("favorites-changed"));
      toast({ title: header.cleared });
    } catch (e: any) {
      toast({ title: "تعذر المسح", description: String(e?.message || e), variant: "destructive" });
    }
  };

  // استنتاج معرف السلة لإرساله كـ id في الاستعلام
  const resolveBasketId = (b?: CustomerBasketDto | null): string | undefined => {
    // شائع: id أو buyerId
    const id = (b as any)?.id || (b as any)?.buyerId || localStorage.getItem("buyerId") || undefined;
    return id ? String(id) : undefined;
  };

  // حذف السلة بالكامل عبر DELETE /api/Basket?id=...
  const deleteBasket = async () => {
    if (!basket) {
      toast({ title: "لا توجد سلة للحذف", variant: "destructive" });
      return;
    }
    const id = resolveBasketId(basket);
    if (!id) {
      toast({ title: "تعذر تحديد معرف السلة", variant: "destructive" });
      return;
    }
    if (!confirm(header.basketDeleteConfirm)) return;

    setRemovingBasket(true);
    try {
      await api.delete("/api/Basket", { params: { id } });
      setBasket(null);
      window.dispatchEvent(new CustomEvent("basket-changed"));
      toast({ title: header.basketDeleted });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "تعذر حذف السلة.";
      toast({ title: "خطأ", description: msg, variant: "destructive" });
    } finally {
      setRemovingBasket(false);
    }
  };

  // إظهار حالة فارغة فقط إذا كانت المفضلة فارغة وكذلك السلة خالية
  const showEmptyState =
    favorites.length === 0 &&
    (!basket || !Array.isArray(basket.items) || basket.items.length === 0);

  // فتح حوار الحجز لهذا العنصر
  const openBooking = (camp: FavItem) => {
    setBookingCamp(camp);
    setCustomerName("");
    setStartDate("");
    setEndDate("");
    setGuests(1);
    setNotes("");
    setBookingOpen(true);
  };

  const submitBooking = async () => {
    if (!bookingCamp) return;
    if (!customerName.trim() || !startDate || !endDate) {
      toast({
        title: "الحقول مطلوبة",
        description: "يرجى إدخال الاسم وتواريخ الوصول والمغادرة.",
        variant: "destructive",
      });
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast({
        title: "تواريخ غير صحيحة",
        description: "تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول.",
        variant: "destructive",
      });
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        campId: Number(bookingCamp.id),
        customerName: customerName.trim(),
        startDate,
        endDate,
        guests,
        notes: notes?.trim() || null,
      };
      await api.post("/api/Booking", payload);
      toast({ title: "تم إنشاء الحجز", description: "تم إرسال طلب الحجز بنجاح." });
      setBookingOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "تعذر إنشاء الحجز.";
      toast({ title: "خطأ", description: msg, variant: "destructive" });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* شريط علوي: عنوان + زر مسح كل المفضلة يسار */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            <h1 className="text-4xl font-bold">{header.pageTitle}</h1>
          </div>
        </div>

        {/* حالة فارغة: تظهر فقط عندما لا توجد مفضلة ولا عناصر في السلة */}
        {showEmptyState && (
          <Card className="p-12 text-center mb-10">
            <Heart className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">{header.emptyTitle}</h2>
            <p className="text-muted-foreground mb-6">{header.emptyHint}</p>
            <Button variant="default" asChild>
              <Link to="/camps">{header.browse}</Link>
            </Button>
          </Card>
        )}

        {/* بطاقات المفضلة: تُعرض فقط عند وجود عناصر */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {favorites.map((camp) => {
              const price =
                typeof camp.price === "number" && isFinite(camp.price || 0) ? camp.price : undefined;

              return (
                <Card
                  key={camp.id}
                  className="overflow-hidden shadow-nature-md hover:shadow-nature-lg transition-smooth"
                >
                  <div className="flex flex-col md:flex-row-reverse">
                    {/* الصورة يميناً */}
                    <div className="relative md:w-72 w-full h-48 md:h-auto flex-shrink-0">
                      <img
                        src={camp.imageUrl || FALLBACK}
                        alt={camp.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK;
                        }}
                        loading="lazy"
                      />
                    </div>

                    {/* المحتوى يساراً */}
                    <CardContent className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold mb-2 line-clamp-1">{camp.title}</h3>
                          </div>
                          {camp.location && (
                            <div className="flex items-center gap-2 text-muted-foreground mb-3">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">{camp.location}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavorite(camp.id)}
                          disabled={removingId === camp.id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-busy={removingId === camp.id}
                          aria-label="حذف من المفضلة"
                          title={header.remove}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* السعر + الأزرار */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-emerald-600">
                            {typeof price !== "undefined" ? price : 0} {header.currencyFallback}
                          </span>
                          <span className="text-muted-foreground text-sm">{header.perNight}</span>
                        </div>

                        <div className="flex gap-2">
                          {/* زر التفاصيل: يوجه لصفحة CampDetails */}
                          <Button variant="secondary" asChild>
                            <Link to={`/camps/${camp.id}`}>{header.details}</Link>
                          </Button>

                          {/* زر الحجز (يفتح نفس حوار Home) */}
                          <Button variant="default" onClick={() => openBooking(camp)}>
                            {header.bookNow}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ترويسة السلة + زر حذف السلة */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{header.basketSection}</h2>
          <Button
            variant="destructive"
            onClick={deleteBasket}
            disabled={removingBasket || loadingBasket || !basket}
            aria-busy={removingBasket}
            title={header.basketDelete}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            {removingBasket ? "جارٍ الحذف…" : header.basketDelete}
          </Button>
        </div>

        {/* عناصر السلة */}
        {loadingBasket ? (
          <Card className="p-6">
            <p className="text-muted-foreground">جارٍ تحميل السلة…</p>
          </Card>
        ) : !basket || !Array.isArray(basket.items) || basket.items.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground">{header.basketEmpty}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {basket.items.map((it, idx) => {
              const localCurrency = currencyLabel(it.currency || basket.currency);
              return (
                <Card
                  key={`${it.productId}-${idx}`}
                  className="overflow-hidden shadow-nature-md hover:shadow-nature-lg transition-smooth"
                >
                  <div className="flex flex-col md:flex-row-reverse">
                    {/* الصورة يميناً */}
                    <div className="relative md:w-72 w-full h-48 md:h-auto flex-shrink-0">
                      {it.pictureUrl ? (
                        <img
                          src={it.pictureUrl}
                          alt={it.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK;
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>

                    {/* المحتوى يساراً */}
                    <CardContent className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="min-w-0">
                          <h3 className="text-2xl font-bold mb-2 line-clamp-1">
                            {it.productName || "-"}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">المعرف: {it.productId}</span>
                          </div>
                        </div>
                      </div>

                      {/* السعر + الأزرار */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-emerald-600">
                            {it.unitPrice ?? 0} {localCurrency}
                          </span>
                          <span className="text-muted-foreground text-sm"> / الليلة</span>
                        </div>

                        <div className="flex gap-2">
                          {/* زر التفاصيل: يوجه لصفحة CampDetails */}
                          <Button variant="secondary" asChild>
                            <Link to={`/camps/${it.productId}`}>{header.details}</Link>
                          </Button>

                          {/* زر الحجز لعناصر السلة أيضاً */}
                          <Button
                            variant="default"
                            onClick={() =>
                              openBooking({
                                id: it.productId,
                                title: it.productName,
                                imageUrl: it.pictureUrl,
                                location: "",
                                price: it.unitPrice,
                                currency: it.currency,
                              })
                            }
                          >
                            {header.bookNow}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* حوار الحجز */}
        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إنشاء حجز</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {bookingCamp ? `المخيم: ${bookingCamp?.title}` : ""}
              </div>
              <div>
                <label className="block text-sm mb-1">الاسم الكامل</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: أحمد بن سالم"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">تاريخ الوصول</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">تاريخ المغادرة</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">عدد الضيوف</label>
                <Input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) =>
                    setGuests(Math.max(1, Number(e.target.value) || 1))
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1">ملاحظات</label>
                <textarea
                  className="w-full rounded-md border bg-background p-2 text-sm"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="هل لديك طلبات خاصة؟"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBookingOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={submitBooking} disabled={bookingLoading}>
                {bookingLoading ? "جارٍ الإرسال..." : "تأكيد الحجز"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Favorites;








