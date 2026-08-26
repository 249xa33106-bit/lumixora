import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, TrendingUp, AlertTriangle, Play, RefreshCw, Zap, Award, Calendar, BookOpen, CheckSquare, PlusCircle, Globe, ArrowLeft, Sliders, CheckCircle, Flame, BarChart2 } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { checkAndSeedTwinData, fetchFullStudentHistory, generateAIPredictions, calculateDeterministicTwinPredictions, saveAcademicBaseline } from '../services/aiFutureTwinService';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import PublicScholarPortfolio from './PublicScholarPortfolio';

export default function AiFutureTwin({ user, setActiveTab }) {
  const { addToast } = useToast();
  const { awardXP } = useGamification();
  const [history, setHistory] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Setup Modal State
  const [showSetup, setShowSetup] = useState(false);
  const [savingSetup, setSavingSetup] = useState(false);
  const [setupData, setSetupData] = useState({
    cgpa: '8.2',
    target_cgpa: '9.0',
    attendance: '85',
    semester: 'Sem 3'
  });

  // Public Portfolio View State
  const [showPublicPortfolio, setShowPublicPortfolio] = useState(false);

  // Simulator parameters state
  const [simStudyHours, setSimStudyHours] = useState(3);
  const [simRevisionRate, setSimRevisionRate] = useState(80);
  const [simAttendance, setSimAttendance] = useState(85);
  const [simPyqRatio, setSimPyqRatio] = useState(70);

  // Simulated metrics overlay
  const [simulatedMetrics, setSimulatedMetrics] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const cleanScholarName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str;
    if (cleaned.includes('{')) {
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[\{\}":;]/g, '').trim();
    return cleaned || 'Scholar';
  };

  // Load and subscribe to Firestore changes
  useEffect(() => {
    if (!user?.id) return;

    const initData = async () => {
      setLoading(true);
      await checkAndSeedTwinData(user.id);
      
      const data = await fetchFullStudentHistory(user.id);
      if (data) {
        setHistory(data);
        const initialPreds = await generateAIPredictions(user.id, data);
        setPredictions(initialPreds);
        
        if (!data.goals?.previousCGPA) {
          setShowSetup(true);
        } else {
          setSetupData({
            cgpa: data.goals.previousCGPA || '8.2',
            target_cgpa: data.goals.targetCGPA || '9.0',
            attendance: data.goals.overallAttendance || '85',
            semester: data.goals.semester || 'Sem 3'
          });
        }
      }
      setLoading(false);
    };

    initData();

    // Set up real-time listener on StudySessions
    const sessionsColl = collection(db, 'Users', user.id, 'StudySessions');
    const unsubSessions = onSnapshot(sessionsColl, async () => {
      const data = await fetchFullStudentHistory(user.id);
      if (data) {
        setHistory(data);
        const updatedPreds = calculateDeterministicTwinPredictions(data);
        setPredictions(prev => ({
          ...prev,
          metrics: updatedPreds.metrics,
          subjectPassingProbabilities: updatedPreds.subjectPassingProbabilities,
          lastUpdated: new Date().toISOString()
        }));
      }
    });

    return () => unsubSessions();
  }, [user?.id]);

  const handleSaveSetup = async () => {
    if (!setupData.cgpa || !setupData.target_cgpa) {
      addToast({ message: 'Please enter current and target CGPA', type: 'error' });
      return;
    }
    setSavingSetup(true);
    try {
      await saveAcademicBaseline(user.id, setupData);
      addToast({ message: 'Academic Baseline Saved!', type: 'success' });
      setShowSetup(false);
      const data = await fetchFullStudentHistory(user.id);
      if (data) {
        setHistory(data);
        const freshPreds = await generateAIPredictions(user.id, data);
        setPredictions(freshPreds);
      }
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to save baseline', type: 'error' });
    } finally {
      setSavingSetup(false);
    }
  };

  const handleFullAIAnalysis = async () => {
    if (!user?.id || !history) return;
    setRefreshing(true);
    addToast({ message: 'Syncing Twin with neural prediction engines...', type: 'info' });
    try {
      const freshPreds = await generateAIPredictions(user.id, history);
      setPredictions(freshPreds);
      addToast({ message: 'Twin intelligence synced successfully!', type: 'success' });
      awardXP(100, 'Synced AI Twin');
    } catch (err) {
      addToast({ message: 'AI Sync failed', type: 'error' });
    } finally {
      setRefreshing(false);
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const baseCGPA = Number(setupData.cgpa) || 8.2;
      const hoursFactor = (simStudyHours - 2) * 0.15;
      const revisionFactor = (simRevisionRate - 70) * 0.005;
      const attendanceFactor = (simAttendance - 75) * 0.004;

      const simCGPA = Math.min(10, Math.max(5, (baseCGPA + hoursFactor + revisionFactor + attendanceFactor))).toFixed(2);
      const simSemPct = Math.min(100, Math.max(40, Math.round(85 + hoursFactor * 10 + revisionFactor * 20)));
      const simPlacement = Math.min(100, Math.max(10, Math.round(20 + hoursFactor * 25 + simPyqRatio * 0.3)));
      const simBurnout = Math.min(100, Math.max(5, Math.round(10 + hoursFactor * 20)));

      setSimulatedMetrics({
        projectedCGPA: simCGPA,
        projectedSemesterPercentage: `${simSemPct}%`,
        placementReadiness: `${simPlacement}%`,
        burnoutRisk: simBurnout > 40 ? 'High' : simBurnout > 20 ? 'Moderate' : '10%'
      });
      setIsSimulating(false);
      addToast({ message: 'Simulation parameters updated!', type: 'success' });
    }, 400);
  };

  if (showPublicPortfolio) {
    return <PublicScholarPortfolio user={user} history={history} predictions={predictions} onBack={() => setShowPublicPortfolio(false)} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Sparkles className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-sm font-bold text-gray-400">Synchronizing Predictive Academic Digital Twin...</p>
      </div>
    );
  }

  const activeMetrics = simulatedMetrics || {
    projectedCGPA: predictions?.metrics?.projectedCGPA || '8.90',
    projectedSemesterPercentage: predictions?.metrics?.projectedSemesterPercentage || '85%',
    placementReadiness: predictions?.metrics?.placementReadiness || '20%',
    burnoutRisk: predictions?.metrics?.burnoutRisk || '10%'
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 text-left">

      {/* TOP HEADER BAR */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
              <span>Welcome back, {cleanScholarName(user?.name)}</span>
              <span className="text-amber-400">👋</span>
            </h2>
            <p className="text-[11px] text-gray-400 font-medium">Explore your personalized academic portal</p>
          </div>
        </div>
      </div>
      
      {/* MAIN HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d0f1a] via-[#121526] to-[#0c0d16] p-6 md:p-10 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/15 via-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide mb-4">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Future Twin™ Live</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Predictive Academic Digital Twin
            </h1>
            <p className="text-gray-300 mt-2.5 text-xs md:text-sm leading-relaxed font-normal">
              Lumixora monitors your daily study streaks, attendance rates, and quiz precision to project future milestones, placement potential, and CGPA trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPublicPortfolio(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Globe className="w-4 h-4" />
              <span>PUBLIC AI TWIN PORTFOLIO</span>
            </button>

            <button
              onClick={handleFullAIAnalysis}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 text-white text-xs font-bold flex items-center gap-2 shadow-xl hover:opacity-90 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>NEURAL RECALCULATE</span>
            </button>

            <button
              onClick={() => setShowSetup(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
            >
              <span>UPDATE BASELINE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Expected CGPA */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 relative overflow-hidden space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold text-emerald-400">Expected CGPA</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
              <Brain className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white block tracking-tight">{activeMetrics.projectedCGPA}</span>
          <p className="text-[10px] text-gray-400 font-medium">Projected based on current study trajectory</p>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(Number(activeMetrics.projectedCGPA) / 10) * 100}%` }}></div>
          </div>
        </div>

        {/* Card 2: Projected Semester % */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 relative overflow-hidden space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold text-purple-400">Projected Semester %</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center border border-purple-500/30">
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white block tracking-tight">{activeMetrics.projectedSemesterPercentage}</span>
          <p className="text-[10px] text-gray-400 font-medium">Equates to estimated internal scores</p>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: activeMetrics.projectedSemesterPercentage }}></div>
          </div>
        </div>

        {/* Card 3: Placement Readiness */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 relative overflow-hidden space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold text-amber-400">Placement Readiness</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white block tracking-tight">{activeMetrics.placementReadiness}</span>
          <p className="text-[10px] text-gray-400 font-medium">Calculated from DSA + coding practice</p>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: activeMetrics.placementReadiness }}></div>
          </div>
        </div>

        {/* Card 4: Burnout Risk */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 relative overflow-hidden space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold text-indigo-400">Burnout Risk</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/30">
              <AlertTriangle className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white block tracking-tight">{activeMetrics.burnoutRisk}</span>
          <p className="text-[10px] text-gray-400 font-medium">Risk score relative to target consistency</p>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400 rounded-full" style={{ width: '15%' }}></div>
          </div>
        </div>

      </div>

      {/* CGPA GROWTH TIMELINE & FUTURE SIMULATOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: CGPA Growth Timeline with Graph */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 bg-black/40 space-y-5">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>CGPA Growth Timeline & Interactive Trajectory Graph</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                Live neural curve simulated across past, current, and forecasted semesters.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 shrink-0">
              PREDICTED: {activeMetrics.projectedCGPA} CGPA
            </span>
          </div>

          {/* Dynamic SVG Graph & Semester Cards */}
          {(() => {
            const sem1 = 7.8;
            const sem2 = 8.2;
            const sem3 = Number(setupData.cgpa) || 8.5;
            const sem4 = Number(activeMetrics.projectedCGPA) || 8.88;
            const targetCGPA = Number(setupData.target_cgpa) || 9.0;

            const width = 500;
            const height = 180;
            const paddingLeft = 45;
            const paddingRight = 45;
            const paddingTop = 30;
            const paddingBottom = 40;

            const minY = 6.0;
            const maxY = 10.0;

            const getY = (val) => {
              const clamped = Math.min(maxY, Math.max(minY, val));
              const ratio = (clamped - minY) / (maxY - minY);
              return height - paddingBottom - ratio * (height - paddingTop - paddingBottom);
            };

            const points = [
              { sem: 'Sem 1', val: sem1.toFixed(1), x: paddingLeft, y: getY(sem1), status: 'Completed' },
              { sem: 'Sem 2', val: sem2.toFixed(1), x: paddingLeft + (width - paddingLeft - paddingRight) * 0.33, y: getY(sem2), status: 'Completed' },
              { sem: 'Sem 3', val: sem3.toFixed(1), x: paddingLeft + (width - paddingLeft - paddingRight) * 0.66, y: getY(sem3), status: 'Current' },
              { sem: 'Sem 4', val: sem4.toFixed(2), x: width - paddingRight, y: getY(sem4), status: 'Predicted' }
            ];

            const p0 = points[0];
            const p1 = points[1];
            const p2 = points[2];
            const p3 = points[3];

            const linePath = `M ${p0.x} ${p0.y} C ${p0.x + 40} ${p0.y}, ${p1.x - 40} ${p1.y}, ${p1.x} ${p1.y} C ${p1.x + 40} ${p1.y}, ${p2.x - 40} ${p2.y}, ${p2.x} ${p2.y} C ${p2.x + 40} ${p2.y}, ${p3.x - 40} ${p3.y}, ${p3.x} ${p3.y}`;
            const areaPath = `${linePath} L ${p3.x} ${height - paddingBottom} L ${p0.x} ${height - paddingBottom} Z`;
            const targetY = getY(targetCGPA);

            return (
              <div className="space-y-4">
                {/* SVG Visual Graph */}
                <div className="relative w-full overflow-hidden rounded-2xl bg-black/60 border border-white/5 p-2 sm:p-4 shadow-inner">
                  {/* Target Goal Badge */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-extrabold text-amber-300 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    Target Goal: {targetCGPA.toFixed(1)} CGPA
                  </div>

                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-md">
                    <defs>
                      <linearGradient id="cgpaAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="60%" stopColor="#a855f7" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="cgpaStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="60%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                      <filter id="glowG" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Horizontal Reference Lines */}
                    {[7.0, 8.0, 9.0, 10.0].map((level) => {
                      const yPos = getY(level);
                      return (
                        <g key={level}>
                          <line
                            x1={paddingLeft - 10}
                            y1={yPos}
                            x2={width - paddingRight + 10}
                            y2={yPos}
                            stroke="#ffffff"
                            strokeOpacity="0.08"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={paddingLeft - 15}
                            y={yPos + 3}
                            fill="#64748b"
                            fontSize="9"
                            fontFamily="sans-serif"
                            fontWeight="bold"
                            textAnchor="end"
                          >
                            {level.toFixed(1)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Target CGPA Gold Line */}
                    <line
                      x1={paddingLeft}
                      y1={targetY}
                      x2={width - paddingRight}
                      y2={targetY}
                      stroke="#f59e0b"
                      strokeOpacity="0.4"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />

                    {/* Area Fill */}
                    <path d={areaPath} fill="url(#cgpaAreaGradient)" />

                    {/* Main Line */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="url(#cgpaStrokeGradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      filter="url(#glowG)"
                    />

                    {/* Data Points */}
                    {points.map((pt, i) => (
                      <g key={i} className="cursor-pointer group">
                        {(pt.status === 'Predicted' || pt.status === 'Current') && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="11"
                            fill={pt.status === 'Predicted' ? '#a855f7' : '#10b981'}
                            fillOpacity="0.25"
                            className="animate-pulse"
                          />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5.5"
                          fill={pt.status === 'Predicted' ? '#c084fc' : pt.status === 'Current' ? '#10b981' : '#e2e8f0'}
                          stroke="#0e0e1a"
                          strokeWidth="2.5"
                        />
                        <rect
                          x={pt.x - 22}
                          y={pt.y - 23}
                          width="44"
                          height="16"
                          rx="4"
                          fill="#10101c"
                          stroke={pt.status === 'Predicted' ? '#a855f7' : '#ffffff20'}
                          strokeWidth="1"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 12}
                          fill={pt.status === 'Predicted' ? '#c084fc' : '#ffffff'}
                          fontSize="9"
                          fontWeight="900"
                          textAnchor="middle"
                        >
                          {pt.val}
                        </text>
                        <text
                          x={pt.x}
                          y={height - paddingBottom + 18}
                          fill={pt.status === 'Predicted' ? '#c084fc' : '#94a3b8'}
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {pt.sem}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Semester Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { sem: 'Sem 1', cgpa: `${sem1.toFixed(1)}`, status: 'Completed', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
                    { sem: 'Sem 2', cgpa: `${sem2.toFixed(1)}`, status: 'Completed', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
                    { sem: 'Sem 3 (Current)', cgpa: `${sem3.toFixed(1)}`, status: 'In Progress', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
                    { sem: 'Sem 4 (Forecast)', cgpa: `${sem4.toFixed(2)}`, status: 'Predicted Outcome', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-black/30 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${s.color}`}>{s.sem}</span>
                        <span className="text-[11px] font-bold text-gray-300">{s.status}</span>
                      </div>
                      <span className="text-xs font-black text-white">{s.cgpa} CGPA</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right: Future Simulator */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40 space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white">Future Simulator</h3>
          </div>
          <p className="text-xs text-gray-400">Adjust parameters to simulate your future academic outcome.</p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Daily Study Hours:</span>
                <span className="text-emerald-400 font-extrabold">{simStudyHours} hrs/day</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={simStudyHours}
                onChange={(e) => setSimStudyHours(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Target Revision Rate:</span>
                <span className="text-purple-400 font-extrabold">{simRevisionRate}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={simRevisionRate}
                onChange={(e) => setSimRevisionRate(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Class Attendance:</span>
                <span className="text-blue-400 font-extrabold">{simAttendance}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={simAttendance}
                onChange={(e) => setSimAttendance(Number(e.target.value))}
                className="w-full accent-blue-400 cursor-pointer"
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-purple-600 text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer mt-2"
            >
              {isSimulating ? 'Simulating Output...' : 'Run Simulation'}
            </button>
          </div>
        </div>

      </div>

      {/* BASELINE SETUP MODAL */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0f1d] p-6 md:p-8 rounded-3xl border border-white/15 max-w-md w-full space-y-4">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-400" />
              <span>Academic Baseline Setup</span>
            </h3>
            <p className="text-xs text-gray-400">Configure your current CGPA and target goals to calibrate your AI Future Twin™.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Current CGPA:</label>
                <input
                  type="number"
                  step="0.01"
                  value={setupData.cgpa}
                  onChange={(e) => setSetupData(prev => ({ ...prev, cgpa: e.target.value }))}
                  placeholder="e.g. 8.2"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Target CGPA Goal:</label>
                <input
                  type="number"
                  step="0.01"
                  value={setupData.target_cgpa}
                  onChange={(e) => setSetupData(prev => ({ ...prev, target_cgpa: e.target.value }))}
                  placeholder="e.g. 9.0"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Overall Attendance (%):</label>
                <input
                  type="number"
                  value={setupData.attendance}
                  onChange={(e) => setSetupData(prev => ({ ...prev, attendance: e.target.value }))}
                  placeholder="e.g. 85"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowSetup(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSetup}
                disabled={savingSetup}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-purple-600 text-white font-extrabold text-xs cursor-pointer hover:opacity-90"
              >
                {savingSetup ? 'Saving...' : 'Save Baseline'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
