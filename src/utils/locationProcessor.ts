import type { LocationEvent } from '../types/location';

const locations = [
  'ALIVE LAB',
  'Red River Town',
  'Checker Board Farm',
  'Sugar Factory',
  'Southern Woods'
];

export function processUserData(events: LocationEvent[]) {
  const userEvents = events.reduce((acc, event) => {
    if (!acc[event.userId]) {
      acc[event.userId] = [];
    }
    acc[event.userId].push(event);
    return acc;
  }, {} as Record<string, LocationEvent[]>);

  return Object.entries(userEvents).map(([userId, userEvents]) => {
    const locationCounts = locations.map(location => {
      const count = userEvents.filter(event => 
        event.location.Name === location && 
        event.eventType === 'ZONE_ENTER'
      ).length;
      return count;
    });

    return {
      userId,
      data: locationCounts,
    };
  });
}

export function getLocationData() {
  return {
    locations,
    xAxis: [{
      data: locations,
      scaleType: 'band' as const,
    }],
    yAxis: [{
      data: ['Zone Entries'],
      scaleType: 'band' as const,
    }],
  };
} 