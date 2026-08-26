import { GoogleGenerativeAI } from '@google/generative-ai';

export const getOpenRouterApiKey = () => {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_DEEPSEEK_API_KEY || "";
  return key;
};

export const callAICompletion = async (params) => {
  let messages = [];
  let temperature = 0.3;
  let maxTokens = 1500;
  let responseFormat = null;

  if (typeof params === 'string') {
    messages = [{ role: 'user', content: params }];
  } else if (params && Array.isArray(params)) {
    messages = params;
  } else if (params && params.messages) {
    messages = params.messages;
    if (params.temperature !== undefined) temperature = params.temperature;
    if (params.maxTokens !== undefined) maxTokens = params.maxTokens;
    if (params.responseFormat !== undefined) responseFormat = params.responseFormat;
  } else if (params && params.prompt) {
    messages = [{ role: 'user', content: params.prompt }];
  }

  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Sanitize messages so content is always a clean string for text models
  const sanitizedMessages = messages.map(m => {
    if (Array.isArray(m.content)) {
      const textObj = m.content.find(item => item.type === 'text' || typeof item === 'string');
      const textContent = textObj ? (typeof textObj === 'string' ? textObj : textObj.text) : 'Explain this academic topic in detail.';
      return { role: m.role, content: textContent };
    }
    return m;
  });

  // 1. Try Gemini API first if available
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const promptText = sanitizedMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
      const result = await model.generateContent(promptText);
      const text = result.response.text();
      if (text && text.trim()) return text.trim();
    } catch (gErr) {
      console.warn("Gemini request fallback note:", gErr);
    }
  }

  // 2. Try OpenRouter API
  if (openRouterKey) {
    try {
      const body = {
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: sanitizedMessages,
        temperature,
        max_tokens: Math.min(maxTokens, 1500)
      };
      if (responseFormat) body.response_format = responseFormat;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Lumixora"
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          return data.choices[0].message.content;
        }
      }
    } catch (orErr) {
      console.warn("OpenRouter request error:", orErr);
    }
  }

  // 3. Try Groq API
  if (groqKey) {
    try {
      const body = {
        model: "openai/gpt-oss-120b",
        messages: sanitizedMessages,
        temperature,
        max_tokens: Math.min(maxTokens, 1500)
      };
      if (responseFormat) body.response_format = responseFormat;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          return data.choices[0].message.content;
        }
      }
    } catch (groqErr) {
      console.warn("Groq request error:", groqErr);
    }
  }

  return null;
};

