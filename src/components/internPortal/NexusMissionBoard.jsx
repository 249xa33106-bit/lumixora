import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2, Circle, AlertCircle, Clock, Calendar, FileText, Send,
  ArrowRight, Sparkles, Layers, ShieldCheck, ChevronRight, Check,
  ExternalLink, RotateCcw, AlertTriangle, Eye, HelpCircle, Download,
  Copy, X, Lock, Flame, Compass, Target, BookmarkCheck
} from 'lucide-react';

export default function NexusMissionBoard({
  session,
  activeRole,
  onNavigateTab,
  allottedTasks = [],
  submissions = [],
  onOpenSubmitModal
}) {
  // ── SPRINT ROADMAP (Weeks 1 to 6) ──
  const SPRINT_ROADMAP = [
    {
      week: 'Week 01',
      num: 1,
      title: 'Architecture & Strategy',
      sub: 'Active Sprint',
      startDate: '15 Nov 2026',
      endDate: '29 Nov 2026',
      status: 'active',
      desc: 'Foundation sprint establishing core technical plans, competitive baselines, and quality criteria.'
    },
    {
      week: 'Week 02',
      num: 2,
      title: 'Cross-Platform & Loops',
      sub: 'Starts 30 Nov',
      startDate: '30 Nov 2026',
      endDate: '06 Dec 2026',
      status: 'upcoming',
      desc: 'Mobile viewport testing, responsive breakpoints, student referral viral loops and campaign funnels.'
    },
    {
      week: 'Week 03',
      num: 3,
      title: 'Automated Test Regressions',
      sub: 'Starts 07 Dec',
      startDate: '07 Dec 2026',
      endDate: '13 Dec 2026',
      status: 'locked',
      desc: 'Postman/Newman API automation, deep competitor moat benchmarking, and qualitative user interviews.'
    },
    {
      week: 'Week 04',
      num: 4,
      title: 'Telemetry & Institutional B2B',
      sub: 'Starts 14 Dec',
      startDate: '14 Dec 2026',
      endDate: '20 Dec 2026',
      status: 'locked',
      desc: 'College TPO value frameworks, production error monitoring, and multi-channel editorial scaling.'
    },
    {
      week: 'Week 05',
      num: 5,
      title: 'Capstone Releases',
      sub: 'Starts 21 Dec',
      startDate: '21 Dec 2026',
      endDate: '27 Dec 2026',
      status: 'locked',
      desc: 'Production release testing, live student campus drives, and verified bug bounty resolution.'
    },
    {
      week: 'Week 06',
      num: 6,
      title: 'Graduation & Portfolio',
      sub: 'Starts 28 Dec',
      startDate: '28 Dec 2026',
      endDate: '30 Dec 2026',
      status: 'locked',
      desc: 'Founder evaluation, executive letters of recommendation, and cryptographic certificate issuance.'
    }
  ];

  const [selectedSprintWeek, setSelectedSprintWeek] = useState('Week 01');

  // ── DYNAMIC LIVE SPRINT CUTOFF COUNTDOWN (Target: Sunday 23:59:59 IST) ──
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      // Next Sunday 23:59:59
      const target = new Date();
      const currentDay = now.getDay();
      const daysUntilSunday = (7 - currentDay) % 7;
      target.setDate(now.getDate() + (daysUntilSunday === 0 && now.getHours() >= 23 && now.getMinutes() >= 59 ? 7 : daysUntilSunday));
      target.setHours(23, 59, 59, 999);

      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── TEMPLATE GENERATOR MODAL STATE ──
  const [templateModalTask, setTemplateModalTask] = useState(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Weekly missions pool (3 curated missions per department for Week 01)
  const DEPARTMENT_TASK_POOLS = {
  "marketing": [
    {
      "id": "mk-w1-t1",
      "department": "marketing",
      "week": "Week 01",
      "title": "Brand Positioning & Student Communication Style Guide",
      "tagline": "Define core messaging pillars, taglines & tone of voice.",
      "description": "Analyze Lumixora placement and learning solutions. Create a comprehensive brand guide defining value propositions for students, campus leaders, and TPOs. Establish communication rules for social posts, posters, and campus engagement.",
      "deliverables": "PDF Brand Guide or Google Drive Slides deck (10+ slides).",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Brand Architecture",
        "Copywriting",
        "Positioning"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "mk-w1-t2",
      "department": "marketing",
      "week": "Week 01",
      "title": "Campus Ambassador Network Blueprint & Referral Playbook",
      "tagline": "Design viral student loop mechanics and ambassador rewards.",
      "description": "Develop an operational playbook for recruiting and motivating student campus leads across engineering institutions. Detail viral referral incentive models, leaderboard dynamics, and week-by-week sprint targets.",
      "deliverables": "PDF Strategy Playbook or Google Docs operational brief.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Growth Marketing",
        "Community Loops",
        "GTM Strategy"
      ],
      "dueDate": "2026-11-29",
      "templateType": "playbook"
    },
    {
      "id": "mk-w1-t3",
      "department": "marketing",
      "week": "Week 01",
      "title": "30-Day Multi-Channel Content & Campaign Launch Funnel",
      "tagline": "Plan editorial calendar across LinkedIn, Instagram and WhatsApp channels.",
      "description": "Map out 30 structured content pieces targeting final-year and pre-final year engineering students facing placement drives. Include hooks, visual formats (carousels, reels, infographics), and CTA funnels.",
      "deliverables": "Google Drive Spreadsheet or Notion / Markdown calendar.",
      "estimatedHours": "5-7 hours",
      "skills": [
        "Content Strategy",
        "Funnel Optimization",
        "Audience Analytics"
      ],
      "dueDate": "2026-11-29",
      "templateType": "calendar"
    },
    {
      "id": "mk-w2-t1",
      "department": "marketing",
      "week": "Week 02",
      "title": "Student Viral Referral Loop Optimization & Incentive Architecture",
      "tagline": "Fine-tune peer-to-peer referral mechanisms to maximize K-factor.",
      "description": "Design frictionless invitation mechanics within Lumixora. Map the user journey from receiving a peer link to completing an AI mock test, measuring conversion bottlenecks and proposing reward tiers.",
      "deliverables": "PDF Viral Loop Blueprint + User Journey Flowchart.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Viral Growth",
        "K-Factor Optimization",
        "Funnel Metrics"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "mk-w2-t2",
      "department": "marketing",
      "week": "Week 02",
      "title": "WhatsApp Community & Student Club Growth Strategy (500+ Leads)",
      "tagline": "Structure regional student developer squads and community onboarding.",
      "description": "Create an end-to-end framework for launching localized WhatsApp/Telegram study squads across colleges. Detail daily coding problem prompts, peer discussion norms, and squad leader incentives.",
      "deliverables": "Operational Community Manual + 14-day Engagement Schedule.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Community Building",
        "Peer Engagement",
        "Retention"
      ],
      "dueDate": "2026-12-06",
      "templateType": "playbook"
    },
    {
      "id": "mk-w2-t3",
      "department": "marketing",
      "week": "Week 02",
      "title": "Executive Personal Branding Playbook for Student Leaders",
      "tagline": "Enable engineering campus leads to build authority on LinkedIn.",
      "description": "Craft high-converting LinkedIn post templates and carousel structures for campus leads. Focus on sharing placement preparation breakthroughs, coding milestones, and authentic platform reviews.",
      "deliverables": "Figma/Canva Deck with 10 Reusable Post Templates + Copy Guide.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Personal Branding",
        "LinkedIn Organic",
        "Content Hooks"
      ],
      "dueDate": "2026-12-06",
      "templateType": "calendar"
    },
    {
      "id": "mk-w3-t1",
      "department": "marketing",
      "week": "Week 03",
      "title": "Placement Season Campus Conversion Funnel & Lead Magnets",
      "tagline": "Create free high-value prep cheat sheets driving student acquisition.",
      "description": "Identify highest-demand interview topics (SQL queries, Dynamic Programming, OS Viva). Create downloadable PDF lead magnets gated by Lumixora student signup.",
      "deliverables": "2 High-Yield PDF Lead Magnets + Landing Page Copy.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Lead Generation",
        "Conversion Rate Optimization",
        "Copywriting"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "mk-w3-t2",
      "department": "marketing",
      "week": "Week 03",
      "title": "Institutional Outreach Campaign Targeting 20 Engineering Colleges",
      "tagline": "Formulate cold outreach sequences for department heads and student reps.",
      "description": "Draft personalized email sequences, WhatsApp pitch decks, and follow-up cadences targeting college computer science departments, training coordinators, and coding clubs.",
      "deliverables": "Outreach Playbook + 3-Stage Email Copy Sequence.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Institutional B2B",
        "Cold Outreach",
        "Relationship Building"
      ],
      "dueDate": "2026-12-13",
      "templateType": "playbook"
    },
    {
      "id": "mk-w3-t3",
      "department": "marketing",
      "week": "Week 03",
      "title": "Customer Acquisition Cost (CAC) vs Lifetime Value (LTV) Model",
      "tagline": "Build financial growth models for campus expansion across Andhra & Telangana.",
      "description": "Develop a spreadsheet model analyzing organic campus ambassador acquisition costs versus institutional subscription revenue. Include sensitivity analysis on referral coefficients.",
      "deliverables": "Google Drive Financial Growth Model Spreadsheet + Executive Memo.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Growth Modeling",
        "Financial Unit Economics",
        "Data Modeling"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "mk-w4-t1",
      "department": "marketing",
      "week": "Week 04",
      "title": "Campus Placement Hackathon Promotion & Participant Onboarding",
      "tagline": "Orchestrate multi-college registration blitz for Lumixora coding contest.",
      "description": "Plan promotional timeline, Discord/WhatsApp announcement copy, and live webinar schedule for Lumixora's upcoming inter-college algorithmic hackathon.",
      "deliverables": "Hackathon Promotional Strategy + Registration Funnel Architecture.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Event Marketing",
        "Campaign Management",
        "Multi-channel Push"
      ],
      "dueDate": "2026-12-20",
      "templateType": "playbook"
    },
    {
      "id": "mk-w4-t2",
      "department": "marketing",
      "week": "Week 04",
      "title": "Daily Active Scholar Engagement & Gamification Retention Loops",
      "tagline": "Design streak preservation notifications and weekly leaderboard alerts.",
      "description": "Craft push notification and email copy to re-engage dormant scholars. Focus on coding streak celebrations, peer challenge invites, and fresh placement question drop alerts.",
      "deliverables": "Notification Matrix (30 Push Hooks) + User Journey Map.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Retention Marketing",
        "Product Gamification",
        "Lifecycle Messaging"
      ],
      "dueDate": "2026-12-20",
      "templateType": "calendar"
    },
    {
      "id": "mk-w4-t3",
      "department": "marketing",
      "week": "Week 04",
      "title": "Growth Performance Analytics Dashboard & Attribution Tracking",
      "tagline": "Set up campaign UTM taxonomy and cohort conversion reporting.",
      "description": "Standardize campaign UTM tracking across social channels, ambassador referral codes, and college campaigns. Define metric dashboard tracking Weekly Active Users and referral velocity.",
      "deliverables": "Attribution Architecture Doc + Sample Analytics Dashboard Blueprint.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Marketing Analytics",
        "Attribution Modeling",
        "Data Instrumentation"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "mk-w5-t1",
      "department": "marketing",
      "week": "Week 05",
      "title": "Student Testimonial Video Campaign & Social Proof Collateral",
      "tagline": "Package authentic student breakthroughs into high-converting social proof.",
      "description": "Coordinate short video testimonials and written case studies from Batch 01 interns and beta users. Create format specs for LinkedIn, Instagram reels, and YouTube shorts.",
      "deliverables": "3 Video Testimonial Briefs + Social Proof Landing Page Section Copy.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Social Proof",
        "Customer Advocacy",
        "Multimedia Production"
      ],
      "dueDate": "2026-12-27",
      "templateType": "editorial"
    },
    {
      "id": "mk-w5-t2",
      "department": "marketing",
      "week": "Week 05",
      "title": "Institutional TPO Portal Go-To-Market Pitch & Collateral",
      "tagline": "Prepare executive presentations for college placement deans.",
      "description": "Synthesize Lumixora institutional benefits (real-time student analytics, automated mock interviews, company paper banks) into an executive 12-slide pitch presentation for college leadership.",
      "deliverables": "Google Slides B2B Pitch Presentation (12 Slides) + Speaker Notes.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Enterprise B2B",
        "Presentation Design",
        "Value Proposition"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "mk-w5-t3",
      "department": "marketing",
      "week": "Week 05",
      "title": "EdTech Industry Press Release & Founder Profile Story",
      "tagline": "Write publishable media release announcing Lumixora's regional rollout.",
      "description": "Draft an authoritative press release highlighting how Lumixora is democratizing placement preparation across tier-2 and tier-3 engineering colleges, featuring quotes from Founder Shaik Sowban.",
      "deliverables": "Professional Press Release Manuscript + Media Distribution List.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Public Relations",
        "Media Communications",
        "Journalistic Tone"
      ],
      "dueDate": "2026-12-27",
      "templateType": "editorial"
    },
    {
      "id": "mk-w6-t1",
      "department": "marketing",
      "week": "Week 06",
      "title": "Comprehensive Cohort Growth Audit & Metric Retrospective",
      "tagline": "Deliver final data presentation on user acquisition and funnel outcomes.",
      "description": "Aggregate campaign metrics, ambassador referrals, lead magnet downloads, and user registrations achieved across the 6-week cohort. Analyze wins, drop-offs, and future growth levers.",
      "deliverables": "Executive Growth Capstone Report (PDF) + Presentation Slides.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Executive Reporting",
        "Growth Retrospective",
        "Strategic Planning"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    },
    {
      "id": "mk-w6-t2",
      "department": "marketing",
      "week": "Week 06",
      "title": "2027 Multi-Campus Expansion & Scaling Strategy Playbook",
      "tagline": "Formulate next-quarter expansion blueprint for 50+ engineering colleges.",
      "description": "Develop scalable operational playbook for launching Lumixora in 50 additional engineering campuses in the upcoming academic semester, including hiring regional student growth leads.",
      "deliverables": "Expansion Playbook + Campus Launch Checklist.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Scale Strategy",
        "Operational Planning",
        "Resource Budgeting"
      ],
      "dueDate": "2026-12-30",
      "templateType": "playbook"
    },
    {
      "id": "mk-w6-t3",
      "department": "marketing",
      "week": "Week 06",
      "title": "Growth Marketing Leadership Portfolio & Distinction Defense",
      "tagline": "Assemble complete public marketing artifacts for LinkedIn distinction.",
      "description": "Compile all created campaign funnels, brand guides, lead magnets, and metrics into a polished personal portfolio deck ready for Founder distinction sign-off and employer presentation.",
      "deliverables": "Comprehensive Marketing Portfolio Dossier (PDF/Web Link).",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Portfolio Curation",
        "Career Presentation",
        "Professional Polish"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    }
  ],
  "research": [
    {
      "id": "rs-w1-t1",
      "department": "research",
      "week": "Week 01",
      "title": "Top 10 EdTech Placement Platforms Competitive Moat Matrix",
      "tagline": "Deep architectural and feature breakdown of market competitors.",
      "description": "Conduct comprehensive competitive intelligence benchmarking Lumixora against 10 prominent platforms (Unstop, LeetCode, PrepInsta, GeeksforGeeks, etc.). Detail their pricing, weaknesses, and Lumixora unique differentiators.",
      "deliverables": "PDF Moat Dossier or Google Drive Comparison Matrix.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Market Intelligence",
        "Competitive Analysis",
        "Benchmarking"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "rs-w1-t2",
      "department": "research",
      "week": "Week 01",
      "title": "Undergraduate Placement Anxiety & Prep Behavior Survey (25+ Scholars)",
      "tagline": "Gather primary campus insights on engineering student pain points.",
      "description": "Design and deploy a structured student questionnaire. Conduct brief qualitative interviews with 25 engineering undergraduates regarding their preparation bottlenecks, coding mock fears, and willingness to adopt AI coaching.",
      "deliverables": "Google Drive Interview Transcripts + PDF Qualitative Synthesis.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "User Research",
        "Survey Design",
        "Qualitative Synthesis"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "rs-w1-t3",
      "department": "research",
      "week": "Week 01",
      "title": "Institutional B2B College Partnership & TPO Value Proposition Report",
      "tagline": "Formulate institutional partnership frameworks for engineering colleges.",
      "description": "Research how Training & Placement Officers (TPOs) evaluate software platforms. Formulate proposal structures, accreditation support points (NBA / NAAC criterion compliance), and institutional pricing models.",
      "deliverables": "PDF Executive Whitepaper or Google Slides Pitch Deck.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "B2B Research",
        "Higher-Ed Policy",
        "Value Engineering"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "rs-w2-t1",
      "department": "research",
      "week": "Week 02",
      "title": "Generative AI Voice & Interview Coach UX Benchmark Analysis",
      "tagline": "Evaluate latency, conversation pacing, and feedback quality in AI voice coaches.",
      "description": "Test and benchmark state-of-the-art conversational AI tools (InterviewWarmup, Speak, Hume AI). Formulate specific interaction principles for Lumixora SpeakVerse voice latency (<500ms) and vernacular support.",
      "deliverables": "Comparative Voice UX Benchmark Matrix + Architectural Recommendations.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Voice AI UX",
        "Conversational Design",
        "Latency Optimization"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "rs-w2-t2",
      "department": "research",
      "week": "Week 02",
      "title": "Coding Assessment Integrity & Modern Anti-Proctoring Study",
      "tagline": "Investigate browser sandbox security and code plagiarism detection.",
      "description": "Analyze common vulnerabilities in web-based coding environments (tab-switching detection, clipboard paste inspection, LLM code generation detection). Recommend integrity mechanisms for Lumixora coding tests.",
      "deliverables": "Security Research Whitepaper on Assessment Integrity.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Assessment Security",
        "Plagiarism Detection",
        "Browser Sandboxing"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "rs-w2-t3",
      "department": "research",
      "week": "Week 02",
      "title": "Curriculum Alignment Analysis: Autonomous Colleges vs JNTU/VTU",
      "tagline": "Map computer science syllabi across regional engineering universities.",
      "description": "Conduct deep alignment review comparing subject modules (Data Structures, DBMS, OS, Computer Networks) across 5 major university curricula. Identify gap concepts commonly asked in tier-1 tech interviews.",
      "deliverables": "Curriculum Gap Analysis Matrix (Spreadsheet) + Remediation Deck.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Academic Benchmarking",
        "Curriculum Mapping",
        "Domain Synthesis"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "rs-w3-t1",
      "department": "research",
      "week": "Week 03",
      "title": "Applicant Tracking Systems (ATS) Parsing Engine Reverse-Engineering",
      "tagline": "Deconstruct keyword weighting, scoring algorithms, and PDF formatting rules.",
      "description": "Test 15 resume formats against major ATS parsers (Workday, Taleo, Greenhouse). Identify critical formatting errors (multi-column bugs, table parse failures) and define Lumixora Resume Creator optimization rules.",
      "deliverables": "ATS Optimization Whitepaper + Rule-based Parsing Checklist.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "ATS Reverse Engineering",
        "Parsing Algorithms",
        "Resume Standards"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "rs-w3-t2",
      "department": "research",
      "week": "Week 03",
      "title": "Behavioral & HR Interview Rubric Calibration Study",
      "tagline": "Map STAR method competencies across product companies vs IT service giants.",
      "description": "Analyze evaluation criteria used by Amazon, TCS, Microsoft, and Infosys HR rounds. Create standardized STAR behavioral scoring rubrics for Lumixora AI Mock Interview Room.",
      "deliverables": "Comprehensive Behavioral Rubric Dossier (PDF + JSON Spec).",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Behavioral Evaluation",
        "STAR Framework",
        "Interview Rubrics"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "rs-w3-t3",
      "department": "research",
      "week": "Week 03",
      "title": "Cognitive Load & Gamification Mechanics in Engineering Learning",
      "tagline": "Study retention psychology to prevent undergraduate learner drop-off.",
      "description": "Review academic literature on spaced repetition, micro-quizzes, and dopamine loops in coding platforms. Formulate UX enhancements for Lumixora's Daily Streak and Practice modules.",
      "deliverables": "Learning Psychology Research Paper + Product Recommendations.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Educational Psychology",
        "Gamification Design",
        "Cognitive Ergonomics"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "rs-w4-t1",
      "department": "research",
      "week": "Week 04",
      "title": "Institutional NBA Criterion 4 & NAAC Criteria Alignment Framework",
      "tagline": "Structure Lumixora student outcome data for college accreditation audits.",
      "description": "Analyze NBA Criterion 4 (Students Performance) and NAAC placement metrics. Propose automated institutional reporting exports that save college TPO and NBA coordinators weeks of manual data compilation.",
      "deliverables": "Accreditation Value Proposal Whitepaper + Data Export Schema.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Higher-Ed Accreditation",
        "NBA/NAAC Policy",
        "Enterprise Reporting"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "rs-w4-t2",
      "department": "research",
      "week": "Week 04",
      "title": "Quantitative Placement Preparation Drop-Off Funnel Analysis",
      "tagline": "Analyze real user journey telemetry to identify drop-off triggers.",
      "description": "Examine cohort practice telemetry across code execution failures, interview room abandonment, and notes reader dwell times. Recommend UX nudges to boost module completion.",
      "deliverables": "Quantitative Funnel Diagnostic Report + Remediation Wireframes.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Quantitative Analytics",
        "User Funnel Diagnostics",
        "Retention Strategy"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "rs-w4-t3",
      "department": "research",
      "week": "Week 04",
      "title": "Emerging Market EdTech Pricing & Sustainable Monetization Models",
      "tagline": "Evaluate student willingness-to-pay and institutional seat licensing models.",
      "description": "Benchmark pricing tiers across Indian EdTech startups. Model student micro-subscriptions (Rs 99-299/mo) vs annual college-sponsored enterprise passes.",
      "deliverables": "Pricing Strategy Research Dossier + Sensitivity Model.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Pricing Strategy",
        "Market Sizing",
        "Economic Modeling"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "rs-w5-t1",
      "department": "research",
      "week": "Week 05",
      "title": "Predictive Hiring Analytics: Coding Velocity vs Placement Outcomes",
      "tagline": "Correlate mock test accuracy with real campus drive shortlisting.",
      "description": "Research predictive correlations between student performance on core topics (Time Complexity, SQL Joins, System Design) and their likelihood of passing first-round technical tests.",
      "deliverables": "Predictive Hiring Model Whitepaper + Feature Blueprint.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Predictive Analytics",
        "Talent Assessment",
        "Statistical Modeling"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "rs-w5-t2",
      "department": "research",
      "week": "Week 05",
      "title": "Digital Personal Data Protection (DPDP) Act Compliance Study",
      "tagline": "Audit student data handling, resume privacy, and cryptographic storage.",
      "description": "Conduct thorough legal & technical review of Indian DPDP Act 2023 requirements regarding student data collection, parental consents for minors, and cryptographic verification ledgers.",
      "deliverables": "DPDP Compliance Audit Report + Privacy Architecture Recommendations.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Data Privacy Law",
        "DPDP Act Compliance",
        "Cryptographic Security"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "rs-w5-t3",
      "department": "research",
      "week": "Week 05",
      "title": "Multi-Modal AI in Technical Education: 2027 Horizon Scan",
      "tagline": "Explore frontier applications of vision, voice, and interactive canvas in CS.",
      "description": "Investigate how upcoming multimodal models can explain complex data structure diagrams, generate real-time execution animation, and critique hand-drawn system design architectures.",
      "deliverables": "Technology Horizon Scan Report + Interactive Prototype Brief.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Emerging Tech Horizon",
        "Multimodal AI",
        "R&D Roadmapping"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "rs-w6-t1",
      "department": "research",
      "week": "Week 06",
      "title": "Lumixora Strategic Master Whitepaper & Product Intelligence Dossier",
      "tagline": "Deliver definitive market analysis and competitive moat synthesis.",
      "description": "Synthesize all competitive findings, user surveys, academic curriculum alignments, and compliance audits into Lumixora's comprehensive 20-page strategic product intelligence dossier.",
      "deliverables": "Complete Master Research Whitepaper (PDF) + Executive Summary.",
      "estimatedHours": "10-12 hours",
      "skills": [
        "Strategic Synthesis",
        "Executive Authoring",
        "Market Intelligence"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    },
    {
      "id": "rs-w6-t2",
      "department": "research",
      "week": "Week 06",
      "title": "Product-Market Fit (PMF) Synthesis & Feature Priority Roadmap",
      "tagline": "Formulate data-backed feature roadmap for Q1-Q2 2027 development.",
      "description": "Rank requested student and TPO features by impact vs engineering effort (RICE framework). Deliver clear actionable recommendations directly to Founder Shaik Sowban.",
      "deliverables": "RICE Scoring Matrix Spreadsheet + Feature Prioritization Deck.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Product Prioritization",
        "RICE Framework",
        "Roadmap Strategy"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    },
    {
      "id": "rs-w6-t3",
      "department": "research",
      "week": "Week 06",
      "title": "Research Capstone Defense & Distinction Portfolio",
      "tagline": "Prepare comprehensive evidence archive for Founder distinction sign-off.",
      "description": "Organize all survey data, competitor analysis matrices, and whitepapers into an authenticated research portfolio ready for LinkedIn display and public ledger verification.",
      "deliverables": "Final Research Capstone Dossier (PDF/Notion).",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Academic Defense",
        "Portfolio Presentation",
        "Verification Proof"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    }
  ],
  "content_creation": [
    {
      "id": "cc-w1-t1",
      "department": "content_creation",
      "week": "Week 01",
      "title": "Flagship Lumixora AI Platform 60s Cinematic Explainer Video",
      "tagline": "Produce a high-energy, Apple-grade motion preview of the student OS.",
      "description": "Script, storyboard, and edit a 60-second high-tempo showcase of Lumixora AI features (Notes, Coding Practice, Mock Interview Room, Placement Radar). Use dynamic typography, crisp audio design, and authentic UI captures.",
      "deliverables": "Google Drive MP4 or YouTube unlisted preview link + Script file.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Video Editing",
        "Motion Graphics",
        "Storyboarding"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "cc-w1-t2",
      "department": "content_creation",
      "week": "Week 01",
      "title": "Complete Visual Brand Asset Library (Social Banners, Emblems, Icons)",
      "tagline": "Create vector-perfect marketing design assets for multi-platform distribution.",
      "description": "Design high-resolution Figma assets for Lumixora campus promotion: 5 LinkedIn carousel graphics, 3 Instagram story templates, 2 WhatsApp announcement posters, and crisp SVG emblems.",
      "deliverables": "Figma Community file or Google Drive folder with exported WebP / PNGs.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Figma Design",
        "Visual Hierarchy",
        "Brand Collateral"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "cc-w1-t3",
      "department": "content_creation",
      "week": "Week 01",
      "title": "Viral Placement Success Stories & Student Interview Series (3 Articles)",
      "tagline": "Write deep-dive student success articles highlighting tier-1 placements.",
      "description": "Draft 3 long-form editorial spotlights (800-1200 words each) covering real student placement journeys (TCS Digital, Cognizant GenC Next, Google hiring). Focus on specific DSA concepts, interview hurdles, and practical guidance.",
      "deliverables": "Google Docs manuscript or Markdown articles with curated headers.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Technical Writing",
        "Student Journalism",
        "SEO Optimization"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "cc-w2-t1",
      "department": "content_creation",
      "week": "Week 02",
      "title": "10 High-Engagement LinkedIn Carousels on DSA & System Design",
      "tagline": "Design visually striking educational slide decks for engineering scholars.",
      "description": "Create 10 PDF carousel presentations covering high-frequency placement topics: Sliding Window, Binary Search variations, Graph BFS/DFS, and Microservice vs Monolith architecture.",
      "deliverables": "10 PDF Carousels (Figma/Canva export) + LinkedIn Post Captions.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Infographic Design",
        "DSA Visuals",
        "Carousel Formatting"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "cc-w2-t2",
      "department": "content_creation",
      "week": "Week 02",
      "title": "Short-Form Motion Reels Series on Tricky LeetCode & Coding Hacks",
      "tagline": "Produce 3 fast-paced 30-45s vertical video explanations for Instagram & YouTube.",
      "description": "Write scripts, record screen captures, and add motion typography and kinetic captions explaining clever algorithmic one-liners and common coding test traps.",
      "deliverables": "3 High-Resolution Vertical MP4 Videos + Script Files.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Short-form Video",
        "Motion Typography",
        "Audio Mixing"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "cc-w2-t3",
      "department": "content_creation",
      "week": "Week 02",
      "title": "Lumixora Mobile UI Component Library & Visual Theme Specs",
      "tagline": "Design high-fidelity Figma components for future student dashboard views.",
      "description": "Craft comprehensive Figma design system containing mobile navigation bars, coding problem card variants, achievement badge medals, and dark-mode glassmorphic containers.",
      "deliverables": "Figma Design System File Link + Component Token Specs.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "UI/UX Design",
        "Figma Components",
        "Design Systems"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "cc-w3-t1",
      "department": "content_creation",
      "week": "Week 03",
      "title": "The Ultimate 50-Page Campus Placement Handbook & Cheat Sheet",
      "tagline": "Design and curate authoritative digital e-book for final-year engineering students.",
      "description": "Compile verified notes, code snippets, HR questions, and technical interview checklists into a beautifully formatted, publication-grade digital book.",
      "deliverables": "Master PDF Placement Handbook + Cover Art + Editable InDesign/Figma source.",
      "estimatedHours": "10-12 hours",
      "skills": [
        "E-Book Design",
        "Editorial Curation",
        "Publication Layout"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "cc-w3-t2",
      "department": "content_creation",
      "week": "Week 03",
      "title": "Interactive Infographic on 2026 Indian Tech Placement Hiring Trends",
      "tagline": "Visualize salary distributions, hiring volumes, and skill demands.",
      "description": "Design an informative, shareable vector infographic comparing Tier-1 tech packages (Product, FinTech, Service) and top in-demand skills (AI engineering, Cloud, Spring Boot).",
      "deliverables": "High-Res Vector Infographic (PNG/SVG) + Social Distribution Crops.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Data Visualization",
        "Information Architecture",
        "Vector Art"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "cc-w3-t3",
      "department": "content_creation",
      "week": "Week 03",
      "title": "Campus Placement Masterclass Slide Presentation & Speaker Script",
      "tagline": "Build the official slide deck for college placement orientation sessions.",
      "description": "Create a 25-slide keynote presentation deck with animated transitions, high-contrast layouts, and speaker script notes for Founder Shaik Sowban's campus workshops.",
      "deliverables": "Google Slides Presentation Deck + Speaker Script PDF.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Keynote Design",
        "Presentation Storytelling",
        "Speech Writing"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "cc-w4-t1",
      "department": "content_creation",
      "week": "Week 04",
      "title": "Feature Deep-Dive Video: SpeakVerse AI Voice Simulator",
      "tagline": "Create an immersive, professional walkthrough of the real-time speech coach.",
      "description": "Produce a high-production 90-second product demo highlighting mic audio streaming, dynamic vocabulary suggestions, and automated HR scorecards in SpeakVerse.",
      "deliverables": "Full HD 1080p MP4 Video Walkthrough + Voiceover Track.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Product Demo Video",
        "Screencast Direction",
        "Audio Post-production"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "cc-w4-t2",
      "department": "content_creation",
      "week": "Week 04",
      "title": "Student Transformation Case Study Video & Editorial Feature",
      "tagline": "Document an undergraduate scholar's journey from interview fear to tech offer.",
      "description": "Write a compelling human-interest story and produce a 2-minute video feature interviewing a student who cracked their campus placement after practicing on Lumixora.",
      "deliverables": "Written Case Study Article + Edited Video Montage (Drive Link).",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Documentary Storytelling",
        "Interview Editing",
        "Case Study Writing"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "cc-w4-t3",
      "department": "content_creation",
      "week": "Week 04",
      "title": "High-Converting Landing Page Copy & Visual Section Concepts",
      "tagline": "Rewrite core hero, social proof, and feature sections for lumixora.in.",
      "description": "Develop punchy copy, benefit-driven subheads, and wireframe suggestions for the Lumixora main landing page to increase student signup conversion by 30%.",
      "deliverables": "Copywriting Manuscript + Figma Wireframe Blueprint.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Direct Response Copy",
        "Landing Page Wireframing",
        "Conversion Design"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "cc-w5-t1",
      "department": "content_creation",
      "week": "Week 05",
      "title": "Institutional TPO Partnership Presentation Deck & Collateral",
      "tagline": "Design an executive pitch deck for college training & placement deans.",
      "description": "Create an authoritative 15-slide institutional presentation detailing how Lumixora boosts college NIRF rankings, NBA placement data compliance, and student drive conversion.",
      "deliverables": "Google Slides / Canva Presentation (15 Slides) + One-Page Executive Summary.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "B2B Deck Design",
        "Executive Typography",
        "Data Layout"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "cc-w5-t2",
      "department": "content_creation",
      "week": "Week 05",
      "title": "Batch 02 National Internship Launch Campaign Motion Teaser",
      "tagline": "Produce a cinematic 30-second motion graphic teaser for the next cohort.",
      "description": "Build dynamic 3D-inspired kinetic typography teaser announcing Batch 02 engineering internships, highlighting real production contributions, founder mentorship, and cryptographic certificates.",
      "deliverables": "1080x1920 (Reel) & 1920x1080 (Landscape) MP4 Teasers.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Motion Graphics",
        "After Effects / Premiere",
        "Audio Sound Design"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "cc-w5-t3",
      "department": "content_creation",
      "week": "Week 05",
      "title": "Lumixora Comprehensive Design System Token Specification",
      "tagline": "Document color palette, typography hierarchy, and spacing tokens in Figma.",
      "description": "Formalize Lumixora's brand design tokens: primary cyan/emerald accents, dark-mode zinc backgrounds, semantic alerts, font scales, and border radii for developer handoff.",
      "deliverables": "Figma Design System File + Design Token Specification Document.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Design Tokens",
        "Figma Variables",
        "Developer Handoff"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "cc-w6-t1",
      "department": "content_creation",
      "week": "Week 06",
      "title": "Lumixora Batch 01 Showcase Showreel & Motion Portfolio",
      "tagline": "Deliver a fast-paced 2-minute recap of all creative work created in the cohort.",
      "description": "Assemble a comprehensive showreel cut to rhythmic audio celebrating all videos, social graphics, UI components, and editorial work produced during the 6-week internship.",
      "deliverables": "Master 4K/1080p Creative Showreel Video + High-Res Thumbnail Art.",
      "estimatedHours": "9-11 hours",
      "skills": [
        "Showreel Editing",
        "Sound Design",
        "Visual Mastery"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    },
    {
      "id": "cc-w6-t2",
      "department": "content_creation",
      "week": "Week 06",
      "title": "Multi-Channel Media Production Playbook for Future Cohorts",
      "tagline": "Document creative workflows, export standards, and brand voice guidelines.",
      "description": "Author an operational handbook outlining video codecs, aspect ratios, thumbnail rules, font licenses, and tone-of-voice criteria for future incoming media interns.",
      "deliverables": "Comprehensive Media Production Manual (PDF/Notion).",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Brand Documentation",
        "Process Standardization",
        "Creative Operations"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    },
    {
      "id": "cc-w6-t3",
      "department": "content_creation",
      "week": "Week 06",
      "title": "Creative Direction Capstone & Professional Portfolio Archive",
      "tagline": "Final portfolio compilation for Founder distinction evaluation.",
      "description": "Package all design assets, video links, infographics, and articles into a stellar, shareable creative portfolio with Behance / Dribbble / LinkedIn links ready for public verification.",
      "deliverables": "Digital Creative Portfolio (Drive Archive + Web Showcase Link).",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Portfolio Direction",
        "Brand Presentation",
        "Distinction Proof"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    }
  ],
  "software_testing": [
    {
      "id": "st-w1-t1",
      "department": "software_testing",
      "week": "Week 01",
      "title": "Master Test Strategy & S1-S4 Severity Production Bug Matrix",
      "tagline": "Comprehensive QA plan covering boundary values, auth edge cases and severity matrix.",
      "description": "Formulate formal QA test strategy for Lumixora web application. Define testing scopes, S1 (Blocker) to S4 (Cosmetic) severity criteria, test environments, and matrix covering Authentication, Notes Platform, and Placement Commander.",
      "deliverables": "PDF Master Test Plan or Google Drive Spreadsheet matrix.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Test Planning",
        "Severity Matrix",
        "Edge Case Analysis"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "st-w1-t2",
      "department": "software_testing",
      "week": "Week 01",
      "title": "Cross-Browser UI/UX & Mobile Breakpoint Bug Audit Report",
      "tagline": "Systematic viewport audit across Chrome, Safari, Firefox and mobile screens.",
      "description": "Execute deep responsive testing across iOS Safari, Android Chrome, and desktop viewports (375px, 768px, 1440px). Identify layout overflows, text clipping, broken navigation pills, and touch target accessibility issues.",
      "deliverables": "PDF Bug Audit Dossier with annotated screenshots & reproduction steps.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Cross-Browser Testing",
        "Responsive QA",
        "Accessibility (WCAG)"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "st-w1-t3",
      "department": "software_testing",
      "week": "Week 01",
      "title": "REST API & Auth Token Session Boundary Test Suite",
      "tagline": "Validate endpoint status codes, schema consistency and security boundaries.",
      "description": "Construct automated Postman/Newman or Playwright test script collection verifying API responses, payload sanitization, token expiry behaviour, and unauthorized route access blocks.",
      "deliverables": "GitHub repository or exported Postman Collection JSON with run logs.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "API Testing",
        "Postman / Playwright",
        "Security Boundary QA"
      ],
      "dueDate": "2026-11-29",
      "templateType": "strategy"
    },
    {
      "id": "st-w2-t1",
      "department": "software_testing",
      "week": "Week 02",
      "title": "Automated End-to-End Regression Harness (Playwright / Cypress)",
      "tagline": "Script automated browser journeys covering login, notes viewing, and test submissions.",
      "description": "Write automated end-to-end test scripts verifying core student workflows: authentication modal login, selecting a subject in NotesPlatform, running code in CodeEditor, and submitting a deliverable.",
      "deliverables": "GitHub Repository with Playwright / Cypress scripts + Test Run Report.",
      "estimatedHours": "9-11 hours",
      "skills": [
        "E2E Automation",
        "Playwright",
        "Test Automation"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "st-w2-t2",
      "department": "software_testing",
      "week": "Week 02",
      "title": "Judge0 Cloud Compiler & Code Sandbox Execution Security Audit",
      "tagline": "Test code runner edge cases: infinite loops, memory exhaustion, and fork bombs.",
      "description": "Perform stress testing on the Judge0 code execution engine. Submit edge cases in C++, Java, and Python (stack overflow, excessive output, SIGSEGV, timeout handling) and verify graceful UI recovery.",
      "deliverables": "Code Execution Vulnerability & Resilience Matrix (PDF).",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Compiler Security",
        "Sandbox Stress Testing",
        "Edge Case QA"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "st-w2-t3",
      "department": "software_testing",
      "week": "Week 02",
      "title": "Mobile Touch Gestures & Viewport Overflow Bug Matrix",
      "tagline": "Audit swipe interactions, modal backdrop taps, and virtual keyboard shifts.",
      "description": "Test interactive components on mobile devices when virtual keyboard opens. Verify that input fields remain visible, modals don't jump, and touch scroll works smoothly without horizontal panning.",
      "deliverables": "Mobile QA Defect Sheet with Video Screen Captures.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Mobile UX Testing",
        "Gesture QA",
        "Touch Target Audit"
      ],
      "dueDate": "2026-12-06",
      "templateType": "strategy"
    },
    {
      "id": "st-w3-t1",
      "department": "software_testing",
      "week": "Week 03",
      "title": "Comprehensive Postman API Collection & Continuous Integration Tests",
      "tagline": "Create 25+ automated API assertions checking payload contracts & error schemas.",
      "description": "Design structured Postman test collection validating all backend routes: login, submissions, certificate verification, and leaderboard telemetry. Include assertions on response time (<300ms).",
      "deliverables": "Postman Collection v2.1 JSON + CLI Newman HTML Test Run Report.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Postman / Newman",
        "API Contract Testing",
        "CI Test Gates"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "st-w3-t2",
      "department": "software_testing",
      "week": "Week 03",
      "title": "Web Audio API Mic Permissions & Streaming Latency in SpeakVerse",
      "tagline": "Test microphone permissions, audio sampling rates, and disconnect handling.",
      "description": "Conduct audio hardware edge testing: user denies microphone permission, Bluetooth headset disconnects mid-speech, background noise handling, and speech recognition transcription accuracy.",
      "deliverables": "Audio Stream Robustness Test Report (PDF) + Logged Defect Entries.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Web Audio API",
        "Hardware Permission QA",
        "Streaming Latency"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "st-w3-t3",
      "department": "software_testing",
      "week": "Week 03",
      "title": "Database Concurrency & Race Condition Testing on Placement Leaderboard",
      "tagline": "Simulate simultaneous quiz submissions and score increment collisions.",
      "description": "Write a lightweight test script sending concurrent HTTP requests simulating 20 students finishing an aptitude test at the exact same second. Verify atomic score updates and rank consistency.",
      "deliverables": "Concurrency Analysis Report + Test Script Artifacts.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Concurrency Testing",
        "Race Conditions",
        "Database Consistency"
      ],
      "dueDate": "2026-12-13",
      "templateType": "strategy"
    },
    {
      "id": "st-w4-t1",
      "department": "software_testing",
      "week": "Week 04",
      "title": "Offline Resilience & Network Disconnect Recovery Test Suite",
      "tagline": "Test service worker caching, offline banners, and pending queue sync.",
      "description": "Simulate intermittent 3G network drops, sudden offline mode, and reconnect cycles while a student is reading notes or editing code. Verify zero data loss and automated re-sync.",
      "deliverables": "Offline Resilience Test Dossier + Network Throttle Matrix.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Offline Architecture",
        "Service Workers",
        "Network Throttling"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "st-w4-t2",
      "department": "software_testing",
      "week": "Week 04",
      "title": "Role-Based Access Control (RBAC) & Security Penetration Audit",
      "tagline": "Test subdomain isolation, founder privilege boundaries, and token spoofing.",
      "description": "Verify strict isolation between main domain, GPREC subdomain, and TPO portal. Attempt URL manipulation, cross-role endpoint tampering, and session storage tampering to prove airtight security.",
      "deliverables": "Security Penetration Audit Report (PDF) + Remediation Checklist.",
      "estimatedHours": "9-11 hours",
      "skills": [
        "Security Penetration",
        "RBAC Boundary QA",
        "Subdomain Isolation"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "st-w4-t3",
      "department": "software_testing",
      "week": "Week 04",
      "title": "Cross-Platform PDF Canvas Rendering & Print Fidelity Verification",
      "tagline": "Audit multi-page syllabus rendering, certificate printing, and font embedding.",
      "description": "Test PDF download, print-to-PDF fidelity, and canvas rendering across Firefox, Safari, and Chromium on Windows, macOS, and Linux. Verify that certificate borders and QR codes render without clipping.",
      "deliverables": "Rendering Fidelity Audit Report with Side-by-Side Visual Proof.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Canvas Rendering",
        "Print CSS QA",
        "Visual Regression"
      ],
      "dueDate": "2026-12-20",
      "templateType": "strategy"
    },
    {
      "id": "st-w5-t1",
      "department": "software_testing",
      "week": "Week 05",
      "title": "Staging Release Candidate Smoke Test & Production Sign-Off Matrix",
      "tagline": "Execute 50-step critical path smoke checklist for weekly production builds.",
      "description": "Perform comprehensive release candidate verification before Cloudflare Pages deployment: verify routing hashes, lazy-loaded chunk loading, service worker registration, and zero console errors.",
      "deliverables": "Signed Production Smoke Test Matrix + Zero-Error Console Proof.",
      "estimatedHours": "8-10 hours",
      "skills": [
        "Release Management",
        "Smoke Testing",
        "Production Readiness"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "st-w5-t2",
      "department": "software_testing",
      "week": "Week 05",
      "title": "Lighthouse 95+ Performance, SEO & Accessibility Audit",
      "tagline": "Analyze Core Web Vitals (FCP, LCP, CLS) and optimize bundle delivery.",
      "description": "Run Google Lighthouse audits across 8 key portals. Identify large asset chunks, blocking CSS, missing ARIA attributes, and propose compression/code-splitting optimizations.",
      "deliverables": "Lighthouse Performance Audit Dossier + Optimization Roadmap.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Core Web Vitals",
        "Lighthouse Profiling",
        "Web Performance"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "st-w5-t3",
      "department": "software_testing",
      "week": "Week 05",
      "title": "Critical Path Zero-Defect Certification Matrix",
      "tagline": "Verify that zero S1 (Blocker) or S2 (Critical) bugs exist in active modules.",
      "description": "Review and re-test all logged bugs in `lumixora_real_bugs`. Conduct regression verification ensuring resolved bugs stay resolved across software testing, marketing, and notes platform.",
      "deliverables": "Zero-Defect Verification Certificate + Regression Traceability Matrix.",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Defect Verification",
        "Regression Traceability",
        "Quality Certification"
      ],
      "dueDate": "2026-12-27",
      "templateType": "strategy"
    },
    {
      "id": "st-w6-t1",
      "department": "software_testing",
      "week": "Week 06",
      "title": "Executive QA Capstone Dossier & Production Stability Report",
      "tagline": "Deliver final software reliability report to Founder Shaik Sowban.",
      "description": "Synthesize all test strategies, automated Playwright/Postman suites, bug matrices, and performance audits into the official Lumixora Batch 01 QA Engineering Capstone Dossier.",
      "deliverables": "Master QA Engineering Capstone Report (PDF) + Executive Presentation.",
      "estimatedHours": "10-12 hours",
      "skills": [
        "Executive QA Reporting",
        "Quality Architecture",
        "Reliability Engineering"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    },
    {
      "id": "st-w6-t2",
      "department": "software_testing",
      "week": "Week 06",
      "title": "Complete S1-S4 Bug Resolution & Root Cause Analysis (RCA) Archive",
      "tagline": "Publish root cause analysis for all critical defects caught during the cohort.",
      "description": "Write detailed Root Cause Analysis (RCA) documents for the top 5 most severe bugs discovered during the internship, explaining how code fixes prevented production outages.",
      "deliverables": "RCA Engineering Archive + Preventative Guidelines Document.",
      "estimatedHours": "7-9 hours",
      "skills": [
        "Root Cause Analysis",
        "Incident Post-Mortem",
        "Defect Prevention"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    },
    {
      "id": "st-w6-t3",
      "department": "software_testing",
      "week": "Week 06",
      "title": "QA Engineering Portfolio, Test Artifacts & Distinction Defense",
      "tagline": "Assemble complete public test suites for Founder distinction sign-off.",
      "description": "Curate all test repositories, Postman runs, Lighthouse reports, and bug logs into a stellar engineering portfolio ready for LinkedIn distinction and employer presentation.",
      "deliverables": "Final QA Engineering Portfolio Dossier (GitHub Link + PDF Summary).",
      "estimatedHours": "6-8 hours",
      "skills": [
        "Portfolio Engineering",
        "Technical Presentation",
        "Distinction Proof"
      ],
      "dueDate": "2026-12-30",
      "templateType": "strategy"
    }
  ]
};

  // Determine active sprint week (stored or default Week 01)
  const isFounder = session?.email?.includes('sowban') || session?.role === 'founder' || session?.isFounder === true;
  
  const [activeSprintWeek, setActiveSprintWeek] = useState(() => {
    try {
      return localStorage.getItem('lumixora_active_sprint_week') || 'Week 01';
    } catch (_) {
      return 'Week 01';
    }
  });

  // Filter tasks pool for active role and selected week
  const departmentPool = DEPARTMENT_TASK_POOLS[activeRole?.id] || DEPARTMENT_TASK_POOLS.software_testing;
  const currentPool = departmentPool.filter(t => t.week === selectedSprintWeek);

  // Selected missions state (persisted per intern)
  const [selectedMissions, setSelectedMissions] = useState(() => {
    try {
      const saved = localStorage.getItem(`lumixora_selected_missions_${session?.id}`);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [currentPool[0]?.id, currentPool[1]?.id].filter(Boolean); // default select 2
  });

  const [isConfirmed, setIsConfirmed] = useState(() => {
    try {
      return localStorage.getItem(`lumixora_missions_confirmed_${session?.id}`) === 'true';
    } catch (_) {
      return true;
    }
  });

  const [confirmFeedback, setConfirmFeedback] = useState('');

  const toggleMissionSelection = (taskId) => {
    if (isConfirmed) return; // Locked once confirmed unless reset
    setSelectedMissions(prev => {
      let updated;
      if (prev.includes(taskId)) {
        updated = prev.filter(id => id !== taskId);
      } else {
        if (prev.length >= 2) {
          updated = [prev[1], taskId];
        } else {
          updated = [...prev, taskId];
        }
      }
      try {
        localStorage.setItem(`lumixora_selected_missions_${session?.id}`, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleConfirmMissions = () => {
    if (selectedMissions.length !== 2) {
      setConfirmFeedback('Please select exactly 2 weekly missions to confirm your sprint.');
      return;
    }
    setIsConfirmed(true);
    setConfirmFeedback('Weekly missions locked! Your sprint is in progress.');
    try {
      localStorage.setItem(`lumixora_missions_confirmed_${session?.id}`, 'true');
    } catch (_) {}
  };

  const handleUnlockMissions = () => {
    setIsConfirmed(false);
    setConfirmFeedback('Task selection unlocked. You can now adjust your 2 chosen missions.');
    try {
      localStorage.setItem(`lumixora_missions_confirmed_${session?.id}`, 'false');
    } catch (_) {}
  };

  // Check submission status for a task
  const getTaskStatus = (taskId) => {
    const sub = submissions.find(s => s.deliverableId === taskId || s.taskId === taskId);
    if (!sub) {
      if (selectedMissions.includes(taskId)) {
        return { label: 'In Progress', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', isSelected: true };
      }
      return { label: 'Optional / Unselected', color: 'text-slate-400 bg-white/5 border-white/10', isSelected: false };
    }
    if (sub.status === 'approved' || (sub.score && sub.score >= 80)) {
      return { label: 'Approved & Credited', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', isSelected: true, sub };
    }
    if (sub.status === 'revision_requested') {
      return { label: 'Revision Required', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30', isSelected: true, sub };
    }
    return { label: 'Under Review', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30', isSelected: true, sub };
  };

  // Generate standardized Markdown deliverable scaffold
  const generateScaffoldText = (task) => {
    if (!task) return '';
    return `# LUMIXORA ENGINEERING & INNOVATION WORKPLACE
## Official Sprint Deliverable Report • ${task.week}
---
**Project**: Lumixora (A Product of Vyomra)
**Track**: ${activeRole?.title || 'Engineering Intern'}
**Mission**: ${task.title}
**Author**: ${session?.name || 'Intern Scholar'} (ID: ${session?.id || 'LMX-B01'})
**Date**: ${new Date().toLocaleDateString('en-GB')}
**Status**: Ready for Founder Evaluation (Shaik Sowban)

---

### 1. Executive Summary
<!-- Brief 2-3 sentence overview of what was accomplished, why it matters, and core outcomes -->
- Summary: 

### 2. Objectives & Methodology
- Scope Covered:
- Tools / Frameworks Employed:
- Key Hypotheses or Quality Standards:

### 3. Deliverable Core Artifacts & Links
- Primary Deliverable (Google Drive / GitHub): 
- Secondary Walkthrough / Demo (Loom / Video): 
- Supporting Spreadsheets / Raw Data: 

### 4. Findings, Test Matrix & Analysis
| Category / Module | Scope Tested / Action Taken | Observed Outcome | Severity / Priority |
| :--- | :--- | :--- | :--- |
| Core Flow 01 | | Pass / Verified | S3 Normal |
| Edge Case 02 | | | S2 Major |

### 5. Identified Bottlenecks & Recommendations
1. 
2. 

### 6. Sign-off & Verification Telemetry
- Estimated Hours Invested: ${task.estimatedHours || '15 Hours'}
- Authenticity Attestation: I confirm all work herein represents verified, original engineering output for Lumixora.
`;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* ── SPRINT 1–6 TIMELINE ROADMAP BAR ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#080c16] border border-white/10 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black uppercase text-white tracking-wider">
              6-Week Intensive Sprint Roadmap
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Batch 01
            </span>
          </div>

          {/* Live Cutoff Countdown Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Sprint Cutoff:</span>
            <span className="text-white font-extrabold">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </div>

        {/* Horizontal Sprint Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {SPRINT_ROADMAP.map((sprint) => {
            const isCurrent = sprint.week === selectedSprintWeek;
            const isActive = sprint.status === 'active';
            const isLocked = sprint.status === 'locked' || sprint.status === 'upcoming';
            return (
              <button
                key={sprint.week}
                onClick={() => setSelectedSprintWeek(sprint.week)}
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer relative ${
                  isCurrent
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-white/[0.03] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-cyan-300' : 'text-gray-400'}`}>
                    {sprint.week}
                  </span>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ) : isLocked ? (
                    <Lock className="w-3 h-3 text-gray-500" />
                  ) : null}
                </div>
                <p className="text-xs font-bold text-white truncate mt-1">{sprint.title}</p>
                <p className="text-[10px] text-gray-400 truncate">{sprint.sub}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Sprint Notice if viewing future weeks */}
        {selectedSprintWeek !== 'Week 01' && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-300" />
              <span>
                <strong>{selectedSprintWeek} Objectives Preview</strong>: {SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.desc}
              </span>
            </div>
            <button
              onClick={() => setSelectedSprintWeek('Week 01')}
              className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-[11px] font-bold text-white transition-all"
            >
              Back to Active Week 01
            </button>
          </div>
        )}
      </div>

      {/* ── ACTIVE SPRINT BANNER & CONTROLS (Only for Active Week 01) ── */}
      {selectedSprintWeek === 'Week 01' ? (
        <>
          <div className="rounded-3xl bg-[#090d18] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-black uppercase tracking-wider text-cyan-400">
                  {activeRole?.shortTitle?.toUpperCase()} · {selectedSprintWeek.toUpperCase()} {selectedSprintWeek === activeSprintWeek ? '(ACTIVE SPRINT)' : '(PREVIEW / SPRINT DESK)'}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs font-bold text-slate-300">Choose your missions</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ({selectedMissions.length}/2 selected)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Weekly Mission Board
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Founder Shaik Sowban has assigned 3 targeted missions for this sprint. Select any two to execute, download standardized templates, and upload verified deliverables.
              </p>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              {!isConfirmed ? (
                <button
                  onClick={handleConfirmMissions}
                  disabled={selectedMissions.length !== 2}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    selectedMissions.length === 2
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Weekly Missions ({selectedMissions.length}/2)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Missions Locked (Sprint in Progress)</span>
                  </span>
                  <button
                    onClick={handleUnlockMissions}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs transition-all cursor-pointer"
                    title="Change mission selections"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {confirmFeedback && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              isConfirmed
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-200'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{confirmFeedback}</span>
            </div>
          )}

          {/* ── 3 MISSION SELECTION CARDS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {currentPool.map((task, idx) => {
          const isSelected = selectedMissions.includes(task.id);
          const status = getTaskStatus(task.id);
          return (
            <div
              key={task.id}
              onClick={() => !isConfirmed && toggleMissionSelection(task.id)}
              className={`rounded-3xl p-6 transition-all relative flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-gradient-to-b from-[#0f1424] to-[#0a0e1a] border-2 border-cyan-500/60 shadow-xl shadow-cyan-500/10'
                  : 'bg-[#090d17] border border-white/10 hover:border-white/20'
              } ${!isConfirmed ? 'cursor-pointer' : ''}`}
            >
              {/* Header Badge Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                    Mission 0{idx + 1}
                  </span>
                  
                  {/* Selection Indicator Checkbox */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                    {!isConfirmed ? (
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-white/30 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    ) : isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {task.title}
                  </h3>
                  <p className="text-xs text-cyan-300/90 font-medium mt-1">
                    {task.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Deliverable & Meta Footer */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Deliverables Expected:</span>
                  <p className="text-xs text-slate-200 font-medium leading-tight">
                    {task.deliverables}
                  </p>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {task.skills.map((sk, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Time & Due Date */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.estimatedHours}</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due {task.dueDate}</span>
                  </span>
                </div>

                {/* ACTION BUTTONS: Template Generator + Submit Button */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTemplateModalTask(task);
                    }}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Get Official Lumixora Template</span>
                  </button>

                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenSubmitModal) {
                          onOpenSubmitModal(task);
                        } else {
                          onNavigateTab('submission_studio');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Deliverable for Mission 0{idx + 1}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
          </div>
        </>
      ) : (
        /* ── SPRINT LOCKED HORIZON SCREEN FOR FUTURE WEEKS ── */
        <div className="p-8 sm:p-12 rounded-3xl bg-[#090d18] border border-white/10 text-center space-y-6 max-w-2xl mx-auto shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
              {selectedSprintWeek} · SPRINT HORIZON LOCKED
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.title}
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.desc}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left space-y-2.5 max-w-md mx-auto text-xs">
            <div className="flex items-center justify-between text-gray-400 font-mono text-[11px]">
              <span>SCHEDULED SPRINT WINDOW</span>
              <span className="text-cyan-300 font-bold">{SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.startDate} – {SPRINT_ROADMAP.find(s => s.week === selectedSprintWeek)?.endDate}</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">
              Weekly missions for {selectedSprintWeek} will be assigned by Founder Shaik Sowban following Week 01 deliverable evaluations and orientation kickoff.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setSelectedSprintWeek(activeSprintWeek)}
              className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-lg shadow-cyan-400/20 cursor-pointer transition-all"
            >
              <span>Return to Active {activeSprintWeek} Missions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── WORKFLOW TIMELINE CARD: The 6-Stage Real Startup Loop ── */}
      <div className="rounded-3xl bg-[#0a0e18] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">
          THE LUMIXORA TASK LIFECYCLE
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { step: '01', title: 'Founder Assigns', desc: '3 Weekly Tasks Curated', active: true },
            { step: '02', title: 'Intern Selects', desc: 'Choose Any 2 Missions', active: true },
            { step: '03', title: 'Work in Progress', desc: 'Collaborate & Build', active: true },
            { step: '04', title: 'Submit Deliverable', desc: 'Drive / Git / PDF / Loom', active: true },
            { step: '05', title: 'Founder Reviews', desc: 'Evaluation & Rubric', active: true },
            { step: '06', title: 'Approved & Credit', desc: 'Impact DNA Recorded', active: true }
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 block">{item.step}</span>
              <p className="text-xs font-bold text-white">{item.title}</p>
              <p className="text-[10px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── DELIVERABLE TEMPLATE MODAL ── */}
      {templateModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0b0f1c] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Official Lumixora Deliverable Template
                  </h3>
                  <p className="text-[11px] text-gray-400">{templateModalTask.title}</p>
                </div>
              </div>
              <button
                onClick={() => setTemplateModalTask(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Use this standardized template to document your mission findings. You can copy the Markdown scaffold directly into your Google Docs, GitHub README, or Notion document before submitting.
            </p>

            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 font-mono text-[11px] text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-72 custom-scrollbar">
              {generateScaffoldText(templateModalTask)}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
              <span className="text-[11px] text-gray-400">
                Format: Standardized Markdown • Startup Grade
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateScaffoldText(templateModalTask));
                    setCopiedTemplate(true);
                    setTimeout(() => setCopiedTemplate(false), 2500);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer"
                >
                  {copiedTemplate ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedTemplate ? 'Copied to Clipboard!' : 'Copy Template Markdown'}</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generateScaffoldText(templateModalTask)], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Lumixora_${templateModalTask.id}_Deliverable_Template.md`;
                    a.click();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
