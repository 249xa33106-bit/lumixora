// AI Study Coach Service for Lumixora Study With Me

// ─── Local Coaching Message Banks ───────────────────────────────────────────

const COACH_MESSAGES = {
  start: [
    "🚀 Session started! Let's crush this goal.",
    "📚 Your focus journey begins. You've got this!",
    "⚡ Deep work mode activated. Distractions — off. Goals — on.",
    "🎯 You've committed. Now let's deliver.",
    "🔥 The timer is ticking. Make every second count!"
  ],
  early: [ // 0–25% done
    "💪 Great start! Keep the momentum going.",
    "🧠 Your brain is warming up — this is where mastery begins.",
    "📖 Stay with it. The first stretch is always the hardest.",
    "✨ One minute of focus now builds a habit for life.",
    "🎯 You set the goal. Now honour it."
  ],
  midway: [ // 25–50%
    "🔥 You're 25% in — phenomenal! Keep pushing.",
    "💡 Halfway there isn't far. Stay locked in.",
    "📚 Mid-session energy is key. Take a deep breath and continue.",
    "⏱️ Time flies when you're in flow. Stay in it!",
    "🌟 Your future self will thank you for this session."
  ],
  deep: [ // 50–75%
    "🏆 Over halfway! The hard part is behind you.",
    "🚀 You're deep in the zone now. Don't break focus!",
    "🔥 Streak protected! Every minute builds your score.",
    "🧠 Deep work — this is where real learning happens.",
    "💪 You're stronger than any distraction right now."
  ],
  final: [ // 75–100%
    "🏁 Almost there! The finish line is in sight.",
    "⚡ Final stretch — give it everything you've got!",
    "🌟 This is the moment champions are made. Push through!",
    "🎯 Your goal is just minutes away. Don't stop now!",
    "🔥 Sprint to the end. You've earned this."
  ],
  distraction: [
    "👀 Noticed a distraction — shake it off and refocus.",
    "💪 One distraction doesn't define the session. Keep going!",
    "🎯 Distractions happen. Champions redirect. Come back!",
    "🧠 Your focus score dipped — let's earn it back.",
    "⚡ Reset. Refocus. Resume. You've got this."
  ],
  break: [
    "☕ Break time! Rest your eyes and stretch.",
    "🌿 A quality break makes the next session sharper.",
    "😌 Step away — your brain needs oxygen too.",
    "🎵 Relax for a moment. You've earned it.",
    "💧 Hydrate! Your brain runs on water."
  ],
  resumed: [
    "💥 Welcome back! Let's continue crushing it.",
    "🔥 You returned — that's discipline right there.",
    "⚡ Back in action. Every second counts from here.",
    "🎯 Refocused and ready. Let's go!",
    "🧠 The comeback is always stronger. Let's prove it."
  ]
};

/**
 * Get a random coaching message based on session context
 */
