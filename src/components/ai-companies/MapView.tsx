import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Building2 } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  logo: string;
  description: string;
  sector: string;
  specialization: string;
  location: string;
  coordinates: { lat: number; lng: number };
  employees: string;
  website: string;
  isLabeled: boolean;
  services: string[];
}

interface MapViewProps {
  companies: Company[];
  apiKey: string;
}

const MapView = ({ companies, apiKey }: MapViewProps) => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;

    // Initialize map
    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-5.5471, 7.5400], // Center on Côte d'Ivoire
      zoom: 6.5,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [apiKey]);

  // Update markers when companies change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for each company
    companies.forEach(company => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.transition = 'transform 0.2s';
      el.style.backgroundColor = company.isLabeled ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      
      // Add building icon
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('width', '20');
      icon.setAttribute('height', '20');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'white');
      icon.setAttribute('stroke-width', '2');
      icon.innerHTML = '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>';
      el.appendChild(icon);

      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Create popup content as DOM element for better interactivity
      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '250px';
      popupContent.style.maxWidth = '300px';
      
      popupContent.innerHTML = `
        <div>
          <div style="display: flex; align-items: start; margin-bottom: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 8px; background: hsl(var(--muted)); margin-right: 12px; overflow: hidden;">
              <img src="${company.logo}" alt="${company.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="flex-grow: 1;">
              <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px; color: hsl(var(--foreground));">${company.name}</h3>
              <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 500; ${company.isLabeled ? 'background: hsl(var(--primary)); color: hsl(var(--primary-foreground));' : 'border: 1px solid hsl(var(--border)); color: hsl(var(--foreground));'}">
                ${company.isLabeled ? 'Labellisée' : 'Non labellisée'}
              </span>
            </div>
          </div>
          <p style="font-size: 13px; color: hsl(var(--muted-foreground)); margin-bottom: 12px; line-height: 1.4;">${company.description.substring(0, 120)}${company.description.length > 120 ? '...' : ''}</p>
          <div style="margin-bottom: 8px;">
            <div style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 4px;">
              <strong>Spécialisation:</strong> ${company.specialization}
            </div>
            <div style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 4px;">
              <strong>Secteur:</strong> ${company.sector}
            </div>
            <div style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 4px;">
              <strong>Employés:</strong> ${company.employees}
            </div>
          </div>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid hsl(var(--border)); display: flex; gap: 8px;">
            <a href="${company.website}" target="_blank" rel="noopener noreferrer" style="color: hsl(var(--primary)); text-decoration: none; font-size: 13px; font-weight: 500;">
              Visiter le site →
            </a>
          </div>
        </div>
      `;
      
      // Add details button
      const detailsButton = document.createElement('button');
      detailsButton.textContent = 'Voir tous les détails';
      detailsButton.style.cssText = 'width: 100%; margin-top: 12px; padding: 8px 12px; background: hsl(var(--primary)); color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: opacity 0.2s;';
      detailsButton.onmouseover = () => detailsButton.style.opacity = '0.9';
      detailsButton.onmouseout = () => detailsButton.style.opacity = '1';
      detailsButton.onclick = () => navigate(`/entreprises-ia/${company.id}`);
      
      popupContent.appendChild(detailsButton);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '320px'
      }).setDOMContent(popupContent);

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([company.coordinates.lng, company.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (companies.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      companies.forEach(company => {
        bounds.extend([company.coordinates.lng, company.coordinates.lat]);
      });
      map.current?.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 12
      });
    }
  }, [companies]);

  return (
    <div className="relative w-full" style={{ height: '600px' }}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden shadow-lg" />
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
            <span className="text-muted-foreground">Labellisée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--muted-foreground))' }}></div>
            <span className="text-muted-foreground">Non labellisée</span>
          </div>
        </div>
      </div>
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{companies.length} entreprise{companies.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
