
import React, { useEffect, useRef, useMemo } from 'react';
import './AcademicBanner.css';

interface AcademicBannerProps {
  color?: [number, number, number];
  amplitude?: number;
  distance?: number;
}

const AcademicBanner: React.FC<AcademicBannerProps> = ({
  color = [0.85, 0.62, 0.2], // Gold color
  amplitude = 0.5,
  distance = 0.15,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const isMobile = useMemo(() => window.innerWidth <= 768, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Flowing threads animation like React Bits
    let time = 0;
    const lineCount = isMobile ? 15 : 30;

    const animate = () => {
      time += 0.005; // Slower animation
      const width = canvas.width / (isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      const height = canvas.height / (isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2));

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < lineCount; i++) {
        const perc = i / lineCount;
        const opacity = (1 - perc) * 0.4;
        
        ctx.strokeStyle = `rgba(${Math.floor(color[0] * 255)}, ${Math.floor(color[1] * 255)}, ${Math.floor(color[2] * 255)}, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        
        const points: [number, number][] = [];
        const step = isMobile ? 10 : 5;
        
        for (let x = 0; x <= width; x += step) {
          const xNorm = x / width;
          
          // Create flowing wave pattern
          const wave1 = Math.sin(xNorm * Math.PI * 3 + time * 2 + perc * 4) * amplitude * 30;
          const wave2 = Math.sin(xNorm * Math.PI * 5 + time * 1.5 + perc * 3) * amplitude * 15;
          const wave3 = Math.cos(xNorm * Math.PI * 2 + time + perc * 2) * amplitude * 20;
          
          const y = height / 2 + (perc - 0.5) * distance * height + wave1 + wave2 + wave3;
          points.push([x, y]);
        }
        
        // Draw smooth curve through points
        if (points.length > 0) {
          ctx.moveTo(points[0][0], points[0][1]);
          
          for (let j = 1; j < points.length - 2; j++) {
            const xc = (points[j][0] + points[j + 1][0]) / 2;
            const yc = (points[j][1] + points[j + 1][1]) / 2;
            ctx.quadraticCurveTo(points[j][0], points[j][1], xc, yc);
          }
          
          if (points.length > 2) {
            ctx.quadraticCurveTo(
              points[points.length - 2][0],
              points[points.length - 2][1],
              points[points.length - 1][0],
              points[points.length - 1][1]
            );
          }
        }
        
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resize);
    };
  }, [color, amplitude, distance, isMobile]);

  return (
    <div className="academic-banner-wrapper">
      <canvas ref={canvasRef} className="academic-banner-canvas" />
      <div className="academic-banner-content">
        <h1 className="academic-banner-title">
          Academic <span className="academic-banner-highlight">Excellence</span>
        </h1>
        <p className="academic-banner-description">
          Comprehensive curriculum designed to challenge, inspire, and prepare students for success in higher education and beyond.
        </p>
      </div>
    </div>
  );
};

export default AcademicBanner;
