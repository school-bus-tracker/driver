import geolib from 'geolib';

export const distanceBetweenPoints = (origin, destination) => {
  const distance = geolib.getDistance(origin, destination);
  return distance;
};

export const getPositionWithOffset = (
  {latitude: lat, longitude: lon},
  {dn = 100, de = 100},
) => {
  const R = 6371 * 1000; // Earth Radius in Km * 1000 = meters
  // Coordinate offsets in radians
  const dLat = dn / R;
  const dLon = de / (R * Math.cos((Math.PI * lat) / 180));

  // OffsetPosition, decimal degrees
  const latO = lat + dLat * (180 / Math.PI);
  const lonO = lon + dLon * (180 / Math.PI);

  return {latitude: latO, longitude: lonO};
};

export const getRotationAngle = (previousPosition, currentPosition) => {
  if (previousPosition === null) {
    return 0;
  }
  if (currentPosition === null) {
    return 0;
  }
  const x1 = previousPosition.latitude;
  const y1 = previousPosition.longitude;
  const x2 = currentPosition.latitude;
  const y2 = currentPosition.longitude;

  const xDiff = x2 - x1;
  const yDiff = y2 - y1;

  return (Math.atan2(yDiff, xDiff) * 180.0) / Math.PI;
};
