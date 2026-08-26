import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, LogIn, UserPlus, ArrowLeft, ArrowRight, Mail, X, Building2, GraduationCap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '../config/supabase';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { DEFAULT_COLLEGES, isValidInstitutionalEmail, getAllAllowedDomains, isTeammateEmail } from '../data/collegesData';

export default function AuthPortal({ onLogin, mode = 'student' }) {
  const [selectedCollege, setSelectedCollege] = useState(() => {
    if (mode === 'teammate' || mode === 'team') {
      return { id: 'team', name: 'Lumixora Core Team Contributor', shortName: 'Core Team', code: 'TEAM', logo: '⚡' };
    }
    return null;
  });
  const [authMode, setAuthMode] = useState(mode || 'student');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const [customColleges, setCustomColleges] = useState([]);

  useEffect(() => {
    if (mode) {
      setAuthMode(mode);
      if (mode === 'teammate' || mode === 'team') {
        setSelectedCollege({ id: 'team', name: 'Lumixora Core Team Contributor', shortName: 'Core Team', code: 'TEAM', logo: '⚡' });
      }
    }
  }, [mode]);

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
  const [rollNumber, setRollNumber] = useState('');
  const [qualification, setQualification] = useState('');
  const [collegeName, setCollegeName] = useState('GPREC');
  const [place, setPlace] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year');
  const [cgpa, setCgpa] = useState('9.0');
  const [careerGoal, setCareerGoal] = useState('Placement');
  const [department, setDepartment] = useState('CSE');
  const [learningStyle, setLearningStyle] = useState('Practical');
  const [weakSubjects, setWeakSubjects] = useState('Computer Networks');
  const [semester, setSemester] = useState('1');
  const [section, setSection] = useState('A');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [mobileNumber, setMobileNumber] = useState('');

  // Real-time listener for partner colleges added by founder
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'college_tenants'), (snap) => {
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setCustomColleges(list);
      }, (e) => console.warn('College tenant load error:', e));
      return () => unsub();
    } catch (e) {}
  }, []);

  // Pre-fill fields from invite link if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let inviteParam = params.get('invite');
    
    if (!inviteParam) {
      const pendingJoin = sessionStorage.getItem('lumixora_pending_join');
      if (pendingJoin && pendingJoin.startsWith('join-group/')) {
        inviteParam = pendingJoin.split('/')[1];
      }
    }
    
    // Fallback for hash query params
    if (!inviteParam && window.location.hash.includes('?invite=')) {
      const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
      inviteParam = hashParams.get('invite');
    }

    if (inviteParam) {
      // expected format: e.g. "CSE-A-2nd-Year"
      setIsLogin(false); // force registration mode
      const parts = inviteParam.split('-');
      if (parts.length >= 3) {
        setDepartment(parts[0]);
        setSection(parts[1]);
        if (parts.length >= 4) {
          setYearOfStudy(parts[2] + '-' + parts[3]);
        } else {
          setYearOfStudy(parts[2]);
        }
      }
    }
  }, []);

  const cleanScholarName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str;
    if (cleaned.includes('{')) {
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[\{\}":;]/g, '').trim();
    return cleaned || 'Scholar';
  };

  const handleSuccessfulLogin = (userDoc) => {
    onLogin(userDoc);
  };

  const sendFounderNotification = async (type, userInfo) => {
    try {
      const rawName = userInfo.name || userInfo.displayName || userInfo.email?.split('@')[0] || 'Unknown';
      const cleanName = cleanScholarName(rawName);
      await addDoc(collection(db, 'founder_notifications'), {
        type,
        name: cleanName,
        email: userInfo.email || '',
        role: userInfo.role || 'user',
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
        read: false
      });
    } catch (e) {
      console.warn('Failed to send founder notification:', e);
    }
  };

  const processOAuthUser = async (firebaseUser, providerName = 'Google') => {
    try {
      const oauthEmail = (firebaseUser.email || '').toLowerCase().trim();
      const isFounderOrAdmin = oauthEmail === 'founder@lumixora.com' || oauthEmail === '249xa33106@gmail.com' || oauthEmail === '249xa33106@gprec.ac.in';
      const isAllowedDomain = isValidInstitutionalEmail(oauthEmail, customColleges) || oauthEmail.endsWith('@gprec.ac.in') || isFounderOrAdmin;
      
      if (!isFounderOrAdmin && !isAllowedDomain) {
        setError(`Security Access Restricted: Please sign in using your official institutional email (e.g. @gprec.ac.in).`);
        setLoading(false);
        try { await auth.signOut(); } catch (e) {}
        return;
      }

      const role = isFounderOrAdmin ? 'founder' : (authMode === 'faculty' ? 'faculty' : (authMode === 'teammate' ? 'teammate' : 'user'));

      // Check if user already exists in Supabase
      const { data: sbUsers } = await supabase
        .from('users')
        .select('*')
        .ilike('email', oauthEmail);

      let userProfile;
      if (sbUsers && sbUsers.length > 0) {
        userProfile = { 
          ...sbUsers[0], 
          id: firebaseUser.uid, 
          uid: firebaseUser.uid, 
          emailVerified: true,
          role: sbUsers[0].role || role 
        };
      } else {
        const cleanName = firebaseUser.displayName || oauthEmail.split('@')[0];
        const defaultProfile = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: cleanName,
          email: oauthEmail,
          password: 'google_oauth_managed',
          qualification: 'B.Tech',
          college: 'GPREC',
          place: 'Kurnool',
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
          subjects: 'Computer Science',
          xp: 50,
          coins: 100,
          level: 1,
          streak: 1,
          longestStreak: 1,
          streakFreezeCount: 1,
          badges: ['first_login'],
          purchasedThemes: ['default'],
          purchasedFrames: ['none'],
          currentTheme: 'default',
          currentFrame: 'none',
          created_at: new Date().toISOString(),
          role,
          emailVerified: true,
          is_approved: true,
          isApproved: true
        };

        const sbPayload = {
          name: `${cleanName} ${JSON.stringify(defaultProfile)}`,
          email: oauthEmail,
          password: 'google_oauth_managed',
          role,
          created_at: new Date().toISOString(),
          is_approved: true
        };

        await Promise.allSettled([
          supabase.from('users').upsert([sbPayload], { onConflict: 'email' }),
          setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile, { merge: true }),
          setDoc(doc(db, 'Users', firebaseUser.uid), defaultProfile, { merge: true })
        ]);

        userProfile = defaultProfile;
        sendFounderNotification('register', userProfile).catch(() => {});
      }

      handleSuccessfulLogin(userProfile);
    } catch (err) {
      console.error(err);
      setError(`Failed to process sign-in with ${providerName}. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth Redirects automatically on mount (Immune to popup blockers)
  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        setLoading(true);
        await processOAuthUser(result.user, 'Google');
      }
    }).catch(err => {
      console.warn("Firebase redirect auth result notice:", err);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const sbEmail = (session.user.email || '').toLowerCase().trim();
        if (sbEmail) {
          const isF = sbEmail === 'founder@lumixora.com' || sbEmail === '249xa33106@gmail.com' || sbEmail === '249xa33106@gprec.ac.in';
          const rawName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || sbEmail.split('@')[0];
          const cleanName = cleanScholarName(rawName);
          
          const { data: existing } = await supabase.from('users').select('*').eq('email', sbEmail);
          let userProfile = existing && existing.length > 0 ? existing[0] : null;

          if (!userProfile) {
            const defaultProfile = {
              id: session.user.id,
              uid: session.user.id,
              name: cleanName,
              email: sbEmail,
              role: isF ? 'founder' : 'user',
              college: 'GPREC',
              department: 'CSE',
              year: '1st Year',
              sem: '1',
              sec: 'A',
              cgpa: '9.0',
              coins: 100,
              xp: 50,
              level: 1,
              streak: 1,
              is_approved: true,
              isApproved: true,
              emailVerified: true,
              created_at: new Date().toISOString()
            };
            await supabase.from('users').upsert([defaultProfile], { onConflict: 'email' });
            userProfile = defaultProfile;
          }

          handleSuccessfulLogin({ ...userProfile, id: session.user.id, uid: session.user.id, name: cleanName });
        }
      }
    }).catch(err => console.warn("Supabase session check:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    setUnverifiedUser(null);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const isFounderOrAdmin = cleanEmail === 'founder@lumixora.com' || cleanEmail === '249xa33106@gmail.com' || cleanEmail === '249xa33106@gprec.ac.in';
      const isLumixoraBrand = cleanEmail.endsWith('@lumixora.com') || cleanEmail.endsWith('@team.lumixora.com');

      if (isLogin) {
        // ⚡ FAST-PATH PARALLEL LOGIN (Case-insensitive check across Supabase & Firebase)
        const cleanPassword = password.trim();
        const sbAuthPromise = supabase
          .from('users')
          .select('*')
          .ilike('email', cleanEmail)
          .then(res => res.data || [])
          .catch(() => []);

        const fbAuthPromise = signInWithEmailAndPassword(auth, cleanEmail, cleanPassword)
          .then(res => ({ user: res.user, error: null }))
          .catch(err => ({ user: null, error: err }));

        const [sbUsers, fbRes] = await Promise.all([sbAuthPromise, fbAuthPromise]);

        let matchedUser = null;
        if (sbUsers && sbUsers.length > 0) {
          const exactMatch = sbUsers.find(u => (u.password || '').trim() === cleanPassword);
          if (exactMatch || (!fbRes.error && fbRes.user)) {
            matchedUser = exactMatch || sbUsers[0];
          }
        }

        let authenticatedUser = null;
        if (matchedUser) {
          authenticatedUser = {
            id: matchedUser.id,
            uid: matchedUser.id,
            email: cleanEmail,
            ...matchedUser
          };
        } else if (fbRes.user) {
          const fbUser = fbRes.user;
          authenticatedUser = {
            id: fbUser.uid,
            uid: fbUser.uid,
            email: fbUser.email,
            emailVerified: fbUser.emailVerified,
            role: isFounderOrAdmin ? 'founder' : (authMode === 'teammate' ? 'teammate' : 'user')
          };
        }

        if (!authenticatedUser) {
          const userExistsInDb = sbUsers && sbUsers.length > 0;
          const DEFAULT_PASSWORDS = ['lumixora@123', 'student@2026', 'gprec#123', '123456', '12345678', 'password', 'default', '12345'];
          const isDbDefaultPass = userExistsInDb && DEFAULT_PASSWORDS.includes((sbUsers[0].password || '').toLowerCase().trim());

          if (userExistsInDb) {
            if (isDbDefaultPass) {
              setError(`Notice: Your account is assigned a temporary default password. Please click 'Reset Password' below to set your personal secure password.`);
            } else {
              setError(`Incorrect password for ${cleanEmail}. Click 'Reset Password' below to securely create a new one.`);
            }
          } else {
            setError(`No account found for ${cleanEmail}. Please switch to 'Register' tab to create your account.`);
          }
          setLoading(false);
          return;
        }

        // Enforce Email Verification for registered students
        if (!isFounderOrAdmin && fbRes.user && fbRes.user.emailVerified === false) {
          setUnverifiedUser(fbRes.user);
          setError(`Email Not Verified: A verification email was sent to ${cleanEmail}. Please verify your email before signing in, or click 'Resend Verification Email' below.`);
          setLoading(false);
          try { await signOut(auth); } catch (e) {}
          return;
        }

        // Account status verification
        if (authenticatedUser.is_blocked === true || authenticatedUser.is_deleted === true) {
          setError('Account Blocked: Access has been suspended by the Founder/Admin.');
          setLoading(false);
          try { await auth.signOut(); } catch (e) {}
          return;
        }

        const isTeammateUser = authenticatedUser.role === 'teammate' || authenticatedUser.role === 'team' || isTeammateEmail(cleanEmail);
        const isAllowedDomain = isValidInstitutionalEmail(cleanEmail, customColleges) || isTeammateUser;

        if (!isFounderOrAdmin && !authenticatedUser.is_approved && !authenticatedUser.isApproved && !isAllowedDomain) {
          setError('Security Access Restricted: Please sign in using your official college or team mail.');
          setLoading(false);
          try { await auth.signOut(); } catch (e) {}
          return;
        }

        const isFacultyRole = (authenticatedUser.role === 'faculty' || authenticatedUser.role === 'mentor');
        const isApprovedStatus = authenticatedUser.isApproved === true || authenticatedUser.is_approved === true;

        if (isFacultyRole && !isApprovedStatus && !isFounderOrAdmin) {
          setError('Faculty Security Restriction: Your account is pending Founder approval.');
          setLoading(false);
          try { await auth.signOut(); } catch (e) {}
          return;
        }

        const rawLoginName = authenticatedUser.name || email.split('@')[0];
        const cleanLoginName = cleanScholarName(rawLoginName, cleanEmail);
        const resolvedRole = isFounderOrAdmin ? 'founder' : (isTeammateUser ? 'teammate' : (authenticatedUser.role || 'user'));

        const finalUserDoc = {
          ...authenticatedUser,
          name: cleanLoginName,
          role: resolvedRole
        };

        // Asynchronous non-blocking audit notification
        if (!isFounderOrAdmin) {
          sendFounderNotification('login', finalUserDoc).catch(() => {});
        }

        handleSuccessfulLogin(finalUserDoc);
      } else {
        // ⚡ FAST-PATH REGISTRATION
        if (!isFounderOrAdmin && !isValidInstitutionalEmail(cleanEmail, customColleges)) {
          setError('Security Access Restricted: Please register using your official college mail.');
          setLoading(false);
          return;
        }

        const cleanName = name.trim();
        const determinedRole = authMode === 'faculty' ? 'faculty' : (authMode === 'teammate' ? 'teammate' : 'user');

        const profileMetadata = {
          college: collegeName.trim() || 'GPREC',
          department: department.trim() || 'CSE',
          branch: department.trim() || 'CSE',
          year: yearOfStudy || '1st Year',
          sem: semester || '1',
          sec: section || 'A',
          rollNumber: rollNumber.trim().toUpperCase() || (cleanEmail.endsWith('@gprec.ac.in') ? cleanEmail.split('@')[0].toUpperCase() : ''),
          qualification: qualification.trim() || 'B.Tech',
          place: place.trim() || 'Kurnool',
          cgpa: cgpa.trim() || '9.0',
          careerGoal: careerGoal || 'Placement',
          learningStyle: learningStyle || 'Practical',
          weakSubjects: weakSubjects.trim() || 'None',
          xp: 50,
          coins: 100,
          level: 1,
          streak: 1
        };

        const packedName = `${cleanName} ${JSON.stringify(profileMetadata)}`;

        // 1. Supabase Profile Upsert (Fast DB Save)
        const sbPayload = {
          name: packedName,
          email: cleanEmail,
          password: password,
          role: determinedRole,
          created_at: new Date().toISOString(),
          is_approved: determinedRole !== 'faculty'
        };

        const sbPromise = supabase.from('users').upsert([sbPayload], { onConflict: 'email' });

        // 2. Firebase Auth Account Creation
        const fbPromise = createUserWithEmailAndPassword(auth, cleanEmail, password)
          .then(async (userCredential) => {
            const fbUser = userCredential.user;
            await updateProfile(fbUser, { displayName: cleanName }).catch(() => {});
            const fsDoc = {
              id: fbUser.uid,
              uid: fbUser.uid,
              name: cleanName,
              email: cleanEmail,
              role: determinedRole,
              ...profileMetadata,
              created_at: new Date().toISOString(),
              isApproved: determinedRole !== 'faculty',
              is_approved: determinedRole !== 'faculty'
            };
            await Promise.allSettled([
              setDoc(doc(db, 'users', fbUser.uid), fsDoc, { merge: true }),
              setDoc(doc(db, 'Users', fbUser.uid), fsDoc, { merge: true }),
              sendEmailVerification(fbUser).catch(() => {})
            ]);
            return fbUser;
          })
          .catch(fbErr => {
            console.warn("Firebase registration notice:", fbErr);
            return null;
          });

        await Promise.allSettled([sbPromise, fbPromise]);

        // Non-blocking notifications
        sendFounderNotification('register', {
          name: cleanName,
          email: cleanEmail,
          role: determinedRole
        }).catch(() => {});

        if (authMode === 'faculty') {
          emailjs.send(
            'service_ya5r1pk',
            'template_h3jbqrj',
            {
              to_name: 'Founder',
              to_email: '249XA33106@gprec.ac.in',
              faculty_name: cleanName,
              faculty_email: cleanEmail,
              faculty_department: department.trim(),
              faculty_designation: designation.trim(),
              faculty_mobile: mobileNumber.trim(),
              message: `A new faculty member ${cleanName} (${cleanEmail}) from ${department.trim()} has registered.`
            },
            '9-0dhY139CBiyCxBJ'
          ).catch(() => {});

          setSuccessMsg('Registration successful! Please wait for founder approval before logging in.');
        } else {
          setSuccessMsg(`Registration successful! A verification link has been sent to ${cleanEmail}. Please check your inbox (and Spam folder) to verify your account, then sign in.`);
        }

        try { await signOut(auth); } catch (e) {}
        setIsLogin(true);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please ensure you are connected to the internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      if (unverifiedUser) {
        await sendEmailVerification(unverifiedUser);
        setSuccessMsg(`Verification email resent to ${unverifiedUser.email}! Please check your inbox (and Spam/Promotions folder).`);
        setError('');
        return;
      }
      if (email && password) {
        setLoading(true);
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        await signOut(auth);
        setSuccessMsg(`Verification email resent to ${email}! Please check your inbox.`);
        setError('');
        setLoading(false);
        return;
      }
      setSuccessMsg('Please enter your email and password above to resend the verification link.');
    } catch (e) {
      console.error(e);
      setError('Failed to resend verification link: ' + (e.message || 'Please try again.'));
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
        provider.setCustomParameters({ prompt: 'select_account' });
      } else if (providerName === 'github') {
        provider = new GithubAuthProvider();
      }

      try {
        const result = await signInWithPopup(auth, provider);
        if (result?.user) {
          await processOAuthUser(result.user, providerName);
          return;
        }
      } catch (popupErr) {
        console.warn("Popup attempt fallback to redirect:", popupErr);
        await signInWithRedirect(auth, provider);
      }
    } catch (err) {
      console.error('OAuth sign in error:', err);
      setError(`Google Sign-In notice: ${err.message || 'Please try again.'}`);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const query = resetEmail.trim().toLowerCase();
    if (!query || !query.includes('@')) {
      setResetError('Please enter a valid email address.');
      return;
    }

    setResetLoading(true);
    setResetError('');
    setRetrievedAccounts([]);
    try {
      await sendPasswordResetEmail(auth, query);
      setResetError('Password reset email sent via Firebase! Please check your inbox (and Spam/Promotions folder) to reset your password.');
    } catch (err) {
      console.warn('Firebase password reset notice:', err);
      // Fallback for accounts registered via Supabase
      try {
        await supabase.auth.resetPasswordForEmail(query, {
          redirectTo: `${window.location.origin}/#reset-password`
        });
        setResetError('Password reset link sent! Please check your inbox to reset your password.');
      } catch (sbErr) {
        setResetError('Password reset link dispatched! If an account exists with this email, you will receive a reset link shortly.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden py-10 px-4">
      
      {/* Massive Background Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1 className="text-[20vw] font-semibold text-transparent bg-clip-text bg-gradient-to-br from-[#00f5d4]/10 to-[#7209b7]/10 tracking-tighter opacity-40 animate-pulse-slow rotate-[-5deg] select-none">
          LUMIXORA
        </h1>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5d4]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7209b7]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Step 1: Institutional / College Selection Screen */}
      {!selectedCollege ? (
        <div className="z-10 w-full max-w-4xl p-6 md:p-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-bold uppercase tracking-widest">
              <Building2 className="w-3.5 h-3.5" /> Lumixora Multi-Campus Network
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-blue to-brand-purple">Portal</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Choose your role and campus to access the official {authMode === 'faculty' ? 'Faculty Workspace, Attendance & Analytics' : 'Student AI Future Twin, Code Arena & Learning Platform'}.
            </p>

            {/* Dedicated Role Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 pt-2">
              <button
                type="button"
                onClick={() => { setAuthMode('student'); setSelectedCollege(null); setError(''); }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  authMode === 'student'
                    ? 'bg-brand-teal text-black shadow-lg shadow-brand-teal/20 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                🎓 Student Portal
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('faculty'); setSelectedCollege(null); setError(''); }}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  authMode === 'faculty'
                    ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                👨‍🏫 Faculty Portal
              </button>
            </div>
          </div>

          {/* College Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...DEFAULT_COLLEGES, ...customColleges].map((col) => (
              <div
                key={col.id}
                onClick={() => {
                  setSelectedCollege(col);
                  setCollegeName(col.shortName || col.name || col.code);
                  setError('');
                }}
                className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 hover:border-brand-teal/50 hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
              >
                {/* Background Color Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${col.bannerColor || 'from-purple-600 to-blue-600'} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-opacity`}></div>

                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                      {col.logo || '🏛️'}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-gray-300">
                      {col.code || 'CAMPUS'}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-brand-teal transition-colors mb-2">
                    {col.name}
                  </h3>
                  
                  <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {col.description || 'Premier technical institution accredited for engineering excellence.'}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 text-gray-300">
                      📍 {col.location || 'Kurnool, AP'}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">
                      Official College Mail
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                      Enter {col.shortName || col.code} {authMode === 'faculty' ? 'Faculty' : 'Student'} Portal
                      <ArrowRight className="w-4 h-4 text-brand-teal" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Step 2: College / Team Specific Auth Card */
        <div className="z-10 w-full max-w-md p-8 glass-panel rounded-3xl animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          {/* Top Bar with Back to College Selection */}
          <div className="flex items-center justify-between w-full mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedCollege(null);
                setError('');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Portal</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-brand-teal">
              <span>{selectedCollege.logo || '🏛️'}</span>
              <span>{selectedCollege.shortName || selectedCollege.code}</span>
            </div>
          </div>

          <div className="flex flex-col items-center mb-6 text-center">
            <h2 className="text-2xl font-extrabold text-white mb-1">
              {isLogin 
                ? `Sign In (${authMode === 'faculty' ? 'Faculty' : (authMode === 'teammate' ? '⚡ Teammate Portal' : 'Student')})` 
                : `Register (${authMode === 'faculty' ? 'Faculty' : (authMode === 'teammate' ? '⚡ Teammate Portal' : 'Student')})`
              }
            </h2>
            <p className="text-gray-400 text-xs">
              {selectedCollege.name}
            </p>
          </div>

          {/* Institutional / Team Domain Warning Banner */}
          <div className={`p-3.5 rounded-2xl mb-6 text-xs flex items-start gap-2.5 shadow-lg border ${
            authMode === 'teammate'
              ? 'bg-brand-pink/10 border-brand-pink/30 text-pink-300'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          }`}>
            <span className="text-base leading-none">{selectedCollege.logo || '🏛️'}</span>
            <div>
              <strong className="block font-bold mb-0.5">
                {selectedCollege.shortName || selectedCollege.code || 'Official'} Portal
              </strong>
              <span className="leading-relaxed text-gray-300">
                {authMode === 'teammate' 
                  ? 'Sign in or register with your @lumixora.com or designated team email address.'
                  : <>Please login or register using your <strong className="text-white underline decoration-blue-400">official college mail</strong>.</>
                }
              </span>
            </div>
          </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3.5 rounded-xl mb-6 text-xs text-center space-y-2">
            <p className="font-medium leading-relaxed">{error}</p>
            {(error.includes('Reset') || error.includes('password') || error.includes('Password') || error.includes('temporary')) && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email.trim() || '');
                    setShowForgotPassword(true);
                  }}
                  className="px-3.5 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-xl text-xs font-bold transition-all border border-amber-400/40 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  🔑 Reset Password / Create New Password
                </button>
              </div>
            )}
            {unverifiedUser && (
              <div className="mt-2">
                <button 
                  onClick={handleResendVerification}
                  type="button" 
                  className="underline text-red-300 hover:text-white transition-colors"
                >
                  Resend Verification Email
                </button>
              </div>
            )}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-xl mb-6 text-sm text-center">
            {successMsg}
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

              {mode === 'student' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Roll Number</label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                      placeholder="e.g. 219X1A0501"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Institution / College</label>
                    <select
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      required
                      className="w-full bg-[#111118] border border-white/10 rounded-xl px-4 py-3 text-gray-200 font-semibold focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all appearance-none cursor-pointer"
                    >
                      {[...DEFAULT_COLLEGES, ...customColleges].map(c => (
                        <option key={c.id} value={c.shortName || c.name || c.code}>
                          {c.shortName || c.name} ({c.code})
                        </option>
                      ))}
                    </select>
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
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                      placeholder="e.g. Assistant Professor, HOD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                      placeholder="e.g. CSE, ECE"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                </>
              )}
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
              placeholder="Enter your official college email"
            />
            <p className="text-[11px] text-gray-400 font-semibold mt-1.5 flex items-center gap-1">
              <span>🔒 Login or register using your official college mail</span>
            </p>
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
            className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-[#00f5d4] to-[#7209b7] hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
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
            className="text-[#00f5d4] font-medium hover:underline focus:outline-none cursor-pointer"
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
      )}

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
                Reset Password
              </h3>
              <p className="text-gray-400 text-sm text-center">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {/* Error / Success Message */}
            {resetError && (
              <div className={`border p-3 rounded-xl mb-5 text-sm text-center ${
                resetError.includes('sent') 
                  ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                  : 'bg-red-500/10 border-red-500/50 text-red-400'
              }`}>
                {resetError}
              </div>
            )}

            {/* Search Form */}
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-[#00f5d4] to-[#7209b7] hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {resetLoading ? (
                  <span className="animate-pulse">Sending Reset Link...</span>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>

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
