import { 
  Shield, 
  Building2, 
  TrendingUp, 
  Users, 
  Coins, 
  Rocket,
  type LucideIcon 
} from "lucide-react";

export interface Advantage {
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Liste unifiée des 6 avantages du Label Startup
 * Utilisé dans Hero, AdvantagesSection, et page /avantages
 */
export const ADVANTAGES: Advantage[] = [
  {
    title: "Exonérations fiscales",
    description: "Bénéficiez d'exonérations d'impôts sur les bénéfices et de la contribution des patentes pendant 5 ans.",
    icon: Coins,
  },
  {
    title: "Accès aux marchés publics",
    description: "Participez aux appels d'offres publics avec des conditions préférentielles pour les startups labellisées.",
    icon: Building2,
  },
  {
    title: "Financement facilité",
    description: "Accédez plus facilement aux financements publics et privés grâce à la reconnaissance officielle.",
    icon: TrendingUp,
  },
  {
    title: "Accompagnement personnalisé",
    description: "Profitez d'un suivi régulier et de conseils d'experts pour accélérer votre croissance.",
    icon: Users,
  },
  {
    title: "Visibilité nationale",
    description: "Augmentez votre visibilité auprès des partenaires et investisseurs grâce au label officiel.",
    icon: Shield,
  },
  {
    title: "Réseau d'innovateurs",
    description: "Rejoignez une communauté dynamique d'entrepreneurs innovants pour collaborer et grandir.",
    icon: Rocket,
  },
];

/**
 * Mini-stats affichées dans le Hero
 * Cohérentes avec la table platform_stats (FCFA)
 */
export const HERO_STATS = [
  { value: "500+", label: "Startups actives" },
  { value: "50+", label: "Labellisées" },
  { value: "10 Mds", label: "FCFA investis" },
] as const;

/**
 * Points de confiance affichés dans le CTA final
 */
export const TRUST_INDICATORS = [
  { label: "Processus 100% en ligne", key: "online" },
  { label: "Réponse sous 30 jours", key: "response" },
  { label: "Accompagnement gratuit", key: "free" },
] as const;
