import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Sparkles, Copy, Download, Check, ShieldCheck, 
  HelpCircle, Presentation, FileText, ChevronRight, ChevronLeft, Layers,
  Terminal, ArrowRight, Share2, Award, Mic, Volume2, VolumeX,
  CheckCircle2, AlertTriangle, TrendingUp, Cpu, Zap, Database,
  Lock, Clock, ExternalLink, Grid, Eye, Code2, Server, MessageSquareQuote
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { callAICompletion } from '../services/aiService';

// Default smart suggestions per domain / hackathon keyword
function getDefaultProjectContext(hackathon) {
  const title = (hackathon?.title || '').toLowerCase();
  const cat = (hackathon?.category || '').toLowerCase();
  const org = (hackathon?.organizer || '').toLowerCase();

  if (title.includes('goldman') || title.includes('fintech') || title.includes('quant') || cat.includes('fintech')) {
    return {
      title: 'AlphaYield: Real-Time Algorithmic Risk Telemetry & Settlement Engine',
      track: 'FinTech & High-Frequency Quantitative Engineering',
      stack: 'React, TypeScript, Python FastAPI, PostgreSQL, Apache Kafka, PyTorch'
    };
  }
  if (title.includes('sih') || title.includes('smart india') || title.includes('gov') || cat.includes('smart city')) {
    return {
      title: 'OmniFlow: Intelligent Campus Infrastructure & Resource Routing Mesh',
      track: 'Smart Education & Autonomous Campus Automation',
      stack: 'React, Vite, Node.js, FastAPI, Supabase Realtime, OpenCV, Gemini 1.5 Flash'
    };
  }
  if (title.includes('cyber') || title.includes('security') || cat.includes('cybersecurity')) {
    return {
      title: 'AegisGuard: Real-Time Zero-Trust Endpoint Telemetry & Threat Mesh',
      track: 'Cybersecurity, Cloud Governance & Zero-Trust Defense',
      stack: 'Rust, Python, React, WebSockets, Supabase, eBPF Kernel Probes'
    };
  }
  if (title.includes('flipkart') || title.includes('amazon') || title.includes('grid') || cat.includes('ai') || cat.includes('ml')) {
    return {
      title: 'NeuroPulse: Edge-Native Multi-Modal Diagnostic & Predictive Intelligence',
      track: 'Generative AI & Autonomous Agent Orchestration',
      stack: 'React, Tailwind, Python FastAPI, ONNX Runtime, Supabase, Groq Llama-3.3'
    };
  }
  return {
    title: 'AegisFlow: High-Concurrency Collaborative Intelligence Workspace',
    track: hackathon?.category || 'Open Innovation & Cloud Architecture',
    stack: 'React, Tailwind, Node.js, Python FastAPI, Supabase, Gemini 1.5 Pro'
  };
}

