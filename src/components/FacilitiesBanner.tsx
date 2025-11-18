
import React from 'react';
import PixelBlast from './PixelBlast';
import './FacilitiesBanner.css';

const FacilitiesBanner: React.FC = () => {
  return (
    <div className="facilities-banner-wrapper">
      <PixelBlast
        variant="circle"
        pixelSize={3}
        color="#D4AF37"
        patternScale={2}
        patternDensity={1}
        enableRipples={true}
        rippleIntensityScale={1.2}
        rippleSpeed={0.3}
        speed={0.5}
        edgeFade={0.15}
        transparent={true}
        autoPauseOffscreen={true}
      />
      <div className="facilities-banner-content">
        <h1 className="facilities-banner-title">
          World-Class <span className="facilities-banner-highlight">Facilities</span>
        </h1>
        <p className="facilities-banner-description">
          Experience learning in state-of-the-art facilities designed to inspire, innovate, and excel in every aspect of education.
        </p>
      </div>
    </div>
  );
};

export default FacilitiesBanner;
