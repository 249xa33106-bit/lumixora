import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Calendar, ExternalLink, Sparkles, ChevronRight, 
  AlertCircle, ShieldCheck, Trophy, Bell, ArrowUpRight
} from 'lucide-react';

export default function HackathonDeadlinesRadar({ 
  hackathons = [], 
  onSelectPitchDeck,
  onSelectHackathon
}) {
  // Filter only active hackathons with valid deadlines and sort by earliest deadline
  const urgentHackathons = useMemo(() => {
    const now = Date.now();
    return (hackathons || [])
      .filter(h => {
        if (!h.deadline || h.status === 'Closed') return false;
        const d = new Date(h.deadline).getTime();
        return !isNaN(d) && d > (now - 24 * 60 * 60 * 1000); // within range or upcoming
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [hackathons]);

  const [selectedHackathonId, setSelectedHackathonId] = useState(null);

  // Set default selected to the earliest urgent hackathon
  useEffect(() => {
    if (urgentHackathons.length > 0 && !selectedHackathonId) {
      setSelectedHackathonId(urgentHackathons[0].id);
    }
  }, [urgentHackathons, selectedHackathonId]);

  const activeHackathon = urgentHackathons.find(h => h.id === selectedHackathonId) || urgentHackathons[0];

  // Live ticking countdown state
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute countdown for active hackathon
  const countdown = useMemo(() => {
    if (!activeHackathon || !activeHackathon.deadline) {
      return { days: '00', hours: '00', mins: '00', secs: '00', totalMs: 0, isUrgent: false };
    }
    const target = new Date(activeHackathon.deadline).getTime();
    const diff = Math.max(0, target - currentTime);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    return {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0'),
      totalMs: diff,
      isUrgent: days <= 5
    };
  }, [activeHackathon, currentTime]);

  if (!activeHackathon) return null;

  // Google Calendar helper link
  const getGoogleCalUrl = (h) => {
    const title = encodeURIComponent(`Application Deadline: ${h.title}`);
    const details = encodeURIComponent(
      `Official Hackathon Application Deadline for ${h.title} (${h.organizer}).\n\nPrize Pool: ${h.prizePool}\nEligibility: ${h.eligibility || 'College Students'}\nOfficial Apply: ${h.applyUrl || 'https://lumixora.in'}`
    );
    const d = new Date(h.deadline);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const calDateStr = `${y}${m}${day}T183000Z`; // 11:59 PM IST approx
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${calDateStr}/${calDateStr}`;
  };

  return (
    <div className="relative rounded-2xl bg-[#090D14] border border-white/10 p-5 sm:p-7 shadow-2xl overflow-hidden transition-all">
      {/* Subtle hairline edge highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            Urgent Application Deadlines Radar
          </span>
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            {urgentHackathons.length} Tracked
          </span>
        </div>

        <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>Real-time Indian Standard Time Sync</span>
        </div>
      </div>

      {/* Main active spotlight & live countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Hackathon Details */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-bold text-white uppercase tracking-wider">
              {activeHackathon.organizer}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Closing in {countdown.days} Days
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300">
              {activeHackathon.prizePool} Prize Pool
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {activeHackathon.title}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
            {activeHackathon.description}
          </p>

          {/* Action CTAs: Apple/Vercel Pro high-contrast styling */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <a
              href={activeHackathon.applyUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Apply Official Portal</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={getGoogleCalUrl(activeHackathon)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/15 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-zinc-300" />
              <span>+ Google Calendar</span>
            </a>

            {onSelectPitchDeck && (
              <button
                type="button"
                onClick={() => onSelectPitchDeck(activeHackathon)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Pitch Deck</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Sleek Monospace Digital Countdown Clock */}
        <div className="lg:col-span-5 flex flex-col items-center sm:items-end justify-center">
          <div className="w-full max-w-sm bg-[#0E131F] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-3 px-1">
              <span className="uppercase tracking-widest font-bold">Submission Closes In:</span>
              <span className="text-zinc-300 font-semibold">{activeHackathon.deadline}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Days */}
              <div className="bg-[#141B2D] border border-white/10 rounded-xl py-3 px-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white block tracking-wider">
                  {countdown.days}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest block mt-0.5">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="bg-[#141B2D] border border-white/10 rounded-xl py-3 px-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white block tracking-wider">
                  {countdown.hours}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest block mt-0.5">
                  Hours
                </span>
              </div>

              {/* Mins */}
              <div className="bg-[#141B2D] border border-white/10 rounded-xl py-3 px-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white block tracking-wider">
                  {countdown.mins}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest block mt-0.5">
                  Mins
                </span>
              </div>

              {/* Secs */}
              <div className="bg-[#141B2D] border border-white/10 rounded-xl py-3 px-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 block tracking-wider">
                  {countdown.secs}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest block mt-0.5">
                  Secs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Horizontal Quick-Selector Ribbon for Other Urgent Tracks */}
      {urgentHackathons.length > 1 && (
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5 px-1">
            Other Closing Deadlines:
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
            {urgentHackathons.map((h) => {
              const isSelected = h.id === activeHackathon.id;
              const d = new Date(h.deadline);
              const dateLabel = isNaN(d) ? h.deadline : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHackathonId(h.id)}
                  className={`px-3 py-2 rounded-xl text-left border transition-all shrink-0 flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 border-white/30 text-white shadow-sm'
                      : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold line-clamp-1 text-white">{h.title}</div>
                    <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                      <span>{dateLabel}</span>
                      <span>•</span>
                      <span className="text-zinc-300 font-medium">{h.prizePool}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
