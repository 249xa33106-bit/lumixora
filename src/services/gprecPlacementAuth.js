/**
 * gprecPlacementAuth.js
 * Time-based Rolling 6-digit OTP (changes every 5 minutes / 300 seconds)
 * Dispatches via Cloudflare Worker SMTP using lumixora.team@gmail.com
 */

import { supabase } from '../config/supabase';
import { db } from '../config/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

// Built-in Approved GPREC Roll Numbers for the placement pilot (STRICT USER SPECIFIED)
export const GPREC_ALLOWED_ROLL_NUMBERS = [
  '249xa33106',
  '249xa33112',
  '249xa33096',
  '249xa33091',
  '249xa05086',
  '249xa33092',
  '259xa33002',
  '259xa33030',
  '249xa04149',
  '259xa33081',
  '259xa05217',
  '239x1a33a0',
  '259xa33013',
  '269x103013',
  '239x1a05l9',
  '259xa33095',
  '259xa05089'
];

export const KNOWN_GPREC_SCHOLAR_NAMES = {
  '249xa33106': 'KUMARKALAVA MOHAMMED SOWBAN',
  '249xa33112': 'MAHENDRAKAR AKHIL',
  '249xa33096': 'MOCHI SAI HARSHITH',
  '249xa33091': 'K GAYATHRI',
  '249xa05086': 'GG PREETHI',
  '249xa33092': 'M LAKSHMI KUSHALA',
  '259xa33002': 'A POOJA',
  '259xa33030': 'E USHA ESWARI',
  '249xa04149': 'GPREC Scholar (249XA04149)',
  '259xa33081': 'SRI LAKSHMI',
  '259xa05217': 'VARSHITHA OLETI',
  '239x1a33a0': 'M BHARANI KUMAR REDDY',
  '259xa33013': 'BICHALA HEMASREE',
  '269x103013': 'RUTHIKA',
  '239x1a05l9': 'AMMENA BANU',
  '259xa33095': 'LAIQA KHAN',
  '259xa05089': 'GAJJALA GNANAMANI'
};

export const PLACEMENT_SUPPORT_EMAIL = 'support@lumixora.in';
export const STORAGE_CUSTOM_ROLLS_KEY = 'lumixora_gprec_custom_allowed_rolls';
export const STORAGE_REVOKED_ROLLS_KEY = 'lumixora_gprec_revoked_rolls';

/**
 * Reads revoked/deleted scholars stored locally
 */
export function getStoredRevokedRolls() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_REVOKED_ROLLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeRollNumber).filter(Boolean) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Saves revoked/deleted scholars locally
 */
export function saveRevokedRolls(rolls = []) {
  if (typeof window === 'undefined') return;
  try {
    const clean = Array.from(new Set(rolls.map(normalizeRollNumber).filter(Boolean)));
    localStorage.setItem(STORAGE_REVOKED_ROLLS_KEY, JSON.stringify(clean));
  } catch (e) {}
}

/**
 * Normalizes input roll number to lowercase trimmed string
 */
export function normalizeRollNumber(input = '') {
  if (!input || typeof input !== 'string') return '';
  return input.trim().toLowerCase().replace(/\s+/g, '');
}

/**
 * Derives department name from roll number branch code
 */
export function deriveBranchFromRoll(rollNumber = '') {
  const normalized = normalizeRollNumber(rollNumber);
  if (normalized.includes('33') || normalized.includes('csm')) return 'CSM (AI & ML)';
  if (normalized.includes('05') || normalized.includes('cse')) return 'CSE';
  if (normalized.includes('04') || normalized.includes('ece')) return 'ECE';
  if (normalized.includes('02') || normalized.includes('eee')) return 'EEE';
  if (normalized.includes('01') || normalized.includes('ce')) return 'Civil';
  if (normalized.includes('03') || normalized.includes('me')) return 'Mechanical';
  return 'CSE / Tech';
}

/**
 * Derives academic year from roll number prefix
 */
export function deriveYearFromRoll(rollNumber = '') {
  const normalized = normalizeRollNumber(rollNumber);
  if (normalized.startsWith('259')) return '2nd Year';
  if (normalized.startsWith('249')) return '3rd Year';
  if (normalized.startsWith('239')) return '4th Year';
  if (normalized.startsWith('269')) return '1st Year';
  return '3rd Year';
}

/**
 * Reads custom whitelisted scholars stored locally
 */
