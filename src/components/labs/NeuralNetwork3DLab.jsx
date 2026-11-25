import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Brain, Play, Pause, RotateCcw, Activity, Layers, 
  Sparkles, Sliders, CheckCircle2, Info, Maximize2, 
  Minimize2, Zap, Target, RefreshCw
} from 'lucide-react';

export default function NeuralNetwork3DLab() {
  const mountRef = useRef(null);
  const decisionCanvasRef = useRef(null);

  // Lab Configuration States
  const [dataset, setDataset] = useState('spiral'); // 'spiral' | 'circles' | 'xor' | 'moons'
  const [activation, setActivation] = useState('relu'); // 'relu' | 'gelu' | 'tanh' | 'sigmoid'
  const [learningRate, setLearningRate] = useState(0.03);
  const [hiddenLayers, setHiddenLayers] = useState([6, 6, 4]); // Neurons per hidden layer
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0.693);
  const [accuracy, setAccuracy] = useState(52.4);
  const [isTraining, setIsTraining] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pulseActive, setPulseActive] = useState(true);

  // ─── 3D NEURAL NETWORK VISUALIZER SETUP ───
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b16);
    scene.fog = new THREE.FogExp2(0x070b16, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const light1 = new THREE.PointLight(0xa855f7, 2.5, 60);
    light1.position.set(-15, 10, 20);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x06b6d4, 2.5, 60);
    light2.position.set(15, -10, 20);
    scene.add(light2);

    // Construct Architecture Graph: Input(2) -> Hidden[L1, L2, L3] -> Output(2)
    const layerSizes = [2, ...hiddenLayers, 2];
    const nodeMeshes = [];
    const connectionLines = [];
    const networkGroup = new THREE.Group();

    const layerSpacing = 32 / (layerSizes.length - 1);
    const startX = -16;

    // Node geometries & materials
    const sphereGeo = new THREE.SphereGeometry(0.7, 24, 24);
    
    // Create layer nodes
    layerSizes.forEach((count, lIdx) => {
      const x = startX + lIdx * layerSpacing;
      const layerNodes = [];
      const vSpacing = Math.min(3.2, 18 / count);
      const startY = ((count - 1) * vSpacing) / 2;

      for (let nIdx = 0; nIdx < count; nIdx++) {
        const y = startY - nIdx * vSpacing;
        const z = (Math.random() - 0.5) * 1.5;

        let nodeColor = 0x38bdf8; // Input (Cyan)
        if (lIdx === layerSizes.length - 1) nodeColor = 0x10b981; // Output (Emerald)
        else if (lIdx > 0) nodeColor = 0xa855f7; // Hidden (Purple)

        const mat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.35,
          roughness: 0.2,
          metalness: 0.8
        });

        const mesh = new THREE.Mesh(sphereGeo, mat);
        mesh.position.set(x, y, z);
        networkGroup.add(mesh);
        layerNodes.push({ mesh, x, y, z, layer: lIdx, index: nIdx });
      }
      nodeMeshes.push(layerNodes);
    });

    // Create Synaptic Connections with weighted lines
    for (let l = 0; l < nodeMeshes.length - 1; l++) {
      const currentLayer = nodeMeshes[l];
      const nextLayer = nodeMeshes[l + 1];

      currentLayer.forEach(fromNode => {
        nextLayer.forEach(toNode => {
          const weight = (Math.random() * 2 - 1);
          const color = weight > 0 ? 0x06b6d4 : 0xf43f5e;

          const points = [
            new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z),
            new THREE.Vector3(toNode.x, toNode.y, toNode.z)
          ];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const lineMat = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: Math.min(0.65, Math.abs(weight) * 0.7 + 0.1),
            linewidth: 1
          });

          const line = new THREE.Line(lineGeo, lineMat);
          networkGroup.add(line);
          connectionLines.push({ line, lineMat, weight });
        });
      });
    }

    scene.add(networkGroup);

    // Subtle Grid Base Plane
    const grid = new THREE.GridHelper(40, 20, 0x1e293b, 0x0f172a);
    grid.position.y = -10;
    scene.add(grid);

    // Interactive Drag to Rotate Network
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      networkGroup.rotation.y += deltaX * 0.006;
      networkGroup.rotation.x += deltaY * 0.006;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.02;

      // Gentle auto oscillation
      if (!isDragging) {
        networkGroup.rotation.y += 0.0015;
      }

      // Synapse Pulse Effect (Signals propagating through layers)
      if (pulseActive) {
        connectionLines.forEach((conn, idx) => {
          const pulse = Math.sin(time * 3 + idx * 0.15);
          conn.lineMat.opacity = Math.max(0.1, (pulse * 0.5 + 0.5) * Math.abs(conn.weight) * 0.6 + 0.1);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [hiddenLayers, pulseActive]);

  // ─── 2D DECISION BOUNDARY CANVAS ───
  useEffect(() => {
    const canvas = decisionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Draw background boundary simulation
    const imgData = ctx.createImageData(width, height);
    for (let x = 0; x < width; x += 4) {
      for (let y = 0; y < height; y += 4) {
        const nx = (x / width - 0.5) * 4;
        const ny = (y / height - 0.5) * 4;

        // Mathematical synthetic boundary simulation based on dataset & epoch progress
        let val = 0;
        const prog = Math.min(1.0, epoch / 150);

        if (dataset === 'spiral') {
          const r = Math.sqrt(nx * nx + ny * ny);
          const theta = Math.atan2(ny, nx);
          val = Math.sin(r * 2.5 - theta * 2 + prog * 1.5);
        } else if (dataset === 'circles') {
          const r = Math.sqrt(nx * nx + ny * ny);
          val = r - (1.2 - prog * 0.2);
        } else if (dataset === 'xor') {
          val = nx * ny;
        } else {
          // Moons
          val = ny - Math.sin(nx * 1.5) * (0.8 + prog * 0.2);
        }

        const isClassA = val > 0;
        const rC = isClassA ? 6 : 168;
        const gC = isClassA ? 182 : 85;
        const bC = isClassA ? 212 : 247;
        const alpha = Math.min(160, Math.floor(Math.abs(val) * 70 + 40));

        for (let dx = 0; dx < 4; dx++) {
          for (let dy = 0; dy < 4; dy++) {
            if (x + dx < width && y + dy < height) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              imgData.data[idx] = rC;
              imgData.data[idx + 1] = gC;
              imgData.data[idx + 2] = bC;
              imgData.data[idx + 3] = alpha;
            }
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Draw Synthetic Sample Scatter Points
    const numPoints = 60;
    for (let i = 0; i < numPoints; i++) {
      let px = 0, py = 0, cls = 0;

      if (dataset === 'circles') {
        const r = i < 30 ? Math.random() * 0.7 : 1.3 + Math.random() * 0.6;
        const t = Math.random() * Math.PI * 2;
        px = (width / 2) + Math.cos(t) * r * 50;
        py = (height / 2) + Math.sin(t) * r * 50;
        cls = i < 30 ? 0 : 1;
      } else {
        const t = (i / numPoints) * Math.PI * 3;
        const r = (i / numPoints) * 1.8;
        cls = i % 2;
        const sign = cls === 0 ? 1 : -1;
        px = (width / 2) + Math.cos(t) * (r * 40) * sign;
        py = (height / 2) + Math.sin(t) * (r * 40) * sign;
      }

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = cls === 0 ? '#38bdf8' : '#a855f7';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }
  }, [dataset, epoch]);

  // ─── TRAINING LOOP SIMULATION ───
  useEffect(() => {
    let timer;
    if (isTraining) {
      timer = setInterval(() => {
        setEpoch(prev => {
          const next = prev + 1;
          // Decreasing Loss & Increasing Accuracy curve
          setLoss(l => Math.max(0.042, +(l * 0.985 - 0.001).toFixed(4)));
          setAccuracy(a => Math.min(99.4, +(a + (100 - a) * 0.035).toFixed(1)));
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isTraining]);

  const handleReset = () => {
    setIsTraining(false);
    setEpoch(0);
    setLoss(0.693);
    setAccuracy(52.4);
  };

  return (
    <div className={`space-y-6 animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-[#070b16] p-6 overflow-y-auto' : ''}`}>
      
      {/* Lab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0b1120] border border-purple-500/30 shadow-xl shadow-purple-500/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/10">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-sora">
                3D Deep Neural Network & Decision Surface Lab
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                AIDS • AIML
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Multi-Layer Perceptron (MLP) forward activations, synaptic weights, and 2D classification boundaries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsTraining(!isTraining)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isTraining 
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-purple-500/20'
            }`}
          >
            {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isTraining ? 'Pause Backprop' : 'Train Model'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset Model Weights & Epochs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-mono transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Network Viewer + Decision Boundary Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 3D Architecture Canvas */}
        <div className="lg:col-span-2 rounded-2xl bg-[#090d1a] border border-white/10 overflow-hidden relative flex flex-col min-h-[480px]">
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-gray-300 backdrop-blur-md">
              Architecture: <strong className="text-purple-400">[2, {hiddenLayers.join(', ')}, 2]</strong>
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-gray-300 backdrop-blur-md">
              Loss: <strong className="text-pink-400">{loss}</strong>
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-gray-300 backdrop-blur-md">
              Accuracy: <strong className="text-emerald-400">{accuracy}%</strong>
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-gray-300 backdrop-blur-md">
              Epoch: <strong className="text-cyan-400">{epoch}</strong>
            </span>
          </div>

          <div className="absolute bottom-4 left-4 z-10 text-[10px] text-gray-400 font-mono bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
            Click & drag to rotate 3D network • Cyan: Positive weights • Rose: Negative weights
          </div>

          <div ref={mountRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing" />
        </div>

        {/* Right 1 Col: 2D Decision Boundary & Hyperparameters */}
        <div className="space-y-4">
          
          {/* Decision Boundary Surface Card */}
          <div className="p-4 rounded-2xl bg-[#090d1a] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-sora flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>2D Classification Boundary</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                {dataset} dataset
              </span>
            </div>

            <div className="flex justify-center p-2 rounded-xl bg-black/40 border border-white/10">
              <canvas
                ref={decisionCanvasRef}
                width={240}
                height={200}
                className="rounded-lg shadow-inner"
              />
            </div>
          </div>

          {/* Hyperparameters Controls */}
          <div className="p-4 rounded-2xl bg-[#090d1a] border border-white/10 space-y-3.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-gray-300 font-sora">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Hyperparameter Tuning</span>
            </div>

            {/* Dataset Picker */}
            <div>
              <label className="block text-gray-400 font-mono mb-1 text-[11px]">Dataset Distribution:</label>
              <div className="grid grid-cols-2 gap-1.5 font-mono">
                {['spiral', 'circles', 'xor', 'moons'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => { setDataset(d); handleReset(); }}
                    className={`py-1.5 px-2 rounded-lg text-center uppercase text-[10px] font-bold transition-all cursor-pointer ${
                      dataset === d 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Activation Function */}
            <div>
              <label className="block text-gray-400 font-mono mb-1 text-[11px]">Activation Function:</label>
              <select
                value={activation}
                onChange={(e) => setActivation(e.target.value)}
                className="w-full p-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono focus:outline-none focus:border-purple-400 text-xs"
              >
                <option value="relu">ReLU (Rectified Linear Unit)</option>
                <option value="gelu">GELU (Gaussian Error Linear)</option>
                <option value="tanh">Tanh (Hyperbolic Tangent)</option>
                <option value="sigmoid">Sigmoid (Logistic Curve)</option>
              </select>
            </div>

            {/* Learning Rate Slider */}
            <div>
              <div className="flex justify-between font-mono text-[11px] mb-1">
                <span className="text-gray-400">Learning Rate (α):</span>
                <span className="text-purple-400 font-bold">{learningRate}</span>
              </div>
              <input
                type="range"
                min={0.001}
                max={0.1}
                step={0.005}
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Toggle Synaptic Pulse */}
            <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
              <span className="text-gray-400">Synaptic Signal Pulse:</span>
              <button
                type="button"
                onClick={() => setPulseActive(!pulseActive)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer ${
                  pulseActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/10 text-gray-400'
                }`}
              >
                {pulseActive ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Pedagogical Concept Card */}
      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-purple-200 text-xs leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-purple-400 mt-0.5" />
        <div>
          <span className="font-bold text-purple-300">Deep Learning Concept: </span>
          <span>
            Universal Approximation Theorem guarantees that a feed-forward network with non-linear activation functions can approximate any continuous decision boundary. Backpropagation computes the gradients of loss with respect to all layer weights via the Chain Rule (∂L/∂W = δ · a^T), progressively warping the 2D classification manifold to separate non-linear distributions.
          </span>
        </div>
      </div>

    </div>
  );
}
