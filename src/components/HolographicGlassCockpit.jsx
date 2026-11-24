import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Terminal, Activity, ShieldCheck, Cpu, Volume2, 
  CheckCircle2, Play, Code2, Award, Zap, Radio, Globe, 
  Lock, ArrowRight, Layers, Flame, Target, ChevronRight
} from 'lucide-react';

/* ─── WEB AUDIO FEEDBACK HELPER ─── */
const playHologramClick = (freq = 720) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
};

export default function HolographicGlassCockpit({ onActionClick }) {
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('placement'); // 'placement' | 'boloclass' | 'code' | 'perks' | 'certs'
  const [isHovered, setIsHovered] = useState(false);
  const [testRunSuccess, setTestRunSuccess] = useState(false);
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);

  // 3D Parallax Mouse Physics
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Subtle 3D perspective rotation (max +/- 8 degrees for elegance)
    const rotateX = -(y / (rect.height / 2)) * 7;
    const rotateY = (x / (rect.width / 2)) * 7;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Run test simulation
  const handleRunCode = () => {
    playHologramClick(920);
    setTestRunSuccess(true);
    setTimeout(() => setTestRunSuccess(false), 3000);
  };

  // Audio waveform pulse simulation
  const handlePulseAudio = () => {
    playHologramClick(540);
    setIsSimulatingAudio(true);
    setTimeout(() => setIsSimulatingAudio(false), 2400);
  };

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto py-6"
      style={{ perspective: '1400px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Outer Ambient Holographic Glow Aura ── */}
      <div 
        className="absolute -inset-2 bg-gradient-to-r from-[#7553E8]/30 via-[#08BFD0]/30 to-[#00B987]/30 rounded-[36px] blur-2xl opacity-50 transition-opacity duration-500 pointer-events-none"
        style={{ opacity: isHovered ? 0.8 : 0.45 }}
      />

      {/* ── 3D Tilting Glass Cockpit Container ── */}
      <div
        ref={containerRef}
        className="relative rounded-3xl bg-[#0B1120]/90 border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden transition-transform duration-200 ease-out text-white"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Specular Light Reflection Sweep on 3D Tilt */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent pointer-events-none transition-opacity duration-300"
          style={{
            transform: `translate(${rotate.y * 12}px, ${rotate.x * 12}px)`
          }}
        />

        {/* ── Header HUD Window Bar ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-xs" />
            </div>
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10 font-mono text-[11px] text-gray-400">
              <Terminal className="w-3.5 h-3.5 text-[#08BFD0]" />
              <span>lumixora.os // 3d-spatial-cockpit</span>
            </div>
          </div>

          {/* Interactive Feature Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'placement', label: 'Placement Radar', icon: Target },
              { id: 'boloclass', label: 'BoloClass Audio', icon: Volume2 },
              { id: 'code', label: 'Code Arena', icon: Code2 },
              { id: 'perks', label: 'Student Perks', icon: Zap },
              { id: 'certs', label: 'Proof-of-Skill', icon: ShieldCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playHologramClick(780);
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#7553E8] to-[#08BFD0] text-white shadow-md shadow-[#7553E8]/30 scale-105' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00B987] animate-ping" />
            <span className="text-[10px] font-mono font-bold text-[#00B987] uppercase tracking-wider hidden sm:inline">
              120 FPS Spatial Live
            </span>
          </div>
        </div>

        {/* ── Interactive Cockpit Body ── */}
        <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
          
          {/* TAB 1: AI PLACEMENT COMMANDER RADAR */}
          {activeTab === 'placement' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08BFD0]/10 border border-[#08BFD0]/30 text-[11px] font-bold text-[#08BFD0] uppercase tracking-wider">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Continuous Placement Telemetry
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  AI Placement Commander
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed font-normal">
                  Your 24/7 autonomous career radar. It continuously calculates your role readiness, runs ATS resume simulations, and maps your path to Tier-1 product offers.
                </p>

                {/* Company target badges */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                    Target Role Alignment:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Google SDE-1 (88%)', 'Cisco Cloud (94%)', 'Swiggy Backend (91%)', 'AI Startups (96%)'].map((role, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-200 hover:border-[#08BFD0]/50 hover:bg-[#08BFD0]/10 transition-colors cursor-default"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Radar Gauge */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-[#7553E8]/10 via-transparent to-transparent pointer-events-none" />
                
                {/* Simulated Radar Circles */}
                <div className="relative w-44 h-44 rounded-full border border-[#08BFD0]/30 flex items-center justify-center">
                  <div className="absolute w-32 h-32 rounded-full border border-dashed border-[#7553E8]/40 animate-spin" style={{ animationDuration: '14s' }} />
                  <div className="absolute w-20 h-20 rounded-full border border-[#00B987]/30" />
                  
                  {/* Center Score */}
                  <div className="text-center z-10">
                    <span className="text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#08BFD0] to-[#00B987]">
                      89%
                    </span>
                    <span className="block text-[10px] font-mono text-gray-400 font-bold uppercase">
                      Campus Rank: Top 2%
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between w-full text-xs font-mono text-gray-400 pt-2 border-t border-white/10">
                  <span>ATS Score: <strong className="text-white">96/100</strong></span>
                  <span>Mock Rounds: <strong className="text-[#00B987]">18 Cleared</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOLOCLASS INTERACTIVE AUDIO */}
          {activeTab === 'boloclass' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7553E8]/20 border border-[#7553E8]/40 text-[11px] font-bold text-[#7553E8] uppercase tracking-wider">
                  <Volume2 className="w-3 h-3 text-[#7553E8]" />
                  Interactive Voice-First Classroom
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  BoloClass — Learn by Speaking
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed font-normal">
                  Stop passively watching hours of boring videos. In BoloClass, you debate concepts out loud, answer live Socratic questions, and get evaluated by AI voice mentors in real time.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handlePulseAudio}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7553E8] to-[#08BFD0] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#7553E8]/25 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {isSimulatingAudio ? 'Audio Stream Pulsing...' : 'Test Voice Waveform'}
                  </button>
                  <span className="text-xs text-gray-400 font-mono">
                    Ultra-Low Latency WebRTC
                  </span>
                </div>
              </div>

              {/* Right: Audio Waveform Visualizer */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
                <div className="w-full flex items-end justify-center gap-1.5 h-28 px-4 bg-black/40 rounded-xl border border-white/5">
                  {[24, 48, 70, 95, 60, 35, 80, 100, 75, 45, 90, 65, 30, 85, 40].map((h, i) => (
                    <div
                      key={i}
                      className={`w-2 rounded-t-full transition-all duration-200 ${
                        isSimulatingAudio 
                          ? 'bg-gradient-to-t from-[#7553E8] to-[#08BFD0] animate-pulse' 
                          : 'bg-white/20'
                      }`}
                      style={{ 
                        height: isSimulatingAudio ? `${Math.min(h * 1.1, 100)}%` : `${Math.max(h * 0.35, 12)}%` 
                      }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between w-full text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1 text-[#00B987]">
                    <Radio className="w-3 h-3" /> Voice Synthesizer Ready
                  </span>
                  <span>Noise Gate: -42dB</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CODE ARENA */}
          {activeTab === 'code' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-[#08BFD0]" />
                    Code Arena & Monaco Crucible
                  </h3>
                  <p className="text-xs text-gray-300">
                    High-performance coding sandbox with automated test-case runner and zero execution latency.
                  </p>
                </div>
                <button
                  onClick={handleRunCode}
                  className="px-4 py-2 rounded-xl bg-[#00B987] hover:bg-[#00D098] text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#00B987]/30 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {testRunSuccess ? '✓ 4/4 Tests Passed!' : 'Run Test Cases'}
                </button>
              </div>

              {/* Code Snippet Block */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-200 leading-relaxed overflow-x-auto">
                <div className="text-gray-500 pb-2 border-b border-white/10 flex justify-between">
                  <span>// Solution.ts — Two-Pointer Optimization O(N)</span>
                  <span>TypeScript 5.4</span>
                </div>
                <pre className="pt-2 text-gray-300">
                  <span className="text-purple-400">function</span> <span className="text-blue-400">maxSubArrayLen</span>(nums: <span className="text-yellow-300">number[]</span>, k: <span className="text-yellow-300">number</span>): <span className="text-yellow-300">number</span> {'{\n'}
                  {'  '}const map = <span className="text-purple-400">new</span> <span className="text-yellow-300">Map</span>&lt;<span className="text-yellow-300">number</span>, <span className="text-yellow-300">number</span>&gt;();{'\n'}
                  {'  '}let maxLen = <span className="text-emerald-400">0</span>, sum = <span className="text-emerald-400">0</span>;{'\n'}
                  {'  '}nums.<span className="text-blue-400">forEach</span>((n, i) =&gt; {'{'}{'\n'}
                  {'    '}sum += n;{'\n'}
                  {'    '}if (sum === k) maxLen = i + <span className="text-emerald-400">1</span>;{'\n'}
                  {'    '}if (!map.<span className="text-blue-400">has</span>(sum)) map.<span className="text-blue-400">set</span>(sum, i);{'\n'}
                  {'  '}{'}'});{'\n'}
                  {'  '}<span className="text-purple-400">return</span> maxLen;{'\n'}
                  {'}'}
                </pre>
              </div>

              {testRunSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 text-xs font-mono flex items-center justify-between animate-fadeIn">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    All Invariant Boundaries Checked: 4/4 Passed (Execution: 8.4ms)
                  </span>
                  <span className="text-emerald-400 font-bold">Memory: 14.2 MB</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STUDENT PERKS */}
          {activeTab === 'perks' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Student Perks & Developer Credits
                  </h3>
                  <p className="text-xs text-gray-300">
                    Access ₹5,00,000+ worth of developer subscriptions, cloud credits, and professional tools for free.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                  100% Subsidized
                </span>
              </div>

              {/* 4 Perks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { name: 'AWS Cloud', credit: '$5,000 Credits', desc: 'Compute & Database' },
                  { name: 'GitHub Pro', credit: 'Free Student Pack', desc: 'Copilot & Actions' },
                  { name: 'JetBrains', credit: 'All Products Pack', desc: 'IntelliJ & WebStorm' },
                  { name: 'DigitalOcean', credit: '$200 Droplet Credits', desc: 'Kubernetes Hosting' }
                ].map((perk, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/40 transition-colors">
                    <div className="font-bold text-sm text-white">{perk.name}</div>
                    <div className="text-xs font-mono text-amber-300 font-bold mt-1">{perk.credit}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{perk.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROOF-OF-SKILL */}
          {activeTab === 'certs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B987]/20 border border-[#00B987]/40 text-[11px] font-bold text-[#00B987] uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Tamper-Proof Verification
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Proof-of-Skill Certificates
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed font-normal">
                  No fake certificates. Every credential issued by Lumixora is cryptographically sealed with a public SHA-256 hash and verifiable by recruiters via 1-click QR scanning.
                </p>

                <div className="pt-2 font-mono text-[11px] text-gray-400 space-y-1">
                  <div>Ledger Hash: <span className="text-[#08BFD0]">0x9f4a...882e3c</span></div>
                  <div>Standard: <span className="text-white">OpenCerts 3.0 / W3C Verifiable Credential</span></div>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-2xl bg-white/[0.04] border border-white/15 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7553E8] to-[#08BFD0] p-0.5 shadow-xl shadow-[#7553E8]/30 mb-3">
                  <div className="w-full h-full bg-[#0B1120] rounded-[14px] flex items-center justify-center">
                    <Award className="w-8 h-8 text-[#08BFD0]" />
                  </div>
                </div>
                <div className="font-bold text-sm text-white">Full Stack Engineering Fellow</div>
                <div className="text-xs text-[#00B987] font-mono mt-0.5 font-bold">100% Cryptographically Verified</div>
                <div className="mt-3 text-[10px] px-3 py-1 rounded bg-black/50 border border-white/10 text-gray-400 font-mono">
                  Scan QR to Verify on Public Ledger
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer Strip */}
          <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 text-gray-400">
              <span className="flex items-center gap-1.5 text-[#00B987]">
                <CheckCircle2 className="w-4 h-4" /> 14 Integrated Workspaces
              </span>
              <span>•</span>
              <span>Zero-Config Browser Experience</span>
            </div>

            <button
              onClick={() => onActionClick && onActionClick('student')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#101A35] font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Explore Live inside Lumixora</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7553E8]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
