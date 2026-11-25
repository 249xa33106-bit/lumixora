import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Cpu, Zap, Activity, Play, Pause, RotateCcw, 
  Settings2, Eye, Maximize2, Minimize2, ShieldCheck, Sparkles,
  Info, Volume2, HelpCircle, CheckCircle2, AlertTriangle, Crosshair
} from 'lucide-react';

export default function VirtualBreadboard3DLab() {
  const mountRef = useRef(null);
  const scopeCanvasRef = useRef(null);

  // Lab Experiment States
  const [circuitPreset, setCircuitPreset] = useState('555_astable'); // '555_astable' | 'rc_filter' | 'logic_gates'
  const [powerOn, setPowerOn] = useState(true);
  const [supplyVoltage, setSupplyVoltage] = useState(5.0); // 5V default
  const [frequency, setFrequency] = useState(1000); // 1 kHz
  const [waveType, setWaveType] = useState('square'); // 'sine' | 'square' | 'triangle'
  const [timeDiv, setTimeDiv] = useState(0.5); // ms/div
  const [voltsDiv, setVoltsDiv] = useState(1.0); // V/div
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Logic Gate Inputs (for logic_gates preset)
  const [inputA, setInputA] = useState(1);
  const [inputB, setInputB] = useState(0);

  // 555 Timer specific
  const [r1Val, setR1Val] = useState(10); // 10k ohm
  const [r2Val, setR2Val] = useState(47); // 47k ohm
  const [cVal, setCVal] = useState(10); // 10 uF

  // ─── 3D RAYCAST HOVER HUD STATE ───
  const [hoverInfo, setHoverInfo] = useState(null); // { name, desc, specs, coords: {x, y} }

  // ─── VIVA CHALLENGE & FAULT INJECTION STATE ───
  const [isVivaChallenge, setIsVivaChallenge] = useState(false);
  const [activeFault, setActiveFault] = useState('discharge_short'); // 'discharge_short' | 'cap_open' | 'pullup_missing'
  const [challengeResolved, setChallengeResolved] = useState(false);
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);
  const [earnedXP, setEarnedXP] = useState(0);

  // Telemetry outputs
  const [telemetry, setTelemetry] = useState({
    vpp: '5.00 V',
    vrms: '3.53 V',
    freq: '1.00 kHz',
    duty: '50.0 %',
    state: 'Active Oscillating'
  });

  // Synthesize pleasant tactile audio ticks
  const playClickAudio = (freq = 600) => {
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

  // Calculate 555 frequency & duty cycle
  useEffect(() => {
    if (isVivaChallenge && !challengeResolved) {
      if (activeFault === 'discharge_short') {
        setTelemetry({
          vpp: '0.00 V',
          vrms: '0.00 V',
          freq: '0.00 Hz (STUCK LOW)',
          duty: '0.0 %',
          state: 'FAULT INJECTED: Output shorted to Ground'
        });
        return;
      }
    }

    if (circuitPreset === '555_astable') {
      const f = 1440000 / ((r1Val + 2 * r2Val) * 1000 * (cVal * 1e-6));
      const duty = ((r1Val + r2Val) / (r1Val + 2 * r2Val)) * 100;
      const formattedFreq = f > 1000 ? `${(f / 1000).toFixed(2)} kHz` : `${f.toFixed(1)} Hz`;
      setTelemetry({
        vpp: `${supplyVoltage.toFixed(2)} V`,
        vrms: `${(supplyVoltage * 0.707).toFixed(2)} V`,
        freq: powerOn ? formattedFreq : '0.00 Hz',
        duty: `${duty.toFixed(1)} %`,
        state: powerOn ? 'Astable Pulses Generated' : 'Powered Off'
      });
      if (powerOn) setFrequency(f);
    } else if (circuitPreset === 'rc_filter') {
      const fc = 1 / (2 * Math.PI * (r1Val * 1000) * (cVal * 1e-6));
      setTelemetry({
        vpp: `${supplyVoltage.toFixed(2)} V`,
        vrms: `${(supplyVoltage * 0.707).toFixed(2)} V`,
        freq: `Cutoff: ${fc.toFixed(1)} Hz`,
        duty: 'N/A (Analog)',
        state: powerOn ? (frequency < fc ? 'Passband (Low Loss)' : 'Attenuated (-20dB/dec)') : 'Powered Off'
      });
    } else if (circuitPreset === 'logic_gates') {
      const outNand = !(inputA && inputB) ? 1 : 0;
      setTelemetry({
        vpp: `${outNand ? supplyVoltage.toFixed(2) : '0.00'} V`,
        vrms: `${outNand ? '5.00' : '0.00'} V`,
        freq: 'DC Digital Level',
        duty: outNand ? 'HIGH (1)' : 'LOW (0)',
        state: `NAND Out: ${outNand} (A=${inputA}, B=${inputB})`
      });
    }
  }, [circuitPreset, powerOn, supplyVoltage, r1Val, r2Val, cVal, frequency, inputA, inputB, isVivaChallenge, challengeResolved, activeFault]);

  // Handle Viva Fix Verification
  const handleVerifyFix = (idx) => {
    setSelectedHypothesis(idx);
    playClickAudio(800);
    if (idx === 1) { // Correct answer: Pin 7 Discharge short
      setChallengeResolved(true);
      setEarnedXP(50);
      playClickAudio(1200);
    }
  };

  // ─── 3D THREE.JS SCENE SETUP & RAYCASTING ───
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06070d);
    scene.fog = new THREE.FogExp2(0x06070d, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 16, 22);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Raycaster & Mouse vector
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactiveObjects = [];

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.8);
    mainLight.position.set(10, 25, 15);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 1.0);
    cyanRimLight.position.set(-15, 10, -10);
    scene.add(cyanRimLight);

    // ─── 1. BREADBOARD BODY ───
    const breadboardGeo = new THREE.BoxGeometry(22, 1.2, 13);
    const breadboardMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.35,
      metalness: 0.05
    });
    const breadboard = new THREE.Mesh(breadboardGeo, breadboardMat);
    breadboard.receiveShadow = true;
    scene.add(breadboard);

    // Power Rails (Red and Blue stripes)
    const redStripeGeo = new THREE.BoxGeometry(21.5, 0.02, 0.25);
    const redStripeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const blueStripeMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });

    const topRedStripe = new THREE.Mesh(redStripeGeo, redStripeMat);
    topRedStripe.position.set(0, 0.61, 5.8);
    scene.add(topRedStripe);

    const topBlueStripe = new THREE.Mesh(redStripeGeo, blueStripeMat);
    topBlueStripe.position.set(0, 0.61, 5.2);
    scene.add(topBlueStripe);

    const botRedStripe = new THREE.Mesh(redStripeGeo, redStripeMat);
    botRedStripe.position.set(0, 0.61, -5.2);
    scene.add(botRedStripe);

    const botBlueStripe = new THREE.Mesh(redStripeGeo, blueStripeMat);
    botBlueStripe.position.set(0, 0.61, -5.8);
    scene.add(botBlueStripe);

    // Pin Holes Grid (InstancedMesh)
    const holeGeo = new THREE.BoxGeometry(0.18, 0.05, 0.18);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x1f242d });
    const holeCount = 400;
    const holeMesh = new THREE.InstancedMesh(holeGeo, holeMat, holeCount);
    const dummy = new THREE.Object3D();
    let holeIdx = 0;

    for (let x = -9.5; x <= 9.5; x += 0.8) {
      for (let z of [4.5, 3.7, 2.9, 2.1, 1.3, -1.3, -2.1, -2.9, -3.7, -4.5]) {
        if (holeIdx < holeCount) {
          dummy.position.set(x, 0.61, z);
          dummy.updateMatrix();
          holeMesh.setMatrixAt(holeIdx++, dummy.matrix);
        }
      }
    }
    holeMesh.instanceMatrix.needsUpdate = true;
    scene.add(holeMesh);

    // ─── 2. INTERACTIVE COMPONENTS WITH RAYCAST METADATA ───
    
    // A. NE555 Precision Timer IC
    const icBodyGeo = new THREE.BoxGeometry(3.6, 0.7, 2.2);
    const icBodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
      metalness: 0.1
    });
    const icChip = new THREE.Mesh(icBodyGeo, icBodyMat);
    icChip.position.set(-2, 0.95, 0);
    icChip.castShadow = true;
    icChip.userData = {
      name: 'NE555 Precision Timer IC',
      desc: 'Bipolar timer operating in Astable Multivibrator mode.',
      specs: 'Pin 8: VCC (+5V) • Pin 1: GND • Pin 3: Output Pulse • Pin 7: Open-collector Discharge'
    };
    scene.add(icChip);
    interactiveObjects.push(icChip);

    // IC Pins
    const pinGeo = new THREE.BoxGeometry(0.15, 0.5, 0.3);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.2 });
    for (let p = -1.2; p <= 1.2; p += 0.8) {
      const topPin = new THREE.Mesh(pinGeo, pinMat);
      topPin.position.set(-2 + p, 0.7, 1.2);
      scene.add(topPin);

      const botPin = new THREE.Mesh(pinGeo, pinMat);
      botPin.position.set(-2 + p, 0.7, -1.2);
      scene.add(botPin);
    }

    // B. Resistor R1/R2
    const resBodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.2, 16);
    const resBodyMat = new THREE.MeshStandardMaterial({ color: 0xd9b382, roughness: 0.5 });
    const resistor = new THREE.Mesh(resBodyGeo, resBodyMat);
    resistor.rotation.z = Math.PI / 2;
    resistor.position.set(3.5, 1.1, 2.5);
    resistor.castShadow = true;
    resistor.userData = {
      name: `Timing Resistor (${r1Val} kΩ)`,
      desc: 'Carbon film resistor determining capacitor charge time.',
      specs: `Resistance: ${r1Val} kΩ • Tolerance: ±5% • Power: 0.25W`
    };
    scene.add(resistor);
    interactiveObjects.push(resistor);

    // C. Electrolytic Capacitor
    const capGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.6, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.3, roughness: 0.4 });
    const capacitor = new THREE.Mesh(capGeo, capMat);
    capacitor.position.set(4.0, 1.4, -2.5);
    capacitor.castShadow = true;
    capacitor.userData = {
      name: `Timing Capacitor (${cVal} µF)`,
      desc: 'Electrolytic capacitor charging to 2/3 VCC and discharging to 1/3 VCC.',
      specs: `Capacitance: ${cVal} µF • Voltage Rating: 25V • Dielectric: Aluminum Oxide`
    };
    scene.add(capacitor);
    interactiveObjects.push(capacitor);

    // D. 5mm Diffused Glowing LED
    const ledBaseGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 16);
    const ledDomeGeo = new THREE.SphereGeometry(0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const isFaultStuck = isVivaChallenge && !challengeResolved && activeFault === 'discharge_short';
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: (powerOn && !isFaultStuck) ? 1.5 : 0.05,
      transparent: true,
      opacity: 0.9,
      roughness: 0.2
    });
    const ledDome = new THREE.Mesh(ledDomeGeo, ledMat);
    ledDome.position.set(7.5, 1.6, 0);
    ledDome.userData = {
      name: 'Diffused 5mm Green LED',
      desc: 'Light-emitting diode driven by Pin 3 output pulses.',
      specs: `Forward Current: 20mA • Forward Drop: 2.1V • State: ${isFaultStuck ? 'Stuck OFF (Fault)' : 'Pulsing'}`
    };
    scene.add(ledDome);
    interactiveObjects.push(ledDome);

    const ledBase = new THREE.Mesh(ledBaseGeo, ledMat);
    ledBase.position.set(7.5, 1.4, 0);
    scene.add(ledBase);

    // LED Glow PointLight
    const ledLight = new THREE.PointLight(0x00ff88, (powerOn && !isFaultStuck) ? 3 : 0, 8);
    ledLight.position.set(7.5, 2.0, 0);
    scene.add(ledLight);

    // E. Jumper Wires
    const createWire = (start, mid, end, color, wireName) => {
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const wireGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
      const wireMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.1 });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      wireMesh.castShadow = true;
      wireMesh.userData = {
        name: wireName,
        desc: 'Solid-core copper jumper wire interconnecting circuit nodes.',
        specs: 'Gauge: 22 AWG • Resistance: ~0.05 Ω'
      };
      scene.add(wireMesh);
      interactiveObjects.push(wireMesh);
    };

    createWire(new THREE.Vector3(-3.2, 0.7, 1.2), new THREE.Vector3(-1.5, 2.5, 3.5), new THREE.Vector3(2.5, 0.7, 2.5), 0xf59e0b, 'Jumper: Pin 7 (Discharge) -> R1/R2 Junction');
    createWire(new THREE.Vector3(-0.8, 0.7, 1.2), new THREE.Vector3(3.0, 3.0, 1.0), new THREE.Vector3(7.0, 0.7, 0.2), 0x10b981, 'Jumper: Pin 3 (Output) -> LED Anode');
    createWire(new THREE.Vector3(-2.0, 0.7, -1.2), new THREE.Vector3(1.0, 2.2, -2.0), new THREE.Vector3(3.5, 0.7, -2.5), 0x3b82f6, 'Jumper: Pin 2 (Trigger) -> Timing Cap');
    createWire(new THREE.Vector3(-3.2, 0.7, -1.2), new THREE.Vector3(-5.0, 2.0, 2.0), new THREE.Vector3(-7.0, 0.7, 5.2), 0xef4444, 'Jumper: Pin 8 (VCC) -> +5V Power Rail');
    createWire(new THREE.Vector3(8.0, 0.7, -0.2), new THREE.Vector3(8.5, 1.5, -3.0), new THREE.Vector3(8.0, 0.7, -5.2), 0x0f172a, 'Jumper: LED Cathode -> Ground Rail');

    // ─── MOUSE DRAG ORBIT ROTATION & RAYCAST HOVER ───
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0.5;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      // Raycast for hover tooltip
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
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(0.1, Math.min(Math.PI / 2.2, targetRotationX + deltaY * 0.008));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      camera.position.z = Math.max(12, Math.min(35, camera.position.z + e.deltaY * 0.02));
      camera.position.y = Math.max(8, Math.min(30, camera.position.y + e.deltaY * 0.015));
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
      const elapsedTime = clock.getElapsedTime();

      // Smooth Orbit Lerping
      const radius = 26;
      camera.position.x = radius * Math.sin(targetRotationY) * Math.cos(targetRotationX);
      camera.position.z = radius * Math.cos(targetRotationY) * Math.cos(targetRotationX);
      camera.position.y = radius * Math.sin(targetRotationX);
      camera.lookAt(0, 0.5, 0);

      // LED Blinking Effect for 555 Astable
      if (powerOn && !isFaultStuck && circuitPreset === '555_astable') {
        const pulse = Math.sin(elapsedTime * (frequency > 20 ? 8 : frequency * Math.PI * 2)) > 0;
        ledMat.emissiveIntensity = pulse ? 2.2 : 0.05;
        ledLight.intensity = pulse ? 3.5 : 0;
      } else if (powerOn && !isFaultStuck && circuitPreset === 'logic_gates') {
        const outVal = !(inputA && inputB);
        ledMat.emissiveIntensity = outVal ? 2.2 : 0.05;
        ledLight.intensity = outVal ? 3.5 : 0;
      } else {
        ledMat.emissiveIntensity = (powerOn && !isFaultStuck) ? 1.8 : 0.05;
        ledLight.intensity = (powerOn && !isFaultStuck) ? 2.5 : 0;
      }

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
  }, [circuitPreset, powerOn, frequency, inputA, inputB, isVivaChallenge, challengeResolved, activeFault, r1Val]);

  // ─── OSCILLOSCOPE CRT CANVAS LOOP ───
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let phase = 0;

    const renderScope = () => {
      animId = requestAnimationFrame(renderScope);
      const w = canvas.width;
      const h = canvas.height;

      // Dark CRT Background
      ctx.fillStyle = '#060a0f';
      ctx.fillRect(0, 0, w, h);

      // CRT Grid Mesh (8x8 divisions)
      ctx.strokeStyle = '#0d2229';
      ctx.lineWidth = 1;
      const stepX = w / 10;
      const stepY = h / 8;

      for (let x = 0; x <= w; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center crosshairs
      ctx.strokeStyle = '#184752';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      const isFaultStuck = isVivaChallenge && !challengeResolved && activeFault === 'discharge_short';

      if (!powerOn || isFaultStuck) {
        // Flatline ground
        ctx.strokeStyle = isFaultStuck ? '#ef4444' : '#00ff88';
        ctx.shadowColor = isFaultStuck ? '#ef4444' : '#00ff88';
        ctx.shadowBlur = 6;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (isFaultStuck) {
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('⚠ FAULT: STUCK AT GROUND (0V)', 20, h / 2 - 12);
        }
        return;
      }

      // Live Phosphor Signal Waveform
      phase += 0.08;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const centerY = h / 2;
      const amplitudePx = (supplyVoltage / voltsDiv) * (stepY / 2);

      for (let x = 0; x < w; x++) {
        const t = (x / w) * (10 / timeDiv) + phase;
        let yVal = 0;

        if (waveType === 'sine') {
          yVal = Math.sin(t);
        } else if (waveType === 'square') {
          yVal = Math.sin(t) >= 0 ? 1 : -1;
        } else if (waveType === 'triangle') {
          yVal = (2 / Math.PI) * Math.asin(Math.sin(t));
        }

        const y = centerY - yVal * amplitudePx;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Digital Scope Telemetry Overlay
      ctx.fillStyle = '#00f0ff';
      ctx.font = '10px monospace';
      ctx.fillText(`CH1: ${voltsDiv.toFixed(1)}V/DIV`, 10, 18);
      ctx.fillText(`TIME: ${timeDiv.toFixed(1)}ms/DIV`, 10, 32);
      ctx.fillStyle = '#10b981';
      ctx.fillText(`FREQ: ${telemetry.freq}`, w - 120, 18);
      ctx.fillText(`VPP: ${telemetry.vpp}`, w - 120, 32);
    };

    renderScope();
    return () => cancelAnimationFrame(animId);
  }, [powerOn, supplyVoltage, voltsDiv, timeDiv, waveType, telemetry, isVivaChallenge, challengeResolved, activeFault]);

  return (
    <div className={`space-y-6 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[9999] bg-[#04060c] p-6 overflow-y-auto' : ''}`}>
      {/* ─── TOP LAB BANNER ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#090d18] to-[#120f24] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">
                ECE / EEE 3D Virtual Breadboard & Oscilloscope Workbench
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                HARDWARE 60 FPS
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Interactive 3D spatial electronics lab. Wire ICs, tweak passive components, and analyze real-time CRT waveforms.
            </p>
          </div>
        </div>

        {/* Experiment Selector & Action Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setCircuitPreset('555_astable'); setWaveType('square'); playClickAudio(700); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              circuitPreset === '555_astable'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            NE555 Timer (Astable)
          </button>
          <button
            onClick={() => { setCircuitPreset('rc_filter'); setWaveType('sine'); playClickAudio(700); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              circuitPreset === 'rc_filter'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            RC Filter & Bode Cutoff
          </button>
          <button
            onClick={() => { setCircuitPreset('logic_gates'); setWaveType('square'); playClickAudio(700); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              circuitPreset === 'logic_gates'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            7400 NAND Logic Gate
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
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#18110b] to-black border-2 border-amber-500/50 shadow-2xl animate-fade-in text-xs font-mono">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">
                PLACEMENT TECHNICAL VIVA DEFENSE • FAULT INJECTION SCENARIO #01
              </span>
            </div>
            {challengeResolved ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>FAULT RESOLVED (+{earnedXP} PROOF-OF-SKILL XP AWARDED)</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                PROBE THE 3D CIRCUIT & OSCILLOSCOPE TO DIAGNOSE
              </span>
            )}
          </div>

          <div className="mt-3.5 space-y-2">
            <p className="text-sm font-sans font-medium text-amber-100">
              <strong className="text-amber-400">Recruiter Problem:</strong> "You power on this NE555 astable flasher circuit with +5V VCC, but the oscilloscope waveform is completely flatlined at 0V (Ground), and the green LED never pulses. What is the root cause?"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {[
                { id: 0, text: 'A) Capacitor dielectric breakdown caused infinite capacitance.' },
                { id: 1, text: 'B) Pin 7 (Discharge) is shorted directly to GND, keeping Pin 2 trigger low.' },
                { id: 2, text: 'C) The supply voltage +5V is too high for the NE555 timer.' }
              ].map((hyp) => (
                <button
                  key={hyp.id}
                  onClick={() => handleVerifyFix(hyp.id)}
                  className={`p-3 rounded-xl border text-left font-mono text-[11px] transition-all cursor-pointer ${
                    selectedHypothesis === hyp.id
                      ? (hyp.id === 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-red-500/20 border-red-500 text-red-200')
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
        
        {/* LEFT COLUMN: 3D THREE.JS BREADBOARD VIEWPORT (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#090b14] border border-white/10 overflow-hidden shadow-2xl relative">
          {/* Header Controls */}
          <div className="p-3.5 px-5 bg-[#0e111d] border-b border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-cyan-400 font-bold">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>3D Breadboard Viewport</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-[11px] hidden sm:inline">
                Drag to 360° Orbit • Scroll to Zoom
              </span>
              <button
                onClick={() => { setPowerOn(!powerOn); playClickAudio(powerOn ? 350 : 650); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  powerOn 
                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {powerOn ? <Play className="w-3.5 h-3.5 fill-black" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{powerOn ? '5V POWER ON' : 'POWER OFF'}</span>
              </button>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <div 
            ref={mountRef} 
            className="w-full h-[450px] cursor-grab active:cursor-grabbing relative"
          >
            {/* 3D HOLOGRAPHIC RAYCAST HOVER TOOLTIP */}
            {hoverInfo && (
              <div 
                className="absolute z-30 pointer-events-none p-3 rounded-xl bg-[#080d1a]/95 border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-md max-w-xs transition-all duration-75 text-xs font-mono"
                style={{
                  left: Math.min(window.innerWidth - 320, hoverInfo.coords.x + 15),
                  top: Math.max(10, hoverInfo.coords.y - 75)
                }}
              >
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold border-b border-cyan-500/30 pb-1 mb-1">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{hoverInfo.name}</span>
                </div>
                <p className="text-[10px] text-gray-300 mb-1">{hoverInfo.desc}</p>
                <div className="text-[9px] text-emerald-400 font-bold bg-black/50 p-1.5 rounded">
                  {hoverInfo.specs}
                </div>
              </div>
            )}

            {/* Overlay Compass Badge */}
            <div className="absolute bottom-3 left-3 pointer-events-none p-2.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-gray-300 backdrop-blur-sm space-y-0.5">
              <div>VCC Rail: <span className="text-emerald-400 font-bold">+{supplyVoltage.toFixed(1)}V DC</span></div>
              <div>GND Rail: <span className="text-gray-400 font-bold">0.0V</span></div>
              <div>Active IC: <span className="text-cyan-300 font-bold">{circuitPreset === '555_astable' ? 'NE555 Timer' : circuitPreset === 'rc_filter' ? 'Passive RC' : '74HC00 NAND'}</span></div>
            </div>
          </div>

          {/* Circuit Interactive Controls Under Canvas */}
          <div className="p-4 bg-[#0a0d17] border-t border-white/10">
            {circuitPreset === '555_astable' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>Timing R1:</span>
                    <span className="text-cyan-400 font-bold">{r1Val} kΩ</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={r1Val}
                    onChange={(e) => { setR1Val(Number(e.target.value)); playClickAudio(400 + Number(e.target.value) * 5); }}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>Timing R2:</span>
                    <span className="text-cyan-400 font-bold">{r2Val} kΩ</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={r2Val}
                    onChange={(e) => { setR2Val(Number(e.target.value)); playClickAudio(400 + Number(e.target.value) * 5); }}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>Timing Cap (C):</span>
                    <span className="text-emerald-400 font-bold">{cVal} µF</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={cVal}
                    onChange={(e) => { setCVal(Number(e.target.value)); playClickAudio(350 + Number(e.target.value) * 6); }}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded"
                  />
                </div>
              </div>
            )}

            {circuitPreset === 'logic_gates' && (
              <div className="flex items-center justify-between gap-4 p-2 bg-black/40 rounded-xl border border-white/10 text-xs font-mono">
                <span className="text-gray-300 font-bold">Set Logic Inputs:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setInputA(inputA === 1 ? 0 : 1); playClickAudio(700); }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      inputA === 1 ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Input A: {inputA}
                  </button>
                  <button
                    onClick={() => { setInputB(inputB === 1 ? 0 : 1); playClickAudio(700); }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      inputB === 1 ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Input B: {inputB}
                  </button>
                </div>
                <div className="text-emerald-400 font-bold">
                  NAND Output: {!(inputA && inputB) ? '1 (HIGH)' : '0 (LOW)'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DIGITAL DUAL-TRACE OSCILLOSCOPE (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-[#080c14] border border-cyan-500/20 shadow-2xl overflow-hidden">
          {/* Scope Header */}
          <div className="p-3.5 px-5 bg-[#0a101d] border-b border-white/10 flex items-center justify-between">
            <span className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>DSO-X 2000 DIGITAL OSCILLOSCOPE</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
              ● TRIGGER LOCKED
            </span>
          </div>

          {/* CRT Oscilloscope Screen */}
          <div className="p-4 bg-black flex flex-col items-center justify-center">
            <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <canvas 
                ref={scopeCanvasRef} 
                width={420} 
                height={240} 
                className="w-full max-w-[420px] h-[220px] block"
              />
            </div>
          </div>

          {/* Scope Knobs & Signal Dial Matrix */}
          <div className="p-4 bg-[#0a0f1d] border-t border-white/10 space-y-3.5 flex-1 text-xs font-mono">
            
            {/* Waveform Selector */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-gray-400">Function Generator:</span>
              <div className="flex gap-1.5">
                {['sine', 'square', 'triangle'].map((type) => (
                  <button
                    key={type}
                    onClick={() => { setWaveType(type); playClickAudio(600); }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      waveType === type
                        ? 'bg-cyan-500 text-black font-black'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Timebase & Volts/Div Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>TIME/DIV:</span>
                  <span className="text-cyan-400 font-bold">{timeDiv} ms</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={timeDiv}
                  onChange={(e) => { setTimeDiv(Number(e.target.value)); playClickAudio(400); }}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>VOLTS/DIV:</span>
                  <span className="text-cyan-400 font-bold">{voltsDiv} V</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.5"
                  value={voltsDiv}
                  onChange={(e) => { setVoltsDiv(Number(e.target.value)); playClickAudio(400); }}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded"
                />
              </div>
            </div>

            {/* Live Parameter Telemetry Card */}
            <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/20 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-gray-500 block text-[9px]">VPP (PEAK-TO-PEAK)</span>
                <span className="text-white font-bold">{telemetry.vpp}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">VRMS (EFFECTIVE)</span>
                <span className="text-white font-bold">{telemetry.vrms}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">FREQUENCY</span>
                <span className="text-emerald-400 font-bold">{telemetry.freq}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px]">DUTY CYCLE</span>
                <span className="text-cyan-400 font-bold">{telemetry.duty}</span>
              </div>
            </div>

            {/* Viva & Theoretical Insight Callout */}
            <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-[10px] text-cyan-200 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-300">Engineering Viva Insight: </span>
                {circuitPreset === '555_astable' && (
                  <span>The 555 astable frequency formula is f = 1.44 / ((R1 + 2*R2) * C). The capacitor charges through R1+R2 and discharges strictly through R2 via pin 7 (Discharge).</span>
                )}
                {circuitPreset === 'rc_filter' && (
                  <span>Cutoff frequency occurs where capacitive reactance equals resistance: Xc = R, resulting in a -3dB voltage attenuation and 45° phase shift.</span>
                )}
                {circuitPreset === 'logic_gates' && (
                  <span>NAND is a Universal Gate. Any Boolean function (AND, OR, NOT, XOR) can be constructed exclusively using 74HC00 NAND gates.</span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
