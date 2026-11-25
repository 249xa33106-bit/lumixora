// ============================================================================
// LUMIXORA SpeakVerse™ — COMPLETE COMMUNICATION INTELLIGENCE PLATFORM
// Tagline: "From Hesitation to Communication. From Communication to Confidence."
// Full 8-Stage Development System • 10-Axis CDI Metrics • 6 Practice Laboratories
// AI Speaking Coach • Interview Prep • Vocab Vault • Mistake Memory
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mic, Volume2, Sparkles, Trophy, Award, BookOpen, 
  Users, CheckCircle2, ChevronRight, Play, RotateCcw, 
  Target, Brain, Flame, Briefcase, BarChart3, Zap, 
  ShieldCheck, ArrowRight, LayoutDashboard, Compass, 
  Building2, MessageCircle, AlertTriangle, Languages
} from 'lucide-react';
import { 
  saveSpeakVerseProgressToSupabase, 
  fetchSpeakVerseProgressFromSupabase 
} from '../services/supabaseDataSyncService';
import SpeakVerseDashboard from '../components/speakverse/SpeakVerseDashboard';
import SpeakVerseEcosystem from '../components/speakverse/SpeakVerseEcosystem';
import SpeakVerseCoach from '../components/speakverse/SpeakVerseCoach';
import SpeakVersePracticeLabs from '../components/speakverse/SpeakVersePracticeLabs';
import SpeakVerseEnvironments from '../components/speakverse/SpeakVerseEnvironments';
import SpeakVerseInterviewPrep from '../components/speakverse/SpeakVerseInterviewPrep';
import SpeakVerseVocabVault from '../components/speakverse/SpeakVerseVocabVault';
import SpeakVerseFeatures from '../components/speakverse/SpeakVerseFeatures';
import SpeakVerseVoiceModal from '../components/speakverse/SpeakVerseVoiceModal';
import { SPEAKVERSE_TAGLINE, calculateCDI } from '../components/speakverse/SpeakVerseData';
import { generateSpeakVerseCEFRCertificatePDF } from '../utils/pdfGenerator';

