import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Sparkles, Code2, GitBranch, GitCommit, Terminal, Cpu, Award, Zap,
  Flame, BookOpen, ChevronRight, Copy, Check, ExternalLink, HelpCircle,
  Eye, ArrowRight, Layers, Sliders, CheckCircle2, Clock, Info, Clapperboard,
  Maximize2, Minimize2, Radio, Activity
} from 'lucide-react';

/* ─── SYNTHESIZED CINEMATIC AUDIO (Pure Web Audio API - Zero External Dependencies) ─── */
class CinemaAudioEngine {
  constructor() {
    this.ctx = null;
    this.osc1 = null;
    this.osc2 = null;
    this.gain = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  startAmbience() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (this.isPlaying) return;

      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 2);
      this.gain.connect(this.ctx.destination);

      // Deep cinematic low-pass drone (55Hz - A1 note)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime);
      this.osc1.connect(this.gain);
      this.osc1.start();

      // Subtle atmospheric harmonic (110Hz - A2 note)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(110, this.ctx.currentTime);
      this.osc2.connect(this.gain);
      this.osc2.start();

      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio ambience unavailable', e);
    }
  }

  stopAmbience() {
    try {
      if (this.gain && this.ctx) {
        this.gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.osc1) { this.osc1.stop(); this.osc1.disconnect(); this.osc1 = null; }
          if (this.osc2) { this.osc2.stop(); this.osc2.disconnect(); this.osc2 = null; }
          this.isPlaying = false;
        }, 600);
      }
    } catch (e) {}
  }
}

const audioCinema = new CinemaAudioEngine();

