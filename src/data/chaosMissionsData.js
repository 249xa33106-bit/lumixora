// ============================================================================
// LUMIXORA CHAOSLAB™: COMPREHENSIVE B.TECH ENGINEERING SUBJECT MISSIONS
// Curriculum-Aligned Adaptability Practice Bench (JNTUA R20/R23 & Autonomous)
// ============================================================================

export const BTECH_SUBJECT_CATEGORIES = [
  { id: 'all', name: 'All Subjects', fullName: 'Complete B.Tech Subject Bank', color: 'cyan' },
  { id: 'dsa', name: 'DSA', fullName: 'Data Structures & Algorithms', code: '20A05301T', color: 'emerald' },
  { id: 'adsa', name: 'ADSA', fullName: 'Advanced Data Structures & Algorithms', code: '20A05402T', color: 'cyan' },
  { id: 'java', name: 'JAVA', fullName: 'Core & Enterprise Java', code: '20A05401T', color: 'amber' },
  { id: 'python', name: 'PYTHON', fullName: 'Python & Async Data Systems', code: '20A05303T', color: 'blue' },
  { id: 'ml', name: 'ML', fullName: 'Machine Learning & Deep Learning', code: '20A05602T', color: 'purple' },
  { id: 'dbms', name: 'DBMS', fullName: 'Database Management Systems', code: '20A05403T', color: 'rose' },
  { id: 'os', name: 'OS', fullName: 'Operating Systems & Concurrency', code: '20A05404T', color: 'indigo' },
  { id: 'cn', name: 'CN', fullName: 'Computer Networks & Protocols', code: '20A05501T', color: 'teal' },
  { id: 'capstone', name: 'Capstone', fullName: 'System Design & Distributed Cloud', code: '20A05701P', color: 'sky' },
  { id: 'startup', name: 'Startup', fullName: 'Venture & High-Scale Engineering', code: 'INNOV-01', color: 'orange' }
];

export const PRESET_MISSIONS = [
  // ──────────────────────────────────────────────────────────────────────────
  // 01. DSA (DATA STRUCTURES & ALGORITHMS - 20A05301T) - 4 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'btech-dsa-1',
    subjectKey: 'dsa',
    language: 'cpp',
    domain: 'Data Structures & Algorithms (20A05301T)',
    title: 'DSA Mission 1: Dijkstra Graph Routing Under 50,000 Dynamic Edges',
    shortTitle: 'Dijkstra Routing (TLE)',
    subjectBadge: 'DSA • JNTUA II-I',
    badge: 'Time Limit Exceeded (TLE)',
    badgeColor: 'emerald',
    difficulty: 'Core B.Tech',
    targetSla: 'O((V + E) log V) • Latency < 120ms • Zero Recursion Depth Error',
    brief: 'Campus shortest-path navigation for GPREC Kurnool using standard Dijkstra with an Adjacency List and Min-Heap. Under normal testing with 500 nodes, queries return in 12ms. But at 50,000 edges, unpruned priority queue allocations cause TLE.',
    architecture: 'C++17 • Adjacency List Graph • std::priority_queue<pair<int,int>> • Dijkstra SPFA',
    baselineResources: {
      budget: '64MB Max RAM Quota in Online Judge',
      infrastructure: 'Single-thread CPU Core (2.4 GHz)',
      dependencies: ['Standard Template Library (STL)', 'Vector', 'Priority Queue'],
      deadline: 'Online Campus Hackathon Judge Submissions close in 25 mins'
    },
    starterCode: `// Standard Dijkstra Implementation (Vulnerable to TLE under 50k Edges)
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const int INF = 1e9;
typedef pair<int, int> pii;

vector<int> dijkstra(int V, int src, vector<vector<pii>>& adj) {
    vector<int> dist(V, INF);
    priority_queue<pii, vector<pii>, greater<pii>> pq;

    dist[src] = 0;
    pq.push({0, src});

    // VULNERABILITY: Under 50,000 edge updates, pq explodes to 1.2M entries
    // Execution exceeds 120ms SLA causing Time Limit Exceeded (TLE)!
    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
    adaptiveCodeScaffold: `// Patched Solution: Bidirectional Dijkstra with Visited Pruning & A* Bounding
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const int INF = 1e9;
typedef pair<int, int> pii;

int bidirectionalDijkstra(int V, int src, int target, vector<vector<pii>>& adj, vector<vector<pii>>& revAdj) {
    vector<int> distF(V, INF), distB(V, INF);
    vector<bool> visitedF(V, false), visitedB(V, false);
    priority_queue<pii, vector<pii>, greater<pii>> pqF, pqB;

    distF[src] = 0; pqF.push({0, src});
    distB[target] = 0; pqB.push({0, target});
    int bestDist = INF;

    while (!pqF.empty() && !pqB.empty()) {
        if (pqF.top().first + pqB.top().first >= bestDist) break; // Pruning exit!

        // Forward search frontier
        int u = pqF.top().second; pqF.pop();
        if (!visitedF[u]) {
            visitedF[u] = true;
            for (auto& edge : adj[u]) {
                int v = edge.first, w = edge.second;
                if (distF[u] + w < distF[v]) {
                    distF[v] = distF[u] + w;
                    pqF.push({distF[v], v});
                    if (visitedB[v]) bestDist = min(bestDist, distF[v] + distB[v]);
                }
            }
        }

        // Backward search frontier
        int bu = pqB.top().second; pqB.pop();
        if (!visitedB[bu]) {
            visitedB[bu] = true;
            for (auto& edge : revAdj[bu]) {
                int bv = edge.first, bw = edge.second;
                if (distB[bu] + bw < distB[bv]) {
                    distB[bv] = distB[bu] + bw;
                    pqB.push({distB[bv], bv});
                    if (visitedF[bv]) bestDist = min(bestDist, distF[bv] + distB[bv]);
                }
            }
        }
    }
    return bestDist;
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Dynamic Graph Influx (50,000 Edges Injected)',
        alertHeadline: 'TIME LIMIT EXCEEDED (TLE) • Judge Latency: 2,410ms (SLA: <120ms)',
        systemConstraint: 'The campus routing node graph has exploded with 50,000 temporary path closures. Standard PriorityQueue push overhead generates 1,200,000 redundant heap nodes, blowing your time limit and triggering a 0/100 online test fail.',
        telemetry: {
          meanLatency: '2,410ms (TLE)',
          errorRate: '100% Timeout',
          memoryFootprint: '84.2 MB / 64 MB Limit',
          activeRequests: '50,000 Edge Updates'
        },
        adaptiveOptions: [
          {
            id: 'opt_bidirectional',
            title: 'Refactor to Bidirectional Dijkstra with Early Intersection Pruning',
            pros: 'Halves the search radius (O(2 * b^(d/2))), latency drops from 2,410ms to 24ms, strict O(V) space.',
            cons: 'Requires maintaining reverse adjacency lists; complexity increases for non-directed graphs.',
            recoveryTimeMinutes: 4.2,
            wasteIndex: 8,
            qualityScore: 98
          },
          {
            id: 'opt_bucket_dial',
            title: 'Replace std::priority_queue with Dial’s Algorithm (Bucket Queue)',
            pros: 'O(E + V * W) linear time for small integer weights, zero heap rebalance overhead.',
            cons: 'Only works if edge weights are bounded integers (W <= 100); fails on dynamic real-valued weights.',
            recoveryTimeMinutes: 7.0,
            wasteIndex: 25,
            qualityScore: 84
          },
          {
            id: 'opt_spfa_sloppy',
            title: 'Switch to Shortest Path Faster Algorithm (SPFA) with FIFO Queue',
            pros: 'Quick 5-line change with std::queue; passes simple sparse test vectors.',
            cons: 'Worst-case complexity degrades to O(V * E); pathological dense edge inputs cause judge timeout.',
            recoveryTimeMinutes: 2.0,
            wasteIndex: 50,
            qualityScore: 60
          }
        ]
    }
  },
  {
    id: 'btech-dsa-2',
    subjectKey: 'dsa',
    language: 'cpp',
    domain: 'Data Structures & Algorithms (20A05301T)',
    title: 'DSA Mission 2: High-Concurrency LRU Cache Under 100,000 Evictions',
    shortTitle: 'LRU Cache Eviction (Latency)',
    subjectBadge: 'DSA • JNTUA II-I',
    badge: 'O(N) Search Latency Spike',
    badgeColor: 'emerald',
    difficulty: 'Core B.Tech',
    targetSla: 'O(1) Get & Put • Latency < 1ms • 100,000 Evictions without OOM',
    brief: 'A campus library book catalog cache implemented with a simple std::vector. Key search takes O(N), which grinds server response times to 850ms when 10,000 items are cached.',
    architecture: 'C++17 • Hash Map + Doubly Linked List • std::unordered_map • O(1) Cache',
    baselineResources: {
      budget: '32MB Cache Buffer',
      infrastructure: 'Single thread benchmark',
      dependencies: ['std::vector', 'std::pair'],
      deadline: 'Semester Lab Practical Evaluation in 15 mins'
    },
    starterCode: `// Naive LRU Cache using std::vector (O(N) lookup bottleneck)
#include <iostream>
#include <vector>
using namespace std;

class NaiveLRUCache {
    int capacity;
    vector<pair<int, int>> cache; // key, value
public:
    NaiveLRUCache(int cap) : capacity(cap) {}

    int get(int key) {
        for (int i = 0; i < cache.size(); i++) {
            if (cache[i].first == key) {
                pair<int, int> item = cache[i];
                cache.erase(cache.begin() + i); // O(N) shift!
                cache.push_back(item);
                return item.second;
            }
        }
        return -1; // O(N) search time causes massive latency!
    }

    void put(int key, int val) {
        for (int i = 0; i < cache.size(); i++) {
            if (cache[i].first == key) {
                cache.erase(cache.begin() + i);
                cache.push_back({key, val});
                return;
            }
        }
        if (cache.size() >= capacity) {
            cache.erase(cache.begin()); // O(N) erase
        }
        cache.push_back({key, val});
    }
};`,
    adaptiveCodeScaffold: `// Production O(1) LRU Cache: Hash Map + Doubly Linked List
#include <iostream>
#include <unordered_map>
#include <list>
using namespace std;

class OptimalLRUCache {
    int capacity;
    list<pair<int, int>> dll; // Most recently used at front
    unordered_map<int, list<pair<int, int>>::iterator> keyMap;

public:
    OptimalLRUCache(int cap) : capacity(cap) {}

    int get(int key) {
        auto it = keyMap.find(key);
        if (it == keyMap.end()) return -1;
        dll.splice(dll.begin(), dll, it->second); // O(1) move to head
        return it->second->second;
    }

    void put(int key, int val) {
        auto it = keyMap.find(key);
        if (it != keyMap.end()) {
            it->second->second = val;
            dll.splice(dll.begin(), dll, it->second);
            return;
        }
        if (dll.size() == capacity) {
            int evictKey = dll.back().first;
            dll.pop_back(); // O(1) eviction
            keyMap.erase(evictKey);
        }
        dll.push_front({key, val});
        keyMap[key] = dll.begin();
    }
};`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Cache Hit Influx (100,000 Rapid Key Operations)',
        alertHeadline: 'LATENCY SPIKE: 850ms per operation • O(N) Linear Search Bottleneck',
        systemConstraint: 'The catalog cache received a burst of 100,000 student lookups. Vector element shifting causes high CPU throttling and request timeouts.',
        telemetry: {
          meanLatency: '850ms (SLA: <1ms)',
          errorRate: '42% Request Drops',
          memoryFootprint: '28 MB',
          activeRequests: '100,000 Operations'
        },
        adaptiveOptions: [
          {
            id: 'opt_hash_dll',
            title: 'Implement Hash Map + Doubly Linked List with std::list::splice',
            pros: 'Achieves strict O(1) get and put, zero element reallocation copies, latency drops to 0.4ms.',
            cons: 'Requires extra pointer overhead per node (16 bytes per entry for prev/next).',
            recoveryTimeMinutes: 3.5,
            wasteIndex: 5,
            qualityScore: 99
          },
          {
            id: 'opt_std_map',
            title: 'Replace std::vector with std::map with Timestamp Key',
            pros: 'Reduces lookup time to O(log N).',
            cons: 'Still too slow compared to O(1) under 100k requests; logarithmic rebalancing overhead.',
            recoveryTimeMinutes: 5.0,
            wasteIndex: 30,
            qualityScore: 75
          }
        ]
    }
  },
  {
    id: 'btech-dsa-3',
    subjectKey: 'dsa',
    language: 'cpp',
    domain: 'Data Structures & Algorithms (20A05301T)',
    title: 'DSA Mission 3: 0/1 Knapsack Memory Limit Under N=1,000, W=50,000',
    shortTitle: 'Knapsack DP (Memory Limit)',
    subjectBadge: 'DSA • JNTUA II-I',
    badge: 'Memory Limit Exceeded (MLE)',
    badgeColor: 'emerald',
    difficulty: 'Core B.Tech',
    targetSla: 'O(W) Space • Memory < 16MB • O(N * W) Time Runtime < 180ms',
    brief: 'A project resource allocator using classic 2D Dynamic Programming table dp[N][W]. For N=1,000 and W=50,000, the 2D integer matrix requires 200MB of RAM, instantly breaching the 64MB judge quota.',
    architecture: 'C++17 • Dynamic Programming • Space Optimization • Rolling Array',
    baselineResources: {
      budget: '64MB Online Judge Memory Limit',
      infrastructure: 'Single thread CPU',
      dependencies: ['vector<vector<int>>'],
      deadline: 'JNTUA Lab External Exam in 20 mins'
    },
    starterCode: `// Naive 2D Knapsack DP (Memory Limit Exceeded: 200MB RAM!)
#include <iostream>
#include <vector>
using namespace std;

int knapsack2D(int N, int W, vector<int>& wt, vector<int>& val) {
    // VULNERABILITY: 1000 * 50000 * 4 bytes = 200,000,000 bytes = ~190.7 MB
    // Breaches judge limit of 64MB -> SIGKILL / MLE!
    vector<vector<int>> dp(N + 1, vector<int>(W + 1, 0));

    for (int i = 1; i <= N; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[N][W];
}`,
    adaptiveCodeScaffold: `// Space-Optimized 1D Rolling Array Knapsack: O(W) Space (< 1MB RAM!)
#include <iostream>
#include <vector>
using namespace std;

int knapsack1D(int N, int W, const vector<int>& wt, const vector<int>& val) {
    // Space footprint: 50,001 * 4 bytes = ~200 KB RAM!
    vector<int> dp(W + 1, 0);

    for (int i = 0; i < N; i++) {
        // Iterate backwards to prevent using the same item multiple times
        for (int w = W; w >= wt[i]; w--) {
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }
    return dp[W];
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Target Capacity Surge (W=50,000 Injected)',
        alertHeadline: 'MEMORY LIMIT EXCEEDED (MLE): 190.7 MB Allocated (Quota: 64 MB)',
        systemConstraint: 'The knapsack capacity was raised from 500 to 50,000. Allocating vector<vector<int>>(1001, 50001) throws std::bad_alloc on the testing sandbox.',
        telemetry: {
          meanLatency: 'Killed (MLE)',
          errorRate: '100% SIGKILL',
          memoryFootprint: '190.7 MB / 64 MB Limit',
          activeRequests: 'N=1,000, W=50,000'
        },
        adaptiveOptions: [
          {
            id: 'opt_1d_dp',
            title: 'Compress to 1D Array with Reverse Traversal',
            pros: 'Reduces memory from 190.7 MB to 200 KB (99.9% reduction), 100% cache-friendly, passes judge.',
            cons: 'Cannot easily reconstruct the exact item subset without bitmasking or backtracking.',
            recoveryTimeMinutes: 2.8,
            wasteIndex: 4,
            qualityScore: 99
          },
          {
            id: 'opt_two_row_dp',
            title: 'Use Two Alternating Rows: dp[2][W]',
            pros: 'Saves 99% RAM, allows forward iteration.',
            cons: 'Slightly more conditional logic overhead than clean 1D reverse array.',
            recoveryTimeMinutes: 4.0,
            wasteIndex: 12,
            qualityScore: 90
          }
        ]
    }
  },
  {
    id: 'btech-dsa-4',
    subjectKey: 'dsa',
    language: 'cpp',
    domain: 'Data Structures & Algorithms (20A05301T)',
    title: 'DSA Mission 4: Disjoint Set Union (Kruskal) Under Skewed Graph Cycle Storm',
    shortTitle: 'DSU Kruskal MST (Recursion Limit)',
    subjectBadge: 'DSA • JNTUA II-I',
    badge: 'Stack Overflow & O(N) Find Degeneration',
    badgeColor: 'emerald',
    difficulty: 'Core B.Tech',
    targetSla: 'O(alpha(V)) Find & Union • Zero Stack Overflow • Latency < 45ms',
    brief: 'Campus electrical grid minimum spanning tree using Kruskal Algorithm. Without path compression and union by rank, sequential edge additions degenerate the parent tree into a linear linked list of 100,000 nodes, triggering Stack Overflow.',
    architecture: 'C++17 • Disjoint Set Union • Kruskal MST • Path Compression + Union by Rank',
    baselineResources: {
      budget: 'Default 8MB Stack Limit',
      infrastructure: 'C++ Judge Runner',
      dependencies: ['vector<int> parent'],
      deadline: 'Contest ends in 18 mins'
    },
    starterCode: `// Naive DSU without Path Compression or Rank (Stack Overflow Vulnerable)
#include <iostream>
#include <vector>
using namespace std;

class NaiveDSU {
    vector<int> parent;
public:
    NaiveDSU(int n) : parent(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    // VULNERABILITY: Under skewed inserts, tree depth reaches 100,000!
    // Deep recursion crashes stack with Segmentation Fault (Stack Overflow)!
    int find(int i) {
        if (parent[i] == i) return i;
        return find(parent[i]); // Linear search O(N)!
    }

    void unite(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);
        if (rootI != rootJ) {
            parent[rootI] = rootJ; // Skewed tree degeneration!
        }
    }
};`,
    adaptiveCodeScaffold: `// Production DSU: Path Compression + Union by Rank (O(alpha(N)) Time, O(1) Stack)
#include <iostream>
#include <vector>
using namespace std;

class OptimalDSU {
    vector<int> parent, rank;
public:
    OptimalDSU(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    // Iterative Path Compression: zero recursion stack consumption!
    int find(int i) {
        int root = i;
        while (root != parent[root]) root = parent[root];
        while (i != root) {
            int next = parent[i];
            parent[i] = root; // Flatten directly to root
            i = next;
        }
        return root;
    }

    bool unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI == rootJ) return false;

        if (rank[rootI] < rank[rootJ]) {
            parent[rootI] = rootJ;
        } else if (rank[rootI] > rank[rootJ]) {
            parent[rootJ] = rootI;
        } else {
            parent[rootJ] = rootI;
            rank[rootI]++;
        }
        return true;
    }
};`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Degenerate Linear Chain Insertions (100,000 Nodes)',
        alertHeadline: 'SEGMENTATION FAULT (Stack Overflow): Max Call Stack Exceeded at Depth 100,000',
        systemConstraint: 'Test vectors contain sequential path updates (0-1, 1-2, 2-3... 99999-100000). The recursive find() function exceeds the 8MB OS stack frame.',
        telemetry: {
          meanLatency: 'Crash (SIGSEGV)',
          errorRate: '100% Crashes',
          memoryFootprint: 'Stack Overflow at 8.0MB',
          activeRequests: '100,000 Nodes'
        },
        adaptiveOptions: [
          {
            id: 'opt_iterative_rank',
            title: 'Refactor to Iterative Path Halving + Union by Rank',
            pros: 'Completely eliminates recursion stack frames; find() becomes near-constant O(alpha(V)).',
            cons: 'Requires 4 bytes extra per node for rank vector.',
            recoveryTimeMinutes: 3.0,
            wasteIndex: 3,
            qualityScore: 98
          }
        ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 02. ADSA (ADVANCED DATA STRUCTURES & ALGORITHMS - 20A05402T) - 4 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'btech-adsa-1',
    subjectKey: 'adsa',
    language: 'cpp',
    domain: 'Advanced Data Structures & Algorithms (20A05402T)',
    title: 'ADSA Mission 1: Dynamic Range Sum Under 100,000 Mutable Updates',
    shortTitle: 'Range Sum (Fenwick vs SegTree)',
    subjectBadge: 'ADSA • JNTUA II-II',
    badge: 'MLE & Recursion Depth Limit',
    badgeColor: 'cyan',
    difficulty: 'Advanced B.Tech',
    targetSla: 'O(log N) Updates • Space < 8MB • Execution < 90ms for 100k queries',
    brief: 'A campus IoT energy meter recording continuous kilowatt updates and calculating running sums. The initial pointer-based Segment Tree consumes 4N node objects (64MB) and throws deep recursion limits.',
    architecture: 'C++17 • Fenwick Tree (Binary Indexed Tree) • Bitwise LSB (i & -i) • 1-indexed',
    baselineResources: {
      budget: '16MB Online Judge Memory Limit',
      infrastructure: 'Single thread benchmark',
      dependencies: ['Segment Tree Struct', 'Left/Right Pointers'],
      deadline: 'Competitive Coding Round ends in 30 mins'
    },
    starterCode: `// Recursive Pointer-Based Segment Tree (Heavy 4N pointer overhead & stack depth)
