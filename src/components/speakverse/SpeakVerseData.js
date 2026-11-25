// ============================================================================
// LUMIXORA SpeakVerse™ — COMPLETE 8-STAGE COMMUNICATION DEVELOPMENT ENGINE
// Tagline: "From Hesitation to Communication. From Communication to Confidence."
// Full 8-Stage Development System • 10-Axis CDI Metrics • 6 Practice Laboratories
// Telugu-to-English Bridge • Real-World Roleplay • AI Weakness Diagnostic
// ============================================================================

export const SPEAKVERSE_TAGLINE = "From Hesitation to Communication. From Communication to Confidence.";

// ─── 1. The Complete 8-Stage Development System ──────────────────────────────
export const SPEAKVERSE_STAGES = [
  {
    stage: 1,
    title: "Absolute Beginner",
    badge: "Stage 01",
    subtitle: "Start From Zero",
    color: "#6366F1", // Indigo
    lightBg: "bg-indigo-50/70",
    borderCol: "border-indigo-200",
    description: "Designed specifically for students who struggle with basic English. Build foundational sounds, simple sentence formation, and transition from native Telugu thoughts into clear English.",
    modules: [
      {
        id: "s1-alphabet-sounds",
        title: "English Alphabet & Sounds",
        desc: "Master English phonemes, vowel lengths, consonant blends, and acoustic pronunciation basics.",
        duration: "15 mins",
        prompt: "Say the 5 short and long vowel sounds: /æ/ in 'cat', /eɪ/ in 'cake', /iː/ in 'see', /ɒ/ in 'hot', and /uː/ in 'boot'.",
        sampleResponse: "Cat, Cake, See, Hot, Boot. Notice how the vocal chord vibration shifts between short and long vowels.",
        teluguHint: "ఇంగ్లీష్ అక్షరాల ఉచ్ఛారణ మరియు శబ్దాలు (Phonetics).",
        targetSkills: ["Vowel Phonemes", "Consonant Clarity", "Sound Awareness"],
        difficulty: "Absolute Beginner"
      },
      {
        id: "s1-vocab-builder",
        title: "Basic Vocabulary Builder",
        desc: "100 indispensable daily words for college, home, meals, routines, and objects.",
        duration: "15 mins",
        prompt: "Name 5 everyday items in your study room and pronounce them clearly in English.",
        sampleResponse: "Notebook, laptop, desk lamp, ballpoint pen, and ceramic water bottle.",
        teluguHint: "రోజూ వాడే వస్తువుల పేర్లు మరియు పదజాలం.",
        targetSkills: ["Noun Recognition", "Accurate Pronunciation", "Object Naming"],
        difficulty: "Absolute Beginner"
      },
      {
        id: "s1-word-sentence",
        title: "Word-to-Sentence Builder",
        desc: "Connect isolated words into complete, natural subject-action-object thoughts.",
        duration: "20 mins",
        prompt: "Take the words 'Student', 'Library', and 'Reads'. Build two simple, correct sentences.",
        sampleResponse: "The student reads a book in the library. Every evening, many students study together there.",
        teluguHint: "పదాల నుంచి చిన్న చిన్న వాక్యాలను నిర్మించడం.",
        targetSkills: ["Sentence Linking", "Subject Placement", "Simplicity"],
        difficulty: "Absolute Beginner"
      },
      {
        id: "s1-sentence-formation-lab",
        title: "Sentence Formation Lab",
        desc: "Master the Subject + Verb + Object rhythm. Eliminate native word-order inversion errors.",
        duration: "20 mins",
        prompt: "Form 3 sentences describing what your family members are doing right now.",
        sampleResponse: "My mother is cooking dinner in the kitchen. My father is reading the newspaper. My sister is studying for her exam.",
        teluguHint: "Subject + Verb + Object క్రమంలో తప్పులు లేకుండా వాక్యాలు చేయడం.",
        targetSkills: ["S-V-O Structure", "Present Continuous", "Word Order"],
        difficulty: "Absolute Beginner"
      },
      {
        id: "s1-grammar-academy",
        title: "Basic Grammar Academy",
        desc: "Grammar learned through real contextual examples rather than dry rules.",
        duration: "20 mins",
        prompt: "Use 'is', 'am', and 'are' correctly to describe yourself, a friend, and your classmates.",
        sampleResponse: "I am an engineering student. My friend is a fast coder. All my classmates are preparing for campus placements.",
        teluguHint: "ఉదాహరణల ద్వారా సరళమైన వ్యాకరణం నేర్చుకోవడం (am / is / are).",
        targetSkills: ["Auxiliary Verbs", "Agreement", "Practical Usage"],
        difficulty: "Absolute Beginner"
      },
      {
        id: "s1-daily-use-english",
        title: "Daily Use English",
        desc: "30 high-frequency expressions for asking permissions, greeting, and responding politely.",
        duration: "15 mins",
        prompt: "How do you ask a professor for permission to submit an assignment tomorrow?",
        sampleResponse: "Excuse me, Professor. Could I please have permission to submit my assignment by tomorrow morning?",
        teluguHint: "రోజువారీ కాలేజీ మరియు సాధారణ సంభాషణలలో వాడే వాక్యాలు.",
        targetSkills: ["Polite Requests", "Campus Etiquette", "Tone Control"],
        difficulty: "Absolute Beginner"
      },
      {
        id: "s1-telugu-bridge",
        title: "Telugu-to-English Bridge",
        desc: "Overcome the mental translation gap. Stop thinking in Telugu and translating literally.",
        duration: "20 mins",
        prompt: "Convert: 'నేను రేపు కాలేజీకి వస్తాను' and 'ఈ సమస్య నాకు చాలా కష్టంగా ఉంది' directly into natural English.",
        sampleResponse: "I will come to college tomorrow. I find this problem quite challenging.",
        teluguHint: "తెలుగు ఆలోచనలను తప్పులు లేకుండా సహజమైన ఇంగ్లీషులోకి మార్చడం.",
        targetSkills: ["Direct Formulation", "Syntax Alignment", "Translation Elimination"],
        difficulty: "Absolute Beginner"
      },
      {
        id: "s1-picture-description",
        title: "Picture Description",
        desc: "Look at simple visual scenes and describe colors, actions, and objects aloud.",
        duration: "15 mins",
        prompt: "Imagine looking out your classroom window on a rainy day. Describe what you see in 4 sentences.",
        sampleResponse: "Dark clouds are gathering across the sky. Raindrops are tapping gently against the window glass. Students are walking with colorful umbrellas across the campus lawn.",
        teluguHint: "చిత్రాన్ని చూసి ఇంగ్లీషులో 4-5 వాక్యాలు వర్ణించడం.",
        targetSkills: ["Visual Vocabulary", "Descriptive Adjectives", "Spatial Prepositions"],
        difficulty: "Absolute Beginner"
      },
      {
        id: "s1-listen-repeat",
        title: "Listen & Repeat",
        desc: "Acoustic mirroring drills. Listen to clear model native audio and repeat with rhythm.",
        duration: "15 mins",
        prompt: "Listen to the audio prompt: 'Consistency is the true foundation of speaking mastery.' Repeat it aloud 3 times.",
        sampleResponse: "Consistency is the true foundation of speaking mastery.",
        teluguHint: "శ్రద్ధగా విని, అదే శృతి మరియు ఉచ్ఛారణతో తిరిగి చెప్పడం.",
        targetSkills: ["Acoustic Shadowing", "Intonation", "Breath Cadence"],
        difficulty: "Absolute Beginner"
      },
      {
        id: "s1-first-conversation",
        title: "My First Conversation",
        desc: "Guided 2-way dialogue with your AI buddy. Greet, ask how they are, and share your goal.",
        duration: "15 mins",
        prompt: "Start your first dialogue: say hello to your AI coach, mention your branch of study, and ask for advice.",
        sampleResponse: "Hi Lumixora! I am a second-year CSE student at GPREC. How can I practice speaking English without feeling nervous?",
        teluguHint: "మొట్టమొదటి సంభాషణ — భయం లేకుండా AIతో మాట్లాడటం ప్రారంభించండి.",
        targetSkills: ["Turn-Taking", "Opening Dialogue", "Confidence"],
        difficulty: "Absolute Beginner"
      }
    ]
  },
  {
    stage: 2,
    title: "Basic Communication",
    badge: "Stage 02",
    subtitle: "Build Speaking Ability",
    color: "#0284C7", // Sky/Blue
    lightBg: "bg-sky-50/70",
    borderCol: "border-sky-200",
    description: "Develop the ability to hold simple, spontaneous dialogues. Introduce yourself comfortably, ask meaningful questions, and talk about your college life, friends, and family.",
    modules: [
      {
        id: "s2-self-intro",
        title: "Self-Introduction Trainer",
        desc: "Build a polished 60-second personal introduction covering identity, education, and interests.",
        duration: "20 mins",
        prompt: "Deliver a structured self-introduction: your name, where you are from, your degree, and one passion.",
        sampleResponse: "Good morning! My name is Rajesh Kumar, from Kurnool. I am pursuing Electrical Engineering at GPREC. Outside academics, I am deeply passionate about embedded robotics.",
        targetSkills: ["First Impressions", "Chronological Flow", "Vocal Warmth"],
        difficulty: "Basic"
      },
      {
        id: "s2-daily-conv",
        title: "Daily Conversation Practice",
        desc: "Small talk starters: talking about weather, lunch plans, bus commutes, and schedules.",
        duration: "15 mins",
        prompt: "Ask a classmate about their weekend plans and suggest studying together on Sunday.",
        sampleResponse: "Hey Rohan, do you have any plans for this weekend? If you are free, would you like to review the DBMS notes together this Sunday?",
        targetSkills: ["Social Etiquette", "Open Questions", "Casual Warmth"],
        difficulty: "Basic"
      },
      {
        id: "s2-qa-exchange",
        title: "Asking and Answering Questions",
        desc: "Master the 5 Ws and 1 H: Who, What, Where, When, Why, and How in rapid fire.",
        duration: "20 mins",
        prompt: "Ask 3 distinct questions about a tech workshop taking place in the college auditorium.",
        sampleResponse: "When does the workshop begin? Who is the keynote speaker from industry? Where can we register for the hands-on lab?",
        targetSkills: ["Interrogative Formats", "Auxiliary Inversion", "Clarity"],
        difficulty: "Basic"
      },
      {
        id: "s2-family-friends",
        title: "Family and Friends Conversations",
        desc: "Speak warmly about personal relationships, family traditions, and close friendships.",
        duration: "15 mins",
        prompt: "Describe your best friend and explain two qualities that make your bond strong.",
        sampleResponse: "My best friend is Karthik. He is exceptionally supportive and always encourages me to learn new technical skills.",
        targetSkills: ["Descriptive Emotion", "Character Adjectives", "Narrative Flow"],
        difficulty: "Basic"
      },
      {
        id: "s2-college-conv",
        title: "College Conversation Practice",
        desc: "Discussing lab experiments, attendance requirements, canteen discussions, and clubs.",
        duration: "20 mins",
        prompt: "Explain to a lab partner why your Java program is throwing a NullPointerException.",
        sampleResponse: "I noticed our loop is trying to access an uninitialized array element. If we allocate memory before iterating, the exception should be resolved.",
        targetSkills: ["Technical Vocabulary", "Peer Collaboration", "Concise Explanation"],
        difficulty: "Basic"
      },
      {
        id: "s2-situation-dialogues",
        title: "Common Situation Dialogues",
        desc: "Scenarios at the bank, bus counter, medical store, and administrative office.",
        duration: "20 mins",
        prompt: "Ask the college administrative office for an official bona fide study certificate.",
        sampleResponse: "Good afternoon, Sir. I need an official bona fide certificate to apply for an educational scholarship. Could you guide me on the application form?",
        targetSkills: ["Formal Inquiries", "Clarity", "Polite Tone"],
        difficulty: "Basic"
      },
      {
        id: "s2-listening-comp",
        title: "Basic Listening Comprehension",
        desc: "Listen to an audio announcement and summarize key takeaways in your own words.",
        duration: "15 mins",
        prompt: "Listen to the mock campus announcement about the upcoming symposium and summarize the deadlines.",
        sampleResponse: "The symposium is scheduled for March 15th. Paper abstract submissions close this Friday, and registrations are open on the department portal.",
        targetSkills: ["Active Listening", "Synthesis", "Key Detail Retention"],
        difficulty: "Basic"
      },
      {
        id: "s2-speaking-challenges",
        title: "Daily Speaking Challenges",
        desc: "Bite-sized 90-second prompt challenges to build your consecutive daily streak.",
        duration: "15 mins",
        prompt: "Speak for 90 seconds about: 'One habit that helped me study better this semester.'",
        sampleResponse: "Waking up thirty minutes earlier each morning to solve one coding problem before classes gave me remarkable momentum...",
        targetSkills: ["Daily Habituation", "Uninterrupted Speech", "Confidence"],
        difficulty: "Basic"
      }
    ]
  },
  {
    stage: 3,
    title: "Intermediate English",
    badge: "Stage 03",
    subtitle: "Develop Fluency",
    color: "#0D9488", // Teal
    lightBg: "bg-teal-50/70",
    borderCol: "border-teal-200",
    description: "Shift from conscious translation to effortless English thinking. Expand vocabulary, weave engaging stories, master idioms, and explain concepts under time pressure.",
    modules: [
      {
        id: "s3-think-in-english",
        title: "Think in English Training",
        desc: "Direct mental simulation. Describe your immediate thought stream without mother-tongue mediation.",
        duration: "20 mins",
        prompt: "Look at your surroundings and narrate your inner monologue in English for 60 seconds.",
        sampleResponse: "I am sitting at my desk, feeling focused. I need to complete this communication drill, then review my compiler design notes.",
        targetSkills: ["Inner Monologue", "Cognitive Speed", "Fluency"],
        difficulty: "Intermediate"
      },
      {
        id: "s3-spontaneous-speaking",
        title: "Spontaneous Speaking Practice",
        desc: "Zero-preparation speaking. An unexpected topic appears, and you begin speaking immediately.",
        duration: "15 mins",
        prompt: "Topic: 'Should AI tools like ChatGPT be permitted in university exams?' Speak for 75 seconds.",
        sampleResponse: "In my opinion, AI tools should be integrated thoughtfully rather than banned outright. They reflect the modern engineering workplace...",
        targetSkills: ["Immediate Formulation", "Stance Defense", "Continuous Flow"],
        difficulty: "Intermediate"
      },
      {
        id: "s3-storytelling",
        title: "Storytelling Exercises",
        desc: "Master the 3-act narrative arc: the Hook, the Climax/Challenge, and the Resolution.",
        duration: "20 mins",
        prompt: "Tell a vivid story about a time you worked against an impossible deadline to complete a project.",
        sampleResponse: "It was 2 AM on the night before our hackathon submission. Our primary API crashed, and our dashboard went dark...",
        targetSkills: ["Narrative Pacing", "Dramatic Tension", "Expressive Delivery"],
        difficulty: "Intermediate"
      },
      {
        id: "s3-explain-60s",
        title: "Explain a Concept in 60 Seconds",
        desc: "The Feynman Technique. Explain a complex technical topic so clearly a 10-year-old would understand.",
        duration: "20 mins",
        prompt: "Explain how 'Cloud Computing' works in exactly 60 seconds without confusing jargon.",
        sampleResponse: "Imagine instead of buying twenty bulky computers for your home, you rent supercomputers sitting in a secure building far away through the internet...",
        targetSkills: ["Simplification", "Metaphorical Thinking", "Conciseness"],
        difficulty: "Intermediate"
      },
      {
        id: "s3-idioms-phrases",
        title: "Idioms & Natural Phrases",
        desc: "Incorporate authentic conversational idioms naturally (e.g. 'hit the ground running', 'bite the bullet').",
        duration: "15 mins",
        prompt: "Use the phrases 'on the same page' and 'think outside the box' to describe a team brainstorming session.",
        sampleResponse: "During our project kickoff, we wanted to ensure all team members were on the same page before attempting to think outside the box on system architecture.",
        targetSkills: ["Idiomatic Competence", "Nuance", "Stylistic Elegance"],
        difficulty: "Intermediate"
      },
      {
        id: "s3-grammar-challenges",
        title: "Grammar Correction Challenges",
        desc: "Identify and verbally correct common Indian English errors (e.g. 'revert back', 'prepone', 'pass outs').",
        duration: "20 mins",
        prompt: "Spot the error and rephrase: 'I will revert back to you regarding the meeting prepone.'",
        sampleResponse: "The correct phrasing is: 'I will reply to you regarding rescheduling the meeting earlier.'",
        targetSkills: ["Error Diagnosis", "Precision", "Standard Global English"],
        difficulty: "Intermediate"
      }
    ]
  },
  {
    stage: 4,
    title: "Fluency & Confidence",
    badge: "Stage 04",
    subtitle: "Remove Hesitation",
    color: "#E11D48", // Rose / Red-Pink (Flagship Stage)
    lightBg: "bg-rose-50/70",
    borderCol: "border-rose-200",
    description: "The core engine of SpeakVerse. Completely eradicate the fear of stammering, freeze responses, and excessive filler words. Speak continuously, confidently, and naturally.",
    modules: [
      {
        id: "s4-no-hesitation",
        title: "No-Hesitation Arena",
        desc: "Speak continuously without stopping to plan sentences in advance. Overcome perfectionist freeze.",
        duration: "20 mins",
        prompt: "Speak for 90 seconds without pausing longer than 1.5 seconds. If you stutter, keep going!",
        sampleResponse: "Confidence is not about never making a mistake; it is about trusting that your voice has value and your ideas matter...",
        targetSkills: ["Zero-Freeze", "Momentum", "Hesitation Extinction"],
        difficulty: "Fluency Builder"
      },
      {
        id: "s4-60s-challenge",
        title: "60-Second Rapid Challenge",
        desc: "A timed stopwatch begins immediately. Speak on an abstract topic for 60 seconds non-stop.",
        duration: "15 mins",
        prompt: "Topic: 'The value of making mistakes early in your career.' Go!",
        sampleResponse: "Mistakes are not setbacks; they are the empirical data points that refine our decision-making...",
        targetSkills: ["Stamina", "Time Awareness", "Unbroken Flow"],
        difficulty: "Fluency Builder"
      },
      {
        id: "s4-think-fast",
        title: "Think Fast & Unexpected Questions",
        desc: "Answer surprising questions without warning (e.g. 'If you were the dean for one day, what changes?').",
        duration: "15 mins",
        prompt: "If you could replace all exams with one alternative evaluation method, what would it be and why?",
        sampleResponse: "I would replace standard written memory tests with collaborative, real-world capstone challenges where students build working software...",
        targetSkills: ["Impromptu Agility", "Creative Logic", "Composure"],
        difficulty: "Fluency Builder"
      },
      {
        id: "s4-filler-detector",
        title: "Filler Word Detector & Eliminator",
        desc: "Live detection of 'um', 'uh', 'like', 'actually', 'basically', and silent pause replacements.",
        duration: "20 mins",
        prompt: "Explain your favorite hobby for 60 seconds with ZERO filler words. Replace fillers with intentional silent pauses.",
        sampleResponse: "I enjoy long-distance running. [intentional breath] It teaches mental discipline and allows me to disconnect from screens.",
        targetSkills: ["Filler Elimination", "Intentional Pauses", "Vocal Cleanliness"],
        difficulty: "Fluency Builder"
      },
      {
        id: "s4-silence-analyzer",
        title: "Silence & Pause Analyzer",
        desc: "Distinguish between awkward dead silences (>3s) and authoritative rhetorical pauses (1s).",
        duration: "15 mins",
        prompt: "Deliver a 45-second statement where you use two dramatic 1-second pauses to emphasize your points.",
        sampleResponse: "Technology changes every six months. [1-sec pause] But foundational curiosity? [1-sec pause] That lasts a lifetime.",
        targetSkills: ["Rhetorical Pauses", "Pacing", "Authority"],
        difficulty: "Fluency Builder"
      },
      {
        id: "s4-daily-voice-journal",
        title: "Daily Voice Journal",
        desc: "Record your daily 2-minute spoken journal entry. Track confidence, WPM, and clarity trajectory.",
        duration: "15 mins",
        prompt: "Reflect on today: what went well, what challenged you, and what are you proud of?",
        sampleResponse: "Today was a productive day. I solved a challenging graph traversal problem in lab and practiced speaking for 15 minutes...",
        targetSkills: ["Self-Reflection", "Habit Tracking", "Spoken Cadence"],
        difficulty: "Fluency Builder"
      }
    ]
  },
  {
    stage: 5,
    title: "Professional Communication",
    badge: "Stage 05",
    subtitle: "Workplace Readiness",
    color: "#2563EB", // Blue
    lightBg: "bg-blue-50/70",
    borderCol: "border-blue-200",
    description: "Corporate readiness. Master business email etiquette, agile standups, formal client calls, constructive peer feedback, and conflict resolution.",
    modules: [
      {
        id: "s5-email-writing",
        title: "Professional Email Communication",
        desc: "Write and speak high-impact corporate emails: executive summaries, clear asks, and subject lines.",
        duration: "20 mins",
        prompt: "Draft an email requesting a 3-day extension on a major software project milestone due to server downtime.",
        sampleResponse: "Subject: Request for 3-Day Milestone Extension – Project Falcon\n\nDear Team Lead,\nDue to unplanned database server downtime yesterday, we were unable to finalize end-to-end integration tests...",
        targetSkills: ["Corporate Brevity", "Professional Tone", "Accountability"],
        difficulty: "Professional"
      },
      {
        id: "s5-meeting-standup",
        title: "Agile Meeting & Standup Communication",
        desc: "The 3 standup pillars: What I completed yesterday, What I am doing today, and Any blockers.",
        duration: "15 mins",
        prompt: "Deliver your 45-second daily engineering standup update to your team lead.",
        sampleResponse: "Yesterday, I completed the JWT authentication endpoints. Today, I am integrating the Supabase user session listener. My only blocker is awaiting review on PR #42.",
        targetSkills: ["Standup Efficiency", "Clarity", "Blocker Articulation"],
        difficulty: "Professional"
      },
      {
        id: "s5-constructive-feedback",
        title: "Giving Constructive Feedback",
        desc: "The SBI Model: Situation, Behavior, Impact. Deliver peer critique without triggering defensiveness.",
        duration: "20 mins",
        prompt: "Give constructive feedback to a teammate whose delayed code commits held back the release.",
        sampleResponse: "During our sprint demo yesterday, when code was committed ten minutes before presentation, we encountered unexpected merge conflicts...",
        targetSkills: ["SBI Framework", "Emotional Intelligence", "Diplomacy"],
        difficulty: "Professional"
      },
      {
        id: "s5-explain-tech",
        title: "Explaining Technical Concepts to Non-Tech",
        desc: "Bridge engineering and business. Explain APIs, latency, or caching to marketing and sales.",
        duration: "20 mins",
        prompt: "Explain why our mobile app needs Redis caching to a non-technical marketing manager.",
        sampleResponse: "Think of Redis caching like keeping popular dishes ready on the counter instead of cooking from scratch every time an order arrives...",
        targetSkills: ["Executive Metaphors", "Business Value", "Decoupling Jargon"],
        difficulty: "Professional"
      },
      {
        id: "s5-conflict-resolution",
        title: "Workplace Conflict Resolution",
        desc: "De-escalate disagreements regarding architectural choices, timelines, or role responsibilities.",
        duration: "20 mins",
        prompt: "Address a disagreement between frontend and backend engineers on API payload structure.",
        sampleResponse: "I understand both perspectives. The frontend needs flat objects for fast rendering, while backend prefers nested schemas for normalization. Let us align on a GraphQL layer...",
        targetSkills: ["De-escalation", "Active Listening", "Collaborative Compromise"],
        difficulty: "Professional"
      }
    ]
  },
  {
    stage: 6,
    title: "Advanced Communication",
    badge: "Stage 06",
    subtitle: "Become an Effective Communicator",
    color: "#7C3AED", // Purple
    lightBg: "bg-purple-50/70",
    borderCol: "border-purple-200",
    description: "Elevate your spoken presence. Master public speaking, debate, high-stakes persuasion, leadership presence, voice modulation, and cross-cultural communication.",
    modules: [
      {
        id: "s6-public-speaking",
        title: "Public Speaking Academy",
        desc: "Command the stage. Eye contact, open body language, vocal resonance, and audience anchoring.",
        duration: "25 mins",
        prompt: "Deliver a 2-minute keynote opening on 'Why Ethical AI Matters More Than Rapid AI.'",
        sampleResponse: "Ladies and gentlemen, we are currently racing to build intelligence faster than we are understanding responsibility...",
        targetSkills: ["Stage Presence", "Audience Engagement", "Vocal Projection"],
        difficulty: "Advanced"
      },
      {
        id: "s6-debate-argument",
        title: "Debate & Argumentation Mastery",
        desc: "The ARE model: Assertion, Reasoning, and Evidence. Construct rock-solid rebuttals.",
        duration: "25 mins",
        prompt: "Argue against the proposition: 'College degrees are obsolete in the age of online bootcamps.'",
        sampleResponse: "While bootcamps teach transient frameworks, universities cultivate long-term foundational thinking, peer collaboration, and rigorous research methodologies...",
        targetSkills: ["Rebuttal Architecture", "Logical Fallacy Defense", "Evidence Stacking"],
        difficulty: "Advanced"
      },
      {
        id: "s6-voice-modulation",
        title: "Voice Modulation & Delivery",
        desc: "Vary your pitch, tempo, volume, and timbre to maintain hypnotic listener engagement.",
        duration: "20 mins",
        prompt: "Speak a paragraph shifting from a quiet, mysterious whisper to an energized, confident crescendo.",
        sampleResponse: "In the quiet corners of the laboratory, a breakthrough was born. [tempo speeds up] And today, that breakthrough is transforming millions of lives!",
        targetSkills: ["Dynamic Range", "Pitch Variation", "Emotional Resonance"],
        difficulty: "Advanced"
      },
      {
        id: "s6-leadership-comm",
        title: "Leadership Communication",
        desc: "Rally a demotivated team after a setback. Inspire purpose and clear vision.",
        duration: "20 mins",
        prompt: "Address your squad after losing a national hackathon finals despite working for 3 weeks.",
        sampleResponse: "Team, we did not take home the trophy today, but what we built over the last twenty days is a production-grade platform that solves real human pain...",
        targetSkills: ["Vision Casting", "Resilience Building", "Inspirational Tone"],
        difficulty: "Advanced"
      }
    ]
  },
  {
    stage: 7,
    title: "Career & Placement Communication",
    badge: "Stage 07",
    subtitle: "Placement Preparation",
    color: "#059669", // Emerald / Green (Placement Exclusive)
    lightBg: "bg-emerald-50/70",
    borderCol: "border-emerald-200",
    description: "Designed specifically for engineering students facing campus drives. Ace HR rounds, explain technical projects with precision, excel in GDs, and negotiate offers.",
    modules: [
      {
        id: "s7-hr-interview",
        title: "AI HR Interview Simulator",
        desc: "Master the behavioral STAR method (Situation, Task, Action, Result) for top tier recruiters.",
        duration: "25 mins",
        prompt: "Answer: 'Tell me about a time you handled a tight deadline when a team member dropped out.'",
        sampleResponse: "In our third-year database mini-project, our teammate fell ill two days before deadline. [Task] I took responsibility for the schema design...",
        targetSkills: ["STAR Method", "Behavioral Alignment", "Honesty"],
        difficulty: "Placement Specialist"
      },
      {
        id: "s7-tech-interview-comm",
        title: "Technical Interview Communication",
        desc: "Talk through code out loud. Articulate time complexity (Big-O), trade-offs, and edge cases.",
        duration: "25 mins",
        prompt: "Explain how you would find the longest substring without repeating characters in O(n) time.",
        sampleResponse: "I would use a sliding window approach combined with a hash map. As we iterate through the string, the right pointer expands the window...",
        targetSkills: ["Thinking Aloud", "Complexity Analysis", "Trade-Off Discussion"],
        difficulty: "Placement Specialist"
      },
      {
        id: "s7-gd-simulator",
        title: "Group Discussion Simulator",
        desc: "Enter GDs tactfully: how to initiate, support, disagree respectfully, and summarize the consensus.",
        duration: "20 mins",
        prompt: "Topic: 'Electric Vehicles in India: Realistic Solution or Premature Hype?' Intervene respectfully.",
        sampleResponse: "I agree with my peer's point regarding battery raw material supply chains. However, we must also consider the significant reduction in urban particulate pollution...",
        targetSkills: ["Turn Interventions", "Consensus Building", "Active Listening"],
        difficulty: "Placement Specialist"
      },
      {
        id: "s7-project-explainer",
        title: "Final-Year Project Explainer",
        desc: "Deliver a captivating 2-minute elevator pitch of your major engineering project to a panel.",
        duration: "20 mins",
        prompt: "Explain your final-year engineering project: Problem, Technology Stack, Your Contribution, and Impact.",
        sampleResponse: "Our project addressed the problem of rural agricultural cold storage wastage using IoT telemetry and predictive temperature forecasting...",
        targetSkills: ["Architecture Pitch", "Ownership Highlighting", "Impact Metrics"],
        difficulty: "Placement Specialist"
      },
      {
        id: "s7-strengths-weaknesses",
        title: "Strengths and Weaknesses Strategy",
        desc: "Frame real weaknesses with genuine self-correction loops without sounding generic or defensive.",
        duration: "15 mins",
        prompt: "Answer: 'What is your greatest weakness, and how are you actively working to overcome it?'",
        sampleResponse: "Early on, I struggled with delegating tasks because I wanted to ensure code met my personal standards. I realized this created bottlenecks...",
        targetSkills: ["Authentic Self-Awareness", "Correction Systems", "Maturity"],
        difficulty: "Placement Specialist"
      },
      {
        id: "s7-salary-negotiation",
        title: "Salary & Offer Negotiation",
        desc: "Professional negotiation etiquette. Express appreciation while asserting your market value.",
        duration: "20 mins",
        prompt: "Respond professionally to an offer letter where the base CTC is lower than industry benchmark.",
        sampleResponse: "Thank you for this offer. I am genuinely excited about the role. Based on my specialized internships in distributed systems, is there flexibility on the base component?",
        targetSkills: ["Market Assertiveness", "Gratitude Balance", "Professional Boundaries"],
        difficulty: "Placement Specialist"
      }
    ]
  },
  {
    stage: 8,
    title: "Master Communicator",
    badge: "Stage 08",
    subtitle: "Advanced Mastery",
    color: "#D97706", // Amber / Gold
    lightBg: "bg-amber-50/70",
    borderCol: "border-amber-200",
    description: "The pinnacle of spoken leadership. Executive presentations, startup investor pitching, crisis management, conference keynotes, and high-stakes negotiations.",
    modules: [
      {
        id: "s8-pitch-simulation",
        title: "Startup Pitch & Investor Q&A",
        desc: "Shark Tank style pitch: Problem, Solution, Market Size, Traction, Unit Economics, and Moat.",
        duration: "25 mins",
        prompt: "Deliver a 3-minute investor pitch for a B2B SaaS startup helping tier-2 colleges automate placements.",
        sampleResponse: "India produces 1.5 million engineers annually, yet 78% of tier-2 colleges rely on manual spreadsheets for campus placement drives...",
        targetSkills: ["Unit Economics Pitch", "Traction Defense", "Investor Magnetism"],
        difficulty: "Executive Mastery"
      },
      {
        id: "s8-executive-presence",
        title: "Executive Communication & Boardroom",
        desc: "Present strategic roadmap to C-suite stakeholders with high-level summaries and data conviction.",
        duration: "25 mins",
        prompt: "Present a 2-minute strategic migration roadmap to microservices to the VP of Engineering.",
        sampleResponse: "Good morning leadership team. Our monolithic architecture has reached its throughput ceiling at forty thousand requests per minute...",
        targetSkills: ["Top-Down Communication", "Risk Mitigation", "Strategic Conviction"],
        difficulty: "Executive Mastery"
      },
      {
        id: "s8-crisis-comm",
        title: "High-Pressure Crisis Communication",
        desc: "Communicate transparently during major outages, security breaches, or public PR crises.",
        duration: "20 mins",
        prompt: "Address angry enterprise customers following an unexpected 4-hour system data outage.",
        sampleResponse: "We sincerely apologize for the system disruption this morning. We have restored all customer databases with zero data loss. Here is our technical post-mortem...",
        targetSkills: ["Accountability", "Composure Under Pressure", "Transparency"],
        difficulty: "Executive Mastery"
      },
      {
        id: "s8-conference-presentation",
        title: "Global Conference Presentation",
        desc: "Deliver academic or tech talks to large international audiences with universal clarity.",
        duration: "25 mins",
        prompt: "Introduce your research paper on 'Zero-Knowledge Proofs for Student Credentials' at an IEEE conference.",
        sampleResponse: "Imagine a world where a candidate can mathematically prove their university GPA without revealing their transcript or personal identification...",
        targetSkills: ["Academic Rigor", "Global Intelligibility", "Inspiring Delivery"],
        difficulty: "Executive Mastery"
      }
    ]
  }
];

