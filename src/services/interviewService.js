import { callAICompletion } from './aiService';

export const COMPANY_PRESETS = [
  { id: 'google', name: 'Google', logo: '🌐', color: 'from-blue-500 to-red-500', focus: 'DSA, System Design & Scalability' },
  { id: 'amazon', name: 'Amazon', logo: '📦', color: 'from-amber-500 to-yellow-600', focus: 'Leadership Principles & Algorithms' },
  { id: 'microsoft', name: 'Microsoft', logo: '🪟', color: 'from-blue-600 to-cyan-500', focus: 'Data Structures & Problem Solving' },
  { id: 'tcs_ninja', name: 'TCS Digital / Ninja', logo: '🏢', color: 'from-purple-600 to-indigo-600', focus: 'Core CS, Aptitude & OOPs' },
  { id: 'infosys', name: 'Infosys SP / DSE', logo: '💻', color: 'from-blue-500 to-indigo-700', focus: 'Java, Python & Problem Solving' },
  { id: 'accenture', name: 'Accenture ASE', logo: '⚡', color: 'from-purple-500 to-pink-500', focus: 'Coding, Pseudo-code & Communication' },
  { id: 'goldman', name: 'Goldman Sachs', logo: '📈', color: 'from-cyan-600 to-blue-700', focus: 'Math, Quant, Algorithms & C++' },
  { id: 'startup', name: 'Fast-Paced AI Startup', logo: '🚀', color: 'from-emerald-500 to-teal-600', focus: 'Full Stack, APIs & Pragmatic Problem Solving' }
];

export const ROLE_TRACKS = [
  { id: 'sde_fresher', name: 'Software Development Engineer (Fresher / Campus)', category: 'Technical' },
  { id: 'dsa_core', name: 'Data Structures & Algorithms Deep Dive', category: 'Technical' },
  { id: 'fullstack_web', name: 'Full Stack Web Developer (React / Node / DB)', category: 'Technical' },
  { id: 'core_cs', name: 'Core CS Fundamentals (OS, DBMS, CN, OOP)', category: 'Technical' },
  { id: 'ai_ml_engineer', name: 'AI / Machine Learning Engineer', category: 'Technical' },
  { id: 'hr_behavioral', name: 'HR & Behavioral Leadership Round', category: 'HR / Soft Skills' }
];

/**
 * Heuristic check for trivial gibberish, common dodges, or empty inputs
 */
export const checkAnswerHeuristic = (answer, question) => {
  const clean = (answer || '').trim().toLowerCase();
  
  if (!clean || clean.length < 3) {
    return {
      isTrivial: true,
      category: 'GIBBERISH_OR_EMPTY',
      feedback: "Answer is too short or empty. Please provide a meaningful response to the question asked.",
      score: 0
    };
  }

  // Common evasion phrases
  const dodgePhrases = [
    "i don't know", "i dont know", "no idea", "skip", "pass", "idk",
    "next question", "tell me the answer", "dont know", "no clue", "can we skip"
  ];
  if (dodgePhrases.some(p => clean === p || clean === p + "." || clean === p + "!")) {
    return {
      isTrivial: true,
      category: 'DODGE',
      feedback: "Acknowledged that you are unfamiliar with this concept. In a real technical interview, state what you know or reason from first principles rather than passing completely.",
      score: 2
    };
  }

  // Obvious non-technical gibberish or chat attempts
  const casualChat = [
    "hi", "hello", "how are you", "who are you", "what is your name",
    "what's up", "hey", "tell me a joke", "what is the weather"
  ];
  if (casualChat.some(c => clean === c || clean.startsWith(c + " ") || clean.startsWith(c + "?"))) {
    return {
      isTrivial: true,
      category: 'IRRELEVANT_CASUAL_CHAT',
      feedback: "⚠️ Irrelevant Response: This is a formal technical placement interview. Please address the interview problem asked instead of casual conversational remarks.",
      score: 1
    };
  }

  return { isTrivial: false };
};

/**
 * Generate the opening question for an interview session
 */
export const generateOpeningQuestion = async ({ company, role, experienceLevel, candidateName }) => {
  const prompt = `You are a senior technical interviewer at ${company.name} conducting a mock placement interview for ${role.name} (${experienceLevel}).
Candidate Name: ${candidateName || 'Candidate'}.

Instructions:
1. Deliver a brief, professional greeting (1 sentence).
2. Ask Question #1: A realistic, top-tier technical question specifically focused on ${role.name} and ${company.name}'s standard hiring bar.
3. Keep the prompt clean and directly readable by text-to-speech (avoid unnecessary markdown symbols).`;

  try {
    const response = await callAICompletion({
      prompt,
      temperature: 0.3,
      maxTokens: 400
    });
    return response || `Hello ${candidateName || 'Candidate'}, welcome to your ${company.name} technical interview for ${role.name}. Let's start: Can you explain how you would design an efficient LRU Cache with O(1) get and put operations, including the underlying data structures?`;
  } catch (err) {
    console.error('Error generating opening question:', err);
    return `Welcome to your ${company.name} technical interview. Let's begin: Can you explain the difference between a Process and a Thread in modern operating systems, and how CPU context switching works?`;
  }
};

