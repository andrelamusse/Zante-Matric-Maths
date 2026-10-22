import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';

import {
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
} from '../src/generators/p1Generators.ts';

import {
  generateRegressionLine,
  generateCircleTangent,
  generateInclinationAngle,
  generateTrigGeneralSolution,
  generateCyclicQuadQuestion,
  generateTanChordQuestion,
  generateP2Question,
} from '../src/generators/p2Generators.ts';

import { FORMULA_SHEET } from '../src/data/formulaSheet.ts';
import { assertNoNaNOrUndefined } from '../src/generators/utils.ts';

const VALID_FORMULA_IDS = new Set(FORMULA_SHEET.map((f) => f.id));

function assertStrictKatex(latex, context) {
  assert.ok(typeof latex === 'string', `${context}: must be string`);
  assert.ok(latex.trim().length > 0, `${context}: cannot be empty`);
  assert.ok(!latex.includes('NaN'), `${context}: contains NaN`);
  assert.ok(!latex.includes('undefined'), `${context}: contains undefined`);
  assert.ok(!latex.includes('null'), `${context}: contains null`);

  try {
    katex.renderToString(latex, { throwOnError: true, strict: 'warn' });
  } catch (err) {
    assert.fail(`${context}: KaTeX parse failure: "${err.message}" in [${latex}]`);
  }
}

