
import { useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl?: string;
}

// Données simulées pour les actualités
const allNews: NewsItem[] = [
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
  },
  {
    id: "4",
    title: "Partenariat entre le Label Startup et Orange Côte d'Ivoire",
    excerpt: "Un nouveau partenariat stratégique a été signé pour offrir des avantages exclusifs aux startups labellisées.",
    date: "2025-03-28",
    category: "Partenariats",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Forum de l'innovation numérique à Yamoussoukro",
    excerpt: "Le premier forum dédié à l'innovation numérique en Côte d'Ivoire se tiendra à Yamoussoukro avec la participation des startups labellisées.",
    date: "2025-03-15",
    category: "Événements",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Formation sur la propriété intellectuelle pour les startups",
    excerpt: "Une série de formations sur la protection de la propriété intellectuelle sera proposée aux startups labellisées.",
    date: "2025-03-10",
    category: "Formations",
    imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1470&auto=format&fit=crop"
  }
];

// Liste des catégories d'actualités
const categories = ["Toutes", ...Array.from(new Set(allNews.map(item => item.category)))];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

const Actualites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

  const filteredNews = allNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-ivoire-orange to-ivoire-green text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Actualités</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Restez informé des dernières nouvelles concernant le Label Startup et l'écosystème numérique ivoirien
            </p>
          </div>
        </section>

        {/* Filtres et recherche */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher des actualités..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ivoire-orange focus:border-ivoire-orange"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === selectedCategory ? "default" : "outline"}
                    size="sm"
                    className={category === selectedCategory ? "bg-ivoire-orange hover:bg-ivoire-orange/90" : ""}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Liste des actualités */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((news) => (
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
                        <Link to={`/actualite/${news.id}`}>
                          Lire l'article complet
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-gray-600">Aucune actualité trouvée</h3>
                <p className="mt-2 text-gray-500">Essayez de modifier vos critères de recherche</p>
                <Button 
                  className="mt-4 bg-ivoire-orange hover:bg-ivoire-orange/90"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Toutes");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;
