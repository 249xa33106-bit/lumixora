export const formatMatrix = (prefix, grid, suffix = '') => {
  const rows = grid.length;
  const cols = grid[0].length;
  
  let gridHtml = `<div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 6px 16px; text-align: center; font-family: monospace; font-size: 1.1rem; padding: 4px;">`;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gridHtml += `<div>${grid[r][c]}</div>`;
    }
  }
  gridHtml += `</div>`;

  return `<div style="display:flex; align-items:center; gap:8px; justify-content:center; flex-wrap:wrap; color: var(--text-main);">
    ${prefix ? `<span style="font-size:1.1rem;">${prefix}</span>` : ''}
    <div style="display:flex; align-items:center;">
      <svg width="12" height="100%" viewBox="0 0 12 100" preserveAspectRatio="none" style="min-height: 40px;"><path d="M 10 0 L 2 0 L 2 100 L 10 100" fill="none" stroke="currentColor" stroke-width="2"/></svg>
      ${gridHtml}
      <svg width="12" height="100%" viewBox="0 0 12 100" preserveAspectRatio="none" style="min-height: 40px;"><path d="M 2 0 L 10 0 L 10 100 L 2 100" fill="none" stroke="currentColor" stroke-width="2"/></svg>
    </div>
    ${suffix ? `<span>${suffix}</span>` : ''}
  </div>`;
};