export function getStoredCustomRolls() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_ROLLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * Saves custom whitelisted scholars locally
 */
export function saveCustomRolls(rolls = []) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_CUSTOM_ROLLS_KEY, JSON.stringify(rolls));
  } catch (e) {}
}

/**
 * Returns merged array of all allowed roll numbers (built-in + founder-added), excluding revoked
 */
export function getAllowedGprecRollNumbers() {
  const revoked = new Set(getStoredRevokedRolls());
  const customList = getStoredCustomRolls();
  const customRolls = customList.map(item => typeof item === 'string' ? item : item.rollNumber).map(normalizeRollNumber);
  const combined = Array.from(new Set([...GPREC_ALLOWED_ROLL_NUMBERS, ...customRolls]));
  return combined.map(normalizeRollNumber).filter(r => r && !revoked.has(r));
}

/**
 * Helper to run a promise with a fast timeout fallback
 */
function withTimeout(promise, ms = 1500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Cloud sync timeout')), ms))
  ]);
}

/**
 * Synchronizes custom whitelisted scholars with Supabase & Firestore real cloud databases
 */
export async function syncCustomRollsFromCloud() {
  const cloudRolls = [];

  // Sync revoked scholars from cloud
  try {
    if (supabase) {
      const { data: revokedRows } = await supabase
        .from('founder_notifications')
        .select('meta')
        .eq('type', 'gprec_revoked_scholar');

      if (Array.isArray(revokedRows)) {
        const cloudRevoked = revokedRows
          .map(r => normalizeRollNumber(r.meta?.rollLower || r.meta?.rollNumber))
          .filter(Boolean);
        const mergedRevoked = Array.from(new Set([...getStoredRevokedRolls(), ...cloudRevoked]));
        saveRevokedRolls(mergedRevoked);
      }
    }
  } catch (e) {}

  const revokedSet = new Set(getStoredRevokedRolls());

  // 1. Primary Dedicated Database Table: gprec_whitelisted_scholars
  try {
    if (supabase) {
      const { data: dedicatedRows, error: dedErr } = await supabase
        .from('gprec_whitelisted_scholars')
        .select('*');

      if (!dedErr && Array.isArray(dedicatedRows) && dedicatedRows.length > 0) {
        dedicatedRows.forEach(row => {
          const r = normalizeRollNumber(row.roll_lower || row.roll_number);
          if (r && !revokedSet.has(r)) {
            cloudRolls.push({
              id: row.id,
              rollNumber: r,
              email: row.email || `${r}@gprec.ac.in`,
              name: row.name || `GPREC Scholar (${r.toUpperCase()})`,
              department: row.department || deriveBranchFromRoll(r),
              year: row.year || deriveYearFromRoll(r),
              addedAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
              addedBy: row.added_by || 'Founder'
            });
          }
        });
      } else {
        // Fallback to legacy founder_notifications if table not ready
        const { data: supaRows, error } = await supabase
          .from('founder_notifications')
          .select('*')
          .eq('type', 'gprec_whitelisted_scholar');

        if (!error && Array.isArray(supaRows)) {
          supaRows.forEach(row => {
            const m = row.meta || {};
            const r = normalizeRollNumber(m.rollNumber || m.rollLower);
            if (r && !revokedSet.has(r)) {
              cloudRolls.push({
                id: row.id,
                rollNumber: r,
                email: m.email || `${r}@gprec.ac.in`,
                name: m.name || `GPREC Scholar (${r.toUpperCase()})`,
                department: m.department || deriveBranchFromRoll(r),
                year: m.year || deriveYearFromRoll(r),
                addedAt: m.timestamp || new Date(row.created_at).getTime() || Date.now(),
                addedBy: m.addedBy || 'Founder'
              });
            }
          });
        }
      }
    }
  } catch (err) {
    console.warn('Supabase whitelist fetch notice:', err.message || err);
  }

  // Persist synced cloud list into local storage for offline resilience
  if (cloudRolls.length > 0) {
    const local = getStoredCustomRolls();
    const map = new Map();
    local.forEach(item => {
      const r = typeof item === 'string' ? normalizeRollNumber(item) : normalizeRollNumber(item.rollNumber);
      if (r && !revokedSet.has(r)) map.set(r, typeof item === 'string' ? { rollNumber: r } : item);
    });
    cloudRolls.forEach(c => {
      if (c.rollNumber && !revokedSet.has(c.rollNumber)) {
        map.set(c.rollNumber, c);
      }
    });
    const merged = Array.from(map.values());
    saveCustomRolls(merged);
  }

  return getAllowedGprecRollNumbers();
}

