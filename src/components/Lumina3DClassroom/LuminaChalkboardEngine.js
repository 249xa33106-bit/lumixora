/**
 * 🎨 Lumina Chalkboard Engine
 * 
 * Provides high-fidelity 2D chalkboard rendering for Three.js:
 * - Authentic green slate texture with chalk dust gradient & eraser wipes
 * - Progressive stroke-by-stroke animation synchronized with Lumina's arm writing
 * - Dynamic Parametric Parabola with interactive (a, b, c) sliders & live discriminant
 * - Specialized STEM diagrams: Sine waves, Circuits, Trees, Force vectors, Triangles
 * - Interactive Student Drawing & Sponge Eraser layer
 */

/**
 * Render the full chalkboard canvas
 * @param {HTMLCanvasElement} canvas
 * @param {Object} lecturePlan - Output from LuminaKnowledgeEngine
 * @param {number} progressiveStage - 0 (blank slate) to 5 (full lecture with diagram)
 * @param {Array} studentStrokes - Array of freehand user drawing strokes
 * @param {Object} sliderParams - { a: number, b: number, c: number }
 */
export function renderChalkboardToCanvas(
  canvas,
  lecturePlan,
  progressiveStage = 5,
  studentStrokes = [],
  sliderParams = { a: 1, b: -2, c: -3 }
) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // ── 1. BASE DARK GREEN SLATE BLACKBOARD ──
  ctx.fillStyle = '#173a2b';
  ctx.fillRect(0, 0, W, H);

  // Realistic chalk dust gradient
  const grad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * 0.55);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle realistic eraser wipe marks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 22;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(60, 90 + i * 105);
    ctx.bezierCurveTo(400, 60 + i * 105, 800, 120 + i * 105, W - 60, 80 + i * 105);
    ctx.stroke();
  }

  // If stage is 0 (blank board being prepared), render student strokes and return
  if (progressiveStage <= 0 || !lecturePlan) {
    renderStudentStrokes(ctx, studentStrokes);
    return;
  }

  // ── 2. STAGE 1: TITLE & SUBJECT PILL ──
  if (progressiveStage >= 1) {
    // Dynamic Subject Tag Width
    const subjText = (lecturePlan.subject || 'STEM').toUpperCase();
    ctx.font = 'bold 13px "Courier New", monospace';
    const pillW = Math.max(100, Math.min(260, ctx.measureText(subjText).width + 28));

    ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(60, 38, pillW, 32, [8]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e9d5ff';
    ctx.fillText(subjText.slice(0, 24), 74, 59);

    // Main Lecture Title positioned dynamically after pill
    ctx.fillStyle = '#fef08a';
    ctx.font = 'italic 32px "Times New Roman", Georgia, serif';
    const titleStartX = 60 + pillW + 20;
    const displayTitle = lecturePlan.title.length > 36 
      ? `${lecturePlan.title.slice(0, 34)}...` 
      : lecturePlan.title;
    ctx.fillText(displayTitle, titleStartX, 63);

    // Decorative chalk underline under title
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 85);
    ctx.lineTo(W - 60, 85);
    ctx.stroke();
  }

  // ── 3. STAGE 2: PRIMARY FORMULA / AXIOM ──
  if (progressiveStage >= 2 && lecturePlan.primaryFormula) {
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 36px "Courier New", monospace';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 6;
    ctx.fillText(lecturePlan.primaryFormula, 80, 142);
    ctx.shadowBlur = 0;
  }

  // ── 4. STAGE 3: STEP-BY-STEP DERIVATION ──
  if (progressiveStage >= 3 && lecturePlan.steps && lecturePlan.steps.length > 0) {
    ctx.font = '21px "Courier New", monospace';
    ctx.fillStyle = '#a7f3d0';

    lecturePlan.steps.forEach((step, idx) => {
      // Chalk bullet
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText(step, 80, 195 + idx * 48);
    });
  }

  // ── 5. STAGE 4: BOXED CONCLUSION / FORMULA BOX ──
  if (progressiveStage >= 4 && lecturePlan.boxedConclusion) {
    const boxY = 380;
    const boxW = 640;
    const boxH = 110;

    // Glowing chalk border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(70, boxY, boxW, boxH);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText('✦ KEY TAKEAWAY / CONCLUSION:', 90, boxY + 32);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px "Courier New", monospace';
    const cleanConc = lecturePlan.boxedConclusion.length > 48 
      ? `${lecturePlan.boxedConclusion.slice(0, 45)}...` 
      : lecturePlan.boxedConclusion;
    ctx.fillText(cleanConc, 90, boxY + 75);
  }

  // ── 6. STAGE 5: DYNAMIC PARAMETRIC DIAGRAM (RIGHT HALF OF BOARD) ──
  if (progressiveStage >= 5) {
    renderDiagram(ctx, lecturePlan, sliderParams);
  }

  // ── 7. STUDENT INTERACTIVE CHALK & ERASER LAYER ──
  renderStudentStrokes(ctx, studentStrokes);
}

