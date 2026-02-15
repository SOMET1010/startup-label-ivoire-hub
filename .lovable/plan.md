
# Plan de nettoyage — Anti-Vibecoding

## Phases completees

### Phase 1 ✅ — Suppression du code mort
### Phase 2 ✅ — Corrections de typage (`: any` → types stricts)
### Phase 3 ✅ — Decoupe des fichiers geants

Fichiers decoupes :
- **SuiviCandidature.tsx** (564 → ~110 lignes) → `useApplicationTracking.ts`, `ApplicationsList.tsx`, `ApplicationDetailPanel.tsx`
- **startup/Profile.tsx** (763 → ~140 lignes) → `useStartupProfile.ts`, `ProfileInfoTab.tsx`, `ProfileDocumentsTab.tsx`, `ProfileSettingsTab.tsx`
- **Postuler.tsx** (1382 → ~150 lignes) → `applicationFormSchema.ts`, `useApplicationForm.ts`, `ApplicationStep1-4.tsx`, `ConfirmationDialog.tsx`
- **admin/Dashboard.tsx** (1585 → ~120 lignes) → `useAdminDashboard.tsx`, `ApplicationsTab.tsx`, `UsersTab.tsx`, `ApplicationDetailDialog.tsx`, `AdminDialogs.tsx`

Constantes centralisees dans `src/lib/constants/startup.ts`.

---

## Phases restantes

### Phase 4 — Unification des Layouts et Headers
### Phase 5 — Etats d'erreur/chargement standardises
### Phase 6 — Smoke testing des chemins critiques
