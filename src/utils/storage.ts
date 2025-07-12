import { LatLng, Measurement, AppSettings } from '@/types';

export type { Measurement };

const MEASUREMENTS_STORAGE_KEY = 'zemlemer_measurements';
const SETTINGS_STORAGE_KEY = 'zemlemer_settings';

export const saveMeasurement = (measurement: Measurement): void => {
  try {
    const measurements = loadMeasurements();
    measurements.push(measurement);
    localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(measurements));
  } catch (error) {
    console.error("Failed to save measurement to localStorage:", error);
    // In a real app, you might show a toast error here
  }
};

export const loadMeasurements = (): Measurement[] => {
  try {
    const data = localStorage.getItem(MEASUREMENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load measurements from localStorage:", error);
    return [];
  }
};

export const deleteMeasurement = (id: string): void => {
  try {
    let measurements = loadMeasurements();
    measurements = measurements.filter(m => m.id !== id);
    localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(measurements));
  } catch (error) {
    console.error("Failed to delete measurement from localStorage:", error);
  }
};

export const clearAllMeasurements = (): void => {
  try {
    localStorage.removeItem(MEASUREMENTS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear all measurements from localStorage:", error);
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Default settings
    return {
      language: 'ru',
      units: 'sotkas_sqmeters',
      mapType: 'hybrid',
    };
  } catch (error) {
    console.error("Failed to load settings from localStorage:", error);
    return {
      language: 'ru',
      units: 'sotkas_sqmeters',
      mapType: 'hybrid',
    };
  }
};