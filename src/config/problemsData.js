// Database of Coding Problems for the Code Arena
export const PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptanceRate: '49.8%',
    category: 'Arrays',
    frequency: 95,
    popularity: 98,
    solved: false,
    companies: ['Google', 'Amazon', 'Apple', 'Meta'],
    statement: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
    inputFormat: 'An array of integers `nums` and an integer `target`.',
    outputFormat: 'An array of two indices representing the positions of the elements that sum to `target`.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].'
      }
    ],
    testCases: [
      { input: '[2,7,11,15]\n9', output: '[0,1]' },
      { input: '[3,2,4]\n6', output: '[1,2]' },
      { input: '[3,3]\n6', output: '[0,1]' }
    ],
    hiddenTestCases: [
      { input: '[1,5,8,12,3,6]\n14', output: '[2,5]' },
      { input: '[-1,-3,-5,-7]\n-8', output: '[0,3]' }
    ],
    hints: [
      'Try checking every pair of numbers. What is the time complexity?',
      'Can we use a hash map to look up the complement of each number in O(1) time?'
    ],
    videoUrl: 'https://www.youtube.com/embed/KLlXCFG5TnA',
    videoTitle: 'Two Sum - LeetCode 1 - Python & Hash Map Explained',
    channelName: 'NeetCode',
    duration: '11:42',
    videoKeyTakeaways: [
      'Brute force O(N^2) vs One-Pass Hash Map O(N)',
      'Instant complement lookup (target - num) in O(1)',
      'Index mapping without double-counting elements'
    ],
    editorial: `### Optimal O(N) Hash Map Solution

We can traverse the array once, maintaining a hash map of values seen so far and their index. For each number \`num\` at index \`i\`, we calculate its complement \`target - num\`. If the complement exists in our map, we have found our pair!

**Complexity Analysis**:
- **Time Complexity**: O(N) as we traverse the list containing N elements only once.
- **Space Complexity**: O(N) to store values in the hash map.`,
    starterTemplates: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your code here
    pass`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
      go: `func twoSum(nums []int, target int) []int {
    // Write your code here
    return nil
}`
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    acceptanceRate: '41.2%',
    category: 'Stacks',
    frequency: 90,
    popularity: 95,
    solved: false,
    companies: ['Meta', 'Microsoft', 'Amazon', 'Netflix'],
    statement: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: 'A string `s` containing brackets.',
    outputFormat: 'Boolean value true or false.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only: "()[]{}"'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Simple valid parenthesis matching.'
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Three different pairs of valid parentheses.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Type mismatch: ( closed by ].'
      }
    ],
    testCases: [
      { input: '"()"', output: 'true' },
      { input: '"()[]{}"', output: 'true' },
      { input: '"(]"', output: 'false' }
    ],
    hiddenTestCases: [
      { input: '"(([]){})"', output: 'true' },
      { input: '"(["', output: 'false' }
    ],
    hints: [
      'A Stack data structure is perfect for keeping track of open parentheses.',
      'Push open brackets onto the stack. For a closing bracket, check if it matches the top of the stack.'
    ],
    videoUrl: 'https://www.youtube.com/embed/WTzjTpmBsbQ',
    videoTitle: 'Valid Parentheses - LeetCode 20 - Python & Stack Visualizer',
    channelName: 'NeetCode',
    duration: '10:15',
    videoKeyTakeaways: [
      'LIFO Stack matching for bracket pairs',
      'Dictionary lookup mapping closing bracket to expected opener',
      'Edge case validation for odd string lengths and extra closing braces'
    ],
    editorial: `### Stack O(N) Solution

We iterate through the string character by character. If we see an opening bracket, we push it onto our stack. If we see a closing bracket, we check if the stack is empty or if the top of the stack matches the closing bracket. If so, pop it. Otherwise, return false.

At the end of the string, if the stack is empty, return true; else false.`,
    starterTemplates: {
      javascript: `function isValid(s) {
    // Write your code here
    
}`,
      python: `def is_valid(s: str) -> bool:
    # Write your code here
    pass`,
      cpp: `#include <string>
#include <stack>

