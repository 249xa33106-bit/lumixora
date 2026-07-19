// AI Coding Assistant and Submission Feedback Service for Lumixora

/**
 * AI Coding Assistance Drawer Actions: Hint, Dry Run, Explain, Optimize
 */
export async function getAICodingAssistantHelp(actionType, problem, code, language) {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

    let prompt = '';
    if (actionType === 'explain') {
      prompt = `You are a professional coding coach. Provide an intuitive, step-by-step breakdown of how the user's code solves the problem "${problem.title}". Highlight key algorithmic parts, and explain how the loops/data-structures work. Keep it clear, concise, and structured in Markdown. Do not reveal alternative complete solutions unless specifically requested.`;
    } else if (actionType === 'hint') {
      prompt = `You are a supportive, high-level coding mentor. Review the user's current code for the problem "${problem.title}". 
**CRITICAL**: Do NOT write or provide the complete solution. 
Instead:
1. Point out any logical bugs or syntactical issues in their current draft.
2. Provide a constructive, guided hint or a leading question that helps them think about the next step or an edge-case.
3. Suggest an algorithm class (e.g., "Think about using two-pointers here...").
Format the output in clear, readable Markdown.`;
    } else if (actionType === 'dry-run') {
      prompt = `You are a debugger and virtual executor. Review the user's code for "${problem.title}" and generate a Dry Run Visualization.
1. Provide a step-by-step trace of how the variables change state on a small input (e.g. if Arrays, trace a 3-element list).
2. Generate a clean Markdown trace table representing columns for: Row/Line, Iteration, Variable Values, and Operation.
3. Conclude with a 2-sentence summary of the dry run walk.`;
    } else if (actionType === 'optimize') {
      prompt = `You are a senior systems engineer. Analyze the time and space complexity of the user's code for "${problem.title}".
1. Calculate the current Time Complexity (e.g., O(N^2)) and Space Complexity (e.g., O(1)).
2. Explain where the bottleneck is.
3. Suggest a better, more optimal algorithm (e.g. showing how to reduce it to O(N log N) or O(N)), explaining the trade-offs.
Do not write the full code, just explain the approach in Markdown.`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: prompt },
          { 
            role: "user", 
            content: `Challenge Problem: "${problem.title}"
Problem Statement:
${problem.statement}

Selected Language: ${language}
Current Code Draft:
${code}` 
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`AI Gateway Error (${response.status})`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
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
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

    const systemPrompt = `You are a code review auditor. Review the user's final submission for the coding problem "${problem.title}".
Submission Status: ${status}
Recorded Execution Time: ${runtime}
Recorded Memory Footprint: ${memory}

Analyze their code and provide a structured JSON response.

You must output ONLY a valid JSON object. Do not include markdown code blocks or backticks.
JSON Schema:
{
  "qualityScore": 85, (Grade 1-100 based on syntax, clean-code, and efficiency)
  "readabilityScore": 90, (Grade 1-100 based on names, formatting, and simplicity)
  "correctnessAnalysis": "A short summary explaining if the code handles all edge cases, duplicates, nulls, and boundary conditions.",
  "suggestions": [
    "Suggestion 1: e.g. Rename single-character variables to be more descriptive.",
    "Suggestion 2: e.g. Pre-size the hash map capacity to avoid rehashing overhead."
  ],
  "betterAlgorithms": "If applicable, suggest a faster or more memory-efficient algorithm. If their code is already optimal, praise it.",
  "learningTip": "A customized tip on what coding patterns/data-structures they should review based on this solve."
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
          { 
            role: "user", 
            content: `Code submitted in ${language}:
${code}` 
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`AI Review API Error (${response.status})`);
    }

    const data = await response.json();
    let text = data.choices[0].message.content;
    
    // Clean JSON tags
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      text = text.substring(jsonStart, jsonEnd + 1);
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("AI review helper error:", err);
    // Fallback response if AI review fails
    return {
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
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key is missing!");

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
          { role: "user", content: `File Name: ${fileName}\n\nCode Content:\n${codeContent}` }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`AI API Error (${response.status})`);
    }

    const data = await response.json();
    let text = data.choices[0].message.content;
    
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      text = text.substring(jsonStart, jsonEnd + 1);
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("Error in generateProblemFromCode:", err);
    throw err;
  }
}

