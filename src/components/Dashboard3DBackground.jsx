import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Dashboard3DBackground({ showParticleText = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── SCENE & CAMERA SETUP ────────────────────────────────────────────────
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 70;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ─── 1. CRISP NON-BLOWOUT GLOW PARTICLE TEXTURE ──────────────────────────
    const makeParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = makeParticleTexture();

    // ─── 2. SPECTRUM RAINBOW "LUMIXORA" HOLOGRAPHIC TYPOGRAPHY (OPTIONAL) ────
    let textGeo, textMat, textPointsMesh;
    const textPointsData = [];

    if (showParticleText) {
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 800;
      textCanvas.height = 180;
      const textCtx = textCanvas.getContext('2d');
      textCtx.fillStyle = '#000000';
      textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);
      textCtx.font = '900 86px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      textCtx.fillStyle = '#ffffff';
      textCtx.letterSpacing = '6px';
      textCtx.fillText('L U M I X O R A', textCanvas.width / 2, textCanvas.height / 2);

      const imgData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
      const sampleStep = 4;

      for (let y = 0; y < textCanvas.height; y += sampleStep) {
        for (let x = 0; x < textCanvas.width; x += sampleStep) {
          const index = (y * textCanvas.width + x) * 4;
          if (imgData.data[index] > 140) {
            const posX = (x - textCanvas.width / 2) * 0.17;
            const posY = -(y - textCanvas.height / 2) * 0.17;
            const posZ = (Math.random() - 0.5) * 2;
            const t = x / textCanvas.width;
            textPointsData.push({
              origX: posX,
              origY: posY,
              origZ: posZ,
              t: t
            });
          }
        }
      }

      textGeo = new THREE.BufferGeometry();
      const textPos = new Float32Array(textPointsData.length * 3);
      const textColors = new Float32Array(textPointsData.length * 3);

      const spectrumColors = [
        new THREE.Color(0x00f5d4),
        new THREE.Color(0x06b6d4),
        new THREE.Color(0x3b82f6),
        new THREE.Color(0x8b5cf6),
        new THREE.Color(0xd946ef),
        new THREE.Color(0xf43f5e),
        new THREE.Color(0xfb923c),
        new THREE.Color(0x00f5d4)
      ];

      const getSpectrumColor = (t, offset = 0) => {
        const wrapped = (t + offset) % 1;
        const index = wrapped * (spectrumColors.length - 1);
        const i0 = Math.floor(index);
        const i1 = Math.min(i0 + 1, spectrumColors.length - 1);
        const f = index - i0;
        return spectrumColors[i0].clone().lerp(spectrumColors[i1], f);
      };

      for (let i = 0; i < textPointsData.length; i++) {
        const pt = textPointsData[i];
        textPos[i * 3] = pt.origX;
        textPos[i * 3 + 1] = pt.origY;
        textPos[i * 3 + 2] = pt.origZ;

        const c = getSpectrumColor(pt.t, 0);
        textColors[i * 3] = c.r;
        textColors[i * 3 + 1] = c.g;
        textColors[i * 3 + 2] = c.b;
      }

      textGeo.setAttribute('position', new THREE.BufferAttribute(textPos, 3));
      textGeo.setAttribute('color', new THREE.BufferAttribute(textColors, 3));

      textMat = new THREE.PointsMaterial({
        size: 2.2,
        map: particleTexture,
        transparent: true,
        opacity: 0.9,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      textPointsMesh = new THREE.Points(textGeo, textMat);
      scene.add(textPointsMesh);
    }

    // ─── 3. COLORFUL COSMIC NEBULA STARDUST FIELD ────────────────────────────
    const bgParticleCount = 450;
    const bgGeo = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgParticleCount * 3);
    const bgColors = new Float32Array(bgParticleCount * 3);

    const cosmicPalette = [
      new THREE.Color(0x00f5d4), // Teal
      new THREE.Color(0xa855f7), // Purple
      new THREE.Color(0x38bdf8), // Sky Blue
      new THREE.Color(0xf43f5e), // Pink
      new THREE.Color(0xfbbf24)  // Gold
    ];

    for (let i = 0; i < bgParticleCount; i++) {
      bgPositions[i * 3] = (Math.random() - 0.5) * 220;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 180;
      bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 150;

      const c = cosmicPalette[Math.floor(Math.random() * cosmicPalette.length)];
      bgColors[i * 3] = c.r;
      bgColors[i * 3 + 1] = c.g;
      bgColors[i * 3 + 2] = c.b;
    }

    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgGeo.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));

    const bgMat = new THREE.PointsMaterial({
      size: 2.4,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const bgParticles = new THREE.Points(bgGeo, bgMat);
    scene.add(bgParticles);

    // ─── 4. VIBRANT FLOATING 3D WIREFRAME GEMS ───────────────────────────────
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    // 1. Icosahedron (Teal Cyber Crystal)
    const icoGeo = new THREE.IcosahedronGeometry(12, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(-48, 8, -18);
    floatingGroup.add(icoMesh);

    // 2. Torus Knot (Electric Purple Loop)
    const torusGeo = new THREE.TorusKnotGeometry(10, 2.2, 80, 16);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(50, -20, -22);
    floatingGroup.add(torusMesh);

    // 3. Octahedron (Rose Ruby)
    const octaGeo = new THREE.OctahedronGeometry(9, 0);
    const octaMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaMat);
    octaMesh.position.set(28, 30, -30);
    floatingGroup.add(octaMesh);

    // 4. Dodecahedron (Azure Star)
    const dodecaGeo = new THREE.DodecahedronGeometry(9, 0);
    const dodecaMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.38
    });
    const dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
    dodecaMesh.position.set(-34, -28, -18);
    floatingGroup.add(dodecaMesh);

    // ─── 5. MOUSE PARALLAX ───────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ─── 6. ANIMATION LOOP ───────────────────────────────────────────────────
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX * 16 - targetX) * 0.04;
      targetY += (-mouseY * 16 - targetY) * 0.04;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Animate LUMIXORA particle text (if enabled)
      if (showParticleText && textGeo) {
        const posAttr = textGeo.attributes.position;
        const colorAttr = textGeo.attributes.color;
        const colorShift = elapsedTime * 0.15;

        for (let i = 0; i < textPointsData.length; i++) {
          const pt = textPointsData[i];
          const waveY = Math.sin(elapsedTime * 2.0 + pt.origX * 0.1) * 1.2;
          const waveZ = Math.cos(elapsedTime * 1.5 + pt.origX * 0.08) * 1.5;
          posAttr.setXYZ(i, pt.origX, pt.origY + waveY, pt.origZ + waveZ);

          const dynamicColor = getSpectrumColor(pt.t, colorShift);
          colorAttr.setXYZ(i, dynamicColor.r, dynamicColor.g, dynamicColor.b);
        }
        posAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;
      }

      // Rotate cosmic stardust field
      bgParticles.rotation.y = elapsedTime * 0.03;
      bgParticles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08;

      // Animate floating wireframes
      icoMesh.rotation.x += 0.007;
      icoMesh.rotation.y += 0.009;
      icoMesh.position.y = 8 + Math.sin(elapsedTime * 0.8) * 4;

      torusMesh.rotation.x += 0.006;
      torusMesh.rotation.y += 0.008;
      torusMesh.position.y = -20 + Math.cos(elapsedTime * 0.7) * 5;

      octaMesh.rotation.x += 0.01;
      octaMesh.rotation.z += 0.008;
      octaMesh.position.y = 30 + Math.sin(elapsedTime * 1.1) * 3;

      dodecaMesh.rotation.y += 0.008;
      dodecaMesh.rotation.x += 0.006;
      dodecaMesh.position.y = -28 + Math.cos(elapsedTime * 0.9) * 4;

      renderer.render(scene, camera);
    };

    animate();

    // ─── 7. RESIZE HANDLER ───────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // ─── CLEANUP ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (textGeo) textGeo.dispose();
      if (textMat) textMat.dispose();
      bgGeo.dispose();
      bgMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      octaGeo.dispose();
      octaMat.dispose();
      dodecaGeo.dispose();
      dodecaMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
      aria-hidden="true"
    >
      {/* 🎬 4K Cyber High-Tech Looping Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen scale-105 pointer-events-none filter saturate-150"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41544-large.mp4" type="video/mp4" />
      </video>

      {/* 3D WebGL Canvas Layer */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}
