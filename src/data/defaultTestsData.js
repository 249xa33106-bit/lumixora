// Default Comprehensive Assessment Suite for Vyomra / Lumixora Test Portal
export const DEFAULT_TESTS = [
  {
    id: 'test-dsa-mastery',
    title: 'Data Structures & Algorithms (DSA) Sprint',
    duration: 30,
    type: 'both',
    category: 'test',
    requireCamera: true,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    questions: [
      {
        id: 'dsa_q1',
        type: 'mcq',
        question: 'What is the worst-case time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correct: 1,
        explanation: 'In balanced BSTs (AVL or Red-Black), self-balancing rotations ensure the tree height is bounded strictly to O(log N), guaranteeing O(log N) worst-case lookup.'
      },
      {
        id: 'dsa_q2',
        type: 'mcq',
        question: 'Which data structure is primarily used to implement Breadth-First Search (BFS) in a Graph?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Array List'],
        correct: 1,
        explanation: 'BFS discovers nodes level-by-level in First-In-First-Out (FIFO) sequence, making Queue the canonical data structure.'
      },
      {
        id: 'dsa_q3',
        type: 'mcq',
        question: 'What happens when you push an element into a full static stack?',
        options: ['Stack Underflow', 'Stack Overflow', 'Segmentation Fault', 'Garbage Collection'],
        correct: 1,
        explanation: 'Pushing into a stack that has exhausted its fixed allocated buffer throws a Stack Overflow error.'
      },
      {
        id: 'dsa_q4',
        type: 'mcq',
        question: 'What is the space complexity of an in-place QuickSort algorithm?',
        options: ['O(1)', 'O(log N) for recursive call stack', 'O(N)', 'O(N^2)'],
        correct: 1,
        explanation: 'In-place QuickSort requires O(log N) auxiliary memory on average to maintain the recursive function activation frames on the execution stack.'
      },
      {
        id: 'dsa_q5',
        type: 'mcq',
        question: 'What is the average time complexity of searching for a key in a Hash Table with a uniform hash distribution?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
        correct: 0,
        explanation: 'With a uniform hash function and low load factor, collisions are minimal and average element retrieval takes constant O(1) time.'
      },
      {
        id: 'dsa_q6',
        type: 'mcq',
        question: 'Which algorithmic paradigm is typically used to solve the 0/1 Knapsack problem optimally?',
        options: ['Greedy Approach', 'Dynamic Programming', 'Divide and Conquer', 'Linear Search'],
        correct: 1,
        explanation: 'Because 0/1 Knapsack exhibits overlapping subproblems and optimal substructure where greedy item-fraction choices fail, Dynamic Programming provides the optimal O(N*W) solution.'
      },
      {
        id: 'dsa_q7',
        type: 'code',
        question: 'Write a Java program that reads an integer N followed by N space-separated integers, and prints the maximum element in the array.',
        language: 'java',
        initialCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (val > max) max = val;
        }
        System.out.println(max);
    }
}`,
        expectedOutput: 'Output the single maximum integer',
        explanation: 'A single linear traversal tracks the highest value observed with O(N) time complexity and O(1) auxiliary memory.'
      }
    ]
  },
  {
    id: 'test-python-core',
    title: 'Python Programming & Logic Assessment',
    duration: 20,
    type: 'both',
    category: 'test',
    requireCamera: true,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    questions: [
      {
        id: 'py_q1',
        type: 'mcq',
        question: 'What is the output of `type(lambda x: x * 2)` in Python 3?',
        options: ['<class \'function\'>', '<class \'lambda\'>', '<class \'method\'>', '<class \'object\'>'],
        correct: 0,
        explanation: 'In Python, anonymous lambda expressions are instances of the standard built-in function class (`<class \'function\'>`).'
      },
      {
        id: 'py_q2',
        type: 'mcq',
        question: 'Which of the following data types is immutable in Python?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correct: 2,
        explanation: 'Tuples are immutable sequence objects; once instantiated, their elements, order, and length cannot be modified or rebound in place.'
      },
      {
        id: 'py_q3',
        type: 'mcq',
        question: 'What is the time complexity of looking up a key in a standard Python dictionary (`dict`) on average?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correct: 0,
        explanation: 'Python dictionaries utilize high-performance hash tables with open addressing, providing amortized O(1) key lookups.'
      },
      {
        id: 'py_q4',
        type: 'mcq',
        question: 'What keyword converts a standard Python function into a generator iterator?',
        options: ['return', 'yield', 'async', 'lambda'],
        correct: 1,
        explanation: 'The `yield` statement suspends execution, preserving the local frame state and producing values lazily on subsequent `next()` iterations.'
      },
      {
        id: 'py_q5',
        type: 'mcq',
        question: 'What is the evaluated output of `[x**2 for x in range(5) if x % 2 == 0]`?',
        options: ['[0, 4, 16]', '[1, 9]', '[0, 2, 4]', '[4, 16]'],
        correct: 0,
        explanation: '`range(5)` yields 0, 1, 2, 3, 4. Even numbers are 0, 2, 4. Squaring them yields `[0**2, 2**2, 4**2] = [0, 4, 16]`.'
      },
      {
        id: 'py_q6',
        type: 'code',
        question: 'Write a Python script that takes a space-separated string of words and prints the reversed sentence (word by word).',
        language: 'python',
        initialCode: `# Read input and print reversed words
s = input().strip()
words = s.split()
print(" ".join(reversed(words)))
`,
        expectedOutput: 'Reversed word sentence',
        explanation: '`s.split()` extracts individual word tokens into a list; `reversed(words)` iterates backwards, and `" ".join(...)` reassembles them with space delimiters in O(N) time.'
      }
    ]
  },
  {
    id: 'test-java-oops',
    title: 'Java OOPs & Multi-threading Challenge',
    duration: 25,
    type: 'quiz',
    category: 'test',
    requireCamera: true,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    questions: [
      {
        id: 'java_q1',
        type: 'mcq',
        question: 'Can a class in Java implement multiple interfaces and extend multiple abstract classes simultaneously?',
        options: [
          'Yes, multiple inheritance is fully supported',
          'No, it can implement multiple interfaces but extend only one class',
          'No, it can only implement one interface and extend one class',
          'Yes, using the `implements multiple` keyword'
        ],
        correct: 1,
        explanation: 'Java disallows multiple class inheritance to prevent the Diamond Problem, but permits implementing any number of interfaces.'
      },
      {
        id: 'java_q2',
        type: 'mcq',
        question: 'Which memory area in the JVM is shared among all active threads?',
        options: ['JVM Stack', 'Program Counter (PC) Register', 'Heap Memory', 'Native Method Stack'],
        correct: 2,
        explanation: 'The JVM Heap memory stores all object instances and is shared across all concurrent application threads, while thread stacks are isolated.'
      },
      {
        id: 'java_q3',
        type: 'mcq',
        question: 'What is the effect of declaring a variable as `volatile` in Java?',
        options: [
          'It makes the variable immutable',
          'It guarantees visibility of changes across threads by reading directly from main memory',
          'It synchronizes all methods of the class',
          'It prevents the variable from being serialized'
        ],
        correct: 1,
        explanation: 'The `volatile` modifier ensures that thread reads/writes bypass CPU L1/L2 caches and interact directly with main RAM, establishing a happens-before visibility guarantee.'
      },
      {
        id: 'java_q4',
        type: 'mcq',
        question: 'Which keyword is used to explicitly throw an exception from inside a method body?',
        options: ['throws', 'throw', 'catch', 'finally'],
        correct: 1,
        explanation: '`throw` instantiates and propagates an exception object explicitly, while `throws` is used in method signatures to declare checked exceptions.'
      },
      {
        id: 'java_q5',
        type: 'mcq',
        question: 'What is the time complexity of the `get(int index)` method in Java\'s `java.util.ArrayList`?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correct: 0,
        explanation: 'Because `ArrayList` is backed by a contiguous primitive object array, element indexing via offset arithmetic is instantaneous O(1).'
      }
    ]
  },
  {
    id: 'test-web-react',
    title: 'Modern Web Development & React Architecture',
    duration: 20,
    type: 'both',
    category: 'test',
    requireCamera: false,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    questions: [
      {
        id: 'react_q1',
        type: 'mcq',
        question: 'Why does React use a Virtual DOM instead of directly manipulating the Browser DOM?',
        options: [
          'Because JavaScript cannot access the Browser DOM directly',
          'To minimize expensive browser reflows and repaints through efficient reconciliation/diffing',
          'Because Virtual DOM uses server-side rendering exclusively',
          'To eliminate the need for JavaScript bundle files'
        ],
        correct: 1,
        explanation: 'Direct DOM manipulation causes expensive style calculations, reflows, and layout repaints. React batches changes in an in-memory Virtual DOM tree and diffs them to apply minimum mutations.'
      },
      {
        id: 'react_q2',
        type: 'mcq',
        question: 'When does the cleanup function in a `useEffect` hook execute?',
        options: [
          'Only when the browser window closes',
          'Before the component unmounts and before re-running the effect on dependency change',
          'Immediately after the component renders for the first time',
          'Never, it is only a placeholder'
        ],
        correct: 1,
        explanation: 'React runs the returned cleanup function before applying new effect cycles when dependencies change, and during component destruction/unmount.'
      },
      {
        id: 'react_q3',
        type: 'mcq',
        question: 'Which React hook is designed to memoize the computed result of an expensive calculation across re-renders?',
        options: ['useCallback', 'useMemo', 'useRef', 'useReducer'],
        correct: 1,
        explanation: '`useMemo` caches the return value of a pure function calculation and only re-computes when specified dependencies change.'
      },
      {
        id: 'react_q4',
        type: 'code',
        question: 'Write a JavaScript function that takes an array of numbers and returns an array containing only the unique even numbers sorted in ascending order.',
        language: 'javascript',
        initialCode: `function getSortedUniqueEvens(arr) {
    const evens = arr.filter(n => n % 2 === 0);
    const unique = [...new Set(evens)];
    return unique.sort((a, b) => a - b);
}

// Test call
console.log(getSortedUniqueEvens([10, 3, 4, 10, 8, 2, 4, 9]));
`,
        expectedOutput: '[2, 4, 8, 10]',
        explanation: '`filter` eliminates odd values, `Set` deduplicates entries in O(N), and `sort((a, b) => a - b)` provides numerical ascending order.'
      }
    ]
  },
  {
    id: 'test-tcs-aptitude',
    title: 'TCS NQT Quantitative & Cognitive Aptitude Sprint',
    duration: 15,
    type: 'quiz',
    category: 'test',
    requireCamera: true,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    questions: [
      {
        id: 'apt_q1',
        type: 'mcq',
        question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
        options: ['65 seconds', '89 seconds', '100 seconds', '150 seconds'],
        correct: 1,
        explanation: 'Speed = 240 m / 24 s = 10 m/s. Total distance to cross platform = 240 + 650 = 890 m. Time = 890 / 10 = 89 seconds.'
      },
      {
        id: 'apt_q2',
        type: 'mcq',
        question: 'If A:B = 2:3 and B:C = 4:5, what is the combined ratio A:B:C?',
        options: ['8:12:15', '2:4:5', '6:9:15', '8:10:15'],
        correct: 0,
        explanation: 'Multiply first ratio by 4 (A:B = 8:12) and second ratio by 3 (B:C = 12:15). Common B = 12, yielding A:B:C = 8:12:15.'
      },
      {
        id: 'apt_q3',
        type: 'mcq',
        question: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
        options: ['95', '127', '125', '129'],
        correct: 1,
        explanation: 'The pattern is 2*x + 1: 3*2+1=7, 7*2+1=15, 15*2+1=31, 31*2+1=63, 63*2+1 = 127.'
      },
      {
        id: 'apt_q4',
        type: 'mcq',
        question: 'Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:',
        options: ['12 minutes', '15 minutes', '25 minutes', '50 minutes'],
        correct: 0,
        explanation: 'Combined rate per minute = (1/20) + (1/30) = (3+2)/60 = 5/60 = 1/12. Therefore, tank fills completely in 12 minutes.'
      },
      {
        id: 'apt_q5',
        type: 'mcq',
        question: 'A retailer buys a textbook for Rs. 400 and sells it for Rs. 500. What is the net profit percentage?',
        options: ['20%', '25%', '30%', '15%'],
        correct: 1,
        explanation: 'Profit = 500 - 400 = Rs. 100. Profit % = (Profit / Cost Price) * 100 = (100 / 400) * 100 = 25%.'
      }
    ]
  },
  {
    id: 'test-c-pointers',
    title: 'C / C++ Pointers & Memory Management Diagnostic',
    duration: 20,
    type: 'both',
    category: 'test',
    requireCamera: true,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    questions: [
      {
        id: 'c_q1',
        type: 'mcq',
        question: 'What is a "Dangling Pointer" in C/C++?',
        options: [
          'A pointer that points to memory address 0 (NULL)',
          'A pointer that points to a memory location that has been deallocated or freed',
          'A pointer that has never been initialized',
          'A pointer stored inside an array of pointers'
        ],
        correct: 1,
        explanation: 'A dangling pointer arises when memory pointed to by a pointer variable is deallocated or freed via `free()` or goes out of scope, leaving the pointer pointing to invalid memory.'
      },
      {
        id: 'c_q2',
        type: 'mcq',
        question: 'What is the output of `sizeof(char*)` on a 64-bit operating system architecture?',
        options: ['1 byte', '4 bytes', '8 bytes', '16 bytes'],
        correct: 2,
        explanation: 'On 64-bit architectures, memory address pointers require 64 bits (8 bytes) of storage regardless of the underlying data type pointed to.'
      },
      {
        id: 'c_q3',
        type: 'mcq',
        question: 'Which standard C library function dynamically allocates memory on the heap and initializes all allocated bytes to zero?',
        options: ['malloc()', 'calloc()', 'realloc()', 'free()'],
        correct: 1,
        explanation: '`calloc(num, size)` allocates contiguous heap memory for an array and zeroes out all allocated memory locations, unlike `malloc()` which leaves memory uninitialized.'
      },
      {
        id: 'c_q4',
        type: 'code',
        question: 'Write a C++ program that reads two integers A and B, swaps their values using pointer references, and prints the swapped values.',
        language: 'cpp',
        initialCode: `#include <iostream>
using namespace std;

void swapValues(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    swapValues(&x, &y);
    cout << x << " " << y << endl;
    return 0;
}
`,
        expectedOutput: '20 10',
        explanation: 'Passing memory addresses `&x` and `&y` allows `swapValues` to dereference and swap the physical storage values in place.'
      }
    ]
  },
  {
    id: 'test-dbms-sql',
    title: 'DBMS, SQL Queries & Indexing Assessment',
    duration: 15,
    type: 'quiz',
    category: 'test',
    requireCamera: false,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    questions: [
      {
        id: 'db_q1',
        type: 'mcq',
        question: 'Which normal form eliminates transitive functional dependency on the primary key?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
        correct: 2,
        explanation: 'A relation is in 3NF if it is in 2NF and no non-prime attribute is transitively dependent on the primary key.'
      },
      {
        id: 'db_q2',
        type: 'mcq',
        question: 'Which ACID property ensures that all transaction statements execute as an all-or-nothing unit?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correct: 0,
        explanation: 'Atomicity ensures that a transaction completes entirely or is rolled back with zero partial effects upon failure.'
      },
      {
        id: 'db_q3',
        type: 'mcq',
        question: 'What index structure is automatically created on Primary Key columns in PostgreSQL and MySQL InnoDB?',
        options: ['Hash Index', 'B-Tree / B+Tree Clustered Index', 'Bitmap Index', 'Full-Text Index'],
        correct: 1,
        explanation: 'B+Trees offer O(log N) search, insertion, deletion, and optimal sequential range scans, making them the standard clustered index structure for primary keys.'
      },
      {
        id: 'db_q4',
        type: 'mcq',
        question: 'Which SQL clause is used to filter aggregated groups after the `GROUP BY` statement executes?',
        options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
        correct: 1,
        explanation: '`WHERE` filters individual rows prior to grouping, whereas `HAVING` filters aggregated values created by `GROUP BY`.'
      },
      {
        id: 'db_q5',
        type: 'mcq',
        question: 'Which SQL JOIN returns all rows from the Left table and matched rows from the Right table, filling NULL for unmatched Right rows?',
        options: ['INNER JOIN', 'LEFT OUTER JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
        correct: 1,
        explanation: '`LEFT JOIN` preserves all tuples from the left table and populates columns with `NULL` wherever the join condition lacks a match in the right table.'
      }
    ]
  },
  {
    id: 'assignment-frontend-component',
    title: 'Assignment: Responsive Navigation & Session Manager',
    subject: 'Web Technologies',
    duration: 60,
    type: 'code',
    category: 'assignment',
    requireCamera: false,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    dueDate: '2026-12-02T23:59:59Z',
    rubric: [
      { criterion: 'Correctness & Logic', weight: 40 },
      { criterion: 'Code Cleanliness & ES6 Standards', weight: 30 },
      { criterion: 'Edge Case & Expiry Math', weight: 20 },
      { criterion: 'Documentation', weight: 10 }
    ],
    submissionModes: ['code', 'github', 'pdf'],
    questions: [
      {
        id: 'assign_q1',
        type: 'code',
        question: 'Implement a JavaScript class `UserSession` that manages login tokens, expiry calculation (in minutes), and validates if a session is currently active.',
        language: 'javascript',
        initialCode: `class UserSession {
    constructor(userId, token, expiryMinutes = 30) {
        this.userId = userId;
        this.token = token;
        this.createdAt = Date.now();
        this.expiresAt = this.createdAt + (expiryMinutes * 60 * 1000);
    }

    isValid() {
        return Date.now() < this.expiresAt;
    }

    getRemainingMinutes() {
        if (!this.isValid()) return 0;
        return Math.ceil((this.expiresAt - Date.now()) / (60 * 1000));
    }
}

// Test verification
const session = new UserSession("user_101", "tok_xyz", 45);
console.log("Valid:", session.isValid());
console.log("Minutes left:", session.getRemainingMinutes());
`,
        expectedOutput: 'Valid: true, Minutes left: ~45',
        explanation: '`UserSession` records epoch timestamps and compares current `Date.now()` with expiration boundary to validate active authentication tokens.'
      }
    ]
  },
  {
    id: 'assignment-os-cpu-scheduler',
    title: 'Assignment 01: OS CPU Round-Robin Scheduler with Gantt Metrics',
    subject: 'Operating Systems',
    duration: 120,
    type: 'code',
    category: 'assignment',
    requireCamera: false,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    dueDate: '2026-12-05T23:59:59Z',
    rubric: [
      { criterion: 'Turnaround Time (TAT) & Waiting Time (WT) Accuracy', weight: 40 },
      { criterion: 'Gantt Queue Timeline Construction', weight: 30 },
      { criterion: 'Time Quantum Boundary Handling', weight: 20 },
      { criterion: 'Algorithmic Complexity & Comments', weight: 10 }
    ],
    submissionModes: ['code', 'github', 'pdf'],
    questions: [
      {
        id: 'os_q1',
        type: 'code',
        question: 'Implement a Round-Robin CPU Scheduler function `calculateRoundRobin(processes, timeQuantum)` that returns the sequence of process execution, average waiting time (AWT), and average turnaround time (ATAT).',
        language: 'javascript',
        initialCode: `// Round-Robin CPU Scheduler Implementation
// processes = [{ id: 'P1', arrival: 0, burst: 5 }, { id: 'P2', arrival: 1, burst: 3 }, { id: 'P3', arrival: 2, burst: 1 }]
function calculateRoundRobin(processes, quantum = 2) {
    let time = 0;
    const queue = [];
    const remainingBurst = {};
    const completionTime = {};
    const waitingTime = {};
    const turnaroundTime = {};
    const executionGantt = [];

    // Initialize remaining burst times
    processes.forEach(p => { remainingBurst[p.id] = p.burst; });

    let completed = 0;
    let n = processes.length;
    let visited = new Set();

    // Push initial arrived processes
    processes.filter(p => p.arrival <= time).forEach(p => {
        queue.push(p);
        visited.add(p.id);
    });

    while (completed < n) {
        if (queue.length === 0) {
            // Find next arriving process
            const nextP = processes.filter(p => !visited.has(p.id)).sort((a,b) => a.arrival - b.arrival)[0];
            if (nextP) {
                time = nextP.arrival;
                queue.push(nextP);
                visited.add(nextP.id);
            }
        }

        const curr = queue.shift();
        const executeTime = Math.min(quantum, remainingBurst[curr.id]);
        executionGantt.push({ process: curr.id, start: time, end: time + executeTime });
        time += executeTime;
        remainingBurst[curr.id] -= executeTime;

        // Check for new arrivals during this execution window
        processes.filter(p => p.arrival <= time && !visited.has(p.id)).forEach(p => {
            queue.push(p);
            visited.add(p.id);
        });

        if (remainingBurst[curr.id] > 0) {
            queue.push(curr);
        } else {
            completionTime[curr.id] = time;
            turnaroundTime[curr.id] = completionTime[curr.id] - curr.arrival;
            waitingTime[curr.id] = turnaroundTime[curr.id] - curr.burst;
            completed++;
        }
    }

    const avgWT = Object.values(waitingTime).reduce((a, b) => a + b, 0) / n;
    const avgTAT = Object.values(turnaroundTime).reduce((a, b) => a + b, 0) / n;

    return {
        gantt: executionGantt.map(g => \`\${g.process}(\${g.start}-\${g.end})\`).join(' -> '),
        avgWaitingTime: avgWT.toFixed(2),
        avgTurnaroundTime: avgTAT.toFixed(2)
    };
}

// Sample Test
const sampleProcesses = [
    { id: 'P1', arrival: 0, burst: 4 },
    { id: 'P2', arrival: 1, burst: 5 },
    { id: 'P3', arrival: 2, burst: 2 }
];
console.log(calculateRoundRobin(sampleProcesses, 2));
`,
        expectedOutput: 'Gantt execution timeline with accurate Average Waiting Time & Turnaround Time metrics.',
        explanation: 'Round-Robin allocates CPU quantum slices cyclically. Context switches occur preemptively when quantum expires, keeping interactive systems responsive.'
      }
    ]
  },
  {
    id: 'assignment-dbms-window-analytics',
    title: 'Assignment 02: SQL Financial Transactions & Window Function Analytics',
    subject: 'Database Management Systems',
    duration: 90,
    type: 'code',
    category: 'assignment',
    requireCamera: false,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    dueDate: '2026-12-07T23:59:59Z',
    rubric: [
      { criterion: 'Window Function Syntax & Partitioning', weight: 40 },
      { criterion: 'Rolling Average Calculation Logic', weight: 30 },
      { criterion: 'Fraud Anomaly Spike Detection Filter', weight: 20 },
      { criterion: 'Execution Plan Index Strategy', weight: 10 }
    ],
    submissionModes: ['code', 'github', 'pdf'],
    questions: [
      {
        id: 'dbms_q1',
        type: 'code',
        question: 'Write an SQL/JavaScript query simulation that computes the 3-transaction moving average per account and flags transactions that exceed 2.5x of their historical rolling average.',
        language: 'javascript',
        initialCode: `// Simulation of SQL Window Function:
// SELECT txn_id, account_id, amount,
//        AVG(amount) OVER (PARTITION BY account_id ORDER BY txn_time ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_avg,
//        CASE WHEN amount > 2.5 * AVG(amount) OVER (PARTITION BY account_id ORDER BY txn_time ROWS BETWEEN 2 PRECEDING AND 1 PRECEDING) THEN 'FLAGGED_SPIKE' ELSE 'NORMAL' END AS fraud_flag
// FROM transactions;

function analyzeTransactionWindow(transactions) {
    const accountTxns = {};

    transactions.forEach(t => {
        if (!accountTxns[t.accountId]) accountTxns[t.accountId] = [];
        accountTxns[t.accountId].push(t);
    });

    const results = [];

    Object.keys(accountTxns).forEach(accId => {
        const txns = accountTxns[accId].sort((a,b) => a.timestamp - b.timestamp);

        txns.forEach((curr, idx) => {
            // Window of current + past 2 transactions
            const start = Math.max(0, idx - 2);
            const windowSlice = txns.slice(start, idx + 1);
            const rollingAvg = windowSlice.reduce((sum, item) => sum + item.amount, 0) / windowSlice.length;

            // Prior transactions baseline for spike detection
            let isAnomaly = false;
            if (idx > 0) {
                const priorSlice = txns.slice(Math.max(0, idx - 3), idx);
                const priorAvg = priorSlice.reduce((sum, item) => sum + item.amount, 0) / priorSlice.length;
                if (curr.amount >= priorAvg * 2.5) {
                    isAnomaly = true;
                }
            }

            results.push({
                txnId: curr.id,
                accountId: curr.accountId,
                amount: curr.amount,
                rolling3TxnAvg: Number(rollingAvg.toFixed(2)),
                status: isAnomaly ? 'ALERT_FRAUD_SPIKE' : 'VERIFIED_NORMAL'
            });
        });
    });

    return results;
}

// Sample Data
const mockTransactions = [
    { id: 'TX_01', accountId: 'ACC_900', amount: 1200, timestamp: 100 },
    { id: 'TX_02', accountId: 'ACC_900', amount: 1500, timestamp: 200 },
    { id: 'TX_03', accountId: 'ACC_900', amount: 1100, timestamp: 300 },
    { id: 'TX_04', accountId: 'ACC_900', amount: 9500, timestamp: 400 } // Anomaly
];
console.log(analyzeTransactionWindow(mockTransactions));
`,
        expectedOutput: 'Transactions annotated with rolling window averages and anomaly alerts.',
        explanation: 'SQL Window Functions calculate aggregates over related sets of rows without collapsing them into a single row, preserving individual ledger audit trails.'
      }
    ]
  },
  {
    id: 'assignment-dsa-lru-cache',
    title: 'Assignment 03: High-Performance O(1) LRU Cache Eviction Engine',
    subject: 'Data Structures & Algorithms',
    duration: 90,
    type: 'code',
    category: 'assignment',
    requireCamera: false,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    dueDate: '2026-12-09T23:59:59Z',
    rubric: [
      { criterion: 'Strict O(1) Time Complexity for GET & PUT', weight: 40 },
      { criterion: 'Doubly Linked List + Hash Map Node Wiring', weight: 30 },
      { criterion: 'Least Recently Used Eviction on Overflow', weight: 20 },
      { criterion: 'Clean Separation of Concerns & Types', weight: 10 }
    ],
    submissionModes: ['code', 'github', 'pdf'],
    questions: [
      {
        id: 'dsa_lru_q1',
        type: 'code',
        question: 'Implement an LRUCache class with capacity K. Support `get(key)` and `put(key, value)` both running in guaranteed O(1) average time complexity using a Doubly Linked List and Hash Table.',
        language: 'javascript',
        initialCode: `class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();
        // Dummy head and tail to eliminate null pointer checks
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    _insertAtHead(node) {
        node.next = this.head.next;
        node.next.prev = node;
        this.head.next = node;
        node.prev = this.head;
    }

    get(key) {
        if (!this.map.has(key)) return -1;
        const node = this.map.get(key);
        // Move to most recently used (head)
        this._remove(node);
        this._insertAtHead(node);
        return node.value;
    }

    put(key, value) {
        if (this.map.has(key)) {
            this._remove(this.map.get(key));
        }
        if (this.map.size >= this.capacity) {
            // Evict Least Recently Used (node before tail)
            const lru = this.tail.prev;
            this._remove(lru);
            this.map.delete(lru.key);
        }
        const newNode = new Node(key, value);
        this._insertAtHead(newNode);
        this.map.set(key, newNode);
    }
}

// Test Runner
const cache = new LRUCache(2);
cache.put(1, 100);
cache.put(2, 200);
console.log("Get 1:", cache.get(1)); // returns 100, moves 1 to MRU
cache.put(3, 300);                  // evicts key 2
console.log("Get 2 (should be -1):", cache.get(2)); // returns -1
console.log("Get 3:", cache.get(3)); // returns 300
`,
        expectedOutput: 'Get 1: 100, Get 2: -1, Get 3: 300',
        explanation: 'The combination of a Hash Map (for O(1) lookup) and a Doubly Linked List (for O(1) node detachment and insertion) fulfills the strict O(1) LRU specification.'
      }
    ]
  },
  {
    id: 'assignment-fullstack-jwt-microservice',
    title: 'Assignment 04: RESTful JWT Microservice with Dockerfile & Rate Limiter',
    subject: 'Cloud & Full-Stack Systems',
    duration: 120,
    type: 'code',
    category: 'assignment',
    requireCamera: false,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    dueDate: '2026-12-12T23:59:59Z',
    rubric: [
      { criterion: 'Token Bucket Rate Limiting Algorithm', weight: 40 },
      { criterion: 'HMAC Signature Verification & Claims Parsing', weight: 30 },
      { criterion: 'Production Dockerfile Multi-Stage Build', weight: 20 },
      { criterion: 'Error Handlers & HTTP 429 Status Codes', weight: 10 }
    ],
    submissionModes: ['code', 'github', 'pdf'],
    questions: [
      {
        id: 'jwt_q1',
        type: 'code',
        question: 'Implement a Token Bucket Rate Limiter middleware in JavaScript/Node that limits requests to 5 tokens per 10-second window, refilling at 0.5 tokens/sec.',
        language: 'javascript',
        initialCode: `// Token Bucket Rate Limiter Engine
class TokenBucketRateLimiter {
    constructor(capacity = 5, refillRatePerSec = 0.5) {
        this.capacity = capacity;
        this.refillRate = refillRatePerSec;
        this.buckets = new Map(); // IP -> { tokens, lastRefill }
    }

    _refill(bucket) {
        const now = Date.now();
        const elapsedSec = (now - bucket.lastRefill) / 1000;
        bucket.tokens = Math.min(this.capacity, bucket.tokens + elapsedSec * this.refillRate);
        bucket.lastRefill = now;
    }

    tryConsume(clientIp, cost = 1) {
        if (!this.buckets.has(clientIp)) {
            this.buckets.set(clientIp, {
                tokens: this.capacity,
                lastRefill: Date.now()
            });
        }

        const bucket = this.buckets.get(clientIp);
        this._refill(bucket);

        if (bucket.tokens >= cost) {
            bucket.tokens -= cost;
            return {
                allowed: true,
                remainingTokens: Math.floor(bucket.tokens),
                statusCode: 200
            };
        }

        const retryAfter = Math.ceil((cost - bucket.tokens) / this.refillRate);
        return {
            allowed: false,
            remainingTokens: 0,
            retryAfterSec: retryAfter,
            statusCode: 429 // Too Many Requests
        };
    }
}

// Verification Test
const limiter = new TokenBucketRateLimiter(3, 1);
const ip = '192.168.1.42';
console.log('Req 1:', limiter.tryConsume(ip));
console.log('Req 2:', limiter.tryConsume(ip));
console.log('Req 3:', limiter.tryConsume(ip));
console.log('Req 4 (Should be 429):', limiter.tryConsume(ip));
`,
        expectedOutput: 'Req 1-3 allowed (200), Req 4 rejected with HTTP 429 Too Many Requests.',
        explanation: 'Token bucket smoothly handles short bursts while enforcing a strict steady-state limit, making it ideal for API protection and microservice gateways.'
      }
    ]
  },
  {
    id: 'assignment-system-design-tinyurl',
    title: 'Assignment 05: High-Concurrency URL Shortener (Base62 & Distributed Sharding)',
    subject: 'System Architecture',
    duration: 120,
    type: 'code',
    category: 'assignment',
    requireCamera: false,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    dueDate: '2026-12-15T23:59:59Z',
    rubric: [
      { criterion: 'Base62 Bijective Encoding / Decoding Core', weight: 40 },
      { criterion: 'Collision Avoidance & Range Counter Strategy', weight: 30 },
      { criterion: 'Cache Lookup Layer (Redis 80-20 Rule)', weight: 20 },
      { criterion: 'System Architecture & Capacity Estimates', weight: 10 }
    ],
    submissionModes: ['code', 'github', 'pdf'],
    questions: [
      {
        id: 'sys_q1',
        type: 'code',
        question: 'Implement a Base62 Bijective Encoder/Decoder that turns a 64-bit auto-incrementing database ID into a compact 7-character alphanumeric short code, and reverses short codes back to database IDs.',
        language: 'javascript',
        initialCode: `// Base62 Bijective Codec for Distributed URL Shortener
const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeId(num) {
    if (num === 0) return BASE62_CHARS[0];
    let encoded = '';
    while (num > 0) {
        const remainder = num % 62;
        encoded = BASE62_CHARS[remainder] + encoded;
        num = Math.floor(num / 62);
    }
    // Pad to 7 characters for uniform URLs
    return encoded.padStart(7, '0');
}

function decodeShortCode(code) {
    let num = 0;
    const cleanCode = code.replace(/^0+/, ''); // strip padding
    for (let i = 0; i < cleanCode.length; i++) {
        const char = cleanCode[i];
        const index = BASE62_CHARS.indexOf(char);
        if (index === -1) throw new Error(\`Invalid Base62 character: \${char}\`);
        num = num * 62 + index;
    }
    return num;
}

// Verification Test
const dbId = 12530948572;
const shortCode = encodeId(dbId);
const recoveredId = decodeShortCode(shortCode);

console.log("Original Database ID:", dbId);
console.log("Short URL Code:", \`https://lumix.in/\${shortCode}\`);
console.log("Recovered ID:", recoveredId);
console.log("Lossless Integrity:", dbId === recoveredId);
`,
        expectedOutput: 'Original ID encoded to compact 7-char string and decoded losslessly back to exact ID.',
        explanation: 'Base62 encoding of 7 characters provides 62^7 = ~3.5 trillion unique URLs without hash collisions or random generation retries.'
      }
    ]
  }
];
