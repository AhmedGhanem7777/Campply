import { Link } from 'react-router-dom';

export default function JoinSuccess() {
  return (
    <div className="container py-10 space-y-6">
      <div className="rounded-xl bg-emerald-600 text-white p-6">
        <h2 className="text-2xl font-bold">تم إرسال المخيم للمراجعة بنجاح ✓</h2>
        <p className="opacity-90">شكراً لإكمال جميع خطوات التسجيل، سيقوم فريقنا بالمراجعة خلال 24–48 ساعة.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-emerald-600 font-semibold mb-1">الخطوة الأولى</div>
          <h3 className="font-bold mb-1">الأساسيات</h3>
          <p className="text-sm text-muted-foreground">معلومات المالك ونوع المخيم والموقع على الخريطة</p>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-emerald-600 font-semibold mb-1">الخطوة الثانية</div>
          <h3 className="font-bold mb-1">إعداد المشهد</h3>
          <p className="text-sm text-muted-foreground">الصور والمرافق والأنشطة القريبة</p>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-emerald-600 font-semibold mb-1">الخطوة الثالثة</div>
          <h3 className="font-bold mb-1">جاهز للحجز</h3>
          <p className="text-sm text-muted-foreground">السياسات والقواعد والأسعار ومواعيد التوفر</p>
        </div>
      </div>
      <div className="rounded-xl bg-muted p-4 text-sm">
        قيد المراجعة الآن، سنرسل لك بريداً إلكترونياً أو واتساب عند الموافقة ونشر المخيم
      </div>
      <div className="pt-2"><Link to="/home" className="underline">العودة للرئيسية</Link></div>
    </div>
  );
}
