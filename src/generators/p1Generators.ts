import type { Question, CognitiveLevel } from '../types/curriculum.ts';
import {
  randomInt,
  randomNonZeroInt,
  randomChoice,
  formatQuadraticLatex,
  formatFractionLatex,
  formatRootsLatex,
  formatCurrencyLatex,
  formatIntegerLatex,
  buildDistractorSet,
  assertNoNaNOrUndefined,
} from './utils.ts';

/**
 * Generates quadratic equation questions with guaranteed perfect-square discriminants.
 */
export function generateQuadraticEquation(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  const r1 = randomNonZeroInt(-8, 8);
  let r2 = randomNonZeroInt(-8, 8);
  while (r2 === r1) {
    r2 = randomNonZeroInt(-8, 8);
  }

  const a = randomChoice([1, 2, 3]);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const delta = b * b - 4 * a * c; // Invariant: a²(r1 - r2)² > 0, always perfect square

  const questionLatex = `\\text{Solve for } x: \\; ${formatQuadraticLatex(a, b, c)}`;
  const correctLatex = formatRootsLatex(r1, r2);
  const correctExp = `Correct! Roots from factoring or quadratic formula are ${correctLatex}.`;

  const candidates = [
    {
      latex: formatRootsLatex(-r1, -r2),
      explanation: 'DIST-SIGN: Inverted signs when equating factors to zero.',
    },
    {
      latex: `x = ${r1} \\text{ only}`,
      explanation: 'DIST-QUAD: Dropped second root.',
    },
    {
      latex: `x = ${r2} \\text{ only}`,
      explanation: 'DIST-QUAD: Dropped first root.',
    },
    {
      latex: formatRootsLatex(-r1, r2),
      explanation: 'DIST-SIGN: Flipped sign on one factor only.',
    },
    {
      latex: formatRootsLatex(r1, -r2),
      explanation: 'DIST-SIGN: Flipped sign on other factor only.',
    },
    {
      latex: formatRootsLatex(r1 + 2, r2 + 2),
      explanation: 'Arithmetic offset when finding factors.',
    },
    {
      latex: formatRootsLatex(r1 - 2, r2 - 2),
      explanation: 'Arithmetic offset when finding factors.',
    },
    {
      latex: formatRootsLatex(r1 + 1, r2 + 2),
      explanation: 'Arithmetic error in factorisation.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P1-ALG-QUAD-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P1',
    topic: 'algebra',
    cognitiveLevel,
    marks: 4,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `Discriminant Δ = ${delta}, which is a clean perfect square of ${Math.sqrt(delta)}. Look for two factors of c that sum to b and take the marks.`,
    nscMemo: {
      steps: [
        {
          stepLatex: `${formatQuadraticLatex(a, b, c)}`,
          tickAllocation: '\\checkmark\\text{ (Standard form)}',
        },
        {
          stepLatex: `x = \\frac{-(${b}) \\pm \\sqrt{${b}^2 - 4(${a})(${c})}}{2(${a})} = \\frac{${-b} \\pm ${Math.sqrt(delta)}}{${2 * a}}`,
          tickAllocation: '\\checkmark\\checkmark\\text{ (Correct substitution into formula)}',
        },
        {
          stepLatex: `${correctLatex}`,
          tickAllocation: '\\checkmark\\text{ (Both roots correct)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P1-AL-01',
  };

  assertNoNaNOrUndefined(q, 'generateQuadraticEquation');
  return q;
}

/**
 * Generates quadratic inequality questions.
 */
export function generateQuadraticInequality(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  const r1 = randomInt(-6, 2);
  const r2 = randomInt(r1 + 2, 7); // Invariant: r1 < r2 strictly

  const b = -(r1 + r2);
  const c = r1 * r2;
  const isLessThan = Math.random() > 0.5;

  const inequalitySymbol = isLessThan ? '\\le' : '>';
  let bTerm = '';
  if (b > 0) {
    bTerm = b === 1 ? ' + x' : ` + ${b}x`;
  } else if (b < 0) {
    bTerm = b === -1 ? ' - x' : ` - ${Math.abs(b)}x`;
  }
  const cTerm = c > 0 ? ` + ${c}` : c < 0 ? ` - ${Math.abs(c)}` : '';
  const questionLatex = `\\text{Solve for } x: \\; x^2${bTerm}${cTerm} ${inequalitySymbol} 0`;

  let correctLatex = '';
  let correctExp = '';
  if (isLessThan) {
    correctLatex = `${r1} \\le x \\le ${r2}`;
    correctExp = `Correct! Parabola opens upward and is on or below x-axis between critical values ${r1} and ${r2}.`;
  } else {
    correctLatex = `x < ${r1} \\;\\text{or}\\; x > ${r2}`;
    correctExp = `Correct! Parabola opens upward and is strictly above x-axis outside critical values ${r1} and ${r2}.`;
  }

  const candidates = isLessThan
    ? [
        {
          latex: `x \\le ${r1} \\;\\text{or}\\; x \\ge ${r2}`,
          explanation: 'DIST-QUAD: Inverted inner vs outer interval relation.',
        },
        {
          latex: `${r1} < x < ${r2}`,
          explanation: 'Strict inequality used when non-strict boundary included.',
        },
        {
          latex: `x < ${r1} \\;\\text{or}\\; x > ${r2}`,
          explanation: 'Inverted interval relation and strict boundary error.',
        },
        {
          latex: `${Math.min(-r2, -r1)} \\le x \\le ${Math.max(-r2, -r1)}`,
          explanation: 'DIST-SIGN: Flipped signs of critical values.',
        },
        {
          latex: `${r1 - 1} \\le x \\le ${r2 + 1}`,
          explanation: 'Arithmetic offset on critical values.',
        },
        {
          latex: `x \\le ${r1 - 1} \\;\\text{or}\\; x \\ge ${r2 + 1}`,
          explanation: 'Inverted relation with arithmetic offset.',
        },
      ]
    : [
        {
          latex: `${r1} < x < ${r2}`,
          explanation: 'DIST-QUAD: Inverted outer disjoint intervals to inner interval.',
        },
        {
          latex: `x \\le ${r1} \\;\\text{or}\\; x \\ge ${r2}`,
          explanation: 'Included boundary endpoints on strict inequality.',
        },
        {
          latex: `${r1} \\le x \\le ${r2}`,
          explanation: 'Inverted interval and incorrectly included endpoints.',
        },
        {
          latex: `x < ${Math.min(-r2, -r1)} \\;\\text{or}\\; x > ${Math.max(-r2, -r1)}`,
          explanation: 'DIST-SIGN: Flipped signs of critical values.',
        },
        {
          latex: `x < ${r1 - 1} \\;\\text{or}\\; x > ${r2 + 1}`,
          explanation: 'Arithmetic offset on critical values.',
        },
        {
          latex: `${r1 - 1} < x < ${r2 + 1}`,
          explanation: 'Inverted relation with arithmetic offset.',
        },
      ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P1-ALG-INEQ-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P1',
    topic: 'algebra',
    cognitiveLevel,
    marks: 4,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: isLessThan
      ? `The parabola smiles and we want underwater (<= 0), so x is trapped between the two roots ${r1} and ${r2}. Sandwiched notation!`
      : `The parabola smiles and we want above the surface (> 0), so x heads out toward negative infinity or positive infinity. Two separate wings!`,
    nscMemo: {
      steps: [
        {
          stepLatex: `(x - ${r1})(x - ${r2}) ${inequalitySymbol} 0`,
          tickAllocation: '\\checkmark\\text{ (Factorisation)}',
        },
        {
          stepLatex: `\\text{Critical values: } x = ${r1} \\;\\text{or}\\; x = ${r2}`,
          tickAllocation: '\\checkmark\\text{ (Critical values)}',
        },
        {
          stepLatex: `${correctLatex}`,
          tickAllocation: '\\checkmark\\checkmark\\text{ (Correct interval notation and endpoints)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P1-AL-01',
  };

  assertNoNaNOrUndefined(q, 'generateQuadraticInequality');
  return q;
}

/**
 * Generates surd equation with guaranteed extraneous root.
 */
export function generateSurdEquation(cognitiveLevel: CognitiveLevel = 'L3'): Question {
  const m = randomInt(2, 5);
  // Choose valid root r1 > m, extraneous root r2 <= m
  const r1 = m + randomInt(2, 4);
  const r2 = m - randomInt(1, 3);
  // Sum = 2m + 1, product = r1 * r2
  // Let k = m^2 - r1 * r2 + (2m + 1 - (r1 + r2)) * x, but to ensure clean surd:
  // sqrt(x + k) = x - m => x + k = x² - 2mx + m² => x² - (2m + 1)x + (m² - k) = 0
  // So set r1 + r2 = 2m + 1 and k = m² - r1 * r2.
  const sum = 2 * m + 1;
  const validR1 = m + randomInt(2, 4);
  const extR2 = sum - validR1;
  const k = m * m - validR1 * extR2;

  const questionLatex = `\\text{Solve for } x: \\; \\sqrt{x ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}} = x - ${m}.`;
  const correctLatex = `x = ${validR1} \\quad (x = ${extR2} \\text{ rejected})`;
  const correctExp = `Correct! Squaring introduces extraneous root x = ${extR2} since RHS = ${extR2 - m} < 0. Valid root is x = ${validR1}.`;

  const candidates = [
    {
      latex: `x = ${validR1} \\;\\text{or}\\; x = ${extR2}`,
      explanation: 'DIST-SURD: Forgot to check roots in original equation; kept extraneous root.',
    },
    {
      latex: `x = ${extR2} \\quad (x = ${validR1} \\text{ rejected})`,
      explanation: 'Reversed the validation test and kept the invalid root.',
    },
    {
      latex: `x = ${validR1 + 2}`,
      explanation: 'Algebraic error squaring binomial (x - m)²',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P1-ALG-SURD-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P1',
    topic: 'algebra',
    cognitiveLevel,
    marks: 5,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `Always test your solutions in surd equations! When you plug in x = ${extR2}, the right side gives ${extR2 - m}, but square roots are always non-negative. Extraneous root detected and evicted.`,
    nscMemo: {
      steps: [
        {
          stepLatex: `x ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`} = (x - ${m})^2 = x^2 - ${2 * m}x + ${m * m}`,
          tickAllocation: '\\checkmark\\text{ (Squaring both sides correctly)}',
        },
        {
          stepLatex: `x^2 - ${sum}x + ${validR1 * extR2} = 0`,
          tickAllocation: '\\checkmark\\text{ (Standard quadratic form)}',
        },
        {
          stepLatex: `(x - ${validR1})(x - ${extR2}) = 0 \\implies x = ${validR1} \\;\\text{or}\\; x = ${extR2}`,
          tickAllocation: '\\checkmark\\text{ (Solving both candidate roots)}',
        },
        {
          stepLatex: `\\text{Check: } x = ${extR2} \\implies \\sqrt{${extR2 + k}} \\ne ${extR2 - m} \\implies \\text{reject } x = ${extR2}`,
          tickAllocation: '\\checkmark\\text{ (Testing and rejecting extraneous root)}',
        },
        {
          stepLatex: `x = ${validR1}`,
          tickAllocation: '\\checkmark\\text{ (Final valid answer)}',
        },
      ],
      totalMarks: 5,
    },
    formulaRefId: 'P1-AL-01',
  };

  assertNoNaNOrUndefined(q, 'generateSurdEquation');
  return q;
}

/**
 * Generates arithmetic sequence & series questions.
 */
export function generateArithmeticSequence(cognitiveLevel: CognitiveLevel = 'L1'): Question {
  const a = randomInt(-10, 20);
  const d = randomNonZeroInt(-6, 8);
  const n = randomInt(12, 25);

  const termN = a + (n - 1) * d;
  const t1 = a;
  const t2 = a + d;
  const t3 = a + 2 * d;

  const questionLatex = `\\text{Given the arithmetic sequence: } ${t1} ; ${t2} ; ${t3} ; \\dots \\text{ Determine the } ${n}^{\\text{th}} \\text{ term } (T_{${n}}).`;
  const correctLatex = `T_{${n}} = ${termN}`;
  const correctExp = `Correct! T_${n} = a + (n - 1)d = ${a} + (${n} - 1)(${d}) = ${termN}.`;

  const candidates = [
    {
      latex: `T_{${n}} = ${a + n * d}`,
      explanation: 'Used n instead of n - 1 in formula.',
    },
    {
      latex: `T_{${n}} = ${termN - d}`,
      explanation: 'Off-by-one index subtraction.',
    },
    {
      latex: `T_{${n}} = ${termN + 2 * d}`,
      explanation: 'Added extra difference terms.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P1-SEQ-ARITH-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P1',
    topic: 'patterns',
    cognitiveLevel,
    marks: 3,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `First term is ${a}, common difference is ${d}. T_${n} is just ${n - 1} steps of ${d} added to ${a}. Clean arithmetic, free marks.`,
    nscMemo: {
      steps: [
        {
          stepLatex: `a = ${a}, \\quad d = ${t2} - (${t1}) = ${d}`,
          tickAllocation: '\\checkmark\\text{ (Identify a and d)}',
        },
        {
          stepLatex: `T_{${n}} = ${a} + (${n} - 1)(${d})`,
          tickAllocation: '\\checkmark\\text{ (Substitution into } T_n \\text{ formula)}',
        },
        {
          stepLatex: `T_{${n}} = ${termN}`,
          tickAllocation: '\\checkmark\\text{ (Accuracy)}',
        },
      ],
      totalMarks: 3,
    },
    formulaRefId: 'P1-SQ-01',
  };

  assertNoNaNOrUndefined(q, 'generateArithmeticSequence');
  return q;
}

/**
 * Generates quadratic sequence questions.
 */
export function generateQuadraticSequence(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  const a = randomChoice([1, 2, 3]);
  const b = randomNonZeroInt(-4, 5);
  const c = randomInt(-5, 10);

  const t1 = a + b + c;
  const t2 = 4 * a + 2 * b + c;
  const t3 = 9 * a + 3 * b + c;
  const t4 = 16 * a + 4 * b + c;

  const diff1 = t2 - t1;
  const diff2 = 2 * a;

  const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const cSign = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  const bTerm = b === 1 ? '+ n' : b === -1 ? '- n' : `${bSign}n`;
  const correctLatex = `T_n = ${a === 1 ? '' : `${a}`}n^2 ${bTerm} ${cSign}`;
  const correctExp = `Correct! 2a = ${diff2} ⟹ a = ${a}; 3a + b = ${diff1} ⟹ b = ${b}; a + b + c = ${t1} ⟹ c = ${c}.`;

  const questionLatex = `\\text{Consider the quadratic sequence: } ${t1} ; ${t2} ; ${t3} ; ${t4} ; \\dots \\text{ Determine the general term } T_n.`;

  const candidates = [
    {
      latex: `T_n = ${diff2}n^2 ${bTerm} ${cSign}`,
      explanation: 'Used second difference directly as a without dividing by 2.',
    },
    {
      latex: `T_n = ${a === 1 ? '' : `${a}`}n^2 ${b >= 0 ? `- ${b}` : `+ ${Math.abs(b)}`}n ${cSign}`,
      explanation: 'DIST-SIGN: Inverted sign of b coefficient.',
    },
    {
      latex: `T_n = ${a === 1 ? '' : `${a}`}n^2 ${bTerm} ${c >= 0 ? `- ${c}` : `+ ${Math.abs(c)}`}`,
      explanation: 'DIST-SIGN: Inverted constant term c.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P1-SEQ-QUAD-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P1',
    topic: 'patterns',
    cognitiveLevel,
    marks: 4,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `Second difference is ${diff2}. Remember: 2a = ${diff2}, so a = ${a}. Then 3a + b = ${diff1} gives b = ${b}. Three linear equations, three variables. Lock it down.`,
    nscMemo: {
      steps: [
        {
          stepLatex: `2a = ${diff2} \\implies a = ${a}`,
          tickAllocation: '\\checkmark\\text{ (Value of a)}',
        },
        {
          stepLatex: `3a + b = ${diff1} \\implies 3(${a}) + b = ${diff1} \\implies b = ${b}`,
          tickAllocation: '\\checkmark\\text{ (Value of b)}',
        },
        {
          stepLatex: `a + b + c = ${t1} \\implies ${a} + (${b}) + c = ${t1} \\implies c = ${c}`,
          tickAllocation: '\\checkmark\\text{ (Value of c)}',
        },
        {
          stepLatex: `${correctLatex}`,
          tickAllocation: '\\checkmark\\text{ (Final equation)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'UN-SQ-01',
  };

  assertNoNaNOrUndefined(q, 'generateQuadraticSequence');
  return q;
}

/**
 * Generates geometric series sum to infinity questions.
 */
export function generateSumToInfinity(cognitiveLevel: CognitiveLevel = 'L3'): Question {
  // Invariant: |r| < 1
  const rFrac = randomChoice([
    { num: 1, den: 2, val: 0.5, str: '\\frac{1}{2}' },
    { num: 1, den: 3, val: 1 / 3, str: '\\frac{1}{3}' },
    { num: 1, den: 4, val: 0.25, str: '\\frac{1}{4}' },
    { num: -1, den: 2, val: -0.5, str: '-\\frac{1}{2}' },
  ]);

  // Choose a as multiple of den to guarantee clean integer sum
  const k = randomInt(4, 12);
  const a = k * (rFrac.den - rFrac.num);
  const sumInf = Math.round(a / (1 - rFrac.val));

  const t1 = a;
  const t2 = formatFractionLatex(a * rFrac.num, rFrac.den);
  const t3 = formatFractionLatex(a * rFrac.num * rFrac.num, rFrac.den * rFrac.den);

  const questionLatex = `\\text{Given the convergent geometric series: } ${t1} + ${t2} + ${t3} + \\dots \\text{ Calculate the sum to infinity } (S_\\infty).`;
  const correctLatex = `S_\\infty = ${sumInf}`;
  const correctExp = `Correct! S_∞ = a / (1 - r) = ${a} / (1 - (${rFrac.str})) = ${sumInf}.`;

  const candidates = [
    {
      latex: `S_\\infty = ${sumInf * 2}`,
      explanation: 'Divided by r instead of 1 - r in denominator.',
    },
    {
      latex: `S_\\infty = ${Math.round(a / (1 + rFrac.val))}`,
      explanation: 'Used 1 + r instead of 1 - r in denominator.',
    },
    {
      latex: `S_\\infty = ${a}`,
      explanation: 'Confused sum to infinity with first term a.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P1-SEQ-INF-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P1',
    topic: 'patterns',
    cognitiveLevel,
    marks: 3,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `Series converges because |r| = |${rFrac.str}| < 1. Formula is a / (1 - r). Don't mess up the fraction subtraction in the denominator!`,
    nscMemo: {
      steps: [
        {
          stepLatex: `a = ${a}, \\quad r = ${rFrac.str} \\quad (|r| < 1)`,
          tickAllocation: '\\checkmark\\text{ (Identify a and r with convergence condition)}',
        },
        {
          stepLatex: `S_\\infty = \\frac{${a}}{1 - (${rFrac.str})}`,
          tickAllocation: '\\checkmark\\text{ (Substitution into } S_\\infty \\text{ formula)}',
        },
        {
          stepLatex: `S_\\infty = ${sumInf}`,
          tickAllocation: '\\checkmark\\text{ (Answer)}',
        },
      ],
      totalMarks: 3,
    },
    formulaRefId: 'P1-SQ-05',
  };

  assertNoNaNOrUndefined(q, 'generateSumToInfinity');
  return q;
}

/**
 * Generates hyperbola asymptote and symmetry questions.
 */
export function generateHyperbolaAsymptotes(cognitiveLevel: CognitiveLevel = 'L1'): Question {
  const p = randomNonZeroInt(-5, 5);
  const q = randomNonZeroInt(-5, 5);
  const a = randomChoice([-4, -2, 2, 4]);

  const pStr = p > 0 ? `- ${p}` : `+ ${Math.abs(p)}`;
  const qStr = q > 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
  const questionLatex = `\\text{Write down the equations of the vertical and horizontal asymptotes of } f(x) = \\frac{${a}}{x ${pStr}} ${qStr}.`;

  const correctLatex = `x = ${p} \\quad \\text{and} \\quad y = ${q}`;
  const correctExp = `Correct! Vertical asymptote is where denominator equals zero (x = ${p}); horizontal asymptote is the vertical shift (y = ${q}).`;

  const candidates = [
    {
      latex: `x = ${-p} \\quad \\text{and} \\quad y = ${q}`,
      explanation: 'DIST-SIGN: Flipped sign on vertical asymptote.',
    },
    {
      latex: `x = ${p} \\quad \\text{and} \\quad y = ${-q}`,
      explanation: 'DIST-SIGN: Flipped sign on horizontal asymptote.',
    },
    {
      latex: `y = ${p} \\quad \\text{and} \\quad x = ${q}`,
      explanation: 'Swapped horizontal and vertical asymptote variables.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const question: Question = {
    id: `GEN-P1-FUN-HYP-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P1',
    topic: 'functions',
    cognitiveLevel,
    marks: 2,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `Denominator cannot be 0, so x = ${p} is forbidden. The constant outside is ${q}, so y = ${q} is your horizontal boundary. Two lines, two marks.`,
    nscMemo: {
      steps: [
        {
          stepLatex: `x = ${p}`,
          tickAllocation: '\\checkmark\\text{ (Vertical asymptote)}',
        },
        {
          stepLatex: `y = ${q}`,
          tickAllocation: '\\checkmark\\text{ (Horizontal asymptote)}',
        },
      ],
      totalMarks: 2,
    },
    formulaRefId: 'UN-FN-01',
  };

  assertNoNaNOrUndefined(question, 'generateHyperbolaAsymptotes');
  return question;
}

/**
 * Generates financial mortgage repayment questions.
 */
export function generateMortgageRepayment(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  const loanP = randomChoice([600000, 850000, 1000000, 1200000, 1500000]);
  const ratePct = randomChoice([9.5, 10.0, 10.5, 11.0, 11.5, 12.0]);
  const years = randomChoice([15, 20, 25]);
  const n = years * 12;
  const i = ratePct / 100 / 12;

  // Invariant: P * i / (1 - (1+i)^(-n))
  const factor = 1 - Math.pow(1 + i, -n);
  const monthlyPayment = (loanP * i) / factor;

  const formattedP = formatIntegerLatex(loanP);
  const questionLatex = `\\text{A home loan of } \\text{R}\\,${formattedP} \\text{ is repaid over } ${years} \\text{ years at } ${ratePct}\\% \\text{ p.a. compounded monthly. Calculate the monthly repayment } x.`;

  const correctLatex = `x = \\text{R}\\,${formatCurrencyLatex(monthlyPayment)}`;
  const correctExp = `Correct! Present value annuity formula with P = R ${formattedP}, i = ${ratePct}% / 12, n = ${n}.`;

  const candidates = [
    {
      latex: `x = \\text{R}\\,${formatCurrencyLatex(monthlyPayment * 1.15)}`,
      explanation: 'DIST-COMP: Calculated using simple interest or misapplied monthly interest conversion.',
    },
    {
      latex: `x = \\text{R}\\,${formatCurrencyLatex(loanP / n)}`,
      explanation: 'Divided principal by months without adding compound interest.',
    },
    {
      latex: `x = \\text{R}\\,${formatCurrencyLatex(monthlyPayment * 0.85)}`,
      explanation: 'Used positive exponent (1 + i)^n instead of negative exponent (1 + i)^(-n).',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P1-FIN-BOND-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P1',
    topic: 'finance',
    cognitiveLevel,
    marks: 4,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `Bond repayment = Present Value Annuity P. Multiply years (${years}) by 12 to get ${n} total payments. Divide rate by 12. Don't forget the negative exponent in the denominator!`,
    nscMemo: {
      steps: [
        {
          stepLatex: `i = \\frac{${ratePct / 100}}{12}, \\quad n = ${years} \\times 12 = ${n}`,
          tickAllocation: '\\checkmark\\text{ (Identify i and n)}',
        },
        {
          stepLatex: `${formattedP} = \\frac{x[1 - (1 + \\frac{${ratePct / 100}}{12})^{-${n}}]}{\\frac{${ratePct / 100}}{12}}`,
          tickAllocation: '\\checkmark\\checkmark\\text{ (Substitution into PV formula)}',
        },
        {
          stepLatex: `${correctLatex}`,
          tickAllocation: '\\checkmark\\text{ (Answer to 2 decimal places)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P1-FN-06',
  };

  assertNoNaNOrUndefined(q, 'generateMortgageRepayment');
  return q;
}

/**
 * Generates cubic polynomial turning points with integer coordinates.
 */
export function generateCubicTurningPoints(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  // Choose integer stationary points
  const x1 = randomInt(-3, 1);
  let x2 = randomInt(x1 + 2, 4);
  // Ensure sum is even if a=1, or adjust a to 2 if odd to keep integer polynomial coefficients
  let a = 1;
  if ((x1 + x2) % 2 !== 0) {
    a = 2; // Invariant: 3a(x1 + x2)/2 is integer when a is even!
  }

  // f'(x) = 3a(x - x1)(x - x2) = 3a x² - 3a(x1 + x2)x + 3a x1 x2
  // f(x) = a x³ - [3a(x1 + x2)/2] x² + [3a x1 x2] x + d
  const b = -((3 * a * (x1 + x2)) / 2);
  const c = 3 * a * x1 * x2;
  const d = randomInt(-5, 5);

  const evalF = (x: number) => a * x * x * x + b * x * x + c * x + d;
  const y1 = evalF(x1);
  const y2 = evalF(x2);

  const aStr = a === 1 ? 'x^3' : `${a}x^3`;
  const bStr = b > 0 ? `+ ${b}x^2` : b < 0 ? `- ${Math.abs(b)}x^2` : '';
  const cStr = c > 0 ? `+ ${c}x` : c < 0 ? `- ${Math.abs(c)}x` : '';
  const dStr = d > 0 ? `+ ${d}` : d < 0 ? `- ${Math.abs(d)}` : '';

  const questionLatex = `\\text{Determine the coordinates of the turning points of } f(x) = ${aStr} ${bStr} ${cStr} ${dStr}.`;
  const correctLatex = `(${x1} ; ${y1}) \\quad \\text{and} \\quad (${x2} ; ${y2})`;
  const correctExp = `Correct! f'(x) = 0 gives stationary x = ${x1} and x = ${x2}. Evaluating f(${x1}) = ${y1} and f(${x2}) = ${y2}.`;

  const candidates = [
    {
      latex: `(${-x1} ; ${y1}) \\quad \\text{and} \\quad (${-x2} ; ${y2})`,
      explanation: 'DIST-SIGN: Inverted signs of x-coordinates of turning points.',
    },
    {
      latex: `(${x1} ; 0) \\quad \\text{and} \\quad (${x2} ; 0)`,
      explanation: 'Stated x-intercepts instead of evaluating y-coordinates.',
    },
    {
      latex: `(${x1} ; ${y1 + 4}) \\quad \\text{and} \\quad (${x2} ; ${y2 - 4})`,
      explanation: 'Arithmetic error when substituting x-values into cubic equation.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P1-CALC-CUBIC-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P1',
    topic: 'calculus',
    cognitiveLevel,
    marks: 5,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `Differentiate to get the gradient function f'(x), set it equal to 0, factorise to find x = ${x1} and x = ${x2}. Then plug both back into f(x) to grab your (x ; y) pairs.`,
    nscMemo: {
      steps: [
        {
          stepLatex: `f'(x) = ${3 * a}x^2 ${2 * b >= 0 ? `+ ${2 * b}` : `- ${Math.abs(2 * b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0`,
          tickAllocation: '\\checkmark\\checkmark\\text{ (Differentiate and equate to 0)}',
        },
        {
          stepLatex: `x = ${x1} \\quad \\text{or} \\quad x = ${x2}`,
          tickAllocation: '\\checkmark\\text{ (Both x-coordinates)}',
        },
        {
          stepLatex: `${correctLatex}`,
          tickAllocation: '\\checkmark\\checkmark\\text{ (Both full coordinate pairs)}',
        },
      ],
      totalMarks: 5,
    },
    formulaRefId: 'UN-DC-01',
  };

  assertNoNaNOrUndefined(q, 'generateCubicTurningPoints');
  return q;
}

const PROB_WORDS = [
  { word: 'STUDIO', vowels: ['U', 'I', 'O'], consonants: ['S', 'T', 'D'] },
  { word: 'BEAUTY', vowels: ['E', 'A', 'U'], consonants: ['B', 'T', 'Y'] },
  { word: 'DOMAIN', vowels: ['O', 'A', 'I'], consonants: ['D', 'M', 'N'] },
  { word: 'FRIEND', vowels: ['I', 'E'], consonants: ['F', 'R', 'N', 'D'] },
  { word: 'VECTOR', vowels: ['E', 'O'], consonants: ['V', 'C', 'T', 'R'] },
  { word: 'PLANET', vowels: ['A', 'E'], consonants: ['P', 'L', 'N', 'T'] },
  { word: 'NUMBER', vowels: ['U', 'E'], consonants: ['N', 'M', 'B', 'R'] },
  { word: 'WINTER', vowels: ['I', 'E'], consonants: ['W', 'N', 'T', 'R'] },
  { word: 'RANDOM', vowels: ['A', 'O'], consonants: ['R', 'N', 'D', 'M'] },
  { word: 'DESIGN', vowels: ['E', 'I'], consonants: ['D', 'S', 'G', 'N'] },
] as const;

function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/**
 * Generates Grade 12 CAPS Probability and Counting Principle questions.
 * Alternates between letter arrangement restrictions and independent events calculation.
 */
export function generateProbabilityQuestion(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  const isCounting = Math.random() > 0.5;

  if (isCounting) {
    const item = randomChoice(PROB_WORDS);
    const word = item.word;
    const vowels = item.vowels;
    const n = word.length;
    const k = vowels.length;
    const entityCount = n - k + 1;
    const factEntities = factorial(entityCount);
    const factVowels = factorial(k);
    const totalArrangements = factEntities * factVowels;
    const vowelsStr = vowels.join(', ');

    const questionLatex = `\\text{How many different ${n}-letter arrangements can be formed from the letters of } \\text{${word}} \\text{ if the vowels (${vowelsStr}) must always be kept together?}`;
    const correctLatex = `${totalArrangements}`;
    const correctExp = `Correct! Treat the ${k} vowels as 1 single block. Total entities to arrange = ${n} - ${k} + 1 = ${entityCount}. Entities permute in ${entityCount}! = ${factEntities} ways. The vowels permute internally in ${k}! = ${factVowels} ways. Total = ${factEntities} \\times ${factVowels} = ${totalArrangements}.`;

    const candidates = [
      {
        latex: `${factorial(n)}`,
        explanation: `DIST-RESTRICT: Calculated unrestricted ${n}! without enforcing the vowel grouping restriction.`,
      },
      {
        latex: `${factEntities}`,
        explanation: `DIST-INNER: Permuted the ${entityCount} entities but forgot the internal permutations of the ${k} vowels (${k}!).`,
      },
      {
        latex: `${Math.round(factorial(n) / factorial(k))}`,
        explanation: `DIST-DIV: Divided by ${k}! as if the vowels were identical repeating letters instead of distinct.`,
      },
      {
        latex: `${factEntities * k}`,
        explanation: `Multiplied block permutations by ${k} instead of ${k}!.`,
      },
      {
        latex: `${totalArrangements + 48}`,
        explanation: 'Arithmetic error when multiplying factorials.',
      },
    ];

    const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

    const q: Question = {
      id: `GEN-P1-PRB-COUNT-${Date.now()}-${randomInt(100, 999)}`,
      paper: 'P1',
      topic: 'probability',
      cognitiveLevel,
      marks: 4,
      questionLatex,
      distractors,
      correctAnswerId,
      zanteVibeCheck: `Superglue the vowels together like besties! They count as 1 super-entity. Arrange the ${entityCount} blocks (${entityCount}! = ${factEntities}), then multiply by the vowels shuffling inside their group (${k}! = ${factVowels}). Clean ${totalArrangements} arrangements!`,
      nscMemo: {
        steps: [
          {
            stepLatex: `\\text{Treat vowels (${vowelsStr}) as 1 block} \\implies ${entityCount} \\text{ entities to arrange}`,
            tickAllocation: `\\checkmark\\text{ (Group concept: ${entityCount} entities)}`,
          },
          {
            stepLatex: `\\text{Arrangements of ${entityCount} entities} = ${entityCount}! = ${factEntities}`,
            tickAllocation: '\\checkmark\\text{ (Permuting entities)}',
          },
          {
            stepLatex: `\\text{Internal arrangements of ${k} vowels} = ${k}! = ${factVowels}`,
            tickAllocation: '\\checkmark\\text{ (Internal vowel permutations)}',
          },
          {
            stepLatex: `\\text{Total arrangements} = ${entityCount}! \\times ${k}! = ${factEntities} \\times ${factVowels} = ${totalArrangements}`,
            tickAllocation: '\\checkmark\\text{ (Final multiplication answer)}',
          },
        ],
        totalMarks: 4,
      },
      formulaRefId: 'UN-PR-01',
    };

    assertNoNaNOrUndefined(q, 'generateProbabilityQuestion:counting');
    return q;
  } else {
    const pAList = [0.3, 0.4, 0.5, 0.6];
    const pBList = [0.2, 0.3, 0.4, 0.5];
    const pA = randomChoice(pAList);
    const pB = randomChoice(pBList);
    const pInter = Math.round(pA * pB * 100) / 100;
    const pUnion = Math.round((pA + pB - pInter) * 100) / 100;

    const questionLatex = `\\text{Given two independent events } A \\text{ and } B \\text{ such that } P(A) = ${pA.toFixed(2)} \\text{ and } P(B) = ${pB.toFixed(2)}. \\text{ Calculate } P(A \\cup B).`;
    const correctLatex = `${pUnion.toFixed(2)}`;
    const correctExp = `Correct! For independent events, P(A ∩ B) = P(A)·P(B) = ${pA.toFixed(2)} × ${pB.toFixed(2)} = ${pInter.toFixed(2)}. By the addition rule, P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = ${pA.toFixed(2)} + ${pB.toFixed(2)} - ${pInter.toFixed(2)} = ${pUnion.toFixed(2)}.`;

    const candidates = [
      {
        latex: `${(pA + pB).toFixed(2)}`,
        explanation: 'DIST-MUTEX: Assumed mutually exclusive events and omitted subtraction of P(A ∩ B).',
      },
      {
        latex: `${pInter.toFixed(2)}`,
        explanation: 'DIST-INTER: Calculated the intersection P(A ∩ B) instead of the required union P(A ∪ B).',
      },
      {
        latex: `${Math.min(0.98, Math.round((pA + pB + pInter) * 100) / 100).toFixed(2)}`,
        explanation: 'DIST-SIGN: Added the intersection P(A ∩ B) instead of subtracting it in the addition rule.',
      },
      {
        latex: `${Math.round((1 - pInter) * 100) / 100}`,
        explanation: 'DIST-COMPL: Evaluated 1 - P(A ∩ B) instead of the addition rule.',
      },
    ];

    const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

    const q: Question = {
      id: `GEN-P1-PRB-INDEP-${Date.now()}-${randomInt(100, 999)}`,
      paper: 'P1',
      topic: 'probability',
      cognitiveLevel,
      marks: 4,
      questionLatex,
      distractors,
      correctAnswerId,
      zanteVibeCheck: `Independent means multiply for the overlap: P(A ∩ B) = ${pA.toFixed(2)} × ${pB.toFixed(2)} = ${pInter.toFixed(2)}. Then use the addition rule: add the individual probabilities and subtract that overlap so you don't double count!`,
      nscMemo: {
        steps: [
          {
            stepLatex: `P(A \\cap B) = P(A) \\times P(B) = ${pA.toFixed(2)} \\times ${pB.toFixed(2)} = ${pInter.toFixed(2)}`,
            tickAllocation: '\\checkmark\\checkmark\\text{ (Independent events intersection formula)}',
          },
          {
            stepLatex: `P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = ${pA.toFixed(2)} + ${pB.toFixed(2)} - ${pInter.toFixed(2)}`,
            tickAllocation: '\\checkmark\\text{ (Substitution into addition rule)}',
          },
          {
            stepLatex: `P(A \\cup B) = ${pUnion.toFixed(2)}`,
            tickAllocation: '\\checkmark\\text{ (Final answer)}',
          },
        ],
        totalMarks: 4,
      },
      formulaRefId: 'UN-PR-01',
    };

    assertNoNaNOrUndefined(q, 'generateProbabilityQuestion:independent');
    return q;
  }
}

/**
 * Master dispatcher for Paper 1 questions.
 */
export function generateP1Question(topic?: string, level: CognitiveLevel = 'L2'): Question {
  const chosenTopic =
    topic || randomChoice(['algebra', 'patterns', 'functions', 'finance', 'calculus', 'probability']);

  switch (chosenTopic) {
    case 'algebra':
      return Math.random() > 0.5 ? generateQuadraticEquation(level) : generateQuadraticInequality(level);
    case 'patterns':
      return Math.random() > 0.5 ? generateArithmeticSequence(level) : generateQuadraticSequence(level);
    case 'functions':
      return generateHyperbolaAsymptotes(level);
    case 'finance':
      return generateMortgageRepayment(level);
    case 'calculus':
      return generateCubicTurningPoints(level);
    case 'probability':
      return generateProbabilityQuestion(level);
    default:
      return generateQuadraticEquation(level);
  }
}
