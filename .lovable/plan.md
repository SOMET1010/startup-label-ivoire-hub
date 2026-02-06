
# Dashboard Structure d'Accompagnement

## Contexte

Le profil "Structure d'accompagnement" est selectionnable a l'inscription (Auth.tsx) mais n'a aucune infrastructure backend ni frontend dediee. Actuellement :

- L'enum `app_role` ne contient que `admin`, `startup`, `evaluator` -- pas de role `structure`
- Le trigger `handle_new_user` attribue systematiquement le role `startup` a chaque nouvel inscrit, quel que soit le profil choisi
- Aucune table, aucun dashboard, aucune route n'existe pour ce profil
- Le `AuthContext` ne reconnait que 4 roles : `admin`, `startup`, `evaluator`, `public`

## Architecture de la solution

La solution suit exactement le pattern existant du workspace Startup (StartupLayout + StartupSidebar + StartupHeader + pages sous /startup/*), adapte au profil Structure d'accompagnement.

### Etape 1 : Migration base de donnees

**1a. Ajouter le role `structure` a l'enum `app_role`**

```sql
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'structure';
```

**1b. Creer la table `structures`** (equivalent de `startups` pour les structures d'accompagnement)

| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | Identifiant unique |
| user_id | uuid NOT NULL | Reference au proprietaire |
| name | text NOT NULL | Nom de la structure |
| description | text | Description |
| type | text | Incubateur / Accelerateur / Studio |
| focus_sectors | text[] | Secteurs couverts |
| location | text | Localisation |
| website | text | Site web |
| logo_url | text | Logo |
| programs | jsonb | Programmes proposes |
| status | text DEFAULT 'active' | Statut |
| created_at / updated_at | timestamptz | Dates |

**1c. RLS policies sur `structures`**

- Les structures voient et modifient leurs propres donnees
- Les admins voient tout
- Les startups avec un label approuve peuvent voir les structures actives (pour la page Accompagnement)

**1d. Creer la table `structure_startups`** (liaison structure <-> startups accompagnees)

| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | Identifiant unique |
| structure_id | uuid FK | Reference a `structures` |
| startup_id | uuid FK | Reference a `startups` |
| program_name | text | Nom du programme |
| status | text DEFAULT 'active' | actif / termine / en pause |
| started_at | timestamptz | Debut |
| ended_at | timestamptz | Fin |
| notes | text | Notes |

**1e. Mettre a jour le trigger `handle_new_user`**

Le trigger doit lire `raw_user_meta_data->>'user_profile'` pour attribuer le bon role :
- `'startup'` -> role `startup` (comportement actuel)
- `'structure'` -> role `structure` (nouveau)
- `'investisseur'` -> role `startup` pour l'instant (pas encore de role dedie)

### Etape 2 : Mettre a jour le frontend Auth

**2a. AuthContext.tsx**
- Ajouter `'structure'` au type `UserRole`
- Ajouter `isStructure` au contexte

**2b. App.tsx**
- Ajouter les routes `/structure/*` avec `ProtectedRoute` + `RoleGate` pour le role `structure`
- Creer un composant `StructureRoutes` similaire a `StartupRoutes`

**2c. Auth.tsx -- Redirection post-connexion**
- Apres connexion, rediriger vers `/structure` si le role est `structure`, vers `/startup` si `startup`, etc.

### Etape 3 : Layout et navigation

**3a. Creer `StructureLayout.tsx`** (calque de StartupLayout)
- SidebarProvider + StructureSidebar + StructureHeader

**3b. Creer `StructureSidebar.tsx`**

Elements de navigation :
- Tableau de bord (`/structure`)
- Startups accompagnees (`/structure/startups`)
- Programmes (`/structure/programmes`)
- Messages (`/structure/messages`)
- Profil (`/structure/profil`)
- Parametres (`/structure/settings`)
- Retour a l'accueil

**3c. Creer `StructureHeader.tsx`**
- Fil d'ariane, menu utilisateur, notification bell (meme structure que StartupHeader)

### Etape 4 : Pages du dashboard

**4a. Dashboard principal (`/structure`)** -- `src/pages/structure/Dashboard.tsx`

Contenu :
- Carte de bienvenue avec nom de la structure
- KPIs en grille : nombre de startups accompagnees, startups labellisees, programmes actifs, taux de reussite
- Liste des dernieres startups accompagnees (avec statut de labellisation)
- Actions rapides

**4b. Liste des startups accompagnees (`/structure/startups`)** -- `src/pages/structure/Startups.tsx`

- Tableau avec colonnes : Nom, Secteur, Statut candidature, Programme, Date debut
- Filtres par statut et par programme
- Clic pour voir le detail (en lecture seule)

**4c. Programmes (`/structure/programmes`)** -- `src/pages/structure/Programs.tsx`

- Liste des programmes de la structure
- Pour chaque programme : nombre de startups, duree, description
- Formulaire d'ajout/modification de programme

**4d. Profil structure (`/structure/profil`)** -- `src/pages/structure/Profile.tsx`

- Formulaire d'edition du profil de la structure (nom, description, type, secteurs, site web, logo)

**4e. Parametres (`/structure/settings`)** -- `src/pages/structure/Settings.tsx`

- Reutilise les composants de parametres existants (theme, langue, notifications)

### Etape 5 : Hook et donnees

**5a. Creer `useStructureData.ts`**
- Charge les donnees de la structure de l'utilisateur connecte
- Charge les startups accompagnees via `structure_startups` JOIN `startups` JOIN `applications`
- Calcule les statistiques (total, labellisees, en cours, etc.)

## Fichiers impactes

| Fichier | Action | Description |
|---|---|---|
| Migration SQL | Creer | Enum + tables + RLS + trigger |
| `src/contexts/AuthContext.tsx` | Modifier | Ajouter role `structure` |
| `src/App.tsx` | Modifier | Routes `/structure/*` |
| `src/pages/Auth.tsx` | Modifier | Redirection par role |
| `src/components/structure/StructureLayout.tsx` | Creer | Layout sidebar |
| `src/components/structure/StructureSidebar.tsx` | Creer | Navigation laterale |
| `src/components/structure/StructureHeader.tsx` | Creer | En-tete avec breadcrumb |
| `src/pages/structure/Dashboard.tsx` | Creer | Tableau de bord principal |
| `src/pages/structure/Startups.tsx` | Creer | Liste startups accompagnees |
| `src/pages/structure/Programs.tsx` | Creer | Gestion des programmes |
| `src/pages/structure/Profile.tsx` | Creer | Profil de la structure |
| `src/pages/structure/Settings.tsx` | Creer | Parametres utilisateur |
| `src/hooks/useStructureData.ts` | Creer | Hook donnees structure |
| `src/i18n/locales/fr/structure.json` | Creer | Traductions FR |
| `src/i18n/locales/en/structure.json` | Creer | Traductions EN |

## Securite

- RLS strictes : les structures ne voient que leurs propres donnees et les startups qu'elles accompagnent
- Le role `structure` est stocke dans `user_roles` (table separee, jamais dans `profiles`)
- La fonction `has_role()` existante (SECURITY DEFINER) est reutilisee pour les policies
- `RoleGate` protege les routes cote frontend
- Les admins conservent un acces total

## Considerations

- Les startups deja inscrites avec le mauvais role (celles qui ont choisi "structure" a l'inscription mais ont recu le role `startup`) devront etre corrigees manuellement par un admin ou via une requete SQL
- La table `structure_startups` permet aux admins d'assigner des startups a des structures. Une interface d'administration pour gerer ces liaisons pourra etre ajoutee dans un sprint ulterieur