// Generate deterministic high-impact structured deck
function generateHighImpactDeckData(hackathon, projectTitle, trackTheme, techStack) {
  const slides = [
    {
      id: 1,
      number: '01',
      title: 'The Urgent Problem & Measurable Market Pain',
      tag: 'Problem & Opportunity',
      icon: AlertTriangle,
      headline: `Critical Bottlenecks in ${trackTheme} Cost Indian Enterprises Over ₹4,200 Cr Annually in Lost Productivity.`,
      points: [
        '84% of surveyed teams experience manual synchronization latency exceeding 72 hours per sprint cycle.',
        'Existing enterprise legacy tools are fragmented, high-friction, and completely fail offline or on low-bandwidth networks.',
        'High compliance friction: Over 65% of engineering organizations struggle with auditing decentralized developer telemetry.'
      ],
      visualIdea: 'Split-Screen Graphic: Left illustrates red siloed bottlenecks with "72h Delay"; Right shows unified green real-time stream.',
      speakerScript: `Respected Judges, every single day, over 2 million engineers and students waste 14 hours every sprint trying to synchronize fragmented telemetry. Legacy enterprise suites are bloated and cost thousands of dollars per seat. Today, we built ${projectTitle}—the first sub-second edge-native pipeline engineered specifically to solve this.`
    },
    {
      id: 2,
      number: '02',
      title: 'The Solution & High-Concurrency Architecture',
      tag: 'Architecture & Engineering',
      icon: Cpu,
      headline: 'Zero-Friction Intelligent Pipeline with Guaranteed Sub-50ms Edge Resolution.',
      points: [
        `Client Tier: Modern React + Vite SPA with optimistic UI updates and offline IndexedDB sync.`,
        `Compute & Gateway: Asynchronous Python FastAPI microservices with worker threads and connection pooling.`,
        `Intelligence Layer: Hybrid LLM routing combining local quantized inference with cloud fallback for complex queries.`
      ],
      visualIdea: '3-Tier Interactive Architecture Flow: Client SPA ➜ FastAPI Gateway with Connection Pool ➜ Supabase / Edge Cache with Realtime Fanout.',
      speakerScript: `Instead of relying on fragile monolithic servers, our architecture deploys lightweight edge worker agents that preprocess incoming streams locally. This cuts end-to-end latency by 78% and reduces cloud egress costs to near zero, while maintaining 60FPS fluid UI responsiveness.`
    },
    {
      id: 3,
      number: '03',
      title: 'Live Working MVP & Competitive Differentiation',
      tag: 'Live Demo & Moat',
      icon: Zap,
      headline: 'Fully Functional Working Prototype Operating Live Under Simulated High-Concurrency Load.',
      points: [
        'Real-time ingestion and validation completed in under 42 milliseconds on live edge instances.',
        'Zero-configuration one-click onboarding: Teams connect in under 60 seconds with no complex CLI setups.',
        'Graceful degradation: Operates offline with deterministic local caches during complete external network drops.'
      ],
      visualIdea: 'Live Terminal & Metrics Widget: Show live latency ticker (42ms), active WebSocket connections, and zero packet loss.',
      speakerScript: `What you see on our screen right now is not a static Figma mockup. It is live code running against our edge cluster. Watch as we trigger a complex multi-stage workload: processed, validated, and synchronized across distributed clients in under 50 milliseconds.`
    },
    {
      id: 4,
      number: '04',
      title: 'Scalability, Security & Unit Economics',
      tag: 'Unit Economics & Scale',
      icon: ShieldCheck,
      headline: 'Enterprise Zero-Trust Guardrails with Predictable ₹0.02 Unit Cost Per 1,000 Transactions.',
      points: [
        'Stateless horizontal autoscaling validated up to 50,000 simultaneous simulated connections with load shedding.',
        'Enterprise Security: End-to-end AES-256-GCM encryption at rest with SHA-256 HMAC payload verification.',
        'Semantic Caching: Eliminates duplicate inference calls by 74%, driving marginal user session compute cost down to ₹0.15.'
      ],
      visualIdea: 'Bar Chart Comparison: Cost per 10k transactions (Legacy: ₹140 vs Our Solution: ₹1.80) + Security Shield badge.',
      speakerScript: `Judges frequently ask if AI prototypes are economically viable at scale. Because our engine caches common embeddings and routes simple queries to local quantized models, our marginal cost per user query is less than two paise, preserving 82% gross margins.`
    },
    {
      id: 5,
      number: '05',
      title: 'Business Moat & 12-Month Execution Roadmap',
      tag: 'Roadmap & Future',
      icon: TrendingUp,
      headline: `Defensible Proprietary Data Flywheel with a Clear Campus-to-Enterprise Rollout Strategy.`,
      points: [
        'Month 1-2 (Phase 1): Pilot deployment across GPREC and regional partner engineering campuses with 1,000 active beta users.',
        'Month 3-6 (Phase 2): Open developer API ecosystem with native GitHub, Notion, and Slack webhook integrations.',
        'Month 6-12 (Phase 3): Enterprise tier launch targeting mid-market tech startups with SLA guarantees and private VPC deployment.'
      ],
      visualIdea: 'Roadmap Milestone Gantt: 4 distinct phased checkpoints with user adoption curves and pilot launch milestones.',
      speakerScript: `We are not just building a 24-hour hackathon toy—we are building an enduring product. With our MVP ready for pilot deployment next week, our final ask today is mentorship and pilot sponsorship to scale this solution across enterprise engineering teams.`
    }
  ];

  const qas = [
    {
      id: 1,
      number: '01',
      category: 'Scalability & Spikes',
      question: 'How does your system scale when 100,000 concurrent users hit it simultaneously?',
      judgeTrap: 'Testing if you understand state bottlenecks, database pool exhaustion, and the difference between concurrent reads vs writes.',
      rebuttal: `We don't make the naive claim of 100,000 concurrent write transactions. Our architecture is explicitly designed for 100,000 concurrent reads and up to 5,000 writes/second burst capacity. The frontend uses optimistic UI updates with background queue dispatch. Read queries hit edge CDN caches and materialized Redis views, while write spikes pass through asynchronous FastAPI coroutines backed by Supabase connection pooling and rate-limited load shedding. Under benchmark stress testing, our p99 latency remained under 85ms without dropping a single packet.`,
      evidence: [
        'Stateless Node/FastAPI Coroutines',
        'Supabase / PgBouncer Connection Pooling',
        'Edge CDN Invalidation & Redis Cache',
        'Asynchronous Background Worker Queues'
      ]
    },
    {
      id: 2,
      number: '02',
      category: 'Fault Tolerance & Fallbacks',
      question: 'What happens if external AI APIs experience outages or rate limits during a live demo or production use?',
      judgeTrap: 'Testing whether your product is a fragile API wrapper that completely breaks whenever OpenAI or Gemini drops or rate-limits.',
      rebuttal: `We engineered a resilient 3-tier fallback cascade. If our primary frontier LLM returns a 429 rate limit or 5xx outage, the system immediately switches to an in-memory quantized model. If external internet connectivity is severed entirely, our client falls back to an offline deterministic rule engine with pre-computed structural templates. The user experience degrades gracefully rather than displaying an error toast or breaking the workflow.`,
      evidence: [
        '3-Tier Cascade: Frontier LLM ➜ Local Quantized ➜ Offline Rule Engine',
        'Exponential Backoff with Jitter on 429 / 503',
        'Client-side IndexedDB Cache'
      ]
    },
    {
      id: 3,
      number: '03',
      category: 'Security & Zero-Trust',
      question: 'How do you protect sensitive user data and prevent prompt injection and data exfiltration?',
      judgeTrap: 'Checking for enterprise compliance, PII leakage, and indirect prompt injection vulnerabilities.',
      rebuttal: `All inbound prompts and inputs undergo dual-stage regex boundary checking and structural schema validation before reaching the model context. Furthermore, sensitive user tokens and PII are hashed locally in the browser before transmission, and our enterprise proxy enforces zero-retention logging so user data is never stored in third-party model training sets.`,
      evidence: [
        'Client-side PII Masking & SHA-256 Hashing',
        'Strict Input Boundary & Context Sandboxing',
        'AES-256-GCM Encrypted Storage'
      ]
    },
    {
      id: 4,
      number: '04',
      category: 'Defensibility & Moat',
      question: 'Why wouldn\'t an incumbent tech giant or well-funded startup build this overnight?',
      judgeTrap: 'Assessing your competitive differentiation, defensible IP, and distribution advantage.',
      rebuttal: `Incumbents build broad, horizontal suites that cannot easily cater to specialized student-to-engineer workflows. Our competitive moat rests on three pillars: first, our proprietary fine-tuned embeddings tailored for localized domain rubrics; second, zero-configuration local-first latency that monolithic cloud suites cannot match; and third, our multi-campus grassroots student squad network that provides an organic distribution flywheel horizontal incumbents cannot replicate.`,
      evidence: [
        'Hyper-Specialized Domain Rubric Alignment',
        'Local-First Offline Performance',
        'Direct Campus Grassroots Distribution Moat'
      ]
    },
    {
      id: 5,
      number: '05',
      category: 'Unit Economics & Margins',
      question: 'What are your operational unit economics at scale—will this burn cash as usage explodes?',
      judgeTrap: 'Checking if your business model is commercially viable or if API costs will bankrupt you at 50,000 users.',
      rebuttal: `Unlike naive wrappers that invoke costly frontier models on every keystroke, our semantic caching layer deduplicates 74% of common queries. Simple classification tasks are handled by lightweight sub-cent edge models, reserving frontier LLMs exclusively for complex synthesis. Our average compute cost per active daily session is under ₹0.15, yielding an 82% gross margin even on our affordable tier.`,
      evidence: [
        '74% Semantic Cache Hit Rate',
        'Cost Per User Session: ₹0.15',
        '82% Projected Gross Margins at Scale'
      ]
    }
  ];

  const fullMarkdown = `# 🏆 ${projectTitle} — Grand Champion Pitch Deck
**Target Competition:** ${hackathon.title} (${hackathon.organizer})
**Prize Pool:** ${hackathon.prizePool} | **Track:** ${trackTheme}
**Core Architecture:** ${techStack}

---

## 📽️ Slide 1: ${slides[0].title}
* **Headline:** ${slides[0].headline}
${slides[0].points.map(p => `* ${p}`).join('\n')}
* **🎤 35-Second Speaker Script:**
  > *"${slides[0].speakerScript}"*

---

## 📽️ Slide 2: ${slides[1].title}
* **Headline:** ${slides[1].headline}
${slides[1].points.map(p => `* ${p}`).join('\n')}
* **🎤 35-Second Speaker Script:**
  > *"${slides[1].speakerScript}"*

---

## 📽️ Slide 3: ${slides[2].title}
* **Headline:** ${slides[2].headline}
${slides[2].points.map(p => `* ${p}`).join('\n')}
* **🎤 35-Second Speaker Script:**
  > *"${slides[2].speakerScript}"*

---

## 📽️ Slide 4: ${slides[3].title}
* **Headline:** ${slides[3].headline}
${slides[3].points.map(p => `* ${p}`).join('\n')}
* **🎤 35-Second Speaker Script:**
  > *"${slides[3].speakerScript}"*

---

## 📽️ Slide 5: ${slides[4].title}
* **Headline:** ${slides[4].headline}
${slides[4].points.map(p => `* ${p}`).join('\n')}
* **🎤 35-Second Speaker Script:**
  > *"${slides[4].speakerScript}"*

---

# ⚖️ Judge Cross-Examination Defense Matrix (Top 5 Tough Questions & Rebuttals)

${qas.map(q => `### Q${q.number}: "${q.question}"
* **Judge's Hidden Intent:** ${q.judgeTrap}
* **Winning Spoken Defense:**
  > *"${q.rebuttal}"*
* **Architectural Evidence:** ${q.evidence.join(' • ')}
`).join('\n---\n\n')}`;

  return { slides, qas, fullMarkdown };
}

