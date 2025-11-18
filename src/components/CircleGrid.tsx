import { useState, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { Button } from './ui/button';

interface CircleGridProps {
  image: string;
  onSave: (processedImage: string) => void;
  onCancel: () => void;
}

const CircleGrid = ({ image, onSave, onCancel }: CircleGridProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    setPosition({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y
    });
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleSave = () => {
    if (!containerRef.current) return;
    
    // Create a canvas to capture the processed image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = 300; // Fixed size for profile photos
    canvas.width = size;
    canvas.height = size;
    
    const img = new Image();
    img.src = image;
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.clip();
      
      // Apply transformations
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.translate(-img.width / 2, -img.height / 2);
      
      // Draw image
      ctx.drawImage(
        img,
        (size / 2 - img.width * scale / 2) / scale,
        (size / 2 - img.height * scale / 2) / scale
      );
      
      ctx.restore();
      
      // Return processed image
      onSave(canvas.toDataURL('image/jpeg', 0.9));
    };
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-card rounded-xl p-6 w-full max-w-md border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Adjust Profile Photo</h3>
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="space-y-4">
          {/* Image Preview with Grid */}
          <div 
            ref={containerRef}
            className="relative w-full h-64 rounded-lg overflow-hidden bg-muted border border-border cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={image}
                alt="Profile preview"
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                  transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease'
                }}
              />
            </div>
            
            {/* Circular overlay grid */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 rounded-full border-4 border-white/50"></div>
              <div className="absolute inset-4 rounded-full border-2 border-white/30"></div>
              <div className="absolute inset-8 rounded-full border border-white/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-dashed border-white/40"></div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Zoom Out</span>
            </Button>
            
            <div className="flex items-center px-3 py-1 bg-muted rounded-md text-sm">
              {Math.round(scale * 100)}%
            </div>
            
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 3}>
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoom In</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="h-4 w-4" />
              <span className="sr-only">Rotate</span>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-black">
              <Check className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleGrid;