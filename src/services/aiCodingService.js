// AI Coding Assistant Services for Lumixora Code Arena
// Migrated completely to Groq API (openai/gpt-oss-120b)

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function fetchGroq(systemPrompt, userPrompt, temperature = 0.7, jsonMode = false) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) { console.warn("API Key omitted, using deterministic code service..."); return "Code helper offline. Check API settings."; }

  const requestBody = {
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: temperature
  };

  if (jsonMode) {
    requestBody.response_format = { type: "json_object" };
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const text = await response.text();
    console.warn(`API call status ${response.status}: ${text}, returning default code assistant output...`); return "Code assistant standby.";
  }

  const data = await response.json();
  let text = data.choices[0].message.content;
  return text;
}

function parseJsonFromText(text) {
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    return text.substring(jsonStart, jsonEnd + 1);
  }
  return text;
}

/**
 * Triggered manually by user (Explain, Optimize, Trace, Hint)
 */
export async function getAICodingAssistantHelp(actionType, problem, code, language) {
  try {
    let systemPrompt = "You are an expert AI pair programmer.";
    let userPrompt = `Challenge Problem: "${problem.title}"\nProblem Statement:\n${problem.statement}\n\nSelected Language: ${language}\nCurrent Code Draft:\n${code}\n\n`;
    
    if (actionType === 'explain') {
      systemPrompt = "You are a patient computer science tutor.";
      userPrompt += `Explain what this code is doing step-by-step. Break down the logic simply. If the code is incomplete or empty, explain the general approach to solve this problem instead.`;
    } else if (actionType === 'dry-run') {
      systemPrompt = "You are a deterministic code tracer.";
      userPrompt += `Perform a dry-run trace of this code using the first example test case. Show the values of the variables at each step of the loop. Format clearly in markdown.`;
    } else if (actionType === 'hint') {
      systemPrompt = "You are an encouraging mentor.";
      userPrompt += `Provide a subtle hint to help me progress or fix my logic. DO NOT give me the full code or the direct answer. Just point me in the right direction.`;
    } else if (actionType === 'optimize') {
      systemPrompt = "You are a senior staff software engineer.";
      userPrompt += `Analyze the time and space complexity of this code. Suggest a better, more optimal algorithm (e.g. showing how to reduce it to O(N log N) or O(N)), explaining the trade-offs. Do not write the full code, just explain the approach in Markdown.`;
    }

    return await fetchGroq(systemPrompt, userPrompt, 0.7);
  } catch (err) {
    console.error("AI Assistant error:", err);
    return `### AI Assistant Unavailable\n\nFailed to load feedback from AI Copilot: ${err.message}`;
  }
}

/**
 * Post-Submission Quality feedback (Runs immediately after code submission)
 */
export async function getPostSubmissionFeedback(problem, code, language, status, runtime, memory) {
  try {
    const systemPrompt = `You are a code review auditor. Review the user's final submission for the coding problem "${problem.title}".
Submission Status: ${status}
Recorded Execution Time: ${runtime}
Recorded Memory Footprint: ${memory}

Analyze their code and provide a structured JSON response.

You must output ONLY a valid JSON object. Do not include markdown code blocks or backticks.
JSON Schema:
{
  "timeComplexity": "O(N) (or whatever the estimated time complexity is)",
  "spaceComplexity": "O(N) (or whatever the estimated space complexity is)",
  "qualityScore": 85,
  "readabilityScore": 90,
  "correctnessAnalysis": "A short summary explaining if the code handles all edge cases, duplicates, nulls, and boundary conditions.",
  "suggestions": [
    "Suggestion 1: e.g. Rename single-character variables to be more descriptive.",
    "Suggestion 2: e.g. Pre-size the hash map capacity to avoid rehashing overhead."
  ],
  "betterAlgorithms": "If applicable, suggest a faster or more memory-efficient algorithm. If their code is already optimal, praise it.",
  "learningTip": "A customized tip on what coding patterns/data-structures they should review based on this solve."
}`;

    const userPrompt = `Code submitted in ${language}:\n${code}`;
    const text = await fetchGroq(systemPrompt, userPrompt, 0.1, true);
    const jsonStr = parseJsonFromText(text);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("AI review helper error:", err);
    return {
      timeComplexity: "Unknown",
      spaceComplexity: "Unknown",
      qualityScore: 70,
      readabilityScore: 75,
      correctnessAnalysis: "Could not evaluate correctness automatically due to API timeout.",
      suggestions: ["Ensure you are avoiding deep nested loops.", "Use variable names that match standard coding styles."],
      betterAlgorithms: "AI system is offline, review optimal complexity in the Editorial tab.",
      learningTip: "Focus on writing clean solutions and reviewing standard test cases."
    };
  }
}

