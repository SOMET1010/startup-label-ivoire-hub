import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface Company {
  id: string | number;
  name: string;
  description: string;
  sector: string;
  specialization: string;
  location: string;
  coordinates: { lat: number; lng: number };
  logo: string;
  employees: string;
  isLabeled?: boolean;
  website?: string;
}

interface CustomMarkerClusterGroupProps {
  companies: Company[];
  iconCreateFunction: (cluster: any) => L.DivIcon;
  maxClusterRadius?: number;
  createMarkerIcon: (isLabeled: boolean) => L.DivIcon;
  renderPopupContent: (company: Company) => string;
}

const CustomMarkerClusterGroup = ({
  companies,
  iconCreateFunction,
  maxClusterRadius = 50,
  createMarkerIcon,
  renderPopupContent,
}: CustomMarkerClusterGroupProps) => {
  const map = useMap();
  const clusterGroupRef = useRef<any>(null);

  useEffect(() => {
    // Clean up previous cluster group
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    const clusterGroup = (L as any).markerClusterGroup({
      iconCreateFunction,
      maxClusterRadius,
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    companies.forEach((company) => {
      const marker = L.marker(
        [company.coordinates.lat, company.coordinates.lng],
        { icon: createMarkerIcon(company.isLabeled ?? false) }
      );
      marker.bindPopup(renderPopupContent(company), {
        maxWidth: 320,
        minWidth: 280,
        className: 'leaflet-custom-popup',
      });
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    return () => {
      map.removeLayer(clusterGroup);
      clusterGroupRef.current = null;
    };
  }, [companies, map, iconCreateFunction, maxClusterRadius, createMarkerIcon, renderPopupContent]);

  return null;
};

export default CustomMarkerClusterGroup;
