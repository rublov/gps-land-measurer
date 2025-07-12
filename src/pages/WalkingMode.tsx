import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MapComponent from '@/components/MapComponent';
import { calculateArea, convertSqMetersToSotkas } from '@/utils/geometry';
import { toast } from 'sonner';
import SaveMeasurementDialog from '@/components/SaveMeasurementDialog';
import { loadSettings } from '@/utils/storage';
import { LatLng } from '@/types';

const WalkingMode = () => {
  const { t } = useTranslation();
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [trackedPath, setTrackedPath] = useState<LatLng[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [calculatedAreaSqMeters, setCalculatedAreaSqMeters] = useState<number>(0);
  const [calculatedAreaSotkas, setCalculatedAreaSotkas] = useState<number>(0);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>(loadSettings().mapType);

  const watchId = useRef<number | null>(null);
  const lastRecordedLocation = useRef<LatLng | null>(null);

  const defaultCenter: LatLng = { lat: 55.7558, lng: 37.6173 };

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
        const newLocation: LatLng = { lat: latitude, lng: longitude };
        setCurrentLocation(newLocation);
        setGpsAccuracy(accuracy);

        if (accuracy > 15) {
          toast.warning(t('weakGpsSignal'), { duration: 3000 });
        }

        if (isMeasuring) {
          if (!lastRecordedLocation.current ||
              (typeof window.google !== 'undefined' && window.google.maps.geometry.spherical.computeDistanceBetween(
                new window.google.maps.LatLng(lastRecordedLocation.current.lat, lastRecordedLocation.current.lng),
                new window.google.maps.LatLng(newLocation.lat, newLocation.lng)
              ) > 1)) {
            setTrackedPath((prev) => {
              const updatedPath = [...prev, newLocation];
              lastRecordedLocation.current = newLocation;
              if (updatedPath.length >= 3) {
                const currentPolygon = [...updatedPath];
                if (currentLocation) {
                  currentPolygon.push(currentLocation);
                }
                const areaSqM = calculateArea(currentPolygon);
                setCalculatedAreaSqMeters(areaSqM);
                setCalculatedAreaSotkas(convertSqMetersToSotkas(areaSqM));
              }
              return updatedPath;
            });
          }
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error(t('gpsAccessError'));
        setIsMeasuring(false);
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
  }, [isMeasuring, t, currentLocation]);

  const handleStartMeasurement = () => {
    setIsMeasuring(true);
    setTrackedPath([]);
    setCalculatedAreaSqMeters(0);
    setCalculatedAreaSotkas(0);
    lastRecordedLocation.current = null;
    toast.info(t('startMeasurement'), { duration: 2000 });
  };

  const handleEndMeasurement = () => {
    setIsMeasuring(false);
    if (trackedPath.length < 3) {
      toast.error(t('insufficientData'));
      setCalculatedAreaSqMeters(0);
      setCalculatedAreaSotkas(0);
      setTrackedPath([]);
      return;
    }
    const areaSqM = calculateArea(trackedPath);
    setCalculatedAreaSqMeters(areaSqM);
    setCalculatedAreaSotkas(convertSqMetersToSotkas(areaSqM));
    toast.success(t('endMeasurement'), { duration: 2000 });
  };

  const handleCancelMeasurement = () => {
    setIsMeasuring(false);
    setTrackedPath([]);
    setCalculatedAreaSqMeters(0);
    setCalculatedAreaSotkas(0);
    lastRecordedLocation.current = null;
    toast.info(t('cancel'), { duration: 2000 });
  };

  const handleOpenSaveDialog = () => {
    if (calculatedAreaSqMeters > 0) {
      setIsSaveDialogOpen(true);
    } else {
      toast.error(t('insufficientData'));
    }
  };

  const handleSaveSuccess = () => {
    setTrackedPath([]);
    setCalculatedAreaSqMeters(0);
    setCalculatedAreaSotkas(0);
  };

  const mapMarkers = isMeasuring && currentLocation ? [...trackedPath, currentLocation] : trackedPath;

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h1 className="text-3xl font-bold mb-4 text-center">{t('walkingMode')}</h1>
      <p className="text-lg mb-4 text-center">
        {t('gpsAccuracy')}: {gpsAccuracy !== null ? `${gpsAccuracy.toFixed(1)} м` : '...'}
      </p>

      <div className="w-full max-w-4xl h-[50vh] mb-6">
        <MapComponent
          markers={mapMarkers}
          center={currentLocation || defaultCenter}
          zoom={currentLocation ? 18 : 10}
          mapType={mapType}
        />
      </div>

      {calculatedAreaSqMeters > 0 && (
        <div className="text-center mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-sm">
          <p className="text-xl font-semibold">{t('currentArea')}:</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {calculatedAreaSotkas.toFixed(2)} {t('sotkas')} ({calculatedAreaSqMeters.toFixed(2)} {t('squareMeters')})
          </p>
        </div>
      )}

      <div className="space-y-4 w-full max-w-sm">
        {!isMeasuring ? (
          <Button className="w-full" onClick={handleStartMeasurement} disabled={!currentLocation}>
            {t('startMeasurement')}
          </Button>
        ) : (
          <>
            <Button className="w-full" variant="secondary" onClick={handleEndMeasurement}>
              {t('endMeasurement')}
            </Button>
            <Button className="w-full" variant="destructive" onClick={handleCancelMeasurement}>
              {t('cancel')}
            </Button>
          </>
        )}
        <Button className="w-full" onClick={handleOpenSaveDialog} disabled={calculatedAreaSqMeters === 0}>
          {t('saveMeasurement')}
        </Button>
      </div>

      <SaveMeasurementDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        areaSqMeters={calculatedAreaSqMeters}
        areaSotkas={calculatedAreaSotkas}
        coordinates={trackedPath}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default WalkingMode;