// ─── 2. Communication Development Index (CDI) 10 Transparent Metrics ─────────
export const CDI_METRICS = [
  { key: "fluency", label: "Fluency", desc: "Smoothness, rhythm, and uninterrupted continuity without stammering freeze.", defaultScore: 82, weight: 12 },
  { key: "pronunciation", label: "Pronunciation", desc: "Acoustic phoneme clarity and word stress (not regional accent bias).", defaultScore: 80, weight: 10 },
  { key: "grammar", label: "Grammar Accuracy", desc: "Correct tense consistency, subject-verb agreement, and prepositions.", defaultScore: 85, weight: 10 },
  { key: "vocabulary", label: "Vocabulary Range", desc: "Richness, context-appropriate phrasing, and CEFR sophistication.", defaultScore: 78, weight: 10 },
  { key: "listening", label: "Listening & Retention", desc: "Ability to comprehend spoken instructions and synthesize accurately.", defaultScore: 84, weight: 10 },
  { key: "confidence", label: "Confidence Index", desc: "Vocal assertiveness, absence of timid pitch, and relaxed posture.", defaultScore: 76, weight: 12 },
  { key: "clarity", label: "Acoustic Clarity", desc: "How effortlessly any international or domestic listener understands you.", defaultScore: 83, weight: 10 },
  { key: "organization", label: "Logical Organization", desc: "Structured flow: clear opening, supporting logic, and strong conclusion.", defaultScore: 79, weight: 10 },
  { key: "interaction", label: "Interactive Turn-Taking", desc: "Engaging the other speaker, active listening, and thoughtful responses.", defaultScore: 81, weight: 8 },
  { key: "professionalism", label: "Professionalism", desc: "Appropriate corporate etiquette, diplomacy, and workplace courtesy.", defaultScore: 86, weight: 8 }
];