export async function generateNoteEnhancement(textContent) {
  try {
    const systemPrompt = `You are an expert AI professor. Analyze the provided material and output ONLY a valid JSON object:
{
  "summary": "Detailed theory in Markdown.",
  "concepts": ["Concept 1", "Concept 2"],
  "questions": [
    { "q": "[2 MARKS] Short question?", "a": "Answer." },
    { "q": "[5 MARKS] Medium question?", "a": "Answer." },
    { "q": "[10 MARKS] Essay question?", "a": "Answer." }
  ]
}`;

    const textResponse = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Study Material:\n${textContent}` }
      ],
      temperature: 0.3
    });

    if (textResponse) {
      const jsonStart = textResponse.indexOf('{');
      const jsonEnd = textResponse.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const cleanJson = textResponse.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(cleanJson);
      }
    }
    
    return {
      summary: textResponse || "Enhanced study notes generated based on provided course content.",
      concepts: ["Key Concept 1", "Key Concept 2"],
      questions: [
        { q: "[2 MARKS] Define main topic?", a: "Direct summary." },
        { q: "[5 MARKS] Explain core principles?", a: "Comprehensive breakdown." },
        { q: "[10 MARKS] Analyze application?", a: "In-depth theoretical analysis." }
      ]
    };
  } catch (error) {
    console.error("Error generating AI enhancement:", error);
    return {
      summary: "Enhanced study notes generated based on provided course content.",
      concepts: ["Core Theory", "Application"],
      questions: [
        { q: "[2 MARKS] What is the primary objective?", a: "Detailed study analysis." }
      ]
    };
  }
}

export async function generateDoubtResolution(questionOrContext, subject = 'General', isContext = false, imageBase64 = null) {
  try {
    const rawQuery = typeof questionOrContext === 'string' ? questionOrContext : JSON.stringify(questionOrContext);
    const queryStr = rawQuery.trim();

    const systemPrompt = `You are an expert AI academic tutor for ${subject}. 
The student is asking a doubt or seeking mentorship.
If the student asks a question (or inputs short terms like "explain", "detail", "solve", or a subject name), provide a MASSIVE, crystal-clear, textbook-grade academic explanation.
Include:
1. Core Concept Overview & Definition
2. Key Principles, Equations, & Code/Logic Examples
3. Step-by-Step Problem Solving & Real-World Application.
Be direct, supportive, and extremely clear.`;

    let messages = [{ role: "system", content: systemPrompt }];
    if (isContext && Array.isArray(questionOrContext)) {
      messages = messages.concat(questionOrContext);
    } else {
      let promptContent = queryStr;
      if (!promptContent || promptContent.toLowerCase() === 'explain' || promptContent.length < 3) {
        promptContent = `Can you explain the key fundamental concepts, algorithms, code syntax, and practical applications of ${subject}?`;
      }
      messages.push({ role: "user", content: promptContent });
    }

    let aiResponse = await callAICompletion({ messages, temperature: 0.5 });
    
    if (!aiResponse) {
      const topicName = (queryStr && queryStr.length > 2 && queryStr.toLowerCase() !== 'explain') ? queryStr : subject;
      aiResponse = `### 📚 Academic Mastery Guide: ${topicName}

#### 1. Core Concept & Overview
**${topicName}** represents a fundamental pillar in ${subject}. It encompasses core theoretical models, algorithmic rules, and system architecture.

#### 2. Key Principles & Implementation Example
- **Foundational Architecture**: Efficient memory management, explicit data structures, and predictable execution loops.
- **Code & Logic Structure**:
\`\`\`c
/* Academic Demonstration for ${topicName} */
#include <stdio.h>

int main() {
    printf("Mastering ${topicName} - Step-by-Step Logical Execution\\n");
    return 0;
}
\`\`\`

#### 3. Step-by-Step Problem Solving Approach
1. **Understand Input Constraints**: Analyze variable boundaries, types, and operational requirements.
2. **Formulate Solution Strategy**: Apply deterministic algorithms with minimal time complexity.
3. **Verify Output Integrity**: Validate against edge cases, unit tests, and system benchmarks.`;
    }

    return aiResponse;
  } catch (error) {
    console.error("Error generating doubt resolution:", error);
    return `Here is a clear academic resolution for your doubt in ${subject}: Apply core formulas step-by-step, verify boundary conditions, and check unit consistency.`;
  }
}


export async function generateCognitiveChallenge(userName) {
  try {
    const apiKey = getOpenRouterApiKey();

    const systemPrompt = `You are a friendly AI gatekeeper. Generate a VERY EASY, standard, classic riddle that is extremely simple for a human to solve in 2 seconds. 
Examples of allowed riddles:
- "What has hands but cannot clap?" (answer: "clock")
- "What gets wetter the more it dries?" (answer: "towel")
- "What has keys but can't open locks?" (answer: "keyboard")
- "What goes up but never comes down?" (answer: "age")
- "What has a head and a tail but no body?" (answer: "coin")
- "What has one eye but cannot see?" (answer: "needle")

You must output ONLY a valid JSON object. Do not include markdown code blocks or backticks.
Format:
{
  "puzzle": "The puzzle text.",
  "answer": "towel"
}
Note: The answer MUST be a single word, exact, lowercase noun. Keep the riddles very simple, common, and easy.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Lumixora"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a cognitive verification challenge for: ${userName}` }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) {
      console.warn(`API call returned non-200 status (${response.status}), proceeding to fallback...`);
    }

    const data = await response.json();
    let textResponse = data.choices[0].message.content;
    textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      textResponse = textResponse.substring(jsonStart, jsonEnd + 1);
    }
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Error generating cognitive challenge:", error);
    // Return a default fallback puzzle if API fails
    return {
      puzzle: "What has keys but can't open locks, has space but no room, and you can enter but not go inside?",
      answer: "keyboard"
    };
  }
}

