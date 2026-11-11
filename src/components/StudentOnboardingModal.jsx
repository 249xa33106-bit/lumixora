import React, { useState } from 'react';
import { 
  Sparkles, Target, Compass, Award, 
  BookOpen, Code, ArrowRight, CheckCircle2, ChevronRight, X,
  GraduationCap, Layers, Cpu, Flame, Check, ShieldCheck
} from 'lucide-react';
import { analyzeAndRecommendPortals, ALL_PORTALS } from '../utils/portalMapping';

const GOAL_OPTIONS = [
  { id: 'Placement', title: 'Campus Placement & Jobs', desc: 'Crack MNC & Product Drives, DSA, Mock Interviews', icon: Award },
  { id: 'Internship', title: 'Internship & Industry Experience', desc: 'Live tasks, tech internships, proof of work', icon: Target },
  { id: 'Coding', title: 'DSA & Coding Mastery', desc: 'Data Structures, Algorithms, Competitive Coding', icon: Code },
  { id: 'Academic', title: 'Academic Excellence (CGPA)', desc: 'Semester syllabus, smart notes, doubt solving & exams', icon: BookOpen },
  { id: 'Communication', title: 'English & Interview Speaking', desc: 'Fluency, voice training, campus group discussions', icon: Sparkles },
];

const INTEREST_OPTIONS = [
  'Data Structures & Algorithms',
  'Full Stack Web Development',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'English Speaking & GD',
  'Competitive Coding Contests',
  'Semester Exam Notes',
  'Campus Internships',
  'Off-campus Referrals',
  'Cybersecurity & Ethical Hacking',
  'System Design & Architecture',
  'App Development (Android/Flutter)'
];

const EXPERIENCE_LEVELS = [
  { id: 'Beginner', title: 'Beginner / Foundation', desc: 'Starting from scratch, need structured fundamentals and step-by-step guidance.' },
  { id: 'Intermediate', title: 'Intermediate / Active Learner', desc: 'Comfortable with core concepts, building projects and solving standard problems.' },
  { id: 'Advanced', title: 'Advanced / Placement Ready', desc: 'Focusing on high-speed mock tests, interview cracking, and company drives.' }
];

const STUDY_STYLES = [
  { id: 'Practical', label: 'Hands-on & Code Labs' },
  { id: 'Visual', label: 'Video Hub & Concept Slides' },
  { id: 'ExamFocus', label: 'Important Questions & Notes' },
  { id: 'PeerStudy', label: 'Squad Study & Hackathons' }
];

const TOTAL_STEPS = 4;

export default function StudentOnboardingModal({ isOpen, onClose, user, onSavePreferences }) {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(user?.careerGoal || 'Placement');
  const [academicYear, setAcademicYear] = useState(user?.year || user?.yearOfStudy || '1st Year');
  const [academicDept, setAcademicDept] = useState(user?.department || user?.branch || 'CSE');
  const [selectedInterests, setSelectedInterests] = useState(
    Array.isArray(user?.interests) && user.interests.length > 0 
      ? user.interests 
      : ['Data Structures & Algorithms', 'Full Stack Web Development']
  );
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Beginner');
  const [studyMode, setStudyMode] = useState(user?.learningStyle || 'Practical');
  const [selectedPortals, setSelectedPortals] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleRunAnalysis = () => {
    const recommended = analyzeAndRecommendPortals({
      careerGoal: selectedGoal,
      interests: selectedInterests,
      year: academicYear,
      department: academicDept,
      experienceLevel,
      studyMode
    });
    setSelectedPortals(recommended);
    setStep(4);
  };

  const togglePortal = (portalId) => {
    setSelectedPortals(prev => 
      prev.includes(portalId) ? prev.filter(id => id !== portalId) : [...prev, portalId]
    );
  };

  const handleFinalSave = () => {
    setIsSubmitting(true);
    try {
      const res = onSavePreferences({
        careerGoal: selectedGoal,
        interests: selectedInterests,
        year: academicYear,
        department: academicDept,
        experienceLevel,
        learningStyle: studyMode,
        activePortals: selectedPortals,
        onboardingCompleted: true
      });
      if (res && typeof res.catch === 'function') {
        res.catch(err => console.warn("Background onboarding sync warning:", err));
      }
    } catch (err) {
      console.warn("Onboarding save handler notice:", err);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0b101b] border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden relative">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10 bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                Personalize Your Lumixora Journey
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Step {step} of {TOTAL_STEPS}
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                {step === 1 && "Choose your primary goal to help us tailor your roadmap."}
                {step === 2 && "Confirm your academic track & pick your core interests."}
                {step === 3 && "Select your current technical experience and preferred style."}
                {step === 4 && "AI analyzed your answers! Review and refine your tailored portals."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Skip for now"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar indicator */}
        <div className="w-full h-1 bg-white/5 relative z-10">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar relative z-10">

          {/* STEP 1: Primary Goal */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-400 block">
                1. What is your primary destination right now?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = selectedGoal === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedGoal(opt.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-400 text-black' : 'bg-white/10 text-gray-300'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate">{opt.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{opt.desc}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Academics & Interests */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block mb-1.5">
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Pre-Final)</option>
                    <option value="4th Year">4th Year (Final Year)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block mb-1.5">
                    Branch / Specialization
                  </label>
                  <select
                    value={academicDept}
                    onChange={(e) => setAcademicDept(e.target.value)}
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="CSE">CSE (Computer Science)</option>
                    <option value="CSM">CSM (AI & Machine Learning)</option>
                    <option value="CSD">CSD (Data Science)</option>
                    <option value="ECE">ECE (Electronics & Comm)</option>
                    <option value="EEE">EEE (Electrical & Electronics)</option>
                    <option value="MECH">MECH (Mechanical Eng)</option>
                    <option value="CIVIL">CIVIL (Civil Eng)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-cyan-400 block mb-2.5">
                  Select your top areas of interest:
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Experience & Learning Style */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-cyan-400 block mb-3">
                  Current Technical Experience
                </label>
                <div className="space-y-2.5">
                  {EXPERIENCE_LEVELS.map(lvl => {
                    const isSelected = experienceLevel === lvl.id;
                    return (
                      <div
                        key={lvl.id}
                        onClick={() => setExperienceLevel(lvl.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{lvl.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{lvl.desc}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-3" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-cyan-400 block mb-2.5">
                  Preferred Learning Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STUDY_STYLES.map(style => {
                    const isSelected = studyMode === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setStudyMode(style.id)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {isSelected ? '● ' : '○ '}{style.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review Tailored Portals */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                    ✨ Recommended For You ({selectedPortals.length} Portals)
                  </h3>
                  <p className="text-[11px] text-gray-300 mt-0.5">
                    Tailored for {academicYear} {academicDept} • {selectedGoal} focus. You can adjust or reveal all portals anytime from your profile or the sidebar toggle.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPortals(ALL_PORTALS.map(p => p.id))}
                  className="text-[10px] font-bold text-cyan-400 hover:underline shrink-0 ml-4 cursor-pointer"
                >
                  Select All Portals
                </button>
              </div>

              {/* Portals Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_PORTALS.map(portal => {
                  const isChecked = selectedPortals.includes(portal.id);
                  return (
                    <div
                      key={portal.id}
                      onClick={() => togglePortal(portal.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                          : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                      }`}
                    >
                      <span className="text-xs font-bold">{portal.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-black/40 flex items-center justify-between relative z-10">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Skip
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-black text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : step === 3 ? (
            <button
              type="button"
              onClick={handleRunAnalysis}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-black text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Analyze & Match Portals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-black text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Configuring Live Workspace...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enter My Personalized Workspace</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
