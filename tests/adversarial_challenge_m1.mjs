import test from 'node:test';
import assert from 'node:assert/strict';
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
import { assertNoNaNOrUndefined } from '../src/generators/utils.ts';

// KaTeX validator
function assertValidKatex(str, context) {
  assert.ok(typeof str === 'string', `${context}: must be string`);
  assert.ok(str.trim().length > 0, `${context}: cannot be empty`);
  assert.ok(!str.includes('NaN'), `${context}: contains NaN`);
  assert.ok(!str.includes('undefined'), `${context}: contains undefined`);
  assert.ok(!str.includes('null'), `${context}: contains null`);

  let openCount = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '{' && (i === 0 || str[i - 1] !== '\\')) openCount++;
    if (str[i] === '}' && (i === 0 || str[i - 1] !== '\\')) openCount--;
    assert.ok(openCount >= 0, `${context}: closing brace before opening brace at index ${i}`);
  }
  assert.equal(openCount, 0, `${context}: unbalanced braces in "${str}"`);
}

// Global Invariant Checker
function assertGlobalInvariants(q, context) {
  // 1. Recursive zero NaN/undefined/null
  assertNoNaNOrUndefined(q, context);

  // 2. Base structure
  assert.ok(typeof q.id === 'string' && q.id.length > 5, `${context}: invalid id`);
  assert.ok(['P1', 'P2'].includes(q.paper), `${context}: invalid paper ${q.paper}`);
  assert.ok(['L1', 'L2', 'L3', 'L4'].includes(q.cognitiveLevel), `${context}: invalid cog level`);
  assert.ok(typeof q.marks === 'number' && q.marks > 0, `${context}: invalid marks`);

  // 3. Question LaTeX
  assertValidKatex(q.questionLatex, `${context}: questionLatex`);

  // 4. Distractors
  assert.equal(q.distractors.length, 4, `${context}: must have exactly 4 distractors`);
  const correctDistractors = q.distractors.filter((d) => d.isCorrect);
  assert.equal(correctDistractors.length, 1, `${context}: must have exactly 1 correct distractor`);
  assert.equal(
    correctDistractors[0].id,
    q.correctAnswerId,
    `${context}: correctAnswerId must match correct distractor id`
  );

  // Check unique distractor LaTeX strings and no nonsensical fallbacks
  const seenLatex = new Set();
  for (const d of q.distractors) {
    assertValidKatex(d.latex, `${context}: distractor ${d.id}`);
    assert.ok(d.explanation.length > 0, `${context}: distractor ${d.id} explanation missing`);
    assert.ok(
      !seenLatex.has(d.latex),
      `${context}: DUPLICATE distractor latex found: "${d.latex}"`
    );
    seenLatex.add(d.latex);

    // Reject naive fallback synthesis
    assert.ok(
      !d.explanation.includes('Arithmetic variation'),
      `${context}: distractor ${d.id} is a synthesized fallback: "${d.latex}"`
    );
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
    assertValidKatex(s.stepLatex, `${context}: memo stepLatex`);
    assert.ok(
      s.tickAllocation.includes('\\checkmark'),
      `${context}: memo step missing \\checkmark`
    );
  }
}

// -----------------------------------------------------------------------------
// ADVERSARIAL ORACLES
// -----------------------------------------------------------------------------

