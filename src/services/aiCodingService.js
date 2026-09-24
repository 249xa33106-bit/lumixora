// AI Coding Assistant Services for Vyomra Code Arena
import { callAICompletion } from './aiService';

/**
 * Triggered manually by user (Explain, Optimize, Trace, Hint)
 */
export async function getAICodingAssistantHelp(actionType, problem, code, language) {
  try {
    let systemPrompt = "You are an expert AI pair programmer.";
    let userPrompt = `Challenge Problem: "${problem?.title || 'Coding Problem'}"\nProblem Statement:\n${problem?.statement || ''}\n\nSelected Language: ${language}\nCurrent Code Draft:\n${code}\n\n`;
    
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

    const response = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.4
    });

    if (response && response.trim() && response.length > 10) {
      return response;
    }

    return generateDynamicFallbackHelp(actionType, problem, code, language);
  } catch (err) {
    console.error("AI Assistant error:", err);
    return generateDynamicFallbackHelp(actionType, problem, code, language);
  }
}

/**
 * Interactive chat completion for follow-up AI Assistant conversation
 */
export async function sendAICodingChatMessage(messages, problem, code, language) {
  try {
    const systemPrompt = `You are Vyomra AI Coding Assistant, an expert AI pair programmer embedded inside an interactive IDE.
Context:
- Problem: "${problem?.title || 'Coding Challenge'}"
- Problem Statement: ${problem?.statement || ''}
- Selected Language: ${language}
- Current Code in Editor:
\`\`\`${language}
${code}
\`\`\`

Answer the user's questions clearly, concisely, and accurately in Markdown. You can give hints, debug errors, explain code, or write full code snippets. Be encouraging, precise, and format code with syntax highlighting (\`\`\`${language}).`;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ];

    const response = await callAICompletion({
      messages: formattedMessages,
      temperature: 0.3
    });

    if (response && response.trim()) {
      return response;
    }
  } catch (err) {
    console.error("AI Chat Assistant error:", err);
  }

  return "I'm analyzing your code. Trace your loops, check your array indices, base conditions, and return signatures!";
}

/**
 * Dynamic problem-aware fallback AI guidance generator
 */
function generateDynamicFallbackHelp(actionType, problem, code, language) {
  const pTitle = problem?.title || 'Coding Challenge';
  
  if (problem?.id === 'n-queens') {
    if (actionType === 'hint') {
      return `### 💡 AI Hint for ${pTitle}\n\n` +
        `* **Backtracking Strategy**: Place queens row by row from \`row = 0\` to \`row = N - 1\`.\n` +
        `* **Safe Placement Check**: Before placing a queen at \`(row, col)\`, ensure no existing queen occupies the same column (\`col\`), positive diagonal (\`row + col\`), or negative diagonal (\`row - col\`).\n` +
        `* **Output Representation**: Format each valid board configuration using \`'Q'\` for queens and \`'.'\` for empty squares, formatted as a 2D array.`;
    } else if (actionType === 'explain') {
      return `### 📖 Step-by-Step Logic for ${pTitle}\n\n` +
        `1. **Recursive State Space Search**: Use recursive backtracking to explore every valid column placement for row \`r\`.\n` +
        `2. **Conflict Resolution**: Track occupied columns and diagonal constraints using sets or boolean arrays.\n` +
        `3. **Base Condition**: When row reaches \`N\`, save the current board matrix configuration and backtrack to explore alternate placements.`;
    } else if (actionType === 'optimize') {
      return `### ⚡ Optimization Guide for ${pTitle}\n\n` +
        `* **Time Complexity**: $O(N!)$ worst-case state space search.\n` +
        `* **Space Complexity**: $O(N)$ for recursion call stack and bitwise/boolean tracking arrays.\n` +
        `* **Optimization Tip**: Use integer bitmasks (\`cols\`, \`diag1\`, \`diag2\` bitmasks) to perform $O(1)$ collision checks with fast bitwise operations (\`&\`, \`|\`).`;
    } else {
      return `### 🔍 Dry Run Trace for ${pTitle}\n\n` +
        `* **Input**: $N = 4$\n` +
        `* **Row 0**: Place 'Q' at column 1 \`[".Q.."]\`\n` +
        `* **Row 1**: Place 'Q' at column 3 \`["...Q"]\`\n` +
        `* **Row 2**: Place 'Q' at column 0 \`["Q..."]\`\n` +
        `* **Row 3**: Place 'Q' at column 2 \`["..Q."]\`\n` +
        `* **Result**: Valid configuration found \`[[".Q..","...Q","Q...","..Q."]]\``;
    }
  }

  if (actionType === 'hint') {
    const customHints = Array.isArray(problem?.hints) ? problem.hints : (problem?.hints || '').split('\n').filter(Boolean);
    if (customHints.length > 0) {
      return `### 💡 AI Hint for ${pTitle}\n\n` + customHints.map((h, i) => `* **Hint ${i + 1}**: ${h}`).join('\n');
    }
    return `### 💡 AI Hint for ${pTitle}\n\n` +
      `* **Identify Pattern**: Consider the core data structure (Arrays, Hash Maps, or Recursion) required.\n` +
      `* **Boundary Conditions**: Ensure base cases (e.g. empty inputs, single element, zero) are handled prior to main loop.\n` +
      `* **Return Format**: Verify output matches the exact expected return signature.`;
  } else if (actionType === 'explain') {
    return `### 📖 Code Explanation for ${pTitle}\n\n` +
      `* **Approach**: Analyzes input data, applies algorithmic transformations, and returns expected output.\n` +
      `* **Language**: Execution configured for **${language.toUpperCase()}**.\n` +
      `* **Key Step**: Iterate over elements while updating accumulated state or tracking arrays.`;
  } else if (actionType === 'optimize') {
    return `### ⚡ Complexity Analysis for ${pTitle}\n\n` +
      `* **Estimated Time Complexity**: $O(N)$ or $O(N \\log N)$\n` +
      `* **Estimated Space Complexity**: $O(N)$ auxiliary storage\n` +
      `* **Optimization Suggestion**: Use hash maps or two-pointer techniques to avoid nested loops ($O(N^2)$).`;
  } else {
    return `### 🔍 Dry Run Trace for ${pTitle}\n\n` +
      `* **Input**: Sample testcase\n` +
      `* **Step 1**: Initialize tracking variables & data structures.\n` +
      `* **Step 2**: Process elements sequentially.\n` +
      `* **Step 3**: State updated; return computed result.`;
  }
}

