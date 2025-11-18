export interface GeoFenceConfig {
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export const FACTORY_GEOFENCE: GeoFenceConfig = {
  latitude: 12.9716,    // sample (to be replaced)
  longitude: 77.5946,   // sample
  radiusMeters: 500,
};

/**
 * Checks if the device is inside the allowed geofence region.
 * 
 * TODO: Integrate with real location service (e.g., expo-location).
 * For now, returns true to not block local development.
 * 
 * Future implementation:
 * - Use expo-location to get current device coordinates
 * - Calculate distance from device to geofence center
 * - Return true if distance <= radiusMeters
 */
export async function isInsideAllowedRegion(config: GeoFenceConfig): Promise<boolean> {
  // TODO: integrate with real location service.
  // For now, return true to not block local development.
  return true;
}