test('Adversarial Oracle: Quadratic Equations (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateQuadraticEquation();
    assertGlobalInvariants(q, `QuadraticEquation[${i}]`);

    // Verify correct roots
    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    const rootMatch = correctDistractor.latex.match(/x\s*=\s*(-?\d+).*?x\s*=\s*(-?\d+)/);
    assert.ok(rootMatch, `Failed to parse roots from ${correctDistractor.latex}`);
    const r1 = parseInt(rootMatch[1], 10);
    const r2 = parseInt(rootMatch[2], 10);
    assert.notEqual(r1, r2, 'Roots cannot be equal');

    // Parse quadratic equation coefficients: ax^2 + bx + c = 0
    // From memo step 1: formatQuadraticLatex(a, b, c)
    const eqStr = q.nscMemo.steps[0].stepLatex;
    const aMatch = eqStr.match(/^(-?\d*)x\^2/);
    assert.ok(aMatch, `Could not parse a from ${eqStr}`);
    let a = 1;
    if (aMatch[1] === '-') a = -1;
    else if (aMatch[1].length > 0) a = parseInt(aMatch[1], 10);

    const bMatch = eqStr.match(/([+-]\s*\d*)x(?:\s|$)/);
    let b = 0;
    if (bMatch) {
      const rawB = bMatch[1].replace(/\s+/g, '');
      if (rawB === '+' || rawB === '+1') b = 1;
      else if (rawB === '-' || rawB === '-1') b = -1;
      else b = parseInt(rawB, 10);
    }

    const cMatch = eqStr.match(/([+-]\s*\d+)\s*=\s*0/);
    let c = 0;
    if (cMatch) {
      c = parseInt(cMatch[1].replace(/\s+/g, ''), 10);
    }

    // Mathematical verification:
    // a * r1^2 + b * r1 + c === 0
    // a * r2^2 + b * r2 + c === 0
    const evalR1 = a * r1 * r1 + b * r1 + c;
    const evalR2 = a * r2 * r2 + b * r2 + c;
    assert.equal(evalR1, 0, `Root r1=${r1} does not satisfy ${eqStr}: got ${evalR1}`);
    assert.equal(evalR2, 0, `Root r2=${r2} does not satisfy ${eqStr}: got ${evalR2}`);

    // Discriminant check
    const delta = b * b - 4 * a * c;
    assert.ok(delta > 0, `Discriminant must be positive, got ${delta}`);
    const sqrtDelta = Math.round(Math.sqrt(delta));
    assert.equal(sqrtDelta * sqrtDelta, delta, `Discriminant ${delta} must be perfect square`);

    // Adversarial check: Check that NO distractor offers the same pair of roots in swapped order
    const correctRootsSet = new Set([r1, r2]);
    for (const d of q.distractors) {
      if (d.id === q.correctAnswerId) continue;
      const dMatch = d.latex.match(/x\s*=\s*(-?\d+).*?x\s*=\s*(-?\d+)/);
      if (dMatch) {
        const dr1 = parseInt(dMatch[1], 10);
        const dr2 = parseInt(dMatch[2], 10);
        const dRootsSet = new Set([dr1, dr2]);
        const isSameSet = dRootsSet.size === correctRootsSet.size && [...dRootsSet].every((x) => correctRootsSet.has(x));
        assert.ok(
          !isSameSet,
          `Adversarial flaw: Distractor ${d.id} has roots {${dr1}, ${dr2}} identical to correct answer {${r1}, ${r2}}!`
        );
      }
    }
  }
});

test('Adversarial Oracle: Quadratic Inequalities (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateQuadraticInequality();
    assertGlobalInvariants(q, `QuadraticInequality[${i}]`);

    // Verify intervals
    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    if (correctDistractor.latex.includes('\\le')) {
      const match = correctDistractor.latex.match(/(-?\d+)\s*\\le\s*x\s*\\le\s*(-?\d+)/);
      assert.ok(match, `Could not parse sandwiched interval from ${correctDistractor.latex}`);
      const r1 = parseInt(match[1], 10);
      const r2 = parseInt(match[2], 10);
      assert.ok(r1 < r2, `Critical values must satisfy r1 < r2, got ${r1} >= ${r2}`);
    } else {
      const match = correctDistractor.latex.match(/x\s*<\s*(-?\d+).*?x\s*>\s*(-?\d+)/);
      assert.ok(match, `Could not parse disjoint intervals from ${correctDistractor.latex}`);
      const r1 = parseInt(match[1], 10);
      const r2 = parseInt(match[2], 10);
      assert.ok(r1 < r2, `Critical values must satisfy r1 < r2, got ${r1} >= ${r2}`);
    }
  }
});

