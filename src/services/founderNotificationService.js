import { supabase } from '../config/supabase';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { decodeGprecRollNumber } from '../data/collegesData';

const NOTIF_STORAGE_KEY = 'lumixora_founder_notifications';
const TEST_RESULTS_STORAGE_KEY = 'lumixora_test_submissions';
const READ_NOTIFS_KEY = 'lumixora_read_notif_ids';
const CLEARED_NOTIFS_TIME_KEY = 'lumixora_founder_notifs_cleared_at';
const CLEARED_NOTIFS_IDS_KEY = 'lumixora_cleared_notif_ids';

// Helper to clean scholar names and strip raw JSON/garbage
export const cleanScholarName = (str, email = '') => {
  if (str && typeof str === 'string') {
    let cleaned = str.trim();
    if (cleaned.includes('{')) {
      try {
        const parsed = JSON.parse(cleaned.slice(cleaned.indexOf('{')));
        if (parsed.name && parsed.name.trim() && parsed.name.toLowerCase() !== 'scholar') {
          return parsed.name.trim();
        }
      } catch (e) {}
      cleaned = cleaned.split('{')[0].trim();
    }
    cleaned = cleaned.replace(/[{}:;"]/g, '').trim();
    if (cleaned && cleaned.toLowerCase() !== 'scholar' && cleaned.length > 1) {
      return cleaned
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  }

  if (email && typeof email === 'string' && email.includes('@') && !email.includes('@scholar.lumixora.com')) {
    const userPart = email.split('@')[0];
    if (/\d/.test(userPart)) {
      return `Scholar (${userPart.toUpperCase()})`;
    }
    return userPart
      .replace(/[._-]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return 'Scholar';
};

// Extract metadata from JSON packed into names
export const parseUserMetadata = (rawStr) => {
  if (!rawStr || typeof rawStr !== 'string' || !rawStr.includes('{')) return {};
  try {
    const idx = rawStr.indexOf('{');
    return JSON.parse(rawStr.substring(idx).trim()) || {};
  } catch (e) {
    return {};
  }
};

// Safe local storage helpers
export const getStoredNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const setStoredNotifications = (notifs) => {
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifs.slice(0, 300)));
  } catch (e) {}
};

export const getClearedTimestamp = () => {
  try {
    const raw = localStorage.getItem(CLEARED_NOTIFS_TIME_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch (e) {
    return 0;
  }
};

export const setClearedTimestamp = (ts) => {
  try {
    localStorage.setItem(CLEARED_NOTIFS_TIME_KEY, String(ts));
  } catch (e) {}
};

export const getClearedIds = () => {
  try {
    const raw = localStorage.getItem(CLEARED_NOTIFS_IDS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
};

export const setClearedIds = (idSet) => {
  try {
    localStorage.setItem(CLEARED_NOTIFS_IDS_KEY, JSON.stringify(Array.from(idSet).slice(0, 1000)));
  } catch (e) {}
};

const getReadIds = () => {
  try {
    const raw = localStorage.getItem(READ_NOTIFS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
};

const setReadIds = (idSet) => {
  try {
    localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(Array.from(idSet).slice(0, 500)));
  } catch (e) {}
};

// Get stored test submissions (Strictly real only)
export const getStoredTestSubmissions = () => {
  try {
    const raw = localStorage.getItem(TEST_RESULTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(s => s && s.userEmail && !s.id?.startsWith('sub_py_') && !s.id?.startsWith('sub_web_'));
      }
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const saveStoredTestSubmissions = (submissions) => {
  try {
    localStorage.setItem(TEST_RESULTS_STORAGE_KEY, JSON.stringify(submissions.slice(0, 500)));
  } catch (e) {}
};

// Realtime Channel Setup
let realtimeChannel = null;
const getRealtimeChannel = () => {
  if (!realtimeChannel && supabase && typeof supabase.channel === 'function') {
    try {
      realtimeChannel = supabase.channel('founder_notifications_channel');
      realtimeChannel.subscribe();
    } catch (e) {
      console.warn('Realtime channel init notice:', e);
    }
  }
  return realtimeChannel;
};

// Formatted time helper matching format (e.g. 3 Sept, 21:28)
export const formatNotificationTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const timeVal = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
  if (isNaN(timeVal)) return 'Just now';

  const d = new Date(timeVal);
  const day = d.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const monthStr = months[d.getMonth()];
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day} ${monthStr}, ${hours}:${minutes}`;
};

// Main record function: Dispatches across all live channels & persists to Firestore
export const recordFounderNotification = async (notification) => {
  try {
    const timestamp = notification.timestamp || notification.createdAt || new Date().toISOString();
    const timeVal = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime() || Date.now();
    const cleanName = cleanScholarName(notification.name || notification.userName, notification.email);

    const notifObj = {
      id: notification.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: notification.type || 'login', // 'login' | 'register' | 'submission' | 'doubt' | 'task' | 'grievance'
      name: cleanName,
      email: (notification.email || '').toLowerCase().trim(),
      role: notification.role || 'user',
      college: notification.college || 'GPREC',
      department: notification.department || 'CSE',
      details: notification.details || '',
      score: notification.score !== undefined ? notification.score : null,
      total: notification.total !== undefined ? notification.total : null,
      testTitle: notification.testTitle || '',
      createdAt: new Date(timeVal).toISOString(),
      _sortTime: timeVal,
      read: false
    };

    // 1. Save to LocalStorage cache
    const current = getStoredNotifications();
    const isDup = current.some(n => 
      n.id === notifObj.id || 
      (n.type === notifObj.type && n.email === notifObj.email && Math.abs(n._sortTime - notifObj._sortTime) < 4000)
    );
    if (!isDup) {
      const updated = [notifObj, ...current];
      setStoredNotifications(updated);
    }

    // 2. Store to Supabase founder_notifications table
    if (supabase && typeof supabase.from === 'function') {
      try {
        supabase.from('founder_notifications').insert([{
          id: notifObj.id,
          type: notifObj.type,
          name: notifObj.name,
          email: notifObj.email,
          role: notifObj.role,
          college: notifObj.college,
          department: notifObj.department,
          details: notifObj.details,
          score: notifObj.score,
          total: notifObj.total,
          test_title: notifObj.testTitle,
          created_at: notifObj.createdAt
        }]).then(() => {}).catch(() => {});
      } catch (sbInsertErr) {}
    }

    // 3. Broadcast via Supabase Realtime channel
    try {
      const ch = getRealtimeChannel();
      if (ch) {
        ch.send({
          type: 'broadcast',
          event: 'founder_notification',
          payload: notifObj
        });
      }
    } catch (sbErr) {
      console.warn('Supabase realtime broadcast notice:', sbErr);
    }

    // 4. Dispatch Local Window Event for multi-tab/same-tab reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lumixora_founder_notification', { detail: notifObj }));
    }

    // 5. Persist to Firestore founder_notifications collection
    if (db) {
      try {
        addDoc(collection(db, 'founder_notifications'), {
          ...notifObj,
          timestamp: serverTimestamp()
        }).catch((e) => {
          console.warn('Firestore addDoc notice:', e);
        });
      } catch (fsErr) {}
    }

    return notifObj;
  } catch (err) {
    console.warn('Error recording founder notification:', err);
  }
};

// Convenience helpers
export const notifyFounderLogin = (user) => {
  if (!user) return;
  const email = (user.email || '').toLowerCase().trim();
  const meta = parseUserMetadata(user.name);
  const roll = user.rollNumber || meta.rollNumber || (email.endsWith('@gprec.ac.in') ? email.split('@')[0].toUpperCase() : '');
  const decoded = decodeGprecRollNumber(roll || email);
  const cleanName = cleanScholarName(user.name, email);
  const dept = user.department || user.branch || meta.department || decoded.department || 'CSM';
  const college = user.college || meta.college || 'GPREC';
  return recordFounderNotification({
    type: 'login',
    name: cleanName,
    email: user.email,
    rollNumber: roll,
    role: user.role || 'user',
    college,
    department: dept,
    details: `Active login session · ${dept} (${college}) ${roll ? `· Roll: ${roll}` : ''}`
  });
};

export const notifyFounderRegister = (user) => {
  if (!user) return;
  const meta = parseUserMetadata(user.name);
  const dept = user.department || user.branch || meta.department || 'CSE';
  const college = user.college || meta.college || 'GPREC';
  return recordFounderNotification({
    type: 'register',
    name: user.name,
    email: user.email,
    role: user.role || 'user',
    college,
    department: dept,
    details: `New scholar onboarded · ${dept} (${college})`
  });
};

export const recordTestSubmission = async (submission) => {
  try {
    const id = submission.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanSub = {
      ...submission,
      id,
      date: submission.date || new Date().toISOString(),
      user: cleanScholarName(submission.user || submission.name, submission.userEmail || submission.email),
      userEmail: (submission.userEmail || submission.email || '').toLowerCase().trim()
    };

    // 1. Save to LocalStorage
    const currentSubs = getStoredTestSubmissions();
    const updatedSubs = [cleanSub, ...currentSubs.filter(s => s.id !== id)];
    saveStoredTestSubmissions(updatedSubs);

    // 2. Broadcast via Supabase Realtime
    try {
      const ch = getRealtimeChannel();
      if (ch) {
        ch.send({
          type: 'broadcast',
          event: 'test_submission',
          payload: cleanSub
        });
      }
    } catch (e) {}

    // 3. Dispatch Local Window Event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lumixora_test_submission', { detail: cleanSub }));
    }

    // 4. Save to Firestore test_results
    if (db) {
      try {
        addDoc(collection(db, 'test_results'), cleanSub).catch(() => {});
      } catch (e) {}
    }

    return cleanSub;
  } catch (err) {
    console.warn('Error saving test submission:', err);
  }
};

export const notifyFounderTestSubmission = (submission) => {
  if (!submission) return;
  const scoreText = submission.score !== undefined && submission.total !== undefined
    ? `${submission.score}/${submission.total} (${Math.round((submission.score / submission.total) * 100)}%)`
    : '';

  // Record submission persistently to test_results
  recordTestSubmission(submission);

  // Dispatch real-time founder notification
  return recordFounderNotification({
    type: 'submission',
    name: submission.user || submission.userName || submission.name || 'Scholar',
    email: submission.userEmail || submission.email || '',
    role: submission.role || 'user',
    college: submission.college || 'GPREC',
    department: submission.department || submission.branch || 'CSE',
    testTitle: submission.testTitle || 'Assessment',
    score: submission.score,
    total: submission.total,
    details: `Completed ${submission.testTitle || 'Assessment'} · Score: ${scoreText}`
  });
};

export const notifyFounderDoubt = (doubt) => {
  if (!doubt) return;
  return recordFounderNotification({
    type: 'doubt',
    name: doubt.user || doubt.userName || 'Scholar',
    email: doubt.email || doubt.userEmail || '',
    role: 'user',
    college: doubt.college || 'GPREC',
    department: doubt.department || 'CSE',
    details: `Raised doubt in ${doubt.subject || doubt.tag || 'Academic'}: "${(doubt.topic || '').slice(0, 50)}..."`
  });
};

export const notifyFounderTask = (task) => {
  if (!task) return;
  return recordFounderNotification({
    type: 'task',
    name: task.user || task.userName || 'Scholar',
    email: task.email || task.userEmail || '',
    role: 'user',
    college: task.college || 'GPREC',
    department: task.department || 'CSE',
    details: `Completed assigned task: ${task.title || task.taskTitle || 'Timeline Task'}`
  });
};

// Aggregate All Strictly Genuine Live Notifications (Firestore Live Events + Live Storage + Real Database Registrations + Real Database Test Submissions)
export const buildAggregatedNotifications = (usersList = [], remoteNotifs = [], testResults = []) => {
  const readSet = getReadIds();
  const clearedIds = getClearedIds();
  const storedNotifs = getStoredNotifications();

  const map = new Map();
  const seenFingerprints = new Set();

  const parseItemTime = (item) => {
    if (item._sortTime && typeof item._sortTime === 'number') return item._sortTime;
    if (item.timestamp) {
      if (typeof item.timestamp.toMillis === 'function') return item.timestamp.toMillis();
      if (item.timestamp.seconds) return item.timestamp.seconds * 1000;
      if (typeof item.timestamp === 'number') return item.timestamp;
      const t = new Date(item.timestamp).getTime();
      if (!isNaN(t)) return t;
    }
    if (item.createdAt) {
      const t = new Date(item.createdAt).getTime();
      if (!isNaN(t)) return t;
    }
    if (item.created_at) {
      const t = new Date(item.created_at).getTime();
      if (!isNaN(t)) return t;
    }
    if (item.date) {
      const t = new Date(item.date).getTime();
      if (!isNaN(t)) return t;
    }
    return Date.now();
  };

  const processNotificationItem = (n, fallbackPrefix) => {
    if (!n) return;
    const email = (n.email || '').toLowerCase().trim();
    
    // Filter out anonymous guest sessions and randomized hash accounts
    if (
      email.includes('@scholar.lumixora.com') ||
      email.includes('anonymous') ||
      /^[a-z0-9]{18,}@/i.test(email) ||
      email.startsWith('guest_') ||
      email.startsWith('mock_')
    ) {
      return;
    }

    const cleanName = cleanScholarName(n.name, n.email);
    if (cleanName.includes('Rahul Sharma') || cleanName.includes('Sneha Reddy') || cleanName.includes('Kavita')) {
      return;
    }

    const rawTime = parseItemTime(n) || Date.now();

    // Deduplicate by content fingerprint
    const fingerprint = `${n.type || 'info'}_${email}_${n.testTitle || n.details || ''}_${Math.round(rawTime / 10000)}`;
    if (seenFingerprints.has(fingerprint)) return;
    seenFingerprints.add(fingerprint);

    const notifId = n.id || `${fallbackPrefix}_${rawTime}_${email || Math.random().toString(36).slice(2, 6)}`;
    if (clearedIds.has(notifId)) return;

    map.set(notifId, {
      ...n,
      id: notifId,
      name: cleanName,
      _sortTime: rawTime,
      createdAt: new Date(rawTime).toISOString(),
      read: readSet.has(notifId) || n.read === true
    });
  };

  // 1. Process Live Firestore remote notifications (Strictly real-time events)
  (remoteNotifs || []).forEach(n => processNotificationItem(n, 'remote'));

  // 2. Process Local stored live notifications (Strictly real-time events)
  (storedNotifs || []).forEach(n => processNotificationItem(n, 'stored'));

  // 3. Process Real Test Submissions
  (testResults || []).forEach((sub, idx) => {
    const rawTime = parseItemTime(sub) || Date.now();
    const email = (sub.userEmail || sub.email || '').toLowerCase().trim();
    const roll = sub.rollNumber || (email.endsWith('@gprec.ac.in') ? email.split('@')[0].toUpperCase() : '');
    processNotificationItem({
      id: sub.id || `test_real_${idx}_${rawTime}`,
      type: 'submission',
      name: cleanScholarName(sub.user || sub.userName || sub.name, email),
      email: email,
      rollNumber: roll,
      college: sub.college || 'GPREC',
      department: sub.department || sub.branch || 'CSM',
      testTitle: sub.testTitle || sub.test_title || 'Assessment Exam',
      score: sub.score,
      total: sub.total || sub.total_marks || 10,
      details: `Completed ${sub.testTitle || sub.test_title || 'Assessment Exam'} · Score: ${sub.score !== undefined ? sub.score : 0}/${sub.total || sub.total_marks || 10}`,
      _sortTime: rawTime
    }, 'test');
  });

  // 4. Process genuine user activity from usersList (Real student logins & registrations)
  (usersList || []).forEach((u, idx) => {
    if (!u || u.is_deleted || u.is_blocked) return;
    const email = (u.email || '').toLowerCase().trim();
    if (
      email.includes('@scholar.lumixora.com') ||
      email.includes('anonymous') ||
      /^[a-z0-9]{18,}@/i.test(email) ||
      email.startsWith('guest_')
    ) return;

    const rawTime = (u.created_at_raw ? u.created_at_raw : null) || (u.last_login ? new Date(u.last_login).getTime() : null) || parseItemTime(u);
    if (!rawTime) return;

    const roll = u.rollNumber || (email.endsWith('@gprec.ac.in') ? email.split('@')[0].toUpperCase() : '');
    const cleanName = cleanScholarName(u.name, email);
    const dept = u.department || u.branch || 'CSM';
    const col = u.college || 'GPREC';

    // If registered recently or active login:
    const isLogin = !!u.last_login;
    processNotificationItem({
      id: `usr_${isLogin ? 'login' : 'reg'}_${u.id || u.uid || email}_${rawTime}`,
      type: isLogin ? 'login' : 'register',
      name: cleanName,
      email: email,
      rollNumber: roll,
      role: u.role || 'user',
      college: col,
      department: dept,
      details: isLogin 
        ? `Active login session · ${dept} (${col}) ${roll ? `· Roll: ${roll}` : ''}`
        : `New scholar onboarded · ${dept} (${col}) ${roll ? `· Roll: ${roll}` : ''}`,
      _sortTime: rawTime
    }, 'user');
  });

  const all = Array.from(map.values());
  all.sort((a, b) => (b._sortTime || 0) - (a._sortTime || 0));
  return all.slice(0, 100);
};

// Mark all read helper
export const markNotificationsAsRead = (notifications) => {
  const readSet = getReadIds();
  (notifications || []).forEach(n => readSet.add(n.id));
  setReadIds(readSet);

  const stored = getStoredNotifications();
  const updated = stored.map(n => ({ ...n, read: true }));
  setStoredNotifications(updated);
};

// Mark single read helper
export const markSingleNotificationRead = (notifId) => {
  if (!notifId) return;
  const readSet = getReadIds();
  readSet.add(notifId);
  setReadIds(readSet);

  const stored = getStoredNotifications();
  const updated = stored.map(n => n.id === notifId ? { ...n, read: true } : n);
  setStoredNotifications(updated);
};

// Dismiss single notification helper
export const dismissSingleNotification = (notifId) => {
  if (!notifId) return;
  const clearedIds = getClearedIds();
  clearedIds.add(notifId);
  setClearedIds(clearedIds);

  const stored = getStoredNotifications();
  const filtered = stored.filter(n => n.id !== notifId);
  setStoredNotifications(filtered);
};

// Clear notifications helper
export const clearNotificationsStorage = async (currentNotifications = []) => {
  try {
    const now = Date.now();
    setClearedTimestamp(now);

    const clearedIds = getClearedIds();
    (currentNotifications || []).forEach(n => {
      if (n.id) clearedIds.add(n.id);
    });
    setClearedIds(clearedIds);

    localStorage.removeItem(NOTIF_STORAGE_KEY);
    setReadIds(new Set());
  } catch (e) {
    console.warn('Clear notifications error:', e);
  }
};
