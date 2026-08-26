const admin = require('firebase-admin');

// Ensure we only initialize once
if (!admin.apps.length) {
  try {
    const serviceAccount = require('./.firebase/serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch(e) {
    // Fallback if no service account
    admin.initializeApp();
  }
}

const db = admin.firestore();

async function check() {
  const snapshot = await db.collection('attendance').limit(1).get();
  if (snapshot.empty) {
    console.log("No docs");
    return;
  }
  snapshot.forEach(doc => {
    console.log("Doc ID:", doc.id);
    const data = doc.data();
    Object.keys(data).forEach(key => {
      console.log(`Key: [${key}]`);
    });
  });
}
check().catch(console.error);