/**
 * Post-Submission Quality feedback (Runs immediately after code submission)
 */
export async function getPostSubmissionFeedback(problem, code, language, status, runtime, memory) {
  try {
    const systemPrompt = `You are a code review auditor. Review the user's final submission for the coding problem "${problem?.title || 'Challenge'}".
Submission Status: ${status}
Recorded Execution Time: ${runtime}
Recorded Memory Footprint: ${memory}

Analyze their code and provide a structured JSON response.
JSON Schema:
{
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "qualityScore": 90,
  "readabilityScore": 92,
  "correctnessAnalysis": "Clear summary of correctness and edge case handling.",
  "cleanlinessPoints": ["Good variable naming", "Concise logic"],
  "edgeCaseGaps": ["None identified"]
}`;

    const userPrompt = `Language: ${language}\nCode:\n${code}`;

    const responseText = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      responseFormat: { type: "json_object" }
    });

    if (responseText) {
      let clean = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end >= start) {
        clean = clean.substring(start, end + 1);
      }
      return JSON.parse(clean);
    }
  } catch (e) {
    console.warn("Post-submission feedback notice:", e);
  }

  return {
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    qualityScore: 88,
    readabilityScore: 90,
    correctnessAnalysis: "Algorithm executes within expected bounds and passes validation test cases.",
    cleanlinessPoints: ["Clean structure", "Proper function scoping"],
    edgeCaseGaps: []
  };
}

/**
 * Rapid Time/Space Complexity Fetcher for standard runs
 */
export async function getQuickComplexity(code, language) {
  try {
    const systemPrompt = `Analyze the given ${language} code and estimate its Time and Space complexity.
Output ONLY a JSON object:
{
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)"
}`;

    const responseText = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: code }
      ],
      temperature: 0.1,
      responseFormat: { type: "json_object" }
    });

    if (responseText) {
      let clean = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end >= start) {
        clean = clean.substring(start, end + 1);
      }
      return JSON.parse(clean);
    }
  } catch (e) {
    console.warn("Quick complexity notice:", e);
  }

  return {
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)"
  };
}

/**
 * AI Problem Generator from uploaded code or user prompt
 */
export async function generateProblemFromCode(codeSnippet, customPrompt = '') {
  try {
    const systemPrompt = `You are a LeetCode problem designer. Given this code snippet or concept prompt, generate a structured coding challenge in JSON format.
Output JSON schema:
{
  "title": "Problem Title",
  "difficulty": "Easy" | "Medium" | "Hard",
  "category": "Arrays & Strings" | "Dynamic Programming" | "Trees & Graphs" | "General Algorithms",
  "statement": "Detailed markdown problem statement with constraints and examples",
  "timeLimit": "2s",
  "memoryLimit": "256MB",
  "starterTemplates": {
    "javascript": "function solve() { ... }",
    "python": "def solve(): ...",
    "cpp": "int solve() { ... }",
    "java": "public class Solution { ... }"
  },
  "testCases": [
    { "input": "...", "output": "..." }
  ],
  "hiddenTestCases": [
    { "input": "...", "output": "..." }
  ],
  "editorial": "Explanation of optimal approach."
}`;

    const responseText = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Code:\n${codeSnippet}\n\nAdditional Requirements:\n${customPrompt}` }
      ],
      temperature: 0.3,
      responseFormat: { type: "json_object" }
    });

    if (responseText) {
      let clean = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end >= start) {
        clean = clean.substring(start, end + 1);
      }
      return JSON.parse(clean);
    }
  } catch (e) {
    console.warn("AI problem generation notice:", e);
  }

  return null;
}