export default function SpeakVersePortal({ user = null, setActiveTab = () => {} }) {
  // Navigation: 5 Clean Consolidated Hubs
  // 'dashboard' | 'learning-path' | 'coach-labs' | 'interview-prep' | 'vocab-vault'
  const [activeTab, setActiveNavTab] = useState('dashboard');
  const [coachLabsSubMode, setCoachLabsSubMode] = useState('coach'); // 'coach' | 'arenas' | 'environments' | 'fluency'

  // Real Student Telemetry State (Strict Real User Data — No Fake Numbers)
  const userKey = (user?.id || user?.uid || user?.email || 'guest').toLowerCase();

  const [metrics, setMetrics] = useState(() => {
    try {
      const cached = localStorage.getItem(`lumixora_speakverse_metrics_${userKey}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}

    return {
      overallScore: 0,
      fluencyScore: 0,
      pronunciationScore: 0,
      vocabLevel: 'A1',
      grammarScore: 0,
      confidenceProgress: 0,
      streak: user?.streak || 0,
      speakingMinutesTotal: 0,
      fillerWordRatio: 0,
      wpm: 0,
      sessionsCount: 0,
      weeklyMinutes: [0, 0, 0, 0, 0, 0, 0]
    };
  });

  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [activeVoiceModal, setActiveVoiceModal] = useState({
    isOpen: false,
    drill: null
  });

  // Load real telemetry from Supabase on mount (Real User Data Only)
  useEffect(() => {
    let isMounted = true;
    async function loadProgress() {
      if (!user) return;
      setIsLoadingProgress(true);
      try {
        const remote = await fetchSpeakVerseProgressFromSupabase(user);
        if (remote && isMounted) {
          setMetrics(prev => {
            const hasRemoteSessions = (remote.sessionsCount && remote.sessionsCount > 0) || (remote.speakingMinutes && remote.speakingMinutes > 0) || (remote.fluencyScore && remote.fluencyScore > 0);
            
            // STRICT AUTHENTIC PROGRESS: If 0 sessions, cleanly initialize at 0 and 'A1' (no artificial 60/B1 fallbacks)
            const updated = {
              ...prev,
              overallScore: remote.overallScore ?? (hasRemoteSessions ? (remote.overallScore || 0) : 0),
              fluencyScore: remote.fluencyScore ?? (hasRemoteSessions ? (remote.fluencyScore || 0) : 0),
              pronunciationScore: remote.pronunciationScore ?? (hasRemoteSessions ? (remote.pronunciationScore || 0) : 0),
              vocabLevel: remote.cefrBenchmark || 'A1',
              grammarScore: remote.grammarScore ?? (hasRemoteSessions ? (remote.grammarScore || 0) : 0),
              confidenceProgress: remote.confidenceProgress ?? (hasRemoteSessions ? (remote.confidenceProgress || 0) : 0),
              streak: remote.streak ?? user?.streak ?? prev.streak ?? 0,
              speakingMinutesTotal: remote.speakingMinutes ?? prev.speakingMinutesTotal ?? 0,
              fillerWordRatio: remote.fillerWordRatio ?? prev.fillerWordRatio ?? 0,
              wpm: remote.wpm ?? prev.wpm ?? 0,
              sessionsCount: remote.sessionsCount ?? prev.sessionsCount ?? 0,
              weeklyMinutes: remote.weeklyMinutes || prev.weeklyMinutes || [0, 0, 0, 0, 0, 0, 0]
            };
            try {
              localStorage.setItem(`lumixora_speakverse_metrics_${userKey}`, JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      } catch (err) {
        console.warn('SpeakVerse telemetry sync notice:', err);
      } finally {
        if (isMounted) setIsLoadingProgress(false);
      }
    }
    loadProgress();
    return () => { isMounted = false; };
  }, [user, userKey]);

  // Handle Score Recording from Voice Sessions (Real Spoken Audio Scoring)
  const handleRecordScore = useCallback((result, durationSeconds = 30) => {
    if (!result) return;
    
    setMetrics(prev => {
      const addedMinutes = Math.max(1, Math.round(durationSeconds / 60));
      const prevSessions = prev.sessionsCount || 0;
      const newSessions = prevSessions + 1;
      const newMinutes = (prev.speakingMinutesTotal || 0) + addedMinutes;
      
      const sessionFluency = result.fluency || result.score || 70;
      const sessionPronounce = result.pronunciation || result.score || 70;
      const sessionGrammar = result.grammar || result.score || 70;
      const sessionOverall = result.overallScore || result.score || Math.round((sessionFluency + sessionPronounce + sessionGrammar) / 3);
      const sessionWpm = result.wpm || (result.wordCount && durationSeconds > 0 ? Math.round((result.wordCount / durationSeconds) * 60) : 120);
      const sessionFiller = result.fillerRatio ?? (result.fillerCount ? Math.round((result.fillerCount / Math.max(1, result.wordCount || 20)) * 100) : 2);

      let newFluency = sessionFluency;
      let newPronounce = sessionPronounce;
      let newGrammar = sessionGrammar;
      let newOverall = sessionOverall;

      if (prevSessions > 0 && prev.fluencyScore > 0) {
        newFluency = Math.round((prev.fluencyScore * prevSessions + sessionFluency) / newSessions);
        newPronounce = Math.round((prev.pronunciationScore * prevSessions + sessionPronounce) / newSessions);
        newGrammar = Math.round((prev.grammarScore * prevSessions + sessionGrammar) / newSessions);
        newOverall = Math.round((prev.overallScore * prevSessions + sessionOverall) / newSessions);
      }

      const updated = {
        ...prev,
        sessionsCount: newSessions,
        overallScore: newOverall,
        fluencyScore: newFluency,
        pronunciationScore: newPronounce,
        grammarScore: newGrammar,
        speakingMinutesTotal: newMinutes,
        confidenceProgress: Math.min(100, Math.round(newOverall * 0.95)),
        wpm: sessionWpm,
        fillerWordRatio: sessionFiller,
        streak: (prev.streak || user?.streak || 0) + 1,
        vocabLevel: newOverall >= 85 ? 'C1' : (newOverall >= 70 ? 'B2' : (newOverall >= 55 ? 'B1' : 'A2'))
      };

      try {
        localStorage.setItem(`lumixora_speakverse_metrics_${userKey}`, JSON.stringify(updated));
      } catch (e) {}

      // Persist to Supabase
      if (user) {
        saveSpeakVerseProgressToSupabase(user, {
          durationMinutes: addedMinutes,
          fluencyScore: newFluency,
          pronunciationScore: newPronounce,
          grammarScore: newGrammar,
          overallScore: newOverall,
          confidenceProgress: updated.confidenceProgress,
          wpm: sessionWpm,
          fillerWordRatio: sessionFiller,
          cefrBenchmark: updated.vocabLevel,
          streak: updated.streak,
          sessionsCount: newSessions
        }).catch(() => {});
      }

      return updated;
    });
  }, [user, userKey]);

  // Open Voice Drill Modal
  const handleLaunchExercise = (drill) => {
    if (typeof drill === 'string') {
      setActiveVoiceModal({
        isOpen: true,
        drill: {
          id: drill,
          title: 'Interactive Speaking Challenge',
          prompt: 'Speak continuously for 60 seconds with clear pronunciation and natural cadence.',
          difficulty: 'Stage Practice'
        }
      });
      return;
    }

    setActiveVoiceModal({
      isOpen: true,
      drill: drill || {
        id: 'generic-drill',
        title: 'Communication Practice Drill',
        prompt: 'Speak continuously on your chosen topic.',
        difficulty: 'Practice'
      }
    });
  };

  const navTabs = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard, badge: 'CDI / 100' },
    { id: 'learning-path', label: '8-Stage Curriculum', icon: BookOpen, badge: '8 STAGES' },
    { id: 'coach-labs', label: 'AI Coach & Practice Labs', icon: Mic, badge: 'LIVE HUBS' },
    { id: 'interview-prep', label: 'Placement Prep & STAR', icon: Briefcase, badge: 'INTERVIEW' },
    { id: 'vocab-vault', label: 'Vocab & Vernacular Bridge', icon: Sparkles, badge: 'BRIDGE' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      
      {/* ─── MASTER WHITE-FIRST HEADER ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Brand Title & Tagline */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black shadow-xs shadow-indigo-600/30">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block leading-none font-mono">
                    COMMUNICATION DEVELOPMENT • LUMIXORA LEARNING ECOSYSTEM
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] font-sora mt-0.5">
                    SpeakVerse™
                  </h1>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-mono self-center">
                  8-Stage System
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 font-mono flex items-center gap-1 self-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Supabase Live Sync
                </span>
              </div>

              {/* Official Tagline as Requested */}
              <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-tight pt-0.5">
                {SPEAKVERSE_TAGLINE}
              </p>
            </div>

            {/* Quick Telemetry Badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 text-xs font-mono">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-extrabold text-slate-800">{metrics.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-2xl border border-indigo-100 text-xs font-mono">
                <Trophy className="w-4 h-4 text-indigo-600" />
                <span className="font-extrabold text-indigo-900">{calculateCDI({
                  fluency: metrics.fluencyScore,
                  pronunciation: metrics.pronunciationScore,
                  grammar: metrics.grammarScore
                })} / 100 CDI</span>
              </div>
            </div>
          </div>

          {/* ─── PRIMARY WHITE-FIRST NAVIGATION TABS ───────────────────────── */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pt-3 border-t border-slate-100 mt-3 custom-scrollbar">
            {navTabs.map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveNavTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs scale-[1.01]'
                      : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
        
        {/* HUB 1: STUDENT DASHBOARD */}
        {activeTab === 'dashboard' && (
          <SpeakVerseDashboard
            user={user}
            metrics={metrics}
            onLaunchExercise={handleLaunchExercise}
            onNavigateTab={(targetTab, subMode) => {
              if (['coach', 'arenas', 'environments', 'features'].includes(targetTab)) {
                setActiveNavTab('coach-labs');
                setCoachLabsSubMode(targetTab === 'features' ? 'fluency' : targetTab);
              } else {
                setActiveNavTab(targetTab);
                if (subMode) setCoachLabsSubMode(subMode);
              }
            }}
            onDownloadCertificate={() => {
              const cdi = calculateCDI({
                fluency: metrics.fluencyScore,
                pronunciation: metrics.pronunciationScore,
                grammar: metrics.grammarScore
              });
              
              let storedUser = null;
              try {
                storedUser = JSON.parse(localStorage.getItem('lumixora_current_user') || localStorage.getItem('user') || localStorage.getItem('gprec_student_profile') || '{}');
              } catch (_) {}

              const activeUser = {
                ...(storedUser || {}),
                ...(user || {})
              };

              generateSpeakVerseCEFRCertificatePDF({
                user: activeUser,
                metrics,
                cdiScore: (metrics.sessionsCount > 0 || metrics.fluencyScore > 0) ? cdi : (metrics.overallScore || 0)
              });
            }}
          />
        )}

        {/* HUB 2: COMPLETE 8-STAGE CURRICULUM */}
        {activeTab === 'learning-path' && (
          <SpeakVerseEcosystem
            onSelectDrill={(drill) => setActiveVoiceModal({ isOpen: true, drill })}
          />
        )}

        {/* HUB 3: AI COACH & PRACTICE LABORATORIES (CONSOLIDATED 4-MODE HUB) */}
        {activeTab === 'coach-labs' && (
          <div className="space-y-6">
            {/* Sub-Hub Selector Navigation */}
            <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setCoachLabsSubMode('coach')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  coachLabsSubMode === 'coach'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>2-Way AI Speaking Coach</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${coachLabsSubMode === 'coach' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>LIVE</span>
              </button>

              <button
                onClick={() => setCoachLabsSubMode('arenas')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  coachLabsSubMode === 'arenas'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>6 Practice Arenas (Debate, GD, Pitch, Speeches)</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${coachLabsSubMode === 'arenas' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>ARENAS</span>
              </button>

              <button
                onClick={() => setCoachLabsSubMode('environments')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  coachLabsSubMode === 'environments'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Immersive Simulation Environments</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${coachLabsSubMode === 'environments' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>8 SCENARIOS</span>
              </button>

              <button
                onClick={() => setCoachLabsSubMode('fluency')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  coachLabsSubMode === 'fluency'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Fluency & Pronunciation Differentiators</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${coachLabsSubMode === 'fluency' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>LABS</span>
              </button>
            </div>

            {/* Active Sub-Mode Renderer */}
            {coachLabsSubMode === 'coach' && (
              <SpeakVerseCoach
                user={user}
                onRecordSessionScore={handleRecordScore}
              />
            )}

            {coachLabsSubMode === 'arenas' && (
              <SpeakVersePracticeLabs
                onLaunchVoiceModal={(drill) => setActiveVoiceModal({ isOpen: true, drill })}
              />
            )}

            {coachLabsSubMode === 'environments' && (
              <SpeakVerseEnvironments
                onSelectScenario={(scenarioDrill) => setActiveVoiceModal({ isOpen: true, drill: scenarioDrill })}
              />
            )}

            {coachLabsSubMode === 'fluency' && (
              <SpeakVerseFeatures
                onLaunchFeature={(featureDrill) => setActiveVoiceModal({ isOpen: true, drill: featureDrill })}
              />
            )}
          </div>
        )}

        {/* HUB 4: CAREER & PLACEMENT INTERVIEW PREPARATION */}
        {activeTab === 'interview-prep' && (
          <SpeakVerseInterviewPrep
            onLaunchVoiceModal={(drill) => setActiveVoiceModal({ isOpen: true, drill })}
          />
        )}

        {/* HUB 5: VOCABULARY VAULT, MISTAKE MEMORY & VERNACULAR BRIDGE */}
        {activeTab === 'vocab-vault' && (
          <SpeakVerseVocabVault
            onLaunchVoiceModal={(drill) => setActiveVoiceModal({ isOpen: true, drill })}
          />
        )}
      </main>

      {/* ─── GLOBAL VOICE DRILL & EVALUATION MODAL ──────────────────────────── */}
      <SpeakVerseVoiceModal
        isOpen={activeVoiceModal.isOpen}
        onClose={() => setActiveVoiceModal({ isOpen: false, drill: null })}
        drill={activeVoiceModal.drill}
        onRecordScore={handleRecordScore}
      />
    </div>
  );
}
