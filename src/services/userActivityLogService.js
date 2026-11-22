/**
 * userActivityLogService.js
 * Comprehensive Audit & Telemetry Service for Platform Logins, Session Durations & Time Logs
 * Tracks Scholars, TPO Placement Officers, Faculty Coordinators, and Founder Access across all portals.
 */

import { db } from '../config/firebase';
import { supabase } from '../config/supabase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { cleanScholarName } from './founderNotificationService';

const STORAGE_LOGIN_LOGS_KEY = 'lumixora_login_activity_logs';
const STORAGE_CURRENT_SESSION_KEY = 'lumixora_current_session_id';

/**
 * Derives user category badge and readable role title
 */
export const deriveUserRoleMeta = (user) => {
  const email = (user?.email || '').toLowerCase().trim();
  const role = (user?.role || '').toLowerCase().trim();
  const isOfficer = user?.isOfficer || user?.isDean || email === 'dean.placements@gprec.ac.in' || email === 'srikanth.csm@gprec.ac.in';

  if (role === 'founder' || email === 'founder@lumixora.com') {
    return {
      category: 'founder',
      title: 'Founder / Executive Admin',
      badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
    };
  }

  if (isOfficer || email === 'dean.placements@gprec.ac.in') {
    return {
      category: 'tpo',
      title: email === 'srikanth.csm@gprec.ac.in' ? 'CSM TPO Coordinator' : 'Dean of Placements (TPO)',
      badgeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
    };
  }

  if (role === 'faculty' || role === 'mentor' || role === 'teacher' || !!user?.designation) {
    return {
      category: 'faculty',
      title: user?.designation || 'Faculty Coordinator / Mentor',
      badgeClass: 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
    };
  }

  return {
    category: 'student',
    title: 'Scholar / Candidate',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
  };
};

/**
 * Format relative time (e.g. 2m ago, 1h ago)
 */
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  const time = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
  if (isNaN(time)) return 'Just now';
  
  const diffSec = Math.floor((Date.now() - time) / 1000);
  if (diffSec < 45) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
};

/**
 * Format session duration in human readable string
 */
export const formatDuration = (seconds, isActive = false) => {
  if (!seconds || seconds <= 0) {
    return isActive ? 'Active (<1m)' : '1 min';
  }
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;

  if (hrs > 0) {
    return `${hrs}h ${remMins}m`;
  }
  return `${Math.max(1, mins)} min${mins !== 1 ? 's' : ''}`;
};

/**
 * Records a new login event across Firestore, Supabase, and localStorage
 */
