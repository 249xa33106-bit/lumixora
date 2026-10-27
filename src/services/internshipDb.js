// Lumixora Internship Database Service
// Connects to the live Google Cloud Firestore database: ai-studio-internshipapplic-0e39c329-1f8d-4dad-860c-99676d3dbce3
// Managing Batch 01 live candidate applications, real-time sync, and evaluations.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

export const INTERNSHIP_FIREBASE_CONFIG = {
  projectId: "gen-lang-client-0259867406",
  appId: "1:970102319170:web:8a771bf1024e6496ee25db",
  apiKey: "AIzaSyB4guCbdEhkn1OMGvnuSBfb0Owm2iJYFoA",
  authDomain: "gen-lang-client-0259867406.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-internshipapplic-0e39c329-1f8d-4dad-860c-99676d3dbce3",
  storageBucket: "gen-lang-client-0259867406.firebasestorage.app",
  messagingSenderId: "970102319170"
};

const APP_NAME = 'lumixora_internship_app';

const getInternshipApp = () => {
  const existing = getApps().find(a => a.name === APP_NAME);
  if (existing) return existing;
  return initializeApp(INTERNSHIP_FIREBASE_CONFIG, APP_NAME);
};

const internshipApp = getInternshipApp();
export const internshipDb = getFirestore(internshipApp, INTERNSHIP_FIREBASE_CONFIG.firestoreDatabaseId);

const CACHE_KEY = 'lumixora_applications_batch01_v1';
const TEST_REF_IDS = ['LMX-B01-4192', 'LMX-B01-7840', 'LMX-B01-2915', 'LMX-B01-9031'];

// Filter mock/test seed items
export const filterRealApplications = (list = []) => {
  if (!Array.isArray(list)) return [];
  return list.filter(item => {
    if (!item) return false;
    const id = item.id || '';
    const refId = item.refId || '';
    if (id.startsWith('lmx-00') && TEST_REF_IDS.includes(refId)) return false;
    return true;
  });
};

export const getCachedApplications = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return filterRealApplications(parsed);
  } catch (e) {
    return [];
  }
};

export const saveApplicationsToCache = (apps = []) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const clean = filterRealApplications(apps);
    localStorage.setItem(CACHE_KEY, JSON.stringify(clean));
  } catch (e) {
    console.warn('Failed to cache applications:', e);
  }
};

export const generateRefId = () => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `LMX-B01-${randomDigits}`;
};

export const INTERNSHIP_ROLES = [
  {
    id: 'software_testing',
    title: 'Software Testing Intern',
    positions: 3,
    badge: 'High Priority',
    summary: 'Ensure rock-solid product reliability through manual testing, automated test scripts, regression pipelines, and UI/UX bug audits.',
    focusAreas: ['Functional QA', 'Bug Tracking & Reporting', 'API & Regression Testing', 'Cross-Browser Verification'],
    idealCandidate: 'Curious problem solver with keen eye for edge cases, usability flaws, and software test documentation.',
    color: 'emerald'
  },
  {
    id: 'research',
    title: 'Research Intern',
    positions: 2,
    badge: 'Core Team',
    summary: 'Conduct in-depth market landscape intelligence, competitive benchmarks, student pain points, and prospective user interview synthesis.',
    focusAreas: ['Market Research', 'Competitive Benchmarking', 'User Interview Analysis', 'Trend Synthesis'],
    idealCandidate: 'Analytical thinker skilled at synthesizing industry reports, qualitative insights, and strategic data.',
    color: 'cyan'
  },
  {
    id: 'marketing',
    title: 'Marketing Intern',
    positions: 3,
    badge: 'Growth Track',
    summary: 'Lead growth marketing campaigns, campus brand ambassador programs, user acquisition funnels, and community engagement for Lumixora launch.',
    focusAreas: ['Growth Marketing', 'Social Media Strategy', 'Campaign Analytics', 'Community Outreach'],
    idealCandidate: 'Passionate about digital marketing, brand building, viral loops, and data-driven engagement.',
    color: 'violet'
  },
  {
    id: 'content_creation',
    title: 'Content Creation Intern',
    positions: 2,
    badge: 'Creative Track',
    summary: 'Craft compelling technical storytelling, product release notes, explainer graphics, campus memes, and video walkthroughs.',
    focusAreas: ['Copywriting & Technical Articles', 'Visual Storytelling', 'Product Walkthroughs', 'Micro-content'],
    idealCandidate: 'Creative wordsmith and visual communicator who simplifies complex tech concepts into engaging media.',
    color: 'pink'
  }
];

/**
 * Real-time listener for live applications collection
 */
export const subscribeToApplications = (onUpdate, onError) => {
  try {
    const coll = collection(internshipDb, 'applications');
    return onSnapshot(coll, (snap) => {
      const items = [];
      snap.forEach(d => {
        const data = d.data();
        if (data) {
          items.push({ ...data, id: data.id || d.id });
        }
      });
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      const clean = filterRealApplications(items);
      saveApplicationsToCache(clean);
      if (typeof onUpdate === 'function') onUpdate(clean);
    }, (err) => {
      console.warn("Firestore snapshot notice:", err);
      const cached = getCachedApplications();
      if (typeof onUpdate === 'function') onUpdate(cached);
      if (typeof onError === 'function') onError(err);
    });
  } catch (err) {
    console.warn("Subscribe error, falling back to cache:", err);
    if (typeof onUpdate === 'function') onUpdate(getCachedApplications());
    return () => {};
  }
};

