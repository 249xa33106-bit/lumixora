import React, { useState } from 'react';
import {
  FileText, Download, ExternalLink, ShieldCheck, BookOpen,
  Sparkles, Layers, CheckCircle2, Bookmark, Code, Eye,
  Copy, Check, X, Shield, Award, Terminal, Palette, Share2
} from 'lucide-react';

export default function NexusResourceHub() {
  // Modal State for Viewing / Downloading Resources
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [copiedModalText, setCopiedModalText] = useState(false);

  // Real, comprehensive resource definitions
  const resourceCategories = [
    {
      id: 'brand_assets',
      categoryNum: '01',
      title: 'Official Brand Assets & Media Kit',
      description: 'Logos, 3D emblems, typography specifications, and Figma design components.',
      items: [
        {
          id: 'master_emblem',
          name: 'Lumixora Master Emblem (SVG & Vector PNG)',
          size: 'Clean Vector PNG',
          type: 'Design Asset',
          directDownloadUrl: '/lumixora_clean_logo_only.png',
          docTitle: 'Lumixora Official Master Emblem & Logo Specifications',
          docContent: `# LUMIXORA BRAND SPECIFICATIONS • OFFICIAL EMBLEM
---
**Organization**: Lumixora (A Product of Vyomra)
**Asset**: Official Master Emblem & Typography Mark
**Format**: Vector PNG & Clean Dark Canvas SVG
**Download Path**: /lumixora_clean_logo_only.png

---

### Usage Guidelines:
1. **Primary Canvas**: The Lumixora emblem is engineered for dark backgrounds (#050811, #090d18, or pure black).
2. **Clear Space**: Maintain minimum clear space equal to 50% of the emblem width on all sides.
3. **Prohibited Alterations**:
   - Do not skew, distort, or re-color the signature neon cyan/purple chromatic gradient.
   - Do not place on low-contrast busy photo backgrounds without a backdrop blur container.
4. **Primary Color Hex Codes**:
   - Signature Cyan: #00F0FF (Neon Glow: rgba(0, 240, 255, 0.35))
   - Intelligence Violet: #8B5CF6
   - Void Background: #050811
`
        },
        {
          id: 'design_tokens',
          name: 'Brand Colors & Design Tokens (Inter / Manrope)',
          size: 'Design System Spec',
          type: 'Guidelines',
          docTitle: 'Lumixora Design Tokens & Typography Architecture',
          docContent: `# LUMIXORA DESIGN SYSTEM SPECIFICATION
## Design Tokens & Typography Architecture • v2.6
---
**Design Philosophy**: Dark, Futuristic, Apple-inspired clarity meets high-octane engineering telemetry.

---

### 1. Color Palette Tokens
| Token Name | Hex Code | RGB | Purpose |
| :--- | :--- | :--- | :--- |
| **Surface Void** | \`#050811\` | rgb(5, 8, 17) | Global app background |
| **Card Surface** | \`#090d18\` | rgb(9, 13, 24) | Component cards & drawers |
| **Card Elevate** | \`#0f1424\` | rgb(15, 20, 36) | Hover & active state cards |
| **Border Subtle** | \`rgba(255, 255, 255, 0.08)\` | - | Primary card borders |
| **Cyan Pulse** | \`#00F0FF\` | rgb(0, 240, 255) | Primary CTAs, active highlights |
| **Violet Intelligence** | \`#8B5CF6\` | rgb(139, 92, 246) | Secondary badges & AI features |
| **Emerald Pass** | \`#10B981\` | rgb(16, 185, 129) | Approved status & success pills |
| **Amber Warning** | \`#F59E0B\` | rgb(245, 158, 11) | In-progress & deadline alerts |
| **Rose Blocker** | \`#F43F5E\` | rgb(244, 63, 94) | S1/S2 Defects & revision flags |

### 2. Typography Rules
- **Display Headings**: \`Manrope\`, weights 800 (Bold) to 900 (Black).
- **Body & Copy**: \`Inter\`, weights 400 (Regular), 500 (Medium), 600 (SemiBold).
- **Code & Telemetry**: \`JetBrains Mono\`, weights 500 to 700.

### 3. Glassmorphic Styling Classes (Tailwind CSS)
- Card Container: \`bg-[#090d18] border border-white/10 rounded-3xl shadow-xl\`
- Neon Glow Highlight: \`shadow-lg shadow-cyan-500/20 border-cyan-500/40\`
`
        },
        {
          id: 'social_carousel',
          name: 'Official Social Carousel Template (1080x1350 Figma)',
          size: 'Content Production Guide',
          type: 'Template',
          docTitle: 'Official Social Carousel Template & Slide Architecture',
          docContent: `# LUMIXORA 1080x1350 SOCIAL CAROUSEL ARCHITECTURE
## Multi-Slide High-Converting Framework for LinkedIn & Instagram
---
**Format**: 1080px (Width) x 1350px (Height) • 4:5 Aspect Ratio
**Target Audience**: Engineering Students, Campus Leaders, Placement Officers

---

### Slide-by-Slide Blueprint:
1. **Slide 01 (The Hook)**:
   - Big bold headline in 48pt+ font (e.g. "How Top Tier-1 Engineers Clear Tech Interviews in 60 Days").
   - Lumixora master badge at top right.
   - High-contrast visual emblem or code snippet.
2. **Slide 02 (The Industry Bottleneck)**:
   - Identify common student pain points (isolated LeetCode grinding without voice mock practice).
   - Problem statement in simple, punchy bullets.
3. **Slide 03 (The Solution Blueprint)**:
   - Introduce Lumixora AI Placement Commander and SpeakVerse.
   - Showcase authentic UI preview or architecture flow.
4. **Slide 04 (Deep Technical Breakdown)**:
   - Step-by-step methodology (e.g. past university exam papers + company-specific patterns).
5. **Slide 05 (Verifiable Proof & Call to Action)**:
   - Free access callout to \`https://lumixora.in/\`.
   - "Save this post & tag an engineering scholar."
`
        }
      ]
    },
    {
      id: 'policies',
      categoryNum: '02',
      title: 'Internship Policies & Code of Conduct',
      description: 'Guidelines governing deliverable submission, peer respect, academic integrity, and confidential codebases.',
      items: [
        {
          id: 'charter_ethics',
          name: 'Lumixora Batch 01 Internship Charter & Ethics',
          size: 'Official Policy Document',
          type: 'Policy',
          docTitle: 'Lumixora Batch 01 Internship Charter & Code of Ethics',
          docContent: `# LUMIXORA BATCH 01 INTERNSHIP CHARTER & CODE OF CONDUCT
---
**Executive Lead**: Shaik Sowban (Founder & Chief Architect)
**Cohort Period**: 15 November 2026 – 30 December 2026 (6-Week Intensive)
**Authorized Institution**: G. Pulla Reddy Engineering College & Partner Campuses

---

### 1. The Core Manifesto
Lumixora is building the world's most advanced Student Operating System. Every intern scholar represents the vanguard of engineering, research, marketing, and creative excellence.

### 2. Standards of Execution:
- **Zero-Plagiarism Mandate**: All submissions (code, QA plans, research dossiers, video storyboards) must represent original, verifiable output. Direct copying without attribution will result in immediate disqualification.
- **Confidentiality & Code Security**: Internal roadmaps, institutional partnership negotiations, and unpublished platform APIs must remain strictly confidential.
- **Peer Collaboration**: Scholars must support teammates across Software Testing, Research, Growth Marketing, and Content Creation tracks.
- **Founder Directives**: Sprint priorities announced by Founder Shaik Sowban must be reviewed and incorporated into weekly milestone planning.
`
        },
        {
          id: 'sprint_rubric',
          name: 'Weekly Sprint Deadlines & Grading Rubric',
          size: 'Standardized Rubric',
          type: 'Rubric',
          docTitle: 'Weekly Sprint Evaluation Rubric & Quality Criteria',
          docContent: `# OFFICIAL LUMIXORA SPRINT EVALUATION RUBRIC
## Standardized 4-Pillar Scoring Criteria (100 Points Total)
---
**Scored By**: Founder Shaik Sowban & Technical Leads
**Requirement for Certificate Issuance**: Exactly or greater than 12 approved deliverables across 6 sprints.

---

### The 4 Scoring Pillars:
1. **Technical Rigor & Domain Depth (30 Points)**:
   - Systematic boundary testing, accurate edge case isolation, or deep analytical methodology.
   - Adherence to standard startup software and research conventions.
2. **Verifiable Proof & Artifacts (30 Points)**:
   - Valid accessible Google Drive folder, public GitHub repository, Loom video walkthrough, or PDF dossier.
   - Zero broken or private links.
3. **Documentation & Professional Polish (20 Points)**:
   - Adherence to the official Lumixora Deliverable Template.
   - Clean markdown formatting, executive summaries, and organized tables.
4. **Velocity & Execution Adherence (20 Points)**:
   - Timely submission within the weekly Sunday 23:59 IST sprint window.
   - Rapid iteration when revisions are requested.

### Evaluation Tiers:
- **90–100 Points**: Elite Distinction (Qualifies for Founder Executive Letter of Recommendation).
- **75–89 Points**: Standard Pass (Approved for milestone credit).
- **Below 75 Points**: Revision Required (Must address founder feedback within 48 hours).
`
        },
        {
          id: 'lor_criteria',
          name: 'Letter of Recommendation (LOR) Eligibility Criteria',
          size: 'Executive Accreditation',
          type: 'Accreditation',
          docTitle: 'Executive Letter of Recommendation (LOR) Criteria',
          docContent: `# LUMIXORA FOUNDER LETTER OF RECOMMENDATION (LOR)
## Official Executive Accreditation Standard • Batch 01
---
**Issuing Authority**: Shaik Sowban, Founder & Chief Architect, Lumixora
**Verification Portal**: https://lumixora.in/verify?id=[INTERN-ID]

---

### Mandatory Eligibility Criteria:
To receive an official, personalized Letter of Recommendation endorsed by Founder Shaik Sowban:

1. **Sprint Milestone Completion**:
   - Minimum of **12 approved deliverables** across the 6-week cohort (2 tasks per week).
2. **Cumulative Performance Threshold**:
   - Overall cohort evaluation index of **85% or higher** across all evaluated rubrics.
3. **Capstone Excellence**:
   - Successful completion and defense of the Week 06 Capstone release in your track.
4. **Active Async Presence**:
   - Attendance or reviewed engagement with cohort live standups and technical orientation sessions.

### Deliverable Accreditation:
Each LOR is backed by a permanent cryptographic QR record on the Lumixora blockchain-style verification ledger.
`
        }
      ]
    },
    {
      id: 'templates',
      categoryNum: '03',
      title: 'Sprint Deliverable Templates',
      description: 'Standardized document structures to accelerate your weekly mission submissions.',
      items: [
        {
          id: 'qa_template',
          name: 'Master QA Test Plan & Bug Matrix Template',
          size: 'Standardized Markdown',
          type: 'QA Template',
          docTitle: 'Master QA Test Plan & Bug Matrix Scaffold',
          docContent: `# LUMIXORA QUALITY ASSURANCE SPRINT DOSSIER
## Master Test Plan & S1-S4 Severity Defect Matrix
---
**Module Under Test**: [e.g. Authentication & Code Arena Viewports]
**QA Engineer**: [Name] (ID: [Intern-ID])
**Environment**: Chromium 130, WebKit iOS 18, Gecko Android 14
**Date**: [Date]

---

### 1. Test Strategy & Scope
- Scope Included: Authentication boundary tests, token expiration, responsive breakpoints (375px, 768px, 1440px).
- Out of Scope: Third-party payment gateway mock endpoints.

### 2. Feature Verification Checklist
| Test Case ID | Test Scenario | Steps to Execute | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC-01 | Google OAuth Redirection | 1. Click Google Login<br>2. Select account | Token stored, redirects to dashboard | PASSED |
| TC-02 | Code Editor Breakpoint | 1. Resize to 375px<br>2. Type in editor | No layout overflow or clipped text | PASSED |

### 3. S1-S4 Production Defect Registry
| Defect ID | Severity | Module | Description & Reproduction | Proposed Fix |
| :--- | :--- | :--- | :--- | :--- |
| BUG-01 | S2 Critical | Auth | Token expiry clears active tab without warning | Add token refresh interceptor |

### 4. Sign-Off Attestation
- Total Test Cases Executed: [Number]
- Pass Rate: [e.g. 96%]
`
        },
        {
          id: 'research_framework',
          name: 'Market Moat & Competitor Intelligence Framework',
          size: 'Research Framework',
          type: 'Research Template',
          docTitle: 'Market Moat & Competitor Intelligence Framework',
          docContent: `# LUMIXORA PRODUCT INTELLIGENCE WHITE-PAPER
## Competitive Moat & Student Persona Analysis Framework
---
**Research Track**: Competitive Moats & Institutional Strategy
**Author**: [Intern Name] (ID: [Intern-ID])
**Target Market**: Engineering Undergraduates (Tier-2 & Tier-3 Colleges)

---

### 1. Executive Problem Statement
Why do existing EdTech platforms fail engineering students preparing for technical placements?

### 2. Competitor Benchmarking Matrix
| Platform | Core Strength | Critical Weakness | Lumixora Moat Advantage |
| :--- | :--- | :--- | :--- |
| LeetCode | Massive problem volume | High cognitive barrier; zero personalized syllabus mapping | Company past papers matched directly to university curriculum |
| PrepInsta | Placement focus in India | Pre-recorded static videos; no live conversational interview simulator | SpeakVerse real-time Web Audio AI voice interviewer |
| Unstop | Broad hackathons | Cluttered UI; lacks integrated Notes & 3D visual learning | Lumina 3D interactive classroom loops |

### 3. Field Survey Findings (Student Interviews)
- Sample Size: 25+ Engineering Students
- Top Placement Anxiety Trigger: Technical mock interview freeze-up (84% of surveyed scholars).
- Recommendations for Q1 Roadmap: 
`
        },
        {
          id: 'marketing_funnel',
          name: 'Campus Ambassador Growth Funnel Spreadsheet',
          size: 'Growth Marketing Spec',
          type: 'Marketing Template',
          docTitle: 'Campus Ambassador Growth Funnel & Campaign Tracker',
          docContent: `# LUMIXORA CAMPUS GROWTH FUNNEL SPREADSHEET
## Campus Ambassador Referral & Viral Loop Tracking
---
**Ambassador**: [Intern Name] (Ambassador Referral Code: [LMX-Ref])
**Campus Focus**: [e.g. G. Pulla Reddy Engineering College, Rayalaseema Region]
**Target Milestone**: 100 Verified Student Signups

---

### 1. Growth Channel Breakdown
| Channel | Target Audience | Content Format | Target Reach | Weekly Cadence |
| :--- | :--- | :--- | :--- | :--- |
| WhatsApp Student Groups | 3rd & 4th Year CSE/ECE | Placement prep teaser + link | 500+ Scholars | 3x Weekly |
| LinkedIn Pulse | Engineering Job Seekers | Technical interview carousel | 2,000+ Impressions | 2x Weekly |
| Campus Coding Clubs | Competitive coders | Mock interview challenges | 150+ Direct Participants | Weekly Blitz |

### 2. Funnel Attribution Metrics
- **Top of Funnel (Impressions / Clicks)**: [Tracked Clicks via https://lumixora.in/?ref=ID]
- **Mid Funnel (Free Trial / Placement Radar Tests)**: [Student Test Completions]
- **Bottom of Funnel (Active Squad Members)**: [Regular Daily Users]

### 3. Campaign Attribution Notes:
<!-- Document key wins, best-performing copy hooks, and campus feedback -->
`
        }
      ]
    }
  ];

  const handleDownloadDoc = (item) => {
    if (item.directDownloadUrl) {
      const a = document.createElement('a');
      a.href = item.directDownloadUrl;
      a.download = item.name.replace(/[^a-zA-Z0-9_-]/g, '_');
      a.click();
      return;
    }
    const blob = new Blob([item.docContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.id}_Lumixora_Official.md`;
    a.click();
  };

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
            Everything you need to deliver production-grade work: official brand specifications, sprint deliverable templates, internship charter, and Founder evaluation rubrics.
          </p>
        </div>
      </div>

      {/* ── RESOURCE CARDS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {resourceCategories.map((cat, idx) => (
          <div key={cat.id} className="rounded-3xl bg-[#0a0e19] border border-white/10 p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Category {cat.categoryNum}</span>
              <h3 className="text-base font-bold text-white">{cat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-white/5">
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {item.type} • {item.size}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* View Modal Button */}
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Inspect / Read Document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownloadDoc(item)}
                      className="p-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all cursor-pointer shadow-sm"
                      title="Download Resource"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL: INTERACTIVE RESOURCE VIEWER & DOWNLOADER ── */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0b0f1c] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {activeModalItem.docTitle || activeModalItem.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-mono">
                    {activeModalItem.type} • Verified Official Specification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content Box */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 font-mono text-[11px] text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-80 custom-scrollbar leading-relaxed">
              {activeModalItem.docContent}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 flex-wrap">
              <span className="text-[11px] text-gray-400 font-mono">
                Official Lumixora Resource • Batch 01
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeModalItem.docContent);
                    setCopiedModalText(true);
                    setTimeout(() => setCopiedModalText(false), 2500);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer transition-all"
                >
                  {copiedModalText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedModalText ? 'Copied Scaffold!' : 'Copy Document Markdown'}</span>
                </button>

                <button
                  onClick={() => handleDownloadDoc(activeModalItem)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