export const generateSimulationSteps = (gateId, q0, q1, q2) => {
  const steps = [];
  const formatProb = (p0, p1) => ({ p0, p1 });
  const isZero = q0 === '0';

  const singleQubitCircuit = (gateLabel) => ({
    numQubits: 1,
    wires: [`|${q0}⟩`],
    cols: [
      { id: 'gate', type: 'gate', gate: { label: gateLabel, target: 0 } },
      { id: 'measure', type: 'measure', target: 0 }
    ]
  });

  if (gateId === 'hadamard') {
    steps.push({
      name: 'Initial State', explanation: `Qubit starts in the |${q0}⟩ state.`, stateVector: `|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100),
      matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']]),
      circuitData: singleQubitCircuit('H'), activeCol: -1
    });
    steps.push({
      name: 'Applying H', explanation: 'Multiplying the state vector by the Hadamard matrix.', stateVector: `H|${q0}⟩`, bloch: isZero ? { theta: Math.PI / 4, phi: 0 } : { theta: Math.PI * 3/4, phi: Math.PI }, prob: formatProb(isZero ? 75 : 25, isZero ? 25 : 75),
      matrixHtml: formatMatrix('1/√2', [['1', '1'], ['1', '-1']], formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']])),
      circuitData: singleQubitCircuit('H'), activeCol: 0
    });
    steps.push({
      name: 'Superposition State', explanation: `The qubit is now in an equal superposition of |0⟩ and |1⟩, specifically the |${isZero?'+':'-'}⟩ state.`, stateVector: isZero ? '|+⟩ = 1/√2 (|0⟩ + |1⟩)' : '|-⟩ = 1/√2 (|0⟩ - |1⟩)', bloch: isZero ? { theta: Math.PI / 2, phi: 0 } : { theta: Math.PI / 2, phi: Math.PI }, prob: formatProb(50, 50),
      matrixHtml: formatMatrix('1/√2', [[isZero?'1':'1'], [isZero?'1':'-1']]),
      circuitData: singleQubitCircuit('H'), activeCol: 1
    });
  }
  else if (gateId === 'pauli_x') {
    steps.push({ name: 'Initial State', explanation: `Qubit starts in the |${q0}⟩ state.`, stateVector: `|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']]), circuitData: singleQubitCircuit('X'), activeCol: -1 });
    steps.push({ name: 'Applying X Gate', explanation: 'The X matrix swaps the amplitudes of |0⟩ and |1⟩ (Bit flip).', stateVector: `X|${q0}⟩`, bloch: { theta: Math.PI / 2, phi: 0 }, prob: formatProb(50, 50), matrixHtml: formatMatrix('', [['0', '1'], ['1', '0']], formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']])), circuitData: singleQubitCircuit('X'), activeCol: 0 });
    steps.push({ name: 'Final State', explanation: 'The qubit state is inverted.', stateVector: isZero ? '|1⟩' : '|0⟩', bloch: isZero ? { theta: Math.PI, phi: 0 } : { theta: 0, phi: 0 }, prob: formatProb(isZero?0:100, isZero?100:0), matrixHtml: formatMatrix('', [[isZero?'0':'1'], [isZero?'1':'0']]), circuitData: singleQubitCircuit('X'), activeCol: 1 });
  }
  else if (gateId === 'pauli_y') {
    steps.push({ name: 'Initial State', explanation: 'Start in basis state.', stateVector: `|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']]), circuitData: singleQubitCircuit('Y'), activeCol: -1 });
    steps.push({ name: 'Applying Y', explanation: 'Bit flip and phase flip.', stateVector: `Y|${q0}⟩`, bloch: { theta: Math.PI/2, phi: Math.PI/2 }, prob: formatProb(50, 50), matrixHtml: formatMatrix('', [['0', '-i'], ['i', '0']], formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']])), circuitData: singleQubitCircuit('Y'), activeCol: 0 });
    steps.push({ name: 'Final State', explanation: 'State is flipped and a complex phase is added.', stateVector: isZero ? 'i|1⟩' : '-i|0⟩', bloch: isZero ? { theta: Math.PI, phi: Math.PI/2 } : { theta: 0, phi: -Math.PI/2 }, prob: formatProb(isZero?0:100, isZero?100:0), matrixHtml: formatMatrix('', [[isZero?'0':'-i'], [isZero?'i':'0']]), circuitData: singleQubitCircuit('Y'), activeCol: 1 });
  }
  else if (gateId === 'pauli_z') {
    steps.push({ name: 'Initial State', explanation: `Qubit starts in the |${q0}⟩ state.`, stateVector: `|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']]), circuitData: singleQubitCircuit('Z'), activeCol: -1 });
    steps.push({ name: 'Applying Z Gate', explanation: 'The Z matrix applies a -1 phase factor only to the |1⟩ component.', stateVector: `Z|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [['1', '0'], ['0', '-1']], formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']])), circuitData: singleQubitCircuit('Z'), activeCol: 0 });
    steps.push({ name: 'Final State', explanation: isZero ? 'The |0⟩ state is unaffected by Z.' : 'The |1⟩ state gains a negative phase.', stateVector: isZero ? '|0⟩' : '-|1⟩', bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'-1']]), circuitData: singleQubitCircuit('Z'), activeCol: 1 });
  }
  else if (gateId === 's_gate') {
    steps.push({ name: 'Initial State', explanation: 'Start in basis state.', stateVector: `|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']]), circuitData: singleQubitCircuit('S'), activeCol: -1 });
    steps.push({ name: 'Applying S', explanation: 'Phase shift of π/2.', stateVector: `S|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: Math.PI/2 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [['1', '0'], ['0', 'i']], formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']])), circuitData: singleQubitCircuit('S'), activeCol: 0 });
    steps.push({ name: 'Final State', explanation: isZero ? '|0⟩ is unaffected.' : '|1⟩ gains a phase of i.', stateVector: isZero ? '|0⟩' : 'i|1⟩', bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: Math.PI/2 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'i']]), circuitData: singleQubitCircuit('S'), activeCol: 1 });
  }
  else if (gateId === 't_gate') {
    steps.push({ name: 'Initial State', explanation: 'Start in basis state.', stateVector: `|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']]), circuitData: singleQubitCircuit('T'), activeCol: -1 });
    steps.push({ name: 'Applying T', explanation: 'Phase shift of π/4.', stateVector: `T|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: Math.PI/4 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [['1', '0'], ['0', 'e^(iπ/4)']], formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']])), circuitData: singleQubitCircuit('T'), activeCol: 0 });
    steps.push({ name: 'Final State', explanation: isZero ? '|0⟩ is unaffected.' : '|1⟩ gains a phase of e^(iπ/4).', stateVector: isZero ? '|0⟩' : 'e^(iπ/4)|1⟩', bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: Math.PI/4 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'e^(iπ/4)']]), circuitData: singleQubitCircuit('T'), activeCol: 1 });
  }
  else if (gateId === 'rx') {
    steps.push({ name: 'Initial State', explanation: 'Start in basis state.', stateVector: `|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']]), circuitData: singleQubitCircuit('RX'), activeCol: -1 });
    steps.push({ name: 'Applying RX', explanation: 'Rotating around X axis by π/2.', stateVector: `RX|${q0}⟩`, bloch: isZero ? { theta: Math.PI/4, phi: -Math.PI/2 } : { theta: Math.PI*3/4, phi: Math.PI/2 }, prob: formatProb(50, 50), matrixHtml: formatMatrix('1/√2', [['1', '-i'], ['-i', '1']], formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']])), circuitData: singleQubitCircuit('RX'), activeCol: 0 });
    steps.push({ name: 'Final State', explanation: 'Vector rotated to the Y-axis.', stateVector: isZero ? '1/√2 (|0⟩ - i|1⟩)' : '1/√2 (-i|0⟩ + |1⟩)', bloch: isZero ? { theta: Math.PI/2, phi: -Math.PI/2 } : { theta: Math.PI/2, phi: Math.PI/2 }, prob: formatProb(50, 50), matrixHtml: formatMatrix('1/√2', [[isZero?'1':'-i'], [isZero?'-i':'1']]), circuitData: singleQubitCircuit('RX'), activeCol: 1 });
  }
  else if (gateId === 'ry') {
    steps.push({ name: 'Initial State', explanation: 'Start in basis state.', stateVector: `|${q0}⟩`, bloch: isZero ? { theta: 0, phi: 0 } : { theta: Math.PI, phi: 0 }, prob: formatProb(isZero?100:0, isZero?0:100), matrixHtml: formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']]), circuitData: singleQubitCircuit('RY'), activeCol: -1 });
    steps.push({ name: 'Applying RY', explanation: 'Rotating around Y axis by π/2.', stateVector: `RY|${q0}⟩`, bloch: isZero ? { theta: Math.PI/4, phi: 0 } : { theta: Math.PI*3/4, phi: Math.PI }, prob: formatProb(50, 50), matrixHtml: formatMatrix('1/√2', [['1', '-1'], ['1', '1']], formatMatrix('', [[isZero?'1':'0'], [isZero?'0':'1']])), circuitData: singleQubitCircuit('RY'), activeCol: 0 });
    steps.push({ name: 'Final State', explanation: 'Vector rotated to the X-axis (|+⟩ or |-⟩).', stateVector: isZero ? '1/√2 (|0⟩ + |1⟩)' : '1/√2 (-|0⟩ + |1⟩)', bloch: isZero ? { theta: Math.PI/2, phi: 0 } : { theta: Math.PI/2, phi: Math.PI }, prob: formatProb(50, 50), matrixHtml: formatMatrix('1/√2', [[isZero?'1':'-1'], [isZero?'1':'1']]), circuitData: singleQubitCircuit('RY'), activeCol: 1 });
  }
  else if (gateId === 'bell_state') {
    const cData = { numQubits: 2, wires: [`|${q0}⟩`, `|${q1}⟩`], cols: [ { type: 'gate', gate: { label: 'H', target: 0 } }, { type: 'cnot', control: 0, target: 1 }, { type: 'measure_all' } ] };
    steps.push({
      name: 'Initial State', explanation: 'Start with two qubits in independent computational basis states.', stateVector: `|${q0}${q1}⟩`, bloch: null, prob: { '00': q0==='0'&&q1==='0'?100:0, '01': q0==='0'&&q1==='1'?100:0, '10': q0==='1'&&q1==='0'?100:0, '11': q0==='1'&&q1==='1'?100:0 },
      matrixHtml: formatMatrix('', [[q0==='0'&&q1==='0'?'1':'0'], [q0==='0'&&q1==='1'?'1':'0'], [q0==='1'&&q1==='0'?'1':'0'], [q0==='1'&&q1==='1'?'1':'0']]), circuitData: cData, activeCol: -1
    });
    steps.push({
      name: 'Hadamard on Qubit 0', explanation: 'Create superposition on the control qubit.', stateVector: `1/√2 (|0${q1}⟩ ${isZero?'+':'-'} |1${q1}⟩)`, bloch: null, prob: { '00': q1==='0'?50:0, '01': q1==='1'?50:0, '10': q1==='0'?50:0, '11': q1==='1'?50:0 },
      matrixHtml: formatMatrix('1/√2', [[q1==='0'?'1':'0'], [q1==='1'?'1':'0'], [q1==='0'?(isZero?'1':'-1'):'0'], [q1==='1'?(isZero?'1':'-1'):'0']]), circuitData: cData, activeCol: 0
    });
    steps.push({
      name: 'CNOT (Entanglement)', explanation: 'Apply CNOT with Q0 as control and Q1 as target. This entangles the qubits.', stateVector: 'Entangling...', bloch: null, prob: { '00': 25, '01': 25, '10': 25, '11': 25 },
      matrixHtml: formatMatrix('CX', [['1','0','0','0'],['0','1','0','0'],['0','0','0','1'],['0','0','1','0']]), circuitData: cData, activeCol: 1
    });
    const out0 = q1;
    const out1 = q1 === '0' ? '1' : '0';
    steps.push({
      name: 'Maximally Entangled State', explanation: 'The qubits can no longer be described independently. Measuring one instantly determines the other.', stateVector: `1/√2 (|0${out0}⟩ ${isZero?'+':'-'} |1${out1}⟩)`, bloch: null, prob: { [`0${out0}`]: 50, [`1${out1}`]: 50, [`0${out1}`]: 0, [`1${out0}`]: 0 },
      matrixHtml: formatMatrix('1/√2', [[out0==='0'?'1':'0'], [out0==='1'?'1':'0'], [out1==='0'?(isZero?'1':'-1'):'0'], [out1==='1'?(isZero?'1':'-1'):'0']]), circuitData: cData, activeCol: 2
    });
  }
  else if (gateId === 'cnot') {
    const cData = { numQubits: 2, wires: [`|${q0}⟩`, `|${q1}⟩`], cols: [ { type: 'cnot', control: 0, target: 1 }, { type: 'measure_all' } ] };
    steps.push({ name: 'Initial State', explanation: `Qubits start as |${q0}${q1}⟩.`, stateVector: `|${q0}${q1}⟩`, bloch: null, prob: { [`${q0}${q1}`]: 100 }, matrixHtml: formatMatrix('', [[q0==='0'&&q1==='0'?'1':'0'], [q0==='0'&&q1==='1'?'1':'0'], [q0==='1'&&q1==='0'?'1':'0'], [q0==='1'&&q1==='1'?'1':'0']]), circuitData: cData, activeCol: -1 });
    steps.push({ name: 'Applying CNOT', explanation: 'If Control (q0) is 1, flip Target (q1). Otherwise do nothing.', stateVector: `CX|${q0}${q1}⟩`, bloch: null, prob: { [`${q0}${q1}`]: 100 }, matrixHtml: formatMatrix('CX', [['1','0','0','0'],['0','1','0','0'],['0','0','0','1'],['0','0','1','0']]), circuitData: cData, activeCol: 0 });
    const finalT = q0 === '1' ? (q1 === '0' ? '1' : '0') : q1;
    steps.push({ name: 'Final State', explanation: q0 === '1' ? 'Control was 1, so Target was flipped.' : 'Control was 0, so Target remains unchanged.', stateVector: `|${q0}${finalT}⟩`, bloch: null, prob: { [`${q0}${finalT}`]: 100 }, matrixHtml: formatMatrix('', [[q0==='0'&&finalT==='0'?'1':'0'], [q0==='0'&&finalT==='1'?'1':'0'], [q0==='1'&&finalT==='0'?'1':'0'], [q0==='1'&&finalT==='1'?'1':'0']]), circuitData: cData, activeCol: 1 });
  }
  else if (gateId === 'swap') {
    const cData = { numQubits: 2, wires: [`|${q0}⟩`, `|${q1}⟩`], cols: [ { type: 'swap', target1: 0, target2: 1 }, { type: 'measure_all' } ] };
    steps.push({ name: 'Initial State', explanation: `Qubits start as |${q0}${q1}⟩.`, stateVector: `|${q0}${q1}⟩`, bloch: null, prob: { [`${q0}${q1}`]: 100 }, matrixHtml: formatMatrix('', [[q0==='0'&&q1==='0'?'1':'0'], [q0==='0'&&q1==='1'?'1':'0'], [q0==='1'&&q1==='0'?'1':'0'], [q0==='1'&&q1==='1'?'1':'0']]), circuitData: cData, activeCol: -1 });
    steps.push({ name: 'Applying SWAP', explanation: 'Swapping the states of Q0 and Q1.', stateVector: `SWAP|${q0}${q1}⟩`, bloch: null, prob: { [`${q1}${q0}`]: 100 }, matrixHtml: formatMatrix('SWAP', [['1','0','0','0'],['0','0','1','0'],['0','1','0','0'],['0','0','0','1']]), circuitData: cData, activeCol: 0 });
    steps.push({ name: 'Final State', explanation: 'The states have been exchanged.', stateVector: `|${q1}${q0}⟩`, bloch: null, prob: { [`${q1}${q0}`]: 100 }, matrixHtml: formatMatrix('', [[q1==='0'&&q0==='0'?'1':'0'], [q1==='0'&&q0==='1'?'1':'0'], [q1==='1'&&q0==='0'?'1':'0'], [q1==='1'&&q0==='1'?'1':'0']]), circuitData: cData, activeCol: 1 });
  }
  else if (gateId === 'toffoli') {
    const cData = { numQubits: 3, wires: [`|${q0}⟩`, `|${q1}⟩`, `|${q2}⟩`], cols: [ { type: 'ccnot', control1: 0, control2: 1, target: 2 }, { type: 'measure_all' } ] };
    steps.push({ name: 'Initial State', explanation: `Start as |${q0}${q1}${q2}⟩.`, stateVector: `|${q0}${q1}${q2}⟩`, bloch: null, prob: { [`${q0}${q1}${q2}`]: 100 }, matrixHtml: `|${q0}${q1}${q2}⟩`, circuitData: cData, activeCol: -1 });
    steps.push({ name: 'Applying Toffoli (CCX)', explanation: 'If BOTH q0 and q1 are 1, flip q2.', stateVector: `CCX|${q0}${q1}${q2}⟩`, bloch: null, prob: { [`${q0}${q1}${q2}`]: 100 }, matrixHtml: `CCX Matrix (8x8)`, circuitData: cData, activeCol: 0 });
    const finalT = (q0 === '1' && q1 === '1') ? (q2 === '0' ? '1' : '0') : q2;
    steps.push({ name: 'Final State', explanation: (q0 === '1' && q1 === '1') ? 'Both controls were 1, Target flipped.' : 'Condition not met, Target unchanged.', stateVector: `|${q0}${q1}${finalT}⟩`, bloch: null, prob: { [`${q0}${q1}${finalT}`]: 100 }, matrixHtml: `|${q0}${q1}${finalT}⟩`, circuitData: cData, activeCol: 1 });
  }
  else if (gateId === 'deutsch_jozsa') {
    const cData = { numQubits: 2, wires: ['|0⟩', '|1⟩'], cols: [ { type: 'multigate', gates: [{label:'H', target:0},{label:'H', target:1}] }, { type: 'oracle', span: [0, 1] }, { type: 'gate', gate: {label:'H', target:0} }, { type: 'measure', target: 0 } ] };
    steps.push({ name: 'Initialization', explanation: 'Q0 starts at |0⟩, Q1 (ancilla) starts at |1⟩.', stateVector: '|01⟩', bloch: null, prob: { '01': 100 }, matrixHtml: `|0⟩ ⊗ |1⟩`, circuitData: cData, activeCol: -1 });
    steps.push({ name: 'Hadamard Layer', explanation: 'Apply Hadamard to both qubits to create full superposition.', stateVector: '1/2 (|0⟩+|1⟩)(|0⟩-|1⟩)', bloch: null, prob: { '00': 25, '01': 25, '10': 25, '11': 25 }, matrixHtml: `(H ⊗ H) |01⟩`, circuitData: cData, activeCol: 0 });
    steps.push({ name: 'Oracle Query (Uf)', explanation: 'Apply the Oracle. For a balanced function, it flips the phase of one of the inputs using a CNOT.', stateVector: '1/2 (|0⟩-|1⟩)(|0⟩-|1⟩)', bloch: null, prob: { '00': 25, '01': 25, '10': 25, '11': 25 }, matrixHtml: `U_f |x, y⟩ = |x, y ⊕ f(x)⟩`, circuitData: cData, activeCol: 1 });
    steps.push({ name: 'Interference Layer', explanation: 'Apply H to the first qubit to cause interference. If balanced, it interferes to |1⟩. If constant, |0⟩.', stateVector: '|1⟩ ⊗ |-⟩', bloch: null, prob: { '10': 50, '11': 50 }, matrixHtml: `(H ⊗ I) |ψ⟩`, circuitData: cData, activeCol: 2 });
    steps.push({ name: 'Measurement', explanation: 'Measuring q0 yields 1 with 100% certainty, proving the function is balanced.', stateVector: 'q0 = 1 (Balanced)', bloch: null, prob: { '10': 50, '11': 50 }, matrixHtml: `P(q0=1) = 1`, circuitData: cData, activeCol: 3 });
  }
  else if (gateId === 'grover') {
    const cData = { numQubits: 2, wires: ['|0⟩', '|0⟩'], cols: [ { type: 'multigate', gates: [{label:'H', target:0},{label:'H', target:1}] }, { type: 'oracle', span: [0, 1] }, { type: 'diffusion', span: [0, 1] }, { type: 'measure_all' } ] };
    steps.push({ name: 'Initialization', explanation: 'Start with 2 qubits in |00⟩.', stateVector: '|00⟩', bloch: null, prob: { '00': 100 }, matrixHtml: `|00⟩`, circuitData: cData, activeCol: -1 });
    steps.push({ name: 'Superposition', explanation: 'Apply Hadamard to both to create an equal superposition of all 4 items.', stateVector: '1/2 (|00⟩+|01⟩+|10⟩+|11⟩)', bloch: null, prob: { '00': 25, '01': 25, '10': 25, '11': 25 }, matrixHtml: formatMatrix('1/2', [['1'],['1'],['1'],['1']]), circuitData: cData, activeCol: 0 });
    steps.push({ name: 'Oracle (Marking)', explanation: 'The Oracle flips the phase of the target state (let\'s say |11⟩ is the target).', stateVector: '1/2 (|00⟩+|01⟩+|10⟩-|11⟩)', bloch: null, prob: { '00': 25, '01': 25, '10': 25, '11': 25 }, matrixHtml: formatMatrix('1/2', [['1'],['1'],['1'],['-1']]), circuitData: cData, activeCol: 1 });
    steps.push({ name: 'Diffusion Operator', explanation: 'Inversion about the mean. Amplitudes of non-targets shrink, target amplitude grows to 1.', stateVector: '|11⟩', bloch: null, prob: { '00': 0, '01': 0, '10': 0, '11': 100 }, matrixHtml: formatMatrix('', [['0'],['0'],['0'],['1']]), circuitData: cData, activeCol: 2 });
    steps.push({ name: 'Measurement', explanation: 'Measuring the state will yield the target |11⟩ with 100% probability after just 1 iteration.', stateVector: 'Measure |11⟩', bloch: null, prob: { '00': 0, '01': 0, '10': 0, '11': 100 }, matrixHtml: `P(11) = 1`, circuitData: cData, activeCol: 3 });
  }
  else if (gateId === 'teleportation') {
    const cData = {
      numQubits: 3,
      wires: ['|ψ⟩', '|0⟩', '|0⟩'],
      cols: [
        { type: 'gate', gate: {label:'H', target:1} },
        { type: 'cnot', control: 1, target: 2 },
        { type: 'cnot', control: 0, target: 1 },
        { type: 'gate', gate: {label:'H', target:0} },
        { type: 'measure', target: 0 },
        { type: 'measure', target: 1 },
        { type: 'cnot', control: 1, target: 2 },
        { type: 'cz', control: 0, target: 2 }
      ]
    };
    steps.push({ name: 'Initialization', explanation: 'q0 is the state to teleport (|ψ⟩). q1 and q2 belong to Alice and Bob.', stateVector: '|ψ⟩ ⊗ |00⟩', bloch: null, prob: { '100': 100 }, matrixHtml: `|ψ00⟩`, circuitData: cData, activeCol: -1 });
    steps.push({ name: 'Bell State Creation', explanation: 'Alice applies H on q1 to prepare the entangled pair.', stateVector: '|ψ⟩ ⊗ 1/√2(|00⟩+|10⟩)', bloch: null, prob: { '100': 50, '110': 50 }, matrixHtml: `H(q1)`, circuitData: cData, activeCol: 0 });
    steps.push({ name: 'Entanglement Distribution', explanation: 'Alice applies CNOT (q1 -> q2). q1 and q2 are now maximally entangled.', stateVector: '|ψ⟩ ⊗ 1/√2(|00⟩+|11⟩)', bloch: null, prob: { '100': 50, '111': 50 }, matrixHtml: `CX(q1, q2)`, circuitData: cData, activeCol: 1 });
    steps.push({ name: 'Alice interacts |ψ⟩ with Bell Pair', explanation: 'Alice applies a CNOT between her state |ψ⟩ and her half of the Bell pair.', stateVector: 'Entangled State', bloch: null, prob: { '000': 25, '011': 25, '110': 25, '101': 25 }, matrixHtml: `CX(q0, q1)`, circuitData: cData, activeCol: 2 });
    steps.push({ name: 'Alice\'s Hadamard', explanation: 'Alice applies H to her state |ψ⟩, moving into the Bell basis.', stateVector: 'Superposition', bloch: null, prob: { '000': 25, '011': 25, '110': 25, '101': 25 }, matrixHtml: `H(q0)`, circuitData: cData, activeCol: 3 });
    steps.push({ name: 'Alice Measures q0', explanation: 'Alice collapses q0 into a classical bit. Bob\'s qubit collapses accordingly.', stateVector: 'Partial Collapse', bloch: null, prob: { '101': 50, '110': 50 }, matrixHtml: `Measure q0`, circuitData: cData, activeCol: 4 });
    steps.push({ name: 'Alice Measures q1', explanation: 'Alice collapses q1 into a classical bit and sends the 2 classical bits to Bob.', stateVector: 'Partial Collapse', bloch: null, prob: { '110': 100 }, matrixHtml: `Measure q1`, circuitData: cData, activeCol: 5 });
    steps.push({ name: 'Bob Corrects (Conditional X)', explanation: 'If q1 was measured as 1, Bob applies an X gate (CNOT).', stateVector: 'Corrected X', bloch: null, prob: { '111': 100 }, matrixHtml: `CX(q1, q2)`, circuitData: cData, activeCol: 6 });
    steps.push({ name: 'Bob Corrects (Conditional Z)', explanation: 'If q0 was measured as 1, Bob applies a Z gate (CZ). Bob now holds exactly |ψ⟩.', stateVector: 'Bob holds |ψ⟩', bloch: null, prob: { '111': 100 }, matrixHtml: `CZ(q0, q2)`, circuitData: cData, activeCol: 7 });
  }
  else if (gateId === 'qft') {
    const cData = {
      numQubits: 3,
      wires: ['|0⟩', '|1⟩', '|1⟩'],
      cols: [
        { type: 'gate', gate: {label:'H', target:0} },
        { type: 'cphase', label: 'R2', control: 1, target: 0 },
        { type: 'cphase', label: 'R3', control: 2, target: 0 },
        { type: 'gate', gate: {label:'H', target:1} },
        { type: 'cphase', label: 'R2', control: 2, target: 1 },
        { type: 'gate', gate: {label:'H', target:2} },
        { type: 'swap', target1: 0, target2: 2 }
      ]
    };
    steps.push({ name: 'Initialization', explanation: 'State |011⟩ (decimal 3) ready for Quantum Fourier Transform.', stateVector: '|011⟩', bloch: null, prob: { '011': 100 }, matrixHtml: `|3⟩`, circuitData: cData, activeCol: -1 });
    steps.push({ name: 'Hadamard on q0', explanation: 'First stage of transforming the basis state into phase components.', stateVector: '1/√2 (|011⟩ + |111⟩)', bloch: null, prob: { '011': 50, '111': 50 }, matrixHtml: `H(q0)`, circuitData: cData, activeCol: 0 });
    steps.push({ name: 'Controlled Phase R2', explanation: 'Rotation by π/2 controlled by q1. Adds relative phase.', stateVector: 'Phased Superposition', bloch: null, prob: { '011': 50, '111': 50 }, matrixHtml: `C-R2(q1, q0)`, circuitData: cData, activeCol: 1 });
    steps.push({ name: 'Controlled Phase R3', explanation: 'Rotation by π/4 controlled by q2. Completes phase mapping for q0.', stateVector: 'Phased Superposition', bloch: null, prob: { '011': 50, '111': 50 }, matrixHtml: `C-R3(q2, q0)`, circuitData: cData, activeCol: 2 });
    steps.push({ name: 'Hadamard on q1', explanation: 'Start phase mapping for q1.', stateVector: 'Further Superposition', bloch: null, prob: { '001': 25, '011': 25, '101': 25, '111': 25 }, matrixHtml: `H(q1)`, circuitData: cData, activeCol: 3 });
    steps.push({ name: 'Controlled Phase R2 (q1)', explanation: 'Rotation by π/2 controlled by q2.', stateVector: 'Phased Superposition', bloch: null, prob: { '001': 25, '011': 25, '101': 25, '111': 25 }, matrixHtml: `C-R2(q2, q1)`, circuitData: cData, activeCol: 4 });
    steps.push({ name: 'Hadamard on q2', explanation: 'Final H gate.', stateVector: 'Fully Phased', bloch: null, prob: { '000': 12.5, '001': 12.5, '010': 12.5, '011': 12.5, '100': 12.5, '101': 12.5, '110': 12.5, '111': 12.5 }, matrixHtml: `H(q2)`, circuitData: cData, activeCol: 5 });
    steps.push({ name: 'SWAP Gate', explanation: 'Reverse qubit order to finalize the discrete Fourier transform.', stateVector: 'QFT|011⟩', bloch: null, prob: { '000': 12.5, '001': 12.5, '010': 12.5, '011': 12.5, '100': 12.5, '101': 12.5, '110': 12.5, '111': 12.5 }, matrixHtml: `SWAP(q0, q2)`, circuitData: cData, activeCol: 6 });
  }
  else {
    const cData = singleQubitCircuit('U');
    steps.push({ name: 'Initial State', explanation: 'Initial basis state.', stateVector: `|${q0}⟩`, bloch: { theta: 0, phi: 0 }, prob: formatProb(100, 0), matrixHtml: `|${q0}⟩`, circuitData: cData, activeCol: -1 });
    steps.push({ name: 'Applying Gate', explanation: 'Transformation in progress.', stateVector: `U|${q0}⟩`, bloch: { theta: Math.PI/2, phi: 0 }, prob: formatProb(50, 50), matrixHtml: `U |${q0}⟩`, circuitData: cData, activeCol: 0 });
    steps.push({ name: 'Final State', explanation: 'Simulation complete.', stateVector: `|ψ⟩`, bloch: { theta: Math.PI/4, phi: Math.PI/2 }, prob: formatProb(50, 50), matrixHtml: `Result Vector`, circuitData: cData, activeCol: 1 });
  }

  return steps;
};

export const SIMULATION_LIST = [
  { id: 'hadamard', name: 'Hadamard (H) - Superposition' },
  { id: 'pauli_x', name: 'Pauli-X Gate - Bit Flip' },
  { id: 'pauli_y', name: 'Pauli-Y Gate' },
  { id: 'pauli_z', name: 'Pauli-Z Gate - Phase Flip' },
  { id: 's_gate', name: 'S Gate (π/2 Phase)' },
  { id: 't_gate', name: 'T Gate (π/4 Phase)' },
  { id: 'rx', name: 'RX Rotation' },
  { id: 'ry', name: 'RY Rotation' },
  { id: 'cnot', name: 'CNOT (CX) Gate' },
  { id: 'swap', name: 'SWAP Gate' },
  { id: 'toffoli', name: 'Toffoli (CCX) Gate' },
  { id: 'bell_state', name: 'Bell State (Entanglement)' },
  { id: 'deutsch_jozsa', name: 'Deutsch-Jozsa Algorithm' },
  { id: 'grover', name: 'Grover\'s Search Algorithm (2-Qubit)' },
  { id: 'teleportation', name: 'Quantum Teleportation (3-Qubit)' },
  { id: 'qft', name: 'Quantum Fourier Transform (3-Qubit)' }
];
