import React from 'react';
import { Award, Check, Sparkles, ShieldCheck, Settings, Lightbulb, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';

export const CERTIFICATE_STYLES = [
  {
    id: 'official_lumixora',
    name: '🌟 Official Lumixora Gold & Navy',
    badge: 'Official Issuer Template (Exact Match)',
    desc: 'Official Lumixora Certificate with navy & gold geometric angles, Cinzel typography, and gold medallion seal'
  },
  {
    id: 'executive_ivory',
    name: '🏛️ Executive Corporate Gold',
    badge: 'Industry Standard (Recommended)',
    desc: 'Crisp luxury ivory parchment, 24K gold border, formal serif typography & corporate seal'
  },
  {
    id: 'gold_midnight',
    name: '👑 Royal Midnight Gold',
    badge: 'Dark Luxury Prestige',
    desc: 'Deep midnight obsidian with 24K polished gold border, golden typography & 3D medal seal'
  },
  {
    id: 'sapphire_executive',
    name: '💎 Modern Executive Sapphire',
    badge: 'Enterprise Corporate',
    desc: 'Deep royal sapphire & titanium silver with clean architectural Swiss precision'
  },
  {
    id: 'classic_parchment',
    name: '📜 Imperial University Heritage',
    badge: 'Academic Parchment',
    desc: 'Traditional warm cream diploma with classical serif calligraphy & corporate council seal'
  }
];

export function parseStudentIdentity(rawName, explicitRoll = '') {
  let name = (rawName || '').trim();
  let roll = (explicitRoll || '').trim();

  // Strip prefix like "259XA33002 ALLAPUREDDY POOJA" or "259XA33002 - ALLAPUREDDY POOJA"
  const startRollRegex = /^([0-9]{2}[A-Za-z0-9]{7,10})\s*[-:–|.]*\s+(.+)$/i;
  const matchStart = name.match(startRollRegex);
  if (matchStart) {
    if (!roll) roll = matchStart[1].toUpperCase();
    name = matchStart[2].trim();
  } else {
    // Strip suffix like "ALLAPUREDDY POOJA (259XA33002)" or "ALLAPUREDDY POOJA - 259XA33002"
    const endRollRegex = /^(.+?)\s*[-:–|(]+\s*([0-9]{2}[A-Za-z0-9]{7,10})\)?$/i;
    const matchEnd = name.match(endRollRegex);
    if (matchEnd) {
      if (!roll) roll = matchEnd[2].toUpperCase();
      name = matchEnd[1].trim();
    }
  }

  // If name was only a roll number
  if (!name || /^[0-9]{2}[A-Za-z0-9]{7,10}$/i.test(name)) {
    if (!roll && name) roll = name.toUpperCase();
    name = 'Scholar Candidate';
  }

  // Strip leading/trailing non-alphanumeric punctuation
  name = name.replace(/^[-:–|.\s]+|[-:–|.\s]+$/g, '');

  const cleanName = name
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  const upperName = name.toUpperCase();

  return {
    cleanName: cleanName || 'Shaik Sowban',
    upperName: upperName || 'SHAIK SOWBAN',
    rollNumber: roll
  };
}

function formatName(raw) {
  return parseStudentIdentity(raw).cleanName;
}

export default function CertificateRenderer({
  cert,
  studentName = 'Shaik Sowban',
  collegeName = 'G. Pulla Reddy Engineering College (Autonomous)',
  styleId = 'executive_ivory',
  qrCodeDataUrl = '',
  certRef = null,
  user = null
}) {
  if (!cert) return null;

  const rawCandidate = cert.internName || cert.issuedTo || cert.studentName || studentName;
  const rawRoll = cert.rollNumber || cert.rollNo || user?.rollNumber || user?.rollNo || '';
  const identity = parseStudentIdentity(rawCandidate, rawRoll);
  const recipient = identity.cleanName;
  const rollNumber = identity.rollNumber;
  const college = cert.college || collegeName;
  const hash = cert.verificationHash || cert.hash || '8A4F-C91E-4B07-28DA-92F6-B831-C7D0-E49A';
  const founderName = cert.founderSignatureName || cert.signerName || 'Shaik Sowban';
  const founderRole = cert.founderRole || 'Founder & CEO';

  const isInternship = cert.isInternship !== false && (
    (cert.id && cert.id.includes('INT')) ||
    Boolean(cert.track) ||
    Boolean(cert.tasks) ||
    (cert.title && cert.title.toLowerCase().includes('internship'))
  );

  const certHeading = isInternship 
    ? "Certificate of Internship Completion" 
    : (cert.title || "Certificate of Excellence & Competency");

  const trackName = cert.track || cert.category || "Full-Stack Software Engineering";
  const durationStr = cert.duration || "6-Week Intensive Engineering Internship (Batch 01)";
  const dateRangeStr = cert.startDate && cert.endDate ? `${cert.startDate} – ${cert.endDate}` : "September 15, 2026 – October 30, 2026";
  const hoursStr = cert.hoursLogged ? `${cert.hoursLogged}+ Verified Hours` : "120+ Verified Hours";
  const scoreStr = cert.score || "98% Distinction";
  const gradeStr = cert.grade || "Elite Distinction (A+ Grade)";

  // Normalize style ID
  let activeStyle = styleId;
  if (!styleId || styleId === 'official_lumixora' || styleId === 'official') activeStyle = 'official_lumixora';
  if (styleId === 'classic_ivory' || styleId === 'parchment' || styleId === 'ivory') activeStyle = 'executive_ivory';
  if (styleId === 'cyber' || styleId === 'cyber_neon' || styleId === 'obsidian') activeStyle = 'gold_midnight';
  if (styleId === 'sapphire') activeStyle = 'sapphire_executive';
  if (styleId === 'classic') activeStyle = 'classic_parchment';

  // Domain title formatting
  let displayDomain = cert.domain || cert.track || cert.category || 'Product Testing';
  if (displayDomain.toLowerCase().includes('test') || displayDomain.toLowerCase().includes('qa')) {
    displayDomain = 'Product Testing';
  } else if (displayDomain.toLowerCase().includes('research') || displayDomain.toLowerCase().includes('intel')) {
    displayDomain = 'Research & Product Intelligence';
  } else if (displayDomain.toLowerCase().includes('market') || displayDomain.toLowerCase().includes('brand')) {
    displayDomain = 'Growth Marketing & Brand Strategy';
  } else if (displayDomain.toLowerCase().includes('content') || displayDomain.toLowerCase().includes('media')) {
    displayDomain = 'Content Creation & Visual Media';
  }

  // Dates formatting
  const formattedStartDate = cert.startDate || '1 Nov 2025';
  const formattedEndDate = cert.endDate || '30 Nov 2025';

  // 3 Competency tags based on domain
  let comp1 = 'Product Testing';
  let comp2 = 'Quality Analysis';
  let comp3 = 'Innovation Mindset';

  if (displayDomain.includes('Research')) {
    comp1 = 'Market Research';
    comp2 = 'Competitive Intelligence';
    comp3 = 'Innovation Mindset';
  } else if (displayDomain.includes('Marketing')) {
    comp1 = 'Growth Marketing';
    comp2 = 'Brand Strategy';
    comp3 = 'Innovation Mindset';
  } else if (displayDomain.includes('Content')) {
    comp1 = 'Visual Media';
    comp2 = 'Content Creation';
    comp3 = 'Innovation Mindset';
  }

  // Proof of work links
  const tasks = Array.isArray(cert.tasks) ? cert.tasks : [];
  const githubLink = cert.githubUrl || (tasks.find(t => t.githubUrl || t.prUrl)?.githubUrl || tasks.find(t => t.githubUrl || t.prUrl)?.prUrl) || '';
  const driveLink = cert.driveUrl || (tasks.find(t => t.driveUrl)?.driveUrl) || '';
  const pdfLink = cert.pdfUrl || (tasks.find(t => t.pdfUrl)?.pdfUrl) || '';
  const demoLink = cert.demoUrl || (tasks.find(t => t.demoUrl || t.liveDemoUrl)?.demoUrl || tasks.find(t => t.demoUrl || t.liveDemoUrl)?.liveDemoUrl) || '';
  const hasProofOfWork = Boolean(githubLink || driveLink || pdfLink || demoLink);

  // ════════════════════════════════════════════════════════════════════════════
  // 🌟 OFFICIAL LUMIXORA CERTIFICATE (Exact Match to Official Template)
  // ════════════════════════════════════════════════════════════════════════════
  if (activeStyle === 'official_lumixora') {
    return (
      <div
        ref={certRef}
        id="printable-certificate"
        className="w-full max-w-5xl mx-auto rounded-xl relative shadow-[0_20px_70px_rgba(0,0,0,0.25)] flex flex-col justify-between text-center select-none p-6 sm:p-8 md:p-12 transition-all duration-300 bg-white text-[#0f172a] border border-[#d4af37] min-h-[580px] sm:min-h-[640px] md:min-h-[680px] overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* ── Top-Left Geometric Navy & Gold Cuts ── */}
        <div className="absolute top-0 left-0 w-36 sm:w-52 md:w-64 h-36 sm:h-52 md:h-64 pointer-events-none z-0">
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Dark Navy Triangle */}
            <polygon points="0,0 180,0 0,220" fill="#0b1a30" />
            {/* Inner Gold Diagonal Line */}
            <polygon points="180,0 190,0 0,232 0,220" fill="#d4af37" />
            {/* Outer Accent Gold Strip */}
            <polygon points="205,0 215,0 0,260 0,250" fill="#c59b27" opacity="0.9" />
            {/* Secondary Floating Gold Accent Slash */}
            <line x1="28" y1="215" x2="215" y2="28" stroke="#f3d068" strokeWidth="2.5" />
          </svg>
        </div>

        {/* ── Bottom-Right Geometric Navy & Gold Cuts ── */}
        <div className="absolute bottom-0 right-0 w-36 sm:w-52 md:w-64 h-36 sm:h-52 md:h-64 pointer-events-none z-0">
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Dark Navy Triangle */}
            <polygon points="240,240 60,240 240,20" fill="#0b1a30" />
            {/* Inner Gold Diagonal Line */}
            <polygon points="60,240 50,240 240,8 240,20" fill="#d4af37" />
            {/* Outer Accent Gold Strip */}
            <polygon points="35,240 25,240 240,-10 240,0" fill="#c59b27" opacity="0.9" />
            {/* Secondary Floating Gold Accent Slash */}
            <line x1="212" y1="25" x2="25" y2="212" stroke="#f3d068" strokeWidth="2.5" />
          </svg>
        </div>

        {/* ── Right Background Translucent Watermark Star/Logo ── */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 opacity-[0.05] pointer-events-none select-none z-0">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M100 0 L115 85 L200 100 L115 115 L100 200 L85 115 L0 100 L85 85 Z" fill="#0b1a30" />
            <path d="M60 40 L60 160 L140 160 L140 135 L90 135 L90 40 Z" fill="#0b1a30" />
          </svg>
        </div>

        {/* ── TOP HEADER (Logo + Subtitle Left, LEARN • BUILD • GROW Right) ── */}
        <div className="flex items-center justify-between relative z-10 w-full mb-3">
          {/* Left: Brand Identity */}
          <div className="flex flex-col items-start pl-6 sm:pl-14 md:pl-20 text-left">
            <div className="flex items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.04em] text-[#0b1a30] font-sora">
                L<span className="relative inline-block">U<span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#c59b27] text-xs sm:text-sm font-black">✦</span></span>MIXORA
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="h-[1px] w-5 sm:w-7 bg-slate-400"></span>
              <span className="text-[9.5px] sm:text-[11px] font-medium tracking-wide text-slate-700">A Product of Vyomra</span>
              <span className="h-[1px] w-5 sm:w-7 bg-slate-400"></span>
            </div>
          </div>

          {/* Right: Tagline */}
          <div className="text-right pr-4 sm:pr-8">
            <span className="text-[9px] sm:text-[11px] md:text-xs font-bold tracking-[0.25em] text-slate-700 uppercase">
              LEARN &nbsp;•&nbsp; BUILD &nbsp;•&nbsp; GROW
            </span>
          </div>
        </div>

        {/* ── CERTIFICATE TITLE ── */}
        <div className="space-y-1.5 relative z-10 my-1 sm:my-2">
          <h2 
            className="text-2xl sm:text-3xl md:text-[2.5rem] font-bold tracking-[0.08em] text-[#0f2347] uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            INTERNSHIP CERTIFICATE
          </h2>
          {/* Centered Gold Star Accent */}
          <div className="flex items-center justify-center gap-2 pt-0.5">
            <span className="h-[1.5px] w-10 sm:w-16 bg-[#d4af37]"></span>
            <span className="text-[#c59b27] text-sm">✦</span>
            <span className="h-[1.5px] w-10 sm:w-16 bg-[#d4af37]"></span>
          </div>
        </div>

        {/* ── RECIPIENT INTRODUCTION ── */}
        <p className="text-xs sm:text-sm font-medium text-slate-700 relative z-10 mt-1">
          This is to certify that
        </p>

        {/* ── RECIPIENT NAME (Flowing Calligraphy) ── */}
        <div className="my-1 sm:my-2 relative z-10">
          <span 
            className="text-3xl sm:text-4xl md:text-5xl text-[#0b1a30] select-none block leading-tight font-normal"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            {recipient}
          </span>
        </div>

        {/* ── CERTIFICATION STATEMENT ── */}
        <div className="max-w-2xl mx-auto space-y-1 text-slate-800 text-xs sm:text-sm leading-relaxed relative z-10 font-normal px-2">
          <p>
            has successfully completed their internship at <strong className="font-bold text-slate-950">Lumixora</strong>,
          </p>
          <p>
            a product of Vyomra, in the domain of <strong className="font-bold text-slate-950">{displayDomain}</strong>.
          </p>
          <p>
            During the period from [ <strong className="font-bold text-slate-950">{formattedStartDate}</strong> ] to [ <strong className="font-bold text-slate-950">{formattedEndDate}</strong> ],
          </p>
          <p>
            the intern demonstrated dedication, enthusiasm and a strong willingness to learn.
          </p>
        </div>

        {/* ── WISHES RIBBON ── */}
        <div className="my-2.5 sm:my-3 relative z-10 flex justify-center">
          <div className="inline-flex items-center px-6 sm:px-9 py-1 rounded-full bg-[#0b1a30] text-[#f3d068] border border-[#d4af37] text-[10.5px] sm:text-xs font-medium italic shadow-sm">
            We wish them all the best for their future endeavors.
          </div>
        </div>

        {/* ── THREE COMPETENCIES ── */}
        <div className="max-w-lg mx-auto grid grid-cols-3 divide-x divide-slate-300 py-1 relative z-10 my-1 w-full">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 text-left">
            <Settings className="w-4 h-4 text-slate-900 shrink-0" />
            <span className="text-[10.5px] sm:text-xs font-bold text-slate-900 leading-tight">{comp1}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 text-left">
            <Lightbulb className="w-4 h-4 text-slate-900 shrink-0" />
            <span className="text-[10.5px] sm:text-xs font-bold text-slate-900 leading-tight">{comp2}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 text-left">
            <TrendingUp className="w-4 h-4 text-slate-900 shrink-0" />
            <span className="text-[10.5px] sm:text-xs font-bold text-slate-900 leading-tight">{comp3}</span>
          </div>
        </div>

        {/* ── VERIFIED PROOF OF WORK LINKS BADGE STRIP (If Submitted) ── */}
        {hasProofOfWork && (
          <div className="max-w-xl mx-auto my-1.5 py-1 px-3 rounded-lg bg-amber-500/10 border border-[#d4af37]/40 flex items-center justify-center gap-2 flex-wrap text-left relative z-10">
            <span className="text-[9px] font-mono font-bold text-[#854d0e] uppercase flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              Verified Work:
            </span>
            {githubLink && (
              <a href={githubLink} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-slate-900 text-white text-[8px] font-bold flex items-center gap-1 hover:bg-black transition-all">
                <span>GitHub Repo</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            {driveLink && (
              <a href={driveLink} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-blue-600 text-white text-[8px] font-bold flex items-center gap-1 hover:bg-blue-700 transition-all">
                <span>Google Drive</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            {pdfLink && (
              <a href={pdfLink} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-rose-600 text-white text-[8px] font-bold flex items-center gap-1 hover:bg-rose-700 transition-all">
                <span>PDF Report</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        )}

        {/* ── SIGNATURES, 3D GOLD MEDALLION & QR CODE ── */}
        <div className="grid grid-cols-4 items-end pt-3 relative z-10 gap-2 sm:gap-4 mt-auto">
          {/* Left Signature: Shaik Sowban */}
          <div className="flex flex-col items-center sm:items-start text-left">
            <div className="h-7 sm:h-9 flex items-center">
              <span className="text-xl sm:text-2xl text-slate-900 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Shaik Sowban
              </span>
            </div>
            <div className="w-full border-t border-slate-400 pt-1">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-tight">Shaik Sowban</p>
              <p className="text-[8px] sm:text-[9px] text-slate-600 leading-tight">Founder, CEO & Tech Lead</p>
              <p className="text-[7.5px] sm:text-[8px] text-slate-500 leading-tight">Lumixora</p>
            </div>
          </div>

          {/* Center: 3D Gold Ribbon Medallion Seal */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
              {/* Blue Ribbon Tails hanging below */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-0">
                <div className="w-3.5 h-6 bg-[#0b1a30] transform -rotate-12 [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)] border-t border-[#d4af37]" />
                <div className="w-3.5 h-6 bg-[#0b1a30] transform rotate-12 [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)] border-t border-[#d4af37]" />
              </div>
              {/* Gold Medallion Body */}
              <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#8e6c15] via-[#d4af37] to-[#fae588] p-[2.5px] shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ffd700] via-[#f5d77f] to-[#c59b27] flex flex-col items-center justify-center text-center p-0.5 border border-[#8e6c15]">
                  <span className="text-base sm:text-lg font-black text-[#0b1a30] leading-none font-sora">L</span>
                  <span className="text-[5px] sm:text-[6px] font-bold text-[#0b1a30] tracking-tighter">★ ★ ★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Signature: Team Lumixora */}
          <div className="flex flex-col items-center sm:items-start text-left">
            <div className="h-7 sm:h-9 flex items-center">
              <span className="text-xl sm:text-2xl text-slate-900 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Shaarfam
              </span>
            </div>
            <div className="w-full border-t border-slate-400 pt-1">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-tight">Team Lumixora</p>
              <p className="text-[8px] sm:text-[9px] text-slate-600 leading-tight">Product Development Team</p>
            </div>
          </div>

          {/* Far Right: QR Code */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right pr-1 sm:pr-2">
            <div className="p-1 bg-white rounded-md border border-slate-300 shadow-sm shrink-0">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Verify QR" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 flex items-center justify-center text-[8px] font-mono">QR</div>
              )}
            </div>
            <div className="mt-1 leading-tight">
              <p className="text-[8px] sm:text-[9px] font-bold text-slate-900">Verify Certificate</p>
              <p className="text-[7px] sm:text-[8px] font-mono text-slate-600">lumixora.in/verify</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER: INNOVATION TODAY. IMPACT TOMORROW. ── */}
        <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-left relative z-10 mt-2">
          <span className="text-[8.5px] sm:text-[10px] font-bold tracking-[0.2em] text-slate-700 uppercase">
            INNOVATION TODAY. &nbsp;IMPACT TOMORROW.
          </span>
          <span className="text-[7.5px] sm:text-[8.5px] font-mono text-slate-500 uppercase">
            ID: {cert.id || 'LMX-B01'}
          </span>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 1. 🏛️ EXECUTIVE CORPORATE GOLD (Crisp Ivory Luxury Light - Industry Standard)
  // ════════════════════════════════════════════════════════════════════════════
  if (activeStyle === 'executive_ivory') {
    return (
      <div
        ref={certRef}
        id="printable-certificate"
        className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl relative shadow-[0_20px_70px_rgba(0,0,0,0.35)] flex flex-col justify-between text-center select-none p-4 sm:p-6 md:p-8 transition-all duration-300 bg-gradient-to-br from-[#ffffff] via-[#fcfaf4] to-[#f7f2e4] text-[#1c1917] border-[4px] border-[#c59b27] min-h-[530px] sm:min-h-[580px] md:min-h-[620px]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Ornate Double Filigree Frame */}
        <div className="absolute inset-2 sm:inset-3 border-2 border-[#c59b27]/70 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-3.5 sm:inset-4.5 border border-dashed border-[#c59b27]/35 rounded-lg pointer-events-none"></div>

        {/* Corner Accents */}
        <div className="absolute top-2.5 left-2.5 text-[#c59b27] text-xs sm:text-sm font-serif select-none pointer-events-none">◆ ❖ ◆</div>
        <div className="absolute top-2.5 right-2.5 text-[#c59b27] text-xs sm:text-sm font-serif select-none pointer-events-none">◆ ❖ ◆</div>
        <div className="absolute bottom-2.5 left-2.5 text-[#c59b27] text-xs sm:text-sm font-serif select-none pointer-events-none">◆ ❖ ◆</div>
        <div className="absolute bottom-2.5 right-2.5 text-[#c59b27] text-xs sm:text-sm font-serif select-none pointer-events-none">◆ ❖ ◆</div>

        {/* ── TOP HEADER ── */}
        <div className="flex items-center justify-between border-b-2 border-[#c59b27]/40 pb-2 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#8e6c15] via-[#c59b27] to-[#f7df8b] p-[2px] shadow-md shrink-0">
              <div className="w-full h-full bg-stone-900 rounded-[14px] p-1 flex items-center justify-center">
                <img src="/lumixora_logo_icon.png" alt="Lumixora" className="w-full h-full object-contain filter invert" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-black tracking-[0.2em] uppercase text-stone-900 font-sora leading-tight">
                LUMIXORA
              </h3>
              <p className="text-[7.5px] sm:text-[9px] font-mono tracking-wider uppercase font-bold text-[#854d0e]">
                Lumixora — a product of Vyomra
              </p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono text-stone-500">
                Autonomous Credential Registry • Verified Deliverables & Effort
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold tracking-widest block text-[#854d0e] uppercase">
              CREDENTIAL REGISTRY ID
            </span>
            <span className="text-[10px] sm:text-xs font-black font-mono px-3 py-0.5 rounded-lg bg-[#c59b27]/20 text-stone-950 border border-[#c59b27]/60 shadow-sm inline-block mt-0.5">
              {cert.id}
            </span>
          </div>
        </div>

        {/* ── CORE BODY ── */}
        <div className="space-y-1.5 sm:space-y-2 py-1 relative z-10">
          
          {/* Ribbon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-0.5 rounded-full bg-gradient-to-r from-[#c59b27]/20 via-[#f7df8b]/40 to-[#c59b27]/20 border border-[#c59b27]/50 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#854d0e]" />
            <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-[0.22em] text-[#713f12]" style={{ fontFamily: "'Cinzel', serif" }}>
              {certHeading}
            </span>
            <Sparkles className="w-3 h-3 text-[#854d0e]" />
          </div>

          <p className="text-[9.5px] sm:text-[11px] font-serif italic text-stone-600" style={{ fontFamily: "'Playfair Display', serif" }}>
            This is to solemnly attest and certify that
          </p>

          {/* Candidate Name */}
          <div className="py-0.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-stone-900 leading-tight drop-shadow-sm uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              {recipient}
            </h2>
            <div className="w-40 sm:w-60 h-[1.5px] mx-auto mt-0.5 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent"></div>
            {rollNumber && (
              <div className="mt-1">
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#c59b27]/15 text-[#854d0e] font-mono text-[8px] sm:text-[9.5px] font-bold border border-[#c59b27]/40 tracking-wider">
                  ROLL NO: {rollNumber}
                </span>
              </div>
            )}
          </div>

          {/* Formal Attestation Paragraph */}
          <p className="text-[8.5px] sm:text-[10px] text-stone-700 max-w-2xl mx-auto leading-relaxed">
            student of <strong className="text-stone-950 font-bold">{college}</strong>{rollNumber ? <span> (ID: <strong className="font-mono text-stone-950">{rollNumber}</strong>)</span> : null}, has successfully completed the <strong className="text-stone-950 font-bold">{durationStr}</strong> at <strong>Lumixora</strong> in the <strong className="text-stone-950 font-bold">{trackName} Track</strong> ({dateRangeStr}).
          </p>

          {/* Professional Performance Matrix Strip */}
          <div className="p-2 sm:p-2.5 rounded-xl max-w-2xl mx-auto bg-stone-100/90 border border-[#c59b27]/40 shadow-sm flex flex-wrap items-center justify-around gap-2 text-stone-800">
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-stone-500 block">Performance Grade</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-emerald-800">{gradeStr}</span>
            </div>
            <div className="h-5 w-[1px] bg-stone-300 hidden sm:block"></div>
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-stone-500 block">Verified Effort</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-stone-900">{hoursStr}</span>
            </div>
            <div className="h-5 w-[1px] bg-stone-300 hidden sm:block"></div>
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-stone-500 block">Verification</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-blue-900">Live Central Registry Match</span>
            </div>
            <div className="h-5 w-[1px] bg-stone-300 hidden sm:block"></div>
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-stone-500 block">Ledger Status</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-emerald-700">Verified & Active ✓</span>
            </div>
          </div>
        </div>

        {/* ── VERIFIED SKILLS STRIP ── */}
        <div className="flex flex-wrap gap-1.5 justify-center py-0.5 relative z-10 max-w-2xl mx-auto">
          {(cert.skills && cert.skills.length > 0 ? cert.skills.slice(0, 4) : ['Full-Stack Web Architecture', 'React 19 & Vite', 'Cloudflare Edge Systems', 'Git PR Review Workflow']).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-bold font-mono bg-[#c59b27]/10 text-stone-800 border border-[#c59b27]/30 flex items-center gap-1 shadow-sm"
            >
              <Check className="w-2.5 h-2.5 text-[#854d0e]" /> {skill}
            </span>
          ))}
        </div>

        {/* ── SIGNATURES & OFFICIAL EMBOSSED SEAL ── */}
        <div className="grid grid-cols-3 items-end pt-2 border-t-2 border-[#c59b27]/40 relative z-10 gap-2">
          {/* Founder & CEO */}
          <div className="space-y-0.5 text-left flex flex-col items-start">
            <div className="h-5 sm:h-6 flex items-center justify-start px-1">
              <span className="text-base sm:text-lg text-stone-900 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                {founderName}
              </span>
            </div>
            <div className="border-t border-[#c59b27]/60 pt-0.5 w-full text-left">
              <p className="text-[8px] sm:text-[9px] font-black text-stone-950 uppercase tracking-wide">{founderName.toUpperCase()}</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-[#854d0e] tracking-wider font-bold">{founderRole}</p>
              <p className="text-[6px] sm:text-[7px] font-mono text-stone-500">Lumixora · A Product of Vyomra</p>
            </div>
          </div>

          {/* Original Official Seal (Vyomra / Lumixora) */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#c59b27] bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#d97706]/20 p-1 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-full border border-dashed border-[#b8860b] flex flex-col items-center justify-center text-center p-1 bg-amber-50/90 shadow-inner">
                <span className="text-[6px] font-black text-[#78350f] tracking-widest leading-none">OFFICIAL</span>
                <span className="text-[8px] font-black text-[#92400e] tracking-wider my-0.5 leading-none">★ SEAL ★</span>
                <span className="text-[6px] font-black text-[#78350f] tracking-widest leading-none">VYOMRA</span>
              </div>
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black uppercase tracking-wider text-[#854d0e] mt-0.5 whitespace-nowrap">
              VERIFIED CREDENTIAL
            </span>
          </div>

          {/* Marketing Head */}
          <div className="space-y-0.5 text-right flex flex-col items-end">
            <div className="h-5 sm:h-6 flex items-center justify-end px-1">
              <span className="text-base sm:text-lg text-stone-900 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                M. Akhil
              </span>
            </div>
            <div className="border-t border-[#c59b27]/60 pt-0.5 w-full text-right">
              <p className="text-[8px] sm:text-[9px] font-black text-stone-950 uppercase tracking-wide">M. AKHIL</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-[#854d0e] tracking-wider font-bold">Marketing Head</p>
              <p className="text-[6px] sm:text-[7px] font-mono text-stone-500">Campus Partnership Council</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER & CRYPTOGRAPHIC LEDGER PROOF ── */}
        <div className="pt-2 border-t border-[#c59b27]/30 flex items-center justify-between gap-2 relative z-10 text-left">
          <div className="flex items-center gap-2.5">
            {qrCodeDataUrl ? (
              <div className="p-0.5 bg-white rounded-md shadow border border-[#c59b27] shrink-0">
                <img src={qrCodeDataUrl} alt="QR Verification" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-white rounded border flex items-center justify-center text-[6px] text-black font-mono">QR</div>
            )}
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-[7.5px] sm:text-[8.5px] font-mono tracking-wider font-black uppercase text-[#854d0e]">
                  SCAN TO VERIFY LIVE ON LUMIXORA LEDGER
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-600/15 text-emerald-800 font-mono text-[6px] sm:text-[7px] font-bold border border-emerald-600/30">
                  LIVE FIRESTORE LEDGER
                </span>
              </div>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono tracking-wider uppercase text-stone-500 mt-0.5">
                SHA-256: {hash}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[7px] sm:text-[8px] font-mono uppercase font-black px-2.5 py-1 rounded-md border border-[#c59b27]/50 bg-[#c59b27]/15 text-[#713f12]">
              IMMUTABLE LEDGER VERIFIED ✓
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 2. 👑 ROYAL MIDNIGHT GOLD (Dark Luxury Obsidian)
  // ════════════════════════════════════════════════════════════════════════════
  if (activeStyle === 'gold_midnight') {
    return (
      <div
        ref={certRef}
        id="printable-certificate"
        className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl relative shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col justify-between text-center select-none p-4 sm:p-6 md:p-8 transition-all duration-300 bg-gradient-to-br from-[#060813] via-[#0c1226] to-[#04060c] text-white border-[3px] border-[#d4af37] min-h-[530px] sm:min-h-[580px] md:min-h-[620px]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="absolute inset-2 sm:inset-3 border border-[#d4af37]/40 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-3.5 sm:inset-4.5 border border-dashed border-[#d4af37]/25 rounded-lg pointer-events-none"></div>

        <div className="absolute top-2.5 left-2.5 text-[#d4af37] text-xs sm:text-sm font-serif select-none pointer-events-none">✦ ❖ ✦</div>
        <div className="absolute top-2.5 right-2.5 text-[#d4af37] text-xs sm:text-sm font-serif select-none pointer-events-none">✦ ❖ ✦</div>
        <div className="absolute bottom-2.5 left-2.5 text-[#d4af37] text-xs sm:text-sm font-serif select-none pointer-events-none">✦ ❖ ✦</div>
        <div className="absolute bottom-2.5 right-2.5 text-[#d4af37] text-xs sm:text-sm font-serif select-none pointer-events-none">✦ ❖ ✦</div>

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-2 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-[#8e6c15] via-[#e5c058] to-[#fff3bf] p-[1.5px] shadow-lg shadow-amber-500/20 shrink-0">
              <img src="/lumixora_logo_icon.png" alt="Lumixora" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase text-white font-sora">
                LUMIXORA
              </h3>
              <p className="text-[7px] sm:text-[8.5px] font-mono tracking-widest uppercase font-bold text-[#e5c058]">
                Lumixora — a product of Vyomra
              </p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono text-gray-400">
                Cryptographic Credential Registry • Verified Deliverables
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold tracking-widest block text-gray-400">
              OFFICIAL CREDENTIAL ID
            </span>
            <span className="text-[9.5px] sm:text-xs font-black font-mono px-2.5 py-0.5 rounded-lg bg-[#d4af37]/15 text-[#f5d77f] border border-[#d4af37]/40 shadow-sm inline-block mt-0.5">
              {cert.id}
            </span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="space-y-1.5 sm:space-y-2 py-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#e5c058]" />
            <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-[0.2em] text-[#fef08a]" style={{ fontFamily: "'Cinzel', serif" }}>
              {certHeading}
            </span>
            <Sparkles className="w-3 h-3 text-[#e5c058]" />
          </div>

          <p className="text-[9px] sm:text-[10.5px] text-gray-300 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            This is to solemnly attest and certify that
          </p>

          <div className="py-0.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fff3bf] via-[#e5c058] to-[#f7df8b] leading-tight drop-shadow-md uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              {recipient}
            </h2>
            <div className="w-32 sm:w-48 h-[1.5px] mx-auto mt-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
            {rollNumber && (
              <div className="mt-1">
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f5d77f] font-mono text-[8px] sm:text-[9.5px] font-bold border border-[#d4af37]/40 tracking-wider">
                  ROLL NO: {rollNumber}
                </span>
              </div>
            )}
          </div>

          <p className="text-[8px] sm:text-[9.5px] text-gray-300 max-w-xl mx-auto leading-relaxed">
            student of <strong className="text-white font-bold">{college}</strong>{rollNumber ? <span> (ID: <strong className="font-mono text-amber-200">{rollNumber}</strong>)</span> : null}, has successfully completed the <strong className="text-amber-200 font-bold">{durationStr}</strong> at <strong>Lumixora</strong> in the <strong className="text-white font-bold">{trackName} Track</strong> ({dateRangeStr}).
          </p>

          <div className="p-2 sm:p-2.5 rounded-xl max-w-2xl mx-auto bg-[#13192e]/80 border border-[#d4af37]/40 shadow-lg flex flex-wrap items-center justify-around gap-2 text-white">
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-gray-400 block">Performance Grade</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-emerald-400">{gradeStr}</span>
            </div>
            <div className="h-5 w-[1px] bg-white/10 hidden sm:block"></div>
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-gray-400 block">Verified Effort</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-amber-300">{hoursStr}</span>
            </div>
            <div className="h-5 w-[1px] bg-white/10 hidden sm:block"></div>
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-gray-400 block">Verification</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-cyan-300">Live Central Registry Match</span>
            </div>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className="flex flex-wrap gap-1.5 justify-center py-0.5 relative z-10 max-w-xl mx-auto">
          {(cert.skills && cert.skills.length > 0 ? cert.skills.slice(0, 4) : ['Full-Stack Web Architecture', 'React 19 & Vite', 'Cloudflare Edge Systems', 'Git PR Workflow']).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-bold font-mono bg-[#d4af37]/10 text-amber-200 border border-[#d4af37]/30 flex items-center gap-1 shadow-sm"
            >
              <Check className="w-2.5 h-2.5 text-[#e5c058]" /> {skill}
            </span>
          ))}
        </div>

        {/* ── SIGNATURES & 3D SEAL ── */}
        <div className="grid grid-cols-3 items-end pt-2 border-t border-[#d4af37]/30 relative z-10 gap-2">
          {/* Founder & CEO */}
          <div className="space-y-0.5 text-left flex flex-col items-start">
            <div className="h-5 sm:h-6 flex items-center justify-start px-1">
              <span className="text-base sm:text-lg text-[#f7df8b] select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                {founderName}
              </span>
            </div>
            <div className="border-t border-[#d4af37]/50 pt-0.5 w-full text-left">
              <p className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wide">{founderName.toUpperCase()}</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-amber-200 tracking-wider font-bold">{founderRole}</p>
              <p className="text-[6px] sm:text-[7px] font-mono text-gray-400">Lumixora · A Product of Vyomra</p>
            </div>
          </div>

          {/* Original Official Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-[#d4af37] bg-gradient-to-b from-[#2a1e0b] via-[#1a1307] to-[#0c0803] p-1 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <div className="w-full h-full rounded-full border border-dashed border-[#d4af37]/70 flex flex-col items-center justify-center text-center p-1 bg-[#151007]">
                <span className="text-[6px] font-black text-amber-300 tracking-widest leading-none">OFFICIAL</span>
                <span className="text-[8px] font-black text-[#f7df8b] tracking-wider my-0.5 leading-none">★ SEAL ★</span>
                <span className="text-[6px] font-black text-amber-300 tracking-widest leading-none">VYOMRA</span>
              </div>
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black uppercase tracking-widest text-[#e5c058] mt-0.5 whitespace-nowrap">
              VERIFIED CREDENTIAL
            </span>
          </div>

          {/* Marketing Head */}
          <div className="space-y-0.5 text-right flex flex-col items-end">
            <div className="h-5 sm:h-6 flex items-center justify-end px-1">
              <span className="text-base sm:text-lg text-[#f7df8b] select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                M. Akhil
              </span>
            </div>
            <div className="border-t border-[#d4af37]/50 pt-0.5 w-full text-right">
              <p className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wide">M. AKHIL</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-amber-200 tracking-wider font-bold">Marketing Head</p>
              <p className="text-[6px] sm:text-[7px] font-mono text-gray-400">Campus Partnership Council</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="pt-2 border-t border-[#d4af37]/25 flex items-center justify-between gap-2 relative z-10 text-left">
          <div className="flex items-center gap-2">
            {qrCodeDataUrl ? (
              <div className="p-0.5 bg-white rounded shadow border border-[#d4af37] shrink-0">
                <img src={qrCodeDataUrl} alt="QR Verification" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              </div>
            ) : (
              <div className="w-7 h-7 bg-white rounded border flex items-center justify-center text-[6px] text-black font-mono">QR</div>
            )}
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[7px] sm:text-[8px] font-mono tracking-wider font-black uppercase text-[#e5c058]">
                  SCAN TO VERIFY CREDENTIAL
                </span>
                <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[5.5px] sm:text-[6.5px] font-bold border border-emerald-500/30">
                  LIVE LEDGER
                </span>
              </div>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono tracking-wider uppercase text-gray-400 mt-0.5">
                SHA-256: {hash}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono uppercase font-black px-2 py-0.5 rounded border border-[#d4af37]/40 bg-[#d4af37]/15 text-[#f5d77f]">
              IMMUTABLE LEDGER VERIFIED ✓
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 3. 💎 MODERN EXECUTIVE SAPPHIRE (Enterprise Precision)
  // ════════════════════════════════════════════════════════════════════════════
  if (activeStyle === 'sapphire_executive') {
    return (
      <div
        ref={certRef}
        id="printable-certificate"
        className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl relative shadow-[0_20px_70px_rgba(10,30,80,0.4)] flex flex-col justify-between text-center select-none p-4 sm:p-6 md:p-8 transition-all duration-300 bg-gradient-to-br from-[#050b1e] via-[#09153a] to-[#040816] text-white border-[3px] border-[#3b82f6] min-h-[530px] sm:min-h-[580px] md:min-h-[620px]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="absolute inset-2 sm:inset-3 border border-blue-400/40 rounded-xl pointer-events-none"></div>

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between border-b border-blue-400/30 pb-2 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-500 to-cyan-300 p-[1.5px] shadow-lg shrink-0">
              <img src="/lumixora_logo_icon.png" alt="Lumixora" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase text-white font-sora">
                LUMIXORA
              </h3>
              <p className="text-[7px] sm:text-[8.5px] font-mono tracking-widest uppercase font-bold text-cyan-300">
                Lumixora — a product of Vyomra
              </p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono text-gray-400">
                Cryptographic Credential Registry • Verified Deliverables
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold tracking-widest block text-gray-400">
              OFFICIAL CREDENTIAL ID
            </span>
            <span className="text-[9.5px] sm:text-xs font-black font-mono px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-cyan-200 border border-blue-400/40 shadow-sm inline-block mt-0.5">
              {cert.id}
            </span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="space-y-1.5 sm:space-y-2 py-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 shadow-sm">
            <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-[0.2em] text-cyan-200" style={{ fontFamily: "'Cinzel', serif" }}>
              {certHeading}
            </span>
          </div>

          <p className="text-[9px] sm:text-[10.5px] text-blue-200/80 italic font-serif">
            This is to solemnly attest and certify that
          </p>

          <div className="py-0.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-300 leading-tight drop-shadow-md uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              {recipient}
            </h2>
            <div className="w-32 sm:w-48 h-[1.5px] mx-auto mt-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            {rollNumber && (
              <div className="mt-1">
                <span className="inline-block px-3 py-0.5 rounded-full bg-blue-500/20 text-cyan-200 font-mono text-[8px] sm:text-[9.5px] font-bold border border-blue-400/40 tracking-wider">
                  ROLL NO: {rollNumber}
                </span>
              </div>
            )}
          </div>

          <p className="text-[8px] sm:text-[9.5px] text-gray-300 max-w-xl mx-auto leading-relaxed">
            student of <strong className="text-white font-bold">{college}</strong>{rollNumber ? <span> (ID: <strong className="font-mono text-cyan-200">{rollNumber}</strong>)</span> : null}, has successfully completed the <strong className="text-cyan-200 font-bold">{durationStr}</strong> at <strong>Lumixora</strong> in the <strong className="text-white font-bold">{trackName} Track</strong> ({dateRangeStr}).
          </p>

          <div className="p-2 sm:p-2.5 rounded-xl max-w-2xl mx-auto bg-blue-950/60 border border-blue-400/30 shadow-lg flex flex-wrap items-center justify-around gap-2 text-white">
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-gray-400 block">Performance Grade</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-emerald-400">{gradeStr}</span>
            </div>
            <div className="h-5 w-[1px] bg-white/10 hidden sm:block"></div>
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-gray-400 block">Verified Effort</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-cyan-300">{hoursStr}</span>
            </div>
            <div className="h-5 w-[1px] bg-white/10 hidden sm:block"></div>
            <div>
              <span className="text-[7px] sm:text-[8px] uppercase font-bold text-gray-400 block">Verification</span>
              <span className="text-[9.5px] sm:text-[11px] font-black text-blue-300">Live Central Registry Match</span>
            </div>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className="flex flex-wrap gap-1.5 justify-center py-0.5 relative z-10 max-w-xl mx-auto">
          {(cert.skills && cert.skills.length > 0 ? cert.skills.slice(0, 4) : ['Full-Stack Web Architecture', 'React 19 & Vite', 'Cloudflare Edge Systems', 'Git PR Workflow']).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-bold font-mono bg-blue-500/20 text-cyan-200 border border-blue-400/30 flex items-center gap-1 shadow-sm"
            >
              <Check className="w-2.5 h-2.5 text-cyan-400" /> {skill}
            </span>
          ))}
        </div>

        {/* ── SIGNATURES ── */}
        <div className="grid grid-cols-3 items-end pt-2 border-t border-blue-400/30 relative z-10 gap-2">
          {/* Founder & CEO */}
          <div className="space-y-0.5 text-left flex flex-col items-start">
            <div className="h-5 sm:h-6 flex items-center justify-start px-1">
              <span className="text-base sm:text-lg text-cyan-200 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                {founderName}
              </span>
            </div>
            <div className="border-t border-blue-400/50 pt-0.5 w-full text-left">
              <p className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wide">{founderName.toUpperCase()}</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-cyan-300 tracking-wider font-bold">{founderRole}</p>
              <p className="text-[6px] sm:text-[7px] font-mono text-slate-400">Lumixora · A Product of Vyomra</p>
            </div>
          </div>

          {/* Original Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-cyan-400 bg-gradient-to-b from-[#0e214d] via-[#081533] to-[#040b1a] p-1 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <div className="w-full h-full rounded-full border border-dashed border-cyan-400/70 flex flex-col items-center justify-center text-center p-1 bg-[#06112d]">
                <span className="text-[6px] font-black text-cyan-300 tracking-widest leading-none">OFFICIAL</span>
                <span className="text-[8px] font-black text-white tracking-wider my-0.5 leading-none">★ SEAL ★</span>
                <span className="text-[6px] font-black text-cyan-300 tracking-widest leading-none">VYOMRA</span>
              </div>
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black uppercase tracking-widest text-cyan-300 mt-0.5 whitespace-nowrap">
              VERIFIED CREDENTIAL
            </span>
          </div>

          {/* Marketing Head */}
          <div className="space-y-0.5 text-right flex flex-col items-end">
            <div className="h-5 sm:h-6 flex items-center justify-end px-1">
              <span className="text-base sm:text-lg text-cyan-200 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                M. Akhil
              </span>
            </div>
            <div className="border-t border-blue-400/50 pt-0.5 w-full text-right">
              <p className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wide">M. AKHIL</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-cyan-300 tracking-wider font-bold">Marketing Head</p>
              <p className="text-[6px] sm:text-[7px] font-mono text-slate-400">Campus Partnership Council</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="pt-2 border-t border-blue-400/20 flex items-center justify-between gap-2 relative z-10 text-left">
          <div className="flex items-center gap-2">
            {qrCodeDataUrl ? (
              <div className="p-0.5 bg-white rounded shadow border border-blue-400 shrink-0">
                <img src={qrCodeDataUrl} alt="QR Verification" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              </div>
            ) : (
              <div className="w-7 h-7 bg-white rounded border flex items-center justify-center text-[6px] text-black font-mono">QR</div>
            )}
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[7px] sm:text-[8px] font-mono tracking-wider font-black uppercase text-cyan-300">
                  SCAN TO VERIFY CREDENTIAL
                </span>
                <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[5.5px] sm:text-[6.5px] font-bold border border-emerald-500/30">
                  LIVE LEDGER
                </span>
              </div>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono tracking-wider uppercase text-gray-400 mt-0.5">
                SHA-256: {hash}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono uppercase font-black px-2 py-0.5 rounded border border-blue-400/40 bg-blue-950/80 text-blue-200">
              IMMUTABLE LEDGER VERIFIED ✓
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 4. 📜 IMPERIAL UNIVERSITY HERITAGE (Oxford / Cambridge Academic Parchment)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div
      ref={certRef}
      id="printable-certificate"
      className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl relative shadow-[0_20px_70px_rgba(0,0,0,0.3)] flex flex-col justify-between text-center select-none p-4 sm:p-6 md:p-8 transition-all duration-300 bg-[#faf6ee] text-[#1c1917] border-[6px] border-[#8c6b2d] min-h-[530px] sm:min-h-[580px] md:min-h-[620px]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="absolute inset-2 sm:inset-3 border-2 border-[#8c6b2d]/60 rounded-xl pointer-events-none"></div>

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between border-b-2 border-[#8c6b2d]/40 pb-2 relative z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 text-left">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-stone-900 p-1.5 shadow shrink-0 flex items-center justify-center">
            <img src="/lumixora_logo_icon.png" alt="Lumixora" className="w-full h-full object-contain filter invert" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-black tracking-[0.25em] uppercase text-[#2b1e0f] font-serif">
              LUMIXORA
            </h3>
            <p className="text-[7.5px] sm:text-[9px] font-serif uppercase tracking-widest text-[#78541e] font-bold">
              Lumixora — a product of Vyomra
            </p>
          </div>
        </div>

        <div className="text-right font-serif">
          <span className="text-[6.5px] sm:text-[7.5px] font-bold tracking-wider block text-[#78541e]">
            REGISTRY DIPLOMA NUMBER
          </span>
          <span className="text-[10px] sm:text-xs font-black font-mono px-2.5 py-0.5 rounded bg-[#8c6b2d]/15 text-[#2b1e0f] border border-[#8c6b2d]/40 inline-block mt-0.5">
            {cert.id}
          </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="space-y-1.5 sm:space-y-2 py-1 relative z-10 font-serif">
        <div className="inline-block px-4 py-0.5 rounded-full bg-[#8c6b2d]/15 border border-[#8c6b2d]/40 shadow-sm">
          <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#5c3e10]">
            {certHeading}
          </span>
        </div>

        <p className="text-[10px] sm:text-[11.5px] italic text-[#5c4422]">
          This is to solemnly attest and certify that
        </p>

        <div className="py-0.5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-[#2b1e0f] leading-tight uppercase font-serif">
            {recipient}
          </h2>
          <div className="w-36 sm:w-56 h-[1.5px] mx-auto mt-0.5 bg-gradient-to-r from-transparent via-[#8c6b2d] to-transparent"></div>
          {rollNumber && (
            <div className="mt-1">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#8c6b2d]/15 text-[#5c3e10] font-mono text-[8px] sm:text-[9.5px] font-bold border border-[#8c6b2d]/40 tracking-wider">
                ROLL NO: {rollNumber}
              </span>
            </div>
          )}
        </div>

        <p className="text-[8.5px] sm:text-[10px] text-[#5c4422] max-w-xl mx-auto leading-relaxed">
          student of <strong className="text-stone-900 font-bold">{college}</strong>{rollNumber ? <span> (ID: <strong className="font-mono text-stone-900">{rollNumber}</strong>)</span> : null}, has successfully completed the <strong className="text-stone-900 font-bold">{durationStr}</strong> at <strong>Lumixora</strong> in the <strong className="text-stone-900 font-bold">{trackName} Track</strong> ({dateRangeStr}).
        </p>

        <div className="p-2 sm:p-2.5 rounded-xl max-w-2xl mx-auto bg-[#ede4d1] border border-[#8c6b2d]/40 shadow-sm flex flex-wrap items-center justify-around gap-2 text-stone-900 font-sans">
          <div>
            <span className="text-[7px] sm:text-[8px] uppercase font-bold text-stone-600 block">Performance Grade</span>
            <span className="text-[9.5px] sm:text-[11px] font-black text-emerald-800">{gradeStr}</span>
          </div>
          <div className="h-5 w-[1px] bg-stone-400/40 hidden sm:block"></div>
          <div>
            <span className="text-[7px] sm:text-[8px] uppercase font-bold text-stone-600 block">Verified Effort</span>
            <span className="text-[9.5px] sm:text-[11px] font-black text-stone-900">{hoursStr}</span>
          </div>
          <div className="h-5 w-[1px] bg-stone-400/40 hidden sm:block"></div>
          <div>
            <span className="text-[7px] sm:text-[8px] uppercase font-bold text-stone-600 block">Verification</span>
            <span className="text-[9.5px] sm:text-[11px] font-black text-blue-900">Live Central Registry Match</span>
          </div>
        </div>
      </div>

      {/* ── SKILLS ── */}
      <div className="flex flex-wrap gap-1.5 justify-center py-0.5 relative z-10 max-w-xl mx-auto">
        {(cert.skills && cert.skills.length > 0 ? cert.skills.slice(0, 4) : ['Full-Stack Web Architecture', 'React 19 & Vite', 'Cloudflare Edge Systems', 'Git PR Workflow']).map((skill, idx) => (
          <span
            key={idx}
            className="px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-bold font-mono bg-[#8c6b2d]/10 text-stone-900 border border-[#8c6b2d]/30 flex items-center gap-1 shadow-sm"
          >
            <Check className="w-2.5 h-2.5 text-[#5c3e10]" /> {skill}
          </span>
        ))}
      </div>

      {/* ── SIGNATURES ── */}
      <div className="grid grid-cols-3 items-end pt-2 border-t-2 border-[#8c6b2d]/40 relative z-10 gap-2 font-sans">
        {/* Founder & CEO */}
        <div className="space-y-0.5 text-left flex flex-col items-start">
          <div className="h-5 sm:h-6 flex items-center justify-start px-1">
            <span className="text-base sm:text-lg text-stone-900 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
              {founderName}
            </span>
          </div>
          <div className="border-t border-[#8c6b2d]/50 pt-0.5 w-full text-left">
            <p className="text-[8px] sm:text-[9px] font-black text-stone-950 uppercase tracking-wide">{founderName.toUpperCase()}</p>
            <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-[#5c3e10] tracking-wider font-bold">{founderRole}</p>
            <p className="text-[6px] sm:text-[7px] font-mono text-stone-600">Lumixora · A Product of Vyomra</p>
          </div>
        </div>

        {/* Original Seal */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-[#8c6b2d] bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#d97706]/20 p-1 flex items-center justify-center shadow">
            <div className="w-full h-full rounded-full border border-dashed border-[#8c6b2d] flex flex-col items-center justify-center text-center p-1 bg-amber-50/90 shadow-inner">
              <span className="text-[6px] font-black text-[#78350f] tracking-widest leading-none">OFFICIAL</span>
              <span className="text-[8px] font-black text-[#92400e] tracking-wider my-0.5 leading-none">★ SEAL ★</span>
              <span className="text-[6px] font-black text-[#78350f] tracking-widest leading-none">VYOMRA</span>
            </div>
          </div>
          <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black uppercase tracking-wider text-[#5c3e10] mt-0.5 whitespace-nowrap">
            VERIFIED CREDENTIAL
          </span>
        </div>

        {/* Marketing Head */}
        <div className="space-y-0.5 text-right flex flex-col items-end">
          <div className="h-5 sm:h-6 flex items-center justify-end px-1">
            <span className="text-base sm:text-lg text-stone-900 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
              M. Akhil
            </span>
          </div>
          <div className="border-t border-[#8c6b2d]/50 pt-0.5 w-full text-right">
            <p className="text-[8px] sm:text-[9px] font-black text-stone-950 uppercase tracking-wide">M. AKHIL</p>
            <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-[#5c3e10] tracking-wider font-bold">Marketing Head</p>
            <p className="text-[6px] sm:text-[7px] font-mono text-stone-600">Campus Partnership Council</p>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="pt-2 border-t border-[#8c6b2d]/30 flex items-center justify-between gap-2 relative z-10 text-left font-sans">
        <div className="flex items-center gap-2.5">
          {qrCodeDataUrl ? (
            <div className="p-0.5 bg-white rounded shadow border border-[#8c6b2d] shrink-0">
              <img src={qrCodeDataUrl} alt="QR Verification" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-white rounded border flex items-center justify-center text-[6px] text-black font-mono">QR</div>
          )}
          <div className="leading-tight">
            <span className="text-[7.5px] sm:text-[8.5px] font-mono tracking-wider font-black uppercase text-[#5c3e10] block">
              SCAN TO VERIFY LIVE ON LUMIXORA LEDGER
            </span>
            <p className="text-[6.5px] sm:text-[7.5px] font-mono tracking-wider uppercase text-stone-500 mt-0.5">
              SHA-256: {hash}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[7px] sm:text-[8px] font-mono uppercase font-black px-2.5 py-1 rounded border border-[#8c6b2d]/50 bg-[#8c6b2d]/15 text-[#5c3e10]">
            OFFICIAL DIPLOMA REGISTERED ✓
          </span>
        </div>
      </div>
    </div>
  );
}
