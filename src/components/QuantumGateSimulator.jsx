import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Play, Pause, SkipForward, SkipBack, RefreshCw, BarChart2, Zap } from 'lucide-react';
import { SIMULATION_LIST, generateSimulationSteps } from '../data/quantumSimulations';
import BlochSphere from './quantum/BlochSphere';
import VisualCircuit from './quantum/VisualCircuit';
import AmplitudeHistogram from './quantum/AmplitudeHistogram';

const QuantumGateSimulator = () => {
  const [selectedSimId, setSelectedSimId] = useState(SIMULATION_LIST[0].id);
  const [q0, setQ0] = useState('0');
  const [q1, setQ1] = useState('0');
  const [q2, setQ2] = useState('0');

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [measuredResult, setMeasuredResult] = useState(null);
  const [shotsResult, setShotsResult] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per step
  useEffect(() => {
    const generated = generateSimulationSteps(selectedSimId, q0, q1, q2);
    setSteps(generated);
    setCurrentStep(0);
    setIsPlaying(false);
    setMeasuredResult(null);
    setShotsResult(null);
  }, [selectedSimId, q0, q1, q2]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, playbackSpeed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, playbackSpeed]);

  if (steps.length === 0) return null;

  const activeStep = steps[currentStep];
  const multiQubitGates = ['cnot', 'bell_state', 'swap', 'toffoli', 'deutsch_jozsa', 'grover'];
  const isMultiQubit = multiQubitGates.includes(selectedSimId);
  const isThreeQubit = selectedSimId === 'toffoli';

  const handleShot = (numShots) => {
    if (!activeStep.prob) return;
    
    if (numShots === 1) {
      const rand = Math.random() * 100;
      let cumulative = 0;
      for (const [state, prob] of Object.entries(activeStep.prob)) {
        cumulative += prob;
        if (rand < cumulative) {
          setMeasuredResult(`|${state}⟩`);
          return;
        }
      }
    } else {
      const results = {};
      for (const state of Object.keys(activeStep.prob)) results[state] = 0;
      
      for (let i = 0; i < numShots; i++) {
        const rand = Math.random() * 100;
        let cumulative = 0;
        for (const [state, prob] of Object.entries(activeStep.prob)) {
          cumulative += prob;
          if (rand < cumulative) {
            results[state]++;
            break;
          }
        }
      }
      setShotsResult(results);
    }
  };

  return (
    <div className="relative flex flex-col gap-6 w-full max-w-7xl mx-auto rounded-3xl p-1 overflow-hidden">
      
      {/* Premium Space Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[150px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-brand-orange rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-6 w-full h-full">
      {/* Top Config Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-orange/20 text-brand-orange rounded-xl">
            <Atom className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-main)]">Advanced IQTA Simulator</h2>
            <p className="text-sm text-[var(--text-secondary)]">Learn • Visualize • Simulate</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Select Experiment</label>
            <select
              value={selectedSimId}
              onChange={(e) => setSelectedSimId(e.target.value)}
              className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl px-4 py-2 focus:outline-none focus:border-brand-orange font-medium"
            >
              {SIMULATION_LIST.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">|q₀⟩</label>
            <select value={q0} onChange={e => setQ0(e.target.value)} className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl px-3 py-2 outline-none">
              <option value="0">|0⟩</option>
              <option value="1">|1⟩</option>
            </select>
          </div>
          {isMultiQubit && (
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">|q₁⟩</label>
              <select value={q1} onChange={e => setQ1(e.target.value)} className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl px-3 py-2 outline-none">
                <option value="0">|0⟩</option>
                <option value="1">|1⟩</option>
              </select>
            </div>
          )}
          {isThreeQubit && (
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">|q₂⟩</label>
              <select value={q2} onChange={e => setQ2(e.target.value)} className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl px-3 py-2 outline-none">
                <option value="0">|0⟩</option>
                <option value="1">|1⟩</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col: Explanation & Bloch Sphere */}
        <div className="flex flex-col gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">
              Step Explanation
            </h3>
            <div className="mb-2">
              <span className="text-xs bg-brand-orange/20 text-brand-orange px-2 py-1 rounded font-bold">
                STEP {currentStep + 1} OF {steps.length}
              </span>
            </div>
            <h4 className="text-xl font-bold text-[var(--text-main)] mb-2">{activeStep.name}</h4>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">
              {activeStep.explanation}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 border-t border-[var(--border-color)] pt-6 mt-6">
              <button
                onClick={() => setCurrentStep(0)}
                className="p-2 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--bg-main-hover)] text-[var(--text-secondary)] transition-colors border border-[var(--border-color)]"
                title="Reset"
              >
                <RefreshCw size={20} />
              </button>
              
              <button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="p-2 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--bg-main-hover)] text-[var(--text-secondary)] transition-colors disabled:opacity-50 border border-[var(--border-color)]"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                  isPlaying 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'bg-brand-orange text-white hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] border border-transparent'
                }`}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'PAUSE' : 'AUTO PLAY'}
              </button>

              <button
                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                disabled={currentStep === steps.length - 1}
                className="p-2 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--bg-main-hover)] text-[var(--text-secondary)] transition-colors disabled:opacity-50 border border-[var(--border-color)]"
              >
                <SkipForward size={20} />
              </button>
              
              {/* Playback Speed Controls */}
              <div className="flex items-center bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg p-1">
                {[
                  { label: '1x', val: 1500 },
                  { label: '2x', val: 750 },
                  { label: 'MAX', val: 300 }
                ].map(speed => (
                  <button
                    key={speed.label}
                    onClick={() => setPlaybackSpeed(speed.val)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                      playbackSpeed === speed.val ? 'bg-brand-orange text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl flex flex-col items-center">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4 w-full border-b border-[var(--border-color)] pb-2 text-left">
              3D Bloch Sphere
            </h3>
            {isMultiQubit ? (
              <div className="h-[250px] flex items-center justify-center text-center text-[var(--text-secondary)] p-6">
                Bloch Sphere visualization is strictly for single-qubit pure states. Multi-qubit entangled states cannot be faithfully represented on a single sphere.
              </div>
            ) : activeStep.bloch ? (
              <BlochSphere theta={activeStep.bloch.theta} phi={activeStep.bloch.phi} />
            ) : (
              <div className="h-[250px] flex items-center justify-center">Loading...</div>
            )}
          </div>
        </div>

        {/* Center/Right Col: Circuit, Math, Measurement */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Circuit */}
            <div className="bg-[#0f172a] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                Circuit Animation
              </h3>
              <div className="flex-1 flex items-center justify-center min-h-[160px] bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <VisualCircuit circuitData={activeStep.circuitData} activeCol={activeStep.activeCol} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Simulation Timeline Scrubber */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  <span>Start</span>
                  <span>Timeline</span>
                  <span>End</span>
                </div>
                <div className="relative h-2 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-color)] cursor-pointer">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-brand-orange transition-all duration-300 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  />
                  {steps.map((_, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setCurrentStep(idx)}
                      className="absolute top-0 bottom-0 w-[2px] bg-slate-900/50 hover:bg-white transition-colors"
                      style={{ left: `${(idx / (steps.length - 1)) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Matrix & State */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl flex flex-col">
              <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">
                Mathematics
              </h3>
              <div className="flex-1 flex flex-col justify-center gap-6">
                <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)] flex items-center justify-center min-h-[100px]">
                  <div className="font-mono text-[var(--text-main)] text-center text-lg" dangerouslySetInnerHTML={{ __html: activeStep.matrixHtml }} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-1">State Vector |ψ⟩</span>
                  <div className="font-serif italic text-xl font-bold text-brand-orange bg-brand-orange/10 p-3 rounded-xl border border-brand-orange/20 text-center">
                    {activeStep.stateVector}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Probabilities & Measurement */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-[var(--border-color)] pb-4 gap-4">
              <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-brand-orange" />
                Measurement Probabilities
              </h3>
              <div className="flex gap-2">
                <button onClick={() => handleShot(1)} className="px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-lg text-sm font-medium transition-colors">
                  Run 1 Shot
                </button>
                <button onClick={() => handleShot(1000)} className="px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--border-color)] border border-[var(--border-color)] rounded-lg text-sm font-medium transition-colors">
                  1000 Shots
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="text-sm text-[var(--text-secondary)] uppercase font-bold tracking-wider mb-2">State Amplitudes</div>
                <AmplitudeHistogram probData={activeStep.prob} />
              </div>

              <div className="bg-[var(--bg-main)] p-6 rounded-xl border border-[var(--border-color)] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Zap className="w-24 h-24" />
                </div>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Simulated Measurement</span>
                
                {measuredResult ? (
                  <div className="text-3xl font-black text-[var(--text-main)]">Collapsed to <span className="text-brand-orange">{measuredResult}</span></div>
                ) : shotsResult ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(shotsResult).map(([s, count]) => (
                      <div key={s} className="text-sm font-mono"><span className="text-[var(--text-secondary)]">|{s}⟩:</span> <span className="font-bold text-[var(--text-main)]">{count}</span></div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[var(--text-secondary)] italic">Click "Run Shot" to collapse the wave function.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
};

export default QuantumGateSimulator;
