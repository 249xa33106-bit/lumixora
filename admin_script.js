import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup for ES Module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your service account key file
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

async function initAdmin() {
  try {
    // Read and parse the service account JSON file
    const serviceAccountContent = await readFile(serviceAccountPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountContent);

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log("✅ Firebase Admin SDK successfully initialized!");
    
    // You can now access Firebase services, for example:
    // const db = admin.firestore();
    // const auth = admin.auth();
    
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin SDK:");
    console.error(error.message);
    console.log("\nMake sure you have downloaded your 'serviceAccountKey.json' from Firebase Console (Project Settings -> Service Accounts) and placed it in this directory.");
  }
}

initAdmin();
