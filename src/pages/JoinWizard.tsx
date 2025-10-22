// src/components/join/JoinWizard.tsx
import React, { useMemo, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";
import { api } from "../lib/api";

type JoinWizardProps = {
  apiBase?: string;           
  authToken?: string;           
  ownerId?: string | null;     
  onSuccess?: () => void;       
  onCancel?: () => void;       
  mode?: "full" | "owner";    
};

export default function JoinWizard({ apiBase = "", authToken, ownerId, onSuccess, onCancel, mode = "full" }: JoinWizardProps) {
  const { toast } = useToast();

  // انسخ نفس state والsteps والتحقق (validateStep) من JoinUs الحالية كما هي
  // بما في ذلك: profile/basics/location/capacity/features/environment/rules/pricing/images/review
  // واحرص أن بنية payload النهائية مطابقة تماماً لما يرسله JoinUs الآن

  const [form, setForm] = useState({
    profile: {
      // لو mode==="owner" يمكنك إخفاء/تجاهل كلمات السر والحقول غير المطلوبة
      nickname: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currency: "",
      country: "",
      password: "",
      repeatPassword: "",
      docType: "",
      docNumber: "",
      docCountry: "",
      why: "",
      agreeTerms: true
    },
    basics: { name: "", propertyType: null as string | null, website: "" },
    description: { summary: "", guestServices: "" },
    location: { country: "", state: "", city: "", zip: "", street: "" },
    capacity: { maxGuests: 1, bedrooms: 0, beds: {} as Record<string, number> },
    features: { amenities: { basic: [], bath: [], kitchen: [], outdoor: [] as string[] }, facilities: [] as string[] },
    environment: { sharedSpaces: [] as string[], seclusion: "", activities: { options: [] as string[] }, terrain: [] as string[] },
    rules: { checkInFrom: "14:00", checkInTo: "22:00", checkOut: "12:00", additionalRules: "", minAge: 18 },
    pricing: {
      weekdaywithaccommodation: 0,
      weekdaywithoutaccommodation: 0,
      holidaywithaccommodation: 0,
      holidaywithoutaccommodation: 0
    },
    files: [] as File[]
  });

  const steps = useMemo(() => [
    // انسخ نفس تعريف الخطوات StepProfile/StepBasics/... مع نفس الواجهات
    // وتأكد أن StepProfile تُظهر أو تخفي الحقول حسب mode
  ], [/* deps */]);

  const [stepIndex, setStepIndex] = useState(0);

  const validateStep = () => {
    // انسخ تحقق JoinUs كما هو (بما في ذلك كون الأسعار 0 غير مقبولة إن كانت كل القيم 0)
    return true;
  };

  const submit = async () => {
    try {
      if (!validateStep()) return;
      const payload = {
        profile: {
          country: form.profile.country || null,
          document: {
            type: form.profile.docType,
            number: form.profile.docNumber?.trim(),
            countryOfIssue: form.profile.docCountry
          },
          reason: form.profile.why || null,
          currency: form.profile.currency || "USD"
        },
        basics: {
          name: form.basics.name.trim(),
          propertyType: form.basics.propertyType,
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
        seclusion: form.environment.seclusion || null,
        activities: { options: form.environment.activities.options },
        terrain: form.environment.terrain,
        rules: {
          checkInFrom: form.rules.checkInFrom,
          checkInTo: form.rules.checkInTo,
          checkOut: form.rules.checkOut,
          additionalRules: form.rules.additionalRules || null
        },
        booking: {},
        pricing: {
          weekday: {
            withAccommodation: form.pricing.weekdaywithaccommodation,
            withoutAccommodation: form.pricing.weekdaywithoutaccommodation
          },
          holiday: {
            withAccommodation: form.pricing.holidaywithaccommodation,
            withoutAccommodation: form.pricing.holidaywithoutaccommodation
          }
        }
      };

      const fd = new FormData();
      fd.append("joinDataJson", JSON.stringify(payload));
      for (const f of form.files) fd.append("images", f);
      if (ownerId) fd.append("ownerId", ownerId);

      // نفس endpoint المستخدم في JoinUs
      await api.post("/api/camp-requests", fd, {
        headers: { "Content-Type": "multipart/form-data", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
      });

      toast({ title: "تم الإرسال بنجاح", description: "سيتم مراجعة الطلب خلال 3-5 أيام." });
      onSuccess?.();
    } catch (err: any) {
      const message = err?.response?.data?.message || "فشل الإرسال";
      toast({ title: "خطأ", description: message, variant: "destructive" });
    }
  };

  return (
    <div dir="rtl" className="w-full">
      {/* نفس رأس المعالج والتقدم والخطوات كما في JoinUs */}
      {/* أزرار التالي/السابق/إرسال */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => setStepIndex(i => Math.max(i - 1, 0))} disabled={stepIndex === 0}>
          السابق
        </Button>
        <div className="flex gap-2">
          {onCancel && <Button variant="outline" onClick={onCancel}>إلغاء</Button>}
          {stepIndex < steps.length - 1 ? (
            <Button onClick={() => validateStep() && setStepIndex(i => Math.min(i + 1, steps.length - 1))}>التالي</Button>
          ) : (
            <Button onClick={submit} className="bg-green-600 hover:bg-green-700">إرسال</Button>
          )}
        </div>
      </div>
    </div>
  );
}