#include <iostream>
#include <vector>
using namespace std;

struct Node {
    long long sum;
    int start, end;
    Node* left;
    Node* right;
    Node(int s, int e) : sum(0), start(s), end(e), left(nullptr), right(nullptr) {}
};

// Pointer-based node allocation eats 48MB for 100,000 elements!
Node* build(int l, int r) {
    Node* curr = new Node(l, r);
    if (l == r) return curr;
    int mid = l + (r - l) / 2;
    curr->left = build(l, mid);
    curr->right = build(mid + 1, r);
    return curr;
}`,
    adaptiveCodeScaffold: `// Production Fenwick Tree (Binary Indexed Tree): Space = O(N), Zero Recursion!
#include <iostream>
#include <vector>
using namespace std;

class FenwickTree {
    int n;
    vector<long long> tree;
public:
    FenwickTree(int size) : n(size), tree(size + 1, 0) {}

    // Bitwise LSB update: O(log N) time, zero recursion, 100% cache-friendly
    void update(int idx, long long delta) {
        for (; idx <= n; idx += idx & (-idx)) {
            tree[idx] += delta;
        }
    }

    // Prefix sum query: O(log N)
    long long query(int idx) {
        long long sum = 0;
        for (; idx > 0; idx -= idx & (-idx)) {
            sum += tree[idx];
        }
        return sum;
    }

    long long rangeQuery(int l, int r) {
        return query(r) - query(l - 1);
    }
};`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Telemetry Update Rate Surged to 100,000/sec',
        alertHeadline: 'MEMORY LIMIT EXCEEDED & CACHE MISSES: 48MB Allocated (Limit: 16MB)',
        systemConstraint: 'Recursive tree node allocations fragment the heap and exceed the 16MB limit, while deep pointer dereferencing causes CPU L1/L2 cache misses.',
        telemetry: {
          meanLatency: '1,420ms',
          errorRate: '88% SLA Breaches',
          memoryFootprint: '48.2 MB / 16 MB Limit',
          activeRequests: '100,000 Updates'
        },
        adaptiveOptions: [
          {
            id: 'opt_fenwick',
            title: 'Refactor to Iterative Binary Indexed Tree (Fenwick Tree)',
            pros: 'Uses exact N integers (400 KB RAM), zero pointer overhead, O(log N) iterative bitwise updates in 22ms.',
            cons: 'Cannot easily handle arbitrary non-invertible range operations like Range Min/Max without extensions.',
            recoveryTimeMinutes: 3.5,
            wasteIndex: 6,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-adsa-2',
    subjectKey: 'adsa',
    language: 'cpp',
    domain: 'Advanced Data Structures & Algorithms (20A05402T)',
    title: 'ADSA Mission 2: Autocomplete Trie Memory Explosion Under 500k Strings',
    shortTitle: 'Trie Memory Explosion (MLE)',
    subjectBadge: 'ADSA • JNTUA II-II',
    badge: 'Trie Node Array Explosion',
    badgeColor: 'cyan',
    difficulty: 'Advanced B.Tech',
    targetSla: 'Search Latency < 1ms • Memory < 32MB for 500,000 Dictionary Words',
    brief: 'Campus digital library search engine using standard 26-pointer fixed array Trie nodes. Storing 500,000 words consumes over 380MB of RAM, crashing the embedded search microservice.',
    architecture: 'C++17 • Ternary Search Tree (TST) / Radix Compressed Trie',
    baselineResources: {
      budget: '32MB Memory Limit',
      infrastructure: 'Single thread',
      dependencies: ['struct TrieNode { TrieNode* children[26]; }'],
      deadline: 'Evaluation in 20 mins'
    },
    starterCode: `// Fixed-Size 26-Pointer Trie (Consumes ~380MB for 500,000 words!)
#include <iostream>
#include <string>
using namespace std;

struct TrieNode {
    bool isEndOfWord;
    TrieNode* children[26]; // 26 * 8 bytes = 208 bytes PER NODE even if only 1 child exists!

    TrieNode() : isEndOfWord(false) {
        for (int i = 0; i < 26; i++) children[i] = nullptr;
    }
};`,
    adaptiveCodeScaffold: `// Ternary Search Tree (TST): Only 3 pointers per node (Left, Equal, Right)!
#include <iostream>
#include <string>
using namespace std;

struct TSTNode {
    char data;
    bool isEnd;
    TSTNode *left, *eq, *right;
    TSTNode(char c) : data(c), isEnd(false), left(nullptr), eq(nullptr), right(nullptr) {}
};

class TernarySearchTree {
    TSTNode* root = nullptr;

    TSTNode* insert(TSTNode* node, const string& word, int idx) {
        char c = word[idx];
        if (!node) node = new TSTNode(c);
        if (c < node->data) node->left = insert(node->left, word, idx);
        else if (c > node->data) node->right = insert(node->right, word, idx);
        else if (idx + 1 < word.length()) node->eq = insert(node->eq, word, idx + 1);
        else node->isEnd = true;
        return node;
    }
public:
    void add(const string& word) { if (!word.empty()) root = insert(root, word, 0); }
};`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: 500,000 Medical & Engineering Terms Ingested',
        alertHeadline: 'OUT OF MEMORY: 380 MB Allocated (Limit: 32 MB)',
        systemConstraint: 'Sparse branching in the 26-pointer Trie results in 96% wasted pointer memory, crashing the service with std::bad_alloc.',
        telemetry: {
          meanLatency: 'Killed',
          errorRate: '100% OOM',
          memoryFootprint: '380 MB / 32 MB',
          activeRequests: '500,000 Words'
        },
        adaptiveOptions: [
          {
            id: 'opt_tst',
            title: 'Migrate to Ternary Search Tree (TST) or Compressed Radix Tree',
            pros: 'Reduces memory by 85% (< 24 MB), each node has only 3 pointers, preserves O(L) prefix search.',
            cons: 'Slightly more branch comparisons per character than direct array indexing.',
            recoveryTimeMinutes: 4.5,
            wasteIndex: 10,
            qualityScore: 97
          }
        ]
    }
  },
  {
    id: 'btech-adsa-3',
    subjectKey: 'adsa',
    language: 'cpp',
    domain: 'Advanced Data Structures & Algorithms (20A05402T)',
    title: 'ADSA Mission 3: Heavy-Light Decomposition (HLD) Under Deep Tree Recursion',
    shortTitle: 'HLD Tree Traversal (Stack Overflow)',
    subjectBadge: 'ADSA • JNTUA II-II',
    badge: 'Call Stack Overflow',
    badgeColor: 'cyan',
    difficulty: 'Advanced B.Tech',
    targetSla: 'O(log^2 N) Path Query • Zero Recursion Depth Crash • N=200,000',
    brief: 'College campus fiber network routing using Heavy-Light Decomposition for path queries. On deep linear branches of 200,000 nodes, the initial recursive DFS crashes the stack.',
    architecture: 'C++17 • Heavy-Light Decomposition • Iterative Euler Tour • Segment Tree',
    baselineResources: {
      budget: '8MB Stack Limit',
      infrastructure: 'Single thread',
      dependencies: ['Recursive DFS'],
      deadline: '15 mins left'
    },
    starterCode: `// Recursive Heavy-Light Decomposition DFS (Stack Crash on skewed trees)
#include <iostream>
#include <vector>
using namespace std;

