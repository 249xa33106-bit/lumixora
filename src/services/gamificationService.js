import { db, auth } from '../config/firebase';
import { supabase } from '../config/supabase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';

// XP Reward Constants
export const XP_REWARDS = {
  DAILY_LOGIN: { xp: 10, label: "Daily Login" },
  STUDY_20_MIN: { xp: 20, label: "Study 20 Minutes" },
  COMPLETE_AI_TASK: { xp: 30, label: "Complete AI Study Plan Task" },
  FINISH_QUIZ: { xp: 50, label: "Finish a Quiz" },
  SCORE_ABOVE_90: { xp: 75, label: "Score Above 90%" },
  UPLOAD_NOTES: { xp: 40, label: "Upload Notes" },
  HELP_STUDENT: { xp: 25, label: "Help Another Student" },
  MAINTAIN_STREAK: { xp: 15, label: "Maintain Daily Streak" },
  COMPLETE_WEEKLY_GOAL: { xp: 150, label: "Complete Weekly Goal" }
};

// Available Badges & Achievements Definitions
export const ALL_ACHIEVEMENTS = [
  { id: 'first_login', name: 'First Steps', desc: 'Log in for the first time', icon: '🚀', xpReward: 50 },
  { id: 'streak_3', name: 'Consistent Learner', desc: 'Reach a 3-day learning streak', icon: '🔥', xpReward: 50 },
  { id: 'streak_7', name: 'Weekly Warrior', desc: 'Reach a 7-day learning streak', icon: '⚡', xpReward: 100 },
  { id: 'streak_30', name: 'Dedicated Scholar', desc: 'Reach a 30-day learning streak', icon: '🏆', xpReward: 250 },
  { id: 'streak_100', name: 'Centurion', desc: 'Reach a 100-day learning streak', icon: '👑', xpReward: 500 },
  { id: 'quiz_master', name: 'Quiz Master', desc: 'Finish 10 quizzes with a score > 90%', icon: '🎓', xpReward: 150 },
  { id: 'ai_explorer', name: 'AI Explorer', desc: 'Complete 5 AI-generated study tasks', icon: '🤖', xpReward: 100 },
  { id: 'early_bird', name: 'Early Bird', desc: 'Complete a study task before 7 AM', icon: '🌅', xpReward: 50 },
  { id: 'night_owl', name: 'Night Owl', desc: 'Study for 20+ minutes after midnight', icon: '🦉', xpReward: 50 },
  { id: 'top_contributor', name: 'Top Contributor', desc: 'Upload 5 approved study materials/notes', icon: '✍️', xpReward: 150 },
  { id: 'top_10_leaderboard', name: 'Elite Ranker', desc: 'Reach the Top 10 on the Global Leaderboard', icon: '🌠', xpReward: 200 },
  { id: 'study_champion', name: 'Study Champion', desc: 'Accumulate 10 total hours of study time', icon: '⏳', xpReward: 200 },
  { id: 'fast_learner', name: 'Fast Learner', desc: 'Complete 3 tasks in a single day', icon: '🏎️', xpReward: 100 }
];

// Custom Themes Available for Purchase
export const THEMES = [
  { id: 'default', name: 'Lumix Classic', cost: 0, preview: 'linear-gradient(135deg, #030712 0%, #0f172a 100%)', color: 'from-[#00f5d4] to-[#7209b7]' },
  { id: 'neon_pink', name: 'Cyber Bloom', cost: 100, preview: 'linear-gradient(135deg, #090212 0%, #20042d 100%)', color: 'from-[#f72585] to-[#7209b7]' },
  { id: 'ocean_emerald', name: 'Abyssal Depth', cost: 200, preview: 'linear-gradient(135deg, #020b12 0%, #032b26 100%)', color: 'from-[#00f5d4] to-[#00b4d8]' },
  { id: 'rose_gold', name: 'Royal Gild', cost: 350, preview: 'linear-gradient(135deg, #120902 0%, #2b180d 100%)', color: 'from-[#ff9f1c] to-[#f72585]' }
];

// Profile Frames Available for Purchase
export const FRAMES = [
  { id: 'none', name: 'No Frame', cost: 0, style: 'border-transparent' },
  { id: 'glow_teal', name: 'Teal Aura', cost: 150, style: 'border-2 border-[#00f5d4] shadow-[0_0_10px_rgba(0,245,212,0.6)] animate-pulse' },
  { id: 'glow_purple', name: 'Void Ring', cost: 250, style: 'border-2 border-[#7209b7] shadow-[0_0_10px_rgba(114,9,183,0.6)]' },
  { id: 'rainbow_gradient', name: 'Spectrum Shield', cost: 500, style: 'border-2 border-transparent bg-gradient-to-r from-[#00f5d4] via-[#7209b7] to-[#f72585] bg-clip-border' }
];

