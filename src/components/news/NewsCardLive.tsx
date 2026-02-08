import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Zap, Clock, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import SocialShareButtons from "./SocialShareButtons";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  sourceUrl?: string;
  isLive?: boolean;
  image?: string;
  imageUrl?: string;
}

interface NewsCardLiveProps {
  news: NewsItem;
  index: number;
}

const NewsCardLive = ({ news, index }: NewsCardLiveProps) => {
  const [showShare, setShowShare] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getRelativeDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return null;
    }
  };

  const getReadingTime = (text: string) => {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Annonces: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
      Événements: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
      Succès: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
      Partenariats: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      Formations: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
      Investissements: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const imageUrl = news.imageUrl || news.image;
  const relativeDate = getRelativeDate(news.date);
  const readingTime = getReadingTime(news.excerpt);
  const shareUrl = `${window.location.origin}/actualites/${news.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border-border/50"
        onMouseEnter={() => setShowShare(true)}
        onMouseLeave={() => setShowShare(false)}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ci-orange/20 via-ci-green/10 to-ci-orange/5 flex items-center justify-center">
              <div className="text-6xl opacity-20">📰</div>
            </div>
          )}

          {/* Live Badge */}
          {news.isLive && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-500 text-white gap-1 shadow-lg">
                <Zap className="h-3 w-3" />
                En direct
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant="outline"
              className={`${getCategoryColor(news.category)} backdrop-blur-sm font-medium`}
            >
              {news.category}
            </Badge>
          </div>

          {/* Social share overlay */}
          {showShare && (
            <div className="absolute bottom-3 right-3 z-10">
              <SocialShareButtons url={shareUrl} title={news.title} />
            </div>
          )}
        </div>

        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-ci-orange transition-colors duration-200">
            {news.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
            {news.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{relativeDate || formatDate(news.date)}</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime} min de lecture</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center">
          <Link
            to={`/actualites/${news.id}`}
            className="text-sm font-medium text-ci-orange hover:underline"
          >
            Lire plus →
          </Link>

          <div className="flex items-center gap-2">
            {news.sourceUrl && (
              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Source
              </a>
            )}
            <button
              onClick={() => setShowShare(!showShare)}
              className="p-1 rounded-full hover:bg-muted transition-colors md:hidden"
              aria-label="Partager"
            >
              <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NewsCardLive;
