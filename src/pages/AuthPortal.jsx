import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye, EyeOff, Lock, ChevronDown, User, LogIn, UserPlus, ArrowLeft, ArrowRight, Mail, X, 
  Building2, GraduationCap, ShieldCheck, AlertCircle, RefreshCw, 
  ExternalLink, Key, Check, Cpu, Award, Briefcase, CreditCard, Sparkles, Gift, Crown
, Search, Sun, Moon, Megaphone, MapPin, Users } from 'lucide-react';
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
  DEFAULT_COLLEGES, resolveCollegeLogo, mergeCollegesWithDefaults, isValidInstitutionalEmail, isTeammateEmail, decodeGprecRollNumber, decodeVitApRollNumber,
  decodeMitsRollNumber,
  isGprecScholar, hasPaidCollegeFee, recordLocalFeePayment, getStoredCustomColleges, fetchCollegesFromSupabase,
  isAnjum, isExemptFromPayment
} from '../data/collegesData';
import { notifyFounderLogin, notifyFounderRegister, recordFounderNotification, notifyFounderPayment, notifyFounderAmbassadorReferral } from '../services/founderNotificationService';
import { checkUserAccessStatus } from '../utils/authSecurity';
import { validateInternLogin } from '../services/internDbService';
import { internshipDb } from '../services/internshipDb';
import CollegeAccessFeeModal from '../components/CollegeAccessFeeModal';
import Realistic3DLogo from '../components/Realistic3DLogo';