export function calculateCDI(metricValues = {}) {
  let totalScore = 0;
  let totalWeight = 0;
  CDI_METRICS.forEach(m => {
    const val = metricValues[m.key] ?? m.defaultScore;
    totalScore += val * m.weight;
    totalWeight += m.weight;
  });
  return Math.round(totalScore / totalWeight);
}

// ─── 3. Six Special Practice Laboratories ─────────────────────────────────────
export const PRACTICE_LABS = [
  {
    id: "debate-arena",
    title: "Debate Arena",
    badge: "ARGUMENTS & REBUTTALS",
    icon: "Target",
    color: "#E11D48",
    bgGradient: "from-rose-500/10 to-pink-500/10",
    borderCol: "border-rose-200",
    desc: "Structured debates against an adversarial AI debater. Build point-by-point arguments, cite empirical data, and defend positions under aggressive cross-examination.",
    topics: [
      {
        topic: "Universal Basic Income: Necessary Human Safety Net or Economic Drag?",
        aiStance: "Opposition",
        userRole: "Proposer",
        rounds: 3,
        initialAiOpening: "Universal Basic Income disincentivizes productivity and triggers rapid hyperinflation. If governments print money for unconditional distribution, work ethics erode. How do you propose financing this without crashing fiscal reserves?"
      },
      {
        topic: "Remote Engineering vs. Mandatory Office Presence for Junior Developers",
        aiStance: "Advocate for Mandatory Office",
        userRole: "Advocate for Remote",
        rounds: 3,
        initialAiOpening: "Junior engineers learn through osmosis by observing senior architects across a desk. Remote setups isolate freshers and stall professional growth. Why do you believe remote work is superior for a fresh graduate?"
      },
      {
        topic: "Is Traditional 4-Year Engineering Degree Outdated in the AI Copilot Era?",
        aiStance: "Advocate for Degree (Foundations First)",
        userRole: "Advocate for Self-Directed / AI-First",
        rounds: 3,
        initialAiOpening: "AI tools write superficial code, but without 4 years of discrete mathematics, operating systems, and kernel architecture, developers cannot debug deep distributed failures. Why abandon structured university rigor?"
      },
      {
        topic: "Should AI-Generated Software Code & Art Hold Legal Copyright Protection?",
        aiStance: "Advocate for Human-Only Copyright",
        userRole: "Advocate for AI Co-Creator Rights",
        rounds: 3,
        initialAiOpening: "Copyright law was conceived exclusively to protect human emotional and intellectual investment. Granting legal authorship to probabilistic matrix multiplications devalues authentic human ingenuity. Defend your stance."
      },
      {
        topic: "High Equity Early-Stage Startups vs. High Fixed CTC at MNCs for Freshers",
        aiStance: "Advocate for Stable Tier-1 MNC CTC",
        userRole: "Advocate for Startup Equity",
        rounds: 3,
        initialAiOpening: "Over 90% of tech startups fail within 3 years, rendering equity options worthless while cost of living skyrockets. Freshers need liquid cashflow and brand pedigree first. Why risk your formative years on illiquid paper wealth?"
      }
    ]
  },
  {
    id: "speech-arena",
    title: "Speech Arena",
    badge: "VIRTUAL AUDIENCE",
    icon: "Users",
    color: "#7C3AED",
    bgGradient: "from-purple-500/10 to-indigo-500/10",
    borderCol: "border-purple-200",
    desc: "Deliver high-impact addresses before an interactive virtual audience with real-time feedback on pacing, cadence, filler words, and audience engagement.",
    scenarios: [
      {
        title: "College Tech Fest Presidential Address",
        duration: "120 seconds",
        audienceType: "1,200 Engineering Students & Faculty",
        prompt: "Welcome students from across the country to the annual technological symposium. Acknowledge visiting judges, celebrate innovation, and set an inspiring tone."
      },
      {
        title: "Alumni Meet Keynote on Innovation",
        duration: "90 seconds",
        audienceType: "Distinguished Alumni & Department HODs",
        prompt: "Address returning alumni on how current students are building AI products for social impact."
      },
      {
        title: "JAM (Just A Minute) Extempore: 'Failure as a Feature'",
        duration: "60 seconds",
        audienceType: "Recruitment Panel & Fast-Paced Evaluators",
        prompt: "Speak non-stop for 60 seconds on the topic 'Failure as a Feature, Not a Bug'. Zero pauses, maximum eloquence, and positive framing."
      },
      {
        title: "Global Hackathon Grand Finale Pitch",
        duration: "90 seconds",
        audienceType: "Silicon Valley Tech Investors & Jury",
        prompt: "Present your team's autonomous agent system in 90 seconds. Hook the judges in the first 10 seconds, demo the breakthrough, and conclude with explosive impact."
      },
      {
        title: "Farewell Address to Graduating Senior Batch",
        duration: "90 seconds",
        audienceType: "Graduating Seniors, Faculty & Juniors",
        prompt: "Deliver a heartfelt, witty, and uplifting farewell address thanking seniors for their mentorship, lab guidance, and campus legacy."
      }
    ]
  },
  {
    id: "gd-arena",
    title: "GD Arena (Group Discussion)",
    badge: "MULTI-PERSONA SIMULATOR",
    icon: "Brain",
    color: "#059669",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    borderCol: "border-emerald-200",
    desc: "Simulate corporate campus group discussions with 3 distinct AI participants: The Moderator (Prof. Raghav), The Data-Driven Peer (Ananya), and The Contrarian (Vikram).",
    participants: [
      { name: "Prof. Raghav (Moderator)", role: "Moderator", bias: "Balances speaking time and probes for structure" },
      { name: "Ananya", role: "Analytical Peer", bias: "Quotes statistics and industry case studies" },
      { name: "Vikram", role: "Contrarian Peer", bias: "Challenges assumptions and offers counter-examples" }
    ],
    sampleTopic: "Generative AI in IT: Mass Engineering Layoffs or Unprecedented Productivity Explosion?",
    topics: [
      {
        id: "gd-ai-jobs",
        title: "Generative AI in IT: Mass Engineering Layoffs or Unprecedented Productivity Explosion?",
        category: "Tech & Economy",
        difficulty: "High Yield",
        starterPrompt: "Intervene in the discussion. Acknowledge both automated repetitive code generation and the rising demand for systems architects, security reviewers, and domain AI orchestrators.",
        openingAi: "Ananya: According to Gartner, AI copilots increase developer speed by 40%. But Vikram will argue this cuts junior headcount by half. What is your stance?"
      },
      {
        id: "gd-moonlighting",
        title: "Moonlighting & Side Hustles: Developer Autonomy vs Corporate Breach of Loyalty?",
        category: "Workplace Ethics",
        difficulty: "Campus Favorite",
        starterPrompt: "Deliver a balanced argument discussing intellectual property, fatigue risk, versus personal growth and open-source contribution outside working hours.",
        openingAi: "Vikram: An engineer's after-hours time belongs to them. If deliverables are green, why should companies police side projects? Moderator: Let our candidate weigh in."
      },
      {
        id: "gd-ev-revolution",
        title: "Electric Vehicles in Developing Economies: True Environmental Savior or Grid Mirage?",
        category: "Sustainability & Industry",
        difficulty: "Analytical",
        starterPrompt: "Synthesize the trade-off between tailpipe emissions and battery mining, charging infrastructure costs, and fossil-heavy electrical grids.",
        openingAi: "Ananya: EV penetration reached 6% last quarter. But our coal dependence remains at 70%. Does transitioning vehicle fleets actually reduce carbon emissions?"
      },
      {
        id: "gd-exams-vs-code",
        title: "Should Universities Replace 3-Hour Rote Exams with Verifiable GitHub Portfolios?",
        category: "Education Reform",
        difficulty: "Trending",
        starterPrompt: "Propose how practical problem-solving, open-source pull requests, and peer reviews offer superior assessment signals over memorized theoretical answers.",
        openingAi: "Prof. Raghav: Theory ensures fundamentals like memory management and complexity notation. Can open-source PRs completely replace standardized theoretical examination?"
      },
      {
        id: "gd-social-media",
        title: "Social Media Algorithms: Digital Democratization vs Mental Health & Attention Crisis?",
        category: "Society & Ethics",
        difficulty: "Humanities & Tech",
        starterPrompt: "Frame the conversation around engagement-driven algorithmic amplification, cognitive fragmentation among students, and digital well-being guardrails.",
        openingAi: "Vikram: Social algorithms simply serve what humans desire. If users scroll for 5 hours, that is consumer choice, not algorithmic coercion."
      },
      {
        id: "gd-wfo-mandates",
        title: "Mandatory 70-Hour Work Weeks & In-Office Mandates: Key to Growth or Burnout Catalyst?",
        category: "Corporate Culture",
        difficulty: "Hot Debate",
        starterPrompt: "Articulate how sustainable productivity, psychological safety, and smart execution outshine brute-force hours in high-cognitive software engineering.",
        openingAi: "Ananya: Fast-growing startups frequently clock 60+ hour sprints to beat competitors. Is raw work duration essential for young engineers to build domain mastery?"
      }
    ]
  },
  {
    id: "corporate-arena",
    title: "Corporate Arena",
    badge: "WORKPLACE SIMULATION",
    icon: "Briefcase",
    color: "#2563EB",
    bgGradient: "from-blue-500/10 to-sky-500/10",
    borderCol: "border-blue-200",
    desc: "Practice executive standups, sprint retrospectives, client status negotiations, and high-pressure engineering incident debriefs with demanding corporate personas.",
    scenarios: [
      {
        title: "Sprint Retrospective: Unplanned Outage Post-Mortem",
        stakeholder: "Engineering Director",
        prompt: "Explain why our database migration failed during yesterday's maintenance window and walk through the 3 preventative guardrails enacted."
      },
      {
        title: "Client Scope Creep Negotiation",
        stakeholder: "US Corporate Client (Product Owner)",
        prompt: "Politely push back on new feature requests submitted 48 hours before milestone delivery without damaging client trust."
      },
      {
        title: "Disagreeing with Tech Lead: Microservices vs Modular Monolith",
        stakeholder: "Principal Architect",
        prompt: "Present a respectful, data-backed argument explaining why an early-stage service should begin as a clean modular monolith before premature microservice sharding."
      },
      {
        title: "Annual Salary Appraisal & Impact Demonstration",
        stakeholder: "Engineering Manager (VP of Engineering)",
        prompt: "Articulate your accomplishments over the past sprint cycle, tying your automated test suites and bug fixes directly to reduced server costs and team velocity."
      },
      {
        title: "Critical Bug Reported by Enterprise Client During Live Demo",
        stakeholder: "Chief Commercial Officer",
        prompt: "A null pointer exception crashed the live product demo in front of 50 enterprise buyers. Keep your composure, acknowledge smoothly, and restore executive confidence."
      }
    ]
  },
  {
    id: "pitch-arena",
    title: "Pitch Arena",
    badge: "STARTUP & INVESTOR",
    icon: "Flame",
    color: "#D97706",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    borderCol: "border-amber-200",
    desc: "Shark Tank startup simulation. Pitch your innovative product to skeptical venture capitalist AI investors who drill into unit economics, customer acquisition costs, and defensible moats.",
    investorPersonas: [
      { name: "Siddharth (Fintech VC)", focus: "CAC, LTV, Unit Economics, Burn Rate" },
      { name: "Meera (DeepTech Angel)", focus: "Patent moat, Technical architecture, Retention" }
    ],
    pitchPrompt: "Pitch your startup in 2 minutes. State your hook, customer pain, product solution, early traction, and funding ask."
  },
  {
    id: "conversation-arena",
    title: "Conversation Arena",
    badge: "NATURAL SPONTANEOUS AI",
    icon: "MessageCircle",
    color: "#4F46E5",
    bgGradient: "from-indigo-500/10 to-blue-500/10",
    borderCol: "border-indigo-200",
    desc: "Spontaneous, natural conversation with an adaptive AI friend. Talk about your day, travel dreams, technology, favorite books, or philosophy without judgment.",
    modes: ["Casual Coffee Chat", "Mentor Life Coaching", "Creative Brainstorming"]
  }
];

