import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../Service/api/client";

export default function ConfirmEmailCallback() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("جارٍ تأكيد البريد...");

  useEffect(() => {
    const email = sp.get("email") || "";
    const token = sp.get("token") || "";
    if (!email || !token) {
      setMsg("رابط تأكيد غير صالح");
      return;
    }
    (async () => {
      try {
        await api.get("/api/Account/confirmEmail", { params: { email, token } });
        setMsg("تم تأكيد بريدك، سيتم تحويلك...");
        setTimeout(() => navigate("/login"), 1200);
      } catch {
        setMsg("تعذر تأكيد البريد، حاول لاحقًا أو أعد الإرسال من صفحة التأكيد.");
      }
    })();
  }, [navigate, sp]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="p-6 rounded-lg bg-[#19191e] text-white">{msg}</div>
    </div>
  );
}
