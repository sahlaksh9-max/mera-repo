
import React from 'react';
import './GlassIcons.css';

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  href?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
  return (
    <div className={`glass-icons-container ${className || ''}`}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href || '#'}
          className="glass-icon-btn"
          aria-label={item.label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="glass-icon-inner">
            {item.icon}
          </span>
        </a>
      ))}
    </div>
  );
};

export default GlassIcons;
