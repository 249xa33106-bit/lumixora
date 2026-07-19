import React, { useState } from 'react';
import { User, Award, FolderGit, Link2, Sparkles, Edit3, ShieldAlert, Cpu, Heart, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const parseUserProfile = (fullName) => {
  let name = fullName || '';
  let metadata = { qualification: '', college: '', place: '', year: '3rd Year', avatarUrl: '' };
  if (name.includes('{')) {
    const idx = name.indexOf('{');
    const jsonStr = name.substring(idx).trim();
    name = name.substring(0, idx).trim();
    try {
      metadata = JSON.parse(jsonStr);
    } catch (e) {}
  }
  return { name: name || 'Scholar Student', ...metadata };
};

export default function NetworkProfile({ user, profileData, onUpdateProfile }) {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiScore, setAiScore] = useState(null);

  const parsedUser = parseUserProfile(user?.name);

  // Form states
  const [name, setName] = useState(profileData?.name || parsedUser.name);
  const [college, setCollege] = useState(profileData?.college || parsedUser.college || 'LUMIXORA University of Tech');
  const [dept, setDept] = useState(profileData?.dept || parsedUser.qualification || 'Computer Science');
  const [year, setYear] = useState(profileData?.year || parsedUser.year || '3rd Year');
  const [bio, setBio] = useState(profileData?.bio || 'Passionate student designer & coder building the next-gen ed-tech ecosystems. Let\'s collaborate!');
  const [skills, setSkills] = useState(profileData?.skills || 'React, Node.js, Python, Firebase, Figma');
  const [interests, setInterests] = useState(profileData?.interests || 'AI/ML, Open Source, Hackathons, Placements');
  
  // Custom links
  const [github, setGithub] = useState(profileData?.github || 'https://github.com/scholar-student');
  const [linkedin, setLinkedin] = useState(profileData?.linkedin || 'https://linkedin.com/in/scholar-student');
  const [portfolio, setPortfolio] = useState(profileData?.portfolio || 'https://scholar.dev');

  const handleSave = () => {
    const updated = {
      name,
      college,
      dept,
      year,
      bio,
      skills,
      interests,
      github,
      linkedin,
      portfolio
    };
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setIsEditing(false);
    addToast({ message: 'Profile updated successfully!', type: 'success' });
  };

  const handleRunAiGrader = () => {
    setLoadingAi(true);
    setTimeout(() => {
      // Simulate semantic profile completeness score
      const skillCount = skills.split(',').filter(s => s.trim().length > 0).length;
      const interestCount = interests.split(',').filter(i => i.trim().length > 0).length;
      const score = Math.min(100, 40 + (skillCount * 6) + (interestCount * 5) + (bio.length > 50 ? 15 : 5) + (github ? 10 : 0));
      setAiScore({
        score,
        grade: score >= 90 ? 'Outstanding (L1)' : score >= 80 ? 'Placement Ready (L2)' : 'Needs Enrichment (L3)',
        feedback: score >= 85 
          ? 'Your profile is highly optimized. Excellent skill mapping, multiple project log integrations, and active external portfolio credentials.' 
          : 'Consider listing specific certifications, detailed technical project descriptions, and adding structural bullet points to your bio to score >85%.'
      });
      setLoadingAi(false);
      addToast({ message: 'AI Grade audit complete!', type: 'success' });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Cover & Profile Frame Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-black/40">
        {/* Cover */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-brand-teal/20 via-brand-purple/20 to-brand-blue/30 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
          {/* Edit / Save triggers */}
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-white/10 cursor-pointer"
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Profile Details Header */}
        <div className="px-6 pb-6 pt-16 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Avatar Picture (Absolutely Positioned Over Cover boundary) */}
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-2xl bg-[#0b0b14] border-4 border-[#0b0b14] overflow-hidden shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white text-3xl font-black">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>{name}</span>
              <span className="text-[9px] font-black uppercase bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded border border-brand-teal/20">Active Student</span>
            </h2>
            <p className="text-xs text-gray-400 font-semibold">{dept} • {year}</p>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{college}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio, Skills, Portfolio */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bio Box */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-teal" />
              <span>Bio Description</span>
            </h3>
            {isEditing ? (
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-brand-teal resize-none"
                rows="3"
              />
            ) : (
              <p className="text-xs text-gray-400 leading-relaxed font-normal">{bio}</p>
            )}
          </div>

          {/* Skills & Interests Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Skills */}
            <div className="glass-panel p-6 rounded-3xl space-y-3">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Skills & Expertise</span>
              {isEditing ? (
                <input 
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal"
                  placeholder="React, Python, etc."
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skills.split(',').map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{s.trim()}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Interests */}
            <div className="glass-panel p-6 rounded-3xl space-y-3">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Core Interests</span>
              {isEditing ? (
                <input 
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal"
                  placeholder="AI/ML, Web3, etc."
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {interests.split(',').map((i, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{i.trim()}</span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Portfolio & Credentials links */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-brand-blue" />
              <span>External Portfolios</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* GitHub */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-500 font-bold block">GitHub Link</span>
                {isEditing ? (
                  <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                ) : (
                  <a href={github} target="_blank" rel="noreferrer" className="text-xs text-brand-blue hover:underline block truncate font-semibold">{github.replace('https://', '')}</a>
                )}
              </div>

              {/* LinkedIn */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-500 font-bold block">LinkedIn Profile</span>
                {isEditing ? (
                  <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                ) : (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="text-xs text-brand-blue hover:underline block truncate font-semibold">{linkedin.replace('https://', '')}</a>
                )}
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-500 font-bold block">Personal Website</span>
                {isEditing ? (
                  <input type="text" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                ) : (
                  <a href={portfolio} target="_blank" rel="noreferrer" className="text-xs text-brand-blue hover:underline block truncate font-semibold">{portfolio.replace('https://', '')}</a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Grader & Badges */}
        <div className="space-y-6">
          
          {/* AI Grader Widget */}
          <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-brand-pink/5 to-brand-purple/5 border border-brand-pink/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-brand-pink" />
                <span>AI Profile Grader</span>
              </h3>
              <span className="text-[10px] font-black uppercase text-brand-pink tracking-widest">CO-PILOT</span>
            </div>

            {!aiScore ? (
              <div className="space-y-4">
                <p className="text-[11px] text-gray-400 font-normal leading-relaxed">
                  Evaluate your profile semantic completeness, skill mapping quality, and credentials coverage relative to top engineering placement benchmarks.
                </p>
                <button
                  onClick={handleRunAiGrader}
                  disabled={loadingAi}
                  className="w-full py-2.5 rounded-xl bg-brand-pink hover:opacity-95 text-white font-extrabold text-xs tracking-wider uppercase transition-opacity flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loadingAi ? 'Auditing profile...' : 'Audit Profile Grade'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in text-left">
                <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                  <span className="text-[11px] text-gray-400 font-bold block uppercase tracking-wide">Readiness Grade</span>
                  <span className="text-2xl font-black text-brand-pink">{aiScore.score}%</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-purple font-black block uppercase tracking-widest">{aiScore.grade}</span>
                  <p className="text-[11px] text-gray-400 font-normal leading-relaxed leading-normal bg-white/[0.01] p-3 rounded-xl border border-white/5">{aiScore.feedback}</p>
                </div>
                <button 
                  onClick={() => setAiScore(null)}
                  className="w-full bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 font-semibold py-2 rounded-xl text-[10px] uppercase tracking-wider"
                >
                  Re-evaluate
                </button>
              </div>
            )}
          </div>

          {/* Badges Box */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-teal" />
              <span>LUMIXORA Achievements</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Badge 1 */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center space-y-2 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-200 block truncate max-w-full">Loop Master</span>
                  <span className="text-[8px] text-gray-500 font-bold block uppercase mt-0.5">Code Arena</span>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center space-y-2 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center text-brand-pink">
                  <Heart className="w-4.5 h-4.5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-200 block truncate max-w-full">Guru Contributor</span>
                  <span className="text-[8px] text-gray-500 font-bold block uppercase mt-0.5">Note Share</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
