/**
 * Configuration centralisée de la navigation
 * Utilisé dans Navbar et Footer
 */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Accueil", href: "/" },
  { 
    label: "Labellisation", 
    href: "#",
    children: [
      { label: "Critères", href: "/criteres" },
      { label: "Postuler", href: "/postuler" },
    ]
  },
  { label: "Annuaire", href: "/annuaire" },
  { label: "Actualités", href: "/actualites" },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { label: "Accompagnement", href: "/accompagnement" },
  { label: "Entreprises IA", href: "/entreprises-ia" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_LINKS = {
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "CGU", href: "/cgu" },
  ],
  resources: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Actualités", href: "/actualites" },
  ],
} as const;
