// src/components/CampCard.tsx
import { Heart, MapPin, Star } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "../components/ui/use-toast";
import { addItemToBasket } from "../Service/api/basket";

type NameOrObject = string | { name?: string };

interface CampCardProps {
  id: number;
  image: string;
  title: string;
  location?: string;
  country?: NameOrObject;
  state?: NameOrObject;
  city?: NameOrObject;
  rating: number;
  price: number;
  onBookClick?: (campId: number) => void;
}

const FALLBACK = "https://images.unsplash.com/photo-1532555283690-cbf89e69cec7";
const formatUSD = (v: number) =>
  new Intl.NumberFormat("ar", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(v || 0);

function resolveName(v?: NameOrObject): string | undefined {
  if (!v) return undefined;
  return typeof v === "string" ? v : v?.name;
}

const CampCard = ({
  id,
  image,
  title,
  location,
  country,
  state,
  city,
  rating,
  price,
  onBookClick,
}: CampCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [heartBusy, setHeartBusy] = useState(false);
  const { toast } = useToast();

  const safeImage = image || FALLBACK;
  const safeTitle = title || "مخيم";
  const safeRating = Number.isFinite(rating) ? Number(rating) : 0;
  const safePrice = Number.isFinite(price) ? Number(price) : 0;

  const locParts = [resolveName(country), resolveName(state), resolveName(city)].filter(Boolean) as string[];
  const computedLocation =
    (location && location.trim() && location !== "-") ? location :
    (locParts.length ? locParts.join(" / ") : "-");

  async function handleHeartClick() {
    try {
      setHeartBusy(true);
      await addItemToBasket({
        campId: id,
        title: safeTitle,
        pictureUrl: safeImage,
        price: safePrice,
        currency: "USD",
        nights: 1,
        units: 1,
      });
      setIsFavorite(true);
      toast({ title: "تمت الإضافة إلى السلة", description: "تمت إضافة المخيم إلى سلتك بنجاح." });
    } catch (e: any) {
      toast({ title: "تعذر الإضافة إلى السلة", description: String(e?.message || e), variant: "destructive" });
    } finally {
      setHeartBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      dir="rtl"
    >
      <Card className="overflow-hidden shadow-nature-md hover:shadow-nature-lg transition-smooth group">
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={safeImage}
            alt={safeTitle}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = FALLBACK; }}
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
          />
          {/* <button
            onClick={handleHeartClick}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-smooth disabled:opacity-60"
            aria-label="إضافة إلى السلة"
            type="button"
            disabled={heartBusy}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground"} ${heartBusy ? "opacity-70" : ""}`}
            />
          </button> */}

          <button
  onClick={handleHeartClick}
  className="absolute top-4 left-4 p-0 bg-transparent hover:bg-transparent transition-smooth"
  aria-label="إضافة إلى السلة"
  type="button"
  disabled={heartBusy}
>
  <Heart className={`w-5 h-5 text-red-500 fill-red-500 ${heartBusy ? "opacity-70" : ""}`} />
</button>

          <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
            {formatUSD(safePrice)} / الليلة
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-2">{safeTitle}</h3>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span>{computedLocation}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">{safeRating ? safeRating.toFixed(1) : "-"}</span>
              <span className="text-muted-foreground text-sm">(الآراء)</span>
            </div>

            <div className="flex items-center gap-2">
              {/* انتقل لصفحة التفاصيل */}
              <Button variant="secondary" size="sm" asChild>
                <Link to={`/camps/${id}`}>التفاصيل</Link>
              </Button>
              {/* <Button
                variant="default"
                size="sm"
                onClick={() => (onBookClick ? onBookClick(id) : null)}
                asChild={!onBookClick}
              >
                {onBookClick ? <span role="button">احجز الآن</span> : <Link to={`/booking/new?campId=${id}`}>احجز الآن</Link>}
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CampCard;

