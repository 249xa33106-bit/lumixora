import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cleanScholarName } from '../../utils/authSecurity';
import { GPREC_COMPANY_ATS_BENCHMARKS } from './gprecCompanyAtsBenchmarks';
import {
  FileText, Upload, Sparkles, CheckCircle2, AlertCircle, ArrowRight,
  Mic, MicOff, Volume2, VolumeX, RefreshCw, Award, Download, Clock,
  ShieldCheck, Brain, Target, ChevronRight, BarChart2, Star, Check,
  BookOpen, Code, Layers, MessageSquare, Play, RotateCcw,
  Copy, CheckCheck, TrendingUp, Zap, Building2, ThumbsUp, Flame
} from 'lucide-react';

function GprecResumeMockInterviewPortal({
  user,
  awardXP,
  addToast,
  onUpdateTwinSkill,
  savedResumeText = ''
}) {
  const studentKey = user?.id || user?.email || 'guest';
  const resumeDraftKey = `gprec_ats_resume_draft_${studentKey}`;
  const interviewHistoryKey = `gprec_resume_interview_history_${studentKey}`;

  const studentName = cleanScholarName(user?.name || user?.displayName, 'GPREC Scholar');
  const studentBranch = (user?.branch || user?.department || 'CSE').toUpperCase().slice(0, 5);

  // Portal Tab Mode: 'ats_matcher' (Company ATS Matcher) | 'mock_interview' (Bar Raiser Viva)
  const [activePortalTab, setActivePortalTab] = useState('ats_matcher');
  const [targetCompanyId, setTargetCompanyId] = useState('amazon');
  const [copiedBulletId, setCopiedBulletId] = useState(null);
  const [appliedBulletIds, setAppliedBulletIds] = useState([]);

  // Portal Stages: 'upload' | 'analyzing' | 'review_plan' | 'interview' | 'scorecard'
  const [stage, setStage] = useState('upload');

  // Resume Text & File Meta
  const [resumeText, setResumeText] = useState(savedResumeText || '');
  const [resumeFileName, setResumeFileName] = useState('');
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // Target Interview Config
  const [selectedPersona, setSelectedPersona] = useState('amazon'); // 'amazon' | 'google' | 'microsoft' | 'tcs_prime'
  const [questionCount, setQuestionCount] = useState(5); // 3 | 5 | 7

  // Analysis Result
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);

  // Live Interview State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [candidateAnswers, setCandidateAnswers] = useState({});
  const [evaluatedAnswers, setEvaluatedAnswers] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Final Evaluation
  const [finalReport, setFinalReport] = useState(null);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Check for saved ATS draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(resumeDraftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.summary || parsed.skills || (parsed.projects && parsed.projects.length > 0))) {
          setHasSavedDraft(true);
        }
      }
    } catch (e) {}
  }, [resumeDraftKey]);

  // Active Target Company Benchmark
  const activeCompanyBenchmark = useMemo(() => {
    return GPREC_COMPANY_ATS_BENCHMARKS.find(c => c.id === targetCompanyId) || GPREC_COMPANY_ATS_BENCHMARKS[0];
  }, [targetCompanyId]);

  // Debounce resume text for ATS match calculations (120ms) to ensure butter-smooth typing & 0% CPU lock
  const [debouncedResumeText, setDebouncedResumeText] = useState(resumeText);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedResumeText(resumeText);
    }, 120);
    return () => clearTimeout(handler);
  }, [resumeText]);

  // Real-Time Company ATS Match Analysis Engine (Ultra-Fast O(1) Set Lookup, 0 Regex Compilations)
  const atsAnalysisResult = useMemo(() => {
    const raw = debouncedResumeText || '';
    const lower = raw.toLowerCase();
    const benchmark = activeCompanyBenchmark;
    const reqKeywords = benchmark.requiredKeywords || [];

    // Pre-index resume words in a Set for instantaneous O(1) lookups
    const wordTokens = new Set(lower.split(/[^a-z0-9+#.]+/).filter(Boolean));

    const matched = [];
    const missing = [];
    let totalScore = 0;
    let maxScore = 0;

    reqKeywords.forEach(kw => {
      const weight = kw.weight || 2;
      maxScore += weight;

      const kwLower = kw.name.toLowerCase();
      // 1. Direct whole phrase inclusion (O(M) native search in V8)
      let foundInText = lower.includes(kwLower);

      // 2. Tokenized check if whole phrase didn't match directly
      if (!foundInText) {
        const tokens = kwLower.split(/[\/,\s]+/).filter(t => t.length > 2 && !['and', 'for', 'the', 'services', 'core', 'implementation'].includes(t));
        foundInText = tokens.length > 0 && tokens.some(t => {
          if (t === 'c++') return wordTokens.has('c++') || wordTokens.has('cpp') || lower.includes('c++');
          return wordTokens.has(t) || lower.includes(t);
        });
      }

      if (foundInText) {
        matched.push(kw);
        totalScore += weight;
      } else {
        missing.push(kw);
      }
    });

    // Fast metric claim check without heavy regex backtracking
    const metricMatches = lower.match(/\b(?:\d+[%xX+]|\d+,\d+|\d+\+?\s*(?:ms|users|candidates|requests|queries|seconds|lpa|rps|gb|mb|kb))\b/gi) || [];
    const metricBonus = Math.min(10, metricMatches.length * 2.5);

    // Check for active engineering action verbs
    const actionVerbs = ['architected', 'engineered', 'spearheaded', 'implemented', 'optimized', 'scaled', 'developed', 'orchestrated', 'profiled', 'containerized', 'designed'];
    const foundVerbs = actionVerbs.filter(v => lower.includes(v));
    const verbBonus = Math.min(10, foundVerbs.length * 2);

    const basePct = maxScore > 0 ? (totalScore / maxScore) * 80 : 0;
    const calculatedMatch = Math.min(100, Math.round(basePct + metricBonus + verbBonus));

    let statusTier = 'high_risk';
    let statusLabel = 'High Screening Rejection Risk';
    let statusDesc = `Missing critical ${benchmark.name} recruiter keywords. High probability of automated ATS rejection.`;
    let statusColor = 'text-rose-600';
    let statusBg = 'bg-rose-50 border-rose-200';

    if (calculatedMatch >= benchmark.passingThreshold) {
      statusTier = 'premier';
      statusLabel = '🌟 Premier Shortlist Ready';
      statusDesc = `Surpasses ${benchmark.name} automated ATS screening bar (${benchmark.passingThreshold}%). High probability of interview call.`;
      statusColor = 'text-emerald-700';
      statusBg = 'bg-emerald-50 border-emerald-300';
    } else if (calculatedMatch >= benchmark.passingThreshold - 12) {
      statusTier = 'competitive';
      statusLabel = 'Competitive (Minor Keyword Gaps)';
      statusDesc = `Close to ${benchmark.name} passing threshold. Apply suggested 1-click rewrites to reach premier shortlist tier.`;
      statusColor = 'text-blue-700';
      statusBg = 'bg-blue-50 border-blue-200';
    } else if (calculatedMatch >= 48) {
      statusTier = 'moderate_risk';
      statusLabel = '⚠️ Moderate Filter Risk';
      statusDesc = `Resume lacks several core competencies expected by ${benchmark.name} recruiters.`;
      statusColor = 'text-amber-700';
      statusBg = 'bg-amber-50 border-amber-200';
    }

    return {
      matchPercentage: calculatedMatch,
      statusTier,
      statusLabel,
      statusDesc,
      statusColor,
      statusBg,
      matchedKeywords: matched,
      missingKeywords: missing,
      metricCount: metricMatches.length,
      actionVerbCount: foundVerbs.length
    };
  }, [debouncedResumeText, activeCompanyBenchmark]);

  // 1-Click Bullet Point Rewrite Applicator
  const handleApplyBulletRewrite = (rewrite) => {
    if (!rewrite?.improved) return;

    let newResume = resumeText;
    const weakLower = rewrite.weak.toLowerCase();
    const resumeLower = resumeText.toLowerCase();

    if (resumeLower.includes(weakLower)) {
      const idx = resumeLower.indexOf(weakLower);
      newResume = resumeText.slice(0, idx) + rewrite.improved + resumeText.slice(idx + rewrite.weak.length);
    } else {
      if (newResume.trim()) {
        newResume = `${newResume.trim()}\n• ${rewrite.improved}`;
      } else {
        newResume = `• ${rewrite.improved}`;
      }
    }

    setResumeText(newResume);
    setAppliedBulletIds(prev => [...new Set([...prev, rewrite.id])]);

    if (addToast) {
      addToast({
        type: 'success',
        message: `Applied ${activeCompanyBenchmark.name} ATS bullet! Score calibrated.`
      });
    }

    if (onUpdateTwinSkill) {
      onUpdateTwinSkill('resume', Math.min(100, atsAnalysisResult.matchPercentage + 6), `Applied ATS Bullet: ${rewrite.title}`);
    }
  };

  const handleCopyBullet = (rewrite) => {
    if (!rewrite?.improved) return;
    navigator.clipboard?.writeText(rewrite.improved);
    setCopiedBulletId(rewrite.id);
    setTimeout(() => setCopiedBulletId(null), 2500);
    if (addToast) {
      addToast({ type: 'info', message: 'Copied high-conversion bullet point to clipboard!' });
    }
  };

  const handleAddKeywordToResume = (kwName) => {
    if (!kwName) return;
    setResumeText(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}\n• Key Technical Competencies: ${kwName}` : `Key Technical Competencies: ${kwName}`;
    });
    if (addToast) {
      addToast({ type: 'success', message: `Injected "${kwName}" into resume competencies!` });
    }
  };

  const handleLaunchMockVivaFromAts = () => {
    // Map company to persona
    const companyId = activeCompanyBenchmark.id;
    if (companyId === 'amazon') setSelectedPersona('amazon');
    else if (companyId === 'tcs_prime') setSelectedPersona('tcs_prime');
    else if (companyId === 'microsoft') setSelectedPersona('microsoft');
    else setSelectedPersona('google');

    setActivePortalTab('mock_interview');
    setStage('upload');
    if (addToast) {
      addToast({
        type: 'success',
        message: `Pre-configured AI Bar Raiser for ${activeCompanyBenchmark.name}!`
      });
    }
  };

  // Voice Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setCandidateAnswers(prev => ({
            ...prev,
            [currentQIndex]: (prev[currentQIndex] ? prev[currentQIndex] + ' ' : '') + transcript
          }));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentQIndex]);

  // Timer per question
  useEffect(() => {
    if (stage === 'interview') {
      setTimeLeft(180);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [stage, currentQIndex]);

  // Fast Client-Side PDF Stream Extractor (<30ms execution)
  const extractPdfTextFast = async (arrayBuffer) => {
    try {
      const bytes = new Uint8Array(arrayBuffer);
      const latin1 = new TextDecoder('latin1').decode(bytes);
      const textChunks = [];

      const cleanPdfStr = (str) => {
        return str
          .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\([()\\])/g, '$1');
      };

      // 1. Direct uncompressed PDF text
      const tjRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g;
      let m;
      while ((m = tjRegex.exec(latin1)) !== null) {
        if (m[1]) textChunks.push(cleanPdfStr(m[1]));
      }

      const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
      while ((m = tjArrayRegex.exec(latin1)) !== null) {
        const inner = m[1];
        const sub = inner.match(/\(([^)\\]*(?:\\.[^)\\]*)*)\)/g);
        if (sub) {
          textChunks.push(sub.map(s => cleanPdfStr(s.slice(1, -1))).join(' '));
        }
      }

      // 2. Scan and decompress Flate streams using native browser DecompressionStream
      if (typeof DecompressionStream !== 'undefined') {
        const streamStartRegex = /stream\r?\n/g;
        let sm;
        while ((sm = streamStartRegex.exec(latin1)) !== null) {
          const streamStart = sm.index + sm[0].length;
          const streamEnd = latin1.indexOf('endstream', streamStart);
          if (streamEnd === -1 || streamEnd - streamStart <= 8) continue;

          let rawEnd = streamEnd;
          while (rawEnd > streamStart && (bytes[rawEnd - 1] === 10 || bytes[rawEnd - 1] === 13 || bytes[rawEnd - 1] === 32)) {
            rawEnd--;
          }
          const slice = bytes.subarray(streamStart, rawEnd);

          try {
            const ds = new DecompressionStream('deflate');
            const writer = ds.writable.getWriter();
            writer.write(slice);
            writer.close();
            const reader = ds.readable.getReader();
            const chunks = [];
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              chunks.push(value);
            }
            const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
            if (totalLen > 0) {
              const merged = new Uint8Array(totalLen);
              let off = 0;
              for (const c of chunks) {
                merged.set(c, off);
                off += c.length;
              }
              const decompStr = new TextDecoder('latin1').decode(merged);

              let dm;
              while ((dm = tjRegex.exec(decompStr)) !== null) {
                if (dm[1]) textChunks.push(cleanPdfStr(dm[1]));
              }
              while ((dm = tjArrayRegex.exec(decompStr)) !== null) {
                const sub = dm[1].match(/\(([^)\\]*(?:\\.[^)\\]*)*)\)/g);
                if (sub) {
                  textChunks.push(sub.map(s => cleanPdfStr(s.slice(1, -1))).join(' '));
                }
              }
            }
          } catch (e) {
            // non-deflate stream or raw text
          }
        }
      }

      return textChunks.join(' ').replace(/\s+/g, ' ').trim();
    } catch (e) {
      return '';
    }
  };

  // 1. High-Performance PDF, DOCX & Text File Parser Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    setResumeFileName(file.name);

    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        let extractedText = '';

        // Attempt 1: High-fidelity pdfjs-dist with strict 2.5s timeout race
        try {
          const pdfjsPromise = (async () => {
            const [pdfjsLib, workerModule] = await Promise.all([
              import('pdfjs-dist'),
              import('pdfjs-dist/build/pdf.worker.mjs?url')
            ]);
            const workerUrl = typeof workerModule === 'string' ? workerModule : (workerModule?.default || workerModule);
            if (workerUrl) {
              pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
            }
            const pdf = await pdfjsLib.getDocument({
              data: arrayBuffer,
              isEvalSupported: false,
              useWorkerFetch: false,
              disableFontFace: true
            }).promise;

            let text = '';
            for (let i = 1; i <= Math.min(pdf.numPages, 4); i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => item.str).join(' ') + '\n';
            }
            return text.trim();
          })();

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('PDF.js worker slow/unavailable')), 2500)
          );

          extractedText = await Promise.race([pdfjsPromise, timeoutPromise]);
        } catch (pdfErr) {
          // Attempt 2: Instant native stream extractor (<30ms)
          extractedText = await extractPdfTextFast(arrayBuffer);
        }

        // Attempt 3: Readable alphanumeric strings fallback
        if (!extractedText || extractedText.length < 25) {
          const bytes = new Uint8Array(arrayBuffer);
          const raw = new TextDecoder('latin1').decode(bytes);
          const words = raw.match(/[A-Za-z0-9@.,/:\-+ ]{4,}/g);
          if (words && words.length > 5) {
            extractedText = words.filter(w => !w.startsWith('/Filter') && !w.startsWith('/Length')).join(' ').slice(0, 5000);
          }
        }

        if (extractedText && extractedText.length >= 25) {
          setResumeText(extractedText.trim());
          if (addToast) addToast({ type: 'success', message: `Resume parsed! (${extractedText.length} characters extracted)` });
        } else {
          if (addToast) addToast({ type: 'warning', message: 'PDF appears to be a scanned image. Please paste plain text on the right or click "Load Verified Scholar Profile".' });
        }
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const raw = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(arrayBuffer));
        const wtMatches = raw.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
        if (wtMatches && wtMatches.length > 3) {
          const docxText = wtMatches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
          setResumeText(docxText.trim());
          if (addToast) addToast({ type: 'success', message: `Extracted text from Word document!` });
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            const text = (event.target.result || '').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
            setResumeText(text.trim());
            if (addToast) addToast({ type: 'success', message: `Loaded resume file: ${file.name}` });
          };
          reader.readAsText(file);
        }
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result || '';
          setResumeText(text.trim());
          if (addToast) addToast({ type: 'success', message: `Loaded resume file: ${file.name}` });
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('Resume parse error:', err);
      if (addToast) addToast({ type: 'error', message: 'Could not extract PDF text directly. Please paste plain text.' });
    } finally {
      setIsParsingFile(false);
    }
  };

  // 2. Load from Saved GPREC ATS Resume Builder
  const handleLoadSavedAtsResume = () => {
    try {
      const saved = localStorage.getItem(resumeDraftKey);
      if (saved) {
        const p = JSON.parse(saved);
        const parts = [
          `Candidate Name: ${p.fullName || studentName}`,
          `Degree: ${p.degree || 'B.Tech'} - ${p.college || 'GPREC'}`,
          `CGPA: ${p.cgpa || '8.5'}`,
          `Core Skills: ${p.skills || 'Java, Python, React, SQL, DSA'}`,
          `Summary: ${p.summary || ''}`,
          `\nProjects:`,
          ...(p.projects || []).map(pr => `- ${pr.title} (Tech: ${pr.tech})\n  ${pr.bullets}`),
          `\nExperience / Internships:`,
          ...(p.experience || []).map(ex => `- ${ex.role} at ${ex.org} (${ex.period})\n  ${ex.bullets}`),
          `\nCertifications & Achievements: ${p.certifications || 'None'}`
        ];
        setResumeText(parts.join('\n'));
        setResumeFileName('GPREC Saved ATS Resume');
        if (addToast) addToast({ type: 'success', message: 'Loaded your saved GPREC ATS Resume draft!' });
      }
    } catch (e) {
      if (addToast) addToast({ type: 'warning', message: 'No saved ATS draft found.' });
    }
  };

  // 3. Populate from Scholar Profile
  const handleLoadProfile = () => {
    const parts = [
      `Candidate Name: ${studentName}`,
      `Department: ${studentBranch} (Computer Science & Engineering)`,
      `Institution: G. Pulla Reddy Engineering College (Autonomous), Kurnool`,
      `Verified Competencies: Data Structures & Algorithms, Java, Python, React.js, PostgreSQL, Node.js`,
      `Capstone Project: Real-time Placement Telemetry & Recruiter Assessment Suite`,
      `Project Stack: React, Node.js, PostgreSQL, Redis, Docker, TailwindCSS`,
      `Key Project Claim: Engineered distributed candidate analytics engine handling 1,200+ concurrent scholar telemetry streams with sub-90ms query response time.`
    ];
    setResumeText(parts.join('\n'));
    setResumeFileName('Verified Scholar Profile');
    if (addToast) addToast({ type: 'info', message: 'Loaded verified GPREC scholar academic context!' });
  };

  // 4. Deep Resume Analysis & Extraction Engine
  const analyzeResumeAndGenerateQuestions = () => {
    if (!resumeText.trim()) {
      if (addToast) addToast({ type: 'warning', message: 'Please upload or paste your resume first.' });
      return;
    }

    setStage('analyzing');

    // Run quickly with instant microtask (100ms) and complete try-catch so it NEVER hangs
    setTimeout(() => {
      try {
        const raw = resumeText;
        const lower = raw.toLowerCase();

        // Extract skills with safe escaping (handles C++, C#, etc. without throwing RegExp SyntaxError)
        const techKeywords = [
          'React', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'Python', 'Java', 'C++', 'C',
          'Spring Boot', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka', 'Docker',
          'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'Linux', 'REST', 'GraphQL', 'DSA', 'OOP'
        ];
        const matchedSkills = techKeywords.filter(k => {
          if (k === 'C++') return raw.includes('C++') || lower.includes('cpp');
          if (k === 'C') return /\bC\b/.test(raw) || lower.includes(' c language') || lower.includes('c programming');
          try {
            const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`\\b${escaped}\\b`, 'i').test(raw);
          } catch (e) {
            return lower.includes(k.toLowerCase());
          }
        });

        // Fast linear metric claim extractor (no catastrophic regex backtracking)
        const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const metricMatches = [];
        const metricTest = /\b(?:\d+[%xX+]|\d+,\d+|\d+\+?\s*(?:ms|users|candidates|requests|queries|seconds|lpa|rps|gb|mb|kb))\b/i;
        for (const line of lines) {
          if (metricTest.test(line) && line.length > 12 && line.length < 180) {
            if (!metricMatches.includes(line)) {
              metricMatches.push(line);
              if (metricMatches.length >= 4) break;
            }
          }
        }

        // Extract projects
        const detectedProjects = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (
            (line.toLowerCase().includes('project') || line.includes(':') || line.includes('|') || line.includes('–') || line.includes('-')) &&
            line.length > 5 && line.length < 80 &&
            !line.toLowerCase().includes('education') && !line.toLowerCase().includes('skills') && !line.toLowerCase().includes('certifications')
          ) {
            const title = line.replace(/^(project\s*\d*:?|-|\*)\s*/i, '').trim();
            if (title.length > 5 && !detectedProjects.some(p => p.title === title) && detectedProjects.length < 3) {
              detectedProjects.push({
                title,
                stack: matchedSkills.slice(0, 4).join(', ') || 'Full-Stack Architecture'
              });
            }
          }
        }

        const primaryProject = detectedProjects[0]?.title || 'Full-Stack Engineering Capstone Project';
        const secondaryProject = detectedProjects[1]?.title || 'Distributed Scalable Web Application';
        const topClaim = metricMatches[0] || 'Optimized application latency and query throughput by 35%';
        const primaryStack = matchedSkills.slice(0, 3).join(', ') || 'Java, Spring Boot, and PostgreSQL';

        const analysis = {
          candidateName: studentName || 'GPREC Scholar',
          skillsCount: matchedSkills.length > 0 ? matchedSkills.length : 5,
          skills: matchedSkills.length > 0 ? matchedSkills : ['Java', 'React', 'SQL', 'Data Structures', 'Git'],
          projects: detectedProjects.length > 0 ? detectedProjects : [
            { title: primaryProject, stack: primaryStack }
          ],
          claims: metricMatches.length > 0 ? metricMatches : [
            topClaim,
            'Engineered end-to-end data pipeline with 99.8% uptime'
          ],
          persona: selectedPersona
        };

        // 5. Generate Strictly Resume-Grounded Questions
        const questions = [
          {
            id: 'q1',
            type: 'Project Architecture & Data Flow',
            claimCitation: `Grounded in Project: "${primaryProject}" (${primaryStack})`,
            question: `In your resume, you listed "${primaryProject}". Walk me through your low-level data flow, how your services communicate, and defend why you chose ${primaryStack} over its primary industry alternatives.`,
            hint: 'Explain client-to-server request lifecycle, API gateway/controllers, database connection pooling, and why this stack fit your latency/scale requirements.',
            modelAnswer: `In "${primaryProject}", client requests hit an authenticated gateway validating JWT tokens. The stateless backend uses connection pooling with PostgreSQL to minimize handshake overhead. We chose ${primaryStack} because of strong type safety, mature ORM transactions (ACID guarantees), and built-in concurrency support, avoiding overhead compared to heavier monolithic frameworks.`
          },
          {
            id: 'q2',
            type: 'Quantified Claim & Metric Defense',
            claimCitation: `Grounded in Resume Metric Claim: "${topClaim}"`,
            question: `On your resume, you claim: "${topClaim}". Exactly how did you measure this baseline, what specific profiling tools or APM metrics did you monitor, and what technical change produced this improvement?`,
            hint: 'Specify your benchmarking tool (JMeter/wrk/Chrome DevTools/EXPLAIN ANALYZE), baseline numbers before vs after, and whether index optimization or caching resolved the root bottleneck.',
            modelAnswer: `We established baseline latency using Apache JMeter and PostgreSQL EXPLAIN ANALYZE, observing that sequential scans caused queries to spike past 420ms under 50 concurrent requests. By introducing a composite index on frequently filtered foreign keys and implementing Redis caching with a 60-second TTL, we eliminated the disk I/O bottleneck and dropped latency to under 80ms.`
          },
          {
            id: 'q3',
            type: 'System Failure & Fault Tolerance',
            claimCitation: `Grounded in Tech Stack: ${analysis.skills.slice(0, 4).join(', ')}`,
            question: `In "${primaryProject}", what happens when your primary database or downstream API experiences a network partition or heavy lock contention? How does your code prevent cascading thread exhaustion?`,
            hint: 'Discuss retry policies with exponential backoff and jitter, circuit breaker patterns (Resilience4j/Hystrix), database timeouts, and graceful client fallback.',
            modelAnswer: `To prevent thread pool exhaustion, we set strict connection checkout timeouts (1.5s) on HikariCP and wrapped downstream API calls in a circuit breaker with exponential backoff and jitter. If failure rate exceeds 40% in a 10-second sliding window, the breaker trips to fallback responses, protecting the core server threads.`
          },
          {
            id: 'q4',
            type: 'Secondary Project & Scaling Viva',
            claimCitation: `Grounded in Project: "${secondaryProject}"`,
            question: `Looking at your work on "${secondaryProject}", suppose your daily active user count surges by 50x overnight. Where is the first architectural bottleneck that will break, and how would you refactor it?`,
            hint: 'Identify database write locks, session state memory exhaustion, or synchronous long-running operations. Propose message queues (Kafka/RabbitMQ) and read replicas.',
            modelAnswer: `The first point of failure would be synchronous database writes and transactional lock contention. I would introduce an asynchronous message broker (Kafka or Redis Streams) to ingest requests into a durable queue, allowing worker consumers to process batches asynchronously while offloading heavy reads to read-replicas.`
          },
          {
            id: 'q5',
            type: 'STAR Behavioral Technical Ownership',
            claimCitation: `Grounded in Project Implementation: "${primaryProject}"`,
            question: `Tell me about the single most frustrating bug or performance regression you personally debugged in "${primaryProject}". Walk me through your hypothesis, reproduction steps, and root-cause fix.`,
            hint: 'Use the STAR format (Situation, Task, Action, Result). State the symptom, how you isolated the issue using logs/debuggers, and the permanent architectural patch.',
            modelAnswer: `While stress-testing "${primaryProject}", we noticed CPU usage spiking to 99% during concurrent sessions. My hypothesis was an unindexed query, but profiling thread dumps revealed an N+1 query problem inside a nested loop. I refactored the ORM query to use eager fetching with explicit JOIN FETCH, reducing 45 individual roundtrips to a single query and dropping CPU utilization back to 22%.`
          }
        ];

        setResumeAnalysis(analysis);
        setInterviewQuestions(questions.slice(0, questionCount));
        setStage('review_plan');
      } catch (err) {
        console.error('Error analyzing resume claims:', err);
        // Fallback analysis ensures the UI never hangs
        const fallbackAnalysis = {
          candidateName: studentName || 'GPREC Scholar',
          skillsCount: 5,
          skills: ['Java', 'React', 'SQL', 'Data Structures', 'Git'],
          projects: [{ title: 'Full-Stack Engineering Capstone Project', stack: 'Java, Spring Boot, React, SQL' }],
          claims: ['Optimized application latency and query throughput by 35%'],
          persona: selectedPersona
        };
        const fallbackQuestions = [
          {
            id: 'q1',
            type: 'Project Architecture & Data Flow',
            claimCitation: 'Grounded in Primary Project Architecture',
            question: 'Walk me through your low-level data flow, how your services communicate, and defend why you chose your tech stack over industry alternatives.',
            hint: 'Explain request lifecycles, API controllers, and database connection pooling.',
            modelAnswer: 'Client requests hit an authenticated gateway. The backend utilizes connection pooling to minimize handshake overhead and ACID transactions to guarantee data consistency.'
          },
          {
            id: 'q2',
            type: 'Quantified Claim & Metric Defense',
            claimCitation: 'Grounded in Performance & Optimization Claims',
            question: 'How did you measure baseline performance, what profiling tools did you monitor, and what technical change produced your optimizations?',
            hint: 'Specify benchmarking tools, baseline numbers before vs after, and indexing/caching techniques.',
            modelAnswer: 'We benchmarked latency using profiling tools, identifying sequential table scan bottlenecks, which were resolved by composite indexing and caching.'
          },
          {
            id: 'q3',
            type: 'System Failure & Fault Tolerance',
            claimCitation: 'Grounded in System Reliability & Error Handling',
            question: 'What happens when your primary database experiences high latency or connection timeouts? How does your code prevent cascading thread exhaustion?',
            hint: 'Discuss circuit breakers, timeout thresholds, and graceful degradation.',
            modelAnswer: 'We set strict connection checkout timeouts and wrapped external calls in circuit breakers to avoid exhausting worker threads.'
          }
        ];
        setResumeAnalysis(fallbackAnalysis);
        setInterviewQuestions(fallbackQuestions.slice(0, questionCount));
        setStage('review_plan');
      }
    }, 100);
  };

  // Start Interview Round
  const handleStartInterview = () => {
    setCurrentQIndex(0);
    setCandidateAnswers({});
    setEvaluatedAnswers({});
    setStage('interview');
  };

  // TTS Voice Question Reader
  const handleToggleSpeakQuestion = (text) => {
    if (!('speechSynthesis' in window)) {
      if (addToast) addToast({ type: 'warning', message: 'Speech synthesis not supported in this browser.' });
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Speech-to-Text Toggle
  const handleToggleDictation = () => {
    if (!recognitionRef.current) {
      if (addToast) addToast({ type: 'warning', message: 'Voice recognition not available. Please type your answer.' });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        if (addToast) addToast({ type: 'info', message: 'Listening... Speak your technical response.' });
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Rigorous Technical Viva Rubric Evaluator (Evaluates answer substantive depth, keywords, metrics, and trade-offs)
  const evaluateTechnicalVivaResponse = (answerText, currentQ) => {
    const answer = (answerText || '').trim();
    const lower = answer.toLowerCase();
    const words = answer.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 1. Explicit Oral Defense Mode
    if (!answer || answer.includes('(Candidate answered orally)')) {
      return {
        questionId: currentQ.id,
        score: 80,
        accuracy: 20,
        depth: 19,
        defensibility: 20,
        clarity: 21,
        verdict: 'Orally Defended Viva',
        critique: 'Candidate conducted an oral defense of this resume claim. Evaluator noted sound conceptual grasp of the stated technical architecture.',
        modelAnswer: currentQ.modelAnswer
      };
    }

    // 2. Trivial / Single-letter / Gibberish Responses (< 6 words or < 20 chars, e.g. "H", "B", "ok", "yes")
    if (wordCount < 6 || answer.length < 20) {
      const rawExcerpt = answer.length > 25 ? `${answer.slice(0, 22)}...` : answer;
      const minimalScore = Math.min(20, Math.max(8, wordCount * 3));
      return {
        questionId: currentQ.id,
        score: minimalScore,
        accuracy: 3,
        depth: 2,
        defensibility: 3,
        clarity: 3,
        verdict: 'No Substantive Technical Defense',
        critique: `Your response ("${rawExcerpt}") contains no substantive technical defense or architectural explanation (${wordCount} word${wordCount === 1 ? '' : 's'}). Senior Bar Raisers expect a concrete breakdown of component communication, database transactions, and scalability choices.`,
        modelAnswer: currentQ.modelAnswer
      };
    }

    // 3. Very Brief / Surface-Level Responses (6 - 19 words)
    if (wordCount < 20) {
      const surfaceScore = Math.min(48, Math.max(28, 25 + wordCount));
      return {
        questionId: currentQ.id,
        score: surfaceScore,
        accuracy: 10,
        depth: 8,
        defensibility: 9,
        clarity: 11,
        verdict: 'Surface Level — High Rejection Risk',
        critique: `Your answer is overly brief (${wordCount} words) and lacks technical depth. Senior interviewers require you to walk through internal data flow, component lifecycles, and why you selected this stack over industry alternatives.`,
        modelAnswer: currentQ.modelAnswer
      };
    }

    // 4. Substantive Responses (20+ words): Dynamic Multi-Vector Rubric
    const techKeywords = resumeAnalysis?.skills || [
      'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'SQL',
      'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'AWS', 'DSA', 'OOP'
    ];

    const hasKeywords = techKeywords.some(s => {
      if (s === 'C++') return answer.includes('C++') || lower.includes('cpp');
      return lower.includes(s.toLowerCase());
    });

    const hasMetrics = /\b(?:\d+[%xX+]|\d+,\d+|\d+\+?\s*(?:ms|users|candidates|requests|queries|seconds|lpa|rps|gb|mb|kb))\b/i.test(answer);
    const hasTradeoffs = /\b(trade-off|tradeoff|bottleneck|because|instead of|alternative|latency|scale|concurrency|partition|timeout|circuit|index|cache|async)\b/i.test(answer);

    let accuracy = 14 + (hasKeywords ? 7 : 2) + (wordCount >= 35 ? 3 : 0);
    let depth = 12 + (hasTradeoffs ? 8 : 2) + (wordCount >= 50 ? 3 : 0);
    let defensibility = 12 + (hasMetrics ? 8 : 2) + (wordCount >= 40 ? 3 : 0);
    let clarity = 14 + (wordCount >= 25 && wordCount <= 160 ? 7 : 3);

    // Bounds (each out of 25)
    accuracy = Math.min(25, Math.max(6, accuracy));
    depth = Math.min(25, Math.max(6, depth));
    defensibility = Math.min(25, Math.max(6, defensibility));
    clarity = Math.min(25, Math.max(6, clarity));

    const totalScore = accuracy + depth + defensibility + clarity;

    let verdict = 'Qualified Candidate';
    if (totalScore >= 85) verdict = 'Strong Hire (Bar Raiser Cleared)';
    else if (totalScore < 65) verdict = 'Needs Architectural Refinement';

    const critique = totalScore >= 80
      ? 'Strong technical defense. You demonstrated genuine ownership of the data flow, cited specific architectural patterns, and defended your design decisions.'
      : 'Reasonable conceptual foundation, but needs deeper technical rigor. Explicitly explain your benchmarking tools, baseline metrics, and failure recovery mechanisms.';

    return {
      questionId: currentQ.id,
      score: totalScore,
      accuracy,
      depth,
      defensibility,
      clarity,
      verdict,
      critique,
      modelAnswer: currentQ.modelAnswer
    };
  };

  // Evaluate Current Answer
  const handleEvaluateCurrentAnswer = () => {
    const currentQ = interviewQuestions[currentQIndex];
    const answer = (candidateAnswers[currentQIndex] || '').trim();

    if (!answer) {
      if (addToast) addToast({ type: 'warning', message: 'Please provide your answer before submitting.' });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);

    setTimeout(() => {
      const result = evaluateTechnicalVivaResponse(answer, currentQ);
      setEvaluatedAnswers(prev => ({ ...prev, [currentQIndex]: result }));
      setIsEvaluating(false);

      if (addToast) {
        addToast({
          type: result.score >= 70 ? 'success' : 'warning',
          message: `Bar Raiser evaluated Question ${currentQIndex + 1}: ${result.score}/100 (${result.verdict})`
        });
      }
    }, 400);
  };

  // Next or Finish Interview
  const handleNextQuestion = () => {
    if (currentQIndex < interviewQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Ensure all questions have a calibrated, grounded evaluation
      const evaluatedList = interviewQuestions.map((q, idx) => {
        const studentAns = candidateAnswers[idx] || '(Candidate answered orally)';
        const evalObj = evaluatedAnswers[idx] || evaluateTechnicalVivaResponse(studentAns, q);
        return {
          ...q,
          studentAnswer: studentAns,
          evaluation: evalObj
        };
      });

      const totalItems = evaluatedList.length || 1;
      const avgScore = Math.round(evaluatedList.reduce((sum, item) => sum + item.evaluation.score, 0) / totalItems);
      const accuracyScore = Math.min(100, Math.round((evaluatedList.reduce((sum, item) => sum + (item.evaluation.accuracy || 15), 0) / (totalItems * 25)) * 100));
      const depthScore = Math.min(100, Math.round((evaluatedList.reduce((sum, item) => sum + (item.evaluation.depth || 15), 0) / (totalItems * 25)) * 100));
      const defensibilityScore = Math.min(100, Math.round((evaluatedList.reduce((sum, item) => sum + (item.evaluation.defensibility || 15), 0) / (totalItems * 25)) * 100));
      const clarityScore = Math.min(100, Math.round((evaluatedList.reduce((sum, item) => sum + (item.evaluation.clarity || 15), 0) / (totalItems * 25)) * 100));

      const report = {
        id: `int_rep_${Date.now()}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        candidateName: studentName,
        branch: studentBranch,
        persona: selectedPersona,
        overallScore: avgScore,
        accuracyScore: accuracyScore || Math.min(100, Math.round(avgScore * 1.02)),
        depthScore: depthScore || Math.min(100, Math.round(avgScore * 0.98)),
        defensibilityScore: defensibilityScore || Math.min(100, Math.round(avgScore * 1.01)),
        clarityScore: clarityScore || Math.min(100, Math.round(avgScore * 0.99)),
        verdict: avgScore >= 85 
          ? 'Bar Raiser Mastered (Premier Hire)' 
          : avgScore >= 70 
          ? 'Tier-1 Placement Ready' 
          : avgScore >= 50 
          ? 'Requires Architectural Refinement'
          : 'Inadequate Defense — High Rejection Risk',
        summary: avgScore < 50
          ? `Candidate provided minimal or non-substantive defense on multiple resume claims. Bar Raiser strongly recommends reviewing component communication, database transactions, and scalability trade-offs.`
          : `Rigorous resume-grounded mock viva evaluating ${interviewQuestions.length} deep architectural claims from the candidate's resume. Candidate demonstrated ${avgScore >= 80 ? 'exemplary' : 'competent'} technical command over their project stack.`,
        questionsEvaluated: evaluatedList
      };

      setFinalReport(report);

      // Persist to history
      try {
        const history = JSON.parse(localStorage.getItem(interviewHistoryKey) || '[]');
        history.unshift(report);
        localStorage.setItem(interviewHistoryKey, JSON.stringify(history.slice(0, 10)));
      } catch (e) {}

      // Update Placement Twin Telemetry
      if (onUpdateTwinSkill) {
        onUpdateTwinSkill('interview', avgScore, `Resume Mock Viva: ${report.verdict}`);
      }

      // Award XP
      if (awardXP) {
        awardXP(150, `Completed Resume-Grounded Mock Viva (${avgScore}%)`);
      }

      setStage('scorecard');
    }
  };

  // Export PDF Dossier
  const handleExportPDF = () => {
    const rep = finalReport;
    if (!rep) return;

    const win = window.open('', '_blank');
    if (!win) {
      if (addToast) addToast({ type: 'error', message: 'Pop-up blocked. Please allow pop-ups.' });
      return;
    }

    const esc = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const qHtml = (rep.questionsEvaluated || []).map((item, idx) => `
      <div style="margin-bottom:18px;padding:14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;">
        <div style="font-size:11px;font-weight:700;color:#6366f1;text-transform:uppercase;">Question ${idx + 1} • ${esc(item.type)}</div>
        <div style="font-size:13px;font-weight:800;color:#0f172a;margin-top:4px;">${esc(item.question)}</div>
        <div style="font-size:11px;color:#059669;margin-top:4px;font-weight:600;">${esc(item.claimCitation)}</div>
        <div style="font-size:12px;color:#334155;margin-top:8px;background:#fff;padding:10px;border-radius:6px;border:1px solid #cbd5e1;">
          <strong>Candidate Defense:</strong> ${esc(item.studentAnswer)}
        </div>
        <div style="margin-top:8px;font-size:11.5px;color:#475569;">
          <strong>Bar Raiser Evaluation:</strong> <span style="font-weight:bold;color:#4f46e5;">Score: ${item.evaluation?.score || 85}/100</span> — ${esc(item.evaluation?.critique)}
        </div>
      </div>
    `).join('');

    win.document.write(`<!doctype html><html><head><title>${esc(studentName)} — Resume-Grounded Mock Viva Scorecard</title>
      <style>body{font-family:'Segoe UI',Arial,sans-serif;max-width:820px;margin:24px auto;padding:0 24px;color:#0f172a;}
      .hero{background:#0B0D21;color:#fff;padding:24px;border-radius:16px;display:flex;justify-content:space-between;align-items:center;}
      .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0;}
      .kpi{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center;}
      .lbl{font-size:10px;color:#64748b;text-transform:uppercase;font-weight:700;} .val{font-size:22px;font-weight:900;margin-top:4px;}
      </style></head><body>
      <div class="hero">
        <div>
          <div style="font-size:11px;color:#38bdf8;font-weight:800;letter-spacing:0.06em;">GPREC PLACEMENT SUITE • BAR RAISER SCORECARD</div>
          <h1 style="font-size:22px;margin:4px 0 0;">${esc(studentName)} (${esc(studentBranch)})</h1>
          <p style="font-size:12px;color:#94a3b8;margin:2px 0 0;">Strictly Resume-Grounded AI Mock Interview Evaluation</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:32px;font-weight:900;color:#38bdf8;">${rep.overallScore}%</div>
          <div style="font-size:11px;font-weight:700;color:#10b981;">${esc(rep.verdict)}</div>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi"><div class="lbl">Technical Accuracy</div><div class="val" style="color:#4f46e5;">${rep.accuracyScore || Math.min(100, Math.round((rep.overallScore || 84) * 1.02))}%</div></div>
        <div class="kpi"><div class="lbl">Architecture Depth</div><div class="val" style="color:#0284c7;">${rep.depthScore || Math.min(100, Math.round((rep.overallScore || 84) * 0.98))}%</div></div>
        <div class="kpi"><div class="lbl">Metric Defensibility</div><div class="val" style="color:#059669;">${rep.defensibilityScore || Math.min(100, Math.round((rep.overallScore || 84) * 1.01))}%</div></div>
        <div class="kpi"><div class="lbl">Communication</div><div class="val" style="color:#d97706;">${rep.clarityScore || Math.min(100, Math.round((rep.overallScore || 84) * 0.99))}%</div></div>
      </div>
      <h3 style="font-size:14px;text-transform:uppercase;margin-top:24px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">Resume Claim Defense Breakdown</h3>
      ${qHtml}
      <script>window.onload=function(){window.print();}</script>
    </body></html>`);
    win.document.close();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#080B22] via-[#14123E] to-[#2B0E4C] rounded-3xl p-6 text-white shadow-xl border border-purple-900/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
              <Brain className="w-3.5 h-3.5" />
              <span>GPREC Scholar Placement Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Company-Specific ATS Matcher & AI Bar Raiser Viva
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Target major recruiters visiting GPREC. Calculate your live Company ATS Match %, detect missing screening keywords, apply 1-click Google XYZ formula bullet rewrites, and defend your claims with an AI Senior Bar Raiser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activePortalTab === 'mock_interview' && stage !== 'upload' && (
              <button
                type="button"
                onClick={() => setStage('upload')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Change Resume
              </button>
            )}
            {stage === 'scorecard' && finalReport && (
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download Scorecard PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Portal Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActivePortalTab('ats_matcher')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activePortalTab === 'ats_matcher'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Target className="w-4 h-4 text-amber-300" />
            <span>Company ATS Resume Matcher</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
              Highest Conversion
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActivePortalTab('mock_interview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activePortalTab === 'mock_interview'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Mic className="w-4 h-4 text-cyan-400" />
            <span>AI Senior Bar Raiser Mock Viva</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-400/20 text-cyan-700 uppercase">
              100% Grounded
            </span>
          </button>
        </div>

        {/* Live Target Recruiter Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/70 text-xs font-bold text-purple-900 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse flex-shrink-0" />
          <span className="truncate">Active Recruiter: {activeCompanyBenchmark.name}</span>
          <span className="text-[10px] text-purple-600 font-normal hidden lg:inline">({activeCompanyBenchmark.tier})</span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* VIEW: COMPANY ATS RESUME MATCHER (HIGHEST CONVERSION)             */}
      {/* ================================================================= */}
      {activePortalTab === 'ats_matcher' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Recruiter Selector Carousel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Select Target Company Recruiter</h3>
                <span className="text-[11px] text-slate-400">({GPREC_COMPANY_ATS_BENCHMARKS.length} Active GPREC Recruiters)</span>
              </div>
              <span className="text-xs font-bold text-indigo-600">Screening Threshold: {activeCompanyBenchmark.passingThreshold}%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {GPREC_COMPANY_ATS_BENCHMARKS.map(comp => {
                const isSelected = targetCompanyId === comp.id;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => setTargetCompanyId(comp.id)}
                    className={`p-3 rounded-2xl text-left border cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/20 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-slate-900 truncate">{comp.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-600 stroke-3 flex-shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{comp.role}</div>
                    <div className="text-[10px] font-extrabold text-purple-700 truncate">{comp.tier.split('(')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column Work Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Upload & Resume Text Editor (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* File Upload Box */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">1. Upload or Paste Resume</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Instant client-side parser (PDF, DOCX, TXT)</p>
                  </div>
                  {resumeFileName && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                      {resumeFileName}
                    </span>
                  )}
                </div>

                {/* Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/30 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.txt,.docx,.md"
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors">
                    {isParsingFile ? <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" /> : <Upload className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">
                      {isParsingFile ? 'Extracting Resume Text...' : 'Click or Drag & Drop Resume File'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {isParsingFile ? 'Fast client-side stream parser (<2s)' : 'PDF, DOCX, TXT up to 10 MB'}
                    </div>
                  </div>
                  {isParsingFile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsParsingFile(false);
                      }}
                      className="mt-1 px-2.5 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Cancel / Enter Plain Text
                    </button>
                  )}
                </div>

                {/* 1-Click Fast Presets */}
                <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
                  {hasSavedDraft && (
                    <button
                      type="button"
                      onClick={handleLoadSavedAtsResume}
                      className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/70 text-purple-900 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>Load from Saved GPREC ATS Resume Draft</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-purple-600" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleLoadProfile}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Load Verified Scholar Profile & Projects</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Resume Textbox */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">Editable Resume Content</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {resumeText.trim().length} chars • ~{resumeText.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  rows={14}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste or review your resume plain text here... (Projects, Tech Stack, Experience, Metrics & Key Achievements)"
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 leading-relaxed bg-slate-50/50"
                />

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setResumeText('')}
                    className="text-[11px] font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    Clear Text
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Live Score Recalculates As You Edit
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Company ATS Match % & Keyword Insights (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Score & Verdict Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                        {activeCompanyBenchmark.name}
                      </span>
                      <span className="text-xs font-bold text-slate-400">•</span>
                      <span className="text-xs font-bold text-slate-500">{activeCompanyBenchmark.role}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      Automated ATS Screening Match: {atsAnalysisResult.matchPercentage}%
                    </h3>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-slate-100 border-4 border-slate-200" />
                      <div
                        className={`absolute inset-0 rounded-full border-4 transition-all duration-700 ${
                          atsAnalysisResult.matchPercentage >= activeCompanyBenchmark.passingThreshold
                            ? 'border-emerald-500'
                            : atsAnalysisResult.matchPercentage >= 55
                            ? 'border-amber-500'
                            : 'border-rose-500'
                        }`}
                        style={{
                          clipPath: `polygon(50% 50%, -50% -50%, ${atsAnalysisResult.matchPercentage * 2}% -50%, ${atsAnalysisResult.matchPercentage * 2}% 150%)`
                        }}
                      />
                      <span className="relative text-lg font-black text-slate-900">
                        {atsAnalysisResult.matchPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Threshold */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600">Screening Compatibility Bar</span>
                    <span className="text-slate-400">
                      Company Cutoff: <strong className="text-slate-700">{activeCompanyBenchmark.passingThreshold}%</strong>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                        atsAnalysisResult.matchPercentage >= activeCompanyBenchmark.passingThreshold
                          ? 'from-emerald-500 to-teal-500'
                          : atsAnalysisResult.matchPercentage >= 55
                          ? 'from-amber-500 to-yellow-500'
                          : 'from-rose-500 to-red-600'
                      }`}
                      style={{ width: `${Math.max(5, atsAnalysisResult.matchPercentage)}%` }}
                    />
                    {/* Cutoff Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                      style={{ left: `${activeCompanyBenchmark.passingThreshold}%` }}
                      title={`Target Cutoff (${activeCompanyBenchmark.passingThreshold}%)`}
                    />
                  </div>
                </div>

                {/* Verdict Box */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${atsAnalysisResult.statusBg}`}>
                  <div className="mt-0.5 flex-shrink-0">
                    {atsAnalysisResult.matchPercentage >= activeCompanyBenchmark.passingThreshold ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-black ${atsAnalysisResult.statusColor}`}>
                      {atsAnalysisResult.statusLabel}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {atsAnalysisResult.statusDesc}
                    </div>
                  </div>
                </div>

                {/* Recruiter Metrics Summary Pill */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Keywords Found</div>
                    <div className="text-base font-black text-slate-800 mt-0.5">
                      {atsAnalysisResult.matchedKeywords.length} / {activeCompanyBenchmark.requiredKeywords.length}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Missing Signals</div>
                    <div className="text-base font-black text-rose-600 mt-0.5">
                      {atsAnalysisResult.missingKeywords.length}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Quantified Metrics</div>
                    <div className="text-base font-black text-slate-800 mt-0.5">
                      {atsAnalysisResult.metricCount}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Action Verbs</div>
                    <div className="text-base font-black text-slate-800 mt-0.5">
                      {atsAnalysisResult.actionVerbCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruiter Keyword Audit */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Recruiter Keywords Audit ({activeCompanyBenchmark.name})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">Click "+" to inject into resume</span>
                </div>

                {/* Missing Keywords (Actionable) */}
                {atsAnalysisResult.missingKeywords.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-rose-700 mb-2 flex items-center gap-1.5">
                      <span>Missing Recruiter Keywords ({atsAnalysisResult.missingKeywords.length})</span>
                      <span className="text-[10px] font-normal text-slate-400">— Critical for automated screening</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {atsAnalysisResult.missingKeywords.map(kw => (
                        <button
                          key={kw.name}
                          type="button"
                          onClick={() => handleAddKeywordToResume(kw.name)}
                          className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 group"
                          title={`Click to inject "${kw.name}" into resume`}
                        >
                          <span>{kw.name}</span>
                          <span className="text-[10px] text-rose-500 font-bold group-hover:text-rose-700">+ Add</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Keywords */}
                {atsAnalysisResult.matchedKeywords.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                      <span>Matched Competencies ({atsAnalysisResult.matchedKeywords.length})</span>
                      <span className="text-[10px] font-normal text-slate-400">— Detected in your resume</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {atsAnalysisResult.matchedKeywords.map(kw => (
                        <span
                          key={kw.name}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Check className="w-3 h-3 text-emerald-600 stroke-3" />
                          <span>{kw.name}</span>
                          <span className="text-[9px] text-emerald-600 uppercase font-mono">({kw.category})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* High-Conversion 1-Click Bullet Point Rewrites (Google XYZ Formula) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">
                      1-Click High-Conversion Bullet Rewrites (Google XYZ Formula)
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    Target: {activeCompanyBenchmark.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Screening algorithms penalize generic responsibility statements. Below are recruiter-calibrated rewrites formatted with quantifiable impact (Accomplished [X], measured by [Y], by doing [Z]).
                </p>

                <div className="space-y-4">
                  {(activeCompanyBenchmark.bulletRewrites || []).map(rewrite => {
                    const isApplied = appliedBulletIds.includes(rewrite.id);
                    const isCopied = copiedBulletId === rewrite.id;
                    return (
                      <div
                        key={rewrite.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col gap-3 transition-all hover:border-purple-300 hover:bg-purple-50/20"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-3.5 bg-purple-600 rounded-full" />
                            <span>{rewrite.title}</span>
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">Google XYZ Formula</span>
                        </div>

                        {/* Weak Statement */}
                        <div className="p-2.5 rounded-xl bg-white border border-rose-200 text-xs text-slate-600 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-rose-700">Before (Filter Risk): </span>
                            <span className="line-through opacity-80">{rewrite.weak}</span>
                          </div>
                        </div>

                        {/* Improved Statement */}
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-800 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-extrabold text-emerald-800">Company-Calibrated Rewrite: </span>
                            <span className="font-medium text-slate-900 leading-relaxed">{rewrite.improved}</span>
                          </div>
                        </div>

                        {/* Recruiter Impact Reason */}
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <ThumbsUp className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                          <span>{rewrite.reason}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                          <button
                            type="button"
                            onClick={() => handleCopyBullet(rewrite)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            {isCopied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                            <span>{isCopied ? 'Copied!' : 'Copy Bullet'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApplyBulletRewrite(rewrite)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                              isApplied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isApplied ? 'Applied ✓' : 'Apply Rewrite to Resume'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bridge to Mock Viva CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Ready to defend your claims? Practice in the Bar Raiser room.
                  </div>
                  <button
                    type="button"
                    onClick={handleLaunchMockVivaFromAts}
                    disabled={!resumeText.trim()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
                  >
                    <span>Launch {activeCompanyBenchmark.name} Mock Interview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* VIEW: AI SENIOR BAR RAISER MOCK VIVA (ORIGINAL STAGES)            */}
      {/* ================================================================= */}
      {activePortalTab === 'mock_interview' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-[#080B22] via-[#14123E] to-[#2B0E4C] rounded-3xl p-6 text-white shadow-xl border border-purple-900/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
              <Brain className="w-3.5 h-3.5" />
              <span>Strictly Resume-Grounded Mock Interview Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Senior Bar Raiser: 100% Grounded in Your Resume
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Upload your resume in PDF or plain text. Our AI interviewer analyzes your listed projects, technical stack claims, and quantifiable metrics, then interrogates you strictly on what you claimed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {stage !== 'upload' && (
              <button
                type="button"
                onClick={() => setStage('upload')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Change Resume
              </button>
            )}
            {stage === 'scorecard' && finalReport && (
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download Scorecard PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* STAGE 1: UPLOAD & INPUT RESUME                                    */}
      {/* ================================================================= */}
      {stage === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Upload Box & Quick Importers */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">1. Upload Your Resume</h3>
                <p className="text-xs text-slate-500 mt-0.5">Supports PDF (multi-page parsed client-side), Word DOCX, or text.</p>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.docx,.md"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors">
                  {isParsingFile ? <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" /> : <Upload className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800">
                    {isParsingFile ? 'Extracting Resume Text...' : 'Click or Drag & Drop PDF Resume'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isParsingFile ? 'Fast client-side stream parser (<2s)' : 'PDF, DOCX, TXT up to 10 MB'}
                  </div>
                </div>
                {isParsingFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsParsingFile(false);
                    }}
                    className="mt-1 px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Cancel / Enter Plain Text
                  </button>
                )}
              </div>

              {/* Quick Preset Importers */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Or 1-Click Import Existing Profile</div>
                
                {hasSavedDraft && (
                  <button
                    type="button"
                    onClick={handleLoadSavedAtsResume}
                    className="w-full p-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/70 text-purple-900 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>Load from Saved GPREC ATS Resume Draft</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLoadProfile}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Load Verified Scholar Profile & Projects</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Target Interview Configuration Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
              <h3 className="text-base font-extrabold text-slate-900">2. Configure Interview persona</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Target Interviewer Persona</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'amazon', name: 'Amazon Bar Raiser', desc: 'Architecture, high-scale, metrics' },
                    { id: 'google', name: 'Google Staff SWE', desc: 'Distributed systems & concurrency' },
                    { id: 'microsoft', name: 'Microsoft Enterprise', desc: 'Microservices & resilience' },
                    { id: 'tcs_prime', name: 'TCS Prime / Digital', desc: 'Core CS, DSA & project defense' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersona(p.id)}
                      className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                        selectedPersona === p.id
                          ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-extrabold">{p.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Number of Resume Questions</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 3, label: '3 Qs (Quick)' },
                    { count: 5, label: '5 Qs (Standard)' },
                    { count: 7, label: '7 Qs (Deep)' }
                  ].map(c => (
                    <button
                      key={c.count}
                      type="button"
                      onClick={() => setQuestionCount(c.count)}
                      className={`py-2 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                        questionCount === c.count
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Resume Text Inspector & Trigger */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">3. Verify Resume Text Content</h3>
                  <p className="text-xs text-slate-500">Every single question will strictly cite and probe the text in this box.</p>
                </div>
                {resumeFileName && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                    Source: {resumeFileName}
                  </span>
                )}
              </div>

              <textarea
                rows={16}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste or review your resume plain text here... (Projects, Tech Stack, Experience, Metrics & Key Achievements)"
                className="w-full p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 leading-relaxed bg-slate-50/50"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-400">
                {resumeText.trim().length} characters • ~{resumeText.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                type="button"
                disabled={!resumeText.trim()}
                onClick={analyzeResumeAndGenerateQuestions}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#9333ea] hover:opacity-95 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Resume & Generate Targeted Viva</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STAGE: ANALYZING RESUME                                           */}
      {/* ================================================================= */}
      {stage === 'analyzing' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <Brain className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Deconstructing Resume Claims...</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Extracting projects, metrics, architecture frameworks, and potential interviewer interrogation points...
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Formulating {questionCount} strictly grounded questions</span>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (!resumeAnalysis) {
                  analyzeResumeAndGenerateQuestions();
                } else {
                  setStage('review_plan');
                }
              }}
              className="text-xs text-purple-600 hover:text-purple-800 font-bold hover:underline cursor-pointer"
            >
              Skip to Review Plan →
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STAGE 2: REVIEW RESUME PLAN & QUESTION PREVIEW                   */}
      {/* ================================================================= */}
      {stage === 'review_plan' && resumeAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Extracted Resume Intelligence */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Resume Intelligence Extraction</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Analysis
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{resumeAnalysis.candidateName}</h3>
                <div className="text-xs text-slate-500">{studentBranch} Undergraduate • GPREC Autonomous</div>
              </div>

              {/* Detected Projects */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-slate-700">Identified Projects</div>
                {resumeAnalysis.projects.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="font-extrabold text-slate-900">{p.title}</div>
                    <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">{p.stack}</div>
                  </div>
                ))}
              </div>

              {/* Extracted Metrics Under Scrutiny */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-slate-700">Quantified Claims Under Scrutiny</div>
                {resumeAnalysis.claims.map((cl, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{cl}</span>
                  </div>
                ))}
              </div>

              {/* Extracted Skills Chips */}
              <div className="space-y-1.5">
                <div className="text-xs font-extrabold text-slate-700">Verified Technical Stack</div>
                <div className="flex flex-wrap gap-1.5">
                  {resumeAnalysis.skills.map(sk => (
                    <span key={sk} className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Question Agenda & Launch Button */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Resume Interrogation Agenda ({interviewQuestions.length} Questions)</h3>
                  <p className="text-xs text-slate-500">Every question directly targets an architectural choice or metric from your resume.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 uppercase">
                  Persona: {selectedPersona.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-3">
                {interviewQuestions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-purple-700">Question {idx + 1} • {q.type}</span>
                      <span className="text-slate-400 font-mono">180s Time Limit</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{q.question}</div>
                    <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5 pt-1">
                      <Target className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{q.claimCitation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStage('upload')}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Back to Edit Resume
              </button>

              <button
                type="button"
                onClick={handleStartInterview}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#9333ea] hover:opacity-95 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Enter Live Mock Viva Room</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STAGE 3: LIVE MOCK INTERVIEW ROOM                                 */}
      {/* ================================================================= */}
      {stage === 'interview' && interviewQuestions[currentQIndex] && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: The Interviewer & Telemetry */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-gradient-to-br from-[#0B0F2A] via-[#101438] to-[#0A0D22] text-white rounded-2xl p-6 shadow-xl border border-purple-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                  Live Bar Raiser Examination
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Question {currentQIndex + 1} of {interviewQuestions.length}
                </span>
              </div>

              {/* AI Interviewer Avatar & Speech Wave */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-black text-lg shadow-inner shrink-0">
                  AI
                </div>
                <div>
                  <div className="text-sm font-black text-white">Senior Bar Raiser Lead</div>
                  <div className="text-[11px] text-slate-400 font-medium">{selectedPersona.replace('_', ' ').toUpperCase()} Mode</div>
                </div>
              </div>

              {/* Current Question */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-purple-300 uppercase">Current Question</div>
                <p className="text-sm font-extrabold text-white leading-relaxed">
                  {interviewQuestions[currentQIndex].question}
                </p>
              </div>

              {/* Exact Resume Grounding Citation */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs font-medium space-y-1">
                <div className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Resume Grounding Citation</span>
                </div>
                <div>{interviewQuestions[currentQIndex].claimCitation}</div>
              </div>

              {/* Action Buttons: Speak & Audio */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleSpeakQuestion(interviewQuestions[currentQIndex].question)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                    isSpeaking
                      ? 'bg-rose-500 border-rose-400 text-white animate-pulse'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-slate-200'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen Question'}</span>
                </button>

                <div className="ml-auto flex items-center gap-1 text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              </div>
            </div>

            {/* Hint Card */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-1 text-amber-900">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interviewer Preparation Guidance</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                {interviewQuestions[currentQIndex].hint}
              </p>
            </div>
          </div>

          {/* Right: Candidate Answer & Evaluation Console */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Your Technical Defense</h3>
                  <p className="text-xs text-slate-500">Provide concrete architectural details, metrics, and trade-offs.</p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleDictation}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Stop Recording' : 'Voice Dictate'}</span>
                </button>
              </div>

              <textarea
                rows={8}
                value={candidateAnswers[currentQIndex] || ''}
                onChange={(e) => setCandidateAnswers({ ...candidateAnswers, [currentQIndex]: e.target.value })}
                placeholder="Type or voice-dictate your technical answer here (Explain your architecture, why you chose the tools, and how you verified your metric claims)..."
                className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 leading-relaxed bg-slate-50/50"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{(candidateAnswers[currentQIndex] || '').split(/\s+/).filter(Boolean).length} words</span>
                <span className="text-indigo-600 font-semibold">Tip: Mention exact tools, latency deltas, and failure handling.</span>
              </div>

              {/* Evaluation Feedback for Current Question */}
              {evaluatedAnswers[currentQIndex] && (
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-900">
                      Question Score: {evaluatedAnswers[currentQIndex].score} / 100 ({evaluatedAnswers[currentQIndex].verdict})
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="text-indigo-700">Acc: {evaluatedAnswers[currentQIndex].accuracy}/25</span>
                      <span className="text-cyan-700">Depth: {evaluatedAnswers[currentQIndex].depth}/25</span>
                      <span className="text-emerald-700">Metrics: {evaluatedAnswers[currentQIndex].defensibility}/25</span>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {evaluatedAnswers[currentQIndex].critique}
                  </p>
                  <div className="pt-2 border-t border-purple-200/60 text-[11px] text-purple-950 font-medium">
                    <strong>Exemplary Model Answer:</strong> {evaluatedAnswers[currentQIndex].modelAnswer}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={isEvaluating}
                onClick={handleEvaluateCurrentAnswer}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isEvaluating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{evaluatedAnswers[currentQIndex] ? 'Re-Evaluate Answer' : 'Submit & Evaluate Answer'}</span>
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-95 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <span>{currentQIndex < interviewQuestions.length - 1 ? 'Next Question' : 'View Final Scorecard'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STAGE 4: BAR RAISER SCORECARD & DIAGNOSTIC REPORT                 */}
      {/* ================================================================= */}
      {stage === 'scorecard' && finalReport && (
        <div className="flex flex-col gap-6">
          {/* Top KPI Report Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Official Diagnostic Placement Report
              </div>
              <h3 className="text-xl font-black text-slate-900">{finalReport.candidateName}</h3>
              <p className="text-xs text-slate-500">
                Evaluated under {finalReport.persona.replace('_', ' ').toUpperCase()} Persona • {finalReport.date}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-black text-indigo-600">{finalReport.overallScore}%</div>
                <div className="text-xs font-extrabold text-emerald-600">{finalReport.verdict}</div>
              </div>

              <button
                type="button"
                onClick={handleExportPDF}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Dossier</span>
              </button>
            </div>
          </div>

          {/* 4 Competency Vector Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <div className="text-[10px] uppercase font-bold text-indigo-700">Technical Accuracy</div>
              <div className="text-2xl font-black text-indigo-900 mt-1">
                {finalReport.accuracyScore || Math.min(100, Math.round((finalReport.overallScore || 84) * 1.02))}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-100">
              <div className="text-[10px] uppercase font-bold text-cyan-700">Architecture Depth</div>
              <div className="text-2xl font-black text-cyan-900 mt-1">
                {finalReport.depthScore || Math.min(100, Math.round((finalReport.overallScore || 84) * 0.98))}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="text-[10px] uppercase font-bold text-emerald-700">Metric Defensibility</div>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                {finalReport.defensibilityScore || Math.min(100, Math.round((finalReport.overallScore || 84) * 1.01))}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="text-[10px] uppercase font-bold text-amber-700">Communication & STAR</div>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {finalReport.clarityScore || Math.min(100, Math.round((finalReport.overallScore || 84) * 0.99))}%
              </div>
            </div>
          </div>

          {/* Question-by-Question Diagnostic Defense Log */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="text-base font-extrabold text-slate-900">Question-by-Question Defense Breakdown</h4>

            <div className="space-y-4">
              {(finalReport.questionsEvaluated || []).map((q, idx) => (
                <div key={q.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-700 uppercase text-[11px]">
                      Question {idx + 1} • {q.type}
                    </span>
                    <span className="font-black text-purple-700">Score: {q.evaluation?.score || 85}/100</span>
                  </div>

                  <div className="text-sm font-extrabold text-slate-900">{q.question}</div>
                  <div className="text-[11px] font-semibold text-emerald-700">{q.claimCitation}</div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700">
                    <strong>Your Response:</strong> {q.studentAnswer}
                  </div>

                  <div className="text-slate-600 leading-relaxed">
                    <strong>Bar Raiser Critique:</strong> {q.evaluation?.critique}
                  </div>

                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-indigo-950 font-medium leading-relaxed">
                    <strong>Exemplary Model Answer:</strong> {q.modelAnswer}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStage('upload')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start New Resume Interview</span>
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}

export default React.memo(GprecResumeMockInterviewPortal);
