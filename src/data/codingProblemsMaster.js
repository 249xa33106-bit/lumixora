// Master LeetCode & HackerRank Coding Problems Directory
// Comprehensive collection spanning Beginner, Intermediate, and Advanced tiers
// with full test cases, real JavaScript code execution harnesses, and multi-language templates.

export const CODING_PROBLEMS_MASTER = [
  {
    "id": "two_sum",
    "number": 1,
    "title": "Two Sum",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Arrays & Hashing",
    "platform": "LeetCode",
    "acceptanceRate": "52.4%",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta",
      "Apple"
    ],
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]",
        "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    "hints": [
      "Can you use a hash map to look up the complement in O(1) time?",
      "Track indices of numbers as you traverse the array."
    ],
    "editorial": {
      "approach": "One-pass Hash Map",
      "time": "O(N)",
      "space": "O(N)",
      "summary": "Store each element's value and index in a map. For each element, check if (target - num) exists in the map."
    },
    "functionName": "twoSum",
    "testCases": [
      {
        "args": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "args": [
          [
            3,
            2,
            4
          ],
          6
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "args": [
          [
            3,
            3
          ],
          6
        ],
        "expected": [
          0,
          1
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      "python": "def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []",
      "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{ map.get(comp), i };\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}",
      "cpp": "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (mp.find(diff) != mp.end()) return {mp[diff], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};"
    }
  },
  {
    "id": "contains_duplicate",
    "number": 217,
    "title": "Contains Duplicate",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Arrays & Hashing",
    "platform": "LeetCode",
    "acceptanceRate": "61.3%",
    "companyTags": [
      "Amazon",
      "Apple",
      "Microsoft",
      "Adobe"
    ],
    "description": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "true",
        "explanation": "1 appears at index 0 and 3."
      },
      {
        "input": "nums = [1,2,3,4]",
        "output": "false",
        "explanation": "All elements are distinct."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "hints": [
      "A hash set allows O(1) lookup to check if an element was already encountered."
    ],
    "editorial": {
      "approach": "Hash Set Lookup",
      "time": "O(N)",
      "space": "O(N)",
      "summary": "Insert elements into a Set. If the size of the set differs from array length, duplicates exist."
    },
    "functionName": "containsDuplicate",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": false
      },
      {
        "args": [
          [
            1,
            1,
            1,
            3,
            3,
            4,
            3,
            2,
            4,
            2
          ]
        ],
        "expected": true
      }
    ],
    "langTemplates": {
      "javascript": "function containsDuplicate(nums) {\n  const seen = new Set();\n  for (const n of nums) {\n    if (seen.has(n)) return true;\n    seen.add(n);\n  }\n  return false;\n}",
      "python": "def contains_duplicate(nums: list[int]) -> bool:\n    return len(nums) != len(set(nums))",
      "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int n : nums) {\n            if (!seen.add(n)) return true;\n        }\n        return false;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen(nums.begin(), nums.end());\n        return seen.size() != nums.size();\n    }\n};"
    }
  },
  {
    "id": "valid_anagram",
    "number": 242,
    "title": "Valid Anagram",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Arrays & Hashing",
    "platform": "LeetCode",
    "acceptanceRate": "63.8%",
    "companyTags": [
      "Google",
      "Amazon",
      "Uber",
      "Bloomberg"
    ],
    "description": "Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "examples": [
      {
        "input": "s = 'anagram', t = 'nagaram'",
        "output": "true",
        "explanation": "Both contain 3 a's, 1 n, 1 g, 1 r, 1 m."
      },
      {
        "input": "s = 'rat', t = 'car'",
        "output": "false",
        "explanation": "Characters differ."
      }
    ],
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    "hints": [
      "Count the frequency of each character or sort both strings."
    ],
    "editorial": {
      "approach": "Character Frequency Array",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Use an array of size 26 to tally character counts."
    },
    "functionName": "isAnagram",
    "testCases": [
      {
        "args": [
          "anagram",
          "nagaram"
        ],
        "expected": true
      },
      {
        "args": [
          "rat",
          "car"
        ],
        "expected": false
      }
    ],
    "langTemplates": {
      "javascript": "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - 97]++;\n    count[t.charCodeAt(i) - 97]--;\n  }\n  return count.every(c => c === 0);\n}",
      "python": "def is_anagram(s: str, t: str) -> bool:\n    if len(s) != len(t): return False\n    return sorted(s) == sorted(t)",
      "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            count[s.charAt(i) - 'a']++;\n            count[t.charAt(i) - 'a']--;\n        }\n        for (int c : count) if (c != 0) return false;\n        return true;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.length() != t.length()) return false;\n        vector<int> count(26, 0);\n        for (int i = 0; i < s.size(); i++) {\n            count[s[i] - 'a']++;\n            count[t[i] - 'a']--;\n        }\n        for (int c : count) if (c != 0) return false;\n        return true;\n    }\n};"
    }
  },
  {
    "id": "group_anagrams",
    "number": 49,
    "title": "Group Anagrams",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Arrays & Hashing",
    "platform": "LeetCode",
    "acceptanceRate": "68.2%",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Meta",
      "Apple"
    ],
    "description": "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    "examples": [
      {
        "input": "strs = ['eat','tea','tan','ate','nat','bat']",
        "output": "[['bat'],['nat','tan'],['ate','eat','tea']]",
        "explanation": "Anagrams are clustered by canonical form."
      }
    ],
    "constraints": [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    "hints": [
      "Sort each word to create a canonical signature, or build a 26-char count string as key."
    ],
    "editorial": {
      "approach": "Canonical Sorted Key Map",
      "time": "O(N * K log K)",
      "space": "O(N * K)",
      "summary": "Map sorted string representations to lists of matching original strings."
    },
    "functionName": "groupAnagrams",
    "testCases": [
      {
        "args": [
          [
            "eat",
            "tea",
            "tan",
            "ate",
            "nat",
            "bat"
          ]
        ],
        "expected": [
          [
            "eat",
            "tea",
            "ate"
          ],
          [
            "tan",
            "nat"
          ],
          [
            "bat"
          ]
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function groupAnagrams(strs) {\n  const map = {};\n  for (const s of strs) {\n    const key = s.split('').sort().join('');\n    if (!map[key]) map[key] = [];\n    map[key].push(s);\n  }\n  return Object.values(map);\n}",
      "python": "def group_anagrams(strs: list[str]) -> list[list[str]]:\n    from collections import defaultdict\n    ans = defaultdict(list)\n    for s in strs:\n        ans[''.join(sorted(s))].append(s)\n    return list(ans.values())",
      "java": "class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            char[] ca = s.toCharArray();\n            Arrays.sort(ca);\n            String key = String.valueOf(ca);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        unordered_map<string, vector<string>> mp;\n        for (string s : strs) {\n            string t = s;\n            sort(t.begin(), t.end());\n            mp[t].push_back(s);\n        }\n        vector<vector<string>> ans;\n        for (auto& p : mp) ans.push_back(p.second);\n        return ans;\n    }\n};"
    }
  },
  {
    "id": "top_k_frequent",
    "number": 347,
    "title": "Top K Frequent Elements",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Arrays & Hashing",
    "platform": "LeetCode",
    "acceptanceRate": "64.1%",
    "companyTags": [
      "Meta",
      "Amazon",
      "Google",
      "Yelp"
    ],
    "description": "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    "examples": [
      {
        "input": "nums = [1,1,1,2,2,3], k = 2",
        "output": "[1,2]",
        "explanation": "1 appears 3 times, 2 appears 2 times."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "k is in range [1, unique elements]."
    ],
    "hints": [
      "Bucket sort achieves O(N) linear time without a min-heap."
    ],
    "editorial": {
      "approach": "Bucket Sort",
      "time": "O(N)",
      "space": "O(N)",
      "summary": "Map numbers to frequencies, then group numbers into frequency buckets up to array size."
    },
    "functionName": "topKFrequent",
    "testCases": [
      {
        "args": [
          [
            1,
            1,
            1,
            2,
            2,
            3
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function topKFrequent(nums, k) {\n  const map = new Map();\n  nums.forEach(n => map.set(n, (map.get(n) || 0) + 1));\n  return [...map.entries()]\n    .sort((a, b) => b[1] - a[1])\n    .slice(0, k)\n    .map(e => e[0]);\n}",
      "python": "def top_k_frequent(nums: list[int], k: int) -> list[int]:\n    from collections import Counter\n    count = Counter(nums)\n    return [item for item, _ in count.most_common(k)]",
      "java": "class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> count = new HashMap<>();\n        for (int n : nums) count.put(n, count.getOrDefault(n, 0) + 1);\n        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> count.get(a) - count.get(b));\n        for (int n : count.keySet()) {\n            pq.add(n);\n            if (pq.size() > k) pq.poll();\n        }\n        int[] res = new int[k];\n        for (int i = 0; i < k; i++) res[i] = pq.poll();\n        return res;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        unordered_map<int, int> count;\n        for (int n : nums) count[n]++;\n        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;\n        for (auto& [n, freq] : count) {\n            pq.push({freq, n});\n            if (pq.size() > k) pq.pop();\n        }\n        vector<int> res;\n        while (!pq.empty()) { res.push_back(pq.top().second); pq.pop(); }\n        return res;\n    }\n};"
    }
  },
  {
    "id": "product_except_self",
    "number": 238,
    "title": "Product of Array Except Self",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Arrays & Hashing",
    "platform": "LeetCode",
    "acceptanceRate": "65.5%",
    "companyTags": [
      "Amazon",
      "Apple",
      "Google",
      "Microsoft"
    ],
    "description": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.",
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]",
        "explanation": "24 = 2*3*4, 12 = 1*3*4, 8 = 1*2*4, 6 = 1*2*3."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30"
    ],
    "hints": [
      "Calculate prefix products in forward pass, then multiply by postfix products in backward pass."
    ],
    "editorial": {
      "approach": "Prefix & Suffix Products",
      "time": "O(N)",
      "space": "O(1) extra",
      "summary": "Store prefix products directly in output array, then maintain a running suffix product accumulator."
    },
    "functionName": "productExceptSelf",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": [
          24,
          12,
          8,
          6
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function productExceptSelf(nums) {\n  const res = new Array(nums.length).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < nums.length; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n  let postfix = 1;\n  for (let i = nums.length - 1; i >= 0; i--) {\n    res[i] *= postfix;\n    postfix *= nums[i];\n  }\n  return res;\n}",
      "python": "def product_except_self(nums: list[int]) -> list[int]:\n    res = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    return res",
      "java": "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] res = new int[n];\n        res[0] = 1;\n        for (int i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];\n        int right = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            res[i] *= right;\n            right *= nums[i];\n        }\n        return res;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        int n = nums.size();\n        vector<int> res(n, 1);\n        for (int i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];\n        int right = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            res[i] *= right;\n            right *= nums[i];\n        }\n        return res;\n    }\n};"
    }
  },
  {
    "id": "longest_consecutive",
    "number": 128,
    "title": "Longest Consecutive Sequence",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Arrays & Hashing",
    "platform": "LeetCode",
    "acceptanceRate": "47.9%",
    "companyTags": [
      "Google",
      "Amazon",
      "Spotify",
      "Meta"
    ],
    "description": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.",
    "examples": [
      {
        "input": "nums = [100,4,200,1,3,2]",
        "output": "4",
        "explanation": "The longest consecutive sequence is [1, 2, 3, 4], length = 4."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "hints": [
      "Only start building a streak if (num - 1) is not in the set!"
    ],
    "editorial": {
      "approach": "Hash Set Sequence Expansion",
      "time": "O(N)",
      "space": "O(N)",
      "summary": "Store numbers in a Set. Iterate through numbers; if (n-1) is absent, n is a streak start. Count upwards."
    },
    "functionName": "longestConsecutive",
    "testCases": [
      {
        "args": [
          [
            100,
            4,
            200,
            1,
            3,
            2
          ]
        ],
        "expected": 4
      }
    ],
    "langTemplates": {
      "javascript": "function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let longest = 0;\n  for (const n of set) {\n    if (!set.has(n - 1)) {\n      let curr = n;\n      let streak = 1;\n      while (set.has(curr + 1)) {\n        curr++;\n        streak++;\n      }\n      longest = Math.max(longest, streak);\n    }\n  }\n  return longest;\n}",
      "python": "def longest_consecutive(nums: list[int]) -> int:\n    num_set = set(nums)\n    longest = 0\n    for n in num_set:\n        if n - 1 not in num_set:\n            length = 1\n            while n + length in num_set:\n                length += 1\n            longest = max(longest, length)\n    return longest",
      "java": "class Solution {\n    public int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int n : nums) set.add(n);\n        int longest = 0;\n        for (int n : set) {\n            if (!set.contains(n - 1)) {\n                int curr = n, streak = 1;\n                while (set.contains(curr + 1)) { curr++; streak++; }\n                longest = Math.max(longest, streak);\n            }\n        }\n        return longest;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        unordered_set<int> st(nums.begin(), nums.end());\n        int longest = 0;\n        for (int n : st) {\n            if (!st.count(n - 1)) {\n                int curr = n, streak = 1;\n                while (st.count(curr + 1)) { curr++; streak++; }\n                longest = max(longest, streak);\n            }\n        }\n        return longest;\n    }\n};"
    }
  },
  {
    "id": "valid_palindrome",
    "number": 125,
    "title": "Valid Palindrome",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Two Pointers",
    "platform": "LeetCode",
    "acceptanceRate": "46.2%",
    "companyTags": [
      "Meta",
      "Microsoft",
      "Amazon",
      "Uber"
    ],
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.",
    "examples": [
      {
        "input": "s = 'A man, a plan, a canal: Panama'",
        "output": "true",
        "explanation": "'amanaplanacanalpanama' is a palindrome."
      }
    ],
    "constraints": [
      "1 <= s.length <= 2 * 10^5"
    ],
    "hints": [
      "Use two pointers starting at opposite ends, skipping non-alphanumeric characters."
    ],
    "editorial": {
      "approach": "Two Pointers In-Place",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Left and right pointers move inward, matching characters after lowercase conversion."
    },
    "functionName": "isPalindrome",
    "testCases": [
      {
        "args": [
          "A man, a plan, a canal: Panama"
        ],
        "expected": true
      },
      {
        "args": [
          "race a car"
        ],
        "expected": false
      }
    ],
    "langTemplates": {
      "javascript": "function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    while (l < r && !/[a-zA-Z0-9]/.test(s[l])) l++;\n    while (l < r && !/[a-zA-Z0-9]/.test(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++; r--;\n  }\n  return true;\n}",
      "python": "def is_palindrome(s: str) -> bool:\n    filtered = [c.lower() for c in s if c.isalnum()]\n    return filtered == filtered[::-1]",
      "java": "class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;\n            l++; r--;\n        }\n        return true;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool isPalindrome(string s) {\n        int l = 0, r = s.size() - 1;\n        while (l < r) {\n            while (l < r && !isalnum(s[l])) l++;\n            while (l < r && !isalnum(s[r])) r--;\n            if (tolower(s[l]) != tolower(s[r])) return false;\n            l++; r--;\n        }\n        return true;\n    }\n};"
    }
  },
  {
    "id": "three_sum",
    "number": 15,
    "title": "3Sum",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Two Pointers",
    "platform": "LeetCode",
    "acceptanceRate": "33.7%",
    "companyTags": [
      "Amazon",
      "Meta",
      "Google",
      "Microsoft"
    ],
    "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.",
    "examples": [
      {
        "input": "nums = [-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]",
        "explanation": "Unique triplets summing to 0."
      }
    ],
    "constraints": [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    "hints": [
      "Sort the array first to make two-pointer matching and duplicate elimination trivial."
    ],
    "editorial": {
      "approach": "Sorting & Two Pointers",
      "time": "O(N^2)",
      "space": "O(1)",
      "summary": "Fix the first number, then use two pointers on the remainder to find complementary pairs."
    },
    "functionName": "threeSum",
    "testCases": [
      {
        "args": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "expected": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) l++;\n      else r--;\n    }\n  }\n  return res;\n}",
      "python": "def three_sum(nums: list[int]) -> list[list[int]]:\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l + 1]: l += 1\n                while l < r and nums[r] == nums[r - 1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res",
      "java": "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};"
    }
  },
  {
    "id": "container_water",
    "number": 11,
    "title": "Container With Most Water",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Two Pointers",
    "platform": "LeetCode",
    "acceptanceRate": "54.8%",
    "companyTags": [
      "Amazon",
      "Google",
      "Bloomberg",
      "Goldman Sachs"
    ],
    "description": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    "examples": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "explanation": "Max area between index 1 (height 8) and index 8 (height 7) is 7 * 7 = 49."
      }
    ],
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "hints": [
      "Always move the pointer with the smaller height, since moving the taller one cannot increase volume."
    ],
    "editorial": {
      "approach": "Two Pointers Inward Shift",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Area is min(h[l], h[r]) * (r - l). Advance the shorter boundary."
    },
    "functionName": "maxArea",
    "testCases": [
      {
        "args": [
          [
            1,
            8,
            6,
            2,
            5,
            4,
            8,
            3,
            7
          ]
        ],
        "expected": 49
      },
      {
        "args": [
          [
            1,
            1
          ]
        ],
        "expected": 1
      }
    ],
    "langTemplates": {
      "javascript": "function maxArea(height) {\n  let l = 0, r = height.length - 1, max = 0;\n  while (l < r) {\n    const area = Math.min(height[l], height[r]) * (r - l);\n    max = Math.max(max, area);\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return max;\n}",
      "python": "def max_area(height: list[int]) -> int:\n    l, r, max_w = 0, len(height) - 1, 0\n    while l < r:\n        max_w = max(max_w, min(height[l], height[r]) * (r - l))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return max_w",
      "java": "class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, max = 0;\n        while (l < r) {\n            max = Math.max(max, Math.min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return max;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int l = 0, r = height.size() - 1, maxW = 0;\n        while (l < r) {\n            maxW = max(maxW, min(height[l], height[r]) * (r - l));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxW;\n    }\n};"
    }
  },
  {
    "id": "trapping_rain_water",
    "number": 42,
    "title": "Trapping Rain Water",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Two Pointers",
    "platform": "LeetCode",
    "acceptanceRate": "60.4%",
    "companyTags": [
      "Google",
      "Amazon",
      "Goldman Sachs",
      "Apple"
    ],
    "description": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    "examples": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "explanation": "6 units of rainwater are trapped between elevation bars."
      }
    ],
    "constraints": [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    "hints": [
      "For each bar, trapped water is min(maxLeft, maxRight) - height[i]. Two pointers eliminate array allocations."
    ],
    "editorial": {
      "approach": "Two Pointers Max Tracking",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Maintain leftMax and rightMax while moving inwards from the shorter boundary."
    },
    "functionName": "trap",
    "testCases": [
      {
        "args": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      }
    ],
    "langTemplates": {
      "javascript": "function trap(height) {\n  if (!height.length) return 0;\n  let l = 0, r = height.length - 1;\n  let leftMax = height[l], rightMax = height[r], res = 0;\n  while (l < r) {\n    if (leftMax < rightMax) {\n      l++;\n      leftMax = Math.max(leftMax, height[l]);\n      res += leftMax - height[l];\n    } else {\n      r--;\n      rightMax = Math.max(rightMax, height[r]);\n      res += rightMax - height[r];\n    }\n  }\n  return res;\n}",
      "python": "def trap(height: list[int]) -> int:\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    left_max, right_max = height[l], height[r]\n    res = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            res += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            res += right_max - height[r]\n    return res",
      "java": "class Solution {\n    public int trap(int[] height) {\n        if (height.length == 0) return 0;\n        int l = 0, r = height.length - 1;\n        int leftMax = height[l], rightMax = height[r], res = 0;\n        while (l < r) {\n            if (leftMax < rightMax) {\n                l++;\n                leftMax = Math.max(leftMax, height[l]);\n                res += leftMax - height[l];\n            } else {\n                r--;\n                rightMax = Math.max(rightMax, height[r]);\n                res += rightMax - height[r];\n            }\n        }\n        return res;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        if (height.empty()) return 0;\n        int l = 0, r = height.size() - 1;\n        int leftMax = height[l], rightMax = height[r], res = 0;\n        while (l < r) {\n            if (leftMax < rightMax) {\n                l++;\n                leftMax = max(leftMax, height[l]);\n                res += leftMax - height[l];\n            } else {\n                r--;\n                rightMax = max(rightMax, height[r]);\n                res += rightMax - height[r];\n            }\n        }\n        return res;\n    }\n};"
    }
  },
  {
    "id": "best_time_stock",
    "number": 121,
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Sliding Window",
    "platform": "LeetCode",
    "acceptanceRate": "54.0%",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Apple",
      "Uber"
    ],
    "description": "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5."
      }
    ],
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "hints": [
      "Track the minimum price observed so far as you iterate."
    ],
    "editorial": {
      "approach": "One Pass Running Minimum",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Keep track of minPrice and update maxProfit = max(maxProfit, price - minPrice)."
    },
    "functionName": "maxProfit",
    "testCases": [
      {
        "args": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expected": 5
      },
      {
        "args": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expected": 0
      }
    ],
    "langTemplates": {
      "javascript": "function maxProfit(prices) {\n  let minPrice = Infinity, maxProfit = 0;\n  for (const p of prices) {\n    if (p < minPrice) minPrice = p;\n    else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n  }\n  return maxProfit;\n}",
      "python": "def max_profit(prices: list[int]) -> int:\n    min_p, max_p = float('inf'), 0\n    for p in prices:\n        if p < min_p: min_p = p\n        elif p - min_p > max_p: max_p = p - min_p\n    return max_p",
      "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        int minP = Integer.MAX_VALUE, maxP = 0;\n        for (int p : prices) {\n            if (p < minP) minP = p;\n            else if (p - minP > maxP) maxP = p - minP;\n        }\n        return maxP;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};"
    }
  },
  {
    "id": "longest_substring",
    "number": 3,
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Sliding Window",
    "platform": "LeetCode",
    "acceptanceRate": "34.5%",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta"
    ],
    "description": "Given a string s, find the length of the longest substring without repeating characters.",
    "examples": [
      {
        "input": "s = 'abcabcbb'",
        "output": "3",
        "explanation": "The answer is 'abc', with length 3."
      }
    ],
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "hints": [
      "Sliding window with hash set. When character already exists, shrink left boundary."
    ],
    "editorial": {
      "approach": "Dynamic Sliding Window with Set",
      "time": "O(N)",
      "space": "O(min(M, N))",
      "summary": "Expand right pointer; if char exists in set, increment left pointer and delete until unique."
    },
    "functionName": "lengthOfLongestSubstring",
    "testCases": [
      {
        "args": [
          "abcabcbb"
        ],
        "expected": 3
      },
      {
        "args": [
          "bbbbb"
        ],
        "expected": 1
      },
      {
        "args": [
          "pwwkew"
        ],
        "expected": 3
      }
    ],
    "langTemplates": {
      "javascript": "function lengthOfLongestSubstring(s) {\n  let maxLen = 0, l = 0;\n  const set = new Set();\n  for (let r = 0; r < s.length; r++) {\n    while (set.has(s[r])) { set.delete(s[l]); l++; }\n    set.add(s[r]);\n    maxLen = Math.max(maxLen, r - l + 1);\n  }\n  return maxLen;\n}",
      "python": "def length_of_longest_substring(s: str) -> int:\n    char_set = set()\n    l = 0\n    res = 0\n    for r in range(len(s)):\n        while s[r] in char_set:\n            char_set.remove(s[l])\n            l += 1\n        char_set.add(s[r])\n        res = max(res, r - l + 1)\n    return res",
      "java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int l = 0, max = 0;\n        for (int r = 0; r < s.length(); r++) {\n            while (set.contains(s.charAt(r))) { set.remove(s.charAt(l)); l++; }\n            set.add(s.charAt(r));\n            max = Math.max(max, r - l + 1);\n        }\n        return max;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_set<char> st;\n        int l = 0, maxL = 0;\n        for (int r = 0; r < s.size(); r++) {\n            while (st.count(s[r])) { st.erase(s[l]); l++; }\n            st.insert(s[r]);\n            maxL = max(maxL, r - l + 1);\n        }\n        return maxL;\n    }\n};"
    }
  },
  {
    "id": "min_window_substring",
    "number": 76,
    "title": "Minimum Window Substring",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Sliding Window",
    "platform": "LeetCode",
    "acceptanceRate": "42.0%",
    "companyTags": [
      "Meta",
      "Amazon",
      "Google",
      "Airbnb"
    ],
    "description": "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".",
    "examples": [
      {
        "input": "s = 'ADOBECODEBANC', t = 'ABC'",
        "output": "'BANC'",
        "explanation": "The minimum window substring 'BANC' includes 'A', 'B', and 'C' from string t."
      }
    ],
    "constraints": [
      "m == s.length",
      "n == t.length",
      "1 <= m, n <= 10^5"
    ],
    "hints": [
      "Maintain count of required characters satisfied. Shrink window from left once valid."
    ],
    "editorial": {
      "approach": "Two-Map Sliding Window with Condition Count",
      "time": "O(M + N)",
      "space": "O(1)",
      "summary": "Track have and need counts. When have == need, update smallest window and advance left."
    },
    "functionName": "minWindow",
    "testCases": [
      {
        "args": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      }
    ],
    "langTemplates": {
      "javascript": "function minWindow(s, t) {\n  if (!s || !t) return '';\n  const countT = {}, window = {};\n  for (const c of t) countT[c] = (countT[c] || 0) + 1;\n  let have = 0, need = Object.keys(countT).length;\n  let res = [-1, -1], resLen = Infinity, l = 0;\n  for (let r = 0; r < s.length; r++) {\n    const c = s[r];\n    window[c] = (window[c] || 0) + 1;\n    if (countT[c] && window[c] === countT[c]) have++;\n    while (have === need) {\n      if ((r - l + 1) < resLen) {\n        res = [l, r];\n        resLen = r - l + 1;\n      }\n      window[s[l]]--;\n      if (countT[s[l]] && window[s[l]] < countT[s[l]]) have--;\n      l++;\n    }\n  }\n  return resLen === Infinity ? '' : s.slice(res[0], res[1] + 1);\n}",
      "python": "def min_window(s: str, t: str) -> str:\n    if not t or not s: return ''\n    from collections import Counter\n    count_t = Counter(t)\n    window = {}\n    have, need = 0, len(count_t)\n    res, res_len = [-1, -1], float('inf')\n    l = 0\n    for r in range(len(s)):\n        c = s[r]\n        window[c] = window.get(c, 0) + 1\n        if c in count_t and window[c] == count_t[c]:\n            have += 1\n        while have == need:\n            if (r - l + 1) < res_len:\n                res = [l, r]\n                res_len = r - l + 1\n            window[s[l]] -= 1\n            if s[l] in count_t and window[s[l]] < count_t[s[l]]:\n                have -= 1\n            l += 1\n    return '' if res_len == float('inf') else s[res[0]:res[1] + 1]",
      "java": "class Solution {\n    public String minWindow(String s, String t) {\n        if (s.isEmpty() || t.isEmpty()) return \"\";\n        int[] map = new int[128];\n        for (char c : t.toCharArray()) map[c]++;\n        int l = 0, r = 0, minLen = Integer.MAX_VALUE, start = 0, count = t.length();\n        while (r < s.length()) {\n            if (map[s.charAt(r++)]-- > 0) count--;\n            while (count == 0) {\n                if (r - l < minLen) { minLen = r - l; start = l; }\n                if (map[s.charAt(l++)]++ == 0) count++;\n            }\n        }\n        return minLen == Integer.MAX_VALUE ? \"\" : s.substring(start, start + minLen);\n    }\n}",
      "cpp": "class Solution {\npublic:\n    string minWindow(string s, string t) {\n        vector<int> map(128, 0);\n        for (char c : t) map[c]++;\n        int l = 0, r = 0, minLen = INT_MAX, start = 0, count = t.size();\n        while (r < s.size()) {\n            if (map[s[r++]]-- > 0) count--;\n            while (count == 0) {\n                if (r - l < minLen) { minLen = r - l; start = l; }\n                if (map[s[l++]]++ == 0) count++;\n            }\n        }\n        return minLen == INT_MAX ? \"\" : s.substr(start, minLen);\n    }\n};"
    }
  },
  {
    "id": "valid_parentheses",
    "number": 20,
    "title": "Valid Parentheses",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Stack",
    "platform": "LeetCode",
    "acceptanceRate": "40.8%",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta"
    ],
    "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    "examples": [
      {
        "input": "s = '()[]{}'",
        "output": "true",
        "explanation": "All brackets matched in order."
      },
      {
        "input": "s = '(]'",
        "output": "false",
        "explanation": "Mismatched bracket types."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "hints": [
      "Use a stack. Push opening brackets; when closing bracket appears, pop and verify."
    ],
    "editorial": {
      "approach": "LIFO Stack Matching",
      "time": "O(N)",
      "space": "O(N)",
      "summary": "Map closing brackets to opening counterparts. Check stack top on each close."
    },
    "functionName": "isValid",
    "testCases": [
      {
        "args": [
          "()[]{}"
        ],
        "expected": true
      },
      {
        "args": [
          "(]"
        ],
        "expected": false
      },
      {
        "args": [
          "([{}])"
        ],
        "expected": true
      }
    ],
    "langTemplates": {
      "javascript": "function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (c === '(' || c === '{' || c === '[') stack.push(c);\n    else if (stack.pop() !== pairs[c]) return false;\n  }\n  return stack.length === 0;\n}",
      "python": "def is_valid(s: str) -> bool:\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in '({[':\n            stack.append(c)\n        elif not stack or stack.pop() != pairs[c]:\n            return False\n    return len(stack) == 0",
      "java": "class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(') st.push(')');\n            else if (c == '{') st.push('}');\n            else if (c == '[') st.push(']');\n            else if (st.empty() || st.top() != c) return false;\n            else st.pop();\n        }\n        return st.empty();\n    }\n};"
    }
  },
  {
    "id": "daily_temperatures",
    "number": 739,
    "title": "Daily Temperatures",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Stack",
    "platform": "LeetCode",
    "acceptanceRate": "66.3%",
    "companyTags": [
      "Amazon",
      "Google",
      "Meta",
      "Bloomberg"
    ],
    "description": "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.",
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Day 0 wait 1 day (74 > 73). Day 2 wait 4 days for 76."
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Maintain a monotonic decreasing stack of indices."
    ],
    "editorial": {
      "approach": "Monotonic Decreasing Stack",
      "time": "O(N)",
      "space": "O(N)",
      "summary": "Push index onto stack. While curr temp > stack top temp, pop and set delta = i - top."
    },
    "functionName": "dailyTemperatures",
    "testCases": [
      {
        "args": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function dailyTemperatures(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prevIdx = stack.pop();\n      res[prevIdx] = i - prevIdx;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
      "python": "def daily_temperatures(temperatures: list[int]) -> list[int]:\n    res = [0] * len(temperatures)\n    stack = []\n    for i, t in enumerate(temperatures):\n        while stack and t > stack[-1][0]:\n            _, prev_i = stack.pop()\n            res[prev_i] = i - prev_i\n        stack.append((t, i))\n    return res",
      "java": "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int[] res = new int[temperatures.length];\n        Stack<Integer> stack = new Stack<>();\n        for (int i = 0; i < temperatures.length; i++) {\n            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {\n                int prev = stack.pop();\n                res[prev] = i - prev;\n            }\n            stack.push(i);\n        }\n        return res;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        vector<int> res(temperatures.size(), 0);\n        stack<int> st;\n        for (int i = 0; i < temperatures.size(); i++) {\n            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {\n                int prev = st.top(); st.pop();\n                res[prev] = i - prev;\n            }\n            st.push(i);\n        }\n        return res;\n    }\n};"
    }
  },
  {
    "id": "largest_rectangle_histogram",
    "number": 84,
    "title": "Largest Rectangle in Histogram",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Stack",
    "platform": "LeetCode",
    "acceptanceRate": "43.5%",
    "companyTags": [
      "Google",
      "Amazon",
      "Uber",
      "Microsoft"
    ],
    "description": "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    "examples": [
      {
        "input": "heights = [2,1,5,6,2,3]",
        "output": "10",
        "explanation": "The maximum rectangle is between bars with heights 5 and 6, area = 5 * 2 = 10."
      }
    ],
    "constraints": [
      "1 <= heights.length <= 10^5",
      "0 <= heights[i] <= 10^4"
    ],
    "hints": [
      "Monotonic increasing stack tracks left boundary of each bar's maximum expansion."
    ],
    "editorial": {
      "approach": "Monotonic Stack Expansion",
      "time": "O(N)",
      "space": "O(N)",
      "summary": "Maintain pairs (start_index, height) in stack. When a shorter bar appears, pop and compute area."
    },
    "functionName": "largestRectangleArea",
    "testCases": [
      {
        "args": [
          [
            2,
            1,
            5,
            6,
            2,
            3
          ]
        ],
        "expected": 10
      }
    ],
    "langTemplates": {
      "javascript": "function largestRectangleArea(heights) {\n  let maxArea = 0;\n  const stack = [];\n  for (let i = 0; i <= heights.length; i++) {\n    const h = i === heights.length ? 0 : heights[i];\n    while (stack.length && h < heights[stack[stack.length - 1]]) {\n      const height = heights[stack.pop()];\n      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;\n      maxArea = Math.max(maxArea, height * width);\n    }\n    stack.push(i);\n  }\n  return maxArea;\n}",
      "python": "def largest_rectangle_area(heights: list[int]) -> int:\n    max_area = 0\n    stack = []\n    for i, h in enumerate(heights):\n        start = i\n        while stack and stack[-1][1] > h:\n            idx, height = stack.pop()\n            max_area = max(max_area, height * (i - idx))\n            start = idx\n        stack.append((start, h))\n    for idx, height in stack:\n        max_area = max(max_area, height * (len(heights) - idx))\n    return max_area",
      "java": "class Solution {\n    public int largestRectangleArea(int[] heights) {\n        int max = 0;\n        Stack<Integer> st = new Stack<>();\n        for (int i = 0; i <= heights.length; i++) {\n            int h = (i == heights.length) ? 0 : heights[i];\n            while (!st.isEmpty() && h < heights[st.peek()]) {\n                int height = heights[st.pop()];\n                int width = st.isEmpty() ? i : i - st.peek() - 1;\n                max = Math.max(max, height * width);\n            }\n            st.push(i);\n        }\n        return max;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int largestRectangleArea(vector<int>& heights) {\n        int maxA = 0;\n        stack<int> st;\n        for (int i = 0; i <= heights.size(); i++) {\n            int h = (i == heights.size()) ? 0 : heights[i];\n            while (!st.empty() && h < heights[st.top()]) {\n                int height = heights[st.top()]; st.pop();\n                int width = st.empty() ? i : i - st.top() - 1;\n                maxA = max(maxA, height * width);\n            }\n            st.push(i);\n        }\n        return maxA;\n    }\n};"
    }
  },
  {
    "id": "binary_search",
    "number": 704,
    "title": "Binary Search",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Binary Search",
    "platform": "LeetCode",
    "acceptanceRate": "57.3%",
    "companyTags": [
      "Apple",
      "Microsoft",
      "Amazon",
      "Google"
    ],
    "description": "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    "examples": [
      {
        "input": "nums = [-1,0,3,5,9,12], target = 9",
        "output": "4",
        "explanation": "9 exists in nums and its index is 4."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "nums is sorted in ascending order."
    ],
    "hints": [
      "Compare target with middle element. Cut search space in half."
    ],
    "editorial": {
      "approach": "Iterative Bisection",
      "time": "O(log N)",
      "space": "O(1)",
      "summary": "Compute mid = l + (r - l) / 2 to prevent 32-bit overflow."
    },
    "functionName": "search",
    "testCases": [
      {
        "args": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          9
        ],
        "expected": 4
      },
      {
        "args": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          2
        ],
        "expected": -1
      }
    ],
    "langTemplates": {
      "javascript": "function search(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1;\n}",
      "python": "def search(nums: list[int], target: int) -> int:\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = l + (r - l) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n};"
    }
  },
  {
    "id": "search_rotated_array",
    "number": 33,
    "title": "Search in Rotated Sorted Array",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Binary Search",
    "platform": "LeetCode",
    "acceptanceRate": "40.1%",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta"
    ],
    "description": "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index.\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    "examples": [
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 0",
        "output": "4",
        "explanation": "0 is found at index 4."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values are distinct."
    ],
    "hints": [
      "At least one half (left or right) of the array is always strictly sorted."
    ],
    "editorial": {
      "approach": "Modified Binary Search with Sorted Half Detection",
      "time": "O(log N)",
      "space": "O(1)",
      "summary": "Determine if left half is sorted. If target lies in sorted range, recurse left; else right."
    },
    "functionName": "search",
    "testCases": [
      {
        "args": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          0
        ],
        "expected": 4
      },
      {
        "args": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          3
        ],
        "expected": -1
      }
    ],
    "langTemplates": {
      "javascript": "function search(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[l] <= nums[mid]) {\n      if (target >= nums[l] && target < nums[mid]) r = mid - 1;\n      else l = mid + 1;\n    } else {\n      if (target > nums[mid] && target <= nums[r]) l = mid + 1;\n      else r = mid - 1;\n    }\n  }\n  return -1;\n}",
      "python": "def search(nums: list[int], target: int) -> int:\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = l + (r - l) // 2\n        if nums[mid] == target: return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid + 1\n            else: r = mid - 1\n    return -1",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (target >= nums[l] && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (target > nums[mid] && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (target >= nums[l] && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (target > nums[mid] && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n};"
    }
  },
  {
    "id": "median_two_sorted",
    "number": 4,
    "title": "Median of Two Sorted Arrays",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Binary Search",
    "platform": "LeetCode",
    "acceptanceRate": "39.6%",
    "companyTags": [
      "Google",
      "Amazon",
      "Apple",
      "Goldman Sachs"
    ],
    "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
    "examples": [
      {
        "input": "nums1 = [1,3], nums2 = [2]",
        "output": "2.0",
        "explanation": "Merged array = [1,2,3], median is 2.0."
      }
    ],
    "constraints": [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m, n <= 1000",
      "1 <= m + n <= 2000"
    ],
    "hints": [
      "Binary search on the partition of the smaller array."
    ],
    "editorial": {
      "approach": "Dual Partition Binary Search",
      "time": "O(log(min(M, N)))",
      "space": "O(1)",
      "summary": "Partition both arrays such that left halves combined equal right halves, and maxLeft <= minRight."
    },
    "functionName": "findMedianSortedArrays",
    "testCases": [
      {
        "args": [
          [
            1,
            3
          ],
          [
            2
          ]
        ],
        "expected": 2.0
      },
      {
        "args": [
          [
            1,
            2
          ],
          [
            3,
            4
          ]
        ],
        "expected": 2.5
      }
    ],
    "langTemplates": {
      "javascript": "function findMedianSortedArrays(nums1, nums2) {\n  let A = nums1, B = nums2;\n  if (A.length > B.length) { [A, B] = [B, A]; }\n  const total = A.length + B.length, half = Math.floor(total / 2);\n  let l = 0, r = A.length - 1;\n  while (true) {\n    const i = Math.floor((l + r) / 2);\n    const j = half - i - 2;\n    const Aleft = i >= 0 ? A[i] : -Infinity;\n    const Aright = (i + 1) < A.length ? A[i + 1] : Infinity;\n    const Bleft = j >= 0 ? B[j] : -Infinity;\n    const Bright = (j + 1) < B.length ? B[j + 1] : Infinity;\n    if (Aleft <= Bright && Bleft <= Aright) {\n      if (total % 2) return Math.min(Aright, Bright);\n      return (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2;\n    } else if (Aleft > Bright) r = i - 1;\n    else l = i + 1;\n  }\n}",
      "python": "def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:\n    A, B = nums1, nums2\n    if len(A) > len(B): A, B = B, A\n    total = len(A) + len(B)\n    half = total // 2\n    l, r = 0, len(A) - 1\n    while True:\n        i = (l + r) // 2\n        j = half - i - 2\n        Aleft = A[i] if i >= 0 else float('-inf')\n        Aright = A[i + 1] if (i + 1) < len(A) else float('inf')\n        Bleft = B[j] if j >= 0 else float('-inf')\n        Bright = B[j + 1] if (j + 1) < len(B) else float('inf')\n        if Aleft <= Bright and Bleft <= Aright:\n            if total % 2: return min(Aright, Bright)\n            return (max(Aleft, Bleft) + min(Aright, Bright)) / 2\n        elif Aleft > Bright: r = i - 1\n        else: l = i + 1",
      "java": "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        int[] A = nums1, B = nums2;\n        if (A.length > B.length) { int[] temp = A; A = B; B = temp; }\n        int total = A.length + B.length, half = total / 2;\n        int l = 0, r = A.length - 1;\n        while (true) {\n            int i = (l <= r) ? (l + (r - l) / 2) : -1;\n            int j = half - i - 2;\n            double Aleft = i >= 0 ? A[i] : Double.NEGATIVE_INFINITY;\n            double Aright = (i + 1) < A.length ? A[i + 1] : Double.POSITIVE_INFINITY;\n            double Bleft = j >= 0 ? B[j] : Double.NEGATIVE_INFINITY;\n            double Bright = (j + 1) < B.length ? B[j + 1] : Double.POSITIVE_INFINITY;\n            if (Aleft <= Bright && Bleft <= Aright) {\n                if (total % 2 != 0) return Math.min(Aright, Bright);\n                return (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2.0;\n            } else if (Aleft > Bright) r = i - 1;\n            else l = i + 1;\n        }\n    }\n}",
      "cpp": "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        vector<int>& A = nums1, &B = nums2;\n        if (A.size() > B.size()) swap(A, B);\n        int total = A.size() + B.size(), half = total / 2;\n        int l = 0, r = A.size() - 1;\n        while (true) {\n            int i = (l <= r) ? (l + (r - l) / 2) : -1;\n            int j = half - i - 2;\n            int Aleft = i >= 0 ? A[i] : INT_MIN;\n            int Aright = (i + 1) < A.size() ? A[i + 1] : INT_MAX;\n            int Bleft = j >= 0 ? B[j] : INT_MIN;\n            int Bright = (j + 1) < B.size() ? B[j + 1] : INT_MAX;\n            if (Aleft <= Bright && Bleft <= Aright) {\n                if (total % 2) return min(Aright, Bright);\n                return (max(Aleft, Bleft) + min(Aright, Bright)) / 2.0;\n            } else if (Aleft > Bright) r = i - 1;\n            else l = i + 1;\n        }\n    }\n};"
    }
  },
  {
    "id": "reverse_linked_list",
    "number": 206,
    "title": "Reverse Linked List",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Linked List",
    "platform": "LeetCode",
    "acceptanceRate": "74.9%",
    "companyTags": [
      "Amazon",
      "Google",
      "Apple",
      "Infosys"
    ],
    "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    "examples": [
      {
        "input": "head = [1,2,3,4,5]",
        "output": "[5,4,3,2,1]",
        "explanation": "Pointers flipped backwards."
      }
    ],
    "constraints": [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    "hints": [
      "Iterate with prev, curr, and next pointers."
    ],
    "editorial": {
      "approach": "3-Pointer Iteration",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Store curr.next in nextTemp, point curr.next to prev, advance prev and curr."
    },
    "functionName": "reverseList",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": [
          5,
          4,
          3,
          2,
          1
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}",
      "python": "def reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev",
      "java": "class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr, *curr = head;\n        while (curr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};"
    }
  },
  {
    "id": "invert_binary_tree",
    "number": 226,
    "title": "Invert Binary Tree",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Trees",
    "platform": "LeetCode",
    "acceptanceRate": "76.8%",
    "companyTags": [
      "Google",
      "Amazon",
      "Apple",
      "Twitter"
    ],
    "description": "Given the root of a binary tree, invert the tree, and return its root.\n\nEvery left child is swapped with its right child recursively.",
    "examples": [
      {
        "input": "root = [4,2,7,1,3,6,9]",
        "output": "[4,7,2,9,6,3,1]",
        "explanation": "Tree mirrored along vertical axis."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 100]."
    ],
    "hints": [
      "Swap left and right children recursively for all subtrees."
    ],
    "editorial": {
      "approach": "Recursive Post-order DFS",
      "time": "O(N)",
      "space": "O(H)",
      "summary": "Swap root.left and root.right, then recursively invert subtrees."
    },
    "functionName": "invertTree",
    "testCases": [
      {
        "args": [
          [
            4,
            2,
            7,
            1,
            3,
            6,
            9
          ]
        ],
        "expected": [
          4,
          7,
          2,
          9,
          6,
          3,
          1
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}",
      "python": "def invert_tree(root):\n    if not root: return None\n    root.left, root.right = invert_tree(root.right), invert_tree(root.left)\n    return root",
      "java": "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left;\n        root.left = invertTree(root.right);\n        root.right = invertTree(temp);\n        return root;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (!root) return nullptr;\n        swap(root->left, root->right);\n        invertTree(root->left);\n        invertTree(root->right);\n        return root;\n    }\n};"
    }
  },
  {
    "id": "validate_bst",
    "number": 98,
    "title": "Validate Binary Search Tree",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Trees",
    "platform": "LeetCode",
    "acceptanceRate": "32.6%",
    "companyTags": [
      "Amazon",
      "Bloomberg",
      "Microsoft",
      "Meta"
    ],
    "description": "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node's key.\n- The right subtree of a node contains only nodes with keys greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.",
    "examples": [
      {
        "input": "root = [2,1,3]",
        "output": "true",
        "explanation": "2 > 1 and 2 < 3."
      },
      {
        "input": "root = [5,1,4,null,null,3,6]",
        "output": "false",
        "explanation": "Root 5 is greater than right child 4."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-2^31 <= Node.val <= 2^31 - 1"
    ],
    "hints": [
      "Pass down valid range (min, max) for every node in the recursive call."
    ],
    "editorial": {
      "approach": "Bounded DFS",
      "time": "O(N)",
      "space": "O(H)",
      "summary": "Every node must satisfy low < node.val < high. When moving left, high = node.val; right, low = node.val."
    },
    "functionName": "isValidBST",
    "testCases": [
      {
        "args": [
          [
            2,
            1,
            3
          ]
        ],
        "expected": true
      },
      {
        "args": [
          [
            5,
            1,
            4,
            null,
            null,
            3,
            6
          ]
        ],
        "expected": false
      }
    ],
    "langTemplates": {
      "javascript": "function isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}",
      "python": "def is_valid_bst(root, low=float('-inf'), high=float('inf')) -> bool:\n    if not root: return True\n    if not (low < root.val < high): return False\n    return is_valid_bst(root.left, low, root.val) and is_valid_bst(root.right, root.val, high)",
      "java": "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return validate(root, null, null);\n    }\n    private boolean validate(TreeNode node, Integer low, Integer high) {\n        if (node == null) return true;\n        if ((low != null && node.val <= low) || (high != null && node.val >= high)) return false;\n        return validate(node.left, low, node.val) && validate(node.right, node.val, high);\n    }\n}",
      "cpp": "class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        return validate(root, LONG_MIN, LONG_MAX);\n    }\n    bool validate(TreeNode* node, long low, long high) {\n        if (!node) return true;\n        if (node->val <= low || node->val >= high) return false;\n        return validate(node->left, low, node->val) && validate(node->right, node->val, high);\n    }\n};"
    }
  },
  {
    "id": "binary_tree_max_path",
    "number": 124,
    "title": "Binary Tree Maximum Path Sum",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Trees",
    "platform": "LeetCode",
    "acceptanceRate": "39.9%",
    "companyTags": [
      "Meta",
      "Amazon",
      "DoorDash",
      "Google"
    ],
    "description": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.\n\nThe path sum of a path is the sum of the node's values in the path.\n\nGiven the root of a binary tree, return the maximum path sum of any non-empty path.",
    "examples": [
      {
        "input": "root = [-10,9,20,null,null,15,7]",
        "output": "42",
        "explanation": "The optimal path is 15 -> 20 -> 7 with sum 15 + 20 + 7 = 42."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [1, 3 * 10^4].",
      "-1000 <= Node.val <= 1000"
    ],
    "hints": [
      "For each node, compute max gain from left and right subtrees (ignoring negatives). Max path with split = node.val + left + right."
    ],
    "editorial": {
      "approach": "Post-order DFS with Global Max",
      "time": "O(N)",
      "space": "O(H)",
      "summary": "Return single-branch maximum to parent node while updating global max path across left + root + right."
    },
    "functionName": "maxPathSum",
    "testCases": [
      {
        "args": [
          [
            -10,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": 42
      }
    ],
    "langTemplates": {
      "javascript": "function maxPathSum(root) {\n  let max = -Infinity;\n  function dfs(node) {\n    if (!node) return 0;\n    const left = Math.max(0, dfs(node.left));\n    const right = Math.max(0, dfs(node.right));\n    max = Math.max(max, node.val + left + right);\n    return node.val + Math.max(left, right);\n  }\n  dfs(root);\n  return max;\n}",
      "python": "def max_path_sum(root) -> int:\n    res = [root.val]\n    def dfs(node):\n        if not node: return 0\n        left_max = max(dfs(node.left), 0)\n        right_max = max(dfs(node.right), 0)\n        res[0] = max(res[0], node.val + left_max + right_max)\n        return node.val + max(left_max, right_max)\n    dfs(root)\n    return res[0]",
      "java": "class Solution {\n    int max = Integer.MIN_VALUE;\n    public int maxPathSum(TreeNode root) {\n        dfs(root);\n        return max;\n    }\n    private int dfs(TreeNode node) {\n        if (node == null) return 0;\n        int left = Math.max(0, dfs(node.left));\n        int right = Math.max(0, dfs(node.right));\n        max = Math.max(max, node.val + left + right);\n        return node.val + Math.max(left, right);\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int maxS = INT_MIN;\n    int maxPathSum(TreeNode* root) {\n        dfs(root);\n        return maxS;\n    }\n    int dfs(TreeNode* node) {\n        if (!node) return 0;\n        int left = max(0, dfs(node->left));\n        int right = max(0, dfs(node->right));\n        maxS = max(maxS, node->val + left + right);\n        return node->val + max(left, right);\n    }\n};"
    }
  },
  {
    "id": "number_of_islands",
    "number": 200,
    "title": "Number of Islands",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Graphs",
    "platform": "LeetCode",
    "acceptanceRate": "58.7%",
    "companyTags": [
      "Amazon",
      "Google",
      "Bloomberg",
      "Meta"
    ],
    "description": "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [['1','1','0'],['1','1','0'],['0','0','1']]",
        "output": "2",
        "explanation": "Top left cluster is 1 island, bottom right is another."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    "hints": [
      "Whenever you see a '1', launch a DFS/BFS to sink the entire connected island to '0'."
    ],
    "editorial": {
      "approach": "Connected Components via BFS/DFS",
      "time": "O(M * N)",
      "space": "O(M * N)",
      "summary": "Iterate cells. When land is encountered, increment count and sink neighboring land."
    },
    "functionName": "numIslands",
    "testCases": [
      {
        "args": [
          [
            [
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0"
            ],
            [
              "0",
              "0",
              "1"
            ]
          ]
        ],
        "expected": 2
      }
    ],
    "langTemplates": {
      "javascript": "function numIslands(grid) {\n  if (!grid || !grid.length) return 0;\n  let islands = 0;\n  const rows = grid.length, cols = grid[0].length;\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n  }\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === '1') {\n        islands++;\n        dfs(r, c);\n      }\n    }\n  }\n  return islands;\n}",
      "python": "def num_islands(grid: list[list[str]]) -> int:\n    if not grid: return 0\n    rows, cols = len(grid), len(grid[0])\n    islands = 0\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0': return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                islands += 1\n                dfs(r, c)\n    return islands",
      "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    private void dfs(char[][] g, int r, int c) {\n        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] == '0') return;\n        g[r][c] = '0';\n        dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        int count = 0;\n        for (int r = 0; r < grid.size(); r++) {\n            for (int c = 0; c < grid[0].size(); c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    void dfs(vector<vector<char>>& g, int r, int c) {\n        if (r < 0 || c < 0 || r >= g.size() || c >= g[0].size() || g[r][c] == '0') return;\n        g[r][c] = '0';\n        dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);\n    }\n};"
    }
  },
  {
    "id": "rotting_oranges",
    "number": 994,
    "title": "Rotting Oranges",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Graphs",
    "platform": "LeetCode",
    "acceptanceRate": "54.1%",
    "companyTags": [
      "Amazon",
      "Uber",
      "Microsoft",
      "Oracle"
    ],
    "description": "You are given an m x n grid where each cell can have one of three values:\n- 0 representing an empty cell,\n- 1 representing a fresh orange, or\n- 2 representing a rotten orange.\n\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.",
    "examples": [
      {
        "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
        "output": "4",
        "explanation": "4 minutes for rot to spread across all oranges."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 10"
    ],
    "hints": [
      "Multi-source BFS. Enqueue all initial rotten oranges simultaneously."
    ],
    "editorial": {
      "approach": "Multi-Source BFS",
      "time": "O(M * N)",
      "space": "O(M * N)",
      "summary": "Start BFS queue with all rotten cells. Decrement fresh count level by level."
    },
    "functionName": "orangesRotting",
    "testCases": [
      {
        "args": [
          [
            [
              2,
              1,
              1
            ],
            [
              1,
              1,
              0
            ],
            [
              0,
              1,
              1
            ]
          ]
        ],
        "expected": 4
      }
    ],
    "langTemplates": {
      "javascript": "function orangesRotting(grid) {\n  const q = [];\n  let fresh = 0, time = 0;\n  const rows = grid.length, cols = grid[0].length;\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === 1) fresh++;\n      if (grid[r][c] === 2) q.push([r, c]);\n    }\n  }\n  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n  while (q.length && fresh > 0) {\n    const len = q.length;\n    for (let i = 0; i < len; i++) {\n      const [r, c] = q.shift();\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && grid[nr][nc] === 1) {\n          grid[nr][nc] = 2;\n          fresh--;\n          q.push([nr, nc]);\n        }\n      }\n    }\n    time++;\n  }\n  return fresh === 0 ? time : -1;\n}",
      "python": "def oranges_rotting(grid: list[list[int]]) -> int:\n    from collections import deque\n    q = deque()\n    time, fresh = 0, 0\n    rows, cols = len(grid), len(grid[0])\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 1: fresh += 1\n            elif grid[r][c] == 2: q.append((r, c))\n    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]\n    while q and fresh > 0:\n        for _ in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in directions:\n                row, col = r + dr, c + dc\n                if (0 <= row < rows and 0 <= col < cols and grid[row][col] == 1):\n                    grid[row][col] = 2\n                    q.append((row, col))\n                    fresh -= 1\n        time += 1\n    return time if fresh == 0 else -1",
      "java": "class Solution {\n    public int orangesRotting(int[][] grid) {\n        Queue<int[]> q = new LinkedList<>();\n        int fresh = 0, time = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == 1) fresh++;\n                else if (grid[r][c] == 2) q.offer(new int[]{r, c});\n            }\n        }\n        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n        while (!q.isEmpty() && fresh > 0) {\n            int size = q.size();\n            for (int i = 0; i < size; i++) {\n                int[] curr = q.poll();\n                for (int[] d : dirs) {\n                    int nr = curr[0] + d[0], nc = curr[1] + d[1];\n                    if (nr >= 0 && nc >= 0 && nr < grid.length && nc < grid[0].length && grid[nr][nc] == 1) {\n                        grid[nr][nc] = 2;\n                        fresh--;\n                        q.offer(new int[]{nr, nc});\n                    }\n                }\n            }\n            time++;\n        }\n        return fresh == 0 ? time : -1;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int orangesRotting(vector<vector<int>>& grid) {\n        queue<pair<int, int>> q;\n        int fresh = 0, time = 0;\n        int R = grid.size(), C = grid[0].size();\n        for (int r = 0; r < R; r++) {\n            for (int c = 0; c < C; c++) {\n                if (grid[r][c] == 1) fresh++;\n                else if (grid[r][c] == 2) q.push({r, c});\n            }\n        }\n        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};\n        while (!q.empty() && fresh > 0) {\n            int sz = q.size();\n            for (int i = 0; i < sz; i++) {\n                auto [r, c] = q.front(); q.pop();\n                for (int d = 0; d < 4; d++) {\n                    int nr = r + dr[d], nc = c + dc[d];\n                    if (nr >= 0 && nc >= 0 && nr < R && nc < C && grid[nr][nc] == 1) {\n                        grid[nr][nc] = 2;\n                        fresh--;\n                        q.push({nr, nc});\n                    }\n                }\n            }\n            time++;\n        }\n        return fresh == 0 ? time : -1;\n    }\n};"
    }
  },
  {
    "id": "word_ladder",
    "number": 127,
    "title": "Word Ladder",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Graphs",
    "platform": "LeetCode",
    "acceptanceRate": "38.3%",
    "companyTags": [
      "Amazon",
      "Google",
      "Facebook",
      "LinkedIn"
    ],
    "description": "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:\n- Every adjacent pair of words differs by a single letter.\n- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.\n- sk == endWord\n\nGiven two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
    "examples": [
      {
        "input": "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']",
        "output": "5",
        "explanation": "'hit' -> 'hot' -> 'dot' -> 'dog' -> 'cog' is 5 words."
      }
    ],
    "constraints": [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000"
    ],
    "hints": [
      "Shortest path in an unweighted graph is solved with BFS."
    ],
    "editorial": {
      "approach": "Pattern-based BFS",
      "time": "O(N * M^2)",
      "space": "O(N * M^2)",
      "summary": "Cluster words by generic patterns (e.g. h*t). BFS from beginWord to endWord."
    },
    "functionName": "ladderLength",
    "testCases": [
      {
        "args": [
          "hit",
          "cog",
          [
            "hot",
            "dot",
            "dog",
            "lot",
            "log",
            "cog"
          ]
        ],
        "expected": 5
      }
    ],
    "langTemplates": {
      "javascript": "function ladderLength(beginWord, endWord, wordList) {\n  const wordSet = new Set(wordList);\n  if (!wordSet.has(endWord)) return 0;\n  let queue = [[beginWord, 1]];\n  while (queue.length) {\n    const [word, len] = queue.shift();\n    if (word === endWord) return len;\n    for (let i = 0; i < word.length; i++) {\n      for (let c = 97; c <= 122; c++) {\n        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);\n        if (wordSet.has(next)) {\n          wordSet.delete(next);\n          queue.push([next, len + 1]);\n        }\n      }\n    }\n  }\n  return 0;\n}",
      "python": "def ladder_length(begin_word: str, end_word: str, word_list: list[str]) -> int:\n    from collections import deque, defaultdict\n    if end_word not in word_list: return 0\n    nei = defaultdict(list)\n    for word in word_list:\n        for j in range(len(word)):\n            pattern = word[:j] + '*' + word[j + 1:]\n            nei[pattern].append(word)\n    q = deque([begin_word])\n    visited = set([begin_word])\n    res = 1\n    while q:\n        for _ in range(len(q)):\n            word = q.popleft()\n            if word == end_word: return res\n            for j in range(len(word)):\n                pattern = word[:j] + '*' + word[j + 1:]\n                for neighbor in nei[pattern]:\n                    if neighbor not in visited:\n                        visited.add(neighbor)\n                        q.append(neighbor)\n        res += 1\n    return 0",
      "java": "class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        Set<String> set = new HashSet<>(wordList);\n        if (!set.contains(endWord)) return 0;\n        Queue<String> q = new LinkedList<>();\n        q.add(beginWord);\n        int level = 1;\n        while (!q.isEmpty()) {\n            int size = q.size();\n            for (int i = 0; i < size; i++) {\n                String w = q.poll();\n                if (w.equals(endWord)) return level;\n                char[] chs = w.toCharArray();\n                for (int j = 0; j < chs.length; j++) {\n                    char orig = chs[j];\n                    for (char c = 'a'; c <= 'z'; c++) {\n                        chs[j] = c;\n                        String next = String.valueOf(chs);\n                        if (set.remove(next)) q.add(next);\n                    }\n                    chs[j] = orig;\n                }\n            }\n            level++;\n        }\n        return 0;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        unordered_set<string> st(wordList.begin(), wordList.end());\n        if (!st.count(endWord)) return 0;\n        queue<string> q;\n        q.push(beginWord);\n        int level = 1;\n        while (!q.empty()) {\n            int sz = q.size();\n            for (int k = 0; k < sz; k++) {\n                string w = q.front(); q.pop();\n                if (w == endWord) return level;\n                for (int i = 0; i < w.size(); i++) {\n                    char orig = w[i];\n                    for (char c = 'a'; c <= 'z'; c++) {\n                        w[i] = c;\n                        if (st.erase(w)) q.push(w);\n                    }\n                    w[i] = orig;\n                }\n            }\n            level++;\n        }\n        return 0;\n    }\n};"
    }
  },
  {
    "id": "climbing_stairs",
    "number": 70,
    "title": "Climbing Stairs",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Dynamic Programming",
    "platform": "LeetCode",
    "acceptanceRate": "52.8%",
    "companyTags": [
      "Amazon",
      "Google",
      "Apple",
      "Uber"
    ],
    "description": "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "examples": [
      {
        "input": "n = 3",
        "output": "3",
        "explanation": "Ways: 1+1+1, 1+2, 2+1."
      }
    ],
    "constraints": [
      "1 <= n <= 45"
    ],
    "hints": [
      "To reach step n, you must arrive from step n-1 or step n-2. dp[n] = dp[n-1] + dp[n-2]."
    ],
    "editorial": {
      "approach": "Fibonacci DP State Compression",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Base cases 1 and 2. Use two rolling variables to track the two previous steps."
    },
    "functionName": "climbStairs",
    "testCases": [
      {
        "args": [
          2
        ],
        "expected": 2
      },
      {
        "args": [
          3
        ],
        "expected": 3
      },
      {
        "args": [
          5
        ],
        "expected": 8
      }
    ],
    "langTemplates": {
      "javascript": "function climbStairs(n) {\n  if (n <= 2) return n;\n  let one = 1, two = 2;\n  for (let i = 3; i <= n; i++) {\n    const temp = one + two;\n    one = two;\n    two = temp;\n  }\n  return two;\n}",
      "python": "def climb_stairs(n: int) -> int:\n    if n <= 2: return n\n    one, two = 1, 2\n    for _ in range(3, n + 1):\n        one, two = two, one + two\n    return two",
      "java": "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int one = 1, two = 2;\n        for (int i = 3; i <= n; i++) {\n            int temp = one + two;\n            one = two;\n            two = temp;\n        }\n        return two;\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int one = 1, two = 2;\n        for (int i = 3; i <= n; i++) {\n            int temp = one + two;\n            one = two;\n            two = temp;\n        }\n        return two;\n    }\n};"
    }
  },
  {
    "id": "coin_change",
    "number": 322,
    "title": "Coin Change",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Dynamic Programming",
    "platform": "LeetCode",
    "acceptanceRate": "43.1%",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Bloomberg",
      "Google"
    ],
    "description": "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.",
    "examples": [
      {
        "input": "coins = [1,2,5], amount = 11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1 (3 coins)."
      }
    ],
    "constraints": [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    "hints": [
      "Bottom-up DP: dp[i] = min(dp[i], dp[i - coin] + 1)."
    ],
    "editorial": {
      "approach": "Bottom-up 1D DP",
      "time": "O(amount * coins.length)",
      "space": "O(amount)",
      "summary": "Initialize DP table with Infinity. Base case dp[0] = 0."
    },
    "functionName": "coinChange",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      },
      {
        "args": [
          [
            2
          ],
          3
        ],
        "expected": -1
      }
    ],
    "langTemplates": {
      "javascript": "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
      "python": "def coin_change(coins: list[int], amount: int) -> int:\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1",
      "java": "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i - c >= 0) dp[i] = min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};"
    }
  },
  {
    "id": "longest_common_subsequence",
    "number": 1143,
    "title": "Longest Common Subsequence",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Dynamic Programming",
    "platform": "LeetCode",
    "acceptanceRate": "59.2%",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "PayPal"
    ],
    "description": "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.",
    "examples": [
      {
        "input": "text1 = 'abcde', text2 = 'ace'",
        "output": "3",
        "explanation": "The longest common subsequence is 'ace' and its length is 3."
      }
    ],
    "constraints": [
      "1 <= text1.length, text2.length <= 1000",
      "text1 and text2 consist of only lowercase English characters."
    ],
    "hints": [
      "2D DP grid. If text1[i] == text2[j], dp[i][j] = 1 + dp[i-1][j-1]."
    ],
    "editorial": {
      "approach": "2D Grid DP",
      "time": "O(M * N)",
      "space": "O(M * N)",
      "summary": "If characters match, take diagonal + 1. Otherwise, take max(top, left)."
    },
    "functionName": "longestCommonSubsequence",
    "testCases": [
      {
        "args": [
          "abcde",
          "ace"
        ],
        "expected": 3
      }
    ],
    "langTemplates": {
      "javascript": "function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
      "python": "def longest_common_subsequence(text1: str, text2: str) -> int:\n    dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]\n    for i in range(len(text1) - 1, -1, -1):\n        for j in range(len(text2) - 1, -1, -1):\n            if text1[i] == text2[j]:\n                dp[i][j] = 1 + dp[i + 1][j + 1]\n            else:\n                dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])\n    return dp[0][0]",
      "java": "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        int m = text1.length(), n = text2.length();\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (text1.charAt(i - 1) == text2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;\n                else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n        return dp[m][n];\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int longestCommonSubsequence(string text1, string text2) {\n        int m = text1.size(), n = text2.size();\n        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n                else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n        return dp[m][n];\n    }\n};"
    }
  },
  {
    "id": "edit_distance",
    "number": 72,
    "title": "Edit Distance",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Dynamic Programming",
    "platform": "LeetCode",
    "acceptanceRate": "56.4%",
    "companyTags": [
      "Google",
      "Amazon",
      "Microsoft",
      "Snapchat"
    ],
    "description": "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character",
    "examples": [
      {
        "input": "word1 = 'horse', word2 = 'ros'",
        "output": "3",
        "explanation": "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e')."
      }
    ],
    "constraints": [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters."
    ],
    "hints": [
      "2D DP: insertion, deletion, and replacement corresponding to dp[i-1][j], dp[i][j-1], dp[i-1][j-1]."
    ],
    "editorial": {
      "approach": "Levenshtein Distance 2D DP",
      "time": "O(M * N)",
      "space": "O(M * N)",
      "summary": "dp[i][j] = dp[i-1][j-1] if match; else 1 + min(insert, delete, replace)."
    },
    "functionName": "minDistance",
    "testCases": [
      {
        "args": [
          "horse",
          "ros"
        ],
        "expected": 3
      },
      {
        "args": [
          "intention",
          "execution"
        ],
        "expected": 5
      }
    ],
    "langTemplates": {
      "javascript": "function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
      "python": "def min_distance(word1: str, word2: str) -> int:\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1): dp[i][0] = i\n    for j in range(n + 1): dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i - 1] == word2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]",
      "java": "class Solution {\n    public int minDistance(String word1, String word2) {\n        int m = word1.length(), n = word2.length();\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 0; i <= m; i++) dp[i][0] = i;\n        for (int j = 0; j <= n; j++) dp[0][j] = j;\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (word1.charAt(i - 1) == word2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];\n                else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));\n            }\n        }\n        return dp[m][n];\n    }\n}",
      "cpp": "class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        int m = word1.size(), n = word2.size();\n        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n        for (int i = 0; i <= m; i++) dp[i][0] = i;\n        for (int j = 0; j <= n; j++) dp[0][j] = j;\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n                else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});\n            }\n        }\n        return dp[m][n];\n    }\n};"
    }
  },
  {
    "id": "hr_diagonal_difference",
    "number": 101,
    "title": "Diagonal Difference",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Arrays & Hashing",
    "platform": "HackerRank",
    "acceptanceRate": "92.1%",
    "companyTags": [
      "Amazon",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "description": "Given a square matrix, calculate the absolute difference between the sums of its diagonals.\n\nFor example, the square matrix arr is shown below:\n1 2 3\n4 5 6\n9 8 9\nThe left-to-right diagonal = 1 + 5 + 9 = 15. The right-to-left diagonal = 3 + 5 + 9 = 17. Their absolute difference is |15 - 17| = 2.",
    "examples": [
      {
        "input": "arr = [[11, 2, 4], [4, 5, 6], [10, 8, -12]]",
        "output": "15",
        "explanation": "Primary = 11 + 5 - 12 = 4. Secondary = 4 + 5 + 10 = 19. |4 - 19| = 15."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "-100 <= arr[i][j] <= 100"
    ],
    "hints": [
      "Primary diagonal element is arr[i][i]. Secondary diagonal element is arr[i][n - 1 - i]."
    ],
    "editorial": {
      "approach": "Single Pass Diagonal Accumulation",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Iterate row i from 0 to n-1. Sum arr[i][i] and arr[i][n - 1 - i]."
    },
    "functionName": "diagonalDifference",
    "testCases": [
      {
        "args": [
          [
            [
              11,
              2,
              4
            ],
            [
              4,
              5,
              6
            ],
            [
              10,
              8,
              -12
            ]
          ]
        ],
        "expected": 15
      }
    ],
    "langTemplates": {
      "javascript": "function diagonalDifference(arr) {\n  let primary = 0, secondary = 0, n = arr.length;\n  for (let i = 0; i < n; i++) {\n    primary += arr[i][i];\n    secondary += arr[i][n - 1 - i];\n  }\n  return Math.abs(primary - secondary);\n}",
      "python": "def diagonal_difference(arr: list[list[int]]) -> int:\n    primary, secondary, n = 0, 0, len(arr)\n    for i in range(n):\n        primary += arr[i][i]\n        secondary += arr[i][n - 1 - i]\n    return abs(primary - secondary)",
      "java": "class Solution {\n    public static int diagonalDifference(List<List<Integer>> arr) {\n        int primary = 0, secondary = 0, n = arr.size();\n        for (int i = 0; i < n; i++) {\n            primary += arr.get(i).get(i);\n            secondary += arr.get(i).get(n - 1 - i);\n        }\n        return Math.abs(primary - secondary);\n    }\n}",
      "cpp": "int diagonalDifference(vector<vector<int>> arr) {\n    int primary = 0, secondary = 0, n = arr.size();\n    for (int i = 0; i < n; i++) {\n        primary += arr[i][i];\n        secondary += arr[i][n - 1 - i];\n    }\n    return abs(primary - secondary);\n}"
    }
  },
  {
    "id": "hr_plus_minus",
    "number": 102,
    "title": "Plus Minus",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Arrays & Hashing",
    "platform": "HackerRank",
    "acceptanceRate": "89.5%",
    "companyTags": [
      "Infosys",
      "Wipro",
      "TCS Digital"
    ],
    "description": "Given an array of integers, calculate the ratios of its elements that are positive, negative, and zero. Print the decimal value of each fraction on a new line with 6 places after the decimal.",
    "examples": [
      {
        "input": "arr = [-4, 3, -9, 0, 4, 1]",
        "output": "0.500000\n0.333333\n0.166667",
        "explanation": "3 positive, 2 negative, 1 zero out of 6 elements."
      }
    ],
    "constraints": [
      "0 < n <= 100",
      "-100 <= arr[i] <= 100"
    ],
    "hints": [
      "Count positives, negatives, zeros, then divide each by array length."
    ],
    "editorial": {
      "approach": "Direct Counting & Formatting",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "One pass through array counting categories."
    },
    "functionName": "plusMinus",
    "testCases": [
      {
        "args": [
          [
            -4,
            3,
            -9,
            0,
            4,
            1
          ]
        ],
        "expected": [
          0.5,
          0.333333,
          0.166667
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function plusMinus(arr) {\n  let pos = 0, neg = 0, zero = 0, n = arr.length;\n  for (const x of arr) {\n    if (x > 0) pos++;\n    else if (x < 0) neg++;\n    else zero++;\n  }\n  return [\n    Number((pos / n).toFixed(6)),\n    Number((neg / n).toFixed(6)),\n    Number((zero / n).toFixed(6))\n  ];\n}",
      "python": "def plus_minus(arr: list[int]) -> list[float]:\n    n = len(arr)\n    pos = sum(1 for x in arr if x > 0) / n\n    neg = sum(1 for x in arr if x < 0) / n\n    zero = sum(1 for x in arr if x == 0) / n\n    return [round(pos, 6), round(neg, 6), round(zero, 6)]",
      "java": "class Solution {\n    public static void plusMinus(List<Integer> arr) {\n        double n = arr.size(), pos = 0, neg = 0, zero = 0;\n        for (int x : arr) {\n            if (x > 0) pos++;\n            else if (x < 0) neg++;\n            else zero++;\n        }\n        System.out.printf(\"%.6f\\n%.6f\\n%.6f\\n\", pos / n, neg / n, zero / n);\n    }\n}",
      "cpp": "void plusMinus(vector<int> arr) {\n    double n = arr.size(), pos = 0, neg = 0, zero = 0;\n    for (int x : arr) {\n        if (x > 0) pos++;\n        else if (x < 0) neg++;\n        else zero++;\n    }\n    printf(\"%.6f\\n%.6f\\n%.6f\\n\", pos / n, neg / n, zero / n);\n}"
    }
  },
  {
    "id": "hr_sock_merchant",
    "number": 103,
    "title": "Sales by Match (Sock Merchant)",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Arrays & Hashing",
    "platform": "HackerRank",
    "acceptanceRate": "91.2%",
    "companyTags": [
      "Amazon",
      "Cisco",
      "Paytm"
    ],
    "description": "There is a large pile of socks that must be paired by color. Given an array of integers representing the color of each sock, determine how many pairs of socks with matching colors there are.",
    "examples": [
      {
        "input": "n = 9, ar = [10, 20, 20, 10, 10, 30, 50, 10, 20]",
        "output": "3",
        "explanation": "Three matching pairs: two 10s pairs and one 20s pair."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "1 <= ar[i] <= 100"
    ],
    "hints": [
      "Use a frequency map or set to toggle pairs."
    ],
    "editorial": {
      "approach": "Set Matching Toggle",
      "time": "O(N)",
      "space": "O(N)",
      "summary": "If color is in set, pair is formed (remove and increment count). Otherwise add to set."
    },
    "functionName": "sockMerchant",
    "testCases": [
      {
        "args": [
          9,
          [
            10,
            20,
            20,
            10,
            10,
            30,
            50,
            10,
            20
          ]
        ],
        "expected": 3
      }
    ],
    "langTemplates": {
      "javascript": "function sockMerchant(n, ar) {\n  const set = new Set();\n  let pairs = 0;\n  for (const c of ar) {\n    if (set.has(c)) {\n      pairs++;\n      set.delete(c);\n    } else {\n      set.add(c);\n    }\n  }\n  return pairs;\n}",
      "python": "def sock_merchant(n: int, ar: list[int]) -> int:\n    from collections import Counter\n    return sum(v // 2 for v in Counter(ar).values())",
      "java": "class Solution {\n    public static int sockMerchant(int n, List<Integer> ar) {\n        Set<Integer> set = new HashSet<>();\n        int pairs = 0;\n        for (int c : ar) {\n            if (!set.add(c)) {\n                pairs++;\n                set.remove(c);\n            }\n        }\n        return pairs;\n    }\n}",
      "cpp": "int sockMerchant(int n, vector<int> ar) {\n    unordered_set<int> st;\n    int pairs = 0;\n    for (int c : ar) {\n        if (st.count(c)) {\n            pairs++;\n            st.erase(c);\n        } else {\n            st.insert(c);\n        }\n    }\n    return pairs;\n}"
    }
  },
  {
    "id": "hr_balanced_brackets",
    "number": 104,
    "title": "HackerRank: Balanced Brackets",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Stack",
    "platform": "HackerRank",
    "acceptanceRate": "72.4%",
    "companyTags": [
      "Oracle",
      "Goldman Sachs",
      "TCS Digital"
    ],
    "description": "A bracket is considered to be any one of the following characters: (, ), {, }, [, or ].\n\nTwo brackets are considered to be a matched pair if an opening bracket occurs to the left of a closing bracket of the exact same type. Complete the isBalanced function to return YES or NO.",
    "examples": [
      {
        "input": "s = '{[()]}'",
        "output": "'YES'",
        "explanation": "Brackets matched properly."
      },
      {
        "input": "s = '{[(])}'",
        "output": "'NO'",
        "explanation": "Closing bracket order is invalid."
      }
    ],
    "constraints": [
      "1 <= s.length <= 1000"
    ],
    "hints": [
      "Use a stack. Match each closing bracket against top."
    ],
    "editorial": {
      "approach": "LIFO Stack Matching",
      "time": "O(N)",
      "space": "O(N)",
      "summary": "Return YES if stack empty at end and all pops matched, else NO."
    },
    "functionName": "isBalanced",
    "testCases": [
      {
        "args": [
          "{[()]}"
        ],
        "expected": "YES"
      },
      {
        "args": [
          "{[(])}"
        ],
        "expected": "NO"
      }
    ],
    "langTemplates": {
      "javascript": "function isBalanced(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (c === '(' || c === '{' || c === '[') stack.push(c);\n    else if (stack.pop() !== pairs[c]) return 'NO';\n  }\n  return stack.length === 0 ? 'YES' : 'NO';\n}",
      "python": "def is_balanced(s: str) -> str:\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in '({[': stack.append(c)\n        elif not stack or stack.pop() != pairs[c]: return 'NO'\n    return 'YES' if not stack else 'NO'",
      "java": "class Solution {\n    public static String isBalanced(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return \"NO\";\n        }\n        return stack.isEmpty() ? \"YES\" : \"NO\";\n    }\n}",
      "cpp": "string isBalanced(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(') st.push(')');\n        else if (c == '{') st.push('}');\n        else if (c == '[') st.push(']');\n        else if (st.empty() || st.top() != c) return \"NO\";\n        else st.pop();\n    }\n    return st.empty() ? \"YES\" : \"NO\";\n}"
    }
  },
  {
    "id": "hr_bfs_shortest_reach",
    "number": 105,
    "title": "Breadth First Search: Shortest Reach",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Graphs",
    "platform": "HackerRank",
    "acceptanceRate": "68.0%",
    "companyTags": [
      "Amazon",
      "Google",
      "Uber"
    ],
    "description": "Consider an undirected graph consisting of n nodes where each node is labeled from 1 to n and the edge weight between any two connected nodes is 6.\n\nGiven a starting node s, compute the shortest distance to each other node. If a node is unreachable, return -1 for that node.",
    "examples": [
      {
        "input": "n = 4, edges = [[1, 2], [1, 3]], s = 1",
        "output": "[6, 6, -1]",
        "explanation": "Distances to nodes 2, 3 is 6, node 4 is unreachable (-1)."
      }
    ],
    "constraints": [
      "2 <= n <= 1000",
      "1 <= m <= n*(n-1)/2"
    ],
    "hints": [
      "Run standard BFS queue from s multiplying level depth by 6."
    ],
    "editorial": {
      "approach": "Level-order BFS Distance Calculation",
      "time": "O(V + E)",
      "space": "O(V + E)",
      "summary": "Unweighted BFS explores shortest paths level by level."
    },
    "functionName": "bfs",
    "testCases": [
      {
        "args": [
          4,
          2,
          [
            [
              1,
              2
            ],
            [
              1,
              3
            ]
          ],
          1
        ],
        "expected": [
          6,
          6,
          -1
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function bfs(n, m, edges, s) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const dist = new Array(n + 1).fill(-1);\n  dist[s] = 0;\n  const queue = [s];\n  while (queue.length) {\n    const curr = queue.shift();\n    for (const neighbor of adj[curr]) {\n      if (dist[neighbor] === -1) {\n        dist[neighbor] = dist[curr] + 6;\n        queue.push(neighbor);\n      }\n    }\n  }\n  const res = [];\n  for (let i = 1; i <= n; i++) {\n    if (i !== s) res.push(dist[i]);\n  }\n  return res;\n}",
      "python": "def bfs(n: int, m: int, edges: list[list[int]], s: int) -> list[int]:\n    from collections import deque, defaultdict\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    dist = {i: -1 for i in range(1, n + 1)}\n    dist[s] = 0\n    q = deque([s])\n    while q:\n        curr = q.popleft()\n        for nxt in adj[curr]:\n            if dist[nxt] == -1:\n                dist[nxt] = dist[curr] + 6\n                q.append(nxt)\n    return [dist[i] for i in range(1, n + 1) if i != s]",
      "java": "class Solution {\n    public static List<Integer> bfs(int n, int m, List<List<Integer>> edges, int s) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());\n        for (List<Integer> e : edges) {\n            adj.get(e.get(0)).add(e.get(1));\n            adj.get(e.get(1)).add(e.get(0));\n        }\n        int[] dist = new int[n + 1];\n        Arrays.fill(dist, -1);\n        dist[s] = 0;\n        Queue<Integer> q = new LinkedList<>();\n        q.add(s);\n        while (!q.isEmpty()) {\n            int curr = q.poll();\n            for (int next : adj.get(curr)) {\n                if (dist[next] == -1) {\n                    dist[next] = dist[curr] + 6;\n                    q.add(next);\n                }\n            }\n        }\n        List<Integer> res = new ArrayList<>();\n        for (int i = 1; i <= n; i++) if (i != s) res.add(dist[i]);\n        return res;\n    }\n}",
      "cpp": "vector<int> bfs(int n, int m, vector<vector<int>> edges, int s) {\n    vector<vector<int>> adj(n + 1);\n    for (auto& e : edges) {\n        adj[e[0]].push_back(e[1]);\n        adj[e[1]].push_back(e[0]);\n    }\n    vector<int> dist(n + 1, -1);\n    dist[s] = 0;\n    queue<int> q;\n    q.push(s);\n    while (!q.empty()) {\n        int curr = q.front(); q.pop();\n        for (int next : adj[curr]) {\n            if (dist[next] == -1) {\n                dist[next] = dist[curr] + 6;\n                q.push(next);\n            }\n        }\n    }\n    vector<int> res;\n    for (int i = 1; i <= n; i++) if (i != s) res.push_back(dist[i]);\n    return res;\n}"
    }
  },
  {
    "id": "hr_castle_grid",
    "number": 106,
    "title": "HackerRank: Castle on the Grid",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Graphs",
    "platform": "HackerRank",
    "acceptanceRate": "56.9%",
    "companyTags": [
      "Amazon",
      "Goldman Sachs",
      "DE Shaw"
    ],
    "description": "You are given a square grid with some cells open (.) and some blocked (X). Your playing piece is in a castle at position (startX, startY) and your goal is to move it to (goalX, goalY) in the shortest number of turns.\n\nIn a single move you can advance any number of open steps along any orthogonal direction (like a chess rook). Calculate the minimum turns required.",
    "examples": [
      {
        "input": "grid = ['.X.', '.X.', '...'], startX = 0, startY = 0, goalX = 0, goalY = 2",
        "output": "3",
        "explanation": "Rook moves around the X block to reach goal in 3 turns."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "startX, startY, goalX, goalY < n"
    ],
    "hints": [
      "BFS where each step extends as far as possible in all 4 cardinal directions until blocked."
    ],
    "editorial": {
      "approach": "Rook-ray BFS Traversal",
      "time": "O(N^3) bounded",
      "space": "O(N^2)",
      "summary": "Expand in 4 directions until a wall or boundary is encountered. Mark cells visited with turn count."
    },
    "functionName": "minimumMoves",
    "testCases": [
      {
        "args": [
          [
            ".X.",
            ".X.",
            "..."
          ],
          0,
          0,
          0,
          2
        ],
        "expected": 3
      }
    ],
    "langTemplates": {
      "javascript": "function minimumMoves(grid, startX, startY, goalX, goalY) {\n  const n = grid.length;\n  const visited = Array.from({ length: n }, () => new Array(n).fill(false));\n  const queue = [[startX, startY, 0]];\n  visited[startX][startY] = true;\n  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n  while (queue.length) {\n    const [r, c, moves] = queue.shift();\n    if (r === goalX && c === goalY) return moves;\n    for (const [dr, dc] of dirs) {\n      let nr = r + dr, nc = c + dc;\n      while (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === '.') {\n        if (!visited[nr][nc]) {\n          visited[nr][nc] = true;\n          queue.push([nr, nc, moves + 1]);\n        }\n        nr += dr;\n        nc += dc;\n      }\n    }\n  }\n  return -1;\n}",
      "python": "def minimum_moves(grid: list[str], startX: int, startY: int, goalX: int, goalY: int) -> int:\n    from collections import deque\n    n = len(grid)\n    visited = [[False] * n for _ in range(n)]\n    q = deque([(startX, startY, 0)])\n    visited[startX][startY] = True\n    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]\n    while q:\n        r, c, moves = q.popleft()\n        if r == goalX and c == goalY: return moves\n        for dr, dc in dirs:\n            nr, nc = r + dr, c + dc\n            while 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == '.':\n                if not visited[nr][nc]:\n                    visited[nr][nc] = True\n                    q.append((nr, nc, moves + 1))\n                nr += dr; nc += dc\n    return -1",
      "java": "class Solution {\n    public static int minimumMoves(List<String> grid, int startX, int startY, int goalX, int goalY) {\n        int n = grid.size();\n        boolean[][] visited = new boolean[n][n];\n        Queue<int[]> q = new LinkedList<>();\n        q.add(new int[]{startX, startY, 0});\n        visited[startX][startY] = true;\n        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n        while (!q.isEmpty()) {\n            int[] curr = q.poll();\n            int r = curr[0], c = curr[1], moves = curr[2];\n            if (r == goalX && c == goalY) return moves;\n            for (int[] d : dirs) {\n                int nr = r + d[0], nc = c + d[1];\n                while (nr >= 0 && nr < n && nc >= 0 && nc < n && grid.get(nr).charAt(nc) == '.') {\n                    if (!visited[nr][nc]) {\n                        visited[nr][nc] = true;\n                        q.add(new int[]{nr, nc, moves + 1});\n                    }\n                    nr += d[0]; nc += d[1];\n                }\n            }\n        }\n        return -1;\n    }\n}",
      "cpp": "int minimumMoves(vector<string> grid, int startX, int startY, int goalX, int goalY) {\n    int n = grid.size();\n    vector<vector<bool>> visited(n, vector<bool>(n, false));\n    queue<tuple<int, int, int>> q;\n    q.push({startX, startY, 0});\n    visited[startX][startY] = true;\n    int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};\n    while (!q.empty()) {\n        auto [r, c, moves] = q.front(); q.pop();\n        if (r == goalX && c == goalY) return moves;\n        for (int d = 0; d < 4; d++) {\n            int nr = r + dr[d], nc = c + dc[d];\n            while (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == '.') {\n                if (!visited[nr][nc]) {\n                    visited[nr][nc] = true;\n                    q.push({nr, nc, moves + 1});\n                }\n                nr += dr[d]; nc += dc[d];\n            }\n        }\n    }\n    return -1;\n}"
    }
  },
  {
    "id": "merge_two_sorted_lists",
    "number": 21,
    "title": "Merge Two Sorted Lists",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Linked List",
    "platform": "LeetCode",
    "acceptanceRate": "62.8%",
    "companyTags": [
      "Amazon",
      "Apple",
      "Microsoft"
    ],
    "description": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    "examples": [
      {
        "input": "list1 = [1,2,4], list2 = [1,3,4]",
        "output": "[1,1,2,3,4,4]",
        "explanation": "Sorted splice of both lists."
      }
    ],
    "constraints": [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100"
    ],
    "hints": [
      "Use a dummy head node. Compare node values and advance current pointer."
    ],
    "editorial": {
      "approach": "Two-pointer Splice",
      "time": "O(N + M)",
      "space": "O(1)",
      "summary": "Iterate until one list exhausts; splice remainder."
    },
    "functionName": "mergeTwoLists",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            4
          ],
          [
            1,
            3,
            4
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function mergeTwoLists(list1, list2) {\n  const dummy = { val: 0, next: null };\n  let curr = dummy;\n  while (list1 && list2) {\n    if (list1.val <= list2.val) { curr.next = list1; list1 = list1.next; }\n    else { curr.next = list2; list2 = list2.next; }\n    curr = curr.next;\n  }\n  curr.next = list1 || list2;\n  return dummy.next;\n}",
      "python": "def merge_two_lists(l1, l2):\n    dummy = ListNode()\n    tail = dummy\n    while l1 and l2:\n        if l1.val < l2.val:\n            tail.next = l1\n            l1 = l1.next\n        else:\n            tail.next = l2\n            l2 = l2.next\n        tail = tail.next\n    tail.next = l1 or l2\n    return dummy.next",
      "java": "class Solution {\n    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(0), tail = dummy;\n        while (l1 != null && l2 != null) {\n            if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }\n            else { tail.next = l2; l2 = l2.next; }\n            tail = tail.next;\n        }\n        tail.next = l1 != null ? l1 : l2;\n        return dummy.next;\n    }\n}",
      "cpp": "ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* tail = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) { tail->next = l1; l1 = l1->next; }\n        else { tail->next = l2; l2 = l2->next; }\n        tail = tail->next;\n    }\n    tail->next = l1 ? l1 : l2;\n    return dummy.next;\n}"
    }
  },
  {
    "id": "linked_list_cycle",
    "number": 141,
    "title": "Linked List Cycle",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Linked List",
    "platform": "LeetCode",
    "acceptanceRate": "48.9%",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "Spotify"
    ],
    "description": "Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Return true if there is a cycle in the linked list. Otherwise, return false.",
    "examples": [
      {
        "input": "head = [3,2,0,-4], pos = 1",
        "output": "true",
        "explanation": "There is a cycle where tail connects to 1st node."
      }
    ],
    "constraints": [
      "The number of nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5"
    ],
    "hints": [
      "Floyd's Tortoise and Hare algorithm with slow and fast pointers."
    ],
    "editorial": {
      "approach": "Floyd's Cycle Detection",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Slow pointer moves 1 step, fast pointer moves 2 steps. If they meet, a cycle exists."
    },
    "functionName": "hasCycle",
    "testCases": [
      {
        "args": [
          [
            3,
            2,
            0,
            -4
          ]
        ],
        "expected": false
      }
    ],
    "langTemplates": {
      "javascript": "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
      "python": "def has_cycle(head) -> bool:\n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False",
      "java": "public class Solution {\n    public boolean hasCycle(ListNode head) {\n        ListNode slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n}",
      "cpp": "bool hasCycle(ListNode *head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}"
    }
  },
  {
    "id": "single_number",
    "number": 136,
    "title": "Single Number",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Bit Manipulation",
    "platform": "LeetCode",
    "acceptanceRate": "71.6%",
    "companyTags": [
      "Amazon",
      "Google",
      "Airbnb"
    ],
    "description": "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.",
    "examples": [
      {
        "input": "nums = [2,2,1]",
        "output": "1",
        "explanation": "2 XOR 2 = 0, leaving 1."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4"
    ],
    "hints": [
      "XOR of a number with itself is 0, and XOR with 0 is the number itself."
    ],
    "editorial": {
      "approach": "Bitwise XOR Accumulator",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "XOR all numbers together; identical pairs cancel out to 0, leaving the unique element."
    },
    "functionName": "singleNumber",
    "testCases": [
      {
        "args": [
          [
            2,
            2,
            1
          ]
        ],
        "expected": 1
      },
      {
        "args": [
          [
            4,
            1,
            2,
            1,
            2
          ]
        ],
        "expected": 4
      }
    ],
    "langTemplates": {
      "javascript": "function singleNumber(nums) {\n  let res = 0;\n  for (const n of nums) res ^= n;\n  return res;\n}",
      "python": "def single_number(nums: list[int]) -> int:\n    res = 0\n    for n in nums: res ^= n\n    return res",
      "java": "class Solution {\n    public int singleNumber(int[] nums) {\n        int res = 0;\n        for (int n : nums) res ^= n;\n        return res;\n    }\n}",
      "cpp": "int singleNumber(vector<int>& nums) {\n    int res = 0;\n    for (int n : nums) res ^= n;\n    return res;\n}"
    }
  },
  {
    "id": "maximum_subarray_kadane",
    "number": 53,
    "title": "Maximum Subarray (Kadane's Algorithm)",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Greedy",
    "platform": "LeetCode",
    "acceptanceRate": "50.4%",
    "companyTags": [
      "Amazon",
      "Microsoft",
      "LinkedIn",
      "Apple"
    ],
    "description": "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    "examples": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6",
        "explanation": "The subarray [4,-1,2,1] has the largest sum 6."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "hints": [
      "Whenever current running sum drops below 0, reset it to 0."
    ],
    "editorial": {
      "approach": "Kadane's Greedy Scan",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "currSum = max(num, currSum + num). Track global max."
    },
    "functionName": "maxSubArray",
    "testCases": [
      {
        "args": [
          [
            -2,
            1,
            -3,
            4,
            -1,
            2,
            1,
            -5,
            4
          ]
        ],
        "expected": 6
      }
    ],
    "langTemplates": {
      "javascript": "function maxSubArray(nums) {\n  let maxSoFar = nums[0], currMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currMax = Math.max(nums[i], currMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  return maxSoFar;\n}",
      "python": "def max_sub_array(nums: list[int]) -> int:\n    max_so_far, curr = nums[0], nums[0]\n    for x in nums[1:]:\n        curr = max(x, curr + x)\n        max_so_far = max(max_so_far, curr)\n    return max_so_far",
      "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        int max = nums[0], curr = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            curr = Math.max(nums[i], curr + nums[i]);\n            max = Math.max(max, curr);\n        }\n        return max;\n    }\n}",
      "cpp": "int maxSubArray(vector<int>& nums) {\n    int maxS = nums[0], curr = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        curr = max(nums[i], curr + nums[i]);\n        maxS = max(maxS, curr);\n    }\n    return maxS;\n}"
    }
  },
  {
    "id": "hr_simple_array_sum",
    "number": 107,
    "title": "HackerRank: Simple Array Sum",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Arrays & Hashing",
    "platform": "HackerRank",
    "acceptanceRate": "95.8%",
    "companyTags": [
      "Cognizant",
      "TCS",
      "Infosys"
    ],
    "description": "Given an array of integers, find the sum of its elements.\n\nFor example, if the array ar = [1, 2, 3], 1 + 2 + 3 = 6, so return 6.",
    "examples": [
      {
        "input": "ar = [1, 2, 3, 4, 10, 11]",
        "output": "31",
        "explanation": "1 + 2 + 3 + 4 + 10 + 11 = 31."
      }
    ],
    "constraints": [
      "0 < n, ar[i] <= 1000"
    ],
    "hints": [
      "Iterate and accumulate into a running sum."
    ],
    "editorial": {
      "approach": "Linear Scan",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Standard accumulator sum."
    },
    "functionName": "simpleArraySum",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3,
            4,
            10,
            11
          ]
        ],
        "expected": 31
      }
    ],
    "langTemplates": {
      "javascript": "function simpleArraySum(ar) {\n  return ar.reduce((acc, val) => acc + val, 0);\n}",
      "python": "def simple_array_sum(ar: list[int]) -> int:\n    return sum(ar)",
      "java": "class Solution {\n    public static int simpleArraySum(List<Integer> ar) {\n        int sum = 0;\n        for (int n : ar) sum += n;\n        return sum;\n    }\n}",
      "cpp": "int simpleArraySum(vector<int> ar) {\n    int s = 0;\n    for (int n : ar) s += n;\n    return s;\n}"
    }
  },
  {
    "id": "hr_staircase",
    "number": 108,
    "title": "HackerRank: Staircase",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Arrays & Hashing",
    "platform": "HackerRank",
    "acceptanceRate": "88.1%",
    "companyTags": [
      "Amazon",
      "TCS Digital"
    ],
    "description": "Staircase detail: This is a staircase of size n = 4:\n   #\n  ##\n ###\n####\nIts base and height are both equal to n. It is drawn using # symbols and spaces. The last line is not preceded by any spaces. Write a program that prints a staircase of size n.",
    "examples": [
      {
        "input": "n = 6",
        "output": "     #\n    ##\n   ###\n  ####\n #####\n######",
        "explanation": "Right-aligned staircase of size 6."
      }
    ],
    "constraints": [
      "0 < n <= 100"
    ],
    "hints": [
      "Row i has (n - i) spaces followed by i hashes."
    ],
    "editorial": {
      "approach": "Nested Formatting",
      "time": "O(N^2)",
      "space": "O(N)",
      "summary": "For each row 1 to n, output (n-i) spaces and i hashes."
    },
    "functionName": "staircase",
    "testCases": [
      {
        "args": [
          4
        ],
        "expected": "   #\n  ##\n ###\n####"
      }
    ],
    "langTemplates": {
      "javascript": "function staircase(n) {\n  const lines = [];\n  for (let i = 1; i <= n; i++) {\n    lines.push(' '.repeat(n - i) + '#'.repeat(i));\n  }\n  return lines.join('\\n');\n}",
      "python": "def staircase(n: int) -> str:\n    return '\\n'.join(' ' * (n - i) + '#' * i for i in range(1, n + 1))",
      "java": "class Solution {\n    public static void staircase(int n) {\n        for (int i = 1; i <= n; i++) {\n            System.out.println(\" \".repeat(n - i) + \"#\".repeat(i));\n        }\n    }\n}",
      "cpp": "void staircase(int n) {\n    for (int i = 1; i <= n; i++) {\n        cout << string(n - i, ' ') << string(i, '#') << \"\\n\";\n    }\n}"
    }
  },
  {
    "id": "hr_birthday_cake_candles",
    "number": 109,
    "title": "HackerRank: Birthday Cake Candles",
    "difficulty": "Easy",
    "level": "Beginner",
    "category": "Arrays & Hashing",
    "platform": "HackerRank",
    "acceptanceRate": "87.4%",
    "companyTags": [
      "Accenture",
      "Infosys",
      "Wipro"
    ],
    "description": "You are in charge of the cake for a child's birthday. You have decided the cake will have one candle for each year of their total age. They will only be able to blow out the tallest of the candles. Count how many candles are tallest.",
    "examples": [
      {
        "input": "candles = [4, 4, 1, 3]",
        "output": "2",
        "explanation": "The maximum height candles are 4. There are 2 of them."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= candles[i] <= 10^7"
    ],
    "hints": [
      "Find max value, then count occurrences of max."
    ],
    "editorial": {
      "approach": "Max and Frequency Counter",
      "time": "O(N)",
      "space": "O(1)",
      "summary": "Track current max; increment count on duplicate max; reset count on new max."
    },
    "functionName": "birthdayCakeCandles",
    "testCases": [
      {
        "args": [
          [
            4,
            4,
            1,
            3
          ]
        ],
        "expected": 2
      }
    ],
    "langTemplates": {
      "javascript": "function birthdayCakeCandles(candles) {\n  const max = Math.max(...candles);\n  return candles.filter(c => c === max).length;\n}",
      "python": "def birthday_cake_candles(candles: list[int]) -> int:\n    m = max(candles)\n    return candles.count(m)",
      "java": "class Solution {\n    public static int birthdayCakeCandles(List<Integer> candles) {\n        int max = Collections.max(candles), count = 0;\n        for (int c : candles) if (c == max) count++;\n        return count;\n    }\n}",
      "cpp": "int birthdayCakeCandles(vector<int> candles) {\n    int m = *max_element(candles.begin(), candles.end());\n    return count(candles.begin(), candles.end(), m);\n}"
    }
  },
  {
    "id": "course_schedule",
    "number": 207,
    "title": "Course Schedule (Topological Sort)",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Graphs",
    "platform": "LeetCode",
    "acceptanceRate": "46.7%",
    "companyTags": [
      "Amazon",
      "Google",
      "Meta",
      "Microsoft"
    ],
    "description": "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a, b] indicates that you must take course b first if you want to take course a.\n\nReturn true if you can finish all courses. Otherwise, return false.",
    "examples": [
      {
        "input": "numCourses = 2, prerequisites = [[1,0]]",
        "output": "true",
        "explanation": "Take course 0 then course 1."
      }
    ],
    "constraints": [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000"
    ],
    "hints": [
      "Check for cycle in directed graph using Kahn's algorithm (indegree) or DFS cycle detection."
    ],
    "editorial": {
      "approach": "Kahn's Topological Sort via BFS",
      "time": "O(V + E)",
      "space": "O(V + E)",
      "summary": "Compute in-degrees. Enqueue 0-degree nodes. Reduce neighbor in-degrees; verify total visited == numCourses."
    },
    "functionName": "canFinish",
    "testCases": [
      {
        "args": [
          2,
          [
            [
              1,
              0
            ]
          ]
        ],
        "expected": true
      },
      {
        "args": [
          2,
          [
            [
              1,
              0
            ],
            [
              0,
              1
            ]
          ]
        ],
        "expected": false
      }
    ],
    "langTemplates": {
      "javascript": "function canFinish(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const q = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) q.push(i);\n  let visited = 0;\n  while (q.length) {\n    const node = q.shift();\n    visited++;\n    for (const neighbor of adj[node]) {\n      inDegree[neighbor]--;\n      if (inDegree[neighbor] === 0) q.push(neighbor);\n    }\n  }\n  return visited === numCourses;\n}",
      "python": "def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:\n    from collections import deque\n    adj = [[] for _ in range(num_courses)]\n    indegree = [0] * num_courses\n    for c, p in prerequisites:\n        adj[p].append(c)\n        indegree[c] += 1\n    q = deque([i for i in range(num_courses) if indegree[i] == 0])\n    visited = 0\n    while q:\n        node = q.popleft()\n        visited += 1\n        for nei in adj[node]:\n            indegree[nei] -= 1\n            if indegree[nei] == 0: q.append(nei)\n    return visited == num_courses",
      "java": "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        int[] inDegree = new int[numCourses];\n        for (int[] p : prerequisites) {\n            adj.get(p[1]).add(p[0]);\n            inDegree[p[0]]++;\n        }\n        Queue<Integer> q = new LinkedList<>();\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.add(i);\n        int visited = 0;\n        while (!q.isEmpty()) {\n            int node = q.poll();\n            visited++;\n            for (int next : adj.get(node)) {\n                if (--inDegree[next] == 0) q.add(next);\n            }\n        }\n        return visited == numCourses;\n    }\n}",
      "cpp": "bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    vector<vector<int>> adj(numCourses);\n    vector<int> inDegree(numCourses, 0);\n    for (auto& p : prerequisites) {\n        adj[p[1]].push_back(p[0]);\n        inDegree[p[0]]++;\n    }\n    queue<int> q;\n    for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);\n    int visited = 0;\n    while (!q.empty()) {\n        int node = q.front(); q.pop();\n        visited++;\n        for (int next : adj[node]) {\n            if (--inDegree[next] == 0) q.push(next);\n        }\n    }\n    return visited == numCourses;\n}"
    }
  },
  {
    "id": "subsets",
    "number": 78,
    "title": "Subsets (Power Set)",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Backtracking",
    "platform": "LeetCode",
    "acceptanceRate": "77.5%",
    "companyTags": [
      "Meta",
      "Amazon",
      "Bloomberg",
      "Uber"
    ],
    "description": "Given an integer array nums of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.",
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "explanation": "2^3 = 8 subsets."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10"
    ],
    "hints": [
      "For each element, choose to include it or exclude it in backtracking DFS."
    ],
    "editorial": {
      "approach": "Backtracking Binary Choice",
      "time": "O(N * 2^N)",
      "space": "O(N)",
      "summary": "Generate power set recursively by branching include/exclude decisions."
    },
    "functionName": "subsets",
    "testCases": [
      {
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            1,
            2
          ],
          [
            1,
            2,
            3
          ],
          [
            1,
            3
          ],
          [
            2
          ],
          [
            2,
            3
          ],
          [
            3
          ]
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function subsets(nums) {\n  const res = [];\n  function backtrack(start, curr) {\n    res.push([...curr]);\n    for (let i = start; i < nums.length; i++) {\n      curr.push(nums[i]);\n      backtrack(i + 1, curr);\n      curr.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
      "python": "def subsets(nums: list[int]) -> list[list[int]]:\n    res = []\n    def backtrack(start, path):\n        res.append(list(path))\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop()\n    backtrack(0, [])\n    return res",
      "java": "class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        backtrack(0, nums, new ArrayList<>(), res);\n        return res;\n    }\n    private void backtrack(int start, int[] nums, List<Integer> curr, List<List<Integer>> res) {\n        res.add(new ArrayList<>(curr));\n        for (int i = start; i < nums.length; i++) {\n            curr.add(nums[i]);\n            backtrack(i + 1, nums, curr, res);\n            curr.remove(curr.size() - 1);\n        }\n    }\n}",
      "cpp": "vector<vector<int>> subsets(vector<int>& nums) {\n    vector<vector<int>> res;\n    vector<int> curr;\n    function<void(int)> backtrack = [&](int start) {\n        res.push_back(curr);\n        for (int i = start; i < nums.size(); i++) {\n            curr.push_back(nums[i]);\n            backtrack(i + 1);\n            curr.pop_back();\n        }\n    };\n    backtrack(0);\n    return res;\n}"
    }
  },
  {
    "id": "merge_intervals",
    "number": 56,
    "title": "Merge Intervals",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Intervals",
    "platform": "LeetCode",
    "acceptanceRate": "47.3%",
    "companyTags": [
      "Google",
      "Amazon",
      "Meta",
      "Microsoft"
    ],
    "description": "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "[1,3] and [2,6] overlap into [1,6]."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4"
    ],
    "hints": [
      "Sort intervals by start time. If current start <= previous end, merge by extending end."
    ],
    "editorial": {
      "approach": "Sort by Start & Merge",
      "time": "O(N log N)",
      "space": "O(N)",
      "summary": "Keep track of merged intervals. Extend last interval's end if overlapping."
    },
    "functionName": "merge",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              3
            ],
            [
              2,
              6
            ],
            [
              8,
              10
            ],
            [
              15,
              18
            ]
          ]
        ],
        "expected": [
          [
            1,
            6
          ],
          [
            8,
            10
          ],
          [
            15,
            18
          ]
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);\n    else res.push(intervals[i]);\n  }\n  return res;\n}",
      "python": "def merge(intervals: list[list[int]]) -> list[list[int]]:\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for interval in intervals:\n        if not merged or merged[-1][1] < interval[0]:\n            merged.append(interval)\n        else:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    return merged",
      "java": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        for (int[] interval : intervals) {\n            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) merged.add(interval);\n            else merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}",
      "cpp": "vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> res;\n    for (auto& iv : intervals) {\n        if (res.empty() || res.back()[1] < iv[0]) res.push_back(iv);\n        else res.back()[1] = max(res.back()[1], iv[1]);\n    }\n    return res;\n}"
    }
  },
  {
    "id": "hr_climbing_leaderboard",
    "number": 110,
    "title": "HackerRank: Climbing the Leaderboard",
    "difficulty": "Medium",
    "level": "Intermediate",
    "category": "Binary Search",
    "platform": "HackerRank",
    "acceptanceRate": "62.4%",
    "companyTags": [
      "Amazon",
      "Flipkart",
      "Oracle"
    ],
    "description": "An arcade game player wants to climb to the top of the leaderboard and track their ranking. The game uses Dense Ranking, so the player with highest score is ranked 1, players who have equal scores receive the same ranking number, and the next player receives the immediately following rank number.",
    "examples": [
      {
        "input": "ranked = [100, 100, 50, 40, 40, 20, 10], player = [5, 25, 50, 120]",
        "output": "[6, 4, 2, 1]",
        "explanation": "Rankings assigned: 100(1), 50(2), 40(3), 20(4), 10(5). Score 5 gets 6th, 25 gets 4th, 50 gets 2nd, 120 gets 1st."
      }
    ],
    "constraints": [
      "1 <= n <= 2 * 10^5",
      "1 <= m <= 2 * 10^5"
    ],
    "hints": [
      "De-duplicate the leaderboard. Use binary search (or two pointers from bottom up) since player scores are sorted."
    ],
    "editorial": {
      "approach": "Unique Leaderboard Two Pointers",
      "time": "O(N + M)",
      "space": "O(N)",
      "summary": "Remove duplicate scores from ranked. March pointer backwards as player scores increase."
    },
    "functionName": "climbingLeaderboard",
    "testCases": [
      {
        "args": [
          [
            100,
            100,
            50,
            40,
            40,
            20,
            10
          ],
          [
            5,
            25,
            50,
            120
          ]
        ],
        "expected": [
          6,
          4,
          2,
          1
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function climbingLeaderboard(ranked, player) {\n  const unique = [...new Set(ranked)];\n  const res = [];\n  let i = unique.length - 1;\n  for (const score of player) {\n    while (i >= 0 && score >= unique[i]) i--;\n    res.push(i + 2);\n  }\n  return res;\n}",
      "python": "def climbing_leaderboard(ranked: list[int], player: list[int]) -> list[int]:\n    unique = sorted(set(ranked), reverse=True)\n    res = []\n    i = len(unique) - 1\n    for score in player:\n        while i >= 0 and score >= unique[i]: i -= 1\n        res.append(i + 2)\n    return res",
      "java": "class Solution {\n    public static List<Integer> climbingLeaderboard(List<Integer> ranked, List<Integer> player) {\n        List<Integer> unique = new ArrayList<>();\n        for (int r : ranked) if (unique.isEmpty() || !unique.get(unique.size() - 1).equals(r)) unique.add(r);\n        List<Integer> res = new ArrayList<>();\n        int i = unique.size() - 1;\n        for (int score : player) {\n            while (i >= 0 && score >= unique.get(i)) i--;\n            res.add(i + 2);\n        }\n        return res;\n    }\n}",
      "cpp": "vector<int> climbingLeaderboard(vector<int> ranked, vector<int> player) {\n    vector<int> unique;\n    for (int r : ranked) if (unique.empty() || unique.back() != r) unique.push_back(r);\n    vector<int> res;\n    int i = unique.size() - 1;\n    for (int score : player) {\n        while (i >= 0 && score >= unique[i]) i--;\n        res.push_back(i + 2);\n    }\n    return res;\n}"
    }
  },
  {
    "id": "n_queens",
    "number": 51,
    "title": "N-Queens",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Backtracking",
    "platform": "LeetCode",
    "acceptanceRate": "67.8%",
    "companyTags": [
      "Amazon",
      "Google",
      "Microsoft",
      "Uber"
    ],
    "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\n\nGiven an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.",
    "examples": [
      {
        "input": "n = 4",
        "output": "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]",
        "explanation": "Two distinct configurations of 4 non-attacking queens."
      }
    ],
    "constraints": [
      "1 <= n <= 9"
    ],
    "hints": [
      "Track attacked columns, positive diagonals (r + c), and negative diagonals (r - c) with sets."
    ],
    "editorial": {
      "approach": "Backtracking with Column & Diagonal Sets",
      "time": "O(N!)",
      "space": "O(N)",
      "summary": "Recurse row by row. Check (col, r+c, r-c) conflict before placing."
    },
    "functionName": "solveNQueens",
    "testCases": [
      {
        "args": [
          4
        ],
        "expected": [
          [
            ".Q..",
            "...Q",
            "Q...",
            "..Q."
          ],
          [
            "..Q.",
            "Q...",
            "...Q",
            ".Q.."
          ]
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function solveNQueens(n) {\n  const res = [];\n  const cols = new Set(), posDiag = new Set(), negDiag = new Set();\n  const board = Array.from({ length: n }, () => new Array(n).fill('.'));\n  function backtrack(r) {\n    if (r === n) {\n      res.push(board.map(row => row.join('')));\n      return;\n    }\n    for (let c = 0; c < n; c++) {\n      if (cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue;\n      cols.add(c); posDiag.add(r + c); negDiag.add(r - c);\n      board[r][c] = 'Q';\n      backtrack(r + 1);\n      cols.delete(c); posDiag.delete(r + c); negDiag.delete(r - c);\n      board[r][c] = '.';\n    }\n  }\n  backtrack(0);\n  return res;\n}",
      "python": "def solve_n_queens(n: int) -> list[list[str]]:\n    col = set()\n    posDiag = set() # (r + c)\n    negDiag = set() # (r - c)\n    res = []\n    board = [['.'] * n for _ in range(n)]\n    def backtrack(r):\n        if r == n:\n            res.append([''.join(row) for row in board])\n            return\n        for c in range(n):\n            if c in col or (r + c) in posDiag or (r - c) in negDiag: continue\n            col.add(c); posDiag.add(r + c); negDiag.add(r - c)\n            board[r][c] = 'Q'\n            backtrack(r + 1)\n            col.remove(c); posDiag.remove(r + c); negDiag.remove(r - c)\n            board[r][c] = '.'\n    backtrack(0)\n    return res",
      "java": "class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        List<List<String>> res = new ArrayList<>();\n        char[][] board = new char[n][n];\n        for (char[] row : board) Arrays.fill(row, '.');\n        backtrack(0, board, res, new HashSet<>(), new HashSet<>(), new HashSet<>());\n        return res;\n    }\n    private void backtrack(int r, char[][] b, List<List<String>> res, Set<Integer> cols, Set<Integer> pos, Set<Integer> neg) {\n        if (r == b.length) {\n            List<String> list = new ArrayList<>();\n            for (char[] row : b) list.add(new String(row));\n            res.add(list);\n            return;\n        }\n        for (int c = 0; c < b.length; c++) {\n            if (cols.contains(c) || pos.contains(r + c) || neg.contains(r - c)) continue;\n            cols.add(c); pos.add(r + c); neg.add(r - c); b[r][c] = 'Q';\n            backtrack(r + 1, b, res, cols, pos, neg);\n            cols.remove(c); pos.remove(r + c); neg.remove(r - c); b[r][c] = '.';\n        }\n    }\n}",
      "cpp": "vector<vector<string>> solveNQueens(int n) {\n    vector<vector<string>> res;\n    vector<string> board(n, string(n, '.'));\n    unordered_set<int> cols, pos, neg;\n    function<void(int)> backtrack = [&](int r) {\n        if (r == n) { res.push_back(board); return; }\n        for (int c = 0; c < n; c++) {\n            if (cols.count(c) || pos.count(r + c) || neg.count(r - c)) continue;\n            cols.insert(c); pos.insert(r + c); neg.insert(r - c); board[r][c] = 'Q';\n            backtrack(r + 1);\n            cols.erase(c); pos.erase(r + c); neg.erase(r - c); board[r][c] = '.';\n        }\n    };\n    backtrack(0);\n    return res;\n}"
    }
  },
  {
    "id": "merge_k_sorted_lists",
    "number": 23,
    "title": "Merge k Sorted Lists",
    "difficulty": "Hard",
    "level": "Advanced",
    "category": "Heap",
    "platform": "LeetCode",
    "acceptanceRate": "51.8%",
    "companyTags": [
      "Amazon",
      "Google",
      "Facebook",
      "Microsoft"
    ],
    "description": "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    "examples": [
      {
        "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
        "output": "[1,1,2,3,4,4,5,6]",
        "explanation": "Merged list is sorted in ascending order."
      }
    ],
    "constraints": [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500"
    ],
    "hints": [
      "Use a Min-Heap (Priority Queue) containing the current node of each of the k lists."
    ],
    "editorial": {
      "approach": "Min-Heap or Divide & Conquer",
      "time": "O(N log K)",
      "space": "O(K)",
      "summary": "Insert head of all k lists into min-heap. Pop smallest node, append to merged list, and push next node from that list."
    },
    "functionName": "mergeKLists",
    "testCases": [
      {
        "args": [
          [
            [
              1,
              4,
              5
            ],
            [
              1,
              3,
              4
            ],
            [
              2,
              6
            ]
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4,
          5,
          6
        ]
      }
    ],
    "langTemplates": {
      "javascript": "function mergeKLists(lists) {\n  if (!lists || !lists.length) return null;\n  const vals = [];\n  for (let node of lists) {\n    while (node) {\n      vals.push(node.val);\n      node = node.next;\n    }\n  }\n  vals.sort((a, b) => a - b);\n  const dummy = { val: 0, next: null };\n  let curr = dummy;\n  for (const v of vals) {\n    curr.next = { val: v, next: null };\n    curr = curr.next;\n  }\n  return dummy.next;\n}",
      "python": "def merge_k_lists(lists):\n    import heapq\n    min_heap = []\n    for i, node in enumerate(lists):\n        if node: heapq.heappush(min_heap, (node.val, i, node))\n    dummy = ListNode()\n    curr = dummy\n    while min_heap:\n        val, i, node = heapq.heappop(min_heap)\n        curr.next = node\n        curr = curr.next\n        if node.next:\n            heapq.heappush(min_heap, (node.next.val, i, node.next))\n    return dummy.next",
      "java": "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);\n        for (ListNode node : lists) if (node != null) pq.add(node);\n        ListNode dummy = new ListNode(0), curr = dummy;\n        while (!pq.isEmpty()) {\n            ListNode node = pq.poll();\n            curr.next = node;\n            curr = curr.next;\n            if (node.next != null) pq.add(node.next);\n        }\n        return dummy.next;\n    }\n}",
      "cpp": "ListNode* mergeKLists(vector<ListNode*>& lists) {\n    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };\n    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);\n    for (auto node : lists) if (node) pq.push(node);\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (!pq.empty()) {\n        ListNode* node = pq.top(); pq.pop();\n        curr->next = node;\n        curr = curr->next;\n        if (node->next) pq.push(node->next);\n    }\n    return dummy.next;\n}"
    }
  }
];
