// src/pages/Dashboard/AddCamp.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { useToast as useUiToast } from "../components/ui/use-toast";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";


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
  { code: "EG", label: "مصر (Egypt)" },
  { code: "JO", label: "الأردن (Jordan)" },
  { code: "KW", label: "الكويت (Kuwait)" },
  { code: "MA", label: "المغرب (Morocco)" },
  { code: "OM", label: "عمان (Oman)" },
  { code: "QA", label: "قطر (Qatar)" },
  { code: "SA", label: "السعودية (KSA)" },
  { code: "TN", label: "تونس (Tunisia)" },
  { code: "AE", label: "الإمارات (UAE)" },
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
const facilities = ["موقف سيارات","أمن","نظافة","استقبال 24 ساعة","خدمة غرف"];
const sharedSpaces = ["صالة مشتركة","مطبخ مشترك","حديقة","مسبح","ملعب"];
const seclusionOptions = ["منعزل تماماً","شبه منعزل","بجانب مخيمات أخرى","في منطقة سياحية"];
const activities = ["رحلات استكشافية","سفاري","صيد","سباحة","تسلق","نجوم"];
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

function StepProfile({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  const update = (patch: Partial<WizardForm["profile"]>) =>
    setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }));

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">🏕️ أضف مخيم جديد(Create your profile)</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">نوع الوثيقة (Document type)</label>
          <Select value={data.profile.docType} onValueChange={(v) => update({ docType: v })}>
            <SelectTrigger><SelectValue placeholder="اختر نوع الوثيقة" /></SelectTrigger>
            <SelectContent>
              {documentTypes.map((dt) => (
                <SelectItem key={dt.code} value={dt.code}>{dt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">رقم الوثيقة (Document number)</label>
          <Input value={data.profile.docNumber} onChange={(e) => update({ docNumber: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">بلد الإصدار (Country of issue)</label>
          <Select value={data.profile.docCountry} onValueChange={(v) => update({ docCountry: v })}>
            <SelectTrigger><SelectValue placeholder="اختر بلد الإصدار" /></SelectTrigger>
            <SelectContent>
              {ARAB_COUNTRIES.map((ct) => (
                <SelectItem key={ct.code} value={ct.code}>{ct.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">الدولة (Country)</label>
          <Select value={data.profile.country} onValueChange={(v) => update({ country: v })}>
            <SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
            <SelectContent>
              {ARAB_COUNTRIES.map((ct) => (
                <SelectItem key={ct.code} value={ct.code}>{ct.label}</SelectItem>
              ))}
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

      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox id="agree" checked={data.profile.agreeTerms} onCheckedChange={(v) => update({ agreeTerms: !!v })} />
          <label htmlFor="agree" className="text-sm cursor-pointer">✅ أوافق على الشروط والأحكام وسياسة حماية البيانات</label>
        </div>
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
        <label className="text-sm font-medium">خدمات إضافية للضيوف</label>
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
          <Input
            type="number"
            min={1}
            value={data.capacity.maxGuests}
            onChange={(e) => update({ maxGuests: Math.max(1, Number(e.target.value) || 1) })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">عدد غرف النوم</label>
          <Input
            type="number"
            min={0}
            value={data.capacity.bedrooms}
            onChange={(e) => update({ bedrooms: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">أنواع الأسرّة المتوفرة</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bedTypes.map((b) => (
            <div key={b.key} className="flex items-center justify-between border rounded-lg p-3">
              <span className="text-sm">{b.label}</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    update({ beds: { ...data.capacity.beds, [b.key]: Math.max(0, (data.capacity.beds[b.key] || 0) - 1) } })
                  }
                >
                  −
                </Button>
                <Input
                  type="number"
                  min={0}
                  value={data.capacity.beds[b.key] || 0}
                  onChange={(e) =>
                    update({ beds: { ...data.capacity.beds, [b.key]: Math.max(0, Number(e.target.value) || 0) } })
                  }
                  className="w-20 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    update({ beds: { ...data.capacity.beds, [b.key]: Math.min(20, (data.capacity.beds[b.key] || 0) + 1) } })
                  }
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">إجمالي الأسرّة: {totalBeds}</p>
      </div>
    </div>
  );
}

function StepFeatures({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
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

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-md font-semibold">الخدمات الأساسية</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {basicAmenities.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`basic-${item}`}
                checked={(data.features.amenities.basic || []).includes(item)}
                onCheckedChange={() => updateAmenities("basic", item)}
              />
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
              <Checkbox
                id={`bath-${item}`}
                checked={(data.features.amenities.bath || []).includes(item)}
                onCheckedChange={() => updateAmenities("bath", item)}
              />
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
              <Checkbox
                id={`kitchen-${item}`}
                checked={(data.features.amenities.kitchen || []).includes(item)}
                onCheckedChange={() => updateAmenities("kitchen", item)}
              />
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
              <Checkbox
                id={`outdoor-${item}`}
                checked={(data.features.amenities.outdoor || []).includes(item)}
                onCheckedChange={() => updateAmenities("outdoor", item)}
              />
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
              <Checkbox
                id={`facility-${item}`}
                checked={(data.features.facilities || []).includes(item)}
                onCheckedChange={() => toggleFacilities(item)}
              />
              <label htmlFor={`facility-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
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
              <Checkbox
                id={`terrain-${item}`}
                checked={(data.environment.terrain || []).includes(item)}
                onCheckedChange={() => toggleEnv("terrain")(item)}
              />
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
            {seclusionOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-semibold">أنشطة متوفرة</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {activities.map((item) => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`activity-${item}`}
                checked={(data.environment.activities || []).includes(item)}
                onCheckedChange={() => toggleEnv("activities")(item)}
              />
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
              <Checkbox
                id={`shared-${item}`}
                checked={(data.environment.sharedSpaces || []).includes(item)}
                onCheckedChange={() => toggleEnv("sharedSpaces")(item)}
              />
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
        <h3 className="text-md font-semibold">التسعير (بالريال العماني) *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 border rounded-lg">
            <h4 className="font-medium text-center">الأيام العادية</h4>
            <div>
              <label className="text-sm">مع المبيت</label>
              <Input
                type="number" min={0} step="0.5"
                value={data.pricing.weekday_with_accommodation}
                onChange={(e) => updatePricing({ weekday_with_accommodation: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
            <div>
              <label className="text-sm">بدون المبيت</label>
              <Input
                type="number" min={0} step="0.5"
                value={data.pricing.weekday_without_accommodation}
                onChange={(e) => updatePricing({ weekday_without_accommodation: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <h4 className="font-medium text-center">أيام العطل والمناسبات</h4>
            <div>
              <label className="text-sm">مع المبيت</label>
              <Input
                type="number" min={0} step="0.5"
                value={data.pricing.holiday_with_accommodation}
                onChange={(e) => updatePricing({ holiday_with_accommodation: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
            <div>
              <label className="text-sm">بدون المبيت</label>
              <Input
                type="number" min={0} step="0.5"
                value={data.pricing.holiday_without_accommodation}
                onChange={(e) => updatePricing({ holiday_without_accommodation: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">أدخل القيم المناسبة، ويمكنك ترك غير المتاح بقيمة 0.</div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">قواعد وشروط إضافية (اختياري)</label>
        <Textarea
          rows={3}
          value={data.rules.additionalRules || ""}
          onChange={(e) => updateRules({ additionalRules: e.target.value })}
          placeholder="مثال: هدوء بعد 10 م، ممنوع التدخين..."
        />
      </div>
    </div>
  );
}

function StepImages({ data, setData }: { data: WizardForm; setData: React.Dispatch<React.SetStateAction<WizardForm>> }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">صور المخيم *</label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setData((d) => ({ ...d, files: Array.from(e.target.files || []) }))}
        />
        <div className="text-xs text-muted-foreground mt-2">ارفع عدة صور عالية الجودة. الصورة الأولى ستكون الرئيسية.</div>
      </div>
      {data.files.length > 0 && (
        <div className="text-sm text-green-600">تم اختيار {data.files.length} صورة</div>
      )}
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
          <div><strong>تضاريس:</strong> {(data.environment.terrain || []).length} نوع</div>
          <div><strong>أنشطة:</strong> {(data.environment.activities || []).length} نشاط</div>
          <div><strong>عزلة:</strong> {data.environment.seclusion || "-"}</div>
          <div><strong>صور:</strong> {data.files.length}</div>
        </div>
      </div>
    </div>
  );
}

export default function AddCamp(): JSX.Element {
  const { toast } = useUiToast();
  const navigate = useNavigate();

  const initialForm: WizardForm = useMemo(() => ({
    profile: { country: "", docType: "", docNumber: "", docCountry: "", why: "", agreeTerms: true },
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
    { key: "features", title: "المرافق والخدمات", comp: <StepFeatures data={addForm} setData={setAddForm} /> },
    { key: "environment", title: "البيئة والأنشطة", comp: <StepEnvironment data={addForm} setData={setAddForm} /> },
    { key: "rulesPricing", title: "القواعد والتسعير", comp: <StepRulesPricing data={addForm} setData={setAddForm} /> },
    { key: "images", title: "الصور", comp: <StepImages data={addForm} setData={setAddForm} /> },
    { key: "review", title: "مراجعة", comp: <StepReview data={addForm} /> },
  ]), [addForm]);

  const [stepIndex, setStepIndex] = useState(0);
  const isFirst = stepIndex === 0;
  const isLast  = stepIndex === steps.length - 1;

  const validateStep = () => {
    const s = steps[stepIndex].key as string;

    if (s === "profile") {
      const p = addForm.profile;
      if (!p.docType) { toast({ title: "نوع الوثيقة مطلوب", variant: "destructive" }); return false; }
      if (!p.docNumber?.trim()) { toast({ title: "رقم الوثيقة مطلوب", variant: "destructive" }); return false; }
      if (!p.docCountry) { toast({ title: "بلد الإصدار مطلوب", variant: "destructive" }); return false; }
      if (!p.country) { toast({ title: "الدولة مطلوبة", variant: "destructive" }); return false; }
      if (!p.agreeTerms) { toast({ title: "يجب الموافقة على الشروط", variant: "destructive" }); return false; }
    }

    if (s === "basics") {
      if (!addForm.basics.name.trim()) { toast({ title: "اسم المخيم مطلوب", variant: "destructive" }); return false; }
      if (!addForm.basics.propertyType) { toast({ title: "نوع الملكية مطلوب", variant: "destructive" }); return false; }
      if (!addForm.description.summary.trim()) { toast({ title: "وصف المخيم مطلوب", variant: "destructive" }); return false; }
    }

    if (s === "location") {
      if (!addForm.location.country.trim()) { toast({ title: "الدولة مطلوبة", variant: "destructive" }); return false; }
      if (!addForm.location.state.trim()) { toast({ title: "المحافظة/الولاية مطلوبة", variant: "destructive" }); return false; }
      if (!addForm.location.city.trim()) { toast({ title: "المدينة مطلوبة", variant: "destructive" }); return false; }
      if (!addForm.location.street.trim()) { toast({ title: "العنوان التفصيلي مطلوب", variant: "destructive" }); return false; }
    }

    if (s === "capacity") {
      const totalBeds = Object.values(addForm.capacity.beds || {}).reduce((sum, v) => sum + Number(v || 0), 0);
      if (addForm.capacity.maxGuests < 1) { toast({ title: "أقصى عدد ضيوف لا يقل عن 1", variant: "destructive" }); return false; }
      if (totalBeds < 1) { toast({ title: "أضف سريراً واحداً على الأقل", variant: "destructive" }); return false; }
    }

    if (s === "rulesPricing") {
      const p = addForm.pricing;
      const prices = [p.weekday_with_accommodation, p.weekday_without_accommodation, p.holiday_with_accommodation, p.holiday_without_accommodation];
      const hasInvalid = prices.some((x) => !(Number.isFinite(x) && x >= 0));
      if (hasInvalid) { toast({ title: "تحقق من الأسعار", description: "يجب إدخال قيم صحيحة للأسعار.", variant: "destructive" }); return false; }
      if (prices.every(x => x === 0)) { toast({ title: "يجب إدخال سعر واحد على الأقل", variant: "destructive" }); return false; }
    }

    if (s === "images") {
      if ((addForm.files?.length || 0) < 5) { toast({ title: "الصور مطلوبة", description: "يرجى رفع 5 صور على الأقل.", variant: "destructive" }); return false; }
    }

    return true;
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
        facilities: addForm.features.facilities,
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

      await api.post("/api/camp-requests", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "تم إرسال الطلب بنجاح!", description: "سيتم التواصل معك خلال 3-5 أيام عمل." });
      navigate("/dashboard/camps");
    } catch (err: any) {
      const message = err?.response?.data?.message || "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.";
      toast({ title: "خطأ", description: message, variant: "destructive" });
    }
  };

  return (
    <div dir="rtl" className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إضافة مخيم جديد</h1>
          <p className="text-muted-foreground mt-1">أكمل الخطوات التالية لإرسال طلب الانضمام</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>رجوع</Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2 px-1">
        <div className="flex items-center justify-center mb-3">
          <span className="text-sm font-medium">الخطوة {stepIndex + 1} من {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        {steps.map((s, idx) => (
          <div
            key={s.key}
            className={`px-3 py-1 rounded-full border text-center ${
              idx === stepIndex
                ? "bg-primary text-primary-foreground"
                : idx < stepIndex
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-background"
            }`}
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">{steps[stepIndex].title}</h2>
        {steps[stepIndex].comp}
      </div>

           {/* Nav buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStepIndex((i) => Math.max(i - 1, 0))}
          disabled={isFirst}
          className="inline-flex items-center gap-2"
        >
          <ChevronRight className="h-4 w-4 rotate-180" /> السابق
        </Button>

        {!isLast ? (
          <Button
            onClick={() => {
              // تحقق من صحة بيانات الخطوة الحالية قبل المتابعة
              if (validateStep()) setStepIndex((i) => Math.min(i + 1, steps.length - 1));
            }}
            className="inline-flex items-center gap-2"
          >
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









































