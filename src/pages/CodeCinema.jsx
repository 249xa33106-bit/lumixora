import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Sparkles, Code2, GitBranch, GitCommit, Terminal, Cpu, Award, Zap,
  Flame, BookOpen, ChevronRight, Copy, Check, ExternalLink, HelpCircle,
  Eye, ArrowRight, Layers, Sliders, CheckCircle2, Clock, Info, Clapperboard,
  Maximize2, Minimize2, Radio, Activity, Tv, Monitor, Video, ShieldAlert,
  Disc3, PlaySquare
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

      const chord = [35.0, 52.3, 70.0, 104.6, 139.9, 209.3]; // Low D chord
      const now = this.ctx.currentTime;
      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.01, now);
      master.gain.exponentialRampToValueAtTime(0.12, now + 1.8);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      master.connect(this.ctx.destination);

      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 0.7, now);
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
        clickGain.gain.setValueAtTime(0.015, now);
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
      g.gain.setValueAtTime(0.1, this.ctx.currentTime);
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
      this.gain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 1.5);
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
        tickGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
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

/* ─── THE LIVING ARCHITECTURE SIMULATION CANVAS ─── */
function LivingArchitectureCanvas({ filmId, chapterId, isPlaying, playbackSpeed }) {
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

      // Dark anamorphic background
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, w, h);

      // Subtle cinema grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
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
        const radius = Math.min(w, h) * 0.36;

        // 16 Sockets in outer ring
        const sockets = 16;
        for (let i = 0; i < sockets; i++) {
          const ang = (i / sockets) * Math.PI * 2 + (isPlaying ? tick * 0.12 : 0);
          const sx = cx + Math.cos(ang) * (radius + 28);
          const sy = cy + Math.sin(ang) * (radius + 28);

          const active = Math.sin(tick * 2.5 + i) > 0.15;
          ctx.beginPath();
          ctx.arc(sx, sy, active ? 5.5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = active ? '#38bdf8' : 'rgba(255,255,255,0.2)';
          ctx.shadowColor = active ? '#38bdf8' : 'transparent';
          ctx.shadowBlur = active ? 10 : 0;
          ctx.fill();

          // Data packet laser
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

        // Epoll boundary circle
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Single Thread Sweep Beam
        const sweep = isPlaying ? tick * 2.8 : 0;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sweep);

        const sweepGrad = ctx.createLinearGradient(0, 0, radius, 0);
        sweepGrad.addColorStop(0, 'rgba(244, 63, 94, 0.95)');
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
        ctx.fillStyle = '#0b1329';
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

        // Live Telemetry Readout
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
        ctx.textAlign = 'left';
        ctx.fillText('● epoll_wait(): NON-BLOCKING', 14, 24);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fillText('LOCK CONTENTION: 0.00%', 14, 40);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
        ctx.fillText('REQ/SEC: 124,580', 14, 56);
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

        // Laser filaments
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
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
          ctx.fillStyle = pulse ? '#fdba74' : '#f97316';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = pulse ? 22 : 8;
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(n.name, n.x, n.y - 16);
          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.fillText(n.sha, n.x, n.y + 20);
        });

        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(249, 115, 22, 0.9)';
        ctx.textAlign = 'left';
        ctx.fillText('● MERKLE DAG: SHA-1 CONTENT ADDRESS', 14, 24);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
        ctx.fillText('TREE DIFF SPEED: O(1) CRYPTO MATCH', 14, 40);
      }

      /* ─── SCENE 3: REACT FIBER WORK LOOP ─── */
      else {
        const cx = w * 0.5;
        const cy = h * 0.5;
        const frameW = w * 0.65;
        const frameH = 26;

        ctx.fillStyle = '#0b1329';
        ctx.fillRect(cx - frameW/2, cy - 30, frameW, frameH);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.strokeRect(cx - frameW/2, cy - 30, frameW, frameH);

        const prog = isPlaying ? (tick % 1.5) / 1.5 : 0.6;
        ctx.fillStyle = prog > 0.85 ? '#ef4444' : '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.fillRect(cx - frameW/2 + 2, cy - 28, (frameW - 4) * prog, frameH - 4);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`FRAME BUDGET: ${(16.6 * (1 - prog)).toFixed(1)}ms REMAINING`, cx, cy - 13);

        ctx.fillStyle = prog > 0.85 ? '#f87171' : '#38bdf8';
        ctx.font = '9px monospace';
        ctx.fillText(prog > 0.85 ? 'PAUSING FOR USER KEYBOARD INPUT (60 FPS)' : 'RECONCILING FIBER TREE NODES...', cx, cy + 24);

        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.textAlign = 'left';
        ctx.fillText('● FIBER COOPERATIVE TIME-SLICING', 14, 24);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
        ctx.fillText('FRAME RATE: SOLID 60.0 FPS', 14, 40);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [filmId, chapterId, isPlaying, playbackSpeed]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#050811]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Cinematic Projector Light Beam Cone */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-full pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 85%)',
          clipPath: 'polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)'
        }}
      />
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
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isScoreEnabled, setIsScoreEnabled] = useState(true);
  const [displayedCodeLength, setDisplayedCodeLength] = useState(0);
  const [isImaxMode, setIsImaxMode] = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [cameraAngle, setCameraAngle] = useState('dual'); // 'dual' | 'radar' | 'teleprompter'
  const [showForkModal, setShowForkModal] = useState(false);
  const [forkedCode, setForkedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

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
    if (isPlaying && countdownNumber === null) {
      interval = setInterval(() => {
        setDisplayedCodeLength((prev) => {
          if (prev >= fullCode.length) {
            setIsPlaying(false);
            if (isScoreEnabled) cinemaAudio.stopScore();
            return fullCode.length;
          }
          return Math.min(fullCode.length, prev + Math.max(3, Math.floor(9 * playbackSpeed)));
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isPlaying, countdownNumber, fullCode, playbackSpeed, isScoreEnabled]);

  // Voice Narration
  useEffect(() => {
    if (isVoiceEnabled && isPlaying && countdownNumber === null) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(chapter.narration);
        utterance.rate = 1.0 * playbackSpeed;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isVoiceEnabled, isPlaying, countdownNumber, chapter, playbackSpeed]);

  // Hollywood 3... 2... 1... Film Countdown Trigger with Curtains & THX Deep Note
  const triggerCountdownAndPlay = () => {
    setCurtainsOpen(true);
    cinemaAudio.playDeepNote();
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
      cinemaAudio.playCountdownBeep(880); // Final high chime
      setIsPlaying(true);
      if (isScoreEnabled) {
        cinemaAudio.startScore();
      }
    }, 2550);

    return () => {
      clearTimeout(c2); clearTimeout(c1); clearTimeout(cGo);
    };
  };

  const togglePlay = () => {
    if (displayedCodeLength >= fullCode.length) {
      setDisplayedCodeLength(0);
    }
    if (!isPlaying) {
      triggerCountdownAndPlay();
    } else {
      setIsPlaying(false);
      cinemaAudio.stopScore();
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

  const handleForkMoment = () => {
    setForkedCode(fullCode);
    setShowForkModal(true);
  };

  // Keyboard Shortcuts: Spacebar (Play/Pause), F (IMAX Toggle), Esc (Exit IMAX), C (Curtains)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        setIsImaxMode(prev => !prev);
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        setCurtainsOpen(prev => !prev);
      } else if (e.code === 'Escape' && isImaxMode) {
        setIsImaxMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, displayedCodeLength, fullCode, isImaxMode]);

  return (
    <div className={`min-h-screen bg-[#03050c] text-white selection:bg-rose-500/30 selection:text-rose-200 transition-all ${isImaxMode ? 'p-0 overflow-hidden fixed inset-0 z-50 bg-black flex flex-col justify-between' : 'pb-24'}`}>
      
      {/* ─── STANDARD CINEMA FOYER HEADER (Hidden in Fullscreen IMAX) ─── */}
      {!isImaxMode && (
        <div className="relative border-b border-white/10 bg-gradient-to-b from-[#090e1c] via-[#050814] to-[#03050c] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 overflow-hidden">
          {/* Overhead projector light beam */}
          <div 
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-25"
            style={{ background: `radial-gradient(circle, ${film.accentColor} 0%, transparent 70%)` }}
          />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-black shadow-lg shadow-rose-500/20 mb-3.5">
                <Clapperboard className="w-4 h-4 animate-pulse text-rose-400" />
                <span>CodeCinema™ 4D • Official Hollywood Theater Mode</span>
                <span className="px-1.5 py-0.5 text-[9px] rounded-md bg-rose-500 text-white font-extrabold uppercase tracking-widest">IMAX 70MM</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Watch Code Write Itself.<br />
                <span className={`bg-gradient-to-r ${film.color} bg-clip-text text-transparent`}>
                  Like an Epic Hollywood Blockbuster.
                </span>
              </h1>

              <p className="text-gray-400 text-xs sm:text-sm font-medium max-w-2xl mt-2.5 leading-relaxed">
                Experience the 2.39:1 CinemaScope stage with authentic red velvet theater curtains, vintage 35mm optical countdown, Hans Zimmer dynamic synthesized orchestral score, and living silicon architecture radars.
              </p>
            </div>

            {/* Quick IMAX Mode & Curtain Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurtainsOpen(!curtainsOpen)}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                title="Toggle Velvet Curtains [C]"
              >
                <span>🎭</span>
                <span>{curtainsOpen ? 'Close Curtains' : 'Open Curtains'}</span>
              </button>

              <button
                onClick={() => setIsImaxMode(true)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:brightness-110 text-white text-xs font-black tracking-wide shadow-xl shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-95"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Enter IMAX Theater [F]</span>
              </button>
            </div>
          </div>

          {/* Masterpiece Film Reel Strip */}
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
      )}

      {/* ─── THE REAL IMAX THEATER AUDITORIUM ─── */}
      <div className={`relative w-full ${isImaxMode ? 'flex-1 flex flex-col justify-between overflow-hidden' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6'}`}>
        
        {/* Dynamic Bias "Ambilight" Ambient Glow behind the Screen onto Theater Walls */}
        <div 
          className="absolute inset-0 pointer-events-none -z-10 blur-[120px] opacity-35 transition-all duration-1000"
          style={{ background: isPlaying ? `radial-gradient(circle at 50% 35%, ${film.accentColor} 0%, transparent 65%)` : 'transparent' }}
        />

        {/* 🎬 THE MAIN 2.39:1 ANAMORPHIC CINEMASCOPE SCREEN & STAGE 🎬 */}
        <div className={`w-full relative overflow-hidden bg-black shadow-[0_30px_100px_rgba(0,0,0,0.95)] ${isImaxMode ? 'h-[78vh] my-auto border-none' : 'h-[460px] sm:h-[500px] md:h-[540px] rounded-3xl border border-white/15'}`}>
          
          {/* Top 35mm Celluloid Letterbox Bar with Perforations */}
          <div className="absolute top-0 left-0 right-0 h-7 bg-neutral-950 z-30 flex items-center justify-between px-3 border-b border-neutral-900 pointer-events-none overflow-hidden select-none">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-amber-500/80 tracking-widest uppercase">
                🎞️ KODAK 5219 VISION3 • 35MM 4-PERF • 24 FPS
              </span>
            </div>
            {/* Sprocket Holes */}
            <div className="flex items-center gap-2.5 opacity-60">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="w-3 h-2 bg-neutral-800 border border-neutral-700 rounded-[2px]" />
              ))}
            </div>
            <div className="text-[9px] font-mono text-gray-500 hidden sm:block">
              REEL #{film.id.toUpperCase()}-0{chapter.id}
            </div>
          </div>

          {/* Bottom 35mm Celluloid Letterbox Bar with Perforations */}
          <div className="absolute bottom-0 left-0 right-0 h-7 bg-neutral-950 z-30 flex items-center justify-between px-3 border-t border-neutral-900 pointer-events-none overflow-hidden select-none">
            <div className="flex items-center gap-2.5 opacity-60">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="w-3 h-2 bg-neutral-800 border border-neutral-700 rounded-[2px]" />
              ))}
            </div>
            <div className="text-[9px] font-mono font-bold text-gray-400 tracking-wider">
              DOLBY ATMOS • SOUNDTRACK OPTICAL STEREO
            </div>
          </div>

          {/* 🎭 LUXURY RED VELVET THEATER STAGE CURTAINS 🎭 */}
          <div 
            className="absolute inset-y-0 left-0 w-1/2 z-40 transition-transform duration-1000 ease-in-out origin-left pointer-events-none shadow-[25px_0_50px_rgba(0,0,0,0.9)]"
            style={{
              transform: curtainsOpen ? 'translateX(-100%)' : 'translateX(0)',
              background: 'repeating-linear-gradient(90deg, #450a0a 0px, #7f1d1d 22px, #991b1b 38px, #450a0a 55px)',
              borderRight: '4px solid #f59e0b'
            }}
          >
            {/* Gold tassel shadow & fabric sheen */}
            <div className="w-full h-full bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </div>

          <div 
            className="absolute inset-y-0 right-0 w-1/2 z-40 transition-transform duration-1000 ease-in-out origin-right pointer-events-none shadow-[-25px_0_50px_rgba(0,0,0,0.9)]"
            style={{
              transform: curtainsOpen ? 'translateX(100%)' : 'translateX(0)',
              background: 'repeating-linear-gradient(90deg, #450a0a 0px, #7f1d1d 22px, #991b1b 38px, #450a0a 55px)',
              borderLeft: '4px solid #f59e0b'
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </div>

          {/* 🌟 PREMIERE BILLBOARD CARD (When curtains are closed or film stopped) 🌟 */}
          {!curtainsOpen && (
            <div className="absolute inset-0 z-45 bg-black/85 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-rose-600/30 border border-rose-500/50 flex items-center justify-center mb-4 shadow-2xl shadow-rose-600/40">
                <Film className="w-8 h-8 text-rose-400" />
              </div>

              <div className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-rose-400 mb-1">
                LUMIXORA MOTION PICTURES • PREMIERE SCREENING
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-xl">
                {film.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-lg mt-2 leading-relaxed">
                "{film.logline}"
              </p>

              <div className="flex items-center gap-2 mt-3 text-xs text-amber-400 font-bold">
                <span>★★★★★</span>
                <span className="text-gray-300">Critics Choice • Written by {film.creator}</span>
              </div>

              <button
                onClick={togglePlay}
                className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm shadow-2xl shadow-rose-600/50 flex items-center gap-3 cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>OPEN CURTAINS & ROLL FILM</span>
              </button>
            </div>
          )}

          {/* ⏱️ VINTAGE 3... 2... 1... OPTICAL FILM COUNTDOWN ⏱️ */}
          {countdownNumber !== null && (
            <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-fade-in pointer-events-none">
              {/* Spinning Optical Countdown Target */}
              <div className="relative w-44 h-44 rounded-full border-4 border-white/50 flex items-center justify-center animate-spin" style={{ animationDuration: '1s' }}>
                <div className="absolute top-0 bottom-0 w-0.5 bg-white/50" />
                <div className="absolute left-0 right-0 h-0.5 bg-white/50" />
                <div className="w-32 h-32 rounded-full border border-white/30" />
              </div>

              <div className="absolute text-8xl sm:text-9xl font-black font-mono text-white tracking-widest drop-shadow-[0_0_30px_rgba(255,255,255,0.9)]">
                {countdownNumber}
              </div>

              <div className="mt-8 text-xs font-mono font-bold tracking-[0.3em] uppercase text-gray-400">
                LUMIXORA CINEMA 70MM • {film.subtitle}
              </div>
            </div>
          )}

          {/* 🎥 THE MULTI-CAMERA CINEMA SCREEN 🎥 */}
          <div className="w-full h-full relative z-10 pt-7 pb-7">
            
            {/* ANGLE 1: DUAL SCREEN (RADAR + TELEPROMPTER) */}
            {cameraAngle === 'dual' && (
              <div className="w-full h-full grid grid-cols-1 md:grid-cols-12">
                {/* Left Deck (6 Cols): Living Architectural Radar */}
                <div className="md:col-span-6 h-full relative border-r border-white/10">
                  <LivingArchitectureCanvas 
                    filmId={film.id}
                    chapterId={chapter.id}
                    isPlaying={isPlaying && countdownNumber === null}
                    playbackSpeed={playbackSpeed}
                  />
                </div>

                {/* Right Deck (6 Cols): Cinematic Code Projector */}
                <div className="md:col-span-6 h-full bg-[#050811] flex flex-col overflow-hidden">
                  <div className="px-4 py-2 bg-black/70 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Terminal className="w-3.5 h-3.5 text-rose-400" />
                      <span className="font-bold">{chapter.file}</span>
                      <span className="text-[10px] text-gray-500">• {film.language}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{isPlaying ? 'STREAMING REEL' : 'PAUSED'}</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto flex-1 overflow-y-auto custom-scrollbar bg-black/85">
                    <pre className="text-gray-200">
                      <code>
                        {fullCode.slice(0, displayedCodeLength || fullCode.length)}
                        {isPlaying && (
                          <span className="inline-block w-2.5 h-4 bg-rose-400 ml-0.5 animate-pulse align-middle" />
                        )}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* ANGLE 2: FULL LIVING RADAR (IMAX 100% VISUAL) */}
            {cameraAngle === 'radar' && (
              <div className="w-full h-full relative">
                <LivingArchitectureCanvas 
                  filmId={film.id}
                  chapterId={chapter.id}
                  isPlaying={isPlaying && countdownNumber === null}
                  playbackSpeed={playbackSpeed}
                />
              </div>
            )}

            {/* ANGLE 3: 35MM CODE TELEPROMPTER */}
            {cameraAngle === 'teleprompter' && (
              <div className="w-full h-full bg-[#050811] flex flex-col overflow-hidden">
                <div className="px-5 py-2.5 bg-black/80 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-gray-200">
                    <Terminal className="w-4 h-4 text-rose-400" />
                    <span className="font-black text-white">{chapter.file}</span>
                    <span className="text-gray-500">[{film.title}]</span>
                  </div>
                  <div className="text-[11px] text-rose-400 font-bold font-mono">
                    COMMIT #{chapter.commitSha}
                  </div>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed overflow-auto flex-1 bg-black/90 text-emerald-400 custom-scrollbar">
                  <pre>
                    <code>
                      {fullCode.slice(0, displayedCodeLength || fullCode.length)}
                      {isPlaying && (
                        <span className="inline-block w-3 h-5 bg-emerald-400 ml-1 animate-pulse align-middle" />
                      )}
                    </code>
                  </pre>
                </div>
              </div>
            )}

          </div>

          {/* 🎙️ DIRECTOR'S MOVIE SUBTITLE BAR (HOLLYWOOD CAPTION) 🎙️ */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 max-w-2xl w-[90%] z-30 pointer-events-none">
            <div className="bg-black/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-2xl text-center">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-rose-400 mb-0.5">
                AI DIRECTOR AUDIO • [{film.creator}]
              </div>
              <p className="text-xs sm:text-sm text-yellow-300 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                "{chapter.narration}"
              </p>
            </div>
          </div>

          {/* Anamorphic Blue Lens Flare Accent */}
          <div 
            className="absolute top-1/2 left-0 right-0 h-0.5 pointer-events-none opacity-20 z-25"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.8), transparent)'
            }}
          />

          {/* Cinema Watermark Stamp */}
          <div className="absolute top-10 right-6 text-[10px] font-mono font-black tracking-widest text-white/30 uppercase pointer-events-none z-30">
            {film.title.toUpperCase()} • 2.39:1
          </div>
        </div>

        {/* 🪑 LUXURY THEATER AUDITORIUM SEATS (BOTTOM FOREGROUND) 🪑 */}
        <div className="w-full flex items-end justify-center gap-3 sm:gap-6 -mt-3 sm:-mt-5 relative z-25 pointer-events-none opacity-90 select-none">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="w-10 sm:w-16 h-8 sm:h-12 rounded-t-2xl border-t border-white/20 shadow-2xl flex flex-col items-center justify-between"
              style={{
                background: 'linear-gradient(180deg, #1e293b 0%, #090d16 100%)',
                boxShadow: isPlaying ? `0 -4px 15px ${film.accentColor}33` : 'none'
              }}
            >
              <div className="w-7 sm:w-11 h-1.5 rounded-full bg-white/10 mt-1" />
            </div>
          ))}
        </div>

        {/* ─── FLOATING THEATER CONTROL REMOTE DOCK (NETFLIX / APPLE TV STYLE) ─── */}
        <div className={`p-4 rounded-3xl bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 ${isImaxMode ? 'max-w-4xl mx-auto mb-6 w-[92%] relative z-40' : ''}`}>
          
          {/* Chapter Meta */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">{chapter.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-black uppercase tracking-wider">
                  Ch {chapter.id}/{film.chapters.length}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 truncate max-w-xs sm:max-w-md">{chapter.dilemma}</p>
            </div>
          </div>

          {/* Player Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Camera Angle Switcher */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setCameraAngle('dual')}
                className={`p-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${cameraAngle === 'dual' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Camera 1: Split Screen"
              >
                <Tv className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCameraAngle('radar')}
                className={`p-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${cameraAngle === 'radar' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Camera 2: Full Architecture Radar"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCameraAngle('teleprompter')}
                className={`p-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${cameraAngle === 'teleprompter' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Camera 3: Full Code Projector"
              >
                <Terminal className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handlePrevChapter}
              disabled={selectedChapterIndex === 0}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white transition-all cursor-pointer"
              title="Previous Chapter"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-rose-500/40 flex items-center gap-2 cursor-pointer transition-all transform active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause Movie</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{displayedCodeLength >= fullCode.length ? 'Replay Movie' : 'Roll Film'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextChapter}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
              title="Next Chapter"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Speed Multiplier */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    playbackSpeed === spd ? 'bg-rose-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Curtains Toggle */}
            <button
              onClick={() => setCurtainsOpen(!curtainsOpen)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Curtains Open/Close [C]"
            >
              <span>🎭</span>
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
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isScoreEnabled ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-white/5 border-white/10 text-gray-500'
              }`}
              title="Hans Zimmer Audio Score"
            >
              {isScoreEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* IMAX Exit / Toggle Button */}
            <button
              onClick={() => setIsImaxMode(!isImaxMode)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title={isImaxMode ? 'Exit IMAX [Esc]' : 'Enter IMAX [F]'}
            >
              {isImaxMode ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ─── SYSTEM TRADE-OFF & FAANG INTERVIEW DOSSIER (Below Screen in Normal Mode) ─── */}
        {!isImaxMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Box 1: The Architectural Dilemma */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3.5 text-left">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  ⚖️
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">The Engineering Dilemma</h3>
                  <p className="text-[10px] text-gray-400">Why standard textbook solutions failed</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300">
                <strong className="text-rose-400 block mb-1">The Bottleneck:</strong>
                {chapter.dilemma}
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300">
                <strong className="text-emerald-400 block mb-1">The Breakthrough:</strong>
                {chapter.tradeoff}
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 to-indigo-950/40 border border-rose-500/20 flex items-center gap-2.5 text-xs text-gray-300">
                <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong className="text-white">Golden Rule: </strong>{film.keyTakeaway}</span>
              </div>
            </div>

            {/* Box 2: FAANG Whiteboard Interview Question */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3.5 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">L5/L6 Staff Engineer Question</h3>
                    <p className="text-[10px] text-amber-300 font-semibold">How Amazon & Google test this</p>
                  </div>
                </div>
                <button
                  onClick={handleForkMoment}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold border border-white/15 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <GitBranch className="w-3 h-3 text-rose-400" />
                  <span>Fork Moment</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-200">
                Q: {chapter.interviewQuestion}
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed">
                <strong className="text-white block mb-1">Staff Engineer Model Answer:</strong>
                {chapter.interviewAnswer}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ─── FORK THIS MOMENT LIVE SANDBOX MODAL ─── */}
      {showForkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b0f19] border border-white/15 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl text-left flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg">
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
