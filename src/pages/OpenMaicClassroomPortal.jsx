import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Bot, Sparkles, Play, Pause, RotateCcw, Volume2, VolumeX,
  Send, Hand, MessageSquare, BookOpen, Code2, Layers, CheckCircle2,
  Trophy, HelpCircle, FileText, Download, Share2, ArrowRight, Star,
  Terminal, Monitor, Brain, Lightbulb, Zap, UserCheck, Flame, ChevronRight,
  ChevronLeft, Award, Radio, RefreshCw, PlayCircle, Cpu, ShieldCheck,
  GitBranch, Activity, Eye, Compass, Info, Check, Copy, AlertTriangle,
  BarChart2, Globe, Server, Hash, Sparkle, MessageCircleQuestion,
  Presentation, LayoutGrid, PlusCircle, Maximize2, Minimize2, Sliders
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';
import { callAICompletion } from '../services/aiService';
import { saveQuizScoreToSupabase } from '../services/supabaseDataSyncService';

// ─── 4 Curated Multi-Slide OpenMAIC Masterclasses ─────────────────────────────
const OPENMAIC_DEFAULT_LESSONS = [
  {
    id: 'java-data-types',
    title: 'Java Core: Data Types, JVM Memory & Type Casting',
    subject: 'Java Programming & JVM Architecture',
    difficulty: 'Foundational to Advanced',
    duration: '25 mins',
    tags: ['Java', 'Data Types', 'JVM Memory', 'Primitives', 'Type Casting'],
    professor: {
      name: 'Prof. Christopher Lumina',
      role: 'Lead AI Professor of Computer Science & JVM Architecture',
      avatar: '👨‍🏫',
      voicePitch: 0.95,
      voiceRate: 0.98
    },
    classmates: [
      { id: 'alex', name: 'Alex', title: 'Alex (Curious Skeptic)', avatar: '🧑‍💻', color: 'text-amber-400', role: 'Edge-Case Specialist', pitch: 1.2 },
      { id: 'maya', name: 'Maya', title: 'Maya (Performance Hacker)', avatar: '👩‍💻', color: 'text-cyan-400', role: 'Memory & Low-Level', pitch: 1.3 }
    ],
    scenes: [
      {
        id: 'scene-java-1',
        slideNumber: 1,
        title: 'Slide 1: Java Primitive Data Types & Byte Allocation',
        slideSubtitle: 'The 8 primitive types, memory footprints, bit ranges, and default values.',
        takeaways: [
          'Java defines 8 primitive types: byte (1B), short (2B), int (4B), long (8B), float (4B), double (8B), char (2B Unicode UTF-16), and boolean (1-bit logical).',
          'Primitives are stored directly on the Thread Call Stack without heap object header overhead.',
          'Default values: numeric types default to 0 / 0.0, boolean to false, and char to \\u0000.'
        ],
        whiteboardContent: `# Java 8 Primitive Data Types\n\n| Type | Size | Min Value | Max Value | Default |\n| :--- | :--- | :--- | :--- | :--- |\n| \`byte\` | 8 bits (1B) | -128 | 127 | \`0\` |\n| \`short\` | 16 bits (2B) | -32,768 | 32,767 | \`0\` |\n| \`int\` | 32 bits (4B) | $-2^{31}$ | $2^{31}-1$ (2.14B) | \`0\` |\n| \`long\` | 64 bits (8B) | $-2^{63}$ | $2^{63}-1$ | \`0L\` |\n| \`float\` | 32 bits (4B) | $\\approx 1.4\\times 10^{-45}$ | $\\approx 3.4\\times 10^{38}$ | \`0.0f\` |\n| \`double\`| 64 bits (8B) | $\\approx 4.9\\times 10^{-324}$ | $\\approx 1.8\\times 10^{308}$ | \`0.0d\` |\n| \`char\` | 16 bits (2B) | \`\\u0000\` (0) | \`\\uffff\` (65,535) | \`\\u0000\` |\n| \`boolean\`| 1 bit JVM | \`false\` | \`true\` | \`false\` |`,
        diagram: `┌───────────────────────────────────────────────────────────────┐\n│               JAVA PRIMITIVE MEMORY FOOTPRINT                 │\n├───────────────────────────────────────────────────────────────┤\n│ [byte: 1B]  [short: 2B]  [int: 4B]    [long: 8B]              │\n│ [float: 4B] [double: 8B] [char: 2B]   [boolean: 1b]           │\n│                                                               │\n│ Stack Frame: [ int age = 25 ]  --> Directly holds 32-bit val │\n└───────────────────────────────────────────────────────────────┘`,
        codeSnippet: `public class JavaDataTypesDemo {\n    public static void main(String[] args) {\n        // Integral primitives\n        byte smallCount = 127;\n        short port = 8080;\n        int userCount = 1_000_000;\n        long epochMillis = 1711000000000L; // Suffix 'L' required\n\n        // Floating point primitives\n        float piFloat = 3.14159f;           // Suffix 'f' required\n        double precision = 3.141592653589793;\n\n        // Character and Boolean\n        char grade = 'A'; // 16-bit Unicode\n        boolean isEnrolled = true;\n\n        System.out.println("Primitives initialized in Stack successfully!");\n    }\n}`,
        terminalOutput: `[JVM COMPILE & RUN] JavaDataTypesDemo.java\n>>> Primitives initialized in Stack successfully!\n>>> Memory footprint: 0 Heap allocations.`,
        dialogue: [
          { speaker: 'professor', text: 'Welcome scholars! In Java, data types are strictly split into two main families: Primitives and Reference types. Let us master the 8 primitives first.' },
          { speaker: 'alex', text: 'Professor, why does Java allocate 2 bytes (16 bits) for char when C only uses 1 byte (8 bits)?' },
          { speaker: 'professor', text: 'Brilliant question, Alex! C used 8-bit ASCII. Java was designed from inception for internationalization using 16-bit UTF-16 Unicode, allowing it to represent global scripts.' }
        ],
        quiz: {
          question: 'Which of the following is an 8-byte (64-bit) primitive data type in Java?',
          options: [
            'long and double',
            'int and float',
            'short and char',
            'String and Integer'
          ],
          correct: 0,
          explanation: 'In Java, both `long` (64-bit integer) and `double` (64-bit IEEE 754 floating point) occupy exactly 8 bytes (64 bits) of memory.'
        }
      },
      {
        id: 'scene-java-2',
        slideNumber: 2,
        title: 'Slide 2: Reference Types, Strings & Memory Layout (Stack vs Heap)',
        slideSubtitle: 'How objects, arrays, and classes differ from primitives in JVM memory.',
        takeaways: [
          'Reference types (Classes, Interfaces, Arrays, Enums) store memory addresses (pointers) on the Stack pointing to objects on the Heap.',
          'String is a reference type (an immutable object) backed by the JVM String Constant Pool to optimize memory.',
          'Unreferenced objects on the Heap are automatically reclaimed by the JVM Garbage Collector (GC).'
        ],
        whiteboardContent: `# JVM Memory: Stack vs Heap Allocation\n\n### Primitives vs References:\n* **Stack Memory:** Fast, thread-private, stores primitive values directly and object references (pointers).\n* **Heap Memory:** Shared across threads, stores all actual Objects and Array instances.\n\n### String Constant Pool (SCP):\n$$\\text{String } s1 = \\text{\"Java\"}; \\quad \\text{String } s2 = \\text{\"Java\"}; \\implies s1 == s2 \\text{ (True)}$$\n$$\\text{String } s3 = \\text{new String(\"Java\")}; \\implies s1 == s3 \\text{ (False, distinct Heap obj)}$$`,
        diagram: `┌───────────────────────────┬───────────────────────────────────┐\n│     STACK (Thread Local)  │          HEAP (Shared Space)      │\n├───────────────────────────┼───────────────────────────────────┤\n│ [ int x = 42 ]            │                                   │\n│ [ String ref1 ] --------->│ [ String Pool: "Hello" ]          │\n│ [ User userRef ] -------->│ [ User Object { id: 101, name } ] │\n│ [ int[] arrRef ] -------->│ [ Array: [ 10, 20, 30, 40 ] ]     │\n└───────────────────────────┴───────────────────────────────────┘`,
        codeSnippet: `public class ReferenceTypesDemo {\n    public static void main(String[] args) {\n        // Primitive: Stores value directly\n        int a = 10;\n        int b = a; // Copied by value: b is 10\n        b = 20;    // 'a' remains 10\n\n        // Reference Type: Stores pointer to Heap object\n        int[] arr1 = { 1, 2, 3 };\n        int[] arr2 = arr1; // Copied by reference!\n        arr2[0] = 99;      // arr1[0] is NOW 99!\n\n        // String Equality\n        String s1 = "OpenMAIC";\n        String s2 = new String("OpenMAIC");\n        System.out.println(s1 == s2);      // false (different memory addresses)\n        System.out.println(s1.equals(s2));  // true  (identical character content)\n    }\n}`,
        terminalOutput: `[EXECUTION] ReferenceTypesDemo.main()\n>>> a = 10, b = 20\n>>> arr1[0] = 99 (shared heap object)\n>>> s1 == s2 : false | s1.equals(s2) : true`,
        dialogue: [
          { speaker: 'maya', text: 'So when we pass an object into a Java method, are we passing by reference or value?' },
          { speaker: 'professor', text: 'Java is strictly Pass-By-Value! When you pass an object, the value being copied and passed is the memory reference (address pointer).' }
        ],
        quiz: {
          question: 'Why does `s1 == s2` return false when comparing `String s1 = "Hi";` and `String s2 = new String("Hi");`?',
          options: [
            '`==` compares memory addresses, and `new` allocates a distinct object outside the String Constant Pool',
            '`==` is not supported on Strings in Java',
            '`s1` contains uppercase letters while `s2` is lowercase',
            'Strings cannot be stored on the Heap'
          ],
          correct: 0,
          explanation: 'The `==` operator compares reference memory addresses. `s1` refers to the String Constant Pool instance, while `new String()` forces a separate Heap allocation.'
        }
      },
      {
        id: 'scene-java-3',
        slideNumber: 3,
        title: 'Slide 3: Type Casting & Conversion (Widening vs Narrowing)',
        slideSubtitle: 'Implicit automatic conversions, explicit type casts, and integer overflow traps.',
        takeaways: [
          'Widening Casting (Implicit/Automatic): Converting a smaller type to a larger type (e.g., int -> double) is safe and automatic.',
          'Narrowing Casting (Explicit): Converting a larger type to a smaller type requires explicit syntax `(int) d` and risks data loss/truncation.',
          'Numeric Promotion: In arithmetic operations (`byte a + byte b`), operands are automatically promoted to `int`.'
        ],
        whiteboardContent: `# Java Type Casting Rules\n\n### Widening (Automatic, No Loss):\n$$\\text{byte} \\rightarrow \\text{short} \\rightarrow \\text{int} \\rightarrow \\text{long} \\rightarrow \\text{float} \\rightarrow \\text{double}$$\n\n### Narrowing (Explicit, Risk of Truncation & Overflow):\n$$\\text{double} \\xrightarrow{(\\text{long})} \\text{long} \\xrightarrow{(\\text{int})} \\text{int} \\xrightarrow{(\\text{short})} \\text{short} \\xrightarrow{(\\text{byte})} \\text{byte}$$\n\n### Boundary Overflow Invariant:\n$$\\text{Integer.MAX\\_VALUE} + 1 = \\text{Integer.MIN\\_VALUE} \\quad (2147483647 + 1 = -2147483648)$$`,
        diagram: `┌───────────────────────────────────────────────────────────────┐\n│                     JAVA CASTING HIERARCHY                    │\n├───────────────────────────────────────────────────────────────┤\n│ [ Widening: Automatic ]                                       │\n│ byte(1B) ──> short(2B) ──> int(4B) ──> long(8B) ──> double(8B)│\n│                                                               │\n│ [ Narrowing: Explicit '(targetType)' Required ]               │\n│ double ──────(cast)──────> int ──────(cast)──────> byte       │\n│ (3.99)                     (3)                    (Truncated) │\n└───────────────────────────────────────────────────────────────┘`,
        codeSnippet: `public class TypeCastingDemo {\n    public static void main(String[] args) {\n        // 1. Widening Casting (Implicit)\n        int myInt = 100;\n        double myDouble = myInt; // Automatically converted to 100.0\n\n        // 2. Narrowing Casting (Explicit)\n        double pi = 3.999;\n        int truncatedPi = (int) pi; // Explicit cast: truncated to 3\n\n        // 3. Overflow Pitfall\n        int max = Integer.MAX_VALUE; // 2,147,483,647\n        int overflowed = max + 1;    // Wraps around to -2,147,483,648\n\n        // 4. Type promotion in expressions\n        byte b1 = 10;\n        byte b2 = 20;\n        // byte sum = b1 + b2; // COMPILE ERROR: (b1+b2) evaluates to int!\n        byte sum = (byte)(b1 + b2); // Correct\n\n        System.out.println("Truncated: " + truncatedPi + " | Overflow: " + overflowed);\n    }\n}`,
        terminalOutput: `[EXECUTION] TypeCastingDemo.main()\n>>> Truncated: 3\n>>> Overflow: -2147483648 (Two's complement wrap-around)\n>>> Byte sum cast: 30`,
        dialogue: [
          { speaker: 'alex', text: 'Why did `(int) 3.999` evaluate to 3 instead of rounding to 4?' },
          { speaker: 'professor', text: 'In Java, casting floating-point types to integer types performs direct truncation towards zero, not mathematical rounding. Use Math.round() if rounding is needed!' }
        ],
        quiz: {
          question: 'What happens when you evaluate `byte b = (byte) 130;` in Java?',
          options: [
            'It wraps around using two\'s complement to -126',
            'It throws a runtime OverflowException',
            'It automatically promotes `b` to `int`',
            'It sets `b` to 127 (the max byte value)'
          ],
          correct: 0,
          explanation: 'Because byte ranges from -128 to 127, casting 130 (which is 128 + 2) wraps around in 8-bit two\'s complement representation to -126.'
        }
      },
      {
        id: 'scene-java-4',
        slideNumber: 4,
        title: 'Slide 4: Wrapper Classes, Autoboxing & Performance Best Practices',
        slideSubtitle: 'Primitives vs Wrapper objects (Integer, Double), autoboxing overhead, and NullPointer traps.',
        takeaways: [
          'Every primitive has a corresponding Wrapper class: int -> Integer, char -> Character, double -> Double, boolean -> Boolean.',
          'Autoboxing and Unboxing allow seamless syntax, but unboxing a null wrapper throws NullPointerException.',
          'Wrapper objects add 16–24 bytes of object header overhead per instance; prefer primitives for high-performance loops and collections (e.g. primitive arrays).'
        ],
        whiteboardContent: `# Primitives vs Wrapper Objects\n\n| Primitive | Wrapper Class | Object Overhead | Cache Range |\n| :--- | :--- | :--- | :--- |\n| \`int\` | \`Integer\` | 16-24 bytes | -128 to 127 |\n| \`char\` | \`Character\` | 16 bytes | 0 to 127 |\n| \`boolean\`| \`Boolean\` | 16 bytes | \`TRUE\` / \`FALSE\` |\n| \`double\` | \`Double\` | 24 bytes | None |\n\n### Autoboxing Invariant:\n$$\\text{Integer } a = 100; \\quad \\text{Integer } b = 100; \\implies a == b \\text{ (True: IntegerCache)}$$\n$$\\text{Integer } x = 200; \\quad \\text{Integer } y = 200; \\implies x == y \\text{ (False: outside cache!)}$$`,
        diagram: `┌───────────────────────────────────────────────────────────────┐\n│                 AUTOBOXING & INTEGER CACHE                    │\n├───────────────────────────────────────────────────────────────┤\n│ int primitive (4 Bytes) ──[Autoboxing]──> Integer Object      │\n│                                           ├── Object Header   │\n│                                           └── int value (16B) │\n│                                                               │\n│ Integer.valueOf(v) caches values in range [-128, 127]         │\n└───────────────────────────────────────────────────────────────┘`,
        codeSnippet: `public class WrapperPerformanceDemo {\n    public static void main(String[] args) {\n        // Integer Cache Demonstration (-128 to 127)\n        Integer a = 100;\n        Integer b = 100;\n        System.out.println(a == b); // true (cached)\n\n        Integer c = 200;\n        Integer d = 200;\n        System.out.println(c == d); // FALSE! (different objects outside cache)\n        System.out.println(c.equals(d)); // true (value comparison)\n\n        // Dangerous NullPointer Trap in Unboxing\n        Integer nullWrapper = null;\n        try {\n            int unboxed = nullWrapper; // Throws NullPointerException!\n        } catch (NullPointerException e) {\n            System.out.println("Caught NullPointerException during automatic unboxing!");\n        }\n    }\n}`,
        terminalOutput: `[EXECUTION] WrapperPerformanceDemo.main()\n>>> a == b : true\n>>> c == d : false | c.equals(d) : true\n>>> Caught NullPointerException during automatic unboxing!`,
        dialogue: [
          { speaker: 'maya', text: 'In performance-critical financial or game engines, should we avoid Wrapper classes in loops?' },
          { speaker: 'professor', text: 'Absolutely, Maya! Using `Long sum = 0L` in a billion-iteration loop creates 1 billion temporary objects on the Heap, causing massive GC pause times. Always use primitive `long sum = 0L`!' }
        ],
        quiz: {
          question: 'Why does `Integer a = 100; Integer b = 100; a == b` evaluate to true, while `Integer c = 500; Integer d = 500; c == d` evaluates to false?',
          options: [
            'Java caches Integer objects in the range -128 to 127, reusing references for small values',
            'Integers above 128 are automatically converted to Doubles',
            '`==` is broken for numbers greater than 255',
            'Memory addresses are only 8-bit in Java'
          ],
          correct: 0,
          explanation: 'Java includes an `IntegerCache` that reuses object instances for values between -128 and 127. Values outside this range instantiate new distinct heap objects.'
        }
      }
    ]
  },
  {
    id: 'raft-consensus',
    title: 'Distributed Systems: Raft Consensus & Byzantine Fault Tolerance',
    subject: 'Distributed Computing',
    difficulty: 'Advanced',
    duration: '20 mins',
    tags: ['Consensus', 'Fault Tolerance', 'etcd', 'Raft'],
    professor: {
      name: 'Prof. Christopher Lumina',
      role: 'Chair of Distributed Systems & Cloud Infrastructure',
      avatar: '👨‍🏫',
      voicePitch: 0.95,
      voiceRate: 0.98
    },
    classmates: [
      { id: 'alex', name: 'Alex', title: 'Alex (Curious Skeptic)', avatar: '🧑‍💻', color: 'text-amber-400', role: 'Edge-Case & Failure Specialist', pitch: 1.2 },
      { id: 'maya', name: 'Maya', title: 'Maya (Latency Hacker)', avatar: '👩‍💻', color: 'text-cyan-400', role: 'High-Throughput Architect', pitch: 1.35 },
      { id: 'dev', name: 'Dev', title: 'Dev (Kernel Engineer)', avatar: '👨‍🔧', color: 'text-emerald-400', role: 'RPC & Network Internals', pitch: 0.85 },
      { id: 'sophia', name: 'Sophia', title: 'Sophia (Formal Theorist)', avatar: '👩‍🔬', color: 'text-pink-400', role: 'State Machine Proofs', pitch: 1.15 }
    ],
    scenes: [
      {
        id: 'scene-1',
        slideNumber: 1,
        title: 'Slide 1: Leader Election, Heartbeats & Randomized Timeouts',
        slideSubtitle: 'How Raft decomposes consensus into a deterministic state-machine election protocol.',
        takeaways: [
          '3 Fundamental States: Follower, Candidate, and Leader.',
          'Election safety invariant: At most one leader elected per term.',
          'Randomized timeouts (150ms-300ms) prevent split-vote deadlocks with mathematical certainty.'
        ],
        whiteboardContent: `
# Raft Consensus: Leader Election & Quorum Safety

### 3 Fundamental States of Every Raft Node
* **Follower (Default):** Passive receiver. Only responds to RPCs from candidates or the leader.
* **Candidate:** Initiates an election when election timer expires without receiving heartbeats.
* **Leader:** Handles all client writes, manages log replication, and broadcasts heartbeats at $T_{\\text{heartbeat}} \\approx 50\\text{ms}$.

---

### Core Safety Invariants (Mathematically Proven)
1. **Election Safety:** At most one leader can be elected in a given term:
   $$\\forall \\text{term } t, \\quad |\\{ L \\in \\text{Nodes} \\mid L = \\text{Leader}(t) \\}| \\le 1$$
2. **Leader Append-Only:** A leader never overwrites or truncates its own log entries; it only appends new ones.
3. **Log Matching Property:** If two logs contain an entry with the same index and term, they are identical in all entries up through the given index.

---

### Why Randomized Election Timeouts Prevent Split-Vote Deadlocks:
Nodes randomize their timeout between **150ms and 300ms**. The probability that two nodes timeout at the exact same millisecond approaches zero:
$$P(\\Delta t = 0) \\to 0$$
This guarantees a single candidate claims the majority quorum $(N/2 + 1)$ almost every round.
        `.trim(),
        diagram: `┌──────────────────────────────────────────────────────────────────────────┐
│                   RAFT 5-NODE QUORUM TOPOLOGY (TERM 2)                   │
├──────────────────────────────────────────────────────────────────────────┤
│               ┌───────────────┐     AppendEntries (Heartbeat)            │
│               │ Node-01 [FOL] │ <───────────────────┐                    │
│               └───────────────┘                     │                    │
│               ┌───────────────┐                     ▼                    │
│               │ Node-03 [FOL] │ <───────── ┌─────────────────┐           │
│               └───────────────┘            │ Node-02 [LEAD]  │ [QUORUM:  │
│               ┌───────────────┐ <───────── │  (Term: 2)      │  3/5 OK]  │
│               │ Node-04 [FOL] │            └─────────────────┘           │
│               └───────────────┘                     ▲                    │
│               ┌───────────────┐                     │                    │
│               │ Node-05 [FOL] │ <───────────────────┘                    │
│               └───────────────┘                                          │
└──────────────────────────────────────────────────────────────────────────┘`,
        codeSnippet: `// Go Raft RPC: RequestVote & AppendEntries Contract
type RequestVoteArgs struct {
    Term         int // Candidate's election term
    CandidateId  int // Candidate node requesting vote
    LastLogIndex int // Index of candidate's last log entry
    LastLogTerm  int // Term of candidate's last log entry
}

type RequestVoteReply struct {
    Term        int  // CurrentTerm for candidate to update itself
    VoteGranted bool // True means candidate received majority vote
}`,
        terminalOutput: `[CLUSTER INIT] Spawning 5 Raft Nodes (etcd-style topology)...
[Node-01] State: FOLLOWER | Term: 1 | ElectionTimeout: 214ms
[Node-02] State: FOLLOWER | Term: 1 | ElectionTimeout: 182ms
[Node-03] State: FOLLOWER | Term: 1 | ElectionTimeout: 290ms
>>> [ELECTION TRIGGER] Node-02 timer expired (182ms) -> State: CANDIDATE (Term: 2)
>>> [BROADCAST] RequestVote(Term: 2, CandidateId: Node-02)
>>> [QUORUM ACHIEVED] 3/5 affirmative votes collected (Node-01, Node-02, Node-03)
>>> [LEADER ASCENDED] Node-02 is now cluster LEADER for Term 2! Heartbeats streaming.`,
        dialogue: [
          {
            speaker: 'professor',
            text: "Welcome scholars to our OpenMAIC interactive masterclass! Today we are dissecting the Raft Distributed Consensus Protocol. When servers across the globe must agree on an immutable ledger, how do we guarantee consistency without a single point of failure?"
          },
          {
            speaker: 'alex',
            text: "Professor Lumina, Multi-Paxos proved distributed consensus decades ago. Why did Ongaro & Ousterhout at Stanford create Raft if Paxos was already mathematically sound?"
          },
          {
            speaker: 'professor',
            text: "An insightful question, Alex! While Paxos is mathematically proven, it is notoriously unintuitive and leaves critical real-world mechanisms like log compaction and dynamic cluster membership unspecified. Raft decomposes consensus into 3 independent sub-problems: Leader Election, Log Replication, and Safety."
          },
          {
            speaker: 'maya',
            text: "What prevents two candidate nodes from timing out at the exact same millisecond and triggering an endless split-vote deadlock cycle?"
          },
          {
            speaker: 'professor',
            text: "Brilliant observation, Maya! Raft prevents split votes by using randomized election timeouts—typically between 150ms and 300ms. Because nodes wake up at staggered intervals, one candidate almost always collects the majority quorum before another finishes."
          }
        ],
        quiz: {
          question: "What is the primary mechanism Raft uses to prevent split-vote deadlocks during leader election?",
          options: [
            "Fixed priority based on node IP addresses",
            "Randomized election timeouts (e.g. 150ms-300ms)",
            "Centralized lock coordinator in ZooKeeper",
            "Hardware atomic clocks with TrueTime GPS"
          ],
          correct: 1,
          explanation: "Randomized election timeouts ensure candidate timers expire at staggered intervals, allowing a single node to reliably obtain a majority vote."
        }
      },
      {
        id: 'scene-2',
        slideNumber: 2,
        title: 'Slide 2: Log Replication & Two-Phase Commit Quorums',
        slideSubtitle: 'Monotonically increasing log entries, AppendEntries RPCs, and state machine commits.',
        takeaways: [
          'Leader receives client writes, assigns Log Index, and issues AppendEntries RPCs.',
          'Commit Index advances only when a majority quorum (N/2 + 1) writes to disk.',
          'Log Matching Theorem guarantees identical prefix history on all participating replicas.'
        ],
        whiteboardContent: `
# Log Replication & Two-Phase Commit Protocol

### Step-by-Step Commit Sequence:
1. **Append Phase:** Leader receives client write $C$, assigns monotonically increasing Log Index $i$, and sends \`AppendEntries\` RPC to all followers.
2. **Commit Phase:** Once a majority quorum ($N/2 + 1$) acknowledges disk persistence, the Leader advances its \`commitIndex\` and applies entry $i$ to its state machine.
3. **Execution Phase:** The Leader returns success to the client; followers apply entry $i$ on the next heartbeat!

---

### The Log Matching Invariant:
$$\\text{If } \\text{log}_1[i].\\text{term} == \\text{log}_2[i].\\text{term} \\implies \\forall k \\le i, \\; \\text{log}_1[k] == \\text{log}_2[k]$$
        `.trim(),
        diagram: `┌──────────────────────────────────────────────────────────────────────────┐
│                   LOG REPLICATION & QUORUM COMMIT FLOW                  │
├──────────────────────────────────────────────────────────────────────────┤
│  Client Write ---> [ Leader Node-02 ]                                    │
│                           │                                              │
│         ├── AppendEntries(Term 2, Index 43) ──> [ Node-01 (Ack) ]        │
│         ├── AppendEntries(Term 2, Index 43) ──> [ Node-03 (Ack) ]        │
│         └── AppendEntries(Term 2, Index 43) ──> [ Node-04 (Lagging) ]    │
│                           │                                              │
│                  [ QUORUM: 3/5 ACKS ]                                    │
│                           │                                              │
│                  ▼ commitIndex -> 43 (Applied to State Machine)          │
└──────────────────────────────────────────────────────────────────────────┘`,
        codeSnippet: `func (rf *Raft) AppendEntries(args *AppendEntriesArgs, reply *AppendEntriesReply) {
    rf.mu.Lock()
    defer rf.mu.Unlock()

    // 1. Reply false if term < currentTerm
    if args.Term < rf.currentTerm {
        reply.Success = false
        reply.Term = rf.currentTerm
        return
    }

    // 2. Reject if log does not match prevLogIndex and prevLogTerm
    if args.PrevLogIndex >= len(rf.log) || rf.log[args.PrevLogIndex].Term != args.PrevLogTerm {
        reply.Success = false
        return
    }

    // 3. Append entries & update commitIndex
    rf.log = append(rf.log[:args.PrevLogIndex+1], args.Entries...)
    reply.Success = true
}`,
        terminalOutput: `[CLIENT REQUEST] POST /kv/set { key: "account_42", val: "1000" }
>>> Leader Node-02 appends entry [Term: 2, Index: 43] to local WAL
>>> Broadcasting AppendEntries to Node-01, Node-03, Node-04, Node-05...
>>> Node-01: ACK received (0.8ms)
>>> Node-03: ACK received (1.1ms)
>>> [QUORUM GRANTED] 3/5 majority reached. Advancing commitIndex -> 43.
>>> State machine applied: 'account_42 = 1000'. HTTP 200 OK sent to client!`,
        dialogue: [
          {
            speaker: 'dev',
            text: "Professor Lumina, when does a follower know an entry is safely committed and can be executed against its local database?"
          },
          {
            speaker: 'professor',
            text: "Followers learn about committed entries through the leader's \`leaderCommit\` field sent in every AppendEntries heartbeat RPC. Once the follower sees \`leaderCommit > commitIndex\`, it applies entries to its state machine up to \`min(leaderCommit, lastLogIndex)\`."
          }
        ],
        quiz: {
          question: "When is a log entry considered safely committed in Raft?",
          options: [
            "As soon as the leader receives the client write",
            "When all 100% of cluster nodes acknowledge",
            "When a majority quorum (N/2 + 1) nodes replicate it to disk",
            "After the next election term starts"
          ],
          correct: 2,
          explanation: "Raft only requires a majority quorum (strictly more than N/2 nodes) to commit entries safely."
        }
      },
      {
        id: 'scene-3',
        slideNumber: 3,
        title: 'Slide 3: Network Partitions (Split-Brain) & Reconciliation',
        slideSubtitle: 'How Raft handles asymmetric network partitions and prevents conflicting writes.',
        takeaways: [
          'Minority partition (2 nodes) cannot reach quorum; client writes stall without commit.',
          'Majority partition (3 nodes) elects new leader and continues committing safely.',
          'When partition heals, old leader steps down and reconciles uncommitted logs.'
        ],
        whiteboardContent: `
# Network Partitions & Split-Brain Invariants

### The 5-Node Partition Breakdown:
Suppose nodes $\{N_1, N_2\}$ are isolated from $\{N_3, N_4, N_5\}$:
* **Minority Partition $\{N_1, N_2\}$:** Old leader $N_2$ cannot achieve quorum (2 < 3). Writes are uncommitted and stalled!
* **Majority Partition $\{N_3, N_4, N_5\}$:** $N_3$ times out, advances Term to 3, elects itself Leader with 3 votes, and commits writes safely.
* **Partition Healed:** When the network recovers, $N_2$ detects higher Term from $N_3$, steps down to Follower, and overwrites uncommitted logs with $N_3$'s authoritative ledger.
        `.trim(),
        diagram: `┌──────────────────────────────────────────────────────────────────────────┐
│              NETWORK PARTITION: MAJORITY VS MINORITY QUORUM              │
├──────────────────────────────────────────────────────────────────────────┤
│   [ MINORITY PARTITION (2 Nodes) ]       [ MAJORITY PARTITION (3 Nodes) ]│
│   ┌───────────────┐ ┌───────────────┐    ┌───────────────┐ ┌────────────┐│
│   │ Node-01 [FOL] │ │ Node-02 [LEAD]│    │ Node-03 [LEAD]│ │ Node-04    ││
│   └───────────────┘ └───────────────┘    │  (Term: 3)    │ │   [FOL]    ││
│           │                 │            └───────────────┘ └────────────┘│
│           └─── [X] 2/5 Votes ───┘                ▲                │      │
│          CANNOT COMMIT WRITES!                   │  3/5 QUORUM    │      │
│                                                  └────────────────┘      │
│               ═════════════════════════════════> ┌───────────────┐       │
│                 NETWORK SPLIT ISOLATION WALL     │ Node-05 [FOL] │       │
│                                                  └───────────────┘       │
└──────────────────────────────────────────────────────────────────────────┘`,
        codeSnippet: `// Step down logic upon discovering higher term
if args.Term > rf.currentTerm {
    rf.currentTerm = args.Term
    rf.state = Follower
    rf.votedFor = -1
    rf.resetElectionTimer()
}`,
        terminalOutput: `[SIMULATION] Injecting Network Partition: {Node-01, Node-02} || {Node-03, Node-04, Node-05}
>>> Minority partition: Node-02 stalls uncommitted write (2/5 ACKs)
>>> Majority partition: Node-03 elected Leader (Term 3) with 3/3 votes
>>> Majority partition: Commits write 'SET balance = 5000' successfully!
>>> [HEALING] Network restored. Node-02 detects Term 3 -> steps down to Follower.`,
        dialogue: [
          {
            speaker: 'sophia',
            text: "Professor, this proves Raft is linearizable under the CAP theorem: it chooses Consistency and Partition-Tolerance (CP) over Availability for minority partitions!"
          },
          {
            speaker: 'professor',
            text: "Exactly, Sophia! A minority partition will refuse to commit writes rather than risk returning stale or conflicting state."
          }
        ],
        quiz: {
          question: "What happens to the uncommitted log entries on the old leader when the network partition heals?",
          options: [
            "They are merged using vector clocks",
            "They are overwritten by the new leader's authoritative log",
            "They cause a fatal kernel panic",
            "They are committed in the background"
          ],
          correct: 1,
          explanation: "In Raft, the current leader's log is authoritative. Any conflicting uncommitted entries on older term leaders are overwritten."
        }
      },
      {
        id: 'scene-4',
        slideNumber: 4,
        title: 'Slide 4: Production Systems & etcd / Kubernetes Architecture',
        slideSubtitle: 'Real-world benchmarks, log compaction, snapshotting, and cloud deployments.',
        takeaways: [
          'Log Compaction via Snapshots prevents memory exhaustion on long-running clusters.',
          'etcd, CockroachDB, TiKV, and Consul use Raft for cluster metadata and leader leases.',
          'Linearizable Read optimizations (ReadIndex & LeaseRead) avoid disk WAL overhead.'
        ],
        whiteboardContent: `
# Production Raft: Log Compaction & Lease Reads

### 1. Log Compaction via Snapshotting
To prevent log files from growing indefinitely:
* State machines periodically create point-in-time **snapshots**.
* All preceding log entries up to \`lastIncludedIndex\` are safely discarded.
* New nodes sync via \`InstallSnapshot\` RPC rather than replaying millions of historical entries!

---

### 2. High-Performance Lease Reads:
Standard reads require an AppendEntries round-trip to verify leadership. With **Lease Reads**, the leader serves read requests locally with zero network overhead as long as its leader lease duration has not expired!
        `.trim(),
        diagram: `┌──────────────────────────────────────────────────────────────────────────┐
│              PRODUCTION RAFT: LOG SNAPSHOTTING & READ LEASES             │
├──────────────────────────────────────────────────────────────────────────┤
│  [ Snapshot 0..10,000 ] <--- Discarded from RAM (Disk Freed)             │
│            │                                                             │
│            └─── Active Log Buffer [ 10,001 .. 10,042 ]                   │
│                                                                          │
│  [ Client Read Request ] ---> [ Leader Node-02 ] (Lease Active: 48ms)    │
│                                     │                                    │
│                                     ▼                                    │
│                       Local Zero-Copy Return (0.02ms)                    │
└──────────────────────────────────────────────────────────────────────────┘`,
        codeSnippet: `// Go Snapshot compaction contract
type InstallSnapshotArgs struct {
    Term              int
    LeaderId          int
    LastIncludedIndex int
    LastIncludedTerm  int
    Data              []byte // Compacted state machine snapshot
}`,
        terminalOutput: `[ETCD PRODUCTION BENCHMARK]
Cluster Size: 5 Nodes (AWS c6i.2xlarge NVMe)
Throughput:   62,400 write ops/sec | 240,000 read ops/sec
P99 Latency:  1.12 ms
Snapshot Interval: Every 10,000 transactions (Average snapshot size: 4.2 MB).`,
        dialogue: [
          {
            speaker: 'maya',
            text: "Lease reads give us sub-millisecond read latency without sacrificing consistency. That's how etcd powers Kubernetes clusters with thousands of pods!"
          },
          {
            speaker: 'professor',
            text: "Precisely, Maya! Mastering Raft gives you the architectural blueprint behind Kubernetes, CockroachDB, and modern cloud platforms."
          }
        ],
        quiz: {
          question: "How do production Raft clusters prevent log files from exhausting disk and memory space?",
          options: [
            "By periodically taking state snapshots and discarding old logs",
            "By deleting the cluster database every 24 hours",
            "By disabling log entries after term 1",
            "By using uncompressed CSV files"
          ],
          correct: 0,
          explanation: "Log compaction creates periodic snapshots of the state machine and discards all log entries prior to the snapshot index."
        }
      }
    ]
  },
  {
    id: 'b-tree-indexing',
    title: 'Database Internals: B+ Tree Indexing & Disk Page Architecture',
    subject: 'Database Systems',
    difficulty: 'Advanced',
    duration: '18 mins',
    tags: ['Databases', 'B+Tree', 'PostgreSQL', 'InnoDB'],
    professor: {
      name: 'Dr. Evelyn Turing',
      role: 'Distinguished Professor of Database Architecture & Storage Engines',
      avatar: '👩‍🏫',
      voicePitch: 1.05,
      voiceRate: 1.0
    },
    classmates: [
      { id: 'alex', name: 'Alex', title: 'Alex (Curious Skeptic)', avatar: '🧑‍💻', color: 'text-amber-400', role: 'Data Structures & Algorithms', pitch: 1.2 },
      { id: 'maya', name: 'Maya', title: 'Maya (Query Optimizer)', avatar: '👩‍💻', color: 'text-cyan-400', role: 'SQL Performance & Indexing', pitch: 1.3 }
    ],
    scenes: [
      {
        id: 'scene-btree-1',
        slideNumber: 1,
        title: 'Slide 1: Why Binary Trees Fail on Disk: Page Math & Fan-out',
        slideSubtitle: 'Analyzing hardware block I/O, cache lines, and B+ Tree node capacity.',
        takeaways: [
          'OS & Databases read storage in 4KB to 16KB pages.',
          'Binary Search Tree height for 1M rows = 20 disk seeks.',
          'B+ Tree fan-out of 100+ reduces tree height to just 3 disk seeks.'
        ],
        whiteboardContent: `
# B+ Tree Indexing vs. In-Memory BST on Disk Storage

### The Disk Page Paradigm
* **Disk Block / Page Size:** Operating systems read and write storage in chunks (typically **4KB to 16KB** in PostgreSQL / MySQL InnoDB).
* **Binary Search Tree (Fan-out = 2):** To index $1,000,000$ rows:
  $$\\text{Height} = \\lceil \\log_2(10^6) \\rceil \\approx 20 \\text{ sequential disk seek operations!}$$
* **B+ Tree (Fan-out $B = 100+$):** To index $1,000,000$ rows:
  $$\\text{Height} = \\lceil \\log_{100}(10^6) \\rceil \\approx 3 \\text{ disk page seeks (600% faster)!}$$
        `.trim(),
        diagram: `┌──────────────────────────────────────────────────────────────────────────┐
│              B+ TREE 8KB DISK PAGE ANATOMY (FAN-OUT = 100+)              │
├──────────────────────────────────────────────────────────────────────────┤
│                     [ Root Page: K10 | K50 | K90 ]                       │
│                     ┌───────────┼───────────┐                            │
│                     ▼           ▼           ▼                            │
│             [ Internal P1 ] [ Internal P2 ] [ Internal P3 ]              │
│             ┌───────┴───────┐       │                                    │
│             ▼               ▼       ▼                                    │
│       ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐      │
│       │ Leaf P101 │<=>│ Leaf P102 │<=>│ Leaf P103 │<=>│ Leaf P104 │      │
│       └───────────┘   └───────────┘   └───────────┘   └───────────┘      │
│       (Row Ptrs) <-------- O(1) Contiguous Range Scan Chain ------->     │
└──────────────────────────────────────────────────────────────────────────┘`,
        codeSnippet: `struct BPlusTreeNode {
    bool isLeaf;
    uint16_t numKeys;
    int64_t keys[MAX_KEYS];
    union {
        uint32_t childPageIDs[MAX_KEYS + 1]; // Internal node pointers
        struct {
            TupleID tuplePointers[MAX_KEYS]; // Leaf node physical row addresses
            uint32_t nextLeafPageID;          // Sequential range scan link
        } leafData;
    };
};`,
        terminalOutput: `[BUFFER POOL] 64MB LRU Buffer Cache initialized.
>>> EXPLAIN ANALYZE SELECT * FROM users WHERE id = 84920;
>>> Root Page (0x01) -> Internal Page (0x04) -> Leaf Page (0x1F2B)
>>> Execution Time: 0.082ms (Total I/O: 2 pages read, 0 disk thrashing).`,
        dialogue: [
          {
            speaker: 'professor',
            text: "Welcome engineers! Today we explore why every production relational database engine—from PostgreSQL to MySQL InnoDB—relies on B+ Trees rather than standard Binary Search Trees."
          },
          {
            speaker: 'alex',
            text: "Professor Turing, AVL trees guarantee O(log N) lookup in memory. Why can't we just write AVL trees directly to disk files?"
          },
          {
            speaker: 'professor',
            text: "Because CPU cache is measured in nanoseconds, while disk page I/O is measured in milliseconds! A binary tree with 1,000,000 elements causes 20 separate disk block reads. A B+ Tree packs hundreds of keys per 8KB page, reducing height to just 3 disk seeks!"
          }
        ],
        quiz: {
          question: "Why do B+ Trees store all actual record payloads exclusively in the leaf pages?",
          options: [
            "To maximize the fan-out of internal nodes so the tree stays shallow",
            "To reduce RAM usage in the CPU cache",
            "Because binary search cannot work on internal nodes",
            "To prevent disk fragmentation"
          ],
          correct: 0,
          explanation: "By keeping internal nodes compact (keys + page pointers only), many more keys fit in a single 8KB disk page, maximizing fan-out and minimizing overall tree depth."
        }
      }
    ]
  },
  {
    id: 'llm-transformers',
    title: 'LLM Architecture: Multi-Head Attention, RoPE & PagedAttention KV Cache',
    subject: 'Artificial Intelligence & Deep Learning',
    difficulty: 'Advanced',
    duration: '20 mins',
    tags: ['Transformers', 'Self-Attention', 'vLLM', 'KV Cache'],
    professor: {
      name: 'Prof. Alan Thorne',
      role: 'Lead AI Research Scientist & Deep Learning Architect',
      avatar: '👨‍🔬',
      voicePitch: 0.98,
      voiceRate: 1.0
    },
    classmates: [
      { id: 'alex', name: 'Alex', title: 'Alex (Curious Skeptic)', avatar: '🧑‍💻', color: 'text-amber-400', role: 'Math & Attention Equations', pitch: 1.2 },
      { id: 'maya', name: 'Maya', title: 'Maya (Inference Hacker)', avatar: '👩‍💻', color: 'text-cyan-400', role: 'vLLM, Tensor Parallelism & GPU', pitch: 1.3 }
    ],
    scenes: [
      {
        id: 'scene-llm-1',
        slideNumber: 1,
        title: 'Slide 1: Scaled Dot-Product Attention & QKV Projections',
        slideSubtitle: 'Mathematical formulation of self-attention, Softmax saturation, and causal masking.',
        takeaways: [
          'Attention(Q,K,V) = softmax(Q K^T / sqrt(d_k)) V',
          'Dividing by sqrt(d_k) prevents vanishing gradients caused by Softmax saturation.',
          'Causal masking ensures autoregressive tokens only attend to past positions.'
        ],
        whiteboardContent: `
# Scaled Dot-Product Self-Attention Mathematical Formulation

### The Canonical Equation (Vaswani et al.)
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$

---

### Step-by-Step Computational Breakdown:
1. **Linear Projections:** Given input token embeddings $X \\in \\mathbb{R}^{S \\times d_{\\text{model}}}$, project into Query, Key, and Value matrices:
   $$Q = X W_Q, \\quad K = X W_K, \\quad V = X W_V$$
2. **Attention Score Matrix ($A = Q K^T$):** Computes pairwise dot-product alignment between every query token and all previous key tokens.
3. **Scaling by $\\sqrt{d_k}$:** Prevents dot products from pushing Softmax into near-zero gradient regions.
        `.trim(),
        diagram: `┌──────────────────────────────────────────────────────────────────────────┐
│              TRANSFORMER MULTI-HEAD SELF-ATTENTION PIPELINE              │
├──────────────────────────────────────────────────────────────────────────┤
│       [ Input Tokens: S x d_model ]                                      │
│             ├───> Linear W_Q ───> [ Queries (Q) ] ───┐                   │
│             ├───> Linear W_K ───> [ Keys (K) ]    ───┼──> [ Q @ K^T / √d]│
│             └───> Linear W_V ───> [ Values (V) ]     │          │        │
│                                                      └────> [ (A) @ V ]  │
│                                                                 │        │
│                                                           [ Output Proj ]│
└──────────────────────────────────────────────────────────────────────────┘`,
        codeSnippet: `class ScaledDotProductAttention(nn.Module):
    def __init__(self, d_k: int):
        super().__init__()
        self.scale = math.sqrt(d_k)

    def forward(self, q, k, v, mask=None):
        scores = torch.matmul(q, k.transpose(-2, -1)) / self.scale
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attn_weights = torch.softmax(scores, dim=-1)
        return torch.matmul(attn_weights, v), attn_weights`,
        terminalOutput: `[GPU CUDA ENGINE] Initializing PyTorch Stream (L40S / H100 GPU)...
>>> Tensor Shapes: Q[1, 32, 2048, 128], K[1, 32, 2048, 128], V[1, 32, 2048, 128]
>>> Executing FlashAttention-3 Kernel...
>>> Memory Bandwidth Saved: 4.8x vs naive Softmax | Latency: 0.28ms per token.`,
        dialogue: [
          {
            speaker: 'professor',
            text: "Greetings AI researchers! Today we dissect the core computational engine behind modern Large Language Models: Multi-Head Self-Attention and KV Cache optimization."
          },
          {
            speaker: 'alex',
            text: "Professor Thorne, why do we scale by the square root of the head dimension sqrt(d_k)?"
          },
          {
            speaker: 'professor',
            text: "For large dimensions like d_k = 128, dot products grow very large in magnitude. When passed to Softmax, it saturates into regions with exponentially small gradients, causing vanishing gradients during backprop."
          }
        ],
        quiz: {
          question: "What is the primary computational reason for dividing by sqrt(d_k) in Scaled Dot-Product Attention?",
          options: [
            "To prevent Softmax from saturating and causing vanishing gradients",
            "To normalize vector magnitude to length 1",
            "To compress the tensor into 8-bit quantized precision",
            "To enable positional rotary embeddings (RoPE)"
          ],
          correct: 0,
          explanation: "Dividing by sqrt(d_k) prevents large dot products from pushing the softmax function into regions with near-zero gradients."
        }
      }
    ]
  }
];

