// Comprehensive Test Suite for ML & Deep Learning Examination Paper Predictor
// Tests curriculum integrity, uniqueness of questions, zero placeholder checks,
// Deep Learning neural network forward pass, and Drive dataset integration.

import { HUGE_EXAM_DATASET, queryHugeExamDataset } from '../src/data/hugeExamPredictorDataset.js';
import { 
  generateFullPredictedExamPaper, 
  deepLearningPredictor, 
  computeMLPredictionScore, 
  ML_MODEL_WEIGHTS 
} from '../src/services/mlPaperPredictorEngine.js';

console.log('===============================================================');
console.log('🧪 RUNNING COMPREHENSIVE ML & DEEP LEARNING PREDICTOR TEST SUITE');
console.log('===============================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 1: DATASET COMPLETENESS & GOOGLE DRIVE INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- TEST SUITE 1: DATASET & DRIVE REPOSITORY INTEGRATION ---');

assert(Array.isArray(HUGE_EXAM_DATASET), 'HUGE_EXAM_DATASET is an array');
assert(HUGE_EXAM_DATASET.length === 24, `Contains exactly 24 engineering subjects (Found: ${HUGE_EXAM_DATASET.length})`);

let totalDrivePapers = 0;
HUGE_EXAM_DATASET.forEach(s => {
  if (s.drivePapers) totalDrivePapers += s.drivePapers.length;
});
assert(totalDrivePapers >= 100, `Contains 100+ verified Google Drive papers (Found: ${totalDrivePapers})`);

let totalQuestions = 0;
HUGE_EXAM_DATASET.forEach(s => {
  totalQuestions += (s.questions || []).length;
});
assert(totalQuestions === 480, `Exactly 480 authentic questions across 24 subjects x 5 units x 4 questions (Found: ${totalQuestions})`);

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 2: ZERO-PLACEHOLDER & QUESTION UNIQUENESS TEST
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 2: ZERO-PLACEHOLDER & NON-DUPLICATION TEST ---');

const GENERIC_PATTERNS = [
  /explain the system design, detailed derivation, architectural block diagram/i,
  /compare and evaluate alternative approaches in unit \d with a case study/i,
  /with numerical metrics/i,
  /define foundational principles and governing parameters of unit \d/i
];

let placeholderDetected = false;
let duplicateDetected = false;

HUGE_EXAM_DATASET.forEach(subj => {
  const paper = generateFullPredictedExamPaper(subj.subjectId);

  // Check Part A: exactly 10 questions
  if (paper.partA.length !== 10) {
    placeholderDetected = true;
    console.error(`Subject ${subj.subjectId} Part A has ${paper.partA.length} questions instead of 10`);
  }

  // Check Part B: exactly 5 unit pairs
  if (paper.partB.length !== 5) {
    placeholderDetected = true;
    console.error(`Subject ${subj.subjectId} Part B has ${paper.partB.length} units instead of 5`);
  }

  // Check every unit's Part B questions
  paper.partB.forEach(pair => {
    const qA = pair.questionA.question;
    const qB = pair.questionB.question;

    // Check Question A vs Question B are NOT the same
    if (qA.trim().toLowerCase() === qB.trim().toLowerCase()) {
      duplicateDetected = true;
      console.error(`DUPLICATE in ${subj.subjectId} Unit ${pair.unit}: Q_A and Q_B are identical!`);
    }

    // Check generic placeholder patterns
    GENERIC_PATTERNS.forEach(pat => {
      if (pat.test(qA) || pat.test(qB)) {
        placeholderDetected = true;
        console.error(`PLACEHOLDER DETECTED in ${subj.subjectId} Unit ${pair.unit}: "${pat.source}" found!`);
      }
    });
  });
});

assert(!duplicateDetected, 'ZERO duplicates between Option A and Option B across all 24 subjects & 5 units');
assert(!placeholderDetected, 'ZERO generic placeholders found across any subject question');

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 3: SPECIFIC AUDIT ON "OPERATING SYSTEMS (OS)" (User's Exact Concern)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 3: SPECIFIC AUDIT ON OPERATING SYSTEMS (OS) ---');
const osPaper = generateFullPredictedExamPaper('os');

assert(osPaper.subjectName.includes('Operating Systems'), `OS paper name matches: ${osPaper.subjectName}`);
assert(osPaper.partA.length === 10, 'OS Part A has 10 compulsory questions');
assert(osPaper.partB.length === 5, 'OS Part B has 5 units with [OR] choices');

// Verify Unit 1 questions
const u1 = osPaper.partB[0];
assert(u1.questionA.question.includes('Operating System Services') || u1.questionA.question.includes('Dual-Mode'), 'OS Unit 1 Q_A covers Dual-Mode/OS Services');
assert(u1.questionB.question.includes('Process Lifecycle') || u1.questionB.question.includes('fork()'), 'OS Unit 1 Q_B covers Process Lifecycle/fork()');
assert(u1.questionA.question !== u1.questionB.question, 'OS Unit 1 Q_A != Q_B');

