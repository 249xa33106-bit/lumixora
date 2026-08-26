import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBYFPH24xVwnIi5r4iHcIYgpsqqXQNUUf0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lumixora-6497b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lumixora-6497b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lumixora-6497b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "61963945420",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:61963945420:web:a832c79f4b2790fd224969",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4X115LLTX6"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
