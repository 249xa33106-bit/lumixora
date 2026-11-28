import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar, Clock, Video, Vote, CheckCircle2, Users, ExternalLink,
  Bell, PlayCircle, ShieldCheck, ChevronRight, AlertCircle, FileText,
  Plus, Edit3, Trash2, X, Check, Link2, Megaphone, Radio
} from 'lucide-react';

export default function NexusMeetingsAndPolls({
  session,
  activeRole,
  onNavigateTab
}) {
  // Check if current user is Founder Shaik Sowban
  const isFounder = useMemo(() => {
    return session?.email?.includes('sowban') || session?.role === 'founder' || session?.isFounder === true;
  }, [session]);

  // 1. Top Launch Meet Room Link (Founder Configurable)
  const [launchMeetUrl, setLaunchMeetUrl] = useState(() => {
    try {
      return localStorage.getItem('lumixora_live_meet_room_url') || 'https://meet.google.com/new';
    } catch (_) {
      return 'https://meet.google.com/new';
    }
  });

  const [editRoomUrlModal, setEditRoomUrlModal] = useState(false);
  const [tempRoomUrl, setTempRoomUrl] = useState(launchMeetUrl);

  const handleSaveRoomUrl = (e) => {
    if (e) e.preventDefault();
    let url = tempRoomUrl.trim();
    if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
    setLaunchMeetUrl(url);
    try {
      localStorage.setItem('lumixora_live_meet_room_url', url);
    } catch (_) {}
    setEditRoomUrlModal(false);
  };

  // 2. Real Cohort Availability Poll State
  const defaultPollSlots = [
    { id: 'sat_6pm', day: 'Saturday', date: '29 Nov 2026', time: '6:00 PM – 7:00 PM IST', lead: 'Shaik Sowban', baseVotes: 14 },
    { id: 'sun_11am', day: 'Sunday', date: '30 Nov 2026', time: '11:00 AM – 12:00 PM IST', lead: 'Shaik Sowban', baseVotes: 22 },
    { id: 'sun_5pm', day: 'Sunday', date: '30 Nov 2026', time: '5:00 PM – 6:00 PM IST', lead: 'Shaik Sowban', baseVotes: 12 }
  ];

  const [pollSlots, setPollSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_orientation_poll_slots');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return defaultPollSlots;
  });

  const [pollQuestion, setPollQuestion] = useState(() => {
    try {
      return localStorage.getItem('lumixora_orientation_poll_question') || 'Vote for your preferred orientation slot. The time with the highest consensus becomes the official cohort meeting.';
    } catch (_) {
      return 'Vote for your preferred orientation slot. The time with the highest consensus becomes the official cohort meeting.';
    }
  });

  const [pollStatus, setPollStatus] = useState(() => {
    try {
      return localStorage.getItem('lumixora_orientation_poll_status') || 'Active Voting';
    } catch (_) {
      return 'Active Voting';
    }
  });

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

  const handleCastVote = (slotId) => {
    if (!session?.id) return;
    const updated = { ...cohortVotes, [session.id]: slotId };
    setCohortVotes(updated);
    try {
      localStorage.setItem('lumixora_cohort_poll_votes', JSON.stringify(updated));
    } catch (_) {}
  };

  // Poll Editor Modal State
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [pollForm, setPollForm] = useState({
    question: pollQuestion,
    status: pollStatus,
    slots: pollSlots
  });

  const handleSavePoll = (e) => {
    if (e) e.preventDefault();
    setPollQuestion(pollForm.question);
    setPollStatus(pollForm.status);
    setPollSlots(pollForm.slots);
    try {
      localStorage.setItem('lumixora_orientation_poll_question', pollForm.question);
      localStorage.setItem('lumixora_orientation_poll_status', pollForm.status);
      localStorage.setItem('lumixora_orientation_poll_slots', JSON.stringify(pollForm.slots));
    } catch (_) {}
    setPollModalOpen(false);
  };

  // 3. Scheduled Meetings State (Founder Add / Edit / Update / Delete)
  const defaultMeetings = [
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
      title: `${activeRole?.shortTitle || 'Engineering'} Department Weekly Standup`,
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

  const [scheduledMeetings, setScheduledMeetings] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_scheduled_meetings');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return defaultMeetings;
  });

  // Meeting Form Modal State
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState(null); // null = new, string = edit
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    type: 'All-Hands Orientation',
    date: 'Sunday, 30 Nov 2026',
    time: '11:00 AM – 12:15 PM IST',
    host: 'Shaik Sowban (Founder)',
    link: 'https://meet.google.com/new',
    status: 'Confirmed',
    agendaText: 'Welcome & Startup Culture Manifesto\nDepartment Task Scopes & Deliverables Standard\nLive Q&A on Capstone and Letters of Recommendation'
  });

  const openNewMeetingModal = () => {
    setEditingMeetingId(null);
    setMeetingForm({
      title: '',
      type: 'All-Hands Orientation',
      date: 'Sunday, 30 Nov 2026',
      time: '11:00 AM – 12:15 PM IST',
      host: 'Shaik Sowban (Founder)',
      link: 'https://meet.google.com/new',
      status: 'Confirmed',
      agendaText: 'Welcome & Startup Culture Manifesto\nDeliverables Standard & Review Rubric\nLive Q&A'
    });
    setMeetingModalOpen(true);
  };

  const openEditMeetingModal = (meeting) => {
    setEditingMeetingId(meeting.id);
    setMeetingForm({
      title: meeting.title,
      type: meeting.type,
      date: meeting.date,
      time: meeting.time,
      host: meeting.host,
      link: meeting.link,
      status: meeting.status,
      agendaText: Array.isArray(meeting.agenda) ? meeting.agenda.join('\n') : meeting.agenda || ''
    });
    setMeetingModalOpen(true);
  };

  const handleSaveMeeting = (e) => {
    if (e) e.preventDefault();
    if (!meetingForm.title.trim()) return;

    let linkUrl = meetingForm.link.trim();
    if (linkUrl && !/^https?:\/\//i.test(linkUrl)) linkUrl = `https://${linkUrl}`;

    const agendaList = meetingForm.agendaText
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);

    const meetingObj = {
      id: editingMeetingId || `m_${Date.now()}`,
      title: meetingForm.title.trim(),
      type: meetingForm.type,
      date: meetingForm.date.trim(),
      time: meetingForm.time.trim(),
      host: meetingForm.host.trim() || 'Shaik Sowban (Founder)',
      link: linkUrl || 'https://meet.google.com/new',
      status: meetingForm.status,
      agenda: agendaList.length > 0 ? agendaList : ['Sprint Discussion', 'Q&A']
    };

    let updated;
    if (editingMeetingId) {
      updated = scheduledMeetings.map(m => m.id === editingMeetingId ? meetingObj : m);
    } else {
      updated = [meetingObj, ...scheduledMeetings];
    }

    setScheduledMeetings(updated);
    try {
      localStorage.setItem('lumixora_scheduled_meetings', JSON.stringify(updated));
    } catch (_) {}
    setMeetingModalOpen(false);
  };

  const handleDeleteMeeting = (meetingId) => {
    if (!window.confirm('Are you sure you want to delete this scheduled session?')) return;
    const updated = scheduledMeetings.filter(m => m.id !== meetingId);
    setScheduledMeetings(updated);
    try {
      localStorage.setItem('lumixora_scheduled_meetings', JSON.stringify(updated));
    } catch (_) {}
  };

  // 4. Past Recordings State
  const defaultRecordings = [
    {
      id: 'rec-1',
      title: 'Batch 01 Kickoff & Founder Keynote Session',
      duration: 'Scheduled Nov 30',
      date: 'Nov 30, 2026',
      speaker: 'Shaik Sowban (Founder)',
      link: '',
      status: 'Upcoming Live Session'
    },
    {
      id: 'rec-2',
      title: 'Department Sprint Standards & Milestone Rubric Walkthrough',
      duration: 'Scheduled Dec 02',
      date: 'Dec 02, 2026',
      speaker: 'Technical Lead',
      link: '',
      status: 'Scheduled'
    }
  ];

  const [recordings, setRecordings] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_session_recordings');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return defaultRecordings;
  });

  const [recordingModalOpen, setRecordingModalOpen] = useState(false);
  const [editingRecId, setEditingRecId] = useState(null);
  const [recordingForm, setRecordingForm] = useState({
    title: '',
    duration: '45 mins',
    date: 'Nov 30, 2026',
    speaker: 'Shaik Sowban (Founder)',
    link: '',
    status: 'Replay Available'
  });

  const openNewRecordingModal = () => {
    setEditingRecId(null);
    setRecordingForm({
      title: '',
      duration: '45 mins',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      speaker: 'Shaik Sowban (Founder)',
      link: '',
      status: 'Replay Available'
    });
    setRecordingModalOpen(true);
  };

  const openEditRecordingModal = (rec) => {
    setEditingRecId(rec.id);
    setRecordingForm({
      title: rec.title,
      duration: rec.duration,
      date: rec.date,
      speaker: rec.speaker,
      link: rec.link || '',
      status: rec.status
    });
    setRecordingModalOpen(true);
  };

  const handleSaveRecording = (e) => {
    if (e) e.preventDefault();
    if (!recordingForm.title.trim()) return;

    let recUrl = recordingForm.link.trim();
    if (recUrl && !/^https?:\/\//i.test(recUrl)) recUrl = `https://${recUrl}`;

    const recObj = {
      id: editingRecId || `rec_${Date.now()}`,
      title: recordingForm.title.trim(),
      duration: recordingForm.duration.trim(),
      date: recordingForm.date.trim(),
      speaker: recordingForm.speaker.trim(),
      link: recUrl,
      status: recordingForm.status
    };

    let updated;
    if (editingRecId) {
      updated = recordings.map(r => r.id === editingRecId ? recObj : r);
    } else {
      updated = [recObj, ...recordings];
    }

    setRecordings(updated);
    try {
      localStorage.setItem('lumixora_session_recordings', JSON.stringify(updated));
    } catch (_) {}
    setRecordingModalOpen(false);
  };

  const handleDeleteRecording = (recId) => {
    if (!window.confirm('Delete this recording entry?')) return;
    const updated = recordings.filter(r => r.id !== recId);
    setRecordings(updated);
    try {
      localStorage.setItem('lumixora_session_recordings', JSON.stringify(updated));
    } catch (_) {}
  };

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

        {/* Top Action Controls: Launch Room + Founder Edit Room Button */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto flex-wrap">
          <a
            href={launchMeetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Video className="w-4 h-4 text-slate-950 animate-pulse" />
            <span>Launch Google Meet Room</span>
          </a>

          {isFounder && (
            <button
              onClick={() => {
                setTempRoomUrl(launchMeetUrl);
                setEditRoomUrlModal(true);
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Founder: Edit the Default Meet Room URL"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Room Link</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2-COLUMN GRID: AVAILABILITY POLL & CONFIRMED SCHEDULE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Availability Poll Card */}
        <div className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4 relative">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-black text-white">Orientation Availability Poll</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {pollStatus}
              </span>

              {isFounder && (
                <button
                  onClick={() => {
                    setPollForm({ question: pollQuestion, status: pollStatus, slots: pollSlots });
                    setPollModalOpen(true);
                  }}
                  className="px-2 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Founder: Edit Poll Question & Slots"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Poll</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-300">
            {pollQuestion}
          </p>

          <div className="space-y-3">
            {pollSlots.map(slot => {
              const isSelected = selectedSlot === slot.id;
              const extraVotes = Object.values(cohortVotes).filter(v => v === slot.id).length;
              const totalVotes = (slot.baseVotes || 0) + extraVotes;
              const totalCastVotes = pollSlots.reduce((sum, s) => sum + (s.baseVotes || 0) + Object.values(cohortVotes).filter(v => v === s.id).length, 0);
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
        <div className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4 relative">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-black text-white">Upcoming Confirmed Sessions</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Google Meet Live
              </span>

              {isFounder && (
                <button
                  onClick={openNewMeetingModal}
                  className="px-2.5 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-md"
                  title="Founder: Schedule and Post a New Meeting"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Meeting</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {scheduledMeetings.map(meeting => (
              <div key={meeting.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 relative group">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">{meeting.type}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                        meeting.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold' :
                        meeting.status === 'Live Now' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse font-bold' :
                        'bg-white/10 text-slate-300 border-white/10'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">{meeting.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{meeting.date} • {meeting.time}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={meeting.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join</span>
                    </a>

                    {isFounder && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditMeetingModal(meeting)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10"
                          title="Edit this meeting details or link"
                        >
                          <Edit3 className="w-3 h-3 text-cyan-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          title="Delete this meeting"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Session Agenda:</span>
                  {(meeting.agenda || []).map((ag, aIdx) => (
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
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Post-Session Replay</span>
            {isFounder && (
              <button
                onClick={openNewRecordingModal}
                className="px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Founder: Add Recording Link"
              >
                <Plus className="w-3 h-3" />
                <span>Add Recording</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {recordings.map(rec => (
            <div key={rec.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{rec.title}</h4>
                <p className="text-[11px] text-slate-400">{rec.speaker} • {rec.duration}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    {rec.status}
                  </span>
                  {rec.link && (
                    <a
                      href={rec.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Watch Replay</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {rec.link ? (
                  <a
                    href={rec.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 transition-all"
                  >
                    <PlayCircle className="w-5 h-5" />
                  </a>
                ) : (
                  <div className="p-2 rounded-xl bg-white/5 text-slate-500 opacity-40">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                )}

                {isFounder && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditRecordingModal(rec)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                      title="Edit recording"
                    >
                      <Edit3 className="w-3 h-3 text-pink-300" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecording(rec.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      title="Delete recording"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── FOUNDER MODALS (POST / EDIT / UPDATE CONTROLS) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}

      {/* 1. Modal: Edit Top Google Meet Room URL */}
      {editRoomUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0a0e1a] border border-emerald-500/30 p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>Update Main Standup Meet Link</span>
              </h3>
              <button onClick={() => setEditRoomUrlModal(false)} className="p-1 rounded bg-white/5 hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoomUrl} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Google Meet / Zoom Room URL</label>
                <input
                  type="text"
                  value={tempRoomUrl}
                  onChange={e => setTempRoomUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400 font-mono text-xs"
                />
                <span className="text-[10px] text-gray-400 block mt-1">This link opens when interns click 'Launch Google Meet Room'.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditRoomUrlModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md cursor-pointer"
                >
                  Save Meet URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Post or Edit Meeting */}
      {meetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0a0e1a] border border-cyan-500/30 p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-black text-white">
                  {editingMeetingId ? 'Edit Scheduled Session' : 'Post New Meeting / Standup'}
                </h3>
              </div>
              <button onClick={() => setMeetingModalOpen(false)} className="p-1 rounded bg-white/5 hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMeeting} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={meetingForm.title}
                  onChange={e => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  placeholder="e.g. Batch 01 Keynote & Sprint Orientation"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Session Type</label>
                  <select
                    value={meetingForm.type}
                    onChange={e => setMeetingForm({ ...meetingForm, type: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="All-Hands Orientation">All-Hands Orientation</option>
                    <option value="Department Sprint">Department Sprint</option>
                    <option value="Technical Deep-Dive">Technical Deep-Dive</option>
                    <option value="Mid-Sprint Check-in">Mid-Sprint Check-in</option>
                    <option value="Capstone Review">Capstone Review</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Status Badge</label>
                  <select
                    value={meetingForm.status}
                    onChange={e => setMeetingForm({ ...meetingForm, status: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Live Now">Live Now (Flashing)</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Rescheduled">Rescheduled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={meetingForm.date}
                    onChange={e => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    placeholder="e.g. Sunday, 30 Nov 2026"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={meetingForm.time}
                    onChange={e => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    placeholder="e.g. 11:00 AM – 12:15 PM IST"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Session Host</label>
                  <input
                    type="text"
                    value={meetingForm.host}
                    onChange={e => setMeetingForm({ ...meetingForm, host: e.target.value })}
                    placeholder="Shaik Sowban (Founder)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Google Meet / Live Link</label>
                  <input
                    type="text"
                    value={meetingForm.link}
                    onChange={e => setMeetingForm({ ...meetingForm, link: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Agenda Items (One per line)</label>
                <textarea
                  rows={3}
                  value={meetingForm.agendaText}
                  onChange={e => setMeetingForm({ ...meetingForm, agendaText: e.target.value })}
                  placeholder="Welcome Manifesto&#10;Deliverables Standard&#10;Live Q&A"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setMeetingModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingMeetingId ? 'Update Meeting' : 'Post Meeting'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Edit Availability Poll */}
      {pollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0a0e1a] border border-purple-500/30 p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Vote className="w-4 h-4 text-purple-400" />
                <span>Founder: Configure Orientation Poll</span>
              </h3>
              <button onClick={() => setPollModalOpen(false)} className="p-1 rounded bg-white/5 hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePoll} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Poll Headline / Prompt</label>
                <input
                  type="text"
                  value={pollForm.question}
                  onChange={e => setPollForm({ ...pollForm, question: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Poll Status Badge</label>
                <input
                  type="text"
                  value={pollForm.status}
                  onChange={e => setPollForm({ ...pollForm, status: e.target.value })}
                  placeholder="e.g. Active Voting / Voting Closed"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-bold block">Poll Slot Options & Base Votes</label>
                {pollForm.slots.map((slot, sIdx) => (
                  <div key={slot.id} className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Day (e.g. Saturday)"
                        value={slot.day}
                        onChange={e => {
                          const updated = [...pollForm.slots];
                          updated[sIdx].day = e.target.value;
                          setPollForm({ ...pollForm, slots: updated });
                        }}
                        className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Time (e.g. 6:00 PM – 7:00 PM IST)"
                        value={slot.time}
                        onChange={e => {
                          const updated = [...pollForm.slots];
                          updated[sIdx].time = e.target.value;
                          setPollForm({ ...pollForm, slots: updated });
                        }}
                        className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Date (e.g. 29 Nov 2026)"
                        value={slot.date}
                        onChange={e => {
                          const updated = [...pollForm.slots];
                          updated[sIdx].date = e.target.value;
                          setPollForm({ ...pollForm, slots: updated });
                        }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-white"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">Base Votes:</span>
                        <input
                          type="number"
                          value={slot.baseVotes || 0}
                          onChange={e => {
                            const updated = [...pollForm.slots];
                            updated[sIdx].baseVotes = parseInt(e.target.value) || 0;
                            setPollForm({ ...pollForm, slots: updated });
                          }}
                          className="w-14 bg-white/5 border border-white/10 rounded-lg px-1.5 py-1 text-white font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPollModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black shadow-md cursor-pointer"
                >
                  Save Poll Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Add or Edit Recording */}
      {recordingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0a0e1a] border border-pink-500/30 p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-pink-400" />
                <span>{editingRecId ? 'Edit Recording' : 'Add Session Recording'}</span>
              </h3>
              <button onClick={() => setRecordingModalOpen(false)} className="p-1 rounded bg-white/5 hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecording} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={recordingForm.title}
                  onChange={e => setRecordingForm({ ...recordingForm, title: e.target.value })}
                  placeholder="e.g. Batch 01 Orientation Keynote Recording"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-pink-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Duration</label>
                  <input
                    type="text"
                    value={recordingForm.duration}
                    onChange={e => setRecordingForm({ ...recordingForm, duration: e.target.value })}
                    placeholder="e.g. 52 mins"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Date</label>
                  <input
                    type="text"
                    value={recordingForm.date}
                    onChange={e => setRecordingForm({ ...recordingForm, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Speaker / Lead</label>
                <input
                  type="text"
                  value={recordingForm.speaker}
                  onChange={e => setRecordingForm({ ...recordingForm, speaker: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">YouTube / Google Drive Replay Link</label>
                <input
                  type="text"
                  value={recordingForm.link}
                  onChange={e => setRecordingForm({ ...recordingForm, link: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or Drive link"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-pink-400 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRecordingModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-black shadow-md cursor-pointer"
                >
                  {editingRecId ? 'Update Recording' : 'Add Recording'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
