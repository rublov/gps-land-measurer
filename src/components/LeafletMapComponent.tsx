import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import { LatLng, MapComponentProps } from '@/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Исправляем иконки маркеров Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Компонент для центрирования карты
const MapController: React.FC<{ center: LatLng; zoom: number; markers: LatLng[] }> = ({ 
  center, 
  zoom, 
  markers 
}) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      // Автоматически подгоняем карту под все маркеры
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      // Центрируем на заданной точке
      map.setView([center.lat, center.lng], zoom);
    }
  }, [map, center, zoom, markers]);

  return null;
};

const LeafletMapComponent: React.FC<MapComponentProps> = ({ 
  markers, 
  center, 
  zoom, 
  mapType = 'hybrid' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Выбираем тип карты
  const getTileLayer = () => {
    switch (mapType) {
      case 'satellite':
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        };
      case 'terrain':
        return {
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        };
      case 'hybrid':
      default:
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        };
    }
  };

  const tileLayer = getTileLayer();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-600">Загрузка карты...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-md" style={{ minHeight: '400px' }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          url={tileLayer.url}
          attribution={tileLayer.attribution}
        />
        
        <MapController center={center} zoom={zoom} markers={markers} />
        
        {/* Отображаем маркеры */}
        {markers.map((position, index) => (
          <Marker key={index} position={[position.lat, position.lng]}>
            <Popup>
              <div className="text-center">
                <strong>Точка {index + 1}</strong><br />
                Широта: {position.lat.toFixed(6)}<br />
                Долгота: {position.lng.toFixed(6)}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Отображаем полигон, если есть достаточно точек */}
        {markers.length >= 3 && (
          <Polygon
            positions={markers.map(m => [m.lat, m.lng])}
            pathOptions={{
              color: '#FF0000',
              weight: 2,
              opacity: 0.8,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
            }}
          >
            <Popup>
              <div className="text-center">
                <strong>Участок</strong><br />
                Точек: {markers.length}
              </div>
            </Popup>
          </Polygon>
        )}
      </MapContainer>
    </div>
  );
};

export default LeafletMapComponent;