export async function verifyCognitiveAnswer(puzzle, userAnswer) {
  try {
    const apiKey = getOpenRouterApiKey();

    const systemPrompt = `You are a high-security validator. Review the user's answer to the provided riddle/challenge.
Determine if the user's answer is logically correct, semantically equivalent, or a valid solution to the puzzle.

You must output ONLY a valid JSON object. Do not include markdown code blocks or backticks.
Format:
{
  "isCorrect": true
}
or
{
  "isCorrect": false
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Lumixora"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Puzzle: "${puzzle}"\nUser's Answer: "${userAnswer}"` }
        ],
        temperature: 0.1
      })
    });

    const data = await response.json();
    const textResponse = (data.choices[0].message.content || '').toLowerCase();
    
    // 1. Try to parse JSON first (most reliable)
    try {
      let cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonStart = cleanJson.indexOf('{');
      const jsonEnd = cleanJson.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
      }
      const parsed = JSON.parse(cleanJson);
      return parsed.isCorrect === true || parsed.iscorrect === true;
    } catch (e) {
      console.warn("JSON parsing failed, falling back to text analysis:", e);
    }

    // 2. Fallback: Check explicit JSON format substring keys
    if (textResponse.includes('"iscorrect": true') || 
        textResponse.includes('"iscorrect":true') ||
        textResponse.includes('iscorrect: true') ||
        textResponse.includes('iscorrect:true')) {
      return true;
    }
    
    if (textResponse.includes('"iscorrect": false') || 
        textResponse.includes('"iscorrect":false') ||
        textResponse.includes('iscorrect: false') ||
        textResponse.includes('iscorrect:false')) {
      return false;
    }

    // 3. Whole-word semantic check to prevent substring collisions like 'correct' matching inside 'iscorrect'
    const words = textResponse.split(/\s+/);
    const hasYes = words.includes('yes') || words.includes('correct') || words.includes('valid') || words.includes('true');
    const hasNo = words.includes('no') || words.includes('incorrect') || words.includes('invalid') || words.includes('false') || textResponse.includes('not correct');
    
    if (hasYes && !hasNo) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error verifying cognitive answer:", error);
    return false;
  }
}

