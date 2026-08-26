export const ALGORITHM_LIBRARY = [
  {
    category: "1. Sorting Algorithms",
    algorithms: [
      {
        name: "Bubble Sort",
        code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\narr = [64, 34, 25, 12, 22, 11, 90]\nprint(bubble_sort(arr))`
      },
      {
        name: "Selection Sort",
        code: `def selection_sort(arr):\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i+1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr\n\narr = [64, 25, 12, 22, 11]\nprint(selection_sort(arr))`
      },
      {
        name: "Insertion Sort",
        code: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i-1\n        while j >= 0 and key < arr[j] :\n                arr[j + 1] = arr[j]\n                j -= 1\n        arr[j + 1] = key\n    return arr\n\narr = [12, 11, 13, 5, 6]\nprint(insertion_sort(arr))`
      },
      {
        name: "Merge Sort",
        code: `def merge_sort(arr):\n    if len(arr) > 1:\n        mid = len(arr)//2\n        L = arr[:mid]\n        R = arr[mid:]\n        merge_sort(L)\n        merge_sort(R)\n        i = j = k = 0\n        while i < len(L) and j < len(R):\n            if L[i] <= R[j]:\n                arr[k] = L[i]\n                i += 1\n            else:\n                arr[k] = R[j]\n                j += 1\n            k += 1\n        while i < len(L):\n            arr[k] = L[i]\n            i += 1\n            k += 1\n        while j < len(R):\n            arr[k] = R[j]\n            j += 1\n            k += 1\n    return arr\n\narr = [12, 11, 13, 5, 6, 7]\nprint(merge_sort(arr))`
      },
      {
        name: "Quick Sort",
        code: `def partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    for j in range(low, high):\n        if arr[j] < pivot:\n            i = i + 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i + 1], arr[high] = arr[high], arr[i + 1]\n    return i + 1\n\ndef quick_sort(arr, low, high):\n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort(arr, low, pi - 1)\n        quick_sort(arr, pi + 1, high)\n\narr = [10, 7, 8, 9, 1, 5]\nquick_sort(arr, 0, len(arr)-1)\nprint(arr)`
      },
      {
        name: "Heap Sort",
        code: `def heapify(arr, n, i):\n    largest = i\n    l = 2 * i + 1\n    r = 2 * i + 2\n    if l < n and arr[i] < arr[l]: largest = l\n    if r < n and arr[largest] < arr[r]: largest = r\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)\n\ndef heap_sort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[i], arr[0] = arr[0], arr[i]\n        heapify(arr, i, 0)\n\narr = [12, 11, 13, 5, 6, 7]\nheap_sort(arr)\nprint(arr)`
      },
      { 
        name: "Counting Sort", 
        code: `def counting_sort(arr):\n    max_val = max(arr)\n    count = [0] * (max_val + 1)\n    for num in arr:\n        count[num] += 1\n    res = []\n    for i, freq in enumerate(count):\n        res.extend([i] * freq)\n    return res\n\narr = [4, 2, 2, 8, 3, 3, 1]\nprint(counting_sort(arr))` 
      },
      { 
        name: "Radix Sort", 
        code: `def countingSort(arr, exp1):\n    n = len(arr)\n    output = [0] * (n)\n    count = [0] * (10)\n    for i in range(0, n):\n        index = (arr[i]//exp1)\n        count[int((index)%10)] += 1\n    for i in range(1,10):\n        count[i] += count[i-1]\n    i = n-1\n    while i>=0:\n        index = (arr[i]//exp1)\n        output[ count[ int((index)%10) ] - 1] = arr[i]\n        count[int((index)%10)] -= 1\n        i -= 1\n    i = 0\n    for i in range(0,len(arr)):\n        arr[i] = output[i]\n\ndef radixSort(arr):\n    max1 = max(arr)\n    exp = 1\n    while max1 // exp > 0:\n        countingSort(arr,exp)\n        exp *= 10\n\narr = [170, 45, 75, 90, 802, 24, 2, 66]\nradixSort(arr)\nprint(arr)` 
      },
      { 
        name: "Shell Sort", 
        code: `def shellSort(arr):\n    n = len(arr)\n    gap = n//2\n    while gap > 0:\n        for i in range(gap,n):\n            temp = arr[i]\n            j = i\n            while j >= gap and arr[j-gap] >temp:\n                arr[j] = arr[j-gap]\n                j -= gap\n            arr[j] = temp\n        gap //= 2\n\narr = [12, 34, 54, 2, 3]\nshellSort(arr)\nprint(arr)` 
      }
    ]
  },
  {
    category: "2. Searching Algorithms",
    algorithms: [
      {
        name: "Linear Search",
        code: `def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1\n\narr = [2, 4, 0, 1, 9]\nprint(linear_search(arr, 1))`
      },
      {
        name: "Binary Search",
        code: `def binary_search(arr, target):\n    l, r = 0, len(arr) - 1\n    while l <= r:\n        mid = l + (r - l) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            l = mid + 1\n        else:\n            r = mid - 1\n    return -1\n\narr = [2, 3, 4, 10, 40]\nprint(binary_search(arr, 10))`
      },
      { 
        name: "Jump Search", 
        code: `import math\ndef jumpSearch( arr , x , n ):\n    step = math.sqrt(n)\n    prev = 0\n    while arr[int(min(step, n)-1)] < x:\n        prev = step\n        step += math.sqrt(n)\n        if prev >= n:\n            return -1\n    while arr[int(prev)] < x:\n        prev += 1\n        if prev == min(step, n):\n            return -1\n    if arr[int(prev)] == x:\n        return prev\n    return -1\n\narr = [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ]\nprint("Found at index", int(jumpSearch(arr, 13, len(arr))))` 
      }
    ]
  },
  {
    category: "3. Recursion & Backtracking",
    algorithms: [
      {
        name: "Tower of Hanoi",
        code: `def tower_of_hanoi(n, source, destination, auxiliary):\n    if n == 1:\n        print(f"Move disk 1 from {source} to {destination}")\n        return\n    tower_of_hanoi(n-1, source, auxiliary, destination)\n    print(f"Move disk {n} from {source} to {destination}")\n    tower_of_hanoi(n-1, auxiliary, destination, source)\n\ntower_of_hanoi(3, 'A', 'C', 'B')`
      },
      {
        name: "N-Queens Problem",
        code: `def solve_n_queens(n):\n    def is_safe(board, row, col):\n        for i in range(col):\n            if board[row][i] == 1: return False\n        for i, j in zip(range(row, -1, -1), range(col, -1, -1)):\n            if board[i][j] == 1: return False\n        for i, j in zip(range(row, n, 1), range(col, -1, -1)):\n            if board[i][j] == 1: return False\n        return True\n\n    def solve(board, col):\n        if col >= n: return True\n        for i in range(n):\n            if is_safe(board, i, col):\n                board[i][col] = 1\n                if solve(board, col + 1): return True\n                board[i][col] = 0\n        return False\n\n    board = [[0]*n for _ in range(n)]\n    solve(board, 0)\n    return board\n\nprint(solve_n_queens(4))`
      }
    ]
  },
  {
    category: "4. Greedy Algorithms",
    algorithms: [
      {
        name: "Activity Selection",
        code: `def print_max_activities(s, f):\n    n = len(f)\n    print("Following activities are selected")\n    i = 0\n    print(i)\n    for j in range(1, n):\n        if s[j] >= f[i]:\n            print(j)\n            i = j\n\ns = [1, 3, 0, 5, 8, 5]\nf = [2, 4, 6, 7, 9, 9]\nprint_max_activities(s, f)`
      },
      {
        name: "Fractional Knapsack",
        code: `class Item:\n    def __init__(self, value, weight):\n        self.value = value\n        self.weight = weight\n\ndef fractional_knapsack(W, arr):\n    arr.sort(key=lambda x: (x.value/x.weight), reverse=True)\n    final_value = 0.0\n    for item in arr:\n        if item.weight <= W:\n            W -= item.weight\n            final_value += item.value\n        else:\n            final_value += item.value * W / item.weight\n            break\n    return final_value\n\nW = 50\narr = [Item(60, 10), Item(100, 20), Item(120, 30)]\nprint(fractional_knapsack(W, arr))`
      }
    ]
  },
  {
    category: "5. Dynamic Programming (DP)",
    algorithms: [
      {
        name: "Fibonacci (DP)",
        code: `def fib(n):\n    f = [0, 1]\n    for i in range(2, n+1):\n        f.append(f[i-1] + f[i-2])\n    return f[n]\nprint(fib(9))`
      },
      {
        name: "Longest Common Subsequence",
        code: `def lcs(X, Y):\n    m = len(X)\n    n = len(Y)\n    L = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if X[i-1] == Y[j-1]:\n                L[i][j] = L[i-1][j-1] + 1\n            else:\n                L[i][j] = max(L[i-1][j], L[i][j-1])\n    return L[m][n]\n\nX = "AGGTAB"\nY = "GXTXAYB"\nprint(lcs(X, Y))`
      },
      {
        name: "0/1 Knapsack",
        code: `def knapSack(W, wt, val, n):\n    K = [[0 for x in range(W + 1)] for x in range(n + 1)]\n    for i in range(n + 1):\n        for w in range(W + 1):\n            if i == 0 or w == 0:\n                K[i][w] = 0\n            elif wt[i-1] <= w:\n                K[i][w] = max(val[i-1] + K[i-1][w-wt[i-1]], K[i-1][w])\n            else:\n                K[i][w] = K[i-1][w]\n    return K[n][W]\n\nval = [60, 100, 120]\nwt = [10, 20, 30]\nW = 50\nprint(knapSack(W, wt, val, len(val)))`
      }
    ]
  },
  {
    category: "6. Graph Algorithms",
    algorithms: [
      {
        name: "Breadth-First Search (BFS)",
        code: `import collections\ndef bfs(graph, root):\n    visited, queue = set(), collections.deque([root])\n    visited.add(root)\n    while queue:\n        vertex = queue.popleft()\n        print(str(vertex) + " ", end="")\n        for neighbour in graph[vertex]:\n            if neighbour not in visited:\n                visited.add(neighbour)\n                queue.append(neighbour)\n\ngraph = {0: [1, 2], 1: [2], 2: [3], 3: [1, 2]}\nbfs(graph, 0)`
      },
      {
        name: "Depth-First Search (DFS)",
        code: `def dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    print(node, end=" ")\n    for neighbour in graph[node]:\n        if neighbour not in visited:\n            dfs(graph, neighbour, visited)\n\ngraph = {0: [1, 2], 1: [2], 2: [3], 3: [1, 2]}\ndfs(graph, 0)`
      },
      {
        name: "Dijkstra's Algorithm",
        code: `import sys\nclass Graph():\n    def __init__(self, vertices):\n        self.V = vertices\n        self.graph = [[0 for column in range(vertices)] for row in range(vertices)]\n    def minDistance(self, dist, sptSet):\n        min = sys.maxsize\n        min_index = 0\n        for v in range(self.V):\n            if dist[v] < min and sptSet[v] == False:\n                min = dist[v]\n                min_index = v\n        return min_index\n    def dijkstra(self, src):\n        dist = [sys.maxsize] * self.V\n        dist[src] = 0\n        sptSet = [False] * self.V\n        for cout in range(self.V):\n            u = self.minDistance(dist, sptSet)\n            sptSet[u] = True\n            for v in range(self.V):\n                if self.graph[u][v] > 0 and sptSet[v] == False and dist[v] > dist[u] + self.graph[u][v]:\n                    dist[v] = dist[u] + self.graph[u][v]\n        print("Vertex \\t Distance from Source")\n        for node in range(self.V):\n            print(node, "\\t\\t", dist[node])\n\ng = Graph(4)\ng.graph = [[0, 4, 0, 8],\n           [4, 0, 8, 11],\n           [0, 8, 0, 7],\n           [8, 11, 7, 0]]\ng.dijkstra(0)`
      },
      {
        name: "Topological Sort",
        code: `from collections import defaultdict\nclass Graph:\n    def __init__(self,vertices):\n        self.graph = defaultdict(list)\n        self.V = vertices\n    def addEdge(self,u,v):\n        self.graph[u].append(v)\n    def topologicalSortUtil(self,v,visited,stack):\n        visited[v] = True\n        for i in self.graph[v]:\n            if visited[i] == False:\n                self.topologicalSortUtil(i,visited,stack)\n        stack.insert(0,v)\n    def topologicalSort(self):\n        visited = [False]*self.V\n        stack =[]\n        for i in range(self.V):\n            if visited[i] == False:\n                self.topologicalSortUtil(i,visited,stack)\n        print (stack)\n\ng= Graph(6)\ng.addEdge(5, 2)\ng.addEdge(5, 0)\ng.addEdge(4, 0)\ng.addEdge(4, 1)\ng.addEdge(2, 3)\ng.addEdge(3, 1)\ng.topologicalSort()`
      },
      {
        name: "Kruskal's MST",
        code: `class Graph:\n    def __init__(self, vertices):\n        self.V = vertices\n        self.graph = []\n    def addEdge(self, u, v, w):\n        self.graph.append([u, v, w])\n    def find(self, parent, i):\n        if parent[i] == i:\n            return i\n        return self.find(parent, parent[i])\n    def union(self, parent, rank, x, y):\n        xroot = self.find(parent, x)\n        yroot = self.find(parent, y)\n        if rank[xroot] < rank[yroot]:\n            parent[xroot] = yroot\n        elif rank[xroot] > rank[yroot]:\n            parent[yroot] = xroot\n        else :\n            parent[yroot] = xroot\n            rank[xroot] += 1\n    def KruskalMST(self):\n        result =[]\n        i = 0\n        e = 0\n        self.graph = sorted(self.graph, key=lambda item: item[2])\n        parent = []\n        rank = []\n        for node in range(self.V):\n            parent.append(node)\n            rank.append(0)\n        while e < self.V -1 :\n            u, v, w = self.graph[i]\n            i = i + 1\n            x = self.find(parent, u)\n            y = self.find(parent, v)\n            if x != y:\n                e = e + 1\n                result.append([u, v, w])\n                self.union(parent, rank, x, y)\n        print("Edges in MST")\n        for u, v, weight in result:\n            print(f"{u} -- {v} == {weight}")\n\ng = Graph(4)\ng.addEdge(0, 1, 10)\ng.addEdge(0, 2, 6)\ng.addEdge(0, 3, 5)\ng.addEdge(1, 3, 15)\ng.addEdge(2, 3, 4)\ng.KruskalMST()`
      },
      {
        name: "Prim's MST",
        code: `import sys\nclass Graph():\n    def __init__(self, vertices):\n        self.V = vertices\n        self.graph = [[0 for column in range(vertices)] for row in range(vertices)]\n    def printMST(self, parent):\n        print("Edge \\tWeight")\n        for i in range(1, self.V):\n            print(parent[i], "-", i, "\\t", self.graph[i][parent[i]])\n    def minKey(self, key, mstSet):\n        min = sys.maxsize\n        min_index = 0\n        for v in range(self.V):\n            if key[v] < min and mstSet[v] == False:\n                min = key[v]\n                min_index = v\n        return min_index\n    def primMST(self):\n        key = [sys.maxsize] * self.V\n        parent = [None] * self.V\n        key[0] = 0\n        mstSet = [False] * self.V\n        parent[0] = -1\n        for cout in range(self.V):\n            u = self.minKey(key, mstSet)\n            mstSet[u] = True\n            for v in range(self.V):\n                if self.graph[u][v] > 0 and mstSet[v] == False and key[v] > self.graph[u][v]:\n                    key[v] = self.graph[u][v]\n                    parent[v] = u\n        self.printMST(parent)\n\ng = Graph(5)\ng.graph = [[0, 2, 0, 6, 0],\n           [2, 0, 3, 8, 5],\n           [0, 3, 0, 0, 7],\n           [6, 8, 0, 0, 9],\n           [0, 5, 7, 9, 0]]\ng.primMST()`
      }
    ]
  },
  {
    category: "7. String Algorithms",
    algorithms: [
      {
        name: "Naive Pattern Searching",
        code: `def search(pat, txt):\n    M = len(pat)\n    N = len(txt)\n    for i in range(N - M + 1):\n        j = 0\n        while(j < M):\n            if (txt[i + j] != pat[j]):\n                break\n            j += 1\n        if (j == M):\n            print("Pattern found at index ", i)\n\ntxt = "AABAACAADAABAABA"\npat = "AABA"\nsearch(pat, txt)`
      }
    ]
  },
  {
    category: "8. Number Theory",
    algorithms: [
      {
        name: "Euclidean Algorithm (GCD)",
        code: `def gcd(a, b):\n    if a == 0:\n        return b\n    return gcd(b % a, a)\n\nprint(gcd(10, 15))`
      },
      {
        name: "Sieve of Eratosthenes",
        code: `def sieve(n):\n    prime = [True for _ in range(n+1)]\n    p = 2\n    while (p * p <= n):\n        if (prime[p] == True):\n            for i in range(p * p, n+1, p):\n                prime[i] = False\n        p += 1\n    for p in range(2, n+1):\n        if prime[p]:\n            print(p, end=" ")\n\nsieve(30)`
      }
    ]
  }
];
