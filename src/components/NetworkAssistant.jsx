import React, { useState } from 'react';
import { Sparkles, UserCheck, Code, Target, BookOpen, Compass, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function NetworkAssistant({ user, profileData }) {
  const { addToast } = useToast();
  const [activeAnalysisType, setActiveAnalysisType] = useState('study'); // 'study', 'hackathon', 'mentor'
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState({
    study: [
      { name: 'Sameer Sen', branch: 'CSE Sem 3', reason: 'Same semester, strong in Operating Systems where your target weak spot lies. Target goal alignment: 9.0 CGPA.', rating: '98% Match' },
      { name: 'Karthik Rao', branch: 'CSM Sem 3', reason: 'High alignment in React/Node projects log. Recommended for shared Lab practices.', rating: '91% Match' }
    ],
    hackathon: [
      { name: 'Ananya Roy', branch: 'ECE Sem 5', reason: 'Strong hardware/Internet of Things expertise. Complements your React web development skillset.', role: 'IoT Lead / Tech Designer' },
      { name: 'Devendra Pal', branch: 'CSE Sem 5', reason: 'Advanced algorithmic expertise, solved 400+ problems in Code Arena. Recommended for DSA/Math logs.', role: 'Backend / Algorithms' }
    ],
    mentor: [
      { name: 'Dr. Srinivas Prasad', designation: 'Professor & Dean CSE', reason: 'Specializes in Distributed Systems. Recommended for Cloud/Placement mentoring.', area: 'Cloud Computing / DSA' },
      { name: 'Abhishek Roy', designation: 'Alumni (SDE @ Google)', reason: 'LUMIXORA Ambassador, expert in placement strategies & resume optimizations.', area: 'System Design & FAANG Prep' }
    ]
  });

  const triggerSearchAnalysis = (type) => {
    setActiveAnalysisType(type);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({ message: 'AI Networking scans updated!', type: 'success' });
    }, 1200);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-brand-pink fill-current animate-pulse" />
            <span>AI Campus Copilot & Matching</span>
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Let the AI analyze your weak subjects, skills, and goals to match you with compatible partners.
          </p>
        </div>

        {/* Categories toggler */}
        <div className="flex gap-1 bg-black/35 p-1 rounded-2xl border border-white/5 self-start sm:self-auto">
          {[
            { id: 'study', label: 'Study Buddy', icon: BookOpen },
            { id: 'hackathon', label: 'Teammates', icon: Code },
            { id: 'mentor', label: 'Mentors', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => triggerSearchAnalysis(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeAnalysisType === tab.id 
                  ? 'bg-brand-pink text-white shadow-[0_0_10px_rgba(247,37,133,0.2)]' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Board */}
      <div className="min-h-[220px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-xs">
            <RefreshCw className="w-8 h-8 text-brand-pink animate-spin" />
            <span className="text-gray-400 font-bold animate-pulse">Running semantic user vector analysis...</span>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* STUDY BUDGET MATCHES */}
            {activeAnalysisType === 'study' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.study.map((m, idx) => (
                  <div key={idx} className="p-4 bg-white/5 border border-white/5 hover:border-brand-pink/20 rounded-2xl space-y-3 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{m.name}</h4>
                        <span className="text-[9px] text-gray-500 font-bold uppercase block mt-0.5">{m.branch}</span>
                      </div>
                      <span className="text-[10px] text-green-400 font-black uppercase bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded leading-none shrink-0">
                        {m.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-normal">{m.reason}</p>
                    <button 
                      onClick={() => addToast({ message: `Connection invite sent to ${m.name}!`, type: 'success' })}
                      className="w-full bg-[#f72585]/10 hover:bg-[#f72585]/20 text-brand-pink font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-[#f72585]/20"
                    >
                      Connect & Study
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* HACKATHON TEAMMATES MATCHES */}
            {activeAnalysisType === 'hackathon' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.hackathon.map((m, idx) => (
                  <div key={idx} className="p-4 bg-white/5 border border-white/5 hover:border-brand-pink/20 rounded-2xl space-y-3 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{m.name}</h4>
                        <span className="text-[9px] text-gray-500 font-bold uppercase block mt-0.5">{m.branch}</span>
                      </div>
                      <span className="text-[9px] text-brand-pink font-black uppercase bg-brand-pink/10 border border-brand-pink/20 px-2.5 py-1 rounded-xl shrink-0">
                        {m.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-normal">{m.reason}</p>
                    <button 
                      onClick={() => addToast({ message: `Collaboration offer sent to ${m.name}!`, type: 'success' })}
                      className="w-full bg-white/5 hover:bg-white/10 text-gray-200 font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
                    >
                      Invite to Project Team
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* MENTOR RECOMMENDATIONS */}
            {activeAnalysisType === 'mentor' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.mentor.map((m, idx) => (
                  <div key={idx} className="p-4 bg-white/5 border border-white/5 hover:border-brand-pink/20 rounded-2xl space-y-3 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{m.name}</h4>
                        <span className="text-[9px] text-gray-500 font-bold uppercase block mt-0.5">{m.designation}</span>
                      </div>
                      <span className="text-[9px] text-brand-blue font-black uppercase bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded-xl shrink-0">
                        {m.area}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-normal">{m.reason}</p>
                    <button 
                      onClick={() => addToast({ message: `Meeting request sent to ${m.name}!`, type: 'success' })}
                      className="w-full bg-brand-teal text-black font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Book 1-on-1 Mentorship
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
