import React, { useState, useEffect } from 'react';
import {
  Cpu, Plus, Trash2, ExternalLink, Brain, Sparkles, Code, Layers, CheckCircle2, ArrowRight
} from 'lucide-react';

const CAPSTONE_BLUEPRINTS = [
  {
    id: 'bp1',
    title: 'Real-Time Collaborative Code & Interview Sandbox',
    domain: 'Full-Stack / Systems',
    difficulty: 'Super-Dream Tier',
    stack: 'React, Node.js, WebSockets, Docker, Redis',
    summary: 'Low-latency collaborative IDE supporting multi-user CRDT sync, sandboxed container execution, and real-time latency telemetry (<60ms sync).'
  },
  {
    id: 'bp2',
    title: 'Enterprise RAG Document Intelligence Engine',
    domain: 'AI / Machine Learning',
    difficulty: 'Product MNC Tier',
    stack: 'Python, FastAPI, LangChain, Vector DB, PostgreSQL',
    summary: 'Hybrid dense+BM25 semantic search pipeline indexing 50,000+ technical PDFs with citation verification and hallucination guardrails.'
  },
  {
    id: 'bp3',
    title: 'Fault-Tolerant Distributed URL & Event Rate Limiter',
    domain: 'Cloud / Backend',
    difficulty: 'Amazon / Google Tier',
    stack: 'Java 21, Spring Boot, Redis Cluster, Kafka, Kubernetes',
    summary: 'Sliding-window token bucket rate limiter sustaining 15,000 RPS with circuit breakers, horizontal sharding, and Prometheus observability.'
  },
  {
    id: 'bp4',
    title: 'Smart Campus Edge-AI Energy & Attendance Grid',
    domain: 'Core ECE / IoT',
    difficulty: 'Core MNC & GATE Tier',
    stack: 'ESP32, Embedded C, MQTT, TinyML, React Dashboard',
    summary: 'Edge inference microcontroller network monitoring classroom occupancy and automating HVAC/lighting load, cutting campus energy waste by 22%.'
  }
];

export default function GprecProjectPlatformPanel({ user, onDefendProject, addToast }) {
  const storageKey = `gprec_projects_portfolio_${user?.id || user?.email || 'guest'}`;

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'default-1',
        title: 'Distributed RAG Vector Search Engine',
        domain: 'AI / Backend',
        stack: 'Java 21, FastAPI, Qdrant Vector DB, PostgreSQL, Docker',
        summary: 'Architected high-throughput vector search pipeline with Redis caching handling 5,000 RPS at <80ms latency.',
        github: 'https://github.com/gprec-scholar/rag-search-engine',
        demo: ''
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(projects));
    } catch (e) {}
  }, [projects, storageKey]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Full-Stack');
  const [stack, setStack] = useState('');
  const [summary, setSummary] = useState('');
  const [github, setGithub] = useState('');
  const [demo, setDemo] = useState('');

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim() || !stack.trim()) {
      if (addToast) addToast({ message: 'Please enter a project title and tech stack.', type: 'warning' });
      return;
    }
    const next = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      domain,
      stack: stack.trim(),
      summary: summary.trim() || 'Engineered production-grade software project with modular architecture and automated testing.',
      github: github.trim(),
      demo: demo.trim()
    };
    setProjects(prev => [next, ...prev]);
    setTitle('');
    setStack('');
    setSummary('');
    setGithub('');
    setDemo('');
    setShowAddForm(false);
    if (addToast) addToast({ message: `Added "${next.title}" to your Project Portfolio!`, type: 'success' });
  };

  const handleCloneBlueprint = (bp) => {
    const exists = projects.some(p => p.title.toLowerCase() === bp.title.toLowerCase());
    if (exists) {
      if (addToast) addToast({ message: `"${bp.title}" is already in your portfolio.`, type: 'info' });
      return;
    }
    const next = {
      id: `proj-${Date.now()}`,
      title: bp.title,
      domain: bp.domain,
      stack: bp.stack,
      summary: bp.summary,
      github: '',
      demo: ''
    };
    setProjects(prev => [next, ...prev]);
    if (addToast) addToast({ message: `Added capstone blueprint "${bp.title}" to My Projects!`, type: 'success' });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* My Portfolio Header + Add Project */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">My GPREC Placement Project Portfolio ({projects.length})</h3>
            <p className="text-xs text-slate-500">Showcase recruiter-ready capstone builds and launch Architecture Vivas with 1 click.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(v => !v)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add Project'}</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddProject} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title *" className="md:col-span-2 p-2.5 rounded-xl border border-slate-200 bg-white font-semibold" />
              <select value={domain} onChange={e => setDomain(e.target.value)} className="p-2.5 rounded-xl border border-slate-200 bg-white font-semibold">
                {['Full-Stack', 'AI / Machine Learning', 'Cloud / Backend', 'Mobile App', 'Core ECE / IoT', 'Data Analytics'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <input value={stack} onChange={e => setStack(e.target.value)} placeholder="Tech Stack * (e.g. React, Node.js, PostgreSQL, Docker)" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" />
            <textarea rows={2} value={summary} onChange={e => setSummary(e.target.value)} placeholder="Architecture & measurable impact (latency, throughput, users, accuracy)..." className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={github} onChange={e => setGithub(e.target.value)} placeholder="GitHub Repo URL (optional)" className="p-2.5 rounded-xl border border-slate-200 bg-white" />
              <input value={demo} onChange={e => setDemo(e.target.value)} placeholder="Live Demo URL (optional)" className="p-2.5 rounded-xl border border-slate-200 bg-white" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">
                Save Project
              </button>
            </div>
          </form>
        )}

        {/* Saved Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(proj => (
            <div key={proj.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-purple-300 transition-all flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {proj.domain}
                  </span>
                  <button
                    type="button"
                    onClick={() => setProjects(prev => prev.filter(p => p.id !== proj.id))}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Remove project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-2">{proj.title}</h4>
                <div className="text-[11px] font-semibold text-purple-700 mt-1">{proj.stack}</div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{proj.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-[11px]">
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1">
                      <Code className="w-3 h-3" /> GitHub
                    </a>
                  )}
                  {proj.demo && (
                    <a href={proj.demo} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Live Demo
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDefendProject && onDefendProject(proj)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5 text-purple-300" />
                  <span>Defend in Viva</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industry-Grade Capstone Blueprints Bank */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-600 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Recruiter-Grade Ideas</span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 mt-0.5">High-Impact Placement Capstone Blueprints</h3>
          <p className="text-xs text-slate-500">Proven project architectures that pass Amazon, Microsoft, TCS Prime & Core MNC resume shortlists.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAPSTONE_BLUEPRINTS.map(bp => (
            <div key={bp.id} className="p-4 rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">{bp.domain}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{bp.difficulty}</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-2">{bp.title}</h4>
                <div className="text-[11px] font-medium text-blue-700 mt-1">{bp.stack}</div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{bp.summary}</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleCloneBlueprint(bp)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-purple-50 hover:border-purple-300 text-xs font-bold text-slate-800 hover:text-purple-700 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Portfolio</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDefendProject && onDefendProject(bp)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1"
                >
                  <span>Practice Viva</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
