

# Presentation interactive de la plateforme Ivoire Hub

## Objectif
Creer une page `/presentation` avec un diaporama interactif en plein ecran presentant la plateforme Label Startup Cote d'Ivoire. La presentation sera navigable avec les fleches du clavier et les boutons a l'ecran.

## Contenu des slides (12 slides)

1. **Page de titre** -- Logo, nom du projet, MTNI/ANSUT, version 2.0
2. **Contexte et cadre legal** -- Loi n 2023-901, acteurs institutionnels (MTNI, ANSUT, Comite, SAE)
3. **Vision et objectifs strategiques** -- Guichet unique, KPIs Annee 1 (200+ candidatures, 50+ labellisees, <30j decision)
4. **Portail public** -- 10 fonctionnalites (accueil, criteres, quiz, annuaire, actualites, FAQ, cartographie IA...)
5. **Espace Startup** -- 11 fonctionnalites (candidature multi-etapes, suivi, coach IA, notifications push, renouvellement...)
6. **Espace Evaluateur** -- 7 fonctionnalites (grille de notation /20, vote avec quorum, commentaires, synthese)
7. **Espace Administrateur** -- 10 fonctionnalites (KPIs temps reel, audit logs, gestion comite, securite)
8. **Espaces SAE et Investisseur** -- Structures d'accompagnement (4 fonctionnalites) + Investisseurs (5 fonctionnalites)
9. **Architecture technique** -- Stack (React/Vite, Tailwind, Lovable Cloud), schema BDD, Edge Functions
10. **Securite et conformite** -- RLS, JWT, HIBP, URLs signees, RGPD, WCAG 2.1 AA
11. **Planning et jalons** -- Timeline Jan-Juin 2026, sprints, recette, mise en production
12. **Merci / Contact** -- Coordonnees support, MTNI, ANSUT

## Implementation technique

### Fichiers a creer
- `src/pages/Presentation.tsx` -- Page principale avec le moteur de slides
- `src/components/presentation/SlideRenderer.tsx` -- Composant qui scale les slides a 1920x1080
- `src/components/presentation/slides/` -- Un composant par slide (TitleSlide, ContextSlide, etc.)
- `src/components/presentation/PresentationControls.tsx` -- Barre de navigation (precedent/suivant, numero, plein ecran)

### Fonctionnalites
- Navigation clavier (fleches gauche/droite, Espace, Echap)
- Boutons precedent/suivant avec indicateur de progression
- Mode plein ecran via l'API Fullscreen du navigateur
- Animations de transition entre slides avec Framer Motion
- Design institutionnel coherent avec les couleurs de la plateforme (vert/orange)
- Responsive : fonctionne sur desktop et tablette

### Integration
- Ajout de la route `/presentation` dans `App.tsx` (publique, lazy-loaded)
- Lien accessible depuis le footer ou la documentation

### Design des slides
- Fond avec gradient institutionnel
- Icones Lucide pour illustrer chaque section
- Tableaux et listes stylises pour les fonctionnalites
- Badges de statut "Livre" pour montrer l'avancement
- Armoiries / branding officiel CI