/* ─── CINEMA VISUAL SIMULATION STAGE (The Living Animated Architecture) ─── */
function ArchitectureCinemaScreen({ filmId, chapterId, isPlaying, playbackSpeed }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let tick = 0;

    const render = () => {
      tick += 0.03 * playbackSpeed;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;

      // Deep dark cinematic canvas background with subtle grid
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      /* ─── SCENE 1: REDIS MULTIPLEXING EVENT LOOP RADAR ─── */
      if (filmId === 'redis') {
        const cx = w * 0.48;
        const cy = h * 0.5;
        const radius = Math.min(w, h) * 0.32;

        // Outer Client Ring (Simulating 10,000 Sockets)
        const clientCount = 14;
        for (let i = 0; i < clientCount; i++) {
          const angle = (i / clientCount) * Math.PI * 2 + (isPlaying ? tick * 0.2 : 0);
          const px = cx + Math.cos(angle) * (radius + 35);
          const py = cy + Math.sin(angle) * (radius + 35);

          // Client socket node
          const isActive = Math.sin(tick * 2 + i) > 0.3;
          ctx.beginPath();
          ctx.arc(px, py, isActive ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)';
          ctx.shadowColor = isActive ? '#38bdf8' : 'transparent';
          ctx.shadowBlur = isActive ? 12 : 0;
          ctx.fill();

          // Incoming data packet streams toward the central epoll ring
          if (isActive && isPlaying) {
            const streamProgress = ((tick * 1.5 + i) % 1);
            const packetX = px + (cx - px) * streamProgress;
            const packetY = py + (cy - py) * streamProgress;

            ctx.beginPath();
            ctx.arc(packetX, packetY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#f43f5e';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 8;
            ctx.fill();

            // Connecting laser filament
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(cx, cy);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // The Central Event Multiplexer Ring (epoll_wait)
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rotating Scanner Sweep (The Single Main Thread)
        const sweepAngle = isPlaying ? tick * 2.5 : 0;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sweepAngle);

        const sweepGrad = ctx.createLinearGradient(0, 0, radius, 0);
        sweepGrad.addColorStop(0, 'rgba(244, 63, 94, 0.9)');
        sweepGrad.addColorStop(1, 'rgba(244, 63, 94, 0.0)');

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, 0, Math.PI / 4);
        ctx.closePath();
        ctx.fillStyle = sweepGrad;
        ctx.fill();
        ctx.restore();

        // Core Hub: Single Sequential Execution Engine
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SINGLE', cx, cy - 3);
        ctx.fillStyle = '#f43f5e';
        ctx.fillText('THREAD', cx, cy + 9);

        // Telemetry readout tags
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.textAlign = 'left';
        ctx.fillText('● epoll_wait(): ACTIVE', 16, 26);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('I/O Mutex Locks: ZERO', 16, 42);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.9)';
        ctx.fillText('Ops/Sec: 114,250', 16, 58);
      } 
      
      /* ─── SCENE 2: GIT MERKLE TREE DAG SNAPSHOTS ─── */
      else if (filmId === 'git') {
        const startX = 60;
        const centerY = h * 0.5;

        // Draw Merkle DAG Commit Nodes
        const commits = [
          { name: 'C1 (Root)', sha: 'e83c516', x: startX, y: centerY },
          { name: 'C2 (Tree)', sha: '7bb831a', x: startX + 90, y: centerY },
          { name: 'C3 (Index)', sha: 'd910fe2', x: startX + 180, y: centerY - 40 },
          { name: 'C4 (Branch)', sha: '41ca98b', x: startX + 180, y: centerY + 40 },
          { name: 'C5 (Merge)', sha: '83f9a11', x: startX + 270, y: centerY }
        ];

        // Draw connections
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
        ctx.lineWidth = 2;
        commits.forEach((node, i) => {
          if (i === 1) {
            ctx.beginPath(); ctx.moveTo(commits[0].x, commits[0].y); ctx.lineTo(node.x, node.y); ctx.stroke();
          } else if (i === 2 || i === 3) {
            ctx.beginPath(); ctx.moveTo(commits[1].x, commits[1].y); ctx.lineTo(node.x, node.y); ctx.stroke();
          } else if (i === 4) {
            ctx.beginPath(); ctx.moveTo(commits[2].x, commits[2].y); ctx.lineTo(node.x, node.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(commits[3].x, commits[3].y); ctx.lineTo(node.x, node.y); ctx.stroke();
          }
        });

        // Draw nodes
        commits.forEach((node, i) => {
          const isPulse = isPlaying && ((Math.floor(tick * 2) % commits.length) === i);
          ctx.beginPath();
          ctx.arc(node.x, node.y, isPulse ? 14 : 10, 0, Math.PI * 2);
          ctx.fillStyle = isPulse ? '#fb923c' : '#ea580c';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = isPulse ? 20 : 6;
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, node.x, node.y - 18);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillText(node.sha.slice(0, 4), node.x, node.y + 22);
        });

        // Telemetry readout tags
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(249, 115, 22, 0.9)';
        ctx.textAlign = 'left';
        ctx.fillText('● MERKLE DAG: IMMUTABLE SHA-1', 16, 26);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('Direct File Diffing: BYPASSED', 16, 42);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.9)';
        ctx.fillText('Tree Diff Speed: O(1) by Hash', 16, 58);
      }

      /* ─── SCENE 3: REACT FIBER COOPERATIVE WORK LOOP ─── */
      else {
        const cx = w * 0.5;
        const cy = h * 0.5;

        // Browser Frame 16.6ms Deadline Bar
        const frameWidth = w * 0.6;
        const frameHeight = 22;
        const frameX = cx - frameWidth / 2;
        const frameY = cy - 35;

        // Container
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);

        // Progress Fill: 16.6ms Time Slice Budget
        const progress = isPlaying ? (tick % 1.6) / 1.6 : 0.65;
        ctx.fillStyle = progress > 0.85 ? '#ef4444' : '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.fillRect(frameX + 2, frameY + 2, (frameWidth - 4) * progress, frameHeight - 4);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`FRAME BUDGET: ${(16.6 * (1 - progress)).toFixed(1)}ms REMAINING`, cx, frameY + 15);

        // Yielding & Resuming Arrows
        ctx.fillStyle = progress > 0.85 ? '#f87171' : '#38bdf8';
        ctx.font = '9px monospace';
        ctx.fillText(progress > 0.85 ? 'YIELDING TO USER INPUT (60 FPS)' : 'RECONCILING FIBER TREE NODES...', cx, frameY + 50);

        // Telemetry readout tags
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.textAlign = 'left';
        ctx.fillText('● FIBER COOPERATIVE LOOP: ACTIVE', 16, 26);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('Call Stack Blocking: 0ms', 16, 42);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.9)';
        ctx.fillText('Frame Rate: Solid 60.0 FPS', 16, 58);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [filmId, chapterId, isPlaying, playbackSpeed]);

  return (
    <div className="w-full h-[220px] sm:h-[260px] md:h-[280px] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl bg-[#060913]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Film Projector Beam Lighting Gradient */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-full pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 80%)',
          clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)'
        }}
      />

      {/* Screen Title Pill */}
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-gray-300 flex items-center gap-1.5 shadow-lg">
        <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
        <span>CINEMA ARCHITECTURE SIMULATOR</span>
      </div>

      {/* Play status watermark */}
      <div className="absolute bottom-3 right-3 text-[10px] font-mono font-black tracking-widest text-white/30 uppercase">
        {isPlaying ? '▶ LIVE PROJECTION' : '⏸ THEATER PAUSED'}
      </div>
    </div>
  );
}

