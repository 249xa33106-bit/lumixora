import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Video, Shield, AlertTriangle, Users, Volume2, Search, CheckCircle, 
  Send, X, Maximize2, RefreshCw, Radio, Eye, Flag, UserX, BellRing
} from 'lucide-react';
import { ExamProctorBridge } from '../services/examProctorService';

export default function ExamProctorWarRoom({ testId, testTitle, onClose }) {
  const [candidates, setCandidates] = useState({}); // { [email]: { name, roll, frame, trustScore, warnings, audioDb, lastSeen } }
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all' | 'flagged' | 'clean'
  const [searchQuery, setSearchQuery] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [sendingAction, setSendingAction] = useState(false);
  const warRoomRef = useRef(null);

  // Auto clean up stale candidates after 15 seconds of no frames
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCandidates(prev => {
        let changed = false;
        const next = { ...prev };
        Object.keys(next).forEach(email => {
          if (now - next[email].timestamp > 15000) {
            next[email] = { ...next[email], status: 'disconnected' };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Connect to live proctor channel
  useEffect(() => {
    if (!testId) return;

    const session = ExamProctorBridge.joinFacultyWarRoom(
      testId,
      // onCandidateFrame
      (payload) => {
        setCandidates(prev => ({
          ...prev,
          [payload.email]: {
            ...payload,
            status: 'live',
            timestamp: Date.now()
          }
        }));
      },
      // onCandidateOffline
      ({ email }) => {
        setCandidates(prev => {
          if (!prev[email]) return prev;
          return {
            ...prev,
            [email]: { ...prev[email], status: 'offline' }
          };
        });
      },
      // onCandidateOnline
      (payload) => {
        setCandidates(prev => ({
          ...prev,
          [payload.email]: {
            ...prev[payload.email],
            ...payload,
            status: 'connecting',
            timestamp: Date.now()
          }
        }));
      }
    );

    warRoomRef.current = session;

    return () => {
      if (warRoomRef.current) {
        warRoomRef.current.leaveWarRoom();
      }
    };
  }, [testId]);

  const candidateList = useMemo(() => {
    return Object.values(candidates).filter(c => {
      const q = searchQuery.toLowerCase();
      const matchSearch = (c.name?.toLowerCase() || '').includes(q) || 
                          (c.email?.toLowerCase() || '').includes(q) || 
                          (c.roll?.toLowerCase() || '').includes(q);
      if (!matchSearch) return false;
      if (filterSeverity === 'flagged') return c.warnings > 0 || c.trustScore < 80;
      if (filterSeverity === 'clean') return c.warnings === 0 && c.trustScore >= 80;
      return true;
    });
  }, [candidates, searchQuery, filterSeverity]);

  const stats = useMemo(() => {
    const all = Object.values(candidates);
    const liveCount = all.filter(c => c.status === 'live').length;
    const flaggedCount = all.filter(c => c.warnings > 0 || c.trustScore < 80).length;
    return { total: all.length, live: liveCount, flagged: flaggedCount };
  }, [candidates]);

  const handleSendIntervention = async (action, customMsg = null) => {
    if (!selectedCandidate || !warRoomRef.current) return;
    setSendingAction(true);
    try {
      await warRoomRef.current.sendIntervention(
        selectedCandidate.email,
        action,
        customMsg || warningMessage || 'Proctor has flagged your activity. Please focus on the screen.'
      );
      setWarningMessage('');
    } catch (e) {
      console.warn("Failed sending proctor action", e);
    } finally {
      setSendingAction(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col overflow-hidden text-white animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="border-b border-white/10 bg-slate-900/80 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 animate-pulse">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-wide text-white uppercase">
                Live Invigilation War Room
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white tracking-wider animate-pulse uppercase">
                Live Broadcast
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitoring: <span className="text-indigo-400 font-semibold">{testTitle || `Exam #${testId}`}</span>
            </p>
          </div>
        </div>

        {/* Realtime Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/10 flex items-center gap-2 text-xs">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-medium">Online Candidates:</span>
            <span className="font-bold text-emerald-400">{stats.live} / {stats.total}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-slate-400 font-medium">Violations Flagged:</span>
            <span className="font-bold text-red-400">{stats.flagged}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter & Search HUD */}
      <div className="border-b border-white/10 bg-slate-900/40 px-6 py-2.5 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${filterSeverity === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            All Candidates ({stats.total})
          </button>
          <button
            onClick={() => setFilterSeverity('flagged')}
            className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${filterSeverity === 'flagged' ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-400 hover:bg-red-500/10'}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Flagged Only ({stats.flagged})
          </button>
          <button
            onClick={() => setFilterSeverity('clean')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${filterSeverity === 'clean' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Clean Audit ({stats.total - stats.flagged})
          </button>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate, roll, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Multi-Camera Live Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {candidateList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-500 mb-4 animate-bounce">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-300">Awaiting Candidate Webcams</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              When students launch and enter this test with their webcam enabled, their live surveillance video feeds will populate in this grid automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {candidateList.map((cand) => {
              const isFlagged = cand.warnings > 0 || cand.trustScore < 80;
              const isOffline = cand.status === 'disconnected' || cand.status === 'offline';

              return (
                <div 
                  key={cand.email}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer flex flex-col bg-slate-900/90 shadow-lg hover:scale-[1.02] ${
                    isFlagged 
                      ? 'border-red-500/60 shadow-red-500/10 hover:border-red-400' 
                      : 'border-white/10 hover:border-indigo-500/60'
                  }`}
                >
                  {/* Candidate Webcam Feed / Thumbnail */}
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    {cand.frame ? (
                      <img 
                        src={cand.frame} 
                        alt={cand.name}
                        className={`w-full h-full object-cover transition duration-300 ${isOffline ? 'grayscale opacity-40' : ''}`}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-600 gap-1">
                        <Video className="w-6 h-6 animate-pulse" />
                        <span className="text-[10px]">Connecting Stream...</span>
                      </div>
                    )}

                    {/* Status Overlays */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isOffline 
                          ? 'bg-slate-800 text-slate-400' 
                          : isFlagged 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-emerald-500 text-white'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        {isOffline ? 'OFFLINE' : 'LIVE'}
                      </span>
                    </div>

                    {/* Trust Score Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border backdrop-blur-md ${
                        cand.trustScore >= 90
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : cand.trustScore >= 75
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {cand.trustScore}% Trust
                      </span>
                    </div>

                    {/* Warnings Badge if > 0 */}
                    {cand.warnings > 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-red-600/90 text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-lg">
                        <AlertTriangle className="w-3 h-3" />
                        {cand.warnings}/3 WARNINGS
                      </div>
                    )}

                    {/* Question Progress pill */}
                    {cand.totalQuestions > 0 && (
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-slate-300 text-[10px] font-mono">
                        Q{cand.currentQuestion + 1}/{cand.totalQuestions}
                      </div>
                    )}
                  </div>

                  {/* Candidate Info Bottom Strip */}
                  <div className="p-3 flex items-center justify-between border-t border-white/5 bg-slate-900/60">
                    <div className="min-w-0 pr-2">
                      <h4 className="font-bold text-xs text-white truncate">{cand.name || 'Scholar'}</h4>
                      <p className="text-[10px] text-slate-400 truncate font-mono">
                        {cand.roll || cand.email?.split('@')[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCandidate(cand);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition"
                        title="Open Candidate Focus"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Focus & Direct Proctor Action Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-base text-white">
                  {selectedCandidate.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedCandidate.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedCandidate.email} • Roll: {selectedCandidate.roll}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Large Camera Feed + Status */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                {selectedCandidate.frame ? (
                  <img 
                    src={selectedCandidate.frame} 
                    alt={selectedCandidate.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                    No Live Frame
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold tracking-wider">
                  LIVE SURVEILLANCE
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs">
                    <span className="text-slate-400">Proctor Trust Score:</span>
                    <span className="font-bold text-indigo-400 text-sm">{selectedCandidate.trustScore}%</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs">
                    <span className="text-slate-400">Recorded Violations:</span>
                    <span className={`font-bold ${selectedCandidate.warnings > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedCandidate.warnings} of 3 Strikes
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-white/5 text-xs">
                    <span className="text-slate-400">Face Framing:</span>
                    <span className="font-bold text-slate-200 capitalize">{selectedCandidate.faceStatus || 'Centered'}</span>
                  </div>
                </div>

                {/* Instant Actions */}
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Send live instruction to student..."
                      value={warningMessage}
                      onChange={(e) => setWarningMessage(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handleSendIntervention('warning')}
                      disabled={sendingAction}
                      className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      Issue Warning
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to FORCE-SUBMIT the examination for ${selectedCandidate.name}?`)) {
                        handleSendIntervention('force_submit', 'Examination terminated by Faculty Invigilator due to integrity policy violation.');
                        setSelectedCandidate(null);
                      }
                    }}
                    disabled={sendingAction}
                    className="w-full py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/30 hover:border-red-600 text-red-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    Force Auto-Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
