import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';
const supabase = createClient(supabaseUrl, supabaseKey);

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

function cleanName(raw) {
  if (!raw) return 'Scholar';
  let str = String(raw).trim();
  if (str.includes('{')) {
    try {
      const parsed = JSON.parse(str.slice(str.indexOf('{')));
      return parsed.name || str.split('{')[0].trim() || 'Scholar';
    } catch(e) {
      str = str.split('{')[0].trim();
    }
  }
  return str.replace(/[\{\}":;]/g, '').trim() || 'Scholar';
}

async function syncXpAndCoins() {
  console.log('--- 1. Fetching XP & Coins from Firebase ---');
  const snap1 = await getDocs(collection(db, 'users'));
  const xpMap = new Map();

  snap1.docs.forEach(d => {
    const data = d.data();
    const email = (data.email || d.id).toLowerCase().trim();
    const xp = data.xp || data.ap || 0;
    const coins = data.coins || data.sc || 0;
    if (email) {
      xpMap.set(email, { xp, coins, data });
    }
  });

  console.log(`Found ${xpMap.size} user records in Firebase with XP/Coins.`);

  console.log('--- 2. Fetching Supabase users ---');
  const { data: sbUsers } = await supabase.from('users').select('*').range(0, 1000);
  console.log(`Found ${sbUsers.length} users in Supabase.`);

  let updatedCount = 0;
  for (const u of sbUsers) {
    const email = (u.email || '').toLowerCase().trim();
    const fbRecord = xpMap.get(email);
    
    let baseName = cleanName(u.name);
    let meta = {};
    if (u.name && u.name.includes('{')) {
      try { meta = JSON.parse(u.name.slice(u.name.indexOf('{'))); } catch(e) {}
    }

    const xpVal = fbRecord && fbRecord.xp > 0 ? fbRecord.xp : (meta.xp || 50);
    const coinsVal = fbRecord && fbRecord.coins > 0 ? fbRecord.coins : (meta.coins || 100);

    const updatedMeta = {
      name: baseName,
      college: meta.college || 'GPREC',
      department: meta.department || 'CSE',
      year: meta.year || '1st Year',
      sem: meta.sem || '1',
      sec: meta.sec || 'A',
      place: meta.place || 'Kurnool',
      qualification: meta.qualification || 'B.Tech',
      xp: xpVal,
      coins: coinsVal,
      level: meta.level || 1,
      streak: meta.streak || 0
    };

    const newPackedName = `${baseName} ${JSON.stringify(updatedMeta)}`;
    const { error } = await supabase.from('users').update({ name: newPackedName }).eq('id', u.id);
    if (!error) updatedCount++;
  }

  console.log(`✔ Successfully updated XP & Coins for ${updatedCount} scholars in Supabase!`);
}

syncXpAndCoins();
