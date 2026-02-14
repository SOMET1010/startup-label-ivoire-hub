

# Plan de Nettoyage Anti-Vibecoding -- Phase 0 a 6

Ce plan est structure en phases sequentielles. Chaque phase sera validee (compilation + verification) avant de passer a la suivante.

---

## PHASE 0 -- INVENTAIRE (resultats de l'audit)

### Fichiers morts (jamais importes nulle part)

| Fichier | Raison |
|---------|--------|
| `src/components/NewsFeed.tsx` | Importe nulle part (commente dans Index.tsx) |
| `src/components/ComparisonTable.tsx` | Importe nulle part |
| `src/components/BrandSwitcher.tsx` | Importe nulle part |
| `src/components/news/NewsCard.tsx` | Utilise uniquement par NewsGrid.tsx (lui-meme mort) |
| `src/components/news/NewsGrid.tsx` | Importe nulle part dans les pages |
| `src/components/news/NewsHero.tsx` | Importe nulle part |
| `src/components/news/NewsFilters.tsx` | Importe nulle part |
| `src/components/admin/AdminKPIs.tsx` | Importe nulle part (remplace par EnhancedKPICards) |
| `src/hooks/useEvaluation.ts` | Importe nulle part |
| `src/hooks/useNewsFilter.ts` | Importe nulle part |
| `src/pages/TestPush.tsx` | Page de test, commentaire "a supprimer en production" |
| `src/components/ui/use-toast.ts` | Re-export inutile (tout le monde importe directement depuis hooks) |

### Route cassee

- `ActualiteDetail` est lazy-loaded dans App.tsx mais **aucune route ne le reference**. Les liens `/actualites/:id` dans `NewsCardLive` et `NewsHeroCarousel` menent vers une 404.

### Anti-patterns detectes

- **Fichier geant** : `src/pages/admin/Dashboard.tsx` = **1585 lignes** (devrait etre 200-300 max)
- **Fichier geant** : `src/pages/Postuler.tsx` = **1382 lignes**
- **Fichier geant** : `src/pages/startup/Profile.tsx` = **763 lignes**
- **Fichier geant** : `src/pages/SuiviCandidature.tsx` = **564 lignes**
- **279 occurrences de `: any`** dans 29 fichiers
- **25 occurrences de `console.log`** dans 4 fichiers (hors console.error)
- **Duplication news components** : paires `NewsCard`/`NewsCardLive`, `NewsGrid`/`NewsGridLive`, `NewsFilters`/`NewsFiltersLive` -- seules les variantes `*Live` sont utilisees
- **Toast double import pattern** : `use-toast.ts` dans `/components/ui/` est un re-export inutile de `/hooks/use-toast.ts`
- **ThemeToggle importe dans Profile.tsx** (startup) sans rapport avec le profil

### Composants similaires non unifies

- `investor/` vs `investors/` : deux dossiers pour le meme domaine
- 3 layouts quasi identiques : `StartupLayout`, `StructureLayout`, `InvestorLayout`
- 3 headers quasi identiques : `StartupHeader`, `StructureHeader`, `InvestorHeader`
- 3 sidebars quasi identiques : `StartupSidebar`, `StructureSidebar`, `InvestorSidebar`

---

## PHASE 1 -- NETTOYAGE (suppressions et corrections)

### 1A. Supprimer les fichiers morts

Fichiers a supprimer :
- `src/components/NewsFeed.tsx`
- `src/components/ComparisonTable.tsx`
- `src/components/BrandSwitcher.tsx`
- `src/components/news/NewsCard.tsx`
- `src/components/news/NewsGrid.tsx`
- `src/components/news/NewsHero.tsx`
- `src/components/news/NewsFilters.tsx`
- `src/components/admin/AdminKPIs.tsx`
- `src/hooks/useEvaluation.ts`
- `src/hooks/useNewsFilter.ts`
- `src/components/ui/use-toast.ts`

### 1B. Supprimer TestPush (page de dev)

- Supprimer `src/pages/TestPush.tsx`
- Retirer le lazy import et la route `/test-push` de `App.tsx`

### 1C. Corriger la route cassee ActualiteDetail

- Ajouter dans App.tsx : `<Route path="/actualites/:id" element={<ActualiteDetail />} />`

### 1D. Nettoyer console.log

- Supprimer les `console.log` dans :
  - `src/hooks/useEvaluationComments.ts`
  - `src/pages/SuiviCandidature.tsx`
  - `src/components/admin/RequestDocumentDialog.tsx`
- Conserver les `console.error` (utiles pour le debug)

### 1E. Renommer les composants Live

Puisque les variantes non-Live sont mortes, renommer pour clarte :
- `NewsCardLive.tsx` -> garder tel quel (les imports changeraient trop)
- Alternative : supprimer les morts et ne rien renommer, ce qui est plus sur

---

## PHASE 2 -- CORRECTIONS DE TYPAGE

### 2A. Priorite haute -- Hooks avec `: any`

Typer correctement les fichiers suivants :
- `src/hooks/useAuditLogs.ts` : 8 occurrences de `: any` -- creer des interfaces `AuditLog`, `AuditLogEntry`
- `src/hooks/useSecureDocument.ts` : typer les blocs `catch (err: any)` avec `catch (err: unknown)` + type guard
- `src/hooks/useStructureData.ts` : typer le champ `programs: any` avec une interface `Program`

### 2B. Priorite moyenne -- Composants avec `: any`

- `src/components/evaluation/EvaluationList.tsx` : `catch (error: any)` -> `catch (error: unknown)`
- `src/components/admin/DocumentViewer.tsx` : idem
- `src/components/admin/AdminLegalDocuments.tsx` : idem
- `src/components/admin/RequestDocumentDialog.tsx` : idem
- `src/components/dashboard/MissingDocumentsAlert.tsx` : idem

