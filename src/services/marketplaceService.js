import { db } from '../config/firebase';
import { supabase } from '../config/supabase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp,
  increment 
} from 'firebase/firestore';

const COLLECTION_NAME = 'marketplace_listings';
const LOCAL_STORAGE_KEY = 'lumixora_marketplace_listings';

// Helper: read and write to local cache for 100% resilient fallback
const getLocalListings = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalListings = (items) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {}
};

// Standardize item fields across Supabase, Firestore, and LocalStorage
const normalizeListing = (raw) => {
  if (!raw) return null;
  const id = String(raw.id || raw.uid || Date.now());
  const images = Array.isArray(raw.images) 
    ? raw.images 
    : (raw.image_url ? [raw.image_url] : (raw.images ? [raw.images] : []));

  return {
    id,
    title: raw.title || 'Untitled Product',
    price: Number(raw.price) || 0,
    category: raw.category || 'Other',
    description: raw.description || '',
    condition: raw.condition || 'Used - Good',
    brand: raw.brand || '',
    images: images.length > 0 ? images : [''],
    sellerId: raw.seller_id || raw.sellerId || '',
    sellerName: raw.seller_name || raw.sellerName || 'Anonymous Scholar',
    sellerEmail: raw.seller_email || raw.sellerEmail || raw.contactDetails || '',
    contactDetails: raw.contact_phone || raw.contactDetails || raw.seller_email || '',
    contactPhone: raw.contact_phone || raw.contactDetails || '',
    location: raw.location || 'Campus',
    college: raw.college || 'GPREC',
    status: raw.status || 'pending',
    reports: raw.reports || 0,
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString()
  };
};

/**
 * Fetch all ACTIVE public marketplace items
 */
export const fetchListings = async (college = 'All') => {
  const mergedMap = new Map();

  // 1. Fetch from Supabase marketplace_items
  if (supabase && typeof supabase.from === 'function') {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        data.forEach(item => {
          const norm = normalizeListing(item);
          if (norm) mergedMap.set(norm.id, norm);
        });
      }
    } catch (e) {}
  }

  // 2. Fetch from Firebase Firestore
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'active')
    );
    const snap = await getDocs(q);
    snap.docs.forEach(d => {
      const norm = normalizeListing({ id: d.id, ...d.data() });
      if (norm) mergedMap.set(norm.id, norm);
    });
  } catch (e) {}

  // 3. Fallback to localStorage
  const localItems = getLocalListings();
  localItems.forEach(item => {
    if (item.status === 'active' && !mergedMap.has(item.id)) {
      mergedMap.set(item.id, item);
    }
  });

  let results = Array.from(mergedMap.values());

  if (college && college !== 'All') {
    const colLower = college.toLowerCase().trim();
    results = results.filter(item => {
      if (!item.college) return true;
      const c = item.college.toLowerCase().trim();
      return c.includes(colLower) || colLower.includes(c);
    });
  }

  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return results;
};

/**
 * Fetch MY listings by sellerId or sellerEmail
 */
export const fetchMyListings = async (userId, userEmail = '') => {
  const all = await fetchListings('All');
  return all.filter(l => 
    (userId && l.sellerId === userId) || 
    (userEmail && l.sellerEmail && l.sellerEmail.toLowerCase() === userEmail.toLowerCase())
  );
};

/**
 * Fetch all PENDING marketplace items awaiting Founder approval
 */
