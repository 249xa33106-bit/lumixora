import React from 'react';

const VisualCircuit = ({ circuitData, activeCol }) => {
  if (!circuitData) return null;

  const { numQubits, wires, cols } = circuitData;
  const wireHeight = 80;
  const colWidth = 100;
  const startX = 80;

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden flex justify-center py-8">
      <svg width={startX + cols.length * colWidth + 60} height={numQubits * wireHeight + 40} className="select-none">
        
        {/* Advanced Filters & Gradients */}
        <defs>
          {/* Glowing Energy Flow on Wires */}
          <linearGradient id="energyFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--text-secondary)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--brand-orange)" />
            <stop offset="100%" stopColor="var(--text-secondary)" stopOpacity="0.3" />
          </linearGradient>

          {/* Frosted Glass Gate Box Background */}
          <linearGradient id="glassBox" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
          </linearGradient>

          <linearGradient id="glassBoxActive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(249, 115, 22, 0.25)" />
            <stop offset="100%" stopColor="rgba(249, 115, 22, 0.05)" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="neonGlowBox" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="glowPulse" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="1.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Inner Shadow for Gate Boxes */}
          <filter id="innerShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* High-Tech Dot Matrix Background */}
        <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="var(--text-secondary)" opacity="0.1" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#dotGrid)" />

        {/* Draw Quantum Wires */}
        {wires.map((wireLabel, i) => {
          const y = i * wireHeight + wireHeight / 2;
          return (
            <g key={`wire-${i}`}>
              {/* Background Wire Path */}
              <line
                x1={startX}
                y1={y}
                x2={startX + cols.length * colWidth + 40}
                y2={y}
                stroke="var(--border-color)"
                strokeWidth="2"
              />
              {/* Animated Energy Flow */}
              <line
                x1={startX}
                y1={y}
                x2={startX + cols.length * colWidth + 40}
                y2={y}
                stroke="url(#energyFlow)"
                strokeWidth="2"
                strokeDasharray="40 80"
                strokeDashoffset="0"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="120;0"
                  dur="2s"
                  repeatCount="indefinite"
                  timingFunction="linear"
                />
              </line>

              {/* High-Tech Qubit Label Badge */}
              <g transform={`translate(10, ${y - 12})`}>
                <rect x="0" y="0" width="46" height="24" rx="12" fill="#0f172a" stroke="var(--border-color)" strokeWidth="1" />
                <text x="23" y="16" fill="var(--text-main)" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  {wireLabel}
                </text>
              </g>
            </g>
          );
        })}

        {/* Draw Columns (Gates & Operations) */}
        {cols.map((col, cIdx) => {
          const x = startX + cIdx * colWidth + colWidth / 2;
          const isActive = cIdx === activeCol;
          const isPast = cIdx < activeCol;
          
          const boxStyle = {
            fill: isActive ? 'url(#glassBoxActive)' : 'url(#glassBox)',
            stroke: isActive ? 'var(--brand-orange)' : (isPast ? 'var(--text-secondary)' : 'var(--border-color)'),
            strokeWidth: isActive ? "2" : "1",
            filter: isActive ? 'url(#glowPulse)' : 'url(#innerShadow)'
          };

          const textStyle = {
            fill: isActive ? '#fff' : (isPast ? 'var(--text-secondary)' : 'var(--text-main)'),
            textShadow: isActive ? '0 0 8px rgba(249, 115, 22, 0.8)' : 'none'
          };

          if (col.type === 'gate') {
            const y = col.gate.target * wireHeight + wireHeight / 2;
            return (
              <g key={`col-${cIdx}`}>
                <rect x={x - 24} y={y - 24} width="48" height="48" rx="8" {...boxStyle} />
                <text x={x} y={y + 6} fontSize="18" fontWeight="bold" textAnchor="middle" style={textStyle}>{col.gate.label}</text>
              </g>
            );
          }
          if (col.type === 'multigate') {
            return (
              <g key={`col-${cIdx}`}>
                {col.gates.map((g, i) => {
                  const y = g.target * wireHeight + wireHeight / 2;
                  return (
                    <g key={`mg-${i}`}>
                      <rect x={x - 24} y={y - 24} width="48" height="48" rx="8" {...boxStyle} />
                      <text x={x} y={y + 6} fontSize="18" fontWeight="bold" textAnchor="middle" style={textStyle}>{g.label}</text>
                    </g>
                  );
                })}
              </g>
            );
          }
          if (col.type === 'cnot') {
            const yC = col.control * wireHeight + wireHeight / 2;
            const yT = col.target * wireHeight + wireHeight / 2;
            const lineColor = isActive ? 'var(--brand-orange)' : (isPast ? 'var(--text-secondary)' : 'var(--border-color)');
            return (
              <g key={`col-${cIdx}`}>
                <line x1={x} y1={Math.min(yC, yT)} x2={x} y2={Math.max(yC, yT)} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <circle cx={x} cy={yC} r="8" fill={lineColor} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                
                {/* Target XOR symbol */}
                <circle cx={x} cy={yT} r="16" fill="#0f172a" stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <line x1={x} y1={yT - 16} x2={x} y2={yT + 16} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <line x1={x - 16} y1={yT} x2={x + 16} y2={yT} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
              </g>
            );
          }
          if (col.type === 'cz') {
            const yC = col.control * wireHeight + wireHeight / 2;
            const yT = col.target * wireHeight + wireHeight / 2;
            const lineColor = isActive ? 'var(--brand-orange)' : (isPast ? 'var(--text-secondary)' : 'var(--border-color)');
            return (
              <g key={`col-${cIdx}`}>
                <line x1={x} y1={Math.min(yC, yT)} x2={x} y2={Math.max(yC, yT)} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <circle cx={x} cy={yC} r="8" fill={lineColor} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <circle cx={x} cy={yT} r="8" fill={lineColor} filter={isActive ? 'url(#glowPulse)' : 'none'} />
              </g>
            );
          }
          if (col.type === 'cphase') {
            const yC = col.control * wireHeight + wireHeight / 2;
            const yT = col.target * wireHeight + wireHeight / 2;
            const lineColor = isActive ? 'var(--brand-orange)' : (isPast ? 'var(--text-secondary)' : 'var(--border-color)');
            return (
              <g key={`col-${cIdx}`}>
                <line x1={x} y1={Math.min(yC, yT)} x2={x} y2={Math.max(yC, yT)} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <circle cx={x} cy={yC} r="8" fill={lineColor} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                
                {/* Target R_k Box */}
                <rect x={x - 20} y={yT - 20} width="40" height="40" rx="8" {...boxStyle} />
                <text x={x} y={yT + 5} fontSize="14" fontWeight="bold" textAnchor="middle" style={textStyle}>{col.label}</text>
              </g>
            );
          }
          if (col.type === 'ccnot') {
            const yC1 = col.control1 * wireHeight + wireHeight / 2;
            const yC2 = col.control2 * wireHeight + wireHeight / 2;
            const yT = col.target * wireHeight + wireHeight / 2;
            const lineColor = isActive ? 'var(--brand-orange)' : (isPast ? 'var(--text-secondary)' : 'var(--border-color)');
            return (
              <g key={`col-${cIdx}`}>
                <line x1={x} y1={Math.min(yC1, yC2, yT)} x2={x} y2={Math.max(yC1, yC2, yT)} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <circle cx={x} cy={yC1} r="8" fill={lineColor} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <circle cx={x} cy={yC2} r="8" fill={lineColor} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                
                <circle cx={x} cy={yT} r="16" fill="#0f172a" stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <line x1={x} y1={yT - 16} x2={x} y2={yT + 16} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <line x1={x - 16} y1={yT} x2={x + 16} y2={yT} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
              </g>
            );
          }
          if (col.type === 'swap') {
            const y1 = col.target1 * wireHeight + wireHeight / 2;
            const y2 = col.target2 * wireHeight + wireHeight / 2;
            const lineColor = isActive ? 'var(--brand-orange)' : (isPast ? 'var(--text-secondary)' : 'var(--border-color)');
            return (
              <g key={`col-${cIdx}`}>
                <line x1={x} y1={y1} x2={x} y2={y2} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <path d={`M ${x-8} ${y1-8} L ${x+8} ${y1+8} M ${x-8} ${y1+8} L ${x+8} ${y1-8}`} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
                <path d={`M ${x-8} ${y2-8} L ${x+8} ${y2+8} M ${x-8} ${y2+8} L ${x+8} ${y2-8}`} stroke={lineColor} strokeWidth={isActive ? "3" : "2"} filter={isActive ? 'url(#glowPulse)' : 'none'} />
              </g>
            );
          }
          if (col.type === 'oracle' || col.type === 'diffusion') {
            const yTop = col.span[0] * wireHeight + wireHeight / 2;
            const yBot = col.span[1] * wireHeight + wireHeight / 2;
            const h = yBot - yTop + 48;
            return (
              <g key={`col-${cIdx}`}>
                <rect x={x - 36} y={yTop - 24} width="72" height={h} rx="8" {...boxStyle} />
                <text x={x} y={yTop + h/2 + 6} fontSize="16" fontWeight="bold" textAnchor="middle" style={textStyle}>{col.type === 'oracle' ? 'Oracle' : 'Diffus'}</text>
              </g>
            );
          }
          if (col.type === 'measure' || col.type === 'measure_all') {
            const renderMeter = (yPos) => (
              <g key={`m-${yPos}`}>
                <rect x={x - 24} y={yPos - 24} width="48" height="48" rx="8" fill="rgba(255, 255, 255, 0.05)" stroke={isActive ? 'var(--brand-orange)' : 'var(--text-secondary)'} strokeWidth="2" filter={isActive ? 'url(#glowPulse)' : 'url(#innerShadow)'} />
                {/* Meter Dial Arch */}
                <path d={`M ${x-12} ${yPos+8} A 14 14 0 0 1 ${x+12} ${yPos+8}`} fill="none" stroke={isActive ? '#fff' : 'var(--text-secondary)'} strokeWidth="2" />
                {/* Meter Needle */}
                <line x1={x} y1={yPos+8} x2={isActive ? x+8 : x} y2={isActive ? yPos-6 : yPos-8} stroke={isActive ? 'var(--brand-orange)' : 'var(--text-main)'} strokeWidth="2" strokeLinecap="round">
                  {isActive && <animate attributeName="x2" values={`${x-8};${x+8};${x}`} dur="0.6s" repeatCount="1" fill="freeze" />}
                </line>
                {/* Meter Center Pivot */}
                <circle cx={x} cy={yPos+8} r="2" fill={isActive ? '#fff' : 'var(--text-main)'} />
              </g>
            );

            if (col.type === 'measure') {
              return <g key={`col-${cIdx}`}>{renderMeter(col.target * wireHeight + wireHeight / 2)}</g>;
            } else {
              return (
                <g key={`col-${cIdx}`}>
                  {wires.map((_, i) => renderMeter(i * wireHeight + wireHeight / 2))}
                </g>
              );
            }
          }
          return null;
        })}
      </svg>
    </div>
  );
};

export default VisualCircuit;
