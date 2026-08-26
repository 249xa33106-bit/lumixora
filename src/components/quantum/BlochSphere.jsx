import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, BarChart2, Zap, ArrowRight } from 'lucide-react';

const R = 90; // Radius for Bloch Sphere

const getBlochCoords = (theta, phi) => {
  // Spherical to Cartesian
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  // Isometric Projection
  // X axis: bottom-left, Y axis: bottom-right, Z axis: up
  const angle30 = Math.PI / 6;
  const screenX = (y - x) * Math.cos(angle30) * R;
  const screenY = (-z + (x + y) * Math.sin(angle30)) * R;
  return { x: screenX, y: screenY, zIndex: x + y }; // zIndex for depth sorting if needed
};

const BlochSphere = ({ theta, phi }) => {
  const { x, y } = getBlochCoords(theta, phi);

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[250px]">
      <svg width="240" height="240" viewBox="-120 -120 240 240" className="overflow-visible">
        <defs>
          <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.1)" />
            <stop offset="100%" stopColor="rgba(30, 41, 59, 0.6)" />
          </radialGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Sphere Background / Outline */}
        <circle cx="0" cy="0" r={R} fill="url(#sphereGlow)" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" />
        
        {/* Equator */}
        <ellipse cx="0" cy="0" rx={R} ry={R * 0.4} fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <ellipse cx="0" cy="0" rx={R * 0.4} ry={R} fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" strokeDasharray="4 4" transform="rotate(60)" />
        <ellipse cx="0" cy="0" rx={R * 0.4} ry={R} fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" strokeDasharray="4 4" transform="rotate(-60)" />

        {/* Axes */}
        <line x1="0" y1={-R} x2="0" y2={R} stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1" /> {/* Z */}
        <text x="0" y={-R - 10} fill="#94a3b8" fontSize="12" textAnchor="middle">|0⟩ (Z)</text>
        <text x="0" y={R + 15} fill="#94a3b8" fontSize="12" textAnchor="middle">|1⟩ (-Z)</text>

        {/* X Axis */}
        <line x1={R * Math.cos(Math.PI/6)} y1={-R * Math.sin(Math.PI/6)} x2={-R * Math.cos(Math.PI/6)} y2={R * Math.sin(Math.PI/6)} stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1" />
        <text x={-R * Math.cos(Math.PI/6) - 15} y={R * Math.sin(Math.PI/6) + 15} fill="#94a3b8" fontSize="12" textAnchor="middle">|+⟩ (X)</text>

        {/* Y Axis */}
        <line x1={-R * Math.cos(Math.PI/6)} y1={-R * Math.sin(Math.PI/6)} x2={R * Math.cos(Math.PI/6)} y2={R * Math.sin(Math.PI/6)} stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1" />
        <text x={R * Math.cos(Math.PI/6) + 15} y={R * Math.sin(Math.PI/6) + 15} fill="#94a3b8" fontSize="12" textAnchor="middle">|i⟩ (Y)</text>

        {/* State Vector */}
        <motion.line
          x1="0" y1="0"
          animate={{ x2: x, y2: y }}
          transition={{ type: 'spring', damping: 15, stiffness: 60 }}
          stroke="#f97316"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#neonGlow)"
        />
        <motion.circle
          animate={{ cx: x, cy: y }}
          transition={{ type: 'spring', damping: 15, stiffness: 60 }}
          r="6"
          fill="#fff"
          stroke="#f97316"
          strokeWidth="2"
          filter="url(#neonGlow)"
        />
      </svg>
    </div>
  );
};

export default BlochSphere;
