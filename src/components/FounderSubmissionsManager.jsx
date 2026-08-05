import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FileText, ArrowLeft, CheckCircle, XCircle, Code, List, Trash2, Edit2, Save, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function FounderSubmissionsManager() {
  const { addToast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [editScoreValue, setEditScoreValue] = useState('');

  const handleDeleteSubmission = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this submission?')) return;
    try {
      await deleteDoc(doc(db, 'test_results', id));
      addToast({ message: 'Submission deleted successfully.', type: 'success' });
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
      addToast({ message: 'Failed to delete submission.', type: 'error' });
    }
  };

  const handleUpdateScore = async () => {
    if (!selectedSubmission) return;
    try {
      const newScore = parseInt(editScoreValue);
      if (isNaN(newScore)) {
        addToast({ message: 'Invalid score value.', type: 'error' });
        return;
      }
      
      const subRef = doc(db, 'test_results', selectedSubmission.id);
      await updateDoc(subRef, { score: newScore });
      
      addToast({ message: 'Score updated successfully.', type: 'success' });
      const updatedSubmission = { ...selectedSubmission, score: newScore };
      setSelectedSubmission(updatedSubmission);
      setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? updatedSubmission : s));
      setIsEditingScore(false);
    } catch (err) {
      console.error('Error updating score:', err);
      addToast({ message: 'Failed to update score.', type: 'error' });
    }
  };

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'test_results'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const subs = [];
      snapshot.forEach(doc => {
        subs.push({ ...doc.data(), id: doc.id });
      });
      setSubmissions(subs);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      addToast({ message: 'Failed to load submissions.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const renderSubmissionDetail = () => {
    if (!selectedSubmission) return null;
    const { test, answers, score, total, user, date } = selectedSubmission;
    const testDate = new Date(date).toLocaleString();

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedSubmission(null)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-white">{test?.title || 'Unknown Test'}</h2>
              <p className="text-sm text-gray-400">
                Submitted by <strong className="text-brand-teal">{user || 'Anonymous'}</strong>
                {selectedSubmission.userEmail && <span className="text-gray-500 ml-1">({selectedSubmission.userEmail})</span>} on {testDate}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              {isEditingScore ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Score:</span>
                  <input
                    type="number"
                    value={editScoreValue}
                    onChange={(e) => setEditScoreValue(e.target.value)}
                    className="w-16 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-white/10"
                  />
                  <span className="text-gray-400">/ {total}</span>
                  <button onClick={handleUpdateScore} className="ml-2 p-1.5 bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-black rounded-lg transition-colors">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditingScore(false)} className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-semibold text-brand-blue">{score}</span>
                    <span className="text-gray-400 font-bold text-sm"> / {total}</span>
                    <div className="text-[10px] text-gray-500 font-bold tracking-wide">Score</div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditScoreValue(score);
                      setIsEditingScore(true);
                    }}
                    className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-brand-teal rounded-lg transition-colors border border-white/10 cursor-pointer"
                    title="Edit Score"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {test?.questions?.map((q, qIndex) => {
            const userAnswer = answers?.[qIndex];
            
            if (q.type === 'mcq') {
              const isCorrect = userAnswer === q.correct;
              return (
                <div key={qIndex} className="glass-panel p-5 rounded-2xl border border-white/5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue shrink-0">
                      <List className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Q{qIndex + 1}. {q.question}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs font-bold tracking-wide">
                        {isCorrect ? (
                          <span className="text-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct</span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Incorrect</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pl-12">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      const isActualCorrect = q.correct === optIdx;
                      
                      let bgClass = "bg-white/5 border-white/5 text-gray-400";
                      let indicator = null;

                      if (isActualCorrect) {
                        bgClass = "bg-green-500/10 border-green-500/30 text-green-400";
                        indicator = "Correct Answer";
                      }
                      
                      if (isSelected) {
                        if (isActualCorrect) {
                           indicator = "Your Selection (Correct)";
                        } else {
                           bgClass = "bg-red-500/10 border-red-500/30 text-red-400";
                           indicator = "User Selection (Incorrect)";
                        }
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border ${bgClass} flex justify-between items-center text-sm`}>
                          <span>{opt}</span>
                          {indicator && <span className="text-[10px] font-bold tracking-wide opacity-70">{indicator}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (q.type === 'code') {
              return (
                <div key={qIndex} className="glass-panel p-5 rounded-2xl border border-white/5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-brand-teal/10 rounded-lg text-brand-teal shrink-0">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Q{qIndex + 1}. {q.question}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="bg-brand-teal/20 text-brand-teal px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide">
                          {q.language || 'Python'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-500 tracking-wide ml-1">User's Submitted Code</h4>
                      <pre className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap h-64">
                        {userAnswer || q.initialCode || 'No code submitted.'}
                      </pre>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-gray-500 tracking-wide ml-1">Expected Output</h4>
                        <pre className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
                          {q.expectedOutput || 'No expected output defined.'}
                        </pre>
                      </div>
                      <div className="p-4 bg-brand-blue/5 border border-white/10 rounded-xl">
                        <h4 className="text-[10px] font-bold text-brand-blue tracking-wide mb-2">Notice</h4>
                        <p className="text-xs text-gray-300">
                          The system auto-scored this by compiling the student's code and matching its <code className="bg-black/30 px-1 rounded text-white">stdout</code> strictly against the expected output above.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (selectedSubmission) {
    return renderSubmissionDetail();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide flex items-center gap-3">
            <FileText className="w-6 h-6 text-brand-blue" />
            User Submissions
          </h2>
          <p className="text-sm text-gray-400 mt-1">Review detailed answers submitted by students.</p>
        </div>
        <button 
          onClick={loadSubmissions}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
        >
          Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((sub) => {
          const testDate = new Date(sub.date).toLocaleDateString() + ' ' + new Date(sub.date).toLocaleTimeString();
          return (
            <div 
              key={sub.id} 
              onClick={() => setSelectedSubmission(sub)}
              className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 icon-3d-blue rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-right">
                    <div className="text-xl font-semibold text-white">{sub.score}/{sub.total}</div>
                    <div className="text-[10px] font-bold text-gray-500 tracking-wide">Score</div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSubmission(sub.id, e)}
                    className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete Submission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 truncate">{sub.testTitle || 'Unknown Test'}</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-400 truncate">By <span className="text-brand-teal font-medium">{sub.user || 'Anonymous'}</span></p>
                {sub.userEmail && <p className="text-xs text-gray-500 truncate">{sub.userEmail}</p>}
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500">{testDate}</span>
                <span className="text-[10px] font-bold tracking-wide text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  View Details &rarr;
                </span>
              </div>
            </div>
          );
        })}

        {submissions.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/5 border border-white/5 border-dashed rounded-2xl">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No Submissions Yet</h3>
            <p className="text-gray-400 text-sm mt-2">When students submit tests, their answers will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