### 2C. Pattern standard pour les catch blocks

Remplacer tout `catch (error: any)` par :
```typescript
catch (error: unknown) {
  const message = error instanceof Error ? error.message : "Erreur inconnue";
  // ...
}
```

---

## PHASE 3 -- DECOUPE DES FICHIERS GEANTS

### 3A. `admin/Dashboard.tsx` (1585 lignes -> ~200 lignes)

Extraire en sous-composants :
- `admin/ApplicationsTab.tsx` -- gestion des candidatures (table, filtres, actions)
- `admin/ApplicationDetailDialog.tsx` -- modale detail candidature
- `admin/ApplicationStatusActions.tsx` -- actions sur le statut
- `admin/useAdminDashboard.ts` -- hook avec toute la logique de fetch/state
- Le Dashboard.tsx ne gardera que le shell Tabs + imports

### 3B. `Postuler.tsx` (1382 lignes -> ~200 lignes)

Extraire :
- `forms/ApplicationFormSchema.ts` -- schemas zod
- `forms/ApplicationStep1.tsx` -- info entreprise
- `forms/ApplicationStep2.tsx` -- info equipe
- `forms/ApplicationStep3.tsx` -- documents
- `forms/ApplicationStep4.tsx` -- validation/soumission
- `hooks/useApplicationForm.ts` -- logique de soumission

### 3C. `startup/Profile.tsx` (763 lignes -> ~200 lignes)

Extraire :
- `startup/ProfileForm.tsx` -- formulaire profil
- `startup/ProfileDocuments.tsx` -- section documents
- `startup/useStartupProfile.ts` -- hook logique

### 3D. `SuiviCandidature.tsx` (564 lignes -> ~200 lignes)

Extraire :
- `suivi/ApplicationTracker.tsx` -- composant principal
- `suivi/ApplicationDetails.tsx` -- details candidature
- `hooks/useApplicationTracking.ts` -- logique realtime

---

## PHASE 4 -- UNIFICATION DES LAYOUTS

### 4A. Layout generique role-based

Creer un `shared/DashboardLayout.tsx` parametrique qui remplace les 3 layouts presque identiques :
```typescript
interface DashboardLayoutProps {
  role: 'startup' | 'structure' | 'investor';
  children: React.ReactNode;
}
```

Les Layout/Header/Sidebar specifiques restent mais heritent du generique pour reduire la duplication.

### 4B. Fusionner `investors/` dans `investor/`

Deplacer `InvestorContactDialog.tsx` et `InvestorSuccessStories.tsx` de `components/investors/` vers `components/investor/` et supprimer le dossier `investors/`.

---

## PHASE 5 -- STANDARDISATION DES ERREURS

### 5A. Pattern unifie d'erreur

Creer `shared/lib/errorHandler.ts` :
```typescript
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Une erreur inattendue s'est produite";
}
```

Remplacer tous les patterns ad-hoc de gestion d'erreur par cet utilitaire.

### 5B. Unifier les imports toast

Standardiser sur `import { toast } from "@/hooks/use-toast"` partout (certains fichiers utilisent `useToast` hook, d'autres le `toast` direct -- choisir un seul pattern).

---

## PHASE 6 -- VERIFICATION FINALE

### 6A. Checklist de non-regression

1. Page d'accueil charge correctement
2. Authentification login/signup fonctionne
3. `/actualites` + `/actualites/:id` fonctionnent
4. Dashboard admin charge (onglets Candidatures, Evaluations, Votes, Parametres)
5. Dashboard startup charge
6. Formulaire de candidature (`/postuler`) charge et sauvegarde le brouillon
7. Suivi candidature (`/suivi-candidature`) charge
8. Pages legales (`/cgu`, `/mentions-legales`, etc.) chargent
9. Newsletter inscription fonctionne (apres la politique RLS recente)
10. Navigation mobile (menu hamburger) fonctionne

### 6B. TODO final

**P0 (critique)** :
- Ajouter la route `/actualites/:id` (PHASE 1C)
- Supprimer le code mort (PHASE 1A-1B)

**P1 (important)** :
- Decouper admin/Dashboard.tsx et Postuler.tsx (PHASE 3A-3B)
- Typer les `: any` (PHASE 2)
- Nettoyer les console.log (PHASE 1D)

**P2 (amelioration)** :
- Unifier les layouts (PHASE 4)
- Renommer/fusionner les dossiers investors (PHASE 4B)
- Standardiser la gestion d'erreurs (PHASE 5)
- Ajouter des smoke tests vitest (routes principales)

---

## Risques et mitigations

| Risque | Mitigation |
|--------|------------|
| Suppression d'un fichier encore utilise | Chaque fichier a ete verifie par recherche d'imports dans tout le projet |
| Regression sur admin Dashboard apres decoupe | Extraire sans changer la logique, tester chaque onglet |
| Imports casses apres deplacement de fichiers | Utiliser les alias `@/` et verifier la compilation apres chaque phase |
| Route ActualiteDetail ajoutee mais page bugguee | La page existe deja et fonctionne, il manque juste la route |

---

## Approche d'implementation

- **Phase 1** en premier (nettoyage + fix route) -- impact immediat, risque faible
- **Phase 2** ensuite (typage) -- ameliore la maintenabilite
- **Phase 3** apres (decoupe) -- le plus gros du travail
- **Phases 4-5-6** en dernier -- optimisations et polish

Chaque phase sera implementee et verifiee avant de passer a la suivante. La Phase 1 sera faite dans le premier message d'implementation.

