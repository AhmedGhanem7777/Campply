// src/pages/Dashboard/AddCampRequestWizard.tsx
import React, { useMemo, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { useToast } from "../components/ui/use-toast";
import { api } from "../lib/api";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

/* القوائم */
// const propertyTypes = ["خيمة","نُزل","عريش","كرافان","بود","غلمبينغ"];
// أنواع المخيمات (عربي موحّد)
const propertyTypes = [
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

const countriesList = [
  { code: "OM", label: "عُمان (Oman)" },
  { code: "AE", label: "الإمارات (UAE)" },
  { code: "SA", label: "السعودية (KSA)" },
  { code: "QA", label: "قطر (Qatar)" },
  { code: "KW", label: "الكويت (Kuwait)" },
  { code: "BH", label: "البحرين (Bahrain)" },
  { code: "JO", label: "الأردن (Jordan)" },
  { code: "EG", label: "مصر (Egypt)" },
  { code: "MA", label: "المغرب (Morocco)" },
  { code: "TN", label: "تونس (Tunisia)" },
  { code: "LB", label: "لبنان (Lebanon)" },
];

const basicAmenities = ["WiFi","تكييف","تدفئة","مولد كهرباء","إضاءة"];
const bathAmenities = ["حمام خاص","دش ساخن","مناشف","صابون","شامبو"];
const kitchenAmenities = ["مطبخ مجهز","ثلاجة","موقد","أواني طبخ","مياه شرب"];
const outdoorAmenities = ["شواء","جلسة خارجية","كراسي","طاولة","مظلة"];
const facilities = ["موقف سيارات","أمن","نظافة","استقبال 24 ساعة","خدمة غرف"];
const sharedSpaces = ["صالة مشتركة","مطبخ مشترك","حديقة","مسبح","ملعب"];
const activities = ["رحلات استكشافية","سفاري","صيد","سباحة","تسلق","نجوم"];
const terrainOptions = ["صحراء","جبال","شاطئ","واحة","غابة","سهول"];
const seclusionOptions = ["منعزل تماماً","شبه منعزل","بجانب مخيمات أخرى","في منطقة سياحية"];

/* الأسرّة بعدّادات */
const bedTypes = [
  { key: "king", label: "سرير مزدوج كبير (كينغ)" },
  { key: "queen", label: "سرير مزدوج (كوين)" },
  { key: "double", label: "سرير مزدوج عادي" },
  { key: "twin", label: "سرير مفرد" },
  { key: "bunk", label: "سرير بطابقين" },
  { key: "sofa", label: "سرير أريكة" },
  { key: "crib", label: "سرير أطفال" },
  { key: "air", label: "سرير هوائي / قابل للنفخ" },
];

type WizardData = {
  basics: { name: string; propertyType: string; website?: string | null; };
  description: { summary: string; guestServices?: string | null; };
  location: { country: string; state: string; city: string; zip?: string | null; street: string; };
  capacity: { maxGuests: number; bedrooms: number; beds: Record<string, number>; };
  features: { amenities: { basic: string[]; bath: string[]; kitchen: string[]; outdoor: string[]; }; facilities: string[]; };
  environment: { terrain: string[]; seclusion: string; activities: string[]; sharedSpaces: string[]; };
  rules: {
    checkInFrom: string; checkInTo: string; checkOut: string;
    minAge: number; additionalRules?: string | null;
  };
  pricing: {
    weekday_with_accommodation: number;
    weekday_without_accommodation: number;
    holiday_with_accommodation: number;
    holiday_without_accommodation: number;
  };
  files: File[];
};

export default function AddCampRequestWizard({ onCancel, onSuccess }: { onCancel?: () => void; onSuccess?: () => void; }) {
  const { toast } = useToast();

  const [form, setForm] = useState<WizardData>({
    basics: { name: "", propertyType: "", website: "" },
    description: { summary: "", guestServices: "" },
    location: { country: "", state: "", city: "", zip: "", street: "" },
    capacity: { maxGuests: 1, bedrooms: 0, beds: bedTypes.reduce((a, b) => ({ ...a, [b.key]: 0 }), {} as Record<string, number>) },
    features: { amenities: { basic: [], bath: [], kitchen: [], outdoor: [] }, facilities: [] },
    environment: { terrain: [], seclusion: "", activities: [], sharedSpaces: [] },
    rules: { checkInFrom: "14:00", checkInTo: "22:00", checkOut: "12:00", minAge: 18, additionalRules: "" },
    pricing: { weekday_with_accommodation: 0, weekday_without_accommodation: 0, holiday_with_accommodation: 0, holiday_without_accommodation: 0 },
    files: [],
  });

  const steps = useMemo(() => ([
    { key: "basics", title: "الأساسيات" },
    { key: "location", title: "الموقع" },
    { key: "description", title: "الوصف" },
    { key: "capacity", title: "السعة والأسِرّة" },
    { key: "features", title: "المرافق والمزايا" },
    { key: "environment", title: "البيئة والأنشطة" },
    { key: "rulesPricing", title: "القواعد والتسعير" },
    { key: "images", title: "الصور" },
    { key: "review", title: "مراجعة" },
  ]), []);

  const [stepIndex, setStepIndex] = useState(0);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  const validateStep = () => {
    const k = steps[stepIndex].key;

    if (k === "basics") {
      if (!form.basics.name.trim()) { toast({ title: "اسم المخيم مطلوب", variant: "destructive" }); return false; }
      if (!form.basics.propertyType) { toast({ title: "نوع الملكية مطلوب", variant: "destructive" }); return false; }
      if (!form.description.summary.trim()) { toast({ title: "وصف المخيم مطلوب", variant: "destructive" }); return false; }
    }

    if (k === "location") {
      if (!form.location.country.trim()) { toast({ title: "الدولة مطلوبة", variant: "destructive" }); return false; }
      if (!form.location.state.trim()) { toast({ title: "المحافظة/الولاية مطلوبة", variant: "destructive" }); return false; }
      if (!form.location.city.trim()) { toast({ title: "المدينة مطلوبة", variant: "destructive" }); return false; }
      if (!form.location.street.trim()) { toast({ title: "العنوان التفصيلي مطلوب", variant: "destructive" }); return false; }
    }

    if (k === "capacity") {
      const totalBeds = Object.values(form.capacity.beds || {}).reduce((s, v) => s + Number(v || 0), 0);
      if (form.capacity.maxGuests < 1) { toast({ title: "أقصى عدد ضيوف لا يقل عن 1", variant: "destructive" }); return false; }
      if (totalBeds < 1) { toast({ title: "أضف سريراً واحداً على الأقل", variant: "destructive" }); return false; }
    }

    if (k === "rulesPricing") {
      if ((form.rules.minAge ?? 0) < 0) { toast({ title: "الحد الأدنى للعمر غير صالح", variant: "destructive" }); return false; }
      const p = form.pricing;
      const prices = [p.weekday_with_accommodation, p.weekday_without_accommodation, p.holiday_with_accommodation, p.holiday_without_accommodation];
      const hasInvalid = prices.some((x) => !(Number.isFinite(x) && x >= 0));
      if (hasInvalid) { toast({ title: "تحقق من الأسعار", description: "أدخل قيم صحيحة.", variant: "destructive" }); return false; }
      if (prices.every(x => x === 0)) { toast({ title: "يجب إدخال سعر واحد على الأقل", variant: "destructive" }); return false; }
    }

    if (k === "images") {
      if ((form.files?.length || 0) < 5) { toast({ title: "الصور مطلوبة", description: "أرفع 5 صور على الأقل.", variant: "destructive" }); return false; }
    }

    return true;
  };

  const next = () => { if (validateStep()) setStepIndex((i) => Math.min(i + 1, steps.length - 1)); };
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));

  const submit = async () => {
    try {
      const payload = {
        basics: {
          name: form.basics.name.trim(),
          propertyType: form.basics.propertyType || null,
          website: form.basics.website || null
        },
        description: {
          summary: form.description.summary || null,
          guestServices: form.description.guestServices || null
        },
        location: {
          country: form.location.country || null,
          state: form.location.state || null,
          city: form.location.city || null,
          zip: form.location.zip || null,
          street: form.location.street || null
        },
        capacity: {
          maxGuests: form.capacity.maxGuests,
          bedrooms: form.capacity.bedrooms,
          beds: form.capacity.beds
        },
        facilities: form.features.facilities,
        amenities: form.features.amenities,
        sharedSpaces: form.environment.sharedSpaces,
        seclusion: form.environment.seclusion ? [form.environment.seclusion] : [],
        activities: { options: form.environment.activities },
        terrain: form.environment.terrain,
        rules: {
          checkInFrom: form.rules.checkInFrom,
          checkInTo: form.rules.checkInTo,
          checkOut: form.rules.checkOut,
          minAge: form.rules.minAge,
          additionalRules: form.rules.additionalRules || null
        },
        booking: {},
        pricing: {
          weekday: {
            withAccommodation: form.pricing.weekday_with_accommodation,
            withoutAccommodation: form.pricing.weekday_without_accommodation
          },
          holiday: {
            withAccommodation: form.pricing.holiday_with_accommodation,
            withoutAccommodation: form.pricing.holiday_without_accommodation
          }
        }
      };

      const fd = new FormData();
      fd.append("joinDataJson", JSON.stringify(payload));
      for (const f of form.files) fd.append("images", f);

      await api.post("/api/camp-requests", fd, { headers: { "Content-Type": "multipart/form-data" } });

      toast({ title: "تم إرسال طلب الإضافة بنجاح!", description: "سيتم مراجعته خلال 3-5 أيام عمل." });
      onSuccess?.();
    } catch (err: any) {
      const message = err?.response?.data?.message || "تعذر إرسال الطلب. حاول مجددًا.";
      toast({ title: "خطأ", description: message, variant: "destructive" });
    }
  };

  const StepHeader = () => {
    const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{steps[stepIndex].title}</h2>
          <span className="text-sm text-muted-foreground">{stepIndex + 1} / {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  };

  const renderStep = () => {
    const k = steps[stepIndex].key;

    if (k === "basics")
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">اسم المخيم *</label>
              <Input value={form.basics.name} onChange={(e) => setForm((d) => ({ ...d, basics: { ...d.basics, name: e.target.value } }))} placeholder="مثال: مخيم الرمال الذهبية" />
            </div>
            <div>
              <label className="text-sm font-medium">نوع الملكية *</label>
              <Select value={form.basics.propertyType} onValueChange={(v) => setForm((d) => ({ ...d, basics: { ...d.basics, propertyType: v } }))}>
                <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">الموقع الإلكتروني (اختياري)</label>
              <Input value={form.basics.website || ""} onChange={(e) => setForm((d) => ({ ...d, basics: { ...d.basics, website: e.target.value } }))} placeholder="https://example.com" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">وصف المخيم *</label>
            <Textarea rows={4} value={form.description.summary} onChange={(e) => setForm((d) => ({ ...d, description: { ...d.description, summary: e.target.value } }))} placeholder="اكتب وصفاً جذاباً لمخيمك..." />
          </div>

          <div>
            <label className="text-sm font-medium">خدمات إضافية للضيوف (اختياري)</label>
            <Textarea rows={3} value={form.description.guestServices || ""} onChange={(e) => setForm((d) => ({ ...d, description: { ...d.description, guestServices: e.target.value } }))} placeholder="توصيل من المطار، جولات سياحية..." />
          </div>
        </div>
      );

    if (k === "location")
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">الدولة *</label>
              <Select value={form.location.country} onValueChange={(v) => setForm((d) => ({ ...d, location: { ...d.location, country: v } }))}>
                <SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
                <SelectContent>
                  {countriesList.map((ct) => <SelectItem key={ct.code} value={ct.label}>{ct.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">المحافظة/الولاية *</label>
              <Input value={form.location.state} onChange={(e) => setForm((d) => ({ ...d, location: { ...d.location, state: e.target.value } }))} />
            </div>
            <div>
              <label className="text-sm font-medium">المدينة *</label>
              <Input value={form.location.city} onChange={(e) => setForm((d) => ({ ...d, location: { ...d.location, city: e.target.value } }))} />
            </div>
            <div>
              <label className="text-sm font-medium">الرمز البريدي</label>
              <Input value={form.location.zip || ""} onChange={(e) => setForm((d) => ({ ...d, location: { ...d.location, zip: e.target.value } }))} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">العنوان التفصيلي *</label>
              <Input value={form.location.street} onChange={(e) => setForm((d) => ({ ...d, location: { ...d.location, street: e.target.value } }))} placeholder="الشارع، المعالم القريبة..." />
            </div>
          </div>
        </div>
      );

    if (k === "description")
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">تفاصيل إضافية (اختياري)</label>
          <Textarea rows={5} value={form.description.guestServices || ""} onChange={(e) => setForm((d) => ({ ...d, description: { ...d.description, guestServices: e.target.value } }))} placeholder="أدخل أي تفاصيل إضافية ترغب بعرضها." />
        </div>
      );

    if (k === "capacity") {
      const setBed = (key: string, val: number) =>
        setForm((d) => ({ ...d, capacity: { ...d.capacity, beds: { ...d.capacity.beds, [key]: Math.max(0, Math.min(20, val)) } } }));

      const totalBeds = Object.values(form.capacity.beds).reduce((s, v) => s + Number(v || 0), 0);

      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">أقصى عدد ضيوف *</label>
              <Input type="number" min={1} value={form.capacity.maxGuests} onChange={(e) => setForm((d) => ({ ...d, capacity: { ...d.capacity, maxGuests: Math.max(1, Number(e.target.value) || 1) } }))} />
            </div>
            <div>
              <label className="text-sm font-medium">عدد غرف النوم</label>
              <Input type="number" min={0} value={form.capacity.bedrooms} onChange={(e) => setForm((d) => ({ ...d, capacity: { ...d.capacity, bedrooms: Math.max(0, Number(e.target.value) || 0) } }))} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">أنواع الأسرّة المتوفرة</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bedTypes.map((b) => (
                <div key={b.key} className="flex items-center justify-between border rounded-lg p-3">
                  <span className="text-sm">{b.label}</span>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => setBed(b.key, (form.capacity.beds[b.key] || 0) - 1)}>−</Button>
                    <Input type="number" min={0} className="w-20 text-center" value={form.capacity.beds[b.key] || 0} onChange={(e) => setBed(b.key, Number(e.target.value) || 0)} />
                    <Button type="button" variant="outline" onClick={() => setBed(b.key, (form.capacity.beds[b.key] || 0) + 1)}>+</Button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">إجمالي الأسرّة: {totalBeds}</p>
          </div>
        </div>
      );
    }

    if (k === "features")
      return (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-md font-semibold">الخدمات الأساسية</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {basicAmenities.map((item) => (
                <label key={item} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={form.features.amenities.basic.includes(item)} onCheckedChange={() => {
                    const arr = new Set(form.features.amenities.basic);
                    arr.has(item) ? arr.delete(item) : arr.add(item);
                    setForm((d) => ({ ...d, features: { ...d.features, amenities: { ...d.features.amenities, basic: Array.from(arr) } } }));
                  }} />
                  <span className="text-sm cursor-pointer">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-md font-semibold">مرافق الحمام</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {bathAmenities.map((item) => (
                <label key={item} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={form.features.amenities.bath.includes(item)} onCheckedChange={() => {
                    const arr = new Set(form.features.amenities.bath);
                    arr.has(item) ? arr.delete(item) : arr.add(item);
                    setForm((d) => ({ ...d, features: { ...d.features, amenities: { ...d.features.amenities, bath: Array.from(arr) } } }));
                  }} />
                  <span className="text-sm cursor-pointer">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-md font-semibold">مرافق المطبخ</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {kitchenAmenities.map((item) => (
                <label key={item} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={form.features.amenities.kitchen.includes(item)} onCheckedChange={() => {
                    const arr = new Set(form.features.amenities.kitchen);
                    arr.has(item) ? arr.delete(item) : arr.add(item);
                    setForm((d) => ({ ...d, features: { ...d.features, amenities: { ...d.features.amenities, kitchen: Array.from(arr) } } }));
                  }} />
                  <span className="text-sm cursor-pointer">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-md font-semibold">مرافق خارجية</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {outdoorAmenities.map((item) => (
                <label key={item} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={form.features.amenities.outdoor.includes(item)} onCheckedChange={() => {
                    const arr = new Set(form.features.amenities.outdoor);
                    arr.has(item) ? arr.delete(item) : arr.add(item);
                    setForm((d) => ({ ...d, features: { ...d.features, amenities: { ...d.features.amenities, outdoor: Array.from(arr) } } }));
                  }} />
                  <span className="text-sm cursor-pointer">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-md font-semibold">خدمات عامة</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilities.map((item) => (
                <label key={item} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={form.features.facilities.includes(item)} onCheckedChange={() => {
                    const arr = new Set(form.features.facilities);
                    arr.has(item) ? arr.delete(item) : arr.add(item);
                    setForm((d) => ({ ...d, features: { ...d.features, facilities: Array.from(arr) } }));
                  }} />
                  <span className="text-sm cursor-pointer">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );

    if (k === "environment")
      return (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-md font-semibold">نوع التضاريس</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {terrainOptions.map((item) => (
                <label key={item} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={form.environment.terrain.includes(item)} onCheckedChange={() => {
                    const arr = new Set(form.environment.terrain);
                    arr.has(item) ? arr.delete(item) : arr.add(item);
                    setForm((d) => ({ ...d, environment: { ...d.environment, terrain: Array.from(arr) } }));
                  }} />
                  <span className="text-sm cursor-pointer">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-md font-semibold">مستوى العزلة</label>
            <Select value={form.environment.seclusion || ""} onValueChange={(v) => setForm((d) => ({ ...d, environment: { ...d.environment, seclusion: v } }))}>
              <SelectTrigger><SelectValue placeholder="اختر مستوى العزلة" /></SelectTrigger>
              <SelectContent>
                {seclusionOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <h3 className="text-md font-semibold">أنشطة متوفرة</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activities.map((item) => (
                <label key={item} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={form.environment.activities.includes(item)} onCheckedChange={() => {
                    const arr = new Set(form.environment.activities);
                    arr.has(item) ? arr.delete(item) : arr.add(item);
                    setForm((d) => ({ ...d, environment: { ...d.environment, activities: Array.from(arr) } }));
                  }} />
                  <span className="text-sm cursor-pointer">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-md font-semibold">مساحات مشتركة</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sharedSpaces.map((item) => (
                <label key={item} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={form.environment.sharedSpaces.includes(item)} onCheckedChange={() => {
                    const arr = new Set(form.environment.sharedSpaces);
                    arr.has(item) ? arr.delete(item) : arr.add(item);
                    setForm((d) => ({ ...d, environment: { ...d.environment, sharedSpaces: Array.from(arr) } }));
                  }} />
                  <span className="text-sm cursor-pointer">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );

    if (k === "rulesPricing")
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-md font-semibold">أوقات الدخول والخروج</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">بداية وقت الدخول</label>
                <Input type="time" value={form.rules.checkInFrom} onChange={(e) => setForm((d) => ({ ...d, rules: { ...d.rules, checkInFrom: e.target.value } }))} />
              </div>
              <div>
                <label className="text-sm font-medium">نهاية وقت الدخول</label>
                <Input type="time" value={form.rules.checkInTo} onChange={(e) => setForm((d) => ({ ...d, rules: { ...d.rules, checkInTo: e.target.value } }))} />
              </div>
              <div>
                <label className="text-sm font-medium">وقت الخروج</label>
                <Input type="time" value={form.rules.checkOut} onChange={(e) => setForm((d) => ({ ...d, rules: { ...d.rules, checkOut: e.target.value } }))} />
              </div>
              <div>
                <label className="text-sm font-medium">الحد الأدنى للعمر (سنة)</label>
                <Input type="number" min={0} value={form.rules.minAge} onChange={(e) => setForm((d) => ({ ...d, rules: { ...d.rules, minAge: Math.max(0, Number(e.target.value) || 0) } }))} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-semibold">التسعير (بالريال العماني) *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium text-center">الأيام العادية</h4>
                <div>
                  <label className="text-sm">مع المبيت</label>
                  <Input type="number" min={0} step="0.5" value={form.pricing.weekday_with_accommodation} onChange={(e) => setForm((d) => ({ ...d, pricing: { ...d.pricing, weekday_with_accommodation: Math.max(0, Number(e.target.value) || 0) } }))} />
                </div>
                <div>
                  <label className="text-sm">بدون المبيت</label>
                  <Input type="number" min={0} step="0.5" value={form.pricing.weekday_without_accommodation} onChange={(e) => setForm((d) => ({ ...d, pricing: { ...d.pricing, weekday_without_accommodation: Math.max(0, Number(e.target.value) || 0) } }))} />
                </div>
              </div>
              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium text-center">أيام العطل والمناسبات</h4>
                <div>
                  <label className="text-sm">مع المبيت</label>
                  <Input type="number" min={0} step="0.5" value={form.pricing.holiday_with_accommodation} onChange={(e) => setForm((d) => ({ ...d, pricing: { ...d.pricing, holiday_with_accommodation: Math.max(0, Number(e.target.value) || 0) } }))} />
                </div>
                <div>
                  <label className="text-sm">بدون المبيت</label>
                  <Input type="number" min={0} step="0.5" value={form.pricing.holiday_without_accommodation} onChange={(e) => setForm((d) => ({ ...d, pricing: { ...d.pricing, holiday_without_accommodation: Math.max(0, Number(e.target.value) || 0) } }))} />
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">اترك غير المتاح بقيمة 0.</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">قواعد وشروط إضافية (اختياري)</label>
            <Textarea rows={3} value={form.rules.additionalRules || ""} onChange={(e) => setForm((d) => ({ ...d, rules: { ...d.rules, additionalRules: e.target.value } }))} placeholder="مثال: هدوء بعد 10 م، ممنوع التدخين..." />
          </div>
        </div>
      );

    if (k === "images")
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">صور المخيم *</label>
            <Input type="file" multiple accept="image/*" onChange={(e) => setForm((d) => ({ ...d, files: Array.from(e.target.files || []) }))} />
            <div className="text-xs text-muted-foreground mt-2">ارفع 5 صور على الأقل. الصورة الأولى ستكون الرئيسية.</div>
          </div>
          {form.files.length > 0 && <div className="text-sm text-green-600">تم اختيار {form.files.length} صورة</div>}
        </div>
      );

    if (k === "review") {
      const totalBeds = Object.values(form.capacity.beds || {}).reduce((s, v) => s + Number(v || 0), 0);
      return (
        <div className="space-y-6 text-sm">
          <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /> مراجعة البيانات قبل الإرسال</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">المخيم</h4>
              <div><strong>الاسم:</strong> {form.basics.name || "-"}</div>
              <div><strong>النوع:</strong> {form.basics.propertyType || "-"}</div>
              <div><strong>الموقع:</strong> {[form.location.city, form.location.state, form.location.country].filter(Boolean).join(", ") || "-"}</div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">الوصف</h4>
              <div><strong>الملخص:</strong> {form.description.summary || "-"}</div>
              <div><strong>الخدمات:</strong> {form.description.guestServices || "-"}</div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">السعة</h4>
              <div><strong>الضيوف:</strong> {form.capacity.maxGuests}</div>
              <div><strong>غرف النوم:</strong> {form.capacity.bedrooms}</div>
              <div><strong>إجمالي الأسرّة:</strong> {totalBeds}</div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">التسعير</h4>
              <div><strong>عادي مع مبيت:</strong> {form.pricing.weekday_with_accommodation || 0}</div>
              <div><strong>عادي بدون مبيت:</strong> {form.pricing.weekday_without_accommodation || 0}</div>
              <div><strong>عطلة مع مبيت:</strong> {form.pricing.holiday_with_accommodation || 0}</div>
              <div><strong>عطلة بدون مبيت:</strong> {form.pricing.holiday_without_accommodation || 0}</div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">الخدمات والبيئة</h4>
              <div><strong>أساسية:</strong> {(form.features.amenities.basic || []).length} عنصر</div>
              <div><strong>حمام:</strong> {(form.features.amenities.bath || []).length} عنصر</div>
              <div><strong>مطبخ:</strong> {(form.features.amenities.kitchen || []).length} عنصر</div>
              <div><strong>خارجية:</strong> {(form.features.amenities.outdoor || []).length} عنصر</div>
              <div><strong>تضاريس:</strong> {(form.environment.terrain || []).length} نوع</div>
              <div><strong>أنشطة:</strong> {(form.environment.activities || []).length} نشاط</div>
              <div><strong>عزلة:</strong> {form.environment.seclusion || "-"}</div>
              <div><strong>صور:</strong> {form.files.length}</div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div dir="rtl">
      <div className="rounded-lg border bg-card p-6">
        <StepHeader />
        {renderStep()}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={isFirst ? onCancel : prev} className="inline-flex items-center gap-2">
          <ChevronRight className="h-4 w-4 rotate-180" /> {isFirst ? "إلغاء" : "السابق"}
        </Button>
        {!isLast ? (
          <Button onClick={next} className="inline-flex items-center gap-2">
            التالي <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={submit} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700">
            إرسال الطلب <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
