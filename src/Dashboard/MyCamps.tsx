// src/pages/Dashboard/MyCamps.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "../components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter as AlertDialogFooterC, AlertDialogHeader, AlertDialogTitle
} from "../components/ui/dialog-alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useToast as useUiToast } from "../components/ui/use-toast";
import { MapPin, Users, Eye, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon, Star, CheckCircle2, X } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

// ثوابت وتصنيفات لقسم الإضافة
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


const ARAB_COUNTRIES = [
  { code: "DZ", label: "الجزائر (Algeria)" },
  { code: "BH", label: "البحرين (Bahrain)" },
  // { code: "KM", label: "جزر القمر (Comoros)" },
  // { code: "DJ", label: "جيبوتي (Djibouti)" },
  { code: "EG", label: "مصر (Egypt)" },
  // { code: "IQ", label: "العراق (Iraq)" },
  { code: "JO", label: "الأردن (Jordan)" },
  { code: "KW", label: "الكويت (Kuwait)" },
  // { code: "LB", label: "لبنان (Lebanon)" },
  // { code: "LY", label: "ليبيا (Libya)" },
  // { code: "MR", label: "موريتانيا (Mauritania)" },
  { code: "MA", label: "المغرب (Morocco)" },
  { code: "OM", label: "عمان (Oman)" },
  // { code: "PS", label: "فلسطين (Palestine)" },
  { code: "QA", label: "قطر (Qatar)" },
  { code: "SA", label: "السعودية (KSA)" },
  // { code: "SO", label: "الصومال (Somalia)" },
  // { code: "SD", label: "السودان (Sudan)" },
  // { code: "SY", label: "سوريا (Syria)" },
  { code: "TN", label: "تونس (Tunisia)" },
  { code: "AE", label: "الإمارات (UAE)" },
  // { code: "YE", label: "اليمن (Yemen)" },
];
const documentTypes = [
  { code: "ID", label: "Identity card" },
  { code: "PASS", label: "Passport" },
  { code: "DL", label: "Driving license" },
];
const basicAmenities = ["WiFi","تكييف","تدفئة","مولد كهرباء","إضاءة"];
const bathAmenities = ["حمام خاص","دش ساخن","مناشف","صابون","شامبو"];
const kitchenAmenities = ["مطبخ مجهز","ثلاجة","موقد","أواني طبخ","مياه شرب"];
const outdoorAmenities = ["شواء","جلسة خارجية","كراسي","طاولة","مظلة"];
// إضافة مرافق مخصصة عبر الواجهة (التعديل المطلوب)
const facilities = ["موقف سيارات","أمن","نظافة","استقبال 24 ساعة","خدمة غرف"];
const sharedSpaces = ["صالة مشتركة","مطبخ مشترك","حديقة","مسبح","ملعب"];
const seclusionOptions = ["منعزل تماماً","شبه منعزل","بجانب مخيمات أخرى","في منطقة سياحية"];
const activitiesOptions = ["رحلات استكشافية","سفاري","صيد","سباحة","تسلق","نجوم"];
const terrainOptions = ["صحراء","جبال","شاطئ","واحة","غابة","سهول"];
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

// الأنواع العامة
type ApiImage = { id: number; imageUrl: string; isCover: boolean };
type ApiService = { id: number; name: string; description: string };
type ApiCampService = { service: ApiService };
type ApiTimeSlot = { name: string; startTime: string; endTime: string; dayType: string };

type ApiCamp = {
  id: number;
  title: string;
  ownerId: string;
  capacity: number;
  country: string | null;
  state: string | null;
  city: string | null;
  hasAccommodation: boolean;
  priceWeekdays: number;
  priceHolidays: number;
  approvalStatus: string;
  reviewsAverage: number;
  reviewsCount: number;
  images: ApiImage[];
  campServices: ApiCampService[];
  timeSlots: ApiTimeSlot[];
  campTypes: any[];
};

type PagedResponse<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
};

// واجهة نموذج معالج الإضافة
type BedsMap = Record<string, number>;
type WizardForm = {
  profile: {
    country: string;
    docType: string;
    docNumber: string;
    docCountry: string;
    why: string;
    agreeTerms: boolean;
  };
  basics: { name: string; propertyType: string; website: string };
  description: { summary: string; guestServices: string };
  location: { country: string; state: string; city: string; zip: string; street: string };
  capacity: { maxGuests: number; bedrooms: number; beds: BedsMap };
  features: { amenities: { basic: string[]; bath: string[]; kitchen: string[]; outdoor: string[] }; facilities: string[] };
  environment: { terrain: string[]; seclusion: string; activities: string[]; sharedSpaces: string[] };
  rules: { checkInFrom: string; checkInTo: string; checkOut: string; minAge: number; additionalRules?: string };
  pricing: {
    weekday_with_accommodation: number;
    weekday_without_accommodation: number;
    holiday_with_accommodation: number;
    holiday_without_accommodation: number;
  };
  files: File[];
};

