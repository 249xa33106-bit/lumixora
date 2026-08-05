import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYFPH24xVwnIi5r4iHcIYgpsqqXQNUUf0",
  authDomain: "lumixora-6497b.firebaseapp.com",
  projectId: "lumixora-6497b",
  storageBucket: "lumixora-6497b.firebasestorage.app",
  messagingSenderId: "61963945420",
  appId: "1:61963945420:web:a832c79f4b2790fd224969",
  measurementId: "G-B9VZD839L5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearCollection(collectionName) {
  console.log(`Clearing ${collectionName}...`);
  const querySnapshot = await getDocs(collection(db, collectionName));
  const promises = [];
  querySnapshot.forEach((document) => {
    promises.push(deleteDoc(doc(db, collectionName, document.id)));
  });
  await Promise.all(promises);
  console.log(`Cleared ${promises.length} documents from ${collectionName}`);
}

async function run() {
  await clearCollection('tests');
  await clearCollection('test_results');
  await clearCollection('leaderboards');
  console.log("Done.");
  process.exit(0);
}

run().catch(console.error);
