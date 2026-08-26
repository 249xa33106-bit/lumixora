import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, getDocs, updateDoc, deleteDoc, doc, setDoc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { Check, X, MessageSquare, Power, Plus, Star, Trash2, Edit2, PieChart } from 'lucide-react';

export default function FounderFeedbackManager() {
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormActive, setIsFormActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  
  // Tabs
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  
  // Editing state
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [manualFeedback, setManualFeedback] = useState({ name: '', text: '', rating: 5, isPinned: false, imageUrl: '' });
  
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      // Load toggle status
      const configDoc = await getDoc(doc(db, 'app_config', 'feedbacks_status'));
      if (configDoc.exists()) {
        const data = configDoc.data();
        setIsFormActive(data.isActive || false);
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else if (data.customQuestion) {
          setQuestions([data.customQuestion]);
        } else {
          setQuestions([]);
        }
      }

      // Load ALL feedbacks
      const q = query(
        collection(db, 'feedbacks'),
        orderBy('createdAt', 'desc')
      );
      let snap = { docs: [] }; try { snap = await getDocs(q); } catch (e) { console.warn("Feedback fetch notice:", e); }
      setAllFeedbacks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error("Error:", err);
      console.error(err);
      addToast({ message: 'Failed to load feedbacks.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleForm = async () => {
    try {
      const newState = !isFormActive;
      await setDoc(doc(db, 'app_config', 'feedbacks_status'), { isActive: newState, questions }, { merge: true });
      setIsFormActive(newState);
      addToast({ message: `Feedback form is now ${newState ? 'ACTIVE' : 'INACTIVE'}.`, type: 'success' });
    } catch (err) { console.error("Error:", err);
      addToast({ message: 'Failed to toggle form.', type: 'error' });
    }
  };
  const saveCustomQuestion = async () => {
    try {
      await setDoc(doc(db, 'app_config', 'feedbacks_status'), { isActive: isFormActive, questions }, { merge: true });
      setIsEditingQuestion(false);
      addToast({ message: 'Feedback questions updated successfully!', type: 'success' });
    } catch (err) { console.error("Error:", err);
      addToast({ message: 'Failed to update question.', type: 'error' });
    }
  };
  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'feedbacks', id), { status: 'approved' });
      addToast({ message: 'Feedback approved for display!', type: 'success' });
      setAllFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: 'approved' } : f));
    } catch (err) { console.error("Error:", err);
      addToast({ message: 'Failed to approve feedback.', type: 'error' });
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await deleteDoc(doc(db, 'feedbacks', id));
      addToast({ message: 'Feedback deleted.', type: 'info' });
      setAllFeedbacks(prev => prev.filter(f => f.id !== id));
    } catch (err) { console.error("Error:", err);
      addToast({ message: 'Failed to delete feedback.', type: 'error' });
    }
  };

  const handleTogglePin = async (id, currentPinStatus) => {
    try {
      await updateDoc(doc(db, 'feedbacks', id), { isPinned: !currentPinStatus });
      addToast({ message: `Feedback ${!currentPinStatus ? 'pinned to top' : 'unpinned'}!`, type: 'success' });
      setAllFeedbacks(prev => prev.map(f => f.id === id ? { ...f, isPinned: !currentPinStatus } : f));
    } catch (err) { console.error("Error:", err);
      addToast({ message: 'Failed to pin feedback.', type: 'error' });
    }
  };

  const openEditModal = (fb) => {
    setEditingFeedbackId(fb.id);
    setManualFeedback({ name: fb.name || '', text: fb.text || '', rating: fb.rating || 5, isPinned: fb.isPinned || false, imageUrl: fb.imageUrl || '' });
    setShowManualForm(true);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualFeedback.name.trim() || !manualFeedback.text.trim()) return;
    try {
      if (editingFeedbackId) {
        await updateDoc(doc(db, 'feedbacks', editingFeedbackId), {
          name: manualFeedback.name,
          text: manualFeedback.text,
          rating: Number(manualFeedback.rating),
          imageUrl: manualFeedback.imageUrl
        });
        setAllFeedbacks(prev => prev.map(f => f.id === editingFeedbackId ? { ...f, name: manualFeedback.name, text: manualFeedback.text, rating: Number(manualFeedback.rating), imageUrl: manualFeedback.imageUrl } : f));
        addToast({ message: 'Feedback updated successfully!', type: 'success' });
      } else {
        const newFb = {
          name: manualFeedback.name,
          userId: 'founder_manual',
          text: manualFeedback.text,
          rating: Number(manualFeedback.rating),
          status: 'approved',
          isPinned: manualFeedback.isPinned || false,
          imageUrl: manualFeedback.imageUrl || '',
          createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'feedbacks'), newFb);
        setAllFeedbacks(prev => [{ id: docRef.id, ...newFb }, ...prev]);
        addToast({ message: 'Manual feedback added successfully!', type: 'success' });
      }
      setShowManualForm(false);
      setEditingFeedbackId(null);
      setManualFeedback({ name: '', text: '', rating: 5, isPinned: false, imageUrl: '' });
    } catch (err) { console.error("Error:", err);
      addToast({ message: 'Failed to save feedback.', type: 'error' });
    }
  };

  // Derived state
  const pendingFeedbacks = allFeedbacks.filter(f => f.status === 'pending');
  const approvedFeedbacks = allFeedbacks.filter(f => f.status === 'approved');
  
  // Analytics
  const totalReceived = allFeedbacks.length;
  const avgRating = totalReceived > 0 
    ? (allFeedbacks.reduce((sum, fb) => sum + (Number(fb.rating) || 5), 0) / totalReceived).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const displayedFeedbacks = activeTab === 'pending' ? pendingFeedbacks : approvedFeedbacks;

  return (
    <div className="space-y-6">
      
      {/* Analytics Widget */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Total Feedbacks</p>
            <h3 className="text-2xl font-black text-white">{totalReceived}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Avg Rating</p>
            <h3 className="text-2xl font-black text-white flex items-baseline gap-1">
              {avgRating} <span className="text-[10px] text-brand-orange">/ 5.0</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Pending</p>
            <h3 className="text-2xl font-black text-white">{pendingFeedbacks.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
            <PieChart className="w-5 h-5" />
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Approved Live</p>
            <h3 className="text-2xl font-black text-white">{approvedFeedbacks.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
            <Check className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-teal" /> Feedback Moderation
          </h2>
          <p className="text-xs text-gray-400 mt-1">Review user feedbacks and control the public form.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setEditingFeedbackId(null);
              setManualFeedback({ name: '', text: '', rating: 5, isPinned: false });
              setShowManualForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all bg-brand-pink/20 text-brand-pink border border-brand-pink/30 hover:bg-brand-pink/30"
          >
            <Plus className="w-4 h-4" /> Add Manual
          </button>
          <button 
            onClick={toggleForm}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              isFormActive 
                ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30 hover:bg-brand-teal/30'
                : 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20'
            }`}
          >
            <Power className="w-4 h-4" />
            {isFormActive ? 'Form is Active' : 'Form is Disabled'}
          </button>
        </div>
      </div>
      
      {/* Custom Question Settings */}
      <div className="glass-panel p-4 rounded-2xl border border-white/5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-teal" /> 
            Public Feedback Form Questions
          </h3>
          <button 
            onClick={() => isEditingQuestion ? saveCustomQuestion() : setIsEditingQuestion(true)}
            className="text-xs bg-brand-teal/20 text-brand-teal px-3 py-1.5 rounded-lg font-bold hover:bg-brand-teal/30 transition-colors"
          >
            {isEditingQuestion ? 'Save Questions' : 'Edit Questions'}
          </button>
        </div>
        {isEditingQuestion ? (
          <div className="space-y-3">
            {questions?.map((q, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-gray-500 font-bold text-xs w-6 text-right">{idx + 1}.</span>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[idx] = e.target.value;
                    setQuestions(newQ);
                  }}
                  placeholder="Enter a question..."
                  className="flex-1 bg-black/40 border border-brand-teal/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-teal/70 transition-colors"
                />
                <button
                  onClick={() => {
                    const newQ = questions.filter((_, i) => i !== idx);
                    setQuestions(newQ);
                  }}
                  className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors"
                  title="Remove Question"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setQuestions([...questions, ""])}
              className="mt-2 flex items-center gap-2 text-xs font-bold text-brand-teal bg-brand-teal/10 px-3 py-1.5 rounded-lg hover:bg-brand-teal/20 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Another Question
            </button>
          </div>
        ) : (
          <div className="space-y-2 pl-2 border-l-2 border-brand-teal/20">
            {questions.length > 0 ? (
              questions?.map((q, idx) => (
                <p key={idx} className="text-sm text-gray-300 italic flex gap-2">
                  <span className="text-brand-teal font-bold">{idx + 1}.</span> {q}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No custom questions added. Users will see a standard generic text box.</p>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            activeTab === 'pending' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          Pending Review ({pendingFeedbacks.length})
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            activeTab === 'approved' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          Approved / Live ({approvedFeedbacks.length})
        </button>
      </div>

      {displayedFeedbacks.length === 0 ? (
        <div className="glass-panel p-10 text-center rounded-3xl border border-white/5">
          <MessageSquare className="w-8 h-8 text-brand-teal mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-gray-200">No {activeTab} Feedbacks</h3>
          <p className="text-sm text-gray-500 mt-2">
            {activeTab === 'pending' ? 'All student feedbacks have been reviewed!' : 'No feedbacks have been approved yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedFeedbacks?.map(fb => (
            <div key={fb.id} className={`glass-panel rounded-2xl border ${fb.isPinned ? 'border-brand-orange/40 bg-brand-orange/5' : 'border-white/10'} p-5 flex flex-col relative`}>
              {fb.isPinned && (
                <div className="absolute -top-2 -right-2 bg-brand-orange text-black p-1.5 rounded-full shadow-lg">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}
              
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-brand-teal">{fb.name}</span>
                <span className="text-[10px] bg-black/40 px-2 py-1 rounded text-gray-400 flex items-center gap-1">
                  {fb.rating} <Star className="w-2.5 h-2.5 text-brand-orange fill-brand-orange" />
                </span>
              </div>
              
              <div className="flex-1 mb-4">
                {fb.answers && Array.isArray(fb.answers) ? (
                  <div className="space-y-3">
                    {fb.answers?.map((qa, idx) => (
                      <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] text-brand-teal font-bold uppercase tracking-wider mb-1">Q: {qa.question}</p>
                        <p className="text-xs text-gray-200">A: {qa.answer || <span className="text-gray-500 italic">No answer</span>}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-200 italic">"{fb.text}"</p>
                )}
              </div>
              
              {activeTab === 'pending' ? (
                <div className="flex gap-2 border-t border-white/5 pt-3">
                  <button 
                    onClick={() => handleApprove(fb.id)}
                    className="flex-1 bg-brand-teal/10 text-brand-teal border border-brand-teal/20 font-bold py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-teal/20 transition-colors text-xs"
                  >
                    <Check className="w-3 h-3" /> Approve
                  </button>
                  <button 
                    onClick={() => handleReject(fb.id)}
                    className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 font-bold py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors text-xs"
                  >
                    <X className="w-3 h-3" /> Reject
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 border-t border-white/5 pt-3">
                  <button 
                    onClick={() => handleTogglePin(fb.id, fb.isPinned)}
                    className={`flex-1 font-bold py-1.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs border ${
                      fb.isPinned 
                        ? 'bg-brand-orange/20 text-brand-orange border-brand-orange/30 hover:bg-brand-orange/30' 
                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${fb.isPinned ? 'fill-current' : ''}`} /> {fb.isPinned ? 'Unpin' : 'Pin to Top'}
                  </button>
                  <button 
                    onClick={() => openEditModal(fb)}
                    className="flex-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-bold py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-brand-blue/20 transition-colors text-xs"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button 
                    onClick={() => handleReject(fb.id)}
                    className="flex-none px-3 bg-red-500/10 text-red-500 border border-red-500/20 font-bold py-1.5 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Manual/Edit Feedback Modal */}
      {showManualForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f1115] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">{editingFeedbackId ? 'Edit Feedback' : 'Add Manual Feedback'}</h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Student/User Name</label>
                <input 
                  type="text" 
                  value={manualFeedback.name}
                  onChange={e => setManualFeedback({...manualFeedback, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-teal"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Rating (1-5)</label>
                <input 
                  type="number" 
                  min="1" max="5"
                  value={manualFeedback.rating}
                  onChange={e => setManualFeedback({...manualFeedback, rating: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-teal"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Feedback Text</label>
                <textarea 
                  value={manualFeedback.text}
                  onChange={e => setManualFeedback({...manualFeedback, text: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-teal resize-none h-24"
                  placeholder="e.g. What you like most..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Image URL</label>
                <input 
                  type="url" 
                  value={manualFeedback.imageUrl}
                  onChange={e => setManualFeedback({...manualFeedback, imageUrl: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-teal"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {!editingFeedbackId && (
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={manualFeedback.isPinned}
                    onChange={e => setManualFeedback({...manualFeedback, isPinned: e.target.checked})}
                    className="accent-brand-orange"
                  />
                  Pin this feedback to top
                </label>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowManualForm(false);
                    setEditingFeedbackId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-brand-teal text-black text-xs font-bold hover:bg-brand-teal/90 transition-colors"
                >
                  {editingFeedbackId ? 'Update Feedback' : 'Save Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
