// src/pages/AllCamps.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listCamps, buildImageUrl } from "@/Service/api/camps";
import CampCard from "@/components/CampCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

function useDebounced(value, delay = 450) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}

function fallbackImage() {
  return "https://images.unsplash.com/photo-1532555283690-cbf89e69cec7";
}
function imageCover(c) {
  const cover = c?.images?.find?.((i) => i?.isCover) ?? (c?.images?.[0] || null);
  const url = cover?.imageUrl ? buildImageUrl(cover.imageUrl) : fallbackImage();
  return url;
}

function getCampPrice(camp) {
  const weekday = Number(camp?.priceWeekdays ?? camp?.weekday ?? camp?.nightly ?? camp?.price ?? 0) || 0;
  const holiday = Number(camp?.priceHolidays ?? camp?.holiday ?? 0) || 0;
  const priceDisplay = weekday > 0 ? weekday : holiday > 0 ? holiday : 0;
  const currency = camp?.currency || "SAR";
  return { priceDisplay, weekday, holiday, currency };
}

// الدول العربية
// const ARAB_COUNTRIES = [
//   "الجزائر","البحرين","جزر القمر","جيبوتي","مصر","العراق","الأردن","الكويت","لبنان","ليبيا",
//   "موريتانيا","المغرب","عمان","فلسطين","قطر","السعودية","الصومال","السودان","سوريا","تونس",
//   "الإمارات العربية المتحدة","اليمن"
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
  "جزر القمر",
  "جيبوتي",
  "العراق",
  "لبنان",
  "ليبيا",
  "موريتانيا",
  "المغرب",
  "فلسطين",
  "الصومال",
  "السودان",
  "سوريا",
  "تونس",
  "اليمن"
];


// أنواع المخيمات (عربي موحّد)
const CAMP_TYPE_OPTIONS = [
  "مخيمات الخيام التقليدية (Tent Camping)",
  "(RV / Caravan Camping) مخيمات الكرفانات ",
  "مخيمات الغابات والجبال (Forest / Mountain Camps)",
  "التخييم الفندقي (Glamorous Camping)",
  "Safari / Dome / Bubble خيام",
  "مخيمات بيئية (Eco Camps)",
  "مخيمات المزارع (Farm Camps)",
  "مخيمات الشواطئ (Beach Camps)",
  "مخيمات الصحراء (Desert Camps)",
  "مخيمات المغامرات (Adventure Camps)",
  "مخيمات الفلك والنجوم (Astronomy Camps)",
  "مخيمات اليوغا والعافية (Wellness Camps)",
];

