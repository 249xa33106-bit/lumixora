import React, { useState, useEffect } from 'react';
import { ClipboardList, BookOpen, Calendar, ChevronRight, ArrowLeft, Download, Trophy, CheckCircle, Check, Loader2, Copy, Code2, Sparkles, Terminal } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy, where, addDoc, serverTimestamp, setDoc, doc, onSnapshot } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { DEFAULT_ASSIGNED_TASKS } from '../data/defaultTasksData';
import { notifyFounderTask } from '../services/founderNotificationService';

// Inline Markdown Parser for bold text and code snippets
function formatInlineMarkdown(text) {
  if (!text) return '';
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-white/10 text-brand-teal font-mono text-xs font-semibold border border-white/10">
          {code}
        </code>
      );
    }

    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, j) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        const boldText = bPart.slice(2, -2);
        return (
          <strong key={j} className="font-extrabold text-white">
            {boldText}
          </strong>
        );
      }
      return bPart;
    });
  });
}

// Rich Markdown Content Renderer for Theory & Concept Details
function RenderMarkdown({ content }) {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="space-y-3 text-sm text-gray-200 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Header 3: ### Title
        if (trimmed.startsWith('### ')) {
          const headerText = trimmed.replace('### ', '');
          return (
            <div key={idx} className="pt-4 pb-1 border-b border-white/10 flex items-center gap-2">
              <span className="text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-teal-200 to-brand-blue">
                {headerText}
              </span>
            </div>
          );
        }

        // Header 2: ## Title
        if (trimmed.startsWith('## ')) {
          const headerText = trimmed.replace('## ', '');
          return (
            <h4 key={idx} className="text-lg font-black text-white pt-3 border-b border-white/10 pb-1">
              {headerText}
            </h4>
          );
        }

        // Numbered item: 1. **Title**: Text
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const text = numMatch[2];
          return (
            <div key={idx} className="flex items-start gap-3 pl-1 py-1">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-teal/20 text-brand-teal border border-brand-teal/40 text-xs font-bold flex items-center justify-center mt-0.5">
                {num}
              </span>
              <div className="flex-1 text-gray-300">
                {formatInlineMarkdown(text)}
              </div>
            </div>
          );
        }

        // Bullet item: - **Sub**: Text
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const text = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-6 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 flex-shrink-0"></span>
              <div className="flex-1 text-gray-300">
                {formatInlineMarkdown(text)}
              </div>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-gray-300 leading-relaxed">
            {formatInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

// High-Contrast Interactive Code Block with One-Click Copy
function CodeBlockViewer({ code, language = "JAVA" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-[#0a0c12] shadow-2xl overflow-hidden">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono font-bold text-gray-400 pl-2 uppercase tracking-widest flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-teal" /> {language} Source Implementation
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-brand-teal" />
              <span className="text-brand-teal">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-5 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed text-gray-200 bg-black/40">
        <pre className="whitespace-pre">{code}</pre>
      </div>
    </div>
  );
}

// Structured Practice Problems & Interview Exercises Viewer
function PracticeProblemsViewer({ content }) {
  if (!content) return null;
  const problems = content.split('\n').filter(p => p.trim());

  return (
    <div className="grid grid-cols-1 gap-3">
      {problems.map((prob, idx) => {
        const cleanText = prob.trim();
        return (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-brand-purple/20 bg-brand-purple/5 hover:border-brand-purple/40 hover:bg-brand-purple/10 transition-all">
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-brand-purple/20 text-brand-pink flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-brand-purple/30">
                #{idx + 1}
              </div>
              <div className="flex-1 text-sm text-gray-200 leading-relaxed">
                {formatInlineMarkdown(cleanText.replace(/^\d+\.\s*/, ''))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AssignedTasksPortal({ user, setActiveTab }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const deletedTaskIds = new Set(JSON.parse(localStorage.getItem('lumixora_deleted_task_ids') || '[]'));
      return DEFAULT_ASSIGNED_TASKS.filter(t => !deletedTaskIds.has(t.id));
    } catch (e) {
      return DEFAULT_ASSIGNED_TASKS;
    }
  });
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [view, setView] = useState('tasks'); // 'tasks' | 'leaderboard'
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchTasks();
    if (user) {
      fetchUserCompletedTasks();
    }

    // Real-time live listener for assigned tasks
    let unsubscribeTasks = () => {};
    if (db) {
      try {
        const q = query(collection(db, 'assigned_tasks'), orderBy('createdAt', 'desc'));
        unsubscribeTasks = onSnapshot(q, (snapshot) => {
          const deletedTaskIds = new Set(JSON.parse(localStorage.getItem('lumixora_deleted_task_ids') || '[]'));
          const live = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(t => !deletedTaskIds.has(t.id));
          
          const taskMap = new Map();
          DEFAULT_ASSIGNED_TASKS.forEach(t => {
            if (!deletedTaskIds.has(t.id)) taskMap.set(t.id, t);
          });
          live.forEach(t => {
            if (!deletedTaskIds.has(t.id)) taskMap.set(t.id, t);
          });
          setTasks(Array.from(taskMap.values()));
        }, (err) => {
          console.warn("Realtime assigned_tasks snapshot notice:", err);
        });
      } catch (e) {}
    }

    return () => {
      unsubscribeTasks();
    };
  }, [user]);

  useEffect(() => {
    if (view === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [view]);

  const fetchUserCompletedTasks = async () => {
    try {
      const q = query(collection(db, 'completed_tasks'), where('userId', '==', user?.uid || user?.email || 'default'));
      const snap = await getDocs(q);
      const completedIds = new Set();
      snap.forEach(doc => {
        completedIds.add(doc.data().taskId);
      });
      setCompletedTasks(completedIds);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'completed_tasks'));
      const snap = await getDocs(q);
      const userCounts = {};
      snap.forEach(doc => {
        const data = doc.data();
        let uName = data.userName || 'Anonymous';
        if (uName.includes('{')) {
          uName = uName.substring(0, uName.indexOf('{')).trim() || 'Anonymous';
        }
        if (!userCounts[uName]) userCounts[uName] = 0;
        userCounts[uName]++;
      });

      // Apply overrides if founder manually edited the leaderboard
      try {
        const overrideSnap = await getDocs(collection(db, 'consistency_overrides'));
        overrideSnap.forEach(doc => {
          const data = doc.data();
          if (data.userName) {
            userCounts[data.userName] = data.daysCompleted;
          }
        });
      } catch (e) {
        console.warn("Consistency overrides fetch notice:", e);
      }

      const lb = Object.keys(userCounts).map(name => ({
        userName: name,
        daysCompleted: userCounts[name]
      })).sort((a, b) => b.daysCompleted - a.daysCompleted);
      setLeaderboardData(lb);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (task) => {
    if (completedTasks.has(task.id)) return;
    setActionLoading(true);
    try {
      await addDoc(collection(db, 'completed_tasks'), {
        userId: user?.uid || user?.email || 'default',
        userName: (user?.name || user?.displayName || 'Anonymous').split('{')[0].trim(),
        taskId: task.id,
        subject: task.subject,
        dayLabel: task.dayLabel,
        completedAt: serverTimestamp()
      });
      setCompletedTasks(prev => {
        const newSet = new Set(prev);
        newSet.add(task.id);
        return newSet;
      });
      notifyFounderTask({
        user: user?.name || user?.displayName || 'Scholar',
        email: user?.email || '',
        college: user?.college || 'GPREC',
        department: user?.department || user?.branch || 'CSE',
        title: `${task.subject || 'Subject'} (${task.dayLabel || 'Day 1'})`
      });
      addToast({ message: 'Task marked as completed!', type: 'success' });
    } catch (error) {
      console.error("Error marking task as complete:", error);
      addToast({ message: 'Error marking task as complete.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const deletedTaskIds = new Set(JSON.parse(localStorage.getItem('lumixora_deleted_task_ids') || '[]'));
      let fetched = [];
      if (db) {
        try {
          const q = query(collection(db, 'assigned_tasks'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            fetched = snapshot.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(t => !deletedTaskIds.has(t.id));
          }
        } catch (e) {
          console.warn("Firestore assigned_tasks fetch notice:", e);
        }
      }

      const taskMap = new Map();
      DEFAULT_ASSIGNED_TASKS.forEach(t => {
        if (!deletedTaskIds.has(t.id)) taskMap.set(t.id, t);
      });
      fetched.forEach(t => {
        if (!deletedTaskIds.has(t.id)) taskMap.set(t.id, t);
      });

      const combined = Array.from(taskMap.values());
      setTasks(combined);
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group tasks by subject
  const subjectsMap = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = [];
    }
    acc[task.subject].push(task);
    return acc;
  }, {});

  const subjects = Object.keys(subjectsMap);

  const handleDownload = (task, e) => {
    if (e) e.stopPropagation();
    const textContent = `Subject: ${task.subject}\nDay/Timeline: ${task.dayLabel}\nTitle: ${task.title}\n\nDescription:\n${task.description}\n\nCode References:\n${task.codeReferences || 'None'}\n\nPractice Problems:\n${task.practiceProblems || 'None'}`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task.subject}_${task.dayLabel}_Task.txt`.replace(/\s+/g, '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen p-8 ml-64 bg-primary-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-teal/20 border-t-brand-teal animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen p-8 ml-64 bg-primary-bg">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-blue tracking-tight drop-shadow-[0_0_15px_rgba(74,211,166,0.3)]">
              Assigned Tasks
            </h1>
            <p className="text-gray-400 mt-2 text-sm font-semibold tracking-wide">
              {view === 'leaderboard' ? "Global consistency leaderboard" : selectedSubject ? `Viewing timeline for ${selectedSubject}` : "Select a subject to view your daily tasks."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setView(view === 'tasks' ? 'leaderboard' : 'tasks');
                setSelectedSubject(null);
                setSelectedTask(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                view === 'leaderboard' 
                  ? 'bg-brand-pink text-white hover:bg-brand-pink/90' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Trophy size={18} /> {view === 'leaderboard' ? 'Back to Tasks' : 'Leaderboard'}
            </button>
            <div className="w-14 h-14 rounded-2xl icon-3d-teal flex items-center justify-center rotate-3 hover:rotate-6 transition-transform">
              <ClipboardList size={28} />
            </div>
          </div>
        </div>

        {/* Views */}
        {view === 'leaderboard' ? (
          <div className="glass-panel p-8 rounded-3xl border border-white/5 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-brand-pink" />
              <h2 className="text-2xl font-extrabold text-white">Consistency Leaderboard</h2>
            </div>
            
            {leaderboardData.length === 0 ? (
              <p className="text-gray-400 text-center py-10">No tasks have been completed yet. Be the first!</p>
            ) : (
              <div className="space-y-3">
                {leaderboardData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-pink/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                        index === 1 ? 'bg-gray-400/20 text-gray-300' :
                        index === 2 ? 'bg-orange-600/20 text-orange-500' :
                        'bg-white/5 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-bold text-gray-200">{entry.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-teal font-extrabold text-lg">{entry.daysCompleted}</span>
                      <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Days</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !selectedSubject ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.length === 0 ? (
              <div className="col-span-full glass-panel p-12 text-center rounded-3xl border border-white/5">
                <p className="text-gray-400">No subjects or tasks have been assigned yet.</p>
              </div>
            ) : (
              subjects.map(subject => (
                <div 
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-brand-teal/50 transition-all cursor-pointer group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100">{subject}</h3>
                  <p className="text-sm text-gray-400 mt-2">{subjectsMap[subject].length} Tasks Available</p>
                  <div className="mt-6 flex items-center text-brand-teal text-sm font-bold tracking-wide">
                    VIEW TIMELINE <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : !selectedTask ? (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedSubject(null)}
              className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Subjects
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjectsMap[selectedSubject]
                .sort((a, b) => {
                  const aNum = parseInt(a.dayLabel.replace(/\D/g, '')) || 0;
                  const bNum = parseInt(b.dayLabel.replace(/\D/g, '')) || 0;
                  return aNum - bNum;
                })
                .map(task => (
                <div key={task.id} onClick={() => setSelectedTask(task)} className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group cursor-pointer hover:border-brand-purple/30 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl group-hover:bg-brand-purple/10 transition-all"></div>
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-black uppercase tracking-widest border border-brand-purple/30">
                      {task.dayLabel}
                    </div>
                    <div className="flex items-center gap-2">
                      {completedTasks.has(task.id) && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-brand-teal/10 text-brand-teal text-[10px] font-bold uppercase tracking-wider border border-brand-teal/20">
                          <CheckCircle size={12} /> Completed
                        </div>
                      )}
                      <button 
                        onClick={(e) => handleDownload(task, e)}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-teal/20 transition-all cursor-pointer"
                        title="Download Task"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-100 mb-2 relative z-10">{task.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap line-clamp-3 relative z-10">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
             <button 
               onClick={() => setSelectedTask(null)}
               className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest cursor-pointer"
             >
               <ArrowLeft size={16} className="mr-2" /> Back to Timeline
             </button>
             
             <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none"></div>
               
               <div className="flex items-center justify-between mb-6 relative z-10">
                 <div className="flex items-center gap-3">
                   <div className="px-4 py-1.5 rounded-full bg-brand-purple/20 text-brand-purple text-sm font-black uppercase tracking-widest border border-brand-purple/30">
                     {selectedTask.dayLabel}
                   </div>
                   <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">{selectedTask.subject}</span>
                 </div>
                 <div className="flex gap-3">
                   {completedTasks.has(selectedTask.id) ? (
                     <div className="px-4 py-2 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center gap-2 text-brand-teal font-bold text-sm">
                       <Check size={16} /> Completed
                     </div>
                   ) : (
                     <button 
                       onClick={() => handleMarkCompleted(selectedTask)}
                       disabled={actionLoading}
                       className="px-4 py-2 rounded-xl bg-brand-teal text-black flex items-center gap-2 hover:bg-brand-teal/90 transition-all cursor-pointer font-bold text-sm disabled:opacity-50"
                     >
                       {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
                       Mark as Completed
                     </button>
                   )}
                   <button 
                     onClick={(e) => handleDownload(selectedTask, e)}
                     className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-gray-300 hover:text-white hover:bg-brand-purple/20 transition-all cursor-pointer font-bold text-sm"
                     title="Download Task"
                   >
                     <Download size={16} /> Download
                   </button>
                 </div>
               </div>
               
               <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight relative z-10">{selectedTask.title}</h2>
               
                <div className="space-y-8 relative z-10">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-teal" /> Task Details & Theoretical Concepts
                    </h3>
                    <div className="bg-black/40 rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl">
                      <RenderMarkdown content={selectedTask.description} />
                    </div>
                  </div>
                  
                  {selectedTask.codeReferences && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-brand-teal" /> Code References & Implementations
                      </h3>
                      <CodeBlockViewer code={selectedTask.codeReferences} language={selectedTask.subject.includes('Python') ? 'PYTHON' : 'JAVA'} />
                    </div>
                  )}
                  
                  {selectedTask.practiceProblems && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-brand-pink" /> Practical Problems & Coding Exercises
                      </h3>
                      <PracticeProblemsViewer content={selectedTask.practiceProblems} />
                    </div>
                  )}
                </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
}
