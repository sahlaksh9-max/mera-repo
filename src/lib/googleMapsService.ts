export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  path: LatLng[];
}

export interface DistanceMatrixResult {
  distance: string;
  duration: string;
  distanceValue: number;
  durationValue: number;
}

class GoogleMapsService {
  private google: any = null;

  async initialize() {
    if ((window as any).google?.maps) {
      this.google = (window as any).google;
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const checkInterval = setInterval(() => {
        if ((window as any).google?.maps) {
          this.google = (window as any).google;
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!this.google) {
          console.warn('Google Maps failed to load');
          resolve(false);
        }
      }, 10000);
    });
  }

  getGoogle() {
    return this.google || (window as any).google;
  }

  async geocodeAddress(address: string): Promise<LatLng | null> {
    const google = this.getGoogle();
    if (!google?.maps) return null;

    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address });
      
      if (result.results && result.results.length > 0) {
        const location = result.results[0].geometry.location;
        return { lat: location.lat(), lng: location.lng() };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    const google = this.getGoogle();
    if (!google?.maps) return null;

    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ location: { lat, lng } });
      
      if (result.results && result.results.length > 0) {
        return result.results[0].formatted_address;
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  async getDirections(origin: LatLng, destination: LatLng): Promise<RouteInfo | null> {
    const google = this.getGoogle();
    if (!google?.maps) return null;

    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING
      });
      
      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        const leg = route.legs[0];
        const path = route.overview_path || [];
        const decodedPath = path.map((p: any) => ({
          lat: typeof p.lat === 'function' ? p.lat() : p.lat,
          lng: typeof p.lng === 'function' ? p.lng() : p.lng
        }));
        return {
          distance: leg.distance?.text || '',
          duration: leg.duration?.text || '',
          path: decodedPath
        };
      }
      return null;
    } catch (error) {
      console.error('Directions error:', error);
      return null;
    }
  }

  async getComputedRoutes(origin: LatLng, destination: LatLng): Promise<any> {
    return this.getDirections(origin, destination);
  }

  async getDistanceMatrix(origins: LatLng[], destinations: LatLng[]): Promise<DistanceMatrixResult[][]> {
    const google = this.getGoogle();
    if (!google?.maps) return [];

    try {
      const service = new google.maps.DistanceMatrixService();
      const result = await service.getDistanceMatrix({
        origins: origins.map(o => new google.maps.LatLng(o.lat, o.lng)),
        destinations: destinations.map(d => new google.maps.LatLng(d.lat, d.lng)),
        travelMode: google.maps.TravelMode.DRIVING
      });
      
      if (result.rows) {
        return result.rows.map((row: any) => 
          row.elements.map((element: any) => ({
            distance: element.distance?.text || '',
            duration: element.duration?.text || '',
            distanceValue: element.distance?.value || 0,
            durationValue: element.duration?.value || 0
          }))
        );
      }
      return [];
    } catch (error) {
      console.error('Distance Matrix error:', error);
      return [];
    }
  }

  decodePolyline(encoded: string): LatLng[] {
    const points: LatLng[] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return points;
  }

  calculateDistance(point1: LatLng, point2: LatLng): number {
    const R = 6371;
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
      Math.cos(this.toRad(point2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  createBusIcon(): string {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" fill="%234169E1"/>
        <path d="M4 9h16M9 9v11M15 9v11" stroke="%23FFD700"/>
        <circle cx="9" cy="19" r="1" fill="%23FFD700"/>
        <circle cx="15" cy="19" r="1" fill="%23FFD700"/>
      </svg>
    `)}`;
  }

  createHomeIcon(): string {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23FF4500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="%23FF6347" stroke="%23FF4500"/>
        <polyline points="9 22 9 12 15 12 15 22" stroke="%23FF4500" fill="%23FFE4B5"/>
      </svg>
    `)}`;
  }
}

export const googleMapsService = new GoogleMapsService();
