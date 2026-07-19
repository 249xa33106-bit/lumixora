import { generateCognitiveChallenge } from '../src/services/aiService.js';

console.log("Testing generateCognitiveChallenge import...");
try {
  console.log("Function exists:", typeof generateCognitiveChallenge === 'function');
} catch (err) {
  console.error("Import failed:", err);
}
