import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useToast } from "@/components/ui/use-toast";

const ContactUs = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 الميزة قيد التطوير",
      description: "هذه الميزة لم تُنفذ بعد — لكن لا تقلق! يمكنك طلبها في رسالتك القادمة! 🚀",
    });
  };

  return (
    <PageTransition>
      <Helmet>
        <title>اتصل بنا | Camply</title>
        <meta name="description" content="هل لديك سؤال أو استفسار؟ تواصل مع فريق Camply. نحن هنا للمساعدة." />
      </Helmet>
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن هنا للإجابة على جميع أسئلتك. لا تتردد في التواصل معنا.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>أرسل لنا رسالة</CardTitle>
                <CardDescription>سنقوم بالرد عليك في أقرب وقت ممكن.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input id="name" placeholder="اسمك الكامل" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" placeholder="example@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">الموضوع</Label>
                    <Input id="subject" placeholder="موضوع رسالتك" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة</Label>
                    <Textarea id="message" placeholder="اكتب رسالتك هنا..." required />
                  </div>
                  <Button type="submit" className="w-full">إرسال</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold">معلومات التواصل</h2>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-md">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">البريد الإلكتروني</p>
                <a href="mailto:support@camply.com" className="text-muted-foreground hover:text-primary">support@camply.com</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-md">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">الهاتف</p>
                <p className="text-muted-foreground" dir="ltr">+966 11 123 4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-md">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">العنوان</p>
                <p className="text-muted-foreground">
                  1234 طريق الملك فهد، الرياض، المملكة العربية السعودية
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ContactUs;
  














