import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Demonstration3DViewport({ modelType = 'globe', isExpanded = false, onClose }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 320;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc084fc, 2.5, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 2, 50);
    cyanLight.position.set(-5, -3, 3);
    scene.add(cyanLight);

    const group = new THREE.Group();
    scene.add(group);

    // Build Model Based on Selected Type
    if (modelType === 'globe') {
      // 1. Holographic Earth Globe with latitude/longitude grid & glowing atmosphere
      const sphereGeo = new THREE.SphereGeometry(1.6, 32, 32);
      const sphereMat = new THREE.MeshPhongMaterial({
        color: 0x4c1d95,
        emissive: 0x2e1065,
        wireframe: true,
        transparent: true,
        opacity: 0.75
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Core Solid Glow Sphere
      const innerGeo = new THREE.SphereGeometry(1.4, 24, 24);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x7e22ce,
        transparent: true,
        opacity: 0.35
      });
      group.add(new THREE.Mesh(innerGeo, innerMat));

      // Surrounding Equatorial Ring
      const ringGeo = new THREE.RingGeometry(2.0, 2.2, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.3;
      group.add(ring);

    } else if (modelType === 'paraboloid') {
      // 2. 3D Mathematical Quadric Surface
      const paramGeo = new THREE.ConeGeometry(2, 2.8, 32, 16, true);
      paramGeo.rotateX(Math.PI); // Invert cone to form paraboloid cup shape

      const surfaceMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        wireframe: true,
        emissive: 0x3b0764,
        roughness: 0.2
      });
      const surface = new THREE.Mesh(paramGeo, surfaceMat);
      group.add(surface);

    } else if (modelType === 'dna') {
      // 3. Rotating 3D DNA Double Helix
      const strandPoints1 = [];
      const strandPoints2 = [];
      const numBasePairs = 24;

      for (let i = 0; i < numBasePairs; i++) {
        const t = (i / numBasePairs) * Math.PI * 4;
        const y = (i - numBasePairs / 2) * 0.15;
        const x1 = Math.cos(t) * 1.1;
        const z1 = Math.sin(t) * 1.1;
        const x2 = Math.cos(t + Math.PI) * 1.1;
        const z2 = Math.sin(t + Math.PI) * 1.1;

        strandPoints1.push(new THREE.Vector3(x1, y, z1));
        strandPoints2.push(new THREE.Vector3(x2, y, z2));

        // Base pair connecting rung
        const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8);
        const rungMat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0x38bdf8 : 0xc084fc,
          emissive: 0x1e1b4b
        });
        const rung = new THREE.Mesh(rungGeo, rungMat);
        rung.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
        rung.lookAt(new THREE.Vector3(x1, y, z1));
        rung.rotateX(Math.PI / 2);
        group.add(rung);
      }

      const curve1 = new THREE.CatmullRomCurve3(strandPoints1);
      const tubeGeo1 = new THREE.TubeGeometry(curve1, 64, 0.08, 8, false);
      const tubeMat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x075985 });
      group.add(new THREE.Mesh(tubeGeo1, tubeMat1));

      const curve2 = new THREE.CatmullRomCurve3(strandPoints2);
      const tubeGeo2 = new THREE.TubeGeometry(curve2, 64, 0.08, 8, false);
      const tubeMat2 = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x581c87 });
      group.add(new THREE.Mesh(tubeGeo2, tubeMat2));

    } else {
      // 4. Default Physics Gyroscope / Orbital Vector
      const torusGeo = new THREE.TorusGeometry(1.4, 0.06, 16, 64);
      const torusMat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7 });
      const torus1 = new THREE.Mesh(torusGeo, torusMat1);
      group.add(torus1);

      const torus2 = new THREE.Mesh(torusGeo, new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x7c3aed }));
      torus2.rotation.x = Math.PI / 2;
      group.add(torus2);

      const nucleusGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xa855f7 });
      group.add(new THREE.Mesh(nucleusGeo, nucleusMat));
    }

    // Mouse Interaction: Drag to rotate
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
      group.rotation.y += deltaX * 0.01;
      group.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        group.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (mount.contains(domElement)) {
        mount.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [modelType]);

  return (
    <div className={`relative rounded-3xl bg-[#0f0a24]/90 border border-purple-500/40 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.35)] overflow-hidden transition-all duration-300 ${
      isExpanded ? 'w-80 h-80 sm:w-96 sm:h-96' : 'w-48 h-48 sm:w-56 sm:h-56'
    }`}>
      {/* 3D Model Header */}
      <div className="absolute top-2.5 left-3 right-3 z-10 flex items-center justify-between text-[11px] font-bold text-purple-300 select-none">
        <span className="flex items-center gap-1.5 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          {modelType === 'globe' ? 'Holographic Globe' : modelType === 'paraboloid' ? '3D Math Quadric' : modelType === 'dna' ? 'DNA Molecular' : 'Physics Orbit'}
        </span>
        {onClose && (
          <button 
            onClick={onClose}
            className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center" />

      {/* Sub-label */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-gray-400 pointer-events-none select-none">
        Drag to rotate 3D model
      </div>
    </div>
  );
}
