import React, { useState, useEffect } from 'react';
import { ClipboardList, BookOpen, Calendar, ChevronRight, ArrowLeft, Download } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function AssignedTasksPortal({ user, setActiveTab }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, 'assigned_tasks'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(fetched);
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

  const handleDownload = (task) => {
    const textContent = `Subject: ${task.subject}\nDay/Timeline: ${task.dayLabel}\nTitle: ${task.title}\n\nDescription:\n${task.description}`;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-blue tracking-tight drop-shadow-[0_0_15px_rgba(74,211,166,0.3)]">
              Assigned Tasks
            </h1>
            <p className="text-gray-400 mt-2 text-sm font-semibold tracking-wide">
              {selectedSubject ? `Viewing timeline for ${selectedSubject}` : "Select a subject to view your daily tasks."}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl icon-3d-teal flex items-center justify-center rotate-3 hover:rotate-6 transition-transform">
            <ClipboardList size={28} />
          </div>
        </div>

        {/* View Toggle */}
        {!selectedSubject ? (
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
        ) : (
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
                <div key={task.id} className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl group-hover:bg-brand-purple/10 transition-all"></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-black uppercase tracking-widest border border-brand-purple/30">
                      {task.dayLabel}
                    </div>
                    <button 
                      onClick={() => handleDownload(task)}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-teal/20 transition-all z-10"
                      title="Download Task"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