/* ─── LEGENDARY CODEBASE MASTERPIECES ─── */
const CINEMA_FILMS = [
  {
    id: 'redis',
    title: 'The Single-Threaded Speed Demon',
    subtitle: 'Redis v0.01 ➔ v7.0',
    creator: 'Salvatore Sanfilippo (antirez)',
    releaseYear: '2009',
    language: 'C',
    color: 'from-rose-500 via-red-500 to-amber-500',
    accentColor: '#f43f5e',
    stars: '65K+ Stars',
    logline: 'How 350 lines of pure C shattered the myth that high-concurrency memory databases require multi-threaded pthread locks.',
    keyTakeaway: 'Single-threaded event loop multiplexing with I/O polling (epoll/kqueue) eliminates lock contention completely.',
    chapters: [
      {
        id: 1,
        title: 'The Genesis Hash & Memory Struct',
        commitSha: 'd280b18',
        timestamp: 'Day 1 • March 2009',
        file: 'redis.c',
        dilemma: 'Relational DBs (MySQL) were choking on real-time website analytics. Salvatore needed raw in-memory lookup in under 100 microseconds.',
        tradeoff: 'Sacrificed persistent disk ACID transactions in favor of zero-overhead in-memory key-value maps.',
        narration: "Welcome to Day 1. In March 2009, Salvatore Sanfilippo sits in Sicily frustrated by MySQL query latency. Notice this first struct: instead of complex B-Trees, he builds a clean hash table with custom string pointers. It is raw, dangerous, and blazingly fast.",
        interviewQuestion: 'Why does Redis not use standard C-strings (null-terminated char*)?',
        interviewAnswer: 'Standard C strings require O(N) strlen() lookups and are binary-unsafe. Salvatore designed SDS (Simple Dynamic Strings) which prefix the buffer with length and free capacity, giving O(1) length checks and zero-copy string concats.',
        code: `/* Redis 0.01 Genesis: Pure In-Memory Dictionary */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct dictEntry {
    void *key;
    void *val;
    struct dictEntry *next;
} dictEntry;

typedef struct dictht {
    dictEntry **table;
    unsigned long size;
    unsigned long sizemask;
    unsigned long used;
} dictht;

/* O(1) Memory Bucket Lookup without any locking overhead */
dictEntry *dictFind(dictht *ht, const void *key) {
    unsigned int h = dictHashKey(key) & ht->sizemask;
    dictEntry *he = ht->table[h];
    while (he) {
        if (dictCompareKeys(key, he->key))
            return he;
        he = he->next;
    }
    return NULL;
}`
      },
      {
        id: 2,
        title: 'The Single-Threaded Multiplexing Breakthrough',
        commitSha: 'e713f09',
        timestamp: 'Day 18 • April 2009',
        file: 'ae.c',
        dilemma: 'Spawning 10,000 OS threads for 10,000 client sockets was causing severe kernel context-switching latency.',
        tradeoff: 'Replaced multi-threading with a non-blocking asynchronous event multiplexer (ae.c) wrapping Linux epoll and BSD kqueue.',
        narration: "Here comes the turning point. Everyone told Salvatore: multi-core CPUs require threads! Salvatore disagreed. In ae.c, he implements an event loop that listens to thousands of file descriptors. The CPU never sleeps waiting on network I/O.",
        interviewQuestion: 'How does a single thread handle 100,000 requests per second in Redis?',
        interviewAnswer: 'Network packet arrival triggers epoll interrupts. The CPU processes commands entirely in RAM without OS context-switching, cache-thrashing, or mutex contention.',
        code: `/* ae.c - The Legendary Asynchronous Event Loop Engine */
#include <sys/epoll.h>

typedef struct aeEventLoop {
    int maxfd;
    aeFileEvent events[AE_SETSIZE];
    aeFiredEvent fired[AE_SETSIZE];
    int stop;
} aeEventLoop;

int aeProcessEvents(aeEventLoop *eventLoop, int flags) {
    int numevents = epoll_wait(eventLoop->epoll_fd, eventLoop->events, AE_SETSIZE, -1);
    
    for (int j = 0; j < numevents; j++) {
        aeFileEvent *fe = &eventLoop->events[eventLoop->fired[j].fd];
        int mask = eventLoop->fired[j].mask;
        
        /* ZERO mutex locks! Pure sequential execution in RAM */
        if (mask & AE_READABLE) fe->rfileProc(eventLoop, fe->clientData);
        if (mask & AE_WRITABLE) fe->wfileProc(eventLoop, fe->clientData);
    }
    return numevents;
}`
      },
      {
        id: 3,
        title: 'The SkipList: Sorted Sets in O(log N)',
        commitSha: '84b02fa',
        timestamp: 'Day 42 • June 2009',
        file: 't_zset.c',
        dilemma: 'Leaderboards and priority score sorting needed logarithmic insertion and range queries without the complex rebalancing overhead of Red-Black Trees.',
        tradeoff: 'Chose probabilistic SkipLists over AVL/Red-Black trees: simpler code, lock-free potential, and vastly faster range scans.',
        narration: "Chapter 3: The Skiplist. Look at this beauty. William Pugh invented skiplists, but Salvatore brought them to life for leaderboards. By tossing virtual coins for node heights, Redis sorts millions of gamers and rankings with zero tree rotation locks.",
        interviewQuestion: 'Why did Redis choose SkipLists over Red-Black Trees for ZSETs?',
        interviewAnswer: 'SkipLists are dramatically easier to implement, consume less memory overhead per node, and allow O(1) successor traversal for ZRANGE queries by following the bottom level pointers.',
        code: `/* t_zset.c - Probabilistic Multi-Level SkipList */
typedef struct zskiplistNode {
    robj *obj;
    double score;
    struct zskiplistNode *backward;
    struct zskiplistLevel {
        struct zskiplistNode *forward;
        unsigned int span;
    } level[];
} zskiplistNode;

/* Insert node with randomized logarithmic height */
zskiplistNode *zslInsert(zskiplist *zsl, double score, robj *obj) {
    zskiplistNode *update[ZSKIPLIST_MAXLEVEL], *x;
    int i, level = zslRandomLevel();
    
    x = zslCreateNode(level, score, obj);
    for (i = 0; i < level; i++) {
        x->level[i].forward = update[i]->level[i].forward;
        update[i]->level[i].forward = x;
    }
    return x;
}`
      }
    ]
  },
  {
    id: 'git',
    title: 'The Content-Addressable Revolution',
    subtitle: 'Git v0.01 ➔ v2.40',
    creator: 'Linus Torvalds',
    releaseYear: '2005',
    language: 'C',
    color: 'from-amber-500 via-orange-500 to-rose-600',
    accentColor: '#f97316',
    stars: '52K+ Stars',
    logline: 'Written in 10 furious days after BitKeeper revoked the Linux kernel license: A content-addressable filesystem disguised as a VCS.',
    keyTakeaway: 'Git is not a patch tracker; it is a Merkle DAG of immutable cryptographic SHA-1 hashes storing tree snapshots.',
    chapters: [
      {
        id: 1,
        title: 'The 10-Day Manifesto: Everything is a SHA-1',
        commitSha: 'e83c516',
        timestamp: 'Day 1 • April 2005',
        file: 'read-cache.c',
        dilemma: 'CVS and SVN tracked slow delta patches between files. Linus needed instantaneous diffs across 100,000 files.',
        tradeoff: 'Discarded file diffing. Modeled the repository as a content-addressed object store indexed by 40-character SHA-1 hashes.',
        narration: "April 2005. Linus Torvalds locks himself in his home office after BitKeeper cut off the Linux team. In just 48 hours, he codes the fundamental truth of Git: files do not have names; files have SHA-1 hashes of their content. If two files have identical code, they share the exact same hash.",
        interviewQuestion: 'Why is Git called a content-addressable storage engine?',
        interviewAnswer: 'Because object IDs are calculated purely by hashing the raw content (SHA-1/SHA-256). Changing even one comma alters the hash completely, ensuring cryptographic tamper-proofing.',
        code: `/* read-cache.c - Linus's Initial 10-Day Object Database */
#include <openssl/sha.h>
#include <sys/stat.h>

struct cache_entry {
    struct stat st;
    unsigned int ce_flags;
    unsigned char sha1[20]; /* 160-bit unique cryptographic address */
    char name[0];
};

/* Convert any raw file into an immutable cryptographic blob */
int write_sha1_file(char *buf, unsigned len, const char *type, unsigned char *return_sha1) {
    SHA_CTX c;
    SHA1_Init(&c);
    SHA1_Update(&c, type, strlen(type));
    SHA1_Update(&c, " ", 1);
    SHA1_Update(&c, buf, len);
    SHA1_Final(return_sha1, &c);
    return write_sha1_buffer(return_sha1, buf, len);
}`
      }
    ]
  },
  {
    id: 'react',
    title: 'The Virtual DOM & Fiber Architecture',
    subtitle: 'React v0.1.0 ➔ Fiber',
    creator: 'Jordan Walke & Sophie Alpert',
    releaseYear: '2013',
    language: 'JavaScript',
    color: 'from-cyan-500 via-blue-500 to-indigo-600',
    accentColor: '#06b6d4',
    stars: '220K+ Stars',
    logline: 'Breaking the monolithic browser DOM call stack with cooperative scheduling, priority lanes, and the virtual tree reconciler.',
    keyTakeaway: 'Never touch the real DOM directly; reconcile in-memory light JS trees and schedule updates with requestIdleCallback.',
    chapters: [
      {
        id: 1,
        title: 'The Virtual DOM: Pure State to UI Projection',
        commitSha: '6328a9b',
        timestamp: 'Day 1 • May 2013',
        file: 'ReactCompositeComponent.js',
        dilemma: 'Direct browser DOM manipulation (jQuery style) was slow, buggy, and caused uncontrollable re-layout cascades.',
        tradeoff: 'UI = f(State): Created lightweight JS objects mirroring the DOM, computing minimal mutation patches.',
        narration: "May 2013 at JSConf. Jordan Walke presents React. The audience gasped when he claimed: re-render everything on every state change! Why? Because the Virtual DOM diff runs in microsecond JavaScript memory, only touching the slow browser C++ DOM for exact mutations.",
        interviewQuestion: 'Why is the Virtual DOM fast if it still touches the real DOM eventually?',
        interviewAnswer: 'VDOM batches multiple mutations into a single repaint pass, minimizes browser layout thrashing, and computes the minimal diff matrix using a heuristic O(N) tree diff algorithm.',
        code: `/* React 0.1.0: Virtual Element Definition */
function createElement(type, config, children) {
    var propName;
    var props = {};
    for (propName in config) {
        if (config.hasOwnProperty(propName)) {
            props[propName] = config[propName];
        }
    }
    /* Simple JS object representation of a native DOM node */
    return {
        _isReactElement: true,
        type: type,
        props: props,
        children: children
    };
}`
      }
    ]
  }
];