export const fetchPendingListings = async (college = 'All') => {
  const mergedMap = new Map();

  // 1. Fetch from Supabase marketplace_items
  if (supabase && typeof supabase.from === 'function') {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        data.forEach(item => {
          const norm = normalizeListing(item);
          if (norm) mergedMap.set(norm.id, norm);
        });
      }
    } catch (e) {}
  }

  // 2. Fetch from Firebase Firestore
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    snap.docs.forEach(d => {
      const norm = normalizeListing({ id: d.id, ...d.data() });
      if (norm) mergedMap.set(norm.id, norm);
    });
  } catch (e) {}

  // 3. Merge with localStorage
  const localItems = getLocalListings();
  localItems.forEach(item => {
    if (item.status === 'pending' && !mergedMap.has(item.id)) {
      mergedMap.set(item.id, item);
    }
  });

  let results = Array.from(mergedMap.values());

  if (college && college !== 'All') {
    const colLower = college.toLowerCase().trim();
    results = results.filter(item => {
      if (!item.college) return true;
      const c = item.college.toLowerCase().trim();
      return c.includes(colLower) || colLower.includes(c);
    });
  }

  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return results;
};

/**
 * Create a new product listing (initially status = 'pending')
 */
export const createListing = async (listingData) => {
  const id = String(Date.now());
  const norm = normalizeListing({ id, ...listingData, status: 'pending' });

  // 1. Save to Supabase marketplace_items
  if (supabase && typeof supabase.from === 'function') {
    try {
      const sbItem = {
        id: norm.id,
        title: norm.title,
        price: norm.price,
        category: norm.category,
        description: norm.description,
        images: norm.images,
        seller_name: norm.sellerName,
        seller_email: norm.sellerEmail || norm.contactDetails || 'scholar@gprec.ac.in',
        contact_phone: norm.contactPhone || null,
        status: 'pending'
      };
      await supabase.from('marketplace_items').upsert([sbItem]);
    } catch (e) {
      console.warn('Supabase marketplace insert warning:', e);
    }
  }

  // 2. Save to Firestore
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      ...norm,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch (e) {}

  // 3. Save to localStorage
  const current = getLocalListings();
  current.unshift(norm);
  saveLocalListings(current);

  return id;
};

/**
 * Update an existing listing
 */
export const updateListing = async (id, updateData) => {
  const sid = String(id);

  // 1. Supabase
  if (supabase && typeof supabase.from === 'function') {
    try {
      await supabase.from('marketplace_items').update(updateData).eq('id', sid);
    } catch (e) {}
  }

  // 2. Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, sid);
    await updateDoc(docRef, updateData);
  } catch (e) {}

  // 3. LocalStorage
  const current = getLocalListings();
  const idx = current.findIndex(x => String(x.id) === sid);
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...updateData };
    saveLocalListings(current);
  }
};

/**
 * Approve a listing -> status = 'active'
 */
export const approveListing = async (id) => {
  const sid = String(id);

  // 1. Supabase
  if (supabase && typeof supabase.from === 'function') {
    try {
      await supabase.from('marketplace_items').update({ status: 'active' }).eq('id', sid);
    } catch (e) {}
  }

  // 2. Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, sid);
    await updateDoc(docRef, { status: 'active' });
  } catch (e) {}

  // 3. LocalStorage
  const current = getLocalListings();
  const idx = current.findIndex(x => String(x.id) === sid);
  if (idx !== -1) {
    current[idx].status = 'active';
    saveLocalListings(current);
  }
};

/**
 * Reject / Delete a listing
 */
export const rejectListing = async (id) => {
  return deleteListing(id);
};

export const deleteListing = async (id) => {
  const sid = String(id);

  // 1. Supabase
  if (supabase && typeof supabase.from === 'function') {
    try {
      await supabase.from('marketplace_items').delete().eq('id', sid);
    } catch (e) {}
  }

  // 2. Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, sid);
    await deleteDoc(docRef);
  } catch (e) {}

  // 3. LocalStorage
  const current = getLocalListings().filter(x => String(x.id) !== sid);
  saveLocalListings(current);
};

/**
 * Mark a listing as sold
 */
export const markAsSold = async (id) => {
  return updateListing(id, { status: 'sold' });
};

/**
 * Report a listing
 */
export const reportListing = async (id) => {
  const sid = String(id);
  try {
    const docRef = doc(db, COLLECTION_NAME, sid);
    await updateDoc(docRef, { reports: increment(1) });
  } catch (e) {}
};
