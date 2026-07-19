import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA4Q-fake-key-for-lumixora-dev-123",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "luminora-27653.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "luminora-27653",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "luminora-27653.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "568798547213",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:568798547213:web:7a8b9c0d1e2f3a4b"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
