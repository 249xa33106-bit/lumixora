import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBkQ11RXGZP89xbnuW2TTwP9Tji8Ts7VmQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lumixora-93cca.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lumixora-93cca",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lumixora-93cca.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "832924827489",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:832924827489:web:6a78c5a60677d8caee4f20",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4X115LLTX6"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
