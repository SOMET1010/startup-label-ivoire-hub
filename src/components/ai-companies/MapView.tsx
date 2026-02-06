import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// @ts-ignore - CJS module
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Users, ExternalLink, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import 'leaflet/dist/leaflet.css';

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
  const navigate = useNavigate();

  // Center on Côte d'Ivoire
  const defaultCenter: [number, number] = [7.54, -5.55];
  const defaultZoom = 7;

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
        
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={50}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          zoomToBoundsOnClick
        >
          {companies.map((company) => (
            <Marker
              key={company.id}
              position={[company.coordinates.lat, company.coordinates.lng]}
              icon={createCustomIcon(company.isLabeled ?? false)}
            >
              <Popup className="leaflet-custom-popup" maxWidth={320} minWidth={280}>
                <div className="p-1">
                  {/* Header with logo and name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {company.logo ? (
                        <img 
                          src={company.logo} 
                          alt={company.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Building2 className={`w-6 h-6 text-gray-500 ${company.logo ? 'hidden' : ''}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
                        {company.name}
                      </h3>
                      {company.isLabeled && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Labellisée
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {company.description}
                  </p>
                  
                  {/* Info badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {company.location}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      <Users className="w-3 h-3" />
                      {company.employees}
                    </div>
                  </div>
                  
                  {/* Specialization */}
                  <div className="mb-3">
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {company.specialization}
                    </Badge>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/entreprises-ia/${company.id}`)}
                    >
                      Voir les détails
                    </Button>
                    {company.website && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(company.website, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
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
