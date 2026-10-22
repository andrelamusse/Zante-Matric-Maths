import type { Question, CognitiveLevel } from '../types/curriculum.ts';
import {
  randomInt,
  randomNonZeroInt,
  randomChoice,
  simplifyFraction,
  formatFractionLatex,
  buildDistractorSet,
  assertNoNaNOrUndefined,
} from './utils.ts';

/**
 * Generates least-squares regression questions with guaranteed clean linear statistics.
 */
export function generateRegressionLine(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  // Choose integer points with guaranteed positive slope
  const n = 5;
  const slope = randomChoice([1.5, 2.0, 2.5, 3.0]);
  const intercept = randomInt(1, 5);

  const xVals = [1, 2, 3, 4, 5];
  // Add small perturbations to generate realistic regression
  const noise = [-0.5, 0.4, -0.2, 0.3, 0.0];
  const yVals = xVals.map((x, idx) => Number((intercept + slope * x + noise[idx]).toFixed(1)));

  // Calculate actual least-squares parameters
  const meanX = 3.0; // (1+2+3+4+5)/5
  const sumY = yVals.reduce((acc, y) => acc + y, 0);
  const meanY = Number((sumY / n).toFixed(2));

  let ssXY = 0;
  let ssXX = 0;
  for (let i = 0; i < n; i++) {
    ssXY += (xVals[i] - meanX) * (yVals[i] - meanY);
    ssXX += (xVals[i] - meanX) * (xVals[i] - meanX);
  }

  const b = Number((ssXY / ssXX).toFixed(2));
  const a = Number((meanY - b * meanX).toFixed(2));

  const dataStr = xVals.map((x, i) => `(${x}; ${yVals[i]})`).join(', ');
  const questionLatex = `\\text{Given the bivariate data: } ${dataStr}. \\text{ Determine the least-squares regression line } \\hat{y} = a + bx.`;

  const correctLatex = `\\hat{y} = ${a} + ${b}x`;
  const correctExp = `Correct! Mean x = ${meanX}, mean y = ${meanY}. Regression slope b = ${b}, y-intercept a = ${a}.`;

  const candidates = [
    {
      latex: `\\hat{y} = ${b} + ${a}x`,
      explanation: 'DIST-STAT-REV: Swapped y-intercept a and slope b.',
    },
    {
      latex: `\\hat{y} = ${a} - ${b}x`,
      explanation: 'DIST-SIGN: Inverted the sign of the slope.',
    },
    {
      latex: `\\hat{y} = ${(a + 1).toFixed(2)} + ${(b - 0.5).toFixed(2)}x`,
      explanation: 'Approximation using end points instead of least squares formula.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P2-STA-REG-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P2',
    topic: 'statistics',
    cognitiveLevel,
    marks: 4,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `In CASIO STAT mode, A is intercept and B is slope. In NSC formula ŷ = a + bx, a = ${a} and b = ${b}. Don't swap them or you give away free marks!`,
    nscMemo: {
      steps: [
        {
          stepLatex: `\\bar{x} = ${meanX}, \\quad \\bar{y} = ${meanY}`,
          tickAllocation: '\\checkmark\\text{ (Mean values)}',
        },
        {
          stepLatex: `b = \\frac{\\sum(x - \\bar{x})(y - \\bar{y})}{\\sum(x - \\bar{x})^2} = ${b}`,
          tickAllocation: '\\checkmark\\text{ (Regression slope b)}',
        },
        {
          stepLatex: `a = \\bar{y} - b\\bar{x} = ${meanY} - (${b})(${meanX}) = ${a}`,
          tickAllocation: '\\checkmark\\text{ (y-intercept a)}',
        },
        {
          stepLatex: `${correctLatex}`,
          tickAllocation: '\\checkmark\\text{ (Equation of line to 2 dec places)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P2-ST-03',
  };

  assertNoNaNOrUndefined(q, 'generateRegressionLine');
  return q;
}

/**
 * Generates circle tangent line questions using Pythagorean triples.
 */
export function generateCircleTangent(cognitiveLevel: CognitiveLevel = 'L3'): Question {
  // Pythagorean base triples (dx, dy, r)
  const triple = randomChoice([
    { dx: 3, dy: 4, r: 5 },
    { dx: 4, dy: 3, r: 5 },
    { dx: 5, dy: 12, r: 13 },
    { dx: 12, dy: 5, r: 13 },
    { dx: 8, dy: 15, r: 17 },
  ]);

  const cx = randomInt(-3, 3);
  const cy = randomInt(-3, 3);
  const px = cx + triple.dx;
  const py = cy + triple.dy;

  // Invariant: radius slope m_rad = dy / dx
  const radFrac = simplifyFraction(triple.dy, triple.dx);
  // Tangent slope m_tan = -dx / dy (rad ⊥ tan)
  const tanFrac = simplifyFraction(-triple.dx, triple.dy);

  // Line equation: y - py = m_tan (x - px) => y = m_tan * x + (py - m_tan * px)
  // c_tan = py - (tanFrac.num * px) / tanFrac.den = (py * tanFrac.den - tanFrac.num * px) / tanFrac.den
  const cNum = py * tanFrac.den - tanFrac.num * px;
  const cFrac = simplifyFraction(cNum, tanFrac.den);

  const mTanLatex = formatFractionLatex(tanFrac.num, tanFrac.den);
  const cTanLatex = formatFractionLatex(cFrac.num, cFrac.den);
  const cSign = cFrac.num >= 0 ? `+ ${cTanLatex}` : cTanLatex;

  const questionLatex = `\\text{A circle with centre } C(${cx}; ${cy}) \\text{ has a point } P(${px}; ${py}) \\text{ on its circumference. Determine the equation of the tangent line to the circle at } P.`;
  const correctLatex = `y = ${mTanLatex}x ${cSign}`;
  const correctExp = `Correct! Radius gradient m_CP = ${formatFractionLatex(radFrac.num, radFrac.den)}. Tangent gradient m_tan = ${mTanLatex} (tan ⊥ rad).`;

  const mRadLatex = formatFractionLatex(radFrac.num, radFrac.den);
  const candidates = [
    {
      latex: `y = ${mRadLatex}x - ${cTanLatex}`,
      explanation: 'DIST-RECP: Used the radius gradient directly instead of the negative reciprocal for tangent.',
    },
    {
      latex: `y = -${mRadLatex}x + ${cTanLatex}`,
      explanation: 'Negated the radius gradient without taking its reciprocal.',
    },
    {
      latex: `y = ${formatFractionLatex(triple.dx, triple.dy)}x + ${cTanLatex}`,
      explanation: 'Inverted the gradient fraction without applying the negative sign.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P2-ANG-TAN-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P2',
    topic: 'analytical_geometry',
    cognitiveLevel,
    marks: 5,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `First find radius slope m_rad = Δy/Δx. Tangent meets radius at 90°, so flip the fraction and swap the sign (m₁ · m₂ = -1). Put [tan ⊥ rad] as your reason!`,
    nscMemo: {
      steps: [
        {
          stepLatex: `m_{\\text{radius}} = \\frac{${py} - (${cy})}{${px} - (${cx})} = ${formatFractionLatex(radFrac.num, radFrac.den)}`,
          tickAllocation: '\\checkmark\\text{ (Radius gradient)}',
        },
        {
          stepLatex: `m_{\\text{tangent}} = ${mTanLatex} \\quad [\\text{tan } \\perp \\text{ radius}]`,
          tickAllocation: '\\checkmark\\checkmark\\text{ (Perpendicular gradient and reason)}',
        },
        {
          stepLatex: `y - (${py}) = ${mTanLatex}(x - (${px}))`,
          tickAllocation: '\\checkmark\\text{ (Substitution into line equation)}',
        },
        {
          stepLatex: `${correctLatex}`,
          tickAllocation: '\\checkmark\\text{ (Final equation)}',
        },
      ],
      totalMarks: 5,
    },
    formulaRefId: 'UN-AG-01',
  };

  assertNoNaNOrUndefined(q, 'generateCircleTangent');
  return q;
}

/**
 * Generates inclination angle questions.
 */
export function generateInclinationAngle(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  // Choose clean inclination angle: 45° (m=1), 135° (m=-1), or arctan(2) / arctan(0.5)
  const isSpecial = Math.random() > 0.4;
  let m = 1;
  let angle = 45;

  if (isSpecial) {
    if (Math.random() > 0.5) {
      m = -1;
      angle = 135;
    } else {
      m = 1;
      angle = 45;
    }
  } else {
    m = randomChoice([2, 3, -2, -3]);
    angle = m > 0 ? Number((Math.atan(m) * (180 / Math.PI)).toFixed(2)) : Number((180 + Math.atan(m) * (180 / Math.PI)).toFixed(2));
  }

  const x1 = randomInt(-3, 3);
  const y1 = randomInt(-3, 3);
  const dx = randomChoice([1, 2]);
  const x2 = x1 + dx;
  const y2 = y1 + m * dx;

  const questionLatex = `\\text{Find the gradient and angle of inclination } \\theta \\text{ of the line passing through } A(${x1}; ${y1}) \\text{ and } B(${x2}; ${y2}).`;
  const correctLatex = `m = ${m} \\quad \\text{and} \\quad \\theta = ${angle}^\\circ`;
  const correctExp = `Correct! m = (${y2} - ${y1}) / (${x2} - ${x1}) = ${m}. Since tan θ = m, θ = ${angle}°.`;

  const candidates = [
    {
      latex: `m = ${-m} \\quad \\text{and} \\quad \\theta = ${(180 - angle).toFixed(2)}^\\circ`,
      explanation: 'DIST-SIGN: Subtracted coordinates in inverted order.',
    },
    {
      latex: `m = ${m} \\quad \\text{and} \\quad \\theta = ${(180 - angle).toFixed(2)}^\\circ`,
      explanation: 'Subtracted from 180° when gradient was positive, or vice versa.',
    },
    {
      latex: `m = ${m * 2} \\quad \\text{and} \\quad \\theta = ${Math.min(85, angle + 15)}^\\circ`,
      explanation: 'Arithmetic error in gradient division.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P2-ANG-INC-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P2',
    topic: 'analytical_geometry',
    cognitiveLevel,
    marks: 4,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `tan θ = m. If gradient m is positive, θ is an acute angle (< 90°). If gradient m is negative, θ is obtuse: 180° - ref angle. Never write a negative inclination angle!`,
    nscMemo: {
      steps: [
        {
          stepLatex: `m = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = ${m}`,
          tickAllocation: '\\checkmark\\checkmark\\text{ (Gradient calculation)}',
        },
        {
          stepLatex: `\\tan \\theta = ${m}`,
          tickAllocation: '\\checkmark\\text{ (Inclination relation)}',
        },
        {
          stepLatex: `\\theta = ${angle}^\\circ`,
          tickAllocation: '\\checkmark\\text{ (Inclination angle)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P2-AG-06',
  };

  assertNoNaNOrUndefined(q, 'generateInclinationAngle');
  return q;
}

/**
 * Generates trigonometric general solution questions.
 */
export function generateTrigGeneralSolution(cognitiveLevel: CognitiveLevel = 'L3'): Question {
  // Equation: 2 sin x cos x = sin x => sin x (2 cos x - 1) = 0
  const questionLatex = '\\text{Determine the general solution of: } 2\\sin x \\cos x = \\sin x.';
  const correctLatex =
    'x = k \\cdot 180^\\circ \\;\\text{or}\\; x = \\pm 60^\\circ + k \\cdot 360^\\circ, \\; k \\in \\mathbb{Z}';
  const correctExp =
    'Correct! Factoring sin x(2cos x - 1) = 0 gives sin x = 0 (x = k·180°) or cos x = 1/2 (x = ±60° + k·360°).';

  const candidates = [
    {
      latex: 'x = \\pm 60^\\circ + k \\cdot 360^\\circ, \\; k \\in \\mathbb{Z}',
      explanation: 'Divided both sides by sin x, discarding the entire branch of solutions for sin x = 0.',
    },
    {
      latex: 'x = k \\cdot 360^\\circ \\;\\text{or}\\; x = \\pm 30^\\circ + k \\cdot 360^\\circ, \\; k \\in \\mathbb{Z}',
      explanation: 'Used cos x = √3/2 instead of cos x = 1/2.',
    },
    {
      latex: 'x = 60^\\circ + k \\cdot 180^\\circ, \\; k \\in \\mathbb{Z}',
      explanation: 'Applied tangent period 180° to cosine solutions.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P2-TRG-GEN-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P2',
    topic: 'trigonometry',
    cognitiveLevel,
    marks: 5,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `WARNING: Dividing by sin x is mathematical crime scene behavior. Factorise! sin x(2cos x - 1) = 0 gives two branches: sin x = 0 and cos x = 1/2. Remember k ∈ ℤ.`,
    nscMemo: {
      steps: [
        {
          stepLatex: '2\\sin x \\cos x - \\sin x = 0',
          tickAllocation: '\\checkmark\\text{ (Standard form equated to 0)}',
        },
        {
          stepLatex: '\\sin x(2\\cos x - 1) = 0',
          tickAllocation: '\\checkmark\\text{ (Factorising common factor)}',
        },
        {
          stepLatex: '\\sin x = 0 \\implies x = 0^\\circ + k \\cdot 180^\\circ, \\; k \\in \\mathbb{Z}',
          tickAllocation: '\\checkmark\\text{ (General solution for sine)}',
        },
        {
          stepLatex: '\\cos x = \\frac{1}{2} \\implies x = \\pm 60^\\circ + k \\cdot 360^\\circ, \\; k \\in \\mathbb{Z}',
          tickAllocation: '\\checkmark\\checkmark\\text{ (General solution for cosine and } k \\in \\mathbb{Z})',
        },
      ],
      totalMarks: 5,
    },
    formulaRefId: 'P2-TR-11',
  };

  assertNoNaNOrUndefined(q, 'generateTrigGeneralSolution');
  return q;
}

/**
 * Generates Euclidean geometry cyclic quadrilateral questions.
 */
export function generateCyclicQuadQuestion(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  const angleA = randomInt(68, 86);
  const angleC = 180 - angleA;

  const questionLatex = `\\text{In the diagram, } ABCD \\text{ is a cyclic quadrilateral with } \\hat{A} = ${angleA}^\\circ. \\text{ Determine the size of opposite angle } \\hat{C} \\text{ with the official DBE reason.}`;
  const correctLatex = `\\hat{C} = ${angleC}^\\circ \\quad [\\text{opp } \\angle\\text{s of cyclic quad}]`;
  const correctExp = `Correct! Opposite angles of a cyclic quad are supplementary: 180° - ${angleA}° = ${angleC}°.`;

  const candidates = [
    {
      latex: `\\hat{C} = ${angleA}^\\circ \\quad [\\angle\\text{s in same seg}]`,
      explanation: 'Assumed opposite angles are equal rather than supplementary.',
    },
    {
      latex: `\\hat{C} = ${angleC}^\\circ \\quad [\\text{cyclic quad}]`,
      explanation: 'Incomplete reason: DBE guidelines require "opp ∠s of cyclic quad".',
    },
    {
      latex: `\\hat{C} = ${90 - Math.floor(angleA / 2)}^\\circ \\quad [\\text{co-interior } \\angle\\text{s}]`,
      explanation: 'Assumed complementary or invalid parallel line reasoning.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P2-EUC-QUAD-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P2',
    topic: 'euclidean_geometry',
    cognitiveLevel,
    marks: 4,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `Opposite angles of a cyclic quad add up to 180°. 180° - ${angleA}° = ${angleC}°. Reason must be verbatim: [opp ∠s of cyclic quad]. No shortcuts!`,
    nscMemo: {
      steps: [
        {
          stepLatex: `\\hat{A} + \\hat{C} = 180^\\circ`,
          tickAllocation: '\\checkmark\\text{ (Statement: opposite angles supplementary)}',
        },
        {
          stepLatex: '[\\text{opp } \\angle\\text{s of cyclic quad}]',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Official DBE Reason)}',
        },
        {
          stepLatex: `\\hat{C} = 180^\\circ - ${angleA}^\\circ = ${angleC}^\\circ`,
          tickAllocation: '\\checkmark\\text{ (Answer)}',
        },
      ],
      totalMarks: 4,
    },
  };

  assertNoNaNOrUndefined(q, 'generateCyclicQuadQuestion');
  return q;
}

/**
 * Generates Euclidean geometry tangent-chord theorem questions.
 */
export function generateTanChordQuestion(cognitiveLevel: CognitiveLevel = 'L2'): Question {
  const theta = randomInt(42, 68);

  const questionLatex = `\\text{Line } PT \\text{ is tangent to the circle at } T. \\text{ Chord } TR \\text{ subtends } \\hat{S} = ${theta}^\\circ \\text{ at the alternate circumference. Find } P\\hat{T}R \\text{ with reason.}`;
  const correctLatex = `P\\hat{T}R = ${theta}^\\circ \\quad [\\text{tan-chord thm}]`;
  const correctExp = `Correct! By the tangent-chord theorem, the angle between tangent PT and chord TR equals the angle in the alternate segment (${theta}°).`;

  const candidates = [
    {
      latex: `P\\hat{T}R = ${180 - theta}^\\circ \\quad [\\text{adj } \\angle\\text{s on str line}]`,
      explanation: 'Subtracted from 180° erroneously.',
    },
    {
      latex: `P\\hat{T}R = 90^\\circ \\quad [\\text{tan } \\perp \\text{ radius}]`,
      explanation: 'Confused general chord with radius or diameter.',
    },
    {
      latex: `P\\hat{T}R = ${90 - theta}^\\circ \\quad [\\text{angles of } \\triangle]`,
      explanation: 'Subtracted from 90° without justification.',
    },
  ];

  const { distractors, correctAnswerId } = buildDistractorSet(correctLatex, correctExp, candidates);

  const q: Question = {
    id: `GEN-P2-EUC-TAN-${Date.now()}-${randomInt(100, 999)}`,
    paper: 'P2',
    topic: 'euclidean_geometry',
    cognitiveLevel,
    marks: 4,
    questionLatex,
    distractors,
    correctAnswerId,
    zanteVibeCheck: `Tan-Chord Theorem is your best friend: the angle between tangent and chord equals the angle inside the triangle on the other side. ${theta}° = ${theta}°. Reason: [tan-chord thm].`,
    nscMemo: {
      steps: [
        {
          stepLatex: 'P\\hat{T}R = \\hat{S}',
          tickAllocation: '\\checkmark\\text{ (Statement: equality of angles)}',
        },
        {
          stepLatex: '[\\text{tan-chord thm}]',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Official DBE Reason)}',
        },
        {
          stepLatex: `P\\hat{T}R = ${theta}^\\circ`,
          tickAllocation: '\\checkmark\\text{ (Answer)}',
        },
      ],
      totalMarks: 4,
    },
  };

  assertNoNaNOrUndefined(q, 'generateTanChordQuestion');
  return q;
}

/**
 * Master dispatcher for Paper 2 questions.
 */
export function generateP2Question(topic?: string, level: CognitiveLevel = 'L2'): Question {
  const chosenTopic =
    topic || randomChoice(['statistics', 'analytical_geometry', 'trigonometry', 'euclidean_geometry']);

  switch (chosenTopic) {
    case 'statistics':
      return generateRegressionLine(level);
    case 'analytical_geometry':
      return Math.random() > 0.5 ? generateCircleTangent(level) : generateInclinationAngle(level);
    case 'trigonometry':
      return generateTrigGeneralSolution(level);
    case 'euclidean_geometry':
      return Math.random() > 0.5 ? generateCyclicQuadQuestion(level) : generateTanChordQuestion(level);
    default:
      return generateCircleTangent(level);
  }
}
