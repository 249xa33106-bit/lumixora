import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

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

async function run() {
  console.log("Updating names...");
  try {
    await updateDoc(doc(db, 'test_results', '5w0lHW2ZP8K6bXeiytWd'), { user: 'Anusha' });
    await updateDoc(doc(db, 'test_results', 'isHpQtUMX9FAERslyAGe'), { user: 'Anusha' });
    await updateDoc(doc(db, 'test_results', 'Qt3dks7ifR7VS7EHM459'), { user: 'Anusha' });
    console.log("Updated successfully.");
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
