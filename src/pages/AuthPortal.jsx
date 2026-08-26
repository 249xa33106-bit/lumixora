import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, EyeOff, Sparkles, LogIn, UserPlus, ArrowLeft, ArrowRight, Mail, X, 
  Building2, GraduationCap, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, 
  ExternalLink, Key, Lock, Check, Cpu, Award
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, 
  sendPasswordResetEmail, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, 
  signInWithRedirect, getRedirectResult, sendEmailVerification, signOut 
} from 'firebase/auth';
import { doc, setDoc, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
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
  const [customColleges, setCustomColleges] = useState([]);
  const [rememberMe, setRememberMe] = useState(true);

  // Email verification waiting room state
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [checkingVerification, setCheckingVerification] = useState(false);

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('lumixora_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [qualification, setQualification] = useState('B.Tech');
  const [collegeName, setCollegeName] = useState('GPREC');
  const [place, setPlace] = useState('Kurnool');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year');
  const [cgpa, setCgpa] = useState('9.0');
  const [careerGoal, setCareerGoal] = useState('Placement');
  const [department, setDepartment] = useState('CSE');
  const [learningStyle, setLearningStyle] = useState('Practical');
  const [weakSubjects, setWeakSubjects] = useState('None');
  const [semester, setSemester] = useState('1');
  const [section, setSection] = useState('A');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    if (mode) {
      setAuthMode(mode);
      if (mode === 'teammate' || mode === 'team') {
        setSelectedCollege({ id: 'team', name: 'Lumixora Core Team Contributor', shortName: 'Core Team', code: 'TEAM', logo: '⚡' });
      }
    }
  }, [mode]);

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

  // AI & Domain Auto-Detection Intelligence
  const detectedProfile = useMemo(() => {
    if (!email || !email.includes('@')) return null;
    const lower = email.toLowerCase().trim();
    const prefix = lower.split('@')[0];
    const domain = lower.split('@')[1];

    let detectedCollege = 'GPREC Kurnool';
    let detectedDept = 'CSE';
    let detectedYear = '1st Year';
    let detectedRoll = prefix.toUpperCase();
    let isInstitutional = false;

    if (domain === 'gprec.ac.in') {
      isInstitutional = true;
      detectedCollege = 'G. Pulla Reddy Engineering College';

      // Batch detection from first 2 chars of roll number e.g. 249XA33106
      const yearDigits = prefix.slice(0, 2);
      if (yearDigits === '24') { detectedYear = '1st Year'; }
      else if (yearDigits === '23') { detectedYear = '2nd Year'; }
      else if (yearDigits === '22') { detectedYear = '3rd Year'; }
      else if (yearDigits === '21') { detectedYear = '4th Year'; }

      // Branch code detection from roll number pattern
      if (prefix.includes('a33') || prefix.includes('31') || prefix.includes('csm') || prefix.includes('aiml')) {
        detectedDept = 'CSE (AI & ML)';
      } else if (prefix.includes('csd') || prefix.includes('32') || prefix.includes('ds')) {
        detectedDept = 'CSE (Data Science)';
      } else if (prefix.includes('05') || prefix.includes('a05') || prefix.includes('cse')) {
        detectedDept = 'CSE';
      } else if (prefix.includes('04') || prefix.includes('a04') || prefix.includes('ece')) {
        detectedDept = 'ECE';
      } else if (prefix.includes('02') || prefix.includes('a02') || prefix.includes('eee')) {
        detectedDept = 'EEE';
      } else if (prefix.includes('03') || prefix.includes('a03') || prefix.includes('mec')) {
        detectedDept = 'Mechanical';
      } else if (prefix.includes('01') || prefix.includes('a01') || prefix.includes('civ')) {
        detectedDept = 'Civil';
      }
    } else if (domain?.includes('ashoka')) {
      isInstitutional = true;
      detectedCollege = "Ashoka Women's Engineering College";
    } else if (domain === 'lumixora.com' || domain === 'team.lumixora.com') {
      isInstitutional = true;
      detectedCollege = 'Lumixora Core Team';
    }

    return {
      isInstitutional,
      college: detectedCollege,
      department: detectedDept,
      year: detectedYear,
      roll: detectedRoll
    };
  }, [email]);

  // Auto-apply detected profile to registration state
  useEffect(() => {
    if (!isLogin && detectedProfile && detectedProfile.isInstitutional) {
      if (detectedProfile.roll && !rollNumber) setRollNumber(detectedProfile.roll);
      if (detectedProfile.department) setDepartment(detectedProfile.department);
      if (detectedProfile.year) setYearOfStudy(detectedProfile.year);
    }
  }, [detectedProfile, isLogin]);

  // Password Security Strength Meter
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-gray-600', percent: 0 };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-400', percent: 25 };
      case 2:
        return { score, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400', percent: 50 };
      case 3:
        return { score, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400', percent: 75 };
      case 4:
        return { score, label: 'Cyber-Grade 🛡️', color: 'bg-[#00f5d4]', text: 'text-[#00f5d4]', percent: 100 };
      default:
        return { score: 0, label: 'Very Weak', color: 'bg-red-700', text: 'text-red-500', percent: 10 };
    }
  }, [password]);

  const cleanScholarName = (str) => {
    if (!str || typeof str !== 'string') return 'Scholar';
    let cleaned = str.includes('{') ? str.split('{')[0].trim() : str;
    cleaned = cleaned.replace(/[\{\}":;]/g, '').trim();
    return cleaned || 'Scholar';
  };

  const handleSuccessfulLogin = (userDoc) => {
    if (rememberMe && userDoc?.email) {
      localStorage.setItem('lumixora_remembered_email', userDoc.email);
    }
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
          college: detectedProfile?.college || 'GPREC',
          place: 'Kurnool',
          year: detectedProfile?.year || '1st Year',
          cgpa: '9.0',
          targetCGPA: '9.0',
          careerGoal: 'Placement',
          department: detectedProfile?.department || 'CSE',
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
          badges: ['first_login', 'institutional_verified'],
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

  // Google OAuth Redirect Handler on mount
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

  // Live background verification polling when in verification modal
  useEffect(() => {
    if (!unverifiedEmail) return;

    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          setUnverifiedEmail('');
          setSuccessMsg('Email verified successfully! Logging you in now...');
          await processOAuthUser(auth.currentUser, 'Email Verification');
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [unverifiedEmail]);

  const handleManualCheckVerification = async () => {
    try {
      setCheckingVerification(true);
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          setUnverifiedEmail('');
          setSuccessMsg('Email verified successfully! Opening your dashboard...');
          await processOAuthUser(auth.currentUser, 'Email Verification');
          return;
        }
      }
      setError('Verification pending: We checked your account, but the email link has not been confirmed yet. Please click the link in your inbox.');
    } catch (e) {
      console.warn(e);
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const cleanEmail = email.toLowerCase().trim();
      const isFounderOrAdmin = cleanEmail === 'founder@lumixora.com' || cleanEmail === '249xa33106@gmail.com' || cleanEmail === '249xa33106@gprec.ac.in';
      const cleanPassword = password.trim();

      if (isLogin) {
        // ⚡ FAST-PATH PARALLEL LOGIN (Case-insensitive check across Supabase & Firebase)
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
            setError(`No account found for ${cleanEmail}. Please switch to 'Register' tab to create your official account.`);
          }
          setLoading(false);
          return;
        }

        // Enforce Email Verification for registered students
        if (!isFounderOrAdmin && fbRes.user && fbRes.user.emailVerified === false) {
          setUnverifiedEmail(cleanEmail);
          setLoading(false);
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
          setError('Security Access Restricted: Please sign in using your official college (@gprec.ac.in) or team mail.');
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
        const cleanLoginName = cleanScholarName(rawLoginName);
        const resolvedRole = isFounderOrAdmin ? 'founder' : (isTeammateUser ? 'teammate' : (authenticatedUser.role || 'user'));

        const finalUserDoc = {
          ...authenticatedUser,
          name: cleanLoginName,
          role: resolvedRole
        };

        // Audit notification
        if (!isFounderOrAdmin) {
          sendFounderNotification('login', finalUserDoc).catch(() => {});
        }

        handleSuccessfulLogin(finalUserDoc);
      } else {
        // ⚡ FAST-PATH REGISTRATION
        if (!isFounderOrAdmin && !isValidInstitutionalEmail(cleanEmail, customColleges)) {
          setError('Security Access Restricted: Please register using your official college mail (@gprec.ac.in).');
          setLoading(false);
          return;
        }

        const cleanName = name.trim();
        const determinedRole = authMode === 'faculty' ? 'faculty' : (authMode === 'teammate' ? 'teammate' : 'user');

        const profileMetadata = {
          college: collegeName.trim() || detectedProfile?.college || 'GPREC',
          department: department.trim() || detectedProfile?.department || 'CSE',
          branch: department.trim() || detectedProfile?.department || 'CSE',
          year: yearOfStudy || detectedProfile?.year || '1st Year',
          sem: semester || '1',
          sec: section || 'A',
          rollNumber: rollNumber.trim().toUpperCase() || detectedProfile?.roll || '',
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

          setSuccessMsg('Registration submitted! Faculty accounts require Founder verification before activation.');
          setIsLogin(true);
        } else {
          setUnverifiedEmail(cleanEmail);
          setSuccessMsg(`Account created! A secure verification link was sent to ${cleanEmail}.`);
        }

        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.message ? err.message.replace('Firebase: ', '') : 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setSuccessMsg(`Verification email resent to ${auth.currentUser.email}! Please check your inbox & spam folder.`);
      } else if (email && password) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);
        setSuccessMsg(`Verification link dispatched to ${email}!`);
      }
    } catch (e) {
      setError('Could not resend email: ' + (e.message || 'Please try again in a few moments.'));
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
        console.warn("Popup fallback to redirect:", popupErr);
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
    try {
      await sendPasswordResetEmail(auth, query);
      setResetError('Password reset link sent! Please check your inbox (and Spam/Promotions folder).');
    } catch (err) {
      try {
        await supabase.auth.resetPasswordForEmail(query, {
          redirectTo: `${window.location.origin}/#reset-password`
        });
        setResetError('Password reset email dispatched to your inbox!');
      } catch (sbErr) {
        setResetError('If an account is associated with this email, a reset link will arrive shortly.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] flex items-center justify-center relative overflow-hidden py-10 px-4">
      
      {/* Dynamic Cyber Orbs & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00f5d4]/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7209b7]/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none animate-pulse-slow" />

      {/* Step 1: Institutional Portal Selection Screen */}
      {!selectedCollege ? (
        <div className="z-10 w-full max-w-4xl p-6 md:p-8 animate-fade-in-up">
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-teal/5">
              <Building2 className="w-3.5 h-3.5" /> Lumixora Multi-Campus Network
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] via-[#3a86ff] to-[#7209b7]">Portal</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Choose your role and campus to enter the high-performance {authMode === 'faculty' ? 'Faculty Workspace & Analytics' : 'Student AI Future Twin & Learning Engine'}.
            </p>

            {/* Dedicated Role Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 pt-2">
              <button
                type="button"
                onClick={() => { setAuthMode('student'); setSelectedCollege(null); setError(''); }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  authMode === 'student'
                    ? 'bg-[#00f5d4] text-black shadow-lg shadow-[#00f5d4]/20 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Student Portal
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('faculty'); setSelectedCollege(null); setError(''); }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  authMode === 'faculty'
                    ? 'bg-[#7209b7] text-white shadow-lg shadow-[#7209b7]/30 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <Award className="w-4 h-4" /> Faculty Portal
              </button>
            </div>
          </div>

          {/* Campus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...DEFAULT_COLLEGES, ...customColleges].map((col) => (
              <div
                key={col.id}
                onClick={() => {
                  setSelectedCollege(col);
                  setCollegeName(col.shortName || col.name || col.code);
                  setError('');
                }}
                className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 hover:border-[#00f5d4]/50 hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-2xl"
              >
                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${col.bannerColor || 'from-purple-600 to-blue-600'} opacity-15 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />

                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                      {col.logo || '🏛️'}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-black text-gray-300">
                      {col.code || 'CAMPUS'}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-[#00f5d4] transition-colors mb-2">
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
                    <span className="text-[#00f5d4] font-bold">
                      Official Institutional Portal
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                      Enter {col.shortName || col.code} {authMode === 'faculty' ? 'Faculty' : 'Student'} Workspace
                      <ArrowRight className="w-4 h-4 text-[#00f5d4]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Step 2: Advanced Auth Card */
        <div className="z-10 w-full max-w-md p-6 sm:p-8 glass-panel rounded-3xl animate-fade-in-up max-h-[92vh] overflow-y-auto custom-scrollbar border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
          
          {/* Top Bar with Back Switcher */}
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

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black text-[#00f5d4]">
              <span>{selectedCollege.logo || '🏛️'}</span>
              <span>{selectedCollege.shortName || selectedCollege.code}</span>
            </div>
          </div>

          <div className="flex flex-col items-center mb-6 text-center">
            <h2 className="text-2xl font-black text-white tracking-tight mb-1">
              {isLogin 
                ? `Sign In (${authMode === 'faculty' ? 'Faculty' : 'Student'})` 
                : `Create Account (${authMode === 'faculty' ? 'Faculty' : 'Student'})`
              }
            </h2>
            <p className="text-gray-400 text-xs">
              {selectedCollege.name}
            </p>
          </div>

          {/* Institutional Shield Badge */}
          <div className="p-3.5 rounded-2xl mb-6 text-xs flex items-start gap-2.5 shadow-lg border bg-[#00f5d4]/10 border-[#00f5d4]/30 text-teal-300">
            <ShieldCheck className="w-5 h-5 text-[#00f5d4] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5 text-white">
                {selectedCollege.shortName || 'Official'} Verified Campus Access
              </strong>
              <span className="leading-relaxed text-gray-300">
                Please sign in with your official <strong className="text-[#00f5d4] underline">@gprec.ac.in</strong> email address.
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-6 text-xs text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
              {(error.includes('Reset') || error.includes('password') || error.includes('Password') || error.includes('temporary')) && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email.trim() || '');
                      setShowForgotPassword(true);
                    }}
                    className="px-3.5 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-xl text-xs font-black transition-all border border-amber-400/40 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    🔑 1-Click Reset / Create New Password
                  </button>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-2xl mb-6 text-xs text-center font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all"
                    placeholder="e.g. Mohammed Sowban"
                  />
                </div>

                {authMode === 'student' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1.5">Roll Number</label>
                        <input
                          type="text"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white uppercase focus:outline-none focus:border-[#00f5d4]/50"
                          placeholder="249XA33106"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1.5">Branch / Dept</label>
                        <input
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                          placeholder="CSE"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1.5">Year of Study</label>
                        <select
                          value={yearOfStudy}
                          onChange={(e) => setYearOfStudy(e.target.value)}
                          required
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1.5">Semester</label>
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          required
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                            <option key={s} value={String(s)}>Sem {s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Faculty Designation</label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50"
                        placeholder="Assistant Professor"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Mobile Number</label>
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Official Campus Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all font-mono"
                placeholder="rollnumber@gprec.ac.in"
              />

              {/* Dynamic Auto-Detected ID Badge */}
              {detectedProfile && detectedProfile.isInstitutional && (
                <div className="mt-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-[11px] text-emerald-300 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{detectedProfile.college}</span>
                  </div>
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded-md font-mono text-[10px] text-emerald-200">
                    {detectedProfile.department} • {detectedProfile.year}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Live Password Strength Meter */}
              {!isLogin && password && (
                <div className="mt-2.5 space-y-1.5 animate-fade-in">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400">Security Strength:</span>
                    <span className={passwordStrength.text}>{passwordStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                      style={{ width: `${passwordStrength.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-white/5 border-white/10 text-[#00f5d4] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetEmail(email);
                    setResetError('');
                  }}
                  className="text-xs text-[#00f5d4] hover:underline transition-colors bg-transparent border-none cursor-pointer font-bold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-black bg-gradient-to-r from-[#00f5d4] via-[#38bdf8] to-[#00f5d4] hover:opacity-95 shadow-lg shadow-[#00f5d4]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer text-sm"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2 font-bold animate-pulse text-black">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                </span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Workspace' : 'Create Verified Account'}</span>
                  {isLogin ? <LogIn className="w-4 h-4 text-black" /> : <UserPlus className="w-4 h-4 text-black" />}
                </>
              )}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest font-black">Or 1-Tap Login</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleOAuthSignIn('google')}
              className="flex-1 py-3 px-4 rounded-2xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f5d4]/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer text-xs shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              className="flex-1 py-3 px-4 rounded-2xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-purple/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer text-xs shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="mt-6 text-center text-gray-400 text-xs">
            {isLogin ? "New to Lumixora? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMsg('');
              }}
              className="text-[#00f5d4] font-black hover:underline focus:outline-none cursor-pointer ml-1"
            >
              {isLogin ? 'Register your roll number' : 'Sign in here'}
            </button>
          </div>

          {/* Mobile APK Download Pill */}
          <div className="mt-6 pt-5 border-t border-white/5 flex flex-col items-center">
            <a 
              href="https://ykuyzkhhnltjccyzduap.supabase.co/storage/v1/object/public/academic_resources/app/Lumixora.apk" 
              download="Lumixora.apk"
              className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold text-[#00f5d4] border border-[#00f5d4]/30 hover:border-[#00f5d4] hover:bg-[#00f5d4]/5 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-[#00f5d4]" />
              <span>Download Official Android App (APK)</span>
            </a>
          </div>

        </div>
      )}

      {/* Email Verification Waiting Room Modal */}
      {unverifiedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-[#00f5d4]/30 bg-[#0c0c14] shadow-2xl text-center space-y-5 animate-fade-in-up">
            
            <div className="w-16 h-16 rounded-3xl bg-[#00f5d4]/10 border border-[#00f5d4]/30 flex items-center justify-center mx-auto text-[#00f5d4] shadow-lg shadow-[#00f5d4]/10">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Verify Your Campus Email</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                A secure confirmation link was sent to <strong className="text-[#00f5d4]">{unverifiedEmail}</strong>. Please click the link to activate your workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Open Gmail</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://mail.google.com/a/gprec.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-[#00f5d4] rounded-xl text-xs font-bold border border-[#00f5d4]/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>GPREC Webmail</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleManualCheckVerification}
                disabled={checkingVerification}
                className="w-full py-3 bg-[#00f5d4] hover:opacity-95 text-black font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00f5d4]/20 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${checkingVerification ? 'animate-spin' : ''}`} />
                <span>{checkingVerification ? 'Checking Server...' : 'I Have Clicked The Link (Verify Now)'}</span>
              </button>

              <button
                type="button"
                onClick={handleResendVerification}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-white font-bold transition-colors cursor-pointer"
              >
                Didn't receive email? Click here to resend link
              </button>
            </div>

            <button
              type="button"
              onClick={() => setUnverifiedEmail('')}
              className="text-xs text-gray-500 hover:text-gray-400 pt-2 block mx-auto cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      )}

      {/* 1-Click Forgot Password Modal */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForgotPassword(false); }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

          <div
            className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl bg-[#0d0d16]"
          >
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f5d4] to-[#7209b7] flex items-center justify-center mb-3 shadow-lg shadow-[#00f5d4]/20">
                <Key className="text-white w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white mb-1">
                Password Recovery
              </h3>
              <p className="text-gray-400 text-xs">
                Enter your registered campus email to receive a password reset link.
              </p>
            </div>

            {resetError && (
              <div className={`border p-3.5 rounded-xl mb-5 text-xs text-center font-medium ${
                resetError.includes('sent') || resetError.includes('dispatched')
                  ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                  : 'bg-red-500/10 border-red-500/50 text-red-400'
              }`}>
                {resetError}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">Your Registered Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all font-mono"
                  placeholder="rollnumber@gprec.ac.in"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-black bg-[#00f5d4] hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-xs shadow-lg shadow-[#00f5d4]/20 cursor-pointer"
              >
                {resetLoading ? (
                  <span className="animate-pulse flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Dispatching...
                  </span>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-black" />
                    <span>Send Password Reset Link</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
                className="text-xs text-gray-400 hover:text-[#00f5d4] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1 mx-auto font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
