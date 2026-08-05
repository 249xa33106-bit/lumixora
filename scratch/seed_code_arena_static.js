import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';
const supabase = createClient(supabaseUrl, supabaseKey);

const customProblems = [
  {
    id: 'avl-tree-operations',
    title: 'AVL Tree Balances & Rotations',
    difficulty: 'Hard',
    category: 'Trees',
    acceptanceRate: '42.5%',
    statement: `Implement AVL Tree insertion. An AVL tree is a self-balancing Binary Search Tree (BST) where the height difference between left and right subtrees is at most 1 for all nodes.

Write a function to insert a list of elements into an empty AVL tree and return the **preorder traversal** of the final balanced tree.`,
    inputFormat: 'An array of unique integers to insert sequentially.',
    outputFormat: 'An array of integers representing the preorder traversal of the balanced AVL tree.',
    constraints: [
      '1 <= keys.length <= 1000',
      '-10^5 <= keys[i] <= 10^5'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    functionName: 'avlInsert',
    examples: [
      {
        input: 'keys = [10, 20, 30, 40, 50, 25]',
        output: '[30, 20, 10, 25, 40, 50]',
        explanation: 'After sequential inserts and rotations (such as double rotations for 25), the preorder traversal is [30, 20, 10, 25, 40, 50].'
      }
    ],
    testCases: [
      { input: '[10,20,30,40,50,25]', output: '[30,20,10,25,40,50]' },
      { input: '[1,2,3]', output: '[2,1,3]' }
    ],
    hiddenTestCases: [
      { input: '[50,40,30,20,10]', output: '[40,20,10,30,50]' }
    ],
    hints: [
      'Compute the balance factor: height(left) - height(right). If it is outside [-1, 1], perform rotations.',
      'Rotations include Left-Left (Single Right), Right-Right (Single Left), Left-Right, and Right-Left.'
    ],
    editorial: `AVL Tree maintains a balance factor of O(log N) heights via LL, RR, LR, and RL rotations. Preorder traversal visits: Root -> Left -> Right.`,
    starterTemplates: {
      javascript: `function avlInsert(keys) {
    // Write your code here
    
}`,
      python: `def avl_insert(keys: list[int]) -> list[int]:
    # Write your code here
    pass`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<int> avlInsert(std::vector<int>& keys) {
        // Write your code here
        
    }
};`
    }
  },
  {
    id: 'graph-bfs-dfs',
    title: 'Graph BFS & DFS Traversals',
    difficulty: 'Medium',
    category: 'Graphs',
    acceptanceRate: '68.0%',
    statement: `Given a connected undirected graph with \`V\` vertices and \`E\` edges, and a source vertex \`src\`, return its Level Order (BFS) and Depth First (DFS) traversals.

If a vertex has multiple neighbors, visit them in sorted order.`,
    inputFormat: 'Number of vertices V, starting vertex src, and adjacency list representing connections.',
    outputFormat: 'An object with keys "bfs" and "dfs" mapped to arrays of visited node IDs.',
    constraints: [
      '1 <= V <= 500',
      '0 <= src < V'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    functionName: 'traverseGraph',
    examples: [
      {
        input: 'V = 5, src = 0, adjList = [[1,2,3], [0], [0,4], [0], [2]]',
        output: '{"bfs": [0,1,2,3,4], "dfs": [0,1,2,4,3]}',
        explanation: 'BFS visits level by level. DFS visits deep down branch 1, then backtracks to branch 2.'
      }
    ],
    testCases: [
      { input: '5\n0\n[[1,2,3],[0],[0,4],[0],[2]]', output: '{"bfs":[0,1,2,3,4],"dfs":[0,1,2,4,3]}' }
    ],
    hiddenTestCases: [
      { input: '3\n1\n[[1],[0,2],[1]]', output: '{"bfs":[1,0,2],"dfs":[1,0,2]}' }
    ],
    hints: [
      'Use a Queue for BFS and recursion/Stack for DFS.',
      'Keep track of visited nodes using a boolean array to avoid cycles.'
    ],
    editorial: `BFS traversal runs in O(V + E) time using a FIFO Queue. DFS traversal runs in O(V + E) time using recursion.`,
    starterTemplates: {
      javascript: `function traverseGraph(V, src, adjList) {
    // Write your code here
    return { bfs: [], dfs: [] };
}`,
      python: `def traverse_graph(V: int, src: int, adj_list: list[list[int]]) -> dict:
    # Write your code here
    return { "bfs": [], "dfs": [] }`
    }
  },
  {
    id: 'heap-sort-algorithm',
    title: 'Heap Sort Algorithm',
    difficulty: 'Medium',
    category: 'Heaps',
    acceptanceRate: '65.4%',
    statement: `Given an array of integers \`arr\`, sort it in ascending order using Heap Sort.

You must build a Max Heap first, then swap the root with the last element and heapify recursively.`,
    inputFormat: 'An unsorted array of integers `arr`.',
    outputFormat: 'The sorted array of integers.',
    constraints: [
      '1 <= arr.length <= 50000',
      '-10^5 <= arr[i] <= 10^5'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    functionName: 'heapSort',
    examples: [
      {
        input: 'arr = [4, 10, 3, 5, 1]',
        output: '[1, 3, 4, 5, 10]',
        explanation: 'Heap sort rearranges elements using binary heap representations.'
      }
    ],
    testCases: [
      { input: '[4,10,3,5,1]', output: '[1,3,4,5,10]' },
      { input: '[12,11,13,5,6,7]', output: '[5,6,7,11,12,13]' }
    ],
    hiddenTestCases: [
      { input: '[1,3,2,5,4]', output: '[1,2,3,4,5]' }
    ],
    hints: [
      'Build a max heap from the input data first.',
      'At this point, the largest item is stored at the root of the heap. Replace it with the last item of the heap, reduce the size of the heap by 1, and heapify the root.'
    ],
    editorial: `Heap Sort builds a binary heap in O(N) and sorts it in O(N log N) using Max-Heapify.`,
    starterTemplates: {
      javascript: `function heapSort(arr) {
    // Write your code here
    
}`,
      python: `def heap_sort(arr: list[int]) -> list[int]:
    # Write your code here
    pass`
    }
  },
  {
    id: 'zero-one-knapsack',
    title: '0/1 Knapsack Problem',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptanceRate: '55.2%',
    statement: `Given weights \`wt\` and values \`val\` of \`n\` items, put these items in a knapsack of capacity \`W\` to get the maximum total value in the knapsack.

You cannot break items; either include the item fully or do not include it.`,
    inputFormat: 'Weights array wt, values array val, capacity W, and number of items n.',
    outputFormat: 'Max profit (integer) possible.',
    constraints: [
      '1 <= n <= 1000',
      '1 <= W <= 1000',
      '1 <= wt[i], val[i] <= 1000'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    functionName: 'knapsack',
    examples: [
      {
        input: 'wt = [1, 2, 3], val = [10, 15, 40], W = 6, n = 3',
        output: '55',
        explanation: 'We select items index 1 and 2 (wt 2 and 3 -> total weight 5 <= 6) getting value 15 + 40 = 55.'
      }
    ],
    testCases: [
      { input: '[1,2,3]\n[10,15,40]\n6\n3', output: '55' }
    ],
    hiddenTestCases: [
      { input: '[1,1,1]\n[10,20,30]\n2\n3', output: '50' }
    ],
    hints: [
      'Define a 2D DP array where DP[i][w] is the maximum value using first i items and weight limit w.',
      'For each item, we choose: value of including it + DP[i-1][w - wt[i]], or DP[i-1][w].'
    ],
    editorial: `The 0/1 Knapsack is solved in O(n*W) using bottom-up dynamic programming.`,
    starterTemplates: {
      javascript: `function knapsack(wt, val, W, n) {
    // Write your code here
    
}`,
      python: `def knapsack(wt: list[int], val: list[int], W: int, n: int) -> int:
    # Write your code here
    pass`
    }
  },
  {
    id: 'quick-sort-algorithm',
    title: 'Quick Sort Algorithm',
    difficulty: 'Medium',
    category: 'Recursion',
    acceptanceRate: '71.2%',
    statement: `Given an array of integers \`arr\`, sort it in ascending order using the Quick Sort algorithm.

Use Lomuto partitioning (last element as pivot).`,
    inputFormat: 'An unsorted array of integers `arr`.',
    outputFormat: 'The sorted array of integers.',
    constraints: [
      '1 <= arr.length <= 50000',
      '-10^5 <= arr[i] <= 10^5'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    functionName: 'quickSort',
    examples: [
      {
        input: 'arr = [10, 7, 8, 9, 1, 5]',
        output: '[1, 5, 7, 8, 9, 10]',
        explanation: 'Quick sort partitions the array using the pivot element.'
      }
    ],
    testCases: [
      { input: '[10,7,8,9,1,5]', output: '[1,5,7,8,9,10]' },
      { input: '[3,2,1]', output: '[1,2,3]' }
    ],
    hiddenTestCases: [
      { input: '[5,4,3,2,1]', output: '[1,2,3,4,5]' }
    ],
    hints: [
      'Choose a pivot element and partition the elements around it.',
      'Lomuto partition places all elements smaller than pivot to its left and larger to its right.'
    ],
    editorial: `Quick Sort is O(N log N) average case using divide and conquer partitioning.`,
    starterTemplates: {
      javascript: `function quickSort(arr) {
    // Write your code here
    
}`,
      python: `def quick_sort(arr: list[int]) -> list[int]:
    # Write your code here
    pass`
    }
  }
];

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function seed() {
  console.log("Seeding pre-defined high-quality algorithm problems into Supabase...");
  for (const prob of customProblems) {
    const noteId = uuidv4();
    const noteData = {
      id: noteId,
      title: prob.title,
      type: 'code_arena_problem',
      problemCategory: prob.category,
      difficulty: prob.difficulty,
      acceptanceRate: prob.acceptanceRate,
      statement: prob.statement,
      inputFormat: prob.inputFormat,
      outputFormat: prob.outputFormat,
      constraints: prob.constraints,
      timeLimit: prob.timeLimit,
      memoryLimit: prob.memoryLimit,
      functionName: prob.functionName,
      examples: prob.examples,
      testCases: prob.testCases,
      hiddenTestCases: prob.hiddenTestCases,
      hints: prob.hints,
      editorial: prob.editorial,
      starterTemplates: prob.starterTemplates,
      companies: ['Google', 'Amazon', 'Microsoft', 'Custom'],
      frequency: 75,
      popularity: 80,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      contributedBy: 'Scholar System'
    };

    console.log(`Seeding problem: ${noteData.title}...`);
    const { error } = await supabase.from('notes').insert([{
      id: noteId,
      title: noteData.title,
      content: JSON.stringify(noteData),
      last_edited: new Date().toISOString()
    }]);

    if (error) {
      console.error(`  Failed to seed ${noteData.title}:`, error.message);
    } else {
      console.log(`  Successfully seeded ${noteData.title}!`);
    }
  }
  console.log("Static seeding completed!");
}

seed();
