import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc, setDoc } from 'firebase/firestore';
import { ClipboardList, Trash2, Plus, Server, Edit2, X, Trophy, Save } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function FounderAssignedTasks() {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    subject: '',
    dayLabel: '',
    title: '',
    description: '',
    codeReferences: '',
    practiceProblems: ''
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [editingLeaderboard, setEditingLeaderboard] = useState({});

  useEffect(() => {
    fetchTasks();
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
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

      let overrideSnap = { docs: [] }; try { overrideSnap = await getDocs(collection(db, 'consistency_overrides')); } catch (e) { console.warn("Consistency overrides fetch notice:", e); }
      overrideSnap.forEach(doc => {
        const data = doc.data();
        if (data.userName) {
          userCounts[data.userName] = data.daysCompleted;
        }
      });

      const lb = Object.keys(userCounts).map(name => ({
        userName: name,
        daysCompleted: userCounts[name]
      })).sort((a, b) => b.daysCompleted - a.daysCompleted);
      setLeaderboardData(lb);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleUpdateLeaderboard = async (userName, newDays) => {
    try {
      await setDoc(doc(db, 'consistency_overrides', userName), {
        userName,
        daysCompleted: parseInt(newDays, 10)
      });
      addToast(`Updated ${userName}'s streak`, 'success');
      setEditingLeaderboard(prev => ({ ...prev, [userName]: false }));
      fetchLeaderboard();
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      addToast('Failed to update streak', 'error');
    }
  };

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, 'assigned_tasks'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.dayLabel || !formData.title || !formData.description) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    
    try {
      if (editingTaskId) {
        await updateDoc(doc(db, 'assigned_tasks', editingTaskId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        addToast('Task updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'assigned_tasks'), {
          ...formData,
          createdAt: serverTimestamp()
        });
        addToast('Task assigned successfully!', 'success');
      }
      setFormData({ subject: '', dayLabel: '', title: '', description: '', codeReferences: '', practiceProblems: '' });
      setEditingTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      addToast('Failed to save task', 'error');
    }
  };

  const handleEdit = (task) => {
    setFormData({
      subject: task.subject || '',
      dayLabel: task.dayLabel || '',
      title: task.title || '',
      description: task.description || '',
      codeReferences: task.codeReferences || '',
      practiceProblems: task.practiceProblems || ''
    });
    setEditingTaskId(task.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setFormData({ subject: '', dayLabel: '', title: '', description: '', codeReferences: '', practiceProblems: '' });
    setEditingTaskId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteDoc(doc(db, 'assigned_tasks', id));
      addToast('Task deleted', 'success');
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      addToast('Error deleting task', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="text-brand-purple" />
            {editingTaskId ? 'Edit Task' : 'Assign New Task'}
          </h2>
          {editingTaskId && (
            <button onClick={cancelEdit} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              <X size={16} /> Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Mathematics, ReactJS"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Day/Timeline Label</label>
              <input
                type="text"
                placeholder="e.g. Day 1, Week 1"
                value={formData.dayLabel}
                onChange={e => setFormData({ ...formData, dayLabel: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Task Title</label>
            <input
              type="text"
              placeholder="e.g. Introduction to Algebra"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detailed Description / Instructions</label>
            <textarea
              placeholder="Provide full instructions..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Code References / Snippets (Optional)</label>
              <textarea
                placeholder="Paste code examples here..."
                value={formData.codeReferences}
                onChange={e => setFormData({ ...formData, codeReferences: e.target.value })}
                rows={5}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Practice Problems (Optional)</label>
              <textarea
                placeholder="List problems or exercises here..."
                value={formData.practiceProblems}
                onChange={e => setFormData({ ...formData, practiceProblems: e.target.value })}
                rows={5}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all resize-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple/80 transition-colors flex items-center gap-2"
            >
              {editingTaskId ? <Edit2 size={18} /> : <Plus size={18} />}
              {editingTaskId ? 'Update Task' : 'Publish Task'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Server className="text-brand-teal" />
          Active Assigned Tasks
        </h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-400 animate-pulse">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No tasks assigned yet.</div>
        ) : (
          <div className="space-y-4">
            {tasks?.map(task => (
              <div key={task.id} className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-brand-teal uppercase tracking-widest">{task.subject}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs font-black text-brand-purple uppercase tracking-widest">{task.dayLabel}</span>
                  </div>
                  <h4 className="text-white font-bold">{task.title}</h4>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                </div>
                <div className="flex gap-2 self-end md:self-auto">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-3 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white rounded-xl transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="text-brand-pink" />
          Manage Consistency Leaderboard
        </h2>
        
        <div className="space-y-4">
          {leaderboardData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No leaderboard data found.</div>
          ) : (
            leaderboardData?.map((userLb, index) => (
              <div key={userLb.userName} className="bg-black/30 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-pink/20 flex items-center justify-center text-brand-pink font-bold">
                    {index + 1}
                  </div>
                  <span className="text-white font-bold">{userLb.userName}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {editingLeaderboard[userLb.userName] ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const val = new FormData(e.target).get('days');
                        handleUpdateLeaderboard(userLb.userName, val);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input 
                        type="number" 
                        name="days" 
                        defaultValue={userLb.daysCompleted}
                        min="0"
                        className="w-20 bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-white text-center"
                        autoFocus
                      />
                      <button type="submit" className="p-1.5 bg-brand-teal/20 text-brand-teal rounded hover:bg-brand-teal/40 transition-colors">
                        <Save size={16} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingLeaderboard(prev => ({ ...prev, [userLb.userName]: false }))}
                        className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className="text-brand-teal font-black">{userLb.daysCompleted} DAYS</span>
                      <button
                        onClick={() => setEditingLeaderboard(prev => ({ ...prev, [userLb.userName]: true }))}
                        className="p-2 bg-white/5 text-gray-300 hover:text-white rounded-lg transition-colors"
                        title="Edit Streak"
                      >
                        <Edit2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
