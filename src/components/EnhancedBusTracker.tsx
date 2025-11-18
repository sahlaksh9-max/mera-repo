import React, { useEffect, useState, useRef } from 'react';
import { googleMapsService, type LatLng } from '@/lib/googleMapsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Compass from '@/components/Compass';

interface EnhancedBusTrackerProps {
  busLocation: LatLng | null;
  studentLocation: LatLng | null;
  onGetMyLocation?: () => void;
  isTracking?: boolean;
  previousBusLocation?: LatLng | null;
}

export const EnhancedBusTracker: React.FC<EnhancedBusTrackerProps> = ({
  busLocation,
  studentLocation,
  onGetMyLocation,
  isTracking = false,
  previousBusLocation = null
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const busMarkerRef = useRef<any>(null);
  const homeMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [routePath, setRoutePath] = useState<LatLng[]>([]);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const updateIntervalMs = 50; // default update interval (ms). 50ms gives ~20Hz UI updates per your request.

  // interpolation refs for smooth high-frequency updates
  const lastReceivedRef = useRef<{ lat: number; lng: number } | null>(null);
  const targetRef = useRef<{ lat: number; lng: number } | null>(null);
  const animationStartRef = useRef<number>(0);
  const animationDurationRef = useRef<number>(updateIntervalMs);
  const interpTimerRef = useRef<number | null>(null);
  const [displayedBusPos, setDisplayedBusPos] = useState<LatLng | null>(null);
  const [prevDisplayedBusPos, setPrevDisplayedBusPos] = useState<LatLng | null>(null);

  useEffect(() => {
    googleMapsService.initialize().then((loaded) => {
      setMapsLoaded(loaded);
    });
  }, []);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !busLocation) return;

    const google = googleMapsService.getGoogle();
    if (!google?.maps) return;

    if (!mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: busLocation,
        zoom: 14,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'simplified' }]
          }
        ]
      });
    }

    const busSvgIcon = {
      path: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z',
      fillColor: '#FFD700',
      fillOpacity: 1,
      strokeColor: '#FF8C00',
      strokeWeight: 2,
      scale: 1.8,
      anchor: new google.maps.Point(12, 12),
    };

    const homeSvgIcon = {
      path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
      fillColor: '#FF6347',
      fillOpacity: 1,
      strokeColor: '#FF4500',
      strokeWeight: 2,
      scale: 1.8,
      anchor: new google.maps.Point(12, 12),
    };

    // Initialize or update bus marker with interpolation support
    if (!busMarkerRef.current) {
      busMarkerRef.current = new google.maps.Marker({
        position: busLocation,
        map: mapInstance.current,
        icon: busSvgIcon,
        title: 'Bus Location',
        zIndex: 1000,
        animation: google.maps.Animation.DROP
      });
      // seed interpolation
      lastReceivedRef.current = busLocation;
      targetRef.current = busLocation;
      animationStartRef.current = Date.now();
    } else if (busLocation) {
      // when a new busLocation is received, update interpolation targets
      const now = Date.now();
      lastReceivedRef.current = busMarkerRef.current.getPosition
        ? { lat: busMarkerRef.current.getPosition().lat(), lng: busMarkerRef.current.getPosition().lng() }
        : lastReceivedRef.current ?? busLocation;

      targetRef.current = busLocation;
      animationStartRef.current = now;
      animationDurationRef.current = updateIntervalMs; // animate towards the new point over the interval
    }

    // Clear any previous interpolation loop
    if (interpTimerRef.current) {
      window.clearInterval(interpTimerRef.current);
      interpTimerRef.current = null;
    }

    // Start a periodic interpolation updater (runs every updateIntervalMs)
    interpTimerRef.current = window.setInterval(() => {
      if (!busMarkerRef.current || !targetRef.current) return;

      const start = lastReceivedRef.current ?? targetRef.current;
      const end = targetRef.current;
      const t = Math.min(1, (Date.now() - animationStartRef.current) / Math.max(1, animationDurationRef.current));

      // Linear interpolation; can be replaced with ease if needed
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;

      // update the visual marker on the map
      busMarkerRef.current.setPosition({ lat, lng });

      // update displayed positions for other UI (compass)
      setPrevDisplayedBusPos((prev) => prev ?? displayedBusPos ?? { lat, lng });
      setDisplayedBusPos({ lat, lng });
    }, updateIntervalMs);

  if (studentLocation) {
      if (!homeMarkerRef.current) {
        homeMarkerRef.current = new google.maps.Marker({
          position: studentLocation,
          map: mapInstance.current,
          icon: homeSvgIcon,
          title: 'Your Home',
          zIndex: 999,
          animation: google.maps.Animation.DROP
        });
      } else {
        homeMarkerRef.current.setPosition(studentLocation);
      }

      googleMapsService.getDirections(busLocation, studentLocation).then((route) => {
        if (route && route.path && route.path.length > 0) {
          setDistance(route.distance);
          setDuration(route.duration);
          setRoutePath(route.path);

          if (routePolylineRef.current) {
            routePolylineRef.current.setMap(null);
          }

          routePolylineRef.current = new google.maps.Polyline({
            path: route.path,
            geodesic: true,
            strokeColor: '#3B82F6',
            strokeOpacity: 0.8,
            strokeWeight: 6,
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 3,
                  strokeColor: '#1E40AF',
                  fillColor: '#3B82F6',
                  fillOpacity: 1
                },
                offset: '100%',
                repeat: '150px'
              }
            ]
          });
          routePolylineRef.current.setMap(mapInstance.current);

          const bounds = new google.maps.LatLngBounds();
          route.path.forEach((point) => bounds.extend(point));
          mapInstance.current.fitBounds(bounds);

          setTimeout(() => {
            const currentZoom = mapInstance.current.getZoom();
            if (currentZoom > 15) {
              mapInstance.current.setZoom(15);
            }
          }, 100);
        }
      });

      googleMapsService.getDistanceMatrix([busLocation], [studentLocation]).then((results) => {
        if (results.length > 0 && results[0].length > 0) {
          const result = results[0][0];
          setDistance(result.distance);
          setDuration(result.duration);
        }
      });
    } else {
      mapInstance.current.setCenter(busLocation);
    }
    return () => {
      if (interpTimerRef.current) {
        window.clearInterval(interpTimerRef.current);
        interpTimerRef.current = null;
      }
    };
  }, [mapsLoaded, busLocation, studentLocation]);

  return (
    <Card className="bg-card/95 backdrop-blur-md border-border/50">
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Live Bus Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-3">
        <div 
          ref={mapRef} 
          className="w-full h-[400px] sm:h-[500px] rounded-lg border border-border overflow-hidden"
        />
        
        {/* Compass Component using interpolated/displayed positions so needle follows what user sees */}
        {displayedBusPos && prevDisplayedBusPos && (
          <Compass busLocation={displayedBusPos} previousLocation={prevDisplayedBusPos} />
        )}
        
        {distance && duration && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Distance</div>
                <div className="text-sm font-semibold">{distance}</div>
              </div>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Est. Arrival</div>
                <div className="text-sm font-semibold">{duration}</div>
              </div>
            </div>
          </div>
        )}

        {!studentLocation && onGetMyLocation && (
          <Button 
            onClick={onGetMyLocation} 
            variant="outline" 
            className="w-full"
            disabled={isTracking}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {isTracking ? 'Getting Location...' : 'Get My Location'}
          </Button>
        )}

        {routePath.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Blue route shows the bus path to your location</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};