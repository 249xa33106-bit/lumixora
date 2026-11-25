import React, { useState, useRef, useEffect } from 'react';
import { 
  Server, Database, Cloud, Radio, Cpu, Layers, Share2, 
  Play, Pause, RotateCcw, Check, Sparkles, Send, Box, Globe
} from 'lucide-react';

const INFRA_COMPONENTS = [
  { id: 'client', label: 'Client (Web/iOS)', icon: Globe, color: '#38bdf8', category: 'Edge' },
  { id: 'cdn', label: 'Cloudflare CDN', icon: Cloud, color: '#fb923c', category: 'Edge' },
  { id: 'gateway', label: 'API Gateway', icon: Layers, color: '#a855f7', category: 'Routing' },
  { id: 'service', label: 'Core Microservice', icon: Server, color: '#00f5d4', category: 'Compute' },
  { id: 'cache', label: 'Redis Cache Cluster', icon: Cpu, color: '#f43f5e', category: 'Cache' },
  { id: 'db', label: 'PostgreSQL Primary', icon: Database, color: '#3b82f6', category: 'Storage' },
  { id: 'queue', label: 'Kafka Event Broker', icon: Radio, color: '#eab308', category: 'Async' }
];

const PRESETS = {
  url_shortener: {
    title: 'URL Shortener (Bitly Scale)',
    nodes: [
      { id: 'c1', type: 'client', label: 'Client App', x: 60, y: 150 },
      { id: 'c2', type: 'cdn', label: 'Edge CDN', x: 220, y: 150 },
      { id: 'c3', type: 'gateway', label: 'API Gateway', x: 380, y: 150 },
      { id: 'c4', type: 'service', label: 'Redirect Service', x: 540, y: 150 },
      { id: 'c5', type: 'cache', label: 'Redis Cache (99% Hit)', x: 700, y: 80 },
      { id: 'c6', type: 'db', label: 'PostgreSQL Links DB', x: 700, y: 220 }
    ],
    connections: [
      { from: 'c1', to: 'c2' },
      { from: 'c2', to: 'c3' },
      { from: 'c3', to: 'c4' },
      { from: 'c4', to: 'c5' },
      { from: 'c4', to: 'c6' }
    ]
  },
  realtime_chat: {
    title: 'Real-Time Messaging (WhatsApp/Slack)',
    nodes: [
      { id: 'c1', type: 'client', label: 'Mobile Client', x: 60, y: 150 },
      { id: 'c2', type: 'gateway', label: 'WebSocket Gateway', x: 240, y: 150 },
      { id: 'c3', type: 'queue', label: 'Kafka Message Bus', x: 440, y: 150 },
      { id: 'c4', type: 'service', label: 'Chat Worker', x: 640, y: 150 },
      { id: 'c5', type: 'cache', label: 'Redis Presence', x: 640, y: 60 },
      { id: 'c6', type: 'db', label: 'Chat History Store', x: 640, y: 240 }
    ],
    connections: [
      { from: 'c1', to: 'c2' },
      { from: 'c2', to: 'c3' },
      { from: 'c3', to: 'c4' },
      { from: 'c4', to: 'c5' },
      { from: 'c4', to: 'c6' }
    ]
  }
};

