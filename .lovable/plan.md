
# Plan de Nettoyage Anti-Vibecoding

## ✅ PHASE 0 — INVENTAIRE (terminé)
## ✅ PHASE 1 — NETTOYAGE (terminé)
- 12 fichiers morts supprimés
- Route `/actualites/:id` corrigée
- Route `/test-push` supprimée
- console.log nettoyés

## ✅ PHASE 2 — CORRECTIONS DE TYPAGE (terminé)
- ~56 occurrences de `: any` corrigées
- catch blocks standardisés avec `catch (error: unknown)` dans 20+ fichiers
- useAuditLogs: données castées vers `AuditLogEntry[]`
- useStructureData: interface `StructureProgram` créée, `programs: any` → `programs: StructureProgram[] | null`
- useVotingStats: interfaces `EvaluationRecord`, `VotingDecisionRecord`, `ApplicationRecord`, `ProfileRecord` créées
- useEvaluationComments: `attachments: any[]` → `Record<string, unknown>[]`, presence typé
- MapView/CustomMarkerClusterGroup: `cluster: any` → `{ getChildCount: () => number }`
- EvaluatorPerformanceChart: tooltip props typé
- usePushNotifications: `as any` → `as unknown as { pushManager: PushManager }`
- useVotingDecision: 2 catch blocks corrigés
- Résidu: 2 `any` dans AuthContext.tsx (signUp data param) — acceptable pour l'instant

## TODO — PHASE 3 — DÉCOUPE DES FICHIERS GÉANTS
- admin/Dashboard.tsx (1585 lignes)
- Postuler.tsx (1382 lignes)
- startup/Profile.tsx (763 lignes)
- SuiviCandidature.tsx (564 lignes)

## TODO — PHASE 4 — UNIFICATION DES LAYOUTS
## TODO — PHASE 5 — STANDARDISATION DES ERREURS
## TODO — PHASE 6 — VÉRIFICATION FINALE
