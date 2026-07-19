import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Confetti({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ['#00f5d4', '#00b4d8', '#7209b7', '#f72585', '#ff9f1c', '#e0f2fe', '#fef08a'];
    const wWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    
    const newParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * wWidth,
      y: -20,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      angle: Math.random() * 360,
      rotateSpeed: Math.random() * 8 - 4
    }));

    setParticles(newParticles);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ 
            x: p.x, 
            y: p.y, 
            rotate: p.angle, 
            opacity: 1 
          }}
          animate={{ 
            y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800, 
            x: p.x + (Math.random() * 160 - 80),
            rotate: p.angle + 360 * p.rotateSpeed,
            opacity: [1, 1, 0.8, 0] 
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * (Math.random() > 0.5 ? 1.5 : 1),
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transformOrigin: 'center'
          }}
        />
      ))}
    </div>
  );
}
