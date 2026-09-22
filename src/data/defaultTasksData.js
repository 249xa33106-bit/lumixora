// Complete Master Assigned Tasks Dataset for Vyomra Assigned Tasks Portal
// Features a 30-Day Complete Java Master Track: Absolute Beginner Basics to Advanced Production-Ready Java & DSA

export const DEFAULT_ASSIGNED_TASKS = [
  // =========================================================================
  // ☕ 30-DAY COMPLETE JAVA MASTER TRACK: ZERO TO ADVANCED & DSA
  // =========================================================================

  // --- PHASE 1: ABSOLUTE FUNDAMENTALS & SYNTAX (DAYS 1 - 5) ---
  {
    id: 'task-java-day1',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 1',
    title: 'Java Intro, JVM/JRE/JDK Internals, Bytecode & Hello World Anatomy',
    description: `### 🎯 Objectives & Deep Theory:
1. **The Java Philosophy**: "Write Once, Run Anywhere" (WORA). How \`javac\` compiles source code (\`.java\`) into intermediate bytecode (\`.class\`), which is executed platform-independently by the Java Virtual Machine (JVM).
2. **JDK vs JRE vs JVM**:
   - **JDK (Java Development Kit)**: Complete toolkit containing compiler (\`javac\`), debugger (\`jdb\`), archiver (\`jar\`), and JRE.
   - **JRE (Java Runtime Environment)**: JVM + Core Standard Libraries (\`rt.jar\`) needed to execute programs.
   - **JVM (Java Virtual Machine)**: Abstract computing machine that interprets and JIT-compiles bytecode into native machine instructions.
3. **Anatomy of a Hello World Class**:
   - \`public\`: Accessible everywhere by the JVM runtime.
   - \`class Main\`: Class declaration matching filename.
   - \`static\`: Method can be invoked without instantiating the class.
   - \`void\`: Returns no value.
   - \`main\`: Standard entry point identified by JVM.
   - \`String[] args\`: Command-line arguments passed as array of strings.
   - \`System.out.println()\`: \`System\` class in \`java.lang\`, \`out\` is static \`PrintStream\` field, \`println\` outputs with newline.`,
    codeReferences: `// Day 1: Hello World & Command Line Arguments Anatomy
public class Day1HelloWorld {
    public static void main(String[] args) {
        System.out.println("Welcome to Vyomra Java Master Track!");

        // Printing command-line parameters
        if (args.length > 0) {
            System.out.println("Command line argument received: " + args[0]);
        } else {
            System.out.println("No CLI arguments provided. Running default profile.");
        }

        // Displaying active Java Runtime Environment details
        System.out.println("Java Specification Version: " + System.getProperty("java.version"));
        System.out.println("JVM Architecture: " + System.getProperty("os.arch"));
    }
}`,
    practiceProblems: `1. **Execution Steps**: Write down the exact terminal commands to compile (\`javac\`) and execute (\`java\`) a multi-word CLI program with parameters.
2. **Signature Variations**: Test what happens if \`static\` and \`public\` swap positions, or if \`String[] args\` is written as \`String args[]\` or \`String... args\`.
3. **Coding Exercise**: Write a Java program to print your College Name, Department, Roll Number, and Semester using formatted \`System.out.printf()\`.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day2',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 2',
    title: 'Data Types, Variable Scopes, Type Casting & Integer Cache Mechanics',
    description: `### 🎯 Objectives & Deep Theory:
1. **8 Primitive Data Types & Memory Footprint**:
   - \`byte\`: 1 Byte (8 bits, -128 to 127)
   - \`short\`: 2 Bytes (16 bits, -32,768 to 32,767)
   - \`int\`: 4 Bytes (32 bits, -2^31 to 2^31-1)
   - \`long\`: 8 Bytes (64 bits, -2^63 to 2^63-1, suffix \`L\`)
   - \`float\`: 4 Bytes (IEEE 754 single precision, suffix \`f\`)
   - \`double\`: 8 Bytes (IEEE 754 double precision, default)
   - \`char\`: 2 Bytes (16-bit Unicode characters \`\\u0000\` to \`\\uFFFF\`)
   - \`boolean\`: 1 bit logical (JVM-dependent in arrays)
2. **Type Casting**:
   - **Widening (Implicit/Automatic)**: \`byte\` &rarr; \`short\` &rarr; \`char\` &rarr; \`int\` &rarr; \`long\` &rarr; \`float\` &rarr; \`double\` (no precision loss).
   - **Narrowing (Explicit/Manual)**: Potential data loss and integer overflow/underflow truncation.
3. **Variable Scopes**: Local variables (Stack), Instance variables (Heap), and Static variables (Metaspace).
4. **Integer Cache Pool**: \`Integer.valueOf()\` caches objects in range \`[-128, 127]\`.`,
    codeReferences: `public class Day2DataTypesAndCasting {
    // Static variable (Stored in Metaspace)
    static int platformScholarCount = 100;

    // Instance variable (Stored in Heap with object)
    double scholarCGPA = 9.4;

    public static void main(String[] args) {
        // Local variable (Stored on Stack Frame)
        int initialMarks = 130;

        // Widening Casting (int to double - automatic)
        double accurateMarks = initialMarks;
        System.out.println("Widened double value: " + accurateMarks);

        // Narrowing Casting (int to byte - overflow wrap-around)
        byte truncatedByte = (byte) initialMarks; 
        System.out.println("Narrowed byte value (130 overflows): " + truncatedByte); // -126

        // Autoboxing & Integer Cache Range [-128 to 127]
        Integer num1 = 100, num2 = 100;
        System.out.println("Integer Cache Equality (100 == 100): " + (num1 == num2)); // true

        Integer num3 = 300, num4 = 300;
        System.out.println("Heap Reference Divergence (300 == 300): " + (num3 == num4)); // false
        System.out.println("Value Equality (num3.equals(num4)): " + num3.equals(num4)); // true
    }
}`,
    practiceProblems: `1. **Overflow Predictor**: Calculate the output of \`byte b = (byte) 260;\` without running the compiler, and explain the binary 2's complement math.
2. **Precision Trap**: Explain why \`0.1 + 0.2 != 0.3\` in Java floating-point arithmetic and how \`BigDecimal\` fixes it in financial apps.
3. **Coding Exercise**: Write a program that accepts user input in seconds and converts it into Days, Hours, Minutes, and Seconds using integer arithmetic.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day3',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 3',
    title: 'Operators, Bitwise Manipulations & Bitmasking Techniques',
    description: `### 🎯 Objectives & Deep Theory:
1. **Operator Categories**:
   - Arithmetic: \`+\`, \`-\`, \`*\`, \`/\`, \`%\`
   - Unary: \`++\`, \`--\`, \`+\`, \`-\`, \`!\`, \`~\` (Pre-increment vs Post-increment)
   - Relational: \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`
   - Logical: Short-circuit AND (\`&&\`), Short-circuit OR (\`||\`)
   - Ternary: \`condition ? expr1 : expr2\`
2. **Bitwise Operations (High-Performance Manipulation)**:
   - AND (\`&\`): Clears bits.
   - OR (\`|\`): Sets bits.
   - XOR (\`^\`): Toggles bits; \`a ^ a = 0\`, \`a ^ 0 = a\`.
   - Left Shift (\`<<\`): Multiplies by 2^k.
   - Signed Right Shift (\`>>\`): Divides by 2^k, preserving sign bit.
   - Unsigned Right Shift (\`>>>\`): Shifts in zeroes regardless of sign.
3. **Core Bit Hacks for Technical Interviews**:
   - Check if Odd/Even: \`(n & 1) == 1\`
   - Check if Power of 2: \`(n > 0) && ((n & (n - 1)) == 0)\`
   - Brian Kernighan's Algorithm to count set bits in O(set_bits).`,
    codeReferences: `public class Day3OperatorsAndBits {
    // Brian Kernighan's Algorithm: Count number of set bits (1s)
    public static int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            n = n & (n - 1); // Clears the lowest set bit
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        // Post vs Pre Increment
        int a = 5;
        int b = a++ + ++a; // 5 + 7 = 12
        System.out.println("Result of (a++ + ++a): " + b + ", Final a: " + a);

        // Bitwise Swapping without 3rd variable
        int x = 15, y = 25;
        System.out.println("Before swap: x=" + x + ", y=" + y);
        x = x ^ y;
        y = x ^ y;
        x = x ^ y;
        System.out.println("After XOR swap: x=" + x + ", y=" + y);

        // Bitwise Power of Two check
        int num = 64;
        boolean isPowerOfTwo = (num > 0) && ((num & (num - 1)) == 0);
        System.out.println(num + " is power of 2: " + isPowerOfTwo);
    }
}`,
    practiceProblems: `1. **LeetCode #136 (Single Number)**: Find the single element in an array where every other element appears twice in O(N) time and O(1) space.
2. **LeetCode #191 (Number of 1 Bits)**: Calculate the Hamming weight of an integer using bitwise right shifts.
3. **Bit Range Subsets**: Generate all 2^N subsets (Power Set) of an integer array using bitmasking from \`0\` to \`(1 << N) - 1\`.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day4',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 4',
    title: 'Control Flow, Conditionals & Enhanced Switch Expressions (Java 14+)',
    description: `### 🎯 Objectives & Deep Theory:
1. **Decision Making**: \`if\`, \`if-else\`, \`else-if\` ladders, and nested conditionals.
2. **Switch Statement Evolution**:
   - Traditional \`switch\`: Required explicit \`break\` statements to prevent dangerous fall-through bugs.
   - **Java 14+ Enhanced Switch Expressions**: Arrow syntax (\`->\`), comma-separated multiple matching values, no fall-through by default, and \`yield\` keyword for returning values from code blocks.
3. **Pattern Matching for Switch (Java 17/21 Preview)**: Handling polymorphic object types directly in switch blocks.`,
    codeReferences: `public class Day4ControlFlowAndSwitch {
    // Java 14+ Enhanced Switch Expression
    public static String getPlacementTier(int ctcLPA) {
        return switch (ctcLPA) {
            case 3, 4, 5 -> "Mass Recruiter / Standard Tier";
            case 6, 7, 8, 9 -> "Product Specialist / Prime Tier";
            case 10, 11, 12, 13, 14, 15 -> "Dream Offer / Super Dream Tier";
            default -> {
                if (ctcLPA > 15) {
                    yield "Marquee Tier-1 Placement (FAANG / Top MNC)";
                } else {
                    yield "Entry Intern Assessment";
                }
            }
        };
    }

    public static void main(String[] args) {
        int studentPackage = 32;
        System.out.println("Offer Classification: " + getPlacementTier(studentPackage));
        
        // Leap Year Evaluation Logic
        int year = 2024;
        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        System.out.println(year + " is leap year: " + isLeap);
    }
}`,
    practiceProblems: `1. **Menu-Driven Calculator**: Build a comprehensive calculator CLI using Java 14+ switch expressions supporting standard math and logarithmic operations.
2. **Electricity Bill Generator**: Calculate domestic tariff slabs based on dynamic unit consumption with tiered percentage surcharges.
3. **Rock-Paper-Scissors**: Implement game logic using enhanced switch expressions returning Round Outcomes.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day5',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 5',
    title: 'Loops, Iteration Mechanics, Labeled Jumps & 10 Classic Pattern Printing Problems',
    description: `### 🎯 Objectives & Deep Theory:
1. **Loop Construct Internals**:
   - \`for\` loop: Deterministic iteration with initialization, condition, and update expressions.
   - \`while\` loop: Pre-test condition-driven loop.
   - \`do-while\` loop: Post-test loop guaranteed to execute at least once.
   - **Enhanced for-each loop**: Syntactic sugar over \`Iterable\` and array indexing.
2. **Labeled Break & Continue**: Jumping out of deeply nested multi-level loops without complex boolean flags.
3. **Matrix Coordinate Mapping for Pattern Printing**: Deriving mathematical formulas for rows and columns \`f(r, c)\` for symmetric and hollow structures.`,
    codeReferences: `public class Day5LoopsAndPatterns {
    // 1. Symmetric Hollow Diamond Pattern
    public static void printHollowDiamond(int n) {
        // Upper Half
        for (int i = 1; i <= n; i++) {
            for (int s = 1; s <= n - i; s++) System.out.print(" ");
            for (int j = 1; j <= 2 * i - 1; j++) {
                if (j == 1 || j == 2 * i - 1) System.out.print("*");
                else System.out.print(" ");
            }
            System.out.println();
        }
        // Lower Half
        for (int i = n - 1; i >= 1; i--) {
            for (int s = 1; s <= n - i; s++) System.out.print(" ");
            for (int j = 1; j <= 2 * i - 1; j++) {
                if (j == 1 || j == 2 * i - 1) System.out.print("*");
                else System.out.print(" ");
            }
            System.out.println();
        }
    }

    // 2. Labeled Break Demonstration
    public static void searchMatrix(int[][] matrix, int target) {
        searchBlock:
        for (int r = 0; r < matrix.length; r++) {
            for (int c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] == target) {
                    System.out.println("Found " + target + " at [" + r + ", " + c + "]");
                    break searchBlock; // Exits both loops immediately
                }
            }
        }
    }

    public static void main(String[] args) {
        printHollowDiamond(5);
        int[][] grid = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        searchMatrix(grid, 5);
    }
}`,
    practiceProblems: `1. **Pascal's Triangle (LeetCode #118)**: Print and return the first N rows of Pascal's triangle using combination formulas.
2. **Spiral Matrix Numbers**: Print an N x N matrix filled from 1 to N^2 in concentric clockwise spirals.
3. **Floyd's Triangle & Binary Alternating Triangle**: Print alternating 0-1 triangles using coordinate parity \`(row + col) % 2\`.`,
    createdAt: new Date().toISOString()
  },

  // --- PHASE 2: CORE DATA STRUCTURES & STRINGS (DAYS 6 - 9) ---
  {
    id: 'task-java-day6',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 6',
    title: 'Methods, Pass-By-Value Internals, Varargs & Recursion Fundamentals',
    description: `### 🎯 Objectives & Deep Theory:
1. **Pass-by-Value in Java**:
   - **Myth**: "Java passes objects by reference."
   - **Fact**: Java is **STRICTLY PASS-BY-VALUE AT ALL TIMES**.
   - For primitives: The actual value is copied to the method stack frame.
   - For objects: The **memory reference address** is copied by value. Reassigning the pointer inside the method does NOT affect the caller's reference.
2. **Variable-Length Arguments (\`varargs\`)**: \`public void printAll(String... items)\` internally treated as an array.
3. **Recursion & Call Stack Frames**: Base cases, recursive steps, and preventing \`StackOverflowError\`.`,
    codeReferences: `public class Day6MethodsAndRecursion {
    // Demonstration of Java's Strict Pass-By-Value Mechanism
    static class StudentBox {
        String name;
        StudentBox(String name) { this.name = name; }
    }

    public static void modifyReference(StudentBox s) {
        // Mutating the object via the copied pointer (Visible to caller)
        s.name = "Updated by Pointer";
        
        // Reassigning local pointer to a new heap object (NOT visible to caller)
        s = new StudentBox("New Phantom Student");
    }

    // Tail-Recursive GCD (Euclid's Algorithm)
    public static int computeGCD(int a, int b) {
        if (b == 0) return a;
        return computeGCD(b, a % b);
    }

    public static void main(String[] args) {
        StudentBox student = new StudentBox("Original Scholar");
        modifyReference(student);
        System.out.println("Student Name after method call: " + student.name); // "Updated by Pointer"

        System.out.println("GCD of 48 and 18: " + computeGCD(48, 18)); // 6
    }
}`,
    practiceProblems: `1. **Tower of Hanoi**: Implement the recursive solution for N disks and print the step-by-step peg transitions in O(2^N).
2. **LeetCode #50 (Pow(x, n))**: Implement binary exponentiation recursively in O(log N) time.
3. **Swap Test**: Write a method that attempts to swap two integer objects and explain why the original variables remain unswapped.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day7',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 7',
    title: '1D Arrays, Contiguous Memory, Kadane’s Algorithm & Two-Pointer Strategy',
    description: `### 🎯 Objectives & Deep Theory:
1. **Array Mechanics**: Fixed-size contiguous memory allocation on the Heap with O(1) random index access \`arr[i]\`.
2. **Cache Locality**: Sequential array scans trigger hardware prefetching into L1/L2 CPU caches.
3. **Core Algorithmic Paradigms**:
   - **Two-Pointer Technique**: Converging pointers for sorted arrays (e.g., Two Sum, Palindrome verification).
   - **Sliding Window**: Subarray sum/length optimizations in O(N).
   - **Kadane's Algorithm**: Maximum contiguous subarray sum in O(N) time and O(1) space.`,
    codeReferences: `public class Day7ArraysAndAlgorithms {
    // 1. Kadane's Algorithm for Maximum Subarray Sum - O(N) Time, O(1) Space
    public static int maxSubarraySum(int[] nums) {
        int maxGlobal = nums[0], currentMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentMax = Math.max(nums[i], currentMax + nums[i]);
            maxGlobal = Math.max(maxGlobal, currentMax);
        }
        return maxGlobal;
    }

    // 2. Two-Pointer: Two Sum on Sorted Array (LeetCode #167)
    public static int[] twoSumSorted(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return new int[]{left + 1, right + 1};
            else if (sum < target) left++;
            else right--;
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        int[] arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println("Maximum Contiguous Subarray Sum: " + maxSubarraySum(arr)); // 6 [4, -1, 2, 1]
    }
}`,
    practiceProblems: `1. **LeetCode #53 (Maximum Subarray)**: Implement Kadane's algorithm and also output the starting and ending indices of the max subarray.
2. **LeetCode #11 (Container With Most Water)**: Solve using the converging two-pointer technique in O(N).
3. **LeetCode #75 (Sort Colors / Dutch National Flag)**: Sort an array of 0s, 1s, and 2s in-place in a single linear pass.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day8',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 8',
    title: '2D Arrays, Matrix Manipulations, In-Place Rotations & Spiral Traversal',
    description: `### 🎯 Objectives & Deep Theory:
1. **Multi-Dimensional Arrays**: In Java, 2D arrays are "arrays of array objects" (Jagged Arrays supported where row lengths vary).
2. **Matrix Transposition**: Swapping \`matrix[i][j]\` with \`matrix[j][i]\` for \`j > i\`.
3. **In-Place 90° Clockwise Rotation**: Transpose Matrix + Reverse every row horizontally (Zero auxiliary space).
4. **Boundary Shrinking Algorithm**: Traversing matrices in spiral boundary order using 4 boundary pointers (\`top\`, \`bottom\`, \`left\`, \`right\`).`,
    codeReferences: `import java.util.*;

public class Day8MatrixAlgorithms {
    // 1. In-Place 90-Degree Clockwise Matrix Rotation (LeetCode #48)
    public static void rotateMatrix(int[][] matrix) {
        int n = matrix.length;
        // Step 1: Transpose matrix
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        // Step 2: Reverse each row horizontally
        for (int i = 0; i < n; i++) {
            int left = 0, right = n - 1;
            while (left < right) {
                int temp = matrix[i][left];
                matrix[i][left] = matrix[i][right];
                matrix[i][right] = temp;
                left++;
                right--;
            }
        }
    }

    // 2. Spiral Matrix Traversal (LeetCode #54)
    public static List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix.length == 0) return result;
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {
            for (int i = left; i <= right; i++) result.add(matrix[top][i]);
            top++;
            for (int i = top; i <= bottom; i++) result.add(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int i = right; i >= left; i--) result.add(matrix[bottom][i]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) result.add(matrix[i][left]);
                left++;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[][] matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        System.out.println("Spiral Order: " + spiralOrder(matrix));
    }
}`,
    practiceProblems: `1. **LeetCode #48 (Rotate Image)**: Rotate an N x N matrix 90 degrees clockwise in-place.
2. **LeetCode #73 (Set Matrix Zeroes)**: If an element is 0, set its entire row and column to 0 in O(1) space.
3. **LeetCode #240 (Search a 2D Matrix II)**: Search for a target in an M x N matrix sorted row-wise and column-wise in O(M + N).`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day9',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 9',
    title: 'Strings, String Immutability, String Constant Pool (SCP) & StringBuilder',
    description: `### 🎯 Objectives & Deep Theory:
1. **Why Strings are Immutable in Java**:
   - **Security**: Parameters like database connection URLs, network ports, and file paths cannot be altered maliciously.
   - **Thread Safety**: Multiple threads can share string instances without synchronization locks.
   - **String Constant Pool (SCP)**: Memory optimization where identical string literals share a single heap reference.
2. **\`String\` vs \`StringBuilder\` vs \`StringBuffer\`**:
   - \`String\`: Immutable; string concatenation in loops creates O(N^2) garbage objects.
   - \`StringBuilder\`: Mutable, unsynchronized, optimal single-threaded performance.
   - \`StringBuffer\`: Mutable, thread-safe with synchronized methods (slower).
3. **\`intern()\` Method**: Explicitly places string into the SCP and returns its canonical reference.`,
    codeReferences: `public class Day9StringDeepDive {
    public static void main(String[] args) {
        // String Constant Pool Mechanics
        String s1 = "Vyomra";
        String s2 = "Vyomra";
        String s3 = new String("Vyomra");

        System.out.println("s1 == s2 (SCP Reference): " + (s1 == s2)); // true
        System.out.println("s1 == s3 (Heap Object): " + (s1 == s3)); // false
        System.out.println("s1 == s3.intern() (Canonical): " + (s1 == s3.intern())); // true

        // StringBuilder High-Speed Concatenation
        long start = System.currentTimeMillis();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 50000; i++) {
            sb.append("A");
        }
        System.out.println("50,000 appends completed in: " + (System.currentTimeMillis() - start) + " ms");
    }

    // Longest Substring Without Repeating Characters (LeetCode #3)
    public static int lengthOfLongestSubstring(String s) {
        int[] lastSeen = new int[128];
        java.util.Arrays.fill(lastSeen, -1);
        int maxLen = 0, start = 0;

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (lastSeen[c] >= start) {
                start = lastSeen[c] + 1;
            }
            lastSeen[c] = i;
            maxLen = Math.max(maxLen, i - start + 1);
        }
        return maxLen;
    }
}`,
    practiceProblems: `1. **LeetCode #3 (Longest Substring Without Repeating Characters)**: Implement using Sliding Window in O(N) time.
2. **LeetCode #5 (Longest Palindromic Substring)**: Expand around center approach in O(N^2) time and O(1) space.
3. **LeetCode #49 (Group Anagrams)**: Group anagrams using character frequency arrays or sorted string keys.`,
    createdAt: new Date().toISOString()
  },

  // --- PHASE 3: OBJECT-ORIENTED PROGRAMMING (OOP) DEEP DIVE (DAYS 10 - 15) ---
  {
    id: 'task-java-day10',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 10',
    title: 'OOP Fundamentals: Classes, Objects, Static Members & JVM Metaspace',
    description: `### 🎯 Objectives & Deep Theory:
1. **Class as a Blueprint & Objects as Concrete Instances**: State (fields) and Behavior (methods).
2. **Static vs Instance Members**:
   - **Instance Members**: Allocated on the Heap with each \`new\` object instantiation.
   - **Static Members**: Belong to the class itself, loaded once in the **Metaspace (Method Area)** when the class is loaded by JVM ClassLoader.
3. **Static Initialization Blocks**: Execute once when class bytecode is loaded into memory, prior to any object instantiation or main() execution.`,
    codeReferences: `public class Day10OOPClassesAndStatic {
    static class UniversityPortal {
        // Instance variables (Per object on Heap)
        private String scholarId;
        private String scholarName;

        // Static variables (Shared across all objects in Metaspace)
        public static String instituteName;
        public static int totalRegistered = 0;

        // Static Block: Runs once when ClassLoader loads UniversityPortal
        static {
            instituteName = "Autonomous Engineering Institute";
            System.out.println("[METASPACE] Static block initialized for UniversityPortal.");
        }

        // Instance Initialization Block: Runs before constructor on each instantiation
        {
            totalRegistered++;
        }

        public UniversityPortal(String scholarId, String scholarName) {
            this.scholarId = scholarId;
            this.scholarName = scholarName;
        }

        public void printScholar() {
            System.out.println("ID: " + scholarId + " | Name: " + scholarName + " | College: " + instituteName);
        }
    }

    public static void main(String[] args) {
        UniversityPortal s1 = new UniversityPortal("249XA33106", "Mohammed");
        UniversityPortal s2 = new UniversityPortal("229X1A0501", "Rahul");

        s1.printScholar();
        s2.printScholar();
        System.out.println("Total Registered Scholars: " + UniversityPortal.totalRegistered);
    }
}`,
    practiceProblems: `1. **Execution Order Trace**: Trace the exact output order of Static Blocks, Instance Blocks, Static Methods, and Constructors across Parent and Child classes.
2. **Singleton Design Pattern**: Implement a thread-safe Bill Pugh Singleton class using a static inner helper class.
3. **Static Method Hiding**: Explain why static methods cannot be overridden dynamically and how method hiding operates under JVM.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day11',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 11',
    title: 'Constructors, Constructor Chaining (this), Deep Copy vs Shallow Copy',
    description: `### 🎯 Objectives & Deep Theory:
1. **Constructors in Java**: Special methods matching class name with no return type used to initialize object state.
2. **Constructor Chaining**:
   - \`this(...)\`: Calls another overloaded constructor within the same class (MUST be the first statement).
   - \`super(...)\`: Calls the immediate parent class constructor (MUST be the first statement).
3. **Shallow Copy vs Deep Copy**:
   - **Shallow Copy**: Copies primitive values but duplicates reference addresses for nested objects (mutations affect both).
   - **Deep Copy**: Recursively creates new independent instances of all nested objects.`,
    codeReferences: `public class Day11ConstructorsAndCloning {
    static class Address {
        String city;
        Address(String city) { this.city = city; }
    }

    static class StudentProfile {
        String name;
        Address address;

        // Default Constructor chaining to parameterized constructor
        public StudentProfile() {
            this("Anonymous Scholar", new Address("Hyderabad"));
        }

        public StudentProfile(String name, Address address) {
            this.name = name;
            this.address = address;
        }

        // Deep Copy Constructor
        public StudentProfile(StudentProfile other) {
            this.name = other.name;
            // Create a completely new independent Address object
            this.address = new Address(other.address.city);
        }
    }

    public static void main(String[] args) {
        StudentProfile s1 = new StudentProfile("Mohammed", new Address("Kurnool"));
        
        // Deep copy instantiation
        StudentProfile s2 = new StudentProfile(s1);
        s2.address.city = "Bengaluru"; // Modifying s2 address

        System.out.println("s1 City: " + s1.address.city); // "Kurnool" (Unaffected!)
        System.out.println("s2 City: " + s2.address.city); // "Bengaluru"
    }
}`,
    practiceProblems: `1. **Build a Complex Bank Account Hierarchy**: Implement an account class with 4 overloaded constructors handling various KYC documents using \`this(...)\` chaining.
2. **Cloneable Interface & \`clone()\`**: Implement \`Cloneable\` on an \`Order\` object containing a \`List<Item>\` and override \`clone()\` for deep copying.
3. **Private Constructor**: Explain 3 use cases of private constructors in Java (Utility classes, Singleton pattern, Builder pattern).`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day12',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 12',
    title: 'Inheritance (IS-A), Super Keyword & The Diamond Problem Prevention',
    description: `### 🎯 Objectives & Deep Theory:
1. **Inheritance Models**:
   - Single Inheritance (\`class B extends A\`)
   - Multilevel Inheritance (\`class C extends B extends A\`)
   - Hierarchical Inheritance (\`class B extends A\`, \`class C extends A\`)
   - **Multiple Inheritance via Classes is FORBIDDEN** in Java to prevent the **Diamond Problem** (ambiguity in resolving inherited methods).
2. **The \`super\` Keyword**:
   - \`super(...)\`: Invokes parent class constructor.
   - \`super.variable\` / \`super.method()\`: Accesses hidden parent attributes or overridden methods.`,
    codeReferences: `// Inheritance Hierarchy & Super Keyword Demonstration
class Vehicle {
    protected String brand;
    protected int maxSpeed;

    public Vehicle(String brand, int maxSpeed) {
        this.brand = brand;
        this.maxSpeed = maxSpeed;
    }

    public void startEngine() {
        System.out.println(brand + " generic vehicle ignition started.");
    }
}

class ElectricSuperCar extends Vehicle {
    private int batteryCapacityKWh;

    public ElectricSuperCar(String brand, int maxSpeed, int batteryCapacityKWh) {
        super(brand, maxSpeed); // Explicitly invoke parent constructor
        this.batteryCapacityKWh = batteryCapacityKWh;
    }

    @Override
    public void startEngine() {
        super.startEngine(); // Call parent logic
        System.out.println(brand + " EV silent drive engaged with " + batteryCapacityKWh + " kWh battery.");
    }
}

public class Day12InheritanceDemo {
    public static void main(String[] args) {
        ElectricSuperCar ev = new ElectricSuperCar("Tesla", 250, 100);
        ev.startEngine();
    }
}`,
    practiceProblems: `1. **Design an Academic Hierarchy**: Create base class \`Person\`, derived class \`Faculty\`, and further derived class \`DepartmentHead\` with constructor chaining across all levels.
2. **Object Class Inheritance**: Explain why every class in Java implicitly inherits from \`java.lang.Object\` and what methods are inherited (\`equals\`, \`hashCode\`, \`toString\`, \`getClass\`, \`wait\`, \`notify\`).
3. **Final Classes & Methods**: Demonstrate how declaring a class \`final\` prevents inheritance and declaring a method \`final\` prevents method overriding.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day13',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 13',
    title: 'Polymorphism: Compile-Time vs Runtime (Dynamic Method Dispatch & Virtual Method Tables)',
    description: `### 🎯 Objectives & Deep Theory:
1. **Compile-Time Polymorphism (Static Binding / Early Binding)**:
   - Method Overloading: Same method name with different parameters (count, type, or order).
   - Resolved by the compiler at compile time based on reference type.
2. **Runtime Polymorphism (Dynamic Binding / Late Binding)**:
   - Method Overriding: Child class provides specific implementation of parent method with identical signature and return type (or covariant return type).
   - **Dynamic Method Dispatch**: JVM resolves which method to invoke at runtime based on the actual object instance on the heap using a **Virtual Method Table (vtable)**.
3. **Upcasting vs Downcasting**:
   - Upcasting (\`Parent p = new Child()\`) is safe and automatic.
   - Downcasting (\`Child c = (Child) p\`) requires explicit casting and should be guarded by \`instanceof\`.`,
    codeReferences: `// Runtime Polymorphism & Dynamic Method Dispatch
class NotificationService {
    public void sendAlert(String message) {
        System.out.println("Generic System Alert: " + message);
    }
}

class WhatsAppNotifier extends NotificationService {
    @Override
    public void sendAlert(String message) {
        System.out.println("💬 [WhatsApp API Gateway] Message Delivered: " + message);
    }
}

class EmailNotifier extends NotificationService {
    @Override
    public void sendAlert(String message) {
        System.out.println("📧 [SMTP Mail Server] Email Sent: " + message);
    }
}

public class Day13Polymorphism {
    public static void triggerNotification(NotificationService service, String msg) {
        // Dynamic Method Dispatch: JVM checks vtable of actual runtime object
        service.sendAlert(msg);
    }

    public static void main(String[] args) {
        NotificationService wa = new WhatsAppNotifier();
        NotificationService email = new EmailNotifier();

        triggerNotification(wa, "Your Vyomra Test is Scheduled!");
        triggerNotification(email, "Semester Admit Card Released.");
    }
}`,
    practiceProblems: `1. **Design a Geometric Area Calculator**: Create an abstract parent \`Shape\` with \`calculateArea()\` overridden by \`Circle\`, \`Rectangle\`, and \`Triangle\`.
2. **Covariant Return Types**: Write a program where a subclass method overrides a parent method returning a subtype of the parent method's return type.
3. **Pattern Matching with \`instanceof\` (Java 16+)**: Refactor legacy \`if (obj instanceof String) { String s = (String) obj; }\` into modern \`if (obj instanceof String s)\`.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day14',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 14',
    title: 'Abstraction, Abstract Classes, Interfaces & Default/Static/Private Methods (Java 8/9+)',
    description: `### 🎯 Objectives & Deep Theory:
1. **Abstract Classes vs Interfaces**:
   - **Abstract Class**: Partial abstraction (0-100%), can have instance fields, constructors, and state.
   - **Interface**: Pure contract, achieves 100% abstraction (prior to Java 8), supports multiple inheritance.
2. **Java 8+ Interface Modernization**:
   - \`default\` methods: Add new functionality to interfaces without breaking implementing classes.
   - \`static\` methods: Utility functions within interface namespace.
3. **Java 9+ Private Interface Methods**: Share common helper code between default interface methods without exposing them publicly.`,
    codeReferences: `// Modern Interface with Default, Static & Private Methods
interface DatabaseConnector {
    // Abstract contract
    void connect();

    // Default method (Java 8+)
    default void logTransaction(String query) {
        auditLog("INFO", query);
    }

    // Static helper method (Java 8+)
    static boolean isPostgreSQLDriverAvailable() {
        return true;
    }

    // Private helper method (Java 9+)
    private void auditLog(String level, String msg) {
        System.out.println("[" + level + "] " + System.currentTimeMillis() + " - " + msg);
    }
}

class PostgreSQLAdapter implements DatabaseConnector {
    @Override
    public void connect() {
        System.out.println("PostgreSQL Connection Pool Established.");
    }
}

public class Day14Abstraction {
    public static void main(String[] args) {
        DatabaseConnector db = new PostgreSQLAdapter();
        db.connect();
        db.logTransaction("SELECT * FROM scholars WHERE cgpa >= 9.0;");
    }
}`,
    practiceProblems: `1. **Resolve Interface Diamond Conflict**: Implement two interfaces having identical \`default void show()\` signatures and resolve ambiguity using \`InterfaceName.super.show()\`.
2. **Design an Payment Processing Engine**: Create interface \`PaymentGateway\` implemented by \`UPI\`, \`Razorpay\`, and \`Stripe\` with default refund handlers.
3. **Marker Interfaces**: Explain the architectural purpose of \`Serializable\`, \`Cloneable\`, and \`RandomAccess\` marker interfaces.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day15',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 15',
    title: 'Encapsulation, Access Modifiers, Immutable Objects & Java 16+ Records',
    description: `### 🎯 Objectives & Deep Theory:
1. **Access Modifiers Scope Matrix**:
   - \`private\`: Class only.
   - \`default\` (no modifier): Package-private (same package only).
   - \`protected\`: Same package + Subclasses in other packages.
   - \`public\`: Globally accessible.
2. **Creating Truly Immutable Classes in Java**:
   - Declare class \`final\`.
   - All fields \`private final\`.
   - No setter methods.
   - Deep copy / clone mutable objects passed into constructors and returned from getters.
3. **Java 16+ Record Classes**: Data-carrier classes with automated canonical constructors, \`equals()\`, \`hashCode()\`, and \`toString()\`.`,
    codeReferences: `// Java 16+ Immutable Record
public record PlacementOfferRecord(
    String studentName,
    String rollNumber,
    String company,
    double packageLPA
) {
    // Compact constructor with validation
    public PlacementOfferRecord {
        if (packageLPA <= 0) {
            throw new IllegalArgumentException("Package LPA must be positive.");
        }
    }

    public boolean isSuperDreamOffer() {
        return packageLPA >= 10.0;
    }
}

class Day15RecordsAndEncapsulation {
    public static void main(String[] args) {
        PlacementOfferRecord offer = new PlacementOfferRecord("Mohammed", "249XA33106", "Amazon", 32.5);
        System.out.println(offer);
        System.out.println("Company: " + offer.company());
        System.out.println("Is Super Dream: " + offer.isSuperDreamOffer());
    }
}`,
    practiceProblems: `1. **Write a Truly Immutable Student Object**: Create an immutable class with fields \`String name\` and \`List<Double> semMarks\` ensuring the external list cannot mutate internal state.
2. **Refactor Legacy Java Bean**: Convert a 120-line POJO with 10 fields, getters, setters, equals, and hashCode into a 6-line Java Record.
3. **Package Boundary Encapsulation**: Demonstrate access restriction where a class in \`com.lumixora.auth\` cannot access package-private methods in \`com.lumixora.core\`.`,
    createdAt: new Date().toISOString()
  },

  // --- PHASE 4: ROBUST APPLICATION ENGINEERING (DAYS 16 - 18) ---
  {
    id: 'task-java-day16',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 16',
    title: 'Exception Handling: Throwable Hierarchy, Checked vs Unchecked & Multi-Catch',
    description: `### 🎯 Objectives & Deep Theory:
1. **Throwable Hierarchy**:
   - \`Throwable\` &rarr; \`Error\` (JVM Fatal: OutOfMemoryError, StackOverflowError) vs \`Exception\`.
   - **Checked Exceptions**: Subclasses of \`Exception\` (except \`RuntimeException\`) checked at compile-time (\`IOException\`, \`SQLException\`, \`ClassNotFoundException\`).
   - **Unchecked (Runtime) Exceptions**: Subclasses of \`RuntimeException\` (\`NullPointerException\`, \`ArithmeticException\`, \`ArrayIndexOutOfBoundsException\`).
2. **The \`try-catch-finally\` Paradigm**:
   - \`try\`: Code that may throw exceptions.
   - \`catch\`: Specific exception handler blocks (ordered from specific to general).
   - \`finally\`: Code guaranteed to execute for cleanup regardless of exception or return statements.
3. **Multi-Catch (Java 7+)**: Catching multiple unrelated exceptions in a single \`catch (TypeA | TypeB ex)\` block.`,
    codeReferences: `public class Day16ExceptionHandling {
    public static int divide(int a, int b) {
        try {
            return a / b;
        } catch (ArithmeticException ex) {
            System.err.println("Arithmetic Fault: Division by zero is undefined.");
            return -1;
        } finally {
            System.out.println("Finally block executed: Resources verified.");
        }
    }

    public static void main(String[] args) {
        System.out.println("Result 10/2: " + divide(10, 2));
        System.out.println("Result 10/0: " + divide(10, 0));

        // Multi-catch block demonstration
        try {
            String str = null;
            int len = str.length();
        } catch (NullPointerException | ArrayIndexOutOfBoundsException ex) {
            System.out.println("Handled Runtime Multi-Exception: " + ex.getClass().getSimpleName());
        }
    }
}`,
    practiceProblems: `1. **Nested Try-Catch Blocks**: Write a program where an inner try-catch handles array index bounds and the outer try-catch handles arithmetic division.
2. **Finally Block Override Trap**: Explain what value is returned when both \`try\` and \`finally\` contain \`return\` statements.
3. **Checked to Unchecked Wrapping**: Demonstrate how to catch a checked \`IOException\` and wrap it inside a custom runtime exception for cleaner service layers.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day17',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 17',
    title: 'Custom Exceptions, Chained Exceptions & Try-With-Resources (AutoCloseable)',
    description: `### 🎯 Objectives & Deep Theory:
1. **Custom User-Defined Exceptions**: Extending \`Exception\` (for checked) or \`RuntimeException\` (for unchecked).
2. **Chained Exceptions**: Associating a root cause exception with a higher-level business exception using \`initCause()\` or \`super(message, cause)\`.
3. **Try-With-Resources (Java 7+)**: Automatic deterministic closure of I/O streams, database connections, and sockets implementing \`java.lang.AutoCloseable\`.`,
    codeReferences: `// Custom Checked Business Exception
class InsufficientAttendanceException extends Exception {
    private double currentPercentage;

    public InsufficientAttendanceException(String msg, double currentPercentage) {
        super(msg);
        this.currentPercentage = currentPercentage;
    }

    public double getCurrentPercentage() { return currentPercentage; }
}

public class Day17CustomExceptionsAndARM {
    public static void verifyExamEligibility(double attendance) throws InsufficientAttendanceException {
        if (attendance < 75.0) {
            throw new InsufficientAttendanceException("Attendance criteria not met (Minimum 75% required).", attendance);
        }
        System.out.println("Scholar eligible for Semester End Examinations!");
    }

    public static void main(String[] args) {
        try {
            verifyExamEligibility(68.5);
        } catch (InsufficientAttendanceException ex) {
            System.err.println("Eligibility Rejection: " + ex.getMessage() + " (Actual: " + ex.getCurrentPercentage() + "%)");
        }
    }
}`,
    practiceProblems: `1. **Design a Banking Exception Framework**: Create custom exceptions \`AccountLockedException\` and \`InsufficientFundsException\` with transaction timestamp logging.
2. **Custom AutoCloseable Resource**: Implement a custom \`DatabaseTransactionSession\` implementing \`AutoCloseable\` and verify its \`close()\` method triggers automatically.
3. **Chained Exception Stacktrace**: Catch a low-level \`SQLException\` and rethrow as \`DataAccessException\` preserving the original stack trace.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day18',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 18',
    title: 'JVM Memory Architecture, Heap Generations, Garbage Collectors & Memory Leaks',
    description: `### 🎯 Objectives & Deep Theory:
1. **JVM Runtime Data Areas**:
   - **Method Area (Metaspace)**: Class metadata, static constants, bytecode.
   - **Heap**: Young Gen (Eden, S0, S1) + Old/Tenured Gen.
   - **Stack**: Method frames with local variables and operand stack per thread.
   - **PC Register & Native Method Stack**.
2. **Garbage Collection (GC) Lifecycle**:
   - New objects allocated in **Eden Space**.
   - Minor GC moves surviving objects between Survivor spaces (\`S0\` & \`S1\`).
   - Objects surviving \`MaxTenuringThreshold\` (default 15) promoted to **Old Generation**.
   - Major/Full GC cleans Old Generation.
3. **Modern GC Engines**: Serial GC, Parallel GC, G1 (Garbage-First) GC, and ultra-low latency ZGC.
4. **Common Memory Leaks in Java**: Static collection references that never clear, unclosed streams, and improper thread-local lifecycle.`,
    codeReferences: `public class Day18JVMAndGarbageCollection {
    public static void main(String[] args) {
        // Inspecting active JVM Heap Memory at runtime
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory() / (1024 * 1024);
        long totalMemory = runtime.totalMemory() / (1024 * 1024);
        long freeMemory = runtime.freeMemory() / (1024 * 1024);

        System.out.println("--- JVM Runtime Memory Diagnostics ---");
        System.out.println("Max Heap Memory: " + maxMemory + " MB");
        System.out.println("Total Allocated Heap: " + totalMemory + " MB");
        System.out.println("Free Heap Memory: " + freeMemory + " MB");
        System.out.println("Available CPU Processors: " + runtime.availableProcessors());
    }
}`,
    practiceProblems: `1. **Memory Leak Simulation**: Write a program that causes an \`OutOfMemoryError: Java heap space\` by continuously adding objects to an uncleared static List.
2. **GC Root Tracing**: Explain what qualifies as a GC Root (Stack local variables, Active Thread references, Static variables, JNI Native references).
3. **Compare G1 vs ZGC**: Explain how ZGC achieves sub-millisecond pause times compared to standard G1 GC.`,
    createdAt: new Date().toISOString()
  },

  // --- PHASE 5: JAVA COLLECTIONS FRAMEWORK & GENERICS (DAYS 19 - 24) ---
  {
    id: 'task-java-day19',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 19',
    title: 'Java Generics, Wildcards (? extends T, ? super T), Type Erasure & PECS',
    description: `### 🎯 Objectives & Deep Theory:
1. **Why Generics**: Compile-time type safety and elimination of explicit type casting \`(String) list.get(0)\`.
2. **Type Erasure**: The compiler removes all generic type parameters during compilation for backward compatibility with pre-Java 5 JVMs, replacing parameters with upper bounds or \`Object\`.
3. **The PECS Principle (Producer Extends, Consumer Super)**:
   - **Producer Extends (\`? extends T\`)**: Use when your method reads items from the collection (Covariance).
   - **Consumer Super (\`? super T\`)**: Use when your method writes/inserts items into the collection (Contravariance).`,
    codeReferences: `import java.util.*;

public class Day19GenericsAndWildcards {
    // Producer Extends: Reading numbers safely
    public static double calculateSum(List<? extends Number> numbers) {
        double sum = 0.0;
        for (Number n : numbers) sum += n.doubleValue();
        return sum;
    }

    // Consumer Super: Writing integers safely
    public static void populateIntegers(List<? super Integer> list) {
        for (int i = 1; i <= 5; i++) list.add(i);
    }

    // Generic Key-Value Pair Class
    static class KeyValuePair<K, V> {
        private K key;
        private V value;

        public KeyValuePair(K key, V value) {
            this.key = key;
            this.value = value;
        }

        public K getKey() { return key; }
        public V getValue() { return value; }
    }

    public static void main(String[] args) {
        List<Double> doubleList = Arrays.asList(1.5, 2.5, 3.5);
        System.out.println("Sum: " + calculateSum(doubleList));

        KeyValuePair<String, Double> offer = new KeyValuePair<>("Amazon", 32.5);
        System.out.println("Company: " + offer.getKey() + " | CTC: " + offer.getValue() + " LPA");
    }
}`,
    practiceProblems: `1. **Generic Bounded Stack**: Implement a generic stack \`BoundedStack<T extends Comparable<T>>\` with a method \`getMaximumElement()\`.
2. **Copy Utility**: Implement generic \`copy(List<? super T> dest, List<? extends T> src)\` adhering to the PECS rule.
3. **Type Erasure Inspection**: Inspect with \`javap -c\` how generic classes translate to raw Object bytecode.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day20',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 20',
    title: 'Collections Framework — List Interface (ArrayList, LinkedList, Vector, Stack)',
    description: `### 🎯 Objectives & Deep Theory:
1. **ArrayList Internal Mechanics**:
   - Backed by dynamic array with initial capacity 10.
   - Growth formula: \`newCapacity = oldCapacity + (oldCapacity >> 1)\` (1.5x scaling).
   - O(1) random access by index; O(N) insertion/deletion due to element shifting.
2. **LinkedList Internal Mechanics**:
   - Doubly Linked List (\`Node { prev, item, next }\`).
   - O(1) insertion/deletion at endpoints; O(N) random traversal.
3. **Fail-Fast Iterators**: \`modCount\` checks during iteration throw \`ConcurrentModificationException\` if structural modifications occur outside the iterator's own \`remove()\`.`,
    codeReferences: `import java.util.*;

public class Day20ListCollections {
    public static void main(String[] args) {
        List<String> modules = new ArrayList<>(Arrays.asList("Basics", "OOP", "Exceptions", "Collections"));
        modules.add("Streams");

        // Safe removal using Iterator to prevent ConcurrentModificationException
        Iterator<String> it = modules.iterator();
        while (it.hasNext()) {
            String m = it.next();
            if (m.equals("Basics")) {
                it.remove(); // Safe modification
            }
        }
        System.out.println("Filtered Modules: " + modules);

        // Vector vs ArrayList: Vector is legacy synchronized, ArrayList is unsynchronized and fast
    }
}`,
    practiceProblems: `1. **LeetCode #20 (Valid Parentheses)**: Implement bracket matching using \`ArrayDeque\` as a Stack in O(N).
2. **Custom Dynamic ArrayList**: Implement \`MyArrayList<T>\` that resizes dynamically by 1.5x when full.
3. **Benchmark Performance**: Compare insertion time at index 0 for 50,000 items in \`ArrayList\` vs \`LinkedList\`.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day21',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 21',
    title: 'Collections Framework — Queue, Deque, PriorityQueue & Monotonic Queues',
    description: `### 🎯 Objectives & Deep Theory:
1. **Queue Interface (FIFO)**: \`offer()\`, \`poll()\`, \`peek()\`.
2. **Deque (Double-Ended Queue)**: \`ArrayDeque\` (faster than \`Stack\` and \`LinkedList\` due to circular array indexing).
3. **PriorityQueue (Min-Heap / Max-Heap)**:
   - Backed by an array representation of a Complete Binary Heap.
   - O(log N) insertion (\`offer\`) and removal (\`poll\`); O(1) peek.
   - Default is Min-Heap; pass \`Collections.reverseOrder()\` for Max-Heap.`,
    codeReferences: `import java.util.*;

public class Day21QueueAndHeap {
    // LeetCode #215: Kth Largest Element using Min-Heap - O(N log K)
    public static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll(); // Evict smallest
            }
        }
        return minHeap.peek();
    }

    public static void main(String[] args) {
        int[] arr = {3, 2, 1, 5, 6, 4};
        System.out.println("2nd Largest Element: " + findKthLargest(arr, 2)); // 5
    }
}`,
    practiceProblems: `1. **LeetCode #215 (Kth Largest Element in an Array)**: Solve using Min-Heap in O(N log K) time.
2. **LeetCode #239 (Sliding Window Maximum)**: Solve using a Monotonic Deque in O(N) linear time.
3. **LeetCode #23 (Merge k Sorted Lists)**: Merge K sorted linked lists using a PriorityQueue in O(N log K).`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day22',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 22',
    title: 'Collections Framework — Set Interface & The equals() / hashCode() Contract',
    description: `### 🎯 Objectives & Deep Theory:
1. **Set Implementations**:
   - **HashSet**: Backed by HashMap, O(1) average time, unordered.
   - **LinkedHashSet**: Maintains insertion order via doubly linked list running across buckets.
   - **TreeSet**: Sorted order backed by Red-Black Self-Balancing BST, O(log N) operations.
2. **The \`equals()\` and \`hashCode()\` Contract**:
   - If \`a.equals(b) == true\`, then \`a.hashCode()\` MUST equal \`b.hashCode()\`.
   - If \`a.hashCode() == b.hashCode()\`, objects are NOT necessarily equal (Hash Collision).
   - Failing to override both results in duplicate objects in HashSets and HashMaps.`,
    codeReferences: `import java.util.*;

class StudentCandidate implements Comparable<StudentCandidate> {
    String rollNumber;
    String name;
    int rank;

    public StudentCandidate(String rollNumber, String name, int rank) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.rank = rank;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudentCandidate that)) return false;
        return Objects.equals(rollNumber, that.rollNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rollNumber);
    }

    @Override
    public int compareTo(StudentCandidate other) {
        return Integer.compare(this.rank, other.rank);
    }

    @Override
    public String toString() {
        return name + " (" + rollNumber + ") - Rank: " + rank;
    }
}

public class Day22SetCollections {
    public static void main(String[] args) {
        Set<StudentCandidate> set = new TreeSet<>();
        set.add(new StudentCandidate("249XA33106", "Mohammed", 1));
        set.add(new StudentCandidate("229X1A0501", "Rahul", 5));
        set.add(new StudentCandidate("239X1A0402", "Priya", 3));

        System.out.println("TreeSet Sorted Order by Rank:");
        set.forEach(System.out::println);
    }
}`,
    practiceProblems: `1. **LeetCode #128 (Longest Consecutive Sequence)**: Find the length of the longest consecutive sequence in O(N) using a HashSet.
2. **Set Equality Bug Demo**: Create a class that overrides \`equals()\` but omits \`hashCode()\`, and demonstrate duplicate insertion into a HashSet.
3. **Find Intersection and Union**: Given two integer arrays, find their intersection and union using Set operations.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day23',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 23',
    title: 'Collections Framework — Map Interface & HashMap Internal Mechanics (Treeification)',
    description: `### 🎯 Objectives & Deep Theory:
1. **HashMap Architecture**:
   - Array of Buckets (\`Node<K,V>[] table\`). Default initial capacity 16, load factor 0.75 (resizes when size reaches 12).
   - Index Formula: \`index = (n - 1) & hash(key)\`.
2. **Collision Resolution & Treeification (Java 8+)**:
   - Uses Separate Chaining with Singly Linked List.
   - When bucket size exceeds \`TREEIFY_THRESHOLD = 8\` and total table capacity &ge; 64, the linked list converts to a **Red-Black Tree** (\`TreeNode\`), reducing lookup from O(N) to O(log N).
3. **ConcurrentHashMap**: High-throughput thread-safe map using CAS and synchronized bucket nodes without locking the entire table.`,
    codeReferences: `import java.util.*;

public class Day23HashMapInternals {
    public static void main(String[] args) {
        // Frequency Map using getOrDefault() and computeIfPresent()
        String text = "java spring java react java dsa react dsa";
        Map<String, Integer> freq = new HashMap<>();

        for (String word : text.split(" ")) {
            freq.put(word, freq.getOrDefault(word, 0) + 1);
        }
        System.out.println("Skill Frequency Map: " + freq);

        // Sorting HashMap by Value in Descending Order
        List<Map.Entry<String, Integer>> entries = new ArrayList<>(freq.entrySet());
        entries.sort((a, b) -> b.getValue().compareTo(a.getValue()));

        System.out.println("Top Skills:");
        entries.forEach(e -> System.out.println(e.getKey() + " -> " + e.getValue()));
    }
}`,
    practiceProblems: `1. **LeetCode #1 (Two Sum)**: Solve in O(N) time and O(N) space using HashMap lookup.
2. **LeetCode #347 (Top K Frequent Elements)**: Find the K most frequent elements using HashMap + Min-Heap in O(N log K).
3. **LeetCode #146 (LRU Cache)**: Implement Least Recently Used Cache with O(1) \`get()\` and \`put()\` using HashMap + Doubly Linked List.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day24',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 24',
    title: 'Comparable vs Comparator, Multi-Level Sorting & Binary Search',
    description: `### 🎯 Objectives & Deep Theory:
1. **Comparable Interface (\`java.lang\`)**:
   - Natural, single sorting order implemented by the class itself via \`public int compareTo(T other)\`.
2. **Comparator Interface (\`java.util\`)**:
   - Custom multiple sorting strategies implemented externally via \`public int compare(T o1, T o2)\`.
3. **Java 8 Comparator Chaining**:
   - \`Comparator.comparing(...).thenComparing(...).reversed()\` for multi-level sorting across multiple fields.`,
    codeReferences: `import java.util.*;

class ScholarRecord {
    String name;
    String branch;
    double cgpa;
    int testScore;

    public ScholarRecord(String name, String branch, double cgpa, int testScore) {
        this.name = name;
        this.branch = branch;
        this.cgpa = cgpa;
        this.testScore = testScore;
    }

    @Override
    public String toString() {
        return String.format("%-10s | %-5s | CGPA: %.2f | Score: %d", name, branch, cgpa, testScore);
    }
}

public class Day24SortingAndSearching {
    public static void main(String[] args) {
        List<ScholarRecord> list = Arrays.asList(
            new ScholarRecord("Rahul", "CSE", 8.9, 95),
            new ScholarRecord("Mohammed", "CSE", 9.4, 98),
            new ScholarRecord("Ananya", "CSM", 9.4, 92),
            new ScholarRecord("Priya", "ECE", 9.1, 88)
        );

        // Multi-level sorting: CGPA desc -> Test Score desc -> Name asc
        list.sort(
            Comparator.comparingDouble((ScholarRecord s) -> s.cgpa).reversed()
                .thenComparing((ScholarRecord s) -> s.testScore, Comparator.reverseOrder())
                .thenComparing(s -> s.name)
        );

        System.out.println("--- Placement Ranking Order ---");
        list.forEach(System.out::println);
    }
}`,
    practiceProblems: `1. **LeetCode #56 (Merge Intervals)**: Sort intervals by start time using a custom Comparator and merge overlapping windows.
2. **LeetCode #179 (Largest Number)**: Arrange integers such that they form the largest possible number using string comparator \`(b + a).compareTo(a + b)\`.
3. **Custom Generic Binary Search**: Write a binary search algorithm supporting custom \`Comparator<T>\`.`,
    createdAt: new Date().toISOString()
  },

  // --- PHASE 6: MULTITHREADING & CONCURRENCY (DAYS 25 - 27) ---
  {
    id: 'task-java-day25',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 25',
    title: 'Multithreading Fundamentals, Thread Lifecycle, Runnable & Daemon Threads',
    description: `### 🎯 Objectives & Deep Theory:
1. **Thread Creation**: Extending \`Thread\` class vs Implementing \`Runnable\` interface (recommended as Java does not support multiple class inheritance).
2. **Thread Lifecycle**: New &rarr; Runnable &rarr; Running &rarr; Blocked/Waiting/Timed_Waiting &rarr; Terminated.
3. **Thread Methods**: \`start()\`, \`run()\`, \`join()\` (waits for thread to terminate), \`sleep()\`, \`yield()\`.
4. **Daemon Threads**: Background service threads (e.g., Garbage Collector) terminated automatically when all user threads finish.`,
    codeReferences: `public class Day25MultithreadingBasics {
    public static void main(String[] args) throws InterruptedException {
        Thread workerThread = new Thread(() -> {
            for (int i = 1; i <= 3; i++) {
                System.out.println(Thread.currentThread().getName() + " executing step " + i);
                try { Thread.sleep(100); } catch (InterruptedException e) {}
            }
        }, "Worker-Thread-1");

        workerThread.start();
        workerThread.join(); // Main thread waits for workerThread to finish

        System.out.println("Worker thread finished. Main thread resuming execution.");
    }
}`,
    practiceProblems: `1. **Print Even and Odd Alternatingly**: Use 2 threads to print numbers from 1 to 100 in sequential order using \`wait()\` and \`notify()\`.
2. **Multi-Threaded Downloader**: Simulate downloading 3 files concurrently with progress indicators.
3. **Daemon Thread Verification**: Create a daemon thread running an infinite loop and observe that it terminates when the main thread exits.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day26',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 26',
    title: 'Thread Synchronization, Race Conditions, Synchronized Blocks, ReentrantLock & Deadlocks',
    description: `### 🎯 Objectives & Deep Theory:
1. **Race Conditions**: Occur when multiple threads access and mutate shared mutable state concurrently without synchronization.
2. **Synchronization Mechanisms**:
   - Synchronized Instance Method (locks \`this\`).
   - Synchronized Static Method (locks \`Class.class\` in Metaspace).
   - Synchronized Block (locks specific object monitor).
   - \`ReentrantLock\`: Explicit lock offering fairness policies and \`tryLock(timeout)\`.
3. **Deadlocks**: Condition where thread A holds lock 1 waiting for lock 2, while thread B holds lock 2 waiting for lock 1. Prevented by global lock acquisition ordering.`,
    codeReferences: `import java.util.concurrent.locks.*;

class BankAccountSafe {
    private int balance = 1000;
    private final Lock lock = new ReentrantLock();

    public void withdraw(String student, int amount) {
        lock.lock(); // Explicit Lock Acquisition
        try {
            if (balance >= amount) {
                System.out.println(student + " withdrawing ₹" + amount);
                Thread.sleep(50);
                balance -= amount;
                System.out.println(student + " completed. Balance: ₹" + balance);
            } else {
                System.out.println(student + " failed: Insufficient funds.");
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock(); // Always unlock in finally block!
        }
    }
}

public class Day26SynchronizationAndLocks {
    public static void main(String[] args) {
        BankAccountSafe acc = new BankAccountSafe();
        new Thread(() -> acc.withdraw("Student A", 600)).start();
        new Thread(() -> acc.withdraw("Student B", 600)).start();
    }
}`,
    practiceProblems: `1. **Producer-Consumer Problem**: Implement bounded buffer queue using \`ReentrantLock\` and \`Condition\` (\`notFull\`, \`notEmpty\`).
2. **Deadlock Simulation & Resolution**: Write a program causing intentional Deadlock between two locks and implement the solution.
3. **Volatile Keyword**: Explain how \`volatile\` prevents CPU cache visibility issues and instruction reordering.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day27',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 27',
    title: 'Java Concurrency Framework: ExecutorService, Callable, Future & CompletableFuture',
    description: `### 🎯 Objectives & Deep Theory:
1. **Thread Pool Architecture**: Creating raw threads incurs high OS context-switching overhead. Thread pools reuse a fixed number of worker threads.
2. **\`Runnable\` vs \`Callable<V>\`**: \`Callable.call()\` returns a generic value and can throw checked exceptions.
3. **\`Future<V>\` & \`CompletableFuture<V>\`**:
   - \`future.get()\`: Blocking retrieval.
   - \`CompletableFuture\` (Java 8+): Non-blocking asynchronous reactive composition with \`thenApply()\`, \`thenAccept()\`, \`thenCombine()\`.`,
    codeReferences: `import java.util.concurrent.*;

public class Day27ExecutorAndCompletableFuture {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);

        // Submitting Callable
        Future<String> future = pool.submit(() -> {
            Thread.sleep(100);
            return "Assessment Result: Passed with 98%";
        });

        System.out.println("Task dispatched asynchronously. Doing other work...");
        System.out.println("Result received: " + future.get());

        // Asynchronous Pipeline with CompletableFuture
        CompletableFuture.supplyAsync(() -> "249XA33106")
            .thenApply(roll -> "Fetched Scholar Record for: " + roll)
            .thenAccept(System.out::println);

        pool.shutdown();
    }
}`,
    practiceProblems: `1. **Parallel Web Request Aggregator**: Use \`CompletableFuture.allOf()\` to fetch and merge responses from 3 asynchronous APIs.
2. **Custom ThreadPoolExecutor**: Configure a custom \`ThreadPoolExecutor\` with corePoolSize=4, maxPoolSize=8, keepAliveTime=60s, and ArrayBlockingQueue.
3. **CountDownLatch Demonstration**: Coordinate 3 worker services to complete before initializing the main server engine.`,
    createdAt: new Date().toISOString()
  },

  // --- PHASE 7: MODERN JAVA (8 TO 21) & ENTERPRISE I/O (DAYS 28 - 30) ---
  {
    id: 'task-java-day28',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 28',
    title: 'Java 8 Functional Programming: Functional Interfaces, Lambdas & Method References',
    description: `### 🎯 Objectives & Deep Theory:
1. **Functional Interfaces (\`@FunctionalInterface\`)**: An interface with exactly one Single Abstract Method (SAM).
2. **Core Built-in Functional Interfaces (\`java.util.function\`)**:
   - \`Predicate<T>\`: \`T &rarr; boolean\` (\`test()\`)
   - \`Function<T, R>\`: \`T &rarr; R\` (\`apply()\`)
   - \`Consumer<T>\`: \`T &rarr; void\` (\`accept()\`)
   - \`Supplier<T>\`: \`() &rarr; T\` (\`get()\`)
   - \`UnaryOperator<T>\`, \`BinaryOperator<T>\`, \`BiFunction<T, U, R>\`.
3. **Method References (\`::\` syntax)**: Compact lambda notation for invoking existing methods (\`Class::staticMethod\`, \`instance::method\`, \`Class::new\`).`,
    codeReferences: `import java.util.function.*;

public class Day28FunctionalProgramming {
    public static void main(String[] args) {
        // 1. Predicate: Check CGPA eligibility
        Predicate<Double> isEligible = cgpa -> cgpa >= 7.5;
        System.out.println("CGPA 8.8 Eligible: " + isEligible.test(8.8));

        // 2. Function: LPA to Monthly In-hand Salary (Approx)
        Function<Double, Double> toMonthlySalary = lpa -> (lpa * 100000) / 12.0;
        System.out.printf("Monthly In-hand for 12 LPA: ₹%.2f%n", toMonthlySalary.apply(12.0));

        // 3. Consumer: Notify Scholar
        Consumer<String> notifier = name -> System.out.println("NOTIFICATION DISPATCHED: " + name.toUpperCase());
        notifier.accept("Mohammed (249XA33106)");

        // 4. Supplier with Constructor Reference
        Supplier<StringBuilder> sbSupplier = StringBuilder::new;
        StringBuilder sb = sbSupplier.get();
        sb.append("Functional Java Active.");
        System.out.println(sb);
    }
}`,
    practiceProblems: `1. **Predicate Chaining**: Create predicates for \`isAdult\`, \`hasValidCredit\`, and \`isCitizen\`. Chain them with \`.and()\` and \`.or()\`.
2. **Custom TriFunction**: Create a generic \`TriFunction<A, B, C, R>\` functional interface that takes 3 arguments and returns a result.
3. **Method Reference Refactoring**: Convert 5 complex anonymous class comparator instances into compact method references.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day29',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 29',
    title: 'Java 8+ Stream API: Filtering, Mapping, FlatMapping, Grouping & Collectors',
    description: `### 🎯 Objectives & Deep Theory:
1. **Stream Pipeline Architecture**:
   - **Source**: Collection, Array, I/O Channel (\`list.stream()\`).
   - **Intermediate Operations (Lazy Execution)**: \`filter()\`, \`map()\`, \`flatMap()\`, \`sorted()\`, \`distinct()\`, \`limit()\`.
   - **Terminal Operations (Eager Execution)**: \`collect()\`, \`reduce()\`, \`forEach()\`, \`count()\`, \`min()\`, \`max()\`.
2. **Advanced Stream Collectors**: \`Collectors.groupingBy()\`, \`Collectors.partitioningBy()\`, \`Collectors.joining()\`, \`Collectors.averagingDouble()\`.`,
    codeReferences: `import java.util.*;
import java.util.stream.Collectors;

class PlacementProfile {
    String name;
    String branch;
    double packageLPA;

    public PlacementProfile(String name, String branch, double packageLPA) {
        this.name = name;
        this.branch = branch;
        this.packageLPA = packageLPA;
    }

    public String getBranch() { return branch; }
    public double getPackageLPA() { return packageLPA; }
}

public class Day29StreamAPIDeepDive {
    public static void main(String[] args) {
        List<PlacementProfile> profiles = Arrays.asList(
            new PlacementProfile("Mohammed", "CSE", 32.5),
            new PlacementProfile("Rahul", "CSE", 9.0),
            new PlacementProfile("Priya", "ECE", 14.0),
            new PlacementProfile("Ananya", "CSM", 18.5),
            new PlacementProfile("Kiran", "CSE", 7.5)
        );

        // 1. Group by Branch
        Map<String, List<PlacementProfile>> byBranch = profiles.stream()
            .collect(Collectors.groupingBy(PlacementProfile::getBranch));
        System.out.println("Branch Departments: " + byBranch.keySet());

        // 2. Average CTC per branch
        Map<String, Double> avgPackage = profiles.stream()
            .collect(Collectors.groupingBy(
                PlacementProfile::getBranch,
                Collectors.averagingDouble(PlacementProfile::getPackageLPA)
            ));
        System.out.println("Average Package per Branch: " + avgPackage);

        // 3. Find highest package candidate using reduce
        profiles.stream()
            .max(Comparator.comparingDouble(PlacementProfile::getPackageLPA))
            .ifPresent(top -> System.out.println("Highest Package: " + top.name + " (" + top.packageLPA + " LPA)"));
    }
}`,
    practiceProblems: `1. **Word Frequency via FlatMap**: Given a list of sentences, return a frequency map of all unique words using \`flatMap()\` and \`Collectors.groupingBy()\`.
2. **Second Highest Integer**: Find the second highest unique number in an integer list using a single Stream pipeline.
3. **Partitioning by Prime**: Partition numbers 1 to 100 into Prime and Composite lists using \`Collectors.partitioningBy()\`.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-java-day30',
    subject: 'Java Core & Advanced Programming',
    dayLabel: 'Day 30',
    title: 'Java File I/O (NIO.2), Serialization & JDBC Database ACID Transactions',
    description: `### 🎯 Objectives & Deep Theory:
1. **Modern Java NIO.2**: \`java.nio.file.Files\` and \`Paths\` for high-speed non-blocking asynchronous file operations.
2. **Object Serialization & Deserialization**:
   - Converting object graph into byte stream using \`ObjectOutputStream\` (\`Serializable\` marker interface).
   - \`transient\` keyword prevents sensitive credentials from being serialized.
   - \`serialVersionUID\` guarantees bytecode compatibility across versions.
3. **JDBC & ACID Transaction Management**:
   - \`PreparedStatement\`: Parameterized SQL to prevent SQL Injection attacks.
   - Transaction Boundaries: \`conn.setAutoCommit(false)\`, \`conn.commit()\`, and \`conn.rollback()\` on errors.`,
    codeReferences: `import java.sql.*;
import java.io.*;

public class Day30EnterpriseJDBCAndNIO {
    // ACID Transaction Management Example
    public static void executeBankTransfer(Connection conn, int fromAcc, int toAcc, double amount) throws SQLException {
        String debitQuery = "UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?";
        String creditQuery = "UPDATE accounts SET balance = balance + ? WHERE id = ?";

        try {
            conn.setAutoCommit(false); // Start Transaction

            try (PreparedStatement debit = conn.prepareStatement(debitQuery)) {
                debit.setDouble(1, amount);
                debit.setInt(2, fromAcc);
                debit.setDouble(3, amount);
                if (debit.executeUpdate() == 0) throw new SQLException("Insufficient funds.");
            }

            try (PreparedStatement credit = conn.prepareStatement(creditQuery)) {
                credit.setDouble(1, amount);
                credit.setInt(2, toAcc);
                credit.executeUpdate();
            }

            conn.commit(); // Commit Transaction
            System.out.println("₹" + amount + " successfully transferred.");
        } catch (SQLException ex) {
            conn.rollback(); // Rollback changes on failure
            System.err.println("Transfer failed, transaction rolled back: " + ex.getMessage());
            throw ex;
        } finally {
            conn.setAutoCommit(true);
        }
    }

    public static void main(String[] args) {
        System.out.println("Vyomra Enterprise Java Engine Initialized.");
    }
}`,
    practiceProblems: `1. **Complete Scholar DAO (Data Access Object)**: Build a production-grade DAO class with \`createScholar()\`, \`findByRoll()\`, and \`updateCGPA()\` using JDBC.
2. **NIO.2 Fast Log Parser**: Use \`Files.lines(path)\` to filter and stream error logs matching \`ERROR [500]\` from large system files.
3. **Object Serialization Test**: Serialize a \`UserAuthToken\` object with \`transient String passwordHash\` and verify that deserialization leaves the transient field as null.`,
    createdAt: new Date().toISOString()
  },

  // ==========================================
  // PYTHON FULL STACK TRACK
  // ==========================================
  {
    id: 'task-python-day1',
    subject: 'Python Full Stack',
    dayLabel: 'Day 1',
    title: 'Python OOPs, Decorators, Generators & Context Managers',
    description: 'Build custom class decorators and generator functions with `yield` in Python. Understand `__enter__` and `__exit__` dunder methods for resource safety.',
    codeReferences: `import time

def timing_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} executed in {time.time() - start:.4f}s")
        return result
    return wrapper

@timing_decorator
def compute_squares(n):
    return [i**2 for i in range(n)]`,
    practiceProblems: '1. Create a retry decorator with max attempts and delay.\n2. Implement a custom context manager for measuring memory consumption.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-python-day2',
    subject: 'Python Full Stack',
    dayLabel: 'Day 2',
    title: 'FastAPI High-Performance REST API & Pydantic Schema Validation',
    description: 'Create asynchronous REST API endpoints using FastAPI with Pydantic request validation, dependency injection, and automatic OpenAPI Swagger docs.',
    codeReferences: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI()

class ScholarSchema(BaseModel):
    name: str
    email: EmailStr
    department: str

@app.post("/scholars/")
async def create_scholar(scholar: ScholarSchema):
    return {"status": "created", "scholar": scholar}`,
    practiceProblems: '1. Build an authentication API with JWT tokens and bcrypt password hashing.\n2. Implement Swagger UI documentation with custom response models.',
    createdAt: new Date().toISOString()
  },

  // ==========================================
  // MODERN WEB DEVELOPMENT TRACK
  // ==========================================
  {
    id: 'task-web-day1',
    subject: 'Modern Web Development',
    dayLabel: 'Day 1',
    title: 'Responsive Glassmorphic UI with Tailwind CSS & Motion',
    description: 'Design and build a responsive glassmorphic dashboard component with dark mode support and micro-interactions using Tailwind CSS and Framer Motion.',
    codeReferences: `<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-brand-teal/50 transition-all">
  <h3 className="text-lg font-bold text-white">Interactive Glass Card</h3>
  <p className="text-xs text-gray-400 mt-2">Smooth hover transition with reactive border glow.</p>
</div>`,
    practiceProblems: '1. Create a responsive navbar with mobile drawer.\n2. Build a stats counter card with subtle gradient mesh backgrounds.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-web-day2',
    subject: 'Modern Web Development',
    dayLabel: 'Day 2',
    title: 'React Custom Hooks & State Performance Optimization',
    description: 'Master `useMemo`, `useCallback`, and custom reusable hooks (`useLocalStorage`, `useDebounce`) for high-frequency search and filtering.',
    codeReferences: `import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}`,
    practiceProblems: '1. Implement live typeahead search with debounced API queries.\n2. Build a custom `useOnlineStatus` hook for offline fallback banners.',
    createdAt: new Date().toISOString()
  }
];