class Solution {
public:
    bool isValid(std::string s) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`,
      go: `func isValid(s string) bool {
    // Write your code here
    return false
}`
    }
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    acceptanceRate: '73.5%',
    category: 'Linked Lists',
    frequency: 88,
    popularity: 92,
    solved: false,
    companies: ['Amazon', 'Microsoft', 'Adobe', 'Google'],
    statement: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    inputFormat: 'The head node of a Singly Linked List.',
    outputFormat: 'The head node of the reversed Singly Linked List.',
    constraints: [
      'The number of nodes in the list is in the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'Reversing lists preserves the original links in opposite direction.'
      }
    ],
    testCases: [
      { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: '[1,2]', output: '[2,1]' },
      { input: '[]', output: '[]' }
    ],
    hiddenTestCases: [
      { input: '[1,1,1]', output: '[1,1,1]' },
      { input: '[4]', output: '[4]' }
    ],
    hints: [
      'Can you do it iteratively by maintaining three pointers: prev, curr, and next?',
      'Can you think of a recursive approach?'
    ],
    videoUrl: 'https://www.youtube.com/embed/G0_I-ZF0S38',
    videoTitle: 'Reverse Linked List - LeetCode 206 - Iterative & Recursive',
    channelName: 'NeetCode',
    duration: '08:45',
    videoKeyTakeaways: [
      'Three-pointer pointer reversing: prev, curr, nextTemp',
      'O(N) single-pass traversal with O(1) auxiliary space',
      'Recursive call stack intuition and base cases'
    ],
    editorial: `### Iterative Solution

We maintain three pointers:
- \`prev\` initialized to \`null\`
- \`curr\` initialized to \`head\`
- \`nextTemp\` to store the next node during pointer swapping.

As we traverse, we point \`curr.next\` to \`prev\`, then shift \`prev\` and \`curr\` one step forward.`,
    starterTemplates: {
      javascript: `// Definition for singly-linked list:
// class ListNode {
//     constructor(val, next) {
//         this.val = (val===undefined ? 0 : val)
//         this.next = (next===undefined ? null : next)
//     }
// }

function reverseList(head) {
    // Write your code here
    
}`,
      python: `# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverse_list(head):
    # Write your code here
    pass`,
      cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your code here
        
    }
};`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        return null;
    }
}`,
      go: `type ListNode struct {
    Val  int
    Next *ListNode
}

func reverseList(head *ListNode) *ListNode {
    // Write your code here
    return nil
}`
    }
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    acceptanceRate: '54.1%',
    category: 'Two Pointers',
    frequency: 85,
    popularity: 97,
    solved: false,
    companies: ['Google', 'Meta', 'Microsoft', 'Goldman Sachs'],
    statement: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`-th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.`,
    inputFormat: 'An array of integers `height`.',
    outputFormat: 'Max water volume (integer).',
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'Max water container is formed between boundary index 1 and 8 (height 8 and 7, width 7 -> volume 7 * 7 = 49).'
      }
    ],
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: '[1,1]', output: '1' }
    ],
    hiddenTestCases: [
      { input: '[4,3,2,1,4]', output: '16' },
      { input: '[1,2,1]', output: '2' }
    ],
    hints: [
      'Try using two pointers at both ends of the array.',
      'Calculate the area, then move the pointer that points to the shorter line inward.'
    ],
    videoUrl: 'https://www.youtube.com/embed/UuiTKBwPgAo',
    videoTitle: 'Container with Most Water - LeetCode 11 - Two Pointer Strategy',
    channelName: 'NeetCode',
    duration: '12:18',
    videoKeyTakeaways: [
      'Two-pointer greedy boundary contraction',
      'Why shifting the taller wall can never increase area',
      'Optimal O(N) time and O(1) space complexity'
    ],
    editorial: `### Two Pointers O(N) Solution

We place one pointer at the start and one pointer at the end of the array. The area is bounded by the shorter line, and the width is the difference between the two pointers.

In order to maximize area, we should move the pointer that points to the shorter line, because keeping it would never yield a larger container since width is shrinking.`,
    starterTemplates: {
      javascript: `function maxArea(height) {
    // Write your code here
    
}`,
      python: `def max_area(height: list[int]) -> int:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxArea(std::vector<int>& height) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public int maxArea(int[] height) {
        // Write your code here
        return 0;
    }
}`,
      go: `func maxArea(height []int) int {
    // Write your code here
    return 0
}`
    }
  },
  {
    id: 'n-queens',
    title: 'N-Queens',
    difficulty: 'Hard',
    acceptanceRate: '65.2%',
    category: 'Backtracking',
    frequency: 72,
    popularity: 89,
    solved: false,
    companies: ['Google', 'Uber', 'Microsoft', 'Netflix'],
    statement: `The **n-queens** puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other.

Given an integer \`n\`, return *all distinct solutions to the **n-queens puzzle***.

Each solution contains a distinct board configuration of the n-queens' placement, where \`'Q'\` and \`'.'\` both indicate a queen and an empty space, respectively.`,
    inputFormat: 'An integer `n` specifying board size.',
    outputFormat: 'A list of lists of strings showing queen positions.',
    constraints: [
      '1 <= n <= 9'
    ],
    timeLimit: '1500ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'n = 4',
        output: '[[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]]',
        explanation: 'There are two distinct configurations of placing 4 queens on a 4x4 board.'
      }
    ],
    testCases: [
      { input: '4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { input: '1', output: '[["Q"]]' }
    ],
    hiddenTestCases: [
      { input: '2', output: '[]' }
    ],
    hints: [
      'Use backtracking row by row. For each row, try to place a queen in each column.',
      'Maintain boolean sets for columns, positive diagonals (r + c), and negative diagonals (r - c) to check safety in O(1).'
    ],
    videoUrl: 'https://www.youtube.com/embed/Ph95IHmTH5E',
    videoTitle: 'N-Queens - Backtracking & Diagonal Sets - LeetCode 51',
    channelName: 'NeetCode',
    duration: '19:35',
    videoKeyTakeaways: [
      'Row-by-row state space tree search',
      'O(1) safety checks with Column, (r+c) and (r-c) hash sets',
      'Formatting and collecting board configurations'
    ],
    editorial: `### Backtracking and Sets Solution

We solve this problem row-by-row. When placing a queen at \`(row, col)\`, it attacks:
1. Column \`col\`
2. Positive diagonal: \`row + col\`
3. Negative diagonal: \`row - col\`

By keeping track of occupied columns and diagonals in three hash sets, we can check if a square is safe in O(1). If safe, we place the queen and recurse. If backtracking, we remove it.`,
    starterTemplates: {
      javascript: `function solveNQueens(n) {
    // Write your code here
    
}`,
      python: `def solve_n_queens(n: int) -> list[list[str]]:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <string>

class Solution {
public:
    std::vector<std::vector<std::string>> solveNQueens(int n) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> solveNQueens(int n) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
      go: `func solveNQueens(n int) [][]string {
    // Write your code here
    return nil
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

int n, board[10];

int isSafe(int row, int col) {
    for (int i = 0; i < row; i++) {
        if (board[i] == col || abs(board[i] - col) == abs(i - row))
            return 0;
    }
    return 1;
}

int solve(int row) {
    if (row == n)
        return 1;  // one solution found

    for (int col = 0; col < n; col++) {
        if (isSafe(row, col)) {
            board[row] = col;
            if (solve(row + 1))
                return 1;  // stop after one valid solution
        }
    }
    return 0;
}

int main() {
    printf("Enter number of queens: ");
    scanf("%d", &n);

    if (solve(0)) {
        printf("\\nOne possible solution:\\n");
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i] == j)
                    printf("Q ");
                else
                    printf("- ");
            }
            printf("\\n");
        }
    } else {
        printf("No solution exists for %d queens.\\n", n);
    }

    return 0;
}`
    }
  },
  {
    id: 'dijkstras-algorithm',
    title: 'Dijkstra\'s Algorithm',
    difficulty: 'Hard',
    acceptanceRate: '58.3%',
    category: 'Graphs',
    frequency: 80,
    popularity: 91,
    solved: false,
    companies: ['Amazon', 'Google', 'Microsoft', 'Oracle'],
    statement: `Given a weighted connected graph represented as an adjacency matrix and a source vertex \`src\`, implement Dijkstra's algorithm to find the shortest distance from \`src\` to all other vertices.`,
    inputFormat: 'An adjacency matrix, number of vertices `n`, and source vertex `src`.',
    outputFormat: 'An array of shortest distances from `src` to each vertex.',
    constraints: [
      '1 <= n <= 100',
      '0 <= graph[i][j] <= 1000',
      '0 <= src < n'
    ],
    timeLimit: '1500ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'graph = [[0,4],[4,0]], n = 2, src = 0',
        output: '[0,4]',
        explanation: 'Distance from source vertex 0 to 0 is 0, and to 1 is 4.'
      }
    ],
    testCases: [
      { input: '[[0,4],[4,0]]\n2\n0', output: '[0,4]' },
      { input: '[[0,2,4],[2,0,1],[4,1,0]]\n3\n0', output: '[0,2,3]' }
    ],
    hiddenTestCases: [
      { input: '[[0,6,3],[6,0,1],[3,1,0]]\n3\n0', output: '[0,4,3]' }
    ],
    hints: [
      'Initialize all distances to infinity, except the source which is 0.',
      'Maintain unvisited vertices set and continuously select the one with the smallest distance.'
    ],
    videoUrl: 'https://www.youtube.com/embed/XB4MIexX00E',
    videoTitle: '3.6 Dijkstra Algorithm - Single Source Shortest Path',
    channelName: 'Abdul Bari',
    duration: '24:50',
    videoKeyTakeaways: [
      'Greedy selection of minimum distance vertex',
      'Edge relaxation formula: dist[v] = min(dist[v], dist[u] + cost[u][v])',
      'Adjacency matrix representation and tracing'
    ],
    editorial: `### Dijkstra's Shortest Path Algorithm
Dijkstra's algorithm finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights.
Using a min-priority queue (or a linear search for smaller graphs), we repeatedly extract the vertex with the minimum distance, visit all its neighbors, and perform edge relaxation:
\`dist[v] = min(dist[v], dist[u] + weight(u, v))\``,
    starterTemplates: {
      javascript: `function dijkstra(graph, n, src) {
    // Write your code here
    
}`,
      python: `def dijkstra(graph: list[list[int]], n: int, src: int) -> list[int]:
    # Write your code here
    pass`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<int> dijkstra(std::vector<std::vector<int>>& graph, int n, int src) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[] dijkstra(int[][] graph, int n, int src) {
        // Write your code here
        return new int[]{};
    }
}`,
      go: `func dijkstra(graph [][]int, n int, src int) []int {
    // Write your code here
    return nil
}`,
      c: `#include <stdio.h>
