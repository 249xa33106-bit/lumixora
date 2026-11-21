import { callAICompletion } from './aiService';

// ─────────────────────────────────────────────────────────────────────────────
// 1. SYLLABUS-TO-PODCAST AI RECAP GENERATOR (NotebookLM Style Dual-Host Audio)
// ─────────────────────────────────────────────────────────────────────────────
export async function generatePodcastScript(title = 'Engineering Fundamentals', subject = 'Computer Science', rawContent = '') {
  try {
    const systemPrompt = `You are an elite educational podcast producer for Lumixora (similar to NotebookLM Audio Deep Dive).
Create an engaging, witty, high-impact conversational podcast episode between two hosts:
- Host 1 ("Dr. Maya"): The expert professor who explains foundational logic, architectural principles, and real-world system design.
- Host 2 ("Alex"): The smart, curious engineering student who asks practical questions, relates concepts to coding interviews/exams, and brings memorable analogies.

Output STRICTLY a JSON object with this schema:
{
  "episodeTitle": "Deep Dive: [Engaging Title]",
  "subject": "${subject}",
  "durationEstimate": "3-4 Mins",
  "summary": "1-sentence episode teaser",
  "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "dialogue": [
    { "speaker": "Maya", "text": "Opening hook introducing the problem and why it matters." },
    { "speaker": "Alex", "text": "Student perspective question or dilemma." },
    { "speaker": "Maya", "text": "Deep breakdown using a vivid real-world analogy." },
    { "speaker": "Alex", "text": "Aha moment connecting it to exams or practical code." },
    { "speaker": "Maya", "text": "Key formula, architecture nuance, or common student mistake." },
    { "speaker": "Alex", "text": "Summary wrap-up or final high-yield tip." }
  ]
}
Keep each dialogue line between 15-45 words. Total 8-12 dialogue exchanges. Output ONLY JSON.`;

    const userPrompt = `Topic/Note Title: ${title}\nSubject: ${subject}\nReference Content:\n${(rawContent || title).slice(0, 3000)}`;

    const textResponse = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.6
    });

    if (textResponse) {
      const jsonStart = textResponse.indexOf('{');
      const jsonEnd = textResponse.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const cleanJson = textResponse.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(cleanJson);
      }
    }
    throw new Error("Invalid AI JSON format");
  } catch (error) {
    console.warn("Falling back to curated podcast script:", error);
    return getFallbackPodcastScript(title, subject);
  }
}

