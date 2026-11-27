import React, { useState } from 'react';
import {
  Calendar, Clock, Video, Vote, CheckCircle2, Users, ExternalLink,
  Bell, PlayCircle, ShieldCheck, ChevronRight, AlertCircle, FileText
} from 'lucide-react';

export default function NexusMeetingsAndPolls({
  session,
  activeRole,
  onNavigateTab
}) {
  // Real Cohort Availability Poll State (shared with Mission Control)
  const [cohortVotes, setCohortVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_cohort_poll_votes');
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });

  const selectedSlot = session?.id ? cohortVotes[session.id] || '' : '';
  const hasVoted = Boolean(selectedSlot);

  const pollSlots = [
    { id: 'sat_6pm', day: 'Saturday', date: '29 Nov 2026', time: '6:00 PM – 7:00 PM IST', lead: 'Shaik Sowban' },
    { id: 'sun_11am', day: 'Sunday', date: '30 Nov 2026', time: '11:00 AM – 12:00 PM IST', lead: 'Shaik Sowban' },
    { id: 'sun_5pm', day: 'Sunday', date: '30 Nov 2026', time: '5:00 PM – 6:00 PM IST', lead: 'Shaik Sowban' }
  ];

  const handleCastVote = (slotId) => {
    if (!session?.id) return;
    const updated = { ...cohortVotes, [session.id]: slotId };
    setCohortVotes(updated);
    try {
      localStorage.setItem('lumixora_cohort_poll_votes', JSON.stringify(updated));
    } catch (_) {}
  };

  // Scheduled Sessions
  const scheduledMeetings = [
    {
      id: 'm1',
      title: 'Batch 01 Official Cohort Kickoff & Founder Keynote',
      type: 'All-Hands Orientation',
      date: 'Sunday, 30 Nov 2026',
      time: '11:00 AM – 12:15 PM IST',
      host: 'Shaik Sowban (Founder)',
      link: 'https://meet.google.com/new',
      status: 'Confirmed',
      agenda: [
        'Welcome & Startup Culture Manifesto',
        'Department Task Scopes & Deliverables Standard',
        'Live Q&A on Capstone and Letters of Recommendation'
      ]
    },
    {
      id: 'm2',
      title: `${activeRole?.shortTitle} Department Weekly Standup`,
      type: 'Department Sprint',
      date: 'Tuesday, 02 Dec 2026',
      time: '7:00 PM – 7:30 PM IST',
      host: `${activeRole?.leadName || 'Shaik Sowban'} (Track Lead)`,
      link: 'https://meet.google.com/new',
      status: 'Upcoming',
      agenda: [
        'Sprint progress block clearing',
        'Mid-week deliverable review',
        'Live peer feedback'
      ]
    }
  ];

  // Recordings
  const pastRecordings = [
    {
      id: 'rec-1',
      title: 'Batch 01 Kickoff & Founder Keynote Session',
      duration: 'Scheduled Nov 30',
      date: 'Nov 30, 2026',
      speaker: 'Shaik Sowban (Founder)',
      status: 'Upcoming Live Session'
    },
    {
      id: 'rec-2',
      title: 'Department Sprint Standards & Milestone Rubric Walkthrough',
      duration: 'Scheduled Dec 02',
      date: 'Dec 02, 2026',
      speaker: 'Technical Lead',
      status: 'Scheduled'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ── TOP BANNER ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-purple-400">
              ORIENTATION & LIVE MEETINGS
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-bold text-slate-300">Synchronous & Async Touchpoints</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Orientation & Team Standups
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Cast your availability vote for live orientation, join one-click Google Meet standup rooms, and review recorded technical sessions.
          </p>
        </div>

        <a
          href="https://meet.google.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0 self-start md:self-auto"
        >
          <Video className="w-4 h-4 text-slate-950 animate-pulse" />
          <span>Launch Google Meet Room</span>
        </a>
      </div>

      {/* ── 2-COLUMN GRID: AVAILABILITY POLL & CONFIRMED SCHEDULE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Availability Poll Card */}
        <div className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-black text-white">Orientation Availability Poll</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Active Voting
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Vote for your preferred orientation slot. The time with the highest consensus becomes the official cohort meeting.
          </p>

          <div className="space-y-3">
            {pollSlots.map(slot => {
              const isSelected = selectedSlot === slot.id;
              const totalVotes = Object.values(cohortVotes).filter(v => v === slot.id).length;
              const totalCastVotes = Object.keys(cohortVotes).length;
              const percentage = totalCastVotes > 0 ? Math.round((totalVotes / totalCastVotes) * 100) : 0;
              return (
                <div
                  key={slot.id}
                  onClick={() => handleCastVote(slot.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-purple-500/15 border-purple-400 text-white shadow-md'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-purple-400 bg-purple-400' : 'border-white/30'}`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                      <span className="font-bold text-xs">{slot.day} · {slot.time}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-purple-300">
                      {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} {totalCastVotes > 0 && `(${percentage}%)`}
                    </span>
                  </div>

                  {/* Vote bar */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-purple-400' : 'bg-slate-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {hasVoted ? (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Your vote is confirmed! Calendar invite will be delivered to your registered email.</span>
            </div>
          ) : (
            <p className="text-[11px] text-amber-400/90 font-medium">
              Cast your vote above to finalize the orientation schedule with Founder Shaik Sowban.
            </p>
          )}
        </div>

        {/* Confirmed Meetings Schedule */}
        <div className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-black text-white">Upcoming Confirmed Sessions</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              Google Meet Live
            </span>
          </div>

          <div className="space-y-4">
            {scheduledMeetings.map(meeting => (
              <div key={meeting.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">{meeting.type}</span>
                    <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">{meeting.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{meeting.date} • {meeting.time}</span>
                    </p>
                  </div>
                  <a
                    href={meeting.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Session Agenda:</span>
                  {meeting.agenda.map((ag, aIdx) => (
                    <p key={aIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{ag}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RECORDINGS ARCHIVE ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-pink-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Archived Session Recordings</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Post-Session Replay</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {pastRecordings.map(rec => (
            <div key={rec.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{rec.title}</h4>
                <p className="text-[11px] text-slate-400">{rec.speaker} • {rec.duration}</p>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  {rec.status}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 text-slate-500 shrink-0" title="Available after live session">
                <PlayCircle className="w-5 h-5 opacity-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