#include <limits.h>

#define INF INT_MAX
#define V 100 // Maximum number of vertices

// Function to find the vertex with minimum distance value
int minDistance(int dist[], int visited[], int n) {
    int min = INF, min_index;
    for (int v = 0; v < n; v++) {
        if (visited[v] == 0 && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

// Dijkstra's algorithm function
void dijkstra(int graph[V][V], int n, int src) {
    int dist[V]; // Output array to hold the shortest distance from src to each vertex
    int visited[V]; // visited[i] will be 1 if vertex i is included in shortest path tree

    // Initialize distances to INF and visited array to 0
    for (int i = 0; i < n; i++) {
        dist[i] = INF;
        visited[i] = 0;
    }

    // Distance of source vertex from itself is always 0
    dist[src] = 0;

    // Find the shortest path for all vertices
    for (int count = 0; count < n - 1; count++) {
        // Pick the minimum distance vertex from the set of vertices not yet processed
        int u = minDistance(dist, visited, n);

        // Mark the picked vertex as processed
        visited[u] = 1;

        // Update dist value of the adjacent vertices of the picked vertex
        for (int v = 0; v < n; v++) {
            // Update dist[v] only if there is an edge from u to v, and
            // the vertex v is not visited, and the total weight of the path
            // from src to v through u is smaller than the current value of dist[v]
            if (!visited[v] && graph[u][v] && dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    // Print the calculated shortest distances
    printf("Vertex\\tDistance from Source\\n");
    for (int i = 0; i < n; i++) {
        if (dist[i] == INF)
            printf("%d\\t\\tINF\\n", i);
        else
            printf("%d\\t\\t%d\\n", i, dist[i]);
    }
}

int main() {
    int n, src;
    int graph[V][V];

    // Input the number of vertices
    printf("Enter the number of vertices: ");
    scanf("%d", &n);

    // Input the adjacency matrix
    printf("Enter the adjacency matrix (use 0 for no direct edge):\\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            scanf("%d", &graph[i][j]);
            // Replace 0s with INF for non-diagonal elements (if there's no edge)
            if (graph[i][j] == 0 && i != j) {
                graph[i][j] = INF;
            }
        }
    }

    // Input the source vertex
    printf("Enter the source vertex: ");
    scanf("%d", &src);

    // Call Dijkstra's algorithm
    dijkstra(graph, n, src);

    return 0;
}`
    }
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    difficulty: 'Medium',
    acceptanceRate: '72.8%',
    category: 'Recursion',
    frequency: 85,
    popularity: 93,
    solved: false,
    companies: ['Amazon', 'Microsoft', 'Apple', 'Adobe'],
    statement: `Given an array of integers \`arr\`, sort the array in ascending order using the Merge Sort algorithm.`,
    inputFormat: 'An array of integers `arr`.',
    outputFormat: 'The sorted array of integers.',
    constraints: [
      '1 <= arr.length <= 50000',
      '-50000 <= arr[i] <= 50000'
    ],
    timeLimit: '1500ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'arr = [12, 11, 13, 5, 6, 7]',
        output: '[5, 6, 7, 11, 12, 13]',
        explanation: 'Sorted array elements in ascending order.'
      }
    ],
    testCases: [
      { input: '[12,11,13,5,6,7]', output: '[5,6,7,11,12,13]' },
      { input: '[5,4,3,2,1]', output: '[1,2,3,4,5]' }
    ],
    hiddenTestCases: [
      { input: '[1,3,2,5,4]', output: '[1,2,3,4,5]' }
    ],
    hints: [
      'Divide the array into two halves, recursively sort them, and merge the sorted halves.',
      'Use a temporary buffer array to merge elements back to original array.'
    ],
    videoUrl: 'https://www.youtube.com/embed/mB5HXBb_HYY',
    videoTitle: '2.8.1 Merge Sort Algorithm - Divide & Conquer',
    channelName: 'Abdul Bari',
    duration: '21:30',
    videoKeyTakeaways: [
      'Recursive divide step: mid = (low + high) / 2',
      'Two-way merge technique with temporary buffer array',
      'Guaranteed O(N log N) time complexity'
    ],
    editorial: `### Merge Sort Algorithm
Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.
The merge() function is used for merging two halves:
\`merge(arr, l, m, r)\` merges \`arr[l..m]\` and \`arr[m+1..r]\``,
    starterTemplates: {
      javascript: `function mergeSort(arr) {
    // Write your code here
    
}`,
      python: `def merge_sort(arr: list[int]) -> list[int]:
    # Write your code here
    pass`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<int> mergeSort(std::vector<int>& arr) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[] mergeSort(int[] arr) {
        // Write your code here
        return new int[]{};
    }
}`,
      go: `func mergeSort(arr []int) []int {
    // Write your code here
    return nil
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

void mergesort(int arr[], int low, int high);
void merge(int arr[], int low, int mid, int high);

void mergesort(int arr[], int low, int high) {
    if (low >= high)
        return;
    int mid = (low + high) / 2;
    mergesort(arr, low, mid);
    mergesort(arr, mid + 1, high);
    merge(arr, low, mid, high);
}

void merge(int arr[], int low, int mid, int high) {
    int size = high - low + 1;
    int *temp = (int*)malloc(size * sizeof(int));
    int counter = 0;
    int left = low;
    int right = mid + 1;

    while (left <= mid && right <= high) {
        if (arr[left] <= arr[right])
            temp[counter++] = arr[left++];
        else
            temp[counter++] = arr[right++];
    }

    while (left <= mid)
        temp[counter++] = arr[left++];

    while (right <= high)
        temp[counter++] = arr[right++];

    for (int i = 0; i < size; i++)
        arr[i + low] = temp[i];

    free(temp);
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &arr[i]) != 1) return 0;
    }

    printf("Array before sorting : ");
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\\n");

    mergesort(arr, 0, n - 1);

    printf("Array after Mergesort : ");
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\\n");

    free(arr);
    return 0;
}`
    }
  },
  {
    id: 'all-pairs-shortest-path',
    title: 'All-Pairs Shortest Path',
    difficulty: 'Medium',
    acceptanceRate: '60.5%',
    category: 'Graphs',
    frequency: 78,
    popularity: 88,
    solved: false,
    companies: ['Google', 'Amazon', 'Microsoft', 'Cisco'],
    statement: `Given a directed weighted graph represented as an adjacency matrix \`graph\` and its size \`n\`, find the shortest distance between all pairs of vertices.

The graph is represented as a 2D array of size \`n x n\`, where \`graph[i][j]\` is the weight of the edge from vertex \`i\` to vertex \`j\`. If there is no edge, the weight is represented by \`100\` (representing infinity). The distance from a vertex to itself is \`0\` (i.e., \`graph[i][i] = 0\`).

Implement the **Floyd-Warshall algorithm** (All-Pairs Shortest Path) to update the matrix in-place and return the updated matrix.`,
    inputFormat: 'An adjacency matrix `graph` (2D array of size `n x n`) and the number of vertices `n`.',
    outputFormat: 'The shortest path distance matrix (2D array of size `n x n`).',
    constraints: [
      '1 <= n <= 50',
      '0 <= graph[i][j] <= 100',
      'graph[i][i] == 0'
    ],
    timeLimit: '1500ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'graph = [[0, 3, 100], [3, 0, 1], [100, 1, 0]], n = 3',
        output: '[[0, 3, 4], [3, 0, 1], [4, 1, 0]]',
        explanation: 'The shortest path from vertex 0 to 2 is 0 -> 1 -> 2 with total cost 3 + 1 = 4.'
      }
    ],
    testCases: [
      { input: '[[0,3,100],[3,0,1],[100,1,0]]\n3', output: '[[0,3,4],[3,0,1],[4,1,0]]' },
      { input: '[[0,5,100,10],[100,0,3,100],[100,100,0,1],[100,100,100,0]]\n4', output: '[[0,5,8,9],[100,0,3,4],[100,100,0,1],[100,100,100,0]]' }
    ],
    hiddenTestCases: [
      { input: '[[0,100,3],[2,0,100],[100,7,0]]\n3', output: '[[0,10,3],[2,0,5],[9,7,0]]' }
    ],
    hints: [
      'Consider updating the distance between all pairs (i, j) by checking if a path through an intermediate vertex k is shorter.',
      'The recurrence relation is: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).'
    ],
    videoUrl: 'https://www.youtube.com/embed/oNI0rf2P9gE',
    videoTitle: '3.4 All Pairs Shortest Path - Floyd Warshall Algorithm',
    channelName: 'Abdul Bari',
    duration: '28:10',
    videoKeyTakeaways: [
      'Dynamic programming intermediate vertex iteration k from 0 to n-1',
      'Optimal substructure: A^k[i][j] = min(A^(k-1)[i][j], A^(k-1)[i][k] + A^(k-1)[k][j])',
      'In-place matrix updates with O(N^3) time complexity'
    ],
    editorial: `### Floyd-Warshall Algorithm (All-Pairs Shortest Path)

The Floyd-Warshall algorithm is a dynamic programming algorithm used to find the shortest paths between all pairs of vertices in a weighted graph.

We iterate through all possible intermediate vertices \`k\` from \`0\` to \`n-1\`. For each pair of source vertex \`i\` and destination vertex \`j\`, we check if path \`i -> k -> j\` is shorter than the currently recorded path \`i -> j\`:

\`graph[i][j] = min(graph[i][j], graph[i][k] + graph[k][j])\`

**Complexity**:
- **Time Complexity**: O(n^3) due to three nested loops.
- **Space Complexity**: O(1) auxiliary space if the matrix is updated in-place.`,
    functionName: 'allPairsShortestPath',
    starterTemplates: {
      javascript: `function allPairsShortestPath(graph, n) {
    // Write your code here
    
    return graph;
}`,
      python: `def all_pairs_shortest_path(graph: list[list[int]], n: int) -> list[list[int]]:
    # Write your code here
    pass`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> allPairsShortestPath(std::vector<std::vector<int>>& graph, int n) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[][] allPairsShortestPath(int[][] graph, int n) {
        // Write your code here
        return graph;
    }
}`,
      go: `func allPairsShortestPath(graph [][]int, n int) [][]int {
    // Write your code here
    return graph
}`
    }
  },
  {
    id: 'job-sequencing-with-deadlines',
    title: 'Job Sequencing with Deadlines',
    difficulty: 'Medium',
    acceptanceRate: '58.7%',
    category: 'Greedy',
    frequency: 82,
    popularity: 90,
    solved: false,
    companies: ['Amazon', 'Microsoft', 'Flipkart'],
    statement: `Given a set of \`n\` jobs where each job \`i\` has an ID, a deadline, and an associated profit if completed before the deadline. Only one job can be scheduled at any given time slot. Each job takes exactly 1 unit of time to complete.

Find the job sequence that maximizes total profit and return both the sequence of scheduled job IDs (ordered by their execution timeslot) and the maximum profit.

Each job is represented as an object with \`id\` (character), \`deadline\` (integer), and \`profit\` (integer).`,
    inputFormat: 'An array of job objects `jobs` and the number of jobs `n`.',
    outputFormat: 'An object containing `sequence` (an array of job ID characters in slot order) and `totalProfit` (an integer).',
    constraints: [
      '1 <= n <= 100',
      '1 <= jobs[i].deadline <= 100',
      '1 <= jobs[i].profit <= 500'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: "jobs = [{id: 'a', deadline: 2, profit: 100}, {id: 'b', deadline: 1, profit: 19}, {id: 'c', deadline: 2, profit: 27}], n = 3",
        output: "{ sequence: ['c', 'a'], totalProfit: 127 }",
        explanation: "Job 'a' is scheduled in slot 1 (time 1-2). Job 'c' is scheduled in slot 0 (time 0-1). Job 'b' cannot be scheduled."
      }
    ],
    testCases: [
      { input: '[{"id":"a","deadline":2,"profit":100},{"id":"b","deadline":1,"profit":19},{"id":"c","deadline":2,"profit":27}]\n3', output: '{"sequence":["c","a"],"totalProfit":127}' },
      { input: '[{"id":"a","deadline":2,"profit":100},{"id":"b","deadline":1,"profit":19},{"id":"c","deadline":2,"profit":27},{"id":"d","deadline":1,"profit":25},{"id":"e","deadline":3,"profit":15}]\n5', output: '{"sequence":["c","a","e"],"totalProfit":142}' }
    ],
    hiddenTestCases: [
      { input: '[{"id":"a","deadline":4,"profit":20},{"id":"b","deadline":1,"profit":10},{"id":"c","deadline":1,"profit":40},{"id":"d","deadline":1,"profit":30}]\n4', output: '{"sequence":["c","a"],"totalProfit":60}' }
    ],
    hints: [
      'Sort all jobs in decreasing order of profit.',
      'For each job, try to find a free time slot in its deadline range starting from its deadline - 1 down to 0.'
    ],
    videoUrl: 'https://www.youtube.com/embed/zPtI8q9gkX8',
    videoTitle: '3.2 Job Sequencing with Deadlines - Greedy Method',
    channelName: 'Abdul Bari',
    duration: '18:40',
    videoKeyTakeaways: [
      'Sort jobs in descending order of profit to prioritize high-yield tasks',
      'Schedule each job in the latest possible slot within its deadline',
      'Maximize profit under single-machine unit time constraints'
    ],
    editorial: `### Greedy Approach for Job Sequencing

By sorting the jobs in descending order of profit, we ensure that we prioritize high-profit jobs. For each job, we attempt to schedule it as late as possible (near its deadline) to leave earlier slots open for other jobs with tighter deadlines.

**Complexity**:
- **Time Complexity**: O(n^2) in the worst case if deadlines are large and we search for slot availability linearly.
- **Space Complexity**: O(m) where m is the maximum deadline, to keep track of filled slots.`,
    functionName: 'jobSequencing',
    starterTemplates: {
      javascript: `function jobSequencing(jobs, n) {
    // Write your code here
    
    return {
        sequence: [],
        totalProfit: 0
    };
}`,
      python: `def job_sequencing(jobs: list[dict], n: int) -> dict:
    # Write your code here
    return {
        "sequence": [],
        "totalProfit": 0
    }`,
      cpp: `#include <vector>
#include <string>

struct Job {
    char id;
    int deadline;
    int profit;
};

class Solution {
public:
    struct Result {
        std::vector<char> sequence;
        int totalProfit;
    };
    
    Result jobSequencing(std::vector<Job>& jobs, int n) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Job {
    char id;
    int deadline;
    int profit;
}

class Solution {
    public static class Result {
        public List<Character> sequence;
        public int totalProfit;
    }

    public Result jobSequencing(List<Job> jobs, int n) {
        // Write your code here
        return new Result();
    }
}`,
      go: `type Job struct {
    Id       string
    Deadline int
    Profit   int
}

type Result struct {
    Sequence    []string
    TotalProfit int
}

func jobSequencing(jobs []Job, n int) Result {
    // Write your code here
    return Result{}
}`
    }
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    difficulty: 'Medium',
    acceptanceRate: '50.1%',
    category: 'Arrays',
    frequency: 96,
    popularity: 99,
    solved: false,
    companies: ['Google', 'Amazon', 'Microsoft', 'LinkedIn', 'Apple'],
    statement: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: 'An array of integers `nums`.',
    outputFormat: 'The maximum contiguous subarray sum (integer).',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.'
      }
    ],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
      { input: '[1]', output: '1' },
      { input: '[5,4,-1,7,8]', output: '23' }
    ],
    hiddenTestCases: [
      { input: '[-1]', output: '-1' },
      { input: '[-2,-1]', output: '-1' }
    ],
    hints: [
      'If the current running sum becomes negative, reset it to 0.',
      'Track the global maximum at every step.'
    ],
    videoUrl: 'https://www.youtube.com/embed/5WZl3MMT0Eg',
    videoTitle: 'Maximum Subarray - Kadane\'s Algorithm - LeetCode 53',
    channelName: 'NeetCode',
    duration: '08:50',
    videoKeyTakeaways: [
      'Kadane\'s linear dynamic programming pattern',
      'Discarding negative prefix sums on the fly',
      'O(N) single-pass with O(1) memory'
    ],
    editorial: `### Kadane's Algorithm O(N) Time, O(1) Space

We maintain a running current sum. For every number, we add it to \`currentSum\`. If \`currentSum > maxSum\`, we update \`maxSum\`. If \`currentSum < 0\`, we reset it to \`0\` since a negative prefix will never help future subarrays.`,
    starterTemplates: {
      javascript: `function maxSubArray(nums) {
    // Write your code here
    
}`,
      python: `def max_sub_array(nums: list[int]) -> int:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxSubArray(std::vector<int>& nums) {
        // Write your code here
        
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
      go: `func maxSubArray(nums []int) int {
    // Write your code here
    return 0
}`
    }
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    acceptanceRate: '54.3%',
    category: 'Sliding Window',
    frequency: 94,
    popularity: 99,
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Apple', 'Microsoft'],
    statement: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`-th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return \`0\`.`,
    inputFormat: 'An array of positive integers `prices`.',
    outputFormat: 'Maximum profit (integer).',
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.'
      }
    ],
    testCases: [
      { input: '[7,1,5,3,6,4]', output: '5' },
      { input: '[7,6,4,3,1]', output: '0' },
      { input: '[2,4,1]', output: '2' }
    ],
    hiddenTestCases: [
      { input: '[1,2]', output: '1' },
      { input: '[3,2,6,5,0,3]', output: '4' }
    ],
    hints: [
      'Maintain the minimum buying price seen so far as you iterate.',
      'At each day, the potential profit is prices[i] - minPrice.'
    ],
    videoUrl: 'https://www.youtube.com/embed/1pkOG_aoGwE',
    videoTitle: 'Best Time to Buy and Sell Stock - LeetCode 121',
    channelName: 'NeetCode',
    duration: '09:12',
    videoKeyTakeaways: [
      'Two-pointer sliding window / single pass tracking',
      'Updating lowest buy price dynamically',
      'Constant auxiliary space O(1)'
    ],
    editorial: `### One-Pass O(N) Algorithm

Track the lowest price encountered so far \`minPrice\`. At every day \`i\`, calculate \`prices[i] - minPrice\` and update \`maxProfit\`.`,
    starterTemplates: {
      javascript: `function maxProfit(prices) {
    // Write your code here
    
}`,
      python: `def max_profit(prices: list[int]) -> int:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxProfit(std::vector<int>& prices) {
        // Write your code here
        
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your code here
        return 0;
    }
}`,
      go: `func maxProfit(prices []int) int {
    // Write your code here
    return 0
}`
    }
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    acceptanceRate: '33.8%',
    category: 'Sliding Window',
    frequency: 92,
    popularity: 98,
    solved: false,
    companies: ['Amazon', 'Microsoft', 'Bloomberg', 'Meta', 'Adobe'],
    statement: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    inputFormat: 'A string `s`.',
    outputFormat: 'Length of the longest non-repeating substring (integer).',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    testCases: [
      { input: '"abcabcbb"', output: '3' },
      { input: '"bbbbb"', output: '1' },
      { input: '"pwwkew"', output: '3' }
    ],
    hiddenTestCases: [
      { input: '""', output: '0' },
      { input: '" "', output: '1' }
    ],
    hints: [
      'Use a sliding window with left and right pointers.',
      'Use a Set or Hash Map to store characters within the current window.'
    ],
    videoUrl: 'https://www.youtube.com/embed/wiGpQwVHdE0',
    videoTitle: 'Longest Substring Without Repeating Characters - LeetCode 3',
    channelName: 'NeetCode',
    duration: '10:45',
    videoKeyTakeaways: [
      'Sliding window with dynamic left pointer expansion',
      'Set-based character frequency tracking',
      'O(N) time and O(min(M, N)) space'
    ],
    editorial: `### Sliding Window with Hash Set

Expand the window by advancing \`right\`. If \`s[right]\` is already in the set, remove \`s[left]\` and increment \`left\` until the duplicate is evicted. The maximum window size \`right - left + 1\` is the answer.`,
    starterTemplates: {
      javascript: `function lengthOfLongestSubstring(s) {
    // Write your code here
    
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    # Write your code here
    pass`,
      cpp: `#include <string>
#include <unordered_set>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}`,
      go: `func lengthOfLongestSubstring(s string) int {
    // Write your code here
    return 0
}`
    }
  },
  {
    id: 'three-sum',
    title: '3Sum',
    difficulty: 'Medium',
    acceptanceRate: '32.5%',
    category: 'Two Pointers',
    frequency: 91,
    popularity: 97,
    solved: false,
    companies: ['Meta', 'Amazon', 'Apple', 'Google', 'Microsoft'],
    statement: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    inputFormat: 'An integer array `nums`.',
    outputFormat: 'A 2D array of unique triplets summing to 0.',
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    timeLimit: '1500ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'Distinct triplets with sum 0.'
      }
    ],
    testCases: [
      { input: '[-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,1,1]', output: '[]' },
      { input: '[0,0,0]', output: '[[0,0,0]]' }
    ],
    hiddenTestCases: [
      { input: '[-2,0,1,1,2]', output: '[[-2,0,2],[-2,1,1]]' }
    ],
    hints: [
      'Sort the array first.',
      'Fix one element and use two pointers (left and right) to find the remaining pair.'
    ],
    videoUrl: 'https://www.youtube.com/embed/jzZsG8n2R9A',
    videoTitle: '3Sum - LeetCode 15 - Two Pointers & Duplicate Avoidance',
    channelName: 'NeetCode',
    duration: '15:30',
    videoKeyTakeaways: [
      'Sorting array for O(N log N) ordering',
      'Fixing one element and reducing to 2Sum II with two pointers',
      'Skipping duplicate values efficiently'
    ],
    editorial: `### Sort & Two Pointers O(N^2) Solution

Sort the array. Loop through \`i\` from \`0\` to \`n-3\`. If \`nums[i] > 0\`, break. Set \`left = i + 1\` and \`right = n - 1\`. If sum is 0, add to result and skip duplicate numbers.`,
    starterTemplates: {
      javascript: `function threeSum(nums) {
    // Write your code here
    
}`,
      python: `def three_sum(nums: list[int]) -> list[list[int]]:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> threeSum(std::vector<int>& nums) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
      go: `func threeSum(nums []int) [][]int {
    // Write your code here
    return nil
}`
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    acceptanceRate: '56.4%',
    category: 'Binary Search',
    frequency: 93,
    popularity: 96,
    solved: false,
    companies: ['Microsoft', 'Apple', 'Google', 'Amazon'],
    statement: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    inputFormat: 'A sorted integer array `nums` and integer `target`.',
    outputFormat: 'Index of target if found, else -1.',
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All integers in nums are unique and sorted in ascending order.'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    testCases: [
      { input: '[-1,0,3,5,9,12]\n9', output: '4' },
      { input: '[-1,0,3,5,9,12]\n2', output: '-1' }
    ],
    hiddenTestCases: [
      { input: '[5]\n5', output: '0' },
      { input: '[2,5]\n5', output: '1' }
    ],
    hints: [
      'Maintain low and high pointers, checking mid = low + (high - low) / 2.'
    ],
    videoUrl: 'https://www.youtube.com/embed/s4DPM8ct1pI',
    videoTitle: 'Binary Search - LeetCode 704 - O(log N) Explained',
    channelName: 'NeetCode',
    duration: '07:20',
    videoKeyTakeaways: [
      'Logarithmic search space reduction',
      'Avoiding integer overflow with mid = low + (high - low) / 2',
      'Loop invariant: low <= high'
    ],
    editorial: `### Standard Binary Search O(log N)

Compare target with \`nums[mid]\`. If target is smaller, search left (\`high = mid - 1\`). If larger, search right (\`low = mid + 1\`).`,
    starterTemplates: {
      javascript: `function search(nums, target) {
    // Write your code here
    
}`,
      python: `def search(nums: list[int], target: int) -> int:
    # Write your code here
    pass`,
      cpp: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }
}`,
      go: `func search(nums []int, target int) int {
    // Write your code here
    return -1
}`
    }
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    acceptanceRate: '52.3%',
    category: 'Dynamic Programming',
    frequency: 89,
    popularity: 95,
    solved: false,
    companies: ['Amazon', 'Adobe', 'Apple', 'Google'],
    statement: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    inputFormat: 'An integer `n` (number of stairs).',
    outputFormat: 'Number of distinct ways (integer).',
    constraints: [
      '1 <= n <= 45'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways: 1 step + 1 step, or 2 steps.'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'Three ways: 1+1+1, 1+2, 2+1.'
      }
    ],
    testCases: [
      { input: '2', output: '2' },
      { input: '3', output: '3' },
      { input: '5', output: '8' }
    ],
    hiddenTestCases: [
      { input: '1', output: '1' },
      { input: '4', output: '5' }
    ],
    hints: [
      'To reach step n, you can jump from n-1 (1 step) or n-2 (2 steps).',
      'Ways(n) = Ways(n-1) + Ways(n-2).'
    ],
    videoUrl: 'https://www.youtube.com/embed/Y0lT9Fck7qI',
    videoTitle: 'Climbing Stairs - Dynamic Programming - LeetCode 70',
    channelName: 'NeetCode',
    duration: '10:20',
    videoKeyTakeaways: [
      'Fibonacci state transition',
      'Bottom-up dynamic programming with two variables',
      'O(N) time and O(1) space optimization'
    ],
    editorial: `### Bottom-Up DP (Fibonacci)

