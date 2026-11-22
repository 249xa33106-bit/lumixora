import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Sparkles, Code2, GitBranch, GitCommit, Terminal, Cpu, Award, Zap,
  Flame, BookOpen, ChevronRight, Copy, Check, ExternalLink, HelpCircle,
  Eye, ArrowRight, Layers, Sliders, CheckCircle2, Clock, Info
} from 'lucide-react';

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
      },
      {
        id: 4,
        title: 'Zero-Copy SDS: Binary-Safe Strings',
        commitSha: '31cb541',
        timestamp: 'Day 89 • August 2009',
        file: 'sds.h',
        dilemma: 'Frequent string reallocations caused severe memory fragmentation and buffer overflow vulnerabilities.',
        tradeoff: 'Created SDS (Simple Dynamic Strings) with pre-allocated buffer padding and explicit length headers.',
        narration: "Notice line 12: SDS header. By placing the header struct directly BEFORE the char array in memory, standard C printf can still print the pointer, but Redis can inspect string length in zero CPU cycles without scanning for null terminators.",
        interviewQuestion: 'How does SDS achieve binary safety in Redis?',
        interviewAnswer: 'Since SDS tracks the explicit length integer in its header, the string can store arbitrary binary data including null characters (\0), image bytes, or Protobuf binaries.',
        code: `/* sds.h - Simple Dynamic Strings with Memory Prefetch */
struct sdshdr {
    int len;      /* Current used length (O(1) lookup!) */
    int free;     /* Pre-allocated buffer headroom */
    char buf[];   /* Direct memory pointer compatible with printf */
};

sds sdsnewlen(const void *init, size_t initlen) {
    struct sdshdr *sh = malloc(sizeof(struct sdshdr) + initlen + 1);
    sh->len = initlen;
    sh->free = 0;
    if (initlen && init)
        memcpy(sh->buf, init, initlen);
    sh->buf[initlen] = '\\0';
    return (char*)sh->buf; /* Pointer arithmetic trick! */
}`
      },
      {
        id: 5,
        title: 'Asynchronous Persistence: The Fork RDB Miracle',
        commitSha: '94c1a88',
        timestamp: 'Day 140 • October 2009',
        file: 'rdb.c',
        dilemma: 'Writing the whole database to disk froze the single-threaded server for multiple seconds under high traffic.',
        tradeoff: 'Leveraged Unix copy-on-write OS page tables via fork() to snapshot memory in background while main thread serves traffic.',
        narration: "The final masterpiece. How do you save 20 gigabytes of data to disk when you only have one thread? Salvatore calls fork(). The Linux kernel duplicates page pointers via Copy-On-Write. The child writes to disk at full speed while the parent keeps serving 100k requests without missing a beat.",
        interviewQuestion: 'What is Copy-On-Write (COW) and how does Redis exploit it in BGSAVE?',
        interviewAnswer: 'fork() creates a child process that shares identical physical RAM pages with the parent. Only when the parent writes to a key does the OS copy that specific 4KB page. The child snapshots memory without locking the server.',
        code: `/* rdb.c - Non-Blocking Background Snapshot */
int rdbSaveBackground(char *filename) {
    pid_t childpid;
    
    /* Fork leverages OS Copy-On-Write (COW) */
    if ((childpid = fork()) == 0) {
        /* Child Process: Writes disk snapshot */
        closeListeningSockets();
        rdbSave(filename);
        exit(0);
    } else {
        /* Parent Process: Continues serving 100,000 req/sec in RAM! */
        server.bgsavechildpid = childpid;
        return REDIS_OK;
    }
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
      },
      {
        id: 2,
        title: 'The Merkle Tree: Instant Directory Snapshots',
        commitSha: '7bb831a',
        timestamp: 'Day 5 • April 2005',
        file: 'tree.c',
        dilemma: 'How do you represent nested folders and directories without storing thousands of duplicate copies?',
        tradeoff: 'Hierarchical tree objects: If only one file in a folder changes, only its parent tree hashes update; all other trees remain reused.',
        narration: "Here Linus connects blobs into Merkle Trees. A folder is just a text file listing child hashes. When you modify one function in one file, 99.9% of the tree nodes are reused by reference. This is why git commit takes 2 milliseconds.",
        interviewQuestion: 'What is the difference between a Git Blob, Tree, and Commit?',
        interviewAnswer: 'A Blob holds raw file data without metadata. A Tree holds folder structure mapping filenames and file modes to Blob hashes. A Commit points to a root Tree and parent Commit hashes with author and timestamp metadata.',
        code: `/* tree.c - The Merkle DAG of Directory Nodes */
struct tree_entry {
    unsigned int mode;
    char *path;
    unsigned char sha1[20];
};

struct tree {
    struct object object;
    unsigned int entry_count;
    struct tree_entry *entries;
};

/* Fast recursive tree matching: Compare root SHA-1 in O(1) */
int tree_diff(struct tree *t1, struct tree *t2) {
    if (memcmp(t1->object.sha1, t2->object.sha1, 20) == 0)
        return 0; /* Identical directory contents with ZERO disk reads! */
    return recursive_tree_walk(t1, t2);
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
      },
      {
        id: 2,
        title: 'The Fiber Reconciler: Cooperative Scheduling',
        commitSha: 'f1b903e',
        timestamp: 'Day 450 • 2016',
        file: 'ReactFiberScheduler.js',
        dilemma: 'The original recursive stack reconciler could not be paused. Heavy component trees froze user typing and animation frames.',
        tradeoff: 'Re-implemented the JavaScript call stack as a singly-linked list of Fiber nodes that can pause, prioritize, and resume work.',
        narration: "By 2016, large web apps were dropping 60fps frames. Sophie Alpert and the React core team rewrote the entire engine. Meet Fiber: a linked-list work loop that checks the clock. If 16 milliseconds pass, it pauses rendering, yields control to user typing, and resumes later.",
        interviewQuestion: 'How does React Fiber achieve time-slicing without Web Workers?',
        interviewAnswer: 'Fiber turns the recursive stack into an iterative loop of linked Fiber nodes. Using requestIdleCallback / MessageChannel, it yields execution to the main thread whenever the browser frame budget is exhausted.',
        code: `/* ReactFiberScheduler.js - The Cooperative Time-Slice Loop */
function workLoop(deadline) {
    while (nextUnitOfWork !== null && deadline.timeRemaining() > 1) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    
    /* If frame time is up, pause and schedule next slice! */
    if (nextUnitOfWork !== null) {
        requestIdleCallback(workLoop);
    } else {
        commitRoot(workInProgressRoot); /* Flush to screen */
    }
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
  const [displayedCodeLength, setDisplayedCodeLength] = useState(0);
  const [showForkModal, setShowForkModal] = useState(false);
  const [forkedCode, setForkedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTabSub, setActiveTabSub] = useState('code'); // 'code', 'blueprint', 'interview'

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
          return Math.min(fullCode.length, prev + Math.max(2, Math.floor(6 * playbackSpeed)));
        });
      }, 35);
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

  const togglePlay = () => {
    if (displayedCodeLength >= fullCode.length) {
      setDisplayedCodeLength(0);
    }
    setIsPlaying(!isPlaying);
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
    <div className="min-h-screen bg-[#070b14] text-white pb-20 selection:bg-rose-500/30 selection:text-rose-200">
      {/* ─── CINEMA HERO HEADER ─── */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-[#0e1628] via-[#090e1c] to-[#070b14] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 overflow-hidden">
        {/* Film projector light sweep effect */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-25"
          style={{ background: `radial-gradient(circle, ${film.accentColor} 0%, transparent 70%)` }}
        />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-black shadow-lg shadow-rose-500/20 mb-3.5">
              <Film className="w-4 h-4 animate-pulse text-rose-400" />
              <span>CodeCinema™ 4D Archaeological Theater</span>
              <span className="px-1.5 py-0.2 text-[9px] rounded-md bg-rose-500 text-white font-extrabold uppercase">NEW</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Watch Code Write Itself.<br />
              <span className={`bg-gradient-to-r ${film.color} bg-clip-text text-transparent`}>
                The Architectural Cinema.
              </span>
            </h1>

            <p className="text-gray-400 text-xs sm:text-sm font-medium max-w-2xl mt-2.5 leading-relaxed">
              Step into the minds of legendary software architects. Watch Redis, Git, and React evolve commit-by-commit from Day 1, with animated code diffs, real-time voice commentary, and system design breakdown.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-center min-w-[100px]">
              <div className="text-lg font-black text-white">3 Masterpieces</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Historical Reels</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-center min-w-[100px]">
              <div className="text-lg font-black text-rose-400">FAANG Grade</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">System Insights</div>
            </div>
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

      {/* ─── MAIN THEATER STAGE ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Film Header Banner */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-wider">
                Chapter {chapter.id} of {film.chapters.length}
              </span>
              <span className="text-xs text-gray-400 font-semibold">• {chapter.timestamp}</span>
              <span className="text-xs text-rose-400 font-mono font-bold">• commit #{chapter.commitSha}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{chapter.title}</h2>
            <p className="text-xs text-gray-300 mt-1 max-w-3xl leading-relaxed">{chapter.dilemma}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleForkMoment}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Fork This Moment</span>
            </button>

            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isVoiceEnabled
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
              title={isVoiceEnabled ? 'Voice Commentary: Active' : 'Voice Commentary: Muted'}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ─── DUAL-DECK STAGE (CODE CINEMA SCREEN + DIRECTOR'S COMMENTARY) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: The Code Projector Screen (7 Columns) */}
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

            {/* Code Viewer Body */}
            <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto min-h-[380px] max-h-[500px] overflow-y-auto custom-scrollbar bg-[#03060d]">
              <pre className="text-gray-200">
                <code>
                  {fullCode.slice(0, displayedCodeLength || fullCode.length)}
                  {isPlaying && (
                    <span className="inline-block w-2 h-4 bg-rose-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </code>
              </pre>
            </div>

            {/* Cinema Scrubber & Controls Footer */}
            <div className="px-5 py-4 bg-[#0a0f1d] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Playback Button Group */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevChapter}
                  disabled={selectedChapterIndex === 0}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all cursor-pointer"
                  title="Previous Chapter"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 flex items-center gap-2 cursor-pointer transition-all transform active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause Reel</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{displayedCodeLength >= fullCode.length ? 'Replay Chapter' : 'Play Cinema'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextChapter}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
                  title="Next Chapter"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
                {[0.5, 1, 2, 5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
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

          {/* Right: The Director's Commentary & System Design Dossier (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Tab Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10">
              <button
                onClick={() => setActiveTabSub('code')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTabSub === 'code' ? 'bg-white/15 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Director's Audio</span>
              </button>

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

            {/* Tab 1: Director's Narration */}
            {activeTabSub === 'code' && (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                      🎙️
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Director's Commentary</div>
                      <div className="text-[10px] text-gray-400">Authentic Architectural Backstory</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-[10px] font-black border border-rose-500/20">
                    Live Audio
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
                  "{chapter.narration}"
                </p>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-indigo-950/40 border border-rose-500/20 flex items-center gap-3">
                  <Flame className="w-5 h-5 text-rose-400 shrink-0" />
                  <div className="text-xs text-gray-300">
                    <strong className="text-white">Core Principle: </strong>
                    {film.keyTakeaway}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: System Trade-Off Blueprint */}
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
                </div>
              </div>
            )}

            {/* Tab 3: FAANG Interview Cross-Examination */}
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
              <div className="text-[11px] font-black uppercase text-gray-400 px-1 tracking-wider">Chapter Sequence</div>
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
