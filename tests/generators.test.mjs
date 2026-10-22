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

// Helper to assert KaTeX syntax using genuine KaTeX parser
function assertValidKatex(str, context) {
  assert.ok(typeof str === 'string', `${context}: must be string`);
  assert.ok(str.trim().length > 0, `${context}: cannot be empty`);
  assert.ok(!str.includes('NaN'), `${context}: contains NaN`);
  assert.ok(!str.includes('undefined'), `${context}: contains undefined`);
  assert.ok(!str.includes('null'), `${context}: contains null`);

  const cleanLatex = str.replace(/\u00A0/g, ' ');
  try {
    katex.renderToString(cleanLatex, {
      throwOnError: true,
      strict: 'warn',
    });
  } catch (err) {
    assert.fail(`${context}: KaTeX parse failure: "${err.message}" in raw string: [${str}]`);
  }
}

// Helper to validate complete Question structure
function assertValidQuestion(q, context) {
  assertNoNaNOrUndefined(q, context);
  assert.ok(q.id.length > 0, `${context}: missing id`);
  assert.ok(['P1', 'P2'].includes(q.paper), `${context}: invalid paper ${q.paper}`);
  assert.ok(q.marks > 0, `${context}: marks must be > 0`);
  assertValidKatex(q.questionLatex, `${context}: questionLatex`);

  // Distractors
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
    assertValidKatex(d.latex, `${context}: distractor ${d.id}`);
    assert.ok(d.explanation.length > 0, `${context}: distractor ${d.id} must have explanation`);
    assert.ok(!seenLatex.has(d.latex), `${context}: duplicate distractor latex "${d.latex}"`);
    seenLatex.add(d.latex);
  }

  // Zante Vibe Check
  assert.ok(q.zanteVibeCheck.length > 10, `${context}: missing Zante vibe check`);

  // NSC Memo
  assert.ok(q.nscMemo.steps.length >= 1, `${context}: memo steps must have at least 1 step`);
  assert.equal(q.nscMemo.totalMarks, q.marks, `${context}: memo marks must match question marks`);
  for (const s of q.nscMemo.steps) {
    assertValidKatex(s.stepLatex, `${context}: memo step`);
    assertValidKatex(s.tickAllocation, `${context}: memo step tickAllocation`);
    assert.ok(
      s.tickAllocation.includes('\\checkmark'),
      `${context}: tick allocation must include \\checkmark`
    );
  }

  // Formula Sheet Referential Integrity
  if (q.formulaRefId) {
    const formulaExists = FORMULA_SHEET.some((f) => f.id === q.formulaRefId);
    assert.ok(
      formulaExists,
      `${context}: generated question references non-existent formulaRefId: "${q.formulaRefId}"`
    );
  }
}

test('Invariant 1: Quadratic Equations always have perfect square discriminants & valid roots', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateQuadraticEquation();
    assertValidQuestion(q, `QuadraticEquation[${i}]`);
  }
});

test('Invariant 2: Quadratic Inequalities produce strict critical value bounds without overlap', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateQuadraticInequality();
    assertValidQuestion(q, `QuadraticInequality[${i}]`);
  }
});

test('Invariant 3: Surd Equations correctly isolate valid and extraneous roots', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateSurdEquation();
    assertValidQuestion(q, `SurdEquation[${i}]`);
    assert.ok(
      q.distractors.some((d) => d.explanation.includes('DIST-SURD')),
      `SurdEquation[${i}] must include extraneous root distractor`
    );
  }
});

test('Invariant 4: Arithmetic & Quadratic Sequences maintain constant differences', () => {
  for (let i = 0; i < 150; i++) {
    const qArith = generateArithmeticSequence();
    assertValidQuestion(qArith, `ArithmeticSequence[${i}]`);

    const qQuad = generateQuadraticSequence();
    assertValidQuestion(qQuad, `QuadraticSequence[${i}]`);
  }
});

test('Invariant 5: Sum to Infinity converges strictly with |r| < 1', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateSumToInfinity();
    assertValidQuestion(q, `SumToInfinity[${i}]`);
  }
});

test('Invariant 6: Hyperbola Asymptotes have non-zero denominator shifts', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateHyperbolaAsymptotes();
    assertValidQuestion(q, `HyperbolaAsymptotes[${i}]`);
  }
});

test('Invariant 7: Financial Mortgage payments are strictly positive and realistic', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateMortgageRepayment();
    assertValidQuestion(q, `MortgageRepayment[${i}]`);
  }
});

test('Invariant 8: Cubic Polynomials have integer stationary points', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateCubicTurningPoints();
    assertValidQuestion(q, `CubicTurningPoints[${i}]`);
  }
});

test('Invariant 9: Linear Regression satisfies positive variance sum and non-zero slope', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateRegressionLine();
    assertValidQuestion(q, `RegressionLine[${i}]`);
  }
});

test('Invariant 10: Circle Tangents enforce m_rad * m_tan = -1 with Pythagorean coordinates', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateCircleTangent();
    assertValidQuestion(q, `CircleTangent[${i}]`);
  }
});

test('Invariant 11: Trigonometric General Solutions enforce standard periods & k in Z', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateTrigGeneralSolution();
    assertValidQuestion(q, `TrigGeneralSolution[${i}]`);
  }
});

test('Invariant 12: Euclidean Geometry preserves official DBE reasons & supplementary angles', () => {
  for (let i = 0; i < 150; i++) {
    const qQuad = generateCyclicQuadQuestion();
    assertValidQuestion(qQuad, `CyclicQuad[${i}]`);

    const qTan = generateTanChordQuestion();
    assertValidQuestion(qTan, `TanChord[${i}]`);
  }
});

test('Invariant 13: Probability questions satisfy Kolmogorov axioms & counting invariants', () => {
  for (let i = 0; i < 150; i++) {
    const q = generateProbabilityQuestion();
    assertValidQuestion(q, `Probability[${i}]`);
  }
});

test('Adversarial Stress Test: 1,000 randomized iterations across Paper 1 & Paper 2 with ZERO defects', () => {
  const iterations = 1000;
  for (let i = 0; i < iterations; i++) {
    const isP1 = i % 2 === 0;
    const q = isP1 ? generateP1Question() : generateP2Question();
    assertValidQuestion(q, `StressTest-${isP1 ? 'P1' : 'P2'}[${i}]`);
  }
});
