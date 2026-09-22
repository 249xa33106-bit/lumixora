// Default Comprehensive Assessment Suite for Vyomra Test Portal
export const DEFAULT_TESTS = [
  {
    id: 'test-dsa-mastery',
    title: 'Data Structures & Algorithms (DSA) Sprint',
    duration: 30,
    type: 'both',
    category: 'test',
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
        correct: 1
      },
      {
        id: 'dsa_q2',
        type: 'mcq',
        question: 'Which data structure is primarily used to implement Breadth-First Search (BFS) in a Graph?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Array List'],
        correct: 1
      },
      {
        id: 'dsa_q3',
        type: 'mcq',
        question: 'What happens when you push an element into a full static stack?',
        options: ['Stack Underflow', 'Stack Overflow', 'Segmentation Fault', 'Garbage Collection'],
        correct: 1
      },
      {
        id: 'dsa_q4',
        type: 'mcq',
        question: 'What is the space complexity of an in-place QuickSort algorithm?',
        options: ['O(1)', 'O(log N) for recursive call stack', 'O(N)', 'O(N^2)'],
        correct: 1
      },
      {
        id: 'dsa_q5',
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
        expectedOutput: 'Output the single maximum integer'
      }
    ]
  },
  {
    id: 'test-python-core',
    title: 'Python Programming & Logic Assessment',
    duration: 20,
    type: 'both',
    category: 'test',
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
        correct: 0
      },
      {
        id: 'py_q2',
        type: 'mcq',
        question: 'Which of the following data types is immutable in Python?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correct: 2
      },
      {
        id: 'py_q3',
        type: 'mcq',
        question: 'What is the time complexity of looking up a key in a standard Python dictionary (`dict`) on average?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correct: 0
      },
      {
        id: 'py_q4',
        type: 'code',
        question: 'Write a Python script that takes a space-separated string of words and prints the reversed sentence (word by word).',
        language: 'python',
        initialCode: `# Read input and print reversed words
s = input().strip()
words = s.split()
print(" ".join(reversed(words)))
`,
        expectedOutput: 'Reversed word sentence'
      }
    ]
  },
  {
    id: 'test-java-oops',
    title: 'Java OOPs & Multi-threading Challenge',
    duration: 25,
    type: 'quiz',
    category: 'test',
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
        correct: 1
      },
      {
        id: 'java_q2',
        type: 'mcq',
        question: 'Which memory area in the JVM is shared among all active threads?',
        options: ['JVM Stack', 'Program Counter (PC) Register', 'Heap Memory', 'Native Method Stack'],
        correct: 2
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
        correct: 1
      },
      {
        id: 'java_q4',
        type: 'mcq',
        question: 'Which keyword is used to explicitly throw an exception from inside a method body?',
        options: ['throws', 'throw', 'catch', 'finally'],
        correct: 1
      }
    ]
  },
  {
    id: 'test-web-react',
    title: 'Modern Web Development & React Architecture',
    duration: 20,
    type: 'both',
    category: 'test',
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
        correct: 1
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
        correct: 1
      },
      {
        id: 'react_q3',
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
        expectedOutput: '[2, 4, 8, 10]'
      }
    ]
  },
  {
    id: 'test-tcs-aptitude',
    title: 'TCS NQT Quantitative & Cognitive Aptitude Sprint',
    duration: 15,
    type: 'quiz',
    category: 'test',
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
        correct: 1
      },
      {
        id: 'apt_q2',
        type: 'mcq',
        question: 'If A:B = 2:3 and B:C = 4:5, what is the ratio A:B:C?',
        options: ['8:12:15', '2:4:5', '6:9:15', '8:10:15'],
        correct: 0
      },
      {
        id: 'apt_q3',
        type: 'mcq',
        question: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
        options: ['95', '127', '125', '129'],
        correct: 1
      },
      {
        id: 'apt_q4',
        type: 'mcq',
        question: 'Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:',
        options: ['12 minutes', '15 minutes', '25 minutes', '50 minutes'],
        correct: 0
      }
    ]
  },
  {
    id: 'test-c-pointers',
    title: 'C / C++ Pointers & Memory Management Diagnostic',
    duration: 20,
    type: 'both',
    category: 'test',
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
        correct: 1
      },
      {
        id: 'c_q2',
        type: 'mcq',
        question: 'What is the output of `sizeof(char*)` on a 64-bit operating system?',
        options: ['1 byte', '4 bytes', '8 bytes', '16 bytes'],
        correct: 2
      },
      {
        id: 'c_q3',
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
        expectedOutput: '20 10'
      }
    ]
  },
  {
    id: 'test-dbms-sql',
    title: 'DBMS, SQL Queries & Indexing Assessment',
    duration: 15,
    type: 'quiz',
    category: 'test',
    active: true,
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    resultsReleased: true,
    questions: [
      {
        id: 'db_q1',
        type: 'mcq',
        question: 'Which normal form eliminates transitive dependency on the primary key?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
        correct: 2
      },
      {
        id: 'db_q2',
        type: 'mcq',
        question: 'Which ACID property ensures that all transactions are completely executed or completely rolled back?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correct: 0
      },
      {
        id: 'db_q3',
        type: 'mcq',
        question: 'What type of index is created by default on the Primary Key column in relational databases like PostgreSQL and MySQL?',
        options: ['Hash Index', 'B-Tree / B+Tree Clustered Index', 'Bitmap Index', 'Full-Text Index'],
        correct: 1
      },
      {
        id: 'db_q4',
        type: 'mcq',
        question: 'Which SQL clause is used to filter group aggregations after the `GROUP BY` statement?',
        options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
        correct: 1
      }
    ]
  },
  {
    id: 'assignment-frontend-component',
    title: 'Assignment: Responsive Navigation & Dashboard Card',
    duration: 60,
    type: 'code',
    category: 'assignment',
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
        expectedOutput: 'Valid: true, Minutes left: ~45'
      }
    ]
  }
];
