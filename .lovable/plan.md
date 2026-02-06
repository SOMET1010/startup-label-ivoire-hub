

# Ajouter un CTA "Contactez-nous" en bas de la page FAQ

## Objectif
Ajouter une section de contact en bas de la page FAQ principale (`FAQ.tsx`), identique en structure a celle presente dans `AccompagnementFAQ.tsx`, pour que les utilisateurs qui ne trouvent pas leur reponse puissent facilement contacter l'equipe.

## Modele de reference (AccompagnementFAQ.tsx)
La section existante contient :
- Un texte : "Vous n'avez pas trouve la reponse a votre question ?"
- Deux boutons : "Toutes les FAQ" (outline) et "Nous contacter" (primary)
- Le bouton "Toutes les FAQ" renvoie vers `/faq` et le bouton contact vers `/#contact`

## Modifications

### 1. Fichier `src/pages/FAQ.tsx`
- Ajouter les icones `HelpCircle` et `MessageCircle` aux imports depuis `lucide-react`
- Ajouter `Link` aux imports depuis `react-router-dom` (deja importe)
- Ajouter `Button` aux imports depuis `@/components/ui/button`
- Inserer une section de contact apres la grille de FAQ (avant la fermeture de `</main>`), avec :
  - Texte d'accroche traduit
  - Bouton "Nous contacter" avec icone `MessageCircle`, renvoyant vers `/#contact`

Comme nous sommes deja sur la page FAQ, le bouton "Toutes les FAQ" n'a pas de sens ici. On le remplacera par un lien vers le test d'eligibilite (coherent avec le parcours utilisateur).

### 2. Fichiers de traduction

**`src/i18n/locales/fr/pages.json`** -- Ajouter dans la section `faq` :
```json
"contact": {
  "text": "Vous n'avez pas trouvé la réponse à votre question ?",
  "contactButton": "Nous contacter",
  "eligibilityButton": "Tester mon éligibilité"
}
```

**`src/i18n/locales/en/pages.json`** -- Ajouter dans la section `faq` :
```json
"contact": {
  "text": "Didn't find the answer to your question?",
  "contactButton": "Contact us",
  "eligibilityButton": "Test my eligibility"
}
```

### 3. Rendu visuel
La section sera centree, placee sous les accordeons, avec un fond neutre et des boutons bien espaces -- identique au style de `AccompagnementFAQ.tsx`.

## Fichiers impactes

| Fichier | Action |
|---|---|
| `src/pages/FAQ.tsx` | Ajouter section contact + imports |
| `src/i18n/locales/fr/pages.json` | Ajouter cles `faq.contact.*` |
| `src/i18n/locales/en/pages.json` | Ajouter cles `faq.contact.*` |

