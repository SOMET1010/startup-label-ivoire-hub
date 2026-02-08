
## Refonte UX/UI de la page Actualites

Transformation de la page `/actualites` en une experience editoriale dynamique et engageante, avec un Hero carousel immersif, des cartes enrichies, du partage social, des micro-interactions, et une section newsletter.

### 1. Hero Carousel immersif

Remplacement du header statique (gradient plat avec titre/sous-titre) par un carousel plein ecran mettant en avant les 3 articles les plus recents avec leurs images reelles.

- Utilisation du composant `Carousel` existant (embla-carousel-react deja installe)
- Chaque slide affiche : image en fond, badge categorie, titre, extrait tronque, bouton "Lire l'article"
- Overlay gradient sombre pour lisibilite du texte sur les images
- Indicateurs de navigation (dots) + boutons fleches
- Auto-play avec pause au survol
- Motifs geometriques en filigrane (CSS `background-image` avec pattern SVG subtil) sur l'overlay pour ajouter de la profondeur culturelle

### 2. Cartes (NewsCardLive) enrichies

Ameliorations des cartes d'actualites existantes :

- **Date relative** : Afficher "Publie il y a 3 jours" en plus de la date absolue, via `date-fns` (deja installe) avec `formatDistanceToNow`
- **Temps de lecture estime** : Calcul base sur la longueur de l'extrait (environ 200 mots/min), affiche avec une icone `Clock`
- **Badges categorie colores** : Les couleurs par categorie existent deja dans `getCategoryColor()` -- on les rendra plus visibles avec un fond opaque
- **Partage social** : Ajout d'icones WhatsApp, LinkedIn, X (Twitter) en overlay au survol de la carte, avec liens `share` pre-remplis
- **Micro-interactions ameliorees** : Zoom image plus prononce au hover, elevation de la carte avec ombre portee, transition sur le titre

### 3. Filtres "pill-shaped" modernises

Transformation des badges de filtre actuels en pills plus larges et contrastees :

- Forme `rounded-full` avec padding genereux (deja le cas)
- Etat actif : fond plein avec la couleur de la categorie (pas juste orange generique)
- Etat inactif : contour fin, fond transparent, hover avec teinte de la couleur
- Compteur de resultats par categorie entre parentheses

### 4. Section Newsletter

Ajout d'un bandeau entre la grille et la pagination :

- Fond gradient subtil (primary/secondary)
- Titre accrocheur : "Ne manquez rien de l'actu Tech CI"
- Champ email + bouton "S'inscrire"
- Stockage des inscriptions dans une nouvelle table `newsletter_subscribers` en base de donnees
- Validation email cote client

### 5. Dark mode

Le dark mode est deja entierement implemente dans le projet (via `next-themes`). Toutes les couleurs utilisent les CSS custom properties qui s'adaptent automatiquement. Aucun travail supplementaire necessaire -- on verifiera juste que les nouveaux elements (carousel overlay, newsletter banner) utilisent bien les variables semantiques.

---

### Details techniques

**Fichiers a creer :**

| Fichier | Description |
|---------|-------------|
| `src/components/news/NewsHeroCarousel.tsx` | Nouveau Hero avec carousel d'articles vedettes (remplace `NewsHero.tsx`) |
| `src/components/news/SocialShareButtons.tsx` | Composant reutilisable d'icones de partage (WhatsApp, LinkedIn, X) |
| `src/components/news/NewsletterBanner.tsx` | Bandeau d'inscription a la newsletter |

**Fichiers a modifier :**

| Fichier | Modifications |
|---------|---------------|
| `src/pages/Actualites.tsx` | Remplacer `NewsHero` par `NewsHeroCarousel`, ajouter `NewsletterBanner` |
| `src/components/news/NewsCardLive.tsx` | Ajouter date relative, temps de lecture, boutons de partage au hover |
| `src/components/news/NewsFiltersLive.tsx` | Pill-shaped plus contrastes avec compteurs par categorie |
| `src/types/news.ts` | Ajouter champ optionnel `readingTime` |

**Base de donnees :**

Une migration pour creer la table `newsletter_subscribers` :
```text
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  source TEXT DEFAULT 'actualites'
);

-- RLS : insertion publique, lecture admin uniquement
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );
```

**Dependances :** Aucune nouvelle -- `embla-carousel-react`, `date-fns`, `framer-motion`, `lucide-react` sont deja installes.
