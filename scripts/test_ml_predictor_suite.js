/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Autonomous Engineering Examination Predictor Engine Verification Suite
 * Tests 100% authenticity, zero-placeholder guarantee, dual-set generation,
 * subject auto-detection, and Deep Learning MLP neural network accuracy.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { HUGE_EXAM_DATASET, queryHugeExamDataset } from '../src/data/hugeExamPredictorDataset.js';
import { 
  generateFullPredictedExamPaper, 
  generatePredictedModelSets, 
  deepLearningPredictor,
  detectSubjectFromText,
  parseSubmittedPaperText
} from '../src/services/mlPaperPredictorEngine.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('===============================================================');
console.log('🧪 RUNNING COMPREHENSIVE AUTONOMOUS PREDICTOR TEST SUITE (v2)');
console.log('===============================================================');

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 1: DATASET COMPLETENESS & 960 AUTHENTIC QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 1: DATASET INTEGRITY & CAPACITY ---');
assert(HUGE_EXAM_DATASET.length === 24, `Contains all 24 core engineering subjects (Found: ${HUGE_EXAM_DATASET.length})`);

let totalDrivePapers = 0;
HUGE_EXAM_DATASET.forEach(s => {
  if (s.drivePapers) totalDrivePapers += s.drivePapers.length;
});
assert(totalDrivePapers >= 100, `Contains 100+ verified Google Drive papers (Found: ${totalDrivePapers})`);

let totalQuestions = 0;
HUGE_EXAM_DATASET.forEach(s => {
  totalQuestions += (s.questions || []).length;
});
assert(totalQuestions === 960, `Exactly 960 authentic questions across 24 subjects x 5 units x 8 questions (Found: ${totalQuestions})`);

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 2: ZERO-PLACEHOLDER & DUAL-SET (SET A & SET B) UNIQUENESS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 2: ZERO-PLACEHOLDER & DUAL-SET NON-DUPLICATION TEST ---');

const GENERIC_PATTERNS = [
  /explain the system design, detailed derivation, architectural block diagram/i,
  /compare and evaluate alternative approaches in unit \d with a case study/i,
  /analyze the detailed operational mechanism, algorithmic procedures, and mathematical modeling/i,
  /evaluate the design trade-offs, state transition models, and optimization strategies in/i,
  /from submitted paper/i,
  /with numerical metrics/i
];

let placeholderDetected = false;
let duplicateDetected = false;

HUGE_EXAM_DATASET.forEach(subj => {
  const modelSets = generatePredictedModelSets(subj.subjectId);
  const set1 = modelSets.set1;
  const set2 = modelSets.set2;

  // Check Set 1 structure
  if (set1.partA.length !== 10) {
    placeholderDetected = true;
    console.error(`Subject ${subj.subjectId} Set 1 Part A has ${set1.partA.length} questions instead of 10`);
  }
  if (set1.partB.length !== 5) {
    placeholderDetected = true;
    console.error(`Subject ${subj.subjectId} Set 1 Part B has ${set1.partB.length} units instead of 5`);
  }

  // Check Set 2 structure
  if (set2.partA.length !== 10) {
    placeholderDetected = true;
    console.error(`Subject ${subj.subjectId} Set 2 Part A has ${set2.partA.length} questions instead of 10`);
  }
  if (set2.partB.length !== 5) {
    placeholderDetected = true;
    console.error(`Subject ${subj.subjectId} Set 2 Part B has ${set2.partB.length} units instead of 5`);
  }

  // Verify Set 1 Part B questions
  set1.partB.forEach(pair => {
    const qA = pair.questionA.question;
    const qB = pair.questionB.question;
    if (qA.trim().toLowerCase() === qB.trim().toLowerCase()) {
      duplicateDetected = true;
      console.error(`DUPLICATE in ${subj.subjectId} Set 1 Unit ${pair.unit}: Q_A and Q_B are identical!`);
    }
    GENERIC_PATTERNS.forEach(pat => {
      if (pat.test(qA) || pat.test(qB)) {
        placeholderDetected = true;
        console.error(`PLACEHOLDER in ${subj.subjectId} Set 1 Unit ${pair.unit}: "${pat.source}" found!`);
      }
    });
  });

  // Verify Set 2 Part B questions
  set2.partB.forEach(pair => {
    const qA = pair.questionA.question;
    const qB = pair.questionB.question;
    if (qA.trim().toLowerCase() === qB.trim().toLowerCase()) {
      duplicateDetected = true;
      console.error(`DUPLICATE in ${subj.subjectId} Set 2 Unit ${pair.unit}: Q_A and Q_B are identical!`);
    }
    GENERIC_PATTERNS.forEach(pat => {
      if (pat.test(qA) || pat.test(qB)) {
        placeholderDetected = true;
        console.error(`PLACEHOLDER in ${subj.subjectId} Set 2 Unit ${pair.unit}: "${pat.source}" found!`);
      }
    });
  });

  // Verify Set 1 questions vs Set 2 questions are distinct!
  for (let uIdx = 0; uIdx < 5; uIdx++) {
    const s1_qA = set1.partB[uIdx].questionA.question;
    const s2_qA = set2.partB[uIdx].questionA.question;
    if (s1_qA.trim().toLowerCase() === s2_qA.trim().toLowerCase()) {
      duplicateDetected = true;
      console.error(`DUPLICATE across Sets in ${subj.subjectId} Unit ${uIdx + 1}: Set 1 and Set 2 Option A are identical!`);
    }
  }
});

