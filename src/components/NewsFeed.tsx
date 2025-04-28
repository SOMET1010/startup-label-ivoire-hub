
import { CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl?: string;
}

const recentNews: NewsItem[] = [
  {
    id: "1",
    title: "Lancement de la 3ème cohorte du Label Startup",
    excerpt: "Le Ministère du Numérique annonce le lancement de la troisième cohorte du Label Startup, offrant de nouvelles opportunités aux startups innovantes de Côte d'Ivoire.",
    date: "2025-04-15",
    category: "Annonces",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Atelier sur le financement des startups à Abidjan",
    excerpt: "Un atelier dédié aux stratégies de financement pour les startups labellisées se tiendra le mois prochain à Abidjan, avec la participation de plusieurs investisseurs internationaux.",
    date: "2025-04-10",
    category: "Événements",
    imageUrl: "https://images.unsplash.com/photo-1560523160-754a9e25c68f?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Succès de la startup ivoirienne TechIvoire",
    excerpt: "TechIvoire, une startup labellisée en 2024, vient de lever 2 millions d'euros pour développer sa solution de paiement mobile innovante.",
    date: "2025-04-02",
    category: "Succès",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop"
  }
];

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
