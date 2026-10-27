// Lumixora Domain Specialization Registry & Adaptive Curriculum Configuration
// Defines track-specific milestones, submission schemas, 6-week cohort roadmaps,
// and AI pre-audit heuristics tailored to each candidate's selected internship domain.

export const DOMAIN_REGISTRY = {
  software_testing: {
    id: 'software_testing',
    title: 'Software Testing & QA',
    subTitle: 'Quality Assurance & Automated Verification',
    badge: 'Core Reliability Track',
    color: 'emerald',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgBadge: 'bg-emerald-500/20 text-emerald-300',
    taskTitlePlaceholder: 'e.g. End-to-End Test Suite, Cross-Browser Bug Audit & Edge Case Matrix',
    technicalNotesPlaceholder: 'Document test coverage %, bugs discovered (Severity 1-4), reproduction steps, edge cases tested, automated script results, and regression verification...',
    researchNotesPlaceholder: 'Paste AI prompts used for test case synthesis, boundary value analysis, automated Playwright/Cypress script generation, and security test vector exploration...',
    researchLinksPlaceholder: 'https://chatgpt.com/share/... (Prompt session for test matrix generation & edge case synthesis)',
    milestoneOptions: [
      { id: 'st_s1_d1', label: 'Sprint 1 - Deliverable 1: Master Test Plan & Edge Case Matrix', defaultTitle: 'Master Test Plan & Edge Case Boundary Matrix' },
      { id: 'st_s1_d2', label: 'Sprint 1 - Deliverable 2: Cross-Browser & UI/UX Defect Discovery Audit', defaultTitle: 'Cross-Browser UI/UX Bug Audit & Severity Classification' },
      { id: 'st_s2_d1', label: 'Sprint 2 - Deliverable 1: Automated API & Integration Test Suite', defaultTitle: 'Automated REST API & Integration Test Scripts' },
      { id: 'st_s2_d2', label: 'Sprint 2 - Deliverable 2: Performance, Load & Latency Stress Testing', defaultTitle: 'Performance Benchmark & Load Stress Test Report' },
      { id: 'st_s3_cap', label: 'Sprint 3 - Capstone: Comprehensive QA Audit & Release Sign-Off', defaultTitle: 'Production Release QA Attestation & Test Package' },
      { id: 'st_daily', label: 'Daily Standup Log: Daily Bug & Regression Triage', defaultTitle: 'Daily Test Execution & Defect Triage Log' }
    ],
    roadmap: [
      {
        week: 'Weeks 1-2',
        sprint: 'Sprint 1',
        title: 'Test Architecture, Defect Tracking & Manual Audits',
        tag: 'QA Foundations & Edge Cases',
        status: 'completed',
        milestones: [
          { id: 'st1', label: 'QA Environment Setup, Bug Tracking Pipeline & Linear/Jira Workflow', done: true },
          { id: 'st2', label: 'Test Case Design: Boundary Value Analysis & Equivalence Partitioning Matrix', done: true },
          { id: 'st3', label: 'Comprehensive Cross-Browser (Chrome, Safari, Firefox, Edge) & Mobile Audit', done: true },
          { id: 'st4', label: 'Authentication & Access Control Security Flaw & Null-Safety Verification', done: true }
        ],
        deliverableRequired: 'Task 01: Master Test Plan & Defect Severity Matrix'
      },
      {
        week: 'Weeks 3-4',
        sprint: 'Sprint 2',
        title: 'Automated Testing, API Verification & Regression Suites',
        tag: 'Automated QA & Integration',
        status: 'in_progress',
        milestones: [
          { id: 'st5', label: 'Automated REST API Endpoint Verification with Postman/Bruno Test Scripts', done: true },
          { id: 'st6', label: 'End-to-End (E2E) User Flow Automation with Playwright / Cypress Suites', done: true },
          { id: 'st7', label: 'Performance Latency, Network Throttling & Concurrent Load Stress Benchmarking', done: false },
          { id: 'st8', label: 'Regression Test Suite Compilation & Automated Pass/Fail Reporting', done: false }
        ],
        deliverableRequired: 'Task 02: Automated Test Suite & API Regression Report'
      },
      {
        week: 'Weeks 5-6',
        sprint: 'Sprint 3',
        title: 'Continuous QA, Security Audits & Production Sign-Off',
        tag: 'Production Verification & Release',
        status: 'upcoming',
        milestones: [
          { id: 'st9', label: 'CI/CD Automated Test Pipeline Integration on GitHub Actions / Cloudflare', done: false },
          { id: 'st10', label: 'OWASP Top 10 Security Vulnerability & Injection Attack Verification', done: false },
          { id: 'st11', label: 'Final Pre-Release Quality Attestation & User Acceptance Testing (UAT)', done: false },
          { id: 'st12', label: 'Official QA Release Package, Bug Bounty Log & Mentor Sign-Off', done: false }
        ],
        deliverableRequired: 'Task 03: Comprehensive QA Audit & Production Release Sign-Off'
      }
    ],
    rubricWeights: {
      modularityTitle: 'Test Coverage & Structure',
      qualityTitle: 'Defect Severity & Edge Cases',
      documentationTitle: 'Bug Reproduction & Loom Demo',
      securityTitle: 'Security & Regression Safety'
    }
  },

  research: {
    id: 'research',
    title: 'Research & Competitive Intelligence',
    subTitle: 'Market Landscape & Academic Synthesis',
    badge: 'Core Intelligence Track',
    color: 'cyan',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgBadge: 'bg-cyan-500/20 text-cyan-300',
    taskTitlePlaceholder: 'e.g. EdTech Market Landscape, Competitive Moat & Student Pain Point Synthesis',
    technicalNotesPlaceholder: 'Summarize qualitative & quantitative research methodologies, dataset sources, competitive benchmarks, student interview insights, and strategic product recommendations...',
    researchNotesPlaceholder: 'Paste AI prompts and session links used for market trend synthesis, competitive SWOT generation, statistical sentiment analysis, and executive summarization...',
    researchLinksPlaceholder: 'https://chatgpt.com/share/... (AI conversation on competitive matrix & student pain points)',
    milestoneOptions: [
      { id: 'res_s1_d1', label: 'Sprint 1 - Deliverable 1: Market Intelligence & Competitive Benchmarks', defaultTitle: 'Market Landscape & Direct Competitor Benchmark Matrix' },
      { id: 'res_s1_d2', label: 'Sprint 1 - Deliverable 2: Target Persona Mapping & Survey Framework', defaultTitle: 'Student & Educator Persona Mapping & Field Survey' },
      { id: 'res_s2_d1', label: 'Sprint 2 - Deliverable 1: Qualitative User Interview Analysis & Insights', defaultTitle: 'Qualitative Field Interview Synthesis & Pain Point Map' },
      { id: 'res_s2_d2', label: 'Sprint 2 - Deliverable 2: Product-Market Fit & Feature Gap Analysis', defaultTitle: 'Feature Gap Analysis & Strategic Moat Brief' },
      { id: 'res_s3_cap', label: 'Sprint 3 - Capstone: Comprehensive Market Research Paper & Advisory Report', defaultTitle: 'Capstone Research Whitepaper & GTM Strategic Brief' },
      { id: 'res_daily', label: 'Daily Standup Log: Daily Field Research & Data Synthesis', defaultTitle: 'Daily Research Progress & Dataset Synthesis Log' }
    ],
    roadmap: [
      {
        week: 'Weeks 1-2',
        sprint: 'Sprint 1',
        title: 'Market Intelligence & Competitive Landscape',
        tag: 'Secondary Research & Benchmarks',
        status: 'completed',
        milestones: [
          { id: 'res1', label: 'Research Methodology Framework, Problem Statement & Scoping Document', done: true },
          { id: 'res2', label: 'Deep Benchmark of Top 10 EdTech Platforms: Feature, Pricing & Tech Matrix', done: true },
          { id: 'res3', label: 'Target Demographic Persona Mapping (Engineering Undergraduates & Faculty)', done: true },
          { id: 'res4', label: 'Primary Survey Instrument Formulation & Sampling Distribution Strategy', done: true }
        ],
        deliverableRequired: 'Task 01: Market Landscape & Competitive Intelligence Matrix'
      },
      {
        week: 'Weeks 3-4',
        sprint: 'Sprint 2',
        title: 'User Field Research & Qualitative Synthesis',
        tag: 'Primary Discovery & Interviews',
        status: 'in_progress',
        milestones: [
          { id: 'res5', label: 'Conduct 20+ In-Depth Structured Student & Campus Placement Field Interviews', done: true },
          { id: 'res6', label: 'Qualitative Thematic Coding & Unmet Need Friction Point Mapping', done: true },
          { id: 'res7', label: 'Feature Prioritization Matrix using Kano Model & Value-vs-Effort Scoring', done: false },
          { id: 'res8', label: 'Price Elasticity, Willingness-to-Pay & Monetization Benchmark Analysis', done: false }
        ],
        deliverableRequired: 'Task 02: Field User Research & Insights Synthesis'
      },
      {
        week: 'Weeks 5-6',
        sprint: 'Sprint 3',
        title: 'Strategic Advisory & Capstone Whitepaper',
        tag: 'Synthesis & Executive Advisory',
        status: 'upcoming',
        milestones: [
          { id: 'res9', label: 'Statistical Correlation Analysis & Survey Confidence Interval Synthesis', done: false },
          { id: 'res10', label: 'Executive Go-To-Market (GTM) Strategy & Sustainable Moat Architecture', done: false },
          { id: 'res11', label: 'Comprehensive Capstone Research Whitepaper Compilation & Citations', done: false },
          { id: 'res12', label: 'Leadership Presentation to Founder & Strategic Action Roadmap', done: false }
        ],
        deliverableRequired: 'Task 03: Capstone Research Whitepaper & GTM Advisory Report'
      }
    ],
    rubricWeights: {
      modularityTitle: 'Methodology & Data Rigor',
      qualityTitle: 'Competitive Depth & Insights',
      documentationTitle: 'Executive Summary & Walkthrough',
      securityTitle: 'Source Authenticity & Citations'
    }
  },

  marketing: {
    id: 'marketing',
    title: 'Growth Marketing & Brand Strategy',
    subTitle: 'User Acquisition & Viral Campus Engagement',
    badge: 'Growth Track',
    color: 'violet',
    accentColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
    bgBadge: 'bg-violet-500/20 text-violet-300',
    taskTitlePlaceholder: 'e.g. Campus Brand Ambassador Campaign, Launch Funnel & Viral Loop Strategy',
    technicalNotesPlaceholder: 'Detail target audience demographics, campaign copy, distribution channels, conversion funnel metrics (impressions, CTR, signups, CAC), and viral engagement tactics...',
    researchNotesPlaceholder: 'Paste AI prompts used for copywriting generation, A/B test hook ideation, viral campaign mechanics, and social media engagement analytics...',
    researchLinksPlaceholder: 'https://chatgpt.com/share/... (Campaign hooks, ad copy variations & funnel models)',
    milestoneOptions: [
      { id: 'mkt_s1_d1', label: 'Sprint 1 - Deliverable 1: Brand Messaging & Campus Ambassador Playbook', defaultTitle: 'Brand Messaging Architecture & Ambassador Playbook' },
      { id: 'mkt_s1_d2', label: 'Sprint 1 - Deliverable 2: Multi-Channel Launch Funnel & Content Schedule', defaultTitle: 'Multi-Channel Acquisition Funnel & Content Calendar' },
      { id: 'mkt_s2_d1', label: 'Sprint 2 - Deliverable 1: Live Campaign Execution & Community Outreach', defaultTitle: 'Campus Ambassador Outreach & Campaign Blitz Report' },
      { id: 'mkt_s2_d2', label: 'Sprint 2 - Deliverable 2: Conversion Funnel & Paid/Organic Analytics Audit', defaultTitle: 'Conversion Funnel Drop-Off & Organic Growth Analytics' },
      { id: 'mkt_s3_cap', label: 'Sprint 3 - Capstone: Comprehensive Growth Marketing Campaign & ROI Review', defaultTitle: 'Capstone Growth Campaign, User Acquisition & ROI Audit' },
      { id: 'mkt_daily', label: 'Daily Standup Log: Daily Outreach & Campaign Metrics Check-In', defaultTitle: 'Daily Marketing Outreach & Acquisition Metrics Log' }
    ],
    roadmap: [
      {
        week: 'Weeks 1-2',
        sprint: 'Sprint 1',
        title: 'Brand Identity, Funnel Architecture & Campus Strategy',
        tag: 'Strategy & Ambassador Setup',
        status: 'completed',
        milestones: [
          { id: 'mkt1', label: 'Value Proposition Canvas & Consistent Brand Tone-of-Voice Guidelines', done: true },
          { id: 'mkt2', label: 'Campus Ambassador Recruitment Playbook & Incentivization Structure', done: true },
          { id: 'mkt3', label: 'Social Media Calendar, Organic Content Engine & Micro-Content Schedule', done: true },
          { id: 'mkt4', label: 'Attribution Architecture: Custom UTM Links, Analytics Dashboards & Tracking', done: true }
        ],
        deliverableRequired: 'Task 01: Campus Ambassador Playbook & Launch Funnel Design'
      },
      {
        week: 'Weeks 3-4',
        sprint: 'Sprint 2',
        title: 'Campaign Execution & Viral Acquisition',
        tag: 'Growth Execution & Community Outreach',
        status: 'in_progress',
        milestones: [
          { id: 'mkt5', label: 'Roll Out Multi-Campus Brand Ambassador Viral Onboarding Challenge', done: true },
          { id: 'mkt6', label: 'Execute Interactive Reels, Polls & Student Problem Micro-Content Blitz', done: true },
          { id: 'mkt7', label: 'Direct Student Community Activation across WhatsApp, Discord & LinkedIn', done: false },
          { id: 'mkt8', label: 'Conversion Rate Optimization (CRO) & Registration Drop-Off Funnel Fixes', done: false }
        ],
        deliverableRequired: 'Task 02: Multi-Channel Acquisition Campaign Performance Report'
      },
      {
        week: 'Weeks 5-6',
        sprint: 'Sprint 3',
        title: 'Scale, Retention & Capstone Growth Audit',
        tag: 'Retention & Scaled Attribution',
        status: 'upcoming',
        milestones: [
          { id: 'mkt9', label: 'Referral Engine Mechanics & Viral Loop Coefficient (K-factor) Optimization', done: false },
          { id: 'mkt10', label: 'Cohort Retention Curve Analysis & User Re-Engagement Workflow Design', done: false },
          { id: 'mkt11', label: 'College Fest / Technical Symposium Partnership & Sponsorship Proposals', done: false },
          { id: 'mkt12', label: 'Capstone Growth Marketing Portfolio & Comprehensive CAC/LTV Attribution Audit', done: false }
        ],
        deliverableRequired: 'Task 03: Final Capstone Growth Campaign & Attribution Audit'
      }
    ],
    rubricWeights: {
      modularityTitle: 'Funnel Structure & Targeting',
      qualityTitle: 'Copywriting & Hook Virality',
      documentationTitle: 'Campaign Metrics & Loom Demo',
      securityTitle: 'Brand Consistency & Attribution'
    }
  },

  content_creation: {
    id: 'content_creation',
    title: 'Content Creation & Visual Media',
    subTitle: 'Multimedia Storytelling & Visual Communication',
    badge: 'Creative Track',
    color: 'pink',
    accentColor: 'text-pink-400',
    borderColor: 'border-pink-500/30',
    bgBadge: 'bg-pink-500/20 text-pink-300',
    taskTitlePlaceholder: 'e.g. Technical Product Explainer Video, Storyboard & Social Carousel Suite',
    technicalNotesPlaceholder: 'Summarize visual design concepts, tools utilized (Figma, Premiere, After Effects, Canva), narrative structure, script hooks, viewer feedback, and engagement metrics...',
    researchNotesPlaceholder: 'Paste AI prompts used for creative scriptwriting, storyboard ideation, Midjourney/DALL-E image prompts, and hook optimization...',
    researchLinksPlaceholder: 'https://chatgpt.com/share/... (Script drafts, viral hooks & visual asset concepts)',
    milestoneOptions: [
      { id: 'cc_s1_d1', label: 'Sprint 1 - Deliverable 1: Visual Design System & Brand Asset Guidelines', defaultTitle: 'Visual Identity System & Brand Asset Guidelines' },
      { id: 'cc_s1_d2', label: 'Sprint 1 - Deliverable 2: Video Storyboards & Copywriting Script Drafts', defaultTitle: 'Video Storyboards & Scriptwriting Drafts Package' },
      { id: 'cc_s2_d1', label: 'Sprint 2 - Deliverable 1: High-Fidelity Product Walkthrough & Demo Videos', defaultTitle: 'High-Fidelity Product Walkthrough Video & Motion Assets' },
      { id: 'cc_s2_d2', label: 'Sprint 2 - Deliverable 2: Viral Carousel Infographics & Student Memes', defaultTitle: 'Multi-Slide Carousel Infographics & Campus Media Suite' },
      { id: 'cc_s3_cap', label: 'Sprint 3 - Capstone: Comprehensive Multimedia Brand Showcase Portfolio', defaultTitle: 'Multimedia Brand Impact Showcase & Video Portfolio' },
      { id: 'cc_daily', label: 'Daily Standup Log: Daily Asset Production & Editing Check-In', defaultTitle: 'Daily Creative Asset Production & Editing Log' }
    ],
    roadmap: [
      {
        week: 'Weeks 1-2',
        sprint: 'Sprint 1',
        title: 'Visual Identity, Storyboarding & Narrative Direction',
        tag: 'Creative Foundations & Design System',
        status: 'completed',
        milestones: [
          { id: 'cc1', label: 'Brand Visual Palette, Typography Guidelines & Asset Component Library', done: true },
          { id: 'cc2', label: 'Product Explainer Storyboarding & High-Converting Narrative Scripting', done: true },
          { id: 'cc3', label: 'Campus Culture Micro-Content Frameworks & Visual Hook Library', done: true },
          { id: 'cc4', label: 'Motion Graphic Presets & Vector Icon Repository in Figma & After Effects', done: true }
        ],
        deliverableRequired: 'Task 01: Visual Asset Guide & Video Storyboard Package'
      },
      {
        week: 'Weeks 3-4',
        sprint: 'Sprint 2',
        title: 'Production, Video Editing & Creative Asset Drops',
        tag: 'Multimedia Production & Motion Graphics',
        status: 'in_progress',
        milestones: [
          { id: 'cc5', label: 'Produce 3 High-Fidelity 60s Product Walkthrough & Feature Demo Videos', done: true },
          { id: 'cc6', label: 'Design 10 Educational Multi-Slide LinkedIn / Instagram Carousel Guides', done: true },
          { id: 'cc7', label: 'Produce High-Relatability Campus Tech Memes & Short-Form Video Reels', done: false },
          { id: 'cc8', label: 'Professional Audio Mastering, Subtitling & Dynamic Motion SFX Layering', done: false }
        ],
        deliverableRequired: 'Task 02: Multimedia Content Suite & Video Assets'
      },
      {
        week: 'Weeks 5-6',
        sprint: 'Sprint 3',
        title: 'Packaging, Distribution & Capstone Showcase',
        tag: 'Packaging & Portfolio Showcase',
        status: 'upcoming',
        milestones: [
          { id: 'cc9', label: 'Platform Specific Optimization (YouTube Shorts, Reels, LinkedIn Vectors)', done: false },
          { id: 'cc10', label: 'Audience Watch-Time Retention Analysis & Visual Hook Iteration', done: false },
          { id: 'cc11', label: 'Master Content Library Cataloging with Scalable Reusable Templates', done: false },
          { id: 'cc12', label: 'Capstone Creative Media Portfolio & Brand Narrative Impact Presentation', done: false }
        ],
        deliverableRequired: 'Task 03: Capstone Creative Portfolio & Brand Showcase'
      }
    ],
    rubricWeights: {
      modularityTitle: 'Visual Design & Aesthetics',
      qualityTitle: 'Storytelling & Hook Retention',
      documentationTitle: 'Loom Walkthrough & Assets',
      securityTitle: 'Brand Consistency & Copyright'
    }
  },

  full_stack: {
    id: 'full_stack',
    title: 'Full-Stack Software Architecture',
    subTitle: 'Modern Web, Reactive Systems & Cloud Databases',
    badge: 'Engineering Track',
    color: 'indigo',
    accentColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgBadge: 'bg-indigo-500/20 text-indigo-300',
    taskTitlePlaceholder: 'e.g. Authentication Flow & PostgreSQL Row-Level Security',
    technicalNotesPlaceholder: 'Summarize architectural challenges solved, database schemas modified, components engineered, edge cases handled, and performance optimizations...',
    researchNotesPlaceholder: 'Paste AI prompts used for architectural design, SQL schema optimization, React component refactoring, and security verification...',
    researchLinksPlaceholder: 'https://chatgpt.com/share/... (System design, database schemas & API specs)',
    milestoneOptions: [
      { id: 'fs_s1_d1', label: 'Sprint 1 - Deliverable 1: Application Portal & Core Architecture', defaultTitle: 'Application Portal & Core System Architecture' },
      { id: 'fs_s1_d2', label: 'Sprint 1 - Deliverable 2: Database Schema & Authentication Layer', defaultTitle: 'Database Schema, Auth Guards & PIN Security' },
      { id: 'fs_s2_d1', label: 'Sprint 2 - Deliverable 1: Reactive State & Deliverables Ledger', defaultTitle: 'Reactive State Layer & Deliverables Ledger' },
      { id: 'fs_s2_d2', label: 'Sprint 2 - Deliverable 2: Real-Time Cache Sync & Offline Fallbacks', defaultTitle: 'Real-Time Sync Engine & LocalStorage Cache Fallback' },
      { id: 'fs_s3_cap', label: 'Sprint 3 - Capstone: Cloudflare Edge Global Deployment & Security Sign-Off', defaultTitle: 'Production Cloudflare Pages Edge Deployment & Capstone' },
      { id: 'fs_daily', label: 'Daily Standup Log: Daily Code Shipping & Architecture Check-In', defaultTitle: 'Daily Code Shipping & Component Architecture Log' }
    ],
    roadmap: [
      {
        week: 'Weeks 1-2',
        sprint: 'Sprint 1',
        title: 'Foundations, Data Models & Architecture',
        tag: 'Core Systems',
        status: 'completed',
        milestones: [
          { id: 'fs1', label: 'Dev Environment, Git Branching & Conventional Commits', done: true },
          { id: 'fs2', label: 'Multi-Database Layer (Firestore Realtime & Supabase PostgreSQL)', done: true },
          { id: 'fs3', label: 'Responsive Glassmorphic UI & Role-Based Guard Layouts', done: true },
          { id: 'fs4', label: 'Security PIN Authentication & Role Access Pass Generation', done: true }
        ],
        deliverableRequired: 'Task 01: Application Portal & Core Architecture'
      },
      {
        week: 'Weeks 3-4',
        sprint: 'Sprint 2',
        title: 'Reactive Engineering & Deliverables Ledger',
        tag: 'Feature Delivery',
        status: 'in_progress',
        milestones: [
          { id: 'fs5', label: 'Live Task Submission Pipeline with GitHub PR & Loom Embeds', done: true },
          { id: 'fs6', label: 'AI Research Synthesis Engine with ChatGPT/Claude Session Links', done: true },
          { id: 'fs7', label: 'Mentor Review & Multi-Criteria Scoring (0-100 Ledger)', done: false },
          { id: 'fs8', label: 'Automated Offline Fallback & Cache Synchronization', done: false }
        ],
        deliverableRequired: 'Task 02: Deliverables Ledger & Review Flow'
      },
      {
        week: 'Weeks 5-6',
        sprint: 'Sprint 3',
        title: 'Edge Deployment, Cryptography & Capstone Accreditation',
        tag: 'Production & Verification',
        status: 'upcoming',
        milestones: [
          { id: 'fs9', label: 'Cloudflare Pages Global Edge Deployment & Performance Tuning', done: false },
          { id: 'fs10', label: 'SHA-256 Tamper-Proof Cryptographic Certificate Verification', done: false },
          { id: 'fs11', label: 'Official Letter of Recommendation (LOR) & A4 Vector Letterhead', done: false },
          { id: 'fs12', label: '1-Click LinkedIn Add to Profile & Social Proof Ecosystem', done: false }
        ],
        deliverableRequired: 'Task 03: Final Capstone & Verifiable Credential'
      }
    ],
    rubricWeights: {
      modularityTitle: 'Architecture & Modularity',
      qualityTitle: 'Code Quality & Resilience',
      documentationTitle: 'Documentation & Loom Proof',
      securityTitle: 'Security & Null-Safety Guardrails'
    }
  },

  ai_ml: {
    id: 'ai_ml',
    title: 'AI & Autonomous Systems Engineering',
    subTitle: 'Large Language Models, Multi-Agent Systems & RAG',
    badge: 'AI Labs Track',
    color: 'cyan',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgBadge: 'bg-cyan-500/20 text-cyan-300',
    taskTitlePlaceholder: 'e.g. Multi-Agent RAG Pipeline with Semantic Vector Search & Evaluation Matrix',
    technicalNotesPlaceholder: 'Detail model architecture, vector embeddings pipeline, context window management, tool calling logic, hallucination mitigations, and latency benchmarks...',
    researchNotesPlaceholder: 'Paste AI reasoning logs, system prompt iterations, evaluation benchmarks, and token cost optimizations...',
    researchLinksPlaceholder: 'https://chatgpt.com/share/... or https://aistudio.google.com/...',
    milestoneOptions: [
      { id: 'ai_s1_d1', label: 'Sprint 1 - Deliverable 1: Vector Embeddings & RAG Architecture Pipeline', defaultTitle: 'Vector Embeddings & Semantic Search Pipeline' },
      { id: 'ai_s1_d2', label: 'Sprint 1 - Deliverable 2: Prompt Engineering & Guardrail Sanitization', defaultTitle: 'Prompt Architecture & Input/Output Guardrails' },
      { id: 'ai_s2_d1', label: 'Sprint 2 - Deliverable 1: Autonomous Multi-Agent Tool Calling Engine', defaultTitle: 'Multi-Agent Tool Orchestration & Workflow Engine' },
      { id: 'ai_s2_d2', label: 'Sprint 2 - Deliverable 2: Model Evaluation, Latency & Precision Benchmarks', defaultTitle: 'Model Precision, Recall & Cost/Latency Benchmarks' },
      { id: 'ai_s3_cap', label: 'Sprint 3 - Capstone: Production AI Agent Deployment & Safety Audit', defaultTitle: 'Production Autonomous AI Agent & Safety Verification' },
      { id: 'ai_daily', label: 'Daily Standup Log: Daily Model Training & Prompt Engineering Check-In', defaultTitle: 'Daily Agent Development & Prompt Tuning Log' }
    ],
    roadmap: [
      {
        week: 'Weeks 1-2',
        sprint: 'Sprint 1',
        title: 'Vector Embeddings, RAG & Context Architecture',
        tag: 'Model Architecture & Retrieval',
        status: 'completed',
        milestones: [
          { id: 'ai1', label: 'Vector Database Integration (Pinecone/Chroma) & Document Chunking Strategies', done: true },
          { id: 'ai2', label: 'Hybrid Semantic Search & Reciprocal Rank Fusion (RRF) Pipeline', done: true },
          { id: 'ai3', label: 'System Prompt Engineering, Persona Definition & Anti-Hallucination Constraints', done: true },
          { id: 'ai4', label: 'Input Sanitization, PII Redaction & Adversarial Injection Defenses', done: true }
        ],
        deliverableRequired: 'Task 01: Vector Embeddings & Semantic Search Pipeline'
      },
      {
        week: 'Weeks 3-4',
        sprint: 'Sprint 2',
        title: 'Multi-Agent Orchestration & Tool Execution',
        tag: 'Autonomous Workflows & Execution',
        status: 'in_progress',
        milestones: [
          { id: 'ai5', label: 'Function Calling & Structured JSON Output Verification Schema', done: true },
          { id: 'ai6', label: 'Autonomous Agent ReAct (Reason + Act) Loop & Scratchpad Memory', done: true },
          { id: 'ai7', label: 'Model Performance Benchmarking: Latency, Token Usage & Accuracy Matrix', done: false },
          { id: 'ai8', label: 'Human-in-the-Loop Approval Interceptors for High-Impact Actions', done: false }
        ],
        deliverableRequired: 'Task 02: Multi-Agent Tool Orchestration & Workflow Engine'
      },
      {
        week: 'Weeks 5-6',
        sprint: 'Sprint 3',
        title: 'Production Edge Inference & Capstone Deployment',
        tag: 'Edge AI & Safety Attestation',
        status: 'upcoming',
        milestones: [
          { id: 'ai9', label: 'Cloudflare Workers AI Edge Inference & Streaming SSE Integration', done: false },
          { id: 'ai10', label: 'Automated Evaluation Suite using LLM-as-a-Judge Rubrics', done: false },
          { id: 'ai11', label: 'Production Cost Throttling, Rate Limiting & User Quota Guardrails', done: false },
          { id: 'ai12', label: 'Capstone Autonomous AI Agent System Architecture & Safety Attestation', done: false }
        ],
        deliverableRequired: 'Task 03: Production Autonomous AI Agent & Safety Verification'
      }
    ],
    rubricWeights: {
      modularityTitle: 'Pipeline Architecture & RAG',
      qualityTitle: 'Hallucination Defense & Accuracy',
      documentationTitle: 'Prompt Logs & Loom Walkthrough',
      securityTitle: 'Guardrails & Adversarial Safety'
    }
  },

  cloud_devops: {
    id: 'cloud_devops',
    title: 'Cloud Systems & DevOps Infrastructure',
    subTitle: 'Edge Computing, CI/CD & Zero-Trust Cloud Architecture',
    badge: 'DevOps Track',
    color: 'amber',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgBadge: 'bg-amber-500/20 text-amber-300',
    taskTitlePlaceholder: 'e.g. Cloudflare Edge Workers, Terraform IaC & Zero-Trust Security Pipeline',
    technicalNotesPlaceholder: 'Summarize cloud infrastructure deployed, latency benchmarks, edge cache hit rates, CI/CD pipeline automation, and security policies implemented...',
    researchNotesPlaceholder: 'Paste AI prompts used for Terraform scripting, Docker multi-stage build optimization, and zero-trust policy architecture...',
    researchLinksPlaceholder: 'https://chatgpt.com/share/... (Infrastructure architecture & deployment scripts)',
    milestoneOptions: [
      { id: 'cd_s1_d1', label: 'Sprint 1 - Deliverable 1: Infrastructure as Code & Cloudflare Edge Setup', defaultTitle: 'Cloudflare Pages & Edge Infrastructure Architecture' },
      { id: 'cd_s1_d2', label: 'Sprint 1 - Deliverable 2: Automated CI/CD Pipeline & GitHub Actions', defaultTitle: 'Automated CI/CD Deployment Pipeline & Security Scanning' },
      { id: 'cd_s2_d1', label: 'Sprint 2 - Deliverable 1: Edge Caching, CDN & Performance Tuning', defaultTitle: 'Global Edge Caching & Sub-100ms Latency Tuning' },
      { id: 'cd_s2_d2', label: 'Sprint 2 - Deliverable 2: Zero-Trust Security, WAF & IAM Policies', defaultTitle: 'Zero-Trust Access Architecture & Cloudflare WAF Rules' },
      { id: 'cd_s3_cap', label: 'Sprint 3 - Capstone: Production Cloud Resiliency & Disaster Recovery', defaultTitle: 'Production Edge Resiliency, Uptime SLA & Capstone' },
      { id: 'cd_daily', label: 'Daily Standup Log: Daily Cloud Deployment & Pipeline Check-In', defaultTitle: 'Daily DevOps Infrastructure & Pipeline Monitoring Log' }
    ],
    roadmap: [
      {
        week: 'Weeks 1-2',
        sprint: 'Sprint 1',
        title: 'Edge Infrastructure, DNS & CI/CD Pipelines',
        tag: 'Infrastructure Foundations',
        status: 'completed',
        milestones: [
          { id: 'cd1', label: 'Cloudflare DNS, Custom Domains (lumixora.in) & SSL/TLS Full Strict Mode', done: true },
          { id: 'cd2', label: 'Automated GitHub Actions CI/CD Pipeline to Cloudflare Pages & Previews', done: true },
          { id: 'cd3', label: 'Environment Variable Secret Management & Encryption Key Rotation', done: true },
          { id: 'cd4', label: 'Vite Build Optimization & Asset Chunking for Low-Bandwidth Networks', done: true }
        ],
        deliverableRequired: 'Task 01: Cloudflare Pages & Edge Infrastructure Architecture'
      },
      {
        week: 'Weeks 3-4',
        sprint: 'Sprint 2',
        title: 'Edge Caching, Security WAF & Performance',
        tag: 'Edge Acceleration & WAF',
        status: 'in_progress',
        milestones: [
          { id: 'cd5', label: 'Custom HTTP Headers, CSP (Content Security Policy) & HSTS Hardening', done: true },
          { id: 'cd6', label: 'Edge Cache-Control Headers, Gzip/Brotli Compression & Asset CDN Tuning', done: true },
          { id: 'cd7', label: 'Cloudflare Web Application Firewall (WAF) & Bot Mitigation Configuration', done: false },
          { id: 'cd8', label: 'Health Monitoring, Real User Monitoring (RUM) & Sentry Telemetry Alerts', done: false }
        ],
        deliverableRequired: 'Task 02: Global Edge Caching & Sub-100ms Latency Tuning'
      },
      {
        week: 'Weeks 5-6',
        sprint: 'Sprint 3',
        title: 'Disaster Recovery, High Availability & Capstone',
        tag: 'SLA & Production Sign-Off',
        status: 'upcoming',
        milestones: [
          { id: 'cd9', label: 'Multi-Region Disaster Recovery & Automated Database Backup Procedures', done: false },
          { id: 'cd10', label: 'Zero-Downtime Blue/Green Deployments with Instant Rollback Capabilities', done: false },
          { id: 'cd11', label: '99.99% Uptime SLA Verification & Chaos Engineering Fault Injection', done: false },
          { id: 'cd12', label: 'Capstone Cloud Infrastructure Package & Security Audit Sign-Off', done: false }
        ],
        deliverableRequired: 'Task 03: Production Edge Resiliency, Uptime SLA & Capstone'
      }
    ],
    rubricWeights: {
      modularityTitle: 'Infrastructure Modularity & IaC',
      qualityTitle: 'Performance & Latency SLA',
      documentationTitle: 'Deployment Specs & Loom Demo',
      securityTitle: 'Zero-Trust & WAF Security'
    }
  },

  ui_ux: {
    id: 'ui_ux',
    title: 'UI/UX & Product Design',
    subTitle: 'Design Systems, Human-Centered Interaction & Prototyping',
    badge: 'Design Track',
    color: 'purple',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgBadge: 'bg-purple-500/20 text-purple-300',
    taskTitlePlaceholder: 'e.g. Glassmorphic Design System, Micro-Interactions & Usability Prototypes',
    technicalNotesPlaceholder: 'Summarize visual hierarchy decisions, accessibility contrast ratios (WCAG AAA), component tokenization, user testing results, and interactive micro-animations...',
    researchNotesPlaceholder: 'Paste AI prompts used for user journey synthesis, heuristic evaluations, and interactive component state exploration...',
    researchLinksPlaceholder: 'https://figma.com/... or https://chatgpt.com/share/...',
    milestoneOptions: [
      { id: 'ux_s1_d1', label: 'Sprint 1 - Deliverable 1: Design System Component Library & Style Guide', defaultTitle: 'Dark Glassmorphic Design System & Token Library' },
      { id: 'ux_s1_d2', label: 'Sprint 1 - Deliverable 2: Wireframes & High-Fidelity User Flows', defaultTitle: 'High-Fidelity User Journey Wireframes & Clickable Flow' },
      { id: 'ux_s2_d1', label: 'Sprint 2 - Deliverable 1: Interactive Micro-Animations & Responsive Prototypes', defaultTitle: 'Interactive Micro-Interactions & Responsive Prototyping' },
      { id: 'ux_s2_d2', label: 'Sprint 2 - Deliverable 2: Usability Testing & Accessibility (WCAG) Audit', defaultTitle: 'Usability Heuristic Evaluation & WCAG 2.1 AAA Audit' },
      { id: 'ux_s3_cap', label: 'Sprint 3 - Capstone: Comprehensive Product UI/UX Design Case Study', defaultTitle: 'Capstone Product Design Case Study & Figma System' },
      { id: 'ux_daily', label: 'Daily Standup Log: Daily UI Component Craft & Usability Testing', defaultTitle: 'Daily UI/UX Component Exploration & Usability Log' }
    ],
    roadmap: [
      {
        week: 'Weeks 1-2',
        sprint: 'Sprint 1',
        title: 'Design System Foundations & Wireframing',
        tag: 'Design Architecture & Tokens',
        status: 'completed',
        milestones: [
          { id: 'ux1', label: 'Color Tokens, Typography Hierarchy & Elevation Shadow Tokens in Figma', done: true },
          { id: 'ux2', label: 'Atomic Component Library (Buttons, Inputs, Modals, Badges, Tooltips)', done: true },
          { id: 'ux3', label: 'Information Architecture & Low-Fidelity User Journey Wireframing', done: true },
          { id: 'ux4', label: 'Dark Mode Glassmorphic Spatial Layouts & Responsive Breakpoints', done: true }
        ],
        deliverableRequired: 'Task 01: Dark Glassmorphic Design System & Token Library'
      },
      {
        week: 'Weeks 3-4',
        sprint: 'Sprint 2',
        title: 'High-Fidelity Prototyping & Micro-Interactions',
        tag: 'Interactive Prototyping & Motion',
        status: 'in_progress',
        milestones: [
          { id: 'ux5', label: 'High-Fidelity Clickable Interactive Prototypes with Smart Animate in Figma', done: true },
          { id: 'ux6', label: 'Fluid Micro-Interactions (Hover States, Skeleton Loaders, Button Ripple Effects)', done: true },
          { id: 'ux7', label: 'Conduct 10 Usability Testing Sessions & Task Completion Heatmap Analysis', done: false },
          { id: 'ux8', label: 'WCAG 2.1 AAA Accessibility Color Contrast & Screen-Reader Verification', done: false }
        ],
        deliverableRequired: 'Task 02: Interactive Micro-Interactions & Responsive Prototyping'
      },
      {
        week: 'Weeks 5-6',
        sprint: 'Sprint 3',
        title: 'Design System Handoff & Capstone Case Study',
        tag: 'Handoff & Portfolio Case Study',
        status: 'upcoming',
        milestones: [
          { id: 'ux9', label: 'Developer Handoff Documentation: CSS Variables, Token Specs & Asset Exports', done: false },
          { id: 'ux10', label: 'Multi-Device Polish (Desktop, Tablet, Mobile PWA Visual Consistency)', done: false },
          { id: 'ux11', label: 'Comprehensive UX Case Study Documentation with Problem & Impact Metrics', done: false },
          { id: 'ux12', label: 'Capstone Product Design Presentation to Founder & Design Review Board', done: false }
        ],
        deliverableRequired: 'Task 03: Capstone Product Design Case Study & Figma System'
      }
    ],
    rubricWeights: {
      modularityTitle: 'Design System & Component Tokens',
      qualityTitle: 'Visual Hierarchy & Polish',
      documentationTitle: 'User Journey Specs & Figma Link',
      securityTitle: 'Accessibility (WCAG) & Contrast'
    }
  }
};