// Steps components
function StepProfile({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  const update = (patch: Partial<WizardForm["profile"]>) =>
    setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">🏕️ أنشئ ملفك الشخصي</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">نوع الوثيقة</label>
          <Select value={data.profile.docType} onValueChange={(v) => update({ docType: v })}>
            <SelectTrigger><SelectValue placeholder="اختر نوع الوثيقة" /></SelectTrigger>
            <SelectContent>
              {documentTypes.map((dt) => <SelectItem key={dt.code} value={dt.code}>{dt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">رقم الوثيقة</label>
          <Input value={data.profile.docNumber} onChange={(e) => update({ docNumber: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">بلد الإصدار</label>
          <Select value={data.profile.docCountry} onValueChange={(v) => update({ docCountry: v })}>
            <SelectTrigger><SelectValue placeholder="اختر بلد الإصدار" /></SelectTrigger>
            <SelectContent>
              {ARAB_COUNTRIES.map((ct) => <SelectItem key={ct.code} value={ct.code}>{ct.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">الدولة</label>
          <Select value={data.profile.country} onValueChange={(v) => update({ country: v })}>
            <SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
            <SelectContent>
              {ARAB_COUNTRIES.map((ct) => <SelectItem key={ct.code} value={ct.code}>{ct.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">العملة</label>
          <Input value="USD – الدولار الأمريكي" readOnly />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">لماذا ترغب في الإدراج؟ (اختياري)</label>
        <Textarea rows={3} value={data.profile.why} onChange={(e) => update({ why: e.target.value })} placeholder="اكتب بإيجاز سبب رغبتك في الإدراج..." />
      </div>

      <div className="flex items-center space-x-2 space-x-reverse">
        <Checkbox id="agree" checked={data.profile.agreeTerms} onCheckedChange={(v) => update({ agreeTerms: !!v })} />
        <label htmlFor="agree" className="text-sm cursor-pointer">✅ أوافق على الشروط والأحكام وسياسة حماية البيانات</label>
      </div>
    </div>
  );
}

function StepBasics({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  const updateBasics = (patch: Partial<WizardForm["basics"]>) =>
    setData((d) => ({ ...d, basics: { ...d.basics, ...patch } }));
  const updateDesc = (patch: Partial<WizardForm["description"]>) =>
    setData((d) => ({ ...d, description: { ...d.description, ...patch } }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">اسم المخيم *</label>
          <Input value={data.basics.name} onChange={(e) => updateBasics({ name: e.target.value })} placeholder="مثال: مخيم الرمال الذهبية" />
        </div>
        <div>
          <label className="text-sm font-medium">نوع الملكية *</label>
          <Select value={data.basics.propertyType} onValueChange={(v) => updateBasics({ propertyType: v })}>
            <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
            <SelectContent>
              {propertyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">الموقع الإلكتروني (اختياري)</label>
          <Input value={data.basics.website} onChange={(e) => updateBasics({ website: e.target.value })} placeholder="https://example.com" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">وصف المخيم *</label>
        <Textarea value={data.description.summary} onChange={(e) => updateDesc({ summary: e.target.value })} rows={4} placeholder="اكتب وصفاً جذاباً لمخيمك..." />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">خدمات الضيوف</label>
        <Textarea value={data.description.guestServices} onChange={(e) => updateDesc({ guestServices: e.target.value })} rows={3} placeholder="مثال: توصيل من المطار، جولات سياحية..." />
      </div>
    </div>
  );
}

function StepLocation({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  const update = (patch: Partial<WizardForm["location"]>) =>
    setData((d) => ({ ...d, location: { ...d.location, ...patch } }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">الدولة *</label>
          <Input value={data.location.country} onChange={(e) => update({ country: e.target.value })} placeholder="عُمان" />
        </div>
        <div>
          <label className="text-sm font-medium">المحافظة/الولاية *</label>
          <Input value={data.location.state} onChange={(e) => update({ state: e.target.value })} placeholder="مسقط" />
        </div>
        <div>
          <label className="text-sm font-medium">المدينة *</label>
          <Input value={data.location.city} onChange={(e) => update({ city: e.target.value })} placeholder="السيب" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">الرمز البريدي</label>
          <Input value={data.location.zip} onChange={(e) => update({ zip: e.target.value })} placeholder="123" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">العنوان التفصيلي</label>
          <Input value={data.location.street} onChange={(e) => update({ street: e.target.value })} placeholder="الشارع، المعالم القريبة..." />
        </div>
      </div>
    </div>
  );
}

function StepCapacity({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  const update = (patch: Partial<WizardForm["capacity"]>) =>
    setData((d) => ({ ...d, capacity: { ...d.capacity, ...patch } }));
  const totalBeds = Object.values(data.capacity.beds || {}).reduce((s, v) => s + Number(v || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">أقصى عدد ضيوف *</label>
          <Input type="number" min={1} value={data.capacity.maxGuests} onChange={(e) => update({ maxGuests: Math.max(1, Number(e.target.value) || 1) })} />
        </div>
        <div>
          <label className="text-sm font-medium">عدد غرف النوم</label>
          <Input type="number" min={0} value={data.capacity.bedrooms} onChange={(e) => update({ bedrooms: Math.max(0, Number(e.target.value) || 0) })} />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">أنواع الأسرّة المتوفرة</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bedTypes.map((b) => (
            <div key={b.key} className="flex items-center justify-between border rounded-lg p-3">
              <span className="text-sm">{b.label}</span>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => update({ beds: { ...data.capacity.beds, [b.key]: Math.max(0, (data.capacity.beds[b.key] || 0) - 1) } })}>−</Button>
                <Input type="number" min={0} value={data.capacity.beds[b.key] || 0} onChange={(e) => update({ beds: { ...data.capacity.beds, [b.key]: Math.max(0, Number(e.target.value) || 0) } })} className="w-20 text-center" />
                <Button type="button" variant="outline" onClick={() => update({ beds: { ...data.capacity.beds, [b.key]: Math.min(20, (data.capacity.beds[b.key] || 0) + 1) } })}>+</Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">إجمالي الأسرّة: {totalBeds}</p>
      </div>
    </div>
  );
}

// التعديل المطلوب: إضافة مرافق مخصصة داخل AddCamp فقط
function StepFeatures({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  const [newFacility, setNewFacility] = useState<string>("");

  const updateAmenities = (category: keyof WizardForm["features"]["amenities"], item: string) => {
    const current = data.features.amenities[category] || [];
    const exists = current.includes(item);
    const newItems = exists ? current.filter(i => i !== item) : [...current, item];
    setData((d) => ({ ...d, features: { ...d.features, amenities: { ...d.features.amenities, [category]: newItems } } }));
  };

  const toggleFacilities = (item: string) => {
    const current = data.features.facilities || [];
    const exists = current.includes(item);
    const next = exists ? current.filter(i => i !== item) : [...current, item];
    setData((d) => ({ ...d, features: { ...d.features, facilities: next } }));
  };

  const addCustomFacility = () => {
    const v = newFacility.trim();
    if (!v) return;
    if ((data.features.facilities || []).some(f => f.toLowerCase() === v.toLowerCase())) return;
    setData((d) => ({ ...d, features: { ...d.features, facilities: [...(d.features.facilities || []), v] } }));
    setNewFacility("");
  };

  const removeFacility = (v: string) => {
    setData((d) => ({ ...d, features: { ...d.features, facilities: (d.features.facilities || []).filter(x => x !== v) } }));
  };

  const isChecked = (v: string) => (data.features.facilities || []).includes(v);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-md font-semibold">الخدمات الأساسية</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {basicAmenities.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`basic-${item}`} checked={(data.features.amenities.basic || []).includes(item)} onCheckedChange={() => updateAmenities("basic", item)} />
              <label htmlFor={`basic-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-semibold">مرافق الحمام</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {bathAmenities.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`bath-${item}`} checked={(data.features.amenities.bath || []).includes(item)} onCheckedChange={() => updateAmenities("bath", item)} />
              <label htmlFor={`bath-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-semibold">مرافق المطبخ</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {kitchenAmenities.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`kitchen-${item}`} checked={(data.features.amenities.kitchen || []).includes(item)} onCheckedChange={() => updateAmenities("kitchen", item)} />
              <label htmlFor={`kitchen-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-semibold">مرافق خارجية</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {outdoorAmenities.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`outdoor-${item}`} checked={(data.features.amenities.outdoor || []).includes(item)} onCheckedChange={() => updateAmenities("outdoor", item)} />
              <label htmlFor={`outdoor-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-semibold">خدمات عامة</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {facilities.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`facility-${item}`} checked={isChecked(item)} onCheckedChange={() => toggleFacilities(item)} />
              <label htmlFor={`facility-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>

        {/* إضافة مرافق مخصصة */}
        {/* <div className="mt-3 space-y-2">
          <label className="text-sm font-medium">إضافة مرفق مخصص</label>
          <div className="flex gap-2">
            <Input
              placeholder="اكتب اسم المرفق ثم اضغط إضافة"
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomFacility(); } }}
            />
            <Button type="button" variant="outline" onClick={addCustomFacility}>إضافة</Button>
          </div>

          {data.features.facilities?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {data.features.facilities.map((f, i) => (
                <span key={`${f}-${i}`} className="inline-flex items-center gap-1 bg-muted text-xs px-2 py-1 rounded">
                  {f}
                  <button
                    type="button"
                    className="opacity-70 hover:opacity-100"
                    onClick={() => removeFacility(f)}
                    aria-label={`حذف ${f}`}
                    title="حذف"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

function StepEnvironment({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  const toggleEnv = (key: "terrain" | "activities" | "sharedSpaces") => (item: string) => {
    const current = (data.environment as any)[key] as string[];
    const exists = current?.includes(item);
    const next = exists ? current.filter(i => i !== item) : [...(current || []), item];
    setData((d) => ({ ...d, environment: { ...d.environment, [key]: next } }));
  };
  const updateSeclusion = (value: string) =>
    setData((d) => ({ ...d, environment: { ...d.environment, seclusion: value } }));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-md font-semibold">نوع التضاريس</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {terrainOptions.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`terrain-${item}`} checked={(data.environment.terrain || []).includes(item)} onCheckedChange={() => toggleEnv("terrain")(item)} />
              <label htmlFor={`terrain-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-md font-semibold">مستوى العزلة</label>
        <Select value={data.environment.seclusion || ""} onValueChange={updateSeclusion}>
          <SelectTrigger><SelectValue placeholder="اختر مستوى العزلة" /></SelectTrigger>
          <SelectContent>
            {seclusionOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-semibold">أنشطة متوفرة</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {activitiesOptions.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`activity-${item}`} checked={(data.environment.activities || []).includes(item)} onCheckedChange={() => toggleEnv("activities")(item)} />
              <label htmlFor={`activity-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-semibold">مساحات مشتركة</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sharedSpaces.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`shared-${item}`} checked={(data.environment.sharedSpaces || []).includes(item)} onCheckedChange={() => toggleEnv("sharedSpaces")(item)} />
              <label htmlFor={`shared-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepRulesPricing({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  const updateRules = (patch: Partial<WizardForm["rules"]>) =>
    setData((d) => ({ ...d, rules: { ...d.rules, ...patch } }));
  const updatePricing = (patch: Partial<WizardForm["pricing"]>) =>
    setData((d) => ({ ...d, pricing: { ...d.pricing, ...patch } }));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-md font-semibold">أوقات الدخول والخروج</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">بداية وقت الدخول</label>
            <Input type="time" value={data.rules.checkInFrom} onChange={(e) => updateRules({ checkInFrom: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">نهاية وقت الدخول</label>
            <Input type="time" value={data.rules.checkInTo} onChange={(e) => updateRules({ checkInTo: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">وقت الخروج</label>
            <Input type="time" value={data.rules.checkOut} onChange={(e) => updateRules({ checkOut: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">الحد الأدنى للعمر (سنة)</label>
            <Input type="number" min={0} value={data.rules.minAge} onChange={(e) => updateRules({ minAge: Math.max(0, Number(e.target.value) || 0) })} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-semibold">التسعير (بالريال العماني)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 border rounded-lg">
            <h4 className="font-medium text-center">الأيام العادية</h4>
            <div>
              <label className="text-sm">مع المبيت</label>
              <Input type="number" min={0} step="0.5" value={data.pricing.weekday_with_accommodation} onChange={(e) => updatePricing({ weekday_with_accommodation: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
            <div>
              <label className="text-sm">بدون المبيت</label>
              <Input type="number" min={0} step="0.5" value={data.pricing.weekday_without_accommodation} onChange={(e) => updatePricing({ weekday_without_accommodation: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <h4 className="font-medium text-center">أيام العطل والمناسبات</h4>
            <div>
              <label className="text-sm">مع المبيت</label>
              <Input type="number" min={0} step="0.5" value={data.pricing.holiday_with_accommodation} onChange={(e) => updatePricing({ holiday_with_accommodation: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
            <div>
              <label className="text-sm">بدون المبيت</label>
              <Input type="number" min={0} step="0.5" value={data.pricing.holiday_without_accommodation} onChange={(e) => updatePricing({ holiday_without_accommodation: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">قواعد وشروط إضافية (اختياري)</label>
          <Textarea rows={3} value={data.rules.additionalRules || ""} onChange={(e) => updateRules({ additionalRules: e.target.value })} placeholder="مثال: هدوء بعد 10 م، ممنوع التدخين..." />
        </div>
      </div>
    </div>
  );
}

function StepImages({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">صور المخيم *</label>
        <Input type="file" multiple accept="image/*" onChange={(e) => setData((d) => ({ ...d, files: Array.from(e.target.files || []) }))} />
        <div className="text-xs text-muted-foreground mt-2">ارفع عدة صور عالية الجودة. الصورة الأولى ستكون الرئيسية.</div>
      </div>
      {data.files.length > 0 && <div className="text-sm text-green-600">تم اختيار {data.files.length} صورة</div>}
    </div>
  );
}

function StepReview({ data }: { data: WizardForm }) {
  const totalBeds = Object.values(data.capacity.beds || {}).reduce((s, v) => s + Number(v || 0), 0);
  return (
    <div className="space-y-6 text-sm">
      <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /> مراجعة البيانات قبل الإرسال</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="font-semibold">الملف الشخصي</h4>
          <div><strong>الدولة:</strong> {data.profile.country || "-"}</div>
          <div><strong>الوثيقة:</strong> {data.profile.docType || "-"} / {data.profile.docNumber || "-"} / {data.profile.docCountry || "-"}</div>
          <div><strong>العملة:</strong> USD – الدولار الأمريكي</div>
          <div><strong>السبب:</strong> {data.profile.why || "-"}</div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">المخيم</h4>
          <div><strong>الاسم:</strong> {data.basics.name || "-"}</div>
          <div><strong>النوع:</strong> {data.basics.propertyType || "-"}</div>
          <div><strong>الموقع:</strong> {[data.location.city, data.location.state, data.location.country].filter(Boolean).join(", ") || "-"}</div>
          <div><strong>الضيوف:</strong> {data.capacity.maxGuests || 0}</div>
          <div><strong>غرف النوم:</strong> {data.capacity.bedrooms || 0}</div>
          <div><strong>إجمالي الأسرّة:</strong> {totalBeds}</div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">التسعير</h4>
          <div><strong>عادي مع مبيت:</strong> {data.pricing.weekday_with_accommodation || 0}</div>
          <div><strong>عادي بدون مبيت:</strong> {data.pricing.weekday_without_accommodation || 0}</div>
          <div><strong>عطلة مع مبيت:</strong> {data.pricing.holiday_with_accommodation || 0}</div>
          <div><strong>عطلة بدون مبيت:</strong> {data.pricing.holiday_without_accommodation || 0}</div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">الخدمات والبيئة</h4>
          <div><strong>أساسية:</strong> {(data.features.amenities.basic || []).length} عنصر</div>
          <div><strong>حمام:</strong> {(data.features.amenities.bath || []).length} عنصر</div>
          <div><strong>مطبخ:</strong> {(data.features.amenities.kitchen || []).length} عنصر</div>
          <div><strong>خارجية:</strong> {(data.features.amenities.outdoor || []).length} عنصر</div>
          <div><strong>خدمات عامة:</strong> {(data.features.facilities || []).length} عنصر</div>
          <div><strong>تضاريس:</strong> {(data.environment.terrain || []).length} نوع</div>
          <div><strong>أنشطة:</strong> {(data.environment.activities || []).length} نشاط</div>
          <div><strong>عزلة:</strong> {data.environment.seclusion || "-"}</div>
          <div><strong>صور:</strong> {data.files.length}</div>
        </div>
      </div>
    </div>
  );
}

export default function MyCamps(): JSX.Element {
  const [camps, setCamps] = useState<ApiCamp[]>([]);
  const [count, setCount] = useState(0);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCamp, setDeletingCamp] = useState<ApiCamp | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);

  // إضافة مخيم
  const [isAddOpen, setIsAddOpen] = useState(false);

  const ownerId = localStorage.getItem("userId") || sessionStorage.getItem("userId") || "";

  const statusColor = (status: string) => {
    const s = (status || "").trim();
    if (["approved", "موافق عليه", "مفعل"].includes(s)) return "bg-emerald-500 hover:bg-emerald-500/80";
    if (["pending", "قيد المراجعة"].includes(s)) return "bg-amber-500 hover:bg-amber-500/80";
    if (["rejected", "مرفوض"].includes(s)) return "bg-rose-500 hover:bg-rose-500/80";
    return "bg-muted text-muted-foreground";
  };
  const statusLabel = (status: string) => {
    const s = (status || "").trim();
    if (["approved", "موافق عليه", "مفعل"].includes(s)) return "موافق عليه";
    if (["pending", "قيد المراجعة"].includes(s)) return "قيد المراجعة";
    if (["rejected", "مرفوض"].includes(s)) return "مرفوض";
    return s || "غير محدد";
  };

  const coverImage = (images: ApiImage[]) => images?.find(i => i.isCover)?.imageUrl || images?.[0]?.imageUrl || "";
  const serviceNames = (cs: ApiCampService[]) => (cs || []).map(x => x.service?.name).filter(Boolean) as string[];
  const checkIn = (ts: ApiTimeSlot[]) => (ts || []).find(t => (t.name || "").toLowerCase() === "checkin");
  const checkOut = (ts: ApiTimeSlot[]) => (ts || []).find(t => (t.name || "").toLowerCase() === "checkout");

  const load = async (signal?: AbortSignal) => {
    if (!ownerId) { setCamps([]); setCount(0); return; }
    const res = await api.get<PagedResponse<ApiCamp>>("/api/Camp", {
      params: { OwnerId: ownerId, PageIndex: currentPage, PageSize: cardsPerPage },
      signal
    });
    setCamps(res.data.data || []);
    setCount(res.data.count || 0);
  };

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal).catch(e => { if (!ctrl.signal.aborted) toast.error("تعذر تحميل المخيمات"); });
    return () => ctrl.abort();
  }, [ownerId, currentPage, cardsPerPage]);

  const totalPages = Math.max(1, Math.ceil(count / cardsPerPage));
  const onDelete = (camp: ApiCamp) => { setDeletingCamp(camp); setIsDeleteDialogOpen(true); };

  const confirmDelete = async () => {
    if (!deletingCamp) return;
    try {
      await api.delete(`/api/Camp/${deletingCamp.id}`);
      setCamps(prev => prev.filter(c => c.id !== deletingCamp.id));
      setCount(prev => Math.max(0, prev - 1));
      toast.success("تم حذف المخيم بنجاح");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "تعذر حذف المخيم");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingCamp(null);
    }
  };

  const featuredFields = useMemo(() => ({
    headerTitle: "مخيماتي",
    subTitle: "إدارة مخيماتك بسهولة",
  }), []);

  // ===== تفاصيل الطلب =====
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [parsed, setParsed] = useState<any>(null);

  const StatusBadgeAdmin = ({ status }: { status: 0 | 1 | 2 }) => {
    const statusMap = {
      0: { label: "قيد الانتظار", className: "bg-amber-500 hover:bg-amber-500/80" },
      1: { label: "موافق عليه", className: "bg-emerald-500 hover:bg-emerald-500/80" },
      2: { label: "مرفوض", className: "bg-rose-500 hover:bg-rose-500/80" },
    } as const;
    const cfg = statusMap[status ?? 0];
    return <Badge variant="default" className={cfg.className}>{cfg.label}</Badge>;
  };

  const formatDate = (s?: string) => {
    if (!s) return "-";
    try {
      return new Date(s).toLocaleString("ar-SA", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch { return s as string; }
  };

  function toArray<T = string>(v: any): T[] { return Array.isArray(v) ? v : []; }
  const BED_LABELS: Record<string, string> = {
    king: "سرير كينغ", queen: "سرير كوين", double: "سرير مزدوج", twin: "سرير مفرد",
    bunk: "سرير بطابقين", sofa: "سرير أريكة", crib: "سرير أطفال", air: "سرير هوائي",
  };

  function parseAllPayload(raw?: string) {
    try {
      const j = raw ? JSON.parse(raw) : {};
      const profile = j.profile || {};
      const profileDoc = (profile.document || {}) as { type?: string; number?: string; countryOfIssue?: string };

      const basics = j.basics || {};
      const description = j.description || {};
      const location = j.location || {};
      const capacity = j.capacity || {};
      const bedsObj = capacity.beds || {};
      const facilitiesParsed = toArray(j.facilities);
      const amenities = j.amenities || {};
      const sharedSpacesParsed = toArray(j.sharedSpaces);
      const seclusion = toArray(j.seclusion);
      const activities = j.activities || {};
      const terrainArr = Array.isArray(j.terrain) ? j.terrain : toArray((j.terrain || {}).options);
      const rules = j.rules || {};
      const booking = j.booking || {};
      const pricing = j.pricing || {};
      const pWeekday = (pricing.weekday || {}) as any;
      const pHoliday = (pricing.holiday || {}) as any;

      const bedsArray = Object.keys(bedsObj)
        .map((k) => ({ key: k, label: BED_LABELS[k] || k, count: Number(bedsObj[k] || 0) }))
        .filter((b) => b.count > 0);

      return {
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
        basics: {
          name: basics.name || "-",
          propertyType: basics.propertyType || "-",
          website: basics.website || "",
        },
        description: {
          summary: description.summary || "",
          guestServices: description.guestServices || "",
        },
        location: {
          country: location.country || "",
          state: location.state || "",
          city: location.city || "",
          zip: location.zip || "",
          street: location.street || "",
        },
        capacity: {
          maxGuests: Number(capacity.maxGuests ?? 0),
          bedrooms: Number(capacity.bedrooms ?? 0),
          beds: bedsArray,
        },
        facilities: facilitiesParsed,
        amenities: {
          basic: toArray(amenities.basic),
          bath: toArray(amenities.bath),
          kitchen: toArray(amenities.kitchen),
          outdoor: toArray(amenities.outdoor),
        },
        sharedSpaces: sharedSpacesParsed,
        seclusion,
        activities: {
          options: toArray(activities.options),
        },
        terrain: terrainArr,
        rules: {
          checkInFrom: rules.checkInFrom || "",
          checkInTo: rules.checkInTo || "",
          checkOut: rules.checkOut || "",
          minAge: Number(rules.minAge ?? 0),
          additionalRules: rules.additionalRules || "",
        },
        booking,
        pricing: {
          weekday: {
            withAccommodation: Number(pWeekday.withAccommodation ?? 0),
            withoutAccommodation: Number(pWeekday.withoutAccommodation ?? 0),
          },
          holiday: {
            withAccommodation: Number(pHoliday.withAccommodation ?? 0),
            withoutAccommodation: Number(pHoliday.withoutAccommodation ?? 0),
          },
        },
      };
    } catch {
      return null;
    }
  }

  // قراءة status من data.request.status عند فتح التفاصيل
  const openCampDetails = async (id: number) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetails(null);
    setParsed(null);
    try {
      const { data } = await api.get(`/api/Camp/${id}/details`);
      const req = data?.request || {};
      const merged = {
        id: data?.requestId ?? req?.id ?? id,
        status: Number(req?.status ?? data?.status ?? 0) as 0 | 1 | 2,
        title: data?.title ?? req?.title ?? "",
        propertyType: data?.propertyType ?? req?.propertyType ?? "",
        ownerId: data?.ownerId ?? req?.ownerId ?? "",
        submittedOn: data?.submittedOn ?? data?.createdOn ?? req?.submittedOn ?? req?.createdOn ?? null,
        images: (data?.images?.length ? data?.images : req?.images) ? (data?.images || req?.images).map((x: any) => x?.imageUrl || x).filter(Boolean) : [],
        rawPayloadJson: data?.rawPayloadJson ?? req?.rawPayloadJson ?? null,
      };
      setDetails(merged);
      setParsed(parseAllPayload(merged.rawPayloadJson));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "تعذر تحميل التفاصيل");
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // حالات وإجراءات معالج الإضافة
  const { toast: uiToast } = useUiToast();
  const initialForm: WizardForm = useMemo(() => ({
    profile: {
      country: "", docType: "", docNumber: "", docCountry: "", why: "", agreeTerms: true,
    },
    basics: { name: "", propertyType: "", website: "" },
    description: { summary: "", guestServices: "" },
    location: { country: "", state: "", city: "", zip: "", street: "" },
    capacity: { maxGuests: 1, bedrooms: 0, beds: bedTypes.reduce((acc, b) => ({ ...acc, [b.key]: 0 }), {} as BedsMap) },
    features: { amenities: { basic: [], bath: [], kitchen: [], outdoor: [] }, facilities: [] },
    environment: { terrain: [], seclusion: "", activities: [], sharedSpaces: [] },
    rules: { checkInFrom: "14:00", checkInTo: "22:00", checkOut: "12:00", additionalRules: "", minAge: 18 },
    pricing: { weekday_with_accommodation: 0, weekday_without_accommodation: 0, holiday_with_accommodation: 0, holiday_without_accommodation: 0 },
    files: [],
  }), []);
  const [addForm, setAddForm] = useState<WizardForm>(initialForm);
  const steps = useMemo(() => ([
    { key: "profile", title: "إنشاء ملفك الشخصي", comp: <StepProfile data={addForm} setData={setAddForm} /> },
    { key: "basics", title: "الأساسيات", comp: <StepBasics data={addForm} setData={setAddForm} /> },
    { key: "location", title: "الموقع", comp: <StepLocation data={addForm} setData={setAddForm} /> },
    { key: "capacity", title: "السعة", comp: <StepCapacity data={addForm} setData={setAddForm} /> },
    { key: "features", title: "المرافق والخدمات", comp: <StepFeatures data={addForm} setData={setAddForm} /> }, // ← تم فيها إضافة المرافق المخصصة
    { key: "environment", title: "البيئة والأنشطة", comp: <StepEnvironment data={addForm} setData={setAddForm} /> },
    { key: "rulesPricing", title: "القواعد والتسعير", comp: <StepRulesPricing data={addForm} setData={setAddForm} /> },
    { key: "images", title: "الصور", comp: <StepImages data={addForm} setData={setAddForm} /> },
    { key: "review", title: "مراجعة", comp: <StepReview data={addForm} /> },
  ]), [addForm]);

  const [stepIndex, setStepIndex] = useState<number>(0);
  const isFirst = stepIndex === 0;
  const isLast  = stepIndex === steps.length - 1;

  const validateStep = (): boolean => {
    const s = steps[stepIndex].key as string;

    if (s === "profile") {
      const p = addForm.profile;
      if (!p.docType) { uiToast({ title: "نوع الوثيقة مطلوب", variant: "destructive" }); return false; }
      if (!p.docNumber?.trim()) { uiToast({ title: "رقم الوثيقة مطلوب", variant: "destructive" }); return false; }
      if (!p.docCountry) { uiToast({ title: "بلد الإصدار مطلوب", variant: "destructive" }); return false; }
      if (!p.country) { uiToast({ title: "الدولة مطلوبة", variant: "destructive" }); return false; }
      if (!p.agreeTerms) { uiToast({ title: "يجب الموافقة على الشروط", variant: "destructive" }); return false; }
    }

    if (s === "basics") {
      if (!addForm.basics.name.trim()) { uiToast({ title: "اسم المخيم مطلوب", variant: "destructive" }); return false; }
      if (!addForm.basics.propertyType) { uiToast({ title: "نوع الملكية مطلوب", variant: "destructive" }); return false; }
      if (!addForm.description.summary.trim()) { uiToast({ title: "وصف المخيم مطلوب", variant: "destructive" }); return false; }
    }

    if (s === "location") {
      if (!addForm.location.country.trim()) { uiToast({ title: "الدولة مطلوبة", variant: "destructive" }); return false; }
      if (!addForm.location.state.trim()) { uiToast({ title: "المحافظة/الولاية مطلوبة", variant: "destructive" }); return false; }
      if (!addForm.location.city.trim()) { uiToast({ title: "المدينة مطلوبة", variant: "destructive" }); return false; }
      if (!addForm.location.street.trim()) { uiToast({ title: "العنوان التفصيلي مطلوب", variant: "destructive" }); return false; }
    }

    if (s === "capacity") {
      const totalBeds = Object.values(addForm.capacity.beds || {}).reduce((sum, v) => sum + Number(v || 0), 0);
      if (addForm.capacity.maxGuests < 1) { uiToast({ title: "أقصى عدد ضيوف لا يقل عن 1", variant: "destructive" }); return false; }
      if (totalBeds < 1) { uiToast({ title: "أضف سريراً واحداً على الأقل", variant: "destructive" }); return false; }
    }

    if (s === "rulesPricing") {
      if ((addForm.rules.minAge ?? 0) < 0) { uiToast({ title: "الحد الأدنى للعمر غير صالح", variant: "destructive" }); return false; }
      const p = addForm.pricing;
      const prices = [p.weekday_with_accommodation, p.weekday_without_accommodation, p.holiday_with_accommodation, p.holiday_without_accommodation];
      const hasInvalid = prices.some((x) => !(Number.isFinite(x) && x >= 0));
      if (hasInvalid) { uiToast({ title: "تحقق من الأسعار", description: "يجب إدخال قيم صحيحة للأسعار.", variant: "destructive" }); return false; }
      if (prices.every(x => x === 0)) { uiToast({ title: "يجب إدخال سعر واحد على الأقل", variant: "destructive" }); return false; }
    }

    if (s === "images") {
      if ((addForm.files?.length || 0) < 5) {
        uiToast({ title: "الصور مطلوبة", description: "يرجى رفع 5 صور على الأقل.", variant: "destructive" });
        return false;
      }
    }

    return true;
  };

  const resetWizard = () => {
    setAddForm(initialForm);
    setStepIndex(0);
  };

  const submit = async () => {
    try {
      const payload = {
        profile: {
          country: addForm.profile.country || null,
          document: {
            type: addForm.profile.docType,
            number: addForm.profile.docNumber?.trim(),
            countryOfIssue: addForm.profile.docCountry
          },
          reason: addForm.profile.why || null,
          currency: "USD",
        },
        basics: {
          name: addForm.basics.name.trim(),
          propertyType: addForm.basics.propertyType || null,
          website: addForm.basics.website || null
        },
        description: {
          summary: addForm.description.summary || null,
          guestServices: addForm.description.guestServices || null
        },
        location: {
          country: addForm.location.country || null,
          state: addForm.location.state || null,
          city: addForm.location.city || null,
          zip: addForm.location.zip || null,
          street: addForm.location.street || null
        },
        capacity: {
          maxGuests: addForm.capacity.maxGuests,
          bedrooms: addForm.capacity.bedrooms,
          beds: addForm.capacity.beds
        },
        facilities: addForm.features.facilities, // ← تشمل المرافق المخصصة
        amenities: addForm.features.amenities,
        sharedSpaces: addForm.environment.sharedSpaces,
        seclusion: addForm.environment.seclusion ? [addForm.environment.seclusion] : [],
        activities: { options: addForm.environment.activities },
        terrain: addForm.environment.terrain,
        rules: {
          checkInFrom: addForm.rules.checkInFrom,
          checkInTo: addForm.rules.checkInTo,
          checkOut: addForm.rules.checkOut,
          minAge: addForm.rules.minAge,
          additionalRules: addForm.rules.additionalRules || null
        },
        booking: {},
        pricing: {
          weekday: {
            withAccommodation: addForm.pricing.weekday_with_accommodation,
            withoutAccommodation: addForm.pricing.weekday_without_accommodation
          },
          holiday: {
            withAccommodation: addForm.pricing.holiday_with_accommodation,
            withoutAccommodation: addForm.pricing.holiday_without_accommodation
          }
        }
      };

      const fd = new FormData();
      fd.append("joinDataJson", JSON.stringify(payload));
      for (const f of addForm.files) fd.append("images", f);

      await api.post("/api/camp-requests", fd, { headers: { "Content-Type": "multipart/form-data" } });

      uiToast({ title: "تم إرسال الطلب بنجاح!", description: "سيتم التواصل معك خلال 3-5 أيام عمل." });
      setIsAddOpen(false);
      resetWizard();
      await load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.";
      uiToast({ title: "خطأ", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify بين items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{featuredFields.headerTitle}</h1>
          <p className="text-muted-foreground mt-1">{featuredFields.subTitle}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setIsAddOpen(true); }}>إضافة مخيم</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2"><CardDescription>إجمالي المخيمات</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-bold text-primary">{count}</div></CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2"><CardDescription>المفعلة</CardDescription></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">
              {camps.filter(c => ["approved", "موافق عليه", "مفعل"].includes((c.approvalStatus || "").trim())).length}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2"><CardDescription>قيد المراجعة</CardDescription></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {camps.filter(c => ["pending", "قيد المراجعة"].includes((c.approvalStatus || "").trim())).length}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-2"><CardDescription>إجمالي السعة</CardDescription></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {camps.reduce((sum, c) => sum + (c.capacity || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {camps.map((camp) => {
          const cover = coverImage(camp.images);
          const services = serviceNames(camp.campServices);
          const inSlot = checkIn(camp.timeSlots);
          const outSlot = checkOut(camp.timeSlots);
          return (
            <Card key={camp.id} className="overflow-hidden border-border hover:shadow-xl hover:scale-[1.02] transition-all">
              <div className="relative h-48 bg-muted">
                {cover ? (
                  <img src={cover} alt={camp.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">لا توجد صورة</div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="default" className={statusColor(camp.approvalStatus)}>{statusLabel(camp.approvalStatus)}</Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl line-clamp-1">{camp.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  {(camp.city || "-")}, {(camp.state || "-")}, {(camp.country || "-")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>السعة: {camp.capacity}</span>
                  </div>
                  <div className="font-semibold text-primary">
                    {camp.priceWeekdays} دولار / ليلة
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    <span>{camp.images?.length || 0} صور</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{camp.reviewsAverage?.toFixed?.(1) || 0} ({camp.reviewsCount || 0})</span>
                  </div>
                </div>

                {(inSlot || outSlot) && (
                  <div className="text-xs text-muted-foreground">
                    {inSlot && <div>دخول: {inSlot.startTime} - {inSlot.endTime}</div>}
                    {outSlot && <div>خروج: {outSlot.startTime} - {outSlot.endTime}</div>}
                  </div>
                )}

                {services.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {services.slice(0, 4).map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-[11px]">{s}</Badge>
                    ))}
                    {services.length > 4 && <Badge variant="outline" className="text-[11px]">+{services.length - 4}</Badge>}
                  </div>
                )}
              </CardContent>

              <Separator />
              <CardFooter className="flex gap-2 p-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openCampDetails(camp.id)}>
                  <Eye className="h-4 w-4 ml-2" /> تفاصيل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(camp)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">عرض</span>
          <Select value={cardsPerPage.toString()} onValueChange={(v) => { setCardsPerPage(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="18">18</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">مخيم</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <ChevronRight className="h-4 w-4 ml-1" /> السابق
          </Button>
          <span className="text-sm px-4 font-medium">صفحة {currentPage} من {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            التالي <ChevronLeft className="h-4 w-4 mr-1" />
          </Button>
        </div>
      </div>

      {/* Details Dialog — يعرض مثل MyCamps */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">تفاصيل الطلب</DialogTitle>
            <DialogDescription>معلومات كاملة عن طلب الانضمام</DialogDescription>
          </DialogHeader>

          {detailsLoading && <p className="text-center text-muted-foreground py-6">جارٍ تحميل التفاصيل…</p>}

          {details && (
            <div className="space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">الحالة</label><div><StatusBadgeAdmin status={details.status} /></div></div>
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">الاسم</label><p className="font-medium">{details.title || "-"}</p></div>
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">النوع</label><p className="font-medium">{details.propertyType || "-"}</p></div>
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">المالك</label><p className="font-medium">{details.ownerId || "-"}</p></div>
                <div className="space-y-2"><label className="text-sm font-medium text-muted-foreground">تاريخ التقديم</label><p className="font-medium">{formatDate(details.submittedOn)}</p></div>
              </div>

              {parsed && (
                <div className="space-y-6">
                  {/* Profile */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">الملف الشخصي</label>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">دولة المالك: </span><span className="font-medium">{parsed.profile.country || "-"}</span></div>
                      <div><span className="text-muted-foreground">العملة: </span><span className="font-medium">{parsed.profile.currency || "-"}</span></div>
                      {parsed.profile.reason && <div className="sm:col-span-3"><span className="text-muted-foreground">السبب: </span><span className="font-medium">{parsed.profile.reason}</span></div>}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">نوع الوثيقة: </span><span className="font-medium">{parsed.profile.document.type || "-"}</span></div>
                      <div><span className="text-muted-foreground">رقم الوثيقة: </span><span className="font-medium">{parsed.profile.document.number || "-"}</span></div>
                      <div><span className="text-muted-foreground">بلد الإصدار: </span><span className="font-medium">{parsed.profile.document.countryOfIssue || "-"}</span></div>
                    </div>
                  </div>

                  {/* Basics */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">الأساسيات</label>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">الاسم: </span><span className="font-medium">{parsed.basics.name}</span></div>
                      <div><span className="text-muted-foreground">النوع: </span><span className="font-medium">{parsed.basics.propertyType}</span></div>
                      {parsed.basics.website && <div><span className="text-muted-foreground">الموقع: </span><span className="font-medium">{parsed.basics.website}</span></div>}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">الموقع</label>
                    <p className="text-sm font-medium">
                      {parsed.location.street && `${parsed.location.street}, `}
                      {parsed.location.city}{parsed.location.city && parsed.location.state ? ", " : ""}
                      {parsed.location.state}{(parsed.location.city || parsed.location.state) && parsed.location.country ? ", " : ""}
                      {parsed.location.country}{parsed.location.zip && ` - ${parsed.location.zip}`}
                    </p>
                  </div>

                  {/* Description */}
                  {(parsed.description.summary || parsed.description.guestServices) && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {parsed.description.summary && (
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">الوصف</label>
                          <p className="text-sm bg-muted p-3 rounded">{parsed.description.summary}</p>
                        </div>
                      )}
                      {parsed.description.guestServices && (
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">خدمات الضيوف</label>
                          <p className="text-sm bg-muted p-3 rounded">{parsed.description.guestServices}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Capacity & Beds */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">السعة والأسِرّة</label>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">الضيوف: </span><span className="font-medium">{parsed.capacity.maxGuests}</span></div>
                      <div><span className="text-muted-foreground">الغرف: </span><span className="font-medium">{parsed.capacity.bedrooms}</span></div>
                      <div className="sm:col-span-3">
                        {parsed.capacity.beds.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {parsed.capacity.beds.map((b: any) => (
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
                      {parsed.facilities.length > 0 ? (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {parsed.facilities.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                        </div>
                      ) : <p className="text-sm text-muted-foreground">لا توجد مرافق</p>}
                    </div> */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">المزايا</label>
                      {["basic","bath","kitchen","outdoor"].map((k) => {
                        const arr = (parsed.amenities as any)[k] as string[];
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
                  <div className="spacey-2">
                    <label className="text-sm font-medium text-muted-foreground">المساحات المشتركة</label>
                    {parsed.sharedSpaces.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {parsed.sharedSpaces.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                      </div>
                    ) : <p className="text-sm text-muted-foreground">لا توجد مساحات مشتركة</p>}
                  </div>

                  {/* Seclusion & Activities & Terrain */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">العزلة</label>
                      {parsed.seclusion.length > 0 ? (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {parsed.seclusion.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                        </div>
                      ) : <p className="text-sm text-muted-foreground">غير محدد</p>}
                      <label className="text-sm font-medium text-muted-foreground mt-3 block">الأنشطة</label>
                      {parsed.activities.options.length > 0 ? (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {parsed.activities.options.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                        </div>
                      ) : <p className="text-sm text-muted-foreground">لا توجد أنشطة</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">التضاريس</label>
                      {parsed.terrain.length > 0 ? (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {parsed.terrain.map((x: string, i: number) => <span key={i} className="px-2 py-1 rounded bg-muted">{x}</span>)}
                        </div>
                      ) : <p className="text-sm text-muted-foreground">لا توجد عناصر تضاريس</p>}
                    </div>
                  </div>

                  {/* Rules & Times */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">القواعد والمواعيد</label>
                    <div className="grid sm:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-muted-foreground">الحد الأدنى للعمر: </span><span className="font-medium">{parsed.rules.minAge || "-"}</span></div>
                      <div><span className="text-muted-foreground">تسجيل الدخول من: </span><span className="font-medium">{parsed.rules.checkInFrom || "-"}</span></div>
                      <div><span className="text-muted-foreground">إلى: </span><span className="font-medium">{parsed.rules.checkInTo || "-"}</span></div>
                      <div><span className="text-muted-foreground">تسجيل الخروج: </span><span className="font-medium">{parsed.rules.checkOut || "-"}</span></div>
                    </div>
                    {parsed.rules.additionalRules && (
                      <p className="text-sm bg-muted p-3 rounded">{parsed.rules.additionalRules}</p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">التسعير</label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">أيام الأسبوع</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-muted rounded p-2">مع المبيت: <span className="font-medium">{parsed.pricing.weekday.withAccommodation}</span></div>
                          <div className="bg-muted rounded p-2">بدون مبيت: <span className="font-medium">{parsed.pricing.weekday.withoutAccommodation}</span></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">العطلات</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-muted rounded p-2">مع المبيت: <span className="font-medium">{parsed.pricing.holiday.withAccommodation}</span></div>
                          <div className="bg-muted rounded p-2">بدون مبيت: <span className="font-medium">{parsed.pricing.holiday.withoutAccommodation}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Images */}
              {Array.isArray(details.images) && details.images.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="h-4 و-4" /> الصور ({details.images.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {details.images.map((img: string, idx: number) => (
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
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Wizard Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-5xl p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>إضافة مخيم جديد</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{steps[stepIndex].title}</div>
                <div className="text-sm text-muted-foreground">خطوة {stepIndex + 1} من {steps.length}</div>
              </div>

              {steps[stepIndex].comp}

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (isFirst) { setIsAddOpen(false); return; }
                    setStepIndex((i) => Math.max(0, i - 1));
                  }}
                >
                  رجوع
                </Button>
                <div className="flex items-center gap-2">
                  {!isLast ? (
                    <Button
                      onClick={() => {
                        if (!validateStep()) return;
                        setStepIndex((i) => Math.min(steps.length - 1, i + 1));
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      التالي
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (!validateStep()) return;
                        submit();
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      إرسال الطلب
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المخيم</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف المخيم "{deletingCamp?.title}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooterC>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooterC>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
