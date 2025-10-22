import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Tent } from "lucide-react";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // البريد اللي وصل من صفحة Register
  const userEmail = location.state?.email || "";

  // فتح البريد الإلكتروني باستخدام رابط Gmail أو mailto
  const openEmailClient = () => {
    // if (userEmail) {
    //   // فتح البريد بشكل مباشر مع mailto
    //   window.open(`mailto:${userEmail}`, "_blank");
    // } else {
      // لو البريد مش موجود افتح Gmail كخيار افتراضي
      window.open("https://mail.google.com/", "_blank");
    // }
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

        {/* محتوى التأكيد */}
        <div className="bg-[#19191e] bg-opacity-95 rounded-2xl shadow-2xl px-8 py-8 text-center">
          <Mail className="w-14 h-14 mx-auto text-[#2be178]" />
          <h3 className="text-2xl font-bold text-white mt-4">تم التسجيل بنجاح!</h3>
          <p className="text-gray-400 mt-2">
            من فضلك تحقق من بريدك الإلكتروني لتأكيد الحساب
          </p>

          <button
            onClick={openEmailClient}
            className="mt-6 w-full py-3 bg-[#2be178] hover:bg-[#25bc62] text-[#101415] font-semibold rounded-lg"
          >
            ادخل إلى بريدك الإلكتروني
          </button>

          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-800"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
