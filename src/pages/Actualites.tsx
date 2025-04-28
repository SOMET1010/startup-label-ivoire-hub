import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsHero from "@/components/news/NewsHero";
import NewsFilters from "@/components/news/NewsFilters";
import NewsGrid from "@/components/news/NewsGrid";
import { type NewsItem } from "@/types/news";

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

const Actualites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

  const filteredNews = allNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Toutes");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <NewsHero />
        <NewsFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        <NewsGrid news={filteredNews} onResetFilters={resetFilters} />
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;
