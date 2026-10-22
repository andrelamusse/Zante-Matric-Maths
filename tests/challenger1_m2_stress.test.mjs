/**
 * Zante's Matric Maths Studio — Milestone M2 Empirical Stress Test Suite
 * Challenger 1 (EMPIRICAL CHALLENGER): Adversarial verification of Zante question generator and bank
 *
 * Test runner: Node.js native test runner (`node --test tests/challenger1_m2_stress.test.mjs`)
 * Assertions: `node:assert/strict`
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

// Register TypeScript hook
try {
  register('./tests/ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered
}

// Production Imports
const {
  ZANTE_QUESTIONS,
  getZanteQuestionsByCategory,
  getZanteQuestionById,
  getRandomZanteQuestion,
} = await import('../src/data/zanteQuestions.ts');

const {
  generateZanteQuestion,
  generateElementaryZante,
  generateIcedCoffeeZante,
  generatePassengerPrincessZante,
  generateGirlMathZante,
  generateFlirtyPrioritiesZante,
  generateMatricTropesZante,
  generateZanteQuestionBatch,
} = await import('../src/generators/zanteGenerator.ts');

const VALID_CATEGORIES = [
  'elementary',
  'iced_coffee',
  'passenger_princess',
  'girl_math',
  'flirty_priorities',
  'matric_tropes',
];

// Helper to validate complete question integrity
function assertQuestionIntegrity(q, context) {
  assert.ok(q, `${context}: question must not be null/undefined`);
  assert.equal(typeof q, 'object', `${context}: question must be an object`);

  // String serialization check for NaN, undefined, null
  const serialized = JSON.stringify(q);
  assert.ok(!serialized.includes('"NaN"'), `${context}: serialized JSON contains "NaN"`);
  assert.ok(!serialized.includes('NaN'), `${context}: serialized JSON contains NaN token`);
  assert.ok(!serialized.includes('"undefined"'), `${context}: serialized JSON contains "undefined"`);
  assert.ok(!serialized.includes('undefined'), `${context}: serialized JSON contains undefined`);
  assert.ok(!serialized.includes(':null'), `${context}: serialized JSON contains null field`);

  // Strict property checks
  assert.ok(typeof q.id === 'string' && q.id.trim().length > 0, `${context}: id must be non-empty string`);
  assert.ok(VALID_CATEGORIES.includes(q.category), `${context}: invalid category "${q.category}"`);
  assert.ok(typeof q.questionText === 'string' && q.questionText.trim().length > 0, `${context}: questionText must be non-empty`);
  assert.ok(typeof q.wittyToast === 'string' && q.wittyToast.trim().length > 0, `${context}: wittyToast must be non-empty`);
  assert.ok(typeof q.screenshotQuote === 'string' && q.screenshotQuote.trim().length > 0, `${context}: screenshotQuote must be non-empty`);

  // Options validation: array of exactly 4 strings
  assert.ok(Array.isArray(q.options), `${context}: options must be an array`);
  assert.equal(q.options.length, 4, `${context}: options array must have length 4, got ${q.options.length}`);

  for (let i = 0; i < 4; i++) {
    const opt = q.options[i];
    assert.ok(typeof opt === 'string', `${context}: option[${i}] must be string, got ${typeof opt}`);
    assert.ok(opt.trim().length > 0, `${context}: option[${i}] must be non-empty`);
    assert.ok(!opt.includes('NaN'), `${context}: option[${i}] contains "NaN"`);
    assert.ok(!opt.includes('undefined'), `${context}: option[${i}] contains "undefined"`);
    assert.ok(!opt.includes('null'), `${context}: option[${i}] contains "null"`);
  }

  // Uniqueness: all 4 options must be strictly distinct
  const uniqueOptions = new Set(q.options);
  assert.equal(
    uniqueOptions.size,
    4,
    `${context}: options contain duplicates: ${JSON.stringify(q.options)}`
  );

  // correctIndex: integer in [0, 3]
  assert.ok(Number.isInteger(q.correctIndex), `${context}: correctIndex must be an integer, got ${q.correctIndex}`);
  assert.ok(
    q.correctIndex >= 0 && q.correctIndex <= 3,
    `${context}: correctIndex must be between 0 and 3, got ${q.correctIndex}`
  );
  assert.ok(
    q.options[q.correctIndex] !== undefined && q.options[q.correctIndex] !== null,
    `${context}: option at correctIndex (${q.correctIndex}) does not exist`
  );
}

// =============================================================================
// SUITE 1: CURATED QUESTION BANK STRUCTURAL VALIDATION (ZANTE_QUESTIONS)
// =============================================================================
describe('Empirical Challenge Suite 1: Curated Zante Question Bank (30 Questions)', () => {
  it('should contain exactly 30 curated questions', () => {
    assert.equal(
      ZANTE_QUESTIONS.length,
      30,
      `Expected exactly 30 curated questions, got ${ZANTE_QUESTIONS.length}`
    );
  });

  it('should contain exactly 5 questions per category across all 6 categories', () => {
    const counts = {};
    for (const cat of VALID_CATEGORIES) {
      counts[cat] = 0;
    }

    for (const q of ZANTE_QUESTIONS) {
      assert.ok(VALID_CATEGORIES.includes(q.category), `Unknown category: ${q.category}`);
      counts[q.category]++;
    }

    for (const cat of VALID_CATEGORIES) {
      assert.equal(
        counts[cat],
        5,
        `Category ${cat} does not have exactly 5 questions (got ${counts[cat]})`
      );
    }
  });

  it('should enforce unique question IDs across all 30 curated questions', () => {
    const seenIds = new Set();
    for (const q of ZANTE_QUESTIONS) {
      assert.ok(!seenIds.has(q.id), `Duplicate ID detected: ${q.id}`);
      seenIds.add(q.id);
    }
    assert.equal(seenIds.size, 30);
  });

  it('should pass structural integrity and zero NaN/null/undefined for all 30 curated questions', () => {
    for (let i = 0; i < ZANTE_QUESTIONS.length; i++) {
      const q = ZANTE_QUESTIONS[i];
      assertQuestionIntegrity(q, `Curated[${i}:${q.id}]`);
      assert.ok(q.wittyToast.length >= 10, `Curated[${q.id}]: wittyToast too short`);
      assert.ok(q.screenshotQuote.length >= 10, `Curated[${q.id}]: screenshotQuote too short`);
    }
  });

  it('should verify helper methods: getZanteQuestionsByCategory, getZanteQuestionById, getRandomZanteQuestion', () => {
    for (const cat of VALID_CATEGORIES) {
      const filtered = getZanteQuestionsByCategory(cat);
      assert.equal(filtered.length, 5, `getZanteQuestionsByCategory("${cat}") returned ${filtered.length} questions`);
      for (const q of filtered) {
        assert.equal(q.category, cat);
      }
    }

    for (const q of ZANTE_QUESTIONS) {
      const found = getZanteQuestionById(q.id);
      assert.ok(found, `getZanteQuestionById failed for id ${q.id}`);
      assert.equal(found.id, q.id);
    }

    // Exclude test
    const excludeIds = ZANTE_QUESTIONS.slice(0, 10).map((q) => q.id);
    for (let i = 0; i < 50; i++) {
      const randomQ = getRandomZanteQuestion(excludeIds);
      assert.ok(randomQ && randomQ.id);
      assert.ok(!excludeIds.includes(randomQ.id), `Sampled excluded ID: ${randomQ.id}`);
    }
  });
});

// =============================================================================
// SUITE 2: HIGH-VOLUME EMPIRICAL STRESS TEST (3,000 RANDOMIZED ITERATIONS)
// =============================================================================
describe('Empirical Challenge Suite 2: High-Volume 3,000-Iteration Generator Stress Test', () => {
  it('should run 3,000 randomized iterations with 0 NaN, 0 undefined, 0 null, 4 unique options, and valid correctIndex', () => {
    const TOTAL_ITERATIONS = 3000;
    const categoryCounts = {};
    const correctIndexCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    let fallbackOptionCount = 0;
    const seenIds = new Set();

    for (const cat of VALID_CATEGORIES) {
      categoryCounts[cat] = 0;
    }

    const startTime = performance.now();

    for (let i = 0; i < TOTAL_ITERATIONS; i++) {
      // First 1,200 iterations: completely unconstrained random category
      // Next 1,800 iterations: 300 per category systematically
      let targetCat = undefined;
      if (i >= 1200) {
        const catIdx = Math.floor((i - 1200) / 300);
        targetCat = VALID_CATEGORIES[catIdx];
      }

      const q = generateZanteQuestion(targetCat);

      // Verify structural invariants
      assertQuestionIntegrity(q, `StressIter[${i}]`);

      // Track categories and indices
      categoryCounts[q.category]++;
      correctIndexCounts[q.correctIndex]++;

      // Track ID uniqueness
      assert.ok(!seenIds.has(q.id), `Duplicate generator ID generated: ${q.id} at iter ${i}`);
      seenIds.add(q.id);

      // Check for fallback "Option X" placeholder injection
      for (const opt of q.options) {
        if (/^Option \d+$/.test(opt)) {
          fallbackOptionCount++;
        }
      }
    }

    const elapsedMs = performance.now() - startTime;
    const avgUs = ((elapsedMs / TOTAL_ITERATIONS) * 1000).toFixed(2);

    console.log(`\n===============================================================`);
    console.log(` EMPIRICAL STRESS TEST METRICS (3,000 ITERATIONS)`);
    console.log(`===============================================================`);
    console.log(` Total Iterations executed:   ${TOTAL_ITERATIONS}`);
    console.log(` Total Elapsed Time:          ${elapsedMs.toFixed(2)} ms (${avgUs} μs/question)`);
    console.log(` Options Uniqueness Rate:     100.00% (0 duplicates in ${TOTAL_ITERATIONS * 4} options)`);
    console.log(` Zero NaN/undefined/null:     100.00% verified`);
    console.log(` Fallback "Option X" triggers: ${fallbackOptionCount}`);
    console.log(`---------------------------------------------------------------`);
    console.log(` Category Distribution:`);
    for (const cat of VALID_CATEGORIES) {
      const pct = ((categoryCounts[cat] / TOTAL_ITERATIONS) * 100).toFixed(1);
      console.log(`   - ${cat.padEnd(20)}: ${categoryCounts[cat]} (${pct}%)`);
    }
    console.log(`---------------------------------------------------------------`);
    console.log(` correctIndex Distribution:`);
    for (let idx = 0; idx < 4; idx++) {
      const pct = ((correctIndexCounts[idx] / TOTAL_ITERATIONS) * 100).toFixed(1);
      console.log(`   - Index ${idx}: ${correctIndexCounts[idx]} (${pct}%)`);
    }
    console.log(`===============================================================\n`);

    // Invariant assertions
    assert.equal(fallbackOptionCount, 0, `Expected 0 fallback options, got ${fallbackOptionCount}`);

    // Verify correctIndex distribution is balanced (each in [18%, 32%])
    for (let idx = 0; idx < 4; idx++) {
      const proportion = correctIndexCounts[idx] / TOTAL_ITERATIONS;
      assert.ok(
        proportion >= 0.18 && proportion <= 0.32,
        `correctIndex ${idx} out of expected uniform distribution range: ${proportion}`
      );
    }
  });
});

// =============================================================================
// SUITE 3: TARGETED INDIVIDUAL CATEGORY GENERATOR INVARIANTS (600 ITERATIONS)
// =============================================================================
describe('Empirical Challenge Suite 3: Targeted Generator Invariants (100 runs each = 600 runs)', () => {
  const generators = [
    { name: 'Elementary', cat: 'elementary', fn: generateElementaryZante },
    { name: 'IcedCoffee', cat: 'iced_coffee', fn: generateIcedCoffeeZante },
    { name: 'PassengerPrincess', cat: 'passenger_princess', fn: generatePassengerPrincessZante },
    { name: 'GirlMath', cat: 'girl_math', fn: generateGirlMathZante },
    { name: 'FlirtyPriorities', cat: 'flirty_priorities', fn: generateFlirtyPrioritiesZante },
    { name: 'MatricTropes', cat: 'matric_tropes', fn: generateMatricTropesZante },
  ];

  for (const gen of generators) {
    it(`should verify ${gen.name} generator across 100 runs`, () => {
      for (let i = 0; i < 100; i++) {
        const q = gen.fn();
        assert.equal(q.category, gen.cat, `${gen.name} question category mismatch`);
        assertQuestionIntegrity(q, `${gen.name}[${i}]`);
      }
    });
  }
});

// =============================================================================
// SUITE 4: BATCH GENERATOR VERIFICATION (750 QUESTIONS)
// =============================================================================
describe('Empirical Challenge Suite 4: Batch Question Generation (750 Questions)', () => {
  it('should correctly generate large batches across random and targeted categories', () => {
    const batchRandom = generateZanteQuestionBatch(500);
    assert.equal(batchRandom.length, 500);
    for (let i = 0; i < batchRandom.length; i++) {
      assertQuestionIntegrity(batchRandom[i], `BatchRandom[${i}]`);
    }

    const batchTargeted = generateZanteQuestionBatch(250, 'iced_coffee');
    assert.equal(batchTargeted.length, 250);
    for (let i = 0; i < batchTargeted.length; i++) {
      assert.equal(batchTargeted[i].category, 'iced_coffee');
      assertQuestionIntegrity(batchTargeted[i], `BatchTargeted[${i}]`);
    }
  });
});

// =============================================================================
// SUITE 5: ADVERSARIAL EDGE CASE MINING (DOUBLE-DOT & NUMBER FORMATTING)
// =============================================================================
describe('Empirical Challenge Suite 5: Adversarial Edge Case Mining', () => {
  it('should inspect Girl Math cash template for float formatting issues like "R50.5.00"', () => {
    let doubleDotFormattingCount = 0;
    const doubleDotSamples = [];

    // Run 500 girl math questions to sample template 3
    for (let i = 0; i < 500; i++) {
      const q = generateGirlMathZante();
      for (const opt of q.options) {
        // Regex matches double-dot patterns like "R123.5.00"
        if (/R\d+\.\d+\.00/.test(opt)) {
          doubleDotFormattingCount++;
          if (doubleDotSamples.length < 5) {
            doubleDotSamples.push({ qId: q.id, option: opt });
          }
        }
      }
    }

    console.log(`\nAdversarial Edge Case Finding: Double-dot string occurrences in 500 Girl Math runs: ${doubleDotFormattingCount}`);
    if (doubleDotSamples.length > 0) {
      console.log(`Samples found:`, JSON.stringify(doubleDotSamples, null, 2));
    }

    // Note: We document this observation in handoff report.
  });
});