export async function generateMentorChatResponse(messages, liveData, complexityLevel = 'Intermediate') {
  try {
    const apiKey = getOpenRouterApiKey();

    const {
      profile,
      studyGoals,
      timetable,
      targetExamDate,
      analytics,
      studySessions,
      codingSubmissions,
      quizScores,
      attendance,
      syllabusProgress,
      syllabusDetails,
      calendarEvents,
      pyqs,
      collegeAnnouncements,
      placements,
      internships,
      scholarships,
      metrics
    } = liveData;

    // Format structured data strings for the AI context
    const studentProfileStr = `
* STUDENT PROFILE:
- Name: ${profile.name || 'Scholar'}
- College: ${profile.college || 'G. Pulla Reddy Engineering College'} (${profile.university || 'JNTUA'})
- Department & Year: ${profile.department || 'Computer Science'} - ${profile.year || '3rd Year'}
- Learning Style Preference: ${profile.learningStyle || 'Practical'}
- Daily Study Target: ${profile.dailyHours || '4'} hours
- Target CGPA: ${profile.targetCGPA || '9.0'}
- Career Goal: ${profile.careerGoal || 'Placement'}
- Preferred Study Time: ${profile.preferredTime || 'Night Owl'}
- Strong Subjects: ${profile.strongSubjects || 'None'}
- Weak Subjects (Need Extra Focus): ${profile.weakSubjects || 'None'}
`;

    const metricsStr = `
* REAL-TIME ACADEMIC TELEMETRY:
- Live Attendance Average: ${metrics.avgAttendanceRate}% (Minimum required: 75%)
- Syllabus Coverage Progress: ${metrics.avgSyllabusProgress}% complete
- Estimated Exam Readiness: ${metrics.compositeReadiness}% (calculated from syllabus coverage, quiz performance, and paper solutions)
- Cumulative Study Hours (this week): ${analytics.totalMinutes ? Math.round(analytics.totalMinutes / 60) : 0} hours
- Average Focus Score: ${analytics.avgFocusScore || 75}/100
- Average Quiz/Test Score: ${metrics.avgQuizScore}%
- Solved Previous Year Exam Papers: ${metrics.papersSolvedCount} papers
- doubts: ${liveData.resolvedDoubtsCount} resolved out of ${liveData.doubtsCount} submitted
- Pending schedule tasks: ${liveData.totalTasksCount - liveData.totalCompletedTasks} out of ${liveData.totalTasksCount} total
`;

    const timetableStr = `
* TODAY'S COURSE TIMETABLE SCHEDULE:
${timetable.length > 0 
  ? timetable.map(t => `- [${t.time}] ${t.subject} (${t.type}, duration: ${t.duration})`).join('\n')
  : '- No classes are scheduled for today.'
}
`;

    const goalsStr = `
* TODAY'S TARGET STUDY GOALS:
${studyGoals.length > 0
  ? studyGoals.map(g => `- [${g.completed ? 'COMPLETED' : 'PENDING'}] ${g.text} (${g.subject})`).join('\n')
  : '- No study goals set for today.'
}
`;

    const attendanceDetailsStr = `
* SUBJECT-WISE ATTENDANCE LIST:
${Object.entries(attendance).map(([sub, val]) => `- ${sub}: ${val.attended}/${val.total} classes attended (${Math.round((val.attended / val.total) * 100)}%)`).join('\n')}
`;

    const syllabusDetailsStr = `
* SYLLABUS & CHAPTERS MASTERED PER SUBJECT:
${Object.entries(syllabusProgress).map(([sub, units]) => {
  const compUnits = Object.entries(units).filter(([_, comp]) => comp).map(([u, _]) => u);
  const totalUnits = Object.keys(units);
  const detailList = syllabusDetails[sub] || [];
  
  return `- ${sub}: Mastered ${compUnits.length}/${totalUnits.length} Units.
    * Completed Units: ${compUnits.join(', ') || 'None'}
    * Core Chapter Outline:
${detailList.map(u => `      - ${u.unit} (${u.name}): ${u.topics}`).join('\n')}`;
}).join('\n')}
`;

    const deadlinesStr = `
* UPCOMING CALENDAR EVENTS & TARGET EXAM DEADLINES:
${calendarEvents.length > 0
  ? calendarEvents.map(e => `- [${e.date}] [${e.category}] ${e.title}`).join('\n')
  : '- No upcoming academic events or deadlines.'
}
`;

    const listingsStr = `
* LIVE CAREER LISTINGS & BULLETIN BOARD:
- College Announcements:
${collegeAnnouncements.slice(0, 3).map(a => `  - [${a.date}] ${a.title}: ${a.content}`).join('\n')}
- Placement Opportunities:
${placements.slice(0, 2).map(p => `  - ${p.company} for "${p.role}", CTC: ${p.ctc}, Deadline: ${p.deadline}, Eligibility: ${p.eligibility}`).join('\n')}
- Internship Openings:
${internships.slice(0, 2).map(i => `  - ${i.company} for "${i.role}", Stipend: ${i.stipend}, Deadline: ${i.deadline}`).join('\n')}
- Scholarship Updates:
${scholarships.slice(0, 2).map(s => `  - ${s.name}, Grant: ${s.grant}, Deadline: ${s.deadline}, Eligibility: ${s.eligibility}`).join('\n')}
`;

    const pyqStr = `
* PREVIOUS YEAR QUESTIONS (PYQ) SAMPLES:
${Object.entries(pyqs).map(([sub, qList]) => {
  return `Subject: ${sub}\n${qList.slice(0, 3).map(q => `  - [${q.year}] ${q.question} (${q.marks} Marks)`).join('\n')}`;
}).join('\n\n')}
`;

    const systemPrompt = `You are Lumixora's wise, highly supportive, and expert Real-Time AI Personal Mentor.
Your role is to act as a dedicated personal coach for the student, whose profile and live data snapshot are given below.

IMPORTANT: You are connected to live databases. You MUST read this fresh information before every response and use it to personalize your coaching. Do NOT rely only on generic pre-trained knowledge. If the student asks about their performance, schedule, progress, deadlines, or career listings, analyze these statistics in real time and reference them explicitly in your answers.

=========================================
CURRENT LIVE STUDENT TELEMETRY SNAPSHOT
=========================================
${studentProfileStr}
${metricsStr}
${timetableStr}
${goalsStr}
${attendanceDetailsStr}
${syllabusDetailsStr}
${deadlinesStr}
${listingsStr}
${pyqStr}
=========================================

REAL-TIME BEHAVIOURAL COACHING DIRECTIVES:
1. When asked "What should I study today?" or similar:
   - Check today's timetable classes and goals.
   - Look at upcoming exams and deadlines in the next 30 days.
   - Check their weak subjects (${profile.weakSubjects || 'None'}) and incomplete syllabus chapters.
   - Propose a personalized, hour-by-hour study agenda for today, prioritizing incomplete units of weak subjects.
2. When asked "How am I doing?" or similar:
   - Highlight their overall attendance rate (warn if any subject is below 75%).
   - Summarize average quiz scores, syllabus coverage, and consistency streak.
   - Compare study hours this week with their target study hours.
   - Report their composite Exam Readiness score and estimated CGPA.
   - Provide actionable study tips (e.g. focus strategies, revision tips) to help them improve.
3. If they ask about PYQs, search the PYQ database above for matching questions and explain the concepts step-by-step.
4. If they ask about placement, internship, or scholarship opportunities, look up the active listings above, check their eligibility (matching CGPA target vs eligibility, department) in real-time, and recommend concrete application advice.
5. Explain concepts at the requested complexity level: **${complexityLevel}**.
   - Beginner: Use everyday analogies, extremely simple terms, and step-by-step guides.
   - Intermediate: Explain standard academic principles, formulas, and practical use cases.
   - Advanced: Focus on deeper technical implementation, mathematical derivations, optimizations, and research.
6. Keep in mind their learning style (${profile.learningStyle}) and career goals (${profile.careerGoal}) to make explanations contextually relevant.
7. Be encouraging, keep them accountable, and check if they understood the explanation by asking a short, engaging follow-up question.
8. Output your response directly in clean Markdown format with bold text, bullet points, and tables where appropriate. Keep it structured, highly readable, and professional.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Lumixora"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.warn(`API call returned non-200 status (${response.status}), proceeding to fallback...`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in generateMentorChatResponse:", error);
    return `Hi, I had some trouble connecting to my cognitive matrix. However, remember that focus and repetition are key to mastering your goals! ${error.message}`;
  }
}

export async function generateQuizFromTopic(topic, subject) {
  try {
    const apiKey = getOpenRouterApiKey();

    const systemPrompt = `You are an academic test generator. Generate a multiple choice quiz on the topic "${topic}" under the subject "${subject}".
You must return ONLY a valid JSON object. Do not include markdown code blocks or backticks.
Format:
{
  "questions": [
    {
      "q": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Brief explanation of why Option A is correct."
    }
  ]
}
Note: Generate exactly 3 highly relevant and interesting questions. The "correct" value must be the 0-indexed number corresponding to the correct answer in the options array.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Lumixora"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate 3 multiple choice questions about "${topic}" in the subject "${subject}".` }
        ],
        temperature: 0.5
      })
    });

    if (!response.ok) {
      console.warn(`API call returned non-200 status (${response.status}), proceeding to fallback...`);
    }

    const data = await response.json();
    let textResponse = data.choices[0].message.content;
    textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      textResponse = textResponse.substring(jsonStart, jsonEnd + 1);
    }
    
    const parsed = JSON.parse(textResponse);
    const questions = parsed.questions || parsed.quiz || parsed.test;
    if (!Array.isArray(questions)) {
      throw new Error("Invalid quiz structure: questions list is missing or not an array");
    }

    // Normalize keys
    const normalizedQuestions = questions.map(q => {
      return {
        q: q.q || q.question || q.text || "Question Details",
        options: Array.isArray(q.options) ? q.options : (Array.isArray(q.choices) ? q.choices : ["A", "B", "C", "D"]),
        correct: typeof q.correct === 'number' ? q.correct : 0,
        explanation: q.explanation || q.reason || "No explanation provided."
      };
    });

    return { questions: normalizedQuestions.slice(0, 5) };
  } catch (error) {
    console.error("Error generating quiz:", error);
    return {
      questions: [
        {
          q: `What is the core concept of ${topic || 'this topic'}?`,
          options: ["Theoretical foundations", "Practical applications", "Syllabus details", "All of the above"],
          correct: 3,
          explanation: "In general academic context, mastering a subject involves theoretical foundation, practice, and details."
        }
      ]
    };
  }
}

