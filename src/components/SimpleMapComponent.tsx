import React from 'react';
import { LatLng } from '@/types';

interface SimpleMapProps {
  markers: LatLng[];
  center?: LatLng;
  onMapClick?: (lat: number, lng: number) => void;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

const SimpleMapComponent: React.FC<SimpleMapProps> = ({ 
  markers, 
  center = { lat: 55.7558, lng: 37.6173 }, // Москва
  onMapClick,
  mapType = 'roadmap'
}) => {
  return (
    <div className="w-full h-96 bg-gray-100 border rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold mb-2">Карта (Демо режим)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Центр: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </p>
          
          {markers.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Маркеры ({markers.length}):</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {markers.map((marker, index) => (
                  <div key={index} className="text-xs bg-blue-100 p-1 rounded">
                    Маркер {index + 1}: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => onMapClick?.(center.lat + Math.random() * 0.01, center.lng + Math.random() * 0.01)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Добавить случайный маркер
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleMapComponent;