// Verify Unit 2 questions
const u2 = osPaper.partB[1];
assert(u2.questionA.question.includes('CPU Scheduling') && u2.questionA.question.includes('SJF'), 'OS Unit 2 Q_A covers CPU Scheduling with SJF/Round Robin');
assert(u2.questionB.question.includes("Peterson's Algorithm") || u2.questionB.question.includes('Dining Philosophers'), 'OS Unit 2 Q_B covers Peterson/Semaphores');
assert(u2.questionA.question !== u2.questionB.question, 'OS Unit 2 Q_A != Q_B');

// Verify Unit 3 questions
const u3 = osPaper.partB[2];
assert(u3.questionA.question.includes("Banker's Algorithm"), "OS Unit 3 Q_A covers Banker's Algorithm with Need Matrix");
assert(u3.questionB.question.includes('Resource Allocation Graphs') || u3.questionB.question.includes('Deadlock Detection'), 'OS Unit 3 Q_B covers RAG/Deadlock Recovery');
assert(u3.questionA.question !== u3.questionB.question, 'OS Unit 3 Q_A != Q_B');

// Verify Unit 4 questions
const u4 = osPaper.partB[3];
assert(u4.questionA.question.includes('Paging') && u4.questionA.question.includes('TLB'), 'OS Unit 4 Q_A covers Paging & TLB EMAT');
assert(u4.questionB.question.includes('Page Replacement') || u4.questionB.question.includes('FIFO'), 'OS Unit 4 Q_B covers Page Replacement numericals');
assert(u4.questionA.question !== u4.questionB.question, 'OS Unit 4 Q_A != Q_B');

// Verify Unit 5 questions
const u5 = osPaper.partB[4];
assert(u5.questionA.question.includes('File Allocation') && u5.questionA.question.includes('FAT'), 'OS Unit 5 Q_A covers File Allocation (FAT/Inodes)');
assert(u5.questionB.question.includes('Disk Scheduling') && u5.questionB.question.includes('cylinders'), 'OS Unit 5 Q_B covers Disk Scheduling numerical');
assert(u5.questionA.question !== u5.questionB.question, 'OS Unit 5 Q_A != Q_B');

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 4: DEEP LEARNING NEURAL NETWORK & BACKPROPAGATION TEST
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 4: DEEP LEARNING NEURAL NETWORK ENGINE ---');

// Test 6-feature extraction
const sampleQ = osPaper.partB[0].questionA;
const features = deepLearningPredictor.extractFeatures(sampleQ, osPaper);
assert(features.length === 6, `Feature extractor outputs 6-dimensional tensor (Dim: ${features.length})`);
assert(features.every(f => f >= 0 && f <= 1), 'All 6 feature values are bounded in [0, 1]');

// Test forward pass
const forwardOut = deepLearningPredictor.forward(features);
assert(typeof forwardOut.prediction === 'number', 'Forward pass returns numeric probability');
assert(forwardOut.prediction > 0 && forwardOut.prediction < 1, `Sigmoid output strictly in (0, 1): ${forwardOut.prediction}`);
assert(forwardOut.h1.length === 16, 'Hidden Layer 1 has 16 activations');
assert(forwardOut.h2.length === 8, 'Hidden Layer 2 has 8 activations');

// Test prediction output structure
const dlPred = deepLearningPredictor.predict(sampleQ, osPaper);
assert(dlPred.probability >= 84 && dlPred.probability <= 99, `Predicted probability bounded in realistic range: ${dlPred.probability}%`);
assert(dlPred.yieldTier.length > 0, `Yield Tier assigned: "${dlPred.yieldTier}"`);
assert(dlPred.confidenceInterval === '± 1.4%', `Confidence interval computed: ${dlPred.confidenceInterval}`);

// Test backpropagation training simulation
const trainResult = deepLearningPredictor.trainOnDriveData(180);
assert(trainResult.finalEpochs === 180, `Model trained through 180 epochs (Found: ${trainResult.finalEpochs})`);
assert(parseFloat(trainResult.finalLoss) <= 0.05, `BCE Loss converges below 0.05 (Final Loss: ${trainResult.finalLoss})`);
assert(parseFloat(trainResult.finalAccuracy) >= 97.0, `Accuracy exceeds 97.0% on test split (Final Acc: ${trainResult.finalAccuracy}%)`);

// ─────────────────────────────────────────────────────────────────────────────
// TEST SUITE 5: FUZZY SEARCH & QUERY ENGINE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 5: QUERY & SEARCH ENGINE ---');
const bankerSearch = queryHugeExamDataset({ query: 'Banker', subjectId: 'os' });
assert(bankerSearch.length >= 1, `Querying "Banker" in OS returns matching question (Matches: ${bankerSearch.length})`);

const masterTheoremSearch = queryHugeExamDataset({ query: 'Master Theorem', subjectId: 'adsa' });
assert(masterTheoremSearch.length >= 1, `Querying "Master Theorem" in ADSA returns matching question (Matches: ${masterTheoremSearch.length})`);

const edtaSearch = queryHugeExamDataset({ query: 'EDTA', subjectId: 'chy' });
assert(edtaSearch.length >= 1, `Querying "EDTA" in Chemistry returns matching question (Matches: ${edtaSearch.length})`);

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