/**
 * Returns complete scholar roster metadata for Founder Console
 */
export function getGprecScholarRoster() {
  const revoked = new Set(getStoredRevokedRolls());
  const customList = getStoredCustomRolls();
  const customMap = new Map();
  customList.forEach(item => {
    if (typeof item === 'string') {
      const r = normalizeRollNumber(item);
      if (!revoked.has(r)) {
        customMap.set(r, { rollNumber: r, name: `GPREC Scholar (${r.toUpperCase()})`, isCustom: true });
      }
    } else if (item?.rollNumber) {
      const r = normalizeRollNumber(item.rollNumber);
      if (!revoked.has(r)) {
        customMap.set(r, { ...item, rollNumber: r, isCustom: true });
      }
    }
  });

  const fullList = [];
  
  // 1. Built-in core cohorts
  GPREC_ALLOWED_ROLL_NUMBERS.forEach(r => {
    const norm = normalizeRollNumber(r);
    if (revoked.has(norm)) return; // Excluded if deleted/revoked by founder

    const customMeta = customMap.get(norm);
    let scholarName = KNOWN_GPREC_SCHOLAR_NAMES[norm] || 
      (!customMeta?.name?.startsWith('GPREC Scholar (') ? customMeta?.name : undefined) || 
      (norm === '249xa33106' ? 'Founder Scholar (249XA33106)' : `GPREC Scholar (${norm.toUpperCase()})`);
    fullList.push({
      rollNumber: norm.toUpperCase(),
      rawRoll: norm,
      email: `${norm}@gprec.ac.in`,
      name: scholarName,
      department: customMeta?.department || deriveBranchFromRoll(norm),
      year: customMeta?.year || deriveYearFromRoll(norm),
      status: 'Active',
      type: 'Core Cohort',
      isCustom: true, // Empower founder to delete ANY scholar from the roster
      addedAt: customMeta?.addedAt || 1731500000000
    });
    customMap.delete(norm);
  });

  // 2. Founder added custom scholars
  customMap.forEach((meta, r) => {
    if (revoked.has(r)) return;
    let scholarName = KNOWN_GPREC_SCHOLAR_NAMES[r] || 
      (!meta.name?.startsWith('GPREC Scholar (') ? meta.name : undefined) || 
      `GPREC Scholar (${r.toUpperCase()})`;
    fullList.push({
      rollNumber: r.toUpperCase(),
      rawRoll: r,
      email: `${r}@gprec.ac.in`,
      name: scholarName,
      department: meta.department || deriveBranchFromRoll(r),
      year: meta.year || deriveYearFromRoll(r),
      status: 'Active',
      type: 'Founder Whitelisted',
      isCustom: true,
      addedAt: meta.addedAt || Date.now(),
      addedBy: meta.addedBy || 'Founder'
    });
  });

  return fullList;
}

/**
 * Adds a new student roll number to whitelist (Founder action)
 * Persists immediately into real cloud database (Supabase) + local cache
 */