assert(!duplicateDetected, 'ZERO duplicates within or across Set 1 and Set 2 across all 24 subjects');
assert(!placeholderDetected, 'ZERO generic placeholders found in any subject question across Set 1 & Set 2');

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 3: SPECIFIC AUDIT ON COMPUTER VISION & IMAGE PROCESSING (CVIP)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 3: SPECIFIC AUDIT ON CVIP (User Upload Document) ---');
const cvipSets = generatePredictedModelSets('cvip');

assert(cvipSets.set1.subjectName.includes('Computer Vision'), `CVIP paper name matches: ${cvipSets.set1.subjectName}`);
assert(cvipSets.set1.partA.length === 10, 'CVIP Set 1 Part A has 10 compulsory questions');
assert(cvipSets.set1.partB.length === 5, 'CVIP Set 1 Part B has 5 units with [OR] choices');

// Check Unit 3 (3D Vision and Motion Analysis)
const cvipU3_s1 = cvipSets.set1.partB[2];
const cvipU3_s2 = cvipSets.set2.partB[2];

assert(cvipU3_s1.questionA.question.includes('Stereo Vision') && cvipU3_s1.questionA.question.includes('Z = fB/d'), 'CVIP Unit 3 Set 1 Q_A covers Stereo Vision & Depth Formula numerical');
assert(cvipU3_s1.questionB.question.includes('Epipolar Geometry') && cvipU3_s1.questionB.question.includes('Fundamental Matrix'), 'CVIP Unit 3 Set 1 Q_B covers Epipolar Geometry & Fundamental Matrix');
assert(cvipU3_s2.questionA.question.includes('Disparity Mapping'), 'CVIP Unit 3 Set 2 Q_A covers Disparity Mapping & Correspondence');
assert(cvipU3_s2.questionB.question.includes('Structure from Motion') || cvipU3_s2.questionB.question.includes('Camera Calibration'), 'CVIP Unit 3 Set 2 Q_B covers SfM / Camera Calibration');

// Check Part A 2M questions for CVIP Unit 3
const cvipPartA_u3 = cvipSets.set1.partA.filter(q => q.unit === 3);
assert(cvipPartA_u3.length === 2, 'CVIP Set 1 Part A has 2 short questions for Unit 3');
assert(cvipPartA_u3[0].question.includes('3D Vision') || cvipPartA_u3[1].question.includes('Stereo Vision'), 'CVIP Unit 3 Part A questions cover 3D/Stereo Vision definitions');

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 4: SUBJECT AUTO-DETECTION FROM DOCUMENT TEXT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 4: SUBJECT AUTO-DETECTION ENGINE ---');

const cvipSampleText = `
UNIT – III: 3D Vision and Motion Analysis
Stereo Vision, Epipolar Geometry, Disparity Mapping
Structure from Motion (SfM), Feature Tracking Across Frames
Camera Calibration: Intrinsic and Extrinsic Parameters
Z = fB / d
`;
const detectedCvip = detectSubjectFromText(cvipSampleText, 'UNIT_3.pdf', HUGE_EXAM_DATASET);
assert(detectedCvip === 'cvip', `Auto-detected CVIP from 3D Vision & Motion Analysis notes (Detected: ${detectedCvip})`);

