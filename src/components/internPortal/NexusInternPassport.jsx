import React, { useState, useEffect } from 'react';
import {
  Award, Shield, QrCode, CheckCircle2, Copy, Check, ExternalLink,
  Sparkles, FileText, Send, Share2, Layers, Zap, Clock, Rocket
} from 'lucide-react';
import QRCode from 'qrcode';

export default function NexusInternPassport({
  session,
  activeRole,
  submissions = []
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);

  const internId = session?.id || 'LMX-B01-4783';
  const verifyUrl = `https://lumixora.in/verify?id=${internId}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      width: 280,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    })
      .then(url => setQrDataUrl(url))
      .catch(() => {});
  }, [verifyUrl]);

  const copyVerifyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Real Impact DNA Record: Dynamically built from actual submissions, standups, and activity
  const realDeliverableImpacts = submissions.map(s => ({
    type: 'Sprint Deliverable',
    title: s.taskTitle || 'Weekly Sprint Deliverable',
    date: new Date(s.submittedAt).toLocaleDateString(),
    impact: s.status === 'approved'
      ? `Approved by Founder (Score: ${s.score || 'Pass'}/100)`
      : (s.status === 'under_review' ? 'Submitted · Under Founder Review' : 'Revision Requested')
  }));

  // Check for any logged standups
  let standupCount = 0;
  try {
    const rawStandups = localStorage.getItem(`lumixora_standup_history_${session?.id}`);
    if (rawStandups) standupCount = JSON.parse(rawStandups).length;
  } catch (_) {}

  const standupImpact = standupCount > 0 ? [{
    type: 'Cohort Standups',
    title: `${standupCount} Daily Async Check-ins Recorded`,
    date: 'Active Sprint',
    impact: 'Consistent Sprint Telemetry'
  }] : [];

  // Check for any innovation pitches
  let internPitches = [];
  try {
    const rawPitches = localStorage.getItem('lumixora_innovation_pitches');
    if (rawPitches) {
      const allPitches = JSON.parse(rawPitches);
      internPitches = allPitches.filter(p => p.author && p.author.includes(session?.name));
    }
  } catch (_) {}

  const pitchImpact = internPitches.map(p => ({
    type: 'Innovation Pitch',
    title: p.title,
    date: 'Batch 01',
    impact: `Status: ${p.status} · ${p.upvotes || 0} Upvotes`
  }));

  const impactContributions = [
    ...realDeliverableImpacts,
    ...standupImpact,
    ...pitchImpact
  ];

  // Behind the build release notes
  const behindTheBuildNotes = [
    { version: 'v2.6.4 (Nov 2026)', release: 'Lumixora Nexus Workplace & Placement Radar Update', credit: `${session?.name || 'Intern Scholar'} & Batch 01 Cohort contributed to technical specifications and verification.` },
    { version: 'v2.6.2 (Nov 2026)', release: 'SpeakVerse Voice Coaching Audio Engine', credit: 'Quality validation and student testing data provided by Batch 01 Interns.' }
  ];

  const handleCopyPortfolioText = () => {
    const text = `Lumixora Internship Portfolio | ${session?.name || 'Intern Scholar'}\n` +
      `Role: ${activeRole?.title || 'Engineering Intern'} (Batch 01)\n` +
      `Credential ID: ${internId}\n` +
      `Verifiable Public URL: ${verifyUrl}\n` +
      `Key Impact: Executed startup sprint deliverables, validated production workflows, and contributed to live Lumixora releases.\n` +
      `Issued by: Shaik Sowban, Founder & Chief Architect, Lumixora (A Product of Vyomra)`;

    navigator.clipboard.writeText(text);
    setCopiedPortfolio(true);
    setTimeout(() => setCopiedPortfolio(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ── HEADER ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-cyan-400">
              DIGITAL IDENTITY & PROOF OF IMPACT
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-bold text-slate-300">Verifiable Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Lumixora Intern Passport & Impact DNA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            A digital professional identity containing your verified intern credentials, public verification QR, visual Impact DNA, and exportable career portfolio.
          </p>
        </div>

        <button
          onClick={handleCopyPortfolioText}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0 self-start md:self-auto"
        >
          {copiedPortfolio ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copiedPortfolio ? 'Copied to Clipboard!' : 'Export Career Portfolio'}</span>
        </button>
      </div>

      {/* ── 2-COLUMN: PASSPORT CARD & IMPACT DNA TIMELINE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* The Digital Intern Passport Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1220] via-[#090d18] to-[#06080e] border-2 border-cyan-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Card Top Strip */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center font-black text-cyan-400 text-xs">
                LX
              </div>
              <div>
                <span className="text-xs font-black tracking-wider text-white">VYOMRA / LUMIXORA</span>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">OFFICIAL INTERN PASSPORT</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              VERIFIED ACTIVE
            </span>
          </div>

          {/* Intern Details & QR Code Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
            <div className="sm:col-span-2 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Candidate Name</span>
                <h3 className="text-lg font-black text-white">{session?.name || 'Intern Scholar'}</h3>
                <p className="text-xs text-slate-300 font-medium">{session?.college || 'G. Pulla Reddy Engineering College'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Intern ID</span>
                  <span className="font-mono font-bold text-cyan-300">{internId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Cohort</span>
                  <span className="font-bold text-white">Batch 01 (Winter 2026)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Department</span>
                  <span className="font-bold text-purple-300">{activeRole?.shortTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Mentored By</span>
                  <span className="font-bold text-slate-200">Shaik Sowban</span>
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Verification QR" className="w-24 h-24 rounded-lg bg-white p-1" />
              ) : (
                <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <span className="text-[9px] font-mono text-slate-400 text-center">Scan to Verify</span>
            </div>
          </div>

          {/* Verification Link Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{verifyUrl}</span>
            <button
              onClick={copyVerifyLink}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Impact DNA Record */}
        <div className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-black text-white">Impact DNA Activity Timeline</h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">Live Contributions</span>
          </div>

          <div className="space-y-4">
            {impactContributions.length > 0 ? (
              impactContributions.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">{c.type}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-0.5">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{c.impact}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                <Clock className="w-6 h-6 text-slate-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-300">Impact DNA Awaiting First Sprint Activity</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Your verifiable proof of impact will automatically populate here as you submit sprint deliverables, log daily standups, and pitch feature proposals.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BEHIND THE BUILD (RECOGNITION IN PRODUCT RELEASES) ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Behind The Build: Release Attestation</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Production Changelog</span>
        </div>

        <div className="space-y-3">
          {behindTheBuildNotes.map((note, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">{note.version}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Live Release</span>
              </div>
              <h4 className="text-xs font-semibold text-cyan-300">{note.release}</h4>
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                <strong>Intern Recognition:</strong> {note.credit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
