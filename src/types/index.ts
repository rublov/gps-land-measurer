// Централизованные типы для всего приложения

export interface LatLng {
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

export interface AppSettings {
  language: string;
  units: string; // e.g., 'sotkas_sqmeters'
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

export interface GPSError {
  code: number;
  message: string;
}

export interface MapComponentProps {
  markers: LatLng[];
  center: LatLng;
  zoom: number;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

export interface GeolocationOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

export type MeasurementMode = 'gps-marker' | 'walking' | 'manual';
export type Units = 'sotkas_sqmeters' | 'hectares' | 'acres';
export type Language = 'ru' | 'en';
