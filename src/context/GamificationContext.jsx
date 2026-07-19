import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getUserProfile, 
  awardXP, 
  trackDailyActivity, 
  buyShopItem, 
  getLeaderboardData, 
  getDailyAndWeeklyChallenges,
  updateChallengeProgress,
  resetTodayProgressService,
  ALL_ACHIEVEMENTS
} from '../services/gamificationService';
import { useToast } from './ToastContext';

const GamificationContext = createContext();

export function GamificationProvider({ children, user, activeTab }) {
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState({ daily: [], weekly: [] });
  
  // Animation/Celebration States
  const [levelUpData, setLevelUpData] = useState(null); // { level: X, oldLevel: Y }
  const [streakMilestone, setStreakMilestone] = useState(null); // "3-Day Streak!"
  const [unlockedBadge, setUnlockedBadge] = useState(null); // badge details
  const [isStudying, setIsStudying] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  
  useEffect(() => {
    const handleActivity = () => setLastInteractionTime(Date.now());
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, []);

  // Load profile when user logs in
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const prof = await getUserProfile(user.id, user);
        setProfile(prof);
        setIsStudying(true); // Auto-start background study tracker once profile loads
        
        // Load challenges
        const ch = getDailyAndWeeklyChallenges(user.id);
        setChallenges(ch);
        
        // Award daily login XP once per day
        const todayStr = new Date().toDateString();
        if (prof.lastActiveDate !== todayStr) {
          addToast({ message: "Daily Login! +10 XP 🔥", type: "success" });
          const res = await awardXP(user.id, 'DAILY_LOGIN');
          if (res) {
            setProfile(prev => ({ ...prev, ...res }));
          }
        }
      } catch (e) {
        console.error("Error loading gamification profile:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Award XP helper
  const handleAwardXP = async (actionKey, customVal = null) => {
    if (!user || !profile) return;
    try {
      const res = await awardXP(user.id, actionKey, customVal);
      if (res) {
        // Check for level up
        if (res.levelUpOccurred) {
          setLevelUpData({ level: res.level, oldLevel: profile.level });
        }
        
        setProfile(prev => ({
          ...prev,
          ...res
        }));

        // Award toast
        addToast({ 
          message: `+${res.xpEarned} XP Earned! (${actionKey.toLowerCase().replace(/_/g, ' ')})`, 
          type: 'info' 
        });

        // Trigger challenge update if related to tasks, notes, doubts
        if (actionKey === 'COMPLETE_AI_TASK') {
          await handleUpdateChallenge('ai_task', 1);
          await handleTrackActivity('ai_task', 1); // SECURE STREAK AUTOMATICALLY!
        } else if (actionKey === 'UPLOAD_NOTES') {
          await handleUpdateChallenge('notes_upload_count', 1);
          await handleTrackActivity('ai_task', 1); // SECURE STREAK AUTOMATICALLY!
        } else if (actionKey === 'FINISH_QUIZ') {
          await handleUpdateChallenge('quiz', 1);
          await handleTrackActivity('quiz_questions', 10); // SECURE STREAK AUTOMATICALLY!
        } else if (actionKey === 'HELP_STUDENT') {
          await handleTrackActivity('ai_task', 1); // SECURE STREAK AUTOMATICALLY!
        }

        // Check and unlock achievements
        await checkAchievements(res.level, res.xp);
      }
    } catch (e) {
      console.error("XP Award failed:", e);
    }
  };

  // Track daily study activity (video min, quiz questions, study min, AI task)
  const handleTrackActivity = async (activityType, countVal) => {
    if (!user || !profile) return;
    try {
      const res = await trackDailyActivity(user.id, activityType, countVal);
      
      // Update challenges progress
      if (activityType === 'study_minutes') {
        await handleUpdateChallenge('study_minutes', countVal);
      } else if (activityType === 'quiz_questions') {
        await handleUpdateChallenge('quiz_questions', countVal);
      }

      if (res.success && res.streak > profile.streak) {
        setProfile(prev => ({
          ...prev,
          streak: res.streak,
          longestStreak: res.longestStreak,
          coins: res.coins || prev.coins
        }));

        addToast({ message: `Daily Streak Secured! ${res.streak} Days 🔥`, type: 'success' });
        
        if (res.milestoneUnlocked) {
          setStreakMilestone(res.milestoneUnlocked);
          // Unlock streak badges
          if (res.streak === 3) await unlockBadge('streak_3');
          if (res.streak === 7) await unlockBadge('streak_7');
          if (res.streak === 30) await unlockBadge('streak_30');
          if (res.streak === 100) await unlockBadge('streak_100');
        }
      }
    } catch (e) {
      console.error("Track activity failed:", e);
    }
  };

  // Update AI Challenge Progress
  const handleUpdateChallenge = async (progressKey, incrementVal) => {
    if (!user || !profile) return;
    try {
      const res = await updateChallengeProgress(user.id, progressKey, incrementVal);
      setChallenges(res.challenges);
      
      if (res.xpGained > 0) {
        addToast({ 
          message: `Challenge Completed! +${res.xpGained} XP & +${res.coinsGained} Coins 🪙`, 
          type: 'success' 
        });
        
        setProfile(prev => ({
          ...prev,
          xp: prev.xp + res.xpGained,
          coins: prev.coins + res.coinsGained
        }));

        // Re-calculate level
        const levelDetails = getLevelFromXP(profile.xp + res.xpGained);
        if (levelDetails.level > profile.level) {
          setLevelUpData({ level: levelDetails.level, oldLevel: profile.level });
          setProfile(prev => ({ ...prev, level: levelDetails.level }));
        }
      }
    } catch (e) {
      console.error("Update challenge progress failed:", e);
    }
  };

  // Purchase Shop Item
  const handleBuyItem = async (itemType, itemId, cost) => {
    if (!user || !profile) return;
    const res = await buyShopItem(user.id, itemType, itemId, cost);
    if (res.success) {
      setProfile(prev => ({
        ...prev,
        coins: res.coins,
        ...res.updates
      }));
      addToast({ message: "Purchase successful! Item unlocked.", type: 'success' });
      return true;
    } else {
      addToast({ message: res.msg, type: 'error' });
      return false;
    }
  };

  // Select / Active Custom Theme or Frame
  const handleEquipItem = async (type, itemId) => {
    if (!user || !profile) return;
    try {
      const updates = type === 'theme' ? { currentTheme: itemId } : { currentFrame: itemId };
      setProfile(prev => ({ ...prev, ...updates }));
      const userRef = getUserProfile(user.id); // updates local cache
      const cachedUsers = localStorage.getItem('lumixora_gamify_users');
      if (cachedUsers) {
        const parsed = JSON.parse(cachedUsers);
        if (parsed[user.id]) {
          parsed[user.id] = { ...parsed[user.id], ...updates };
          localStorage.setItem('lumixora_gamify_users', JSON.stringify(parsed));
        }
      }
      addToast({ message: `Equipped ${type}!`, type: 'success' });
    } catch (e) {
      console.error(e);
    }
  };

  // Unlock Achievements/Badges
  const unlockBadge = async (badgeId) => {
    if (!user || !profile) return;
    const currentBadges = profile.badges || [];
    if (currentBadges.includes(badgeId)) return;

    const badgeInfo = ALL_ACHIEVEMENTS.find(a => a.id === badgeId);
    if (!badgeInfo) return;

    const newBadges = [...currentBadges, badgeId];
    setProfile(prev => ({ ...prev, badges: newBadges }));
    
    // Write profile updates
    const cachedUsers = localStorage.getItem('lumixora_gamify_users');
    if (cachedUsers) {
      const parsed = JSON.parse(cachedUsers);
      if (parsed[user.id]) {
        parsed[user.id].badges = newBadges;
        localStorage.setItem('lumixora_gamify_users', JSON.stringify(parsed));
      }
    }

    setUnlockedBadge(badgeInfo);
    addToast({ message: `Achievement Unlocked: ${badgeInfo.name}! 🏆`, type: 'success' });
    
    // Award achievement XP
    await handleAwardXP('COMPLETE_AI_TASK', badgeInfo.xpReward);
  };

  // Automated checks for Achievements
  const checkAchievements = async (currentLevel, currentXp) => {
    if (!profile) return;
    
    // Level Based
    if (currentLevel >= 5) await unlockBadge('study_champion');
    if (currentLevel >= 10) await unlockBadge('top_10_leaderboard');
    
    // First time login
    await unlockBadge('first_login');
  };

  // Refresh Leaderboard
  const fetchLeaderboard = async (scope, sortBy) => {
    if (!user || !profile) return;
    try {
      const data = await getLeaderboardData(scope, sortBy, profile);
      setLeaderboard(data);
    } catch (e) {
      console.error("Leaderboard fetch error:", e);
    }
  };

  // Streak reminder helper: triggers alert if today's activity is not completed before midnight
  const triggerStreakReminder = () => {
    const todayStr = new Date().toDateString();
    if (profile && !profile.completedDays?.includes(todayStr)) {
      addToast({ 
        message: "Warning: Your daily learning streak is at risk! Complete a task or study now to protect it 🔥", 
        type: 'error',
        duration: 8000
      });
    }
  };

  // Simulate Midnight Streak Protection Check — only fire after 5 minutes of idle if not yet completed today
  useEffect(() => {
    if (!profile) return;
    const todayStr = new Date().toDateString();
    const alreadyCompleted = profile.completedDays?.includes(todayStr);
    if (alreadyCompleted) return; // Don't nag if they've already studied today
    
    const reminderTimeout = setTimeout(() => {
      triggerStreakReminder();
    }, 5 * 60 * 1000); // 5 minutes, not 15 seconds
    
    return () => clearTimeout(reminderTimeout);
  }, [profile?.completedDays]);

  // Automatic background active study tracker
  useEffect(() => {
    if (!user || !profile || !isStudying) return;

    // Every 10 seconds of active usage, we increment study count
    const interval = setInterval(async () => {
      try {
        const todayStr = new Date().toDateString();
        const completedDays = profile.completedDays || [];
        
        // Skip if today is already completed
        if (completedDays.includes(todayStr)) return;
        
        // Anti-Cheating Idle Check: Pause if no mouse/key action for 45s
        if (Date.now() - lastInteractionTime > 45000) {
          return;
        }

        const storageKey = `lumixora_active_sec_${user.id}_${todayStr}`;
        const currentSeconds = parseInt(localStorage.getItem(storageKey) || '0') + 10;
        localStorage.setItem(storageKey, String(currentSeconds));
        
        // Every 10 seconds of active study counts as 1 study minute towards challenges
        await handleTrackActivity('study_minutes', 1);
        
        // Once user achieves 20 minutes study target (20 ticks = 200 seconds of active page view)
        if (currentSeconds === 200) {
          addToast({ 
            message: "20 Minutes Study Threshold Achieved! Daily streak secured automatically! 🎓🔥", 
            type: 'success' 
          });
          await handleAwardXP('STUDY_20_MIN');
        }
      } catch (err) {
        console.error("Background study tracker error:", err);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user, profile?.completedDays, isStudying, lastInteractionTime]);

  const handleResetTodayProgress = async () => {
    if (!user || !profile) return;
    try {
      const res = resetTodayProgressService(user.id);
      if (res.challenges) setChallenges(res.challenges);
      if (res.profile) setProfile(res.profile);
      addToast({ 
        message: "Today's study progress reset! Go to Notes or Playlists to test the live tracker! 🔄", 
        type: 'success' 
      });
    } catch (err) {
      console.error("Error resetting progress:", err);
    }
  };

  const value = {
    profile,
    loading,
    leaderboard,
    challenges,
    levelUpData,
    setLevelUpData,
    streakMilestone,
    setStreakMilestone,
    unlockedBadge,
    setUnlockedBadge,
    isStudying,
    setIsStudying,
    awardXP: handleAwardXP,
    trackActivity: handleTrackActivity,
    updateChallenge: handleUpdateChallenge,
    buyShopItem: handleBuyItem,
    equipItem: handleEquipItem,
    fetchLeaderboard,
    unlockBadge,
    triggerStreakReminder,
    resetTodayProgress: handleResetTodayProgress
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  return useContext(GamificationContext);
}
