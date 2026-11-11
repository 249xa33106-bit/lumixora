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
import SpeakVerseInterviewPrep from '../components/speakverse/SpeakVerseInterviewPrep';
import SpeakVerseVocabVault from '../components/speakverse/SpeakVerseVocabVault';
import SpeakVerseFeatures from '../components/speakverse/SpeakVerseFeatures';
import SpeakVerseVoiceModal from '../components/speakverse/SpeakVerseVoiceModal';
import { SPEAKVERSE_TAGLINE, calculateCDI } from '../components/speakverse/SpeakVerseData';

export default function SpeakVersePortal({ user = null, setActiveTab = () => {} }) {
  // Navigation: 'dashboard' | 'learning-path' | 'coach' | 'arenas' | 'interview-prep' | 'vocab-vault' | 'features'
  const [activeTab, setActiveNavTab] = useState('dashboard');

  // Real Student Telemetry State (Synced with Supabase)
  const [metrics, setMetrics] = useState({
    overallScore: 78,
    fluencyScore: 82,
    pronunciationScore: 80,
    vocabLevel: 'B2',
    grammarScore: 85,
    confidenceProgress: 76,
    streak: 4,
    speakingMinutesTotal: 42,
    fillerWordRatio: 4
  });

  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [activeVoiceModal, setActiveVoiceModal] = useState({
    isOpen: false,
    drill: null
  });

  // Load real telemetry from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadProgress() {
      if (!user) return;
      setIsLoadingProgress(true);
      try {
        const remote = await fetchSpeakVerseProgressFromSupabase(user);
        if (remote && isMounted) {
          setMetrics(prev => ({
            ...prev,
            overallScore: remote.overallScore || remote.fluencyScore || prev.overallScore,
            fluencyScore: remote.fluencyScore || prev.fluencyScore,
            pronunciationScore: remote.pronunciationScore || prev.pronunciationScore,
            vocabLevel: remote.cefrBenchmark || prev.vocabLevel,
            grammarScore: remote.grammarScore || prev.grammarScore,
            streak: remote.streak || prev.streak,
            speakingMinutesTotal: remote.speakingMinutes || prev.speakingMinutesTotal,
            fillerWordRatio: remote.fillerWordRatio || prev.fillerWordRatio
          }));
        }
      } catch (err) {
        console.warn('SpeakVerse telemetry sync notice:', err);
      } finally {
        if (isMounted) setIsLoadingProgress(false);
      }
    }
    loadProgress();
    return () => { isMounted = false; };
  }, [user]);

  // Handle Score Recording from Voice Sessions
  const handleRecordScore = useCallback((result, durationSeconds = 30) => {
    if (!result) return;
    
    setMetrics(prev => {
      const addedMinutes = Math.max(1, Math.round(durationSeconds / 60));
      const newMinutes = prev.speakingMinutesTotal + addedMinutes;
      const newOverall = result.overallScore ? Math.round((prev.overallScore * 0.7) + (result.overallScore * 0.3)) : prev.overallScore;
      const newFluency = result.fluency ? Math.round((prev.fluencyScore * 0.7) + (result.fluency * 0.3)) : prev.fluencyScore;
      const newPronounce = result.pronunciation ? Math.round((prev.pronunciationScore * 0.7) + (result.pronunciation * 0.3)) : prev.pronunciationScore;
      const newGrammar = result.grammar ? Math.round((prev.grammarScore * 0.7) + (result.grammar * 0.3)) : prev.grammarScore;

      const updated = {
        ...prev,
        overallScore: newOverall,
        fluencyScore: newFluency,
        pronunciationScore: newPronounce,
        grammarScore: newGrammar,
        speakingMinutesTotal: newMinutes,
        confidenceProgress: Math.min(100, prev.confidenceProgress + 2)
      };

      // Persist to Supabase in background
      if (user) {
        saveSpeakVerseProgressToSupabase(user, {
          durationMinutes: addedMinutes,
          fluencyScore: newFluency,
          pronunciationScore: newPronounce,
          grammarScore: newGrammar,
          overallScore: newOverall,
          cefrBenchmark: prev.vocabLevel,
          streak: prev.streak
        }).catch(() => {});
      }

      return updated;
    });
  }, [user]);

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
    { id: 'learning-path', label: '8-Stage Learning Path', icon: BookOpen, badge: '8 STAGES' },
    { id: 'coach', label: 'AI Speaking Coach', icon: Mic, badge: 'LIVE 2-WAY' },
    { id: 'arenas', label: 'Practice Laboratories', icon: Building2, badge: '6 LABS' },
    { id: 'interview-prep', label: 'Interview Preparation', icon: Briefcase, badge: 'PLACEMENT' },
    { id: 'vocab-vault', label: 'Vocab Vault & Mistake Memory', icon: Sparkles, badge: 'ACTIVE' },
    { id: 'features', label: 'Pronunciation & Fluency Lab', icon: Volume2, badge: 'LABS' }
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
        
        {/* TAB 1: STUDENT DASHBOARD */}
        {activeTab === 'dashboard' && (
          <SpeakVerseDashboard
            user={user}
            metrics={metrics}
            onLaunchExercise={handleLaunchExercise}
            onNavigateTab={setActiveNavTab}
          />
        )}

        {/* TAB 2: COMPLETE 8-STAGE LEARNING PATH */}
        {activeTab === 'learning-path' && (
          <SpeakVerseEcosystem
            onSelectDrill={(drill) => setActiveVoiceModal({ isOpen: true, drill })}
          />
        )}

        {/* TAB 3: AI PERSONAL SPEAKING COACH */}
        {activeTab === 'coach' && (
          <SpeakVerseCoach
            user={user}
            onRecordSessionScore={handleRecordScore}
          />
        )}

        {/* TAB 4: 6 SPECIAL PRACTICE LABORATORIES */}
        {activeTab === 'arenas' && (
          <SpeakVersePracticeLabs
            onLaunchVoiceModal={(drill) => setActiveVoiceModal({ isOpen: true, drill })}
          />
        )}

        {/* TAB 5: CAREER & PLACEMENT INTERVIEW PREPARATION */}
        {activeTab === 'interview-prep' && (
          <SpeakVerseInterviewPrep
            onLaunchVoiceModal={(drill) => setActiveVoiceModal({ isOpen: true, drill })}
          />
        )}

        {/* TAB 6: VOCABULARY VAULT & MISTAKE MEMORY */}
        {activeTab === 'vocab-vault' && (
          <SpeakVerseVocabVault
            onLaunchVoiceModal={(drill) => setActiveVoiceModal({ isOpen: true, drill })}
          />
        )}

        {/* TAB 7: PRONUNCIATION & FLUENCY LAB */}
        {activeTab === 'features' && (
          <SpeakVerseFeatures
            onLaunchFeature={(featureDrill) => setActiveVoiceModal({ isOpen: true, drill: featureDrill })}
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
