
import { type NewsItem } from "@/types/news";

export const allNews: NewsItem[] = [
  {
    id: "1",
    title: "Lancement de la 3ème cohorte du Label Startup",
    excerpt: "Le Ministère du Numérique annonce le lancement de la troisième cohorte du Label Startup, offrant de nouvelles opportunités aux startups innovantes de Côte d'Ivoire.",
    date: "2025-04-15",
    category: "Annonces",
    imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1374&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Atelier sur le financement des startups à Abidjan",
    excerpt: "Un atelier dédié aux stratégies de financement pour les startups labellisées se tiendra le mois prochain à Abidjan, avec la participation de plusieurs investisseurs internationaux.",
    date: "2025-04-10",
    category: "Événements",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Succès de la startup ivoirienne TechIvoire",
    excerpt: "TechIvoire, une startup labellisée en 2024, vient de lever 2 millions d'euros pour développer sa solution de paiement mobile innovante.",
    date: "2025-04-02",
    category: "Succès",
    imageUrl: "https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1471&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Partenariat entre le Label Startup et Orange Côte d'Ivoire",
    excerpt: "Un nouveau partenariat stratégique a été signé pour offrir des avantages exclusifs aux startups labellisées.",
    date: "2025-03-28",
    category: "Partenariats",
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Forum de l'innovation numérique à Yamoussoukro",
    excerpt: "Le premier forum dédié à l'innovation numérique en Côte d'Ivoire se tiendra à Yamoussoukro avec la participation des startups labellisées.",
    date: "2025-03-15",
    category: "Événements",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Formation sur la propriété intellectuelle pour les startups",
    excerpt: "Une série de formations sur la protection de la propriété intellectuelle sera proposée aux startups labellisées.",
    date: "2025-03-10",
    category: "Formations",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop"
  }
];

export const categories = ["Toutes", ...Array.from(new Set(allNews.map(item => item.category)))];
