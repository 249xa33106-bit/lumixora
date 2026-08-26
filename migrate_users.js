import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Initialize Supabase
const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYFPH24xVwnIi5r4iHcIYgpsqqXQNUUf0",
  authDomain: "lumixora-6497b.firebaseapp.com",
  projectId: "lumixora-6497b",
  storageBucket: "lumixora-6497b.firebasestorage.app",
  messagingSenderId: "61963945420",
  appId: "1:61963945420:web:a832c79f4b2790fd224969"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  console.log("Fetching users from Firebase...");
  const snapshot = await getDocs(collection(db, 'users'));
  const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  console.log(`Found ${users.length} users in Firebase.`);

  let successCount = 0;
  for (const user of users) {
    console.log(`Migrating ${user.uid} (${user.name})...`);
    
    // Check if user already exists in Supabase
    const { data: existingUser } = await supabase.from('users').select('*').eq('id', user.uid).single();
    if (existingUser) {
      console.log(`User ${user.uid} already exists in Supabase, skipping.`);
      continue;
    }

    const { error } = await supabase.from('users').insert({
      id: user.uid,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      college: user.college || 'GPREC',
      department: user.department || 'CSE',
      year: user.year || '1st Year',
      sem: user.sem || '1',
      sec: user.sec || 'A',
      place: user.place || 'Kurnool',
      qualification: user.qualification || 'B.Tech',
      xp: user.xp || 0,
      level: user.level || 1,
      coins: user.coins || 0,
      streak: user.streak || 0,
      tests_written: user.testsWritten || user.tests_written || 0,
      badges: user.badges || [],
      completed_days: user.completedDays || [],
      study_hours: user.studyHours || 0,
      quiz_score: user.quizScore || 0,
      notes_shared: user.notesShared || 0,
      learning_style: user.learningStyle || 'Practical',
      weak_subjects: user.weakSubjects || '',
      career_goal: user.careerGoal || 'Placement',
      cgpa: user.cgpa || '9.0',
    });

    if (error) {
      console.error(`Error migrating user ${user.uid}:`, error.message);
    } else {
      console.log(`Successfully migrated user ${user.uid}`);
      successCount++;
    }
  }

  console.log(`Migration complete. Successfully migrated ${successCount} new users.`);
  process.exit(0);
}

migrate();
