import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  increment
} from 'firebase/firestore';

const COLLECTION_NAME = 'marketplace_listings';

export const fetchListings = async (college = 'GPREC') => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('college', '==', college),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

export const fetchMyListings = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('sellerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching your listings:", error);
    throw error;
  }
};

export const fetchPendingListings = async (college = 'GPREC') => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('college', '==', college),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching pending listings:", error);
    throw error;
  }
};

export const createListing = async (listingData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...listingData,
      status: 'pending',
      reports: 0,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

export const updateListing = async (id, updateData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // If standard fields (like image or title) are changed, we force it back to pending for re-approval
    // For safety, any general user update sets it to pending unless it's just marking as sold or an admin action
    // To make it simple, we just always set it to pending if updateData doesn't explicitly contain status
    // Wait, if it contains status: 'sold', we want to allow that. So we only enforce 'pending' if status is not provided.
    const finalData = { ...updateData };
    if (!finalData.status) {
        finalData.status = 'pending';
    }
    await updateDoc(docRef, finalData);
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

export const deleteListing = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

export const markAsSold = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status: 'sold' });
  } catch (error) {
    console.error("Error marking listing as sold:", error);
    throw error;
  }
};

export const reportListing = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { reports: increment(1) });
  } catch (error) {
    console.error("Error reporting listing:", error);
    throw error;
  }
};

export const approveListing = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status: 'active' });
  } catch (error) {
    console.error("Error approving listing:", error);
    throw error;
  }
};

export const rejectListing = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error rejecting listing:", error);
    throw error;
  }
};