/**
 * Evaluate student answer strictly for relevance, correctness, and depth
 */
export const evaluateAndAskFollowUp = async ({
  company,
  role,
  questionHistory,
  candidateAnswer,
  currentRound,
  totalRounds = 4
}) => {
  const isFinalQuestion = currentRound >= totalRounds;
  const currentQuestionText = questionHistory[questionHistory.length - 1]?.question || '';

  // 1. Run local heuristic check first
  const heuristic = checkAnswerHeuristic(candidateAnswer, currentQuestionText);
  if (heuristic.isTrivial) {
    let nextQ = "";
    if (!isFinalQuestion) {
      nextQ = `Let's move to Question ${currentRound + 1}: In ${role.name}, how would you optimize database query performance using indexing and explain the trade-off with write operations?`;
    }
    return {
      isRelevant: false,
      category: heuristic.category,
      feedback: heuristic.feedback,
      scoreOutOfTen: heuristic.score,
      nextQuestion: nextQ,
      isCompleted: isFinalQuestion
    };
  }

  const conversationContext = questionHistory.map((h, i) => `Round ${i+1}:
Interviewer Question: ${h.question}
Candidate Answer: ${h.answer || '(No answer)'}`).join('\n\n');

  const prompt = `You are a strict, senior technical interviewer at ${company.name} evaluating a placement candidate for ${role.name}.

Interview History:
${conversationContext}

LAST QUESTION ASKED:
"${currentQuestionText}"

CANDIDATE'S LATEST ANSWER:
"${candidateAnswer}"

Current Stage: Question ${currentRound} of ${totalRounds}.

CRITICAL EVALUATION RULES:
1. FIRST, CHECK SEMANTIC RELEVANCE:
   - If the candidate's answer is OFF-TOPIC, IRRELEVANT, GIBBERISH, or talks about something completely unrelated to "${currentQuestionText}", set "isRelevant": false, "scoreOutOfTen": 0 or 1, and explicitly tell them their answer is irrelevant to the question asked.
   - If the candidate admits they don't know ("I don't know", "no idea"), set "isRelevant": false, "scoreOutOfTen": 2, and provide a constructive note.
   - If the answer is RELEVANT, evaluate technical correctness, algorithmic complexity, data structures, and edge cases (score 4 to 10 based on depth).

2. FEEDBACK:
   - Provide 1-2 sentences of crisp, professional interviewer feedback addressing their exact points. If irrelevant, strictly flag it.

3. NEXT STEP:
   ${isFinalQuestion 
     ? `Set "isCompleted": true and "nextQuestion": ""` 
     : `Formulate Question #${currentRound + 1}: Ask a realistic, challenging follow-up question tailored for ${company.name} (${role.name}).`
   }

Respond ONLY with valid JSON matching this schema:
{
  "isRelevant": true,
  "category": "RELEVANT",
  "feedback": "1-2 sentences of critique or praise",
  "scoreOutOfTen": 8,
  "nextQuestion": "${isFinalQuestion ? '' : 'Next question text'}",
  "isCompleted": ${isFinalQuestion}
}`;

  try {
    const response = await callAICompletion({
      prompt,
      temperature: 0.2,
      maxTokens: 650
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Ensure score is bounded properly
      parsed.scoreOutOfTen = Math.max(0, Math.min(10, Number(parsed.scoreOutOfTen) || (parsed.isRelevant === false ? 1 : 6)));
      if (parsed.isRelevant === false && parsed.scoreOutOfTen > 3) {
        parsed.scoreOutOfTen = 1; // Strict clamp on irrelevant answers
      }
      return parsed;
    }
  } catch (err) {
    console.warn('AI evaluation parsing fallback:', err);
  }

  // Safe conservative fallback based on length and keyword relevance
  const isShort = candidateAnswer.trim().split(/\s+/).length < 6;
  return {
    isRelevant: !isShort,
    category: isShort ? 'TOO_BRIEF' : 'RELEVANT',
    feedback: isShort 
      ? "⚠️ Answer is too brief and lacks technical depth for a senior placement round. Score: 2/10."
      : "Answer received. Good conceptual attempt, but make sure to elaborate on edge cases, memory limits, and algorithmic complexities.",
    scoreOutOfTen: isShort ? 2 : 6,
    nextQuestion: isFinalQuestion ? "" : `Let's proceed to Question ${currentRound + 1}: How would you detect and resolve high CPU usage or memory leaks in a distributed backend system?`,
    isCompleted: isFinalQuestion
  };
};