export default function CodeCinema({ setActiveTab, user }) {
  const [selectedFilmIndex, setSelectedFilmIndex] = useState(0);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isAudioAmbienceEnabled, setIsAudioAmbienceEnabled] = useState(false);
  const [displayedCodeLength, setDisplayedCodeLength] = useState(0);
  const [showForkModal, setShowForkModal] = useState(false);
  const [forkedCode, setForkedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTabSub, setActiveTabSub] = useState('blueprint'); // 'blueprint', 'code', 'interview'

  const film = CINEMA_FILMS[selectedFilmIndex];
  const chapter = film.chapters[selectedChapterIndex] || film.chapters[0];
  const fullCode = chapter.code;

  // Code Typing & Playback Animation
  useEffect(() => {
    setDisplayedCodeLength(0);
    setIsPlaying(false);
  }, [selectedFilmIndex, selectedChapterIndex]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setDisplayedCodeLength((prev) => {
          if (prev >= fullCode.length) {
            setIsPlaying(false);
            return fullCode.length;
          }
          return Math.min(fullCode.length, prev + Math.max(3, Math.floor(8 * playbackSpeed)));
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isPlaying, fullCode, playbackSpeed]);

  // Voice Narration Engine using Browser Web Speech API
  useEffect(() => {
    if (isVoiceEnabled && isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(chapter.narration);
        utterance.rate = 1.0 * playbackSpeed;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isVoiceEnabled, isPlaying, chapter]);

  // Handle Audio Ambience Toggle
  const toggleAudioAmbience = () => {
    if (!isAudioAmbienceEnabled) {
      audioCinema.startAmbience();
      setIsAudioAmbienceEnabled(true);
    } else {
      audioCinema.stopAmbience();
      setIsAudioAmbienceEnabled(false);
    }
  };

  const togglePlay = () => {
    if (displayedCodeLength >= fullCode.length) {
      setDisplayedCodeLength(0);
    }
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState && isAudioAmbienceEnabled) {
      audioCinema.startAmbience();
    }
  };

  const handleNextChapter = () => {
    if (selectedChapterIndex < film.chapters.length - 1) {
      setSelectedChapterIndex(selectedChapterIndex + 1);
    } else if (selectedFilmIndex < CINEMA_FILMS.length - 1) {
      setSelectedFilmIndex(selectedFilmIndex + 1);
      setSelectedChapterIndex(0);
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapterIndex > 0) {
      setSelectedChapterIndex(selectedChapterIndex - 1);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fullCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleForkMoment = () => {
    setForkedCode(fullCode);
    setShowForkModal(true);
  };

  return (
    <div className="min-h-screen bg-[#040711] text-white pb-24 selection:bg-rose-500/30 selection:text-rose-200">
      {/* ─── CINEMA HERO HEADER ─── */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-[#0a1020] via-[#070b16] to-[#040711] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 overflow-hidden">
        {/* Overhead projector light cone */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-25"
          style={{ background: `radial-gradient(circle, ${film.accentColor} 0%, transparent 70%)` }}
        />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-black shadow-lg shadow-rose-500/20 mb-3.5">
              <Clapperboard className="w-4 h-4 animate-pulse text-rose-400" />
              <span>CodeCinema™ • 4D Architectural Theater</span>
              <span className="px-1.5 py-0.2 text-[9px] rounded-md bg-rose-500 text-white font-extrabold uppercase">IMAX</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Watch Architecture Unfold.<br />
              <span className={`bg-gradient-to-r ${film.color} bg-clip-text text-transparent`}>
                The Living Code Cinema.
              </span>
            </h1>

            <p className="text-gray-400 text-xs sm:text-sm font-medium max-w-2xl mt-2.5 leading-relaxed">
              Step inside the real-time simulation screen. Watch how single-threaded event loops, Merkle DAGs, and Fiber engines execute visually on the canvas while the code types itself and the AI Director narrates the story.
            </p>
          </div>

          {/* Quick Sound & Theater Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleAudioAmbience}
              className={`px-4 py-3 rounded-2xl border transition-all text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg ${
                isAudioAmbienceEnabled
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-rose-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {isAudioAmbienceEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
              <span>{isAudioAmbienceEnabled ? 'Cinema Synth: ON' : 'Cinema Synth: OFF'}</span>
            </button>

            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`px-4 py-3 rounded-2xl border transition-all text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg ${
                isVoiceEnabled
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-purple-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <span>🎙️ Voice: {isVoiceEnabled ? 'ACTIVE' : 'MUTED'}</span>
            </button>
          </div>
        </div>

        {/* ─── MASTERPIECE REEL SELECTOR BAR ─── */}
        <div className="max-w-7xl mx-auto mt-8 flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {CINEMA_FILMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedFilmIndex(idx);
                setSelectedChapterIndex(0);
              }}
              className={`px-4 py-2.5 rounded-2xl border text-left shrink-0 transition-all flex items-center gap-3 cursor-pointer ${
                selectedFilmIndex === idx
                  ? 'bg-white/15 border-white/30 text-white shadow-xl shadow-white/5 scale-[1.02]'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md shrink-0"
                style={{ background: item.accentColor }}
              >
                {item.title.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-black text-white">{item.subtitle}</div>
                <div className="text-[10px] text-gray-400 font-medium">{item.creator}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN CINEMA SHOWCASE (THE VISUAL SCREEN IS FRONT & CENTER) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* 🌟 1. THE BIG SCREEN: LIVE VISUAL ARCHITECTURE SIMULATOR CANVAS 🌟 */}
        <div className="relative group">
          <ArchitectureCinemaScreen 
            filmId={film.id}
            chapterId={chapter.id}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
          />
        </div>

        {/* ─── FILM CHAPTER INFO & THEATER CONTROL DECK ─── */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-500/30">
                Chapter {chapter.id} of {film.chapters.length}
              </span>
              <span className="text-xs text-gray-400 font-semibold">• {chapter.timestamp}</span>
              <span className="text-xs text-cyan-400 font-mono font-bold">• commit #{chapter.commitSha}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{chapter.title}</h2>
            <p className="text-xs text-gray-300 mt-1 max-w-3xl leading-relaxed">{chapter.dilemma}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Play/Pause Cinema Button */}
            <button
              onClick={togglePlay}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-rose-500/30 flex items-center gap-2 cursor-pointer transition-all transform active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause Cinema</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{displayedCodeLength >= fullCode.length ? 'Replay Cinema' : 'Play Cinema'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleForkMoment}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/15 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <GitBranch className="w-3.5 h-3.5 text-rose-400" />
              <span>Fork Moment</span>
            </button>
          </div>
        </div>

        {/* ─── DIRECTOR'S SUBTITLE BAR (MOVIE CAPTION STYLE) ─── */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm shrink-0">
            🎬
          </div>
          <div className="flex-1 text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
            <span className="text-rose-400 font-bold uppercase tracking-wider text-[11px] mr-2">
              [{film.creator}]:
            </span>
            "{chapter.narration}"
          </div>
        </div>

        {/* ─── DUAL DECK: CODE PROJECTION SCREEN + SYSTEM DOSSIER ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Code Teleprompter (7 Columns) */}
          <div className="lg:col-span-7 bg-[#050811] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            {/* Window Topbar */}
            <div className="px-4 py-3 bg-[#0a0f1d] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <div className="h-4 w-px bg-white/10 ml-2 mr-1" />
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-300">
                  <Terminal className="w-3.5 h-3.5 text-rose-400" />
                  <span>{chapter.file}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">{film.language}</span>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto min-h-[300px] max-h-[420px] overflow-y-auto custom-scrollbar bg-[#03060d]">
              <pre className="text-gray-200">
                <code>
                  {fullCode.slice(0, displayedCodeLength || fullCode.length)}
                  {isPlaying && (
                    <span className="inline-block w-2 h-4 bg-rose-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </code>
              </pre>
            </div>

            {/* Playback Controls Footer */}
            <div className="px-5 py-3.5 bg-[#0a0f1d] border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevChapter}
                  disabled={selectedChapterIndex === 0}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all cursor-pointer"
                  title="Previous Chapter"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleNextChapter}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
                  title="Next Chapter"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                {[0.5, 1, 2, 5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      playbackSpeed === speed
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Architecture Blueprint & System Design Dossier (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Tab Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10">
              <button
                onClick={() => setActiveTabSub('blueprint')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTabSub === 'blueprint' ? 'bg-white/15 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>System Trade-off</span>
              </button>

              <button
                onClick={() => setActiveTabSub('interview')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTabSub === 'interview' ? 'bg-white/15 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>FAANG Question</span>
              </button>
            </div>

            {/* Tab 1: System Trade-Off Blueprint */}
            {activeTabSub === 'blueprint' && (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4 animate-fade-in text-left">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    ⚖️
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">The Architectural Dilemma</div>
                    <div className="text-[10px] text-gray-400">Why standard solutions were rejected</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300">
                    <strong className="text-rose-400 block mb-1">The Problem:</strong>
                    {chapter.dilemma}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300">
                    <strong className="text-emerald-400 block mb-1">The Solution & Trade-off:</strong>
                    {chapter.tradeoff}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-indigo-950/40 border border-rose-500/20 flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                    <div className="text-xs text-gray-300">
                      <strong className="text-white">Takeaway: </strong>{film.keyTakeaway}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: FAANG Interview Cross-Examination */}
            {activeTabSub === 'interview' && (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4 animate-fade-in text-left">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    🎯
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">L5/L6 Interview Question</div>
                    <div className="text-[10px] text-amber-300 font-semibold">How recruiters test this on whiteboards</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-200">
                  Q: {chapter.interviewQuestion}
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed">
                  <strong className="text-white block mb-1">Staff Engineer Model Answer:</strong>
                  {chapter.interviewAnswer}
                </div>
              </div>
            )}

            {/* Chapter Reel Navigator (Mini Timeline) */}
            <div className="p-4 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-2">
              <div className="text-[11px] font-black uppercase text-gray-400 px-1 tracking-wider">Chapter Reel Navigator</div>
              <div className="space-y-1.5">
                {film.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapterIndex(idx)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      selectedChapterIndex === idx
                        ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300 shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-lg bg-black/40 flex items-center justify-center text-[10px] font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{ch.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── FORK THIS MOMENT LIVE SANDBOX MODAL ─── */}
      {showForkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b0f19] border border-white/15 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl text-left flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Fork This Moment: {chapter.title}</h3>
                  <p className="text-xs text-gray-400 font-mono">Forking from {film.title} (Commit #{chapter.commitSha})</p>
                </div>
              </div>

              <button
                onClick={() => setShowForkModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 mb-3">
              You are now in the creator's shoes. Tweak the algorithm below or copy it to the Lumixora Code Editor to test alternative implementations:
            </p>

            <textarea
              value={forkedCode}
              onChange={(e) => setForkedCode(e.target.value)}
              className="w-full flex-1 bg-[#050811] border border-white/10 rounded-2xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-rose-500 resize-none min-h-[300px] custom-scrollbar"
            />

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(forkedCode);
                  alert('Code copied to clipboard! You can paste it directly into Lumixora Code Editor.');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Fork</span>
              </button>

              <button
                onClick={() => {
                  setShowForkModal(false);
                  if (setActiveTab) setActiveTab('code-editor');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Launch in Lumixora Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
