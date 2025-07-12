import { useState, useEffect, useRef, useCallback } from 'react';
import { LatLng, GeolocationOptions } from '@/types';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface UseGPSOptions extends GeolocationOptions {
  watchPosition?: boolean;
  accuracyThreshold?: number;
}

interface GPSState {
  currentLocation: LatLng | null;
  accuracy: number | null;
  isLoading: boolean;
  error: GeolocationPositionError | null;
}

export const useGPS = (options: UseGPSOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000
}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 30000,
    watchPosition = true,
    accuracyThreshold = 15
  } = options;

  const [state, setState] = useState<GPSState>({
    currentLocation: null,
    accuracy: null,
    isLoading: false,
    error: null
  });

  const { handleGPSError } = useErrorHandler();
  const watchId = useRef<number | null>(null);

  const updatePosition = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    
    setState(prev => ({
      ...prev,
      currentLocation: { lat: latitude, lng: longitude },
      accuracy,
      isLoading: false,
      error: null
    }));

    // Предупреждение о низкой точности
    if (accuracy > accuracyThreshold) {
      // Можно добавить дополнительную логику для обработки низкой точности
    }
  }, [accuracyThreshold]);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error
    }));
    handleGPSError(error);
  }, [handleGPSError]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      handleError({
        code: 0,
        message: 'Geolocation is not supported',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      } as GeolocationPositionError);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge
    };

    if (watchPosition) {
      watchId.current = navigator.geolocation.watchPosition(
        updatePosition,
        handleError,
        geoOptions
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        updatePosition,
        handleError,
        geoOptions
      );
    }
  }, [enableHighAccuracy, timeout, maximumAge, watchPosition, updatePosition, handleError]);

  const stopWatching = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  useEffect(() => {
    startWatching();
    return stopWatching;
  }, [startWatching, stopWatching]);

  return {
    ...state,
    startWatching,
    stopWatching,
    isAccurate: state.accuracy !== null && state.accuracy <= accuracyThreshold
  };
};