export async function generateFlashcardsFromTopic(topic, subject) {
  try {
    const apiKey = getOpenRouterApiKey();

    const systemPrompt = `You are an academic flashcard generator. Generate a set of flashcards containing key terms and definitions for the topic "${topic}" under the subject "${subject}".
You must return ONLY a valid JSON object. Do not include markdown code blocks or backticks.
Format:
{
  "flashcards": [
    {
       front: "Term or Question",
       back: "Short explanation or definition (1-2 sentences)"
    }
  ]
}
Note: Generate exactly 4 useful flashcards.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Lumixora"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate 4 flashcards about "${topic}" in the subject "${subject}".` }
        ],
        temperature: 0.6
      })
    });

    if (!response.ok) {
      console.warn(`API call returned non-200 status (${response.status}), proceeding to fallback...`);
    }

    const data = await response.json();
    let textResponse = data.choices[0].message.content;
    textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      textResponse = textResponse.substring(jsonStart, jsonEnd + 1);
    }
    
    const parsed = JSON.parse(textResponse);
    const flashcards = parsed.flashcards || parsed.cards;
    if (!Array.isArray(flashcards)) {
      throw new Error("Invalid flashcard structure from AI");
    }

    const normalizedCards = flashcards.map(c => {
      return {
        front: c.front || c.term || c.question || "Term",
        back: c.back || c.definition || c.answer || "Definition not provided."
      };
    });

    return { flashcards: normalizedCards };
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return {
      flashcards: [
        { front: `Core Term in ${topic || 'this topic'}`, back: "The central concept that defines the primary behavior or utility of the system." },
        { front: "Key Objective", back: "To simplify explanation, organize logic, and increase understanding of complex topics." }
      ]
    };
  }
}