/**
 * Intelligently resolves any raw track or role string to one of the canonical domain keys
 */
export const resolveDomain = (trackOrRole) => {
  if (!trackOrRole || typeof trackOrRole !== 'string') return 'software_testing';
  const clean = trackOrRole.toLowerCase().trim();

  if (clean.includes('test') || clean.includes('qa') || clean.includes('quality')) return 'software_testing';
  if (clean.includes('research') || clean.includes('analyst') || clean.includes('market')) return 'research';
  if (clean.includes('market') || clean.includes('growth') || clean.includes('brand') || clean.includes('acquisition')) return 'marketing';
  if (clean.includes('content') || clean.includes('media') || clean.includes('video') || clean.includes('creative') || clean.includes('copy')) return 'content_creation';
  if (clean.includes('ai') || clean.includes('artificial') || clean.includes('machine learning') || clean.includes('llm')) return 'ai_ml';
  if (clean.includes('cloud') || clean.includes('devops') || clean.includes('infra') || clean.includes('docker')) return 'cloud_devops';
  if (clean.includes('ui') || clean.includes('ux') || clean.includes('design') || clean.includes('figma')) return 'ui_ux';
  if (clean.includes('full') || clean.includes('stack') || clean.includes('web') || clean.includes('developer') || clean.includes('software')) return 'full_stack';

  // Default fallback to software testing or full stack
  return 'software_testing';
};

