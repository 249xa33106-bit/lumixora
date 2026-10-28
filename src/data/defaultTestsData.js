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
    title: 'Assignment: Responsive Navigation & Dashboard Card',
    duration: 60,
    type: 'code',
    category: 'assignment',
    requireCamera: false,
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
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
  }
];
