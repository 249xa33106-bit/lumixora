import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PlayCircle, RefreshCw, MousePointer2, Cpu, Gauge, Repeat, Box, PauseCircle, Camera, Square, Layers, Sparkles, Activity } from 'lucide-react';

const NUM_ROWS = 15;
const NUM_COLS = 35;

const START_NODE_ROW = 7;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 7;
const FINISH_NODE_COL = 30;

const PathfindingVisualizer = () => {
  const mountRef = useRef(null);

  // App State
  const [grid, setGrid] = useState([]);
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(15);
  const [isLoopMode, setIsLoopMode] = useState(false);
  const [selectedMaze, setSelectedMaze] = useState('none');
  
  // Real-Time Analytics Telemetry State
  const [stats, setStats] = useState({
    visitedCount: 0,
    pathLength: 0,
    timeMs: 0,
    status: 'Ready'
  });
  
  // View Mode: '3d' (WebGL Real 3D Scene) or '2d' (Classic 2D Grid)
  const [viewMode, setViewMode] = useState('3d');
  const [is2DMousePressed, setIs2DMousePressed] = useState(false);

  const speedRef = useRef(15);
  const isLoopRef = useRef(false);
  const animationTimerRef = useRef(null);

  // Three.js References
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshesMapRef = useRef(new Map());
  const isMouseDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    isLoopRef.current = isLoopMode;
  }, [isLoopMode]);

  // --- 1. INITIALIZE THREE.JS REAL 3D SCENE ---
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = 480;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c14);
    scene.fog = new THREE.FogExp2(0x0a0c14, 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 22, 24);
    camera.lookAt(0, -1, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(15, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Point Light glowing aura for Start & Target
    const startPointLight = new THREE.PointLight(0x22c55e, 3, 10);
    startPointLight.position.set(-12, 2, 0);
    scene.add(startPointLight);

    const targetPointLight = new THREE.PointLight(0xef4444, 3, 10);
    targetPointLight.position.set(12, 2, 0);
    scene.add(targetPointLight);

    // 5. Ground Base Grid Floor
    const planeGeo = new THREE.PlaneGeometry(38, 18);
    const planeMat = new THREE.MeshStandardMaterial({ 
      color: 0x111625, 
      roughness: 0.8, 
      metalness: 0.2, 
      side: THREE.DoubleSide 
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.05;
    plane.receiveShadow = true;
    scene.add(plane);

    // 6. Build Initial 3D Grid Meshes
    build3DGridMeshes(scene);

    // 7. Mouse Orbit Controls Logic (Drag to Rotate Real 3D Camera)
    const dom = renderer.domElement;

    const onMouseDown = (e) => {
      isMouseDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isMouseDraggingRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      const radius = Math.sqrt(camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2);
      let theta = Math.atan2(camera.position.x, camera.position.z);
      let phi = Math.acos(camera.position.y / radius);

      theta -= deltaX * 0.005;
      phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, phi - deltaY * 0.005));

      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, -1, 0);

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.multiplyScalar(e.deltaY > 0 ? 1.05 : 0.95);
      camera.position.clampLength(10, 50);
      camera.lookAt(0, -1, 0);
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 8. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      if (container.contains(dom)) container.removeChild(dom);
    };
  }, []);

  // --- 2. BUILD REAL 3D CUBE MESHES ---
  const initializeGrid = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setIsRunning(false);
    if (sceneRef.current) {
      meshesMapRef.current.forEach(mesh => sceneRef.current.remove(mesh));
      build3DGridMeshes(sceneRef.current);
    }
  };

  const build3DGridMeshes = (scene) => {
    const boxGeo = new THREE.BoxGeometry(0.9, 0.4, 0.9);
    const meshesMap = meshesMapRef.current;
    meshesMap.clear();

    const startRow = [];
    for (let r = 0; r < NUM_ROWS; r++) {
      const rowArr = [];
      for (let c = 0; c < NUM_COLS; c++) {
        const isStart = r === START_NODE_ROW && c === START_NODE_COL;
        const isFinish = r === FINISH_NODE_ROW && c === FINISH_NODE_COL;

        let mat;
        if (isStart) {
          mat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x15803d, emissiveIntensity: 0.8, roughness: 0.2 });
        } else if (isFinish) {
          mat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8, roughness: 0.2 });
        } else {
          mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.3 });
        }

        const mesh = new THREE.Mesh(boxGeo, mat);
        const xPos = (c - NUM_COLS / 2) * 1.0;
        const zPos = (r - NUM_ROWS / 2) * 1.0;
        mesh.position.set(xPos, 0.2, zPos);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add(mesh);
        meshesMap.set(`${r}-${c}`, mesh);

        rowArr.push({
          row: r,
          col: c,
          isStart,
          isFinish,
          isWall: false,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          fDistance: Infinity,
          previousNode: null
        });
      }
      startRow.push(rowArr);
    }
    setGrid(startRow);
  };

  // --- 3. HANDLE 3D CUBE CLICKING ---
  const handle3DCanvasClick = (e) => {
    if (isRunning || viewMode !== '3d') return;
    const container = mountRef.current;
    if (!container || !rendererRef.current || !cameraRef.current) return;

    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(Array.from(meshesMapRef.current.values()));
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      for (const [key, mesh] of meshesMapRef.current.entries()) {
        if (mesh === hitMesh) {
          const [r, c] = key.split('-').map(Number);
          toggleWallAt(r, c);
          break;
        }
      }
    }
  };

  // Shared Wall Toggle (Syncs 2D and 3D)
  const toggleWallAt = (r, c) => {
    if ((r === START_NODE_ROW && c === START_NODE_COL) || (r === FINISH_NODE_ROW && c === FINISH_NODE_COL)) return;

    setGrid(prev => {
      const next = prev.map(row => row.slice());
      const curr = next[r][c];
      const nextWall = !curr.isWall;
      next[r][c] = { ...curr, isWall: nextWall };

      // Update 3D Mesh
      const mesh = meshesMapRef.current.get(`${r}-${c}`);
      if (mesh) {
        if (nextWall) {
          mesh.scale.set(1, 4, 1);
          mesh.position.y = 1.0;
          mesh.material.color.setHex(0x4b5563);
          mesh.material.emissive.setHex(0x1f2937);
        } else {
          mesh.scale.set(1, 1, 1);
          mesh.position.y = 0.2;
          mesh.material.color.setHex(0x1e293b);
          mesh.material.emissive.setHex(0x000000);
        }
      }

      return next;
    });
  };

  // Helper: Reset 3D Meshes and React Grid State
  const reset3DGridMeshes = () => {
    meshesMapRef.current.forEach((mesh, key) => {
      const [r, c] = key.split('-').map(Number);
      const isStart = r === START_NODE_ROW && c === START_NODE_COL;
      const isFinish = r === FINISH_NODE_ROW && c === FINISH_NODE_COL;
      const isWall = grid[r] && grid[r][c] ? grid[r][c].isWall : false;

      if (isStart) {
        mesh.scale.set(1.1, 2, 1.1);
        mesh.position.y = 0.5;
        mesh.material.color.setHex(0x22c55e);
        mesh.material.emissive.setHex(0x15803d);
      } else if (isFinish) {
        mesh.scale.set(1.1, 2, 1.1);
        mesh.position.y = 0.5;
        mesh.material.color.setHex(0xef4444);
        mesh.material.emissive.setHex(0xb91c1c);
      } else if (isWall) {
        mesh.scale.set(1, 4, 1);
        mesh.position.y = 1.0;
        mesh.material.color.setHex(0x4b5563);
        mesh.material.emissive.setHex(0x1f2937);
      } else {
        mesh.scale.set(1, 1, 1);
        mesh.position.y = 0.2;
        mesh.material.color.setHex(0x1e293b);
        mesh.material.emissive.setHex(0x000000);
      }
    });

    return grid.map(row => row.map(node => ({
      ...node,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      fDistance: Infinity,
      previousNode: null
    })));
  };

  // Clear Path Only (keeps custom wall obstacles)
  const clearPathOnly = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setIsRunning(false);
    const clean = reset3DGridMeshes();
    setGrid(clean);
    setStats({ visitedCount: 0, pathLength: 0, timeMs: 0, status: 'Ready' });
  };

  // Dynamic Maze & Obstacle Generator
  const generateMaze = (type) => {
    if (isRunning) return;
    setSelectedMaze(type);
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setIsRunning(false);

    if (type === 'none') {
      initializeGrid();
      setStats({ visitedCount: 0, pathLength: 0, timeMs: 0, status: 'Ready' });
      return;
    }

    const nextGrid = grid.map((row, r) =>
      row.map((node, c) => {
        const isStart = r === START_NODE_ROW && c === START_NODE_COL;
        const isFinish = r === FINISH_NODE_ROW && c === FINISH_NODE_COL;
        if (isStart || isFinish) return { ...node, isWall: false, isVisited: false, isPath: false };

        let isWall = false;
        if (type === 'random_sparse') {
          isWall = Math.random() < 0.22;
        } else if (type === 'random_dense') {
          isWall = Math.random() < 0.38;
        } else if (type === 'diagonal') {
          isWall = (r + c) % 4 === 0 || (r - c) % 6 === 0;
        } else if (type === 'slits') {
          isWall = c % 4 === 0 && r !== 2 && r !== 8 && r !== 13;
        } else if (type === 'chambers') {
          isWall = (r % 4 === 0 || c % 6 === 0) && (r + c) % 3 !== 0;
        }

        // Update 3D Mesh
        const mesh = meshesMapRef.current.get(`${r}-${c}`);
        if (mesh) {
          if (isWall) {
            mesh.scale.set(1, 4, 1);
            mesh.position.y = 1.0;
            mesh.material.color.setHex(0x4b5563);
            mesh.material.emissive.setHex(0x1f2937);
          } else {
            mesh.scale.set(1, 1, 1);
            mesh.position.y = 0.2;
            mesh.material.color.setHex(0x1e293b);
            mesh.material.emissive.setHex(0x000000);
          }
        }

        return { ...node, isWall, isVisited: false, isPath: false };
      })
    );

    setGrid(nextGrid);
    setStats({ visitedCount: 0, pathLength: 0, timeMs: 0, status: 'Maze Generated' });
  };

  // --- ALGORITHMS ---
  const dijkstra = (gridCopy, startNode, finishNode) => {
    const visited = [];
    startNode.distance = 0;
    const unvisited = getAllNodes(gridCopy);

    while (unvisited.length > 0) {
      unvisited.sort((a, b) => a.distance - b.distance);
      const closest = unvisited.shift();
      if (closest.isWall) continue;
      if (closest.distance === Infinity) return visited;
      closest.isVisited = true;
      visited.push(closest);

      if (closest.row === finishNode.row && closest.col === finishNode.col) return visited;

      const neighbors = getNeighbors(closest, gridCopy);
      for (const n of neighbors) {
        if (!n.isWall && !n.isVisited) {
          if (closest.distance + 1 < n.distance) {
            n.distance = closest.distance + 1;
            n.previousNode = closest;
          }
        }
      }
    }
    return visited;
  };

  const aStar = (gridCopy, startNode, finishNode) => {
    const visited = [];
    startNode.distance = 0;
    startNode.fDistance = manhattanDistance(startNode, finishNode);
    const openSet = [startNode];

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.fDistance - b.fDistance);
      const current = openSet.shift();
      if (current.isWall || current.isVisited) continue;
      current.isVisited = true;
      visited.push(current);

      if (current.row === finishNode.row && current.col === finishNode.col) return visited;

      const neighbors = getNeighbors(current, gridCopy);
      for (const n of neighbors) {
        if (!n.isWall && !n.isVisited) {
          const gScore = current.distance + 1;
          if (gScore < n.distance) {
            n.distance = gScore;
            n.fDistance = gScore + manhattanDistance(n, finishNode);
            n.previousNode = current;
            openSet.push(n);
          }
        }
      }
    }
    return visited;
  };

  const bfs = (gridCopy, startNode, finishNode) => {
    const visited = [];
    const queue = [startNode];
    startNode.isVisited = true;

    while (queue.length > 0) {
      const current = queue.shift();
      visited.push(current);
      if (current.row === finishNode.row && current.col === finishNode.col) return visited;

      const neighbors = getNeighbors(current, gridCopy);
      for (const n of neighbors) {
        if (!n.isWall && !n.isVisited) {
          n.isVisited = true;
          n.previousNode = current;
          queue.push(n);
        }
      }
    }
    return visited;
  };

  const dfs = (gridCopy, startNode, finishNode) => {
    const visited = [];
    const stack = [startNode];

    while (stack.length > 0) {
      const current = stack.pop();
      if (current.isWall || current.isVisited) continue;
      current.isVisited = true;
      visited.push(current);

      if (current.row === finishNode.row && current.col === finishNode.col) return visited;

      const neighbors = getNeighbors(current, gridCopy);
      for (const n of neighbors) {
        if (!n.isVisited && !n.isWall) {
          n.previousNode = current;
          stack.push(n);
        }
      }
    }
    return visited;
  };

  const greedyBestFirst = (gridCopy, startNode, finishNode) => {
    const visited = [];
    const openSet = [startNode];

    while (openSet.length > 0) {
      openSet.sort((a, b) => manhattanDistance(a, finishNode) - manhattanDistance(b, finishNode));
      const current = openSet.shift();
      if (current.isWall || current.isVisited) continue;
      current.isVisited = true;
      visited.push(current);

      if (current.row === finishNode.row && current.col === finishNode.col) return visited;

      const neighbors = getNeighbors(current, gridCopy);
      for (const n of neighbors) {
        if (!n.isVisited && !n.isWall) {
          n.previousNode = current;
          openSet.push(n);
        }
      }
    }
    return visited;
  };

  const boyerMooreSearch = (gridCopy, startNode, finishNode) => {
    const visited = [];
    let currRow = startNode.row;
    let currCol = startNode.col;

    while (currRow !== finishNode.row || currCol !== finishNode.col) {
      const current = gridCopy[currRow][currCol];
      if (!current.isVisited && !current.isWall) {
        current.isVisited = true;
        visited.push(current);
      }

      const rowDiff = finishNode.row - currRow;
      const colDiff = finishNode.col - currCol;

      let nextRow = currRow + (rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1);
      let nextCol = currCol + (colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1);

      if (gridCopy[nextRow][nextCol].isWall) {
        return bfs(gridCopy, current, finishNode);
      }

      gridCopy[nextRow][nextCol].previousNode = current;
      currRow = nextRow;
      currCol = nextCol;
    }

    visited.push(gridCopy[finishNode.row][finishNode.col]);
    return visited;
  };

  const manhattanDistance = (nodeA, nodeB) => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  };

  const getNeighbors = (node, grid) => {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  };

  const getAllNodes = (grid) => {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  };

  const getShortestPathNodes = (finishNode) => {
    const path = [];
    let current = finishNode;
    while (current !== null && current !== undefined && current.previousNode) {
      path.unshift(current);
      current = current.previousNode;
    }
    if (current && (current.isStart || current.previousNode !== null)) {
      path.unshift(current);
    }
    return path;
  };

  // --- DUAL ANIMATION ENGINE (OPTIMIZED FOR INSTANT SHORTEST PATH REVEAL) ---
  const visualizeAlgorithm = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setIsRunning(true);
    const startExecTime = performance.now();

    const cleanGrid = reset3DGridMeshes();
    setGrid(cleanGrid);

    const startNode = cleanGrid[START_NODE_ROW][START_NODE_COL];
    const finishNode = cleanGrid[FINISH_NODE_ROW][FINISH_NODE_COL];

    let visitedNodesInOrder = [];
    if (algorithm === 'dijkstra') visitedNodesInOrder = dijkstra(cleanGrid, startNode, finishNode);
    else if (algorithm === 'astar') visitedNodesInOrder = aStar(cleanGrid, startNode, finishNode);
    else if (algorithm === 'bfs') visitedNodesInOrder = bfs(cleanGrid, startNode, finishNode);
    else if (algorithm === 'dfs') visitedNodesInOrder = dfs(cleanGrid, startNode, finishNode);
    else if (algorithm === 'greedy') visitedNodesInOrder = greedyBestFirst(cleanGrid, startNode, finishNode);
    else if (algorithm === 'boyermoore') visitedNodesInOrder = boyerMooreSearch(cleanGrid, startNode, finishNode);
    else visitedNodesInOrder = dijkstra(cleanGrid, startNode, finishNode);

    const finishComputed = cleanGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const shortestPathNodes = getShortestPathNodes(finishComputed);

    const filterVisited = visitedNodesInOrder.filter(n => !n.isStart && !n.isFinish);
    const filterPath = shortestPathNodes.filter(n => !n.isStart && !n.isFinish);
    const execDuration = Math.round(performance.now() - startExecTime);

    setStats({
      visitedCount: visitedNodesInOrder.length,
      pathLength: shortestPathNodes.length,
      timeMs: execDuration,
      status: shortestPathNodes.length > 0 ? 'Searching Grid...' : 'No Path Reachable 🚫'
    });

    let visitIndex = 0;
    let pathIndex = 0;
    const intervalMs = Math.max(5, speedRef.current);

    // Batch size adjusts dynamically based on speed so exploration finishes within ~3 seconds
    const batchSize = speedRef.current >= 150 ? 12 : (speedRef.current >= 90 ? 8 : (speedRef.current >= 40 ? 4 : 2));

    animationTimerRef.current = setInterval(() => {
      // 1. Animate Explored Nodes in Batches (Fast Exploration Wave)
      if (visitIndex < filterVisited.length) {
        const endIndex = Math.min(visitIndex + batchSize, filterVisited.length);
        const batchNodes = filterVisited.slice(visitIndex, endIndex);

        batchNodes.forEach(vNode => {
          // 3D Update
          const mesh = meshesMapRef.current.get(`${vNode.row}-${vNode.col}`);
          if (mesh) {
            mesh.scale.set(1.05, 2.5, 1.05);
            mesh.position.y = 0.6;
            mesh.material.color.setHex(0x3b82f6);
            mesh.material.emissive.setHex(0x1d4ed8);
            mesh.material.emissiveIntensity = 0.6;
          }

          // 2D DOM Highlight
          const el2d = document.getElementById(`2d-${vNode.row}-${vNode.col}`);
          if (el2d) {
            el2d.className = "w-5 h-5 md:w-6 md:h-6 border border-white/10 transition-all duration-150 cursor-pointer bg-blue-500/80 shadow-[0_0_10px_#3b82f6] animate-pulse";
          }
        });

        // 2D React State Update
        setGrid(prev => {
          const next = prev.map(r => r.slice());
          batchNodes.forEach(vNode => {
            next[vNode.row][vNode.col] = {
              ...next[vNode.row][vNode.col],
              isVisited: true
            };
          });
          return next;
        });

        visitIndex = endIndex;
      } 
      // 2. Animate Shortest Path Nodes Step-by-Step (Golden Line Highlight)
      else if (pathIndex < filterPath.length) {
        const pNode = filterPath[pathIndex];

        // 3D Update
        const mesh = meshesMapRef.current.get(`${pNode.row}-${pNode.col}`);
        if (mesh) {
          mesh.scale.set(1.2, 3.8, 1.2);
          mesh.position.y = 1.0;
          mesh.material.color.setHex(0xfacc15);
          mesh.material.emissive.setHex(0xca8a04);
          mesh.material.emissiveIntensity = 1.0;
        }

        // 2D DOM Highlight
        const el2d = document.getElementById(`2d-${pNode.row}-${pNode.col}`);
        if (el2d) {
          el2d.className = "w-5 h-5 md:w-6 md:h-6 border border-white/10 transition-all duration-150 cursor-pointer bg-yellow-400 shadow-[0_0_16px_#facc15] z-10 scale-110";
        }

        // 2D React State Update
        setGrid(prev => {
          const next = prev.map(r => r.slice());
          next[pNode.row][pNode.col] = {
            ...next[pNode.row][pNode.col],
            isVisited: false,
            isPath: true
          };
          return next;
        });

        pathIndex++;
      } 
      // 3. Finished Animation
      else {
        clearInterval(animationTimerRef.current);
        setIsRunning(false);
        setStats(s => ({
          ...s,
          status: shortestPathNodes.length > 0 ? 'Shortest Path Discovered ✨' : 'Destination Blocked 🚫'
        }));

        if (isLoopRef.current) {
          setTimeout(() => {
            visualizeAlgorithm();
          }, 800);
        }
      }
    }, intervalMs);
  };

  const handleStopAnimation = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setIsRunning(false);
    setIsLoopMode(false);
    isLoopRef.current = false;
  };

  const resetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 22, 24);
    cameraRef.current.lookAt(0, -1, 0);
  };

  // Helper: 2D Node Class Name Generator
  const get2DNodeClass = (node) => {
    let base = "w-5 h-5 md:w-6 md:h-6 border border-white/10 transition-all duration-150 cursor-pointer ";
    if (node.isStart) return base + "bg-green-500 shadow-[0_0_12px_#22c55e] z-10 scale-105";
    if (node.isFinish) return base + "bg-red-500 shadow-[0_0_12px_#ef4444] z-10 scale-105";
    if (node.isWall) return base + "bg-gray-600 scale-90 rounded-sm shadow-md";
    if (node.isPath) return base + "bg-yellow-400 shadow-[0_0_14px_#facc15] z-10 scale-110";
    if (node.isVisited) return base + "bg-blue-500/80 shadow-[0_0_10px_#3b82f6] animate-pulse";
    return base + "bg-black/40 hover:bg-white/10";
  };

  return (
    <div className="glass-panel p-6 flex flex-col min-h-[700px] animate-fade-in text-left relative overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span className="text-emerald-400">Pathfinding & Graph</span> Visualizer Sub-Portal
          </h2>
          <p className="text-gray-400 mt-1 flex items-center gap-2 text-xs">
            <MousePointer2 className="w-4 h-4 text-emerald-400" /> Switch between Real 3D WebGL Scene & Classic 2D Grid!
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 bg-black/30 p-2.5 rounded-2xl border border-white/10">
          
          {/* Mode Switcher 3D / 2D */}
          <div className="bg-black/60 p-1 rounded-xl border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === '3d' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Real 3D WebGL</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === '2d' ? 'bg-emerald-500 text-black font-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Classic 2D Grid</span>
            </button>
          </div>

          {/* Algorithm Selector Dropdown */}
          <select 
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isRunning}
            className="bg-black/70 border border-white/15 rounded-xl px-3.5 py-2 text-xs font-bold text-white outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <option value="dijkstra">Dijkstra's Algorithm (Guaranteed Shortest Path)</option>
            <option value="astar">A* Search (Heuristic Manhattan / Euclidean)</option>
            <option value="bfs">Breadth-First Search (BFS - Unweighted Shortest)</option>
            <option value="dfs">Depth-First Search (DFS / Deep Explorer)</option>
            <option value="greedy">Greedy Best-First Search</option>
            <option value="boyermoore">Boyer-Moore Grid Pattern Match</option>
          </select>

          {/* Maze & Pattern Generator Dropdown */}
          <select
            value={selectedMaze}
            onChange={(e) => generateMaze(e.target.value)}
            disabled={isRunning}
            className="bg-black/70 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-bold text-purple-300 outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="none">🗺️ Open Grid (No Walls)</option>
            <option value="random_sparse">🎲 Random Obstacles (22%)</option>
            <option value="random_dense">🧱 Dense Obstacles (38%)</option>
            <option value="diagonal">📐 Diagonal Staircase Maze</option>
            <option value="slits">🚪 Vertical Passageway Slits</option>
            <option value="chambers">🏛️ Multi-Room Chambers</option>
          </select>

          {/* Speed Control Selector */}
          <div className="flex items-center gap-1 bg-black/50 border border-white/10 px-2 py-1.5 rounded-xl text-xs font-bold text-gray-300">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={speed}
              onChange={(e) => { const s = Number(e.target.value); setSpeed(s); speedRef.current = s; }}
              disabled={isRunning}
              className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
              title="Animation Speed Control"
            >
              <option value={5} className="bg-black text-white">🚀 Ultra Fast (5ms)</option>
              <option value={15} className="bg-black text-white">⚡ Fast (15ms)</option>
              <option value={40} className="bg-black text-white">🏃 Medium (40ms)</option>
              <option value={90} className="bg-black text-white">🚶 Slow (90ms)</option>
              <option value={150} className="bg-black text-white">🐢 Super Slow (150ms)</option>
              <option value={250} className="bg-black text-white">🐌 Ultra Slow (250ms)</option>
            </select>
          </div>

          {/* Reset Camera Angle Button (3D Mode) */}
          {viewMode === '3d' && (
            <button
              onClick={resetCamera}
              className="px-3 py-2 rounded-xl bg-black/50 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Reset 3D Camera Angle"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reset Camera</span>
            </button>
          )}

          {/* Infinite Loop Mode Toggle */}
          <button
            onClick={() => { const next = !isLoopMode; setIsLoopMode(next); isLoopRef.current = next; }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isLoopMode 
                ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]' 
                : 'bg-black/50 border-white/10 text-gray-400 hover:text-white'
            }`}
            title="Toggle Continuous Loop Animation Mode"
          >
            <Repeat className={`w-3.5 h-3.5 ${isLoopMode ? 'animate-spin text-purple-400' : ''}`} />
            <span>{isLoopMode ? 'Loop ON' : 'Loop OFF'}</span>
          </button>
          
          {/* Clear Path Button */}
          <button 
            onClick={clearPathOnly}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-black/50 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Clear Path & Visited Nodes (Preserve Walls)"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Clear Path</span>
          </button>

          {/* Clear All Board Button */}
          <button 
            onClick={initializeGrid}
            disabled={isRunning}
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            title="Reset Grid & Clear All Walls"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          {/* Visualize / Stop Button */}
          <button
            onClick={isRunning ? handleStopAnimation : visualizeAlgorithm}
            className={`font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black'
            }`}
          >
            {isRunning ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4 fill-current" />}
            <span>{isRunning ? (isLoopMode ? 'Stop Loop' : 'Stop Animation') : 'Visualize Algorithm'}</span>
          </button>
        </div>
      </div>

      {/* Real-Time Telemetry HUD & Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 bg-black/60 rounded-2xl border border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Explored Nodes</span>
            <span className="text-lg font-black text-blue-400">{stats.visitedCount}</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
        </div>

        <div className="p-3 bg-black/60 rounded-2xl border border-yellow-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Shortest Path Steps</span>
            <span className="text-lg font-black text-yellow-400">{stats.pathLength > 0 ? `${stats.pathLength} nodes` : '0'}</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]"></div>
        </div>

        <div className="p-3 bg-black/60 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Efficiency Ratio</span>
            <span className="text-lg font-black text-emerald-400">
              {stats.visitedCount > 0 && stats.pathLength > 0
                ? `${Math.min(100, Math.round((stats.pathLength / stats.visitedCount) * 100))}%`
                : '0%'}
            </span>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]"></div>
        </div>

        <div className="p-3 bg-black/60 rounded-2xl border border-purple-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Search Status</span>
            <span className="text-xs font-black text-purple-300 truncate max-w-[120px] block">{stats.status}</span>
          </div>
          <Activity className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex justify-center mb-4 gap-6 text-xs text-gray-300 flex-wrap font-medium">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-sm shadow-[0_0_10px_#22c55e]"></div> Start Node</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-sm shadow-[0_0_10px_#ef4444]"></div> Target Node</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-500 rounded-sm shadow-[0_0_10px_#6b7280]"></div> Wall Obstacle</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded-sm shadow-[0_0_10px_#3b82f6]"></div> Explored Nodes</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded-sm shadow-[0_0_10px_#facc15]"></div> Shortest Path</div>
      </div>

      {/* --- MODE 1: REAL 3D THREE.JS WEBGL SCENE --- */}
      <div 
        ref={mountRef}
        onClick={handle3DCanvasClick}
        className={`w-full h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative cursor-grab active:cursor-grabbing bg-[#0a0c14] ${
          viewMode === '3d' ? 'block' : 'hidden'
        }`}
      >
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-bold text-gray-300 pointer-events-none flex items-center gap-1.5 z-20">
          <Box className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real WebGL 3D Scene • Drag to Rotate • Scroll to Zoom</span>
        </div>
      </div>

      {/* --- MODE 2: CLASSIC 2D INTERACTIVE GRID --- */}
      <div 
        className={`flex-1 justify-center items-center overflow-auto p-6 bg-black/50 rounded-3xl border border-white/10 min-h-[480px] ${
          viewMode === '2d' ? 'flex' : 'hidden'
        }`}
        onMouseLeave={() => setIs2DMousePressed(false)}
      >
        <div 
          className="grid gap-[2px] bg-white/10 p-[2px] rounded-2xl"
          style={{ gridTemplateColumns: `repeat(${NUM_COLS}, minmax(0, 1fr))` }}
        >
          {grid.map((row) => {
            return row.map((node) => {
              return (
                <div
                  key={`2d-${node.row}-${node.col}`}
                  className={get2DNodeClass(node)}
                  onMouseDown={() => {
                    if (isRunning) return;
                    toggleWallAt(node.row, node.col);
                    setIs2DMousePressed(true);
                  }}
                  onMouseEnter={() => {
                    if (!is2DMousePressed || isRunning) return;
                    toggleWallAt(node.row, node.col);
                  }}
                  onMouseUp={() => setIs2DMousePressed(false)}
                ></div>
              );
            });
          })}
        </div>
      </div>
      
      {/* Architectural Insights & Algorithm Comparison Matrix */}
      <div className="mt-6 bg-black/60 p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Algorithm Comparison Matrix & Architecture Deep Dive</span>
        </h3>

        {/* Algorithm Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-bold">
                <th className="py-2 px-3">Algorithm</th>
                <th className="py-2 px-3">Shortest Path</th>
                <th className="py-2 px-3">Time Complexity</th>
                <th className="py-2 px-3">Space Complexity</th>
                <th className="py-2 px-3">Heuristic / Strategy</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 font-medium divide-y divide-white/5">
              <tr className={algorithm === 'dijkstra' ? 'bg-emerald-500/10 text-emerald-300 font-bold' : ''}>
                <td className="py-2.5 px-3">Dijkstra's Algorithm</td>
                <td className="py-2.5 px-3 text-emerald-400">✅ Yes (Guaranteed)</td>
                <td className="py-2.5 px-3 font-mono">O((V + E) log V)</td>
                <td className="py-2.5 px-3 font-mono">O(V)</td>
                <td className="py-2.5 px-3">Greedy Unvisited Distance Relaxation</td>
              </tr>
              <tr className={algorithm === 'astar' ? 'bg-emerald-500/10 text-emerald-300 font-bold' : ''}>
                <td className="py-2.5 px-3">A* Search</td>
                <td className="py-2.5 px-3 text-emerald-400">✅ Yes (Admissible Heuristic)</td>
                <td className="py-2.5 px-3 font-mono">O(E) worst: O(b^d)</td>
                <td className="py-2.5 px-3 font-mono">O(V)</td>
                <td className="py-2.5 px-3">f(n) = g(n) + h(n) Manhattan Distance</td>
              </tr>
              <tr className={algorithm === 'bfs' ? 'bg-emerald-500/10 text-emerald-300 font-bold' : ''}>
                <td className="py-2.5 px-3">Breadth-First Search (BFS)</td>
                <td className="py-2.5 px-3 text-emerald-400">✅ Yes (Unweighted Grids)</td>
                <td className="py-2.5 px-3 font-mono">O(V + E)</td>
                <td className="py-2.5 px-3 font-mono">O(V)</td>
                <td className="py-2.5 px-3">FIFO Queue Wave Propagation</td>
              </tr>
              <tr className={algorithm === 'dfs' ? 'bg-emerald-500/10 text-emerald-300 font-bold' : ''}>
                <td className="py-2.5 px-3">Depth-First Search (DFS)</td>
                <td className="py-2.5 px-3 text-red-400">❌ No (Explores deep paths)</td>
                <td className="py-2.5 px-3 font-mono">O(V + E)</td>
                <td className="py-2.5 px-3 font-mono">O(V)</td>
                <td className="py-2.5 px-3">LIFO Stack / Recursive Backtracking</td>
              </tr>
              <tr className={algorithm === 'greedy' ? 'bg-emerald-500/10 text-emerald-300 font-bold' : ''}>
                <td className="py-2.5 px-3">Greedy Best-First</td>
                <td className="py-2.5 px-3 text-amber-400">⚠️ Heuristic Dependent</td>
                <td className="py-2.5 px-3 font-mono">O(V + E)</td>
                <td className="py-2.5 px-3 font-mono">O(V)</td>
                <td className="py-2.5 px-3">Expands node closest to goal first</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
