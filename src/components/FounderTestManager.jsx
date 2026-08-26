import React, { useState, useEffect, useMemo } from 'react';
import { Target, Plus, Trash2, Edit2, Play, Save, X, PlusCircle, AlignLeft, Code, FileText, CheckCircle, Clock } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { generateTestQuestions } from '../services/aiService';

export default function FounderTestManager() {
  const { addToast } = useToast();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'test', 'assignment'
  
  // AI Generator Form
  const [aiForm, setAiForm] = useState({
    topic: '',
    count: 5,
    type: 'both', // 'mcq', 'code', 'both'
    difficulty: 'Medium'
  });
  // Create/Edit form state
  const [formData, setFormData] = useState({
    title: '',
    duration: 15,
    type: 'quiz', // 'quiz', 'coding', 'both'
    category: 'test', // 'test' or 'assignment'
    active: true,
    scheduledTime: '',
    dueDate: '',
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
      addToast({ message: 'Failed to load assessments.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadTests();
  }, []);

  const handleOpenModal = (category = 'test') => {
    setFormData({ 
      title: '', 
      duration: category === 'assignment' ? 60 : 15, 
      type: 'quiz', 
      category: category,
      active: true, 
      scheduledTime: '', 
      dueDate: '',
      targetBranch: 'All', 
      targetSem: 'All', 
      targetSec: 'All', 
      questions: [] 
    });
    setIsModalOpen(true);
  };

  const defaultTemplates = {
    java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
    python: '# Write your code here\n',
    javascript: '// Write your code here\n',
    'c++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
  };

  const addQuestion = (type) => {
    const newQ = type === 'mcq' 
      ? { type: 'mcq', question: '', options: ['', '', '', ''], correct: 0, id: `q${Date.now()}` }
      : { type: 'code', question: '', initialCode: defaultTemplates.java, expectedOutput: '', language: 'java', id: `q${Date.now()}` };
    
    setFormData({ ...formData, questions: [...formData.questions, newQ] });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.questions];
    const prevLang = updated[index].language || 'java';
    updated[index][field] = value;
    
    if (field === 'language') {
      const prevTemplate = defaultTemplates[prevLang] || '';
      if (!updated[index].initialCode || updated[index].initialCode.trim() === prevTemplate.trim()) {
        updated[index].initialCode = defaultTemplates[value] || '';
      }
    }
    
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

  const handleGenerateAiQuestions = async () => {
    if (!aiForm.topic.trim()) {
      addToast({ message: 'Please enter a topic', type: 'error' });
      return;
    }
    if (aiForm.count < 1 || aiForm.count > 20) {
      addToast({ message: 'You can generate up to 20 questions at a time.', type: 'error' });
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateTestQuestions(aiForm.topic, parseInt(aiForm.count), aiForm.type, aiForm.difficulty);
      setFormData({ ...formData, questions: [...formData.questions, ...generated] });
      addToast({ message: `Successfully generated ${generated.length} questions!`, type: 'success' });
      setIsAiGeneratorOpen(false);
      setAiForm({ ...aiForm, topic: '' }); // reset topic for next time
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to generate questions. Try again.', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
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

    const cleanedQuestions = formData.questions?.map(q => {
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
      const isAssignment = formData.category === 'assignment';
      const testToSave = {
        title: formData.title.trim(),
        duration: parseInt(formData.duration, 10) || (isAssignment ? 60 : 15),
        type: formData.type,
        category: formData.category || 'test',
        active: formData.active,
        scheduledTime: formData.scheduledTime || '',
        dueDate: formData.dueDate || formData.scheduledTime || '',
        targetBranch: formData.targetBranch,
        targetSem: formData.targetSem,
        targetSec: formData.targetSec,
        questions: cleanedQuestions,
        resultsReleased: false,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'tests'), testToSave);
      addToast({ message: `${isAssignment ? 'Assignment' : 'Test'} created successfully!`, type: 'success' });
      setIsModalOpen(false);
      loadTests();
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to save assessment. Please check permissions.', type: 'error' });
    }
  };

  const toggleTestStatus = async (test) => {
    try {
      await updateDoc(doc(db, 'tests', test.id), { active: !test.active });
      setTests(tests?.map(t => t.id === test.id ? { ...t, active: !test.active } : t));
      addToast({ message: `${test.category === 'assignment' ? 'Assignment' : 'Test'} ${!test.active ? 'activated' : 'deactivated'}.`, type: 'success' });
    } catch (err) {
      addToast({ message: 'Failed to update status.', type: 'error' });
    }
  };

  const toggleResultsStatus = async (test) => {
    try {
      await updateDoc(doc(db, 'tests', test.id), { resultsReleased: !test.resultsReleased });
      setTests(tests?.map(t => t.id === test.id ? { ...t, resultsReleased: !test.resultsReleased } : t));
      addToast({ message: `Results ${!test.resultsReleased ? 'released to students' : 'hidden from students'}.`, type: 'success' });
    } catch (err) {
      addToast({ message: 'Failed to update results status.', type: 'error' });
    }
  };

  const handleDeleteTest = async (id) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await deleteDoc(doc(db, 'tests', id));
      setTests(tests.filter(t => t.id !== id));
      addToast({ message: 'Assessment deleted.', type: 'success' });
    } catch (err) {
      addToast({ message: 'Failed to delete assessment.', type: 'error' });
    }
  };

  const handleResetPortal = async () => {
    if (!confirm('WARNING: This will permanently delete ALL tests, assignments, and ALL leaderboard data. Are you absolutely sure?')) return;
    if (prompt('Type "RESET" to confirm deletion of all tests, assignments, and leaderboards:') !== 'RESET') return;
    
    setLoading(true);
    try {
      // Delete all tests
      const testsSnap = await getDocs(collection(db, 'tests'));
      for (const d of testsSnap.docs) {
        await deleteDoc(doc(db, 'tests', d.id));
      }
      
      // Delete all test_results (leaderboard)
      let resultsSnap = { docs: [] }; try { resultsSnap = await getDocs(collection(db, 'test_results')); } catch (e) { console.warn("Test results fetch notice:", e); }
      for (const d of resultsSnap.docs) {
        await deleteDoc(doc(db, 'test_results', d.id));
      }

      setTests([]);
      addToast({ message: 'All tests, assignments, and leadership data cleared successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to reset data. Check permissions.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = useMemo(() => {
    if (categoryFilter === 'test') {
      return tests.filter(t => t.category !== 'assignment');
    }
    if (categoryFilter === 'assignment') {
      return tests.filter(t => t.category === 'assignment');
    }
    return tests;
  }, [tests, categoryFilter]);

  const testsCount = tests.filter(t => t.category !== 'assignment').length;
  const assignmentsCount = tests.filter(t => t.category === 'assignment').length;

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 border border-white/10 p-5 rounded-3xl gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="text-brand-teal w-5 h-5" /> 
            <span>Tests & Assignments Command Center</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Create, schedule, and distribute timed tests, online quizzes, and homework assignments for students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={handleResetPortal}
            className="bg-red-500/10 text-red-400 border border-red-500/30 px-3.5 py-2.5 rounded-xl font-bold text-xs tracking-wide flex items-center gap-1.5 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset Data
          </button>
          
          {/* Create Assignment Button */}
          <button 
            onClick={() => handleOpenModal('assignment')}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-500/20"
          >
            <FileText className="w-4 h-4" /> + Create Assignment
          </button>

          {/* Create Test Button */}
          <button 
            onClick={() => handleOpenModal('test')}
            className="bg-brand-teal text-black px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-brand-teal/20"
          >
            <Plus className="w-4 h-4" /> + Create Test
          </button>
        </div>
      </div>

      {/* Filter Tabs: All, Tests Only, Assignments Only */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            categoryFilter === 'all'
              ? 'bg-brand-teal text-black shadow-sm'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          All Assessments ({tests.length})
        </button>
        <button
          onClick={() => setCategoryFilter('test')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            categoryFilter === 'test'
              ? 'bg-brand-teal text-black shadow-sm'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Tests Only ({testsCount})
        </button>
        <button
          onClick={() => setCategoryFilter('assignment')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            categoryFilter === 'assignment'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Assignments Only ({assignmentsCount})
        </button>
      </div>

      {/* Grid of Tests and Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-gray-400">
            <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold">Loading Assessments...</p>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="col-span-full p-12 text-center text-gray-400 italic glass-panel rounded-3xl border border-white/5">
            {categoryFilter === 'assignment' 
              ? 'No assignments created yet. Click "+ Create Assignment" to publish homework or tasks.'
              : categoryFilter === 'test'
              ? 'No tests created yet. Click "+ Create Test" to begin.'
              : 'No tests or assignments created yet. Use the buttons above to create one.'}
          </div>
        ) : (
          filteredAssessments.map(item => {
            const isAssignment = item.category === 'assignment';
            return (
              <div key={item.id} className={`glass-panel p-6 rounded-3xl border flex flex-col hover:border-white/20 transition-all group ${
                isAssignment ? 'border-purple-500/20 bg-[#120f24]' : 'border-white/10 bg-[#0d101e]'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {/* Assessment Type Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                      isAssignment 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {isAssignment ? <FileText className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                      {isAssignment ? 'Assignment' : 'Test'}
                    </span>
                    
                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${item.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                      {item.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-gray-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" /> {item.duration} min
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
                
                <p className="text-xs text-gray-400 mb-6 flex-1 bg-black/30 p-3 rounded-2xl border border-white/5 space-y-1">
                  <div>Type: <span className="uppercase text-gray-200 font-bold">{item.type}</span></div>
                  <div>Target: <span className="text-brand-teal font-bold">{item.targetBranch || 'All'} • Sem {item.targetSem || 'All'} • Sec {item.targetSec || 'All'}</span></div>
                  {item.scheduledTime && (
                    <div>Schedule/Start: <span className="text-yellow-400 font-bold">{new Date(item.scheduledTime).toLocaleString()}</span></div>
                  )}
                  {item.dueDate && isAssignment && (
                    <div>Due Date: <span className="text-purple-400 font-bold">{new Date(item.dueDate).toLocaleString()}</span></div>
                  )}
                  <div>Questions: <span className="text-brand-pink font-bold">{item.questions?.length || 0}</span></div>
                </p>

                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={() => toggleTestStatus(item)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 transition-colors border border-white/10 cursor-pointer"
                  >
                    {item.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => toggleResultsStatus(item)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${item.resultsReleased ? 'bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border-brand-teal/20' : 'bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink border-brand-pink/20'}`}
                  >
                    {item.resultsReleased ? 'Hide Results' : 'Release Results'}
                  </button>
                  <button 
                    onClick={() => handleDeleteTest(item.id)}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20 cursor-pointer"
                    title={`Delete ${isAssignment ? 'Assignment' : 'Test'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 border border-white/10 relative text-left bg-[#0c0c16] max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white cursor-pointer bg-white/5 p-2 rounded-xl">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-white mb-6 tracking-wide flex items-center gap-2 border-b border-white/10 pb-4">
              {formData.category === 'assignment' ? (
                <>
                  <FileText className="text-purple-400" /> Create New Assignment / Homework
                </>
              ) : (
                <>
                  <PlusCircle className="text-brand-teal" /> Create New Test Assessment
                </>
              )}
            </h2>

            {/* Category Toggle in Modal */}
            <div className="flex items-center gap-3 mb-6 bg-white/5 p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: 'test' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  formData.category === 'test'
                    ? 'bg-brand-teal text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" /> Test Assessment
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: 'assignment' })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  formData.category === 'assignment'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Homework Assignment
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">
                    {formData.category === 'assignment' ? 'Assignment Title' : 'Test Title'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={formData.category === 'assignment' ? 'e.g. Assignment 1: Data Structures' : 'e.g. JavaScript Midterm'}
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">
                    {formData.category === 'assignment' ? 'Duration / Grace Limit (mins)' : 'Duration (mins)'}
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.duration} 
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">
                    {formData.category === 'assignment' ? 'Assignment Question Type' : 'Test Type'}
                  </label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[#10101b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-teal"
                  >
                    <option value="quiz">Quiz (Multiple Choice)</option>
                    <option value="coding">Coding Assessment / Problem</option>
                    <option value="both">Mixed (Both)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 tracking-wide">
                    {formData.category === 'assignment' ? 'Submission Deadline / Due Date' : 'Scheduled Start (Optional)'}
                  </label>
                  <input 
                    type="datetime-local" 
                    value={formData.scheduledTime} 
                    onChange={e => setFormData({...formData, scheduledTime: e.target.value, dueDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-teal"
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
                    <option value="CSM">CSM</option>
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="ECE">ECE</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MECH">MECH</option>
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
                    <button type="button" onClick={() => setIsAiGeneratorOpen(true)} className="text-[10px] font-bold uppercase bg-brand-pink/20 text-brand-pink px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-brand-pink/30 transition-colors cursor-pointer border border-brand-pink/20 shadow-[0_0_10px_rgba(255,107,206,0.2)]">
                      ✨ AI Generator
                    </button>
                    <button type="button" onClick={() => addQuestion('mcq')} className="text-[10px] font-bold uppercase bg-brand-teal/20 text-brand-teal px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-brand-teal/30 transition-colors cursor-pointer border border-white/10">
                      <AlignLeft className="w-3 h-3" /> Add MCQ
                    </button>
                    <button type="button" onClick={() => addQuestion('code')} className="text-[10px] font-bold uppercase bg-brand-blue/20 text-brand-blue px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-brand-blue/30 transition-colors cursor-pointer border border-white/10">
                      <Code className="w-3 h-3" /> Add Coding
                    </button>
                  </div>
                </div>

                {/* AI Generator Panel */}
                {isAiGeneratorOpen && (
                  <div className="mb-6 bg-[#0c0c16] border border-brand-pink/30 p-5 rounded-2xl relative shadow-[0_0_15px_rgba(255,107,206,0.1)]">
                    <button type="button" onClick={() => setIsAiGeneratorOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer bg-white/5 p-1.5 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-brand-pink">✨ Magic AI Generator</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400">Topic</label>
                        <input type="text" placeholder="e.g. React Hooks, Data Structures, Networking" value={aiForm.topic} onChange={e => setAiForm({...aiForm, topic: e.target.value})} className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-pink/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400">Count (Max 20)</label>
                        <input type="number" min="1" max="20" value={aiForm.count} onChange={e => setAiForm({...aiForm, count: e.target.value})} className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-pink/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400">Type</label>
                        <select value={aiForm.type} onChange={e => setAiForm({...aiForm, type: e.target.value})} className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-pink/50">
                          <option value="both">Both</option>
                          <option value="mcq">MCQ Only</option>
                          <option value="code">Coding Only</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-1/4 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400">Difficulty</label>
                        <select value={aiForm.difficulty} onChange={e => setAiForm({...aiForm, difficulty: e.target.value})} className="w-full bg-[#10101b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-pink/50">
                          <option value="Mixed">Mixed</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <button type="button" onClick={handleGenerateAiQuestions} disabled={isGenerating} className="px-6 py-2 bg-brand-pink hover:opacity-90 text-black rounded-xl font-bold text-xs tracking-wide transition-opacity cursor-pointer flex items-center gap-2">
                        {isGenerating ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : 'Generate Now'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {formData.questions?.map((q, qIndex) => (
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
                          {q.options?.map((opt, optIndex) => (
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
                            <label className="text-[10px] font-bold text-gray-400 tracking-wide ml-1">Expected Output (Optional Exact Match)</label>
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
