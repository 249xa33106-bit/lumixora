import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Trophy, 
  Search, 
  Filter, 
  Download, 
  Phone, 
  Mail, 
  Globe, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X, 
  Sparkles, 
  Building2, 
  User, 
  GraduationCap, 
  Send,
  Star,
  FileText,
  RotateCcw,
  Printer,
  Copy,
  Check,
  Award,
  ShieldCheck,
  Share2,
  Calendar,
  Users,
  PlusCircle,
  UserPlus,
  Layers,
  Briefcase
} from 'lucide-react';
import { db } from '../config/firebase';
import { supabase } from '../config/supabase';
import { internshipDb } from '../services/internshipDb';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs, setDoc } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

const COLLEGE_OPTIONS = [
  { id: 'gprec', name: 'G. Pulla Reddy Engineering College (Autonomous), Kurnool', short: 'GPREC Kurnool' },
  { id: 'annamacharya', name: 'Annamacharya University, Rajampet', short: 'AU Rajampet' },
  { id: 'ashoka', name: "Ashoka Women's Engineering College, Kurnool", short: 'Ashoka Kurnool' },
  { id: 'bits', name: 'Bheema Institute Of Technology & Science, Adoni', short: 'BITS Adoni' },
  { id: 'other', name: 'Other College / University', short: 'Other' }
];

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'CSE - Artificial Intelligence & Machine Learning (AI & ML)',
  'CSE - Data Science (DS)',
  'CSE - Cyber Security / IoT',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Information Technology (IT)',
  'Master of Computer Applications (MCA)',
  'Marketing & Business Studies',
  'Other Science / Engineering Branch'
];

const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year / Final Year',
  'Post-Graduate / MCA'
];

const ROLE_TRACKS = [
  'Campus Ambassador Lead',
  'Marketing Intern',
  'Software Testing Intern',
  'Research Intern',
  'Content Creation Intern'
];

