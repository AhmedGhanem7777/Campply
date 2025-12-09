
import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Eye, EyeOff, Loader2, Tent } from "lucide-react";
import axios from "axios";

const countries = [
  { name: "عُمان", code: "+968" },
  { name: "البحرين", code: "+973" },
  { name: "الكويت", code: "+965" },
  { name: "قطر", code: "+974" },
  { name: "السعودية", code: "+966" },
  { name: "الإمارات", code: "+971" },
  { name: "مصر", code: "+20" },
  { name: "الأردن", code: "+962" },
  { name: "الجزائر", code: "+213" },
  { name: "المغرب", code: "+212" },
  { name: "تونس", code: "+216" },
];

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countryCode, setCountryCode] = useState("+968");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ حدد هنا الـ baseUrl للـ backend
  const baseUrl = "https://omancamps.com";

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    if (!formData.email) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "البريد الإلكتروني غير صالح";
    if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";
    else if (formData.password.length < 6)
      newErrors.password = "كلمة المرور يجب ألا تقل عن 6 أحرف";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      debugger
      const [firstName, ...lastParts] = formData.fullName.trim().split(" ");
      const displayName = formData.fullName.trim();
      const userName = firstName.toLowerCase();
      const registerData = {
        displayName,
        userName,
        email: formData.email,
        phoneNumber: formData.phoneNumber ? `${countryCode}${formData.phoneNumber}` : "0000000000",
        password: formData.password,
      };

      // ✅ استدعاء الـ API مباشرة
      const response = await axios.post(`${baseUrl}/api/Account/register`, registerData);
      console.log("Register response:", response.data);

      // الانتقال لصفحة تأكيد الإيميل
      navigate("/confirmemail", { state: { email: formData.email } });
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`❌ فشل التسجيل: ${err.response.data.message}`);
      } else {
        alert("❌ فشل التسجيل، تأكد من البيانات أو الاتصال بالخادم");
      }
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
          <h3 className="text-2xl font-bold text-white text-center">إنشاء حساب</h3>
          <p className="text-gray-400 text-center mt-2">انضم إلى Camply اليوم</p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* الاسم الكامل */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">الاسم الكامل</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full pr-10 py-3 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178]"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full pr-10 py-3 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178]"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">رقم الهاتف</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-[35%] py-3 px-2 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178]"
                  style={{ direction: "ltr" }}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="أدخل رقم هاتفك"
                  className="w-[65%] py-3 px-4 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178]"
                />
              </div>
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
                  className="w-full pr-10 py-3 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178]"
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

            {/* تأكيد كلمة المرور */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full pr-10 py-3 bg-[#192127] text-white border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2be178]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2be178]"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* زر التسجيل - تعديل هنا ليكون متدرج من نفس ألوان اللوجو */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-br from-primary to-primary-hover text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 mt-2 hover:brightness-110 transition"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "جارٍ التسجيل..." : "إنشاء حساب"}
            </button>
          </form>

          {/* رابط تسجيل الدخول */}
          <div className="text-center mt-5">
            <p className="text-gray-400 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-[#2be178] font-medium hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
