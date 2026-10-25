import type { Question, QuestionDistractor } from '../types/curriculum.ts';
import type { ZanteQuestion } from '../types/gamification.ts';

/**
 * Returns a random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

/**
 * Returns a random non-zero integer between min and max (inclusive).
 */
export function randomNonZeroInt(min: number, max: number): number {
  let val = 0;
  while (val === 0) {
    val = randomInt(min, max);
  }
  return val;
}

/**
 * Picks a random element from an array.
 */
export function randomChoice<T>(arr: readonly T[] | T[]): T {
  if (arr.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * In-place Fisher-Yates shuffle algorithm.
 * Guarantees uniform random distribution across all permutations.
 */
export function fisherYatesShuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

/**
 * Shuffles an array in place or returns a shallow shuffled copy.
 */
export function shuffleArray<T>(arr: readonly T[] | T[]): T[] {
  const copy = [...arr];
  return fisherYatesShuffle(copy);
}

/**
 * Computes Greatest Common Divisor (Euclidean algorithm).
 */
export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x || 1;
}

/**
 * Simplifies a fraction to lowest terms with positive denominator.
 */
export function simplifyFraction(
  numerator: number,
  denominator: number
): { num: number; den: number } {
  if (denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }
  const sign = (numerator < 0 && denominator > 0) || (numerator > 0 && denominator < 0) ? -1 : 1;
  const absNum = Math.abs(numerator);
  const absDen = Math.abs(denominator);
  const divisor = gcd(absNum, absDen);
  return {
    num: sign * (absNum / divisor),
    den: absDen / divisor,
  };
}

/**
 * Formats a fraction into clean KaTeX string.
 */
export function formatFractionLatex(numerator: number, denominator: number): string {
  if (denominator === 0) return '\\text{undefined}';
  const { num, den } = simplifyFraction(numerator, denominator);
  if (den === 1) return `${num}`;
  if (num < 0) return `-\\frac{${Math.abs(num)}}{${den}}`;
  return `\\frac{${num}}{${den}}`;
}

/**
 * Formats a quadratic equation ax² + bx + c = 0 into KaTeX.
 */
export function formatQuadraticLatex(a: number, b: number, c: number): string {
  let res = '';
  // term a
  if (a === 1) res += 'x^2';
  else if (a === -1) res += '-x^2';
  else res += `${a}x^2`;

  // term b
  if (b > 0) {
    res += b === 1 ? ' + x' : ` + ${b}x`;
  } else if (b < 0) {
    res += b === -1 ? ' - x' : ` - ${Math.abs(b)}x`;
  }

  // term c
  if (c > 0) {
    res += ` + ${c}`;
  } else if (c < 0) {
    res += ` - ${Math.abs(c)}`;
  }

  return `${res} = 0`;
}

/**
 * Formats a linear term ax + b.
 */
export function formatLinearLatex(m: number, c: number): string {
  let res = '';
  if (m === 1) res = 'x';
  else if (m === -1) res = '-x';
  else if (m !== 0) res = `${m}x`;

  if (c > 0) {
    res += res.length > 0 ? ` + ${c}` : `${c}`;
  } else if (c < 0) {
    res += res.length > 0 ? ` - ${Math.abs(c)}` : `-${Math.abs(c)}`;
  } else if (res.length === 0) {
    res = '0';
  }
  return res;
}

/**
 * Canonical formatter for quadratic roots ensuring ascending order representation.
 * Guarantees {r1, r2} always formats to the exact same string regardless of argument order.
 */
export function formatRootsLatex(u: number, v: number): string {
  if (u === v) return `x = ${u} \\text{ only}`;
  const min = Math.min(u, v);
  const max = Math.max(u, v);
  return `x = ${min} \\;\\text{or}\\; x = ${max}`;
}

/**
 * Formats a currency amount into KaTeX-safe string with space thousands separators.
 * Example: 12798.11 -> "12 798.11"
 */
export function formatCurrencyLatex(val: number): string {
  const fixed = Number(val).toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formattedInt}.${decPart}`;
}

/**
 * Formats an integer into KaTeX-safe string with space thousands separators.
 * Example: 1200000 -> "1 200 000"
 */
export function formatIntegerLatex(val: number): string {
  return String(Math.round(val)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Builds 4 distinct distractors from a correct answer and candidate distractors.
 * Guarantees exactly 4 items, 1 correct, distinct LaTeX strings, zero NaN/undefined.
 */
export function buildDistractorSet(
  correctLatex: string,
  correctExplanation: string,
  candidates: Array<{ latex: string; explanation: string }>
): { distractors: QuestionDistractor[]; correctAnswerId: string; correctIndex: number } {
  // Collect unique distractors that do not match the correct LaTeX
  const uniqueDistractors: Array<{ latex: string; explanation: string }> = [];
  const seenLatex = new Set<string>([correctLatex]);

  for (const c of candidates) {
    if (!seenLatex.has(c.latex) && c.latex.trim().length > 0) {
      seenLatex.add(c.latex);
      uniqueDistractors.push(c);
      if (uniqueDistractors.length === 3) break;
    }
  }

  // If not enough unique candidates, synthesise fallback variations cleanly
  let fallbackCounter = 1;
  while (uniqueDistractors.length < 3) {
    const fallbackLatex = `\\text{Option } ${fallbackCounter}`;
    if (!seenLatex.has(fallbackLatex)) {
      seenLatex.add(fallbackLatex);
      uniqueDistractors.push({
        latex: fallbackLatex,
        explanation: 'Alternative conceptual distractor.',
      });
    }
    fallbackCounter++;
  }

  const rawList: QuestionDistractor[] = [
    {
      id: 'opt-correct',
      latex: correctLatex,
      explanation: correctExplanation,
      isCorrect: true,
    },
    ...uniqueDistractors.slice(0, 3).map((d, idx) => ({
      id: `opt-dist-${idx + 1}`,
      latex: d.latex,
      explanation: d.explanation,
      isCorrect: false,
    })),
  ];

  // In-place Fisher-Yates shuffle directly on raw options list
  fisherYatesShuffle(rawList);

  // Re-assign human letters opt-a, opt-b, opt-c, opt-d
  const letters = ['opt-a', 'opt-b', 'opt-c', 'opt-d'];
  let correctAnswerId = 'opt-a';
  let correctIndex = 0;

  const distractors: QuestionDistractor[] = rawList.map((item, index) => {
    const newId = letters[index];
    if (item.isCorrect) {
      correctAnswerId = newId;
      correctIndex = index;
    }
    return {
      id: newId,
      latex: item.latex,
      explanation: item.explanation,
      isCorrect: item.isCorrect,
    };
  });

  return { distractors, correctAnswerId, correctIndex };
}

/**
 * Applies in-place Fisher-Yates shuffle to a Question's distractors,
 * ensuring uniform 25% distribution across opt-a, opt-b, opt-c, opt-d.
 * Updates correctAnswerId and correctIndex.
 */
export function shuffleQuestionDistractors<T extends Question>(question: T): T {
  const letters = ['opt-a', 'opt-b', 'opt-c', 'opt-d'];
  const clonedDistractors = question.distractors.map((d) => ({ ...d }));
  fisherYatesShuffle(clonedDistractors);

  let correctAnswerId = 'opt-a';
  let correctIndex = 0;

  const distractors: QuestionDistractor[] = clonedDistractors.map((item, index) => {
    const newId = letters[index] || `opt-${index}`;
    if (item.isCorrect) {
      correctAnswerId = newId;
      correctIndex = index;
    }
    return {
      id: newId,
      latex: item.latex,
      explanation: item.explanation,
      isCorrect: item.isCorrect,
    };
  });

  // Also shuffle sub-questions if present
  const subQuestions = question.subQuestions?.map((sq) => {
    const clonedSqDistractors = sq.distractors.map((d) => ({ ...d }));
    fisherYatesShuffle(clonedSqDistractors);
    let sqCorrectAnswerId = 'opt-a';
    let sqCorrectIndex = 0;
    const sqDistractors: QuestionDistractor[] = clonedSqDistractors.map((item, index) => {
      const newId = letters[index] || `opt-${index}`;
      if (item.isCorrect) {
        sqCorrectAnswerId = newId;
        sqCorrectIndex = index;
      }
      return {
        id: newId,
        latex: item.latex,
        explanation: item.explanation,
        isCorrect: item.isCorrect,
      };
    });
    return {
      ...sq,
      distractors: sqDistractors,
      correctAnswerId: sqCorrectAnswerId,
      correctIndex: sqCorrectIndex,
    };
  });

  return {
    ...question,
    distractors,
    correctAnswerId,
    correctIndex,
    ...(subQuestions ? { subQuestions } : {}),
  };
}

/**
 * Applies in-place Fisher-Yates shuffle to a ZanteQuestion's options,
 * ensuring uniform 25% distribution across indices 0, 1, 2, 3.
 * Updates correctIndex to match post-shuffle position.
 */
export function shuffleZanteQuestion<T extends ZanteQuestion>(question: T): T {
  const correctText = question.options[question.correctIndex];
  const options = [...question.options];
  fisherYatesShuffle(options);
  const correctIndex = options.indexOf(correctText);

  return {
    ...question,
    options,
    correctIndex,
  };
}

/**
 * Asserts that an object or string contains zero NaN, null, or undefined.
 */
export function assertNoNaNOrUndefined(value: any, context = 'root'): void {
  if (value === undefined) {
    throw new Error(`Invariant violation: undefined found at ${context}`);
  }
  if (value === null) {
    throw new Error(`Invariant violation: null found at ${context}`);
  }
  if (typeof value === 'number' && Number.isNaN(value)) {
    throw new Error(`Invariant violation: NaN found at ${context}`);
  }
  if (typeof value === 'string') {
    if (value.includes('NaN') || value.includes('undefined') || value.includes('null')) {
      throw new Error(`Invariant violation: invalid token in string "${value}" at ${context}`);
    }
  } else if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      assertNoNaNOrUndefined(value[key], `${context}.${key}`);
    }
  }
}
