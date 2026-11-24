import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { 
  Video, Mic, Monitor, Sparkles, 
  RotateCcw, BookOpen, Hand, Zap,
  Send, X, Edit3, Sliders, Trash2
} from 'lucide-react';
import { luminaAudio } from '../../services/luminaAudioEngine';
import { analyzeDoubt, CURATED_KNOWLEDGE_BASE } from './LuminaKnowledgeEngine';
import { renderChalkboardToCanvas } from './LuminaChalkboardEngine';
import LuminaInteractiveSliders from './LuminaInteractiveSliders';
import { 
  createPolishedOakParquetTexture, 
  addChalkboardBrassLamps, 
  addWindowBlindsAndSunlight 
} from './LuminaClassroomEnvironment';

export default function LuminaReal3DScene({
  onStatusChange,
  studentName = 'Scholar'
}) {
  const mountRef = useRef(null);

  // 3D Scene Refs
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const activeActionRef = useRef(null);
  const characterRef = useRef(null);
  const skinnedMeshRef = useRef(null);
  const chalkboardMeshRef = useRef(null);
  const chalkboardCanvasRef = useRef(null);
  const chalkboardTextureRef = useRef(null);
  const bonesRef = useRef({});

  // Pedagogical State & Lecture Plan
  const [lecturePlan, setLecturePlan] = useState(() => analyzeDoubt('quadratic'));
  const lecturePlanRef = useRef(lecturePlan);
  lecturePlanRef.current = lecturePlan;

  const [progressiveStage, setProgressiveStage] = useState(5);
  const progressiveStageRef = useRef(progressiveStage);
  progressiveStageRef.current = progressiveStage;

  // Student Freehand Chalk & Eraser State
  const [studentMode, setStudentMode] = useState('view'); // 'view' | 'chalk' | 'eraser'
  const studentModeRef = useRef(studentMode);
  studentModeRef.current = studentMode;

  const [chalkColor, setChalkColor] = useState('#ffffff');
  const chalkColorRef = useRef(chalkColor);
  chalkColorRef.current = chalkColor;

  const [studentStrokes, setStudentStrokes] = useState([]);
  const studentStrokesRef = useRef(studentStrokes);
  studentStrokesRef.current = studentStrokes;
  const currentStrokeRef = useRef(null);

  // Parametric Parabola Sliders State (a, b, c)
  const [sliderParams, setSliderParams] = useState({ a: 1.0, b: -2.0, c: -3.0 });
  const sliderParamsRef = useRef(sliderParams);
  sliderParamsRef.current = sliderParams;
  const [showSliders, setShowSliders] = useState(false);

  // Character & Interaction State
  const [activeActionName, setActiveActionName] = useState('idle'); // 'idle' | 'walk' | 'point' | 'teach' | 'dance' | 'write'
  const [showDoubtDrawer, setShowDoubtDrawer] = useState(false);
  const [doubtQuery, setDoubtQuery] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isAnalyzingRef = useRef(false);
  isAnalyzingRef.current = isAnalyzing;

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Loading Lumina 3D Classroom...');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(isSpeaking);
  isSpeakingRef.current = isSpeaking;

  const [spokenText, setSpokenText] = useState(
    () => `Welcome ${studentName}! I'm Lumina, your personal mentor. Feel free to ask any doubt or explore the curve sliders!`
  );
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);
  const [danceCount, setDanceCount] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  isListeningRef.current = isListening;

  const recognitionRef = useRef(null);
  const hasSpokenWelcomeRef = useRef(false);

  // Real-time Audio Spectrum Frequencies for UI visualizer
  const [frequencyData, setFrequencyData] = useState(() => new Array(20).fill(0.04));

  // Synchronized refs for 60fps render loop
  const activeActionNameRef = useRef(activeActionName);
  activeActionNameRef.current = activeActionName;

  // ─── 1. CHALKBOARD UPDATE DISPATCHER ───
  const updateChalkboard = useCallback((stage = 5, plan = null, strokes = null, sliders = null) => {
    const currentPlan = plan || lecturePlanRef.current || analyzeDoubt('quadratic');
    const currentStrokes = strokes !== null ? strokes : studentStrokesRef.current;
    const currentSliders = sliders || sliderParamsRef.current;

    const canvas = chalkboardCanvasRef.current || document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 600;
    chalkboardCanvasRef.current = canvas;

    renderChalkboardToCanvas(canvas, currentPlan, stage, currentStrokes, currentSliders);

    if (chalkboardTextureRef.current) {
      chalkboardTextureRef.current.needsUpdate = true;
    }
  }, []);

  // ─── AUDIBLE SPEECH SYNTHESIS ENGINE (WITH BARGE-IN SUPPORT) ───
  const speakAloud = useCallback((text) => {
    setSpokenText(text);
    luminaAudio.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  }, []);

  // ─── 2. PROGRESSIVE STROKE-BY-STROKE DOUBT SOLVER (CHATGPT-STYLE AI MENTOR) ───
  const handleExplainDoubt = useCallback((queryText) => {
    if (!queryText || !queryText.trim()) return;

    // Voice Barge-in: Stop any active speech immediately
    luminaAudio.bargeIn();
    setIsSpeaking(false);
    setShowDoubtDrawer(false);

    // Step 1: ChatGPT-style analysis phase with head tilt
    setIsAnalyzing(true);
    setSpokenText(`Analyzing your question: "${queryText}"... Synthesizing pedagogical proof.`);

    setTimeout(() => {
      const plan = analyzeDoubt(queryText);
      lecturePlanRef.current = plan;
      setLecturePlan(plan);
      setIsAnalyzing(false);

      // Step 2: Turn to board and begin writing with chalk
      setIsWriting(true);
      setActiveActionName('write');

      // Stage 1: Title & Subject (at 0.3s)
      setProgressiveStage(1);
      updateChalkboard(1, plan);
      luminaAudio.playChalkSound(0.5);

      // Stage 2: Primary formula (at 0.9s)
      setTimeout(() => {
        setProgressiveStage(2);
        updateChalkboard(2, plan);
        luminaAudio.playChalkSound(0.6);
      }, 900);

      // Stage 3: Step-by-step derivation lines (at 1.7s)
      setTimeout(() => {
        setProgressiveStage(3);
        updateChalkboard(3, plan);
        luminaAudio.playChalkSound(0.7);
      }, 1700);

      // Stage 4: Boxed conclusion (at 2.5s)
      setTimeout(() => {
        setProgressiveStage(4);
        updateChalkboard(4, plan);
        luminaAudio.playChalkSound(0.6);
      }, 2500);

      // Stage 5: Diagram / curve traces (at 3.2s)
      setTimeout(() => {
        setProgressiveStage(5);
        updateChalkboard(5, plan);
        luminaAudio.playChalkSound(0.5);
      }, 3200);

      // Step 3: Finished writing -> attention chime -> turn to student & point -> speak full explanation!
      setTimeout(() => {
        setIsWriting(false);
        luminaAudio.playAttentionChime();
        setActiveActionName('point');
        speakAloud(plan.spokenExplanation);
      }, 4000);

    }, 600);
  }, [updateChalkboard, speakAloud]);

  // ─── 3. PARAMETRIC SLIDER CHANGE HANDLER (DYNAMIC PARABOLA & DISCRIMINANT) ───
  const handleSliderChange = useCallback((newParams) => {
    setSliderParams(newParams);
    sliderParamsRef.current = newParams;
    updateChalkboard(5, lecturePlanRef.current, studentStrokesRef.current, newParams);

    // Cause Lumina to point to the shifting curve on the chalkboard
    if (activeActionNameRef.current !== 'point' && activeActionNameRef.current !== 'write') {
      setActiveActionName('point');
    }
  }, [updateChalkboard]);

  // ─── 4. INITIALIZE 3D SCENE & RIGGED CHARACTER ───
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // A. Three.js Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x181424);

    // Camera positioned at natural eye level matching reference view (medium close-up, waist up)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(-0.25, 1.35, 2.75);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // B. Smooth OrbitControls (360° inspection)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.01;
    controls.minDistance = 1.2;
    controls.maxDistance = 9;
    controls.target.set(-0.18, 1.25, 0);
    controlsRef.current = controls;

    // C. Natural Daylight & Architectural Lighting
    const hemiLight = new THREE.HemisphereLight(0xfff8f0, 0x4a3422, 1.35);
    scene.add(hemiLight);

    // Sunlight streaming from left windows
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.6);
    sunLight.position.set(-6, 7.5, 3);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 6;
    sunLight.shadow.camera.bottom = -6;
    scene.add(sunLight);

    // Warm Architectural Chalkboard Spotlights
    const boardSpot = new THREE.SpotLight(0xffedd5, 2.8, 16, Math.PI / 3, 0.4);
    boardSpot.position.set(0.5, 4.2, 1.5);
    boardSpot.target.position.set(0.5, 2.0, -3.2);
    scene.add(boardSpot);
    scene.add(boardSpot.target);

    // Soft Front Fill Light on Mentor (flattering warm portrait light)
    const mentorFill = new THREE.DirectionalLight(0xfff7ed, 1.8);
    mentorFill.position.set(-0.2, 2.2, 2.6);
    scene.add(mentorFill);

    const mentorWarmRim = new THREE.PointLight(0xfdf2f8, 1.2, 6, 1.5);
    mentorWarmRim.position.set(-0.8, 1.8, 1.5);
    scene.add(mentorWarmRim);

    // ── D. BUILD REALISTIC CLASSROOM ENVIRONMENT ──
    // 1. Warm Polished Oak Parquet Floor
    const oakFloorTex = createPolishedOakParquetTexture();
    const floorGeo = new THREE.PlaneGeometry(16, 14);
    const floorMat = new THREE.MeshStandardMaterial({
      map: oakFloorTex,
      roughness: 0.28,
      metalness: 0.06
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.0;
    floor.receiveShadow = true;
    scene.add(floor);

    // 2. Classroom Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe0dcce, roughness: 0.85 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 7), wallMat);
    backWall.position.set(0, 3.5, -3.5);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), wallMat);
    leftWall.position.set(-8, 3.5, 3.5);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // 3. Tall Window Panes on Left Wall with Venetian Blinds & Sunlight
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x3d2714, roughness: 0.5 });
    const win1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.2, 2.6), windowFrameMat);
    win1.position.set(-7.95, 3.4, 0);
    scene.add(win1);

    const winGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 4.0),
      new THREE.MeshStandardMaterial({ color: 0xc8e6c9, roughness: 0.1, transparent: true, opacity: 0.35 })
    );
    winGlass.position.set(-7.9, 3.4, 0);
    winGlass.rotation.y = Math.PI / 2;
    scene.add(winGlass);

    // Add wooden Venetian blinds and volumetric light stream
    addWindowBlindsAndSunlight(scene);

    // 4. Large Dark-Green Classroom Chalkboard
    updateChalkboard(5);
    const boardTexture = new THREE.CanvasTexture(chalkboardCanvasRef.current);
    boardTexture.colorSpace = THREE.SRGBColorSpace;
    chalkboardTextureRef.current = boardTexture;

    const boardGeo = new THREE.PlaneGeometry(5.6, 2.6);
    const boardMat = new THREE.MeshStandardMaterial({
      map: boardTexture,
      roughness: 0.65,
      metalness: 0.05
    });
    const chalkboard = new THREE.Mesh(boardGeo, boardMat);
    chalkboard.position.set(0.6, 2.0, -3.45);
    chalkboard.receiveShadow = true;
    chalkboardMeshRef.current = chalkboard;
    scene.add(chalkboard);

    // Wooden Frame around Chalkboard
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a2c11, roughness: 0.4 });
    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.12, 0.1), frameMat);
    topFrame.position.set(0.6, 3.34, -3.42);
    scene.add(topFrame);

    const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.16, 0.28), frameMat);
    bottomFrame.position.set(0.6, 0.66, -3.35);
    scene.add(bottomFrame);

    // Add Warm Brass Gooseneck Lamps above Chalkboard
    addChalkboardBrassLamps(scene);

    // Chalk and felt eraser on ledge
    const eraser = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.08), new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.9 }));
    eraser.position.set(1.4, 0.76, -3.3);
    scene.add(eraser);

    // 5. Wooden Teacher Desk on the Left
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x5a3717, roughness: 0.4 });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.2), deskMat);
    deskTop.position.set(-3.2, 0.9, -1.4);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    scene.add(deskTop);

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 16);
    [
      [-4.2, 0.45, -1.9],
      [-2.2, 0.45, -1.9],
      [-4.2, 0.45, -0.9],
      [-2.2, 0.45, -0.9]
    ].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, deskMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      scene.add(leg);
    });

    // Laptop on Teacher Desk
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.3), new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8, roughness: 0.2 }));
    laptopBase.position.set(-3.2, 0.95, -1.4);
    laptopBase.castShadow = true;
    scene.add(laptopBase);

    // Globe on Teacher Desk
    const globeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const globeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), globeMat);
    globeMesh.position.set(-4.0, 1.15, -1.3);
    globeMesh.castShadow = true;
    scene.add(globeMesh);

    const globeStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.08, 0.22, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 }));
    globeStand.position.set(-4.0, 1.0, -1.3);
    scene.add(globeStand);

    // Potted Green Plant on Desk
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }));
    pot.position.set(-2.4, 1.02, -1.3);
    scene.add(pot);
    const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 }));
    plant.position.set(-2.4, 1.2, -1.3);
    scene.add(plant);

    // 6. Bookshelf on Left Wall with Books
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x482b13, roughness: 0.45 });
    const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 1.8), shelfMat);
    shelfBack.position.set(-7.5, 1.7, -1.4);
    shelfBack.castShadow = true;
    scene.add(shelfBack);

    const bookColors = [0x991b1b, 0x1e3a8a, 0x166534, 0x854d0e, 0x581c87];
    for (let i = 0; i < 9; i++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.26, 0.06),
        new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length], roughness: 0.7 })
      );
      book.position.set(-7.35, 1.45, -1.8 + i * 0.09);
      book.castShadow = true;
      scene.add(book);
    }

    // ── E. LOAD RIGGED HUMAN MODEL & ATTACH BONES ──
    setLoadingStatus('Loading Rigged Human Model & Armature...');
    setLoadingProgress(25);
    window.__luminaScene = scene;

    MeshoptDecoder.ready.then(() => {
      console.log('MeshoptDecoder is ready, loading LuminaFemale.glb...');
      const gltfLoader = new GLTFLoader();
      gltfLoader.setMeshoptDecoder(MeshoptDecoder);

      const textureLoader = new THREE.TextureLoader();
      const styledBodyTex = textureLoader.load('/models/lumina_body_styled.png?v=8');
      styledBodyTex.flipY = false;
      styledBodyTex.colorSpace = THREE.SRGBColorSpace;

      const styledHeadTex = textureLoader.load('/models/lumina_head_styled.png?v=8');
      styledHeadTex.flipY = false;
      styledHeadTex.colorSpace = THREE.SRGBColorSpace;

      gltfLoader.load(
        '/models/LuminaFemale.glb',
        (gltfCharacter) => {
          console.log('LuminaFemale.glb loaded successfully into scene!', gltfCharacter);
          const model = gltfCharacter.scene;
          characterRef.current = model;
          window.__luminaCharacter = model;

          // Position model standing center-stage facing the seated student
          model.position.set(-0.35, 0, 0);
          model.rotation.set(0, 0.15, 0); // Natural slight angle toward desk and board
          model.scale.set(1.0, 1.0, 1.0);

          // Store bones map for IK / arm relaxation
          model.traverse((child) => {
            if (child.isBone) {
              bonesRef.current[child.name] = child;
            }
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              skinnedMeshRef.current = child;

              // Tailored submesh materials matching reference outfit
              if (child.name === 'mesh_0_7') {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xc4b299,
                  roughness: 0.72,
                  metalness: 0.02
                });
                child.material.needsUpdate = true;
              } else if (child.name === 'mesh_0_4') {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x181412,
                  roughness: 0.35,
                  metalness: 0.15
                });
                child.material.needsUpdate = true;
              } else if (child.name === 'mesh_0_2') {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x141210,
                  roughness: 0.3
                });
                child.material.needsUpdate = true;
              } else if (child.name === 'mesh_0') {
                child.material = new THREE.MeshStandardMaterial({
                  map: styledBodyTex,
                  roughness: 0.65,
                  metalness: 0.05
                });
                child.material.needsUpdate = true;
              } else if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  if (mat.name === 'f020_body') {
                    mat.map = styledBodyTex;
                    mat.roughness = 0.68;
                    mat.needsUpdate = true;
                  } else if (mat.name === 'f020_head') {
                    mat.map = styledHeadTex;
                    mat.roughness = 0.55;
                    mat.needsUpdate = true;
                  }
                });
              } else if (child.material) {
                if (child.material.name === 'f020_body') {
                  child.material.map = styledBodyTex;
                  child.material.roughness = 0.68;
                  child.material.needsUpdate = true;
                } else if (child.material.name === 'f020_head') {
                  child.material.map = styledHeadTex;
                  child.material.roughness = 0.55;
                  child.material.needsUpdate = true;
                }
              }
            }
          });

          // Attach Chalk piece to Right Hand
          const rightHandBone = bonesRef.current['Bip01_R_Hand'] || bonesRef.current['RightHand'];
          if (rightHandBone && !rightHandBone.getObjectByName('LuminaChalk')) {
            const chalkGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.05, 10);
            const chalkMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
            const chalkMesh = new THREE.Mesh(chalkGeo, chalkMat);
            chalkMesh.name = 'LuminaChalk';
            chalkMesh.position.set(0.03, 0.02, 0);
            chalkMesh.rotation.z = Math.PI / 2;
            rightHandBone.add(chalkMesh);
          }

          // Attach Lumina Long Wavy Dark-Brown Hair
          const headBone = bonesRef.current['Head'];
          if (headBone && !headBone.getObjectByName('LuminaLongWavyHair')) {
            const hairGroup = new THREE.Group();
            hairGroup.name = 'LuminaLongWavyHair';

            const hairMat = new THREE.MeshStandardMaterial({
              color: 0x180d06,
              roughness: 0.38,
              metalness: 0.12,
              side: THREE.DoubleSide
            });

            // Scalp volume
            const crownGeo = new THREE.SphereGeometry(8.6, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.62);
            const crownMesh = new THREE.Mesh(crownGeo, hairMat);
            crownMesh.position.set(11.2, -0.6, 0);
            crownMesh.rotation.z = -Math.PI / 2;
            crownMesh.scale.set(1.06, 1.02, 0.96);
            hairGroup.add(crownMesh);

            const makeWavyLock = (points, radius = 0.9) => {
              const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
              const geo = new THREE.TubeGeometry(curve, 22, radius, 8, false);
              return new THREE.Mesh(geo, hairMat);
            };

            // Left cascading wavy locks
            hairGroup.add(makeWavyLock([[13.0, 1.0, 6.8], [9.0, 3.8, 8.0], [4.0, 5.8, 7.5], [-2.5, 7.0, 6.5], [-9.5, 7.5, 5.5], [-16.5, 6.8, 4.5]], 1.15));
            hairGroup.add(makeWavyLock([[12.5, -1.0, 7.6], [8.0, 2.0, 8.5], [2.0, 4.5, 8.2], [-4.5, 6.5, 7.2], [-12.0, 7.0, 6.0], [-18.0, 6.2, 5.0]], 1.1));
            // Right cascading wavy locks
            hairGroup.add(makeWavyLock([[13.0, 1.0, -6.8], [9.0, 3.8, -8.0], [4.0, 5.8, -7.5], [-2.5, 7.0, -6.5], [-9.5, 7.5, -5.5], [-16.5, 6.8, -4.5]], 1.15));
            hairGroup.add(makeWavyLock([[12.5, -1.0, -7.6], [8.0, 2.0, -8.5], [2.0, 4.5, -8.2], [-4.5, 6.5, -7.2], [-12.0, 7.0, -6.0], [-18.0, 6.2, -5.0]], 1.1));
            // Back hair
            hairGroup.add(makeWavyLock([[12.0, -5.5, 2.5], [6.0, -8.2, 3.5], [-2.0, -8.8, 3.2], [-11.0, -8.2, 2.8], [-18.0, -7.5, 2.0]], 1.4));
            hairGroup.add(makeWavyLock([[12.0, -5.5, -2.5], [6.0, -8.2, -3.5], [-2.0, -8.8, -3.2], [-11.0, -8.2, -2.8], [-18.0, -7.5, -2.0]], 1.4));
            // Front framing locks
            hairGroup.add(makeWavyLock([[14.2, 4.5, 0.5], [12.8, 6.8, 3.0], [10.5, 6.2, 5.5]], 0.8));
            hairGroup.add(makeWavyLock([[14.2, 4.5, -0.5], [12.8, 6.8, -3.0], [10.5, 6.2, -5.5]], 0.8));

            headBone.add(hairGroup);
          }

          scene.add(model);
          setIsLoading(false);
          setLoadingStatus('Ready');
          if (onStatusChange) onStatusChange('ready');

          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          // Load retargeted animations
          const animFiles = [
            { key: 'idle', url: '/models/anim_idle.glb' },
            { key: 'dance', url: '/models/anim_dance.glb' },
            { key: 'point', url: '/models/anim_point.glb' },
            { key: 'teach', url: '/models/anim_talk.glb' },
            { key: 'walk', url: '/models/anim_step.glb' }
          ];

          animFiles.forEach(({ key, url }) => {
            gltfLoader.load(
              url,
              (gltfAnim) => {
                if (gltfAnim.animations && gltfAnim.animations.length > 0) {
                  const clip = gltfAnim.animations[0].clone();
                  clip.name = key;
                  clip.tracks = clip.tracks.filter((track) => {
                    track.name = track.name.replace(/ /g, '_');
                    if (track.name.startsWith('Bip01_Head.')) track.name = track.name.replace('Bip01_Head.', 'Head.');
                    if (track.name.endsWith('.position')) return false;
                    if (track.name.includes('Pelvis')) return false;
                    return true;
                  });

                  const action = mixer.clipAction(clip);
                  actionsRef.current[key] = action;
                  if (key === 'idle' && !activeActionRef.current) {
                    action.play();
                    activeActionRef.current = action;
                  }
                }
              },
              undefined,
              (err) => console.warn(`Anim error ${key}:`, err)
            );
          });
        },
        (xhr) => setLoadingProgress(Math.round((xhr.loaded / (xhr.total || 1)) * 100)),
        (err) => {
          console.error('Lumina character load error:', err);
          setIsLoading(false);
        }
      );
    }).catch(err => {
      console.error('MeshoptDecoder init error:', err);
      setIsLoading(false);
    });

    const safetyTimer = setTimeout(() => setIsLoading(false), 2000);

    // ── G. RENDER ANIMATION & PROCEDURAL POSTURE LOOP ──
    const clock = new THREE.Clock();
    let reqId;
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkDuration = 0.16;
    let timeSinceBlink = 0;

    // Micro-animation timers (Eye saccades & spectrum refresh)
    let saccadeTimer = 0;
    let saccadeInterval = 0.5;
    let saccadeOffsetY = 0;
    let spectrumTimer = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const currentAction = activeActionNameRef.current || 'idle';
      const currentlySpeaking = isSpeakingRef.current;

      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Procedural Arm Relaxation & Chalkboard Writing / Pointing
      const bones = bonesRef.current;
      const char = characterRef.current;

      if (bones['Bip01_L_UpperArm'] && bones['Bip01_R_UpperArm']) {
        if (currentAction === 'idle') {
          if (char) char.rotation.y = THREE.MathUtils.lerp(char.rotation.y, 0.15, 0.06);

          bones['Bip01_L_UpperArm'].rotation.x = THREE.MathUtils.lerp(bones['Bip01_L_UpperArm'].rotation.x, 2.0, 0.08);
          bones['Bip01_L_UpperArm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_L_UpperArm'].rotation.y, 2.0, 0.08);
          bones['Bip01_L_UpperArm'].rotation.z = THREE.MathUtils.lerp(bones['Bip01_L_UpperArm'].rotation.z, -2.0, 0.08);
          
          bones['Bip01_R_UpperArm'].rotation.x = THREE.MathUtils.lerp(bones['Bip01_R_UpperArm'].rotation.x, 0.5, 0.08);
          bones['Bip01_R_UpperArm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_R_UpperArm'].rotation.y, -1.4, 0.08);
          bones['Bip01_R_UpperArm'].rotation.z = THREE.MathUtils.lerp(bones['Bip01_R_UpperArm'].rotation.z, 0.7, 0.08);

          if (bones['Bip01_L_Forearm']) bones['Bip01_L_Forearm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_L_Forearm'].rotation.y, 0.25, 0.08);
          if (bones['Bip01_R_Forearm']) bones['Bip01_R_Forearm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_R_Forearm'].rotation.y, 0.25, 0.08);

          if (bones['Bip01_Spine1']) {
            bones['Bip01_Spine1'].rotation.z = Math.sin(clock.getElapsedTime() * 1.8) * 0.015;
          }
        } else if (currentAction === 'point') {
          if (char) char.rotation.y = THREE.MathUtils.lerp(char.rotation.y, 0.25, 0.06);

          // Raise left arm toward chalkboard equation and diagram
          bones['Bip01_L_UpperArm'].rotation.x = THREE.MathUtils.lerp(bones['Bip01_L_UpperArm'].rotation.x, 0.4, 0.1);
          bones['Bip01_L_UpperArm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_L_UpperArm'].rotation.y, 0.7, 0.1);
          bones['Bip01_L_UpperArm'].rotation.z = THREE.MathUtils.lerp(bones['Bip01_L_UpperArm'].rotation.z, -1.35, 0.1);
          if (bones['Bip01_L_Forearm']) bones['Bip01_L_Forearm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_L_Forearm'].rotation.y, -0.4, 0.1);

          // Right arm resting naturally
          bones['Bip01_R_UpperArm'].rotation.x = THREE.MathUtils.lerp(bones['Bip01_R_UpperArm'].rotation.x, 0.5, 0.08);
          bones['Bip01_R_UpperArm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_R_UpperArm'].rotation.y, -1.4, 0.08);
          bones['Bip01_R_UpperArm'].rotation.z = THREE.MathUtils.lerp(bones['Bip01_R_UpperArm'].rotation.z, 0.7, 0.08);
        } else if (currentAction === 'write') {
          // Turn Lumina directly toward chalkboard
          if (char) char.rotation.y = THREE.MathUtils.lerp(char.rotation.y, -0.55, 0.08);

          // Raise right arm with chalk against the board with realistic oscillating strokes
          const writeOsc = Math.sin(clock.getElapsedTime() * 12) * 0.06;
          const writeOscY = Math.cos(clock.getElapsedTime() * 10) * 0.04;

          bones['Bip01_R_UpperArm'].rotation.x = THREE.MathUtils.lerp(bones['Bip01_R_UpperArm'].rotation.x, 1.1 + writeOscY, 0.1);
          bones['Bip01_R_UpperArm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_R_UpperArm'].rotation.y, -0.65, 0.1);
          bones['Bip01_R_UpperArm'].rotation.z = THREE.MathUtils.lerp(bones['Bip01_R_UpperArm'].rotation.z, 0.25 + writeOsc, 0.1);

          if (bones['Bip01_R_Forearm']) {
            bones['Bip01_R_Forearm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_R_Forearm'].rotation.y, 0.65 + writeOsc, 0.1);
          }

          bones['Bip01_L_UpperArm'].rotation.x = THREE.MathUtils.lerp(bones['Bip01_L_UpperArm'].rotation.x, 1.8, 0.08);
          bones['Bip01_L_UpperArm'].rotation.y = THREE.MathUtils.lerp(bones['Bip01_L_UpperArm'].rotation.y, 1.6, 0.08);
          bones['Bip01_L_UpperArm'].rotation.z = THREE.MathUtils.lerp(bones['Bip01_L_UpperArm'].rotation.z, -1.6, 0.08);
        }
      }

      // ── MICRO-ANIMATIONS: EYE SACCADES & HEAD TILT ──
      saccadeTimer += delta;
      if (saccadeTimer > saccadeInterval) {
        saccadeTimer = 0;
        saccadeInterval = 0.4 + Math.random() * 0.6;
        saccadeOffsetY = (Math.random() - 0.5) * 0.02;
      }

      if (bones['Head']) {
        if (isListeningRef.current || isAnalyzingRef.current) {
          // Attentive, inquisitive head tilt while student speaks or doubt is being analyzed
          bones['Head'].rotation.z = THREE.MathUtils.lerp(bones['Head'].rotation.z, 0.08, 0.08);
          bones['Head'].rotation.y = THREE.MathUtils.lerp(bones['Head'].rotation.y, -0.06 + saccadeOffsetY, 0.08);
        } else if (currentAction === 'idle') {
          bones['Head'].rotation.z = THREE.MathUtils.lerp(bones['Head'].rotation.z, 0, 0.05);
          bones['Head'].rotation.y = THREE.MathUtils.lerp(bones['Head'].rotation.y, saccadeOffsetY, 0.05);
        }
      }

      // Facial Animation: Blinking & Lip-Sync Modulation
      const mesh = skinnedMeshRef.current;
      if (mesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        const dict = mesh.morphTargetDictionary;
        const infl = mesh.morphTargetInfluences;

        // Warm smile matching reference
        if (dict['mouthSmileLeft'] !== undefined) infl[dict['mouthSmileLeft']] = 0.52;
        if (dict['mouthSmileRight'] !== undefined) infl[dict['mouthSmileRight']] = 0.52;

        timeSinceBlink += delta;
        if (timeSinceBlink > 3.5) {
          isBlinking = true;
          blinkTimer = 0;
          timeSinceBlink = 0;
        }

        if (isBlinking) {
          blinkTimer += delta;
          const blinkProgress = blinkTimer / blinkDuration;
          const blinkVal = Math.sin(blinkProgress * Math.PI);
          if (dict['eyeBlinkLeft'] !== undefined) infl[dict['eyeBlinkLeft']] = Math.max(0, blinkVal);
          if (dict['eyeBlinkRight'] !== undefined) infl[dict['eyeBlinkRight']] = Math.max(0, blinkVal);

          if (blinkProgress >= 1.0) {
            isBlinking = false;
            if (dict['eyeBlinkLeft'] !== undefined) infl[dict['eyeBlinkLeft']] = 0;
            if (dict['eyeBlinkRight'] !== undefined) infl[dict['eyeBlinkRight']] = 0;
          }
        }

        // Audio Viseme Lip-Sync
        if (currentlySpeaking) {
          const t = clock.getElapsedTime() * 12;
          const speechOpen = (Math.sin(t) + 1) * 0.4;
          if (dict['jawOpen'] !== undefined) infl[dict['jawOpen']] = speechOpen;
          if (dict['viseme_aa'] !== undefined) infl[dict['viseme_aa']] = speechOpen * 0.8;
          if (dict['viseme_E'] !== undefined) infl[dict['viseme_E']] = (Math.cos(t) + 1) * 0.3;
        } else {
          if (dict['jawOpen'] !== undefined) infl[dict['jawOpen']] = 0.05;
          if (dict['viseme_aa'] !== undefined) infl[dict['viseme_aa']] = 0;
          if (dict['viseme_E'] !== undefined) infl[dict['viseme_E']] = 0;
        }
      }

      // Frequency Audio Visualizer Spectrum Update (throttled ~20fps)
      spectrumTimer += delta;
      if (spectrumTimer > 0.05) {
        spectrumTimer = 0;
        setFrequencyData(luminaAudio.getFrequencyData(20));
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Listener
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(safetyTimer);
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [updateChalkboard, onStatusChange]);

  // ─── 5. RAYCASTER FOR STUDENT CHALK & SPONGE ERASER ───
  const raycaster = useRef(new THREE.Raycaster());
  const mouseVec = useRef(new THREE.Vector2());
  const isPointerDownRef = useRef(false);

  const getChalkboardCoordinates = (clientX, clientY) => {
    if (!mountRef.current || !chalkboardMeshRef.current || !cameraRef.current) return null;
    const rect = mountRef.current.getBoundingClientRect();
    mouseVec.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseVec.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouseVec.current, cameraRef.current);
    const hits = raycaster.current.intersectObject(chalkboardMeshRef.current);
    if (hits.length > 0 && hits[0].uv) {
      return {
        x: hits[0].uv.x * 1200,
        y: (1 - hits[0].uv.y) * 600
      };
    }
    return null;
  };

  const handlePointerDown = (e) => {
    if (studentModeRef.current === 'view') return;
    const coords = getChalkboardCoordinates(e.clientX, e.clientY);
    if (coords) {
      isPointerDownRef.current = true;
      if (controlsRef.current) controlsRef.current.enabled = false;

      const newStroke = {
        tool: studentModeRef.current,
        color: chalkColorRef.current,
        width: studentModeRef.current === 'eraser' ? 40 : 4,
        points: [coords]
      };
      currentStrokeRef.current = newStroke;
      luminaAudio.playChalkSound(0.06);
    }
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current || !currentStrokeRef.current) return;
    const coords = getChalkboardCoordinates(e.clientX, e.clientY);
    if (coords) {
      currentStrokeRef.current.points.push(coords);
      // Redraw student strokes live
      const strokesToRender = [...studentStrokesRef.current, currentStrokeRef.current];
      updateChalkboard(5, lecturePlanRef.current, strokesToRender, sliderParamsRef.current);
    }
  };

  const handlePointerUp = () => {
    if (isPointerDownRef.current && currentStrokeRef.current) {
      isPointerDownRef.current = false;
      const completedStrokes = [...studentStrokesRef.current, currentStrokeRef.current];
      setStudentStrokes(completedStrokes);
      studentStrokesRef.current = completedStrokes;
      currentStrokeRef.current = null;
      if (controlsRef.current) controlsRef.current.enabled = true;
      updateChalkboard(5, lecturePlanRef.current, completedStrokes, sliderParamsRef.current);
    }
  };

  const handleClearStudentStrokes = () => {
    setStudentStrokes([]);
    studentStrokesRef.current = [];
    updateChalkboard(5, lecturePlanRef.current, [], sliderParamsRef.current);
  };

  // ─── 6. PHYSICAL SKELETAL TRANSITIONS ───
  const transitionToAnimation = useCallback((animName) => {
    setActiveActionName(animName);
    if (animName === 'point' || animName === 'write') return;

    const mixer = mixerRef.current;
    const actions = actionsRef.current;
    if (!mixer || !actions[animName]) return;

    const prevAction = activeActionRef.current;
    const nextAction = actions[animName];
    if (prevAction === nextAction) return;

    if (prevAction) prevAction.fadeOut(0.35);
    nextAction.reset().fadeIn(0.35).play();
    activeActionRef.current = nextAction;

    if (animName === 'dance') {
      luminaAudio.init();
      luminaAudio.playDanceBeat(1);
    }
  }, []);

  // ─── 7. ACTIONS & GESTURES ───
  const handleWalkToBoard = () => {
    transitionToAnimation('walk');
    speakAloud("Walking over to the chalkboard to explain.");
    const char = characterRef.current;
    if (!char) return;

    let steps = 0;
    const walkInterval = setInterval(() => {
      steps++;
      char.position.z -= 0.08;
      if (steps >= 16) {
        clearInterval(walkInterval);
        char.rotation.y = Math.PI * 0.75;
        transitionToAnimation('point');
        speakAloud("Here on the chalkboard, notice the step-by-step principles and diagrams!");
      }
    }, 100);
  };

  const handlePerformDance = () => {
    transitionToAnimation('dance');
    speakAloud("Counting aloud: 1, 2, 3, 4, 5, 6, 7, 8! Watch my full-body rhythm and weight transfer.");
    let beat = 1;
    const beatInterval = setInterval(() => {
      setDanceCount(beat);
      luminaAudio.playDanceBeat(beat);
      beat++;
      if (beat > 8) clearInterval(beatInterval);
    }, 600);
  };

  const handleReturnCenter = () => {
    const char = characterRef.current;
    if (char) {
      char.position.set(-0.35, 0, 0);
      char.rotation.set(0, 0.15, 0);
    }
    transitionToAnimation('idle');
    speakAloud("Standing center-stage, ready for your next question!");
  };

  // ─── 8. INTERACTIVE VOICE INPUT (WITH INSTANT VOICE BARGE-IN) ───
  const handleToggleVoiceInput = () => {
    // Voice Barge-in: If Lumina is speaking, interrupt immediately!
    if (isSpeaking) {
      luminaAudio.bargeIn();
      setIsSpeaking(false);
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      speakAloud("I've paused listening. Click the mic anytime to ask your doubt!");
      return;
    }

    setIsListening(true);
    setSpokenText("Listening to your voice... Ask any doubt across mathematics, physics, algorithms, or science!");

    const rec = luminaAudio.startListening(
      (transcript) => {
        setIsListening(false);
        handleExplainDoubt(transcript);
      },
      () => {
        setIsListening(false);
      },
      (_err) => {
        setIsListening(false);
        speakAloud("I'm listening! Feel free to ask about quadratics, Newton's laws, or quicksort!");
      }
    );
    recognitionRef.current = rec;
  };

  // Browser Audio Unlock
  const handleUserGestureUnlock = () => {
    luminaAudio.init();
    if (!hasSpokenWelcomeRef.current) {
      hasSpokenWelcomeRef.current = true;
      speakAloud("Hello scholar! I'm Lumina, your personal mentor. Welcome to our 3D classroom. Feel free to ask me anything or explore the curve sliders!");
    }
  };

  return (
    <div 
      onClick={handleUserGestureUnlock}
      className="relative w-full h-full min-h-[100vh] bg-[#090614] overflow-hidden select-none"
    >
      
      {/* ─── A. THREE.JS 3D CANVAS VIEWPORT (WITH RAYCASTER DRAWING EVENTS) ─── */}
      <div 
        ref={mountRef} 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`w-full h-full absolute inset-0 ${
          studentMode === 'chalk' 
            ? 'cursor-crosshair' 
            : studentMode === 'eraser' 
              ? 'cursor-cell' 
              : 'cursor-grab active:cursor-grabbing'
        }`}
      />

      {/* ─── B. LOADING OVERLAY ─── */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#070512]/92 backdrop-blur-xl text-white">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-400 animate-spin mb-4" />
          <h3 className="text-lg font-bold font-sans">Loading Lumina 3D Virtual Classroom...</h3>
          <p className="text-xs text-purple-300 font-mono mt-1">{loadingStatus}</p>
          <div className="w-64 h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 font-mono mt-1">{loadingProgress}%</span>
        </div>
      )}

      {/* ─── C. SUBTLE AUDIO / SPEECH QUESTION CARD (CENTER BOTTOM) ─── */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-none">
        <div className="p-3.5 rounded-2xl bg-black/65 border border-purple-500/30 backdrop-blur-xl shadow-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${isWriting ? 'bg-amber-400 animate-ping' : isAnalyzing ? 'bg-cyan-400 animate-pulse' : 'bg-purple-400 animate-pulse'}`} />
            <span className="text-[10px] text-purple-300 font-mono uppercase tracking-wider">
              {activeActionName === 'dance' 
                ? `Dancing · Beat ${danceCount}/8` 
                : isAnalyzing
                  ? 'AI Knowledge Engine Analyzing Doubt...'
                  : isWriting 
                    ? `Writing Stroke ${progressiveStage}/5 on Chalkboard...` 
                    : 'Lumina Audio Waveform Active'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-100 font-medium leading-relaxed">
            "{spokenText}"
          </p>
        </div>
      </div>

      {/* ─── D. FLOATING QUICK-ACTION PILLS (SLIDERS & ASK DOUBT) ─── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5">
        
        {/* 1. Ask Doubt & Write Button */}
        <button
          id="btn-ask-doubt"
          onClick={() => setShowDoubtDrawer(true)}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-700/90 via-indigo-700/90 to-purple-800/90 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs tracking-wide shadow-2xl shadow-purple-600/40 border border-purple-400/40 backdrop-blur-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5 text-purple-200" />
          <span>✍️ Ask Any Doubt & Write</span>
        </button>

        {/* 2. Interactive Coefficient Sliders Toggle (a, b, c) */}
        <button
          id="btn-toggle-sliders"
          onClick={() => setShowSliders(!showSliders)}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide shadow-2xl border backdrop-blur-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
            showSliders
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-cyan-600/40'
              : 'bg-black/60 hover:bg-black/80 text-gray-200 hover:text-white border-white/20'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-300" />
          <span>🎛️ Curve Sliders (a, b, c)</span>
        </button>

      </div>

      {/* ─── E. FLOATING GLASS DOCK (STUDENT TOOLS, BARGE-IN MIC & EQUALIZER) ─── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 sm:gap-3.5 px-5 py-2.5 rounded-full bg-black/65 border border-white/15 backdrop-blur-2xl shadow-2xl">
        
        {/* 1. Camera Toggle */}
        <button
          onClick={() => {
            const cam = cameraRef.current;
            const ctrl = controlsRef.current;
            if (cam && ctrl) {
              cam.position.set(-0.25, 1.35, 2.75);
              ctrl.target.set(-0.18, 1.25, 0);
              ctrl.update();
            }
          }}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
          title="Reset Camera View"
        >
          <Video className="w-4 h-4" />
        </button>

        {/* 2. Mode Selector: View vs Student Chalk vs Eraser */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
          <button
            onClick={() => setStudentMode('view')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              studentMode === 'view' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
            title="Inspect 3D Room"
          >
            🖐️ Orbit
          </button>
          <button
            onClick={() => setStudentMode('chalk')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              studentMode === 'chalk' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
            title="Write on 3D Chalkboard"
          >
            🖍️ Chalk
          </button>
          <button
            onClick={() => setStudentMode('eraser')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              studentMode === 'eraser' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
            title="Sponge Eraser"
          >
            🧽 Eraser
          </button>
        </div>

        {/* 3. Student Chalk Color Swatches (Shown in Chalk Mode) */}
        {studentMode === 'chalk' && (
          <div className="flex items-center gap-1 px-2 border-l border-white/10">
            {['#ffffff', '#fef08a', '#38bdf8', '#c084fc'].map((col) => (
              <button
                key={col}
                onClick={() => setChalkColor(col)}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                  chalkColor === col ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        )}

        {/* Clear Student Drawings Button */}
        {studentStrokes.length > 0 && (
          <button
            onClick={handleClearStudentStrokes}
            className="w-8 h-8 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-rose-500/30"
            title="Clear Student Chalk Marks"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* 4. Glowing Audio Waveform Visualizer (Reacting in real time to speech) */}
        <div className="flex items-center gap-1 px-2.5 py-1 border-l border-white/10">
          <div className="flex items-center gap-0.5 h-6">
            {frequencyData.slice(0, 10).map((val, idx) => (
              <span 
                key={idx} 
                className="w-1 rounded-full bg-gradient-to-t from-purple-500 to-cyan-400 transition-all duration-75"
                style={{ height: `${Math.max(4, val * 24)}px` }}
              />
            ))}
          </div>
          
          {/* Central Mic Button with Voice Barge-in */}
          <button
            onClick={handleToggleVoiceInput}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer border mx-1.5 ${
              isListening
                ? 'bg-red-600 text-white border-red-400 shadow-red-500/50 animate-pulse scale-105'
                : isSpeaking
                  ? 'bg-amber-600 text-white border-amber-400 shadow-amber-500/50 animate-pulse'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-purple-400 shadow-purple-500/50 hover:scale-105'
            }`}
            title={
              isSpeaking 
                ? "Lumina is speaking. Click to Barge-in & Ask Doubt!" 
                : isListening 
                  ? "Listening to your voice... (Click to stop)" 
                  : "Speak with Lumina (Click to ask question)"
            }
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          <div className="flex items-center gap-0.5 h-6">
            {frequencyData.slice(10, 20).map((val, idx) => (
              <span 
                key={idx} 
                className="w-1 rounded-full bg-gradient-to-t from-cyan-400 to-purple-500 transition-all duration-75"
                style={{ height: `${Math.max(4, val * 24)}px` }}
              />
            ))}
          </div>
        </div>

        {/* 5. Point to Chalkboard Toggle */}
        <button
          onClick={() => {
            transitionToAnimation('point');
            speakAloud(`Notice the ${lecturePlan.title} and step-by-step mathematical proof on the chalkboard!`);
          }}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
          title="Point to Chalkboard"
        >
          <Monitor className="w-4 h-4" />
        </button>

        {/* 6. Performance & Activities Drawer Toggle */}
        <button
          onClick={() => setShowActivityDrawer(!showActivityDrawer)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
            showActivityDrawer
              ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/50'
              : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border-white/10'
          }`}
          title="Performance & Activities Menu"
        >
          <Sparkles className="w-4 h-4" />
        </button>

      </div>

      {/* ─── F. FLOATING INTERACTIVE QUADRATIC SLIDERS (a, b, c) ─── */}
      {showSliders && (
        <LuminaInteractiveSliders
          params={sliderParams}
          onChange={handleSliderChange}
          onClose={() => setShowSliders(false)}
        />
      )}

      {/* ─── G. ACTIVITIES MENU (WALK, DANCE, POINT, IDLE) ─── */}
      {showActivityDrawer && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 rounded-2xl bg-black/85 border border-purple-500/40 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          
          <button
            onClick={() => handleExplainDoubt('quadratic')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeActionName === 'write'
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/40'
                : 'bg-white/10 text-gray-200 hover:text-white hover:bg-white/20 border-white/10'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write on Board</span>
          </button>

          <button
            onClick={handleWalkToBoard}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeActionName === 'walk'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/40'
                : 'bg-white/10 text-gray-200 hover:text-white hover:bg-white/20 border-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Walk to Board</span>
          </button>

          <button
            onClick={() => {
              transitionToAnimation('point');
              speakAloud(`Pointing to our ${lecturePlan.title} chalkboard presentation.`);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeActionName === 'point'
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/40'
                : 'bg-white/10 text-gray-200 hover:text-white hover:bg-white/20 border-white/10'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Point</span>
          </button>

          <button
            onClick={handlePerformDance}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeActionName === 'dance'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg shadow-purple-500/50'
                : 'bg-white/10 text-gray-200 hover:text-white hover:bg-white/20 border-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Dance (8-Count)</span>
          </button>

          <button
            onClick={handleReturnCenter}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 text-gray-200 hover:text-white hover:bg-white/20 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Face Student</span>
          </button>

        </div>
      )}

      {/* ─── H. GENERALIZED CHATGPT-STYLE AI DOUBT MODAL ─── */}
      {showDoubtDrawer && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-[#0e0a1a]/95 border border-purple-500/40 p-6 shadow-2xl shadow-purple-950/90 backdrop-blur-2xl text-white max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/25 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Edit3 className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Lumina AI Conversational Mentor & Doubt Solver
                  </h3>
                  <p className="text-xs text-purple-300/80">
                    Ask any question in Mathematics, Physics, Computer Science, or Engineering.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDoubtDrawer(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Doubt Input Form (ChatGPT-Style) */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (doubtQuery.trim()) {
                  handleExplainDoubt(doubtQuery.trim());
                  setDoubtQuery('');
                }
              }}
              className="mt-4 flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={doubtQuery}
                  onChange={(e) => setDoubtQuery(e.target.value)}
                  placeholder="Ask anything (e.g. 'Newton second law', 'Quicksort', 'Euler identity', 'Ohm law')..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-purple-400 focus:outline-none text-sm text-white placeholder-gray-400 transition-all font-sans"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Explain on Board</span>
              </button>
            </form>

            {/* Curated STEM Topics Across Disciplines */}
            <div className="mt-5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
                Popular Academic Topics (Click to Teach):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CURATED_KNOWLEDGE_BASE.slice(0, 8).map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleExplainDoubt(topic.title)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      lecturePlan.id === topic.id
                        ? 'bg-purple-900/40 border-purple-400 shadow-md shadow-purple-500/20'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        {topic.subject}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-300 font-semibold truncate max-w-[140px]">
                        {topic.primaryFormula}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-200 mt-1 line-clamp-1">
                      {topic.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ChatGPT-Style Pedagogical Synthesizer Active</span>
              </div>
              <button
                onClick={() => handleExplainDoubt('quadratic')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer font-medium"
              >
                ↺ Reset Quadratic Reference
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
