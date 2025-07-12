import { LatLng } from '@/types';

/**
 * Calculates the area of a polygon given its vertices using the Shoelace formula.
 * The result is in square meters.
 *
 * @param coordinates An array of LatLng objects representing the vertices of the polygon.
 * @returns The area of the polygon in square meters.
 */
export const calculateArea = (coordinates: LatLng[]): number => {
  if (coordinates.length < 3) {
    return 0; // A polygon must have at least 3 vertices
  }

  let area = 0;
  const R = 6378137; // Earth's radius in meters

  for (let i = 0; i < coordinates.length; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[(i + 1) % coordinates.length]; // Wrap around to the first point

    const x1 = p1.lng * (Math.PI / 180);
    const y1 = Math.log(Math.tan((Math.PI / 4) + (p1.lat * Math.PI / 360)));
    const x2 = p2.lng * (Math.PI / 180);
    const y2 = Math.log(Math.tan((Math.PI / 4) + (p2.lat * Math.PI / 360)));

    area += (x1 * y2 - x2 * y1);
  }

  return Math.abs(area / 2) * (R * R);
};

/**
 * Converts square meters to sotkas.
 * 1 sotka = 100 m²
 * @param sqMeters Area in square meters.
 * @returns Area in sotkas.
 */
export const convertSqMetersToSotkas = (sqMeters: number): number => {
  return sqMeters / 100;
};

/**
 * Calculates the distance between two points using the Haversine formula.
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance in meters
 */
export const calculateDistance = (point1: LatLng, point2: LatLng): number => {
  const R = 6378137; // Earth's radius in meters
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Calculates the perimeter of a polygon.
 * @param coordinates Array of points
 * @returns Perimeter in meters
 */
export const calculatePerimeter = (coordinates: LatLng[]): number => {
  if (coordinates.length < 2) {
    return 0;
  }

  let perimeter = 0;
  for (let i = 0; i < coordinates.length; i++) {
    const current = coordinates[i];
    const next = coordinates[(i + 1) % coordinates.length];
    perimeter += calculateDistance(current, next);
  }

  return perimeter;
};