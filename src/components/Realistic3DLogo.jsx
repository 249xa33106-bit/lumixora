import React, { useState } from 'react';
import './Realistic3DLogo.css';

/**
 * Realistic3DLogo:
 * Ultra-attractive, photorealistic 3D interactive brand logo for Lumixora.
 * Features:
 * - Dynamic tilt physics following cursor hover
 * - Realistic glass prism refraction & specular highlight band
 * - Layered ambient cyan / purple plasma glow
 * - 3D depth floating animation with shadow expansion
 * - Crisp fallback and customizable sizes
 */
export default function Realistic3DLogo({ 
  size = 'md', 
  interactive = true, 
  showGlow = true,
  className = '',
  onClick 
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const [isHovered, setIsHovered] = useState(false);

  // Size mapping
  const sizeMap = {
    xs: { box: 'w-7 h-7', img: 'w-5 h-5', rounded: 'rounded-lg', glowOffset: 'scale-110' },
    sm: { box: 'w-9 h-9', img: 'w-7 h-7', rounded: 'rounded-xl', glowOffset: 'scale-115' },
    md: { box: 'w-11 h-11', img: 'w-8 h-8', rounded: 'rounded-2xl', glowOffset: 'scale-125' },
    lg: { box: 'w-14 h-14', img: 'w-10 h-10', rounded: 'rounded-2xl', glowOffset: 'scale-130' },
    xl: { box: 'w-20 h-20', img: 'w-14 h-14', rounded: 'rounded-3xl', glowOffset: 'scale-135' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const handleMouseMove = (e) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate subtle 3D tilt angles (max ~18 deg)
    const rotateY = ((x - centerX) / centerX) * 16;
    const rotateX = -((y - centerY) / centerY) * 16;

    setTilt({ x: rotateX, y: rotateY, scale: 1.08 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none group ${className}`}
      style={{ perspective: '800px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* 1. Ambient Dynamic Neon Aurora Glow behind the logo */}
      {showGlow && (
        <div 
          className={`absolute inset-0 rounded-full pointer-events-none transition-all duration-700 ${currentSize.glowOffset} ${
            isHovered ? 'animate-logo-glow' : 'opacity-60'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.55) 0%, rgba(139,92,246,0.35) 45%, rgba(16,185,129,0) 75%)',
            filter: 'blur(16px)',
            zIndex: 0
          }}
        />
      )}

      {/* 2. Glass Base & 3D Interactive Emboss Container */}
      <div 
        className={`relative ${currentSize.box} ${currentSize.rounded} logo-3d-glass border border-cyan-400/30 flex items-center justify-center overflow-hidden transition-transform duration-200 ease-out cursor-pointer z-10 ${
          !isHovered ? 'animate-logo-float' : ''
        }`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale}) translateZ(10px)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Subtle dynamic specular light beam sweep */}
        <div 
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none animate-logo-shimmer"
        />

        {/* Top-rim highlight for physical glass edge reflection */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-80" />

        {/* 3D Realistic Master Logo Image */}
        <img 
          src="/lumixora_logo_3d.png" 
          alt="Lumixora 3D Logo" 
          className={`${currentSize.img} object-contain transition-transform duration-300 pointer-events-none drop-shadow-[0_4px_12px_rgba(6,182,212,0.45)] group-hover:scale-110`}
          loading="eager"
        />

        {/* Inner shadow bottom bevel for tangible realism */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
