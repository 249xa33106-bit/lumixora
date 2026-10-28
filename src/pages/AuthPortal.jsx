import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, EyeOff, LogIn, UserPlus, ArrowLeft, ArrowRight, Mail, X, 
  Building2, GraduationCap, ShieldCheck, AlertCircle, RefreshCw, 
  ExternalLink, Key, Check, Cpu, Award, Briefcase, CreditCard, Sparkles, Gift
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, 
  sendPasswordResetEmail, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, 
  signInWithRedirect, getRedirectResult, sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { 
  DEFAULT_COLLEGES, isValidInstitutionalEmail, isTeammateEmail, decodeGprecRollNumber,
  isGprecScholar, hasPaidCollegeFee, recordLocalFeePayment, getStoredCustomColleges, fetchCollegesFromSupabase,
  isAnjum, isExemptFromPayment
} from '../data/collegesData';
import { notifyFounderLogin, notifyFounderRegister, recordFounderNotification, notifyFounderPayment, notifyFounderAmbassadorReferral } from '../services/founderNotificationService';
import { checkUserAccessStatus } from '../utils/authSecurity';
import { validateInternLogin } from '../services/internDbService';
import { internshipDb } from '../services/internshipDb';
import CollegeAccessFeeModal from '../components/CollegeAccessFeeModal';

