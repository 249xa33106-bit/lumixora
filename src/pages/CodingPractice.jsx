import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Flame, Award, ArrowRight, CheckCircle2, Circle, Code, Sparkles, Filter, Briefcase, GraduationCap, Edit3, Trash2, Plus, Upload, X, Loader2, ArrowUpDown, ArrowUp, ArrowDown, Shuffle, Brain } from 'lucide-react';
import { PROBLEMS, CATEGORIES } from '../config/problemsData';
import { useData } from '../context/DataContext';
import { supabase } from '../config/supabase';
import { generateProblemFromCode } from '../services/aiCodingService';
import { useToast } from '../context/ToastContext';
import AptitudeArena from '../components/AptitudeArena';

const sandboxProblem = {
  id: 'sandbox',
  title: 'Code Playground & Sandbox',
  difficulty: 'Easy',
  category: 'General Playground',
  timeLimit: '2s',
  memoryLimit: '256MB',
  statement: `Welcome to the Code Playground!\n\nYou can write, compile, and run any program of your choice in Javascript, Python, C++, Java, Go, or C.\n\nUse the console below to check compilation outputs, print statements, and runtime details.\n\nType your program in the editor and click "Run Code" to compile.`,
  starterTemplates: {
    javascript: `// Write any JavaScript program here\nconsole.log("Hello, Lumixora World!");\n\nfunction main() {\n  let a = 5;\n  let b = 10;\n  console.log("Sum is:", a + b);\n}\nmain();`,
    python: `# Write any Python program here\nprint("Hello, Lumixora World!")\n\ndef main():\n    a = 5\n    b = 10\n    print(f"Sum is: {a + b}")\n\nmain()`,
    cpp: `// Write any C++ program here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Lumixora World!" << endl;\n    int a = 5, b = 10;\n    cout << "Sum is: " << (a + b) << endl;\n    return 0;\n}`,
    java: `// Write any Java program here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Lumixora World!");\n        int a = 5, b = 10;\n        System.out.println("Sum is: " + (a + b));\n    }\n}`,
    go: `// Write any Go program here\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Lumixora World!")\n    a, b := 5, 10\n    fmt.Printf("Sum is: %d\\n", a+b)\n}`,
    c: `// Write any C program here\n#include <stdio.h>\n\nint main() {\n    printf("Hello, Lumixora World!\\n");\n    int a = 5, b = 10;\n    printf("Sum is: %d\\n", a + b);\n    return 0;\n}`
  },
  testCases: [
    {
      input: "No inputs required",
      output: "Expected output varies"
    }
  ],
  hiddenTestCases: [],
  editorial: "Use this sandbox to practice any coding exercises, experiment with syntax, or test algorithm ideas. Standard library operations are fully simulated."
};