export default function FounderAmbassadorManager({ allUsers = [] }) {
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [referralsList, setReferralsList] = useState([]);
  const [supabaseReferrals, setSupabaseReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' (all 34+ live candidates) | 'ambassadors' (appointed campus ambassadors)

  // Modals State
  const [offerLetterApp, setOfferLetterApp] = useState(null);
  const [viewingReferredApp, setViewingReferredApp] = useState(null);
  const [referredSearch, setReferredSearch] = useState('');
  const [copiedLinkAppId, setCopiedLinkAppId] = useState(null);
  const [mailApp, setMailApp] = useState(null);
  const [mailTemplate, setMailTemplate] = useState('offer'); // 'offer' | 'interview' | 'onboarding'
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedOffer, setCopiedOffer] = useState(false);

  // Manual Candidate Registration State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'G. Pulla Reddy Engineering College (Autonomous), Kurnool',
    customCollege: '',
    department: 'Computer Science & Engineering (CSE)',
    customDepartment: '',
    year: '2nd Year',
    rollNumber: '',
    roleTrack: 'Campus Ambassador Lead',
    whyJoin: 'Nominated as Student Representative & Campus Ambassador Lead for Lumixora'
  });
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Real-time listener for ambassador_referrals across Firestore (internshipDb + db) & Supabase notifications
  useEffect(() => {
    const unsubs = [];
    const collectedFromFs = new Map();

    const attachFsListener = (targetDb, dbName) => {
      if (!targetDb) return;
      try {
        const unsub = onSnapshot(
          collection(targetDb, 'ambassador_referrals'),
          (snapshot) => {
            snapshot.forEach((d) => {
              const data = d.data() || {};
              const key = `${dbName}_${d.id}`;
              collectedFromFs.set(key, { id: d.id, ...data });
            });
            setReferralsList(Array.from(collectedFromFs.values()));
          },
          (err) => console.warn(`Referrals onSnapshot notice for ${dbName}:`, err)
        );
        unsubs.push(unsub);
      } catch (e) {}
    };

    if (internshipDb) attachFsListener(internshipDb, 'internshipDb');
    if (db && db !== internshipDb) attachFsListener(db, 'db');

    // Fetch and sync Supabase founder_notifications for ambassador referrals
    const syncSupabaseReferrals = async () => {
      if (!supabase || typeof supabase.from !== 'function') return;
      try {
        const { data: notifs } = await supabase
          .from('founder_notifications')
          .select('*')
          .eq('type', 'ambassador_referral')
          .order('created_at', { ascending: false });

        if (notifs && notifs.length > 0) {
          const mapped = notifs.map(n => {
            const meta = n.meta || {};
            const details = meta.details || n.message || '';
            let code = meta.code || meta.referralCode || '';
            if (!code && details.includes('using Code [')) {
              const m = details.match(/using Code \[([^\]]+)\]/i);
              if (m) code = m[1];
            }
            if (!code && details.includes('[')) {
              const m = details.match(/\[([A-Z0-9\-_]+)\]/i);
              if (m) code = m[1];
            }

            return {
              id: `notif_${n.id}`,
              referralCode: code,
              code,
              userEmail: (meta.email || n.email || '').toLowerCase().trim(),
              userName: meta.name || n.name || n.title?.replace('Ambassador Referral:', '').trim() || 'Verified Scholar',
              college: meta.college || n.college || 'Academic Institution',
              department: meta.department || 'Engineering',
              year: meta.year || '1st Year',
              registeredAt: meta.createdAt || n.created_at || new Date().toISOString(),
              source: 'Verified Referral'
            };
          });
          setSupabaseReferrals(mapped);
        }
      } catch (err) {
        console.warn("Supabase referrals fetch notice:", err);
      }
    };

    syncSupabaseReferrals();

    let channel = null;
    if (supabase && typeof supabase.channel === 'function') {
      try {
        channel = supabase
          .channel('ambassador_mgr_referrals')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'founder_notifications' }, () => {
            syncSupabaseReferrals();
          })
          .subscribe();
      } catch (e) {}
    }

    return () => {
      unsubs.forEach(u => typeof u === 'function' && u());
      if (channel) channel.unsubscribe();
    };
  }, []);

  // Merged combined referrals list from all sources
  const combinedReferrals = useMemo(() => {
    const map = new Map();
    (referralsList || []).forEach(r => {
      const email = (r.userEmail || r.email || '').toLowerCase().trim();
      const code = (r.referralCode || r.code || '').toUpperCase().trim();
      if (email && code) map.set(`${email}_${code}`, r);
    });
    (supabaseReferrals || []).forEach(r => {
      const email = (r.userEmail || r.email || '').toLowerCase().trim();
      const code = (r.referralCode || r.code || '').toUpperCase().trim();
      if (email && code) map.set(`${email}_${code}`, r);
    });
    return Array.from(map.values());
  }, [referralsList, supabaseReferrals]);

  // Standardize application document into unified structure (strictly Campus Ambassadors)
  const isAmbassadorApplication = (data, id) => {
    if (!data) return false;
    const docId = String(data.id || id || data.appId || '');
    const appId = String(data.appId || data.refId || data.id || docId || '');
    const role = String(data.preferredRole || data.role || '').toLowerCase();
    const title = String(data.preferredRoleTitle || '').toLowerCase();
    const track = String(data.track || '').toLowerCase();
    const type = String(data.type || '').toLowerCase();

    return Boolean(
      data.isCampusAmbassador === true || 
      type === 'campus_ambassador' || 
      type === 'ambassador_application' ||
      role === 'campus_ambassador' || 
      role === 'ambassador_applicant' ||
      role.includes('ambassador') || 
      track.includes('ambassador') ||
      track === 'campus ambassador lead' ||
      title.includes('ambassador') ||
      appId.startsWith('LMX-CA') || 
      appId.includes('CA-2026') ||
      docId.startsWith('LMX-CA') ||
      docId.includes('CA-2026')
    );
  };

  const normalizeApplication = (data, id) => {
    if (!data) return null;
    const docId = data.id || id || data.appId;
    const appId = data.appId || data.refId || data.id || docId;

    // Strict filter: ONLY show those who applied for Campus Ambassador!
    if (!isAmbassadorApplication(data, id)) {
      return null;
    }

    const name = data.fullName || data.name || 'Candidate';
    const email = (data.email || '').toLowerCase().trim();
    const phone = data.phone || data.whatsapp || '';
    const college = data.college || data.university || (email.includes('gprec.ac.in') ? 'G. Pulla Reddy Engineering College (Autonomous), Kurnool' : 'Academic Institution');
    const department = data.department || data.branch || 'Engineering';
    const year = data.year || 'Student';
    const rollNumber = data.rollNumber || (email.match(/^[0-9a-zA-Z]+@gprec/) ? email.split('@')[0].toUpperCase() : 'N/A');
    const linkedin = data.linkedin || '';
    const whyJoin = data.whyJoin || data.whyHire || data.notes || (data.preferredRoleTitle ? `Role Track: ${data.preferredRoleTitle}` : 'Applied via Lumixora Campus Ambassador Portal');
    const priorExperience = data.priorExperience || data.skills || data.portfolioUrl || 'Active Applicant';
    const status = data.status || 'pending_review';
    const appliedAt = data.createdAt || data.appliedAt || new Date().toISOString();
    const preferredRoleTitle = data.preferredRoleTitle || 'Campus Ambassador Lead';

    return {
      ...data,
      id: docId,
      appId,
      notifId: data.notifId || null,
      name,
      fullName: name,
      email,
      phone,
      whatsapp: phone,
      college,
      department,
      year,
      rollNumber,
      linkedin,
      whyJoin,
      priorExperience,
      status,
      appliedAt,
      isCampusAmbassador: true,
      preferredRoleTitle,
      resumeUrl: data.resumeUrl || data.driveLink || null
    };
  };

  // Merge remote applications with local storage cache to guarantee 100% visibility
  const mergeLocalApplications = (remoteList = []) => {
    const map = new Map();
    (remoteList || []).forEach(item => {
      const norm = normalizeApplication(item, item.id || item.appId);
      if (norm && (norm.appId || norm.id)) {
        map.set(norm.appId || norm.id, norm);
      }
    });

    try {
      const allLocal = JSON.parse(localStorage.getItem('lumixora_all_ambassador_apps') || '[]');
      allLocal.forEach(item => {
        const norm = normalizeApplication(item, item.appId || item.id);
        const id = norm?.appId || norm?.id;
        if (id && !map.has(id)) map.set(id, norm);
      });

      const singleLocal = JSON.parse(localStorage.getItem('lumixora_campus_ambassador_app') || localStorage.getItem('lumixora_ca_application') || 'null');
      if (singleLocal) {
        const norm = normalizeApplication(singleLocal, singleLocal.appId || singleLocal.id);
        const id = norm?.appId || norm?.id;
        if (id && !map.has(id)) map.set(id, norm);
      }
    } catch (e) {}

    const list = Array.from(map.values());
    list.sort((a, b) => {
      const timeA = new Date(a.appliedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.appliedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
    return list;
  };

  // Parse notification record from Supabase into unified Ambassador Application
  const parseNotificationToAmbassadorApp = (notif) => {
    if (!notif) return null;
    const meta = notif.meta || {};
    const details = meta.details || notif.message || '';
    const message = notif.message || '';

    // Extract appId (e.g. LMX-CA-2026-KKMB)
    const appIdMatch = (meta.appId || details || message).match(/\[?(LMX-CA-[A-Za-z0-9-]+)\]?/i);
    const appId = meta.appId || (appIdMatch ? appIdMatch[1] : `LMX-CA-2026-${notif.id}`);

    // Extract phone (e.g. 7989342700)
    const phoneMatch = (meta.phone || details || message).match(/WhatsApp:\s*([0-9+ ]+)/i);
    const phone = meta.phone || (phoneMatch ? phoneMatch[1].trim() : '');

    // Extract candidate name
    const rawName = meta.name || (notif.title ? notif.title.replace(/^Ambassador Application:\s*/i, '').trim() : 'Candidate');
    const name = rawName.replace(/\{.*\}/g, '').trim() || 'Candidate';

    return {
      id: appId,
      appId,
      notifId: notif.id,
      name,
      fullName: name,
      email: (meta.email || '').toLowerCase().trim(),
      phone,
      whatsapp: phone,
      college: meta.college || 'G. Pulla Reddy Engineering College (Autonomous), Kurnool',
      department: meta.department || 'Computer Science & Engineering (CSE)',
      branch: meta.department || 'CSE',
      year: meta.year || '2nd Year',
      rollNumber: meta.rollNumber || '',
      linkedin: meta.linkedin || '',
      whyJoin: meta.whyJoin || details || 'Applied via Lumixora Campus Ambassador Portal',
      priorExperience: meta.priorExperience || 'Active Applicant',
      status: meta.status || 'pending_review',
      appliedAt: notif.created_at || meta.createdAt || new Date().toISOString(),
      isCampusAmbassador: true,
      type: 'campus_ambassador',
      preferredRole: 'campus_ambassador',
      preferredRoleTitle: 'Campus Ambassador Lead',
      track: 'Campus Ambassador Lead'
    };
  };

  // Fetch all applications across Supabase and internshipDb
  const fetchAllAmbassadorApplications = async () => {
    try {
      let combined = [];

      // 1. Authoritative Cloud Source: Supabase founder_notifications
      if (supabase && typeof supabase.from === 'function') {
        try {
          const { data: notifs, error } = await supabase
            .from('founder_notifications')
            .select('*')
            .eq('type', 'ambassador_application')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(notifs)) {
            const parsedNotifs = notifs.map(parseNotificationToAmbassadorApp).filter(Boolean);
            combined = [...combined, ...parsedNotifs];
          }
        } catch (sbErr) {
          console.warn('Supabase ambassador fetch notice:', sbErr);
        }
      }

      // 2. Secondary Cloud Source: internshipDb applications (if any)
      if (internshipDb) {
        try {
          const snap = await getDocs(collection(internshipDb, 'applications'));
          snap.forEach(d => {
            const data = d.data();
            if (data && isAmbassadorApplication(data, d.id)) {
              combined.push({ id: d.id, ...data });
            }
          });
        } catch (idbErr) {
          console.warn('internshipDb getDocs notice:', idbErr);
        }
      }

      const merged = mergeLocalApplications(combined);
      setApplications(merged);
    } catch (err) {
      console.warn('Error fetching ambassador applications:', err);
      setApplications(mergeLocalApplications([]));
    } finally {
      setLoading(false);
    }
  };

  // Real-time listener for live applications (Supabase Realtime + internshipDb)
  useEffect(() => {
    fetchAllAmbassadorApplications();

    // 1. Supabase Realtime channel subscription for instant live applicant arrivals
    let channel = null;
    if (supabase && typeof supabase.channel === 'function') {
      try {
        channel = supabase.channel('founder_ambassador_roster_channel')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'founder_notifications' }, () => {
            fetchAllAmbassadorApplications();
          })
          .on('broadcast', { event: 'founder_notification' }, (payload) => {
            if (payload?.payload?.data?.type === 'ambassador_application') {
              fetchAllAmbassadorApplications();
            }
          })
          .subscribe();
      } catch (chErr) {
        console.warn('Supabase channel subscription notice:', chErr);
      }
    }

    // 2. internshipDb onSnapshot listener (if active)
    let unsubscribeFirestore = () => {};
    if (internshipDb) {
      try {
        unsubscribeFirestore = onSnapshot(
          collection(internshipDb, 'applications'),
          (snapshot) => {
            const list = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              if (data && isAmbassadorApplication(data, docSnap.id)) {
                list.push({ id: docSnap.id, ...data });
              }
            });
            if (list.length > 0) {
              setApplications(prev => mergeLocalApplications([...list, ...prev]));
            }
          },
          (err) => {
            console.warn('internshipDb onSnapshot notice:', err);
          }
        );
      } catch (e) {}
    }

    // 3. Listen to window event for instant local submissions
    const handleLocalSubmit = (e) => {
      if (e?.detail) {
        const norm = normalizeApplication(e.detail, e.detail.appId || e.detail.id);
        if (norm) {
          setApplications(prev => mergeLocalApplications([norm, ...prev]));
        }
      }
    };
    window.addEventListener('lumixora_ambassador_submitted', handleLocalSubmit);

    // 4. Polling fallback every 15 seconds to ensure fresh data if tab is kept open
    const pollInterval = setInterval(() => {
      fetchAllAmbassadorApplications();
    }, 15000);

    return () => {
      if (channel) {
        try { supabase.removeChannel(channel); } catch (e) {}
      }
      unsubscribeFirestore();
      window.removeEventListener('lumixora_ambassador_submitted', handleLocalSubmit);
      clearInterval(pollInterval);
    };
  }, []);

  // Safe Clipboard Copy Helper
  const safeCopy = (text, successMsg) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (successMsg) addToast({ message: successMsg, type: 'success' });
        }).catch(() => {
          fallbackCopy(text, successMsg);
        });
      } else {
        fallbackCopy(text, successMsg);
      }
    } catch (e) {
      fallbackCopy(text, successMsg);
    }
  };

  const fallbackCopy = (text, successMsg) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      if (successMsg) addToast({ message: successMsg, type: 'success' });
    } catch (err) {
      if (successMsg) addToast({ message: successMsg, type: 'info' });
    }
  };

  // Status Updater (Instant & 100% Resilient)
  const handleUpdateStatus = async (appId, newStatus) => {
    // 1. Instant local UI update
    setApplications(prev => prev.map(a => (a.id === appId || a.appId === appId) ? { ...a, status: newStatus } : a));

    if (offerLetterApp && (offerLetterApp.id === appId || offerLetterApp.appId === appId)) {
      setOfferLetterApp(prev => ({ ...prev, status: newStatus }));
    }

    // 2. Instant localStorage persistence
    try {
      const allLocal = JSON.parse(localStorage.getItem('lumixora_all_ambassador_apps') || '[]');
      const updatedAll = allLocal.map(a => (a.appId === appId || a.id === appId) ? { ...a, status: newStatus } : a);
      localStorage.setItem('lumixora_all_ambassador_apps', JSON.stringify(updatedAll));

      const singleLocal = JSON.parse(localStorage.getItem('lumixora_campus_ambassador_app') || localStorage.getItem('lumixora_ca_application') || 'null');
      if (singleLocal && (singleLocal.appId === appId || singleLocal.id === appId)) {
        localStorage.setItem('lumixora_campus_ambassador_app', JSON.stringify({ ...singleLocal, status: newStatus }));
        localStorage.setItem('lumixora_ca_application', JSON.stringify({ ...singleLocal, status: newStatus }));
      }
    } catch (e) {}

    addToast({ message: `Applicant marked as "${newStatus.replace('_', ' ').toUpperCase()}".`, type: 'success' });

    // 3. Supabase Cloud Sync
    try {
      const targetApp = applications.find(a => a.id === appId || a.appId === appId);
      if (supabase) {
        if (targetApp?.notifId) {
          const { data: curr } = await supabase.from('founder_notifications').select('meta').eq('id', targetApp.notifId).single();
          if (curr?.meta) {
            await supabase.from('founder_notifications').update({
              meta: { ...curr.meta, status: newStatus }
            }).eq('id', targetApp.notifId);
          }
        } else {
          const { data: matches } = await supabase.from('founder_notifications').select('id, meta').eq('type', 'ambassador_application');
          const matched = matches?.find(m => m.meta?.appId === appId || m.meta?.email === targetApp?.email);
          if (matched) {
            await supabase.from('founder_notifications').update({
              meta: { ...matched.meta, status: newStatus }
            }).eq('id', matched.id);
          }
        }
      }
    } catch (sbErr) {
      console.warn('Supabase status update notice:', sbErr);
    }

    // 4. Background Cloud Sync to internshipDb
    if (internshipDb) {
      updateDoc(doc(internshipDb, 'applications', appId), { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      }).catch(() => {
        setDoc(doc(internshipDb, 'applications', appId), { 
          status: newStatus, 
          updatedAt: new Date().toISOString() 
        }, { merge: true }).catch(() => {});
      });
    }
  };

  // Delete Application (Instant & Resilient)
  const handleDeleteApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    const targetApp = applications.find(a => a.id === appId || a.appId === appId);

    // 1. Instant local UI removal
    setApplications(prev => prev.filter(a => a.id !== appId && a.appId !== appId));

    // 2. Instant localStorage removal
    try {
      const allLocal = JSON.parse(localStorage.getItem('lumixora_all_ambassador_apps') || '[]');
      const updatedAll = allLocal.filter(a => a.appId !== appId && a.id !== appId);
      localStorage.setItem('lumixora_all_ambassador_apps', JSON.stringify(updatedAll));

      const singleLocal = JSON.parse(localStorage.getItem('lumixora_campus_ambassador_app') || localStorage.getItem('lumixora_ca_application') || 'null');
      if (singleLocal && (singleLocal.appId === appId || singleLocal.id === appId)) {
        localStorage.removeItem('lumixora_campus_ambassador_app');
        localStorage.removeItem('lumixora_ca_application');
      }
    } catch (e) {}

    addToast({ message: 'Application deleted.', type: 'info' });

    // 3. Cloud deletion from Supabase
    try {
      if (supabase) {
        if (targetApp?.notifId) {
          await supabase.from('founder_notifications').delete().eq('id', targetApp.notifId);
        } else {
          const { data: matches } = await supabase.from('founder_notifications').select('id, meta').eq('type', 'ambassador_application');
          const matched = matches?.find(m => m.meta?.appId === appId || m.meta?.email === targetApp?.email);
          if (matched) {
            await supabase.from('founder_notifications').delete().eq('id', matched.id);
          }
        }
      }
    } catch (sbErr) {
      console.warn('Supabase delete error:', sbErr);
    }

    // 4. Background deletion from internshipDb
    if (internshipDb) {
      deleteDoc(doc(internshipDb, 'applications', appId)).catch(() => {});
    }
  };

  // Appoint as Campus Ambassador (1-Click Elevation)
  const handleAppointAmbassador = async (app) => {
    const docId = app.id || app.appId;
    const updated = {
      ...app,
      isCampusAmbassador: true,
      type: 'campus_ambassador',
      preferredRole: 'campus_ambassador',
      preferredRoleTitle: 'Campus Ambassador Lead',
      track: 'Campus Ambassador Lead',
      status: 'selected'
    };

    setApplications(prev => prev.map(a => (a.id === docId || a.appId === docId) ? updated : a));

    try {
      const allLocal = JSON.parse(localStorage.getItem('lumixora_all_ambassador_apps') || '[]');
      localStorage.setItem('lumixora_all_ambassador_apps', JSON.stringify([updated, ...allLocal.filter(a => a.id !== docId && a.appId !== docId)]));
      localStorage.setItem('lumixora_campus_ambassador_app', JSON.stringify(updated));
      localStorage.setItem('lumixora_ca_application', JSON.stringify(updated));
    } catch (e) {}

    // Cloud Sync to Supabase
    try {
      if (supabase) {
        if (app.notifId) {
          const { data: curr } = await supabase.from('founder_notifications').select('meta').eq('id', app.notifId).single();
          if (curr?.meta) {
            await supabase.from('founder_notifications').update({
              meta: { ...curr.meta, status: 'selected' }
            }).eq('id', app.notifId);
          }
        } else {
          const { data: matches } = await supabase.from('founder_notifications').select('id, meta').eq('type', 'ambassador_application');
          const matched = matches?.find(m => m.meta?.appId === docId || m.meta?.email === app.email);
          if (matched) {
            await supabase.from('founder_notifications').update({
              meta: { ...matched.meta, status: 'selected' }
            }).eq('id', matched.id);
          }
        }
      }
    } catch (sbErr) {
      console.warn('Supabase appoint sync notice:', sbErr);
    }

    if (internshipDb) {
      setDoc(doc(internshipDb, 'applications', docId), {
        isCampusAmbassador: true,
        type: 'campus_ambassador',
        preferredRole: 'campus_ambassador',
        preferredRoleTitle: 'Campus Ambassador Lead',
        track: 'Campus Ambassador Lead',
        status: 'selected',
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }

    addToast({ message: `Appointed ${app.name} as Official Campus Ambassador!`, type: 'success' });
    setOfferLetterApp(updated);
  };

  // Submit Manual Candidate Registration
  const handleSubmitManual = async (e) => {
    e.preventDefault();
    if (!manualForm.name.trim()) {
      addToast({ message: 'Please enter student full name', type: 'error' });
      return;
    }
    if (!manualForm.phone.trim()) {
      addToast({ message: 'Please enter WhatsApp number', type: 'error' });
      return;
    }
    setIsSubmittingManual(true);
    try {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const appId = `LMX-CA-2026-${randomSuffix}`;
      const finalCollege = manualForm.college === 'other' ? (manualForm.customCollege.trim() || 'Other College') : manualForm.college;
      const finalDept = manualForm.department.includes('Other') ? (manualForm.customDepartment.trim() || 'Engineering') : manualForm.department;
      const cleanPhone = manualForm.phone.replace(/\D/g, '');

      const payload = {
        id: appId,
        appId,
        name: manualForm.name.trim(),
        fullName: manualForm.name.trim(),
        email: manualForm.email.trim().toLowerCase() || `${appId.toLowerCase()}@lumixora.internal`,
        phone: cleanPhone,
        whatsapp: cleanPhone,
        college: finalCollege,
        department: finalDept,
        branch: finalDept,
        year: manualForm.year,
        rollNumber: manualForm.rollNumber.trim() || 'N/A',
        role: 'campus_ambassador',
        preferredRole: 'campus_ambassador',
        preferredRoleTitle: manualForm.roleTrack || 'Campus Ambassador Lead',
        track: 'Campus Ambassador Lead',
        whyJoin: manualForm.whyJoin.trim(),
        priorExperience: 'Direct Founder Appointment',
        status: 'selected',
        isCampusAmbassador: true,
        type: 'campus_ambassador',
        appliedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 1. Optimistic state & local cache
      setApplications(prev => [payload, ...prev.filter(a => a.id !== appId && a.appId !== appId)]);
      try {
        const allLocal = JSON.parse(localStorage.getItem('lumixora_all_ambassador_apps') || '[]');
        localStorage.setItem('lumixora_all_ambassador_apps', JSON.stringify([payload, ...allLocal.filter(a => a.id !== appId && a.appId !== appId)]));
      } catch (e) {}

      // 2. Save directly to Supabase founder_notifications
      if (supabase && typeof supabase.from === 'function') {
        try {
          await supabase.from('founder_notifications').insert([{
            title: `Ambassador Application: ${payload.name}`,
            message: `Campus Ambassador Application [${payload.appId}] · ${payload.college} (${payload.department}) · WhatsApp: ${payload.phone}`,
            type: 'ambassador_application',
            meta: {
              id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              appId: payload.appId,
              name: payload.name,
              role: 'ambassador_applicant',
              email: payload.email,
              phone: payload.phone,
              college: payload.college,
              department: payload.department,
              year: payload.year,
              rollNumber: payload.rollNumber,
              status: 'selected',
              whyJoin: payload.whyJoin,
              details: `Campus Ambassador Application [${payload.appId}] · ${payload.college} (${payload.department}) · WhatsApp: ${payload.phone}`,
              createdAt: payload.appliedAt
            },
            read: false,
            created_at: payload.appliedAt
          }]);
        } catch (sbErr) {
          console.warn('Supabase manual ambassador insert notice:', sbErr);
        }
      }

      // 3. Save to internshipDb (non-blocking)
      if (internshipDb) {
        setDoc(doc(internshipDb, 'applications', appId), payload).catch(() => {});
      }

      setShowManualModal(false);
      setIsSubmittingManual(false);
      addToast({ message: `Successfully registered and appointed ${payload.name}!`, type: 'success' });
      setOfferLetterApp(payload);

      // Reset form
      setManualForm({
        name: '',
        email: '',
        phone: '',
        college: 'G. Pulla Reddy Engineering College (Autonomous), Kurnool',
        customCollege: '',
        department: 'Computer Science & Engineering (CSE)',
        customDepartment: '',
        year: '2nd Year',
        rollNumber: '',
        roleTrack: 'Campus Ambassador Lead',
        whyJoin: 'Nominated as Student Representative & Campus Ambassador Lead for Lumixora'
      });
    } catch (err) {
      console.error('Manual registration error:', err);
      setIsSubmittingManual(false);
      addToast({ message: 'Saved locally. Please ensure cloud connection is active.', type: 'warning' });
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (applications.length === 0) {
      addToast({ message: 'No applications to export.', type: 'info' });
      return;
    }

    const headers = [
      'Application ID',
      'Candidate Name',
      'Email',
      'Phone (WhatsApp)',
      'College',
      'Department',
      'Year',
      'Roll Number',
      'Role Track',
      'Is Ambassador',
      'Status',
      'Applied At'
    ];

    const rows = filteredApplications.map(app => [
      `"${app.appId || app.id || ''}"`,
      `"${(app.name || '').replace(/"/g, '""')}"`,
      `"${app.email || ''}"`,
      `"${app.phone || ''}"`,
      `"${(app.college || '').replace(/"/g, '""')}"`,
      `"${(app.department || '').replace(/"/g, '""')}"`,
      `"${app.year || ''}"`,
      `"${app.rollNumber || ''}"`,
      `"${app.preferredRoleTitle || app.role || ''}"`,
      `"${app.isCampusAmbassador ? 'Yes' : 'No'}"`,
      `"${app.status || 'pending_review'}"`,
      `"${app.appliedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lumixora_Applications_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ message: `Exported ${filteredApplications.length} applicants to CSV.`, type: 'success' });
  };

  // Unique colleges for filter dropdown
  const uniqueColleges = useMemo(() => {
    const set = new Set();
    applications.forEach(a => {
      if (a.college) set.add(a.college);
    });
    return Array.from(set);
  }, [applications]);

  // Filtered applications based on activeTab (status) and search/dropdown filters
  const filteredApplications = useMemo(() => {
    let base = applications;
    if (activeTab === 'ambassadors' || activeTab === 'selected') {
      base = applications.filter(a => a.status === 'selected');
    } else if (activeTab === 'shortlisted') {
      base = applications.filter(a => a.status === 'shortlisted');
    } else if (activeTab === 'pending_review' || activeTab === 'pending') {
      base = applications.filter(a => !a.status || a.status === 'pending_review' || a.status === 'pending');
    }

    return base.filter(app => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (app.name && app.name.toLowerCase().includes(q)) ||
        (app.email && app.email.toLowerCase().includes(q)) ||
        (app.phone && app.phone.includes(q)) ||
        (app.appId && app.appId.toLowerCase().includes(q)) ||
        (app.rollNumber && app.rollNumber.toLowerCase().includes(q)) ||
        (app.college && app.college.toLowerCase().includes(q));

      const matchCollege = collegeFilter === 'ALL' || app.college === collegeFilter;
      const matchStatus = statusFilter === 'ALL' || (app.status || 'pending_review') === statusFilter;

      return matchSearch && matchCollege && matchStatus;
    });
  }, [applications, activeTab, searchQuery, collegeFilter, statusFilter]);

  // Statistics strictly for Campus Ambassadors
  const stats = useMemo(() => {
    const total = applications.length;
    const selected = applications.filter(a => a.status === 'selected').length;
    const pending = applications.filter(a => !a.status || a.status === 'pending_review' || a.status === 'pending').length;
    const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
    return { total, ambassadors: selected, selected, pending, shortlisted };
  }, [applications]);

  // Helper to extract referred scholars for any ambassador
  const getReferredScholars = (app) => {
    if (!app) return [];
    const code = (app.appId || app.id || '').toUpperCase().trim();
    const candidateEmail = (app.email || '').toLowerCase().trim();
    const candidateName = (app.name || '').toLowerCase().trim();

    const map = new Map();

    // 1. Match from combined referrals (Firestore + Supabase notifications)
    (combinedReferrals || []).forEach((r) => {
      const rCode = (r.referralCode || r.code || '').toUpperCase().trim();
      if (rCode && code && (rCode === code || rCode.includes(code) || code.includes(rCode))) {
        const email = (r.userEmail || r.email || '').toLowerCase().trim();
        const scholarName = (r.userName || r.name || '').trim();
        const isSelf = email && email === candidateEmail && (!scholarName || scholarName.toLowerCase() === candidateName);
        if (!isSelf && (email || scholarName)) {
          const key = email || `ref_${scholarName.toLowerCase()}`;
          map.set(key, {
            name: scholarName || 'Verified Scholar',
            email: email || 'Verified Referral',
            college: r.college || 'Academic Institution',
            department: r.department || r.branch || 'Engineering',
            year: r.year || '1st Year',
            registeredAt: r.registeredAt || (r.timestamp?.toDate ? r.timestamp.toDate().toISOString() : new Date().toISOString()),
            source: 'Verified Referral'
          });
        }
      }
    });

    // 2. Match from all registered platform users
    (allUsers || []).forEach((u) => {
      const uRef = (u.referredBy || u.referred_by || u.referralCode || u.referral_code || u.metadata?.referredBy || u.metadata?.referralCode || '').toUpperCase().trim();
      const rawName = typeof u.rawName === 'string' ? u.rawName : (typeof u.name === 'string' && u.name.includes('{') ? u.name : '');
      const rawNameMatch = code && rawName && rawName.toUpperCase().includes(code);

      if ((uRef && (uRef === code || uRef.includes(code) || code.includes(uRef))) || rawNameMatch) {
        const email = (u.email || '').toLowerCase().trim();
        const scholarName = (u.name || u.displayName || '').replace(/\{.*\}/, '').trim();
        const isSelf = email && email === candidateEmail && (!scholarName || scholarName.toLowerCase() === candidateName);
        if (!isSelf) {
          const key = email || `user_${u.id}`;
          if (!map.has(key)) {
            map.set(key, {
              name: scholarName || 'Verified Scholar',
              email: email || 'Platform Scholar',
              college: u.college || u.collegeName || 'Academic Institution',
              department: u.department || u.branch || 'Engineering',
              year: u.year || u.yearOfStudy || '1st Year',
              registeredAt: u.created_at || u.createdAt || new Date().toISOString(),
              source: 'Platform Scholar'
            });
          }
        }
      }
    });

    return Array.from(map.values());
  };

  // Referral Leaderboard computation
  const ambassadorLeaderboard = useMemo(() => {
    const scored = applications.map((app) => {
      const list = getReferredScholars(app);
      return {
        ...app,
        referredCount: list.length,
        referredList: list
      };
    });
    scored.sort((a, b) => b.referredCount - a.referredCount);
    return scored;
  }, [applications, combinedReferrals, allUsers]);

  // Total unique referrals across all ambassadors
  const totalNetworkReferrals = useMemo(() => {
    const allEmails = new Set();
    applications.forEach((app) => {
      const list = getReferredScholars(app);
      list.forEach((s) => allEmails.add(s.email || s.name));
    });
    return allEmails.size;
  }, [applications, combinedReferrals, allUsers]);

  // Handle Opening Mail Modal with Template
  const handleOpenMailModal = (app, template = 'offer') => {
    setMailApp(app);
    setMailTemplate(template);
    const candidateName = app.name || 'Candidate';
    const appId = app.appId || app.id || 'N/A';
    const college = app.college || 'your college';
    const referralLink = `https://lumixora.pages.dev/?ref=${appId}`;

    if (template === 'offer') {
      setMailSubject(`Official Appointment: Lumixora Campus Ambassador 2026 — ${candidateName} [${appId}]`);
      setMailBody(`Dear ${candidateName},

Congratulations! 

On behalf of the Executive Leadership at Lumixora (a product of Vyomra), we are thrilled to inform you that your application for the Lumixora Campus Ambassador Program 2026 (Cohort 1) has been ACCEPTED.

You are formally appointed as the Official Campus Ambassador representing ${college} for the academic session 2026–2027.

APPOINTMENT HIGHLIGHTS:
• Role: Campus Ambassador (Lead Representative)
• Chapter: ${college}
• Ref ID: ${appId}
• Tenure: Academic Year 2026–2027

YOUR OFFICIAL CAMPUS REFERRAL LINK & CODE:
• Referral Code: ${appId}
• Shareable Link: ${referralLink}
(Every new scholar who registers with your code or link is automatically attributed to you in our Founder Leaderboard!)

ENTITLEMENTS & PRIVILEGES:
1. Official Certificate of Leadership & Experience Letter from Lumixora (Vyomra) with verifiable public credential hash.
2. Direct 1-on-1 bi-weekly mentorship with Founder Shaik Sowban & Core Tech Leads.
3. 10,000 Synapte Coins & Free Lifetime Student Access to the Lumixora AI Pro Suite.
4. Executive Letter of Recommendation (LOR) for top 10% performers.

NEXT STEPS:
Our Outreach Team will connect with you on WhatsApp (+91 ${app.phone || 'registered number'}) within 24 hours to onboard you into the Ambassador Slack/WhatsApp Leadership Circle.

Welcome aboard to the Lumixora family! Let's revolutionize learning at ${college} together.

Warm regards,

Shaik Sowban
Founder, CEO & Chief Architect
Lumixora (a product of Vyomra)
Web: https://lumixora.pages.dev
Phone/WhatsApp: +91 9346476055
Email: 249xa33106@gprec.ac.in`);
    } else if (template === 'interview') {
      setMailSubject(`Shortlist Notice: Lumixora Campus Ambassador 2026 — ${candidateName} [${appId}]`);
      setMailBody(`Hi ${candidateName},

Great news! Your application for the Lumixora Campus Ambassador Program 2026 (${appId}) has been SHORTLISTED by our leadership team.

We were thoroughly impressed by your motivation to represent ${college}.

We would like to invite you for a brief 10-minute introductory interaction with our Outreach Team / Founder on Google Meet or WhatsApp.

Please reply to this email or ping us on WhatsApp at +91 9346476055 with your preferred time slot today or tomorrow.

Looking forward to speaking with you!

Best regards,

M. Akhil (Marketing Head) & Shaik Sowban
Campus Leadership Council
Lumixora (by Vyomra)`);
    } else {
      setMailSubject(`Cohort 1 Orientation & Kit: Lumixora Campus Ambassador — ${candidateName}`);
      setMailBody(`Dear ${candidateName},

Welcome to Lumixora Campus Ambassador Cohort 1!

Here are the onboarding assets and schedule for your orientation:
1. Ambassador Playbook: Access the guidelines on introducing Lumixora AI tools to peers.
2. Orientation Call: We host our monthly masterclass on Saturday at 7:00 PM IST.
3. Community Group: You have been added to the Official Ambassadors WhatsApp Roster.
4. Your Referral Link: ${referralLink} (Code: ${appId})

If you have any questions, reach out directly to Founder Sowban on WhatsApp: +91 9346476055.

Keep building and inspiring!

Warm regards,
The Lumixora Leadership Team`);
    }
  };

  const handleCopyMailBody = () => {
    navigator.clipboard?.writeText(mailBody);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    addToast({ message: 'Email text copied to clipboard.', type: 'success' });
  };

  const handleCopyOfferLetterText = () => {
    if (!offerLetterApp) return;
    const appId = offerLetterApp.appId || offerLetterApp.id;
    const text = `LUMIXORA STUDENT OS (A PRODUCT OF VYOMRA)
CAMPUS AMBASSADOR APPOINTMENT LETTER

Ref: ${appId}
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

To: ${offerLetterApp.name}
College: ${offerLetterApp.college}
Department: ${offerLetterApp.department} (${offerLetterApp.year})

Subject: Official Letter of Appointment — Campus Ambassador (Cohort 1 — 2026)

Dear ${offerLetterApp.name},

On behalf of Lumixora (a product of Vyomra), we take great pleasure in appointing you as an Official Campus Ambassador representing ${offerLetterApp.college} for the academic session 2026–2027.

We were highly impressed with your enthusiasm, communication, and commitment to technological innovation on your campus.

OFFICIAL REFERRAL CREDENTIALS:
• Referral Code: ${appId}
• Shareable Link: https://lumixora.pages.dev/?ref=${appId}

ROLES & RESPONSIBILITIES:
1. Campus Evangelism: Champion Lumixora AI Suite & learning tools among students.
2. Event Coordination: Facilitate technical workshops, study sprints, and coding hackathons.
3. Student Feedback: Provide ground feedback from students directly to Founder Shaik Sowban.

PERKS & ENTITLEMENTS:
• Official Certificate of Leadership & Experience Letter from Lumixora.
• Direct 1-on-1 mentorship with Founder Shaik Sowban.
• 10,000 Synapte Coins & Free 1-Year Access to Lumixora AI Pro Suite.
• Executive Letter of Recommendation (LOR) for top performers.

Signed,
Shaik Sowban (Founder & CEO, Lumixora)
M. Akhil (Marketing Head, Lumixora)`;

    navigator.clipboard?.writeText(text);
    setCopiedOffer(true);
    setTimeout(() => setCopiedOffer(false), 2000);
    addToast({ message: 'Offer letter copied to clipboard.', type: 'success' });
  };

  // Manage printing body class when ambassador appointment letter is active
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (offerLetterApp) {
      document.body.classList.add('print-ambassador-letter');
    } else {
      document.body.classList.remove('print-ambassador-letter');
    }
    return () => {
      document.body.classList.remove('print-ambassador-letter');
    };
  }, [offerLetterApp]);

  const handlePrintOfferLetter = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('print-ambassador-letter');
      window.print();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-6 rounded-3xl border border-amber-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                Founder Portal · Live Roster
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                {applications.length} Ambassador Applicants
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Campus Ambassador Applications Roster
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Review submissions, issue official Offer Letters, and dispatch selection emails & WhatsApp messages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Register or appoint an applicant manually"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add / Appoint Manually</span>
          </button>

          <button
            onClick={fetchAllAmbassadorApplications}
            className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
            title="Refresh submissions"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-[#12131f] p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Ambassador Applicants</span>
          <span className="text-2xl font-black text-white mt-1 block">{stats.total}</span>
          <span className="text-[10px] text-gray-500 font-medium">Campus Ambassador Submissions</span>
        </div>

        <div className="bg-[#12131f] p-4 rounded-2xl border border-emerald-500/20">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Selected / Appointed</span>
          <span className="text-2xl font-black text-emerald-300 mt-1 block">{stats.selected}</span>
          <span className="text-[10px] text-emerald-400/70 font-medium">Offer Letters Issued</span>
        </div>

        <div className="bg-[#12131f] p-4 rounded-2xl border border-cyan-500/20">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Shortlisted</span>
          <span className="text-2xl font-black text-cyan-300 mt-1 block">{stats.shortlisted}</span>
          <span className="text-[10px] text-cyan-400/70 font-medium">Interview / Call Ready</span>
        </div>

        <div className="bg-[#12131f] p-4 rounded-2xl border border-amber-500/20">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Pending Review</span>
          <span className="text-2xl font-black text-amber-300 mt-1 block">{stats.pending}</span>
          <span className="text-[10px] text-amber-400/70 font-medium">Awaiting Review</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-[#12131f] p-4 rounded-2xl border border-amber-500/40 shadow-lg shadow-amber-500/10">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Total Referrals
          </span>
          <span className="text-2xl font-black text-white mt-1 block">{totalNetworkReferrals} Scholars</span>
          <span className="text-[10px] text-amber-300/80 font-medium">Attributed Sign-ups</span>
        </div>
      </div>

      {/* Campus Ambassador Referral Leaderboard */}
      <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-[#12131f] p-5 sm:p-6 rounded-3xl border border-amber-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-black">
              🏆
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Ambassador Referral Leaderboard</span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Live Attribution
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">
                Track newly onboarded students brought by each campus ambassador.
              </p>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 flex items-center gap-2 font-mono">
            <span className="text-amber-400 font-bold">1 Click Share Link:</span>
            <span className="text-gray-300">https://lumixora.pages.dev/?ref=CODE</span>
          </div>
        </div>

        {ambassadorLeaderboard.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400">
            No ambassador applications submitted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ambassadorLeaderboard.slice(0, 3).map((lead, idx) => {
              const rankMedal = idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : '🥉 #3';
              const rankColor = idx === 0 ? 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300' : idx === 1 ? 'from-slate-400/20 to-gray-500/10 border-slate-400/40 text-slate-200' : 'from-amber-700/20 to-orange-900/10 border-amber-700/40 text-amber-200';
              const appId = lead.appId || lead.id;
              
              return (
                <div key={appId} className={`p-4 rounded-2xl bg-gradient-to-br ${rankColor} border relative overflow-hidden flex flex-col justify-between gap-3 shadow-md`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-black tracking-wider uppercase inline-block mb-1">
                        {rankMedal} Top Recruiter
                      </span>
                      <h4 className="font-extrabold text-white text-sm line-clamp-1">{lead.name}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{lead.college}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-white">{lead.referredCount}</span>
                      <span className="text-[10px] text-gray-400 block font-medium">Scholars</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="font-mono text-[10px] text-amber-300/90 font-bold bg-black/40 px-2 py-0.5 rounded">
                      {appId}
                    </span>
                    <button
                      onClick={() => setViewingReferredApp(lead)}
                      className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Roster</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Scope Tabs: Ambassador Applicants Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#12131f] p-3 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 p-1 bg-[#0b0c14] rounded-xl border border-white/5 w-full sm:w-auto flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black shadow-md shadow-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>All Ambassador Applicants ({applications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('selected')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'selected' || activeTab === 'ambassadors'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black shadow-md shadow-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Appointed Ambassadors ({stats.selected})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shortlisted')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'shortlisted'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black shadow-md shadow-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Shortlisted ({stats.shortlisted})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pending_review')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'pending_review'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black shadow-md shadow-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Pending Review ({stats.pending})</span>
          </button>
        </div>

        <div className="text-[11px] text-gray-400 font-medium px-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Verified Campus Ambassador Roster</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#12131f] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, ID or college..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-gray-500 outline-none focus:border-amber-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Building2 className="w-4 h-4 text-gray-500" />
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#161726] border border-white/10 text-white text-xs outline-none cursor-pointer"
            >
              <option value="ALL">All Colleges ({applications.length})</option>
              {uniqueColleges.map((col, idx) => (
                <option key={idx} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#161726] border border-white/10 text-white text-xs outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="selected">Selected / Offer Issued</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-gray-400">Loading campus ambassador applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-[#12131f] border border-white/10 rounded-3xl p-12 text-center space-y-3">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No applications match your filter</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your search query or college filter. New submissions will appear here in real-time as students submit them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => {
            const appId = app.appId || app.id;
            const status = app.status || 'pending_review';
            const cleanPhone = (app.phone || '').replace(/\D/g, '');
            const whatsappCongratulations = encodeURIComponent(
              `🎉 Congratulations ${app.name}! We are delighted to inform you that your application for the Lumixora Campus Ambassador Program 2026 (${appId}) representing ${app.college || 'your college'} has been ACCEPTED! Your official Appointment Letter has been generated. Welcome to Cohort 1! - Founder Shaik Sowban`
            );

            return (
              <div
                key={appId}
                className={`bg-[#131522] border rounded-3xl p-5 sm:p-6 transition-all hover:bg-[#161827] space-y-4 shadow-xl ${
                  status === 'selected'
                    ? 'border-emerald-500/40 shadow-emerald-500/5'
                    : status === 'shortlisted'
                    ? 'border-cyan-500/40 shadow-cyan-500/5'
                    : 'border-white/10'
                }`}
              >
                {/* Row 1: Header (ID, Name, Status, Date) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-base shrink-0 shadow-inner">
                      {app.name ? app.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-white text-base sm:text-lg">{app.name}</h4>
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                          {appId}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          <span>Campus Ambassador Lead</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 flex-wrap">
                        <span className="font-bold text-gray-200">{app.college}</span>
                        <span>·</span>
                        <span>{app.department}</span>
                        <span>·</span>
                        <span className="text-amber-300 font-semibold">{app.year}</span>
                        {app.rollNumber && app.rollNumber !== 'N/A' && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-gray-400 bg-white/5 px-2 py-0.2 rounded">ID: {app.rollNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      status === 'selected'
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : status === 'shortlisted'
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                        : status === 'rejected'
                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                        : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    }`}>
                      {status === 'selected' ? '✨ Selected / Offered' : status.replace('_', ' ')}
                    </span>

                    <span className="text-[11px] text-gray-500 font-medium">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'}
                    </span>
                  </div>
                </div>

                {/* Row 2: Motivation & Prior Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 space-y-1">
                    <span className="text-amber-400/90 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Why Join Lumixora?
                    </span>
                    <p className="text-gray-200 leading-relaxed italic">
                      "{app.whyJoin || 'No motivation statement recorded.'}"
                    </p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 space-y-1">
                    <span className="text-cyan-400/90 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-cyan-400" /> Leadership & Event Experience
                    </span>
                    <p className="text-gray-300 leading-relaxed">
                      {app.priorExperience || 'None specified.'}
                    </p>
                  </div>
                </div>

                {/* Referral Tracking & Attribution Bar */}
                {(() => {
                  const referredScholars = getReferredScholars(app);
                  const referralLink = `https://lumixora.pages.dev/?ref=${appId}`;

                  return (
                    <div className="bg-amber-500/[0.05] border border-amber-500/25 rounded-2xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Referral Code:</span>
                          <span className="text-white font-black">{appId}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => safeCopy(appId, `Copied referral code ${appId}`)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                          title="Copy referral code"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Code</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            safeCopy(referralLink, `Copied shareable referral link for ${app.name}`);
                            setCopiedLinkAppId(appId);
                            setTimeout(() => setCopiedLinkAppId(null), 2000);
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                          title="Copy shareable referral link"
                        >
                          {copiedLinkAppId === appId ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3 h-3 text-amber-400" />
                              <span>Copy Referral Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingReferredApp(app)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer border active:scale-95 ${
                            referredScholars.length > 0
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-md'
                              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          <span>{referredScholars.length} Scholars Referred</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Row 3: Action & Communication Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
                  {/* Left: Contact Channels */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/91${cleanPhone}?text=${whatsappCongratulations}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>+91 {cleanPhone}</span>
                      </a>
                    )}

                    {app.email && (
                      <button
                        type="button"
                        onClick={() => safeCopy(app.email, `Copied email ${app.email}`)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Click to copy candidate email"
                      >
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{app.email}</span>
                      </button>
                    )}

                    {app.linkedin && (
                      <a
                        href={app.linkedin.startsWith('http') ? app.linkedin : `https://${app.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
                      >
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                  </div>

                  {/* Right: Key Founder Actions (Offer Letter, Mail, Selection) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {!app.isCampusAmbassador && (
                      <button
                        type="button"
                        onClick={() => handleAppointAmbassador(app)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                        title="Appoint as Official Campus Ambassador and generate Letter"
                      >
                        <Award className="w-3.5 h-3.5 text-black" />
                        <span>Appoint as Ambassador</span>
                      </button>
                    )}

                    {/* Offer Letter Button */}
                    <button
                      type="button"
                      onClick={() => setOfferLetterApp(app)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                      title="Generate and view official printable Offer Letter"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Offer Letter</span>
                    </button>

                    {/* Email Dispatcher Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenMailModal(app, 'offer')}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      title="Compose and send official acceptance email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Mail</span>
                    </button>

                    {/* Segmented Status Selector */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(appId, 'pending_review')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                          status === 'pending_review'
                            ? 'bg-amber-500 text-black font-black shadow-sm'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        title="Mark Pending Review"
                      >
                        Pending
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(appId, 'shortlisted')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                          status === 'shortlisted'
                            ? 'bg-cyan-500 text-black font-black shadow-sm'
                            : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                        }`}
                        title="Mark Shortlisted"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Shortlist</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(appId, 'selected')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                          status === 'selected'
                            ? 'bg-emerald-500 text-black font-black shadow-sm'
                            : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                        }`}
                        title="Mark Selected / Offer Issued"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Select</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteApplication(appId)}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer active:scale-95"
                      title="Delete Application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: OFFICIAL PRINTABLE CAMPUS AMBASSADOR OFFER LETTER   */}
      {/* ============================================================ */}
      {offerLetterApp && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setOfferLetterApp(null)}
          className="fixed inset-0 z-[999999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn print-ambassador-modal-container"
        >
          <div 
            className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-300 print-ambassador-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar (Non-printable) */}
            <div className="no-print bg-[#0e101a] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-extrabold text-xs uppercase tracking-wider text-amber-300">
                  Official Campus Ambassador Appointment Document
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCopyOfferLetterText}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedOffer ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenMailModal(offerLetterApp, 'offer')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-black text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send via Mail</span>
                </button>

                <button
                  onClick={handlePrintOfferLetter}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save A4 PDF</span>
                </button>

                <button
                  onClick={() => setOfferLetterApp(null)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable A4 Offer Letter Document (Single-Page Optimized) */}
            <div 
              id="printable-ambassador-letter"
              className="p-6 sm:p-10 space-y-3.5 bg-white font-sans text-slate-800 leading-normal max-h-[85vh] overflow-y-auto"
            >
              {/* Letterhead */}
              <div className="flex items-start justify-between pb-3 border-b-2 border-slate-900 gap-4">
                <div className="flex items-center gap-3">
                  <img src="/lumixora_logo.jpg" alt="Lumixora Logo" className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-200" />
                  <div>
                    <h1 className="text-xl font-black text-slate-950 tracking-tight leading-none">
                      LUMIXORA STUDENT OS
                    </h1>
                    <p className="text-[10px] text-amber-700 font-extrabold uppercase tracking-widest mt-1">
                      A Product of Vyomra Networks · Global Innovation Division
                    </p>
                    <p className="text-[9px] text-slate-500 font-medium">
                      Autonomous Educational Ecosystem & Student AI Future Twin
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-600 space-y-0.5">
                  <div className="font-mono font-bold text-slate-950 text-xs">
                    Ref: {offerLetterApp.appId || 'LMX-CA-2026'}
                  </div>
                  <div className="font-medium text-slate-600 text-[10.5px]">
                    Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider">
                    Official Appointment Letter
                  </div>
                </div>
              </div>

              {/* Recipient Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Appointee Details:</span>
                <h3 className="text-sm font-black text-slate-950 leading-tight">
                  {offerLetterApp.name}
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-slate-700 font-medium text-[10.5px]">
                  <div><strong>Institution:</strong> {offerLetterApp.college}</div>
                  <div><strong>Department:</strong> {offerLetterApp.department} ({offerLetterApp.year})</div>
                  <div><strong>WhatsApp/Mobile:</strong> +91 {offerLetterApp.phone}</div>
                  <div><strong>Email:</strong> {offerLetterApp.email}</div>
                </div>
              </div>

              {/* Subject */}
              <div className="text-[11px] font-black uppercase text-slate-950 border-l-4 border-amber-500 pl-2.5 py-0.5 tracking-wide">
                SUBJECT: OFFICIAL APPOINTMENT AS CAMPUS AMBASSADOR (COHORT 1 — 2026–2027)
              </div>

              {/* Body Content */}
              <div className="text-[10.5px] text-slate-800 space-y-2 leading-relaxed">
                <p>
                  Dear <strong>{offerLetterApp.name}</strong>,
                </p>
                <p>
                  On behalf of Executive Leadership at <strong>Lumixora (a product of Vyomra Networks)</strong>, we take immense pleasure in formally extending this offer of appointment as an <strong>Official Campus Ambassador</strong> for the academic session 2026–2027 representing <strong>{offerLetterApp.college}</strong>.
                </p>

                {/* 2-Column Side-by-Side Cards: Roles & Privileges */}
                <div className="grid grid-cols-2 gap-2.5 my-1.5">
                  {/* Card 1: Core Roles */}
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1 text-[10px]">
                    <h4 className="font-extrabold text-amber-950 uppercase text-[9.5px] tracking-wider flex items-center gap-1">
                      <span>⚡ Core Roles & Mandate:</span>
                    </h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                      <li><strong>Campus Evangelism:</strong> Introduce students to Lumixora AI Twin & study tools.</li>
                      <li><strong>Community Lead:</strong> Organize study circles, coding webinars & workshops.</li>
                      <li><strong>Student Insights Voice:</strong> Relay feature suggestions directly to Founder Shaik Sowban.</li>
                    </ul>
                  </div>

                  {/* Card 2: Privileges */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[10px]">
                    <h4 className="font-extrabold text-slate-950 uppercase text-[9.5px] tracking-wider flex items-center gap-1">
                      <span>🏆 Entitlements & Privileges:</span>
                    </h4>
                    <div className="space-y-0.5 text-slate-700">
                      <div>✔ <strong>Leadership Certificate & Experience Letter</strong> from Vyomra</div>
                      <div>✔ <strong>Direct Bi-Weekly Mentorship</strong> with Founder Shaik Sowban</div>
                      <div>✔ <strong>10,000 Synapte Coins</strong> & Lifetime Student Pro Access</div>
                      <div>✔ <strong>Executive Letter of Recommendation (LOR)</strong> for top leaders</div>
                    </div>
                  </div>
                </div>

                {/* Official Ambassador Referral Credentials */}
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-950 uppercase text-[9px] tracking-wider flex items-center gap-1">
                      <span>🎟️ Official Campus Referral Credentials:</span>
                    </span>
                    <span className="text-[8.5px] font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-400">
                      Live Attribution Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-800 font-mono text-[9.5px]">
                    <div className="bg-white/90 px-2 py-1 rounded-lg border border-amber-200 flex items-center justify-between">
                      <span className="text-[8.5px] text-slate-500 font-bold uppercase font-sans">Referral Code:</span>
                      <strong className="text-amber-900 font-black">{offerLetterApp.appId || offerLetterApp.id}</strong>
                    </div>
                    <div className="bg-white/90 px-2 py-1 rounded-lg border border-amber-200 flex items-center justify-between overflow-hidden">
                      <span className="text-[8.5px] text-slate-500 font-bold uppercase font-sans shrink-0 mr-1">Link:</span>
                      <strong className="text-slate-900 truncate">https://lumixora.pages.dev/?ref={offerLetterApp.appId || offerLetterApp.id}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-700 pt-0.5">
                  We look forward to working closely with you and supporting your journey as a recognized student leader. Welcome to Cohort 1!
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-2.5 border-t border-slate-300 flex items-end justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="w-24 border-b border-slate-950 pb-0.5 mb-1 font-serif italic font-bold text-slate-900 text-xs">
                    Shaik Sowban
                  </div>
                  <strong className="block text-slate-950 text-[10px] font-black">SHAIK SOWBAN</strong>
                  <span className="text-[9px] text-slate-600 block">Founder, CEO & Chief Architect</span>
                  <span className="text-[8px] text-amber-700 font-bold block uppercase">Lumixora · A Product of Vyomra</span>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-600/50 bg-amber-50/90 flex flex-col items-center justify-center mx-auto text-amber-700 font-bold uppercase tracking-wider leading-tight p-1.5 shadow-inner">
                    <span className="text-[8px] font-black text-amber-900 tracking-widest">OFFICIAL</span>
                    <span className="text-[10px] font-black text-amber-700 tracking-wider">SEAL</span>
                    <span className="text-[7.5px] font-bold text-amber-800 tracking-widest">VYOMRA</span>
                  </div>
                  <span className="text-[8px] text-slate-500 font-mono mt-1 block font-bold tracking-wider">VERIFIED CREDENTIAL</span>
                </div>

                <div className="space-y-0.5 text-right">
                  <div className="w-24 border-b border-slate-950 pb-0.5 mb-1 font-serif italic font-bold text-slate-900 text-xs ml-auto">
                    M. Akhil
                  </div>
                  <strong className="block text-slate-950 text-[10px] font-black">M. AKHIL</strong>
                  <span className="text-[9px] text-slate-700 font-bold block">Marketing Head</span>
                  <span className="text-[8px] text-slate-500 font-medium block">Campus Partnership Council</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="no-print bg-slate-100 p-4 border-t border-slate-300 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                Official document issued by Vyomra Networks. Valid across all partner colleges.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleUpdateStatus(offerLetterApp.appId || offerLetterApp.id, 'selected');
                    setOfferLetterApp(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Selected & Confirm</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ============================================================ */}
      {/* MODAL 2: OFFICIAL MAIL & WHATSAPP DISPATCHER                 */}
      {/* ============================================================ */}
      {mailApp && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setMailApp(null)}
          className="fixed inset-0 z-[999999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div 
            className="relative w-full max-w-2xl bg-gradient-to-b from-[#141624] to-[#0c0e17] text-gray-100 rounded-3xl shadow-2xl overflow-hidden my-auto border border-cyan-500/30 p-6 sm:p-8 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Send Official Communication</h3>
                  <p className="text-xs text-gray-400">
                    To: <span className="font-bold text-white">{mailApp.name}</span> ({mailApp.email})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMailApp(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Choose Communication Template:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenMailModal(mailApp, 'offer')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                    mailTemplate === 'offer'
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 mb-1 text-amber-400" />
                  <div>Appointment Offer</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenMailModal(mailApp, 'interview')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                    mailTemplate === 'interview'
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-sm'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 mb-1 text-cyan-400" />
                  <div>Shortlist & Call</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenMailModal(mailApp, 'onboarding')}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                    mailTemplate === 'onboarding'
                      ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-sm'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 mb-1 text-purple-400" />
                  <div>Cohort 1 Kit</div>
                </button>
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Email Subject Line:</label>
              <input
                type="text"
                value={mailSubject}
                onChange={(e) => setMailSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 text-white text-xs outline-none font-medium"
              />
            </div>

            {/* Body Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span>Message Body:</span>
                <span className="text-[10px] text-gray-500">Fully editable before sending</span>
              </label>
              <textarea
                rows={10}
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 text-white text-xs outline-none leading-relaxed font-sans"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMailBody}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                {mailApp.phone && (
                  <a
                    href={`https://wa.me/91${mailApp.phone.replace(/\D/g, '')}?text=${encodeURIComponent(mailBody)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`mailto:${mailApp.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Launch in Mail App</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Referred Scholars Roster Modal */}
      {viewingReferredApp && typeof document !== 'undefined' && createPortal((() => {
        const appId = viewingReferredApp.appId || viewingReferredApp.id;
        const candidateName = viewingReferredApp.name || 'Campus Ambassador';
        const candidateCollege = viewingReferredApp.college || 'College';
        const referralLink = `https://lumixora.pages.dev/?ref=${appId}`;
        const allReferred = getReferredScholars(viewingReferredApp);

        const filteredReferred = allReferred.filter(s => {
          const q = (referredSearch || '').toLowerCase().trim();
          if (!q) return true;
          return (
            (s.name && s.name.toLowerCase().includes(q)) ||
            (s.email && s.email.toLowerCase().includes(q)) ||
            (s.college && s.college.toLowerCase().includes(q)) ||
            (s.department && s.department.toLowerCase().includes(q))
          );
        });

        const handleExportReferredCSV = () => {
          if (allReferred.length === 0) {
            addToast({ message: 'No referred scholars to export.', type: 'info' });
            return;
          }
          const headers = ['Scholar Name', 'Email', 'College', 'Department', 'Year', 'Registered At', 'Attribution Source'];
          const rows = allReferred.map(s => [
            `"${s.name || ''}"`,
            `"${s.email || ''}"`,
            `"${s.college || ''}"`,
            `"${s.department || ''}"`,
            `"${s.year || ''}"`,
            `"${s.registeredAt || ''}"`,
            `"${s.source || ''}"`
          ]);
          const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', `lumixora_referrals_${appId}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          addToast({ message: `Exported ${allReferred.length} referrals for ${candidateName}.`, type: 'success' });
        };

        return (
          <div 
            onClick={() => {
              setViewingReferredApp(null);
              setReferredSearch('');
            }}
            className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          >
            <div 
              className="bg-[#121320] border border-amber-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-[#181a2e] to-[#121320]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-xl shadow-md">
                    👥
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-white">
                        Scholars Referred by {candidateName}
                      </h3>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                        {appId}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {candidateCollege} · Live User Tracking & Attribution Ledger
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportReferredCSV}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <button
                    onClick={() => {
                      setViewingReferredApp(null);
                      setReferredSearch('');
                    }}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Referral Attribution Bar in Modal */}
              <div className="bg-[#161829] p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-400">Shareable URL:</span>
                  <span className="font-mono text-amber-300 bg-black/40 px-3 py-1 rounded-lg border border-amber-500/20 truncate max-w-xs sm:max-w-md">
                    {referralLink}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(referralLink);
                      addToast({ message: 'Referral link copied to clipboard', type: 'success' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3 h-3 text-amber-400" />
                    <span>Copy Link</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black">
                    {allReferred.length} Total Registered
                  </span>
                </div>
              </div>

              {/* Search Inside Referrals */}
              <div className="p-4 border-b border-white/5 bg-[#121320]">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={referredSearch}
                    onChange={(e) => setReferredSearch(e.target.value)}
                    placeholder="Search referred students by name, email, department..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-gray-500 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Scholars List / Table */}
              <div className="p-6 overflow-y-auto space-y-3 flex-1 max-h-[50vh]">
                {allReferred.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl mx-auto">
                      🎟️
                    </div>
                    <h4 className="text-sm font-bold text-white">No scholars have registered yet</h4>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                      Share the ambassador referral link with <strong>{candidateName}</strong>. As soon as students register or sign in with their college email and enter this code, they will automatically appear here with full timestamps!
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(referralLink);
                        addToast({ message: 'Referral link copied!', type: 'success' });
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs inline-flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Ambassador Referral Link</span>
                    </button>
                  </div>
                ) : filteredReferred.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400">
                    No scholars match your search query "{referredSearch}".
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredReferred.map((scholar, idx) => (
                      <div
                        key={scholar.email + idx}
                        className="bg-white/[0.03] border border-white/5 hover:border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {scholar.name ? scholar.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-extrabold text-white text-xs sm:text-sm">
                                {scholar.name}
                              </h5>
                              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.2 rounded border border-cyan-500/20">
                                {scholar.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5 flex-wrap">
                              <span>{scholar.college}</span>
                              <span>·</span>
                              <span className="text-gray-300 font-medium">{scholar.department}</span>
                              <span>·</span>
                              <span>{scholar.year}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-xs">
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full block">
                              {scholar.source}
                            </span>
                            <span className="text-[10px] text-gray-500 mt-1 block">
                              {scholar.registeredAt ? new Date(scholar.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified'}
                            </span>
                          </div>

                          <a
                            href={`mailto:${scholar.email}?subject=Welcome%20to%20Lumixora!&body=Hi%20${encodeURIComponent(scholar.name)},%20welcome%20to%20the%20Lumixora%20Student%20OS%20ecosystem!`}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                            title="Email Scholar"
                          >
                            <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-[#161829] flex items-center justify-between text-xs text-gray-400">
                <span className="font-medium">
                  Showing {filteredReferred.length} of {allReferred.length} scholars
                </span>
                <button
                  onClick={() => {
                    setViewingReferredApp(null);
                    setReferredSearch('');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })(), document.body)}

      {/* ============================================================ */}
      {/* MODAL 4: MANUAL CANDIDATE REGISTRATION & APPOINTMENT        */}
      {/* ============================================================ */}
      {showManualModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setShowManualModal(false)}
          className="fixed inset-0 z-[999999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div 
            className="relative w-full max-w-xl bg-gradient-to-b from-[#161828] to-[#0d0f19] text-gray-100 rounded-3xl shadow-2xl overflow-hidden my-auto border border-amber-500/40 p-6 sm:p-8 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-md">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Register / Appoint Applicant</h3>
                  <p className="text-xs text-gray-400">
                    Add any student applicant manually & instantly issue their appointment letter.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowManualModal(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitManual} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Full Legal / Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={manualForm.name}
                    onChange={(e) => setManualForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="student@college.edu or gmail"
                    value={manualForm.email}
                    onChange={(e) => setManualForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Student ID / Roll Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 249XA33140"
                    value={manualForm.rollNumber}
                    onChange={(e) => setManualForm(p => ({ ...p, rollNumber: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400 transition-all placeholder:text-gray-600 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">College / Institution</label>
                <select
                  value={manualForm.college}
                  onChange={(e) => setManualForm(p => ({ ...p, college: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1c2d] border border-white/10 text-white outline-none cursor-pointer focus:border-amber-400"
                >
                  {COLLEGE_OPTIONS.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="other">Other College / University</option>
                </select>
                {manualForm.college === 'other' && (
                  <input
                    type="text"
                    placeholder="Enter full college name"
                    value={manualForm.customCollege}
                    onChange={(e) => setManualForm(p => ({ ...p, customCollege: e.target.value }))}
                    className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Department / Branch</label>
                  <select
                    value={manualForm.department}
                    onChange={(e) => setManualForm(p => ({ ...p, department: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1c2d] border border-white/10 text-white outline-none cursor-pointer focus:border-amber-400"
                  >
                    {DEPARTMENTS.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300">Year of Study</label>
                  <select
                    value={manualForm.year}
                    onChange={(e) => setManualForm(p => ({ ...p, year: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1c2d] border border-white/10 text-white outline-none cursor-pointer focus:border-amber-400"
                  >
                    {YEARS.map((y, i) => (
                      <option key={i} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Role Track</label>
                <select
                  value={manualForm.roleTrack}
                  onChange={(e) => setManualForm(p => ({ ...p, roleTrack: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1c2d] border border-white/10 text-white outline-none cursor-pointer focus:border-amber-400"
                >
                  {ROLE_TRACKS.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300">Notes / Motivation</label>
                <textarea
                  rows={2}
                  value={manualForm.whyJoin}
                  onChange={(e) => setManualForm(p => ({ ...p, whyJoin: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingManual}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingManual ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Appoint & Generate Letter</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
