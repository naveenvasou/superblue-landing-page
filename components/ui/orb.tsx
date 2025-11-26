import React from 'react';

interface OrbProps {
  color1: string;
  color2: string;
  
}

const Orb: React.FC<OrbProps> = ({ color1, color2 }) => {
  // Use CSS variables for dynamic colors
  const style = {
    '--color-primary-start': color1,
    '--color-primary-end': color2,
  } as React.CSSProperties; // Assert type for CSS variables

  return (
    <div 
      className="relative w-full h-full" 
      style={style}
    >
      {/* Define custom animations and gradients using a style block or ensure these utility classes 
        are defined globally in your project's CSS/Tailwind configuration. 
      */}
      
      
      {/* Main orb with gradient */}
      <div className="absolute inset-0 rounded-full orb-gradient-1 animate-pulse-orb"></div>
      
 
      {/* Rotating gradient overlay */}
      <div className="absolute inset-0 rounded-full orb-gradient-2 opacity-60 animate-spin-orb"></div>
      
      {/* Inner glow */}
      <div className="absolute rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute -inset-full animate-shimmer-orb"></div>
      </div>
    </div>
  );
};

export default Orb;