/**
 * Returns the full domain configuration object
 */
export const getDomainConfig = (trackOrRole) => {
  const domainKey = resolveDomain(trackOrRole);
  return DOMAIN_REGISTRY[domainKey] || DOMAIN_REGISTRY.software_testing;
};

/**
 * Returns available milestone options for a given domain
 */
export const getMilestonesForDomain = (trackOrRole) => {
  const cfg = getDomainConfig(trackOrRole);
  return cfg.milestoneOptions || [];
};

/**
 * Returns the 6-week cohort roadmap for a given domain
 */
export const getRoadmapForDomain = (trackOrRole) => {
  const cfg = getDomainConfig(trackOrRole);
  return cfg.roadmap || [];
};

/**
 * Domain-adaptive AI Pre-Audit evaluator
 */
export const runDomainAiPreAudit = (submission, trackOrRole) => {
  const domain = getDomainConfig(trackOrRole || submission?.track || submission?.category);
  const code = (submission?.codeSnippet || submission?.description || '').trim();
  const notes = (submission?.researchNotes || '').trim();
  const hasPr = Boolean(submission?.githubUrl);
  const hasDemo = Boolean(submission?.liveDemoUrl);
  const hasLoom = Boolean(submission?.loomUrl);
  const hasResearch = Boolean(submission?.researchChatLinks || notes.length > 30);

  let score1 = 85; // Modularity / Structure
  let score2 = 88; // Quality / Domain Depth
  let score3 = 82; // Documentation / Loom
  let score4 = 95; // Security / Brand / Standard

  if (hasPr || code.length > 50) {
    score1 += 7;
    score2 += 6;
  }
  if (hasDemo) score1 += 5;
  if (hasLoom) score3 += 10;
  if (hasResearch) score3 += 6;

  score1 = Math.min(100, score1);
  score2 = Math.min(100, score2);
  score3 = Math.min(100, score3);

  const overallScore = Math.round((score1 + score2 + score3 + score4) / 4);

  const tips = [];
  if (!hasLoom) {
    tips.push(`Attach a 2-minute Loom walkthrough explaining your ${domain.title} deliverables to your mentor (+5 score boost).`);
  }
  if (!hasResearch) {
    tips.push(`Paste your AI research chat link (ChatGPT/Claude/Gemini) to document prompt engineering and domain research.`);
  }
  if (!hasDemo && (domain.id === 'full_stack' || domain.id === 'software_testing' || domain.id === 'ui_ux')) {
    tips.push('Provide a live deployed link or Figma prototype for instant mentor verification.');
  }
  if (notes.length < 50) {
    tips.push(`Elaborate on your ${domain.title} findings, edge cases, methodology, and trade-offs in your technical notes.`);
  }
  if (tips.length === 0) {
    tips.push(`Outstanding ${domain.title} deliverable quality. Work is ready for final mentor sign-off!`);
  }

  return {
    domainId: domain.id,
    domainTitle: domain.title,
    overallScore,
    score1,
    score1Title: domain.rubricWeights.modularityTitle,
    score2,
    score2Title: domain.rubricWeights.qualityTitle,
    score3,
    score3Title: domain.rubricWeights.documentationTitle,
    score4,
    score4Title: domain.rubricWeights.securityTitle,
    verdict: overallScore >= 90 ? `Ready for Mentor Review (${domain.title} Distinction Tier)` : `Good Progress (${domain.title} Enhancements Suggested)`,
    recommendations: tips
  };
};
