export interface LocationEvent {
  id: string;
  userId: string;
  timestamp: string;
  eventType: 'ZONE_ENTER' | 'ZONE_EXIT';
  location: {
    Name: string;
  };
}

export interface LocationPoint {
  lat: number;
  lng: number;
  intensity: number;
} 