import type { Question } from '../types/curriculum.ts';

export const PAST_PAPER_QUESTIONS: Question[] = [
  // ==========================================
  // TOPIC 1: ALGEBRA, EQUATIONS & INEQUALITIES (P1)
  // ==========================================
  {
    id: 'PP-ALG-01',
    paper: 'P1',
    topic: 'algebra',
    cognitiveLevel: 'L1',
    marks: 3,
    questionLatex:
      '\\text{Solve for } x \\text{ where } (x - 5)(x + 2) = 0.',
    distractors: [
      {
        id: 'opt-a',
        latex: 'x = 5 \\text{ or } x = -2',
        explanation: 'Correct! Zero product property gives x - 5 = 0 or x + 2 = 0.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'x = -5 \\text{ or } x = 2',
        explanation: 'DIST-SIGN: Inverted signs when setting factors equal to zero.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'x = 5 \\text{ only}',
        explanation: 'DIST-QUAD: Dropped the negative root x = -2.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'x = 10 \\text{ or } x = -1',
        explanation: 'Arithmetic error in expanding factors instead of applying zero-product property.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'If two things multiply to zero, one of them has to be zero. Literally just flip the signs inside the brackets and go get your iced matcha.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'x - 5 = 0 \\quad \\text{or} \\quad x + 2 = 0',
          tickAllocation: '\\checkmark\\text{ (Zero product rule)}',
        },
        {
          stepLatex: 'x = 5',
          tickAllocation: '\\checkmark\\text{ (Answer 1)}',
        },
        {
          stepLatex: 'x = -2',
          tickAllocation: '\\checkmark\\text{ (Answer 2)}',
        },
      ],
      totalMarks: 3,
    },
    formulaRefId: 'P1-AL-01',
  },
  {
    id: 'PP-ALG-02',
    paper: 'P1',
    topic: 'algebra',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{Solve for } x \\text{ using the quadratic formula: } 2x^2 - 5x - 3 = 0.',
    distractors: [
      {
        id: 'opt-a',
        latex: 'x = 3 \\text{ or } x = -\\frac{1}{2}',
        explanation: 'Correct! Roots are x = (5 ± √49) / 4 = (5 ± 7) / 4.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'x = -3 \\text{ or } x = \\frac{1}{2}',
        explanation: 'DIST-SIGN: Substituted -b as -5 instead of -(-5) = +5.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'x = 3 \\text{ or } x = 2',
        explanation: 'Arithmetic error dividing by 2 instead of 2a = 4 in denominator.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'x = \\frac{5 \\pm \\sqrt{19}}{4}',
        explanation: 'Miscalculated discriminant b² - 4ac as 25 - 24 instead of 25 - 4(2)(-3) = 49.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Discriminant Δ = (-5)² - 4(2)(-3) = 25 + 24 = 49. √49 is a clean 7. If your square root is not clean here, check your minus signs immediately.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'x = \\frac{-(-5) \\pm \\sqrt{(-5)^2 - 4(2)(-3)}}{2(2)}',
          tickAllocation: '\\checkmark\\text{ (Correct substitution into formula)}',
        },
        {
          stepLatex: 'x = \\frac{5 \\pm 7}{4}',
          tickAllocation: '\\checkmark\\text{ (Simplification of discriminant)}',
        },
        {
          stepLatex: 'x = 3',
          tickAllocation: '\\checkmark\\text{ (Root 1)}',
        },
        {
          stepLatex: 'x = -\\frac{1}{2}',
          tickAllocation: '\\checkmark\\text{ (Root 2)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P1-AL-01',
  },
  {
    id: 'PP-ALG-03',
    paper: 'P1',
    topic: 'algebra',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{Solve for } x: \\; x^2 - 2x - 15 \\le 0.',
    distractors: [
      {
        id: 'opt-a',
        latex: '-3 \\le x \\le 5',
        explanation: 'Correct! Parabola is concave up and below/on x-axis between critical values -3 and 5.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'x \\le -3 \\text{ or } x \\ge 5',
        explanation: 'DIST-QUAD: Chose outer intervals instead of inner interval for ≤ 0.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '-5 \\le x \\le 3',
        explanation: 'DIST-SIGN: Inverted critical values by factoring as (x+5)(x-3).',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'x < -3 \\text{ or } x > 5',
        explanation: 'Omitted the equality endpoints for ≤ relation.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Parabola smiles (a > 0). Less than zero means underwater (between the roots). Trap alert: do not write x <= -3 and x <= 5 like a rookie.',
    nscMemo: {
      steps: [
        {
          stepLatex: '(x - 5)(x + 3) \\le 0',
          tickAllocation: '\\checkmark\\text{ (Factorisation)}',
        },
        {
          stepLatex: '\\text{Critical values: } x = -3 \\;\\text{or}\\; x = 5',
          tickAllocation: '\\checkmark\\text{ (Critical values)}',
        },
        {
          stepLatex: '-3 \\le x \\le 5',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Correct notation and both endpoints)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P1-AL-01',
  },
  {
    id: 'PP-ALG-04',
    paper: 'P1',
    topic: 'algebra',
    cognitiveLevel: 'L3',
    marks: 5,
    questionLatex:
      '\\text{Solve for } x: \\; \\sqrt{x + 2} = x - 4.',
    distractors: [
      {
        id: 'opt-a',
        latex: 'x = 7 \\quad (x = 2 \\text{ rejected})',
        explanation: 'Correct! x = 2 makes RHS = -2, but LHS = √4 = 2, so x = 2 is extraneous.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'x = 7 \\text{ or } x = 2',
        explanation: 'DIST-SURD: Forgot to check roots back in original equation and kept extraneous x = 2.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'x = 2 \\quad (x = 7 \\text{ rejected})',
        explanation: 'Inverted the validation test and rejected the genuine root.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'x = 14',
        explanation: 'Squared RHS incorrectly as x² - 16 instead of (x - 4)² = x² - 8x + 16.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Squaring both sides is like trusting an unverified rumor: you introduce fake roots! Test x = 2: √4 = -2 is impossible. Dump x = 2 immediately.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'x + 2 = (x - 4)^2 = x^2 - 8x + 16',
          tickAllocation: '\\checkmark\\text{ (Squaring both sides correctly)}',
        },
        {
          stepLatex: 'x^2 - 9x + 14 = 0',
          tickAllocation: '\\checkmark\\text{ (Standard quadratic form)}',
        },
        {
          stepLatex: '(x - 7)(x - 2) = 0 \\implies x = 7 \\;\\text{or}\\; x = 2',
          tickAllocation: '\\checkmark\\text{ (Factorisation and solving)}',
        },
        {
          stepLatex: '\\text{Check: } x = 2 \\implies \\sqrt{4} \\ne -2 \\implies \\text{reject } x = 2',
          tickAllocation: '\\checkmark\\text{ (Checking and rejecting extraneous root)}',
        },
        {
          stepLatex: 'x = 7',
          tickAllocation: '\\checkmark\\text{ (Final valid answer)}',
        },
      ],
      totalMarks: 5,
    },
    formulaRefId: 'P1-AL-01',
  },
  {
    id: 'PP-ALG-05',
    paper: 'P1',
    topic: 'algebra',
    cognitiveLevel: 'L4',
    marks: 4,
    questionLatex:
      '\\text{Determine the values of } k \\text{ for which } x^2 + kx + 9 = 0 \\text{ has non-real roots.}',
    distractors: [
      {
        id: 'opt-a',
        latex: '-6 < k < 6',
        explanation: 'Correct! Non-real roots require Δ < 0: k² - 36 < 0 ⟹ -6 < k < 6.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'k < -6 \\text{ or } k > 6',
        explanation: 'DIST-QUAD: Used condition for real unequal roots (Δ > 0) instead of non-real roots (Δ < 0).',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '-6 \\le k \\le 6',
        explanation: 'Included equality which gives equal real roots (Δ = 0).',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'k < 6',
        explanation: 'Missed lower bound from the quadratic inequality k² < 36.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Non-real roots mean the discriminant Δ is negative. That puts k² - 36 < 0. Think: between -6 and +6. Strict inequality, no equal signs allowed.',
    nscMemo: {
      steps: [
        {
          stepLatex: '\\Delta = b^2 - 4ac = k^2 - 4(1)(9) = k^2 - 36',
          tickAllocation: '\\checkmark\\text{ (Expression for } \\Delta)',
        },
        {
          stepLatex: '\\Delta < 0 \\implies k^2 - 36 < 0',
          tickAllocation: '\\checkmark\\text{ (Condition for non-real roots)}',
        },
        {
          stepLatex: '(k - 6)(k + 6) < 0',
          tickAllocation: '\\checkmark\\text{ (Factorisation)}',
        },
        {
          stepLatex: '-6 < k < 6',
          tickAllocation: '\\checkmark\\text{ (Final interval)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P1-AL-01',
  },

  // ==========================================
  // TOPIC 2: NUMBER PATTERNS, SEQUENCES & SERIES (P1)
  // ==========================================
  {
    id: 'PP-SEQ-01',
    paper: 'P1',
    topic: 'patterns',
    cognitiveLevel: 'L1',
    marks: 3,
    questionLatex:
      '\\text{Given the arithmetic sequence: } 3 ; 7 ; 11 ; 15 ; \\dots \\text{ Determine the } 20^{\\text{th}} \\text{ term } (T_{20}).',
    distractors: [
      {
        id: 'opt-a',
        latex: 'T_{20} = 79',
        explanation: 'Correct! T₂₀ = a + (20 - 1)d = 3 + 19(4) = 3 + 76 = 79.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'T_{20} = 83',
        explanation: 'Used n = 20 without subtracting 1: 3 + 20(4) = 83.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'T_{20} = 80',
        explanation: 'Computed 4n without adjusting for first term offset.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'T_{20} = 63',
        explanation: 'Substituted incorrect difference d = 3 instead of d = 4.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'First term is 3, jumping by +4 each time. T₂₀ means 19 jumps of 4 added to 3. 3 + 76 = 79. Easy marks in the bag.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'a = 3, \\quad d = 7 - 3 = 4',
          tickAllocation: '\\checkmark\\text{ (Identify a and d)}',
        },
        {
          stepLatex: 'T_{20} = 3 + (20 - 1)(4)',
          tickAllocation: '\\checkmark\\text{ (Substitution into } T_n \\text{ formula)}',
        },
        {
          stepLatex: 'T_{20} = 79',
          tickAllocation: '\\checkmark\\text{ (Accuracy)}',
        },
      ],
      totalMarks: 3,
    },
    formulaRefId: 'P1-SQ-01',
  },
  {
    id: 'PP-SEQ-02',
    paper: 'P1',
    topic: 'patterns',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{Consider the quadratic sequence: } 4 ; 9 ; 18 ; 31 ; \\dots \\text{ Determine the general term } T_n.',
    distractors: [
      {
        id: 'opt-a',
        latex: 'T_n = 2n^2 - n + 3',
        explanation: 'Correct! 2a = 4 ⟹ a = 2; 3(2) + b = 5 ⟹ b = -1; 2 - 1 + c = 4 ⟹ c = 3.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'T_n = 4n^2 + n - 1',
        explanation: 'Took 2nd difference directly as a instead of 2a = 4 ⟹ a = 2.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'T_n = 2n^2 + n + 1',
        explanation: 'Sign error calculating b: 6 + b = 5 ⟹ b = -1, but wrote +1.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'T_n = n^2 + 4n - 1',
        explanation: 'Guessed quadratic formula without equating second differences.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'First differences: 5, 9, 13. Second difference: 4. Since 2a = 4, a = 2. Then 3(2) + b = 5 gives b = -1. Clean, classic textbook pattern.',
    nscMemo: {
      steps: [
        {
          stepLatex: '2a = 4 \\implies a = 2',
          tickAllocation: '\\checkmark\\text{ (Value of a)}',
        },
        {
          stepLatex: '3a + b = 5 \\implies 3(2) + b = 5 \\implies b = -1',
          tickAllocation: '\\checkmark\\text{ (Value of b)}',
        },
        {
          stepLatex: 'a + b + c = 4 \\implies 2 - 1 + c = 4 \\implies c = 3',
          tickAllocation: '\\checkmark\\text{ (Value of c)}',
        },
        {
          stepLatex: 'T_n = 2n^2 - n + 3',
          tickAllocation: '\\checkmark\\text{ (Final equation)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'UN-SQ-01',
  },
  {
    id: 'PP-SEQ-03',
    paper: 'P1',
    topic: 'patterns',
    cognitiveLevel: 'L3',
    marks: 4,
    questionLatex:
      '\\text{Evaluate: } \\sum_{k=1}^{8} 3 \\cdot 2^{k-1}.',
    distractors: [
      {
        id: 'opt-a',
        latex: '765',
        explanation: 'Correct! Geometric series with a = 3, r = 2, n = 8: S₈ = 3(2⁸ - 1) / (2 - 1) = 3(255) = 765.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '1533',
        explanation: 'Calculated for n = 9 terms instead of 8 - 1 + 1 = 8 terms.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '384',
        explanation: 'Computed the 8th term T₈ = 3(128) = 384 instead of the sum S₈.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '768',
        explanation: 'Forgot to subtract 1 in the numerator (rⁿ - 1).',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Sigma notation is just a fancy Greek capital E for "add them all up". a = 3, doubling each step (r = 2). Use your geometric sum formula and secure the bag.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'a = 3, \\quad r = 2, \\quad n = 8 - 1 + 1 = 8',
          tickAllocation: '\\checkmark\\text{ (Identify a, r, and n)}',
        },
        {
          stepLatex: 'S_8 = \\frac{3(2^8 - 1)}{2 - 1}',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Substitution into } S_n \\text{ formula)}',
        },
        {
          stepLatex: 'S_8 = 3(255) = 765',
          tickAllocation: '\\checkmark\\text{ (Answer)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P1-SQ-04',
  },

  // ==========================================
  // TOPIC 3: FUNCTIONS, INVERSES & GRAPHS (P1)
  // ==========================================
  {
    id: 'PP-FUN-01',
    paper: 'P1',
    topic: 'functions',
    cognitiveLevel: 'L1',
    marks: 2,
    questionLatex:
      '\\text{Write down the equations of the asymptotes of } g(x) = \\frac{4}{x - 3} + 2.',
    distractors: [
      {
        id: 'opt-a',
        latex: 'x = 3 \\quad \\text{and} \\quad y = 2',
        explanation: 'Correct! Vertical asymptote is denominator zero x = 3, horizontal asymptote is constant shift y = 2.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'x = -3 \\quad \\text{and} \\quad y = 2',
        explanation: 'DIST-SIGN: Inverted sign for vertical asymptote.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'x = 3 \\quad \\text{and} \\quad y = -2',
        explanation: 'DIST-SIGN: Inverted sign for horizontal asymptote.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'y = 3 \\quad \\text{and} \\quad x = 2',
        explanation: 'Swapped x and y asymptotes.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Denominator cannot be zero, so x = 3 is forbidden territory (vertical barrier). The +2 at the end is your ceiling (horizontal barrier).',
    nscMemo: {
      steps: [
        {
          stepLatex: 'x = 3',
          tickAllocation: '\\checkmark\\text{ (Vertical asymptote)}',
        },
        {
          stepLatex: 'y = 2',
          tickAllocation: '\\checkmark\\text{ (Horizontal asymptote)}',
        },
      ],
      totalMarks: 2,
    },
    formulaRefId: 'UN-FN-01',
  },
  {
    id: 'PP-FUN-02',
    paper: 'P1',
    topic: 'functions',
    cognitiveLevel: 'L2',
    marks: 3,
    questionLatex:
      '\\text{Given } f(x) = 3x - 6, \\text{ determine the equation of } f^{-1}(x).',
    distractors: [
      {
        id: 'opt-a',
        latex: 'f^{-1}(x) = \\frac{1}{3}x + 2',
        explanation: 'Correct! Swapping x and y gives x = 3y - 6 ⟹ 3y = x + 6 ⟹ y = 1/3 x + 2.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'f^{-1}(x) = \\frac{1}{3x - 6}',
        explanation: 'Confused inverse function f⁻¹(x) with reciprocal 1/f(x).',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'f^{-1}(x) = 3x + 6',
        explanation: 'Only inverted sign of intercept without reflecting gradient.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'f^{-1}(x) = \\frac{1}{3}x - 2',
        explanation: 'Divided -6 by 3 with wrong sign: x - 6 instead of x + 6.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Swap x and y like you are switching seats in class, then solve for y. Never mistake inverse f⁻¹(x) for reciprocal 1/f(x). That is an instant facepalm.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'x = 3y - 6',
          tickAllocation: '\\checkmark\\text{ (Swap x and y)}',
        },
        {
          stepLatex: '3y = x + 6',
          tickAllocation: '\\checkmark\\text{ (Make y the subject)}',
        },
        {
          stepLatex: 'f^{-1}(x) = \\frac{1}{3}x + 2',
          tickAllocation: '\\checkmark\\text{ (Answer in correct notation)}',
        },
      ],
      totalMarks: 3,
    },
    formulaRefId: 'UN-FN-01',
  },
  {
    id: 'PP-FUN-03',
    paper: 'P1',
    topic: 'functions',
    cognitiveLevel: 'L3',
    marks: 4,
    questionLatex:
      '\\text{Given } f(x) = -2(x - 1)^2 + 8. \\text{ Write down the domain restriction on } f \\text{ so that } f^{-1} \\text{ is a function, and state the range of } f.',
    distractors: [
      {
        id: 'opt-a',
        latex: '\\text{Domain: } x \\ge 1 \\;(\\text{or } x \\le 1), \\quad \\text{Range: } y \\le 8',
        explanation: 'Correct! Parabola turning point is at x = 1, y = 8. Domain restricted to one side of turning point makes inverse one-to-one.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '\\text{Domain: } x \\ge 0, \\quad \\text{Range: } y \\ge 8',
        explanation: 'Assumed turning point was at x = 0 and flipped inequality on range.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '\\text{Domain: } x \\in \\mathbb{R}, \\quad \\text{Range: } y \\le 8',
        explanation: 'Full domain x ∈ ℝ causes inverse to fail vertical line test (not a function).',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '\\text{Domain: } x \\ge -1, \\quad \\text{Range: } y \\ge -8',
        explanation: 'DIST-SIGN: Inverted turning point coordinates.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'A full parabola has two branches, which fails the horizontal line test. Cut it in half at its turning point (x = 1). Keep only x >= 1 or x <= 1.',
    nscMemo: {
      steps: [
        {
          stepLatex: '\\text{Turning point: } (1 ; 8)',
          tickAllocation: '\\checkmark\\text{ (Identify turning point)}',
        },
        {
          stepLatex: 'x \\ge 1 \\quad (\\text{or } x \\le 1)',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Domain restriction relative to x-coordinate)}',
        },
        {
          stepLatex: 'y \\le 8',
          tickAllocation: '\\checkmark\\text{ (Range of f)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'UN-FN-01',
  },

  // ==========================================
  // TOPIC 4: FINANCE, GROWTH & DECAY (P1)
  // ==========================================
  {
    id: 'PP-FIN-01',
    paper: 'P1',
    topic: 'finance',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{A business purchases equipment for } \\text{R}\\,450\\,000. \\text{ Calculate the book value after } 5 \\text{ years if it depreciates at } 15\\% \\text{ p.a. on a reducing-balance basis.}',
    distractors: [
      {
        id: 'opt-a',
        latex: '\\text{R}\\,199\\,667.48',
        explanation: 'Correct! A = 450,000(1 - 0.15)⁵ = 450,000(0.85)⁵ = R 199,667.48.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '\\text{R}\\,112\\,500.00',
        explanation: 'Used straight-line depreciation A = P(1 - ni) = 450,000(1 - 5 × 0.15).',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '\\text{R}\\,905\\,114.77',
        explanation: 'Used compound growth (1 + i)⁵ instead of depreciation (1 - i)⁵.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '\\text{R}\\,234\\,890.12',
        explanation: 'Rounded intermediate powers prematurely.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Reducing-balance means minus inside the brackets with power outside: A = P(1 - i)ⁿ. Every year it retains 85% of its value. Do not use straight-line here!',
    nscMemo: {
      steps: [
        {
          stepLatex: 'A = P(1 - i)^n',
          tickAllocation: '\\checkmark\\text{ (Correct formula selection)}',
        },
        {
          stepLatex: 'A = 450\\,000(1 - 0.15)^5',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Correct substitutions)}',
        },
        {
          stepLatex: 'A = \\text{R}\\,199\\,667.48',
          tickAllocation: '\\checkmark\\text{ (Accurate round-off to 2 dec places)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P1-FN-04',
  },
  {
    id: 'PP-FIN-02',
    paper: 'P1',
    topic: 'finance',
    cognitiveLevel: 'L3',
    marks: 4,
    questionLatex:
      '\\text{Zante secures a bond of } \\text{R}\\,1\\,200\\,000 \\text{ at } 11.5\\% \\text{ p.a. compounded monthly over } 20 \\text{ years. Calculate her monthly repayment } x.',
    distractors: [
      {
        id: 'opt-a',
        latex: 'x = \\text{R}\\,12\\,798.11',
        explanation: 'Correct! P = 1,200,000; i = 0.115/12; n = 240. x = (P·i) / (1 - (1+i)⁻²⁴⁰) = R 12,798.11.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'x = \\text{R}\\,11\\,500.00',
        explanation: 'Calculated interest-only payment without principal amortisation.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'x = \\text{R}\\,14\\,230.45',
        explanation: 'DIST-COMP: Used n = 20 years instead of n = 240 months in formula.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'x = \\text{R}\\,13\\,920.00',
        explanation: 'Used simple interest growth divided by 240.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Mortgage = Present Value Annuity P. Remember: monthly means divide the interest rate by 12, and multiply 20 years by 12 to get 240 payments. Watch that minus exponent.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'i = \\frac{0.115}{12}, \\quad n = 20 \\times 12 = 240',
          tickAllocation: '\\checkmark\\text{ (Identify i and n)}',
        },
        {
          stepLatex: '1\\,200\\,000 = \\frac{x[1 - (1 + \\frac{0.115}{12})^{-240}]}{\\frac{0.115}{12}}',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Substitution into PV formula)}',
        },
        {
          stepLatex: 'x = \\text{R}\\,12\\,798.11',
          tickAllocation: '\\checkmark\\text{ (Answer to 2 dec places)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P1-FN-06',
  },

  // ==========================================
  // TOPIC 5: DIFFERENTIAL CALCULUS (P1)
  // ==========================================
  {
    id: 'PP-CALC-01',
    paper: 'P1',
    topic: 'calculus',
    cognitiveLevel: 'L2',
    marks: 5,
    questionLatex:
      '\\text{Differentiate } f(x) = 2x^2 - 3x \\text{ from first principles.}',
    distractors: [
      {
        id: 'opt-a',
        latex: "f'(x) = 4x - 3",
        explanation: 'Correct! lim_{h→0} [2(x+h)² - 3(x+h) - (2x² - 3x)] / h = lim_{h→0} (4xh + 2h² - 3h)/h = 4x - 3.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: "f'(x) = 4x + 3",
        explanation: 'DIST-SIGN: Sign error when distributing minus sign -(-3x).',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: "f'(x) = 2x - 3",
        explanation: 'Calculus power rule error: did not multiply coefficient by exponent.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: "f'(x) = 4x",
        explanation: 'Dropped linear term derivative completely.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'First principles is free marks if you do not drop lim_{h -> 0} before dividing by h. Expand, cancel the terms without h, factor out h, cancel it, then let h = 0.',
    nscMemo: {
      steps: [
        {
          stepLatex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}",
          tickAllocation: '\\checkmark\\text{ (Definition formula)}',
        },
        {
          stepLatex: '= \\lim_{h \\to 0} \\frac{[2(x + h)^2 - 3(x + h)] - [2x^2 - 3x]}{h}',
          tickAllocation: '\\checkmark\\text{ (Substitution of } f(x+h) \\text{ and } f(x))',
        },
        {
          stepLatex: '= \\lim_{h \\to 0} \\frac{2x^2 + 4xh + 2h^2 - 3x - 3h - 2x^2 + 3x}{h}',
          tickAllocation: '\\checkmark\\text{ (Algebraic expansion)}',
        },
        {
          stepLatex: '= \\lim_{h \\to 0} \\frac{h(4x + 2h - 3)}{h}',
          tickAllocation: '\\checkmark\\text{ (Factorising h)}',
        },
        {
          stepLatex: '= 4x - 3',
          tickAllocation: '\\checkmark\\text{ (Final derivative after } h \\to 0)',
        },
      ],
      totalMarks: 5,
    },
    formulaRefId: 'P1-DC-01',
  },
  {
    id: 'PP-CALC-02',
    paper: 'P1',
    topic: 'calculus',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{Determine the coordinates of the turning points of } f(x) = x^3 - 3x^2 - 9x + 5.',
    distractors: [
      {
        id: 'opt-a',
        latex: '(-1 ; 10) \\quad \\text{and} \\quad (3 ; -22)',
        explanation: 'Correct! f\'(x) = 3x² - 6x - 9 = 3(x - 3)(x + 1) = 0 ⟹ x = -1 or x = 3. f(-1) = 10, f(3) = -22.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '(1 ; -6) \\quad \\text{and} \\quad (-3 ; 32)',
        explanation: 'DIST-SIGN: Inverted critical values of derivative.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '(3 ; 0) \\quad \\text{and} \\quad (-1 ; 0)',
        explanation: 'Stated x-intercepts instead of substituting x back into f(x) for y.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '(-1 ; 12) \\quad \\text{and} \\quad (3 ; -20)',
        explanation: 'Arithmetic error when substituting roots back into cubic equation.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Turning points = where gradient is zero (f\'(x) = 0). Differentiate to get 3x² - 6x - 9, solve for x = 3 and x = -1, then plug those into f(x) to get y.',
    nscMemo: {
      steps: [
        {
          stepLatex: "f'(x) = 3x^2 - 6x - 9 = 0",
          tickAllocation: '\\checkmark\\text{ (Derivative set to 0)}',
        },
        {
          stepLatex: '3(x^2 - 2x - 3) = 0 \\implies (x - 3)(x + 1) = 0',
          tickAllocation: '\\checkmark\\text{ (Factorisation)}',
        },
        {
          stepLatex: 'x = 3 \\quad \\text{or} \\quad x = -1',
          tickAllocation: '\\checkmark\\text{ (Both x-coordinates)}',
        },
        {
          stepLatex: 'f(3) = -22, \\quad f(-1) = 10 \\implies (3 ; -22) \\;\\&\\; (-1 ; 10)',
          tickAllocation: '\\checkmark\\text{ (Both full coordinate pairs)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'UN-DC-01',
  },

  // ==========================================
  // TOPIC 6: PROBABILITY & COUNTING (P1)
  // ==========================================
  {
    id: 'PP-PRB-01',
    paper: 'P1',
    topic: 'probability',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{Given: } P(A) = 0.4, \\; P(B) = 0.5, \\; \\text{and } P(A \\cup B) = 0.7. \\text{ Are events } A \\text{ and } B \\text{ independent? Justify.}',
    distractors: [
      {
        id: 'opt-a',
        latex: '\\text{Yes, because } P(A \\cap B) = 0.20 = P(A) \\times P(B)',
        explanation: 'Correct! P(A ∩ B) = P(A) + P(B) - P(A ∪ B) = 0.4 + 0.5 - 0.7 = 0.20. P(A)·P(B) = 0.4 × 0.5 = 0.20.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '\\text{No, because } P(A \\cap B) \\ne 0',
        explanation: 'Confused independent with mutually exclusive.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '\\text{No, because } P(A \\cup B) \\ne P(A) + P(B)',
        explanation: 'Assumed independent events cannot overlap.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '\\text{Cannot be determined without a Venn diagram}',
        explanation: 'All necessary numerical values are provided.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Independent test rule: check if P(A ∩ B) equals P(A) × P(B). First find intersection: 0.4 + 0.5 - 0.7 = 0.20. Now multiply: 0.4 × 0.5 = 0.20. Match! They are independent.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = 0.4 + 0.5 - 0.7 = 0.20',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Calculate } P(A \\cap B))',
        },
        {
          stepLatex: 'P(A) \\times P(B) = 0.4 \\times 0.5 = 0.20',
          tickAllocation: '\\checkmark\\text{ (Calculate product } P(A) \\times P(B))',
        },
        {
          stepLatex: 'P(A \\cap B) = P(A) \\times P(B) \\implies \\text{Events are independent}',
          tickAllocation: '\\checkmark\\text{ (Conclusion with comparison)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'UN-PR-01',
  },
  {
    id: 'PP-PRB-02',
    paper: 'P1',
    topic: 'probability',
    cognitiveLevel: 'L3',
    marks: 4,
    questionLatex:
      '\\text{How many different 6-letter arrangements can be formed from the letters of } \\text{STUDIO} \\text{ if the vowels (U, I, O) must always be together?}',
    distractors: [
      {
        id: 'opt-a',
        latex: '144',
        explanation: 'Correct! Group vowels (UIO) into 1 unit. 4 units (S, T, D, [UIO]) permute in 4! = 24 ways. Vowels permute in 3! = 6 ways. Total = 24 × 6 = 144.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '720',
        explanation: 'Calculated 6! without the restriction that vowels must remain grouped.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '24',
        explanation: 'Permuted the 4 blocks but forgot the internal permutations of the 3 vowels (3!).',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '36',
        explanation: 'Multiplied 6 × 6 incorrectly.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Glue the vowels together with superglue like besties. They become 1 super-letter. So you have S, T, D, and [UIO] = 4 items to shuffle (4! = 24). The 3 vowels also shuffle inside their group (3! = 6). 24 × 6 = 144.',
    nscMemo: {
      steps: [
        {
          stepLatex: '\\text{Treat vowels (U, I, O) as 1 single block}',
          tickAllocation: '\\checkmark\\text{ (Group concept: 4 entities)}',
        },
        {
          stepLatex: '\\text{Arrangements of 4 entities} = 4! = 24',
          tickAllocation: '\\checkmark\\text{ (Permuting 4 entities)}',
        },
        {
          stepLatex: '\\text{Internal arrangements of 3 vowels} = 3! = 6',
          tickAllocation: '\\checkmark\\text{ (Permuting internal vowels)}',
        },
        {
          stepLatex: '\\text{Total arrangements} = 4! \\times 3! = 24 \\times 6 = 144',
          tickAllocation: '\\checkmark\\text{ (Final multiplication)}',
        },
      ],
      totalMarks: 4,
    },
  },

  // ==========================================
  // TOPIC 7: STATISTICS & REGRESSION (P2)
  // ==========================================
  {
    id: 'PP-STA-01',
    paper: 'P2',
    topic: 'statistics',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{Given the bivariate data: } (1;3), (2;5), (3;7), (4;8), (5;11). \\text{ Determine the equation of the least-squares regression line } \\hat{y} = a + bx.',
    distractors: [
      {
        id: 'opt-a',
        latex: '\\hat{y} = 1.1 + 1.9x',
        explanation: 'Correct! Mean x = 3, mean y = 6.8. Slope b = 1.9, y-intercept a = 6.8 - 1.9(3) = 1.1.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '\\hat{y} = 1.9 + 1.1x',
        explanation: 'DIST-STAT-REV: Swapped intercept a and slope b.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '\\hat{y} = 2.0x + 1.0',
        explanation: 'Approximated points using only the first and last coordinates.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '\\hat{y} = 1.1 - 1.9x',
        explanation: 'DIST-SIGN: Negative slope despite positive trend.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Remember CASIO STAT mode notation: A is the y-intercept and B is the gradient slope. In NSC we write ŷ = a + bx where a is intercept (1.1) and b is slope (1.9). Do not flip them!',
    nscMemo: {
      steps: [
        {
          stepLatex: '\\bar{x} = 3.0, \\quad \\bar{y} = 6.8',
          tickAllocation: '\\checkmark\\text{ (Mean values)}',
        },
        {
          stepLatex: 'b = \\frac{\\sum(x - \\bar{x})(y - \\bar{y})}{\\sum(x - \\bar{x})^2} = 1.9',
          tickAllocation: '\\checkmark\\text{ (Gradient slope b)}',
        },
        {
          stepLatex: 'a = \\bar{y} - b\\bar{x} = 6.8 - 1.9(3) = 1.1',
          tickAllocation: '\\checkmark\\text{ (y-intercept a)}',
        },
        {
          stepLatex: '\\hat{y} = 1.1 + 1.9x',
          tickAllocation: '\\checkmark\\text{ (Equation of regression line)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P2-ST-03',
  },
  {
    id: 'PP-STA-02',
    paper: 'P2',
    topic: 'statistics',
    cognitiveLevel: 'L2',
    marks: 2,
    questionLatex:
      '\\text{If the correlation coefficient for a study is } r = 0.94, \\text{ describe the strength and direction of the linear relationship.}',
    distractors: [
      {
        id: 'opt-a',
        latex: '\\text{Very strong positive linear correlation}',
        explanation: 'Correct! r > 0.9 indicates very strong positive linear correlation.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '\\text{Moderate positive linear correlation}',
        explanation: 'Moderate is typically 0.4 ≤ r < 0.7.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '\\text{Strong negative linear correlation}',
        explanation: 'Negative would require r < 0.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '\\text{Perfect non-linear relationship}',
        explanation: 'r measures linear relationship only.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      '0.94 is practically 1.0! That is an unmistakable, very strong positive relationship. As one increases, the other goes up right alongside it.',
    nscMemo: {
      steps: [
        {
          stepLatex: '\\text{Positive (since } r > 0)',
          tickAllocation: '\\checkmark\\text{ (Direction)}',
        },
        {
          stepLatex: '\\text{Very strong linear correlation (since } r \\approx 0.94)',
          tickAllocation: '\\checkmark\\text{ (Strength)}',
        },
      ],
      totalMarks: 2,
    },
    formulaRefId: 'P2-ST-03',
  },

  // ==========================================
  // TOPIC 8: ANALYTICAL GEOMETRY (P2)
  // ==========================================
  {
    id: 'PP-ANG-01',
    paper: 'P2',
    topic: 'analytical_geometry',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{Find the gradient and angle of inclination } \\theta \\text{ of the line passing through } A(1; 2) \\text{ and } B(4; 5).',
    distractors: [
      {
        id: 'opt-a',
        latex: 'm = 1 \\quad \\text{and} \\quad \\theta = 45^\\circ',
        explanation: 'Correct! m = (5 - 2)/(4 - 1) = 3/3 = 1. tan θ = 1 ⟹ θ = 45°.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'm = -1 \\quad \\text{and} \\quad \\theta = 135^\\circ',
        explanation: 'DIST-SIGN: Subtracted coordinates in reverse order for one axis.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'm = 1 \\quad \\text{and} \\quad \\theta = 135^\\circ',
        explanation: 'Subtracted 45° from 180° even though gradient is positive.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'm = 3 \\quad \\text{and} \\quad \\theta = 71.57^\\circ',
        explanation: 'Forgot to divide by Δx in denominator.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Gradient is Δy / Δx = (5 - 2)/(4 - 1) = 3/3 = 1. Then tan θ = 1 gives θ = 45°. When gradient is positive, your angle is acute. Keep it simple.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'm = \\frac{5 - 2}{4 - 1} = \\frac{3}{3} = 1',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Gradient formula and value)}',
        },
        {
          stepLatex: '\\tan \\theta = 1',
          tickAllocation: '\\checkmark\\text{ (Inclination relation)}',
        },
        {
          stepLatex: '\\theta = 45^\\circ',
          tickAllocation: '\\checkmark\\text{ (Inclination angle)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'P2-AG-06',
  },
  {
    id: 'PP-ANG-02',
    paper: 'P2',
    topic: 'analytical_geometry',
    cognitiveLevel: 'L3',
    marks: 5,
    questionLatex:
      '\\text{A circle has centre } C(2; 1). \\text{ The point } P(5; 5) \\text{ lies on the circle. Determine the equation of the tangent line to the circle at } P.',
    distractors: [
      {
        id: 'opt-a',
        latex: 'y = -\\frac{3}{4}x + \\frac{35}{4}',
        explanation: 'Correct! Radius slope m_CP = (5 - 1)/(5 - 2) = 4/3. Tangent slope m_tan = -3/4 (tan ⊥ rad). y - 5 = -3/4(x - 5) ⟹ y = -3/4 x + 35/4.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'y = \\frac{4}{3}x - \\frac{5}{3}',
        explanation: 'DIST-RECP: Used the radius gradient directly instead of negative reciprocal for tangent.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'y = -\\frac{4}{3}x + \\frac{35}{3}',
        explanation: 'Took negative but did not invert the fraction (reciprocal slip).',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'y = \\frac{3}{4}x + \\frac{5}{4}',
        explanation: 'Inverted fraction but forgot the negative sign.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'Radius slope is 4/3. Tangent meets radius at 90°, so flip it and negate it: m = -3/4. State (tan ⊥ rad) so the examiner cannot steal your reason mark.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'm_{\\text{radius}} = \\frac{5 - 1}{5 - 2} = \\frac{4}{3}',
          tickAllocation: '\\checkmark\\text{ (Radius gradient)}',
        },
        {
          stepLatex: 'm_{\\text{tangent}} = -\\frac{3}{4} \\quad [\\text{tan } \\perp \\text{ radius}]',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Perpendicular gradient and reason)}',
        },
        {
          stepLatex: 'y - 5 = -\\frac{3}{4}(x - 5)',
          tickAllocation: '\\checkmark\\text{ (Substitution into line equation)}',
        },
        {
          stepLatex: 'y = -\\frac{3}{4}x + \\frac{35}{4}',
          tickAllocation: '\\checkmark\\text{ (Final equation)}',
        },
      ],
      totalMarks: 5,
    },
    formulaRefId: 'UN-AG-01',
  },

  // ==========================================
  // TOPIC 9: TRIGONOMETRY (P2)
  // ==========================================
  {
    id: 'PP-TRG-01',
    paper: 'P2',
    topic: 'trigonometry',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{Simplify without a calculator: } \\frac{\\sin(180^\\circ - x) \\cdot \\cos(90^\\circ - x)}{\\sin^2 x}.',
    distractors: [
      {
        id: 'opt-a',
        latex: '1',
        explanation: 'Correct! sin(180° - x) = sin x, cos(90° - x) = sin x. Numerator = sin² x. sin² x / sin² x = 1.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '-1',
        explanation: 'DIST-SIGN: Incorrect sign on co-function reduction.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '\\tan x',
        explanation: 'Confused co-function cos(90° - x) with cos x.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '0',
        explanation: 'Subtracted terms instead of dividing.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'CAST diagram drill: sin(180° - x) is in Quadrant 2 where sine is positive, so sin x. cos(90° - x) is the co-function brother, also sin x. sin x · sin x over sin² x is just 1. Flawless.',
    nscMemo: {
      steps: [
        {
          stepLatex: '\\sin(180^\\circ - x) = \\sin x',
          tickAllocation: '\\checkmark\\text{ (Reduction formula in Q2)}',
        },
        {
          stepLatex: '\\cos(90^\\circ - x) = \\sin x',
          tickAllocation: '\\checkmark\\text{ (Co-function identity)}',
        },
        {
          stepLatex: '= \\frac{\\sin x \\cdot \\sin x}{\\sin^2 x} = \\frac{\\sin^2 x}{\\sin^2 x}',
          tickAllocation: '\\checkmark\\text{ (Multiplication in numerator)}',
        },
        {
          stepLatex: '= 1',
          tickAllocation: '\\checkmark\\text{ (Final simplification)}',
        },
      ],
      totalMarks: 4,
    },
    formulaRefId: 'UN-TR-01',
  },
  {
    id: 'PP-TRG-02',
    paper: 'P2',
    topic: 'trigonometry',
    cognitiveLevel: 'L3',
    marks: 5,
    questionLatex:
      '\\text{Determine the general solution of: } 2\\sin x \\cos x = \\cos x.',
    distractors: [
      {
        id: 'opt-a',
        latex: 'x = 90^\\circ + k \\cdot 180^\\circ \\;\\text{or}\\; x = 30^\\circ + k \\cdot 360^\\circ \\;\\text{or}\\; x = 150^\\circ + k \\cdot 360^\\circ, \\; k \\in \\mathbb{Z}',
        explanation: 'Correct! Factorising cos x(2sin x - 1) = 0 gives cos x = 0 or sin x = 1/2.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'x = 30^\\circ + k \\cdot 360^\\circ \\;\\text{or}\\; x = 150^\\circ + k \\cdot 360^\\circ, \\; k \\in \\mathbb{Z}',
        explanation: 'Divided both sides by cos x, discarding the entire set of solutions where cos x = 0.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'x = 30^\\circ + k \\cdot 180^\\circ, \\; k \\in \\mathbb{Z}',
        explanation: 'Used period 180° instead of 360° for sine general solution.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'x = 60^\\circ + k \\cdot 360^\\circ, \\; k \\in \\mathbb{Z}',
        explanation: 'Assumed sin x = √3/2 instead of 1/2.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'WARNING: Never divide by cos x! You literally wipe half the solutions off the face of the Earth. Subtract cos x to the left side and factorise like a pro.',
    nscMemo: {
      steps: [
        {
          stepLatex: '2\\sin x \\cos x - \\cos x = 0',
          tickAllocation: '\\checkmark\\text{ (Standard form with 0 on RHS)}',
        },
        {
          stepLatex: '\\cos x(2\\sin x - 1) = 0',
          tickAllocation: '\\checkmark\\text{ (Factorising common factor } \\cos x)',
        },
        {
          stepLatex: '\\cos x = 0 \\implies x = 90^\\circ + k \\cdot 180^\\circ, \\; k \\in \\mathbb{Z}',
          tickAllocation: '\\checkmark\\text{ (General solution for } \\cos x = 0)',
        },
        {
          stepLatex: '\\sin x = \\frac{1}{2} \\implies x = 30^\\circ + k \\cdot 360^\\circ \\;\\text{or}\\; x = 150^\\circ + k \\cdot 360^\\circ',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Both quadrants for sine and } k \\in \\mathbb{Z})',
        },
      ],
      totalMarks: 5,
    },
    formulaRefId: 'P2-TR-11',
  },

  // ==========================================
  // TOPIC 10: EUCLIDEAN GEOMETRY (P2)
  // ==========================================
  {
    id: 'PP-EUC-01',
    paper: 'P2',
    topic: 'euclidean_geometry',
    cognitiveLevel: 'L2',
    marks: 4,
    questionLatex:
      '\\text{In the diagram, } ABCD \\text{ is a cyclic quadrilateral with } \\hat{A} = 72^\\circ. \\text{ Determine the size of } \\hat{C} \\text{ with the official DBE reason.}',
    distractors: [
      {
        id: 'opt-a',
        latex: '\\hat{C} = 108^\\circ \\quad [\\text{opp } \\angle\\text{s of cyclic quad}]',
        explanation: 'Correct! Opposite angles of a cyclic quad are supplementary (180° - 72° = 108°).',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: '\\hat{C} = 72^\\circ \\quad [\\angle\\text{s in same seg}]',
        explanation: 'Opposite angles are supplementary, not equal.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: '\\hat{C} = 108^\\circ \\quad [\\text{cyclic quad}]',
        explanation: 'Incomplete reason: DBE marking guideline penalizes omission of "opp ∠s".',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: '\\hat{C} = 18^\\circ \\quad [\\text{co-interior } \\angle\\text{s}]',
        explanation: 'Assumed complementary (90°) and invalid parallel line reason.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'All 4 vertices sit on the circle = cyclic quad. Opposite corners add up to 180°. 180° - 72° = 108°. Write [opp ∠s of cyclic quad] or say goodbye to your reason mark.',
    nscMemo: {
      steps: [
        {
          stepLatex: '\\hat{A} + \\hat{C} = 180^\\circ',
          tickAllocation: '\\checkmark\\text{ (Statement: opposite angles supplementary)}',
        },
        {
          stepLatex: '[\\text{opp } \\angle\\text{s of cyclic quad}]',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Official DBE Reason)}',
        },
        {
          stepLatex: '\\hat{C} = 180^\\circ - 72^\\circ = 108^\\circ',
          tickAllocation: '\\checkmark\\text{ (Calculation and answer)}',
        },
      ],
      totalMarks: 4,
    },
  },
  {
    id: 'PP-EUC-02',
    paper: 'P2',
    topic: 'euclidean_geometry',
    cognitiveLevel: 'L3',
    marks: 5,
    questionLatex:
      '\\text{Line } PT \\text{ is a tangent to the circle at } T. \\text{ Chord } TR \\text{ subtends } \\hat{S} = 54^\\circ \\text{ at the alternate circumference. Find } P\\hat{T}R \\text{ with reason.}',
    distractors: [
      {
        id: 'opt-a',
        latex: 'P\\hat{T}R = 54^\\circ \\quad [\\text{tan-chord thm}]',
        explanation: 'Correct! By the tangent-chord theorem, the angle between tangent PT and chord TR equals the angle in the alternate segment.',
        isCorrect: true,
      },
      {
        id: 'opt-b',
        latex: 'P\\hat{T}R = 126^\\circ \\quad [\\text{adj } \\angle\\text{s on str line}]',
        explanation: 'Subtracted from 180° mistakenly.',
        isCorrect: false,
      },
      {
        id: 'opt-c',
        latex: 'P\\hat{T}R = 90^\\circ \\quad [\\text{tan } \\perp \\text{ radius}]',
        explanation: 'TR is a general chord, not a radius or diameter.',
        isCorrect: false,
      },
      {
        id: 'opt-d',
        latex: 'P\\hat{T}R = 36^\\circ \\quad [\\text{angles of } \\triangle]',
        explanation: 'Subtracted from 90° incorrectly.',
        isCorrect: false,
      },
    ],
    correctAnswerId: 'opt-a',
    zanteVibeCheck:
      'The classic Tan-Chord Theorem: angle between the tangent and the chord equals the angle inside the triangle on the other side. 54° here = 54° there. Reason: [tan-chord thm]. Done.',
    nscMemo: {
      steps: [
        {
          stepLatex: 'P\\hat{T}R = \\hat{S}',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Statement: equality of angles)}',
        },
        {
          stepLatex: '[\\text{tan-chord thm}]',
          tickAllocation: '\\checkmark\\checkmark\\text{ (Official DBE acceptable reason)}',
        },
        {
          stepLatex: 'P\\hat{T}R = 54^\\circ',
          tickAllocation: '\\checkmark\\text{ (Numerical answer)}',
        },
      ],
      totalMarks: 5,
    },
  },
];

export function getPastPaperQuestions(): Question[] {
  return PAST_PAPER_QUESTIONS;
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return PAST_PAPER_QUESTIONS.filter((q) => q.topic === topicId);
}

export function getQuestionsByPaper(paper: 'P1' | 'P2'): Question[] {
  return PAST_PAPER_QUESTIONS.filter((q) => q.paper === paper);
}

export function getQuestionById(id: string): Question | undefined {
  return PAST_PAPER_QUESTIONS.find((q) => q.id === id);
}
