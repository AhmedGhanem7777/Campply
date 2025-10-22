import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Eye, EyeOff, Loader2, Tent } from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: ("https://camply.runasp.net").replace(/\/$/, ""),
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false, // للإتساق مع الواجهة الحالية حتى لو نخزّن دومًا في localStorage
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    debugger
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data } = await api.post("/api/Account/login", {
        email: formData.email,
        password: formData.password,
      });

      // توقّعات الرد: { id, displayName, email, token, role, isActive }
      const token = String(data?.token || "");
      const role = String(data?.role || "");
      const userId = String(data?.id || "");
      const email = String(data?.email || "");

      // التخزين المطلوب في localStorage
      if (token) localStorage.setItem("token", token);
      if (role) localStorage.setItem("role", role);
      if (userId) localStorage.setItem("userId", userId);
      if (email) localStorage.setItem("email", email);

      // توجيه بحسب الدور العربي
      if (role === "صاحب_مخيم" || role === "مسؤول") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "حدث خطأ أثناء تسجيل الدخول";
      setErrors({ general: serverMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a242f] via-[#101415] to-[#0c0f11] px-4">
      <div className="w-full max-w-md">
        {/* اللوجو */}
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-hover rounded-3xl shadow-lg shadow-primary/20">
            <Tent className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-white mt-2">Camply</h2>
          {/* <p className="text-gray-300 mt-1">نظام إدارة المخيمات</p> */}
        </div>

        {/* الفورم */}
        <div className="bg-[#19191e] bg-opacity-95 rounded-2xl shadow-2xl px-8 py-8">
          <h3 className="text-2xl font-bold text-white text-center">تسجيل الدخول</h3>
          <p className="text-gray-400 text-center mt-2">أدخل بياناتك لتسجيل الدخول</p>

          {errors.general && (
            <p className="text-xs text-red-500 text-center mt-2">{errors.general}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full pr-10 py-3 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178] transition"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="أدخل كلمة المرور"
                  className="w-full pr-10 py-3 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2be178]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* تذكرني + رابط */}
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#192127] border-gray-600 text-[#2be178]"
                />
                تذكرني
              </label>
              <Link to="/forgetpass" className="text-[#2be178] text-sm underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2be178] hover:bg-[#25bc62] text-[#ffffff] font-semibold rounded-lg flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          {/* رابط إنشاء حساب */}
          <div className="text-center mt-5">
            <p className="text-gray-400 text-sm">
              ليس لديك حساب؟{" "}
              <Link to="/register" className="text-[#2be178] font-medium hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



