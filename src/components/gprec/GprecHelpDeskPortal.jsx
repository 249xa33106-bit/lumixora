import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle, Headphones, Send, CheckCircle2, Clock, Search, ChevronDown,
  ChevronRight, MessageSquare, Sparkles, ShieldCheck, AlertCircle, Plus,
  ArrowRight, Building, FileText, Briefcase, GraduationCap, RefreshCw, X
} from 'lucide-react';
import { callAICompletion } from '../../services/aiService';

const TICKET_CATEGORIES = [
  'Placement Eligibility & CGPA',
  'Campus Drive Registration',
  'Offer Letter & Internship NOC',
  'Resume / ATS Audit Query',
  'Coding / Mock Interview Technical Issue',
  'Bridge to B.Tech / Academic Query'
];

const GPREC_FAQS = [
  {
    id: 'faq1',
    category: 'Eligibility',
    q: 'What is the standard CGPA & backlog eligibility for GPREC campus drives?',
    a: 'Most Tier-2 & service recruiters (TCS, Infosys, Accenture, Cognizant) require ≥6.0 CGPA (60% in 10th/12th) with 0 active backlogs. Super-Dream & Product MNCs (Amazon, Microsoft, Google, Cisco) generally require ≥7.0–7.5 CGPA with zero active backlogs and strong DSA/System Design scores.'
  },
  {
    id: 'faq2',
    category: 'Policy',
    q: 'Can I sit for a Dream / Super-Dream drive if I already hold a base offer?',
    a: 'Yes! Under GPREC Training & Placement policy, students holding a standard offer (e.g., 3.5–5 LPA) are eligible to upgrade to a Dream offer (≥8 LPA) or Super-Dream offer (≥12+ LPA), typically requiring at least a 1.5x–2x CTC jump depending on drive circular rules.'
  },
  {
    id: 'faq3',
    category: 'NOC & Internships',
    q: 'How do I request an Internship NOC (No Objection Certificate) from the TPO?',
    a: 'Submit a ticket under "Offer Letter & Internship NOC" with your official offer letter details, company name, duration, and department coordinator approval. Standard processing time at the Admin Block T&P Cell is 2–3 working days.'
  },
  {
    id: 'faq4',
    category: 'Portal & Readiness',
    q: 'How is my Overall Placement Readiness score calculated on gprec.lumixora.in?',
    a: 'Your score dynamically aggregates verified Coding Arena submissions, Aptitude Arena drills, AI Resume ATS audits, Project Architecture Vivas, and AI Mock Interview scorecards—weighted according to your selected Target Job Role in Settings.'
  },
  {
    id: 'faq5',
    category: 'Interviews',
    q: 'How should I prepare in the final 30 days before TCS Digital / Infosys SP / Product OAs?',
    a: 'Follow a daily 3-block sprint: (1) 2 Medium DSA problems in Coding Arena, (2) 15 timed questions in Aptitude Arena, and (3) 1 AI Technical Mock Interview + Resume Claim Defense every 3 days to eliminate weak spots.'
  },
  {
    id: 'faq6',
    category: 'Technical Support',
    q: 'What if my Coding Arena submission or Mock Interview audio has an issue?',
    a: 'Ensure browser microphone permissions are enabled for voice viva, or switch to text-mode responses seamlessly. If any issue persists during a scheduled practice sprint, raise a ticket here with category "Coding / Mock Interview Technical Issue".'
  }
];

const SMART_LOCAL_FALLBACK = (question) => {
  const q = question.toLowerCase();
  if (q.includes('cgpa') || q.includes('backlog') || q.includes('eligib')) {
    return 'GPREC Campus Drive Eligibility: Service/Digital drives generally require ≥6.0–6.5 CGPA with 0 active backlogs, while Product/Super-Dream companies typically require ≥7.0–7.5 CGPA. Verify each drive circular in My Placement → Job Match or raise a TPO ticket for special exemptions.';
  }
  if (q.includes('noc') || q.includes('intern') || q.includes('offer')) {
    return 'For Internship NOC or Offer Letter verification, raise a ticket under "Offer Letter & Internship NOC" below with your company name, stipend/CTC, and start date. You can also visit the Training & Placement Cell (Admin Block) between 9:30 AM and 4:30 PM.';
  }
  if (q.includes('resume') || q.includes('ats')) {
    return 'Keep your GPREC resume strictly 1 page, single-column, ATS-clean with quantified project metrics (e.g., latency, accuracy, users). Use the Resume Builder tab in the sidebar to generate an ATS PDF and audit it for >85% score.';
  }
  if (q.includes('tcs') || q.includes('amazon') || q.includes('google') || q.includes('microsoft') || q.includes('infosys')) {
    return 'Open Company Services from the sidebar to simulate round-by-round selection probability, view exact OA/Technical rounds, and launch tailored Coding Arena & Mock Interview drills for your target company.';
  }
  return 'Thanks for reaching out to the GPREC Placement HelpDesk! For immediate self-service, check the FAQ section below or submit a tracked support ticket to the GPREC Training & Placement Cell (Admin Block • dean.placements@gprec.ac.in • +91 8518 270957).';
};

