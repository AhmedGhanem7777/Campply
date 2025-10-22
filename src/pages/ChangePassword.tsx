// src/pages/ChangePassword.tsx
import React, { useMemo, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../Service/api/account";

export default function ChangePassword() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => {
    const p = newPassword || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 4);
  }, [newPassword]);

  const strengthLabel = useMemo(() => {
    switch (strength) {
      case 0: return "ضعيف جداً";
      case 1: return "ضعيف";
      case 2: return "متوسط";
      case 3: return "جيد";
      case 4: return "قوي";
      default: return "ضعيف جداً";
    }
  }, [strength]);

  const strengthBarClass = useMemo(() => {
    const base = "h-2 rounded-full transition-all";
    if (strength <= 1) return `${base} bg-destructive`;
    if (strength === 2) return `${base} bg-yellow-500`;
    if (strength === 3) return `${base} bg-primary/80`;
    return `${base} bg-primary`;
  }, [strength]);

  const validate = () => {
    if (!currentPassword.trim()) {
      toast({ title: "الرجاء إدخال كلمة المرور الحالية", variant: "destructive" });
      return false;
    }
    if ((newPassword || "").length < 8) {
      toast({ title: "الحد الأدنى 8 أحرف لكلمة المرور الجديدة", variant: "destructive" });
      return false;
    }
    if (newPassword === currentPassword) {
      toast({ title: "كلمة المرور الجديدة يجب أن تختلف عن الحالية", variant: "destructive" });
      return false;
    }
    if (newPassword !== repeatPassword) {
      toast({ title: "تأكيد كلمة المرور غير مطابق", variant: "destructive" });
      return false;
    }
    return true;
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);

      await changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: repeatPassword,
      });

      toast({ title: "تم تغيير كلمة المرور بنجاح", description: "تم تحديث كلمة المرور الخاصة بك." });
      setCurrentPassword(""); setNewPassword(""); setRepeatPassword("");
      navigate(-1);
    } catch (err: any) {
      // ASP.NET Identity قد يعيد Errors[].Description مجمعة ضمن رسالة واحدة كما في الباك
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        "تعذر تغيير كلمة المرور. حاول مجددًا.";
      toast({ title: "خطأ", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-[calc(100vh-56px)] bg-background">
      <section className="border-b bg-muted/40">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <KeyRound className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">تغيير كلمة المرور</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            قم بتحديث كلمة المرور لحسابك للحفاظ على أمان بياناتك.
          </p>
        </div>
      </section>

      <section className="container py-8">
        <form
          onSubmit={submit}
          className="mx-auto max-w-xl rounded-2xl border bg-card p-5 shadow-[var(--shadow-elegant)] animate-fade-in"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold">التحقق من الهوية</h2>
            <p className="text-sm text-muted-foreground mt-1">
              أدخل كلمة المرور الحالية ثم اختر كلمة مرور جديدة قوية.
            </p>
          </div>

          {/* Current password */}
          <div className="grid gap-2 mb-4">
            <label className="text-sm font-medium">كلمة المرور الحالية</label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Toggle current password"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="grid gap-2 mb-4">
            <label className="text-sm font-medium">كلمة المرور الجديدة</label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="على الأقل 8 أحرف"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Toggle new password"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Strength meter */}
            <div className="mt-2">
              <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                <div
                  className={strengthBarClass}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">قوة كلمة المرور: {strengthLabel}</div>
              <ul className="mt-2 text-xs text-muted-foreground list-disc pr-4">
                <li>طول 8+ أحرف</li>
                <li>أحرف كبيرة وصغيرة</li>
                <li>أرقام ورموز</li>
              </ul>
            </div>
          </div>

          {/* Repeat new password */}
          <div className="grid gap-2 mb-6">
            <label className="text-sm font-medium">تأكيد كلمة المرور الجديدة</label>
            <div className="relative">
              <Input
                type={showRepeat ? "text" : "password"}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="أعد كتابة كلمة المرور الجديدة"
                required
              />
              <button
                type="button"
                onClick={() => setShowRepeat((s) => !s)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Toggle repeat password"
              >
                {showRepeat ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="min-w-[120px]"
            >
              رجوع
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 min-w-[160px]"
            >
              <ShieldCheck className="h-4 w-4" />
              {submitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