\`dp[i] = dp[i-1] + dp[i-2]\`. Using two variables \`one\` and \`two\`, we iteratively compute the solution in O(N) time and O(1) space.`,
    starterTemplates: {
      javascript: `function climbStairs(n) {
    // Write your code here
    
}`,
      python: `def climb_stairs(n: int) -> int:
    # Write your code here
    pass`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        
    }
};`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}`,
      go: `func climbStairs(n int) int {
    // Write your code here
    return 0
}`
    }
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    acceptanceRate: '42.1%',
    category: 'Dynamic Programming',
    frequency: 88,
    popularity: 96,
    solved: false,
    companies: ['Amazon', 'Bloomberg', 'Goldman Sachs', 'Meta'],
    statement: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    inputFormat: 'An array of integers `coins` and integer `amount`.',
    outputFormat: 'Minimum number of coins (integer).',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins total).'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
        explanation: 'Amount 3 cannot be formed.'
      }
    ],
    testCases: [
      { input: '[1,2,5]\n11', output: '3' },
      { input: '[2]\n3', output: '-1' },
      { input: '[1]\n0', output: '0' }
    ],
    hiddenTestCases: [
      { input: '[186,419,83,408]\n6249', output: '20' }
    ],
    hints: [
      'Use DP where dp[i] represents the min coins needed for amount i.',
      'dp[i] = min(dp[i], 1 + dp[i - coin]).'
    ],
    videoUrl: 'https://www.youtube.com/embed/H9bfqozjoqs',
    videoTitle: 'Coin Change - Bottom Up DP - LeetCode 322',
    channelName: 'NeetCode',
    duration: '16:40',
    videoKeyTakeaways: [
      'Unbounded knapsack state relation',
      'Bottom-up tabulation initialization with amount + 1',
      'O(amount * len(coins)) complexity'
    ],
    editorial: `### Bottom-Up DP O(Amount * Coins)

Initialize \`dp\` array of size \`amount + 1\` with infinity, \`dp[0] = 0\`. For each \`a\` from 1 to \`amount\`, for each \`c\` in \`coins\`: if \`a - c >= 0\`, \`dp[a] = min(dp[a], 1 + dp[a - c])\`.`,
    starterTemplates: {
      javascript: `function coinChange(coins, amount) {
    // Write your code here
    
}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        // Write your code here
        
    }
};`,
      java: `import java.util.*;

class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your code here
        return -1;
    }
}`,
      go: `func coinChange(coins []int, amount int) int {
    // Write your code here
    return -1
}`
    }
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    acceptanceRate: '57.2%',
    category: 'Graphs',
    frequency: 93,
    popularity: 99,
    solved: false,
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg'],
    statement: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    inputFormat: 'A 2D array of string/character digits grid.',
    outputFormat: 'Total number of islands (integer).',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is "0" or "1".'
    ],
    timeLimit: '1500ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
        explanation: 'All lands are connected into 1 island.'
      }
    ],
    testCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' }
    ],
    hiddenTestCases: [
      { input: '[["1"]]', output: '1' },
      { input: '[["0"]]', output: '0' }
    ],
    hints: [
      'Iterate through every cell. When you encounter land ("1"), trigger a BFS/DFS to mark all connected land as visited.'
    ],
    videoUrl: 'https://www.youtube.com/embed/pV2kpPD66nE',
    videoTitle: 'Number of Islands - BFS / DFS Graph Traversal - LeetCode 200',
    channelName: 'NeetCode',
    duration: '19:10',
    videoKeyTakeaways: [
      'Connected components graph traversal',
      'In-place grid sinking or visited set tracking',
      'O(M * N) time and space complexity'
    ],
    editorial: `### BFS / DFS Flood Fill

Iterate through every cell \`(r, c)\`. If \`grid[r][c] === '1'\`, increment island count and run BFS/DFS to sink all 4-directionally connected '1's to '0'.`,
    starterTemplates: {
      javascript: `function numIslands(grid) {
    // Write your code here
    
}`,
      python: `def num_islands(grid: list[list[str]]) -> int:
    # Write your code here
    pass`,
      cpp: `#include <vector>

class Solution {
public:
    int numIslands(std::vector<std::vector<char>>& grid) {
        // Write your code here
        
    }
};`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your code here
        return 0;
    }
}`,
      go: `func numIslands(grid [][]byte) int {
    // Write your code here
    return 0
}`
    }
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    acceptanceRate: '59.8%',
    category: 'Two Pointers',
    frequency: 90,
    popularity: 98,
    solved: false,
    companies: ['Google', 'Amazon', 'Goldman Sachs', 'Meta'],
    statement: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    inputFormat: 'An array of non-negative integers `height`.',
    outputFormat: 'Total units of trapped water (integer).',
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water.'
      }
    ],
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: '[4,2,0,3,2,5]', output: '9' }
    ],
    hiddenTestCases: [
      { input: '[2,0,2]', output: '2' },
      { input: '[3,0,0,2,0,4]', output: '10' }
    ],
    hints: [
      'Water at index i is determined by min(maxLeft, maxRight) - height[i].',
      'Use two pointers (left and right) moving inward.'
    ],
    videoUrl: 'https://www.youtube.com/embed/ZI2z5pq0TqA',
    videoTitle: 'Trapping Rain Water - Two Pointer Optimal O(1) Space - LeetCode 42',
    channelName: 'NeetCode',
    duration: '18:30',
    videoKeyTakeaways: [
      'Bottleneck bounded by min(leftMax, rightMax)',
      'Two pointer inward contraction eliminating array memory',
      'O(N) time and O(1) space'
    ],
    editorial: `### Two Pointers O(N) Time, O(1) Space

Maintain \`left\`, \`right\`, \`maxLeft\`, and \`maxRight\`. Shift the pointer with the smaller max boundary inward, accumulating water as \`max - height[pointer]\`.`,
    starterTemplates: {
      javascript: `function trap(height) {
    // Write your code here
    
}`,
      python: `def trap(height: list[int]) -> int:
    # Write your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int trap(std::vector<int>& height) {
        // Write your code here
        
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        // Write your code here
        return 0;
    }
}`,
      go: `func trap(height []int) int {
    // Write your code here
    return 0
}`
    }
  }
];

export const CATEGORIES = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Recursion',
  'Backtracking',
  'Sliding Window',
  'Two Pointers',
  'Binary Search',
  'Heaps'
];
