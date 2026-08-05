import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Edit2, Play, Save, X, PlusCircle, AlignLeft, Code } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

export default function FounderTestManager() {
  const { addToast } = useToast();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create/Edit form state
  const [formData, setFormData] = useState({
    title: '',
    duration: 15,
    type: 'quiz', // 'quiz', 'coding', 'both'
    active: true,
    scheduledTime: '',
    targetBranch: 'All',
    targetSem: 'All',
    targetSec: 'All',
    questions: []
  });

  const loadTests = async () => {
    setLoading(true);
    try {
      const testsRef = collection(db, 'tests');
      const snap = await getDocs(testsRef);
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTests(fetched);
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to load tests.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleOpenModal = () => {
    setFormData({ title: '', duration: 15, type: 'quiz', active: true, scheduledTime: '', targetBranch: 'All', targetSem: 'All', targetSec: 'All', questions: [] });
    setIsModalOpen(true);
  };

  const addQuestion = (type) => {
    const newQ = type === 'mcq' 
      ? { type: 'mcq', question: '', options: ['', '', '', ''], correct: 0, id: `q${Date.now()}` }
      : { type: 'code', question: '', initialCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}', expectedOutput: '', language: 'java', id: `q${Date.now()}` };
    
    setFormData({ ...formData, questions: [...formData.questions, newQ] });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index][field] = value;
    setFormData({ ...formData, questions: updated });
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].options[optIndex] = value;
    setFormData({ ...formData, questions: updated });
  };

  const removeQuestion = (index) => {
    const updated = [...formData.questions];
    updated.splice(index, 1);
    setFormData({ ...formData, questions: updated });
  };

  const handleSaveTest = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.title.trim()) {
      addToast({ message: 'Title is required', type: 'error' });
      return;
    }
    if (!formData.duration || parseInt(formData.duration) < 1) {
      addToast({ message: 'Duration must be at least 1 minute', type: 'error' });
      return;
    }
    if (formData.questions.length === 0) {
      addToast({ message: 'Please add at least one question', type: 'error' });
      return;
    }

    const cleanedQuestions = formData.questions.map(q => {
      if (q.type === 'mcq') {
        const newOptions = [];
        let newCorrect = 0;
        q.options.forEach((opt, idx) => {
          if (opt.trim() !== '') {
            if (idx === q.correct) newCorrect = newOptions.length;
            newOptions.push(opt.trim());
          }
        });
        return { ...q, options: newOptions, correct: newCorrect };
      }
      return q;
    });

    for (let i = 0; i < cleanedQuestions.length; i++) {
      const q = cleanedQuestions[i];
      if (!q.question.trim()) {
        addToast({ message: `Question ${i + 1} is missing text`, type: 'error' });
        return;
      }
      if (q.type === 'mcq' && q.options.length < 2) {
        addToast({ message: `Question ${i + 1} needs at least 2 options`, type: 'error' });
        return;
      }
    }
    
    try {
      const testToSave = {
        title: formData.title,
        duration: parseInt(formData.duration),
        type: formData.type,
        active: formData.active,
        scheduledTime: formData.scheduledTime,
        targetBranch: formData.targetBranch,
        targetSem: formData.targetSem,
        targetSec: formData.targetSec,
        questions: cleanedQuestions,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'tests'), testToSave);
      addToast({ message: 'Test created successfully!', type: 'success' });
      setIsModalOpen(false);
      loadTests();
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to save test. Please check permissions.', type: 'error' });
    }
  };

  const toggleTestStatus = async (test) => {
    try {
      await updateDoc(doc(db, 'tests', test.id), { active: !test.active });
      setTests(tests.map(t => t.id === test.id ? { ...t, active: !test.active } : t));
      addToast({ message: `Test ${!test.active ? 'activated' : 'deactivated'}.`, type: 'success' });
    } catch (err) {
      addToast({ message: 'Failed to update test status.', type: 'error' });
    }
  };

  const handleDeleteTest = async (id) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    try {
      await deleteDoc(doc(db, 'tests', id));
      setTests(tests.filter(t => t.id !== id));
      addToast({ message: 'Test deleted.', type: 'success' });
    } catch (err) {
      addToast({ message: 'Failed to delete test.', type: 'error' });
    }
  };

  const handleResetPortal = async () => {
    if (!confirm('WARNING: This will permanently delete ALL tests and ALL leadership/leaderboard data. Are you absolutely sure?')) return;
    if (prompt('Type "RESET" to confirm deletion of all tests and leaderboards:') !== 'RESET') return;
    
    setLoading(true);
    try {
      // Delete all tests
      const testsSnap = await getDocs(collection(db, 'tests'));
      for (const d of testsSnap.docs) {
        await deleteDoc(doc(db, 'tests', d.id));
      }
      
      // Delete all test_results (leaderboard)
      const resultsSnap = await getDocs(collection(db, 'test_results'));
      for (const d of resultsSnap.docs) {
        await deleteDoc(doc(db, 'test_results', d.id));
      }

      setTests([]);
      addToast({ message: 'All tests and leadership data cleared successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to reset data. Check permissions.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="text-brand-teal" /> Test Management
          </h2>
          <p className="text-xs text-gray-400 mt-1">Create and manage tests for students.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleResetPortal}
            className="bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-xl font-bold text-xs tracking-wide flex items-center gap-2 hover:bg-red-500/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Reset Portal Data
          </button>
          <button 
            onClick={handleOpenModal}
            className="bg-brand-teal text-black px-4 py-2 rounded-xl font-bold text-xs tracking-wide flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-400">
            <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : tests.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 italic glass-panel rounded-2xl">No tests created yet. Click Create Test to begin.</div>
        ) : (
          tests.map(test => (
            <div key={test.id} className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col hover:border-white/10 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide ${test.active ? 'bg-brand-teal/20 text-brand-teal' : 'bg-red-500/20 text-red-500'}`}>
                  {test.active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-[10px] font-bold uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-gray-400">
                  {test.duration} min
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{test.title}</h3>
              <p className="text-xs text-gray-400 mb-6 flex-1 bg-black/20 p-3 rounded-xl border border-white/5">
                Type: <span className="uppercase text-gray-200 font-bold">{test.type}</span><br />
                Target: <span className="text-brand-teal font-bold">{test.targetBranch || 'All'} • Sem {test.targetSem || 'All'} • Sec {test.targetSec || 'All'}</span><br />
                {test.scheduledTime && (
                  <>Schedule: <span className="text-yellow-500 font-bold">{new Date(test.scheduledTime).toLocaleString()}</span><br /></>
                )}
                Questions: <span className="text-brand-pink font-bold">{test.questions?.length || 0}</span>
              </p>
              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => toggleTestStatus(test)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 transition-colors border border-white/10 cursor-pointer"
                >
                  {test.active ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleDeleteTest(test.id)}
                  className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20 cursor-pointer"
                  title="Delete Test"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 border border-white/10 relative text-left bg-[#0c0c16] max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white cursor-pointer bg-white/5 p-2 rounded-xl">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-white mb-6 tracking-wide flex items-center gap-2 border-b border-white/10 pb-4">
              <PlusCircle className="text-brand-teal" /> Create New Test
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">Test Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. JavaScript Midterm"
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">Duration (mins)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.duration} 
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">Test Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/10"
                  >
                    <option value="quiz">Quiz (Multiple Choice)</option>
                    <option value="coding">Coding Assessment</option>
                    <option value="both">Mixed (Both)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">Scheduled Start (Optional)</label>
                  <input 
                    type="datetime-local" 
                    value={formData.scheduledTime} 
                    onChange={e => setFormData({...formData, scheduledTime: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">Target Branch</label>
                  <select 
                    value={formData.targetBranch} 
                    onChange={e => setFormData({...formData, targetBranch: e.target.value})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/10"
                  >
                    <option value="All">All Branches</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">Target Sem</label>
                  <select 
                    value={formData.targetSem} 
                    onChange={e => setFormData({...formData, targetSem: e.target.value})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/10"
                  >
                    <option value="All">All Sems</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={String(s)}>Sem {s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">Target Sec</label>
                  <select 
                    value={formData.targetSec} 
                    onChange={e => setFormData({...formData, targetSec: e.target.value})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/10"
                  >
                    <option value="All">All Secs</option>
                    {['A', 'B', 'C', 'D', 'E', 'None'].map(s => (
                      <option key={s} value={s}>Sec {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <h3 className="text-sm font-bold text-white tracking-wide">Questions ({formData.questions.length})</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => addQuestion('mcq')} className="text-[10px] font-bold uppercase bg-brand-teal/20 text-brand-teal px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-brand-teal/30 transition-colors cursor-pointer border border-white/10">
                      <AlignLeft className="w-3 h-3" /> Add MCQ
                    </button>
                    <button type="button" onClick={() => addQuestion('code')} className="text-[10px] font-bold uppercase bg-brand-blue/20 text-brand-blue px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-brand-blue/30 transition-colors cursor-pointer border border-white/10">
                      <Code className="w-3 h-3" /> Add Coding
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-black/40 border border-white/10 p-5 rounded-2xl relative group hover:border-white/20 transition-colors">
                      <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors cursor-pointer bg-white/5 p-1.5 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white border border-white/10">{qIndex + 1}</span>
                        <span className="text-[10px] font-bold text-brand-pink tracking-wide">{q.type === 'mcq' ? 'Multiple Choice' : 'Coding Challenge'}</span>
                      </div>
                      
                      <textarea 
                        placeholder="Enter the question text or instructions..."
                        value={q.question}
                        onChange={e => updateQuestion(qIndex, 'question', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white mb-4 focus:outline-none focus:border-white/10"
                        rows="2"
                      />

                      {q.type === 'mcq' && (
                        <div className="space-y-3 pl-4 border-l-2 border-white/10">
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-3">
                              <label className="flex items-center justify-center cursor-pointer">
                                <input 
                                  type="radio" 
                                  name={`correct-${qIndex}`} 
                                  checked={q.correct === optIndex}
                                  onChange={() => updateQuestion(qIndex, 'correct', optIndex)}
                                  className="w-4 h-4 accent-brand-teal cursor-pointer"
                                />
                              </label>
                              <input 
                                type="text" 
                                placeholder={`Option ${optIndex + 1} ${q.correct === optIndex ? '(Correct Answer)' : ''}`}
                                value={opt}
                                onChange={e => updateOption(qIndex, optIndex, e.target.value)}
                                className={`flex-1 bg-white/5 border ${q.correct === optIndex ? 'border-white/10 bg-brand-teal/5' : 'border-white/10'} rounded-xl p-2.5 text-xs text-white focus:outline-none transition-colors`}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === 'code' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 tracking-wide ml-1">Programming Language</label>
                            <select 
                              value={q.language || 'java'}
                              onChange={e => updateQuestion(qIndex, 'language', e.target.value)}
                              className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/10"
                            >
                              <option value="python">Python</option>
                              <option value="javascript">JavaScript</option>
                              <option value="java">Java</option>
                              <option value="c++">C++</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 tracking-wide ml-1">Initial Code Template</label>
                            <textarea 
                              placeholder="Initial code template for the student..."
                              value={q.initialCode}
                              onChange={e => updateQuestion(qIndex, 'initialCode', e.target.value)}
                              className="w-full font-mono bg-[#1e1e1e] border border-white/10 rounded-xl p-4 text-xs text-gray-300 h-32 focus:outline-none focus:border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 tracking-wide ml-1">Expected Output (Exact Match)</label>
                            <textarea 
                              placeholder="Expected output string (e.g., Hello World)"
                              value={q.expectedOutput || ''}
                              onChange={e => updateQuestion(qIndex, 'expectedOutput', e.target.value)}
                              className="w-full font-mono bg-[#1e1e1e] border border-white/10 rounded-xl p-4 text-xs text-gray-300 h-16 focus:outline-none focus:border-green-500/50"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {formData.questions.length === 0 && (
                    <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                      <Target className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 font-medium">No questions added yet. Use the buttons above to build your test.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs tracking-wide transition-colors cursor-pointer whitespace-nowrap">Cancel</button>
                <button type="button" onClick={handleSaveTest} className="flex-1 py-3 bg-brand-teal hover:opacity-90 text-black rounded-xl font-semibold text-xs tracking-wide flex justify-center items-center gap-2 transition-opacity cursor-pointer shadow-sm whitespace-nowrap">
                  <Save className="w-4 h-4" /> Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
