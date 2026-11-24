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
import { getAllowedGprecRollNumbers, normalizeRollNumber } from './gprecPlacementAuth';

const STORAGE_LOGIN_LOGS_KEY = 'lumixora_login_activity_logs';
const STORAGE_CURRENT_SESSION_KEY = 'lumixora_current_session_id';

/**
 * Checks if a user or metadata belongs to GPREC and is in the authorized roster
 */
export const isGprecUserEntity = (entity = {}) => {
  if (!entity) return false;
  const email = (entity.email || '').toLowerCase().trim();
  const rollNumber = normalizeRollNumber(entity.rollNumber || entity.roll_no || (/\d{10}/.exec(email)?.[0] || ''));

  // 1. Explicit GPREC official placement coordinators
  if (
    email === 'dean.placements@gprec.ac.in' || 
    email === 'srikanth.csm@gprec.ac.in'
  ) {
    return true;
  }

  // 2. Allowed or whitelisted GPREC roll numbers ONLY
  if (rollNumber) {
    const allowed = getAllowedGprecRollNumbers().map(normalizeRollNumber);
    if (allowed.includes(rollNumber) || allowed.some(r => rollNumber.includes(r))) {
      return true;
    }
  }

  // Check if email contains an allowed roll number
  if (email.endsWith('@gprec.ac.in')) {
    const allowed = getAllowedGprecRollNumbers().map(normalizeRollNumber);
    if (allowed.some(r => email.includes(r))) {
      return true;
    }
  }

  return false;
};

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

    // 2. Persist to dedicated Firestore collection `gprec_placement_login_logs` if GPREC user, else general `user_login_logs`
    if (db) {
      try {
        const isGprec = isGprecUserEntity({ email, rollNumber: loginRecord.rollNumber });
        const targetCollection = isGprec ? 'gprec_placement_login_logs' : 'user_login_logs';

        await setDoc(doc(db, targetCollection, sessionId), {
          ...loginRecord,
          createdAt: serverTimestamp()
        });

        if (isGprec && supabase) {
          // Record dedicated isolated GPREC cloud session log
          supabase.from('founder_notifications').insert([{
            type: 'gprec_isolated_session_log',
            title: `GPREC Scholar Session: ${name}`,
            message: `Placement portal session for ${loginRecord.rollNumber || email}`,
            meta: {
              ...loginRecord,
              isGprecIsolated: true
            },
            read: true
          }]).then(() => {}).catch(() => {});
        }

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
 * Supports filtering strictly for institutional GPREC ecosystem when requested or on GPREC portals.
 */
export const fetchAllLoginLogs = async (options = {}) => {
  const { gprecOnly = true } = options;
  const mergedMap = new Map();

  // 1. Load from local cache first for instant UI response
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_LOGIN_LOGS_KEY) || '[]');
    local.forEach(log => {
      if (log.id) {
        if (!gprecOnly || isGprecUserEntity(log)) {
          mergedMap.set(log.id, log);
        }
      }
    });
  } catch (e) {}

  // 2. Fetch from Firestore dedicated collection `gprec_placement_login_logs` if gprecOnly
  if (db) {
    try {
      const collectionName = gprecOnly ? 'gprec_placement_login_logs' : 'user_login_logs';
      const q = query(
        collection(db, collectionName), 
        orderBy('loginTimestamp', 'desc'), 
        limit(200)
      );
      const snap = await getDocs(q);
      snap.forEach(docSnap => {
        const data = docSnap.data();
        if (!gprecOnly || isGprecUserEntity(data)) {
          mergedMap.set(docSnap.id, {
            id: docSnap.id,
            ...data
          });
        }
      });
    } catch (err) {
      // Graceful fallback to user_login_logs if empty
      if (gprecOnly) {
        try {
          const fallbackSnap = await getDocs(query(collection(db, 'user_login_logs'), limit(100)));
          fallbackSnap.forEach(docSnap => {
            const data = docSnap.data();
            if (isGprecUserEntity(data)) {
              mergedMap.set(docSnap.id, { id: docSnap.id, ...data });
            }
          });
        } catch (e) {}
      }
    }
  }

  // 3. Query dedicated isolated GPREC cloud session logs from Supabase
  if (supabase) {
    try {
      const targetType = gprecOnly ? 'gprec_isolated_session_log' : 'login';
      const { data: supaLogins, error: supaErr } = await supabase
        .from('founder_notifications')
        .select('*')
        .eq('type', targetType)
        .order('created_at', { ascending: false })
        .limit(200);

      if (!supaErr && Array.isArray(supaLogins)) {
        supaLogins.forEach(item => {
          const m = item.meta || {};
          const id = `supa_iso_${item.id}`;
          if (!mergedMap.has(id)) {
            const email = (m.email || '').toLowerCase().trim();
            if (gprecOnly && !isGprecUserEntity(m)) {
              return;
            }

            const timeVal = new Date(item.created_at).getTime();
            const roleMeta = deriveUserRoleMeta(m);
            const isVeryRecent = (Date.now() - timeVal) < 15 * 60 * 1000;

            mergedMap.set(id, {
              id,
              userId: m.userId || m.appId || id,
              name: cleanScholarName(m.name || item.title?.replace('GPREC Scholar Session: ', ''), email),
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
      console.warn('Supabase isolated login logs notice:', err);
    }
  }

  // Convert map to array sorted by loginTimestamp desc
  const allLogs = Array.from(mergedMap.values()).sort((a, b) => {
    const timeA = a.loginTimestamp || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
    const timeB = b.loginTimestamp || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
    return timeB - timeA;
  });

  // Deduplicate rapid repeat login clicks from the same user within a 10-minute window
  const dedupedResult = [];
  const sessionClusterMap = new Map();

  allLogs.forEach(log => {
    const userIdentifier = (log.rollNumber || log.email || log.userId || '').toLowerCase().trim();
    const timeVal = log.loginTimestamp || (log.createdAt?.seconds ? log.createdAt.seconds * 1000 : 0);
    
    // Group logins within 10 minutes (600,000 ms)
    const clusterBucket = Math.floor(timeVal / 600000);
    const clusterKey = `${userIdentifier}_${clusterBucket}`;

    if (!sessionClusterMap.has(clusterKey)) {
      sessionClusterMap.set(clusterKey, true);
      dedupedResult.push(log);
    }
  });

  return dedupedResult;
};
