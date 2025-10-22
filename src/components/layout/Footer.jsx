// src/components/layout/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { ArabicTentIcon } from '@/components/ui/ArabicTentIcon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <footer className="bg-secondary text-secondary-foreground" dir="rtl">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* العمود 1: الشعار ونبذة */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ArabicTentIcon className="h-10 w-10 text-primary" />
              <span className="font-bold text-2xl">Camply</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              منصتك الأولى لاستكشاف وحجز أفضل المخيمات في الوطن العربي
            </p>
          </div>

          {/* العمود 2: روابط سريعة */}
          <div>
            <p className="font-bold mb-4">روابط سريعة</p>
            <ul className="space-y-2">
              <li><Link to="/home" className="text-sm text-muted-foreground hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">من نحن</Link></li>
              <li><Link to="/join" className="text-sm text-muted-foreground hover:text-primary transition-colors">انضم إلينا</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* العمود 3: نفس النص الأصلي + فتح Dialog */}
          <div>
            <p className="font-bold mb-4">سياسة الخصوصية والشروط والأحكام</p>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setPrivacyOpen(true)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                >
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                >
                  الشروط والأحكام
                </button>
              </li>
            </ul>
          </div>

          {/* العمود 4: تابعنا */}
          <div>
            <p className="font-bold mb-4">تابعنا</p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter"><Twitter /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram"><Instagram /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook"><Facebook /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Camply. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>

      {/* Dialog: سياسة الخصوصية */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>سياسة الخصوصية – منصة كامبلي (Camply)</DialogTitle>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 text-sm text-muted-foreground leading-7">
            <section>
              <h3 className="font-semibold mb-1">1. المقدمة</h3>
              <p>
                مرحبًا بكم في منصة كامبلي (Camply)، المنصة الإلكترونية المتخصصة لحجز المخيمات والتجارب السياحية في دول الخليج وبعض الدول العربية.
                نلتزم في كامبلي بحماية خصوصية المستخدمين وضمان سرية بياناتهم وفقًا للقوانين المعمول بها في سلطنة عُمان والدول الأخرى التي نقدم خدماتنا فيها.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-1">2. المعلومات التي نجمعها</h3>
              <ul className="list-disc pr-6 space-y-1">
                <li>البيانات الشخصية (الاسم، رقم الهاتف، البريد الإلكتروني، الدولة، العملة).</li>
                <li>بيانات الحجز والدفع (عند استخدام خدمات الدفع الإلكتروني).</li>
                <li>بيانات الاستخدام (مثل الصفحات التي تزورها ونوع الجهاز وموقعك الجغرافي التقريبي).</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-1">3. كيفية استخدام المعلومات</h3>
              <ul className="list-disc pr-6 space-y-1">
                <li>إدارة حسابك وتنفيذ الحجوزات.</li>
                <li>تحسين أداء المنصة وتجربتك كمستخدم.</li>
                <li>التواصل معك بشأن الحجوزات أو العروض الترويجية أو الدعم الفني.</li>
                <li>الالتزام بالمتطلبات القانونية والتنظيمية المعمول بها محلياً أو إقليمياً.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-1">4. حماية المعلومات</h3>
              <p>تُخزن بياناتك في خوادم آمنة وتُحمى بتقنيات حديثة لمنع الوصول غير المصرح به. ولا نشارك بياناتك مع أي جهة خارجية إلا في الحالات التالية:</p>
              <ul className="list-disc pr-6 space-y-1 mt-2">
                <li>عند الضرورة لتنفيذ الحجز مع أصحاب المخيمات.</li>
                <li>مع مزودي خدمات الدفع الإلكتروني المرخّصين داخل سلطنة عُمان أو خارجها.</li>
                <li>استجابة لطلب رسمي من الجهات القانونية المختصة.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-1">5. ملفات تعريف الارتباط (Cookies)</h3>
              <p>نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل الأداء. يمكنك تعطيلها من إعدادات المتصفح، لكن قد لا تعمل بعض أجزاء الموقع بشكل كامل.</p>
            </section>

            <section>
              <h3 className="font-semibold mb-1">6. حقوق المستخدم</h3>
              <ul className="list-disc pr-6 space-y-1">
                <li>الوصول إلى بياناته أو تعديلها أو طلب حذفها أو حذف حسابه بالكامل.</li>
                <li>إلغاء الاشتراك في الرسائل التسويقية والنشرات الإخبارية عبر وسائل التواصل الاجتماعي أو البريد الإلكتروني في أي وقت.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-1">7. التعديلات</h3>
              <p>تحتفظ إدارة كامبلي بحق تعديل هذه السياسة عند الحاجة، وسيتم إخطار المستخدمين بأي تحديثات عبر الموقع أو البريد الإلكتروني.</p>
            </section>
          </div>

          <div className="pt-2">
            <Button variant="outline" onClick={() => setPrivacyOpen(false)}>إغلاق</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: الشروط والأحكام (محتوى "شروط الخدمة") */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>الشروط والأحكام</DialogTitle>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 text-sm text-muted-foreground leading-7">
            <section>
              <h3 className="font-semibold mb-1">1. التعريفات</h3>
              <ul className="list-disc pr-6 space-y-1">
                <li>المنصة: تشير إلى موقع وتطبيق كامبلي (Camply).</li>
                <li>المستخدم: هو أي شخص يقوم باستخدام المنصة سواء للتصفح أو الحجز سواء قام بإنشاء حساب وتسجيل الدخول أو كان زائرا فقط.</li>
                <li>المضيف: هو مالك أو مدير المخيم الذي يعرض خدماته عبر المنصة.</li>
                <li>مسؤول المنصة: هو الشخص المخول بإدارة جميع محتويات المنصة والإشراف عليها حسب الإجراءات والسياسات المكتوبة.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-1">2. نطاق الخدمة</h3>
              <p>تعمل كامبلي كوسيط تقني بين المستخدمين وأصحاب المخيمات لتسهيل عمليات البحث والحجز فقط، ولا تتحمل المنصة أي مسؤولية مباشرة عن جودة الخدمات المقدمة في مواقع التخييم.</p>
            </section>

            <section>
              <h3 className="font-semibold mb-1">3. الحجز والدفع</h3>
              <ul className="list-disc pr-6 space-y-2">
                <li>يمكن للمستخدم إتمام عملية الحجز عبر المنصة باستخدام خيارات الدفع المتاحة أو التواصل المباشر مع صاحب المخيم عبر الوسائل المتاحة حاليا لإتمام عملية الدفع وتأكيد الحجز.</li>
                <li>يُعتبر الحجز مؤكدًا بعد دفع العميل أو بعد استلام تأكيد من صاحب المخيم عبر قنوات التواصل المتاحة.</li>
                <li>تلتزم المنصة بحماية بضمان حقوق الطرفين وفق السياسات المعمول بها والشروط والأحكام.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-1">4. سياسة الحجز والإلغاء</h3>
              <p>يُتاح للمضيفين اختيار إحدى السياسات التالية، وتُطبق تلقائيًا على كل حجز:</p>

              <div className="mt-3 space-y-4">
                <div>
                  <h4 className="font-semibold">سياسة مرنة (Flexible)</h4>
                  <ul className="list-disc pr-6 space-y-1">
                    <li>استرداد كامل: إذا تم الإلغاء قبل 24 ساعة على الأقل من يوم تسجيل الوصول.</li>
                    <li>استرداد 50٪: إذا تم الإلغاء خلال 24 ساعة من يوم تسجيل الوصول.</li>
                    <li>لا يوجد استرداد: إذا تم الإلغاء بعد يوم تسجيل الوصول.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">سياسة متوسطة (Moderate)</h4>
                  <ul className="list-disc pr-6 space-y-1">
                    <li>استرداد كامل: إذا تم الإلغاء قبل 5 أيام على الأقل من يوم تسجيل الوصول.</li>
                    <li>استرداد 50٪: إذا تم الإلغاء خلال 5 أيام من يوم تسجيل الوصول.</li>
                    <li>لا يوجد استرداد: إذا تم الإلغاء بعد يوم تسجيل الوصول.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">سياسة الخمسة عشر يومًا (Fifteen)</h4>
                  <ul className="list-disc pr-6 space-y-1">
                    <li>استرداد كامل: إذا تم الإلغاء خلال 48 ساعة من تأكيد الحجز، وقبل 15 يومًا على الأقل من يوم تسجيل الوصول.</li>
                    <li>استرداد 50٪: إذا تم الإلغاء بعد مرور 48 ساعة على تأكيد الحجز، وقبل 15 يومًا على الأقل من يوم تسجيل الوصول.</li>
                    <li>لا يوجد استرداد: إذا تم الإلغاء قبل أقل من 15 يومًا من يوم تسجيل الوصول.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">سياسة الثلاثين يومًا (Thirty)</h4>
                  <ul className="list-disc pr-6 space-y-1">
                    <li>استرداد كامل: إذا تم الإلغاء خلال 48 ساعة من تأكيد الحجز، وقبل 30 يومًا على الأقل من يوم تسجيل الوصول.</li>
                    <li>استرداد 50٪: إذا تم الإلغاء بعد مرور 48 ساعة على تأكيد الحجز، وقبل 30 يومًا على الأقل من يوم تسجيل الوصول.</li>
                    <li>لا يوجد استرداد: إذا تم الإلغاء قبل أقل من 30 يومًا من يوم تسجيل الوصول.</li>
                  </ul>
                </div>

                <div className="text-sm text-muted-foreground">
                  ملاحظات إضافية:
                  <ul className="list-disc pr-6 space-y-1 mt-1">
                    <li>لا يمكن تعديل أو استرداد الحجوزات بعد تسجيل الوصول.</li>
                    <li>في الحالات الطارئة مثل الظروف الجوية أو القرارات الحكومية، تحتفظ المنصة بحق مراجعة الاسترداد وفقًا لتقديرها وتسوية الحالة بين الطرفين المُتنازعين.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-1">5. مسؤوليات المستخدمين والمضيفين</h3>
              <ul className="list-disc pr-6 space-y-1">
                <li>يجب إدخال بيانات صحيحة عند التسجيل أو الحجز.</li>
                <li>يُمنع نشر أي محتوى غير لائق أو مخالف للأنظمة أو حقوق الغير.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-1">6. حقوق الملكية الفكرية</h3>
              <p>جميع حقوق التصميم والمحتوى والعلامة التجارية والتقنيات الخاصة بمنصة كامبلي (Camply) محفوظة. يُمنع نسخ أو إعادة استخدام أي جزء من الموقع دون إذن خطي مسبق من الإدارة.</p>
            </section>

            <section>
              <h3 className="font-semibold mb-1">7. التعديلات</h3>
              <p>تحتفظ المنصة بحق تعديل هذه الشروط أو تحديثها في أي وقت، وتصبح نافذة فور نشرها على الموقع.</p>
            </section>

            <section>
              <h3 className="font-semibold mb-1">8. القانون المُنظّم</h3>
              <p>تخضع هذه الشروط والأحكام لقوانين وأنظمة سلطنة عُمان، ويُحال أي نزاع إلى الجهات القضائية المختصة في السلطنة.</p>
            </section>
          </div>

          <div className="pt-2">
            <Button variant="outline" onClick={() => setTermsOpen(false)}>إغلاق</Button>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