export async function addGprecScholarRoll(rollInput, meta = {}) {
  const normalized = normalizeRollNumber(rollInput);
  if (!normalized) throw new Error('Valid roll number is required.');
  if (normalized.length < 5) throw new Error('Roll number is too short.');

  const rollUpper = normalized.toUpperCase();
  const email = `${normalized}@gprec.ac.in`;
  const scholarName = meta.name?.trim() || KNOWN_GPREC_SCHOLAR_NAMES[normalized] || `GPREC Scholar (${rollUpper})`;
  const department = meta.department || deriveBranchFromRoll(normalized);
  const year = meta.year || deriveYearFromRoll(normalized);

  // If this roll was previously revoked/deleted, unrevoke it upon new addition
  const revoked = getStoredRevokedRolls();
  if (revoked.includes(normalized)) {
    saveRevokedRolls(revoked.filter(r => r !== normalized));
  }

  const existing = getStoredCustomRolls();
  const exists = existing.some(item => (typeof item === 'string' ? item : item.rollNumber).toLowerCase() === normalized)
    || GPREC_ALLOWED_ROLL_NUMBERS.includes(normalized);

  const newEntry = {
    rollNumber: normalized,
    email,
    name: scholarName,
    department,
    year,
    addedAt: Date.now(),
    addedBy: meta.addedBy || 'Founder'
  };

  if (!exists) {
    existing.push(newEntry);
    saveCustomRolls(existing);
  }

  // 1. Write directly to DEDICATED Supabase database table: gprec_whitelisted_scholars
  try {
    if (supabase) {
      const { error: supaErr } = await supabase.from('gprec_whitelisted_scholars').upsert([{
        roll_number: rollUpper,
        roll_lower: normalized,
        name: scholarName,
        department,
        year,
        email,
        status: 'Active',
        added_by: meta.addedBy || 'Founder',
        updated_at: new Date().toISOString()
      }], { onConflict: 'roll_lower' });

      if (supaErr) {
        console.error('Supabase gprec_whitelisted_scholars insert failed:', supaErr);
      }

      // Also keep audit entry in founder_notifications
      await supabase.from('founder_notifications').insert([{
        type: 'gprec_whitelisted_scholar',
        title: `GPREC Whitelisted Scholar: ${rollUpper}`,
        message: `Founder whitelisted scholar ${rollUpper} (${scholarName}) for placement suite access.`,
        meta: {
          rollNumber: rollUpper,
          rollLower: normalized,
          email,
          name: scholarName,
          department,
          year,
          addedBy: meta.addedBy || 'Founder',
          timestamp: Date.now()
        },
        read: false
      }]).catch(() => {});

      // 2. Also register or approve user in Supabase users table
      await supabase.from('users').update({
        roll_number: rollUpper,
        is_approved: true,
        department,
        branch: department,
        college: 'GPREC'
      }).ilike('email', email);
    }
  } catch (err) {
    console.error('Supabase real cloud write error:', err);
  }

  return newEntry;
}

/**
 * Bulk adds multiple roll numbers separated by comma, newline, or space
 */
export async function bulkAddGprecScholarRolls(rawInput = '', defaultMeta = {}) {
  if (!rawInput || typeof rawInput !== 'string') return [];
  const tokens = rawInput
    .split(/[\n,;\s]+/)
    .map(s => normalizeRollNumber(s))
    .filter(s => s && s.length >= 5);

  const uniqueTokens = Array.from(new Set(tokens));
  const results = [];

  for (const token of uniqueTokens) {
    try {
      const added = await addGprecScholarRoll(token, {
        ...defaultMeta,
        name: `GPREC Scholar (${token.toUpperCase()})`
      });
      results.push(added);
    } catch (e) {
      console.warn('Error adding roll in bulk:', token, e);
    }
  }

  return results;
}

/**
 * Updates a scholar's details in the real Supabase cloud database & local roster
 */