test('Adversarial Oracle: Surd Equations (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateSurdEquation();
    assertGlobalInvariants(q, `SurdEquation[${i}]`);

    // Parse question: \sqrt{x (+/-) k} = x - m
    const qMatch = q.questionLatex.match(/\\sqrt\{x\s*([+-]\s*\d+)\}\s*=\s*x\s*-\s*(\d+)/);
    assert.ok(qMatch, `Could not parse surd equation from ${q.questionLatex}`);
    const k = parseInt(qMatch[1].replace(/\s+/g, ''), 10);
    const m = parseInt(qMatch[2], 10);

    // Parse correct answer: x = validR1 \quad (x = extR2 \text{ rejected})
    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    const ansMatch = correctDistractor.latex.match(/x\s*=\s*(\d+).*?x\s*=\s*(-?\d+).*?rejected/);
    assert.ok(ansMatch, `Could not parse roots from answer ${correctDistractor.latex}`);
    const validR = parseInt(ansMatch[1], 10);
    const extR = parseInt(ansMatch[2], 10);

    // Verify valid root satisfies original equation: sqrt(validR + k) === validR - m
    assert.ok(validR + k >= 0, `Surd radicand negative for valid root: ${validR} + ${k} < 0`);
    const lhsValid = Math.sqrt(validR + k);
    const rhsValid = validR - m;
    assert.equal(lhsValid, rhsValid, `Valid root does not satisfy: sqrt(${validR}+${k})=${lhsValid} != ${rhsValid}`);

    // Verify extraneous root FAILS original equation: sqrt(extR + k) != extR - m
    assert.ok(extR + k >= 0, `Surd radicand negative for extraneous root: ${extR} + ${k} < 0`);
    const lhsExt = Math.sqrt(extR + k);
    const rhsExt = extR - m;
    assert.ok(rhsExt < 0, `Extraneous root RHS must be negative: got ${rhsExt}`);
    assert.notEqual(lhsExt, rhsExt, `Extraneous root unexpectedly satisfied equation: ${lhsExt} === ${rhsExt}`);
  }
});

test('Adversarial Oracle: Arithmetic Sequences (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateArithmeticSequence();
    assertGlobalInvariants(q, `ArithmeticSequence[${i}]`);

    // Parse terms: T1 ; T2 ; T3 ; ... Determine the n^{th} term (T_n)
    const match = q.questionLatex.match(/(-?\d+)\s*;\s*(-?\d+)\s*;\s*(-?\d+)\s*;.*?(\d+)\^\{\\text\{th\}\}/);
    assert.ok(match, `Could not parse arithmetic sequence from ${q.questionLatex}`);
    const t1 = parseInt(match[1], 10);
    const t2 = parseInt(match[2], 10);
    const t3 = parseInt(match[3], 10);
    const n = parseInt(match[4], 10);

    const d = t2 - t1;
    assert.equal(t3 - t2, d, `Sequence is not arithmetic: ${t2}-${t1} != ${t3}-${t2}`);

    const expectedTn = t1 + (n - 1) * d;
    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    assert.equal(correctDistractor.latex, `T_{${n}} = ${expectedTn}`);
  }
});

test('Adversarial Oracle: Quadratic Sequences (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateQuadraticSequence();
    assertGlobalInvariants(q, `QuadraticSequence[${i}]`);

    // Parse 4 terms: T1 ; T2 ; T3 ; T4
    const match = q.questionLatex.match(/(-?\d+)\s*;\s*(-?\d+)\s*;\s*(-?\d+)\s*;\s*(-?\d+)/);
    assert.ok(match, `Could not parse quadratic sequence from ${q.questionLatex}`);
    const t1 = parseInt(match[1], 10);
    const t2 = parseInt(match[2], 10);
    const t3 = parseInt(match[3], 10);
    const t4 = parseInt(match[4], 10);

    const diff1 = t2 - t1;
    const diff2 = t3 - t2;
    const diff3 = t4 - t3;
    const s1 = diff2 - diff1;
    const s2 = diff3 - diff2;
    assert.equal(s1, s2, `Second difference not constant: ${s1} != ${s2}`);

    // Solve independently:
    const a = s1 / 2;
    const b = diff1 - 3 * a;
    const c = t1 - a - b;

    // Check all 4 terms:
    for (let n = 1; n <= 4; n++) {
      const termN = a * n * n + b * n + c;
      const expected = [t1, t2, t3, t4][n - 1];
      assert.equal(termN, expected, `Term T_${n} formula does not match: ${termN} != ${expected}`);
    }
  }
});

