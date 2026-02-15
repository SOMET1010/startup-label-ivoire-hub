
# Phase 3 -- Decoupe des fichiers geants

Objectif : reduire les 4 fichiers les plus gros du projet a ~200 lignes chacun en extrayant la logique et les sous-composants sans changer le comportement.

---

## 3A. admin/Dashboard.tsx (1585 lignes -> ~200 lignes)

### Fichiers a creer

**`src/hooks/useAdminDashboard.ts`** (~250 lignes)
Extraction de toute la logique d'etat et de fetch :
- Interfaces : `StartupDocuments`, `ApplicationWithStartup`, `UserWithRole`, `DocumentRequest`, `Stats`
- Constantes : `STATUS_LABELS`, `SECTOR_LABELS`, `STAGE_LABELS`
- Hook `useAdminDashboard()` contenant :
  - Tous les `useState` (applications, users, stats, filtres, dialogs, actions)
  - `fetchData()`, `filteredApplications` (useMemo), `resetFilters()`
  - `handleStatusChange()`, `handleRoleChange()`
  - `fetchDocumentRequests()`, `handleMarkAsFulfilled()`, `handleCancelDocumentRequest()`
  - `getScoreBadge()`, `openDetailsDialog()`, `openActionDialog()`, `openRoleDialog()`, `openDocumentRequestDialog()`
- Retourne tous les etats et handlers necessaires au rendu

**`src/components/admin/ApplicationsTab.tsx`** (~180 lignes)
Extraction de TabsContent "applications" (lignes 876-1070) :
- Table desktop + cards mobile
- Props : applications filtrees, handlers (openDetailsDialog, openActionDialog, openDocumentRequestDialog), loading, getScoreBadge, labels

**`src/components/admin/UsersTab.tsx`** (~80 lignes)
Extraction de TabsContent "users" (lignes 1088-1151) :
- Table des utilisateurs avec roles
- Props : users, loading, openRoleDialog

**`src/components/admin/ApplicationDetailDialog.tsx`** (~200 lignes)
Extraction du Dialog "details" (lignes 1172-1421) :
- Panel details (startup info, candidat, demandes de documents, voting, documents viewer)
- Panel chat (EvaluationChat)
- Props : selectedApplication, open, onOpenChange, documentRequests, handlers

**`src/components/admin/AdminDialogs.tsx`** (~150 lignes)
Extraction des 3 dialogs restants (lignes 1423-1580) :
- ActionDialog (approve/reject/review)
- RoleDialog (gestion roles)
- CancelDocumentRequestDialog
- Props : etats et handlers du hook

### Dashboard.tsx apres decoupe (~200 lignes)
- Import du hook `useAdminDashboard`
- Import des composants extraits
- Shell : Navbar, KPI Cards, DashboardOverview, Tabs avec les composants
- Tous les Dialogs via `AdminDialogs`

---

## 3B. Postuler.tsx (1382 lignes -> ~180 lignes)

### Fichiers a creer

**`src/components/forms/applicationFormSchema.ts`** (~80 lignes)
- Schema zod `startupFormSchema`
- Type `StartupFormData`
- Constantes : `LEGAL_STATUS`, `SECTORS`, `STAGES`, `STEPS`
- Helper `fileSchema()`

**`src/hooks/useApplicationForm.ts`** (~180 lignes)
- Hook contenant : useForm, draft management (resume/delete/watch/manual save), `uploadFile`, `handleSubmit`, `nextStep`, `prevStep`
- Etats : currentStep, isLoading, isUploading, showConfirmation, trackingId, showDraftBanner, draftLoaded

**`src/components/forms/ApplicationStep1.tsx`** (~170 lignes)
- Formulaire etape 1 : nom, statut juridique, RCCM, NIF, secteur, adresse, date, equipe, site web
- Props : form (UseFormReturn), onNext, onSave, isSaving

**`src/components/forms/ApplicationStep2.tsx`** (~120 lignes)
- Formulaire etape 2 : description, innovation, modele economique, potentiel, stade, fondateurs
- Props : form, onNext, onPrev, onSave, isSaving

**`src/components/forms/ApplicationStep3.tsx`** (~100 lignes)
- Formulaire etape 3 : 6 champs FileUploadField
- Props : form, onNext, onPrev

