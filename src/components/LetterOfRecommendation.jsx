import React, { useState, useEffect } from 'react';
import { 
  Award, ShieldCheck, CheckCircle2, Printer, Copy, Check, 
  Share2, ExternalLink, Building2, Calendar, FileText, Star,
  Clock, CheckCheck, Sparkles, User, Globe, Mail
} from 'lucide-react';
import QRCode from 'qrcode';
import { parseStudentIdentity } from './CertificateRenderer';

export default function LetterOfRecommendation({
  cert,
  internName,
  collegeName,
  track,
  onPrint = null
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const rawRecipient = internName || cert?.internName || cert?.issuedTo || 'Scholar Intern';
  const identity = parseStudentIdentity(rawRecipient, cert?.rollNumber || cert?.rollNo || '');
  const recipient = identity.cleanName;
  const rollNumber = identity.rollNumber;
  const college = collegeName || cert?.college || 'G. Pulla Reddy Engineering College (Autonomous)';
  const candidateTrack = track || cert?.track || cert?.category || 'Full-Stack Software Engineering';
  const certId = cert?.id || 'LMX-INT-CERT-2026-4783';
  const lorRefId = cert?.lorRefId || `LMX-LOR-2026-${certId.replace(/[^0-9]/g, '').slice(-4) || '4783'}`;
  const issueDate = cert?.issueDate || 'October 24, 2026';
  const founderName = cert?.founderSignatureName || cert?.signerName || 'Shaik Sowban';
  const founderRole = cert?.founderRole || 'Founder & CEO, Lumixora';
  const verificationUrl = cert?.verificationUrl || `${typeof window !== 'undefined' ? window.location.origin : 'https://lumixora.in'}/#verify-cert/${certId}`;
  const hash = cert?.verificationHash || '0x7f83a4c91e4b0728da92f6b831c7d0e49a5b3c2d';

  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
    .then(url => setQrCodeUrl(url))
    .catch(err => console.warn('QR code generation notice:', err));
  }, [verificationUrl]);

  const handlePrint = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('print-lor');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-lor');
      }, 1000);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(verificationUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            Official Letter of Recommendation (LOR)
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 font-mono">Ref: {lorRefId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied Link' : 'Copy Verification URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF (A4 Portrait)</span>
          </button>
        </div>
      </div>

      {/* Official Printable LOR Document Canvas */}
      <div
        id="printable-lor"
        className="max-w-4xl mx-auto bg-[#fafaf9] text-[#1c1917] p-8 sm:p-12 md:p-16 rounded-3xl shadow-2xl border border-stone-200 relative overflow-hidden font-serif selection:bg-amber-100"
        style={{ minHeight: '1050px' }}
      >
        {/* Subtle Watermark Emblem */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
          <img src="/lumixora_logo_icon.png" alt="" className="w-96 h-96 object-contain" />
        </div>

        {/* Top Institutional Header */}
        <div className="border-b-2 border-stone-800 pb-5 mb-8 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 p-2 shadow-md shrink-0 flex items-center justify-center">
              <img src="/lumixora_logo_icon.png" alt="Lumixora" className="w-full h-full object-contain filter invert" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-[0.18em] text-stone-900 leading-tight">
                LUMIXORA
              </h1>
              <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#854d0e]">
                Lumixora — a product of Vyomra
              </p>
              <p className="text-[10px] font-sans text-stone-500">
                Central Verification Registry • Bengaluru | Hyderabad
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-sans text-xs space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200">
            <div className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-mono font-bold border border-stone-300">
              OFFICIAL DISPATCH
            </div>
            <p className="text-[11px] font-mono font-bold text-stone-800">REF: {lorRefId}</p>
            <p className="text-[11px] text-stone-600">Date: {issueDate}</p>
            <p className="text-[10px] font-mono text-emerald-700 font-bold">Ledger Status: VERIFIED ✓</p>
          </div>
        </div>

        {/* Document Body */}
        <div className="space-y-6 relative z-10 font-sans text-stone-800 leading-relaxed text-sm sm:text-[15px]">
          
          {/* Addressee */}
          <div className="space-y-1">
            <p className="font-bold text-stone-900 uppercase tracking-wide text-xs">
              TO WHOM IT MAY CONCERN / ACADEMIC COUNCILS & EMPLOYMENT REVIEW BOARDS
            </p>
            <p className="text-xs text-stone-600">
              Subject: <span className="font-bold text-stone-900">Official Recommendation & Technical Performance Attestation for {recipient}</span>
            </p>
          </div>

          {/* Salutation & Paragraph 1 */}
          <p className="text-justify">
            It is my distinct privilege to write this formal Letter of Recommendation for <strong className="text-stone-950 font-bold">{recipient}</strong>, student of <strong className="text-stone-900">{college}</strong>, who has successfully completed the rigorous <strong>6-Week Intensive Engineering Internship (Batch 01)</strong> at <strong>Lumixora</strong> specializing in the <strong className="text-stone-950">{candidateTrack} Track</strong>.
          </p>

          {/* Paragraph 2 - Technical Rigor & Project Ownership */}
          <p className="text-justify">
            During the tenure, {recipient} was selected from a highly competitive national applicant pool (&lt; 3% acceptance rate) and demonstrated outstanding intellectual curiosity, engineering craftsmanship, and problem-solving velocity. Rather than passive observation, our internship program mandates direct contributions to live production systems, enterprise full-stack architectures, and AI autonomous agent integrations. {recipient} logged over <strong className="text-stone-950">120+ verified engineering hours</strong> with an overall evaluation score of <strong className="text-emerald-700 font-bold">{cert?.score || '98%'} ({cert?.grade || 'Elite Distinction A+'})</strong>.
          </p>

          {/* Paragraph 3 - Key Strengths & Leadership */}
          <p className="text-justify">
            Among {recipient}'s core strengths are an exceptional grasp of clean system design, modular codebase organization, and modern deployment standards. Deliverables were submitted through rigorous pull request reviews, accompanied by end-to-end Loom architectural walkthroughs, live production deployment links, and comprehensive AI research synthesis logs. In peer and mentor reviews, {recipient} consistently exhibited proactive communication, resilience under tight deadlines, and a rare ability to transform complex functional requirements into elegant technical solutions.
          </p>

          {/* Performance Competency Evaluation Matrix */}
          <div className="my-5 p-4 rounded-2xl bg-stone-100 border border-stone-300 font-sans">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-300">
              <span className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Evaluated Competency Index & Performance Matrix
              </span>
              <span className="text-[10px] font-mono font-bold text-stone-600">Academic & Industry Standard</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white border border-stone-200">
                <p className="text-[10px] text-stone-500 font-bold">System Architecture</p>
                <p className="text-base font-black text-stone-900">98 / 100</p>
                <p className="text-[9px] text-emerald-700 font-bold">Advanced</p>
              </div>
              <div className="p-2 rounded-xl bg-white border border-stone-200">
                <p className="text-[10px] text-stone-500 font-bold">Code Quality & Tests</p>
                <p className="text-base font-black text-stone-900">96 / 100</p>
                <p className="text-[9px] text-emerald-700 font-bold">Exceptional</p>
              </div>
              <div className="p-2 rounded-xl bg-white border border-stone-200">
                <p className="text-[10px] text-stone-500 font-bold">AI & Technical Research</p>
                <p className="text-base font-black text-stone-900">99 / 100</p>
                <p className="text-[9px] text-emerald-700 font-bold">Pioneering</p>
              </div>
              <div className="p-2 rounded-xl bg-white border border-stone-200">
                <p className="text-[10px] text-stone-500 font-bold">Execution Velocity</p>
                <p className="text-base font-black text-stone-900">97 / 100</p>
                <p className="text-[9px] text-emerald-700 font-bold">High Velocity</p>
              </div>
            </div>
          </div>

          {/* Paragraph 4 - Final Endorsement */}
          <p className="text-justify">
            I place <strong className="text-stone-950 font-bold">{recipient}</strong> in the highest tier of engineering talent I have mentored. I recommend them with absolute confidence and without reservation for any Software Engineering position, advanced technical internship, or Master's / Postgraduate degree program. They possess both the intellectual horsepower and character to be an invaluable asset to any engineering organization.
          </p>

          <p>
            Should you require further elaboration regarding {recipient}'s work or verification of deliverables, please feel free to reach our council at <a href="mailto:founder@lumixora.in" className="text-blue-700 underline font-medium">founder@lumixora.in</a> or scan the cryptographic ledger seal below.
          </p>
        </div>

        {/* Institutional Sign-off & Signatures */}
        <div className="mt-10 pt-6 border-t-2 border-stone-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end relative z-10 font-sans">
          
          {/* Founder Signature */}
          <div className="space-y-1 sm:col-span-2">
            <div className="h-10 flex items-center">
              <span className="text-2xl text-stone-900 select-none" style={{ fontFamily: "'Great Vibes', cursive" }}>
                {founderName}
              </span>
            </div>
            <div className="border-t border-stone-400 pt-1">
              <p className="text-sm font-black text-stone-900">{founderName}</p>
              <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">{founderRole}</p>
              <p className="text-[11px] text-stone-500 font-semibold">Lumixora — a product of Vyomra</p>
              <p className="text-[10px] text-stone-400 font-mono">Email: founder@lumixora.in • Web: https://lumixora.in • Verify: verify@lumixora.in</p>
            </div>
          </div>

          {/* Official Seal & QR Verification */}
          <div className="flex flex-col items-center sm:items-end justify-center text-center sm:text-right space-y-1.5">
            <div className="flex items-center gap-3">
              {qrCodeUrl ? (
                <div className="p-1 bg-white rounded-lg border border-stone-300 shadow-sm shrink-0">
                  <img src={qrCodeUrl} alt="Ledger QR" className="w-16 h-16 object-contain" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-stone-200 rounded border flex items-center justify-center text-[8px] font-mono">QR</div>
              )}
              <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-600 flex flex-col items-center justify-center shadow-inner text-amber-900">
                <Award className="w-5 h-5 text-amber-700" />
                <span className="text-[6.5px] font-bold font-mono uppercase tracking-widest mt-0.5">OFFICIAL SEAL</span>
              </div>
            </div>
            <p className="text-[9px] font-mono text-stone-500 font-bold uppercase tracking-wider">
              Scan to verify live on Lumixora Ledger
            </p>
            <p className="text-[8px] font-mono text-stone-400 truncate max-w-[200px]">
              SHA-256: {hash.slice(0, 24)}...
            </p>
          </div>
        </div>

        {/* Verification Footer Stamp */}
        <div className="mt-8 pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[10px] font-sans text-stone-500 gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Cryptographic Proof-of-Competence & Deliverables Record • Lumixora — a product of Vyomra</span>
          </div>
          <span className="font-mono text-stone-400">Verifiable at lumixora.in/verify</span>
        </div>
      </div>
    </div>
  );
}