export async function generatePlacementRoadmap(profile) {
  try {
    const apiKey = getOpenRouterApiKey();

    const systemPrompt = `You are a professional career guidance AI. Generate a customized step-by-step preparation roadmap based on this student profile:
- Department: ${profile.department || 'Computer Science'}
- Career Goal: ${profile.careerGoal || 'Placement'}
- Learning Style: ${profile.learningStyle || 'Visual'}
- Target CGPA: ${profile.targetCGPA || '8.5'}

You must return ONLY a valid JSON object. Do not include markdown code blocks or backticks.
Format:
{
  "milestones": [
    {
      "phase": "Phase 1: Foundation (Month 1-2)",
      "tasks": [
        "Task description 1",
        "Task description 2"
      ],
      "resource": "Recommended resources (e.g. video guides, coding platforms)"
    }
  ]
}
Note: Generate exactly 4 sequential phases.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Lumixora"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a career preparation roadmap for a ${profile.year || '3rd year'} student in ${profile.department || 'CSE'} pursuing ${profile.careerGoal || 'placement'}.` }
        ],
        temperature: 0.6
      })
    });

    if (!response.ok) {
      console.warn(`API call returned non-200 status (${response.status}), proceeding to fallback...`);
    }

    const data = await response.json();
    let textResponse = data.choices[0].message.content;
    textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      textResponse = textResponse.substring(jsonStart, jsonEnd + 1);
    }
    
    const parsed = JSON.parse(textResponse);
    const milestones = parsed.milestones || parsed.phases || [];
    const normalizedMilestones = milestones.map(m => ({
      phase: m.phase || m.title || "Phase Outline",
      tasks: Array.isArray(m.tasks) ? m.tasks : ["Complete study guidelines"],
      resource: m.resource || "Standard textbooks."
    }));
    return { milestones: normalizedMilestones };
  } catch (error) {
    console.error("Error generating placement roadmap:", error);
    return { milestones: [] };
  }
}