export default function ArchitectureWhiteboard({ onShareArchitecture = () => {} }) {
  const [selectedPreset, setSelectedPreset] = useState('url_shortener');
  const [activeNodes, setActiveNodes] = useState(PRESETS.url_shortener.nodes);
  const [activeConnections, setActiveConnections] = useState(PRESETS.url_shortener.connections);
  const [isSimulatingPackets, setIsSimulatingPackets] = useState(true);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [packetTick, setPacketTick] = useState(0);

  const canvasRef = useRef(null);

  // Switch preset
  const handleSelectPreset = (key) => {
    setSelectedPreset(key);
    setActiveNodes(PRESETS[key].nodes);
    setActiveConnections(PRESETS[key].connections);
  };

  // Add custom infrastructure block
  const handleAddBlock = (type) => {
    const meta = INFRA_COMPONENTS.find(c => c.id === type) || INFRA_COMPONENTS[0];
    const newId = `node_${Date.now()}`;
    const newNode = {
      id: newId,
      type: meta.id,
      label: meta.label,
      x: 300 + Math.random() * 80,
      y: 120 + Math.random() * 80
    };
    setActiveNodes(prev => [...prev, newNode]);
  };

  // Packet animation loop
  useEffect(() => {
    if (!isSimulatingPackets) return;
    const interval = setInterval(() => {
      setPacketTick(prev => (prev + 0.05) % 1);
    }, 40);
    return () => clearInterval(interval);
  }, [isSimulatingPackets]);

  // Handle Dragging
  const handleMouseDown = (nodeId, e) => {
    const node = activeNodes.find(n => n.id === nodeId);
    if (!node) return;
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeId) return;
    setActiveNodes(prev => prev.map(node => {
      if (node.id === draggingNodeId) {
        return {
          ...node,
          x: Math.max(20, Math.min(840, e.clientX - dragOffset.x)),
          y: Math.max(20, Math.min(320, e.clientY - dragOffset.y))
        };
      }
      return node;
    }));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleShare = () => {
    const summary = `System Architecture for ${PRESETS[selectedPreset]?.title || 'Custom Design'}:\n${activeNodes.map(n => `- [${n.label}] at position (${Math.round(n.x)}, ${Math.round(n.y)})`).join('\n')}\nUtilizes multi-layer caching with zero-downtime routing.`;
    onShareArchitecture(summary);
  };

  return (
    <div 
      className="space-y-4 font-sans text-xs select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Controls Header */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
            Interactive System Design Canvas & Architecture Whiteboard
          </span>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 font-mono">Blueprint:</span>
          {Object.entries(PRESETS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer ${
                selectedPreset === key 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' 
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {key === 'url_shortener' ? 'URL Shortener' : 'Real-Time Chat'}
            </button>
          ))}

          <button
            onClick={() => setIsSimulatingPackets(!isSimulatingPackets)}
            className={`p-1.5 rounded-xl border text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isSimulatingPackets 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                : 'bg-white/5 text-gray-400 border-white/5'
            }`}
            title="Toggle Live Packet Streams"
          >
            {isSimulatingPackets ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            <span>Packets</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Present to Interviewer</span>
          </button>
        </div>
      </div>

      {/* Palette Bar: Add Components */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider shrink-0">Add Block:</span>
        {INFRA_COMPONENTS.map(comp => {
          const Icon = comp.icon;
          return (
            <button
              key={comp.id}
              onClick={() => handleAddBlock(comp.id)}
              className="px-2.5 py-1 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shrink-0 text-[10px] font-mono"
            >
              <Icon className="w-3 h-3" style={{ color: comp.color }} />
              <span>{comp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Canvas Drawing Area */}
      <div 
        ref={canvasRef}
        className="relative w-full h-[360px] rounded-3xl bg-[#07080e] border border-white/10 overflow-hidden shadow-inner"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* SVG Connecting Lines with Live Animated Packets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {activeConnections.map((conn, idx) => {
            const fromNode = activeNodes.find(n => n.id === conn.from);
            const toNode = activeNodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 60;
            const y1 = fromNode.y + 24;
            const x2 = toNode.x + 60;
            const y2 = toNode.y + 24;

            // Packet position
            const packetX = x1 + (x2 - x1) * packetTick;
            const packetY = y1 + (y2 - y1) * packetTick;

            return (
              <g key={idx}>
                {/* Static Wire */}
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="rgba(0, 245, 212, 0.25)" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                />
                
                {/* Glowing Flowing Packet */}
                {isSimulatingPackets && (
                  <circle 
                    cx={packetX} cy={packetY} r="4" 
                    fill="#00f5d4" 
                    filter="drop-shadow(0 0 6px #00f5d4)"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Draggable Infrastructure Nodes */}
        {activeNodes.map(node => {
          const meta = INFRA_COMPONENTS.find(c => c.id === node.type) || INFRA_COMPONENTS[0];
          const Icon = meta.icon;
          const isDragging = draggingNodeId === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
              style={{
                transform: `translate(${node.x}px, ${node.y}px)`
              }}
              className={`absolute top-0 left-0 p-2.5 px-3.5 rounded-2xl border transition-shadow cursor-grab active:cursor-grabbing backdrop-blur-md flex items-center gap-2.5 z-10 ${
                isDragging 
                  ? 'border-cyan-400 bg-cyan-950/80 shadow-2xl shadow-cyan-500/30 scale-105' 
                  : 'border-white/15 bg-black/70 hover:border-cyan-500/50 hover:bg-black/90 shadow-lg'
              }`}
            >
              <div 
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${meta.color}25`, border: `1px solid ${meta.color}50` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
              </div>
              <div>
                <p className="font-mono font-bold text-white text-[11px] leading-tight">
                  {node.label}
                </p>
                <p className="text-[9px] text-gray-400 font-mono">
                  {meta.category} • Latency &lt;5ms
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
