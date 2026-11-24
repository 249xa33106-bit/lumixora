import React, { useState } from 'react';
import { 
  Cpu, Database, Globe, Layers, CheckCircle2, XCircle, 
  HelpCircle, ChevronRight, Sparkles, Award, Zap, Search, 
  RotateCcw, Eye, EyeOff, BookOpenCheck
} from 'lucide-react';

/* ─── WEB AUDIO FEEDBACK ─── */
const playAudioFeedback = (success = true) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = success ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(success ? 880 : 320, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};

const VIVA_QUESTIONS = [
  // ── OPERATING SYSTEMS ──
  {
    id: 'os-1',
    category: 'Operating Systems',
    difficulty: 'High-Frequency',
    companies: ['Cisco', 'Amazon', 'Accolite', 'TCS Prime'],
    question: 'What are the 4 Coffman conditions required for a Deadlock to occur, and how do you break them in practice?',
    answer: `The 4 Coffman conditions are:
1. Mutual Exclusion: At least one resource must be non-shareable.
2. Hold and Wait: A process holding at least one resource is waiting to acquire additional resources held by other processes.
3. No Preemption: Resources cannot be forcibly seized; only released voluntarily.
4. Circular Wait: A closed chain of processes exists such that each process holds a resource needed by the next.

PRACTICAL DEFENSE: The most common real-world mitigation is breaking Circular Wait by enforcing a strict global lock acquisition hierarchy (e.g. always acquiring locks in ascending order of Account ID or Resource Pointer).`,
    keyPoints: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait', 'Lock Ordering Hierarchy']
  },
  {
    id: 'os-2',
    category: 'Operating Systems',
    difficulty: 'High-Frequency',
    companies: ['Cisco', 'Qualcomm', 'Darwinbox'],
    question: 'Explain the critical difference between a Mutex and a Counting Semaphore. Can a thread release a Mutex acquired by another thread?',
    answer: `MUTEX vs SEMAPHORE:
• Mutex (Mutual Exclusion Object): Has the concept of OWNERSHIP. Only the specific thread that acquired the mutex can release it. Designed strictly for locking a critical section.
• Semaphore: A signaling mechanism with an integer counter. Any thread can signal (V) or wait (P). It has NO ownership.

KEY INTERVIEW TRAP: NO, a thread CANNOT release a Mutex acquired by another thread (it results in undefined behavior or an illegal monitor state exception). Conversely, in a binary semaphore, one thread can wait while an interrupt or worker thread signals it.`,
    keyPoints: ['Ownership Principle', 'Signaling vs Locking', 'Inter-thread release behavior']
  },
  {
    id: 'os-3',
    category: 'Operating Systems',
    difficulty: 'Advanced',
    companies: ['Amazon', 'Cisco'],
    question: 'What causes Thrashing in Virtual Memory, and how does the Working Set Model prevent it?',
    answer: `THRASHING: Occurs when a system spends more time swapping pages between RAM and disk than executing instructions. This happens when the sum of working sets of all active processes exceeds available physical RAM.

WORKING SET MODEL: Denning's Working Set Model defines the set of pages referenced by a process in the last Δ time units. If physical memory cannot accommodate the working set sizes of all active processes, the OS suspends one process entirely (swapping it to disk), freeing its frames for the remaining processes to execute without page faults.`,
    keyPoints: ['Page fault rate explosion', 'Working Set parameter Δ', 'Process suspension vs frame allocation']
  },

  // ── DATABASE MANAGEMENT SYSTEMS ──
  {
    id: 'db-1',
    category: 'DBMS',
    difficulty: 'High-Frequency',
    companies: ['Accolite', 'Darwinbox', 'Amazon', 'TCS Prime'],
    question: 'Why do databases (MySQL InnoDB, Postgres) use B+ Trees instead of Binary Search Trees or Hash Tables for disk indexes?',
    answer: `WHY B+ TREES FOR DISK INDEXES:
1. High Fan-Out (Low Tree Height): B+ Trees have large fan-out (hundreds of keys per node), keeping tree depth small (typically 3-4 levels for millions of rows), requiring only 3-4 disk I/O reads.
2. Range Query Support: In B+ Trees, all data records are stored in the leaf nodes, which are linked together in a Doubly Linked List. Range queries (\`WHERE age BETWEEN 20 AND 30\`) require just 1 search to find the start, then sequential traversal along the leaf list.
3. Why not Hash Indexes? Hash indexes are O(1) for exact equality, but cannot do range scans or sorting.
4. Why not BST/AVL? BST height is large (O(log2 N)), causing excessive random disk I/O seeks per lookup.`,
    keyPoints: ['High Fan-Out', 'Leaf Node Linked List', 'O(1) Range Queries', 'Minimizing Disk I/O Seeks']
  },
  {
    id: 'db-2',
    category: 'DBMS',
    difficulty: 'High-Frequency',
    companies: ['Darwinbox', 'Amazon', 'Accolite'],
    question: 'Differentiate between the 4 SQL Transaction Isolation Levels and the anomalies they prevent (Dirty Read, Non-Repeatable Read, Phantom Read).',
    answer: `TRANSACTION ISOLATION LEVELS (Weakest to Strongest):
1. Read Uncommitted: Allows Dirty Reads (reading uncommitted changes from concurrent transactions).
2. Read Committed (Postgres default): Prevents Dirty Reads. Still susceptible to Non-Repeatable Reads.
3. Repeatable Read (MySQL InnoDB default): Prevents Dirty Reads and Non-Repeatable Reads. Guarantees that re-reading the same row returns the exact same snapshot.
4. Serializable: Strongest isolation. Uses range locks or serialization graph checking to prevent Phantom Reads (preventing newly inserted rows from appearing mid-transaction).`,
    keyPoints: ['Dirty Read', 'Non-Repeatable Read', 'Phantom Read', 'MVCC Snapshot Isolation']
  },

  // ── COMPUTER NETWORKS ──
  {
    id: 'cn-1',
    category: 'Computer Networks',
    difficulty: 'High-Frequency',
    companies: ['Cisco', 'Amazon', 'Accolite'],
    question: 'Walk through the TCP 3-Way Handshake step-by-step with Sequence and Acknowledgment numbers. Why not 2-way?',
    answer: `TCP 3-WAY HANDSHAKE:
1. Client ➔ Server: SYN (Seq = X). Client enters SYN_SENT.
2. Server ➔ Client: SYN-ACK (Seq = Y, Ack = X + 1). Server acknowledges client sequence number and presents its own. Server enters SYN_RCVD.
3. Client ➔ Server: ACK (Ack = Y + 1, Seq = X + 1). Client acknowledges server sequence number. Connection established (ESTABLISHED).

WHY NOT 2-WAY HANDSHAKE?
A 2-way handshake cannot protect against delayed duplicate SYN packets from old dead connections. If an old delayed SYN reaches the server, the server would open a half-open phantom connection and allocate resources without knowing if the client is still alive. The 3rd ACK confirms the client's current intent.`,
    keyPoints: ['SYN (Seq X)', 'SYN-ACK (Seq Y, Ack X+1)', 'ACK (Ack Y+1)', 'Delayed duplicate packets defense']
  },
  {
    id: 'cn-2',
    category: 'Computer Networks',
    difficulty: 'Advanced',
    companies: ['Cisco', 'Qualcomm'],
    question: 'What is the exact sequence of events when you type "https://google.com" into a browser and press Enter?',
    answer: `STEP-BY-STEP FLOW:
1. URL Parsing & HSTS Check: Browser checks if HTTPS is forced.
2. DNS Resolution: Checks Browser Cache ➔ OS Cache ➔ Hosts File ➔ Local Router DNS ➔ Recursive Resolver ➔ Root Name Server (.) ➔ TLD (.com) ➔ Authoritative DNS to resolve IP address.
3. TCP Handshake: 3-way handshake over port 443 with the server IP.
4. TLS Handshake: Client Hello (supported ciphers, SNI) ➔ Server Hello (chosen cipher, SSL Certificate, public key) ➔ Client verifies certificate authority (CA) ➔ Generates Pre-Master Secret encrypted with server public key ➔ Symmetric session key derived (AES-GCM).
5. HTTP Request: Browser sends GET / encrypted with symmetric key.
6. Server Processing & Response: Reverse proxy (Nginx) forwards to backend; server returns HTML (200 OK).
7. Browser Rendering: DOM tree parsed ➔ CSSOM tree parsed ➔ Render Tree ➔ Layout / Reflow ➔ Paint.`,
    keyPoints: ['DNS Hierarchy', 'TCP 3-Way Handshake', 'TLS Key Exchange (Pre-Master Secret)', 'DOM/CSSOM Render Pipeline']
  },

  // ── LOW-LEVEL DESIGN (LLD) ──
  {
    id: 'lld-1',
    category: 'Low-Level Design',
    difficulty: 'High-Frequency',
    companies: ['Darwinbox', 'Amazon', 'TCS Prime'],
    question: 'How would you architect a thread-safe LRU Cache in Java or C++ with O(1) get and put operations?',
    answer: `LRU CACHE ARCHITECTURAL BLUEPRINT:
1. Data Structures:
   • Hash Table (HashMap): Provides O(1) key-to-node lookups.
   • Doubly Linked List (DLL): Provides O(1) node deletion and insertion at the head.
2. Invariants:
   • Most Recently Used node is always immediately after the dummy Head.
   • Least Recently Used node is always immediately before the dummy Tail.
3. Operations:
   • get(key): Check HashMap. If present, extract DLL node, move to Head, return value. If absent, return -1. O(1).
   • put(key, val): If key exists, update value and move node to Head. If new, create node, add to HashMap, insert at Head. If capacity exceeded, remove node before Tail and delete from HashMap. O(1).
4. Thread Safety: Use ReadWriteLock (multiple readers allowed, single writer blocks) or ConcurrentHashMap with atomic node mutations.`,
    keyPoints: ['HashMap + Doubly Linked List', 'Dummy Head & Tail', 'O(1) Recency Update', 'ReentrantReadWriteLock']
  }
];