function getFallbackPodcastScript(title, subject) {
  return {
    episodeTitle: `Deep Dive: Mastering ${title}`,
    subject: subject || 'Computer Science Engineering',
    durationEstimate: '3 Mins',
    summary: `A high-yield audio recap breaking down the core principles, exam traps, and real-world systems behind ${title}.`,
    takeaways: [
      `Foundational architectural theory behind ${title}`,
      'High-probability 10-mark semester exam patterns',
      'Production-grade industry application'
    ],
    dialogue: [
      {
        speaker: 'Maya',
        text: `Welcome to Lumixora Deep Dive! Today we're breaking down ${title}—a topic that students often find overwhelming during semester finals.`
      },
      {
        speaker: 'Alex',
        text: `Seriously Dr. Maya, every time this shows up on the paper, students mix up the definitions. What's the fundamental intuition behind ${title}?`
      },
      {
        speaker: 'Maya',
        text: `Think of it like a highway traffic controller. Without a formal protocol, multiple processes or threads collide into deadlocks and race conditions. ${title} establishes the mathematical rules of order.`
      },
      {
        speaker: 'Alex',
        text: 'That makes complete sense! So in university exams, when they ask for a 5-marker, evaluators look for the governing conditions and a clear block diagram?'
      },
      {
        speaker: 'Maya',
        text: 'Exactly. If you state the formal definition, sketch the state transitions, and state time complexity, you guarantee full marks.'
      },
      {
        speaker: 'Alex',
        text: 'And in tech interviews at companies like Google or Amazon, they check how this behaves under high distributed load, right?'
      },
      {
        speaker: 'Maya',
        text: 'Spot on. Remember: theory guarantees your GPA, but understanding the edge-cases is what lands the SDE offer. Keep building!'
      }
    ]
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXAM PREDICTOR (High-Probability JNTU / Autonomous University Questions)
// ─────────────────────────────────────────────────────────────────────────────
export async function generateExamPredictions(title = 'Core Engineering', subject = 'General', rawContent = '') {
  try {
    const systemPrompt = `You are a senior chief university exam paper setter and evaluator for autonomous engineering colleges (JNTU / Anna Univ / VTU pattern).
Analyze the subject/topic and predict the exact high-probability examination questions for upcoming mid-term and semester final exams.

Output STRICTLY a JSON object with this schema:
{
  "subject": "${subject}",
  "topic": "${title}",
  "examPredictedDate": "Upcoming Semester & Mid Examinations",
  "overallConfidence": "96% High Yield",
  "questions": [
    {
      "id": "q1",
      "marks": 2,
      "category": "Part A (Compulsory Definition/Formula)",
      "probability": 95,
      "frequencyYears": ["2021", "2023", "2024"],
      "question": "Define the fundamental concept and state its governing condition or formula.",
      "modelAnswer": {
        "keyPoints": [
          "Precise academic definition with standard terminology (1 Mark).",
          "Governing mathematical equation or boundary condition with notations (1 Mark)."
        ],
        "examinerTip": "Evaluators deduct 0.5 marks if boundary limits or units are missing."
      }
    },
    {
      "id": "q2",
      "marks": 5,
      "category": "Part B (Analytical / Algorithmic Comparison)",
      "probability": 88,
      "frequencyYears": ["2020", "2022", "2024"],
      "question": "Compare and contrast the two core mechanisms with an architectural block diagram.",
      "modelAnswer": {
        "diagramDescription": "Input Stage -> State Transition Logic -> Output Buffer.",
        "keyPoints": [
          "Comparison table contrasting 4 core parameters (Throughput, Latency, Complexity, Use-cases).",
          "Step-by-step working logic with pseudo-code / state machine."
        ],
        "examinerTip": "Always draw diagrams with clear labels. A clean diagram secures 2 full marks."
      }
    },
    {
      "id": "q3",
      "marks": 10,
      "category": "Part C (Comprehensive Essay / System Design)",
      "probability": 92,
      "frequencyYears": ["2021", "2023", "2024"],
      "question": "Explain the comprehensive architecture, mathematical derivation/algorithm, and practical case study.",
      "modelAnswer": {
        "structure": [
          "1. Introduction & Formal Theorem (1.5 Marks)",
          "2. Complete Architectural Block Diagram / Flowchart (2.5 Marks)",
          "3. Working Mechanism & Step-by-Step Algorithm (3.5 Marks)",
          "4. Practical Engineering Real-World Example & Tradeoffs (2.5 Marks)"
        ],
        "examinerTip": "Structure with clean subheadings and bullet points. Never write a single 10-mark text block."
      }
    }
  ]
}
Output ONLY valid JSON.`;

    const userPrompt = `Topic/Subject: ${title} (${subject})\nMaterial Excerpt:\n${(rawContent || title).slice(0, 3000)}`;

    const textResponse = await callAICompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
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
    throw new Error("Invalid AI JSON format");
  } catch (error) {
    console.warn("Falling back to curated exam predictions:", error);
    return getFallbackExamPredictions(title, subject);
  }
}

function getFallbackExamPredictions(title, subject) {
  return {
    subject: subject || 'Computer Science Engineering',
    topic: title || 'Core Engineering Subject',
    examPredictedDate: 'Upcoming Semester & Mid Examinations',
    overallConfidence: '95% High Yield',
    questions: [
      {
        id: 'q1',
        marks: 2,
        category: 'Part A (Compulsory Definition)',
        probability: 96,
        frequencyYears: ['2021', '2022', '2024'],
        question: `Define the primary governing theorem of ${title} and state its necessary boundary condition.`,
        modelAnswer: {
          keyPoints: [
            `Standard formal academic definition of ${title} (1 Mark).`,
            'Mathematical formulation or state invariancy condition (1 Mark).'
          ],
          examinerTip: 'Write concise bullet points. Avoid long paragraphs for 2-mark questions.'
        }
      },
      {
        id: 'q2',
        marks: 5,
        category: 'Part B (Analytical / Comparison)',
        probability: 90,
        frequencyYears: ['2020', '2023', '2024'],
        question: `Differentiate between static and dynamic approaches in ${title} with a neat schematic diagram.`,
        modelAnswer: {
          diagramDescription: 'Schematic comparison: Centralized vs. Distributed architecture.',
          keyPoints: [
            'Tabular comparison covering 4 distinct parameters: Time Complexity, Space Overhead, Fault Tolerance, and Implementation.',
            'Working execution cycle breakdown.'
          ],
          examinerTip: 'Drawing a neat block diagram with pencil guarantees at least 2 full marks out of 5.'
        }
      },
      {
        id: 'q3',
        marks: 10,
        category: 'Part C (10-Mark Comprehensive Essay)',
        probability: 94,
        frequencyYears: ['2019', '2022', '2023'],
        question: `Explain the complete end-to-end architecture and operational algorithm of ${title} with a case study.`,
        modelAnswer: {
          structure: [
            '1. Conceptual Overview & Industry Background (1.5 Marks)',
            '2. Architectural Block Diagram with Interface Specifications (2.5 Marks)',
            '3. Step-by-Step Algorithmic Trace with Example Dataset (3.5 Marks)',
            '4. Advantages, Bottlenecks, and Edge-Case Failures (2.5 Marks)'
          ],
          examinerTip: 'Include clear sub-headings. Chief examiners allocate marks based on structured steps.'
        }
      }
    ]
  };
}
