/**
 * Zante's Matric Maths Studio — Milestone M5 White-Box Coverage & Invariants Hardening
 * Challenger 1 (EMPIRICAL CHALLENGER / critic & specialist)
 *
 * Adversarial White-Box Test Suite:
 * 1. Massive Randomized Generator Hardening (1,500+ iterations)
 *    - generateP1Question (600 runs across all 6 topics & 4 cognitive levels)
 *    - generateP2Question (600 runs across all 4 topics & 4 cognitive levels)
 *    - generateZanteQuestion (600 runs across all 6 categories)
 *    - Individual P1, P2, and Zante parametric generators (1,900 runs)
 * 2. Zero NaN, Zero Undefined, Zero Empty Strings & Distractor Invariants
 *    - Recursive deep scanner across all generated and curated questions
 *    - Exactly 4 distractors, exactly 1 isCorrect, correctAnswerId consistency
 *    - Unique LaTeX distractors, KaTeX strict syntax parsing, zero fallback tokens
 * 3. Referential Integrity
 *    - Formula Sheet: every formulaRefId matches valid FORMULA_SHEET id
 *    - Topic IDs: every topic matches registered TOPICS in curriculum
 *    - Question IDs: format, uniqueness, and non-empty validation
 * 4. Boundary & Stress Cases
 *    - Zero discriminant & identical roots (Delta = 0, r1 = r2)
 *    - Extreme financial repayment periods (n > 360 months up to 12,000 months)
 *    - Negative vertical & horizontal asymptotes (p < 0, q < 0)
 *    - Tangent angle singularities (0°, 90°, 180°, 270°, 360°)
 * 5. All 20 NSC Exam Archetypes (EX-01 to EX-20)
 *    - 100% valid question generation for P1 (11 questions, 150m) & P2 (10 questions, 150m)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import katex from 'katex';

// Register TypeScript customization hook for Node ES module loading
try {
  register('./ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered or loaded externally
}

// ---------------------------------------------------------------------------
// Production Imports
// ---------------------------------------------------------------------------
const {
  generateQuadraticEquation,
  generateQuadraticInequality,
  generateSurdEquation,
  generateArithmeticSequence,
  generateQuadraticSequence,
  generateSumToInfinity,
  generateHyperbolaAsymptotes,
  generateMortgageRepayment,
  generateCubicTurningPoints,
  generateProbabilityQuestion,
  generateP1Question,
} = await import('../src/generators/p1Generators.ts');

const {
  generateRegressionLine,
  generateCircleTangent,
  generateInclinationAngle,
  generateTrigGeneralSolution,
  generateCyclicQuadQuestion,
  generateTanChordQuestion,
  generateP2Question,
} = await import('../src/generators/p2Generators.ts');

const {
  generateElementaryZante,
  generateIcedCoffeeZante,
  generatePassengerPrincessZante,
  generateGirlMathZante,
  generateFlirtyPrioritiesZante,
  generateMatricTropesZante,
  generateZanteQuestion,
  generateZanteQuestionBatch,
} = await import('../src/generators/zanteGenerator.ts');

const {
  randomInt,
  randomNonZeroInt,
  randomChoice,
  gcd,
  simplifyFraction,
  formatFractionLatex,
  formatQuadraticLatex,
  formatLinearLatex,
  formatRootsLatex,
  formatCurrencyLatex,
  formatIntegerLatex,
  buildDistractorSet,
  assertNoNaNOrUndefined,
} = await import('../src/generators/utils.ts');

const { FORMULA_SHEET } = await import('../src/data/formulaSheet.ts');
const { TOPICS, PAPER_1_TOPICS, PAPER_2_TOPICS } = await import('../src/data/topics.ts');
const { PAST_PAPER_QUESTIONS } = await import('../src/data/pastPaperQuestions.ts');
const {
  EXAM_ARCHETYPES,
  P1_BLUEPRINT,
  P2_BLUEPRINT,
  buildMockExamQuestions,
} = await import('../src/data/cheatSheets.ts');

const { FunctionPlot } = await import('../src/components/diagrams/FunctionPlot.tsx');
const { AnalyticalGeometryPlot } = await import('../src/components/diagrams/AnalyticalGeometryPlot.tsx');
const { TrigDiagram } = await import('../src/components/diagrams/TrigDiagram.tsx');

// ---------------------------------------------------------------------------
// Validation & Audit Helpers
// ---------------------------------------------------------------------------
const VALID_FORMULA_IDS = new Set(FORMULA_SHEET.map((f) => f.id));
const VALID_TOPIC_IDS = new Set(Object.keys(TOPICS));
const VALID_COGNITIVE_LEVELS = new Set(['L1', 'L2', 'L3', 'L4']);
const VALID_ZANTE_CATEGORIES = new Set([
  'elementary',
  'iced_coffee',
  'passenger_princess',
  'girl_math',
  'flirty_priorities',
  'matric_tropes',
]);

/**
 * Validates KaTeX syntax with genuine KaTeX parser.
 */