export default function AllCamps() {
  const [searchParams, setSearchParams] = useSearchParams();

  // pagination
  const [pageIndex, setPageIndex] = useState(parseInt(searchParams.get("page") || "1", 10) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get("size") || "12", 10) || 12);

  // filters
  const [countryName, setCountryName] = useState(searchParams.get("country") || "");
  const [stateName, setStateName] = useState(searchParams.get("state") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [hasAccommodation, setHasAccommodation] = useState(searchParams.get("hasAccommodation") || "any"); // any|true|false
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "any"); // any|1|2|3|4

  // نوع المخيم
  const [campType, setCampType] = useState(searchParams.get("type") || "");

  // debounced values
  const dCountry = useDebounced(countryName);
  const dState = useDebounced(stateName);
  const dCity = useDebounced(city);
  const dQ = useDebounced(q);
  const dMinPrice = useDebounced(minPrice);
  const dMaxPrice = useDebounced(maxPrice);
  const dHasAcc = useDebounced(hasAccommodation);
  const dMinRating = useDebounced(minRating);
  const dPageIndex = useDebounced(pageIndex);
  const dPageSize = useDebounced(pageSize);
  const dType = useDebounced(campType);

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // keep URL in sync
  useEffect(() => {
    const params = { page: String(pageIndex), size: String(pageSize) };
    if (countryName.trim()) params.country = countryName.trim();
    if (stateName.trim()) params.state = stateName.trim();
    if (city.trim()) params.city = city.trim();
    if (q.trim()) params.q = q.trim();
    if (minPrice !== "") params.minPrice = String(Number(minPrice) || 0);
    if (maxPrice !== "") params.maxPrice = String(Number(maxPrice) || 0);
    if (hasAccommodation !== "any") params.hasAccommodation = hasAccommodation;
    if (minRating !== "any") params.minRating = String(Number(minRating));
    if (campType.trim()) params.type = campType.trim(); // أضف النوع إلى الاستعلام
    setSearchParams(params, { replace: true });
  }, [countryName, stateName, city, q, minPrice, maxPrice, hasAccommodation, minRating, campType, pageIndex, pageSize, setSearchParams]);

  // fetch with debounced filters
  useEffect(() => {
    (async () => {
      try {
        debugger
        setLoading(true);
        setError(null);
        const params = {
          pageIndex: parseInt(String(dPageIndex) || "1", 10) || 1,
          pageSize: parseInt(String(dPageSize) || "12", 10) || 12,
        };
        if (dCountry.trim()) params.country = dCountry.trim();
        if (dState.trim()) params.state = dState.trim();
        if (dCity.trim()) params.city = dCity.trim();
        if (dQ.trim()) params.q = dQ.trim();

        if (dHasAcc === "true") params.hasAccommodation = true;
        else if (dHasAcc === "false") params.hasAccommodation = false;

        if (dMinRating && dMinRating !== "any") params.minRating = Number(dMinRating);

        if (dMinPrice !== "") params.minPrice = Number(dMinPrice) || 0;
        if (dMaxPrice !== "") params.maxPrice = Number(dMaxPrice) || 0;

        if (dType.trim()) params.type = dType.trim(); // تمرير النوع للباك

        const { data } = await listCamps(params);
        const list = Array.isArray(data?.data) ? data.data : [];
        const total = Number.isFinite(data?.count) ? data.count : list.length;
        setRows(list);
        setCount(total);
      } catch (e) {
        setError("تعذر جلب المخيمات");
      } finally {
        setLoading(false);
      }
    })();
  }, [dPageIndex, dPageSize, dCountry, dState, dCity, dQ, dMinPrice, dMaxPrice, dHasAcc, dMinRating, dType]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / pageSize)), [count, pageSize]);

  return (
    <div dir="rtl" className="w-full px-5">
      <section className="py-4 border-b">
        <div className="mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">جميع المخيمات</h1>
            <Button variant="outline" className="lg:hidden inline-flex items-center gap-2" onClick={() => setFiltersOpen((v) => !v)}>
              الفلاتر <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <aside className={`lg:col-span-3 ${filtersOpen ? "" : "hidden"} lg:block`}>
              <div className="sticky top-24 space-y-4 rounded-lg border bg-background p-4" dir="rtl">
                <h2 className="text-lg font-semibold">تصفية النتائج</h2>

                {/* الدولة */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">الدولة</label>
                  <Select
                    value={countryName || ""}
                    onValueChange={(v) => { setCountryName(v); setPageIndex(1); }}
                    dir="rtl"
                  >
                    <SelectTrigger className="justify-between flex-row-reverse">
                      <div className="flex-1 text-right truncate">
                        <SelectValue placeholder="اختر الدولة" />
                      </div>
                    </SelectTrigger>
                    <SelectContent align="end" dir="rtl">
                      {ARAB_COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c} className="text-right">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {countryName && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => { setCountryName(""); setPageIndex(1); }}
                      className="mt-1"
                    >
                      مسح الدولة
                    </Button>
                  )}
                </div>

                {/* نوع المخيم */}
                {/* <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">نوع المخيم</label>
                  <Select
                    value={campType || ""}
                    onValueChange={(v) => { setCampType(v); setPageIndex(1); }}
                    dir="rtl"
                  >
                    <SelectTrigger className="justify-between flex-row-reverse">
                      <div className="flex-1 text-right truncate">
                        <SelectValue placeholder="اختر النوع" />
                      </div>
                    </SelectTrigger>
                    <SelectContent align="end" dir="rtl">
                      {CAMP_TYPE_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t} className="text-right">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {campType && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => { setCampType(""); setPageIndex(1); }}
                      className="mt-1"
                    >
                      مسح النوع
                    </Button>
                  )}
                </div> */}

                {/* المحافظة */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">المحافظة</label>
                  <Input value={stateName} onChange={(e) => { setStateName(e.target.value); setPageIndex(1); }} placeholder="اكتب اسم المحافظة" />
                </div>

                {/* المدينة */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">المدينة</label>
                  <Input value={city} onChange={(e) => { setCity(e.target.value); setPageIndex(1); }} placeholder="اكتب اسم المدينة" />
                </div>

                {/* بحث بالاسم */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">بحث بالاسم</label>
                  <Input value={q} onChange={(e) => { setQ(e.target.value); setPageIndex(1); }} placeholder="ابحث عن مخيم..." />
                </div>

                {/* أسعار */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-muted-foreground">أدنى سعر</label>
                    <Input type="number" min={0} value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPageIndex(1); }} placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">أقصى سعر</label>
                    <Input type="number" min={0} value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPageIndex(1); }} placeholder="999" />
                  </div>
                </div>

                {/* يتضمن مبيت؟ */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">يتضمن مبيت؟</label>
                  <Select value={hasAccommodation} onValueChange={(v) => { setHasAccommodation(v); setPageIndex(1); }} dir="rtl">
                    <SelectTrigger className="justify-between flex-row-reverse">
                      <div className="flex-1 text-right truncate">
                        <SelectValue placeholder="الكل" />
                      </div>
                    </SelectTrigger>
                    <SelectContent align="end" dir="rtl">
                      <SelectItem value="any" className="text-right">الكل</SelectItem>
                      <SelectItem value="true" className="text-right">نعم</SelectItem>
                      <SelectItem value="false" className="text-right">لا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* التقييم الأدنى */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">التقييم الأدنى</label>
                  <Select value={minRating} onValueChange={(v) => { setMinRating(v); setPageIndex(1); }} dir="rtl">
                    <SelectTrigger className="justify-between flex-row-reverse">
                      <div className="flex-1 text-right truncate">
                        <SelectValue placeholder="بدون حد" />
                      </div>
                    </SelectTrigger>
                    <SelectContent align="end" dir="rtl">
                      <SelectItem value="any" className="text-right">بدون حد</SelectItem>
                      <SelectItem value="1" className="text-right">1+</SelectItem>
                      <SelectItem value="2" className="text-right">2+</SelectItem>
                      <SelectItem value="3" className="text-right">3+</SelectItem>
                      <SelectItem value="4" className="text-right">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setCountryName(""); setCampType(""); setStateName(""); setCity(""); setQ("");
                    setMinPrice(""); setMaxPrice("");
                    setHasAccommodation("any"); setMinRating("any");
                    setPageIndex(1);
                  }}
                >
                  مسح الفلاتر
                </Button>
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-9">
              {loading ? (
                <div className="py-16 text-center text-muted-foreground">جارٍ التحميل…</div>
              ) : error ? (
                <div className="py-16 text-center text-destructive">{error}</div>
              ) : rows.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">لا توجد نتائج</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {rows.map((camp, idx) => {
                      const { priceDisplay } = getCampPrice(camp);
                      return (
                        <CampCard
                          key={camp?.id || idx}
                          id={camp?.id || 0}
                          image={imageCover(camp)}
                          title={camp?.title || "-"}
                          country={camp?.country ?? camp?.countryName ?? camp?.countryObj}
                          state={camp?.state ?? camp?.stateName ?? camp?.stateObj}
                          city={camp?.city ?? camp?.cityName ?? camp?.cityObj}
                          rating={camp?.reviewsAverage || 0}
                          price={priceDisplay}
                        />
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-8">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">عدد الصفوف:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPageIndex(1); }}
                        className="h-9 rounded-md border px-3 py-1 text-sm bg-background"
                      >
                        <option value="8">8</option>
                        <option value="12">12</option>
                        <option value="16">16</option>
                        <option value="24">24</option>
                      </select>
                    </div>
                    <div className="text-sm text-muted-foreground">صفحة {pageIndex} من {totalPages}</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.max(1, p - 1))} disabled={pageIndex === 1}>السابق</Button>
                      <Button variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))} disabled={pageIndex === totalPages}>التالي</Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}































