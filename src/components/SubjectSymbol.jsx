import React from 'react';

/**
 * Authentic Technical Symbols for B.Tech Engineering Curriculum Subjects & Topics
 * Zero emojis — only official brand vectors, computer science data structures, and architectural symbols.
 */

// 1. PYTHON: Official Python Foundation Two-Snake Vector Emblem
export const PythonSymbol = ({ className = "w-4 h-4", isSelected = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill={isSelected ? "#000000" : "#3776AB"}
      d="M49.2 1.5c-24.8 0-23.2 10.8-23.2 10.8l.1 11.2h23.7v3.4H16.1S2.3 25.3 2.3 49.8s12 23.9 12 23.9h7.2v-10.2s-.4-12 11.9-12h23.5s11.5.2 11.5-11.3V12.8S70.8 1.5 49.2 1.5zm-12.7 7.4c2.2 0 4.1 1.9 4.1 4.1s-1.9 4.1-4.1 4.1-4.1-1.9-4.1-4.1 1.9-4.1 4.1-4.1z"
    />
    <path
      fill={isSelected ? "#1a2e05" : "#FFD43B"}
      d="M50.8 98.5c24.8 0 23.2-10.8 23.2-10.8l-.1-11.2H50.2v-3.4h33.7s13.8 1.6 13.8-22.9-12-23.9-12-23.9h-7.2v10.2s.4 12-11.9 12H43.1s-11.5-.2-11.5 11.3v27.4s-2.4 11.3 19.2 11.3zm12.7-7.4c-2.2 0-4.1-1.9-4.1-4.1s1.9-4.1 4.1-4.1 4.1 1.9 4.1 4.1-1.9 4.1-4.1 4.1z"
    />
  </svg>
);

// 2. JAVA: Official Java Coffee Cup & Twin Vapor Trails Emblem
export const JavaSymbol = ({ className = "w-4 h-4", isSelected = false }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill={isSelected ? "#000000" : "#5382A1"}
      d="M13.2 4.1c-1.1 2.3.4 4.1 1.9 5.8 1.1 1.3 1.8 2.6 1.3 4.1-.3.8-1.1 1.6-2.1 2.1-.3.2-.5.3-.3.5.2.2.5.2.7 0 1.3-.7 2.3-1.6 2.6-2.9.5-1.8-.2-3.6-1.5-4.9-1.3-1.5-2-2.8-1.3-4.3.2-.3 0-.5-.2-.7-.3-.2-1-.2-1.1.3zm6.2-1.1c-1.1 2.6.3 4.6 2.1 6.4 1.1 1.1 1.8 2.5 1.3 3.8-.3.8-1.1 1.5-2.1 2-.3.2-.5.3-.3.5.2.2.3.2.7 0 1.3-.7 2.1-1.6 2.6-2.9.5-1.8-.2-3.4-1.5-4.9-1.5-1.6-2.1-3-1.5-4.4.2-.2 0-.5-.2-.7-.3-.2-1 0-1.1.2z"
    />
    <path
      fill={isSelected ? "#000000" : "#E76F00"}
      d="M6 18.2c0 3.6 2.3 7.9 6.9 9 2.5.7 5.1.7 7.6.2 3.8-.8 6.2-3.6 6.9-7.4.2-1 .2-1.8.2-1.8H6zm22.3.8c.5.8.5 1.8.2 2.6-.7 1.5-2.3 2.3-3.9 2.5.3.7.7 1.1 1.1 1.5 2.8.2 5.2-1.1 6.2-3.6.7-1.6.5-3.3-.3-4.6l-3.3 1.6zM4.4 30.1c3.9 2.1 10 2.9 15.6 2.9 5.7 0 12-.9 15.6-3.3-.5-.5-1.5-.7-2.5-.7-4.4 1.1-9.8 1.8-13.9 1.8-4.2 0-9.3-.7-13.3-1.8-.5 0-1.1.5-1.5 1.1z"
    />
  </svg>
);

// 3. DSA: Classic Computer Science Binary Search Tree (Root -> Children -> Leaves)
export const DsaSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#10b981';
  const fillColor = isSelected ? '#000000' : '#10b981';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2.2" fill={fillColor} fillOpacity={isSelected ? "1" : "0.3"} />
      <line x1="10.2" y1="5.8" x2="6.5" y2="9.8" />
      <line x1="13.8" y1="5.8" x2="17.5" y2="9.8" />
      <circle cx="5.5" cy="11.5" r="2" fill={fillColor} fillOpacity={isSelected ? "1" : "0.3"} />
      <circle cx="18.5" cy="11.5" r="2" fill={fillColor} fillOpacity={isSelected ? "1" : "0.3"} />
      <line x1="4.5" y1="13.2" x2="2.8" y2="17.5" />
      <line x1="6.5" y1="13.2" x2="8.2" y2="17.5" />
      <line x1="17.5" y1="13.2" x2="15.8" y2="17.5" />
      <line x1="19.5" y1="13.2" x2="21.2" y2="17.5" />
      <circle cx="2.5" cy="19" r="1.5" fill={fillColor} />
      <circle cx="8.5" cy="19" r="1.5" fill={fillColor} />
      <circle cx="15.5" cy="19" r="1.5" fill={fillColor} />
      <circle cx="21.5" cy="19" r="1.5" fill={fillColor} />
    </svg>
  );
};

