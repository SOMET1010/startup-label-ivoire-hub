

# Correction du clustering carte OpenStreetMap

## Diagnostic

Le probleme vient de la chaine de dependances entre Vite et les librairies Leaflet :

```text
react-leaflet-cluster (ESM, v4.0.0)
  --> import "leaflet.markercluster" (UMD/CJS, v1.5.3)
      --> Utilise le pattern IIFE : (function(global, factory){...}(this, ...))
```

`leaflet.markercluster` est un module UMD ancien qui utilise `this` comme reference globale. Vite, en mode ESM, ne pre-bundle pas automatiquement ce type de dependance transitive, ce qui provoque des erreurs au runtime (reference `this` undefined en mode strict ESM, ou echec d'import CJS).

De plus, la version 4.0.0 de `react-leaflet-cluster` exige desormais un **import manuel des fichiers CSS** pour le styling des clusters (changement de rupture depuis v3.0.0).

## Corrections a appliquer

### 1. Forcer le pre-bundling dans vite.config.ts

Ajouter `leaflet.markercluster` dans `optimizeDeps.include` pour que Vite le convertisse en ESM lors du pre-bundling. Cela resout l'incompatibilite CJS/ESM :

```typescript
// vite.config.ts
optimizeDeps: {
  include: ['leaflet.markercluster'],
},
```

### 2. Importer les CSS de clustering dans MapView.tsx

Ajouter les imports CSS requis par react-leaflet-cluster v4 :

```typescript
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
```

Ces CSS fournissent les styles de base pour les icones de cluster (animation, z-index, positionnement). Sans eux, les clusters s'affichent mais sans style.

### 3. Nettoyer le commentaire @ts-ignore

Le commentaire `// @ts-ignore - CJS module` peut etre conserve car le package n'exporte pas de types parfaitement compatibles, mais l'import lui-meme fonctionnera correctement apres le fix Vite.

## Fichiers modifies

| Fichier | Modification |
|---|---|
| `vite.config.ts` | Ajouter `optimizeDeps.include: ['leaflet.markercluster']` |
| `src/components/ai-companies/MapView.tsx` | Ajouter les 2 imports CSS pour le clustering |

## Risques

- **Aucun risque de regression** : `optimizeDeps.include` affecte uniquement le pre-bundling de developpement et le build de production
- Le reste du composant MapView (markers, popups, legende) reste inchange

