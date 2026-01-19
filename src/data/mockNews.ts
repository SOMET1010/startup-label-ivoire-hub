import { type NewsItem } from "@/types/news";
import startupCohorteImg from "@/assets/news/startup-cohorte.jpg";
import atelierFinancementImg from "@/assets/news/atelier-financement.jpg";
import succesStartupImg from "@/assets/news/succes-startup.jpg";
import partenariatOrangeImg from "@/assets/news/partenariat-orange.jpg";
import forumInnovationImg from "@/assets/news/forum-innovation.jpg";
import formationProprieteImg from "@/assets/news/formation-propriete.jpg";

export const allNews: NewsItem[] = [
  {
    id: "1",
    title: "Lancement de la 3ème cohorte du Label Startup",
    excerpt: "Le Ministère du Numérique annonce le lancement de la troisième cohorte du Label Startup, offrant de nouvelles opportunités aux startups innovantes de Côte d'Ivoire.",
    date: "2025-04-15",
    category: "Annonces",
    imageUrl: startupCohorteImg
  },
  {
    id: "2",
    title: "Atelier sur le financement des startups à Abidjan",
    excerpt: "Un atelier dédié aux stratégies de financement pour les startups labellisées se tiendra le mois prochain à Abidjan, avec la participation de plusieurs investisseurs internationaux.",
    date: "2025-04-10",
    category: "Événements",
    imageUrl: atelierFinancementImg
  },
  {
    id: "3",
    title: "Succès de la startup ivoirienne TechIvoire",
    excerpt: "TechIvoire, une startup labellisée en 2024, vient de lever 2 millions d'euros pour développer sa solution de paiement mobile innovante.",
    date: "2025-04-02",
    category: "Succès",
    imageUrl: succesStartupImg
  },
  {
    id: "4",
    title: "Partenariat entre le Label Startup et Orange Côte d'Ivoire",
    excerpt: "Un nouveau partenariat stratégique a été signé pour offrir des avantages exclusifs aux startups labellisées.",
    date: "2025-03-28",
    category: "Partenariats",
    imageUrl: partenariatOrangeImg
  },
  {
    id: "5",
    title: "Forum de l'innovation numérique à Yamoussoukro",
    excerpt: "Le premier forum dédié à l'innovation numérique en Côte d'Ivoire se tiendra à Yamoussoukro avec la participation des startups labellisées.",
    date: "2025-03-15",
    category: "Événements",
    imageUrl: forumInnovationImg
  },
  {
    id: "6",
    title: "Formation sur la propriété intellectuelle pour les startups",
    excerpt: "Une série de formations sur la protection de la propriété intellectuelle sera proposée aux startups labellisées.",
    date: "2025-03-10",
    category: "Formations",
    imageUrl: formationProprieteImg
  }
];

export const categories = ["Toutes", ...Array.from(new Set(allNews.map(item => item.category)))];
