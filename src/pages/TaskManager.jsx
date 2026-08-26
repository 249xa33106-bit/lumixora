import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, AlertTriangle, Plus, Trash2, CheckCircle2, Circle, 
  Sparkles, Edit3, X, Bell, BellRing, Volume2, ShieldAlert, Check, RefreshCw
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';

// Web Audio Alarm Synthesizer Engine
const playAlarmSynth = (toneType = 'siren') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (toneType === 'siren') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.9);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } else if (toneType === 'beep') {
      [0, 0.2, 0.4].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1040, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.12);
      });
    } else if (toneType === 'bell') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (e) {
    console.error("Audio synth error:", e);
  }
};

const triggerDesktopNotification = (title, message) => {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(`🚨 DEADLINE ALARM BUZZER: ${title}`, {
        body: message,
        icon: '/lumixora_logo.jpg',
        tag: 'alarm-buzzer'
      });
    } catch(e) {}
  }
};

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

  // Student Alarms & Deadline Buzzer State
  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem('lumixora_student_alarms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    // Default initial sample alarm
    const now = new Date();
    const future = new Date(now.getTime() + 15 * 60 * 1000); // 15 mins in future
    const hoursStr = String(future.getHours()).padStart(2, '0');
    const minsStr = String(future.getMinutes()).padStart(2, '0');

    return [
      {
        id: 'alarm-sample-1',
        title: 'Submit Machine Learning Assignment',
        category: 'Submission',
        priority: 'High',
        targetDate: now.toISOString().split('T')[0],
        targetTime: `${hoursStr}:${minsStr}`,
        tone: 'siren',
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [activeBuzzerAlarm, setActiveBuzzerAlarm] = useState(null); // Active Red Alert Modal
  const [alarmForm, setAlarmForm] = useState({
    title: '',
    category: 'Study',
    priority: 'High',
    targetDate: new Date().toISOString().split('T')[0],
    targetTime: '18:00',
    tone: 'siren'
  });

  // Simulated Exam Countdowns
  const [examCountdown, setExamCountdown] = useState(null);
  const [targetExamDate, setTargetExamDate] = useState(() => {
    return localStorage.getItem('lumixora_targetExamDate') || null;
  });
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examDateInput, setExamDateInput] = useState('');

  // Timetable State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClassIndex, setEditingClassIndex] = useState(null);
  const [classForm, setClassForm] = useState({ day: 'Mon', time: '09:00', subject: '', type: 'Lecture', duration: '1h' });

  // Save to LocalStorage automatically
  useEffect(() => {
    localStorage.setItem('lumixora_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('lumixora_student_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    if (targetExamDate) {
      localStorage.setItem('lumixora_targetExamDate', targetExamDate);
    } else {
      localStorage.removeItem('lumixora_targetExamDate');
    }
  }, [targetExamDate]);

  // Request Notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Real-time 1-Second Alarm Verification Monitor Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setAlarms(prevAlarms => {
        let hasChanges = false;
        const nextAlarms = prevAlarms.map(alarm => {
          if (alarm.status === 'Completed') return alarm;

          // Parse deadline timestamp
          const [hours, mins] = (alarm.targetTime || '23:59').split(':').map(Number);
          const deadline = new Date(alarm.targetDate || now.toISOString().split('T')[0]);
          deadline.setHours(hours, mins, 0, 0);

          // Check if snoozed
          if (alarm.status === 'Snoozed' && alarm.snoozedUntil) {
            if (now.getTime() < alarm.snoozedUntil) {
              return alarm;
            }
          }

          // Check if deadline has passed AND task is NOT ticked!
          if (now.getTime() >= deadline.getTime() && alarm.status !== 'Alarm Triggered') {
            hasChanges = true;
            playAlarmSynth(alarm.tone || 'siren');
            triggerDesktopNotification(
              alarm.title,
              `⚠️ Target time (${alarm.targetTime}) passed! You haven't ticked this task as completed.`
            );
            setActiveBuzzerAlarm({ 
              ...alarm, 
              deadlineStr: deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            });
            return { ...alarm, status: 'Alarm Triggered' };
          }
          return alarm;
        });

        if (hasChanges) {
          localStorage.setItem('lumixora_student_alarms', JSON.stringify(nextAlarms));
        }
        return nextAlarms;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Exam Countdown calculation
  useEffect(() => {
    if (!targetExamDate) {
      setExamCountdown(null);
      return;
    }
    
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

  // Alarm Actions
  const handleCreateAlarm = (e) => {
    e.preventDefault();
    if (!alarmForm.title.trim() || !alarmForm.targetTime) return;

    const newAlarmObj = {
      ...alarmForm,
      id: `alarm-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setAlarms(prev => [newAlarmObj, ...prev]);
    setIsAlarmModalOpen(false);
    addToast({ message: `🚨 Alarm set for "${alarmForm.title}" at ${alarmForm.targetTime}!`, type: 'success' });
    
    setAlarmForm({
      title: '',
      category: 'Study',
      priority: 'High',
      targetDate: new Date().toISOString().split('T')[0],
      targetTime: '18:00',
      tone: 'siren'
    });
  };

  const handleTickAlarmCompleted = (alarmId) => {
    setAlarms(prev => prev.map(a => a.id === alarmId ? { ...a, status: 'Completed' } : a));
    if (activeBuzzerAlarm && activeBuzzerAlarm.id === alarmId) {
      setActiveBuzzerAlarm(null);
    }
    awardXP('COMPLETE_AI_TASK');
    addToast({ message: '🎉 Excellent! Task ticked as completed. XP awarded!', type: 'success' });
  };

  const handleSnoozeAlarm = (alarmId, minutes) => {
    const snoozeTime = new Date().getTime() + minutes * 60 * 1000;
    setAlarms(prev => prev.map(a => a.id === alarmId ? { ...a, status: 'Snoozed', snoozedUntil: snoozeTime } : a));
    if (activeBuzzerAlarm && activeBuzzerAlarm.id === alarmId) {
      setActiveBuzzerAlarm(null);
    }
    addToast({ message: `⏰ Alarm snoozed for ${minutes} minutes.`, type: 'info' });
  };

  const handleDeleteAlarm = (alarmId) => {
    setAlarms(prev => prev.filter(a => a.id !== alarmId));
    if (activeBuzzerAlarm && activeBuzzerAlarm.id === alarmId) {
      setActiveBuzzerAlarm(null);
    }
    addToast({ message: 'Alarm deleted.', type: 'info' });
  };

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
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER FEATURE: SMART ALARM & DEADLINE BUZZER SYSTEM */}
      <div className="glass-panel p-6 rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-purple-950/20 to-black relative overflow-hidden shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-500/10">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-red-400 bg-red-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-red-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span> Live Monitor Active
                </span>
                <span className="text-[10px] font-extrabold text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Audio Siren + Desktop Alert
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black text-white mt-1">Student Smart Alarm & Deadline Buzzer System</h1>
              <p className="text-xs text-gray-300 font-medium">
                Set alarms for assignments & study deadlines. If you don't tick the task completed before the set time, a loud audio buzzer and desktop alert will fire!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => playAlarmSynth(alarmForm.tone)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
              title="Test Alarm Tone"
            >
              <Volume2 className="w-4 h-4 text-amber-400" /> Test Sound
            </button>

            <button
              onClick={() => {
                if ("Notification" in window) {
                  Notification.requestPermission().then(perm => {
                    if (perm === 'granted') addToast({ message: '🔔 Desktop alerts enabled!', type: 'success' });
                  });
                }
              }}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4 text-brand-teal" /> Enable Alerts
            </button>

            <button
              onClick={() => setIsAlarmModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-brand-pink hover:opacity-90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-red-600/30"
            >
              <Plus className="w-4 h-4" /> Set New Alarm
            </button>
          </div>
        </div>

        {/* ACTIVE ALARMS CAROUSEL / GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {alarms.length === 0 ? (
            <div className="col-span-full p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
              <p className="text-xs text-gray-400 font-semibold">No active alarms set right now.</p>
              <button 
                onClick={() => setIsAlarmModalOpen(true)}
                className="text-xs text-red-400 hover:text-red-300 font-black underline cursor-pointer"
              >
                + Set your first deadline alarm
              </button>
            </div>
          ) : (
            alarms.map(alarm => {
              const isCompleted = alarm.status === 'Completed';
              const isTriggered = alarm.status === 'Alarm Triggered';
              const isSnoozed = alarm.status === 'Snoozed';

              return (
                <div 
                  key={alarm.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-3 ${
                    isTriggered 
                      ? 'bg-red-950/80 border-red-500 shadow-xl ring-2 ring-red-500/50 animate-pulse' 
                      : isCompleted
                      ? 'bg-black/30 border-emerald-500/30 opacity-75'
                      : 'bg-black/50 border-white/15 hover:border-red-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          alarm.priority === 'High' 
                            ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {alarm.priority}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          {alarm.category}
                        </span>
                      </div>
                      <h4 className={`text-sm font-black ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                        {alarm.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleDeleteAlarm(alarm.id)}
                      className="text-gray-500 hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer"
                      title="Delete Alarm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs">
                    <div className="flex items-center gap-1.5 font-extrabold text-gray-200">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      <span>{alarm.targetDate} @ {alarm.targetTime}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-amber-300 font-extrabold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      <Volume2 className="w-3 h-3 text-amber-400" /> Tone: {alarm.tone}
                    </div>
                  </div>

                  {/* ACTION TICK BUTTON */}
                  <div className="flex items-center gap-2 pt-1">
                    {isCompleted ? (
                      <span className="w-full py-2 bg-emerald-500/20 text-emerald-300 font-black text-xs rounded-xl border border-emerald-500/40 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Ticked & Completed
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleTickAlarmCompleted(alarm.id)}
                          className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-black font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <Check className="w-4 h-4 stroke-[3]" /> Tick Completed
                        </button>
                        {isTriggered && (
                          <button
                            onClick={() => handleSnoozeAlarm(alarm.id, 10)}
                            className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black text-xs rounded-xl border border-amber-500/40 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> +10m
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* TWO COLUMN GRID: EXAM TICKER & TASK TODOS / WEEKLY TIMETABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Countdowns & Task Checklist */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Countdowns Grid */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-brand-purple/10 to-transparent">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/5 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-brand-pink" />
              <h2 className="text-base font-bold text-gray-100 tracking-wide">Exam Countdown Ticker</h2>
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
                    <span className="text-[9px] text-gray-500 font-bold tracking-wide mt-1 block">
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
                <h2 className="text-base font-bold text-gray-100 tracking-wide">Milestones & Todos</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Track your assignment deadlines and reviews.</p>
              </div>
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
                <h2 className="text-base font-bold text-gray-100 tracking-wide">Weekly Class Schedule</h2>
              </div>
              <button 
                onClick={() => {
                  setClassForm({ day: 'Mon', time: '09:00', subject: '', type: 'Lecture', duration: '1h' });
                  setEditingClassIndex(null);
                  setIsClassModalOpen(true);
                }}
                className="text-[10px] bg-brand-blue/15 hover:bg-brand-blue text-brand-blue hover:text-black border border-white/10 px-3 py-1 rounded-lg font-bold uppercase transition-colors duration-300 flex items-center gap-1 cursor-pointer"
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
                    <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex flex-col items-center justify-center shrink-0 border border-white/10">
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

      </div>

      {/* CREATE NEW ALARM MODAL */}
      {isAlarmModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-red-500/30 relative space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
                  <BellRing className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Create Deadline Alarm</h3>
                  <p className="text-[11px] text-gray-400">Set a strict target time & buzzer sound.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAlarmModalOpen(false)}
                className="text-gray-400 hover:text-white bg-white/10 w-7 h-7 rounded-full flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAlarm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-extrabold text-gray-300 mb-1">Task / Deadline Title *</label>
                <input 
                  type="text" 
                  required
                  value={alarmForm.title}
                  onChange={e => setAlarmForm({...alarmForm, title: e.target.value})}
                  placeholder="e.g. Submit DBMS Assignment"
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-semibold outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-gray-300 mb-1">Target Date</label>
                  <input 
                    type="date" 
                    required
                    value={alarmForm.targetDate}
                    onChange={e => setAlarmForm({...alarmForm, targetDate: e.target.value})}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-gray-300 mb-1">Target Time *</label>
                  <input 
                    type="time" 
                    required
                    value={alarmForm.targetTime}
                    onChange={e => setAlarmForm({...alarmForm, targetTime: e.target.value})}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-gray-300 mb-1">Category</label>
                  <select
                    value={alarmForm.category}
                    onChange={e => setAlarmForm({...alarmForm, category: e.target.value})}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Submission">Submission</option>
                    <option value="Exam">Exam</option>
                    <option value="Study">Study</option>
                    <option value="Club">Club Event</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-extrabold text-gray-300 mb-1">Priority</label>
                  <select
                    value={alarmForm.priority}
                    onChange={e => setAlarmForm({...alarmForm, priority: e.target.value})}
                    className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3 py-2 text-white font-bold outline-none"
                  >
                    <option value="High" className="text-red-400">High Priority</option>
                    <option value="Medium" className="text-amber-400">Medium Priority</option>
                    <option value="Low" className="text-emerald-400">Normal</option>
                  </select>
                </div>
              </div>

              {/* Sound Tone Picker with Test Button */}
              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-extrabold text-gray-200">Buzzer Sound Tone</label>
                  <button
                    type="button"
                    onClick={() => playAlarmSynth(alarmForm.tone)}
                    className="text-[10px] font-black text-amber-300 bg-amber-400/15 hover:bg-amber-400/25 px-2.5 py-1 rounded-lg border border-amber-400/30 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3 text-amber-400" /> Test Sound
                  </button>
                </div>
                <select
                  value={alarmForm.tone}
                  onChange={e => setAlarmForm({...alarmForm, tone: e.target.value})}
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-3 py-2 text-white font-bold outline-none"
                >
                  <option value="siren">🚨 Emergency Red Siren (High Buzz)</option>
                  <option value="beep">🔔 Digital Bleep Pulse</option>
                  <option value="bell">⏰ Retro Bell Chime</option>
                  <option value="cyber">⚡ Cyber Synth Sweep</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-red-600 to-brand-pink hover:opacity-90 text-white font-black rounded-xl transition-all shadow-lg shadow-red-600/30 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <BellRing className="w-4 h-4" /> Save & Activate Deadline Alarm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN / OVERLAY ACTIVE RED ALERT ALARM MODAL */}
      {activeBuzzerAlarm && (
        <div className="fixed inset-0 z-[9999] bg-red-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-pulse">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border-4 border-red-500 bg-black/90 text-center space-y-6 shadow-[0_0_80px_rgba(239,68,68,0.7)] relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 text-4xl mx-auto animate-bounce shadow-xl shadow-red-500/30">
              🚨
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-red-400 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/40 uppercase tracking-widest">
                Deadline Missed — Alarm Buzzer Active
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                {activeBuzzerAlarm.title}
              </h2>
              <p className="text-xs text-gray-300 font-semibold">
                Target time <span className="text-red-400 font-black">{activeBuzzerAlarm.targetTime}</span> has passed and this task was NOT ticked!
              </p>
            </div>

            <div className="bg-red-900/30 p-4 rounded-2xl border border-red-500/30 text-xs text-red-200 font-medium">
              ⚠️ Complete the task now to disarm the audio buzzer and earn +25 XP, or snooze for additional time.
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2.5">
              <button
                onClick={() => handleTickAlarmCompleted(activeBuzzerAlarm.id)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> TICK AS COMPLETED NOW (+25 XP)
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSnoozeAlarm(activeBuzzerAlarm.id, 10)}
                  className="py-2.5 bg-white/10 hover:bg-white/20 text-amber-300 font-black text-xs rounded-xl border border-white/15 transition-all cursor-pointer"
                >
                  ⏰ Snooze 10m
                </button>
                <button
                  onClick={() => handleSnoozeAlarm(activeBuzzerAlarm.id, 30)}
                  className="py-2.5 bg-white/10 hover:bg-white/20 text-amber-300 font-black text-xs rounded-xl border border-white/15 transition-all cursor-pointer"
                >
                  ⏰ Snooze 30m
                </button>
                <button
                  onClick={() => handleSnoozeAlarm(activeBuzzerAlarm.id, 60)}
                  className="py-2.5 bg-white/10 hover:bg-white/20 text-amber-300 font-black text-xs rounded-xl border border-white/15 transition-all cursor-pointer"
                >
                  ⏰ Snooze 1h
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXAM & CLASS MODALS */}
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/10"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/10"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/10"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/10"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/10"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-white/10"
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
