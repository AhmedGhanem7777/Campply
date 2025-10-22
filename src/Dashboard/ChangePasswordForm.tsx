// src/pages/Dashboard/ChangePass.tsx
import React, { useState } from "react";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function ChangePass(): JSX.Element {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMsg("برجاء إدخال كل الحقول.");
      return;
    }
    if (newPassword.length < 8) {
      setMsg("كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMsg("كلمة المرور الجديدة وتأكيدها غير متطابقين.");
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      await api.post("/api/account/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword, // مطابق للباك
      });
      setMsg("تم تغيير كلمة المرور بنجاح.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      const m =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        "فشل تغيير كلمة المرور.";
      setMsg(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="w-full">
      {/* غلاف مركزي مرن يملأ الشاشة، عدّل الارتفاع حسب وجود Header/Sidebar لديك */}
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">تغيير كلمة المرور</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  autoComplete="current-password"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  يفضل استخدام حروف كبيرة وصغيرة وأرقام ورموز لزيادة القوة.
                </p>
              </div>

              <div>
                <label className="block mb-1 text-sm">تأكيد كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "جاري الحفظ..." : "تغيير كلمة المرور"}
              </Button>

              {msg && (
                <div
                  className={`text-sm mt-2 ${
                    msg.includes("تم تغيير") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {msg}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
