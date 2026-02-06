

# Corrections SEO, Breadcrumbs et Pages Legales

## Problemes detectes

Lors des tests end-to-end, 3 categories de problemes ont ete identifiees :

### 1. Lien CGU manquant dans le Footer
Le footer affiche les liens vers Mentions legales et Confidentialite, mais **pas vers CGU** alors que la page existe et fonctionne.

### 2. Cinq pages sans SEOHead ni Breadcrumb
Les pages suivantes n'ont pas ete mises a jour avec le composant `SEOHead` ni `PageBreadcrumb` :
- `/postuler` (Formulaire de candidature)
- `/eligibilite` (Quiz d'eligibilite)  
- `/annuaire` (Annuaire des startups)
- `/actualites/:id` (Detail d'un article)
- `/entreprises-ia/:id` (Detail d'une entreprise)

### 3. Meta tags statiques en doublon dans index.html
Le fichier `index.html` contient des meta tags OG et Twitter statiques (avec des valeurs par defaut lovable.dev) qui entrent en conflit avec les tags dynamiques injectes par `react-helmet-async`.

---

## Plan de corrections

### Etape 1 : Nettoyer index.html
- Supprimer les `<meta property="og:*">` et `<meta name="twitter:*">` statiques
- Conserver uniquement `<meta charset>`, `<meta viewport>`, `<title>` (fallback), et `<meta description>` (fallback)
- Cela permet a react-helmet-async de gerer exclusivement les tags OG/Twitter par page

### Etape 2 : Ajouter le lien CGU dans Footer.tsx
- Ajouter un `<Link to="/cgu">` dans la section "Informations" du footer, apres le lien Confidentialite

### Etape 3 : Ajouter SEOHead + Breadcrumb sur les pages manquantes

**Postuler.tsx** :
- Ajouter `SEOHead` avec titre "Postuler" et description adaptee
- Ajouter `PageBreadcrumb` avec route `/postuler`
- Ajouter `id="main-content"` si absent

**EligibiliteQuiz.tsx** :
- Ajouter `SEOHead` avec titre "Test d'eligibilite" et description
- Ajouter `PageBreadcrumb` avec route `/eligibilite`

**Annuaire.tsx** :
- Ajouter `SEOHead` avec titre "Annuaire des startups" et description
- Ajouter `PageBreadcrumb` avec route `/annuaire`

**ActualiteDetail.tsx** :
- Ajouter `SEOHead` avec titre dynamique basee sur `news.title`
- Ajouter `PageBreadcrumb` avec parent "Actualites" pointant vers `/actualites`
- Ajouter JSON-LD `articleJsonLd` avec les donnees de l'article

**EntrepriseIADetail.tsx** :
- Ajouter `SEOHead` avec titre dynamique basee sur `company.name`
- Ajouter `PageBreadcrumb` avec parent "Entreprises IA" pointant vers `/entreprises-ia`

---

## Section technique - Fichiers impactes

| Fichier | Modification |
|---|---|
| `index.html` | Supprimer les meta OG et Twitter statiques |
| `src/components/Footer.tsx` | Ajouter lien vers /cgu |
| `src/pages/Postuler.tsx` | Ajouter SEOHead + PageBreadcrumb |
| `src/pages/EligibiliteQuiz.tsx` | Ajouter SEOHead + PageBreadcrumb |
| `src/pages/Annuaire.tsx` | Ajouter SEOHead + PageBreadcrumb |
| `src/pages/ActualiteDetail.tsx` | Ajouter SEOHead + PageBreadcrumb + articleJsonLd |
| `src/pages/EntrepriseIADetail.tsx` | Ajouter SEOHead + PageBreadcrumb |
| `src/i18n/locales/fr/common.json` | Pas de modification (routes deja configurees) |

### Risques et considerations
- Aucun risque de regression : les composants SEOHead et PageBreadcrumb sont deja utilises sur 11 pages et sont stables
- Les pages de detail (articles, entreprises) utilisent des titres dynamiques ; il faut gerer le cas ou l'entite n'est pas trouvee (ne pas injecter de SEOHead dans ce cas)
- Le nettoyage de index.html est sans risque car react-helmet-async prend le relais pour toutes les pages

