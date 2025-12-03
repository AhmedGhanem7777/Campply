


import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const elevenCountries = [
  { code: "EG", label: "مصر" },
  { code: "SA", label: "السعودية" },
  { code: "AE", label: "الإمارات" },
  { code: "KW", label: "الكويت" },
  { code: "QA", label: "قطر" },
  { code: "BH", label: "البحرين" },
  { code: "OM", label: "عمان" },
  { code: "JO", label: "الأردن" },
  { code: "MA", label: "المغرب" },
  { code: "DZ", label: "الجزائر" },
  { code: "TN", label: "تونس" },
];


const documentTypes = [
  { code: "ID", label: "Identity card" },
  { code: "PASS", label: "Passport" },
  { code: "DL", label: "Driving license" },
];


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


const basicAmenities = ["WiFi", "تكييف", "تدفئة", "مولد كهرباء", "إضاءة"];
const bathAmenities = ["حمام خاص", "دش ساخن", "مناشف", "صابون", "شامبو"];
const kitchenAmenities = ["مطبخ مجهز", "ثلاجة", "موقد", "أواني طبخ", "مياه شرب"];
const outdoorAmenities = ["شواء", "جلسة خارجية", "كراسي", "طاولة", "مظلة"];
const facilities = ["موقف سيارات", "أمن", "نظافة", "استقبال 24 ساعة", "خدمة غرف"];
const sharedSpaces = ["صالة مشتركة", "مطبخ مشترك", "حديقة", "مسبح", "ملعب"];
const seclusionOptions = ["منعزل تماماً", "شبه منعزل", "بجانب مخيمات أخرى", "في منطقة سياحية"];
const activities = ["رحلات استكشافية", "سفاري", "صيد", "سباحة", "تسلق", "نجوم"];
const terrainOptions = ["صحراء", "جبال", "شاطئ", "واحة", "غابة", "سهول"];