// Generate Level details from total XP
export function getLevelFromXP(xp) {
  let level = 1;
  let nextLevelXP = 200;
  let currentLevelXP = 0;
  while (xp >= nextLevelXP) {
    level++;
    currentLevelXP = nextLevelXP;
    nextLevelXP = currentLevelXP + 100 * (level + 1);
  }
  return {
    level,
    xpInCurrentLevel: xp - currentLevelXP,
    xpNeededForNextLevel: nextLevelXP - currentLevelXP,
    totalXpNeededForNextLevel: nextLevelXP
  };
}

// Check if Firebase is actually running/unblocked
function isFirebaseAvailable() {
  try {
    const key = import.meta.env.VITE_FIREBASE_API_KEY;
    const isFake = !key || key === "your-auth-domain" || key.includes("fake-key") || key.includes("gsk_"); // gsk_ is Groq API key, not Firebase API key
    return !!db && !isFake;
  } catch (e) {
    return false;
  }
}

// Local Storage Fallback Mock Database Engine
const LOCAL_DB = {
  get: (key, defaultValue) => {
    const data = localStorage.getItem(`lumixora_gamify_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  },
  set: (key, value) => {
    localStorage.setItem(`lumixora_gamify_${key}`, JSON.stringify(value));
  }
};

// Seed Mock Leaderboard Students
const MOCK_LEADERBOARD_USERS = [
  { id: 'mock1', name: 'Rohan Sharma', college: 'GPREC', department: 'CSE', year: '3rd Year', city: 'Kurnool', state: 'Andhra Pradesh', country: 'India', xp: 2450, streak: 12, badgesCount: 6, level: 7, avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80', quizScore: 92, studyHours: 24, notesShared: 8 },
  { id: 'mock2', name: 'Ananya Goel', college: 'IIT Bombay', department: 'Data Science', year: '2nd Year', city: 'Mumbai', state: 'Maharashtra', country: 'India', xp: 3820, streak: 35, badgesCount: 9, level: 10, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', quizScore: 96, studyHours: 42, notesShared: 14 },
  { id: 'mock3', name: 'Sai Teja', college: 'GPREC', department: 'ECE', year: '4th Year', city: 'Kurnool', state: 'Andhra Pradesh', country: 'India', xp: 1950, streak: 8, badgesCount: 4, level: 6, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', quizScore: 88, studyHours: 19, notesShared: 5 },
  { id: 'mock4', name: 'Kavya Nair', college: 'VIT Vellore', department: 'AI & ML', year: '1st Year', city: 'Vellore', state: 'Tamil Nadu', country: 'India', xp: 950, streak: 5, badgesCount: 3, level: 4, avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', quizScore: 94, studyHours: 12, notesShared: 2 },
  { id: 'mock5', name: 'Vikram Singh', college: 'DTU', department: 'Mechanical', year: '3rd Year', city: 'Delhi', state: 'Delhi', country: 'India', xp: 1420, streak: 18, badgesCount: 5, level: 5, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', quizScore: 82, studyHours: 16, notesShared: 6 },
  { id: 'mock6', name: 'Shruti Iyer', college: 'PES University', department: 'CSE', year: '2nd Year', city: 'Bengaluru', state: 'Karnataka', country: 'India', xp: 2150, streak: 22, badgesCount: 7, level: 6, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', quizScore: 90, studyHours: 28, notesShared: 9 }
];

// Helper to seed localStorage if empty
function initializeLocalStorageDB(currentUser = null) {
  if (!localStorage.getItem('lumixora_gamify_seeded')) {
    LOCAL_DB.set('leaderboards', MOCK_LEADERBOARD_USERS);
    localStorage.setItem('lumixora_gamify_seeded', 'true');
  }
}

/**
 * Fetch or Initialize User gamification stats
 */
export async function getUserProfile(uid, authUser = null) {
  initializeLocalStorageDB();

  if (isFirebaseAvailable()) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        // Create new user profile in Firestore
        const cleanProfile = parseProfileName(authUser?.displayName || authUser?.name || 'Academic Student');
        const defaultProfile = {
          uid,
          name: cleanProfile.name,
          email: authUser?.email || '',
          qualification: cleanProfile.qualification || 'B.Tech',
          college: cleanProfile.college || 'Lumix Academy',
          place: cleanProfile.place || 'India',
          year: cleanProfile.year || '1st Year',
          xp: 0,
          todayXp: 0,
          level: 1,
          coins: 100, // Starter coins
          streak: 0,
          longestStreak: 0,
          streakFreezeCount: 1, // 1 free freeze to start
          lastActiveDate: null,
          completedDays: [],
          badges: ['first_login'],
          purchasedThemes: ['default'],
          purchasedFrames: ['none'],
          currentTheme: 'default',
          currentFrame: 'none',
          studyHours: 0,
          quizScore: 0,
          notesShared: 0,
          lastDailyReset: new Date().toDateString(),
          created_at: new Date().toISOString()
        };
        await setDoc(userRef, defaultProfile);
        
        // Sync to leaderboards index
        await setDoc(doc(db, 'leaderboards', uid), {
          id: uid,
          name: defaultProfile.name,
          college: defaultProfile.college,
          department: cleanProfile.department || 'CSE',
          year: defaultProfile.year,
          city: defaultProfile.place,
          state: defaultProfile.place,
          country: 'India',
          xp: 0,
          streak: 0,
          badgesCount: 1,
          level: 1,
          avatarUrl: defaultProfile.avatarUrl || '',
          quizScore: 0,
          studyHours: 0,
          notesShared: 0
        });

        return defaultProfile;
      }
    } catch (e) {
      console.warn("Firestore fetch error, falling back to LocalStorage:", e);
    }
  }

  // LocalStorage Fallback
  const cachedUsers = LOCAL_DB.get('users', {});
  if (cachedUsers[uid]) {
    return cachedUsers[uid];
  } else {
    const cleanProfile = parseProfileName(authUser?.displayName || authUser?.name || 'Academic Student');
    const defaultProfile = {
      uid,
      name: cleanProfile.name,
      email: authUser?.email || '',
      qualification: cleanProfile.qualification || 'B.Tech',
      college: cleanProfile.college || 'Lumix Academy',
      place: cleanProfile.place || 'India',
      year: cleanProfile.year || '1st Year',
      xp: 0,
      todayXp: 0,
      level: 1,
      coins: 100,
      streak: 0,
      longestStreak: 0,
      streakFreezeCount: 1,
      lastActiveDate: null,
      completedDays: [],
      badges: ['first_login'],
      purchasedThemes: ['default'],
      purchasedFrames: ['none'],
      currentTheme: 'default',
      currentFrame: 'none',
      studyHours: 0,
      quizScore: 0,
      notesShared: 0,
      lastDailyReset: new Date().toDateString(),
      created_at: new Date().toISOString()
    };
    cachedUsers[uid] = defaultProfile;
    LOCAL_DB.set('users', cachedUsers);
    
    // Add to mock leaderboards cache
    const leaderboard = LOCAL_DB.get('leaderboards', []);
    if (!leaderboard.some(u => u.id === uid)) {
      leaderboard.push({
        id: uid,
        name: defaultProfile.name,
        college: defaultProfile.college,
        department: cleanProfile.department || 'CSE',
        year: defaultProfile.year,
        city: defaultProfile.place,
        state: defaultProfile.place,
        country: 'India',
        xp: 0,
        streak: 0,
        badgesCount: 1,
        level: 1,
        avatarUrl: defaultProfile.avatarUrl || '',
        quizScore: 0,
        studyHours: 0,
        notesShared: 0
      });
      LOCAL_DB.set('leaderboards', leaderboard);
    }
    return defaultProfile;
  }
}

// Parse user packed name to get display settings
export function parseProfileName(fullName) {
  let name = fullName || '';
  let metadata = { qualification: 'B.Tech', college: 'GPREC', place: 'Kurnool', year: '1st Year', department: 'CSE' };
  if (name.includes(' {')) {
    const idx = name.indexOf(' {');
    const jsonStr = name.substring(idx).trim();
    name = name.substring(0, idx).trim();
    try {
      const parsed = JSON.parse(jsonStr);
      metadata = { ...metadata, ...parsed };
    } catch (e) {
      console.error("Failed to parse metadata in name field:", e);
    }
  }
  return { name, ...metadata };
}

/**
 * Save / Update profile details
 */
export async function saveUserProfile(uid, updates) {
  if (isFirebaseAvailable()) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updates);
      
      // Sync leaderboard fields if updated
      const boardRef = doc(db, 'leaderboards', uid);
      const boardSnap = await getDoc(boardRef);
      if (boardSnap.exists()) {
        const boardUpdates = {};
        if (updates.name !== undefined) boardUpdates.name = updates.name;
        if (updates.college !== undefined) boardUpdates.college = updates.college;
        if (updates.year !== undefined) boardUpdates.year = updates.year;
        if (updates.place !== undefined) {
          boardUpdates.city = updates.place;
          boardUpdates.state = updates.place;
        }
        if (updates.avatarUrl !== undefined) boardUpdates.avatarUrl = updates.avatarUrl;
        if (Object.keys(boardUpdates).length > 0) {
          await updateDoc(boardRef, boardUpdates);
        }
      }
      return true;
    } catch (e) {
      console.warn("Firestore update error, falling back to LocalStorage:", e);
    }
  }

  // LocalStorage Fallback
  const cachedUsers = LOCAL_DB.get('users', {});
  if (cachedUsers[uid]) {
    cachedUsers[uid] = { ...cachedUsers[uid], ...updates };
    LOCAL_DB.set('users', cachedUsers);

    // Sync in mock leaderboard
    const leaderboard = LOCAL_DB.get('leaderboards', []);
    const idx = leaderboard.findIndex(u => u.id === uid);
    if (idx !== -1) {
      if (updates.name !== undefined) leaderboard[idx].name = updates.name;
      if (updates.college !== undefined) leaderboard[idx].college = updates.college;
      if (updates.year !== undefined) leaderboard[idx].year = updates.year;
      if (updates.place !== undefined) {
        leaderboard[idx].city = updates.place;
        leaderboard[idx].state = updates.place;
      }
      if (updates.avatarUrl !== undefined) leaderboard[idx].avatarUrl = updates.avatarUrl;
      LOCAL_DB.set('leaderboards', leaderboard);
    }
    return true;
  }
  return false;
}

/**
 * Award XP to a user with CHEATING PREVENTION check
 */
export async function awardXP(uid, actionKey, customVal = null) {
  const rewardConfig = XP_REWARDS[actionKey];
  if (!rewardConfig && !customVal) {
    throw new Error(`Invalid XP award action: ${actionKey}`);
  }
  
  const xpAmount = customVal !== null ? customVal : rewardConfig.xp;
  const label = rewardConfig ? rewardConfig.label : "Custom Event Accomplishment";

  // Double check: Validate that action values match exact configuration rules to prevent cheating
  if (actionKey in XP_REWARDS) {
    const expected = XP_REWARDS[actionKey].xp;
    if (xpAmount !== expected) {
      console.warn("Security Alert: XP mismatch detected! Overriding with default rule.");
      return await awardXP(uid, actionKey); // Override to valid value
    }
  } else if (customVal !== null) {
    // Custom awards (e.g. from challenges or achievements) - caps at 500 to prevent infinite XP exploits
    if (customVal < 0 || customVal > 500) {
      console.warn("Security Alert: Excessive Custom XP Rejected!");
      return null;
    }
  }

  if (isFirebaseAvailable()) {
    try {
      const userRef = doc(db, 'users', uid);
      const historyRef = collection(db, 'xpHistory');

      // Use a Firestore Transaction to enforce atomic increments and prevent cheating
      const result = await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error("User does not exist!");

        const userData = userSnap.data();
        const newXp = userData.xp + xpAmount;
        
        // Reset daily XP if today is a new day
        const todayStr = new Date().toDateString();
        let newTodayXp = (userData.lastDailyReset === todayStr) ? (userData.todayXp + xpAmount) : xpAmount;
        
        // Calculate level progression
        const levelDetails = getLevelFromXP(newXp);
        const levelUpOccurred = levelDetails.level > userData.level;

        // Earn Lumix Coins on leveling up (+50 coins per level)
        let newCoins = userData.coins;
        if (levelUpOccurred) {
          newCoins += 50 * (levelDetails.level - userData.level);
        }
        // Daily action coin award (e.g. +5 coins for study/task complete)
        newCoins += Math.max(1, Math.floor(xpAmount / 5));

        // Create transaction log
        const logDocRef = doc(historyRef);
        transaction.set(logDocRef, {
          userId: uid,
          action: actionKey,
          xpAwarded: xpAmount,
          timestamp: serverTimestamp(),
          label
        });

        // Update user record
        const userUpdates = {
          xp: newXp,
          todayXp: newTodayXp,
          level: levelDetails.level,
          coins: newCoins,
          lastDailyReset: todayStr
        };
        transaction.update(userRef, userUpdates);

        // Sync to leaderboards collection
        const boardRef = doc(db, 'leaderboards', uid);
        transaction.update(boardRef, {
          xp: newXp,
          level: levelDetails.level
        });

        return {
          xp: newXp,
          todayXp: newTodayXp,
          level: levelDetails.level,
          coins: newCoins,
          levelUpOccurred,
          xpEarned: xpAmount
        };
      });

      return result;

    } catch (e) {
      console.warn("Firestore XP transaction failed, falling back to LocalStorage:", e);
    }
  }

  // LocalStorage Fallback
  const cachedUsers = LOCAL_DB.get('users', {});
  const userData = cachedUsers[uid];
  if (userData) {
    const newXp = userData.xp + xpAmount;
    const todayStr = new Date().toDateString();
    let newTodayXp = (userData.lastDailyReset === todayStr) ? (userData.todayXp + xpAmount) : xpAmount;

    const levelDetails = getLevelFromXP(newXp);
    const levelUpOccurred = levelDetails.level > userData.level;

    let newCoins = userData.coins;
    if (levelUpOccurred) {
      newCoins += 50 * (levelDetails.level - userData.level);
    }
    newCoins += Math.max(1, Math.floor(xpAmount / 5));

    // Log XP History Locally
    const xpHistory = LOCAL_DB.get('xpHistory', []);
    xpHistory.push({
      userId: uid,
      action: actionKey,
      xpAwarded: xpAmount,
      timestamp: new Date().toISOString(),
      label
    });
    LOCAL_DB.set('xpHistory', xpHistory);

    const updatedUser = {
      ...userData,
      xp: newXp,
      todayXp: newTodayXp,
      level: levelDetails.level,
      coins: newCoins,
      lastDailyReset: todayStr
    };
    cachedUsers[uid] = updatedUser;
    LOCAL_DB.set('users', cachedUsers);

    // Sync in leaderboard mock database
    const leaderboard = LOCAL_DB.get('leaderboards', []);
    const idx = leaderboard.findIndex(u => u.id === uid);
    if (idx !== -1) {
      leaderboard[idx].xp = newXp;
      leaderboard[idx].level = levelDetails.level;
      LOCAL_DB.set('leaderboards', leaderboard);
    }

    return {
      xp: newXp,
      todayXp: newTodayXp,
      level: levelDetails.level,
      coins: newCoins,
      levelUpOccurred,
      xpEarned: xpAmount
    };
  }
  return null;
}

/**
 * Handle learning streak updates
 */
export async function trackDailyActivity(uid, activityType, countVal = 1) {
  // Check completion criteria:
  // - Watches videos >= 15 min OR solves 10 questions OR studies >= 20 min OR completes 1 AI task
  let completedToday = false;
  
  if (activityType === 'video_minutes' && countVal >= 15) completedToday = true;
  if (activityType === 'quiz_questions' && countVal >= 10) completedToday = true;
  if (activityType === 'study_minutes' && countVal >= 20) completedToday = true;
  if (activityType === 'ai_task' && countVal >= 1) completedToday = true;

  if (!completedToday) return { success: false, msg: "Activity tracked but does not meet daily completion threshold yet." };

  const todayStr = new Date().toDateString();

  if (isFirebaseAvailable()) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const completedDays = userData.completedDays || [];
        
        if (completedDays.includes(todayStr)) {
          return { success: true, msg: "Today's streak was already secured!", streak: userData.streak };
        }

        const newCompletedDays = [...completedDays, todayStr];
        let newStreak = userData.streak;
        let milestoneUnlocked = null;

        // Calculate if streak continues
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (completedDays.includes(yesterdayStr) || userData.streak === 0) {
          // Continuous streak
          newStreak += 1;
        } else {
          // Missed a day! Check if they have a Streak Freeze
          if (userData.streakFreezeCount > 0) {
            // Auto use streak freeze to protect it
            await updateDoc(userRef, {
              streakFreezeCount: userData.streakFreezeCount - 1
            });
            newStreak += 1; // Protect streak
            milestoneUnlocked = "Streak protected by Streak Freeze! ❄️";
          } else {
            // Reset streak
            newStreak = 1;
          }
        }

        const newLongestStreak = Math.max(newStreak, userData.longestStreak || 0);

        // Check Milestone unlock triggers: 3, 7, 15, 30, 50, 100, 365
        const milestones = [3, 7, 15, 30, 50, 100, 365];
        if (milestones.includes(newStreak)) {
          milestoneUnlocked = `${newStreak}-Day Streak Milestone reached! 🔥`;
        }

        await updateDoc(userRef, {
          streak: newStreak,
          longestStreak: newLongestStreak,
          completedDays: newCompletedDays,
          lastActiveDate: todayStr
        });

        // Sync to leaderboard index
        await updateDoc(doc(db, 'leaderboards', uid), {
          streak: newStreak
        });

        // Award streak maintenance XP (+15 XP)
        const xpRes = await awardXP(uid, 'MAINTAIN_STREAK');

        return {
          success: true,
          streak: newStreak,
          longestStreak: newLongestStreak,
          milestoneUnlocked,
          xpAwarded: xpRes?.xpEarned || 0,
          coins: xpRes?.coins || userData.coins
        };
      }
    } catch (e) {
      console.warn("Firestore streak tracking error, falling back to LocalStorage:", e);
    }
  }

  // LocalStorage Fallback
  const cachedUsers = LOCAL_DB.get('users', {});
  const userData = cachedUsers[uid];
  if (userData) {
    const completedDays = userData.completedDays || [];
    if (completedDays.includes(todayStr)) {
      return { success: true, msg: "Today's streak was already secured!", streak: userData.streak };
    }

    const newCompletedDays = [...completedDays, todayStr];
    let newStreak = userData.streak;
    let milestoneUnlocked = null;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let usedFreeze = false;
    if (completedDays.includes(yesterdayStr) || userData.streak === 0) {
      newStreak += 1;
    } else {
      if (userData.streakFreezeCount > 0) {
        userData.streakFreezeCount -= 1;
        newStreak += 1;
        usedFreeze = true;
        milestoneUnlocked = "Streak protected by Streak Freeze! ❄️";
      } else {
        newStreak = 1;
      }
    }

    const newLongestStreak = Math.max(newStreak, userData.longestStreak || 0);

    const milestones = [3, 7, 15, 30, 50, 100, 365];
    if (milestones.includes(newStreak) && !usedFreeze) {
      milestoneUnlocked = `${newStreak}-Day Streak Milestone reached! 🔥`;
    }

    const updatedUser = {
      ...userData,
      streak: newStreak,
      longestStreak: newLongestStreak,
      completedDays: newCompletedDays,
      lastActiveDate: todayStr,
      streakFreezeCount: userData.streakFreezeCount
    };
    cachedUsers[uid] = updatedUser;
    LOCAL_DB.set('users', cachedUsers);

    // Sync in leaderboard
    const leaderboard = LOCAL_DB.get('leaderboards', []);
    const idx = leaderboard.findIndex(u => u.id === uid);
    if (idx !== -1) {
      leaderboard[idx].streak = newStreak;
      LOCAL_DB.set('leaderboards', leaderboard);
    }

    const xpRes = await awardXP(uid, 'MAINTAIN_STREAK');

    return {
      success: true,
      streak: newStreak,
      longestStreak: newLongestStreak,
      milestoneUnlocked,
      xpAwarded: xpRes?.xpEarned || 0,
      coins: xpRes?.coins || userData.coins
    };
  }

  return { success: false, msg: "User profile not found." };
}

/**
 * Buy Theme/Frame/Freeze in the Shop
 */
export async function buyShopItem(uid, itemType, itemId, cost) {
  if (isFirebaseAvailable()) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.coins < cost) {
          return { success: false, msg: "Insufficient Lumix Coins!" };
        }

        const updates = {
          coins: userData.coins - cost
        };

        if (itemType === 'theme') {
          const themes = userData.purchasedThemes || ['default'];
          if (themes.includes(itemId)) return { success: false, msg: "Theme already purchased!" };
          updates.purchasedThemes = [...themes, itemId];
          updates.currentTheme = itemId;
        } else if (itemType === 'frame') {
          const frames = userData.purchasedFrames || ['none'];
          if (frames.includes(itemId)) return { success: false, msg: "Profile Frame already purchased!" };
          updates.purchasedFrames = [...frames, itemId];
          updates.currentFrame = itemId;
        } else if (itemType === 'freeze') {
          updates.streakFreezeCount = (userData.streakFreezeCount || 0) + 1;
        }

        await updateDoc(userRef, updates);
        return { success: true, coins: updates.coins, updates };
      }
    } catch (e) {
      console.warn("Firestore shop purchase error, falling back to LocalStorage:", e);
    }
  }

  // LocalStorage Fallback
  const cachedUsers = LOCAL_DB.get('users', {});
  const userData = cachedUsers[uid];
  if (userData) {
    if (userData.coins < cost) {
      return { success: false, msg: "Insufficient Lumix Coins!" };
    }

    const updates = {
      coins: userData.coins - cost
    };

    if (itemType === 'theme') {
      const themes = userData.purchasedThemes || ['default'];
      if (themes.includes(itemId)) return { success: false, msg: "Theme already purchased!" };
      updates.purchasedThemes = [...themes, itemId];
      updates.currentTheme = itemId;
    } else if (itemType === 'frame') {
      const frames = userData.purchasedFrames || ['none'];
      if (frames.includes(itemId)) return { success: false, msg: "Profile Frame already purchased!" };
      updates.purchasedFrames = [...frames, itemId];
      updates.currentFrame = itemId;
    } else if (itemType === 'freeze') {
      updates.streakFreezeCount = (userData.streakFreezeCount || 0) + 1;
    }

    const updatedUser = { ...userData, ...updates };
    cachedUsers[uid] = updatedUser;
    LOCAL_DB.set('users', cachedUsers);
    return { success: true, coins: updates.coins, updates };
  }

  return { success: false, msg: "User profile not found." };
}

/**
 * Fetch Leaderboards data based on filter tabs & sorting
 */
export async function getLeaderboardData(scope = 'Global', sortBy = 'xp', currentUser = null) {
  let list = [];

  // 1. Try to fetch real users from Firestore leaderboards first
  if (isFirebaseAvailable()) {
    try {
      const leaderRef = collection(db, 'leaderboards');
      let q = query(leaderRef, orderBy(sortBy, 'desc'), limit(50));
      
      const snap = await getDocs(q);
      list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn("Firestore leaderboard fetch error:", e);
    }
  }

  // 2. Fetch real users from Supabase users database to complement
  try {
    const { data: dbUsers, error: dbErr } = await supabase.from('users').select('*');
    if (!dbErr && dbUsers && dbUsers.length > 0) {
      const mergedList = [];
      
      for (const dbUser of dbUsers) {
        // Skip if user is already present in firestore list or is current logged-in user (appended later)
        if (list.some(u => u.id === dbUser.id) || (currentUser && dbUser.id === currentUser.uid)) continue;
        
        // Parse metadata packed in name field
        const parsed = parseProfileName(dbUser.name);
        
        // Calculate dynamic deterministic stats based on user record to make them feel "real"
        const registerDate = new Date(dbUser.created_at || Date.now());
        const daysSinceRegistration = Math.max(1, Math.floor((Date.now() - registerDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        // Seed realistic dynamic stats derived from database values
        const studyHours = Math.min(100, Math.floor(daysSinceRegistration * 1.5 + (dbUser.id.charCodeAt(0) % 10)));
        const notesShared = Math.min(25, Math.floor(studyHours / 6));
        const quizScore = 80 + (dbUser.id.charCodeAt(1) % 18);
        const streak = Math.min(45, Math.floor(daysSinceRegistration * 0.4 + (dbUser.id.charCodeAt(2) % 7)));
        
        // Total XP formula: studyHours * 20 + notesShared * 40 + streak * 15
        const xp = studyHours * 20 + notesShared * 40 + streak * 15 + 100;
        const levelDetails = getLevelFromXP(xp);
        
        mergedList.push({
          id: dbUser.id,
          name: parsed.name,
          college: parsed.college || 'GPREC',
          department: parsed.qualification || 'CSE',
          year: parsed.year || '3rd Year',
          city: parsed.place || 'Kurnool',
          state: parsed.place || 'Andhra Pradesh',
          country: 'India',
          xp,
          streak,
          badgesCount: Math.min(12, Math.floor(levelDetails.level * 1.2)),
          level: levelDetails.level,
          avatarUrl: dbUser.avatarUrl || '',
          quizScore,
          studyHours,
          notesShared
        });
      }
      
      // Combine list
      list = [...list, ...mergedList];
    }
  } catch (err) {
    console.error("Error loading real users from Supabase:", err);
  }

  // 3. Fallback to competitive mock users if list is still empty
  if (list.length === 0) {
    // LocalStorage Fallback
    list = LOCAL_DB.get('leaderboards', []);
  }

  // If current logged-in user is not in the list, dynamically append/sync them
  if (currentUser && !list.some(u => u.id === currentUser.uid)) {
    list.push({
      id: currentUser.uid,
      name: currentUser.name,
      college: currentUser.college,
      department: currentUser.qualification || 'CSE',
      year: currentUser.year,
      city: currentUser.place,
      state: currentUser.place,
      country: 'India',
      xp: currentUser.xp || 0,
      streak: currentUser.streak || 0,
      badgesCount: (currentUser.badges || []).length,
      level: currentUser.level || 1,
      avatarUrl: currentUser.avatarUrl || '',
      quizScore: currentUser.quizScore || 85,
      studyHours: currentUser.studyHours || 10,
      notesShared: currentUser.notesShared || 0
    });
  }

  // Filter based on SCOPE
  // Tabs: College, Department, Year, Friends, City, State, India, Global
  if (currentUser) {
    const userCity = (currentUser.place || '').toLowerCase().trim();
    const userCollege = (currentUser.college || '').toLowerCase().trim();
    const userDept = (currentUser.qualification || 'CSE').toLowerCase().trim();
    const userYear = (currentUser.year || '1st Year').toLowerCase().trim();

    if (scope === 'College') {
      list = list.filter(u => (u.college || '').toLowerCase().trim() === userCollege);
    } else if (scope === 'Department') {
      list = list.filter(u => (u.department || '').toLowerCase().trim() === userDept);
    } else if (scope === 'Year') {
      list = list.filter(u => (u.year || '').toLowerCase().trim() === userYear);
    } else if (scope === 'City') {
      list = list.filter(u => (u.city || '').toLowerCase().trim() === userCity || (u.state || '').toLowerCase().trim() === userCity);
    } else if (scope === 'State') {
      list = list.filter(u => (u.state || '').toLowerCase().trim().includes(userCity) || (u.city || '').toLowerCase().trim().includes(userCity));
    } else if (scope === 'Friends') {
      // Simulate friends list filter (e.g. users from same college or direct connections)
      list = list.filter(u => (u.college || '').toLowerCase().trim() === userCollege || u.id === currentUser.uid || u.id === 'mock1' || u.id === 'mock3');
    } else if (scope === 'India') {
      list = list.filter(u => u.country === 'India');
    }
  }

  // Sort dynamically based on SORTBY
  // Sort keys: xp, quizScore, studyHours, streak, notesShared
  list.sort((a, b) => {
    const valA = a[sortBy] !== undefined ? a[sortBy] : 0;
    const valB = b[sortBy] !== undefined ? b[sortBy] : 0;
    return valB - valA;
  });

  // Assign Ranks
  return list.map((user, index) => ({
    ...user,
    rank: index + 1
  }));
}

/**
 * Fetch active Challenges
 */
export function getDailyAndWeeklyChallenges(uid) {
  // Check local cache first to ensure persistent challenges for the day
  let challenges = LOCAL_DB.get(`challenges_${uid}`, null);
  const todayStr = new Date().toDateString();

  if (!challenges || challenges.date !== todayStr) {
    // Generate AI-aligned randomized challenges
    challenges = {
      date: todayStr,
      daily: [
        { id: 'd1', text: 'Solve 10 practice questions', target: 10, current: 0, rewardXp: 50, rewardCoins: 10, key: 'quiz_questions', type: 'quiz' },
        { id: 'd2', text: 'Study core concept for 20 minutes', target: 20, current: 0, rewardXp: 40, rewardCoins: 8, key: 'study_minutes', type: 'study' },
        { id: 'd3', text: 'Resolve one AI-generated study task', target: 1, current: 0, rewardXp: 30, rewardCoins: 5, key: 'ai_task', type: 'ai' }
      ],
      weekly: [
        { id: 'w1', text: 'Study for 100 minutes total', target: 100, current: 0, rewardXp: 150, rewardCoins: 30, key: 'study_minutes', type: 'study' },
        { id: 'w2', text: 'Score > 90% in two quizzes', target: 2, current: 0, rewardXp: 200, rewardCoins: 50, key: 'score_90_count', type: 'quiz' },
        { id: 'w3', text: 'Upload 3 high-quality revision notes', target: 3, current: 0, rewardXp: 120, rewardCoins: 25, key: 'notes_upload_count', type: 'notes' }
      ]
    };
    LOCAL_DB.set(`challenges_${uid}`, challenges);
  }

  return challenges;
}

/**
 * Update challenge progress
 */
export async function updateChallengeProgress(uid, progressKey, incrementVal = 1) {
  const challenges = getDailyAndWeeklyChallenges(uid);
  let xpGained = 0;
  let coinsGained = 0;
  let completedList = [];

  const updateList = (list) => {
    return list.map(ch => {
      if (ch.key === progressKey && ch.current < ch.target) {
        const newProgress = Math.min(ch.target, ch.current + incrementVal);
        const justCompleted = newProgress === ch.target && ch.current < ch.target;
        if (justCompleted) {
          xpGained += ch.rewardXp;
          coinsGained += ch.rewardCoins;
          completedList.push(ch.text);
        }
        return { ...ch, current: newProgress, completed: newProgress === ch.target };
      }
      return ch;
    });
  };

  challenges.daily = updateList(challenges.daily);
  challenges.weekly = updateList(challenges.weekly);
  LOCAL_DB.set(`challenges_${uid}`, challenges);

  if (xpGained > 0) {
    await awardXP(uid, 'COMPLETE_AI_TASK', xpGained); // Award accumulated XP
  }

  return {
    challenges,
    xpGained,
    coinsGained,
    completedList
  };
}

/**
 * Reset today's study minutes and streak completion for testing
 */
export function resetTodayProgressService(uid) {
  const todayStr = new Date().toDateString();
  
  // 1. Reset active seconds
  const storageKey = `lumixora_active_sec_${uid}_${todayStr}`;
  localStorage.removeItem(storageKey);
  
  // 2. Reset challenges in local storage
  let challenges = LOCAL_DB.get(`challenges_${uid}`, null);
  if (challenges) {
    challenges.daily = challenges.daily.map(ch => {
      if (ch.key === 'study_minutes') {
        return { ...ch, current: 0, completed: false };
      }
      return ch;
    });
    challenges.weekly = challenges.weekly.map(ch => {
      if (ch.key === 'study_minutes') {
        // Let's reset the weekly minutes progress to 0 for a clean test
        return { ...ch, current: 0, completed: false };
      }
      return ch;
    });
    LOCAL_DB.set(`challenges_${uid}`, challenges);
  }
  
  // 3. Remove today's date from completedDays in users profile
  const users = LOCAL_DB.get('users', {});
  const profile = users[uid];
  if (profile) {
    profile.completedDays = (profile.completedDays || []).filter(d => d !== todayStr);
    users[uid] = profile;
    LOCAL_DB.set('users', users);
  }
  
  return { challenges, profile };
}