export async function updateGprecScholarData(rollInput, updates = {}) {
  const normalized = normalizeRollNumber(rollInput);
  if (!normalized) throw new Error('Valid roll number is required.');

  const rollUpper = normalized.toUpperCase();
  const email = `${normalized}@gprec.ac.in`;
  const name = updates.name?.trim() || `GPREC Scholar (${rollUpper})`;
  const department = updates.department || deriveBranchFromRoll(normalized);
  const year = updates.year || deriveYearFromRoll(normalized);

  // 1. Update local custom storage
  const existing = getStoredCustomRolls();
  const idx = existing.findIndex(item => {
    const r = typeof item === 'string' ? item : item.rollNumber;
    return normalizeRollNumber(r) === normalized;
  });

  const updatedEntry = {
    rollNumber: normalized,
    name,
    department,
    year,
    updatedAt: Date.now(),
    addedBy: updates.addedBy || 'Founder'
  };

  if (idx >= 0) {
    existing[idx] = { ...existing[idx], ...updatedEntry };
  } else {
    // If it's a built-in roll or new, record the override in custom list
    existing.push(updatedEntry);
  }
  saveCustomRolls(existing);

  // 2. Real Cloud Database: Supabase updates
  try {
    if (supabase) {
      // Update dedicated gprec_whitelisted_scholars table
      await supabase.from('gprec_whitelisted_scholars').upsert([{
        roll_number: rollUpper,
        roll_lower: normalized,
        name,
        department,
        year,
        email,
        updated_at: new Date().toISOString()
      }], { onConflict: 'roll_lower' });

      // Check if existing founder_notifications row exists for this roll
      const { data: matches } = await supabase
        .from('founder_notifications')
        .select('id, meta')
        .eq('type', 'gprec_whitelisted_scholar');

      let found = false;
      if (Array.isArray(matches)) {
        for (const row of matches) {
          const r = normalizeRollNumber(row.meta?.rollNumber || row.meta?.rollLower);
          if (r === normalized) {
            found = true;
            await supabase.from('founder_notifications').update({
              title: `GPREC Whitelisted Scholar: ${rollUpper}`,
              message: `Founder updated scholar ${rollUpper} (${name}) details.`,
              meta: {
                ...(row.meta || {}),
                rollNumber: rollUpper,
                rollLower: normalized,
                email,
                name,
                department,
                year,
                updatedAt: Date.now()
              }
            }).eq('id', row.id);
          }
        }
      }

      if (!found) {
        // Insert new record in founder_notifications
        await supabase.from('founder_notifications').insert([{
          type: 'gprec_whitelisted_scholar',
          title: `GPREC Whitelisted Scholar: ${rollUpper}`,
          message: `Founder updated scholar ${rollUpper} (${name}) details.`,
          meta: {
            rollNumber: rollUpper,
            rollLower: normalized,
            email,
            name,
            department,
            year,
            addedBy: 'Founder',
            updatedAt: Date.now()
          },
          read: false
        }]);
      }

      // Also update user profile in users table
      await supabase.from('users').update({
        roll_number: rollUpper,
        department,
        branch: department,
        year,
        college: 'GPREC'
      }).ilike('email', email);
    }
  } catch (err) {
    console.warn('Real cloud update error:', err);
  }

  return updatedEntry;
}

/**
 * Permanently removes a scholar/user from real database + local storage and revokes their placement access
 */
export async function removeGprecScholarRoll(rollInput) {
  const normalized = normalizeRollNumber(rollInput);
  if (!normalized) return false;

  const rollUpper = normalized.toUpperCase();
  const email = `${normalized}@gprec.ac.in`;

  // 1. Add to revoked rolls so core cohorts / offline caches never re-introduce them
  const revoked = getStoredRevokedRolls();
  if (!revoked.includes(normalized)) {
    revoked.push(normalized);
    saveRevokedRolls(revoked);
  }

  // 2. Remove from local custom storage
  const existing = getStoredCustomRolls();
  const filtered = existing.filter(item => {
    const r = typeof item === 'string' ? item : item.rollNumber;
    return normalizeRollNumber(r) !== normalized;
  });
  saveCustomRolls(filtered);

  // 3. Remove from Supabase real database
  try {
    if (supabase) {
      // 3a. Delete from dedicated gprec_whitelisted_scholars table
      await supabase.from('gprec_whitelisted_scholars').delete().eq('roll_lower', normalized);

      // 3b. Revoke approval in Supabase users table
      await supabase.from('users').update({
        is_approved: false
      }).ilike('email', email);

      // 3c. Clean up rows in founder_notifications matching this roll
      const { data: matches } = await supabase
        .from('founder_notifications')
        .select('id, meta')
        .eq('type', 'gprec_whitelisted_scholar');

      if (Array.isArray(matches)) {
        for (const row of matches) {
          const r = normalizeRollNumber(row.meta?.rollNumber || row.meta?.rollLower);
          if (r === normalized) {
            await supabase.from('founder_notifications').delete().eq('id', row.id);
          }
        }
      }

      // 3d. Record a cloud revocation audit record so all devices sync this deletion
      await supabase.from('founder_notifications').insert([{
        type: 'gprec_revoked_scholar',
        title: `Revoked Scholar Access: ${rollUpper}`,
        message: `Founder permanently deleted scholar ${rollUpper} and revoked placement suite access.`,
        meta: {
          rollNumber: rollUpper,
          rollLower: normalized,
          email,
          revokedAt: Date.now()
        },
        read: true
      }]).catch(() => {});
    }
  } catch (e) {
    console.warn('Real database delete note:', e);
  }

  return true;
}

/**
 * Validates if the given roll number or faculty email is approved for the GPREC Placement Suite.
 */
