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

export default function CyberHoloGlobe3D({ onSelectCampus }) {
  const containerRef = useRef(null);
  const globeGroupRef = useRef(null);
  const targetRotationRef = useRef(null);
  const isAutoRotatingRef = useRef(true);
  const photonParticlesRef = useRef([]);
  const [activeBeacon, setActiveBeacon] = useState(CAMPUSES[0]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

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
    if (!campus) return;

    const targetY = -((campus.lon + 180) * (Math.PI / 180)) + Math.PI / 2;
    const targetX = ((90 - campus.lat) * (Math.PI / 180)) - Math.PI / 2;
    targetRotationRef.current = { x: targetX, y: targetY };
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Three.js Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 195;

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

    // Initial orientation: Directly face GPREC and Indian campus constellation
    const initCampus = CAMPUSES[0];
    const initialY = -((initCampus.lon + 180) * (Math.PI / 180)) + Math.PI / 2;
    const initialX = ((90 - initCampus.lat) * (Math.PI / 180)) - Math.PI / 2;
    globeGroup.rotation.y = initialY;
    globeGroup.rotation.x = initialX;

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

    // 2c. Cybernetic Latitude & Longitude Geodesic Rings
    const gridRadius = 70.8;
    [-60, -30, 0, 30, 60].forEach(lat => {
      const rad = (lat * Math.PI) / 180;
      const r = gridRadius * Math.cos(rad);
      const y = gridRadius * Math.sin(rad);
      const circlePoints = [];
      for (let j = 0; j <= 64; j++) {
        const a = (j / 64) * Math.PI * 2;
        circlePoints.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
      }
      const rGeo = new THREE.BufferGeometry().setFromPoints(circlePoints);
      const rMat = new THREE.LineBasicMaterial({
        color: lat === 0 ? 0x06b6d4 : 0x0284c7,
        transparent: true,
        opacity: lat === 0 ? 0.45 : 0.22,
        blending: THREE.AdditiveBlending
      });
      globeGroup.add(new THREE.Line(rGeo, rMat));
    });

    // 4 Longitude Meridian Rings
    [0, 60, 120].forEach(lon => {
      const circlePoints = [];
      for (let j = 0; j <= 64; j++) {
        const a = (j / 64) * Math.PI * 2;
        circlePoints.push(new THREE.Vector3(
          gridRadius * Math.sin(a) * Math.cos(lon * Math.PI / 180),
          gridRadius * Math.cos(a),
          gridRadius * Math.sin(a) * Math.sin(lon * Math.PI / 180)
        ));
      }
      const mGeo = new THREE.BufferGeometry().setFromPoints(circlePoints);
      const mMat = new THREE.LineBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
      });
      globeGroup.add(new THREE.Line(mGeo, mMat));
    });

    // 2d. Particle Point Cloud Surface (Star Clusters with Golden Spiral)
    const particleCount = 2800;
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
      if (rand > 0.45) {
        particleColors[i * 3] = 0.02;
        particleColors[i * 3 + 1] = 0.78;
        particleColors[i * 3 + 2] = 0.95; // Electric Cyan
      } else if (rand > 0.15) {
        particleColors[i * 3] = 0.58;
        particleColors[i * 3 + 1] = 0.28;
        particleColors[i * 3 + 2] = 0.96; // Cosmic Violet
      } else {
        particleColors[i * 3] = 0.92;
        particleColors[i * 3 + 1] = 0.96;
        particleColors[i * 3 + 2] = 1.0; // Starlight Diamond
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

    // 2e. Multi-layered Orbital Rings & Swirling Accelerator Stream
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

    // Swirling Photon Particle Stream in Orbit
    const orbitStreamCount = 180;
    const streamPos = new Float32Array(orbitStreamCount * 3);
    for (let i = 0; i < orbitStreamCount; i++) {
      const angle = (i / orbitStreamCount) * Math.PI * 2;
      const rStream = 89 + (Math.random() - 0.5) * 5;
      streamPos[i * 3] = rStream * Math.cos(angle);
      streamPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      streamPos[i * 3 + 2] = rStream * Math.sin(angle);
    }
    const streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
    const streamMat = new THREE.PointsMaterial({
      size: 2.2,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const streamPoints = new THREE.Points(streamGeo, streamMat);
    streamPoints.rotation.x = Math.PI / 2.3;
    streamPoints.rotation.y = Math.PI / 8;
    globeGroup.add(streamPoints);

    // 2f. 3D Laser Flight Arcs, Expanding Radar Ripples & Interactive Beacons
    const beaconCoords = [];
    const curveList = [];
    const interactivePins = [];
    const rippleMeshes = [];

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
      const pinGeo = new THREE.SphereGeometry(3.6, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(campus.color),
        blending: THREE.AdditiveBlending
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { campus };
      globeGroup.add(pinMesh);
      interactivePins.push(pinMesh);

      // Expanding radar sonar wave ring
      const rippleGeo = new THREE.RingGeometry(1.2, 2.8, 24);
      const rippleMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(campus.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
      rippleMesh.position.copy(pos);
      rippleMesh.lookAt(0, 0, 0);
      globeGroup.add(rippleMesh);
      rippleMeshes.push({ mesh: rippleMesh, campusId: campus.id });

      // Radiating beacon light tower
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        pos,
        new THREE.Vector3(x * 1.38, y * 1.38, z * 1.38)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(campus.color),
        transparent: true,
        opacity: 0.88
      });
      const beamLine = new THREE.Line(lineGeo, lineMat);
      globeGroup.add(beamLine);

      // 3D Floating Canvas Label Billboard right in the 3D space!
      const labelSprite = createTextSprite(campus.code, campus.color);
      labelSprite.position.set(x * 1.34, y * 1.34 + 2, z * 1.34);
      labelSprite.userData = { campus };
      globeGroup.add(labelSprite);
      interactivePins.push(labelSprite);
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

    // 3. Mouse Drag Interaction Physics & Raycasting Direct Click
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    const domEl = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e) => {
      isDragging = true;
      targetRotationRef.current = null;
      prevMousePos = { x: e.clientX, y: e.clientY };
      dragVelocity = { x: 0, y: 0 };
    };

    const onPointerMove = (e) => {
      const rect = domEl.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;

        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;

        dragVelocity = { x: deltaX * 0.005, y: deltaY * 0.005 };
        prevMousePos = { x: e.clientX, y: e.clientY };
        return;
      }

      // Check hover over 3D beacons
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactivePins);
      if (hits.length > 0) {
        domEl.style.cursor = 'pointer';
      } else {
        domEl.style.cursor = 'grab';
      }
    };

    const onPointerUp = (e) => {
      const wasDragging = Math.abs(dragVelocity.x) > 0.002 || Math.abs(dragVelocity.y) > 0.002;
      isDragging = false;
      if (!wasDragging) {
        const rect = domEl.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(interactivePins);
        if (hits.length > 0) {
          const hitCampus = hits[0].object.userData?.campus;
          if (hitCampus) {
            rotateToCampus(hitCampus);
          }
        }
      }
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

      // Smooth Rotation: Target Lerp when a campus is selected, else continuous orbit
      if (targetRotationRef.current) {
        globeGroup.rotation.x = THREE.MathUtils.lerp(globeGroup.rotation.x, targetRotationRef.current.x, 0.08);
        let diffY = (targetRotationRef.current.y - globeGroup.rotation.y) % (Math.PI * 2);
        if (diffY < -Math.PI) diffY += Math.PI * 2;
        if (diffY > Math.PI) diffY -= Math.PI * 2;
        globeGroup.rotation.y += diffY * 0.08;

        if (Math.abs(diffY) < 0.003 && Math.abs(targetRotationRef.current.x - globeGroup.rotation.x) < 0.003) {
          targetRotationRef.current = null;
        }
      } else if (!isDragging) {
        if (isAutoRotatingRef.current) {
          globeGroup.rotation.y += 0.0022;
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

      // Animate expanding radar wave ripples from campus nodes
      const t = elapsedTime * 2.2;
      rippleMeshes.forEach((r, idx) => {
        const phase = (t + idx * 0.7) % 2;
        const scale = 1 + phase * 2.6;
        r.mesh.scale.set(scale, scale, 1);
        r.mesh.material.opacity = Math.max(0, 0.75 - phase * 0.38);
      });

      // Animate swirling orbital stream
      if (streamPoints) {
        streamPoints.rotation.z += 0.005;
      }

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
  }, []);

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
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-[1.03] border border-cyan-300/40'
                    : 'bg-black/50 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <span 
                  className={`w-2 h-2 rounded-full ${isSelected ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: c.color }}
                />
                <span>{c.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SPLIT STAGE: Focused Telemetry HUD (Left) + Unobstructed 3D WebGL Sphere (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-3">
        
        {/* Left Side (5 cols): Active Campus Telemetry HUD */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          {activeBeacon && (
            <div 
              className="p-5 sm:p-6 rounded-3xl bg-[#070D1C]/80 border border-white/10 backdrop-blur-2xl text-white shadow-2xl transition-all duration-300 relative overflow-hidden space-y-3.5"
              style={{
                boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px ${activeBeacon.glow || 'rgba(6, 182, 212, 0.25)'}`
              }}
            >
              {/* Top ambient color glow accent bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent, ${activeBeacon.color}, transparent)`
                }}
              />
              
              {/* Header with Badge & Live Status */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border shadow-xs"
                    style={{ 
                      backgroundColor: `${activeBeacon.color}25`, 
                      borderColor: activeBeacon.color,
                      color: activeBeacon.color 
                    }}
                  >
                    {activeBeacon.code}
                  </div>
                  <div>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border inline-block"
                      style={{
                        backgroundColor: `${activeBeacon.color}15`,
                        borderColor: `${activeBeacon.color}40`,
                        color: activeBeacon.color
                      }}
                    >
                      {activeBeacon.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{activeBeacon.city}, Andhra Pradesh</span>
                  </div>
                </div>
                
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  {activeBeacon.scholars}
                </span>
              </div>

              {/* Campus Name & Accreditation */}
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-black text-white font-sora tracking-tight leading-snug">
                  {activeBeacon.name}
                </h4>
                <p className="text-xs text-slate-400">
                  Accreditation: <span className="text-slate-300 font-medium">{activeBeacon.accreditation}</span>
                </p>
              </div>

              {/* Metrics Highlights Grid (Apple Activity / Telemetry Cards) */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Top Verified Offer</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-300 font-mono tracking-tight">{activeBeacon.topOffer}</span>
                </div>
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Placement Rate</span>
                  <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono tracking-tight">{activeBeacon.hiringRate}</span>
                </div>
              </div>

              {/* Target Recruiters Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                  <span>Active Campus Recruiters</span>
                  <span className="text-cyan-400 font-mono text-[9px]">Direct Drive Partners</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeBeacon.companies.map((comp, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[11px] font-semibold text-slate-200 border border-white/10 transition-colors"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Drives & Action Link */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="space-y-0.5 truncate max-w-[200px]">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Upcoming Drive</span>
                  <span className="text-[11px] text-amber-300 font-medium truncate block">{activeBeacon.activeDrives}</span>
                </div>
                <a
                  href="#flow"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] shrink-0 cursor-pointer"
                >
                  <span>Explore Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          )}
        </div>

        {/* Right Side (7 cols): Full Unobstructed Interactive 3D Sphere Canvas */}
        <div className="lg:col-span-7 order-1 lg:order-2 relative w-full h-[400px] sm:h-[480px] lg:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing">
          
          <div ref={containerRef} className="w-full h-full" />

          {/* Quick 3D Orbit Control Floating Badge */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-2 z-20">
            <button
              onClick={() => {
                setIsAutoRotating(prev => {
                  isAutoRotatingRef.current = !prev;
                  return !prev;
                });
              }}
              className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-cyan-500/40 backdrop-blur-md text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Orbit: {isAutoRotating ? 'ON' : 'PAUSED'}</span>
            </button>
            <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-md text-[10px] font-mono text-gray-300 items-center gap-1.5 pointer-events-none">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Drag to Spin &bull; Click Node Pills</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
