import * as THREE from 'three';

/**
 * 🏛️ Lumina Classroom Environment Builder
 * 
 * Generates photorealistic architectural elements:
 * 1. Warm polished oak parquet flooring (procedural wood grain, staggered planks, varnish specularity)
 * 2. Brass gooseneck lamps mounted above chalkboard with warm downlights
 * 3. Wooden Venetian window blinds & volumetric streaming sunbeam
 */

/**
 * Creates high-resolution procedural polished oak parquet floor texture
 */
export function createPolishedOakParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base warm amber oak tone
  ctx.fillStyle = '#6e3c1b';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankH = 64;  // 16 rows
  const plankW = 256; // 4 columns per row

  // Palette of natural honey, chestnut, and golden oak wood tones
  const oakTones = [
    '#7a4622', '#8c542b', '#6b3a19', '#965e33', '#72401e',
    '#844e26', '#643415', '#9a6338', '#784420', '#885128'
  ];

  let plankIdx = 0;
  for (let y = 0; y < 1024; y += plankH) {
    const row = y / plankH;
    // Stagger every other row by half plank width (running bond pattern)
    const xOffset = (row % 2 === 0) ? 0 : -plankW / 2;

    for (let x = xOffset; x < 1024 + plankW; x += plankW) {
      plankIdx++;
      const tone = oakTones[(plankIdx * 7) % oakTones.length];
      
      // Plank body
      ctx.fillStyle = tone;
      ctx.fillRect(x + 2, y + 2, plankW - 4, plankH - 4);

      // Fine longitudinal wood grain lines within each plank
      ctx.strokeStyle = 'rgba(40, 20, 8, 0.14)';
      ctx.lineWidth = 1;
      for (let g = 8; g < plankH - 6; g += 9) {
        ctx.beginPath();
        const curveOffset = Math.sin((x + g) * 0.05) * 2;
        ctx.moveTo(x + 4, y + g);
        ctx.quadraticCurveTo(x + plankW * 0.5, y + g + curveOffset, x + plankW - 4, y + g);
        ctx.stroke();
      }

      // Subtle light wood fiber streak
      ctx.strokeStyle = 'rgba(255, 230, 190, 0.07)';
      ctx.beginPath();
      ctx.moveTo(x + 10, y + plankH * 0.4);
      ctx.lineTo(x + plankW - 10, y + plankH * 0.42);
      ctx.stroke();

      // Top edge highlight bevel (varnish reflection)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 2, y + 2);
      ctx.lineTo(x + plankW - 2, y + 2);
      ctx.stroke();

      // Dark beveled seam around plank
      ctx.strokeStyle = '#2d1607';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x, y, plankW, plankH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates brass gooseneck lamps mounted above the chalkboard
 * @param {THREE.Scene} scene
 */
export function addChalkboardBrassLamps(scene) {
  const lampGroup = new THREE.Group();
  lampGroup.name = 'ChalkboardBrassLamps';

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.88,
    roughness: 0.22
  });

  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xffe2b0,
    emissiveIntensity: 2.2
  });

  const lampPositions = [-0.8, 2.0];

  lampPositions.forEach((lx) => {
    // 1. Wall / Frame Mount Base
    const mountBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.06, 16),
      brassMat
    );
    mountBase.rotation.x = Math.PI / 2;
    mountBase.position.set(lx, 3.42, -3.38);
    lampGroup.add(mountBase);

    // 2. Curved Gooseneck Arm arching forward and down
    const curvePoints = [
      new THREE.Vector3(lx, 3.42, -3.38),
      new THREE.Vector3(lx, 3.65, -3.20),
      new THREE.Vector3(lx, 3.68, -2.95),
      new THREE.Vector3(lx, 3.52, -2.85)
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const armGeo = new THREE.TubeGeometry(curve, 16, 0.016, 10, false);
    const armMesh = new THREE.Mesh(armGeo, brassMat);
    lampGroup.add(armMesh);

    // 3. Flared Brass Conical Shade
    const shadeGeo = new THREE.CylinderGeometry(0.08, 0.22, 0.16, 24, 1, true);
    const shadeMesh = new THREE.Mesh(shadeGeo, brassMat);
    shadeMesh.position.set(lx, 3.44, -2.85);
    shadeMesh.rotation.x = -0.3; // Angle downward toward board
    lampGroup.add(shadeMesh);

    // 4. Glowing Bulb inside shade
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      bulbMat
    );
    bulb.position.set(lx, 3.44, -2.85);
    lampGroup.add(bulb);

    // 5. Warm SpotLight illuminating the board
    const spot = new THREE.SpotLight(0xffedd5, 2.4, 9, Math.PI / 4, 0.48, 1.2);
    spot.position.set(lx, 3.44, -2.85);
    spot.target.position.set(lx, 2.0, -3.45);
    spot.castShadow = true;
    spot.shadow.bias = -0.0005;
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;

    scene.add(spot.target);
    lampGroup.add(spot);
  });

  scene.add(lampGroup);
  return lampGroup;
}

/**
 * Creates Venetian blinds on the tall window and volumetric sunlight beam
 * @param {THREE.Scene} scene
 */
export function addWindowBlindsAndSunlight(scene) {
  const windowGroup = new THREE.Group();
  windowGroup.name = 'WindowBlindsAndSunlight';

  // 1. Horizontal Wooden Louvers / Venetian Blinds
  const blindMat = new THREE.MeshStandardMaterial({
    color: 0x4a2f16,
    roughness: 0.45
  });

  const slatCount = 18;
  const topY = 5.2;
  const bottomY = 1.5;
  const stepY = (topY - bottomY) / slatCount;

  for (let i = 0; i < slatCount; i++) {
    const slat = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.022, 2.45),
      blindMat
    );
    slat.position.set(-7.88, topY - i * stepY, 0);
    slat.rotation.z = 0.25; // Tilted angle letting sunlight stream through
    slat.castShadow = true;
    windowGroup.add(slat);
  }

  // 2. Volumetric Sunlight Shaft (Soft atmospheric light cone streaming into room)
  const sunShaftMat = new THREE.MeshBasicMaterial({
    color: 0xfffae6,
    transparent: true,
    opacity: 0.11,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  // Soft light cylinder angled into the room
  const sunShaftGeo = new THREE.CylinderGeometry(0.8, 3.4, 11, 24, 1, true);
  const sunShaft = new THREE.Mesh(sunShaftGeo, sunShaftMat);
  sunShaft.position.set(-3.5, 3.0, 1.2);
  sunShaft.rotation.z = Math.PI * 0.35; // Angled from window down across room
  sunShaft.rotation.y = -Math.PI * 0.15;
  windowGroup.add(sunShaft);

  scene.add(windowGroup);
  return windowGroup;
}
