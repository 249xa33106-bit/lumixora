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

// ─── 4 Curated Multi-Slide BoloClass Masterclasses ─────────────────────────────
const BOLOCLASS_DEFAULT_LESSONS = [
  {
    "id": "java-data-types",
    "title": "Java Core: Data Types, JVM Memory & Type Casting",
    "subject": "Java Programming & JVM Architecture",
    "difficulty": "Foundational to Advanced",
    "duration": "25 mins",
    "tags": [
      "Java",
      "Data Types",
      "JVM Memory",
      "Primitives",
      "Type Casting"
    ],
    "professor": {
      "name": "Prof. Vyomra",
      "role": "Lead AI Professor of Computer Science & JVM Architecture",
      "avatar": "👨‍🏫",
      "voicePitch": 0.95,
      "voiceRate": 0.98
    },
    "classmates": [
      {
        "id": "alex",
        "name": "Alex",
        "title": "Alex (Curious Skeptic)",
        "avatar": "🧑‍💻",
        "color": "text-amber-400",
        "role": "Edge-Case Specialist",
        "pitch": 1.2
      },
      {
        "id": "maya",
        "name": "Maya",
        "title": "Maya (Performance Hacker)",
        "avatar": "👩‍💻",
        "color": "text-cyan-400",
        "role": "Memory & Low-Level",
        "pitch": 1.3
      }
    ],
    "scenes": [
      {
        "id": "scene-java-1",
        "slideNumber": 1,
        "title": "Slide 1: Java Primitive Data Types & Byte Allocation",
        "slideSubtitle": "The 8 primitive types, memory footprints, bit ranges, two's complement encoding, and default values.",
        "takeaways": [
          "Java defines 8 strict primitive types: byte (1B / 8-bit), short (2B / 16-bit), int (4B / 32-bit), long (8B / 64-bit), float (4B / IEEE 754), double (8B / IEEE 754), char (2B / UTF-16 Unicode), and boolean (1-bit logical).",
          "Primitives are stored directly within thread-local Stack Frames (Local Variable Array) with zero heap object header overhead, yielding sub-nanosecond L1/L2 CPU cache throughput.",
          "Deterministic Default Value Semantics: Instance and static fields initialize automatically to 0 (numeric), 0.0 (floating point), false (boolean), or \\u0000 (char); local method variables require explicit assignment.",
          "Two's Complement Integer Representation: All integral types (except char) are signed, mapping to ranges from -2^(N-1) to 2^(N-1)-1, eliminating dual-zero ambiguity in hardware ALUs.",
          "IEEE 754 Floating-Point Precision: `float` delivers 6–7 significant decimal digits of precision while `double` delivers 15–17 digits, mandating BigDecimal for exact financial and currency math."
        ],
        "whiteboardContent": "# Java 8 Primitive Data Types & Memory Matrix\n\n| Type | Bit Width | Memory Size | Min Value Range | Max Value Range | Default Value | IEEE / Encoding |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| `byte` | 8 bits | 1 Byte | $-128$ ($-2^7$) | $127$ ($2^7-1$) | `0` | Two's Complement Signed |\n| `short` | 16 bits | 2 Bytes | $-32,768$ ($-2^{15}$) | $32,767$ ($2^{15}-1$) | `0` | Two's Complement Signed |\n| `int` | 32 bits | 4 Bytes | $-2,147,483,648$ ($-2^{31}$) | $2,147,483,647$ ($2^{31}-1$) | `0` | Two's Complement Signed |\n| `long` | 64 bits | 8 Bytes | $-2^{63}$ ($-9.22\\times 10^{18}$) | $2^{63}-1$ ($9.22\\times 10^{18}$) | `0L` | Two's Complement Signed |\n| `float` | 32 bits | 4 Bytes | $\\approx 1.4\\times 10^{-45}$ | $\\approx 3.4\\times 10^{38}$ | `0.0f` | IEEE 754 Single Precision |\n| `double`| 64 bits | 8 Bytes | $\\approx 4.9\\times 10^{-324}$ | $\\approx 1.8\\times 10^{308}$ | `0.0d` | IEEE 754 Double Precision |\n| `char` | 16 bits | 2 Bytes | `\\u0000` ($0$) | `\\uffff` ($65,535$) | `\\u0000` | Unsigned UTF-16 Unicode |\n| `boolean`| 1 bit JVM | 1-4 Bytes (Array/Slot) | `false` ($0$) | `true` ($1$) | `false` | Logical 1-bit boolean flag |\n\n---\n\n### Core Hardware & Memory Invariants:\n1. **Stack Memory Footprint:** Primitives never undergo Garbage Collection because their lifetime is tied strictly to the thread stack frame popping $\\mathcal{O}(1)$.\n2. **Literal Suffix Mandates:** Unadorned integer literals default to 32-bit `int` (requiring `L` suffix for `long`); unadorned decimal literals default to 64-bit `double` (requiring `f` suffix for `float`).",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                   JAVA PRIMITIVE MEMORY & STACK FRAME LAYOUT             │\n├──────────────────────────────────────────────────────────────────────────┤\n│  THREAD CALL STACK (L1/L2 CPU Cache Friendly)                            │\n│  ┌────────────────────────────────────────────────────────────────────┐  │\n│  │ [Slot 0: byte age = 24]        (1 Byte in 32-bit stack slot)       │  │\n│  │ [Slot 1: short port = 8080]    (2 Bytes in 32-bit stack slot)      │  │\n│  │ [Slot 2: int userCount = 1M]   (4 Bytes direct value)              │  │\n│  │ [Slot 3-4: long timestamp]     (8 Bytes across 2 stack slots)      │  │\n│  │ [Slot 5-6: double pi = 3.1415] (8 Bytes IEEE 754 64-bit payload)   │  │\n│  │ [Slot 7: char symbol = 'A']    (2 Bytes UTF-16 Unicode 0x0041)     │  │\n│  │ [Slot 8: boolean flag = true]  (1 bit evaluated as 1 in JVM ALU)   │  │\n│  └────────────────────────────────────────────────────────────────────┘  │\n│  >>> ZERO Heap Allocation | ZERO Object Headers | ZERO GC Pause Overhead │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "public class JavaDataTypesDemo {\n    public static void main(String[] args) {\n        // Integral primitives with binary/hex formatting\n        byte smallCount = 127;                       // Range: -128 to 127\n        short port = 8080;                           // 16-bit signed\n        int userCount = 1_000_000;                   // Java 7+ underscore formatting\n        long epochMillis = 1711000000000L;           // Suffix 'L' required for 64-bit\n\n        // Floating point primitives (IEEE 754)\n        float piFloat = 3.1415927f;                  // Suffix 'f' required (32-bit)\n        double precision = 3.141592653589793;        // Default 64-bit precision\n\n        // Character and Boolean primitives\n        char unicodeLetter = '\\u0928';               // Devanagari 'Na' (16-bit Unicode)\n        char standardChar = 'A';                     // ASCII subset (UTF-16)\n        boolean isEnrolled = true;                   // JVM evaluates as 1\n\n        System.out.println(\"Stack Memory primitives allocated with zero GC footprint!\");\n    }\n}",
        "terminalOutput": "[JVM COMPILE & RUN] JavaDataTypesDemo.java\n>>> Stack Frame Local Variable Array initialized successfully.\n>>> Memory allocated: 32 bytes on Thread Stack.\n>>> Heap allocations: 0 Objects | Garbage Collection overhead: 0.00ms.",
        "dialogue": [
          {
            "speaker": "professor",
            "text": "Welcome scholars! In Java, data types are strictly split into two main families: Primitives and Reference types. Let us master the 8 primitives first."
          },
          {
            "speaker": "alex",
            "text": "Professor, why does Java allocate 2 bytes (16 bits) for char when C only uses 1 byte (8 bits)?"
          },
          {
            "speaker": "professor",
            "text": "Brilliant question, Alex! C used 8-bit ASCII which only supported 256 English symbols. Java was architected from day one for internationalization using 16-bit UTF-16 Unicode, enabling native support for Hindi, Telugu, Chinese, Arabic, and global emojis."
          }
        ],
        "quizzes": [
          {
            "question": "Which of the following is an 8-byte (64-bit) primitive data type in Java?",
            "options": [
              "long and double",
              "int and float",
              "short and char",
              "String and Integer"
            ],
            "correct": 0,
            "explanation": "In Java, both `long` (64-bit integer) and `double` (64-bit IEEE 754 floating point) occupy exactly 8 bytes (64 bits) of memory."
          },
          {
            "question": "Why does Java allocate 2 bytes (16 bits) for `char` instead of 1 byte as in C?",
            "options": [
              "To natively support 16-bit UTF-16 Unicode character sets for global languages and scripts",
              "To make string concatenation 2x faster",
              "Because 1-byte data types are forbidden in the JVM",
              "To store negative character codes in two's complement"
            ],
            "correct": 0,
            "explanation": "Java characters use UTF-16 encoding (2 bytes / 16 bits, range \\u0000 to \\uffff), enabling native internationalization across global scripts (Hindi, Telugu, Chinese, Arabic, emojis)."
          },
          {
            "question": "Where are primitive local variables stored at runtime in the JVM?",
            "options": [
              "Directly in thread-local Stack Frames (Local Variable Array) with zero heap allocation overhead",
              "In the Garbage-Collected Old Generation Heap",
              "In the MetaSpace class metadata pool",
              "In off-heap native direct memory buffers"
            ],
            "correct": 0,
            "explanation": "Primitives declared inside methods reside directly in the thread's Stack Frame local variable table, providing sub-nanosecond CPU cache access and instant deallocation upon method exit without GC pauses."
          },
          {
            "question": "What is the exact valid integer range of a Java `byte` data type?",
            "options": [
              "-128 to 127",
              "0 to 255",
              "-256 to 255",
              "-32,768 to 32,767"
            ],
            "correct": 0,
            "explanation": "Java `byte` is an 8-bit signed two's complement integer with range from -2^7 (-128) to 2^7 - 1 (127)."
          },
          {
            "question": "What happens when you declare an uninitialized local primitive variable inside a method and try to read it?",
            "options": [
              "Compilation Error: Variable might not have been initialized",
              "It automatically defaults to 0 or false",
              "It contains garbage memory values from the OS",
              "It throws a NullPointerException at runtime"
            ],
            "correct": 0,
            "explanation": "Local variables in Java are never assigned default values automatically. The Java compiler enforces definite assignment and throws a compile-time error if read before assignment."
          },
          {
            "question": "What are the default values assigned to primitive instance fields of an object on the heap?",
            "options": [
              "numeric types: 0 / 0.0, boolean: false, char: '\\u0000'",
              "numeric types: null, boolean: false, char: ' '",
              "numeric types: -1, boolean: null, char: null",
              "Instance fields must always be explicitly initialized"
            ],
            "correct": 0,
            "explanation": "Object fields on the Heap are initialized to binary zero upon heap allocation: 0 for byte/short/int/long, 0.0 for float/double, false for boolean, and '\\u0000' (null character) for char."
          },
          {
            "question": "Why does `float x = 3.14;` fail to compile without an explicit `f` suffix?",
            "options": [
              "Floating-point literals default to 64-bit `double` and cannot implicitly narrow to 32-bit `float`",
              "`float` cannot represent decimal numbers in Java",
              "3.14 exceeds the maximum value of a 32-bit float",
              "`float` is deprecated in modern Java specifications"
            ],
            "correct": 0,
            "explanation": "In Java, any floating-point literal with a decimal point is treated as a 64-bit `double` literal by default. Assigning a `double` to a `float` requires an explicit suffix `3.14f` or cast `(float)3.14`."
          },
          {
            "question": "Which primitive type in Java is unsigned?",
            "options": [
              "char",
              "byte",
              "short",
              "int"
            ],
            "correct": 0,
            "explanation": "`char` is the ONLY unsigned primitive type in Java (16 bits, range 0 to 65,535). All other integral types (byte, short, int, long) are signed two's complement."
          },
          {
            "question": "Why should `double` and `float` NEVER be used for precise financial or currency calculations?",
            "options": [
              "Binary IEEE 754 representations cannot accurately represent certain base-10 fractions (like 0.1), causing precision drift",
              "They are too slow for real-time banking transactions",
              "They overflow when multiplying amounts greater than $1,000",
              "The JVM disables floating-point arithmetic in enterprise mode"
            ],
            "correct": 0,
            "explanation": "IEEE 754 floating-point numbers represent numbers in binary (base-2). Base-10 fractions like 0.1 or 0.7 have infinite repeating binary representations, leading to roundoff errors. `BigDecimal` must be used for financial accuracy."
          },
          {
            "question": "How many bits of memory does a `boolean` variable occupy inside a Java array (`boolean[]`)?",
            "options": [
              "1 byte (8 bits) per element in most JVM implementations",
              "1 bit per element",
              "4 bytes (32 bits) per element",
              "8 bytes (64 bits) per element"
            ],
            "correct": 0,
            "explanation": "While individual boolean stack expressions evaluate as 32-bit ints in the JVM bytecode, the HotSpot JVM packs elements of `boolean[]` into 1 byte (8 bits) each for memory efficiency."
          }
        ]
      },
      {
        "id": "scene-java-2",
        "slideNumber": 2,
        "title": "Slide 2: Reference Types, Strings & Memory Layout (Stack vs Heap)",
        "slideSubtitle": "How objects, arrays, Compressed OOPs, and String Constant Pool differ from stack primitives.",
        "takeaways": [
          "Reference types (Classes, Interfaces, Arrays, Enums) store 4-byte (with Compressed OOPs) or 8-byte memory address pointers on the Stack pointing to objects on the Heap.",
          "Every Heap object incurs a 12-to-16 byte Object Header containing a Mark Word (hashcode, GC age, lock state) and Klass Word (class metadata pointer).",
          "String Immutability & SCP: `String` is an immutable reference type backed by the JVM String Constant Pool (SCP) in Heap memory to deduplicate identical literals.",
          "Generational Garbage Collection: Unreferenced Heap objects are automatically identified via GC Roots reachability and reclaimed by generational collectors (G1, ZGC).",
          "Java is strictly Pass-by-Value: Passing an object to a method copies the 32/64-bit memory address pointer by value—never the underlying heap memory instance."
        ],
        "whiteboardContent": "# JVM Memory Architecture: Stack vs Heap Allocation\n\n### 1. Stack Memory (Thread-Private & Ultra-Fast)\n* Stores local primitive variables and object reference pointers (OOPs).\n* Allocation/Deallocation is instantaneous $\\mathcal{O}(1)$ via Stack Pointer increment/decrement.\n* Thread-safe with zero contention across concurrent workers.\n\n---\n\n### 2. Heap Memory (Shared Space & Managed by GC)\n* Stores all Object instances, Arrays, and the String Constant Pool (SCP).\n* Every object contains an **Object Header**:\n  $$\\text{Header} = \\text{Mark Word (8B)} + \\text{Klass Word (4B/8B)} + [\\text{Array Length (4B)}]$\n\n---\n\n### 3. String Constant Pool (SCP) Mechanics:\n$$\\text{String } s1 = \\text{\"Java\"}; \\quad \\text{String } s2 = \\text{\"Java\"}; \\implies s1 == s2 \\text{ (True: points to identical SCP address)}$$\n$$\\text{String } s3 = \\text{new String(\"Java\")}; \\implies s1 == s3 \\text{ (False: forces separate Heap instance)}$$",
        "diagram": "┌───────────────────────────────────┬──────────────────────────────────────────┐\n│     STACK (Thread-Local Frames)   │             HEAP (Shared Space)          │\n├───────────────────────────────────┼──────────────────────────────────────────┤\n│ [ int count = 42 ]                │                                          │\n│ [ String s1 ] (Address: 0x7F01) ──┼───> [ String Constant Pool: \"Java\" ]     │\n│ [ String s2 ] (Address: 0x7F01) ──┤                                          │\n│ [ String s3 ] (Address: 0x9A40) ──┼───> [ New Heap Object: \"Java\" ]          │\n│ [ User userRef ] (Addr: 0xBA00) ──┼───> [ User Object { id: 101, name: ...}]│\n│ [ int[] arrRef ] (Addr: 0xCC10) ──┼───> [ Array Header + [10, 20, 30, 40] ]  │\n└───────────────────────────────────┴──────────────────────────────────────────┘",
        "codeSnippet": "public class ReferenceTypesDemo {\n    public static void main(String[] args) {\n        // 1. Primitive: Copied directly by value\n        int a = 10;\n        int b = a; // Copied value: b gets 10\n        b = 20;    // 'a' remains 10 (completely isolated in Stack)\n\n        // 2. Reference Type: Copied memory address pointer\n        int[] arr1 = { 1, 2, 3 };\n        int[] arr2 = arr1; // Copies pointer address!\n        arr2[0] = 99;      // Mutates underlying heap array\n\n        // 3. String Constant Pool vs Heap Allocation\n        String s1 = \"Lumi\";\n        String s2 = \"Lumi\";\n        String s3 = new String(\"Lumi\");\n\n        System.out.println(\"s1 == s2: \" + (s1 == s2));       // true (shared SCP literal)\n        System.out.println(\"s1 == s3: \" + (s1 == s3));       // false (distinct Heap object)\n        System.out.println(\"s1.equals(s3): \" + s1.equals(s3)); // true (value equality)\n    }\n}",
        "terminalOutput": "[JVM RUNTIME] ReferenceTypesDemo.java\n>>> arr1[0] modified via arr2 pointer: 99 (Shared Heap mutation)\n>>> s1 == s2: true (SCP Cache Hit)\n>>> s1 == s3: false (Distinct Heap Instance)\n>>> s1.equals(s3): true (Value comparison matches)",
        "dialogue": [
          {
            "speaker": "maya",
            "text": "So when I create a million Strings using literal syntax `\"Data\"`, Java only stores a single instance on the heap?"
          },
          {
            "speaker": "professor",
            "text": "Spot on, Maya! That is the power of the String Constant Pool (SCP). But if you write `new String(\"Data\")`, you force the JVM to instantiate duplicate objects, wasting memory."
          },
          {
            "speaker": "alex",
            "text": "And what about arrays? Is an `int[]` an object or a primitive?"
          },
          {
            "speaker": "professor",
            "text": "In Java, ALL arrays are full-fledged Heap Objects containing an Object Header with an additional 4-byte `length` metadata field!"
          }
        ],
        "quizzes": [
          {
            "question": "Where are Java Object instances and Arrays stored during application execution?",
            "options": [
              "In Heap Memory (shared across all threads, managed by Garbage Collector)",
              "In Thread-Local Stack Frames",
              "In the CPU L1 Cache Registers exclusively",
              "In the MetaSpace classloader partition"
            ],
            "correct": 0,
            "explanation": "All object instances and arrays in Java are dynamically allocated on the shared Heap Memory and managed by the Generational Garbage Collector."
          },
          {
            "question": "What is contained within a standard Java Object Header on a 64-bit JVM with Compressed OOPs enabled?",
            "options": [
              "Mark Word (8 bytes: hashcode, GC age, lock state) + Klass Word (4 bytes: class metadata pointer)",
              "Stack pointer address (8 bytes) + Thread ID (8 bytes)",
              "Array length (8 bytes) + Mutex lock (8 bytes)",
              "Garbage collection generation counter only (4 bytes)"
            ],
            "correct": 0,
            "explanation": "Every Java object header consists of an 8-byte Mark Word (storing identity hashcode, GC age bits, locking flags) and a 4-byte Klass Word (compressed reference to the class metadata in MetaSpace)."
          },
          {
            "question": "What is the result of `String s1 = \"Code\"; String s2 = \"Code\"; boolean eq = (s1 == s2);`?",
            "options": [
              "`true`, because both string literals share the identical reference address in the String Constant Pool (SCP)",
              "`false`, because `==` always returns false for reference types",
              "`false`, because two distinct objects were instantiated on the heap",
              "Compilation Error"
            ],
            "correct": 0,
            "explanation": "Java automatically interns string literals. Both `s1` and `s2` point to the single canonical `String` instance stored in the String Constant Pool, so identity comparison `==` evaluates to `true`."
          },
          {
            "question": "What is the result of `String s1 = \"Code\"; String s2 = new String(\"Code\"); boolean eq = (s1 == s2);`?",
            "options": [
              "`false`, because `new String()` explicitly allocates a new distinct object instance in general heap memory",
              "`true`, because the characters in both strings match",
              "`true`, because the JVM optimizes `new String()` away",
              "Throws a runtime NullPointerException"
            ],
            "correct": 0,
            "explanation": "Using `new String(\"Code\")` forces the allocation of a new, distinct `String` object in heap memory, distinct from the literal in the SCP. Therefore, `s1 == s2` is `false` (though `s1.equals(s2)` is `true`)."
          },
          {
            "question": "How does Java handle passing object references as method arguments?",
            "options": [
              "Strictly Pass-by-Value: The 32/64-bit memory reference address pointer is copied by value",
              "Pass-by-Reference: The caller's reference variable itself is passed and can be reassigned",
              "Pass-by-Copy: The entire object and all its fields are cloned onto the stack",
              "Pass-by-Name lazy evaluation"
            ],
            "correct": 0,
            "explanation": "Java is strictly pass-by-value. When an object reference is passed to a method, a copy of the memory address is passed. Modifying the object's fields mutates the shared heap instance, but reassigning the parameter variable does not affect the caller's reference."
          },
          {
            "question": "What is a 'Compressed OOP' (Ordinary Object Pointer) in 64-bit HotSpot JVMs?",
            "options": [
              "A 32-bit pointer that uses 8-byte object alignment to address up to 32 GB of Heap memory",
              "A zip algorithm applied to Java heap arrays",
              "A technique to compress bytecode instructions",
              "A mechanism to store strings in 7-bit ASCII"
            ],
            "correct": 0,
            "explanation": "Compressed OOPs (`-XX:+UseCompressedOops`) represent 64-bit memory pointers in 32 bits by leveraging 8-byte boundary alignment (shifting bits by 3), reducing pointer footprint by 50% on heaps up to 32 GB."
          },
          {
            "question": "When does an object on the Java Heap become eligible for Garbage Collection?",
            "options": [
              "When it is no longer reachable from any active GC Root (live stack frames, static fields, JNI handles)",
              "Immediately when a method ends, regardless of other references",
              "Only when the developer explicitly calls `delete`",
              "When its reference count reaches zero"
            ],
            "correct": 0,
            "explanation": "The JVM uses Tracing Garbage Collection (reachability analysis) starting from GC Roots. An object is eligible for GC when no path of strong references exists from any active GC root."
          },
          {
            "question": "What is the memory footprint of an empty `new Object()` on a 64-bit JVM with Compressed OOPs?",
            "options": [
              "16 bytes (8B Mark Word + 4B Klass Word + 4B padding to 8-byte boundary)",
              "0 bytes",
              "8 bytes",
              "32 bytes"
            ],
            "correct": 0,
            "explanation": "The object header requires 12 bytes (8 bytes Mark Word + 4 bytes Klass Word). The JVM pads all object sizes to multiples of 8 bytes, totaling 16 bytes."
          },
          {
            "question": "Which of the following creates an object that is NOT eligible for string deduplication in the SCP until `intern()` is called?",
            "options": [
              "`String str = new StringBuilder(\"data\").toString();`",
              "`String str = \"data\";`",
              "`String str = \"da\" + \"ta\";`",
              "`final String a = \"da\"; final String b = \"ta\"; String str = a + b;`"
            ],
            "correct": 0,
            "explanation": "Dynamic string concatenation via `StringBuilder` or `new String()` constructs objects in standard heap memory without registering them in the SCP until `str.intern()` is invoked explicitly."
          },
          {
            "question": "What happens to the JVM Stack Frame when a method finishes execution?",
            "options": [
              "The stack frame is popped in $\\mathcal{O}(1)$ time, instantly freeing all local primitive variables and references",
              "The Garbage Collector runs a sweep of the stack frame",
              "The stack frame is serialized to disk",
              "The local variables remain in memory until JVM shutdown"
            ],
            "correct": 0,
            "explanation": "Stack frame deallocation is a simple stack pointer decrement in $\\mathcal{O}(1)$ hardware execution, incurring zero GC overhead or memory leaks."
          }
        ]
      },
      {
        "id": "scene-java-3",
        "slideNumber": 3,
        "title": "Slide 3: Type Casting & Conversion (Widening vs Narrowing)",
        "slideSubtitle": "Implicit widening promotions, explicit narrowing truncation, and binary overflow arithmetic.",
        "takeaways": [
          "Widening Casting (Implicit / Automatic): Safe conversion from smaller to larger data types without explicit syntax (e.g. `int` to `long` or `float` to `double`).",
          "Narrowing Casting (Explicit / Lossy): Converting larger types into smaller types requires explicit `(type)` syntax and discards higher-order bits via truncation.",
          "Binary Numeric Promotion: The JVM automatically promotes `byte`, `short`, and `char` operands to 32-bit `int` before performing any arithmetic operations.",
          "Integer Overflow Wraparound: Integer bounds operate strictly in two's complement modular arithmetic without throwing exceptions: `Integer.MAX_VALUE + 1` wraps to `Integer.MIN_VALUE`.",
          "Floating-Point to Integer Truncation: Casting a `double` or `float` to an integral type strictly truncates fractional digits toward zero (does not round)."
        ],
        "whiteboardContent": "# Type Casting & Arithmetic Promotion Rules\n\n### 1. The Widening Hierarchy (Automatic & Lossless):\n$$\\text{byte (1B)} \\longrightarrow \\text{short (2B)} \\longrightarrow \\text{int (4B)} \\longrightarrow \\text{long (8B)} \\longrightarrow \\text{float (4B)} \\longrightarrow \\text{double (8B)}$$\n$$\\text{char (2B)} \\longrightarrow \\text{int (4B)}$$\n\n---\n\n### 2. Binary Numeric Promotion Rule:\n$$\\text{byte } a = 10; \\quad \\text{byte } b = 20;$$\n$$\\text{byte } c = a + b; \\quad \\implies \\mathbf{\\text{Compile Error! Operands promoted to int (4 Bytes)}}$$\n$$\\text{byte } c = (\\text{byte})(a + b); \\quad \\implies \\mathbf{\\text{Valid (Explicit Cast required)}}$$\n\n---\n\n### 3. Bit-Truncation in Narrowing:\n$$\\text{int } x = 130 \\implies 00000000\\ 00000000\\ 00000000\\ 10000010_2$$\n$$\\text{byte } b = (\\text{byte})x \\implies 10000010_2 = -128 + 2 = \\mathbf{-126}$$",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     NARROWING CAST BIT-TRUNCATION                        │\n├──────────────────────────────────────────────────────────────────────────┤\n│ 32-bit int value = 130:                                                  │\n│ [ 00000000 ] [ 00000000 ] [ 00000000 ] [ 10000010 ] (Higher 24 bits)    │\n│   │ (DISCARDED BY JVM NARROWING) │          │                            │\n│   ▼                              ▼          ▼                            │\n│ 8-bit byte result = (byte) 130:           [ 10000010 ]                   │\n│                                           Two's Complement: -126         │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "public class TypeCastingDemo {\n    public static void main(String[] args) {\n        // 1. Widening: Automatic (No cast required)\n        int count = 100;\n        long bigCount = count;\n        double preciseVal = count;\n\n        // 2. Narrowing: Explicit cast required\n        double rawScore = 98.75;\n        int truncatedScore = (int) rawScore; // Value becomes 98\n\n        // 3. Overflow during Narrowing\n        int val = 130;\n        byte overflowedByte = (byte) val; // Discards top 24 bits -> becomes -126\n\n        // 4. Safe arithmetic with Math.addExact (Java 8+)\n        try {\n            int overflow = Math.addExact(Integer.MAX_VALUE, 1);\n        } catch (ArithmeticException ex) {\n            System.out.println(\"Caught detected overflow: \" + ex.getMessage());\n        }\n    }\n}",
        "terminalOutput": "[JAVA CASTING] Executed TypeCastingDemo.java\n>>> rawScore (98.75) cast to int: 98 (Fractional truncated toward zero)\n>>> int 130 cast to byte: -126 (Two's complement bit wraparound)\n>>> Caught detected overflow: integer overflow",
        "dialogue": [
          {
            "speaker": "alex",
            "text": "Why did `(byte) 130` turn into a negative number `-126`?"
          },
          {
            "speaker": "professor",
            "text": "Because Java bytes are signed 8-bit integers (-128 to 127). The binary representation of 130 has a 1 in the 8th bit, which in two's complement arithmetic designates the sign bit as negative!"
          },
          {
            "speaker": "maya",
            "text": "And that is why production systems use `Math.addExact()` or `Math.multiplyExact()` to fail-fast on financial balance overflows!"
          }
        ],
        "quizzes": [
          {
            "question": "What is 'Widening Primitive Conversion' (Implicit Type Casting) in Java?",
            "options": [
              "Automatic conversion of a smaller data type to a larger data type without loss of magnitude (e.g., int to long)",
              "Manual casting with parentheses to prevent compilation errors",
              "Converting an Object reference to its subclass",
              "Converting a double into an integer"
            ],
            "correct": 0,
            "explanation": "Widening primitive conversion happens automatically when assigning a smaller numeric type (e.g. `byte` -> `short` -> `int` -> `long` -> `float` -> `double`) because the destination type has equal or larger bit capacity."
          },
          {
            "question": "What occurs during 'Narrowing Primitive Conversion' when casting `int val = 130; byte b = (byte) val;`?",
            "options": [
              "`b` becomes `-126` due to higher-order bit truncation into 8-bit signed two's complement",
              "`b` becomes `127` (clamped to maximum)",
              "The JVM throws a runtime `NumericOverflowException`",
              "`b` becomes `0`"
            ],
            "correct": 0,
            "explanation": "130 in binary is `00000000 00000000 00000000 10000010`. Casting to `byte` retains only the lowest 8 bits `10000010`, which in 8-bit signed two's complement represents `-128 + 2 = -126`."
          },
          {
            "question": "What is 'Binary Numeric Promotion' in Java arithmetic expressions like `byte a = 10; byte b = 20; byte c = a + b;`?",
            "options": [
              "Compilation Error: Operands are automatically promoted to `int`, so `a + b` results in an `int` that cannot be assigned to `byte` without a cast",
              "It compiles cleanly and assigns 30 to `c`",
              "Operands are promoted to `long` automatically",
              "`a` and `b` are concatenated as strings"
            ],
            "correct": 0,
            "explanation": "Java bytecodes automatically promote smaller integral types (`byte`, `short`, `char`) to 32-bit `int` before performing arithmetic. Thus `a + b` produces an `int` (30), which requires explicit cast `(byte)(a + b)`."
          },
          {
            "question": "What is the value of `(int) 3.99` in Java?",
            "options": [
              "3 (truncates toward zero)",
              "4 (rounds up)",
              "3.99",
              "Compilation Error"
            ],
            "correct": 0,
            "explanation": "Casting a floating-point number to an integer in Java always truncates the fractional digits toward zero (it does not round to nearest integer)."
          },
          {
            "question": "What happens when `int max = Integer.MAX_VALUE; max = max + 1;` executes?",
            "options": [
              "It wraps around silently to `Integer.MIN_VALUE` (-2,147,483,648) due to two's complement overflow",
              "It throws an `ArithmeticException`",
              "It stays at `Integer.MAX_VALUE`",
              "It automatically upgrades `max` to a `long`"
            ],
            "correct": 0,
            "explanation": "Java integer arithmetic does not throw overflow exceptions by default. `2,147,483,647 + 1` flips the sign bit (`0111...11` -> `1000...00`), producing `-2,147,483,648`."
          },
          {
            "question": "Which class in `java.lang.Math` provides methods that throw `ArithmeticException` on integer overflow?",
            "options": [
              "`Math.addExact()`, `Math.multiplyExact()`, `Math.toIntExact()`",
              "`Math.safeAdd()`, `Math.safeMultiply()`",
              "`Math.checkedAdd()`, `Math.strictMultiply()`",
              "`Math.overflowAdd()`"
            ],
            "correct": 0,
            "explanation": "Java 8 introduced `Math.*Exact()` methods (e.g. `Math.addExact(a, b)`, `Math.toIntExact(longVal)`) that detect integer overflow and immediately throw `ArithmeticException: integer overflow`."
          },
          {
            "question": "What is the result of casting `double d = Double.NaN; int i = (int) d;`?",
            "options": [
              "0",
              "-1",
              "Integer.MIN_VALUE",
              "Throws ArithmeticException"
            ],
            "correct": 0,
            "explanation": "Per the Java Language Specification (§5.1.3), converting `Double.NaN` to `int` or `long` yields `0`."
          },
          {
            "question": "What is the result of `System.out.println(1.0 / 0.0);` in Java?",
            "options": [
              "`Infinity`",
              "Throws `ArithmeticException: / by zero`",
              "`NaN`",
              "`-Infinity`"
            ],
            "correct": 0,
            "explanation": "Floating-point division by zero in IEEE 754 arithmetic yields positive or negative `Infinity` (or `NaN` for `0.0 / 0.0`), without throwing an exception. Only integer division `1 / 0` throws `ArithmeticException`."
          },
          {
            "question": "Can a `boolean` be cast to an `int` or any other primitive type in Java?",
            "options": [
              "No: `boolean` cannot be converted to or from any other primitive type, even with explicit casting",
              "Yes, using `(int) true` which yields 1",
              "Yes, using `(byte) false` which yields 0",
              "Yes, if `-Xlint:boolean-cast` flag is enabled"
            ],
            "correct": 0,
            "explanation": "In Java, `boolean` is not treated as a number and has no relationship with integral types. Expressions like `(int)true` or `(boolean)1` cause compile-time errors."
          },
          {
            "question": "Which widening conversion can result in a loss of numerical precision (least significant bits)?",
            "options": [
              "`long` to `float` (64-bit int to 32-bit float with only 24-bit significand)",
              "`byte` to `short`",
              "`short` to `int`",
              "`int` to `long`"
            ],
            "correct": 0,
            "explanation": "Although `long` to `float` and `int` to `float` are valid widening conversions, `float` has only a 24-bit mantissa (significand). Converting a large `long` or `int` to `float` may lose least-significant precision bits."
          }
        ]
      },
      {
        "id": "scene-java-4",
        "slideNumber": 4,
        "title": "Slide 4: Autoboxing, Cache Pools & Performance Pitfalls",
        "slideSubtitle": "Wrapper objects, IntegerCache (-128 to 127), null unboxing NPEs, and high-frequency memory bloat.",
        "takeaways": [
          "Autoboxing & Unboxing: The compiler automatically transforms `int` to `Integer.valueOf(int)` and `Integer` to `Integer.intValue()`.",
          "The Integer Cache Pool: Java caches wrapper objects for values `-128` through `127` in `IntegerCache`, causing reference identity `==` to be true for 100 but false for 200.",
          "NullPointerException on Unboxing: Attempting to unbox a `null` wrapper object (e.g. `Integer count = null; int val = count;`) throws an immediate runtime NullPointerException.",
          "Memory Bloat of Wrapper Objects: Primitive `int` consumes 4 bytes on stack; `Integer` consumes 16 bytes on Heap + 4-8 byte pointer (400% memory overhead).",
          "Primitive Streams Optimization: Use `IntStream`, `LongStream`, and `DoubleStream` in high-throughput pipelines to completely bypass wrapper allocation overhead."
        ],
        "whiteboardContent": "# Autoboxing Mechanics & The Integer Cache\n\n### 1. Compilation Transformation:\n$$\\text{Integer } x = 42; \\quad \\implies \\quad \\text{Integer } x = \\mathbf{Integer.valueOf(42)};$$\n$$\\text{int } y = x; \\quad \\implies \\quad \\text{int } y = \\mathbf{x.intValue()};$$\n\n---\n\n### 2. The IntegerCache (-128 to 127) Trap:\n$$\\text{Integer } a = 100; \\quad \\text{Integer } b = 100; \\quad \\implies a == b \\text{ (\\textbf{True: Shared Cache Object})}$$\n$$\\text{Integer } c = 200; \\quad \\text{Integer } d = 200; \\quad \\implies c == d \\text{ (\\textbf{False: Distinct Heap Allocations})}$$\n$$\\mathbf{\\text{Golden Rule: Always use } c.equals(d) \\text{ for object value comparisons!}}$$\n\n---\n\n### 3. Memory Footprint Comparison:\n* **Primitive `int` (Stack):** **4 Bytes** (0% GC overhead)\n* **Boxed `Integer` (Heap):** **16 Bytes Object Header/Payload + 4B Stack Reference = 20 Bytes** (500% memory bloat!)",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     THE JVM INTEGER CACHE POOL (-128 to 127)             │\n├──────────────────────────────────────────────────────────────────────────┤\n│ [ Integer a = 100 ] ───┐                                                 │\n│                        ├────> [ Pre-Allocated IntegerCache Pool: 100 ]   │\n│ [ Integer b = 100 ] ───┘      (a == b is TRUE: Same memory address)      │\n│                                                                          │\n│ [ Integer c = 200 ] ────────> [ Heap Object Instance 1: Value = 200 ]   │\n│ [ Integer d = 200 ] ────────> [ Heap Object Instance 2: Value = 200 ]   │\n│                               (c == d is FALSE: Different addresses!)    │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "public class AutoboxingPitfallsDemo {\n    public static void main(String[] args) {\n        // 1. Integer Cache behavior\n        Integer a = 127;\n        Integer b = 127;\n        System.out.println(\"127 == 127: \" + (a == b)); // true (cached)\n\n        Integer x = 128;\n        Integer y = 128;\n        System.out.println(\"128 == 128: \" + (x == y)); // false (new heap objects!)\n        System.out.println(\"x.equals(y): \" + x.equals(y)); // true (value equality)\n\n        // 2. The Hidden 1-Billion Object Allocation Anti-Pattern\n        long start = System.currentTimeMillis();\n        Long sum = 0L; // BAD: Boxed Long in loop allocates millions of objects!\n        for (long i = 0; i < 1_000_000; i++) {\n            sum += i; // Unboxes sum, adds i, autoboxes new Long object!\n        }\n        long elapsed = System.currentTimeMillis() - start;\n        System.out.println(\"Boxed loop elapsed: \" + elapsed + \"ms (Allocated 1M objects)\");\n    }\n}",
        "terminalOutput": "[JVM BENCHMARK] AutoboxingPitfallsDemo.java\n>>> 127 == 127: true (Cached in IntegerCache pool)\n>>> 128 == 128: false (Distinct heap allocations!)\n>>> x.equals(y): true (Safe value comparison)\n>>> Boxed loop elapsed: 14ms (Triggered GC pauses) | Primitive loop: 0ms (Vectorized ALU)",
        "dialogue": [
          {
            "speaker": "alex",
            "text": "Wait, why does `127 == 127` return true, but `128 == 128` return false? That is terrifying!"
          },
          {
            "speaker": "professor",
            "text": "This is one of the most famous Java interview traps! Java caches wrapper objects between -128 and 127 to save memory. Beyond 127, every autobox allocates a brand new object. Always use `.equals()` for wrappers!"
          },
          {
            "speaker": "maya",
            "text": "And in high-throughput engines, never use boxed `Long` in loops. Replacing `Long sum` with primitive `long sum` makes your loops 20x faster with zero Garbage Collection overhead."
          }
        ],
        "quizzes": [
          {
            "question": "What is the cached integer range pre-allocated by `Integer.valueOf()` in Java (Integer Cache Pool)?",
            "options": [
              "-128 to 127",
              "0 to 255",
              "-256 to 255",
              "-1024 to 1023"
            ],
            "correct": 0,
            "explanation": "The JVM pre-allocates and caches `Integer` wrapper objects for the range `-128` to `127` in the `IntegerCache` inner class to avoid excessive heap allocations."
          },
          {
            "question": "What is the output of `Integer a = 100; Integer b = 100; System.out.println(a == b);`?",
            "options": [
              "`true`, because values between -128 and 127 are returned from the Integer Cache Pool",
              "`false`, because `==` checks object identity on separate heap allocations",
              "`false`, because autoboxing creates unique objects",
              "Throws NullPointerException"
            ],
            "correct": 0,
            "explanation": "100 falls inside the default Integer Cache (`-128` to `127`). `a` and `b` both reference the identical pre-cached `Integer` object instance in heap memory, so `a == b` is `true`."
          },
          {
            "question": "What is the output of `Integer a = 200; Integer b = 200; System.out.println(a == b);`?",
            "options": [
              "`false`, because 200 is outside the Integer Cache, causing two distinct heap objects to be instantiated",
              "`true`, because the numbers are equal",
              "`true`, because Java caches all positive integers",
              "Compilation Error"
            ],
            "correct": 0,
            "explanation": "200 is outside the default `-128` to `127` cache range. Autoboxing calls `new Integer(200)` for each, producing two separate heap objects with distinct memory addresses. Use `.equals()` to compare values."
          },
          {
            "question": "What happens when an uninitialized wrapper object `Integer count = null;` is unboxed in `int num = count;`?",
            "options": [
              "Throws a runtime `NullPointerException` during implicit `.intValue()` invocation",
              "`num` defaults to 0",
              "Compilation Error: Cannot assign null to int",
              "`num` becomes -1"
            ],
            "correct": 0,
            "explanation": "Unboxing compiles to an invocation of `count.intValue()`. Calling `.intValue()` on a `null` reference causes an immediate runtime `NullPointerException`."
          },
          {
            "question": "Why does accumulating numbers using `Long sum = 0L; for(long i = 0; i < 1_000_000; i++) sum += i;` cause massive performance degradation?",
            "options": [
              "Every iteration unboxes `sum`, adds `i`, and autoboxes a brand-new `Long` object on the heap (1 million object allocations)",
              "`Long` is limited to 10,000 iterations",
              "The CPU cannot perform arithmetic on 64-bit values",
              "Garbage collection freezes the thread permanently"
            ],
            "correct": 0,
            "explanation": "`sum += i` unboxes `sum.longValue()`, computes `sum + i`, and allocates a new `Long` instance on the heap every single loop iteration, creating 1,000,000 short-lived objects and triggering heavy GC pressure."
          },
          {
            "question": "Which JVM command-line flag allows configuring the upper bound of the Integer Cache?",
            "options": [
              "`-XX:AutoBoxCacheMax=<size>`",
              "`-XX:IntegerCacheSize=<size>`",
              "`-Djava.lang.Integer.cache.max=<size>`",
              "`-XX:MaxBoxPool=<size>`"
            ],
            "correct": 0,
            "explanation": "The upper limit of the Integer cache can be tuned using `-XX:AutoBoxCacheMax=<size>` or `-Djava.lang.Integer.IntegerCache.high=<size>`."
          },
          {
            "question": "Which of the following wrapper types in Java also maintain fixed cached pools?",
            "options": [
              "`Byte`, `Short`, `Long` (-128 to 127), `Character` (0 to 127), and `Boolean` (TRUE and FALSE)",
              "Only `Integer` and `String`",
              "`Float` and `Double` (-1.0 to 1.0)",
              "All wrapper classes including Float and Double"
            ],
            "correct": 0,
            "explanation": "`Byte`, `Short`, `Long` (all for -128 to 127), `Character` (0 to 127), and `Boolean` (TRUE/FALSE) have fixed cache pools. `Float` and `Double` do NOT cache values due to infinite decimal representations."
          },
          {
            "question": "What is the memory size difference between a primitive `int` (4 bytes) and an `Integer` object on a 64-bit JVM with Compressed OOPs?",
            "options": [
              "`int` is 4 bytes; `Integer` is 16 bytes (12B header + 4B payload) — a 400% memory overhead",
              "`int` and `Integer` both take 4 bytes",
              "`Integer` takes 64 bytes",
              "`Integer` takes 8 bytes"
            ],
            "correct": 0,
            "explanation": "An `Integer` object contains a 12-byte object header and a 4-byte `int` field, totaling 16 bytes on the heap (plus an additional 4-8 bytes for the reference pointer), compared to 4 bytes for primitive `int`."
          },
          {
            "question": "What is the recommended Java Streams interface to avoid autoboxing overhead when processing numeric sequences?",
            "options": [
              "Primitive streams: `IntStream`, `LongStream`, and `DoubleStream`",
              "`Stream<Integer>`, `Stream<Long>`, `Stream<Double>`",
              "`BoxedStream<T>`",
              "`FastStream<Object>`"
            ],
            "correct": 0,
            "explanation": "`IntStream`, `LongStream`, and `DoubleStream` operate directly on unboxed primitive values in stack memory without wrapping elements in `Integer`/`Long`/`Double` objects."
          },
          {
            "question": "What is the output of `Boolean b1 = Boolean.valueOf(\"true\"); Boolean b2 = true; System.out.println(b1 == b2);`?",
            "options": [
              "`true`, because `Boolean` only ever returns pre-instantiated singleton `Boolean.TRUE` or `Boolean.FALSE`",
              "`false`, because `valueOf` creates a new instance",
              "Throws IllegalArgumentException",
              "`false`, because one is a literal and one is a method call"
            ],
            "correct": 0,
            "explanation": "`Boolean.valueOf()` and autoboxed boolean literals always return the static immutable constants `Boolean.TRUE` or `Boolean.FALSE`, guaranteeing identical reference equality."
          }
        ]
      }
    ]
  },
  {
    "id": "raft-consensus",
    "title": "Distributed Systems: Raft Consensus & Byzantine Fault Tolerance",
    "subject": "Distributed Computing & Fault Tolerant Systems",
    "difficulty": "Advanced Systems Architecture",
    "duration": "30 mins",
    "tags": [
      "Distributed Systems",
      "Raft",
      "Consensus",
      "Fault Tolerance",
      "Paxos"
    ],
    "professor": {
      "name": "Prof. Vyomra",
      "role": "Lead AI Professor of Distributed Systems & Cloud Infrastructure",
      "avatar": "👨‍🏫",
      "voicePitch": 0.95,
      "voiceRate": 0.98
    },
    "classmates": [
      {
        "id": "alex",
        "name": "Alex",
        "title": "Alex (Curious Skeptic)",
        "avatar": "🧑‍💻",
        "color": "text-amber-400",
        "role": "Edge-Case Specialist",
        "pitch": 1.2
      },
      {
        "id": "maya",
        "name": "Maya",
        "title": "Maya (Performance Hacker)",
        "avatar": "👩‍💻",
        "color": "text-cyan-400",
        "role": "Memory & Low-Level",
        "pitch": 1.3
      }
    ],
    "scenes": [
      {
        "id": "scene-raft-1",
        "slideNumber": 1,
        "title": "Slide 1: State Machine Replication & The Consensus Problem",
        "slideSubtitle": "How distributed nodes agree on a deterministic log of state transitions under network delays and crash faults.",
        "takeaways": [
          "Consensus Invariant: All non-faulty nodes in a distributed cluster must agree on the identical sequence of state machine log entries in the identical order.",
          "Quorum Formula: A Raft cluster of N nodes requires a strict majority quorum of at least Q = floor(N/2) + 1 nodes to elect leaders and commit entries.",
          "Fail-Stop Model: Standard Raft assumes asynchronous non-byzantine networks where packets can be delayed, duplicated, or dropped, and nodes may crash and recover.",
          "State Machine Replication (SMR): Deterministic state machines started in the same initial state will produce the exact same final state when fed identical logs.",
          "Linearizability Guarantee: Raft provides linearizable (strongly consistent) client reads and writes across the entire distributed cluster."
        ],
        "whiteboardContent": "# Distributed Consensus & State Machine Replication\n\n### The Fundamental Quorum Invariant:\n$$\\text{Quorum Size } Q = \\left\\lfloor \\frac{N}{2} \\right\\rfloor + 1$$\n$$\\text{Maximum Tolerable Faults } F = \\left\\lfloor \\frac{N-1}{2} \\right\\rfloor$$\n\n| Cluster Size ($N$) | Quorum ($Q$) | Max Failures Tolerated ($F$) |\n| :--- | :--- | :--- |\n| 3 nodes | 2 nodes | 1 node |\n| 5 nodes | 3 nodes | 2 nodes |\n| 7 nodes | 4 nodes | 3 nodes |\n\n---\n\n### The FLP Impossibility Theorem (Fischer, Lynch, Paterson):\n* In a purely asynchronous network, no deterministic consensus protocol can guarantee both safety (agreement) and liveness (termination) with even a single unannounced crash fault.\n* **Raft's Resolution:** Guarantees absolute safety under all asynchronous conditions; uses **randomized election timers** to achieve liveness with high probability!",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     STATE MACHINE REPLICATION (SMR)                      │\n├──────────────────────────────────────────────────────────────────────────┤\n│  [ Client Write: set x=10 ] ──> [ Raft Leader (Node 1) ]                 │\n│                                       │ AppendEntries RPC                │\n│                         ┌─────────────┴─────────────┐                    │\n│                         ▼                           ▼                    │\n│               [ Follower (Node 2) ]       [ Follower (Node 3) ]          │\n│               [ Log: (T:1, idx:1) ]       [ Log: (T:1, idx:1) ]          │\n│                         │                           │                    │\n│                         └───────────┬───────────────┘                    │\n│                                     ▼ (Quorum Reached: 3/3 Acks)         │\n│                    [ Commit Index Advanced & Applied to KV Store ]       │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// Raft State Machine Replication Invariant in Java\npublic class RaftNode {\n    private int currentTerm = 0;\n    private Integer votedFor = null;\n    private final List<LogEntry> log = new ArrayList<>();\n    private int commitIndex = 0;\n    private int lastApplied = 0;\n    \n    public synchronized boolean isQuorumReached(int matchCount, int clusterSize) {\n        int quorum = (clusterSize / 2) + 1;\n        return matchCount >= quorum;\n    }\n}",
        "terminalOutput": "[RAFT CLUSTER] 5 Nodes initialized. Quorum required: 3.\n>>> Node 1 elected Leader for Term 1.\n>>> Replicating Entry (Term: 1, Index: 1, Cmd: \"SET x=10\")...\n>>> Acknowledged by Node 2, Node 3. Quorum reached (3/5). Entry Committed!",
        "dialogue": [
          {
            "speaker": "professor",
            "text": "Welcome to Distributed Systems! In State Machine Replication, as long as all servers execute the exact same sequence of log entries, they will arrive at the identical state."
          },
          {
            "speaker": "alex",
            "text": "Professor, why can a 5-node cluster only tolerate 2 failures? Why not 3?"
          },
          {
            "speaker": "professor",
            "text": "Great question, Alex! Because if 3 nodes fail, only 2 remain. 2 is not a strict majority of 5 (you need 3). If 2 nodes were allowed to make decisions, a network partition could create two separate majorities, causing catastrophic Split-Brain!"
          }
        ],
        "quizzes": [
          {
            "question": "What is the core objective of State Machine Replication (SMR) in distributed systems?",
            "options": [
              "To ensure all deterministic replica nodes execute the exact identical sequence of log commands in the identical order",
              "To duplicate the operating system kernel across all cluster nodes",
              "To eliminate all network latency between data centers",
              "To automatically restart crashed server instances"
            ],
            "correct": 0,
            "explanation": "State Machine Replication guarantees that multiple distributed replica nodes running deterministic state machines process the exact same sequence of state transitions from an identical append-only log, arriving at identical state."
          },
          {
            "question": "In a Raft cluster of $N = 5$ nodes, what is the minimum quorum size required to elect a leader and commit log entries?",
            "options": [
              "3 nodes ($Q = \\lfloor 5/2 \\rfloor + 1$)",
              "4 nodes",
              "5 nodes (Full unanimity)",
              "2 nodes"
            ],
            "correct": 0,
            "explanation": "Raft requires a strict majority quorum $Q = \\lfloor N/2 \\rfloor + 1$. For $N = 5$, any valid majority requires at least 3 nodes, allowing the system to tolerate up to $F = \\lfloor(N-1)/2\\rfloor = 2$ simultaneous node failures."
          },
          {
            "question": "What failure model does standard Raft consensus assume?",
            "options": [
              "Crash-Recovery (Fail-Stop) with non-byzantine network delays and packet drops",
              "Byzantine Faults (Malicious nodes sending conflicting messages)",
              "Zero packet loss and synchronous clock synchronization",
              "Hardware-enforced shared memory"
            ],
            "correct": 0,
            "explanation": "Raft operates in the asynchronous Fail-Stop / Crash-Recovery model where nodes may crash, delay, or drop messages, but nodes do NOT behave maliciously or forge messages (non-Byzantine)."
          },
          {
            "question": "According to the FLP Impossibility Theorem (Fischer, Lynch, Paterson), what is impossible in an asynchronous distributed network?",
            "options": [
              "Guaranteeing BOTH safety and deterministic termination (liveness) in the presence of even a single unannounced node crash",
              "Replicating databases across wide area networks",
              "Encrypting messages between servers",
              "Using timestamps to order transactions"
            ],
            "correct": 0,
            "explanation": "FLP Impossibility proves that no deterministic consensus protocol can guarantee both absolute safety (agreement) and liveness (termination) in a purely asynchronous network if even one node can crash."
          },
          {
            "question": "How does Raft circumvent the FLP Impossibility theorem in practical deployments?",
            "options": [
              "By introducing randomized election timers (partial synchrony / randomized liveness) while maintaining deterministic safety",
              "By requiring atomic GPS clocks on every server",
              "By ignoring crashed nodes permanently",
              "By disabling network timeouts"
            ],
            "correct": 0,
            "explanation": "Raft guarantees safety under all asynchronous conditions, and achieves liveness with high probability by using randomized election timers to prevent perpetual split votes."
          },
          {
            "question": "What is the maximum number of failed nodes $F$ a Raft cluster of size $N$ can tolerate while remaining fully operational?",
            "options": [
              "$F = \\lfloor (N - 1) / 2 \\rfloor$",
              "$F = N - 1$",
              "$F = N / 2$",
              "$F = \\lfloor N / 3 \\rfloor$"
            ],
            "correct": 0,
            "explanation": "A majority quorum requires at least $\\lfloor N/2 \\rfloor + 1$ live nodes. Therefore, the maximum allowable failures is $F = \\lfloor (N-1)/2 \\rfloor$ (e.g., 1 failure in 3 nodes, 2 failures in 5 nodes, 3 failures in 7 nodes)."
          },
          {
            "question": "Why are odd cluster sizes (3, 5, 7) standard practice in Raft deployments rather than even sizes (4, 6)?",
            "options": [
              "An even cluster of 4 nodes has the same fault tolerance ($F=1$) as a 3-node cluster, but requires 3 nodes for quorum instead of 2 (wasting resources)",
              "Raft mathematical proofs fail on even numbers",
              "Even numbers cause hard CPU deadlock in Raft RPCs",
              "Even node counts cannot use TCP networking"
            ],
            "correct": 0,
            "explanation": "A 4-node cluster requires $\\lfloor 4/2 \\rfloor + 1 = 3$ nodes for quorum, meaning it can only tolerate $4 - 3 = 1$ failure — identical to a 3-node cluster, but with higher communication overhead and lower availability."
          },
          {
            "question": "What guarantee does 'Linearizability' provide in a distributed key-value store backed by Raft?",
            "options": [
              "Every read operation returns the result of the most recent write in real-time order as if executing on a single atomic machine",
              "Writes are batched and executed once per hour",
              "Reads are always served from the nearest follower without coordination",
              "Data is replicated linearly in a circle across nodes"
            ],
            "correct": 0,
            "explanation": "Linearizability (strong consistency) provides the illusion of a single global atomic state machine where all operations appear to execute instantaneously at a specific point between their invocation and response."
          },
          {
            "question": "What is the primary architectural difference between Multi-Paxos and Raft?",
            "options": [
              "Raft decomposes consensus into explicit, sequential sub-problems (Leader Election, Log Replication, Safety) with strong leader-driven invariants",
              "Multi-Paxos does not support log replication",
              "Raft uses Byzantine cryptography for all messages",
              "Multi-Paxos is only for single-node systems"
            ],
            "correct": 0,
            "explanation": "Raft was explicitly designed for understandability, dividing consensus into independent stages (Leader Election, Log Replication, Safety) and enforcing strong leadership where log entries only flow from the leader to followers."
          },
          {
            "question": "What happens if a client sends a write command to a Raft Follower instead of the Leader?",
            "options": [
              "The follower redirects the client to the current known leader (or forwards the command internally)",
              "The follower rejects the command with an HTTP 500 error permanently",
              "The follower executes the write locally and becomes the leader",
              "The cluster shuts down"
            ],
            "correct": 0,
            "explanation": "Followers do not accept writes directly. They either return a redirect response containing the current leader's network address or proxy the request directly to the leader."
          }
        ]
      },
      {
        "id": "scene-raft-2",
        "slideNumber": 2,
        "title": "Slide 2: Leader Election & Randomized Heartbeat Timers",
        "slideSubtitle": "Follower timeouts, RequestVote RPCs, term increments, and split-vote mitigation.",
        "takeaways": [
          "3 Node States: Every Raft node transitions between Follower (passive), Candidate (seeking votes), and Leader (active replication).",
          "Randomized Election Timers (150ms–300ms): Solves the split-vote problem by ensuring one follower times out and claims the election before competitors.",
          "Term Numbers as Logical Clocks: Terms detect obsolete information; any node receiving a message with a higher term immediately converts to Follower.",
          "Election Safety: At most one leader can be elected in any given term because each node grants at most one vote per term on a first-come basis.",
          "Leader Completeness: A candidate's log must be at least as up-to-date as the voter's log (higher lastLogTerm, or longer log) to receive a vote."
        ],
        "whiteboardContent": "# Raft Leader Election & State Transitions\n\n### The 3 Node Roles:\n$$\\text{Follower } \\xrightarrow{\\text{Election Timeout}} \\text{Candidate } \\xrightarrow{\\text{Majority Votes}} \\text{Leader}$$\n$$\\text{Leader / Candidate } \\xrightarrow{\\text{Encounter Higher Term}} \\text{Follower}$$\n\n---\n\n### RequestVote RPC Voting Rule:\nA node grants its vote to candidate $C$ for term $T$ if and only if:\n1. $T \\ge \\text{currentTerm}$ and ($\\text{votedFor} == \\text{null}$ or $\\text{votedFor} == C$).\n2. **Log Up-to-Date Rule:**\n   $$(\\text{lastLogTerm}_C > \\text{lastLogTerm}_V) \\lor (\\text{lastLogTerm}_C == \\text{lastLogTerm}_V \\land \\text{lastLogIndex}_C \\ge \\text{lastLogIndex}_V)$$",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     RAFT NODE STATE MACHINE TRANSITIONS                  │\n├──────────────────────────────────────────────────────────────────────────┤\n│             ┌──────────────────────────────────────────────┐             │\n│             │                  FOLLOWER                    │             │\n│             └──────────────────────┬───────────────────────┘             │\n│                                    │ Election Timeout Expires            │\n│                                    ▼ (Increments Term, Votes for Self)   │\n│             ┌──────────────────────────────────────────────┐             │\n│             │                  CANDIDATE                   │             │\n│             └──────┬────────────────────────────────┬──────┘             │\n│                    │ Receives Majority Votes        │ Discovers Higher   │\n│                    ▼                                │ Term or Leader     │\n│             ┌──────────────────────┐                ▼                    │\n│             │        LEADER        │ ────────> [ Converts to Follower ]  │\n│             └──────────────────────┘                                     │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// RequestVote RPC Implementation in Java\npublic synchronized VoteResponse handleRequestVote(RequestVoteArgs args) {\n    if (args.term > this.currentTerm) {\n        this.currentTerm = args.term;\n        this.state = NodeState.FOLLOWER;\n        this.votedFor = null;\n    }\n    boolean canVote = (this.votedFor == null || this.votedFor == args.candidateId);\n    boolean isLogUpToDate = isCandidateLogUpToDate(args.lastLogTerm, args.lastLogIndex);\n    \n    if (args.term == this.currentTerm && canVote && isLogUpToDate) {\n        this.votedFor = args.candidateId;\n        resetElectionTimeout();\n        return new VoteResponse(this.currentTerm, true);\n    }\n    return new VoteResponse(this.currentTerm, false);\n}",
        "terminalOutput": "[NODE 3: ELECTION TIMER EXPIRED (214ms)]\n>>> State: FOLLOWER -> CANDIDATE | Increment Term to 2\n>>> Broadcast RequestVote(term: 2, candidateId: 3, lastLogTerm: 1, lastLogIdx: 4)\n>>> Received Votes: Node 3 (self), Node 1, Node 2 (3/5 Majority)\n>>> State: CANDIDATE -> LEADER for Term 2! Sending Heartbeats...",
        "dialogue": [
          {
            "speaker": "maya",
            "text": "Why are randomized election timeouts between 150ms and 300ms so crucial?"
          },
          {
            "speaker": "professor",
            "text": "Without randomization, if the leader dies, all followers would timeout at the exact same millisecond, vote for themselves, split the votes evenly, and get stuck in an endless loop of failed elections!"
          },
          {
            "speaker": "alex",
            "text": "So the random timer guarantees one node wakes up first and collects votes before the others!"
          }
        ],
        "quizzes": [
          {
            "question": "What are the three distinct runtime states a Raft node can transition between?",
            "options": [
              "Follower, Candidate, Leader",
              "Master, Worker, Standby",
              "Primary, Secondary, Arbiter",
              "Active, Idle, Dead"
            ],
            "correct": 0,
            "explanation": "A Raft node is always in one of three states: Follower (passive, responding to RPCs), Candidate (seeking votes during an election), or Leader (handling client requests and driving log replication)."
          },
          {
            "question": "Why does Raft use randomized election timeouts (e.g., 150ms to 300ms) for Followers?",
            "options": [
              "To ensure that in case of leader failure, one follower's timer expires first and claims the majority votes before others split the ballot",
              "To reduce CPU clock power consumption",
              "To ensure all nodes start elections simultaneously",
              "To synchronize local system clocks across nodes"
            ],
            "correct": 0,
            "explanation": "Randomized election timeouts break symmetry among followers. When a leader fails, one node's timer will expire first, incrementing its term and collecting votes before competitors start, minimizing split votes."
          },
          {
            "question": "What actions does a Follower take immediately upon its election timer expiring?",
            "options": [
              "Transitions to Candidate, increments `currentTerm`, votes for itself, and broadcasts `RequestVote` RPCs to all peers",
              "Declares itself leader immediately and starts writing logs",
              "Shuts down and waits for administrator reboot",
              "Sends a crash notification to client applications"
            ],
            "correct": 0,
            "explanation": "When an election timer fires without receiving a heartbeat, the follower converts to Candidate, increments its `currentTerm`, votes for itself, resets its election timer, and issues `RequestVote` RPCs in parallel."
          },
          {
            "question": "Under what condition will a Raft node grant its vote to a Candidate requesting it via `RequestVote`?",
            "options": [
              "If the candidate's term $\\ge$ node's `currentTerm`, the node hasn't voted for another candidate in this term, AND the candidate's log is at least as up-to-date as the voter's log",
              "If the candidate has the lowest node ID",
              "If the candidate has sent more heartbeats",
              "If the candidate's CPU utilization is lowest"
            ],
            "correct": 0,
            "explanation": "A voter grants its vote if: (1) `candidateTerm >= currentTerm`, (2) `votedFor == null` or `votedFor == candidateId`, and (3) Candidate's log is at least as up-to-date (comparing `lastLogTerm`, then `lastLogIndex`)."
          },
          {
            "question": "What determines whether Candidate A's log is 'more up-to-date' than Candidate B's log in Raft?",
            "options": [
              "Candidate A has a higher `lastLogTerm`, or if terms are equal, Candidate A has a greater `lastLogIndex`",
              "Candidate A has a shorter total log length",
              "Candidate A's machine has a faster clock speed",
              "Candidate A contains more client write commands"
            ],
            "correct": 0,
            "explanation": "Raft determines log currency by comparing the term of the last entry: higher term is more up-to-date. If both end in the same term, the longer log (higher index) is more up-to-date."
          },
          {
            "question": "What is the 'Election Safety' invariant guaranteed by Raft?",
            "options": [
              "At most one leader can be elected in any given term ($|\\text{Leaders}(\\text{term})| \\le 1$)",
              "Every node must become a leader at least once per hour",
              "Elections can only occur when all cluster nodes are online",
              "The leader cannot crash during an election"
            ],
            "correct": 0,
            "explanation": "Election Safety guarantees that at most one candidate can win an election in any given term, because each node votes at most once per term and winning requires a strict majority quorum."
          },
          {
            "question": "What happens when a Candidate receives a heartbeat (`AppendEntries` RPC) from another node claiming to be Leader for the same term?",
            "options": [
              "The candidate recognizes the legitimate leader, transitions back to Follower state, and resets its election timer",
              "The candidate ignores the heartbeat and continues requesting votes",
              "The candidate drops from the cluster permanently",
              "The candidate initiates a denial of service attack"
            ],
            "correct": 0,
            "explanation": "If a candidate receives an `AppendEntries` RPC from a leader whose term is $\\ge$ the candidate's `currentTerm`, it acknowledges the leader's authority and reverts to Follower."
          },
          {
            "question": "What happens if a split vote occurs (e.g. 2 candidates in a 4-node cluster each receive 2 votes)?",
            "options": [
              "No candidate wins a majority; timers expire and a new election starts with incremented terms and new random delays",
              "The candidate with the lowest IP address is declared winner",
              "The cluster enters permanent deadlock",
              "A Byzantine arbiter breaks the tie"
            ],
            "correct": 0,
            "explanation": "If votes are split and no candidate receives a majority, the election times out. Each candidate times out with fresh randomized delays, allowing one to restart and win in the next term."
          },
          {
            "question": "How frequently must a Raft Leader send heartbeat messages (`AppendEntries` with empty log entries) to Followers?",
            "options": [
              "At a heartbeat interval significantly smaller than the minimum election timeout (e.g., 20ms heartbeat vs 150ms timeout)",
              "Once every 10 seconds",
              "Only when a client sends a write command",
              "At the exact same interval as the election timeout"
            ],
            "correct": 0,
            "explanation": "To prevent followers from triggering false elections, the leader's heartbeat interval must satisfy $\\text{broadcastTime} \\ll \\text{heartbeatInterval} \\ll \\text{electionTimeout}$ (typically heartbeats every 20-50ms)."
          },
          {
            "question": "What must a Raft node do if it receives any RPC request or response with a `term > currentTerm`?",
            "options": [
              "Immediately update its `currentTerm = RPC.term`, set `votedFor = null`, and transition to Follower state",
              "Ignore the RPC and drop the connection",
              "Increment its own term to match and remain leader",
              "Throw an unrecoverable runtime exception"
            ],
            "correct": 0,
            "explanation": "In Raft, term numbers act as a logical clock. If any node encounters a higher term, its current state is stale, so it must immediately update its term and demote itself to Follower."
          }
        ]
      },
      {
        "id": "scene-raft-3",
        "slideNumber": 3,
        "title": "Slide 3: Log Replication, Commit Index & Two-Phase Commit",
        "slideSubtitle": "AppendEntries RPC, log consistency check, leader append-only invariant, and committing entries.",
        "takeaways": [
          "AppendEntries RPC Pipeline: The leader receives client writes, assigns the current term and index, appends locally, and broadcasts to followers.",
          "Log Consistency Invariant: When sending AppendEntries, the leader includes `prevLogIndex` and `prevLogTerm`. If the follower does not match, it rejects.",
          "Leader Append-Only: A leader never overwrites or truncates its own log; it only appends new entries.",
          "Commitment Rule: An entry is committed once replicated on a majority of nodes in the current term. Followers commit up to `min(leaderCommit, lastNewEntryIndex)`.",
          "Automatic Follower Log Repair: If a follower's log diverges after a partition, the leader decrements `nextIndex` until a common ancestor is found, then overwrites."
        ],
        "whiteboardContent": "# Log Replication & Consistency Verification\n\n### AppendEntries Consistency Check:\n$$\\text{Leader sends: } \\{ \\text{term}, \\text{prevLogIndex}, \\text{prevLogTerm}, \\text{entries}[], \\text{leaderCommit} \\}$$\n$$\\text{Follower verifies: } \\mathbf{\\text{log}[\\text{prevLogIndex}].\\text{term} == \\text{prevLogTerm}}$$\n* If match: Append new entries, advance commitIndex.\n* If mismatch: Reject RPC $\\implies$ Leader decrements `nextIndex[peer]` and retries.\n\n---\n\n### Log Matching Property (Inductive Proof):\n$$\\text{If } \\text{log}_1[i].\\text{term} == \\text{log}_2[i].\\text{term} \\implies \\text{log}_1[0..i] \\equiv \\text{log}_2[0..i]$$",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     RAFT LOG REPLICATION & REPAIR                        │\n├──────────────────────────────────────────────────────────────────────────┤\n│  LEADER (Term 3):                                                        │\n│  Index:  [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] [ 6 ] (commitIndex = 4)           │\n│  Term:   (T:1) (T:1) (T:2) (T:3) (T:3) (T:3)                             │\n│                                                                          │\n│  FOLLOWER A (Up to date):                                                │\n│  Term:   (T:1) (T:1) (T:2) (T:3) (T:3) ──> Appends Index 6 cleanly       │\n│                                                                          │\n│  FOLLOWER B (Diverged during old partition):                             │\n│  Term:   (T:1) (T:1) (T:1) (T:2) [X] ──> Leader forces overwrite from #3 │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// AppendEntries Log Replication in Java\npublic synchronized AppendEntriesResponse handleAppendEntries(AppendEntriesArgs args) {\n    if (args.term < this.currentTerm) return new AppendEntriesResponse(this.currentTerm, false);\n    \n    // Verify log consistency at prevLogIndex\n    if (args.prevLogIndex > 0) {\n        if (this.log.size() < args.prevLogIndex || this.log.get(args.prevLogIndex - 1).term != args.prevLogTerm) {\n            return new AppendEntriesResponse(this.currentTerm, false); // Mismatch! Retry\n        }\n    }\n    \n    // Append entries & truncate conflicting uncommitted tail\n    insertEntries(args.prevLogIndex, args.entries);\n    if (args.leaderCommit > this.commitIndex) {\n        this.commitIndex = Math.min(args.leaderCommit, this.log.size());\n        applyEntriesToStateMachine();\n    }\n    return new AppendEntriesResponse(this.currentTerm, true);\n}",
        "terminalOutput": "[LEADER] Client write: \"SET user:101 = Maya\"\n>>> Appended to Leader Log at Index 5 (Term 3).\n>>> Broadcast AppendEntries to Nodes 2, 3, 4, 5...\n>>> Node 2: ACK | Node 3: ACK | Node 4: ACK (Quorum 4/5 reached!)\n>>> Entry 5 COMMITTED and applied to State Machine. Client response: SUCCESS.",
        "dialogue": [
          {
            "speaker": "alex",
            "text": "What happens if a follower crashed for 10 minutes and missed 50 log entries?"
          },
          {
            "speaker": "professor",
            "text": "When it reconnects, the leader detects the mismatch, steps back through the log using `nextIndex`, and streams all missing entries in order until the follower is 100% synchronized!"
          }
        ],
        "quizzes": [
          {
            "question": "Which RPC is used by the Raft Leader to both replicate log entries and send periodic heartbeats?",
            "options": [
              "`AppendEntries` RPC",
              "`RequestVote` RPC",
              "`InstallSnapshot` RPC",
              "`ReplicateLog` RPC"
            ],
            "correct": 0,
            "explanation": "`AppendEntries` is the primary RPC used for log replication. When sent with an empty `entries[]` array, it serves as a periodic heartbeat to maintain leadership authority."
          },
          {
            "question": "What is the 'Log Matching Property' in Raft?",
            "options": [
              "If two logs contain an entry with the same index and term, they are identical in all entries up through the given index",
              "All nodes must have logs of identical byte size at all times",
              "Followers can reorder log entries to optimize disk writes",
              "Logs are matched against an external SQL database"
            ],
            "correct": 0,
            "explanation": "The Log Matching Property states that if two distinct node logs share an entry with identical index and term, they store the same command and their logs are completely identical in all preceding entries."
          },
          {
            "question": "When is a log entry considered 'Committed' in Raft?",
            "options": [
              "When the leader has successfully replicated it on a majority of cluster nodes in the current term ($> N/2$)",
              "As soon as the client transmits the HTTP request to the leader",
              "When the leader writes it to its local RAM buffer",
              "Only when all 100% of nodes in the cluster have acknowledged receipt"
            ],
            "correct": 0,
            "explanation": "A log entry is committed once the leader has written it to its own log and received acknowledgments from a strict majority ($> N/2$) of nodes for its current term."
          },
          {
            "question": "What is the 'Leader Append-Only' invariant in Raft?",
            "options": [
              "A leader never overwrites or truncates its own log entries; it only appends new entries",
              "Followers can append entries without leader approval",
              "The log size cannot exceed 100 entries",
              "Logs can only be modified during scheduled maintenance windows"
            ],
            "correct": 0,
            "explanation": "The Leader Append-Only property guarantees that a leader never modifies or truncates its own log. It only ever appends new entries to the end of its log."
          },
          {
            "question": "How does the Leader handle a Follower that rejects `AppendEntries` due to a log inconsistency?",
            "options": [
              "The leader decrements `nextIndex` for that follower and retries `AppendEntries` until a matching prefix is found",
              "The leader kicks the follower out of the cluster immediately",
              "The leader overwrites its own log with the follower's log",
              "The leader crashes itself"
            ],
            "correct": 0,
            "explanation": "If `AppendEntries` fails consistency checks, the leader decrements `nextIndex[peer]` and retries. Once a matching point is found, the follower truncates conflicting entries and appends the leader's entries."
          },
          {
            "question": "What parameters are sent in an `AppendEntries` RPC to enforce the Log Matching consistency check?",
            "options": [
              "`term`, `leaderId`, `prevLogIndex`, `prevLogTerm`, `entries[]`, `leaderCommit`",
              "`clientIP`, `checksum`, `totalNodes`",
              "`votedFor`, `lastSnapshotIndex`, `diskSpeed`",
              "`leaderPrivateKey`, `transactionSignature`"
            ],
            "correct": 0,
            "explanation": "The leader includes `prevLogIndex` and `prevLogTerm`. If the follower does not have an entry at `prevLogIndex` matching `prevLogTerm`, it rejects the RPC, ensuring log consistency before appending new entries."
          },
          {
            "question": "Why can't a Raft Leader directly commit a log entry from an OLDER term by simply counting majority replicas?",
            "options": [
              "A leader can only commit an entry from its current term by counting replicas; older entries are committed indirectly (Raft Figure 8 Safety invariant)",
              "Older entries have expired cryptographic signatures",
              "Older entries are automatically deleted on term changes",
              "TCP sockets cannot transmit historical data"
            ],
            "correct": 0,
            "explanation": "To prevent subtle overwrites of replicated entries (illustrated in Raft paper Figure 8), a leader cannot commit an entry from a prior term solely by replica counting; it must commit an entry from its *current* term."
          },
          {
            "question": "What is the role of the State Machine in Raft after a log entry is committed?",
            "options": [
              "The committed command is applied to the local state machine (e.g. updating key-value store state), and the result is returned to the client",
              "The state machine deletes the log entry to save RAM",
              "The state machine generates a new cryptographic key",
              "The state machine polls other followers"
            ],
            "correct": 0,
            "explanation": "Once an entry is committed (`commitIndex > lastApplied`), the node applies the entry's command to its local State Machine in strict index order, ensuring consistent state across all replicas."
          },
          {
            "question": "How does Raft prevent stale reads from a partitioned former leader (handling Phantom / Brain-Split reads)?",
            "options": [
              "The leader must exchange a round of heartbeat acknowledgments with a majority of nodes before responding to read-only queries (or use ReadIndex / LeaseRead)",
              "Reads are forbidden in distributed systems",
              "Followers reject all read requests",
              "The leader reads from local disk without checking other nodes"
            ],
            "correct": 0,
            "explanation": "To ensure linearizability, a leader must verify it hasn't been deposed by confirming a majority heartbeat round (`ReadIndex` protocol) before answering read queries to prevent serving stale data from a minority partition."
          },
          {
            "question": "When does a Raft node truncate its local log?",
            "options": [
              "When an incoming `AppendEntries` from a legitimate leader conflicts with uncommitted entries in the follower's log",
              "Every 5 minutes automatically",
              "When disk utilization reaches 50%",
              "Never under any circumstances"
            ],
            "correct": 0,
            "explanation": "A follower only truncates entries if an `AppendEntries` RPC from the current leader presents entries that conflict (different term) with existing *uncommitted* entries at that index."
          }
        ]
      },
      {
        "id": "scene-raft-4",
        "slideNumber": 4,
        "title": "Slide 4: Network Partitions, Split-Brain Protection & Joint Consensus",
        "slideSubtitle": "Minority vs majority partitions, higher term precedence, log overwrites, and cluster membership changes.",
        "takeaways": [
          "Split-Brain Prevention: In a partition, only the partition containing a strict majority (> N/2) can elect a leader or commit writes; the minority partition stalls safely.",
          "Higher Term Precedence: When a partition heals, the old leader in the minority sees the higher term from the majority leader and steps down to Follower immediately.",
          "Log Overwrite Invariant: Uncommitted entries generated in a minority partition are safely discarded and overwritten by the majority leader's authoritative log.",
          "Joint Consensus Configuration Changes: Safely adding or removing nodes requires a two-phase transition where both old and new configurations must grant majorities.",
          "Linearizable Reads (ReadIndex / LeaseRead): The leader must exchange heartbeats with a majority before returning read data to ensure it hasn't been deposed."
        ],
        "whiteboardContent": "# Network Partition & Split-Brain Analysis\n\n### 5-Node Cluster Partition Scenario: {N1, N2} vs {N3, N4, N5}\n* **Minority Partition {N1, N2}:**\n  * Old Leader $N1$ can only gather 2 votes out of 5 ($2/5 < 3$).\n  * Cannot reach Quorum $\\implies$ **Zero writes can commit. Preserves Safety!**\n* **Majority Partition {N3, N4, N5}:**\n  * Node $N3$ times out, increments Term to $T+1$, collects 3/5 votes, becomes new Leader.\n  * Reaches Quorum $\\implies$ **Accepts & commits writes normally.**\n\n---\n\n### Partition Healing Reconciliation:\n$$\\text{When partition heals: } N1 \\xrightarrow{\\text{Receives Term } T+1} \\text{Demotes to Follower} \\land \\text{Overwrites Uncommitted Tail}$$",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     NETWORK PARTITION RESOLUTION                         │\n├──────────────────────────────────────────────────────────────────────────┤\n│  MINORITY PARTITION (Cannot Commit) │  MAJORITY PARTITION (Authoritative)│\n│  ┌───────────────────────────────┐  │  ┌───────────────────────────────┐ │\n│  │ [ Node 1 (Old Leader: T1) ]   │  │  │ [ Node 3 (New Leader: T2) ]   │ │\n│  │ [ Node 2 (Follower) ]         │  │  │ [ Node 4 (Follower) ]         │ │\n│  │ Max Acks: 2/5 (NO QUORUM)     │  │  │ [ Node 5 (Follower) ]         │ │\n│  │ Status: WRITES STALLED        │  │  │ Quorum: 3/5 (COMMITTING WRITES)│ │\n│  └───────────────────────────────┘  │  └───────────────────────────────┘ │\n│  ══════════════════════════════════════════════════════════════════════ │\n│  HEALING: Node 1 sees Term 2 -> Demotes -> Overwrites uncommitted log!   │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// Raft Joint Consensus Membership Change Configuration\npublic class ClusterConfig {\n    private Set<NodeId> oldServers; // Cold\n    private Set<NodeId> newServers; // Cnew\n    private boolean inJointConsensus = false;\n    \n    public boolean isQuorum(Set<NodeId> acks) {\n        if (!inJointConsensus) {\n            return countAcks(acks, oldServers) > oldServers.size() / 2;\n        }\n        // Joint Consensus requires majorities from BOTH Cold and Cnew!\n        boolean oldQuorum = countAcks(acks, oldServers) > oldServers.size() / 2;\n        boolean newQuorum = countAcks(acks, newServers) > newServers.size() / 2;\n        return oldQuorum && newQuorum;\n    }\n}",
        "terminalOutput": "[NETWORK PARTITION DETECTED] Cluster split: {N1, N2} | {N3, N4, N5}\n>>> Minority {N1, N2}: Client write rejected (Quorum failed: 2/5)\n>>> Majority {N3, N4, N5}: Node 3 elected Leader (Term 2) | Committing writes.\n[NETWORK HEALED] Node 1 contacted by Leader Node 3 (Term 2).\n>>> Node 1 stepped down to FOLLOWER. Uncommitted entries truncated. System linearizable!",
        "dialogue": [
          {
            "speaker": "maya",
            "text": "This mathematical quorum rule is brilliant. It completely eliminates data corruption during network splits!"
          },
          {
            "speaker": "professor",
            "text": "Indeed, Maya! Because any two majorities of size > N/2 MUST overlap in at least one node, it is impossible for two conflicting leaders to commit divergent data simultaneously."
          }
        ],
        "quizzes": [
          {
            "question": "What is a 'Network Partition' in a distributed system?",
            "options": [
              "A network failure that divides communicating nodes into two or more isolated subsets unable to exchange messages",
              "Partitioning a hard drive into multiple volumes",
              "Splitting a database table into shards",
              "Allocating IP addresses via DHCP"
            ],
            "correct": 0,
            "explanation": "A network partition splits a distributed cluster into disconnected network components, preventing messages from traversing between the partitions."
          },
          {
            "question": "In a 5-node Raft cluster partitioned into ${N1, N2}$ (Minority) and ${N3, N4, N5}$ (Majority), what happens to writes sent to $N1$ (former leader)?",
            "options": [
              "$N1$ logs the write uncommitted but cannot commit it because it cannot reach a majority quorum ($2/5 < 3$); writes stall or time out",
              "$N1$ commits the writes locally and ignores the other nodes",
              "$N1$ immediately deletes the entire database",
              "$N1$ promotes $N2$ to secondary leader"
            ],
            "correct": 0,
            "explanation": "In the minority partition ${N1, N2}$, the leader $N1$ can only get 2 acknowledgments out of 5, failing the strict majority quorum ($Q=3$). Thus, it cannot commit any client writes, preserving safety."
          },
          {
            "question": "What happens in the majority partition ${N3, N4, N5}$ during the network partition?",
            "options": [
              "Their election timers expire, they increment the term, elect a new Leader among ${N3, N4, N5}$, and successfully commit client writes",
              "They panic and shut down",
              "They wait indefinitely for $N1$ to reconnect",
              "They elect all 3 nodes as concurrent leaders"
            ],
            "correct": 0,
            "explanation": "Because ${N3, N4, N5}$ form a strict majority ($3/5$), one of them times out, triggers an election in term $T+1$, collects 3 votes, wins leadership, and continues processing and committing client writes."
          },
          {
            "question": "When the network heals and $N1$ (old leader with term $T$) reconnects to $N3$ (new leader with term $T+1$), what happens?",
            "options": [
              "$N1$ sees the higher term $T+1$, immediately steps down to Follower, and overwrites its uncommitted partition entries with $N3$'s authoritative log",
              "$N1$ overrides $N3$ because $N1$ was the original leader",
              "The cluster splits into two independent databases",
              "The nodes perform an uncoordinated rollback"
            ],
            "correct": 0,
            "explanation": "Upon receiving an `AppendEntries` RPC with term $T+1$, $N1$ updates its term, steps down to follower, and overwrites any uncommitted entries in its log with the authoritative entries replicated from the majority leader $N3$."
          },
          {
            "question": "Why is 'Split-Brain' catastrophic in distributed databases, and how does Raft mathematically prevent it?",
            "options": [
              "Split-brain allows two conflicting leaders to commit divergent data concurrently; Raft prevents it because two strict majorities of size $> N/2$ must always overlap in at least one node",
              "Split-brain causes server hardware fires; Raft prevents it by throttling voltage",
              "Split-brain deletes log files; Raft prevents it by write-protecting files",
              "Split-brain only affects single-server systems"
            ],
            "correct": 0,
            "explanation": "By the Pigeonhole Principle, any two subsets of size $> N/2$ in a set of size $N$ must share at least one node ($Q_1 \\cap Q_2 \\ne \\emptyset$). That overlapping node can only vote once per term, making dual simultaneous majority leaders mathematically impossible."
          },
          {
            "question": "What is 'Joint Consensus' used for in Raft configuration changes (cluster membership change)?",
            "options": [
              "A two-phase configuration transition mechanism requiring agreements from both the old configuration $C_{\\text{old}}$ and new configuration $C_{\\text{new}}$ majorities",
              "A protocol to merge two completely unrelated Raft clusters",
              "A strategy to bypass consensus during software upgrades",
              "A consensus algorithm for blockchain smart contracts"
            ],
            "correct": 0,
            "explanation": "Joint Consensus ($C_{\\text{old,new}}$) allows safely transitioning cluster membership (e.g. adding 2 nodes) by requiring separate majorities from both $C_{\\text{old}}$ and $C_{\\text{new}}$ before switching fully to $C_{\\text{new}}$."
          },
          {
            "question": "What is the 'Pre-Vote' extension in Raft (used in etcd, TiKV, and Consul)?",
            "options": [
              "A candidate checks if it can connect to a majority of live peers before incrementing its term, preventing partitioned nodes from disrupting the real leader upon reconnecting",
              "A way for clients to vote on database queries",
              "An algorithm to predict election winners using machine learning",
              "A mechanism to pre-allocate memory buffers on disk"
            ],
            "correct": 0,
            "explanation": "Without Pre-Vote, an isolated follower repeatedly increments its term. Upon reconnecting, its huge term disrupts the active leader. Pre-Vote requires candidates to verify majority reachability before incrementing `currentTerm`."
          },
          {
            "question": "How does Log Compaction (Snapshotting) prevent Raft logs from growing infinitely on disk?",
            "options": [
              "The state machine periodically serializes its current state to a snapshot, and all log entries up to `lastIncludedIndex` are discarded from disk",
              "Old log entries are zipped into a tar archive in background threads",
              "The leader deletes log entries as soon as they are 1 hour old",
              "Raft limits the maximum database size to 1 GB"
            ],
            "correct": 0,
            "explanation": "In log compaction, the system writes the state machine's cumulative state to a snapshot on disk and discards all preceding committed log entries up to `lastIncludedIndex`, bounding disk consumption."
          },
          {
            "question": "Which RPC is used to bring a severely lagged or newly joined follower up to speed when the leader has already discarded older log entries via snapshotting?",
            "options": [
              "`InstallSnapshot` RPC",
              "`SendAllLogs` RPC",
              "`SyncDisk` RPC",
              "`BootstrapPeer` RPC"
            ],
            "correct": 0,
            "explanation": "When a follower's `nextIndex` points to log entries that the leader has already discarded during snapshotting, the leader streams the snapshot file directly to the follower using `InstallSnapshot` RPCs."
          },
          {
            "question": "What happens to uncommitted log entries on a disconnected follower if the leader crashes and a new leader is elected without those entries?",
            "options": [
              "The uncommitted entries are overwritten and discarded when the follower syncs with the new leader",
              "They are automatically promoted to committed entries",
              "The follower commits them to an error file",
              "The entire database reverts to initial state"
            ],
            "correct": 0,
            "explanation": "Uncommitted entries provide zero durability guarantees. When the follower reconnects, the new leader forces its authoritative log onto the follower, overwriting all uncommitted discrepancies."
          }
        ]
      }
    ]
  },
  {
    "id": "b-tree-indexing",
    "title": "Database Internals: B+ Tree Indexing & Disk Page Architecture",
    "subject": "Database Engineering & Storage Engines",
    "difficulty": "Advanced Systems Architecture",
    "duration": "25 mins",
    "tags": [
      "DBMS",
      "B+ Tree",
      "Indexing",
      "Disk I/O",
      "Buffer Pool",
      "InnoDB"
    ],
    "professor": {
      "name": "Prof. Vyomra",
      "role": "Lead AI Professor of Database Systems & Storage Engines",
      "avatar": "👨‍🏫",
      "voicePitch": 0.95,
      "voiceRate": 0.98
    },
    "classmates": [
      {
        "id": "alex",
        "name": "Alex",
        "title": "Alex (Curious Skeptic)",
        "avatar": "🧑‍💻",
        "color": "text-amber-400",
        "role": "Edge-Case Specialist",
        "pitch": 1.2
      },
      {
        "id": "maya",
        "name": "Maya",
        "title": "Maya (Performance Hacker)",
        "avatar": "👩‍💻",
        "color": "text-cyan-400",
        "role": "Memory & Low-Level",
        "pitch": 1.3
      }
    ],
    "scenes": [
      {
        "id": "scene-btree-1",
        "slideNumber": 1,
        "title": "Slide 1: Disk Hardware Mechanics & Why Binary Search Trees Fail",
        "slideSubtitle": "Page transfers (4KB/16KB), random vs sequential I/O latency, and high fan-out index trees.",
        "takeaways": [
          "Disk Block I/O: Operating systems and SSD/HDD storage controllers transfer data strictly in fixed-size blocks (4KB OS pages, 16KB InnoDB database pages).",
          "Binary Tree Disk Failure: A binary search tree has fan-out of 2; searching 10M rows requires ~24 random disk seeks, taking seconds on physical storage.",
          "B+ Tree High Fan-Out (B = 500 to 1000): Flattening the tree height to 3 or 4 levels ensures any record among 100 million rows is found in 3-4 page reads.",
          "Random vs Sequential I/O Gap: Sequential page scans saturate NVMe bandwidth (~7 GB/s); random seeks suffer from flash block remapping and rotational latency.",
          "The Buffer Pool (Page Cache): Caches disk pages in RAM using LRU/Clock algorithms, serving hot queries with zero disk I/O."
        ],
        "whiteboardContent": "# Disk Hardware Mechanics & Tree Height Analysis\n\n### The Fan-Out & Tree Height Formula:\n$$\\text{Height } h \\approx \\left\\lceil \\log_B(N) \\right\\rceil$$\n\n| Index Type | Fan-Out ($B$) | Records ($N$) | Tree Height ($h$) | Disk I/O Reads |\n| :--- | :--- | :--- | :--- | :--- |\n| **Binary Search Tree (BST)** | **2** | 16,000,000 | **24 levels** | **24 Disk Seeks** ($\\approx 240$ms on HDD) |\n| **B+ Tree (16KB Page)** | **500** | 16,000,000 | **3 levels** | **3 Page Reads** ($\\approx 0.1$ms with RAM cache) |\n| **B+ Tree (16KB Page)** | **1,000** | 1,000,000,000 | **3 levels** | **3 Page Reads** (1 Billion rows!) |\n\n---\n\n### Core Storage Invariant:\n$$\\text{Random Seek Latency } (10\\text{ms}) \\gg \\text{Sequential Page Read } (0.01\\text{ms}) \\gg \\text{L1/L2 Cache } (1\\text{ns})$$",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                      B+ TREE VS BINARY SEARCH TREE                       │\n├──────────────────────────────────────────────────────────────────────────┤\n│  BINARY TREE (Height = 24 Disk Seeks):                                   │\n│  [Key] ──> [Key] ──> [Key] ──> ... ──> [Key] (24 Random I/O hops!)       │\n│                                                                          │\n│  B+ TREE (Height = 3 Levels, Fan-out = 500):                             │\n│  ┌─────────────────────────[ ROOT PAGE: 500 Keys ]─────────────────────┐ │\n│  │ (Cached in RAM Buffer Pool)                                         │ │\n│  └───────────┬──────────────────────┬──────────────────────┬───────────┘ │\n│              ▼                      ▼                      ▼             │\n│    [ Internal Page 1 ]    [ Internal Page 2 ]    [ Internal Page 500 ]   │\n│              │                      │                      │             │\n│              ▼                      ▼                      ▼             │\n│      [ Leaf Page 1 ] <────> [ Leaf Page 2 ] <────> [ Leaf Page 125k ]   │\n│      (Stores actual row data and double-linked sequential scan pointers) │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// Storage Engine B+ Tree Page Constants (InnoDB-style)\npublic class BPlusTreeConfig {\n    public static final int PAGE_SIZE = 16 * 1024; // 16 KB fixed disk page\n    public static final int KEY_SIZE = 8;          // 8-byte BIGINT primary key\n    public static final int POINTER_SIZE = 6;      // 6-byte page address offset\n    \n    // Fan-out factor: Number of keys per internal node\n    public static final int FAN_OUT = PAGE_SIZE / (KEY_SIZE + POINTER_SIZE); // ~1,170 keys!\n}",
        "terminalOutput": "[STORAGE BENCHMARK] 16,000,000 Records Indexed\n>>> Binary Search Tree: Height 24 | Random I/O time: 218.4ms\n>>> B+ Tree (16KB Page): Height 3 | I/O Reads: 3 (Root in RAM) | Query time: 0.12ms\n>>> Speedup: 1,820x faster with B+ Tree!",
        "dialogue": [
          {
            "speaker": "professor",
            "text": "Welcome scholars! Today we unlock the foundational data structure behind MySQL InnoDB, PostgreSQL, Oracle, and SQLite: The B+ Tree."
          },
          {
            "speaker": "alex",
            "text": "Professor, why can't we just use a Red-Black Tree or HashMap on disk?"
          },
          {
            "speaker": "professor",
            "text": "Because memory hardware is physical! CPUs read disks in 4KB/16KB page chunks. A binary tree wastes 99.9% of that page and forces 24 slow random disk seeks. A B+ Tree packs 1,000 keys per page, finding any record in 3 reads!"
          }
        ],
        "quizzes": [
          {
            "question": "Why do in-memory Binary Search Trees (e.g. Red-Black Trees, AVL Trees) perform terribly as on-disk database indices?",
            "options": [
              "Each tree node holds only 1 key and 2 pointers; a tree of 10M records has height ~24, requiring 24 separate high-latency random disk I/O seeks per query",
              "Binary trees cannot store integer keys",
              "Disk storage does not support pointer addresses",
              "Operating systems disable binary search on disk drives"
            ],
            "correct": 0,
            "explanation": "Binary trees have a tiny fan-out of 2. Traversal on disk requires $\\log_2 N$ random disk seeks (e.g. ~24 I/O operations for 16M rows). At 10ms per HDD seek, a single query would take 240ms."
          },
          {
            "question": "What is the standard hardware block/page transfer size between disk/SSD and Database Buffer Pools in production DBMSs (PostgreSQL, MySQL InnoDB)?",
            "options": [
              "4 KB to 16 KB (e.g. InnoDB 16KB, PostgreSQL 8KB)",
              "64 bytes (CPU cache line)",
              "1 MB",
              "512 MB"
            ],
            "correct": 0,
            "explanation": "Databases organize disk storage into fixed-size pages (InnoDB uses 16 KB, PostgreSQL uses 8 KB, Linux OS uses 4 KB). All disk reads and writes occur in whole page blocks."
          },
          {
            "question": "What is the primary advantage of a B+ Tree's large fan-out factor ($B \\approx 100\\text{ to }1000$)?",
            "options": [
              "It flattens the tree height to just 3 or 4 levels for millions of records, requiring at most 3-4 page reads per lookup",
              "It eliminates the need for RAM cache",
              "It allows infinite data storage without disk space",
              "It converts all SQL queries into O(1) hash lookups"
            ],
            "correct": 0,
            "explanation": "With a fan-out of $B = 500$, a B+ tree of height 3 ($500^3 = 125,000,000$ records) requires at most 3 page reads to find any key among 125 million rows, with root and internal nodes cached in RAM."
          },
          {
            "question": "Why is random disk I/O significantly slower than sequential disk I/O on HDDs and NVMe SSDs?",
            "options": [
              "Random I/O requires physical actuator head seeks on HDDs and flash block management/erase overhead on SSDs, whereas sequential I/O saturates continuous hardware pipelines",
              "Random I/O transfers only 1 bit per second",
              "Sequential I/O bypasses the operating system kernel completely",
              "Random I/O requires CPU floating point calculations"
            ],
            "correct": 0,
            "explanation": "On HDDs, random I/O requires mechanical arm movement (5-10ms). On SSDs, random writes incur write amplification and garbage collection. Sequential access maximizes controller throughput and hardware prefetching."
          },
          {
            "question": "What is the primary purpose of the Database 'Buffer Pool' (Page Cache) in memory?",
            "options": [
              "To cache frequently accessed disk pages in RAM and buffer dirty writes to avoid repetitive physical disk I/O",
              "To compile SQL queries into native machine assembly",
              "To compress network packets sent to client applications",
              "To authenticate user passwords"
            ],
            "correct": 0,
            "explanation": "The Buffer Pool caches disk pages in RAM using replacement algorithms (e.g. LRU-K, Clock). Reads hitting the buffer pool execute in nanoseconds without physical disk access."
          },
          {
            "question": "What is a 'Dirty Page' in database memory architecture?",
            "options": [
              "A page in the Buffer Pool that has been modified by transactions in RAM but not yet flushed to physical disk storage",
              "A corrupted page with invalid parity checksums",
              "A page containing deleted rows that have not been vacuumed",
              "A page locked by a deadlocked transaction"
            ],
            "correct": 0,
            "explanation": "A dirty page is a page whose in-memory data in the Buffer Pool has been updated by writes. It must eventually be written (flushed) back to disk by background checkpoint workers."
          },
          {
            "question": "How does the Write-Ahead Log (WAL / Redo Log) allow databases to delay flushing dirty pages to disk safely?",
            "options": [
              "Transaction modifications are appended sequentially to the WAL before committing; if the system crashes before dirty pages flush, the WAL replays the changes on recovery",
              "The WAL compresses data by 90%",
              "The WAL replaces table storage entirely",
              "The WAL prevents concurrent read queries"
            ],
            "correct": 0,
            "explanation": "WAL guarantees durability (ACID 'D') through append-only sequential writes. If a crash occurs before the Buffer Pool flushes dirty pages, the DBMS recovers committed state by replaying WAL log records."
          },
          {
            "question": "What is the theoretical search time complexity of a B+ Tree containing $N$ records with fan-out $B$?",
            "options": [
              "$\\mathcal{O}(\\log_B N)$",
              "$\\mathcal{O}(N)$",
              "$\\mathcal{O}(N \\log_2 N)$",
              "$\\mathcal{O}(1)$"
            ],
            "correct": 0,
            "explanation": "B+ Tree lookup complexity is $\\mathcal{O}(\\log_B N)$ page accesses, where $B$ is the tree's fan-out (node branching factor)."
          },
          {
            "question": "Why do B+ Tree internal nodes store ONLY separator keys and child pointers, while all actual data records reside in leaf nodes?",
            "options": [
              "To maximize the fan-out $B$ by fitting hundreds of keys into a single 4KB/16KB page, minimizing tree height",
              "Because internal nodes cannot write to disk",
              "To prevent duplicate key values",
              "Because SQL standards forbid data in intermediate nodes"
            ],
            "correct": 0,
            "explanation": "By keeping payload data out of internal nodes, each internal node page can fit hundreds or thousands of (key, pointer) pairs, drastically increasing the fan-out and minimizing tree depth."
          },
          {
            "question": "What is the typical height of a production B+ Tree index storing 100,000,000 (100 million) rows in MySQL InnoDB?",
            "options": [
              "3 to 4 levels",
              "20 to 25 levels",
              "100 levels",
              "1,000 levels"
            ],
            "correct": 0,
            "explanation": "With 16KB pages and 8-byte keys, each InnoDB page holds ~1,000 keys. A height-3 tree holds up to $1000^3 = 1$ billion records, requiring only 3-4 page reads for any lookup."
          }
        ]
      },
      {
        "id": "scene-btree-2",
        "slideNumber": 2,
        "title": "Slide 2: B+ Tree Node Layout & Invariants (Order M)",
        "slideSubtitle": "Internal routing nodes vs leaf data nodes, slotted page formats, and minimum occupancy rules.",
        "takeaways": [
          "Order M Invariant: An internal node in a B+ Tree of order M has at most M child pointers and M-1 keys; non-root nodes must hold at least ceil(M/2) pointers.",
          "Data Separation: Internal nodes store ONLY routing separator keys and child page IDs; 100% of actual row data resides in Leaf nodes.",
          "Slotted Page Architecture: Each 16KB disk page contains a fixed page header, slot array offset table, and variable-length record payload.",
          "Perfect Tree Balance: Every leaf node in a B+ Tree is at the exact same depth from the root, guaranteeing deterministic O(log_B N) lookups.",
          "Fill Factor Tuning: Leaves are initialized with 70–90% fill factor to leave headroom for sequential inserts without triggering immediate page splits."
        ],
        "whiteboardContent": "# B+ Tree Structural Properties & Node Invariants\n\n### Node Capacity Rules (Order $M$):\n* **Root Node:** Minimum 1 key (2 child pointers); Maximum $M-1$ keys.\n* **Internal Nodes:** Minimum $\\lceil M/2 \\rceil - 1$ keys; Maximum $M-1$ keys.\n* **Leaf Nodes:** Minimum $\\lceil M/2 \\rceil$ records; Maximum $M$ records.\n\n---\n\n### Slotted Page Structure (16KB Disk Layout):\n$$\\text{Page} = [\\text{Header (64B)}] + [\\text{Slot Directory } \\downarrow] + [\\text{Free Space}] + [\\uparrow \\text{Record Payloads}]$$\n* **Slot Array:** Grows downward, storing 2-byte offsets to each record.\n* **Record Heap:** Grows upward from page bottom, storing actual columns and null-bitmaps.",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     SLOTTED PAGE ARCHITECTURE (16 KB)                    │\n├──────────────────────────────────────────────────────────────────────────┤\n│ [ Page Header: LSN, Page Type, Prev/Next Page Ptrs, Free Space Offset ]   │\n│ [ Slot 0: Offset 0x3FC0 ] [ Slot 1: Offset 0x3F80 ] [ Slot 2: 0x3F20 ]   │\n│                                │ (Grows Downward)                        │\n│                                ▼                                         │\n│                   ~ ~ ~ FREE SPACE REGION ~ ~ ~                          │\n│                                ▲                                         │\n│                                │ (Grows Upward)                          │\n│ [ Record 2: (id=103, data...) ][ Record 1: (id=102) ][ Record 0: (101) ] │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// B+ Tree Internal Node binary search within a single disk page\npublic class BPlusTreeNode {\n    private int[] keys;       // Sorted keys array\n    private long[] childPageIds; // Child disk page pointers\n    private int numKeys;\n    \n    public long findChildPage(int searchKey) {\n        // Fast binary search on CPU within the 16KB in-memory page\n        int low = 0, high = numKeys - 1;\n        while (low <= high) {\n            int mid = (low + high) >>> 1;\n            if (keys[mid] <= searchKey) low = mid + 1;\n            else high = mid - 1;\n        }\n        return childPageIds[low]; // Points to next depth page\n    }\n}",
        "terminalOutput": "[NODE SCAN] Searching key: 48,291 in Root Page (1,000 keys)\n>>> Binary Search in RAM: 10 comparisons (0.001ms)\n>>> Routing to Child Page ID: 0x08F4 at Level 1.",
        "dialogue": [
          {
            "speaker": "maya",
            "text": "Why are keys stored in sorted order inside each individual page?"
          },
          {
            "speaker": "professor",
            "text": "So the CPU can perform an instant binary search in nanoseconds once the page is loaded into the RAM Buffer Pool!"
          }
        ],
        "quizzes": [
          {
            "question": "In a B+ Tree of Order $M$, what is the maximum number of child pointers an internal node can hold?",
            "options": [
              "$M$ child pointers (and $M-1$ keys)",
              "$2M$ child pointers",
              "$M+1$ child pointers",
              "Unlimited"
            ],
            "correct": 0,
            "explanation": "In a B+ Tree of order $M$, each internal node contains at most $M$ child pointers and $M-1$ separator keys."
          },
          {
            "question": "What is the minimum number of child pointers a non-root internal node must hold in a B+ Tree of order $M$?",
            "options": [
              "$\\lceil M / 2 \\rceil$ child pointers",
              "$1$ pointer",
              "$M-1$ pointers",
              "$2$ pointers"
            ],
            "correct": 0,
            "explanation": "To maintain balanced density and prevent degradation, every non-root node in a B+ Tree must be at least half full, holding at least $\\lceil M/2 \\rceil$ child pointers (and $\\lceil M/2 \\rceil - 1$ keys)."
          },
          {
            "question": "Where are all satellite data records (or primary key row pointers) stored in a B+ Tree?",
            "options": [
              "Exclusively in Leaf Nodes at the bottom level of the tree",
              "Evenly distributed across root, internal, and leaf nodes",
              "Only in the root node",
              "In a separate external hash table"
            ],
            "correct": 0,
            "explanation": "In a B+ Tree (unlike a standard B-Tree), 100% of actual data records or row pointers reside strictly in the Leaf Nodes. Internal nodes only contain routing separator keys."
          },
          {
            "question": "What property do all leaf nodes in a B+ Tree share regarding tree depth?",
            "options": [
              "All leaf nodes are at the exact same depth/level from the root (Perfect Balance)",
              "Leaf nodes can be at arbitrary varying depths",
              "Left leaf nodes are always deeper than right leaf nodes",
              "Leaf node depth depends on insertion timestamp"
            ],
            "correct": 0,
            "explanation": "B+ Trees are perfectly balanced search trees: every single leaf node resides at the exact same depth from the root, guaranteeing uniform $\\mathcal{O}(\\log_B N)$ worst-case lookup performance."
          },
          {
            "question": "How are leaf nodes linked together in a B+ Tree to accelerate range scans?",
            "options": [
              "Via a Doubly-Linked List (pointers to `next` and `prev` sibling leaf pages)",
              "Via recursive parent pointers only",
              "Through a binary heap overlay",
              "Through random hash links"
            ],
            "correct": 0,
            "explanation": "All leaf nodes are chained in sorted order via a doubly-linked list. Once the starting leaf is found, scanning a range (`WHERE id BETWEEN 10 AND 500`) simply traverses adjacent leaf pages without re-traversing the tree root."
          },
          {
            "question": "What is a 'Slotted Page' layout within an on-disk database page?",
            "options": [
              "A page architecture with a fixed header at the top, a slot array growing downward storing record offsets, and variable-length record payloads growing upward from the bottom",
              "A page divided into equal 1-byte memory slots",
              "A page that only stores integer numbers",
              "A caching mechanism inside the CPU L2 cache"
            ],
            "correct": 0,
            "explanation": "The Slotted Page architecture places a Slot Directory at the beginning of the page (pointing to offsets) and row data at the end of the page growing inward, efficiently supporting variable-length records and fragmentation reclamation."
          },
          {
            "question": "What happens when you search for a key $K$ inside a single B+ Tree internal node in RAM?",
            "options": [
              "Binary Search (or vectorized SIMD scan) across the sorted key array in the page to find the appropriate child pointer",
              "Linear disk scan from the first sector",
              "Random hash probe",
              "Network RPC to the storage server"
            ],
            "correct": 0,
            "explanation": "Because keys inside a B+ Tree node page are stored in sorted order in memory, the database uses Binary Search (or SIMD CPU instructions) in $\\mathcal{O}(\\log_2 M)$ time to pick the child pointer."
          },
          {
            "question": "What is 'Fill Factor' (Page Density) in B+ Tree storage tuning?",
            "options": [
              "The percentage of page space reserved for initial loading (e.g. 70-80%) to leave headroom for future inserts without triggering immediate page splits",
              "The ratio of RAM to disk size",
              "The total count of indexed columns",
              "The percentage of corrupted pages in the database"
            ],
            "correct": 0,
            "explanation": "Fill Factor (commonly 70–90%) configures how full index pages are packed during index creation or rebuilds, leaving free space in each page to accommodate inserts without triggering costly page splits."
          },
          {
            "question": "How does a B+ Tree differ from a classical B-Tree regarding internal node storage?",
            "options": [
              "B-Trees store data records in both internal and leaf nodes; B+ Trees store data records ONLY in leaf nodes",
              "B-Trees are only used in memory; B+ Trees are only used on tape drives",
              "B-Trees have linked leaves; B+ Trees do not",
              "B-Trees have higher fan-out than B+ Trees"
            ],
            "correct": 0,
            "explanation": "In a classical B-Tree, keys and payload records are stored in all nodes (internal and leaf). In a B+ Tree, internal nodes store only routing keys, allowing vastly higher fan-out and linked leaf range queries."
          },
          {
            "question": "What is the minimum number of keys in the root node of a B+ Tree?",
            "options": [
              "1 key (2 child pointers)",
              "$\\lceil M/2 \\rceil$ keys",
              "$M-1$ keys",
              "0 keys"
            ],
            "correct": 0,
            "explanation": "The root node is the only exception to the half-full rule: as long as the tree has at least 2 records, the root can hold as few as 1 key and 2 child pointers."
          }
        ]
      },
      {
        "id": "scene-btree-3",
        "slideNumber": 3,
        "title": "Slide 3: Search, Insertion & Node Splitting Mechanics",
        "slideSubtitle": "Exact key lookups, leaf overflow splitting, parent key promotion, and tree height growth.",
        "takeaways": [
          "Search Traversal: Starts at root page, binary searches keys to choose child page pointer, repeating until reaching target leaf page in O(log_B N).",
          "Leaf Page Split: When inserting into a full leaf page, the page splits 50/50; a copy of the middle key is promoted to the parent internal node.",
          "Internal Node Split: When an internal node overflows, the middle key is moved up into its parent (not copied) and removed from the level.",
          "Tree Growth from the Top: A B+ Tree grows in height only when the ROOT node splits, creating a new root with 2 pointers.",
          "Sequential vs Random Insertion: Monotonically increasing primary keys (AUTO_INCREMENT, UUIDv7) append to the rightmost leaf with zero page splits."
        ],
        "whiteboardContent": "# B+ Tree Insertion & Node Splitting Mechanics\n\n### 1. Leaf Page Split Algorithm (Overflow at $M$ entries):\n1. Allocate new sibling Leaf Page $P_{\\text{new}}$.\n2. Move upper half $(\\lfloor M/2 \\rfloor)$ records to $P_{\\text{new}}$.\n3. Insert $P_{\\text{new}}$ into doubly-linked leaf chain: $P_{\\text{old}} \\leftrightarrow P_{\\text{new}} \\leftrightarrow P_{\\text{next}}$.\n4. Promote **COPY** of smallest key in $P_{\\text{new}}$ to Parent Internal Node.\n\n---\n\n### 2. Root Split & Tree Growth:\n$$\\text{Full Root Node } \\xrightarrow{\\text{Split}} \\text{Left Child} + \\text{Right Child} + \\mathbf{\\text{New Root Node (Height increases by 1)}}$$",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     B+ TREE LEAF NODE OVERFLOW SPLIT                     │\n├──────────────────────────────────────────────────────────────────────────┤\n│  BEFORE SPLIT (Leaf Page 1 is FULL with 4 keys):                         │\n│  [ Leaf Page 1: (10, 20, 30, 40) ]                                       │\n│                                                                          │\n│  AFTER INSERTING KEY 25 (Split into two half-full pages):                │\n│                                                                          │\n│                       [ PARENT: Key 30 promoted ]                        │\n│                                ┌──────┴──────┐                           │\n│                                ▼             ▼                           │\n│        [ Leaf Page 1: (10, 20, 25) ] <───> [ Leaf Page 2: (30, 40) ]     │\n│        (Keys 10, 20, 25 retained)          (Keys 30, 40 moved)          │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// B+ Tree Leaf Page Split Simulation\npublic void insertKey(int key, byte[] recordData) {\n    if (isPageFull()) {\n        // 1. Allocate new leaf page in buffer pool\n        BPlusTreeLeafPage newPage = allocateNewPage();\n        \n        // 2. Distribute keys evenly (50/50 split)\n        int splitIndex = this.records.size() / 2;\n        newPage.records.addAll(this.records.subList(splitIndex, this.records.size()));\n        this.records.subList(splitIndex, this.records.size()).clear();\n        \n        // 3. Update doubly-linked list\n        newPage.nextPageId = this.nextPageId;\n        this.nextPageId = newPage.pageId;\n        \n        // 4. Promote separator key to parent\n        parent.insertChildPointer(newPage.records.get(0).key, newPage.pageId);\n    }\n}",
        "terminalOutput": "[B+ TREE INSERT] Key 25 inserted.\n>>> Leaf Page 0x10A overflowed (100% capacity).\n>>> Split triggered: Allocated Leaf Page 0x10B | Linked 0x10A <-> 0x10B.\n>>> Promoted separator key 30 to Parent Page 0x001. Tree balanced!",
        "dialogue": [
          {
            "speaker": "alex",
            "text": "Why is inserting random UUIDs (UUIDv4) as primary keys considered a terrible database anti-pattern?"
          },
          {
            "speaker": "professor",
            "text": "Because random UUIDs land in random leaf pages all across your 500GB database! This forces constant random page splits, destroys page fill factor, and thrashes your disk I/O. Always use sequential IDs or UUIDv7!"
          }
        ],
        "quizzes": [
          {
            "question": "What triggers a 'Leaf Page Split' during a B+ Tree key insertion?",
            "options": [
              "Attempting to insert a key into a leaf node that has already reached its maximum capacity ($M-1$ keys / full page)",
              "When a transaction commits",
              "When the database buffer pool runs out of memory",
              "When the operating system reboots"
            ],
            "correct": 0,
            "explanation": "When a new key is inserted into a leaf node that is completely full, the node overflows and must split into two separate leaf pages, distributing keys evenly and pushing a copy of the middle key to the parent."
          },
          {
            "question": "What happens to the middle separator key during a LEAF Node split in a B+ Tree?",
            "options": [
              "A COPY of the middle key is pushed up to the parent internal node, while the key REMAINS in the right leaf node",
              "The middle key is deleted from the tree",
              "The middle key is moved to the parent and removed from the leaf level",
              "The middle key is moved to an overflow rollback segment"
            ],
            "correct": 0,
            "explanation": "In a B+ Tree leaf split, the middle key MUST remain in the leaf level (to preserve data completeness) while a COPY is promoted to the parent node as a separator guide."
          },
          {
            "question": "What happens to the middle key during an INTERNAL Node split in a B+ Tree?",
            "options": [
              "The middle key is MOVED UP into the parent node and REMOVED from the splitting internal node",
              "A copy remains in the child node",
              "The middle key is discarded",
              "The internal node cannot split"
            ],
            "correct": 0,
            "explanation": "In internal node splits, the middle key is promoted (moved) directly into the parent node and is not retained in either child, because internal nodes only act as index routers."
          },
          {
            "question": "How does a B+ Tree increase its height (depth) by 1 level?",
            "options": [
              "When the ROOT node overflows and splits into two nodes, a brand-new root node is created above them with 1 key and 2 pointers",
              "When leaf nodes split at the bottom",
              "When the database reaches 1,000 transactions",
              "By re-indexing the entire table from scratch"
            ],
            "correct": 0,
            "explanation": "A B+ Tree grows in height strictly from the TOP: when the root node becomes full and splits, a new root is created with 2 child pointers, increasing tree height uniformly for all leaves by 1."
          },
          {
            "question": "Why are sequential primary key inserts (e.g. `AUTO_INCREMENT` integer or UUIDv7) much faster than random inserts (e.g. random UUIDv4)?",
            "options": [
              "Sequential inserts always append to the rightmost leaf page with zero page splits in older pages; random UUIDs cause random page splits across the entire index, thrashing disk I/O",
              "Sequential numbers require less encryption",
              "UUIDv4 values cannot be indexed in SQL",
              "Random inserts bypass the buffer pool"
            ],
            "correct": 0,
            "explanation": "Sequential monotonically increasing IDs always target the current rightmost leaf page (99% append efficiency). Random UUIDs disperse inserts across random pages, forcing massive random disk page splits and buffer pool churn."
          },
          {
            "question": "What occurs during a key DELETION in a B+ Tree if a node falls below the minimum occupancy $\\lceil M/2 \\rceil$?",
            "options": [
              "The node attempts to borrow a key from a sibling node (Redistribution); if sibling is also at minimum, the two nodes merge into a single page",
              "The node is left empty permanently",
              "The entire tree is deleted and rebuilt",
              "The transaction is rolled back"
            ],
            "correct": 0,
            "explanation": "Underflow handling first attempts sibling redistribution (borrowing a key). If the sibling is also at minimum capacity, the two nodes are merged into one, and the separator key in the parent is deleted."
          },
          {
            "question": "What is 'Latch Crabbing' (Coupling) in concurrent B+ Tree index traversal?",
            "options": [
              "A concurrency protocol where a thread locks a child node before releasing the lock on the parent node, ensuring safe traversal without blocking the whole tree",
              "A deadlocking bug in database engines",
              "A garbage collection cycle for deleted rows",
              "A network streaming protocol"
            ],
            "correct": 0,
            "explanation": "Latch Crabbing traverses the tree by acquiring a latch on a child page before releasing the latch on its parent page, guaranteeing thread safety during concurrent reads and writes with fine-grained page locks."
          },
          {
            "question": "What is the computational complexity of finding a specific key in a B+ Tree containing $N$ keys with page size $B$?",
            "options": [
              "$\\mathcal{O}(\\log_B N)$ page reads, with $\\mathcal{O}(\\log_2 B)$ comparisons per page in RAM",
              "$\\mathcal{O}(N)$ sequential scans",
              "$\\mathcal{O}(1)$ direct memory hash",
              "$\\mathcal{O}(B \\cdot N)$"
            ],
            "correct": 0,
            "explanation": "Traversal requires $\\mathcal{O}(\\log_B N)$ disk page fetches. Inside each page, binary search finds the key in $\\mathcal{O}(\\log_2 B)$ CPU operations."
          },
          {
            "question": "What is an 'Index Page Reorganization' / Defragmentation process in databases?",
            "options": [
              "Rebuilding the B+ tree to eliminate fragmented empty spaces caused by deleted rows and out-of-order page splits, restoring contiguous page layout and 90% fill factor",
              "Deleting all secondary indices",
              "Converting B+ trees into Hash maps",
              "Moving data to cold cloud storage"
            ],
            "correct": 0,
            "explanation": "Over time, random deletes and page splits leave sparse, fragmented pages. Rebuilding/defragmenting the index repackages keys into contiguous, high-density pages, restoring optimal cache efficiency."
          },
          {
            "question": "What happens if a multi-column composite index is defined on `(dept_id, salary, hire_date)` and a query filters on `WHERE salary > 50000`?",
            "options": [
              "The database cannot use the B+ tree for an efficient index seek because the leading prefix column (`dept_id`) is missing from the query predicate",
              "The index is used with maximum efficiency",
              "The database throws a syntax error",
              "The query is automatically rewritten to sort by salary"
            ],
            "correct": 0,
            "explanation": "B+ Tree composite indices are ordered lexicographically by the leftmost prefix. If the query does not specify the first column (`dept_id`), the database must perform a full index scan or table scan."
          }
        ]
      },
      {
        "id": "scene-btree-4",
        "slideNumber": 4,
        "title": "Slide 4: Leaf Node Doubly-Linked Lists & Range Query Efficiency",
        "slideSubtitle": "Sequential leaf scans, Clustered vs Secondary indices, covering queries, and index condition pushdown.",
        "takeaways": [
          "Doubly-Linked Leaf Chain: All leaf pages link to next and previous siblings, allowing range queries (`BETWEEN`, `>`, `<`) to execute via sequential scans with zero re-traversal.",
          "Clustered Index: The primary key index IS the table itself; leaf pages store full row column tuples.",
          "Secondary Index: Secondary index leaf pages store only indexed column keys plus the Clustered Primary Key value (Bookmark Lookup).",
          "Covering Index Optimization: When an index contains all requested columns in a SELECT query, the DBMS satisfies the query directly from index pages without table lookups.",
          "Index Condition Pushdown (ICP): Pushes `WHERE` filtering logic down into the storage engine leaf scan to avoid fetching unnecessary table rows."
        ],
        "whiteboardContent": "# Range Query Execution & Clustered vs Secondary Index\n\n### Range Query Execution Pipeline:\n$$\\text{SQL: } \\mathbf{\\text{SELECT } * \\text{ FROM users WHERE id BETWEEN 100 AND 500;}}$$\n1. **Index Seek:** Traverse root-to-leaf once to find key 100 in $\\mathcal{O}(\\log_B N)$ time.\n2. **Sequential Leaf Scan:** Follow `next` leaf page pointers reading records until key > 500 is encountered.\n\n---\n\n### Clustered vs Secondary Index Comparison:\n* **Clustered Index (Primary Key):** Leaf Page $=$ **[ Primary Key | Column 1 | Column 2 | Column 3 ... ]**\n* **Secondary Index (e.g. email):** Leaf Page $=$ **[ Email Key | Primary Key Pointer ]** $\\implies$ Secondary lookup required!",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     SEQUENTIAL LEAF SCAN FOR RANGE QUERY                 │\n├──────────────────────────────────────────────────────────────────────────┤\n│  1. ROOT SEEK TO KEY 100 (Single Tree Traversal)                         │\n│                         │                                                │\n│                         ▼                                                │\n│  ┌───────────────────────────────┐     ┌───────────────────────────────┐ │\n│  │ LEAF PAGE 1 (Keys 100 - 199)  │ <─> │ LEAF PAGE 2 (Keys 200 - 299)  │ │\n│  └──────────────┬────────────────┘     └──────────────┬────────────────┘ │\n│                 │                                     │                  │\n│                 ▼ (Sequential Pointer)                ▼ (Sequential)     │\n│  ┌───────────────────────────────┐     ┌───────────────────────────────┐ │\n│  │ LEAF PAGE 3 (Keys 300 - 399)  │ <─> │ LEAF PAGE 4 (Keys 400 - 500)  │ │\n│  └───────────────────────────────┘     └───────────────────────────────┘ │\n│  >>> Continuous sequential read throughput without re-visiting Root Page!│\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// Range Query Execution via Leaf Page Pointers\npublic List<Row> executeRangeScan(int startKey, int endKey) {\n    List<Row> results = new ArrayList<>();\n    \n    // 1. Traverse to first leaf node\n    BPlusTreeLeafPage currentLeaf = findLeafPage(startKey);\n    \n    // 2. Iterate along leaf linked list until endKey reached\n    while (currentLeaf != null) {\n        for (Row row : currentLeaf.records) {\n            if (row.key > endKey) return results; // Finished range!\n            if (row.key >= startKey) results.add(row);\n        }\n        currentLeaf = getPageFromBufferPool(currentLeaf.nextPageId); // Zero-seek pointer!\n    }\n    return results;\n}",
        "terminalOutput": "[RANGE SCAN] SELECT * FROM orders WHERE id BETWEEN 1000 AND 5000\n>>> Root Seek: 1 I/O read (Page found: 0x012)\n>>> Sequential Leaf Scan: Read 12 contiguous leaf pages (4,001 rows in 0.8ms)\n>>> Zero tree re-traversals. Cache efficiency: 100%.",
        "dialogue": [
          {
            "speaker": "maya",
            "text": "This is why B+ Trees are superior to standard B-Trees for SQL databases! In a B-Tree, range queries have to walk up and down parents repeatedly."
          },
          {
            "speaker": "professor",
            "text": "Spot on, Maya! The leaf node doubly-linked list transforms complex range filters and `ORDER BY` sorting into blazing-fast sequential disk scans."
          }
        ],
        "quizzes": [
          {
            "question": "How does a B+ Tree execute a range query such as `SELECT * FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-03-31'`?",
            "options": [
              "Traverse tree once ($\\\\mathcal{O}(\\\\log_B N)$) to find the start key ('2026-01-01'), then scan sequentially along leaf node sibling pointers until reaching '2026-03-31'",
              "Perform a separate root-to-leaf tree search for every single date in the range",
              "Perform a full table scan across all unindexed disk pages",
              "Load the entire database into memory and sort it"
            ],
            "correct": 0,
            "explanation": "B+ Trees excel at range queries: a single root-to-leaf search finds the first record, followed by an ultra-fast sequential scan along the doubly-linked leaf chain."
          },
          {
            "question": "What is a 'Clustered Index' (Primary Index) in database storage (e.g. MySQL InnoDB)?",
            "options": [
              "An index where the leaf pages store the FULL row data tuples directly in sorted primary key order",
              "An index that groups tables into clusters across multiple servers",
              "An index created in RAM only",
              "An index that stores only row pointers without column data"
            ],
            "correct": 0,
            "explanation": "In a Clustered Index (like InnoDB's Primary Key), the leaf nodes of the B+ tree ARE the actual table storage pages. The data rows are physically stored in primary key order."
          },
          {
            "question": "What does a 'Secondary Index' (Non-Clustered Index) store at its leaf nodes in MySQL InnoDB?",
            "options": [
              "The secondary index key column(s) plus the corresponding Clustered Primary Key value for each row",
              "The full row data tuple duplicated again",
              "The physical disk sector and track byte offset",
              "A pointer to the buffer pool cache"
            ],
            "correct": 0,
            "explanation": "In InnoDB, secondary index leaf nodes store the indexed key along with the primary key. A query on a secondary index performs an index search followed by a 'Bookmark Lookup' (searching the primary clustered index)."
          },
          {
            "question": "What is a 'Covering Index' (Index-Only Scan) in database query optimization?",
            "options": [
              "An index that contains ALL columns requested by the SQL query (`SELECT`), satisfying the query entirely from the index leaf pages without accessing the table data pages",
              "An index that covers multiple database tables simultaneously",
              "An index that covers foreign key constraints",
              "An index that encrypts disk files"
            ],
            "correct": 0,
            "explanation": "A Covering Index contains all columns needed by `SELECT` and `WHERE`. The database engine satisfies the entire query directly from the B+ Tree leaf pages without performing secondary lookup table hops."
          },
          {
            "question": "What is the difference between an 'Index Seek' and an 'Index Scan' in a query execution plan?",
            "options": [
              "Index Seek traverses tree levels from root to leaf to locate specific keys; Index Scan reads through leaf pages sequentially",
              "Index Seek is for strings; Index Scan is for integers",
              "Index Seek is slower than a Full Table Scan",
              "Index Scan only runs on memory databases"
            ],
            "correct": 0,
            "explanation": "An Index Seek navigates tree levels ($\\\\mathcal{O}(\\\\log_B N)$) to pinpoint specific rows. An Index Scan scans through ranges of leaf pages sequentially."
          },
          {
            "question": "Why do B+ Tree leaf node linked lists deliver near-memory speed during sequential scans on NVMe SSDs?",
            "options": [
              "Contiguous sequential leaf pages take full advantage of SSD hardware controller read-ahead prefetching and kernel page buffering",
              "Linked lists bypass the CPU ALU",
              "Linked lists disable file locks",
              "SSDs eliminate electrical resistance"
            ],
            "correct": 0,
            "explanation": "Sequential leaf traversal triggers hardware and OS read-ahead prefetching, streaming adjacent physical pages into the Buffer Pool before the database engine even requests them."
          },
          {
            "question": "What is 'Index Condition Pushdown' (ICP) in modern database query engines?",
            "options": [
              "Pushing `WHERE` clause filter conditions down into the storage engine level so non-matching rows are discarded during index leaf traversal before fetching table data",
              "Pushing index files to remote CDN servers",
              "Writing index changes directly to disk without WAL",
              "Converting SQL conditions into stored procedures"
            ],
            "correct": 0,
            "explanation": "Index Condition Pushdown (ICP) evaluates applicable `WHERE` predicates directly in the storage engine during the B+ tree index scan, drastically reducing the number of row fetches from the base table."
          },
          {
            "question": "What is the disadvantage of having too many secondary B+ Tree indices on a high-write OLTP table?",
            "options": [
              "Every `INSERT`, `UPDATE`, and `DELETE` must synchronously modify and rebalance every single secondary B+ tree, causing severe write amplification and lock contention",
              "The database limits tables to a maximum of 2 indices",
              "Secondary indices disable ACID transactions",
              "Secondary indices cause database crashes on reboots"
            ],
            "correct": 0,
            "explanation": "Each secondary index is an independent B+ tree on disk. Every insert/update/delete must modify all index trees, multiplying disk I/O, page splits, and WAL logging overhead."
          },
          {
            "question": "What is a 'Prefix Index' / Key Compression in B+ Tree leaf optimization?",
            "options": [
              "Storing only the differentiating prefix of long string keys in index pages to fit more keys per page and boost fan-out",
              "Compressing index names in the SQL catalog",
              "Encrypting string passwords with MD5",
              "Shortening column names in database schemas"
            ],
            "correct": 0,
            "explanation": "Key prefix truncation stores only the minimum distinctive prefix required to differentiate adjacent keys in a page, saving space and increasing node fan-out."
          },
          {
            "question": "How does a B+ Tree handle `ORDER BY id DESC` queries?",
            "options": [
              "It traverses to the rightmost leaf page and walks backwards along the doubly-linked leaf chain using `prev` pointers",
              "It must copy all rows to temporary disk files and sort them",
              "Descending queries are not supported on B+ Trees",
              "It inverts the CPU byte endianness"
            ],
            "correct": 0,
            "explanation": "Because B+ Tree leaf nodes are connected via a bidirectional doubly-linked list (`next` and `prev` pointers), reverse scans (`ORDER BY id DESC`) simply traverse backwards through leaf pages with zero sort cost."
          }
        ]
      }
    ]
  },
  {
    "id": "llm-transformers",
    "title": "LLM Architecture: Multi-Head Attention, RoPE & PagedAttention KV Cache",
    "subject": "Artificial Intelligence & Large Language Model Systems",
    "difficulty": "Mastery / Advanced AI Systems",
    "duration": "35 mins",
    "tags": [
      "LLM",
      "Transformers",
      "Attention",
      "RoPE",
      "KV Cache",
      "vLLM",
      "PagedAttention"
    ],
    "professor": {
      "name": "Prof. Vyomra",
      "role": "Lead AI Professor of Deep Learning & Transformer Architectures",
      "avatar": "👨‍🏫",
      "voicePitch": 0.95,
      "voiceRate": 0.98
    },
    "classmates": [
      {
        "id": "alex",
        "name": "Alex",
        "title": "Alex (Curious Skeptic)",
        "avatar": "🧑‍💻",
        "color": "text-amber-400",
        "role": "Edge-Case Specialist",
        "pitch": 1.2
      },
      {
        "id": "maya",
        "name": "Maya",
        "title": "Maya (Performance Hacker)",
        "avatar": "👩‍💻",
        "color": "text-cyan-400",
        "role": "Memory & Low-Level",
        "pitch": 1.3
      }
    ],
    "scenes": [
      {
        "id": "scene-llm-1",
        "slideNumber": 1,
        "title": "Slide 1: The Attention Mechanism & Scaled Dot-Product Formulation",
        "slideSubtitle": "Query, Key, Value tensor projections, scaling factor sqrt(d_k), and quadratic O(L^2) attention complexity.",
        "takeaways": [
          "Scaled Dot-Product Attention: Computes dynamic contextual attention weights between all token pairs using query-key similarity scaled by 1/sqrt(d_k).",
          "The Scaling Factor: For large head dimensions d_k, dot products grow large in magnitude, pushing the softmax function into regions with vanishing gradients.",
          "Semantic Roles: Query represents \"what I am searching for\", Key represents \"what attributes I contain\", and Value represents \"what content to transfer\".",
          "Quadratic Complexity O(L^2): Standard self-attention scales quadratically with sequence length L in both compute FLOPS and attention matrix memory.",
          "Causal Masking (Upper Triangle): Autoregressive decoder models apply a -inf mask to future token positions to enforce strictly forward causal prediction."
        ],
        "whiteboardContent": "# The Scaled Dot-Product Attention Formulation\n\n### The Master Equation:\n$$\\mathbf{\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} + M \\right) V}$$\n\n| Tensor | Dimensions | Conceptual Meaning |\n| :--- | :--- | :--- |\n| **Query ($Q$)** | $L \\times d_k$ | What information the current token is seeking |\n| **Key ($K$)** | $L \\times d_k$ | What features/attributes this token offers for matching |\n| **Value ($V$)** | $L \\times d_v$ | The semantic content transferred when attention matches |\n| **Mask ($M$)** | $L \\times L$ | Causal mask ($0$ for past, $-\\infty$ for future tokens) |\n\n---\n\n### Softmax Gradient Stabilizer Invariant:\n$$\\text{Var}(q \\cdot k) = d_k \\implies \\mathbf{\\frac{1}{\\sqrt{d_k}} \\text{ normalizes variance to } 1.0 \\text{ to prevent softmax saturation!}}$$",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     SCALED DOT-PRODUCT ATTENTION PIPELINE                │\n├──────────────────────────────────────────────────────────────────────────┤\n│  Token Embeddings (X) ──┬──> [ W_Q ] ──> Query Tensor (Q)                │\n│                         ├──> [ W_K ] ──> Key Tensor (K)                  │\n│                         └──> [ W_V ] ──> Value Tensor (V)                │\n│                                                │                         │\n│  [ Q ] x [ K^T ] ──> [ (Q K^T) / sqrt(d_k) ] ──┴──> [ Causal Mask M ]    │\n│                                                             │            │\n│                                                             ▼            │\n│                     [ Context Vector Output ] <── [ Softmax Weights ]    │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "import numpy as np\n\ndef scaled_dot_product_attention(Q, K, V, causal_mask=True):\n    d_k = Q.shape[-1]\n    # 1. Compute similarity logits\n    scores = np.matmul(Q, K.swapaxes(-2, -1)) / np.sqrt(d_k)\n    \n    # 2. Apply causal upper-triangular mask\n    if causal_mask:\n        seq_len = Q.shape[-2]\n        mask = np.triu(np.ones((seq_len, seq_len)), k=1)\n        scores = np.where(mask == 1, -1e9, scores)\n        \n    # 3. Softmax & weighted Value sum\n    attention_weights = np.exp(scores - np.max(scores, axis=-1, keepdims=True))\n    attention_weights /= np.sum(attention_weights, axis=-1, keepdims=True)\n    return np.matmul(attention_weights, V)",
        "terminalOutput": "[ATTENTION TRACE] Sequence length: 4 tokens | d_k = 64\n>>> Raw QK^T Variance: 63.82 -> Scaled Variance: 1.00\n>>> Softmax Gradient Norm: 0.248 (Stable, zero vanishing gradients)\n>>> Output Context Matrix: Shape (4, 64) computed in 0.04ms.",
        "dialogue": [
          {
            "speaker": "professor",
            "text": "Welcome to LLM Systems Architecture! Today we dissect the mathematical heart of Modern AI: Self-Attention and Paged Memory."
          },
          {
            "speaker": "alex",
            "text": "Professor, why do we divide by the square root of d_k? What happens if we skip it?"
          },
          {
            "speaker": "professor",
            "text": "If you skip dividing by sqrt(d_k), for large vector dimensions (like d_k = 128), the dot products blow up into hundreds. Softmax exponentiates those into massive numbers, saturating outputs to 1 and 0, which completely destroys backpropagation gradients!"
          }
        ],
        "quizzes": [
          {
            "question": "What is the standard mathematical formulation for Scaled Dot-Product Attention in Transformer architectures?",
            "options": [
              "$$\\\\text{Attention}(Q, K, V) = \\\\text{softmax}\\\\left(\\\\frac{QK^T}{\\\\sqrt{d_k}}\\\\right)V$$",
              "$$\\\\text{Attention}(Q, K, V) = \\\\text{sigmoid}(Q + K) \\\\times V$$",
              "$$\\\\text{Attention}(Q, K, V) = \\\\text{ReLU}(QK^T) + V$$",
              "$$\\\\text{Attention}(Q, K, V) = \\\\frac{Q \\\\cdot K \\\\cdot V}{d_k}$$"
            ],
            "correct": 0,
            "explanation": "Scaled Dot-Product Attention computes query-key similarity matrix $QK^T$, scales by $1/\\\\sqrt{d_k}$, applies softmax row-wise to obtain attention weights, and computes the weighted sum of values $V$."
          },
          {
            "question": "Why is the scaling factor $\\\\frac{1}{\\\\sqrt{d_k}}$ applied to the dot products $QK^T$ before softmax?",
            "options": [
              "For large head dimensions $d_k$, dot products grow large in magnitude, pushing the softmax function into regions with near-zero gradients (vanishing gradients)",
              "To normalize token embeddings between -1 and 1",
              "To invert the matrix for GPU tensor cores",
              "To reduce floating-point precision from FP32 to FP16"
            ],
            "correct": 0,
            "explanation": "When $d_k$ is large, the variance of $q \\\\cdot k$ grows as $\\\\mathcal{O}(d_k)$. Without scaling by $1/\\\\sqrt{d_k}$, softmax outputs saturate to 1 and 0, causing vanishing gradients during backpropagation."
          },
          {
            "question": "What are the conceptual roles of Query ($Q$), Key ($K$), and Value ($V$) in self-attention?",
            "options": [
              "Query: 'What is this token looking for?'; Key: 'What attributes does this token offer?'; Value: 'What content should be transferred if matched?'",
              "Query: database SQL; Key: primary key; Value: table column",
              "Query: input text; Key: output text; Value: loss function",
              "Query: prompt tokens; Key: GPU registers; Value: weights"
            ],
            "correct": 0,
            "explanation": "In attention, each token generates: a Query (representing what information it seeks), a Key (representing what information it contains), and a Value (the actual semantic vector transferred when attention matches)."
          },
          {
            "question": "What is the computational and memory complexity of standard Self-Attention with respect to sequence length $L$?",
            "options": [
              "$\\\\mathcal{O}(L^2)$ quadratic complexity in time and memory",
              "$\\\\mathcal{O}(L)$ linear complexity",
              "$\\\\mathcal{O}(\\\\log L)$ logarithmic complexity",
              "$\\\\mathcal{O}(L^3)$ cubic complexity"
            ],
            "correct": 0,
            "explanation": "Computing the $QK^T$ matrix requires an $L \\\\times L$ matrix multiplication and storing $L \\\\times L$ attention scores for all pairs of tokens, resulting in $\\\\mathcal{O}(L^2)$ quadratic complexity."
          },
          {
            "question": "What is the purpose of 'Causal Masking' (Upper Triangular Mask) in Autoregressive Decoder LLMs (e.g. GPT-4, LLaMA)?",
            "options": [
              "To set attention scores of future token positions to $-\\\\infty$ before softmax so each token can only attend to previous and current tokens",
              "To mask out profanity and harmful content",
              "To reduce GPU memory by 50%",
              "To prevent dropout during inference"
            ],
            "correct": 0,
            "explanation": "In autoregressive language generation, a token at position $i$ must not 'cheat' by seeing future tokens ($j > i$). Applying $-\\\\infty$ to upper-triangle positions forces future attention weights to $\\\\text{softmax}(-\\\\infty) = 0$."
          },
          {
            "question": "What is the dimensionality of the attention weight matrix resulting from $\\\\text{softmax}\\\\left(\\\\frac{QK^T}{\\\\sqrt{d_k}}\\\\right)$ for a sequence of length $L$?",
            "options": [
              "$L \\\\times L$ matrix",
              "$L \\\\times d_k$ matrix",
              "$d_k \\\\times d_k$ matrix",
              "$1 \\\\times L$ vector"
            ],
            "correct": 0,
            "explanation": "Multiplying $Q$ (shape $L \\\\times d_k$) with $K^T$ (shape $d_k \\\\times L$) yields an $L \\\\times L$ square matrix representing pairwise attention scores between all tokens."
          },
          {
            "question": "Why is self-attention intrinsically permutation-invariant without positional information?",
            "options": [
              "The dot products $q_i \\\\cdot k_j$ depend solely on token embedding contents, not their sequence indices in the sentence",
              "Because attention uses commutative addition",
              "Because matrix multiplication is symmetric",
              "Because GPUs execute threads out of order"
            ],
            "correct": 0,
            "explanation": "If you shuffle the input tokens in a sentence, standard self-attention outputs the exact same vectors just shuffled to the new positions. Positional encodings must be injected to encode word order."
          },
          {
            "question": "What is 'FlashAttention' (Dao et al.) and how does it optimize self-attention on GPUs?",
            "options": [
              "An exact attention algorithm that tiles $Q, K, V$ blocks into fast GPU SRAM and uses online softmax to compute attention without materializing the large $L \\\\times L$ matrix in slow HBM",
              "An approximate quantization algorithm that drops 50% of tokens",
              "A multi-threaded CPU compiler for transformers",
              "A dynamic prompt pruning algorithm"
            ],
            "correct": 0,
            "explanation": "FlashAttention computes exact standard attention with zero loss by tiling blocks into fast GPU on-chip SRAM and computing softmax incrementally, cutting memory reads from High Bandwidth Memory (HBM) by 5x-10x."
          },
          {
            "question": "What is the output shape when the $L \\\\times L$ attention weight matrix is multiplied by the Value matrix $V$ ($L \\\\times d_v$)?",
            "options": [
              "$L \\\\times d_v$",
              "$L \\\\times L$",
              "$d_v \\\\times d_v$",
              "$1 \\\\times d_v$"
            ],
            "correct": 0,
            "explanation": "Multiplying $(L \\\\times L) \\\\times (L \\\\times d_v)$ yields an $L \\\\times d_v$ context representation matrix where each row is a weighted sum of value vectors."
          },
          {
            "question": "How does Self-Attention differ from Cross-Attention in Encoder-Decoder models?",
            "options": [
              "In Self-Attention, $Q, K, V$ all originate from the same input sequence; in Cross-Attention, $Q$ comes from the decoder while $K$ and $V$ come from the encoder",
              "Self-attention only runs on CPUs",
              "Cross-attention does not use softmax",
              "Self-attention cannot generate text"
            ],
            "correct": 0,
            "explanation": "In Self-Attention, queries, keys, and values are projections of the same sequence. In Cross-Attention, the decoder provides queries ($Q$) to attend over keys ($K$) and values ($V$) generated by the encoder."
          }
        ]
      },
      {
        "id": "scene-llm-2",
        "slideNumber": 2,
        "title": "Slide 2: Multi-Head Attention & Subspace Representation Projections",
        "slideSubtitle": "Parallel subspace attention heads, Multi-Query (MQA), and Grouped-Query Attention (GQA).",
        "takeaways": [
          "Multi-Head Attention (MHA): Splitting embeddings across h heads allows the network to simultaneously attend to syntax, facts, coreferences, and long-range dependencies.",
          "Head Projections: Queries, Keys, and Values are projected into d_k = d_model / h dimensional spaces, concatenated, and projected through W_O.",
          "Multi-Query Attention (MQA): Shares a single Key and Value head across all Query heads to reduce KV cache memory by h-fold.",
          "Grouped-Query Attention (GQA): Partitions Q heads into G groups sharing KV heads (e.g. 8 KV heads for 32 Q heads in LLaMA-3), balancing speed and accuracy.",
          "Memory Bandwidth Wall: In autoregressive generation, memory bandwidth to transfer KV caches dominates compute time, making GQA standard in modern LLMs."
        ],
        "whiteboardContent": "# Multi-Head Attention & KV Head Architectures\n\n### Multi-Head Attention Formula:\n$$\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$\n$$\\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$\n\n---\n\n### Attention Variants Comparison (LLaMA-3 / Mistral):\n\n| Architecture | Query Heads ($h_Q$) | KV Heads ($h_{KV}$) | KV Cache Memory Savings |\n| :--- | :--- | :--- | :--- |\n| **MHA (Standard)** | 32 heads | 32 heads | $1\\times$ (Baseline / Large Cache) |\n| **GQA (Grouped-Query)** | **32 heads** | **8 heads (4:1)** | **$4\\times$ Reduction (75% savings!)** |\n| **MQA (Multi-Query)** | 32 heads | 1 head (32:1) | $32\\times$ Reduction (Max speed) |",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     MULTI-HEAD ATTENTION PROJECTION                      │\n├──────────────────────────────────────────────────────────────────────────┤\n│  Input Tensor (d_model = 4096)                                           │\n│  ├──> Head 1 (d_k=128): Attends to grammatical syntax & word order       │\n│  ├──> Head 2 (d_k=128): Attends to pronouns & coreference resolution     │\n│  ├──> Head 3 (d_k=128): Attends to semantic factual associations         │\n│  └──> Head 32 (d_k=128): Attends to long-distance structural context     │\n│                                                                          │\n│  [ Concat All 32 Heads: (4096) ] ──> [ W_O Linear Projection ]           │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// PyTorch-style Grouped-Query Attention (GQA) Head Projection\npublic class GroupedQueryAttention {\n    private final int numQHeads = 32;\n    private final int numKVHeads = 8; // GQA-8 (4 Q heads per 1 KV head)\n    private final int headDim = 128;\n    \n    public int computeKVCacheBytesPerToken(int numLayers) {\n        // 2 tensors (K and V) * numKVHeads * headDim * 2 bytes (FP16)\n        int bytesPerLayer = 2 * numKVHeads * headDim * 2; // 4,096 bytes/layer\n        return bytesPerLayer * numLayers; // 131 KB per token across 32 layers\n    }\n}",
        "terminalOutput": "[GQA BENCHMARK] LLaMA-3 8B (32 Layers, 32 Q heads, 8 KV heads)\n>>> MHA KV Cache per 8k context: 2.14 GB / user\n>>> GQA-8 KV Cache per 8k context: 0.53 GB / user (75% memory saved!)\n>>> Max concurrent serving throughput increased by 400%.",
        "dialogue": [
          {
            "speaker": "maya",
            "text": "Why is Grouped-Query Attention (GQA) used in almost all state-of-the-art open models like LLaMA-3 and Mistral?"
          },
          {
            "speaker": "professor",
            "text": "Because in production LLM serving, GPU High Bandwidth Memory (HBM) fills up rapidly with the KV cache. GQA cuts the KV cache size by 75% with virtually zero loss in benchmark reasoning capability!"
          }
        ],
        "quizzes": [
          {
            "question": "Why does Multi-Head Attention (MHA) project queries, keys, and values into $h$ distinct subspace heads instead of using a single large attention head?",
            "options": [
              "To allow the model to simultaneously attend to information from different representation subspaces at different positions (e.g. syntax, coreference, factual relations)",
              "To reduce total parameter count",
              "Because single-head attention cannot run on GPUs",
              "To bypass the need for backpropagation"
            ],
            "correct": 0,
            "explanation": "Multi-Head Attention splits the hidden dimension $d_{\\\\text{model}}$ into $h$ heads ($d_k = d_{\\\\text{model}} / h$). Each head specializes in capturing different semantic, syntactic, and relational dependencies in parallel."
          },
          {
            "question": "What is the output projection step in Multi-Head Attention after all $h$ heads are computed?",
            "options": [
              "Concatenate the outputs of all $h$ heads $[\\\\text{head}_1, \\\\dots, \\\\text{head}_h]$ and multiply by the output weight matrix $W^O$",
              "Average all head matrices together",
              "Select the single head with the highest attention score",
              "Apply a softmax over the heads"
            ],
            "correct": 0,
            "explanation": "MHA concatenates all $h$ head outputs (shape $L \\\\times (h \\\\cdot d_v) = L \\\\times d_{\\\\text{model}}$) and projects them through a final linear transformation $W^O \\\\in \\\\mathbb{R}^{d_{\\\\text{model}} \\\\times d_{\\\\text{model}}}$."
          },
          {
            "question": "What is 'Multi-Query Attention' (MQA) introduced by Shazeer (2019)?",
            "options": [
              "An attention variant where all attention heads share a single common Key ($K$) head and a single Value ($V$) head, drastically reducing KV cache size during inference",
              "Executing multiple user queries simultaneously on an LLM",
              "Using multiple query vectors per single token",
              "An ensemble of multiple transformer models"
            ],
            "correct": 0,
            "explanation": "Multi-Query Attention keeps multiple Query heads ($h_Q$) but collapses Key and Value projections to a single head ($h_{KV} = 1$). This reduces KV cache memory consumption by $h$-fold and speeds up autoregressive decoding."
          },
          {
            "question": "What is 'Grouped-Query Attention' (GQA) used in modern models like LLaMA-2/3 and Mistral?",
            "options": [
              "A middle-ground architecture that partitions $Q$ heads into $G$ groups, with each group sharing one Key and Value head ($1 < G < h_Q$)",
              "Grouping multiple user prompts into one batch",
              "An algorithm for clustering similar tokens",
              "A technique to merge weights of multiple models"
            ],
            "correct": 0,
            "explanation": "Grouped-Query Attention (GQA) divides $h_Q$ query heads into $G$ groups (e.g. 8 KV heads for 32 Query heads, $G=4$). It delivers nearly the full accuracy of MHA while achieving the inference speed and memory efficiency of MQA."
          },
          {
            "question": "If a model has $d_{\\\\text{model}} = 4096$ and $h = 32$ attention heads, what is the dimension of each individual head $d_k$?",
            "options": [
              "$d_k = 128$ ($4096 / 32$)",
              "$d_k = 512$",
              "$d_k = 64$",
              "$d_k = 4096$"
            ],
            "correct": 0,
            "explanation": "Standard transformer architectures partition the hidden embedding dimension evenly across heads: $d_k = d_v = d_{\\\\text{model}} / h = 4096 / 32 = 128$."
          },
          {
            "question": "What is the total parameter count of the four projection matrices ($W_Q, W_K, W_V, W_O$) in a standard Multi-Head Attention layer with dimension $d_{\\\\text{model}}$?",
            "options": [
              "$4 \\\\times d_{\\\\text{model}}^2$",
              "$2 \\\\times d_{\\\\text{model}}^2$",
              "$8 \\\\times d_{\\\\text{model}}^2$",
              "$16 \\\\times d_{\\\\text{model}}$"
            ],
            "correct": 0,
            "explanation": "Each of the 4 weight matrices ($W_Q, W_K, W_V, W_O$) has dimensions $d_{\\\\text{model}} \\\\times d_{\\\\text{model}}$, contributing $4 \\\\times d_{\\\\text{model}}^2$ weights to the attention block."
          },
          {
            "question": "Why is memory bandwidth (rather than compute TFLOPS) the primary bottleneck during autoregressive token generation in Multi-Head Attention?",
            "options": [
              "Generating each new token requires loading all previous tokens' KV cache weights from GPU HBM into SRAM for just a single matrix-vector multiplication (Arithmetic Intensity $\\\\approx 1$)",
              "CPUs cannot transfer data to GPUs",
              "Softmax cannot run in parallel",
              "Tokens are compressed using gzip"
            ],
            "correct": 0,
            "explanation": "During generation (batch size 1), each token step does very few arithmetic operations per byte loaded from memory. The GPU compute cores sit idle waiting for memory bandwidth to stream KV cache tensors from HBM."
          },
          {
            "question": "How does Grouped-Query Attention (GQA-8) impact KV cache memory compared to standard Multi-Head Attention (MHA-32)?",
            "options": [
              "It reduces the KV cache memory footprint and bandwidth requirements by $4\\\\times$ (75% reduction)",
              "It reduces KV cache by $32\\\\times$",
              "It increases KV cache size by $2\\\\times$",
              "It has zero impact on KV cache size"
            ],
            "correct": 0,
            "explanation": "Going from 32 KV heads to 8 KV heads reduces the number of Key and Value vectors cached per token from 32 to 8, cutting KV cache size and memory bandwidth traffic by $32/8 = 4\\\\times$."
          },
          {
            "question": "What is the function of the Feed-Forward Network (FFN / MLP) layer following the Multi-Head Attention block in a transformer layer?",
            "options": [
              "To apply non-linear token-wise transformations (typically SwiGLU or GeLU activations) and expand representation capacity ($d_{\\\\text{ffn}} \\\\approx 4 d_{\\\\text{model}}$)",
              "To compress the sequence length by half",
              "To perform positional encoding",
              "To calculate cross-entropy loss"
            ],
            "correct": 0,
            "explanation": "While MHA mixes information across different token positions, the position-wise Feed-Forward Network (FFN) applies non-linear feature transformations to each token independently."
          },
          {
            "question": "What role do Residual Connections (Skip Connections) and RMSNorm / LayerNorm play in deep transformer stacks?",
            "options": [
              "They allow gradients to flow directly through hundreds of layers without vanishing or exploding, stabilizing deep model training",
              "They encrypt neural network weights",
              "They reduce the context window size",
              "They eliminate the need for attention heads"
            ],
            "correct": 0,
            "explanation": "Residual additions ($x + \\\\text{SubLayer}(x)$) paired with Pre-LayerNorm / RMSNorm maintain stable variance and provide identity gradient highways during backpropagation through 30–100+ transformer layers."
          }
        ]
      },
      {
        "id": "scene-llm-3",
        "slideNumber": 3,
        "title": "Slide 3: Positional Embeddings: Sinusoidal vs Rotary (RoPE)",
        "slideSubtitle": "Why transformers are permutation invariant, 2D complex subspace rotations, and relative distance decay.",
        "takeaways": [
          "Permutation Invariance: Without positional encoding, self-attention treats \"Dog bites man\" and \"Man bites dog\" as completely identical bag-of-words.",
          "Rotary Position Embedding (RoPE): Encodes position by multiplying 2D chunks of Query and Key vectors by rotation matrices proportional to token index m*theta.",
          "Relative Position Decay: The inner product <R_m q, R_n k> naturally decays as token distance |m - n| increases, matching natural language syntax.",
          "Zero Trainable Parameters: RoPE is a closed-form mathematical rotation introducing zero learned embedding weights.",
          "Context Window Scaling: RoPE base frequency scaling (theta = 500,000 in LLaMA-3) enables seamless context length extrapolation to 128K+ tokens."
        ],
        "whiteboardContent": "# Rotary Position Embedding (RoPE) Mechanics\n\n### The 2D Subspace Rotation Equation:\n$$\\mathbf{R}_{\\Theta, m}^d \\mathbf{q} = \\begin{pmatrix} \\cos(m\\theta_i) & -\\sin(m\\theta_i) \\\\ \\sin(m\\theta_i) & \\cos(m\\theta_i) \\end{pmatrix} \\begin{pmatrix} q_{2i} \\\\ q_{2i+1} \\end{pmatrix}$$\n\n---\n\n### The Relative Distance Invariant:\n$$\\mathbf{\\langle R_{\\Theta, m} q, R_{\\Theta, n} k \\rangle = g(q, k, m - n)}$$\n* The attention score between token at position $m$ and token at position $n$ depends **strictly on the relative distance $(m - n)$**, not their absolute positions!",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     ROTARY POSITION EMBEDDING (RoPE)                     │\n├──────────────────────────────────────────────────────────────────────────┤\n│  Query Vector q at Position m=1:         Query Vector q at Position m=5: │\n│          (Rotated by 1 * theta)                     (Rotated by 5 * theta)│\n│               ▲                                          ▲               │\n│              /                                           │               │\n│             /                                            │               │\n│            /                                             │               │\n│           └───────►                                      └───────►       │\n│                                                                          │\n│  >>> Dot Product <R_m q, R_n k> measures relative angle (m - n) * theta! │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "import torch\n\ndef apply_rotary_pos_emb(x, freqs_cis):\n    # x: (batch, seq_len, n_heads, head_dim)\n    # Reshape x into complex pairs\n    x_complex = torch.view_as_complex(x.float().reshape(*x.shape[:-1], -1, 2))\n    # Multiply by complex rotation e^(i * m * theta)\n    x_rotated = x_complex * freqs_cis\n    # Convert back to real tensor\n    return torch.view_as_real(x_rotated).flatten(-2)",
        "terminalOutput": "[RoPE KERNEL] Applied 2D Complex Rotations (Head Dim = 128)\n>>> Relative token distance (m - n = 1): Attention Score = 0.892\n>>> Relative token distance (m - n = 500): Attention Score = 0.041 (Natural decay)\n>>> Zero extra trainable parameters allocated.",
        "dialogue": [
          {
            "speaker": "alex",
            "text": "Why is RoPE superior to traditional positional embeddings that were simply added to input tokens?"
          },
          {
            "speaker": "professor",
            "text": "Traditional additive embeddings destroy vector directionality at deeper layers. RoPE rotates vectors in 2D subspaces at every single attention layer, perfectly preserving relative geometric distances across thousands of tokens!"
          }
        ],
        "quizzes": [
          {
            "question": "What is Rotary Position Embedding (RoPE) and why is it used in modern LLMs (LLaMA, Mistral, Gemma)?",
            "options": [
              "A relative positional encoding technique that encodes position by rotating 2D subspace pairs of Query and Key vectors by an angle proportional to token position $m\\\\theta$",
              "A method to rotate GPU tensors in memory to prevent overheating",
              "A sinusoidal encoding added directly to word embeddings at layer 0",
              "A neural network that predicts next-token positions"
            ],
            "correct": 0,
            "explanation": "RoPE (Su et al.) encodes position by multiplying 2D chunks of $Q$ and $K$ vectors by rotation matrices $R_{\\\\Theta, m}^d$. The inner product $\\\\langle R_m q, R_n k \\\\rangle$ naturally depends only on the relative distance $m - n$."
          },
          {
            "question": "How does RoPE differ from the original Attention Is All You Need sinusoidal positional encoding?",
            "options": [
              "Original sinusoidal encodings were added to input embeddings at Layer 0; RoPE is applied multiplicatively (as a complex rotation) to $Q$ and $K$ at EVERY attention layer",
              "RoPE uses learned parameters; sinusoidal does not",
              "Sinusoidal encodings only work on English text",
              "RoPE removes query and key vectors"
            ],
            "correct": 0,
            "explanation": "Original absolute encodings ($x + PE$) are added once at the input embedding layer. RoPE applies rotation directly to the $Q$ and $K$ vectors in each attention layer before computing $QK^T$."
          },
          {
            "question": "What happens to the inner product $\\\\langle \\\\mathbf{R}_m \\\\mathbf{q}, \\\\mathbf{R}_n \\\\mathbf{k} \\\\rangle$ in RoPE when two tokens are separated by distance $m - n$?",
            "options": [
              "It evaluates to a function depending ONLY on the relative distance $(m - n)$ and the vector contents, with attention decay as distance increases",
              "It evaluates to zero",
              "It increases exponentially with sequence length",
              "It equals the absolute token position $m \\\\times n$"
            ],
            "correct": 0,
            "explanation": "By Euler's formula in complex space, $\\\\text{Re}[(q e^{i m \\\\theta})(k e^{i n \\\\theta})^*] = \\\\text{Re}[q k^* e^{i (m-n)\\\\theta}]$, making the attention score naturally invariant to absolute shifts and dependent strictly on relative distance $m - n$."
          },
          {
            "question": "What is 'RoPE Base Frequency' ($\\\\theta$) scaling (e.g. increasing base frequency from 10,000 to 500,000 in LLaMA-3)?",
            "options": [
              "A technique to scale wavelength frequencies across dimensions to extrapolate context window length from 4K/8K to 128K+ tokens without loss of attention precision",
              "Overclocking the GPU clock frequency",
              "Increasing audio sample rates for speech models",
              "Scaling token generation temperature"
            ],
            "correct": 0,
            "explanation": "Increasing the RoPE base $\\\\theta$ (from $10^4$ to $5\\\\times 10^5$) slows down rotation speeds for higher dimensions, allowing the model to distinguish relative token positions across ultra-long context windows (128K+ tokens)."
          },
          {
            "question": "What is 'ALiBi' (Attention with Linear Biases, Press et al.)?",
            "options": [
              "A positional method that adds a static linear penalty $-m |i - j|$ directly to the attention matrix $QK^T$, enabling zero-shot context length extrapolation",
              "An adversarial training framework for LLM safety",
              "A loss function for reinforcement learning",
              "A quantization method for 4-bit weights"
            ],
            "correct": 0,
            "explanation": "ALiBi eliminates positional embeddings entirely and instead subtracts a static linear slope penalty $m(i - j)$ from attention logits, allowing models trained on 2K tokens to extrapolate gracefully to 8K+ tokens."
          },
          {
            "question": "Why do learned absolute positional embeddings (used in GPT-2 and BERT) struggle with context length extrapolation?",
            "options": [
              "The model never learned positional embedding vectors for token positions beyond the maximum training sequence length $L_{\\\\text{train}}$",
              "Learned embeddings consume 99% of GPU RAM",
              "Gradient descent cannot optimize embedding tables",
              "Absolute embeddings cause floating point underflow"
            ],
            "correct": 0,
            "explanation": "Learned positional embeddings use a lookup table of fixed size $L_{\\\\max}$. Any token at position $L > L_{\\\\max}$ has no embedding vector, preventing the model from processing longer sequences."
          },
          {
            "question": "In RoPE, how are dimensions of a $d$-dimensional head vector paired for 2D rotation?",
            "options": [
              "Adjacent dimension pairs $(x_{2i}, x_{2i+1})$ are treated as complex numbers $x_{2i} + i x_{2i+1}$ and multiplied by $e^{i m \\\\theta_i}$",
              "All dimensions are summed into a single scalar",
              "Dimensions are rotated around a 3D sphere",
              "Odd and even dimensions are swapped"
            ],
            "correct": 0,
            "explanation": "RoPE partitions a $d_k$-dimensional vector into $d_k / 2$ two-dimensional slices, treating each pair as coordinates on a 2D complex plane rotated by angle $m \\\\theta_i = m \\\\cdot 10000^{-2i/d}$."
          },
          {
            "question": "What is 'YaRN' (Yet another RoPE extensioN) in context window scaling?",
            "options": [
              "An advanced RoPE interpolation method that applies dimension-dependent temperature scaling to preserve high-frequency local attention while stretching low frequencies",
              "A package manager for Node.js scripts in LLMs",
              "A data distillation pipeline for synthetic datasets",
              "A model pruning library"
            ],
            "correct": 0,
            "explanation": "YaRN interpolates RoPE frequencies by decomposing dimensions into high-frequency (no interpolation), mid-frequency (smooth blending), and low-frequency (full interpolation) with entropy correction."
          },
          {
            "question": "Why is 'Relative Positional Encoding' conceptually superior to 'Absolute Positional Encoding' for natural language?",
            "options": [
              "Syntactic dependencies between words depend on the distance between words, not their absolute page or character index in a document",
              "Relative encodings use less RAM",
              "Absolute encodings are forbidden in PyTorch",
              "Relative encodings make translation impossible"
            ],
            "correct": 0,
            "explanation": "In natural language, the relationship between a subject and verb depends on their relative distance ('The dog that chased the cat ... barked'), regardless of whether the sentence appears at token 10 or token 10,000."
          },
          {
            "question": "Does RoPE add additional trainable parameters to the Transformer architecture?",
            "options": [
              "No: RoPE is a deterministic mathematical rotation with zero learnable parameters",
              "Yes: It adds $d_{\\\\text{model}} \\\\times L$ parameters per layer",
              "Yes: It adds an MLP layer to each attention block",
              "Yes: It trains a separate rotation embedding table"
            ],
            "correct": 0,
            "explanation": "RoPE is a fixed, closed-form mathematical operation computed from token positions and pre-defined frequencies $\\\\theta_i$, introducing zero extra trainable parameters."
          }
        ]
      },
      {
        "id": "scene-llm-4",
        "slideNumber": 4,
        "title": "Slide 4: Autoregressive KV Caching & PagedAttention Virtual Memory",
        "slideSubtitle": "The decoding memory wall, fragmentation elimination in vLLM, and zero-copy prefix sharing.",
        "takeaways": [
          "Autoregressive KV Cache: Stores past Key and Value tensors in GPU memory to avoid recomputing O(L^2) attention representations during token-by-token generation.",
          "The Memory Wall: In a 70B model, serving 16 users with 4k context consumes >20GB of GPU VRAM solely for the KV cache.",
          "Memory Fragmentation Problem: Traditional serving pre-allocates contiguous memory for max context, wasting 60–80% of GPU RAM due to internal and external fragmentation.",
          "PagedAttention (vLLM): Manages KV cache in non-contiguous physical memory blocks using OS-style page tables, eliminating fragmentation entirely.",
          "Copy-on-Write Prefix Sharing: Multiple parallel sampling branches or identical system prompts share the exact same physical memory blocks with zero duplicate RAM."
        ],
        "whiteboardContent": "# KV Cache Memory Footprint & PagedAttention\n\n### KV Cache Memory Size Formula (FP16 / 16-bit):\n$$\\mathbf{\\text{Memory (Bytes)} = 2 \\times 2 \\times n_{\\text{layers}} \\times n_{\\text{kv\\_heads}} \\times d_{\\text{head}} \\times L \\times B}$$\n* $2$: Keys and Values\n* $2$: 2 bytes per float16 parameter\n* $L$: Sequence context length\n* $B$: Batch size\n\n---\n\n### PagedAttention Block Table Mapping (vLLM):\n$$\\text{Logical KV Blocks: } [\\text{Block 0}] \\longrightarrow [\\text{Block 1}] \\longrightarrow [\\text{Block 2}]$$\n$$\\text{Physical GPU VRAM: } [\\text{Page ID: 0x4A}] \\quad [\\text{Page ID: 0x12}] \\quad [\\text{Page ID: 0x9F}]$$\n* Eliminates contiguous memory allocation $\\implies$ **Near 0% memory fragmentation!**",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│            PAGEDATTENTION VIRTUAL MEMORY ARCHITECTURE (vLLM)             │\n├──────────────────────────────────────────────────────────────────────────┤\n│  LOGICAL KV TOKENS (Sequence 1):                                         │\n│  [ \"The\", \"quick\", \"brown\", \"fox\" ] ──> Logical Block 0 (Mapped to Phys 7)│\n│  [ \"jumps\", \"over\", \"the\", \"lazy\" ] ──> Logical Block 1 (Mapped to Phys 2)│\n│                                                                          │\n│  PHYSICAL GPU HBM PAGES (Non-Contiguous):                                │\n│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │\n│  │ Phys Page 1   │ │ Phys Page 2   │ │ Phys Page 7   │ │ Phys Page 12  │ │\n│  │ (Seq 2 data)  │ │ (Seq 1 Blk 1) │ │ (Seq 1 Blk 0) │ │ (Free Pool)   │ │\n│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ │\n│  >>> Zero Contiguous Allocation | Zero Waste | Copy-on-Write Branching!   │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "// PagedAttention Block Manager Simulation\npublic class PagedKVCacheManager {\n    private final int blockSize = 16; // 16 tokens per physical block\n    private final Map<Integer, List<Integer>> blockTables = new HashMap<>(); // seqId -> physicalBlockIds\n    private final Stack<Integer> freePhysicalBlocks = new Stack<>();\n    \n    public void allocateToken(int seqId, int tokenPosition) {\n        List<Integer> table = blockTables.computeIfAbsent(seqId, k -> new ArrayList<>());\n        if (tokenPosition % blockSize == 0) {\n            // Allocate new non-contiguous physical block on demand\n            int newBlockId = freePhysicalBlocks.pop();\n            table.add(newBlockId);\n        }\n    }\n}",
        "terminalOutput": "[vLLM ENGINE] Serving 64 concurrent streams on 1x H100 GPU\n>>> Standard Serving: Out-Of-Memory at Batch Size 14 (68% memory wasted in gaps)\n>>> PagedAttention: Serving Batch Size 64 with 96.4% memory utilization!\n>>> Zero-Copy Prompt Sharing: Shared System Prompt across 64 users saving 18.2 GB.",
        "dialogue": [
          {
            "speaker": "maya",
            "text": "PagedAttention brings the exact same virtual memory paging operating systems invented 50 years ago to GPU LLM inference!"
          },
          {
            "speaker": "professor",
            "text": "Exactly, Maya! By decoupling logical token sequences from contiguous physical GPU memory, vLLM eliminated memory fragmentation and doubled real-world LLM serving throughput globally."
          }
        ],
        "quizzes": [
          {
            "question": "What is the primary purpose of 'Key-Value (KV) Caching' during autoregressive LLM inference?",
            "options": [
              "To store previously computed Key and Value tensors in GPU memory so the model does not recompute attention representations for past tokens when generating each new token",
              "To cache user prompts in a Redis database",
              "To save generated text to disk",
              "To compress model weights from FP16 to INT4"
            ],
            "correct": 0,
            "explanation": "During autoregressive decoding, tokens are generated one by one. Without KV caching, every step would recompute $Q, K, V$ for all preceding tokens ($\\\\mathcal{O}(L^2)$ computation per token). With KV caching, only the new token is computed ($\\\\mathcal{O}(L)$)."
          },
          {
            "question": "What is the formula for the total memory footprint of the KV Cache (in bytes) for a model using 16-bit precision (FP16/BF16)?",
            "options": [
              "$$\\\\text{Memory} = 2 \\\\times 2 \\\\times n_{\\\\text{layers}} \\\\times n_{\\\\text{kv\\\\_heads}} \\\\times d_{\\\\text{head}} \\\\times L \\\\times B \\\\text{ bytes}$$",
              "$$\\\\text{Memory} = n_{\\\\text{layers}} \\\\times L \\\\times B \\\\text{ bytes}$$",
              "$$\\\\text{Memory} = d_{\\\\text{model}}^2 \\\\times L \\\\text{ bytes}$$",
              "$$\\\\text{Memory} = 4 \\\\times B \\\\times L \\\\text{ bytes}$$"
            ],
            "correct": 0,
            "explanation": "For $B$ batch size and length $L$, each layer stores 2 tensors (Keys and Values), at 2 bytes per element (FP16), across $n_{\\\\text{layers}}$ layers, with $n_{\\\\text{kv\\\\_heads}}$ heads of dimension $d_{\\\\text{head}}$."
          },
          {
            "question": "What major memory problem in standard LLM serving systems does 'PagedAttention' (Kwon et al. / vLLM) solve?",
            "options": [
              "Memory fragmentation and over-allocation by managing the KV cache in non-contiguous virtual memory blocks (like OS virtual memory paging)",
              "Out-of-memory errors caused by model weights",
              "Slow CPU-GPU PCIe transfers",
              "Token hallucination during generation"
            ],
            "correct": 0,
            "explanation": "Standard serving pre-allocates large contiguous GPU memory buffers for maximum context lengths, wasting 60–80% of GPU RAM due to internal/external fragmentation. PagedAttention allocates fixed-size physical blocks on demand."
          },
          {
            "question": "How does PagedAttention enable efficient 'Parallel Sampling' (generating multiple outputs for the same prompt) and Beam Search?",
            "options": [
              "Multiple output sequences share the physical memory blocks of the common prompt via Copy-on-Write, consuming zero duplicate RAM for the prompt KV cache",
              "By duplicating model weights across GPU cores",
              "By running generation on CPU threads",
              "By truncating the prompt to 10 tokens"
            ],
            "correct": 0,
            "explanation": "PagedAttention uses Copy-on-Write block tables. When branching multiple completions from the same prompt, all outputs share the prompt's KV cache blocks in physical RAM without duplication."
          },
          {
            "question": "For a 70B parameter model ($n_{\\\\text{layers}}=80, n_{\\\\text{kv\\\\_heads}}=8, d_{\\\\text{head}}=128$, FP16) with batch size 16 and 4096 tokens, what is the KV cache memory size?",
            "options": [
              "$$\\\\approx 21.47 \\\\text{ GB of GPU RAM}$$",
              "$$\\\\approx 100 \\\\text{ MB}$$",
              "$$\\\\approx 2 \\\\text{ GB}$$",
              "$$\\\\approx 500 \\\\text{ GB}$$"
            ],
            "correct": 0,
            "explanation": "$2 \\\\times 2 \\\\text{ bytes} \\\\times 80 \\\\text{ layers} \\\\times 8 \\\\text{ heads} \\\\times 128 \\\\text{ dim} \\\\times 4096 \\\\text{ tokens} \\\\times 16 \\\\text{ batch} = 21,474,836,480 \\\\text{ bytes} \\\\approx 21.47 \\\\text{ GB}$ of VRAM just for the KV cache!"
          },
          {
            "question": "What is 'KV Cache Quantization' (e.g. FP8, INT8, INT4 KV cache)?",
            "options": [
              "Quantizing cached Key and Value vectors from 16-bit floats to 8-bit or 4-bit integers to reduce memory footprint by 50–75% and double serving throughput",
              "Deleting 50% of cached tokens randomly",
              "Rounding token probabilities during sampling",
              "Converting prompt strings to lowercase"
            ],
            "correct": 0,
            "explanation": "Quantizing the KV cache to FP8 or INT4 halves or quarters its memory footprint, allowing $2\\\\times$ to $4\\\\times$ larger batch sizes and much longer context lengths within the same GPU VRAM."
          },
          {
            "question": "What is 'Prefix Caching' (Prompt Caching) in LLM inference servers (vLLM, SGLang)?",
            "options": [
              "Storing the computed KV cache of common system prompts and few-shot examples across different user requests so repeated prefixes are evaluated in 0ms",
              "Caching DNS lookup addresses",
              "Pre-loading tokenizer vocabulary in CPU cache",
              "Saving user cookies in browser storage"
            ],
            "correct": 0,
            "explanation": "Prefix Caching stores and matches the hash of common system prompts (or multi-turn conversation history), reusing pre-computed KV blocks and eliminating prompt prefill latency for incoming requests."
          },
          {
            "question": "What is the difference between the 'Prefill Phase' and the 'Decoding Phase' in LLM inference?",
            "options": [
              "Prefill processes all prompt tokens in parallel ($\\\\mathcal{O}(1)$ step, compute-bound); Decoding generates one token at a time sequentially (memory-bandwidth-bound)",
              "Prefill runs on CPU; Decoding runs on GPU",
              "Prefill tokenizes text; Decoding translates languages",
              "Prefill is only used for training"
            ],
            "correct": 0,
            "explanation": "The Prefill phase processes the full input prompt concurrently to generate the initial KV cache (compute-bound, high GPU saturation). The Decoding phase generates output tokens one by one (memory-bound, low arithmetic intensity)."
          },
          {
            "question": "What is 'Speculative Decoding' (Leviathan et al.) in LLM acceleration?",
            "options": [
              "Using a small, fast draft model to propose $K$ candidate tokens in parallel, which the large target model verifies in a single forward pass",
              "Guessing tokens using random sampling",
              "Predicting user queries before they type",
              "Running LLMs on quantum computers"
            ],
            "correct": 0,
            "explanation": "Speculative Decoding pairs a small draft model (fast proposal) with a large target model (batch verification), generating 2-3x more tokens per second without altering the output probability distribution."
          },
          {
            "question": "What happens to the KV Cache when a generation request completes?",
            "options": [
              "Its physical memory blocks are returned to the free block pool in PagedAttention (or retained in prefix cache if configured)",
              "The GPU driver must be reloaded",
              "The entire model weights are reloaded into VRAM",
              "The physical memory is permanently locked"
            ],
            "correct": 0,
            "explanation": "Once generation terminates, the logical-to-physical block mapping is released, returning physical memory pages to the allocator's free list for immediate reuse by other requests."
          }
        ]
      }
    ]
  },
  {
    "id": "ml-llm-transformers",
    "title": "Machine Learning: Neural Networks, Transformers & LLMs",
    "subject": "Artificial Intelligence & Deep Learning",
    "difficulty": "Advanced",
    "duration": "30 mins",
    "tags": ["Machine Learning", "Transformers", "Neural Networks", "LLMs", "PyTorch"],
    "professor": {
      "name": "Prof. Vyomra",
      "role": "Lead AI Professor of Artificial Intelligence & Neural Architectures",
      "avatar": "🧠",
      "voicePitch": 0.95,
      "voiceRate": 0.98
    },
    "classmates": [
      { "id": "alex", "name": "Alex", "title": "Alex (Curious Skeptic)", "avatar": "🧑‍💻", "color": "text-amber-400", "role": "Edge-Case Specialist", "pitch": 1.2 },
      { "id": "priya", "name": "Priya", "title": "Priya (ML Engineer)", "avatar": "👩‍🔬", "color": "text-emerald-400", "role": "Algorithmic Precision", "pitch": 1.1 }
    ],
    "scenes": [
      {
        "id": "scene-ml-1",
        "slideNumber": 1,
        "title": "Slide 1: Self-Attention Mechanism & Transformer Architecture",
        "slideSubtitle": "Query, Key, Value vector projections, Scaled Dot-Product Attention, and Multi-Head Attention equations.",
        "takeaways": [
          "Self-Attention computes contextual representations by projecting input embeddings into Query (Q), Key (K), and Value (V) matrices.",
          "Scaled Dot-Product Attention formula: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V. Scaling by sqrt(d_k) prevents vanishing gradients.",
          "Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.",
          "Positional Encodings (Sinusoidal or Rotary RoPE) inject order information into token embeddings without recurrence."
        ],
        "whiteboardContent": "# Self-Attention & Multi-Head Transformer Matrix\n\n$$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$$\n\n---\n\n### Linear Projection Matrices:\n- $Q = X W_Q \\quad (N \\times d_k)$\n- $K = X W_K \\quad (N \\times d_k)$\n- $V = X W_V \\quad (N \\times d_v)$\n\n### Multi-Head Projection:\n$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$",
        "diagram": "┌──────────────────────────────────────────────────────────────────────────┐\n│                     MULTI-HEAD SELF-ATTENTION PIPELINE                   │\n├──────────────────────────────────────────────────────────────────────────┤\n│  Input Tokens X ───► Linear Projections ───► Q, K, V Matrices             │\n│                             │                                            │\n│             ┌───────────────┴───────────────┐                            │\n│             ▼                               ▼                            │\n│  [ Head 1: Q1, K1, V1 ]           [ Head H: Qh, Kh, Vh ]                 │\n│  Softmax(Q1 K1^T / sqrt(dk))      Softmax(Qh Kh^T / sqrt(dk))            │\n│             │                               │                            │\n│             └───────────────┬───────────────┘                            │\n│                             ▼                                            │\n│                  Concat(head_1 .. head_h) W^O ───► Context Output        │\n└──────────────────────────────────────────────────────────────────────────┘",
        "codeSnippet": "import torch\nimport torch.nn as nn\nimport math\n\nclass SelfAttention(nn.Module):\n    def __init__(self, embed_dim, heads):\n        super().__init__()\n        self.embed_dim = embed_dim\n        self.heads = heads\n        self.head_dim = embed_dim // heads\n        \n        self.qkv = nn.Linear(embed_dim, embed_dim * 3)\n        self.fc_out = nn.Linear(embed_dim, embed_dim)\n        \n    def forward(self, x):\n        B, N, D = x.shape\n        qkv = self.qkv(x).reshape(B, N, 3, self.heads, self.head_dim).permute(2, 0, 3, 1, 4)\n        Q, K, V = qkv[0], qkv[1], qkv[2]\n        \n        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)\n        attn = torch.softmax(scores, dim=-1)\n        out = torch.matmul(attn, V).permute(0, 2, 1, 3).reshape(B, N, D)\n        return self.fc_out(out)\n\nprint('Self-Attention Layer initialized successfully!')",
        "terminalOutput": "[PYTORCH CUDA RUNTIME]\n>>> Input Tensor Shape: torch.Size([2, 512, 768])\n>>> Attention Map Computed: [2, 12, 512, 512]\n>>> Transformer Forward Pass Complete | Latency: 4.12ms",
        "dialogue": [
          { "speaker": "professor", "text": "Welcome scholars! Today we dive into the core engine of modern LLMs: Self-Attention." },
          { "speaker": "priya", "text": "Professor, why do we scale the dot product by the square root of d_k inside the softmax?" },
          { "speaker": "professor", "text": "Excellent question, Priya! For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by sqrt(d_k) maintains unit variance!" }
        ],
        "quizzes": [
          {
            "question": "What is the purpose of dividing QK^T by sqrt(d_k) in Scaled Dot-Product Attention?",
            "options": [
              "To prevent the dot products from growing too large and causing vanishing gradients in softmax",
              "To reduce VRAM memory by half",
              "To convert floating point numbers to integers",
              "To make self-attention non-differentiable"
            ],
            "correct": 0,
            "explanation": "Scaling by sqrt(d_k) normalizes the variance of the dot products to 1, preventing softmax saturation and vanishing gradients during backward propagation."
          }
        ]
      }
    ]
  }
];


export default function BoloClassPortal({ setActiveTab }) {
  const { addToast } = useToast?.() || {};
  const { user, userProgress, addXP, addPoints } = useGamification?.() || {};

  const scholarDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Scholar';

  const awardXP = async (uId, action, amount) => {
    try {
      if (addXP) addXP(amount);
      if (addPoints) addPoints(amount);
    } catch (e) {
      console.warn("XP reward error:", e);
    }
  };

  const [lessons, setLessons] = useState(BOLOCLASS_DEFAULT_LESSONS);
  const [activeLesson, setActiveLesson] = useState(BOLOCLASS_DEFAULT_LESSONS[0]);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState(0);
  const [lectureStepIdx, setLectureStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [allBrowserVoices, setAllBrowserVoices] = useState([]);
  const [selectedFemaleVoiceURI, setSelectedFemaleVoiceURI] = useState('');
  const [selectedMaleVoiceURI, setSelectedMaleVoiceURI] = useState('');
  const [malePitch, setMalePitch] = useState(0.95);
  const [femalePitch, setFemalePitch] = useState(1.22);
  
  const [activeViewMode, setActiveViewMode] = useState('slides');
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [generationProgressText, setGenerationProgressText] = useState('');
  const [isGeneratingNextSlide, setIsGeneratingNextSlide] = useState(false);
  const [customTerminalLogs, setCustomTerminalLogs] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [classroomNotes, setClassroomNotes] = useState('');
  const [isAutoSummarizing, setIsAutoSummarizing] = useState(false);
  const [studentQuestion, setStudentQuestion] = useState('');
  const [electionTimeout, setElectionTimeout] = useState(null);
  const [raisedHand, setRaisedHand] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'professor', text: 'Welcome scholars! Feel free to ask questions or discuss concepts in real-time.' }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Quiz state dictionaries
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittedQuizzes, setSubmittedQuizzes] = useState({});

  const speechSynthRef = useRef(null);
  const terminalBottomRef = useRef(null);
  const whiteboardRef = useRef(null);
  const chatScrollRef = useRef(null);
  const chatBottomRef = useRef(null);

  const currentUtteranceRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  // Load available browser voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAllBrowserVoices(voices);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Clean Markdown/Code formatting for natural TTS
  const cleanSpeechText = (rawText) => {
    if (!rawText) return '';
    return rawText
      .replace(/```[\s\S]*?```/g, ' Code model on slide. ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Voice Finder Helper
  const findVoicesForLanguage = (lang, voices) => {
    const list = voices && voices.length > 0 ? voices : allBrowserVoices;
    const langCode = lang === 'te' ? 'te' : lang === 'hi' ? 'hi' : 'en';
    const langVoices = list.filter(v => (v.lang || '').toLowerCase().startsWith(langCode));
    
    let femaleVoice = langVoices.find(v => /female|zira|swara|shruti|sita|priya|geeta|heera|ananya/i.test(v.name));
    let maleVoice = langVoices.find(v => /male|david|mark|ravi|madhav|hemant|neerja|george/i.test(v.name));

    if (!femaleVoice && langVoices.length > 0) femaleVoice = langVoices[0];
    if (!maleVoice && langVoices.length > 1) maleVoice = langVoices[1];
    else if (!maleVoice && langVoices.length > 0) maleVoice = langVoices[0];

    return { femaleVoice, maleVoice };
  };

  // Voice testing & Single utterance speaker
  const handleTestVoice = (voiceTarget, testText) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const text = testText || 'Welcome to BoloClass AI Classroom interactive presentation.';
    const utt = new SpeechSynthesisUtterance(cleanSpeechText(text));

    const { femaleVoice, maleVoice } = findVoicesForLanguage(selectedLanguage, allBrowserVoices);

    let chosenVoice = null;
    let chosenPitch = 1.0;

    if (voiceTarget === 'male' || voiceTarget === 'professor') {
      chosenVoice = (selectedMaleVoiceURI ? allBrowserVoices.find(v => v.voiceURI === selectedMaleVoiceURI || v.name === selectedMaleVoiceURI) : null) || maleVoice;
      chosenPitch = malePitch;
    } else if (voiceTarget === 'female' || voiceTarget === 'scholar') {
      chosenVoice = (selectedFemaleVoiceURI ? allBrowserVoices.find(v => v.voiceURI === selectedFemaleVoiceURI || v.name === selectedFemaleVoiceURI) : null) || femaleVoice;
      chosenPitch = femalePitch;
    } else if (voiceTarget) {
      chosenVoice = allBrowserVoices.find(v => v.voiceURI === voiceTarget || v.name === voiceTarget);
    }

    if (chosenVoice) utt.voice = chosenVoice;
    utt.rate = speechRate;
    utt.pitch = chosenPitch;

    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utt);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  };

  const handleTestFullDuet = (lang) => {
    const { femaleVoice, maleVoice } = findVoicesForLanguage(lang, allBrowserVoices);
    handleTestVoice(femaleVoice?.voiceURI, 'Hello scholar! I am your AI learning assistant.');
    setTimeout(() => {
      handleTestVoice(maleVoice?.voiceURI, 'And I am your AI Professor. Let us master this topic together.');
    }, 2800);
  };

  // Active scene & Lecture Steps resolution
  const activeScene = activeLesson?.scenes?.[currentSceneIdx] || activeLesson?.scenes?.[0] || {};
  const currentDialogue = activeScene?.dialogue?.[currentDialogueIdx] || activeScene?.dialogue?.[0] || null;

  // Build lecture steps from slide content
  const currentLectureSteps = [
    { target: 'header', label: 'Overview', title: 'Slide Overview', speaker: 'professor', text: `Today we are diving into: ${activeScene.title}. ${activeScene.slideSubtitle || ''}` },
    ...(activeScene.takeaways || []).map((t, idx) => ({
      target: `takeaway-${idx}`,
      label: `Point ${idx + 1}`,
      title: `Key Point ${idx + 1}`,
      speaker: idx % 2 === 0 ? 'professor' : (activeLesson.classmates?.[0]?.id || 'alex'),
      text: t
    })),
    ...(activeScene.diagram || activeScene.codeSnippet ? [{
      target: 'visual',
      label: 'Visual Model',
      title: 'Visual Representation & Implementation',
      speaker: activeLesson.classmates?.[1]?.id || 'maya',
      text: `Observe this concrete structural model for ${activeScene.title}. Note the deterministic invariants and memory bounds.`
    }] : []),
    ...(activeScene.dialogue || []).map((d, dIdx) => ({
      target: `dialogue-${dIdx}`,
      label: `Peer ${dIdx + 1}`,
      title: `Discussion Point ${dIdx + 1}`,
      speaker: d.speaker || 'professor',
      text: d.text
    }))
  ];

  const currentLectureStep = currentLectureSteps[lectureStepIdx] || currentLectureSteps[0];
  const activeSpeaker = currentLectureStep?.speaker || currentDialogue?.speaker || 'professor';

  const getSpeakerInfo = (speakerId, lesson) => {
    const active = lesson || activeLesson;
    if (speakerId === 'professor') {
      return active?.professor || { name: 'Prof. Vyomra', title: 'Prof. Vyomra', role: 'Lead AI Professor', avatar: '👨‍🏫' };
    }
    const cm = active?.classmates?.find(c => c.id === speakerId);
    return cm || { name: speakerId || 'Scholar', title: speakerId || 'Scholar', role: 'Discussion Peer', avatar: '🧑‍💻' };
  };

  // Core Speech Synthesis Function for Lecture Points
  const speakCurrentStep = (step, onFinish) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onFinish?.();
      return;
    }

    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    window.speechSynthesis.cancel();

    if (!isAudioEnabled || !step || !step.text) {
      if (isPlayingRef.current && onFinish) {
        autoPlayTimerRef.current = setTimeout(onFinish, 3000);
      }
      return;
    }

    const cleanedText = cleanSpeechText(step.text);
    if (!cleanedText) {
      onFinish?.();
      return;
    }

    const utt = new SpeechSynthesisUtterance(cleanedText);
    currentUtteranceRef.current = utt;

    const speakerInfo = getSpeakerInfo(step.speaker, activeLesson);
    const isFemale = /maya|ananya|priya|female|swara|shruti/i.test(speakerInfo.name || '');
    const { femaleVoice, maleVoice } = findVoicesForLanguage(selectedLanguage, allBrowserVoices);
    const voiceURI = isFemale ? (selectedFemaleVoiceURI || femaleVoice?.voiceURI) : (selectedMaleVoiceURI || maleVoice?.voiceURI);

    let assignedVoice = null;
    if (voiceURI) {
      assignedVoice = allBrowserVoices.find(v => v.voiceURI === voiceURI || v.name === voiceURI);
    }
    if (!assignedVoice) {
      assignedVoice = isFemale ? (femaleVoice || allBrowserVoices[0]) : (maleVoice || allBrowserVoices[0]);
    }
    if (assignedVoice) utt.voice = assignedVoice;

    utt.rate = speechRate || 1.0;
    utt.pitch = isFemale ? femalePitch : malePitch;

    let hasEnded = false;
    const handleEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      currentUtteranceRef.current = null;
      if (onFinish) onFinish();
    };

    utt.onend = handleEnd;
    utt.onerror = (e) => {
      console.warn("Speech playback notice:", e);
      handleEnd();
    };

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utt);
    } catch (err) {
      console.warn("Speech speak error:", err);
      handleEnd();
    }
  };

  // ─── AUTO LECTURE PROGRESSION ENGINE ───────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    const currentStep = currentLectureSteps[lectureStepIdx];
    if (!currentStep) return;

    speakCurrentStep(currentStep, () => {
      if (!isPlayingRef.current) return;

      autoPlayTimerRef.current = setTimeout(() => {
        if (!isPlayingRef.current) return;

        // Check if there are more points in the current slide
        if (lectureStepIdx < currentLectureSteps.length - 1) {
          setLectureStepIdx(prev => prev + 1);
        } else {
          // Slide finished, check if there are more slides in masterclass
          if (currentSceneIdx < (activeLesson.scenes?.length || 1) - 1) {
            setCurrentSceneIdx(prev => prev + 1);
            setLectureStepIdx(0);
            setCurrentDialogueIdx(0);
          } else {
            // Reached end of entire lesson!
            setIsPlaying(false);
            addToast?.({
              type: 'success',
              message: `🎉 Masterclass "${activeLesson.title}" Completed! +50 XP Awarded!`
            });
            if (user?.id) awardXP(user.id, 'COMPLETED_MASTERCLASS', 50);
          }
        }
      }, 750);
    });

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, lectureStepIdx, currentSceneIdx, activeLesson, selectedLanguage, speechRate, isAudioEnabled]);

  // Navigation handlers
  const handleSelectSlide = (sIdx) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentSceneIdx(sIdx);
    setCurrentDialogueIdx(0);
    setLectureStepIdx(0);
    setCurrentQuizIdx(0);
    setCustomTerminalLogs([]);
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) handleSelectSlide(currentSceneIdx - 1);
  };

  const handleNextScene = () => {
    if (currentSceneIdx < (activeLesson?.scenes?.length || 1) - 1) {
      handleSelectSlide(currentSceneIdx + 1);
    }
  };

  const handleJumpToStep = (targetIdx) => {
    setLectureStepIdx(targetIdx);
    if (isAudioEnabled && currentLectureSteps[targetIdx]) {
      speakCurrentStep(currentLectureSteps[targetIdx], null);
    }
  };

  const handlePrevDialogue = () => {
    if (lectureStepIdx > 0) {
      handleJumpToStep(lectureStepIdx - 1);
    } else if (currentSceneIdx > 0) {
      handleSelectSlide(currentSceneIdx - 1);
    }
  };

  const handleNextDialogue = () => {
    if (lectureStepIdx < currentLectureSteps.length - 1) {
      handleJumpToStep(lectureStepIdx + 1);
    } else if (currentSceneIdx < (activeLesson?.scenes?.length || 1) - 1) {
      handleSelectSlide(currentSceneIdx + 1);
    }
  };

  const handlePlayPause = () => {
    if (!isAudioEnabled) {
      setIsAudioEnabled(true);
      addToast?.({ type: 'info', message: '🔊 Voice Audio Enabled for Auto Lecture' });
    }
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        addToast?.({
          type: 'success',
          message: `▶️ Auto Lecture Started: Slide ${currentSceneIdx + 1}, Point ${lectureStepIdx + 1}`
        });
      } else {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        addToast?.({ type: 'info', message: '⏸️ Auto Lecture Paused' });
      }
      return next;
    });
  };

  const handleRaiseHand = () => {
    const nextState = !raisedHand;
    setRaisedHand(nextState);
    if (nextState) {
      addToast?.({
        type: 'info',
        message: '🙋 Hand raised! Prof. Vyomra and classmates are ready for your question.'
      });
    }
  };

  const handleAskQuestion = async (customPrompt) => {
    const qText = customPrompt || studentQuestion;
    if (!qText.trim()) return;
    setStudentQuestion('');
    setRaisedHand(false);

    const userMsg = { id: Date.now(), sender: 'user', text: qText, name: scholarDisplayName };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const aiPrompt = `You are Prof. Vyomra, an elite Computer Science Professor in BoloClass AI Classroom.
Current Masterclass: "${activeLesson.title}"
Current Slide: "${activeScene.title}"
Student Question: "${qText}"

Provide an extraordinarily clear, technically rigorous, and encouraging response in 2-4 sentences explaining the underlying principles:`;

      const aiResponse = await callAICompletion({
        prompt: aiPrompt,
        temperature: 0.4,
        maxTokens: 300
      });

      const profMsg = {
        id: Date.now() + 1,
        sender: 'professor',
        text: aiResponse || 'That is an insightful question. Let us break down the algorithmic and memory trade-offs involved.',
        name: activeLesson.professor.name
      };
      setChatMessages(prev => [...prev, profMsg]);

      if (isAudioEnabled) {
        const { maleVoice } = findVoicesForLanguage(selectedLanguage, allBrowserVoices);
        handleTestVoice(selectedMaleVoiceURI || maleVoice?.voiceURI, profMsg.text);
      }
      if (user?.id) awardXP(user.id, 'ASKED_QUESTION', 20);
    } catch (e) {
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'professor',
        text: 'Excellent question! In distributed and low-level architectures, maintaining strict bounds and avoiding unbounded memory growth is paramount to preventing latency spikes and ensuring resilience.',
        name: activeLesson.professor.name
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Quiz helper functions
  const getQuestionKey = (sceneIdx, qIdx) => `${activeLesson.id}-s${sceneIdx}-q${qIdx}`;
  const getSceneQuizzes = (scene) => scene?.quizzes || [];

  const handleSelectQuizOption = (qIdx, optIdx) => {
    const k = getQuestionKey(currentSceneIdx, qIdx);
    if (submittedQuizzes[k]) return;
    setQuizAnswers(prev => ({ ...prev, [k]: optIdx }));
  };

  const handleQuizSubmit = async (qIdx) => {
    const k = getQuestionKey(currentSceneIdx, qIdx);
    const quizzes = getSceneQuizzes(activeScene);
    const quiz = quizzes[qIdx];
    if (!quiz || quizAnswers[k] === undefined) {
      addToast?.({ type: 'warning', message: 'Please select an option before submitting!' });
      return;
    }

    setSubmittedQuizzes(prev => ({ ...prev, [k]: true }));
    const isCorrect = quizAnswers[k] === quiz.correct;

    if (isCorrect) {
      addToast?.({
        type: 'success',
        message: '🎉 Correct! +15 XP earned for mastering this concept.'
      });
      if (user?.id) {
        awardXP(user.id, 'QUIZ_CORRECT', 15);
        saveQuizScoreToSupabase?.({
          userId: user.id,
          lessonId: activeLesson.id,
          sceneId: activeScene.id,
          questionIdx: qIdx,
          score: 15
        }).catch(() => {});
      }
    } else {
      addToast?.({
        type: 'error',
        message: '❌ Not quite right. Review the architectural explanation below!'
      });
    }
  };

  const handleRetakeQuiz = (qIdx) => {
    const k = getQuestionKey(currentSceneIdx, qIdx);
    setSubmittedQuizzes(prev => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
    setQuizAnswers(prev => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const handlePrevQuizQuestion = () => {
    setCurrentQuizIdx(prev => Math.max(0, prev - 1));
  };

  const handleNextQuizQuestion = (totalCount) => {
    setCurrentQuizIdx(prev => Math.min(totalCount - 1, prev + 1));
  };


// ─── DOMAIN-AWARE TOPIC CURRICULUM FALLBACK GENERATOR (4 SLIDES, 10 QUIZZES EACH) ───
  const generateTopicSpecificCurriculum = (topic) => {
    const cleanTopic = topic.trim() || 'Computer Science Architecture';
    const tag = cleanTopic.split(' ')[0] || 'Systems';

    const buildQuizList = (slideTitle) => [
      {
        question: `What is the primary architectural principle demonstrated in ${slideTitle}?`,
        options: [
          "Maintaining strict resource limits, deterministic invariants, and high cache locality",
          "Disabling all validation to maximize throughput",
          "Relying entirely on manual human intervention",
          "Multiplying memory allocations indiscriminately"
        ],
        correct: 0,
        explanation: "Production-grade system architectures prioritize deterministic resource management, memory bounds, and low-latency cache locality."
      },
      {
        question: "How does this implementation optimize memory access and CPU instruction throughput?",
        options: [
          "By aligning memory structures to CPU cache lines and minimizing thread contention",
          "By allocating objects in random memory addresses",
          "By running single-threaded with unbuffered I/O",
          "By compressing CPU registers"
        ],
        correct: 0,
        explanation: "Cache-line alignment and lock-free execution prevent CPU bus contention and false sharing across multi-core processors."
      },
      {
        question: "What is the consequence of failing to enforce bounded queues or memory limits in this architecture?",
        options: [
          "Unbounded memory growth leading to out-of-memory crashes or catastrophic latency spikes",
          "Zero impact on system health",
          "Automatic hardware upgrades",
          "Faster execution speed"
        ],
        correct: 0,
        explanation: "Without backpressure and bounded allocations, sudden traffic surges cause memory exhaustion and cascading systemic failure."
      },
      {
        question: "Why are defensive boundary checks and error handling essential in distributed or concurrent modules?",
        options: [
          "To prevent partial failures from corrupting state or causing deadlock across connected components",
          "To satisfy compiler aesthetic guidelines only",
          "Because exceptions speed up execution",
          "To disable telemetry logging"
        ],
        correct: 0,
        explanation: "Defensive isolation ensures faults are localized, gracefully degraded, and reported via telemetry without crashing the entire system."
      },
      {
        question: "What is the optimal strategy for handling blocking operations in high-throughput services?",
        options: [
          "Offloading blocking calls to asynchronous thread pools or lightweight virtual fibers to preserve event loops",
          "Executing blocking I/O on the main rendering thread",
          "Infinite retry loops without backoff",
          "Ignoring response timeouts"
        ],
        correct: 0,
        explanation: "Asynchronous task delegation and non-blocking I/O prevent thread starvation, keeping worker pipelines responsive."
      },
      {
        question: "How should state transitions be validated under concurrent multi-user execution?",
        options: [
          "Using atomic primitives, optimistic locking with versioning, or strict transactional barriers",
          "Assuming concurrent writes will never overlap",
          "By disabling database transactions",
          "By overwriting timestamps arbitrarily"
        ],
        correct: 0,
        explanation: "Atomic instructions and optimistic concurrency control ensure consistency without heavy distributed locks."
      },
      {
        question: "What metric is most indicative of tail latency issues in production benchmarking?",
        options: [
          "P99 and P99.9 latency distributions under sustained peak load",
          "Arithmetic average (mean) latency alone",
          "File size of the compiled binary",
          "Number of comments in the code"
        ],
        correct: 0,
        explanation: "Mean latency masks outlier spikes. P99/P99.9 percentiles expose GC pauses, queue buildup, and lock contention affecting real users."
      },
      {
        question: "Why is telemetry instrumentation (metrics, traces, structured logs) critical for this component?",
        options: [
          "To enable rapid root-cause diagnosis and automated health alerting during production anomalies",
          "To fill up disk storage",
          "To slow down the application intentionally",
          "Because cloud providers mandate it"
        ],
        correct: 0,
        explanation: "Observability provides real-time visibility into execution health, saturation, and latency bottlenecks."
      },
      {
        question: "What is the recommended approach for scaling read-heavy workloads against this system?",
        options: [
          "Layered multi-level caching with TTL invalidation and read replicas",
          "Directly querying the primary database for every single read request",
          "Restarting the database server every hour",
          "Disabling read query filters"
        ],
        correct: 0,
        explanation: "Read replicas and distributed in-memory caches absorb high query volumes and protect core transactional storage."
      },
      {
        question: "What lifecycle safeguard prevents resource leaks when managing native memory, file descriptors, or sockets?",
        options: [
          "Deterministic try-with-resources or RAII destructors guaranteeing cleanup even upon unexpected errors",
          "Manual cleanup only at system reboot",
          "Relying on optimistic hope",
          "Suppressing all error handling"
        ],
        correct: 0,
        explanation: "Deterministic resource management (like Java try-with-resources or C++ RAII) ensures sockets and handles are closed immediately."
      }
    ];

    return {
      id: `custom-${cleanTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      title: `Masterclass: ${cleanTopic}`,
      subject: `Computer Science & ${cleanTopic}`,
      difficulty: "Intermediate to Advanced",
      duration: "20 mins",
      tags: [tag, "Architecture", "Engineering", "Algorithms"],
      professor: {
        name: "Prof. Vyomra",
        role: "Lead AI Professor of Systems & Software Architecture",
        avatar: "👨‍🏫",
        voicePitch: 0.95,
        voiceRate: 0.98
      },
      classmates: [
        { id: "alex", name: "Alex", title: "Alex (Curious Skeptic)", avatar: "🧑‍💻", color: "text-amber-400", role: "Edge-Case Specialist", pitch: 1.2 },
        { id: "maya", name: "Maya", title: "Maya (Performance Hacker)", avatar: "👩‍💻", color: "text-cyan-400", role: "Memory & Low-Level", pitch: 1.3 }
      ],
      scenes: [
        {
          id: 'slide-1',
          slideNumber: 1,
          title: `Slide 1: Core Foundations & Architectural Invariants of ${cleanTopic}`,
          slideSubtitle: `Fundamental mental models, core invariants, and computational motivation.`,
          takeaways: [
            `Core Mental Model: ${cleanTopic} resolves fundamental trade-offs in modern computing through deterministic state structures.`,
            `Memory & Allocation Footprint: Designing representations to minimize fragmentation and maximize L1/L2 cache locality.`,
            `Execution Flow: Step-by-step lifecycle from initialization through core operation processing.`,
            `Asymptotic Boundaries: Time and auxiliary space complexity guarantees under adversarial workloads.`,
            `Architectural Invariant: Strict enforcement of consistency, durability, and type correctness.`
          ],
          whiteboardContent: `# ${cleanTopic}: Core Foundations & Mathematical Formulation\n\n### Key Invariants:\n* **Core Principle:** Deterministic state guarantees with minimal runtime overhead.\n* **Complexity Bounds:** $\\mathcal{O}(1)$ or $\\mathcal{O}(\\log N)$ execution pathways.\n* **Memory Invariant:** Zero heap leaks with strict lifetime bounding.`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│           ${cleanTopic.toUpperCase().slice(0, 40).padEnd(40)}│\n├───────────────────────────────────────────────────────────────┤\n│ [ Ingest / Client Request ] ──> [ ${tag} Engine ] ──> [ State ]│\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Architectural foundation for ${cleanTopic}\npublic class ${tag}FoundationDemo {\n    public static void main(String[] args) {\n        System.out.println("Executing optimized module for ${cleanTopic}");\n    }\n}`,
          terminalOutput: `[INIT ENGINE] ${cleanTopic} initialized.\n>>> Status: HEALTHY | Allocations: 0 Leaks | Latency: 0.12ms`,
          dialogue: [
            { speaker: 'professor', text: `Welcome scholars! Today we begin our in-depth study of ${cleanTopic}.` },
            { speaker: 'alex', text: `Professor, what makes ${cleanTopic} so vital in modern large-scale software systems?` },
            { speaker: 'professor', text: `Because it establishes fundamental guarantees around performance, memory layout, and deterministic execution.` }
          ],
          quizzes: buildQuizList(`Slide 1: Foundations of ${cleanTopic}`)
        },
        {
          id: 'slide-2',
          slideNumber: 2,
          title: `Slide 2: Deep Implementation, Data Structures & Internals`,
          slideSubtitle: `Under-the-hood algorithms, memory representations, and execution flow.`,
          takeaways: [
            `Low-Level Memory Representation: Pointer layouts, alignment, and compact object headers.`,
            `Algorithmic Complexity: Asymptotic time complexity O(N), O(log N), and auxiliary space bounds.`,
            `Cache Locality & Throughput: Maximizing L1/L2 data cache hits and eliminating CPU pipeline stalls.`,
            `Step-by-Step Lifecycle: Tracing execution from initialization through data manipulation and final cleanup.`,
            `Concurrency & Thread Safety: Memory barriers, atomic operations, and synchronization guarantees.`
          ],
          whiteboardContent: `# ${cleanTopic}: Implementation & Complexity Analysis\n\n### Asymptotic Complexity:\n* **Time Complexity:** $\\mathcal{O}(\\log N)$ or $\\mathcal{O}(N)$ depending on access patterns.\n* **Space Complexity:** $\\mathcal{O}(1)$ auxiliary space optimization.\n* **Invariant:** Preserves data consistency across all operations.`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│                 INTERNAL EXECUTION PIPELINE                   │\n├───────────────────────────────────────────────────────────────┤\n│ [ Component A ] <───> [ ${tag} Engine ] <───> [ Storage/State ]│\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Implementation details for ${cleanTopic}\npublic void process${tag}Task() {\n    long startTime = System.nanoTime();\n    // Optimized pipeline execution\n    long elapsed = System.nanoTime() - startTime;\n}`,
          terminalOutput: `[BENCHMARK] Executed 10,000 operations for ${cleanTopic} in 1.4ms.\n>>> Zero memory leaks detected.`,
          dialogue: [
            { speaker: 'maya', text: `How do we ensure optimal runtime performance when implementing ${cleanTopic}?` },
            { speaker: 'professor', text: `By choosing the right underlying data structures and minimizing unnecessary memory allocations.` }
          ],
          quizzes: buildQuizList(`Slide 2: Internals of ${cleanTopic}`)
        },
        {
          id: 'slide-3',
          slideNumber: 3,
          title: `Slide 3: Edge Cases, Error Handling & Failure Modes`,
          slideSubtitle: `Handling boundary conditions, null/overflow traps, and concurrency races.`,
          takeaways: [
            `Boundary Value Traps: Handling null references, zero-length inputs, integer overflow, and off-by-one errors.`,
            `Defensive Programming Patterns: Validating preconditions, invariants, and postconditions rigorously.`,
            `Exception Resilience: Graceful degradation, transaction rollbacks, and deterministic resource release.`,
            `Race Conditions & Deadlocks: Preventing data races in concurrent multi-threaded execution environments.`,
            `Stress Testing & Fuzzing: Verifying resilience under high load, unexpected inputs, and network partition faults.`
          ],
          whiteboardContent: `# Edge Cases & Guard Conditions in ${cleanTopic}\n\n### Key Invariants to Verify:\n1. **Boundary Limits:** Check null, 0-length, min/max values.\n2. **Type Safety:** Ensure explicit cast safety and range bounds.\n3. **Exception Safety:** Implement robust try-catch and cleanup logic.`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│                     ERROR & RESILIENCE MATRIX                 │\n├───────────────────────────────────────────────────────────────┤\n│ [ Input Validation ] ──> [ Safe Execution ] ──> [ Result ]   │\n│         │                                                     │\n│         └──[ Invalid Bounds ] ──> [ Guard / Fallback ]        │\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Robust error handling for ${cleanTopic}\ntry {\n    validateInputs();\n    executeCoreLogic();\n} catch (IllegalArgumentException ex) {\n    System.err.println("Handled edge case gracefully: " + ex.getMessage());\n}`,
          terminalOutput: `[TEST SUITE] Running edge-case suite for ${cleanTopic}...\n>>> Passed 48/48 unit tests including boundary conditions.`,
          dialogue: [
            { speaker: 'alex', text: `What is the most common bug that occurs with ${cleanTopic} in production?` },
            { speaker: 'professor', text: `Unchecked boundary conditions and failing to handle null or empty states are the most frequent culprits.` }
          ],
          quizzes: buildQuizList(`Slide 3: Edge Cases in ${cleanTopic}`)
        },
        {
          id: 'slide-4',
          slideNumber: 4,
          title: `Slide 4: Industry Best Practices & Production Scale`,
          slideSubtitle: `Real-world patterns, benchmarking, profiling, and architectural mastery.`,
          takeaways: [
            `Hyperscale Architecture: How top tech companies design, deploy, and scale ${cleanTopic} for millions of concurrent users.`,
            `Telemetry & Observability: Key health metrics, P99 latency percentiles, and telemetry alerts to monitor.`,
            `Zero-Copy & Memory Pool Optimization: Techniques for reducing Garbage Collection pauses and memory bandwidth pressure.`,
            `Continuous Profiling & Benchmarking: Identifying hot spots using flame graphs and CPU execution profilers.`,
            `Mastery Roadmap: Transitioning from foundational syntax to principal systems engineering.`
          ],
          whiteboardContent: `# Production Architecture & Best Practices\n\n### Core Tenets for ${cleanTopic}:\n* **Clean Code:** Adhere to SOLID and idiomatic patterns.\n* **Observability:** Track latency, throughput, and error rates.\n* **Continuous Profiling:** Eliminate CPU and memory bottlenecks early.`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│                 PRODUCTION ARCHITECTURE DECK                  │\n├───────────────────────────────────────────────────────────────┤\n│ [ Client Requests ] ──> [ ${tag} Module ] ──> [ Metrics & Telemetry ]│\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Production-grade pattern for ${cleanTopic}\npublic class Production${tag}Service {\n    public static void run() {\n        System.out.println("Production module for ${cleanTopic} operating at peak efficiency.");\n    }\n}`,
          terminalOutput: `[PRODUCTION DEPLOY] ${cleanTopic} active.\n>>> Latency: 0.28ms | Health: 100% | Zero defects.`,
          dialogue: [
            { speaker: 'maya', text: `Now we have a complete 360-degree mental model of ${cleanTopic} across all 4 slides!` },
            { speaker: 'professor', text: `Precisely! You are now equipped to apply ${cleanTopic} with mastery in real-world software engineering.` }
          ],
          quizzes: buildQuizList(`Slide 4: Production Scale for ${cleanTopic}`)
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
      const prompt = `You are BoloClass (Multi-Agent Interactive AI Classroom Slide Deck Generator).
Your task is to generate a comprehensive, highly accurate, and rigorous 4-SLIDE presentation curriculum on the computer science topic: "${topic}".

CRITICAL REQUIREMENTS:
1. Every slide's title, subtitle, takeaways (EXACTLY 5 DETAILED POINTS PER SLIDE), whiteboard markdown, ASCII diagram, code snippet, dialogue between professor and classmates, and quiz question MUST BE 100% SPECIFIC TO "${topic}".
2. If "${topic}" is a programming topic (e.g. "DATA TYPES IN JAVA", "POINTERS IN C++", "REACT HOOKS"), write actual valid code snippets in that programming language, diagram actual memory/data structures (e.g. Stack vs Heap, Primitives vs Objects), whiteboard formulas/tables of types and ranges, and have dialogue discussing that specific language's mechanics.
3. If "${topic}" is an algorithm or data structure (e.g. "BINARY SEARCH", "DIJKSTRA", "AVL TREE"), explain the algorithm invariants, Big-O complexities (O(N), O(log N)), real code, and step-by-step logic.
4. If "${topic}" is a database, web, AI, or systems topic, provide accurate domain-specific architecture, queries, math formulas, or models.
5. Provide 5 detailed, highly insightful technical takeaways per slide (each 1-2 complete sentences explaining memory models, runtime trade-offs, and invariants).
6. DO NOT output generic distributed systems or lock-free queue text UNLESS the topic is specifically about distributed systems or concurrency!

Generate a JSON object with this exact structure:
{
  "title": "Masterclass: ${topic}",
  "subject": "<Precise Academic Subject of ${topic}>",
  "difficulty": "Intermediate to Advanced",
  "duration": "20 mins",
  "tags": ["${topic}", "Engineering", "Architecture"],
  "professor": {
    "name": "Prof. Vyomra",
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
        "<Detailed takeaway 1 specifically about foundations of ${topic}>",
        "<Detailed takeaway 2 specifically about invariants of ${topic}>",
        "<Detailed takeaway 3 specifically about runtime execution of ${topic}>",
        "<Detailed takeaway 4 specifically about performance trade-offs of ${topic}>",
        "<Detailed takeaway 5 specifically about foundational best practices of ${topic}>"
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
      "quizzes": [
    {
      "question": "<High-level conceptual multiple-choice question testing core foundations>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<In-depth technical explanation & architectural rationale>."
    },
    {
      "question": "<Internal mechanics / memory / runtime multiple-choice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of internal mechanics>."
    },
    {
      "question": "<Edge case, boundary condition, or best practice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of edge case/best practice>."
    }
  ]
    },
    {
      "id": "slide-2",
      "slideNumber": 2,
      "title": "Slide 2: <Deep Implementation, Memory & Mechanics of ${topic}>",
      "slideSubtitle": "<Internal data representation and step-by-step logic>",
      "takeaways": [
        "<Internal mechanic 1>",
        "<Internal mechanic 2>",
        "<Internal mechanic 3>",
        "<Internal mechanic 4>",
        "<Internal mechanic 5>"
      ],
      "whiteboardContent": "# ${topic}: Internals & Memory\\n\\n### Mechanics:\\n* <Low-level details and Big-O / memory formula>",
      "diagram": "┌───────────────────────────────────────────┐\\n│       ${topic.toUpperCase()} INTERNALS          │\\n└───────────────────────────────────────────┘",
      "codeSnippet": "// In-depth code snippet for ${topic}",
      "terminalOutput": "[BENCHMARK] Executed operation for ${topic}... OK",
      "dialogue": [
        { "speaker": "maya", "text": "<Maya asks about performance or edge cases in ${topic}>" },
        { "speaker": "professor", "text": "<Professor explains memory layout and performance for ${topic}>" }
      ],
      "quizzes": [
    {
      "question": "<High-level conceptual multiple-choice question testing core foundations>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<In-depth technical explanation & architectural rationale>."
    },
    {
      "question": "<Internal mechanics / memory / runtime multiple-choice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of internal mechanics>."
    },
    {
      "question": "<Edge case, boundary condition, or best practice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of edge case/best practice>."
    }
  ]
    },
    {
      "id": "slide-3",
      "slideNumber": 3,
      "title": "Slide 3: <Edge Cases, Failure Modes & Common Pitfalls in ${topic}>",
      "slideSubtitle": "<Boundary limits, type safety, exceptions, and defensive coding>",
      "takeaways": [
        "<Edge case 1>",
        "<Common pitfall 2>",
        "<Boundary limit 3>",
        "<Mitigation strategy 4>",
        "<Defensive coding rule 5>"
      ],
      "whiteboardContent": "# ${topic}: Edge Cases & Guard Conditions\\n\\n### Pitfalls:\\n1. <Specific pitfall with ${topic}>",
      "diagram": "┌───────────────────────────────────────────┐\\n│       ${topic.toUpperCase()} ERROR MATRIX        │\\n└───────────────────────────────────────────┘",
      "codeSnippet": "// Edge-case handling code for ${topic}",
      "terminalOutput": "[TEST] Edge-case verification for ${topic}... Passed",
      "dialogue": [
        { "speaker": "alex", "text": "<Alex asks about common bugs with ${topic}>" },
        { "speaker": "professor", "text": "<Professor explains how to guard against pitfalls in ${topic}>" }
      ],
      "quizzes": [
    {
      "question": "<High-level conceptual multiple-choice question testing core foundations>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<In-depth technical explanation & architectural rationale>."
    },
    {
      "question": "<Internal mechanics / memory / runtime multiple-choice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of internal mechanics>."
    },
    {
      "question": "<Edge case, boundary condition, or best practice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of edge case/best practice>."
    }
  ]
    },
    {
      "id": "slide-4",
      "slideNumber": 4,
      "title": "Slide 4: <Industry Best Practices & Production Scale for ${topic}>",
      "slideSubtitle": "<Real-world architectures, profiling, and best practices>",
      "takeaways": [
        "<Best practice 1>",
        "<Scalability guideline 2>",
        "<Production optimization 3>",
        "<Telemetry and observability 4>",
        "<Architectural mastery tip 5>"
      ],
      "whiteboardContent": "# ${topic}: Production Best Practices\\n\\n### Architectural Guidelines:\\n* <Best practice summary>",
      "diagram": "┌───────────────────────────────────────────┐\\n│       ${topic.toUpperCase()} PRODUCTION ARCH     │\\n└───────────────────────────────────────────┘",
      "codeSnippet": "// Production-grade code snippet for ${topic}",
      "terminalOutput": "[PRODUCTION] Deployed ${topic} successfully.",
      "dialogue": [
        { "speaker": "maya", "text": "<Maya summarizes key architectural takeaways for ${topic}>" },
        { "speaker": "professor", "text": "<Professor provides concluding mastery advice for ${topic}>" }
      ],
      "quizzes": [
    {
      "question": "<High-level conceptual multiple-choice question testing core foundations>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<In-depth technical explanation & architectural rationale>."
    },
    {
      "question": "<Internal mechanics / memory / runtime multiple-choice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of internal mechanics>."
    },
    {
      "question": "<Edge case, boundary condition, or best practice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of edge case/best practice>."
    }
  ]
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

  // ─── DOMAIN-AWARE NEXT SLIDE SYNTHESIZER (UNIQUE PER SLIDE NUMBER) ──────────
  const generateNextSlideFallback = (lesson, slideNum) => {
    const title = lesson?.title || 'Computer Science Masterclass';
    const isJava = lesson?.id?.includes('java') || title.toLowerCase().includes('java');

    if (isJava) {
      if (slideNum === 5) {
        return {
          id: `slide-5-${Date.now()}`,
          slideNumber: 5,
          title: `Slide 5: JVM Garbage Collection, Memory Lifecycles & String Deduplication`,
          slideSubtitle: `Young vs Old Generation, G1GC/ZGC region management, and String Pool deduplication.`,
          takeaways: [
            `JVM Generational Garbage Collection divides Heap into Young (Eden, S0, S1) and Old Generation.`,
            `G1GC and ZGC use compacting regions to maintain sub-millisecond pause times during object lifecycle sweeps.`,
            `String deduplication in JVM eliminates redundant UTF-16 byte arrays across duplicate string instances on the Heap.`
          ],
          whiteboardContent: `# JVM Heap Generations & Garbage Collection Invariants\n\n### Heap Memory Partitioning:\n* **Young Generation (Eden + Survivor S0/S1):** Short-lived objects allocated here ($>90\\%$ die young).\n* **Tenured / Old Generation:** Long-lived objects promoted after surviving $N$ GC cycles.\n\n### Generational Hypothesis Invariant:\n$$\\text{Cost}(\\text{Minor GC}) \\ll \\text{Cost}(\\text{Full GC}) \\implies \\text{Prefer Primitive Allocations}$$`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│                     JVM HEAP MEMORY SPACES                    │\n├───────────────────────────────────────────────────────────────┤\n│ [ Eden Space (80%) ] ──> [ S0 (10%) ] ──> [ S1 (10%) ]        │\n│                             │                                 │\n│                             ▼ (Promoted after 15 GC cycles)   │\n│                   [ Old Generation (Tenured) ]                │\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// JVM Garbage Collection & Reference Demo\npublic class GCMemoryOptimizationDemo {\n    public static void main(String[] args) {\n        long startTime = System.currentTimeMillis();\n        long primitiveSum = 0L;\n        for (int i = 0; i < 10_000_000; i++) {\n            primitiveSum += i;\n        }\n        System.out.println("Fast primitive sum in Stack: " + primitiveSum);\n    }\n}`,
          terminalOutput: `[JVM GC RUNTIME] Executed 10M operations in 4.2ms.\n>>> Minor GC Count: 0 | Heap Allocations: 0 Bytes | All invariants satisfied.`,
          dialogue: [
            { speaker: 'professor', text: `In Slide 5, we examine how the JVM cleans up Heap objects and why Stack primitives require zero GC overhead.` },
            { speaker: 'alex', text: `Professor, how does using primitives prevent Garbage Collection pause spikes in high-frequency trading systems?` },
            { speaker: 'professor', text: `Primitives reside directly on the Stack Frame and are cleaned up instantly when the method returns, putting zero pressure on the JVM Garbage Collector!` }
          ],
          quizzes: [
            {
              question: "What is the primary architectural principle demonstrated in this slide?",
              options: [
                "Maintaining strict resource limits, deterministic invariants, and high cache locality",
                "Disabling all validation to maximize throughput",
                "Relying entirely on manual human intervention",
                "Multiplying memory allocations indiscriminately"
              ],
              correct: 0,
              explanation: "Production-grade system architectures prioritize deterministic resource management, memory bounds, and low-latency cache locality."
            },
            {
              question: "How does this implementation optimize memory access and CPU instruction throughput?",
              options: [
                "By aligning memory structures to CPU cache lines and minimizing thread contention",
                "By allocating objects in random memory addresses",
                "By running single-threaded with unbuffered I/O",
                "By compressing CPU registers"
              ],
              correct: 0,
              explanation: "Cache-line alignment and lock-free execution prevent CPU bus contention and false sharing across multi-core processors."
            },
            {
              question: "What is the consequence of failing to enforce bounded queues or memory limits in this architecture?",
              options: [
                "Unbounded memory growth leading to out-of-memory crashes or catastrophic latency spikes",
                "Zero impact on system health",
                "Automatic hardware upgrades",
                "Faster execution speed"
              ],
              correct: 0,
              explanation: "Without backpressure and bounded allocations, sudden traffic surges cause memory exhaustion and cascading systemic failure."
            },
            {
              question: "Why are defensive boundary checks and error handling essential in distributed or concurrent modules?",
              options: [
                "To prevent partial failures from corrupting state or causing deadlock across connected components",
                "To satisfy compiler aesthetic guidelines only",
                "Because exceptions speed up execution",
                "To disable telemetry logging"
              ],
              correct: 0,
              explanation: "Defensive isolation ensures faults are localized, gracefully degraded, and reported via telemetry without crashing the entire system."
            },
            {
              question: "What is the optimal strategy for handling blocking operations in high-throughput services?",
              options: [
                "Offloading blocking calls to asynchronous thread pools or lightweight virtual fibers to preserve event loops",
                "Executing blocking I/O on the main rendering thread",
                "Infinite retry loops without backoff",
                "Ignoring response timeouts"
              ],
              correct: 0,
              explanation: "Asynchronous task delegation and non-blocking I/O prevent thread starvation, keeping worker pipelines responsive."
            },
            {
              question: "How should state transitions be validated under concurrent multi-user execution?",
              options: [
                "Using atomic primitives, optimistic locking with versioning, or strict transactional barriers",
                "Assuming concurrent writes will never overlap",
                "By disabling database transactions",
                "By overwriting timestamps arbitrarily"
              ],
              correct: 0,
              explanation: "Atomic instructions and optimistic concurrency control ensure consistency without heavy distributed locks."
            },
            {
              question: "What metric is most indicative of tail latency issues in production benchmarking?",
              options: [
                "P99 and P99.9 latency distributions under sustained peak load",
                "Arithmetic average (mean) latency alone",
                "File size of the compiled binary",
                "Number of comments in the code"
              ],
              correct: 0,
              explanation: "Mean latency masks outlier spikes. P99/P99.9 percentiles expose GC pauses, queue buildup, and lock contention affecting real users."
            },
            {
              question: "Why is telemetry instrumentation (metrics, traces, structured logs) critical for this component?",
              options: [
                "To enable rapid root-cause diagnosis and automated health alerting during production anomalies",
                "To fill up disk storage",
                "To slow down the application intentionally",
                "Because cloud providers mandate it"
              ],
              correct: 0,
              explanation: "Observability provides real-time visibility into execution health, saturation, and latency bottlenecks."
            },
            {
              question: "What is the recommended approach for scaling read-heavy workloads against this system?",
              options: [
                "Layered multi-level caching with TTL invalidation and read replicas",
                "Directly querying the primary database for every single read request",
                "Restarting the database server every hour",
                "Disabling read query filters"
              ],
              correct: 0,
              explanation: "Read replicas and distributed in-memory caches absorb high query volumes and protect core transactional storage."
            },
            {
              question: "What lifecycle safeguard prevents resource leaks when managing native memory, file descriptors, or sockets?",
              options: [
                "Deterministic try-with-resources or RAII destructors guaranteeing cleanup even upon unexpected errors",
                "Manual cleanup only at system reboot",
                "Relying on optimistic hope",
                "Suppressing all error handling"
              ],
              correct: 0,
              explanation: "Deterministic resource management (like Java try-with-resources or C++ RAII) ensures sockets and handles are closed immediately."
            }
          ]
        };
      } else if (slideNum === 6) {
        return {
          id: `slide-6-${Date.now()}`,
          slideNumber: 6,
          title: `Slide 6: High-Density Primitive Collections & Cache Locality`,
          slideSubtitle: `Contiguous memory packing, int[] vs ArrayList<Integer>, and 64-byte CPU cache line prefetching.`,
          takeaways: [
            `Standard Java ArrayList<Integer> uses 5x more memory than raw int[] due to object headers and reference pointer chasing.`,
            `Primitive collections pack contiguous bytes in RAM, maximizing CPU L1/L2 hardware prefetch efficiency.`,
            `Eliminating box/unbox cycles yields up to 10x higher iteration speed and eliminates false sharing.`
          ],
          whiteboardContent: `# Memory Density: int[] vs ArrayList<Integer>\n\n| Data Structure | Memory for 1M Integers | Cache Line Miss Rate |\n| :--- | :--- | :--- |\n| \`int[]\` (Primitive) | **4 MB** (Contiguous) | $< 1\\%$ (Hardware prefetch) |\n| \`ArrayList<Integer>\` | **20-24 MB** (Pointers + Wrappers) | $> 35\\%$ (Pointer chasing) |\n\n### CPU Cache Line Math:\n$$\\text{Cache Line} = 64 \\text{ Bytes} = 16 \\times 4\\text{-byte ints fetched in 1 cycle!}$$`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│            CONTIGUOUS PRIMITIVE MEMORY IN CPU CACHE           │\n├───────────────────────────────────────────────────────────────┤\n│ [ int 4B ][ int 4B ][ int 4B ][ int 4B ][ int 4B ][ int 4B ] │\n│ <────────────── Single 64-Byte Cache Line Burst ─────────────>│\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// High efficiency primitive array\nint[] highDensityBuffer = new int[1_000_000];\nfor (int i = 0; i < highDensityBuffer.length; i++) {\n    highDensityBuffer[i] = i * 2;\n}`,
          terminalOutput: `[PERFORMANCE] Allocated 4MB primitive array in 0.1ms.\n>>> L1 Cache Hits: 99.8% | Iteration: 1.2ms.`,
          dialogue: [
            { speaker: 'maya', text: `Contiguous primitive arrays allow CPU hardware prefetchers to load entire cache lines ahead of time!` },
            { speaker: 'professor', text: `Precisely, Maya! That is why high-throughput systems avoid boxing primitives in collections.` }
          ],
          quizzes: [
            {
              question: "What is the primary architectural principle demonstrated in this slide?",
              options: [
                "Maintaining strict resource limits, deterministic invariants, and high cache locality",
                "Disabling all validation to maximize throughput",
                "Relying entirely on manual human intervention",
                "Multiplying memory allocations indiscriminately"
              ],
              correct: 0,
              explanation: "Production-grade system architectures prioritize deterministic resource management, memory bounds, and low-latency cache locality."
            },
            {
              question: "How does this implementation optimize memory access and CPU instruction throughput?",
              options: [
                "By aligning memory structures to CPU cache lines and minimizing thread contention",
                "By allocating objects in random memory addresses",
                "By running single-threaded with unbuffered I/O",
                "By compressing CPU registers"
              ],
              correct: 0,
              explanation: "Cache-line alignment and lock-free execution prevent CPU bus contention and false sharing across multi-core processors."
            },
            {
              question: "What is the consequence of failing to enforce bounded queues or memory limits in this architecture?",
              options: [
                "Unbounded memory growth leading to out-of-memory crashes or catastrophic latency spikes",
                "Zero impact on system health",
                "Automatic hardware upgrades",
                "Faster execution speed"
              ],
              correct: 0,
              explanation: "Without backpressure and bounded allocations, sudden traffic surges cause memory exhaustion and cascading systemic failure."
            },
            {
              question: "Why are defensive boundary checks and error handling essential in distributed or concurrent modules?",
              options: [
                "To prevent partial failures from corrupting state or causing deadlock across connected components",
                "To satisfy compiler aesthetic guidelines only",
                "Because exceptions speed up execution",
                "To disable telemetry logging"
              ],
              correct: 0,
              explanation: "Defensive isolation ensures faults are localized, gracefully degraded, and reported via telemetry without crashing the entire system."
            },
            {
              question: "What is the optimal strategy for handling blocking operations in high-throughput services?",
              options: [
                "Offloading blocking calls to asynchronous thread pools or lightweight virtual fibers to preserve event loops",
                "Executing blocking I/O on the main rendering thread",
                "Infinite retry loops without backoff",
                "Ignoring response timeouts"
              ],
              correct: 0,
              explanation: "Asynchronous task delegation and non-blocking I/O prevent thread starvation, keeping worker pipelines responsive."
            },
            {
              question: "How should state transitions be validated under concurrent multi-user execution?",
              options: [
                "Using atomic primitives, optimistic locking with versioning, or strict transactional barriers",
                "Assuming concurrent writes will never overlap",
                "By disabling database transactions",
                "By overwriting timestamps arbitrarily"
              ],
              correct: 0,
              explanation: "Atomic instructions and optimistic concurrency control ensure consistency without heavy distributed locks."
            },
            {
              question: "What metric is most indicative of tail latency issues in production benchmarking?",
              options: [
                "P99 and P99.9 latency distributions under sustained peak load",
                "Arithmetic average (mean) latency alone",
                "File size of the compiled binary",
                "Number of comments in the code"
              ],
              correct: 0,
              explanation: "Mean latency masks outlier spikes. P99/P99.9 percentiles expose GC pauses, queue buildup, and lock contention affecting real users."
            },
            {
              question: "Why is telemetry instrumentation (metrics, traces, structured logs) critical for this component?",
              options: [
                "To enable rapid root-cause diagnosis and automated health alerting during production anomalies",
                "To fill up disk storage",
                "To slow down the application intentionally",
                "Because cloud providers mandate it"
              ],
              correct: 0,
              explanation: "Observability provides real-time visibility into execution health, saturation, and latency bottlenecks."
            },
            {
              question: "What is the recommended approach for scaling read-heavy workloads against this system?",
              options: [
                "Layered multi-level caching with TTL invalidation and read replicas",
                "Directly querying the primary database for every single read request",
                "Restarting the database server every hour",
                "Disabling read query filters"
              ],
              correct: 0,
              explanation: "Read replicas and distributed in-memory caches absorb high query volumes and protect core transactional storage."
            },
            {
              question: "What lifecycle safeguard prevents resource leaks when managing native memory, file descriptors, or sockets?",
              options: [
                "Deterministic try-with-resources or RAII destructors guaranteeing cleanup even upon unexpected errors",
                "Manual cleanup only at system reboot",
                "Relying on optimistic hope",
                "Suppressing all error handling"
              ],
              correct: 0,
              explanation: "Deterministic resource management (like Java try-with-resources or C++ RAII) ensures sockets and handles are closed immediately."
            }
          ]
        };
      } else if (slideNum === 7) {
        return {
          id: `slide-7-${Date.now()}`,
          slideNumber: 7,
          title: `Slide 7: JVM JIT Compiler Optimizations & Escape Analysis`,
          slideSubtitle: `C2 compiler optimizations, Scalar Replacement, On-Stack Allocation, and lock coarsening.`,
          takeaways: [
            `JVM JIT Escape Analysis determines whether an object instance escapes its defining method or thread scope.`,
            `Scalar Replacement decomposes small objects into primitive fields stored directly in CPU registers or Stack.`,
            `Lock Elision automatically strips synchronized blocks when thread contention is provably impossible.`
          ],
          whiteboardContent: `# JVM Escape Analysis & Scalar Replacement\n\n### Optimization Stages:\n1. **Global Escape:** Object passed to external thread $\\implies$ Must allocate on Heap.\n2. **Arg Escape:** Object passed to method but not stored $\\implies$ Stack pinning.\n3. **No Escape:** Object strictly local $\\implies$ **Scalar Replacement into CPU Registers!**\n\n### Scalar Invariant:\n$$\\text{Point } p = \\text{new Point}(x, y) \\xrightarrow{\\text{JIT C2}} \\text{int } p\\_x = x; \\; \\text{int } p\\_y = y; \\quad (0 \\text{ Heap})$$`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│            JVM C2 JIT SCALAR REPLACEMENT PIPELINE             │\n├───────────────────────────────────────────────────────────────┤\n│ [ Point(x,y) Object ] ──[Escape Analysis]──> [ CPU Reg: rdx ] │\n│                                              [ CPU Reg: rcx ] │\n│                                         (0 Heap allocations!) │\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Scalar replacement candidate\npublic static int computeDistance(int x, int y) {\n    // Point object never escapes method scope -> JIT turns this into 2 raw ints!\n    Point p = new Point(x, y);\n    return p.x * p.x + p.y * p.y;\n}`,
          terminalOutput: `[JIT C2 COMPILER] Hot method inlined: computeDistance()\n>>> Escape Analysis: NO_ESCAPE -> Scalar Replacement active (0 Heap bytes allocated).`,
          dialogue: [
            { speaker: 'alex', text: `Does this mean the JVM can eliminate object creation overhead automatically?` },
            { speaker: 'professor', text: `Yes! When the C2 JIT compiler verifies that an object never escapes the method, it decomposes the object into pure primitive variables stored in CPU registers.` }
          ],
          quizzes: [
            {
              question: "What is the primary architectural principle demonstrated in this slide?",
              options: [
                "Maintaining strict resource limits, deterministic invariants, and high cache locality",
                "Disabling all validation to maximize throughput",
                "Relying entirely on manual human intervention",
                "Multiplying memory allocations indiscriminately"
              ],
              correct: 0,
              explanation: "Production-grade system architectures prioritize deterministic resource management, memory bounds, and low-latency cache locality."
            },
            {
              question: "How does this implementation optimize memory access and CPU instruction throughput?",
              options: [
                "By aligning memory structures to CPU cache lines and minimizing thread contention",
                "By allocating objects in random memory addresses",
                "By running single-threaded with unbuffered I/O",
                "By compressing CPU registers"
              ],
              correct: 0,
              explanation: "Cache-line alignment and lock-free execution prevent CPU bus contention and false sharing across multi-core processors."
            },
            {
              question: "What is the consequence of failing to enforce bounded queues or memory limits in this architecture?",
              options: [
                "Unbounded memory growth leading to out-of-memory crashes or catastrophic latency spikes",
                "Zero impact on system health",
                "Automatic hardware upgrades",
                "Faster execution speed"
              ],
              correct: 0,
              explanation: "Without backpressure and bounded allocations, sudden traffic surges cause memory exhaustion and cascading systemic failure."
            },
            {
              question: "Why are defensive boundary checks and error handling essential in distributed or concurrent modules?",
              options: [
                "To prevent partial failures from corrupting state or causing deadlock across connected components",
                "To satisfy compiler aesthetic guidelines only",
                "Because exceptions speed up execution",
                "To disable telemetry logging"
              ],
              correct: 0,
              explanation: "Defensive isolation ensures faults are localized, gracefully degraded, and reported via telemetry without crashing the entire system."
            },
            {
              question: "What is the optimal strategy for handling blocking operations in high-throughput services?",
              options: [
                "Offloading blocking calls to asynchronous thread pools or lightweight virtual fibers to preserve event loops",
                "Executing blocking I/O on the main rendering thread",
                "Infinite retry loops without backoff",
                "Ignoring response timeouts"
              ],
              correct: 0,
              explanation: "Asynchronous task delegation and non-blocking I/O prevent thread starvation, keeping worker pipelines responsive."
            },
            {
              question: "How should state transitions be validated under concurrent multi-user execution?",
              options: [
                "Using atomic primitives, optimistic locking with versioning, or strict transactional barriers",
                "Assuming concurrent writes will never overlap",
                "By disabling database transactions",
                "By overwriting timestamps arbitrarily"
              ],
              correct: 0,
              explanation: "Atomic instructions and optimistic concurrency control ensure consistency without heavy distributed locks."
            },
            {
              question: "What metric is most indicative of tail latency issues in production benchmarking?",
              options: [
                "P99 and P99.9 latency distributions under sustained peak load",
                "Arithmetic average (mean) latency alone",
                "File size of the compiled binary",
                "Number of comments in the code"
              ],
              correct: 0,
              explanation: "Mean latency masks outlier spikes. P99/P99.9 percentiles expose GC pauses, queue buildup, and lock contention affecting real users."
            },
            {
              question: "Why is telemetry instrumentation (metrics, traces, structured logs) critical for this component?",
              options: [
                "To enable rapid root-cause diagnosis and automated health alerting during production anomalies",
                "To fill up disk storage",
                "To slow down the application intentionally",
                "Because cloud providers mandate it"
              ],
              correct: 0,
              explanation: "Observability provides real-time visibility into execution health, saturation, and latency bottlenecks."
            },
            {
              question: "What is the recommended approach for scaling read-heavy workloads against this system?",
              options: [
                "Layered multi-level caching with TTL invalidation and read replicas",
                "Directly querying the primary database for every single read request",
                "Restarting the database server every hour",
                "Disabling read query filters"
              ],
              correct: 0,
              explanation: "Read replicas and distributed in-memory caches absorb high query volumes and protect core transactional storage."
            },
            {
              question: "What lifecycle safeguard prevents resource leaks when managing native memory, file descriptors, or sockets?",
              options: [
                "Deterministic try-with-resources or RAII destructors guaranteeing cleanup even upon unexpected errors",
                "Manual cleanup only at system reboot",
                "Relying on optimistic hope",
                "Suppressing all error handling"
              ],
              correct: 0,
              explanation: "Deterministic resource management (like Java try-with-resources or C++ RAII) ensures sockets and handles are closed immediately."
            }
          ]
        };
      } else if (slideNum === 8) {
        return {
          id: `slide-8-${Date.now()}`,
          slideNumber: 8,
          title: `Slide 8: Concurrency, Atomic Primitives & Java Memory Model (JMM)`,
          slideSubtitle: `Volatile visibility, AtomicInteger, CPU Compare-And-Swap (CAS), and Happens-Before ordering.`,
          takeaways: [
            `The volatile keyword guarantees memory visibility across CPU cores by issuing hardware memory fences.`,
            `AtomicInteger and AtomicLong use hardware atomic CAS (Compare-And-Swap) instructions without mutex lock overhead.`,
            `The Java Memory Model (JMM) defines strict Happens-Before rules to prevent CPU out-of-order instruction reordering.`
          ],
          whiteboardContent: `# Java Memory Model (JMM) & Atomic Invariants\n\n### Volatile vs Atomic vs Synchronized:\n* **\`volatile\`:** Guarantees read/write visibility across CPU core L1/L2 caches, but NOT compound atomic operations (e.g. \`count++\`).\n* **\`AtomicInteger\`:** Uses lock-free hardware CAS loops: \`compareAndSet(expected, update)\`.\n* **\`synchronized\`:** Mutual exclusion lock with thread blocking.\n\n### Hardware CAS Invariant:\n$$\\text{CAS}(\\text{addr}, \\text{expected}, \\text{new}) = \\begin{cases} \\text{true} & \\text{if } *\\text{addr} == \\text{expected} \\\\ \\text{false} & \\text{otherwise (retry loop)} \\end{cases}$$`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│                 HARDWARE LOCK-FREE ATOMIC CAS                 │\n├───────────────────────────────────────────────────────────────┤\n│ [ Core 1: AtomicCAS ] <─── CPU Bus Lock ───> [ Core 2: Retry ]│\n│                             │                                 │\n│                             ▼                                 │\n│                  [ Shared RAM: Value = 43 ]                   │\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `import java.util.concurrent.atomic.AtomicLong;\n\npublic class AtomicBenchmark {\n    private static final AtomicLong counter = new AtomicLong(0);\n    \n    public static void increment() {\n        // Lock-free atomic instruction (CPU CMPXCHG)\n        counter.incrementAndGet();\n    }\n}`,
          terminalOutput: `[CONCURRENCY BENCHMARK] 16 worker threads executing 10M increments...\n>>> Final Counter: 10,000,000 | Race Conditions: 0 | Time: 18ms.`,
          dialogue: [
            { speaker: 'maya', text: `Why is \`volatile int x\` not sufficient for \`x++\` in multithreaded applications?` },
            { speaker: 'professor', text: `Because \`x++\` is 3 distinct operations: read, increment, and write. Two threads can read the same value simultaneously! Use \`AtomicInteger\` for atomic increments.` }
          ],
          quizzes: [
            {
              question: "What is the primary architectural principle demonstrated in this slide?",
              options: [
                "Maintaining strict resource limits, deterministic invariants, and high cache locality",
                "Disabling all validation to maximize throughput",
                "Relying entirely on manual human intervention",
                "Multiplying memory allocations indiscriminately"
              ],
              correct: 0,
              explanation: "Production-grade system architectures prioritize deterministic resource management, memory bounds, and low-latency cache locality."
            },
            {
              question: "How does this implementation optimize memory access and CPU instruction throughput?",
              options: [
                "By aligning memory structures to CPU cache lines and minimizing thread contention",
                "By allocating objects in random memory addresses",
                "By running single-threaded with unbuffered I/O",
                "By compressing CPU registers"
              ],
              correct: 0,
              explanation: "Cache-line alignment and lock-free execution prevent CPU bus contention and false sharing across multi-core processors."
            },
            {
              question: "What is the consequence of failing to enforce bounded queues or memory limits in this architecture?",
              options: [
                "Unbounded memory growth leading to out-of-memory crashes or catastrophic latency spikes",
                "Zero impact on system health",
                "Automatic hardware upgrades",
                "Faster execution speed"
              ],
              correct: 0,
              explanation: "Without backpressure and bounded allocations, sudden traffic surges cause memory exhaustion and cascading systemic failure."
            },
            {
              question: "Why are defensive boundary checks and error handling essential in distributed or concurrent modules?",
              options: [
                "To prevent partial failures from corrupting state or causing deadlock across connected components",
                "To satisfy compiler aesthetic guidelines only",
                "Because exceptions speed up execution",
                "To disable telemetry logging"
              ],
              correct: 0,
              explanation: "Defensive isolation ensures faults are localized, gracefully degraded, and reported via telemetry without crashing the entire system."
            },
            {
              question: "What is the optimal strategy for handling blocking operations in high-throughput services?",
              options: [
                "Offloading blocking calls to asynchronous thread pools or lightweight virtual fibers to preserve event loops",
                "Executing blocking I/O on the main rendering thread",
                "Infinite retry loops without backoff",
                "Ignoring response timeouts"
              ],
              correct: 0,
              explanation: "Asynchronous task delegation and non-blocking I/O prevent thread starvation, keeping worker pipelines responsive."
            },
            {
              question: "How should state transitions be validated under concurrent multi-user execution?",
              options: [
                "Using atomic primitives, optimistic locking with versioning, or strict transactional barriers",
                "Assuming concurrent writes will never overlap",
                "By disabling database transactions",
                "By overwriting timestamps arbitrarily"
              ],
              correct: 0,
              explanation: "Atomic instructions and optimistic concurrency control ensure consistency without heavy distributed locks."
            },
            {
              question: "What metric is most indicative of tail latency issues in production benchmarking?",
              options: [
                "P99 and P99.9 latency distributions under sustained peak load",
                "Arithmetic average (mean) latency alone",
                "File size of the compiled binary",
                "Number of comments in the code"
              ],
              correct: 0,
              explanation: "Mean latency masks outlier spikes. P99/P99.9 percentiles expose GC pauses, queue buildup, and lock contention affecting real users."
            },
            {
              question: "Why is telemetry instrumentation (metrics, traces, structured logs) critical for this component?",
              options: [
                "To enable rapid root-cause diagnosis and automated health alerting during production anomalies",
                "To fill up disk storage",
                "To slow down the application intentionally",
                "Because cloud providers mandate it"
              ],
              correct: 0,
              explanation: "Observability provides real-time visibility into execution health, saturation, and latency bottlenecks."
            },
            {
              question: "What is the recommended approach for scaling read-heavy workloads against this system?",
              options: [
                "Layered multi-level caching with TTL invalidation and read replicas",
                "Directly querying the primary database for every single read request",
                "Restarting the database server every hour",
                "Disabling read query filters"
              ],
              correct: 0,
              explanation: "Read replicas and distributed in-memory caches absorb high query volumes and protect core transactional storage."
            },
            {
              question: "What lifecycle safeguard prevents resource leaks when managing native memory, file descriptors, or sockets?",
              options: [
                "Deterministic try-with-resources or RAII destructors guaranteeing cleanup even upon unexpected errors",
                "Manual cleanup only at system reboot",
                "Relying on optimistic hope",
                "Suppressing all error handling"
              ],
              correct: 0,
              explanation: "Deterministic resource management (like Java try-with-resources or C++ RAII) ensures sockets and handles are closed immediately."
            }
          ]
        };
      } else if (slideNum === 9) {
        return {
          id: `slide-9-${Date.now()}`,
          slideNumber: 9,
          title: `Slide 9: Java 21+ Virtual Threads & Continuation Memory Footprint`,
          slideSubtitle: `Project Loom, 1KB continuations on Heap vs 1MB Platform threads, and carrier thread scheduling.`,
          takeaways: [
            `Platform threads map 1:1 to OS kernel threads, consuming ~1MB of Stack memory each.`,
            `Virtual threads (Project Loom) are lightweight user-mode threads consuming only ~1KB on the Heap.`,
            `When a virtual thread executes blocking I/O, it unmounts from its carrier thread without blocking the OS core!`
          ],
          whiteboardContent: `# Project Loom: Virtual Threads vs Platform Threads\n\n| Metric | OS Platform Thread | Java Virtual Thread |\n| :--- | :--- | :--- |\n| **Memory Stack** | **~1 MB** (OS fixed) | **~1 KB** (Grows dynamically on Heap) |\n| **Max Capacity** | ~5,000 - 10,000 threads | **1,000,000+ concurrent threads!** |\n| **Context Switch** | ~1-5 microseconds (Kernel) | **~10-50 nanoseconds (JVM Continuation)** |\n| **I/O Model** | Blocks OS kernel thread | **Unmounts from carrier thread instantly** |`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│            PROJECT LOOM VIRTUAL THREAD ARCHITECTURE           │\n├───────────────────────────────────────────────────────────────┤\n│ [ 1,000,000 Virtual Threads (1KB each) ]                      │\n│             │              │              │                   │\n│             ▼              ▼              ▼ (M:N Scheduler)   │\n│   [ Carrier Core 1 ] [ Carrier Core 2 ] [ Carrier Core 3 ]    │\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `// Spawning 100,000 concurrent Virtual Threads in Java 21\ntry (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {\n    for (int i = 0; i < 100_000; i++) {\n        int taskId = i;\n        executor.submit(() -> {\n            Thread.sleep(100); // Unmounts carrier thread during sleep!\n            return taskId;\n        });\n    }\n} // Auto-awaits all 100k tasks with negligible RAM!`,
          terminalOutput: `[JAVA 21 VIRTUAL THREADS] Spawned 100,000 threads simultaneously.\n>>> Total RAM consumed: 112 MB (vs 100 GB with OS threads) | Completed in 142ms.`,
          dialogue: [
            { speaker: 'alex', text: `With Virtual Threads, do we still need reactive frameworks like WebFlux or RxJava for high concurrency?` },
            { speaker: 'professor', text: `Virtual Threads bring back simple, readable synchronous blocking code (like standard JDBC or HTTP calls) with the extreme scalability of non-blocking event loops!` }
          ],
          quizzes: [
            {
              question: "What is the primary architectural principle demonstrated in this slide?",
              options: [
                "Maintaining strict resource limits, deterministic invariants, and high cache locality",
                "Disabling all validation to maximize throughput",
                "Relying entirely on manual human intervention",
                "Multiplying memory allocations indiscriminately"
              ],
              correct: 0,
              explanation: "Production-grade system architectures prioritize deterministic resource management, memory bounds, and low-latency cache locality."
            },
            {
              question: "How does this implementation optimize memory access and CPU instruction throughput?",
              options: [
                "By aligning memory structures to CPU cache lines and minimizing thread contention",
                "By allocating objects in random memory addresses",
                "By running single-threaded with unbuffered I/O",
                "By compressing CPU registers"
              ],
              correct: 0,
              explanation: "Cache-line alignment and lock-free execution prevent CPU bus contention and false sharing across multi-core processors."
            },
            {
              question: "What is the consequence of failing to enforce bounded queues or memory limits in this architecture?",
              options: [
                "Unbounded memory growth leading to out-of-memory crashes or catastrophic latency spikes",
                "Zero impact on system health",
                "Automatic hardware upgrades",
                "Faster execution speed"
              ],
              correct: 0,
              explanation: "Without backpressure and bounded allocations, sudden traffic surges cause memory exhaustion and cascading systemic failure."
            },
            {
              question: "Why are defensive boundary checks and error handling essential in distributed or concurrent modules?",
              options: [
                "To prevent partial failures from corrupting state or causing deadlock across connected components",
                "To satisfy compiler aesthetic guidelines only",
                "Because exceptions speed up execution",
                "To disable telemetry logging"
              ],
              correct: 0,
              explanation: "Defensive isolation ensures faults are localized, gracefully degraded, and reported via telemetry without crashing the entire system."
            },
            {
              question: "What is the optimal strategy for handling blocking operations in high-throughput services?",
              options: [
                "Offloading blocking calls to asynchronous thread pools or lightweight virtual fibers to preserve event loops",
                "Executing blocking I/O on the main rendering thread",
                "Infinite retry loops without backoff",
                "Ignoring response timeouts"
              ],
              correct: 0,
              explanation: "Asynchronous task delegation and non-blocking I/O prevent thread starvation, keeping worker pipelines responsive."
            },
            {
              question: "How should state transitions be validated under concurrent multi-user execution?",
              options: [
                "Using atomic primitives, optimistic locking with versioning, or strict transactional barriers",
                "Assuming concurrent writes will never overlap",
                "By disabling database transactions",
                "By overwriting timestamps arbitrarily"
              ],
              correct: 0,
              explanation: "Atomic instructions and optimistic concurrency control ensure consistency without heavy distributed locks."
            },
            {
              question: "What metric is most indicative of tail latency issues in production benchmarking?",
              options: [
                "P99 and P99.9 latency distributions under sustained peak load",
                "Arithmetic average (mean) latency alone",
                "File size of the compiled binary",
                "Number of comments in the code"
              ],
              correct: 0,
              explanation: "Mean latency masks outlier spikes. P99/P99.9 percentiles expose GC pauses, queue buildup, and lock contention affecting real users."
            },
            {
              question: "Why is telemetry instrumentation (metrics, traces, structured logs) critical for this component?",
              options: [
                "To enable rapid root-cause diagnosis and automated health alerting during production anomalies",
                "To fill up disk storage",
                "To slow down the application intentionally",
                "Because cloud providers mandate it"
              ],
              correct: 0,
              explanation: "Observability provides real-time visibility into execution health, saturation, and latency bottlenecks."
            },
            {
              question: "What is the recommended approach for scaling read-heavy workloads against this system?",
              options: [
                "Layered multi-level caching with TTL invalidation and read replicas",
                "Directly querying the primary database for every single read request",
                "Restarting the database server every hour",
                "Disabling read query filters"
              ],
              correct: 0,
              explanation: "Read replicas and distributed in-memory caches absorb high query volumes and protect core transactional storage."
            },
            {
              question: "What lifecycle safeguard prevents resource leaks when managing native memory, file descriptors, or sockets?",
              options: [
                "Deterministic try-with-resources or RAII destructors guaranteeing cleanup even upon unexpected errors",
                "Manual cleanup only at system reboot",
                "Relying on optimistic hope",
                "Suppressing all error handling"
              ],
              correct: 0,
              explanation: "Deterministic resource management (like Java try-with-resources or C++ RAII) ensures sockets and handles are closed immediately."
            }
          ]
        };
      } else {
        return {
          id: `slide-10-${Date.now()}`,
          slideNumber: slideNum,
          title: `Slide ${slideNum}: Off-Heap Direct Memory & Low-Latency DirectByteBuffers`,
          slideSubtitle: `Kernel bypass, Memory-Mapped Files (mmap), and zero-copy off-heap network serialization.`,
          takeaways: [
            `DirectByteBuffers allocate memory outside the JVM Garbage Collected Heap using native malloc.`,
            `Zero-Copy serialization transfers bytes directly from native sockets to NVMe storage without JVM Heap copies.`,
            `Off-heap memory structures eliminate GC pauses entirely for ultra-low latency trading and messaging engines.`
          ],
          whiteboardContent: `# Off-Heap Direct Memory & Kernel Zero-Copy\n\n### Direct Memory vs On-Heap Buffers:\n* **On-Heap Buffer:** Must be copied to temporary native memory before OS \`write()\` syscall $\\implies$ 2x CPU copy penalty.\n* **DirectByteBuffer:** Allocated in native OS memory $\\implies$ Direct DMA (Direct Memory Access) to network card!\n\n### Zero-Copy Pipeline Invariant:\n$$\\text{Socket Buffer} \\xrightarrow{\\text{Direct DMA}} \\text{Off-Heap DirectByteBuffer} \\xrightarrow{\\text{Zero-Copy}} \\text{NVMe File}$$`,
          diagram: `┌───────────────────────────────────────────────────────────────┐\n│            ZERO-COPY OFF-HEAP DIRECT MEMORY PIPELINE          │\n├───────────────────────────────────────────────────────────────┤\n│ [ NIC Socket ] ──(DMA)──> [ Off-Heap DirectBuffer ] ──> [ Disk ]│\n│                                  (Bypasses JVM GC Heap!)      │\n└───────────────────────────────────────────────────────────────┘`,
          codeSnippet: `import java.nio.ByteBuffer;\n\n// Allocate 1GB off-heap memory outside GC pause boundaries\nByteBuffer offHeapBuffer = ByteBuffer.allocateDirect(1024 * 1024 * 1024);\n\n// Write primitive bytes directly\noffHeapBuffer.putLong(1711000000000L);\noffHeapBuffer.putDouble(3.1415926535);\n\nSystem.out.println("Zero-Copy buffer ready with 0 GC overhead.");`,
          terminalOutput: `[OFF-HEAP DMA] Allocated 1GB Direct Memory.\n>>> Zero-Copy Transfer: 12.8 GB/sec | GC Pauses: 0.00ms.`,
          dialogue: [
            { speaker: 'maya', text: `This is how Apache Kafka and Netty achieve multi-gigabyte per second throughput without Garbage Collection spikes!` },
            { speaker: 'professor', text: `Exactly, Maya! Mastering both on-stack primitives, JVM heap mechanics, and off-heap direct buffers completes your full mastery of Java memory systems.` }
          ],
          quizzes: [
            {
              question: "What is the primary architectural principle demonstrated in this slide?",
              options: [
                "Maintaining strict resource limits, deterministic invariants, and high cache locality",
                "Disabling all validation to maximize throughput",
                "Relying entirely on manual human intervention",
                "Multiplying memory allocations indiscriminately"
              ],
              correct: 0,
              explanation: "Production-grade system architectures prioritize deterministic resource management, memory bounds, and low-latency cache locality."
            },
            {
              question: "How does this implementation optimize memory access and CPU instruction throughput?",
              options: [
                "By aligning memory structures to CPU cache lines and minimizing thread contention",
                "By allocating objects in random memory addresses",
                "By running single-threaded with unbuffered I/O",
                "By compressing CPU registers"
              ],
              correct: 0,
              explanation: "Cache-line alignment and lock-free execution prevent CPU bus contention and false sharing across multi-core processors."
            },
            {
              question: "What is the consequence of failing to enforce bounded queues or memory limits in this architecture?",
              options: [
                "Unbounded memory growth leading to out-of-memory crashes or catastrophic latency spikes",
                "Zero impact on system health",
                "Automatic hardware upgrades",
                "Faster execution speed"
              ],
              correct: 0,
              explanation: "Without backpressure and bounded allocations, sudden traffic surges cause memory exhaustion and cascading systemic failure."
            },
            {
              question: "Why are defensive boundary checks and error handling essential in distributed or concurrent modules?",
              options: [
                "To prevent partial failures from corrupting state or causing deadlock across connected components",
                "To satisfy compiler aesthetic guidelines only",
                "Because exceptions speed up execution",
                "To disable telemetry logging"
              ],
              correct: 0,
              explanation: "Defensive isolation ensures faults are localized, gracefully degraded, and reported via telemetry without crashing the entire system."
            },
            {
              question: "What is the optimal strategy for handling blocking operations in high-throughput services?",
              options: [
                "Offloading blocking calls to asynchronous thread pools or lightweight virtual fibers to preserve event loops",
                "Executing blocking I/O on the main rendering thread",
                "Infinite retry loops without backoff",
                "Ignoring response timeouts"
              ],
              correct: 0,
              explanation: "Asynchronous task delegation and non-blocking I/O prevent thread starvation, keeping worker pipelines responsive."
            },
            {
              question: "How should state transitions be validated under concurrent multi-user execution?",
              options: [
                "Using atomic primitives, optimistic locking with versioning, or strict transactional barriers",
                "Assuming concurrent writes will never overlap",
                "By disabling database transactions",
                "By overwriting timestamps arbitrarily"
              ],
              correct: 0,
              explanation: "Atomic instructions and optimistic concurrency control ensure consistency without heavy distributed locks."
            },
            {
              question: "What metric is most indicative of tail latency issues in production benchmarking?",
              options: [
                "P99 and P99.9 latency distributions under sustained peak load",
                "Arithmetic average (mean) latency alone",
                "File size of the compiled binary",
                "Number of comments in the code"
              ],
              correct: 0,
              explanation: "Mean latency masks outlier spikes. P99/P99.9 percentiles expose GC pauses, queue buildup, and lock contention affecting real users."
            },
            {
              question: "Why is telemetry instrumentation (metrics, traces, structured logs) critical for this component?",
              options: [
                "To enable rapid root-cause diagnosis and automated health alerting during production anomalies",
                "To fill up disk storage",
                "To slow down the application intentionally",
                "Because cloud providers mandate it"
              ],
              correct: 0,
              explanation: "Observability provides real-time visibility into execution health, saturation, and latency bottlenecks."
            },
            {
              question: "What is the recommended approach for scaling read-heavy workloads against this system?",
              options: [
                "Layered multi-level caching with TTL invalidation and read replicas",
                "Directly querying the primary database for every single read request",
                "Restarting the database server every hour",
                "Disabling read query filters"
              ],
              correct: 0,
              explanation: "Read replicas and distributed in-memory caches absorb high query volumes and protect core transactional storage."
            },
            {
              question: "What lifecycle safeguard prevents resource leaks when managing native memory, file descriptors, or sockets?",
              options: [
                "Deterministic try-with-resources or RAII destructors guaranteeing cleanup even upon unexpected errors",
                "Manual cleanup only at system reboot",
                "Relying on optimistic hope",
                "Suppressing all error handling"
              ],
              correct: 0,
              explanation: "Deterministic resource management (like Java try-with-resources or C++ RAII) ensures sockets and handles are closed immediately."
            }
          ]
        };
      }
    }

    // Universal default sequence for general topics
    const genericCurricula = [
      {
        title: `Slide ${slideNum}: Memory Footprint & Resource Lifecycle Management`,
        sub: `Allocation patterns, memory reclamation, and resource leak prevention.`,
        eq: `\\text{Memory Footprint} = \\text{Static Working Set} + \\mathcal{O}(\\text{Active Requests})`,
        takeaways: [
          `Optimal resource allocation and scoping rules for ${title.split(':')[0]}.`,
          `Preventing resource leakage through deterministic lifecycle guards.`,
          `Memory profiling and footprint minimization.`
        ]
      },
      {
        title: `Slide ${slideNum}: High-Throughput I/O & CPU Cache Locality`,
        sub: `Cache-line alignment, sequential memory bursts, and batching pipelines.`,
        eq: `\\text{Bandwidth} = \\frac{\\text{Batch Size}}{\\text{I/O Latency} + \\text{Processing Overhead}}`,
        takeaways: [
          `Maximizing CPU cache hit rates through sequential data access.`,
          `Batching requests to amortize system call and I/O latency.`,
          `Hardware prefetching optimization.`
        ]
      },
      {
        title: `Slide ${slideNum}: Concurrency Models & Lock-Free Synchronization`,
        sub: `Atomic state transitions, thread coordination, and memory visibility.`,
        eq: `\\text{Speedup} = \\frac{1}{(1 - P) + \\frac{P}{N}} \\quad (\\text{Amdahl's Law})`,
        takeaways: [
          `Eliminating lock contention using non-blocking atomic operations.`,
          `Thread synchronization guarantees and memory ordering.`,
          `Designing race-free concurrent state machines.`
        ]
      },
      {
        title: `Slide ${slideNum}: Production Observability & P99 Latency Profiling`,
        sub: `Telemetry metrics, distributed tracing, and root-cause bottleneck analysis.`,
        eq: `\\text{P99 Latency} \\le 2.0\\text{ms} \\quad \\text{under } 100\\text{k req/sec}`,
        takeaways: [
          `Critical telemetry indicators and performance golden signals.`,
          `Profiling CPU, memory, and I/O bottlenecks under stress.`,
          `Production readiness and automated health verification.`
        ]
      }
    ];

    const item = genericCurricula[(slideNum - 5) % genericCurricula.length] || genericCurricula[0];

    return {
      id: `slide-${slideNum}-${Date.now()}`,
      slideNumber: slideNum,
      title: item.title,
      slideSubtitle: item.sub,
      takeaways: item.takeaways,
      whiteboardContent: `# ${item.title}\n\n### Core System Invariant:\n$$${item.eq}$$\n\n### Key Principles:\n1. **High Efficiency:** Optimal CPU and memory utilization.\n2. **Deterministic Guarantees:** Strict state consistency under peak load.\n3. **Production Robustness:** Comprehensive observability.`,
      diagram: `┌───────────────────────────────────────────────────────────────┐\n│            PRODUCTION ARCHITECTURE: SLIDE ${slideNum}                 │\n├───────────────────────────────────────────────────────────────┤\n│ [ Request Ingestion ] ──> [ Core Logic Engine ] ──> [ Sink ]  │\n└───────────────────────────────────────────────────────────────┘`,
      codeSnippet: `// Advanced module implementation for Slide ${slideNum}\npublic class AdvancedModule${slideNum} {\n    public static void execute() {\n        System.out.println("Executing Slide ${slideNum} curriculum.");\n    }\n}`,
      terminalOutput: `[ENGINE] Slide ${slideNum} verified.\n>>> Latency: 0.22ms | 100% test coverage | Zero defects.`,
      dialogue: [
        { speaker: 'professor', text: `In Slide ${slideNum}, we analyze advanced architectural patterns for ${title.split(':')[0]}.` },
        { speaker: 'alex', text: `Professor, how does this ensure scalability in mission-critical environments?` },
        { speaker: 'professor', text: `By enforcing strict memory, concurrency, and observability invariants across all execution paths!` }
      ],
      quizzes: [
            {
              question: "What is the primary architectural principle demonstrated in this slide?",
              options: [
                "Maintaining strict resource limits, deterministic invariants, and high cache locality",
                "Disabling all validation to maximize throughput",
                "Relying entirely on manual human intervention",
                "Multiplying memory allocations indiscriminately"
              ],
              correct: 0,
              explanation: "Production-grade system architectures prioritize deterministic resource management, memory bounds, and low-latency cache locality."
            },
            {
              question: "How does this implementation optimize memory access and CPU instruction throughput?",
              options: [
                "By aligning memory structures to CPU cache lines and minimizing thread contention",
                "By allocating objects in random memory addresses",
                "By running single-threaded with unbuffered I/O",
                "By compressing CPU registers"
              ],
              correct: 0,
              explanation: "Cache-line alignment and lock-free execution prevent CPU bus contention and false sharing across multi-core processors."
            },
            {
              question: "What is the consequence of failing to enforce bounded queues or memory limits in this architecture?",
              options: [
                "Unbounded memory growth leading to out-of-memory crashes or catastrophic latency spikes",
                "Zero impact on system health",
                "Automatic hardware upgrades",
                "Faster execution speed"
              ],
              correct: 0,
              explanation: "Without backpressure and bounded allocations, sudden traffic surges cause memory exhaustion and cascading systemic failure."
            },
            {
              question: "Why are defensive boundary checks and error handling essential in distributed or concurrent modules?",
              options: [
                "To prevent partial failures from corrupting state or causing deadlock across connected components",
                "To satisfy compiler aesthetic guidelines only",
                "Because exceptions speed up execution",
                "To disable telemetry logging"
              ],
              correct: 0,
              explanation: "Defensive isolation ensures faults are localized, gracefully degraded, and reported via telemetry without crashing the entire system."
            },
            {
              question: "What is the optimal strategy for handling blocking operations in high-throughput services?",
              options: [
                "Offloading blocking calls to asynchronous thread pools or lightweight virtual fibers to preserve event loops",
                "Executing blocking I/O on the main rendering thread",
                "Infinite retry loops without backoff",
                "Ignoring response timeouts"
              ],
              correct: 0,
              explanation: "Asynchronous task delegation and non-blocking I/O prevent thread starvation, keeping worker pipelines responsive."
            },
            {
              question: "How should state transitions be validated under concurrent multi-user execution?",
              options: [
                "Using atomic primitives, optimistic locking with versioning, or strict transactional barriers",
                "Assuming concurrent writes will never overlap",
                "By disabling database transactions",
                "By overwriting timestamps arbitrarily"
              ],
              correct: 0,
              explanation: "Atomic instructions and optimistic concurrency control ensure consistency without heavy distributed locks."
            },
            {
              question: "What metric is most indicative of tail latency issues in production benchmarking?",
              options: [
                "P99 and P99.9 latency distributions under sustained peak load",
                "Arithmetic average (mean) latency alone",
                "File size of the compiled binary",
                "Number of comments in the code"
              ],
              correct: 0,
              explanation: "Mean latency masks outlier spikes. P99/P99.9 percentiles expose GC pauses, queue buildup, and lock contention affecting real users."
            },
            {
              question: "Why is telemetry instrumentation (metrics, traces, structured logs) critical for this component?",
              options: [
                "To enable rapid root-cause diagnosis and automated health alerting during production anomalies",
                "To fill up disk storage",
                "To slow down the application intentionally",
                "Because cloud providers mandate it"
              ],
              correct: 0,
              explanation: "Observability provides real-time visibility into execution health, saturation, and latency bottlenecks."
            },
            {
              question: "What is the recommended approach for scaling read-heavy workloads against this system?",
              options: [
                "Layered multi-level caching with TTL invalidation and read replicas",
                "Directly querying the primary database for every single read request",
                "Restarting the database server every hour",
                "Disabling read query filters"
              ],
              correct: 0,
              explanation: "Read replicas and distributed in-memory caches absorb high query volumes and protect core transactional storage."
            },
            {
              question: "What lifecycle safeguard prevents resource leaks when managing native memory, file descriptors, or sockets?",
              options: [
                "Deterministic try-with-resources or RAII destructors guaranteeing cleanup even upon unexpected errors",
                "Manual cleanup only at system reboot",
                "Relying on optimistic hope",
                "Suppressing all error handling"
              ],
              correct: 0,
              explanation: "Deterministic resource management (like Java try-with-resources or C++ RAII) ensures sockets and handles are closed immediately."
            }
          ]
    };
  };

  // ─── GENERATE NEXT SLIDE ON DEMAND ──────────────────────────────────────────
  const handleGenerateNextSlide = async () => {
    setIsGeneratingNextSlide(true);
    const nextSlideNum = (activeLesson.scenes?.length || 0) + 1;
    const lessonTitle = activeLesson.title || 'Masterclass';

    try {
      const prompt = `You are BoloClass (Interactive AI Classroom).
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
  "quizzes": [
    {
      "question": "<High-level conceptual multiple-choice question testing core foundations>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<In-depth technical explanation & architectural rationale>."
    },
    {
      "question": "<Internal mechanics / memory / runtime multiple-choice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of internal mechanics>."
    },
    {
      "question": "<Edge case, boundary condition, or best practice question>?",
      "options": ["<Option A (Correct)>", "<Option B>", "<Option C>", "<Option D>"],
      "correct": 0,
      "explanation": "<Technical explanation of edge case/best practice>."
    }
  ]
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

      const slideToAdd = nextSlide || generateNextSlideFallback(activeLesson, nextSlideNum);
      const updatedScenes = [...activeLesson.scenes, slideToAdd];
      const updatedLesson = { ...activeLesson, scenes: updatedScenes };

      setActiveLesson(updatedLesson);
      setLessons(prev => prev.map(l => l.id === updatedLesson.id ? updatedLesson : l));
      
      const newIdx = updatedScenes.length - 1;
      setCurrentSceneIdx(newIdx);
      setCurrentDialogueIdx(0);
      setCurrentQuizIdx(0);
      setCustomTerminalLogs([]);

      addToast?.({
        type: 'success',
        message: `✨ Slide ${nextSlideNum} generated and added to your deck!`
      });
    } catch (e) {
      console.warn("Generate slide fallback triggered:", e);
      const fallbackSlide = generateNextSlideFallback(activeLesson, nextSlideNum);
      const updatedScenes = [...activeLesson.scenes, fallbackSlide];
      const updatedLesson = { ...activeLesson, scenes: updatedScenes };

      setActiveLesson(updatedLesson);
      setLessons(prev => prev.map(l => l.id === updatedLesson.id ? updatedLesson : l));
      
      const newIdx = updatedScenes.length - 1;
      setCurrentSceneIdx(newIdx);
      setCurrentDialogueIdx(0);
      setCurrentQuizIdx(0);
      setCustomTerminalLogs([]);

      addToast?.({
        type: 'success',
        message: `✨ Slide ${nextSlideNum} added to your deck!`
      });
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
    } finally {
      setIsAutoSummarizing(false);
    }
  };

  // Export Notes & Slides to Markdown (.md)
  const handleExportNotes = () => {
    const notesContent = `# ${activeLesson.title} - BoloClass Slide Deck Notes
**Date:** ${new Date().toLocaleDateString()}
**Professor:** ${activeLesson.professor?.name || 'Professor'} (${activeLesson.professor?.role || 'Lead Instructor'})
**Curriculum Protocol:** BoloClass AI Classroom Protocol

---

${activeLesson.scenes?.map((sc, i) => `
## Slide ${sc.slideNumber || i + 1}: ${sc.title}
*${sc.slideSubtitle || ''}*

### Key Takeaways:
${sc.takeaways ? sc.takeaways.map(t => `- ${t}`).join('\n') : ''}

### Whiteboard / Lecture Notes:
${sc.whiteboardContent || 'N/A'}

### Visual Model / Diagram:
\`\`\`
${sc.visualAscii || sc.diagram || 'N/A'}
\`\`\`

### Reference Implementation Code:
\`\`\`
${sc.codeSnippet || 'N/A'}
\`\`\`
`).join('\n---\n') || ''}
`;
    const blob = new Blob([notesContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(activeLesson.title || 'BoloClass').replace(/\s+/g, '_')}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
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
                BoloClass Multi-Agent AI Classroom
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-400/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" /> BoloClass AI Protocol
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

          {/* Quick Language Selector */}
          <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10 text-xs">
            <button
              onClick={() => {
                setSelectedLanguage('en');
                addToast?.({ type: 'info', message: '🌐 Language switched to English (India)' });
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${selectedLanguage === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <span>🇮🇳</span> English
            </button>
            <button
              onClick={() => {
                setSelectedLanguage('te');
                addToast?.({ type: 'info', message: '🌐 భాష తెలుగుకు మార్చబడింది (Telugu)' });
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${selectedLanguage === 'te' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <span>🇮🇳</span> తెలుగు
            </button>
            <button
              onClick={() => {
                setSelectedLanguage('hi');
                addToast?.({ type: 'info', message: '🌐 भाषा हिन्दी में बदली गई (Hindi)' });
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${selectedLanguage === 'hi' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <span>🇮🇳</span> हिन्दी
            </button>
          </div>

          {/* Voice Studio Modal Trigger */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-amber-600/30 hover:from-purple-600/40 hover:to-pink-600/40 text-purple-200 text-xs font-bold border border-purple-400/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-500/10"
            title="Open Voice Studio to Select Custom Voices, Language & Pitch"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-300 animate-spin" />
            <span>Voice Studio 🎙️</span>
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
                setCurrentQuizIdx(0);
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
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Class Cohort:</span>
                <div className="flex items-center gap-1.5">
                  {activeLesson.classmates.map((cm) => {
                    const info = getSpeakerInfo(cm.id, activeLesson);
                    return (
                      <div 
                        key={cm.id}
                        onClick={() => handleAskQuestion(`@${info.name}: What is your perspective on this architectural challenge?`)}
                        className={'px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all border cursor-pointer hover:scale-105 ' + (activeSpeaker === cm.id ? 'border-cyan-400 bg-cyan-500/30 ring-2 ring-cyan-400 scale-105 shadow-md shadow-cyan-500/30' : 'border-white/10 bg-[#101728] opacity-85 hover:opacity-100')}
                        title={`Click to ask ${info.name} (${info.role})`}
                      >
                        <span>{info.avatar}</span>
                        <span className="text-[11px] text-gray-200">{info.name}</span>
                      </div>
                    );
                  })}
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
                    
                    {/* Vivid Colorful Header Banner with Laser Pointer */}
                    <div className={`p-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden transition-all duration-500 ${currentLectureStep?.target === 'header' ? 'ring-4 ring-amber-300 shadow-2xl' : ''}`}>
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

                        {currentLectureStep?.target === 'header' && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-black font-extrabold text-[10px] shadow-lg animate-bounce shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                            🔴 LASER POINTER: SLIDE OVERVIEW
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Lecture Step Navigation Pills */}
                    <div className="bg-slate-100/90 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-600" /> Points:
                        </span>
                        {currentLectureSteps.map((st, sIndex) => {
                          const isCurrent = lectureStepIdx === sIndex;
                          return (
                            <button
                              key={st.id || sIndex}
                              onClick={() => handleJumpToStep(sIndex)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${isCurrent ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300 scale-105' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                              title={`Jump to ${st.title}`}
                            >
                              {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping"></span>}
                              <span>{st.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 shrink-0">
                        <span className="font-bold text-indigo-700">Point {lectureStepIdx + 1}</span> of {currentLectureSteps.length}
                        {isPlaying && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300 flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Explaining
                          </span>
                        )}
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
                            const isPointActive = currentLectureStep?.target === `takeaway-${tIdx}`;
                            const cardStyles = [
                              { border: 'border-l-violet-600 border-violet-100 bg-gradient-to-r from-violet-50/90 to-indigo-50/40', badge: 'bg-violet-600 text-white', text: 'text-slate-800' },
                              { border: 'border-l-cyan-600 border-cyan-100 bg-gradient-to-r from-cyan-50/90 to-sky-50/40', badge: 'bg-cyan-600 text-white', text: 'text-slate-800' },
                              { border: 'border-l-emerald-600 border-emerald-100 bg-gradient-to-r from-emerald-50/90 to-teal-50/40', badge: 'bg-emerald-600 text-white', text: 'text-slate-800' },
                              { border: 'border-l-amber-500 border-amber-100 bg-gradient-to-r from-amber-50/90 to-orange-50/40', badge: 'bg-amber-600 text-white', text: 'text-slate-800' },
                              { border: 'border-l-rose-500 border-rose-100 bg-gradient-to-r from-rose-50/90 to-pink-50/40', badge: 'bg-rose-600 text-white', text: 'text-slate-800' },
                              { border: 'border-l-blue-600 border-blue-100 bg-gradient-to-r from-blue-50/90 to-cyan-50/40', badge: 'bg-blue-600 text-white', text: 'text-slate-800' }
                            ];
                            const currentStyle = cardStyles[tIdx % cardStyles.length];

                            return (
                              <div 
                                key={tIdx}
                                onClick={() => {
                                  const targetIdx = currentLectureSteps.findIndex(s => s.target === `takeaway-${tIdx}`);
                                  if (targetIdx !== -1) handleJumpToStep(targetIdx);
                                }}
                                className={`p-3.5 rounded-xl border-l-4 border transition-all duration-300 cursor-pointer ${isPointActive ? 'ring-4 ring-indigo-500 shadow-2xl scale-[1.025] bg-gradient-to-r from-violet-100 via-indigo-50 to-white border-l-indigo-600' : `${currentStyle.border} shadow-sm hover:shadow-md hover:scale-[1.01]`}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-6 h-6 rounded-lg ${currentStyle.badge} text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                                    {tIdx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-xs ${currentStyle.text} leading-relaxed font-semibold`}>
                                      {t}
                                    </p>
                                  </div>

                                  {isPointActive && (
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-mono font-black text-[9px] flex items-center gap-1 shadow animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping"></span>
                                        🔴 POINT {tIdx + 1}
                                      </span>
                                      <div className="flex items-end gap-0.5 h-3 shrink-0">
                                        <span className="w-1 bg-indigo-600 animate-[bounce_0.8s_infinite] h-2.5 rounded-full"></span>
                                        <span className="w-1 bg-indigo-600 animate-[bounce_0.6s_infinite_0.2s] h-3 rounded-full"></span>
                                        <span className="w-1 bg-indigo-600 animate-[bounce_0.7s_infinite_0.4s] h-1.5 rounded-full"></span>
                                      </div>
                                    </div>
                                  )}
                                </div>
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

                          {/* Mac-style Window Frame with Active Visual Laser Halo */}
                          {(() => {
                            const isVisualActive = currentLectureStep?.target === 'visual';
                            return (
                              <div 
                                onClick={() => {
                                  const targetIdx = currentLectureSteps.findIndex(s => s.target === 'visual');
                                  if (targetIdx !== -1) handleJumpToStep(targetIdx);
                                }}
                                className={`rounded-xl overflow-hidden border shadow-lg bg-[#0f172a] transition-all duration-300 cursor-pointer ${isVisualActive ? 'ring-4 ring-cyan-400 border-cyan-400 shadow-2xl scale-[1.02]' : 'border-slate-700/80 hover:border-slate-500'}`}
                              >
                                <div className="bg-[#1e293b] px-3 py-1.5 flex items-center justify-between border-b border-slate-700">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isVisualActive && (
                                      <span className="flex items-center gap-1 px-2 py-0.2 rounded bg-cyan-400 text-black font-extrabold text-[9px] shadow animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                                        🔴 VISUAL WALKTHROUGH
                                      </span>
                                    )}
                                    <span className="text-[10px] font-mono font-bold text-slate-400">
                                      {activeScene.diagram ? 'visual-model.txt' : 'source-demo.java'}
                                    </span>
                                  </div>
                                </div>
                                
                                {activeScene.diagram ? (
                                  <div className="p-3.5 text-cyan-300 font-mono text-[10px] overflow-x-auto max-h-[320px] leading-tight">
                                    <pre>{activeScene.diagram}</pre>
                                  </div>
                                ) : (
                                  <div className="p-3.5 text-amber-300 font-mono text-[10px] overflow-x-auto max-h-[320px] leading-tight">
                                    <pre>{activeScene.codeSnippet}</pre>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
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
                          lumixora-boloclass@cluster:~$ <span className="text-white font-bold">{log.cmd}</span>
                        </div>
                        <pre className="text-emerald-300 leading-relaxed whitespace-pre-wrap">{log.output}</pre>
                      </div>
                    ))}
                    <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-emerald-500/20">
                      <span className="text-emerald-400 font-bold">lumixora-boloclass@cluster:~$</span>
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
                    {getSpeakerInfo(currentLectureStep?.speaker || activeSpeaker, activeLesson).avatar}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {getSpeakerInfo(currentLectureStep?.speaker || activeSpeaker, activeLesson).title}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                      <Activity className="w-3 h-3 text-cyan-400 animate-pulse" /> Point {lectureStepIdx + 1}/{currentLectureSteps.length}: {currentLectureStep?.title || 'Explaining'}
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
                  "{currentLectureStep?.text || currentDialogue?.text}"
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevDialogue}
                    disabled={lectureStepIdx === 0 && currentSceneIdx === 0}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    ◀ Prev Point
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
                    disabled={lectureStepIdx >= currentLectureSteps.length - 1 && currentSceneIdx >= activeLesson.scenes.length - 1}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    Next Point ▶
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

            {/* ─── LIVE POP QUIZ CHECKPOINT (MULTI-QUESTION SUITE) ─── */}
            {(() => {
              const quizzes = getSceneQuizzes(activeScene);
              if (quizzes.length === 0) return null;
              const activeQuiz = quizzes[currentQuizIdx] || quizzes[0];
              const activeKey = getQuestionKey(currentSceneIdx, currentQuizIdx);
              const selectedAnswer = quizAnswers[activeKey];
              const isSubmitted = !!submittedQuizzes[activeKey];
              const isCurrentCorrect = selectedAnswer === activeQuiz.correct;

              const answeredCount = quizzes.filter((_, qIdx) => submittedQuizzes[getQuestionKey(currentSceneIdx, qIdx)]).length;
              const correctCount = quizzes.filter((q, qIdx) => {
                const k = getQuestionKey(currentSceneIdx, qIdx);
                return submittedQuizzes[k] && quizAnswers[k] === q.correct;
              }).length;

              return (
                <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#101728] to-purple-950/20 border border-amber-500/30 space-y-4 shadow-xl">
                  {/* Header Bar with Stepper Pills and Score Tracker */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                        <Trophy className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 font-sora">
                          SLIDE {currentSceneIdx + 1} POP QUIZ CHECKPOINT
                        </span>
                        <p className="text-[10px] text-gray-400">
                          Question {currentQuizIdx + 1} of {quizzes.length} • Concept Mastery Check
                        </p>
                      </div>
                    </div>

                    {/* Question Stepper Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 max-w-full overflow-x-auto">
                      {quizzes.map((q, qIdx) => {
                        const qKey = getQuestionKey(currentSceneIdx, qIdx);
                        const qSub = submittedQuizzes[qKey];
                        const qAns = quizAnswers[qKey];
                        const qCorr = qSub && qAns === q.correct;
                        const qIncorr = qSub && qAns !== q.correct;
                        const isActive = currentQuizIdx === qIdx;

                        return (
                          <button
                            key={qIdx}
                            onClick={() => setCurrentQuizIdx(qIdx)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                              isActive 
                                ? 'bg-amber-400 text-black shadow-lg ring-2 ring-amber-300 scale-105' 
                                : qCorr
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : qIncorr
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                            title={`Question ${qIdx + 1}`}
                          >
                            <span>Q{qIdx + 1}</span>
                            {qCorr && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                            {qIncorr && <span className="text-[9px] text-red-400 font-bold">✗</span>}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-400/15 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1 font-bold">
                        <Award className="w-3 h-3 text-amber-400" />
                        {correctCount}/{quizzes.length} Correct (+{correctCount * 15} XP)
                      </span>
                    </div>
                  </div>

                  {/* Active Question Prompt */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-amber-400/90 font-bold">
                      Question {currentQuizIdx + 1} of {quizzes.length}:
                    </span>
                    <p className="text-xs md:text-sm font-bold text-white leading-relaxed">
                      {activeQuiz.question}
                    </p>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-2">
                    {activeQuiz.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswer === oIdx;
                      const isCorrectOpt = oIdx === activeQuiz.correct;

                      let btnStyle = 'bg-black/40 border-white/10 hover:bg-white/5 text-gray-200';
                      if (isSubmitted) {
                        if (isCorrectOpt) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400 font-bold';
                        } else if (isSelected && !isCorrectOpt) {
                          btnStyle = 'bg-red-500/20 border-red-400 text-red-200 ring-1 ring-red-400';
                        } else {
                          btnStyle = 'bg-black/30 border-white/5 text-gray-500 opacity-60';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-purple-600/30 border-purple-400 text-purple-100 ring-2 ring-purple-400 shadow-lg';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(currentQuizIdx, oIdx)}
                          disabled={isSubmitted}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isSelected ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </div>
                          {isSubmitted && isCorrectOpt && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isSubmitted && isSelected && !isCorrectOpt && (
                            <span className="text-xs text-red-400 font-bold shrink-0">✕ Incorrect</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Action Bar: Submit / Navigation / Explanation */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevQuizQuestion}
                        disabled={currentQuizIdx === 0}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        ◀ Prev Q
                      </button>
                      <button
                        onClick={handleNextQuizQuestion}
                        disabled={currentQuizIdx >= quizzes.length - 1}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        Next Q ▶
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isSubmitted ? (
                        <button
                          onClick={() => handleQuizSubmit(currentQuizIdx)}
                          disabled={selectedAnswer === undefined || selectedAnswer === null}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 disabled:opacity-40 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Submit Q{currentQuizIdx + 1} Answer (+15 XP)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRetakeQuiz(currentQuizIdx)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-gray-200 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3 text-amber-400" /> Retake Q{currentQuizIdx + 1}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Conceptual Explanation Box */}
                  {isSubmitted && (
                    <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-fadeIn ${
                      isCurrentCorrect 
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100' 
                        : 'bg-amber-950/30 border-amber-500/30 text-amber-100'
                    }`}>
                      <span className="font-bold flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentCorrect ? 'text-emerald-400' : 'text-amber-400'}`} />
                        Conceptual Explanation & Architectural Rationale:
                      </span>
                      <p className="text-gray-200 leading-relaxed pl-5 text-xs">
                        {activeQuiz.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

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

      {/* ─── VOICE & LANGUAGE STUDIO MODAL ────────────────────────────────────── */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-purple-500/40 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30">
                  🎙️
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-sora">
                    BoloClass Voice & Language Studio
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Select your lecture language, pick custom voices, and adjust pitch sweetness.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVoiceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 1. Language Selection Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <span>🌐</span> Choose Lecture Language:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'en', label: 'English (India)', native: 'English', desc: 'Clear, fluent Indian English delivery', flag: '🇮🇳' },
                  { id: 'te', label: 'Telugu', native: 'తెలుగు', desc: 'అందమైన తెలుగు గొంతుతో పాఠ్య వివరణ', flag: '🇮🇳' },
                  { id: 'hi', label: 'Hindi', native: 'हिन्दी', desc: 'स्पष्ट और मधुर हिंदी में व्याख्या', flag: '🇮🇳' }
                ].map((lang) => {
                  const isSelected = selectedLanguage === lang.id;
                  return (
                    <div
                      key={lang.id}
                      onClick={() => {
                        setSelectedLanguage(lang.id);
                        const { femaleVoice, maleVoice } = findVoicesForLanguage(lang.id, allBrowserVoices);
                        if (femaleVoice) setSelectedFemaleVoiceURI(femaleVoice.voiceURI || femaleVoice.name);
                        if (maleVoice) setSelectedMaleVoiceURI(maleVoice.voiceURI || maleVoice.name);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${isSelected ? 'bg-purple-600/25 border-purple-400 ring-2 ring-purple-400 shadow-lg shadow-purple-500/20' : 'bg-black/40 border-white/10 hover:border-white/20'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{lang.flag}</span>
                        {isSelected && <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-[9px] font-black">ACTIVE</span>}
                      </div>
                      <h4 className="text-xs font-black text-white font-sora">{lang.native}</h4>
                      <p className="text-[10px] text-gray-400 leading-tight">{lang.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Custom Voice Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              
              {/* Professor Voice (Male) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>👨‍🏫</span> Professor Voice (Male):
                  </span>
                  <button
                    onClick={() => handleTestVoice('male', selectedLanguage)}
                    className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[10px] font-bold border border-purple-400/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" /> Test Male
                  </button>
                </div>
                
                <select
                  value={selectedMaleVoiceURI}
                  onChange={(e) => setSelectedMaleVoiceURI(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#030712] border border-white/15 text-xs text-white outline-none focus:border-purple-400"
                >
                  <option value="">-- Automatic Optimal Voice --</option>
                  {allBrowserVoices.map((v, i) => (
                    <option key={v.voiceURI || i} value={v.voiceURI || v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Male Pitch / Warmth:</span>
                    <span className="font-mono text-purple-300">{malePitch.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.02"
                    value={malePitch}
                    onChange={(e) => setMalePitch(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Scholar / Peer Voice */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🎓</span> {scholarDisplayName} / Scholar Voice:
                  </span>
                  <button
                    onClick={() => handleTestVoice('female', selectedLanguage)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" /> Test Voice
                  </button>
                </div>

                <select
                  value={selectedFemaleVoiceURI}
                  onChange={(e) => setSelectedFemaleVoiceURI(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#030712] border border-white/15 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="">-- Automatic Optimal Voice --</option>
                  {allBrowserVoices.map((v, i) => (
                    <option key={v.voiceURI || i} value={v.voiceURI || v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Female Sweetness Pitch:</span>
                    <span className="font-mono text-cyan-300">{femalePitch.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.4"
                    step="0.02"
                    value={femalePitch}
                    onChange={(e) => setFemalePitch(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* 3. Duet Classroom Preview & Save Bar */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleTestFullDuet(selectedLanguage)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-amber-600/20 hover:from-purple-600/30 hover:to-amber-600/30 border border-purple-400/40 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Play Full {selectedLanguage === 'te' ? 'Telugu' : selectedLanguage === 'hi' ? 'Hindi' : 'English'} Duet Preview</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const { femaleVoice, maleVoice } = findVoicesForLanguage(selectedLanguage, allBrowserVoices);
                    if (femaleVoice) setSelectedFemaleVoiceURI(femaleVoice.voiceURI || femaleVoice.name);
                    if (maleVoice) setSelectedMaleVoiceURI(maleVoice.voiceURI || maleVoice.name);
                    setFemalePitch(1.18);
                    setMalePitch(0.98);
                    addToast?.({ type: 'info', message: 'Voices reset to recommended presets' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-bold transition-all cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={() => {
                    setIsVoiceModalOpen(false);
                    addToast?.({
                      type: 'success',
                      message: `✨ Voice settings saved for ${selectedLanguage === 'te' ? 'Telugu (తెలుగు)' : selectedLanguage === 'hi' ? 'Hindi (हिन्दी)' : 'English (India)'}!`
                    });
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
                >
                  Save & Apply Settings
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