test('Adversarial Oracle: Sum to Infinity (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateSumToInfinity();
    assertGlobalInvariants(q, `SumToInfinity[${i}]`);

    // Parse memo step 1: a = X, \quad r = Y (|r| < 1)
    const memoStep1 = q.nscMemo.steps[0].stepLatex;
    const matchA = memoStep1.match(/a = (-?\d+)/);
    assert.ok(matchA, `Could not parse a from memo: ${memoStep1}`);
    const a = parseInt(matchA[1], 10);

    let r = 0;
    if (memoStep1.includes('-\\frac{1}{2}')) r = -0.5;
    else if (memoStep1.includes('\\frac{1}{2}')) r = 0.5;
    else if (memoStep1.includes('\\frac{1}{3}')) r = 1 / 3;
    else if (memoStep1.includes('\\frac{1}{4}')) r = 0.25;
    else assert.fail(`Unknown r ratio in memo: ${memoStep1}`);

    assert.ok(Math.abs(r) < 1, `Convergence condition violated: |${r}| >= 1`);
    const expectedSum = Math.round(a / (1 - r));

    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    assert.equal(correctDistractor.latex, `S_\\infty = ${expectedSum}`);
  }
});

test('Adversarial Oracle: Hyperbola Asymptotes (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateHyperbolaAsymptotes();
    assertGlobalInvariants(q, `HyperbolaAsymptotes[${i}]`);

    // f(x) = \frac{a}{x (+/-) p} (+/-) q
    const match = q.questionLatex.match(/\\frac\{(-?\d+)\}\{x\s*([+-]\s*\d+)\}\s*([+-]\s*\d+)/);
    assert.ok(match, `Could not parse hyperbola from ${q.questionLatex}`);
    const pShift = parseInt(match[2].replace(/\s+/g, ''), 10);
    const qShift = parseInt(match[3].replace(/\s+/g, ''), 10);

    // In function denominator: x + pShift => x = -pShift is asymptote
    const expectedVertX = -pShift;
    const expectedHorizY = qShift;

    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    assert.equal(
      correctDistractor.latex,
      `x = ${expectedVertX} \\quad \\text{and} \\quad y = ${expectedHorizY}`
    );
  }
});

test('Adversarial Oracle: Mortgage Repayments (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateMortgageRepayment();
    assertGlobalInvariants(q, `MortgageRepayment[${i}]`);

    // Parse principal, years, rate from question
    const pMatch = q.questionLatex.match(/\\text\{R\}\\?,?([0-9\s\u00a0,]+).*?over\s*\}\s*(\d+).*?years at\s*\}\s*([0-9.]+)\\%/);
    assert.ok(pMatch, `Could not parse mortgage question from ${q.questionLatex}`);
    const pStr = pMatch[1].replace(/[\s\u00a0,]/g, '');
    const loanP = parseFloat(pStr);
    const years = parseInt(pMatch[2], 10);
    const ratePct = parseFloat(pMatch[3]);

    const n = years * 12;
    const iRate = ratePct / 100 / 12;
    const factor = 1 - Math.pow(1 + iRate, -n);
    const expectedPayment = (loanP * iRate) / factor;

    // Check that expectedPayment is realistic and positive
    assert.ok(expectedPayment > 0, 'Monthly repayment must be positive');
    assert.ok(expectedPayment < loanP, 'Monthly repayment must be less than loan principal');

    // Parse correct answer
    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    const ansMatch = correctDistractor.latex.match(/x\s*=\s*\\text\{R\}\\?,?([0-9\s\u00a0,.]+)/);
    assert.ok(ansMatch, `Could not parse repayment from ${correctDistractor.latex}`);
    const rawVal = ansMatch[1].replace(/[\s\u00a0]/g, '').replace(',', '.');
    const parsedPayment = parseFloat(rawVal);

    // Must match within 0.05
    assert.ok(
      Math.abs(parsedPayment - expectedPayment) < 0.05,
      `Mortgage payment mismatch: parsed ${parsedPayment} != expected ${expectedPayment}`
    );
  }
});

