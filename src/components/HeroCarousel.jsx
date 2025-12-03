
// src/components/HeroCarousel.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroCamp1 from "@/assets/hero-camp-1.jpg";
import heroCamp2 from "@/assets/hero-camp-2.jpg";
import heroCamp3 from "@/assets/hero-camp-3.jpg";
// import heroCamp4 from "@/assets/WhatsApp Image 2025-10-20 at 00.11.27_0e48196f.jpg";

const slides = [
  { image: heroCamp1, title: "اكتشف سحر الشتاء في عُمان!", description: "أكثر من 300 مخيم جاهز للحجز الفوري في مختلف الولايات.", cta: "تصفح جميع المخيمات" },
  { image: heroCamp2, title: "عيش أجواء البرّ السعودي على أصولها!", description: "من مخيمات العلا إلى القصيم وصولا إلى الرياض – كل التجارب في مكان واحد", cta: "تصفح جميع المخيمات" },
  { image: heroCamp3, title: "تجربة تخييم فاخرة في قلب الإمارات", description: "اختر من بين أفضل المخيمات في ليوا، دبي، الذيد والعين وأبوظبي", cta: "تصفح جميع المخيمات" },
  // { image: heroCamp4, title: "اكتشف سحر الشتاء في عُمان!", description: "أكثر من 300 مخيم جاهز للحجز الفوري في مختلف الولايات.", cta: "تصفح جميع المخيمات" },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const goAll = () => navigate("/all-camps");
  const next = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prev = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden rounded-none md:rounded-xl shadow-nature-lg">
      {slides.map((slide, index) => (
        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{slide.title}</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-6">{slide.description}</p>
            <button onClick={goAll} className="inline-flex items-center justify-center rounded-md bg-white/90 text-black px-6 py-3 font-medium hover:bg-white transition">
              {slide.cta}
            </button>
          </div>
        </div>
      ))}

      {/* الأسهم في شاشات md وما فوق في منتصف الطول وعلى الأطراف */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-smooth hidden md:block"
        aria-label="الشريحة السابقة"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-smooth hidden md:block"
        aria-label="الشريحة التالية"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* الأسهم في الشاشات الصغيرة أسفل الشاشة الأيسر والأيمن */}
      <div className="absolute bottom-16 inset-x-0 flex justify-between px-4 md:hidden">
        <button
          onClick={prev}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-smooth"
          aria-label="الشريحة السابقة"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={next}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-smooth"
          aria-label="الشريحة التالية"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* مؤشر صفحات الشرائح */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-smooth ${i === currentSlide ? "bg-white w-8" : "bg-white/50 w-2"}`} aria-label={`الانتقال إلى الشريحة ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
