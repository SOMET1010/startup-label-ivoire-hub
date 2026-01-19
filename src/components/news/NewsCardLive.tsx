import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  sourceUrl?: string;
  isLive?: boolean;
  image?: string;
}

interface NewsCardLiveProps {
  news: NewsItem;
  index: number;
}

const NewsCardLive = ({ news, index }: NewsCardLiveProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Annonces': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'Événements': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'Succès': 'bg-green-500/10 text-green-600 border-green-500/20',
      'Partenariats': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      'Formations': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      'Investissements': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
        {/* Image or Gradient Placeholder */}
        <div className="relative h-48 overflow-hidden">
          {news.image ? (
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
            <Badge variant="outline" className={`${getCategoryColor(news.category)} backdrop-blur-sm`}>
              {news.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-ci-orange transition-colors">
            {news.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
            {news.excerpt}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(news.date)}</span>
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center">
          <Link
            to={`/actualites/${news.id}`}
            className="text-sm font-medium text-ci-orange hover:underline"
          >
            Lire plus →
          </Link>
          
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
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NewsCardLive;