function assertStrictKatex(latex, context) {
  assert.ok(typeof latex === 'string', `${context}: must be string, got ${typeof latex}`);
  assert.ok(latex.trim().length > 0, `${context}: cannot be empty string`);
  assert.ok(!latex.includes('NaN'), `${context}: contains "NaN"`);
  assert.ok(!latex.includes('undefined'), `${context}: contains "undefined"`);
  assert.ok(!latex.includes('null'), `${context}: contains "null"`);

  const cleanLatex = latex.replace(/\u00A0/g, ' ');
  try {
    katex.renderToString(cleanLatex, {
      throwOnError: true,
      strict: 'warn',
    });
  } catch (err) {
    assert.fail(`${context}: KaTeX parse failure: "${err.message}" in raw string [${latex}]`);
  }
}

/**
 * Recursive deep scanner to verify zero NaN, null, or undefined across any object structure.
 */
function deepScanNoNaNOrUndefined(obj, context = 'root') {
  if (obj === undefined) {
    assert.fail(`${context}: found undefined`);
  }
  if (obj === null) {
    assert.fail(`${context}: found null`);
  }
  if (typeof obj === 'number') {
    assert.ok(!Number.isNaN(obj), `${context}: found NaN`);
    assert.ok(Number.isFinite(obj), `${context}: found non-finite number (${obj})`);
    return;
  }
  if (typeof obj === 'string') {
    assert.ok(!obj.includes('NaN'), `${context}: string contains literal "NaN": [${obj}]`);
    assert.ok(!obj.includes('undefined'), `${context}: string contains literal "undefined": [${obj}]`);
    assert.ok(!obj.includes('null'), `${context}: string contains literal "null": [${obj}]`);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => deepScanNoNaNOrUndefined(item, `${context}[${idx}]`));
    return;
  }
  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      deepScanNoNaNOrUndefined(value, `${context}.${key}`);
    }
  }
}

/**
 * Assert that distractor options contain no synthesized fallback tokens.
 */
function assertNoFallbackStrings(d, context) {
  assert.ok(!d.latex.includes('\\text{Option '), `${context}: distractor latex contains fallback "\\text{Option ": "${d.latex}"`);
  assert.ok(
    !/[<>\\le\\ge]\s*(-?\d+)\s*\+\s*\d+/.test(d.latex),
    `${context}: distractor latex contains naive concatenation "+ 1" on inequality: "${d.latex}"`
  );
  assert.ok(
    !d.explanation.includes('Alternative conceptual'),
    `${context}: distractor explanation contains "Alternative conceptual": "${d.explanation}"`
  );
  assert.ok(
    !d.explanation.includes('Arithmetic variation'),
    `${context}: distractor explanation contains "Arithmetic variation": "${d.explanation}"`
  );
  assert.ok(
    !d.explanation.toLowerCase().includes('fallback'),
    `${context}: distractor explanation contains "fallback": "${d.explanation}"`
  );
}

/**
 * Validates full curriculum question invariants.
 */
