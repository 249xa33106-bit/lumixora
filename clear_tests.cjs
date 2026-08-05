const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Assuming this exists or I will use firebase-admin-init approach

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(500);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

async function run() {
  console.log("Clearing tests...");
  await clearCollection('tests');
  console.log("Clearing test_results...");
  await clearCollection('test_results');
  console.log("Clearing leaderboards...");
  await clearCollection('leaderboards');
  console.log("Done.");
}

run().catch(console.error);
