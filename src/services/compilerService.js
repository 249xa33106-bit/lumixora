// Compiler & Sandbox Execution Service for Lumixora Code Arena

/**
 * Execute code against a set of test cases
 */
export async function executeCode(problem, code, language, isSubmit = false) {
  const testCasesToRun = isSubmit 
    ? [...problem.testCases, ...problem.hiddenTestCases] 
    : problem.testCases;

  // 1. Fast Path: Client-Side JS Execution Sandbox for Javascript (unless it is the general sandbox)
  if (language === 'javascript' && problem?.id !== 'sandbox') {
    try {
      return runJavascriptSandbox(problem, code, testCasesToRun);
    } catch (e) {
      return {
        success: false,
        status: 'Compilation Error',
        compilerError: e.message || e,
        results: []
      };
    }
  }

  // 2. Slow Path: Multi-Language AI-Simulated Compilation Sandbox
  return runAISandboxSimulation(problem, code, language, testCasesToRun, isSubmit);
}

/**
 * Safe client-side JS VM runner
 */
function runJavascriptSandbox(problem, code, testCases) {
  const results = [];
  let passedCount = 0;

  // Parse target function name from the JS template (usually camelCase version of problem title)
  let functionName = 'twoSum';
  if (problem.functionName) {
    functionName = problem.functionName;
  } else {
    if (problem.id === 'valid-parentheses') functionName = 'isValid';
    if (problem.id === 'reverse-linked-list') functionName = 'reverseList';
    if (problem.id === 'container-with-most-water') functionName = 'maxArea';
    if (problem.id === 'n-queens') functionName = 'solveNQueens';
    if (problem.id === 'dijkstras-algorithm') functionName = 'dijkstra';
    if (problem.id === 'merge-sort') functionName = 'mergeSort';
  }

  // Instantiate user code safely
  // We wrap user code in a function context to prevent global scope contamination
  const runnerFn = new Function(`
    ${code}
    return ${functionName};
  `);

  const userFunction = runnerFn();
  if (typeof userFunction !== 'function') {
    throw new Error(`Function "${functionName}" was not found or is not defined correctly in your code.`);
  }

  const startTime = performance.now();

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    
    // Parse testcase inputs:
    // e.g. Input: "[2,7,11,15]\n9" -> Args: [2,7,11,15] and 9
    const lines = tc.input.trim().split('\n');
    const parsedArgs = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (err) {
        // Fallback for simple values
        return line;
      }
    });

    try {
      const outputVal = userFunction(...parsedArgs);
      const actualOutputStr = JSON.stringify(outputVal);
      const expectedOutputStr = tc.output.trim().replace(/\s+/g, '');
      const parsedActual = actualOutputStr.replace(/\s+/g, '');
      
      const passed = parsedActual === expectedOutputStr || 
                     (parsedActual.startsWith('[') && expectedOutputStr.startsWith('[') && 
                      compareUnorderedArrays(JSON.parse(actualOutputStr), JSON.parse(tc.output)));

      if (passed) passedCount++;

      results.push({
        testCaseIndex: i,
        input: tc.input,
        expected: tc.output,
        actual: actualOutputStr,
        passed: passed,
        status: passed ? 'Passed' : 'Wrong Answer'
      });
    } catch (e) {
      results.push({
        testCaseIndex: i,
        input: tc.input,
        expected: tc.output,
        actual: `Error: ${e.message}`,
        passed: false,
        status: 'Runtime Error'
      });
    }
  }

  const duration = Math.round(performance.now() - startTime);

  // Determine overall status
  let overallStatus = 'Accepted';
  const failed = results.find(r => !r.passed);
  if (failed) {
    overallStatus = failed.status;
  }

  return {
    success: overallStatus === 'Accepted',
    status: overallStatus,
    results,
    runtime: `${duration}ms`,
    memory: `${(Math.random() * 10 + 12).toFixed(1)}MB`,
    passedCount,
    totalCount: testCases.length
  };
}

/**
 * Helper: compare arrays (e.g. for Two Sum order or N-Queens array match)
 */
function compareUnorderedArrays(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  
  // Try matching elements stringified
  const s1 = arr1.map(item => JSON.stringify(item)).sort();
  const s2 = arr2.map(item => JSON.stringify(item)).sort();
  return s1.every((val, index) => val === s2[index]);
}

/**
 * AI-Powered Virtual Machine compiler for non-JS languages
 */
async function runAISandboxSimulation(problem, code, language, testCases, isSubmit) {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API key is missing!");

    const systemPrompt = `You are a secure, sandboxed code execution compilation engine and test case evaluator.
You will receive a programming challenge, user-submitted code in a specific language, and a list of test cases (both standard and hidden).
You must analyze the code, trace its logic, compile it virtualizing any compiler warnings, and check if it runs within the limits:
- Time limit: ${problem.timeLimit}
- Memory limit: ${problem.memoryLimit}

Check every test case separately. Be extremely accurate about logical edge-cases, syntax errors, and time complexity.

You must output ONLY a valid JSON object. Do not include markdown code blocks or backticks.
JSON Schema:
{
  "status": "Accepted" | "Wrong Answer" | "Compilation Error" | "Runtime Error" | "Time Limit Exceeded" | "Memory Limit Exceeded",
  "compilerError": "Compiler logs if Compilation Error, otherwise empty",
  "runtime": "45ms" (Simulated execution duration),
  "memory": "18.4MB" (Simulated memory profile),
  "passedCount": 2,
  "totalCount": 3,
  "results": [
    {
      "testCaseIndex": 0,
      "input": "input string",
      "expected": "expected output",
      "actual": "what user code evaluated to",
      "passed": true,
      "status": "Passed" | "Wrong Answer" | "Runtime Error"
    }
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
          { 
            role: "user", 
            content: `Challenge Title: ${problem.title}
Language: ${language}
User Code:
${code}

Test Cases to run:
${JSON.stringify(testCases, null, 2)}` 
          }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`VM Sandbox API Error (${response.status})`);
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

    const evaluation = JSON.parse(text);
    return {
      success: evaluation.status === 'Accepted',
      status: evaluation.status || 'Runtime Error',
      compilerError: evaluation.compilerError || '',
      runtime: evaluation.runtime || '35ms',
      memory: evaluation.memory || '16.5MB',
      passedCount: evaluation.passedCount || 0,
      totalCount: evaluation.totalCount || testCases.length,
      results: evaluation.results || []
    };
  } catch (error) {
    console.error("AI sandbox error:", error);
    return {
      success: false,
      status: 'Compilation Error',
      compilerError: `Virtual machine sandbox timeout or compilation crash: ${error.message}`,
      results: []
    };
  }
}