export function getCoachMessage(context = 'early', progressPercent = 0) {
  let pool;
  if (context === 'start') pool = COACH_MESSAGES.start;
  else if (context === 'distraction') pool = COACH_MESSAGES.distraction;
  else if (context === 'break') pool = COACH_MESSAGES.break;
  else if (context === 'resumed') pool = COACH_MESSAGES.resumed;
  else if (progressPercent >= 75) pool = COACH_MESSAGES.final;
  else if (progressPercent >= 50) pool = COACH_MESSAGES.deep;
  else if (progressPercent >= 25) pool = COACH_MESSAGES.midway;
  else pool = COACH_MESSAGES.early;

  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Focus Score Calculator ──────────────────────────────────────────────────

/**
 * Calculate a 0–100 focus score based on session metrics
 */
export function calculateFocusScore({ totalMinutes, activeMinutes, distractions, breakMinutes, completed }) {
  if (totalMinutes === 0) return 0;

  // Base score from active time ratio
  const activeRatio = Math.min(activeMinutes / totalMinutes, 1);
  let score = activeRatio * 60;

  // Completion bonus (up to 20 pts)
  if (completed) score += 20;
  else score += Math.round((activeMinutes / totalMinutes) * 10);

  // Break ratio penalty (excessive breaks hurt score)
  const breakRatio = breakMinutes / totalMinutes;
  if (breakRatio > 0.3) score -= Math.round((breakRatio - 0.3) * 40);

  // Distraction penalty (up to -20 pts)
  const distractionPenalty = Math.min(distractions * 2, 20);
  score -= distractionPenalty;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getFocusLabel(score) {
  if (score >= 90) return { label: 'Excellent 🏆', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' };
  if (score >= 70) return { label: 'Good 🎯', color: 'text-brand-teal', bg: 'bg-brand-teal/10 border-brand-teal/20' };
  if (score >= 50) return { label: 'Average 📚', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' };
  return { label: 'Needs Improvement 💪', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
}

// ─── XP Calculator ───────────────────────────────────────────────────────────

export function calculateSessionXP({ totalMinutes, focusScore, completed, distractions }) {
  let xp = 0;
  // Base: 1 XP per study minute
  xp += Math.round(totalMinutes * 1);
  // Focus multiplier
  const multiplier = focusScore >= 90 ? 1.5 : focusScore >= 70 ? 1.2 : focusScore >= 50 ? 1.0 : 0.8;
  xp = Math.round(xp * multiplier);
  // Completion bonus
  if (completed) xp += 25;
  // Distraction penalty
  xp = Math.max(5, xp - distractions * 2);
  return xp;
}

// ─── Motivational Quotes ─────────────────────────────────────────────────────

const MOTIVATIONAL_QUOTES = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice.", author: "Pelé" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { quote: "Great things never come from comfort zones.", author: "Unknown" },
  { quote: "Study while others are sleeping; work while others are loafing.", author: "William Arthur Ward" }
];

export function getRandomQuote() {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

// ─── Session Storage Helpers ──────────────────────────────────────────────────

const STORAGE_KEY = 'lumixora_study_sessions';
const ANALYTICS_KEY = 'lumixora_study_analytics';

export function saveSession(userId, sessionData) {
  try {
    const key = `${STORAGE_KEY}_${userId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift({ ...sessionData, id: Date.now(), savedAt: new Date().toISOString() });
    // Keep last 100 sessions
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 100)));
    updateAnalytics(userId, sessionData);
    return true;
  } catch (e) {
    console.error('Failed to save study session:', e);
    return false;
  }
}

export function getSessions(userId) {
  try {
    const key = `${STORAGE_KEY}_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

function updateAnalytics(userId, session) {
  try {
    const key = `${ANALYTICS_KEY}_${userId}`;
    const analytics = JSON.parse(localStorage.getItem(key) || '{}');
    const today = new Date().toDateString();
    const week = getWeekKey();
    const month = getMonthKey();

    analytics.totalSessions = (analytics.totalSessions || 0) + 1;
    analytics.totalMinutes = (analytics.totalMinutes || 0) + (session.totalMinutes || 0);
    analytics.totalXP = (analytics.totalXP || 0) + (session.xpEarned || 0);

    // Daily aggregation
    if (!analytics.daily) analytics.daily = {};
    analytics.daily[today] = (analytics.daily[today] || 0) + (session.totalMinutes || 0);

    // Weekly aggregation
    if (!analytics.weekly) analytics.weekly = {};
    analytics.weekly[week] = (analytics.weekly[week] || 0) + (session.totalMinutes || 0);

    // Monthly aggregation
    if (!analytics.monthly) analytics.monthly = {};
    analytics.monthly[month] = (analytics.monthly[month] || 0) + (session.totalMinutes || 0);

    // Focus score rolling average
    const scores = analytics.focusScores || [];
    scores.push(session.focusScore || 0);
    analytics.focusScores = scores.slice(-30); // Keep last 30
    analytics.avgFocusScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Subjects
    if (!analytics.subjects) analytics.subjects = {};
    const subj = session.subject || 'General';
    analytics.subjects[subj] = (analytics.subjects[subj] || 0) + (session.totalMinutes || 0);

    // Streak
    const lastDate = analytics.lastStudyDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastDate === yesterday.toDateString()) {
      analytics.currentStreak = (analytics.currentStreak || 0) + 1;
    } else if (lastDate !== today) {
      analytics.currentStreak = 1;
    }
    analytics.longestStreak = Math.max(analytics.longestStreak || 0, analytics.currentStreak || 1);
    analytics.lastStudyDate = today;

    localStorage.setItem(key, JSON.stringify(analytics));
  } catch (e) {
    console.error('Failed to update analytics:', e);
  }
}

export function getAnalytics(userId) {
  try {
    const key = `${ANALYTICS_KEY}_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch { return {}; }
}

function getWeekKey() {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

// ─── AI Post-Session Feedback ─────────────────────────────────────────────────

export async function getAISessionFeedback({ subject, goal, focusScore, totalMinutes, distractions, completed }) {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error('No API key');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a warm, encouraging AI study coach for university students. Analyze the student's study session and provide personalized feedback.
Output ONLY a valid JSON object with this schema:
{
  "feedback": "2-3 sentences of personalized, warm feedback based on their metrics",
  "strength": "One specific strength from this session",
  "improvement": "One specific, actionable improvement tip",
  "nextSessionTip": "A concrete tip for their next study session on this subject"
}`
          },
          {
            role: 'user',
            content: `Subject: ${subject}
Goal: ${goal}
Session Duration: ${totalMinutes} minutes
Focus Score: ${focusScore}/100
Distractions Detected: ${distractions}
Session Completed: ${completed ? 'Yes' : 'No (ended early)'}`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    let text = data.choices[0].message.content;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = text.indexOf('{'), end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) text = text.substring(start, end + 1);
    return JSON.parse(text);
  } catch {
    return {
      feedback: `You studied ${subject} for ${totalMinutes} minutes with a focus score of ${focusScore}/100. ${focusScore >= 70 ? 'That\'s a solid session!' : 'Every session builds the habit — keep going!'}`,
      strength: focusScore >= 70 ? 'Strong sustained focus throughout the session.' : 'You showed up and put in the time — that\'s the first step.',
      improvement: distractions > 3 ? 'Try putting your phone on Do Not Disturb before your next session.' : 'Consider using the Pomodoro technique for longer goals.',
      nextSessionTip: `Review what you covered in ${subject} briefly before starting your next session to activate prior knowledge.`
    };
  }
}