/**
 * Render specialized diagrams on the right side of the chalkboard (X: 740 to 1160)
 */
function renderDiagram(ctx, lecturePlan, sliderParams) {
  const diagType = lecturePlan.diagramType;
  const startX = 740;
  const endX = 1150;
  const midX = (startX + endX) / 2;
  const midY = 320;

  if (diagType === 'parabola' || lecturePlan.id === 'quadratic') {
    // ── DYNAMIC PARAMETRIC PARABOLA PLOT (WITH A, B, C SLIDERS) ──
    const a = sliderParams?.a ?? 1.0;
    const b = sliderParams?.b ?? -2.0;
    const c = sliderParams?.c ?? -3.0;

    // 1. Cartesian Grid & Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 4]);

    // X Axis
    ctx.beginPath();
    ctx.moveTo(startX, midY);
    ctx.lineTo(endX, midY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(midX, 100);
    ctx.lineTo(midX, 520);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('x', endX + 8, midY + 5);
    ctx.fillText('y', midX - 8, 90);

    // Discriminant Calculation: Δ = b² - 4ac
    const delta = b * b - 4 * a * c;
    const vertexX = -b / (2 * (a || 0.001));
    const vertexY = a * vertexX * vertexX + b * vertexX + c;

    // Header label for the live equation
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px "Courier New", monospace';
    const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    ctx.fillText(`y = ${a}x² ${signB}x ${signC}`, startX + 20, 125);

    // Live Discriminant badge on chalkboard
    ctx.font = 'bold 16px "Courier New", monospace';
    if (delta > 0) {
      ctx.fillStyle = '#34d399';
      ctx.fillText(`Δ = ${delta.toFixed(1)} > 0  (2 Real Roots)`, startX + 20, 155);
    } else if (Math.abs(delta) < 0.05) {
      ctx.fillStyle = '#facc15';
      ctx.fillText(`Δ = 0.0  (1 Repeated Root)`, startX + 20, 155);
    } else {
      ctx.fillStyle = '#f87171';
      ctx.fillText(`Δ = ${delta.toFixed(1)} < 0  (Complex Roots)`, startX + 20, 155);
    }

    // Plot Parabola: x from -4 to +4 (scaled to board coordinates)
    const scaleX = 35; // 35 pixels per unit
    const scaleY = 18; // 18 pixels per unit

    ctx.strokeStyle = delta > 0 ? '#38bdf8' : (Math.abs(delta) < 0.05 ? '#facc15' : '#f43f5e');
    ctx.lineWidth = 3.5;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 8;
    ctx.beginPath();

    let started = false;
    for (let u = -4.5; u <= 4.5; u += 0.2) {
      const px = midX + u * scaleX;
      const py = midY - (a * u * u + b * u + c) * scaleY;

      if (py >= 90 && py <= 530) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Highlight Real Roots on x-axis (if Δ >= 0)
    if (delta >= 0 && a !== 0) {
      const r1 = (-b + Math.sqrt(delta)) / (2 * a);
      const r2 = (-b - Math.sqrt(delta)) / (2 * a);

      [r1, r2].forEach(r => {
        const rootPixelX = midX + r * scaleX;
        if (rootPixelX >= startX && rootPixelX <= endX) {
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.arc(rootPixelX, midY, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = '12px "Courier New", monospace';
          ctx.fillStyle = '#e9d5ff';
          ctx.fillText(`x=${r.toFixed(1)}`, rootPixelX - 18, midY + 22);
        }
      });
    }

    // Highlight Vertex
    const vPixX = midX + vertexX * scaleX;
    const vPixY = midY - vertexY * scaleY;
    if (vPixX >= startX && vPixX <= endX && vPixY >= 90 && vPixY <= 530) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(vPixX, vPixY, 5, 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (diagType === 'sine_wave') {
    // ── SINE WAVE / HARMONIC OSCILLATION PLOT ──
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.moveTo(startX, midY); ctx.lineTo(endX, midY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(startX + 40, 120); ctx.lineTo(startX + 40, 500); ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let x = startX + 40; x <= endX; x++) {
      const t = (x - (startX + 40)) * 0.035;
      const y = midY - Math.sin(t) * 90;
      if (x === startX + 40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('x(t) = A · sin(ωt)', startX + 50, 160);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Amplitude A', startX + 220, midY - 95);

  } else if (diagType === 'triangle') {
    // ── RIGHT TRIANGLE (PYTHAGORAS) ──
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startX + 60, 460);
    ctx.lineTo(endX - 40, 460);
    ctx.lineTo(startX + 60, 160);
    ctx.closePath();
    ctx.stroke();

    // Right angle square
    ctx.strokeRect(startX + 60, 430, 30, 30);

    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('a (base)', (startX + endX) / 2 - 20, 495);
    ctx.fillText('b (perpendicular)', startX - 30, 310);
    ctx.fillStyle = '#c084fc';
    ctx.fillText('c (hypotenuse)', (startX + endX) / 2 + 10, 290);

  } else if (diagType === 'circuit') {
    // ── CIRCUIT DIAGRAM (OHM'S LAW / KCL) ──
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    // DC Battery
    ctx.beginPath();
    ctx.moveTo(startX + 60, midY - 60);
    ctx.lineTo(startX + 60, midY + 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(startX + 80, midY - 30);
    ctx.lineTo(startX + 80, midY + 30);
    ctx.stroke();

    // Loop
    ctx.beginPath();
    ctx.moveTo(startX + 60, midY - 60);
    ctx.lineTo(startX + 60, 180);
    ctx.lineTo(endX - 60, 180);
    // Resistor zigzag
    ctx.lineTo(endX - 60, 240);
    ctx.lineTo(endX - 75, 255);
    ctx.lineTo(endX - 45, 275);
    ctx.lineTo(endX - 75, 295);
    ctx.lineTo(endX - 45, 315);
    ctx.lineTo(endX - 60, 330);
    ctx.lineTo(endX - 60, 460);
    ctx.lineTo(startX + 80, 460);
    ctx.lineTo(startX + 80, midY + 60);
    ctx.stroke();

    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Voltage Source (V)', startX - 20, midY);
    ctx.fillStyle = '#facc15';
    ctx.fillText('Resistor (R)', endX - 160, 285);
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('Current I ⟶', (startX + endX) / 2 - 40, 160);

  } else if (diagType === 'tree') {
    // ── BINARY SEARCH TREE / DIVIDE & CONQUER ──
    const nodes = [
      { label: 'Root [50]', x: midX, y: 160 },
      { label: '[30]', x: midX - 90, y: 260 },
      { label: '[70]', x: midX + 90, y: 260 },
      { label: '[20]', x: midX - 130, y: 360 },
      { label: '[40]', x: midX - 50, y: 360 },
      { label: '[60]', x: midX + 50, y: 360 },
      { label: '[80]', x: midX + 130, y: 360 }
    ];

    // Branch lines
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    // 0 to 1, 2
    ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(nodes[1].x, nodes[1].y);
    ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(nodes[2].x, nodes[2].y);
    // 1 to 3, 4
    ctx.moveTo(nodes[1].x, nodes[1].y); ctx.lineTo(nodes[3].x, nodes[3].y);
    ctx.moveTo(nodes[1].x, nodes[1].y); ctx.lineTo(nodes[4].x, nodes[4].y);
    // 2 to 5, 6
    ctx.moveTo(nodes[2].x, nodes[2].y); ctx.lineTo(nodes[5].x, nodes[5].y);
    ctx.moveTo(nodes[2].x, nodes[2].y); ctx.lineTo(nodes[6].x, nodes[6].y);
    ctx.stroke();

    // Node circles
    nodes.forEach(n => {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + 4);
    });
    ctx.textAlign = 'left';

  } else {
    // ── GENERAL SCIENTIFIC FLOW DIAGRAM ──
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX + 40, 160, 320, 80);
    ctx.strokeRect(startX + 40, 290, 320, 80);
    ctx.strokeRect(startX + 40, 420, 320, 80);

    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('1. Input & Initial State', startX + 60, 205);
    ctx.fillText('2. Analytical Transform', startX + 60, 335);
    ctx.fillText('3. Stable Solution', startX + 60, 465);

    // Connecting arrows
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    [240, 370].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(midX, y);
      ctx.lineTo(midX, y + 50);
      ctx.stroke();
    });
  }
}

/**
 * Render student's interactive chalk and eraser drawing strokes over the board
 */
function renderStudentStrokes(ctx, studentStrokes) {
  if (!studentStrokes || studentStrokes.length === 0) return;

  studentStrokes.forEach(stroke => {
    if (!stroke.points || stroke.points.length < 2) return;

    if (stroke.tool === 'eraser') {
      // Sponge eraser marks (restores chalk slate)
      ctx.strokeStyle = '#173a2b';
      ctx.lineWidth = stroke.width || 36;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    } else {
      // Chalk stroke
      ctx.strokeStyle = stroke.color || '#ffffff';
      ctx.lineWidth = stroke.width || 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = stroke.color || 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  });
}