// 4. ADSA: Directed Acyclic Graph (DAG) with Weighted Flow Lattice & Topological Order
export const AdsaSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#06b6d4';
  const fillColor = isSelected ? '#000000' : '#06b6d4';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="4" cy="12" r="2.2" fill={fillColor} fillOpacity={isSelected ? "1" : "0.3"} />
      <circle cx="12" cy="4.5" r="2.2" fill={fillColor} fillOpacity={isSelected ? "1" : "0.3"} />
      <circle cx="12" cy="19.5" r="2.2" fill={fillColor} fillOpacity={isSelected ? "1" : "0.3"} />
      <circle cx="20" cy="12" r="2.2" fill={fillColor} fillOpacity={isSelected ? "1" : "0.3"} />
      <path d="M5.8 10.4 L10.2 6.2" />
      <path d="M5.8 13.6 L10.2 17.8" />
      <path d="M13.8 6.2 L18.2 10.4" />
      <path d="M13.8 17.8 L18.2 13.6" />
      <line x1="6.5" y1="12" x2="17.5" y2="12" strokeDasharray="1.8 1.8" />
      <circle cx="12" cy="12" r="1.4" fill={fillColor} />
    </svg>
  );
};

// 5. ML: Deep Neural Network Architecture (Input -> Hidden -> Output Layers with Synapses)
export const MlSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#a855f7';
  const fillColor = isSelected ? '#000000' : '#c084fc';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="12" y2="4" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />
      <line x1="4" y1="6" x2="12" y2="9.3" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />
      <line x1="4" y1="12" x2="12" y2="9.3" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />
      <line x1="4" y1="12" x2="12" y2="14.7" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />
      <line x1="4" y1="18" x2="12" y2="14.7" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />
      <line x1="4" y1="18" x2="12" y2="20" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />

      <line x1="12" y1="4" x2="20" y2="8" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />
      <line x1="12" y1="9.3" x2="20" y2="8" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />
      <line x1="12" y1="14.7" x2="20" y2="16" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />
      <line x1="12" y1="20" x2="20" y2="16" stroke={strokeColor} strokeOpacity={isSelected ? "0.6" : "0.45"} />

      <circle cx="4" cy="6" r="1.6" fill={fillColor} />
      <circle cx="4" cy="12" r="1.6" fill={fillColor} />
      <circle cx="4" cy="18" r="1.6" fill={fillColor} />

      <circle cx="12" cy="4" r="1.6" fill={fillColor} />
      <circle cx="12" cy="9.3" r="1.6" fill={fillColor} />
      <circle cx="12" cy="14.7" r="1.6" fill={fillColor} />
      <circle cx="12" cy="20" r="1.6" fill={fillColor} />

      <circle cx="20" cy="8" r="1.6" fill={fillColor} />
      <circle cx="20" cy="16" r="1.6" fill={fillColor} />
    </svg>
  );
};

// 6. DBMS: Relational Database ANSI Cylinder Stack (Table partitions & Disk Storage)
export const DbmsSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#f43f5e';
  const fillColor = isSelected ? '#000000' : '#f43f5e';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="2.7" fill={fillColor} fillOpacity={isSelected ? "0.3" : "0.2"} />
      <path d="M4 5v5.5c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7V5" />
      <path d="M4 10.5V16c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7v-5.5" />
      <path d="M4 16v2.5c0 1.5 3.6 2.7 8 2.7s8-1.2 8-2.7V16" />
    </svg>
  );
};

// 7. OS: Microprocessor CPU Core & Hardware Kernel Bus Pins
export const OsSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#6366f1';
  const fillColor = isSelected ? '#000000' : '#6366f1';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="4.5" width="15" height="15" rx="2" fill={fillColor} fillOpacity={isSelected ? "0.3" : "0.15"} />
      <rect x="8.5" y="8.5" width="7" height="7" rx="1" fill={fillColor} fillOpacity={isSelected ? "0.6" : "0.35"} />
      <line x1="9" y1="1.5" x2="9" y2="4.5" />
      <line x1="15" y1="1.5" x2="15" y2="4.5" />
      <line x1="9" y1="19.5" x2="9" y2="22.5" />
      <line x1="15" y1="19.5" x2="15" y2="22.5" />
      <line x1="1.5" y1="9" x2="4.5" y2="9" />
      <line x1="1.5" y1="15" x2="4.5" y2="15" />
      <line x1="19.5" y1="9" x2="22.5" y2="9" />
      <line x1="19.5" y1="15" x2="22.5" y2="15" />
    </svg>
  );
};

