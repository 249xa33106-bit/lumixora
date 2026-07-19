export async function generateNoteEnhancement(textContent) {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

    const systemPrompt = `You are an expert AI tutor. Analyze the study material and provide a detailed summary, core academic concepts, and a few practice questions.

You must output ONLY a valid JSON object. Do not include markdown code blocks or backticks.
Format:
{
  "summary": "Detailed summary text",
  "concepts": ["Concept 1", "Concept 2", "Concept 3"],
  "questions": [
    { "q": "Question 1", "a": "Answer 1" }
  ]
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Study Material:\n${textContent}` }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error Details:", errorData);
      const errorMsg = errorData.error?.message || errorData.error || errorData.message || JSON.stringify(errorData);
      throw new Error(`Groq API Error (${response.status}): ${errorMsg}`);
    }

    const data = await response.json();
    let textResponse = data.choices[0].message.content;
    
    // Clean up potential markdown formatting that Llama might add
    textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Attempt to extract just the JSON object if it added preamble text
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      textResponse = textResponse.substring(jsonStart, jsonEnd + 1);
    }
    
    if (!textResponse || textResponse.trim() === '') {
      throw new Error("The AI returned an empty response. If you uploaded a PDF, Word, or Excel file, the AI might not be able to read its binary format. Try uploading a plain text (.txt, .md, .csv) file instead.");
    }
    
    // Parse the JSON returned by Llama 3
    try {
      const parsedData = JSON.parse(textResponse);
      return parsedData;
    } catch (parseError) {
      throw new Error(`JSON Error: ${parseError.message}. Raw output: ${textResponse}`);
    }

  } catch (error) {
    console.error("Error generating AI enhancement:", error);
    throw new Error(`Failed to generate AI enhancement: ${error.message}`);
  }
}

export async function generateDoubtResolution(questionOrContext, subject, isContext = false) {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

    const systemPrompt = `You are an expert AI academic tutor helping a student with a ${subject} question.
If the student asks a conceptual question or asks for a summary/definition, explain it clearly and intuitively.
If the student asks an equation/math problem, solve it step-by-step.
Do not use generic boilerplate text. Be direct, helpful, and concise.`;

    let messages = [{ role: "system", content: systemPrompt }];
    if (isContext && Array.isArray(questionOrContext)) {
      messages = messages.concat(questionOrContext);
    } else {
      messages.push({ role: "user", content: questionOrContext });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error Details:", errorData);
      const errorMsg = errorData.error?.message || errorData.error || errorData.message || JSON.stringify(errorData);
      throw new Error(`Groq API Error (${response.status}): ${errorMsg}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error generating doubt resolution:", error);
    return `Error: ${error.message}`;
  }
}

export async function generateCognitiveChallenge(userName) {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a cognitive verification challenge for: ${userName}` }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error (${response.status})`);
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
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
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
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

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
- Focus Consistency Streak: ${metrics.streak} consecutive days active
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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error (${response.status})`);
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
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate 3 multiple choice questions about "${topic}" in the subject "${subject}".` }
        ],
        temperature: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error (${response.status})`);
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
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate 4 flashcards about "${topic}" in the subject "${subject}".` }
        ],
        temperature: 0.6
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error (${response.status})`);
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
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a career preparation roadmap for a ${profile.year || '3rd year'} student in ${profile.department || 'CSE'} pursuing ${profile.careerGoal || 'placement'}.` }
        ],
        temperature: 0.6
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error (${response.status})`);
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
    const milestones = parsed.milestones || parsed.phases;
    if (!Array.isArray(milestones)) {
      throw new Error("Invalid milestones structure from AI");
    }

    const normalizedMilestones = milestones.map(m => {
      return {
        phase: m.phase || m.title || "Phase Outline",
        tasks: Array.isArray(m.tasks) ? m.tasks : ["Complete study guidelines", "Work on problem sets"],
        resource: m.resource || m.resources || "Standard department textbooks."
      };
    });

    return { milestones: normalizedMilestones };
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return {
      milestones: [
        {
          phase: "Phase 1: Foundations",
          tasks: ["Revise core department subjects daily", "Practice coding and problem solving 1 hr/day"],
          resource: "GeeksforGeeks, LeetCode, or standard department textbooks."
        }
      ]
    };
  }
}

export async function generateTwinResponse(messages, twinData, complexityLevel = 'Intermediate') {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

    const studentSummary = `
STUDENT INTEL SUMMARY:
- Name: ${twinData.profile.name || 'Student'}
- College: ${twinData.profile.college}
- Department: ${twinData.profile.department}
- Career Goal: ${twinData.profile.careerGoal} (Target CGPA: ${twinData.profile.targetCGPA})
- Learning Style: ${twinData.profile.learningStyle}
- Current Synergy Score (Academic Momentum): ${twinData.metrics.synergyScore}%
- Productivity Score: ${twinData.metrics.productivityScore}%
- Consistency Rating: ${twinData.metrics.consistencyScore}%
- Avg Focus Rating: ${twinData.metrics.focusScore}/100
- Study Streak: ${twinData.studyAnalytics.currentStreak} Days
- Completed Tasks Rate: ${twinData.tasksStats.completed}/${twinData.tasksStats.total} (${twinData.tasksStats.completionRate}%)
- Weak Subjects: ${twinData.profile.weakSubjects}
- Strong Subjects: ${twinData.profile.strongSubjects}
`;

    const systemPrompt = `You are the Lumixora AI Academic Twin™, an advanced real-time study coach and academic mentor representing the cognitive double of the student.
Instead of giving generic answers, you adapt your personality and answers directly using the student's real-time academic intelligence:
${studentSummary}

Guidelines:
1. Speak in a warm, direct, and mentoring voice (address the student as a coach would).
2. Proactively note anomalies in their stats if appropriate (e.g. if they have low task completion, encourage them; if they have a good streak, praise them; if they ask about their weak subject, provide extra guidance).
3. Explain concepts at the requested complexity level: **${complexityLevel}**.
   - Beginner: Use everyday analogies, extremely simple terms, and step-by-step guides.
   - Intermediate: Explain academic principles, formulas, and practical use cases.
   - Advanced: Focus on deeper technical implementation, mathematical derivations, optimizations, and research.
4. Frame explanations using their Learning Style: **${twinData.profile.learningStyle}**.
5. Offer to generate a customized quiz, flashcards, or a revision roadmap if they are struggling with a concept.
6. Conclude your messages with a short, motivating checkpoint question to make sure they are following.
7. Return clean Markdown structure, avoiding code blocks or long fluff. Keep answers concise.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error (${response.status})`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating twin response:", error);
    return `Hi! My cognitive link is running on backup cells right now. However, looking at your profile, your Synergy score is sitting at ${twinData.metrics.synergyScore}%. Let's get to work! What concept should we review?`;
  }
}