export const recordUserLogin = async (user, portal = 'Placement Suite') => {
  if (!user || (!user.email && !user.id)) return null;

  try {
    const email = (user.email || '').toLowerCase().trim();
    const name = cleanScholarName(user.name || user.displayName, email);
    const roleMeta = deriveUserRoleMeta(user);
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date();
    const timestamp = now.getTime();

    // Determine device & browser info
    let userAgent = 'Web Browser';
    if (typeof navigator !== 'undefined') {
      userAgent = navigator.userAgent;
    }
    const isMobile = /Android|iPhone|iPad/i.test(userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';

    const loginRecord = {
      id: sessionId,
      sessionId,
      userId: user.id || user.uid || email,
      name,
      email,
      role: roleMeta.category,
      roleTitle: roleMeta.title,
      college: user.college || user.collegeName || 'G. Pulla Reddy Engineering College (Autonomous)',
      collegeCode: user.collegeCode || 'GPREC',
      department: user.department || user.branch || (email.includes('csm') ? 'CSM' : 'CSE'),
      rollNumber: user.rollNumber || user.roll_no || (/\d{10}/.exec(email)?.[0] || ''),
      portal,
      deviceType,
      userAgent: userAgent.slice(0, 150),
      loginTimestamp: timestamp,
      loginTimeFormatted: now.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      lastActiveAt: timestamp,
      durationSeconds: 0,
      status: 'active'
    };

    // 1. Cache current session ID locally
    try {
      localStorage.setItem(STORAGE_CURRENT_SESSION_KEY, sessionId);
      const existing = JSON.parse(localStorage.getItem(STORAGE_LOGIN_LOGS_KEY) || '[]');
      const updated = [loginRecord, ...existing.filter(item => item.id !== sessionId)].slice(0, 300);
      localStorage.setItem(STORAGE_LOGIN_LOGS_KEY, JSON.stringify(updated));
    } catch (e) {}

    // 2. Persist to Firestore collection `user_login_logs`
    if (db) {
      try {
        await setDoc(doc(db, 'user_login_logs', sessionId), {
          ...loginRecord,
          createdAt: serverTimestamp()
        });

        // Update user document with lastLoginAt
        if (user.id || user.uid) {
          const userRef = doc(db, 'users', user.id || user.uid);
          updateDoc(userRef, {
            lastLoginAt: now.toISOString(),
            lastLoginTimestamp: timestamp,
            lastPortal: portal,
            lastSessionId: sessionId
          }).catch(() => {});
        }
      } catch (err) {
        console.warn('Firestore login record notice:', err.message);
      }
    }

    return loginRecord;
  } catch (error) {
    console.warn('recordUserLogin error:', error);
    return null;
  }
};

/**
 * Periodically updates heartbeat for the active user session
 */
export const recordSessionHeartbeat = async (user) => {
  if (typeof window === 'undefined') return;
  const sessionId = localStorage.getItem(STORAGE_CURRENT_SESSION_KEY);
  if (!sessionId) return;

  try {
    const now = Date.now();
    const existingLogs = JSON.parse(localStorage.getItem(STORAGE_LOGIN_LOGS_KEY) || '[]');
    const idx = existingLogs.findIndex(s => s.sessionId === sessionId);
    
    let durationSeconds = 0;
    if (idx !== -1) {
      const start = existingLogs[idx].loginTimestamp || now;
      durationSeconds = Math.max(0, Math.floor((now - start) / 1000));
      existingLogs[idx].lastActiveAt = now;
      existingLogs[idx].durationSeconds = durationSeconds;
      existingLogs[idx].status = 'active';
      localStorage.setItem(STORAGE_LOGIN_LOGS_KEY, JSON.stringify(existingLogs));
    }

    if (db) {
      const docRef = doc(db, 'user_login_logs', sessionId);
      updateDoc(docRef, {
        lastActiveAt: now,
        durationSeconds,
        status: 'active'
      }).catch(() => {});
    }
  } catch (e) {}
};

/**
 * Fetches all platform login history and time logs
 * Combines Firestore login logs, user directory, and fallback offline records.
 */
export const fetchAllLoginLogs = async () => {
  const mergedMap = new Map();

  // 1. Load from local cache first for instant UI response
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_LOGIN_LOGS_KEY) || '[]');
    local.forEach(log => {
      if (log.id) mergedMap.set(log.id, log);
    });
  } catch (e) {}

  // 2. Fetch from Firestore `user_login_logs` collection
  if (db) {
    try {
      const q = query(
        collection(db, 'user_login_logs'), 
        orderBy('loginTimestamp', 'desc'), 
        limit(200)
      );
      const snap = await getDocs(q);
      snap.forEach(docSnap => {
        const data = docSnap.data();
        mergedMap.set(docSnap.id, {
          id: docSnap.id,
          ...data
        });
      });
    } catch (err) {
      console.warn('Error querying user_login_logs:', err.message);
    }

    // 3. Merge users collection with lastLoginAt info if not already captured
    try {
      const usersSnap = await getDocs(query(collection(db, 'users'), limit(150)));
      usersSnap.forEach(uDoc => {
        const u = uDoc.data();
        if (u.email && u.lastLoginTimestamp) {
          const fallbackId = `user_last_${uDoc.id}`;
          if (!mergedMap.has(fallbackId)) {
            const roleMeta = deriveUserRoleMeta(u);
            mergedMap.set(fallbackId, {
              id: fallbackId,
              userId: uDoc.id,
              name: cleanScholarName(u.name || u.displayName, u.email),
              email: u.email,
              role: roleMeta.category,
              roleTitle: roleMeta.title,
              college: u.college || 'GPREC',
              department: u.department || u.branch || 'CSE',
              rollNumber: u.rollNumber || (/\d{10}/.exec(u.email)?.[0] || ''),
              portal: u.lastPortal || 'Placement Suite',
              deviceType: 'Desktop',
              loginTimestamp: u.lastLoginTimestamp,
              loginTimeFormatted: new Date(u.lastLoginTimestamp).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }),
              lastActiveAt: u.lastLoginTimestamp,
              durationSeconds: 1800,
              status: (Date.now() - u.lastLoginTimestamp) < 15 * 60 * 1000 ? 'active' : 'completed'
            });
          }
        }
      });
    } catch (e) {}
  }

  // 4. Query real login audit telemetry from Supabase founder_notifications
  if (supabase) {
    try {
      const { data: supaLogins, error: supaErr } = await supabase
        .from('founder_notifications')
        .select('*')
        .eq('type', 'login')
        .order('created_at', { ascending: false })
        .limit(200);

      if (!supaErr && Array.isArray(supaLogins)) {
        supaLogins.forEach(item => {
          const m = item.meta || {};
          const id = `supa_log_${item.id}`;
          if (!mergedMap.has(id)) {
            const timeVal = new Date(item.created_at).getTime();
            const email = (m.email || '').toLowerCase().trim();
            const roleMeta = deriveUserRoleMeta(m);
            const isVeryRecent = (Date.now() - timeVal) < 15 * 60 * 1000;

            mergedMap.set(id, {
              id,
              userId: m.userId || m.appId || id,
              name: cleanScholarName(m.name || item.title?.replace('Active Scholar Login: ', ''), email),
              email,
              role: roleMeta.category,
              roleTitle: roleMeta.title,
              college: m.college || 'G. Pulla Reddy Engineering College (Autonomous)',
              collegeCode: 'GPREC',
              department: m.department || 'CSE',
              rollNumber: m.rollNumber || (/\d{10}/.exec(email)?.[0] || ''),
              portal: m.portal || 'Placement Suite',
              deviceType: m.deviceType || 'Desktop (Web Browser)',
              userAgent: m.userAgent || 'Web Browser',
              loginTimestamp: timeVal,
              loginTimeFormatted: new Date(timeVal).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }),
              lastActiveAt: timeVal,
              durationSeconds: isVeryRecent ? Math.floor((Date.now() - timeVal) / 1000) : 1800,
              status: isVeryRecent ? 'active' : 'completed'
            });
          }
        });
      }
    } catch (err) {
      console.warn('Supabase login logs fetch notice:', err);
    }
  }

  // Convert map to array sorted by loginTimestamp desc
  const result = Array.from(mergedMap.values()).sort((a, b) => {
    const timeA = a.loginTimestamp || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
    const timeB = b.loginTimestamp || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
    return timeB - timeA;
  });

  return result;
};