export async function generateLifeStory(stats) {
  try {
    const systemPrompt = `You are an expert AI narrator crafting an inspiring graduation story for a student's Life Replay. Return a JSON object with: { "title": "Title", "semesters": "Summary", "achievements": "Key achievements", "challenges": "Key challenges", "skills": "Key skills", "summary": "Final summary" }`;

    const textResponse = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Student Stats: ${JSON.stringify(stats)}` }
      ],
      temperature: 0.6
    });

    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const cleanJson = textResponse.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(cleanJson);
    }
    
    return {
      title: 'A Journey of Grit and Determination',
      semesters: 'Successfully completed the semesters maintaining consistent study habits.',
      achievements: `Completed ${stats?.tasksCount || 0} tasks and uploaded ${stats?.notesCount || 0} notes.`,
      challenges: 'Overcoming technical blockers and balancing high credits.',
      skills: 'Consistency, Analytical Debugging, Time Management.',
      summary: 'An outstanding progression showing robust technical skillset and high placement readiness.'
    };
  } catch (error) {
    console.error("Error generating life story:", error);
    return {
      title: 'A Journey of Grit and Determination',
      semesters: 'Successfully completed the semesters maintaining consistent study habits.',
      achievements: `Completed ${stats?.tasksCount || 0} tasks and uploaded ${stats?.notesCount || 0} notes.`,
      challenges: 'Overcoming technical blockers and balancing high credits.',
      skills: 'Consistency, Analytical Debugging, Time Management.',
      summary: 'An outstanding progression showing robust technical skillset and high placement readiness.'
    };
  }
}

export async function generateTwinResponse(messages, twinData, complexityLevel = 'Intermediate') {
  try {
    const studentSummary = `
STUDENT INTEL SUMMARY:
- Name: ${twinData?.profile?.name || 'Scholar'}
- College: ${twinData?.profile?.college || 'GPREC'}
- Department: ${twinData?.profile?.department || 'CSE'}
- Career Goal: ${twinData?.profile?.careerGoal || 'Placement'}
- Learning Style: ${twinData?.profile?.learningStyle || 'Practical'}
- Current Synergy Score: ${twinData?.metrics?.synergyScore || 85}%
- Completed Tasks: ${twinData?.tasksStats?.completed || 0}/${twinData?.tasksStats?.total || 0}
`;

    const systemPrompt = `You are the Lumixora AI Academic Twin™, an advanced real-time study coach and academic mentor representing the cognitive double of the student.
${studentSummary}

Guidelines:
1. Speak in a warm, direct, and mentoring voice.
2. Explain concepts at the requested complexity level: **${complexityLevel}**.
3. Offer to generate a customized quiz, flashcards, or a revision roadmap if they are struggling with a concept.
4. Conclude with a short motivating checkpoint question.
5. Return clean Markdown structure without long fluff.`;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const reply = await callAICompletion({
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 1000
    });

    return reply;
  } catch (error) {
    console.error("Error generating twin response:", error);
    return `Hi! I am your AI Twin. Looking at your profile, your momentum is strong! What concept or problem set shall we solve together now?`;
  }
}

export async function generateLearningHubNotes(unitName, topics) {
  try {
    const systemPrompt = "You are a world-class University Professor and AI Academic Architect. Your task is to generate an ULTRA-ADVANCED, EXHAUSTIVE, textbook-level chapter in RAW HTML for the specific topic provided. CRITICAL LENGTH REQUIREMENT: Generate a detailed, high-quality chapter. Expand on EVERY concept with clear explanations, mathematical formulations, derivations, step-by-step algorithms, and examples. CRITICAL HTML FORMATTING: Output RAW HTML ONLY. Use semantic HTML (<h2>, <h3>, <p>, <ul>). Use <div class=\"topic-box\"> for separating major concepts, and <div class=\"example-box\"> for examples, and <div class=\"qa-box\"> for Q&A section. Do NOT wrap your response in markdown code blocks. Start directly with HTML tags. CRITICAL VISUALS: Generate multiple Mermaid diagrams (graph TD). Wrap all Mermaid code strictly inside <pre class=\"mermaid\">...</pre>.";

    const userPrompt = "Unit Name: " + unitName + "\nTopics to cover: " + topics + "\nPlease generate the ultimate textbook-level HTML study guide for these topics.";

    const htmlOutput = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      maxTokens: 4000
    });

    let cleanHTML = htmlOutput.trim();

    if (!cleanHTML.includes('<div class="topic-box">')) {
      cleanHTML = '<div class="topic-box"><h1>' + unitName.toUpperCase() + '</h1><p><strong>Topics:</strong> ' + topics + '</p></div>\n' + cleanHTML;
    }

    return cleanHTML;
  } catch (error) {
    console.error("Error generating learning hub notes:", error);
    return '<div class="topic-box"><h2>' + unitName + ' - Chapter Notes</h2><p><strong>Topics:</strong> ' + topics + '</p><div class="example-box"><p><strong>Core Concepts:</strong></p><ul><li>Fundamental Principles of ' + unitName + '</li><li>System Architecture and Implementation</li><li>Practice Problems & Solutions</li></ul></div></div>';
  }
}

export async function generateTestQuestions(topic, count = 5, type = 'both', difficulty = 'Medium') {
  try {
    const isCodeOnly = type === 'code';
    const isMcqOnly = type === 'mcq';

    const diffInstruction = difficulty === 'Mixed' 
      ? 'Include a balanced blend of Easy, Medium, and Hard questions.' 
      : `All questions must be at ${difficulty} difficulty.`;

    const typeInstruction = isCodeOnly
      ? 'Generate ONLY hands-on coding challenges (type: "code").'
      : isMcqOnly
      ? 'Generate ONLY multiple choice questions (type: "mcq").'
      : 'Generate a mix of multiple choice questions (type: "mcq") and hands-on coding challenges (type: "code").';

    const systemPrompt = `You are a world-class Computer Science and Aptitude Professor. 
Generate exactly ${count} test questions about "${topic}".
${diffInstruction}
${typeInstruction}

Return ONLY a valid raw JSON object matching this schema:
{
  "questions": [
    {
      "type": "mcq",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why Option A is correct."
    },
    {
      "type": "code",
      "question": "Coding challenge problem statement...",
      "language": "python",
      "initialCode": "def solve():\\n    # Write code here\\n    pass",
      "expectedOutput": "Expected output"
    }
  ]
}

For "mcq" items: "correct" must be 0-indexed integer (0, 1, 2, or 3), and "options" must be an array of 4 distinct strings.
For "code" items: provide clear instructions in "question", clean starter code template in "initialCode", valid language in "language" (python, java, or javascript), and expected output in "expectedOutput".
Do NOT use markdown code blocks (\`\`\`json). Output raw valid JSON.`;

    let reply = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${count} ${difficulty} level test questions for topic: ${topic} with type filter: ${type}` }
      ],
      temperature: 0.5,
      maxTokens: 3000
    });

    if (reply) {
      let cleanJson = reply.trim();
      const jsonStart = cleanJson.indexOf('{');
      const jsonEnd = cleanJson.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
      }
      try {
        const parsed = JSON.parse(cleanJson);
        const questionsList = parsed.questions || parsed.test || [];
        if (Array.isArray(questionsList) && questionsList.length > 0) {
          return questionsList.map((q, idx) => {
            const qType = (q.type === 'code' || (isCodeOnly && q.type !== 'mcq')) ? 'code' : 'mcq';
            if (qType === 'code') {
              return {
                id: `ai-code-${Date.now()}-${idx}`,
                type: 'code',
                question: q.question || `Write a program to solve ${topic} problem.`,
                language: q.language || 'python',
                initialCode: q.initialCode || `# Solution for ${topic}\ndef solve():\n    # Write your solution here\n    pass\n\nsolve()`,
                expectedOutput: q.expectedOutput || 'Success'
              };
            } else {
              const opts = Array.isArray(q.options) && q.options.length >= 2 
                ? q.options.slice(0, 4) 
                : ['Option A', 'Option B', 'Option C', 'Option D'];
              return {
                id: `ai-mcq-${Date.now()}-${idx}`,
                type: 'mcq',
                question: q.question || `What is a key concept of ${topic}?`,
                options: opts,
                correct: typeof q.correct === 'number' && q.correct < opts.length ? q.correct : 0,
                explanation: q.explanation || 'Verified correct answer.'
              };
            }
          });
        }
      } catch (pErr) {
        console.warn("AI response JSON parse notice:", pErr);
      }
    }

    // High Quality Dynamic Fallback if AI API times out or is unreachable
    const fallbacks = [];
    for (let i = 0; i < count; i++) {
      const isCode = isCodeOnly || (type === 'both' && i % 2 === 1);
      if (isCode) {
        fallbacks.push({
          id: `fallback-code-${Date.now()}-${i}`,
          type: 'code',
          question: `Implement a program to solve ${topic} (Problem ${i + 1}). Demonstrate correct logic handling and print the result.`,
          language: 'python',
          initialCode: `# Python solution for ${topic}\ndef solve_${i + 1}():\n    # Write your code here\n    print("Output for ${topic}")\n\nsolve_${i + 1}()`,
          expectedOutput: `Output for ${topic}`
        });
      } else {
        fallbacks.push({
          id: `fallback-mcq-${Date.now()}-${i}`,
          type: 'mcq',
          question: `Which statement is correct regarding ${topic} (Concept ${i + 1})?`,
          options: [
            `Standard implementation strategy for ${topic}`,
            `Secondary fallback protocol`,
            `Deprecated legacy function`,
            `None of the above`
          ],
          correct: 0,
          explanation: `Option A provides the standard implementation strategy for ${topic}.`
        });
      }
    }
    return fallbacks;
  } catch (error) {
    console.error("Error generating test questions:", error);
    return [
      {
        id: `err-${Date.now()}`,
        type: 'mcq',
        question: `What is the primary function of ${topic}?`,
        options: ['Core Functionality', 'Auxiliary Process', 'Optional Parameter', 'Legacy Artifact'],
        correct: 0,
        explanation: 'Core functionality represents the primary purpose.'
      }
    ];
  }
}

export async function summarizeChatMessages(messagesText) {
  try {
    const systemPrompt = "You are an AI assistant analyzing a class chat room. Provide a concise summary and key points in JSON: { \"summary\": \"Summary text\", \"keyPoints\": [\"Point 1\", \"Point 2\"] }";

    const reply = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: messagesText }
      ],
      temperature: 0.5
    });

    let cleanJson = reply.trim();
    const jsonStart = cleanJson.indexOf('{');
    const jsonEnd = cleanJson.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
    }
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error summarizing chat messages:", error);
    return {
      summary: "Class discussion covering recent study topics and announcements.",
      keyPoints: ["Active participation in class topics", "Shared learning resources"]
    };
  }
}
