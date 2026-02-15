import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SuccessStory {
  id: string;
  startup_name: string;
  structure_name: string;
  program_name: string;
  sector: string;
  description: string;
  result: string;
  founder_quote: string;
  founder_name: string;
  founder_role: string;
  sort_order: number;
}

const fallbackStories: SuccessStory[] = [
  {
    id: "fallback-1",
    startup_name: "Koulé Éducation",
    structure_name: "Orange Digital Center",
    program_name: "Orange Fab",
    sector: "EdTech",
    description: "Koulé Éducation a intégré le programme Orange Fab et a pu structurer son offre de formation en ligne pour les étudiants ivoiriens. En 9 mois, la startup a multiplié par 5 son nombre d'utilisateurs actifs.",
    result: "50 000 étudiants actifs",
    founder_quote: "L'accompagnement d'Orange Digital Center nous a permis de passer d'une idée à un produit utilisé dans tout le pays.",
    founder_name: "Mariam Bamba",
    founder_role: "Co-fondatrice",
    sort_order: 1,
  },
  {
    id: "fallback-2",
    startup_name: "Gnamakoudji Energy",
    structure_name: "Incub'Ivoire",
    program_name: "Green Start",
    sector: "CleanTech",
    description: "Accompagnée par Incub'Ivoire, Gnamakoudji Energy a développé une solution de micro-réseaux solaires pour les communautés rurales.",
    result: "3 villages électrifiés",
    founder_quote: "Le mentoring technique et business a été déterminant. Nous avons appris à structurer notre modèle économique.",
    founder_name: "Ibrahim Sanogo",
    founder_role: "Fondateur & CEO",
    sort_order: 2,
  },
  {
    id: "fallback-3",
    startup_name: "Wôrô Logistics",
    structure_name: "Seedstars Abidjan",
    program_name: "Seedstars Growth",
    sector: "Logistics",
    description: "Wôrô Logistics a bénéficié de l'accélération Seedstars pour optimiser sa plateforme de livraison du dernier kilomètre à Abidjan.",
    result: "+200 livreurs actifs",
    founder_quote: "Le réseau international de Seedstars nous a connectés avec des mentors et des clients que nous n'aurions jamais atteints seuls.",
    founder_name: "Yves Konan",
    founder_role: "CEO",
    sort_order: 3,
  },
];

export function useSuccessStories() {
  return useQuery({
    queryKey: ["success-stories"],
    queryFn: async (): Promise<SuccessStory[]> => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn("Falling back to static success stories", error);
        return fallbackStories;
      }

      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}
