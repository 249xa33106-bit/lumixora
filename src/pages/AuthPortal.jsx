import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../config/supabase';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function AuthPortal({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qualification, setQualification] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [place, setPlace] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year');
  const [cgpa, setCgpa] = useState('9.0');
  const [careerGoal, setCareerGoal] = useState('Placement');
  const [department, setDepartment] = useState('CSE');
  const [learningStyle, setLearningStyle] = useState('Practical');
  const [weakSubjects, setWeakSubjects] = useState('Computer Networks');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        try {
          // 1. Try Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          let userDoc = {};
          try {
            const docRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              userDoc = docSnap.data();
            }
          } catch (docErr) {
            console.warn("Firestore user document fetch failed:", docErr);
          }
          
          const isFounderOrAdmin = firebaseUser.email.toLowerCase() === 'admin@lumixora.com' || firebaseUser.email.toLowerCase().includes('founder') || firebaseUser.email.toLowerCase().includes('admin');
          onLogin({ 
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || userDoc.name || email.split('@')[0],
            email: firebaseUser.email,
            ...userDoc,
            role: isFounderOrAdmin ? 'founder' : (userDoc.role || 'user')
          });
        } catch (firebaseErr) {
          console.warn("Firebase Authentication failed, attempting Supabase fallback:", firebaseErr);
          
          // 2. Try Supabase Auth check fallback
          const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password);
          
          if (data && data.length > 0) {
            const userDoc = data[0];
            const isFounderOrAdmin = userDoc.email.toLowerCase() === 'admin@lumixora.com' || userDoc.email.toLowerCase().includes('founder') || userDoc.email.toLowerCase().includes('admin');
            onLogin({ 
              id: userDoc.id, 
              uid: userDoc.id,
              ...userDoc,
              role: isFounderOrAdmin ? 'founder' : userDoc.role 
            });
          } else {
            setError(firebaseErr.message.includes('auth/') ? firebaseErr.message : 'Invalid email or password.');
          }
        }
      } else {
        // Registration logic
        try {
          // 1. Try Firebase Auth Register
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          const role = (email.toLowerCase().includes('founder') || email.toLowerCase().includes('admin')) 
            ? 'founder' 
            : 'user';

          const metadata = {
            qualification: qualification.trim(),
            college: collegeName.trim(),
            place: place.trim(),
            year: yearOfStudy,
            cgpa: cgpa.trim(),
            careerGoal: careerGoal,
            department: department.trim(),
            learningStyle: learningStyle,
            weakSubjects: weakSubjects.trim()
          };

          const nameWithMetadata = `${name.trim()} ${JSON.stringify(metadata)}`;

          await updateProfile(firebaseUser, {
            displayName: nameWithMetadata
          });

          const defaultProfile = {
            uid: firebaseUser.uid,
            name: name.trim(),
            email,
            qualification: qualification.trim(),
            college: collegeName.trim(),
            place: place.trim(),
            year: yearOfStudy,
            cgpa: cgpa.trim(),
            targetCGPA: cgpa.trim(),
            careerGoal,
            department: department.trim(),
            learningStyle,
            weakSubjects: weakSubjects.trim(),
            strongSubjects: 'Data Structures, Algorithms',
            subjects: 'Data Structures, Design and Analysis of Algorithms, Database Systems, Computer Networks',
            xp: 0,
            todayXp: 0,
            level: 1,
            coins: 100,
            streak: 0,
            longestStreak: 0,
            streakFreezeCount: 1,
            lastActiveDate: null,
            completedDays: [],
            badges: ['first_login'],
            purchasedThemes: ['default'],
            purchasedFrames: ['none'],
            currentTheme: 'default',
            currentFrame: 'none',
            studyHours: 0,
            quizScore: 85,
            notesShared: 0,
            lastDailyReset: new Date().toDateString(),
            created_at: new Date().toISOString()
          };

          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile);
            await setDoc(doc(db, 'leaderboards', firebaseUser.uid), {
              id: firebaseUser.uid,
              name: defaultProfile.name,
              college: defaultProfile.college,
              department: defaultProfile.department,
              year: defaultProfile.year,
              city: defaultProfile.place,
              state: defaultProfile.place,
              country: 'India',
              xp: 0,
              streak: 0,
              badgesCount: 1,
              level: 1,
              avatarUrl: '',
              quizScore: 85,
              studyHours: 0,
              notesShared: 0
            });
          } catch (dbErr) {
            console.warn("Firestore database profiling failed:", dbErr);
          }

          onLogin({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: nameWithMetadata,
            email,
            ...defaultProfile,
            role
          });

        } catch (firebaseErr) {
          console.warn("Firebase Auth registration failed, attempting Supabase fallback:", firebaseErr);
          
          // 2. Try Supabase Auth check fallback
          const { data: existingUsers } = await supabase.from('users').select('*').eq('email', email);
          
          if (existingUsers && existingUsers.length > 0) {
            setError('An account with this email already exists.');
            setLoading(false);
            return;
          }

          const role = (email.toLowerCase().includes('founder') || email.toLowerCase().includes('admin')) 
            ? 'founder' 
            : 'user';

          const metadata = {
            qualification: qualification.trim(),
            college: collegeName.trim(),
            place: place.trim(),
            year: yearOfStudy,
            cgpa: cgpa.trim(),
            careerGoal: careerGoal,
            department: department.trim(),
            learningStyle: learningStyle,
            weakSubjects: weakSubjects.trim()
          };

          const newUser = {
            name: `${name.trim()} ${JSON.stringify(metadata)}`,
            email,
            password,
            role,
            created_at: new Date().toISOString()
          };

          const { data: insertedDocs, error: insertError } = await supabase.from('users').insert([newUser]).select();
          
          if (insertError || !insertedDocs || insertedDocs.length === 0) {
             setError('Failed to register account.');
             setLoading(false);
             return;
          }
          const createdUser = insertedDocs[0];
          onLogin({ id: createdUser.id, uid: createdUser.id, ...createdUser });
        }
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please ensure you are connected to the internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      
      {/* Massive Background Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1 className="text-[20vw] font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00f5d4]/10 to-[#7209b7]/10 tracking-tighter opacity-40 animate-pulse-slow rotate-[-5deg] select-none">
          LUMIXORA
        </h1>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5d4]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7209b7]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Glassmorphic Auth Card */}
      <div className="z-10 w-full max-w-md p-8 glass-panel rounded-3xl animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00f5d4] to-[#7209b7] flex items-center justify-center mb-4 shadow-lg shadow-[#00f5d4]/20">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome back to Lumixora' : 'Create Account'}
          </h2>
          <p className="text-gray-400 text-center">
            {isLogin 
              ? 'Enter your credentials to access your workspace.' 
              : 'Join Lumixora to supercharge your learning experience.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Qualification</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                  placeholder="e.g. B.Tech, Degree"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">College Name</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                  placeholder="e.g. GPREC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">College Location (Place)</label>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                  placeholder="e.g. Kurnool"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year of Study</label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  required
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all appearance-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Completed">Completed</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Department / Major</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                  placeholder="e.g. CSE, ECE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target CGPA</label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                  placeholder="e.g. 9.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Career Goal</label>
                <select
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  required
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none appearance-none"
                >
                  <option value="Placement">Placement / Jobs</option>
                  <option value="GATE">GATE Exam</option>
                  <option value="Higher Studies">Higher Studies</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Government Jobs">Government Jobs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Learning Style</label>
                <select
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                  required
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none appearance-none"
                >
                  <option value="Practical">Practical (Hands-on)</option>
                  <option value="Visual">Visual (Videos/Charts)</option>
                  <option value="Reading">Reading (Books/Notes)</option>
                  <option value="Audio">Audio (Lectures)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Weak Subject</label>
                <input
                  type="text"
                  value={weakSubjects}
                  onChange={(e) => setWeakSubjects(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                  placeholder="e.g. Computer Networks"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-sm text-[#00f5d4] hover:text-[#00b4d8] transition-colors">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-[#00f5d4] to-[#7209b7] hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-[#00f5d4] font-medium hover:underline focus:outline-none"
          >
            {isLogin ? 'Register now' : 'Sign in here'}
          </button>
        </div>

        {/* Download Android App Section */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center">
          <a 
            href="https://ykuyzkhhnltjccyzduap.supabase.co/storage/v1/object/public/academic_resources/app/Lumixora.apk" 
            download="Lumixora.apk"
            className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-[#00f5d4] border border-[#00f5d4]/30 hover:border-[#00f5d4] hover:bg-[#00f5d4]/5 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Android App (APK)
          </a>
          <p className="text-[10px] text-gray-500 mt-2 text-center">Install directly on your phone for mobile access.</p>
        </div>

      </div>
    </div>
  );
}
