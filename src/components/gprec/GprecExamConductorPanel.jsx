import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, ShieldCheck, Plus, Trash2, Radio, AlertTriangle, CheckCircle2, Download,
  FileText, Send, Lock, Eye, Video, Search, Sparkles, Ban, Users, Code, Cpu,
  RefreshCw, Shuffle, KeyRound
} from 'lucide-react';
import { callAICompletion } from '../../services/aiService';
import { ExamProctorBridge } from '../../services/examProctorService';
import {
  exportAttemptsToCsv,
  openPrintableScorecardPdf
} from './gprecSecureExamBank';

// Rich curated fallback bank so AI MCQ Generator ALWAYS returns high-quality exam questions even offline
const FALLBACK_MCQ_BANK = {
  DSA: [
    { prompt: 'What is the worst-case time complexity of QuickSort when the pivot is always the smallest or largest element?', options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'], correctIndex: 1, topic: 'DSA' },
    { prompt: 'Which traversal of a Binary Search Tree outputs all node keys in non-decreasing sorted order?', options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'], correctIndex: 1, topic: 'DSA' },
    { prompt: 'Which data structure is used internally by Breadth-First Search (BFS) on a graph?', options: ['Stack', 'Priority Queue', 'Queue', 'Disjoint Set'], correctIndex: 2, topic: 'DSA' },
    { prompt: 'What is the space complexity of recursive Depth-First Search on a balanced binary tree of height h?', options: ['O(1)', 'O(h)', 'O(n^2)', 'O(2^h)'], correctIndex: 1, topic: 'DSA' },
    { prompt: 'In a Hash Table using separate chaining with load factor α, what is the average-case lookup complexity?', options: ['O(1 + α)', 'O(log n)', 'O(n)', 'O(α^2)'], correctIndex: 0, topic: 'DSA' }
  ],
  DBMS: [
    { prompt: 'Which isolation level in SQL prevents Dirty Reads and Non-Repeatable Reads, while still potentially allowing Phantom Reads?', options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'], correctIndex: 2, topic: 'DBMS' },
    { prompt: 'Why are B+ Trees preferred over B Trees for database disk indexing?', options: ['Keys are stored only in internal nodes', 'All data pointers reside in linked leaf nodes enabling fast range scans', 'B+ Trees do not require balancing', 'B+ Trees have O(1) worst-case lookup'], correctIndex: 1, topic: 'DBMS' },
    { prompt: 'Which SQL command removes all rows from a table without logging individual row deletions and cannot usually be rolled back?', options: ['DELETE', 'TRUNCATE', 'REMOVE', 'CLEAR'], correctIndex: 1, topic: 'DBMS' },
    { prompt: 'A relation is in Boyce-Codd Normal Form (BCNF) if for every non-trivial functional dependency X → Y:', options: ['Y is a prime attribute', 'X is a superkey', 'X is a foreign key', 'Y is transitively dependent on X'], correctIndex: 1, topic: 'DBMS' },
    { prompt: 'Which property of ACID ensures that committed transaction changes survive a power failure or system crash?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], correctIndex: 3, topic: 'DBMS' }
  ],
  OS: [
    { prompt: 'Which of the following is NOT one of the four Coffman necessary conditions for a deadlock?', options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption', 'Circular Wait'], correctIndex: 2, topic: 'OS' },
    { prompt: 'What phenomenon occurs when a system spends more time swapping pages between RAM and disk than executing instructions?', options: ['Fragmentation', 'Thrashing', 'Starvation', 'Belady Anomaly'], correctIndex: 1, topic: 'OS' },
    { prompt: 'Which page replacement algorithm can exhibit Belady’s Anomaly (more page faults with more frames)?', options: ['LRU', 'Optimal', 'FIFO', 'LFU'], correctIndex: 2, topic: 'OS' },
    { prompt: 'Which component translates virtual memory addresses to physical addresses rapidly using hardware caching?', options: ['ALU', 'TLB (Translation Lookaside Buffer)', 'DMA Controller', 'Interrupt Vector Table'], correctIndex: 1, topic: 'OS' },
    { prompt: 'Threads within the same process share all of the following EXCEPT:', options: ['Heap memory', 'Code section', 'Open file descriptors', 'Thread Stack & Registers'], correctIndex: 3, topic: 'OS' }
  ],
  Aptitude: [
    { prompt: 'A boat travels 24 km upstream in 4 hours and 36 km downstream in 3 hours. What is the speed of the boat in still water?', options: ['8 km/hr', '9 km/hr', '10 km/hr', '11 km/hr'], correctIndex: 1, topic: 'Aptitude' },
    { prompt: 'In how many distinct ways can the letters of the word "LEADER" be arranged?', options: ['180', '360', '720', '120'], correctIndex: 1, topic: 'Aptitude' },
    { prompt: 'The ratio of present ages of A and B is 4:5. After 6 years, the ratio becomes 5:6. What is A’s present age?', options: ['20 years', '24 years', '28 years', '30 years'], correctIndex: 1, topic: 'Aptitude' },
    { prompt: 'What is the compound interest on ₹10,000 at 10% per annum for 2 years compounded annually?', options: ['₹2,000', '₹2,100', '₹2,200', '₹1,950'], correctIndex: 1, topic: 'Aptitude' },
    { prompt: 'If a fair coin is tossed 3 times, what is the probability of getting at least two heads?', options: ['1/4', '3/8', '1/2', '5/8'], correctIndex: 2, topic: 'Aptitude' }
  ],
  Networks: [
    { prompt: 'Which protocol resolves an IPv4 address to its corresponding MAC (physical) address on a local network?', options: ['DNS', 'DHCP', 'ARP', 'ICMP'], correctIndex: 2, topic: 'Networks' },
    { prompt: 'How many usable host IP addresses are available in a /26 IPv4 subnet?', options: ['30', '62', '64', '126'], correctIndex: 1, topic: 'Networks' },
    { prompt: 'Which flags are exchanged during the standard TCP 3-Way Handshake?', options: ['SYN → ACK → FIN', 'SYN → SYN-ACK → ACK', 'ACK → SYN → RST', 'SYN → PSH → ACK'], correctIndex: 1, topic: 'Networks' },
    { prompt: 'Which HTTPS protocol layer provides end-to-end encryption and server authentication?', options: ['IPsec', 'TLS / SSL', 'ARP', 'BGP'], correctIndex: 1, topic: 'Networks' },
    { prompt: 'What is the default port number for HTTPS traffic?', options: ['22', '80', '443', '8080'], correctIndex: 2, topic: 'Networks' }
  ]
};

const FALLBACK_CODING_TEMPLATES = [
  {
    title: 'Valid Palindrome Alphanumeric Check',
    difficulty: 'Easy',
    marks: 15,
    statement: 'Given a string s, return true if it is a palindrome after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, otherwise return false.',
    constraints: ['1 <= s.length <= 2 * 10^5', 'Solve in O(n) time using two pointers.'],
    functionName: 'solve',
    starterCode: {
      javascript: `function solve(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let l = 0, r = clean.length - 1;\n  while (l < r) {\n    if (clean[l++] !== clean[r--]) return false;\n  }\n  return true;\n}`,
      python: `def solve(s):\n    clean = ''.join(ch.lower() for ch in s if ch.isalnum())\n    return clean == clean[::-1]`,
      java: `class Solution {\n    public boolean solve(String s) {\n        String c = s.replaceAll("[^A-Za-z0-9]", "").toLowerCase();\n        return c.equals(new StringBuilder(c).reverse().toString());\n    }\n}`,
      cpp: `#include <string>\n#include <cctype>\nusing namespace std;\nbool solve(string s) {\n    string c;\n    for (char ch : s) if (isalnum(ch)) c.push_back(tolower(ch));\n    int l = 0, r = (int)c.size() - 1;\n    while (l < r) if (c[l++] != c[r--]) return false;\n    return true;\n}`
    },
    visibleTests: [
      { argsText: '["A man, a plan, a canal: Panama"]', expectedText: 'true', label: 'Classic palindrome' },
      { argsText: '["race a car"]', expectedText: 'false', label: 'Non-palindrome' }
    ],
    hiddenTests: [
      { argsText: '[" "]', expectedText: 'true', label: 'Empty after clean' },
      { argsText: '["0P"]', expectedText: 'false', label: 'Alphanumeric mismatch' }
    ]
  },
  {
    title: 'Find Missing Number in Range [0..N]',
    difficulty: 'Easy-Medium',
    marks: 15,
    statement: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
    constraints: ['n == nums.length', '1 <= n <= 10^4', 'Aim for O(n) time and O(1) extra space.'],
    functionName: 'solve',
    starterCode: {
      javascript: `function solve(nums) {\n  const n = nums.length;\n  const expected = (n * (n + 1)) / 2;\n  const actual = nums.reduce((a, b) => a + b, 0);\n  return expected - actual;\n}`,
      python: `def solve(nums):\n    n = len(nums)\n    return n * (n + 1) // 2 - sum(nums)`,
      java: `class Solution {\n    public int solve(int[] nums) {\n        int n = nums.length;\n        int sum = n * (n + 1) / 2;\n        for (int x : nums) sum -= x;\n        return sum;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\nint solve(vector<int>& nums) {\n    int n = nums.size(), sum = n * (n + 1) / 2;\n    for (int x : nums) sum -= x;\n    return sum;\n}`
    },
    visibleTests: [
      { argsText: '[[3, 0, 1]]', expectedText: '2', label: 'nums=[3,0,1]' },
      { argsText: '[[0, 1]]', expectedText: '2', label: 'nums=[0,1]' }
    ],
    hiddenTests: [
      { argsText: '[[9,6,4,2,3,5,7,0,1]]', expectedText: '8', label: 'Range 0..9' },
      { argsText: '[[1]]', expectedText: '0', label: 'Missing zero' }
    ]
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Medium',
    marks: 20,
    statement: 'Given an array prices where prices[i] is the price of a stock on day i, return the maximum profit you can achieve from one buy and one future sell. Return 0 if no profit is possible.',
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4', 'Solve in O(n) single pass.'],
    functionName: 'solve',
    starterCode: {
      javascript: `function solve(prices) {\n  let minPrice = Infinity, best = 0;\n  for (const p of prices) {\n    minPrice = Math.min(minPrice, p);\n    best = Math.max(best, p - minPrice);\n  }\n  return best;\n}`,
      python: `def solve(prices):\n    min_p = float('inf')\n    best = 0\n    for p in prices:\n        min_p = min(min_p, p)\n        best = max(best, p - min_p)\n    return best`,
      java: `class Solution {\n    public int solve(int[] prices) {\n        int minP = Integer.MAX_VALUE, best = 0;\n        for (int p : prices) { minP = Math.min(minP, p); best = Math.max(best, p - minP); }\n        return best;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint solve(vector<int>& prices) {\n    int minP = 1e9, best = 0;\n    for (int p : prices) { minP = min(minP, p); best = max(best, p - minP); }\n    return best;\n}`
    },
    visibleTests: [
      { argsText: '[[7, 1, 5, 3, 6, 4]]', expectedText: '5', label: 'Buy at 1, sell at 6' },
      { argsText: '[[7, 6, 4, 3, 1]]', expectedText: '0', label: 'Monotonic decreasing' }
    ],
    hiddenTests: [
      { argsText: '[[2, 4, 1]]', expectedText: '2', label: 'Early peak' },
      { argsText: '[[1, 2]]', expectedText: '1', label: 'Two days' }
    ]
  }
];

const createBlankCodingProblem = () => ({
  id: `code_custom_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  title: 'Reverse Array In-Place',
  difficulty: 'Medium',
  marks: 15,
  statement: 'Given an array of integers nums, return a new array with elements in reverse order.',
  constraintsText: '1 <= nums.length <= 10^4\nSolve in O(n) time complexity.',
  functionName: 'solve',
  starterCode: {
    javascript: `function solve(nums) {\n  // Write your solution here\n  return [...nums].reverse();\n}`,
    python: `def solve(nums):\n    return nums[::-1]`,
    java: `class Solution {\n    public int[] solve(int[] nums) {\n        int n = nums.length;\n        int[] res = new int[n];\n        for (int i = 0; i < n; i++) res[i] = nums[n - 1 - i];\n        return res;\n    }\n}`,
    cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvector<int> solve(vector<int> nums) {\n    reverse(nums.begin(), nums.end());\n    return nums;\n}`
  },
  visibleTests: [
    { argsText: '[[1, 2, 3, 4]]', expectedText: '[4, 3, 2, 1]', label: 'Sample Case 1' },
    { argsText: '[[10, 20]]', expectedText: '[20, 10]', label: 'Sample Case 2' }
  ],
  hiddenTests: [
    { argsText: '[[7]]', expectedText: '[7]', label: 'Hidden Edge Case 1' },
    { argsText: '[[-1, 0, 5]]', expectedText: '[5, 0, -1]', label: 'Hidden Edge Case 2' }
  ]
});

const safeParseJson = (str, fallback) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

export default function GprecExamConductorPanel({
  exams,
  attempts,
  onPublishExam,
  onDeleteExam,
  addToast
}) {
  const [subTab, setSubTab] = useState('builder'); // 'builder' | 'war_room' | 'results'

  // Exam Builder Core Metadata
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('GPREC Campus Placement Cell');
  const [category, setCategory] = useState('Placement OA');
  const [passcode, setPasscode] = useState(`GPREC${Math.floor(1000 + Math.random() * 9000)}`);
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [negativeMarking, setNegativeMarking] = useState(0.25);
  const [maxViolations, setMaxViolations] = useState(4);
  const [strictness, setStrictness] = useState('Zero-Trust Max');

  // High-Security Lockdown Policy Toggles
  const [requireWebcam, setRequireWebcam] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [singleAttemptOnly, setSingleAttemptOnly] = useState(true);
  const [strictCodingLockdown, setStrictCodingLockdown] = useState(true);

  // AI MCQ Generator State
  const [aiMcqTopic, setAiMcqTopic] = useState('DSA, DBMS & Operating Systems');
  const [aiMcqDifficulty, setAiMcqDifficulty] = useState('Medium');
  const [aiMcqCount, setAiMcqCount] = useState(5);
  const [aiMcqMode, setAiMcqMode] = useState('append'); // 'append' | 'replace'
  const [isGeneratingMcqs, setIsGeneratingMcqs] = useState(false);

  // MCQ List State
  const [mcqList, setMcqList] = useState([
    {
      id: 'c_q1',
      prompt: 'Which data structure uses LIFO (Last-In First-Out) ordering?',
      options: ['Queue', 'Stack', 'Linked List', 'Binary Heap'],
      correctIndex: 1,
      topic: 'DSA'
    }
  ]);

  // Multi-Coding Problems + AI Coding Generator State
  const [includeCoding, setIncludeCoding] = useState(true);
  const [codingProblems, setCodingProblems] = useState(() => [createBlankCodingProblem()]);
  const [aiCodeTopic, setAiCodeTopic] = useState('Arrays & HashMaps');
  const [aiCodeDifficulty, setAiCodeDifficulty] = useState('Medium');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Live Proctor War Room State
  const [liveCandidates, setLiveCandidates] = useState({});
  const warRoomRef = useRef(null);

  // Results Filter State
  const [resultsSearch, setResultsSearch] = useState('');

  useEffect(() => {
    if (subTab !== 'war_room') return;
    try {
      warRoomRef.current = ExamProctorBridge.joinFacultyWarRoom(
        'all',
        (payload) => {
          setLiveCandidates(prev => ({
            ...prev,
            [payload.email]: { ...payload, online: true, lastSeen: Date.now() }
          }));
        },
        (payload) => {
          setLiveCandidates(prev => {
            const copy = { ...prev };
            delete copy[payload.email];
            return copy;
          });
        },
        (payload) => {
          setLiveCandidates(prev => ({
            ...prev,
            [payload.email]: {
              ...(prev[payload.email] || {}),
              ...payload,
              online: true,
              trustScore: prev[payload.email]?.trustScore ?? 100,
              warnings: prev[payload.email]?.warnings ?? 0,
              lastSeen: Date.now()
            }
          }));
        }
      );
    } catch (e) {}

    return () => {
      warRoomRef.current = null;
    };
  }, [subTab]);

  const sendProctorIntervention = (targetEmail, action, message) => {
    try {
      if (warRoomRef.current?.sendIntervention) {
        warRoomRef.current.sendIntervention(targetEmail, action, message);
      }
      if (addToast) {
        addToast({
          message: action === 'terminate'
            ? `Sent FORCE TERMINATE signal to ${targetEmail}`
            : `Sent live warning to ${targetEmail}`,
          type: action === 'terminate' ? 'error' : 'warning'
        });
      }
    } catch (e) {}
  };

  // =========================================================================
  // AI MCQ GENERATOR (Calls Gemini via aiService with smart domain fallback)
  // =========================================================================
  const handleAiGenerateMcqs = async () => {
    if (isGeneratingMcqs) return;
    setIsGeneratingMcqs(true);
    const count = Math.min(15, Math.max(1, Number(aiMcqCount) || 5));
    const topicText = aiMcqTopic.trim() || 'Data Structures, DBMS, OS & Quantitative Aptitude';

    const buildFallbackMcqs = () => {
      const t = topicText.toLowerCase();
      let pool = [];
      if (t.includes('dbms') || t.includes('sql')) pool = pool.concat(FALLBACK_MCQ_BANK.DBMS);
      if (t.includes('os') || t.includes('operat')) pool = pool.concat(FALLBACK_MCQ_BANK.OS);
      if (t.includes('apt') || t.includes('quant') || t.includes('math')) pool = pool.concat(FALLBACK_MCQ_BANK.Aptitude);
      if (t.includes('net') || t.includes('cn') || t.includes('http')) pool = pool.concat(FALLBACK_MCQ_BANK.Networks);
      if (t.includes('dsa') || t.includes('algo') || t.includes('data') || pool.length === 0) {
        pool = pool.concat(FALLBACK_MCQ_BANK.DSA, FALLBACK_MCQ_BANK.DBMS, FALLBACK_MCQ_BANK.OS, FALLBACK_MCQ_BANK.Aptitude, FALLBACK_MCQ_BANK.Networks);
      }
      const unique = [];
      const seen = new Set();
      for (const item of pool) {
        if (!seen.has(item.prompt)) {
          seen.add(item.prompt);
          unique.push(item);
        }
      }
      return unique.slice(0, count).map((q, i) => ({
        id: `ai_mcq_${Date.now()}_${i}`,
        prompt: q.prompt,
        options: [...q.options],
        correctIndex: q.correctIndex,
        topic: q.topic || topicText.slice(0, 24)
      }));
    };

    try {
      const prompt = `Generate exactly ${count} high-quality placement exam multiple-choice questions on topic: "${topicText}" at "${aiMcqDifficulty}" difficulty for engineering campus placements.
Return ONLY a valid JSON array (no markdown fences, no commentary) matching this exact schema:
[
  {
    "prompt": "Clear technical question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 1,
    "topic": "Short Topic Tag"
  }
]`;
      const raw = await callAICompletion({ messages: [{ role: 'user', content: prompt }] });
      let parsed = null;
      if (raw && typeof raw === 'string') {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        const startIdx = cleaned.indexOf('[');
        const endIdx = cleaned.lastIndexOf(']');
        if (startIdx !== -1 && endIdx > startIdx) {
          parsed = JSON.parse(cleaned.slice(startIdx, endIdx + 1));
        }
      }

      let generated = [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        generated = parsed
          .filter(q => q?.prompt && Array.isArray(q.options) && q.options.length === 4)
          .slice(0, count)
          .map((q, idx) => ({
            id: `ai_mcq_${Date.now()}_${idx}`,
            prompt: String(q.prompt).trim(),
            options: q.options.map(o => String(o).trim()),
            correctIndex: Math.min(3, Math.max(0, Number(q.correctIndex) || 0)),
            topic: String(q.topic || topicText.slice(0, 24)).trim()
          }));
      }

      if (generated.length === 0) {
        generated = buildFallbackMcqs();
      }

      setMcqList(prev => (aiMcqMode === 'replace' ? generated : [...prev.filter(q => q.prompt.trim().length > 0), ...generated]));
      if (addToast) {
        addToast({
          message: `Generated ${generated.length} secure ${aiMcqDifficulty} MCQs for "${topicText}"!`,
          type: 'success'
        });
      }
    } catch (err) {
      const fallback = buildFallbackMcqs();
      setMcqList(prev => (aiMcqMode === 'replace' ? fallback : [...prev.filter(q => q.prompt.trim().length > 0), ...fallback]));
      if (addToast) {
        addToast({
          message: `Added ${fallback.length} verified placement MCQs from GPREC Smart Bank!`,
          type: 'success'
        });
      }
    } finally {
      setIsGeneratingMcqs(false);
    }
  };

  // =========================================================================
  // AI CODING PROBLEM GENERATOR (with Visible + Sealed Hidden Test Cases)
  // =========================================================================
  const handleAiGenerateCodingProblem = async () => {
    if (isGeneratingCode) return;
    setIsGeneratingCode(true);
    setIncludeCoding(true);
    const topicText = aiCodeTopic.trim() || 'Arrays & Hashing';

    const pickFallbackProblem = () => {
      const idx = codingProblems.length % FALLBACK_CODING_TEMPLATES.length;
      const tpl = FALLBACK_CODING_TEMPLATES[idx];
      return {
        id: `ai_code_${Date.now()}`,
        title: tpl.title,
        difficulty: tpl.difficulty,
        marks: tpl.marks,
        statement: tpl.statement,
        constraintsText: tpl.constraints.join('\n'),
        functionName: tpl.functionName,
        starterCode: { ...tpl.starterCode },
        visibleTests: tpl.visibleTests.map(t => ({ ...t })),
        hiddenTests: tpl.hiddenTests.map(t => ({ ...t }))
      };
    };

    try {
      const prompt = `Generate 1 placement coding interview problem on topic "${topicText}" at "${aiCodeDifficulty}" difficulty where the solution is a pure JavaScript function named "solve".
Return ONLY a valid JSON object (no markdown fences):
{
  "title": "Short Problem Title",
  "difficulty": "${aiCodeDifficulty}",
  "marks": 15,
  "statement": "Clear problem description with input/output format.",
  "constraints": ["1 <= n <= 10^4", "O(n) time"],
  "javascriptStarter": "function solve(nums) {\\n  // write solution\\n  return 0;\\n}",
  "pythonStarter": "def solve(nums):\\n    return 0",
  "visibleTests": [
    { "args": [[1,2,3]], "expected": 6, "label": "Sample 1" },
    { "args": [[0,5]], "expected": 5, "label": "Sample 2" }
  ],
  "hiddenTests": [
    { "args": [[-1,1]], "expected": 0, "label": "Hidden 1" },
    { "args": [[10,20,30]], "expected": 60, "label": "Hidden 2" }
  ]
}`;
      const raw = await callAICompletion({ messages: [{ role: 'user', content: prompt }] });
      let parsed = null;
      if (raw && typeof raw === 'string') {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        const s = cleaned.indexOf('{');
        const e = cleaned.lastIndexOf('}');
        if (s !== -1 && e > s) {
          parsed = JSON.parse(cleaned.slice(s, e + 1));
        }
      }

      if (parsed?.title && parsed?.statement && Array.isArray(parsed.visibleTests) && parsed.visibleTests.length > 0) {
        const nextProb = {
          id: `ai_code_${Date.now()}`,
          title: String(parsed.title),
          difficulty: String(parsed.difficulty || aiCodeDifficulty),
          marks: Number(parsed.marks) || 15,
          statement: String(parsed.statement),
          constraintsText: Array.isArray(parsed.constraints) ? parsed.constraints.join('\n') : '1 <= n <= 10^4',
          functionName: 'solve',
          starterCode: {
            javascript: parsed.javascriptStarter || `function solve(input) {\n  return input;\n}`,
            python: parsed.pythonStarter || `def solve(input):\n    return input`,
            java: `class Solution {\n    // Implement solve(...)\n}`,
            cpp: `#include <bits/stdc++.h>\nusing namespace std;\n// Implement solve(...)`
          },
          visibleTests: parsed.visibleTests.map((t, i) => ({
            argsText: JSON.stringify(t.args ?? []),
            expectedText: JSON.stringify(t.expected ?? null),
            label: t.label || `Sample ${i + 1}`
          })),
          hiddenTests: (Array.isArray(parsed.hiddenTests) && parsed.hiddenTests.length > 0 ? parsed.hiddenTests : parsed.visibleTests).map((t, i) => ({
            argsText: JSON.stringify(t.args ?? []),
            expectedText: JSON.stringify(t.expected ?? null),
            label: t.label || `Hidden ${i + 1}`
          }))
        };
        setCodingProblems(prev => [...prev, nextProb]);
        if (addToast) addToast({ message: `AI generated coding challenge "${nextProb.title}" with sealed hidden tests!`, type: 'success' });
      } else {
        const fb = pickFallbackProblem();
        setCodingProblems(prev => [...prev, fb]);
        if (addToast) addToast({ message: `Added verified coding challenge "${fb.title}" with hidden tests!`, type: 'success' });
      }
    } catch (err) {
      const fb = pickFallbackProblem();
      setCodingProblems(prev => [...prev, fb]);
      if (addToast) addToast({ message: `Added verified coding challenge "${fb.title}" with hidden tests!`, type: 'success' });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // MCQ mutation helpers
  const addMcqRow = () => {
    setMcqList(prev => [
      ...prev,
      {
        id: `c_q_${Date.now()}`,
        prompt: '',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0,
        topic: 'Technical'
      }
    ]);
  };

  const updateMcq = (id, patch) => {
    setMcqList(prev => prev.map(q => (q.id === id ? { ...q, ...patch } : q)));
  };

  const updateMcqOption = (id, optIdx, val) => {
    setMcqList(prev =>
      prev.map(q => {
        if (q.id !== id) return q;
        const opts = [...q.options];
        opts[optIdx] = val;
        return { ...q, options: opts };
      })
    );
  };

  // Coding Problem mutation helpers
  const addCodingProblem = () => {
    setIncludeCoding(true);
    setCodingProblems(prev => [...prev, createBlankCodingProblem()]);
  };

  const updateCodingProblem = (id, patch) => {
    setCodingProblems(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  };

  const updateCodingTest = (probId, bucket, idx, key, val) => {
    setCodingProblems(prev =>
      prev.map(p => {
        if (p.id !== probId) return p;
        const arr = [...(p[bucket] || [])];
        arr[idx] = { ...arr[idx], [key]: val };
        return { ...p, [bucket]: arr };
      })
    );
  };

  const addCodingTest = (probId, bucket) => {
    setCodingProblems(prev =>
      prev.map(p => {
        if (p.id !== probId) return p;
        const arr = [...(p[bucket] || [])];
        arr.push({
          argsText: '[[1, 2]]',
          expectedText: '[2, 1]',
          label: bucket === 'hiddenTests' ? `Hidden Case ${arr.length + 1}` : `Sample Case ${arr.length + 1}`
        });
        return { ...p, [bucket]: arr };
      })
    );
  };

  const removeCodingTest = (probId, bucket, idx) => {
    setCodingProblems(prev =>
      prev.map(p => {
        if (p.id !== probId) return p;
        return { ...p, [bucket]: (p[bucket] || []).filter((_, i) => i !== idx) };
      })
    );
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      if (addToast) addToast({ message: 'Please enter an Exam Title.', type: 'warning' });
      return;
    }
    const validMcqs = mcqList.filter(q => q.prompt.trim().length > 0);
    const validCoding = includeCoding ? codingProblems.filter(p => p.title.trim().length > 0) : [];

    if (validMcqs.length === 0 && validCoding.length === 0) {
      if (addToast) addToast({ message: 'Add at least 1 MCQ or 1 Coding Problem before publishing.', type: 'warning' });
      return;
    }

    const sections = [];
    if (validMcqs.length > 0) {
      sections.push({
        id: `sec_mcq_${Date.now()}`,
        title: 'Section 1: Proctored Technical & Aptitude MCQs',
        type: 'mcq',
        durationMinutes: Math.max(5, Math.round(Number(durationMinutes) * (validCoding.length > 0 ? 0.5 : 1))),
        marksPerQuestion: 2,
        negativeMarks: Number(negativeMarking) || 0,
        questions: validMcqs
      });
    }
    if (validCoding.length > 0) {
      const compiledProblems = validCoding.map(p => ({
        id: p.id,
        title: p.title.trim(),
        difficulty: p.difficulty || 'Medium',
        marks: Number(p.marks) || 15,
        statement: p.statement.trim(),
        constraints: (p.constraintsText || '').split('\n').map(s => s.trim()).filter(Boolean),
        functionName: (p.functionName || 'solve').trim(),
        starterCode: p.starterCode,
        visibleTests: (p.visibleTests || []).map((t, i) => ({
          args: safeParseJson(t.argsText, []),
          expected: safeParseJson(t.expectedText, null),
          label: t.label || `Sample ${i + 1}`
        })),
        hiddenTests: (p.hiddenTests || []).map((t, i) => ({
          args: safeParseJson(t.argsText, []),
          expected: safeParseJson(t.expectedText, null),
          label: t.label || `Hidden ${i + 1}`
        }))
      }));

      sections.push({
        id: `sec_code_${Date.now()}`,
        title: `Section ${sections.length + 1}: High-Security Proctored Coding (${compiledProblems.length})`,
        type: 'coding',
        durationMinutes: Math.max(10, Math.round(Number(durationMinutes) * (validMcqs.length > 0 ? 0.5 : 1))),
        marksPerQuestion: 15,
        negativeMarks: 0,
        problems: compiledProblems
      });
    }

    const newExam = {
      id: `custom-exam-${Date.now()}`,
      isCustom: true,
      title: title.trim(),
      company: company.trim() || 'GPREC Placement Cell',
      category,
      difficulty: strictness === 'Zero-Trust Max' ? 'Hard' : 'Medium',
      passcode: passcode.trim().toUpperCase() || 'GPREC2026',
      durationMinutes: Number(durationMinutes) || 40,
      negativeMarking: Number(negativeMarking) || 0,
      maxViolations: Number(maxViolations) || 4,
      strictness,
      requireWebcam,
      shuffleQuestions,
      shuffleOptions,
      singleAttemptOnly,
      strictCodingLockdown,
      description: `High-security proctored assessment (${validMcqs.length} MCQs • ${validCoding.length} Coding Challenges) with ${strictness}${shuffleQuestions ? ' • Shuffled' : ''}${singleAttemptOnly ? ' • Single-Attempt' : ''}.`,
      sections
    };

    if (onPublishExam) onPublishExam(newExam);
    setTitle('');
    setPasscode(`GPREC${Math.floor(1000 + Math.random() * 9000)}`);
    if (addToast) addToast({ message: `Published High-Security Exam "${newExam.title}" (Passcode: ${newExam.passcode})!`, type: 'success' });
  };

  const liveList = Object.values(liveCandidates);
  const filteredAttempts = attempts.filter(a => {
    const q = resultsSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      a.examTitle?.toLowerCase().includes(q) ||
      a.studentName?.toLowerCase().includes(q) ||
      a.studentEmail?.toLowerCase().includes(q) ||
      a.receiptHash?.toLowerCase().includes(q)
    );
  });

  const customExams = exams.filter(e => e.isCustom);

  return (
    <div className="flex flex-col gap-5">
      {/* Conductor Sub-Navigation */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 px-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'builder', label: 'Create & Schedule Test', icon: Plus },
            { id: 'war_room', label: `Live Proctor War Room (${liveList.length})`, icon: Radio },
            { id: 'results', label: `Results & Export (${attempts.length})`, icon: FileText }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  subTab === t.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
          Zero-Trust Conductor Console
        </span>
      </div>

      {/* TAB 1: CREATE & SCHEDULE HIGH-SECURITY EXAM */}
      {subTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handlePublish} className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Schedule New High-Security Proctored Assessment</h3>
              <p className="text-xs text-slate-500">Use AI to generate MCQs & Coding Challenges, seal hidden test cases, and enforce Zero-Trust Lockdown.</p>
            </div>

            {/* Core Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Exam Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. GPREC Placement Drive — Infosys SP / TCS Prime Proctored Test"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Drive Tag</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Room Access Passcode</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={passcode}
                    onChange={e => setPasscode(e.target.value.toUpperCase())}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 font-mono font-bold uppercase text-purple-700"
                  />
                  <button
                    type="button"
                    onClick={() => setPasscode(`GPREC${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                  >
                    Gen
                  </button>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Total Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Negative Marking (per wrong MCQ)</label>
                <select
                  value={negativeMarking}
                  onChange={e => setNegativeMarking(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value={0}>None (0)</option>
                  <option value={0.25}>-0.25 Marks</option>
                  <option value={0.5}>-0.50 Marks</option>
                  <option value={1}>-1.00 Marks</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Lockdown Strictness</label>
                <select
                  value={strictness}
                  onChange={e => setStrictness(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Zero-Trust Max">Zero-Trust Max (Fullscreen + AI Vision + Anti-Paste)</option>
                  <option value="Strict Lockdown">Strict Lockdown (Fullscreen + Tab/Blur Guard)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Auto-Terminate Max Strikes</label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={maxViolations}
                  onChange={e => setMaxViolations(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* High-Security Lockdown Policy Matrix */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-3 border border-indigo-900/60">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-extrabold text-xs text-cyan-300 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>High-Security Anti-Cheat Policies</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Zero-Trust Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input type="checkbox" checked={requireWebcam} onChange={e => setRequireWebcam(e.target.checked)} className="w-4 h-4 accent-cyan-400" />
                  <span>Live Webcam + AI Lens Obstruction & Audio Guard</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input type="checkbox" checked={shuffleQuestions} onChange={e => setShuffleQuestions(e.target.checked)} className="w-4 h-4 accent-cyan-400" />
                  <span>Randomize Question Order per Candidate</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input type="checkbox" checked={shuffleOptions} onChange={e => setShuffleOptions(e.target.checked)} className="w-4 h-4 accent-cyan-400" />
                  <span>Randomize MCQ Option Order (Anti-Copying)</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input type="checkbox" checked={singleAttemptOnly} onChange={e => setSingleAttemptOnly(e.target.checked)} className="w-4 h-4 accent-cyan-400" />
                  <span>Strict Single-Attempt Lock per Student</span>
                </label>
                <label className="sm:col-span-2 flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 cursor-pointer">
                  <input type="checkbox" checked={strictCodingLockdown} onChange={e => setStrictCodingLockdown(e.target.checked)} className="w-4 h-4 accent-rose-400" />
                  <span className="text-rose-200 font-semibold">Strict Coding IDE Anti-Paste & Bulk Code-Injection Blocker (Reverts pasted code + logs strike)</span>
                </label>
              </div>
            </div>

            {/* ============================================================= */}
            {/* AI MCQ GENERATOR PANEL                                        */}
            {/* ============================================================= */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50/70 to-white border border-purple-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">AI Placement MCQ Generator</div>
                    <div className="text-[10px] text-slate-500">Auto-generate exam-grade MCQs on any B.Tech or placement syllabus topic</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['DSA & Algorithms', 'DBMS & SQL', 'Operating Systems', 'Quantitative Aptitude', 'Computer Networks'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAiMcqTopic(preset)}
                      className="px-2 py-0.5 rounded-full bg-white hover:bg-purple-100 border border-purple-200 text-[10px] font-bold text-purple-700 cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <input
                  type="text"
                  value={aiMcqTopic}
                  onChange={e => setAiMcqTopic(e.target.value)}
                  placeholder="Enter topic or syllabus (e.g. Dynamic Programming, SQL Normalization, Probability)..."
                  className="sm:col-span-5 p-2.5 rounded-xl border border-purple-200 bg-white text-slate-900 font-medium"
                />
                <select
                  value={aiMcqDifficulty}
                  onChange={e => setAiMcqDifficulty(e.target.value)}
                  className="sm:col-span-2 p-2.5 rounded-xl border border-purple-200 bg-white font-semibold"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="FAANG Elite">FAANG Elite</option>
                </select>
                <select
                  value={aiMcqCount}
                  onChange={e => setAiMcqCount(Number(e.target.value))}
                  className="sm:col-span-2 p-2.5 rounded-xl border border-purple-200 bg-white font-semibold"
                >
                  <option value={3}>3 MCQs</option>
                  <option value={5}>5 MCQs</option>
                  <option value={10}>10 MCQs</option>
                  <option value={15}>15 MCQs</option>
                </select>
                <select
                  value={aiMcqMode}
                  onChange={e => setAiMcqMode(e.target.value)}
                  className="sm:col-span-3 p-2.5 rounded-xl border border-purple-200 bg-white font-semibold"
                >
                  <option value="append">Append to List</option>
                  <option value="replace">Replace Current</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isGeneratingMcqs}
                  onClick={handleAiGenerateMcqs}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {isGeneratingMcqs ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{isGeneratingMcqs ? 'Generating MCQs...' : `Generate ${aiMcqCount} AI MCQs`}</span>
                </button>
              </div>
            </div>

            {/* MCQ List Builder */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">MCQ Questions ({mcqList.length})</span>
                <button
                  type="button"
                  onClick={addMcqRow}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add MCQ Manually
                </button>
              </div>
              {mcqList.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-700">Question #{idx + 1}</span>
                      {q.topic && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          {q.topic}
                        </span>
                      )}
                    </div>
                    {mcqList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setMcqList(prev => prev.filter(x => x.id !== q.id))}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    value={q.prompt}
                    onChange={e => updateMcq(q.id, { prompt: e.target.value })}
                    placeholder="Enter question statement..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-semibold"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`correct_${q.id}`}
                          checked={q.correctIndex === oi}
                          onChange={() => updateMcq(q.id, { correctIndex: oi })}
                          className="accent-emerald-600"
                          title="Mark as correct answer"
                        />
                        <input
                          value={opt}
                          onChange={e => updateMcqOption(q.id, oi, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          className="flex-1 p-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ============================================================= */}
            {/* HIGH-SECURITY MULTI-CODING PROBLEM BUILDER + AI GENERATOR     */}
            {/* ============================================================= */}
            <div className="pt-5 border-t border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCoding}
                    onChange={e => setIncludeCoding(e.target.checked)}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span>Live Proctored Coding Problems ({includeCoding ? codingProblems.length : 0})</span>
                </label>

                <button
                  type="button"
                  onClick={addCodingProblem}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Coding Problem
                </button>
              </div>

              {includeCoding && (
                <>
                  {/* AI Coding Problem Generator Strip */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-2.5">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Code className="w-4 h-4 text-cyan-400" />
                      <span className="font-extrabold text-xs">AI Coding Generator:</span>
                    </div>
                    <input
                      type="text"
                      value={aiCodeTopic}
                      onChange={e => setAiCodeTopic(e.target.value)}
                      placeholder="Topic (e.g. Two Pointers, Sliding Window, Strings, DP)"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400"
                    />
                    <select
                      value={aiCodeDifficulty}
                      onChange={e => setAiCodeDifficulty(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-semibold"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <button
                      type="button"
                      disabled={isGeneratingCode}
                      onClick={handleAiGenerateCodingProblem}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      {isGeneratingCode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{isGeneratingCode ? 'Generating...' : 'AI Generate Problem'}</span>
                    </button>
                  </div>

                  {/* Coding Problems Cards */}
                  <div className="space-y-4">
                    {codingProblems.map((prob, pIdx) => (
                      <div key={prob.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-extrabold text-[10px]">
                              CODING #{pIdx + 1}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Anti-Paste + Hidden Tests Sealed
                            </span>
                          </div>
                          {codingProblems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setCodingProblems(prev => prev.filter(x => x.id !== prob.id))}
                              className="text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Remove coding problem"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                          <input
                            value={prob.title}
                            onChange={e => updateCodingProblem(prob.id, { title: e.target.value })}
                            placeholder="Coding Problem Title *"
                            className="sm:col-span-6 p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                          />
                          <select
                            value={prob.difficulty}
                            onChange={e => updateCodingProblem(prob.id, { difficulty: e.target.value })}
                            className="sm:col-span-3 p-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Easy-Medium">Easy-Medium</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                          <input
                            type="number"
                            min={5}
                            max={50}
                            value={prob.marks}
                            onChange={e => updateCodingProblem(prob.id, { marks: Number(e.target.value) })}
                            placeholder="Marks"
                            className="sm:col-span-3 p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                            title="Marks for this problem"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={prob.statement}
                          onChange={e => updateCodingProblem(prob.id, { statement: e.target.value })}
                          placeholder="Full problem statement, input format, and expected return value..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Constraints (one per line)</label>
                            <textarea
                              rows={2}
                              value={prob.constraintsText}
                              onChange={e => updateCodingProblem(prob.id, { constraintsText: e.target.value })}
                              className="w-full p-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">JS Sandbox Starter Code (fn: solve)</label>
                            <textarea
                              rows={2}
                              value={prob.starterCode?.javascript || ''}
                              onChange={e => updateCodingProblem(prob.id, { starterCode: { ...prob.starterCode, javascript: e.target.value } })}
                              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-950 text-cyan-300 font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Visible & Hidden Sealed Test Cases */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {/* Visible Sample Tests */}
                          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-extrabold text-slate-800">Visible Sample Tests ({(prob.visibleTests || []).length})</span>
                              <button
                                type="button"
                                onClick={() => addCodingTest(prob.id, 'visibleTests')}
                                className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                              >
                                + Add Case
                              </button>
                            </div>
                            {(prob.visibleTests || []).map((tc, ti) => (
                              <div key={ti} className="grid grid-cols-11 gap-1 items-center">
                                <input
                                  value={tc.argsText}
                                  onChange={e => updateCodingTest(prob.id, 'visibleTests', ti, 'argsText', e.target.value)}
                                  placeholder="Args JSON e.g. [[1,2]]"
                                  className="col-span-5 p-1.5 rounded-lg border border-slate-200 font-mono text-[10px]"
                                />
                                <input
                                  value={tc.expectedText}
                                  onChange={e => updateCodingTest(prob.id, 'visibleTests', ti, 'expectedText', e.target.value)}
                                  placeholder="Expected JSON"
                                  className="col-span-5 p-1.5 rounded-lg border border-slate-200 font-mono text-[10px]"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeCodingTest(prob.id, 'visibleTests', ti)}
                                  className="col-span-1 text-slate-400 hover:text-rose-500 flex justify-center cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Sealed Hidden Evaluator Tests */}
                          <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-extrabold text-rose-900 flex items-center gap-1">
                                <Lock className="w-3 h-3 text-rose-600" />
                                <span>Sealed Hidden Tests ({(prob.hiddenTests || []).length})</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => addCodingTest(prob.id, 'hiddenTests')}
                                className="text-[10px] font-bold text-rose-700 hover:underline cursor-pointer"
                              >
                                + Add Hidden
                              </button>
                            </div>
                            {(prob.hiddenTests || []).map((tc, ti) => (
                              <div key={ti} className="grid grid-cols-11 gap-1 items-center">
                                <input
                                  value={tc.argsText}
                                  onChange={e => updateCodingTest(prob.id, 'hiddenTests', ti, 'argsText', e.target.value)}
                                  placeholder="Args JSON"
                                  className="col-span-5 p-1.5 rounded-lg border border-rose-200 bg-white font-mono text-[10px]"
                                />
                                <input
                                  value={tc.expectedText}
                                  onChange={e => updateCodingTest(prob.id, 'hiddenTests', ti, 'expectedText', e.target.value)}
                                  placeholder="Expected JSON"
                                  className="col-span-5 p-1.5 rounded-lg border border-rose-200 bg-white font-mono text-[10px]"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeCodingTest(prob.id, 'hiddenTests', ti)}
                                  className="col-span-1 text-slate-400 hover:text-rose-600 flex justify-center cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#9333ea] hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Publish High-Security Exam to GPREC Exam Hall</span>
            </button>
          </form>

          {/* Right: Published Custom Exams List */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4 h-fit">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Custom Scheduled Exams ({customExams.length})</h4>
              <p className="text-[11px] text-slate-500">Share the room passcode with students to unlock.</p>
            </div>
            {customExams.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No custom exams published yet. Use the AI MCQ & Coding builder on the left to publish one live.
              </div>
            ) : (
              <div className="space-y-3">
                {customExams.map(ex => (
                  <div key={ex.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-extrabold text-slate-900">{ex.title}</div>
                      <button
                        type="button"
                        onClick={() => onDeleteExam && onDeleteExam(ex.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete custom exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        Code: {ex.passcode}
                      </span>
                      <span className="text-slate-500">{ex.durationMinutes} min • -{ex.negativeMarking}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {ex.shuffleQuestions && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">Shuffled</span>}
                      {ex.singleAttemptOnly && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">1-Attempt Lock</span>}
                      {ex.strictCodingLockdown && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300">Anti-Paste IDE</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE PROCTOR WAR ROOM */}
      {subTab === 'war_room' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Realtime Supabase Proctor Channel Connected</span>
              </div>
              <h3 className="text-lg font-extrabold mt-0.5">Live Proctor War Room</h3>
              <p className="text-xs text-slate-400">Monitor active student webcam feeds, AI camera obstruction alerts, audio spikes, trust scores, and send live interventions.</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{liveList.length} Active Candidate(s)</span>
            </div>
          </div>

          {liveList.length === 0 ? (
            <div className="py-12 px-4 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-2">
              <Eye className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No candidates currently inside an active exam session</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Open a second browser tab on gprec.lumixora.in and start any Secure Exam to watch live webcam frames, Trust Scores, and remote interventions appear here in real time!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveList.map(c => (
                <div key={c.email} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-white">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.roll} • {c.department}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      (c.trustScore ?? 100) >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {c.trustScore ?? 100}%
                    </span>
                  </div>
                  <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                    {c.frame ? (
                      <img src={c.frame} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] text-slate-500">Telemetry Stream Active (No Frame)</span>
                    )}
                    {c.faceStatus && c.faceStatus !== 'verified' && c.faceStatus !== 'centered' && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-extrabold uppercase">
                        {c.faceStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Strikes: <strong className="text-rose-400">{c.warnings || 0}</strong></span>
                    <span>Audio: <strong className="text-cyan-300">{c.audioDb || 0} dB</strong></span>
                    <span>Q: {c.currentQuestion || 1}/{c.totalQuestions || '-'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => sendProctorIntervention(c.email, 'warn', 'Proctor Warning: Please stay centered and do not switch windows.')}
                      className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer"
                    >
                      Send Warning
                    </button>
                    <button
                      type="button"
                      onClick={() => sendProctorIntervention(c.email, 'terminate', 'Exam terminated by proctor.')}
                      className="py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Ban className="w-3 h-3" /> Terminate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESULTS ANALYTICS & CSV/PDF EXPORT */}
      {subTab === 'results' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Proctored Assessment Results & Integrity Ledger</h3>
              <p className="text-xs text-slate-500">Tamper-evident scorecards with Trust Scores and violation counts.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={resultsSearch}
                  onChange={e => setResultsSearch(e.target.value)}
                  placeholder="Search student or hash..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <button
                type="button"
                disabled={attempts.length === 0}
                onClick={() => {
                  exportAttemptsToCsv(filteredAttempts);
                  if (addToast) addToast({ message: 'Exported GPREC Secure Exam Results CSV!', type: 'success' });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {filteredAttempts.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No exam submissions recorded yet. Complete any exam from the Exam Hall to see graded analytics here.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Candidate & Hash</th>
                    <th className="p-3">Assessment</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Trust Score</th>
                    <th className="p-3">Integrity</th>
                    <th className="p-3 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttempts.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/70">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{a.studentName}</div>
                        <div className="font-mono text-[10px] text-indigo-600">{a.receiptHash}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{a.examTitle}</div>
                        <div className="text-[10px] text-slate-400">{a.submittedAt}</div>
                      </td>
                      <td className="p-3 font-extrabold text-slate-900">
                        {a.earnedMarks}/{a.totalMarks} ({a.percentage}%)
                      </td>
                      <td className="p-3">
                        <span className={`font-black ${a.trustScore >= 80 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {a.trustScore}%
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">({a.violationCount} alerts)</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.integrityVerdict.includes('Clean')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : a.integrityVerdict.includes('Minor')
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {a.integrityVerdict}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => openPrintableScorecardPdf(a)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 font-bold text-[11px] text-slate-700 cursor-pointer"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
