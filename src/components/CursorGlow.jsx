import React, { useEffect, useRef, useState } from 'react';

export const CURSOR_STYLES = [
  { id: 'tom_and_jerry', name: '🐱🐭 Tom & Jerry Cartoon Duo', desc: 'Jerry chases the cheese cursor while Tom playfully chases behind!' },
  { id: 'cyber_rat', name: '🐭 Cyber Rat Pet Companion', desc: 'Cute animated cyber mouse that scurries and chases your cursor' },
  { id: 'neon_spotlight', name: '✨ Cosmic Nebula Spotlight', desc: 'Soft fluid multi-color ambient lighting that illuminates cards' },
  { id: 'fluid_comet', name: '⚡ Fluid Neon Comet Trail', desc: 'Silky glowing laser ribbon with fading cosmic stardust' },
  { id: 'magnetic_ring', name: '🎯 Minimal Magnetic Ring', desc: 'Clean dot with an elastic magnetic glass follower ring' }
];

export default function CursorGlow() {
  const [styleMode, setStyleMode] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_cursor_mode');
      if (saved && CURSOR_STYLES.some(s => s.id === saved)) return saved;
      return 'tom_and_jerry';
    } catch (e) {
      return 'tom_and_jerry';
    }
  });

  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem('lumixora_cursor_glow') !== 'false';
    } catch (e) {
      return true;
    }
  });

  const canvasRef = useRef(null);
  const spotlightRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Synchronize toggle events
  useEffect(() => {
    const handleToggle = (e) => {
      if (e.detail) {
        if (e.detail.enabled !== undefined) setEnabled(e.detail.enabled);
        if (e.detail.mode !== undefined) setStyleMode(e.detail.mode);
      }
    };
    window.addEventListener('lumixora_cursor_glow_toggle', handleToggle);
    return () => window.removeEventListener('lumixora_cursor_glow_toggle', handleToggle);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;

    // Jerry State
    let jerryX = mouseX - 45;
    let jerryY = mouseY - 45;
    let jerryAngle = 0;
    let jerrySpeed = 0;
    let jerryLegCycle = 0;
    let jerryTailWave = 0;

    // Tom State
    let tomX = mouseX - 110;
    let tomY = mouseY - 110;
    let tomAngle = 0;
    let tomSpeed = 0;
    let tomLegCycle = 0;
    let tomTailWave = 0;
    let tomPounceTimer = 0;

    // Cartoon Effects
    let dustPuffs = [];
    let cheeseCrumbs = [];
    let stars = [];

    let isHovering = false;
    let isClicking = false;
    let isVisible = false;

    // Trail points for comet mode
    const trail = [];
    const maxTrail = 22;

    // Particle pool
    const particles = [];

    const handleMouseMove = (e) => {
      isVisible = true;
      targetX = e.clientX;
      targetY = e.clientY;

      const target = e.target;
      const interactive = target && (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute?.('role') === 'button' ||
        target.onclick !== null ||
        target.classList?.contains('cursor-pointer') ||
        target.closest?.('button, a, [role="button"], .cursor-pointer, .glass-panel')
      );
      isHovering = !!interactive;

      // Add cheese crumbs when moving
      if (styleMode === 'tom_and_jerry' && Math.random() > 0.5 && cheeseCrumbs.length < 20) {
        cheeseCrumbs.push({
          x: targetX + (Math.random() - 0.5) * 12,
          y: targetY + (Math.random() - 0.5) * 12,
          alpha: 0.85,
          size: Math.random() * 2 + 1.5,
          color: Math.random() > 0.3 ? '#FFD166' : '#FFAA00'
        });
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
      tomPounceTimer = 25; // Trigger Tom pounce animation

      // Cartoon Star burst on click
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const speed = Math.random() * 4 + 2;
        stars.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 6 + 4,
          alpha: 1,
          rot: Math.random() * Math.PI,
          color: i % 2 === 0 ? '#FFD166' : '#FF007A'
        });
      }
    };

    const handleMouseUp = () => {
      isClicking = false;
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    const handleMouseEnter = () => {
      isVisible = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animId;

    const render = () => {
      animId = requestAnimationFrame(render);

      // Smooth pointer lerp
      const lerp = 0.24;
      mouseX += (targetX - mouseX) * lerp;
      mouseY += (targetY - mouseY) * lerp;

      ringX += (targetX - ringX) * 0.14;
      ringY += (targetY - ringY) * 0.14;

      // ─── 1. MODE: NEON SPOTLIGHT ───
      if (spotlightRef.current) {
        if (styleMode === 'neon_spotlight' && isVisible) {
          const scale = isClicking ? 1.3 : (isHovering ? 1.25 : 1.0);
          const opacity = isHovering ? 0.7 : 0.45;
          spotlightRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${scale})`;
          spotlightRef.current.style.opacity = opacity;
        } else {
          spotlightRef.current.style.opacity = '0';
        }
      }

      // ─── 2. MODE: MAGNETIC RING & DOT ───
      if (dotRef.current) {
        if (styleMode === 'magnetic_ring' && isVisible) {
          dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${isClicking ? 0.6 : 1.0})`;
          dotRef.current.style.opacity = '1';
        } else {
          dotRef.current.style.opacity = '0';
        }
      }

      if (ringRef.current) {
        if (styleMode === 'magnetic_ring' && isVisible) {
          const rScale = isHovering ? 1.8 : 1.0;
          ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${rScale})`;
          ringRef.current.style.opacity = isHovering ? '0.9' : '0.6';
        } else {
          ringRef.current.style.opacity = '0';
        }
      }

      // ─── 3. CANVAS RENDER (Tom & Jerry / Cyber Rat / Comet / Particles) ───
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 🐱🐭 A. TOM & JERRY CARTOON DUO CHASE
        if (styleMode === 'tom_and_jerry' && isVisible) {
          
          // 🧀 1. DRAW CHEESE AT CURSOR
          ctx.save();
          ctx.translate(targetX, targetY);
          ctx.shadowColor = '#FFD166';
          ctx.shadowBlur = 12;
          // Cheese wedge
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(14, 8);
          ctx.lineTo(-14, 8);
          ctx.closePath();
          ctx.fillStyle = '#FFD166';
          ctx.fill();
          ctx.strokeStyle = '#FFAA00';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Cheese holes
          ctx.fillStyle = '#E5A500';
          ctx.beginPath();
          ctx.arc(-2, 2, 2.5, 0, Math.PI * 2);
          ctx.arc(4, 3, 1.8, 0, Math.PI * 2);
          ctx.arc(0, -4, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 🧀 Cheese crumbs trail
          for (let i = cheeseCrumbs.length - 1; i >= 0; i--) {
            const crumb = cheeseCrumbs[i];
            crumb.alpha -= 0.02;
            if (crumb.alpha <= 0) {
              cheeseCrumbs.splice(i, 1);
              continue;
            }
            ctx.save();
            ctx.fillStyle = `rgba(255, 209, 102, ${crumb.alpha})`;
            ctx.beginPath();
            ctx.arc(crumb.x, crumb.y, crumb.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // 🐭 2. JERRY PHYSICS & MOVEMENT (Chasing Cheese)
          const jdx = targetX - jerryX;
          const jdy = targetY - jerryY;
          const jdist = Math.sqrt(jdx * jdx + jdy * jdy);

          const targetJerryAngle = Math.atan2(jdy, jdx);
          let jAngleDiff = targetJerryAngle - jerryAngle;
          while (jAngleDiff < -Math.PI) jAngleDiff += Math.PI * 2;
          while (jAngleDiff > Math.PI) jAngleDiff -= Math.PI * 2;
          jerryAngle += jAngleDiff * 0.22;

          if (jdist > 30) {
            jerrySpeed = Math.min(13, jdist * 0.14);
            jerryX += Math.cos(jerryAngle) * jerrySpeed;
            jerryY += Math.sin(jerryAngle) * jerrySpeed;
            jerryLegCycle += jerrySpeed * 0.45;
            jerryTailWave += jerrySpeed * 0.35;

            // Dust puffs when running
            if (Math.random() > 0.65 && dustPuffs.length < 15) {
              dustPuffs.push({
                x: jerryX - Math.cos(jerryAngle) * 12,
                y: jerryY - Math.sin(jerryAngle) * 12,
                alpha: 0.6,
                size: Math.random() * 4 + 3
              });
            }
          } else {
            jerrySpeed *= 0.7;
            jerryLegCycle = 0;
            jerryTailWave += 0.08;
          }

          // 🐱 3. TOM PHYSICS & MOVEMENT (Chasing Jerry)
          const tdx = jerryX - tomX;
          const tdy = jerryY - tomY;
          const tdist = Math.sqrt(tdx * tdx + tdy * tdy);

          const targetTomAngle = Math.atan2(tdy, tdx);
          let tAngleDiff = targetTomAngle - tomAngle;
          while (tAngleDiff < -Math.PI) tAngleDiff += Math.PI * 2;
          while (tAngleDiff > Math.PI) tAngleDiff -= Math.PI * 2;
          tomAngle += tAngleDiff * 0.16;

          // Tom pounce boost on click
          if (tomPounceTimer > 0) {
            tomPounceTimer--;
            tomSpeed = 16;
            tomX += Math.cos(tomAngle) * tomSpeed;
            tomY += Math.sin(tomAngle) * tomSpeed;
          } else if (tdist > 55) {
            tomSpeed = Math.min(11, tdist * 0.11);
            tomX += Math.cos(tomAngle) * tomSpeed;
            tomY += Math.sin(tomAngle) * tomSpeed;
            tomLegCycle += tomSpeed * 0.4;
            tomTailWave += tomSpeed * 0.3;
          } else {
            tomSpeed *= 0.7;
            tomLegCycle = 0;
            tomTailWave += 0.06;
          }

          // Draw Dust Puffs
          for (let i = dustPuffs.length - 1; i >= 0; i--) {
            const d = dustPuffs[i];
            d.alpha -= 0.03;
            d.size += 0.3;
            if (d.alpha <= 0) {
              dustPuffs.splice(i, 1);
              continue;
            }
            ctx.save();
            ctx.fillStyle = `rgba(220, 220, 240, ${d.alpha})`;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // 🐱 DRAW TOM THE CAT
          ctx.save();
          ctx.translate(tomX, tomY);
          ctx.rotate(tomAngle);

          // Tom's Tail (Grey with white tip)
          ctx.beginPath();
          ctx.moveTo(-24, 0);
          for (let i = 1; i <= 6; i++) {
            const segX = -24 - i * 6;
            const segY = Math.sin(tomTailWave + i * 0.7) * (i * 2.8);
            ctx.lineTo(segX, segY);
          }
          ctx.strokeStyle = '#5D737E';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Tom's running paws
          const tomLegOffset = Math.sin(tomLegCycle) * 7;
          ctx.fillStyle = '#FFFFFF'; // White paws
          ctx.beginPath();
          ctx.arc(10, -12 + tomLegOffset, 3.5, 0, Math.PI * 2);
          ctx.arc(10, 12 - tomLegOffset, 3.5, 0, Math.PI * 2);
          ctx.arc(-14, -12 - tomLegOffset, 4, 0, Math.PI * 2);
          ctx.arc(-14, 12 + tomLegOffset, 4, 0, Math.PI * 2);
          ctx.fill();

          // Tom's Body (Blue-Grey)
          ctx.fillStyle = '#5D737E';
          ctx.beginPath();
          ctx.ellipse(0, 0, 24, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#3C4B53';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Tom's White Chest
          ctx.fillStyle = '#F4F4F9';
          ctx.beginPath();
          ctx.ellipse(6, 0, 10, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tom's Pointed Ears
          ctx.fillStyle = '#5D737E';
          ctx.beginPath();
          ctx.moveTo(6, -10);
          ctx.lineTo(14, -18);
          ctx.lineTo(16, -8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          // Inner ear pink
          ctx.fillStyle = '#FFAAA6';
          ctx.beginPath();
          ctx.moveTo(8, -10);
          ctx.lineTo(13, -16);
          ctx.lineTo(15, -9);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#5D737E';
          ctx.beginPath();
          ctx.moveTo(6, 10);
          ctx.lineTo(14, 18);
          ctx.lineTo(16, 8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFAAA6';
          ctx.beginPath();
          ctx.moveTo(8, 10);
          ctx.lineTo(13, 16);
          ctx.lineTo(15, 9);
          ctx.closePath();
          ctx.fill();

          // Tom's Eyes (Yellow cartoon eyes)
          ctx.fillStyle = '#FFD166';
          ctx.beginPath();
          ctx.arc(14, -5, 3.5, 0, Math.PI * 2);
          ctx.arc(14, 5, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(15, -5, 1.8, 0, Math.PI * 2);
          ctx.arc(15, 5, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Tom's Pink Nose
          ctx.fillStyle = '#FFAAA6';
          ctx.beginPath();
          ctx.arc(22, 0, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Tom's Whiskers
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(18, -3); ctx.lineTo(30, -9);
          ctx.moveTo(18, 3);  ctx.lineTo(30, 9);
          ctx.stroke();

          ctx.restore();

          // 🐭 DRAW JERRY THE MOUSE
          ctx.save();
          ctx.translate(jerryX, jerryY);
          ctx.rotate(jerryAngle);

          // Jerry's Tail (Warm brown / Pinkish)
          ctx.beginPath();
          ctx.moveTo(-16, 0);
          for (let i = 1; i <= 6; i++) {
            const segX = -16 - i * 5;
            const segY = Math.sin(jerryTailWave + i * 0.8) * (i * 2.2);
            ctx.lineTo(segX, segY);
          }
          ctx.strokeStyle = '#C48A5E';
          ctx.lineWidth = 2.2;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Jerry's Scampering Paws
          const jerryLegOffset = Math.sin(jerryLegCycle) * 5;
          ctx.fillStyle = '#E8C5A5';
          ctx.beginPath();
          ctx.arc(7, -8 + jerryLegOffset, 2.2, 0, Math.PI * 2);
          ctx.arc(7, 8 - jerryLegOffset, 2.2, 0, Math.PI * 2);
          ctx.arc(-8, -8 - jerryLegOffset, 2.5, 0, Math.PI * 2);
          ctx.arc(-8, 8 + jerryLegOffset, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Jerry's Body (Classic Warm Brown)
          ctx.fillStyle = '#9E6B43';
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#6E4522';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Jerry's Cream Belly
          ctx.fillStyle = '#E8C5A5';
          ctx.beginPath();
          ctx.ellipse(3, 0, 8, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Jerry's Big Round Ears (Iconic Jerry Ears!)
          ctx.fillStyle = '#9E6B43';
          ctx.beginPath();
          ctx.arc(1, -9, 5.5, 0, Math.PI * 2);
          ctx.arc(1, 9, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner Ear Pink
          ctx.fillStyle = '#FFAAA6';
          ctx.beginPath();
          ctx.arc(1, -9, 3.5, 0, Math.PI * 2);
          ctx.arc(1, 9, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Jerry's Shiny Eyes
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(9, -3.5, 2.5, 0, Math.PI * 2);
          ctx.arc(9, 3.5, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(10, -3.5, 1.4, 0, Math.PI * 2);
          ctx.arc(10, 3.5, 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Jerry's Black Button Nose
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(15, 0, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Jerry's Cute Whiskers
          ctx.strokeStyle = '#6E4522';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(12, -2); ctx.lineTo(20, -6);
          ctx.moveTo(12, 2);  ctx.lineTo(20, 6);
          ctx.stroke();

          ctx.restore();
        }

        // B. Fluid Comet Trail
        if (styleMode === 'fluid_comet' && isVisible) {
          trail.unshift({ x: targetX, y: targetY });
          if (trail.length > maxTrail) trail.pop();

          if (trail.length > 2) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);

            for (let i = 1; i < trail.length - 1; i++) {
              const xc = (trail[i].x + trail[i + 1].x) / 2;
              const yc = (trail[i].y + trail[i + 1].y) / 2;
              ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
            }

            const gradient = ctx.createLinearGradient(trail[0].x, trail[0].y, trail[trail.length - 1].x, trail[trail.length - 1].y);
            gradient.addColorStop(0, 'rgba(0, 245, 212, 0.95)');
            gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.7)');
            gradient.addColorStop(1, 'rgba(255, 0, 122, 0)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = isHovering ? 8 : 5;
            ctx.lineCap = 'round';
            ctx.shadowColor = '#00f5d4';
            ctx.shadowBlur = 14;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Draw Cartoon Click Stars
        for (let i = stars.length - 1; i >= 0; i--) {
          const s = stars[i];
          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= 0.035;
          s.size *= 0.95;
          s.rot += 0.1;

          if (s.alpha <= 0 || s.size <= 0.5) {
            stars.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rot);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8;
          // Draw 4-point star
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.3, -s.size * 0.3);
          ctx.lineTo(s.size, 0);
          ctx.lineTo(s.size * 0.3, s.size * 0.3);
          ctx.lineTo(0, s.size);
          ctx.lineTo(-s.size * 0.3, s.size * 0.3);
          ctx.lineTo(-s.size, 0);
          ctx.lineTo(-s.size * 0.3, -s.size * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled, styleMode]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
      {/* 2D Canvas for Tom & Jerry, Cyber Rat, Comet trails & Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Style: Ambient Fluid Cosmic Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[380px] h-[380px] rounded-full pointer-events-none transition-opacity duration-300 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(0, 245, 212, 0.16) 0%, rgba(105, 56, 239, 0.12) 40%, rgba(236, 72, 153, 0.06) 65%, transparent 80%)',
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
          opacity: 0
        }}
      />

      {/* Style: Minimal Magnetic Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#00f5d4] shadow-[0_0_10px_#00f5d4] pointer-events-none transition-opacity duration-150 will-change-transform"
        style={{ opacity: 0 }}
      />

      {/* Style: Minimal Magnetic Glass Follower Ring */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-9 h-9 rounded-full border border-purple-400/60 bg-purple-500/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(168,85,247,0.3)] pointer-events-none transition-[transform,opacity] duration-150 will-change-transform"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
