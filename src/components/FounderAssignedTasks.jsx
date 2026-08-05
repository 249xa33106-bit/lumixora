import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ClipboardList, Trash2, Plus, Server } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function FounderAssignedTasks() {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    subject: '',
    dayLabel: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

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
      addToast('Please fill all fields', 'error');
      return;
    }
    
    try {
      await addDoc(collection(db, 'assigned_tasks'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      addToast('Task assigned successfully!', 'success');
      setFormData({ subject: '', dayLabel: '', title: '', description: '' });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      addToast('Failed to assign task', 'error');
    }
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
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ClipboardList className="text-brand-purple" />
          Assign New Task
        </h2>
        
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
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple/80 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Publish Task
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
            {tasks.map(task => (
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
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors self-end md:self-auto"
                  title="Delete Task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
