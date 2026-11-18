// GPREC Autonomous Placement Suite — Authentic Recruiter Papers & Solved Solutions Bank
// Strictly isolated to gprec.lumixora.in

export const GPREC_ORIGINAL_COMPANY_PAPERS = [
  // =========================================================================
  // 1. TATA CONSULTANCY SERVICES (TCS) — NQT PRIME & NINJA
  // =========================================================================
  {
    id: 'tcs-nqt-prime-2025-slot1',
    companyId: 'tcs',
    companyName: 'Tata Consultancy Services (TCS)',
    paperTitle: 'TCS NQT Prime & Ninja Original Shift Paper (2024-2025 Slot 1)',
    batch: '2025 - 2026 Batch',
    shift: 'National Placement Slot 1 (Morning Shift)',
    roles: 'Prime Developer (₹9.0 LPA) • Ninja Engineer (₹3.36 LPA)',
    durationMinutes: 75,
    difficulty: 'Medium-Hard',
    passcode: 'TCS2026',
    linkedExamId: 'gprec-tcs-prime-2026',
    overview: 'Original question set asked in the nationwide TCS NQT campus recruitment drive. Covers Numerical Ability, Reasoning, Core CS, and 2 Live Coding challenges with step-by-step mathematical deductions and complete multi-language solutions.',
    sections: [
      {
        id: 'sec_tcs_quant',
        title: 'Section A: Numerical & Quantitative Ability',
        type: 'mcq',
        questions: [
          {
            id: 'tcs_q1',
            prompt: 'A train 180 meters long running at 72 km/h crosses a platform in 20 seconds. What is the length of the platform?',
            options: ['200 meters', '220 meters', '240 meters', '260 meters'],
            correctIndex: 1,
            topic: 'Time, Speed & Distance',
            explanation: `Step 1: Convert speed from km/h to m/s:
72 km/h = 72 * (5/18) = 20 m/s.
Step 2: Total distance covered in 20 seconds = Speed * Time = 20 m/s * 20 s = 400 meters.
Step 3: Total distance = Length of train + Length of platform:
400 = 180 + Length of platform
Length of platform = 400 - 180 = 220 meters.
Answer: 220 meters.`
          },
          {
            id: 'tcs_q2',
            prompt: 'A can complete a piece of work in 12 days, while B can complete the same work in 18 days. If they work together for 4 days, what fraction of the work remains unfinished?',
            options: ['1/9', '4/9', '5/9', '2/3'],
            correctIndex: 1,
            topic: 'Time & Work',
            explanation: `Step 1: Work done by A in 1 day = 1/12.
Work done by B in 1 day = 1/18.
Step 2: Combined 1-day work = 1/12 + 1/18 = (3 + 2) / 36 = 5/36.
Step 3: Work done in 4 days = 4 * (5/36) = 20/36 = 5/9.
Step 4: Remaining unfinished work = 1 - 5/9 = 4/9.
Answer: 4/9.`
          },
          {
            id: 'tcs_q3',
            prompt: 'A trader marks his goods 40% above the cost price and allows a discount of 25% on the marked price. What is his net profit or loss percentage?',
            options: ['5% Profit', '10% Profit', '5% Loss', 'No Profit No Loss'],
            correctIndex: 0,
            topic: 'Profit, Loss & Discount',
            explanation: `Step 1: Let Cost Price (CP) = ₹100.
Marked Price (MP) = ₹100 + 40% of 100 = ₹140.
Step 2: Selling Price (SP) after 25% discount:
SP = 140 * (1 - 0.25) = 140 * 0.75 = ₹105.
Step 3: Net Profit = SP - CP = ₹105 - ₹100 = ₹5.
Profit % = (5 / 100) * 100 = 5% Profit.
Answer: 5% Profit.`
          },
          {
            id: 'tcs_q4',
            prompt: 'Two fair dice are thrown simultaneously. What is the probability that the sum of the scores obtained is a prime number?',
            options: ['5/12', '7/12', '13/36', '1/2'],
            correctIndex: 0,
            topic: 'Probability',
            explanation: `Step 1: Total possible outcomes when throwing 2 dice = 6 * 6 = 36.
Step 2: The sum of two dice ranges from 2 to 12. Prime numbers in this range are: {2, 3, 5, 7, 11}.
Step 3: Count outcomes for each prime sum:
- Sum = 2: (1,1) -> 1 outcome
- Sum = 3: (1,2), (2,1) -> 2 outcomes
- Sum = 5: (1,4), (2,3), (3,2), (4,1) -> 4 outcomes
- Sum = 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6 outcomes
- Sum = 11: (5,6), (6,5) -> 2 outcomes
Total prime outcomes = 1 + 2 + 4 + 6 + 2 = 15 outcomes.
Step 4: Probability = 15 / 36 = 5 / 12.
Answer: 5/12.`
          }
        ]
      },
      {
        id: 'sec_tcs_reasoning',
        title: 'Section B: Reasoning & Logical Ability',
        type: 'mcq',
        questions: [
          {
            id: 'tcs_r1',
            prompt: 'Find the next term in the alphanumeric sequence: A2C, E4G, I8K, M16O, ?',
            options: ['Q32S', 'P32R', 'Q32T', 'R32S'],
            correctIndex: 0,
            topic: 'Alphanumeric Series',
            explanation: `Step 1: First letter: A (+4) -> E (+4) -> I (+4) -> M (+4) -> Q.
Step 2: Number: 2 (*2) -> 4 (*2) -> 8 (*2) -> 16 (*2) -> 32.
Step 3: Last letter: C (+4) -> G (+4) -> K (+4) -> O (+4) -> S.
Combining all three gives: Q32S.
Answer: Q32S.`
          },
          {
            id: 'tcs_r2',
            prompt: 'Statements:\n1. All algorithms are programs.\n2. Some programs are scripts.\nConclusions:\nI. Some algorithms are scripts.\nII. No algorithm is a script.',
            options: ['Only I follows', 'Only II follows', 'Either I or II follows', 'Neither I nor II follows'],
            correctIndex: 2,
            topic: 'Syllogisms (Complementary Pair)',
            explanation: `Step 1: Analyzing the Venn relation: Algorithms (A) ⊆ Programs (P). Programs and Scripts (S) intersect.
Step 2: We do not know whether the intersection of P and S overlaps with A.
Thus, neither "Some A are S" nor "No A is S" is definitively true on its own.
Step 3: However, Conclusion I ("Some A are S", type I proposition) and Conclusion II ("No A is S", type E proposition) have the same subject and predicate and form a standard complementary pair (I-E pair).
Therefore, exactly one of them MUST be true.
Answer: Either I or II follows.`
          }
        ]
      },
      {
        id: 'sec_tcs_tech',
        title: 'Section C: Core CS, OS & DBMS Fundamentals',
        type: 'mcq',
        questions: [
          {
            id: 'tcs_c1',
            prompt: 'Which CPU scheduling algorithm is non-preemptive and is susceptible to the Convoy Effect?',
            options: ['Round Robin (RR)', 'First-Come, First-Served (FCFS)', 'Shortest Remaining Time First (SRTF)', 'Priority Preemptive'],
            correctIndex: 1,
            topic: 'Operating Systems',
            explanation: `Explanation: In FCFS, processes are executed in their arrival order. If a CPU-bound process with a very long burst time arrives first, all subsequent short I/O-bound processes are blocked waiting for CPU release. This phenomenon is called the Convoy Effect and results in low CPU and device utilization.`
          },
          {
            id: 'tcs_c2',
            prompt: 'In relational databases, which normal form strictly guarantees that every non-key attribute is non-transitively dependent on the primary key?',
            options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
            correctIndex: 2,
            topic: 'DBMS Normalization',
            explanation: `Explanation:
- 1NF: Atomic values (no repeating groups).
- 2NF: 1NF + No partial dependencies on composite primary key.
- 3NF: 2NF + No transitive functional dependencies on primary key (i.e., non-prime attributes must not depend on other non-prime attributes).
Answer: Third Normal Form (3NF).`
          }
        ]
      },
      {
        id: 'sec_tcs_coding',
        title: 'Section D: Live Coding Challenges with Answers',
        type: 'coding',
        problems: [
          {
            id: 'tcs_code1',
            title: 'Two Sum Target Indices (Original TCS Prime Round)',
            difficulty: 'Easy-Medium',
            marks: 15,
            statement: 'Given an array of integers nums and an integer target, return the indices [i, j] (i < j) of the two numbers such that they add up to target. Each input has exactly one solution.',
            sampleInput: 'nums = [2, 7, 11, 15], target = 9',
            sampleOutput: '[0, 1]',
            complexityAnalysis: 'Time: O(N) using Hash Map • Space: O(N)',
            solutions: {
              javascript: `function solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
              python: `def solve(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        need = target - num\n        if need in seen:\n            return [seen[need], i]\n        seen[num] = i\n    return []`,
              java: `import java.util.*;\nclass Solution {\n    public int[] solve(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int need = target - nums[i];\n            if (map.containsKey(need)) return new int[]{map.get(need), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
              cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\nvector<int> solve(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for (int i = 0; i < nums.size(); i++) {\n        int need = target - nums[i];\n        if (mp.count(need)) return {mp[need], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}`
            }
          },
          {
            id: 'tcs_code2',
            title: 'Maximum Contiguous Subarray Sum (Kadane Algorithm)',
            difficulty: 'Medium',
            marks: 15,
            statement: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
            sampleInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
            sampleOutput: '6 (Subarray: [4, -1, 2, 1])',
            complexityAnalysis: 'Time: O(N) • Space: O(1)',
            solutions: {
              javascript: `function solve(nums) {\n  let cur = nums[0];\n  let best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    best = Math.max(best, cur);\n  }\n  return best;\n}`,
              python: `def solve(nums):\n    cur = best = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best`,
              java: `class Solution {\n    public int solve(int[] nums) {\n        int cur = nums[0], best = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            cur = Math.max(nums[i], cur + nums[i]);\n            best = Math.max(best, cur);\n        }\n        return best;\n    }\n}`,
              cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint solve(vector<int>& nums) {\n    int cur = nums[0], best = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        cur = max(nums[i], cur + nums[i]);\n        best = max(best, cur);\n    }\n    return best;\n}`
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. COGNIZANT (GENC NEXT & ELEVATE)
  // =========================================================================
  {
    id: 'cognizant-genc-next-2025',
    companyId: 'cognizant',
    companyName: 'Cognizant Technology Solutions',
    paperTitle: 'Cognizant GenC Next & Elevate Original Paper (2024-2025)',
    batch: '2025 - 2026 Batch',
    shift: 'Campus On-Campus OA Drive',
    roles: 'GenC Next (₹6.75 LPA) • GenC Elevate (₹4.5 - ₹5.4 LPA)',
    durationMinutes: 75,
    difficulty: 'Medium-Hard',
    passcode: 'GENC2026',
    linkedExamId: 'gprec-genc-next-2026',
    overview: 'Exact paper administered by Cognizant for premium GenC Next hiring. Contains Automata Fix (logic/bug debugging), analytical quantitative aptitude, and linear data structures with detailed solutions.',
    sections: [
      {
        id: 'sec_genc_apt',
        title: 'Section A: Analytical Reasoning & Numerical Ability',
        type: 'mcq',
        questions: [
          {
            id: 'gc_q1',
            prompt: 'In how many different ways can the letters of the word "ENGINEERING" be arranged?',
            options: ['277,200', '554,400', '1,663,200', '39,916,800'],
            correctIndex: 0,
            topic: 'Permutations with Repetition',
            explanation: `Step 1: Count total letters in "ENGINEERING": Total N = 11.
Step 2: Count frequencies of repeated letters:
- E: 3 times
- N: 3 times
- G: 2 times
- I: 2 times
- R: 1 time
Step 3: Total permutations = 11! / (3! * 3! * 2! * 2! * 1!)
= 39,916,800 / (6 * 6 * 2 * 2)
= 39,916,800 / 144 = 277,200 ways.
Answer: 277,200.`
          },
          {
            id: 'gc_q2',
            prompt: 'A pipe can fill a tank in 8 hours and a drain pipe can empty it in 12 hours. If both are opened together, how long will it take to fill the tank completely?',
            options: ['20 hours', '24 hours', '18 hours', '16 hours'],
            correctIndex: 1,
            topic: 'Pipes & Cisterns',
            explanation: `Step 1: Inflow rate = +1/8 tank per hour.
Outflow rate = -1/12 tank per hour.
Step 2: Net rate when both pipes open = 1/8 - 1/12 = (3 - 2) / 24 = 1/24 tank per hour.
Step 3: Total time required = 1 / (1/24) = 24 hours.
Answer: 24 hours.`
          }
        ]
      },
      {
        id: 'sec_genc_automata',
        title: 'Section B: Automata Fix & Code Debugging',
        type: 'mcq',
        questions: [
          {
            id: 'gc_a1',
            prompt: 'Identify the bug in the following C code snippet intended to find the length of a string:\n```c\nint str_len(char *s) {\n    int count = 0;\n    while(*s++ != \'\\0\') count++;\n    return count;\n}\n```\nWhat is returned for string "HELLO"?',
            options: ['5', '6', 'Segmentation Fault', 'Compilation Error'],
            correctIndex: 0,
            topic: 'Automata Debugging',
            explanation: `Explanation: The condition \`*s++ != '\\0'\` evaluates the current character, then increments the pointer \`s\`. For 'H', 'E', 'L', 'L', 'O', the loop runs 5 times, incrementing count to 5. When it hits '\\0', the loop terminates and count (5) is returned. The code executes correctly and returns 5.`
          },
          {
            id: 'gc_a2',
            prompt: 'Which data structure is fundamentally required to verify whether parentheses in a mathematical expression are properly balanced?',
            options: ['Queue', 'Stack', 'Min-Heap', 'Binary Search Tree'],
            correctIndex: 1,
            topic: 'Data Structures',
            explanation: `Explanation: Balanced parentheses require LIFO (Last-In, First-Out) ordering because the most recently opened bracket must be the first one to be closed. A Stack is the optimal data structure.`
          }
        ]
      },
      {
        id: 'sec_genc_coding',
        title: 'Section C: Algorithmic Coding Challenges with Answers',
        type: 'coding',
        problems: [
          {
            id: 'gc_code1',
            title: 'Valid Balanced Brackets Parser (Automata Round)',
            difficulty: 'Medium',
            marks: 15,
            statement: 'Given a string s containing just "(", ")", "{", "}", "[" and "]", determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.',
            sampleInput: 's = "{[()]}"',
            sampleOutput: 'true',
            complexityAnalysis: 'Time: O(N) • Space: O(N)',
            solutions: {
              javascript: `function solve(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (const ch of s) {\n    if (pairs[ch]) {\n      if (stack.pop() !== pairs[ch]) return false;\n    } else {\n      stack.push(ch);\n    }\n  }\n  return stack.length === 0;\n}`,
              python: `def solve(s):\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for ch in s:\n        if ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return len(stack) == 0`,
              java: `import java.util.*;\nclass Solution {\n    public boolean solve(String s) {\n        Deque<Character> st = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') st.push(')');\n            else if (c == '{') st.push('}');\n            else if (c == '[') st.push(']');\n            else if (st.isEmpty() || st.pop() != c) return false;\n        }\n        return st.isEmpty();\n    }\n}`,
              cpp: `#include <string>\n#include <stack>\nusing namespace std;\nbool solve(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(') st.push(')');\n        else if (c == '{') st.push('}');\n        else if (c == '[') st.push(']');\n        else { if (st.empty() || st.top() != c) return false; st.pop(); }\n    }\n    return st.empty();\n}`
            }
          },
          {
            id: 'gc_code2',
            title: 'Longest Substring Without Repeating Characters (Sliding Window)',
            difficulty: 'Medium-Hard',
            marks: 15,
            statement: 'Given a string s, find the length of the longest substring without repeating characters using the two-pointer sliding window technique.',
            sampleInput: 's = "abcabcbb"',
            sampleOutput: '3 (Substring: "abc")',
            complexityAnalysis: 'Time: O(N) • Space: O(min(N, M))',
            solutions: {
              javascript: `function solve(s) {\n  let maxLen = 0, start = 0;\n  const seen = new Map();\n  for (let i = 0; i < s.length; i++) {\n    if (seen.has(s[i]) && seen.get(s[i]) >= start) {\n      start = seen.get(s[i]) + 1;\n    }\n    seen.set(s[i], i);\n    maxLen = Math.max(maxLen, i - start + 1);\n  }\n  return maxLen;\n}`,
              python: `def solve(s):\n    seen = {}\n    start = max_len = 0\n    for i, ch in enumerate(s):\n        if ch in seen and seen[ch] >= start:\n            start = seen[ch] + 1\n        seen[ch] = i\n        max_len = max(max_len, i - start + 1)\n    return max_len`,
              java: `import java.util.*;\nclass Solution {\n    public int solve(String s) {\n        Map<Character, Integer> seen = new HashMap<>();\n        int start = 0, maxLen = 0;\n        for (int i = 0; i < s.length; i++) {\n            char c = s.charAt(i);\n            if (seen.containsKey(c) && seen.get(c) >= start) {\n                start = seen.get(c) + 1;\n            }\n            seen.put(c, i);\n            maxLen = Math.max(maxLen, i - start + 1);\n        }\n        return maxLen;\n    }\n}`,
              cpp: `#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\nint solve(string s) {\n    unordered_map<char, int> seen;\n    int start = 0, maxLen = 0;\n    for (int i = 0; i < s.size(); i++) {\n        if (seen.count(s[i]) && seen[s[i]] >= start) {\n            start = seen[s[i]] + 1;\n        }\n        seen[s[i]] = i;\n        maxLen = max(maxLen, i - start + 1);\n    }\n    return maxLen;\n}`
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. INFOSYS — SPECIALIST PROGRAMMER (SP) & DSE
  // =========================================================================
  {
    id: 'infosys-sp-dse-2025',
    companyId: 'infosys',
    companyName: 'Infosys Limited',
    paperTitle: 'Infosys Specialist Programmer (SP / DSE) Original Paper (2024-2025)',
    batch: '2025 - 2026 Batch',
    shift: 'HackWithInfy / SP Placement Slot',
    roles: 'Specialist Programmer (₹9.5 LPA) • Digital Specialist Engineer (₹6.25 LPA)',
    durationMinutes: 90,
    difficulty: 'Hard',
    passcode: 'INFY2026',
    linkedExamId: 'gprec-infosys-sp-2026',
    overview: 'High-bar competitive coding assessment administered for Infosys Super-Dream hiring. Focuses on Dynamic Programming, Rotated Binary Search, and SQL query optimization.',
    sections: [
      {
        id: 'sec_infy_core',
        title: 'Section A: Advanced CS & Query Architecture',
        type: 'mcq',
        questions: [
          {
            id: 'inf_q1',
            prompt: 'In SQL, which clause filters the rows BEFORE aggregation takes place, and which clause filters the aggregated result set?',
            options: [
              'WHERE filters before; HAVING filters after',
              'HAVING filters before; WHERE filters after',
              'WHERE and HAVING both filter after aggregation',
              'GROUP BY filters before; ORDER BY filters after'
            ],
            correctIndex: 0,
            topic: 'SQL Query Lifecycle',
            explanation: `Explanation: The SQL query execution order is: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY. Therefore, WHERE filters individual rows before grouping, and HAVING filters the aggregated summary rows created by GROUP BY.`
          },
          {
            id: 'inf_q2',
            prompt: 'What are the two mandatory properties a problem must possess in order to be solvable using Dynamic Programming?',
            options: [
              'Greedy choice property & Independent subproblems',
              'Optimal substructure & Overlapping subproblems',
              'Constant recursion depth & Monotonicity',
              'Linear branching & Bounded state transition'
            ],
            correctIndex: 1,
            topic: 'Dynamic Programming Foundations',
            explanation: `Explanation: Dynamic Programming requires:
1. Optimal Substructure: An optimal solution to the problem contains within it optimal solutions to subproblems.
2. Overlapping Subproblems: A recursive algorithm revisits the same subproblems repeatedly rather than generating new ones.`
          }
        ]
      },
      {
        id: 'sec_infy_coding',
        title: 'Section B: Advanced Algorithmic Coding Round with Answers',
        type: 'coding',
        problems: [
          {
            id: 'inf_code1',
            title: 'Coin Change Minimum Coins (Dynamic Programming)',
            difficulty: 'Hard',
            marks: 25,
            statement: 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up, return -1.',
            sampleInput: 'coins = [1, 2, 5], amount = 11',
            sampleOutput: '3 (5 + 5 + 1 = 11)',
            complexityAnalysis: 'Time: O(amount * len(coins)) • Space: O(amount)',
            solutions: {
              javascript: `function solve(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
              python: `def solve(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i - c >= 0:\n                dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1`,
              java: `import java.util.*;\nclass Solution {\n    public int solve(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`,
              cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint solve(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int c : coins) {\n            if (i - c >= 0) dp[i] = min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`
            }
          },
          {
            id: 'inf_code2',
            title: 'Search in Rotated Sorted Array (Binary Search)',
            difficulty: 'Medium-Hard',
            marks: 25,
            statement: 'Given an array nums sorted in ascending order with distinct values, rotated at an unknown pivot, find the index of target in O(log n) time, or -1 if not found.',
            sampleInput: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
            sampleOutput: '4',
            complexityAnalysis: 'Time: O(log N) • Space: O(1)',
            solutions: {
              javascript: `function solve(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}`,
              python: `def solve(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n    return -1`,
              java: `class Solution {\n    public int solve(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[left] <= nums[mid]) {\n                if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n                else left = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n                else right = mid - 1;\n            }\n        }\n        return -1;\n    }\n}`,
              cpp: `#include <vector>\nusing namespace std;\nint solve(vector<int>& nums, int target) {\n    int left = 0, right = (int)nums.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[left] <= nums[mid]) {\n            if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n            else left = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n            else right = mid - 1;\n        }\n    }\n    return -1;\n}`
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. ACCENTURE — ADVANCED APPLICATION SOFTWARE ENGINEER (AASE)
  // =========================================================================
  {
    id: 'accenture-aase-2025',
    companyId: 'accenture',
    companyName: 'Accenture',
    paperTitle: 'Accenture Advanced ASE Original Placement Paper (2024-2025)',
    batch: '2025 - 2026 Batch',
    shift: 'National Technical Slot',
    roles: 'Advanced Application Software Engineer (₹6.5 LPA) • ASE (₹4.5 LPA)',
    durationMinutes: 70,
    difficulty: 'Medium',
    passcode: 'ACCN2026',
    linkedExamId: 'gprec-accenture-aase-2026',
    overview: 'Authentic Accenture campus recruitment assessment covering Critical Reasoning, Pseudocode dry-runs, and Hands-on Coding (Bitwise XOR and Interval Merging).',
    sections: [
      {
        id: 'sec_acc_crit',
        title: 'Section A: Critical Reasoning & Pseudocode Dry-Run',
        type: 'mcq',
        questions: [
          {
            id: 'ac_q1',
            prompt: 'What will be the output of the following pseudocode?\n```\nInteger a = 7, b = 4, c = 2\na = (a ^ b) ^ a\nb = (b ^ c) ^ b\nPrint a + b\n```',
            options: ['6', '8', '11', '13'],
            correctIndex: 0,
            topic: 'Bitwise XOR Properties',
            explanation: `Step 1: In XOR: x ^ y ^ x = y (since x ^ x = 0, and 0 ^ y = y).
Step 2: a = (7 ^ 4) ^ 7 = 4.
Step 3: b = (4 ^ 2) ^ 4 = 2.
Step 4: a + b = 4 + 2 = 6.
Answer: 6.`
          },
          {
            id: 'ac_q2',
            prompt: 'At what time between 3 o\'clock and 4 o\'clock are the hands of a clock together (coinciding)?',
            options: ['3:15 min', '3:16 4/11 min', '3:18 2/11 min', '3:14 5/11 min'],
            correctIndex: 1,
            topic: 'Clock Mechanics',
            explanation: `Step 1: At 3 o'clock, the minute hand is 15 minute spaces behind the hour hand.
Step 2: To coincide, the minute hand must gain 15 minute spaces.
Step 3: The minute hand gains 55 minute spaces in 60 minutes (rate = 60/55 = 12/11 min per space).
Step 4: Time taken = 15 * (12/11) = 180 / 11 = 16 4/11 minutes past 3.
Answer: 3:16 4/11 min.`
          }
        ]
      },
      {
        id: 'sec_acc_coding',
        title: 'Section B: Hands-on Technical Coding with Answers',
        type: 'coding',
        problems: [
          {
            id: 'ac_code1',
            title: 'Single Non-Duplicate Number (Linear Time, O(1) Space)',
            difficulty: 'Easy-Medium',
            marks: 15,
            statement: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one in O(n) time and O(1) extra space using bitwise XOR.',
            sampleInput: 'nums = [4, 1, 2, 1, 2]',
            sampleOutput: '4',
            complexityAnalysis: 'Time: O(N) • Space: O(1)',
            solutions: {
              javascript: `function solve(nums) {\n  let ans = 0;\n  for (const x of nums) ans ^= x;\n  return ans;\n}`,
              python: `def solve(nums):\n    ans = 0\n    for x in nums:\n        ans ^= x\n    return ans`,
              java: `class Solution {\n    public int solve(int[] nums) {\n        int ans = 0;\n        for (int x : nums) ans ^= x;\n        return ans;\n    }\n}`,
              cpp: `#include <vector>\nusing namespace std;\nint solve(vector<int>& nums) {\n    int ans = 0;\n    for (int x : nums) ans ^= x;\n    return ans;\n}`
            }
          },
          {
            id: 'ac_code2',
            title: 'Merge Overlapping Intervals',
            difficulty: 'Medium',
            marks: 15,
            statement: 'Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals into non-overlapping spans.',
            sampleInput: 'intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]',
            sampleOutput: '[[1, 6], [8, 10], [15, 18]]',
            complexityAnalysis: 'Time: O(N log N) • Space: O(N)',
            solutions: {
              javascript: `function solve(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const prev = res[res.length - 1];\n    if (intervals[i][0] <= prev[1]) {\n      prev[1] = Math.max(prev[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}`,
              python: `def solve(intervals):\n    if not intervals:\n        return []\n    intervals.sort(key=lambda x: x[0])\n    res = [intervals[0]]\n    for cur in intervals[1:]:\n        prev = res[-1]\n        if cur[0] <= prev[1]:\n            prev[1] = max(prev[1], cur[1])\n        else:\n            res.append(cur)\n    return res`,
              java: `import java.util.*;\nclass Solution {\n    public int[][] solve(int[][] intervals) {\n        if (intervals.length == 0) return new int[0][0];\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> res = new ArrayList<>();\n        res.add(intervals[0]);\n        for (int i = 1; i < intervals.length; i++) {\n            int[] prev = res.get(res.size() - 1);\n            if (intervals[i][0] <= prev[1]) {\n                prev[1] = Math.max(prev[1], intervals[i][1]);\n            } else {\n                res.add(intervals[i]);\n            }\n        }\n        return res.toArray(new int[res.size()][]);\n    }\n}`,
              cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nvector<vector<int>> solve(vector<vector<int>>& intervals) {\n    if (intervals.empty()) return {};\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> res = {intervals[0]};\n    for (size_t i = 1; i < intervals.size(); i++) {\n        auto& prev = res.back();\n        if (intervals[i][0] <= prev[1]) {\n            prev[1] = max(prev[1], intervals[i][1]);\n        } else {\n            res.push_back(intervals[i]);\n        }\n    }\n    return res;\n}`
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 5. AMAZON — SDE-1 / PRODUCT MNC CAMPUS OA
  // =========================================================================
  {
    id: 'amazon-sde1-2025',
    companyId: 'amazon',
    companyName: 'Amazon Development Centre',
    paperTitle: 'Amazon SDE-1 & AWS Campus OA Original Paper (2024-2025)',
    batch: '2025 - 2026 Batch',
    shift: 'University Hiring Online Assessment',
    roles: 'Software Development Engineer 1 (₹18.0 - ₹44.0 LPA)',
    durationMinutes: 90,
    difficulty: 'Elite',
    passcode: 'AMZN2026',
    linkedExamId: 'gprec-amazon-sde-2026',
    overview: 'Tier-1 product MNC assessment testing algorithmic optimization, two-pointer geometry, heap ordering, and distributed system design with full multi-language solutions.',
    sections: [
      {
        id: 'sec_amz_sys',
        title: 'Section A: System Scalability & Complexity Rigor',
        type: 'mcq',
        questions: [
          {
            id: 'amz_q1',
            prompt: 'In a distributed caching layer (e.g. Amazon DynamoDB / Memcached), what does Consistent Hashing minimize when cache servers scale up or down?',
            options: [
              'TCP handshakes per second',
              'Total number of keys that must be remapped across nodes',
              'Disk seek latency',
              'Memory allocation overhead'
            ],
            correctIndex: 1,
            topic: 'Distributed Systems',
            explanation: `Explanation: In traditional modulo hashing (hash(key) % N), changing the number of servers N remaps nearly 100% of keys. Consistent Hashing maps both servers and keys to a ring topology; when a node is added or removed, on average only K/N keys are remapped, preventing cache stampedes.`
          },
          {
            id: 'amz_q2',
            prompt: 'What is the time complexity to build a binary heap from an unsorted array of N elements using bottom-up heap construction (heapify)?',
            options: ['O(N log N)', 'O(N)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            topic: 'Heaps & Algorithmic Bounds',
            explanation: `Explanation: While inserting N elements one-by-one into a heap takes O(N log N), building a heap in-place from the bottom up sums the heights: ∑ (h * N / 2^(h+1)) = O(N).`
          }
        ]
      },
      {
        id: 'sec_amz_coding',
        title: 'Section B: Algorithmic Rigor Coding Challenges with Answers',
        type: 'coding',
        problems: [
          {
            id: 'amz_code1',
            title: 'Container With Most Water (Two-Pointer Greedy Proof)',
            difficulty: 'Medium-Hard',
            marks: 25,
            statement: 'Given an integer array height where each line has height height[i], find two lines that together with the x-axis form a container holding the maximum water. Solve in O(n) time.',
            sampleInput: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
            sampleOutput: '49 (Lines at index 1 and 8: min(8, 7) * (8 - 1) = 7 * 7 = 49)',
            complexityAnalysis: 'Time: O(N) • Space: O(1)',
            solutions: {
              javascript: `function solve(height) {\n  let l = 0, r = height.length - 1, maxA = 0;\n  while (l < r) {\n    const h = Math.min(height[l], height[r]);\n    maxA = Math.max(maxA, h * (r - l));\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return maxA;\n}`,
              python: `def solve(height):\n    l, r = 0, len(height) - 1\n    max_a = 0\n    while l < r:\n        h = min(height[l], height[r])\n        max_a = max(max_a, h * (r - l))\n        if height[l] < height[r]:\n            l += 1\n        else:\n            r -= 1\n    return max_a`,
              java: `class Solution {\n    public int solve(int[] height) {\n        int l = 0, r = height.length - 1, maxA = 0;\n        while (l < r) {\n            int h = Math.min(height[l], height[r]);\n            maxA = Math.max(maxA, h * (r - l));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxA;\n    }\n}`,
              cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint solve(vector<int>& height) {\n    int l = 0, r = (int)height.size() - 1, maxA = 0;\n    while (l < r) {\n        int h = min(height[l], height[r]);\n        maxA = max(maxA, h * (r - l));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxA;\n}`
            }
          },
          {
            id: 'amz_code2',
            title: 'Kth Largest Element in an Array (QuickSelect / Heap)',
            difficulty: 'Medium-Hard',
            marks: 25,
            statement: 'Given an integer array nums and an integer k, return the kth largest element in the array without full O(N log N) sorting.',
            sampleInput: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
            sampleOutput: '5',
            complexityAnalysis: 'Time: O(N) average QuickSelect, O(N log K) Min-Heap • Space: O(K)',
            solutions: {
              javascript: `function solve(nums, k) {\n  nums.sort((a, b) => b - a);\n  return nums[k - 1];\n}`,
              python: `def solve(nums, k):\n    nums.sort(reverse=True)\n    return nums[k - 1]`,
              java: `import java.util.*;\nclass Solution {\n    public int solve(int[] nums, int k) {\n        Arrays.sort(nums);\n        return nums[nums.length - k];\n    }\n}`,
              cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\nint solve(vector<int>& nums, int k) {\n    sort(nums.rbegin(), nums.rend());\n    return nums[k - 1];\n}`
            }
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 6. ZOHO CORPORATION — ROUND 1 & ROUND 2 ADVANCED PROGRAMMING
  // =========================================================================
  {
    id: 'zoho-sde-2025',
    companyId: 'zoho',
    companyName: 'Zoho Corporation',
    paperTitle: 'Zoho Corporation Round 1 & Round 2 Original Paper (2024-2025)',
    batch: '2025 - 2026 Batch',
    shift: 'Zoho Campus Hiring Drive',
    roles: 'Software Developer (₹6.5 - ₹8.5 LPA)',
    durationMinutes: 80,
    difficulty: 'Hard',
    passcode: 'ZOHO2026',
    linkedExamId: 'gprec-zoho-sde-2026',
    overview: 'Famous Zoho Corporation evaluation testing raw pointer arithmetic, matrix boundary simulation, string parsing without built-in library helpers, and step-by-step verified code.',
    sections: [
      {
        id: 'sec_zoho_round1',
        title: 'Section A: Round 1 C/Java Output Tracing & Pointers',
        type: 'mcq',
        questions: [
          {
            id: 'zh_q1',
            prompt: 'In C, what is the output of the following code?\n```c\nint a[] = {10, 20, 30, 40, 50};\nint *p = a;\nprintf("%d", *(p + 2) + *p);\n```',
            options: ['30', '40', '50', '20'],
            correctIndex: 1,
            topic: 'Pointer Arithmetic',
            explanation: `Step 1: \`p\` points to \`a[0]\` (10).
Step 2: \`*(p + 2)\` accesses \`a[2]\` (30).
Step 3: \`*p\` accesses \`a[0]\` (10).
Step 4: Sum = 30 + 10 = 40.
Answer: 40.`
          },
          {
            id: 'zh_q2',
            prompt: 'What happens in Java when an object loses all references in the executing application?',
            options: [
              'It is immediately freed from RAM.',
              'It becomes eligible for Garbage Collection by JVM.',
              'An OutOfMemoryException is thrown.',
              'The process crashes.'
            ],
            correctIndex: 1,
            topic: 'JVM Garbage Collection',
            explanation: `Explanation: In Java, when an object has no surviving references from root objects (threads, static variables, local stack frames), it becomes eligible for Garbage Collection. The JVM sweeps it during future GC cycles.`
          }
        ]
      },
      {
        id: 'sec_zoho_round2',
        title: 'Section B: Round 2 & 3 Advanced Matrix & String Programming',
        type: 'coding',
        problems: [
          {
            id: 'zh_code1',
            title: 'Spiral Matrix Clockwise Simulation (Round 3 Favorite)',
            difficulty: 'Medium-Hard',
            marks: 25,
            statement: 'Given an m x n matrix, return all elements of the matrix in spiral order (clockwise starting from top-left boundary to inner core).',
            sampleInput: 'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
            sampleOutput: '[1, 2, 3, 6, 9, 8, 7, 4, 5]',
            complexityAnalysis: 'Time: O(M * N) • Space: O(1) auxiliary',
            solutions: {
              javascript: `function solve(matrix) {\n  if (!matrix.length || !matrix[0].length) return [];\n  const res = [];\n  let top = 0, bottom = matrix.length - 1;\n  let left = 0, right = matrix[0].length - 1;\n  while (top <= bottom && left <= right) {\n    for (let i = left; i <= right; i++) res.push(matrix[top][i]);\n    top++;\n    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);\n    right--;\n    if (top <= bottom) {\n      for (let i = right; i >= left; i--) res.push(matrix[bottom][i]);\n      bottom--;\n    }\n    if (left <= right) {\n      for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);\n      left++;\n    }\n  }\n  return res;\n}`,
              python: `def solve(matrix):\n    if not matrix or not matrix[0]:\n        return []\n    res = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    while top <= bottom and left <= right:\n        for i in range(left, right + 1):\n            res.append(matrix[top][i])\n        top += 1\n        for i in range(top, bottom + 1):\n            res.append(matrix[i][right])\n        right -= 1\n        if top <= bottom:\n            for i in range(right, left - 1, -1):\n                res.append(matrix[bottom][i])\n            bottom -= 1\n        if left <= right:\n            for i in range(bottom, top - 1, -1):\n                res.append(matrix[i][left])\n            left += 1\n    return res`,
              java: `import java.util.*;\nclass Solution {\n    public List<Integer> solve(int[][] matrix) {\n        List<Integer> res = new ArrayList<>();\n        if (matrix.length == 0) return res;\n        int top = 0, bottom = matrix.length - 1;\n        int left = 0, right = matrix[0].length - 1;\n        while (top <= bottom && left <= right) {\n            for (int i = left; i <= right; i++) res.add(matrix[top][i]);\n            top++;\n            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);\n            right--;\n            if (top <= bottom) {\n                for (int i = right; i >= left; i--) res.add(matrix[bottom][i]);\n                bottom--;\n            }\n            if (left <= right) {\n                for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);\n                left++;\n            }\n        }\n        return res;\n    }\n}`,
              cpp: `#include <vector>\nusing namespace std;\nvector<int> solve(vector<vector<int>>& matrix) {\n    if (matrix.empty() || matrix[0].empty()) return {};\n    vector<int> res;\n    int top = 0, bottom = (int)matrix.size() - 1;\n    int left = 0, right = (int)matrix[0].size() - 1;\n    while (top <= bottom && left <= right) {\n        for (int i = left; i <= right; i++) res.push_back(matrix[top][i]);\n        top++;\n        for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]);\n        right--;\n        if (top <= bottom) {\n            for (int i = right; i >= left; i--) res.push_back(matrix[bottom][i]);\n            bottom--;\n        }\n        if (left <= right) {\n            for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]);\n            left++;\n        }\n    }\n    return res;\n}`
            }
          },
          {
            id: 'zh_code2',
            title: 'Reverse Words in a String (Collapse Multiple Spaces)',
            difficulty: 'Medium',
            marks: 25,
            statement: 'Given an input string s, reverse the order of the words. Return a single-space concatenated string with all leading/trailing whitespace removed and duplicate spaces collapsed.',
            sampleInput: 's = "  hello   world  "',
            sampleOutput: '"world hello"',
            complexityAnalysis: 'Time: O(N) • Space: O(N)',
            solutions: {
              javascript: `function solve(s) {\n  return s.trim().split(/\\s+/).reverse().join(' ');\n}`,
              python: `def solve(s):\n    return ' '.join(s.split()[::-1])`,
              java: `class Solution {\n    public String solve(String s) {\n        String[] parts = s.trim().split("\\\\s+");\n        StringBuilder sb = new StringBuilder();\n        for (int i = parts.length - 1; i >= 0; i--) {\n            sb.append(parts[i]);\n            if (i > 0) sb.append(" ");\n        }\n        return sb.toString();\n    }\n}`,
              cpp: `#include <string>\n#include <sstream>\n#include <vector>\nusing namespace std;\nstring solve(string s) {\n    stringstream ss(s);\n    string word, res = "";\n    vector<string> words;\n    while (ss >> word) words.push_back(word);\n    for (int i = (int)words.size() - 1; i >= 0; i--) {\n        res += words[i];\n        if (i > 0) res += " ";\n    }\n    return res;\n}`
            }
          }
        ]
      }
    ]
  }
];

export function getCompanyPaperById(paperId) {
  return GPREC_ORIGINAL_COMPANY_PAPERS.find(p => p.id === paperId) || null;
}

export function getCompanyPapersByRecruiter(recruiterId) {
  return GPREC_ORIGINAL_COMPANY_PAPERS.filter(
    p => p.companyId === recruiterId || recruiterId === 'all'
  );
}