test('Adversarial Oracle: Cubic Turning Points (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateCubicTurningPoints();
    assertGlobalInvariants(q, `CubicTurningPoints[${i}]`);

    // Parse turning points from correct answer: (x1 ; y1) \quad \text{and} \quad (x2 ; y2)
    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    const match = correctDistractor.latex.match(/\((-?\d+)\s*;\s*(-?\d+)\)\s*\\quad\s*\\text\{and\}\s*\\quad\s*\((-?\d+)\s*;\s*(-?\d+)\)/);
    assert.ok(match, `Could not parse turning points from ${correctDistractor.latex}`);
    const x1 = parseInt(match[1], 10);
    const y1 = parseInt(match[2], 10);
    const x2 = parseInt(match[3], 10);
    const y2 = parseInt(match[4], 10);

    // Verify derivative at x1 and x2 equals 0
    // From memo step 1: f'(x) = A x^2 + B x + C = 0
    const fPrimeStep = q.nscMemo.steps[0].stepLatex;
    const primeMatch = fPrimeStep.match(/f'\(x\)\s*=\s*(-?\d*)x\^2\s*([+-]\s*\d*)x\s*([+-]\s*\d*)\s*=\s*0/);
    assert.ok(primeMatch, `Could not parse f'(x) from ${fPrimeStep}`);
    const aPrime = parseInt(primeMatch[1], 10);
    const bPrime = parseInt(primeMatch[2].replace(/\s+/g, ''), 10);
    const cPrime = parseInt(primeMatch[3].replace(/\s+/g, ''), 10);

    const evalPrime1 = aPrime * x1 * x1 + bPrime * x1 + cPrime;
    const evalPrime2 = aPrime * x2 * x2 + bPrime * x2 + cPrime;
    assert.equal(evalPrime1, 0, `f'(${x1}) != 0: got ${evalPrime1}`);
    assert.equal(evalPrime2, 0, `f'(${x2}) != 0: got ${evalPrime2}`);
    assert.notEqual(x1, x2, `Turning points cannot have identical x-coordinates`);
  }
});

test('Adversarial Oracle: Regression Line (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateRegressionLine();
    assertGlobalInvariants(q, `RegressionLine[${i}]`);

    // Parse bivariate data: (1; y1), (2; y2), (3; y3), (4; y4), (5; y5)
    const dataMatches = [...q.questionLatex.matchAll(/\((\d+);\s*([0-9.]+)\)/g)];
    assert.equal(dataMatches.length, 5, `Expected 5 data pairs, found ${dataMatches.length}`);

    const pts = dataMatches.map((m) => ({ x: parseFloat(m[1]), y: parseFloat(m[2]) }));
    const meanX = 3.0;
    const meanY = pts.reduce((s, p) => s + p.y, 0) / 5;

    let ssXY = 0;
    let ssXX = 0;
    for (const p of pts) {
      ssXY += (p.x - meanX) * (p.y - meanY);
      ssXX += (p.x - meanX) * (p.x - meanX);
    }
    const expectedB = Number((ssXY / ssXX).toFixed(2));
    const expectedA = Number((meanY - expectedB * meanX).toFixed(2));

    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    assert.equal(correctDistractor.latex, `\\hat{y} = ${expectedA} + ${expectedB}x`);
  }
});

test('Adversarial Oracle: Circle Tangents (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateCircleTangent();
    assertGlobalInvariants(q, `CircleTangent[${i}]`);

    // Parse C(cx; cy) and P(px; py)
    const match = q.questionLatex.match(/C\((-?\d+);\s*(-?\d+)\).*?P\((-?\d+);\s*(-?\d+)\)/);
    assert.ok(match, `Could not parse centre and point from ${q.questionLatex}`);
    const cx = parseInt(match[1], 10);
    const cy = parseInt(match[2], 10);
    const px = parseInt(match[3], 10);
    const py = parseInt(match[4], 10);

    const dx = px - cx;
    const dy = py - cy;
    assert.ok(dx !== 0 && dy !== 0, 'dx and dy must be non-zero');

    // Radius gradient m_rad = dy / dx
    // Tangent gradient m_tan = -dx / dy
    const mRad = dy / dx;
    const mTan = -dx / dy;
    assert.equal(mRad * mTan, -1, 'Tangent must be perpendicular to radius (m_rad * m_tan == -1)');

    // Tangent line passes through P(px, py): y - py = m_tan (x - px)
    // At x = px: y must equal py
    const cTan = py - mTan * px;
    const evaluatedY = mTan * px + cTan;
    assert.ok(Math.abs(evaluatedY - py) < 1e-9, `Tangent does not pass through P: ${evaluatedY} != ${py}`);
  }
});

