import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Compass, Wrench, ShieldAlert, Activity, Play, 
  RotateCcw, Sliders, Box, Layers, Info, CheckCircle2,
  ShieldCheck, Maximize2, Minimize2, Crosshair
} from 'lucide-react';

export default function MechanicalTruss3DLab() {
  const mountRef = useRef(null);

  // Sub-lab mode: 'robotics' (6-DOF Kinematics) or 'truss' (Civil Bridge FEA)
  const [subMode, setSubMode] = useState('robotics');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ─── ROBOTICS KINEMATICS STATES ───
  const [joint1, setJoint1] = useState(0);   // Base Rotation (-180 to 180)
  const [joint2, setJoint2] = useState(30);  // Shoulder Pitch (-45 to 90)
  const [joint3, setJoint3] = useState(-45); // Elbow Pitch (-90 to 90)
  const [joint4, setJoint4] = useState(15);  // Wrist Pitch (-90 to 90)
  const [gripperOpen, setGripperOpen] = useState(true);

  // ─── CIVIL TRUSS FEA STATES ───
  const [appliedLoad, setAppliedLoad] = useState(150); // kN (0 to 500)
  const [trussType, setTrussType] = useState('warren'); // 'warren' | 'pratt' | 'howe'

  // ─── 3D RAYCAST HOVER HUD STATE ───
  const [hoverInfo, setHoverInfo] = useState(null);

  // ─── VIVA CHALLENGE & FAULT INJECTION STATE ───
  const [isVivaChallenge, setIsVivaChallenge] = useState(false);
  const [challengeResolved, setChallengeResolved] = useState(false);
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);
  const [earnedXP, setEarnedXP] = useState(0);

  // Audio Click Synthesizer
  const playClickAudio = (freq = 650) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  // Effective Load in Viva Challenge
  const effectiveLoad = (isVivaChallenge && !challengeResolved) ? 460 : appliedLoad;
  const safetyFactor = Math.max(0.5, (450 / Math.max(1, effectiveLoad))).toFixed(2);
  const maxStressMPa = (effectiveLoad * 1.8).toFixed(1);
  const deflectionMm = (effectiveLoad * 0.08).toFixed(2);
  const isYieldWarning = effectiveLoad > 350;

  // Handle Viva Fix Verification
  const handleVerifyFix = (idx) => {
    setSelectedHypothesis(idx);
    playClickAudio(800);
    if (idx === 0) { // Correct answer: Add diagonal counter-struts & increase top chord flange
      setChallengeResolved(true);
      setEarnedXP(50);
      setAppliedLoad(200);
      playClickAudio(1200);
    }
  };

  // ─── 3D THREE.JS SCENE ───
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060810);
    scene.fog = new THREE.FogExp2(0x060810, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 16, 26);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactiveObjects = [];

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff7ed, 1.8);
    sun.position.set(12, 24, 14);
    sun.castShadow = true;
    scene.add(sun);

    const blueRim = new THREE.DirectionalLight(0x0284c7, 1.2);
    blueRim.position.set(-15, 10, -10);
    scene.add(blueRim);

    // Ground Grid
    const grid = new THREE.GridHelper(30, 30, 0x1e293b, 0x0f172a);
    grid.position.y = 0;
    scene.add(grid);

    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // ─── 1. BUILD ROBOTIC ARM SCENE ───
    if (subMode === 'robotics') {
      const baseGeo = new THREE.CylinderGeometry(3.5, 4.0, 1.5, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.75;
      base.castShadow = true;
      base.userData = {
        name: 'Heavy Industrial Cast Base (Anchor)',
        desc: 'Rigid floor mount housing high-torque planetary reduction gearbox.',
        specs: 'Mount: 8x M24 Grade 10.9 Bolts • Max Torsional Load: 4,500 N·m'
      };
      sceneGroup.add(base);
      interactiveObjects.push(base);

      // Rotating Turntable (Joint 1)
      const j1Group = new THREE.Group();
      j1Group.position.y = 1.5;
      j1Group.rotation.y = (joint1 * Math.PI) / 180;
      sceneGroup.add(j1Group);

      const turnGeo = new THREE.CylinderGeometry(2.8, 3.0, 1.2, 32);
      const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.4, roughness: 0.3 });
      const turntable = new THREE.Mesh(turnGeo, yellowMat);
      turntable.position.y = 0.6;
      turntable.userData = {
        name: `Joint 1: Base Turntable (θ1 = ${joint1}°)`,
        desc: 'Continuous 360° horizontal slewing axis with optical encoder feedback.',
        specs: `Current Angle: ${joint1}° • Range: ±180° • Motor: AC Brushless Servo`
      };
      j1Group.add(turntable);
      interactiveObjects.push(turntable);

      // Shoulder Arm (Joint 2)
      const j2Group = new THREE.Group();
      j2Group.position.set(0, 1.4, 0);
      j2Group.rotation.z = (joint2 * Math.PI) / 180;
      j1Group.add(j2Group);

      const shoulderGeo = new THREE.BoxGeometry(1.6, 6.5, 2.0);
      const shoulderMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.5, roughness: 0.3 });
      const shoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
      shoulder.position.y = 3.25;
      shoulder.castShadow = true;
      shoulder.userData = {
        name: `Joint 2: Shoulder Link (θ2 = ${joint2}°)`,
        desc: 'Primary lift arm counterbalanced by dual pneumatic springs.',
        specs: `Current Pitch: ${joint2}° • Max Torque: 2,800 N·m • Arm Length: 650mm`
      };
      j2Group.add(shoulder);
      interactiveObjects.push(shoulder);

      // Elbow Joint (Joint 3)
      const j3Group = new THREE.Group();
      j3Group.position.set(0, 6.5, 0);
      j3Group.rotation.z = (joint3 * Math.PI) / 180;
      j2Group.add(j3Group);

      const elbowGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.2, 24);
      elbowGeo.rotateX(Math.PI / 2);
      const jointMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
      const elbow = new THREE.Mesh(elbowGeo, jointMat);
      j3Group.add(elbow);

      const forearmGeo = new THREE.BoxGeometry(1.3, 5.5, 1.5);
      const forearm = new THREE.Mesh(forearmGeo, yellowMat);
      forearm.position.y = 2.75;
      forearm.castShadow = true;
      forearm.userData = {
        name: `Joint 3: Forearm Pitch (θ3 = ${joint3}°)`,
        desc: 'Extension beam positioning the wrist within reach envelope.',
        specs: `Current Pitch: ${joint3}° • Velocity: 220°/s • Material: Al-Mg Alloy`
      };
      j3Group.add(forearm);
      interactiveObjects.push(forearm);

      // Wrist & Gripper (Joint 4)
      const j4Group = new THREE.Group();
      j4Group.position.set(0, 5.5, 0);
      j4Group.rotation.z = (joint4 * Math.PI) / 180;
      j3Group.add(j4Group);

      const wristGeo = new THREE.SphereGeometry(1.0, 16, 16);
      const wrist = new THREE.Mesh(wristGeo, jointMat);
      j4Group.add(wrist);

      const fingerGeo = new THREE.BoxGeometry(0.3, 1.5, 0.4);
      const fingerMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6 });
      const fingerL = new THREE.Mesh(fingerGeo, fingerMat);
      fingerL.position.set(-0.6, 1.6, 0);
      if (!gripperOpen) fingerL.position.x = -0.3;
      fingerL.userData = {
        name: 'Pneumatic Gripper End-Effector',
        desc: 'Parallel jaw gripping tool handling industrial payload.',
        specs: `State: ${gripperOpen ? 'OPEN' : 'CLAMPED'} • Clamping Force: 450 N`
      };
      j4Group.add(fingerL);
      interactiveObjects.push(fingerL);

      const fingerR = new THREE.Mesh(fingerGeo, fingerMat);
      fingerR.position.set(0.6, 1.6, 0);
      if (!gripperOpen) fingerR.position.x = 0.3;
      j4Group.add(fingerR);
    }

    // ─── 2. BUILD CIVIL TRUSS BRIDGE SCENE ───
    if (subMode === 'truss') {
      const span = 20;
      const heightTruss = 5.5;
      const numBays = 4;
      const bayWidth = span / numBays;

      const tensionColor = new THREE.Color(0x06b6d4); // Cyan (Tension)
      const compColor = new THREE.Color(isYieldWarning ? 0xef4444 : 0xf97316); // Red/Orange (Compression)

      const createMember = (p1, p2, isTension = true, memberLabel = 'Truss Member') => {
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();
        const memberGeo = new THREE.CylinderGeometry(0.18, 0.18, len, 8);
        const mat = new THREE.MeshStandardMaterial({
          color: isTension ? tensionColor : compColor,
          emissive: isTension ? tensionColor : compColor,
          emissiveIntensity: 0.3,
          roughness: 0.4,
          metalness: 0.7
        });
        const mesh = new THREE.Mesh(memberGeo, mat);
        
        mesh.position.copy(p1).add(dir.multiplyScalar(0.5));
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        mesh.userData = {
          name: memberLabel,
          desc: isTension ? 'Carrying pure axial tensile load (+T).' : 'Carrying axial compressive load (-C).',
          specs: `Force: ${isTension ? '+' : '-'}${(effectiveLoad * (isTension ? 0.7 : 0.9)).toFixed(1)} kN • Status: ${isYieldWarning && !isTension ? 'CRITICAL BUCKLING' : 'SAFE'}`
        };
        sceneGroup.add(mesh);
        interactiveObjects.push(mesh);
      };

      // Bottom Chord (Tension)
      for (let i = 0; i < numBays; i++) {
        const x1 = -span / 2 + i * bayWidth;
        const x2 = x1 + bayWidth;
        createMember(new THREE.Vector3(x1, 1, -2), new THREE.Vector3(x2, 1, -2), true, `Bottom Chord Member B${i+1}`);
        createMember(new THREE.Vector3(x1, 1, 2), new THREE.Vector3(x2, 1, 2), true, `Bottom Chord Member B${i+1}`);
        createMember(new THREE.Vector3(x1, 1, -2), new THREE.Vector3(x1, 1, 2), true, `Transverse Floor Beam F${i+1}`);
      }
      createMember(new THREE.Vector3(span / 2, 1, -2), new THREE.Vector3(span / 2, 1, 2), true, 'Transverse End Beam');

      // Top Chord (Compression)
      for (let i = 0; i < numBays - 1; i++) {
        const x1 = -span / 2 + (i + 0.5) * bayWidth;
        const x2 = x1 + bayWidth;
        createMember(new THREE.Vector3(x1, 1 + heightTruss, -2), new THREE.Vector3(x2, 1 + heightTruss, -2), false, `Top Compressive Chord T${i+1}`);
        createMember(new THREE.Vector3(x1, 1 + heightTruss, 2), new THREE.Vector3(x2, 1 + heightTruss, 2), false, `Top Compressive Chord T${i+1}`);
      }

      // Diagonal Web Members
      for (let i = 0; i < numBays; i++) {
        const botX1 = -span / 2 + i * bayWidth;
        const botX2 = botX1 + bayWidth;
        const topX = botX1 + bayWidth * 0.5;

        createMember(new THREE.Vector3(botX1, 1, 2), new THREE.Vector3(topX, 1 + heightTruss, 2), i % 2 === 0, `Diagonal Web D${i*2+1}`);
        createMember(new THREE.Vector3(topX, 1 + heightTruss, 2), new THREE.Vector3(botX2, 1, 2), i % 2 !== 0, `Diagonal Web D${i*2+2}`);
        createMember(new THREE.Vector3(botX1, 1, -2), new THREE.Vector3(topX, 1 + heightTruss, -2), i % 2 === 0, `Diagonal Web D${i*2+1}`);
        createMember(new THREE.Vector3(topX, 1 + heightTruss, -2), new THREE.Vector3(botX2, 1, -2), i % 2 !== 0, `Diagonal Web D${i*2+2}`);
      }

      // Concrete Abutments
      const abutGeo = new THREE.BoxGeometry(4, 2, 8);
      const abutMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
      const abutL = new THREE.Mesh(abutGeo, abutMat);
      abutL.position.set(-span / 2 - 1.5, 0.5, 0);
      sceneGroup.add(abutL);

      const abutR = new THREE.Mesh(abutGeo, abutMat);
      abutR.position.set(span / 2 + 1.5, 0.5, 0);
      sceneGroup.add(abutR);

      // Dynamic Central Load Arrow
      const arrowGeo = new THREE.ConeGeometry(0.8, 2.0, 16);
      const arrowMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const arrow = new THREE.Mesh(arrowGeo, arrowMat);
      arrow.rotation.x = Math.PI;
      arrow.position.set(0, 1 + heightTruss + 2.5, 0);
      sceneGroup.add(arrow);
    }

    // ─── MOUSE DRAG & RAYCAST HOVER ───
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotY = 0.3;
    let rotX = 0.4;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      // Raycast hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const topObj = intersects[0].object;
        if (topObj.userData && topObj.userData.name) {
          setHoverInfo({
            name: topObj.userData.name,
            desc: topObj.userData.desc,
            specs: topObj.userData.specs,
            coords: { x: e.clientX - rect.left, y: e.clientY - rect.top }
          });
        }
      } else {
        setHoverInfo(null);
      }

      if (!isDragging) return;
      rotY += (e.clientX - prevMouseX) * 0.008;
      rotX = Math.max(0.1, Math.min(Math.PI / 2.3, rotX + (e.clientY - prevMouseY) * 0.008));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      camera.position.z = Math.max(14, Math.min(42, camera.position.z + e.deltaY * 0.02));
      camera.position.y = Math.max(8, Math.min(32, camera.position.y + e.deltaY * 0.015));
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: true });

    // ─── ANIMATION LOOP ───
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dist = 30;
      camera.position.x = dist * Math.sin(rotY) * Math.cos(rotX);
      camera.position.z = dist * Math.cos(rotY) * Math.cos(rotX);
      camera.position.y = dist * Math.sin(rotX);
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [subMode, joint1, joint2, joint3, joint4, gripperOpen, appliedLoad, isYieldWarning, effectiveLoad]);

  return (
    <div className={`space-y-6 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[9999] bg-[#04060c] p-6 overflow-y-auto' : ''}`}>
      {/* ─── TOP LAB BANNER ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d121c] via-[#080d16] to-[#1c120a] border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">
                Core Mechanical & Civil 3D Kinematics & Truss Stress Lab
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                FEA & RIGID BODY PHYSICS
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Interactive 3D 6-DOF industrial robotics arm kinematics and civil engineering finite element bridge truss stress simulator.
            </p>
          </div>
        </div>

        {/* Sub-mode Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setSubMode('robotics'); playClickAudio(700); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              subMode === 'robotics'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            6-DOF Robotic Arm (Kinematics)
          </button>
          <button
            onClick={() => { setSubMode('truss'); playClickAudio(700); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              subMode === 'truss'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            Bridge Truss Stress (FEA)
          </button>

          {/* VIVA DEFENSE CHALLENGE BUTTON */}
          <button
            onClick={() => {
              setIsVivaChallenge(!isVivaChallenge);
              setChallengeResolved(false);
              setSelectedHypothesis(null);
              setSubMode('truss');
              playClickAudio(900);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              isVivaChallenge 
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-rose-500/30 animate-pulse' 
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVivaChallenge ? '⚡ VIVA CHALLENGE ACTIVE' : '⚡ ENTER VIVA CHALLENGE'}</span>
          </button>

          {/* Fullscreen Zen Mode Button */}
          <button
            onClick={() => { setIsFullscreen(!isFullscreen); playClickAudio(500); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Maximize Lab Viewport'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ─── VIVA CHALLENGE HUD DOCK (Appears when Viva Challenge is active) ─── */}
      {isVivaChallenge && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#18110a] to-black border-2 border-amber-500/50 shadow-2xl animate-fade-in text-xs font-mono">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
                PLACEMENT TECHNICAL VIVA DEFENSE • CIVIL & STRUCTURAL FEA SCENARIO #03
              </span>
            </div>
            {challengeResolved ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>STRUCTURAL INTEGRITY RESTORED (+{earnedXP} PROOF-OF-SKILL XP AWARDED)</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                PREVENT EULER BUCKLING COLLAPSE UNDER 460 kN LOAD
              </span>
            )}
          </div>

          <div className="mt-3.5 space-y-2">
            <p className="text-sm font-sans font-medium text-amber-100">
              <strong className="text-amber-400">Recruiter Problem:</strong> "Under an intense 460 kN live traffic load, the bridge safety factor has plummeted to 0.98. Top chord compression members are buckling. How must the truss be engineered to restore safety factor ≥ 1.50 without excessive dead weight?"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {[
                { id: 0, text: 'A) Add diagonal counter-struts and increase flange radius of gyration (r) to reduce effective slenderness ratio (KL/r).' },
                { id: 1, text: 'B) Remove the bottom tensile chords to make the bridge lighter.' },
                { id: 2, text: 'C) Lubricate pin joints with grease to eliminate friction.' }
              ].map((hyp) => (
                <button
                  key={hyp.id}
                  onClick={() => handleVerifyFix(hyp.id)}
                  className={`p-3 rounded-xl border text-left font-mono text-[11px] transition-all cursor-pointer ${
                    selectedHypothesis === hyp.id
                      ? (hyp.id === 0 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-red-500/20 border-red-500 text-red-200')
                      : 'bg-black/50 border-white/10 hover:border-amber-500/40 text-gray-300 hover:text-white'
                  }`}
                >
                  {hyp.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN TWO-COLUMN LAB VIEWPORT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: 3D VIEWPORT (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#090b14] border border-white/10 overflow-hidden shadow-2xl relative">
          <div className="p-3.5 px-5 bg-[#0e101c] border-b border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-amber-400 font-bold">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>{subMode === 'robotics' ? '3D Articulated Robot Viewport' : '3D Warren Truss FEA Mesh'}</span>
            </span>
            <span className="text-gray-400 text-[11px] hidden sm:inline">
              Drag to 360° Orbit • Scroll to Zoom
            </span>
          </div>

          {/* 3D Canvas */}
          <div ref={mountRef} className="w-full h-[450px] cursor-grab active:cursor-grabbing relative">
            {/* 3D HOLOGRAPHIC RAYCAST HOVER TOOLTIP */}
            {hoverInfo && (
              <div 
                className="absolute z-30 pointer-events-none p-3 rounded-xl bg-[#140e07]/95 border border-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.4)] backdrop-blur-md max-w-xs transition-all duration-75 text-xs font-mono"
                style={{
                  left: Math.min(window.innerWidth - 320, hoverInfo.coords.x + 15),
                  top: Math.max(10, hoverInfo.coords.y - 75)
                }}
              >
                <div className="flex items-center gap-1.5 text-amber-300 font-bold border-b border-amber-500/30 pb-1 mb-1">
                  <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                  <span>{hoverInfo.name}</span>
                </div>
                <p className="text-[10px] text-gray-300 mb-1">{hoverInfo.desc}</p>
                <div className="text-[9px] text-emerald-400 font-bold bg-black/50 p-1.5 rounded">
                  {hoverInfo.specs}
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 pointer-events-none p-2.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-gray-300 backdrop-blur-sm space-y-0.5">
              {subMode === 'robotics' ? (
                <>
                  <div>End-Effector Reach: <span className="text-amber-400 font-bold">1,450 mm</span></div>
                  <div>Payload Limit: <span className="text-emerald-400 font-bold">16.0 kg ISO</span></div>
                  <div>Gripper State: <span className="text-cyan-400 font-bold">{gripperOpen ? 'OPEN CLAMP' : 'CLAMPED'}</span></div>
                </>
              ) : (
                <>
                  <div>Applied Center Point Load: <span className="text-red-400 font-bold">{effectiveLoad} kN</span></div>
                  <div>Cyan Members: <span className="text-cyan-400 font-bold">Tension (+T)</span></div>
                  <div>Red Members: <span className="text-red-400 font-bold">Compression (-C)</span></div>
                </>
              )}
            </div>
          </div>

          {/* Interactive Sliders under Canvas */}
          <div className="p-4 bg-[#0a0c16] border-t border-white/10">
            {subMode === 'robotics' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>θ1 Base:</span>
                      <span className="text-amber-400 font-bold">{joint1}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={joint1}
                      onChange={(e) => { setJoint1(Number(e.target.value)); playClickAudio(400); }}
                      className="w-full accent-amber-400 cursor-pointer h-1 bg-white/10 rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>θ2 Shoulder:</span>
                      <span className="text-amber-400 font-bold">{joint2}°</span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="90"
                      value={joint2}
                      onChange={(e) => { setJoint2(Number(e.target.value)); playClickAudio(400); }}
                      className="w-full accent-amber-400 cursor-pointer h-1 bg-white/10 rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>θ3 Elbow:</span>
                      <span className="text-amber-400 font-bold">{joint3}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={joint3}
                      onChange={(e) => { setJoint3(Number(e.target.value)); playClickAudio(400); }}
                      className="w-full accent-amber-400 cursor-pointer h-1 bg-white/10 rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>θ4 Wrist:</span>
                      <span className="text-amber-400 font-bold">{joint4}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={joint4}
                      onChange={(e) => { setJoint4(Number(e.target.value)); playClickAudio(400); }}
                      className="w-full accent-amber-400 cursor-pointer h-1 bg-white/10 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono text-gray-400">Actuator Grip:</span>
                  <button
                    onClick={() => { setGripperOpen(!gripperOpen); playClickAudio(gripperOpen ? 300 : 700); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      gripperOpen ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {gripperOpen ? 'Pneumatic Clamp Open' : 'Pneumatic Clamp Closed'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-gray-300">
                  <span>Dynamic Vehicular Point Load:</span>
                  <span className={`font-bold text-sm ${isYieldWarning ? 'text-red-400' : 'text-amber-400'}`}>
                    {effectiveLoad} kN {isYieldWarning ? '(CRITICAL STRESS)' : '(SAFE)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={effectiveLoad}
                  onChange={(e) => { setAppliedLoad(Number(e.target.value)); playClickAudio(350 + Number(e.target.value)); }}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-white/10 rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: KINEMATICS & STRESS TELEMETRY (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-[#080a14] border border-amber-500/20 shadow-2xl overflow-hidden">
          <div className="p-3.5 px-5 bg-[#0d0f1e] border-b border-white/10 flex items-center justify-between">
            <span className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>{subMode === 'robotics' ? 'FORWARD KINEMATICS MATRIX' : 'FINITE ELEMENT STRESS TELEMETRY'}</span>
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
              isYieldWarning ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}>
              {subMode === 'robotics' ? 'DH PARAMETERS' : isYieldWarning ? 'WARN: HIGH DEFLECTION' : 'FACTOR OF SAFETY OK'}
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs font-mono">
            {subMode === 'robotics' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-gray-500 text-[10px] block">END-EFFECTOR X</span>
                    <span className="text-xl font-bold text-white">{(Math.cos(joint1 * Math.PI / 180) * 850).toFixed(0)} mm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-gray-500 text-[10px] block">END-EFFECTOR Y</span>
                    <span className="text-xl font-bold text-emerald-400">{(650 + Math.sin(joint2 * Math.PI / 180) * 550).toFixed(0)} mm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-gray-500 text-[10px] block">END-EFFECTOR Z</span>
                    <span className="text-xl font-bold text-cyan-400">{(Math.sin(joint1 * Math.PI / 180) * 850).toFixed(0)} mm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-gray-500 text-[10px] block">DEGREES OF FREEDOM</span>
                    <span className="text-xl font-bold text-amber-400">6-DOF</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed flex items-start gap-2.5">
                  <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">Robotics Core Concept: </span>
                    <span>Forward Kinematics solves for Cartesian tip position using Denavit-Hartenberg (D-H) homogeneous transformation matrices: $T = A_1 \cdot A_2 \cdot A_3 \cdot A_4$. Inverse kinematics calculates the joint angles required to reach a specific tool point in space.</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-gray-500 text-[10px] block">FACTOR OF SAFETY (FOS)</span>
                    <span className={`text-xl font-bold ${Number(safetyFactor) < 1.2 ? 'text-red-400' : 'text-emerald-400'}`}>{safetyFactor}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-gray-500 text-[10px] block">MAX BEAM STRESS</span>
                    <span className="text-xl font-bold text-white">{maxStressMPa} MPa</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-gray-500 text-[10px] block">MID-SPAN DEFLECTION</span>
                    <span className="text-xl font-bold text-cyan-400">{deflectionMm} mm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20">
                    <span className="text-gray-500 text-[10px] block">STEEL GRADE</span>
                    <span className="text-xl font-bold text-amber-400">IS 2062 (E250)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed flex items-start gap-2.5">
                  <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">Civil Structural Concept: </span>
                    <span>In a planar Warren truss, triangular geometric units ensure all members carry purely axial tension (bottom chord) or axial compression (top chord). When the safety factor drops below 1.2, top compressive members face Euler buckling risk: P_cr = π²·E·I / (K·L)².</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
