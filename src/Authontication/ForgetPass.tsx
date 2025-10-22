import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Loader2, Tent } from "lucide-react";
import { forgotPassword } from "../Service/api/account";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("البريد الإلكتروني مطلوب");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("البريد الإلكتروني غير صالح");
      return;
    }

    setError("");
    setInfo("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setInfo("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
      // اختياري: مرر البريد للصفحة التالية عبر state
      navigate("/confirmemail", { state: { email } });
    } catch (err: any) {
      setError(err?.response?.data?.message || "تعذر إرسال الرابط، حاول لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a242f] via-[#101415] to-[#0c0f11] animate-fadeIn px-4">
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        {/* اللوجو */}
        <div className="flex flex-col items-center mb-7">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-hover rounded-3xl shadow-lg shadow-primary/20 animate-fade-in">
            <Tent className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-white mt-2">Camply</h2>
          {/* <p className="text-lg text-gray-300 mt-1">نظام إدارة المخيمات</p> */}
        </div>

        {/* الصندوق */}
        <div className="w-full bg-[#19191e] bg-opacity-95 rounded-2xl shadow-2xl px-8 py-8 transition duration-300">
          <h3 className="text-2xl font-bold text-white text-center">استعادة كلمة المرور</h3>
          <p className="text-sm text-gray-400 text-center mt-2">أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين</p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full pr-10 py-3 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178] transition"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              {info && <p className="text-xs text-emerald-500 mt-1">{info}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2be178] hover:bg-[#25bc62] text-[#101415] font-semibold rounded-lg transition flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center">
            <div className="flex-1 border-t border-gray-900"></div>
            <span className="px-2 bg-[#19191e] text-gray-400 text-xs">أو</span>
            <div className="flex-1 border-t border-gray-900"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              تذكرت كلمة المرور؟{" "}
              <Link to="/login" className="text-[#2be178] font-medium hover:underline transition">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
