import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Tent, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../Service/api/account";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();

  // قراءة من الرابط أو من state القادم من صفحة forgot
  const emailFromQuery = query.get("email") || (location.state as any)?.email || "";
  const tokenFromQuery = query.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!emailFromQuery || !tokenFromQuery) {
      setError("الرابط غير صالح أو تنقصه المعطيات (email, token)");
      return;
    }
    if (!password || !confirmPassword) {
      setError("جميع الحقول مطلوبة");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور يجب ألا تقل عن 6 أحرف");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setError("");
    setInfo("");
    setLoading(true);

    try {
      await resetPassword(emailFromQuery, tokenFromQuery, password);
      setInfo("تمت إعادة تعيين كلمة المرور بنجاح");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "فشل إعادة التعيين، تأكد من صلاحية الرابط وحاول مجدداً");
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
          <h3 className="text-2xl font-bold text-white text-center">
            إعادة تعيين كلمة المرور
          </h3>
          <p className="text-sm text-gray-400 text-center mt-2">
            أدخل كلمة المرور الجديدة ثم أكدها
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  className="w-full pr-10 py-3 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178] transition"
                />
                {showPassword ? (
                  <EyeOff
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full pr-10 py-3 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178] transition"
                />
                {showConfirm ? (
                  <EyeOff
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                    onClick={() => setShowConfirm(false)}
                  />
                ) : (
                  <Eye
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                    onClick={() => setShowConfirm(true)}
                  />
                )}
              </div>
            </div>

            {/* Alerts */}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {info && <p className="text-xs text-emerald-500 mt-1">{info}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2be178] hover:bg-[#25bc62] text-[#101415] font-semibold rounded-lg transition flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "جارٍ التحديث..." : "تغيير كلمة المرور"}
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
              هل تتذكر كلمة المرور؟{" "}
              <a href="/login" className="text-[#2be178] font-medium hover:underline transition">
                تسجيل الدخول
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