// ─── 4. Telugu-to-English Bridge Drill Items ──────────────────────────────────
export const TELUGU_BRIDGE_DRILLS = [
  {
    id: "tb-1",
    telugu: "నేను ప్రతిరోజూ ఉదయం ఆరు గంటలకు నిద్రలేస్తాను.",
    transliteration: "Nenu pratiroju udayam aaru gantalu nidralestanu.",
    literalWrong: "I daily morning six o'clock waking up.",
    correctEnglish: "I wake up at six o'clock every morning.",
    grammarKey: "Habitual Present Tense (wake up, not waking up)"
  },
  {
    id: "tb-2",
    telugu: "నాకు ఈ ప్రాజెక్ట్ చాలా నచ్చింది, కానీ సమయం సరిపోలేదు.",
    transliteration: "Naaku ee project chaala nachindi, kaani samayam saripoledhu.",
    literalWrong: "For me this project very liked, but time not sufficient.",
    correctEnglish: "I really liked this project, but I ran out of time.",
    grammarKey: "Direct Subject 'I', idiom 'ran out of time'"
  },
  {
    id: "tb-3",
    telugu: "మీరు రేపు ల్యాబ్‌కి వస్తున్నారా లేదా?",
    transliteration: "Meeru repu lab ki vastunnara leda?",
    literalWrong: "You tomorrow lab coming or not?",
    correctEnglish: "Are you coming to the lab tomorrow?",
    grammarKey: "Inversion of Auxiliary 'Are you' for polite questions"
  },
  {
    id: "tb-4",
    telugu: "నాకు కొంచెం సహాయం కావాలి.",
    transliteration: "Naaku konchem sahayam kaavali.",
    literalWrong: "To me some help wanted.",
    correctEnglish: "Could you please help me for a moment?",
    grammarKey: "Polite modal request 'Could you please...'"
  }
];

