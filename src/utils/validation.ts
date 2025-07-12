import { LatLng } from '@/types';

export const validateLatLng = (coords: LatLng): boolean => {
  const { lat, lng } = coords;
  
  // Проверка диапазона широты (-90 до 90)
  if (lat < -90 || lat > 90) {
    return false;
  }
  
  // Проверка диапазона долготы (-180 до 180)
  if (lng < -180 || lng > 180) {
    return false;
  }
  
  // Проверка на NaN
  if (isNaN(lat) || isNaN(lng)) {
    return false;
  }
  
  return true;
};

export const validateCoordinatesArray = (coords: LatLng[]): boolean => {
  if (!Array.isArray(coords) || coords.length < 3) {
    return false;
  }
  
  return coords.every(validateLatLng);
};

export const validateArea = (area: number): boolean => {
  return !isNaN(area) && isFinite(area) && area > 0;
};

export const validateMeasurementName = (name: string): boolean => {
  return typeof name === 'string' && name.trim().length > 0 && name.length <= 100;
};

export const validateGPSAccuracy = (accuracy: number): boolean => {
  return !isNaN(accuracy) && accuracy > 0 && accuracy < 1000; // Максимум 1км точность
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const formatCoordinates = (coords: LatLng): string => {
  return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
};

export const formatArea = (area: number, decimals: number = 2): string => {
  return area.toFixed(decimals);
};

export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};
