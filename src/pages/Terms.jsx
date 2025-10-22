
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "كيف يتم قبول مخيمي في المنصة؟",
    answer: "بعد تقديم طلبك، يقوم فريقنا بمراجعته للتأكد من اكتمال البيانات وصحة المعلومات. سيتم إشعارك عبر البريد الإلكتروني عند قبول الطلب."
  },
  {
    question: "هل هناك رسوم لعرض مخيمي على Camply؟",
    answer: "حالياً، عرض المخيمات على المنصة مجاني. قد يتم تطبيق نموذج عمولة على الحجوزات في المستقبل، وسيتم إشعار جميع الشركاء بذلك مسبقاً."
  },
  {
    question: "كيف أقوم بتحديث معلومات مخيمي؟",
    answer: "ستتمكن من الوصول إلى لوحة تحكم خاصة بالمالك لتحديث التفاصيل والأسعار والتوافر بعد قبول طلبك وإطلاق الميزة."
  },
  {
    question: "ماذا لو لم يكن لدي ترخيص سياحي؟",
    answer: "الترخيص السياحي ونسخة منه إلزاميان لضمان جودة وأمان الخدمات المقدمة لعملائنا. يرجى التأكد من الحصول عليهما قبل تقديم الطلب."
  }
];

const Terms = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>شروط الخدمة | Camply</title>
        <meta name="description" content="شروط وأحكام استخدام منصة Camply." />
      </Helmet>
      <div className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">شروط الخدمة</h1>
          <p className="text-lg text-muted-foreground">آخر تحديث: 6 أكتوبر 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto prose prose-lg dark:prose-invert text-right"
        >
          <h2 className="text-2xl font-bold">1. مقدمة</h2>
          <p>
            مرحبًا بك في Camply. توضح هذه الشروط والأحكام القواعد واللوائح الخاصة باستخدام موقعنا الإلكتروني.
            الوصول إلى هذا الموقع يعني أنك تقبل هذه الشروط والأحكام. لا تستمر في استخدام Camply إذا كنت لا توافق على جميع الشروط والأحكام المذكورة في هذه الصفحة.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">2. ملفات تعريف الارتباط (الكوكيز)</h2>
          <p>
            نحن نستخدم ملفات تعريف الارتباط. من خلال الوصول إلى Camply، فإنك توافق على استخدام ملفات تعريف الارتباط بالاتفاق مع سياسة الخصوصية الخاصة بـ Camply.
          </p>

          <h2 className="text-2xl font-bold mt-8">3. الترخيص</h2>
          <p>
            ما لم يُنص على خلاف ذلك، تمتلك Camply و/أو مرخصوها حقوق الملكية الفكرية لجميع المواد الموجودة على Camply. جميع حقوق الملكية الفكرية محفوظة.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">4. إخلاء المسؤولية</h2>
          <p>
            إلى أقصى حد يسمح به القانون المعمول به، نستبعد جميع الإقرارات والضمانات والشروط المتعلقة بموقعنا واستخدام هذا الموقع.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-8">الأسئلة المتكررة</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Terms;