function assertNoFallbackStrings(d, context) {
  assert.ok(!d.latex.includes('\\text{Option '), `${context}: distractor latex contains "\\text{Option ": "${d.latex}"`);
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

function assertQuestionIntegrity(q, context) {
  // 1. Recursive zero NaN/undefined/null
  assertNoNaNOrUndefined(q, context);

  // 2. Base structural fields
  assert.ok(typeof q.id === 'string' && q.id.length > 5, `${context}: invalid id`);
  assert.ok(['P1', 'P2'].includes(q.paper), `${context}: invalid paper ${q.paper}`);
  assert.ok(['L1', 'L2', 'L3', 'L4'].includes(q.cognitiveLevel), `${context}: invalid cog level`);
  assert.ok(typeof q.marks === 'number' && q.marks > 0, `${context}: invalid marks`);

  // 3. Question LaTeX
  assertStrictKatex(q.questionLatex, `${context}: questionLatex`);

  // 4. Distractors: exactly 4, exactly 1 correct, all 4 distinct
  assert.equal(q.distractors.length, 4, `${context}: must have exactly 4 distractors`);
  const correctDistractors = q.distractors.filter((d) => d.isCorrect);
  assert.equal(correctDistractors.length, 1, `${context}: must have exactly 1 correct distractor`);
  assert.equal(
    correctDistractors[0].id,
    q.correctAnswerId,
    `${context}: correctAnswerId must match correct distractor id`
  );

  const seenLatex = new Set();
  for (const d of q.distractors) {
    assertStrictKatex(d.latex, `${context}: distractor ${d.id}`);
    assert.ok(typeof d.explanation === 'string' && d.explanation.length > 0, `${context}: distractor ${d.id} missing explanation`);
    assert.ok(!seenLatex.has(d.latex), `${context}: duplicate distractor latex: "${d.latex}"`);
    seenLatex.add(d.latex);
    assertNoFallbackStrings(d, `${context}: distractor ${d.id}`);
  }

  // 5. Zante Vibe Check
  assert.ok(
    typeof q.zanteVibeCheck === 'string' && q.zanteVibeCheck.length >= 15,
    `${context}: invalid zante vibe check`
  );

  // 6. NSC Memo
  assert.ok(q.nscMemo && Array.isArray(q.nscMemo.steps), `${context}: missing nscMemo steps`);
  assert.ok(q.nscMemo.steps.length >= 1, `${context}: memo steps must be >= 1`);
  assert.equal(q.nscMemo.totalMarks, q.marks, `${context}: memo marks != question marks`);
  for (const s of q.nscMemo.steps) {
    assertStrictKatex(s.stepLatex, `${context}: memo stepLatex`);
    assertStrictKatex(s.tickAllocation, `${context}: memo tickAllocation`);
    assert.ok(s.tickAllocation.includes('\\checkmark'), `${context}: memo step missing \\checkmark`);
  }

  // 7. Formula Sheet Referential Integrity
  if (q.formulaRefId) {
    assert.ok(
      VALID_FORMULA_IDS.has(q.formulaRefId),
      `${context}: formulaRefId "${q.formulaRefId}" not found in FORMULA_SHEET`
    );
  }
}

// -----------------------------------------------------------------------------
// EMPIRICAL CHALLENGE 1: QUADRATIC EQUATIONS DUPLICATE DISTRACTOR CHECK (2,000 runs)
// -----------------------------------------------------------------------------
test('Challenger 1 Empirical: generateQuadraticEquation 2,000 iterations (0 duplicate root sets, 0 fallbacks)', () => {
  let duplicateRootSets = 0;
  let duplicateDistractorStrings = 0;
  let fallbackCount = 0;
  const runs = 2000;

  for (let i = 0; i < runs; i++) {
    const q = generateQuadraticEquation();
    assertQuestionIntegrity(q, `QuadraticEquation[${i}]`);

    const correctOpt = q.distractors.find((d) => d.id === q.correctAnswerId);
    const cMatch = correctOpt.latex.match(/x\s*=\s*(-?\d+).*?x\s*=\s*(-?\d+)/);
    assert.ok(cMatch, `Failed to parse roots from correct distractor: ${correctOpt.latex}`);
    const cr1 = parseInt(cMatch[1], 10);
    const cr2 = parseInt(cMatch[2], 10);
    const correctSet = new Set([cr1, cr2]);

    const seenDistractors = new Set();
    for (const d of q.distractors) {
      if (seenDistractors.has(d.latex)) {
        duplicateDistractorStrings++;
      }
      seenDistractors.add(d.latex);

      if (d.latex.includes('Option') || d.explanation.includes('Alternative conceptual') || d.explanation.includes('Arithmetic variation')) {
        fallbackCount++;
      }

      if (d.id === q.correctAnswerId) continue;

      const dMatch = d.latex.match(/x\s*=\s*(-?\d+).*?x\s*=\s*(-?\d+)/);
      if (dMatch) {
        const dr1 = parseInt(dMatch[1], 10);
        const dr2 = parseInt(dMatch[2], 10);
        const dSet = new Set([dr1, dr2]);
        if (dSet.size === correctSet.size && [...dSet].every((x) => correctSet.has(x))) {
          duplicateRootSets++;
        }
      }
    }
  }

  assert.equal(duplicateRootSets, 0, `Expected 0 duplicate root sets, found ${duplicateRootSets} in ${runs} runs`);
  assert.equal(duplicateDistractorStrings, 0, `Expected 0 duplicate distractor strings, found ${duplicateDistractorStrings} in ${runs} runs`);
  assert.equal(fallbackCount, 0, `Expected 0 fallback strings, found ${fallbackCount} in ${runs} runs`);
});

// -----------------------------------------------------------------------------
// EMPIRICAL CHALLENGE 2: QUADRATIC INEQUALITIES FALLBACK CHECK (2,000 runs)
// -----------------------------------------------------------------------------
test('Challenger 1 Empirical: generateQuadraticInequality 2,000 iterations (0 fallbacks, 0 duplicate distractors, no + 0x)', () => {
  let fallbackCount = 0;
  let duplicateDistractorStrings = 0;
  let artifact0xCount = 0;
  const runs = 2000;

  for (let i = 0; i < runs; i++) {
    const q = generateQuadraticInequality();
    assertQuestionIntegrity(q, `QuadraticInequality[${i}]`);

    // Check for + 0x artifact
    if (q.questionLatex.includes('+ 0x') || q.questionLatex.includes('- 0x')) {
      artifact0xCount++;
    }

    const seenDistractors = new Set();
    for (const d of q.distractors) {
      if (seenDistractors.has(d.latex)) {
        duplicateDistractorStrings++;
      }
      seenDistractors.add(d.latex);

      assertNoFallbackStrings(d, `QuadraticInequality[${i}]: distractor ${d.id}`);
    }

    // Verify critical values
    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    if (correctDistractor.latex.includes('\\le')) {
      const match = correctDistractor.latex.match(/(-?\d+)\s*\\le\s*x\s*\\le\s*(-?\d+)/);
      assert.ok(match, `Could not parse sandwiched interval from ${correctDistractor.latex}`);
      const r1 = parseInt(match[1], 10);
      const r2 = parseInt(match[2], 10);
      assert.ok(r1 < r2, `Critical values must satisfy r1 < r2: got ${r1} >= ${r2}`);
    } else {
      const match = correctDistractor.latex.match(/x\s*<\s*(-?\d+).*?x\s*>\s*(-?\d+)/);
      assert.ok(match, `Could not parse disjoint intervals from ${correctDistractor.latex}`);
      const r1 = parseInt(match[1], 10);
      const r2 = parseInt(match[2], 10);
      assert.ok(r1 < r2, `Critical values must satisfy r1 < r2: got ${r1} >= ${r2}`);
    }
  }

  assert.equal(fallbackCount, 0, `Expected 0 fallback strings, found ${fallbackCount} in ${runs} runs`);
  assert.equal(duplicateDistractorStrings, 0, `Expected 0 duplicate distractor strings, found ${duplicateDistractorStrings} in ${runs} runs`);
  assert.equal(artifact0xCount, 0, `Expected 0 "+ 0x" artifacts, found ${artifact0xCount} in ${runs} runs`);
});

// -----------------------------------------------------------------------------
// EMPIRICAL CHALLENGE 3: ZERO NaN/UNDEFINED AUDIT ACROSS generateP1Question (2,000 runs)
// -----------------------------------------------------------------------------
test('Challenger 1 Empirical: generateP1Question 2,000 iterations (zero NaN/undefined/null, all 6 topics including probability)', () => {
  const topicCounts = {
    algebra: 0,
    patterns: 0,
    functions: 0,
    finance: 0,
    calculus: 0,
    probability: 0,
  };
  const runs = 2000;

  for (let i = 0; i < runs; i++) {
    const q = generateP1Question();
    assertQuestionIntegrity(q, `generateP1Question[${i}]`);

    assert.ok(q.topic in topicCounts, `Unexpected topic in P1: ${q.topic}`);
    topicCounts[q.topic]++;
  }

  // Ensure probability and all topics were sampled adequately
  for (const [topic, count] of Object.entries(topicCounts)) {
    assert.ok(count > 100, `Topic "${topic}" was sampled only ${count} times out of ${runs}`);
  }
});

// -----------------------------------------------------------------------------
// EMPIRICAL CHALLENGE 4: ZERO NaN/UNDEFINED AUDIT ACROSS generateP2Question (2,000 runs)
// -----------------------------------------------------------------------------
test('Challenger 1 Empirical: generateP2Question 2,000 iterations (zero NaN/undefined/null, all 4 topics)', () => {
  const topicCounts = {
    statistics: 0,
    analytical_geometry: 0,
    trigonometry: 0,
    euclidean_geometry: 0,
  };
  const runs = 2000;

  for (let i = 0; i < runs; i++) {
    const q = generateP2Question();
    assertQuestionIntegrity(q, `generateP2Question[${i}]`);

    assert.ok(q.topic in topicCounts, `Unexpected topic in P2: ${q.topic}`);
    topicCounts[q.topic]++;
  }

  // Ensure all 4 topics were sampled adequately
  for (const [topic, count] of Object.entries(topicCounts)) {
    assert.ok(count > 150, `Topic "${topic}" was sampled only ${count} times out of ${runs}`);
  }
});

// -----------------------------------------------------------------------------
// EMPIRICAL CHALLENGE 5: DEEP ADVERSARIAL STRESS TEST ON PROBABILITY (1,000 runs)
// -----------------------------------------------------------------------------
test('Challenger 1 Empirical: generateProbabilityQuestion 1,000 iterations (counting + independent events, zero flaws)', () => {
  let countingRuns = 0;
  let independentRuns = 0;
  const runs = 1000;

  for (let i = 0; i < runs; i++) {
    const q = generateProbabilityQuestion();
    assertQuestionIntegrity(q, `generateProbabilityQuestion[${i}]`);

    if (q.id.includes('COUNT')) {
      countingRuns++;
      // Verify word arrangements formula
      const ansNum = parseInt(q.distractors.find((d) => d.id === q.correctAnswerId).latex, 10);
      assert.ok(ansNum > 0 && Number.isInteger(ansNum), `Arrangement count must be positive integer: ${ansNum}`);
      assert.ok(q.questionLatex.includes('arrangements'), 'Question must mention arrangements');
    } else if (q.id.includes('INDEP')) {
      independentRuns++;
      const ansNum = parseFloat(q.distractors.find((d) => d.id === q.correctAnswerId).latex);
      assert.ok(ansNum > 0 && ansNum <= 1.0, `Probability union must be in (0, 1]: got ${ansNum}`);
      assert.ok(q.questionLatex.includes('independent'), 'Question must mention independent');
    } else {
      assert.fail(`Unknown probability question subtype: ${q.id}`);
    }
  }

  assert.ok(countingRuns > 300, `Expected >300 counting runs, got ${countingRuns}`);
  assert.ok(independentRuns > 300, `Expected >300 independent runs, got ${independentRuns}`);
});

// -----------------------------------------------------------------------------
// EMPIRICAL CHALLENGE 6: EXHAUSTIVE 15-GENERATOR STRESS TEST (1,000 runs each = 16,000 runs)
// -----------------------------------------------------------------------------
test('Challenger 1 Empirical: Exhaustive 1,000 runs per generator across all 16 generators (16,000 runs total)', () => {
  const generators = [
    { name: 'QuadraticEquation', fn: generateQuadraticEquation },
    { name: 'QuadraticInequality', fn: generateQuadraticInequality },
    { name: 'SurdEquation', fn: generateSurdEquation },
    { name: 'ArithmeticSequence', fn: generateArithmeticSequence },
    { name: 'QuadraticSequence', fn: generateQuadraticSequence },
    { name: 'SumToInfinity', fn: generateSumToInfinity },
    { name: 'HyperbolaAsymptotes', fn: generateHyperbolaAsymptotes },
    { name: 'MortgageRepayment', fn: generateMortgageRepayment },
    { name: 'CubicTurningPoints', fn: generateCubicTurningPoints },
    { name: 'ProbabilityQuestion', fn: generateProbabilityQuestion },
    { name: 'RegressionLine', fn: generateRegressionLine },
    { name: 'CircleTangent', fn: generateCircleTangent },
    { name: 'InclinationAngle', fn: generateInclinationAngle },
    { name: 'TrigGeneralSolution', fn: generateTrigGeneralSolution },
    { name: 'CyclicQuadQuestion', fn: generateCyclicQuadQuestion },
    { name: 'TanChordQuestion', fn: generateTanChordQuestion },
  ];

  for (const gen of generators) {
    let fallbackCount = 0;
    let duplicateCount = 0;
    for (let i = 0; i < 1000; i++) {
      const q = gen.fn();
      assertQuestionIntegrity(q, `${gen.name}[${i}]`);

      const seen = new Set();
      for (const d of q.distractors) {
        if (seen.has(d.latex)) duplicateCount++;
        seen.add(d.latex);
        assertNoFallbackStrings(d, `${gen.name}[${i}]: distractor ${d.id}`);
      }
    }
    assert.equal(fallbackCount, 0, `${gen.name}: Expected 0 fallbacks in 1,000 runs, got ${fallbackCount}`);
    assert.equal(duplicateCount, 0, `${gen.name}: Expected 0 duplicates in 1,000 runs, got ${duplicateCount}`);
  }
});