/**
 * AI-powered problem generation from uploaded code content
 */
export async function generateProblemFromCode(codeContent, fileName) {
  try {
    const systemPrompt = `You are an expert curriculum developer and technical interviewer.
Analyze the provided code file and extract/generate a complete LeetCode-style coding question out of it.
Generate appropriate test cases (both public and hidden), input/output descriptions, examples, editorial, and starter templates.

Note for testCases and hiddenTestCases format:
- The "input" string MUST contain each argument/parameter on a separate line (separated by newline \\n). For example, if a function takes an array and an integer, the input should be: "[2,7,11,15]\\n9". All arrays and objects in the input/output must be valid JSON strings so they can be parsed by JSON.parse.
- The "output" must be the JSON string representation of the expected return value, e.g. "[0,1]" or "true" or "49".

You must output ONLY a valid JSON object. Do not include markdown code blocks or backticks.
Format:
{
  "title": "Problem Title",
  "difficulty": "Easy" | "Medium" | "Hard",
  "category": "Arrays" | "Strings" | "Linked Lists" | "Stacks" | "Queues" | "Trees" | "Graphs" | "Dynamic Programming" | "Greedy" | "Recursion" | "Backtracking" | "Sliding Window" | "Two Pointers" | "Binary Search" | "Heaps",
  "statement": "Detailed problem description.",
  "inputFormat": "Description of the inputs.",
  "outputFormat": "Description of the output.",
  "constraints": ["Constraint 1", "Constraint 2"],
  "timeLimit": "1000ms",
  "memoryLimit": "256MB",
  "functionName": "The main function name in the code",
  "examples": [
    {
      "input": "Example input",
      "output": "Example output",
      "explanation": "Why this is the output"
    }
  ],
  "testCases": [
    { "input": "Input representation for runner (separate parameters with newline)", "output": "Expected output representation" }
  ],
  "hiddenTestCases": [
    { "input": "Hidden input representation", "output": "Expected output representation" }
  ],
  "hints": ["Hint 1", "Hint 2"],
  "editorial": "Brief summary of solution and complexity analysis",
  "starterTemplates": {
    "javascript": "javascript starter template",
    "python": "python starter template",
    "cpp": "cpp starter template",
    "java": "java starter template",
    "go": "go starter template"
  }
}`;

    const userPrompt = `File Name: ${fileName}\n\nCode Content:\n${codeContent}`;
    const text = await fetchGroq(systemPrompt, userPrompt, 0.5, true);
    const jsonStr = parseJsonFromText(text);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Error in generateProblemFromCode:", err);
    throw err;
  }
}

export async function getQuickComplexity(code, language) {
  try {
    const systemPrompt = "Analyze the given code and return ONLY a valid JSON object with timeComplexity and spaceComplexity keys. Format like O(N), O(1), etc. NO markdown or extra text.";
    const userPrompt = code;
    const text = await fetchGroq(systemPrompt, userPrompt, 0.1, true);
    const match = text.match(/\{[^}]+\}/);
    if (match) return JSON.parse(match[0]);
    return null;
  } catch (err) {
    return null;
  }
}