export default function CodingPractice({ setSelectedProblem, setActiveTab, user }) {
  const { notes, addNote, updateNote, deleteNote } = useData();
  const { addToast } = useToast();

  const isFounder = useMemo(() => {
    return user?.role === 'founder' || 
            
            
           user?.email?.toLowerCase() === 'founder@lumixora.com';
  }, [user]);

  const [viewMode, setViewMode] = useState('problems'); // 'problems' or 'leaderboard'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All', 'Solved', 'Unsolved'
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [sortBy, setSortBy] = useState('none'); // 'none', 'difficulty', 'category', 'acceptance', 'title'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblemId, setEditingProblemId] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [activeStarterTab, setActiveStarterTab] = useState('javascript');
  const fileInputRef = useRef(null);

  const initialFormState = {
    title: '',
    difficulty: 'Easy',
    category: 'Arrays',
    acceptanceRate: '50.0%',
    statement: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    functionName: 'solve',
    examples: '[]',
    testCases: '[]',
    hiddenTestCases: '[]',
    hints: '',
    editorial: '',
    starterTemplates: {
      javascript: 'function solve() {\n  \n}',
      python: 'def solve():\n    pass',
      cpp: 'class Solution {\npublic:\n    void solve() {\n        \n    }\n};',
      java: 'class Solution {\n    public void solve() {\n        \n    }\n}',
      go: 'func solve() {\n    \n}'
    }
  };

  const [formState, setFormState] = useState(initialFormState);

  // Parse dynamic problems from notes and merge with static
  const allProblemsList = useMemo(() => {
    const dynamicProblems = notes
      .filter(n => n.type === 'code_arena_problem' || n.category === 'code_arena_problem')
      .map(n => {
        return {
          id: n.id,
          title: n.title,
          difficulty: n.difficulty || 'Easy',
          acceptanceRate: n.acceptanceRate || '50.0%',
          category: n.problemCategory || 'Arrays',
          frequency: n.frequency || 50,
          popularity: n.popularity || 50,
          statement: n.statement || '',
          inputFormat: n.inputFormat || '',
          outputFormat: n.outputFormat || '',
          constraints: n.constraints || [],
          timeLimit: n.timeLimit || '1000ms',
          memoryLimit: n.memoryLimit || '256MB',
          examples: n.examples || [],
          testCases: n.testCases || [],
          hiddenTestCases: n.hiddenTestCases || [],
          hints: n.hints || [],
          editorial: n.editorial || '',
          starterTemplates: n.starterTemplates || initialFormState.starterTemplates,
          companies: Array.isArray(n.companies) ? n.companies : (typeof n.companies === 'string' ? n.companies.split(',').map(c => c.trim()) : ['Custom']),
          functionName: n.functionName || 'solve',
          type: 'code_arena_problem'
        };
      });

    // Remove duplicates if same IDs exist
    const dynamicIds = new Set(dynamicProblems.map(p => p.id));
    const staticProblems = PROBLEMS.filter(p => !dynamicIds.has(p.id));

    return [...staticProblems, ...dynamicProblems];
  }, [notes]);

  // Load solved problems list from localStorage
  const solvedProblemIds = useMemo(() => {
    if (!user) return [];
    const submissions = (() => { try { const item = localStorage.getItem(`lumixora_submissions_${user.id}`); return item ? JSON.parse(item) : []; } catch (e) { return []; } })();
    return [...new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId))];
  }, [user]);

  const streak = useMemo(() => {
    if (!user) return 0;
    const submissions = (() => { try { const item = localStorage.getItem(`lumixora_submissions_${user.id}`); return item ? JSON.parse(item) : []; } catch (e) { return []; } })();
    const accepted = submissions.filter(s => s.status === 'Accepted');
    const dates = accepted.map(s => new Date(s.timestamp).toDateString());
    const uniqueDates = [...new Set(dates)].map(d => new Date(d));
    uniqueDates.sort((a, b) => b - a);

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (uniqueDates.length > 0) {
      const firstDate = new Date(uniqueDates[0]);
      firstDate.setHours(0,0,0,0);
      const diffTime = Math.abs(today - firstDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        currentStreak = 1;
        let expectedDate = firstDate;
        for (let i = 1; i < uniqueDates.length; i++) {
          const nextDate = new Date(uniqueDates[i]);
          nextDate.setHours(0,0,0,0);
          const diff = Math.round((expectedDate - nextDate) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            currentStreak++;
            expectedDate = nextDate;
          } else {
            break;
          }
        }
      }
    }
    return currentStreak;
  }, [user]);

  const [realLeaderboard, setRealLeaderboard] = useState([]);
  const [leaderboardFilterYear, setLeaderboardFilterYear] = useState('All');
  const [leaderboardFilterBranch, setLeaderboardFilterBranch] = useState('All');
  const [leaderboardFilterTier, setLeaderboardFilterTier] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: dbUsers, error } = await supabase.from('users').select('*');
        if (!error && dbUsers) {
          const activeUsers = dbUsers.filter(u => u.status !== 'trashed');
          const formatted = activeUsers.map(dbUser => {
            const isCurrentUser = user && dbUser.id === user.id;
            let cleanName = dbUser.name || 'Student';
            let parsedData = {};
            try {
              if (cleanName.includes('{')) {
                const jsonStr = cleanName.substring(cleanName.indexOf('{'));
                cleanName = cleanName.substring(0, cleanName.indexOf('{')).trim();
                parsedData = JSON.parse(jsonStr);
              }
              if (cleanName.includes('-')) cleanName = cleanName.split('-')[0].trim();
            } catch (_e) {
              if (cleanName.includes('{')) cleanName = cleanName.split('{')[0].trim();
            }

            const totalXp = dbUser.xp || 0;
            let tier = 'Bronze';
            if (totalXp > 40000) tier = 'Diamond';
            else if (totalXp > 30000) tier = 'Platinum';
            else if (totalXp > 20000) tier = 'Gold';
            else if (totalXp > 10000) tier = 'Silver';

            return {
              id: dbUser.id,
              name: cleanName,
              xp: totalXp,
              solved: dbUser.badges ? dbUser.badges.length : 0, 
              tier,
              year: dbUser.year || parsedData.year || 'Unknown',
              branch: dbUser.qualification || parsedData.qualification || 'CSE',
              college: dbUser.college || parsedData.college || 'GPREC',
              badgesCount: dbUser.badges ? dbUser.badges.length : 0,
              isCurrentUser
            };
          });

          if (user && !formatted.some(u => u.id === user.id)) {
            const totalXp = parseInt(localStorage.getItem('lumixora_xp') || '0');
            let tier = 'Bronze';
            if (totalXp > 40000) tier = 'Diamond';
            else if (totalXp > 30000) tier = 'Platinum';
            else if (totalXp > 20000) tier = 'Gold';
            else if (totalXp > 10000) tier = 'Silver';
            
            let storedUser = null;
            try { storedUser = (() => { try { const item = localStorage.getItem('lumixora_user'); return item ? JSON.parse(item) : {}; } catch (e) { return {}; } })(); } catch(_e){}

            formatted.push({
              id: user.id,
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'You',
              xp: totalXp,
              solved: solvedProblemIds.length,
              tier,
              year: storedUser?.year || '1st Year',
              branch: storedUser?.qualification || 'CSE',
              college: storedUser?.college || 'GPREC',
              badgesCount: 0,
              isCurrentUser: true
            });
          }

          let finalBoard = formatted.map(u => {
            if (u.isCurrentUser) {
              const currentXp = Math.max(u.xp, parseInt(localStorage.getItem('lumixora_xp') || '0'));
              let tier = 'Bronze';
              if (currentXp > 40000) tier = 'Diamond';
              else if (currentXp > 30000) tier = 'Platinum';
              else if (currentXp > 20000) tier = 'Gold';
              else if (currentXp > 10000) tier = 'Silver';
              
              return {
                ...u,
                solved: Math.max(u.solved, solvedProblemIds.length), 
                xp: currentXp,
                tier
              };
            }
            return u;
          });

          // Filter for GPREC students, fallback to all active coders if empty
          const gprecBoard = finalBoard.filter(u => u.college && u.college.toUpperCase().includes('GPREC'));
          const displayBoard = gprecBoard.length > 0 ? gprecBoard : (finalBoard.length > 0 ? finalBoard : [
            { id: 'demo-1', name: 'Rahul Sharma', xp: 34500, solved: 18, tier: 'Platinum', year: '3rd Year', branch: 'CSE', college: 'GPREC', badgesCount: 5, isCurrentUser: false },
            { id: 'demo-2', name: 'Ananya Reddy', xp: 28900, solved: 14, tier: 'Gold', year: '2nd Year', branch: 'CSM', college: 'GPREC', badgesCount: 4, isCurrentUser: false },
            { id: 'demo-3', name: 'Siddharth Verma', xp: 19400, solved: 11, tier: 'Silver', year: '4th Year', branch: 'ECE', college: 'GPREC', badgesCount: 3, isCurrentUser: false }
          ]);

          displayBoard.sort((a, b) => b.xp - a.xp);
          setRealLeaderboard(displayBoard);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUsers();

    // Real-time Supabase socket subscription for live updates
    const channel = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, solvedProblemIds.length]);

  // Derived filtered leaderboard
  const filteredLeaderboard = useMemo(() => {
    return realLeaderboard.filter(coder => {
      if (leaderboardFilterYear !== 'All' && coder.year !== leaderboardFilterYear) return false;
      if (leaderboardFilterBranch !== 'All' && coder.branch !== leaderboardFilterBranch) return false;
      if (leaderboardFilterTier !== 'All' && coder.tier !== leaderboardFilterTier) return false;
      return true;
    });
  }, [realLeaderboard, leaderboardFilterYear, leaderboardFilterBranch, leaderboardFilterTier]);

  // Extract all unique company tags from our problems for filter list
  const companyTags = useMemo(() => {
    const companies = new Set();
    allProblemsList.forEach(p => p.companies?.forEach(c => companies.add(c)));
    return ['All', ...Array.from(companies)];
  }, [allProblemsList]);

  // Filter and Sort problems list dynamically
  const filteredProblems = useMemo(() => {
    const list = allProblemsList.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.companies?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      
      const isSolved = solvedProblemIds.includes(p.id);
      const matchesStatus = selectedStatus === 'All' || 
                            (selectedStatus === 'Solved' && isSolved) || 
                            (selectedStatus === 'Unsolved' && !isSolved);
                            
      const matchesCompany = selectedCompany === 'All' || p.companies?.includes(selectedCompany);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus && matchesCompany;
    });

    if (sortBy === 'none') return list;

    return [...list].sort((a, b) => {
      let valA, valB;

      if (sortBy === 'difficulty') {
        const difficultyRank = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        valA = difficultyRank[a.difficulty] || 0;
        valB = difficultyRank[b.difficulty] || 0;
      } else if (sortBy === 'category') {
        valA = (a.category || '').toLowerCase();
        valB = (b.category || '').toLowerCase();
      } else if (sortBy === 'title') {
        valA = (a.title || '').toLowerCase();
        valB = (b.title || '').toLowerCase();
      } else if (sortBy === 'acceptance') {
        valA = parseFloat(a.acceptanceRate) || 0;
        valB = parseFloat(b.acceptanceRate) || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allProblemsList, searchTerm, selectedCategory, selectedDifficulty, selectedStatus, selectedCompany, solvedProblemIds, sortBy, sortOrder]);

  const handleToggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const dailyProblem = useMemo(() => {
    // Find Two Sum as default daily challenge, or any unsolved problem
    return allProblemsList.find(p => p.id === 'two-sum') || allProblemsList[0];
  }, [allProblemsList]);

  const handleStartProblem = (problem) => {
    setSelectedProblem(problem);
    setActiveTab('code-editor');
  };

  const handlePickRandom = () => {
    const unsolved = allProblemsList.filter(p => !solvedProblemIds.includes(p.id) && p.id !== 'sandbox');
    if (unsolved.length === 0) {
      addToast({ message: 'You have solved all problems!', type: 'success' });
      return;
    }
    const randomProblem = unsolved[Math.floor(Math.random() * unsolved.length)];
    handleStartProblem(randomProblem);
  };

  const handleFileUpload = async (e) => {
    if (!isFounder) {
      addToast({ message: 'Unauthorized: Only founders can upload code files.', type: 'error' });
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const content = evt.target.result;
        try {
          const generated = await generateProblemFromCode(content, file.name);
          
          setFormState({
            title: generated.title || '',
            difficulty: generated.difficulty || 'Easy',
            category: generated.category || 'Arrays',
            acceptanceRate: generated.acceptanceRate || '50.0%',
            statement: generated.statement || '',
            inputFormat: generated.inputFormat || '',
            outputFormat: generated.outputFormat || '',
            constraints: Array.isArray(generated.constraints) ? generated.constraints.join('\n') : '',
            timeLimit: generated.timeLimit || '1000ms',
            memoryLimit: generated.memoryLimit || '256MB',
            functionName: generated.functionName || 'solve',
            examples: Array.isArray(generated.examples) ? JSON.stringify(generated.examples, null, 2) : '[]',
            testCases: Array.isArray(generated.testCases) ? JSON.stringify(generated.testCases, null, 2) : '[]',
            hiddenTestCases: Array.isArray(generated.hiddenTestCases) ? JSON.stringify(generated.hiddenTestCases, null, 2) : '[]',
            hints: Array.isArray(generated.hints) ? generated.hints.join('\n') : '',
            editorial: generated.editorial || '',
            starterTemplates: generated.starterTemplates || {
              javascript: `function ${generated.functionName || 'solve'}() {\n  \n}`,
              python: `def ${generated.functionName || 'solve'}():\n    pass`,
              cpp: `class Solution {\npublic:\n    void ${generated.functionName || 'solve'}() {\n        \n    }\n};`,
              java: `class Solution {\n    public void ${generated.functionName || 'solve'}() {\n        \n    }\n}`,
              go: `func ${generated.functionName || 'solve'}() {\n    \n}`
            }
          });
          addToast({ message: 'Code analyzed successfully! Form populated.', type: 'success' });
        } catch (err) {
          console.error(err);
          addToast({ message: 'Failed to auto-generate question. Please review your code or format.', type: 'error' });
        } finally {
          setUploadingFile(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to read file.', type: 'error' });
      setUploadingFile(false);
    }
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isFounder) {
      addToast({ message: 'Unauthorized: Only founders can import problems.', type: 'error' });
      return;
    }

    try {
      setUploadingFile(true);
      const text = await file.text();
      const problems = JSON.parse(text);

      if (!Array.isArray(problems)) {
        throw new Error("Invalid format. Expected a JSON array.");
      }

      let count = 0;
      for (const p of problems) {
        const payload = {
          title: p.title || 'Untitled Problem',
          type: 'code_arena_problem',
          category: 'code_arena_problem',
          difficulty: p.difficulty || 'Easy',
          acceptanceRate: p.acceptanceRate || '50.0%',
          problemCategory: p.category || p.problemCategory || 'Arrays',
          statement: p.statement || '',
          inputFormat: p.inputFormat || '',
          outputFormat: p.outputFormat || '',
          constraints: p.constraints || '',
          timeLimit: p.timeLimit || '1000ms',
          memoryLimit: p.memoryLimit || '256MB',
          functionName: p.functionName || 'solve',
          examples: p.examples || [],
          testCases: p.testCases || [],
          hiddenTestCases: p.hiddenTestCases || [],
          hints: p.hints || '',
          editorial: p.editorial || '',
          starterTemplates: p.starterTemplates || initialFormState.starterTemplates,
          frequency: 50,
          popularity: 50,
          companies: p.companies || ['Custom'],
          createdAt: new Date().toISOString()
        };
        await addNote(payload);
        count++;
      }
      
      addToast({ message: `Successfully imported ${count} problems!`, type: 'success' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to import problems. Check JSON format.', type: 'error' });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFixCompanies = async () => {
    const topCompanies = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Bloomberg', 'Uber', 'LinkedIn', 'Adobe'];
    let updatedCount = 0;
    setUploadingFile(true);
    try {
      for (const p of allProblemsList) {
        if (p.companies && p.companies.length === 1 && p.companies[0] === 'Custom') {
          // Pick 2 to 4 random companies
          const shuffled = topCompanies.sort(() => 0.5 - Math.random());
          const numCompanies = Math.floor(Math.random() * 3) + 2;
          const newCompanies = shuffled.slice(0, numCompanies);
          
          await updateNote(p.id, { ...p, companies: newCompanies });
          updatedCount++;
        }
      }
      addToast({ message: `Updated companies for ${updatedCount} problems!`, type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ message: `Failed to fix companies: ${err.message}`, type: 'error' });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    if (!isFounder) {
      addToast({ message: 'Unauthorized: Only founders can save/create problems.', type: 'error' });
      return;
    }
    if (!formState.title.trim()) {
      addToast({ message: 'Title is required', type: 'error' });
      return;
    }

    try {
      const parsedConstraints = formState.constraints.split('\n').map(c => c.trim()).filter(Boolean);
      const parsedHints = formState.hints.split('\n').map(h => h.trim()).filter(Boolean);

      const parsedExamples = JSON.parse(formState.examples || '[]');
      const parsedTestCases = JSON.parse(formState.testCases || '[]');
      const parsedHiddenTestCases = JSON.parse(formState.hiddenTestCases || '[]');

      const problemData = {
        title: formState.title.trim(),
        difficulty: formState.difficulty,
        problemCategory: formState.category,
        acceptanceRate: formState.acceptanceRate.trim() || '50.0%',
        statement: formState.statement.trim(),
        inputFormat: formState.inputFormat.trim(),
        outputFormat: formState.outputFormat.trim(),
        constraints: parsedConstraints,
        timeLimit: formState.timeLimit.trim(),
        memoryLimit: formState.memoryLimit.trim(),
        functionName: formState.functionName.trim() || 'solve',
        examples: parsedExamples,
        testCases: parsedTestCases,
        hiddenTestCases: parsedHiddenTestCases,
        hints: parsedHints,
        editorial: formState.editorial.trim(),
        starterTemplates: formState.starterTemplates,
        type: 'code_arena_problem',
        frequency: 50,
        popularity: 50,
        companies: ['Custom']
      };

      if (editingProblemId) {
        await updateNote(editingProblemId, problemData);
        addToast({ message: 'Problem updated successfully!', type: 'success' });
      } else {
        await addNote(problemData);
        addToast({ message: 'Problem added to Code Arena!', type: 'success' });
      }

      setIsModalOpen(false);
      setEditingProblemId(null);
      setFormState(initialFormState);
    } catch (err) {
      console.error(err);
      addToast({ message: `Error: ${err.message}. Ensure JSON fields are formatted correctly.`, type: 'error' });
    }
  };

  const handleDeleteProblem = async (problemId, e) => {
    e.stopPropagation();
    if (!isFounder) {
      addToast({ message: 'Unauthorized: Only founders can delete problems.', type: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this problem?')) {
      await deleteNote(problemId);
      addToast({ message: 'Problem deleted successfully.', type: 'success' });
    }
  };

  const handleEditProblem = (p, e) => {
    e.stopPropagation();
    if (!isFounder) {
      addToast({ message: 'Unauthorized: Only founders can edit problems.', type: 'error' });
      return;
    }
    setEditingProblemId(p.id);
    setFormState({
      title: p.title || '',
      difficulty: p.difficulty || 'Easy',
      category: p.category || 'Arrays',
      acceptanceRate: p.acceptanceRate || '50.0%',
      statement: p.statement || '',
      inputFormat: p.inputFormat || '',
      outputFormat: p.outputFormat || '',
      constraints: Array.isArray(p.constraints) ? p.constraints.join('\n') : '',
      timeLimit: p.timeLimit || '1000ms',
      memoryLimit: p.memoryLimit || '256MB',
      functionName: p.functionName || 'solve',
      examples: JSON.stringify(p.examples || [], null, 2),
      testCases: JSON.stringify(p.testCases || [], null, 2),
      hiddenTestCases: JSON.stringify(p.hiddenTestCases || [], null, 2),
      hints: Array.isArray(p.hints) ? p.hints.join('\n') : '',
      editorial: p.editorial || '',
      starterTemplates: p.starterTemplates || initialFormState.starterTemplates
    });
    setIsModalOpen(true);
  };

  const statistics = useMemo(() => {
    const total = allProblemsList.length;
    const solved = solvedProblemIds.length;
    const easyCount = allProblemsList.filter(p => p.difficulty === 'Easy').length;
    const easySolved = allProblemsList.filter(p => p.difficulty === 'Easy' && solvedProblemIds.includes(p.id)).length;
    const medCount = allProblemsList.filter(p => p.difficulty === 'Medium').length;
    const medSolved = allProblemsList.filter(p => p.difficulty === 'Medium' && solvedProblemIds.includes(p.id)).length;
    const hardCount = allProblemsList.filter(p => p.difficulty === 'Hard').length;
    const hardSolved = allProblemsList.filter(p => p.difficulty === 'Hard' && solvedProblemIds.includes(p.id)).length;

    return {
      total,
      solved,
      easyCount,
      easySolved,
      medCount,
      medSolved,
      hardCount,
      hardSolved,
      rate: total > 0 ? Math.round((solved / total) * 100) : 0
    };
  }, [allProblemsList, solvedProblemIds]);

  return (
    <div className="space-y-8 animate-fade-in text-white pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-100 uppercase tracking-tight flex items-center gap-2">
            <Code className="w-8 h-8 text-brand-teal" />
            <span>Lumixora Code Arena</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Practice programming challenges, trace step-by-step loops with AI visualizers, and ace your technical interviews!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Add Problem Button only for Founder */}
          {isFounder && (
            <>
              <button 
                onClick={() => { setEditingProblemId(null); setFormState(initialFormState); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-teal hover:opacity-95 text-black font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Add Custom Problem</span>
              </button>
              
              <input 
                type="file" 
                accept=".json"
                ref={fileInputRef}
                onChange={handleBulkImport}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs shadow-sm transition-all cursor-pointer border border-white/10"
                title="Import bulk LeetCode questions via JSON"
              >
                <Code className="w-4 h-4" />
                <span>{uploadingFile ? 'Importing...' : 'Bulk Import JSON'}</span>
              </button>
              <button 
                onClick={handleFixCompanies}
                disabled={uploadingFile}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold text-xs shadow-sm transition-all cursor-pointer border border-blue-500/30"
                title="Randomly assign FAANG companies to imported problems"
              >
                <Briefcase className="w-4 h-4" />
                <span>Fix Companies</span>
              </button>
            </>
          )}

          {/* Free Sandbox Button */}
          <button 
            onClick={() => handleStartProblem(sandboxProblem)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-purple hover:opacity-95 text-white font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="hidden xl:inline">Free Sandbox</span>
          </button>

          {/* Level Stats Pill */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl icon-3d-teal flex items-center justify-center">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase block leading-none">Solving Stats</span>
              <span className="text-xs font-semibold text-gray-200 mt-1 block">
                {statistics.solved}/{statistics.total} Solved ({statistics.rate}%)
              </span>
            </div>
            {isFounder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Reset demo solving stats to zero?')) {
                    localStorage.setItem(`lumixora_submissions_${user?.id}`, '[]');
                    localStorage.setItem('lumixora_xp', '0');
                    window.location.reload();
                  }
                }}
                className="ml-2 px-2 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all opacity-0 group-hover:opacity-100"
                title="Reset Demo Stats"
              >
                Reset Zero
              </button>
            )}
          </div>

          {/* Streak Pill */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Flame className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase block leading-none">Current Streak</span>
              <span className="text-xs font-semibold text-gray-200 mt-1 block">
                {streak} Day{streak !== 1 && 's'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
        <button
          onClick={() => setViewMode('problems')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all cursor-pointer ${
            viewMode === 'problems' ? 'border-brand-teal text-brand-teal' : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          Coding Problems
        </button>
        <button
          onClick={() => setViewMode('aptitude')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'aptitude' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4" /> Aptitude Arena
        </button>
        <button
          onClick={() => setViewMode('leaderboard')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            viewMode === 'leaderboard' ? 'border-brand-pink text-brand-pink' : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" /> GPREC Leaderboard
        </button>
      </div>

      {viewMode === 'aptitude' && (
        <AptitudeArena user={user} isFounder={isFounder} />
      )}

      {viewMode === 'leaderboard' && (
        <div className="glass-panel p-8 rounded-3xl animate-fade-in">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide flex items-center gap-3">
              <Award className="w-8 h-8 text-brand-pink" /> G PULLA REDDY ENGINEERING COLLEGE CODER'S LEADERSHIP BOARD
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <select 
                value={leaderboardFilterYear}
                onChange={(e) => setLeaderboardFilterYear(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-brand-teal transition-all cursor-pointer"
              >
                <option value="All">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              <select 
                value={leaderboardFilterBranch}
                onChange={(e) => setLeaderboardFilterBranch(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-brand-teal transition-all cursor-pointer"
              >
                <option value="All">All Branches</option>
                <option value="CSM">CSM</option>
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="ECE">ECE</option>
                <option value="CIVIL">CIVIL</option>
                <option value="MECH">MECH</option>
              </select>
              <select 
                value={leaderboardFilterTier}
                onChange={(e) => setLeaderboardFilterTier(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-brand-teal transition-all cursor-pointer"
              >
                <option value="All">All Tiers</option>
                <option value="Diamond">Diamond</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
              </select>
            </div>
          </div>
          
          {/* Podium UI */}
          {filteredLeaderboard.length >= 3 && (
            <div className="flex justify-center items-end gap-2 md:gap-6 mb-12 mt-8 pt-8">
              {/* Rank 2 - Silver */}
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-400/20 border-2 border-gray-400 flex items-center justify-center text-xl font-bold mb-3 shadow-[0_0_15px_rgba(156,163,175,0.4)]">
                  {filteredLeaderboard[1].name.charAt(0)}
                </div>
                <div className="text-sm font-bold text-gray-200 mb-1">{filteredLeaderboard[1].name}</div>
                <div className="text-xs text-brand-pink font-mono mb-2">{filteredLeaderboard[1].xp.toLocaleString()} XP</div>
                <div className="w-20 md:w-28 h-24 md:h-32 bg-gradient-to-t from-white/5 to-gray-400/20 rounded-t-xl border-t border-x border-gray-400/50 flex items-start justify-center pt-4">
                  <span className="text-2xl font-extrabold text-gray-400">2</span>
                </div>
              </div>

              {/* Rank 1 - Gold */}
              <div className="flex flex-col items-center animate-fade-in-up z-10" style={{ animationDelay: '0ms' }}>
                <div className="text-yellow-400 mb-2 animate-bounce"><Award className="w-8 h-8" /></div>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center text-2xl font-bold mb-3 shadow-[0_0_30px_rgba(250,204,21,0.6)]">
                  {filteredLeaderboard[0].name.charAt(0)}
                </div>
                <div className="text-base font-bold text-white mb-1">{filteredLeaderboard[0].name}</div>
                <div className="text-sm text-brand-pink font-mono font-extrabold mb-2">{filteredLeaderboard[0].xp.toLocaleString()} XP</div>
                <div className="w-24 md:w-32 h-32 md:h-40 bg-gradient-to-t from-white/5 to-yellow-400/20 rounded-t-xl border-t border-x border-yellow-400/50 flex items-start justify-center pt-4">
                  <span className="text-4xl font-extrabold text-yellow-400">1</span>
                </div>
              </div>

              {/* Rank 3 - Bronze */}
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-600/20 border-2 border-orange-600 flex items-center justify-center text-xl font-bold mb-3 shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                  {filteredLeaderboard[2].name.charAt(0)}
                </div>
                <div className="text-sm font-bold text-gray-200 mb-1">{filteredLeaderboard[2].name}</div>
                <div className="text-xs text-brand-pink font-mono mb-2">{filteredLeaderboard[2].xp.toLocaleString()} XP</div>
                <div className="w-20 md:w-28 h-16 md:h-24 bg-gradient-to-t from-white/5 to-orange-600/20 rounded-t-xl border-t border-x border-orange-600/50 flex items-start justify-center pt-4">
                  <span className="text-2xl font-extrabold text-orange-600">3</span>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto bg-black/20 rounded-2xl border border-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-gray-500 uppercase tracking-wider bg-white/5">
                  <th className="p-4 font-bold">Rank</th>
                  <th className="p-4 font-bold">Coder</th>
                  <th className="p-4 font-bold">Tier</th>
                  <th className="p-4 font-bold hidden md:table-cell">Branch</th>
                  <th className="p-4 font-bold hidden md:table-cell">Year</th>
                  <th className="p-4 font-bold text-center">Badges</th>
                  <th className="p-4 font-bold text-right">Solved</th>
                  <th className="p-4 font-bold text-right">Total XP</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.length === 0 && (
                  <tr><td colSpan="8" className="p-8 text-center text-gray-500 italic">No competitors found matching these filters.</td></tr>
                )}
                {filteredLeaderboard.map((coder, index) => (
                  <tr key={coder.id} className={`border-b border-white/5 transition-colors ${coder.isCurrentUser ? 'bg-brand-teal/10' : 'hover:bg-white/5'}`}>
                    <td className="p-4 text-sm font-bold text-gray-400">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          coder.isCurrentUser ? 'bg-brand-teal text-black shadow-[0_0_10px_rgba(0,245,212,0.3)]' : 'bg-white/10 text-gray-300'
                        }`}>
                          {coder.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`font-bold text-sm ${coder.isCurrentUser ? 'text-brand-teal' : 'text-gray-200'}`}>
                          {coder.name} {coder.isCurrentUser && '(You)'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                        coder.tier === 'Diamond' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' :
                        coder.tier === 'Platinum' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                        coder.tier === 'Gold' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                        coder.tier === 'Silver' ? 'bg-gray-400/10 text-gray-300 border-gray-400/30' :
                        'bg-orange-500/10 text-orange-400 border-orange-500/30'
                      }`}>
                        {coder.tier}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell text-xs font-semibold text-gray-400">{coder.branch}</td>
                    <td className="p-4 hidden md:table-cell text-xs font-semibold text-gray-400">{coder.year}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-full border border-brand-teal/20">
                          {coder.badgesCount}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-xs font-mono text-gray-300">{coder.solved}</td>
                    <td className="p-4 text-right text-sm font-extrabold text-brand-pink font-mono">{coder.xp.toLocaleString()} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'problems' && (
        <>
          {/* Top Section: Daily Challenge & Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Challenge Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-brand-teal/5 via-transparent to-transparent border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-semibold tracking-wide bg-brand-teal/15 text-brand-teal border border-white/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>Daily Challenge</span>
            </span>
            <span className="text-[10px] text-brand-orange font-bold flex items-center gap-0.5">
              <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
              <span>Double Resonance (2x AP)</span>
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                {dailyProblem.title}
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                  dailyProblem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/25' :
                  dailyProblem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/25' :
                  'bg-red-500/10 text-red-400 border border-red-500/25'
                }`}>
                  {dailyProblem.difficulty}
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                Given an array of integers <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-[10px]">nums</code> and an integer <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-[10px]">target</code>, return indices of the two numbers such that they add up to target.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                Category: {dailyProblem.category}
              </span>
              <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                Acceptance: {dailyProblem.acceptanceRate}
              </span>
              <button 
                onClick={() => handleStartProblem(dailyProblem)}
                className="ml-auto flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal/95 text-black text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <span>Code Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Breakdown Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-blue" />
            <span>Difficulty Breakdown</span>
          </h3>

          <div className="space-y-3.5">
            {/* Easy Row */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-green-400">Easy</span>
                <span className="text-gray-400">{statistics.easySolved}/{statistics.easyCount}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-green-400 rounded-full transition-all duration-500" 
                  style={{ width: `${statistics.easyCount > 0 ? (statistics.easySolved / statistics.easyCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Row */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-yellow-400">Medium</span>
                <span className="text-gray-400">{statistics.medSolved}/{statistics.medCount}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                  style={{ width: `${statistics.medCount > 0 ? (statistics.medSolved / statistics.medCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard Row */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-red-400">Hard</span>
                <span className="text-gray-400">{statistics.hardSolved}/{statistics.hardCount}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-red-400 rounded-full transition-all duration-500" 
                  style={{ width: `${statistics.hardCount > 0 ? (statistics.hardSolved / statistics.hardCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Filter controls */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4">
        
        {/* Row 1: Search & Dropdowns */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code problems, topics, companies..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Difficulty Dropdown */}
            <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/5 text-xs text-gray-300">
              <Filter className="w-3.5 h-3.5 text-brand-teal" />
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px]"
              >
                <option value="All" className="bg-[#0b0b14] text-white">All Difficulties</option>
                <option value="Easy" className="bg-[#0b0b14] text-green-400">Easy</option>
                <option value="Medium" className="bg-[#0b0b14] text-yellow-400">Medium</option>
                <option value="Hard" className="bg-[#0b0b14] text-red-400">Hard</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/5 text-xs text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px]"
              >
                <option value="All" className="bg-[#0b0b14] text-white">All Statuses</option>
                <option value="Solved" className="bg-[#0b0b14] text-white">Solved</option>
                <option value="Unsolved" className="bg-[#0b0b14] text-white">Unsolved</option>
              </select>
            </div>

            {/* Company Filter */}
            <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/5 text-xs text-gray-300">
              <Briefcase className="w-3.5 h-3.5 text-brand-pink" />
              <select 
                value={selectedCompany} 
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px]"
              >
                <option value="All" className="bg-[#0b0b14] text-white">All Companies</option>
                {companyTags.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c} className="bg-[#0b0b14] text-white">{c}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/5 text-xs text-gray-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-teal" />
              <select 
                value={sortBy} 
                onChange={(e) => {
                  const val = e.target.value;
                  setSortBy(val);
                  if (val !== 'none' && sortOrder === 'none') {
                    setSortOrder('asc');
                  }
                }}
                className="bg-transparent outline-none cursor-pointer font-semibold tracking-wide text-[10px]"
              >
                <option value="none" className="bg-[#0b0b14] text-white">Sort By (Default)</option>
                <option value="title" className="bg-[#0b0b14] text-white">Title</option>
                <option value="difficulty" className="bg-[#0b0b14] text-white">Difficulty</option>
                <option value="category" className="bg-[#0b0b14] text-white">Category</option>
                <option value="acceptance" className="bg-[#0b0b14] text-white">Acceptance Rate</option>
              </select>
            </div>

            {/* Sort Order Toggle */}
            {sortBy !== 'none' && (
              <button
                type="button"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center justify-center p-2 rounded-xl bg-black/35 border border-white/5 text-brand-teal hover:bg-white/5 transition-colors cursor-pointer"
                title={`Sort Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                {sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Category Tags scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 custom-scrollbar max-w-full">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-semibold tracking-wide transition-all duration-300 ${
              selectedCategory === 'All'
                ? 'bg-brand-teal text-black font-bold shadow-sm'
                : 'bg-white/5 border border-white/5 hover:border-white/10 text-gray-400'
            }`}
          >
            All Topics
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-[10px] font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                selectedCategory === cat
                  ? 'bg-brand-blue text-black font-bold shadow-sm'
                  : 'bg-white/5 border border-white/5 hover:border-white/10 text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Main Problems Table Grid */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] text-gray-400 font-bold tracking-wide select-none">
                <th className="p-4 pl-6 text-center w-16">Status</th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleToggleSort('title')}>
                  <div className="flex items-center gap-1 justify-start">
                    <span>Title</span>
                    {sortBy === 'title' && <span className="text-brand-teal ml-0.5">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </th>
                <th className="p-4 text-center cursor-pointer hover:text-white" onClick={() => handleToggleSort('difficulty')}>
                  <div className="flex items-center gap-1 justify-center">
                    <span>Difficulty</span>
                    {sortBy === 'difficulty' && <span className="text-brand-teal ml-0.5">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </th>
                <th className="p-4 hidden sm:table-cell cursor-pointer hover:text-white" onClick={() => handleToggleSort('category')}>
                  <div className="flex items-center gap-1 justify-start">
                    <span>Category</span>
                    {sortBy === 'category' && <span className="text-brand-teal ml-0.5">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </th>
                <th className="p-4 hidden md:table-cell">Companies</th>
                <th className="p-4 text-right pr-6 cursor-pointer hover:text-white" onClick={() => handleToggleSort('acceptance')}>
                  <div className="flex items-center gap-1 justify-end">
                    <span>Acceptance</span>
                    {sortBy === 'acceptance' && <span className="text-brand-teal ml-0.5">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </div>
                </th>
                <th className="p-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-gray-500 italic">
                    No coding problems found matching your filters.
                  </td>
                </tr>
              ) : filteredProblems.map((problem) => {
                const isSolved = solvedProblemIds.includes(problem.id);
                return (
                  <tr 
                    key={problem.id}
                    onClick={() => handleStartProblem(problem)}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="p-4 pl-6 text-center">
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 mx-auto" />
                      )}
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-gray-100 hover:text-brand-teal transition-colors block">
                          {problem.title}
                        </span>
                        <span className="text-[9px] text-gray-500 tracking-wide font-semibold sm:hidden block mt-1">
                          {problem.category}
                        </span>
                      </div>
                    </td>
 
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded leading-none ${
                        problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
 
                    <td className="p-4 text-xs text-gray-400 hidden sm:table-cell">
                      {problem.category}
                    </td>
 
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          let displayCompanies = problem.companies || [];
                          if (displayCompanies.length === 1 && displayCompanies[0] === 'Custom') {
                            const seed = (problem.title || '').length + (problem.id ? problem.id.charCodeAt(0) : 0);
                            const topFAANG = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Bloomberg', 'Uber'];
                            const shuffled = [...topFAANG].sort((a, b) => {
                              const hashA = (a.charCodeAt(0) * seed) % 100;
                              const hashB = (b.charCodeAt(0) * seed) % 100;
                              return hashA - hashB;
                            });
                            const num = (seed % 3) + 2;
                            displayCompanies = shuffled.slice(0, num);
                          }

                          return (
                            <>
                              {displayCompanies.slice(0, 3).map((comp, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-gray-400 font-bold tracking-wide"
                                >
                                  {comp}
                                </span>
                              ))}
                              {displayCompanies.length > 3 && (
                                <span className="text-[9px] text-gray-500 font-bold pl-1 align-middle leading-[18px]">
                                  +{displayCompanies.length - 3} more
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </td>
 
                    <td className="p-4 text-right pr-6 text-xs text-gray-300 font-semibold font-mono">
                      {problem.acceptanceRate}
                    </td>

                    <td className="p-4 text-center" onClick={e => e.stopPropagation()}>
                      {problem.type === 'code_arena_problem' && isFounder ? (
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={(e) => handleEditProblem(problem, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-brand-blue/20 text-gray-400 hover:text-brand-blue transition-colors cursor-pointer"
                            title="Edit Problem"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteProblem(problem.id, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Problem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[9px] text-gray-600 font-bold tracking-wide">
                          {problem.type === 'code_arena_problem' ? 'Custom' : 'System'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {/* Add / Edit Problem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border border-white/10 relative text-left bg-gradient-to-br from-[#0c0c16] via-transparent to-transparent">
            
            <button 
              onClick={() => { setIsModalOpen(false); setEditingProblemId(null); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-100 uppercase tracking-tight flex items-center gap-2 mb-6">
              <Code className="w-6 h-6 text-brand-teal" />
              <span>{editingProblemId ? 'Edit Program Question' : 'Add New Program Question'}</span>
            </h2>

            {/* Quick Upload Section */}
            <div className="bg-brand-purple/5 border border-white/10 rounded-2xl p-5 mb-6 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-purple/5 rounded-full blur-xl"></div>
              <h3 className="text-xs font-semibold text-gray-200 tracking-wide flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-brand-purple" />
                <span>Upload Program File to Auto-Generate Question</span>
              </h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Upload a completed solution file (in Javascript, Python, C++, Java, or Go) and Lumixora AI will automatically parse it, generate a complete question, statement, test cases, and starter templates!
              </p>
              
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 px-4 py-2 bg-brand-purple/20 hover:bg-brand-purple/35 text-brand-purple font-extrabold text-[10px] tracking-wider uppercase rounded-xl border border-white/10 cursor-pointer transition-all">
                  {uploadingFile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Program Code File</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept=".js,.py,.cpp,.cc,.h,.java,.go,.c"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="hidden" 
                  />
                </label>
                {uploadingFile && (
                  <span className="text-[11px] text-brand-purple font-bold animate-pulse">Analyzing program structure and building questions...</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveProblem} className="space-y-6">
              
              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Problem Title *</label>
                  <input 
                    type="text" 
                    required
                    value={formState.title}
                    onChange={e => setFormState({ ...formState, title: e.target.value })}
                    placeholder="e.g. Two Sum"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold tracking-wide">Difficulty *</label>
                    <select 
                      value={formState.difficulty}
                      onChange={e => setFormState({ ...formState, difficulty: e.target.value })}
                      className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-white/10"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold tracking-wide">Category Topic *</label>
                    <select 
                      value={formState.category}
                      onChange={e => setFormState({ ...formState, category: e.target.value })}
                      className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-white/10"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Acceptance Rate</label>
                  <input 
                    type="text" 
                    value={formState.acceptanceRate}
                    onChange={e => setFormState({ ...formState, acceptanceRate: e.target.value })}
                    placeholder="e.g. 50.0%"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Time Limit</label>
                  <input 
                    type="text" 
                    value={formState.timeLimit}
                    onChange={e => setFormState({ ...formState, timeLimit: e.target.value })}
                    placeholder="e.g. 1000ms"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Memory Limit</label>
                  <input 
                    type="text" 
                    value={formState.memoryLimit}
                    onChange={e => setFormState({ ...formState, memoryLimit: e.target.value })}
                    placeholder="e.g. 256MB"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Target Function Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formState.functionName}
                    onChange={e => setFormState({ ...formState, functionName: e.target.value })}
                    placeholder="e.g. twoSum"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Textareas */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold tracking-wide">Problem Statement *</label>
                <textarea 
                  required
                  rows="4"
                  value={formState.statement}
                  onChange={e => setFormState({ ...formState, statement: e.target.value })}
                  placeholder="Describe the coding challenge here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-white/10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Input Format</label>
                  <textarea 
                    rows="2"
                    value={formState.inputFormat}
                    onChange={e => setFormState({ ...formState, inputFormat: e.target.value })}
                    placeholder="Describe inputs..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Output Format</label>
                  <textarea 
                    rows="2"
                    value={formState.outputFormat}
                    onChange={e => setFormState({ ...formState, outputFormat: e.target.value })}
                    placeholder="Describe return value..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Constraints (One per line)</label>
                  <textarea 
                    rows="3"
                    value={formState.constraints}
                    onChange={e => setFormState({ ...formState, constraints: e.target.value })}
                    placeholder="e.g. 2 <= nums.length <= 10^4"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold tracking-wide">Hints (One per line)</label>
                  <textarea 
                    rows="3"
                    value={formState.hints}
                    onChange={e => setFormState({ ...formState, hints: e.target.value })}
                    placeholder="e.g. Think about sorting first..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* JSON Arrays */}
              <div className="space-y-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                <h3 className="text-xs font-bold text-gray-300 tracking-wide border-b border-white/5 pb-2">Structured Examples & Test Cases (JSON format)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-teal font-bold tracking-wide">Examples JSON Array *</label>
                    <textarea 
                      required
                      rows="4"
                      value={formState.examples}
                      onChange={e => setFormState({ ...formState, examples: e.target.value })}
                      placeholder='[\n  {\n    "input": "nums = [2,7], target = 9",\n    "output": "[0,1]",\n    "explanation": "..." \n  }\n]'
                      className="w-full bg-[#10101b] border border-white/10 rounded-xl p-3 text-white text-[11px] font-mono focus:outline-none focus:border-white/10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-blue font-bold tracking-wide">Sample Test Cases JSON Array *</label>
                    <textarea 
                      required
                      rows="4"
                      value={formState.testCases}
                      onChange={e => setFormState({ ...formState, testCases: e.target.value })}
                      placeholder='[\n  { "input": "[2,7]\\n9", "output": "[0,1]" }\n]'
                      className="w-full bg-[#10101b] border border-white/10 rounded-xl p-3 text-white text-[11px] font-mono focus:outline-none focus:border-white/10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-pink font-bold tracking-wide">Hidden Test Cases JSON Array *</label>
                    <textarea 
                      required
                      rows="4"
                      value={formState.hiddenTestCases}
                      onChange={e => setFormState({ ...formState, hiddenTestCases: e.target.value })}
                      placeholder='[\n  { "input": "[3,3]\\n6", "output": "[0,1]" }\n]'
                      className="w-full bg-[#10101b] border border-white/10 rounded-xl p-3 text-white text-[11px] font-mono focus:outline-none focus:border-white/10"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 italic leading-normal">
                  * Note: In test cases inputs, separate arguments/parameters with a newline (\\n) so the sandbox runner can pass them as separate parameters. Ensure all JSON strings use double quotes properly.
                </p>
              </div>

              {/* Starter Templates */}
              <div className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-xs font-bold text-gray-300 tracking-wide">Starter Code Templates</h3>
                  <div className="flex gap-1">
                    {['javascript', 'python', 'cpp', 'java', 'go'].map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveStarterTab(lang)}
                        className={`px-2 py-1 rounded text-[9px] font-semibold tracking-wide transition-all ${activeStarterTab === lang ? 'bg-brand-blue text-black font-bold' : 'text-gray-400 hover:text-white bg-white/5'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase">Template Code ({activeStarterTab})</label>
                  <textarea 
                    rows="6"
                    value={formState.starterTemplates[activeStarterTab]}
                    onChange={e => {
                      const newTemplates = { ...formState.starterTemplates };
                      newTemplates[activeStarterTab] = e.target.value;
                      setFormState({ ...formState, starterTemplates: newTemplates });
                    }}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl p-3 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold tracking-wide">Editorial & Solution Explainers</label>
                <textarea 
                  rows="3"
                  value={formState.editorial}
                  onChange={e => setFormState({ ...formState, editorial: e.target.value })}
                  placeholder="Explain the optimal solution and details..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingProblemId(null); }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wide rounded-2xl border border-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-brand-teal hover:opacity-95 text-black font-semibold text-xs tracking-wide rounded-2xl shadow-sm transition-all cursor-pointer"
                >
                  {editingProblemId ? 'Save Changes' : 'Create Question'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}
