import React, { useState, useEffect, useMemo } from 'react';
import { cleanScholarName } from '../../utils/authSecurity';
import {
  Trophy, Flame, Award, Sparkles, Star, Plus, CheckCircle2, Lock,
  TrendingUp, Users, Building, X, Heart, ShieldCheck, Zap, Crown
} from 'lucide-react';
import { loadExamAttempts } from './gprecSecureExamBank';
import { supabase } from '../../config/supabase';

// Real Pilot Scholars (Real registered GPREC scholars with uncalibrated baseline)
const BASE_REAL_SCHOLARS = [
  { id: 'u_akhil', name: 'MAHENDRAKAR AKHIL', branch: 'CSE', roll: '249XA33112', email: '249xa33112@gprec.ac.in', readiness: 0, dsaSolved: 0, streak: 0, badge: 'Rising Challenger' },
  { id: 'u_sowban', name: 'KUMARKALAVA MOHAMMED SOWBAN', branch: 'CSE', roll: '249XA33106', email: '249xa33106@gprec.ac.in', readiness: 0, dsaSolved: 1, streak: 0, badge: 'Verified Coder' },
  { id: 'u_harshith', name: 'MOCHI SAI HARSHITH', branch: 'CSE', roll: '249XA33096', email: '249xa33096@gprec.ac.in', readiness: 0, dsaSolved: 0, streak: 0, badge: 'Rising Challenger' },
  { id: 'u_meghana', name: 'Meghana Bandi', branch: 'CSE', roll: '259XA05013', email: '259xa05013@gprec.ac.in', readiness: 0, dsaSolved: 0, streak: 0, badge: 'Rising Challenger' }
];

const OFFER_WALL_KEY = 'gprec_campus_offer_wall_v1';
const REWARDS_CLAIMED_KEY = 'gprec_claimed_rewards_v1';

