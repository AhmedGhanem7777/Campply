import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { MapPin, Star, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildImageUrl } from "@/Service/api/camps";
import { addItemToBasket } from "@/Service/api/basket";
import { api } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { da } from "zod/v4/locales";


import { WhatsAppCircle } from "@/pages/WhatsAppCircle";


const FALLBACK = "https://images.unsplash.com/photo-1532555283690-cbf89e69cec7";
const formatUSD = (v) =>
  new Intl.NumberFormat("ar", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(Number(v || 0));

function StatusBadge({ status }) {
  const s = String(status ?? "");
  const map = {
    "0": { text: "قيد المراجعة", cls: "bg-amber-100 text-amber-700" },
    "1": { text: "مقبول", cls: "bg-emerald-100 text-emerald-700" },
    "2": { text: "مرفوض", cls: "bg-rose-100 text-rose-700" },
  };
  const k = map[s] || { text: s || "-", cls: "bg-muted text-foreground" };
  return <span className={`px-2 py-1 text-xs rounded ${k.cls}`}>{k.text}</span>;
}

function toArray(v) { return Array.isArray(v) ? v : v ? [v] : []; }

const BED_LABELS = {
  king: "سرير كينغ",
  queen: "سرير كوين",
  double: "سرير مزدوج",
  twin: "سرير مفرد",
  bunk: "سرير طابقين",
  sofa: "أريكة",
  crib: "سرير طفل",
  air: "سرير هوائي",
};

function parseJoinPayload(raw) {
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
    const profile = j.profile || {};
    const profileDoc = (profile.document || {}) || {};

    const bedsObj = capacity.beds || {};
    const bedsArray = Object.keys(bedsObj)
      .map((k) => ({ key: k, label: BED_LABELS[k] || k, count: Number(bedsObj[k] ?? 0) }))
      .filter((b) => b.count > 0);

    const pdWeekday = pricing.weekday || {};
    const pdHoliday = pricing.holiday || {};

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
      pricing: {
        minNights: Number(pricing.minNights ?? 0),
        nightly: Number(pricing.nightly ?? 0),
        weeklyDiscountPct: Number(pricing.weeklyDiscountPct ?? 0),
        weekday: {
          withAccommodation: Number(pdWeekday.withAccommodation ?? NaN),
          withoutAccommodation: Number(pdWeekday.withoutAccommodation ?? NaN),
        },
        holiday: {
          withAccommodation: Number(pdHoliday.withAccommodation ?? NaN),
          withoutAccommodation: Number(pdHoliday.withoutAccommodation ?? NaN),
        },
      },
      raw: j,
      profile: {
        country: profile.country || "",
        currency: profile.currency || "",
        reason: profile.reason || "",
        document: {
          type: profileDoc.type || "",
          number: profileDoc.number || "",
          countryOfIssue: profileDoc.countryOfIssue || "",
        },
      },
    };
  } catch {
    return null;
  }
}

function formatDate(v) {
  if (!v) return "-";
  try { return new Date(v).toLocaleString("ar-SA"); } catch { return v; }
}

function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path fill="#25D366" d="M19.11 17.67c-.3-.15-1.77-.87-2.05-.97-.28-.1-.49-.15-.7.15-.21.3-.8.97-.98 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.5-1.77-1.68-2.07-.18-.3-.02-.47.13-.62.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53l-.6-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.18-1.41-.07-.13-.26-.2-.56-.35z"/>
      <path fill="#25D366" d="M26.6 5.4C23.7 2.5 20 1 16 1 8.8 1 3 6.8 3 14c0 2.4.6 4.7 1.8 6.7L3 31l10.5-1.7c1.9 1 4.1 1.7 6.5 1.7 7.2 0 13-5.8 13-13 0-4-1.6-7.7-4.4-10.6zM16 28.7c-2.1 0-4.1-.6-5.9-1.6l-.4-.2-6.2 1 1.2-6-.2-.4C3.6 19.5 3 16.8 3 14 3 7.5 8.5 2 15 2c3.7 0 7.1 1.5 9.5 3.9C26.9 7.5 28 10.1 28 13c0 6.5-5.5 11.7-12 11.7z"/>
    </svg>
  );
}