function StepProfile({ data, setData }) {
  const update = (patch) => setData(d => ({ ...d, profile: { ...d.profile, ...patch } }));
  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">نوع الوثيقة (Document type)*</label>
          <Select value={data.profile.docType} onValueChange={(v) => update({ docType: v })}>
            <SelectTrigger><SelectValue placeholder="اختر نوع الوثيقة" /></SelectTrigger>
            <SelectContent>
              {documentTypes.map(dt => <SelectItem key={dt.code} value={dt.code}>{dt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">رقم الوثيقة (Document number)*</label>
          <Input value={data.profile.docNumber} onChange={e => update({ docNumber: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">بلد الإصدار (Country of issue)*</label>
          <Select value={data.profile.docCountry} onValueChange={(v) => update({ docCountry: v })}>
            <SelectTrigger><SelectValue placeholder="اختر بلد الإصدار" /></SelectTrigger>
            <SelectContent>
              {elevenCountries.map(c => <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium">الدولة (Country)</label>
          <Select value={data.profile.country} onValueChange={(v) => update({ country: v })}>
            <SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto" dir="rtl">
              {elevenCountries.map(c => <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">العملة</label>
          <Input value="USD – الدولار الأمريكي" readOnly />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm font-medium">لماذا ترغب في الإدراج؟ (اختياري)</label>
        <Textarea rows={3} value={data.profile.why} onChange={e => update({ why: e.target.value })} placeholder="اكتب بإيجاز سبب رغبتك في الإدراج..." />
      </div>
    </div>
  );
}


function StepBasics({ data, setData }) {
  const updateBasics = patch => setData(d => ({ ...d, basics: { ...d.basics, ...patch } }));
  const updateDesc = patch => setData(d => ({ ...d, description: { ...d.description, ...patch } }));
  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">اسم المخيم *</label>
          <Input value={data.basics.name} onChange={e => updateBasics({ name: e.target.value })} placeholder="مثال: مخيم الرمال الذهبية" />
        </div>
        <div>
          <label className="text-sm font-medium">نوع المخيم *</label>
          <Select value={data.basics.propertyType} onValueChange={v => updateBasics({ propertyType: v })}>
            <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
            <SelectContent>
              {propertyTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">الموقع الإلكتروني (اختياري)</label>
          <Input value={data.basics.website} onChange={e => updateBasics({ website: e.target.value })} placeholder="https://example.com" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">وصف المخيم *</label>
        <Textarea value={data.description.summary} onChange={e => updateDesc({ summary: e.target.value })} rows={4} placeholder="اكتب وصفاً جذاباً لمخيمك..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">خدمات إضافية للضيوف</label>
        <Textarea value={data.description.guestServices} onChange={e => updateDesc({ guestServices: e.target.value })} rows={3} placeholder="مثال: توصيل من المطار، جولات سياحية..." />
      </div>
    </div>
  );
}


function StepLocation({ data, setData }) {
  const update = patch => setData(d => ({ ...d, location: { ...d.location, ...patch } }));

  const handleZipChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      update({ zip: val });
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">الدولة (Country)*</label>
          <Select value={data.location.country} onValueChange={v => update({ country: v })}>
            <SelectTrigger className="w-full justify-between flex-row-reverse">
              <div className="flex-1 text-right truncate">
                <SelectValue placeholder="اختر الدولة" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto" dir="rtl">
              {elevenCountries.map(ct => (
                <SelectItem key={ct.code} value={ct.code}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">المحافظة *</label>
          <Input value={data.location.state} onChange={e => update({ state: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">المدينة *</label>
          <Input value={data.location.city} onChange={e => update({ city: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium">الرمز البريدي</label>
          <Input value={data.location.zip} onChange={handleZipChange} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">العنوان التفصيلي</label>
          <Input value={data.location.street} onChange={e => update({ street: e.target.value })} placeholder="الشارع، المعالم القريبة..." />
        </div>
      </div>
    </div>
  );
}


function StepCapacity({ data, setData }) {
  const update = patch => setData(d => ({ ...d, capacity: { ...d.capacity, ...patch } }));
  const totalBeds = Object.values(data.capacity.beds || {}).reduce((s, v) => s + Number(v || 0), 0);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">أقصى عدد ضيوف *</label>
          <Input type="number" min={1} value={data.capacity.maxGuests} onChange={e => update({ maxGuests: Math.max(1, Number(e.target.value) || 1) })} />
        </div>
        <div>
          <label className="text-sm font-medium">عدد غرف النوم</label>
          <Input type="number" min={0} value={data.capacity.bedrooms} onChange={e => update({ bedrooms: Math.max(0, Number(e.target.value) || 0) })} />
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium">أنواع الأسرّة المتوفرة</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bedTypes.map(b => (
            <div key={b.key} className="flex items-center justify-between border rounded-lg p-3">
              <span className="text-sm">{b.label}</span>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => update({ beds: { ...data.capacity.beds, [b.key]: Math.max(0, (data.capacity.beds[b.key] || 0) - 1) } })}>−</Button>
                <Input
                  type="number"
                  min={0}
                  value={data.capacity.beds[b.key] || 0}
                  onChange={e => update({ beds: { ...data.capacity.beds, [b.key]: Math.max(0, Number(e.target.value) || 0) } })}
                  className="w-20 text-center"
                />
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

function StepFeatures({ data, setData }) {
  const updateAmenities = (category, item) => {
    const current = data.features.amenities[category] || [];
    const exists = current.includes(item);
    const newItems = exists ? current.filter(i => i !== item) : [...current, item];
    setData(d => ({ ...d, features: { ...d.features, amenities: { ...d.features.amenities, [category]: newItems } } }));
  };
  const toggleFeature = (list, item, key) => {
    const current = data.features[key] || [];
    const exists = current.includes(item);
    const newItems = exists ? current.filter(i => i !== item) : [...current, item];
    setData(d => ({ ...d, features: { ...d.features, [key]: newItems } }));
  };
  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-3">
        <h3 className="text-md font-semibold">الخدمات الأساسية</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {basicAmenities.map(item => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`basic-${item}`} checked={(data.features.amenities.basic || []).includes(item)} onCheckedChange={() => updateAmenities('basic', item)} />
              <label htmlFor={`basic-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-md font-semibold">مرافق الحمام</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {bathAmenities.map(item => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`bath-${item}`} checked={(data.features.amenities.bath || []).includes(item)} onCheckedChange={() => updateAmenities('bath', item)} />
              <label htmlFor={`bath-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-md font-semibold">مرافق المطبخ</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {kitchenAmenities.map(item => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`kitchen-${item}`} checked={(data.features.amenities.kitchen || []).includes(item)} onCheckedChange={() => updateAmenities('kitchen', item)} />
              <label htmlFor={`kitchen-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-md font-semibold">مرافق خارجية</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {outdoorAmenities.map(item => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`outdoor-${item}`} checked={(data.features.amenities.outdoor || []).includes(item)} onCheckedChange={() => updateAmenities('outdoor', item)} />
              <label htmlFor={`outdoor-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-md font-semibold">خدمات عامة</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {facilities.map(item => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`facility-${item}`} checked={(data.features.facilities || []).includes(item)} onCheckedChange={() => toggleFeature(facilities, item, 'facilities')} />
              <label htmlFor={`facility-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepEnvironment({ data, setData }) {
  const toggleFeature = (list, item, key) => {
    const current = data.environment[key] || [];
    const exists = current.includes(item);
    const newItems = exists ? current.filter(i => i !== item) : [...current, item];
    setData(d => ({ ...d, environment: { ...d.environment, [key]: newItems } }));
  };
  const updateSeclusion = value => setData(d => ({ ...d, environment: { ...d.environment, seclusion: value } }));
  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-3">
        <h3 className="text-md font-semibold">نوع التضاريس المحيطه بالمخيم</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {terrainOptions.map(item => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`terrain-${item}`} checked={(data.environment.terrain || []).includes(item)} onCheckedChange={() => toggleFeature(terrainOptions, item, 'terrain')} />
              <label htmlFor={`terrain-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-md font-semibold">مستوى العزلة</label>
        <Select value={data.environment.seclusion || ""} onValueChange={updateSeclusion}>
          <SelectTrigger dir="rtl"><SelectValue dir="rtl" placeholder="اختر مستوى العزلة" /></SelectTrigger>
          <SelectContent dir="rtl">
            {seclusionOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <h3 className="text-md font-semibold">أنشطة متوفرة</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {activities.map(item => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`activity-${item}`} checked={(data.environment.activities || []).includes(item)} onCheckedChange={() => toggleFeature(activities, item, 'activities')} />
              <label htmlFor={`activity-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-md font-semibold">مساحات مشتركة</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sharedSpaces.map(item => (
            <div key={item} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id={`shared-${item}`} checked={(data.environment.sharedSpaces || []).includes(item)} onCheckedChange={() => toggleFeature(sharedSpaces, item, 'sharedSpaces')} />
              <label htmlFor={`shared-${item}`} className="text-sm cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepRulesPricing({ data, setData }) {
  const updateRules = patch => setData(d => ({ ...d, rules: { ...d.rules, ...patch } }));
  const updatePricing = patch => setData(d => ({ ...d, pricing: { ...d.pricing, ...patch } }));

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-4">
        <h3 className="text-md font-semibold">أوقات الدخول والخروج</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium"> تسجيل الدخول</label>
            <Input type="time" value={data.rules.checkInFrom} onChange={e => updateRules({ checkInFrom: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">تسجيل الخروج</label>
            <Input type="time" value={data.rules.checkOut} onChange={e => updateRules({ checkOut: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">الحد الأدنى للعمر (سنة)</label>
            <Input type="number" min={0} value={data.rules.minAge} onChange={e => updateRules({ minAge: Math.max(0, Number(e.target.value) || 0) })} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-md font-semibold">التسعير (دولار أمريكي) *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 border rounded-lg">
            <h4 className="font-medium text-center">الأيام العادية</h4>
            <div>
              <label className="text-sm">مع المبيت</label>
              <Input type="number" min={0} step="0.5" value={data.pricing.weekday_with_accommodation} onChange={e => updatePricing({ weekday_with_accommodation: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
            <div>
              <label className="text-sm">بدون المبيت</label>
              <Input type="number" min={0} step="0.5" value={data.pricing.weekday_without_accommodation} onChange={e => updatePricing({ weekday_without_accommodation: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
          </div>
          <div className="space-y-3 p-4 border rounded-lg">
            <h4 className="font-medium text-center">أيام العطل والمناسبات</h4>
            <div>
              <label className="text-sm">مع المبيت</label>
              <Input type="number" min={0} step="0.5" value={data.pricing.holiday_with_accommodation} onChange={e => updatePricing({ holiday_with_accommodation: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
            <div>
              <label className="text-sm">بدون المبيت</label>
              <Input type="number" min={0} step="0.5" value={data.pricing.holiday_without_accommodation} onChange={e => updatePricing({ holiday_without_accommodation: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">أدخل القيم المناسبة، ويمكنك ترك غير المتاح بقيمة 0.</div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">قواعد وشروط إضافية (اختياري)</label>
        <Textarea rows={3} value={data.rules.additionalRules || ""} onChange={e => setData(d => ({ ...d, rules: { ...d.rules, additionalRules: e.target.value } }))} placeholder="مثال: هدوء بعد 10 م، ممنوع التدخين..." />
      </div>
    </div>
  );
}

function StepImages({ data, setData }) {
  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <label className="text-sm font-medium">صور المخيم *</label>
        <Input type="file" multiple accept="image/*" onChange={e => setData(d => ({ ...d, files: Array.from(e.target.files || []) }))} />
        <div className="text-xs text-muted-foreground mt-2">ارفع عدة صور عالية الجودة. الصورة الأولى ستكون الرئيسية.</div>
      </div>
      {data.files.length > 0 && (<div className="text-sm text-green-600">تم اختيار {data.files.length} صورة</div>)}
    </div>
  );
}

// محتوى سياسة الخصوصية
const PrivacyPolicyContent = () => (
  <div className="space-y-4 text-sm leading-7" dir="rtl" style={{ textAlign: "right" }}>
    <h2>1. المقدمة</h2>
    <p>مرحبًا بكم في منصة كامبلي (Camply)، المنصة الإلكترونية المتخصصة لحجز المخيمات والتجارب السياحية في دول الخليج وبعض الدول العربية.</p>
    <p>نلتزم في كامبلي بحماية خصوصية المستخدمين وضمان سرية بياناتهم وفقًا للقوانين المعمول بها في سلطنة عُمان والدول الأخرى التي نقدم خدماتنا فيها.</p>
    <h2>2. المعلومات التي نجمعها</h2>
    <p>نجمع فقط المعلومات اللازمة لتقديم خدماتنا وتحسين تجربة المستخدم، وتشمل:</p>
    <ul>
      <li>البيانات الشخصية (الاسم، رقم الهاتف، البريد الإلكتروني، الدولة، العملة).</li>
      <li>بيانات الحجز والدفع (عند استخدام خدمات الدفع الإلكتروني).</li>
      <li>بيانات الاستخدام (مثل الصفحات التي تزورها ونوع الجهاز وموقعك الجغرافي التقريبي).</li>
    </ul>
    <h2>3. كيفية استخدام المعلومات</h2>
    <ul>
      <li>إدارة حسابك وتنفيذ الحجوزات.</li>
      <li>تحسين أداء المنصة وتجربتك كمستخدم.</li>
      <li>التواصل معك بشأن الحجوزات أو العروض الترويجية أو الدعم الفني.</li>
      <li>الالتزام بالمتطلبات القانونية والتنظيمية المعمول بها محليا أو إقليميا.</li>
    </ul>
    <h2>4. حماية المعلومات</h2>
    <p>تُخزن بياناتك في خوادم آمنة وتُحمى بتقنيات حديثة لمنع الوصول غير المصرح به. ولا نشارك بياناتك إلا في الحالات الضرورية كتنفيذ الحجز أو مزودي الدفع المرخصين أو طلب قانوني.</p>
    <h2>5. ملفات تعريف الارتباط (Cookies)</h2>
    <p>نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل الأداء. يمكنك تعطيلها من إعدادات المتصفح، لكن بعض أجزاء الموقع قد لا تعمل بشكل كامل.</p>
    <h2>6. حقوق المستخدم</h2>
    <ul>
      <li>الوصول إلى بياناته أو تعديلها أو طلب حذفها أو حذف حسابه بالكامل.</li>
      <li>إلغاء الاشتراك في الرسائل التسويقية في أي وقت.</li>
    </ul>
    <h2>7. التعديلات</h2>
    <p>تحتفظ إدارة كامبلي بحق تعديل هذه السياسة عند الحاجة، وسيتم إخطار المستخدمين بأي تحديثات عبر الموقع أو البريد الإلكتروني.</p>
  </div>
);

// محتوى الشروط والأحكام
const TermsConditionsContent = () => (
  <div className="space-y-4 text-sm leading-7" dir="rtl" style={{ textAlign: "right" }}>
    <h2>1. التعريفات</h2>
    <p>المنصة: موقع وتطبيق كامبلي (Camply).</p>
    <p>المستخدم: كل من يستعمل المنصة للتصفح أو الحجز.</p>
    <p>المضيف: مالك/مدير المخيم الذي يعرض خدماته.</p>
    <p>مسؤول المنصة: المسؤول عن إدارة المحتوى والإشراف.</p>
    <h2>2. نطاق الخدمة</h2>
    <p>كامبلي وسيط تقني فقط ولا تتحمل مسؤولية جودة الخدمات المقدمة.</p>
    <h2>3. الحجز والدفع</h2>
    <p>إتمام الحجز والدفع عن طريق المنصة أو مالك المخيم بشكل مباشر.</p>
    <p>تأكيد الحجز بعد الدفع أو استلام تأكيد من صاحب المخيم.</p>
    <p>ضمان حقوق الطرفين وفق السياسات والشروط.</p>
    <h2>4. سياسة الحجز والإلغاء</h2>
    <ul>
      <li><strong>مرنة (Flexible):</strong> استرداد كامل قبل 24 ساعة، 50% خلال 24 ساعة، لا استرداد بعد الوصول.</li>
      <li><strong>متوسطة (Moderate):</strong> استرداد كامل قبل 5 أيام، 50% خلال 5 أيام، لا استرداد بعد الوصول.</li>
      <li><strong>خمسة عشر يومًا (Fifteen):</strong> استرداد كامل خلال 48 ساعة وقبل 15 يومًا، 50% بعد 48 ساعة وقبل 15 يومًا، لا استرداد أقل من 15 يومًا.</li>
      <li><strong>ثلاثين يومًا (Thirty):</strong> استرداد كامل خلال 48 ساعة وقبل 30 يومًا، 50% بعد 48 ساعة وقبل 30 يومًا، لا استرداد أقل من 30 يومًا.</li>
    </ul>
    <p>لا تعديل أو استرداد بعد تسجيل الوصول. الحالات الطارئة تخضع لتقدير المنصة.</p>
    <h2>5. مسؤوليات المستخدمين والمضيفين</h2>
    <p>إدخال بيانات صحيحة ومنع المحتوى المخالف.</p>
    <h2>6. حقوق الملكية الفكرية</h2>
    <p>جميع الحقوق محفوظة ويمنع النسخ دون إذن خطي مسبق.</p>
    <h2>7. التعديلات</h2>
    <p>المنصة تحتفظ بحق تعديل الشروط وتنشر التحديثات على الموقع.</p>
    <h2>8. القانون المُنظّم</h2>
    <p>تخضع الشروط لقوانين سلطنة عُمان والجهات القضائية المختصة.</p>
  </div>
);


function StepReview({ data, setData, onOpenPrivacy, onOpenTerms }) {
  const totalBeds = Object.values(data.capacity.beds || {}).reduce((s, v) => s + Number(v || 0), 0);

  return (
    <div className="space-y-6 text-sm" dir="rtl" style={{ textAlign: "right" }}>
      <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /> مراجعة البيانات قبل الإرسال</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="font-semibold">إنشاء مخيم جديد</h4>
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
{/* 
      <div className="mt-6 flex items-center space-x-2 space-x-reverse text-sm">
        <Checkbox
          id="agree"
          checked={data.profile.agreeTerms}
          onChange={e => setData(d => ({ ...d, profile: { ...d.profile, agreeTerms: e.target.checked } }))}
        />
        <label htmlFor="agree" className="cursor-pointer select-none whitespace-nowrap">
          أوافق على{" "}
          <button type="button" onClick={onOpenPrivacy} className="underline hover:text-foreground transition-colors px-1">
            سياسة الخصوصية
          </button>{" "}
          و{" "}
          <button type="button" onClick={onOpenTerms} className="underline hover:text-foreground transition-colors px-1">
            الشروط والأحكام
          </button>
        </label>
      </div> */}

      <div className="mt-6 flex items-center space-x-2 space-x-reverse text-sm">
  <Checkbox
    id="agree"
    checked={data.profile.agreeTerms}
    onCheckedChange={checked => setData(d => ({ ...d, profile: { ...d.profile, agreeTerms: checked } }))}
  />
  <label htmlFor="agree" className="cursor-pointer select-none whitespace-nowrap">
    أوافق على{" "}
    <button
      type="button"
      onClick={onOpenPrivacy}
      className="underline hover:text-foreground transition-colors px-1"
    >
      سياسة الخصوصية
    </button>{" "}
    و{" "}
    <button
      type="button"
      onClick={onOpenTerms}
      className="underline hover:text-foreground transition-colors px-1"
    >
      الشروط والأحكام
    </button>
  </label>
</div>

    </div>
  );
}


export default function JoinUs() {
  const { toast } = useToast();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const [form, setForm] = useState({
    profile: {
      country: "",
      docType: "",
      docNumber: "",
      docCountry: "",
      why: "",
      agreeTerms: false,
    },
    basics: { name: "", propertyType: "", website: "" },
    description: { summary: "", guestServices: "" },
    location: { country: "", state: "", city: "", zip: "", street: "" },
    capacity: { maxGuests: 1, bedrooms: 0, beds: bedTypes.reduce((acc, b) => ({ ...acc, [b.key]: 0 }), {}) },
    features: { amenities: { basic: [], bath: [], kitchen: [], outdoor: [] }, facilities: [] },
    environment: { terrain: [], seclusion: "", activities: [], sharedSpaces: [] },
    rules: { checkInFrom: "14:00", checkInTo: "22:00", checkOut: "12:00", additionalRules: "", minAge: 18 },
    pricing: {
      weekday_with_accommodation: 0,
      weekday_without_accommodation: 0,
      holiday_with_accommodation: 0,
      holiday_without_accommodation: 0,
    },
    files: [],
  });


  const steps = useMemo(() => ([
    { key: "profile", title: "إنشاء مخيم جديد", comp: <StepProfile data={form} setData={setForm} /> },
    { key: "basics", title: "الأساسيات", comp: <StepBasics data={form} setData={setForm} /> },
    { key: "location", title: "الموقع", comp: <StepLocation data={form} setData={setForm} /> },
    { key: "capacity", title: "السعة", comp: <StepCapacity data={form} setData={setForm} /> },
    { key: "features", title: "المرافق والخدمات", comp: <StepFeatures data={form} setData={setForm} /> },
    { key: "environment", title: "البيئة والأنشطة", comp: <StepEnvironment data={form} setData={setForm} /> },
    { key: "rulesPricing", title: "القواعد والتسعير", comp: <StepRulesPricing data={form} setData={setForm} /> },
    { key: "images", title: "الصور", comp: <StepImages data={form} setData={setForm} /> },
    {
      key: "review", title: "مراجعة",
      comp: <StepReview data={form} setData={setForm} onOpenPrivacy={() => setPrivacyOpen(true)} onOpenTerms={() => setTermsOpen(true)} />
    },
  ]), [form]);


  const [stepIndex, setStepIndex] = useState(0);
const isFirst = stepIndex === 0;
const isLast = stepIndex === steps.length - 1;

const validateStep = () => {
  const s = steps[stepIndex].key;
  if (s === "profile") {
    const p = form.profile;
    if (!p.docType) { toast({ title: "نوع الوثيقة مطلوب", variant: "destructive" }); return false; }
    if (!p.docNumber?.trim()) { toast({ title: "رقم الوثيقة مطلوب", variant: "destructive" }); return false; }
    if (!p.docCountry) { toast({ title: "بلد الإصدار مطلوب", variant: "destructive" }); return false; }
  }
  if (s === "basics") {
    if (!form.basics.name.trim()) { toast({ title: "اسم المخيم مطلوب", variant: "destructive" }); return false; }
    if (!form.basics.propertyType) { toast({ title: "نوع الملكية مطلوب", variant: "destructive" }); return false; }
    if (!form.description.summary.trim()) { toast({ title: "وصف المخيم مطلوب", variant: "destructive" }); return false; }
  }
  if (s === "location") {
    if (!form.location.country.trim()) { toast({ title: "الدولة مطلوبة", variant: "destructive" }); return false; }
    if (!form.location.state.trim()) { toast({ title: "المحافظة/الولاية مطلوبة", variant: "destructive" }); return false; }
    if (!form.location.city.trim()) { toast({ title: "المدينة مطلوبة", variant: "destructive" }); return false; }
    if (!form.location.street.trim()) { toast({ title: "العنوان التفصيلي مطلوب", variant: "destructive" }); return false; }
  }
  if (s === "capacity") {
    const totalBeds = Object.values(form.capacity.beds || {}).reduce((s, v) => s + Number(v || 0), 0);
    if (form.capacity.maxGuests < 1) { toast({ title: "أقصى عدد ضيوف لا يقل عن 1", variant: "destructive" }); return false; }
    if (totalBeds < 1) { toast({ title: "أضف سريراً واحداً على الأقل", variant: "destructive" }); return false; }
  }
  if (s === "rulesPricing") {
    if ((form.rules.minAge ?? 0) < 0) { toast({ title: "الحد الأدنى للعمر غير صالح", variant: "destructive" }); return false; }
    const p = form.pricing;
    const prices = [p.weekday_with_accommodation, p.weekday_without_accommodation, p.holiday_with_accommodation, p.holiday_without_accommodation];
    const hasInvalid = prices.some(x => !(Number.isFinite(x) && x >= 0));
    if (hasInvalid) { toast({ title: "تحقق من الأسعار", description: "يجب إدخال قيم صحيحة للأسعار.", variant: "destructive" }); return false; }
    if (prices.every(x => x === 0)) { toast({ title: "يجب إدخال سعر واحد على الأقل", variant: "destructive" }); return false; }
  }
  if (s === "images") {
    if ((form.files?.length || 0) < 5) { toast({ title: "الصور مطلوبة", description: "يرجى رفع 5 صور على الأقل.", variant: "destructive" }); return false; }
  }
  if (s === "review") {
    if (!form.profile.agreeTerms) { toast({ title: "يجب الموافقة على الشروط", variant: "destructive" }); return false; }
  }
  return true;
};

const next = () => {
  if (validateStep()) setStepIndex(i => Math.min(i + 1, steps.length - 1));
};
const prev = () => setStepIndex(i => Math.max(i - 1, 0));

const submit = async () => {
  try {
    const payload = {
      profile: {
        country: form.profile.country || null,
        document: {
          type: form.profile.docType,
          number: form.profile.docNumber?.trim(),
          countryOfIssue: form.profile.docCountry
        },
        reason: form.profile.why || null,
        currency: "USD",
      },
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

    toast({ title: "تم إرسال الطلب بنجاح!", description: "سيتم التواصل معك خلال 3-5 أيام عمل." });

    setStepIndex(0);
    setForm(f => ({
      ...f,
      profile: { ...f.profile, agreeTerms: false },
      files: []
    }));
  } catch (err) {
    const message = err?.response?.data?.message || "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.";
    toast({ title: "خطأ", description: message, variant: "destructive" });
  }
};

return (
  <div dir="rtl">
    <section className="border-b bg-muted/40">
      <div className="container py-8 flex justify-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center">سجّل مُخيمك الآن</h1>
      </div>
    </section>
    <section className="py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4" style={{ textAlign: "center" }}>
            <span className="text-sm font-medium">الخطوة {stepIndex + 1} من {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-sm" style={{ textAlign: "center" }}>
          {steps.map((s, idx) => (
            <div key={s.key} className={`px-3 py-1 rounded-full border text-center ${
              idx === stepIndex ? "bg-primary text-primary-foreground" :
              idx < stepIndex ? "bg-green-100 text-green-700 border-green-300" : "bg-background"
            }`}>
              {s.title}
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ textAlign: "right" }}>{steps[stepIndex].title}</h2>
          {steps[stepIndex].comp}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => setStepIndex(i => Math.max(i - 1, 0))} disabled={isFirst} className="inline-flex items-center gap-2">
            <ChevronRight className="h-4 w-4 rotate-180" /> السابق
          </Button>
          {!isLast ? (
            <Button onClick={() => { if(validateStep()) setStepIndex(i => Math.min(i + 1, steps.length - 1)); }} className="inline-flex items-center gap-2">
              التالي <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={submit} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700" disabled={!form.profile.agreeTerms}>
              إرسال الطلب <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
    <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader dir="rtl" className="flex justify-between items-center">
          <DialogTitle className="text-right flex-1">سياسة الخصوصية – منصة كامبلي (Camply)</DialogTitle>
        </DialogHeader>
        <PrivacyPolicyContent />
      </DialogContent>
    </Dialog>
    <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader dir="rtl" className="flex justify-between items-center">
          <DialogTitle className="text-right flex-1">الشروط والأحكام – منصة كامبلي (Camply)</DialogTitle>
        </DialogHeader>
        <TermsConditionsContent />
      </DialogContent>
    </Dialog>
  </div>
);
}



























