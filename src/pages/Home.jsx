// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageTransition from "@/components/PageTransition";
import CampCard from "@/components/CampCard";
import AlgeriaImage from "../assets/Algeria.jpg";
import bahrainImage from "../assets/Bahrain.jpg";
import egyptImage from "../assets/Egypt.jpg";
import jordanImage from "../assets/Jordan.jpg";
import kuwaitImage from "../assets/Kuwait.jpg";
import moroccoImage from "../assets/Morocco.jpg";
import omanImage from "../assets/Oman.jpg";
import qatarImage from "../assets/Qatar.jpg";
import saudiImage from "../assets/Saudi.jpg";
import uaeImage from "../assets/UAE.jpg";
import tunisiaImage from "../assets/Tunisia.jpg";
import { useToast } from "@/components/ui/use-toast";
import { listCamps, buildImageUrl } from "@/Service/api/camps";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";

const FALLBACK = "https://images.unsplash.com/photo-1532555283690-cbf89e69cec7";
const imageCover = (c) => {
  const cover = c?.images?.find?.((i) => i?.isCover) ?? (c?.images?.[0] || null);
  return cover?.imageUrl ? buildImageUrl(cover.imageUrl) : FALLBACK;
};

// الدول العربية (جامعة الدول العربية)
// const ARAB_COUNTRIES = [
//   "الجزائر","البحرين","جزر القمر","جيبوتي","مصر","العراق","الأردن","الكويت","لبنان","ليبيا",
//   "موريتانيا","المغرب","عمان","فلسطين","قطر","السعودية","الصومال","السودان","سوريا","تونس",
//   "الإمارات العربية المتحدة","اليمن",
// ];

const ARAB_COUNTRIES = [
  "عمان",

  // دول الخليج (عدا عُمان)
  "البحرين",
  "الكويت",
  "قطر",
  "السعودية",
  "الإمارات العربية المتحدة",

  // بعدها مصر ثم الأردن
  "مصر",
  "الأردن",

  // الباقي
  "الجزائر",
  // "جزر القمر",
  // "جيبوتي",
  // "العراق",
  // "لبنان",
  // "ليبيا",
  // "موريتانيا",
  "المغرب",
  // "فلسطين",
  // "الصومال",
  // "السودان",
  // "سوريا",
  "تونس",
  // "اليمن"
];


const FEATURED_COUNTRIES = [
  // { name: "لبنان", img: "" },
  { name: "الجزائر", img: AlgeriaImage },
  { name: "السعودية", img: saudiImage },
  { name: "عمان", img: omanImage },
  { name: "الإمارات", img: uaeImage },
  { name: "المغرب", img: moroccoImage },
  { name: "الأردن", img: jordanImage },
  { name: "مصر", img: egyptImage },
  { name: "تونس", img: tunisiaImage },
  { name: "قطر", img: qatarImage },
  { name: "الكويت", img: kuwaitImage },
  { name: "البحرين", img: bahrainImage },
];