// 8. CN: Computer Network Topology (Router Switch & Host Workstations)
export const CnSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#14b8a6';
  const fillColor = isSelected ? '#000000' : '#14b8a6';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2.5" width="6" height="5" rx="1.5" fill={fillColor} fillOpacity={isSelected ? "0.4" : "0.25"} />
      <rect x="2" y="16.5" width="6" height="5" rx="1.5" fill={fillColor} fillOpacity={isSelected ? "0.4" : "0.25"} />
      <rect x="16" y="16.5" width="6" height="5" rx="1.5" fill={fillColor} fillOpacity={isSelected ? "0.4" : "0.25"} />
      <path d="M12 7.5 v4.5" />
      <path d="M5 16.5 v-2 a2.5 2.5 0 0 1 2.5 -2.5 h9 a2.5 2.5 0 0 1 2.5 2.5 v2" />
    </svg>
  );
};

// 9. DSP: Digital Signal Processing & Discrete Fourier Transform (Analog Wave to Discrete Sampling Bars)
export const DspSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#06b6d4';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2.5-8 5-8 7.5 0s5 8 7.5 0 3-4 5-4" />
      <line x1="2" y1="20" x2="22" y2="20" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="6" y1="20" x2="6" y2="16" strokeWidth="1.5" />
      <line x1="10" y1="20" x2="10" y2="11" strokeWidth="1.5" />
      <line x1="14" y1="20" x2="14" y2="7" strokeWidth="1.5" />
      <line x1="18" y1="20" x2="18" y2="13" strokeWidth="1.5" />
    </svg>
  );
};

// 10. CAPSTONE: Distributed Cloud System Architecture (Multi-Tier Cluster)
export const CapstoneSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#38bdf8';
  const fillColor = isSelected ? '#000000' : '#38bdf8';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" fill={fillColor} fillOpacity={isSelected ? "0.35" : "0.2"} />
      <polyline points="2 12 12 17 22 12" />
      <polyline points="2 17 12 22 22 17" />
    </svg>
  );
};

// 11. STARTUP: High-Growth Scaled Trajectory & Innovation Vector
export const StartupSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#f97316';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
};

// 12. ALL SUBJECTS: Multilayer Curriculum Stack / Master Engineering Library
export const AllSubjectsSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#00f2fe';
  const fillColor = isSelected ? '#000000' : '#00f2fe';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill={fillColor} fillOpacity={isSelected ? "0.35" : "0.2"} />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
};

// 13. C++: ISO C++ Standard Shield Badge
export const CppSymbol = ({ className = "w-4 h-4", isSelected = false }) => {
  const strokeColor = isSelected ? '#000000' : '#00599C';
  const fillColor = isSelected ? '#000000' : '#00599C';
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" stroke={strokeColor} strokeWidth="1.8" fill={fillColor} fillOpacity={isSelected ? "0.35" : "0.15"} />
      <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill={isSelected ? "#000000" : "#00599C"} fontFamily="monospace">C++</text>
    </svg>
  );
};

/**
 * Universal Subject Symbol Resolver with intelligent topic mapping
 */
export default function SubjectSymbol({ subjectId, language, className = "w-4 h-4", isSelected = false }) {
  const key = (subjectId || language || '').toLowerCase();

  // Intelligent matching by keywords
  if (key === 'all' || key.includes('curriculum')) {
    return <AllSubjectsSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('dsa') || key.includes('tree') || key.includes('graph') || key.includes('traversal') || key.includes('dijkstra') || key.includes('algorithm') || key.includes('cse')) {
    return <DsaSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('adsa') || key.includes('flow') || key.includes('b-tree') || key.includes('dag')) {
    return <AdsaSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('java') || key.includes('jvm') || key.includes('thread')) {
    return <JavaSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('python') || key.includes('async') || key.includes('py')) {
    return <PythonSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('neural') || key.includes('ml') || key.includes('ai') || key.includes('backprop') || key.includes('gradient') || key.includes('machine learning') || key.includes('deep learning')) {
    return <MlSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('sql') || key.includes('dbms') || key.includes('database') || key.includes('index') || key.includes('normalization') || key.includes('b-tree')) {
    return <DbmsSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('signal') || key.includes('dsp') || key.includes('dft') || key.includes('convolution') || key.includes('ece') || key.includes('fourier')) {
    return <DspSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('os') || key.includes('operating') || key.includes('kernel') || key.includes('concurrency') || key.includes('cpu')) {
    return <OsSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('cn') || key.includes('network') || key.includes('protocol') || key.includes('tcp') || key.includes('routing')) {
    return <CnSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('capstone') || key.includes('cloud') || key.includes('distributed')) {
    return <CapstoneSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('startup') || key.includes('innov') || key.includes('venture')) {
    return <StartupSymbol className={className} isSelected={isSelected} />;
  }
  if (key.includes('cpp') || key.includes('c++')) {
    return <CppSymbol className={className} isSelected={isSelected} />;
  }

  return <DsaSymbol className={className} isSelected={isSelected} />;
}
