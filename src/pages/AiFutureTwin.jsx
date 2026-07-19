import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, TrendingUp, AlertTriangle, Play, RefreshCw, Zap, Award, Calendar, BookOpen, CheckSquare, PlusCircle } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, addDoc, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { checkAndSeedTwinData, fetchFullStudentHistory, generateAIPredictions, calculateDeterministicTwinPredictions } from '../services/aiFutureTwinService';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';

export default function AiFutureTwin({ user, setActiveTab }) {
  const { addToast } = useToast();
  const { awardXP } = useGamification();
  const [history, setHistory] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Simulator parameters state
  const [simStudyHours, setSimStudyHours] = useState(2);
  const [simRevisionRate, setSimRevisionRate] = useState(80);
  const [simAttendance, setSimAttendance] = useState(85);
  const [simPyqRatio, setSimPyqRatio] = useState(70);

  // Simulated metrics overlay
  const [simulatedMetrics, setSimulatedMetrics] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Load and subscribe to Firestore changes
  useEffect(() => {
    if (!user?.id) return;

    const initData = async () => {
      setLoading(true);
      await checkAndSeedTwinData(user.id);
      
      // Fetch initial profile
      const data = await fetchFullStudentHistory(user.id);
      if (data) {
        setHistory(data);
        const initialPreds = await generateAIPredictions(user.id, data);
        setPredictions(initialPreds);
      }
      setLoading(false);
    };

    initData();

    // Set up real-time listener on StudySessions to auto-recompute predictions
    const sessionsColl = collection(db, 'Users', user.id, 'StudySessions');
    const unsubSessions = onSnapshot(sessionsColl, async (snap) => {
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

  // Handle running fully refreshed LLM AI analysis
  const handleFullAIAnalysis = async () => {
    if (!user?.id || !history) return;
    setRefreshing(true);
    addToast({ message: 'Syncing Twin with neural prediction engines...', type: 'info' });
    try {
      const freshPreds = await generateAIPredictions(user.id, history);
      setPredictions(freshPreds);
      addToast({ message: 'Twin intelligence synced successfully!', type: 'success' });
      awardXP('SYNC_AI_TWIN');
    } catch (e) {
      addToast({ message: 'Neural sync offline. Kept local intelligence.', type: 'warning' });
    } finally {
      setRefreshing(false);
    }
  };

  // Run decision simulator calculations instantly
  useEffect(() => {
    if (!predictions) return;
    
    setIsSimulating(true);
    // Baseline predictions
    const baseline = predictions.metrics;
    
    // Simulate adjustments relative to baseline metrics
    const hoursDelta = simStudyHours - (baseline.totalStudyMinutes / 120); // normalized baseline study hrs
    const attDelta = simAttendance - baseline.overallAttendance;
    const revDelta = simRevisionRate - 65;
    const pyqDelta = simPyqRatio - 50;

    const simulatedCGPA = Math.min(10.0, Math.max(5.0, Number((
      baseline.predictedCGPA + 
      (hoursDelta * 0.15) + 
      (attDelta * 0.01) + 
      (revDelta * 0.005) + 
      (pyqDelta * 0.004)
    ).toFixed(2))));

    const simulatedSemesterPercentage = Math.min(100, Math.max(45, Math.round(simulatedCGPA * 9.5)));
    const simulatedPlacementReadiness = Math.min(100, Math.max(20, Math.round(
      baseline.placementReadiness + (hoursDelta * 4) + (pyqDelta * 0.3)
    )));
    const simulatedBurnoutRisk = Math.min(100, Math.max(10, Math.round(
      baseline.burnoutRisk + (simStudyHours * 8) - (simRevisionRate * 0.2)
    )));
    const simulatedBacklogRisk = Math.min(100, Math.max(1, Math.round(
      baseline.backlogRisk - (attDelta * 1.5) - (hoursDelta * 2)
    )));

    // Debounce state updates for buttery smooth transitions
    const timer = setTimeout(() => {
      setSimulatedMetrics({
        cgpa: simulatedCGPA,
        percentage: simulatedSemesterPercentage,
        placement: simulatedPlacementReadiness,
        burnout: simulatedBurnoutRisk,
        backlog: simulatedBacklogRisk
      });
      setIsSimulating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [simStudyHours, simRevisionRate, simAttendance, simPyqRatio, predictions]);

  // Real-time Action Loggers to Firestore
  const logStudySession = async (minutes) => {
    if (!user?.id) return;
    try {
      const sub = history?.subjects[Math.floor(Math.random() * history.subjects.length)] || { id: 'ds101', name: 'DSA' };
      const topics = ['Graphs', 'Tree Balances', 'Index optimization', 'Subnet Masking', 'Model Regularization'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      await addDoc(collection(db, 'Users', user.id, 'StudySessions'), {
        subjectId: sub.id,
        duration: minutes,
        date: new Date().toISOString().split('T')[0],
        focusScore: Math.floor(Math.random() * 20) + 80,
        topic: randomTopic
      });

      addToast({ message: `Logged ${minutes}m study session in ${sub.name}!`, type: 'success' });
      awardXP('COMPLETE_STUDY_SESSION');
    } catch (e) {
      console.error(e);
    }
  };

  const logQuizAttempt = async () => {
    if (!user?.id) return;
    try {
      const sub = history?.subjects[Math.floor(Math.random() * history.subjects.length)] || { id: 'ds101' };
      const score = Math.floor(Math.random() * 3) + 8; // 8, 9, or 10

      await addDoc(collection(db, 'Users', user.id, 'QuizResults'), {
        subjectId: sub.id,
        score,
        total: 10,
        date: new Date().toISOString().split('T')[0],
        wrongAnswers: ['Mock subtopic concepts']
      });

      addToast({ message: `Logged quiz score: ${score}/10!`, type: 'success' });
      awardXP('FINISH_QUIZ');
    } catch (e) {
      console.error(e);
    }
  };

  const logNotesRead = async () => {
    if (!user?.id) return;
    try {
      const sub = history?.subjects[Math.floor(Math.random() * history.subjects.length)] || { id: 'ds101' };
      await addDoc(collection(db, 'Users', user.id, 'NotesRead'), {
        subjectId: sub.id,
        noteId: `note_${Date.now()}`,
        title: 'Advanced Module Summaries',
        readDuration: 12
      });

      addToast({ message: 'Logged reading lecture notes!', type: 'success' });
      awardXP('READ_NOTE');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-teal/20 border-t-brand-teal animate-spin"></div>
        <p className="text-sm text-gray-400 font-medium animate-pulse">Synchronizing Academic Digital Twin...</p>
      </div>
    );
  }

  // Active metrics to display (simulated overrides if adjusting simulator)
  const activeCGPA = simulatedMetrics?.cgpa || predictions?.metrics?.predictedCGPA || 8.2;
  const activePercentage = simulatedMetrics?.percentage || predictions?.metrics?.predictedSemesterPercentage || 78;
  const activePlacement = simulatedMetrics?.placement || predictions?.metrics?.placementReadiness || 65;
  const activeBurnout = simulatedMetrics?.burnout || predictions?.metrics?.burnoutRisk || 20;
  const activeBacklog = simulatedMetrics?.backlog || predictions?.metrics?.backlogRisk || 10;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner Widget */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-brand-purple/20 via-brand-pink/10 to-transparent border border-white/10 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/20 border border-brand-pink/30 text-brand-pink text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>AI Future Twin™ Live</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Predictive Academic Digital Twin
            </h1>
            <p className="text-xs md:text-sm text-gray-300 max-w-xl leading-relaxed">
              Lumixora monitors your daily study streaks, attendance rates, and quiz precision to project future milestones, placement potential, and CGPA trends.
            </p>
          </div>
          
          <button
            onClick={handleFullAIAnalysis}
            disabled={refreshing}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-purple text-black font-extrabold text-xs tracking-wider uppercase border-none hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,245,212,0.3)] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Neural Recalculate</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Projections & Real-Time Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Expected CGPA */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group border border-white/5 hover:border-brand-teal/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-brand-teal font-extrabold uppercase tracking-wider">Expected CGPA</span>
            <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-4xl font-black text-gray-100 tracking-tight">{activeCGPA.toFixed(2)}</h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">Projected based on current study trajectory</p>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-teal rounded-full transition-all duration-75" style={{ width: `${(activeCGPA / 10) * 100}%` }}></div>
          </div>
        </div>

        {/* Semester Pass Percentage */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group border border-white/5 hover:border-brand-pink/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-brand-pink font-extrabold uppercase tracking-wider">Projected Semester %</span>
            <div className="w-8 h-8 rounded-lg bg-brand-pink/10 flex items-center justify-center text-brand-pink">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-4xl font-black text-gray-100 tracking-tight">{activePercentage}%</h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">Equates to estimated internal scores</p>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-pink rounded-full transition-all duration-75" style={{ width: `${activePercentage}%` }}></div>
          </div>
        </div>

        {/* Placement Readiness */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group border border-white/5 hover:border-brand-blue/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-brand-blue font-extrabold uppercase tracking-wider">Placement Readiness</span>
            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-4xl font-black text-gray-100 tracking-tight">{activePlacement}%</h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">Calculated from DSA + coding practice</p>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-blue rounded-full transition-all duration-75" style={{ width: `${activePlacement}%` }}></div>
          </div>
        </div>

        {/* Burnout Risk */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group border border-white/5 hover:border-brand-purple/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-wider">Burnout Risk</span>
            <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-4xl font-black text-gray-100 tracking-tight">{activeBurnout}%</h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">Risk score relative to target consistency</p>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-purple rounded-full transition-all duration-75" style={{ width: `${activeBurnout}%` }}></div>
          </div>
        </div>

      </div>

      {/* Real-time Interaction Console */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-100 uppercase tracking-wider">Real-Time Action Center</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Perform study actions instantly to recalculate the twin forecasts.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => {
                localStorage.setItem('study_session_duration', 45);
                setActiveTab('study-with-me');
              }} 
              className="text-[10px] bg-brand-teal/10 hover:bg-brand-teal border border-brand-teal/20 text-brand-teal hover:text-black font-bold uppercase py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Study Session (45m)
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('mentor_action', 'generate_quiz');
                setActiveTab('mentor');
              }} 
              className="text-[10px] bg-brand-pink/10 hover:bg-brand-pink border border-brand-pink/20 text-brand-pink hover:text-black font-bold uppercase py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" /> Take Quiz (9/10)
            </button>
            <button 
              onClick={() => setActiveTab('notes')} 
              className="text-[10px] bg-brand-blue/10 hover:bg-brand-blue border border-brand-blue/20 text-brand-blue hover:text-black font-bold uppercase py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> Read Notes
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Visualizations & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visualizations Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Custom SVG Line Chart */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider">CGPA Growth Timeline</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Projections mapping study hours to semester outcomes.</p>
              </div>
              <span className="text-[10px] bg-brand-teal/20 text-brand-teal font-extrabold uppercase py-1 px-3 rounded-full border border-brand-teal/20">
                Predicted: {activeCGPA.toFixed(2)} CGPA
              </span>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f72585" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f72585" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Grid lines */}
                {[40, 80, 120, 160].map((y, idx) => (
                  <line key={idx} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}

                {/* Base Prediction Line */}
                <path 
                  d={`M 0 160 Q 100 135, 200 110 T 300 80 T 400 65 T 500 ${200 - (predictions?.metrics?.predictedCGPA || 8.0) * 18}`}
                  fill="url(#chartGrad)"
                  stroke="#00f5d4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Simulated Prediction Line (Red overlay if simulator values adjusted) */}
                {(simStudyHours !== 2 || simAttendance !== 85) && (
                  <path 
                    d={`M 0 160 Q 100 135, 200 110 T 300 85 T 400 70 T 500 ${200 - activeCGPA * 18}`}
                    fill="url(#simGrad)"
                    stroke="#f72585"
                    strokeWidth="2.5"
                    strokeDasharray="4"
                    strokeLinecap="round"
                  />
                )}
              </svg>
              
              {/* Timeline labels */}
              <div className="flex justify-between mt-2 text-[9px] text-gray-500 font-bold uppercase tracking-wider px-1">
                <span>Month 1</span>
                <span>Month 2</span>
                <span>Month 3</span>
                <span>Month 4</span>
                <span>Semester End (Projections)</span>
              </div>
            </div>
          </div>

          {/* Subject passing probabilities */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col">
            <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider mb-4">Subject-wise Passing Probabilities</h3>
            
            <div className="space-y-4">
              {predictions?.subjectPassingProbabilities?.map((sub, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white/5 border border-white/5 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-brand-blue font-bold uppercase">{sub.code}</span>
                    <h4 className="text-xs font-bold text-gray-200">{sub.name}</h4>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-1/2">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          sub.probability > 85 ? 'bg-brand-teal' : sub.probability > 70 ? 'bg-brand-blue' : 'bg-brand-pink'
                        }`} 
                        style={{ width: `${sub.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-300 shrink-0 w-10 text-right">{sub.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Future Decision Simulator Column */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden bg-gradient-to-br from-brand-purple/10 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-teal" />
              <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider">Future Simulator</h3>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-6">
              Simulate actions to test how modifying study habits affects predictions instantly.
            </p>

            <div className="space-y-5">
              
              {/* Daily Study Hours Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-gray-300">
                  <span>Daily Study Target</span>
                  <span className="text-brand-teal">{simStudyHours} Hours</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="8" 
                  step="0.5"
                  value={simStudyHours}
                  onChange={(e) => setSimStudyHours(Number(e.target.value))}
                  className="w-full accent-brand-teal h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Revision Rate Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-gray-300">
                  <span>Revision Frequency</span>
                  <span className="text-brand-pink">{simRevisionRate}% frequency</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={simRevisionRate}
                  onChange={(e) => setSimRevisionRate(Number(e.target.value))}
                  className="w-full accent-brand-pink h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Attendance Ratio Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-gray-300">
                  <span>Simulated Attendance</span>
                  <span className="text-brand-blue">{simAttendance}% rate</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  value={simAttendance}
                  onChange={(e) => setSimAttendance(Number(e.target.value))}
                  className="w-full accent-brand-blue h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

            </div>

            {/* Sim outcomes details overlay card */}
            <div className="mt-6 p-4 rounded-xl border border-brand-teal/20 bg-brand-teal/5 space-y-3">
              <span className="text-[9px] text-brand-teal font-extrabold uppercase tracking-widest block">Simulated Outcome projection</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-500 block font-bold">Projected CGPA</span>
                  <span className="text-lg font-black text-gray-200 mt-0.5 block">{activeCGPA.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block font-bold">Burnout Risk</span>
                  <span className="text-lg font-black text-gray-200 mt-0.5 block">{activeBurnout}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Risk Alerts Engine */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col border border-white/5">
            <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider mb-4">Risk Engine Monitoring</h3>
            
            <div className="space-y-3">
              {activeBacklog > 20 && (
                <div className="p-3 bg-brand-pink/10 border border-brand-pink/20 rounded-xl flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-brand-pink shrink-0" />
                  <div>
                    <h5 className="text-[10px] text-brand-pink font-extrabold uppercase">Backlog warning</h5>
                    <p className="text-[10px] text-gray-300 mt-0.5">Below 75% attendance / low completion triggers backlogs.</p>
                  </div>
                </div>
              )}
              {activeBurnout > 40 && (
                <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-xl flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-brand-purple shrink-0" />
                  <div>
                    <h5 className="text-[10px] text-brand-purple font-extrabold uppercase">Burnout warning</h5>
                    <p className="text-[10px] text-gray-300 mt-0.5">High target hours and low sleep ratios trigger fatigue indicators.</p>
                  </div>
                </div>
              )}
              {activeBacklog <= 20 && activeBurnout <= 40 && (
                <div className="p-3 bg-brand-teal/10 border border-brand-teal/20 rounded-xl flex gap-3">
                  <CheckSquare className="w-5 h-5 text-brand-teal shrink-0" />
                  <div>
                    <h5 className="text-[10px] text-brand-teal font-extrabold uppercase">All Trajectories Stable</h5>
                    <p className="text-[10px] text-gray-300 mt-0.5">Academic focus variance is stable. No backlog or risk flags raised.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* AI Recommendations */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
        <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider mb-5">AI Recommendation Feed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions?.recommendations?.map((rec, idx) => (
            <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wide inline-block ${
                  rec.priority === 'High' ? 'bg-brand-pink/20 text-brand-pink' : 'bg-brand-teal/20 text-brand-teal'
                }`}>{rec.priority} Priority</span>
                <h4 className="text-xs font-bold text-gray-200 mt-1">{rec.task}</h4>
                <p className="text-[10px] text-gray-500 font-semibold">{rec.subject} • {rec.estTime} study time</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-brand-teal block">{rec.expectedIncrease}</span>
                <span className="text-[9px] text-gray-500 font-bold block mt-0.5">Impact</span>
              </div>
            </div>
          )) || (
            <div className="col-span-2 text-center py-4 text-xs italic text-gray-500">No suggestions compiled. Click Neural Recalculate above!</div>
          )}
        </div>
      </div>

    </div>
  );
}
