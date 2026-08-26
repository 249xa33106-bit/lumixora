import React, { useState, useEffect } from 'react';
import { PlayCircle, Code2, Activity, Settings2, RefreshCw, Maximize, X, Map, BookOpen, Atom } from 'lucide-react';
import Editor from '@monaco-editor/react';
import PathfindingVisualizer from '../components/PathfindingVisualizer';
import QuantumGateSimulator from '../components/QuantumGateSimulator';
import { ALGORITHM_LIBRARY } from '../data/algorithmLibraryData';

const TEMPLATES = {
  '3': 'def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n\nresult = factorial(5)\nprint(result)',
  'java': 'public class YourClassNameHere {\n    public static void main(String[] args) {\n        int result = factorial(5);\n        System.out.println(result);\n    }\n\n    public static int factorial(int n) {\n        if (n == 0) return 1;\n        return n * factorial(n - 1);\n    }\n}',
  'cpp': '#include <iostream>\nusing namespace std;\n\nint factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int result = factorial(5);\n    cout << result << endl;\n    return 0;\n}',
  'js': 'function factorial(n) {\n    if (n === 0) return 1;\n    return n * factorial(n - 1);\n}\n\nlet result = factorial(5);\nconsole.log(result);'
};

const SimulationPortal = () => {
  const [activeTab, setActiveTab] = useState('visualizer'); // 'visualizer' or 'simulator'
  
  // Custom Visualizer State
  const [language, setLanguage] = useState('3'); // 3 for Python 3
  const [code, setCode] = useState(TEMPLATES['3']);
  const [iframeUrl, setIframeUrl] = useState('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Algorithm Simulator State
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [sortingSpeed, setSortingSpeed] = useState(100);
  const [algorithm, setAlgorithm] = useState('bubble');
  
  // Search visualization states
  const [activeIndex, setActiveIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [targetValue, setTargetValue] = useState(null);

  const ALGORITHM_DETAILS = {
    bubble: {
      name: 'Bubble Sort',
      time: 'O(n²) worst case.',
      space: 'O(1) auxiliary space.',
      mech: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
      code: `for i from 0 to N - 1\n  for j from 0 to N - i - 1\n    if a[j] > a[j + 1]\n      swap(a[j], a[j + 1])`
    },
    selection: {
      name: 'Selection Sort',
      time: 'O(n²) worst case.',
      space: 'O(1) auxiliary space.',
      mech: 'Finds the minimum element from the unsorted part and puts it at the beginning.',
      code: `for i from 0 to N - 1\n  min_idx = i\n  for j from i + 1 to N\n    if a[j] < a[min_idx]\n      min_idx = j\n  swap(a[i], a[min_idx])`
    },
    insertion: {
      name: 'Insertion Sort',
      time: 'O(n²) worst case.',
      space: 'O(1) auxiliary space.',
      mech: 'Builds the final sorted array one item at a time, by repeatedly taking the next element and inserting it into the sorted portion.',
      code: `for i from 1 to N - 1\n  key = a[i]\n  j = i - 1\n  while j >= 0 and a[j] > key\n    a[j + 1] = a[j]\n    j = j - 1\n  a[j + 1] = key`
    },
    merge: {
      name: 'Merge Sort',
      time: 'O(n log n) all cases.',
      space: 'O(n) auxiliary space.',
      mech: 'Recursively divides the array in half, sorts each half, and merges them back together.',
      code: `mergeSort(arr, l, r)\n  if l >= r return\n  m = (l+r)/2\n  mergeSort(arr, l, m)\n  mergeSort(arr, m+1, r)\n  merge(arr, l, m, r)`
    },
    quick: {
      name: 'Quick Sort',
      time: 'O(n log n) average.',
      space: 'O(log n) auxiliary space.',
      mech: 'Picks a pivot, partitions array around it (smaller left, larger right), and recursively sorts the partitions.',
      code: `quickSort(arr, low, high)\n  if low < high\n    pi = partition(arr, low, high)\n    quickSort(arr, low, pi - 1)\n    quickSort(arr, pi + 1, high)`
    },
    linear: {
      name: 'Linear Search',
      time: 'O(n) worst case.',
      space: 'O(1) auxiliary space.',
      mech: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
      code: `for each item in array\n  if item == target\n    return index\nreturn not_found`
    },
    binary: {
      name: 'Binary Search',
      time: 'O(log n) worst case.',
      space: 'O(1) auxiliary space.',
      mech: 'Requires sorted array. Repeatedly divides the search interval in half by comparing target to middle element.',
      code: `while left <= right\n  mid = (left + right) / 2\n  if arr[mid] == target return mid\n  if arr[mid] < target left = mid + 1\n  else right = mid - 1`
    }
  };

  // Generate initial random array for simulator
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    generateRandomArray();
  }, []);

  const generateRandomArray = () => {
    if (isSorting) return;
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setActiveIndex(-1);
    setFoundIndex(-1);
    setTargetValue(null);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    if (TEMPLATES[newLang]) {
      setCode(TEMPLATES[newLang]);
    }
    setLanguage(newLang);
    setIsVisualizing(false);
  };

  const handleVisualize = () => {
    if (!code.trim()) return;
    setIsVisualizing(true);
    const encodedCode = encodeURIComponent(code);
    
    // Map language to Pythontutor's expected 'py' parameter
    let pyParam = language;
    if (language === '3') pyParam = '311'; // Use latest Python 3.11
    if (language === 'cpp') pyParam = 'cpp_11'; // Use C++11
    if (language === 'c') pyParam = 'c';
    if (language === 'java') pyParam = 'java';
    if (language === 'js') pyParam = 'js';

    // Construct PythonTutor iframe URL
    // Removed 'origin=opt-frontend.js' to allow non-Python languages to load correctly
    const url = `https://pythontutor.com/iframe-embed.html#code=${encodedCode}&cumulative=false&curInstr=0&heapPrimitives=nevernest&py=${pyParam}&rawInputLstJSON=%5B%5D&textReferences=false`;
    setIframeUrl(url);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    let arr = [...array];
    let n = arr.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
      swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight elements being compared (we'll rely on React state, but for smooth 60fps it's tricky, we'll just do simple swaps)
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;
          setArray([...arr]);
          await sleep(sortingSpeed);
        }
      }
      if (!swapped) break;
    }
    setIsSorting(false);
  };

  const selectionSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let min_idx = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[min_idx]) {
          min_idx = j;
        }
      }
      if (min_idx !== i) {
        let temp = arr[i];
        arr[i] = arr[min_idx];
        arr[min_idx] = temp;
        setArray([...arr]);
      }
      // Sleep once per outer loop to show progress visually since selection sort has few swaps
      await sleep(sortingSpeed * 2);
    }
    setIsSorting(false);
  };

  const insertionSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    let arr = [...array];
    let n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
        setArray([...arr]);
        await sleep(sortingSpeed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await sleep(sortingSpeed);
    }
    setIsSorting(false);
  };

  // --- MERGE SORT ---
  const mergeSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    let arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
    setIsSorting(false);
  };
  const mergeSortHelper = async (arr, l, r) => {
    if (l >= r) return;
    let m = l + Math.floor((r - l) / 2);
    await mergeSortHelper(arr, l, m);
    await mergeSortHelper(arr, m + 1, r);
    await merge(arr, l, m, r);
  };
  const merge = async (arr, l, m, r) => {
    let n1 = m - l + 1, n2 = r - m;
    let L = new Array(n1), R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) { arr[k] = L[i]; i++; } 
      else { arr[k] = R[j]; j++; }
      setArray([...arr]); await sleep(sortingSpeed); k++;
    }
    while (i < n1) { arr[k] = L[i]; i++; k++; setArray([...arr]); await sleep(sortingSpeed); }
    while (j < n2) { arr[k] = R[j]; j++; k++; setArray([...arr]); await sleep(sortingSpeed); }
  };

  // --- QUICK SORT ---
  const quickSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    let arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
    setIsSorting(false);
  };
  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      let pi = await partition(arr, low, high);
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  };
  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        let temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        setArray([...arr]); await sleep(sortingSpeed);
      }
    }
    let temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
    setArray([...arr]); await sleep(sortingSpeed);
    return i + 1;
  };

  // --- LINEAR SEARCH ---
  const linearSearch = async () => {
    if (isSorting) return;
    setIsSorting(true); setFoundIndex(-1);
    let arr = [...array];
    let target = arr[Math.floor(Math.random() * arr.length)];
    setTargetValue(target);
    
    for (let i = 0; i < arr.length; i++) {
      setActiveIndex(i);
      await sleep(sortingSpeed * 2);
      if (arr[i] === target) {
        setFoundIndex(i); break;
      }
    }
    setIsSorting(false);
  };

  // --- BINARY SEARCH ---
  const binarySearch = async () => {
    if (isSorting) return;
    setIsSorting(true); setFoundIndex(-1); setActiveIndex(-1);
    
    let arr = [...array].sort((a,b)=>a-b);
    setArray(arr); 
    await sleep(800); 
    
    let target = arr[Math.floor(Math.random() * arr.length)];
    setTargetValue(target);
    
    let l = 0, r = arr.length - 1;
    while(l <= r) {
      let m = Math.floor((l + r)/2);
      setActiveIndex(m);
      await sleep(sortingSpeed * 3);
      
      if (arr[m] === target) {
        setFoundIndex(m); break;
      }
      if (arr[m] < target) l = m + 1;
      else r = m - 1;
    }
    setIsSorting(false);
  };

  const startAlgorithm = () => {
    setActiveIndex(-1); setFoundIndex(-1); setTargetValue(null);
    if (algorithm === 'bubble') bubbleSort();
    else if (algorithm === 'selection') selectionSort();
    else if (algorithm === 'insertion') insertionSort();
    else if (algorithm === 'merge') mergeSort();
    else if (algorithm === 'quick') quickSort();
    else if (algorithm === 'linear') linearSearch();
    else if (algorithm === 'binary') binarySearch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 flex items-center gap-3">
            <Activity className="w-8 h-8 text-brand-blue" />
            Simulation & Visualizer
          </h1>
          <p className="text-gray-400 mt-2">See your code execute in memory or simulate standard algorithms.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
            ${activeTab === 'visualizer' 
              ? 'bg-brand-blue text-black font-bold shadow-lg shadow-brand-blue/20 scale-[1.02]' 
              : 'glass-panel text-gray-400 hover:text-white'}`}
        >
          <Code2 className="w-5 h-5" />
          Code Execution Visualizer
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
            ${activeTab === 'simulator' 
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20 scale-[1.02]' 
              : 'glass-panel text-gray-400 hover:text-white'}`}
        >
          <Settings2 className="w-5 h-5" />
          Array Algorithms
        </button>
        <button
          onClick={() => setActiveTab('pathfinding')}
          className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
            ${activeTab === 'pathfinding' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]' 
              : 'glass-panel text-gray-400 hover:text-white'}`}
        >
          <Map className="w-5 h-5" />
          Pathfinding Grid (Graph)
        </button>
        <button
          onClick={() => setActiveTab('quantum')}
          className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
            ${activeTab === 'quantum' 
              ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20 scale-[1.02]' 
              : 'glass-panel text-gray-400 hover:text-white'}`}
        >
          <Atom className="w-5 h-5" />
          IQTA (Quantum Simulator)
        </button>
      </div>

      {/* Code Visualizer Tab */}
      {activeTab === 'visualizer' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Editor Side */}
          <div className="glass-panel p-6 flex flex-col h-[800px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-brand-blue" />
                Code Editor
              </h2>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Algorithm Library Loader */}
                <div className="flex-1 sm:flex-none relative group">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        setCode(e.target.value);
                        setLanguage('3'); // Force Python since templates are Python
                        setIsVisualizing(false);
                      }
                    }}
                    className="w-full bg-black/50 border border-brand-blue/30 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-blue transition-colors appearance-none pr-8 cursor-pointer text-sm"
                  >
                    <option value="">📖 Load from Algorithm Library...</option>
                    {ALGORITHM_LIBRARY.map((category, catIdx) => (
                      <optgroup key={catIdx} label={category.category} className="bg-gray-900 text-gray-300">
                        {category.algorithms.map((algo, idx) => (
                          <option key={idx} value={algo.code}>
                            {algo.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <select 
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-blue transition-colors text-sm"
                >
                  <option value="3">Python 3</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="js">JavaScript</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 rounded-xl overflow-hidden border border-white/5 relative">
              <Editor
                height="100%"
                defaultLanguage={language === '3' ? 'python' : language === 'cpp' ? 'cpp' : language}
                language={language === '3' ? 'python' : language === 'cpp' ? 'cpp' : language}
                theme="vs-dark"
                value={code}
                onChange={(val) => {
                  setCode(val || '');
                  setIsVisualizing(false);
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <button
              onClick={handleVisualize}
              className="w-full mt-4 bg-brand-blue hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Visualize Execution Step-by-Step
            </button>
          </div>

          {/* Visualization Side */}
          <div className="glass-panel p-6 flex flex-col h-[800px] relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Memory & Call Stack Visualizer</h2>
              {isVisualizing && (
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Maximize className="w-4 h-4" /> Fullscreen
                </button>
              )}
            </div>
            <div className="flex-1 bg-white rounded-xl overflow-hidden relative">
              {!isVisualizing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <Activity className="w-16 h-16 text-gray-300 mb-4 opacity-50" />
                  <p className="text-gray-500 font-medium">Click 'Visualize' to render the memory execution graph.</p>
                </div>
              ) : (
                <iframe 
                  src={iframeUrl}
                  title="Code Visualizer"
                  className="absolute inset-0 w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Visualizer Overlay */}
      {isFullscreen && isVisualizing && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col p-4 md:p-8 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-brand-blue" />
              Fullscreen Execution Visualizer
            </h2>
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-500 p-3 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-2xl">
            <iframe 
              src={iframeUrl}
              title="Code Visualizer Fullscreen"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
            />
          </div>
        </div>
      )}

      {/* Algorithm Simulator Tab */}
      {activeTab === 'simulator' && (
        <div className="glass-panel p-6 flex flex-col min-h-[600px]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">{ALGORITHM_DETAILS[algorithm].name}</span> Simulator
              </h2>
              <p className="text-gray-400 mt-1">Watch how elements sort in real-time.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 bg-black/30 p-2 rounded-xl">
              <select 
                value={algorithm}
                onChange={(e) => {
                  setAlgorithm(e.target.value);
                  setActiveIndex(-1);
                  setFoundIndex(-1);
                  setTargetValue(null);
                }}
                disabled={isSorting}
                className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
              >
                <optgroup label="Sorting">
                  <option value="bubble">Bubble Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="merge">Merge Sort</option>
                  <option value="quick">Quick Sort</option>
                </optgroup>
                <optgroup label="Searching">
                  <option value="linear">Linear Search</option>
                  <option value="binary">Binary Search</option>
                </optgroup>
              </select>
              
              <div className="flex flex-col px-4 border-l border-r border-white/10">
                <label className="text-xs text-gray-400 mb-1">Speed</label>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  value={510 - sortingSpeed} // Invert slider logic visually
                  onChange={(e) => setSortingSpeed(510 - e.target.value)}
                  disabled={isSorting}
                  className="w-24 accent-purple-500"
                />
              </div>
              <button 
                onClick={generateRandomArray}
                disabled={isSorting}
                className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                title="Generate New Array"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={startAlgorithm}
                disabled={isSorting}
                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayCircle className="w-5 h-5" />
                {isSorting ? 'Running...' : 'Simulate'}
              </button>
            </div>
          </div>
          
          {targetValue !== null && (
            <div className="bg-black/30 text-white font-medium p-3 rounded-lg border border-white/10 mb-4 inline-block w-fit mx-auto animate-fade-in text-center">
              Target to find: <span className="text-purple-400 text-xl font-bold ml-2">{targetValue}</span>
              {foundIndex !== -1 && <span className="text-green-500 ml-4 font-bold">✓ Found at index {foundIndex}!</span>}
            </div>
          )}

          <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-[300px] bg-black/40 rounded-xl p-8 border border-white/5">
            {array.map((value, idx) => (
              <div
                key={idx}
                className={`w-8 sm:w-12 rounded-t-sm transition-all duration-100 ease-in-out relative group ${
                  idx === foundIndex ? 'bg-green-500' : idx === activeIndex ? 'bg-red-500' : 'bg-purple-500'
                }`}
                style={{ height: `${value}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {value}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 p-6 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-2">Algorithm Insights</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><strong className="text-purple-400">Time Complexity:</strong> {ALGORITHM_DETAILS[algorithm].time}</li>
                <li><strong className="text-purple-400">Space Complexity:</strong> {ALGORITHM_DETAILS[algorithm].space}</li>
                <li><strong className="text-purple-400">Mechanism:</strong> {ALGORITHM_DETAILS[algorithm].mech}</li>
              </ul>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-white/5">
              <h3 className="text-white font-medium mb-2">Pseudo-code</h3>
              <pre className="text-sm font-mono text-gray-400 overflow-x-auto whitespace-pre-wrap">
{ALGORITHM_DETAILS[algorithm].code}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Pathfinding Simulator Tab */}
      {activeTab === 'pathfinding' && (
        <PathfindingVisualizer />
      )}

      {/* IQTA Quantum Simulator Tab */}
      {activeTab === 'quantum' && (
        <QuantumGateSimulator />
      )}
    </div>
  );
};

export default SimulationPortal;