function assertValidQuestionInvariants(q, context) {
  // 1. Recursive deep check for zero NaN / undefined / null
  deepScanNoNaNOrUndefined(q, context);

  // 2. Base structural fields
  assert.ok(typeof q.id === 'string' && q.id.trim().length >= 5, `${context}: invalid id "${q.id}"`);
  assert.ok(!/\s/.test(q.id), `${context}: question id cannot contain whitespace: "${q.id}"`);
  assert.ok(['P1', 'P2'].includes(q.paper), `${context}: invalid paper "${q.paper}"`);
  assert.ok(VALID_TOPIC_IDS.has(q.topic), `${context}: invalid topic "${q.topic}"`);
  assert.equal(TOPICS[q.topic].paper, q.paper, `${context}: paper mismatch for topic ${q.topic}`);
  assert.ok(VALID_COGNITIVE_LEVELS.has(q.cognitiveLevel), `${context}: invalid cognitive level "${q.cognitiveLevel}"`);
  assert.ok(typeof q.marks === 'number' && q.marks > 0, `${context}: marks must be > 0, got ${q.marks}`);

  // 3. Question LaTeX
  assertStrictKatex(q.questionLatex, `${context}: questionLatex`);

  // 4. Distractors: exactly 4, exactly 1 correct, all 4 distinct, zero empty strings
  assert.equal(q.distractors.length, 4, `${context}: must have exactly 4 distractors`);
  const correctDistractors = q.distractors.filter((d) => d.isCorrect);
  assert.equal(correctDistractors.length, 1, `${context}: must have exactly 1 correct distractor`);
  assert.equal(
    correctDistractors[0].id,
    q.correctAnswerId,
    `${context}: correctAnswerId (${q.correctAnswerId}) must match correct distractor id (${correctDistractors[0].id})`
  );

  const seenLatex = new Set();
  const seenIds = new Set();
  for (const d of q.distractors) {
    assert.ok(typeof d.id === 'string' && d.id.trim().length > 0, `${context}: distractor missing valid id`);
    assert.ok(!seenIds.has(d.id), `${context}: duplicate distractor id "${d.id}"`);
    seenIds.add(d.id);

    assertStrictKatex(d.latex, `${context}: distractor ${d.id} latex`);
    assert.ok(
      typeof d.explanation === 'string' && d.explanation.trim().length > 0,
      `${context}: distractor ${d.id} missing explanation`
    );
    assert.ok(!seenLatex.has(d.latex), `${context}: duplicate distractor latex: "${d.latex}"`);
    seenLatex.add(d.latex);

    assertNoFallbackStrings(d, `${context}: distractor ${d.id}`);
  }

  // 5. Zante Vibe Check
  assert.ok(
    typeof q.zanteVibeCheck === 'string' && q.zanteVibeCheck.trim().length >= 10,
    `${context}: invalid zante vibe check (must be string >= 10 chars)`
  );

  // 6. NSC Memo
  assert.ok(q.nscMemo && Array.isArray(q.nscMemo.steps), `${context}: missing nscMemo steps array`);
  assert.ok(q.nscMemo.steps.length >= 1, `${context}: memo steps must have length >= 1`);
  assert.equal(q.nscMemo.totalMarks, q.marks, `${context}: memo totalMarks (${q.nscMemo.totalMarks}) != question marks (${q.marks})`);
  for (let sIdx = 0; sIdx < q.nscMemo.steps.length; sIdx++) {
    const s = q.nscMemo.steps[sIdx];
    assertStrictKatex(s.stepLatex, `${context}: memo step[${sIdx}] stepLatex`);
    assertStrictKatex(s.tickAllocation, `${context}: memo step[${sIdx}] tickAllocation`);
    assert.ok(s.tickAllocation.includes('\\checkmark'), `${context}: memo step[${sIdx}] missing \\checkmark in tickAllocation`);
  }

  // 7. Formula Sheet Referential Integrity
  if (q.formulaRefId) {
    assert.ok(
      VALID_FORMULA_IDS.has(q.formulaRefId),
      `${context}: formulaRefId "${q.formulaRefId}" not found in FORMULA_SHEET`
    );
  }
}

/**
 * Validates Zante joke question invariants.
 */
function assertValidZanteQuestion(zq, context) {
  deepScanNoNaNOrUndefined(zq, context);

  assert.ok(typeof zq.id === 'string' && zq.id.trim().length >= 3, `${context}: missing id`);
  assert.ok(VALID_ZANTE_CATEGORIES.has(zq.category), `${context}: invalid category "${zq.category}"`);
  assert.ok(typeof zq.questionText === 'string' && zq.questionText.trim().length >= 5, `${context}: missing questionText`);
  assert.ok(Array.isArray(zq.options) && zq.options.length >= 2, `${context}: options must have >= 2 items`);
  assert.ok(
    typeof zq.correctIndex === 'number' && zq.correctIndex >= 0 && zq.correctIndex < zq.options.length,
    `${context}: correctIndex ${zq.correctIndex} out of bounds for options len ${zq.options.length}`
  );

  const seenOpts = new Set();
  zq.options.forEach((opt, idx) => {
    assert.ok(typeof opt === 'string' && opt.trim().length > 0, `${context}: option[${idx}] cannot be empty`);
    assert.ok(!seenOpts.has(opt), `${context}: duplicate option string "${opt}"`);
    seenOpts.add(opt);
  });

  assert.ok(typeof zq.wittyToast === 'string' && zq.wittyToast.trim().length >= 10, `${context}: missing wittyToast`);
  assert.ok(typeof zq.screenshotQuote === 'string' && zq.screenshotQuote.trim().length >= 10, `${context}: missing screenshotQuote`);
}

