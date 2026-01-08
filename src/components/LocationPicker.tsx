import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/store/languageStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

const LocationPicker = ({ onLocationSelect, initialLat = 33.3152, initialLng = 44.3661 }: LocationPickerProps) => {
  const [address, setAddress] = useState('');
  const { t, language } = useTranslation();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLocationChange = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=${language}`
      );
      const data = await response.json();
      const displayAddress = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(displayAddress);
      onLocationSelect(lat, lng, displayAddress);
    } catch (error) {
      const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(fallbackAddress);
      onLocationSelect(lat, lng, fallbackAddress);
    }
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current).setView([initialLat, initialLng], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }
      
      handleLocationChange(lat, lng);
    });

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 13);
          
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude]).addTo(map);
          }
          
          handleLocationChange(latitude, longitude);
        },
        () => {
          // Geolocation failed, use initial coordinates
          handleLocationChange(initialLat, initialLng);
        }
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="h-64 md:h-80 rounded-lg overflow-hidden border border-border"
      />
      
      {address && (
        <div className="p-3 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{t('location.selected')} </span>
            {address}
          </p>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground text-center">
        {t('location.instruction')}
      </p>
    </div>
  );
};

export default LocationPicker;