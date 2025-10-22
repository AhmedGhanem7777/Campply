import { Link } from "react-router-dom";
import { Tent, LogIn, UserPlus } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-hover rounded-3xl shadow-lg shadow-primary/20 animate-fade-in">
          <Tent className="w-10 h-10 text-primary-foreground" />
        </div>

        {/* Hero Text */}
        <div className="space-y-4 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Camply
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            نظام متكامل لإدارة وحجز المخيمات بسهولة ويسر
          </p>
          <p className="text-base text-muted-foreground/80">
            انضم إلينا اليوم واستمتع بتجربة حجز سهلة وسريعة
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link 
            to="/Login"
            className="group px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 active:scale-[0.98] inline-flex items-center space-x-3 space-x-reverse min-w-[200px] justify-center shadow-lg shadow-primary/20"
          >
            <span>تسجيل الدخول</span>
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" style={{ transform: 'scaleX(-1)' }} />
          </Link>
          
          <Link 
            to="/register"
            className="group px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 active:scale-[0.98] inline-flex items-center space-x-3 space-x-reverse min-w-[200px] justify-center"
          >
            <span>إنشاء حساب جديد</span>
            <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" style={{ transform: 'scaleX(-1)' }} />
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { title: "حجز سهل", desc: "احجز مخيمك المفضل بخطوات بسيطة" },
            { title: "إدارة متقدمة", desc: "نظام شامل لإدارة المخيمات والحجوزات" },
            { title: "دعم متواصل", desc: "فريق دعم متاح على مدار الساعة" }
          ].map((feature, i) => (
            <div key={i} className="auth-card p-6 hover:border-primary/50 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;


