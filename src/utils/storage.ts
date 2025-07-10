interface LatLng {
  lat: number;
  lng: number;
}

export interface Measurement {
  id: string;
  name: string;
  areaSqMeters: number;
  areaSotkas: number;
  date: string; // ISO string
  coordinates?: LatLng[]; // Optional, for GPS modes
}

const STORAGE_KEY = 'zemlemer_measurements';

export const saveMeasurement = (measurement: Measurement): void => {
  try {
    const measurements = loadMeasurements();
    measurements.push(measurement);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
  } catch (error) {
    console.error("Failed to save measurement to localStorage:", error);
    // In a real app, you might show a toast error here
  }
};

export const loadMeasurements = (): Measurement[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
  } catch (error) {
    console.error("Failed to delete measurement from localStorage:", error);
  }
};

export const clearAllMeasurements = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear all measurements from localStorage:", error);
  }
};