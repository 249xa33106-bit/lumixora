import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, Filter, Search, Layers, Cpu, Database, 
  Code2, ExternalLink, Sparkles, CheckCircle2, ChevronRight, X, GitFork, 
  Maximize2, Share2, Info, ArrowUpRight, Play
} from 'lucide-react';
import { PROJECT_DNA_COMPONENTS, RELAY_PROJECTS, COMPONENT_SYNERGIES } from '../../data/relayProjectsData';

export default function DiscoveryGraph({ 
  projects = RELAY_PROJECTS, 
  dnaComponents = PROJECT_DNA_COMPONENTS, 
  synergies = COMPONENT_SYNERGIES,
  onSelectForFusion, 
  onNavigateToTab,
  onPracticeDna
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'project' | 'code_module' | 'algorithm' | 'dataset_schema' | 'api_contract'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Generate Graph Nodes
  const initialNodes = useMemo(() => {
    const nodes = [];
    const width = 850;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Project Core Nodes (Orbit Inner Ring)
    const projectCount = projects.length;
    projects.forEach((proj, idx) => {
      const angle = (idx / projectCount) * 2 * Math.PI;
      const radius = 170;
      nodes.push({
        id: proj.id,
        name: proj.name,
        type: 'project',
        category: proj.category,
        color: '#6C4DFF', // Violet
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        radius: 26,
        data: proj
      });
    });

    // 2. DNA Component Nodes (Orbit Outer Rings around their parent projects)
    dnaComponents.forEach((dna, idx) => {
      const parentProject = nodes.find(n => n.id === dna.projectId);
      const parentX = parentProject ? parentProject.x : centerX;
      const parentY = parentProject ? parentProject.y : centerY;

      // Small jitter around parent
      const angle = (idx * 1.35) % (2 * Math.PI);
      const dist = 85 + (idx % 3) * 20;

      let color = '#3878FF'; // Blue (code_module)
      if (dna.type === 'algorithm') color = '#F59E0B'; // Amber
      if (dna.type === 'dataset_schema') color = '#10B981'; // Emerald
      if (dna.type === 'api_contract') color = '#22C7D9'; // Cyan

      nodes.push({
        id: dna.id,
        name: dna.name,
        type: dna.type,
        color,
        x: Math.max(50, Math.min(width - 50, parentX + dist * Math.cos(angle))),
        y: Math.max(50, Math.min(height - 50, parentY + dist * Math.sin(angle))),
        radius: 16,
        data: dna
      });
    });

    return nodes;
  }, [projects, dnaComponents]);

  const [nodes, setNodes] = useState(initialNodes);

  // Synchronize nodes when props change
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  // Graph Edges
  const edges = useMemo(() => {
    const list = [];

    // Parent project to component edges
    dnaComponents.forEach(dna => {
      list.push({
        id: `edge-${dna.projectId}-${dna.id}`,
        source: dna.projectId,
        target: dna.id,
        type: 'parent_child',
        weight: 1,
        color: '#CBD5E1'
      });
    });

    // Synergies between components
    synergies.forEach(syn => {
      list.push({
        id: `edge-syn-${syn.id}`,
        source: syn.sourceComponentId,
        target: syn.targetComponentId,
        type: 'synergy',
        weight: syn.synergyScore,
        synergyData: syn,
        color: '#6C4DFF'
      });
    });

    return list;
  }, [dnaComponents, synergies]);

  // Filtered Nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const matchesType = typeFilter === 'all' || n.type === typeFilter;
      const matchesSearch = !searchQuery.trim() || 
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (n.data?.tags && n.data.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesType && matchesSearch;
    });
  }, [nodes, typeFilter, searchQuery]);

  const activeFilteredIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Selected Node Details
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  // Connected Neighbor IDs of selected node
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set();
    const set = new Set([selectedNodeId]);
    edges.forEach(e => {
      if (e.source === selectedNodeId) set.add(e.target);
      if (e.target === selectedNodeId) set.add(e.source);
    });
    return set;
  }, [selectedNodeId, edges]);

  // Mouse pan handling
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Node Dragging
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    setSelectedNodeId(nodeId);
  };

  const handleSvgMouseMove = (e) => {
    if (isPanning) {
      handleMouseMove(e);
      return;
    }
    if (draggedNodeId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const clientY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

      setNodes(prev => prev.map(n => {
        if (n.id === draggedNodeId) {
          return { ...n, x: clientX, y: clientY };
        }
        return n;
      }));
    }
  };

  const handleSvgMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNodeId(null);
  };

  return (
    <div className="relative w-full rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* ─── GRAPH CONTROL TOOLBAR ─── */}
      <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components, APIs, tags..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#17172B] outline-none focus:border-[#6C4DFF] focus:ring-2 focus:ring-[#6C4DFF]/10 transition-all placeholder-slate-400 font-medium"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
            {[
              { id: 'all', label: 'All Entities' },
              { id: 'project', label: 'Projects' },
              { id: 'code_module', label: 'Modules' },
              { id: 'algorithm', label: 'Algorithms' },
              { id: 'dataset_schema', label: 'Data & Schemas' },
              { id: 'api_contract', label: 'APIs' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setTypeFilter(filter.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-[11px] ${typeFilter === filter.id ? 'bg-gradient-to-r from-[#6C4DFF] to-[#3878FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.15))}
              className="p-1.5 rounded-lg text-slate-600 hover:text-[#6C4DFF] hover:bg-slate-100 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
              className="p-1.5 rounded-lg text-slate-600 hover:text-[#6C4DFF] hover:bg-slate-100 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 rounded-lg text-slate-600 hover:text-[#6C4DFF] hover:bg-slate-100 cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-1.5 rounded-xl border border-slate-200">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
      </div>

      {/* ─── GRAPH CANVAS CONTAINER ─── */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleSvgMouseMove}
        onMouseUp={handleSvgMouseUp}
        className="relative w-full h-[540px] cursor-grab active:cursor-grabbing select-none bg-[#FAFAFC]"
        style={{
          backgroundImage: 'radial-gradient(#E2E8F0 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px'
        }}
      >
        <svg className="w-full h-full">
          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
            {/* Edges */}
            {edges.map(edge => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isConnected = selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId);
              const isSynergy = edge.type === 'synergy';

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isConnected ? '#6C4DFF' : isSynergy ? '#818CF8' : '#CBD5E1'}
                    strokeWidth={isConnected ? 3 : isSynergy ? 2 : 1.2}
                    strokeDasharray={isSynergy ? '4 3' : undefined}
                    strokeOpacity={selectedNodeId ? (isConnected ? 1 : 0.15) : (isSynergy ? 0.75 : 0.45)}
                    className="transition-all duration-300"
                  />
                  {/* Synergy Match Pill Badge along edge */}
                  {isSynergy && (!selectedNodeId || isConnected) && (
                    <g transform={`translate(${(sourceNode.x + targetNode.x) / 2}, ${(sourceNode.y + targetNode.y) / 2})`}>
                      <rect
                        x="-18"
                        y="-8"
                        width="36"
                        height="16"
                        rx="8"
                        fill="#FFFFFF"
                        stroke="#6C4DFF"
                        strokeWidth="1.2"
                        className="shadow-sm"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#6C4DFF"
                        fontFamily="monospace"
                      >
                        {Math.round(edge.weight)}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isNeighbor = selectedNodeId && connectedNodeIds.has(node.id);
              const isDimmed = selectedNodeId && !connectedNodeIds.has(node.id);
              const isMatch = activeFilteredIds.has(node.id);

              if (!isMatch && typeFilter !== 'all') return null;

              const isProject = node.type === 'project';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer transition-transform duration-200"
                  opacity={isDimmed ? 0.25 : 1}
                >
                  {/* Outer selection ring */}
                  {(isSelected || isHovered) && (
                    <circle
                      r={node.radius + 6}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={node.radius}
                    fill={node.color}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    className="shadow-md transition-all hover:scale-110"
                    style={{
                      filter: isSelected ? 'drop-shadow(0 6px 12px rgba(108, 77, 255, 0.35))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))'
                    }}
                  />

                  {/* Inner Node Icon or Dot */}
                  {isProject ? (
                    <text
                      textAnchor="middle"
                      y="4"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#FFFFFF"
                      fontFamily="system-ui"
                    >
                      PROJ
                    </text>
                  ) : (
                    <circle r="4" fill="#FFFFFF" />
                  )}

                  {/* Node Name Label */}
                  <text
                    x="0"
                    y={node.radius + 14}
                    textAnchor="middle"
                    fontSize={isProject ? "11" : "10"}
                    fontWeight={isProject ? "700" : "600"}
                    fill="#17172B"
                    className="pointer-events-none drop-shadow-sm select-none"
                    fontFamily="system-ui"
                  >
                    {node.name.length > 22 ? `${node.name.slice(0, 20)}...` : node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* ─── GRAPH LEGEND (BOTTOM-LEFT) ─── */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/90 shadow-sm flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6C4DFF]" />
            <span>Project Core</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3878FF]" />
            <span>Code Module</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span>Algorithm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>Dataset / Schema</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C7D9]" />
            <span>API Contract</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
            <span className="w-4 h-0.5 border-t border-dashed border-[#818CF8]" />
            <span>Synergy Link</span>
          </div>
        </div>

        {/* ─── NODE INSPECTOR DRAWER (RIGHT PANEL) ─── */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bottom-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-4 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white inline-block mb-1"
                    style={{ backgroundColor: selectedNode.color }}
                  >
                    {selectedNode.type.replace('_', ' ')}
                  </span>
                  <h3 className="font-bold text-sm text-[#17172B] font-sora leading-snug">
                    {selectedNode.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Project Node Attributes */}
              {selectedNode.type === 'project' ? (
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {selectedNode.data.description}
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-bold text-[#6C4DFF]">{selectedNode.data.statusLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Language:</span>
                      <span className="font-bold text-slate-900">{selectedNode.data.primaryLanguage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">License:</span>
                      <span className="font-bold text-emerald-600">{selectedNode.data.license}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Viability:</span>
                      <span className="font-bold text-[#3878FF]">{selectedNode.data.viabilityScore}%</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">Extracted DNA Atoms:</span>
                    <div className="flex flex-wrap gap-1">
                      {dnaComponents.filter(d => d.projectId === selectedNode.id).map(d => (
                        <span key={d.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {d.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Component Node Attributes */
                <div className="space-y-2.5 text-xs text-slate-600">
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {selectedNode.data.description}
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Origin Repo:</span>
                      <strong className="text-slate-900">{selectedNode.data.projectName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Runtime:</span>
                      <span className="font-bold text-slate-800">{selectedNode.data.runtime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reusability Score:</span>
                      <span className="font-bold text-emerald-600">{selectedNode.data.reusabilityScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Coupling:</span>
                      <span className="font-bold text-[#3878FF]">{selectedNode.data.coupling}</span>
                    </div>
                  </div>

                  {/* Interface Contract Preview */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">Interface Contract:</span>
                    <pre className="p-2 rounded-xl bg-[#0F172A] text-cyan-300 font-mono text-[9px] overflow-x-auto max-h-24">
                      {selectedNode.data.interfaceContract}
                    </pre>
                  </div>

                  {/* Synergies with Other Nodes */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">Discovered Synergies:</span>
                    <div className="space-y-1">
                      {synergies.filter(s => s.sourceComponentId === selectedNode.id || s.targetComponentId === selectedNode.id).map(syn => (
                        <div key={syn.id} className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[10px]">
                          <div className="flex justify-between font-bold text-[#6C4DFF]">
                            <span>{syn.synergyType}</span>
                            <span>{syn.synergyScore}%</span>
                          </div>
                          <p className="text-slate-600 mt-0.5 line-clamp-1">{syn.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {selectedNode.type !== 'project' && (
                <>
                  <button
                    onClick={() => onPracticeDna?.(selectedNode.data)}
                    className="w-full py-2 px-3 rounded-xl bg-violet-50 hover:bg-violet-100 text-[#6C4DFF] border border-violet-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#6C4DFF]" />
                    <span>Practice in Live Sandbox</span>
                  </button>
                  <button
                    onClick={() => onSelectForFusion?.(selectedNode.data)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3878FF] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Add to Fusion Workspace</span>
                  </button>
                </>
              )}
              {selectedNode.type === 'project' && (
                <button
                  onClick={() => onNavigateToTab?.('dna', selectedNode.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Inspect Project DNA ({selectedNode.data.extractedDnaCount} Atoms)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