export default function AuthPortal({ onLogin, mode = 'student' }) {
  const [feeModalUser, setFeeModalUser] = useState(null);
  const [feeModalMode, setFeeModalMode] = useState('login'); // 'login' | 'registration'
  const [selectedCollege, setSelectedCollege] = useState(() => {
    if (mode === 'teammate' || mode === 'team') {
      return { id: 'team', name: 'Vyomra Core Team Contributor', shortName: 'Core Team', code: 'TEAM', logo: '⚡' };
    }
    if (mode === 'intern') {
      return { id: 'intern', name: 'Lumixora Autonomous Engineering Internship Program', shortName: 'Lumixora Interns', code: 'INTERN', logo: '🚀' };
    }
    return null;
  });
  const [authMode, setAuthMode] = useState(mode || 'student');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [customColleges, setCustomColleges] = useState(() => getStoredCustomColleges());
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [verificationSending, setVerificationSending] = useState(false);

  // Registration Fields
  const [email, setEmail] = useState(() => localStorage.getItem('lumixora_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [qualification, setQualification] = useState('B.Tech');
  const [collegeName, setCollegeName] = useState('GPREC');
  const [place, setPlace] = useState('Kurnool');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year');
  const [cgpa, setCgpa] = useState('9.0');
  const [careerGoal, setCareerGoal] = useState('Placement');
  const [department, setDepartment] = useState('CSM');
  const [learningStyle, setLearningStyle] = useState('Practical');
  const [weakSubjects, setWeakSubjects] = useState('None');
  const [semester, setSemester] = useState('1');
  const [section, setSection] = useState('A');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [mobileNumber, setMobileNumber] = useState('');
  const [referralCode, setReferralCode] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const qRef = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('ca');
        if (qRef) return qRef.trim().toUpperCase();

        if (window.location.hash && window.location.hash.includes('ref=')) {
          const hashPart = window.location.hash.split('ref=')[1];
          if (hashPart) return hashPart.split('&')[0].trim().toUpperCase();
        }

        const cached = localStorage.getItem('lumixora_referral_code');
        if (cached) return cached.trim().toUpperCase();
      } catch (e) {}
    }
    return '';
  });

  // Auto-switch to Register mode if referral link was used
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const qRef = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('ca');
        const hash = window.location.hash || '';
        if (qRef || hash.includes('register') || hash.includes('ref=')) {
          setIsLogin(false);
          const code = qRef || (hash.includes('ref=') ? hash.split('ref=')[1].split('&')[0] : '');
          if (code) {
            setReferralCode(code.trim().toUpperCase());
            localStorage.setItem('lumixora_referral_code', code.trim().toUpperCase());
          }
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (mode) {
      setAuthMode(mode);
      if (mode === 'teammate' || mode === 'team') {
        setSelectedCollege({ id: 'team', name: 'Vyomra Core Team Contributor', shortName: 'Core Team', code: 'TEAM', logo: '⚡' });
      } else if (mode === 'intern') {
        setSelectedCollege({ id: 'intern', name: 'Lumixora Autonomous Engineering Internship Program', shortName: 'Lumixora Interns', code: 'INTERN', logo: '🚀' });
        setCollegeName('Lumixora Autonomous Systems');
      }
    }
  }, [mode]);

  // Real-time listener for partner colleges added by founder (Storage + Supabase Cloud + Custom Events)
  useEffect(() => {
    const syncColleges = () => {
      const stored = getStoredCustomColleges();
      if (stored && stored.length > 0) {
        setCustomColleges(stored);
      }
    };

    syncColleges();
    window.addEventListener('lumixora_colleges_updated', syncColleges);
    window.addEventListener('storage', syncColleges);

    // Fetch fresh partner colleges from Supabase cloud so any new college is visible immediately
    const syncCloud = async () => {
      try {
        const cloudList = await fetchCollegesFromSupabase();
        if (cloudList && cloudList.length > 0) {
          setCustomColleges(cloudList);
        }
      } catch (e) {}
    };
    syncCloud();

    let channel = null;
    if (supabase && typeof supabase.channel === 'function') {
      try {
        channel = supabase.channel('auth_portal_colleges_sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'college_tenants' }, () => syncCloud())
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'founder_notifications' }, (payload) => {
            if (payload?.new?.type === 'college_tenant') syncCloud();
          })
          .subscribe();
      } catch (e) {}
    }

    const pollTimer = setInterval(syncCloud, 20000);

    return () => {
      window.removeEventListener('lumixora_colleges_updated', syncColleges);
      window.removeEventListener('storage', syncColleges);
      clearInterval(pollTimer);
      if (channel) {
        try { supabase.removeChannel(channel); } catch (e) {}
      }
    };
  }, []);

  // Compute unified, deduplicated list of all available colleges
  const allAvailableColleges = useMemo(() => {
    const map = new Map();
    DEFAULT_COLLEGES.forEach(c => map.set(c.id, c));
    customColleges.forEach(c => {
      if (c && c.id && c.id !== 'init' && !c.is_deleted && !c.isDeleted) {
        map.set(c.id, { ...(map.get(c.id) || {}), ...c });
      }
    });
    return Array.from(map.values());
  }, [customColleges]);

  // AI & Domain Auto-Detection Intelligence with exact GPREC rules
  const detectedProfile = useMemo(() => {
    if (!email || !email.includes('@')) return null;
    const lower = email.toLowerCase().trim();
    const prefix = lower.split('@')[0];
    const domain = lower.split('@')[1];

    let detectedCollege = 'GPREC Kurnool';
    let isInstitutional = false;

    if (domain === 'gprec.ac.in') {
      isInstitutional = true;
      detectedCollege = 'G. Pulla Reddy Engineering College';
      const decoded = decodeGprecRollNumber(prefix);

      return {
        isInstitutional,
        college: detectedCollege,
        department: decoded.department || 'CSM',
        year: decoded.year,
        roll: decoded.rollNumber,
        isPromptRequired: decoded.isPromptRequired
      };
    } else if (domain?.includes('ashoka')) {
      isInstitutional = true;
      detectedCollege = "Ashoka Women's Engineering College";
    } else if (domain?.includes('annamacharya') || domain?.includes('aits')) {
      isInstitutional = true;
      detectedCollege = 'Annamacharya University';
    } else if (domain?.includes('bits') || (selectedCollege && (selectedCollege.id === 'bits' || selectedCollege.code === 'BITS'))) {
      isInstitutional = true;
      detectedCollege = 'Bheema Institute Of Technology & Science';
    } else if (selectedCollege && selectedCollege.id !== 'gprec') {
      isInstitutional = true;
      detectedCollege = selectedCollege.name || selectedCollege.shortName;
    } else if (domain === 'lumixora.com' || domain === 'team.lumixora.com') {
      isInstitutional = true;
      detectedCollege = 'Vyomra Core Team';
    }

    const fallbackDecoded = decodeGprecRollNumber(prefix);
    return {
      isInstitutional,
      college: detectedCollege,
      department: fallbackDecoded.department || 'CSM',
      year: fallbackDecoded.year,
      roll: fallbackDecoded.rollNumber
    };
  }, [email, selectedCollege]);

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
    cleaned = cleaned.replace(/[{}:;"]/g, '').trim();
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
      if (type === 'register') {
        notifyFounderRegister(userInfo);
      } else if (type === 'login') {
        notifyFounderLogin(userInfo);
      } else {
        recordFounderNotification({ type, ...userInfo });
      }
    } catch (e) {
      console.warn('Failed to send founder notification:', e);
    }
  };

  const processOAuthUser = async (firebaseUser, providerName = 'Google') => {
    try {
      const oauthEmail = (firebaseUser.email || '').toLowerCase().trim();
      const isFounderOrAdmin = oauthEmail === 'founder@lumixora.com' || oauthEmail === '249xa33106@gmail.com' || oauthEmail === '249xa33106@gprec.ac.in';
      const isAnjumUser = isAnjum(oauthEmail) || isAnjum(firebaseUser.displayName);
      const isAllowedDomain = isValidInstitutionalEmail(oauthEmail, customColleges) || isTeammateEmail(oauthEmail) || oauthEmail.endsWith('@gprec.ac.in') || isFounderOrAdmin || isAnjumUser;
      
      if (!isFounderOrAdmin && !isAnjumUser && !isAllowedDomain) {
        setError(`Security Access Restricted: Sign-in is strictly limited to official college email accounts (e.g. @gprec.ac.in). Please switch to your college email.`);
        setLoading(false);
        try { await auth.signOut(); } catch (e) {}
        return;
      }

      const role = isFounderOrAdmin ? 'founder' : (authMode === 'faculty' ? 'faculty' : (authMode === 'teammate' ? 'teammate' : (authMode === 'intern' ? 'intern' : 'user')));

      // Check if user already exists in Supabase
      const { data: sbUsers } = await supabase
        .from('users')
        .select('*')
        .ilike('email', oauthEmail);

      let userProfile;
      if (sbUsers && sbUsers.length > 0) {
        let unpackedData = {};
        const rawName = sbUsers[0].name || '';
        if (rawName.includes('{')) {
          try {
            unpackedData = JSON.parse(rawName.substring(rawName.indexOf('{')));
          } catch (e) {}
        }
        const cleanName = rawName.includes('{') ? rawName.split('{')[0].trim() : rawName;
        userProfile = { 
          ...unpackedData,
          ...sbUsers[0], 
          id: firebaseUser.uid, 
          uid: firebaseUser.uid, 
          name: cleanName || firebaseUser.displayName || oauthEmail.split('@')[0],
          emailVerified: true,
          role: isFounderOrAdmin ? 'founder' : (sbUsers[0].role || role) 
        };
        sendFounderNotification('login', userProfile).catch(() => {});
      } else {
        const cleanName = firebaseUser.displayName || oauthEmail.split('@')[0];
        const finalReferralCode = (referralCode || (typeof window !== 'undefined' ? localStorage.getItem('lumixora_referral_code') : '') || '').trim().toUpperCase();
        const defaultProfile = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: cleanName,
          email: oauthEmail,
          password: 'google_oauth_managed',
          qualification: 'B.Tech',
          college: detectedProfile?.college || (selectedCollege?.name || 'GPREC'),
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
          isApproved: true,
          referredBy: finalReferralCode,
          referralCode: finalReferralCode
        };

        userProfile = defaultProfile;

        // ZERO-TRUST GATE: Never write unpaid accounts to database until ₹10 payment is verified!
        if (!isExemptFromPayment(userProfile) && !hasPaidCollegeFee(userProfile)) {
          setFeeModalUser(userProfile);
          setFeeModalMode('registration');
          setLoading(false);
          return;
        }

        const sbPayload = {
          name: `${cleanName} ${JSON.stringify(defaultProfile)}`,
          email: oauthEmail,
          password: 'google_oauth_managed',
          role,
          college: defaultProfile.college,
          department: defaultProfile.department,
          branch: defaultProfile.department,
          year: defaultProfile.year,
          created_at: new Date().toISOString(),
          is_approved: true
        };

        await Promise.allSettled([
          supabase.from('users').upsert([sbPayload], { onConflict: 'email' }),
          setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile, { merge: true }),
          setDoc(doc(db, 'Users', firebaseUser.uid), defaultProfile, { merge: true })
        ]);

        if (finalReferralCode) {
          const refDoc = {
            referralCode: finalReferralCode,
            userEmail: oauthEmail,
            userName: cleanName,
            college: defaultProfile.college,
            department: defaultProfile.department,
            year: defaultProfile.year,
            registeredAt: new Date().toISOString(),
            timestamp: serverTimestamp()
          };
          if (db) addDoc(collection(db, 'ambassador_referrals'), refDoc).catch(() => {});
          if (internshipDb) addDoc(collection(internshipDb, 'ambassador_referrals'), refDoc).catch(() => {});
          notifyFounderAmbassadorReferral({
            code: finalReferralCode,
            scholarName: cleanName,
            scholarEmail: oauthEmail,
            college: defaultProfile.college,
            department: defaultProfile.department
          });
        }

        sendFounderNotification('register', userProfile).catch(() => {});
      }

      const accessStatus = checkUserAccessStatus(userProfile);
      if (!accessStatus.allowed) {
        setError(accessStatus.message);
        setLoading(false);
        try { await auth.signOut(); } catch (e) {}
        try { await supabase.auth.signOut(); } catch (e) {}
        return;
      }

      // Enforce ?10 one-time fee for everyone except Anjum & Founder
      if (!isExemptFromPayment(userProfile) && !hasPaidCollegeFee(userProfile)) {
        setFeeModalUser(userProfile);
        setFeeModalMode('login');
        setLoading(false);
        return;
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
          const isF = sbEmail === 'founder@lumixora.com' || sbEmail === '249xa33106@gmail.com';
          const isAnjumUser = isAnjum(sbEmail);
          const isAllowedDomain = isValidInstitutionalEmail(sbEmail, customColleges) || isF || isAnjumUser;
          if (!isF && !isAnjumUser && !isAllowedDomain) {
            await supabase.auth.signOut().catch(() => {});
            return;
          }
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
              college: detectedProfile?.college || (selectedCollege?.name || 'GPREC'),
              department: detectedProfile?.department || 'CSE',
              branch: detectedProfile?.department || 'CSE',
              year: detectedProfile?.year || '1st Year',
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
            // ZERO-TRUST GATE: Do NOT write unpaid accounts to Supabase!
            if (!isExemptFromPayment(defaultProfile) && !hasPaidCollegeFee(defaultProfile)) {
              setFeeModalUser(defaultProfile);
              setFeeModalMode('registration');
              return;
            }

            await supabase.from('users').upsert([defaultProfile], { onConflict: 'email' });
            userProfile = defaultProfile;
          }

          const accessStatus = checkUserAccessStatus(userProfile);
          if (!accessStatus.allowed) {
            await supabase.auth.signOut().catch(() => {});
            return;
          }

          const userWithId = { ...userProfile, id: session.user.id, uid: session.user.id, name: cleanName };
          if (!isExemptFromPayment(userWithId) && !hasPaidCollegeFee(userWithId)) {
            setFeeModalUser(userWithId);
            setFeeModalMode('login');
            return;
          }

          handleSuccessfulLogin(userWithId);
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

  const executeRegisterUser = async (regData, paymentInfo = {}) => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const cleanEmail = regData.email.toLowerCase().trim();
      const cleanName = regData.name.trim();
      const determinedRole = regData.role || (regData.authMode === 'faculty' ? 'faculty' : (regData.authMode === 'teammate' ? 'teammate' : (regData.authMode === 'intern' ? 'intern' : 'user')));
      const finalReferralCode = (regData.referralCode || referralCode || '').trim().toUpperCase();

      const profileMetadata = {
        college: regData.college || 'GPREC',
        department: regData.department || 'CSE',
        branch: regData.department || 'CSE',
        year: regData.year || '1st Year',
        sem: regData.sem || semester || '1',
        sec: regData.sec || section || 'A',
        rollNumber: regData.rollNumber || '',
        qualification: regData.qualification || 'B.Tech',
        place: regData.place || 'Kurnool',
        cgpa: regData.cgpa || '9.0',
        careerGoal: regData.careerGoal || 'Placement',
        learningStyle: regData.learningStyle || 'Practical',
        weakSubjects: regData.weakSubjects || 'None',
        referredBy: finalReferralCode,
        referralCode: finalReferralCode,
        xp: 50,
        coins: 100,
        level: 1,
        streak: 1,
        oneTimeFeePaid: Boolean(paymentInfo.oneTimeFeePaid),
        feeAmount: paymentInfo.feeAmount !== undefined ? paymentInfo.feeAmount : 0,
        feePaidAt: paymentInfo.feePaidAt || null,
        feeTxId: paymentInfo.feeTxId || null
      };

      const packedName = `${cleanName} ${JSON.stringify(profileMetadata)}`;

      // 1. Supabase Profile Upsert (Fast DB Save)
      const sbPayload = {
        name: packedName,
        email: cleanEmail,
        password: regData.password,
        role: determinedRole,
        college: profileMetadata.college,
        department: profileMetadata.department,
        branch: profileMetadata.branch,
        year: profileMetadata.year,
        sem: profileMetadata.sem,
        sec: profileMetadata.sec,
        roll_number: profileMetadata.rollNumber,
        qualification: profileMetadata.qualification,
        place: profileMetadata.place,
        referred_by: finalReferralCode,
        referral_code: finalReferralCode,
        created_at: new Date().toISOString(),
        is_approved: determinedRole !== 'faculty'
      };

      const sbPromise = supabase.from('users').upsert([sbPayload], { onConflict: 'email' });

      // 2. Firebase Auth & Firestore Account Finalization
      const isGoogleAuth = regData.password === 'google_oauth_managed' || (auth.currentUser && auth.currentUser.email?.toLowerCase() === cleanEmail);
      let fbResUser = null;

      if (isGoogleAuth && auth.currentUser) {
        fbResUser = auth.currentUser;
        const fsDoc = {
          id: fbResUser.uid,
          uid: fbResUser.uid,
          name: cleanName,
          email: cleanEmail,
          role: determinedRole,
          ...profileMetadata,
          created_at: new Date().toISOString(),
          isApproved: determinedRole !== 'faculty',
          is_approved: determinedRole !== 'faculty'
        };
        await Promise.allSettled([
          setDoc(doc(db, 'users', fbResUser.uid), fsDoc, { merge: true }),
          setDoc(doc(db, 'Users', fbResUser.uid), fsDoc, { merge: true })
        ]);
      } else {
        fbResUser = await createUserWithEmailAndPassword(auth, cleanEmail, regData.password)
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
      }

      await sbPromise;

      if (cleanEmail && paymentInfo.oneTimeFeePaid) {
        try {
          recordLocalFeePayment(cleanEmail, paymentInfo);
        } catch (e) {}
      }

      // Non-blocking notifications
      sendFounderNotification('register', {
        name: cleanName,
        email: cleanEmail,
        role: determinedRole,
        college: profileMetadata.college,
        feePaid: profileMetadata.oneTimeFeePaid,
        feeTxId: profileMetadata.feeTxId
      }).catch(() => {});

      if (finalReferralCode) {
        const refDoc = {
          referralCode: finalReferralCode,
          userEmail: cleanEmail,
          userName: cleanName,
          college: profileMetadata.college,
          department: profileMetadata.department,
          year: profileMetadata.year,
          registeredAt: new Date().toISOString(),
          timestamp: serverTimestamp()
        };
        if (db) addDoc(collection(db, 'ambassador_referrals'), refDoc).catch(() => {});
        if (internshipDb) addDoc(collection(internshipDb, 'ambassador_referrals'), refDoc).catch(() => {});
        notifyFounderAmbassadorReferral({
          code: finalReferralCode,
          scholarName: cleanName,
          scholarEmail: cleanEmail,
          college: profileMetadata.college,
          department: profileMetadata.department
        });
      }

      if (regData.authMode === 'faculty' || determinedRole === 'faculty') {
        try { await auth.signOut(); } catch (e) {}
        try { await supabase.auth.signOut(); } catch (e) {}

        emailjs.send(
          'service_ya5r1pk',
          'template_h3jbqrj',
          {
            to_name: 'Founder',
            to_email: '249XA33106@gprec.ac.in',
            faculty_name: cleanName,
            faculty_email: cleanEmail,
            faculty_department: (regData.department || '').trim(),
            faculty_designation: (regData.designation || '').trim(),
            faculty_mobile: (regData.mobileNumber || '').trim(),
            message: `A new faculty member ${cleanName} (${cleanEmail}) from ${(regData.department || '').trim()} has registered.`
          },
          '9-0dhY139CBiyCxBJ'
        ).catch(() => {});

        setSuccessMsg('Registration submitted! Faculty accounts are locked and require Founder verification in the Security Queue before activation. You cannot sign in until approved.');
        setIsLogin(true);
        setLoading(false);
        return;
      } else if (isGoogleAuth) {
        // Google auth already verified email; payment complete, log in directly
        const finalizedUser = {
          id: fbResUser?.uid || regData.id || regData.uid,
          uid: fbResUser?.uid || regData.id || regData.uid,
          name: cleanName,
          email: cleanEmail,
          role: determinedRole,
          ...profileMetadata,
          emailVerified: true
        };
        handleSuccessfulLogin(finalizedUser);
        setLoading(false);
        return;
      } else {
        setUnverifiedEmail(cleanEmail);
        setSuccessMsg(`Account created! A secure verification link was sent to ${cleanEmail}.`);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message ? err.message.replace('Firebase: ', '') : 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const cleanEmail = email.toLowerCase().trim();
      const isFounderOrAdmin = cleanEmail === 'founder@lumixora.com' || cleanEmail === '249xa33106@gmail.com';
      const cleanPassword = password.trim();

      if (isLogin) {
        // Enforce institutional domain policy upfront
        const isTeammateUser = isTeammateEmail(cleanEmail);
        const isInternUser = authMode === 'intern' || cleanEmail.includes('.intern@') || cleanEmail.includes('intern@') || cleanEmail.startsWith('lmx') || cleanEmail.includes('lmx-');

        // ⚡ Dedicated Intern Authentication Fast-Path
        if (isInternUser || authMode === 'intern') {
          try {
            const internUser = await validateInternLogin(email.trim(), cleanPassword);
            if (internUser) {
              internUser.oneTimeFeePaid = true;
              internUser.feePaid = true;
              internUser.feeTxId = `INTERN-${internUser.refId || 'VERIFIED'}`;
              internUser.isIntern = true;
              if (internUser.email) {
                try {
                  localStorage.setItem(`lumixora_fee_paid_${internUser.email.toLowerCase().trim()}`, 'true');
                  localStorage.setItem(`lumixora_fee_tx_${internUser.email.toLowerCase().trim()}`, 'INTERN-VERIFIED');
                } catch (e) {}
              }
              sendFounderNotification('login', { ...internUser, last_login: new Date().toISOString() }).catch(() => {});
              handleSuccessfulLogin(internUser);
              setLoading(false);
              return;
            }
          } catch (internErr) {
            if (authMode === 'intern' || cleanEmail.startsWith('lmx')) {
              setError(internErr.message || 'Invalid Intern ID or Passcode.');
              setLoading(false);
              return;
            }
          }
        }

        const isAnjumUser = isAnjum(cleanEmail);
        const isAllowedDomain = isValidInstitutionalEmail(cleanEmail, customColleges) || isTeammateUser || isInternUser || isFounderOrAdmin || isAnjumUser;
        if (!isFounderOrAdmin && !isAnjumUser && !isAllowedDomain) {
          setError('Security Access Restricted: Access is restricted to official college email accounts (e.g. @gprec.ac.in).');
          setLoading(false);
          return;
        }

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
          let unpackedMeta = {};
          if (matchedUser.name && matchedUser.name.includes('{')) {
            try {
              unpackedMeta = JSON.parse(matchedUser.name.substring(matchedUser.name.indexOf('{')));
            } catch (e) {}
          }
          authenticatedUser = {
            id: matchedUser.id,
            uid: matchedUser.id,
            email: cleanEmail,
            ...unpackedMeta,
            ...matchedUser,
            college: unpackedMeta.college || matchedUser.college || 'GPREC',
            department: unpackedMeta.department || matchedUser.department || 'CSE'
          };
        } else if (fbRes.user) {
          const fbUser = fbRes.user;
          const sbFallback = sbUsers && sbUsers.length > 0 ? sbUsers[0] : {};
          authenticatedUser = {
            id: fbUser.uid,
            uid: fbUser.uid,
            email: fbUser.email,
            emailVerified: fbUser.emailVerified,
            ...sbFallback,
            role: isFounderOrAdmin ? 'founder' : (sbFallback.role || (authMode === 'teammate' ? 'teammate' : (authMode === 'intern' ? 'intern' : 'user')))
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

        // Strict Account Status & Faculty Approval Verification
        const accessCheck = checkUserAccessStatus(authenticatedUser);
        if (!accessCheck.allowed) {
          setError(accessCheck.message);
          setLoading(false);
          try { await auth.signOut(); } catch (e) {}
          try { await supabase.auth.signOut(); } catch (e) {}
          return;
        }

        const userIsTeammate = authenticatedUser.role === 'teammate' || authenticatedUser.role === 'team' || isTeammateEmail(cleanEmail);
        const userDomainValid = isValidInstitutionalEmail(cleanEmail, customColleges) || userIsTeammate;

        if (!isFounderOrAdmin && !authenticatedUser.is_approved && !authenticatedUser.isApproved && !userDomainValid) {
          setError('Security Access Restricted: Please sign in using your official college (@gprec.ac.in) or team mail.');
          setLoading(false);
          try { await auth.signOut(); } catch (e) {}
          try { await supabase.auth.signOut(); } catch (e) {}
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

        // Audit notification & update live activity timestamp
        const nowIso = new Date().toISOString();
        sendFounderNotification('login', { ...finalUserDoc, last_login: nowIso }).catch(() => {});
        // Update last_login in Firestore & Supabase in background
        if (finalUserDoc.id || finalUserDoc.uid) {
          const uid = finalUserDoc.id || finalUserDoc.uid;
          try {
            if (db) setDoc(doc(db, 'users', uid), { last_login: nowIso, lastActive: nowIso }, { merge: true }).catch(() => {});
            supabase.from('users').update({ last_login: nowIso }).eq('email', cleanEmail).catch(() => {});
          } catch (e) {}
        }

        // Enforce ?10 one-time fee for everyone except Anjum & Founder
        if (!isExemptFromPayment(finalUserDoc) && !hasPaidCollegeFee(finalUserDoc)) {
          setFeeModalUser(finalUserDoc);
          setFeeModalMode('login');
          setLoading(false);
          return;
        }

        handleSuccessfulLogin(finalUserDoc);
      } else {
        // ⚡ REGISTRATION FLOW
        const isInternReg = authMode === 'intern' || cleanEmail.includes('.intern@') || cleanEmail.includes('intern@');
        const isAnjumUser = isAnjum(cleanEmail) || isAnjum(name);
        if (!isFounderOrAdmin && !isAnjumUser && !isInternReg && !isValidInstitutionalEmail(cleanEmail, customColleges)) {
          const selCol = selectedCollege?.shortName || selectedCollege?.code || 'your college';
          setError(`Security Access Restricted: Please enter a valid college email for ${selCol} (e.g. @gprec.ac.in for GPREC, @ashokaengg.ac.in for Ashoka, or your verified college domain).`);
          setLoading(false);
          return;
        }

        const cleanName = name.trim();
        const determinedRole = authMode === 'faculty' ? 'faculty' : (authMode === 'teammate' ? 'teammate' : (authMode === 'intern' ? 'intern' : 'user'));
        const targetCollege = collegeName.trim() || detectedProfile?.college || (selectedCollege?.name || 'GPREC');

        const regData = {
          name: cleanName,
          email: cleanEmail,
          password: password,
          college: targetCollege,
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
          role: determinedRole,
          designation,
          mobileNumber,
          referralCode: referralCode.trim().toUpperCase(),
          authMode
        };

        // RULE: EXCEPT ANJUM & VERIFIED INTERNS DONT ALLOW ANYONE TO REGISTER OR LOGIN WITHOUT PAYMENT
        if (!isExemptFromPayment(regData) && !hasPaidCollegeFee(regData)) {
          setFeeModalUser(regData);
          setFeeModalMode('registration');
          setLoading(false);
          return;
        }

        // If Anjum (pre-verified by founder) or already paid, complete registration directly
        await executeRegisterUser(regData, {
          oneTimeFeePaid: true,
          feeAmount: 10,
          feePaidAt: new Date().toISOString(),
          feeTxId: isAnjum(cleanEmail) ? 'UTR-616740048435' : (regData.feeTxId || 'UTR-VERIFIED')
        });
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

      if (providerName === 'google') {
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
          const result = await signInWithPopup(auth, provider);
          if (result?.user) {
            await processOAuthUser(result.user, 'Google');
            return;
          }
        } catch (popupErr) {
          console.warn("Firebase popup sign-in note:", popupErr);

          if (popupErr.code === 'auth/popup-closed-by-user' || popupErr.code === 'auth/cancelled-popup-request') {
            setLoading(false);
            return;
          }

          if (popupErr.code === 'auth/popup-blocked') {
            try {
              await signInWithRedirect(auth, provider);
              return;
            } catch (redirErr) {
              console.warn("Firebase redirect note:", redirErr);
            }
          }

          // Fallback to Supabase Google OAuth
          try {
            const { error: sbOAuthErr } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin
              }
            });
            if (sbOAuthErr) throw sbOAuthErr;
          } catch (sbErr) {
            console.error("OAuth fallback error:", sbErr);
            setError(`Sign-In note: ${popupErr.message || sbErr.message || 'Please check popup permissions or use campus email credentials.'}`);
            setLoading(false);
          }
        }
      } else if (providerName === 'github') {
        const provider = new GithubAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          if (result?.user) {
            await processOAuthUser(result.user, 'GitHub');
            return;
          }
        } catch (popupErr) {
          if (popupErr.code === 'auth/popup-closed-by-user' || popupErr.code === 'auth/cancelled-popup-request') {
            setLoading(false);
            return;
          }
          await signInWithRedirect(auth, provider);
        }
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

    const isF = query === 'founder@lumixora.com' || query === '249xa33106@gmail.com' || query === '249xa33106@gprec.ac.in';
    if (!isF && !isValidInstitutionalEmail(query, customColleges)) {
      setResetError('Security Access Restricted: Password reset is strictly available for official college accounts (e.g. @gprec.ac.in).');
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
              <Building2 className="w-3.5 h-3.5" /> Vyomra Multi-Campus Network
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
              <button
                type="button"
                onClick={() => { 
                  setAuthMode('intern'); 
                  setSelectedCollege({ id: 'intern', name: 'Lumixora Autonomous Engineering Internship Program', shortName: 'Lumixora Interns', code: 'INTERN', logo: '🚀' }); 
                  setCollegeName('Lumixora Autonomous Systems');
                  setError(''); 
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  authMode === 'intern'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <Briefcase className="w-4 h-4 text-indigo-400" /> Intern Portal
              </button>
            </div>
          </div>

          {/* Campus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAvailableColleges.map((col) => {
              return (
                <div
                  key={col.id}
                  onClick={() => {
                    setSelectedCollege(col);
                    setCollegeName(col.shortName || col.name || col.code);
                    setError('');
                    // If previously typed email belongs to a different college, reset it so placeholder displays cleanly
                    if (email && col.domains && !col.domains.some(d => email.toLowerCase().includes(d.toLowerCase()))) {
                      setEmail('');
                    }
                  }}
                  className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 hover:border-[#00f5d4]/50 hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-2xl"
                >
                  <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${col.bannerColor || 'from-purple-600 to-blue-600'} opacity-15 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />

                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                        {col.logo || '🏛️'}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-black text-gray-300">
                          {col.code || 'CAMPUS'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-black text-cyan-300">
                          ⚡ ₹10 One-Time Access Fee
                        </span>
                      </div>
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
                      <span className="text-cyan-400 font-bold">
                        ₹10 Platform Access Pass
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
              );
            })}
          </div>

          {/* College Not Mentioned in Student Login Banner */}
          <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#131525] to-cyan-500/15 border-2 border-amber-500/35 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-2xl shrink-0 shadow-md">
                🏛️
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Your college not mentioned in Student Login?
                </h4>
                <p className="text-xs text-gray-300 mt-0.5 max-w-xl leading-relaxed">
                  Want your campus added to Lumixora? Contact us at <strong className="text-amber-300 font-mono">lumixora.team@gmail.com</strong> and our team will onboard your university with custom syllabus mapping, past papers & AI learning twin!
                </p>
              </div>
            </div>

            <a
              href="mailto:lumixora.team@gmail.com?subject=Add%20My%20College%20to%20Lumixora%20Student%20Login&body=Hi%20Lumixora%20Team%2C%0A%0AWe%20would%20like%20to%20add%20our%20college%20to%20the%20Lumixora%20Student%20Login%20portal.%0A%0ACollege%20Name%3A%20%0ALocation%20(City%2C%20State)%3A%20%0AOfficial%20Website%20%2F%20Domain%3A%20%0AContact%20Person%20%2F%20Phone%3A%20%0A%0AThank%20you!"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-black" />
              <span>Contact Us</span>
            </a>
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
                ? `Sign In (${authMode === 'faculty' ? 'Faculty' : (authMode === 'intern' ? 'Lumixora Intern' : 'Student')})` 
                : `Create Account (${authMode === 'faculty' ? 'Faculty' : (authMode === 'intern' ? 'Lumixora Intern' : 'Student')})`
              }
            </h2>
            <p className="text-gray-400 text-xs">
              {selectedCollege.name}
            </p>
          </div>

          {/* Institutional Shield & Fee Status Badge */}
          {(() => {
            const primaryDomain = selectedCollege?.domains?.[0] || 'gprec.ac.in';
            return (
              <div className="p-3.5 rounded-2xl mb-6 text-xs flex items-start gap-2.5 shadow-lg border bg-[#00f5d4]/10 border-[#00f5d4]/30 text-teal-300">
                <ShieldCheck className="w-5 h-5 text-[#00f5d4] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <strong className="block font-bold text-white">
                      {selectedCollege.shortName || selectedCollege.code || 'Official'} Verified Campus Access
                    </strong>
                    {authMode === 'intern' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        ⚡ Verified Intern Track (₹0 Fee)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                        ⚡ ₹10 One-Time Access Fee
                      </span>
                    )}
                  </div>
                  <span className="leading-relaxed text-gray-300 block">
                    {authMode === 'intern' ? (
                      <>Sign in with your assigned <strong className="text-[#00f5d4] underline font-mono">Intern Ref ID (e.g. LMX-B01-4783)</strong> or registered email, and your secure access passcode. No platform access fee required.</>
                    ) : (
                      <>Students of <strong className="text-white font-bold">{selectedCollege.name || selectedCollege.shortName}</strong> receive full platform access with a one-time <strong className="text-cyan-300 underline font-bold">₹10 registration/login pass</strong>. Please sign in with your official <strong className="text-[#00f5d4] underline">@{primaryDomain}</strong> email.</>
                    )}
                  </span>
                </div>
              </div>
            );
          })()}

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
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                {authMode === 'intern' 
                  ? 'Intern ID (e.g. LMX-B01-XXXX) or Registered Email' 
                  : `${selectedCollege?.shortName || selectedCollege?.code || 'Campus'} Official Email`
                }
              </label>
              <input
                type={authMode === 'intern' ? 'text' : 'email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all font-mono"
                placeholder={authMode === 'intern' ? 'LMX-B01-4783 or your registered email' : `rollnumber@${selectedCollege?.domains?.[0] || 'gprec.ac.in'}`}
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
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                {authMode === 'intern' ? 'Access Passcode / PIN' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f5d4]/50 focus:ring-1 focus:ring-[#00f5d4]/50 transition-all pr-12 font-mono"
                  placeholder={authMode === 'intern' ? 'LMX@4783 or custom PIN' : '••••••••'}
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

            {!isLogin && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Campus Ambassador Referral Code</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">Optional</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setReferralCode(val);
                      if (val) localStorage.setItem('lumixora_referral_code', val);
                      else localStorage.removeItem('lumixora_referral_code');
                    }}
                    placeholder="e.g. LMX-CA-2026-XXXX"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-amber-500/20 text-white text-xs placeholder:text-gray-500 outline-none focus:border-amber-400 font-mono tracking-wider transition-all"
                  />
                  {referralCode ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                      <span>✨ Applied</span>
                    </span>
                  ) : (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono">
                      REF CODE
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-1 pl-1">
                  Referred by a Campus Ambassador? Enter their code for verified campus attribution.
                </p>
              </div>
            )}

            {!isLogin && !isExemptFromPayment(email) && (
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-cyan-400" /> One-Time Registration Fee:
                </span>
                <span className="font-black text-white bg-cyan-500/25 px-2.5 py-1 rounded-lg">₹10.00 Only</span>
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
                  <span>
                    {isLogin 
                      ? 'Sign In to Workspace' 
                      : (isExemptFromPayment(email) ? 'Create Verified Account (Approved)' : 'Pay ₹10 & Create Verified Account')}
                  </span>
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
            {isLogin ? "New to Vyomra? " : "Already have an account? "}
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
              href="https://ykuyzkhhnltjccyzduap.supabase.co/storage/v1/object/public/academic_resources/app/Vyomra.apk" 
              download="Vyomra.apk"
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
                href={`https://mail.google.com/a/${selectedCollege?.domains?.[0] || 'gprec.ac.in'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-[#00f5d4] rounded-xl text-xs font-bold border border-[#00f5d4]/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{selectedCollege?.shortName || selectedCollege?.code || 'Campus'} Webmail</span>
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
                  placeholder={`rollnumber@${selectedCollege?.domains?.[0] || 'gprec.ac.in'}`}
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

      {/* College Access Fee Modal for Non-GPREC ₹10 Registration & Login */}
      {feeModalUser && (
        <CollegeAccessFeeModal
          isOpen={true}
          user={feeModalUser}
          college={selectedCollege || feeModalUser.college || collegeName}
          mode={feeModalMode}
          onSuccess={async (paymentDetails) => {
            const userDoc = feeModalUser;
            setFeeModalUser(null);
            if (feeModalMode === 'registration') {
              await executeRegisterUser(userDoc, paymentDetails);
            } else {
              const updatedUser = { 
                ...userDoc, 
                ...paymentDetails, 
                oneTimeFeePaid: true 
              };
              handleSuccessfulLogin(updatedUser);
            }
          }}
          onCancel={() => {
            setFeeModalUser(null);
            setLoading(false);
          }}
        />
      )}
    </div>
  );
}
