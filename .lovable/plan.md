
# Correction du clustering OpenStreetMap - React 18 / react-leaflet-cluster v4

## Diagnostic approfondi

Le test en navigateur confirme que cliquer sur l'onglet "Carte" provoque un crash avec l'erreur :

```
TypeError: render2 is not a function
    at updateContextConsumer
```

### Cause racine
`react-leaflet-cluster` v4.0.0 declare `"react": "^19.0.0"` dans ses `peerDependencies`. Il utilise `createPathComponent` de `@react-leaflet/core` v3.0.0, qui repose sur l'API de contexte React 19 (nouvelle signature `Context.Provider` / consumer). Or ce projet utilise **React 18**, dont l'API de contexte est differente, ce qui fait echouer l'appel interne `render2()`.

La chaine de dependances problematique :

```text
react-leaflet-cluster v4.0.0 (React 19 requis)
  -> @react-leaflet/core v3.0.0 (React 19 requis)
    -> createPathComponent() utilise React 19 Context API
      -> CRASH sur React 18 : "render2 is not a function"
```

Les composants de base (`MapContainer`, `TileLayer`, `Marker`, `Popup`) fonctionnent car ils n'utilisent pas `createPathComponent` de la meme maniere.

### Bug secondaire detecte
Les imports CSS dans `MapView.tsx` sont en double (lignes 11-14), probablement dus a une edition precedente.

## Solution retenue

**Creer un composant wrapper imperatif** qui utilise directement `leaflet.markercluster` via le hook `useMap()` de react-leaflet, sans passer par `createPathComponent`. Cela contourne entierement l'incompatibilite React 18/19.

Cette approche :
- Ne necessite pas de changer la version de React (risque eleve)
- Ne necessite pas de downgrader react-leaflet (casserait d'autres composants)
- Preserve toute la fonctionnalite existante (icones custom, popups, clustering)

## Plan d'implementation

### Etape 1 : Creer le composant wrapper `CustomMarkerClusterGroup`

Creer un nouveau fichier `src/components/ai-companies/CustomMarkerClusterGroup.tsx` qui :

- Utilise `useMap()` pour acceder a l'instance Leaflet
- Cree un `L.MarkerClusterGroup` dans un `useEffect`
- Detecte les enfants `Marker` via `React.Children` et `createPortal` OU, plus simplement, accepte les markers comme donnees (props) et les cree imperativement
- Gere le nettoyage (cleanup) a la destruction du composant

Architecture du composant :

```typescript
// Approche imperative : les markers sont crees directement via Leaflet
// au lieu de passer par des composants React enfants
const CustomMarkerClusterGroup = ({
  companies,
  iconCreateFunction,
  maxClusterRadius,
  onMarkerClick,
  createMarkerIcon,
  renderPopupContent,
}: Props) => {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      iconCreateFunction,
      maxClusterRadius,
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    companies.forEach(company => {
      const marker = L.marker(
        [company.coordinates.lat, company.coordinates.lng],
        { icon: createMarkerIcon(company.isLabeled) }
      );
      marker.bindPopup(renderPopupContent(company));
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
    return () => { map.removeLayer(clusterGroup); };
  }, [companies, map]);

  return null;
};
```

### Etape 2 : Mettre a jour MapView.tsx

- Supprimer l'import de `react-leaflet-cluster`
- Supprimer les imports CSS en double
- Importer le CSS de `leaflet.markercluster` directement
- Remplacer `<MarkerClusterGroup>` par le nouveau composant imperatif
- Deplacer le contenu des popups dans une fonction `renderPopupContent` qui retourne du HTML string (requis par l'API Leaflet native `bindPopup`)
- Conserver les fonctions `createCustomIcon` et `createClusterCustomIcon` existantes

### Etape 3 : Nettoyer les dependances dans vite.config.ts

Garder `leaflet.markercluster` dans `optimizeDeps.include` car il reste necessaire pour le pre-bundling.

---

## Fichiers impactes

| Fichier | Modification |
|---|---|
| `src/components/ai-companies/CustomMarkerClusterGroup.tsx` | Nouveau fichier - wrapper imperatif |
| `src/components/ai-companies/MapView.tsx` | Remplacer react-leaflet-cluster par le wrapper custom, supprimer imports en double, ajouter CSS leaflet.markercluster |

## Considerations techniques

- **Popups** : L'API native Leaflet `bindPopup()` accepte du HTML string ou un element DOM, pas du JSX. Le contenu des popups sera donc genere en HTML string. Cela signifie que les boutons "Voir les details" utiliseront `window.location.href` au lieu de `navigate()` de React Router. L'alternative serait d'utiliser `ReactDOM.createRoot` pour monter du JSX dans chaque popup, mais cela ajoute de la complexite.
- **Performance** : L'approche imperative est en fait plus performante que la version React car les markers sont geres directement par Leaflet sans passer par le cycle de rendu React.
- **Styles de cluster** : Les CSS de `leaflet.markercluster` (`MarkerCluster.css` et `MarkerCluster.Default.css`) seront importes depuis `leaflet.markercluster/dist/` au lieu de `react-leaflet-cluster/dist/assets/`.