**`src/components/forms/ApplicationStep4.tsx`** (~180 lignes)
- Etape 4 : recapitulatif (onglets entreprise/projet/documents), checkbox terms, bouton soumission
- Props : form, formValues, onPrev, isLoading, isUploading

**`src/components/forms/ConfirmationDialog.tsx`** (~50 lignes)
- Dialog de confirmation avec tracking ID
- Props : open, trackingId

### Postuler.tsx apres decoupe (~180 lignes)
- Import du hook, des steps, du dialog
- Shell : SEOHead, Navbar, auth guards, progress bar, draft banner, steps conditionnels

---

## 3C. startup/Profile.tsx (763 lignes -> ~150 lignes)

### Fichiers a creer

**`src/components/startup/ProfileInfoTab.tsx`** (~250 lignes)
- Formulaire complet (nom, secteur, stade, description, site, equipe, adresse, innovation, modele economique)
- Props : form, isEditing, saving, onSubmit, onCancel

**`src/components/startup/ProfileDocumentsTab.tsx`** (~100 lignes)
- Liste des documents avec preview/download
- Props : documents, loadingDoc, onPreview, onDownload

**`src/components/startup/ProfileSettingsTab.tsx`** (~70 lignes)
- Toggle visibilite annuaire + ThemeToggle
- Props : form, onSubmit

**`src/hooks/useStartupProfile.ts`** (~100 lignes)
- Hook : fetchStartup, onSubmit, handleDocumentPreview, handleDocumentDownload
- Etats : startup, loading, saving, isEditing, loadingDoc

### Profile.tsx apres decoupe (~150 lignes)
- Import du hook et des 3 onglets
- Shell : Navbar, header, Tabs

---

## 3D. SuiviCandidature.tsx (564 lignes -> ~120 lignes)

### Fichiers a creer

**`src/hooks/useApplicationTracking.ts`** (~120 lignes)
- Hook : fetchApplications, realtime subscription, generateTrackingId
- Etats : applications, loading, selectedApp
- Interfaces : Application, Startup, Comment, ApplicationWithDetails

**`src/components/suivi/ApplicationsList.tsx`** (~50 lignes)
- Liste des candidatures (sidebar gauche)
- Props : applications, selectedApp, onSelect, generateTrackingId

**`src/components/suivi/ApplicationDetailPanel.tsx`** (~150 lignes)
- Panel droit : StatusActionCard, header, ProcessTimeline, onglets details/commentaires
- Props : selectedApp, generateTrackingId

### SuiviCandidature.tsx apres decoupe (~120 lignes)
- Import du hook et des composants
- Shell : Navbar, auth guards, layout grid

---

## Constantes partagees

Les constantes `SECTORS`, `STAGES`, `SECTOR_LABELS`, `STAGE_LABELS` sont dupliquees dans 4 fichiers. Elles seront centralisees dans un fichier existant :

**`src/lib/constants/startup.ts`** (nouveau)
```
export const SECTORS = [...]
export const STAGES = [...]
export const SECTOR_LABELS = {...}
export const STAGE_LABELS = {...}
```

Les 4 fichiers importeront depuis ce fichier unique.

---

## Ordre d'implementation

1. Creer `src/lib/constants/startup.ts` (constantes partagees)
2. Decoupe SuiviCandidature.tsx (le plus petit, risque minimal)
3. Decoupe startup/Profile.tsx
4. Decoupe Postuler.tsx
5. Decoupe admin/Dashboard.tsx (le plus gros, en dernier)
6. Mise a jour de `.lovable/plan.md`

## Risques et mitigations

| Risque | Mitigation |
|--------|------------|
| Props drilling excessif apres extraction | Les hooks encapsulent l'etat, les composants recoivent uniquement ce dont ils ont besoin |
| Circular imports entre hook et composants | Le hook ne depend jamais des composants, seulement l'inverse |
| Regression sur les dialogs admin | Les handlers restent dans le hook, la logique ne change pas |
| Perte de contexte react-hook-form dans les steps Postuler | Le form est passe en prop, pas recree dans chaque step |
| Duplication des constantes pendant la transition | Elles sont extraites en premier dans startup.ts |
