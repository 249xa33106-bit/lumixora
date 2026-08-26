import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, getDocs, serverTimestamp, query, where } from 'firebase/firestore';

/**
 * Generate a deterministic Unique Faculty Code from an email and college
 * Example: FAC-GPREC-7861
 */
export function generateDeterministicFacultyCode(email = '', college = 'GPREC') {
  if (!email) return `FAC-${(college || 'GPREC').toUpperCase().slice(0, 5)}-001`;

  const cleanCol = (college || 'GPREC').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) || 'CAMPUS';
  let hash = 0;
  const str = email.toLowerCase().trim();
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const num = (Math.abs(hash) % 8999) + 1000;
  return `FAC-${cleanCol}-${num}`;
}

/**
 * Clean user name by stripping embedded metadata
 */
export function cleanFacultyName(rawName) {
  if (!rawName || typeof rawName !== 'string') return 'Faculty Member';
  let cleaned = rawName;
  if (cleaned.includes('{')) {
    cleaned = cleaned.split('{')[0].trim();
  }
  cleaned = cleaned.replace(/[{}":;]/g, '').trim();
  return cleaned || 'Faculty Member';
}

/**
 * Syncs the logged-in faculty user profile with Firestore faculty_directory and users collection
 */
export async function syncFacultyToDirectory(user) {
  if (!user || (!user.email && !user.uid)) return null;

  const email = (user.email || '').toLowerCase().trim();
  const college = user.college || 'GPREC';
  const department = user.department || user.branch || 'Computer Science & Engineering (CSE)';
  const name = cleanFacultyName(user.name) || (email.split('@')[0] || 'Faculty Member');
  const code = generateDeterministicFacultyCode(email, college);

  try {
    const docRef = doc(db, 'faculty_directory', code);
    await setDoc(docRef, {
      code,
      name,
      email,
      college,
      department,
      designation: user.designation || (user.role === 'founder' ? 'Platform Founder & Head' : 'Faculty / Mentor'),
      uid: user.uid || user.id || email,
      role: user.role || 'faculty',
      updatedAt: serverTimestamp()
    }, { merge: true });

    return code;
  } catch (err) {
    console.warn('Faculty directory sync warning:', err);
    return code;
  }
}

/**
 * Fetches all real logged-in/registered faculty accounts from Firestore collections
 */
export async function fetchRealRegisteredFaculty() {
  const map = new Map();

  try {
    // 1. Fetch from faculty_directory
    const dirSnap = await getDocs(collection(db, 'faculty_directory'));
    dirSnap.forEach(d => {
      const data = d.data();
      if (data.code && data.name) {
        map.set(data.code, {
          code: data.code,
          name: cleanFacultyName(data.name),
          designation: data.designation || 'Faculty Member',
          department: data.department || 'Computer Science & Engineering (CSE)',
          college: data.college || 'GPREC',
          email: data.email || ''
        });
      }
    });

    // 2. Fetch from users collection where role is faculty, mentor, or founder
    const usersSnap = await getDocs(collection(db, 'users'));
    usersSnap.forEach(d => {
      const data = d.data();
      const role = (data.role || '').toLowerCase();
      const email = (data.email || '').toLowerCase();
      const isFacultyUser = role === 'faculty' || role === 'mentor' || role === 'founder' || email === 'founder@lumixora.com' || email.includes('faculty');

      if (isFacultyUser && !data.is_deleted && !data.isDeleted) {
        const college = data.college || 'GPREC';
        const code = generateDeterministicFacultyCode(email, college);
        if (!map.has(code)) {
          map.set(code, {
            code,
            name: cleanFacultyName(data.name || data.displayName || email.split('@')[0]),
            designation: data.designation || (role === 'founder' ? 'Platform Founder & Head' : 'Faculty Member'),
            department: data.department || data.branch || 'Computer Science & Engineering (CSE)',
            college,
            email
          });
        }
      }
    });
  } catch (err) {
    console.warn('Error fetching registered faculty:', err);
  }

  return Array.from(map.values());
}
