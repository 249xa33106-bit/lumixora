import React, { useState } from 'react';
import {
  X, Award, ShieldCheck, Download, Share2, Check, ExternalLink,
  Sparkles, CheckCircle2, QrCode
} from 'lucide-react';

export default function GprecPlacementCertificateModal({
  isOpen,
  onClose,
  studentName = 'GPREC Scholar',
  rollNo = '229X1A05XX',
  branch = 'CSE',
  overallReadiness = 78,
  solvedCount = 0,
  aptitudeCount = 0,
  trustScore = 100,
  addToast
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const certId = `GPREC-CERT-${currentYear}-${Math.abs(
    (studentName + rollNo + branch).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  ).toString(16).toUpperCase().padStart(8, '0')}`;

  const verificationUrl = `https://gprec.lumixora.in/?subdomain=gprec#verify-cert-${certId}`;

  // 1-Click LinkedIn Add Certification Deep-Link
  const linkedInCertUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
    `&name=${encodeURIComponent('GPREC AI Placement Readiness & Technical Proficiency')}` +
    `&organizationName=${encodeURIComponent('G.Pulla Reddy Engineering College (Autonomous)')}` +
    `&issueYear=${currentYear}` +
    `&issueMonth=${new Date().getMonth() + 1}` +
    `&certUrl=${encodeURIComponent(verificationUrl)}` +
    `&certId=${encodeURIComponent(certId)}`;

  const githubBadgeMarkdown = `[![GPREC Verified Placement Candidate](https://img.shields.io/badge/GPREC%20Placement-Verified%20Candidate%20${overallReadiness}%25-00c853?style=for-the-badge&logo=shield)](${verificationUrl})`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    if (addToast) addToast({ message: 'Copied verified credential URL!', type: 'success' });
  };

  const handleCopyBadge = () => {
    navigator.clipboard?.writeText(githubBadgeMarkdown);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
    if (addToast) addToast({ message: 'Copied GitHub README Badge markdown!', type: 'success' });
  };

  const handlePrintCertificatePdf = () => {
    const win = window.open('', '_blank', 'width=1050,height=750');
    if (!win) return;
    const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GPREC Verified Placement Certificate - ${esc(studentName)}</title>
  <style>
    @page { size: landscape; margin: 10mm; }
    body { margin: 0; padding: 20px; font-family: 'Times New Roman', Georgia, serif; background: #fff; color: #1e1b4b; -webkit-print-color-adjust: exact; }
    .cert-border { border: 12px double #b45309; padding: 24px; position: relative; background: #fffbf0; border-radius: 8px; box-shadow: inset 0 0 20px rgba(180, 83, 9, 0.1); }
    .inner-border { border: 2px solid #d97706; padding: 28px 36px; text-align: center; }
    .logo-header { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 800; color: #78350f; text-transform: uppercase; letter-spacing: 0.15em; }
    .college-name { font-size: 28px; font-weight: 900; color: #451a03; margin: 6px 0 2px; letter-spacing: 0.02em; }
    .college-sub { font-family: -apple-system, sans-serif; font-size: 11px; color: #92400e; font-weight: 600; }
    .ribbon { margin: 18px auto; display: inline-block; padding: 6px 24px; background: #b45309; color: #fff; font-family: -apple-system, sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 999px; }
    .award-text { font-size: 15px; color: #78350f; margin-top: 10px; font-style: italic; }
    .student-name { font-size: 32px; font-weight: 900; color: #0f172a; margin: 10px 0 4px; text-decoration: underline; text-decoration-color: #d97706; }
    .student-details { font-family: -apple-system, sans-serif; font-size: 13px; font-weight: 700; color: #475569; }
    .cert-body { font-size: 14px; color: #334155; line-height: 1.6; max-width: 780px; margin: 14px auto; }
    .kpi-row { display: flex; justify-content: center; gap: 24px; margin: 20px 0; font-family: -apple-system, sans-serif; }
    .kpi-pill { border: 1px solid #d97706; background: #fff; padding: 8px 16px; border-radius: 10px; min-width: 120px; }
    .kpi-l { font-size: 10px; font-weight: 700; color: #78350f; text-transform: uppercase; }
    .kpi-v { font-size: 18px; font-weight: 900; color: #0f172a; margin-top: 2px; }
    .sig-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding: 0 40px; font-family: -apple-system, sans-serif; }
    .sig-line { width: 180px; border-top: 1.5px solid #451a03; margin-bottom: 6px; }
    .sig-title { font-size: 11px; font-weight: 700; color: #451a03; }
    .meta-footer { font-family: monospace; font-size: 10px; color: #94a3b8; margin-top: 24px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="cert-border">
    <div class="inner-border">
      <div class="logo-header">G. Pulla Reddy Engineering College (Autonomous)</div>
      <div class="college-name">GPREC Placement Directorate</div>
      <div class="college-sub">Accredited by NAAC with 'A+' Grade • Approved by AICTE, New Delhi • Affiliated to JNTUA • Kurnool - 518 007</div>

      <div class="ribbon">Verified Placement Readiness Credential</div>

      <div class="award-text">This is to officially certify that</div>
      <div class="student-name">${esc(studentName)}</div>
      <div class="student-details">Roll No: <strong>${esc(rollNo)}</strong> • Branch: <strong>${esc(branch)} (Autonomous)</strong></div>

      <div class="cert-body">
        has demonstrated rigorous technical proficiency, algorithmic competency, and full compliance with autonomous Zero-Trust placement benchmarks under the Lumixora AI Placement Telemetry engine.
      </div>

      <div class="kpi-row">
        <div class="kpi-pill">
          <div class="kpi-l">Readiness Index</div>
          <div class="kpi-v" style="color: #6366f1;">${overallReadiness}%</div>
        </div>
        <div class="kpi-pill">
          <div class="kpi-l">Verified DSA</div>
          <div class="kpi-v" style="color: #059669;">${solvedCount} Solved</div>
        </div>
        <div class="kpi-pill">
          <div class="kpi-l">Aptitude Drills</div>
          <div class="kpi-v" style="color: #d97706;">${aptitudeCount} Benchmarks</div>
        </div>
        <div class="kpi-pill">
          <div class="kpi-l">Proctor Trust</div>
          <div class="kpi-v" style="color: #047857;">${trustScore}%</div>
        </div>
      </div>

      <div class="sig-row">
        <div style="text-align: center;">
          <div class="sig-line"></div>
          <div class="sig-title">Head, Training & Placement Cell (TPO)</div>
          <div style="font-size: 9px; color: #64748b;">GPREC Autonomous</div>
        </div>
        <div style="text-align: center;">
          <div style="display: inline-block; width: 60px; height: 60px; border-radius: 50%; border: 2px dashed #b45309; padding: 4px; font-size: 9px; color: #b45309; font-weight: 800; display: flex; align-items: center; justify-content: center; text-transform: uppercase;">SEAL</div>
          <div style="font-size: 10px; color: #78350f; font-weight: 700; margin-top: 4px;">OFFICIAL SEAL</div>
        </div>
        <div style="text-align: center;">
          <div class="sig-line"></div>
          <div class="sig-title">Principal & Dean Academics</div>
          <div style="font-size: 9px; color: #64748b;">GPREC Autonomous</div>
        </div>
      </div>

      <div class="meta-footer">
        <div>Credential Verification ID: ${esc(certId)}</div>
        <div>Verify At: ${esc(verificationUrl)}</div>
        <div>Date of Issue: ${esc(new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }))}</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0B0D21] to-[#1E1442] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-black tracking-tight">Verified Placement Readiness Credential</h3>
              <p className="text-[11px] text-slate-300 font-mono">ID: {certId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-amber-50/40">
          <div className="border-4 border-double border-amber-600/60 rounded-2xl p-6 sm:p-8 bg-white shadow-md text-center space-y-4 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-widest border border-amber-300">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>G. Pulla Reddy Engineering College (Autonomous)</span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Certificate of Placement Readiness & Algorithmic Proficiency
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-serif">
                {studentName}
              </h2>
              <div className="text-xs font-bold text-indigo-600 font-mono mt-0.5">
                {rollNo} • Department of {branch} (Autonomous)
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              This autonomous credential certifies that the scholar has completed extensive placement vector calibration, algorithmic problem solving, and zero-trust proctored assessments under GPREC placement standards.
            </p>

            {/* Verified Metrics Quad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Readiness</div>
                <div className="text-lg font-black text-purple-600 mt-0.5">{overallReadiness}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">DSA Solved</div>
                <div className="text-lg font-black text-cyan-600 mt-0.5">{solvedCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Aptitude Drills</div>
                <div className="text-lg font-black text-amber-600 mt-0.5">{aptitudeCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Proctor Trust</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">{trustScore}%</div>
              </div>
            </div>

            {/* Seals and Authority Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold px-4">
              <div>
                <div className="font-bold text-slate-900">Dr. G. Sreenivasulu</div>
                <div className="text-[10px] text-slate-400">Head, Training & Placement (TPO)</div>
              </div>
              <div className="w-12 h-12 rounded-full border border-amber-300 bg-amber-50 flex items-center justify-center text-[9px] font-black text-amber-800">
                SEAL
              </div>
              <div>
                <div className="font-bold text-slate-900">Dr. K. Sri Gowri</div>
                <div className="text-[10px] text-slate-400">Principal & Dean Academics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Verification Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyBadge}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{copiedBadge ? 'Badge Copied!' : 'Copy GitHub Badge'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintCertificatePdf}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Printable PDF</span>
            </button>

            <a
              href={linkedInCertUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Add to LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
