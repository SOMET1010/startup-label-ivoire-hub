import { useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CustomMarkerClusterGroup from './CustomMarkerClusterGroup';

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

interface MapViewProps {
  companies: Company[];
}

// Fix for default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon creator
const createCustomIcon = (isLabeled: boolean) => {
  const color = isLabeled ? 'hsl(142, 76%, 36%)' : 'hsl(215, 16%, 47%)';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 3px solid white;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
          <path d="M10 6h4"/>
          <path d="M10 10h4"/>
          <path d="M10 14h4"/>
          <path d="M10 18h4"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Custom cluster icon creator
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = 'small';
  let diameter = 40;

  if (count >= 50) {
    size = 'large';
    diameter = 56;
  } else if (count >= 10) {
    size = 'medium';
    diameter = 48;
  }

  return L.divIcon({
    html: `<div style="
      background: hsl(var(--primary));
      width: ${diameter}px;
      height: ${diameter}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: ${size === 'large' ? '16px' : size === 'medium' ? '14px' : '13px'};
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      border: 3px solid white;
    ">${count}</div>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(diameter, diameter),
  });
};

// Render popup content as HTML string (required by native Leaflet bindPopup)
const renderPopupContent = (company: Company): string => {
  const labelBadge = company.isLabeled
    ? `<span style="display:inline-flex;align-items:center;gap:4px;background:#dcfce7;color:#15803d;font-size:12px;padding:2px 8px;border-radius:9999px;font-weight:500;">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
        Labellisée
      </span>`
    : '';

  const websiteBtn = company.website
    ? `<a href="${company.website}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;border:1px solid #d1d5db;border-radius:6px;background:white;color:#374151;font-size:13px;cursor:pointer;text-decoration:none;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
      </a>`
    : '';

  return `
    <div style="padding:4px;">
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
        <div style="width:48px;height:48px;border-radius:8px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
          ${company.logo
      ? `<img src="${company.logo}" alt="${company.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />`
      : ''}
          <div style="${company.logo ? 'display:none;' : 'display:flex;'}align-items:center;justify-content:center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
          </div>
        </div>
        <div style="flex:1;min-width:0;">
          <h3 style="font-weight:600;color:#111827;font-size:15px;line-height:1.3;margin:0 0 4px 0;">${company.name}</h3>
          ${labelBadge}
        </div>
      </div>
      <p style="font-size:13px;color:#4b5563;margin:0 0 12px 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${company.description}</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
        <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;color:#4b5563;background:#f3f4f6;padding:4px 8px;border-radius:9999px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${company.location}
        </span>
        <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;color:#4b5563;background:#f3f4f6;padding:4px 8px;border-radius:9999px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          ${company.employees}
        </span>
      </div>
      <div style="margin-bottom:12px;">
        <span style="font-size:12px;background:#f3f4f6;color:#374151;padding:4px 10px;border-radius:6px;">${company.specialization}</span>
      </div>
      <div style="display:flex;gap:8px;">
        <a href="/entreprises-ia/${company.id}" style="flex:1;display:inline-flex;align-items:center;justify-content:center;padding:6px 16px;background:hsl(var(--primary));color:white;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;text-decoration:none;">Voir les détails</a>
        ${websiteBtn}
      </div>
    </div>
  `;
};

// Component to fit bounds to all markers
const FitBounds = ({ companies }: { companies: Company[] }) => {
  const map = useMap();

  useEffect(() => {
    if (companies.length === 0) return;

    const bounds = L.latLngBounds(
      companies.map(c => [c.coordinates.lat, c.coordinates.lng] as [number, number])
    );

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }, [companies, map]);

  return null;
};

const MapView = ({ companies }: MapViewProps) => {
  // Center on Côte d'Ivoire
  const defaultCenter: [number, number] = [7.54, -5.55];
  const defaultZoom = 7;

  const memoizedCreateIcon = useCallback(createCustomIcon, []);
  const memoizedRenderPopup = useCallback(renderPopupContent, []);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds companies={companies} />

        <CustomMarkerClusterGroup
          companies={companies}
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={50}
          createMarkerIcon={memoizedCreateIcon}
          renderPopupContent={memoizedRenderPopup}
        />
      </MapContainer>

      {/* Overlay - Company count */}
      <div className="absolute top-4 left-4 z-[1000] bg-background/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-border">
        <span className="font-semibold text-foreground">{companies.length}</span>
        <span className="text-muted-foreground ml-1">
          entreprise{companies.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-border">
        <p className="text-xs font-medium text-foreground mb-2">Légende</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-xs text-muted-foreground">Labellisée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-xs text-muted-foreground">Non labellisée</span>
          </div>
          <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[9px] font-bold text-primary-foreground">n</span>
            </div>
            <span className="text-xs text-muted-foreground">Cluster (n entreprises)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