// ─── 5. Vocabulary Vault (Saved Active Words) ────────────────────────────────
export const DEFAULT_VOCABULARY_VAULT = [
  {
    id: "v-1",
    word: "Articulate",
    phonetic: "/ɑːˈtɪk.jə.lət/",
    pos: "Verb / Adjective",
    meaning: "To express an idea fluently and coherently in spoken words.",
    sampleSentence: "During her interview, she was able to articulate her project architecture with great clarity.",
    synonyms: ["Expressive", "Fluent", "Coherent"],
    stageRelevance: "Stage 03"
  },
  {
    id: "v-2",
    word: "Spontaneous",
    phonetic: "/spɒnˈteɪ.ni.əs/",
    pos: "Adjective",
    meaning: "Performed or occurring naturally without premeditation or rehearsal.",
    sampleSentence: "His spontaneous response to the unexpected technical question impressed the recruiter.",
    synonyms: ["Impromptu", "Unplanned", "Natural"],
    stageRelevance: "Stage 04"
  },
  {
    id: "v-3",
    word: "Equivocate",
    phonetic: "/ɪˈkwɪv.ə.keɪt/",
    pos: "Verb",
    meaning: "Use ambiguous language so as to conceal the truth or avoid committing oneself.",
    sampleSentence: "When asked about the project delivery date, the team lead did not equivocate and gave a direct answer.",
    synonyms: ["Hedge", "Prevaricate", "Vacillate"],
    stageRelevance: "Stage 06"
  },
  {
    id: "v-4",
    word: "Concur",
    phonetic: "/kənˈkɜːr/",
    pos: "Verb",
    meaning: "To be of the same opinion; to agree in a discussion.",
    sampleSentence: "I concur with your observation regarding database latency.",
    synonyms: ["Agree", "Accord", "Endorse"],
    stageRelevance: "Stage 05"
  }
];

