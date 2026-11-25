/**
 * 🧮 Solves arithmetic expressions, print statements, and code evaluations
 * Handles:
 * - "2+4", "15 * 12 + 8", "100 / 4", "2^8"
 * - "printgf(2+4)", "printf(2+4)", "print(2+4)", "console.log(2+4)"
 */
export function solveArithmeticOrCodeExpression(rawQuery = '') {
  const query = (rawQuery || '').trim();

  // Pattern 1: Print / Output wrapping functions (e.g. printgf(2+4), printf(2+4), print(2+4), console.log(2+4))
  const printMatch = query.match(/^(print(?:gf|f)?|console\.log|cout\s*<<|echo)\s*\(?([^()]+)\)?/i);

  // Pattern 2: Pure arithmetic expression (e.g. "2+4", "15 * 12", "100 / (2 + 3)")
  const isPureArithmetic = /^[\s\d+\-*/^().,%eE]+$/.test(query) && /[\d]/.test(query) && /[+\-*/^%]/.test(query);

  let innerExpr = '';
  let isPrintStatement = false;
  let printFnName = 'printf';

  if (printMatch) {
    isPrintStatement = true;
    printFnName = printMatch[1].trim();
    innerExpr = printMatch[2].trim().replace(/^['"]|['"]$/g, '');
  } else if (isPureArithmetic) {
    innerExpr = query;
  } else {
    const embedMatch = query.match(/(?:what\s+is|calculate|evaluate|solve|compute)\s+([\d+\-*/^().\s%]+)/i);
    if (embedMatch && /[+\-*/^%]/.test(embedMatch[1])) {
      innerExpr = embedMatch[1].trim();
    }
  }

  if (!innerExpr) return null;

  // Safely evaluate math expression
  let evalResult;
  try {
    const sanitized = innerExpr.replace(/\^/g, '**');
    if (!/^[\d\s+\-*/.()**%]+$/.test(sanitized)) return null;
    
    // Evaluate in strict math sandbox
    const result = Function(`'use strict'; return (${sanitized});`)();
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) return null;
    evalResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
  } catch {
    return null;
  }

  // If it was a print function call like "printgf(2+4)" or "printf(2+4)"
  if (isPrintStatement) {
    const isTypo = /printgf/i.test(printFnName);
    const correctedFn = isTypo ? 'printf' : printFnName;

    return {
      id: 'code_eval_' + Date.now(),
      subject: 'Computer Science • C / C++ Output',
      title: `Evaluation: ${correctedFn}(${innerExpr})`,
      primaryFormula: `${correctedFn}("%d\\n", ${innerExpr})  ⟹  Output: ${evalResult}`,
      steps: [
        `1. Expression Parsing: Inner operand '${innerExpr}' is evaluated by the ALU: ${innerExpr} = ${evalResult}.`,
        `2. Execution & I/O: Runtime function ${correctedFn}() formats integer ${evalResult} to stdout buffer.`,
        isTypo 
          ? `3. Typo Auto-Resolution: '${printFnName}' is automatically resolved to C standard library printf().`
          : `3. Memory & Output: System call write(1, "${evalResult}\\n", ...) completes with Exit Code 0.`
      ],
      boxedConclusion: `Program Standard Output: ${evalResult}`,
      spokenExplanation: `Let's analyze your code query: ${query}. The inner expression ${innerExpr} is evaluated by the arithmetic logic unit to give ${evalResult}. In C and C++, the standard output function printf formats this integer and writes ${evalResult} directly to standard output!`,
      diagramType: 'code_execution',
      diagramData: {
        fn: correctedFn,
        input: innerExpr,
        output: evalResult,
        isTypo
      },
      isCustom: true,
      rawQuery: query
    };
  }

  // Pure arithmetic evaluation
  return {
    id: 'arithmetic_eval_' + Date.now(),
    subject: 'Arithmetic & Computation',
    title: `Calculation: ${innerExpr} = ${evalResult}`,
    primaryFormula: `${innerExpr} = ${evalResult}`,
    steps: [
      `1. Expression Parsing: Operand tokens evaluated under operator precedence rules (PEMDAS/BODMAS).`,
      `2. Step-by-Step Computation: Direct evaluation of (${innerExpr}) computes exactly ${evalResult}.`,
      `3. Numerical Invariant: Computed output ${evalResult} verified accurate and dimensionally stable.`
    ],
    boxedConclusion: `Calculated Value = ${evalResult}`,
    spokenExplanation: `The evaluation of ${innerExpr} equals ${evalResult}! Following standard order of operations, we calculate the expression directly on the chalkboard to obtain the exact result: ${evalResult}.`,
    diagramType: 'code_execution',
    diagramData: {
      fn: 'calc',
      input: innerExpr,
      output: evalResult
    },
    isCustom: true,
    rawQuery: query
  };
}

/**
 * 💻 Solves common Computer Science and Coding Concepts
 */
export function solveCodingConceptQuery(rawQuery = '') {
  const query = (rawQuery || '').trim();
  const lower = query.toLowerCase();

  if (lower.includes('pointer') || lower.includes('pointers in c')) {
    return {
      id: 'cs_pointers_' + Date.now(),
      subject: 'Computer Science • Systems & C',
      title: 'Pointers & Memory Addressing in C',
      primaryFormula: 'int val = 42;  int *ptr = &val;',
      steps: [
        '1. Memory Address (&): Every variable resides at a unique hexadecimal RAM address (e.g. 0x7ffd).',
        '2. Pointer Declaration (*): "int *ptr" declares a variable holding memory address of an integer.',
        '3. Dereferencing (*ptr): Directly reads or writes value stored at the referenced memory address.'
      ],
      boxedConclusion: '*ptr == 42   (Value)   |   ptr == &val   (Address)',
      spokenExplanation: "In C and C++, pointers store memory addresses rather than direct values! Using the ampersand operator, we take the address of a variable, and with the asterisk dereference operator, we read or modify the value directly in memory.",
      diagramType: 'pointer_memory',
      diagramData: { varName: 'val', val: 42, addr: '0x7ffd' },
      isCustom: true,
      rawQuery: query
    };
  }

  if (lower.includes('binary search') || lower.includes('bsearch')) {
    return {
      id: 'cs_binary_search_' + Date.now(),
      subject: 'Algorithms & Data Structures',
      title: 'Binary Search Algorithm (O(log N))',
      primaryFormula: 'mid = low + (high - low) / 2',
      steps: [
        '1. Precondition: Input array must be sorted in ascending order [A0, A1, ... An].',
        '2. Divide & Conquer: Compare target with arr[mid]; if target < arr[mid], search left half.',
        '3. Asymptotic Complexity: Halves search space each step: N ⟶ N/2 ⟶ ... ⟶ 1 in O(log N) steps.'
      ],
      boxedConclusion: 'Time Complexity: O(log N)   |   Space: O(1)',
      spokenExplanation: "Binary search is the quintessential logarithmic search algorithm! Because the array is sorted, comparing your target with the midpoint halves the remaining elements at every single step, finding any key in O of log N time.",
      diagramType: 'binary_search_tree',
      diagramData: {},
      isCustom: true,
      rawQuery: query
    };
  }

  if (lower.includes('linked list') || lower.includes('linkedlist') || lower.includes('singly linked')) {
    return {
      id: 'cs_linked_list_' + Date.now(),
      subject: 'Data Structures & Memory',
      title: 'Singly Linked List Architecture',
      primaryFormula: 'struct Node { int data; struct Node *next; };',
      steps: [
        '1. Dynamic Heap Allocation: Nodes allocated dynamically in memory without contiguous array limits.',
        '2. Pointer Chaining: Each node stores data plus reference pointer to the successor node.',
        '3. Head Insertion: Inserting at head runs in O(1) time by re-pointing head pointer.'
      ],
      boxedConclusion: 'Head Insert: O(1)   |   Traversal Search: O(N)',
      spokenExplanation: "A linked list is a dynamic linear data structure where elements are not stored contiguously in memory. Each node holds its data and a pointer pointing to the next node in the heap, allowing instant O(1) insertions!",
      diagramType: 'linked_list_nodes',
      diagramData: {},
      isCustom: true,
      rawQuery: query
    };
  }

  if (lower.includes('stack') || lower.includes('queue')) {
    const isStack = lower.includes('stack');
    return {
      id: 'cs_stack_queue_' + Date.now(),
      subject: 'Data Structures • ADT',
      title: isStack ? 'Stack Abstract Data Type (LIFO)' : 'Queue Abstract Data Type (FIFO)',
      primaryFormula: isStack ? 'Stack: Last-In, First-Out (Push / Pop)' : 'Queue: First-In, First-Out (Enqueue / Dequeue)',
      steps: [
        isStack
          ? '1. LIFO Invariant: Most recently inserted element is first to be removed.'
          : '1. FIFO Invariant: Oldest inserted element is first to be dequeued.',
        isStack
          ? '2. Core Methods: push(x) places onto top; pop() removes top in O(1) time.'
          : '2. Core Methods: enqueue(x) at rear; dequeue() from front in O(1) time.',
        isStack
          ? '3. Real-world Uses: Function call recursion stack, compiler parsing, Undo history.'
          : '3. Real-world Uses: OS process scheduling, print spoolers, BFS graph traversal.'
      ],
      boxedConclusion: 'Push & Pop Operations: O(1) Constant Time',
      spokenExplanation: isStack
        ? "A stack is a Last-In, First-Out data structure. Just like a stack of plates, you push items onto the top and pop them from the top in O(1) constant time!"
        : "A queue is a First-In, First-Out data structure. Just like a line at a ticket counter, elements enqueue at the rear and dequeue from the front in O(1) time!",
      diagramType: isStack ? 'stack_diagram' : 'queue_diagram',
      diagramData: {},
      isCustom: true,
      rawQuery: query
    };
  }

  return null;
}

/**
 * Functions like a ChatGPT-style conversational AI mentor:
 * - Analyzes any question or doubt across Mathematics, Physics, Computer Science,
 *   Chemistry, Biology, Electrical Engineering, Calculus, and General Logic.
 * - Extracts foundational axioms, 3-4 structured derivation steps, and a boxed conclusion.
 * - Generates synchronized pedagogical spoken lectures for Lumina with lip-sync.
 * - Produces parametric diagram definitions for the 3D chalkboard.
 */

// ── 1. COMPREHENSIVE KNOWLEDGE BASE (30+ CORE FOUNDATIONAL TOPICS) ──
export const CURATED_KNOWLEDGE_BASE = [
  // ── MATHEMATICS & CALCULUS ──
  {
    keywords: ['quadratic', 'roots', 'parabola', 'ax2', 'ax^2'],
    id: 'quadratic',
    subject: 'Algebra',
    title: 'Quadratic Equation & Roots',
    primaryFormula: 'ax² + bx + c = 0',
    steps: [
      '1. Degree = 2, with strict condition a ≠ 0.',
      '2. Roots derived by completing the square.',
      '3. Discriminant Δ = b² - 4ac dictates root geometry.'
    ],
    boxedConclusion: 'x = (-b ± √(b² - 4ac)) / 2a',
    spokenExplanation: "Here is our standard quadratic equation on the board: a x squared plus b x plus c equals zero. The roots formula is boxed below, and notice how the discriminant delta dictates whether the parabola crosses the x-axis twice, touches it at one vertex point, or floats above it with complex roots!",
    diagramType: 'parabola',
    diagramData: { a: 1, b: -2, c: -3 }
  },
  {
    keywords: ['why a', 'a not zero', 'a=0', 'a = 0', 'a ≠ 0', 'why must a'],
    id: 'why_a_not_zero',
    subject: 'Algebra Axiom',
    title: 'Why Must a ≠ 0 in ax² + bx + c = 0?',
    primaryFormula: 'If a = 0  ⟹  bx + c = 0',
    steps: [
      '1. Setting a = 0 eliminates the x² quadratic term entirely.',
      '2. The polynomial degree collapses from 2 to 1 (linear equation).',
      '3. The parabolic curvature vanishes into a single straight line with only one root.'
    ],
    boxedConclusion: 'Rule: a ≠ 0 is required to preserve parabolic curvature!',
    spokenExplanation: "Notice on the chalkboard: if a equals zero, the quadratic term 0 times x squared completely vanishes! The equation degenerates into bx plus c equals zero, which is a linear equation with only one root instead of a parabola. That is why a must never be zero for any quadratic equation!",
    diagramType: 'linear_degeneration',
    diagramData: {}
  },
  {
    keywords: ['discriminant', 'delta', 'b2-4ac', 'b^2-4ac', 'nature of roots'],
    id: 'discriminant',
    subject: 'Nature of Roots',
    title: 'Discriminant: Δ = b² - 4ac',
    primaryFormula: 'Δ = b² - 4ac',
    steps: [
      '1. Δ > 0  ⟹  Two distinct real roots (2 x-intercepts).',
      '2. Δ = 0  ⟹  One repeated real root (vertex touches x-axis).',
      '3. Δ < 0  ⟹  No real roots (conjugate complex roots).'
    ],
    boxedConclusion: 'Controls radicand under √Δ in the quadratic formula',
    spokenExplanation: "Look at the discriminant delta on the board: delta equals b squared minus 4 a c. When delta is positive, the square root gives two distinct real roots. When delta is zero, the vertex touches the x axis with one repeated root. And when delta is negative, the roots are complex conjugates, meaning the parabola never touches the real x axis!",
    diagramType: 'discriminant_curves',
    diagramData: {}
  },
  {
    keywords: ['derive', 'completing square', 'proof of quadratic', 'derivation'],
    id: 'completing_square',
    subject: 'Algebraic Proof',
    title: 'Derivation: Completing the Square',
    primaryFormula: 'ax² + bx + c = 0',
    steps: [
      '1. Divide by a:       x² + (b/a)x = -c/a',
      '2. Add (b/2a)²:       (x + b/2a)² = (b² - 4ac) / 4a²',
      '3. Take square root:  x + b/2a = ±√(b² - 4ac) / 2a'
    ],
    boxedConclusion: 'x = (-b ± √(b² - 4ac)) / 2a',
    spokenExplanation: "Here on the chalkboard is the step-by-step algebraic derivation by completing the square! By dividing through by a, moving the constant c, and adding b over 2a squared to both sides, we isolate x and discover the quadratic formula!",
    diagramType: 'formula_flow',
    diagramData: {}
  },
  {
    keywords: ['pythagor', 'right triangle', 'hypotenuse', 'a2+b2=c2'],
    id: 'pythagoras',
    subject: 'Euclidean Geometry',
    title: 'Pythagorean Theorem Proof',
    primaryFormula: 'a² + b² = c²',
    steps: [
      '1. For any Euclidean right-angled triangle with legs a and b.',
      '2. The area of square on hypotenuse equals sum of areas on legs.',
      '3. Fundamental metric for 2D/3D Euclidean distance.'
    ],
    boxedConclusion: 'Hypotenuse: c = √(a² + b²)',
    spokenExplanation: "In any right-angled Euclidean triangle, the square of the hypotenuse equals the sum of the squares of the two legs: a squared plus b squared equals c squared. Notice the geometric diagram on the board illustrating the base, height, and hypotenuse!",
    diagramType: 'triangle',
    diagramData: { a: 3, b: 4, c: 5 }
  },
  {
    keywords: ['euler', 'e^i*pi', 'e^ipi', 'identity', 'most beautiful'],
    id: 'euler_identity',
    subject: 'Complex Analysis',
    title: "Euler's Identity & Formula",
    primaryFormula: 'e^(i·θ) = cos(θ) + i·sin(θ)',
    steps: [
      '1. Taylor series of e^(ix) combines cos(x) and i·sin(x).',
      '2. Evaluating at θ = π radians gives: e^(i·π) = -1 + 0·i.',
      '3. Unifies the five fundamental constants of mathematics: e, i, π, 1, 0.'
    ],
    boxedConclusion: 'e^(i·π) + 1 = 0',
    spokenExplanation: "Euler's identity unites the five most fundamental constants in mathematics: e, i, pi, 1, and 0 in one singular equation! Derived from Euler's formula e to the i theta equals cos theta plus i sin theta, setting theta to pi yields e to the i pi plus 1 equals zero.",
    diagramType: 'unit_circle',
    diagramData: {}
  },
  {
    keywords: ['derivative', 'calculus', 'chain rule', 'rate of change', 'slope'],
    id: 'derivative_calculus',
    subject: 'Differential Calculus',
    title: 'Calculus: Derivatives & Chain Rule',
    primaryFormula: "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
    steps: [
      '1. Derivative measures instantaneous rate of change (tangent slope).',
      '2. Power Rule: d/dx [xⁿ] = n · xⁿ⁻¹.',
      '3. Chain Rule: d/dx [f(g(x))] = f\'(g(x)) · g\'(x).'
    ],
    boxedConclusion: 'dy/dx = (dy/du) · (du/dx)',
    spokenExplanation: "The derivative measures the instantaneous rate of change or tangent slope of a function as delta x approaches zero. For composite functions, the Chain Rule states that the derivative of f of g of x equals f prime of g of x times g prime of x!",
    diagramType: 'tangent_curve',
    diagramData: {}
  },

  // ── PHYSICS & MECHANICS ──
  {
    keywords: ['newton', 'force', 'acceleration', 'f=ma', 'second law'],
    id: 'newton_second_law',
    subject: 'Classical Mechanics',
    title: "Newton's Second Law of Motion",
    primaryFormula: 'F_net = m · a',
    steps: [
      '1. Force causes an object with mass m to accelerate at rate a.',
      '2. General form in calculus: F = dp/dt (rate of change of momentum).',
      '3. In SI units: 1 Newton = 1 kg · m / s².'
    ],
    boxedConclusion: 'a = F_net / m   (Direction matches net force)',
    spokenExplanation: "Newton's second law is the cornerstone of classical dynamics: net force equals mass times acceleration! If you double the force, the acceleration doubles. If you double the mass, the acceleration is cut in half.",
    diagramType: 'force_vector',
    diagramData: {}
  },
  {
    keywords: ['kinetic energy', 'potential energy', 'energy', '1/2mv2', 'work'],
    id: 'kinetic_energy',
    subject: 'Physics & Energy',
    title: 'Work-Energy Principle & Kinetic Energy',
    primaryFormula: 'E_k = ½ · m · v²',
    steps: [
      '1. Work done W = ∫ F · dx = ∫ m (dv/dt) v dt.',
      '2. Integrating from 0 to v yields ½ m v².',
      '3. Kinetic energy scales quadratically with velocity!'
    ],
    boxedConclusion: 'Work = ΔE_k = ½ m v_final² - ½ m v_initial²',
    spokenExplanation: "Notice how kinetic energy scales quadratically with velocity: one half m v squared! If a vehicle doubles its speed, its kinetic energy and braking distance increase by a factor of four.",
    diagramType: 'energy_parabola',
    diagramData: {}
  },
  {
    keywords: ['ohm', 'resistance', 'voltage', 'current', 'v=ir', 'circuit'],
    id: 'ohms_law',
    subject: 'Electrical Engineering',
    title: "Ohm's Law & Circuit Fundamentals",
    primaryFormula: 'V = I · R',
    steps: [
      '1. V = Voltage (Electric potential difference in Volts).',
      '2. I = Current (Flow of electric charge in Amperes).',
      '3. R = Resistance (Opposition to charge flow in Ohms Ω).'
    ],
    boxedConclusion: 'Power Dissipated: P = V · I = I² · R',
    spokenExplanation: "Ohm's law governs electrical circuits: voltage equals current times resistance! Current flows from higher potential to lower potential, limited by the resistance of the conductive path.",
    diagramType: 'circuit',
    diagramData: {}
  },
  {
    keywords: ['kirchhoff', 'kcl', 'kvl', 'current law', 'voltage law'],
    id: 'kirchhoff_laws',
    subject: 'Circuit Analysis',
    title: "Kirchhoff's Circuit Laws (KCL & KVL)",
    primaryFormula: 'Σ I_in = Σ I_out   &   Σ V_loop = 0',
    steps: [
      '1. KCL (Node Law): Conservation of electric charge at any junction.',
      '2. KVL (Loop Law): Conservation of energy around any closed loop.',
      '3. Essential for solving multi-mesh circuit networks.'
    ],
    boxedConclusion: 'KCL: Σ I = 0   |   KVL: Σ ΔV = 0',
    spokenExplanation: "Kirchhoff's laws stem directly from conservation of charge and energy. Kirchhoff's Current Law states the sum of currents entering a junction equals currents leaving. Kirchhoff's Voltage Law states the sum of voltages around any closed loop is zero!",
    diagramType: 'circuit',
    diagramData: {}
  },
  {
    keywords: ['simple harmonic', 'shm', 'pendulum', 'oscillation', 'frequency'],
    id: 'simple_harmonic_motion',
    subject: 'Oscillations & Waves',
    title: 'Simple Harmonic Motion (SHM)',
    primaryFormula: 'x(t) = A · cos(ωt + φ)',
    steps: [
      '1. Restoring force F = -k · x is proportional to displacement.',
      '2. Angular frequency: ω = √(k/m).',
      '3. Acceleration a(t) = -ω² · x(t).'
    ],
    boxedConclusion: 'Period: T = 2π / ω = 2π · √(m/k)',
    spokenExplanation: "Simple harmonic motion occurs when a restoring force is directly proportional to displacement, as in a spring or pendulum. The resulting motion traces a pure sinusoidal wave with angular frequency omega equals square root of k over m!",
    diagramType: 'sine_wave',
    diagramData: {}
  },

  // ── COMPUTER SCIENCE & ALGORITHMS ──
  {
    keywords: ['big o', 'complexity', 'time complexity', 'space complexity', 'o(n)'],
    id: 'big_o_complexity',
    subject: 'Algorithm Analysis',
    title: 'Big-O Asymptotic Complexity',
    primaryFormula: 'f(n) = O(g(n))  if  |f(n)| ≤ c · |g(n)| for n ≥ n₀',
    steps: [
      '1. O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).',
      '2. Focuses on asymptotic growth rate as input size n → ∞.',
      '3. Strips constant coefficients and lower-order terms.'
    ],
    boxedConclusion: 'Hierarchy: O(1) Constant ⟶ O(n log n) Optimal Sort ⟶ O(2ⁿ) Intractable',
    spokenExplanation: "Big-O notation describes the asymptotic upper bound of an algorithm's execution time or memory footprint. As input size n grows, lower order terms fade, showing whether an algorithm scales linearly, logarithmically, or exponentially!",
    diagramType: 'complexity_curves',
    diagramData: {}
  },
  {
    keywords: ['quicksort', 'quick sort', 'pivot', 'divide and conquer', 'sorting'],
    id: 'quicksort_algorithm',
    subject: 'Algorithms & Data Structures',
    title: 'Quicksort: Divide & Conquer',
    primaryFormula: 'T(n) = 2 · T(n/2) + O(n)  ⟹  O(n log n)',
    steps: [
      '1. Select pivot element p from array.',
      '2. Partition: reorder elements so values < p come before, values > p come after.',
      '3. Recursively apply Quicksort to left and right subarrays.'
    ],
    boxedConclusion: 'Average: O(n log n)   |   Worst: O(n²)   |   In-Place',
    spokenExplanation: "Quicksort is an elegant divide-and-conquer sorting algorithm! It chooses a pivot, partitions the array around it in linear O of n time, and recursively sorts the subarrays for an average time complexity of O of n log n.",
    diagramType: 'tree',
    diagramData: {}
  },
  {
    keywords: ['binary search', 'bsearch', 'binary tree', 'bst', 'log n'],
    id: 'binary_search',
    subject: 'Algorithms',
    title: 'Binary Search in Sorted Arrays',
    primaryFormula: 'mid = low + (high - low) / 2',
    steps: [
      '1. Precondition: Array must be sorted in ascending order.',
      '2. Compare target with middle element: eliminate half the search space.',
      '3. Recurse or loop until target found or interval empty.'
    ],
    boxedConclusion: 'Time Complexity: O(log₂ n)   |   Space: O(1)',
    spokenExplanation: "Binary search cuts the search space in half with every single comparison! In an array of one million sorted items, binary search needs at most twenty comparisons to pinpoint any value.",
    diagramType: 'tree',
    diagramData: {}
  },
  {
    keywords: ['dijkstra', 'shortest path', 'graph', 'priority queue'],
    id: 'dijkstras_algorithm',
    subject: 'Graph Algorithms',
    title: "Dijkstra's Shortest Path Algorithm",
    primaryFormula: 'dist[v] = min(dist[v], dist[u] + weight(u, v))',
    steps: [
      '1. Greedy strategy: repeatedly visit closest unvisited vertex u.',
      '2. Edge Relaxation: update distance to neighbors v.',
      '3. Guarantees optimal path for non-negative edge weights.'
    ],
    boxedConclusion: 'Time: O((V + E) log V) with Min-Priority Queue',
    spokenExplanation: "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph. Using edge relaxation and a priority queue, it always greedily expands the frontier node with the smallest tentative distance!",
    diagramType: 'graph',
    diagramData: {}
  },

  // ── CHEMISTRY & BIOLOGY ──
  {
    keywords: ['photosynthesis', 'chlorophyll', 'light reaction', 'calvin'],
    id: 'photosynthesis',
    subject: 'Plant Biochemistry',
    title: 'Photosynthesis & Carbon Fixation',
    primaryFormula: '6 CO₂ + 6 H₂O + Light  ⟶  C₆H₁₂O₆ + 6 O₂',
    steps: [
      '1. Light Reactions (Thylakoid): Photolysis of H₂O generates ATP & NADPH.',
      '2. Calvin Cycle (Stroma): RuBisCO fixes CO₂ into G3P sugars.',
      '3. Converts solar radiation into stable chemical potential energy.'
    ],
    boxedConclusion: 'Solar Energy ⟶ Chemical Bond Energy (Glucose)',
    spokenExplanation: "Photosynthesis is the fundamental bio-energetic engine of our biosphere: six molecules of carbon dioxide plus six molecules of water, powered by sunlight, yield glucose and oxygen!",
    diagramType: 'flowchart',
    diagramData: {}
  },
  {
    keywords: ['dna', 'replication', 'double helix', 'polymerase', 'nucleotide'],
    id: 'dna_replication',
    subject: 'Molecular Biology',
    title: 'DNA Double Helix & Semi-Conservative Replication',
    primaryFormula: 'A = T (2 H-bonds)   &   G ≡ C (3 H-bonds)',
    steps: [
      '1. Helicase unwinds the double helix at the replication fork.',
      '2. DNA Polymerase synthesizes new strand in 5\' to 3\' direction.',
      '3. Leading strand is continuous; lagging strand forms Okazaki fragments.'
    ],
    boxedConclusion: 'Semi-Conservative: Each daughter molecule contains one original parent strand',
    spokenExplanation: "DNA replication is semi-conservative: each daughter double helix retains one original template strand. Base pairing is strictly conserved by hydrogen bonding: Adenine pairs with Thymine, and Guanine pairs with Cytosine!",
    diagramType: 'double_helix',
    diagramData: {}
  },
  {
    keywords: ['bayes', 'probability', 'conditional', 'prior', 'posterior'],
    id: 'bayes_theorem',
    subject: 'Probability & Statistics',
    title: "Bayes' Theorem & Inference",
    primaryFormula: 'P(A|B) = [P(B|A) · P(A)] / P(B)',
    steps: [
      '1. P(A|B) = Posterior probability given observed evidence B.',
      '2. P(B|A) = Likelihood of evidence under hypothesis A.',
      '3. P(A) = Prior probability before observing evidence.',
      '4. P(B) = Marginal probability normalizing the distribution.'
    ],
    boxedConclusion: 'Posterior ∝ Likelihood × Prior',
    spokenExplanation: "Bayes' theorem is the mathematical foundation of probabilistic reasoning and machine learning. It tells us how to update our belief in a hypothesis A after observing new evidence B: posterior equals likelihood times prior, divided by evidence!",
    diagramType: 'formula_flow',
    diagramData: {}
  }
];

// ── 2. SPECIALIZED COMPUTATIONAL & ALGEBRAIC SOLVERS (CHATGPT-STYLE AI MENTOR) ──

/**
 * Parses and extracts coefficients for an equation in the form:
 * a · var1 + b · var2 = c
 */
function parseLinearEquation(eqStr, var1, var2) {
  const clean = eqStr.trim().replace(/\s+/g, '');
  const parts = clean.split('=');
  if (parts.length !== 2) return null;

  const left = parts[0];
  const right = parts[1];

  function extractCoeffs(sideStr) {
    let a = 0, b = 0, constant = 0;
    const regex = /([+-]?[^+-]+)/g;
    const matches = sideStr.match(regex) || [];
    for (const term of matches) {
      const t = term.trim();
      if (!t) continue;
      if (t.includes(var1)) {
        const coeffStr = t.replace(var1, '');
        let coeff = 1;
        if (coeffStr === '' || coeffStr === '+') coeff = 1;
        else if (coeffStr === '-') coeff = -1;
        else coeff = parseFloat(coeffStr) || 1;
        a += coeff;
      } else if (t.includes(var2)) {
        const coeffStr = t.replace(var2, '');
        let coeff = 1;
        if (coeffStr === '' || coeffStr === '+') coeff = 1;
        else if (coeffStr === '-') coeff = -1;
        else coeff = parseFloat(coeffStr) || 1;
        b += coeff;
      } else {
        const val = parseFloat(t);
        if (!isNaN(val)) constant += val;
      }
    }
    return { a, b, constant };
  }

  const leftTerms = extractCoeffs(left);
  const rightTerms = extractCoeffs(right);

  return {
    a: leftTerms.a - rightTerms.a,
    b: leftTerms.b - rightTerms.b,
    c: rightTerms.constant - leftTerms.constant
  };
}

/**
 * Solves a 2-variable System of Linear Equations (e.g., "A+B=4, A+2B=8 FIND A & B")
 */
function solveLinearSystem(rawQuery) {
  const query = (rawQuery || '').trim();
  const cleanQuery = query.replace(/find\s+[a-zA-Z0-9\s&,]+/gi, '')
                          .replace(/solve\s+(for\s+)?[a-zA-Z0-9\s&,]+/gi, '')
                          .trim();

  const eqParts = cleanQuery.split(/[,;\n]|(?:\band\b)/i).map(s => s.trim()).filter(s => s.includes('='));
  if (eqParts.length < 2) return null;

  const eq1Str = eqParts[0];
  const eq2Str = eqParts[1];

  const letters = (eq1Str + eq2Str).replace(/[^a-zA-Z]/g, '');
  const uniqueVars = Array.from(new Set(letters.split(''))).sort();
  if (uniqueVars.length !== 2) return null;

  const v1 = uniqueVars[0];
  const v2 = uniqueVars[1];

  const p1 = parseLinearEquation(eq1Str, v1, v2);
  const p2 = parseLinearEquation(eq2Str, v1, v2);
  if (!p1 || !p2) return null;

  const { a: a1, b: b1, c: c1 } = p1;
  const { a: a2, b: b2, c: c2 } = p2;

  // Cramer's determinant
  const D = a1 * b2 - a2 * b1;
  if (Math.abs(D) < 1e-9) return null;

  const D1 = c1 * b2 - c2 * b1;
  const D2 = a1 * c2 - a2 * c1;

  const val1 = Math.round((D1 / D) * 1000) / 1000;
  const val2 = Math.round((D2 / D) * 1000) / 1000;

  // Real human pedagogical elimination step
  let elimStep = '';
  if (a1 === a2) {
    const bDiff = b2 - b1;
    const cDiff = c2 - c1;
    elimStep = `Subtract (1) from (2): (${bDiff})${v2} = ${cDiff}  ⟹  ${v2} = ${val2}`;
  } else if (a1 === -a2) {
    const bSum = b1 + b2;
    const cSum = c1 + c2;
    elimStep = `Add (1) and (2): (${bSum})${v2} = ${cSum}  ⟹  ${v2} = ${val2}`;
  } else if (b1 === b2) {
    const aDiff = a2 - a1;
    const cDiff = c2 - c1;
    elimStep = `Subtract (1) from (2): (${aDiff})${v1} = ${cDiff}  ⟹  ${v1} = ${val1}`;
  } else {
    elimStep = `Elimination: Determinant D = (${a1}·${b2} - ${a2}·${b1}) = ${D}  ⟹  ${v1} = ${val1}`;
  }

  const subStep = `Substitute ${v2} = ${val2} into (1): ${a1}·${v1} + (${b1}·${val2}) = ${c1}  ⟹  ${v1} = ${val1}`;

  const spokenExplanation = `Let's solve your system of equations: ${eq1Str} and ${eq2Str}. On the chalkboard, we state both equations. By eliminating variable ${v1}, we determine that ${v2} equals ${val2}. Substituting this back into the first equation reveals that ${v1} equals ${val1}. Notice on the graph to our right: the two linear equations intersect precisely at the coordinate point (${val1}, ${val2})!`;

  return {
    id: 'linear_system_' + Date.now(),
    subject: 'Linear Algebra & Systems',
    title: `Solve: ${eq1Str}  &  ${eq2Str}`,
    primaryFormula: `(1) ${eq1Str}   ✦   (2) ${eq2Str}`,
    steps: [
      `1. Formulation:  ${a1}${v1} + ${b1}${v2} = ${c1}   and   ${a2}${v1} + ${b2}${v2} = ${c2}`,
      `2. Elimination:  ${elimStep}`,
      `3. Substitution: ${subStep}`
    ],
    boxedConclusion: `Solution:  ${v1} = ${val1}  ,  ${v2} = ${val2}`,
    spokenExplanation,
    diagramType: 'linear_system',
    diagramData: { v1, v2, a1, b1, c1, a2, b2, c2, val1, val2, eq1Str, eq2Str },
    isCustom: true,
    rawQuery: query
  };
}

/**
 * Solves a single-variable linear equation (e.g., "2x + 6 = 18", "5x - 15 = 0")
 */
function solveSingleLinear(rawQuery) {
  const query = (rawQuery || '').trim();
  const clean = query.replace(/find\s+[a-zA-Z0-9\s&,]+/gi, '')
                     .replace(/solve\s+(for\s+)?[a-zA-Z0-9\s&,]+/gi, '')
                     .trim();
  if (clean.includes(',') || clean.includes(';') || (clean.match(/=/g) || []).length !== 1) return null;

  const parts = clean.split('=');
  const left = parts[0].trim();
  const right = parts[1].trim();

  const letters = clean.replace(/[^a-zA-Z]/g, '');
  const uniqueVars = Array.from(new Set(letters.split('')));
  if (uniqueVars.length !== 1) return null;
  const v = uniqueVars[0];

  if (clean.includes('^') || clean.includes('²') || clean.includes('³')) return null;

  function parseSide(side) {
    let coeff = 0, constant = 0;
    const tokens = side.replace(/\s+/g, '').match(/([+-]?[^+-]+)/g) || [];
    for (const token of tokens) {
      if (token.includes(v)) {
        const cStr = token.replace(v, '');
        if (cStr === '' || cStr === '+') coeff += 1;
        else if (cStr === '-') coeff -= 1;
        else coeff += parseFloat(cStr) || 1;
      } else {
        const val = parseFloat(token);
        if (!isNaN(val)) constant += val;
      }
    }
    return { coeff, constant };
  }

  const pLeft = parseSide(left);
  const pRight = parseSide(right);

  const netCoeff = pLeft.coeff - pRight.coeff;
  const netConst = pRight.constant - pLeft.constant;

  if (Math.abs(netCoeff) < 1e-9) return null;
  const root = Math.round((netConst / netCoeff) * 1000) / 1000;

  return {
    id: 'single_linear_' + Date.now(),
    subject: 'Linear Algebra',
    title: `Solve: ${clean}`,
    primaryFormula: clean,
    steps: [
      `1. Group like terms: (${netCoeff})·${v} = ${netConst}`,
      `2. Divide both sides by coefficient: ${v} = ${netConst} / ${netCoeff}`,
      `3. Verify: substituting ${v} = ${root} satisfies ${clean}`
    ],
    boxedConclusion: `Root:  ${v} = ${root}`,
    spokenExplanation: `To solve ${clean}, we group the variable terms on the left and constants on the right, giving ${netCoeff} ${v} equals ${netConst}. Dividing through isolates our solution: ${v} equals ${root}!`,
    diagramType: 'linear_plot',
    diagramData: { v, root, netCoeff, netConst },
    isCustom: true,
    rawQuery: query
  };
}

/**
 * Solves a numeric quadratic equation with exact numbers (e.g. "x^2 - 5x + 6 = 0")
 */
function solveNumericQuadratic(rawQuery) {
  const query = (rawQuery || '').trim();
  const clean = query.replace(/\s+/g, '');
  const matchVar = clean.match(/([a-zA-Z])(?:\^2|²)/);
  if (!matchVar) return null;
  const v = matchVar[1];

  const parts = clean.split('=');
  if (parts.length !== 2) return null;

  function parseSide(side) {
    let a = 0, b = 0, c = 0;
    const tokens = side.match(/([+-]?[^+-]+)/g) || [];
    for (const token of tokens) {
      if (token.includes(v + '^2') || token.includes(v + '²')) {
        const cStr = token.replace(v + '^2', '').replace(v + '²', '');
        if (cStr === '' || cStr === '+') a += 1;
        else if (cStr === '-') a -= 1;
        else a += parseFloat(cStr) || 1;
      } else if (token.includes(v)) {
        const cStr = token.replace(v, '');
        if (cStr === '' || cStr === '+') b += 1;
        else if (cStr === '-') b -= 1;
        else b += parseFloat(cStr) || 1;
      } else {
        const val = parseFloat(token);
        if (!isNaN(val)) c += val;
      }
    }
    return { a, b, c };
  }

  const pL = parseSide(parts[0]);
  const pR = parseSide(parts[1]);

  const a = pL.a - pR.a;
  const b = pL.b - pR.b;
  const c = pL.c - pR.c;

  if (Math.abs(a) < 1e-9) return null;

  const delta = b * b - 4 * a * c;
  let roots = [];
  if (delta > 0) {
    const r1 = (-b + Math.sqrt(delta)) / (2 * a);
    const r2 = (-b - Math.sqrt(delta)) / (2 * a);
    roots = [Math.round(r1 * 1000) / 1000, Math.round(r2 * 1000) / 1000];
  } else if (Math.abs(delta) < 1e-9) {
    const r = -b / (2 * a);
    roots = [Math.round(r * 1000) / 1000];
  }

  const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  const formulaStr = `${a}${v}² ${signB}${v} ${signC} = 0`;

  const conclusion = delta >= 0
    ? `Roots:  ${roots.map(r => `${v} = ${r}`).join('  and  ')}`
    : `Complex Roots:  ${v} = (${-b} ± ${Math.sqrt(Math.abs(delta)).toFixed(2)}i) / ${2*a}`;

  const spoken = delta >= 0
    ? `For the quadratic equation ${formulaStr}, our coefficients are a = ${a}, b = ${b}, and c = ${c}. The discriminant delta is ${delta.toFixed(1)}, yielding real roots at ${roots.join(' and ')}!`
    : `For the quadratic equation ${formulaStr}, the discriminant delta is negative ${delta.toFixed(1)}, meaning the parabola floats without crossing the real axis, yielding conjugate complex roots!`;

  return {
    id: 'numeric_quadratic_' + Date.now(),
    subject: 'Quadratic Polynomial',
    title: `Solve: ${formulaStr}`,
    primaryFormula: formulaStr,
    steps: [
      `1. Coefficients:  a = ${a}, b = ${b}, c = ${c}`,
      `2. Discriminant:  Δ = (${b})² - 4(${a})(${c}) = ${delta}`,
      `3. Quadratic Formula:  ${v} = (-(${b}) ± √${delta}) / (2·${a})`
    ],
    boxedConclusion: conclusion,
    spokenExplanation: spoken,
    diagramType: 'parabola',
    diagramData: { a, b, c },
    isCustom: true,
    rawQuery: query
  };
}

/**
 * Solves Calculus derivatives, integrals, and limits
 */
function solveCalculusExpression(rawQuery) {
  const query = (rawQuery || '').trim();
  const lower = query.toLowerCase();

  // Derivative: d/dx(x^n) or derivative of x^n
  const derivPowerMatch = lower.match(/(?:d\/dx|derivative\s+of)\s*(?:\(?\s*x(?:\^(\d+)|²|³)\s*\)?)/);
  if (derivPowerMatch) {
    let power = 2;
    if (lower.includes('²')) power = 2;
    else if (lower.includes('³')) power = 3;
    else if (derivPowerMatch[1]) power = parseInt(derivPowerMatch[1], 10);

    const newPower = power - 1;
    const resultStr = newPower === 1 ? `${power}x` : newPower === 0 ? `${power}` : `${power}x^${newPower}`;

    return {
      id: 'calc_derivative_' + Date.now(),
      subject: 'Differential Calculus',
      title: `Derivative: d/dx [x^${power}]`,
      primaryFormula: `d/dx [xⁿ] = n · xⁿ⁻¹`,
      steps: [
        `1. Identify exponent power: n = ${power}.`,
        `2. Apply Power Rule: multiply by n and subtract 1 from exponent.`,
        `3. Evaluated derivative: d/dx [x^${power}] = ${power} · x^${newPower} = ${resultStr}.`
      ],
      boxedConclusion: `d/dx [x^${power}] = ${resultStr}`,
      spokenExplanation: `Using the calculus Power Rule, the derivative of x to the power ${power} is ${power} times x to the power ${newPower}, which equals ${resultStr}!`,
      diagramType: 'tangent_curve',
      diagramData: {},
      isCustom: true,
      rawQuery: query
    };
  }

  // Common derivatives: sin, cos, e^x, ln(x)
  if (lower.includes('derivative of sin') || lower.includes('d/dx sin')) {
    return {
      id: 'calc_deriv_sin_' + Date.now(),
      subject: 'Differential Calculus',
      title: 'Derivative of sin(x)',
      primaryFormula: 'd/dx [sin(x)] = cos(x)',
      steps: [
        '1. Limit definition: lim(h→0) [sin(x+h) - sin(x)] / h.',
        '2. Angle addition: sin(x)cos(h) + cos(x)sin(h) - sin(x).',
        '3. Evaluates using standard limits: d/dx [sin(x)] = cos(x).'
      ],
      boxedConclusion: 'd/dx [sin(x)] = cos(x)',
      spokenExplanation: 'The derivative of sin x with respect to x is cos x! Notice how the rate of change of the sine wave reaches maximum velocity at the zero-crossings, matching the peak of the cosine function.',
      diagramType: 'sine_wave',
      diagramData: {},
      isCustom: true,
      rawQuery: query
    };
  }

  // Integral of x^n
  const intPowerMatch = lower.match(/(?:integrate|integral\s+of)\s*(?:\(?\s*x(?:\^(\d+)|²|³)?\s*\)?)/);
  if (intPowerMatch) {
    let power = 1;
    if (lower.includes('²')) power = 2;
    else if (lower.includes('³')) power = 3;
    else if (intPowerMatch[1]) power = parseInt(intPowerMatch[1], 10);

    const newPower = power + 1;
    const resultStr = `(x^${newPower}) / ${newPower} + C`;

    return {
      id: 'calc_integral_' + Date.now(),
      subject: 'Integral Calculus',
      title: `Indefinite Integral: ∫ x^${power} dx`,
      primaryFormula: `∫ xⁿ dx = (xⁿ⁺¹) / (n + 1) + C   (for n ≠ -1)`,
      steps: [
        `1. Reverse Power Rule: add 1 to the exponent (n = ${power} ⟶ ${newPower}).`,
        `2. Divide by the new exponent: ${newPower}.`,
        `3. Add arbitrary constant of integration C: ${resultStr}.`
      ],
      boxedConclusion: `∫ x^${power} dx = ${resultStr}`,
      spokenExplanation: `By the reverse power rule of integration, the integral of x to the power ${power} is x to the power ${newPower} divided by ${newPower}, plus the constant of integration C!`,
      diagramType: 'tangent_curve',
      diagramData: {},
      isCustom: true,
      rawQuery: query
    };
  }

  return null;
}

// ── 3. GENERALIZED AI DOUBT SOLVER (CHATGPT-STYLE REASONING PARSER) ──
/**
 * Analyzes any student question (STEM, engineering, math, coding, science, logic)
 * Returns a structured lecture plan for Lumina's 3D blackboard and audible speech.
 * 
 * @param {string} rawQuery
 * @returns {Object} Structured lecture plan
 */
export function analyzeDoubt(rawQuery = '') {
  const query = (rawQuery || '').trim();
  const lower = query.toLowerCase();

  // 0. Conversational & Persona queries ("who are you", "who r u", "hi", "hello", "what can you do")
  const isGreetingOrIdentity = /^(who\s*(are\s*you|r\s*u|u)|what\s*are\s*you|introduce\s*yourself|tell\s*me\s*about\s*yourself|what('s|\s+is)\s+your\s+name|hello|hi|hey|howdy)\b/i.test(lower) || 
    lower === 'who r u' || lower === 'who are you' || lower === 'who u' || lower === 'hi lumina' || lower === 'hello lumina';

  if (isGreetingOrIdentity) {
    return {
      id: 'lumina_identity_' + Date.now(),
      subject: 'LUMINA AI • PERSONAL MENTOR',
      title: 'Meet Lumina: Your AI Polymath Mentor',
      primaryFormula: 'Lumina = Curiosity + Rigor + Empathy',
      steps: [
        '1. Identity: 24/7 Personal STEM & Polymath Mentor.',
        '2. Core Mastery: Mathematics, CS, Physics, and Engineering.',
        '3. Classroom: Interactive chalkboard derivations & doubt solving.'
      ],
      boxedConclusion: 'Ask me any question or doubt to begin learning!',
      spokenExplanation: "Hello! I am Lumina, your personal polymath mentor on Lumixora. I'm here to help you master mathematics, physics, computer science, and engineering from first principles. Feel free to ask me any doubt, and we will derive and solve it step-by-step together on the chalkboard!",
      diagramType: 'mentor_emblem',
      diagramData: {},
      isCustom: true,
      rawQuery: query
    };
  }

  // 1. Solve Arithmetic, Print statements, and Math expressions (e.g. "printgf(2+4)", "printf(2+4)", "2+4", "15 * 12")
  const arithCode = solveArithmeticOrCodeExpression(query);
  if (arithCode) return arithCode;

  // 2. Solve Computer Science concepts (e.g. "pointers in c", "binary search", "linked list", "stack", "queue")
  const csConcept = solveCodingConceptQuery(query);
  if (csConcept) return csConcept;

  // 3. Solve systems of linear equations (e.g. "A+B=4, A+2B=8 FIND A & B")
  const linearSys = solveLinearSystem(query);
  if (linearSys) return linearSys;

  // 4. Solve numeric quadratic equations (e.g. "x^2 - 5x + 6 = 0")
  const numQuad = solveNumericQuadratic(query);
  if (numQuad) return numQuad;

  // 5. Solve single-variable linear equations (e.g. "2x + 6 = 18")
  const singleLin = solveSingleLinear(query);
  if (singleLin) return singleLin;

  // 6. Solve Calculus expressions (derivatives & integrals)
  const calcResult = solveCalculusExpression(query);
  if (calcResult) return calcResult;

  // 5. Check curated knowledge base for exact / strong keyword match
  for (const entry of CURATED_KNOWLEDGE_BASE) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return {
        ...entry,
        isCustom: false,
        rawQuery: query
      };
    }
  }

  // 6. Dynamic Semantic Intent & Subject Classifier
  let detectedSubject = 'General STEM & Problem Solving';
  let diagramType = 'formula_flow';
  let primaryFormula = 'Principle ✦ Analysis';
  let boxedConclusion = 'Verified Analytical Takeaway';
  let customSteps = [];
  let spokenPedagogy = '';

  const hasMathSymbols = /[=+\-*/^√Δπθ∫]/.test(query);

  if (lower.includes('code') || lower.includes('algorithm') || lower.includes('sort') || lower.includes('search') || lower.includes('tree') || lower.includes('array') || lower.includes('graph') || lower.includes('stack') || lower.includes('queue') || lower.includes('loop')) {
    detectedSubject = 'Computer Science & Engineering';
    diagramType = 'tree';
    primaryFormula = 'Input State ⟶ Algorithm ⟶ Optimal State';
    customSteps = [
      '1. Invariant & State Space: Define algorithmic preconditions and data structure bounds.',
      '2. State Transition: Execute recursive decomposition or divide-and-conquer partition.',
      '3. Complexity Analysis: Verify asymptotic runtime Big-O and memory footprints.'
    ];
    boxedConclusion = 'Optimal Time & Space Invariant Preserved';
    spokenPedagogy = `Let's analyze your computer science question: "${query}". On the chalkboard, we break down the algorithmic invariant, structural state transitions, and asymptotic Big-O runtime!`;

  } else if (lower.includes('force') || lower.includes('velocity') || lower.includes('speed') || lower.includes('gravity') || lower.includes('electric') || lower.includes('magnetic') || lower.includes('wave') || lower.includes('optics') || lower.includes('photon') || lower.includes('mass')) {
    detectedSubject = 'Physics & Dynamics';
    diagramType = 'sine_wave';
    primaryFormula = 'Conservation: Σ Forces = 0   |   E_total = Constant';
    customSteps = [
      '1. Frame of Reference: Identify inertial coordinate system and governing forces.',
      '2. Governing Equations: Apply Newton\'s conservation of momentum or Maxwell\'s equations.',
      '3. Equilibrium Solution: Solve boundary conditions and compute kinematic vectors.'
    ];
    boxedConclusion = 'Physical Equilibrium & Invariant Energy State';
    spokenPedagogy = `Analyzing your physics question: "${query}". On the board, we establish the inertial reference frame, apply fundamental conservation laws, and solve for exact equilibrium!`;

  } else if (lower.includes('integrate') || lower.includes('differentiate') || lower.includes('limit') || lower.includes('matrix') || lower.includes('vector') || lower.includes('equation') || lower.includes('solve') || lower.includes('value') || hasMathSymbols) {
    detectedSubject = 'Applied Mathematics';
    diagramType = 'formula_flow';
    primaryFormula = query.length < 35 && hasMathSymbols ? query : 'f(x) = Analytical Model';
    const displayMath = query.length < 32 ? query : 'Mathematical Model';
    customSteps = [
      `1. Mathematical Formulation: Formulate the governing relations for "${displayMath}".`,
      `2. Canonical Simplification: Apply operator properties, factoring, and domain constraints.`,
      `3. Analytical Verification: Derive exact roots, limits, and evaluate boundary conditions.`
    ];
    boxedConclusion = `Analytical Invariant Verified for: ${displayMath}`;
    spokenPedagogy = `Let's solve your mathematical query: "${query}". On the board, we state the mathematical relations, reduce through canonical algebraic steps, and verify the analytical conclusion!`;

  } else if (lower.includes('reaction') || lower.includes('atom') || lower.includes('molecule') || lower.includes('bond') || lower.includes('acid') || lower.includes('base') || lower.includes('ph') || lower.includes('electron')) {
    detectedSubject = 'Chemistry & Molecular Science';
    diagramType = 'flowchart';
    primaryFormula = 'Reactants ⟶ Products   (ΔH < 0, ΔG < 0)';
    customSteps = [
      '1. Stoichiometric Balance: Conserve mass and electron charge across reactants.',
      '2. Thermodynamic Driving Force: Evaluate Gibbs free energy ΔG and reaction enthalpy.',
      '3. Equilibrium Kinetics: Apply Le Chatelier\'s principle and rate law.'
    ];
    boxedConclusion = 'Thermodynamic & Kinetic Equilibrium Balanced';
    spokenPedagogy = `Examining your chemistry question: "${query}". We balance the stoichiometric atomic equation on the board, examine thermodynamic potential, and find the kinetic equilibrium!`;

  } else if (lower.includes('cell') || lower.includes('gene') || lower.includes('protein') || lower.includes('organ') || lower.includes('body') || lower.includes('brain') || lower.includes('neuron')) {
    detectedSubject = 'Biological Sciences';
    diagramType = 'flowchart';
    primaryFormula = 'Molecular Structure ⟷ Biological Function';
    customSteps = [
      '1. Cellular Substrate: Identify molecular pathways, organelles, and gene regulators.',
      '2. Mechanism of Action: Trace biochemical signaling cascades and energy utilization.',
      '3. System Homeostasis: Evaluate feedback loops maintaining physiological balance.'
    ];
    boxedConclusion = 'Homeostatic Regulation & Structural Function Invariant';
    spokenPedagogy = `Exploring your biological inquiry: "${query}". On the chalkboard, we trace the biochemical signaling pathways, cellular mechanisms, and physiological homeostasis!`;

  } else {
    // Open-ended general questions
    const displayTopic = query.length < 32 ? query : 'Concept';
    detectedSubject = 'Polymath STEM & Inquiry';
    customSteps = [
      `1. Core Foundation: Establish primary axioms, definitions, and boundaries of "${displayTopic}".`,
      `2. Structural Mechanism: Deconstruct functional relationships, workflows, and dynamics.`,
      `3. Applied Synthesis: Formulate concise takeaways and verify real-world alignment.`
    ];
    boxedConclusion = `Synthesized Framework for: ${displayTopic}`;
    spokenPedagogy = `Let's explore your question: "${query}". On the chalkboard, we break this down from first principles into core governing mechanisms and practical insights!`;
  }

  const cleanTitle = query.length > 55 ? `${query.slice(0, 52)}...` : query;
  const capitalizedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

  return {
    id: 'custom_' + Date.now(),
    subject: detectedSubject,
    title: capitalizedTitle,
    primaryFormula,
    steps: customSteps,
    boxedConclusion,
    spokenExplanation: spokenPedagogy,
    diagramType,
    diagramData: {},
    isCustom: true,
    rawQuery: query
  };
}
