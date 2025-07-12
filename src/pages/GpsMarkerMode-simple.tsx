import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { SoundButton } from '@/components/ui/sound-button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import LeafletMapComponent from '@/components/LeafletMapComponent';
import { calculateArea, convertSqMetersToSotkas } from '@/utils/geometry';
import { toast } from 'sonner';
import { LatLng } from '@/types';
import { playSound } from '@/utils/sound';

// Безопасная функция для сохранения измерения
const saveMeasurement = (name: string, areaSqMeters: number, areaSotkas: number, coordinates: LatLng[]) => {
  try {
    console.log('Попытка сохранения измерения:', { name, areaSqMeters, areaSotkas, coordinates });
    
    // Проверяем доступность localStorage
    if (typeof Storage === 'undefined' || !window.localStorage) {
      console.warn('localStorage недоступен');
      return false;
    }
    
    // Безопасное получение данных
    let measurements = [];
    try {
      const stored = window.localStorage.getItem('landMeasurements');
      measurements = stored ? JSON.parse(stored) : [];
    } catch (parseError) {
      console.warn('Ошибка парсинга localStorage:', parseError);
      measurements = [];
    }
    
    console.log('Существующие измерения:', measurements);
    
    const newMeasurement = {
      id: Date.now().toString(),
      name: name || `Измерение от ${new Date().toLocaleDateString()}`,
      areaSqMeters,
      areaSotkas,
      date: new Date().toISOString(),
      coordinates
    };
    
    console.log('Новое измерение:', newMeasurement);
    
    measurements.push(newMeasurement);
    
    // Безопасное сохранение
    try {
      window.localStorage.setItem('landMeasurements', JSON.stringify(measurements));
      console.log('Сохранено в localStorage');
      return true;
    } catch (storageError) {
      console.warn('Ошибка сохранения в localStorage:', storageError);
      // Временно сохраняем в памяти
      (window as any).tempMeasurements = measurements;
      return true;
    }
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    return false;
  }
};

