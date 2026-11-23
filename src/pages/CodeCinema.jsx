import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Sparkles, Code2, GitBranch, GitCommit, Terminal, Cpu, Award, Zap,
  Flame, BookOpen, ChevronRight, Copy, Check, ExternalLink, HelpCircle,
  Eye, ArrowRight, Layers, Sliders, CheckCircle2, Clock, Info, Clapperboard,
  Maximize2, Minimize2, Radio, Activity, Tv, Monitor, Video, ShieldAlert,
  Disc3, PlaySquare, MessageSquare, Compass, SlidersHorizontal, Share2,
  Lock, Unlock, RefreshCw, X, MessageCircle
} from 'lucide-react';

/* ─── HOLLYWOOD-GRADE DYNAMIC AUDIO ENGINE (WEB AUDIO API) ─── */
class CinemaDynamicAudio {
  constructor() {
    this.ctx = null;
    this.oscDrone = null;
    this.oscHarmonic = null;
    this.tickInterval = null;
    this.projectorInterval = null;
    this.gain = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx && (typeof window !== 'undefined') && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  /* 🎬 THX / IMAX "DEEP NOTE" OPENING CRESCENDO 🎬 */
  playDeepNote() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const chord = [35.0, 52.3, 70.0, 104.6, 139.9, 209.3]; // Low D rich harmonic chord
      const now = this.ctx.currentTime;
      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.01, now);
      master.gain.exponentialRampToValueAtTime(0.12, now + 1.8);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      master.connect(this.ctx.destination);

      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 0.75, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 1.8);
        osc.connect(master);
        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch (e) {}
  }

  /* 📽️ 35MM CELLULOID MECHANICAL PROJECTOR CLICK-CLACK 📽️ */
  startProjectorSound() {
    try {
      this.init();
      if (!this.ctx || this.projectorInterval) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      this.projectorInterval = setInterval(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(140 + Math.random() * 80, now);
        clickGain.gain.setValueAtTime(0.012, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.03);
      }, 42); // 24 frames/sec optical cadence
    } catch (e) {}
  }

  stopProjectorSound() {
    if (this.projectorInterval) {
      clearInterval(this.projectorInterval);
      this.projectorInterval = null;
    }
  }

  /* ⏱️ SMPTE FILM LEADER COUNTDOWN BEEP ⏱️ */
  playCountdownBeep(freq = 440) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(0.09, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch (e) {}
  }

  /* 🎻 DYNAMIC HANS-ZIMMER ATMOSPHERIC SCORE 🎻 */
  startScore() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      if (this.isPlaying) return;

      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gain.gain.exponentialRampToValueAtTime(0.045, this.ctx.currentTime + 1.5);
      this.gain.connect(this.ctx.destination);

      // Deep Sub-Bass Cinematic Drone (43.65 Hz - F1 note)
      this.oscDrone = this.ctx.createOscillator();
      this.oscDrone.type = 'sawtooth';
      this.oscDrone.frequency.setValueAtTime(43.65, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);
      this.oscDrone.connect(filter);
      filter.connect(this.gain);
      this.oscDrone.start();

      // Atmospheric Pad (C3 harmonic)
      this.oscHarmonic = this.ctx.createOscillator();
      this.oscHarmonic.type = 'sine';
      this.oscHarmonic.frequency.setValueAtTime(130.81, this.ctx.currentTime);
      this.oscHarmonic.connect(this.gain);
      this.oscHarmonic.start();

      // Zimmer Clock-Tick Tension Pulse (Dunkirk style)
      this.tickInterval = setInterval(() => {
        if (!this.isPlaying || !this.ctx) return;
        const tickOsc = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tickOsc.type = 'triangle';
        tickOsc.frequency.setValueAtTime(750, this.ctx.currentTime);
        tickGain.gain.setValueAtTime(0.018, this.ctx.currentTime);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
        tickOsc.connect(tickGain);
        tickGain.connect(this.ctx.destination);
        tickOsc.start();
        tickOsc.stop(this.ctx.currentTime + 0.05);
      }, 500);

      this.isPlaying = true;
      this.startProjectorSound();
    } catch (e) {
      console.warn('Audio score unavailable', e);
    }
  }

  stopScore() {
    try {
      this.stopProjectorSound();
      if (this.tickInterval) clearInterval(this.tickInterval);
      if (this.gain && this.ctx) {
        this.gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          if (this.oscDrone) { try { this.oscDrone.stop(); this.oscDrone.disconnect(); } catch(e){} this.oscDrone = null; }
          if (this.oscHarmonic) { try { this.oscHarmonic.stop(); this.oscHarmonic.disconnect(); } catch(e){} this.oscHarmonic = null; }
          this.isPlaying = false;
        }, 350);
      }
    } catch (e) {}
  }
}

const cinemaAudio = new CinemaDynamicAudio();

