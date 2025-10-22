// src/pages/Pricing.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getPublicPlans } from "@/Service/api/plans";
import { waLink } from "../utils/wa";

function formatCurrencySymbol(code) {
  switch ((code || "").toUpperCase()) {
    case "OMR": return "ر.ع";
    case "SAR": return "ر.س";
    case "AED": return "د.إ";
    case "QAR": return "ر.ق";
    case "KWD": return "د.ك";
    case "BHD": return "د.ب";
    case "USD": return "$";
    default: return code || "";
  }
}

function formatCycle(cycle) {
  if (!cycle) return "";
  const c = (typeof cycle === "string" ? cycle : "").toLowerCase();
  if (c.includes("year")) return "سنوياً";
  if (c.includes("month")) return "شهرياً";
  // في حال رجع backend قيم عربية "سنوي/شهري"
  if (c.includes("سن")) return "سنوياً";
  if (c.includes("شهر")) return "شهرياً";
  return c;
}

function priceLabel(p) {
  const price = Number(p?.price ?? 0);
  const curr = formatCurrencySymbol(p?.currency);
  const cyc = formatCycle(p?.billingCycle);
  if (!Number.isFinite(price) || price <= 0) return "مجاني";
  return `${price} ${curr}${cyc ? " / " + cyc : ""}`;
}

function fallbackImage(i) {
  // صورة احتياطية بسيطة
  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";
}

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const salesPhone = "9665ZZZZZZZZ";
  const subscribe = (title) =>
    window.open(waLink(salesPhone, `أرغب في الاشتراك في باقة ${title}`), "_blank");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getPublicPlans();
        // نتوقع شكل عناصر: { id,name,price,currency,billingCycle,isPopular,features[],imageUrl? }
        const arr = Array.isArray(data) ? data : [];
        setPlans(arr);
      } catch (e) {
        setErr("تعذر تحميل الباقات.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ordered = useMemo(() => {
    // لو لم يرتبها السيرفر، رتب حسب الشعبية ثم السعر
    return [...plans].sort((a, b) => {
      const popA = a?.isPopular ? 1 : 0;
      const popB = b?.isPopular ? 1 : 0;
      if (popA !== popB) return popB - popA;
      const pa = Number(a?.price ?? 0);
      const pb = Number(b?.price ?? 0);
      return pa - pb;
    });
  }, [plans]);

  if (loading) return <div className="container py-16 text-center text-muted-foreground">جارٍ التحميل…</div>;
  if (err) return <div className="container py-16 text-center text-destructive">{err}</div>;
  if (ordered.length === 0) return <div className="container py-16 text-center text-muted-foreground">لا توجد باقات متاحة حالياً</div>;

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">باقات الاشتراك</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ordered.map((pl) => (
          <div key={pl.id} className={`border rounded-xl overflow-hidden bg-background flex flex-col ${pl.isPopular ? "ring-2 ring-primary" : ""}`}>
            {/* الصورة */}
            <div className="h-40 w-full overflow-hidden bg-muted">
              <img
                src={pl.imageUrl || fallbackImage(pl.id)}
                alt={pl.name || "Plan"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* المحتوى */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{pl.name || "-"}</h3>
                {pl.isPopular && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    المفضلة
                  </span>
                )}
              </div>

              <div className="text-2xl font-bold mb-4">
                {priceLabel(pl)}
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                {(pl.features || []).map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>

              <button
                onClick={() => subscribe(pl.name || "غير مسمى")}
                className="mt-auto w-full h-11 rounded-lg bg-[#25D366] text-white hover:opacity-95"
              >
                اشترك عبر واتساب
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