/**
 * Generate final comprehensive scorecard after interview completion
 */
export const generateInterviewScorecard = async ({
  company,
  role,
  experienceLevel,
  candidateName,
  history
}) => {
  // Calculate true mathematical average score
  const validScores = history.map(h => typeof h.score === 'number' ? h.score : 6);
  const avgScoreOutOfTen = validScores.length > 0 
    ? (validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : 6;
  const calculatedPercent = Math.round(avgScoreOutOfTen * 10);

  const hasIrrelevantAnswers = history.some(h => h.isRelevant === false || (h.score !== undefined && h.score <= 3));
  const isPassing = calculatedPercent >= 70 && !hasIrrelevantAnswers;

  const historyText = history.map((h, i) => `Round ${i+1}:
Question: ${h.question}
Answer: ${h.answer || '(No answer)'}
Score: ${h.score || 0}/10
Relevant: ${h.isRelevant !== false ? 'YES' : 'NO (Irrelevant/Dodged)'}
Feedback: ${h.feedback || 'N/A'}`).join('\n\n');

  const prompt = `Generate a realistic Placement Diagnostic Scorecard for a mock technical interview.
Candidate: ${candidateName}
Company: ${company.name}
Role: ${role.name} (${experienceLevel})
Average Score Calculated: ${calculatedPercent}%
Candidate Passed Interview: ${isPassing}

Transcript History:
${historyText}

CRITICAL RULES:
- If the candidate gave irrelevant, off-topic, or dodged answers, the verdict MUST reflect failure (e.g. "Needs Improvement / Not Cleared"), "overallScore" must be under 65%, and "credentialEligible" MUST be false.
- If the candidate answered technically well (average score >= 70%), verdict can be "Selected / Cleared" and "credentialEligible" can be true.

Return ONLY valid JSON matching this schema:
{
  "overallScore": ${calculatedPercent},
  "technicalAccuracy": ${Math.max(10, Math.min(100, calculatedPercent + 2))},
  "communicationScore": ${Math.max(10, Math.min(100, calculatedPercent - 2))},
  "problemSolvingScore": ${calculatedPercent},
  "verdict": "${isPassing ? 'Selected / Cleared' : 'Needs Improvement / Not Cleared'}",
  "summary": "2-3 sentences evaluating their specific answers truthfully.",
  "strengths": ["Specific strength 1", "Specific strength 2"],
  "improvements": ["Area for improvement 1", "Area for improvement 2"],
  "companyFitAnalysis": "Analysis against ${company.name}'s hiring bar.",
  "credentialEligible": ${isPassing},
  "recommendedNextTopics": ["Topic 1", "Topic 2"]
}`;

  try {
    const response = await callAICompletion({
      prompt,
      temperature: 0.2,
      maxTokens: 800
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.overallScore = calculatedPercent;
      parsed.credentialEligible = isPassing && parsed.overallScore >= 70;
      return parsed;
    }
  } catch (err) {
    console.error('Scorecard generation fallback:', err);
  }

  return {
    overallScore: calculatedPercent,
    technicalAccuracy: calculatedPercent,
    communicationScore: Math.max(20, calculatedPercent - 5),
    problemSolvingScore: calculatedPercent,
    verdict: isPassing ? "Selected / Cleared" : "Needs Improvement / Not Cleared",
    summary: isPassing 
      ? `Candidate demonstrated solid competence in ${role.name} fundamentals and answered the ${company.name} placement questions with clarity.`
      : `Candidate struggled with several rounds or provided incomplete/off-topic answers. Further revision of core ${role.name} concepts is recommended before attending real ${company.name} drives.`,
    strengths: isPassing 
      ? ["Structured problem solving", "Clear explanation of time/space complexity", "Handled edge cases well"]
      : ["Enthusiasm to interview", "Attempted the placement rounds"],
    improvements: isPassing
      ? ["Deepen knowledge of distributed scaling", "More concise opening statements"]
      : ["Stay strictly focused on the technical problem asked", "Avoid dodging core DSA/System design questions", "Revise fundamental CS concepts"],
    companyFitAnalysis: isPassing 
      ? `Meets the initial technical screening threshold for ${company.name}.`
      : `Does not currently meet the technical benchmark for ${company.name} campus hiring.`,
    credentialEligible: isPassing,
    recommendedNextTopics: ["DSA Practice Problems", "System Design & Storage Internals", "Core CS Fundamentals"]
  };
};