export default function GprecCampusArenaHub({
  user,
  overallReadiness = 0,
  solvedCount = 0,
  aptitudeCount = 0,
  streakDays = 0,
  awardXP,
  addToast
}) {
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'offer_wall' | 'streaks'
  const [branchFilter, setBranchFilter] = useState('All');

  // Real Database Scholars State
  const [dbScholars, setDbScholars] = useState(BASE_REAL_SCHOLARS);

  useEffect(() => {
    let isMounted = true;
    const fetchRealScholars = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, department, branch, roll_number, streak, xp, tests_written, college')
          .limit(80);

        if (!error && Array.isArray(data) && data.length > 0 && isMounted) {
          const mapped = data
            .filter(u => u && u.name && !u.name.toLowerCase().includes('admin') && !u.email?.toLowerCase().includes('admin'))
            .map(u => {
              const cleanName = cleanScholarName(u.name, 'GPREC Scholar');
              const roll = u.roll_number || (u.email ? u.email.split('@')[0].toUpperCase() : 'GPREC');
              const branch = (u.branch || u.department || 'CSE').toUpperCase().slice(0, 5);
              const tests = typeof u.tests_written === 'number' ? u.tests_written : 0;
              const streak = typeof u.streak === 'number' ? u.streak : 0;
              const xp = typeof u.xp === 'number' ? u.xp : 0;
              const computedReadiness = xp > 0 ? Math.min(100, Math.round(xp / 10)) : (tests > 0 ? Math.min(100, tests * 8) : 0);
              return {
                id: u.id,
                name: cleanName,
                branch,
                roll,
                email: (u.email || '').toLowerCase(),
                readiness: computedReadiness,
                dsaSolved: tests,
                streak,
                badge: computedReadiness >= 75 ? 'Super-Dream Contender' : tests > 0 ? 'Verified Coder' : 'Rising Challenger'
              };
            });

          const seen = new Set();
          const deduped = [];
          for (const item of mapped) {
            const key = (item.email || item.roll || item.name).toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              deduped.push(item);
            }
          }

          setDbScholars(deduped);
        }
      } catch (err) {
        console.warn('Real scholars fetch notice:', err);
      }
    };

    fetchRealScholars();
    return () => { isMounted = false; };
  }, []);

  // Offer Wall State (Strictly real student offers, automatically purging legacy mock data)
  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem(OFFER_WALL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(o => o && o.id && !['ow1', 'ow2', 'ow3', 'ow4', 'ow5', 'ow6'].includes(o.id) && !o.student?.includes('Vaishnavi'));
          return clean;
        }
      }
    } catch (e) {}
    return [];
  });
  const [cheeredIds, setCheeredIds] = useState([]);
  const [showPostOfferModal, setShowPostOfferModal] = useState(false);
  const [newOfferCompany, setNewOfferCompany] = useState('');
  const [newOfferRole, setNewOfferRole] = useState('');
  const [newOfferCtc, setNewOfferCtc] = useState('');
  const [newOfferTier, setNewOfferTier] = useState('Dream');
  const [newOfferQuote, setNewOfferQuote] = useState('');

  // Claimed Milestone Rewards
  const [claimedRewards, setClaimedRewards] = useState(() => {
    try {
      const saved = localStorage.getItem(REWARDS_CLAIMED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(OFFER_WALL_KEY, JSON.stringify(offers)); } catch (e) {}
  }, [offers]);

  useEffect(() => {
    try { localStorage.setItem(REWARDS_CLAIMED_KEY, JSON.stringify(claimedRewards)); } catch (e) {}
  }, [claimedRewards]);

  const studentName = cleanScholarName(user?.name || user?.displayName, 'You (GPREC Scholar)');
  const studentBranch = (user?.branch || user?.department || 'CSE').toUpperCase().slice(0, 5);
  const studentRoll = user?.rollNumber || user?.roll || (user?.email ? user.email.split('@')[0].toUpperCase() : 'GPREC-YOU');
  const studentEmail = (user?.email || '').toLowerCase();

  // Combine current student dynamically into live campus rankings
  const rankedScholars = useMemo(() => {
    const myRow = {
      id: 'current_user',
      isMe: true,
      name: studentName,
      branch: studentBranch,
      roll: studentRoll,
      email: studentEmail,
      readiness: overallReadiness,
      dsaSolved: solvedCount,
      streak: streakDays,
      badge: overallReadiness >= 85 ? 'Super-Dream Ready' : overallReadiness >= 60 ? 'Tier-1 Qualified' : 'Rising Challenger'
    };

    // Filter out current user from dbScholars to avoid duplication
    const others = dbScholars.filter(s => {
      if (s.email && studentEmail && s.email === studentEmail) return false;
      if (s.roll && studentRoll && s.roll === studentRoll) return false;
      if (s.name && studentName && s.name.toLowerCase() === studentName.toLowerCase()) return false;
      return true;
    });

    const combined = [myRow, ...others].sort((a, b) => b.readiness - a.readiness || b.dsaSolved - a.dsaSolved || b.streak - a.streak);
    if (branchFilter === 'All') return combined;
    return combined.filter(s => s.branch.includes(branchFilter));
  }, [studentName, studentBranch, studentRoll, studentEmail, overallReadiness, solvedCount, streakDays, branchFilter, dbScholars]);

  // Dynamically compute real branch statistics from real scholars
  const branchStats = useMemo(() => {
    const branchConfigs = [
      { id: 'CSE', name: 'CSE (Computer Science)', color: 'from-indigo-500 to-purple-600' },
      { id: 'CSM', name: 'CSM (AI & ML)', color: 'from-cyan-500 to-blue-600' },
      { id: 'CSD', name: 'CSD (Data Science)', color: 'from-violet-500 to-fuchsia-600' },
      { id: 'ECE', name: 'ECE (Electronics)', color: 'from-emerald-500 to-teal-600' },
      { id: 'EEE', name: 'EEE (Electrical)', color: 'from-amber-500 to-orange-600' },
      { id: 'MECH', name: 'MECH (Mechanical)', color: 'from-rose-500 to-pink-600' },
      { id: 'CIVIL', name: 'CIVIL Engineering', color: 'from-slate-500 to-slate-700' }
    ];

    return branchConfigs.map(bc => {
      const inBranch = rankedScholars.filter(s => (s.branch || '').includes(bc.id));
      const count = inBranch.length;
      const activeCoders = inBranch.filter(s => s.dsaSolved > 0 || s.readiness > 0).length;
      const totalReadiness = inBranch.reduce((acc, s) => acc + (s.readiness || 0), 0);
      const avgReadiness = count > 0 ? Math.round(totalReadiness / count) : 0;
      const totalStreak = inBranch.reduce((acc, s) => acc + (s.streak || 0), 0);
      const streakAvg = count > 0 ? Math.round(totalStreak / count) : 0;
      const branchOffers = offers.filter(o => (o.branch || '').includes(bc.id)).length;

      return {
        id: bc.id,
        name: bc.name,
        color: bc.color,
        activeCoders,
        offers: branchOffers,
        avgReadiness,
        streakAvg
      };
    }).sort((a, b) => b.avgReadiness - a.avgReadiness || b.activeCoders - a.activeCoders);
  }, [rankedScholars, offers]);

  const examAttempts = useMemo(() => loadExamAttempts(), []);
  const hasCleanExam = examAttempts.some(a => (a.trustScore ?? 0) >= 85);

  const badges = useMemo(() => [
    { id: 'b_streak', title: '14-Day Iron Streak', desc: 'Maintain 14+ consecutive days of placement prep', unlocked: streakDays >= 14, xp: 150, icon: Flame },
    { id: 'b_coder', title: 'Algorithm Gladiator', desc: 'Solve verified DSA problems in Coding Arena', unlocked: solvedCount >= 1, xp: 100, icon: Zap },
    { id: 'b_apt', title: 'Quant Speedster', desc: 'Complete timed drills in Aptitude Arena', unlocked: aptitudeCount >= 1, xp: 100, icon: TrendingUp },
    { id: 'b_proctor', title: 'Zero-Trust Verified', desc: 'Complete a Proctored Secure Exam with ≥85% Trust Score', unlocked: hasCleanExam, xp: 200, icon: ShieldCheck },
    { id: 'b_ready80', title: 'Dream-Offer Ready', desc: 'Reach ≥80% Overall Placement Readiness', unlocked: (overallReadiness || 0) >= 80, xp: 250, icon: Trophy },
    { id: 'b_elite', title: 'Super-Dream Contender', desc: 'Achieve ≥90% Placement Readiness across vectors', unlocked: (overallReadiness || 0) >= 90, xp: 400, icon: Crown }
  ], [streakDays, solvedCount, aptitudeCount, hasCleanExam, overallReadiness]);

  const handleCheer = (offerId) => {
    if (cheeredIds.includes(offerId)) return;
    setCheeredIds(prev => [...prev, offerId]);
    setOffers(prev => prev.map(o => (o.id === offerId ? { ...o, cheers: (o.cheers || 0) + 1 } : o)));
    if (addToast) addToast({ message: 'Sent applause to your GPREC senior!', type: 'success' });
  };

  const handlePostOffer = (e) => {
    e.preventDefault();
    if (!newOfferCompany.trim() || !newOfferRole.trim()) {
      if (addToast) addToast({ message: 'Please enter Company and Role.', type: 'warning' });
      return;
    }
    const created = {
      id: `ow_${Date.now()}`,
      student: studentName,
      branch: `${studentBranch} • 2026`,
      company: newOfferCompany.trim(),
      role: newOfferRole.trim(),
      ctc: newOfferCtc.trim() || '₹10+ LPA',
      tier: newOfferTier,
      quote: newOfferQuote.trim() || 'Proud to crack this placement drive with consistent prep on GPREC Placement Suite!',
      cheers: 1
    };
    setOffers(prev => [created, ...prev]);
    setNewOfferCompany('');
    setNewOfferRole('');
    setNewOfferCtc('');
    setNewOfferQuote('');
    setShowPostOfferModal(false);
    if (awardXP) awardXP(300, `Celebrated Placement Offer at ${created.company}`);
    if (addToast) addToast({ message: `Congratulations on your offer at ${created.company}! Posted to Offer Wall.`, type: 'success' });
  };

  const handleClaimBadge = (badge) => {
    if (!badge.unlocked || claimedRewards.includes(badge.id)) return;
    setClaimedRewards(prev => [...prev, badge.id]);
    if (awardXP) awardXP(badge.xp, `Claimed Reward: ${badge.title}`);
    if (addToast) addToast({ message: `Claimed +${badge.xp} XP for ${badge.title}!`, type: 'success' });
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Campus Arena Hero */}
      <div className="bg-gradient-to-br from-[#0B0D24] via-[#1B1242] to-[#3B125E] rounded-3xl p-6 text-white shadow-xl border border-purple-900/50 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>GPREC Gamified Campus Placement Culture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Branch Leaderboard, Live Offer Wall & Streak Rewards
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl">
              Compete branch-vs-branch across GPREC departments, celebrate newly placed seniors on the live Offer Wall, and unlock placement milestones & XP rewards.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2.5 min-w-[260px] text-center">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Your Streak</div>
              <div className="text-xl font-black text-amber-300 mt-0.5">{streakDays}d</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Offer Wall</div>
              <div className="text-xl font-black text-emerald-300 mt-0.5">{offers.length}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Badges</div>
              <div className="text-xl font-black text-purple-300 mt-0.5">{unlockedCount}/{badges.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 px-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'leaderboard', label: 'Branch-vs-Branch Leaderboard', icon: Trophy },
            { id: 'offer_wall', label: `Live Offer Wall (${offers.length})`, icon: Award },
            { id: 'streaks', label: `Streaks & Rewards (${unlockedCount}/${badges.length})`, icon: Flame }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === t.id
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#9333ea] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'offer_wall' && (
          <button
            type="button"
            onClick={() => setShowPostOfferModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Celebrate My Offer
          </button>
        )}
      </div>

      {/* ================================================================= */}
      {/* TAB 1: BRANCH-VS-BRANCH PLACEMENT LEADERBOARD                     */}
      {/* ================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Department Head-to-Head Battle (100% Real Live Computed Stats) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">GPREC Branch-vs-Branch Standings</h3>
              <p className="text-xs text-slate-500">Live department readiness index, active coders & placement offers.</p>
            </div>
            <div className="space-y-3">
              {branchStats.map((br, idx) => (
                <div key={br.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] text-white bg-gradient-to-tr ${br.color}`}>
                        #{idx + 1}
                      </span>
                      <span>{br.name}</span>
                    </div>
                    <span className="font-black text-indigo-700">{br.avgReadiness}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${br.color} rounded-full`} style={{ width: `${Math.min(100, br.avgReadiness)}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                    <span>{br.offers} Offers Secured</span>
                    <span>{br.activeCoders} Active Coders</span>
                    <span>Avg Streak: {br.streakAvg}d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Top Campus Performers Podium & Live Student Rank (Real Database Scholars) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Top GPREC Placement Performers</h3>
                <p className="text-xs text-slate-500">Your live rank rises automatically as you solve coding problems & pass proctored exams.</p>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {['All', 'CSE', 'CSM', 'CSD', 'ECE'].map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranchFilter(b)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer ${
                      branchFilter === b ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Scholar</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">DSA</th>
                    <th className="p-3">Streak</th>
                    <th className="p-3 text-right">Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rankedScholars.slice(0, 15).map((sc, idx) => (
                    <tr key={sc.id} className={sc.isMe ? 'bg-purple-50/80 font-bold' : 'hover:bg-slate-50/70'}>
                      <td className="p-3 font-black">
                        {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                      </td>
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{sc.name}</span>
                          {sc.isMe && <span className="px-1.5 py-0.5 rounded bg-purple-600 text-white text-[9px] font-black">YOU</span>}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{sc.roll} • {sc.badge}</div>
                      </td>
                      <td className="p-3 font-bold text-indigo-700">{sc.branch}</td>
                      <td className="p-3 font-semibold text-slate-700">{sc.dsaSolved}</td>
                      <td className="p-3 font-bold text-amber-600">🔥 {sc.streak}d</td>
                      <td className="p-3 text-right font-black text-slate-900">{sc.readiness}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: GPREC LIVE PLACED STUDENTS OFFER WALL (REAL VERIFIED DATA) */}
      {/* ================================================================= */}
      {activeTab === 'offer_wall' && (
        <div>
          {offers.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <Award className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-extrabold text-slate-900">Live Campus Placement Offer Wall</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No verified campus placement offers have been posted yet for the current 2025–2026 drive.
                  When you clear your final interview round (TCS, Amazon, Cognizant, Infosys), celebrate your success by posting on the GPREC Live Offer Wall!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPostOfferModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" /> Celebrate My Placement Offer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offers.map(of => {
                const cheered = cheeredIds.includes(of.id);
                return (
                  <div key={of.id} className="bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all relative overflow-hidden">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          of.tier === 'Super-Dream'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                            : of.tier === 'Core Elite'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {of.tier}
                        </span>
                        <span className="text-sm font-black text-emerald-700">{of.ctc}</span>
                      </div>

                      <div>
                        <div className="text-xs font-extrabold text-purple-700 uppercase tracking-wide">{of.company} — {of.role}</div>
                        <h4 className="text-base font-extrabold text-slate-900 mt-0.5">{of.student}</h4>
                        <div className="text-[11px] font-semibold text-slate-400">{of.branch}</div>
                      </div>

                      <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        “{of.quote}”
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">GPREC Hall of Fame</span>
                      <button
                        type="button"
                        onClick={() => handleCheer(of.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                          cheered
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${cheered ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>Congrats ({of.cheers})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 3: DAILY STREAKS, PLACEMENT BADGES & MILESTONE REWARDS        */}
      {/* ================================================================= */}
      {activeTab === 'streaks' && (
        <div className="space-y-5">
          {/* Real Streak Banner */}
          <div className="bg-slate-950 border border-indigo-900/60 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="text-xs font-extrabold text-amber-400 uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>Active Placement Momentum</span>
              </div>
              <h3 className="text-2xl font-black mt-1">{streakDays}-Day Prep Streak</h3>
              <p className="text-xs text-slate-400 mt-1">
                {streakDays > 0 
                  ? 'Keep solving coding problems and aptitude drills daily to maintain your placement momentum!' 
                  : 'Start your streak today by solving 1 coding problem or completing 1 aptitude drill.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'].map((day, idx) => (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border font-bold text-xs ${
                    idx < 6 && streakDays > idx
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                      : idx === 6 && streakDays > 0
                      ? 'bg-gradient-to-tr from-amber-400 to-orange-500 border-amber-300 text-slate-950 shadow-lg shadow-amber-500/30'
                      : 'bg-white/5 border-white/10 text-slate-600'
                  }`}>
                    {streakDays > idx ? '🔥' : '○'}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unlockable Placement Badges & Claimable XP Rewards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map(b => {
              const Icon = b.icon;
              const claimed = claimedRewards.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                    b.unlocked
                      ? 'bg-white border-purple-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      b.unlocked ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      +{b.xp} XP
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{b.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{b.desc}</p>
                  </div>

                  <button
                    type="button"
                    disabled={!b.unlocked || claimed}
                    onClick={() => handleClaimBadge(b)}
                    className={`w-full py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                      claimed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : b.unlocked
                        ? 'bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 text-white cursor-pointer shadow-xs'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {claimed ? <CheckCircle2 className="w-3.5 h-3.5" /> : !b.unlocked ? <Lock className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{claimed ? 'Reward Claimed' : b.unlocked ? `Claim +${b.xp} XP Reward` : 'Locked Milestone'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Post My Offer Modal */}
      {showPostOfferModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handlePostOffer} className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900">Celebrate Your Placement Offer!</h4>
              <button type="button" onClick={() => setShowPostOfferModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input value={newOfferCompany} onChange={e => setNewOfferCompany(e.target.value)} placeholder="Company Name * (e.g. Amazon, Infosys SP)" className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold" />
            <input value={newOfferRole} onChange={e => setNewOfferRole(e.target.value)} placeholder="Role * (e.g. SDE-1, Data Analyst)" className="w-full p-2.5 rounded-xl border border-slate-200" />
            <div className="grid grid-cols-2 gap-2.5">
              <input value={newOfferCtc} onChange={e => setNewOfferCtc(e.target.value)} placeholder="Package (e.g. ₹14 LPA)" className="p-2.5 rounded-xl border border-slate-200" />
              <select value={newOfferTier} onChange={e => setNewOfferTier(e.target.value)} className="p-2.5 rounded-xl border border-slate-200 bg-white font-semibold">
                <option value="Super-Dream">Super-Dream</option>
                <option value="Dream">Dream</option>
                <option value="Core Elite">Core Elite</option>
              </select>
            </div>
            <textarea rows={3} value={newOfferQuote} onChange={e => setNewOfferQuote(e.target.value)} placeholder="Share 1 prep tip for your GPREC juniors..." className="w-full p-2.5 rounded-xl border border-slate-200" />
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowPostOfferModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 cursor-pointer">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold cursor-pointer">Post to Offer Wall</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
