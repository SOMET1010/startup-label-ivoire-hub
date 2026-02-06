
# Dashboard Investisseur

## Contexte

Le profil "Investisseur" est selectionnable a l'inscription (`Auth.tsx` - valeur `investisseur`) mais :
- L'enum `app_role` ne contient pas `investor` -- il n'y a que `admin`, `startup`, `evaluator`, `structure`
- Le trigger `handle_new_user` attribue le role `startup` par defaut aux investisseurs (branche `ELSE`)
- Aucun dashboard ni route dedie n'existe
- Le redirect post-connexion dans `Auth.tsx` ne gere pas le role investisseur
- La page publique `/investisseurs` et le composant `InvestorContactDialog` existent deja (ecriture dans `contact_messages`)

## Architecture de la solution

On suit exactement le pattern Structure : enum + table + trigger + Layout/Sidebar/Header + pages + hook + traductions.

---

## Etape 1 : Migration base de donnees

### 1a. Ajouter le role `investor` a l'enum `app_role`

```sql
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'investor';
```

### 1b. Creer la table `investors`

| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | Identifiant unique |
| user_id | uuid NOT NULL UNIQUE | Reference au proprietaire |
| name | text NOT NULL | Nom / raison sociale |
| description | text | Description / these d'investissement |
| type | text | Business Angel / VC / Corporate / Fonds public |
| investment_stages | text[] | Pre-seed, Seed, Series A... |
| ticket_min | bigint | Ticket minimum (FCFA) |
| ticket_max | bigint | Ticket maximum (FCFA) |
| target_sectors | text[] | Secteurs cibles |
| location | text | Localisation |
| website | text | Site web |
| logo_url | text | Logo |
| portfolio_count | int DEFAULT 0 | Nombre de startups en portefeuille |
| status | text DEFAULT 'active' | Statut |
| created_at / updated_at | timestamptz | Dates |

### 1c. RLS policies sur `investors`

- L'investisseur voit et modifie ses propres donnees (`user_id = auth.uid()`)
- Les admins voient tout (via `has_role()`)
- Les utilisateurs authentifies peuvent voir les investisseurs actifs (pour la page publique)

### 1d. Creer la table `investor_interests`

Table de liaison investisseur <-> startups labellisees qui l'interessent.

| Colonne | Type | Description |
|---|---|---|
| id | uuid PK | Identifiant unique |
| investor_id | uuid FK -> investors | Reference investisseur |
| startup_id | uuid FK -> startups | Reference startup |
| status | text DEFAULT 'interested' | interested / contacted / meeting / passed |
| notes | text | Notes privees |
| created_at | timestamptz | Date |

### 1e. Mettre a jour le trigger `handle_new_user`

Ajouter le cas `'investisseur'` (valeur envoyee depuis le formulaire Auth.tsx) :

```text
WHEN 'investisseur' THEN
  assigned_role := 'investor';
  INSERT INTO public.investors (user_id, name)
  VALUES (NEW.id, COALESCE(...organization_name, ...full_name, 'Mon fonds'));
```

---

## Etape 2 : Frontend Auth

### 2a. `AuthContext.tsx`
- Ajouter `'investor'` au type `UserRole`
- Ajouter `isInvestor` au contexte et a l'interface

### 2b. `Auth.tsx` -- Redirection post-connexion
- Ajouter `investor: "/investor"` dans le `redirectMap`

### 2c. `RoleGate.tsx`
- Ajouter `'investor'` au type `UserRole` (deja dynamique via AuthContext)

---

## Etape 3 : Layout et navigation

### 3a. `InvestorLayout.tsx` (calque de StructureLayout)
- SidebarProvider + InvestorSidebar + InvestorHeader

### 3b. `InvestorSidebar.tsx`

Elements de navigation :
- Tableau de bord (`/investor`)
- Startups labellisees (`/investor/startups`) -- catalogue des startups approuvees
- Mes interets (`/investor/interests`) -- startups marquees
- Messages (`/investor/messages`) -- messages de contact recus/envoyes via `contact_messages`
- Profil (`/investor/profil`)
- Parametres (`/investor/settings`)
- Retour a l'accueil

