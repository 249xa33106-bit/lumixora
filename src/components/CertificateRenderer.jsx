import React from 'react';
import { Award, Check, Sparkles } from 'lucide-react';

export const CERTIFICATE_STYLES = [
  {
    id: 'gold_midnight',
    name: '👑 Royal Midnight Gold',
    badge: 'Luxury Prestige',
    desc: 'Deep midnight obsidian with 24K gold foil border, ornate crowns & 3D medal seal'
  },
  {
    id: 'classic_ivory',
    name: '📜 Imperial Ivory Diploma',
    badge: 'Classic Heritage',
    desc: 'Smooth warm cream parchment with gold filigree, serif typography & wax seal'
  },
  {
    id: 'cyber_neon',
    name: '⚡ Quantum Cyber Neon',
    badge: 'Futuristic Dark',
    desc: 'Deep space-black with glowing Lumixora cyan, violet neon accents & holographic badge'
  },
  {
    id: 'sapphire_executive',
    name: '💎 Executive Sapphire',
    badge: 'Corporate Modern',
    desc: 'Deep royal sapphire & titanium silver with clean architectural Swiss precision'
  }
];

function formatName(raw) {
  if (!raw) return 'Shaik Sowban';
  return raw
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export default function CertificateRenderer({
  cert,
  studentName = 'Shaik Sowban',
  collegeName = 'G. Pulla Reddy Engineering College (Autonomous)',
  styleId = 'gold_midnight',
  qrCodeDataUrl = '',
  certRef = null
}) {
  if (!cert) return null;

  const recipient = formatName(cert.issuedTo || studentName);
  const college = cert.college || collegeName;
  const hash = cert.hash || '8A4F-C91E-4B07-28DA-92F6-B831-C7D0-E49A';

  // Normalize legacy style IDs
  let activeStyle = styleId;
  if (styleId === 'gold' || styleId === 'champagne' || styleId === 'parchment') activeStyle = 'classic_ivory';
  if (styleId === 'cyber' || styleId === 'obsidian') activeStyle = 'gold_midnight';
  if (styleId === 'sapphire') activeStyle = 'sapphire_executive';
  if (styleId === 'emerald') activeStyle = 'classic_ivory';

  // ════════════════════════════════════════════════════════════════════════════
  // 1. 👑 ROYAL MIDNIGHT GOLD (Dark Luxury Prestige)
  // ════════════════════════════════════════════════════════════════════════════
  if (activeStyle === 'gold_midnight') {
    return (
      <div
        ref={certRef}
        id="printable-certificate"
        className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl relative shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col justify-between text-center select-none p-4 sm:p-6 md:p-7 transition-all duration-300 bg-gradient-to-br from-[#060813] via-[#0c1226] to-[#04060c] text-white border-[3px] border-[#d4af37] min-h-[530px] sm:min-h-[580px] md:min-h-[620px]"
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
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#8e6c15] via-[#e5c058] to-[#fff3bf] p-[1.5px] shadow-lg shadow-amber-500/20 shrink-0">
              <img src="/lumixora_logo_icon.png" alt="Lumixora" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase text-white font-sora">
                LUMIXORA
              </h3>
              <p className="text-[7px] sm:text-[8.5px] font-mono tracking-widest uppercase font-bold text-[#e5c058]">
                Autonomous Academic & Engineering Board
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold tracking-widest block text-gray-400">
              OFFICIAL CREDENTIAL ID
            </span>
            <span className="text-[9.5px] sm:text-xs font-black font-mono px-2.5 py-0.5 rounded-lg bg-[#d4af37]/15 text-[#f5d77f] border border-[#d4af37]/40 shadow-sm">
              {cert.id}
            </span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="space-y-1 sm:space-y-1.5 py-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#e5c058]" />
            <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-[0.2em] text-[#fef08a]" style={{ fontFamily: "'Cinzel', serif" }}>
              {cert.isUnlocked ? "Executive Certificate of Skill Mastery" : "Official Certificate of Excellence & Mastery"}
            </span>
            <Sparkles className="w-3 h-3 text-[#e5c058]" />
          </div>

          <p className="text-[9px] sm:text-[10.5px] text-gray-300 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            This is to solemnly attest and certify that
          </p>

          <div className="py-0.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fff3bf] via-[#e5c058] to-[#f7df8b] leading-tight drop-shadow-md" style={{ fontFamily: "'Cinzel', serif" }}>
              {recipient}
            </h2>
            <div className="w-32 sm:w-48 h-[1.5px] mx-auto mt-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          </div>

          <p className="text-[8px] sm:text-[9.5px] text-gray-300 max-w-xl mx-auto leading-tight">
            has demonstrated distinction in institutional engineering standards & core computer science mastery in:
          </p>

          <div className="p-2 sm:p-2.5 rounded-xl max-w-xl mx-auto bg-[#13192e]/80 border border-[#d4af37]/40 shadow-lg">
            <p className="text-xs sm:text-sm md:text-[15px] font-black tracking-tight text-white font-sora leading-snug">
              {cert.title}
            </p>
            <p className="text-[7.5px] sm:text-[8.5px] mt-0.5 text-amber-200/90 font-mono">
              Track: <span className="font-bold text-white">{cert.category}</span> • Status: <span className={cert.isUnlocked ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{cert.isUnlocked ? "Certified Distinction" : "Milestone In Progress"}</span> • Honors: <span className="font-bold text-white">{cert.score}</span>
            </p>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className="flex flex-wrap gap-1.5 justify-center py-0.5 relative z-10 max-w-xl mx-auto">
          {cert.skills && cert.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-bold font-mono bg-[#d4af37]/10 text-amber-200 border border-[#d4af37]/30 flex items-center gap-1 shadow-sm"
            >
              <Check className="w-2.5 h-2.5 text-[#e5c058]" /> {skill}
            </span>
          ))}
        </div>

        {/* ── SIGNATURES & 3D SEAL ── */}
        <div className="grid grid-cols-3 items-end pt-1.5 sm:pt-2 border-t border-[#d4af37]/30 relative z-10 gap-2">
          {/* Dean */}
          <div className="space-y-0.5 text-left">
            <div className="h-4 sm:h-5 flex items-center">
              <svg viewBox="0 0 180 50" className="w-14 sm:w-16 h-4 sm:h-5 fill-none stroke-[#e5c058]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 10 32 C 25 10, 40 40, 55 18 C 70 5, 78 38, 90 25 C 105 15, 120 12, 135 22 C 150 32, 160 18, 172 20 M 35 42 L 155 38" />
              </svg>
            </div>
            <div className="border-t border-[#d4af37]/40 pt-0.5">
              <p className="text-[7.5px] sm:text-[8.5px] font-bold text-white truncate">Dean of Academic Affairs</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono text-amber-200 truncate">{college}</p>
            </div>
          </div>

          {/* 3D Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#8e6c15] via-[#e5c058] to-[#fff3bf] p-[1.5px] shadow-lg shadow-amber-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1b253b] via-[#0f172a] to-[#090d16] flex items-center justify-center border border-[#e5c058]/50 shadow-inner">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#f7df8b]" />
              </div>
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black uppercase tracking-widest text-[#e5c058] mt-0.5 whitespace-nowrap">
              ★ OFFICIAL MERIT SEAL ★
            </span>
          </div>

          {/* Founder */}
          <div className="space-y-0.5 text-right flex flex-col items-end">
            <div className="h-4 sm:h-5 flex items-center justify-end px-1">
              <span className="text-sm sm:text-base text-[#f7df8b] select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Shaik Sowban
              </span>
            </div>
            <div className="border-t border-[#d4af37]/40 pt-0.5 w-full text-right">
              <p className="text-[7.5px] sm:text-[8.5px] font-bold text-white truncate">Shaik Sowban</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-amber-200 tracking-wider truncate">Founder of Lumixora</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="pt-1.5 border-t border-[#d4af37]/25 flex items-center justify-between gap-2 relative z-10 text-left">
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
              {cert.isUnlocked ? "IMMUTABLE LEDGER VERIFIED ✓" : "CANDIDATE LEDGER TRACKING"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 2. 📜 IMPERIAL IVORY DIPLOMA (Clean Warm Luxury Light)
  // ════════════════════════════════════════════════════════════════════════════
  if (activeStyle === 'classic_ivory') {
    return (
      <div
        ref={certRef}
        id="printable-certificate"
        className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl relative shadow-[0_20px_70px_rgba(0,0,0,0.3)] flex flex-col justify-between text-center select-none p-4 sm:p-6 md:p-7 transition-all duration-300 bg-gradient-to-br from-[#fffdf7] via-[#fbf5e8] to-[#f2e6d0] text-[#1c1917] border-[5px] border-[#c59b27] min-h-[530px] sm:min-h-[580px] md:min-h-[620px]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="absolute inset-2 sm:inset-3 border-2 border-[#c59b27]/60 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-3.5 sm:inset-4.5 border border-dashed border-[#c59b27]/30 rounded-lg pointer-events-none"></div>

        <div className="absolute top-2.5 left-2.5 text-[#c59b27] text-xs sm:text-sm font-serif select-none pointer-events-none">✦ ❖ ✦</div>
        <div className="absolute top-2.5 right-2.5 text-[#c59b27] text-xs sm:text-sm font-serif select-none pointer-events-none">✦ ❖ ✦</div>
        <div className="absolute bottom-2.5 left-2.5 text-[#c59b27] text-xs sm:text-sm font-serif select-none pointer-events-none">✦ ❖ ✦</div>
        <div className="absolute bottom-2.5 right-2.5 text-[#c59b27] text-xs sm:text-sm font-serif select-none pointer-events-none">✦ ❖ ✦</div>

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between border-b border-[#c59b27]/40 pb-2 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#8e6c15] via-[#c59b27] to-[#f7df8b] p-[1.5px] shadow shrink-0">
              <img src="/lumixora_logo_icon.png" alt="Lumixora" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase text-[#2b1e0f] font-sora">
                LUMIXORA
              </h3>
              <p className="text-[7px] sm:text-[8.5px] font-mono tracking-widest uppercase font-bold text-[#854d0e]">
                Autonomous Academic & Engineering Board
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold tracking-wider block text-[#854d0e]">
              OFFICIAL CREDENTIAL ID
            </span>
            <span className="text-[9.5px] sm:text-xs font-black font-mono px-2.5 py-0.5 rounded-lg bg-[#c59b27]/20 text-[#2b1e0f] border border-[#c59b27]/50">
              {cert.id}
            </span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="space-y-1 sm:space-y-1.5 py-1 relative z-10">
          <div className="inline-block px-3.5 py-0.5 rounded-full bg-[#c59b27]/15 border border-[#c59b27]/40 shadow-sm">
            <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-[0.18em] text-[#854d0e]" style={{ fontFamily: "'Cinzel', serif" }}>
              {cert.isUnlocked ? "Executive Certificate of Competency" : "Official Certificate of Excellence & Mastery"}
            </span>
          </div>

          <p className="text-[9px] sm:text-[10.5px] font-serif italic text-[#5c4422]" style={{ fontFamily: "'Playfair Display', serif" }}>
            This is to solemnly attest and certify that
          </p>

          <div className="py-0.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-[#2b1e0f] leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
              {recipient}
            </h2>
            <div className="w-32 sm:w-48 h-[1.5px] mx-auto mt-0.5 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent"></div>
          </div>

          <p className="text-[8px] sm:text-[9.5px] font-medium max-w-xl mx-auto text-[#5c4422] leading-tight">
            has demonstrated distinction in institutional engineering standards & core computer science mastery in:
          </p>

          <div className="p-2 sm:p-2.5 rounded-xl max-w-xl mx-auto bg-[#ebdcb9]/70 border border-[#c59b27]/50 shadow-sm">
            <p className="text-xs sm:text-sm md:text-[15px] font-black tracking-tight text-[#1c1917] font-sora leading-snug">
              {cert.title}
            </p>
            <p className="text-[7.5px] sm:text-[8.5px] mt-0.5 font-semibold text-[#854d0e]">
              Track: <span className="font-bold text-[#1c1917]">{cert.category}</span> • Status: <span className={cert.isUnlocked ? "text-emerald-800 font-bold" : "text-amber-900 font-bold"}>{cert.isUnlocked ? "Certified Distinction" : "Prerequisites In Progress"}</span> • Honors: <span className="font-bold text-[#1c1917]">{cert.score}</span>
            </p>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className="flex flex-wrap gap-1.5 justify-center py-0.5 relative z-10 max-w-xl mx-auto">
          {cert.skills && cert.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-bold bg-[#dfcca3] text-[#2b1e0f] border border-[#c59b27]/50 flex items-center gap-1 shadow-sm"
            >
              <Check className="w-2.5 h-2.5 text-emerald-700" /> {skill}
            </span>
          ))}
        </div>

        {/* ── SIGNATURES ── */}
        <div className="grid grid-cols-3 items-end pt-1.5 sm:pt-2 border-t border-[#c59b27]/40 relative z-10 gap-2">
          <div className="space-y-0.5 text-left">
            <div className="h-4 sm:h-5 flex items-center">
              <svg viewBox="0 0 180 50" className="w-14 sm:w-16 h-4 sm:h-5 fill-none stroke-[#2b1e0f]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 10 32 C 25 10, 40 40, 55 18 C 70 5, 78 38, 90 25 C 105 15, 120 12, 135 22 C 150 32, 160 18, 172 20 M 35 42 L 155 38" />
              </svg>
            </div>
            <div className="border-t border-[#c59b27]/50 pt-0.5">
              <p className="text-[7.5px] sm:text-[8.5px] font-black text-[#1c1917] truncate">Dean of Academic Affairs</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-bold text-[#854d0e] truncate">{college}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#8e6c15] via-[#e5c058] to-[#fff3bf] p-[1.5px] shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1b253b] via-[#0f172a] to-[#090d16] flex items-center justify-center border border-[#e5c058]/50 shadow-inner">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#f7df8b]" />
              </div>
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black uppercase tracking-wider text-[#854d0e] mt-0.5 whitespace-nowrap">
              ★ OFFICIAL MERIT SEAL ★
            </span>
          </div>

          <div className="space-y-0.5 text-right flex flex-col items-end">
            <div className="h-4 sm:h-5 flex items-center justify-end px-1">
              <span className="text-sm sm:text-base text-[#2b1e0f] select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Shaik Sowban
              </span>
            </div>
            <div className="border-t border-[#c59b27]/50 pt-0.5 w-full text-right">
              <p className="text-[7.5px] sm:text-[8.5px] font-black text-[#1c1917] truncate">Shaik Sowban</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-bold uppercase text-[#854d0e] tracking-wider truncate">Founder of Lumixora</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="pt-1.5 border-t border-[#c59b27]/30 flex items-center justify-between gap-2 relative z-10 text-left">
          <div className="flex items-center gap-2">
            {qrCodeDataUrl ? (
              <div className="p-0.5 bg-white rounded shadow border border-[#c59b27] shrink-0">
                <img src={qrCodeDataUrl} alt="QR Verification" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              </div>
            ) : (
              <div className="w-7 h-7 bg-white rounded border border-gray-300 flex items-center justify-center text-[6px] text-gray-500 font-mono">QR</div>
            )}
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[7px] sm:text-[8px] font-mono tracking-wider font-black uppercase text-[#854d0e]">
                  SCAN TO VERIFY CREDENTIAL
                </span>
                <span className="px-1 py-0.2 rounded bg-emerald-600/15 text-emerald-800 font-mono text-[5.5px] sm:text-[6.5px] font-bold border border-emerald-500/30">
                  LIVE LEDGER
                </span>
              </div>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono tracking-widest uppercase font-bold text-[#78350f] mt-0.5">
                SHA-256: {hash}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono uppercase font-black px-2 py-0.5 rounded border border-[#c59b27]/50 bg-[#c59b27]/15 text-[#854d0e]">
              {cert.isUnlocked ? "IMMUTABLE LEDGER VERIFIED ✓" : "CANDIDATE LEDGER TRACKING"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 3. ⚡ QUANTUM CYBER NEON (Electric Lumixora Dark)
  // ════════════════════════════════════════════════════════════════════════════
  if (activeStyle === 'cyber_neon') {
    return (
      <div
        ref={certRef}
        id="printable-certificate"
        className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl relative shadow-[0_20px_70px_rgba(0,0,0,0.9)] flex flex-col justify-between text-center select-none p-4 sm:p-6 md:p-7 transition-all duration-300 bg-[#030611] text-white border-2 border-cyan-400/60 min-h-[530px] sm:min-h-[580px] md:min-h-[620px]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="absolute inset-2 sm:inset-3 border border-cyan-400/20 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-3.5 sm:inset-4.5 border border-purple-500/20 rounded-lg pointer-events-none"></div>

        <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-cyan-400 rounded-tl-md"></div>
        <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-cyan-400 rounded-tr-md"></div>
        <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-purple-400 rounded-bl-md"></div>
        <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-purple-400 rounded-br-md"></div>

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 text-left">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/30 shrink-0">
              <img src="/lumixora_logo_icon.png" alt="Lumixora Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase font-sora bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-transparent">
                LUMIXORA
              </h3>
              <p className="text-[7px] sm:text-[8.5px] font-mono tracking-widest uppercase font-bold text-cyan-400">
                Autonomous Academic & Engineering Board
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold tracking-widest block text-cyan-400/80">
              VERIFIED CREDENTIAL ID
            </span>
            <span className="text-[9.5px] sm:text-xs font-black font-mono px-2.5 py-0.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 shadow-inner">
              {cert.id}
            </span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="space-y-1 sm:space-y-1.5 py-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-[0.2em] text-cyan-300 font-sora">
              Quantum Credential of Engineering Mastery
            </span>
            <Sparkles className="w-3 h-3 text-purple-400" />
          </div>

          <p className="text-[9px] sm:text-[10.5px] text-gray-300">
            This is to officially certify that
          </p>

          <div className="py-0.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-sora bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent leading-tight drop-shadow-md">
              {recipient}
            </h2>
            <div className="w-32 sm:w-48 h-[2px] mx-auto mt-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </div>

          <p className="text-[8px] sm:text-[9.5px] text-gray-300 max-w-xl mx-auto leading-tight">
            has demonstrated distinction in high-order engineering standards, problem solving, and verified competency in:
          </p>

          <div className="p-2 sm:p-2.5 rounded-xl max-w-xl mx-auto bg-gradient-to-r from-cyan-950/50 via-[#0d142b]/80 to-purple-950/50 border border-cyan-400/30 shadow-lg">
            <p className="text-xs sm:text-sm md:text-[15px] font-black tracking-tight text-white font-sora leading-snug">
              {cert.title}
            </p>
            <p className="text-[7.5px] sm:text-[8.5px] mt-0.5 text-cyan-300 font-mono">
              Track: <span className="font-bold text-white">{cert.category}</span> • Status: <span className={cert.isUnlocked ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{cert.isUnlocked ? "Verified Distinction" : "Milestone In Progress"}</span> • Honors: <span className="font-bold text-white">{cert.score}</span>
            </p>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className="flex flex-wrap gap-1.5 justify-center py-0.5 relative z-10 max-w-xl mx-auto">
          {cert.skills && cert.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-bold font-mono bg-cyan-950/70 text-cyan-200 border border-cyan-400/40 flex items-center gap-1 shadow-sm"
            >
              <Check className="w-2.5 h-2.5 text-cyan-400" /> {skill}
            </span>
          ))}
        </div>

        {/* ── SIGNATURES ── */}
        <div className="grid grid-cols-3 items-end pt-1.5 sm:pt-2 border-t border-cyan-500/20 relative z-10 gap-2">
          <div className="space-y-0.5 text-left">
            <div className="h-4 sm:h-5 flex items-center">
              <svg viewBox="0 0 180 50" className="w-14 sm:w-16 h-4 sm:h-5 fill-none stroke-cyan-400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 10 32 C 25 10, 40 40, 55 18 C 70 5, 78 38, 90 25 C 105 15, 120 12, 135 22 C 150 32, 160 18, 172 20 M 35 42 L 155 38" />
              </svg>
            </div>
            <div className="border-t border-cyan-400/30 pt-0.5">
              <p className="text-[7.5px] sm:text-[8.5px] font-bold text-white truncate">Dean of Academic Affairs</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono text-cyan-300 truncate">{college}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#070b19] flex items-center justify-center border border-cyan-400/50 shadow-inner">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
              </div>
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black uppercase tracking-widest text-cyan-300 mt-0.5 whitespace-nowrap">
              ★ CYBER MERIT SEAL ★
            </span>
          </div>

          <div className="space-y-0.5 text-right flex flex-col items-end">
            <div className="h-4 sm:h-5 flex items-center justify-end px-1">
              <span className="text-sm sm:text-base text-cyan-300 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Shaik Sowban
              </span>
            </div>
            <div className="border-t border-cyan-400/30 pt-0.5 w-full text-right">
              <p className="text-[7.5px] sm:text-[8.5px] font-bold text-white truncate">Shaik Sowban</p>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-purple-300 tracking-wider truncate">Founder of Lumixora</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="pt-1.5 border-t border-cyan-500/20 flex items-center justify-between gap-2 relative z-10 text-left">
          <div className="flex items-center gap-2">
            {qrCodeDataUrl ? (
              <div className="p-0.5 bg-white rounded shadow border border-cyan-400 shrink-0">
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
                <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[5.5px] sm:text-[6.5px] font-bold border border-cyan-400/40">
                  LIVE LEDGER
                </span>
              </div>
              <p className="text-[6.5px] sm:text-[7.5px] font-mono tracking-wider uppercase text-gray-400 mt-0.5">
                SHA-256: {hash}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[6.5px] sm:text-[7.5px] font-mono uppercase font-black px-2 py-0.5 rounded border border-cyan-400/40 bg-cyan-950/80 text-cyan-300">
              {cert.isUnlocked ? "IMMUTABLE LEDGER VERIFIED ✓" : "CANDIDATE LEDGER TRACKING"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 4. 💎 EXECUTIVE SAPPHIRE (Deep Swiss Blue)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div
      ref={certRef}
      id="printable-certificate"
      className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl relative shadow-[0_20px_70px_rgba(0,0,0,0.8)] flex flex-col justify-between text-center select-none p-4 sm:p-6 md:p-7 transition-all duration-300 bg-gradient-to-br from-[#061129] via-[#0b1c42] to-[#040a1a] text-white border-2 border-blue-400/50 min-h-[530px] sm:min-h-[580px] md:min-h-[620px]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="absolute inset-2 sm:inset-3 border border-blue-400/25 rounded-xl pointer-events-none"></div>
      <div className="absolute inset-3.5 sm:inset-4.5 border border-dashed border-cyan-400/20 rounded-lg pointer-events-none"></div>

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between border-b border-blue-400/25 pb-2 relative z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 text-left">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-400 via-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-blue-500/30 shrink-0">
            <img src="/lumixora_logo_icon.png" alt="Lumixora" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase text-white font-sora">
              LUMIXORA
            </h3>
            <p className="text-[7px] sm:text-[8.5px] font-mono tracking-widest uppercase font-bold text-cyan-300">
              Autonomous Academic & Engineering Board
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold tracking-widest block text-blue-300">
            OFFICIAL CREDENTIAL ID
          </span>
          <span className="text-[9.5px] sm:text-xs font-black font-mono px-2.5 py-0.5 rounded-lg bg-blue-950/80 text-blue-200 border border-blue-400/40">
            {cert.id}
          </span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="space-y-1 sm:space-y-1.5 py-1 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-blue-950/70 border border-blue-400/40 shadow-sm">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-[0.2em] text-cyan-200 font-sora">
            Executive Certificate of Professional Mastery
          </span>
          <Sparkles className="w-3 h-3 text-cyan-400" />
        </div>

        <p className="text-[9px] sm:text-[10.5px] text-blue-200/80">
          This is to solemnly attest and certify that
        </p>

        <div className="py-0.5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-sora bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight drop-shadow-md">
            {recipient}
          </h2>
          <div className="w-32 sm:w-48 h-[2px] mx-auto mt-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>

        <p className="text-[8px] sm:text-[9.5px] text-blue-200/80 max-w-xl mx-auto leading-tight">
          has demonstrated distinction in institutional engineering standards & core computer science mastery in:
        </p>

        <div className="p-2 sm:p-2.5 rounded-xl max-w-xl mx-auto bg-gradient-to-r from-blue-950/60 via-[#0d1c3d]/90 to-blue-950/60 border border-blue-400/30 shadow-lg">
          <p className="text-xs sm:text-sm md:text-[15px] font-black tracking-tight text-white font-sora leading-snug">
            {cert.title}
          </p>
          <p className="text-[7.5px] sm:text-[8.5px] mt-0.5 text-cyan-300 font-mono">
            Track: <span className="font-bold text-white">{cert.category}</span> • Status: <span className={cert.isUnlocked ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{cert.isUnlocked ? "Certified Distinction" : "Milestone In Progress"}</span> • Honors: <span className="font-bold text-white">{cert.score}</span>
          </p>
        </div>
      </div>

      {/* ── SKILLS ── */}
      <div className="flex flex-wrap gap-1.5 justify-center py-0.5 relative z-10 max-w-xl mx-auto">
        {cert.skills && cert.skills.slice(0, 4).map((skill, idx) => (
          <span
            key={idx}
            className="px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-bold font-mono bg-blue-950/70 text-cyan-200 border border-blue-400/30 flex items-center gap-1 shadow-sm"
          >
            <Check className="w-2.5 h-2.5 text-cyan-400" /> {skill}
          </span>
        ))}
      </div>

      {/* ── SIGNATURES ── */}
      <div className="grid grid-cols-3 items-end pt-1.5 sm:pt-2 border-t border-blue-400/25 relative z-10 gap-2">
        <div className="space-y-0.5 text-left">
          <div className="h-4 sm:h-5 flex items-center">
            <svg viewBox="0 0 180 50" className="w-14 sm:w-16 h-4 sm:h-5 fill-none stroke-cyan-400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 10 32 C 25 10, 40 40, 55 18 C 70 5, 78 38, 90 25 C 105 15, 120 12, 135 22 C 150 32, 160 18, 172 20 M 35 42 L 155 38" />
            </svg>
          </div>
          <div className="border-t border-blue-400/30 pt-0.5">
            <p className="text-[7.5px] sm:text-[8.5px] font-bold text-white truncate">Dean of Academic Affairs</p>
            <p className="text-[6.5px] sm:text-[7.5px] font-mono text-cyan-300 truncate">{college}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#1e40af] via-[#3b82f6] to-[#93c5fd] p-[1.5px] shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] flex items-center justify-center border border-[#3b82f6]/50 shadow-inner">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#93c5fd]" />
            </div>
          </div>
          <span className="text-[6.5px] sm:text-[7.5px] font-mono font-black uppercase tracking-wider text-cyan-300 mt-0.5 whitespace-nowrap">
            ★ OFFICIAL MERIT SEAL ★
          </span>
        </div>

        <div className="space-y-0.5 text-right flex flex-col items-end">
          <div className="h-4 sm:h-5 flex items-center justify-end px-1">
            <span className="text-sm sm:text-base text-cyan-300 select-none block" style={{ fontFamily: "'Great Vibes', cursive" }}>
              Shaik Sowban
            </span>
          </div>
          <div className="border-t border-blue-400/30 pt-0.5 w-full text-right">
            <p className="text-[7.5px] sm:text-[8.5px] font-bold text-white truncate">Shaik Sowban</p>
            <p className="text-[6.5px] sm:text-[7.5px] font-mono uppercase text-cyan-300 tracking-wider truncate">Founder of Lumixora</p>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="pt-1.5 border-t border-blue-400/20 flex items-center justify-between gap-2 relative z-10 text-left">
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
            {cert.isUnlocked ? "IMMUTABLE LEDGER VERIFIED ✓" : "CANDIDATE LEDGER TRACKING"}
          </span>
        </div>
      </div>
    </div>
  );
}
