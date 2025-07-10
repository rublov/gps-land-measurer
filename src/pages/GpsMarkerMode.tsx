import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MapComponent from '@/components/MapComponent';
import { calculateArea, convertSqMetersToSotkas } from '@/utils/geometry';
import { toast } from 'sonner';
import SaveMeasurementDialog from '@/components/SaveMeasurementDialog';
import { loadSettings } from '@/utils/storage';

interface LatLng {
  lat: number;
  lng: number;
}

const GpsMarkerMode = () => {
  const { t } = useTranslation();
  const [markers, setMarkers] = useState<LatLng[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [calculatedAreaSqMeters, setCalculatedAreaSqMeters] = useState<number>(0);
  const [calculatedAreaSotkas, setCalculatedAreaSotkas] = useState<number>(0);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>(loadSettings().mapType);

  const watchId = useRef<number | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setMapType(loadSettings().mapType);
    };
    window.addEventListener('storage', handleStorageChange);

    if (typeof navigator !== 'undefined' && !navigator.geolocation) {
      toast.error(t('gpsAccessError'));
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setGpsAccuracy(accuracy);

        if (accuracy > 15) {
          toast.warning(t('weakGpsSignal'), { duration: 3000 });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error(t('gpsAccessError'));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [t]);

  const handlePlaceMarker = () => {
    if (currentLocation) {
      setMarkers((prev) => [...prev, currentLocation]);
    } else {
      toast.error(t('gpsAccessError'));
    }
  };

  const handleDeleteLast = () => {
    setMarkers((prev) => prev.slice(0, -1));
    setCalculatedAreaSqMeters(0);
    setCalculatedAreaSotkas(0);
  };

  const handleClearAll = () => {
    setMarkers([]);
    setCalculatedAreaSqMeters(0);
    setCalculatedAreaSotkas(0);
  };

  const handleCalculateArea = () => {
    if (markers.length < 3) {
      toast.error(t('notEnoughMarkers'));
      return;
    }
    const areaSqM = calculateArea(markers);
    setCalculatedAreaSqMeters(areaSqM);
    setCalculatedAreaSotkas(convertSqMetersToSotkas(areaSqM));
  };

  const handleOpenSaveDialog = () => {
    if (calculatedAreaSqMeters > 0) {
      setIsSaveDialogOpen(true);
    } else {
      toast.error(t('insufficientData'));
    }
  };

  const handleSaveSuccess = () => {
    setMarkers([]);
    setCalculatedAreaSqMeters(0);
    setCalculatedAreaSotkas(0);
  };

  const defaultCenter: LatLng = { lat: 55.7558, lng: 37.6173 };

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h1 className="text-3xl font-bold mb-4 text-center">{t('gpsMarkerMode')}</h1>
      <p className="text-lg mb-4 text-center">
        {t('gpsAccuracy')}: {gpsAccuracy !== null ? `${gpsAccuracy.toFixed(1)} м` : '...'}
      </p>

      <div className="w-full max-w-4xl h-[50vh] mb-6">
        <MapComponent
          markers={markers}
          center={currentLocation || defaultCenter}
          zoom={currentLocation ? 18 : 10}
          mapType={mapType}
        />
      </div>

      {calculatedAreaSqMeters > 0 && (
        <div className="text-center mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-sm">
          <p className="text-xl font-semibold">{t('area')}:</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {calculatedAreaSotkas.toFixed(2)} {t('sotkas')} ({calculatedAreaSqMeters.toFixed(2)} {t('squareMeters')})
          </p>
        </div>
      )}

      <div className="space-y-4 w-full max-w-sm">
        <Button className="w-full" onClick={handlePlaceMarker} disabled={!currentLocation}>
          {t('placeMarker')}
        </Button>
        <Button className="w-full" variant="secondary" onClick={handleDeleteLast} disabled={markers.length === 0}>
          {t('deleteLast')}
        </Button>
        <Button className="w-full" variant="destructive" onClick={handleClearAll} disabled={markers.length === 0}>
          {t('clearAll')}
        </Button>
        <Button className="w-full" onClick={handleCalculateArea} disabled={markers.length < 3}>
          {t('calculateArea')}
        </Button>
        <Button className="w-full" onClick={handleOpenSaveDialog} disabled={calculatedAreaSqMeters === 0}>
          {t('saveMeasurement')}
        </Button>
      </div>

      <SaveMeasurementDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        areaSqMeters={calculatedAreaSqMeters}
        areaSotkas={calculatedAreaSotkas}
        coordinates={markers}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default GpsMarkerMode;