import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykuyzkhhnltjccyzduap.supabase.co';
const supabaseKey = 'sb_publishable_Um7mD-g4MuTzUV9nT7ylXg_bYPSaO5n';
const supabase = createClient(supabaseUrl, supabaseKey);

// Parse Groq Key
const envContent = fs.readFileSync('.env', 'utf8');
const apiKeyLine = envContent.split('\n').find(l => l.trim().startsWith('VITE_GROQ_API_KEY='));
if (!apiKeyLine) {
  console.error("VITE_GROQ_API_KEY not found in .env");
  process.exit(1);
}
const groqApiKey = apiKeyLine.split('=')[1].trim();

const extractedDir = './scratch/extracted';
const files = [
  { name: 'AVL Tree -1.txt', topic: 'AVL Tree Rotation & Balances', category: 'Trees', difficulty: 'Hard' },
  { name: 'BFT & DFT - 4.txt', topic: 'Breadth-First and Depth-First Search', category: 'Graphs', difficulty: 'Medium' },
  { name: 'Nqueens.txt', topic: 'N-Queens Backtracking', category: 'Backtracking', difficulty: 'Hard' },
  { name: 'allpairs shortest.txt', topic: 'Floyd-Warshall All-Pairs Shortest Path', category: 'Dynamic Programming', difficulty: 'Hard' },
  { name: 'dij.txt', topic: 'Dijkstra\'s Shortest Path Algorithm', category: 'Graphs', difficulty: 'Hard' },
  { name: 'heap sort.txt', topic: 'Heap Sort Algorithm', category: 'Heaps', difficulty: 'Medium' },
  { name: 'job sequencing with deadline.txt', topic: 'Greedy Job Sequencing', category: 'Greedy', difficulty: 'Medium' },
  { name: 'knapsack problem.txt', topic: '0/1 Knapsack Problem', category: 'Dynamic Programming', difficulty: 'Medium' },
  { name: 'merge sort.txt', topic: 'Merge Sort Divide & Conquer', category: 'Recursion', difficulty: 'Medium' },
  { name: 'quick sort.txt', topic: 'Quick Sort Partitioning', category: 'Recursion', difficulty: 'Medium' }
];

async function generateProblem(fileObj) {
  const filePath = path.join(extractedDir, fileObj.name);
  if (!fs.existsSync(filePath)) {
    console.log(`File ${fileObj.name} not found, skipping.`);
    return null;
  }
  
  const textContent = fs.readFileSync(filePath, 'utf8').substring(0, 30000); // Limit context size
  console.log(`Processing file: ${fileObj.name} (${fileObj.topic})...`);

  const systemPrompt = `You are an expert curriculum developer and technical interviewer.
Analyze the provided code/notes file and extract/generate a complete LeetCode-style coding question out of it.
Generate appropriate test cases (both public and hidden), input/output descriptions, examples, editorial, and starter templates.

Note for testCases and hiddenTestCases format:
- The "input" string MUST contain each argument/parameter on a separate line (separated by newline \\n). For example, if a function takes an array and an integer, the input should be: "[2,7,11,15]\\n9". All arrays and objects in the input/output must be valid JSON strings so they can be parsed by JSON.parse.
- The "output" must be the JSON string representation of the expected return value, e.g. "[0,1]" or "true" or "49".

You must output ONLY a valid JSON object. Do not include markdown code blocks or backticks.
Format:
{
  "title": "${fileObj.topic}",
  "difficulty": "${fileObj.difficulty}",
  "category": "${fileObj.category}",
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

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `File Name: ${fileObj.name}\nTopic: ${fileObj.topic}\nContent:\n${textContent}` }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
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
    console.error(`Error generating problem for ${fileObj.name}:`, err.message);
    return null;
  }
}

async function seed() {
  console.log("Starting seeding process...");
  for (const fileObj of files) {
    const generated = await generateProblem(fileObj);
    if (!generated) continue;
    
    // Format note entry
    const { title, difficulty, category, ...rest } = generated;
    
    const noteId = fileObj.name.replace('.txt', '').replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();
    const noteData = {
      id: noteId,
      title: title || fileObj.topic,
      type: 'code_arena_problem',
      problemCategory: category || fileObj.category,
      difficulty: difficulty || fileObj.difficulty,
      ...rest,
      companies: ['Google', 'Amazon', 'Microsoft', 'Custom'],
      frequency: 60,
      popularity: 65,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      contributedBy: 'Scholar System'
    };

    console.log(`Seeding problem: ${noteData.title} (ID: ${noteId}) into Supabase...`);
    
    const { data, error } = await supabase.from('notes').insert([{
      id: noteId,
      title: noteData.title,
      content: JSON.stringify(noteData),
      last_edited: new Date().toISOString()
    }]).select();

    if (error) {
      console.error(`  Failed to seed to database:`, error.message);
    } else {
      console.log(`  Successfully seeded: ${noteData.title}`);
    }
    
    // Delay to prevent rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log("Seeding process completed!");
}

seed();