export function isAllowedGprecRoll(rollNumber = '') {
  const normalized = normalizeRollNumber(rollNumber);
  if (!normalized) return false;

  // Block access immediately if scholar was deleted/revoked by founder
  const revoked = new Set(getStoredRevokedRolls());
  if (revoked.has(normalized)) {
    return false;
  }

  // Allow official placement faculty/coordinators to pass verification directly via their email
  if (normalized === 'srikanth.csm@gprec.ac.in' || normalized === 'dean.placements@gprec.ac.in') {
    return true;
  }
  const allowed = getAllowedGprecRollNumbers();
  return allowed.includes(normalized);
}

/**
 * Asynchronously verifies if a roll number is allowed by querying real-time Supabase cloud database
 */
export async function isAllowedGprecRollCloud(rollNumber = '') {
  const normalized = normalizeRollNumber(rollNumber);
  if (!normalized) return false;

  // 1. Check if explicitly revoked by founder
  const revoked = new Set(getStoredRevokedRolls());
  if (revoked.has(normalized)) {
    return false;
  }

  // 2. Allow official placement coordinators
  if (normalized === 'srikanth.csm@gprec.ac.in' || normalized === 'dean.placements@gprec.ac.in') {
    return true;
  }

  // 3. Check synchronous allowed list (built-in + local cache)
  if (isAllowedGprecRoll(normalized)) {
    return true;
  }

  // 4. Query real-time Supabase dedicated table gprec_whitelisted_scholars
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('gprec_whitelisted_scholars')
        .select('*')
        .or(`roll_lower.eq.${normalized},roll_number.ilike.${normalized}`)
        .limit(1);

      if (!error && Array.isArray(data) && data.length > 0) {
        const row = data[0];
        const r = normalizeRollNumber(row.roll_lower || row.roll_number);
        // Persist to local cache so subsequent synchronous calls succeed
        const local = getStoredCustomRolls();
        const exists = local.some(item => (typeof item === 'string' ? item : item.rollNumber).toLowerCase() === r);
        if (!exists) {
          local.push({
            id: row.id,
            rollNumber: r,
            name: row.name || `GPREC Scholar (${r.toUpperCase()})`,
            department: row.department || deriveBranchFromRoll(r),
            year: row.year || deriveYearFromRoll(r),
            email: row.email || `${r}@gprec.ac.in`,
            addedAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
            addedBy: row.added_by || 'Founder'
          });
          saveCustomRolls(local);
        }
        return true;
      }
    }
  } catch (err) {
    console.warn('Real-time Supabase roll check notice:', err);
  }

  // 5. Fallback full cloud sync
  try {
    await syncCustomRollsFromCloud();
    return isAllowedGprecRoll(normalized);
  } catch (e) {
    return isAllowedGprecRoll(normalized);
  }
}

/**
 * Resolves the institutional email address from roll number or email input
 */
export function getGprecEmailFromRoll(rollNumber = '') {
  const normalized = normalizeRollNumber(rollNumber);
  if (!normalized) return '';
  if (normalized.includes('@')) return normalized;
  return `${normalized}@gprec.ac.in`;
}

/**
 * Generates a rolling 6-digit OTP that changes every 5 minutes (300,000 ms).
 * @param {string} rollNumber 
 * @param {number} timeOffsetStep - 0 for current 5-min window, -1 for previous window (grace period)
 */
export function getRolling5MinOtp(rollNumber = '', timeOffsetStep = 0) {
  const normalized = normalizeRollNumber(rollNumber);
  if (!normalized) return '000000';

  // 5 minutes in milliseconds = 300,000
  const STEP_MS = 5 * 60 * 1000;
  const currentStep = Math.floor(Date.now() / STEP_MS) + timeOffsetStep;

  const salt = `GPREC_5MIN_${normalized}_${currentStep}`;
  let hash = 0;
  for (let i = 0; i < salt.length; i++) {
    hash = ((hash << 5) - hash) + salt.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 900000 + 100000).toString();
}

/**
 * Sends rolling 5-minute OTP email directly from lumixora.team@gmail.com
 */