const GpsMarkerModeSimple = () => {
  const { t } = useTranslation();
  const [markers, setMarkers] = useState<LatLng[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [calculatedAreaSqMeters, setCalculatedAreaSqMeters] = useState<number>(0);
  const [calculatedAreaSotkas, setCalculatedAreaSotkas] = useState<number>(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  
  // Калибровка GPS
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState<{gps: LatLng, real: LatLng}[]>([]);
  const [calibrationOffset, setCalibrationOffset] = useState<{lat: number, lng: number} | null>(null);
  const [tempCalibrationGPS, setTempCalibrationGPS] = useState<LatLng | null>(null);
  const [tempCalibrationReal, setTempCalibrationReal] = useState({lat: '', lng: ''});

  // Супер-агрессивная GPS функция для максимальной точности
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      playSound('error');
      toast.error('GPS не поддерживается этим браузером');
      return;
    }

    toast.info('🎯 Запускаем СУПЕР-ТОЧНЫЙ GPS режим...');
    
    let attempts = 0;
    const maxAttempts = 10;
    let bestAccuracy = Infinity;
    let bestPosition: GeolocationPosition | null = null;
    let watchId: number | null = null;
    
    const startTime = Date.now();
    const maxWatchTime = 60000; // 1 минута максимум
    
    // Используем watchPosition для непрерывного мониторинга
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        attempts++;
        const accuracy = position.coords.accuracy;
        
        toast.info(`🔄 GPS попытка ${attempts}: ±${accuracy.toFixed(0)}м`);
        
        // Сохраняем лучший результат
        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy;
          bestPosition = position;
          
          const { latitude, longitude } = position.coords;
          const rawLocation = { lat: latitude, lng: longitude };
          const newLocation = applyCalibratedCoordinates(rawLocation);
          
          setCurrentLocation(newLocation);
          setGpsAccuracy(accuracy);
          
          if (accuracy <= 5) {
            // Отличная точность - останавливаем поиск
            if (watchId) navigator.geolocation.clearWatch(watchId);
            playSound('success');
            toast.success(`🎯 СУПЕР-ТОЧНОСТЬ достигнута: ±${accuracy.toFixed(1)}м!`);
            return;
          } else if (accuracy <= 15) {
            // Хорошая точность - продолжаем еще немного
            toast.success(`✅ Отличная точность: ±${accuracy.toFixed(0)}м (ищем лучше...)`);
          } else if (accuracy <= 50) {
            toast.info(`📍 Хорошая точность: ±${accuracy.toFixed(0)}м (ищем лучше...)`);
          } else {
            toast.warning(`⚠️ Точность низкая: ±${accuracy.toFixed(0)}м (продолжаем поиск...)`);
          }
        }
        
        // Останавливаем после максимального времени или попыток
        if (attempts >= maxAttempts || Date.now() - startTime > maxWatchTime) {
          if (watchId) navigator.geolocation.clearWatch(watchId);
          
          if (bestPosition) {
            playSound('gps-beep');
            if (bestAccuracy <= 10) {
              toast.success(`🎯 Лучший результат: ±${bestAccuracy.toFixed(0)}м (${attempts} попыток)`);
            } else if (bestAccuracy <= 50) {
              toast.success(`✅ Финальный результат: ±${bestAccuracy.toFixed(0)}м (${attempts} попыток)`);
            } else {
              toast.warning(`⚠️ Максимальная точность: ±${bestAccuracy.toFixed(0)}м (${attempts} попыток)`);
            }
          } else {
            toast.error('Не удалось получить GPS координаты');
            playSound('error');
          }
        }
      },
      (error) => {
        if (watchId) navigator.geolocation.clearWatch(watchId);
        
        console.error('GPS Error:', error);
        let errorMessage = 'Неизвестная ошибка GPS';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Доступ к геолокации запрещен. Разрешите доступ в настройках браузера.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Местоположение недоступно. Проверьте подключение к интернету.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Время ожидания GPS истекло. Попробуйте еще раз.';
            break;
          default:
            errorMessage = `Ошибка GPS: ${error.message}`;
        }
        
        toast.error(errorMessage);
        playSound('error');
      },
      {
        enableHighAccuracy: true,     // Максимальная точность
        timeout: 60000,              // Увеличиваем таймаут до 1 минуты
        maximumAge: 0                // Никогда не используем кэш
      }
    );
    
    // Автоматическая остановка через минуту
    setTimeout(() => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        if (bestPosition) {
          toast.info(`⏰ Время вышло. Лучший результат: ±${bestAccuracy.toFixed(0)}м`);
        }
      }
    }, maxWatchTime);
  };

  // Fallback GPS метод с пониженной точностью
  const getCurrentLocationFallback = () => {
    if (!navigator.geolocation) {
      playSound('error');
      toast.error('GPS не поддерживается этим браузером');
      return;
    }

    toast.info('📡 Получение GPS координат (терпеливый режим)...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const rawLocation = { lat: latitude, lng: longitude };
        const newLocation = applyCalibratedCoordinates(rawLocation);
        
        setCurrentLocation(newLocation);
        setGpsAccuracy(accuracy);
        
        playSound('gps-beep');
        
        if (accuracy <= 50) {
          toast.success(`✅ GPS получен! Точность: ±${accuracy.toFixed(0)}м`);
        } else if (accuracy <= 200) {
          toast.info(`📍 GPS получен (точность средняя): ±${accuracy.toFixed(0)}м`);
        } else {
          toast.warning(`⚠️ GPS получен (точность низкая): ±${accuracy.toFixed(0)}м`);
        }
      },
      (error) => {
        console.error('GPS Fallback Error:', error);
        playSound('error');
        
        let errorMessage = 'GPS недоступен';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Доступ к GPS запрещен. Разрешите доступ в настройках браузера.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'GPS недоступен. Попробуйте подойти к окну или выйти на улицу.';
            break;
          case error.TIMEOUT:
            errorMessage = 'GPS слишком долго не отвечает. Попробуйте перезагрузить страницу.';
            break;
          default:
            errorMessage = `Ошибка GPS: ${error.message}`;
        }
        
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: false,   // Менее точный, но более стабильный
        timeout: 120000,             // 2 минуты ожидания
        maximumAge: 300000          // Можем использовать кэш до 5 минут
      }
    );
  };

  const addMarker = (lat?: number, lng?: number) => {
    if (lat && lng) {
      // Добавить маркер по координатам
      const newMarker = { lat, lng };
      setMarkers(prev => [...prev, newMarker]);
      playSound('marker-add');
      toast.success(`Маркер добавлен: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } else if (currentLocation) {
      // Добавить маркер по текущему местоположению
      setMarkers(prev => [...prev, currentLocation]);
      playSound('marker-add');
      toast.success('Маркер добавлен по GPS координатам');
    } else {
      playSound('error');
      toast.error('Сначала получите GPS координаты');
    }
  };

  const deleteLastMarker = () => {
    if (markers.length > 0) {
      setMarkers(prev => prev.slice(0, -1));
      toast.info('Последний маркер удален');
    }
  };

  const clearAllMarkers = () => {
    setMarkers([]);
    setCalculatedAreaSqMeters(0);
    setCalculatedAreaSotkas(0);
    toast.info('Все маркеры очищены');
  };

  const calculateAreaFromMarkers = () => {
    if (markers.length < 3) {
      playSound('error');
      toast.error('Для расчета площади нужно минимум 3 маркера');
      return;
    }

    try {
      const areaSqMeters = calculateArea(markers);
      const areaSotkas = convertSqMetersToSotkas(areaSqMeters);
      
      setCalculatedAreaSqMeters(areaSqMeters);
      setCalculatedAreaSotkas(areaSotkas);
      
      playSound('calculate');
      toast.success(`Площадь: ${areaSqMeters.toFixed(1)} м² (${areaSotkas.toFixed(2)} соток)`);
    } catch (error) {
      console.error('Ошибка расчета площади:', error);
      playSound('error');
      toast.error('Ошибка при расчете площади');
    }
  };

  const handleSave = () => {
    if (calculatedAreaSqMeters === 0) {
      toast.error('Сначала рассчитайте площадь');
      return;
    }
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    if (saveMeasurement(saveName, calculatedAreaSqMeters, calculatedAreaSotkas, markers)) {
      toast.success('Измерение сохранено!');
      setShowSaveDialog(false);
      setSaveName('');
      // Очищаем данные после сохранения
      clearAllMarkers();
    } else {
      toast.error('Ошибка при сохранении');
    }
  };

  // Функция для улучшения GPS через IP-геолокацию
  const getLocationByIP = async () => {
    toast.info('🌐 Пробуем определить местоположение по IP...');
    
    try {
      // Используем бесплатный API для определения местоположения по IP
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const newLocation = { lat: data.latitude, lng: data.longitude };
        setCurrentLocation(newLocation);
        setGpsAccuracy(data.accuracy || 1000); // Примерная точность IP-геолокации
        
        playSound('gps-beep');
        toast.success(`🌐 Местоположение по IP: ${data.city}, ${data.region}, ${data.country}`);
        toast.info(`📍 Координаты: ${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`);
      } else {
        toast.error('Не удалось определить местоположение по IP');
      }
    } catch (error) {
      console.error('IP Location Error:', error);
      toast.error('Ошибка при определении местоположения по IP');
    }
  };

  const setManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Введите правильные координаты');
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error('Координаты вне допустимого диапазона');
      return;
    }
    
    const newLocation = { lat, lng };
    setCurrentLocation(newLocation);
    setGpsAccuracy(1); // Ручные координаты - максимальная точность
    setShowManualInput(false);
    setManualLat('');
    setManualLng('');
    
    playSound('success');
    toast.success('✅ Координаты установлены вручную (точность: ±1м)');
  };

  // Функция для калибровки GPS
  const calibrateGPS = () => {
    if (!tempCalibrationGPS) {
      toast.error('Сначала получите GPS координаты');
      return;
    }
    
    const realLat = parseFloat(tempCalibrationReal.lat);
    const realLng = parseFloat(tempCalibrationReal.lng);
    
    if (isNaN(realLat) || isNaN(realLng)) {
      toast.error('Введите правильные реальные координаты');
      return;
    }
    
    // Вычисляем смещение
    const offsetLat = realLat - tempCalibrationGPS.lat;
    const offsetLng = realLng - tempCalibrationGPS.lng;
    
    setCalibrationOffset({ lat: offsetLat, lng: offsetLng });
    setCalibrationPoints(prev => [...prev, {
      gps: tempCalibrationGPS,
      real: { lat: realLat, lng: realLng }
    }]);
    
    setShowCalibration(false);
    setTempCalibrationGPS(null);
    setTempCalibrationReal({lat: '', lng: ''});
    
    playSound('success');
    toast.success(`🎯 Калибровка выполнена! Смещение: ${offsetLat.toFixed(6)}, ${offsetLng.toFixed(6)}`);
    toast.info('Теперь все GPS координаты будут автоматически корректироваться');
  };

  // Применяем калибровку к координатам
  const applyCalibratedCoordinates = (coords: LatLng): LatLng => {
    if (!calibrationOffset) return coords;
    
    return {
      lat: coords.lat + calibrationOffset.lat,
      lng: coords.lng + calibrationOffset.lng
    };
  };

  // Сброс калибровки
  const resetCalibration = () => {
    setCalibrationOffset(null);
    setCalibrationPoints([]);
    toast.info('Калибровка сброшена');
  };

  // Временное сохранение точки калибровки
  const addCalibrationPoint = (isReal: boolean) => {
    if (!currentLocation) return;
    
    const newPoint = { gps: currentLocation, real: currentLocation };
    if (isReal) {
      // Если реальная точка, то просто сохраняем
      setCalibrationPoints(prev => [...prev, newPoint]);
      playSound('success');
      toast.success('Реальная точка сохранена для калибровки');
    } else {
      // Если GPS точка, то сначала получаем текущее местоположение
      setTempCalibrationGPS(currentLocation);
      playSound('gps-beep');
      toast.info('Сейчас получите GPS координаты для калибровки');
    }
  };

  // Подтверждение временной точки калибровки
  const confirmTempCalibration = () => {
    if (!tempCalibrationGPS || !currentLocation) return;
    
    const newPoint = { gps: tempCalibrationGPS, real: currentLocation };
    setCalibrationPoints(prev => [...prev, newPoint]);
    setTempCalibrationGPS(null);
    playSound('success');
    toast.success('Точка калибровки сохранена');
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('gpsMarkerMode')}</h1>
        <Link to="/">
          <SoundButton variant="outline" soundType="click">← {t('home')}</SoundButton>
        </Link>
      </div>

      {/* GPS Status */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">GPS Статус:</span>
          <div className="flex gap-2 flex-wrap">
            <SoundButton onClick={getCurrentLocation} size="sm" soundType="gps-beep">
              🎯 СУПЕР-ТОЧНЫЙ GPS
            </SoundButton>
            <SoundButton onClick={getCurrentLocationFallback} size="sm" variant="outline" soundType="gps-beep">
              📡 Терпеливый GPS
            </SoundButton>
            <SoundButton onClick={getLocationByIP} size="sm" variant="outline" soundType="gps-beep">
              🌐 По IP
            </SoundButton>
            <SoundButton onClick={() => setShowManualInput(true)} size="sm" variant="outline" soundType="click">
              ✏️ Вручную
            </SoundButton>
            <SoundButton onClick={() => setShowCalibration(true)} size="sm" variant="outline" soundType="click">
              🎯 Калибровка
            </SoundButton>
          </div>
        </div>
        {currentLocation ? (
          <div className="text-sm text-green-600">
            📍 Координаты: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            {calibrationOffset && (
              <span className="ml-2 text-blue-600">🎯 (калибровано)</span>
            )}
            {gpsAccuracy && (
              <span className="ml-2">
                {gpsAccuracy <= 10 ? '🎯' : gpsAccuracy <= 100 ? '✅' : '⚠️'}
                ±{gpsAccuracy.toFixed(0)}м
              </span>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">GPS координаты не получены</div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          💡 "СУПЕР-ТОЧНЫЙ GPS" - для максимальной точности, "Терпеливый GPS" - если первый не работает
        </div>
        {calibrationOffset && (
          <div className="text-xs text-blue-600 mt-1">
            🎯 Калибровка активна: смещение {calibrationOffset.lat.toFixed(6)}, {calibrationOffset.lng.toFixed(6)}
            <SoundButton onClick={resetCalibration} size="sm" variant="outline" className="ml-2 text-xs" soundType="click">
              Сбросить
            </SoundButton>
          </div>
        )}
      </div>

      {/* Map */}
      <LeafletMapComponent
        markers={markers}
        center={currentLocation || { lat: 55.7558, lng: 37.6173 }}
        zoom={currentLocation ? 16 : 10}
        mapType="hybrid"
      />

      {/* Controls */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <SoundButton onClick={() => addMarker()} disabled={!currentLocation} soundType="marker-add">
          📍 Поставить маркер
        </SoundButton>
        <SoundButton onClick={deleteLastMarker} variant="outline" disabled={markers.length === 0} soundType="delete">
          🗑️ Удалить последний
        </SoundButton>
        <SoundButton onClick={clearAllMarkers} variant="outline" disabled={markers.length === 0} soundType="delete">
          🧹 Очистить все
        </SoundButton>
        <SoundButton onClick={calculateAreaFromMarkers} disabled={markers.length < 3} soundType="calculate">
          📐 Рассчитать площадь
        </SoundButton>
        <SoundButton onClick={handleSave} disabled={calculatedAreaSqMeters === 0} className="bg-green-600 hover:bg-green-700" soundType="success">
          💾 Сохранить
        </SoundButton>
      </div>

      {/* Results */}
      {calculatedAreaSqMeters > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Результаты измерения:</h3>
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
            Маркеров использовано: {markers.length}
          </div>
        </div>
      )}

      {/* Markers List */}
      {markers.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Маркеры ({markers.length}):</h3>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {markers.map((marker, index) => (
              <div key={index} className="text-xs bg-white p-2 rounded border">
                Маркер {index + 1}: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Информация о калибровке */}
      {calibrationPoints.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">🎯 История калибровки:</h3>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {calibrationPoints.map((point, index) => (
              <div key={index} className="text-xs bg-white p-2 rounded border">
                <div>Точка {index + 1}:</div>
                <div>GPS: {point.gps.lat.toFixed(6)}, {point.gps.lng.toFixed(6)}</div>
                <div>Реальные: {point.real.lat.toFixed(6)}, {point.real.lng.toFixed(6)}</div>
                <div>Смещение: {(point.real.lat - point.gps.lat).toFixed(6)}, {(point.real.lng - point.gps.lng).toFixed(6)}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Точек калибровки: {calibrationPoints.length}
          </div>
        </div>
      )}

      {/* Диалог сохранения */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Сохранить измерение</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название участка:</label>
                <Input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Например: Дачный участок"
                  className="w-full"
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div>Площадь: {calculatedAreaSqMeters.toFixed(1)} м²</div>
                <div>В сотках: {calculatedAreaSotkas.toFixed(2)} соток</div>
                <div>Маркеров: {markers.length}</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <SoundButton onClick={() => setShowSaveDialog(false)} variant="outline" className="flex-1" soundType="click">
                Отмена
              </SoundButton>
              <SoundButton onClick={confirmSave} className="flex-1 bg-green-600 hover:bg-green-700" soundType="success">
                Сохранить
              </SoundButton>
            </div>
          </div>
        </div>
      )}

      {/* Диалог ручного ввода координат */}
      {showManualInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">✏️ Ввести координаты вручную</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Широта (Latitude):</label>
                <Input
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="Например: 48.486810"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Долгота (Longitude):</label>
                <Input
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="Например: 35.179725"
                  className="w-full"
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-medium mb-1">💡 Как получить точные координаты:</div>
                <div>• Откройте Google Maps</div>
                <div>• Найдите нужное место</div>
                <div>• Нажмите правой кнопкой мыши</div>
                <div>• Скопируйте координаты</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <SoundButton onClick={() => setShowManualInput(false)} variant="outline" className="flex-1" soundType="click">
                Отмена
              </SoundButton>
              <SoundButton onClick={setManualCoordinates} className="flex-1 bg-blue-600 hover:bg-blue-700" soundType="success">
                Установить
              </SoundButton>
            </div>
          </div>
        </div>
      )}

      {/* Диалог калибровки GPS */}
      {showCalibration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">🎯 Калибровка GPS</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded text-sm">
                <div className="font-medium mb-2">Инструкция по калибровке:</div>
                <div>1. Встаньте на известную точку</div>
                <div>2. Получите GPS координаты</div>
                <div>3. Введите реальные координаты точки</div>
                <div>4. Система вычислит смещение</div>
              </div>
              
              <div>
                <div className="flex gap-2 mb-2">
                  <SoundButton 
                    onClick={() => {
                      getCurrentLocation();
                      setTimeout(() => {
                        setTempCalibrationGPS(currentLocation);
                      }, 1000);
                    }} 
                    size="sm" 
                    soundType="gps-beep"
                  >
                    📡 Получить GPS
                  </SoundButton>
                  {tempCalibrationGPS && (
                    <span className="text-xs text-green-600 self-center">
                      ✅ GPS: {tempCalibrationGPS.lat.toFixed(6)}, {tempCalibrationGPS.lng.toFixed(6)}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Реальная широта:</label>
                <Input
                  value={tempCalibrationReal.lat}
                  onChange={(e) => setTempCalibrationReal(prev => ({...prev, lat: e.target.value}))}
                  placeholder="Например: 48.460123"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Реальная долгота:</label>
                <Input
                  value={tempCalibrationReal.lng}
                  onChange={(e) => setTempCalibrationReal(prev => ({...prev, lng: e.target.value}))}
                  placeholder="Например: 35.033456"
                  className="w-full"
                />
              </div>
              
              <div className="bg-yellow-50 p-3 rounded text-sm">
                <div className="font-medium mb-1">💡 Как получить точные координаты:</div>
                <div>• Используйте профессиональный GPS-приемник</div>
                <div>• Или найдите точку на Google Earth</div>
                <div>• Используйте геодезические знаки</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <SoundButton onClick={() => setShowCalibration(false)} variant="outline" className="flex-1" soundType="click">
                Отмена
              </SoundButton>
              <SoundButton 
                onClick={calibrateGPS} 
                disabled={!tempCalibrationGPS || !tempCalibrationReal.lat || !tempCalibrationReal.lng}
                className="flex-1 bg-blue-600 hover:bg-blue-700" 
                soundType="success"
              >
                🎯 Калибровать
              </SoundButton>
            </div>
          </div>
        </div>
      )}

      {/* Временная точка калибровки */}
      {tempCalibrationGPS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">📍 Временная точка калибровки</h3>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                Текущие GPS координаты будут использованы как временная точка калибровки.
              </div>
              
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-medium mb-1">Текущие GPS координаты:</div>
                <div>
                  {tempCalibrationGPS.lat.toFixed(6)}, {tempCalibrationGPS.lng.toFixed(6)}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <SoundButton onClick={() => setTempCalibrationGPS(null)} variant="outline" className="flex-1" soundType="click">
                Отмена
              </SoundButton>
              <SoundButton onClick={confirmTempCalibration} className="flex-1 bg-blue-600 hover:bg-blue-700" soundType="success">
                Подтвердить
              </SoundButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GpsMarkerModeSimple;