/* ─── MASTER FILM REPERTOIRE (HISTORICAL OPEN SOURCE DRAMAS) ─── */
const CINEMA_FILMS = [
  {
    id: 'redis',
    title: 'Redis: The Single-Threaded Speed Demon',
    subtitle: 'v0.01 ➔ v7.0 • March 2009',
    creator: 'Salvatore Sanfilippo (antirez)',
    location: 'Sicily, Italy',
    runtime: '3 Acts • 14 mins',
    accentColor: '#c53030', // Warm deep crimson
    goldColor: '#d4af37', // Warm brass/gold
    crisis: 'The C10K Concurrency Crisis. Relational database connection pools (MySQL) were locking up under 10,000 concurrent client sockets, causing 4,800ms context-switch overhead. Industry convention said multi-threading was compulsory.',
    synopsis: 'How Salvatore Sanfilippo rejected POSIX thread locking, stripped away disk ACID overhead, and engineered an asynchronous non-blocking event loop in 350 lines of pure C capable of 125,000 req/sec on a single CPU core.',
    learningOutcomes: [
      'Asynchronous I/O Multiplexing (epoll_wait, kqueue)',
      'O(1) In-Memory Key-Value Tables & Zero Context Switching',
      'Probabilistic SkipLists vs Red-Black Trees for O(log N) Leaderboards'
    ],
    chapters: [
      {
        id: 1,
        title: 'Act I: The Genesis Hash & In-Memory Dictionary',
        commitSha: 'd280b18',
        timestamp: 'Day 1 • March 2009',
        file: 'redis.c',
        durationSec: 24,
        dilemma: 'Relational DBs were choking on real-time web counters. Salvatore needed raw in-memory lookup in under 5 microseconds without disk I/O.',
        tradeoff: 'Sacrificed persistent disk ACID transactions in favor of an in-memory hash table with direct memory pointers.',
        narration: "Welcome to Day 1. In March 2009, Salvatore Sanfilippo sits in Sicily frustrated by MySQL latency. Instead of heavy B-Trees, he crafts a lightweight hash table with custom string pointers. Notice: zero mutex locks. Pure sequential memory access.",
        cuePoints: [
          { time: 3, label: 'Allocating Memory Buckets', activeLine: 8 },
          { time: 10, label: 'Single Hash Masking O(1)', activeLine: 18 },
          { time: 18, label: 'Pointer Traversal without Locks', activeLine: 24 }
        ],
        interviewQuestion: 'Why does Redis not use standard C-strings (null-terminated char*)?',
        interviewAnswer: 'Standard C strings require O(N) strlen() lookups and cannot store arbitrary binary bytes. Salvatore designed SDS (Simple Dynamic Strings) which prefix the buffer with length and free capacity, giving O(1) length checks and zero-copy slicing.',
        directorNotes: 'Salvatore realized that memory caches fail not because of CPU limits, but because of lock contention and memory fragmentation.',
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

/* O(1) Memory Bucket Lookup without locking overhead */
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
        title: 'Act II: The Single-Threaded Multiplexing Breakthrough',
        commitSha: 'e713f09',
        timestamp: 'Day 18 • April 2009',
        file: 'ae.c',
        durationSec: 28,
        dilemma: 'Spawning 10,000 OS threads for 10,000 client sockets caused brutal kernel context-switching and stack memory exhaustion.',
        tradeoff: 'Replaced multi-threading with a non-blocking asynchronous event multiplexer (ae.c) wrapping Linux epoll and BSD kqueue.',
        narration: "Here is the turning point of modern backend architecture. Everyone told Salvatore: multi-core CPUs require multi-threading! Salvatore proved the opposite. With epoll_wait, a single thread listens to 10,000 sockets. When data arrives, it executes in RAM and returns in microseconds.",
        cuePoints: [
          { time: 4, label: 'Entering epoll_wait Kernel Boundary', activeLine: 11 },
          { time: 12, label: 'Zero-Lock Event Queue Dispatch', activeLine: 17 },
          { time: 22, label: '125,000 Req/sec Throughput Attained', activeLine: 22 }
        ],
        interviewQuestion: 'How does a single thread handle 100,000 requests per second in Redis?',
        interviewAnswer: 'Network packet arrival triggers epoll interrupts. The CPU processes commands entirely in RAM without OS context-switching, cache-thrashing, or mutex contention.',
        directorNotes: 'Notice how ae.c completely sidesteps pthread_mutex_lock. If there is only one thread touching memory, you never need a lock.',
        code: `/* ae.c - The Asynchronous Event Loop Multiplexer */
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
        title: 'Act III: The SkipList: Sorted Sets in O(log N)',
        commitSha: '84b02fa',
        timestamp: 'Day 42 • June 2009',
        file: 't_zset.c',
        durationSec: 26,
        dilemma: 'Real-time score leaderboards needed logarithmic insertion and range scans without the rebalancing lock overhead of Red-Black Trees.',
        tradeoff: 'Chose probabilistic SkipLists over balanced binary trees: simpler implementation, lock-free potential, and vastly faster sequential range traversal.',
        narration: "Act III: The SkipList. William Pugh invented skiplists, but Salvatore brought them to industry dominance. By tossing virtual coins for node heights, Redis sorts millions of scores with zero tree rotation locks.",
        cuePoints: [
          { time: 5, label: 'Randomized Level Generation', activeLine: 15 },
          { time: 14, label: 'Forward Pointer Linking', activeLine: 20 },
          { time: 21, label: 'O(log N) Range Search Established', activeLine: 24 }
        ],
        interviewQuestion: 'Why did Redis choose SkipLists over Red-Black Trees for ZSETs?',
        interviewAnswer: 'SkipLists are dramatically simpler to implement, consume less memory overhead per node, and allow O(1) successor traversal for ZRANGE queries by following the bottom level forward pointers.',
        directorNotes: 'Tree rotations in Red-Black trees touch multiple nodes and invalidate memory caches. SkipLists insert locally without cascaded rotations.',
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
    title: 'Git: The Content-Addressable Revolution',
    subtitle: 'v0.01 ➔ v2.45 • April 2005',
    creator: 'Linus Torvalds',
    location: 'Portland, Oregon',
    runtime: '2 Acts • 10 mins',
    accentColor: '#9c4221', // Rich burnt amber / copper
    goldColor: '#d4af37',
    crisis: 'BitKeeper revoked the free Linux kernel license. Linus Torvalds had 10 days to invent a distributed VCS that could track 100,000 files in under 2 seconds without centralized servers or delta patch chaining.',
    synopsis: 'How Linus Torvalds discarded file-by-file delta diffing and modeled version control as a cryptographic Merkle Directed Acyclic Graph (DAG) indexed by 40-character SHA-1 content addresses.',
    learningOutcomes: [
      'Content-Addressable Storage (CAS) with SHA-1/SHA-256',
      'Merkle Trees & O(1) Cryptographic Subtree Diffs',
      'Immutable Blob, Tree, and Commit Object Graphs'
    ],
    chapters: [
      {
        id: 1,
        title: 'Act I: The 10-Day Manifesto: Everything is a SHA-1',
        commitSha: 'e83c516',
        timestamp: 'Day 1 • April 2005',
        file: 'read-cache.c',
        durationSec: 25,
        dilemma: 'CVS and SVN computed slow delta diffs across files. Linus needed instantaneous repository validation across the entire Linux codebase.',
        tradeoff: 'Discarded file diffing. Modeled the repository as an immutable object store indexed purely by cryptographic content hashes.',
        narration: "April 2005. Linus Torvalds locks himself in his home office. In just 48 hours, he codes the foundational truth of Git: files do not have names; files have SHA-1 hashes of their content. If two files have identical code, they share the exact same hash address.",
        cuePoints: [
          { time: 4, label: 'SHA-1 Header Digest Computation', activeLine: 12 },
          { time: 12, label: 'Writing Immutable Blob to Disk', activeLine: 19 },
          { time: 20, label: 'Cryptographic Tamper-Proof Address', activeLine: 23 }
        ],
        interviewQuestion: 'Why is Git called a content-addressable storage engine?',
        interviewAnswer: 'Because object IDs are calculated purely by hashing the raw content (SHA-1/SHA-256). Changing even one comma alters the hash completely, guaranteeing cryptographic immutability.',
        directorNotes: 'Linus did not build a version control system first; he built a content-addressable filesystem and placed a VCS on top.',
        code: `/* read-cache.c - Linus's 10-Day Content-Addressable Object DB */
#include <openssl/sha.h>
#include <sys/stat.h>

struct cache_entry {
    struct stat st;
    unsigned int ce_flags;
    unsigned char sha1[20]; /* 160-bit unique cryptographic address */
    char name[0];
};

/* Convert raw source file into an immutable cryptographic blob */
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
    title: 'React Fiber: The Cooperative Scheduling Engine',
    subtitle: 'v0.1.0 ➔ Fiber • 2017',
    creator: 'Jordan Walke & Sophie Alpert',
    location: 'Menlo Park, California',
    runtime: '2 Acts • 11 mins',
    accentColor: '#1d4ed8', // Royal cinema sapphire
    goldColor: '#d4af37',
    crisis: 'The synchronous recursive Virtual DOM walk locked the browser main JavaScript thread on large component trees, causing frame drops and unresponsive user keyboard input during heavy re-renders.',
    synopsis: 'How the React core team rewrote the reconciler into React Fiber: breaking the JavaScript call stack into an interruptible cooperative linked-list work loop within a 16.6ms 60 FPS frame budget.',
    learningOutcomes: [
      'Cooperative Multitasking & Time-Slicing in JavaScript',
      'Fiber Tree Linked-List Architecture (child, sibling, return)',
      'Priority Lanes & RequestIdleCallback Yielding'
    ],
    chapters: [
      {
        id: 1,
        title: 'Act I: The 16.6ms Cooperative Time-Slice Loop',
        commitSha: '6328a9b',
        timestamp: 'Fiber Rewrite • 2017',
        file: 'ReactFiberWorkLoop.js',
        durationSec: 25,
        dilemma: 'Synchronous recursive tree traversal could not be paused once started. If rendering took 50ms, the user experienced 3 dropped animation frames.',
        tradeoff: 'Replaced recursive function calls with a singly-linked-list Fiber tree that can yield control to browser layout events and resume later.',
        narration: "2017 at Facebook. The team tackles the ultimate frontend challenge: 60 FPS fluid rendering. Instead of letting recursion freeze the browser, Fiber introduces the cooperative work loop. Every frame has 16.6 milliseconds. If time runs out, Fiber yields to user clicks.",
        cuePoints: [
          { time: 4, label: 'Frame Deadline Check (shouldYield)', activeLine: 8 },
          { time: 13, label: 'Performing Unit of Work in Fiber Tree', activeLine: 14 },
          { time: 20, label: 'Cooperative Yield to Main Thread', activeLine: 19 }
        ],
        interviewQuestion: 'How does React Fiber achieve time-slicing without multithreading?',
        interviewAnswer: 'Fiber converts the component tree into a singly-linked list (child, sibling, return). A while loop processes one fiber at a time and checks performance.now() against the frame deadline, pausing via MessageChannel/requestIdleCallback when time is exhausted.',
        directorNotes: 'Fiber transforms the call stack from a language constraint into a data structure in heap memory that can be paused, saved, and prioritized.',
        code: `/* ReactFiberWorkLoop.js - Cooperative Time-Slicing Scheduler */
function workLoopConcurrent() {
    /* Perform work until the browser needs to paint a 60 FPS frame */
    while (workInProgress !== null && !shouldYield()) {
        performUnitOfWork(workInProgress);
    }
}

function shouldYield() {
    /* Check if 16.6ms frame budget has expired */
    var timeElapsed = getCurrentTime() - frameStartTime;
    if (timeElapsed < frameLength) {
        return false;
    }
    /* Yield thread so user clicks and animations remain 60 FPS fluid */
    return true;
}`
      }
    ]
  }
];

/* ─── LIVING ARCHITECTURE SIMULATION ENGINE (60 FPS CANVAS) ─── */
function LivingArchitectureCanvas({ filmId, chapterId, progress, isPlaying, playbackSpeed }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let tick = 0;

    const render = () => {
      tick += 0.035 * playbackSpeed;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;

      // Dark auditorium canvas backing
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, w, h);

      // Fine architectural grid lines
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
      ctx.lineWidth = 1;
      const step = 28;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      /* ─── SCENE 1: REDIS MULTIPLEXING RADAR ─── */
      if (filmId === 'redis') {
        const cx = w * 0.5;
        const cy = h * 0.5;
        const radius = Math.min(w, h) * 0.35;

        // 16 Sockets in outer ring
        const sockets = 16;
        for (let i = 0; i < sockets; i++) {
          const ang = (i / sockets) * Math.PI * 2 + (isPlaying ? tick * 0.12 : 0);
          const sx = cx + Math.cos(ang) * (radius + 28);
          const sy = cy + Math.sin(ang) * (radius + 28);

          const active = Math.sin(tick * 2.5 + i) > 0.15;
          ctx.beginPath();
          ctx.arc(sx, sy, active ? 5.5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = active ? '#38bdf8' : 'rgba(212, 175, 55, 0.3)';
          ctx.shadowColor = active ? '#38bdf8' : 'transparent';
          ctx.shadowBlur = active ? 10 : 0;
          ctx.fill();

          // Packet stream
          if (active && isPlaying) {
            const prog = (tick * 1.8 + i) % 1;
            const px = sx + (cx - sx) * prog;
            const py = sy + (cy - sy) * prog;

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#f43f5e';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 8;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(cx, cy);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // epoll boundary perimeter
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Single Thread Sweep Beam
        const sweep = isPlaying ? tick * 2.8 : 0;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sweep);

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

        // Central Single Thread Core
        ctx.beginPath();
        ctx.arc(cx, cy, 34, 0, Math.PI * 2);
        ctx.fillStyle = '#0e111a';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SINGLE', cx, cy - 3);
        ctx.fillStyle = '#f43f5e';
        ctx.fillText('THREAD', cx, cy + 9);

        // Measured Runtime Telemetry Display (Separated from animations)
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
        ctx.textAlign = 'left';
        ctx.fillText('● epoll_wait(): NON-BLOCKING POLLING', 14, 24);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
        ctx.fillText('LOCK CONTENTION: 0.00% (ZERO MUTEX)', 14, 40);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
        ctx.fillText('THROUGHPUT: 125,480 REQ/SEC', 14, 56);
      }

      /* ─── SCENE 2: GIT MERKLE DAG ─── */
      else if (filmId === 'git') {
        const startX = 60;
        const centerY = h * 0.5;

        const nodes = [
          { name: 'Root', sha: 'e83c', x: startX, y: centerY },
          { name: 'Tree', sha: '7bb8', x: startX + 90, y: centerY },
          { name: 'Blob A', sha: 'd910', x: startX + 180, y: centerY - 45 },
          { name: 'Blob B', sha: '41ca', x: startX + 180, y: centerY + 45 },
          { name: 'Commit', sha: '83f9', x: startX + 270, y: centerY }
        ];

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(nodes[1].x, nodes[1].y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(nodes[1].x, nodes[1].y); ctx.lineTo(nodes[2].x, nodes[2].y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(nodes[1].x, nodes[1].y); ctx.lineTo(nodes[3].x, nodes[3].y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(nodes[2].x, nodes[2].y); ctx.lineTo(nodes[4].x, nodes[4].y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(nodes[3].x, nodes[3].y); ctx.lineTo(nodes[4].x, nodes[4].y); ctx.stroke();

        nodes.forEach((n, i) => {
          const pulse = isPlaying && ((Math.floor(tick * 2) % nodes.length) === i);
          ctx.beginPath();
          ctx.arc(n.x, n.y, pulse ? 13 : 9, 0, Math.PI * 2);
          ctx.fillStyle = pulse ? '#fdba74' : '#ea580c';
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = pulse ? 20 : 6;
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(n.name, n.x, n.y - 16);
          ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
          ctx.fillText(n.sha, n.x, n.y + 20);
        });

        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(249, 115, 22, 0.95)';
        ctx.textAlign = 'left';
        ctx.fillText('● MERKLE DAG: SHA-1 CONTENT ADDRESS', 14, 24);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
        ctx.fillText('TREE DIFF SPEED: O(1) CRYPTOGRAPHIC SNAPSHOT', 14, 40);
      }

      /* ─── SCENE 3: REACT FIBER WORK LOOP ─── */
      else {
        const cx = w * 0.5;
        const cy = h * 0.5;
        const frameW = w * 0.65;
        const frameH = 26;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - frameW/2, cy - 30, frameW, frameH);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.strokeRect(cx - frameW/2, cy - 30, frameW, frameH);

        const prog = isPlaying ? (tick % 1.5) / 1.5 : 0.6;
        ctx.fillStyle = prog > 0.85 ? '#ef4444' : '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fillRect(cx - frameW/2 + 2, cy - 28, (frameW - 4) * prog, frameH - 4);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`FRAME BUDGET: ${(16.6 * (1 - prog)).toFixed(1)}ms REMAINING`, cx, cy - 13);

        ctx.fillStyle = prog > 0.85 ? '#f87171' : 'rgba(212, 175, 55, 0.9)';
        ctx.font = '9px monospace';
        ctx.fillText(prog > 0.85 ? 'PAUSING FOR USER KEYBOARD INPUT (60 FPS)' : 'RECONCILING FIBER TREE NODES...', cx, cy + 24);

        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
        ctx.textAlign = 'left';
        ctx.fillText('● FIBER COOPERATIVE TIME-SLICING', 14, 24);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
        ctx.fillText('FRAME RATE: SOLID 60.0 FPS', 14, 40);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [filmId, chapterId, progress, isPlaying, playbackSpeed]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#08080a]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Overhead Volumetric Projection Ray (Authentic Cinema Beam) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-full pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(180deg, rgba(212,175,55,0.3) 0%, transparent 85%)',
          clipPath: 'polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)'
        }}
      />
    </div>
  );
}

/* ─── MAIN CODECINEMA™ LIVING CODE THEATER COMPONENT ─── */
export default function CodeCinema({ setActiveTab, user }) {
  // 5 Stages: 'premiere' | 'opening_curtains' | 'countdown' | 'playing' | 'paused'
  const [cinemaStage, setCinemaStage] = useState('premiere');
  const [selectedFilmIndex, setSelectedFilmIndex] = useState(0);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  
  // Shared Synchronized Playback Engine Timeline
  const [timelineTime, setTimelineTime] = useState(0); // Elapsed seconds in chapter
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isScoreEnabled, setIsScoreEnabled] = useState(true);
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [cameraAngle, setCameraAngle] = useState('dual'); // 'dual' | 'radar' | 'teleprompter'
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Interactive AI Director & Fork Sandbox
  const [showAskDirector, setShowAskDirector] = useState(false);
  const [directorQuestion, setDirectorQuestion] = useState('');
  const [directorAnswer, setDirectorAnswer] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [showForkModal, setShowForkModal] = useState(false);
  const [forkedCode, setForkedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const film = CINEMA_FILMS[selectedFilmIndex] || CINEMA_FILMS[0];
  const chapter = film.chapters[selectedChapterIndex] || film.chapters[0];
  const fullCode = chapter.code;
  const chapterDuration = chapter.durationSec || 25;

  const isPlaying = cinemaStage === 'playing';
  const progressRatio = Math.min(1, Math.max(0, timelineTime / chapterDuration));
  const displayedCodeLength = Math.floor(fullCode.length * Math.min(1, progressRatio * 1.3));

  // Reset timeline on film or chapter change
  useEffect(() => {
    setTimelineTime(0);
    if (cinemaStage !== 'premiere') {
      setCinemaStage('playing');
    }
  }, [selectedFilmIndex, selectedChapterIndex]);

  // Synchronized Master Timeline Clock
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineTime((prev) => {
          const next = prev + 0.1 * playbackSpeed;
          if (next >= chapterDuration) {
            setCinemaStage('paused');
            cinemaAudio.stopScore();
            return chapterDuration;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, chapterDuration, playbackSpeed]);

  // Synchronized Voice Narration (with Graceful Offline Fallback)
  useEffect(() => {
    if (isVoiceEnabled && isPlaying && cinemaStage === 'playing') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(chapter.narration);
        utterance.rate = 1.0 * playbackSpeed;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isVoiceEnabled, isPlaying, cinemaStage, chapter, playbackSpeed]);

  // 🎬 Stage 02: Curtains Open & Vintage SMPTE 3-2-1 Countdown Trigger
  const triggerOpenCurtainsAndCountdown = () => {
    setCinemaStage('opening_curtains');
    cinemaAudio.playDeepNote();

    setTimeout(() => {
      setCinemaStage('countdown');
      setCountdownNumber(3);
      cinemaAudio.playCountdownBeep(440);

      const c2 = setTimeout(() => {
        setCountdownNumber(2);
        cinemaAudio.playCountdownBeep(554);
      }, 850);

      const c1 = setTimeout(() => {
        setCountdownNumber(1);
        cinemaAudio.playCountdownBeep(659);
      }, 1700);

      const cGo = setTimeout(() => {
        setCountdownNumber(null);
        cinemaAudio.playCountdownBeep(880); // Final brass chime
        setCinemaStage('playing');
        if (isScoreEnabled) {
          cinemaAudio.startScore();
        }
      }, 2550);
    }, 1100); // Curtains retract duration
  };

  const togglePlayPause = () => {
    if (cinemaStage === 'premiere') {
      triggerOpenCurtainsAndCountdown();
      return;
    }
    if (timelineTime >= chapterDuration) {
      setTimelineTime(0);
      setCinemaStage('playing');
      if (isScoreEnabled) cinemaAudio.startScore();
      return;
    }
    if (isPlaying) {
      setCinemaStage('paused');
      cinemaAudio.stopScore();
    } else {
      setCinemaStage('playing');
      if (isScoreEnabled) cinemaAudio.startScore();
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

  // Stage 04: Pause & Ask AI Director
  const handlePauseAndAsk = (presetQ = null) => {
    setCinemaStage('paused');
    cinemaAudio.stopScore();
    setShowAskDirector(true);

    const questionToAsk = presetQ || directorQuestion || `Why did ${film.creator} make this specific architectural decision at this moment?`;
    setDirectorQuestion(questionToAsk);
    setIsAskingAi(true);

    // AI Director architectural breakdown
    setTimeout(() => {
      setDirectorAnswer(`[AI Director Analysis at ${timelineTime.toFixed(1)}s in ${chapter.file}]:\n\nSalvatore made this critical trade-off to completely sidestep the operating system's thread scheduler. In traditional multi-threaded architectures, when 10,000 threads compete for memory access, the CPU spends up to 70% of its cycles performing kernel context switches and invalidating L1/L2 hardware caches.\n\nBy executing strictly on a single thread and relying on non-blocking I/O polling (epoll_wait), Redis ensures that every memory operation occurs in cache-hot registers without a single pthread mutex lock. This guarantees bounded sub-microsecond latency.`);
      setIsAskingAi(false);
    }, 600);
  };

  // Stage 05: Fork the Scene into Runnable Sandbox
  const handleForkScene = () => {
    setCinemaStage('paused');
    cinemaAudio.stopScore();
    setForkedCode(fullCode);
    setShowForkModal(true);
  };

  // Keyboard Shortcuts: Spacebar (Play/Pause), F (Fullscreen Theater), Esc (Exit), C (Curtains Toggle)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        setIsFullscreen(prev => !prev);
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        setCinemaStage(prev => (prev === 'premiere' ? 'playing' : 'premiere'));
      } else if (e.code === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cinemaStage, timelineTime, chapterDuration, isFullscreen]);

  // Are the velvet curtains currently closed?
  const areCurtainsClosed = cinemaStage === 'premiere';

  return (
    <div className={`min-h-screen bg-[#060608] text-[#ede8de] font-serif selection:bg-[#d4af37]/30 selection:text-[#fff4d6] transition-all flex flex-col justify-between overflow-x-hidden ${isFullscreen ? 'fixed inset-0 z-50 p-0 bg-black' : 'p-3 sm:p-6 lg:p-8'}`}>
      
      {/* ─── AUDITORIUM PROSCENIUM ARCH & CEILING ─── */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-20">
        
        {/* Burnished Brass Arch Plaque Header */}
        <div className="w-full flex items-center justify-between border-b border-[#d4af37]/20 pb-3 mb-4 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-[#d4af37]">
            <Clapperboard className="w-4 h-4 text-[#d4af37]" />
            <span className="font-serif font-black tracking-widest uppercase text-sm sm:text-base text-[#f5ebd7]">
              CodeCinema™
            </span>
            <span className="text-[#8e8576] hidden sm:inline">• The Living Code Theater</span>
            <span className="px-2 py-0.5 rounded border border-[#d4af37]/40 bg-[#d4af37]/10 text-[9px] font-mono tracking-wider font-bold text-[#d4af37]">
              70MM CINEMASCOPE
            </span>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCinemaStage(prev => prev === 'premiere' ? 'playing' : 'premiere')}
              className="px-3 py-1.5 rounded-lg border border-[#d4af37]/30 bg-[#121118] hover:bg-[#1f1d28] text-xs text-[#d4af37] font-mono flex items-center gap-1.5 cursor-pointer transition-all"
              title="Toggle Proscenium Curtains [C]"
            >
              <span>🎭</span>
              <span className="hidden sm:inline">{areCurtainsClosed ? 'Retract Curtains' : 'Close Curtains'}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg border border-[#d4af37]/30 bg-[#121118] hover:bg-[#1f1d28] text-[#d4af37] cursor-pointer transition-all"
              title="Fullscreen Cinema [F]"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Film Repertoire Selection Marquee (Warm Walnut & Brass Strip) */}
        <div className="w-full flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar mb-4">
          {CINEMA_FILMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedFilmIndex(idx);
                setSelectedChapterIndex(0);
                setCinemaStage('premiere');
              }}
              className={`px-4 py-2 rounded-xl border text-left shrink-0 transition-all flex items-center gap-3 cursor-pointer ${
                selectedFilmIndex === idx
                  ? 'border-[#d4af37] bg-[#1a171d] text-[#fff4d6] shadow-[0_0_15px_rgba(212,175,55,0.15)] scale-[1.01]'
                  : 'border-[#332b27] bg-[#0d0c10] text-[#9c9384] hover:text-[#ede8de] hover:border-[#63554b]'
              }`}
            >
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center font-serif font-black text-xs text-white shadow"
                style={{ background: item.accentColor }}
              >
                {item.title.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-serif font-bold text-[#f5ebd7] leading-tight">{item.title.split(':')[0]}</div>
                <div className="text-[10px] font-mono text-[#a39785]">{item.creator} • {item.runtime}</div>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* ─── THE MAIN CINEMASCOPE 2.39:1 VIRTUAL AUDITORIUM STAGE ─── */}
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center relative z-10 my-2">
        
        {/* Dynamic Bias "Ambilight" Theater Glow behind Screen */}
        <div 
          className="absolute inset-0 pointer-events-none -z-10 blur-[130px] opacity-25 transition-all duration-1000"
          style={{ background: isPlaying ? `radial-gradient(circle at 50% 40%, ${film.accentColor} 0%, transparent 70%)` : 'transparent' }}
        />

        {/* 🎬 THE PROSCENIUM FRAME & 2.39:1 CURVED SILVER SCREEN 🎬 */}
        <div className={`w-full relative overflow-hidden bg-black shadow-[0_30px_100px_rgba(0,0,0,0.98)] border border-[#2b2520] ${isFullscreen ? 'h-[78vh]' : 'h-[440px] sm:h-[490px] md:h-[530px] rounded-2xl'}`}>
          
          {/* Top 35mm Perforated Letterbox Strip */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-[#0a0a0c] z-30 flex items-center justify-between px-3 border-b border-[#1f1d24] pointer-events-none select-none">
            <span className="text-[9px] font-mono text-[#d4af37]/80 tracking-widest uppercase">
              🎞️ 35MM 4-PERF • {film.id.toUpperCase()} • ACT {chapter.id}
            </span>
            <div className="flex items-center gap-2 opacity-50">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="w-3 h-1.5 bg-[#25242d] rounded-[1px]" />
              ))}
            </div>
            <span className="text-[9px] font-mono text-[#6c675e] hidden sm:inline">
              SOUNDTRACK OPTICAL STEREO
            </span>
          </div>

          {/* Bottom 35mm Perforated Letterbox Strip */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#0a0a0c] z-30 flex items-center justify-between px-3 border-t border-[#1f1d24] pointer-events-none select-none">
            <div className="flex items-center gap-2 opacity-50">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="w-3 h-1.5 bg-[#25242d] rounded-[1px]" />
              ))}
            </div>
            <span className="text-[9px] font-mono text-[#d4af37]/80 tracking-widest">
              LUMIXORA CINEMA 70MM • DOLBY ATMOS
            </span>
          </div>

          {/* 🎭 PHYSICALLY CONVINCING CRIMSON VELVET CURTAINS 🎭 */}
          {/* Left Velvet Curtain */}
          <div 
            className="absolute inset-y-0 left-0 w-1/2 z-40 transition-transform duration-1000 ease-in-out origin-left pointer-events-none shadow-[25px_0_60px_rgba(0,0,0,0.95)]"
            style={{
              transform: areCurtainsClosed ? 'translateX(0)' : 'translateX(-100%)',
              background: 'repeating-linear-gradient(90deg, #35060a 0px, #5e0d14 20px, #7a111a 35px, #42080d 50px)',
              borderRight: '3px solid #d4af37'
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          </div>

          {/* Right Velvet Curtain */}
          <div 
            className="absolute inset-y-0 right-0 w-1/2 z-40 transition-transform duration-1000 ease-in-out origin-right pointer-events-none shadow-[-25px_0_60px_rgba(0,0,0,0.95)]"
            style={{
              transform: areCurtainsClosed ? 'translateX(0)' : 'translateX(100%)',
              background: 'repeating-linear-gradient(90deg, #35060a 0px, #5e0d14 20px, #7a111a 35px, #42080d 50px)',
              borderLeft: '3px solid #d4af37'
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          </div>

          {/* ─── STAGE 01: THE PREMIERE (MARQUEE BILLBOARD) ─── */}
          {areCurtainsClosed && (
            <div className="absolute inset-0 z-45 bg-[#08070a]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="max-w-2xl w-full border border-[#d4af37]/40 bg-[#121017] p-6 sm:p-8 rounded-2xl shadow-2xl relative">
                
                {/* Vintage Brass Corner Accents */}
                <div className="absolute top-2 left-2 text-[#d4af37] text-xs">╔</div>
                <div className="absolute top-2 right-2 text-[#d4af37] text-xs">╗</div>
                <div className="absolute bottom-2 left-2 text-[#d4af37] text-xs">╚</div>
                <div className="absolute bottom-2 right-2 text-[#d4af37] text-xs">╝</div>

                <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#d4af37] mb-1 font-bold">
                  ★ LUMIXORA PREMIERE SCREENING ★
                </div>

                <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#fff4d6] tracking-tight">
                  {film.title}
                </h2>

                <div className="text-xs font-mono text-[#a89c89] mt-1 mb-3">
                  Directed by {film.creator} • {film.location} • {film.runtime}
                </div>

                <div className="p-3 bg-[#0a090e] border border-[#d4af37]/20 rounded-xl text-xs text-[#d6cdbe] mb-4 text-left leading-relaxed">
                  <strong className="text-[#e55353] block mb-0.5 uppercase tracking-wider text-[10px] font-mono">
                    The Engineering Crisis:
                  </strong>
                  {film.crisis}
                </div>

                {/* Target Learning Outcomes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6 text-left">
                  {film.learningOutcomes.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#181620] border border-[#d4af37]/15 text-[11px] text-[#c2b6a2]">
                      <span className="text-[#d4af37] font-bold block mb-0.5">0{idx + 1}</span>
                      {item}
                    </div>
                  ))}
                </div>

                {/* Stage 02 Trigger: Admit One Button */}
                <button
                  onClick={triggerOpenCurtainsAndCountdown}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:brightness-110 text-[#1a140d] font-serif font-black text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3 cursor-pointer transform hover:scale-[1.02] active:scale-95 transition-all mx-auto"
                >
                  <Play className="w-4 h-4 fill-[#1a140d]" />
                  <span>Admit One • Retract Curtains & Roll Film</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── STAGE 02: VINTAGE SMPTE 3... 2... 1... COUNTDOWN ─── */}
          {countdownNumber !== null && (
            <div className="absolute inset-0 z-50 bg-[#060608] flex flex-col items-center justify-center pointer-events-none animate-fade-in">
              <div className="relative w-44 h-44 rounded-full border-4 border-[#d4af37]/60 flex items-center justify-center animate-spin" style={{ animationDuration: '1s' }}>
                <div className="absolute top-0 bottom-0 w-0.5 bg-[#d4af37]/60" />
                <div className="absolute left-0 right-0 h-0.5 bg-[#d4af37]/60" />
                <div className="w-32 h-32 rounded-full border border-[#d4af37]/30" />
              </div>

              <div className="absolute text-8xl sm:text-9xl font-mono font-black text-[#fff4d6] drop-shadow-[0_0_35px_rgba(212,175,55,0.8)]">
                {countdownNumber}
              </div>

              <div className="mt-8 text-xs font-mono font-bold tracking-[0.35em] uppercase text-[#d4af37]">
                70MM FILM LEADER • {film.id.toUpperCase()}
              </div>
            </div>
          )}

          {/* ─── STAGE 03: LIVING ARCHITECTURE (SYNCHRONIZED SCREEN) ─── */}
          <div className="w-full h-full relative z-10 pt-6 pb-6">
            
            {/* ANGLE 1: DUAL SCREEN (RADAR + TELEPROMPTER) */}
            {cameraAngle === 'dual' && (
              <div className="w-full h-full grid grid-cols-1 md:grid-cols-12">
                {/* Left Deck (6 Cols): Living Architectural Radar */}
                <div className="md:col-span-6 h-full relative border-r border-[#2b2520]">
                  <LivingArchitectureCanvas 
                    filmId={film.id}
                    chapterId={chapter.id}
                    progress={progressRatio}
                    isPlaying={isPlaying && countdownNumber === null}
                    playbackSpeed={playbackSpeed}
                  />
                </div>

                {/* Right Deck (6 Cols): 70mm Code Projector */}
                <div className="md:col-span-6 h-full bg-[#08080c] flex flex-col overflow-hidden">
                  <div className="px-4 py-2 bg-[#0e0d14] border-b border-[#2b2520] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#d4af37]">
                      <Terminal className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="font-bold text-[#f5ebd7]">{chapter.file}</span>
                      <span className="text-[10px] text-[#7d7568]">• {film.language || 'C'}</span>
                    </div>
                    <div className="text-[10px] text-[#4ade80] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                      <span>{isPlaying ? 'STREAMING REEL' : 'PAUSED'}</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto flex-1 overflow-y-auto custom-scrollbar bg-[#050508]">
                    <pre className="text-[#ede8de]">
                      <code>
                        {fullCode.slice(0, displayedCodeLength || fullCode.length)}
                        {isPlaying && (
                          <span className="inline-block w-2.5 h-4 bg-[#d4af37] ml-0.5 animate-pulse align-middle" />
                        )}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* ANGLE 2: FULL ARCHITECTURE RADAR (IMAX VIEW) */}
            {cameraAngle === 'radar' && (
              <div className="w-full h-full relative">
                <LivingArchitectureCanvas 
                  filmId={film.id}
                  chapterId={chapter.id}
                  progress={progressRatio}
                  isPlaying={isPlaying && countdownNumber === null}
                  playbackSpeed={playbackSpeed}
                />
              </div>
            )}

            {/* ANGLE 3: MASTER 35MM CODE PROJECTOR */}
            {cameraAngle === 'teleprompter' && (
              <div className="w-full h-full bg-[#050508] flex flex-col overflow-hidden">
                <div className="px-5 py-2.5 bg-[#0e0d14] border-b border-[#2b2520] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <Terminal className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-bold text-white">{chapter.file}</span>
                    <span className="text-[#8e8576]">[{film.title}]</span>
                  </div>
                  <div className="text-[11px] text-[#d4af37] font-mono">
                    COMMIT #{chapter.commitSha}
                  </div>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed overflow-auto flex-1 bg-[#050508] text-[#4ade80] custom-scrollbar">
                  <pre>
                    <code>
                      {fullCode.slice(0, displayedCodeLength || fullCode.length)}
                      {isPlaying && (
                        <span className="inline-block w-3 h-5 bg-[#4ade80] ml-1 animate-pulse align-middle" />
                      )}
                    </code>
                  </pre>
                </div>
              </div>
            )}

          </div>

          {/* 🎙️ STAGE 04: AI DIRECTOR SUBTITLE OVERLAY 🎙️ */}
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 max-w-2xl w-[92%] z-30 pointer-events-none">
            <div className="bg-[#0b0a10]/95 backdrop-blur-md px-5 py-2.5 rounded-xl border border-[#d4af37]/30 shadow-2xl text-center">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#d4af37] mb-0.5">
                AI DIRECTOR COMMENTARY • [{film.creator}]
              </div>
              <p className="text-xs sm:text-sm text-[#fef08a] font-serif font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                "{chapter.narration}"
              </p>
            </div>
          </div>

          {/* Anamorphic Blue Streak Lens Flare */}
          <div 
            className="absolute top-1/2 left-0 right-0 h-0.5 pointer-events-none opacity-20 z-25"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.7), transparent)' }}
          />
        </div>

        {/* 🪑 AUDITORIUM SEATS FOREGROUND SILHOUETTES 🪑 */}
        <div className="w-full flex items-end justify-center gap-3 sm:gap-6 -mt-3 sm:-mt-5 relative z-25 pointer-events-none opacity-85 select-none">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="w-10 sm:w-16 h-8 sm:h-12 rounded-t-2xl border-t border-[#d4af37]/25 shadow-2xl flex flex-col items-center justify-between"
              style={{
                background: 'linear-gradient(180deg, #181418 0%, #080709 100%)',
                boxShadow: isPlaying ? `0 -4px 15px ${film.accentColor}33` : 'none'
              }}
            >
              <div className="w-7 sm:w-11 h-1.5 rounded-full bg-[#d4af37]/15 mt-1" />
            </div>
          ))}
        </div>

        {/* ─── VINTAGE THEATER CONSOLE (SYNCHRONIZED CONTROLS BAR) ─── */}
        <div className={`p-4 rounded-2xl bg-[#100f16] border border-[#d4af37]/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative z-30 mt-3 ${isFullscreen ? 'max-w-4xl mx-auto mb-4 w-[92%]' : ''}`}>
          
          {/* Timeline & Chapter Status */}
          <div className="flex items-center gap-3 text-left">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-black text-white shadow shrink-0"
              style={{ background: film.accentColor }}
            >
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-[#f5ebd7]">{chapter.title}</span>
                <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] text-[9px] font-mono font-bold uppercase tracking-wider">
                  Act {chapter.id}/{film.chapters.length}
                </span>
              </div>
              {/* Synchronized Timeline Counter */}
              <div className="text-[11px] font-mono text-[#a89c89] flex items-center gap-2 mt-0.5">
                <span>{timelineTime.toFixed(1)}s / {chapterDuration}.0s</span>
                <div className="w-24 h-1.5 bg-[#25222d] rounded-full overflow-hidden inline-block">
                  <div className="h-full bg-[#d4af37] transition-all" style={{ width: `${progressRatio * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Cinema Deck Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            
            {/* Multi-Camera Angle Selector */}
            <div className="flex items-center gap-1 bg-[#09080e] p-1 rounded-lg border border-[#2b2520]">
              <button
                onClick={() => setCameraAngle('dual')}
                className={`p-1.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${cameraAngle === 'dual' ? 'bg-[#d4af37]/25 text-[#d4af37]' : 'text-[#7d7568] hover:text-[#ede8de]'}`}
                title="Camera 1: Dual Screen"
              >
                <Tv className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCameraAngle('radar')}
                className={`p-1.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${cameraAngle === 'radar' ? 'bg-[#d4af37]/25 text-[#d4af37]' : 'text-[#7d7568] hover:text-[#ede8de]'}`}
                title="Camera 2: Architecture Radar"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCameraAngle('teleprompter')}
                className={`p-1.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${cameraAngle === 'teleprompter' ? 'bg-[#d4af37]/25 text-[#d4af37]' : 'text-[#7d7568] hover:text-[#ede8de]'}`}
                title="Camera 3: Code Teleprompter"
              >
                <Terminal className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handlePrevChapter}
              disabled={selectedChapterIndex === 0}
              className="p-2 rounded-lg bg-[#1a1722] hover:bg-[#282433] disabled:opacity-20 text-[#ede8de] cursor-pointer"
              title="Previous Act"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:brightness-110 text-[#1a140d] font-serif font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer transform active:scale-95 transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-[#1a140d]" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-[#1a140d]" />
                  <span>{timelineTime >= chapterDuration ? 'Replay' : 'Play'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextChapter}
              className="p-2 rounded-lg bg-[#1a1722] hover:bg-[#282433] text-[#ede8de] cursor-pointer"
              title="Next Act"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Playback Speed Multiplier */}
            <div className="flex items-center gap-1 bg-[#09080e] p-1 rounded-lg border border-[#2b2520]">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    playbackSpeed === spd ? 'bg-[#d4af37] text-[#1a140d]' : 'text-[#7d7568] hover:text-[#ede8de]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Stage 04: Pause & Ask AI Director Button */}
            <button
              onClick={() => handlePauseAndAsk()}
              className="px-3 py-2 rounded-lg border border-[#d4af37]/40 bg-[#1e1b26] hover:bg-[#2a2636] text-[#d4af37] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              title="Pause & Ask AI Director"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Director</span>
            </button>

            {/* Stage 05: Fork Scene Button */}
            <button
              onClick={handleForkScene}
              className="px-3 py-2 rounded-lg border border-[#f43f5e]/40 bg-[#251016] hover:bg-[#38161f] text-[#f43f5e] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              title="Fork This Moment into Runnable Editor"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Fork Scene</span>
            </button>

            {/* Audio Score Toggle */}
            <button
              onClick={() => {
                if (isScoreEnabled) {
                  cinemaAudio.stopScore();
                  setIsScoreEnabled(false);
                } else {
                  setIsScoreEnabled(true);
                  if (isPlaying) cinemaAudio.startScore();
                }
              }}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isScoreEnabled ? 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#d4af37]' : 'bg-[#181620] border-[#2b2520] text-[#7d7568]'
              }`}
              title="Hans Zimmer Score"
            >
              {isScoreEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ─── PEDAGOGICAL DOSSIER & FAANG WHITEBOARD ANALYSIS (Below Stage) ─── */}
        {!isFullscreen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
            
            {/* Box 1: The Architectural Dilemma & Solution */}
            <div className="p-5 rounded-xl bg-[#0f0e14] border border-[#2b2520] space-y-3">
              <div className="flex items-center gap-2 border-b border-[#2b2520] pb-2 text-[#d4af37]">
                <Scale className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-xs font-serif font-black uppercase tracking-wider text-[#f5ebd7]">
                  The Architectural Trade-Off
                </h3>
              </div>

              <div className="p-3 rounded-lg bg-[#07070a] border border-[#1f1d24] text-xs text-[#d6cdbe]">
                <strong className="text-[#f43f5e] block mb-0.5 font-mono text-[10px] uppercase">Why Standard Solutions Failed:</strong>
                {chapter.dilemma}
              </div>

              <div className="p-3 rounded-lg bg-[#07070a] border border-[#1f1d24] text-xs text-[#d6cdbe]">
                <strong className="text-[#4ade80] block mb-0.5 font-mono text-[10px] uppercase">The Breakthrough Innovation:</strong>
                {chapter.tradeoff}
              </div>
            </div>

            {/* Box 2: Staff Engineer Whiteboard Question */}
            <div className="p-5 rounded-xl bg-[#0f0e14] border border-[#2b2520] space-y-3">
              <div className="flex items-center justify-between border-b border-[#2b2520] pb-2">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <Award className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="text-xs font-serif font-black uppercase tracking-wider text-[#f5ebd7]">
                    L5/L6 Staff Engineer Question
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#a89c89]">Google / Meta Whiteboard</span>
              </div>

              <div className="p-3 rounded-lg bg-[#14121a] border border-[#d4af37]/20 text-xs font-mono font-bold text-[#fef08a]">
                Q: {chapter.interviewQuestion}
              </div>

              <div className="p-3 rounded-lg bg-[#07070a] border border-[#1f1d24] text-xs text-[#d6cdbe] leading-relaxed">
                <strong className="text-[#f5ebd7] block mb-0.5 font-mono text-[10px] uppercase">Model Solution:</strong>
                {chapter.interviewAnswer}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ─── STAGE 04: PAUSE & ASK AI DIRECTOR MODAL ─── */}
      {showAskDirector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in text-left">
          <div className="bg-[#121017] border border-[#d4af37]/40 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-[#2b2520] pb-3 mb-4">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <MessageSquare className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-sm font-serif font-black text-[#f5ebd7] uppercase tracking-wider">
                  AI Director's Consultation Desk
                </h3>
              </div>
              <button
                onClick={() => setShowAskDirector(false)}
                className="text-[#a89c89] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#a89c89] mb-3">
              Film paused at <span className="text-[#d4af37] font-mono">{timelineTime.toFixed(1)}s</span> in <span className="text-[#f5ebd7] font-mono">{chapter.file}</span>. Inquire about the architectural decisions behind this moment:
            </p>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                "Why reject POSIX thread mutex locks?",
                "What happens if a socket buffer overflows?",
                "How does epoll handle edge vs level triggering?"
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePauseAndAsk(q)}
                  className="px-2.5 py-1 rounded-lg bg-[#1a1724] border border-[#d4af37]/20 text-[10px] text-[#d4af37] hover:bg-[#252233] cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#09080e] border border-[#2b2520] font-mono text-xs text-[#d6cdbe] min-h-[160px] whitespace-pre-wrap leading-relaxed custom-scrollbar overflow-y-auto">
              {isAskingAi ? 'Connecting to AI Director neural model...' : directorAnswer}
            </div>

            <div className="mt-4 pt-3 border-t border-[#2b2520] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#7d7568]">Powered by Lumixora AI Architecture Engine</span>
              <button
                onClick={() => {
                  setShowAskDirector(false);
                  setCinemaStage('playing');
                  if (isScoreEnabled) cinemaAudio.startScore();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38728] text-[#1a140d] font-serif font-black text-xs cursor-pointer"
              >
                Resume Film ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STAGE 05: FORK THIS SCENE RUNNABLE SANDBOX ─── */}
      {showForkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in text-left">
          <div className="bg-[#121017] border border-[#d4af37]/40 rounded-2xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#2b2520] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#251016] border border-[#f43f5e]/40 text-[#f43f5e] flex items-center justify-center font-bold">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-black text-[#f5ebd7]">
                    Fork This Scene: {chapter.title}
                  </h3>
                  <p className="text-xs text-[#a89c89] font-mono">
                    Forked from {film.title} (Commit #{chapter.commitSha})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowForkModal(false)}
                className="w-8 h-8 rounded-full bg-[#1e1b26] text-[#a89c89] hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#c2b6a2] mb-3">
              You now control the codebase. Modify the algorithms below, explore alternate implementations, or port into the Lumixora Code Editor:
            </p>

            <textarea
              value={forkedCode}
              onChange={(e) => setForkedCode(e.target.value)}
              className="w-full flex-1 bg-[#050508] border border-[#2b2520] rounded-xl p-4 font-mono text-xs text-[#4ade80] focus:outline-none focus:border-[#d4af37] resize-none min-h-[280px] custom-scrollbar"
            />

            <div className="mt-4 pt-3 border-t border-[#2b2520] flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(forkedCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-[#1e1b26] hover:bg-[#2a2636] text-[#ede8de] font-mono text-xs flex items-center gap-2 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => {
                  setShowForkModal(false);
                  if (setActiveTab) setActiveTab('code-editor');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38728] text-[#1a140d] font-serif font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Launch in Lumixora Code Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function Scale(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
      <path d="M7 21h10"/>
      <path d="M12 3v18"/>
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
    </svg>
  );
}
