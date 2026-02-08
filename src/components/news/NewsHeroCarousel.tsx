import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroNewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl?: string;
  image?: string;
  isLive?: boolean;
}

interface NewsHeroCarouselProps {
  news: HeroNewsItem[];
}

const NewsHeroCarousel = ({ news }: NewsHeroCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const items = news.slice(0, 3);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-play
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next, items.length]);

  if (items.length === 0) {
    return (
      <section className="bg-gradient-to-r from-ci-orange to-ci-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Actualités</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Restez informé des dernières nouvelles concernant le Label Startup
          </p>
        </div>
      </section>
    );
  }

  const getImageUrl = (item: HeroNewsItem) => item.imageUrl || item.image;

  return (
    <section
      className="relative h-[420px] md:h-[480px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Geometric pattern overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <AnimatePresence mode="wait">
        {items.map(
          (item, index) =>
            index === current && (
              <motion.div
                key={item.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Background image */}
                {getImageUrl(item) ? (
                  <img
                    src={getImageUrl(item)}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-ci-orange via-ci-green/80 to-ci-orange/60" />
                )}

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-[2]" />

                {/* Content */}
                <div className="relative z-[3] h-full flex items-end">
                  <div className="container mx-auto px-4 pb-14 md:pb-16">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="max-w-2xl space-y-4"
                    >
                      <Badge className="bg-ci-orange/90 text-white border-none text-sm px-3 py-1">
                        {item.category}
                      </Badge>
                      <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight line-clamp-2">
                        {item.title}
                      </h2>
                      <p className="text-white/80 text-sm md:text-base line-clamp-2 max-w-xl">
                        {item.excerpt}
                      </p>
                      <Button
                        asChild
                        className="bg-white text-foreground hover:bg-white/90 font-semibold"
                      >
                        <Link to={`/actualites/${item.id}`}>
                          Lire l'article →
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[4] bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 transition-all"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[4] bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 transition-all"
            aria-label="Slide suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[4] flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Aller au slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewsHeroCarousel;
