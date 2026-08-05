import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, LogIn, UserPlus, ArrowLeft, Mail, X } from 'lucide-react';
import { supabase } from '../config/supabase';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function AuthPortal({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [retrievedAccounts, setRetrievedAccounts] = useState([]);
  const [newPasswords, setNewPasswords] = useState({});

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
  const [semester, setSemester] = useState('1');
  const [section, setSection] = useState('A');

  const handleSuccessfulLogin = (user) => {
    onLogin(user);
  };

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
          handleSuccessfulLogin({ 
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
            handleSuccessfulLogin({ 
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
            weakSubjects: weakSubjects.trim(),
            sem: semester,
            sec: section
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
            sem: semester,
            sec: section,
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

          handleSuccessfulLogin({
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
            weakSubjects: weakSubjects.trim(),
            sem: semester,
            sec: section
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
          handleSuccessfulLogin({ id: createdUser.id, uid: createdUser.id, ...createdUser });
        }
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please ensure you are connected to the internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (providerName) => {
    try {
      setLoading(true);
      setError('');
      let provider;
      if (providerName === 'google') {
        provider = new GoogleAuthProvider();
      } else if (providerName === 'github') {
        provider = new GithubAuthProvider();
      }

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      let userProfile;
      const isFounderOrAdmin = firebaseUser.email?.toLowerCase() === 'admin@lumixora.com' || firebaseUser.email?.toLowerCase().includes('founder') || firebaseUser.email?.toLowerCase().includes('admin');
      const role = isFounderOrAdmin ? 'founder' : 'user';

      if (docSnap.exists()) {
        userProfile = { ...docSnap.data(), id: firebaseUser.uid, uid: firebaseUser.uid, role };
      } else {
        const defaultProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Student',
          email: firebaseUser.email || '',
          qualification: 'B.Tech',
          college: 'Lumixora Academy',
          place: 'Online',
          year: '1st Year',
          cgpa: '9.0',
          targetCGPA: '9.0',
          careerGoal: 'Placement',
          department: 'CSE',
          sem: '1',
          sec: 'A',
          learningStyle: 'Practical',
          weakSubjects: 'None',
          strongSubjects: 'None',
          subjects: 'Data Structures',
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
          created_at: new Date().toISOString(),
          role
        };
        await setDoc(docRef, defaultProfile);
        try {
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
            avatarUrl: firebaseUser.photoURL || '',
            quizScore: 85,
            studyHours: 0,
            notesShared: 0
          });
        } catch (err) {
          console.warn("Leaderboard doc error:", err);
        }
        userProfile = { ...defaultProfile, id: firebaseUser.uid };
      }

      handleSuccessfulLogin(userProfile);
    } catch (err) {
      console.error(err);
      setError(`Failed to sign in with ${providerName}. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const query = resetEmail.trim();
    if (!query) {
      setResetError('Please enter your email or roll number.');
      return;
    }
    setResetLoading(true);
    setResetError('');
    setRetrievedAccounts([]);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;

      const lowercaseQuery = query.toLowerCase();
      const matches = data.filter(u => {
        const email = (u.email || '').toLowerCase();
        const name = (u.name || '').toLowerCase();
        
        return email === lowercaseQuery || 
               email.split('@')[0] === lowercaseQuery || 
               email.includes(lowercaseQuery) ||
               name.includes(lowercaseQuery);
      });

      if (matches.length === 0) {
        setResetError('No account found with this email or roll number.');
      } else {
        const accounts = matches.map(u => {
          let displayName = u.name || '';
          if (displayName.includes('{')) {
            try {
              const parts = displayName.split(' ');
              const jsonPart = parts.find(p => p.startsWith('{'));
              if (jsonPart) {
                const meta = JSON.parse(jsonPart);
                displayName = meta.name || parts[0];
              } else {
                displayName = parts[0];
              }
            } catch (e) {
              displayName = displayName.split(' ')[0];
            }
          }
          const isFounderOrAdmin = u.email.toLowerCase() === 'admin@lumixora.com' || u.email.toLowerCase().includes('founder') || u.email.toLowerCase().includes('admin') || u.role === 'founder';
          return {
            id: u.id,
            email: u.email,
            name: displayName,
            password: u.password,
            isFounder: isFounderOrAdmin
          };
        });
        setRetrievedAccounts(accounts);
      }
    } catch (err) {
      console.error('Retrieve password error:', err);
      setResetError(err.message || 'Failed to retrieve password. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleUpdatePassword = async (userId, newPasswordStr) => {
    try {
      if (!newPasswordStr || newPasswordStr.length < 6) {
        setResetError('Password must be at least 6 characters long.');
        return;
      }
      setResetLoading(true);
      setResetError('');
      
      const { error } = await supabase
        .from('users')
        .update({ password: newPasswordStr })
        .eq('id', userId);
        
      if (error) throw error;
      
      alert('Password updated successfully! You can now log in.');
      setRetrievedAccounts([]);
      setResetEmail('');
      setShowForgotPassword(false);
      setNewPasswords({});
    } catch (err) {
      console.error('Update password error:', err);
      setResetError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      
      {/* Massive Background Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1 className="text-[20vw] font-semibold text-transparent bg-clip-text bg-gradient-to-br from-[#00f5d4]/10 to-[#7209b7]/10 tracking-tighter opacity-40 animate-pulse-slow rotate-[-5deg] select-none">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Department / Major (Branch)</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={String(s)}>Semester {s}</option>
                  ))}
                  <option value="Completed">Completed</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none appearance-none"
                >
                  {['A', 'B', 'C', 'D', 'E', 'None'].map(s => (
                    <option key={s} value={s}>Section {s}</option>
                  ))}
                </select>
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
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setResetEmail(email);
                  setResetError('');
                }}
                className="text-sm text-[#00f5d4] hover:text-[#00b4d8] transition-colors bg-transparent border-none cursor-pointer"
              >
                Forgot password?
              </button>
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

        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuthSignIn('google')}
            className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleOAuthSignIn('github')}
            className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </button>
        </div>

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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForgotPassword(false); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Card */}
          <div
            className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15,15,25,0.97) 0%, rgba(20,10,35,0.97) 100%)',
              boxShadow: '0 0 60px rgba(0,245,212,0.08), 0 0 120px rgba(114,9,183,0.06)',
              animation: 'fadeInUp 0.3s ease-out'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f5d4] to-[#7209b7] flex items-center justify-center mb-4 shadow-lg shadow-[#00f5d4]/20">
                <Mail className="text-white w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {retrievedAccounts.length > 0 ? 'Account Details' : 'Retrieve Password'}
              </h3>
              <p className="text-gray-400 text-sm text-center">
                {retrievedAccounts.length > 0 
                  ? 'Here are your account credentials:' 
                  : "Enter your email address or student roll number to find your password."}
              </p>
            </div>

            {/* Error Message */}
            {resetError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-5 text-sm text-center">
                {resetError}
              </div>
            )}

            {retrievedAccounts.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                  {retrievedAccounts.map((acc, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#00f5d4] font-semibold tracking-wider uppercase">Account #{idx + 1}</span>
                        <span className="text-xs text-gray-400 font-medium">{acc.name}</span>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block tracking-wide font-semibold">Email Address</label>
                        <span className="text-white text-sm break-all font-medium">{acc.email}</span>
                      </div>
                      
                      {acc.isFounder ? (
                        <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex justify-between items-center mt-2">
                          <div>
                            <label className="text-[10px] text-gray-500 block tracking-wide font-semibold">Password</label>
                            <span className="text-[#00f5d4] text-base font-mono font-bold tracking-wide select-all">{acc.password}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(acc.password);
                              alert('Password copied to clipboard!');
                            }}
                            className="text-xs text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="text-[10px] text-gray-500 block tracking-wide font-semibold mb-1">New Password</label>
                            <input
                              type="password"
                              value={newPasswords[acc.id] || ''}
                              onChange={(e) => setNewPasswords({...newPasswords, [acc.id]: e.target.value})}
                              placeholder="Enter new password"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f5d4]/50 transition-colors text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdatePassword(acc.id, newPasswords[acc.id])}
                            disabled={resetLoading || !(newPasswords[acc.id]?.length >= 6)}
                            className="w-full py-2 rounded-xl text-xs font-bold tracking-wide bg-white/10 hover:bg-[#00f5d4]/20 text-white hover:text-[#00f5d4] transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {resetLoading ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRetrievedAccounts([]);
                    setResetEmail('');
                  }}
                  className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-[#00f5d4] to-[#7209b7] hover:opacity-90 transition-opacity mt-2"
                >
                  Search Another Account
                </button>
              </div>
            ) : (
              /* Search Form */
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email or Roll Number</label>
                  <input
                    type="text"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                    placeholder="e.g. 249xa33106 or you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-[#00f5d4] to-[#7209b7] hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {resetLoading ? (
                    <span className="animate-pulse">Finding Account...</span>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Get Password</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setRetrievedAccounts([]);
                  setResetEmail('');
                }}
                className="text-sm text-gray-400 hover:text-[#00f5d4] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