// ─── 6. Mistake Memory (Tracking Recurring Learning Errors) ───────────────────
export const DEFAULT_MISTAKE_MEMORY = [
  {
    id: "m-1",
    errorType: "Subject-Verb Agreement",
    userPhrase: "He don't know the answer.",
    correctedPhrase: "He doesn't know the answer.",
    explanation: "Third-person singular subjects (he/she/it) require 'doesn't' (does not) in standard English.",
    frequency: 3,
    status: "Needs Practice"
  },
  {
    id: "m-2",
    errorType: "Redundant Prepositions",
    userPhrase: "I will revert back to you soon.",
    correctedPhrase: "I will reply to you soon (or revert to you).",
    explanation: "'Revert' already contains the meaning of returning or turning back; adding 'back' is redundant.",
    frequency: 5,
    status: "Reviewing"
  },
  {
    id: "m-3",
    errorType: "Filler Word Overuse",
    userPhrase: "Actually, basically, we used like MongoDB.",
    correctedPhrase: "We used MongoDB for flexible document storage.",
    explanation: "Opening sentences with 'actually' or 'basically' weakens authority. Replace with a 1-second pause.",
    frequency: 8,
    status: "Active Drill"
  }
];

// ─── 7. Daily Mission System ──────────────────────────────────────────────────
export const DAILY_MISSIONS = [
  {
    id: "mission-1",
    title: "No-Hesitation 60s Sprint",
    target: "Speak 60 seconds continuously on a random topic with < 2 filler words.",
    rewardXp: 50,
    completed: true,
    actionTab: "arenas",
    arenaId: "debate-arena"
  },
  {
    id: "mission-2",
    title: "Telugu-to-English Conversion",
    target: "Translate 2 complex thoughts into natural English without translating word-for-word.",
    rewardXp: 40,
    completed: false,
    actionTab: "learning-path",
    stageId: 1
  },
  {
    id: "mission-3",
    title: "Technical STAR Story",
    target: "Explain one technical obstacle you resolved using the Situation-Task-Action-Result format.",
    rewardXp: 60,
    completed: false,
    actionTab: "interview-prep"
  }
];

