interface LatLng {
  lat: number;
  lng: number;
}

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