### 3c. `InvestorHeader.tsx`
- Fil d'ariane, menu utilisateur, notification bell (meme structure que StructureHeader)

---

## Etape 4 : Pages du dashboard

### 4a. Dashboard principal (`/investor`)

Contenu :
- Carte de bienvenue avec nom de l'investisseur
- KPIs : startups labellisees disponibles, startups marquees, messages recus, secteurs couverts
- Dernieres startups labellisees (apercu des plus recentes)
- Actions rapides

### 4b. Catalogue startups (`/investor/startups`)

- Grille de cartes des startups avec le statut `approved` (labellisees)
- Filtres par secteur, stade, taille d'equipe
- Bouton "Marquer mon interet" qui insere dans `investor_interests`
- Clic pour voir le detail

### 4c. Mes interets (`/investor/interests`)

- Liste des startups pour lesquelles l'investisseur a manifeste un interet
- Colonnes : Nom, Secteur, Statut (interesse / contacte / RDV / passe), Date
- Possibilite de changer le statut et d'ajouter des notes

### 4d. Messages (`/investor/messages`)

- Liste des messages envoyes/recus via `contact_messages` (filtres par sujet contenant "[Investisseur:]")
- Vue en lecture seule des echanges

### 4e. Profil investisseur (`/investor/profil`)

- Formulaire d'edition : nom, description, type, stades d'investissement, ticket min/max, secteurs cibles, site web, logo

### 4f. Parametres (`/investor/settings`)

- Reutilise les composants existants (theme, langue, notifications)

---

## Etape 5 : Hook et donnees

### `useInvestorData.ts`
- Charge les donnees de l'investisseur connecte depuis `investors`
- Charge les startups labellisees depuis `startups` JOIN `applications` (status = 'approved')
- Charge les interets depuis `investor_interests`
- Calcule les statistiques

---

## Fichiers impactes

| Fichier | Action | Description |
|---|---|---|
| Migration SQL | Creer | Enum + tables + RLS + trigger |
| `src/contexts/AuthContext.tsx` | Modifier | Ajouter role `investor` |
| `src/components/auth/RoleGate.tsx` | Modifier | Ajouter `investor` au type |
| `src/App.tsx` | Modifier | Routes `/investor/*` |
| `src/pages/Auth.tsx` | Modifier | Redirection par role |
| `src/components/investor/InvestorLayout.tsx` | Creer | Layout sidebar |
| `src/components/investor/InvestorSidebar.tsx` | Creer | Navigation laterale |
| `src/components/investor/InvestorHeader.tsx` | Creer | En-tete avec breadcrumb |
| `src/pages/investor/Dashboard.tsx` | Creer | Tableau de bord principal |
| `src/pages/investor/Startups.tsx` | Creer | Catalogue startups labellisees |
| `src/pages/investor/Interests.tsx` | Creer | Suivi des interets |
| `src/pages/investor/Messages.tsx` | Creer | Messages de contact |
| `src/pages/investor/Profile.tsx` | Creer | Profil investisseur |
| `src/pages/investor/Settings.tsx` | Creer | Parametres |
| `src/hooks/useInvestorData.ts` | Creer | Hook donnees investisseur |
| `src/i18n/locales/fr/dashboard.json` | Modifier | Traductions FR section `investor` |
| `src/i18n/locales/en/dashboard.json` | Modifier | Traductions EN section `investor` |

---

## Securite

- RLS strictes : les investisseurs ne voient que leurs propres donnees privees et les startups publiques labellisees
- Le role `investor` est stocke dans `user_roles` (table separee, jamais dans `profiles`)
- La fonction `has_role()` existante (SECURITY DEFINER) est reutilisee pour les policies
- `RoleGate` protege les routes cote frontend
- Les admins conservent un acces total
- La table `investor_interests` n'est lisible que par l'investisseur proprietaire et les admins

## Considerations

- Les utilisateurs qui se sont deja inscrits en tant qu'investisseur ont actuellement le role `startup` : une correction manuelle sera necessaire via requete SQL
- La page publique `/investisseurs` reste accessible a tous (non-authentifies inclus) et ne change pas