// ─── 8. Diagnostic & Audio Utilities ──────────────────────────────────────────
export function analyzeFillerWords(text = '') {
  if (!text) return { totalFillers: 0, countMap: {}, fillerRatio: 0 };
  const fillers = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'so', 'right', 'i mean', 'sort of'];
  const lower = text.toLowerCase();
  let totalFillers = 0;
  const countMap = {};

  fillers.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      countMap[filler] = matches.length;
      totalFillers += matches.length;
    }
  });

  const totalWords = text.trim().split(/\s+/).filter(Boolean).length;
  const fillerRatio = totalWords > 0 ? Math.round((totalFillers / totalWords) * 100) : 0;

  return { totalFillers, countMap, fillerRatio };
}

export function calculateWpm(wordCount, durationSeconds) {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  return Math.round((wordCount / durationSeconds) * 60);
}

export function classifyWpm(wpm) {
  if (wpm < 100) return { label: 'Deliberate / Hesitant', color: 'text-amber-600', advice: 'Try to connect your phrases more smoothly to reach 120-140 WPM.' };
  if (wpm <= 155) return { label: 'Optimal Conversational Flow', color: 'text-emerald-600', advice: 'Excellent pacing! International listeners easily process this speed.' };
  return { label: 'Rapid / Rushed', color: 'text-purple-600', advice: 'Slightly slow down and add pauses for dramatic clarity.' };
}

export function diagnoseCommunicationWeakness(metrics = {}) {
  const scores = [
    { key: 'fluency', score: metrics.fluencyScore ?? 75, name: 'Speech Continuity & Flow', stage: 4 },
    { key: 'pronunciation', score: metrics.pronunciationScore ?? 78, name: 'Phonetic Articulation', stage: 1 },
    { key: 'grammar', score: metrics.grammarScore ?? 80, name: 'Tense & Agreement Consistency', stage: 1 },
    { key: 'confidence', score: metrics.confidenceProgress ?? 70, name: 'Hesitation Reduction & Projection', stage: 4 },
    { key: 'vocabulary', score: metrics.vocabScore ?? 72, name: 'CEFR Word Range & Expressions', stage: 3 }
  ];

  scores.sort((a, b) => a.score - b.score);
  return scores[0];
}

// ─── 9. The 10 Unique Differentiator Features ─────────────────────────────────
export const SPEAKVERSE_DIFFERENTIATORS = [
  {
    id: "think-in-english",
    name: "Think in English",
    iconName: "Brain",
    tag: "COGNITIVE SPEED",
    shortDesc: "Trains students to form thoughts directly in English without native-language mental translation.",
    howItWorks: "Bypasses internal translation by pairing visual prompts with rapid 3-second speaking triggers."
  },
  {
    id: "no-hesitation",
    name: "No-Hesitation Challenge",
    iconName: "Flame",
    tag: "CONFIDENCE",
    shortDesc: "Builds unshakeable speaking confidence through timed, continuous spoken drills.",
    howItWorks: "Real-time speech timer penalizes pauses > 2 seconds, training unbroken flow."
  },
  {
    id: "random-topic",
    name: "Random Topic Generator",
    iconName: "Shuffle",
    tag: "SPONTANEITY",
    shortDesc: "Provides unexpected, unconventional speaking topics for impromptu readiness.",
    howItWorks: "Spins abstract, technical, and philosophical prompts to prepare students for extempore rounds."
  },
  {
    id: "roleplay",
    name: "Real-Life Roleplay",
    iconName: "Users",
    tag: "IMMERSION",
    shortDesc: "Simulates everyday situations like hostel check-ins, cafe orders, and library requests.",
    howItWorks: "Adaptive dialogue tree where AI responds organically to student spoken choices."
  },
  {
    id: "debate-battle",
    name: "Debate Battle",
    iconName: "Swords",
    tag: "CRITICAL THINKING",
    shortDesc: "Develops sharp arguments, point-by-point rebuttals, and logical conviction.",
    howItWorks: "AI takes an opposing stance and presents counter-arguments that you must refute."
  },
  {
    id: "explain-anything",
    name: "Explain Anything",
    iconName: "Sparkles",
    tag: "FEYNMAN METHOD",
    shortDesc: "Students explain complex engineering concepts in their own simple, elegant words.",
    howItWorks: "Evaluates clarity, jargon avoidance, and intuitive metaphors."
  },
  {
    id: "accent-clarity",
    name: "Accent & Clarity Lab",
    iconName: "Volume2",
    tag: "PHONETICS",
    shortDesc: "Helps soften Mother Tongue Influence (MTI) and master global English phonemes.",
    howItWorks: "Minimal-pair discrimination drills with real-time waveform visualizers."
  },
  {
    id: "filler-detector",
    name: "Filler Word Detector",
    iconName: "AlertTriangle",
    tag: "PRECISION",
    shortDesc: "Identifies and counts unnecessary crutch words like 'um', 'like', and 'actually'.",
    howItWorks: "Transcribes audio and highlights filler ratios, coaching silent pause replacements."
  },
  {
    id: "vocab-action",
    name: "Vocabulary in Action",
    iconName: "BookOpen",
    tag: "PRACTICAL USAGE",
    shortDesc: "Teaches high-impact CEFR vocabulary through contextual spoken application.",
    howItWorks: "Prompts you to incorporate target advanced words into natural conversational answers."
  },
  {
    id: "daily-streak",
    name: "Daily Speaking Streak",
    iconName: "Flame",
    tag: "HABITUATION",
    shortDesc: "Encourages consistent daily practice through gamified XP and milestone badges.",
    howItWorks: "Tracks consecutive days of at least 5 minutes of verified spoken dialogue."
  }
];

