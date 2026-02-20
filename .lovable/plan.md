
# Sprint 3 : Accessibilite ARIA restante + Harmonisation templates emails

## Objectif
Corriger les dernieres lacunes identifiees dans l'audit : accessibilite ARIA manquante sur certaines sections et harmonisation des templates emails pour tous les edge functions.

---

## 1. ARIA - Section StartupJourney

**Fichier** : `src/components/StartupJourney.tsx`

- Ajouter `aria-labelledby="journey-title"` sur la `<section>` (ligne 70)
- Ajouter `id="journey-title"` sur le `<h2>` (ligne 81)
- Ajouter `aria-hidden="true"` sur les icones decoratives des etapes (les `<step.icon>`)
- Ajouter `aria-hidden="true"` sur la ligne de progression decorative

---

## 2. Template email - notify-voting-decision

**Fichier** : `supabase/functions/notify-voting-decision/index.ts`

Probleme : Le template utilise des balises `<style>` dans le `<head>` (lignes 205-214) au lieu de styles inline. Beaucoup de clients email (Gmail, Outlook) ignorent les styles en `<head>`.

Action :
- Convertir en styles inline comme les autres templates (`notify-document-request`, `send-contact-email`)
- Ajouter la mention "Ministere de la Transition Numerique" dans le footer (coherence)

---

## 3. Template email - renewal-reminders (footer)

**Fichier** : `supabase/functions/renewal-reminders/index.ts`

Le footer actuel (lignes 133-139) n'inclut pas la mention institutionnelle. 

Action :
- Ajouter "Ministere de la Transition Numerique" dans le footer pour coherence avec les autres templates

---

## Details techniques

| Fichier | Modification |
|---------|-------------|
| `src/components/StartupJourney.tsx` | Ajout aria-labelledby, id, aria-hidden |
| `supabase/functions/notify-voting-decision/index.ts` | Conversion styles inline + footer institutionnel |
| `supabase/functions/renewal-reminders/index.ts` | Footer institutionnel |

**Impact** : 3 fichiers modifies, aucune nouvelle dependance, aucune migration base de donnees.
