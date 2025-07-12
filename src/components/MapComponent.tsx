import React, { useEffect, useRef } from 'react';
import { LatLng, MapComponentProps } from '@/types';

// Функция для динамической загрузки Google Maps API
const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Проверяем, не загружен ли уже Google Maps
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Проверяем, не загружается ли уже скрипт
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Ждем загрузки
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      reject(new Error('Google Maps API key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file'));
      return;
    }
    
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Проверяем, что API полностью загружен
      if (window.google && window.google.maps) {
        resolve();
      } else {
        // Даем еще немного времени для полной инициализации
        setTimeout(() => {
          if (window.google && window.google.maps) {
            resolve();
          } else {
            reject(new Error('Google Maps API loaded but not properly initialized'));
          }
        }, 100);
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
    };
    
    document.head.appendChild(script);
  });
};

const MapComponent: React.FC<MapComponentProps> = ({ markers, center, zoom, mapType = 'hybrid' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<google.maps.Map | null>(null);
  const googleMarkers = useRef<google.maps.Marker[]>([]);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);

  // Инициализация карты после загрузки Google Maps API
  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();
        
        if (mapRef.current && !googleMap.current) {
          googleMap.current = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom,
            mapTypeId: window.google.maps.MapTypeId[(mapType as string).toUpperCase() as keyof typeof window.google.maps.MapTypeId],
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          });
          setIsMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();
  }, []);

  // Обновление настроек карты
  useEffect(() => {
    if (googleMap.current && isMapLoaded) {
      googleMap.current.setMapTypeId(
        window.google.maps.MapTypeId[(mapType as string).toUpperCase() as keyof typeof window.google.maps.MapTypeId]
      );
    }
  }, [mapType, isMapLoaded]);

  // Обновление маркеров
  useEffect(() => {
    if (!googleMap.current || !isMapLoaded) return;

    googleMarkers.current.forEach(marker => marker.setMap(null));
    googleMarkers.current = [];

    markers.forEach((pos, index) => {
      const marker = new window.google.maps.Marker({
        position: pos,
        map: googleMap.current,
        label: (index + 1).toString(),
      });
      googleMarkers.current.push(marker);
    });

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    if (markers.length >= 2) {
      const paths = markers.map(m => new window.google.maps.LatLng(m.lat, m.lng));
      if (markers.length >= 3) {
        paths.push(new window.google.maps.LatLng(markers[0].lat, markers[0].lng));
      }

      polygonRef.current = new window.google.maps.Polygon({
        paths: markers,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      });
      polygonRef.current.setMap(googleMap.current);
    }

    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker));
      googleMap.current.fitBounds(bounds);
      if (markers.length === 1) {
        googleMap.current.setZoom(18);
      }
    } else {
      googleMap.current.setCenter(center);
      googleMap.current.setZoom(zoom);
    }

  }, [markers, center, zoom, isMapLoaded]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg shadow-md" style={{ minHeight: '400px' }}>
      {!isMapLoaded && (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-gray-600">Загрузка карты...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;