// حركات
const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, delayChildren: 0.1, duration: 0.4 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } },
};

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // فلاتر
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");

  // معاينة المخيمات
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(9);

  // الحجز
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingCamp, setBookingCamp] = useState(null);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // حقول الحجز
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const waNumber = "01559434566";

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const params = { pageIndex, pageSize };
        if (country) params.country = country;
        if (stateName.trim()) params.state = stateName.trim();
        if (city.trim()) params.city = city.trim();

        const { data } = await listCamps(params);
        if (!alive) return;
        setRows(Array.isArray(data?.data) ? data.data : []);
      } catch {
        if (!alive) return;
        setError("تعذر جلب المخيمات");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [pageIndex, pageSize, country, stateName, city]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    query.set("page", "1");
    query.set("size", "12");
    if (country) query.set("country", country.trim());
    if (stateName.trim()) query.set("state", stateName.trim());
    if (city.trim()) query.set("city", city.trim());
    navigate(`/all-camps?${query.toString()}`);
  };

  const handleMapSearch = () => {
    toast({ title: "قريباً", description: "سيتم تفعيل البحث باستخدام الخارطة قريباً." });
  };

  const openBooking = (camp) => {
    setBookingCamp(camp);
    setCustomerName(""); setCustomerPhone("");
    setGuests(1); setStartDate(""); setEndDate(""); setNotes("");
    setBookingError(""); setBookingOpen(true);
  };

  const bookNow = () => {
    setBookingError("");
    if (!bookingCamp) return;
    if (!startDate || !endDate) { setBookingError("يرجى تحديد تاريخ الوصول والمغادرة."); return; }
    const sd = new Date(startDate), ed = new Date(endDate);
    if (isNaN(sd.getTime()) || isNaN(ed.getTime()) || sd > ed) { setBookingError("تواريخ غير صحيحة، تحقق من نطاق التاريخ."); return; }
    if (!Number.isFinite(Number(guests)) || Number(guests) < 1) { setBookingError("يرجى إدخال عدد ضيوف صحيح (1 فأكثر)."); return; }

    setBookingBusy(true);
    try {
      const title = bookingCamp?.title || `Camp #${bookingCamp?.id}`;
      const lines = [
        `طلب حجز مخيم`,
        `المخيم: ${title} (ID: ${bookingCamp?.id})`,
        `الوصول: ${startDate}`,
        `المغادرة: ${endDate}`,
        `الضيوف: ${guests}`,
        customerName?.trim() ? `الاسم: ${customerName.trim()}` : null,
        customerPhone?.trim() ? `الهاتف: ${customerPhone.trim()}` : null,
        notes?.trim() ? `ملاحظات: ${notes.trim()}` : null,
        `رابط المخيم: ${window.location.origin}/camps/${bookingCamp?.id}`,
      ].filter(Boolean);
      const text = encodeURIComponent(lines.join("\n"));
      window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank", "noopener,noreferrer");
    } finally {
      setBookingBusy(false);
    }
  };

  return (
    <PageTransition>
      {/* Filters over Hero */}
      <section className="relative mb-5">
        <HeroCarousel />

        {/* صندوق الفلاتر فوق السلايدر */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute inset-x-0 -bottom-25 z-30"
        >
          <div className="container">
            <div className="bg-background p-6 rounded-lg shadow-lg border">
              <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-sm text-muted-foreground">الدولة</label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
                      <SelectContent>
                        {ARAB_COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">المحافظة</label>
                    <Input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="اكتب اسم المحافظة" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">المدينة</label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="اكتب اسم المدينة" />
                  </div>

                  <div className="flex items-end">
                    <Button type="submit" className="w-full inline-flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      <span>بحث</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Button type="button" variant="outline" className="inline-flex items-center gap-2" onClick={handleMapSearch}>
                    <Map className="h-5 w-5" />
                    <span>ابحث باستخدام الخارطة</span>
                  </Button>
                  <Button variant="outline" type="button" onClick={() => { setCountry(""); setStateName(""); setCity(""); }}>
                    مسح الحقول
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* مسافة لتعويض رفع الفلاتر فوق السلايدر */}
      <div className="h-16 mt-5" />

      {/* Countries spotlight (12 بطاقة بصورة) */}
      <section className="py-10 mt-5">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-6"
          >
            اكتشف وجهات عربية للتخييم
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {FEATURED_COUNTRIES.map((c) => (
              <motion.button
                key={c.name}
                variants={cardVariants}
                whileHover={{ scale: 1.03, rotate: 0.15 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/all-camps?country=${encodeURIComponent(c.name)}&page=1&size=12`)}
                className="group relative rounded-xl overflow-hidden border bg-background shadow hover:shadow-lg transition-shadow"
                title={`عرض مخيمات ${c.name}`}
              >
                <img
                  src={c.img}
                  alt={`التخييم في ${c.name}`}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = FALLBACK; }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                <div className="absolute bottom-2 right-2">
                  <span className="inline-block px-2 py-1 text-xs md:text-sm rounded bg-black/55 text-white shadow">
                    {c.name}
                  </span>
                </div>
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-colors" />
              </motion.button>
            ))}
          </motion.div>

          {/* كل الدول كبطاقات أسماء فقط */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold mb-3">كل الدول</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {ARAB_COUNTRIES.map((n) => (
                <motion.button
                  key={n}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/all-camps?country=${encodeURIComponent(n)}&page=1&size=12`)}
                  className="rounded-full border bg-background px-4 py-2 text-sm shadow-sm hover:shadow transition"
                  title={`عرض مخيمات ${n}`}
                >
                  {n}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Camps grid */}
      <section className="py-20 bg-muted/40">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">المخيمات</h2>

          {loading ? (
            <div className="py-16 text-center text-muted-foreground">جارٍ التحميل…</div>
          ) : error ? (
            <div className="py-16 text-center text-destructive">{error}</div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">لا توجد نتائج</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rows.map((camp, index) => (
                  <CampCard
                    key={camp?.id || index}
                    id={camp?.id || 0}
                    image={imageCover(camp)}
                    title={camp?.title || "-"}
                    country={camp?.country ?? camp?.countryName ?? camp?.countryObj}
                    state={camp?.state ?? camp?.stateName ?? camp?.stateObj}
                    city={camp?.city ?? camp?.cityName ?? camp?.cityObj}
                    rating={camp?.reviewsAverage || 0}
                    price={camp?.priceWeekdays || camp?.priceHolidays || 0}
                    onBookClick={() => openBooking(camp)}
                  />
                ))}
              </div>

              <div className="pt-10 text-center">
                <Button size="lg" asChild>
                  <Link to="/all-camps">اعرض جميع المخيمات</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Booking dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء حجز</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {bookingCamp ? `المخيم: ${bookingCamp?.title}` : ""}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">تاريخ الوصول</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">تاريخ المغادرة</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">عدد الضيوف</label>
                <Input type="number" min={1} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">اسم العميل (اختياري)</label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="الاسم بالكامل" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground">هاتف (اختياري)</label>
                <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="رقم الهاتف" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground">ملاحظات (اختياري)</label>
                <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أي تفاصيل إضافية" />
              </div>
            </div>

            {bookingError && <div className="text-xs text-destructive">{bookingError}</div>}

            <Button className="w-full flex items-center justify-center gap-2" type="button" onClick={bookNow} disabled={bookingBusy}>
              <svg viewBox="0 0 32 32" className="w-4 h-4" aria-hidden="true">
                <path fill="#25D366" d="M19.11 17.67c-.3-.15-1.77-.87-2.05-.97-.28-.1-.49-.15-.7.15-.21.3-.8.97-.98 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.5-1.77-1.68-2.07-.18-.3-.02-.47.13-.62.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53l-.6-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.18-1.41-.07-.13-.26-.2-.56-.35z"/>
                <path fill="#25D366" d="M26.6 5.4C23.7 2.5 20 1 16 1 8.8 1 3 6.8 3 14c0 2.4.6 4.7 1.8 6.7L3 31l10.5-1.7c1.9 1 4.1 1.7 6.5 1.7 7.2 0 13-5.8 13-13 0-4-1.6-7.7-4.4-10.6zM16 28.7c-2.1 0-4.1-.6-5.9-1.6l-.4-.2-6.2 1 1.2-6-.2-.4C3.6 19.5 3 16.8 3 14 3 7.5 8.5 2 15 2c3.7 0 7.1 1.5 9.5 3.9C26.9 7.5 28 10.1 28 13c0 6.5-5.5 11.7-12 11.7z"/>
              </svg>
              {bookingBusy ? "جارٍ إنشاء الحجز…" : "احجز الآن (واتساب)"}
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingOpen(false)}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