test('Adversarial Oracle: Inclination Angles (250 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const q = generateInclinationAngle();
    assertGlobalInvariants(q, `InclinationAngle[${i}]`);

    // Parse A(x1; y1) and B(x2; y2)
    const match = q.questionLatex.match(/A\((-?\d+);\s*(-?\d+)\).*?B\((-?\d+);\s*(-?\d+)\)/);
    assert.ok(match, `Could not parse points A and B from ${q.questionLatex}`);
    const x1 = parseInt(match[1], 10);
    const y1 = parseInt(match[2], 10);
    const x2 = parseInt(match[3], 10);
    const y2 = parseInt(match[4], 10);

    const m = (y2 - y1) / (x2 - x1);
    let expectedAngle = 0;
    if (m === 1) expectedAngle = 45;
    else if (m === -1) expectedAngle = 135;
    else if (m > 0) expectedAngle = Number((Math.atan(m) * (180 / Math.PI)).toFixed(2));
    else expectedAngle = Number((180 + Math.atan(m) * (180 / Math.PI)).toFixed(2));

    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    assert.equal(correctDistractor.latex, `m = ${m} \\quad \\text{and} \\quad \\theta = ${expectedAngle}^\\circ`);
  }
});

test('Adversarial Oracle: Trigonometric General Solutions (100 runs)', () => {
  for (let i = 0; i < 100; i++) {
    const q = generateTrigGeneralSolution();
    assertGlobalInvariants(q, `TrigGeneralSolution[${i}]`);
    const correctDistractor = q.distractors.find((d) => d.id === q.correctAnswerId);
    assert.ok(correctDistractor.latex.includes('k \\in \\mathbb{Z}'));
  }
});

test('Adversarial Oracle: Euclidean Geometry Cyclic Quad & Tan-Chord (500 runs)', () => {
  for (let i = 0; i < 250; i++) {
    const qQuad = generateCyclicQuadQuestion();
    assertGlobalInvariants(qQuad, `CyclicQuad[${i}]`);

    // Parse angle A
    const match = qQuad.questionLatex.match(/\\hat\{A\} = (\d+)\^\\circ/);
    assert.ok(match, `Could not parse angle A from ${qQuad.questionLatex}`);
    const angleA = parseInt(match[1], 10);
    const expectedC = 180 - angleA;

    const correctDistractor = qQuad.distractors.find((d) => d.id === qQuad.correctAnswerId);
    assert.equal(
      correctDistractor.latex,
      `\\hat{C} = ${expectedC}^\\circ \\quad [\\text{opp } \\angle\\text{s of cyclic quad}]`
    );
  }

  for (let i = 0; i < 250; i++) {
    const qTan = generateTanChordQuestion();
    assertGlobalInvariants(qTan, `TanChord[${i}]`);

    // Parse angle S
    const match = qTan.questionLatex.match(/\\hat\{S\} = (\d+)\^\\circ/);
    assert.ok(match, `Could not parse angle S from ${qTan.questionLatex}`);
    const theta = parseInt(match[1], 10);

    const correctDistractor = qTan.distractors.find((d) => d.id === qTan.correctAnswerId);
    assert.equal(
      correctDistractor.latex,
      `P\\hat{T}R = ${theta}^\\circ \\quad [\\text{tan-chord thm}]`
    );
  }
});

test('Master Dispatcher Randomized Stress Test: 1,000 iterations (500 P1 + 500 P2)', () => {
  for (let i = 0; i < 500; i++) {
    const q1 = generateP1Question();
    assertGlobalInvariants(q1, `RandomizedP1[${i}]`);
  }
  for (let i = 0; i < 500; i++) {
    const q2 = generateP2Question();
    assertGlobalInvariants(q2, `RandomizedP2[${i}]`);
  }
});