// Parse AI raw output into structured slides and Q&As with fallback enrichment
function parsePitchDeckContent(rawText, fallbackData) {
  if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 50) {
    return fallbackData;
  }

  try {
    const text = rawText.trim();

    // Check if the AI returned delimiter blocks or markdown sections
    const hasSlides = text.toLowerCase().includes('slide');
    const hasJudgeSection = text.toLowerCase().includes('judge') || text.includes('Q1') || text.includes('Q2');

    // Extract slides if markdown headers exist
    let parsedSlides = [...fallbackData.slides];
    const slideMatches = text.split(/(?:##\s*Slide|\nSlide|\n###\s*Slide)/i).slice(1);
    
    if (slideMatches.length >= 3) {
      parsedSlides = slideMatches.slice(0, 5).map((block, idx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const titleLine = lines[0] ? lines[0].replace(/^[0-9:\s—\-]+/, '').trim() : fallbackData.slides[idx].title;
        
        // Extract bullets
        const bullets = lines
          .filter(l => (l.startsWith('*') || l.startsWith('-') || /^[1-9]\./.test(l)) && !l.includes('🎤') && !l.toLowerCase().includes('speaker'))
          .map(l => l.replace(/^[\*\-\d\.\s]+/, '').trim())
          .filter(l => l.length > 5);

        // Extract speaker script
        let script = fallbackData.slides[idx].speakerScript;
        const scriptIdx = lines.findIndex(l => l.includes('🎤') || l.toLowerCase().includes('speaker') || l.toLowerCase().includes('script'));
        if (scriptIdx !== -1 && lines[scriptIdx + 1]) {
          script = lines.slice(scriptIdx, scriptIdx + 4).join(' ').replace(/^[🎤\s\*>\-]+/g, '').replace(/speaker script:?/i, '').replace(/["']/g, '').trim();
        }

        return {
          ...fallbackData.slides[idx],
          title: titleLine || fallbackData.slides[idx].title,
          points: bullets.length >= 2 ? bullets.slice(0, 3) : fallbackData.slides[idx].points,
          speakerScript: script && script.length > 25 ? script : fallbackData.slides[idx].speakerScript
        };
      });
    }

    // Extract Judge Q&As if present
    let parsedQas = [...fallbackData.qas];
    const qMatches = text.match(/Q[1-5][:\.\s][\s\S]*?(?=(?:Q[1-5][:\.\s]|#|$))/gi);

    if (qMatches && qMatches.length >= 3) {
      parsedQas = qMatches.slice(0, 5).map((block, idx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const qLine = lines[0] ? lines[0].replace(/^Q[1-5][:\.\s—\-]+/i, '').replace(/["']/g, '').trim() : fallbackData.qas[idx].question;
        
        // Find answer / rebuttal
        const rebuttalLines = lines.filter(l => !l.startsWith('Q') && l.length > 15);
        const rebuttal = rebuttalLines.length > 0 
          ? rebuttalLines.join(' ').replace(/^[\*>\s\-]+/, '').replace(/winning rebuttal:?/i, '').replace(/defense:?/i, '').replace(/["']/g, '').trim()
          : fallbackData.qas[idx].rebuttal;

        return {
          ...fallbackData.qas[idx],
          question: qLine || fallbackData.qas[idx].question,
          rebuttal: rebuttal && rebuttal.length > 20 ? rebuttal : fallbackData.qas[idx].rebuttal
        };
      });
    }

    return {
      slides: parsedSlides,
      qas: parsedQas,
      fullMarkdown: text.length > 200 ? text : fallbackData.fullMarkdown
    };
  } catch (err) {
    console.warn('Error parsing deck content, falling back to rich structure:', err);
    return fallbackData;
  }
}

export default function HackathonPitchDeckModal({ 
  hackathon, 
  onClose, 
  user 
}) {
  const defaultContext = useMemo(() => getDefaultProjectContext(hackathon), [hackathon]);
  
  const [projectTitle, setProjectTitle] = useState(defaultContext.title);
  const [trackTheme, setTrackTheme] = useState(defaultContext.track);
  const [techStack, setTechStack] = useState(defaultContext.stack);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('slides'); // 'slides', 'judgeDefense', 'rawMarkdown'
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [expandedQa, setExpandedQa] = useState(null);
  const [markdownViewMode, setMarkdownViewMode] = useState('rich'); // 'rich' or 'source'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Fallback initial data
  const initialData = useMemo(() => {
    return generateHighImpactDeckData(hackathon, projectTitle, trackTheme, techStack);
  }, [hackathon, projectTitle, trackTheme, techStack]);

  // Structured deck data (slides, qas, fullMarkdown)
  const [deckData, setDeckData] = useState(initialData);

  // Update deck data if inputs change before generation
  useEffect(() => {
    const updated = generateHighImpactDeckData(hackathon, projectTitle, trackTheme, techStack);
    setDeckData(updated);
  }, [hackathon, projectTitle, trackTheme, techStack]);

  if (!hackathon) return null;

  // AI Generation Handler with robust fallback
  const handleGenerateDeck = async () => {
    setIsGenerating(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }

    const fallback = generateHighImpactDeckData(hackathon, projectTitle, trackTheme, techStack);

    const prompt = `You are a world-class hackathon grand-prize winner and venture pitch coach.
Generate a winning 5-slide pitch deck and 5-question Judge Defense Cross-Examination Matrix for:

Hackathon: "${hackathon.title}"
Organizer: "${hackathon.organizer}"
Prize Pool: "${hackathon.prizePool}"
Project Name: "${projectTitle}"
Track / Domain: "${trackTheme}"
Tech Stack: "${techStack}"

Output in clean, structured Markdown using this exact format:

# 🏆 ${projectTitle} — Grand Champion Pitch Deck

## Slide 1: The Urgent Problem & Measurable Market Pain
* **Headline:** [High-impact headline with quantified metric]
* [Quantified bullet point 1]
* [Quantified bullet point 2]
* [The market gap or architectural failure of legacy tools]
* **🎤 35-Second Speaker Script:**
> "[Compelling opening speech for Demo Day, ~70 words]"

## Slide 2: The Solution & Technical Architecture
* **Headline:** [Solution headline]
* [Client Tier breakdown]
* [Backend & compute pipeline breakdown]
* [Intelligence / Edge LLM layer breakdown]
* **🎤 35-Second Speaker Script:**
> "[Concise explanation of the sub-50ms architecture, ~70 words]"

## Slide 3: Live Working MVP & Competitive Differentiation
* **Headline:** [MVP headline]
* [What is working live right now in the demo]
* [Key performance metric e.g. latency, throughput]
* [Why existing solutions fail in comparison]
* **🎤 35-Second Speaker Script:**
> "[Live demo walkthrough script highlighting code execution, ~70 words]"

## Slide 4: Scalability, Security & Unit Economics
* **Headline:** [Security & unit economics headline]
* [Autoscaling and concurrent spike load strategy]
* [Zero-trust encryption and PII protection]
* [Unit cost per query/transaction proving healthy margins]
* **🎤 35-Second Speaker Script:**
> "[Reassuring speech addressing business viability and scale, ~70 words]"

## Slide 5: Business Moat & 12-Month Execution Roadmap
* **Headline:** [Roadmap headline]
* [Phase 1 (Week 1-8): Campus / early pilot milestones]
* [Phase 2 (Month 3-6): API ecosystem and integrations]
* [Phase 3 (Month 6-12): Enterprise launch and defensible IP moat]
* **🎤 35-Second Speaker Script:**
> "[Unforgettable final ask to judges requesting pilot mentorship, ~70 words]"

---

# ⚖️ Judge Cross-Examination Defense Matrix (Top 5 Tough Questions & Rebuttals)

### Q1: "How does your system scale when 100,000 concurrent users hit it simultaneously?"
* **Judge's Hidden Intent:** Testing state management, connection pooling, and queue buffering.
* **Winning Spoken Defense:**
> "[Direct, technically rigorous defense explaining read/write asymmetry and edge caching]"
* **Architectural Evidence:** Stateless FastAPI, Supabase Connection Pooler, Redis Caching, Load Shedding

### Q2: "What happens if external AI APIs experience outages or rate limits?"
* **Judge's Hidden Intent:** Testing if the system is a fragile wrapper that crashes without third-party APIs.
* **Winning Spoken Defense:**
> "[Explanation of 3-tier fallback cascade: Frontier LLM -> Local Quantized -> Offline Rules]"
* **Architectural Evidence:** In-memory fallback, Local-first IndexedDB, Deterministic Templates

### Q3: "How do you protect sensitive user data and prevent prompt injection attacks?"
* **Judge's Hidden Intent:** Enterprise security, compliance, and PII protection checks.
* **Winning Spoken Defense:**
> "[Explanation of client-side hashing, context sandboxing, and zero-data retention policies]"
* **Architectural Evidence:** SHA-256 Client Hashing, Context Sandbox, AES-256-GCM

### Q4: "Why wouldn't an incumbent tech giant build this overnight?"
* **Judge's Hidden Intent:** Checking defensibility, domain specialization, and network effects.
* **Winning Spoken Defense:**
> "[Explanation of specialized student/engineering workflows and localized distribution flywheel]"
* **Architectural Evidence:** Proprietary Domain Rubrics, Local-First Speed, Campus Flywheel

### Q5: "What are your unit economics at scale—will this burn cash as usage explodes?"
* **Judge's Hidden Intent:** Viability of unit margins and cloud token costs.
* **Winning Spoken Defense:**
> "[Explanation of semantic caching reducing 74% of API calls to ₹0.15 per session]"
* **Architectural Evidence:** 74% Semantic Caching, Sub-cent Edge Models, 82% Gross Margin`;

    try {
      const response = await callAICompletion({
        prompt,
        maxTokens: 3000,
        temperature: 0.3
      });

      if (response && response.trim().length > 150) {
        const parsed = parsePitchDeckContent(response, fallback);
        setDeckData(parsed);
      } else {
        setDeckData(fallback);
      }
    } catch (err) {
      console.warn('AI deck generation failed, using rich fallback:', err);
      setDeckData(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  // 1-Click Copy All Markdown
  const handleCopyAll = () => {
    if (!deckData?.fullMarkdown) return;
    navigator.clipboard.writeText(deckData.fullMarkdown);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Copy specific item (e.g. speaker script or rebuttal)
  const handleCopySnippet = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(key);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  // 1-Click Download Markdown
  const handleDownload = () => {
    if (!deckData?.fullMarkdown) return;
    const blob = new Blob([deckData.fullMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${hackathon.title.replace(/[^a-zA-Z0-9]/g, '_')}_Winning_Pitch_Deck.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Speech Practice (Text-to-Speech)
  const handleToggleAudio = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Render Rich Markdown HTML
  const renderedMarkdownHtml = useMemo(() => {
    if (!deckData?.fullMarkdown) return '';
    try {
      const rawHtml = marked.parse(deckData.fullMarkdown, { gfm: true, breaks: true });
      return DOMPurify.sanitize(rawHtml);
    } catch {
      return deckData.fullMarkdown;
    }
  }, [deckData?.fullMarkdown]);

  const activeSlide = deckData.slides[activeSlideIndex] || deckData.slides[0];
  const ActiveSlideIcon = activeSlide.icon || Presentation;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl bg-[#090D14] border border-white/15 text-white shadow-2xl overflow-hidden">
        {/* Subtle hairline edge highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-7 border-b border-white/10 bg-[#0B0F18] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5 pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Grand-Prize Pitch Deck & Judge Defense Suite</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{hackathon.title}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="text-zinc-300">Host: {hackathon.organizer}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Prize: {hackathon.prizePool}</span>
              <span>•</span>
              <span>Deadline: {hackathon.deadline}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 custom-scrollbar">
          
          {/* Config Controls Bar */}
          <div className="bg-[#0E131F] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. AegisPulse AI"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-amber-400" />
                  Track / Theme
                </label>
                <input
                  type="text"
                  value={trackTheme}
                  onChange={(e) => setTrackTheme(e.target.value)}
                  placeholder="e.g. FinTech / Open Innovation"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  Core Tech Stack
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. React, FastAPI, Supabase, Kafka"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-emerald-400/50"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pre-tuned for {hackathon.organizer} evaluation rubrics</span>
              </span>

              <button
                onClick={handleGenerateDeck}
                disabled={isGenerating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                    <span>Synthesizing Winning Deck & Defense Matrix...</span>
                  </>
                ) : (
                  <>
                    <Presentation className="w-4 h-4 text-black" />
                    <span>Regenerate with AI (Gemini 1.5 Pro)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tab Navigation & Export Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0F18] border border-white/10 rounded-2xl p-2.5 sm:px-4">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('slides')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'slides' 
                    ? 'bg-white text-black shadow-md' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Slides Breakdown</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'slides' ? 'bg-black/10 text-black' : 'bg-white/10 text-zinc-300'}`}>
                  5
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('judgeDefense')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'judgeDefense' 
                    ? 'bg-white text-black shadow-md' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Judge Cross-Exam (5 Q&As)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'judgeDefense' ? 'bg-black/10 text-black' : 'bg-white/10 text-zinc-300'}`}>
                  5
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rawMarkdown')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'rawMarkdown' 
                    ? 'bg-white text-black shadow-md' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Markdown</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copy entire markdown deck"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-300" />}
                <span>{copiedAll ? 'Copied Deck!' : 'Copy All'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Download .md file"
              >
                <Download className="w-3.5 h-3.5 text-zinc-300" />
                <span>Download .md</span>
              </button>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 1: SLIDES BREAKDOWN                                      */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'slides' && (
            <div className="space-y-4">
              {/* Slide Selector Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {deckData.slides.map((slide, idx) => {
                  const SIcon = slide.icon || Presentation;
                  const isSelected = activeSlideIndex === idx;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => {
                        setActiveSlideIndex(idx);
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          setIsPlayingAudio(false);
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isSelected 
                          ? 'bg-white/10 border-cyan-400/50 shadow-lg shadow-cyan-950/30' 
                          : 'bg-[#0B0F18] border-white/10 hover:border-white/20 hover:bg-white/5 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`}>
                          SLIDE {slide.number}
                        </span>
                        <SIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                      </div>
                      <span className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                        {slide.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Slide Presentation Card */}
              <div className="rounded-3xl bg-[#0B0F18] border border-white/15 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                {/* Glowing edge pill */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <ActiveSlideIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                        Slide {activeSlide.number} of 05 • {activeSlide.tag}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {activeSlide.title}
                      </h3>
                    </div>
                  </div>

                  {/* Prev / Next controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                      disabled={activeSlideIndex === 0}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                      title="Previous Slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-zinc-400">
                      {activeSlideIndex + 1} / 5
                    </span>
                    <button
                      onClick={() => setActiveSlideIndex(prev => Math.min(4, prev + 1))}
                      disabled={activeSlideIndex === 4}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                      title="Next Slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slide Headline */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Demo Day Slide Headline
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white leading-snug">
                    {activeSlide.headline}
                  </p>
                </div>

                {/* Bullet Points & Visual Recommendation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Key Bullet Points */}
                  <div className="space-y-3 bg-[#0E131F] border border-white/10 rounded-2xl p-4 sm:p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Key Quantified Data & Architecture
                    </span>
                    <ul className="space-y-2.5">
                      {activeSlide.points.map((pt, i) => (
                        <li key={i} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2.5 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Slide Visual Recommendation */}
                  <div className="space-y-3 bg-[#0E131F] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        Recommended Visual on Screen
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic bg-white/5 p-3.5 rounded-xl border border-white/5">
                        "{activeSlide.visualIdea}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Presentation Pace: 35 Seconds</span>
                      <span className="text-emerald-400">~70 Words Target</span>
                    </div>
                  </div>
                </div>

                {/* 🎤 35-Second Speaker Script Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e1628] to-[#090D14] border border-cyan-500/30 space-y-3 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                        <Mic className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                        35-Second Demo Day Speaker Script
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {'speechSynthesis' in window && (
                        <button
                          type="button"
                          onClick={() => handleToggleAudio(activeSlide.speakerScript)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            isPlayingAudio 
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
                          }`}
                        >
                          {isPlayingAudio ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                              <span>Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                              <span>Listen Pace</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopySnippet(activeSlide.speakerScript, `script_${activeSlide.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedItem === `script_${activeSlide.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-300" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans bg-black/40 p-4 rounded-xl border border-white/10 italic">
                    "{activeSlide.speakerScript}"
                  </blockquote>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                    <span className="text-amber-400 font-bold">Pro Tip:</span>
                    <span>Pause for 1.5 seconds right after stating the quantified metric to let the judges absorb the impact.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 2: JUDGE CROSS-EXAMINATION MATRIX                        */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'judgeDefense' && (
            <div className="space-y-4">
              {/* Header Context Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F18] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Judge Cross-Examination Defense Matrix (Top 5 Probes)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Anticipated hostile questions from senior technical judges & venture evaluators with counter-arguments.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                    5 / 5 Rebuttals Ready
                  </span>
                </div>
              </div>

              {/* 5 Distinct Battle Cards */}
              <div className="space-y-4">
                {deckData.qas.map((qa, index) => {
                  const isExpanded = expandedQa === qa.id || expandedQa === null;
                  return (
                    <div 
                      key={qa.id}
                      className="rounded-2xl bg-[#0B0F18] border border-white/15 p-5 sm:p-6 space-y-4 transition-all hover:border-white/25 shadow-lg"
                    >
                      {/* Card Header: Probe Badge + Question */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                        <div className="flex items-start sm:items-center gap-3">
                          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-cyan-300 font-mono text-xs font-bold shrink-0">
                            PROBE {qa.number}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px] font-bold shrink-0">
                            {qa.category}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopySnippet(
                            `Q: ${qa.question}\n\nWinning Defense:\n${qa.rebuttal}\n\nArchitecture Evidence: ${qa.evidence.join(', ')}`,
                            `qa_${qa.id}`
                          )}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-center"
                        >
                          {copiedItem === `qa_${qa.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-300" />
                              <span>Copy Answer</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Question Text */}
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-start gap-2">
                        <MessageSquareQuote className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>"{qa.question}"</span>
                      </h4>

                      {/* Judge Trap / Hidden Motive */}
                      <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300 font-bold uppercase tracking-wider block text-[10px] mb-0.5">
                            Judge's Hidden Concern / Trap
                          </strong>
                          <span>{qa.judgeTrap}</span>
                        </div>
                      </div>

                      {/* Spoken Winning Rebuttal */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c1322] to-[#080d17] border border-cyan-500/25 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                            <Mic className="w-3.5 h-3.5 text-cyan-400" />
                            Winning Spoken Defense (30-40 Seconds)
                          </span>
                          {'speechSynthesis' in window && (
                            <button
                              type="button"
                              onClick={() => handleToggleAudio(qa.rebuttal)}
                              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>Listen</span>
                            </button>
                          )}
                        </div>
                        <blockquote className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans italic bg-black/30 p-3.5 rounded-lg border border-white/5">
                          "{qa.rebuttal}"
                        </blockquote>
                      </div>

                      {/* Architectural Evidence Pills */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                          Key Architectural Proof & Keywords:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {qa.evidence.map((ev, i) => (
                            <span 
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-mono flex items-center gap-1.5"
                            >
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>{ev}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* TAB 3: FULL MARKDOWN VIEWER                                  */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'rawMarkdown' && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0F18] border border-white/10 rounded-2xl p-3 px-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMarkdownViewMode('rich')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      markdownViewMode === 'rich'
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Formatted Document Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarkdownViewMode('source')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      markdownViewMode === 'source'
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Raw Markdown Source (.md)
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                  <span>~{deckData.fullMarkdown.split(/\s+/).length} Words</span>
                  <span>•</span>
                  <span>~3.5 Min Total Pitch</span>
                </div>
              </div>

              {/* Content Body */}
              {markdownViewMode === 'rich' ? (
                <div className="rounded-2xl bg-[#0B0F18] border border-white/10 p-6 sm:p-8 max-h-[55vh] overflow-y-auto custom-scrollbar">
                  <div 
                    className="prose prose-invert max-w-none text-zinc-200 text-xs sm:text-sm leading-relaxed space-y-4 font-sans [&>h1]:text-2xl [&>h1]:font-black [&>h1]:text-white [&>h1]:border-b [&>h1]:border-white/10 [&>h1]:pb-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-cyan-300 [&>h2]:mt-6 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-amber-300 [&>blockquote]:border-l-2 [&>blockquote]:border-cyan-400 [&>blockquote]:bg-white/5 [&>blockquote]:p-3 [&>blockquote]:rounded-r-lg [&>blockquote]:italic [&>ul]:space-y-1.5 [&>ul]:list-disc [&>ul]:pl-5 [&>hr]:border-white/10 [&>hr]:my-6"
                    dangerouslySetInnerHTML={{ __html: renderedMarkdownHtml }}
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-[#070A0F] border border-white/10 p-4 sm:p-5 max-h-[55vh] overflow-y-auto custom-scrollbar font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed selection:bg-cyan-500/30">
                  {deckData.fullMarkdown}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Status Bar */}
        <div className="p-4 sm:px-7 border-t border-white/10 bg-[#0B0F18] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready for Demo Day Presentation & Live Judging</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyAll}
              className="text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Deck</span>
            </button>
            <span>•</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold cursor-pointer transition-all"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}