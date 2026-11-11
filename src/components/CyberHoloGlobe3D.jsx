import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, Globe, Compass, GraduationCap, Users, Cpu, ShieldCheck, 
  Flame, Zap, Trophy, Play, CheckCircle2, ChevronRight, Award, ExternalLink,
  Building2, Briefcase, Eye, Activity, Radio, Share2
} from 'lucide-react';

/**
 * CyberHoloGlobe3D - Clean Focused 3D Sphere Experience:
 * Features:
 * 1. Clean full-width interactive 3D WebGL sphere with Indian campus nodes & laser flight arcs.
 * 2. 3D Floating billboard tags directly in WebGL space over campus beacons.
 * 3. Compact overlay telemetry badge for active campus placement stats.
 * 4. Removed the redundant left-side vertical campus list so the 3D globe shines without clutter.
 */
export default function CyberHoloGlobe3D({ onSelectCampus }) {
  const containerRef = useRef(null);
  const globeGroupRef = useRef(null);
  const photonParticlesRef = useRef([]);
  const [activeBeacon, setActiveBeacon] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Accredited Institutional Campus Nodes with rich placement & logo data
  const CAMPUSES = [
    { 
      id: 1, 
      code: 'GPREC',
      name: 'G. Pulla Reddy Engineering College', 
      short: 'GPREC Autonomous',
      city: 'Kurnool', 
      lat: 15.8281, 
      lon: 78.0373, 
      scholars: '240+ Active', 
      color: '#06b6d4', 
      glow: 'rgba(6, 182, 212, 0.4)',
      badge: 'Premier Pilot Core',
      accreditation: 'Autonomous • NAAC A+',
      est: 'Est. 1985',
      topOffer: '₹14.5 LPA (Amazon SDE)', 
      companies: ['Amazon', 'TCS Digital', 'Infosys SP', 'Cognizant GenC'],
      activeDrives: 'TCS NQT & Amazon Summer Internship',
      notesAvailable: '420+ Unit Notes',
      hiringRate: '94% Placement Rate'
    },
    { 
      id: 2, 
      code: 'AWEC',
      name: "Ashoka Women's Engineering College", 
      short: "Ashoka Women's Engg",
      city: 'Kurnool', 
      lat: 15.8150, 
      lon: 78.0450, 
      scholars: '145+ Active', 
      color: '#ec4899', 
      glow: 'rgba(236, 72, 153, 0.4)',
      badge: 'Women in Tech Node',
      accreditation: 'AICTE Approved • JNTUA',
      est: 'Est. 2008',
      topOffer: '₹10.5 LPA (Capgemini)', 
      companies: ['Capgemini', 'Wipro Turbo', 'TCS Ninja', 'Tech Mahindra'],
      activeDrives: 'Women in Tech Hackathon & Capgemini Exceller',
      notesAvailable: '185+ Unit Notes',
      hiringRate: '88% Placement Rate'
    },
    { 
      id: 3, 
      code: 'RGUKT',
      name: 'RGUKT RK Valley (IIIT)', 
      short: 'RGUKT RK Valley (IIIT)',
      city: 'Idupulapaya', 
      lat: 14.3312, 
      lon: 78.5375, 
      scholars: '110+ Active', 
      color: '#a855f7', 
      glow: 'rgba(168, 85, 247, 0.4)',
      badge: 'AI Research Hub',
      accreditation: 'Premier State IIIT University',
      est: 'IIIT Campus',
      topOffer: '₹16.0 LPA (ThoughtWorks)', 
      companies: ['ThoughtWorks', 'Zoho', 'Capgemini', 'Hexaware'],
      activeDrives: 'Zoho Full Stack Drive & Tech Round Prep',
      notesAvailable: '310+ Unit Notes',
      hiringRate: '96% Placement Rate'
    },
    { 
      id: 4, 
      code: 'AITS',
      name: 'Annamacharya University (AITS)', 
      short: 'Annamacharya Univ',
      city: 'Rajampet', 
      lat: 14.1952, 
      lon: 79.1558, 
      scholars: '65+ Active', 
      color: '#10b981', 
      glow: 'rgba(16, 185, 129, 0.4)',
      badge: 'Engineering Core',
      accreditation: 'UGC Autonomous • NAAC A',
      est: 'Est. 1998',
      topOffer: '₹9.0 LPA (Virtusa Tech)', 
      companies: ['Virtusa', 'Accenture', 'HCLTech', 'Tech Mahindra'],
      activeDrives: 'Virtusa Neural Hack & Accenture Prep',
      notesAvailable: '215+ Unit Notes',
      hiringRate: '89% Placement Rate'
    },
    { 
      id: 5, 
      code: 'SVCE',
      name: 'Sri Venkateswara College of Engg (SVCE)', 
      short: 'SVCE Tirupati',
      city: 'Tirupati', 
      lat: 13.6288, 
      lon: 79.4192, 
      scholars: '35+ Active', 
      color: '#f59e0b', 
      glow: 'rgba(245, 158, 11, 0.4)',
      badge: 'Cloud Cohort',
      accreditation: 'Autonomous • JNTUA',
      est: 'Est. 2007',
      topOffer: '₹8.5 LPA (LTI Mindtree)', 
      companies: ['LTI Mindtree', 'Infosys', 'Kyndryl'],
      activeDrives: 'LTI Mindtree Ignite Assessment',
      notesAvailable: '140+ Unit Notes',
      hiringRate: '86% Placement Rate'
    },
    { 
      id: 6, 
      code: 'NEC',
      name: 'Narayana Engineering College (NEC)', 
      short: 'Narayana Nellore',
      city: 'Nellore', 
      lat: 14.4426, 
      lon: 79.9865, 
      scholars: '20+ Active', 
      color: '#3b82f6', 
      glow: 'rgba(59, 130, 246, 0.4)',
      badge: 'Placement Cell',
      accreditation: 'Autonomous • NBA Accredited',
      est: 'Est. 2001',
      topOffer: '₹7.5 LPA (TCS Ninja)', 
      companies: ['TCS', 'Wipro', 'Mindgate'],
      activeDrives: 'TCS Foundation & Advanced Round',
      notesAvailable: '90+ Unit Notes',
      hiringRate: '84% Placement Rate'
    },
    { 
      id: 7, 
      code: 'MITS',
      name: 'MITS DEEMED TO BE UNIVERSITY', 
      short: 'MITS Madanapalle',
      city: 'Madanapalle', 
      lat: 13.5560, 
      lon: 78.5010, 
      scholars: '140+ Active', 
      color: '#06b6d4', 
      glow: 'rgba(6, 182, 212, 0.4)',
      badge: 'Innovation Hub',
      accreditation: 'Deemed University • NAAC A+',
      est: 'Est. 1998',
      topOffer: '₹24.0 LPA (Amazon / Cisco)', 
      companies: ['Amazon', 'Cisco', 'Cognizant', 'TCS Prime'],
      activeDrives: 'MITS Innovation Track & Campus Placements',
      notesAvailable: '240+ Unit Notes',
      hiringRate: '92% Placement Rate'
    },
  ];

  useEffect(() => {
    if (!activeBeacon) {
      setActiveBeacon(CAMPUSES[0]);
    }
  }, []);

  // Helper: Create 2D Text Canvas Sprite for 3D Globe Labeling
  const createTextSprite = (text, color) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Background pill
    ctx.fillStyle = 'rgba(6, 12, 30, 0.85)';
    ctx.roundRect ? ctx.roundRect(10, 10, 236, 44, 22) : ctx.fillRect(10, 10, 236, 44);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Text label
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(16, 4, 1);
    return sprite;
  };

  // Smoothly rotate globe to face clicked campus!
  const rotateToCampus = (campus) => {
    setActiveBeacon(campus);
    const globe = globeGroupRef.current;
    if (!globe) return;

    const targetY = -((campus.lon + 180) * (Math.PI / 180)) + Math.PI / 2;
    const targetX = ((90 - campus.lat) * (Math.PI / 180)) - Math.PI / 2;

    let step = 0;
    const startX = globe.rotation.x;
    const startY = globe.rotation.y;

    const animateRotation = () => {
      step += 0.045;
      globe.rotation.x = THREE.MathUtils.lerp(startX, targetX, step);
      globe.rotation.y = THREE.MathUtils.lerp(startY, targetY, step);
      if (step < 1) {
        requestAnimationFrame(animateRotation);
      }
    };
    animateRotation();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Three.js Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 215;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // 2a. Inner Translucent Core Sphere with Atmospheric Rim
    const coreGeo = new THREE.SphereGeometry(68, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x050a1a,
      transparent: true,
      opacity: 0.94
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 2b. Outer Atmospheric Holographic Glow Layer (Fresnel-like)
    const glowGeo = new THREE.SphereGeometry(75, 36, 36);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00d8f6,
      transparent: true,
      opacity: 0.12,
      wireframe: false,
      blending: THREE.AdditiveBlending
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // 2c. Cybernetic Hex-Wireframe Cage
    const wireGeo = new THREE.SphereGeometry(70.8, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // 2d. Particle Point Cloud Surface (Star Clusters with Golden Spiral)
    const particleCount = 2600;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const radius = 72;
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const rand = Math.random();
      if (rand > 0.6) {
        particleColors[i * 3] = 0.05;
        particleColors[i * 3 + 1] = 0.85;
        particleColors[i * 3 + 2] = 0.98; // Neon Cyan
      } else if (rand > 0.28) {
        particleColors[i * 3] = 0.70;
        particleColors[i * 3 + 1] = 0.35;
        particleColors[i * 3 + 2] = 0.98; // Purple Violet
      } else {
        particleColors[i * 3] = 0.98;
        particleColors[i * 3 + 1] = 0.78;
        particleColors[i * 3 + 2] = 0.22; // Radiant Gold
      }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // 2e. Multi-layered Orbital Rings (Laser Accelerator)
    const ringGeo = new THREE.RingGeometry(86, 92, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    ringMesh.rotation.y = Math.PI / 8;
    globeGroup.add(ringMesh);

    const outerRingGeo = new THREE.RingGeometry(100, 103, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.x = Math.PI / 1.8;
    outerRingMesh.rotation.z = Math.PI / 4;
    globeGroup.add(outerRingMesh);

    // 2f. 3D Laser Flight Arcs & Interactive Floating Text Sprites
    const beaconCoords = [];
    const curveList = [];

    CAMPUSES.forEach((campus) => {
      const phi = (90 - campus.lat) * (Math.PI / 180);
      const theta = (campus.lon + 180) * (Math.PI / 180);
      const r = 73;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = (r * Math.sin(phi) * Math.sin(theta));
      const y = (r * Math.cos(phi));
      const pos = new THREE.Vector3(x, y, z);
      beaconCoords.push(pos);

      // Glowing beacon node sphere
      const pinGeo = new THREE.SphereGeometry(3.2, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(campus.color),
        blending: THREE.AdditiveBlending
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      // Radiating beacon light tower
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        pos,
        new THREE.Vector3(x * 1.35, y * 1.35, z * 1.35)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(campus.color),
        transparent: true,
        opacity: 0.85
      });
      const beamLine = new THREE.Line(lineGeo, lineMat);
      globeGroup.add(beamLine);

      // 3D Floating Canvas Label Billboard right in the 3D space!
      const labelSprite = createTextSprite(campus.code, campus.color);
      labelSprite.position.set(x * 1.32, y * 1.32 + 2, z * 1.32);
      globeGroup.add(labelSprite);
    });

    // Draw glowing bezier laser arcs between primary nodes
    for (let i = 0; i < beaconCoords.length - 1; i++) {
      const start = beaconCoords[i];
      const end = beaconCoords[i + 1];
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(98); // Elevate above surface

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      curveList.push(curve);

      const curvePoints = curve.getPoints(32);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      globeGroup.add(arcLine);
    }

    // 2g. Laser Photon Particles Racing Along Arcs
    const photons = [];
    curveList.forEach((curve) => {
      const pGeo = new THREE.SphereGeometry(1.6, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending
      });
      const photonMesh = new THREE.Mesh(pGeo, pMat);
      globeGroup.add(photonMesh);
      photons.push({ mesh: photonMesh, curve, progress: Math.random() });
    });
    photonParticlesRef.current = photons;

    // 2h. Orbiting High-Tech Satellite Probe with Solar Wings
    const satGroup = new THREE.Group();
    const satBodyGeo = new THREE.BoxGeometry(4.5, 2.8, 2.8);
    const satBodyMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satGroup.add(satBody);

    const solarGeo = new THREE.PlaneGeometry(9, 2.5);
    const solarMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, side: THREE.DoubleSide });
    const solarMesh = new THREE.Mesh(solarGeo, solarMat);
    solarMesh.rotation.y = Math.PI / 2;
    satGroup.add(solarMesh);

    globeGroup.add(satGroup);

    // 3. Mouse Drag Interaction Physics
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    const domEl = renderer.domElement;

    const onPointerDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
      dragVelocity = { x: 0, y: 0 };
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      dragVelocity = { x: deltaX * 0.005, y: deltaY * 0.005 };
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 4. Continuous Render & Physics Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Rotation
      if (!isDragging) {
        if (isAutoRotating) {
          globeGroup.rotation.y += 0.0025;
        }
        globeGroup.rotation.x *= 0.98;
      } else {
        globeGroup.rotation.y += dragVelocity.x;
        globeGroup.rotation.x += dragVelocity.y;
        dragVelocity.x *= 0.92;
        dragVelocity.y *= 0.92;
      }

      ringMesh.rotation.z += 0.0018;
      outerRingMesh.rotation.z -= 0.0012;

      // Pulse Laser Photons Along Curves
      photons.forEach((p) => {
        p.progress += 0.012;
        if (p.progress > 1) p.progress = 0;
        const point = p.curve.getPoint(p.progress);
        p.mesh.position.copy(point);
      });

      // Orbit satellite probe
      const orbitRadius = 110;
      satGroup.position.x = Math.cos(elapsedTime * 0.75) * orbitRadius;
      satGroup.position.z = Math.sin(elapsedTime * 0.75) * orbitRadius;
      satGroup.position.y = Math.sin(elapsedTime * 1.1) * 30;
      satGroup.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      if (domEl && domEl.parentNode) {
        domEl.parentNode.removeChild(domEl);
      }
    };
  }, [isAutoRotating]);

  return (
    <div className="relative w-full rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-[#040714] via-[#070c1e] to-[#0e0722] border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.18)] overflow-hidden select-none">
      
      {/* Dynamic Cyber Aurora Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(6,182,212,0.22),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Top Header Bar with Live Stream Status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
            </span>
            <h3 className="text-base sm:text-xl font-black text-white font-sora tracking-wide flex items-center gap-2.5">
              <span>LUMIXORA 3D HOLO-GLOBE</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-400/40 shadow-xs uppercase">
                Live Campus Constellation
              </span>
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            <span>Drag globe to explore</span>
            <span className="text-gray-600">•</span>
            <span>Real Placement Drives</span>
            <span className="text-gray-600">•</span>
            <span className="text-emerald-400 font-semibold">Active Hiring Telemetry</span>
          </p>
        </div>

        {/* Quick Switch Pills for Campuses directly in Header */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {CAMPUSES.map((c) => {
            const isSelected = activeBeacon?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => rotateToCampus(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-[1.02]'
                    : 'bg-black/50 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span>{c.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Full-Width 3D Canvas with Focused Telemetry Badge */}
      <div className="relative w-full h-[480px] sm:h-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        
        <div ref={containerRef} className="w-full h-full" />

        {/* Quick 3D Orbit Control Pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black/90 border border-cyan-500/40 backdrop-blur-md text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Orbit: {isAutoRotating ? 'ON' : 'PAUSED'}</span>
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md text-[10px] font-mono text-gray-300 flex items-center gap-1.5 pointer-events-none">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Drag Globe &bull; Click Node Pills</span>
          </div>
        </div>

        {/* ACTIVE CAMPUS TELEMETRY HUD OVERLAY (Clean, non-intrusive card) */}
        {activeBeacon && (
          <div className="absolute top-3 left-3 sm:left-4 max-w-sm w-full p-4 rounded-3xl bg-black/85 border border-cyan-400/50 backdrop-blur-2xl text-white shadow-[0_0_35px_rgba(6,182,212,0.25)] animate-fade-in z-20 space-y-3">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-[10px] border shadow-xs"
                  style={{ 
                    backgroundColor: `${activeBeacon.color}33`, 
                    borderColor: activeBeacon.color,
                    color: activeBeacon.color 
                  }}
                >
                  {activeBeacon.code}
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {activeBeacon.badge}
                </span>
              </div>
              
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                {activeBeacon.scholars}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-black text-white font-sora">{activeBeacon.name}</h4>
              <p className="text-[11px] text-gray-300 mt-0.5">
                Accreditation: <span className="text-gray-400 font-medium">{activeBeacon.accreditation}</span>
              </p>
              <div className="mt-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-300">Top Verified Offer:</span>
                <span className="text-xs font-black text-emerald-300 font-mono">{activeBeacon.topOffer}</span>
              </div>
            </div>

            {/* Target Campus Recruitment Drives */}
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300 block">
                Target Recruiters:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeBeacon.companies.map((comp, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-semibold text-gray-200 border border-white/5">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
              <span className="text-gray-400 font-medium text-[10px]">{activeBeacon.hiringRate}</span>
              <a
                href="#flow"
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                <span>Explore Hub</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