const osSampleText = `
Unit 2: CPU Scheduling & Process Synchronization
Banker's Algorithm for Deadlock Avoidance, Need Matrix, Safe State
Semaphores, Peterson's Algorithm, Round Robin scheduling
`;
const detectedOs = detectSubjectFromText(osSampleText, 'OS_Mid_Paper.txt', HUGE_EXAM_DATASET);
assert(detectedOs === 'os', `Auto-detected OS from Process Scheduling & Deadlock notes (Detected: ${detectedOs})`);

const dcdSampleText = `
Design a BCD-to-Excess-3 Code Converter using K-Maps and logic gates.
Implement 8-to-1 Multiplexer and J-K Master Slave Flip Flop.
`;
const detectedDcd = detectSubjectFromText(dcdSampleText, 'DLD_Paper.pdf', HUGE_EXAM_DATASET);
assert(detectedDcd === 'dcd', `Auto-detected DCD from K-Map & Multiplexer notes (Detected: ${detectedDcd})`);

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 5: AUTHENTIC QUESTION EXTRACTION (NO GENERIC DUMMIES)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 5: QUESTION EXTRACTOR ON UPLOADED NOTES ---');

const uploadedNotesSnippet = `
PART – F: MOST IMPORTANT EXAM QUESTIONS
Long-answer questions (8–10 marks)
1. Explain Stereo Vision with a neat diagram. Describe its working principle and depth estimation formula.
2. Explain Epipolar Geometry with a neat diagram. Discuss epipole, epipolar plane and epipolar lines.
3. Explain Disparity Mapping and its role in depth estimation with a flowchart.
Short-answer questions (2–5 marks)
1. Define 3D Vision.
2. What is Stereo Vision?
3. Define Baseline and Disparity.
`;
const cvipSubj = HUGE_EXAM_DATASET.find(s => s.subjectId === 'cvip');
const extractedQs = parseSubmittedPaperText(uploadedNotesSnippet, cvipSubj, 'UNIT_3_Vision.pdf');

assert(extractedQs.length >= 6, `Extracted ${extractedQs.length} authentic questions from notes`);
assert(extractedQs.some(q => q.marks === 10 && q.question.includes('Stereo Vision')), 'Extracted 10M Stereo Vision question');
assert(extractedQs.some(q => q.marks === 2 && q.question.includes('3D Vision')), 'Extracted 2M 3D Vision question');
assert(!extractedQs.some(q => q.question.includes('from submitted paper [')), 'ZERO "from submitted paper [filename]" placeholder strings');

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 6: DEEP LEARNING NEURAL NETWORK & BACKPROPAGATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 6: DEEP LEARNING NEURAL NETWORK ENGINE ---');
const osPaper = generateFullPredictedExamPaper('os');
const sampleQ = osPaper.partB[0].questionA;
const features = deepLearningPredictor.extractFeatures(sampleQ, osPaper);

assert(features.length === 6, `Feature extractor outputs 6-dimensional tensor (Dim: ${features.length})`);
assert(features.every(f => f >= 0 && f <= 1), 'All 6 feature values are bounded in [0, 1]');

const forwardOut = deepLearningPredictor.forward(features);
assert(typeof forwardOut.prediction === 'number', 'Forward pass returns numeric probability');
assert(forwardOut.prediction > 0 && forwardOut.prediction < 1, `Sigmoid output strictly in (0, 1): ${forwardOut.prediction}`);

const dlPred = deepLearningPredictor.predict(sampleQ, osPaper);
assert(dlPred.probability >= 84 && dlPred.probability <= 99, `Predicted probability bounded in realistic range: ${dlPred.probability}%`);

const trainResult = deepLearningPredictor.trainOnDriveData(180);
assert(trainResult.finalEpochs === 180, `Model trained through 180 epochs (Found: ${trainResult.finalEpochs})`);
assert(parseFloat(trainResult.finalLoss) <= 0.05, `BCE Loss converges below 0.05 (Final Loss: ${trainResult.finalLoss})`);
assert(parseFloat(trainResult.finalAccuracy) >= 97.0, `Accuracy exceeds 97.0% on test split (Final Acc: ${trainResult.finalAccuracy}%)`);

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY REPORT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n===============================================================');
console.log(`📊 TEST SUITE SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${((passedTests/totalTests)*100).toFixed(1)}%)`);
if (failedTests === 0) {
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! ZERO ERRORS OR PLACEHOLDERS!');
} else {
  console.error(`⚠️ ${failedTests} TESTS FAILED!`);
}
console.log('===============================================================');

if (failedTests > 0) process.exit(1);
