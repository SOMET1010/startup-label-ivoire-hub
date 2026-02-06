
# Correction definitive du clustering - Incompatibilite React 18

## Diagnostic confirme

Le test en navigateur montre que cliquer sur l'onglet "Carte" de `/entreprises-ia` provoque toujours le crash :

```
TypeError: render2 is not a function
    at updateContextConsumer
```

### Cause racine identifiee

Le probleme ne vient pas seulement de `react-leaflet-cluster` mais de **`react-leaflet` v5.0.0 elle-meme**, qui exige React 19 :

```text
package.json (etat actuel) :
  "react": "^18.3.1"           <-- React 18
  "react-leaflet": "^5.0.0"   <-- Requiert React 19
  "react-leaflet-cluster": "^4.0.0"  <-- Requiert React 19 (plus utilise mais toujours installe)
```

`react-leaflet` v5 utilise `@react-leaflet/core` v3, dont l'API de contexte interne (Provider/Consumer) utilise le nouveau format React 19. Quand React 18 tente de reconcilier un `Context.Consumer` cree avec ce format, l'appel interne `render2()` echoue car la structure du contexte est differente.

## Solution

Downgrader `react-leaflet` vers la version 4.x (derniere version compatible React 18), supprimer `react-leaflet-cluster` du `package.json`, et ajouter `leaflet.markercluster` comme dependance explicite.

### Changements de versions

| Paquet | Version actuelle | Version cible | Raison |
|---|---|---|---|
| `react-leaflet` | ^5.0.0 | ^4.2.1 | Derniere version compatible React 18 |
| `react-leaflet-cluster` | ^4.0.0 | Supprime | N'est plus importe, remplace par le wrapper custom |
| `leaflet.markercluster` | (transitive) | ^1.5.3 | Dependance directe necessaire pour le wrapper custom |

### Fichiers modifies

| Fichier | Modification |
|---|---|
| `package.json` | Downgrade react-leaflet, supprimer react-leaflet-cluster, ajouter leaflet.markercluster |

### Aucun changement de code necessaire

L'API de `react-leaflet` v4 est identique a v5 pour les composants utilises dans le projet :
- `MapContainer` : meme API
- `TileLayer` : meme API
- `useMap()` : meme API (hook disponible depuis v3)

Le `CustomMarkerClusterGroup.tsx` et `MapView.tsx` n'ont pas besoin d'etre modifies.

## Verification

Apres la correction, la carte doit :
1. S'afficher sans erreur quand on clique sur l'onglet "Carte"
2. Grouper les marqueurs en clusters avec les icones personnalisees
3. Afficher les popups au clic sur un marqueur
4. Permettre le zoom pour eclater les clusters
