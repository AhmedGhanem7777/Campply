
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const PrivacyPolicy = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>سياسة الخصوصية | Camply</title>
        <meta name="description" content="سياسة الخصوصية الخاصة بمنصة Camply." />
      </Helmet>
      <div className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">سياسة الخصوصية</h1>
          <p className="text-lg text-muted-foreground">آخر تحديث: 6 أكتوبر 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto prose prose-lg dark:prose-invert text-right"
        >
          <h2 className="text-2xl font-bold">1. المعلومات التي نجمعها</h2>
          <p>
            نحن نجمع المعلومات التي تقدمها لنا مباشرة. على سبيل المثال، نجمع المعلومات عندما تقوم بإنشاء حساب، أو تشارك في أي ميزات تفاعلية لخدماتنا، أو تملأ نموذجًا، أو تطلب دعم العملاء، أو تتواصل معنا بأي طريقة أخرى.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">2. كيف نستخدم معلوماتك</h2>
          <p>
            قد نستخدم المعلومات التي نجمعها عنك لأغراض مختلفة، بما في ذلك:
            <ul>
              <li>توفير وصيانة وتحسين خدماتنا؛</li>
              <li>تزويدك بالخدمات التي تطلبها ومعالجة المعاملات وإرسال المعلومات ذات الصلة إليك؛</li>
              <li>إرسال إشعارات فنية وتحديثات وتنبيهات أمنية ورسائل دعم وإدارية إليك؛</li>
            </ul>
          </p>

          <h2 className="text-2xl font-bold mt-8">3. مشاركة المعلومات</h2>
          <p>
            قد نشارك المعلومات التي نجمعها عنك كما هو موضح في سياسة الخصوصية هذه أو كما هو موضح في وقت جمع المعلومات أو مشاركتها.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">4. أمن البيانات</h2>
          <p>
            نتخذ تدابير معقولة للمساعدة في حماية المعلومات المتعلقة بك من الفقدان والسرقة وسوء الاستخدام والوصول غير المصرح به والكشف والتغيير والتدمير.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default PrivacyPolicy;