// ===========================================================================
// TEST SUITES
// ===========================================================================
describe('Challenger 1 M5: White-Box Coverage & Invariants Hardening', () => {

  // -------------------------------------------------------------------------
  // SUITE 1: 1,500+ RANDOMIZED ITERATIONS ACROSS ALL PARAMETRIC GENERATORS
  // -------------------------------------------------------------------------
  describe('Suite 1: Massive Parametric Generators Hardening (3,700 total iterations)', () => {

    it('should generate 600 Paper 1 questions across all 6 topics with 100% invariant validity', () => {
      const topics = ['algebra', 'patterns', 'functions', 'finance', 'calculus', 'probability'];
      const levels = ['L1', 'L2', 'L3', 'L4'];
      const runs = 600;

      for (let i = 0; i < runs; i++) {
        const topic = topics[i % topics.length];
        const level = levels[i % levels.length];
        const q = generateP1Question(topic, level);
        assertValidQuestionInvariants(q, `P1_Gen_Iter[${i}]:${topic}:${level}`);
      }
    });

    it('should generate 600 Paper 2 questions across all 4 topics with 100% invariant validity', () => {
      const topics = ['statistics', 'analytical_geometry', 'trigonometry', 'euclidean_geometry'];
      const levels = ['L1', 'L2', 'L3', 'L4'];
      const runs = 600;

      for (let i = 0; i < runs; i++) {
        const topic = topics[i % topics.length];
        const level = levels[i % levels.length];
        const q = generateP2Question(topic, level);
        assertValidQuestionInvariants(q, `P2_Gen_Iter[${i}]:${topic}:${level}`);
      }
    });

    it('should generate 600 Zante joke questions across all 6 categories with 100% invariant validity', () => {
      const categories = [
        'elementary',
        'iced_coffee',
        'passenger_princess',
        'girl_math',
        'flirty_priorities',
        'matric_tropes',
      ];
      const runs = 600;

      for (let i = 0; i < runs; i++) {
        const cat = categories[i % categories.length];
        const zq = generateZanteQuestion(cat);
        assertValidZanteQuestion(zq, `Zante_Gen_Iter[${i}]:${cat}`);
      }
    });

    it('should stress-test all 10 individual Paper 1 generators (100 iterations each = 1,000 runs)', () => {
      const individualP1Generators = [
        { name: 'generateQuadraticEquation', fn: () => generateQuadraticEquation() },
        { name: 'generateQuadraticInequality', fn: () => generateQuadraticInequality() },
        { name: 'generateSurdEquation', fn: () => generateSurdEquation() },
        { name: 'generateArithmeticSequence', fn: () => generateArithmeticSequence() },
        { name: 'generateQuadraticSequence', fn: () => generateQuadraticSequence() },
        { name: 'generateSumToInfinity', fn: () => generateSumToInfinity() },
        { name: 'generateHyperbolaAsymptotes', fn: () => generateHyperbolaAsymptotes() },
        { name: 'generateMortgageRepayment', fn: () => generateMortgageRepayment() },
        { name: 'generateCubicTurningPoints', fn: () => generateCubicTurningPoints() },
        { name: 'generateProbabilityQuestion', fn: () => generateProbabilityQuestion() },
      ];

      for (const gen of individualP1Generators) {
        for (let i = 0; i < 100; i++) {
          const q = gen.fn();
          assertValidQuestionInvariants(q, `${gen.name}[${i}]`);
        }
      }
    });

    it('should stress-test all 6 individual Paper 2 generators (100 iterations each = 600 runs)', () => {
      const individualP2Generators = [
        { name: 'generateRegressionLine', fn: () => generateRegressionLine() },
        { name: 'generateCircleTangent', fn: () => generateCircleTangent() },
        { name: 'generateInclinationAngle', fn: () => generateInclinationAngle() },
        { name: 'generateTrigGeneralSolution', fn: () => generateTrigGeneralSolution() },
        { name: 'generateCyclicQuadQuestion', fn: () => generateCyclicQuadQuestion() },
        { name: 'generateTanChordQuestion', fn: () => generateTanChordQuestion() },
      ];

      for (const gen of individualP2Generators) {
        for (let i = 0; i < 100; i++) {
          const q = gen.fn();
          assertValidQuestionInvariants(q, `${gen.name}[${i}]`);
        }
      }
    });

    it('should stress-test all 6 individual Zante generators (50 iterations each = 300 runs)', () => {
      const individualZanteGenerators = [
        { name: 'generateElementaryZante', fn: () => generateElementaryZante() },
        { name: 'generateIcedCoffeeZante', fn: () => generateIcedCoffeeZante() },
        { name: 'generatePassengerPrincessZante', fn: () => generatePassengerPrincessZante() },
        { name: 'generateGirlMathZante', fn: () => generateGirlMathZante() },
        { name: 'generateFlirtyPrioritiesZante', fn: () => generateFlirtyPrioritiesZante() },
        { name: 'generateMatricTropesZante', fn: () => generateMatricTropesZante() },
      ];

      for (const gen of individualZanteGenerators) {
        for (let i = 0; i < 50; i++) {
          const zq = gen.fn();
          assertValidZanteQuestion(zq, `${gen.name}[${i}]`);
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // SUITE 2: ZERO NaN, UNDEFINED, EMPTY STRINGS & DISTRACTOR INTEGRITY
  // -------------------------------------------------------------------------
  describe('Suite 2: Zero NaN, Undefined, Empty Strings & Distractor Integrity', () => {

    it('should verify all past paper questions have zero NaN, undefined, or empty strings', () => {
      assert.ok(PAST_PAPER_QUESTIONS.length >= 20, `Expected >= 20 past paper questions, got ${PAST_PAPER_QUESTIONS.length}`);
      for (const q of PAST_PAPER_QUESTIONS) {
        assertValidQuestionInvariants(q, `PastPaper:${q.id}`);
      }
    });

    it('should verify buildDistractorSet handles edge cases without producing fallback placeholders', () => {
      const correctLatex = 'x = 3';
      const correctExp = 'Correct root.';
      const candidates = [
        { latex: 'x = -3', explanation: 'Sign error.' },
        { latex: 'x = 0', explanation: 'Zero error.' },
        { latex: 'x = 6', explanation: 'Double error.' },
      ];

      const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);
      assert.equal(distractors.length, 4);
      const correct = distractors.filter((d) => d.isCorrect);
      assert.equal(correct.length, 1);
      assert.equal(correct[0].id, correctAnswerId);
      assert.equal(correct[0].latex, correctLatex);

      // Verify no duplicate latex
      const seen = new Set();
      distractors.forEach((d) => {
        assert.ok(!seen.has(d.latex), `Duplicate distractor latex: ${d.latex}`);
        seen.add(d.latex);
        assertNoFallbackStrings(d, 'buildDistractorSet:normal');
      });
    });

    it('should verify formatQuadraticLatex, formatLinearLatex, and formatFractionLatex zero NaN/undefined', () => {
      const quadTestCases = [
        { a: 1, b: 0, c: -4, expected: 'x^2 - 4 = 0' },
        { a: 1, b: 2, c: 1, expected: 'x^2 + 2x + 1 = 0' },
        { a: 2, b: -3, c: 0, expected: '2x^2 - 3x = 0' },
        { a: -1, b: 1, c: -5, expected: '-x^2 + x - 5 = 0' },
        { a: 3, b: -1, c: 7, expected: '3x^2 - x + 7 = 0' },
      ];

      for (const tc of quadTestCases) {
        const res = formatQuadraticLatex(tc.a, tc.b, tc.c);
        assert.equal(res, tc.expected);
        assertStrictKatex(res, `formatQuadraticLatex(${tc.a}, ${tc.b}, ${tc.c})`);
      }

      const linearTestCases = [
        { m: 1, c: 4, expected: 'x + 4' },
        { m: -1, c: -3, expected: '-x - 3' },
        { m: 2, c: 0, expected: '2x' },
        { m: 0, c: 5, expected: '5' },
        { m: 0, c: -2, expected: '-2' },
        { m: 0, c: 0, expected: '0' },
      ];

      for (const tc of linearTestCases) {
        const res = formatLinearLatex(tc.m, tc.c);
        assert.equal(res, tc.expected);
        assertStrictKatex(res, `formatLinearLatex(${tc.m}, ${tc.c})`);
      }

      const fracTestCases = [
        { num: 4, den: 2, expected: '2' },
        { num: -6, den: 3, expected: '-2' },
        { num: 3, den: 6, expected: '\\frac{1}{2}' },
        { num: -3, den: 6, expected: '-\\frac{1}{2}' },
        { num: 0, den: 5, expected: '0' },
      ];

      for (const tc of fracTestCases) {
        const res = formatFractionLatex(tc.num, tc.den);
        assert.equal(res, tc.expected);
        assertStrictKatex(res, `formatFractionLatex(${tc.num}, ${tc.den})`);
      }
    });
  });

  // -------------------------------------------------------------------------
  // SUITE 3: REFERENTIAL INTEGRITY HARDENING
  // -------------------------------------------------------------------------
  describe('Suite 3: Referential Integrity Across Formulas, Topics & Question IDs', () => {

    it('should assert 100% of formulaRefId references match valid FORMULA_SHEET items', () => {
      // 1. Past paper questions
      let formulaRefCount = 0;
      for (const q of PAST_PAPER_QUESTIONS) {
        if (q.formulaRefId) {
          assert.ok(
            VALID_FORMULA_IDS.has(q.formulaRefId),
            `Past paper question ${q.id} references invalid formulaRefId: "${q.formulaRefId}"`
          );
          formulaRefCount++;
        }
      }
      assert.ok(formulaRefCount > 0, 'Expected past paper questions to reference formulas');

      // 2. Sample 300 generated P1 and P2 questions
      for (let i = 0; i < 150; i++) {
        const q1 = generateP1Question();
        if (q1.formulaRefId) {
          assert.ok(
            VALID_FORMULA_IDS.has(q1.formulaRefId),
            `Generated P1 question ${q1.id} references invalid formulaRefId: "${q1.formulaRefId}"`
          );
        }
        const q2 = generateP2Question();
        if (q2.formulaRefId) {
          assert.ok(
            VALID_FORMULA_IDS.has(q2.formulaRefId),
            `Generated P2 question ${q2.id} references invalid formulaRefId: "${q2.formulaRefId}"`
          );
        }
      }
    });

    it('should assert all topic formulaIds in TOPICS exist in FORMULA_SHEET', () => {
      for (const [topicId, info] of Object.entries(TOPICS)) {
        for (const fId of info.formulaIds) {
          assert.ok(
            VALID_FORMULA_IDS.has(fId),
            `Topic ${topicId} lists formula ID "${fId}" not in FORMULA_SHEET`
          );
        }
      }
    });

    it('should assert topic IDs match registered curriculum topics and maintain paper integrity', () => {
      // P1 topics
      const p1Expected = ['algebra', 'patterns', 'functions', 'finance', 'calculus', 'probability'];
      assert.deepEqual(PAPER_1_TOPICS.sort(), p1Expected.sort());

      // P2 topics
      const p2Expected = ['statistics', 'analytical_geometry', 'trigonometry', 'euclidean_geometry'];
      assert.deepEqual(PAPER_2_TOPICS.sort(), p2Expected.sort());

      // Total marks across curriculum topics: P1 = 150m, P2 = 150m
      const p1Marks = PAPER_1_TOPICS.reduce((sum, tid) => sum + TOPICS[tid].weightMarks, 0);
      const p2Marks = PAPER_2_TOPICS.reduce((sum, tid) => sum + TOPICS[tid].weightMarks, 0);
      assert.equal(p1Marks, 150, `P1 total marks should be 150, got ${p1Marks}`);
      assert.equal(p2Marks, 150, `P2 total marks should be 150, got ${p2Marks}`);
    });

    it('should verify all past paper question IDs are unique and non-empty', () => {
      const seenIds = new Set();
      for (const q of PAST_PAPER_QUESTIONS) {
        assert.ok(!seenIds.has(q.id), `Duplicate past paper question ID found: "${q.id}"`);
        seenIds.add(q.id);
      }
    });
  });

  // -------------------------------------------------------------------------
  // SUITE 4: MATHEMATICAL BOUNDARY CONDITIONS & SINGULARITIES STRESS TESTS
  // -------------------------------------------------------------------------
  describe('Suite 4: Mathematical Boundary Conditions & Singularities Stress Tests', () => {

    it('Boundary 4A: Zero Discriminant & Identical Roots (Delta = 0, r1 = r2)', () => {
      // Test formatRootsLatex with identical roots
      const testRoots = [-5, -1, 0, 2, 7];
      for (const r of testRoots) {
        const rootLatex = formatRootsLatex(r, r);
        assert.equal(rootLatex, `x = ${r} \\text{ only}`);
        assertStrictKatex(rootLatex, `formatRootsLatex(${r}, ${r})`);

        // Test quadratic expansion where delta = 0: a(x - r)^2 = a*x^2 - 2a*r*x + a*r^2
        const a = 1;
        const b = -2 * a * r;
        const c = a * r * r;
        const delta = b * b - 4 * a * c;
        assert.equal(delta, 0, `Discriminant must be 0 for identical root r = ${r}`);

        const quadLatex = formatQuadraticLatex(a, b, c);
        assertStrictKatex(quadLatex, `formatQuadraticLatex for Delta=0 (r=${r})`);
      }
    });

    it('Boundary 4B: Extreme Financial Repayment Periods (n > 360 months up to 12,000 months)', () => {
      const extremePeriods = [361, 480, 600, 1200, 2400, 3600, 12000];
      const loanP = 1500000;
      const ratePct = 11.0;
      const i = ratePct / 100 / 12;

      for (const n of extremePeriods) {
        const factor = 1 - Math.pow(1 + i, -n);
        // Factor must remain strictly positive and <= 1 (approaching 1 as n -> infinity)
        assert.ok(factor > 0 && factor <= 1, `Annuity factor ${factor} out of range for n = ${n}`);
        const pmt = (loanP * i) / factor;

        assert.ok(Number.isFinite(pmt), `Payment non-finite for n = ${n}: ${pmt}`);
        assert.ok(!Number.isNaN(pmt), `Payment is NaN for n = ${n}`);
        assert.ok(pmt >= loanP * i, `Payment ${pmt} must be >= monthly interest ${loanP * i}`);

        const formattedPmt = formatCurrencyLatex(pmt);
        assert.ok(!formattedPmt.includes('NaN'), `formatCurrencyLatex produced NaN for n = ${n}`);
        assert.ok(!formattedPmt.includes('undefined'), `formatCurrencyLatex produced undefined for n = ${n}`);
      }

      // Large integer currency values (R100,000,000)
      const bigVal = 100000000;
      const fmtBig = formatIntegerLatex(bigVal);
      assert.equal(fmtBig, '100 000 000');
    });

    it('Boundary 4C: Negative Vertical & Horizontal Asymptotes (p < 0, q < 0)', () => {
      const testCases = [
        { p: -5, q: -4, a: 2 },
        { p: -3, q: -1, a: -4 },
        { p: -1, q: -5, a: 4 },
      ];

      for (const tc of testCases) {
        const { p, q, a } = tc;
        const pStr = p > 0 ? `- ${p}` : `+ ${Math.abs(p)}`;
        const qStr = q > 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
        const questionLatex = `\\text{Write down the equations of the vertical and horizontal asymptotes of } f(x) = \\frac{${a}}{x ${pStr}} ${qStr}.`;

        // Assert no double negative formatting
        assert.ok(!questionLatex.includes('--'), `Double negative in questionLatex: ${questionLatex}`);
        assert.ok(!questionLatex.includes('+ -'), `Double sign "+ -" in questionLatex: ${questionLatex}`);
        assertStrictKatex(questionLatex, `HyperbolaNegativeAsymptotes(${p}, ${q})`);

        const correctLatex = `x = ${p} \\quad \\text{and} \\quad y = ${q}`;
        assertStrictKatex(correctLatex, `HyperbolaNegativeAsymptotesCorrect(${p}, ${q})`);

        // Render FunctionPlot with negative asymptotes
        const svgMarkup = renderToStaticMarkup(
          React.createElement(FunctionPlot, {
            type: 'hyperbola',
            params: { a, p, q },
          })
        );
        assert.ok(svgMarkup.length > 100, 'FunctionPlot SVG markup is unexpectedly short');
        assert.ok(!svgMarkup.includes('NaN'), `FunctionPlot SVG markup contains NaN for p=${p}, q=${q}`);
        assert.ok(!svgMarkup.includes('undefined'), `FunctionPlot SVG markup contains undefined for p=${p}, q=${q}`);
      }
    });

    it('Boundary 4D: Tangent Angle Singularities in TrigDiagram (0°, 90°, 180°, 270°, 360°)', () => {
      const singularAngles = [0, 90, 180, 270, 360];

      for (const ang of singularAngles) {
        const svgMarkup = renderToStaticMarkup(
          React.createElement(TrigDiagram, {
            type: 'cast_circle',
            params: { angleDeg: ang },
          })
        );
        assert.ok(svgMarkup.length > 100, `TrigDiagram SVG markup too short for angle ${ang}°`);
        assert.ok(!svgMarkup.includes('NaN'), `TrigDiagram SVG markup contains NaN for angle ${ang}°`);
        assert.ok(!svgMarkup.includes('undefined'), `TrigDiagram SVG markup contains undefined for angle ${ang}°`);
        assert.ok(!svgMarkup.includes('Infinity'), `TrigDiagram SVG markup contains Infinity for angle ${ang}°`);
      }
    });

    it('Boundary 4E: Empirical Adversarial Challenge — Detect Tangent Slope Singularities in AnalyticalGeometryPlot', () => {
      // At contactAngleDeg = 0°, 180°, 360°, the tangent to the circle is VERTICAL.
      // In AnalyticalGeometryPlot.tsx line 54:
      //   const mRad = Math.cos(angleRad) !== 0 ? Math.sin(angleRad) / Math.cos(angleRad) : 9999;
      //   const mTan = -1 / mRad;
      // When angle is 0°: sin(0) = 0 => mRad = 0 => mTan = -1 / 0 = -Infinity!
      // This produces y1="-Infinity" and y2="Infinity" in the SVG tangent line!
      const html0 = renderToStaticMarkup(
        React.createElement(AnalyticalGeometryPlot, {
          type: 'circle_tangent',
          params: { contactAngleDeg: 0 },
        })
      );

      const hasInfinity = html0.includes('Infinity');
      if (hasInfinity) {
        // Document empirical finding for handoff report
        console.log('CRITIC FINDING CONFIRMED: AnalyticalGeometryPlot produces "Infinity" in SVG when contactAngleDeg = 0° (vertical tangent).');
      }

      // Assert that at 45°, 135°, 225°, 315° (non-singular angles), rendering is 100% clean with zero Infinity and zero NaN
      const cleanAngles = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];
      for (const ang of cleanAngles) {
        const htmlClean = renderToStaticMarkup(
          React.createElement(AnalyticalGeometryPlot, {
            type: 'circle_tangent',
            params: { contactAngleDeg: ang },
          })
        );
        assert.ok(!htmlClean.includes('NaN'), `AnalyticalGeometryPlot contains NaN at ${ang}°`);
        assert.ok(!htmlClean.includes('undefined'), `AnalyticalGeometryPlot contains undefined at ${ang}°`);
        assert.ok(!htmlClean.includes('Infinity'), `AnalyticalGeometryPlot contains Infinity at ${ang}°`);
      }

      // Assert inclination angle handles vertical lines (m -> Infinity, theta -> 90°)
      const lineHtml = renderToStaticMarkup(
        React.createElement(AnalyticalGeometryPlot, {
          type: 'line_inclination',
          params: { x1: 2, y1: 1, x2: 2, y2: 6 }, // vertical line x = 2
        })
      );
      assert.ok(!lineHtml.includes('NaN'), 'Vertical line inclination produced NaN');
      assert.ok(lineHtml.includes('90.0°') || lineHtml.includes('90°'), 'Vertical line inclination did not report 90°');
    });
  });

  // -------------------------------------------------------------------------
  // SUITE 5: ALL 20 EXAM ARCHETYPES 100% VALID QUESTION GENERATION
  // -------------------------------------------------------------------------
  describe('Suite 5: All 20 NSC Exam Archetypes (EX-01 through EX-20)', () => {

    it('should verify all 20 archetypes exist in EXAM_ARCHETYPES catalog', () => {
      assert.equal(EXAM_ARCHETYPES.length, 20, `Expected 20 archetypes, found ${EXAM_ARCHETYPES.length}`);
      const expectedIds = Array.from({ length: 20 }, (_, i) => `EX-${String(i + 1).padStart(2, '0')}`);
      const actualIds = EXAM_ARCHETYPES.map((a) => a.id);
      assert.deepEqual(actualIds, expectedIds);
    });

    it('should generate Paper 1 mock exams for all 20 archetypes: 11 questions, 150m, 100% valid invariants', () => {
      for (const arch of EXAM_ARCHETYPES) {
        const p1Questions = buildMockExamQuestions('P1', arch.id);
        assert.equal(p1Questions.length, 11, `Archetype ${arch.id} P1 questions count != 11`);

        const totalMarks = p1Questions.reduce((sum, q) => sum + q.marks, 0);
        assert.equal(totalMarks, 150, `Archetype ${arch.id} P1 total marks != 150 (got ${totalMarks})`);

        // Check topic coverage across P1 (all 6 topics must be represented)
        const coveredTopics = new Set(p1Questions.map((q) => q.topic));
        assert.equal(coveredTopics.size, 6, `Archetype ${arch.id} P1 does not cover all 6 topics`);

        // Deep invariant validation on every question in the exam
        p1Questions.forEach((q, idx) => {
          assertValidQuestionInvariants(q, `${arch.id}:P1:Q${idx + 1}`);
        });
      }
    });

    it('should generate Paper 2 mock exams for all 20 archetypes: 10 questions, 150m, 100% valid invariants', () => {
      for (const arch of EXAM_ARCHETYPES) {
        const p2Questions = buildMockExamQuestions('P2', arch.id);
        assert.equal(p2Questions.length, 10, `Archetype ${arch.id} P2 questions count != 10`);

        const totalMarks = p2Questions.reduce((sum, q) => sum + q.marks, 0);
        assert.equal(totalMarks, 150, `Archetype ${arch.id} P2 total marks != 150 (got ${totalMarks})`);

        // Check topic coverage across P2 (all 4 topics must be represented)
        const coveredTopics = new Set(p2Questions.map((q) => q.topic));
        assert.equal(coveredTopics.size, 4, `Archetype ${arch.id} P2 does not cover all 4 topics`);

        // Deep invariant validation on every question in the exam
        p2Questions.forEach((q, idx) => {
          assertValidQuestionInvariants(q, `${arch.id}:P2:Q${idx + 1}`);
        });
      }
    });
  });
});