// ─── 10. Pronunciation Minimal Pair Phonetic Drills ───────────────────────────
export const PRONUNCIATION_DRILLS = [
  {
    id: "pair-v-w",
    category: "Labiodental vs Bilabial",
    pair: ["Vine", "Wine"],
    phonetic: ["/vaɪn/", "/waɪn/"],
    tip: "For /v/, touch upper teeth to lower lip. For /w/, round both lips into an 'O' shape without touching teeth.",
    drillSentence: "Victor walked very willingly while viewing the wild vines."
  },
  {
    id: "pair-p-f",
    category: "Bilabial Plosive vs Fricative",
    pair: ["Pin", "Fin"],
    phonetic: ["/pɪn/", "/fɪn/"],
    tip: "For /p/, pop both lips open with air. For /f/, gently rest upper teeth on lower lip and blow continuous air.",
    drillSentence: "Peter found fifteen perfect pins for the presentation."
  },
  {
    id: "pair-s-sh",
    category: "Alveolar vs Postalveolar",
    pair: ["Seat", "Sheet"],
    phonetic: ["/siːt/", "/ʃiːt/"],
    tip: "For /s/, smile slightly with tongue tip near teeth. For /ʃ/ ('sh'), push lips out and curve tongue slightly back.",
    drillSentence: "She showed sixty sharp sheets of steel at the summit."
  },
  {
    id: "pair-b-v",
    category: "Plosive vs Fricative",
    pair: ["Berry", "Very"],
    phonetic: ["/ˈber.i/", "/ˈver.i/"],
    tip: "For /b/, close both lips completely before releasing. For /v/, never close both lips; rest upper teeth on lower lip.",
    drillSentence: "The vibrant blue berry was very sweet and beneficial."
  },
  {
    id: "pair-th-t",
    category: "Dental Fricative vs Plosive",
    pair: ["Think", "Tink"],
    phonetic: ["/θɪŋk/", "/tɪŋk/"],
    tip: "For /θ/ ('th'), slip the tip of your tongue slightly between your upper and lower teeth.",
    drillSentence: "Three thoughtful thinkers thanked the thorough teacher."
  },
  {
    id: "pair-l-r",
    category: "Lateral vs Approximant",
    pair: ["Lead", "Read"],
    phonetic: ["/liːd/", "/riːd/"],
    tip: "For /l/, press tongue tip firmly against alveolar ridge behind front teeth. For /r/, curl tongue back without touching.",
    drillSentence: "Real leaders rarely let rapid rumours ruin reliability."
  }
];

// ─── 8. Immersive Simulation Environments ────────────────────────────────────
export const SPEAKVERSE_ENVIRONMENTS = [
  {
    id: "classroom",
    name: "Seminar Hall",
    badge: "ACADEMIC",
    iconName: "GraduationCap",
    tagline: "Academic presentations, viva-voce defenses, and student symposium lectures.",
    scenarios: [
      {
        id: "seminar-defense",
        title: "Major Project Synopsis Defense",
        context: "You are standing before the Department Review Committee presenting your distributed database architecture proposal.",
        objective: "Explain the technical trade-offs of Cassandra versus PostgreSQL in 90 seconds clearly.",
        rubric: ["Clear Academic Terminology", "Confidence Under Interrogation", "Zero Filler Words"]
      },
      {
        id: "seminar-qa",
        title: "Challenging Faculty Inquiry",
        context: "A professor challenges your choice of consensus algorithm, asking why Raft was chosen over Paxos.",
        objective: "Defend your design decision respectfully with concrete implementation trade-offs.",
        rubric: ["Respectful Tone", "Technical Precision", "Concise Justification"]
      }
    ]
  },
  {
    id: "gd",
    name: "GD Arena",
    badge: "CAMPUS DRIVE",
    iconName: "Users",
    tagline: "High-stakes campus recruitment group discussions with aggressive interjections.",
    scenarios: [
      {
        id: "gd-opening",
        title: "Topic Initiation & Framing",
        context: "The placement evaluator announces: 'Digital Currency: Sovereignty vs Decentralization'. 8 candidates hesitate.",
        objective: "Seize the initiative by defining scope, historical context, and steering the debate.",
        rubric: ["Authoritative Opening", "Balanced Framing", "Inviting Collaborative Discourse"]
      },
      {
        id: "gd-interjection",
        title: "Polite Intervention in Cross-Talk",
        context: "Two peers are passionately talking over each other. The discussion has stalled.",
        objective: "Intervene gracefully: 'If I may bring our focus back to fiscal policy...' and present your point.",
        rubric: ["Acoustic Volume Modulation", "Firm Politeness", "Value-Add Synthesis"]
      }
    ]
  },
  {
    id: "tech-interview",
    name: "Tech Room",
    badge: "TECHNICAL",
    iconName: "Briefcase",
    tagline: "1-on-1 engineering interviews, system design thinking, and algorithmic explanation.",
    scenarios: [
      {
        id: "tech-complexity",
        title: "Thinking Aloud During Dynamic Programming",
        context: "Interviewer asks you to optimize an exponential recursion problem to polynomial time.",
        objective: "Explain state definition, memoization table dimensions, and Big-O trade-offs aloud as you solve.",
        rubric: ["Vocalized Reasoning", "State Definition Clarity", "Complexity Articulation"]
      },
      {
        id: "tech-tradeoff",
        title: "System Design: Cache Invalidation",
        context: "Discussing write-through versus write-back caching for high-throughput payment gateways.",
        objective: "Articulate cache staleness risks, atomicity guarantees, and failover fallbacks.",
        rubric: ["Architectural Depth", "Zero Stammering", "Executive Delivery"]
      }
    ]
  },
  {
    id: "boardroom",
    name: "Boardroom",
    badge: "CORPORATE",
    iconName: "Building2",
    tagline: "Executive meetings, client sprint sign-offs, and enterprise budget approvals.",
    scenarios: [
      {
        id: "board-scope",
        title: "Client Scope Creep Pushback",
        context: "Enterprise client requests major auth refactoring 48 hours before scheduled sprint release.",
        objective: "Diplomatically explain capacity constraints and negotiate a phased delivery schedule.",
        rubric: ["Corporate Diplomacy", "Boundaries Without Conflict", "Win-Win Compromise"]
      },
      {
        id: "board-appraisal",
        title: "Annual Value Impact Demonstration",
        context: "Executive panel reviewing your promotion case from Junior to Systems Lead.",
        objective: "Quantify your impact on CI/CD latency, server cost reductions, and junior onboarding velocity.",
        rubric: ["Metric-Driven Narrative", "Leadership Bearing", "Executive Cadence"]
      }
    ]
  },
  {
    id: "keynote",
    name: "Keynote",
    badge: "PODIUM",
    iconName: "Mic",
    tagline: "Keynotes, developer conference talks, and campus convocation addresses.",
    scenarios: [
      {
        id: "keynote-open",
        title: "DevFest Opening Keynote",
        context: "Speaking to 400 engineering students on 'The Next Decade of Agentic AI Infrastructure'.",
        objective: "Deliver a compelling 2-minute introductory hook that captures attention instantly.",
        rubric: ["Vocal Variety & Projection", "Engaging Hook", "Authentic Energy"]
      }
    ]
  },
  {
    id: "standup",
    name: "Agile Standup",
    badge: "DAILY SYNC",
    iconName: "MessageCircle",
    tagline: "Crisp 60-second scrum updates: yesterday's wins, today's targets, and blockers.",
    scenarios: [
      {
        id: "scrum-blocker",
        title: "Critical Blocker Articulation",
        context: "Third-party payment gateway sandbox is throwing 401s, blocking your auth integration.",
        objective: "Clearly state impact, dependency, and the specific assistance needed from devops.",
        rubric: ["Crisp Brevity (<60s)", "Actionable Dependency", "Zero Fluff"]
      }
    ]
  },
  {
    id: "crisis",
    name: "Incident War Room",
    badge: "P0 CRISIS",
    iconName: "ShieldAlert",
    tagline: "Live production outages, security vulnerabilities, and C-suite status communications.",
    scenarios: [
      {
        id: "crisis-status",
        title: "P0 Outage Executive Briefing",
        context: "Payment database is experiencing deadlocks during peak flash sale. CEO joins the bridge.",
        objective: "Calmly brief executive leadership on root cause, blast radius, rollback status, and ETA.",
        rubric: ["Absolute Calm Under Pressure", "Root Cause Articulation", "Reassurance"]
      }
    ]
  },
  {
    id: "sharktank",
    name: "Pitch Stage",
    badge: "SHARK TANK",
    iconName: "Rocket",
    tagline: "Demo Day investor pitching: Problem, Solution, Traction, TAM, and Ask.",
    scenarios: [
      {
        id: "shark-traction",
        title: "Seed Round 90-Second Pitch",
        context: "Facing 2 Tier-1 venture angels evaluating your campus career navigation platform.",
        objective: "Pitch customer pain, product moat, active MRR growth, and unit economics with conviction.",
        rubric: ["Investor Magnetism", "Defensible Moat", "Confidence in Metrics"]
      }
    ]
  }
];
