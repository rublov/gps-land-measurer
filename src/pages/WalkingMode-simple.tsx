import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LeafletMapComponent from '@/components/LeafletMapComponent';
import { calculateArea, convertSqMetersToSotkas } from '@/utils/geometry';
import { toast } from 'sonner';
import { LatLng } from '@/types';

const WalkingModeSimple = () => {
  const { t } = useTranslation();
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [trackedPath, setTrackedPath] = useState<LatLng[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [calculatedAreaSqMeters, setCalculatedAreaSqMeters] = useState<number>(0);
  const [calculatedAreaSotkas, setCalculatedAreaSotkas] = useState<number>(0);
  
  const watchId = useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error('GPS не поддерживается этим браузером');
      return;
    }

    setIsMeasuring(true);
    setTrackedPath([]);
    toast.info('Начинаем отслеживание пути...');

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        
        setCurrentLocation(newLocation);
        setGpsAccuracy(accuracy);
        
        // Добавляем точку к пути
        setTrackedPath(prev => [...prev, newLocation]);
        
        toast.success(`GPS обновлен: ${accuracy.toFixed(0)}м точность`);
      },
      (error) => {
        console.error('GPS Error:', error);
        toast.error('Ошибка GPS: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );
  };

  const stopTracking = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    
    setIsMeasuring(false);
    toast.info('Отслеживание пути остановлено');
    
    // Автоматически рассчитываем площадь
    if (trackedPath.length >= 3) {
      calculateAreaFromPath();
    }
  };

  const calculateAreaFromPath = () => {
    if (trackedPath.length < 3) {
      toast.error('Для расчета площади нужно пройти минимум 3 точки');
      return;
    }

    try {
      const areaSqMeters = calculateArea(trackedPath);
      const areaSotkas = convertSqMetersToSotkas(areaSqMeters);
      
      setCalculatedAreaSqMeters(areaSqMeters);
      setCalculatedAreaSotkas(areaSotkas);
      
      toast.success(`Площадь участка: ${areaSqMeters.toFixed(1)} м² (${areaSotkas.toFixed(2)} соток)`);
    } catch (error) {
      console.error('Ошибка расчета площади:', error);
      toast.error('Ошибка при расчете площади');
    }
  };

  const clearPath = () => {
    setTrackedPath([]);
    setCalculatedAreaSqMeters(0);
    setCalculatedAreaSotkas(0);
    toast.info('Путь очищен');
  };

  useEffect(() => {
    // Очистка при размонтировании компонента
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('walkingMode')}</h1>
        <Link to="/">
          <Button variant="outline">← {t('home')}</Button>
        </Link>
      </div>

      {/* Status */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Статус отслеживания:</span>
          <div className={`px-3 py-1 rounded-full text-sm ${
            isMeasuring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isMeasuring ? '🟢 Идет измерение' : '⚪ Остановлено'}
          </div>
        </div>
        {currentLocation && (
          <div className="text-sm text-green-600">
            📍 Текущая позиция: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            {gpsAccuracy && <span className="ml-2">±{gpsAccuracy.toFixed(0)}м</span>}
          </div>
        )}
        {trackedPath.length > 0 && (
          <div className="text-sm text-blue-600 mt-1">
            🚶 Пройдено точек: {trackedPath.length}
          </div>
        )}
      </div>

      {/* Map */}
      <LeafletMapComponent
        markers={trackedPath}
        center={currentLocation || { lat: 55.7558, lng: 37.6173 }}
        zoom={currentLocation ? 16 : 10}
        mapType="hybrid"
      />

      {/* Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {!isMeasuring ? (
          <Button onClick={startTracking} className="bg-green-600 hover:bg-green-700">
            ▶️ Начать измерение
          </Button>
        ) : (
          <Button onClick={stopTracking} className="bg-red-600 hover:bg-red-700">
            ⏹️ Остановить
          </Button>
        )}
        
        <Button onClick={calculateAreaFromPath} disabled={trackedPath.length < 3} variant="outline">
          📐 Рассчитать площадь
        </Button>
        
        <Button onClick={clearPath} disabled={trackedPath.length === 0} variant="outline">
          🧹 Очистить путь
        </Button>
        
        <Button disabled variant="outline">
          💾 Сохранить (скоро)
        </Button>
      </div>

      {/* Results */}
      {calculatedAreaSqMeters > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Результаты измерения прогулкой:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Площадь в м²:</span>
              <div className="font-medium">{calculatedAreaSqMeters.toFixed(1)} м²</div>
            </div>
            <div>
              <span className="text-gray-600">Площадь в сотках:</span>
              <div className="font-medium">{calculatedAreaSotkas.toFixed(2)} соток</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Точек в пути: {trackedPath.length}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Инструкция:</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Нажмите "Начать измерение" и идите по периметру участка</li>
          <li>GPS будет автоматически записывать ваш путь</li>
          <li>Старайтесь идти точно по границе участка</li>
          <li>Нажмите "Остановить" когда вернетесь к начальной точке</li>
          <li>Площадь будет рассчитана автоматически</li>
        </ol>
      </div>
    </div>
  );
};

export default WalkingModeSimple;
