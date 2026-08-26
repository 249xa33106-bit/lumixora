import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read and parse .env
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error(".env file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    // Remove wrapping quotes
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value.trim();
  }
});

const newVersion = '1.1.11';

async function updateDatabases() {
  console.log(`Bumping version to ${newVersion} in databases...`);

  // --- A. SUPABASE UPDATE ---
  try {
    const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ykuyzkhhnltjccyzduap.supabase.co';
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';
    
    console.log("Connecting to Supabase at:", supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('app_config')
      .upsert({ key: 'latest_version', value: newVersion }, { onConflict: 'key' });
      
    if (error) {
      console.warn("Supabase update error:", error.message);
    } else {
      console.log("Supabase version updated successfully to:", newVersion);
    }
  } catch (err) {
    console.warn("Supabase update failed:", err);
  }

  // --- B. FIREBASE UPDATE ---
  try {
    const firebaseConfig = {
      apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBYFPH24xVwnIi5r4iHcIYgpsqqXQNUUf0",
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "lumixora-6497b.firebaseapp.com",
      projectId: env.VITE_FIREBASE_PROJECT_ID || "lumixora-6497b",
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "lumixora-6497b.firebasestorage.app",
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "61963945420",
      appId: env.VITE_FIREBASE_APP_ID || "1:61963945420:web:a832c79f4b2790fd224969"
    };
    
    console.log("Connecting to Firebase Project ID:", firebaseConfig.projectId);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const docRef = doc(db, 'app_config', 'version_control');
    await setDoc(docRef, {
      latest_version: newVersion
    }, { merge: true });
    
    console.log("Firebase Firestore version updated successfully to:", newVersion);
  } catch (err) {
    console.error("Firebase update failed:", err);
  }
}

updateDatabases();