// نجوم عرضية
function Stars({ value = 0 }) {
  const v = Number(value || 0);
  return (
    <span className="inline-flex items-center gap-1">
      {[1,2,3,4,5].map((n) => (
        <Star key={n} className={`w-4 h-4 ${v >= n ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
      ))}
    </span>
  );
}

// إخفاء جزء من البريد
function maskEmail(email) {
  if (!email) return "-";
  const [u, d] = String(email).split("@");
  if (!d) return email;
  const head = u.slice(0, 2);
  return `${head}${"*".repeat(Math.max(1, u.length - 2))}@${d}`;
}

export default function CampDetails() {
  const { id } = useParams();
  const campId = Number(id || 0);
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review UI state (يتطلب تسجيل دخول)
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [average, setAverage] = useState(null);

  // Reviews list
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  // Auth check
  const isLoggedIn = !!(
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId")
  );

  // Booking mini-form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingBusy, setBookingBusy] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Prefill dates today/tomorrow
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().slice(0, 10);
    setStartDate((s) => s || fmt(today));
    setEndDate((e) => e || fmt(tomorrow));
  }, []);

  const parsed = useMemo(() => parseJoinPayload(details?.rawPayloadJson), [details?.rawPayloadJson]);

  const images = useMemo(() => {
    const reqImgs = (details?.request?.images || []).map((x) => buildImageUrl(x)).filter(Boolean);
    const campImgs = (details?.camp?.images || [])
      .map((img) => (img?.imageUrl ? buildImageUrl(img.imageUrl) : null))
      .filter(Boolean);
    const list = (reqImgs.length > 0 ? reqImgs : campImgs).filter(Boolean);
    return list.length > 0 ? list : [FALLBACK];
  }, [details]);

  const title = details?.request?.title || details?.camp?.title || "-";
  const locationStr = useMemo(() => {
    const fromCamp = [details?.camp?.country, details?.camp?.state, details?.camp?.city].filter(Boolean).join(" / ");
    if (fromCamp) return fromCamp;
    if (parsed?.location) {
      const p = parsed.location;
      const parts = [p.city, p.state, p.country].filter(Boolean);
      return parts.length ? parts.join(" / ") : "-";
    }
    return "-";
  }, [details, parsed]);

  const ratingBase = Number(details?.camp?.reviewsAverage || 0);
  const rating = Number.isFinite(average) ? Number(average) : ratingBase;
  const hasAccommodation = Boolean(details?.camp?.hasAccommodation);

  const weekdayWithout = useMemo(() => {
    const fromParsed = Number(parsed?.pricing?.weekday?.withoutAccommodation);
    if (Number.isFinite(fromParsed)) return fromParsed;
    return Number(details?.camp?.priceWeekdays ?? NaN);
  }, [parsed, details]);

  const holidayWithout = useMemo(() => {
    const fromParsed = Number(parsed?.pricing?.holiday?.withoutAccommodation);
    if (Number.isFinite(fromParsed)) return fromParsed;
    return Number(details?.camp?.priceHolidays ?? NaN);
  }, [parsed, details]);

  const weekdayWith = useMemo(() => {
    const fromParsed = Number(parsed?.pricing?.weekday?.withAccommodation);
    if (Number.isFinite(fromParsed)) return fromParsed;
    const nightly = Number(parsed?.pricing?.nightly ?? NaN);
    return Number.isFinite(nightly) ? nightly : NaN;
  }, [parsed]);

  const holidayWith = useMemo(() => {
    const fromParsed = Number(parsed?.pricing?.holiday?.withAccommodation);
    if (Number.isFinite(fromParsed)) return fromParsed;
    const nightly = Number(parsed?.pricing?.nightly ?? NaN);
    return Number.isFinite(nightly) ? nightly : NaN;
  }, [parsed]);

  const [dayType, setDayType] = useState("weekday"); // weekday | holiday
  const canWith = hasAccommodation && (Number.isFinite(weekdayWith) || Number.isFinite(holidayWith));
  const [stayType, setStayType] = useState(canWith ? "with" : "without"); // with | without

  useEffect(() => {
    if (!canWith && stayType === "with") setStayType("without");
  }, [canWith, stayType]);

  const currentPrice = useMemo(() => {
    if (dayType === "weekday") {
      return stayType === "with"
        ? (Number.isFinite(weekdayWith) ? Number(weekdayWith) : Number.isFinite(weekdayWithout) ? Number(weekdayWithout) : 0)
        : (Number.isFinite(weekdayWithout) ? Number(weekdayWithout) : Number.isFinite(weekdayWith) ? Number(weekdayWith) : 0);
    } else {
      return stayType === "with"
        ? (Number.isFinite(holidayWith) ? Number(holidayWith) : Number.isFinite(holidayWithout) ? Number(holidayWithout) : 0)
        : (Number.isFinite(holidayWithout) ? Number(holidayWithout) : Number.isFinite(holidayWith) ? Number(holidayWith) : 0);
    }
  }, [dayType, stayType, weekdayWith, weekdayWithout, holidayWith, holidayWithout]);

  const currentLabel = useMemo(() => {
    const day = dayType === "weekday" ? "أيام الأسبوع" : "أيام العطله";
    const stay = stayType === "with" ? "مع المبيت" : "بدون مبيت";
    return `${day} • ${stay}`;
  }, [dayType, stayType]);

  // Load details
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/Camp/${id}/details`);
        if (!alive) return;
        setDetails(res.data);
      } catch (e) {
        if (!alive) return;
        setError("تعذر تحميل تفاصيل المخيم");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // Load average rating
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await api.get(`/api/camps/${campId}/reviews/average`);
        if (!alive) return;
        setAverage(Number(r.data));
      } catch {
        // ignore
      }
    })();
    return () => { alive = false; };
  }, [campId]);

  // Fetch reviews list
  async function fetchReviews() {
    try {
      setReviewsLoading(true);
      setReviewsError("");
      const { data } = await api.get(`/api/camps/${campId}/reviews`);
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "تعذر تحميل المراجعات.";
      setReviewsError(String(msg));
    } finally {
      setReviewsLoading(false);
    }
  }

  useEffect(() => {
    if (campId > 0) fetchReviews();
  }, [campId]);

  function onToggleReview() {
    if (!isLoggedIn) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }
    setReviewOpen((o) => !o);
  }

  async function submitReview() {
    setReviewError("");
    setReviewSuccess("");

    if (!isLoggedIn) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }

    const stars = Number(reviewRating);
    const comment = reviewComment.trim();

    if (!Number.isFinite(stars) || stars < 1 || stars > 5) {
      setReviewError("من فضلك اختر تقييم بين 1 و 5.");
      return;
    }
    if (!comment) {
      setReviewError("من فضلك اكتب تعليقاً قصيراً.");
      return;
    }

    setReviewSubmitting(true);
    try {
      await api.post(`/api/camps/${campId}/reviews`, { stars, comment });
      setReviewSuccess("تم حفظ تقييمك بنجاح.");
      setReviewOpen(false);
      setReviewComment("");

      const r = await api.get(`/api/camps/${campId}/reviews/average`);
      setAverage(Number(r.data));

      await fetchReviews();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "تعذر حفظ التقييم.";
      setReviewError(String(msg));
    } finally {
      setReviewSubmitting(false);
    }
  }

  const dateDiffNights = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [startDate, endDate]);

  // Booking: Create via API then WhatsApp; protect basket add
  async function bookNow() {
    setBookingError("");

    if (!isLoggedIn) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }

    if (!startDate || !endDate) {
      setBookingError("من فضلك اختر تاريخ الوصول والمغادرة.");
      return;
    }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e <= s) {
      setBookingError("تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول.");
      return;
    }
    if (!Number.isFinite(Number(guests)) || Number(guests) <= 0) {
      setBookingError("عدد الضيوف غير صالح.");
      return;
    }

    setBookingBusy(true);
    try {
      debugger
      const payload = {
        campId,
        customerName: customerName || undefined,
        customerEmail: undefined,
        customerPhone: customerPhone || undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        guests: Number(guests),
        notes: notes || undefined,
      };
      const { data } = await api.post("/api/Booking", payload);
      console.log(data);

      try {
        await addItemToBasket({
          campId,
          title: title || "مخيم",
          pictureUrl: images?.[0] || FALLBACK,
          price: Number(currentPrice || 0),
          currency: "USD",
          nights: dateDiffNights,
          units: 1,
        });
      } catch (basketErr) {
        console.warn("addItemToBasket failed:", basketErr);
      }

      const phoneLocal = "01559434566";
      const phoneIntl = phoneLocal.startsWith("0") ? `20${phoneLocal.slice(1)}` : phoneLocal;
      const msgLines = [
        "مرحباً، أود تأكيد حجز المخيم التالي:",
        `• المخيم: ${title || "-"}`,
        `• الخيار: ${currentLabel}`,
        `• السعر/ليلة: ${formatUSD(currentPrice)}`,
        `• التواريخ: ${startDate} → ${endDate} (عدد الليالي: ${dateDiffNights})`,
        `• الضيوف: ${guests}`,
        customerName ? `• الاسم: ${customerName}` : null,
        customerPhone ? `• الهاتف: ${customerPhone}` : null,
        notes ? `• ملاحظات: ${notes}` : null,
        `• رابط التفاصيل: ${window.location.href}`,
        data?.id ? `• رقم الحجز: ${data.id}` : null,
      ].filter(Boolean);
      const text = encodeURIComponent(msgLines.join("\n"));
      window.location.href = `https://wa.me/${phoneIntl}?text=${text}`;
    } catch (e) {
      const serverErrors = e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join(" | ") : null;
      const msg = e?.response?.data?.message || serverErrors || e?.message || "تعذر إنشاء الحجز. حاول مرة أخرى.";
      setBookingError(String(msg));
    } finally {
      setBookingBusy(false);
    }
  }

  if (loading) {
    return <div className="container py-16 text-center text-muted-foreground" dir="rtl">جارٍ تحميل التفاصيل…</div>;
  }
  if (error) {
    return <div className="container py-16 text-center text-destructive" dir="rtl">{error}</div>;
  }

  return (
    <div dir="rtl">
      <Helmet>
        <title>{title} | Camply</title>
        <meta name="description" content={`تفاصيل ${title}`} />
      </Helmet>

      {/* Header */}
      <section className="bg-muted/40 border-b">
        <div className="container py-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              <div className="flex items-center gap-2">
                {details?.request?.status !== undefined && <StatusBadge status={details.request.status} />}
                <div className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm">
                  {formatUSD(currentPrice)} <span className="text-xs opacity-80">{currentLabel}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{locationStr || "-"}</span>
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{rating ? Number(rating).toFixed(1) : "-"}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Images slider */}
      <section className="border-b">
        <div className="container py-6">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
            <span>الصور</span>
            <span className="text-xs">({images.length})</span>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={12}
            slidesPerView={1.2}
            breakpoints={{ 640: { slidesPerView: 2.2 }, 768: { slidesPerView: 3.2 }, 1024: { slidesPerView: 4.2 } }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            className="!pb-10"
          >
            {images.map((src, idx) => (
              <SwiperSlide key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="relative aspect-video rounded-md overflow-hidden bg-muted"
                >
                  <img
                    src={src || FALLBACK}
                    alt={`صورة ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = FALLBACK; }}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Details + Booking + Review form */}
      <section>
        <div className="container py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* العمود الأيسر */}
            <div className="lg:col-span-2 space-y-8">
              {(parsed?.basics?.name || parsed?.basics?.propertyType || parsed?.basics?.website) && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">تفاصيل المخيم</h2>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-muted-foreground">الاسم: </span><span className="font-medium">{parsed?.basics?.name || "-"}</span></div>
                    <div><span className="text-muted-foreground">النوع: </span><span className="font-medium">{parsed?.basics?.propertyType || "-"}</span></div>
                    {parsed?.basics?.website && (
                      <div><span className="text-muted-foreground"> الموقع الالكتروني: </span><span className="font-medium">{parsed.basics.website}</span></div>
                    )}
                  </div>
                </div>
              )}

              {(parsed?.location?.country || parsed?.location?.state || parsed?.location?.city || parsed?.location?.street || parsed?.location?.zip) && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">الموقع</h2>
                  <p className="text-sm font-medium">
                    {parsed?.location?.street && `${parsed.location.street}, `}
                    {parsed?.location?.city}{parsed?.location?.city && parsed?.location?.state ? ", " : ""}
                    {parsed?.location?.state}{(parsed?.location?.city || parsed?.location?.state) && parsed?.location?.country ? ", " : ""}
                    {parsed?.location?.country}{parsed?.location?.zip && ` - ${parsed.location.zip}`}
                  </p>
                </div>
              )}

              {(parsed?.description?.summary || parsed?.description?.guestServices) && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">الوصف</h2>
                  {parsed?.description?.summary && (
                    <p className="text-sm leading-7 bg-muted p-3 rounded">{parsed.description.summary}</p>
                  )}
                  {parsed?.description?.guestServices && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">خدمات الضيوف</div>
                      <p className="text-sm leading-7 bg-muted p-3 rounded">{parsed.description.guestServices}</p>
                    </div>
                  )}
                </div>
              )}

              {(parsed?.capacity?.maxGuests || parsed?.capacity?.bedrooms || (parsed?.capacity?.beds?.length || 0) > 0) && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">السعة والإقامة</h2>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-muted-foreground">الضيوف: </span><span className="font-medium">{parsed?.capacity?.maxGuests || "-"}</span></div>
                    <div><span className="text-muted-foreground">الغرف: </span><span className="font-medium">{parsed?.capacity?.bedrooms || "-"}</span></div>
                    <div className="sm:col-span-3">
                      {(parsed?.capacity?.beds || []).length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {parsed?.capacity?.beds.map((b) => (
                            <span key={b.key} className="px-2 py-1 rounded bg-muted text-xs">{b.label} × {b.count}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">لا توجد أسِرّة محددة</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {((parsed?.facilities?.length || 0) > 0) || ["basic","bath","kitchen","outdoor"].some(k => (parsed?.amenities?.[k] || []).length > 0) ? (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">المرافق والمزايا</h2>
                  {parsed?.facilities?.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">المرافق</div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {parsed.facilities.map((x, i) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                      </div>
                    </div>
                  )}
                  {["basic","bath","kitchen","outdoor"].map((k) => {
                    const arr = parsed?.amenities?.[k] || [];
                    if (arr.length === 0) return null;
                    const title = k === "basic" ? "أساسية" : k === "bath" ? "حمّام" : k === "kitchen" ? "مطبخ" : "خارجية";
                    return (
                      <div className="space-y-2" key={k}>
                        <div className="text-sm text-muted-foreground">المزايا ({title})</div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {arr.map((x, i) => <span key={`${k}-${i}`} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {(parsed?.sharedSpaces?.length || 0) > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">المساحات المشتركة</h2>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {parsed.sharedSpaces.map((x, i) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                  </div>
                </div>
              )}

              {((parsed?.activities?.options?.length || 0) > 0) || ((parsed?.terrain?.options?.length || 0) > 0) ? (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">الأنشطة والتضاريس</h2>
                  {parsed?.activities?.options?.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">الأنشطة</div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {parsed.activities.options.map((x, i) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                      </div>
                      {parsed?.activities?.note && <div className="text-xs text-muted-foreground">ملاحظة: {parsed.activities.note}</div>}
                    </div>
                  )}
                  {parsed?.terrain?.options?.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">التضاريس</div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {parsed.terrain.options.map((x, i) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                      </div>
                      {parsed?.terrain?.surroundings && <div className="text-xs text-muted-foreground">البيئة المحيطة: {parsed.terrain.surroundings}</div>}
                    </div>
                  )}
                </div>
              ) : null}

              {(parsed?.rules?.minAge || parsed?.rules?.checkInFrom || parsed?.rules?.checkInTo || parsed?.rules?.checkOut || (parsed?.rules?.allowed?.length || 0) > 0) && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">القواعد والمواعيد</h2>
                  <div className="grid sm:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-muted-foreground">الحد الأدنى للعمر: </span><span className="font-medium">{parsed?.rules?.minAge || "-"}</span></div>
                    <div><span className="text-muted-foreground">تسجيل الدخول من: </span><span className="font-medium">{parsed?.rules?.checkInFrom || "-"}</span></div>
                    <div><span className="text-muted-foreground">إلى: </span><span className="font-medium">{parsed?.rules?.checkInTo || "-"}</span></div>
                    <div><span className="text-muted-foreground">تسجيل الخروج: </span><span className="font-medium">{parsed?.rules?.checkOut || "-"}</span></div>
                  </div>
                  {(parsed?.rules?.allowed?.length || 0) > 0 && (
                    <div className="text-xs text-muted-foreground">
                      المسموح: {parsed?.rules?.allowed?.join("، ")}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* العمود الأيمن */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-background p-4 space-y-4">
                <div className="text-sm text-muted-foreground">اختر نوع اليوم والإقامة</div>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium">الايام</div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={dayType === "weekday" ? "default" : "outline"}
                      onClick={() => setDayType("weekday")}
                      className={dayType === "weekday" ? "bg-primary text-primary-foreground" : ""}
                    >
                      أيام الاسبوع
                    </Button>
                    <Button
                      type="button"
                      variant={dayType === "holiday" ? "default" : "outline"}
                      onClick={() => setDayType("holiday")}
                      className={dayType === "holiday" ? "bg-primary text-primary-foreground" : ""}
                    >
                      أيام العطلة
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium">نوع الإقامة</div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={stayType === "without" ? "default" : "outline"}
                      onClick={() => setStayType("without")}
                      className={stayType === "without" ? "bg-primary text-primary-foreground" : ""}
                    >
                      بدون مبيت
                    </Button>
                    <Button
                      type="button"
                      variant={stayType === "with" ? "default" : "outline"}
                      onClick={() => setStayType("with")}
                      disabled={!canWith}
                      className={`${stayType === "with" ? "bg-primary text-primary-foreground" : ""} ${!canWith ? "opacity-60" : ""}`}
                      title={!canWith ? "لا تتوفر تسعيرة للمبيت" : undefined}
                    >
                      مع المبيت
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{currentLabel}</div>
                  <div className="text-2xl font-bold">
                    {formatUSD(currentPrice)} <span className="text-base font-normal text-muted-foreground">/ الليلة</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span>أيام الأسبوع • بدون مبيت</span>
                    <span>{Number.isFinite(weekdayWithout) ? formatUSD(weekdayWithout) : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>أيام الأسبوع • مع المبيت</span>
                    <span>{Number.isFinite(weekdayWith) ? formatUSD(weekdayWith) : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>أيام العطله • بدون مبيت</span>
                    <span>{Number.isFinite(holidayWithout) ? formatUSD(holidayWithout) : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>أيام العطله • مع المبيت</span>
                    <span>{Number.isFinite(holidayWith) ? formatUSD(holidayWith) : "-"}</span>
                  </div>
                </div>

                {/* نموذج الحجز المختصر */}
                <div className="pt-2 space-y-3">
                  <div className="text-sm font-medium">بيانات الحجز</div>
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
                      <Input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} />
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
                    {/* <WhatsAppIcon className="w-4 h-4" /> */}
                    {bookingBusy ? "جارٍ إنشاء الحجز…" : "احجز الآن (واتساب)"}
                  </Button>
                </div>

                {hasAccommodation && <div className="text-xs text-muted-foreground">يتوفر مبيت في هذا المخيم</div>}
              </div>

              {/* بطاقة كتابة المراجعة */}
              <div className="rounded-lg border bg-background p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">قيّم هذا المخيم</div>
                  <Button size="sm" variant={reviewOpen ? "secondary" : "default"} onClick={onToggleReview}>
                    {reviewOpen ? "إغلاق" : "اكتب مراجعة"}
                  </Button>
                </div>

                {reviewOpen && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">التقييم</label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1,2,3,4,5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setReviewRating(n)}
                            className={`p-1 rounded ${reviewRating >= n ? "text-yellow-500" : "text-muted-foreground"}`}
                            aria-label={`تقييم ${n}`}
                            title={`تقييم ${n}`}
                          >
                            <Star className={`w-5 h-5 ${reviewRating >= n ? "fill-yellow-500" : ""}`} />
                          </button>
                        ))}
                        <span className="text-xs text-muted-foreground">{reviewRating} / 5</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">تعليقك</label>
                      <Textarea
                        rows={3}
                        placeholder="اكتب رأيك عن التجربة..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                    </div>

                    {reviewError && <div className="text-xs text-destructive">{reviewError}</div>}
                    {reviewSuccess && <div className="text-xs text-emerald-600">{reviewSuccess}</div>}

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => { setReviewOpen(false); setReviewError(""); setReviewSuccess(""); }}
                        disabled={reviewSubmitting}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={submitReview}
                        disabled={reviewSubmitting}
                        className="bg-primary text-primary-foreground"
                      >
                        {reviewSubmitting ? "جارٍ الإرسال..." : "حفظ المراجعة"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="rounded-lg border bg-background p-4 space-y-2 text-sm">
                <div className="text-muted-foreground">معلومات إضافية</div>
                <div>المعتمد بتاريخ: <span className="font-medium">{formatDate(details?.request?.submittedOn)}</span></div>
                <div>العملة: <span className="font-medium">{details?.currencyCode || "USD"}</span></div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews list */}
      <section className="border-t">
        <div className="container py-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">المراجعات</h2>
            <div className="text-sm text-muted-foreground">
              {Number.isFinite(average) ? `متوسط: ${Number(average).toFixed(1)} / 5` : "-"}
            </div>
          </div>

          {reviewsLoading && (
            <div className="text-center text-muted-foreground py-8">جارٍ تحميل المراجعات…</div>
          )}

          {reviewsError && (
            <div className="text-center text-destructive py-8">{reviewsError}</div>
          )}

          {!reviewsLoading && !reviewsError && reviews.length === 0 && (
            <div className="text-center text-muted-foreground py-8">لا توجد مراجعات حتى الآن.</div>
          )}

          {!reviewsLoading && !reviewsError && reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r, idx) => {
                const stars = r?.stars ?? r?.Stars ?? r?.rating ?? r?.Rating ?? 0;
                const comment = r?.comment ?? r?.Comment ?? "";
                const email = r?.email ?? r?.Email ?? "";
                const user = r?.userDisplayName ?? r?.userName ?? r?.UserName ?? null;
                const created = r?.createdOn ?? r?.CreatedOn ?? r?.createdAt ?? r?.CreatedAt ?? null;
                return (
                  <div key={r?.id || idx} className="rounded-lg border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Stars value={stars} />
                      <div className="text-xs text-muted-foreground">{formatDate(created)}</div>
                    </div>
                    <p className="text-sm leading-7">{comment || "—"}</p>
                    <div className="text-xs text-muted-foreground">
                      {user ? `بواسطة: ${user}` : email ? `بواسطة: ${maskEmail(email)}` : "مستخدم"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!reviewsLoading && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={fetchReviews}>تحديث المراجعات</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
