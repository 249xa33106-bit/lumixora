import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Plus, Trash2, Radio, AlertTriangle, CheckCircle2, Download,
  FileText, Send, Lock, Eye, Video, Search, Sparkles, Ban, Users
} from 'lucide-react';
import { ExamProctorBridge } from '../../services/examProctorService';
import {
  exportAttemptsToCsv,
  openPrintableScorecardPdf
} from './gprecSecureExamBank';

export default function GprecExamConductorPanel({
  exams,
  attempts,
  onPublishExam,
  onDeleteExam,
  addToast
}) {
  const [subTab, setSubTab] = useState('builder'); // 'builder' | 'war_room' | 'results'

  // Exam Builder State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('GPREC Campus Placement Cell');
  const [category, setCategory] = useState('Placement OA');
  const [passcode, setPasscode] = useState(`GPREC${Math.floor(1000 + Math.random() * 9000)}`);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [negativeMarking, setNegativeMarking] = useState(0.25);
  const [maxViolations, setMaxViolations] = useState(5);
  const [strictness, setStrictness] = useState('Zero-Trust Max');
  const [requireWebcam, setRequireWebcam] = useState(true);

  const [mcqList, setMcqList] = useState([
    {
      id: 'c_q1',
      prompt: 'Which data structure uses LIFO (Last-In First-Out) ordering?',
      options: ['Queue', 'Stack', 'Linked List', 'Binary Heap'],
      correctIndex: 1,
      topic: 'DSA'
    }
  ]);

  const [includeCoding, setIncludeCoding] = useState(true);
  const [codingTitle, setCodingTitle] = useState('Reverse Array In-Place');
  const [codingStatement, setCodingStatement] = useState('Given an array of integers nums, return a new array with elements in reverse order.');

  // Live Proctor War Room State
  const [liveCandidates, setLiveCandidates] = useState({});
  const warRoomRef = useRef(null);

  // Results Filter State
  const [resultsSearch, setResultsSearch] = useState('');

  useEffect(() => {
    if (subTab !== 'war_room') return;
    try {
      warRoomRef.current = ExamProctorBridge.joinFacultyWarRoom(
        'all',
        (payload) => {
          setLiveCandidates(prev => ({
            ...prev,
            [payload.email]: { ...payload, online: true, lastSeen: Date.now() }
          }));
        },
        (payload) => {
          setLiveCandidates(prev => {
            const copy = { ...prev };
            delete copy[payload.email];
            return copy;
          });
        },
        (payload) => {
          setLiveCandidates(prev => ({
            ...prev,
            [payload.email]: {
              ...(prev[payload.email] || {}),
              ...payload,
              online: true,
              trustScore: prev[payload.email]?.trustScore ?? 100,
              warnings: prev[payload.email]?.warnings ?? 0,
              lastSeen: Date.now()
            }
          }));
        }
      );
    } catch (e) {}

    return () => {
      warRoomRef.current = null;
    };
  }, [subTab]);

  const sendProctorIntervention = (targetEmail, action, message) => {
    try {
      if (warRoomRef.current?.sendIntervention) {
        warRoomRef.current.sendIntervention(targetEmail, action, message);
      }
      if (addToast) {
        addToast({
          message: action === 'terminate'
            ? `Sent FORCE TERMINATE signal to ${targetEmail}`
            : `Sent live warning to ${targetEmail}`,
          type: action === 'terminate' ? 'error' : 'warning'
        });
      }
    } catch (e) {}
  };

  const addMcqRow = () => {
    setMcqList(prev => [
      ...prev,
      {
        id: `c_q_${Date.now()}`,
        prompt: '',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0,
        topic: 'Technical'
      }
    ]);
  };

  const updateMcq = (id, patch) => {
    setMcqList(prev => prev.map(q => (q.id === id ? { ...q, ...patch } : q)));
  };

  const updateMcqOption = (id, optIdx, val) => {
    setMcqList(prev =>
      prev.map(q => {
        if (q.id !== id) return q;
        const opts = [...q.options];
        opts[optIdx] = val;
        return { ...q, options: opts };
      })
    );
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      if (addToast) addToast({ message: 'Please enter an Exam Title.', type: 'warning' });
      return;
    }
    const validMcqs = mcqList.filter(q => q.prompt.trim().length > 0);
    if (validMcqs.length === 0 && !includeCoding) {
      if (addToast) addToast({ message: 'Add at least 1 MCQ or enable a Coding problem.', type: 'warning' });
      return;
    }

    const sections = [];
    if (validMcqs.length > 0) {
      sections.push({
        id: `sec_mcq_${Date.now()}`,
        title: 'Section 1: Proctored Technical & Aptitude MCQs',
        type: 'mcq',
        durationMinutes: Math.max(5, Math.round(Number(durationMinutes) * (includeCoding ? 0.6 : 1))),
        marksPerQuestion: 2,
        negativeMarks: Number(negativeMarking) || 0,
        questions: validMcqs
      });
    }
    if (includeCoding) {
      sections.push({
        id: `sec_code_${Date.now()}`,
        title: `Section ${sections.length + 1}: Live Proctored Coding`,
        type: 'coding',
        durationMinutes: Math.max(10, Math.round(Number(durationMinutes) * 0.4)),
        marksPerQuestion: 15,
        negativeMarks: 0,
        problems: [
          {
            id: `code_${Date.now()}`,
            title: codingTitle.trim() || 'Reverse Array In-Place',
            difficulty: 'Medium',
            marks: 15,
            statement: codingStatement.trim() || 'Return the reversed integer array.',
            constraints: ['1 <= nums.length <= 10^4', 'Solve in O(n) time'],
            functionName: 'solve',
            starterCode: {
              javascript: `function solve(nums) {\n  return [...nums].reverse();\n}`,
              python: `def solve(nums):\n    return nums[::-1]`,
              java: `class Solution {\n    public int[] solve(int[] nums) {\n        int n = nums.length;\n        int[] res = new int[n];\n        for (int i = 0; i < n; i++) res[i] = nums[n - 1 - i];\n        return res;\n    }\n}`,
              cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvector<int> solve(vector<int> nums) {\n    reverse(nums.begin(), nums.end());\n    return nums;\n}`
            },
            visibleTests: [
              { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1], label: 'nums=[1,2,3,4]' },
              { args: [[10, 20]], expected: [20, 10], label: 'nums=[10,20]' }
            ],
            hiddenTests: [
              { args: [[7]], expected: [7], label: 'Single item' },
              { args: [[-1, 0, 5]], expected: [5, 0, -1], label: 'Negative & zero' }
            ]
          }
        ]
      });
    }

    const newExam = {
      id: `custom-exam-${Date.now()}`,
      isCustom: true,
      title: title.trim(),
      company: company.trim() || 'GPREC Placement Cell',
      category,
      difficulty: strictness === 'Zero-Trust Max' ? 'Hard' : 'Medium',
      passcode: passcode.trim().toUpperCase() || 'GPREC2026',
      durationMinutes: Number(durationMinutes) || 30,
      negativeMarking: Number(negativeMarking) || 0,
      maxViolations: Number(maxViolations) || 5,
      strictness,
      requireWebcam,
      description: `Scheduled secure assessment (${validMcqs.length} MCQs${includeCoding ? ' + 1 Coding Challenge' : ''}) with ${strictness} proctoring.`,
      sections
    };

    if (onPublishExam) onPublishExam(newExam);
    setTitle('');
    setPasscode(`GPREC${Math.floor(1000 + Math.random() * 9000)}`);
    if (addToast) addToast({ message: `Published "${newExam.title}" (Passcode: ${newExam.passcode})!`, type: 'success' });
  };

  const liveList = Object.values(liveCandidates);
  const filteredAttempts = attempts.filter(a => {
    const q = resultsSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      a.examTitle?.toLowerCase().includes(q) ||
      a.studentName?.toLowerCase().includes(q) ||
      a.studentEmail?.toLowerCase().includes(q) ||
      a.receiptHash?.toLowerCase().includes(q)
    );
  });

  const customExams = exams.filter(e => e.isCustom);

  return (
    <div className="flex flex-col gap-5">
      {/* Conductor Sub-Navigation */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 px-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'builder', label: 'Create & Schedule Test', icon: Plus },
            { id: 'war_room', label: `Live Proctor War Room (${liveList.length})`, icon: Radio },
            { id: 'results', label: `Results & Export (${attempts.length})`, icon: FileText }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  subTab === t.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
          Zero-Trust Conductor Console
        </span>
      </div>

      {/* TAB 1: CREATE & SCHEDULE SECURE EXAM */}
      {subTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handlePublish} className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 text-xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Schedule New Proctored Assessment</h3>
              <p className="text-xs text-slate-500">Configure access passcodes, negative marking, lockdown strictness, MCQs, and live coding challenges.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Exam Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. GPREC Placement Drive — Infosys SP Mock Assessment"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Drive Tag</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Room Access Passcode</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={passcode}
                    onChange={e => setPasscode(e.target.value.toUpperCase())}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 font-mono font-bold uppercase text-purple-700"
                  />
                  <button
                    type="button"
                    onClick={() => setPasscode(`GPREC${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                  >
                    Gen
                  </button>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Total Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Negative Marking (per wrong MCQ)</label>
                <select
                  value={negativeMarking}
                  onChange={e => setNegativeMarking(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value={0}>None (0)</option>
                  <option value={0.25}>-0.25 Marks</option>
                  <option value={0.5}>-0.50 Marks</option>
                  <option value={1}>-1.00 Marks</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Lockdown Strictness</label>
                <select
                  value={strictness}
                  onChange={e => setStrictness(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Zero-Trust Max">Zero-Trust Max (Fullscreen + Cam + Clipboard)</option>
                  <option value="Strict Lockdown">Strict Lockdown (Fullscreen + Tab/Blur Guard)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Auto-Terminate Max Strikes</label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={maxViolations}
                  onChange={e => setMaxViolations(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={requireWebcam}
                onChange={e => setRequireWebcam(e.target.checked)}
                className="w-4 h-4 accent-purple-600"
              />
              <span>Require Live Webcam & Ambient Microphone Sensor Verification</span>
            </label>

            {/* MCQ Builder */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">MCQ Questions ({mcqList.length})</span>
                <button
                  type="button"
                  onClick={addMcqRow}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add MCQ
                </button>
              </div>
              {mcqList.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-slate-700">Question #{idx + 1}</span>
                    {mcqList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setMcqList(prev => prev.filter(x => x.id !== q.id))}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    value={q.prompt}
                    onChange={e => updateMcq(q.id, { prompt: e.target.value })}
                    placeholder="Enter question statement..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-semibold"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`correct_${q.id}`}
                          checked={q.correctIndex === oi}
                          onChange={() => updateMcq(q.id, { correctIndex: oi })}
                          className="accent-emerald-600"
                          title="Mark as correct answer"
                        />
                        <input
                          value={opt}
                          onChange={e => updateMcqOption(q.id, oi, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          className="flex-1 p-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Coding Problem Section Toggle */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCoding}
                  onChange={e => setIncludeCoding(e.target.checked)}
                  className="w-4 h-4 accent-purple-600"
                />
                <span>Include Live Proctored Coding Section (Monaco IDE + Hidden Tests)</span>
              </label>
              {includeCoding && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <input
                    value={codingTitle}
                    onChange={e => setCodingTitle(e.target.value)}
                    placeholder="Coding Problem Title"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={codingStatement}
                    onChange={e => setCodingStatement(e.target.value)}
                    placeholder="Problem Statement..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Secure Exam to GPREC Exam Hall</span>
            </button>
          </form>

          {/* Right: Published Custom Exams List */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Custom Scheduled Exams ({customExams.length})</h4>
              <p className="text-[11px] text-slate-500">Share the room passcode with students to unlock.</p>
            </div>
            {customExams.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No custom exams published yet. Use the form on the left to publish one live.
              </div>
            ) : (
              <div className="space-y-3">
                {customExams.map(ex => (
                  <div key={ex.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-extrabold text-slate-900">{ex.title}</div>
                      <button
                        type="button"
                        onClick={() => onDeleteExam && onDeleteExam(ex.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete custom exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        Code: {ex.passcode}
                      </span>
                      <span className="text-slate-500">{ex.durationMinutes} min • -{ex.negativeMarking}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE PROCTOR WAR ROOM */}
      {subTab === 'war_room' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Realtime Supabase Proctor Channel Connected</span>
              </div>
              <h3 className="text-lg font-extrabold mt-0.5">Live Proctor War Room</h3>
              <p className="text-xs text-slate-400">Monitor active student webcam feeds, audio spikes, trust scores, and send live interventions.</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{liveList.length} Active Candidate(s)</span>
            </div>
          </div>

          {liveList.length === 0 ? (
            <div className="py-12 px-4 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-2">
              <Eye className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No candidates currently inside an active exam session</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Open a second browser tab on gprec.lumixora.in and start any Secure Exam to watch live webcam frames, Trust Scores, and remote interventions appear here in real time!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveList.map(c => (
                <div key={c.email} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-white">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.roll} • {c.department}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      (c.trustScore ?? 100) >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {c.trustScore ?? 100}%
                    </span>
                  </div>
                  <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                    {c.frame ? (
                      <img src={c.frame} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] text-slate-500">Telemetry Stream Active (No Frame)</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Strikes: <strong className="text-rose-400">{c.warnings || 0}</strong></span>
                    <span>Audio: <strong className="text-cyan-300">{c.audioDb || 0} dB</strong></span>
                    <span>Q: {c.currentQuestion || 1}/{c.totalQuestions || '-'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => sendProctorIntervention(c.email, 'warn', 'Proctor Warning: Please stay centered and do not switch windows.')}
                      className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer"
                    >
                      Send Warning
                    </button>
                    <button
                      type="button"
                      onClick={() => sendProctorIntervention(c.email, 'terminate', 'Exam terminated by proctor.')}
                      className="py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Ban className="w-3 h-3" /> Terminate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESULTS ANALYTICS & CSV/PDF EXPORT */}
      {subTab === 'results' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Proctored Assessment Results & Integrity Ledger</h3>
              <p className="text-xs text-slate-500">Tamper-evident scorecards with Trust Scores and violation counts.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={resultsSearch}
                  onChange={e => setResultsSearch(e.target.value)}
                  placeholder="Search student or hash..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <button
                type="button"
                disabled={attempts.length === 0}
                onClick={() => {
                  exportAttemptsToCsv(filteredAttempts);
                  if (addToast) addToast({ message: 'Exported GPREC Secure Exam Results CSV!', type: 'success' });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {filteredAttempts.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No exam submissions recorded yet. Complete any exam from the Exam Hall to see graded analytics here.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Candidate & Hash</th>
                    <th className="p-3">Assessment</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Trust Score</th>
                    <th className="p-3">Integrity</th>
                    <th className="p-3 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttempts.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/70">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{a.studentName}</div>
                        <div className="font-mono text-[10px] text-indigo-600">{a.receiptHash}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{a.examTitle}</div>
                        <div className="text-[10px] text-slate-400">{a.submittedAt}</div>
                      </td>
                      <td className="p-3 font-extrabold text-slate-900">
                        {a.earnedMarks}/{a.totalMarks} ({a.percentage}%)
                      </td>
                      <td className="p-3">
                        <span className={`font-black ${a.trustScore >= 80 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {a.trustScore}%
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">({a.violationCount} alerts)</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.integrityVerdict.includes('Clean')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : a.integrityVerdict.includes('Minor')
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {a.integrityVerdict}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => openPrintableScorecardPdf(a)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 font-bold text-[11px] text-slate-700 cursor-pointer"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