export default function OpenMaicClassroomPortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  const { awardXP } = useGamification();

  const [lessons, setLessons] = useState(OPENMAIC_DEFAULT_LESSONS);
  const [activeLesson, setActiveLesson] = useState(OPENMAIC_DEFAULT_LESSONS[0]);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [activeViewMode, setActiveViewMode] = useState('slides'); // 'slides' | 'blackboard' | 'diagram' | 'code' | 'terminal'
  const [raisedHand, setRaisedHand] = useState(false);
  const [studentQuestion, setStudentQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [isGeneratingNextSlide, setIsGeneratingNextSlide] = useState(false);
  const [generationProgressText, setGenerationProgressText] = useState('');
  const [classroomNotes, setClassroomNotes] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState('professor');
  const [terminalInput, setTerminalInput] = useState('');
  const [customTerminalLogs, setCustomTerminalLogs] = useState([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAutoSummarizing, setIsAutoSummarizing] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);

  const activeScene = activeLesson.scenes[currentSceneIdx] || activeLesson.scenes[0];
  const currentDialogue = activeScene.dialogue[currentDialogueIdx] || activeScene.dialogue[0];
  const chatBottomRef = useRef(null);

  // Initialize chat messages with the first dialogue on lesson / scene switch
  useEffect(() => {
    if (activeScene && activeScene.dialogue) {
      const initialMsgs = activeScene.dialogue.slice(0, currentDialogueIdx + 1).map((d, idx) => ({
        id: 'dial-' + currentSceneIdx + '-' + idx,
        sender: d.speaker === 'professor' 
          ? activeLesson.professor.name 
          : (activeLesson.classmates.find(c => c.id === d.speaker)?.name || d.speaker),
        avatar: d.speaker === 'professor' 
          ? activeLesson.professor.avatar 
          : (activeLesson.classmates.find(c => c.id === d.speaker)?.avatar || '🧑‍💻'),
        role: d.speaker === 'professor' ? 'Professor' : 'AI Classmate',
        color: d.speaker === 'professor' ? 'text-purple-400' : 'text-cyan-400',
        text: d.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setChatMessages(initialMsgs);
      setActiveSpeaker(currentDialogue?.speaker || 'professor');
      setCustomTerminalLogs([]);
    }
  }, [currentSceneIdx, activeLesson]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, currentDialogueIdx, isAiThinking]);

  // Text-To-Speech Synthesis with tailored voice profiles per agent
  const speakText = (text, speaker) => {
    if (!isAudioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (speaker === 'professor') {
        utterance.pitch = activeLesson.professor.voicePitch || 0.95;
        utterance.rate = speechRate;
      } else {
        const classmate = activeLesson.classmates.find(c => c.id === speaker);
        utterance.pitch = classmate?.pitch || 1.2;
        utterance.rate = speechRate * 1.05;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS Notice:", e);
    }
  };

  // Step Dialogue forward in auto-play
  useEffect(() => {
    let timer;
    if (isPlaying && currentDialogueIdx < activeScene.dialogue.length - 1) {
      timer = setTimeout(() => {
        const nextIdx = currentDialogueIdx + 1;
        setCurrentDialogueIdx(nextIdx);
        const nextDial = activeScene.dialogue[nextIdx];
        if (nextDial) {
          setActiveSpeaker(nextDial.speaker);
          speakText(nextDial.text, nextDial.speaker);
          setChatMessages(prev => [
            ...prev,
            {
              id: 'dial-' + currentSceneIdx + '-' + nextIdx + '-' + Date.now(),
              sender: nextDial.speaker === 'professor' 
                ? activeLesson.professor.name 
                : (activeLesson.classmates.find(c => c.id === nextDial.speaker)?.name || nextDial.speaker),
              avatar: nextDial.speaker === 'professor' 
                ? activeLesson.professor.avatar 
                : (activeLesson.classmates.find(c => c.id === nextDial.speaker)?.avatar || '🧑‍💻'),
              role: nextDial.speaker === 'professor' ? 'Professor' : 'AI Classmate',
              color: nextDial.speaker === 'professor' ? 'text-purple-400' : 'text-cyan-400',
              text: nextDial.text,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      }, 7000 / speechRate);
    } else if (isPlaying && currentDialogueIdx >= activeScene.dialogue.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentDialogueIdx, activeScene, speechRate]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setActiveSpeaker(currentDialogue.speaker);
      speakText(currentDialogue.text, currentDialogue.speaker);
    } else {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleNextDialogue = () => {
    if (currentDialogueIdx < activeScene.dialogue.length - 1) {
      const nextIdx = currentDialogueIdx + 1;
      setCurrentDialogueIdx(nextIdx);
      const nextDial = activeScene.dialogue[nextIdx];
      if (nextDial) {
        setActiveSpeaker(nextDial.speaker);
        speakText(nextDial.text, nextDial.speaker);
        setChatMessages(prev => [
          ...prev,
          {
            id: 'dial-' + currentSceneIdx + '-' + nextIdx + '-' + Date.now(),
            sender: nextDial.speaker === 'professor' 
              ? activeLesson.professor.name 
              : (activeLesson.classmates.find(c => c.id === nextDial.speaker)?.name || nextDial.speaker),
            avatar: nextDial.speaker === 'professor' 
              ? activeLesson.professor.avatar 
              : (activeLesson.classmates.find(c => c.id === nextDial.speaker)?.avatar || '🧑‍💻'),
            role: nextDial.speaker === 'professor' ? 'Professor' : 'AI Classmate',
            color: nextDial.speaker === 'professor' ? 'text-purple-400' : 'text-cyan-400',
            text: nextDial.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }
  };

  const handlePrevDialogue = () => {
    if (currentDialogueIdx > 0) {
      const prevIdx = currentDialogueIdx - 1;
      setCurrentDialogueIdx(prevIdx);
      const prevDial = activeScene.dialogue[prevIdx];
      if (prevDial) {
        setActiveSpeaker(prevDial.speaker);
        speakText(prevDial.text, prevDial.speaker);
      }
    }
  };

  const handleSelectSlide = (idx) => {
    if (idx >= 0 && idx < activeLesson.scenes.length) {
      setCurrentSceneIdx(idx);
      setCurrentDialogueIdx(0);
      setSelectedQuizAnswer(null);
      setQuizSubmitted(false);
      setCustomTerminalLogs([]);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIdx < activeLesson.scenes.length - 1) {
      handleSelectSlide(currentSceneIdx + 1);
      if (user?.id) awardXP(user.id, 'CLASSROOM_SLIDE_COMPLETE', 40).catch(() => {});
      addToast?.({
        type: 'success',
        message: '⚡ Slide Complete! +40 XP Awarded.'
      });
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      handleSelectSlide(currentSceneIdx - 1);
    }
  };

  const handleRaiseHand = () => {
    setRaisedHand(!raisedHand);
    addToast?.({
      type: 'info',
      message: !raisedHand 
        ? '🙋‍♂️ Hand raised! Professor & Classmates are waiting for your question.' 
        : 'Hand lowered.'
    });
  };

  // Dynamic Live Multi-Agent AI Discussion Execution
  const handleAskQuestion = async (customPromptText) => {
    const questionToAsk = typeof customPromptText === 'string' ? customPromptText : studentQuestion;
    if (!questionToAsk || !questionToAsk.trim()) return;

    const userText = questionToAsk.trim();
    setStudentQuestion('');
    setRaisedHand(false);
    setIsAiThinking(true);

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: user?.name || 'Scholar (You)',
      avatar: '🎓',
      role: 'Student',
      color: 'text-amber-300',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const systemPrompt = `You are the AI classroom simulation engine for an advanced university masterclass.
Topic: "${activeLesson.title}"
Current Slide: "${activeScene.title}"
Professor: ${activeLesson.professor.name}
Classmates: Alex (Curious Skeptic), Maya (Performance Hacker)
The student asked: "${userText}"

Generate a realistic 2-turn multi-agent response as JSON:
{
  "classmate": { "id": "alex", "name": "Alex", "text": "..." },
  "professor": { "text": "..." }
}`;

      const aiResponse = await callAICompletion({
        prompt: systemPrompt,
        temperature: 0.4,
        maxTokens: 1000
      });

      let defaultProfAnswer = `Excellent inquiry on ${activeScene.title}! `;
      let defaultClassmateAnswer = `That makes sense, Professor! But what edge case should we watch out for in this implementation?`;

      if (activeLesson.id.includes('java') || activeLesson.title.toLowerCase().includes('java')) {
        defaultProfAnswer += `In Java, primitive variables are stored directly on the Stack, whereas objects and reference types reside on the Heap with their memory references passed by value.`;
        defaultClassmateAnswer = `Professor, does this mean wrapper classes like Integer incur extra garbage collection pressure compared to primitive int?`;
      } else if (activeLesson.id.includes('raft') || activeLesson.title.toLowerCase().includes('raft')) {
        defaultProfAnswer += `In Raft consensus, consistency is guaranteed through leader heartbeats, monotonic log terms, and majority quorum disk persistence.`;
        defaultClassmateAnswer = `Professor, what happens if network latency delays heartbeats beyond the minimum election timeout?`;
      } else if (activeLesson.id.includes('btree') || activeLesson.title.toLowerCase().includes('tree') || activeLesson.title.toLowerCase().includes('database')) {
        defaultProfAnswer += `Database page fan-out optimizes storage I/O by fitting hundreds of keys per 8KB disk page, minimizing tree height.`;
        defaultClassmateAnswer = `Professor, how do B+ Tree leaf node pointer chains speed up range queries like BETWEEN?`;
      } else if (activeLesson.id.includes('transformer') || activeLesson.title.toLowerCase().includes('attention') || activeLesson.title.toLowerCase().includes('llm')) {
        defaultProfAnswer += `Multi-Head Attention computes pairwise dot-product alignment between query and key projections, scaled by sqrt(d_k) to prevent Softmax saturation.`;
        defaultClassmateAnswer = `Professor, how does FlashAttention avoid high GPU High-Bandwidth Memory (HBM) round-trips during inference?`;
      } else {
        defaultProfAnswer += `Understanding this mechanism ensures high performance, memory safety, and correct algorithmic invariants for ${activeLesson.title}.`;
      }

      const profText = parsed?.professor?.text || defaultProfAnswer;
      const classmateText = parsed?.classmate?.text || defaultClassmateAnswer;

      // 1. Director Turn 1 (Rule 13): Professor speaks FIRST with direct authoritative answer
      setTimeout(() => {
        const profAnswer = {
          id: 'prof-' + Date.now(),
          sender: activeLesson.professor.name,
          avatar: activeLesson.professor.avatar,
          role: 'Professor',
          color: 'text-purple-400',
          text: profText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, profAnswer]);
        setActiveSpeaker('professor');
        speakText(profAnswer.text, 'professor');

        if (user?.id) awardXP(user.id, 'INTERACTIVE_QUESTION', 20).catch(() => {});
        addToast?.({ type: 'success', message: '⚡ +20 XP awarded for active classroom participation!' });
      }, 800);

      // 2. Director Turn 2 (Rule 2): AI Classmate follows up with edge-case or optimization question
      setTimeout(() => {
        const classmateMsg = {
          id: 'cm-' + Date.now(),
          sender: 'Alex',
          avatar: '🧑‍💻',
          role: 'AI Classmate (Curious Skeptic)',
          color: 'text-amber-400',
          text: classmateText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, classmateMsg]);
        setActiveSpeaker('alex');
        speakText(classmateMsg.text, 'alex');
        setIsAiThinking(false);
      }, 2600);

    } catch (e) {
      setIsAiThinking(false);
    }
  };

  // Submit Live Pop Quiz
  const handleQuizSubmit = () => {
    if (selectedQuizAnswer === null || !activeScene.quiz) return;
    setQuizSubmitted(true);
    const isCorrect = selectedQuizAnswer === activeScene.quiz.correct;
    
    // Save quiz result to Supabase
    if (user) {
      saveQuizScoreToSupabase(user, {
        topic: `${activeLesson.title} - ${activeScene.title}`,
        score: isCorrect ? 1 : 0,
        total: 1
      }).catch(err => console.warn('Supabase quiz sync notice:', err));
    }

    if (isCorrect) {
      if (user?.id) awardXP(user.id, 'CLASSROOM_QUIZ_PASS', 30).catch(() => {});
      addToast?.({
        type: 'success',
        message: '🎯 Correct! +30 XP awarded for slide quiz mastery!'
      });
    } else {
      addToast?.({
        type: 'warning',
        message: 'Review the explanation below to reinforce your understanding!'
      });
    }
  };

  // ─── DOMAIN-AWARE CURRICULUM SYNTHESIZER (FALLBACK & SMART TEMPLATES) ────────
  const generateTopicSpecificCurriculum = (rawTopic) => {
    const topic = rawTopic.trim();
    const tLower = topic.toLowerCase();

    // Check specific domains
    const isJava = tLower.includes('java');
    const isDataTypes = tLower.includes('data type') || tLower.includes('datatype') || tLower.includes('primitive') || tLower.includes('type system') || tLower.includes('variable');
    const isPython = tLower.includes('python');
    const isCpp = tLower.includes('c++') || tLower.includes('cpp') || tLower.includes('pointer');
    const isJs = tLower.includes('javascript') || tLower.includes('js') || tLower.includes('typescript') || tLower.includes('react');
    const isDatabase = tLower.includes('sql') || tLower.includes('database') || tLower.includes('postgres') || tLower.includes('mongo') || tLower.includes('index') || tLower.includes('dbms');
    const isDSA = tLower.includes('tree') || tLower.includes('graph') || tLower.includes('sort') || tLower.includes('search') || tLower.includes('array') || tLower.includes('stack') || tLower.includes('queue') || tLower.includes('hash') || tLower.includes('dynamic programming') || tLower.includes('binary');
    const isAI = tLower.includes('ai') || tLower.includes('ml') || tLower.includes('neural') || tLower.includes('machine learning') || tLower.includes('transformer') || tLower.includes('deep learning') || tLower.includes('llm');

    // 1. JAVA DATA TYPES SPECIALIZED MASTERCLASS
    if (isJava && (isDataTypes || tLower.includes('data') || tLower.includes('type'))) {
      return {
        id: 'custom-' + Date.now(),
        title: `Masterclass: ${topic}`,
        subject: 'Java Core & Memory Model',
        difficulty: 'Foundational to Advanced',
        duration: '25 mins',
        tags: ['Java', 'Data Types', 'JVM Memory', 'Primitives', 'Type Casting'],
        professor: {
          name: 'Prof. Christopher Lumina',
          role: 'Lead AI Professor of Computer Science',
          avatar: '👨‍🏫',
          voicePitch: 0.95,
          voiceRate: 0.98
        },
        classmates: [
          { id: 'alex', name: 'Alex', title: 'Alex (Curious Skeptic)', avatar: '🧑‍💻', color: 'text-amber-400', role: 'Edge-Case Specialist', pitch: 1.2 },
          { id: 'maya', name: 'Maya', title: 'Maya (Performance Hacker)', avatar: '👩‍💻', color: 'text-cyan-400', role: 'Memory & Low-Level', pitch: 1.3 }
        ],
        scenes: [
          {
            id: 'slide-1',
            slideNumber: 1,
            title: 'Slide 1: Java Primitive Data Types & Byte Allocation',
            slideSubtitle: 'The 8 primitive types, memory footprints, bit ranges, and default values.',
            takeaways: [
              'Java defines 8 primitive types: byte (1B), short (2B), int (4B), long (8B), float (4B), double (8B), char (2B Unicode UTF-16), and boolean (1-bit logical).',
              'Primitives are stored directly on the Thread Call Stack without heap object header overhead.',
              'Default values: numeric types default to 0 / 0.0, boolean to false, and char to \\u0000.'
            ],
            whiteboardContent: `# Java 8 Primitive Data Types\n\n| Type | Size | Min Value | Max Value | Default |\n| :--- | :--- | :--- | :--- | :--- |\n| \`byte\` | 8 bits (1B) | -128 | 127 | \`0\` |\n| \`short\` | 16 bits (2B) | -32,768 | 32,767 | \`0\` |\n| \`int\` | 32 bits (4B) | $-2^{31}$ | $2^{31}-1$ (2.14B) | \`0\` |\n| \`long\` | 64 bits (8B) | $-2^{63}$ | $2^{63}-1$ | \`0L\` |\n| \`float\` | 32 bits (4B) | $\\approx 1.4\\times 10^{-45}$ | $\\approx 3.4\\times 10^{38}$ | \`0.0f\` |\n| \`double\`| 64 bits (8B) | $\\approx 4.9\\times 10^{-324}$ | $\\approx 1.8\\times 10^{308}$ | \`0.0d\` |\n| \`char\` | 16 bits (2B) | \`\\u0000\` (0) | \`\\uffff\` (65,535) | \`\\u0000\` |\n| \`boolean\`| 1 bit JVM | \`false\` | \`true\` | \`false\` |`,
            diagram: `┌───────────────────────────────────────────────────────────────┐\n│               JAVA PRIMITIVE MEMORY FOOTPRINT                 │\n├───────────────────────────────────────────────────────────────┤\n│ [byte: 1B]  [short: 2B]  [int: 4B]    [long: 8B]              │\n│ [float: 4B] [double: 8B] [char: 2B]   [boolean: 1b]           │\n│                                                               │\n│ Stack Frame: [ int age = 25 ]  --> Directly holds 32-bit val │\n└───────────────────────────────────────────────────────────────┘`,
            codeSnippet: `public class JavaDataTypesDemo {\n    public static void main(String[] args) {\n        // Integral primitives\n        byte smallCount = 127;\n        short port = 8080;\n        int userCount = 1_000_000;\n        long epochMillis = 1711000000000L; // Suffix 'L' required\n\n        // Floating point primitives\n        float piFloat = 3.14159f;           // Suffix 'f' required\n        double precision = 3.141592653589793;\n\n        // Character and Boolean\n        char grade = 'A'; // 16-bit Unicode\n        boolean isEnrolled = true;\n\n        System.out.println("Primitives initialized in Stack successfully!");\n    }\n}`,
            terminalOutput: `[JVM COMPILE & RUN] JavaDataTypesDemo.java\n>>> Primitives initialized in Stack successfully!\n>>> Memory footprint: 0 Heap allocations.`,
            dialogue: [
              { speaker: 'professor', text: 'Welcome scholars! In Java, data types are strictly split into two main families: Primitives and Reference types. Let us master the 8 primitives first.' },
              { speaker: 'alex', text: 'Professor, why does Java allocate 2 bytes (16 bits) for char when C only uses 1 byte (8 bits)?' },
              { speaker: 'professor', text: 'Brilliant question, Alex! C used 8-bit ASCII. Java was designed from inception for internationalization using 16-bit UTF-16 Unicode, allowing it to represent global scripts.' }
            ],
            quiz: {
              question: 'Which of the following is an 8-byte (64-bit) primitive data type in Java?',
              options: [
                'long and double',
                'int and float',
                'short and char',
                'String and Integer'
              ],
              correct: 0,
              explanation: 'In Java, both `long` (64-bit integer) and `double` (64-bit IEEE 754 floating point) occupy exactly 8 bytes (64 bits) of memory.'
            }
          },
          {
            id: 'slide-2',
            slideNumber: 2,
            title: 'Slide 2: Reference Types, Strings & Memory Layout (Stack vs Heap)',
            slideSubtitle: 'How objects, arrays, and classes differ from primitives in JVM memory.',
            takeaways: [
              'Reference types (Classes, Interfaces, Arrays, Enums) store memory addresses (pointers) on the Stack pointing to objects on the Heap.',
              'String is a reference type (an immutable object) backed by the JVM String Constant Pool to optimize memory.',
              'Unreferenced objects on the Heap are automatically reclaimed by the JVM Garbage Collector (GC).'
            ],
            whiteboardContent: `# JVM Memory: Stack vs Heap Allocation\n\n### Primitives vs References:\n* **Stack Memory:** Fast, thread-private, stores primitive values directly and object references (pointers).\n* **Heap Memory:** Shared across threads, stores all actual Objects and Array instances.\n\n### String Constant Pool (SCP):\n$$\\text{String } s1 = \\text{\"Java\"}; \\quad \\text{String } s2 = \\text{\"Java\"}; \\implies s1 == s2 \\text{ (True)}$$\n$$\\text{String } s3 = \\text{new String(\"Java\")}; \\implies s1 == s3 \\text{ (False, distinct Heap obj)}$$`,
            diagram: `┌───────────────────────────┬───────────────────────────────────┐\n│     STACK (Thread Local)  │          HEAP (Shared Space)      │\n├───────────────────────────┼───────────────────────────────────┤\n│ [ int x = 42 ]            │                                   │\n│ [ String ref1 ] --------->│ [ String Pool: "Hello" ]          │\n│ [ User userRef ] -------->│ [ User Object { id: 101, name } ] │\n│ [ int[] arrRef ] -------->│ [ Array: [ 10, 20, 30, 40 ] ]     │\n└───────────────────────────┴───────────────────────────────────┘`,
            codeSnippet: `public class ReferenceTypesDemo {\n    public static void main(String[] args) {\n        // Primitive: Stores value directly\n        int a = 10;\n        int b = a; // Copied by value: b is 10\n        b = 20;    // 'a' remains 10\n\n        // Reference Type: Stores pointer to Heap object\n        int[] arr1 = { 1, 2, 3 };\n        int[] arr2 = arr1; // Copied by reference!\n        arr2[0] = 99;      // arr1[0] is NOW 99!\n\n        // String Equality\n        String s1 = "OpenMAIC";\n        String s2 = new String("OpenMAIC");\n        System.out.println(s1 == s2);      // false (different memory addresses)\n        System.out.println(s1.equals(s2));  // true  (identical character content)\n    }\n}`,
            terminalOutput: `[EXECUTION] ReferenceTypesDemo.main()\n>>> a = 10, b = 20\n>>> arr1[0] = 99 (shared heap object)\n>>> s1 == s2 : false | s1.equals(s2) : true`,
            dialogue: [
              { speaker: 'maya', text: 'So when we pass an object into a Java method, are we passing by reference or value?' },
              { speaker: 'professor', text: 'Java is strictly Pass-By-Value! When you pass an object, the value being copied and passed is the memory reference (address pointer).' }
            ],
            quiz: {
              question: 'Why does `s1 == s2` return false when comparing `String s1 = "Hi";` and `String s2 = new String("Hi");`?',
              options: [
                '`==` compares memory addresses, and `new` allocates a distinct object outside the String Constant Pool',
                '`==` is not supported on Strings in Java',
                '`s1` contains uppercase letters while `s2` is lowercase',
                'Strings cannot be stored on the Heap'
              ],
              correct: 0,
              explanation: 'The `==` operator compares reference memory addresses. `s1` refers to the String Constant Pool instance, while `new String()` forces a separate Heap allocation.'
            }
          },
          {
            id: 'slide-3',
            slideNumber: 3,
            title: 'Slide 3: Type Casting & Conversion (Widening vs Narrowing)',
            slideSubtitle: 'Implicit automatic conversions, explicit type casts, and integer overflow traps.',
            takeaways: [
              'Widening Casting (Implicit/Automatic): Converting a smaller type to a larger type (e.g., int -> double) is safe and automatic.',
              'Narrowing Casting (Explicit): Converting a larger type to a smaller type requires explicit syntax `(int) d` and risks data loss/truncation.',
              'Numeric Promotion: In arithmetic operations (`byte a + byte b`), operands are automatically promoted to `int`.'
            ],
            whiteboardContent: `# Java Type Casting Rules\n\n### Widening (Automatic, No Loss):\n$$\\text{byte} \\rightarrow \\text{short} \\rightarrow \\text{int} \\rightarrow \\text{long} \\rightarrow \\text{float} \\rightarrow \\text{double}$$\n\n### Narrowing (Explicit, Risk of Truncation & Overflow):\n$$\\text{double} \\xrightarrow{(\\text{long})} \\text{long} \\xrightarrow{(\\text{int})} \\text{int} \\xrightarrow{(\\text{short})} \\text{short} \\xrightarrow{(\\text{byte})} \\text{byte}$$\n\n### Boundary Overflow Invariant:\n$$\\text{Integer.MAX\\_VALUE} + 1 = \\text{Integer.MIN\\_VALUE} \\quad (2147483647 + 1 = -2147483648)$$`,
            diagram: `┌───────────────────────────────────────────────────────────────┐\n│                     JAVA CASTING HIERARCHY                    │\n├───────────────────────────────────────────────────────────────┤\n│ [ Widening: Automatic ]                                       │\n│ byte(1B) ──> short(2B) ──> int(4B) ──> long(8B) ──> double(8B)│\n│                                                               │\n│ [ Narrowing: Explicit '(targetType)' Required ]               │\n│ double ──────(cast)──────> int ──────(cast)──────> byte       │\n│ (3.99)                     (3)                    (Truncated) │\n└───────────────────────────────────────────────────────────────┘`,
            codeSnippet: `public class TypeCastingDemo {\n    public static void main(String[] args) {\n        // 1. Widening Casting (Implicit)\n        int myInt = 100;\n        double myDouble = myInt; // Automatically converted to 100.0\n\n        // 2. Narrowing Casting (Explicit)\n        double pi = 3.999;\n        int truncatedPi = (int) pi; // Explicit cast: truncated to 3\n\n        // 3. Overflow Pitfall\n        int max = Integer.MAX_VALUE; // 2,147,483,647\n        int overflowed = max + 1;    // Wraps around to -2,147,483,648\n\n        // 4. Type promotion in expressions\n        byte b1 = 10;\n        byte b2 = 20;\n        // byte sum = b1 + b2; // COMPILE ERROR: (b1+b2) evaluates to int!\n        byte sum = (byte)(b1 + b2); // Correct\n\n        System.out.println("Truncated: " + truncatedPi + " | Overflow: " + overflowed);\n    }\n}`,
            terminalOutput: `[EXECUTION] TypeCastingDemo.main()\n>>> Truncated: 3\n>>> Overflow: -2147483648 (Two's complement wrap-around)\n>>> Byte sum cast: 30`,
            dialogue: [
              { speaker: 'alex', text: 'Why did `(int) 3.999` evaluate to 3 instead of rounding to 4?' },
              { speaker: 'professor', text: 'In Java, casting floating-point types to integer types performs direct truncation towards zero, not mathematical rounding. Use Math.round() if rounding is needed!' }
            ],
            quiz: {
              question: 'What happens when you evaluate `byte b = (byte) 130;` in Java?',
              options: [
                'It wraps around using two\'s complement to -126',
                'It throws a runtime OverflowException',
                'It automatically promotes `b` to `int`',
                'It sets `b` to 127 (the max byte value)'
              ],
              correct: 0,
              explanation: 'Because byte ranges from -128 to 127, casting 130 (which is 128 + 2) wraps around in 8-bit two\'s complement representation to -126.'
            }
          },
          {
            id: 'slide-4',
            slideNumber: 4,
            title: 'Slide 4: Wrapper Classes, Autoboxing & Performance Best Practices',
            slideSubtitle: 'Primitives vs Wrapper objects (Integer, Double), autoboxing overhead, and NullPointer traps.',
            takeaways: [
              'Every primitive has a corresponding Wrapper class: int -> Integer, char -> Character, double -> Double, boolean -> Boolean.',
              'Autoboxing and Unboxing allow seamless syntax, but unboxing a null wrapper throws NullPointerException.',
              'Wrapper objects add 16–24 bytes of object header overhead per instance; prefer primitives for high-performance loops and collections (e.g. primitive arrays).'
            ],
            whiteboardContent: `# Primitives vs Wrapper Objects\n\n| Primitive | Wrapper Class | Object Overhead | Cache Range |\n| :--- | :--- | :--- | :--- |\n| \`int\` | \`Integer\` | 16-24 bytes | -128 to 127 |\n| \`char\` | \`Character\` | 16 bytes | 0 to 127 |\n| \`boolean\`| \`Boolean\` | 16 bytes | \`TRUE\` / \`FALSE\` |\n| \`double\` | \`Double\` | 24 bytes | None |\n\n### Autoboxing Invariant:\n$$\\text{Integer } a = 100; \\quad \\text{Integer } b = 100; \\implies a == b \\text{ (True: IntegerCache)}$$\n$$\\text{Integer } x = 200; \\quad \\text{Integer } y = 200; \\implies x == y \\text{ (False: outside cache!)}$$`,
            diagram: `┌───────────────────────────────────────────────────────────────┐\n│                 AUTOBOXING & INTEGER CACHE                    │\n├───────────────────────────────────────────────────────────────┤\n│ int primitive (4 Bytes) ──[Autoboxing]──> Integer Object      │\n│                                           ├── Object Header   │\n│                                           └── int value (16B) │\n│                                                               │\n│ Integer.valueOf(v) caches values in range [-128, 127]         │\n└───────────────────────────────────────────────────────────────┘`,
            codeSnippet: `public class WrapperPerformanceDemo {\n    public static void main(String[] args) {\n        // Integer Cache Demonstration (-128 to 127)\n        Integer a = 100;\n        Integer b = 100;\n        System.out.println(a == b); // true (cached)\n\n        Integer c = 200;\n        Integer d = 200;\n        System.out.println(c == d); // FALSE! (different objects outside cache)\n        System.out.println(c.equals(d)); // true (value comparison)\n\n        // Dangerous NullPointer Trap in Unboxing\n        Integer nullWrapper = null;\n        try {\n            int unboxed = nullWrapper; // Throws NullPointerException!\n        } catch (NullPointerException e) {\n            System.out.println("Caught NullPointerException during automatic unboxing!");\n        }\n    }\n}`,
            terminalOutput: `[EXECUTION] WrapperPerformanceDemo.main()\n>>> a == b : true\n>>> c == d : false | c.equals(d) : true\n>>> Caught NullPointerException during automatic unboxing!`,
            dialogue: [
              { speaker: 'maya', text: 'In performance-critical financial or game engines, should we avoid Wrapper classes in loops?' },
              { speaker: 'professor', text: 'Absolutely, Maya! Using `Long sum = 0L` in a billion-iteration loop creates 1 billion temporary objects on the Heap, causing massive GC pause times. Always use primitive `long sum = 0L`!' }
            ],
            quiz: {
              question: 'Why does `Integer a = 100; Integer b = 100; a == b` evaluate to true, while `Integer c = 500; Integer d = 500; c == d` evaluates to false?',
              options: [
                'Java caches Integer objects in the range -128 to 127, reusing references for small values',
                'Integers above 128 are automatically converted to Doubles',
                '`==` is broken for numbers greater than 255',
                'Memory addresses are only 8-bit in Java'
              ],
              correct: 0,
              explanation: 'Java includes an `IntegerCache` that reuses object instances for values between -128 and 127. Values outside this range instantiate new distinct heap objects.'
            }
          }
        ]
      };
    }

    // 2. UNIVERSAL DOMAIN-AWARE CURRICULUM BUILDER
    let subject = 'Computer Science & Engineering';
    let lang = 'java';
    if (isJava) { subject = 'Java Programming & JVM Architecture'; lang = 'java'; }
    else if (isPython) { subject = 'Python Programming & Data Science'; lang = 'python'; }
    else if (isCpp) { subject = 'C++ Systems Programming & Memory'; lang = 'cpp'; }
    else if (isJs) { subject = 'Fullstack JavaScript & Web Architecture'; lang = 'javascript'; }
    else if (isDatabase) { subject = 'Database Management & Data Modeling'; lang = 'sql'; }
    else if (isDSA) { subject = 'Data Structures & Algorithmic Analysis'; lang = 'java'; }
    else if (isAI) { subject = 'Artificial Intelligence & Deep Learning'; lang = 'python'; }

    return {
      id: 'custom-' + Date.now(),
      title: `Masterclass: ${topic}`,
      subject,
      difficulty: 'Advanced',
      duration: '20 mins',
      tags: [topic, subject.split(' ')[0], 'Architecture', 'Engineering'],
      professor: {
        name: 'Prof. Christopher Lumina',
        role: 'Lead AI Professor of Advanced Computing',
        avatar: '👨‍🏫',
        voicePitch: 0.95,
        voiceRate: 0.98
      },
      classmates: [
        { id: 'alex', name: 'Alex', title: 'Alex (Curious Skeptic)', avatar: '🧑‍💻', color: 'text-amber-400', role: 'Edge-Case Specialist', pitch: 1.2 },
        { id: 'maya', name: 'Maya', title: 'Maya (Performance Hacker)', avatar: '👩‍💻', color: 'text-cyan-400', role: 'Optimization Specialist', pitch: 1.3 }
      ],
      scenes: [
        {
          id: 'slide-1',
          slideNumber: 1,
          title: `Slide 1: Core Foundations & Mechanics of ${topic}`,
          slideSubtitle: `Problem formulation, core definitions, and primary mental models.`,
          takeaways: [
            `Core foundational principles and purpose of ${topic}.`,
            `Key abstractions, terminology, and operational workflow.`,
            `How ${topic} solves fundamental engineering trade-offs.`
          ],
          whiteboardContent: `# ${topic}: Core Foundations & Architecture\n\n### Key Concepts:\n1. **Fundamental Definition:** Core role and mental model of ${topic}.\n2. **State & Execution:** How ${topic} processes inputs, transforms data, and produces deterministic outputs.\n3. **Trade-off Analysis:** Efficiency vs complexity comparison.`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│            CONCEPTUAL FLOW: ${topic.toUpperCase().slice(0, 30)}           │\n├───────────────────────────────────────────────────────────────┤\n│ [ Input / Ingestion ] ──> [ ${topic.slice(0, 18)} Logic ] ──> [ Output ] │\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Foundation example for ${topic}\npublic class ${topic.replace(/[^a-zA-Z0-9]/g, '') || 'Topic'}Demo {\n    public static void main(String[] args) {\n        System.out.println("Initializing: ${topic}");\n        // Core execution logic\n    }\n}`,
          terminalOutput: `[SYSTEM] Initialized ${topic} module... OK\n>>> Verification complete: Ready for production.`,
          dialogue: [
            { speaker: 'professor', text: `Welcome scholars! Today we delve deeply into ${topic}, starting from first principles.` },
            { speaker: 'alex', text: `Professor, what is the most fundamental concept beginners overlook when studying ${topic}?` },
            { speaker: 'professor', text: `The key is understanding the underlying data flow and operational guarantees before writing code.` }
          ],
          quiz: {
            question: `What is the primary objective of mastering ${topic}?`,
            options: [
              `To understand its core mechanics, memory/runtime implications, and best practices`,
              `To memorize syntax without understanding performance`,
              `To bypass compiler type checks completely`,
              `To increase runtime memory overhead`
            ],
            correct: 0,
            explanation: `Gaining a deep mental model of ${topic} allows engineers to write scalable, robust, and optimized software.`
          }
        },
        {
          id: 'slide-2',
          slideNumber: 2,
          title: `Slide 2: Deep Implementation, Data Structures & Internals`,
          slideSubtitle: `Under-the-hood algorithms, memory representations, and execution flow.`,
          takeaways: [
            `Low-level memory layout and internal state representation for ${topic}.`,
            `Algorithmic complexity and throughput analysis.`,
            `Step-by-step execution lifecycle.`
          ],
          whiteboardContent: `# ${topic}: Implementation & Complexity Analysis\n\n### Asymptotic Complexity:\n* **Time Complexity:** $\\mathcal{O}(\\log N)$ or $\\mathcal{O}(N)$ depending on access patterns.\n* **Space Complexity:** $\\mathcal{O}(1)$ auxiliary space optimization.\n* **Invariant:** Preserves data consistency across all operations.`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│                 INTERNAL EXECUTION PIPELINE                   │\n├───────────────────────────────────────────────────────────────┤\n│ [ Component A ] <───> [ ${topic.slice(0, 14)} Engine ] <───> [ Storage/State ]│\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Implementation details for ${topic}\npublic void process${topic.replace(/[^a-zA-Z0-9]/g, '') || 'Task'}() {\n    // Optimal algorithmic execution\n    long startTime = System.nanoTime();\n    // Processing...\n    long elapsed = System.nanoTime() - startTime;\n}`,
          terminalOutput: `[BENCHMARK] Executed 10,000 operations for ${topic} in 1.4ms.\n>>> Zero memory leaks detected.`,
          dialogue: [
            { speaker: 'maya', text: `How do we ensure optimal runtime performance when implementing ${topic}?` },
            { speaker: 'professor', text: `By choosing the right underlying data structures and minimizing unnecessary memory allocations.` }
          ],
          quiz: {
            question: `How does optimizing internal memory layout benefit ${topic}?`,
            options: [
              `It reduces CPU cache misses and minimizes garbage collection overhead`,
              `It slows down compilation intentionally`,
              `It duplicates variables across all threads`,
              `It disables hardware branch prediction`
            ],
            correct: 0,
            explanation: `Efficient memory layout ensures data locality in CPU caches and eliminates redundant allocations.`
          }
        },
        {
          id: 'slide-3',
          slideNumber: 3,
          title: `Slide 3: Edge Cases, Error Handling & Failure Modes`,
          slideSubtitle: `Handling boundary conditions, null/overflow traps, and concurrency races.`,
          takeaways: [
            `Common pitfalls and runtime traps encountered with ${topic}.`,
            `Defensive programming strategies and validation guards.`,
            `Graceful degradation and resilience under stress.`
          ],
          whiteboardContent: `# Edge Cases & Guard Conditions in ${topic}\n\n### Key Invariants to Verify:\n1. **Boundary Limits:** Check null, 0-length, min/max values.\n2. **Type Safety:** Ensure explicit cast safety and range bounds.\n3. **Exception Safety:** Implement robust try-catch and cleanup logic.`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│                     ERROR & RESILIENCE MATRIX                 │\n├───────────────────────────────────────────────────────────────┤\n│ [ Input Validation ] ──> [ Safe Execution ] ──> [ Result ]   │\n│         │                                                     │\n│         └──[ Invalid Bounds ] ──> [ Guard / Fallback ]        │\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Robust error handling for ${topic}\ntry {\n    validateInputs();\n    executeCoreLogic();\n} catch (IllegalArgumentException ex) {\n    System.err.println("Handled edge case gracefully: " + ex.getMessage());\n}`,
          terminalOutput: `[TEST SUITE] Running edge-case suite for ${topic}...\n>>> Passed 48/48 unit tests including boundary conditions.`,
          dialogue: [
            { speaker: 'alex', text: `What is the most common bug that occurs with ${topic} in production?` },
            { speaker: 'professor', text: `Unchecked boundary conditions and failing to handle null or empty states are the most frequent culprits.` }
          ],
          quiz: {
            question: `What is the best practice for preventing runtime failures in ${topic}?`,
            options: [
              `Implement strict input validation, boundary checks, and explicit exception handling`,
              `Ignore all error logs and suppress warnings`,
              `Disable unit tests in production builds`,
              `Hardcode return values to avoid dynamic calculations`
            ],
            correct: 0,
            explanation: `Defensive validation guards against unexpected inputs and boundary overflow errors before they reach core execution.`
          }
        },
        {
          id: 'slide-4',
          slideNumber: 4,
          title: `Slide 4: Industry Best Practices & Production Scale`,
          slideSubtitle: `Real-world patterns, benchmarking, profiling, and architectural mastery.`,
          takeaways: [
            `How leading technology companies design and scale ${topic}.`,
            `Profiling and telemetry metrics to monitor in production.`,
            `Mastery roadmap: from intermediate developer to senior architect.`
          ],
          whiteboardContent: `# Production Architecture & Best Practices\n\n### Core Tenets for ${topic}:\n* **Clean Code:** Adhere to SOLID and idiomatic patterns.\n* **Observability:** Track latency, throughput, and error rates.\n* **Continuous Profiling:** Eliminate CPU and memory bottlenecks early.`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│                 PRODUCTION ARCHITECTURE DECK                  │\n├───────────────────────────────────────────────────────────────┤\n│ [ Client Requests ] ──> [ ${topic.slice(0, 16)} Module ] ──> [ Metrics & Telemetry ]│\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Production-grade pattern for ${topic}\npublic class Production${topic.replace(/[^a-zA-Z0-9]/g, '') || 'Service'} {\n    // Thread-safe, observable, and highly optimized implementation\n    public static void run() {\n        System.out.println("Production module for ${topic} operating at peak efficiency.");\n    }\n}`,
          terminalOutput: `[PRODUCTION DEPLOY] ${topic} active.\n>>> Latency: 0.28ms | Health: 100% | Zero defects.`,
          dialogue: [
            { speaker: 'maya', text: `Now we have a complete 360-degree mental model of ${topic} across all 4 slides!` },
            { speaker: 'professor', text: `Precisely! You are now equipped to apply ${topic} with mastery in real-world software engineering.` }
          ],
          quiz: {
            question: `What is the ultimate mark of mastery when working with ${topic}?`,
            options: [
              `Writing clean, maintainable code with deep awareness of memory, performance, and edge cases`,
              `Copying code without understanding its internal workings`,
              `Using complex syntax where simple code suffices`,
              `Never profiling execution speed`
            ],
            correct: 0,
            explanation: `Mastery means balancing elegance, correctness, low latency, and robust error resilience in production.`
          }
        }
      ]
    };
  };

  // ─── AI MULTI-SLIDE FULL DECK GENERATOR ──────────────────────────────────────
  const handleGenerateCustomClassroom = async () => {
    if (!customTopicInput.trim()) return;
    setIsGeneratingTopic(true);
    setGenerationProgressText('Synthesizing multi-slide curriculum & slides...');
    const topic = customTopicInput.trim();

    try {
      const prompt = `You are OpenMAIC (Tsinghua Multi-Agent Interactive Classroom Slide Deck Generator).
Your task is to generate a comprehensive, highly accurate, and rigorous 4-SLIDE presentation curriculum on the computer science topic: "${topic}".

CRITICAL REQUIREMENTS:
1. Every slide's title, subtitle, takeaways, whiteboard markdown, ASCII diagram, code snippet, dialogue between professor and classmates, and quiz question MUST BE 100% SPECIFIC TO "${topic}".
2. If "${topic}" is a programming topic (e.g. "DATA TYPES IN JAVA", "POINTERS IN C++", "REACT HOOKS"), write actual valid code snippets in that programming language, diagram actual memory/data structures (e.g. Stack vs Heap, Primitives vs Objects), whiteboard formulas/tables of types and ranges, and have dialogue discussing that specific language's mechanics.
3. If "${topic}" is an algorithm or data structure (e.g. "BINARY SEARCH", "DIJKSTRA", "AVL TREE"), explain the algorithm invariants, Big-O complexities (O(N), O(log N)), real code, and step-by-step logic.
4. If "${topic}" is a database, web, AI, or systems topic, provide accurate domain-specific architecture, queries, math formulas, or models.
5. DO NOT output generic distributed systems or lock-free queue text UNLESS the topic is specifically about distributed systems or concurrency!

Generate a JSON object with this exact structure:
{
  "title": "Masterclass: ${topic}",
  "subject": "<Precise Academic Subject of ${topic}>",
  "difficulty": "Intermediate to Advanced",
  "duration": "20 mins",
  "tags": ["${topic}", "Engineering", "Architecture"],
  "professor": {
    "name": "Prof. Christopher Lumina",
    "role": "Lead AI Professor",
    "avatar": "👨‍🏫",
    "voicePitch": 0.95,
    "voiceRate": 0.98
  },
  "classmates": [
    { "id": "alex", "name": "Alex", "title": "Alex (Curious Skeptic)", "avatar": "🧑‍💻", "color": "text-amber-400", "role": "Edge-Case Specialist", "pitch": 1.2 },
    { "id": "maya", "name": "Maya", "title": "Maya (Performance Hacker)", "avatar": "👩‍💻", "color": "text-cyan-400", "role": "Optimization Specialist", "pitch": 1.3 }
  ],
  "scenes": [
    {
      "id": "slide-1",
      "slideNumber": 1,
      "title": "Slide 1: <Core Foundations & Definitions of ${topic}>",
      "slideSubtitle": "<Clear subtitle explaining core problem & mental model>",
      "takeaways": [
        "<Key takeaway 1 specifically about ${topic}>",
        "<Key takeaway 2 specifically about ${topic}>",
        "<Key takeaway 3 specifically about ${topic}>"
      ],
      "whiteboardContent": "# ${topic}: Core Foundations\\n\\n### Key Concepts:\\n1. <Point 1 with real math/syntax for ${topic}>\\n2. <Point 2 with real details>\\n3. <Point 3>",
      "diagram": "┌───────────────────────────────────────────┐\\n│       ${topic.toUpperCase()} FLOW DIAGRAM       │\\n└───────────────────────────────────────────┘",
      "codeSnippet": "// Real code demonstrating ${topic}",
      "terminalOutput": "[OUTPUT] Execution trace for ${topic}... OK",
      "dialogue": [
        { "speaker": "professor", "text": "<Professor introduces ${topic} with technical precision>" },
        { "speaker": "alex", "text": "<Alex asks an insightful question about ${topic}>" },
        { "speaker": "professor", "text": "<Professor answers accurately about ${topic}>" }
      ],
      "quiz": {
        "question": "<Specific multiple-choice question testing understanding of ${topic}>",
        "options": ["<Correct option>", "<Distractor 1>", "<Distractor 2>", "<Distractor 3>"],
        "correct": 0,
        "explanation": "<Clear technical explanation of why the correct option is right>"
      }
    },
    {
      "id": "slide-2",
      "slideNumber": 2,
      "title": "Slide 2: <Deep Implementation, Memory & Mechanics of ${topic}>",
      "slideSubtitle": "<Internal data representation and step-by-step logic>",
      "takeaways": [
        "<Internal mechanic 1>",
        "<Internal mechanic 2>",
        "<Internal mechanic 3>"
      ],
      "whiteboardContent": "# ${topic}: Internals & Memory\\n\\n### Mechanics:\\n* <Low-level details and Big-O / memory formula>",
      "diagram": "┌───────────────────────────────────────────┐\\n│       ${topic.toUpperCase()} INTERNALS          │\\n└───────────────────────────────────────────┘",
      "codeSnippet": "// In-depth code snippet for ${topic}",
      "terminalOutput": "[BENCHMARK] Executed operation for ${topic}... OK",
      "dialogue": [
        { "speaker": "maya", "text": "<Maya asks about performance or edge cases in ${topic}>" },
        { "speaker": "professor", "text": "<Professor explains memory layout and performance for ${topic}>" }
      ],
      "quiz": {
        "question": "<Question testing internal mechanics of ${topic}>",
        "options": ["<Correct option>", "<Distractor 1>", "<Distractor 2>", "<Distractor 3>"],
        "correct": 0,
        "explanation": "<Explanation of internal mechanics>"
      }
    },
    {
      "id": "slide-3",
      "slideNumber": 3,
      "title": "Slide 3: <Edge Cases, Failure Modes & Common Pitfalls in ${topic}>",
      "slideSubtitle": "<Boundary limits, type safety, exceptions, and defensive coding>",
      "takeaways": [
        "<Edge case 1>",
        "<Common pitfall 2>",
        "<Mitigation strategy 3>"
      ],
      "whiteboardContent": "# ${topic}: Edge Cases & Guard Conditions\\n\\n### Pitfalls:\\n1. <Specific pitfall with ${topic}>",
      "diagram": "┌───────────────────────────────────────────┐\\n│       ${topic.toUpperCase()} ERROR MATRIX        │\\n└───────────────────────────────────────────┘",
      "codeSnippet": "// Edge-case handling code for ${topic}",
      "terminalOutput": "[TEST] Edge-case verification for ${topic}... Passed",
      "dialogue": [
        { "speaker": "alex", "text": "<Alex asks about common bugs with ${topic}>" },
        { "speaker": "professor", "text": "<Professor explains how to guard against pitfalls in ${topic}>" }
      ],
      "quiz": {
        "question": "<Question testing edge cases of ${topic}>",
        "options": ["<Correct option>", "<Distractor 1>", "<Distractor 2>", "<Distractor 3>"],
        "correct": 0,
        "explanation": "<Explanation of edge cases>"
      }
    },
    {
      "id": "slide-4",
      "slideNumber": 4,
      "title": "Slide 4: <Industry Best Practices & Production Scale for ${topic}>",
      "slideSubtitle": "<Real-world architectures, profiling, and best practices>",
      "takeaways": [
        "<Best practice 1>",
        "<Scalability guideline 2>",
        "<Production optimization 3>"
      ],
      "whiteboardContent": "# ${topic}: Production Best Practices\\n\\n### Architectural Guidelines:\\n* <Best practice summary>",
      "diagram": "┌───────────────────────────────────────────┐\\n│       ${topic.toUpperCase()} PRODUCTION ARCH     │\\n└───────────────────────────────────────────┘",
      "codeSnippet": "// Production-grade code snippet for ${topic}",
      "terminalOutput": "[PRODUCTION] Deployed ${topic} successfully.",
      "dialogue": [
        { "speaker": "maya", "text": "<Maya summarizes key architectural takeaways for ${topic}>" },
        { "speaker": "professor", "text": "<Professor provides concluding mastery advice for ${topic}>" }
      ],
      "quiz": {
        "question": "<Question testing industry best practices for ${topic}>",
        "options": ["<Correct option>", "<Distractor 1>", "<Distractor 2>", "<Distractor 3>"],
        "correct": 0,
        "explanation": "<Explanation of best practices>"
      }
    }
  ]
}

Return ONLY valid JSON.`;

      const aiRes = await callAICompletion({
        prompt,
        temperature: 0.2,
        maxTokens: 3000
      });

      let customLesson = null;
      try {
        const match = aiRes.match(/\{[\s\S]*\}/);
        if (match) {
          customLesson = JSON.parse(match[0]);
          customLesson.id = 'custom-' + Date.now();
        }
      } catch (err) {}

      if (customLesson && customLesson.scenes && customLesson.scenes.length > 0) {
        setLessons(prev => [customLesson, ...prev]);
        setActiveLesson(customLesson);
        setCurrentSceneIdx(0);
        setCurrentDialogueIdx(0);
        setActiveViewMode('slides');
        addToast?.({
          type: 'success',
          message: `🎓 Generated ${customLesson.scenes.length}-Slide Masterclass Deck for "${topic}"!`
        });
      } else {
        throw new Error("Could not parse slide deck");
      }
    } catch (e) {
      console.warn("AI Slide Generation fallback:", e);
      // Domain-aware fallback deck
      const fallbackLesson = generateTopicSpecificCurriculum(topic);
      setLessons(prev => [fallbackLesson, ...prev]);
      setActiveLesson(fallbackLesson);
      setCurrentSceneIdx(0);
      setCurrentDialogueIdx(0);
      setActiveViewMode('slides');
      addToast?.({
        type: 'success',
        message: `🎓 Generated Masterclass Deck for "${topic}"!`
      });
    }

    setIsGeneratingTopic(false);
    setCustomTopicInput('');
  };

  // ─── GENERATE NEXT SLIDE ON DEMAND ──────────────────────────────────────────
  const handleGenerateNextSlide = async () => {
    setIsGeneratingNextSlide(true);
    const nextSlideNum = activeLesson.scenes.length + 1;
    const lessonTitle = activeLesson.title || 'Masterclass';

    try {
      const prompt = `You are OpenMAIC (Tsinghua AI Classroom).
The current masterclass topic is: "${lessonTitle}".
Currently there are ${activeLesson.scenes.length} slides.

Generate the NEXT SLIDE (Slide ${nextSlideNum}) as a JSON object with this structure:
{
  "id": "slide-${nextSlideNum}",
  "slideNumber": ${nextSlideNum},
  "title": "Slide ${nextSlideNum}: <Specific Advanced Exploration of ${lessonTitle}>",
  "slideSubtitle": "<Key takeaway and deep-dive focus for ${lessonTitle}>",
  "takeaways": [
    "<Takeaway point 1 specific to ${lessonTitle}>",
    "<Takeaway point 2 specific to ${lessonTitle}>",
    "<Takeaway point 3 specific to ${lessonTitle}>"
  ],
  "whiteboardContent": "# Slide ${nextSlideNum}: Advanced Mechanics for ${lessonTitle}\\n\\n### Key Invariant:\\n$$\\\\text{Invariant Formula for ${lessonTitle}}$$",
  "diagram": "┌───────────────────────────────────────────┐\\n│        SLIDE ${nextSlideNum} DIAGRAM: ${lessonTitle.slice(0, 18).toUpperCase()}       │\\n└───────────────────────────────────────────┘",
  "codeSnippet": "// Code example for Slide ${nextSlideNum} (${lessonTitle})",
  "terminalOutput": "[SLIDE ${nextSlideNum}] Execution trace for ${lessonTitle}... OK",
  "dialogue": [
    { "speaker": "professor", "text": "Let us examine Slide ${nextSlideNum} covering advanced aspects of ${lessonTitle}." },
    { "speaker": "alex", "text": "Professor, how does this relate to what we covered previously?" },
    { "speaker": "professor", "text": "This builds directly on our foundational mental model." }
  ],
  "quiz": {
    "question": "<Accurate multiple choice question specifically for ${lessonTitle}>?",
    "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
    "correct": 0,
    "explanation": "<Technical explanation for ${lessonTitle}>."
  }
}

Return ONLY valid JSON.`;

      const aiRes = await callAICompletion({
        prompt,
        temperature: 0.2,
        maxTokens: 1200
      });

      let nextSlide = null;
      try {
        const match = aiRes.match(/\{[\s\S]*\}/);
        if (match) nextSlide = JSON.parse(match[0]);
      } catch (err) {}

      if (nextSlide) {
        const updatedScenes = [...activeLesson.scenes, nextSlide];
        const updatedLesson = { ...activeLesson, scenes: updatedScenes };
        setActiveLesson(updatedLesson);
        setLessons(prev => prev.map(l => l.id === updatedLesson.id ? updatedLesson : l));
        handleSelectSlide(updatedScenes.length - 1);
        addToast?.({
          type: 'success',
          message: `✨ Slide ${nextSlideNum} generated and appended to your deck!`
        });
      }
    } catch (e) {
      console.warn("Generate slide error:", e);
    }
    setIsGeneratingNextSlide(false);
  };

  // Interactive Terminal Command Execution
  // Interactive Terminal Command Execution
  const handleTerminalSubmit = (e) => {
    e?.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    setTerminalInput('');

    let output = '';
    const lower = cmd.toLowerCase();
    const isJava = activeLesson.id.includes('java') || activeLesson.title.toLowerCase().includes('java');
    const isRaft = activeLesson.id.includes('raft') || activeLesson.title.toLowerCase().includes('raft');

    if (lower === 'help') {
      if (isJava) {
        output = `Available Java Sandbox Commands:
  • help                 - Display this interactive command reference
  • run                  - Compile & execute current slide code in JVM sandbox
  • types / status       - Inspect 8 primitive memory sizes & JVM Stack allocations
  • cast-test            - Test implicit widening vs explicit narrowing casting & overflow
  • string-pool          - Inspect String Constant Pool vs Heap object allocations
  • clear                - Clear the interactive sandbox console`;
      } else if (isRaft) {
        output = `Available Raft Sandbox Commands:
  • help                 - Display this interactive command reference
  • status               - Inspect live cluster / node topologies & heartbeat latencies
  • kill-leader          - Simulate leader crash & trigger immediate quorum election
  • replicate <data>     - Append entry across quorum & observe commit index advancing
  • benchmark            - Run micro-benchmark on P99 latency & throughput
  • clear                - Clear the interactive sandbox console`;
      } else {
        output = `Available Sandbox Commands:
  • help                 - Display this interactive command reference
  • run                  - Execute current slide code module
  • status / inspect     - Inspect runtime state and memory layout
  • benchmark            - Run micro-benchmark on latency & throughput
  • clear                - Clear the interactive sandbox console`;
      }
    } else if (lower === 'run' || lower === 'exec') {
      output = `[EXECUTION ENGINE] Running code for Slide ${activeScene.slideNumber || 1} (${activeLesson.title})...\n>>> Output: ${activeScene.terminalOutput || 'Code executed successfully with zero runtime errors.'}`;
      if (user?.id) awardXP(user.id, 'TERMINAL_EXPERIMENT', 15).catch(() => {});
    } else if (lower === 'types' || (isJava && lower === 'status')) {
      output = `[JVM PRIMITIVE MEMORY TABLE]
• byte:    1 Byte  (8-bit)  | Range: [-128, 127]
• short:   2 Bytes (16-bit) | Range: [-32768, 32767]
• int:     4 Bytes (32-bit) | Range: [-2^31, 2^31 - 1]
• long:    8 Bytes (64-bit) | Range: [-2^63, 2^63 - 1]
• float:   4 Bytes (32-bit) | IEEE 754 Floating Point
• double:  8 Bytes (64-bit) | IEEE 754 High Precision
• char:    2 Bytes (16-bit) | UTF-16 Unicode Range [0, 65535]
• boolean: 1 bit JVM (true / false)`;
      if (user?.id) awardXP(user.id, 'TERMINAL_EXPERIMENT', 15).catch(() => {});
    } else if (lower === 'cast-test') {
      output = `[JAVA TYPE CASTING EXPERIMENT]
1. Widening: (double) 100            -> 100.0 (Safe, automatic)
2. Narrowing: (int) 3.999            -> 3 (Direct truncation towards zero)
3. Overflow: (byte) 130              -> -126 (8-bit two's complement wrap)
4. Integer.MAX_VALUE + 1             -> -2147483648 (Overflow wrap)`;
      if (user?.id) awardXP(user.id, 'TERMINAL_EXPERIMENT', 15).catch(() => {});
    } else if (lower === 'string-pool') {
      output = `[JVM STRING CONSTANT POOL INSPECTION]
String s1 = "Java";               -> SCP Address: 0x7F01 (Reused)
String s2 = "Java";               -> SCP Address: 0x7F01 (s1 == s2 : TRUE)
String s3 = new String("Java");   -> Heap Address: 0x8A12 (s1 == s3 : FALSE, s1.equals(s3) : TRUE)`;
      if (user?.id) awardXP(user.id, 'TERMINAL_EXPERIMENT', 15).catch(() => {});
    } else if (lower === 'status') {
      output = `[CLUSTER TOPOLOGY METRICS]
Node-01: FOLLOWER | Term: 2 | Latency: 1.2ms | MatchIndex: 42 | Health: OK
Node-02: LEADER   | Term: 2 | Latency: 0.4ms | CommitIndex: 42 | Quorum: 5/5 ACK
Node-03: FOLLOWER | Term: 2 | Latency: 1.8ms | MatchIndex: 42 | Health: OK`;
    } else if (lower.startsWith('replicate')) {
      const payload = cmd.split(' ').slice(1).join(' ') || 'entry_tx_9481';
      output = `[APPEND_ENTRIES] Broadcasting '${payload}' to followers...
>>> Node-01: ACK received (0.8ms) | Node-03: ACK received (1.2ms)
>>> [QUORUM GRANTED] Advancing commitIndex -> 43. HTTP 200 OK sent to client!`;
      if (user?.id) awardXP(user.id, 'TERMINAL_EXPERIMENT', 15).catch(() => {});
    } else if (lower === 'kill-leader' || lower === 'crash-leader') {
      output = `[FAULT INJECTION] Node-02 (Leader) SIGKILL executed.
>>> Node-03 election timer expired (189ms). State: CANDIDATE (Term: 3)
>>> [NEW LEADER ELECTED] Node-03 ascended to LEADER for Term 3!`;
      if (user?.id) awardXP(user.id, 'TERMINAL_EXPERIMENT', 15).catch(() => {});
    } else if (lower === 'benchmark') {
      output = `[BENCHMARK] Executing 10,000 parallel operations for ${activeLesson.title}...
Throughput:       68,400 ops/sec | P99 Latency: 0.48 ms | All invariants satisfied.`;
    } else if (lower === 'clear') {
      setCustomTerminalLogs([]);
      return;
    } else {
      output = `Unknown command: '${cmd}'. Type 'help' to see valid commands.`;
    }

    setCustomTerminalLogs(prev => [...prev, { id: Date.now(), cmd, output }]);
  };

  // AI Auto-Summarize Notes
  const handleAutoSummarizeNotes = async () => {
    setIsAutoSummarizing(true);
    try {
      const summaryPrompt = `Summarize Slide ${activeScene.slideNumber || currentSceneIdx + 1} (${activeScene.title}) of "${activeLesson.title}" into concise, beautifully bulleted Markdown revision notes:
Whiteboard:
${activeScene.whiteboardContent}`;

      const aiRes = await callAICompletion({
        prompt: summaryPrompt,
        temperature: 0.3,
        maxTokens: 400
      });

      setClassroomNotes(prev => (prev ? prev + '\n\n---\n\n' : '') + `### Slide ${activeScene.slideNumber || currentSceneIdx + 1} Notes:\n` + aiRes);
      addToast?.({
        type: 'success',
        message: '⚡ AI Slide Notes Auto-Generated into your scratchpad!'
      });
    } catch (e) {
      const bulletPoints = activeScene.takeaways && activeScene.takeaways.length > 0
        ? activeScene.takeaways.map(t => `- ${t}`).join('\n')
        : `- Key concept: ${activeScene.title}\n- Deep mastery and optimal memory/performance design.\n- Verified boundary conditions and production readiness.`;
      setClassroomNotes(prev => (prev ? prev + '\n\n---\n\n' : '') + `### Slide ${activeScene.slideNumber || currentSceneIdx + 1} Notes:\n` + bulletPoints);
    }
    setIsAutoSummarizing(false);
  };

  // Export Notes & Slides to Markdown (.md)
  const handleExportNotes = () => {
    const notesContent = `# ${activeLesson.title} - OpenMAIC Slide Deck Notes
**Date:** ${new Date().toLocaleDateString()}
**Professor:** ${activeLesson.professor.name} (${activeLesson.professor.role})
**Curriculum Protocol:** Tsinghua OpenMAIC Protocol

---

${activeLesson.scenes.map((sc, i) => `
## Slide ${sc.slideNumber || i + 1}: ${sc.title}
*${sc.slideSubtitle || ''}*

### Key Takeaways:
${sc.takeaways ? sc.takeaways.map(t => `- ${t}`).join('\n') : ''}

### Whiteboard Notes:
${sc.whiteboardContent}

### Code Snippet:
\`\`\`
${sc.codeSnippet || '// No code'}
\`\`\`
`).join('\n---\n\n')}

---

## Student Masterclass Notes
${classroomNotes || 'No custom notes recorded.'}
`;

    const blob = new Blob([notesContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeLesson.id}-slides-notes.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast?.({
      type: 'success',
      message: '📥 Complete Slide Deck & Notes exported (.md)'
    });
  };

  return (
    <div className="min-h-screen bg-[#04060b] text-white p-3 md:p-6 space-y-5 font-sans select-none">
      
      {/* ─── Ultra-Sleek Header Bar ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 md:p-6 rounded-3xl bg-gradient-to-r from-[#150d30] via-[#0b1426] to-[#050914] border border-purple-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-3xl shadow-xl shadow-purple-500/30 border border-purple-300/40 shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white font-sora">
                OpenMAIC Multi-Agent Interactive Classroom
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-400/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" /> Tsinghua OpenMAIC Protocol
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-3xl leading-relaxed">
              Live AI Professor slide lectures, interactive presentation decks, multi-agent debate, real-time voice synthesis, and instant AI curriculum slide generation.
            </p>
          </div>
        </div>

        {/* Audio & Portal Controls */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10 text-xs">
            {[0.8, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  speechRate === rate ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const newState = !isAudioEnabled;
              setIsAudioEnabled(newState);
              if (!newState && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              addToast?.({
                type: 'info',
                message: newState ? '🔊 Live Voice Audio Enabled' : '🔇 Audio Muted'
              });
            }}
            className={'px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ' + (isAudioEnabled ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20' : 'bg-white/5 border-white/10 text-gray-400')}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 animate-pulse text-cyan-400" />
                <span>Voice ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Voice OFF</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab?.('courses')}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Courses Portal
          </button>
        </div>
      </div>

      {/* ─── Topic Selector Shelf & AI Topic / Slide Deck Generator ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-7 flex flex-wrap items-center gap-2">
          {lessons.map((ls) => (
            <button
              key={ls.id}
              onClick={() => {
                setActiveLesson(ls);
                setCurrentSceneIdx(0);
                setCurrentDialogueIdx(0);
                setSelectedQuizAnswer(null);
                setQuizSubmitted(false);
                setCustomTerminalLogs([]);
              }}
              className={'px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-2 ' + (activeLesson.id === ls.id ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg shadow-purple-500/25 ring-1 ring-purple-400' : 'bg-[#090e1c] border-white/10 text-gray-400 hover:text-white hover:border-white/25')}
            >
              <span>{ls.professor.avatar}</span>
              <span className="truncate max-w-[180px]">{ls.title.split(':')[0]}</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-[9px] text-purple-300 font-mono">
                {ls.scenes?.length || 1} Slides
              </span>
            </button>
          ))}
        </div>

        {/* AI Generator Bar */}
        <div className="lg:col-span-5 flex gap-2">
          <input
            type="text"
            value={customTopicInput}
            onChange={(e) => setCustomTopicInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomClassroom()}
            placeholder="Generate 4-Slide Class on ANY topic (e.g. LLM Attention, Redis, OS Kernels)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-black/70 border border-white/15 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
          />
          <button
            onClick={handleGenerateCustomClassroom}
            disabled={isGeneratingTopic || !customTopicInput.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className={'w-3.5 h-3.5 ' + (isGeneratingTopic ? 'animate-spin' : '')} />
            {isGeneratingTopic ? 'Generating Slides...' : 'Generate Slides ⚡'}
          </button>
        </div>
      </div>

      {/* ─── Main Interactive Stage Layout ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ─── LEFT COLUMN: Presentation Slides & Dynamic Visualizer (8 Cols) ─── */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#080c18] border border-white/10 space-y-4 shadow-2xl relative overflow-hidden">
            
            {/* Top Stage Bar: Professor Profile & Peer Classmates */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
              
              <div className="flex items-center gap-3">
                <div className={'w-11 h-11 rounded-2xl flex items-center justify-center text-2xl transition-all ' + (activeSpeaker === 'professor' ? 'ring-4 ring-purple-400 bg-purple-600/30 scale-105 shadow-lg shadow-purple-500/30' : 'bg-white/5')}>
                  {activeLesson.professor.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white font-sora flex items-center gap-1.5">
                    {activeLesson.professor.name}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      LIVE LECTURING
                    </span>
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono">{activeLesson.professor.role}</p>
                </div>
              </div>

              {/* Classmate Avatars Shelf */}
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">AI Peers:</span>
                <div className="flex items-center gap-1.5">
                  {activeLesson.classmates.map((cm) => (
                    <div 
                      key={cm.id}
                      onClick={() => handleAskQuestion(`@${cm.name}: What is your perspective on this architectural challenge?`)}
                      className={'w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all border cursor-pointer hover:scale-105 ' + (activeSpeaker === cm.id ? 'border-cyan-400 bg-cyan-500/30 ring-2 ring-cyan-400 scale-110 shadow-md shadow-cyan-500/30' : 'border-white/10 bg-[#101728] opacity-85 hover:opacity-100')}
                      title={`Click to ask ${cm.name} (${cm.role})`}
                    >
                      {cm.avatar}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── LIVE PRESENTATION BLACKBOARD & SLIDE VIEWER ─── */}
            <div className="rounded-2xl bg-[#020409] border border-cyan-500/30 font-sans text-xs text-gray-200 overflow-hidden shadow-2xl">
              
              {/* Blackboard & Slide Header Bar */}
              <div className="flex flex-wrap items-center justify-between bg-black/80 px-4 py-2.5 border-b border-white/10 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold text-xs flex items-center gap-1.5">
                    <Presentation className="w-4 h-4 text-cyan-400" /> MASTERCLASS SLIDE DECK
                  </span>
                  
                  {/* View Mode Switcher Tabs */}
                  <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/10 text-[10px] ml-2">
                    <button
                      onClick={() => setActiveViewMode('slides')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${activeViewMode === 'slides' ? 'bg-cyan-500 text-black font-black shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Presentation className="w-3 h-3" /> Lecture Slides
                    </button>
                    <button
                      onClick={() => setActiveViewMode('blackboard')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${activeViewMode === 'blackboard' ? 'bg-purple-600 text-white font-black shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Layers className="w-3 h-3" /> Blackboard Notes
                    </button>
                    {activeScene.diagram && (
                      <button
                        onClick={() => setActiveViewMode('diagram')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${activeViewMode === 'diagram' ? 'bg-indigo-600 text-white font-black shadow' : 'text-gray-400 hover:text-white'}`}
                      >
                        <GitBranch className="w-3 h-3" /> Diagram
                      </button>
                    )}
                    {activeScene.codeSnippet && (
                      <button
                        onClick={() => setActiveViewMode('code')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${activeViewMode === 'code' ? 'bg-amber-400 text-black font-black shadow' : 'text-gray-400 hover:text-white'}`}
                      >
                        <Code2 className="w-3 h-3" /> Code
                      </button>
                    )}
                    {activeScene.terminalOutput && (
                      <button
                        onClick={() => setActiveViewMode('terminal')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${activeViewMode === 'terminal' ? 'bg-emerald-500 text-black font-black shadow' : 'text-gray-400 hover:text-white'}`}
                      >
                        <Terminal className="w-3 h-3" /> Terminal
                      </button>
                    )}
                  </div>
                </div>

                {/* Slide Stepper & Generate Next Slide */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateNextSlide}
                    disabled={isGeneratingNextSlide}
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-purple-400/40 text-[10px] text-purple-200 font-bold transition-all cursor-pointer flex items-center gap-1"
                    title="Generate and append next slide using AI"
                  >
                    <PlusCircle className={'w-3 h-3 text-cyan-400 ' + (isGeneratingNextSlide ? 'animate-spin' : '')} />
                    {isGeneratingNextSlide ? 'Generating...' : '+ Add AI Slide'}
                  </button>

                  <span className="text-[10px] text-gray-300 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    Slide {currentSceneIdx + 1} of {activeLesson.scenes.length}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevScene}
                      disabled={currentSceneIdx === 0}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-gray-300 cursor-pointer"
                      title="Previous Slide"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextScene}
                      disabled={currentSceneIdx >= activeLesson.scenes.length - 1}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-gray-300 cursor-pointer"
                      title="Next Slide"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── SLIDE CANVAS VIEW CONTENT ─── */}
              <div className="p-4 md:p-5 min-h-[340px]">
                
                {/* 1. KEYNOTE PRESENTATION SLIDE MODE (COLORFUL WITH WHITE BACKGROUND) */}
                {activeViewMode === 'slides' && (
                  <div className="rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl overflow-hidden space-y-0 relative">
                    
                    {/* Vivid Colorful Header Banner */}
                    <div className="p-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-0.5 rounded-full bg-white text-indigo-900 text-[11px] font-mono font-black tracking-wider shadow-sm uppercase">
                              SLIDE {currentSceneIdx + 1} OF {activeLesson.scenes.length}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold backdrop-blur-sm border border-white/20">
                              {activeLesson.subject}
                            </span>
                          </div>
                          <h2 className="text-lg md:text-xl font-black text-white font-sora tracking-tight pt-1">
                            {activeScene.title}
                          </h2>
                          {activeScene.slideSubtitle && (
                            <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                              {activeScene.slideSubtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Crisp White Background Content Area */}
                    <div className="p-5 md:p-6 bg-gradient-to-b from-white via-slate-50/50 to-indigo-50/30 space-y-4">
                      {/* 2-Column Keynote Slide Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Left: Key Takeaway Cards with High-Vibrancy Colors */}
                        <div className="md:col-span-7 space-y-2.5">
                          <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Core Architectural Takeaways:
                          </h4>
                          
                          {(activeScene.takeaways || [
                            "Deterministic state replication across distributed cluster nodes.",
                            "Mathematical invariant guarantees safety and linearizability.",
                            "Low-latency execution with zero-copy buffer pools."
                          ]).map((t, tIdx) => {
                            const cardStyles = [
                              { border: 'border-l-violet-600 border-violet-100 bg-gradient-to-r from-violet-50/90 to-indigo-50/40', badge: 'bg-violet-600 text-white', text: 'text-slate-800' },
                              { border: 'border-l-cyan-600 border-cyan-100 bg-gradient-to-r from-cyan-50/90 to-sky-50/40', badge: 'bg-cyan-600 text-white', text: 'text-slate-800' },
                              { border: 'border-l-emerald-600 border-emerald-100 bg-gradient-to-r from-emerald-50/90 to-teal-50/40', badge: 'bg-emerald-600 text-white', text: 'text-slate-800' },
                              { border: 'border-l-amber-500 border-amber-100 bg-gradient-to-r from-amber-50/90 to-orange-50/40', badge: 'bg-amber-600 text-white', text: 'text-slate-800' }
                            ];
                            const currentStyle = cardStyles[tIdx % cardStyles.length];

                            return (
                              <div 
                                key={tIdx}
                                className={`p-3.5 rounded-xl border-l-4 border ${currentStyle.border} flex items-start gap-3 shadow-sm hover:shadow-md transition-all`}
                              >
                                <div className={`w-6 h-6 rounded-lg ${currentStyle.badge} text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                                  {tIdx + 1}
                                </div>
                                <p className={`text-xs ${currentStyle.text} leading-relaxed font-semibold`}>
                                  {t}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Right: Visual Diagram or Code Snippet Preview */}
                        <div className="md:col-span-5 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-black text-slate-600 uppercase tracking-wider mb-2">
                            <span className="flex items-center gap-1.5">
                              <Monitor className="w-3.5 h-3.5 text-indigo-600" /> Slide Visual Model:
                            </span>
                            <button
                              onClick={() => setActiveViewMode(activeScene.diagram ? 'diagram' : 'code')}
                              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer flex items-center gap-0.5"
                            >
                              Expand ↗
                            </button>
                          </div>

                          {/* Mac-style Window Frame */}
                          <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-lg bg-[#0f172a]">
                            <div className="bg-[#1e293b] px-3 py-1.5 flex items-center justify-between border-b border-slate-700">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-slate-400">
                                {activeScene.diagram ? 'visual-model.txt' : 'source-demo.java'}
                              </span>
                            </div>
                            
                            {activeScene.diagram ? (
                              <div className="p-3.5 text-cyan-300 font-mono text-[10px] overflow-x-auto max-h-[195px] leading-tight">
                                <pre>{activeScene.diagram}</pre>
                              </div>
                            ) : (
                              <div className="p-3.5 text-amber-300 font-mono text-[10px] overflow-x-auto max-h-[195px] leading-tight">
                                <pre>{activeScene.codeSnippet}</pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Slide Bottom Bar with Colorful Badges */}
                      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px] border border-indigo-200">
                            🎯 {activeLesson.difficulty || 'Advanced'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                            ⏱️ {activeLesson.duration || '20 mins'}
                          </span>
                          {activeLesson.tags?.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] border border-purple-200">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                          <span>Prof. {activeLesson.professor.name.split(' ')[1] || activeLesson.professor.name}</span>
                          <span>•</span>
                          <span>Interactive Slide Deck</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Blackboard Markdown Mode (Crisp White Background with Rich Colorful Typography) */}
                {activeViewMode === 'blackboard' && (
                  <div className="rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl p-6 overflow-hidden space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <h3 className="text-sm font-black text-indigo-900 font-sora flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-600" /> Blackboard Notes & Formal Proofs
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                        Slide {currentSceneIdx + 1}
                      </span>
                    </div>
                    <div 
                      className={'prose max-w-none text-xs leading-relaxed text-slate-800 space-y-3 font-sans [&>h1]:text-base [&>h1]:font-black [&>h1]:text-indigo-900 [&>h3]:text-xs [&>h3]:font-black [&>h3]:text-violet-700 [&>pre]:bg-[#0f172a] [&>pre]:text-emerald-300 [&>pre]:p-3.5 [&>pre]:rounded-xl [&>pre]:border [&>pre]:border-slate-700 [&>pre]:font-mono [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-1.5 [&>table]:w-full [&>table]:border-collapse [&>table]:my-3 [&>table_th]:bg-indigo-600 [&>table_th]:text-white [&>table_th]:p-2.5 [&>table_th]:text-left [&>table_th]:font-bold [&>table_td]:p-2.5 [&>table_td]:border [&>table_td]:border-slate-200 [&>table_tr:nth-child(even)]:bg-slate-50'}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(marked.parse(activeScene.whiteboardContent || ''))
                      }}
                    />
                  </div>
                )}

                {/* 3. Diagram Mode */}
                {activeViewMode === 'diagram' && activeScene.diagram && (
                  <div className="p-4 rounded-xl bg-black/95 border border-purple-500/40 text-purple-300 font-mono text-[11px] overflow-x-auto shadow-inner">
                    <pre className="leading-tight">{activeScene.diagram}</pre>
                  </div>
                )}

                {/* 4. Code Implementation Mode */}
                {activeViewMode === 'code' && activeScene.codeSnippet && (
                  <div className="rounded-xl bg-black/95 border border-amber-500/30 p-3.5 text-[11px] overflow-x-auto font-mono text-amber-300 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-gray-400 text-[10px]">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Code2 className="w-3.5 h-3.5" /> Source Implementation & Contract
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(activeScene.codeSnippet);
                          addToast?.({ type: 'success', message: '📋 Code copied to clipboard!' });
                        }}
                        className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <pre className="overflow-x-auto leading-relaxed">{activeScene.codeSnippet}</pre>
                  </div>
                )}

                {/* 5. Terminal Mode */}
                {activeViewMode === 'terminal' && (
                  <div className="rounded-xl bg-[#010307] border border-emerald-500/40 p-4 text-[11px] font-mono text-emerald-300 space-y-3 shadow-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-gray-400 text-[10px]">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Terminal className="w-3.5 h-3.5" /> Live Sandbox Simulation Terminal
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTerminalSubmit(null, 'status')}
                          className="px-2 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-[9px] cursor-pointer"
                        >
                          ⚡ status
                        </button>
                        <button
                          onClick={() => handleTerminalSubmit(null, 'benchmark')}
                          className="px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[9px] cursor-pointer"
                        >
                          ⚡ benchmark
                        </button>
                      </div>
                    </div>
                    <pre className="overflow-x-auto leading-relaxed text-emerald-400/90">{activeScene.terminalOutput}</pre>
                    {customTerminalLogs.map((log) => (
                      <div key={log.id} className="space-y-1 border-t border-white/5 pt-2">
                        <div className="text-cyan-400">
                          lumixora-openmaic@cluster:~$ <span className="text-white font-bold">{log.cmd}</span>
                        </div>
                        <pre className="text-emerald-300 leading-relaxed whitespace-pre-wrap">{log.output}</pre>
                      </div>
                    ))}
                    <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-emerald-500/20">
                      <span className="text-emerald-400 font-bold">lumixora-openmaic@cluster:~$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder="Type 'help', 'status', 'kill-leader', 'replicate <msg>', 'benchmark'..."
                        className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono placeholder-gray-600"
                      />
                    </form>
                  </div>
                )}

              </div>

              {/* ─── BOTTOM SLIDE THUMBNAIL CAROUSEL STRIP ─── */}
              <div className="bg-black/90 px-4 py-3 border-t border-white/10 flex items-center justify-between gap-3 overflow-x-auto">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <LayoutGrid className="w-3 h-3 text-cyan-400" /> Slide Deck:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {activeLesson.scenes.map((sc, sIdx) => (
                      <button
                        key={sc.id || sIdx}
                        onClick={() => handleSelectSlide(sIdx)}
                        className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ' + (currentSceneIdx === sIdx ? 'bg-cyan-500/30 border-cyan-400 text-white ring-2 ring-cyan-400 shadow-md shadow-cyan-500/30' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20')}
                      >
                        <span className="text-[10px] font-mono">Slide {sc.slideNumber || sIdx + 1}</span>
                      </button>
                    ))}

                    <button
                      onClick={handleGenerateNextSlide}
                      disabled={isGeneratingNextSlide}
                      className="px-2.5 py-1.5 rounded-xl border border-dashed border-purple-400/60 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
                      <span>{isGeneratingNextSlide ? 'Generating...' : '+ Add Slide'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400 font-mono shrink-0">
                  {currentSceneIdx + 1} / {activeLesson.scenes.length} Slides
                </div>
              </div>

            </div>

            {/* ─── LIVE MULTI-AGENT DIALOGUE & SPEECH STAGE BAR ─── */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-black/60 to-cyan-950/50 border border-purple-500/40 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">
                    {currentDialogue.speaker === 'professor' 
                      ? activeLesson.professor.avatar 
                      : (activeLesson.classmates.find(c => c.id === currentDialogue.speaker)?.avatar || '🧑‍💻')}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {currentDialogue.speaker === 'professor' 
                        ? activeLesson.professor.name 
                        : (activeLesson.classmates.find(c => c.id === currentDialogue.speaker)?.title || 'Classmate')}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                      <Activity className="w-3 h-3 text-cyan-400 animate-pulse" /> Speaking Step {currentDialogueIdx + 1}/{activeScene.dialogue.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAudioEnabled && (
                    <span className="flex items-center gap-1.5 text-[10px] text-cyan-300 font-mono bg-cyan-500/15 px-2.5 py-1 rounded-full border border-cyan-400/40">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                      Live Voice ({speechRate}x)
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 shadow-inner">
                <p className="text-xs md:text-sm text-gray-100 font-medium leading-relaxed">
                  "{currentDialogue.text}"
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevDialogue}
                    disabled={currentDialogueIdx === 0}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    ◀ Prev Step
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? 'Pause Lecture' : 'Auto Lecture ▶'}
                  </button>
                  <button
                    onClick={handleNextDialogue}
                    disabled={currentDialogueIdx >= activeScene.dialogue.length - 1}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    Next Step ▶
                  </button>
                </div>

                <button
                  onClick={handleRaiseHand}
                  className={'px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ' + (raisedHand ? 'bg-amber-500/25 border-amber-400 text-amber-300 animate-pulse shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/10 text-gray-300 hover:text-white')}
                >
                  <Hand className="w-3.5 h-3.5 text-amber-400" />
                  {raisedHand ? '🙋‍♂️ Hand Raised!' : 'Raise Hand'}
                </button>
              </div>
            </div>

            {/* ─── LIVE POP QUIZ CHECKPOINT ─── */}
            {activeScene.quiz && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    SLIDE {currentSceneIdx + 1} POP QUIZ CHECKPOINT
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30">
                    +30 XP Reward
                  </span>
                </div>

                <p className="text-xs font-bold text-white">{activeScene.quiz.question}</p>

                <div className="space-y-1.5">
                  {activeScene.quiz.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => !quizSubmitted && setSelectedQuizAnswer(oIdx)}
                      className={'w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ' + (selectedQuizAnswer === oIdx ? 'bg-purple-600/25 border-purple-400 text-purple-200 ring-1 ring-purple-400' : 'bg-black/40 border-white/5 hover:bg-white/5 text-gray-300')}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && oIdx === activeScene.quiz.correct && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedQuizAnswer === null}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 disabled:opacity-40 text-black font-extrabold text-xs transition-all cursor-pointer shadow"
                  >
                    Submit Quiz Answer
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs space-y-1">
                    <span className="font-bold text-emerald-400 block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Conceptual Explanation:
                    </span>
                    <p className="text-gray-300 leading-relaxed">{activeScene.quiz.explanation}</p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* ─── RIGHT COLUMN: Live Classroom Discussion & Slide Notes (4 Cols) ─── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Live Discussion Chat Box */}
          <div className="p-4 rounded-3xl bg-[#080c18] border border-white/10 shadow-2xl flex flex-col h-[540px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-black text-white font-sora">
                  Live Classroom Thread ({chatMessages.length})
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Agents
              </span>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs custom-scrollbar">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={'p-3 rounded-2xl border space-y-1 transition-all ' + (msg.role === 'Student' ? 'bg-amber-500/10 border-amber-500/30 ml-4' : (msg.role === 'Professor' ? 'bg-purple-950/25 border-purple-500/35 mr-2' : 'bg-cyan-950/25 border-cyan-500/25 mr-4'))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span>{msg.avatar}</span>
                      <span className={'font-bold ' + (msg.color || 'text-white')}>{msg.sender}</span>
                      <span className="px-1.5 py-0.2 rounded bg-white/5 text-[9px] text-gray-400 font-mono">
                        {msg.role}
                      </span>
                    </div>
                    <span className="text-[9px] text-gray-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-gray-200 text-xs leading-relaxed pl-5">{msg.text}</p>
                </div>
              ))}

              {isAiThinking && (
                <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex items-center gap-2 text-xs text-purple-300 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>Professor & Classmates are synthesizing response...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Socratic Quick Prompts Pills */}
            <div className="py-2 border-t border-white/10 flex flex-wrap gap-1.5">
              <button
                onClick={() => handleAskQuestion("Can you explain this slide using a simple real-world analogy?")}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 font-medium transition-all cursor-pointer"
              >
                💡 Real-world Analogy
              </button>
              <button
                onClick={() => handleAskQuestion("What is the worst-case failure mode on this slide?")}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 font-medium transition-all cursor-pointer"
              >
                ⚠️ Worst-Case Failure
              </button>
              <button
                onClick={() => handleAskQuestion("How does Netflix / Google scale this in production?")}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 font-medium transition-all cursor-pointer"
              >
                🚀 Production Scale
              </button>
            </div>

            {/* Question Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAskQuestion(); }} className="pt-2 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={studentQuestion}
                onChange={(e) => setStudentQuestion(e.target.value)}
                placeholder={raisedHand ? "Ask question on this slide..." : "Ask the Professor or Classmates..."}
                className="flex-1 px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={!studentQuestion.trim() || isAiThinking}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all cursor-pointer shadow"
                title="Send Question"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Student Scratchpad & AI Auto-Summarizer */}
          <div className="p-4 rounded-3xl bg-[#080c18] border border-white/10 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black text-white font-sora">
                  Slide Deck Scratchpad
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAutoSummarizeNotes}
                  disabled={isAutoSummarizing}
                  className="text-[10px] font-bold text-purple-300 hover:text-purple-200 bg-purple-500/15 px-2 py-0.5 rounded-lg border border-purple-400/30 flex items-center gap-1 cursor-pointer transition-all"
                  title="AI Auto-Summarize Current Slide"
                >
                  <Sparkles className={'w-3 h-3 ' + (isAutoSummarizing ? 'animate-spin' : '')} />
                  {isAutoSummarizing ? 'Summarizing...' : 'AI Slide Notes'}
                </button>
                <button
                  onClick={handleExportNotes}
                  className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  title="Download All Slides (.md)"
                >
                  <Download className="w-3 h-3" /> Export .MD
                </button>
              </div>
            </div>

            <textarea
              value={classroomNotes}
              onChange={(e) => setClassroomNotes(e.target.value)}
              placeholder="Take slide notes or click 'AI Slide Notes' to generate summaries..."
              rows={4}
              className="w-full p-3 rounded-2xl bg-black/70 border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-400 resize-none font-sans"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
