const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistanceWithPlural = (distance: number): string => {
  if (distance < 1) {
    const meters = Math.round(distance * 1000);
    return `${meters} ${meters === 1 ? 'm' : 'ms'}`;
  } else if (distance < 100) {
    const km = distance.toFixed(1);
    return `${km} ${distance === 1 ? 'km' : 'kms'}`;
  } else {
    const km = Math.round(distance);
    return `${km} ${km === 1 ? 'km' : 'kms'}`;
  }
};
