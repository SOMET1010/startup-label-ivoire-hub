
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type NewsItem } from "@/types/news";

interface NewsCardProps {
  news: NewsItem;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {news.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span>{formatDate(news.date)}</span>
          <span className="mx-2">•</span>
          <span className="text-ivoire-orange">{news.category}</span>
        </div>
        <CardTitle className="text-xl">{news.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{news.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="p-0 text-ivoire-green font-medium hover:text-ivoire-orange">
          <Link to={`/actualite/${news.id}`}>
            Lire l'article complet
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
