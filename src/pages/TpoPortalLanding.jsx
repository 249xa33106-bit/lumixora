import React from 'react';
import { 
  Building2, ShieldCheck, Lock, ArrowRight, ExternalLink, 
  Users, BarChart3, Award, FileSpreadsheet, CheckCircle2, 
  ChevronRight, Sparkles, GraduationCap, Briefcase, Globe
} from 'lucide-react';

export default function TpoPortalLanding({ onLoginClick }) {
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
                Training & Placement Cell • Dedicated Administrative Node (<span className="font-mono font-semibold text-[#0B132B]">tpo.lumixora.in</span>)
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
              
              {/* Domain & Accreditation Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FDF8EE] border border-[#F1E1B8] text-[11px] font-semibold uppercase tracking-wider text-[#9A7328]">
                <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Dedicated Institutional Gateway: tpo.lumixora.in</span>
              </div>

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

          {/* Right Hero Column: Telemetry Card */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h2 className="text-base font-bold text-[#0B132B]">Placement Cell Telemetry</h2>
                  <p className="text-xs text-[#64748B]">Official GPREC Verified Operations Data</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Live Sync
                </span>
              </div>

              {/* 2x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-4 pt-5">
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] font-medium text-[#64748B] uppercase">Annual Offers</p>
                  <p className="text-2xl font-bold text-[#0B132B] mt-1 font-mono">1,420+</p>
                  <p className="text-[10px] text-[#64748B] mt-1">Verified Placements</p>
                </div>
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] font-medium text-[#64748B] uppercase">Placement Rate</p>
                  <p className="text-2xl font-bold text-[#0B132B] mt-1 font-mono">94.2%</p>
                  <p className="text-[10px] text-[#64748B] mt-1">Eligible Cohort</p>
                </div>
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] font-medium text-[#64748B] uppercase">Highest Package</p>
                  <p className="text-2xl font-bold text-[#0B132B] mt-1 font-mono">₹44.0 LPA</p>
                  <p className="text-[10px] text-[#9A7328] font-semibold mt-1">Dream Tier CTC</p>
                </div>
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] font-medium text-[#64748B] uppercase">Active MOUs</p>
                  <p className="text-2xl font-bold text-[#0B132B] mt-1 font-mono">60+</p>
                  <p className="text-[10px] text-[#64748B] mt-1">Corporate Partners</p>
                </div>
              </div>
            </div>

            {/* Quick Officer Sign-in banner */}
            <div className="p-3.5 rounded-lg bg-[#0B132B] text-white flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold">Ready to manage placement drives?</p>
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
                Filter and audit 1,420+ scholars by CGPA, active backlogs, department, and AI readiness scores.
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
