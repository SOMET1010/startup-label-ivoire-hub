

# Phase 2 -- Corrections de Typage

Remplacement systematique de tous les `: any` par des types stricts dans le projet. 27+ fichiers concernes, ~280 occurrences.

---

## 2A. Pattern standard pour les catch blocks (applique partout)

Tous les `catch (error: any)` et `catch (err: any)` seront remplaces par :

```typescript
catch (error: unknown) {
  const message = error instanceof Error ? error.message : "Erreur inconnue";
  // utilisation de message au lieu de error.message
}
```

**Fichiers concernes (18 fichiers)** :
- `src/hooks/usePerplexityNews.ts`
- `src/hooks/useSecureDocument.ts` (2 catch + fonction `getErrorMessage`)
- `src/hooks/useAdminMetrics.ts`
- `src/hooks/useEvaluationComments.ts` (3 catch)
- `src/hooks/useDraftApplication.ts`
- `src/components/ai-companies/CompanyContact.tsx`
- `src/components/evaluation/EvaluationList.tsx`
- `src/components/evaluation/EvaluationForm.tsx`
- `src/components/dashboard/MissingDocumentsAlert.tsx`
- `src/components/admin/AdminCommitteeMembers.tsx` (2 catch)
- `src/components/admin/DocumentViewer.tsx` (2 catch)
- `src/components/admin/RequestDocumentDialog.tsx`
- `src/components/admin/AdminPlatformSettings.tsx`
- `src/components/admin/AdminLegalDocuments.tsx` (2 catch)
- `src/pages/admin/Dashboard.tsx` (3 catch)
- `src/pages/SuiviCandidature.tsx`
- `src/pages/Postuler.tsx`
- `src/pages/startup/Profile.tsx`
- `src/pages/Annuaire.tsx`
- `src/pages/Auth.tsx` (3 catch + `getErrorMessage` function)

---

## 2B. Typage des hooks avec interfaces manquantes

### `src/hooks/useAuditLogs.ts` -- 10 occurrences

Les callbacks `.filter((l: any) => ...)` et `.forEach((log: any) => ...)` seront types avec l'interface `AuditLogEntry` qui existe deja dans le fichier. Le probleme vient du fait que `buildQuery()` retourne un type Supabase generique. Solution : caster `data` apres le fetch :

```typescript
const logs = (data || []) as unknown as AuditLogEntry[];
```

Cela elimine tous les `: any` dans les stats, dailyActivity, topDocuments et exportToCsv.

### `src/hooks/useStructureData.ts` -- 3 occurrences

1. Remplacer `programs: any` dans `StructureData` par un type explicite :
```typescript
interface Program {
  name: string;
  status: string;
  description?: string;
}
// puis
programs: Program[] | null;
```

2. Les `.filter((p: any) => p.status === "active")` deviennent `.filter((p: Program) => p.status === "active")`

3. `.update(data as any)` -> `.update(data as Record<string, unknown>)`

### `src/hooks/useVotingStats.ts` -- 8 occurrences

Creer des interfaces locales pour les donnees Supabase utilisees par les fonctions utilitaires :

```typescript
interface EvaluationRecord {
  evaluator_id: string;
  submitted_at: string | null;
  recommendation: string | null;
  total_score: number | null;
}

interface VotingDecisionRecord {
  application_id: string;
  quorum_reached: boolean;
  updated_at: string | null;
  decided_at: string | null;
  final_decision: string | null;
}

interface ApplicationRecord {
  id: string;
  submitted_at: string | null;
}

interface ProfileRecord {
  user_id: string;
  full_name: string | null;
}
```

Puis remplacer les parametres `any[]` par ces types dans `calculateMonthlyVotes`, `calculateDecisionTimeTrend` et `calculateEvaluatorPerformance`.

### `src/hooks/useEvaluationComments.ts` -- 2 occurrences (hors catch)

1. `attachments: any[]` -> `attachments: Record<string, unknown>[]` (ou un type `Attachment` si la structure est connue)
2. `presenceList.forEach((presence: any) =>` -> typer avec une interface `PresenceState` :
```typescript
interface PresencePayload {
  user_id: string;
  full_name: string;
}
```

---

## 2C. Composants UI avec `: any`

### `src/components/ai-companies/MapView.tsx`

`createClusterCustomIcon = (cluster: any)` -> Utiliser le type Leaflet `L.MarkerCluster` :
```typescript
import L from 'leaflet';
const createClusterCustomIcon = (cluster: L.MarkerCluster) => { ... }
```

### `src/components/ai-companies/CustomMarkerClusterGroup.tsx`

`iconCreateFunction: (cluster: any) => L.DivIcon` -> `iconCreateFunction: (cluster: L.MarkerCluster) => L.DivIcon`

### `src/components/admin/charts/EvaluatorPerformanceChart.tsx`

`(value: number, name: string, props: any)` -> typer props avec le type Recharts :
```typescript
interface TooltipPayload {
  payload: EvaluatorPerformance;
}
```

---

## 2D. Fix du `as any` introduit en Phase 1

### `src/hooks/usePushNotifications.ts` -- 3 occurrences

Le `(registration as any).pushManager` introduit en Phase 1 pour contourner un bug TypeScript sera corrige proprement avec une declaration de type :

```typescript
// Ajout en haut du fichier ou dans un fichier .d.ts
interface ServiceWorkerRegistrationWithPush extends ServiceWorkerRegistration {
  pushManager: PushManager;
}
```

Puis cast vers ce type au lieu de `any`.

---

## Resume des impacts

| Zone | Occurrences `: any` | Apres Phase 2 |
|------|---------------------|---------------|
| catch blocks | ~25 | 0 |
| useAuditLogs | 10 | 0 |
| useVotingStats | 8 | 0 |
| useStructureData | 4 | 0 |
| useEvaluationComments | 3 | 0 |
| Composants UI | 3 | 0 |
| usePushNotifications | 3 | 0 |
| **Total** | **~56** | **0** |

## Risques

- Les types Supabase generiques peuvent causer des erreurs de compilation si les interfaces ne matchent pas exactement le schema. Mitigation : utiliser `as unknown as Type` pour les retours Supabase quand necessaire.
- Le type `L.MarkerCluster` peut ne pas etre exporte par `@types/leaflet`. Mitigation : verifier l'export, sinon creer un type local minimal.

