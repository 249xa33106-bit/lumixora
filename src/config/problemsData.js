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

Each solution contains a distinct board configuration of the n-queens\' placement, where \`'Q'\` and \`'.'\` both indicate a queen and an empty space, respectively.`,
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
      { input: '4', output: '[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]' },
      { input: '1', output: '[[\"Q\"]]' }
    ],
    hiddenTestCases: [
      { input: '2', output: '[]' }
    ],
    hints: [
      'Use backtracking row by row. For each row, try to place a queen in each column.',
      'Maintain boolean sets for columns, positive diagonals (r + c), and negative diagonals (r - c) to check safety in O(1).'
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