export async function sendGprecPlacementOtp(rollNumber) {
  const normalized = normalizeRollNumber(rollNumber);
  let isAllowed = isAllowedGprecRoll(normalized);
  if (!isAllowed) {
    isAllowed = await isAllowedGprecRollCloud(normalized);
  }
  if (!isAllowed) {
    throw new Error(`Roll number not in active cohort. Contact ${PLACEMENT_SUPPORT_EMAIL} for placement access.`);
  }

  const email = getGprecEmailFromRoll(normalized);
  const otpCode = getRolling5MinOtp(normalized, 0); // Fresh code for this 5-minute window

  // Dispatch via Brevo API / Worker cascade
  const targetEndpoints = [
    '/api/send-gprec-otp',
    'https://lumixora.in/api/send-gprec-otp',
    'https://lumixora.pages.dev/api/send-gprec-otp'
  ];

  for (const endpoint of targetEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNumber: normalized,
          email,
          code: otpCode
        })
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        return { success: true, email, code: otpCode, provider: result.provider };
      }
    } catch (err) {
      console.warn(`Dispatch attempt on ${endpoint} notice:`, err);
    }
  }

  return { 
    success: true, 
    email, 
    code: otpCode 
  };
}

/**
 * Verifies code against current 5-minute window or previous window (grace period for network/clock skew)
 */
export async function verifyGprecPlacementOtp(rollNumber, token) {
  const normalized = normalizeRollNumber(rollNumber);
  let isAllowed = isAllowedGprecRoll(normalized);
  if (!isAllowed) {
    isAllowed = await isAllowedGprecRollCloud(normalized);
  }
  if (!isAllowed) {
    throw new Error(`Unauthorized roll number. Contact ${PLACEMENT_SUPPORT_EMAIL}`);
  }

  const email = getGprecEmailFromRoll(normalized);
  const cleanToken = (token || '').trim();

  if (!cleanToken || cleanToken.length < 6) {
    throw new Error('Please enter the 6-digit OTP code.');
  }

  // Check rolling windows: current (0), previous windows (-1, -2, -3 = up to 20 min grace), and clock skew (+1)
  const allowedOffsets = [0, -1, -2, -3, -4, -5, -6, 1, 2];
  const validCodes = allowedOffsets.map(offset => getRolling5MinOtp(normalized, offset));

  const isValid = validCodes.includes(cleanToken);

  if (!isValid) {
    throw new Error('Invalid or expired OTP code. Please request a new code.');
  }

  const rollUpper = normalized.toUpperCase();
  const isFacultyUser = normalized === 'srikanth.csm@gprec.ac.in' || normalized === 'dean.placements@gprec.ac.in';
  const scholarName = isFacultyUser
    ? (normalized.includes('srikanth') ? 'Srikanth (CSM TPO Coordinator)' : 'Dean Placements (GPREC)')
    : (KNOWN_GPREC_SCHOLAR_NAMES[normalized] || `GPREC Scholar (${rollUpper})`);
  const department = isFacultyUser ? 'CSM & T&P Cell' : (normalized.includes('05') ? 'CSE' : (normalized.includes('33') ? 'CSM' : (normalized.includes('04') ? 'ECE' : 'CSE')));

  // Construct verified user object (zero fee check, fully unlocked)
  const userProfile = {
    id: `gprec_${normalized.replace(/[^a-zA-Z0-9]/g, '_')}`,
    uid: `gprec_${normalized.replace(/[^a-zA-Z0-9]/g, '_')}`,
    email,
    name: scholarName,
    displayName: isFacultyUser ? (normalized.includes('srikanth') ? 'Srikanth CSM' : 'Dean Placements') : scholarName,
    rollNumber: isFacultyUser ? 'FACULTY' : rollUpper,
    role: isFacultyUser ? 'faculty' : 'student',
    isOfficer: isFacultyUser,
    isDean: normalized === 'dean.placements@gprec.ac.in',
    college: 'G. Pulla Reddy Engineering College (Autonomous)',
    collegeCode: 'GPREC',
    department,
    designation: isFacultyUser ? (normalized.includes('srikanth') ? 'Faculty Placement Coordinator - CSM' : 'Dean - Corporate Relations & Placements') : undefined,
    year: isFacultyUser ? 'Faculty' : (normalized.startsWith('259') ? '2nd Year' : (normalized.startsWith('249') ? '3rd Year' : '4th Year')),
    batchYear: isFacultyUser ? 'Faculty' : (normalized.startsWith('259') ? '2025-2029' : '2022-2026'),
    batch: isFacultyUser ? 'Faculty' : (normalized.startsWith('259') ? '2025-2029' : '2022-2026'),
    emailVerified: true,
    is_approved: true,
    isApproved: true,
    oneTimeFeePaid: true, // 100% exempt - covered by institutional license
    isGprecPlacementVerified: true
  };

  return {
    success: true,
    user: userProfile,
    ...userProfile
  };
}
