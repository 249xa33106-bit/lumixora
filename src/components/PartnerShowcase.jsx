import React from 'react';
import { Building2, Award, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';

/**
 * PartnerShowcase:
 * Displays institutional partner college emblems and industry recruitment partners.
 */
export default function PartnerShowcase() {
  const INSTITUTION_PARTNERS = [
    {
      id: 'gprec',
      code: 'GPREC',
      name: 'G. Pulla Reddy Engineering College',
      status: 'Autonomous • NAAC A+',
      location: 'Kurnool, AP',
      badge: 'Premier Pilot Core',
      accent: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      initials: 'GPREC',
      sub: 'Est. 1985'
    },
    {
      id: 'ashoka',
      code: 'ASHOKA',
      name: "Ashoka Women's Engineering College",
      status: 'AICTE Approved • JNTUA',
      location: 'Kurnool, AP',
      badge: 'Women in Tech Node',
      accent: '#ec4899',
      bgGlow: 'rgba(236, 72, 153, 0.15)',
      initials: 'AWEC',
      sub: 'Est. 2008'
    },
    {
      id: 'rgukt',
      code: 'RGUKT',
      name: 'RGUKT RK Valley (IIIT)',
      status: 'State University • Premier',
      location: 'Idupulapaya, AP',
      badge: 'AI Research Node',
      accent: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
      initials: 'RGUKT',
      sub: 'IIIT Campus'
    },
    {
      id: 'aits',
      code: 'AITS',
      name: 'Annamacharya University (AITS)',
      status: 'UGC Autonomous • NAAC A',
      location: 'Rajampet, AP',
      badge: 'Engineering Hub',
      accent: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      initials: 'AITS',
      sub: 'Est. 1998'
    },
    {
      id: 'svce',
      code: 'SVCE',
      name: 'Sri Venkateswara College of Engg',
      status: 'Autonomous • JNTUA',
      location: 'Tirupati, AP',
      badge: 'Cloud SDE Cohort',
      accent: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      initials: 'SVCE',
      sub: 'Tirupati'
    },
    {
      id: 'necn',
      code: 'NECN',
      name: 'Narayana Engineering College',
      status: 'Autonomous • NBA Accredited',
      location: 'Nellore, AP',
      badge: 'Placement Cell',
      accent: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
      initials: 'NEC',
      sub: 'Nellore'
    },
    {
      id: 'mits',
      code: 'MITS',
      name: 'MITS DEEMED TO BE UNIVERSITY',
      status: 'Deemed University • NAAC A+',
      location: 'Madanapalle, AP',
      badge: 'AI & Research Campus',
      accent: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      initials: 'MITS',
      sub: 'Madanapalle'
    }
  ];

  const HIRING_PARTNERS = [
    { name: 'Amazon', role: 'SDE Intern & FTE', package: '₹14 - 28 LPA', tag: 'Dream Tier' },
    { name: 'TCS Digital / Ninja', role: 'Prime & Digital Cadre', package: '₹7.5 - 9.0 LPA', tag: 'Core Partner' },
    { name: 'Infosys SP / DSE', role: 'Specialist Programmer', package: '₹6.5 - 9.5 LPA', tag: 'Mass Elite' },
    { name: 'ThoughtWorks', role: 'Graduate Consultant', package: '₹11 - 16 LPA', tag: 'Product SDE' },
    { name: 'Zoho Corporation', role: 'Software Developer', package: '₹6.0 - 8.5 LPA', tag: 'Product Dev' },
    { name: 'Virtusa NeuralHack', role: 'Cloud & AI Engineer', package: '₹6.5 - 9.0 LPA', tag: 'Hackathon Track' },
    { name: 'Capgemini Exceller', role: 'Senior Analyst / Dev', package: '₹5.5 - 7.5 LPA', tag: 'Tech Roster' },
    { name: 'Cognizant GenC Next', role: 'Full Stack Engineer', package: '₹6.7 - 8.5 LPA', tag: 'Digital Cohort' }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#080d1e] border-y border-white/10 relative overflow-hidden select-none">
      {/* Background glow meshes */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>INSTITUTIONAL ECOSYSTEM & HIRING NETWORK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-sora tracking-tight">
            Our Partner Campuses & Hiring Network
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Autonomous engineering colleges and leading multinational tech recruiters connected through Lumixora's Career Intelligence Matrix.
          </p>
        </div>

        {/* 1. College Partners Grid with Custom 3D Identity Badges */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-400 px-1">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Accredited Engineering Institutions:
            </span>
            <span className="text-gray-500 font-mono">Active Pilot Campuses</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INSTITUTION_PARTNERS.map((col) => (
              <div 
                key={col.id}
                className="group p-5 rounded-3xl bg-[#0c1328]/90 border border-white/10 hover:border-cyan-400/50 hover:bg-[#101935] transition-all duration-300 shadow-xl flex items-start gap-4 relative overflow-hidden"
              >
                {/* Accent ambient corner glow */}
                <div 
                  className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: col.accent }}
                />

                {/* College Custom 3D Identity Emblem */}
                <div 
                  className="w-14 h-14 rounded-2xl p-2 shrink-0 flex flex-col items-center justify-center border shadow-lg relative group-hover:scale-105 transition-transform"
                  style={{ 
                    backgroundColor: '#0a0f20', 
                    borderColor: `${col.accent}60`,
                    boxShadow: `0 4px 16px ${col.accent}30`
                  }}
                >
                  <span className="text-sm font-black tracking-tighter text-white font-mono">{col.initials}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-cyan-300 -mt-0.5">{col.sub}</span>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span 
                      className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border"
                      style={{ 
                        color: col.accent, 
                        backgroundColor: `${col.accent}15`,
                        borderColor: `${col.accent}35`
                      }}
                    >
                      {col.badge}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{col.location}</span>
                  </div>

                  <h4 className="text-sm font-black text-white leading-snug group-hover:text-cyan-300 transition-colors">
                    {col.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {col.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Hiring & Placement Recruitment Partners */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-400 px-1">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Award className="w-4 h-4 text-purple-400" />
              Target Recruitment & Hiring Drives:
            </span>
            <span className="text-gray-500 font-mono">Tier-1 & MNC Standards</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {HIRING_PARTNERS.map((hire, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 hover:bg-white/[0.06] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300 uppercase tracking-wider font-mono">
                    {hire.tag}
                  </span>
                  <span className="text-xs font-black text-amber-300 font-mono">
                    {hire.package}
                  </span>
                </div>
                <h5 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors">
                  {hire.name}
                </h5>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  {hire.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Onboard College CTA Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-black text-white font-sora">
              Want to connect your college or university to Lumixora?
            </h4>
            <p className="text-xs text-gray-400">
              We provide free institutional onboarding, diagnostic student skill analytics, and custom syllabus alignment.
            </p>
          </div>
          <a
            href="mailto:lumixora.team@gmail.com?subject=Institution%20Partnership%20-%20Lumixora"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 shrink-0 flex items-center gap-1.5"
          >
            <span>Partner With Us</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
