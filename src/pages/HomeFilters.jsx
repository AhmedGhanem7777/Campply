// src/components/HomeFilters.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ARAB_COUNTRIES = [
  "الجزائر",
  "البحرين",
  "جزر القمر",
  "جيبوتي",
  "مصر",
  "العراق",
  "الأردن",
  "الكويت",
  "لبنان",
  "ليبيا",
  "موريتانيا",
  "المغرب",
  "عُمان",
  "فلسطين",
  "قطر",
  "السعودية",
  "الصومال",
  "السودان",
  "سوريا",
  "تونس",
  "الإمارات العربية المتحدة",
  "اليمن",
];

export default function HomeFilters() {
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [q, setQ] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hasAccommodation, setHasAccommodation] = useState("any"); // any|true|false
  const [minRating, setMinRating] = useState("any"); // any|1|2|3|4

  const onSearch = () => {
    const params = {};
    // صفحة أولى وحجم افتراضي متوافق مع AllCamps
    params.page = "1";
    params.size = "12";

    if (country) params.country = country.trim();
    if (stateName.trim()) params.state = stateName.trim();
    if (city.trim()) params.city = city.trim();
    if (q.trim()) params.q = q.trim();

    if (minPrice !== "") params.minPrice = String(Number(minPrice) || 0);
    if (maxPrice !== "") params.maxPrice = String(Number(maxPrice) || 0);

    if (hasAccommodation !== "any") params.hasAccommodation = hasAccommodation;
    if (minRating !== "any") params.minRating = String(Number(minRating));

    const qs = new URLSearchParams(params).toString();
    navigate(`/all-camps?${qs}`);
  };

  const onClear = () => {
    setCountry("");
    setStateName("");
    setCity("");
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    setHasAccommodation("any");
    setMinRating("any");
  };

  return (
    <div dir="rtl" className="w-full rounded-lg border bg-background p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* الدولة Dropdown */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">الدولة</label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الدولة" />
            </SelectTrigger>
            <SelectContent>
              {ARAB_COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* المحافظة/الولاية نص حر */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">المحافظة/الولاية</label>
          <Input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="اكتب اسم المحافظة أو الولاية" />
        </div>

        {/* المدينة نص حر */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">المدينة</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="اكتب اسم المدينة" />
        </div>

        {/* بحث بالاسم */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">بحث بالاسم</label>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن مخيم..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* أدنى سعر */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">أدنى سعر</label>
          <Input type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
        </div>

        {/* أقصى سعر */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">أقصى سعر</label>
          <Input type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="999" />
        </div>

        {/* يتضمن مبيت؟ */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">يتضمن مبيت؟</label>
          <Select value={hasAccommodation} onValueChange={setHasAccommodation}>
            <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">الكل</SelectItem>
              <SelectItem value="true">نعم</SelectItem>
              <SelectItem value="false">لا</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* التقييم الأدنى */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">التقييم الأدنى</label>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger><SelectValue placeholder="بدون حد" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">بدون حد</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onSearch}>بحث</Button>
        <Button variant="outline" onClick={onClear}>مسح</Button>
      </div>
    </div>
  );
}
