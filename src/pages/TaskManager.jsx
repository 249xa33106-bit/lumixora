import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, Plus, Trash2, CheckCircle2, Circle, Sparkles, Edit3, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';

export default function TaskManager() {
  const { tasks, addTask, updateTask, deleteTask, loading } = useData();
  const { addToast } = useToast();
  const { awardXP } = useGamification();
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  
  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('lumixora_timetable');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  // Simulated Countdowns
  const [examCountdown, setExamCountdown] = useState(null); // Calculated diff
  const [targetExamDate, setTargetExamDate] = useState(() => {
    return localStorage.getItem('lumixora_targetExamDate') || null;
  }); // Actual user selected date string
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examDateInput, setExamDateInput] = useState('');

  // Timetable State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClassIndex, setEditingClassIndex] = useState(null);
  const [classForm, setClassForm] = useState({ day: 'Mon', time: '09:00', subject: '', type: 'Lecture', duration: '1h' });

  // Save to LocalStorage automatically whenever they change
  useEffect(() => {
    localStorage.setItem('lumixora_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    if (targetExamDate) {
      localStorage.setItem('lumixora_targetExamDate', targetExamDate);
    } else {
      localStorage.removeItem('lumixora_targetExamDate');
    }
  }, [targetExamDate]);

  useEffect(() => {
    if (!targetExamDate) {
      setExamCountdown(null);
      return;
    }
    
    // Initial run immediately
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetExamDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        setExamCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return true;
      }

      setExamCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
      return false;
    };
    
    if (calculateTime()) return;

    const interval = setInterval(() => {
      if (calculateTime()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetExamDate]);

  const handleSaveExamDate = (e) => {
    e.preventDefault();
    if (examDateInput) {
      setTargetExamDate(examDateInput);
      setIsExamModalOpen(false);
      addToast({ message: 'Exam countdown started!', type: 'success' });
    }
  };

  const handleClearExamDate = () => {
    setTargetExamDate(null);
    setExamDateInput('');
    setIsExamModalOpen(false);
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    if (!classForm.subject.trim() || !classForm.time) return;
    
    if (editingClassIndex !== null) {
      const updated = [...timetable];
      updated[editingClassIndex] = classForm;
      setTimetable(updated);
    } else {
      setTimetable([...timetable, classForm]);
    }
    
    setIsClassModalOpen(false);
    setEditingClassIndex(null);
    setClassForm({ day: 'Mon', time: '09:00', subject: '', type: 'Lecture', duration: '1h' });
  };
  
  const handleDeleteClass = (idx) => {
    const updated = [...timetable];
    updated.splice(idx, 1);
    setTimetable(updated);
  };

  const handleEditClass = (idx) => {
    setClassForm(timetable[idx]);
    setEditingClassIndex(idx);
    setIsClassModalOpen(true);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    addTask({
      title: taskText,
      priority: taskPriority,
      status: 'In Progress',
      dueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
    setTaskText('');
    addToast({ message: 'Task added successfully!', type: 'success' });
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const isDone = task.status === 'Done';
      updateTask(id, { status: isDone ? 'In Progress' : 'Done' });
      if (!isDone) {
        addToast({ message: 'Task completed! Great job.', type: 'success' });
        // Automatically award XP for completing task
        awardXP('COMPLETE_AI_TASK');
      }
    }
  };

  const handleDeleteTask = (id) => {
    deleteTask(id);
    addToast({ message: 'Task deleted.', type: 'info' });
  };

  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const progressPercent = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* Left Column: Countdowns & Task Checklist */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Countdowns Grid */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-brand-purple/10 to-transparent">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/5 rounded-full blur-xl"></div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-brand-pink" />
            <h2 className="text-base font-bold text-gray-100 uppercase tracking-wider">Exam Countdown Ticker</h2>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            {examCountdown ? (
              [
                { label: 'Days', val: examCountdown.days, color: 'text-brand-pink' },
                { label: 'Hours', val: examCountdown.hours, color: 'text-brand-purple' },
                { label: 'Mins', val: examCountdown.minutes, color: 'text-brand-blue' },
                { label: 'Secs', val: examCountdown.seconds, color: 'text-brand-teal' }
              ].map((block, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-xl">
                  <span className={`text-2xl sm:text-3xl font-extrabold block tracking-tight ${block.color}`}>
                    {String(block.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1 block">
                    {block.label}
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-4 bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-center">
                <span className="text-xs text-gray-500 italic">No exam date set. Add a date to start tracking!</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 justify-center">
            <AlertTriangle className="w-4 h-4 text-brand-orange animate-pulse" />
            <span>{examCountdown ? "Registration closes soon. Review study guides early!" : "Stay ahead of your schedule by setting upcoming deadlines."}</span>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setIsExamModalOpen(true)}
              className="text-xs font-bold bg-white/5 hover:bg-brand-teal/20 hover:text-brand-teal border border-white/10 px-4 py-2 rounded-lg transition-colors duration-300"
            >
              {targetExamDate ? 'Edit Target Date' : 'Set Exam Date'}
            </button>
          </div>
        </div>

        {/* Task Manager Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-100 uppercase tracking-wider">Milestones & Todos</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">Track your assignment deadlines and reviews.</p>
            </div>
            {/* Progress Bar */}
            <div className="text-right">
              <span className="text-xs font-bold text-brand-teal">{progressPercent}% done</span>
              <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden mt-1 border border-white/5">
                <div 
                  className="h-full bg-brand-teal rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Add new study goal/task..."
              className="flex-1 px-4 py-2 rounded-xl glass-input text-xs"
            />
            
            {/* Priority Selector */}
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="bg-white/5 border border-white/5 text-gray-400 rounded-xl px-2.5 text-xs focus:outline-none"
            >
              <option value="High" className="bg-slate-900 text-brand-pink font-bold">High</option>
              <option value="Medium" className="bg-slate-900 text-brand-blue font-bold">Medium</option>
              <option value="Low" className="bg-slate-900 text-brand-teal font-bold">Low</option>
            </select>

            <button 
              type="submit" 
              disabled={!taskText.trim()}
              className="p-2 rounded-xl bg-brand-teal hover:opacity-95 text-black flex items-center justify-center shrink-0 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Tasks List */}
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[250px]">
            {loading ? (
               Array.from({ length: 4 }).map((_, idx) => (
                 <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between gap-3 animate-pulse">
                   <div className="flex items-center gap-3">
                     <div className="w-5 h-5 rounded-full bg-white/10"></div>
                     <div className="w-32 h-4 bg-white/10 rounded"></div>
                   </div>
                   <div className="w-12 h-4 bg-white/10 rounded"></div>
                 </div>
               ))
            ) : tasks.length === 0 ? (
               <div className="text-center text-gray-500 py-4 text-xs font-medium italic">No tasks yet. Add one above!</div>
            ) : tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 group transition-colors duration-300 ${
                  task.status === 'Done' 
                    ? 'bg-white/5 border-white/5 opacity-55' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="text-gray-400 hover:text-brand-teal transition-colors cursor-pointer"
                  >
                    {task.status === 'Done' ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <span className={`text-xs font-medium text-gray-200 truncate ${task.status === 'Done' ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    task.priority === 'High' ? 'bg-brand-pink/20 text-brand-pink' :
                    task.priority === 'Medium' ? 'bg-brand-blue/20 text-brand-blue' :
                    'bg-brand-teal/20 text-brand-teal'
                  }`}>
                    {task.priority}
                  </span>
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 text-gray-500 hover:text-brand-pink hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Right Column: Weekly Timetable Schedule */}
      <div className="lg:col-span-6">
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-blue" />
              <h2 className="text-base font-bold text-gray-100 uppercase tracking-wider">Weekly Class Schedule</h2>
            </div>
            <button 
              onClick={() => {
                setClassForm({ day: 'Mon', time: '09:00', subject: '', type: 'Lecture', duration: '1h' });
                setEditingClassIndex(null);
                setIsClassModalOpen(true);
              }}
              className="text-[10px] bg-brand-blue/15 hover:bg-brand-blue text-brand-blue hover:text-black border border-brand-blue/20 px-3 py-1 rounded-lg font-bold uppercase transition-colors duration-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 stroke-[3]" /> Add Class
            </button>
          </div>

          {/* Timetable schedule timeline list */}
          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[420px]">
            {timetable.length === 0 ? (
               <div className="p-6 rounded-xl border border-white/5 text-center bg-white/5 mt-4">
                 <p className="text-xs text-gray-500 italic">No classes scheduled yet. Your timetable is empty.</p>
               </div>
            ) : timetable.map((slot, idx) => (
              <div 
                key={idx}
                className="group p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex flex-col items-center justify-center shrink-0 border border-brand-blue/20">
                    <span className="text-[10px] font-extrabold text-brand-blue uppercase">{slot.day}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-200">{slot.subject}</h4>
                    <span className="text-[10px] text-gray-500 font-semibold mt-0.5 block">{slot.type} • {slot.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{slot.time}</span>
                  </div>
                  
                  {/* Edit/Delete Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClass(idx)}
                      className="p-1.5 rounded bg-white/5 hover:bg-brand-teal/20 text-gray-500 hover:text-brand-teal transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClass(idx)}
                      className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Modals */}
      {isExamModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-6 border border-white/10 relative">
            <button 
              onClick={() => setIsExamModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-gray-100 mb-4">Set Exam Target Date</h3>
            <form onSubmit={handleSaveExamDate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Date & Time</label>
                <input 
                  type="date" 
                  value={examDateInput}
                  onChange={(e) => setExamDateInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-teal/50"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-brand-teal hover:bg-brand-teal/90 text-black font-bold py-2 rounded-xl text-xs transition-colors">
                  Start Countdown
                </button>
                {targetExamDate && (
                  <button type="button" onClick={handleClearExamDate} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-2 px-4 rounded-xl text-xs transition-colors">
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {isClassModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-white/10 relative">
            <button 
              onClick={() => setIsClassModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-gray-100 mb-4">
              {editingClassIndex !== null ? 'Edit Class' : 'Add New Class'}
            </h3>
            <form onSubmit={handleSaveClass} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Day</label>
                  <select 
                    value={classForm.day}
                    onChange={(e) => setClassForm({...classForm, day: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-blue/50"
                  >
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                      <option key={d} value={d} className="bg-slate-900">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Time</label>
                  <input 
                    type="time" 
                    value={classForm.time}
                    onChange={(e) => setClassForm({...classForm, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-blue/50"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Subject Name</label>
                <input 
                  type="text" 
                  value={classForm.subject}
                  onChange={(e) => setClassForm({...classForm, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-blue/50"
                  placeholder="e.g. Data Structures"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Type</label>
                  <select 
                    value={classForm.type}
                    onChange={(e) => setClassForm({...classForm, type: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-blue/50"
                  >
                    <option value="Lecture" className="bg-slate-900">Lecture</option>
                    <option value="Lab Class" className="bg-slate-900">Lab Class</option>
                    <option value="Seminar" className="bg-slate-900">Seminar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Duration</label>
                  <input 
                    type="text" 
                    value={classForm.duration}
                    onChange={(e) => setClassForm({...classForm, duration: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-blue/50"
                    placeholder="e.g. 1.5h"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90 text-black font-bold py-2.5 rounded-xl text-xs transition-colors mt-2 cursor-pointer">
                {editingClassIndex !== null ? 'Save Changes' : 'Add to Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