/**
 * Fetch applications once
 */
export const fetchApplicationsOnce = async () => {
  try {
    const coll = collection(internshipDb, 'applications');
    const snap = await getDocs(coll);
    const items = [];
    snap.forEach(d => {
      const data = d.data();
      if (data) {
        items.push({ ...data, id: data.id || d.id });
      }
    });
    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const clean = filterRealApplications(items);
    saveApplicationsToCache(clean);
    return clean;
  } catch (err) {
    console.warn("Fetch once error, using cache:", err);
    return getCachedApplications();
  }
};

/**
 * Submit a new application
 */
export const submitInternshipApplication = async (formData) => {
  const nowIso = new Date().toISOString();
  const id = `lmx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const refId = generateRefId();

  const roleObj = INTERNSHIP_ROLES.find(r => r.id === formData.preferredRole) || { title: formData.preferredRole || 'Intern' };

  const newApp = {
    ...formData,
    id,
    refId,
    batch: 'Batch 01',
    preferredRoleTitle: roleObj.title,
    status: 'pending',
    reviewerNotes: [],
    rating: 0,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  // Immediate optimistic cache update
  const current = getCachedApplications();
  saveApplicationsToCache([newApp, ...current]);

  // Persist to live Firestore
  try {
    const docRef = doc(internshipDb, 'applications', id);
    await setDoc(docRef, newApp);
  } catch (e) {
    console.warn("Firestore setDoc notice for application:", e);
  }

  return newApp;
};

/**
 * Update application status (e.g. pending, reviewing, shortlisted, accepted, rejected)
 */
export const updateApplicationStatus = async (appId, status, interviewDate = null) => {
  const current = getCachedApplications();
  const index = current.findIndex(a => a.id === appId);
  const nowIso = new Date().toISOString();

  let updatedObj = null;
  if (index !== -1) {
    updatedObj = {
      ...current[index],
      status,
      updatedAt: nowIso,
      ...(interviewDate ? { interviewDate } : {})
    };
    const nextList = [...current];
    nextList[index] = updatedObj;
    saveApplicationsToCache(nextList);
  }

  try {
    const docRef = doc(internshipDb, 'applications', appId);
    const updatePayload = {
      status,
      updatedAt: nowIso,
      ...(interviewDate ? { interviewDate } : {})
    };
    await updateDoc(docRef, updatePayload);
  } catch (e) {
    console.warn("Firestore updateDoc notice:", e);
  }

  return updatedObj;
};

/**
 * Add reviewer note & rating
 */
export const addReviewerNote = async (appId, { text, author = 'Founder', authorRole = 'Admissions Lead', rating }) => {
  const current = getCachedApplications();
  const index = current.findIndex(a => a.id === appId);
  const nowIso = new Date().toISOString();

  const newNote = {
    id: `note-${Date.now()}`,
    author,
    authorRole,
    text,
    rating: rating || 0,
    createdAt: nowIso
  };

  let updatedObj = null;
  if (index !== -1) {
    const target = current[index];
    updatedObj = {
      ...target,
      rating: rating !== undefined ? rating : target.rating,
      reviewerNotes: [newNote, ...(target.reviewerNotes || [])],
      updatedAt: nowIso
    };
    const nextList = [...current];
    nextList[index] = updatedObj;
    saveApplicationsToCache(nextList);
  }

  try {
    const docRef = doc(internshipDb, 'applications', appId);
    await updateDoc(docRef, {
      rating: rating !== undefined ? rating : (updatedObj?.rating || 0),
      reviewerNotes: updatedObj?.reviewerNotes || [newNote],
      updatedAt: nowIso
    });
  } catch (e) {
    console.warn("Firestore note update notice:", e);
  }

  return updatedObj;
};

/**
 * Delete an application
 */
export const deleteApplication = async (appId) => {
  const current = getCachedApplications();
  saveApplicationsToCache(current.filter(a => a.id !== appId));
  try {
    const docRef = doc(internshipDb, 'applications', appId);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.warn("Firestore deleteDoc notice:", e);
    return false;
  }
};

/**
 * Search application by Reference ID or Email
 */
export const lookupApplication = async (queryVal) => {
  const clean = (queryVal || '').trim().toLowerCase();
  if (!clean) return null;

  // Check local cache first
  const cached = getCachedApplications();
  const localMatch = cached.find(a => 
    (a.refId && a.refId.toLowerCase() === clean) ||
    (a.email && a.email.toLowerCase() === clean)
  );

  // If found locally, also try to fetch latest from Firestore in background
  try {
    const coll = collection(internshipDb, 'applications');
    const isRef = clean.startsWith('lmx');
    const q = isRef 
      ? query(coll, where('refId', '==', queryVal.trim().toUpperCase()))
      : query(coll, where('email', '==', clean));
    
    const snap = await getDocs(q);
    if (!snap.empty) {
      const match = snap.docs[0].data();
      return { ...match, id: snap.docs[0].id };
    }
  } catch (e) {
    console.warn("Lookup notice:", e);
  }

  return localMatch || null;
};