export default function AuthPortal({ onLogin, mode = 'student', onBackHome }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAllCampuses, setShowAllCampuses] = useState(false);
  const [feeModalUser, setFeeModalUser] = useState(null);
  const [feeModalMode, setFeeModalMode] = useState('login'); // 'login' | 'registration'
  const [selectedCollege, setSelectedCollege] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_selected_college');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          return {
            ...parsed,
            logo: resolveCollegeLogo(parsed.logo, parsed)
          };
        }
      }
    } catch (e) {}
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

  // Triple-click handler on founder picture to trigger secret Founder Access
  const founderClicksRef = React.useRef(0);
  const founderClickTimeoutRef = React.useRef(null);

  const triggerFounderMode = () => {
    setAuthMode('founder');
    setSelectedCollege({ 
      id: 'founder', 
      name: 'Lumixora Executive Office', 
      shortName: 'Founder Console', 
      code: 'FOUNDER', 
      logo: '👑' 
    }); 
    setCollegeName('Lumixora Executive Administration');
    setEmail('founder@lumixora.com');
    setError('');
  };

  const handleFounderPictureClick = (e) => {
    if (e?.detail === 3) {
      triggerFounderMode();
      return;
    }
    founderClicksRef.current += 1;
    if (founderClicksRef.current >= 3) {
      triggerFounderMode();
      founderClicksRef.current = 0;
      if (founderClickTimeoutRef.current) clearTimeout(founderClickTimeoutRef.current);
      return;
    }
    if (founderClickTimeoutRef.current) clearTimeout(founderClickTimeoutRef.current);
    founderClickTimeoutRef.current = setTimeout(() => {
      founderClicksRef.current = 0;
    }, 1500);
  };

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
    return mergeCollegesWithDefaults(customColleges);
  }, [customColleges]);

  const getCampusCardImage = (col, idx) => {
    if (col.id === 'gprec' || col.code === 'GPREC') {
      return '/images/campuses/campus_gprec.jpg?v=2';
    }
    if (col.id === 'ashoka' || col.code === 'ASHOKA') {
      return '/images/campuses/campus_ashoka.jpg?v=2';
    }
    if (col.id === 'annamacharya' || col.code === 'AU' || col.code === 'AITS') {
      return '/images/campuses/campus_annama.jpg?v=2';
    }
    if (col.id === 'bits' || col.code === 'BITS') {
      return '/images/campuses/campus_bheema.jpg';
    }
    if (col.id === 'svce' || col.code === 'SVCE') {
      return '/images/campuses/campus_svce.jpg';
    }
    if (col.id === 'narayana' || col.code === 'NEC') {
      return '/images/campuses/campus_narayana.jpg';
    }
    if (col.id === 'rgukt' || col.code === 'RGUKT') {
      return '/images/campuses/campus_rgukt.jpg';
    }
    if (col.id === 'vitap' || col.code === 'VIT-AP') {
      return '/images/campuses/campus_vitap.jpg';
    }
    if (col.id === 'mits' || col.code === 'MITS') {
      return '/images/campuses/campus_mits.jpg';
    }
    const localFallbacks = [
      '/images/campuses/campus_gprec.jpg?v=2',
      '/images/campuses/campus_ashoka.jpg?v=2',
      '/images/campuses/campus_annama.jpg?v=2',
      '/images/campuses/campus_bheema.jpg',
      '/images/campuses/campus_svce.jpg',
      '/images/campuses/campus_narayana.jpg',
      '/images/campuses/campus_rgukt.jpg',
      '/images/campuses/campus_vitap.jpg',
      '/images/campuses/campus_mits.jpg'
    ];
    return localFallbacks[idx % localFallbacks.length];
  };

  const filteredColleges = useMemo(() => {
    if (!searchQuery?.trim()) return allAvailableColleges;
    const q = searchQuery.toLowerCase().trim();
    return allAvailableColleges.filter(col => 
      col.name?.toLowerCase().includes(q) ||
      col.shortName?.toLowerCase().includes(q) ||
      col.code?.toLowerCase().includes(q) ||
      col.location?.toLowerCase().includes(q)
    );
  }, [allAvailableColleges, searchQuery]);

  const displayedColleges = useMemo(() => {
    return filteredColleges;
  }, [filteredColleges]);

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
    } else if (domain === 'mits.ac.in' || domain?.includes('mits') || (selectedCollege && (selectedCollege.id === 'mits' || selectedCollege.code === 'MITS'))) {
      isInstitutional = true;
      detectedCollege = 'MITS DEEMED TO BE UNIVERSITY';
      const decoded = decodeMitsRollNumber(prefix);
      return {
        isInstitutional,
        college: detectedCollege,
        department: decoded.department,
        year: decoded.year,
        roll: decoded.rollNumber,
        isPromptRequired: false
      };
    } else if (domain === 'vitapstudent.ac.in' || domain === 'vitap.ac.in' || domain?.includes('vitap') || (selectedCollege && (selectedCollege.id === 'vitap' || selectedCollege.code === 'VIT-AP'))) {
      isInstitutional = true;
      detectedCollege = 'VIT-AP University';
      const decoded = decodeVitApRollNumber(prefix);
      return {
        isInstitutional,
        college: detectedCollege,
        department: decoded.department,
        year: decoded.year,
        roll: decoded.rollNumber,
        isPromptRequired: false
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
      const isFounderOrAdmin = oauthEmail === 'founder@lumixora.com'  ;
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
          name: cleanName,
          full_name: cleanName,
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
          const isF = sbEmail === 'founder@lumixora.com' ;
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
        name: cleanName,
        full_name: cleanName,
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
      const isFounderOrAdmin = cleanEmail === 'founder@lumixora.com' ;
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

    const isF = query === 'founder@lumixora.com'  ;
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
    <div className="min-h-screen bg-gradient-to-b from-[#F2F5FB] via-[#EAF0F9] to-[#DFE7F3] text-slate-900 flex flex-col justify-between relative overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-900 font-sans transition-colors duration-300">
      
      {/* Background Ambience: Subtle grid + Soft curved lavender gradient glow on top-right */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.04)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[55vw] h-[650px] bg-gradient-to-bl from-indigo-100/70 via-purple-100/35 to-transparent rounded-bl-[200px] pointer-events-none -z-0" />

      {/* Top Navigation Bar (Tesla / Apple Grade Modern Header) */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Brand Left: Sparkle Logo + Lumixora | A Product of VYOMRA */}
        <div 
          onClick={() => {
            if (selectedCollege) {
              setSelectedCollege(null);
              setError('');
            }
          }}
          className={`flex items-center gap-3 select-none ${selectedCollege ? 'cursor-pointer group' : ''}`}
        >
          {/* Authentic Lumixora 3D Brand Logo */}
          <Realistic3DLogo size="sm" showGlow={true} interactive={true} />

          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
              Lumixora
            </span>
            <span className="text-slate-300 font-light text-lg">|</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase">
              A Product of VYOMRA
            </span>
          </div>
        </div>

        </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        {!selectedCollege ? (
          /* Step 1: 3D Futuristic Liquid Glass Portal Selection (Tesla / Apple Vision Grade) */
          <div className="w-full animate-fade-in-up relative pb-16">
            
            {/* Soft ambient atmosphere */}
            <div className="absolute top-0 right-0 w-[50vw] h-[480px] bg-gradient-to-bl from-indigo-100/60 via-purple-100/30 to-transparent rounded-bl-[160px] pointer-events-none -z-0" />

            {/* Decorative Floating Crystal Orbs */}
            <div className="absolute top-72 right-1/3 w-5 h-5 rounded-full bg-white/30 backdrop-blur-md border border-white/80 shadow-lg shadow-indigo-500/10 pointer-events-none hidden lg:block" />
            <div className="absolute top-[480px] right-24 w-7 h-7 rounded-full bg-white/40 backdrop-blur-md border border-white/90 shadow-xl shadow-purple-500/15 pointer-events-none hidden lg:block" />
            <div className="absolute bottom-8 left-16 w-6 h-6 rounded-full bg-white/35 backdrop-blur-md border border-white/80 shadow-md pointer-events-none hidden lg:block" />

            {/* Hero Section */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              
              {/* Left Column: Welcome Tag, 2-Line Enormous Headline, Subtitle, 3D Role Switcher Capsule */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Welcome Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE9FE]/85 border border-purple-200/90 text-[#5B21B6] text-xs font-bold shadow-xs backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                  <span>Welcome to Lumixora</span>
                </div>

                {/* 2-Line Massive Headline matching 3D render */}
                <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-black tracking-tight leading-[1.02]">
                  <span className="block text-slate-900">Select Your</span>
                  <span className="block text-[#4F46E5] bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] filter drop-shadow-[0_4px_16px_rgba(79,70,229,0.22)]">
                    Portal
                  </span>
                </h1>

                {/* Architectural Subtitle */}
                <p className="text-slate-600 text-sm sm:text-base font-normal max-w-md leading-relaxed">
                  Your gateway to a smarter, connected and innovative campus experience.
                </p>

                {/* 3D Liquid Glass Continuous Role Switcher Pod */}
                <div className="pt-3">
                  <div className="relative inline-flex flex-wrap sm:flex-nowrap items-center p-1.5 rounded-full bg-white/50 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.08)] ring-1 ring-white/70 gap-1">
                    
                    {/* Floating Neon Contour Loop on the left */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-indigo-400/50 pointer-events-none opacity-50 hidden sm:block" />

                    {/* 1. Student Portal */}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('student'); setSelectedCollege(null); setError(''); }}
                      className={`relative px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                        authMode === 'student'
                          ? 'bg-gradient-to-r from-[#6366F1] via-[#4F46E5] to-[#4338CA] text-white shadow-[0_8px_25px_rgba(79,70,229,0.5)] border border-indigo-400/40 z-10 scale-[1.03]'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${authMode === 'student' ? 'bg-white/20' : 'bg-white/60 shadow-xs'}`}>
                        <GraduationCap className={`w-3.5 h-3.5 ${authMode === 'student' ? 'text-white' : 'text-indigo-600'}`} />
                      </div>
                      <span>Student</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${authMode === 'student' ? 'bg-white/20 text-white' : 'bg-black/5 text-slate-500'}`}>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>

                    {/* 2. Faculty Portal */}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('faculty'); setSelectedCollege(null); setError(''); }}
                      className={`relative px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                        authMode === 'faculty'
                          ? 'bg-gradient-to-r from-[#6366F1] via-[#4F46E5] to-[#4338CA] text-white shadow-[0_8px_25px_rgba(79,70,229,0.5)] border border-indigo-400/40 z-10 scale-[1.03]'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
                      }`}
                    >
                      <Users className="w-4 h-4 text-slate-700" />
                      <span>Faculty</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${authMode === 'faculty' ? 'bg-white/20 text-white' : 'bg-black/5 text-slate-500'}`}>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>

                    {/* 3. Intern Portal */}
                    <button
                      type="button"
                      onClick={() => { 
                        setAuthMode('intern'); 
                        setSelectedCollege({ id: 'intern', name: 'Lumixora Autonomous Engineering Internship Program', shortName: 'Lumixora Interns', code: 'INTERN', logo: '🚀' }); 
                        setCollegeName('Lumixora Autonomous Systems');
                        setError(''); 
                      }}
                      className={`relative px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                        authMode === 'intern'
                          ? 'bg-gradient-to-r from-[#6366F1] via-[#4F46E5] to-[#4338CA] text-white shadow-[0_8px_25px_rgba(79,70,229,0.5)] border border-indigo-400/40 z-10 scale-[1.03]'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-slate-700" />
                      <span>Intern</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${authMode === 'intern' ? 'bg-white/20 text-white' : 'bg-black/5 text-slate-500'}`}>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Instant Above-The-Fold Campus Quick Selector Pills */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-indigo-500" /> Campuses:
                  </span>
                  {allAvailableColleges.slice(0, 4).map((col) => {
                    const cLogo = resolveCollegeLogo(col.logo, col);
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => { setSelectedCollege(col); setError(''); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200/90 shadow-xs hover:shadow-md text-xs font-bold text-slate-800 hover:text-indigo-600 transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        {cLogo && (cLogo.startsWith('/') || cLogo.startsWith('http') || cLogo.includes('.png')) ? (
                          <img src={cLogo} alt="" className="w-3.5 h-3.5 object-contain rounded-full" />
                        ) : (
                          <span className="text-xs">{cLogo || '🏛️'}</span>
                        )}
                        <span>{col.shortName || col.code || col.name}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('campuses-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-0.5 ml-1 cursor-pointer"
                  >
                    <span>All Campuses</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>

              {/* Right Column: Lumixora Founder & Chief Architect (Vibrant Colorful Aurora Glow) */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
                <div 
                  onClick={handleFounderPictureClick}
                  className="relative w-full rounded-[30px] overflow-hidden p-4 sm:p-5 flex flex-col items-center justify-center group cursor-pointer select-none transition-all duration-500 hover:scale-[1.01] shadow-[0_20px_50px_rgba(79,70,229,0.22),_0_10px_35px_rgba(6,182,212,0.2)] border border-white/80 ring-1 ring-white/60"
                  style={{
                    background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.75) 0%, rgba(243, 232, 255, 0.7) 45%, rgba(224, 242, 254, 0.8) 100%)',
                    backdropFilter: 'blur(24px)'
                  }}
                >
                  {/* Dynamic Multi-Color Radiant Aurora Plasma Glows */}
                  {/* 1. Deep Electric Violet Aurora */}
                  <div 
                    className="absolute -top-12 -left-12 w-72 h-72 rounded-full pointer-events-none opacity-80 group-hover:opacity-95 blur-[50px] transition-all duration-700 animate-pulse"
                    style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(99, 102, 241, 0.3) 50%, transparent 70%)' }}
                  />
                  {/* 2. Vibrant Cyan Glow */}
                  <div 
                    className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full pointer-events-none opacity-80 group-hover:opacity-95 blur-[50px] transition-all duration-700"
                    style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.55) 0%, rgba(56, 189, 248, 0.3) 50%, transparent 70%)' }}
                  />
                  {/* 3. Center Radiant Magenta/Indigo Core */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-85 blur-[45px] transition-opacity duration-700"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.35) 0%, rgba(6, 182, 212, 0.25) 45%, transparent 75%)' }}
                  />

                  {/* Top-rim iridescent specular glass reflection */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-purple-400 opacity-80" />

                  {/* Founder Holographic Portrait with Pop-Out Visual */}
                  <div className="relative z-10 w-full flex items-center justify-center py-2">
                    <img
                      src="/images/founder_hero.png?v=4"
                      alt="Shaik Sowban - Lumixora Founder"
                      className="max-h-[190px] sm:max-h-[220px] lg:max-h-[230px] w-auto object-contain drop-shadow-[0_22px_45px_rgba(99,102,241,0.38)] group-hover:scale-[1.04] active:scale-95 transition-all duration-300 select-none"
                    />
                  </div>

                  {/* Tesla / Apple Style Liquid Glass Bottom Pill */}
                  <div className="relative z-20 mt-3 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgba(99,102,241,0.18)] flex items-center gap-2.5 group-hover:bg-white group-hover:shadow-[0_10px_35px_rgba(6,182,212,0.28)] transition-all">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_12px_rgba(6,182,212,1)]" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide font-sora">
                      Shaik Sowban
                    </span>
                    <span className="text-slate-300 text-xs">|</span>
                    <span className="text-[10px] sm:text-[11px] font-black text-indigo-600 tracking-widest uppercase">
                      Founder & Architect
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* "Our Campuses" Section matching 3D liquid glass pods */}
            <div id="campuses-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 mt-2">
              
              {/* Section Header: Our Campuses */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Our Campuses
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                    {displayedColleges.length} Active Campuses
                  </span>
                </div>
              </div>

              {/* Campus Liquid Glass Pods Grid */}
              <div id="campuses-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {displayedColleges.map((col, idx) => {
                  const displayLogo = resolveCollegeLogo(col.logo, col);
                  const bgImg = getCampusCardImage(col, idx);
                  return (
                    <div
                      key={col.id}
                      onClick={() => {
                        setSelectedCollege({ ...col, logo: displayLogo });
                        setCollegeName(col.shortName || col.name || col.code);
                        setError('');
                        if (email && col.domains && !col.domains.some(d => email.toLowerCase().includes(d.toLowerCase()))) {
                          setEmail('');
                        }
                      }}
                      className="group relative rounded-[28px] p-2 bg-gradient-to-b from-white/90 via-white/40 to-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.12)] ring-1 ring-white/90 hover:shadow-[0_25px_60px_rgba(99,102,241,0.25)] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                    >
                      {/* Inner Glass Display Window */}
                      <div className="relative h-56 sm:h-60 rounded-[22px] overflow-hidden flex flex-col justify-between p-5">
                        
                        {/* High-Resolution 3D Render / Photography */}
                        <img
                          src={bgImg}
                          alt={col.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Readability dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent pointer-events-none" />

                        {/* Specular curved glass sheen highlight */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 opacity-70 pointer-events-none" />

                        {/* Top-Left Insignia Emblem Badge */}
                        <div className="relative z-10 w-11 h-11 rounded-xl bg-white p-1.5 shadow-xl flex items-center justify-center shrink-0 border border-white/60 group-hover:scale-105 transition-transform">
                          {displayLogo && (displayLogo.startsWith('/') || displayLogo.startsWith('http') || displayLogo.includes('.png')) ? (
                            <img src={displayLogo} alt={col.shortName || col.name} className="w-full h-full object-contain filter drop-shadow-sm" />
                          ) : (
                            <span className="text-xl">{displayLogo || '🏛️'}</span>
                          )}
                        </div>

                        {/* Bottom Title, Location Pin & Circular Glass Launch Arrow Button */}
                        <div className="relative z-10 flex items-end justify-between gap-4 w-full">
                          <div className="min-w-0 pr-2">
                            <h3 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2 drop-shadow-md group-hover:text-indigo-200 transition-colors">
                              {col.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1.5 font-medium drop-shadow-sm">
                              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span className="truncate">{col.location || 'Andhra Pradesh'}</span>
                            </div>
                          </div>

                          <div className="w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#4F46E5] group-hover:scale-110 transition-all duration-300 shadow-lg shrink-0">
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-6 px-4 min-h-[85vh] relative z-10">
            {/* Ambient background campus photography backdrop */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <img 
                src={getCampusCardImage(selectedCollege, 0)} 
                alt="" 
                className="w-full h-full object-cover opacity-25 blur-sm scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-indigo-50/80" />
            </div>

            {/* Apple Vision Liquid Glassmorphic Modal Card */}
            <div className="relative w-full max-w-[490px] rounded-[38px] p-6 sm:p-8 bg-white/80 backdrop-blur-3xl border border-white/90 shadow-[0_25px_70px_rgba(124,58,237,0.16)] ring-1 ring-white/95 overflow-hidden animate-fade-in-up">
              
              {/* Bottom liquid purple decorative wave glows */}
              <div className="absolute -bottom-10 -left-10 w-44 h-24 bg-gradient-to-tr from-violet-500/25 to-indigo-400/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-44 h-24 bg-gradient-to-tl from-indigo-500/25 to-purple-400/10 rounded-full blur-xl pointer-events-none" />

              {/* Top Bar: Brand Left | Change Portal & College Pill Right */}
              <div className="flex items-center justify-between w-full mb-5">
                <div className="flex items-center gap-2.5 select-none">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                    <Realistic3DLogo size="sm" showGlow={false} interactive={false} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                      Lumixora
                    </span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      STUDENT OS • VYOMRA
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCollege(null);
                      setError('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs cursor-pointer"
                    title="Change Selected Portal"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                    <span>Change Portal</span>
                  </button>
                </div>
              </div>

              {/* Title with Floating 3D Cap/Crown & Sparkles */}
              <div className="relative flex flex-col items-center text-center my-3">
                {authMode === 'founder' ? (
                  <div className="absolute -left-1 -top-2 w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center transform -rotate-12 pointer-events-none hidden sm:flex">
                    <Crown className="w-5 h-5 text-amber-950" />
                  </div>
                ) : (
                  <div className="absolute -left-1 -top-2 w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center transform -rotate-12 pointer-events-none hidden sm:flex">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="absolute -right-1 top-0 text-violet-500 animate-pulse pointer-events-none hidden sm:block">
                  <Sparkles className="w-4 h-4" />
                </div>

                <h2 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight leading-tight">
                  {isLogin ? 'Sign In ' : 'Create Account '}
                  <span className={authMode === 'founder' ? "text-amber-600" : "text-violet-600"}>
                    ({authMode === 'founder' ? 'Founder Console' : (authMode === 'faculty' ? 'Faculty' : (authMode === 'intern' ? 'Lumixora Intern' : 'Student'))})
                  </span>
                </h2>
                <p className="text-slate-500 text-xs font-medium mt-1 max-w-sm">
                  {authMode === 'founder' ? 'Lumixora Executive Office // Root Administration' : selectedCollege.name}
                </p>
              </div>

              {/* Institutional Shield & Fee Status Card / Founder Executive Access Card */}
              {(() => {
                const primaryDomain = selectedCollege?.domains?.[0] || 'gprec.ac.in';
                const campusPhoto = getCampusCardImage(selectedCollege, 0);

                if (authMode === 'founder') {
                  return (
                    <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-yellow-50/90 p-3.5 mb-5 flex items-center justify-between gap-3 shadow-xs relative overflow-hidden">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <strong className="block font-bold text-amber-950 text-xs leading-tight">
                              Lumixora Executive Office // Root Access
                            </strong>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-500/30 text-[10px] font-bold">
                              👑 Root Clearance (Owner)
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-amber-900/80">
                            Welcome back, Shaik Sowban. Sign in with your registered founder email and root master passcode to access the Executive Administration Console.
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:block shrink-0">
                        <img 
                          src="/images/founder_hero.png?v=4" 
                          alt="Founder" 
                          className="w-14 h-14 object-cover rounded-full shadow-md border-2 border-white ring-2 ring-amber-300/60"
                        />
                      </div>
                    </div>
                  );
                }

                if (authMode === 'intern') {
                  return (
                    <div className="rounded-2xl border border-emerald-300/60 bg-gradient-to-r from-emerald-50/85 via-teal-50/80 to-cyan-50/85 p-3.5 mb-5 flex items-center justify-between gap-3 shadow-xs relative overflow-hidden">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <strong className="block font-bold text-slate-800 text-xs leading-tight">
                              Lumixora Engineering Internship Track
                            </strong>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 text-[10px] font-bold">
                              ⚡ Verified Intern Track (₹0 Fee)
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600">
                            Sign in with your assigned <strong className="text-emerald-700 font-mono">Intern Ref ID</strong> or registered email, and secure access passcode.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="rounded-2xl border border-emerald-300/60 bg-gradient-to-r from-emerald-50/85 via-teal-50/80 to-cyan-50/85 p-3.5 mb-5 flex items-center justify-between gap-3 shadow-xs relative overflow-hidden">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <strong className="block font-bold text-slate-800 text-xs leading-tight">
                            Verified Campus Access
                          </strong>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold inline-flex items-center gap-1">
                            <span>⚡</span> One-Time Access Fee
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          Full institutional platform access with a one-time <strong className="text-emerald-700 font-bold">₹10 registration/login pass</strong>. Please sign in with your official <strong className="text-emerald-700 underline font-mono">@{primaryDomain}</strong> email.
                        </p>
                      </div>
                    </div>

                    {/* Campus Building Photo */}
                    {campusPhoto && (
                      <div className="hidden sm:block shrink-0">
                        <img 
                          src={campusPhoto} 
                          alt="" 
                          className="w-24 sm:w-28 h-18 sm:h-20 object-cover object-center rounded-xl shadow-md border-2 border-white"
                        />
                      </div>
                    )}
                  </div>
                );
              })()}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-2xl mb-5 text-xs text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                  {(error.includes('Reset') || error.includes('password') || error.includes('Password') || error.includes('temporary')) && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email.trim() || '');
                          setShowForgotPassword(true);
                        }}
                        className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-black transition-all border border-amber-300 inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        🔑 1-Click Reset / Create New Password
                      </button>
                    </div>
                  )}
                </div>
              )}

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-2xl mb-5 text-xs text-center font-medium">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {!isLogin && (
                  <>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Full Name</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-white/70 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-2xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-xs"
                        placeholder="e.g. Mohammed Sowban"
                      />
                    </div>

                    {authMode === 'student' ? (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Roll Number</label>
                            <input
                              type="text"
                              value={rollNumber}
                              onChange={(e) => setRollNumber(e.target.value)}
                              required
                              className="w-full bg-white/70 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-2xl px-3 py-2.5 text-sm text-slate-900 uppercase font-mono outline-none shadow-xs"
                              placeholder="249XA33106"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Branch / Dept</label>
                            <input
                              type="text"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              required
                              className="w-full bg-white/70 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-2xl px-3 py-2.5 text-sm text-slate-900 outline-none shadow-xs"
                              placeholder="CSE"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Year of Study</label>
                            <select
                              value={yearOfStudy}
                              onChange={(e) => setYearOfStudy(e.target.value)}
                              required
                              className="w-full bg-white/70 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-violet-500 rounded-2xl px-3 py-2.5 text-sm text-slate-900 outline-none shadow-xs"
                            >
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Semester</label>
                            <select
                              value={semester}
                              onChange={(e) => setSemester(e.target.value)}
                              required
                              className="w-full bg-white/70 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-violet-500 rounded-2xl px-3 py-2.5 text-sm text-slate-900 outline-none shadow-xs"
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
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Faculty Designation</label>
                          <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            required
                            className="w-full bg-white/70 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-violet-500 rounded-2xl px-4 py-2.5 text-sm text-slate-900 outline-none shadow-xs"
                            placeholder="Assistant Professor"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number</label>
                          <input
                            type="text"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                            className="w-full bg-white/70 hover:bg-white focus:bg-white border border-slate-200/90 focus:border-violet-500 rounded-2xl px-4 py-2.5 text-sm text-slate-900 outline-none shadow-xs"
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Email Input Field */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {authMode === 'founder'
                        ? 'Founder Official Email'
                        : (authMode === 'intern' 
                            ? 'Intern ID (e.g. LMX-B01-XXXX) or Registered Email' 
                            : 'Official Campus Email'
                          )
                      }
                    </span>
                  </label>
                  <div className="relative flex items-center bg-white/70 hover:bg-white focus-within:bg-white border border-slate-200/90 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 rounded-2xl shadow-xs transition-all">
                    <Mail className="w-4 h-4 text-slate-400 ml-4 shrink-0" />
                    <input
                      type={authMode === 'intern' ? 'text' : 'email'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-mono outline-none"
                      placeholder={authMode === 'intern' ? 'LMX-B01-4783 or registered email' : `rollnumber@${selectedCollege?.domains?.[0] || 'gprec.ac.in'}`}
                    />
                  </div>

                  {/* Dynamic Auto-Detected ID Badge */}
                  {detectedProfile && detectedProfile.isInstitutional && (
                    <div className="mt-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-[11px] text-emerald-800 animate-fade-in">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{detectedProfile.college}</span>
                      </div>
                      <span className="bg-emerald-500/20 px-2 py-0.5 rounded-md font-mono text-[10px] text-emerald-900 font-bold">
                        {detectedProfile.department} • {detectedProfile.year}
                      </span>
                    </div>
                  )}
                </div>

                {/* Password Input Field */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{authMode === 'founder' ? 'Founder Root Passcode' : (authMode === 'intern' ? 'Access Passcode / PIN' : 'Password')}</span>
                  </label>
                  <div className="relative flex items-center bg-white/70 hover:bg-white focus-within:bg-white border border-slate-200/90 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 rounded-2xl shadow-xs transition-all">
                    <Lock className="w-4 h-4 text-slate-400 ml-4 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-mono outline-none pr-11"
                      placeholder={authMode === 'intern' ? 'LMX@4783 or PIN' : '••••••••'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Live Password Strength Meter */}
                  {!isLogin && password && (
                    <div className="mt-2.5 space-y-1.5 animate-fade-in">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-500">Security Strength:</span>
                        <span className={passwordStrength.text}>{passwordStrength.label}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
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
                    <label className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer"
                      />
                      <span className="font-medium">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setResetEmail(email);
                        setResetError('');
                      }}
                      className="text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline transition-colors bg-transparent border-none cursor-pointer"
                    >
                      Forgot password? →
                    </button>
                  </div>
                )}

                {!isLogin && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Campus Ambassador Referral Code</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">Optional</span>
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
                        className="w-full px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white focus:bg-white border border-amber-300/60 text-slate-900 text-xs placeholder:text-slate-400 outline-none focus:border-amber-500 font-mono tracking-wider transition-all shadow-xs"
                      />
                      {referralCode ? (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <span>✨ Applied</span>
                        </span>
                      ) : (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                          REF CODE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 pl-1">
                      Referred by a Campus Ambassador? Enter their code for verified campus attribution.
                    </p>
                  </div>
                )}

                {!isLogin && !isExemptFromPayment(email) && (
                  <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 flex items-center justify-between shadow-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-cyan-600" /> One-Time Registration Fee:
                    </span>
                    <span className="font-black text-cyan-900 bg-cyan-200/60 px-2.5 py-1 rounded-lg">₹10.00 Only</span>
                  </div>
                )}

                {/* Primary Action Button (Gradient Pill with Specular Sheen & Circular Arrow) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 hover:from-violet-500 hover:to-blue-600 shadow-[0_12px_30px_rgba(99,102,241,0.38)] hover:shadow-[0_16px_36px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer text-sm group"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2 font-bold animate-pulse text-white">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                    </span>
                  ) : (
                    <>
                      <span className="tracking-wide">
                        {authMode === 'founder'
                          ? 'Sign In to Executive Console'
                          : (isLogin 
                              ? 'Sign In to Workspace' 
                              : (isExemptFromPayment(email) ? 'Create Verified Account (Approved)' : 'Pay ₹10 & Create Verified Account'))}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Social Auth Divider */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-3 text-slate-400 text-[10px] uppercase tracking-widest font-extrabold">
                  OR 1-TAP LOGIN
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Frosted Google 1-Tap Login Button */}
              <div className="mb-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleOAuthSignIn('google')}
                  className="w-full py-2.5 px-4 rounded-2xl font-bold text-slate-700 bg-white/80 hover:bg-white border border-slate-200/90 hover:border-violet-300 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer text-xs"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Toggle Login / Register */}
              <div className="mt-5 text-center text-slate-500 text-xs">
                {isLogin ? "New to Vyomra? " : "Already have an account? "}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-violet-600 font-bold hover:underline focus:outline-none cursor-pointer ml-1"
                >
                  {isLogin ? 'Register your roll number' : 'Sign in here'}
                </button>
              </div>

              {/* Bottom Decorative Ribbon */}
              <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 tracking-[0.25em]">
                <div className="h-px w-8 bg-slate-200/80"></div>
                <span>LEARN • GROW • ACHIEVE</span>
                <div className="h-px w-8 bg-slate-200/80"></div>
              </div>

              {/* Official Android APK Download Pill */}
              <div className="mt-4 pt-3 flex flex-col items-center">
                <a 
                  href="https://ykuyzkhhnltjccyzduap.supabase.co/storage/v1/object/public/academic_resources/app/Vyomra.apk" 
                  download="Vyomra.apk"
                  className="w-full py-2 px-3 rounded-xl text-center text-[11px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Cpu className="w-3.5 h-3.5 text-violet-600" />
                  <span>Download Official Android App (APK)</span>
                </a>
              </div>

            </div>
          </div>
        )}
      </main>

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