export default function CoreCsVivaCrucible() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [masteredMap, setMasteredMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Operating Systems', 'DBMS', 'Computer Networks', 'Low-Level Design'];

  const filteredQuestions = VIVA_QUESTIONS.filter(q => {
    const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleReveal = (id) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markMastered = (id, success) => {
    playAudioFeedback(success);
    setMasteredMap(prev => ({ ...prev, [id]: success }));
  };

  const masteredCount = Object.values(masteredMap).filter(Boolean).length;

  return (
    <div className="bg-[#0B1120] border border-cyan-500/20 rounded-2xl p-6 text-white space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              ₹10L – ₹16L VIVA CRUCIBLE
            </span>
            <span className="text-xs text-gray-400 font-mono">
              High-Frequency Technical Elimination Questions
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            Core CS Rapid-Fire Viva & LLD Crucible
          </h3>
          <p className="text-xs text-gray-300 mt-0.5">
            Master the exact OS, DBMS, Networks, and System Design questions asked in Cisco, Amazon, Accolite, and TCS Prime rounds.
          </p>
        </div>

        {/* Mastered Counter */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>VIVA MASTERY:</span>
          <span className="text-[#00B987] font-bold text-sm">
            {masteredCount} / {VIVA_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#7553E8] to-[#08BFD0] text-white shadow-md'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search concepts, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Questions Drill Grid */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isRevealed = Boolean(revealedAnswers[q.id]);
          const status = masteredMap[q.id];

          return (
            <div 
              key={q.id}
              className={`p-5 rounded-xl border transition-all ${
                status === true 
                  ? 'bg-emerald-950/20 border-emerald-500/30' 
                  : status === false 
                  ? 'bg-rose-950/20 border-rose-500/30' 
                  : 'bg-white/[0.03] border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300 font-bold">
                    {q.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {q.difficulty}
                  </span>
                  {q.companies.map((c, i) => (
                    <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Self evaluation actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => markMastered(q.id, true)}
                    className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                      status === true 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'text-gray-400 hover:text-emerald-400 hover:bg-white/5'
                    }`}
                    title="I can answer this fluently"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Mastered</span>
                  </button>

                  <button
                    onClick={() => markMastered(q.id, false)}
                    className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                      status === false 
                        ? 'bg-rose-500 text-white' 
                        : 'text-gray-400 hover:text-rose-400 hover:bg-white/5'
                    }`}
                    title="Need review"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Needs Review</span>
                  </button>
                </div>
              </div>

              {/* Question Statement */}
              <h4 className="text-sm font-bold text-white leading-relaxed">
                {idx + 1}. {q.question}
              </h4>

              {/* Toggle Reveal Answer Button */}
              <div className="pt-3">
                <button
                  onClick={() => toggleReveal(q.id)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {isRevealed ? 'Hide Model Viva Answer' : 'Reveal Model Viva Answer'}
                </button>
              </div>

              {/* Revealed Answer Content */}
              {isRevealed && (
                <div className="mt-4 p-4 rounded-xl bg-black/60 border border-cyan-500/30 text-xs font-mono text-gray-200 leading-relaxed space-y-3 animate-fadeIn">
                  <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> GOLD-STANDARD INTERVIEWER CRITIQUE:
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-gray-200 leading-relaxed">
                    {q.answer}
                  </pre>
                  
                  {/* Key Takeaways */}
                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Key Terms Recruiter Checks:</span>
                    {q.keyPoints.map((kp, kpi) => (
                      <span key={kpi} className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                        {kp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
