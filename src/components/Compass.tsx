import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CompassProps {
  busLocation: { lat: number; lng: number } | null;
  previousLocation: { lat: number; lng: number } | null;
  /** Optional neon gradient colors [start, end] */
  neonGradient?: [string, string];
}

const Compass: React.FC<CompassProps> = ({ busLocation, previousLocation, neonGradient }) => {
  const gradientId = useRef<string>('needleGrad-' + Math.random().toString(36).slice(2, 9));
  const gradient = neonGradient ?? ['#6EE7B7', '#3B82F6'];
  const [direction, setDirection] = useState<string>('N');
  const [degrees, setDegrees] = useState<number>(0);
  const [animatedDeg, setAnimatedDeg] = useState<number>(0);
  const animRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Calculate bearing between two points
  const calculateBearing = (start: { lat: number; lng: number }, end: { lat: number; lng: number }): number => {
    // Handle case where locations are the same or invalid
    if (!start || !end || (start.lat === end.lat && start.lng === end.lng)) {
      return 0;
    }
    
    const startLat = (start.lat * Math.PI) / 180;
    const startLng = (start.lng * Math.PI) / 180;
    const endLat = (end.lat * Math.PI) / 180;
    const endLng = (end.lng * Math.PI) / 180;
    
    const dLng = endLng - startLng;
    
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - 
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    
    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360;
    
    return bearing;
  };

  // Convert bearing to compass direction
  const bearingToDirection = (bearing: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  // Update compass when locations change
  useEffect(() => {
    if (busLocation && previousLocation) {
      const bearing = calculateBearing(previousLocation, busLocation);
      setDegrees(bearing);
      setDirection(bearingToDirection(bearing));
    }
  }, [busLocation, previousLocation]);

  // Smoothly animate the displayed rotation towards the target `degrees`.
  useEffect(() => {
    // cancel previous frame
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const step = () => {
      const current = animRef.current;
      let target = degrees;

      // shortest angular distance
      let delta = ((target - current + 540) % 360) - 180;

      // if very small, snap to target
      if (Math.abs(delta) < 0.3) {
        animRef.current = target;
        setAnimatedDeg(animRef.current);
        return;
      }

      // ease factor
      animRef.current = (current + delta * 0.18 + 360) % 360;
      setAnimatedDeg(animRef.current);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [degrees]);

  return (
    <Card className="bg-card/95 backdrop-blur-md border-border/50">
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium mb-3">Bus Direction</h3>
          
          {/* Compass visualization */}
          <div className="relative w-36 h-36 mb-3 neon-compass animate-glow">
            {/* Outer ring + subtle radial */}
            <div className="compass-ring" />

            {/* Direction markers */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-white">N</div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold text-white">E</div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-white">S</div>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-bold text-white">W</div>

            {/* Moving needle as SVG - rotates smoothly and has neon glow via CSS */}
            <div
              className="needle-wrapper"
              style={{ transform: `translate(-50%, -50%) rotate(${animatedDeg}deg)` }}
            >
              <svg
                className="neon-needle"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={gradientId.current} x1="0" x2="1">
                    <stop offset="0%" stopColor={gradient[0]} />
                    <stop offset="100%" stopColor={gradient[1]} />
                  </linearGradient>
                </defs>
                {/* Arrow shaft */}
                <rect x="30" y="8" width="4" height="32" rx="2" fill={`url(#${gradientId.current})`} />
                {/* Arrow head */}
                <path d="M32 4 L44 24 L32 18 L20 24 Z" fill="#7C3AED" opacity="0.95" />
                {/* Tail circle */}
                <circle cx="32" cy="52" r="4" fill="#ffffff" />
              </svg>
            </div>

            {/* Center glow */}
            <div className="absolute top-1/2 left-1/2 neon-center transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          {/* Direction indicator */}
          <div className="text-center">
            <div className="text-2xl font-bold">{direction}</div>
            <div className="text-xs text-muted-foreground">{Math.round(animatedDeg)}°</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Compass;