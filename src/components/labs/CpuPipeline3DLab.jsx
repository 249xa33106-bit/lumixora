import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Server, Cpu, Database, Activity, Play, Pause, 
  RotateCcw, AlertTriangle, ShieldCheck, Zap, 
  GitCommit, ArrowRight, Info, Layers, Maximize2, 
  Minimize2, CheckCircle2, Crosshair
} from 'lucide-react';

export default function CpuPipeline3DLab() {
  const mountRef = useRef(null);

  // Lab Mode: 'pipeline' (RISC-V 5-Stage CPU) or 'raft' (Distributed Systems)
  const [labMode, setLabMode] = useState('pipeline');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ─── PIPELINE STATES ───
  const [clockSpeed, setClockSpeed] = useState(1.0); // 1.0 GHz simulation speed
  const [pipelineState, setPipelineState] = useState('normal'); // 'normal' | 'hazard_raw' | 'branch_miss' | 'cache_miss'
  const [cycleCount, setCycleCount] = useState(142);
  const [instructionCount, setInstructionCount] = useState(136);
  const [isPaused, setIsPaused] = useState(false);

  // ─── 3D RAYCAST HOVER HUD STATE ───
  const [hoverInfo, setHoverInfo] = useState(null);

  // ─── VIVA CHALLENGE & FAULT INJECTION STATE ───
  const [isVivaChallenge, setIsVivaChallenge] = useState(false);
  const [challengeResolved, setChallengeResolved] = useState(false);
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);
  const [earnedXP, setEarnedXP] = useState(0);

  // ─── RAFT DISTRIBUTED STATES ───
  const [nodes, setNodes] = useState([
    { id: 1, role: 'leader', term: 3, logCount: 14, isAlive: true },
    { id: 2, role: 'follower', term: 3, logCount: 14, isAlive: true },
    { id: 3, role: 'follower', term: 3, logCount: 14, isAlive: true },
    { id: 4, role: 'follower', term: 3, logCount: 14, isAlive: true },
    { id: 5, role: 'follower', term: 3, logCount: 14, isAlive: true },
  ]);
  const [raftLog, setRaftLog] = useState([
    'T=14.2s: Leader Node 1 sent heartbeat ping to quorum (4/4 ack)',
    'T=13.8s: Commited Log #14 [SET user:109 = "tier1_offer"]'
  ]);

  // Derived CPI
  const cpi = (cycleCount / Math.max(1, instructionCount)).toFixed(2);

  // Audio Click Synthesizer
  const playClickAudio = (freq = 700) => {
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

  // Clock ticker for pipeline
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCycleCount(c => c + 1);
      if (pipelineState === 'normal') {
        setInstructionCount(i => i + 1);
      } else if (pipelineState === 'hazard_raw' || pipelineState === 'cache_miss') {
        if (Math.random() > 0.4) setInstructionCount(i => i + 1);
      }
    }, 1000 / clockSpeed);
    return () => clearInterval(interval);
  }, [isPaused, clockSpeed, pipelineState]);

  // Handle Viva Fix Verification
  const handleVerifyFix = (idx) => {
    setSelectedHypothesis(idx);
    playClickAudio(800);
    if (idx === 0) { // Correct answer: Load data is only produced at MEM stage
      setChallengeResolved(true);
      setEarnedXP(50);
      setPipelineState('normal');
      playClickAudio(1200);
    }
  };

  // Handle Raft Kill Leader
  const handleKillLeader = () => {
    playClickAudio(400);
    const leader = nodes.find(n => n.role === 'leader' && n.isAlive);
    if (!leader) return;

    setNodes(prev => prev.map(n => n.id === leader.id ? { ...n, isAlive: false, role: 'offline' } : n));
    setRaftLog(prev => [
      `🚨 CHAOS INJECTED: Node ${leader.id} (LEADER) killed! Heartbeat silent.`,
      `⏳ Follower election timeouts expired. Election initiated...`,
      ...prev.slice(0, 4)
    ]);

    setTimeout(() => {
      setNodes(prev => {
        const aliveFollowers = prev.filter(n => n.isAlive);
        if (aliveFollowers.length === 0) return prev;
        const newLeader = aliveFollowers[0];
        return prev.map(n => n.id === newLeader.id 
          ? { ...n, role: 'leader', term: n.term + 1, logCount: n.logCount + 1 } 
          : n.isAlive ? { ...n, role: 'follower', term: n.term + 1 } : n
        );
      });
      setRaftLog(prev => [
        `⭐ ELECTION RESOLVED: Node 2 collected quorum (3/4 votes) -> NEW LEADER (Term 4)`,
        ...prev.slice(0, 4)
      ]);
    }, 1400);
  };

  const handleHealCluster = () => {
    playClickAudio(900);
    setNodes([
      { id: 1, role: 'follower', term: 4, logCount: 15, isAlive: true },
      { id: 2, role: 'leader', term: 4, logCount: 15, isAlive: true },
      { id: 3, role: 'follower', term: 4, logCount: 15, isAlive: true },
      { id: 4, role: 'follower', term: 4, logCount: 15, isAlive: true },
      { id: 5, role: 'follower', term: 4, logCount: 15, isAlive: true },
    ]);
    setRaftLog(prev => [
      '✅ CLUSTER HEALED: All 5 nodes synchronized. Quorum 5/5 healthy.',
      ...prev.slice(0, 4)
    ]);
  };

  // ─── THREE.JS 3D SCENE ───
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05060b);
    scene.fog = new THREE.FogExp2(0x05060b, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 14, 24);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactiveObjects = [];

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const purpleLight = new THREE.DirectionalLight(0x8b5cf6, 1.2);
    purpleLight.position.set(-15, 10, -10);
    scene.add(purpleLight);

    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // ─── BUILD 3D RISC-V 5-STAGE PIPELINE SCENE ───
    if (labMode === 'pipeline') {
      const stages = [
        { name: 'IF', full: 'Instruction Fetch', x: -10, color: 0x3b82f6, specs: 'PC Register: 0x00400000 • 32KB L1 I-Cache • Pre-decode Buffer' },
        { name: 'ID', full: 'Instruction Decode', x: -5, color: 0x8b5cf6, specs: '32x 64-bit Integer Register File (x0-x31) • Immediate Sign-Extender' },
        { name: 'EX', full: 'Execution & ALU', x: 0, color: 0x10b981, specs: '64-bit CLA ALU • Multiplier Unit • Branch Address Comparator' },
        { name: 'MEM', full: 'Memory Access', x: 5, color: 0xf59e0b, specs: '32KB L1 D-Cache • Write Buffer • Load-Store Alignment Unit' },
        { name: 'WB', full: 'Register Writeback', x: 10, color: 0xec4899, specs: 'Result MUX Selector • Synchronous Clock Write into rd Register' }
      ];

      // Base Motherboard Plate
      const boardGeo = new THREE.BoxGeometry(26, 0.8, 12);
      const boardMat = new THREE.MeshStandardMaterial({ color: 0x0c101d, metalness: 0.2, roughness: 0.6 });
      const board = new THREE.Mesh(boardGeo, boardMat);
      board.position.y = -0.5;
      board.receiveShadow = true;
      sceneGroup.add(board);

      // Bus Conduits
      const busGeo = new THREE.BoxGeometry(24, 0.15, 0.8);
      const busMat = new THREE.MeshStandardMaterial({ color: 0x1f293d, metalness: 0.8 });
      const bus = new THREE.Mesh(busGeo, busMat);
      bus.position.set(0, 0, 0);
      sceneGroup.add(bus);

      // Render Stage Towers
      stages.forEach((st) => {
        const stageTowerGeo = new THREE.BoxGeometry(3.6, 2.5, 5);
        const isHazard = pipelineState === 'branch_miss' && (st.name === 'IF' || st.name === 'ID');
        const isStall = (pipelineState === 'hazard_raw' || pipelineState === 'cache_miss') && st.name === 'EX';

        const stageMat = new THREE.MeshStandardMaterial({
          color: isHazard ? 0xef4444 : isStall ? 0xf59e0b : st.color,
          roughness: 0.3,
          metalness: 0.2,
          emissive: isHazard ? 0xef4444 : isStall ? 0xf59e0b : st.color,
          emissiveIntensity: 0.3
        });
        const tower = new THREE.Mesh(stageTowerGeo, stageMat);
        tower.position.set(st.x, 1.25, 0);
        tower.castShadow = true;
        tower.userData = {
          name: `Pipeline Stage: ${st.name} (${st.full})`,
          desc: `Microarchitectural execution unit in the 5-stage RISC-V core.`,
          specs: st.specs
        };
        sceneGroup.add(tower);
        interactiveObjects.push(tower);

        // Core Chip on Top
        const chipGeo = new THREE.BoxGeometry(2.4, 0.4, 2.4);
        const chipMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9, roughness: 0.2 });
        const chip = new THREE.Mesh(chipGeo, chipMat);
        chip.position.set(st.x, 2.7, 0);
        sceneGroup.add(chip);

        // Glow Ring
        const ringGeo = new THREE.RingGeometry(1.4, 1.6, 32);
        const ringMat = new THREE.MeshBasicMaterial({ 
          color: isHazard ? 0xef4444 : st.color, 
          side: THREE.DoubleSide 
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(st.x, 2.92, 0);
        sceneGroup.add(ring);
      });

      // Data Forwarding Bypass Laser Path
      if (pipelineState === 'hazard_raw') {
        const bypassCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(5, 2.5, -2.5),
          new THREE.Vector3(2.5, 4.5, -3.5),
          new THREE.Vector3(0, 2.5, -2.5)
        ]);
        const bypassGeo = new THREE.TubeGeometry(bypassCurve, 20, 0.12, 8, false);
        const bypassMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const bypassWire = new THREE.Mesh(bypassGeo, bypassMat);
        bypassWire.userData = {
          name: 'Hardware Forwarding Bypass Unit',
          desc: 'High-speed multiplexer bus bypassing register writeback latency.',
          specs: 'Latency: 0 Cycles • Transmits ALU/MEM output directly into EX input.'
        };
        sceneGroup.add(bypassWire);
        interactiveObjects.push(bypassWire);
      }
    }

    // ─── BUILD 3D RAFT CONSENSUS CLUSTER SCENE ───
    if (labMode === 'raft') {
      const radius = 9;
      nodes.forEach((node, idx) => {
        const angle = (idx / nodes.length) * Math.PI * 2 - Math.PI / 2;
        const nx = Math.cos(angle) * radius;
        const nz = Math.sin(angle) * radius;

        const nodeGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.5, 16);
        const isLeader = node.role === 'leader' && node.isAlive;
        const isAlive = node.isAlive;

        const nodeMat = new THREE.MeshStandardMaterial({
          color: !isAlive ? 0x374151 : isLeader ? 0xd4af37 : 0x06b6d4,
          metalness: 0.4,
          roughness: 0.3,
          emissive: !isAlive ? 0x1f2937 : isLeader ? 0xd4af37 : 0x06b6d4,
          emissiveIntensity: !isAlive ? 0.05 : isLeader ? 0.6 : 0.2
        });
        const server = new THREE.Mesh(nodeGeo, nodeMat);
        server.position.set(nx, 1.75, nz);
        server.castShadow = true;
        server.userData = {
          name: `Raft Cluster Server: Node ${node.id}`,
          desc: `Distributed consensus server maintaining replicated state machine.`,
          specs: `Role: ${node.role.toUpperCase()} • Term: ${node.term} • Committed Logs: ${node.logCount} • Status: ${node.isAlive ? 'ONLINE' : 'CRASHED'}`
        };
        sceneGroup.add(server);
        interactiveObjects.push(server);

        if (isLeader) {
          const crownGeo = new THREE.TorusGeometry(2.0, 0.15, 16, 32);
          const crownMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
          const crown = new THREE.Mesh(crownGeo, crownMat);
          crown.rotation.x = Math.PI / 2;
          crown.position.set(nx, 4.0, nz);
          sceneGroup.add(crown);
        }
      });

      const orbitGeo = new THREE.RingGeometry(radius - 0.2, radius + 0.2, 64);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, side: THREE.DoubleSide });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      orbit.position.y = 0.1;
      sceneGroup.add(orbit);
    }

    // ─── MOUSE DRAG & RAYCAST HOVER ───
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotY = 0;
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
      camera.position.z = Math.max(12, Math.min(38, camera.position.z + e.deltaY * 0.02));
      camera.position.y = Math.max(8, Math.min(32, camera.position.y + e.deltaY * 0.015));
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: true });

    // ─── ANIMATION LOOP ───
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const dist = 28;
      camera.position.x = dist * Math.sin(rotY) * Math.cos(rotX);
      camera.position.z = dist * Math.cos(rotY) * Math.cos(rotX);
      camera.position.y = dist * Math.sin(rotX);
      camera.lookAt(0, 1.5, 0);

      sceneGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.03;

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
  }, [labMode, pipelineState, nodes]);

  return (
    <div className={`space-y-6 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[9999] bg-[#04060c] p-6 overflow-y-auto' : ''}`}>
      {/* ─── TOP LAB BANNER ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d0f1e] via-[#090b14] to-[#170e24] border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">
                CS / IT 3D CPU Pipeline & Distributed Systems Visualizer
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                SYSTEM DESIGN & ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Interactive 3D RISC-V 5-stage instruction pipelining, data forwarding hazards, and Raft distributed consensus quorum.
            </p>
          </div>
        </div>

        {/* Mode Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setLabMode('pipeline'); playClickAudio(700); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              labMode === 'pipeline'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            5-Stage CPU Pipeline
          </button>
          <button
            onClick={() => { setLabMode('raft'); playClickAudio(700); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              labMode === 'raft'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            Raft Consensus Cluster (5-Node)
          </button>

          {/* VIVA DEFENSE CHALLENGE BUTTON */}
          <button
            onClick={() => {
              setIsVivaChallenge(!isVivaChallenge);
              setChallengeResolved(false);
              setSelectedHypothesis(null);
              playClickAudio(900);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              isVivaChallenge 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/30 animate-pulse' 
                : 'bg-purple-500/15 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
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
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#140b1e] to-black border-2 border-purple-500/50 shadow-2xl animate-fade-in text-xs font-mono">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
              <span className="text-purple-400 font-bold uppercase tracking-wider text-xs">
                PLACEMENT TECHNICAL VIVA DEFENSE • SYSTEM DESIGN & ARCHITECTURE SCENARIO #02
              </span>
            </div>
            {challengeResolved ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ARCHITECTURAL HAZARD RESOLVED (+{earnedXP} PROOF-OF-SKILL XP AWARDED)</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                DIAGNOSE PIPELINE DEPENDENCY HAZARD
              </span>
            )}
          </div>

          <div className="mt-3.5 space-y-2">
            <p className="text-sm font-sans font-medium text-purple-100">
              <strong className="text-purple-400">Recruiter Problem:</strong> "In a high-speed RISC-V 5-stage pipeline, an instruction sequence has a `LW x1, 0(x2)` followed immediately by `ADD x3, x1, x4`. Even with an ALU forwarding bypass unit enabled, why is a 1-cycle pipeline bubble stall strictly required?"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {[
                { id: 0, text: 'A) The loaded data is only fetched from L1 Cache at the end of the MEM stage, traveling backward in time to EX is physically impossible.' },
                { id: 1, text: 'B) The ALU carry-lookahead adder requires 2 cycles to settle 64-bit addition.' },
                { id: 2, text: 'C) Register x1 cannot be accessed due to dual-port register file read collisions.' }
              ].map((hyp) => (
                <button
                  key={hyp.id}
                  onClick={() => handleVerifyFix(hyp.id)}
                  className={`p-3 rounded-xl border text-left font-mono text-[11px] transition-all cursor-pointer ${
                    selectedHypothesis === hyp.id
                      ? (hyp.id === 0 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-red-500/20 border-red-500 text-red-200')
                      : 'bg-black/50 border-white/10 hover:border-purple-500/40 text-gray-300 hover:text-white'
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

        {/* LEFT COLUMN: 3D THREE.JS VIEWPORT (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#090b14] border border-white/10 overflow-hidden shadow-2xl relative">
          <div className="p-3.5 px-5 bg-[#0e101c] border-b border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-purple-400 font-bold">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>{labMode === 'pipeline' ? '3D RISC-V Hardware Datapath' : '3D Raft Quorum Topology'}</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-[11px] hidden sm:inline">
                Drag to 360° Orbit • Scroll to Zoom
              </span>
              <button
                onClick={() => { setIsPaused(!isPaused); playClickAudio(isPaused ? 600 : 350); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isPaused 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'bg-gray-800 text-gray-300 border border-white/10'
                }`}
              >
                {!isPaused ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{!isPaused ? 'RUNNING' : 'PAUSED'}</span>
              </button>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div ref={mountRef} className="w-full h-[450px] cursor-grab active:cursor-grabbing relative">
            {/* 3D HOLOGRAPHIC RAYCAST HOVER TOOLTIP */}
            {hoverInfo && (
              <div 
                className="absolute z-30 pointer-events-none p-3 rounded-xl bg-[#090717]/95 border border-purple-400/50 shadow-[0_0_25px_rgba(168,85,247,0.4)] backdrop-blur-md max-w-xs transition-all duration-75 text-xs font-mono"
                style={{
                  left: Math.min(window.innerWidth - 320, hoverInfo.coords.x + 15),
                  top: Math.max(10, hoverInfo.coords.y - 75)
                }}
              >
                <div className="flex items-center gap-1.5 text-purple-300 font-bold border-b border-purple-500/30 pb-1 mb-1">
                  <Crosshair className="w-3.5 h-3.5 text-purple-400" />
                  <span>{hoverInfo.name}</span>
                </div>
                <p className="text-[10px] text-gray-300 mb-1">{hoverInfo.desc}</p>
                <div className="text-[9px] text-cyan-300 font-bold bg-black/50 p-1.5 rounded">
                  {hoverInfo.specs}
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 pointer-events-none p-2.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-gray-300 backdrop-blur-sm space-y-0.5">
              {labMode === 'pipeline' ? (
                <>
                  <div>Stages: <span className="text-purple-400 font-bold">IF → ID → EX → MEM → WB</span></div>
                  <div>Hazard Bypass: <span className="text-cyan-400 font-bold">{pipelineState === 'hazard_raw' ? 'FORWARDING ACTIVE' : 'PASSTHROUGH'}</span></div>
                  <div>Pipeline Status: <span className="text-emerald-400 font-bold">{pipelineState.toUpperCase()}</span></div>
                </>
              ) : (
                <>
                  <div>Active Quorum: <span className="text-emerald-400 font-bold">{nodes.filter(n => n.isAlive).length}/5 Nodes Alive</span></div>
                  <div>Consensus Leader: <span className="text-[#d4af37] font-bold">Node {nodes.find(n => n.role === 'leader')?.id || 'None (Electing)'}</span></div>
                  <div>Protocol: <span className="text-cyan-400 font-bold">Raft RPC AppendEntries</span></div>
                </>
              )}
            </div>
          </div>

          {/* Under Canvas Scenario Bar */}
          <div className="p-4 bg-[#0a0c16] border-t border-white/10">
            {labMode === 'pipeline' ? (
              <div className="space-y-2">
                <span className="text-xs font-mono text-gray-400 font-bold">Inject Pipeline Scenarios:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => { setPipelineState('normal'); playClickAudio(700); }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      pipelineState === 'normal'
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                    }`}
                  >
                    Ideal Flow (CPI 1.0)
                  </button>
                  <button
                    onClick={() => { setPipelineState('hazard_raw'); playClickAudio(500); }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      pipelineState === 'hazard_raw'
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                    }`}
                  >
                    RAW Data Hazard
                  </button>
                  <button
                    onClick={() => { setPipelineState('branch_miss'); playClickAudio(400); }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      pipelineState === 'branch_miss'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                    }`}
                  >
                    Branch Flush
                  </button>
                  <button
                    onClick={() => { setPipelineState('cache_miss'); playClickAudio(450); }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      pipelineState === 'cache_miss'
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                    }`}
                  >
                    L1 Cache Stall
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-mono text-gray-400 font-bold">Distributed Chaos Controls:</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleKillLeader}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Kill Current Leader</span>
                  </button>
                  <button
                    onClick={handleHealCluster}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Heal All Nodes</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME ARCHITECTURE TELEMETRY (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-[#080a14] border border-purple-500/20 shadow-2xl overflow-hidden">
          <div className="p-3.5 px-5 bg-[#0d0f1e] border-b border-white/10 flex items-center justify-between">
            <span className="flex items-center gap-2 text-purple-300 font-mono text-xs font-bold">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>{labMode === 'pipeline' ? 'HARDWARE PERFORMANCE TELEMETRY' : 'RAFT REPLICATED STATE LOG'}</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
              IPC METRICS
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs font-mono">
            {labMode === 'pipeline' ? (
              <>
                {/* Metrics 4-Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-black/60 border border-purple-500/20">
                    <span className="text-gray-500 text-[10px] block">CLOCK CYCLES</span>
                    <span className="text-xl font-bold text-white">{cycleCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-purple-500/20">
                    <span className="text-gray-500 text-[10px] block">INSTRUCTIONS RETIRED</span>
                    <span className="text-xl font-bold text-emerald-400">{instructionCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-purple-500/20">
                    <span className="text-gray-500 text-[10px] block">MEASURED CPI</span>
                    <span className="text-xl font-bold text-cyan-400">{cpi}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-purple-500/20">
                    <span className="text-gray-500 text-[10px] block">IPC (EFFICIENCY)</span>
                    <span className="text-xl font-bold text-purple-400">{(1 / Number(cpi)).toFixed(2)}</span>
                  </div>
                </div>

                {/* Clock Speed Slider */}
                <div className="space-y-1 p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span>Clock Multiplier:</span>
                    <span className="text-purple-400 font-bold">{clockSpeed.toFixed(1)}x Speed</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.5"
                    value={clockSpeed}
                    onChange={(e) => { setClockSpeed(Number(e.target.value)); playClickAudio(400); }}
                    className="w-full accent-purple-400 cursor-pointer h-1.5 bg-white/10 rounded"
                  />
                </div>

                {/* Theoretical Architecture Callout */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-200 text-[11px] leading-relaxed flex items-start gap-2.5">
                  <Info className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-300">Interview Defense Concept: </span>
                    {pipelineState === 'normal' && (
                      <span>In an ideal pipelined processor, once the pipeline is full, one instruction finishes every cycle (CPI = 1.0), yielding a ~5x speedup over non-pipelined architectures.</span>
                    )}
                    {pipelineState === 'hazard_raw' && (
                      <span>Read-After-Write (RAW) data hazard solved via Hardware Forwarding: The ALU output is routed directly back to the execution stage without waiting for the Writeback stage.</span>
                    )}
                    {pipelineState === 'branch_miss' && (
                      <span>Branch mispredictions require pipeline flushing. Modern high-performance CPUs use 2-level adaptive branch predictors to avoid a 3-to-15 cycle bubble penalty.</span>
                    )}
                    {pipelineState === 'cache_miss' && (
                      <span>L1 cache misses force the memory controller to query L2/L3 or DRAM. A 200-cycle memory stall stalls the entire pipeline unless Out-of-Order (OoO) scheduling is enabled.</span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Raft Nodes Overview */}
                <div className="space-y-2">
                  <span className="text-gray-400 text-[11px] block font-bold">Quorum Node Cluster Table:</span>
                  <div className="space-y-1.5">
                    {nodes.map(n => (
                      <div key={n.id} className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${n.isAlive ? (n.role === 'leader' ? 'bg-[#d4af37]' : 'bg-cyan-400') : 'bg-red-500'}`} />
                          <span className="font-bold text-white">Node {n.id}</span>
                        </span>
                        <span className={`font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                          n.role === 'leader' ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40' : n.isAlive ? 'bg-cyan-500/10 text-cyan-300' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {n.role}
                        </span>
                        <span className="text-gray-400">Term: {n.term}</span>
                        <span className="text-emerald-400 font-bold">{n.logCount} logs</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Replicated Event Stream */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1 max-h-36 overflow-y-auto text-[10px]">
                  <span className="text-gray-500 font-bold block mb-1">REAL-TIME CONSENSUS LOG:</span>
                  {raftLog.map((log, idx) => (
                    <div key={idx} className="text-gray-300 font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
