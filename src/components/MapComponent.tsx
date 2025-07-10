import React, { useEffect, useRef } from 'react';

interface LatLng {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  markers: LatLng[];
  center: LatLng;
  zoom: number;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

const MapComponent: React.FC<MapComponentProps> = ({ markers, center, zoom, mapType = 'hybrid' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<google.maps.Map | null>(null);
  const googleMarkers = useRef<google.maps.Marker[]>([]);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (mapRef.current && !googleMap.current && typeof window.google !== 'undefined') {
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
    }
  }, [center, zoom, mapType]);

  useEffect(() => {
    if (!googleMap.current) return;

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

  }, [markers, center, zoom]);

  return <div ref={mapRef} className="w-full h-full rounded-lg shadow-md" style={{ minHeight: '400px' }} />;
};

export default MapComponent;