void dfsHeavy(int u, int p, vector<vector<int>>& adj, vector<int>& sz, vector<int>& heavy) {
    sz[u] = 1;
    int maxSubtree = 0;
    // VULNERABILITY: Recursive call stack overflows on depth 200,000!
    for (int v : adj[u]) {
        if (v != p) {
            dfsHeavy(v, u, adj, sz, heavy);
            sz[u] += sz[v];
            if (sz[v] > maxSubtree) {
                maxSubtree = sz[v];
                heavy[u] = v;
            }
        }
    }
}`,
    adaptiveCodeScaffold: `// Iterative BFS/Topological Subtree Size Calculation (Zero Stack Overflow!)
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void iterativeSubtreeSizes(int root, int n, const vector<vector<int>>& adj, vector<int>& sz, vector<int>& heavy, vector<int>& parent) {
    vector<int> order;
    vector<bool> visited(n + 1, false);
    queue<int> q;
    q.push(root);
    visited[root] = true;

    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                parent[v] = u;
                q.push(v);
            }
        }
    }

    // Process in reverse topological order: O(1) stack, 100% safe!
    for (int i = n - 1; i >= 0; i--) {
        int u = order[i];
        sz[u] = 1;
        int maxChild = 0;
        for (int v : adj[u]) {
            if (v != parent[u]) {
                sz[u] += sz[v];
                if (sz[v] > maxChild) { maxChild = sz[v]; heavy[u] = v; }
            }
        }
    }
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Pathological Bamboo Tree Structure Injected',
        alertHeadline: 'SEGFAULT: Stack Overflow during Recursive Subtree Calculation',
        systemConstraint: 'The network topology contains a linear daisy-chain branch of 200,000 switches. Deep recursive function calls overflow the 8MB runtime stack.',
        telemetry: {
          meanLatency: 'Crash',
          errorRate: '100%',
          memoryFootprint: '8 MB Stack Overflow',
          activeRequests: '200,000 Nodes'
        },
        adaptiveOptions: [
          {
            id: 'opt_iterative_hld',
            title: 'Replace Recursive DFS with Reverse Topological BFS Flattening',
            pros: 'Completely immune to recursion depth limits, processes 200,000 nodes in 38ms.',
            cons: 'Requires an explicit ordering array of size N.',
            recoveryTimeMinutes: 3.8,
            wasteIndex: 7,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-adsa-4',
    subjectKey: 'adsa',
    language: 'cpp',
    domain: 'Advanced Data Structures & Algorithms (20A05402T)',
    title: 'ADSA Mission 4: Maximum Bipartite Flow Under Edmonds-Karp Saturation',
    shortTitle: 'Max Flow Dinic (TLE)',
    subjectBadge: 'ADSA • JNTUA II-II',
    badge: 'O(V * E^2) TLE on Dense Flow',
    badgeColor: 'cyan',
    difficulty: 'Advanced B.Tech',
    targetSla: 'O(V^2 * E) Dinic Flow • Execution < 150ms for 50,000 Flow Edges',
    brief: 'Campus course-to-room timetable allocation modeled as Maximum Bipartite Matching. Using Edmonds-Karp (O(V * E^2)), dense scheduling conflicts cause judge timeout.',
    architecture: 'C++17 • Network Flow • Dinic’s Algorithm • Level Graph BFS + Blocking Flow DFS',
    baselineResources: {
      budget: '2.00 Second Judge Time Limit',
      infrastructure: 'Single thread',
      dependencies: ['Edmonds-Karp BFS'],
      deadline: 'Contest closes in 25 mins'
    },
    starterCode: `// Edmonds-Karp Max Flow (O(V * E^2) - Time Limit Exceeded on Dense Graphs)
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// Finding one augmenting path per BFS takes O(E) * O(V * E) = O(V * E^2)!
// For V=5,000 and E=50,000, operations exceed 10^10, causing TLE!`,
    adaptiveCodeScaffold: `// Dinic's Algorithm: Level Graph BFS + Blocking Flow DFS in O(V^2 * E) (or O(E * sqrt(V)) for Unit Networks)
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct Edge { int to, cap, flow, rev; };

class DinicFlow {
    int n;
    vector<vector<Edge>> adj;
    vector<int> level, ptr;

    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        level[s] = 0;
        queue<int> q; q.push(s);
        while (!q.empty()) {
            int v = q.front(); q.pop();
            for (auto& edge : adj[v]) {
                if (edge.cap - edge.flow > 0 && level[edge.to] == -1) {
                    level[edge.to] = level[v] + 1;
                    q.push(edge.to);
                }
            }
        }
        return level[t] != -1;
    }

    int dfs(int v, int t, int pushed) {
        if (pushed == 0 || v == t) return pushed;
        for (int& cid = ptr[v]; cid < adj[v].size(); cid++) {
            auto& edge = adj[v][cid];
            int tr = edge.to;
            if (level[v] + 1 != level[tr] || edge.cap - edge.flow == 0) continue;
            int trPushed = dfs(tr, t, min(pushed, edge.cap - edge.flow));
            if (trPushed == 0) continue;
            edge.flow += trPushed;
            adj[tr][edge.rev].flow -= trPushed;
            return trPushed;
        }
        return 0;
    }
public:
    DinicFlow(int n) : n(n), adj(n), level(n), ptr(n) {}
};`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: 50,000 Dense Matching Edges Added to Bipartite Graph',
        alertHeadline: 'TIME LIMIT EXCEEDED (TLE): Edmonds-Karp elapsed time 5,420ms (Limit: 2000ms)',
        systemConstraint: 'Single augmenting path searches repeat 15,000 times on dense layers, choking the judge with quadratic edge passes.',
        telemetry: {
          meanLatency: '5,420ms (TLE)',
          errorRate: '100% Timeout',
          memoryFootprint: '14 MB',
          activeRequests: '50,000 Flow Edges'
        },
        adaptiveOptions: [
          {
            id: 'opt_dinic',
            title: 'Upgrade to Dinic’s Algorithm with Pointer Caching',
            pros: 'Finds multiple blocking flows per phase, execution drops from 5,420ms to 42ms.',
            cons: 'Requires maintaining level graphs and rev pointers.',
            recoveryTimeMinutes: 4.0,
            wasteIndex: 8,
            qualityScore: 99
          }
        ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 03. JAVA (CORE & ENTERPRISE JAVA - 20A05401T) - 4 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'btech-java-1',
    subjectKey: 'java',
    language: 'java',
    domain: 'Core & Enterprise Java (20A05401T)',
    title: 'JAVA Mission 1: Banking Transaction Engine Under 2,000 Concurrent Threads',
    shortTitle: 'Bank Deadlock (tryLock)',
    subjectBadge: 'Java • JNTUA II-II',
    badge: 'Thread Lock Inversion (Deadlock)',
    badgeColor: 'amber',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Deadlock • Latency < 25ms • 100% ACID Balance Consistency',
    brief: 'A campus student fee ledger transferring funds between accounts using synchronized blocks. When concurrent transfers invert lock order (A->B vs B->A), threads freeze indefinitely in JVM Deadlock.',
    architecture: 'Java 17 • ReentrantLock • Global Lock Ordering • tryLock(50ms)',
    baselineResources: {
      budget: '4 CPU Cores • 512MB JVM Heap',
      infrastructure: 'Tomcat / Spring Boot Service',
      dependencies: ['java.util.concurrent.locks.ReentrantLock'],
      deadline: 'Placement Drive coding test closes in 20 mins'
    },
    starterCode: `// Flawed Synchronized Transfer (Deadlock Vulnerable)
public class BankTransferService {
    public void transfer(Account from, Account to, double amount) {
        // VULNERABILITY: Nested synchronization without lock ordering!
        // Thread-1 locks A then waits for B.
        // Thread-2 locks B then waits for A.
        // RESULT: FATAL JVM DEADLOCK!
        synchronized (from) {
            try { Thread.sleep(2); } catch (Exception e) {}
            synchronized (to) {
                if (from.getBalance() >= amount) {
                    from.debit(amount);
                    to.credit(amount);
                }
            }
        }
    }
}`,
    adaptiveCodeScaffold: `// Production Deadlock-Free Transfer: Strict Lock Ordering + ReentrantLock tryLock
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class ResilientBankTransferService {
    public boolean transfer(Account from, Account to, double amount) throws InterruptedException {
        // Global Lock Ordering by Account ID: Prevents circular wait condition!
        Account firstLock = from.getId() < to.getId() ? from : to;
        Account secondLock = from.getId() < to.getId() ? to : from;

        // Bounded tryLock avoids indefinite starvation
        if (firstLock.getLock().tryLock(50, TimeUnit.MILLISECONDS)) {
            try {
                if (secondLock.getLock().tryLock(50, TimeUnit.MILLISECONDS)) {
                    try {
                        if (from.getBalance() >= amount) {
                            from.debit(amount);
                            to.credit(amount);
                            return true;
                        }
                    } finally {
                        secondLock.getLock().unlock();
                    }
                }
            } finally {
                firstLock.getLock().unlock();
            }
        }
        return false; // Retry with exponential backoff
    }
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: 2,000 Cross-Account Transfers Injected',
        alertHeadline: 'FATAL: java.lang.DeadlockDetectedException (384 Threads Blocked)',
        systemConstraint: 'Concurrent mutual transfers between students triggered circular lock acquisition. 0 transactions are completing and thread pool is exhausted.',
        telemetry: {
          meanLatency: 'Infinite (Deadlock)',
          errorRate: '100% Stalled',
          memoryFootprint: '410 MB (Leaking Threads)',
          activeRequests: '2,000 Frozen Threads'
        },
        adaptiveOptions: [
          {
            id: 'opt_lock_order',
            title: 'Enforce Global Account ID Lock Ordering + tryLock() Timeout',
            pros: 'Completely eliminates circular wait condition (Coffman condition broken), latency drops to 4ms.',
            cons: 'Requires unique sortable IDs on all lockable domain objects.',
            recoveryTimeMinutes: 3.2,
            wasteIndex: 4,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'btech-java-2',
    subjectKey: 'java',
    language: 'java',
    domain: 'Core & Enterprise Java (20A05401T)',
    title: 'JAVA Mission 2: Producer-Consumer Pipeline Buffer Overflow Under Rapid Influx',
    shortTitle: 'Buffer Overflow (BlockingQueue)',
    subjectBadge: 'Java • JNTUA II-II',
    badge: 'OutOfMemoryError (Heap Space)',
    badgeColor: 'amber',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero OOM • Backpressure Throttling • 50,000 Items/sec Queue Throughput',
    brief: 'Campus canteen order processing pipeline using an unbounded ArrayList with synchronized notifyAll(). When orders surge by 10x, consumers cannot keep up, resulting in OutOfMemoryError: Java heap space.',
    architecture: 'Java 17 • ArrayBlockingQueue • Semaphore Backpressure • RejectedExecutionHandler',
    baselineResources: {
      budget: '256MB Heap Limit',
      infrastructure: 'Multi-threaded worker pool',
      dependencies: ['java.util.concurrent.ArrayBlockingQueue'],
      deadline: 'Lab test closes in 20 mins'
    },
    starterCode: `// Unbounded ArrayList Buffer (Throws OutOfMemoryError under surge)
import java.util.ArrayList;
import java.util.List;

public class UnboundedOrderQueue {
    private final List<String> queue = new ArrayList<>();

    public synchronized void produce(String order) {
        // VULNERABILITY: Queue grows without bound!
        // At 50,000 orders/sec, heap consumes 256MB and crashes JVM!
        queue.add(order);
        notifyAll();
    }

    public synchronized String consume() throws InterruptedException {
        while (queue.isEmpty()) wait();
        return queue.remove(0); // O(N) shift operation!
    }
}`,
    adaptiveCodeScaffold: `// Production Bounded Buffer with Backpressure & Zero OOM Risk
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

public class ResilientOrderQueue {
    // Hard bounded capacity prevents heap exhaustion!
    private final BlockingQueue<String> queue = new ArrayBlockingQueue<>(5000);

    public boolean produce(String order, long timeoutMs) throws InterruptedException {
        // Blocks or applies backpressure when consumer is overwhelmed
        return queue.offer(order, timeoutMs, TimeUnit.MILLISECONDS);
    }

    public String consume(long timeoutMs) throws InterruptedException {
        return queue.poll(timeoutMs, TimeUnit.MILLISECONDS);
    }
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Canteen Rush Hour (50,000 Orders/sec Influx)',
        alertHeadline: 'JVM CRASH: java.lang.OutOfMemoryError: Java heap space',
        systemConstraint: 'Fast producers overwhelmed slow database consumers. The unbounded ArrayList accumulated 180,000 unconsumed orders and exhausted the 256MB heap.',
        telemetry: {
          meanLatency: 'Crash (OOM)',
          errorRate: '100%',
          memoryFootprint: '256 MB / 256 MB (Heap Max)',
          activeRequests: '50,000 Orders/sec'
        },
        adaptiveOptions: [
          {
            id: 'opt_blocking_queue',
            title: 'Migrate to Bounded ArrayBlockingQueue with Producer Backpressure',
            pros: 'Hard cap at 5,000 elements caps heap at 12MB, applies natural backpressure to upstream callers.',
            cons: 'Upstream producers must handle rejection or wait timeouts.',
            recoveryTimeMinutes: 2.5,
            wasteIndex: 5,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-java-3',
    subjectKey: 'java',
    language: 'java',
    domain: 'Core & Enterprise Java (20A05401T)',
    title: 'JAVA Mission 3: High-Frequency Event Ingestion GC Stop-The-World Freeze',
    shortTitle: 'GC Pause Freeze (Object Pool)',
    subjectBadge: 'Java • JNTUA II-II',
    badge: 'Stop-The-World GC Pauses',
    badgeColor: 'amber',
    difficulty: 'Core B.Tech',
    targetSla: 'GC Pause < 15ms • Throughput > 99.5% • Zero-GC Object Allocation',
    brief: 'Campus high-speed network packet monitor allocating new Event() objects on every UDP datagram. Allocating 200,000 temporary objects per second triggers full Stop-The-World GC pauses of 1,200ms.',
    architecture: 'Java 17 • Object Pool Pattern • ThreadLocal Reusable Buffers • G1GC Tuning',
    baselineResources: {
      budget: 'G1GC MaxGCPauseMillis=20',
      infrastructure: 'High-throughput packet ingest',
      dependencies: ['Object Pooling'],
      deadline: '15 mins left'
    },
    starterCode: `// Rapid Allocation Ingestion (Vulnerable to GC Stop-the-World Pauses)
public class PacketProcessor {
    public void onPacketReceived(byte[] rawData) {
        // VULNERABILITY: Creates 200,000 short-lived objects/sec in Young Gen!
        // Causes frequent Young GC and Survivor promotion into Old Gen -> 1.2s STW freeze!
        EventPacket event = new EventPacket(new String(rawData), System.currentTimeMillis());
        process(event);
    }
}`,
    adaptiveCodeScaffold: `// Production Zero-GC Object Pool with Flyweight Pattern
public class ResilientPacketProcessor {
    private static final int POOL_SIZE = 1024;
    private final EventPacket[] pool = new EventPacket[POOL_SIZE];
    private int head = 0;

    public ResilientPacketProcessor() {
        for (int i = 0; i < POOL_SIZE; i++) pool[i] = new EventPacket();
    }

    public synchronized void onPacketReceived(byte[] rawData, int length) {
        // Reuse pre-allocated object: Zero GC allocation pressure!
        EventPacket event = pool[head];
        head = (head + 1) % POOL_SIZE;
        event.reset(rawData, length, System.currentTimeMillis());
        process(event);
    }
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: High-Density Packet Ingestion (200,000/sec)',
        alertHeadline: 'STOP-THE-WORLD GC PAUSE: 1,280ms Full GC Interruption',
        systemConstraint: 'Excessive object churn caused Minor and Major GC collections, stalling packet processing and triggering network socket dropouts.',
        telemetry: {
          meanLatency: '1,280ms GC Pause',
          errorRate: '35% Packet Loss',
          memoryFootprint: '440 MB Churn',
          activeRequests: '200,000 Packets/sec'
        },
        adaptiveOptions: [
          {
            id: 'opt_object_pool',
            title: 'Implement Reusable Object Pool + Primitive Byte Buffers',
            pros: 'Eliminates 99.8% of heap allocations; GC pauses drop from 1,280ms to under 4ms.',
            cons: 'Must strictly reset object state before reuse to prevent dirty reads.',
            recoveryTimeMinutes: 3.5,
            wasteIndex: 6,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-java-4',
    subjectKey: 'java',
    language: 'java',
    domain: 'Core & Enterprise Java (20A05401T)',
    title: 'JAVA Mission 4: Microservice Thread Starvation Under Slow External Service',
    shortTitle: 'Thread Starvation (Virtual Threads)',
    subjectBadge: 'Java • JNTUA II-II',
    badge: 'Thread Pool Exhaustion (504)',
    badgeColor: 'amber',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero HTTP 504 • Asynchronous Non-Blocking • Strict Timeout Fallback',
    brief: 'A campus grade lookup gateway calling an external university database. Using a fixed 20-thread pool with synchronous blocking HTTP calls, a 3-second database slowdown blocks all 20 threads, taking down the entire portal.',
    architecture: 'Java 21 / 17 • CompletableFuture • Virtual Threads / ForkJoinPool • Resilience4j Circuit Breaker',
    baselineResources: {
      budget: '20 OS Worker Threads',
      infrastructure: 'Spring MVC Gateway',
      dependencies: ['CompletableFuture', 'HttpClient'],
      deadline: '20 mins left'
    },
    starterCode: `// Synchronous Blocking Service (Exhausts Thread Pool in 2 seconds)
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class GradeService {
    private final ExecutorService threadPool = Executors.newFixedThreadPool(20);

    public String fetchGrade(String studentId) {
        // VULNERABILITY: Blocking call holds OS thread for 3000ms!
        // 20 concurrent requests freeze the entire server!
        return externalDatabaseCall(studentId); // Blocks thread!
    }
}`,
    adaptiveCodeScaffold: `// Production Non-Blocking Async Pipeline with CompletableFuture & Timeout Fallback
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class ResilientGradeService {
    public CompletableFuture<String> fetchGradeAsync(String studentId) {
        return CompletableFuture.supplyAsync(() -> externalDatabaseCall(studentId))
            .orTimeout(500, TimeUnit.MILLISECONDS) // Strict circuit SLA!
            .exceptionally(ex -> {
                // Return cached or degraded fallback grade record
                return "CACHED_GRADE_DATA_TEMP";
            });
    }
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: External Database Latency Spiked to 3,500ms',
        alertHeadline: 'GATEWAY TIMEOUT (504): All 20 OS Threads Blocked Indefinitely',
        systemConstraint: 'All worker threads are sleeping on socketRead0, rejecting all new student requests with HTTP 503 Service Unavailable.',
        telemetry: {
          meanLatency: '3,500ms (Timeout)',
          errorRate: '98% HTTP 503/504',
          memoryFootprint: '120 MB',
          activeRequests: '20 Threads Blocked'
        },
        adaptiveOptions: [
          {
            id: 'opt_async_timeout',
            title: 'Convert to CompletableFuture Pipeline with 500ms Timeout Fallback',
            pros: 'Frees worker threads immediately; users receive cached data within 500ms instead of 504 timeouts.',
            cons: 'Clients must handle partial or stale cached responses during outages.',
            recoveryTimeMinutes: 3.0,
            wasteIndex: 5,
            qualityScore: 97
          }
        ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 04. PYTHON (PYTHON & ASYNC DATA SYSTEMS - 20A05303T) - 4 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'btech-python-1',
    subjectKey: 'python',
    language: 'python',
    domain: 'Python & Async Data Systems (20A05303T)',
    title: 'PYTHON Mission 1: Multi-Threaded Web Scraper Under Global Interpreter Lock (GIL)',
    shortTitle: 'GIL Freeze (asyncio Scraper)',
    subjectBadge: 'Python • JNTUA II-I',
    badge: 'GIL Contention & CPU Freeze',
    badgeColor: 'blue',
    difficulty: 'Core B.Tech',
    targetSla: '10x Speedup • Zero GIL Contention • 1,000 URLs < 3.5s',
    brief: 'A campus internship scraping crawler using Python threading.Thread for CPU regex parsing and HTTP downloading. Due to the Python Global Interpreter Lock (GIL), 100 threads fight for a single core, causing 0% parallel speedup.',
    architecture: 'Python 3.11 • asyncio • aiohttp • ProcessPoolExecutor for CPU tasks',
    baselineResources: {
      budget: 'Single Core VM',
      infrastructure: 'Python standard runtime',
      dependencies: ['threading', 'urllib.request'],
      deadline: 'Assignment submission in 20 mins'
    },
    starterCode: `# Flawed Threading Scraper (GIL Contention & Thread Starvation)
import threading
import urllib.request
import re

def scrape_url(url):
    # VULNERABILITY: Standard urllib blocks the OS thread
    # Heavy regex parsing locks Python GIL, eliminating parallelism!
    response = urllib.request.urlopen(url)
    html = response.read().decode('utf-8')
    matches = re.findall(r'<a href="(.*?)"', html)
    return len(matches)

def run_scraper(urls):
    threads = []
    for u in urls:
        t = threading.Thread(target=scrape_url, args=(u,))
        threads.append(t)
        t.start()
    for t in threads: t.join()`,
    adaptiveCodeScaffold: `# Production Non-Blocking Async Scraper with ProcessPool CPU Offload
import asyncio
import aiohttp
import re
from concurrent.futures import ProcessPoolExecutor

def parse_regex(html):
    # Offloaded to separate OS process: Bypasses GIL completely!
    return len(re.findall(r'<a href="(.*?)"', html))

async def fetch_and_parse(session, url, process_pool):
    try:
        async with session.get(url, timeout=3.0) as resp:
            html = await resp.text()
            loop = asyncio.get_running_loop()
            return await loop.run_in_executor(process_pool, parse_regex, html)
    except Exception:
        return 0

async def main_scraper(urls):
    with ProcessPoolExecutor() as process_pool:
        connector = aiohttp.TCPConnector(limit=100)
        async with aiohttp.ClientSession(connector=connector) as session:
            tasks = [fetch_and_parse(session, u, process_pool) for u in urls]
            return await asyncio.gather(*tasks) # High-speed asynchronous concurrency!`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Target URL List Scaled from 20 to 1,000 Links',
        alertHeadline: 'GIL CONTENTION FREEZE: 100 Threads Stalled • Elapsed: 48.2s (SLA: <3.5s)',
        systemConstraint: 'OS thread context switching overhead and GIL lock contention caused total runtime to skyrocket to 48.2 seconds.',
        telemetry: {
          meanLatency: '48.2s (SLA: <3.5s)',
          errorRate: '40% Connection Timeouts',
          memoryFootprint: '140 MB',
          activeRequests: '1,000 URLs'
        },
        adaptiveOptions: [
          {
            id: 'opt_asyncio',
            title: 'Refactor to asyncio + aiohttp with ProcessPool for CPU Parsing',
            pros: 'Single event loop handles 1,000 I/O connections efficiently; regex CPU tasks run across true multi-core processes.',
            cons: 'Requires writing asynchronous code and managing process pool life cycle.',
            recoveryTimeMinutes: 3.5,
            wasteIndex: 6,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'btech-python-2',
    subjectKey: 'python',
    language: 'python',
    domain: 'Python & Async Data Systems (20A05303T)',
    title: 'PYTHON Mission 2: Real-Time IoT Telemetry Stream Ingestion Memory Leak',
    shortTitle: 'Streaming Memory Leak (Generators)',
    subjectBadge: 'Python • JNTUA II-I',
    badge: 'Pandas Heap Exhaustion',
    badgeColor: 'blue',
    difficulty: 'Core B.Tech',
    targetSla: 'Constant Memory < 40MB • Process 1,000,000 Records • Zero RAM Leak',
    brief: 'Campus weather station IoT telemetry aggregator using pandas.concat() in a loop to accumulate incoming readings. After 50,000 readings, DataFrame memory reallocations exhaust the 512MB RAM pod.',
    architecture: 'Python 3.11 • Generator Pipelines (yield) • collections.deque • Batched Flushing',
    baselineResources: {
      budget: '512MB RAM Pod Limit',
      infrastructure: 'Docker Container',
      dependencies: ['pandas'],
      deadline: 'Evaluation in 15 mins'
    },
    starterCode: `# Flawed In-Memory Accumulation (Consumes 500MB+ in 20 seconds)
import pandas as pd

def ingest_telemetry_stream(sensor_stream):
    df = pd.DataFrame()
    for reading in sensor_stream:
        # VULNERABILITY: pandas.concat copies the entire DataFrame on every iteration!
        # Quadratic memory reallocations trigger MemoryError!
        temp_df = pd.DataFrame([reading])
        df = pd.concat([df, temp_df], ignore_index=True)
    return df`,
    adaptiveCodeScaffold: `# Production Streaming Pipeline using Python Generators & Fixed Deque
from collections import deque
import itertools

def stream_processor(sensor_stream, batch_size=1000):
    # Constant O(1) memory overhead: never exceeds 20MB!
    buffer = []
    for reading in sensor_stream:
        buffer.append(reading)
        if len(buffer) >= batch_size:
            yield process_batch(buffer)
            buffer.clear()
    if buffer:
        yield process_batch(buffer)

def process_batch(batch):
    # Process or persist batch directly without holding in RAM
    return len(batch)`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Telemetry Influx Surged to 10,000 Events/sec',
        alertHeadline: 'CONTAINER OOM-KILLED: Memory Footprint 512 MB Exceeded',
        systemConstraint: 'Repeated DataFrame copies created quadratic memory allocations, triggering Linux OOM-killer SIGKILL on the container.',
        telemetry: {
          meanLatency: 'Killed',
          errorRate: '100% Pod Evictions',
          memoryFootprint: '512 MB / 512 MB Max',
          activeRequests: '10,000 Events/sec'
        },
        adaptiveOptions: [
          {
            id: 'opt_generators',
            title: 'Convert to Generator Streaming Pipeline with Batched Flushing',
            pros: 'Memory consumption stays strictly under 20MB regardless of stream duration; O(1) space complexity.',
            cons: 'Data must be consumed sequentially rather than randomly indexed.',
            recoveryTimeMinutes: 2.5,
            wasteIndex: 4,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-python-3',
    subjectKey: 'python',
    language: 'python',
    domain: 'Python & Async Data Systems (20A05303T)',
    title: 'PYTHON Mission 3: Deep Recursive JSON & AST Schema Validator Crash',
    shortTitle: 'JSON AST Validator (Recursion Limit)',
    subjectBadge: 'Python • JNTUA II-I',
    badge: 'RecursionError (Depth 1000)',
    badgeColor: 'blue',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Recursion Crash • Validate Nesting Depth 10,000 • Latency < 15ms',
    brief: 'A campus LMS homework auto-grader verifying student Python AST code structures using recursive functions. When a student submits nested expressions deeper than 1,000 levels, Python throws RecursionError.',
    architecture: 'Python 3.11 • Iterative Stack Traversal • collections.deque • Depth Tracking',
    baselineResources: {
      budget: 'sys.getrecursionlimit() = 1000',
      infrastructure: 'Autograder Sandbox',
      dependencies: ['Recursive validator'],
      deadline: 'Exam closes in 20 mins'
    },
    starterCode: `# Recursive AST Validator (Crashes at Depth 1000)
def validate_ast(node, depth=0):
    # VULNERABILITY: Python default recursion limit is 1,000!
    # Nesting depth > 1000 triggers RecursionError!
    if not isinstance(node, dict):
        return True
    for key, child in node.items():
        if isinstance(child, dict):
            if not validate_ast(child, depth + 1): # Deep call stack!
                return False
    return True`,
    adaptiveCodeScaffold: `# Production Iterative Stack Traversal (Zero Recursion Limit Constraints)
def validate_ast_iterative(root_node, max_allowed_depth=15000):
    if not isinstance(root_node, dict): return True
    # Explicit heap stack replaces Python call frame stack!
    stack = [(root_node, 0)]

    while stack:
        curr_node, curr_depth = stack.pop()
        if curr_depth > max_allowed_depth:
            return False # Reject malicious recursion bomb
        for key, child in curr_node.items():
            if isinstance(child, dict):
                stack.append((child, curr_depth + 1))
    return True`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Adversarial Nested Payload Injected (Depth 3,500)',
        alertHeadline: 'RecursionError: maximum recursion depth exceeded in comparison',
        systemConstraint: 'The test dataset contains deeply nested JSON dictionaries designed to test system boundaries, instantly terminating the evaluation script.',
        telemetry: {
          meanLatency: 'Crash',
          errorRate: '100% Failed',
          memoryFootprint: '12 MB',
          activeRequests: 'Depth 3,500 Payload'
        },
        adaptiveOptions: [
          {
            id: 'opt_iterative_stack',
            title: 'Convert to Explicit Iterative Stack Loop',
            pros: 'Completely immune to Python recursion limits; safely traverses millions of nested levels.',
            cons: 'Requires managing tuple stacks manually in code.',
            recoveryTimeMinutes: 2.2,
            wasteIndex: 3,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'btech-python-4',
    subjectKey: 'python',
    language: 'python',
    domain: 'Python & Async Data Systems (20A05303T)',
    title: 'PYTHON Mission 4: FastAPI Event Loop Starvation Under Synchronous CPU Tasks',
    shortTitle: 'FastAPI Loop Freeze (Worker Offload)',
    subjectBadge: 'Python • JNTUA II-I',
    badge: 'Event Loop Blocked (100% Latency)',
    badgeColor: 'blue',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Event Loop Blocking • Health Check Latency < 10ms • Async Worker Pool',
    brief: 'Campus student certificate verification microservice built with FastAPI. A developer accidentally ran a synchronous CPU password hashing loop inside an async def endpoint, freezing the entire server for all other users.',
    architecture: 'Python 3.11 • FastAPI • asyncio.to_thread • ProcessPoolExecutor',
    baselineResources: {
      budget: 'Uvicorn single worker',
      infrastructure: 'Cloud Run Container',
      dependencies: ['FastAPI', 'bcrypt / hashlib'],
      deadline: 'Evaluation in 15 mins'
    },
    starterCode: `# Flawed Async Endpoint (Blocking Event Loop)
import time
import hashlib

# VULNERABILITY: Running heavy CPU work directly inside async def!
# Blocks the single Uvicorn event loop thread!
async def verify_certificate(cert_data: str):
    # Simulating heavy cryptographic proof (2,500ms CPU lock!)
    for _ in range(10000000):
        cert_data = hashlib.sha256(cert_data.encode()).hexdigest()
    return {"status": "verified"}`,
    adaptiveCodeScaffold: `# Production Non-Blocking Async Delegation with asyncio.to_thread
import asyncio
import hashlib

def cpu_intensive_hashing(cert_data: str) -> str:
    # Pure CPU work isolated in standard function
    for _ in range(10000000):
        cert_data = hashlib.sha256(cert_data.encode()).hexdigest()
    return cert_data

async def verify_certificate_resilient(cert_data: str):
    # Offloaded to background thread pool: Event loop remains 100% responsive!
    result = await asyncio.to_thread(cpu_intensive_hashing, cert_data)
    return {"status": "verified", "proof": result[:16]}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Concurrent Health Checks Failing (504 Gateway Timeout)',
        alertHeadline: 'EVENT LOOP STARVATION: Health Check Latency Spiked to 2,800ms (SLA: <10ms)',
        systemConstraint: 'The single async event loop is blocked running hashing math, causing load balancer health checks to fail and trigger container restarts.',
        telemetry: {
          meanLatency: '2,800ms',
          errorRate: '92% Health Check Drops',
          memoryFootprint: '38 MB',
          activeRequests: '50 Concurrent Hashing Calls'
        },
        adaptiveOptions: [
          {
            id: 'opt_to_thread',
            title: 'Offload CPU Tasks via asyncio.to_thread / ProcessPool',
            pros: 'Event loop stays unblocked; health check responses return in 2ms while math processes in the background.',
            cons: 'Thread context switching adds minor overhead.',
            recoveryTimeMinutes: 2.8,
            wasteIndex: 4,
            qualityScore: 98
          }
        ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 05. ML (MACHINE LEARNING & DEEP LEARNING - 20A05602T) - 4 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'btech-ml-1',
    subjectKey: 'ml',
    language: 'python',
    domain: 'Machine Learning & Deep Learning (20A05602T)',
    title: 'ML Mission 1: Transformer Sentiment Pipeline Under CUDA Out of Memory (OOM)',
    shortTitle: 'Transformer CUDA OOM (AMP FP16)',
    subjectBadge: 'ML • JNTUA III-II',
    badge: 'CUDA Out Of Memory (OOM)',
    badgeColor: 'purple',
    difficulty: 'Advanced B.Tech',
    targetSla: 'Zero OOM Crash • FP16 Mixed Precision • Batch Latency < 60ms',
    brief: 'Campus feedback sentiment analysis model fine-tuning with RoBERTa on an NVIDIA T4 GPU (16GB VRAM). Batch size 64 with full FP32 gradients causes instant CUDA out of memory.',
    architecture: 'Python 3.11 • PyTorch • torch.cuda.amp (FP16) • Gradient Accumulation',
    baselineResources: {
      budget: '16GB VRAM GPU Quota',
      infrastructure: 'PyTorch / HuggingFace',
      dependencies: ['torch', 'transformers'],
      deadline: 'Model submission closes in 25 mins'
    },
    starterCode: `# Naive Full Precision Training (CUDA OOM at Batch Size 64)
import torch

def train_epoch(model, dataloader, optimizer, criterion):
    model.train()
    for batch_x, batch_y in dataloader:
        batch_x, batch_y = batch_x.cuda(), batch_y.cuda()
        # VULNERABILITY: FP32 activations for 512 tokens * batch 64 = 18.4 GB VRAM!
        # Exceeds 16GB GPU memory -> RuntimeError: CUDA out of memory!
        outputs = model(batch_x)
        loss = criterion(outputs, batch_y)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()`,
    adaptiveCodeScaffold: `# Production Resilient Training: FP16 Mixed Precision + Gradient Accumulation
import torch
from torch.cuda.amp import autocast, GradScaler

def train_epoch_resilient(model, dataloader, optimizer, criterion, accum_steps=4):
    model.train()
    scaler = GradScaler()
    optimizer.zero_grad()

    for idx, (batch_x, batch_y) in enumerate(dataloader):
        batch_x, batch_y = batch_x.cuda(), batch_y.cuda()
        # Halves VRAM usage with FP16 automatic mixed precision!
        with autocast():
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y) / accum_steps

        scaler.scale(loss).backward()

        if (idx + 1) % accum_steps == 0:
            scaler.step(optimizer)
            scaler.update()
            optimizer.zero_grad()
            torch.cuda.empty_cache()`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Batch Size Scaled to 64 with 512 Sequence Length',
        alertHeadline: 'RuntimeError: CUDA out of memory. Tried to allocate 18.42 GiB (GPU 0 has 15.78 GiB total)',
        systemConstraint: 'Full 32-bit floating point tensor backpropagation exceeded GPU VRAM, immediately crashing the training pod.',
        telemetry: {
          meanLatency: 'Crash (OOM)',
          errorRate: '100%',
          memoryFootprint: '18.42 GB / 15.78 GB VRAM',
          activeRequests: 'Batch Size 64'
        },
        adaptiveOptions: [
          {
            id: 'opt_amp_fp16',
            title: 'Enable Automatic Mixed Precision (AMP FP16) + Gradient Accumulation',
            pros: 'Reduces VRAM consumption from 18.4 GB to 7.2 GB (passes easily on 16GB GPU), 2x faster throughput.',
            cons: 'Requires GradScaler to avoid gradient underflow in small layers.',
            recoveryTimeMinutes: 3.5,
            wasteIndex: 5,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'btech-ml-2',
    subjectKey: 'ml',
    language: 'python',
    domain: 'Machine Learning & Deep Learning (20A05602T)',
    title: 'ML Mission 2: Real-Time Fraud Classifier Inference Latency Breach',
    shortTitle: 'Inference Latency (ONNX Quantization)',
    subjectBadge: 'ML • JNTUA III-II',
    badge: 'SLA Breach (Latency > 400ms)',
    badgeColor: 'purple',
    difficulty: 'Advanced B.Tech',
    targetSla: 'Inference Latency < 25ms • 99.2% Accuracy Preserved • CPU Only',
    brief: 'Campus canteen digital payment fraud detector with single-item inference latency SLA of <25ms. Unvectorized Pandas feature parsing and unoptimized deep PyTorch model causes 420ms latency.',
    architecture: 'Python 3.11 • ONNX Runtime • INT8 Dynamic Quantization • NumPy Vectorization',
    baselineResources: {
      budget: '2 vCPU CPU Host',
      infrastructure: 'Inference Microservice',
      dependencies: ['onnxruntime', 'torch'],
      deadline: 'Evaluation in 20 mins'
    },
    starterCode: `# Unoptimized Python Model Inference (420ms Latency per Prediction)
import torch
import pandas as pd

def predict_fraud(transaction_dict, model):
    # VULNERABILITY: Constructing DataFrame and unvectorized PyTorch FP32 CPU graph!
    # Single sample prediction takes 420ms, violating 25ms payment gateway SLA!
    df = pd.DataFrame([transaction_dict])
    features = torch.tensor(df.values, dtype=torch.float32)
    with torch.no_grad():
        output = model(features)
    return output.item() > 0.5`,
    adaptiveCodeScaffold: `# Production Resilient Inference: ONNX Runtime INT8 Quantized Model
import onnxruntime as ort
import numpy as np

# Load pre-quantized INT8 model: 4x smaller, 12x faster on CPU!
session = ort.InferenceSession("fraud_model_quantized.onnx", providers=['CPUExecutionProvider'])
input_name = session.get_inputs()[0].name

def predict_fraud_fast(features_array):
    # Vectorized NumPy array directly fed to ONNX engine: Latency = 12ms!
    inputs = {input_name: features_array.astype(np.float32)}
    output = session.run(None, inputs)[0]
    return output[0] > 0.5`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Gateway Strict SLA Enforced (<25ms)',
        alertHeadline: 'SLA VIOLATION: Transaction Latency 420ms (Target: <25ms)',
        systemConstraint: 'The payment gateway is dropping transactions that take longer than 50ms, causing a 94% failure rate for student lunch orders.',
        telemetry: {
          meanLatency: '420ms (Target: <25ms)',
          errorRate: '94% SLA Rejections',
          memoryFootprint: '210 MB',
          activeRequests: '500 Trans/sec'
        },
        adaptiveOptions: [
          {
            id: 'opt_onnx_quant',
            title: 'Export Model to ONNX and Apply INT8 Dynamic Quantization',
            pros: 'Inference latency plummets from 420ms to 12ms (35x speedup) with <0.3% accuracy loss.',
            cons: 'Requires one-time offline conversion to ONNX format.',
            recoveryTimeMinutes: 3.2,
            wasteIndex: 6,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-ml-3',
    subjectKey: 'ml',
    language: 'python',
    domain: 'Machine Learning & Deep Learning (20A05602T)',
    title: 'ML Mission 3: High-Volume Image Embeddings Memory Leak Under Computational Graph',
    shortTitle: 'PyTorch Graph Leak (no_grad)',
    subjectBadge: 'ML • JNTUA III-II',
    badge: 'Computational Graph Memory Leak',
    badgeColor: 'purple',
    difficulty: 'Advanced B.Tech',
    targetSla: 'Zero Memory Leak • Process 50,000 Images • VRAM < 4GB',
    brief: 'Campus student ID face verification feature extractor. Omitting torch.no_grad() and storing raw loss tensors retains the backward autograd graph in GPU memory, crashing after 2,000 images.',
    architecture: 'PyTorch • torch.no_grad() • tensor.item() decoupling • torch.cuda.empty_cache()',
    baselineResources: {
      budget: '8GB VRAM',
      infrastructure: 'Embedding Service',
      dependencies: ['torch', 'torchvision'],
      deadline: '15 mins left'
    },
    starterCode: `# Flawed Embedding Loop (Retains Autograd Graph in GPU RAM)
import torch

def extract_all_embeddings(images, model):
    all_embeddings = []
    for img in images:
        # VULNERABILITY: torch.no_grad() omitted!
        # Every forward pass retains computation history, exhausting 8GB VRAM in 3 minutes!
        emb = model(img.cuda())
        all_embeddings.append(emb) # Retains tensor connected to autograd graph!
    return all_embeddings`,
    adaptiveCodeScaffold: `# Production Leak-Free Embedding Pipeline
import torch

def extract_all_embeddings_resilient(images, model):
    all_embeddings = []
    model.eval()
    # Explicitly disables autograd engine: Zero graph retention!
    with torch.no_grad():
        for img in images:
            emb = model(img.cuda())
            # Decouple from GPU tensor to CPU numpy array immediately
            all_embeddings.append(emb.cpu().numpy())
    return all_embeddings`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Batch Expanded to 10,000 Student Images',
        alertHeadline: 'CUDA OUT OF MEMORY: GPU VRAM Leaked and Exhausted (8.0 GB / 8.0 GB)',
        systemConstraint: 'Autograd graph pointers were accumulated in Python lists, preventing garbage collection and crashing the service.',
        telemetry: {
          meanLatency: 'Crash',
          errorRate: '100% Failed',
          memoryFootprint: '8.0 GB / 8.0 GB Max',
          activeRequests: '10,000 Images'
        },
        adaptiveOptions: [
          {
            id: 'opt_no_grad',
            title: 'Wrap with torch.no_grad() and Decouple Tensors to CPU',
            pros: 'Completely halts autograd graph creation, memory remains stable at 850 MB for infinite images.',
            cons: 'Tensors cannot be used for backpropagation in this mode.',
            recoveryTimeMinutes: 2.0,
            wasteIndex: 2,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'btech-ml-4',
    subjectKey: 'ml',
    language: 'python',
    domain: 'Machine Learning & Deep Learning (20A05602T)',
    title: 'ML Mission 4: Streaming Classifier Collapse Under Sudden Covariate Concept Drift',
    shortTitle: 'Concept Drift (Adaptive Window)',
    subjectBadge: 'ML • JNTUA III-II',
    badge: 'Accuracy Collapse (94% -> 48%)',
    badgeColor: 'purple',
    difficulty: 'Advanced B.Tech',
    targetSla: 'Maintain Accuracy > 85% • Real-time Drift Detection < 50 samples • Online Learning',
    brief: 'Campus library seat occupancy predictor. When exam season starts, student arrival patterns shift dramatically (covariate shift), causing a static logistic regression model accuracy to drop from 94% to 48%.',
    architecture: 'Python 3.11 • River / Online ML • ADWIN (Adaptive Windowing) • Incremental SGD',
    baselineResources: {
      budget: 'Continuous Streaming Pipeline',
      infrastructure: 'Online Worker',
      dependencies: ['river', 'scikit-learn'],
      deadline: '20 mins left'
    },
    starterCode: `# Static Model (Fails Under Sudden Concept Drift)
from sklearn.linear_model import SGDClassifier

class StaticSeatPredictor:
    def __init__(self):
        self.model = SGDClassifier() # Trained once on old data!

    def predict(self, feature_vector):
        # VULNERABILITY: Zero adaptation to changing student patterns!
        # Accuracy collapses to 48% when exam season changes behaviour!
        return self.model.predict([feature_vector])[0]`,
    adaptiveCodeScaffold: `# Production Online Learning with ADWIN Drift Detector
class ResilientAdaptivePredictor:
    def __init__(self):
        self.model = SGDClassifier()
        self.window = []
        self.window_size = 200

    def predict_and_learn(self, x, y_true=None):
        pred = self.model.predict([x])[0]
        if y_true is not None:
            # Continual incremental online model update
            self.model.partial_fit([x], [y_true], classes=[0, 1])
            self.window.append(pred == y_true)
            if len(self.window) > self.window_size:
                self.window.pop(0)
                # If accuracy drops below 70%, trigger aggressive warm-restart
                if sum(self.window) / len(self.window) < 0.70:
                    self.model.learning_rate = 'adaptive'
        return pred`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Exam Season Schedule Change (Data Distribution Shift)',
        alertHeadline: 'MODEL COLLAPSE: Prediction Accuracy Degraded from 94% to 48%',
        systemConstraint: 'Student arrival times shifted by 4 hours. The static model fails to predict building HVAC requirements, causing power grid brownouts.',
        telemetry: {
          meanLatency: '15ms',
          errorRate: '52% Misclassifications',
          memoryFootprint: '45 MB',
          activeRequests: 'Streaming Data'
        },
        adaptiveOptions: [
          {
            id: 'opt_online_drift',
            title: 'Implement Online Partial Fitting with Sliding Window Drift Alarm',
            pros: 'Model automatically adapts to new distributions within 100 samples; accuracy recovers to 89%.',
            cons: 'Requires ongoing ground truth feedback to update weights.',
            recoveryTimeMinutes: 3.5,
            wasteIndex: 7,
            qualityScore: 97
          }
        ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 06. DBMS (DATABASE MANAGEMENT SYSTEMS - 20A05403T) - 4 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'btech-dbms-1',
    subjectKey: 'dbms',
    language: 'sql',
    domain: 'Database Management Systems (20A05403T)',
    title: 'DBMS Mission 1: University Exam Registration Under N+1 SQL Query Storm',
    shortTitle: 'Exam N+1 Query Storm',
    subjectBadge: 'DBMS • JNTUA II-II',
    badge: 'N+1 Query Storm (Pool Exhausted)',
    badgeColor: 'rose',
    difficulty: 'Core B.Tech',
    targetSla: 'Single Batch Query • Execution < 45ms • Zero Connection Pool Timeout',
    brief: 'A semester exam registration portal fetching 5,000 eligible students and querying their fee receipt records in a loop (1 query + 5,000 queries = 5,001 SQL queries), crashing MySQL with Error 1040: Too many connections.',
    architecture: 'PostgreSQL / MySQL 8.0 • Composite B-Tree Indexing • Single JOIN • Subquery Batching',
    baselineResources: {
      budget: 'MySQL Connection Pool Max: 100 Connections',
      infrastructure: 'GPREC Examination Database',
      dependencies: ['MySQL 8.0', 'ORM Query Generator'],
      deadline: 'Hall ticket issuance closes in 15 mins'
    },
    starterCode: `-- Naive N+1 Query Cascade (Generates 5,001 Database Queries!)
-- Query 1: Fetch all 5,000 students
SELECT student_id, roll_number, name FROM students WHERE branch = 'CSE';

-- Queries 2 to 5001: Executed sequentially inside application code loop!
-- VULNERABILITY: 5,000 round-trips exhaust database connection pool!
-- RESULT: SQL Error: 1040 - Too many connections!
SELECT status, amount_paid FROM fee_receipts WHERE student_id = 1;
SELECT status, amount_paid FROM fee_receipts WHERE student_id = 2;
-- ... repeats 5,000 times!`,
    adaptiveCodeScaffold: `-- Production Optimized Single Batch JOIN Query with Composite Indexing
-- Step 1: Ensure composite covering index exists
CREATE INDEX idx_student_fee_status ON fee_receipts(student_id, status);

-- Step 2: Single atomic relational JOIN replaces 5,001 queries in ONE 18ms roundtrip!
SELECT 
    s.student_id, 
    s.roll_number, 
    s.name, 
    COALESCE(f.status, 'UNPAID') AS fee_status,
    COALESCE(f.amount_paid, 0) AS amount_paid
FROM students s
INNER JOIN fee_receipts f ON s.student_id = f.student_id
WHERE s.branch = 'CSE' 
  AND f.academic_year = '2026-2027';`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: 5,000 Students Access Portal Simultaneously',
        alertHeadline: 'DATABASE CRASH: Error 1040 - Too many connections (Connection Pool 100% Starved)',
        systemConstraint: 'The N+1 query pattern spawned 5,000 individual queries in 3 seconds, exhausting all 100 connection pool slots and causing an immediate portal outage.',
        telemetry: {
          meanLatency: '8,450ms (Timeout)',
          errorRate: '100% Failed',
          memoryFootprint: 'Pool Exhausted (100/100 Slots)',
          activeRequests: '5,001 SQL Queries'
        },
        adaptiveOptions: [
          {
            id: 'opt_inner_join',
            title: 'Refactor to Single Composite INNER JOIN Query',
            pros: 'Reduces 5,001 queries to 1 query, execution time drops from 8,450ms to 18ms, connection pool stays at 2% usage.',
            cons: 'Requires writing custom SQL or using ORM joinedload/selectinload.',
            recoveryTimeMinutes: 2.2,
            wasteIndex: 3,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'btech-dbms-2',
    subjectKey: 'dbms',
    language: 'sql',
    domain: 'Database Management Systems (20A05403T)',
    title: 'DBMS Mission 2: ATM Concurrent Withdrawal Lost Updates Race Condition',
    shortTitle: 'ATM Race Condition (FOR UPDATE)',
    subjectBadge: 'DBMS • JNTUA II-II',
    badge: 'Lost Update & Negative Balance',
    badgeColor: 'rose',
    difficulty: 'Core B.Tech',
    targetSla: 'Strict Serializable ACID • Zero Negative Balance • Pessimistic Lock < 15ms',
    brief: 'Campus smartcard balance debiting system without pessimistic locking. When a student initiates two concurrent payments of Rs 500 on an account with only Rs 600, both read Rs 600 before write, resulting in an illegal Rs -400 negative balance.',
    architecture: 'SQL • SELECT FOR UPDATE • ACID Transactions • Isolation Level READ COMMITTED / SERIALIZABLE',
    baselineResources: {
      budget: 'PostgreSQL DB',
      infrastructure: 'Canteen POS Terminal',
      dependencies: ['Raw SQL Queries'],
      deadline: 'Evaluation in 15 mins'
    },
    starterCode: `-- Flawed Non-Atomic Withdrawal (Lost Update Vulnerability)
-- Thread 1 & Thread 2 execute simultaneously:
SELECT balance FROM accounts WHERE account_id = 101; -- Both read 600.00!

-- Application checks if balance >= 500.00 (Both return TRUE!)
-- Thread 1 writes:
UPDATE accounts SET balance = balance - 500 WHERE account_id = 101;
-- Thread 2 writes:
UPDATE accounts SET balance = balance - 500 WHERE account_id = 101;
-- RESULT: Account balance becomes -400.00! Data integrity violated!`,
    adaptiveCodeScaffold: `-- Production Atomic Transaction with Pessimistic Row Lock (SELECT ... FOR UPDATE)
BEGIN TRANSACTION;

-- Acquires exclusive row lock on account 101: Thread 2 must wait until Thread 1 commits!
SELECT balance 
FROM accounts 
WHERE account_id = 101 
FOR UPDATE;

-- Safe atomic update check
UPDATE accounts 
SET balance = balance - 500.00 
WHERE account_id = 101 
  AND balance >= 500.00;

-- Verification
COMMIT;`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Concurrent Dual-Terminal Tap on Same Account',
        alertHeadline: 'DATA INTEGRITY VIOLATION: Negative Account Balance (-400.00 INR)',
        systemConstraint: 'Concurrent non-locked read operations led to a classic Lost Update anomaly, causing financial loss to the campus cafeteria.',
        telemetry: {
          meanLatency: '12ms',
          errorRate: '100% Race Condition',
          memoryFootprint: 'Clean',
          activeRequests: '2 Concurrent Debits'
        },
        adaptiveOptions: [
          {
            id: 'opt_for_update',
            title: 'Wrap in Explicit Transaction with SELECT ... FOR UPDATE',
            pros: 'Pessimistic lock blocks second reader until first completes; guarantees 100% ACID consistency.',
            cons: 'Slightly reduces concurrency on the exact same account row during write operations.',
            recoveryTimeMinutes: 2.5,
            wasteIndex: 4,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'btech-dbms-3',
    subjectKey: 'dbms',
    language: 'sql',
    domain: 'Database Management Systems (20A05403T)',
    title: 'DBMS Mission 3: College Fest Ticket Flash Sale Single-Row Lock Contention',
    shortTitle: 'Flash Sale Lock Contention (Sharding)',
    subjectBadge: 'DBMS • JNTUA II-II',
    badge: 'Lock Wait Timeout Exceeded',
    badgeColor: 'rose',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Lock Timeout • Throughput > 2,000 Trans/sec • Sharded Inventory',
    brief: 'Annual college cultural fest tickets flash sale. 3,000 students clicking Buy Now simultaneously contend for an exclusive lock on a single inventory row (item_id = 1), causing Error 1205: Lock wait timeout exceeded.',
    architecture: 'SQL • Inventory Sharding (Partitioning into 10 buckets) • Atomic Decrement',
    baselineResources: {
      budget: 'MySQL 8.0 Engine',
      infrastructure: 'High-Concurrency Event Portal',
      dependencies: ['InnoDB Row Locks'],
      deadline: 'Fest ticket sale opens in 20 mins'
    },
    starterCode: `-- Single Row Contention (3,000 students locking the same row!)
-- VULNERABILITY: Every student attempts to decrement the exact same single row!
-- RESULT: Lock wait timeout exceeded; transactions abort!
UPDATE ticket_inventory 
SET remaining_seats = remaining_seats - 1 
WHERE event_id = 99 AND remaining_seats > 0;`,
    adaptiveCodeScaffold: `-- Production Sharded Inventory Pattern: 10 Parallel Buckets
-- Instead of 1 row with 10,000 seats, split into 10 sharded rows with 1,000 seats each!
-- Client randomly picks shard (event_id = 99, shard_id = FLOOR(RAND() * 10)):
UPDATE ticket_inventory_shards 
SET remaining_seats = remaining_seats - 1 
WHERE event_id = 99 
  AND shard_id = (FLOOR(RAND() * 10)) 
  AND remaining_seats > 0;

-- Global stock count query uses fast SUM without locking individual rows:
SELECT SUM(remaining_seats) AS total_available 
FROM ticket_inventory_shards 
WHERE event_id = 99;`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: 3,000 Students Purchasing within 500 Milliseconds',
        alertHeadline: 'DATABASE ERROR 1205: Lock wait timeout exceeded; try restarting transaction',
        systemConstraint: 'Row-level locking on a single row forced 2,999 transactions into a queue, exceeding the 50-second InnoDB lock wait timeout.',
        telemetry: {
          meanLatency: '50,000ms (Timeout)',
          errorRate: '98% Transaction Aborts',
          memoryFootprint: 'Heavy Lock Tables',
          activeRequests: '3,000 Simultaneous Locks'
        },
        adaptiveOptions: [
          {
            id: 'opt_sharded_inventory',
            title: 'Implement Inventory Counter Sharding (10 Random Shards)',
            pros: 'Divides lock contention by 10x; throughput jumps from 45/sec to 2,800/sec with zero timeouts.',
            cons: 'Requires reconciling empty shards when stock gets low.',
            recoveryTimeMinutes: 3.5,
            wasteIndex: 8,
            qualityScore: 97
          }
        ]
    }
  },
  {
    id: 'btech-dbms-4',
    subjectKey: 'dbms',
    language: 'sql',
    domain: 'Database Management Systems (20A05403T)',
    title: 'DBMS Mission 4: Full-Text Student Profile Search Table Scan Timeout',
    shortTitle: 'Full-Text Search (Trigram GIN)',
    subjectBadge: 'DBMS • JNTUA II-II',
    badge: 'Sequential Scan (LIKE %...%)',
    badgeColor: 'rose',
    difficulty: 'Core B.Tech',
    targetSla: 'Search Latency < 15ms • 1,000,000 Records • GIN Trigram Index',
    brief: 'Placement cell recruiter resume keyword search on 1,000,000 student project portfolios. Using WHERE resume_text LIKE "%machine learning%" performs a full sequential table scan taking 18.4 seconds.',
    architecture: 'PostgreSQL • pg_trgm Extension • GIN Index • tsvector / tsquery',
    baselineResources: {
      budget: 'PostgreSQL 15',
      infrastructure: 'Campus Placement Portal',
      dependencies: ['pg_trgm extension'],
      deadline: 'Recruiter campus visit in 20 mins'
    },
    starterCode: `-- Naive Wildcard Search (Full Table Scan: 18.4 Seconds!)
-- VULNERABILITY: Leading wildcard '%...' cannot use standard B-Tree index!
-- Forces sequential disk scan of 1,000,000 rows!
SELECT student_id, name, branch, resume_text 
FROM student_resumes 
WHERE resume_text LIKE '%machine learning%';`,
    adaptiveCodeScaffold: `-- Production Full-Text Indexing with PostgreSQL GIN Trigram Index
-- Step 1: Enable high-speed trigram extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Step 2: Create Generalized Inverted Index (GIN) on resume_text
CREATE INDEX idx_resumes_trgm ON student_resumes USING gin (resume_text gin_trgm_ops);

-- Step 3: High-speed indexed query executes in 12ms instead of 18,400ms!
SELECT student_id, name, branch, resume_text 
FROM student_resumes 
WHERE resume_text ILIKE '%machine learning%';`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Resume Database Expanded to 1,000,000 Records',
        alertHeadline: 'QUERY TIMEOUT: Sequential Scan Elapsed: 18,420ms (SLA: <50ms)',
        systemConstraint: 'B-Tree indexes are ignored for leading wildcards. Recruiter web UI times out with HTTP 504 Gateway Timeout.',
        telemetry: {
          meanLatency: '18,420ms',
          errorRate: '100% Timeouts',
          memoryFootprint: 'High Disk I/O Read',
          activeRequests: '1,000,000 Rows Scanned'
        },
        adaptiveOptions: [
          {
            id: 'opt_gin_trgm',
            title: 'Create PostgreSQL GIN Trigram Index (pg_trgm)',
            pros: 'Query latency drops from 18,420ms to 12ms (1,500x speedup), supports substring searching efficiently.',
            cons: 'Index takes approximately 120MB disk space and adds slight insert overhead.',
            recoveryTimeMinutes: 2.0,
            wasteIndex: 3,
            qualityScore: 99
          }
        ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 07. OS (OPERATING SYSTEMS & CONCURRENCY - 20A05404T) - 4 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'btech-os-1',
    subjectKey: 'os',
    language: 'c',
    domain: 'Operating Systems & Concurrency (20A05404T)',
    title: 'OS Mission 1: Real-Time Cardiac Monitor Priority Inversion Starvation',
    shortTitle: 'Priority Inversion (PIP)',
    subjectBadge: 'OS • JNTUA II-II',
    badge: 'Priority Inversion Starvation',
    badgeColor: 'indigo',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Starvation • Priority Inheritance Protocol • Alert Response < 2ms',
    brief: 'A biomedical ICU monitor running on an embedded real-time OS. A low-priority logging task acquires an I2C bus mutex, then a medium-priority background diagnostic task preempts it, indefinitely starving the critical high-priority cardiac alert task.',
    architecture: 'C (POSIX RT) • pthread_mutexattr_setprotocol • PTHREAD_PRIO_INHERIT • SCHED_FIFO',
    baselineResources: {
      budget: 'Embedded RTOS Core',
      infrastructure: 'POSIX Real-Time Threads',
      dependencies: ['pthread.h'],
      deadline: 'Biomedical device certification audit in 15 mins'
    },
    starterCode: `// Flawed Mutex without Priority Inheritance (Classic Priority Inversion)
#include <pthread.h>

pthread_mutex_t bus_mutex = PTHREAD_MUTEX_INITIALIZER;

// Low Priority Task acquires mutex
void* low_task(void* arg) {
    pthread_mutex_lock(&bus_mutex);
    // VULNERABILITY: Medium priority task preempts Low Task here!
    // High Task arrives and tries to lock bus_mutex, but gets BLOCKED!
    // Result: Low Task cannot run to release lock because Medium Task is running!
    // High Priority Task is STARVED INDEFINITELY!
    pthread_mutex_unlock(&bus_mutex);
    return NULL;
}`,
    adaptiveCodeScaffold: `// Production Real-Time Mutex with Priority Inheritance Protocol (PIP)
#include <pthread.h>

pthread_mutex_t bus_mutex;

void init_resilient_mutex() {
    pthread_mutexattr_t attr;
    pthread_mutexattr_init(&attr);

    // Enables Priority Inheritance: When High Task blocks on this mutex,
    // Low Task temporarily inherits High Task's priority, preventing
    // Medium Task from preempting it!
    pthread_mutexattr_setprotocol(&attr, PTHREAD_PRIO_INHERIT);
    pthread_mutex_init(&bus_mutex, &attr);
    pthread_mutexattr_destroy(&attr);
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: High-Priority Cardiac Arrest Event Triggered',
        alertHeadline: 'WATCHDOG TIMEOUT: High-Priority Emergency Task Starved for 5,200ms',
        systemConstraint: 'Medium-priority diagnostic tasks consumed 100% CPU, preventing the low-priority task from releasing the shared mutex.',
        telemetry: {
          meanLatency: '5,200ms (Blocked)',
          errorRate: '100% Deadlock Alert',
          memoryFootprint: 'Clean',
          activeRequests: 'Priority Inversion Active'
        },
        adaptiveOptions: [
          {
            id: 'opt_prio_inherit',
            title: 'Configure PTHREAD_PRIO_INHERIT Mutex Protocol',
            pros: 'Temporarily boosts low task priority to ceiling of highest waiter; resolves inversion in 0.8ms.',
            cons: 'Requires kernel RT support (Linux PREEMPT_RT or standard POSIX).',
            recoveryTimeMinutes: 2.8,
            wasteIndex: 4,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'btech-os-2',
    subjectKey: 'os',
    language: 'c',
    domain: 'Operating Systems & Concurrency (20A05404T)',
    title: 'OS Mission 2: Multi-Process Shared Memory IPC Ring Buffer Corruption',
    shortTitle: 'IPC Shared Memory (Semaphores)',
    subjectBadge: 'OS • JNTUA II-II',
    badge: 'Race Condition & Memory Segfault',
    badgeColor: 'indigo',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Memory Corruption • POSIX Named Semaphores • Throughput > 50,000 Msg/s',
    brief: 'Campus surveillance camera streaming uncompressed frames between process A and process B via POSIX shm_open(). Without atomic memory synchronization, reader reads half-written frames, crashing with SIGSEGV.',
    architecture: 'C (POSIX) • shm_open / mmap • Named Semaphores (sem_open) • Memory Barriers',
    baselineResources: {
      budget: '64MB Shared Memory Segment',
      infrastructure: 'Linux Multi-Process IPC',
      dependencies: ['sys/mman.h', 'semaphore.h'],
      deadline: 'Practical test closes in 20 mins'
    },
    starterCode: `// Unsynchronized Shared Memory Ring Buffer (Race Condition & Data Corruption)
#include <sys/mman.h>
#include <fcntl.h>

struct SharedBuffer {
    int write_idx;
    int read_idx;
    char data[1024][256];
};

void write_frame(struct SharedBuffer* buf, const char* msg) {
    // VULNERABILITY: No synchronization! Writer overwrites unread frames!
    // Reader processes garbled memory causing Segmentation Fault!
    buf->write_idx = (buf->write_idx + 1) % 1024;
}`,
    adaptiveCodeScaffold: `// Production Synchronized IPC with POSIX Named Semaphores
#include <semaphore.h>
#include <fcntl.h>

struct ResilientIPC {
    sem_t* mutex;
    sem_t* empty_slots; // Counting semaphore for producer backpressure
    sem_t* filled_slots; // Counting semaphore for consumer readiness
};

void init_ipc(struct ResilientIPC* ipc) {
    ipc->mutex = sem_open("/shm_mutex", O_CREAT, 0644, 1);
    ipc->empty_slots = sem_open("/shm_empty", O_CREAT, 0644, 1024);
    ipc->filled_slots = sem_open("/shm_filled", O_CREAT, 0644, 0);
}

void safe_write(struct ResilientIPC* ipc, char* dest, const char* src) {
    sem_wait(ipc->empty_slots); // Block if buffer is full
    sem_wait(ipc->mutex);
    // Write frame safely
    sem_post(ipc->mutex);
    sem_post(ipc->filled_slots); // Signal consumer
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: High-Framerate Video Stream (120 FPS Injected)',
        alertHeadline: 'SEGMENTATION FAULT: Reader Read Corrupted Frame Pointers',
        systemConstraint: 'Producer overwrote unread circular buffer entries without synchronization, corrupting pointer addresses in the consumer process.',
        telemetry: {
          meanLatency: 'Crash (SIGSEGV)',
          errorRate: '100% Corruption',
          memoryFootprint: '64 MB Shared Mem',
          activeRequests: '120 FPS Stream'
        },
        adaptiveOptions: [
          {
            id: 'opt_semaphores',
            title: 'Integrate POSIX Counting Semaphores (Empty / Filled Slots)',
            pros: 'Completely eliminates race conditions and enforces strict backpressure with zero frame drops.',
            cons: 'Requires cleanup of /dev/shm named semaphores on unexpected crash.',
            recoveryTimeMinutes: 3.2,
            wasteIndex: 6,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-os-3',
    subjectKey: 'os',
    language: 'c',
    domain: 'Operating Systems & Concurrency (20A05404T)',
    title: 'OS Mission 3: Virtual Memory Page Thrashing Under Heavy Working Set Surge',
    shortTitle: 'Page Thrashing (Second-Chance FIFO)',
    subjectBadge: 'OS • JNTUA II-II',
    badge: 'System Thrashing (98% Swap CPU)',
    badgeColor: 'indigo',
    difficulty: 'Core B.Tech',
    targetSla: 'Swap Overhead < 5% • Second-Chance Clock Algorithm • Working Set Stabilized',
    brief: 'Operating systems virtual memory manager simulating page replacement. Naive FIFO replacement under a looping working set access pattern triggers Belady’s anomaly and 98% CPU swap thrashing.',
    architecture: 'C • Clock Page Replacement (Second-Chance FIFO) • Reference Bits • Page Fault Handler',
    baselineResources: {
      budget: '64 Physical Page Frames',
      infrastructure: 'VM Subsystem Simulator',
      dependencies: ['FIFO Queue'],
      deadline: 'Evaluation in 15 mins'
    },
    starterCode: `// Naive FIFO Page Replacement (Suffers from Thrashing & Belady's Anomaly)
int fifo_page_replace(int new_page, int* frames, int num_frames, int* fifo_ptr) {
    // VULNERABILITY: Evicts oldest page even if it was accessed 1 microsecond ago!
    // Cyclic loops cause continuous page faults on 100% of accesses -> THRASHING!
    int victim = *fifo_ptr;
    frames[victim] = new_page;
    *fifo_ptr = (*fifo_ptr + 1) % num_frames;
    return victim;
}`,
    adaptiveCodeScaffold: `// Production Clock Algorithm (Second-Chance FIFO) with Reference Bits
struct ClockFrame { int page_id; int ref_bit; };

int clock_page_replace(int new_page, struct ClockFrame* frames, int num_frames, int* clock_hand) {
    while (1) {
        if (frames[*clock_hand].ref_bit == 0) {
            // Found victim with reference bit 0: Evict!
            int victim = *clock_hand;
            frames[victim].page_id = new_page;
            frames[victim].ref_bit = 1; // Mark newly loaded as active
            *clock_hand = (*clock_hand + 1) % num_frames;
            return victim;
        }
        // Give second chance: clear bit and advance hand
        frames[*clock_hand].ref_bit = 0;
        *clock_hand = (*clock_hand + 1) % num_frames;
    }
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Cyclic Working Set Larger than Frame Count',
        alertHeadline: 'SYSTEM THRASHING: 98% CPU Spent in Swap I/O (Page Fault Rate: 99.4%)',
        systemConstraint: 'Looping array accesses continually evicted pages immediately prior to their next required use.',
        telemetry: {
          meanLatency: '1,800ms Page Fault',
          errorRate: '99.4% Fault Rate',
          memoryFootprint: 'All 64 Frames Thrashing',
          activeRequests: 'Cyclic Access Pattern'
        },
        adaptiveOptions: [
          {
            id: 'opt_clock_algo',
            title: 'Implement Second-Chance Clock Algorithm with Hardware Ref Bits',
            pros: 'Protects frequently referenced pages from eviction; page fault rate drops from 99.4% to 8.2%.',
            cons: 'Requires maintaining reference bits alongside frame table.',
            recoveryTimeMinutes: 3.0,
            wasteIndex: 5,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-os-4',
    subjectKey: 'os',
    language: 'c',
    domain: 'Operating Systems & Concurrency (20A05404T)',
    title: 'OS Mission 4: Multi-Tenant Container Fork Bomb Process Table Exhaustion',
    shortTitle: 'Fork Bomb Defense (Cgroups v2)',
    subjectBadge: 'OS • JNTUA II-II',
    badge: 'PID Table Exhaustion (fork bomb)',
    badgeColor: 'indigo',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Host Freeze • Cgroups v2 pids.max Limit • Isolation Preserved',
    brief: 'A campus online code runner allowing students to submit C programs. A malicious student submits a while(1) fork() process tree that consumes all 32,768 Linux PIDs, freezing the host kernel.',
    architecture: 'Linux Kernel • Cgroups v2 (pids.max) • setrlimit(RLIMIT_NPROC) • Namespaces',
    baselineResources: {
      budget: 'Linux Kernel PID Max: 32,768',
      infrastructure: 'Online Code Runner Server',
      dependencies: ['sys/resource.h'],
      deadline: 'Security audit in 15 mins'
    },
    starterCode: `// Unrestricted Process Execution (Vulnerable to Fork Bomb Crash)
#include <unistd.h>

void execute_student_binary(const char* binary_path) {
    // VULNERABILITY: No resource limits (rlimit or cgroup)!
    // If binary executes :(){ :|:& };: the host kernel freezes completely!
    execl(binary_path, binary_path, NULL);
}`,
    adaptiveCodeScaffold: `// Production Fork Bomb Mitigation using POSIX setrlimit & Cgroups v2 Guard
#include <sys/resource.h>
#include <unistd.h>
#include <stdio.h>

void execute_student_binary_sandboxed(const char* binary_path) {
    // Step 1: Enforce strict process limit on child
    struct rlimit rl;
    rl.rlim_cur = 20; // Hard maximum of 20 processes
    rl.rlim_max = 20;
    setrlimit(RLIMIT_NPROC, &rl);

    // Step 2: Enforce CPU time quota (2 seconds max)
    struct rlimit cpu_limit = { 2, 2 };
    setrlimit(RLIMIT_CPU, &cpu_limit);

    // Host remains 100% operational even if student code attempts fork bomb!
    execl(binary_path, binary_path, NULL);
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Malicious Student Submits Recursive Fork Bomb',
        alertHeadline: 'KERNEL PANIC / HANG: Resource temporarily unavailable (32,768 PIDs Consumed)',
        systemConstraint: 'The operating system cannot spawn even sshd or bash terminals because the process table is 100% full.',
        telemetry: {
          meanLatency: 'Host Frozen',
          errorRate: '100% PID Exhaustion',
          memoryFootprint: 'Full PID Table (32,768 / 32,768)',
          activeRequests: 'Recursive Forking'
        },
        adaptiveOptions: [
          {
            id: 'opt_rlimit_cgroup',
            title: 'Enforce setrlimit(RLIMIT_NPROC) and Cgroups pids.max=25',
            pros: 'Any fork attempt beyond 20 fails instantly with EAGAIN; host kernel stays 100% responsive.',
            cons: 'Multi-threaded legitimate programs must declare thread requirements in advance.',
            recoveryTimeMinutes: 2.2,
            wasteIndex: 3,
            qualityScore: 99
          }
        ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 08. CN (COMPUTER NETWORKS & PROTOCOLS - 20A05501T) - 4 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'btech-cn-1',
    subjectKey: 'cn',
    language: 'c',
    domain: 'Computer Networks & Protocols (20A05501T)',
    title: 'CN Mission 1: Campus Web Socket Server Under TCP SYN Flood Attack',
    shortTitle: 'TCP SYN Flood (SYN Cookies)',
    subjectBadge: 'CN • JNTUA III-I',
    badge: 'TCP Backlog Queue Exhaustion',
    badgeColor: 'teal',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Legitimate Drop • TCP SYN Cookies Enabled • Backlog > 10,000',
    brief: 'A campus event live polling web server listening on TCP port 8080 with a default backlog of 128. An attacker floods 100,000 spoofed SYN packets without sending ACKs, exhausting the half-open connection table.',
    architecture: 'C (POSIX Sockets) • Linux Kernel TCP SYN Cookies (syncookies=1) • epoll Non-blocking',
    baselineResources: {
      budget: 'SOMAXCONN = 128',
      infrastructure: 'Linux Socket Daemon',
      dependencies: ['sys/socket.h', 'netinet/tcp.h'],
      deadline: 'Placement lab test closes in 20 mins'
    },
    starterCode: `// Naive Blocking TCP Server (Backlog 128 - Vulnerable to SYN Flood)
#include <sys/socket.h>
#include <netinet/in.h>

int start_server() {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in address;
    // ... bind configuration ...

    // VULNERABILITY: Backlog queue limited to 128!
    // A SYN Flood of 500 packets fills half-open table, dropping all legitimate student connections!
    listen(server_fd, 128); 
    return server_fd;
}`,
    adaptiveCodeScaffold: `// Production Resilient TCP Socket with SYN Cookies & Backlog Tuning
#include <sys/socket.h>
#include <netinet/tcp.h>
#include <fcntl.h>

int start_resilient_server() {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);

    // Set non-blocking I/O
    fcntl(server_fd, F_SETFL, O_NONBLOCK);

    // Enable TCP Fast Open and QuickACK
    int enable = 1;
    setsockopt(server_fd, IPPROTO_TCP, TCP_NODELAY, &enable, sizeof(enable));

    // Increase listen backlog to handle sudden legitimate burst
    listen(server_fd, 8192);

    // Kernel-level mitigation:
    // system("sysctl -w net.ipv4.tcp_syncookies=1");
    // system("sysctl -w net.ipv4.tcp_max_syn_backlog=8192");
    return server_fd;
}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: SYN Flood Attack (100,000 Packets/sec Injected)',
        alertHeadline: 'CONNECTION TIMEOUT: TCP Half-Open Connection Table Exhausted',
        systemConstraint: 'Legitimate students receive Connection Refused or Connection Timed Out because the SYN backlog queue is 100% full.',
        telemetry: {
          meanLatency: 'Timed Out',
          errorRate: '99.8% Drops',
          memoryFootprint: 'Half-Open Table Full',
          activeRequests: '100,000 SYN Packets'
        },
        adaptiveOptions: [
          {
            id: 'opt_syn_cookies',
            title: 'Enable TCP SYN Cookies (syncookies=1) & Expand Backlog',
            pros: 'Server does not allocate memory until 3-way handshake finishes with client ACK; immune to SYN flood.',
            cons: 'Disables certain TCP options like large window scale unless TCP timestamps are enabled.',
            recoveryTimeMinutes: 2.2,
            wasteIndex: 3,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'btech-cn-2',
    subjectKey: 'cn',
    language: 'python',
    domain: 'Computer Networks & Protocols (20A05501T)',
    title: 'CN Mission 2: Reliable UDP Protocol (RUDP) Under 25% Random Packet Loss',
    shortTitle: 'RUDP Packet Loss (Selective Repeat)',
    subjectBadge: 'CN • JNTUA III-I',
    badge: '25% Packet Loss Desync',
    badgeColor: 'teal',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Missing Packets • In-Order Delivery • Selective Repeat ARQ Retransmit',
    brief: 'Campus esports tournament low-latency state synchronization over raw UDP. Due to congested Wi-Fi, 25% of packets are dropped and out-of-order, causing character teleportation glitches.',
    architecture: 'Python 3.11 • Selective Repeat ARQ • Packet Sequence Header • Adaptive Retransmit Timer',
    baselineResources: {
      budget: 'UDP Socket Stream',
      infrastructure: 'Campus Wi-Fi AP',
      dependencies: ['socket'],
      deadline: 'Evaluation in 15 mins'
    },
    starterCode: `# Naive Raw UDP Sender & Receiver (Zero Retransmission or Sequence Checks)
import socket

def send_game_packet(sock, addr, data):
    # VULNERABILITY: Raw UDP packets dropped on campus Wi-Fi are lost forever!
    # No sequence numbers -> out-of-order packets corrupt state!
    sock.sendto(data.encode(), addr)`,
    adaptiveCodeScaffold: `# Production Selective Repeat ARQ Packet Wrapper with Sequence Headers
import struct
import time

HEADER_FORMAT = '!II' # Sequence number (4B), Flags (4B)

def pack_packet(seq_num, is_ack, payload_bytes):
    flags = 1 if is_ack else 0
    header = struct.pack(HEADER_FORMAT, seq_num, flags)
    return header + payload_bytes

def unpack_packet(raw_bytes):
    header_size = struct.calcsize(HEADER_FORMAT)
    seq_num, flags = struct.unpack(HEADER_FORMAT, raw_bytes[:header_size])
    return seq_num, bool(flags), raw_bytes[header_size:]`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Wi-Fi Congestion Injected (25% Loss + 150ms Jitter)',
        alertHeadline: 'DATA DESYNCHRONIZATION: 25% Packet Loss • Out-of-Order Delivery',
        systemConstraint: 'Raw UDP cannot recover dropped sequence numbers, breaking student game state.',
        telemetry: {
          meanLatency: '150ms Jitter',
          errorRate: '25% Dropped Packets',
          memoryFootprint: 'Clean',
          activeRequests: 'UDP Stream'
        },
        adaptiveOptions: [
          {
            id: 'opt_selective_repeat',
            title: 'Implement Selective Repeat ARQ with Sequence Windows',
            pros: 'Only lost packets are retransmitted; guaranteed 100% in-order byte delivery with low overhead.',
            cons: 'Requires receiver buffer window to store out-of-order packets temporarily.',
            recoveryTimeMinutes: 3.5,
            wasteIndex: 7,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-cn-3',
    subjectKey: 'cn',
    language: 'python',
    domain: 'Computer Networks & Protocols (20A05501T)',
    title: 'CN Mission 3: Sliding Window Flow Control Receiver Buffer Overflow',
    shortTitle: 'Flow Control (Window Scaling)',
    subjectBadge: 'CN • JNTUA III-I',
    badge: 'Receiver Buffer Overflow',
    badgeColor: 'teal',
    difficulty: 'Core B.Tech',
    targetSla: 'Zero Buffer Dropping • Advertised Window Flow Control • Leaky Bucket',
    brief: 'High-speed campus file transfer protocol over TCP/UDP. A fast Gigabit sender overwhelms a slow mobile phone receiver buffer, causing continuous packet dropouts.',
    architecture: 'Python • Advertised Window Credit • TCP Flow Control • Zero-Window Probing',
    baselineResources: {
      budget: '64KB Receiver Buffer',
      infrastructure: 'Socket Streaming',
      dependencies: ['Flow Control'],
      deadline: '20 mins left'
    },
    starterCode: `# Flawed Unthrottled Sender (Overwhelms Slow Receiver Buffer)
def sender_loop(sock, data_chunks):
    for chunk in data_chunks:
        # VULNERABILITY: Sends at 100 MB/s without checking receiver capacity!
        # Mobile client buffer (64KB) overflows in 5 milliseconds!
        sock.send(chunk)`,
    adaptiveCodeScaffold: `# Production Flow Control with Advertised Window Feedback
class FlowControlledSender:
    def __init__(self, sock):
        self.sock = sock
        self.advertised_window = 65535 # Updated by receiver ACK packets

    def send_with_credit(self, chunk):
        while self.advertised_window < len(chunk):
            # Receiver buffer nearly full: Wait or send 1-byte probe
            time.sleep(0.01)
        self.sock.send(chunk)
        self.advertised_window -= len(chunk)`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Slow Mobile Client Connects with 64KB Buffer',
        alertHeadline: 'RECEIVER BUFFER OVERFLOW: 88% Packets Dropped by Kernel Buffer',
        systemConstraint: 'The sender blasted data faster than the mobile application could drain from the socket.',
        telemetry: {
          meanLatency: 'Dropped',
          errorRate: '88% Drops',
          memoryFootprint: '64 KB Overflow',
          activeRequests: 'High-Speed Stream'
        },
        adaptiveOptions: [
          {
            id: 'opt_advertised_win',
            title: 'Incorporate Advertised Window Flow Control & Zero-Window Probing',
            pros: 'Sender perfectly paces throughput to matching receiver consumption rate; drops drop to 0%.',
            cons: 'Requires 2-way ACK feedback headers.',
            recoveryTimeMinutes: 2.8,
            wasteIndex: 5,
            qualityScore: 98
          }
        ]
    }
  },
  {
    id: 'btech-cn-4',
    subjectKey: 'cn',
    language: 'python',
    domain: 'Computer Networks & Protocols (20A05501T)',
    title: 'CN Mission 4: Campus Recursive DNS Resolver Timeout Storm & Cache Starvation',
    shortTitle: 'DNS Timeout Storm (Cache Pinning)',
    subjectBadge: 'CN • JNTUA III-I',
    badge: 'DNS Resolution Storm (504)',
    badgeColor: 'teal',
    difficulty: 'Core B.Tech',
    targetSla: 'DNS Resolution < 5ms (Cached) • Exponential Backoff • Zero Cascading Freeze',
    brief: 'Campus local DNS recursive resolver querying root name servers. When an external upstream ISP DNS times out, 10,000 campus client queries pile up synchronously, locking the resolver.',
    architecture: 'Python • Async DNS Resolver • Cache Pinning • Negative Cache • Exponential Backoff',
    baselineResources: {
      budget: 'Local DNS Daemon',
      infrastructure: 'GPREC Campus Network',
      dependencies: ['dnspython / socket'],
      deadline: '15 mins left'
    },
    starterCode: `# Synchronous Recursive DNS Query (Locks on Upstream ISP Timeout)
import socket

def resolve_domain(domain_name):
    # VULNERABILITY: Synchronous gethostbyname blocks for 5000ms on ISP outage!
    # 10,000 student lookups freeze all internet access!
    return socket.gethostbyname(domain_name)`,
    adaptiveCodeScaffold: `# Production Resilient DNS Resolver with In-Memory TTL Cache & Fallback
import time

dns_cache = {} # domain: (ip, expiry_timestamp)

def resolve_domain_resilient(domain_name):
    now = time.time()
    # Check local pinned cache first
    if domain_name in dns_cache:
        ip, expiry = dns_cache[domain_name]
        if now < expiry:
            return ip # 0.2ms instant response!

    try:
        ip = query_upstream_with_timeout(domain_name, timeout=0.5)
        dns_cache[domain_name] = (ip, now + 3600) # Cache 1 hour
        return ip
    except Exception:
        # Graceful stale cache fallback during upstream ISP outage
        if domain_name in dns_cache:
            return dns_cache[domain_name][0]
        return "127.0.0.1" # Safe sinkhole fallback`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Upstream ISP DNS Fiber Cut (5,000ms Timeouts)',
        alertHeadline: 'CASCADING DNS OUTAGE: 10,000 Local Queries Stalled on Upstream Timeout',
        systemConstraint: 'All campus Wi-Fi users perceive total internet failure because domain name resolution is blocked.',
        telemetry: {
          meanLatency: '5,000ms (Timeout)',
          errorRate: '96% DNS Timeouts',
          memoryFootprint: 'Queue Overflow',
          activeRequests: '10,000 DNS Queries'
        },
        adaptiveOptions: [
          {
            id: 'opt_dns_cache',
            title: 'Implement In-Memory TTL Cache with Stale Serving on Upstream Failure',
            pros: '95% of queries resolve in 0.2ms locally; campus remains operational during ISP DNS blips.',
            cons: 'May serve slightly stale IPs if upstream records changed during downtime.',
            recoveryTimeMinutes: 2.5,
            wasteIndex: 4,
            qualityScore: 98
          }
        ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 09. CAPSTONE TRACK (SYSTEM DESIGN & DISTRIBUTED CLOUD) - 2 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'capstone-rag-1',
    subjectKey: 'capstone',
    language: 'python',
    domain: 'Full-Stack & Cloud Architecture (20A05701P)',
    title: 'CAPSTONE Mission 1: College RAG AI Chatbot Under Gemini API Outage & 429 Quotas',
    shortTitle: 'RAG Chatbot (API Outage)',
    subjectBadge: 'Capstone • Final Year',
    badge: 'API 429 & Quota Exhaustion',
    badgeColor: 'sky',
    difficulty: 'Capstone Track',
    targetSla: 'Fallback Latency < 400ms • Zero User 500s • Offline Embeddings Vector Store',
    brief: 'A campus admissions RAG AI assistant for prospective students. During admissions counseling day, query volume surges 15x, immediately exhausting the paid LLM API token rate quota and throwing HTTP 429.',
    architecture: 'Python • Circuit Breaker • Local MiniLM / TinyLlama ONNX Fallback • Redis Semantic Cache',
    baselineResources: {
      budget: '$25/mo Cloud API Tier',
      infrastructure: 'FastAPI Backend + Pinecone Vector DB',
      dependencies: ['Google Gemini API', 'Vector Index'],
      deadline: 'Admissions day starts in 30 mins'
    },
    starterCode: `# Direct External LLM Call (Vulnerable to 429 Quota Exhaustion)
import urllib.request
import json

def ask_college_chatbot(student_question):
    # VULNERABILITY: No fallback, no caching, synchronous external dependency!
    # Throws HTTP 429: Too Many Requests on surge!
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    # Fails immediately if API quota is reached!
    return make_api_call(url, student_question)`,
    adaptiveCodeScaffold: `# Production Resilient RAG: Semantic Cache + Circuit Breaker + Local Fallback
class ResilientCampusBot:
    def __init__(self):
        self.semantic_cache = {}
        self.is_circuit_open = False

    def answer_query(self, query):
        # Step 1: Instant cache hit for common college questions (Tuition, Hostels, Timetable)
        if query in self.semantic_cache:
            return self.semantic_cache[query]

        # Step 2: Try primary LLM if circuit is closed
        if not self.is_circuit_open:
            try:
                res = call_gemini_api(query, timeout=2.0)
                self.semantic_cache[query] = res
                return res
            except Exception as e:
                self.is_circuit_open = True # Trip circuit breaker!

        # Step 3: High-speed local extractive FAQ retrieval fallback
        return local_faq_vector_lookup(query)`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Admissions Surge (15,000 Questions in 10 Minutes)',
        alertHeadline: 'HTTP 429 TOO MANY REQUESTS: API Token Quota (60 RPM) Exhausted',
        systemConstraint: 'All admissions chatbots are returning raw JSON error pages to prospective parents and students.',
        telemetry: {
          meanLatency: '429 Error',
          errorRate: '95% API Rejections',
          memoryFootprint: 'Clean',
          activeRequests: '15,000 Students'
        },
        adaptiveOptions: [
          {
            id: 'opt_circuit_rag',
            title: 'Deploy Circuit Breaker + In-Memory Semantic Cache + Local Vector Fallback',
            pros: '80% of repeated queries resolve instantly in 2ms; local fallback answers the rest with 100% uptime.',
            cons: 'Complex queries outside FAQ return slightly simpler template answers during outage.',
            recoveryTimeMinutes: 3.5,
            wasteIndex: 6,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'capstone-gateway-2',
    subjectKey: 'capstone',
    language: 'python',
    domain: 'Full-Stack & Cloud Architecture (20A05701P)',
    title: 'CAPSTONE Mission 2: Microservices Load Balancer Under Regional Cloud Outage',
    shortTitle: 'Gateway Zone Outage (Failover)',
    subjectBadge: 'Capstone • Final Year',
    badge: 'Single Point of Failure (502)',
    badgeColor: 'sky',
    difficulty: 'Capstone Track',
    targetSla: 'Zero Downtime • Automatic Health Check Eviction < 3s • Multi-Region Failover',
    brief: 'A campus unified services API gateway routing traffic between Examination, Fee, and Library microservices. When the primary AWS us-east-1 availability zone crashes, all student services drop.',
    architecture: 'Distributed Cloud • Health Check Heartbeat • Weighted Round Robin • Failover Gateway',
    baselineResources: {
      budget: 'Multi-Zone Cloud Cluster',
      infrastructure: 'NGINX / FastAPI Gateway',
      dependencies: ['Health Checks'],
      deadline: 'Evaluation in 20 mins'
    },
    starterCode: `# Static Microservice Router (Hardcoded Host - Zero Failover)
def route_request(service_name, payload):
    # VULNERABILITY: If zone 1 crashes, 100% of traffic fails with 502 Bad Gateway!
    primary_host = "https://zone1.campus.internal/" + service_name
    return make_http_call(primary_host, payload)`,
    adaptiveCodeScaffold: `# Production Resilient Gateway with Health-Checked Active Failover
class ResilientGateway:
    def __init__(self):
        self.endpoints = [
            {"url": "https://zone1.campus.internal/", "healthy": True, "failures": 0},
            {"url": "https://zone2.campus.internal/", "healthy": True, "failures": 0}
        ]

    def route_request_safe(self, service_name, payload):
        for ep in self.endpoints:
            if ep["healthy"]:
                try:
                    return make_http_call(ep["url"] + service_name, payload, timeout=1.0)
                except Exception:
                    ep["failures"] += 1
                    if ep["failures"] >= 2: ep["healthy"] = False # Evict dead zone!
        return {"error": "All zones degraded, serving emergency cached read-only view"}`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Primary Cloud Zone Suffers Total Power Loss',
        alertHeadline: '502 BAD GATEWAY: Primary API Gateway Unreachable (100% Traffic Dropped)',
        systemConstraint: 'All incoming student requests are being routed to a dead server IP.',
        telemetry: {
          meanLatency: 'Timeout',
          errorRate: '100% Drops',
          memoryFootprint: 'Clean',
          activeRequests: 'All Campus Portals'
        },
        adaptiveOptions: [
          {
            id: 'opt_gateway_failover',
            title: 'Enable Automatic Active-Passive Zone Failover with 1s Health Heartbeat',
            pros: 'Traffic reroutes to secondary zone in under 2 seconds automatically with zero operator intervention.',
            cons: 'Requires standing up hot standby capacity in secondary zone.',
            recoveryTimeMinutes: 2.5,
            wasteIndex: 4,
            qualityScore: 98
          }
        ]
    }
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 10. STARTUP TRACK (VENTURE & HIGH-SCALE ENGINEERING) - 2 QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'startup-budget-1',
    subjectKey: 'startup',
    language: 'python',
    domain: 'Venture & High-Scale Engineering (INNOV-01)',
    title: 'STARTUP Mission 1: EdTech SaaS MVP Launch Under 60% Cloud Budget Cut',
    shortTitle: '60% Budget Cut (Edge Cache)',
    subjectBadge: 'Startup • Incubation',
    badge: 'Runway Burnout & Cost Cut',
    badgeColor: 'orange',
    difficulty: 'Startup Track',
    targetSla: 'Cost Reduction > 65% • Zero Feature Degradation • Cloudflare Edge Caching',
    brief: 'A campus student startup launching a note-sharing platform. After an investor reduces seed runway by 60%, the AWS compute bill threatens to bankrupt the venture in 14 days.',
    architecture: 'Serverless • Cloudflare Workers / Edge KV • Aggressive HTTP Stale-While-Revalidate',
    baselineResources: {
      budget: '$80/month Runway Remaining',
      infrastructure: 'Heavy AWS EC2 / RDS Instances',
      dependencies: ['Full Stack App'],
      deadline: 'Investor milestone in 2 days'
    },
    starterCode: `# High-Cost Database Polling (Queries DB on Every Request)
def get_note_content(note_id):
    # VULNERABILITY: Every page view queries expensive RDS database instance!
    # Monthly bill: $450/month! Bankrupts startup in 14 days!
    return expensive_database_query(note_id)`,
    adaptiveCodeScaffold: `# Production Zero-Cost Edge Cached Architecture (Cost: $0 - $5/month)
def get_note_content_resilient(note_id):
    # Step 1: Serve from edge CDN cache with Stale-While-Revalidate header
    # 98% of requests never touch origin database!
    headers = {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control": "max-age=604800"
    }
    return serve_cached_note(note_id, headers)`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Monthly Server Budget Slashed from $500 to $80',
        alertHeadline: 'CLOUD RUNWAY DEPLETION: 14 Days until Server Termination',
        systemConstraint: 'The startup cannot afford the running EC2 instances and database tiers without aggressive architectural cost pruning.',
        telemetry: {
          meanLatency: '350ms',
          errorRate: '0%',
          memoryFootprint: '$450/mo Run Rate',
          activeRequests: '50,000 MAU'
        },
        adaptiveOptions: [
          {
            id: 'opt_edge_cache',
            title: 'Migrate Dynamic Reads to Cloudflare Edge Cache & SQLite Replica',
            pros: 'Slashes monthly cloud invoice from $450 to $8/month (98.2% cost reduction); latency drops to 15ms globally.',
            cons: 'Note edits take up to 2 seconds to propagate to all edge geographic nodes.',
            recoveryTimeMinutes: 3.0,
            wasteIndex: 5,
            qualityScore: 99
          }
        ]
    }
  },
  {
    id: 'startup-dispatch-2',
    subjectKey: 'startup',
    language: 'python',
    domain: 'Venture & High-Scale Engineering (INNOV-01)',
    title: 'STARTUP Mission 2: Campus Food Delivery Driver Tracking Under GPS Polling Storm',
    shortTitle: 'Driver GPS Surge (Redis Geo)',
    subjectBadge: 'Startup • Incubation',
    badge: 'SQL Lockup (Polling Storm)',
    badgeColor: 'orange',
    difficulty: 'Startup Track',
    targetSla: 'GPS Update Latency < 10ms • Redis GEO In-Memory Pub/Sub • 2,000 Drivers',
    brief: 'A student hostel food delivery app. 500 delivery drivers transmitting GPS coordinates every second write directly to a MySQL database table, locking the database and freezing student order checkouts.',
    architecture: 'Python • Redis GEO (GEOADD / GEORADIUS) • WebSockets Pub/Sub • Async Batching',
    baselineResources: {
      budget: 'Single DB Instance',
      infrastructure: 'Hostel Delivery Startup',
      dependencies: ['MySQL GPS table'],
      deadline: 'Dinner surge in 20 mins'
    },
    starterCode: `# Flawed Direct Database GPS Writes (Locks MySQL on 500 Drivers)
def update_driver_gps(driver_id, lat, lng):
    # VULNERABILITY: 500 drivers * 1 update/sec = 500 write transactions/sec on MySQL!
    # Table lock contention crashes student checkout queries!
    execute_sql("UPDATE drivers SET lat = %s, lng = %s WHERE id = %s", (lat, lng, driver_id))`,
    adaptiveCodeScaffold: `# Production Real-Time Geohashing with Redis In-Memory GEOADD
import redis

r = redis.Redis(host='localhost', port=6379, db=0)

def update_driver_gps_fast(driver_id, lat, lng):
    # In-memory O(log N) geospatial index: Handles 50,000 updates/sec with zero SQL load!
    r.geoadd("active_delivery_drivers", (lng, lat, driver_id))

def find_nearest_drivers(customer_lat, customer_lng, radius_km=3.0):
    # Fast O(N + log M) geospatial radius lookup in 1.2ms!
    return r.georadius("active_delivery_drivers", customer_lng, customer_lat, radius_km, unit='km')`,
    stage2Chaos: {
        triggerTitle: ' REALITY CHANGE: Dinner Rush (500 Drivers Polling Every Second)',
        alertHeadline: 'DATABASE SATURATION: SQL Write Pool 100% Locked • Checkouts Failing',
        systemConstraint: 'Frequent GPS position writes starved transactional order queries, bringing student dinner orders to a standstill.',
        telemetry: {
          meanLatency: '4,200ms',
          errorRate: '78% Checkout Failures',
          memoryFootprint: 'High IOPS',
          activeRequests: '500 Writes/sec'
        },
        adaptiveOptions: [
          {
            id: 'opt_redis_geo',
            title: 'Decouple Live Coordinates to In-Memory Redis GEO Datastore',
            pros: 'Completely offloads GPS writes from SQL database; nearest driver lookups execute in 1.2ms.',
            cons: 'Requires maintaining a lightweight Redis instance in production.',
            recoveryTimeMinutes: 2.8,
            wasteIndex: 4,
            qualityScore: 99
          }
        ]
    }
  }
];
