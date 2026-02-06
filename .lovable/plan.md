
# Interface d'administration pour le contenu institutionnel

## Objectif

Ajouter trois nouveaux onglets au dashboard admin existant (`/admin`) pour permettre la gestion du contenu institutionnel directement depuis l'interface :

1. **Parametres** : modifier le nom du ministere, les contacts, l'email, etc.
2. **Documents juridiques** : ajouter/modifier/supprimer les lois, decrets et arretes (avec upload de PDF vers le storage)
3. **Comite** : ajouter/modifier/supprimer les membres du comite de labellisation (avec upload de photos)

## Architecture

Le dashboard admin actuel (`src/pages/admin/Dashboard.tsx`) est deja un fichier volumineux (~1565 lignes). Pour garder le code maintenable, chaque section d'administration sera implementee dans un **composant dedie** sous `src/components/admin/`, suivant le pattern existant (`VotingStatsDashboard`, `ApplicationFilters`, etc.).

Les trois nouveaux composants seront simplement ajoutes comme onglets supplementaires dans le `TabsList` du dashboard.

---

## Composants a creer

### 1. `AdminPlatformSettings.tsx`

Formulaire d'edition des parametres de la plateforme :

- Charge les donnees depuis `platform_settings` via `usePlatformSettings`
- Affiche un formulaire avec les champs editables :
  - Nom du ministere
  - Acronyme
  - Titre du ministre
  - Adresse
  - Telephone
  - Email du ministere
  - Site web du ministere
  - Nom de la plateforme
  - Email de la plateforme
- Bouton "Enregistrer" qui fait un `upsert` sur chaque cle dans `platform_settings`
- Invalidation du cache React Query apres sauvegarde pour que les changements se propagent immediatement dans toute l'app (Footer, Mentions Legales, etc.)

### 2. `AdminLegalDocuments.tsx`

Interface CRUD pour les documents juridiques :

- **Liste** : tableau avec titre, type (loi/decret/arrete/circulaire), numero officiel, date, statut actif/inactif, actions
- **Ajout/Edition** : dialog avec formulaire :
  - Titre (obligatoire)
  - Description
  - Type de document (select : loi, decret, arrete, circulaire)
  - Numero officiel
  - Date de publication (date picker)
  - Upload PDF (vers le bucket `legal-documents`)
  - OU URL externe
  - Ordre d'affichage
  - Actif/inactif (switch)
- **Suppression** : confirmation avant suppression (supprime aussi le fichier du storage si existe)
- Upload de PDF via l'API Storage de la base de donnees

### 3. `AdminCommitteeMembers.tsx`

Interface CRUD pour les membres du comite :

- **Liste** : grille de cartes avec photo, nom, role, organisation, actions
- **Ajout/Edition** : dialog avec formulaire :
  - Nom complet (obligatoire)
  - Titre/fonction
  - Organisation
  - Role dans le comite (select : president, vice-president, secretaire, membre)
  - Biographie
  - Upload photo (vers le bucket `committee-photos`)
  - Ordre d'affichage
  - Actif/inactif (switch)
- **Suppression** : confirmation avant suppression

---

## Modifications du dashboard admin

Le fichier `src/pages/admin/Dashboard.tsx` sera modifie pour :

1. Ajouter 3 nouveaux `TabsTrigger` dans le `TabsList` :
   - "Parametres" (icone Settings)
   - "Documents" (icone FileText)
   - "Comite" (icone Users)

2. Ajouter les 3 `TabsContent` correspondants, chacun rendant son composant dedie

3. Les nouveaux onglets ne seront visibles que pour les admins (pas les evaluateurs) -- verification via `useAuth().isAdmin`

---

## Fichiers impactes

| Fichier | Action | Description |
|---|---|---|
| `src/components/admin/AdminPlatformSettings.tsx` | Creer | Formulaire des parametres |
| `src/components/admin/AdminLegalDocuments.tsx` | Creer | CRUD documents juridiques avec upload PDF |
| `src/components/admin/AdminCommitteeMembers.tsx` | Creer | CRUD membres du comite avec upload photo |
| `src/pages/admin/Dashboard.tsx` | Modifier | Ajouter 3 onglets + imports |

Aucune migration base de donnees necessaire -- les tables `platform_settings`, `legal_documents`, `committee_members` et les buckets storage (`legal-documents`, `committee-photos`) existent deja avec les bonnes politiques RLS.

---

## Detail technique

### Upload de fichiers

Les uploads utilisent directement le SDK de la base de donnees :

```text
supabase.storage
  .from('legal-documents')
  .upload(`documents/${timestamp}_${filename}`, file)
```

Apres upload, l'URL publique est recuperee via `getPublicUrl()` et stockee dans la colonne `file_url` ou `photo_url`.

Lors de la suppression d'un enregistrement, le fichier associe dans le storage est aussi supprime.

### Invalidation du cache

Apres chaque operation CRUD, les cles React Query correspondantes sont invalidees :
- `["platform-settings"]` pour les parametres
- `["legal-documents"]` pour les documents juridiques
- `["committee-members"]` pour les membres du comite

Cela garantit que les pages publiques (`/cadre-juridique`, `/comite`, Footer) refletent immediatement les changements.

### Securite

- Toutes les operations d'ecriture sont protegees par les RLS existantes (admin uniquement)
- Les onglets d'administration ne sont affiches qu'aux utilisateurs ayant le role `admin`
- Les uploads vers les buckets storage sont proteges par les policies existantes
- Le composant `RoleGate` dans `App.tsx` bloque deja l'acces au dashboard pour les non-autorises
