// src/pages/AboutUs.jsx
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Target, Compass } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const AboutUs = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>من نحن | Camply</title>
        <meta name="description" content="تعرف على قصة Camply ورؤيتنا في جعل الطبيعة أقرب للجميع." />
      </Helmet>

      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">عن Camply</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            نحن نؤمن بأن أفضل الذكريات تُصنع في الهواء الطلق. مهمتنا هي ربط الناس بالطبيعة من خلال تجارب تخييم لا تُنسى.
          </p>
        </motion.div>

        <div className="relative mb-20">
          {/* <img className="w-full h-96 object-cover rounded-lg shadow-lg" alt="Team of explorers looking at a map in a forest" src="https://images.unsplash.com/photo-1515966071294-08f1d52f6246" /> */}
        </div>

        <div className="grid md:grid-cols-3 gap-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">من نحن</h2>
            <p className="text-muted-foreground">
              نحن فريق من عشاق الطبيعة والمغامرين والمطورين الذين اجتمعوا لجعل استكشاف العالم أسهل وأكثر متعة.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">مهمتنا</h2>
            <p className="text-muted-foreground">
              تسهيل الوصول إلى تجارب الطبيعة الفريدة من خلال منصة موثوقة وسهلة الاستخدام تجمع بين أفضل المخيمات والمغامرين.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Compass className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">رؤيتنا</h2>
            <p className="text-muted-foreground">
              أن نكون البوابة الأولى لكل من يبحث عن مغامرة في الهواء الطلق، وإلهام جيل جديد من محبي الطبيعة.
            </p>
          </motion.div>
        </div>

        {/* كيف تعمل المنصة + المزايا لأصحاب المخيمات */}
        <section className="py-20">
          <div className="container max-w-4xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center">كيف تعمل المنصة؟</h2>
              <p className="text-muted-foreground text-center">
                نعرض مكان إقامتكم إلى جمهور كبير من الذين يتطلعون لحجز عطلتهم القادمة، مما يُسهّل عليهم البحث عن موقع التخييم الفاخر الخاص بكم والعثور عليه وحجزه عبر الإنترنت.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border bg-background p-5 space-y-2">
                <h3 className="text-lg font-semibold">تسجيل مرن وسهل ومجاني</h3>
                <p className="text-sm text-muted-foreground">
                  يمكنكم تعبئة نموذج التسجيل بكل سهولة، وسيقوم فريقنا بمراجعة الطلب والتحقق منه، ثم سنقوم بإشعاركم عبر البريد الإلكتروني.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-5 space-y-2">
                <h3 className="text-lg font-semibold">لا رسوم خفية على الضيوف</h3>
                <p className="text-sm text-muted-foreground">
                  لا نفرض رسوم حجز، لذا يُطمئن ضيوفنا أن السعر الذي يرونه هو السعر الذي يدفعونه.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-5 space-y-2">
                <h3 className="text-lg font-semibold">لوحة تحكم خاصة بصاحب المُخيم</h3>
                <p className="text-sm text-muted-foreground">
                  يمكنكم تغيير أو تحديث عروضكم في أي وقت؛ مع التحكم في التوافر والأسعار من خلال لوحة التحكم.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-5 space-y-2">
                <h3 className="text-lg font-semibold">العميل يدفع مُباشرةً لكم</h3>
                <p className="text-sm text-muted-foreground">
                  تذهب الإيرادات المُحققة من الحجوزات المُستلمة مُباشرةً إلى حسابكم.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">عند انضمامي إلى المنصة ماذا سأحصل؟</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <li className="rounded-md border bg-background p-3">فرص حجز جديدة</li>
                <li className="rounded-md border bg-background p-3">الوصول إلى قاعدة عملاء إضافية</li>
                <li className="rounded-md border bg-background p-3">الظهور عبر الإنترنت من خلال منصتنا الإلكترونية</li>
                <li className="rounded-md border bg-background p-3">ترويج إضافي من خلال حملاتنا التسويقية</li>
                <li className="rounded-md border bg-background p-3">فرص تصوير احترافي للمخيم والتسويق له عبر قنوات التواصل الاجتماعي</li>
                <li className="rounded-md border bg-background p-3">الظهور في المدونات والتقارير</li>
                <li className="rounded-md border bg-background p-3">الظهور في منشوراتنا</li>
                <li className="rounded-md border bg-background p-3">الترويج عبر قنوات التواصل الاجتماعي</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AboutUs;
