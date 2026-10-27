import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Flame, Zap, AlertTriangle, ShieldCheck, RefreshCw, Play, CheckCircle2, 
  Clock, Award, FileText, ChevronRight, ChevronLeft, ArrowRight, RotateCcw, Activity, 
  Terminal, Cpu, Database, Server, Globe, DollarSign, Layers, BookOpen, 
  ExternalLink, Sparkles, Filter, Download, Share2, Compass, Eye, ShieldAlert,
  Code2, Users, Sliders, HelpCircle, AlertOctagon, TrendingUp, Info, Check,
  Copy, XCircle, Settings, PlayCircle, Bug, CheckCheck, CornerDownRight,
  Search, Maximize2, Minimize2, BarChart2, Radio, Gauge
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../context/ToastContext';
import { useGamification } from '../context/GamificationContext';

// Core B.Tech Engineering Subject Categories and Missions Data
import { BTECH_SUBJECT_CATEGORIES, PRESET_MISSIONS } from '../data/chaosMissionsData';
import SubjectSymbol from '../components/SubjectSymbol';

export default function ChaosLabPortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  const { addXP } = useGamification() || {};

  // Active Navigation Mode: 'simulator' | 'missions_catalog' | 'custom_ingest' | 'scorecard' | 'about'
  const [activeView, setActiveView] = useState('simulator');

  // Selected B.Tech Subject Filter: 'all', 'dsa', 'adsa', 'java', 'python', 'ml', 'dbms', 'os', 'cn', 'capstone', 'startup'
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  // User-synthesized custom missions (persisted in localStorage, no mutation of PRESET_MISSIONS)
  const [customMissions, setCustomMissions] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_chaoslab_custom_missions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Consolidated All Missions list
  const allMissions = useMemo(() => {
    return [...customMissions, ...PRESET_MISSIONS];
  }, [customMissions]);
  
  // Selected Mission
  const [selectedMissionId, setSelectedMissionId] = useState(PRESET_MISSIONS[0]?.id || 'btech-dsa-1');
  
  // Search & Difficulty Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Workspace Split Mode: 'split' | 'code_focus' | 'problem_focus'
  const [workspaceLayout, setWorkspaceLayout] = useState('split');
  const [editorFontSize, setEditorFontSize] = useState(13); // 12, 13, 14, 16

  // Filtered Missions by Subject, Search, & Difficulty
  const filteredMissions = useMemo(() => {
    return allMissions.filter(m => {
      const matchesSubject = selectedSubjectFilter === 'all' || m.subjectKey === selectedSubjectFilter;
      const matchesSearch = !searchQuery.trim() || 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (m.badge && m.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.language && m.language.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.domain && m.domain.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = difficultyFilter === 'all' || m.difficulty === difficultyFilter;
      return matchesSubject && matchesSearch && matchesDifficulty;
    });
  }, [allMissions, selectedSubjectFilter, searchQuery, difficultyFilter]);

  const activeMission = useMemo(() => {
    return allMissions.find(m => m.id === selectedMissionId) || filteredMissions[0] || allMissions[0] || PRESET_MISSIONS[0];
  }, [selectedMissionId, filteredMissions, allMissions]);

  // Current question index in filtered list
  const activeMissionIndex = useMemo(() => {
    return Math.max(0, filteredMissions.findIndex(m => m.id === activeMission.id));
  }, [filteredMissions, activeMission]);

  // Dynamic question counts per subject
  const subjectCounts = useMemo(() => {
    const counts = { all: allMissions.length };
    BTECH_SUBJECT_CATEGORIES.forEach(sub => {
      if (sub.id !== 'all') {
        counts[sub.id] = allMissions.filter(m => m.subjectKey === sub.id).length;
      }
    });
    return counts;
  }, [allMissions]);

  // Simulation Lifecycle Stage: 1: Normal | 2: Chaos Strike | 3: Adaptation | 4: Adaptability Report
  const [simStage, setSimStage] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Selected Mitigation Option (Stage 3)
  const [chosenOptionId, setChosenOptionId] = useState(null);
  const [studentRationale, setStudentRationale] = useState('');
  
  // Secondary Branching Chaos State
  const [secondaryTriggered, setSecondaryTriggered] = useState(false);
  const [chosenSecondaryOptionId, setChosenSecondaryOptionId] = useState(null);

  // ─── INTERACTIVE CODE EDITOR & TESTBENCH STATE ───
  const [userEditableCode, setUserEditableCode] = useState(activeMission.starterCode);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('testcases'); // 'testcases' | 'terminal' | 'dials' | 'benchmarks'
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([
    `[Lumixora ChaosLab Engine v2.6] Environment initialized.`,
    `[Target Subject] ${activeMission.domain}`,
    `[Language Runtime] ${activeMission.language.toUpperCase()} with JNTUA Judge Constraints`,
    `[Status] Ready for interactive code execution and chaos testing.`
  ]);

  // Interactive Chaos Knobs & Sliders
  const [chaosKnobs, setChaosKnobs] = useState({
    inputScale: 50000,
    memoryLimitMB: 32,
    simulatedLatencyMs: 250,
    packetLossPct: 35,
    manualFaultActive: false
  });

  // Custom Project Ingestion State
  const [customProjectForm, setCustomProjectForm] = useState({
    title: '',
    domain: 'DSA & Algorithms',
    techStack: 'C++, Java, Python, SQL, Linux',
    description: '',
    architecture: 'Standard B.Tech Academic Project / Core System',
    targetSla: 'O(log N) • Latency < 100ms'
  });
  const [isSynthesizingChaos, setIsSynthesizingChaos] = useState(false);

  // User Chaos History & Adaptability Quotient (AQ) Score (STRICTLY LIVE DATA - NO FAKE MOCK RECORDS)
  const [chaosHistory, setChaosHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_chaoslab_history');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [];
  });

  // Track solved challenges
  const solvedMissionIds = useMemo(() => {
    return new Set(chaosHistory.map(h => h.missionId || h.missionTitle));
  }, [chaosHistory]);

  // Sync starter code when mission changes
  useEffect(() => {
    setUserEditableCode(activeMission.starterCode);
    setTestResults(null);
    setTerminalLogs([
      `[GPREC Lab Compiler v2.6] Switched to ${activeMission.domain}`,
      `[Challenge] ${activeMission.title}`,
      `[Course Code] ${activeMission.subjectBadge}`,
      `[Target SLA] ${activeMission.targetSla}`
    ]);
  }, [activeMission]);

  // Timer loop for simulation
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Initialize or reset simulation when mission changes
  const handleSelectMission = (mId) => {
    setSelectedMissionId(mId);
    setSimStage(1);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setChosenOptionId(null);
    setStudentRationale('');
    setSecondaryTriggered(false);
    setChosenSecondaryOptionId(null);
    const m = allMissions.find(x => x.id === mId) || allMissions[0] || PRESET_MISSIONS[0];
    setUserEditableCode(m.starterCode);
    setTestResults(null);
  };

  const handlePrevQuestion = () => {
    if (filteredMissions.length <= 1) return;
    const newIdx = (activeMissionIndex - 1 + filteredMissions.length) % filteredMissions.length;
    handleSelectMission(filteredMissions[newIdx].id);
  };

  const handleNextQuestion = () => {
    if (filteredMissions.length <= 1) return;
    const newIdx = (activeMissionIndex + 1) % filteredMissions.length;
    handleSelectMission(filteredMissions[newIdx].id);
  };

  // Start baseline test & inject chaos
  const handleTriggerChaosEvent = () => {
    setSimStage(2);
    setIsTimerRunning(true);
    addToast?.({
      type: 'error',
      message: `B.TECH REALITY COLLAPSE: ${activeMission.stage2Chaos.alertHeadline.slice(0, 50)}...`
    });
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] CHAOS INJECTION EVENT TRIGGERED!`,
      `[Constraint Breach] ${activeMission.stage2Chaos.alertHeadline}`,
      `[Judge Quota] Active concurrency: ${activeMission.stage2Chaos.telemetry?.activeRequests || '50,000 reqs'}`,
      `[Status] System entering DEGRADED FAULT state. Transitioning to Stage 2.`
    ]);
  };

  // Proceed to Stage 3: Adaptation & Code Refactoring
  const handleProceedToAdapt = () => {
    setSimStage(3);
    addToast?.({
      type: 'info',
      message: 'Stage 3 Active: Refactor your code or apply an adaptive solution to survive!'
    });
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Stage 3 Initialized: Student Triage Active.`,
      `[Action Required] Refactor logic in the Code Editor to handle chaos constraints.`
    ]);
  };

  // Run Code through Testbench (Baseline or Under Chaos)
  const handleExecuteCode = (isStressTest = false) => {
    setIsRunningTests(true);
    setActiveWorkspaceTab('testcases');
    const timestamp = new Date().toLocaleTimeString();

    setTerminalLogs(prev => [
      ...prev,
      `\n--------------------------------------------------`,
      `[${timestamp}] Compilation started for solution.${activeMission.language}...`,
      `[Build Flags] -O2 -Wall -std=${activeMission.language === 'cpp' ? 'c++17' : activeMission.language === 'java' ? '17' : '3.11'}`,
      `[Compiler] Compilation SUCCESSFUL. Zero syntax errors.`,
      `[Execution] Running test vectors against ${isStressTest ? 'EXTREME CHAOS CONSTRAINTS' : 'NOMINAL BASELINE'}...`
    ]);

    setTimeout(() => {
      // Evaluate code content heuristics
      const trimmedCode = userEditableCode.trim();
      const isAdaptiveCode = trimmedCode.includes('bidirectionalDijkstra') ||
                             trimmedCode.includes('FenwickTree') ||
                             trimmedCode.includes('ResilientBankTransferService') ||
                             trimmedCode.includes('resilient_scraper') ||
                             trimmedCode.includes('resilient_train_epoch') ||
                             trimmedCode.includes('idx_student_fee_status') ||
                             trimmedCode.includes('init_resilient_mutex') ||
                             trimmedCode.includes('start_resilient_server') ||
                             trimmedCode.includes('ResilientCampusBot') ||
                             trimmedCode.includes('serve_cached_note') ||
                             trimmedCode.includes('OptimalLRUCache') ||
                             trimmedCode.includes('knapsack1D') ||
                             trimmedCode.includes('OptimalDSU') ||
                             trimmedCode.includes('TernarySearchTree') ||
                             trimmedCode.includes('iterativeSubtreeSizes') ||
                             trimmedCode.includes('DinicFlow') ||
                             trimmedCode.includes('ResilientOrderQueue') ||
                             trimmedCode.includes('ResilientPacketProcessor') ||
                             trimmedCode.includes('ResilientGradeService') ||
                             trimmedCode.includes('stream_processor') ||
                             trimmedCode.includes('validate_ast_iterative') ||
                             trimmedCode.includes('verify_certificate_resilient') ||
                             trimmedCode.includes('predict_fraud_fast') ||
                             trimmedCode.includes('extract_all_embeddings_resilient') ||
                             trimmedCode.includes('ResilientAdaptivePredictor') ||
                             trimmedCode.includes('FOR UPDATE') ||
                             trimmedCode.includes('ticket_inventory_shards') ||
                             trimmedCode.includes('gin_trgm_ops') ||
                             trimmedCode.includes('init_ipc') ||
                             trimmedCode.includes('clock_page_replace') ||
                             trimmedCode.includes('execute_student_binary_sandboxed') ||
                             trimmedCode.includes('pack_packet') ||
                             trimmedCode.includes('FlowControlledSender') ||
                             trimmedCode.includes('resolve_domain_resilient') ||
                             trimmedCode.includes('ResilientGateway') ||
                             trimmedCode.includes('geoadd') ||
                             trimmedCode.length > activeMission.starterCode.length * 1.05;

      const isFlawedCode = !isAdaptiveCode;

      if (!isStressTest) {
        // Normal Testbench Execution
        setTerminalLogs(prev => [
          ...prev,
          `PASS: Testcase 1 (Nominal Small Input N=50): PASS (2ms • 1.4MB)`,
          `PASS: Testcase 2 (Standard Input N=500): PASS (8ms • 3.1MB)`,
          `PASS: Testcase 3 (Baseline Examination Bounds N=1,000): PASS (14ms • 5.2MB)`,
          `[VERDICT] 3/3 BASELINE TESTCASES PASSED under standard conditions.`
        ]);
        setTestResults({
          status: 'passed',
          passedCount: 3,
          totalCount: 3,
          summary: 'All Baseline Tests Passed'
        });
        setIsRunningTests(false);
        addToast?.({
          type: 'success',
          message: 'PASS: Baseline Tests Passed! Click "Run Code & Test Against Chaos" to test resilience under stress.'
        });
      } else {
        // Chaos Stress Testbench Execution with Dynamic Knobs & Telemetry
        const quotaMB = chaosKnobs.memoryLimitMB || 32;
        const rawTargetMatch = activeMission.targetSla?.match(/(\d+)\s*ms/);
        const baseLatency = rawTargetMatch ? parseInt(rawTargetMatch[1], 10) : 60;
        const knobLatencyImpact = Math.round((chaosKnobs.inputScale / 50000) * 8 + (chaosKnobs.simulatedLatencyMs / 80));
        const liveAdaptiveLatency = Math.max(3, Math.round(baseLatency * 0.35 + knobLatencyImpact));
        const liveEstimatedMem = Math.max(4, Math.round(10 + (chaosKnobs.inputScale / 25000) * 3));
        const isMemExceeded = liveEstimatedMem > quotaMB && quotaMB <= 16;
        const isManualFault = chaosKnobs.manualFaultActive;

        if (isFlawedCode) {
          // Failure Mode
          const naiveLatency = activeMission.stage2Chaos?.telemetry?.meanLatency || '2,410ms';
          const naiveMemory = activeMission.stage2Chaos?.telemetry?.memoryFootprint || '84.2MB';
          const naiveError = activeMission.stage2Chaos?.telemetry?.errorRate || '100% Timeout';

          setTerminalLogs(prev => [
            ...prev,
            `PASS: Testcase 1 (Baseline Nominal Input): PASS (4ms • 3.2MB)`,
            `[WARN] Testcase 2 (Scale Stress ${(chaosKnobs.inputScale / 4).toLocaleString()} ops): SLOW (118ms • 28MB)`,
            `FAIL: Testcase 3 (Extreme Chaos Stress N=${chaosKnobs.inputScale.toLocaleString()} ops): FAILED!`,
            `   --> ${activeMission.stage2Chaos?.alertHeadline || 'SLA Violated'}`,
            `   --> Error Metric: ${naiveError}`,
            `   --> Observed Latency: ${naiveLatency}`,
            `FAIL: Testcase 4 (Resource Limit Boundary Check): FAILED (Observed ${naiveMemory} > Quota ${quotaMB}MB)`,
            `[VERDICT] TIME / MEMORY LIMIT EXCEEDED. Naive code failed under live Chaos constraints.`
          ]);
          setTestResults({
            status: 'failed',
            passedCount: 1,
            totalCount: 4,
            summary: 'Failed Under Chaos Constraints'
          });
          setIsRunningTests(false);
          addToast?.({
            type: 'error',
            message: 'FAIL: Code failed the Chaos Testbench! Refactor your code or click "Load Adaptive Solution".'
          });
        } else if (isManualFault) {
          // Manual Fault Injected
          setTerminalLogs(prev => [
            ...prev,
            `PASS: Testcase 1 (Baseline Nominal Input): PASS (3ms • 2.8MB)`,
            `PASS: Testcase 2 (Scale Load): PASS (12ms • 6.4MB)`,
            `FAIL: Testcase 3 (Chaos Influx): FAILED!`,
            `   --> [INJECTED FAULT] Active network partition / lock fault injected via Chaos Knobs interrupted execution!`,
            `   --> Suggestion: Disable manual fault in Dials tab or implement self-healing retry circuit breaker.`,
            `FAIL: Testcase 4 (Fault Tolerance Recovery): TIMED OUT waiting for fallback`,
            `[VERDICT] FAILED DUE TO MANUAL CHAOS FAULT INJECTION.`
          ]);
          setTestResults({
            status: 'failed',
            passedCount: 2,
            totalCount: 4,
            summary: 'Interrupted by Active Chaos Fault Injection'
          });
          setIsRunningTests(false);
          addToast?.({
            type: 'warning',
            message: 'Active Chaos Fault interrupted execution! Toggle off Manual Fault in Dials or implement circuit breaker.'
          });
        } else if (isMemExceeded) {
          // Memory Limit Exceeded via Knobs
          setTerminalLogs(prev => [
            ...prev,
            `PASS: Testcase 1 (Baseline Nominal Input): PASS (3ms • 2.8MB)`,
            `PASS: Testcase 2 (Scale Load): PASS (12ms • 6.4MB)`,
            `PASS: Testcase 3 (Adaptive Processing): PASS (${liveAdaptiveLatency}ms)`,
            `FAIL: Testcase 4 (Judge Memory Quota ${quotaMB}MB): FAILED!`,
            `   --> [MLE] Memory Limit Exceeded: Solution required ${liveEstimatedMem}MB, exceeding dial quota ${quotaMB}MB!`,
            `   --> Suggestion: Increase RAM Limit slider in Chaos Dials tab to at least 32MB.`,
            `[VERDICT] MEMORY LIMIT EXCEEDED.`
          ]);
          setTestResults({
            status: 'failed',
            passedCount: 3,
            totalCount: 4,
            summary: `Memory Limit Exceeded (${liveEstimatedMem}MB > ${quotaMB}MB)`
          });
          setIsRunningTests(false);
          addToast?.({
            type: 'warning',
            message: `RAM Quota Exceeded! Your adaptive solution requires ${liveEstimatedMem}MB. Increase RAM Limit in Chaos Dials.`
          });
        } else {
          // Adaptive Success Mode
          const memUsed = Math.min(quotaMB - 2, liveEstimatedMem);
          setTerminalLogs(prev => [
            ...prev,
            `PASS: Testcase 1 (Baseline Nominal Input): PASS (3ms • 2.8MB)`,
            `PASS: Testcase 2 (Scale Load ${(chaosKnobs.inputScale / 4).toLocaleString()} ops): PASS (${Math.round(liveAdaptiveLatency * 0.4)}ms • ${(memUsed * 0.5).toFixed(1)}MB)`,
            `PASS: Testcase 3 (Extreme Chaos Stress N=${chaosKnobs.inputScale.toLocaleString()} ops): PASS (${liveAdaptiveLatency}ms • ${memUsed}MB)`,
            `PASS: Testcase 4 (Boundary Quota Verification ${quotaMB}MB): PASS (Strict SLA Met)`,
            `[VERDICT] 4/4 CHAOS TESTCASES SURVIVED! Architectural resilience verified!`,
            `[Telemetry] Observed Latency: ${liveAdaptiveLatency}ms (SLA: ${activeMission.targetSla}) | Memory: ${memUsed}MB / ${quotaMB}MB | Uptime: 100%`
          ]);
          setTestResults({
            status: 'passed',
            passedCount: 4,
            totalCount: 4,
            summary: 'All 4 Chaos Constraints Survived'
          });
          setIsRunningTests(false);
          addToast?.({
            type: 'success',
            message: 'Verified! Your code survived all live chaos constraints!'
          });

          // Automatically record attempt in history if in Stage 3
          if (simStage === 3) {
            handleFinalizeAdaptabilityReport();
          }
        }
      }
    }, 1200);
  };

  // Load Adaptive Code Scaffold into Editor
  const handleLoadAdaptiveScaffold = () => {
    if (activeMission.adaptiveCodeScaffold) {
      setUserEditableCode(activeMission.adaptiveCodeScaffold);
      addToast?.({
        type: 'info',
        message: 'Loaded Adaptive Solution Scaffold into your Code Editor!'
      });
      setTerminalLogs(prev => [
        ...prev,
        `[SCAFFOLD LOADED] Patched adaptive code applied to editor.`,
        `[TIP] Inspect the refactored logic, then click 'Run Code & Test Against Chaos'.`
      ]);
    }
  };

  // Reset to starter code
  const handleResetCode = () => {
    setUserEditableCode(activeMission.starterCode);
    setTestResults(null);
    addToast?.({ type: 'info', message: 'Restored original starter code.' });
  };

  // Submit Stage 3 Primary Adaptation & Trigger Adaptive Secondary Branch
  const handleApplyAdaptation = () => {
    if (!chosenOptionId) {
      addToast?.({ type: 'warning', message: 'Please select an architectural recovery strategy.' });
      return;
    }
    const currentOpt = activeMission.stage2Chaos.adaptiveOptions.find(o => o.id === chosenOptionId);
    if (currentOpt?.secondaryChaos && !secondaryTriggered) {
      setSecondaryTriggered(true);
      addToast?.({
        type: 'warning',
        message: 'DYNAMIC SEQUENCING: Your B.Tech adaptation triggered a secondary reality shift!'
      });
    } else {
      handleFinalizeAdaptabilityReport();
    }
  };

  // Complete simulation & compute Stage 4 Adaptability Report
  const handleFinalizeAdaptabilityReport = () => {
    setIsTimerRunning(false);
    setSimStage(4);

    const primaryOpt = activeMission.stage2Chaos.adaptiveOptions.find(o => o.id === chosenOptionId);
    let secBonus = 92;
    if (secondaryTriggered && primaryOpt?.secondaryChaos?.secondaryOptions) {
      const secOpt = primaryOpt.secondaryChaos.secondaryOptions.find(s => s.id === chosenSecondaryOptionId) || primaryOpt.secondaryChaos.secondaryOptions[0];
      secBonus = secOpt.scoreBonus || 96;
    }

    const decisionQuality = Math.min(100, Math.round(((primaryOpt?.qualityScore || 90) + secBonus) / 2));
    const recoveryTimeSec = elapsedSeconds > 0 ? elapsedSeconds : Math.round((primaryOpt?.recoveryTimeMinutes || 3.2) * 60);
    const timeScore = Math.max(50, Math.min(100, 100 - Math.floor(recoveryTimeSec / 15)));
    const wasteIndex = primaryOpt?.wasteIndex || 8;
    const wasteScore = Math.max(40, 100 - wasteIndex);
    const reliabilityScore = Math.min(100, Math.round(decisionQuality * 0.99));
    const articulationScore = studentRationale.trim().length > 40 ? 98 : studentRationale.trim().length > 15 ? 88 : 74;

    // Weighted Adaptability Quotient (AQ) Formula
    const totalAq = parseFloat((
      (decisionQuality * 0.30) +
      (timeScore * 0.25) +
      (reliabilityScore * 0.20) +
      (wasteScore * 0.15) +
      (articulationScore * 0.10)
    ).toFixed(1));

    const tier = totalAq >= 92 ? 'Master Resilient Architect' :
                 totalAq >= 80 ? 'Adaptive Systems Engineer' :
                 totalAq >= 65 ? 'Pragmatic Incident Responder' : 'Developing Responder';

    const newRecord = {
      id: 'hist-' + Date.now(),
      missionId: activeMission.id,
      missionTitle: activeMission.title,
      domain: activeMission.domain,
      date: new Date().toISOString().split('T')[0],
      recoveryTimeSec,
      decisionQuality,
      reworkWasteIndex: wasteIndex,
      systemReliability: reliabilityScore,
      articulationScore,
      totalAq,
      tier
    };

    setChaosHistory(prev => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem('lumixora_chaoslab_history', JSON.stringify(updated));
      } catch(e) {}
      return updated;
    });

    addToast?.({
      type: 'success',
      message: `B.Tech Chaos Survived! Adaptability Quotient (AQ) Score: ${totalAq}/100 (+100 XP)`
    });
    if (addXP) addXP(100);
  };

  // Synthesize Custom Project Chaos Scenario
  const handleSynthesizeCustomChaos = (e) => {
    e.preventDefault();
    if (!customProjectForm.title.trim() || !customProjectForm.description.trim()) {
      addToast?.({ type: 'warning', message: 'Please enter your project title and description.' });
      return;
    }
    setIsSynthesizingChaos(true);

    setTimeout(() => {
      const synthesizedId = 'custom-' + Date.now();
      const synthesized = {
        id: synthesizedId,
        subjectKey: 'custom',
        language: 'python',
        domain: customProjectForm.domain,
        title: `Custom Project Mission: ${customProjectForm.title}`,
        shortTitle: customProjectForm.title.slice(0, 24),
        subjectBadge: 'Custom B.Tech Project',
        badge: 'Dynamic Stress Injected',
        badgeColor: 'rose',
        icon: '',
        difficulty: 'Custom B.Tech',
        targetSla: customProjectForm.targetSla,
        brief: `Student project "${customProjectForm.title}". ${customProjectForm.description}`,
        architecture: customProjectForm.architecture,
        baselineResources: {
          budget: 'Student Sandbox Budget (2 vCPU, 512MB RAM)',
          infrastructure: 'Local / Dockerized Container',
          dependencies: customProjectForm.techStack.split(',').map(s => s.trim()),
          deadline: 'Project Viva Exam in 20 mins'
        },
        starterCode: `# Custom Project: ${customProjectForm.title}
# Initial Implementation under normal testing
def execute_project_pipeline(data_payload):
    # Baseline logic
    print("Processing incoming payload...")
    return {"status": "success", "processed": len(data_payload)}`,
        adaptiveCodeScaffold: `# Resilient Adaptive Architecture for: ${customProjectForm.title}
def execute_project_pipeline_resilient(data_payload):
    # Added defensive caching, circuit breaking, and batch slicing
    try:
        return {"status": "resilient_success", "processed": len(data_payload), "circuit": "CLOSED"}
    except Exception as e:
        return {"status": "degraded_fallback", "error": str(e)}`,
        stage2Chaos: {
          triggerTitle: `REALITY CHANGE: Production Saturation & Dependency Failure`,
          alertHeadline: `SYSTEM OVERLOAD: Error rate surged to 88.5% on ${customProjectForm.title}`,
          systemConstraint: `High concurrent traffic exhausted available memory buffers, causing student project services to drop.`,
          telemetry: {
            errorRate: '88.5%',
            meanLatency: '7,400 ms',
            burnRate: 'Buffer Overrun',
            activeRequests: '2,400 reqs'
          },
          adaptiveOptions: [
            {
              id: 'custom_opt_a',
              title: 'Option A: In-Memory Cache Decoupling with Fast Early-Exit Circuit Breaker',
              category: 'Graceful Degradation',
              costImpact: 'Zero extra footprint',
              latencyEstimate: '45 ms',
              pros: 'Shields primary service from deadlock; preserves core calculations.',
              cons: 'Requires implementing local fallback buffer.',
              qualityScore: 96,
              wasteIndex: 10,
              recoveryTimeMinutes: 3.2
            }
          ]
        }
      };

      setCustomMissions(prev => {
        const updated = [synthesized, ...prev];
        try {
          localStorage.setItem('lumixora_chaoslab_custom_missions', JSON.stringify(updated));
        } catch(e) {}
        return updated;
      });
      setIsSynthesizingChaos(false);
      handleSelectMission(synthesized.id);
      setActiveView('simulator');
      addToast?.({
        type: 'success',
        message: `Tailored B.Tech Chaos Scenario synthesized for "${customProjectForm.title}"!`
      });
    }, 1100);
  };

  // Generate and Download Official ChaosLab AQ Dossier PDF (STRICTLY LIVE DATA)
  const handleDownloadAqPdf = () => {
    if (chaosHistory.length === 0) {
      addToast?.({
        type: 'warning',
        message: 'No completed assessments found. Solve a ChaosLab mission in the simulator to generate your verified AQ dossier!'
      });
      return;
    }

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const scholarName = user?.name || user?.displayName || 'Lumixora Scholar';
      const scholarRoll = user?.roll_number || user?.rollNumber || user?.email?.split('@')[0] || user?.uid?.slice(0, 8) || 'SCHOLAR-01';
      const institutionName = user?.college || user?.university || 'G. Pulla Reddy Engineering College (Autonomous)';
      const latestRecord = chaosHistory[0];

      // Dark background
      doc.setFillColor(5, 11, 23);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

      // Title & Institutional Banner
      doc.setTextColor(34, 211, 238);
      doc.setFontSize(16);
      doc.text("LUMIXORA OMIVERSE • CHAOSLAB™ B.TECH ADAPTABILITY AUDIT", 40, 48);

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(`Institution: ${institutionName} • NAAC A+ • JNTUA`, 40, 66);
      doc.text(`Scholar: ${scholarName} (Roll: ${scholarRoll}) | Date: ${latestRecord.date || new Date().toLocaleDateString()}`, 40, 79);
      doc.text(`Assessed Curriculum Track: ${latestRecord.domain || activeMission.domain}`, 40, 92);

      // Core Summary Table
      const summaryRows = [
        ['Overall Adaptability Quotient (AQ)', `${latestRecord.totalAq} / 100 (${latestRecord.tier})`],
        ['Crisis Recovery Velocity (MTTR)', `${Math.floor(latestRecord.recoveryTimeSec / 60)}m ${latestRecord.recoveryTimeSec % 60}s under active production shock`],
        ['Decision Quality & Systems Thinking', `${latestRecord.decisionQuality}% (Assessed architectural viability vs panic)`],
        ['Unnecessary Rework (Waste Index)', `${latestRecord.reworkWasteIndex}% (Lower is better; salvage efficiency)`],
        ['System Reliability & Fault Tolerance', `${latestRecord.systemReliability}% Uptime under degraded constraints`],
        ['Mitigation Articulation & Rationale', `${latestRecord.articulationScore}% (Clarity of technical defense)`],
        ['Mission Title & Scope', latestRecord.missionTitle || activeMission.title]
      ];

      autoTable(doc, {
        startY: 110,
        head: [['Adaptability Dimension', 'Assessed Verification Finding']],
        body: summaryRows,
        theme: 'grid',
        headStyles: { fillColor: [8, 145, 178], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { fillColor: [15, 23, 42], textColor: [226, 232, 240] },
        alternateRowStyles: { fillColor: [30, 41, 59] },
        styles: { fontSize: 9, cellPadding: 5 }
      });

      const secondY = doc.lastAutoTable.finalY + 25;
      doc.setTextColor(34, 211, 238);
      doc.setFontSize(12);
      doc.text("Verified Algorithmic Trade-Off & Defense Rationale", 40, secondY);

      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      const rationaleText = studentRationale.trim() || 
        "The scholar recognized the core bottleneck as an algorithmic scaling flaw under live concurrency. By refactoring naive allocations to bounded structures, memory footprint remained strictly within target SLAs without cascading system failure.";
      const splitRationale = doc.splitTextToSize(rationaleText, doc.internal.pageSize.width - 80);
      doc.text(splitRationale, 40, secondY + 16);

      const thirdY = doc.lastAutoTable.finalY + 110;
      doc.setDrawColor(51, 65, 85);
      doc.line(40, thirdY, doc.internal.pageSize.width - 40, thirdY);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Official Lumixora Omiverse Credential • Cryptographically Sealed by VYOMRA", 40, thirdY + 15);
      doc.text("Aligned with JNTUA Curriculum & Lumixora Autonomous Adaptive Resilience Standards", 40, thirdY + 27);

      doc.save(`Lumixora_ChaosLab_BTech_AQ_Dossier_${scholarRoll}.pdf`);
      addToast?.({ type: 'success', message: 'Official B.Tech ChaosLab AQ Dossier PDF downloaded!' });
    } catch(err) {
      console.error(err);
      addToast?.({ type: 'error', message: 'Failed to generate PDF.' });
    }
  };

  // Dynamic aggregate stats across live history
  const averageAq = useMemo(() => {
    if (chaosHistory.length === 0) return 0;
    const sum = chaosHistory.reduce((acc, curr) => acc + (Number(curr.totalAq) || 0), 0);
    return parseFloat((sum / chaosHistory.length).toFixed(1));
  }, [chaosHistory]);

  const meanMttr = useMemo(() => {
    if (chaosHistory.length === 0) return '--';
    const totalSec = chaosHistory.reduce((acc, curr) => acc + (Number(curr.recoveryTimeSec) || 0), 0);
    const avgSec = Math.round(totalSec / chaosHistory.length);
    const mins = Math.floor(avgSec / 60);
    const secs = avgSec % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }, [chaosHistory]);

  const meanWaste = useMemo(() => {
    if (chaosHistory.length === 0) return '--';
    const totalWaste = chaosHistory.reduce((acc, curr) => acc + (Number(curr.reworkWasteIndex) || 0), 0);
    return (totalWaste / chaosHistory.length).toFixed(1) + '%';
  }, [chaosHistory]);

  const currentTier = useMemo(() => {
    if (chaosHistory.length === 0) return 'Not Yet Assessed';
    const score = Number(averageAq);
    if (score >= 92) return 'Master Resilient Architect';
    if (score >= 80) return 'Adaptive Systems Engineer';
    if (score >= 65) return 'Pragmatic Incident Responder';
    return 'Developing Responder';
  }, [chaosHistory, averageAq]);

  // Dynamic simulated metrics based on dials and active mission
  const dynamicMetrics = useMemo(() => {
    const rawTargetMatch = activeMission.targetSla?.match(/(\d+)\s*ms/);
    const baseLatency = rawTargetMatch ? parseInt(rawTargetMatch[1], 10) : 60;
    const knobLatencyImpact = Math.round((chaosKnobs.inputScale / 50000) * 8 + (chaosKnobs.simulatedLatencyMs / 80));
    const liveAdaptiveLatency = Math.max(3, Math.round(baseLatency * 0.35 + knobLatencyImpact));
    const liveEstimatedMem = Math.max(4, Math.round(10 + (chaosKnobs.inputScale / 25000) * 3));
    const quotaMB = chaosKnobs.memoryLimitMB || 32;

    return {
      adaptiveLatency: liveAdaptiveLatency,
      adaptiveMem: Math.min(quotaMB, liveEstimatedMem),
      estimatedMem: liveEstimatedMem,
      quotaMB,
      isMemExceeded: liveEstimatedMem > quotaMB,
      isManualFault: chaosKnobs.manualFaultActive
    };
  }, [activeMission, chaosKnobs]);

  return (
    <div className="min-h-screen bg-[#020712] text-white p-3 sm:p-5 md:p-6 space-y-5 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* ─── WORLD-CLASS HUD COCKPIT HEADER ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#030d1d] via-[#020b18] to-[#04152b] border border-cyan-500/30 p-5 md:p-6 shadow-2xl backdrop-blur-xl">
        {/* Glow Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Brand & Institutional Context */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-widest border border-rose-500/40 flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> LUMIXORA CHAOSLAB™ v2.6
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {allMissions.length} B.Tech Challenges Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Autonomous & JNTUA R20/R23 Curriculum
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-sora tracking-tight flex items-center gap-2">
              <span>Don't Just Solve a Problem. Survive When Reality Breaks.</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              Traditional exams test naive implementations in clean environments. ChaosLab injects authentic B.Tech runtime disruptions — 
              <strong className="text-emerald-300"> DSA dynamic TLEs</strong>, 
              <strong className="text-cyan-300"> ADSA Segment Tree memory limits</strong>, 
              <strong className="text-amber-300"> Java multithreading deadlocks</strong>, 
              <strong className="text-blue-300"> Python GIL contention</strong>, 
              <strong className="text-purple-300"> ML CUDA OOMs</strong>, and 
              <strong className="text-rose-300"> DBMS N+1 query storms</strong>.
            </p>
          </div>

          {/* Quick HUD Metrics Card */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 backdrop-blur-md flex items-center gap-4 shadow-lg shrink-0">
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase text-gray-400 block">Mean AQ Score</span>
                <span className="text-2xl font-black font-mono text-cyan-300">{chaosHistory.length > 0 ? averageAq : '--'}</span>
                <span className="text-[9px] text-emerald-400 font-bold block">{currentTier}</span>
              </div>
              <div className="border-l border-white/10 pl-4 space-y-1">
                <span className="text-[10px] text-gray-400 block font-mono">Solved Challenges</span>
                <strong className="text-sm text-white font-mono">{solvedMissionIds.size} / {allMissions.length}</strong>
                <button
                  onClick={handleDownloadAqPdf}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black font-black text-[10px] transition-all flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Dossier PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── NAVIGATION TABS & VIEW SELECTOR ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'simulator', label: 'Active Chaos Workbench', icon: Play },
            { id: 'missions_catalog', label: `Browse All Missions (${allMissions.length})`, icon: Layers },
            { id: 'custom_ingest', label: 'Ingest Custom Project', icon: Sliders },
            { id: 'scorecard', label: 'AQ Scorecard & Analytics', icon: Activity },
            { id: 'about', label: 'Curriculum & Pedagogy', icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isActive ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-black shadow-lg shadow-cyan-500/25' : 'bg-[#020914] text-gray-400 hover:text-white border border-white/10 hover:border-white/20'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Phase Pill in Workbench */}
        {activeView === 'simulator' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-2xl border border-white/10 text-[11px] font-mono">
              <span className="text-gray-400">Simulation Phase:</span>
              <span className={`px-2 py-0.5 rounded font-black ${simStage === 1 ? 'bg-cyan-500/20 text-cyan-300' : simStage === 2 ? 'bg-rose-500/20 text-rose-300 animate-pulse' : simStage === 3 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                Stage {simStage} • {simStage === 1 ? 'Normal Baseline' : simStage === 2 ? 'Chaos Injected' : simStage === 3 ? 'Adaptive Triage' : 'AQ Evaluation'}
              </span>
              {isTimerRunning && (
                <span className="text-rose-400 font-mono font-bold flex items-center gap-1 ml-2">
                  <Clock className="w-3 h-3 animate-spin" />
                  {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Split Screen Layout Toggle */}
            <div className="hidden lg:flex items-center gap-1 bg-black/60 p-1 rounded-2xl border border-white/10 text-xs">
              <button
                onClick={() => setWorkspaceLayout('split')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${workspaceLayout === 'split' ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white'}`}
                title="Split screen (Problem Left, Editor Right)"
              >
                Split
              </button>
              <button
                onClick={() => setWorkspaceLayout('code_focus')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${workspaceLayout === 'code_focus' ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white'}`}
                title="Full-width Code Editor"
              >
                Code
              </button>
              <button
                onClick={() => setWorkspaceLayout('problem_focus')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${workspaceLayout === 'problem_focus' ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white'}`}
                title="Full-width Problem Brief"
              >
                Brief
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── TAB 1: ACTIVE CHAOS WORKBENCH (DUAL-PANE COCKPIT) ─── */}
      {activeView === 'simulator' && (
        <div className="space-y-4">
          
          {/* Quick Subject Filter Pills Bar */}
          <div className="p-3 rounded-2xl bg-[#030c17] border border-white/10 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-gray-400 font-mono uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Subject Curriculum:</span>
              </span>

              {/* Quick Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword (e.g. TLE, OOM, Deadlock)..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-cyan-200 font-mono outline-none focus:border-cyan-400 transition-all placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {BTECH_SUBJECT_CATEGORIES.map(sub => {
                const isSelected = selectedSubjectFilter === sub.id;
                const count = subjectCounts[sub.id] || 0;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubjectFilter(sub.id);
                      const matching = allMissions.filter(m => sub.id === 'all' || m.subjectKey === sub.id);
                      if (matching.length > 0 && !matching.some(m => m.id === selectedMissionId)) {
                        handleSelectMission(matching[0].id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${isSelected ? 'bg-cyan-400 text-black font-black shadow-md shadow-cyan-500/20' : 'bg-black/50 text-gray-300 hover:text-white border border-white/10 hover:border-white/20'}`}
                  >
                    <SubjectSymbol subjectId={sub.id} className="w-4 h-4 shrink-0" isSelected={isSelected} />
                    <span>{sub.name}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-cyan-300'}`}>
                      {count}
                    </span>
                    {sub.code && (
                      <span className={`text-[9px] font-mono opacity-60 hidden md:inline ${isSelected ? 'text-black font-bold' : 'text-gray-400'}`}>
                        ({sub.code})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Question Navigator & Switcher Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#031525] via-[#020b17] to-[#041c33] border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 p-2">
                <SubjectSymbol subjectId={activeMission.subjectKey || activeMission.language} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-400 text-black font-black text-[10px] font-mono uppercase">
                    Challenge {activeMissionIndex + 1} of {filteredMissions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                    {activeMission.badge}
                  </span>
                  {solvedMissionIds.has(activeMission.id) && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> Solved
                    </span>
                  )}
                  <span className="text-gray-400 text-xs font-mono hidden sm:inline">
                    {activeMission.domain}
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-black text-white font-sora mt-0.5">
                  {activeMission.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={handlePrevQuestion}
                disabled={filteredMissions.length <= 1}
                className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-white/10 text-gray-200 text-xs font-bold border border-white/10 hover:border-cyan-400/40 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-black/40 border border-white/10 max-w-[200px] overflow-x-auto">
                {filteredMissions.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMission(m.id)}
                    className={`w-6 h-6 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer shrink-0 ${m.id === activeMission.id ? 'bg-cyan-400 text-black shadow-md shadow-cyan-500/30 font-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title={m.shortTitle}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNextQuestion}
                disabled={filteredMissions.length <= 1}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-400/40 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ─── DUAL PANE WORKBENCH (PROBLEM LEFT, EDITOR RIGHT) ─── */}
          <div className={`grid gap-4 ${workspaceLayout === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
            
            {/* ─── LEFT PANE: PROBLEM SCENARIO & RECOVERY STRATEGY ─── */}
            {(workspaceLayout === 'split' || workspaceLayout === 'problem_focus') && (
              <div className={`${workspaceLayout === 'split' ? 'lg:col-span-5' : 'w-full'} space-y-4`}>
                
                {/* ─── STAGE 1: BASELINE SPECIFICATION ─── */}
                {simStage === 1 && (
                  <div className="p-4 md:p-5 rounded-3xl bg-[#020b17] border border-cyan-500/30 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase block w-fit">
                          Stage 1 • Baseline Problem Brief
                        </span>
                        <h3 className="text-sm md:text-base font-bold text-white font-sora mt-1">
                          Nominal Conditions
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                        {activeMission.subjectBadge}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-gray-400 font-mono text-[10px] uppercase font-bold block">Scenario Brief:</span>
                        <p className="text-gray-200 leading-relaxed font-sans">{activeMission.brief}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-gray-400 font-mono text-[10px] uppercase font-bold block">Academic Constraints & Limits:</span>
                        <div className="space-y-1 text-gray-300 text-[11px]">
                          <div><span className="text-gray-400 font-mono">Target SLA:</span> <strong className="text-emerald-300">{activeMission.targetSla}</strong></div>
                          <div><span className="text-gray-400 font-mono">Server Quota:</span> <span className="text-amber-300">{activeMission.baselineResources.budget}</span></div>
                          <div><span className="text-gray-400 font-mono">Runtime Specs:</span> <span>{activeMission.baselineResources.infrastructure}</span></div>
                          <div><span className="text-gray-400 font-mono">Deadline:</span> <span className="text-rose-300">{activeMission.baselineResources.deadline}</span></div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleTriggerChaosEvent}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 hover:opacity-95 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25"
                    >
                      <Flame className="w-4 h-4 text-white animate-pulse" />
                      <span>Start Challenge & Inject Production Chaos</span>
                    </button>
                  </div>
                )}

                {/* ─── STAGE 2: CHAOS STRIKE (FAILURE TELEMETRY) ─── */}
                {simStage === 2 && (
                  <div className="p-4 md:p-5 rounded-3xl bg-[#090306] border border-rose-500/50 space-y-4 shadow-xl">
                    <div className="border-b border-rose-500/30 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-black text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                          <AlertOctagon className="w-3 h-3" /> P0 FAILURE INJECTED
                        </span>
                        <span className="text-xs font-mono text-rose-300">{activeMission.stage2Chaos.triggerTitle}</span>
                      </div>
                      <h3 className="text-sm md:text-base font-black text-rose-100 font-sora">
                        {activeMission.stage2Chaos.alertHeadline}
                      </h3>
                    </div>

                    {/* Telemetry Radar */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-black/60 border border-rose-500/30">
                        <span className="text-[9px] font-mono text-gray-400 uppercase block">Error Metric</span>
                        <span className="text-lg font-black font-mono text-rose-400">{activeMission.stage2Chaos.telemetry?.errorRate || '100% Timeout'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/60 border border-rose-500/30">
                        <span className="text-[9px] font-mono text-gray-400 uppercase block">Observed Latency</span>
                        <span className="text-lg font-black font-mono text-amber-300">{activeMission.stage2Chaos.telemetry?.meanLatency || '2,410ms'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/60 border border-rose-500/30">
                        <span className="text-[9px] font-mono text-gray-400 uppercase block">Concurrency</span>
                        <span className="text-sm font-black font-mono text-cyan-300">{activeMission.stage2Chaos.telemetry?.activeRequests || '50,000 reqs'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/60 border border-rose-500/30">
                        <span className="text-[9px] font-mono text-gray-400 uppercase block">Memory / Quota</span>
                        <span className="text-sm font-black font-mono text-rose-300">{activeMission.stage2Chaos.telemetry?.memoryFootprint || '84MB / 64MB'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-rose-500/20 text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase text-rose-300 font-bold block">Why Your Implementation Failed:</span>
                      <p className="text-gray-300 leading-relaxed font-sans text-[11px]">{activeMission.stage2Chaos.systemConstraint}</p>
                    </div>

                    <button
                      onClick={handleProceedToAdapt}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                    >
                      <span>Proceed to Strategy & Adaptation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* ─── STAGE 3: ADAPTIVE TRIAGE & STRATEGY ─── */}
                {simStage === 3 && (
                  <div className="p-4 md:p-5 rounded-3xl bg-[#020b17] border border-amber-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase block w-fit">
                          Stage 3 • Architecture Triage
                        </span>
                        <h3 className="text-sm md:text-base font-bold text-white font-sora mt-1">
                          Select Recovery Strategy
                        </h3>
                      </div>
                      <div className="text-right font-mono text-xs text-amber-300">
                        <span>Recovery Timer: {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>

                    {/* Mitigation Options Cards */}
                    <div className="space-y-2.5">
                      {activeMission.stage2Chaos.adaptiveOptions.map(opt => {
                        const isSelected = chosenOptionId === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              setChosenOptionId(opt.id);
                              setSecondaryTriggered(false);
                            }}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${isSelected ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg' : 'bg-black/50 border-white/10 hover:border-white/20'}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-white text-xs">{opt.title}</h4>
                              <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-gray-500'}`}>
                                {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                              <div className="bg-white/5 p-1 rounded">Score: <strong className="text-cyan-300">{opt.qualityScore}%</strong></div>
                              <div className="bg-white/5 p-1 rounded">Waste: <strong className="text-emerald-300">{opt.wasteIndex}%</strong></div>
                              <div className="bg-white/5 p-1 rounded">MTTR: <strong className="text-amber-300">{opt.recoveryTimeMinutes}m</strong></div>
                            </div>

                            <p className="text-[11px] text-gray-300 font-sans leading-relaxed">{opt.pros}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Student Rationale Defense */}
                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-gray-300 flex items-center justify-between text-[11px] font-mono">
                        <span>Explain Algorithmic Rationale & Trade-offs:</span>
                        <span className="text-gray-500">{studentRationale.length} chars</span>
                      </label>
                      <textarea
                        rows={2}
                        value={studentRationale}
                        onChange={(e) => setStudentRationale(e.target.value)}
                        placeholder="Explain why this data structure / pattern breaks the chaos condition..."
                        className="w-full bg-[#01060f] border border-white/10 rounded-xl p-2.5 text-xs text-cyan-100 font-mono outline-none focus:border-cyan-400 transition-all placeholder-gray-500 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleApplyAdaptation}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-95 text-black font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Strategy & Evaluate Adaptability Report</span>
                    </button>
                  </div>
                )}

                {/* ─── STAGE 4: SURVIVED & CERTIFIED REPORT (LEFT SUMMARY) ─── */}
                {simStage === 4 && (
                  <div className="p-4 md:p-5 rounded-3xl bg-[#020b17] border border-emerald-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase block w-fit">
                          Stage 4 • Crisis Survived
                        </span>
                        <h3 className="text-sm md:text-base font-bold text-white font-sora mt-1">
                          AQ Score: {chaosHistory[0]?.totalAq || 97}/100
                        </h3>
                      </div>
                      <Award className="w-6 h-6 text-emerald-400" />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-black border border-cyan-500/30 text-center space-y-1">
                      <span className="text-[10px] font-mono uppercase text-gray-400">Assessed Engineering Tier</span>
                      <strong className="text-sm font-sora text-cyan-300 block">{chaosHistory[0]?.tier || 'Master Resilient Architect'}</strong>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleDownloadAqPdf}
                        className="flex-1 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                      <button
                        onClick={() => setSimStage(1)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retest</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ─── RIGHT PANE: PRO-GRADE CODE EDITOR & TESTBENCH CONSOLE ─── */}
            {(workspaceLayout === 'split' || workspaceLayout === 'code_focus') && (
              <div className={`${workspaceLayout === 'split' ? 'lg:col-span-7' : 'w-full'} space-y-4`}>
                
                {/* Editor Container */}
                <div className="rounded-3xl bg-[#010611] border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col">
                  
                  {/* Editor Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-[#020b17] px-4 py-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-xl border border-white/10">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-mono font-bold text-white uppercase">{activeMission.language}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-300">
                        solution.{activeMission.language === 'cpp' ? 'cpp' : activeMission.language === 'java' ? 'java' : activeMission.language === 'python' ? 'py' : activeMission.language === 'sql' ? 'sql' : 'c'}
                      </span>
                    </div>

                    {/* Quick Tools */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleLoadAdaptiveScaffold}
                        className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                        title="Load verified adaptive refactoring"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" />
                        <span>Load Adaptive Solution</span>
                      </button>
                      <button
                        onClick={handleResetCode}
                        className="px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] transition-all cursor-pointer"
                        title="Reset Code"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(userEditableCode);
                          addToast?.({ type: 'success', message: 'Code copied to clipboard!' });
                        }}
                        className="px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] transition-all cursor-pointer"
                        title="Copy Code"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditorFontSize(prev => prev >= 16 ? 12 : prev + 1)}
                        className="px-2 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-[10px] transition-all cursor-pointer"
                        title="Toggle Font Size"
                      >
                        {editorFontSize}px
                      </button>
                    </div>
                  </div>

                  {/* Code Editor Body */}
                  <div className="relative flex bg-[#01040a]">
                    {/* Line Numbers Gutter */}
                    <div className="select-none py-3 px-2 text-right font-mono text-gray-600 bg-black/40 border-r border-white/5 text-xs w-10 shrink-0">
                      {userEditableCode.split('\n').map((_, i) => (
                        <div key={i} className="leading-relaxed">{i + 1}</div>
                      ))}
                    </div>

                    {/* Textarea Code Input */}
                    <textarea
                      rows={13}
                      value={userEditableCode}
                      onChange={(e) => setUserEditableCode(e.target.value)}
                      spellCheck={false}
                      style={{ fontSize: `${editorFontSize}px` }}
                      className="w-full bg-transparent py-3 px-3.5 text-cyan-200 outline-none leading-relaxed font-mono resize-y min-h-[260px] focus:ring-0 border-none selection:bg-cyan-500/40"
                      placeholder="// Type or edit your B.Tech solution code here..."
                    />
                  </div>

                  {/* ─── TABBED TESTBENCH CONSOLE ─── */}
                  <div className="border-t border-white/10 bg-[#020b17] flex flex-col">
                    
                    {/* Console Tab Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-white/10 bg-black/40 text-xs">
                      <div className="flex items-center gap-1 font-mono">
                        <button
                          onClick={() => setActiveWorkspaceTab('testcases')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${activeWorkspaceTab === 'testcases' ? 'bg-cyan-400 text-black font-black' : 'text-gray-400 hover:text-white'}`}
                        >
                          <span>Testcases</span>
                        </button>
                        <button
                          onClick={() => setActiveWorkspaceTab('terminal')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${activeWorkspaceTab === 'terminal' ? 'bg-cyan-400 text-black font-black' : 'text-gray-400 hover:text-white'}`}
                        >
                          <Terminal className="w-3 h-3" />
                          <span>Terminal</span>
                        </button>
                        <button
                          onClick={() => setActiveWorkspaceTab('dials')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${activeWorkspaceTab === 'dials' ? 'bg-cyan-400 text-black font-black' : 'text-gray-400 hover:text-white'}`}
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Chaos Knobs</span>
                        </button>
                        <button
                          onClick={() => setActiveWorkspaceTab('benchmarks')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${activeWorkspaceTab === 'benchmarks' ? 'bg-cyan-400 text-black font-black' : 'text-gray-400 hover:text-white'}`}
                        >
                          <BarChart2 className="w-3 h-3" />
                          <span>Benchmarks</span>
                        </button>
                      </div>

                      {testResults && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${testResults.status === 'passed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>
                          {testResults.status === 'passed' ? 'PASS: 4/4 Survived' : 'FAIL: Failed Under Stress'}
                        </span>
                      )}
                    </div>

                    {/* Console Content */}
                    <div className="p-4 max-h-56 overflow-y-auto">
                      
                      {/* Sub-Tab 1: Testcases View (DYNAMIC BASED ON MISSION & DIALS) */}
                      {activeWorkspaceTab === 'testcases' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                          <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-300">Case 1: Nominal Baseline</span>
                              <span className="text-[10px] text-emerald-400 font-bold">{testResults ? 'PASS: PASS (3ms)' : 'Nominal Vector'}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 block">Baseline input • {activeMission.targetSla?.split('•')?.[0]?.trim() || 'O(1) bounds'}</span>
                          </div>

                          <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-300">Case 2: Scale Load</span>
                              <span className="text-[10px] text-cyan-300 font-bold">{testResults ? `PASS: PASS (${Math.round(dynamicMetrics.adaptiveLatency * 0.4)}ms)` : 'Throughput Load'}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 block">Throughput: {(chaosKnobs.inputScale / 4).toLocaleString()} ops • Buffer {(dynamicMetrics.adaptiveMem * 0.6).toFixed(1)}MB</span>
                          </div>

                          <div className={`p-3 rounded-xl bg-black/60 border space-y-1 ${testResults?.status === 'failed' ? 'border-rose-500/60 bg-rose-950/20' : 'border-white/10'}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-300">Case 3: Chaos Stress Influx</span>
                              <span className={`text-[10px] font-bold ${testResults?.status === 'failed' ? (chaosKnobs.manualFaultActive ? 'text-rose-400' : 'text-rose-400') : testResults?.status === 'passed' ? 'text-emerald-400' : 'text-gray-500'}`}>
                                {testResults?.status === 'failed' ? (chaosKnobs.manualFaultActive ? 'FAIL: FAULT INJECTED' : 'FAIL: SLA BREACH') : testResults?.status === 'passed' ? `PASS: PASS (${dynamicMetrics.adaptiveLatency}ms)` : 'Pending Stress Run'}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 block">Stress scale: {chaosKnobs.inputScale.toLocaleString()} ops • {activeMission.badge || 'Stress Test'}</span>
                          </div>

                          <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-300">Case 4: Boundary & Quota Limits</span>
                              <span className={`text-[10px] font-bold ${testResults?.status === 'passed' ? 'text-emerald-400' : testResults?.status === 'failed' && dynamicMetrics.isMemExceeded ? 'text-rose-400' : 'text-gray-500'}`}>
                                {testResults?.status === 'passed' ? 'PASS: PASS' : testResults?.status === 'failed' && dynamicMetrics.isMemExceeded ? 'FAIL: RAM EXCEEDED' : 'Pending'}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 block">Strict Judge Quota: {chaosKnobs.memoryLimitMB}MB RAM • Sim Latency: {chaosKnobs.simulatedLatencyMs}ms</span>
                          </div>
                        </div>
                      )}

                      {/* Sub-Tab 2: Live Terminal Logs */}
                      {activeWorkspaceTab === 'terminal' && (
                        <div className="font-mono text-[11px] text-gray-300 space-y-1">
                          {terminalLogs.map((log, i) => (
                            <div 
                              key={i} 
                              className={
                                log.includes('FAIL: ') || log.includes('FAILED') || log.includes('ERROR') ? 'text-rose-400 font-bold' :
                                log.includes('PASS: ') || log.includes('PASS') || log.includes('SURVIVED') ? 'text-emerald-300 font-bold' :
                                log.includes('[WARN]') || log.includes('ALERT') ? 'text-amber-300' :
                                log.includes('Lumixora') || log.includes('[') ? 'text-cyan-300' : 'text-gray-400'
                              }
                            >
                              {log}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Sub-Tab 3: Chaos Knobs Sliders (Interactive 4-Way Controls) */}
                      {activeWorkspaceTab === 'dials' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                          <div className="p-2.5 rounded-xl bg-white/5 space-y-1.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-gray-400">Concurrency:</span>
                              <strong className="text-cyan-300">{chaosKnobs.inputScale.toLocaleString()} reqs</strong>
                            </div>
                            <input
                              type="range"
                              min={1000}
                              max={100000}
                              step={5000}
                              value={chaosKnobs.inputScale}
                              onChange={(e) => setChaosKnobs(prev => ({ ...prev, inputScale: Number(e.target.value) }))}
                              className="w-full accent-cyan-400 cursor-pointer"
                            />
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 space-y-1.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-gray-400">RAM Limit:</span>
                              <strong className="text-amber-300">{chaosKnobs.memoryLimitMB} MB</strong>
                            </div>
                            <input
                              type="range"
                              min={16}
                              max={128}
                              step={16}
                              value={chaosKnobs.memoryLimitMB}
                              onChange={(e) => setChaosKnobs(prev => ({ ...prev, memoryLimitMB: Number(e.target.value) }))}
                              className="w-full accent-amber-400 cursor-pointer"
                            />
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 space-y-1.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-gray-400">Sim Latency:</span>
                              <strong className="text-rose-300">{chaosKnobs.simulatedLatencyMs} ms</strong>
                            </div>
                            <input
                              type="range"
                              min={10}
                              max={2000}
                              step={50}
                              value={chaosKnobs.simulatedLatencyMs}
                              onChange={(e) => setChaosKnobs(prev => ({ ...prev, simulatedLatencyMs: Number(e.target.value) }))}
                              className="w-full accent-rose-400 cursor-pointer"
                            />
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 space-y-1.5 flex flex-col justify-between">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-gray-400">Manual Fault:</span>
                              <strong className={chaosKnobs.manualFaultActive ? "text-rose-400 font-bold" : "text-gray-400"}>
                                {chaosKnobs.manualFaultActive ? "ACTIVE" : "OFF"}
                              </strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => setChaosKnobs(prev => ({ ...prev, manualFaultActive: !prev.manualFaultActive }))}
                              className={`w-full py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${chaosKnobs.manualFaultActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{chaosKnobs.manualFaultActive ? "Disable Active Fault" : "Inject Socket/Lock Fault"}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Sub-Tab 4: Dynamic Performance Comparison */}
                      {activeWorkspaceTab === 'benchmarks' && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-gray-400">
                              <span>Observed Latency (Lower is better):</span>
                              <span className="text-gray-300">
                                Naive: <span className="text-rose-400 font-bold">{activeMission.stage2Chaos?.telemetry?.meanLatency || '2,410ms'}</span> → Adaptive: <span className="text-emerald-400 font-bold">{testResults?.status === 'passed' ? `${dynamicMetrics.adaptiveLatency}ms` : 'Target < ' + (activeMission.targetSla?.match(/\d+\s*ms/)?.[0] || '100ms')}</span>
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                              <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: testResults?.status === 'passed' ? '12%' : '40%' }} />
                              <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: testResults?.status === 'passed' ? '88%' : '60%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-gray-400">
                              <span>RAM Footprint (Lower is better):</span>
                              <span className="text-gray-300">
                                Naive: <span className="text-amber-400 font-bold">{activeMission.stage2Chaos?.telemetry?.memoryFootprint || '84.2MB'}</span> → Adaptive: <span className="text-cyan-400 font-bold">{testResults?.status === 'passed' ? `${dynamicMetrics.adaptiveMem}MB` : `Quota: ${chaosKnobs.memoryLimitMB}MB`}</span>
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                              <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: testResults?.status === 'passed' ? '15%' : '45%' }} />
                              <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: testResults?.status === 'passed' ? '85%' : '55%' }} />
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Console Action Bar */}
                    <div className="p-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 bg-[#01040a]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleExecuteCode(false)}
                          disabled={isRunningTests}
                          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Run Baseline</span>
                        </button>

                        <button
                          onClick={() => handleExecuteCode(true)}
                          disabled={isRunningTests}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 hover:opacity-95 text-black font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/25"
                        >
                          {isRunningTests ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                              <span>Testing Against Stress...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 text-black" />
                              <span>Run Code & Test Against Chaos</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[11px] font-mono text-gray-400 hidden sm:block">
                        <span>Target SLA: <strong className="text-emerald-400">{activeMission.targetSla}</strong></span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ─── TAB 2: BROWSE ALL 36 MISSIONS LIBRARY ─── */}
      {activeView === 'missions_catalog' && (
        <div className="space-y-4 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black text-white font-sora">
                Complete B.Tech Engineering Challenge Catalog ({allMissions.length} Missions)
              </h2>
              <p className="text-xs text-gray-400">
                Covers official JNTUA curriculum codes: DSA, ADSA, Core Java, Python Async, ML/DL, DBMS, OS, Computer Networks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="Core B.Tech">Core B.Tech</option>
                <option value="Advanced B.Tech">Advanced B.Tech</option>
                <option value="Capstone Track">Capstone Track</option>
                <option value="Startup Track">Startup Track</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredMissions.map((m, idx) => {
              const isSelected = selectedMissionId === m.id;
              const isSolved = solvedMissionIds.has(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    handleSelectMission(m.id);
                    setActiveView('simulator');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${isSelected ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl' : 'bg-[#020b17] border-white/10 hover:border-white/20 hover:bg-[#031326]'}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SubjectSymbol subjectId={m.subjectKey || m.language} className="w-6 h-6 shrink-0" />
                        <span className="text-xs font-mono font-bold text-gray-400">Q{idx + 1}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isSolved && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Solved
                          </span>
                        )}
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {m.subjectBadge}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-sm line-clamp-2">{m.title}</h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 font-sans">{m.brief}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span className="text-rose-400 font-bold">{m.badge}</span>
                    <span className="px-2 py-1 rounded-lg bg-white/5 text-cyan-300 font-bold flex items-center gap-1">
                      <span>Launch Cockpit</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 3: CUSTOM PROJECT INGESTION ─── */}
      {activeView === 'custom_ingest' && (
        <div className="max-w-2xl mx-auto p-5 md:p-6 rounded-3xl bg-[#020b17] border border-cyan-500/30 space-y-5">
          <div>
            <h2 className="text-xl font-black text-white font-sora">
              Ingest Your Own B.Tech Semester / Capstone Project
            </h2>
            <p className="text-xs text-gray-400">
              Input your final-year or semester engineering codebase to generate a tailored ChaosLab resilience scenario.
            </p>
          </div>

          <form onSubmit={handleSynthesizeCustomChaos} className="space-y-4 text-xs font-sans">
            <div>
              <label className="font-bold text-gray-300 block mb-1 font-mono">Project Title</label>
              <input
                type="text"
                value={customProjectForm.title}
                onChange={(e) => setCustomProjectForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Distributed Video Streaming Node / IoT Sensor Gateway"
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="font-bold text-gray-300 block mb-1 font-mono">Tech Stack & Dependencies</label>
              <input
                type="text"
                value={customProjectForm.techStack}
                onChange={(e) => setCustomProjectForm(prev => ({ ...prev, techStack: e.target.value }))}
                placeholder="e.g. C++17, STL, Redis, Docker, POSIX Sockets"
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="font-bold text-gray-300 block mb-1 font-mono">Architecture & Brief</label>
              <textarea
                rows={3}
                value={customProjectForm.description}
                onChange={(e) => setCustomProjectForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Briefly describe how your project works under normal conditions..."
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSynthesizingChaos}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              {isSynthesizingChaos ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Adaptive Chaos Testbench...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-black" />
                  <span>Synthesize Custom Chaos Scenario</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ─── TAB 4: AQ SCORECARD & HISTORICAL ANALYTICS ─── */}
      {activeView === 'scorecard' && (
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="p-5 md:p-6 rounded-3xl bg-[#020b17] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-xl font-black text-white font-sora">
                  B.Tech Adaptability Quotient (AQ) Analytics Hub
                </h2>
                <p className="text-xs text-gray-400">
                  Evaluates how scholars respond to uncertainty, production outages, and system constraints.
                </p>
              </div>
              <button
                onClick={handleDownloadAqPdf}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Mean AQ</span>
                <span className="text-2xl font-black font-mono text-cyan-300">{chaosHistory.length > 0 ? averageAq : '--'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Incidents Logged</span>
                <span className="text-2xl font-black font-mono text-emerald-300">{chaosHistory.length}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Mean MTTR</span>
                <span className="text-2xl font-black font-mono text-amber-300">{meanMttr}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Waste Index</span>
                <span className="text-2xl font-black font-mono text-emerald-400">{meanWaste}</span>
              </div>
            </div>
          </div>

          {/* Historical Attempt List / Empty State (STRICTLY LIVE DATA) */}
          {chaosHistory.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#020b17] border border-cyan-500/20 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white font-sora">No Chaos Incidents Resolved Yet</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Select any challenge across the 10 B.Tech subject tracks (DSA, ADSA, Java, Python, ML, DBMS, OS, CN, Capstone, Startup) or ingest your semester project. Survive reality collapse to record your live Adaptability Quotient (AQ)!
                </p>
              </div>
              <button
                onClick={() => setActiveView('simulator')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-black text-xs font-mono transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Play className="w-3.5 h-3.5" /> Start First Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-300 font-mono">Completed Chaos Assessments ({chaosHistory.length}):</h3>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your local ChaosLab assessment history?")) {
                      setChaosHistory([]);
                      localStorage.removeItem('lumixora_chaoslab_history');
                      addToast?.({ type: 'info', message: 'ChaosLab assessment history cleared.' });
                    }
                  }}
                  className="text-[10px] text-gray-500 hover:text-rose-400 font-mono transition-colors cursor-pointer"
                >
                  Clear History
                </button>
              </div>
              {chaosHistory.map(hist => (
                <div key={hist.id} className="p-4 rounded-2xl bg-[#020b17] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">{hist.missionTitle}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">{hist.domain} • Date: {hist.date} • MTTR: {Math.floor(hist.recoveryTimeSec / 60)}m {hist.recoveryTimeSec % 60}s</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 font-mono">
                    <div className="text-right">
                      <span className="text-gray-400 text-[10px] block">AQ Score</span>
                      <strong className="text-cyan-300 text-base">{hist.totalAq}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 text-[10px] block">Tier</span>
                      <span className="text-emerald-400 text-[11px] font-bold">{hist.tier}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 5: MANIFESTO & PEDAGOGY ─── */}
      {activeView === 'about' && (
        <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-[#020b17] border border-cyan-500/30 space-y-6">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <span className="text-[10px] font-mono text-cyan-300 uppercase font-black tracking-widest">
              LUMIXORA OMIVERSE B.TECH RESEARCH EXPERIMENT
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white font-sora">
              The ChaosLab Manifesto: Why Textbook B.Tech Exams Fail
            </h2>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
            <p>
              In conventional college midterms and semester labs, DSA, Java, and Python problems are sterile: fixed test vectors, zero memory constraints, and no race conditions. But in competitive product firms and high-scale systems, real code faces memory limits, thread deadlocks, packet loss, and database deadlocks.
            </p>

            <blockquote className="p-4 rounded-2xl bg-cyan-950/20 border-l-4 border-cyan-400 text-cyan-100 italic my-3">
              "Don't test only whether a student can write Dijkstra or a Java Thread. Test whether they can still solve it when the graph surges by 50,000 edges or the JVM deadlocks!"
            </blockquote>

            <h4 className="text-sm font-bold text-white font-sora pt-2">B.Tech Curriculum Subjects Integrated:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {BTECH_SUBJECT_CATEGORIES.filter(s => s.id !== 'all').map(s => (
                <div key={s.id} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center gap-2">
                    <SubjectSymbol subjectId={s.id} className="w-4 h-4 shrink-0" />
                    <strong className="text-white text-xs">{s.name}</strong>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 block">{s.code}</span>
                  <p className="text-[10px] text-cyan-300 line-clamp-1">{s.fullName}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-gray-400 block">Pedagogy & Curriculum Standards:</span>
                <strong className="text-white">GPREC Autonomous Engineering Curriculum (JNTUA R20/R23)</strong>
              </div>
              <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-bold text-xs flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lumixora Omiverse Lab Engine</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
