import { CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { allNews } from "@/data/mockNews";

const recentNews = allNews.slice(0, 3);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

const NewsFeed = () => {
  return (
    <section className="py-16 bg-gray-50" id="actualites">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Actualités</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Restez informé des dernières nouvelles concernant le Label Startup et l'écosystème numérique ivoirien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentNews.map((news) => (
            <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                  <Link to="/actualites">
                    Lire la suite <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild className="bg-ivoire-orange hover:bg-ivoire-orange/90">
            <Link to="/actualites">
              Voir toutes les actualités <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsFeed;
