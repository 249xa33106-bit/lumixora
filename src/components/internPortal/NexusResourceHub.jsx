import React from 'react';
import {
  FileText, Download, ExternalLink, ShieldCheck, BookOpen,
  Sparkles, Layers, CheckCircle2, Bookmark, Code
} from 'lucide-react';

export default function NexusResourceHub() {
  const resourceCategories = [
    {
      title: 'Official Brand Assets & Media Kit',
      description: 'Logos, 3D emblems, typography specifications, and Figma design components.',
      items: [
        { name: 'Lumixora Master Emblem (SVG & Vector PNG)', size: '2.4 MB', type: 'Design Asset', url: '/lumixora_clean_logo_only.png' },
        { name: 'Brand Colors & Design Tokens (Inter / Manrope)', size: 'PDF Spec', type: 'Guidelines', url: '#' },
        { name: 'Official Social Carousel Template (1080x1350 Figma)', size: 'Figma Link', type: 'Template', url: '#' }
      ]
    },
    {
      title: 'Internship Policies & Code of Conduct',
      description: 'Guidelines governing deliverable submission, peer respect, academic integrity, and confidential codebases.',
      items: [
        { name: 'Lumixora Batch 01 Internship Charter & Ethics', size: 'PDF Document', type: 'Policy', url: '#' },
        { name: 'Weekly Sprint Deadlines & Grading Rubric', size: 'PDF Guide', type: 'Rubric', url: '#' },
        { name: 'Letter of Recommendation (LOR) Eligibility Criterion', size: 'Executive Summary', type: 'Accreditation', url: '#' }
      ]
    },
    {
      title: 'Sprint Deliverable Templates',
      description: 'Standardized document structures to accelerate your weekly mission submissions.',
      items: [
        { name: 'Master QA Test Plan & Bug Matrix Template', size: 'Google Sheets', type: 'QA Template', url: '#' },
        { name: 'Market Moat & Competitor Intelligence Framework', size: 'Google Docs', type: 'Research Template', url: '#' },
        { name: 'Campus Ambassador Growth Funnel Spreadsheet', size: 'Google Sheets', type: 'Marketing Template', url: '#' }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ── HEADER ── */}
      <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-cyan-400">
              OFFICIAL KNOWLEDGE REPOSITORY
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs font-bold text-slate-300">Brand, Templates & Policies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Intern Resource Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Everything you need to deliver production-grade work: brand assets, deliverable templates, policies, and Capstone rubrics.
          </p>
        </div>
      </div>

      {/* ── RESOURCE CARDS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {resourceCategories.map((cat, idx) => (
          <div key={idx} className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Category 0{idx + 1}</span>
              <h3 className="text-base font-bold text-white">{cat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/5">
              {cat.items.map((item, iIdx) => (
                <div key={iIdx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{item.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{item.type} • {item.size}</span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-cyan-400 transition-all shrink-0"
                    title="Download / View Asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
