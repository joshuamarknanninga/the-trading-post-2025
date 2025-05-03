// trading-post-mobile/src/utils/geolocation.ts

/**
 * Utility functions for geographic calculations:
 * - Haversine distance
 * - Midpoint between two coordinates
 * - Destination point given bearing & distance
 * - Bounding box for radius searches
 */

const EARTH_RADIUS_KM = 6371.0;

export type Coordinates = {
  latitude: number;
  longitude: number;
};

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function calculateDistance(
  a: Coordinates,
  b: Coordinates,
  unit: 'km' | 'miles' = 'km'
): number {
  const φ1 = toRadians(a.latitude);
  const λ1 = toRadians(a.longitude);
  const φ2 = toRadians(b.latitude);
  const λ2 = toRadians(b.longitude);

  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;

  const sinΔφ2 = Math.sin(Δφ / 2);
  const sinΔλ2 = Math.sin(Δλ / 2);

  const h =
    sinΔφ2 * sinΔφ2 +
    Math.cos(φ1) * Math.cos(φ2) * sinΔλ2 * sinΔλ2;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  const distKm = EARTH_RADIUS_KM * c;

  return unit === 'miles' ? distKm * 0.621371 : distKm;
}

export function calculateMidpoint(
  a: Coordinates,
  b: Coordinates
): Coordinates {
  const φ1 = toRadians(a.latitude);
  const λ1 = toRadians(a.longitude);
  const φ2 = toRadians(b.latitude);
  const Δλ = toRadians(b.longitude - a.longitude);

  const Bx = Math.cos(φ2) * Math.cos(Δλ);
  const By = Math.cos(φ2) * Math.sin(Δλ);

  const φm = Math.atan2(
    Math.sin(φ1) + Math.sin(φ2),
    Math.sqrt((Math.cos(φ1) + Bx) ** 2 + By ** 2)
  );
  const λm = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

  return { latitude: toDegrees(φm), longitude: toDegrees(λm) };
}

export function destinationPoint(
  start: Coordinates,
  bearingDeg: number,
  distanceKm: number
): Coordinates {
  const δ = distanceKm / EARTH_RADIUS_KM;
  const θ = toRadians(bearingDeg);

  const φ1 = toRadians(start.latitude);
  const λ1 = toRadians(start.longitude);

  const sinφ1 = Math.sin(φ1);
  const cosφ1 = Math.cos(φ1);
  const sinδ = Math.sin(δ);
  const cosδ = Math.cos(δ);

  const φ2 = Math.asin(
    sinφ1 * cosδ + cosφ1 * sinδ * Math.cos(θ)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * sinδ * cosφ1,
      cosδ - sinφ1 * Math.sin(φ2)
    );

  return { latitude: toDegrees(φ2), longitude: toDegrees(λ2) };
}

export function boundingBox(
  center: Coordinates,
  radiusKm: number
): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
  const latDelta = radiusKm / 111.32;
  const lonDelta =
    radiusKm / (111.32 * Math.cos(toRadians(center.latitude)));

  return {
    minLat: center.latitude - latDelta,
    maxLat: center.latitude + latDelta,
    minLon: center.longitude - lonDelta,
    maxLon: center.longitude + lonDelta,
  };
}

export function isPointInRadius(
  point: Coordinates,
  center: Coordinates,
  radiusKm: number
): boolean {
  return calculateDistance(point, center) <= radiusKm;
}