export default function GprecHelpDeskPortal({ user, navigateTo, addToast }) {
  const storageKey = `gprec_helpdesk_tickets_${user?.id || user?.email || 'guest'}`;

  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tickets));
    } catch (e) {}
  }, [tickets, storageKey]);

  // Ticket Form State
  const [category, setCategory] = useState(TICKET_CATEGORIES[0]);
  const [priority, setPriority] = useState('Normal');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [ticketFilter, setTicketFilter] = useState('All');

  // Instant AI Assistant State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);

  // FAQ State
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqId, setOpenFaqId] = useState('faq1');

  const filteredFaqs = useMemo(() => {
    const q = faqSearch.trim().toLowerCase();
    if (!q) return GPREC_FAQS;
    return GPREC_FAQS.filter(
      f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
  }, [faqSearch]);

  const filteredTickets = useMemo(() => {
    if (ticketFilter === 'All') return tickets;
    return tickets.filter(t => t.status === ticketFilter);
  }, [tickets, ticketFilter]);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      if (addToast) addToast({ message: 'Please enter both a subject and description.', type: 'warning' });
      return;
    }
    const newTicket = {
      id: `GPREC-HD-${String(Math.floor(1000 + Math.random() * 9000))}`,
      category,
      priority,
      subject: subject.trim(),
      description: description.trim(),
      status: 'Open',
      createdAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      studentEmail: user?.email || 'student@gprec.ac.in',
      tpoNote: 'Logged with GPREC Training & Placement Cell. Expected response within 4 working hours.'
    };
    setTickets(prev => [newTicket, ...prev]);
    setSubject('');
    setDescription('');
    setPriority('Normal');
    if (addToast) addToast({ message: `Ticket ${newTicket.id} submitted to GPREC TPO HelpDesk!`, type: 'success' });
  };

  const handleToggleTicketStatus = (id) => {
    setTickets(prev =>
      prev.map(t => (t.id === id ? { ...t, status: t.status === 'Resolved' ? 'Open' : 'Resolved' } : t))
    );
  };

  const handleAskAiAdvisor = async (e) => {
    if (e) e.preventDefault();
    if (!aiQuestion.trim() || isAskingAi) return;
    setIsAskingAi(true);
    try {
      const prompt = `You are the GPREC (G. Pulla Reddy Engineering College, Kurnool) Training & Placement Cell AI HelpDesk Assistant. Answer the student's placement question concisely, accurately, and encouragingly in 3-4 sentences:\n\nQuestion: ${aiQuestion.trim()}`;
      const res = await callAICompletion({ messages: [{ role: 'user', content: prompt }] });
      if (res && typeof res === 'string' && res.trim().length > 15) {
        setAiAnswer(res.trim());
      } else {
        setAiAnswer(SMART_LOCAL_FALLBACK(aiQuestion));
      }
    } catch (err) {
      setAiAnswer(SMART_LOCAL_FALLBACK(aiQuestion));
    } finally {
      setIsAskingAi(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Hero & Live TPO Desk Bar */}
      <div className="bg-gradient-to-br from-[#0B0F2A] via-[#15183D] to-[#24154B] rounded-2xl p-6 text-white shadow-lg border border-purple-900/50 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-200 text-[11px] font-bold mb-2.5">
              <Headphones className="w-3.5 h-3.5" />
              <span>GPREC Placement HelpDesk • Live Student Support</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              TPO Support Desk, AI Advisor & Placement FAQs
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl">
              Get instant answers on campus drive eligibility, NOC approvals, offer upgrades, and portal issues — or raise a tracked ticket directly to the GPREC Placement Cell.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 text-xs space-y-1.5 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-purple-300" />
                <span>GPREC T&P Cell</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                Online
              </span>
            </div>
            <div className="text-slate-300 text-[11px]">Admin Block, Kurnool (9:30 AM – 4:30 PM)</div>
            <div className="text-indigo-200 text-[11px] font-mono">dean.placements@gprec.ac.in</div>
            <div className="text-slate-200 text-[11px] font-semibold">+91 8518 270957</div>
          </div>
        </div>
      </div>

      {/* Instant AI Placement Advisor */}
      <div className="bg-white border border-purple-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Instant AI Placement Advisor</h3>
              <p className="text-[11px] text-slate-500">Ask anything about GPREC placement policy, CGPA cutoffs, NOC, or drive strategy.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['CGPA cutoff for Super-Dream?', 'How to get Internship NOC?', 'Best 30-day TCS Digital plan'].map(q => (
              <button
                key={q}
                type="button"
                onClick={() => setAiQuestion(q)}
                className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-semibold cursor-pointer transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAskAiAdvisor} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Ask your placement question (e.g. Can I apply to Amazon with 7.2 CGPA?)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={isAskingAi || !aiQuestion.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {isAskingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isAskingAi ? 'Thinking...' : 'Ask Advisor'}</span>
          </button>
        </form>

        {aiAnswer && (
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-slate-800 leading-relaxed flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className="whitespace-pre-line">{aiAnswer}</p>
            </div>
            <button onClick={() => setAiAnswer('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main 2-Column Workspace: Ticket Desk (Left) + Tracked Tickets & FAQs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raise a Support Ticket */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Raise a Placement Support Ticket</h3>
            <p className="text-xs text-slate-500 mt-0.5">Routed directly to your GPREC TPO Coordinator with live status tracking.</p>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:border-purple-500"
              >
                {TICKET_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Priority Level</label>
              <div className="grid grid-cols-2 gap-2">
                {['Normal', 'Urgent (Active Drive)'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl border font-semibold cursor-pointer transition-all ${
                      priority === p
                        ? p.includes('Urgent')
                          ? 'bg-rose-50 border-rose-400 text-rose-700'
                          : 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. NOC request for 6-month SDE Internship at Amazon"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Details</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include your Roll Number, Branch, Company/Drive Name, and exact question..."
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Support Ticket</span>
            </button>
          </form>

          {/* Quick Connected Actions */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase mb-2">Quick Portal Shortcuts</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Application Tracker', nav: 'placement', sub: 'applications', icon: Clock },
                { label: 'Resume Builder', nav: 'mock_interviews', sub: 'resume_defense', icon: FileText },
                { label: 'Bridge to B.Tech', nav: 'resources', sub: 'curriculum', icon: GraduationCap },
                { label: 'Job Match AI', nav: 'placement', sub: 'job_match', icon: Briefcase }
              ].map(btn => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => navigateTo(btn.nav, btn.sub)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-300 text-left flex items-center gap-2 text-[11px] font-bold text-slate-700 hover:text-purple-700 transition-all cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span className="truncate">{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: My Tickets + Searchable FAQs */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* My Support Tickets */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">My Support Tickets ({tickets.length})</h3>
                <p className="text-xs text-slate-500">All requests raised from your GPREC placement account.</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-semibold">
                {['All', 'Open', 'Resolved'].map(st => (
                  <button
                    key={st}
                    onClick={() => setTicketFilter(st)}
                    className={`px-2.5 py-1 rounded-md cursor-pointer ${
                      ticketFilter === st ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredTickets.length === 0 ? (
              <div className="py-8 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                <MessageSquare className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700">No support tickets yet</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Submit a ticket on the left whenever you need TPO assistance or drive clarification.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {filteredTickets.map(ticket => (
                  <div key={ticket.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900 text-white">
                          {ticket.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          {ticket.category}
                        </span>
                        {ticket.priority.includes('Urgent') && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            URGENT
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        ticket.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{ticket.subject}</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{ticket.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                      <span>{ticket.tpoNote} • {ticket.createdAt}</span>
                      <button
                        onClick={() => handleToggleTicketStatus(ticket.id)}
                        className="font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        {ticket.status === 'Resolved' ? 'Reopen' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Searchable FAQs */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Frequently Asked Placement Questions</h3>
                <p className="text-xs text-slate-500">Verified answers for GPREC campus placement policies & tools.</p>
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search FAQs..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {filteredFaqs.map(faq => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="bg-white">
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 flex-shrink-0">
                          {faq.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{faq.q}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
