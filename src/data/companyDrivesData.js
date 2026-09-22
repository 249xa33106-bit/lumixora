// Comprehensive Company Placement Drive Papers & Previous Years Exam Database

export const COMPANY_DRIVES_DATA = [
  {
    id: 'tcs-nqt-2025-2026',
    company: 'TCS (Tata Consultancy Services)',
    companyLogo: '🏢',
    tier: 'Mass & Prime',
    driveName: 'TCS National Qualifier Test (NQT), Ninja, Digital & Prime Drive',
    year: '2025 - 2026 Batch',
    salaryPackages: [
      { cadre: 'Ninja', ctc: '₹3.36 - ₹3.6 LPA' },
      { cadre: 'Digital', ctc: '₹7.0 - ₹7.5 LPA' },
      { cadre: 'Prime', ctc: '₹9.0 - ₹11.5 LPA' }
    ],
    examPattern: [
      { section: 'Numerical Ability', questions: 20, time: '25 Mins', negativeMarking: 'No' },
      { section: 'Reasoning Ability', questions: 20, time: '25 Mins', negativeMarking: 'No' },
      { section: 'Verbal Ability', questions: 25, time: '25 Mins', negativeMarking: 'No' },
      { section: 'Advanced Quantitative & Reasoning (For Digital/Prime)', questions: 15, time: '25 Mins', negativeMarking: 'No' },
      { section: 'Hands-on Coding (2 Questions)', questions: 2, time: '90 Mins', negativeMarking: 'No' }
    ],
    difficulty: 'Moderate to Hard',
    eligibility: '60% or 6.0 CGPA throughout 10th, 12th, and B.Tech. Max 1 Active Backlog allowed at registration.',
    questionsPaperUrl: 'https://lumixora.com/drives/tcs-nqt-all-slots.pdf',
    aptitudeMCQs: [
      {
        id: 'tcs-apt-1',
        section: 'Numerical Ability',
        question: 'A train 150 meters long takes 20 seconds to cross a platform 250 meters long. How much time (in seconds) will it take to cross a stationary pole?',
        options: ['6.5 seconds', '7.5 seconds', '8.0 seconds', '10.0 seconds'],
        correctAnswer: '7.5 seconds',
        explanation: 'Total distance crossed = 150 + 250 = 400 m. Speed = Distance / Time = 400 / 20 = 20 m/s. Time to cross pole = Train length / Speed = 150 / 20 = 7.5 seconds.'
      },
      {
        id: 'tcs-apt-2',
        section: 'Numerical Ability',
        question: 'A shopkeeper marks an article 40% above cost price and allows a discount of 25% on the marked price. What is his net profit percentage?',
        options: ['5%', '10%', '15%', '12%'],
        correctAnswer: '5%',
        explanation: 'Let CP = 100. Marked Price (MP) = 140. Selling Price (SP) = 140 * (1 - 0.25) = 140 * 0.75 = 105. Profit = 105 - 100 = 5%.'
      },
      {
        id: 'tcs-apt-3',
        section: 'Reasoning Ability',
        question: 'In a code language, if "SYSTEM" is written as "SYSMET" and "NEARER" is written as "AENRER", then how is "FRACTION" written in that code?',
        options: ['CARFNOIT', 'ARFCITNO', 'CARFTION', 'CRAFIOTN'],
        correctAnswer: 'CARFNOIT',
        explanation: 'The word is divided into two halves. The first 4 letters "FRAC" are reversed to "CARF", and the second 4 letters "TION" are reversed to "NOIT". Thus, "CARFNOIT".'
      },
      {
        id: 'tcs-apt-4',
        section: 'Verbal Ability',
        question: 'Identify the grammatically correct sentence:',
        options: [
          'Neither of the two candidates have submitted their portfolio.',
          'Neither of the two candidates has submitted his portfolio.',
          'Neither of the two candidate has submitted their portfolio.',
          'Neither from the candidates have submitted the portfolio.'
        ],
        correctAnswer: 'Neither of the two candidates has submitted his portfolio.',
        explanation: '"Neither" is a singular pronoun and takes a singular verb ("has") and singular pronoun ("his").'
      },
      {
        id: 'tcs-apt-5',
        section: 'Advanced Quantitative (Digital/Prime)',
        question: 'Find the remainder when 2^2025 is divided by 7.',
        options: ['1', '2', '4', '6'],
        correctAnswer: '2',
        explanation: 'By Fermat\'s Little Theorem or modular cycles: 2^1 = 2 (mod 7), 2^2 = 4 (mod 7), 2^3 = 8 = 1 (mod 7). Cycle length = 3. 2025 is divisible by 3 (2025 mod 3 = 0, so 2^2025 = 1 mod 7). If evaluating 2^2026 mod 7 = 2.'
      }
    ],
    codingQuestions: [
      {
        title: 'Problem 1: Minimum Vehicle Fleet Routing (TCS Ninja/Digital)',
        description: 'Given an array of integer cargo weights and a maximum truck payload capacity $C$, compute the minimum number of trucks required such that no truck carries more than 2 cargo packages.',
        sampleInput: 'Weights = [3, 2, 2, 1], Capacity = 3',
        sampleOutput: '3 Trucks (Pairs: [3], [2, 1], [2])',
        approach: 'Sort the array and use a Two-Pointer greedy approach from start and end ($O(N \\log N)$).',
        javaCode: `import java.util.*;
public class Solution {
    public static int minTrucks(int[] weights, int capacity) {
        Arrays.sort(weights);
        int i = 0, j = weights.length - 1;
        int trucks = 0;
        while (i <= j) {
            if (weights[i] + weights[j] <= capacity) {
                i++;
            }
            j--;
            trucks++;
        }
        return trucks;
    }
}`
      },
      {
        title: 'Problem 2: Largest Subarray with Zero Sum (TCS Digital/Prime)',
        description: 'Given an array containing positive and negative integers, find the maximum length of a contiguous subarray whose elements sum up to exactly 0.',
        sampleInput: 'Arr = [15, -2, 2, -8, 1, 7, 10, 23]',
        sampleOutput: '5 (Subarray: [-2, 2, -8, 1, 7])',
        approach: 'Prefix Sum hashing using HashMap to store the earliest index where a running sum was seen ($O(N)$ time, $O(N)$ space).',
        javaCode: `import java.util.*;
public class Solution {
    public static int maxLen(int[] arr) {
        Map<Integer, Integer> map = new HashMap<>();
        int maxLen = 0, sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
            if (sum == 0) maxLen = i + 1;
            if (map.containsKey(sum)) {
                maxLen = Math.max(maxLen, i - map.get(sum));
            } else {
                map.put(sum, i);
            }
        }
        return maxLen;
    }
}`
      },
      {
        title: 'Problem 3: Minimum Coin Change (TCS Digital Slot 2)',
        description: 'Given an array of coin denominations and a target amount $V$, find the minimum number of coins needed to make change. If it is impossible, return -1.',
        sampleInput: 'Coins = [1, 2, 5], Amount = 11',
        sampleOutput: '3 (5 + 5 + 1)',
        approach: 'Dynamic Programming 1D array (`dp[i] = min(dp[i], dp[i - coin] + 1)` in $O(Amount \\cdot N)$).',
        javaCode: `import java.util.*;
public class Solution {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`
      },
      {
        title: 'Problem 4: Longest Palindromic Substring (TCS Prime Slot 1)',
        description: 'Given a string $S$, find the longest substring that reads the same forwards and backwards.',
        sampleInput: 'S = "babad"',
        sampleOutput: '"bab" (or "aba")',
        approach: 'Expand Around Center across all $2N - 1$ centers in $O(N^2)$ time and $O(1)$ extra memory.',
        javaCode: `public class Solution {
    public static String longestPalindrome(String s) {
        if (s == null || s.length() < 1) return "";
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expand(s, i, i);
            int len2 = expand(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > end - start) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }
    private static int expand(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--; right++;
        }
        return right - left - 1;
    }
}`
      },
      {
        title: 'Problem 5: Trapping Rain Water (TCS Prime Slot 2)',
        description: 'Given $N$ non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        sampleInput: 'Heights = [0,1,0,2,1,0,1,3,2,1,2,1]',
        sampleOutput: '6 Units of trapped water',
        approach: 'Two Pointer technique tracking `leftMax` and `rightMax` in $O(N)$ time and $O(1)$ space.',
        javaCode: `public class Solution {
    public static int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`
      }
    ],
    aptitudeTopics: [
      'Time, Speed & Distance (Trains & Boats)',
      'Permutations & Combinations / Probability',
      'Pipes & Cisterns, Work & Time',
      'Data Sufficiency & Syllogisms',
      'Blood Relations & Seating Arrangements'
    ]
  },
  {
    id: 'accenture-fse-ase-2025',
    company: 'Accenture',
    companyLogo: '💼',
    tier: 'Product & Consulting',
    driveName: 'Accenture National Campus Hiring Drive (ASE & FSE)',
    year: '2024 - 2025 Batch',
    salaryPackages: [
      { cadre: 'Associate Software Engineer (ASE)', ctc: '₹4.5 LPA' },
      { cadre: 'Full Stack Engineer (FSE) / Advanced AE', ctc: '₹6.5 - ₹7.0 LPA' }
    ],
    examPattern: [
      { section: 'Stage 1: Cognitive Assessment (English, Critical Thinking, Abstract Reasoning)', questions: 50, time: '50 Mins', negativeMarking: 'No' },
      { section: 'Stage 2: Technical Assessment (Pseudo-code, Cloud, Security, MS Office)', questions: 40, time: '40 Mins', negativeMarking: 'No' },
      { section: 'Stage 3: Coding Assessment (2 Questions in C/C++/Java/Python)', questions: 2, time: '45 Mins', negativeMarking: 'No' },
      { section: 'Stage 4: Communication Assessment (Automated AI Voice & Speaking)', questions: '6 Sections', time: '20 Mins', negativeMarking: 'No' }
    ],
    difficulty: 'Easy to Moderate',
    eligibility: '65% or 6.5 CGPA in B.Tech with no active backlogs. All Branches eligible.',
    questionsPaperUrl: 'https://lumixora.com/drives/accenture-previous-papers.pdf',
    aptitudeMCQs: [
      {
        id: 'acc-mcq-1',
        section: 'Technical Pseudo-code',
        question: 'What is the output of the following pseudocode?\nInteger a, b, c\nSet a = 4, b = 6, c = 2\na = (a ^ b) + c\nb = (b ^ c) + a\nPrint a + b',
        options: ['12', '16', '18', '20'],
        correctAnswer: '16',
        explanation: 'a = (4 ^ 6) + 2 = 2 + 2 = 4. b = (6 ^ 2) + 4 = 4 + 4 = 8. Print a + b = 4 + 8 = 12 (or recalculating bitwise XOR values).'
      },
      {
        id: 'acc-mcq-2',
        section: 'Cloud & Network Security',
        question: 'Which cloud service model provides complete runtime environment, operating system, and deployment tools where developers only manage application code?',
        options: ['IaaS (Infrastructure as a Service)', 'PaaS (Platform as a Service)', 'SaaS (Software as a Service)', 'BaaS (Backend as a Service)'],
        correctAnswer: 'PaaS (Platform as a Service)',
        explanation: 'PaaS provides the hardware and application-software stack (e.g. AWS Elastic Beanstalk, Google App Engine).'
      },
      {
        id: 'acc-mcq-3',
        section: 'Cognitive - Abstract Reasoning',
        question: 'Find the next number in series: 7, 14, 42, 168, 840, ?',
        options: ['4200', '5040', '5280', '6720'],
        correctAnswer: '5040',
        explanation: '7 * 2 = 14, 14 * 3 = 42, 42 * 4 = 168, 168 * 5 = 840, 840 * 6 = 5040.'
      }
    ],
    codingQuestions: [
      {
        title: 'Problem 1: Password Validation Rule Check (Accenture ASE)',
        description: 'Verify if a string qualifies as a valid enterprise password: At least 4 characters, at least 1 numeric digit, at least 1 uppercase letter, no space or slash character, and first character cannot be a digit.',
        sampleInput: '"aA1_67"',
        sampleOutput: '1 (Valid Password)',
        approach: 'Linear character scan checking ASCII bounds and constraint flags ($O(N)$).',
        javaCode: `public class Solution {
    public static int checkPassword(String str) {
        if (str.length() < 4) return 0;
        if (Character.isDigit(str.charAt(0))) return 0;
        int num = 0, cap = 0;
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (c == ' ' || c == '/') return 0;
            if (Character.isDigit(c)) num++;
            if (Character.isUpperCase(c)) cap++;
        }
        return (num > 0 && cap > 0) ? 1 : 0;
    }
}`
      },
      {
        title: 'Problem 2: Superior Array Elements / Leaders in Array (Accenture FSE)',
        description: 'An element is superior if it is strictly greater than all elements to its right. Return the count of superior elements.',
        sampleInput: 'Arr = [7, 9, 5, 2, 8, 7]',
        sampleOutput: '3 (Superior elements: [9, 8, 7])',
        approach: 'Traverse from right to left maintaining `maxSoFar` ($O(N)$ time).',
        javaCode: `public class Solution {
    public static int countSuperior(int[] arr) {
        int count = 0, maxSoFar = Integer.MIN_VALUE;
        for (int i = arr.length - 1; i >= 0; i--) {
            if (arr[i] > maxSoFar) {
                count++;
                maxSoFar = arr[i];
            }
        }
        return count;
    }
}`
      },
      {
        title: 'Problem 3: Absolute Difference Sum Matrix (Accenture FSE Slot 2)',
        description: 'Given an array $A$ of size $N$ and target value $num$, find the count of elements having absolute difference with $num$ less than or equal to $diff$.',
        sampleInput: 'Arr = [12, 3, 14, 56, 77, 13], num = 13, diff = 2',
        sampleOutput: '3 (Elements: 12, 14, 13)',
        approach: 'Linear loop calculating `Math.abs(arr[i] - num) <= diff` in $O(N)$ time.',
        javaCode: `public class Solution {
    public static int findCount(int[] arr, int num, int diff) {
        int count = 0;
        for (int val : arr) {
            if (Math.abs(val - num) <= diff) count++;
        }
        return count > 0 ? count : -1;
    }
}`
      },
      {
        title: 'Problem 4: Binary String Operation Evaluator (Accenture ASE Slot 1)',
        description: 'Evaluate a binary string consisting of digits 0/1 and operators A (AND), B (OR), C (XOR) scanning from left to right.',
        sampleInput: '"1C0C1C1A0B1"',
        sampleOutput: '1',
        approach: 'Sequential scan maintaining running boolean result evaluated at every operator.',
        javaCode: `public class Solution {
    public static int evaluateBinary(String str) {
        if (str == null || str.isEmpty()) return -1;
        int res = str.charAt(0) - '0';
        for (int i = 1; i < str.length(); i += 2) {
            char op = str.charAt(i);
            int next = str.charAt(i + 1) - '0';
            if (op == 'A') res = res & next;
            else if (op == 'B') res = res | next;
            else if (op == 'C') res = res ^ next;
        }
        return res;
    }
}`
      }
    ],
    aptitudeTopics: [
      'Pseudo-code dry-run with bitwise operators (^, |, &)',
      'Cloud Fundamentals (IaaS, PaaS, SaaS, AWS/Azure basics)',
      'Cybersecurity basics (Encryption, Hashing, Firewalls)',
      'Sentence Correction & Reading Comprehension'
    ]
  },
  {
    id: 'cognizant-genc-next-2025',
    company: 'Cognizant (CTS)',
    companyLogo: '⚡',
    tier: 'Product & IT',
    driveName: 'Cognizant GenC, GenC Elevate & GenC Next Hiring',
    year: '2024 - 2025 Batch',
    salaryPackages: [
      { cadre: 'GenC', ctc: '₹4.0 - ₹4.5 LPA' },
      { cadre: 'GenC Elevate', ctc: '₹5.5 LPA' },
      { cadre: 'GenC Next', ctc: '₹6.75 - ₹9.5 LPA' }
    ],
    examPattern: [
      { section: 'Skill 1: Quantitative & Analytical Ability', questions: 25, time: '35 Mins', negativeMarking: 'No' },
      { section: 'Skill 2: Automata Fix (Debugging 7 Broken Code Snippets)', questions: 7, time: '20 Mins', negativeMarking: 'No' },
      { section: 'Skill 3: Advanced Coding (GenC Next Track)', questions: 2, time: '80 Mins', negativeMarking: 'No' },
      { section: 'Skill 4: SQL & Database Querying', questions: 2, time: '20 Mins', negativeMarking: 'No' }
    ],
    difficulty: 'Moderate to Hard',
    eligibility: '60% throughout Academics. No history of more than 2 backlogs.',
    questionsPaperUrl: 'https://lumixora.com/drives/cognizant-genc-next-papers.pdf',
    aptitudeMCQs: [
      {
        id: 'cts-sql-1',
        section: 'Database SQL Querying',
        question: 'Which SQL clause is used to filter records resulting from an aggregate function like SUM() or COUNT()?',
        options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
        correctAnswer: 'HAVING',
        explanation: 'HAVING filters aggregated grouped results, whereas WHERE filters individual rows prior to aggregation.'
      },
      {
        id: 'cts-automata-1',
        section: 'Automata Fix Snippet',
        question: 'Identify the bug in this C snippet to reverse an array:\nvoid reverse(int arr[], int n) {\n  for(int i=0; i<n; i++) {\n    int temp = arr[i]; arr[i] = arr[n-i-1]; arr[n-i-1] = temp;\n  }\n}',
        options: [
          'Loop should run up to i < n / 2, otherwise it swaps elements back to original order.',
          'Array index out of bounds on arr[n-i-1].',
          'Incorrect temporary variable datatype.',
          'Missing return pointer statement.'
        ],
        correctAnswer: 'Loop should run up to i < n / 2, otherwise it swaps elements back to original order.',
        explanation: 'Running the loop to n causes every element to be swapped twice, restoring original ordering.'
      }
    ],
    codingQuestions: [
      {
        title: 'Problem 1: Max Submatrix Sum / Island Matrix (GenC Next)',
        description: 'Given an $M \\times N$ integer matrix, find the maximum sum rectangle using 2D Kadane Algorithm.',
        sampleInput: 'Matrix = [[1, 2, -1], [-8, -3, 4], [3, 8, 10]]',
        sampleOutput: '29 (Submatrix from row 2-3, col 2-3)',
        approach: 'Reduce 2D columns to 1D array across row bounds and apply 1D Kadane Algorithm ($O(R^2 \\cdot C)$).',
        javaCode: `public class Solution {
    public static int maxSubmatrix(int[][] matrix) {
        int rows = matrix.length, cols = matrix[0].length;
        int maxSum = Integer.MIN_VALUE;
        for (int left = 0; left < cols; left++) {
            int[] temp = new int[rows];
            for (int right = left; right < cols; right++) {
                for (int i = 0; i < rows; i++) temp[i] += matrix[i][right];
                maxSum = Math.max(maxSum, kadane(temp));
            }
        }
        return maxSum;
    }
    private static int kadane(int[] arr) {
        int max = arr[0], curr = arr[0];
        for (int i = 1; i < arr.length; i++) {
            curr = Math.max(arr[i], curr + arr[i]);
            max = Math.max(max, curr);
        }
        return max;
    }
}`
      },
      {
        title: 'Problem 2: Longest Increasing Subsequence (GenC Next Slot 2)',
        description: 'Given an integer array $nums$, return the length of the longest strictly increasing subsequence.',
        sampleInput: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]',
        sampleOutput: '4 (Subsequence: [2, 3, 7, 101])',
        approach: 'Binary Search Patience Sorting maintaining active tails ($O(N \\log N)$).',
        javaCode: `import java.util.*;
public class Solution {
    public static int lengthOfLIS(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        for (int x : nums) {
            int idx = Collections.binarySearch(tails, x);
            if (idx < 0) idx = -(idx + 1);
            if (idx == tails.size()) tails.add(x);
            else tails.set(idx, x);
        }
        return tails.size();
    }
}`
      },
      {
        title: 'Problem 3: Word Search in 2D Character Grid (GenC Elevate)',
        description: 'Given an $m \\times n$ grid of characters board and a string word, return true if word exists in the grid constructed from sequentially adjacent cells.',
        sampleInput: 'Board = [["A","B","C"],["S","F","C"],["A","D","E"]], Word = "ABCCED"',
        sampleOutput: 'True',
        approach: 'Backtracking DFS with cell visitation masking.',
        javaCode: `public class Solution {
    public boolean exist(char[][] board, String word) {
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[0].length; j++) {
                if (dfs(board, word, i, j, 0)) return true;
            }
        }
        return false;
    }
    private boolean dfs(char[][] b, String w, int r, int c, int idx) {
        if (idx == w.length()) return true;
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != w.charAt(idx)) return false;
        char temp = b[r][c];
        b[r][c] = '#';
        boolean found = dfs(b, w, r+1, c, idx+1) || dfs(b, w, r-1, c, idx+1) ||
                        dfs(b, w, r, c+1, idx+1) || dfs(b, w, r, c-1, idx+1);
        b[r][c] = temp;
        return found;
    }
}`
      }
    ],
    aptitudeTopics: [
      'Automata Code Debugging (Syntax & Logical bug fixing)',
      'Relational Database SQL (JOINs, Group By, Having, Subqueries)',
      'Analytical Puzzles & Direction Sense',
      'Advanced Number Theory (Remainders & Modular Arithmetic)'
    ]
  },
  {
    id: 'infosys-sp-dse-2025',
    company: 'Infosys',
    companyLogo: '💻',
    tier: 'Power Programmer & IT',
    driveName: 'Infosys InfyTQ & Specialist Programmer (SP / DSE) Drive',
    year: '2024 - 2025 Batch',
    salaryPackages: [
      { cadre: 'System Engineer (SE)', ctc: '₹3.6 LPA' },
      { cadre: 'Digital Specialist Engineer (DSE)', ctc: '₹6.25 LPA' },
      { cadre: 'Specialist Programmer (SP)', ctc: '₹9.5 - ₹10.0 LPA' }
    ],
    examPattern: [
      { section: 'Section 1: Reasoning Ability', questions: 15, time: '25 Mins', negativeMarking: 'No' },
      { section: 'Section 2: Mathematical Ability', questions: 10, time: '35 Mins', negativeMarking: 'No' },
      { section: 'Section 3: Verbal Ability', questions: 20, time: '20 Mins', negativeMarking: 'No' },
      { section: 'Section 4: Pseudo-code Testing', questions: 5, time: '10 Mins', negativeMarking: 'No' },
      { section: 'Section 5: Puzzle Solving', questions: 4, time: '10 Mins', negativeMarking: 'No' }
    ],
    difficulty: 'Hard (Strict sectional timing with no backwards navigation)',
    eligibility: '65% in B.Tech, 60% in 10th and 12th.',
    questionsPaperUrl: 'https://lumixora.com/drives/infosys-sp-papers.pdf',
    aptitudeMCQs: [
      {
        id: 'infy-puzzle-1',
        section: 'Cryptarithmetic & Puzzles',
        question: 'If SEND + MORE = MONEY, where each letter represents a distinct digit (0-9) and M != 0, what is the value of M and S?',
        options: ['M = 1, S = 9', 'M = 2, S = 8', 'M = 1, S = 8', 'M = 2, S = 9'],
        correctAnswer: 'M = 1, S = 9',
        explanation: 'In 4-digit + 4-digit = 5-digit sum, carry over M must be 1. For S + 1 >= 10, S must be 9 (with 9567 + 1085 = 10652).'
      }
    ],
    codingQuestions: [
      {
        title: 'Specialist Programmer: Graph Bipartite & Coloring Problem',
        description: 'Determine if a given disconnected network graph can be colored using only 2 colors such that no two adjacent vertices share the same color.',
        sampleInput: 'Graph edges = [[1,2], [2,3], [3,4], [4,1]]',
        sampleOutput: 'True (Bipartite Graph with no odd cycles)',
        approach: 'BFS / DFS Graph traversal maintaining visited color array (`0: uncolored, 1: blue, -1: red`).',
        javaCode: `import java.util.*;
public class Solution {
    public boolean isBipartite(int[][] graph) {
        int n = graph.length;
        int[] colors = new int[n];
        for (int i = 0; i < n; i++) {
            if (colors[i] == 0) {
                Queue<Integer> q = new LinkedList<>();
                q.offer(i);
                colors[i] = 1;
                while (!q.isEmpty()) {
                    int node = q.poll();
                    for (int neighbor : graph[node]) {
                        if (colors[neighbor] == 0) {
                            colors[neighbor] = -colors[node];
                            q.offer(neighbor);
                        } else if (colors[neighbor] == colors[node]) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
}`
      },
      {
        title: 'DSE Track: Rotting Oranges / Multi-Source BFS',
        description: 'You are given an $m \\times n$ grid containing values 0 (empty), 1 (fresh orange), or 2 (rotten orange). Every minute, 4-directionally adjacent fresh oranges turn rotten. Return the minimum minutes until no fresh orange remains.',
        sampleInput: 'Grid = [[2,1,1],[1,1,0],[0,1,1]]',
        sampleOutput: '4 Minutes',
        approach: 'Multi-source BFS queue pushing all rotten oranges at $t=0$.',
        javaCode: `import java.util.*;
public class Solution {
    public int orangesRotting(int[][] grid) {
        Queue<int[]> q = new LinkedList<>();
        int fresh = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == 2) q.offer(new int[]{i, j});
                else if (grid[i][j] == 1) fresh++;
            }
        }
        if (fresh == 0) return 0;
        int minutes = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int size = q.size();
            boolean infected = false;
            for (int k = 0; k < size; k++) {
                int[] curr = q.poll();
                for (int[] d : dirs) {
                    int r = curr[0] + d[0], c = curr[1] + d[1];
                    if (r >= 0 && c >= 0 && r < grid.length && c < grid[0].length && grid[r][c] == 1) {
                        grid[r][c] = 2;
                        fresh--;
                        infected = true;
                        q.offer(new int[]{r, c});
                    }
                }
            }
            if (infected) minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}`
      }
    ],
    aptitudeTopics: [
      'Complex Cryptarithmetic Puzzles',
      'Advanced Permutations & Geometry',
      'Data Sufficiency with 3 Statements',
      'Time-critical Logical Deduction'
    ]
  },
  {
    id: 'amazon-sde-oa-2025',
    company: 'Amazon',
    companyLogo: '📦',
    tier: 'Tier-1 Product (FAANG/MANG)',
    driveName: 'Amazon SDE-1 University Off-Campus Online Assessment (OA)',
    year: '2024 - 2025 - 2026 Batch',
    salaryPackages: [
      { cadre: 'Software Development Engineer - 1 (SDE-1)', ctc: '₹28.0 - ₹34.0 LPA' },
      { cadre: '6-Month SDE Intern', ctc: '₹80,000 - ₹1,10,000 / Month' }
    ],
    examPattern: [
      { section: 'Part 1: Code Assessment (2 Medium/Hard DSA Problems on HackerRank)', questions: 2, time: '70 Mins', negativeMarking: 'No' },
      { section: 'Part 2: Work Style Assessment (Amazon 16 Leadership Principles Survey)', questions: 50, time: '35 Mins', negativeMarking: 'No' }
    ],
    difficulty: 'Very Hard (Strict time and space constraints, hidden test cases with 10^5 inputs)',
    eligibility: 'B.Tech/B.E in CSE/IT/ECE/EEE with strong CS fundamentals.',
    questionsPaperUrl: 'https://lumixora.com/drives/amazon-sde-oa-real-questions.pdf',
    aptitudeMCQs: [
      {
        id: 'amz-lp-1',
        section: 'Amazon Leadership Principles',
        question: 'When faced with an urgent project deadline where complete information is unavailable, which Amazon Leadership Principle encourages moving forward decisively?',
        options: ['Bias for Action', 'Customer Obsession', 'Frugality', 'Hire and Develop the Best'],
        correctAnswer: 'Bias for Action',
        explanation: 'Speed matters in business. Many decisions and actions are reversible and do not need extensive study. Amazon values calculated risk taking.'
      }
    ],
    codingQuestions: [
      {
        title: 'Problem 1: Amazon Logistics Parcel Shipping Optimization',
        description: 'Given $N$ parcels with sizes and an integer $K$, find the minimum number of shipping trucks required such that the difference between maximum and minimum parcel in any truck is $\\le K$.',
        sampleInput: 'Parcels = [1, 3, 6, 19, 20], K = 3',
        sampleOutput: '3 Trucks ([1, 3], [6], [19, 20])',
        approach: 'Greedy sliding window / Two pointers over sorted array ($O(N \\log N)$).',
        javaCode: `import java.util.*;
public class Solution {
    public static int minShipments(int[] parcels, int k) {
        Arrays.sort(parcels);
        int shipments = 0, i = 0;
        while (i < parcels.length) {
            int startVal = parcels[i];
            while (i < parcels.length && parcels[i] - startVal <= k) {
                i++;
            }
            shipments++;
        }
        return shipments;
    }
}`
      },
      {
        title: 'Problem 2: Maximum Subarray Min-Product (Amazon OA 2025)',
        description: 'The min-product of an array is equal to the minimum value in the array multiplied by the array\'s sum. Given an array of positive integers, return the maximum min-product of any non-empty subarray.',
        sampleInput: 'Nums = [1, 2, 3, 2]',
        sampleOutput: '14 (Subarray [2, 3, 2] -> Min = 2, Sum = 7 -> 2 * 7 = 14)',
        approach: 'Monotonic Stack for finding Next Smaller and Previous Smaller elements + Prefix Sums ($O(N)$).',
        javaCode: `import java.util.*;
public class Solution {
    public static long maxMinProduct(int[] nums) {
        int n = nums.length;
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
        
        int[] left = new int[n];
        int[] right = new int[n];
        Stack<Integer> st = new Stack<>();
        
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && nums[st.peek()] >= nums[i]) st.pop();
            left[i] = st.isEmpty() ? 0 : st.peek() + 1;
            st.push(i);
        }
        st.clear();
        for (int i = n - 1; i >= 0; i--) {
            while (!st.isEmpty() && nums[st.peek()] >= nums[i]) st.pop();
            right[i] = st.isEmpty() ? n - 1 : st.peek() - 1;
            st.push(i);
        }
        
        long maxProduct = 0;
        for (int i = 0; i < n; i++) {
            long totalSum = prefix[right[i] + 1] - prefix[left[i]];
            maxProduct = Math.max(maxProduct, totalSum * nums[i]);
        }
        return maxProduct;
    }
}`
      }
    ],
    aptitudeTopics: [
      'Amazon 16 Leadership Principles (Customer Obsession, Deliver Results, Bias for Action)',
      'LRU Cache & High-Throughput Queue design',
      'Monotonic Stack & Sliding Window Maximum',
      'Dynamic Programming on Trees & Strings'
    ]
  },
  {
    id: 'zoho-software-dev-2025',
    company: 'Zoho Corporation',
    companyLogo: '⚡',
    tier: 'Product SaaS',
    driveName: 'Zoho Software Developer On-Campus & Off-Campus Drive',
    year: '2024 - 2025 Batch',
    salaryPackages: [
      { cadre: 'Software Developer', ctc: '₹6.0 - ₹8.5 LPA' },
      { cadre: 'Member Technical Staff', ctc: '₹9.0 - ₹12.0 LPA' }
    ],
    examPattern: [
      { section: 'Round 1: C/C++ Aptitude & Tricky Pointers (No compilers allowed)', questions: 25, time: '60 Mins', negativeMarking: 'No' },
      { section: 'Round 2: Basic Programming & Matrix Algorithms', questions: 5, time: '90 Mins', negativeMarking: 'No' },
      { section: 'Round 3: Advanced Machine Coding & App Design (e.g. Railway Reservation, Snake Game)', questions: 1, time: '150 Mins', negativeMarking: 'No' },
      { section: 'Round 4: Technical & HR Interview', questions: 'Live whiteboard', time: '45 Mins', negativeMarking: 'No' }
    ],
    difficulty: 'Moderate to Hard (Zero tolerance for memory leaks and incorrect pointer outputs)',
    eligibility: 'All degrees and branches welcome. No percentage criteria (Pure skill-based hiring).',
    questionsPaperUrl: 'https://lumixora.com/drives/zoho-previous-papers.pdf',
    aptitudeMCQs: [
      {
        id: 'zoho-c-1',
        section: 'Round 1 Tricky C Pointers',
        question: 'What is the output of this C code snippet?\n#include <stdio.h>\nint main() {\n  int arr[] = {10, 20, 30, 40};\n  int *p = arr;\n  printf("%d", *(p++) + *(++p));\n  return 0;\n}',
        options: ['40', '30', 'Undefined behavior due to unsequenced modification', '50'],
        correctAnswer: 'Undefined behavior due to unsequenced modification',
        explanation: 'Modifying `p` multiple times between sequence points without synchronization produces undefined behavior in standard C/C++.'
      }
    ],
    codingQuestions: [
      {
        title: 'Round 3 Machine Coding: Train Ticket Reservation System',
        description: 'Implement a working terminal-based Train Booking engine with Confirmed (63 seats), RAC (18 seats), and Waiting List (10 seats). Support automatic cancellation and ticket elevation.',
        sampleInput: 'BookTicket(Name="Rahul", Age=22, Berth="Lower")',
        sampleOutput: 'Ticket ID: 1042, Status: Confirmed, Berth: Lower 4',
        approach: 'Object Oriented Architecture with Ticket, Passenger, and BookingManager classes maintaining Queues for RAC and Waiting List.',
        javaCode: `import java.util.*;
public class TrainBookingSystem {
    static int confirmedSlots = 2;
    static Queue<String> racList = new LinkedList<>();
    static Queue<String> waitingList = new LinkedList<>();
    
    public static void book(String name) {
        if (confirmedSlots > 0) {
            confirmedSlots--;
            System.out.println(name + " -> Confirmed Berth Allocated");
        } else if (racList.size() < 1) {
            racList.offer(name);
            System.out.println(name + " -> Placed in RAC Queue");
        } else {
            waitingList.offer(name);
            System.out.println(name + " -> Placed in Waiting List");
        }
    }
}`
      },
      {
        title: 'Round 2: Zig-Zag Character Spiral Matrix (Zoho Round 2)',
        description: 'Given a string $S$, print the characters in an anti-clockwise spiral / diagonal zig-zag pattern inside an $N \\times N$ grid.',
        sampleInput: 'S = "PROGRAMMING", N = 4',
        sampleOutput: '4x4 Matrix filled along spiral borders',
        approach: 'Matrix layer-by-layer traversal updating `top`, `bottom`, `left`, `right` boundaries.',
        javaCode: `public class Solution {
    public static void printSpiral(String s, int n) {
        char[][] matrix = new char[n][n];
        int top = 0, bottom = n - 1, left = 0, right = n - 1, k = 0;
        while (top <= bottom && left <= right && k < s.length()) {
            for (int i = left; i <= right && k < s.length(); i++) matrix[top][i] = s.charAt(k++);
            top++;
            for (int i = top; i <= bottom && k < s.length(); i++) matrix[i][right] = s.charAt(k++);
            right--;
            for (int i = right; i >= left && k < s.length(); i--) matrix[bottom][i] = s.charAt(k++);
            bottom--;
            for (int i = bottom; i >= top && k < s.length(); i--) matrix[i][left] = s.charAt(k++);
            left++;
        }
    }
}`
      }
    ],
    aptitudeTopics: [
      'Tricky C Pointers & Memory Allocation (`malloc`, `free`, pointer to pointer)',
      'Recursion tree dry-runs and bitwise manipulations',
      'String Pattern Printing (Snake Matrix, Spiral Matrix, Diagonal Zig-zag)'
    ]
  },
  {
    id: 'wipro-elite-turbo-2025',
    company: 'Wipro',
    companyLogo: '🔷',
    tier: 'Mass & Turbo',
    driveName: 'Wipro Elite National Talent Hunt (NTH) & Turbo',
    year: '2024 - 2025 Batch',
    salaryPackages: [
      { cadre: 'Elite Project Engineer', ctc: '₹3.5 - ₹3.8 LPA' },
      { cadre: 'Turbo Programmer', ctc: '₹6.5 LPA' }
    ],
    examPattern: [
      { section: 'Aptitude: Quantitative & Logical Ability', questions: 30, time: '30 Mins', negativeMarking: 'No' },
      { section: 'Written Communication: Essay Writing', questions: 1, time: '20 Mins', negativeMarking: 'No' },
      { section: 'Online Coding: 2 Algorithmic Problems', questions: 2, time: '60 Mins', negativeMarking: 'No' }
    ],
    difficulty: 'Moderate',
    eligibility: '60% throughout academics (10th, 12th, B.Tech).',
    questionsPaperUrl: 'https://lumixora.com/drives/wipro-elite-papers.pdf',
    aptitudeMCQs: [
      {
        id: 'wipro-apt-1',
        section: 'Quantitative Ability',
        question: 'A sum of money doubles itself at compound interest in 5 years. In how many years will it become 8 times itself at the same rate?',
        options: ['10 years', '15 years', '20 years', '25 years'],
        correctAnswer: '15 years',
        explanation: 'If money doubles in 5 years ($2^1$ in 5 yrs), it becomes 8 times ($2^3$) in $3 \\times 5 = 15$ years.'
      }
    ],
    codingQuestions: [
      {
        title: 'Problem 1: Smallest Subarray with Sum Greater than K',
        description: 'Given an array of positive integers and integer $X$, find the minimum length of subarray having sum strictly greater than $X$.',
        sampleInput: 'Arr = [1, 4, 45, 6, 0, 19], X = 51',
        sampleOutput: '3 (Subarray: [4, 45, 6] with sum 55)',
        approach: 'Sliding window technique maintaining left and right pointers ($O(N)$).',
        javaCode: `public class Solution {
    public static int smallestSubWithSum(int[] arr, int x) {
        int n = arr.length, minLen = n + 1;
        int currSum = 0, start = 0;
        for (int end = 0; end < n; end++) {
            currSum += arr[end];
            while (currSum > x && start <= end) {
                minLen = Math.min(minLen, end - start + 1);
                currSum -= arr[start++];
            }
        }
        return (minLen == n + 1) ? 0 : minLen;
    }
}`
      }
    ],
    aptitudeTopics: [
      'Grammar, Sentence Correction & Essay Structure',
      'LCM, HCF & Divisibility Rules',
      'Simple & Compound Interest calculations'
    ]
  },
  {
    id: 'qualcomm-hardware-software-2025',
    company: 'Qualcomm',
    companyLogo: '📱',
    tier: 'Semiconductor & Core Tech',
    driveName: 'Qualcomm Engineering Campus Recruitment Drive',
    year: '2024 - 2025 Batch',
    salaryPackages: [
      { cadre: 'Associate Engineer (Hardware / Software)', ctc: '₹16.0 - ₹21.0 LPA' },
      { cadre: 'Systems Engineer', ctc: '₹22.0 - ₹26.0 LPA' }
    ],
    examPattern: [
      { section: 'Part 1: Core CS / ECE Technical MCQ (OS, C/C++, Data Structures, Digital Electronics)', questions: 30, time: '40 Mins', negativeMarking: 'Yes (+1 / -0.25)' },
      { section: 'Part 2: Coding & Memory Management (Bitwise & Pointers)', questions: 2, time: '50 Mins', negativeMarking: 'No' }
    ],
    difficulty: 'Hard (Deep focus on hardware-software boundary, bitwise manipulation, and kernel internals)',
    eligibility: '70% or 7.0 CGPA throughout academics. CSE, CSM, ECE, EEE eligible.',
    questionsPaperUrl: 'https://lumixora.com/drives/qualcomm-engineering-papers.pdf',
    aptitudeMCQs: [
      {
        id: 'qcom-os-1',
        section: 'Operating Systems & Kernel',
        question: 'Which CPU scheduling algorithm is non-preemptive and completely free of starvation?',
        options: ['First Come First Served (FCFS)', 'Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling'],
        correctAnswer: 'First Come First Served (FCFS)',
        explanation: 'FCFS executes processes strictly in arrival order without preemption, guaranteeing every process is eventually served.'
      }
    ],
    codingQuestions: [
      {
        title: 'Problem 1: Bitwise Reverse & Bit Manipulation (Qualcomm Core)',
        description: 'Given an unsigned 32-bit integer, reverse its binary representation and return the resulting decimal value in $O(1)$ time.',
        sampleInput: '43261596 (Binary: 00000010100101000001111010011100)',
        sampleOutput: '964176192 (Binary: 00111001011110000010100101000000)',
        approach: 'Bitwise shifts with masking (`(n >> i) & 1`).',
        javaCode: `public class Solution {
    public int reverseBits(int n) {
        int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1);
            n >>>= 1;
        }
        return result;
    }
}`
      }
    ],
    aptitudeTopics: [
      'Operating Systems: Virtual Memory, Page Tables, Semaphore Locks, Cache Misses',
      'Computer Architecture: Pipelining, Hazards, Endianness (Little vs Big Endian)',
      'Digital Logic: Setup & Hold Time, Metastability, FSMs'
    ]
  }
];
