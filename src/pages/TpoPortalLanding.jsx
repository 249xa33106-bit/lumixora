import React from 'react';
import { 
  Building2, ShieldCheck, Lock, ArrowRight, ExternalLink, 
  Users, BarChart3, Award, FileSpreadsheet, CheckCircle2, 
  ChevronRight, Sparkles, GraduationCap, Briefcase, Globe
} from 'lucide-react';

export default function TpoPortalLanding({ onLoginClick }) {
  // Real data verified from official GPREC Training & Placement Cell records (gprec.ac.in/placement-record/ & NIRF)
  const REAL_GPREC_METRICS = [
    { label: 'ANNUAL OFFERS', value: '643', detail: '2025 Graduating Batch', sub: '574 in 2024 • 1,457 Peak Record' },
    { label: 'AVERAGE PACKAGE', value: '₹4.82 LPA', detail: 'Institutional Mean', sub: 'NIRF Median: ₹4.36 LPA' },
    { label: 'HIGHEST PACKAGE', value: '₹23.0 LPA', detail: 'Wayfair Global Tech', sub: 'On-Campus CTC (Off: ₹32.5 LPA)' },
    { label: 'TOP RECRUITER OFFERS', value: '114 Offers', detail: 'TCS (Digital & Prime)', sub: 'Accenture: 105 Offers' }
  ];

  const REAL_DRIVE_TRACKS = [
    { company: 'Wayfair Global Technology', ctc: '₹23.00 LPA', tag: 'Highest On-Campus CTC' },
    { company: 'Ciena Networking Systems', ctc: '₹11.95 LPA', tag: 'Core Product Cadre' },
    { company: 'IBM & Appyhigh', ctc: '₹11.00 LPA', tag: 'Tier-1 Tech Track' },
    { company: 'TCS Digital & Prime', ctc: '₹7.50 - 9.00 LPA', tag: '114 Total Offers' },
    { company: 'Accenture Advanced (AASE)', ctc: '₹4.50 - 6.50 LPA', tag: '105 Total Offers' },
    { company: 'Zelis & LTI Mindtree', ctc: '₹4.05 - 4.80 LPA', tag: '61 Combined Offers' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B132B] font-sans selection:bg-[#0B132B] selection:text-white flex flex-col select-none relative overflow-x-hidden antialiased">
      
      {/* ─── INSTITUTIONAL TOP BAR ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Institution Identity */}
          <div className="flex items-center gap-3.5">
            <img 
              src="/gprec_logo.png" 
              alt="G. Pulla Reddy Engineering College Official Crest" 
              className="w-12 h-12 object-contain rounded-lg p-1 bg-white border border-[#E2E8F0] shadow-xs shrink-0" 
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#0B132B]">
                  G. PULLA REDDY ENGINEERING COLLEGE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#FDF8EE] text-[#9A7328] border border-[#F1E1B8]">
                  Autonomous • Estd. 1985
                </span>
              </div>
              <p className="text-[11px] text-[#475569] font-medium tracking-normal truncate">
                Training & Placement Cell • Dedicated Administrative Node 
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://gprec.lumixora.in"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#0B132B] border border-[#CBD5E1] text-xs font-semibold shadow-xs transition-colors cursor-pointer items-center gap-1.5"
            >
              <span>Scholar Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
            </a>
            <button
              onClick={() => onLoginClick && onLoginClick('officer')}
              className="px-4 py-2 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>TPO & Faculty Sign-In</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-14 w-full">
        
        {/* ─── HERO SECTION ─── */}
        <section className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Column */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-5xl font-bold text-[#0B132B] tracking-tight leading-[1.15]">
                Training & Placement Cell Operations Command
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal max-w-xl">
                Official institutional administration console for the Dean of Corporate Relations & Placements, Assistant Placement Officers, and Department Placement Coordinators (CSM, CSE, ECE, EEE, MECH, CIVIL).
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onLoginClick && onLoginClick('officer')}
                className="px-6 py-3.5 rounded-lg bg-[#0B132B] hover:bg-[#152042] text-white font-semibold text-xs tracking-wide shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2.5"
              >
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>Enter TPO Operations Suite</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
              
              <a
                href="https://gprec.lumixora.in"
                className="px-5 py-3.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#0B132B] border border-[#CBD5E1] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Scholar Portal (gprec.lumixora.in)</span>
              </a>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-xs text-[#64748B] pt-2 border-t border-[#E2E8F0]">
              <ShieldCheck className="w-4 h-4 text-[#0B132B]" />
              <span>Strictly restricted to authorized GPREC Placement Officers and Coordinators.</span>
            </div>
          </div>

          {/* Right Hero Column: Telemetry Card with REAL GPREC DATA */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                <div>
                  <h2 className="text-base font-bold text-[#0B132B]">Placement Cell Telemetry</h2>
                  <p className="text-xs text-[#64748B]">Official GPREC Verified Operations Data (gprec.ac.in)</p>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#FDF8EE] text-[#9A7328] border border-[#F1E1B8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  Active Drive Session
                </span>
              </div>

              {/* 2x2 Metric Grid with REAL GPREC Statistics */}
              <div className="grid grid-cols-2 gap-3.5">
                {REAL_GPREC_METRICS.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">{m.label}</p>
                    <p className="text-xl font-bold text-[#0B132B] mt-0.5 font-mono">{m.value}</p>
                    <p className="text-[11px] text-[#0B132B] font-medium mt-0.5 truncate">{m.detail}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5 truncate">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Verified Campus Placement Drives */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Current Campus Placement Tracks
                  </p>
                  <span className="text-[10px] font-mono text-[#9A7328] font-bold">
                    Official gprec.ac.in
                  </span>
                </div>
                
                <div className="space-y-1.5 text-xs">
                  {REAL_DRIVE_TRACKS.slice(0, 3).map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="font-semibold text-[#0B132B] truncate">{d.company}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-[#9A7328] shrink-0">{d.ctc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Officer Sign-in banner */}
            <div className="p-3.5 rounded-lg bg-[#0B132B] text-white flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold">TPO Administrative Suite</p>
                <p className="text-[10px] text-slate-300">Sign in with official officer credentials</p>
              </div>
              <button
                onClick={() => onLoginClick && onLoginClick('officer')}
                className="px-3 py-1.5 rounded bg-white text-[#0B132B] hover:bg-slate-100 text-xs font-bold shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>

        {/* ─── MODULES OVERVIEW ─── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E2E8F0] pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A7328]">
                Institutional Architecture
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B132B] tracking-tight">
                Core Operations Modules
              </h2>
            </div>
            <p className="text-xs text-[#64748B]">
              Integrated TPO Management Suite • Real-time synchronization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1 */}
            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0B132B]">
                <Users className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="text-sm font-bold text-[#0B132B]">Student Placement Database</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Filter and audit 643+ graduating scholars by CGPA, active backlogs, department, and AI readiness scores.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0B132B]">
                <Briefcase className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="text-sm font-bold text-[#0B132B]">Campus Recruitment Drives</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Orchestrate company-specific drive tracks, online assessments, and interview round clearances in real time.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0B132B]">
                <BarChart3 className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="text-sm font-bold text-[#0B132B]">NIRF & Accreditation Analytics</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Generate instant verified CSV exports and NIRF compliance reports aligned with AICTE and NBA standards.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0B132B]">
                <GraduationCap className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="text-sm font-bold text-[#0B132B]">Department Coordinators</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Dedicated interfaces for CSM, CSE, ECE, EEE faculty coordinators to monitor and recommend candidate cohorts.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* ─── INSTITUTIONAL FOOTER ────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-8 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/gprec_logo.png" alt="GPREC" className="w-7 h-7 object-contain" />
            <p className="font-medium text-[#0B132B]">
              G. Pulla Reddy Engineering College (Autonomous), Kurnool • T&P Cell
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>TPO Node: <strong className="text-[#0B132B]">tpo.lumixora.in</strong></span>
            <span>•</span>
            <a href="https://gprec.lumixora.in" className="hover:text-[#0B132B] hover:underline">
              gprec.lumixora.in
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
