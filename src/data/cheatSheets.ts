import type { TopicCheatSheet, TopicId, PaperId, CognitiveLevel, Question } from '../types/curriculum.ts';
import { GEOMETRY_REASONS } from './geometryReasons.ts';
import { PAST_PAPER_QUESTIONS } from './pastPaperQuestions.ts';
import { generateP1Question } from '../generators/p1Generators.ts';
import { generateP2Question } from '../generators/p2Generators.ts';

/**
 * Zante's Matric Maths Studio — One-Pager Cheat Sheets Data
 *
 * Comprehensive, high-yield cheat sheets covering all 10 CAPS Grade 12 Pure Mathematics topics.
 * Calibrated strictly to DBE NSC Examination Guidelines and marking memoranda standards.
 */

export const CHEAT_SHEETS: Record<TopicId, TopicCheatSheet> = {
  algebra: {
    topicId: 'algebra',
    title: 'Algebra, Equations & Inequalities',
    paper: 'P1',
    examWeightMarks: 25,
    formulas: [
      {
        name: 'Quadratic Standard Form & Formula',
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        description: 'Applies to any quadratic equation ax^2 + bx + c = 0 where a \\ne 0.',
      },
      {
        name: 'The Discriminant',
        latex: '\\Delta = b^2 - 4ac',
        description:
          'Determines the nature of roots: Δ > 0 (real, unequal; rational if square, irrational if non-square), Δ = 0 (real, equal/tangent to x-axis), Δ < 0 (non-real/no real x-intercepts).',
      },
      {
        name: 'Exponential Laws & Log Definition',
        latex: 'a^x = y \\iff x = \\log_a y \\quad (a > 0, a \\ne 1, y > 0)',
        description: 'Crucial for isolating exponents and checking valid domains.',
      },
      {
        name: 'Surd Invariant & Extraneous Condition',
        latex: '\\sqrt{f(x)} = g(x) \\implies g(x) \\ge 0 \\text{ and } f(x) = [g(x)]^2',
        description: 'Radical outputs are always non-negative. Extraneous solutions where g(x) < 0 must be rejected.',
      },
    ],
    topTraps: [
      {
        trap: 'Dividing both sides by the variable x (e.g. 2x² = 6x ⟹ 2x = 6).',
        howToAvoid:
          'Never divide by a variable! You delete the root x = 0. Always transpose to standard form and factorise: 2x(x - 3) = 0 ⟹ x = 0 or x = 3.',
      },
      {
        trap: 'Forgetting to test both solutions in surd equations.',
        howToAvoid:
          'Squaring both sides can introduce false (extraneous) roots. Always substitute candidate roots back into the original equation and explicitly state "rej x = ...".',
      },
      {
        trap: 'Dividing or multiplying an inequality by a negative number without reversing the inequality sign.',
        howToAvoid:
          'Whenever you multiply or divide across an inequality by a negative value, flip the symbol immediately (< becomes >, ≤ becomes ≥).',
      },
      {
        trap: 'Incorrect squaring of binomials involving roots: (√(x + 2) + 1)² = x + 2 + 1.',
        howToAvoid:
          'Isolate the radical on one side completely BEFORE squaring: √(x + 2) = x - 1. Remember (a + b)² = a² + 2ab + b².',
      },
      {
        trap: 'Confusing "roots are real" with "roots are real and unequal".',
        howToAvoid:
          '"Roots are real" means Δ ≥ 0 (you MUST include equality!). "Real and distinct/unequal" means Δ > 0 strictly.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Solving Quadratic Inequalities (ax² + bx + c > 0 or < 0)',
        steps: [
          'Transpose all terms to the LHS with a positive leading coefficient (a > 0): ax² + bx + c > 0 (or < 0).',
          'Find critical values (CVs) by solving the equation ax² + bx + c = 0 (factorise or use quadratic formula).',
          'Arrange critical values on a number line: x₁ < x₂.',
          'Sketch a concave-up parabola: for > 0, choose the outer intervals: x < x₁ or x > x₂.',
          'For < 0, choose the inner interval: x₁ < x < x₂. If the sign includes equality (≥ or ≤), include endpoints with solid dots or square brackets.',
        ],
      },
      {
        title: 'Solving Surd Equations with Extraneous Root Check',
        steps: [
          'Isolate the radical term on one side: √(f(x)) = g(x).',
          'State domain restriction: g(x) ≥ 0.',
          'Square both sides: f(x) = [g(x)]² (expand binomials carefully: (p - q)² = p² - 2pq + q²).',
          'Rearrange into standard quadratic form: ax² + bx + c = 0.',
          'Solve for candidate values of x.',
          'Substitute every candidate back into the original LHS and RHS. Reject any root that makes the equation false or produces a negative root output.',
        ],
      },
      {
        title: 'Simultaneous Linear & Non-Linear Systems',
        steps: [
          'Choose the linear equation (e.g. y - 2x = 3) and make the variable with coefficient 1 or -1 the subject: y = 2x + 3.',
          'Substitute this expression wherever that variable appears in the non-linear equation: x² + (2x + 3)² = 17.',
          'Expand and simplify into standard quadratic form ax² + bx + c = 0.',
          'Factorise or apply the quadratic formula to solve for the first variable (x₁ and x₂).',
          'Substitute x₁ and x₂ back into the linear expression to find the matching pair values (y₁ and y₂). Present as ordered pairs (x₁, y₁) and (x₂, y₂).',
        ],
      },
    ],
  },

  patterns: {
    topicId: 'patterns',
    title: 'Number Patterns, Sequences & Series',
    paper: 'P1',
    examWeightMarks: 25,
    formulas: [
      {
        name: 'Arithmetic Sequence (nth term)',
        latex: 'T_n = a + (n - 1)d',
        description: 'First term a = T_1, constant common difference d = T_2 - T_1 = T_3 - T_2.',
      },
      {
        name: 'Arithmetic Series (Sum of n terms)',
        latex: 'S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}(a + l)',
        description: 'Sum of first n terms where l = T_n is the last term.',
      },
      {
        name: 'Geometric Sequence (nth term)',
        latex: 'T_n = ar^{n-1}',
        description: 'First term a = T_1, constant common ratio r = \\frac{T_2}{T_1} = \\frac{T_3}{T_2}.',
      },
      {
        name: 'Geometric Series (Sum of n terms)',
        latex: 'S_n = \\frac{a(r^n - 1)}{r - 1} = \\frac{a(1 - r^n)}{1 - r} \\quad (r \\ne 1)',
        description: 'Sum of first n terms of a geometric progression.',
      },
      {
        name: 'Geometric Sum to Infinity (Infinite Series)',
        latex: 'S_\\infty = \\frac{a}{1 - r} \\quad (-1 < r < 1)',
        description: 'Converges if and only if |r| < 1 (i.e. -1 < r < 1 and r \\ne 0).',
      },
      {
        name: 'Quadratic Sequence (General term & differences)',
        latex: 'T_n = an^2 + bn + c \\quad (2a = d_2, \\; 3a + b = T_2 - T_1, \\; a + b + c = T_1)',
        description: 'Constant second difference d_2 = 2a. First difference of first term is 3a + b.',
      },
    ],
    topTraps: [
      {
        trap: 'Miscounting the number of terms in Sigma notation (e.g. ∑_{k=0}^{10} having 10 terms).',
        howToAvoid:
          'Formula for number of terms in ∑_{k=p}^q is always n = q - p + 1. So from k = 0 to 10 there are 10 - 0 + 1 = 11 terms!',
      },
      {
        trap: 'Stating the convergence condition for infinite geometric series as r < 1 instead of -1 < r < 1.',
        howToAvoid:
          'Series only converges when the ratio is strictly between -1 and 1: -1 < r < 1 (or |r| < 1). If r = -2 or r = 1, it diverges.',
      },
      {
        trap: 'Confusing Tn (value of the nth term) with Sn (sum of the first n terms).',
        howToAvoid:
          'Remember: Tn is the single number sitting at position n. Sn is the running total of all numbers up to position n. Tn = Sn - S_{n-1}.',
      },
      {
        trap: 'Applying quadratic formula 2a = d₂ to the first difference instead of second difference.',
        howToAvoid:
          'First calculate row 1 differences (Δ₁ = T₂ - T₁, Δ₂ = T₃ - T₂), then calculate row 2 difference (d₂ = Δ₂ - Δ₁). Only d₂ equals 2a.',
      },
      {
        trap: 'Rounding the term position n to a non-integer or accepting negative n.',
        howToAvoid:
          'The position index n MUST always be a positive natural number (n ∈ {1, 2, 3, ...}). If you get n = -4 or n = 3.5, reject or recheck your algebra.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Evaluating Sigma Notation: ∑_{k=p}^q Expression',
        steps: [
          'Calculate total number of terms: n = (Top) - (Bottom) + 1 = q - p + 1.',
          'Generate the first 3 terms by substituting k = p, then k = p + 1, then k = p + 2.',
          'Check for pattern: if (T₂ - T₁) is constant, it is Arithmetic with a = T_p and difference d. If (T₂ / T₁) is constant, it is Geometric with ratio r.',
          'Substitute n, a, and d (or r) into the corresponding Sn formula.',
          'Compute final numerical sum on calculator and double-check using calculator ∑ key.',
        ],
      },
      {
        title: 'Finding the nth Term of a Quadratic Sequence (Tn = an² + bn + c)',
        steps: [
          'List first four terms: T₁, T₂, T₃, T₄.',
          'Calculate first differences: Δ₁ = T₂ - T₁, Δ₂ = T₃ - T₂, Δ₃ = T₄ - T₃.',
          'Calculate constant second difference: d₂ = Δ₂ - Δ₁.',
          'Solve for a: 2a = d₂ ⟹ a = d₂ / 2.',
          'Solve for b: 3a + b = Δ₁ ⟹ b = Δ₁ - 3a.',
          'Solve for c: a + b + c = T₁ ⟹ c = T₁ - a - b.',
          'Assemble general term: Tn = an² + bn + c, and verify by testing n = 1, 2, 3.',
        ],
      },
    ],
  },

  functions: {
    topicId: 'functions',
    title: 'Functions, Inverses & Graphs',
    paper: 'P1',
    examWeightMarks: 35,
    formulas: [
      {
        name: 'Parabola Standard & Turning Point Forms',
        latex: 'y = a(x - p)^2 + q \\quad \\text{and} \\quad y = a(x - x_1)(x - x_2)',
        description: 'Turning point is (p, q), axis of symmetry x = p. Roots are x_1 and x_2.',
      },
      {
        name: 'Hyperbola Standard Form',
        latex: 'y = \\frac{a}{x - p} + q',
        description:
          'Vertical asymptote at x = p (denominator = 0). Horizontal asymptote at y = q. Axes of symmetry: y = (x - p) + q and y = -(x - p) + q.',
      },
      {
        name: 'Exponential & Logarithmic Inverses',
        latex: 'f(x) = b^x \\iff f^{-1}(x) = \\log_b x \\quad (b > 0, b \\ne 1)',
        description: 'Inverse reflection across the line y = x. Horizontal asymptote y = 0 becomes vertical asymptote x = 0.',
      },
      {
        name: 'Average Gradient between two points',
        latex: '\\text{Average Gradient} = \\frac{f(x_2) - f(x_1)}{x_2 - x_1}',
        description: 'Gradient of the secant line connecting two points on any curve.',
      },
    ],
    topTraps: [
      {
        trap: 'Confusing f⁻¹(x) [inverse function] with [f(x)]⁻¹ = 1/f(x) [reciprocal].',
        howToAvoid:
          'f⁻¹(x) is the inverse function obtained by swapping x and y and reflecting across the line y = x. It is NEVER 1 over the function!',
      },
      {
        trap: 'Forgetting the domain restriction so that the inverse of a parabola is a function.',
        howToAvoid:
          'The inverse of y = x² is y = ±√x, which fails the vertical line test. To make f⁻¹ a function, restrict the original domain to x ≥ 0 or x ≤ 0 (relative to turning point x ≥ p or x ≤ p).',
      },
      {
        trap: 'Sign error on hyperbola vertical asymptote: y = a/(x + 3) having asymptote at x = 3.',
        howToAvoid:
          'Set the denominator to 0: x + 3 = 0 ⟹ vertical asymptote is x = -3. Do not forget the sign inversion inside brackets.',
      },
      {
        trap: 'Interpreting f\'(x) ≥ 0 as "where the graph is above the x-axis".',
        howToAvoid:
          'f\'(x) is the gradient! f\'(x) ≥ 0 means where f is INCREASING (sloping upwards from left to right), NOT where y > 0.',
      },
      {
        trap: 'Solving graphical product inequalities f(x) · g(x) ≤ 0 without finding root boundaries.',
        howToAvoid:
          'f(x) · g(x) ≤ 0 means one graph is on or above the x-axis while the other is on or below the x-axis. Mark all x-intercepts of both graphs and test signs in each interval.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Determining the Inverse Function f⁻¹(x)',
        steps: [
          'Rewrite f(x) as y: e.g. y = 3x - 5 or y = 2^x.',
          'Swap x and y completely: x = 3y - 5 or x = 2^y.',
          'Make y the subject of the formula: for x = 3y - 5 ⟹ y = (x + 5)/3; for x = 2^y ⟹ y = log₂(x).',
          'Express answer in inverse function notation: f⁻¹(x) = ...',
          'If the original function was a many-to-one parabola y = ax², specify the restricted domain (e.g. x ≥ 0) so the inverse is a one-to-one function.',
        ],
      },
      {
        title: 'Determining Equations of Asymptotes and Axes of Symmetry for Hyperbola',
        steps: [
          'Given y = a / (x - p) + q:',
          'Vertical asymptote: set denominator to zero ⟹ x - p = 0 ⟹ x = p.',
          'Horizontal asymptote: y = q.',
          'Axis of symmetry with positive gradient (m = 1): y = (x - p) + q.',
          'Axis of symmetry with negative gradient (m = -1): y = -(x - p) + q.',
          'Verify that both axes of symmetry intersect at the center point (p, q).',
        ],
      },
    ],
  },

  finance: {
    topicId: 'finance',
    title: 'Finance, Growth & Decay',
    paper: 'P1',
    examWeightMarks: 15,
    formulas: [
      {
        name: 'Simple Growth & Decay (Straight-Line)',
        latex: 'A = P(1 + ni) \\quad \\text{and} \\quad A = P(1 - ni)',
        description: 'Straight-line depreciation and simple interest. Book value reduces by a constant amount each period.',
      },
      {
        name: 'Compound Growth & Decay (Reducing-Balance)',
        latex: 'A = P(1 + i)^n \\quad \\text{and} \\quad A = P(1 - i)^n',
        description: 'Compound interest, inflation, and reducing-balance depreciation.',
      },
      {
        name: 'Nominal vs Effective Interest Rate',
        latex: '1 + i_{\\text{eff}} = \\left(1 + \\frac{i_{\\text{nom}}}{m}\\right)^m',
        description: 'Converts annual nominal rate compounded m times per year into the true annual effective rate.',
      },
      {
        name: 'Future Value Annuity (Investments / Sinking Fund)',
        latex: 'F = \\frac{x[(1 + i)^n - 1]}{i}',
        description: 'Regular payment x made at equal intervals to accumulate wealth into the future.',
      },
      {
        name: 'Present Value Annuity (Mortgages / Loans)',
        latex: 'P = \\frac{x[1 - (1 + i)^{-n}]}{i}',
        description: 'Loan amount P paid off by equal periodic installments x over n periods.',
      },
      {
        name: 'Outstanding Loan Balance after k payments',
        latex: '\\text{Balance}_k = P(1 + i)^k - \\frac{x[(1 + i)^k - 1]}{i} = \\frac{x[1 - (1 + i)^{-(n - k)}]}{i}',
        description: 'Calculated either as future value of debt minus accumulated payments, or present value of remaining payments.',
      },
    ],
    topTraps: [
      {
        trap: 'Immediate first payment in Future Value Annuity (payment starts at t = 0 instead of t = 1).',
        howToAvoid:
          'If payment starts immediately at t = 0 and continues to t = n, there is ONE EXTRA payment: use n + 1 payments, or multiply standard F by (1 + i).',
      },
      {
        trap: 'Forgetting to convert annual interest rate and time periods to match monthly compounding frequency.',
        howToAvoid:
          'If rate is 10.5% p.a. compounded monthly over 20 years: i = 0.105 / 12, and n = 20 × 12 = 240. Always adjust BOTH i and n!',
      },
      {
        trap: 'Dropping the negative sign in the Present Value exponent: (1 + i)^n instead of (1 + i)^{-n}.',
        howToAvoid:
          'Present value discount factor MUST have a negative exponent: 1 - (1 + i)^{-n}. If your exponent is positive, the numerator becomes negative!',
      },
      {
        trap: 'Calculating Sinking Fund without subtracting the scrap trade-in value.',
        howToAvoid:
          'Sinking Fund Required = (Cost of new machine inflated with compound growth) - (Scrap value of old machine depreciated with reducing balance).',
      },
      {
        trap: 'Deferred payments (grace period): starting repayments 4 months after loan granted.',
        howToAvoid:
          'The loan accrues compound interest during the delay period before the first annuity installment takes effect. Calculate new loan balance at t = 3: P_new = P_original(1 + i)³.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Calculating Monthly Mortgage / Home Loan Installment (x)',
        steps: [
          'Determine the actual loan principal P (Purchase price minus cash deposit).',
          'Convert annual interest rate r% to monthly decimal: i = r / (100 × 12).',
          'Convert term in years to total months: n = years × 12.',
          'Set up the Present Value formula: P = x[1 - (1 + i)^{-n}] / i.',
          'Rearrange to solve for x: x = (P · i) / [1 - (1 + i)^{-n}].',
          'Calculate to 2 decimal places (cents), always retaining full precision in calculator memory.',
        ],
      },
      {
        title: 'Calculating Sinking Fund for Replacement Equipment',
        steps: [
          'Calculate cost of replacement machine n years from now using compound growth: A_new = Cost_now × (1 + i_inflation)^n.',
          'Calculate scrap / trade-in value of current machine using reducing-balance depreciation: S_old = Cost_now × (1 - i_depreciation)^n.',
          'Determine required sinking fund amount: F = A_new - S_old.',
          'Substitute F into the Future Value annuity formula: F = x[(1 + i_sinking)^n - 1] / i_sinking.',
          'Solve for the required periodic deposit x.',
        ],
      },
    ],
  },

  calculus: {
    topicId: 'calculus',
    title: 'Differential Calculus',
    paper: 'P1',
    examWeightMarks: 35,
    formulas: [
      {
        name: 'Derivative from First Principles',
        latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}",
        description: 'Definition of derivative. You must keep \\lim_{h \\to 0} on every line until h is set to zero.',
      },
      {
        name: 'Power Rule for Differentiation',
        latex: '\\frac{d}{dx}[a x^n] = a \\cdot n x^{n-1} \\quad \\text{and} \\quad \\frac{d}{dx}[k] = 0',
        description: 'Rewrite terms in form ax^n before differentiating (eliminate fractions and surds).',
      },
      {
        name: 'Equation of Tangent Line at x = a',
        latex: "y - f(a) = f'(a)(x - a)",
        description: "Gradient of tangent line is m = f'(a). Point of contact is (a, f(a)).",
      },
      {
        name: 'Cubic Function & Stationary Points',
        latex: "f(x) = ax^3 + bx^2 + cx + d \\quad (f'(x) = 0 \\text{ for turning points})",
        description: "Turning points where f'(x) = 0. Point of inflection where f''(x) = 0 (or x = -b / (3a)).",
      },
      {
        name: 'Concavity Conditions',
        latex: "f''(x) > 0 \\implies \\text{Concave Up} \\quad \\text{and} \\quad f''(x) < 0 \\implies \\text{Concave Down}",
        description: "Second derivative tests concavity and confirms local minimum (f'' > 0) or maximum (f'' < 0).",
      },
    ],
    topTraps: [
      {
        trap: 'Dropping the limit notation \\lim_{h \\to 0} prematurely in first principles.',
        howToAvoid:
          'You MUST write \\lim_{h \\to 0} on EVERY line until the line where h is explicitly replaced with 0. Dropping it early costs an accuracy mark.',
      },
      {
        trap: 'Differentiating before rewriting terms into power form ax^n.',
        howToAvoid:
          'Never differentiate fractions with x in denominator or roots directly. Rewrite 3/(2x²) as (3/2)x⁻² and 4√x as 4x^{1/2} first.',
      },
      {
        trap: 'Differentiating products or quotients term-by-term without expanding: d/dx[(x - 2)(x + 3)] ≠ (1)(1).',
        howToAvoid:
          'In CAPS, product and quotient rules are not taught; you MUST multiply out all brackets first: (x - 2)(x + 3) = x² + x - 6, then differentiate.',
      },
      {
        trap: 'Confusing the graph of f(x) with the graph of its derivative f\'(x).',
        howToAvoid:
          'If given the graph of f\'(x): its x-intercepts are turning points of f; where f\' is above the x-axis, f is increasing; turning points of f\' are inflection points of f.',
      },
      {
        trap: 'In optimization word problems, forgetting to eliminate one variable before differentiating.',
        howToAvoid:
          'Write the target formula (e.g. Volume) in terms of two variables, use the given constraint (e.g. Surface Area = 150) to express one variable in terms of the other, substitute, then differentiate.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Differentiating from First Principles: f\'(x) = lim_{h→0} [f(x+h) - f(x)] / h',
        steps: [
          'State the official definition: f\'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}.',
          'Calculate f(x + h) separately by substituting (x + h) for every x, and expand brackets carefully.',
          'Subtract f(x): [f(x + h) - f(x)]. Every term that does not have an h MUST cancel out.',
          'Factor out h from the numerator: \\lim_{h \\to 0} \\frac{h(2x + h - ...)}{h}.',
          'Cancel h with the denominator.',
          'Evaluate the limit by setting h = 0 and drop the limit sign to obtain the final derivative.',
        ],
      },
      {
        title: 'Sketching a Cubic Function f(x) = ax³ + bx² + cx + d',
        steps: [
          'Determine y-intercept: set x = 0 ⟹ (0, d).',
          'Determine x-intercepts: solve ax³ + bx² + cx + d = 0 using Factor Theorem (test factors of d like ±1, ±2, then divide by (x - k) to get quadratic).',
          'Find stationary points: differentiate to get f\'(x) = 3ax² + 2bx + c = 0, solve for x₁ and x₂, substitute into f(x) for y-coordinates.',
          'Find point of inflection: solve f\'\'(x) = 6ax + 2b = 0 ⟹ x = -b / (3a), find y-coordinate.',
          'Check general shape: if a > 0, graph starts bottom-left (rises, turns, falls, turns, rises). Plot all intercepts and turning points, then connect with a smooth cubic curve.',
        ],
      },
    ],
  },

  probability: {
    topicId: 'probability',
    title: 'Probability & Counting Principles',
    paper: 'P1',
    examWeightMarks: 15,
    formulas: [
      {
        name: 'Addition Rule of Probability',
        latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
        description: 'Applies to any two events A and B. For mutually exclusive events, P(A ∩ B) = 0.',
      },
      {
        name: 'Independent Events Criterion',
        latex: 'P(A \\cap B) = P(A) \\cdot P(B)',
        description: 'Events A and B are statistically independent if and only if P(A ∩ B) = P(A) · P(B).',
      },
      {
        name: 'Complementary Events',
        latex: "P(A') = 1 - P(A)",
        description: 'Probability that event A does NOT occur.',
      },
      {
        name: 'Fundamental Counting Principle (Arrangements with identical items)',
        latex: '\\text{Arrangements} = \\frac{n!}{k_1! \\cdot k_2! \\cdots k_m!}',
        description: 'Number of unique permutations of n objects where items repeat k_1, k_2 times.',
      },
    ],
    topTraps: [
      {
        trap: 'Confusing "Mutually Exclusive" with "Independent".',
        howToAvoid:
          'Mutually exclusive means they CANNOT happen together: P(A ∩ B) = 0. Independent means one does NOT affect the other: P(A ∩ B) = P(A) · P(B). Never confuse the two!',
      },
      {
        trap: 'Permutations of words with repeated letters (e.g. "MATRIC" vs "STUDENT").',
        howToAvoid:
          'If letters repeat, divide by the factorials of repeated frequencies. In "MISSISSIPPI" (11 letters: 4 I\'s, 4 S\'s, 2 P\'s): 11! / (4! · 4! · 2!).',
      },
      {
        trap: 'Double counting probabilities in Venn diagram regions.',
        howToAvoid:
          'P(A only) = P(A) - P(A ∩ B). The value given for P(A) already includes the overlap; remember to subtract the intersection when populating Venn diagrams.',
      },
      {
        trap: 'Calculating probability of items grouped together without multiplying by internal permutations.',
        howToAvoid:
          'Treat grouped items as 1 super-object to arrange (n - k + 1)! objects, THEN multiply by the internal arrangements of the grouped items k!.',
      },
      {
        trap: 'Producing a final probability answer greater than 1 or negative.',
        howToAvoid:
          'All probabilities MUST satisfy 0 ≤ P(E) ≤ 1. If your answer is 1.4 or negative, you made an arithmetic or intersection subtraction error.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Testing whether Two Events A and B are Statistically Independent',
        steps: [
          'Calculate the product P(A) × P(B) using the given or calculated marginal probabilities.',
          'Determine the actual joint probability P(A ∩ B) from the given data (or contingency table / Venn diagram).',
          'Compare the two values: explicitly write out "P(A) × P(B) = ..." and "P(A ∩ B) = ...".',
          'If P(A ∩ B) = P(A) × P(B), conclude: "Since P(A ∩ B) = P(A) · P(B), the events are INDEPENDENT."',
          'If P(A ∩ B) ≠ P(A) × P(B), conclude: "Since P(A ∩ B) ≠ P(A) · P(B), the events are DEPENDENT."',
        ],
      },
      {
        title: 'Counting Principle: Arrangements with Items Grouped Together',
        steps: [
          'Identify the k items that must sit or be placed together.',
          'Bundle these k items into ONE single block (super-item).',
          'Count the remaining items plus the 1 bundled block: N = (total - k) + 1.',
          'Calculate arrangements of the N objects: N!',
          'Calculate internal arrangements of the k items inside the bundle: k!',
          'Multiply together: Total Arrangements = N! × k!',
        ],
      },
    ],
  },

  statistics: {
    topicId: 'statistics',
    title: 'Statistics & Regression',
    paper: 'P2',
    examWeightMarks: 20,
    formulas: [
      {
        name: 'Sample Mean & Standard Deviation',
        latex: '\\bar{x} = \\frac{\\sum x}{n} \\quad \\text{and} \\quad \\sigma = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n}}',
        description: 'Computed directly using CASIO scientific calculator STAT mode (1-VAR).',
      },
      {
        name: 'Least-Squares Regression Line',
        latex: '\\hat{y} = a + bx \\quad \\text{where} \\; b = \\frac{\\sum (x - \\bar{x})(y - \\bar{y})}{\\sum (x - \\bar{x})^2}',
        description: 'Note: In South Africa, a is the y-intercept and b is the slope (on CASIO STAT mode: A is intercept, B is slope).',
      },
      {
        name: 'Correlation Coefficient (r)',
        latex: 'r \\in [-1, 1]',
        description: 'r = 1 (perfect positive), 0.7 ≤ r < 1 (strong positive), r = 0 (no linear relation), r = -1 (perfect negative).',
      },
      {
        name: 'Five-Number Summary & Outlier Rule',
        latex: '\\text{Outlier} < Q_1 - 1.5 \\times \\text{IQR} \\quad \\text{or} \\quad \\text{Outlier} > Q_3 + 1.5 \\times \\text{IQR}',
        description: 'IQR = Q_3 - Q_1. Used to identify suspect data points on box-and-whisker plots.',
      },
    ],
    topTraps: [
      {
        trap: 'Swapping a and b in the regression line equation ŷ = a + bx.',
        howToAvoid:
          'In South African CAPS: ŷ = a + bx where a = y-intercept and b = gradient/slope. Do NOT write y = mx + c with m and c swapped.',
      },
      {
        trap: 'Plotting an Ogive (Cumulative Frequency curve) at midpoints instead of upper class boundaries.',
        howToAvoid:
          'Ogives MUST be plotted at the UPPER limit of each interval against cumulative frequency, and grounded at the lower limit of the first interval at y = 0.',
      },
      {
        trap: 'Claiming an extrapolated prediction is "reliable".',
        howToAvoid:
          'Interpolation (predicting within given x-data domain) is reliable if correlation r is strong. Extrapolation (predicting outside given range) is UNRELIABLE because trend may change.',
      },
      {
        trap: 'Misidentifying Skewness on Box-and-Whisker or from Mean vs Median.',
        howToAvoid:
          'Mean > Median ⟹ Positively skewed (skewed right, long tail on right). Mean < Median ⟹ Negatively skewed (skewed left, long tail on left). Mean ≈ Median ⟹ Symmetrical.',
      },
      {
        trap: 'Confusing standard deviation σ with variance σ².',
        howToAvoid:
          'Standard deviation is σ (in original units). Variance is σ² (squared units). On CASIO calculators, read σx (or σxn), not s_x.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Calculator Linear Regression Workflow (CASIO fx-82ZA / fx-991ZA)',
        steps: [
          'Press MODE ⟹ 2: STAT ⟹ 2: A + BX.',
          'Enter x-data into the X column and y-data into the Y column. Press AC when complete.',
          'Press SHIFT ⟹ 1 [STAT] ⟹ 5: Reg.',
          'Press 1: A ⟹ = to get the y-intercept a.',
          'Press SHIFT ⟹ 1 [STAT] ⟹ 5: Reg ⟹ 2: B ⟹ = to get slope b.',
          'Press SHIFT ⟹ 1 [STAT] ⟹ 5: Reg ⟹ 3: r ⟹ = to get correlation coefficient r.',
          'Write down regression equation rounded to two decimals: ŷ = a + bx.',
        ],
      },
      {
        title: 'Constructing and Interpreting a Cumulative Frequency Ogive',
        steps: [
          'Add a "Cumulative Frequency" column by computing running totals of frequencies.',
          'Identify plot coordinates: (Upper class boundary, Cumulative Frequency).',
          'Ground the curve at (Lower boundary of 1st interval, 0).',
          'Plot all points and connect with a smooth, continuous S-curve (do NOT use a ruler).',
          'To find Median: locate n/2 on vertical axis, draw horizontal dashed line to curve, read down to horizontal axis.',
          'To find Q₁: locate 0.25n on vertical axis; To find Q₃: locate 0.75n on vertical axis.',
        ],
      },
    ],
  },

  analytical_geometry: {
    topicId: 'analytical_geometry',
    title: 'Analytical Geometry',
    paper: 'P2',
    examWeightMarks: 40,
    formulas: [
      {
        name: 'Distance Formula',
        latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
        description: 'Length of segment joining (x_1, y_1) and (x_2, y_2).',
      },
      {
        name: 'Midpoint Formula',
        latex: 'M\\left(\\frac{x_1 + x_2}{2} ; \\frac{y_1 + y_2}{2}\\right)',
        description: 'Coordinates of midpoint M bisecting segment AB.',
      },
      {
        name: 'Gradient & Perpendicular Line Condition',
        latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} \\quad \\text{and} \\quad m_1 \\cdot m_2 = -1 \\iff L_1 \\perp L_2',
        description: 'Parallel lines have m_1 = m_2; perpendicular lines have negative reciprocal gradients m_2 = -1/m_1.',
      },
      {
        name: 'Angle of Inclination',
        latex: 'm = \\tan \\theta \\quad (\\theta \\in [0^\\circ, 180^\\circ))',
        description: 'Angle θ with positive x-axis. If m > 0, θ = arctan(m); If m < 0, θ = 180° - arctan(|m|).',
      },
      {
        name: 'Circle with Centre (a, b) and Radius r',
        latex: '(x - a)^2 + (y - b)^2 = r^2',
        description: 'Standard form circle. If centre is origin (0, 0): x^2 + y^2 = r^2.',
      },
      {
        name: 'Tangent to Circle Gradient Condition',
        latex: 'm_{\\text{tangent}} = -\\frac{1}{m_{\\text{radius}}} \\quad (\\text{rad } \\perp \\text{ tan})',
        description: 'Radius to point of contact is perpendicular to the tangent line.',
      },
    ],
    topTraps: [
      {
        trap: 'Obtuse inclination angle calculation error when gradient is negative (m < 0).',
        howToAvoid:
          'When m < 0, calculator tan⁻¹ gives a negative angle. You MUST add 180°: θ = 180° + tan⁻¹(m) = 180° - ref angle.',
      },
      {
        trap: 'Confusing r² with r in circle equation (x - 3)² + (y + 2)² = 25.',
        howToAvoid:
          'The right-hand side is r²! Here r² = 25 ⟹ radius r = 5, NOT 25. Always take the square root.',
      },
      {
        trap: 'Forgetting to provide the geometric reason (tan ⊥ rad) when finding tangent gradient.',
        howToAvoid:
          'When inverting the radius gradient m_tan = -1/m_rad, DBE memos award 1 mark specifically for writing the reason: (tan ⊥ rad).',
      },
      {
        trap: 'Signs of centre coordinates in circle equation (x - a)² + (y - b)² = r².',
        howToAvoid:
          'In (x + 4)² + (y - 7)² = 36, centre is (-4, 7), NOT (+4, -7). Flip the signs inside the brackets.',
      },
      {
        trap: 'Incorrect order of subtraction in gradient formula: m = (y₂ - y₁) / (x₁ - x₂).',
        howToAvoid:
          'Keep coordinate order consistent: (y₂ - y₁) / (x₂ - x₁). Inverting the denominator flips the sign of your slope.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Determining the Equation of a Tangent to a Circle at Point P(x₁, y₁)',
        steps: [
          'Find centre of circle C(a, b) from circle equation (x - a)² + (y - b)² = r².',
          'Calculate radius gradient m_CP = (y₁ - b) / (x₁ - a).',
          'Calculate tangent gradient: m_tan = -1 / m_CP, and state reason: (rad ⊥ tan).',
          'Substitute m_tan and contact point P(x₁, y₁) into point-slope equation: y - y₁ = m_tan(x - x₁).',
          'Simplify to standard slope-intercept form: y = mx + c.',
        ],
      },
      {
        title: 'Completing the Square for General Circle Equation: x² + y² + Dx + Ey + F = 0',
        steps: [
          'Group x and y terms: (x² + Dx) + (y² + Ey) = -F.',
          'Add (D/2)² and (E/2)² to both sides of the equation.',
          'Factorise into perfect squares: (x + D/2)² + (y + E/2)² = -F + (D/2)² + (E/2)²',
          'Read off centre: (-D/2, -E/2).',
          'Calculate radius: r = √[-F + (D/2)² + (E/2)²], ensuring r > 0.',
        ],
      },
    ],
  },

  trigonometry: {
    topicId: 'trigonometry',
    title: 'Trigonometry',
    paper: 'P2',
    examWeightMarks: 50,
    formulas: [
      {
        name: 'Quotient & Square Identities',
        latex: '\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta} \\quad \\text{and} \\quad \\sin^2 \\theta + \\cos^2 \\theta = 1',
        description: 'Fundamental identities. Also \\sin^2 \\theta = 1 - \\cos^2 \\theta and \\cos^2 \\theta = 1 - \\sin^2 \\theta.',
      },
      {
        name: 'Compound Angle Formulas',
        latex: '\\cos(\\alpha \\pm \\beta) = \\cos\\alpha\\cos\\beta \\mp \\sin\\alpha\\sin\\beta \\quad \\text{and} \\quad \\sin(\\alpha \\pm \\beta) = \\sin\\alpha\\cos\\beta \\pm \\cos\\alpha\\sin\\beta',
        description: 'Notice that cos(α + β) has a MINUS sign between products, whereas sin keeps matching sign.',
      },
      {
        name: 'Double Angle Formulas',
        latex: '\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha \\quad \\text{and} \\quad \\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha = 2\\cos^2\\alpha - 1 = 1 - 2\\sin^2\\alpha',
        description: 'Three alternate forms for cos 2α. Choose the form that cancels constants or matches other terms.',
      },
      {
        name: 'Sine Rule (in any triangle ABC)',
        latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
        description: 'Use when you know an opposite side-angle pair.',
      },
      {
        name: 'Cosine Rule & Area Rule',
        latex: 'a^2 = b^2 + c^2 - 2bc\\cos A \\quad \\text{and} \\quad \\text{Area} = \\frac{1}{2}ab\\sin C',
        description: 'Cosine rule used for SAS or SSS. Area rule requires two sides and the included angle.',
      },
    ],
    topTraps: [
      {
        trap: 'Sign error in compound cosine formula: writing cos(α + β) = cos α cos β + sin α sin β.',
        howToAvoid:
          'Cosine FLIPS the sign! cos(α + β) = cos α cos β - sin α sin β; cos(α - β) = cos α cos β + sin α sin β.',
      },
      {
        trap: 'Forgetting the + k · 360° or + k · 180° and k ∈ ℤ in general solutions.',
        howToAvoid:
          'Always add + k · 360° for sin and cos, and + k · 180° for tan. State "k ∈ ℤ" at the end, or lose 1 mark.',
      },
      {
        trap: 'Dividing both sides by sin x or cos x in equations like sin 2x = sin x.',
        howToAvoid:
          'Never divide by a trig ratio! You delete valid solutions where that ratio is 0. Expand double angle: 2 sin x cos x - sin x = 0 ⟹ sin x(2 cos x - 1) = 0.',
      },
      {
        trap: 'Using the incorrect quadrant sign for co-functions with 90° ± θ.',
        howToAvoid:
          'Determine the sign from the ORIGINAL ratio in that quadrant: sin(90° + θ) = +cos θ (sin is positive in Q2); cos(90° + θ) = -sin θ (cos is negative in Q2).',
      },
      {
        trap: 'In 2D/3D Trig, confusing the horizontal ground plane with vertical plane triangles.',
        howToAvoid:
          'Sketch vertical triangles (right-angled) separately from ground triangles (usually non-right-angled). Use basic SOH-CAH-TOA vertically, and Sine/Cosine rule on the ground.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Determining General Solutions of Trigonometric Equations',
        steps: [
          'Isolate the trigonometric function: e.g. sin θ = c, cos θ = c, or tan θ = c.',
          'Find reference angle: ref = sin⁻¹(|c|), cos⁻¹(|c|), or tan⁻¹(|c|) (always using positive value).',
          'For sin θ = c: Quad 1 or 2 (if c > 0) or Quad 3 or 4 (if c < 0): θ = ref + k · 360° OR θ = (180° - ref) + k · 360°, k ∈ ℤ.',
          'For cos θ = c: θ = ±ref + k · 360°, k ∈ ℤ.',
          'For tan θ = c: θ = ref + k · 180°, k ∈ ℤ (period of tan is 180°!).',
          'If question asks for solutions in a specific interval [e.g. -180°, 180°], substitute integer values of k (k = 0, ±1, ±2) to list all valid angles.',
        ],
      },
      {
        title: '3D Trigonometry Problem Solving Strategy',
        steps: [
          'Identify all distinct triangles in the 3D figure. Highlight vertical right-angled triangles and horizontal ground triangles.',
          'Locate the COMMON LINK SIDE shared between the vertical triangle (containing height h) and ground triangle.',
          'In the vertical right-angled triangle, express the common side in terms of h using basic trig ratios: e.g. side = h / tan θ.',
          'In the horizontal triangle, apply the Sine Rule (if angle-side pair known) or Cosine Rule (if two sides + included angle known).',
          'Substitute the expression for the common side into the ground equation and solve for h or the required relation.',
        ],
      },
    ],
  },

  euclidean_geometry: {
    topicId: 'euclidean_geometry',
    title: 'Euclidean Geometry',
    paper: 'P2',
    examWeightMarks: 40,
    formulas: [
      {
        name: 'Circle Theorems Summary (Grade 11)',
        latex: '\\angle\\text{ at centre} = 2\\angle\\text{ at circumf} \\quad \\text{and} \\quad \\angle\\text{ in semi-circle} = 90^\\circ',
        description: 'Angles subtended by same arc in centre vs circumference, and diameter subtending right angle.',
      },
      {
        name: 'Cyclic Quadrilateral Invariants',
        latex: '\\hat{A} + \\hat{C} = 180^\\circ \\quad (\\text{opp } \\angle\\text{s supp}) \\quad \\text{and} \\quad \\text{ext } \\angle = \\text{int opp } \\angle',
        description: 'Opposite interior angles add to 180°; exterior angle equals opposite interior angle.',
      },
      {
        name: 'Tangent-Chord Theorem',
        latex: '\\angle(\\text{tangent, chord}) = \\angle(\\text{alternate segment})',
        description: 'Angle between tangent and chord equals angle subtended by chord in alternate segment.',
      },
      {
        name: 'Proportionality & Triangle Similarity (Grade 12)',
        latex: '\\triangle ABC \\parallel\\parallel\\parallel \\triangle DEF \\implies \\frac{AB}{DE} = \\frac{BC}{EF} = \\frac{AC}{DF}',
        description: 'Equiangular triangles have proportional corresponding sides (||| △s). Line parallel to one side divides others in proportion.',
      },
    ],
    topTraps: [
      {
        trap: 'Omitting the official acceptable abbreviated reason or writing invented phrasing.',
        howToAvoid:
          'Every geometric statement MUST be paired with an official CAPS reason from the DBE guidelines (e.g. "tan-chord thm", "opp ∠s of cyclic quad", "line from centre ⊥ chord"). No reason = NO mark!',
      },
      {
        trap: 'Assuming what needs to be proved (circular reasoning).',
        howToAvoid:
          'If the question asks "Prove that ABCD is a cyclic quad", you CANNOT use cyclic quad properties yet! You must prove opp ∠s = 180° or ext ∠ = int opp ∠ first.',
      },
      {
        trap: 'Incorrect letter ordering when stating similar triangles.',
        howToAvoid:
          'Letters MUST correspond in equal angle order: if Â = D̂, B̂ = Ê, Ĉ = F̂, write △ABC ||| △DEF. If you write △ABC ||| △EDF, all subsequent ratio marks are forfeited.',
      },
      {
        trap: 'Stating parallel line reasons without naming the parallel lines.',
        howToAvoid:
          'Always state the lines: "alt ∠s; AB ∥ CD" or "corresp ∠s; PQ ∥ RS". Writing just "alt ∠s" loses the mark in NSC marking.',
      },
      {
        trap: 'Confusing tangent-chord theorem with angles in the same segment.',
        howToAvoid:
          'Tangent-chord requires a TANGENT line touching the circle at the vertex of the angle. Angles in same segment are subtended by chords inside the circle.',
      },
    ],
    stepByStepRecipes: [
      {
        title: 'Proving that a Quadrilateral is Cyclic',
        steps: [
          'Method 1 (Converse Opp Angles): Show that one pair of opposite interior angles adds to 180°: Â + Ĉ = 180° ⟹ conclusion reason: (opp ∠s supp).',
          'Method 2 (Converse Ext Angle): Show that the exterior angle equals the opposite interior angle ⟹ conclusion reason: (ext ∠ = int opp ∠).',
          'Method 3 (Converse Same Segment): Show that a line segment subtends equal angles at two other vertices on the same side ⟹ conclusion reason: (line subtends equal ∠s).',
        ],
      },
      {
        title: 'Proving Two Triangles are Similar and Deducing Proportional Side Products',
        steps: [
          'State triangles: "In △ABC and △DEF:".',
          'List 3 pairs of equal angles with acceptable reasons:',
          '1. Â = D̂ [Reason 1]',
          '2. B̂ = Ê [Reason 2]',
          '3. Ĉ = F̂ [sum of ∠s in △]',
          'Conclude similarity: "∴ △ABC ||| △DEF [∠∠∠ or equiangular △s]".',
          'Write down proportional side ratios: AB / DE = BC / EF = AC / DF [sides in prop].',
          'Cross-multiply the appropriate pair of ratios to prove the required product identity (e.g. AB · EF = BC · DE).',
        ],
      },
    ],
    geometryReasons: GEOMETRY_REASONS.map((r) => ({
      shorthand: r.acceptableShortReason,
      fullMeaning: `${r.fullTheorem} (Grade ${r.grade})`,
    })),
  },
};

export const TOPIC_CHEAT_SHEETS = CHEAT_SHEETS;
export const CHEAT_SHEET_LIST: TopicCheatSheet[] = Object.values(CHEAT_SHEETS);

export function getCheatSheet(topicId: TopicId): TopicCheatSheet {
  return CHEAT_SHEETS[topicId];
}

export function getCheatSheetsForPaper(paper: PaperId): TopicCheatSheet[] {
  return CHEAT_SHEET_LIST.filter((sheet) => sheet.paper === paper);
}

/**
 * ---------------------------------------------------------------------------
 * 20 NSC Exam Archetypes & Mock Exam Blueprints
 * ---------------------------------------------------------------------------
 */
export interface ExamArchetype {
  id: string;
  name: string;
  year: number;
  session: string;
  distinctionFeature: string;
}

export const EXAM_ARCHETYPES: ExamArchetype[] = [
  { id: 'EX-01', name: 'DBE NSC November 2024 Standard', year: 2024, session: 'Nov', distinctionFeature: 'Cubic graph tangents & 3D trig with common diagonal' },
  { id: 'EX-02', name: 'DBE NSC November 2023 Standard', year: 2023, session: 'Nov', distinctionFeature: 'Quadratic inequality with surd boundary & circle tangent' },
  { id: 'EX-03', name: 'DBE NSC November 2022 Standard', year: 2022, session: 'Nov', distinctionFeature: 'Circle geometry with coordinate link & deferred annuity' },
  { id: 'EX-04', name: 'DBE NSC November 2021 Standard', year: 2021, session: 'Nov', distinctionFeature: 'Logarithmic inverse & nested similarity theorems' },
  { id: 'EX-05', name: 'DBE SC May/June 2024 Standard', year: 2024, session: 'Jun', distinctionFeature: 'Sinking fund inflation & bivariate outlier removal' },
  { id: 'EX-06', name: 'DBE SC May/June 2023 Standard', year: 2023, session: 'Jun', distinctionFeature: 'Permutations with vowels grouped & open box optimization' },
  { id: 'EX-07', name: 'Gauteng Prelim 2024 Benchmark', year: 2024, session: 'Prelim', distinctionFeature: 'Negative second difference patterns & 3D pyramid trig' },
  { id: 'EX-08', name: 'Western Cape Prelim 2024 Benchmark', year: 2024, session: 'Prelim', distinctionFeature: "Derivative f'(x) curve deduction & double tangent-chord" },
  { id: 'EX-09', name: 'KZN Prelim 2024 Benchmark', year: 2024, session: 'Prelim', distinctionFeature: 'Intersecting circles common chord & trig factoring' },
  { id: 'EX-10', name: 'Free State Prelim 2024 Benchmark', year: 2024, session: 'Prelim', distinctionFeature: 'Exponential factorisation & conical tank rate of change' },
  { id: 'EX-11', name: 'Eastern Cape Prelim 2024 Benchmark', year: 2024, session: 'Prelim', distinctionFeature: 'Compound identity proofs & ogive percentile read-offs' },
  { id: 'EX-12', name: 'DBE NSC November 2020 Benchmark', year: 2020, session: 'Nov', distinctionFeature: 'Hyperbola symmetry lines & tree diagram replacement' },
  { id: 'EX-13', name: 'DBE SC May/June 2022 Benchmark', year: 2022, session: 'Jun', distinctionFeature: 'Interleaved sequences & bond interest rate shift' },
  { id: 'EX-14', name: 'Gauteng Prelim 2023 Benchmark', year: 2023, session: 'Prelim', distinctionFeature: 'Composite functions & circle touching both axes' },
  { id: 'EX-15', name: 'Western Cape Prelim 2023 Benchmark', year: 2023, session: 'Prelim', distinctionFeature: 'Cylinder inscribed in sphere & similarity tangent-diameter' },
  { id: 'EX-16', name: 'KZN Prelim 2023 Benchmark', year: 2023, session: 'Prelim', distinctionFeature: 'Cyclic quad exterior angles & 3-set Venn diagram' },
  { id: 'EX-17', name: 'DBE SC May/June 2021 Benchmark', year: 2021, session: 'Jun', distinctionFeature: 'Extra monthly payments & trade-in sinking fund' },
  { id: 'EX-18', name: 'IEB Benchmark Style A', year: 2024, session: 'IEB', distinctionFeature: 'Parameter k nature of roots & intersecting line angles' },
  { id: 'EX-19', name: 'IEB Benchmark Style B', year: 2023, session: 'IEB', distinctionFeature: 'Applied calculus kinematics & half-angle identities' },
  { id: 'EX-20', name: 'National Grand Mastery Benchmark', year: 2024, session: 'Mastery', distinctionFeature: 'Level 4 synthesis: cubic roots, 3D mast, common chord' },
];

export interface BlueprintQuestionSpec {
  qNum: number;
  topic: TopicId;
  marks: number;
  cognitiveLevel: CognitiveLevel;
  title: string;
  defaultPastPaperId?: string;
  subType?: string;
}

export const P1_BLUEPRINT: BlueprintQuestionSpec[] = [
  { qNum: 1, topic: 'algebra', marks: 25, cognitiveLevel: 'L2', title: 'Algebra, Equations & Inequalities', defaultPastPaperId: 'PP-ALG-01' },
  { qNum: 2, topic: 'patterns', marks: 12, cognitiveLevel: 'L1', title: 'Arithmetic Sequences & General Term', defaultPastPaperId: 'PP-PAT-01' },
  { qNum: 3, topic: 'patterns', marks: 13, cognitiveLevel: 'L3', title: 'Geometric Series & Quadratic Patterns', defaultPastPaperId: 'PP-PAT-02' },
  { qNum: 4, topic: 'functions', marks: 16, cognitiveLevel: 'L2', title: 'Hyperbolic & Exponential Functions', defaultPastPaperId: 'PP-FUN-02' },
  { qNum: 5, topic: 'functions', marks: 19, cognitiveLevel: 'L3', title: 'Parabola, Turning Points & Inverses', defaultPastPaperId: 'PP-FUN-01' },
  { qNum: 6, topic: 'finance', marks: 15, cognitiveLevel: 'L2', title: 'Financial Mathematics & Sinking Funds', defaultPastPaperId: 'PP-FIN-01' },
  { qNum: 7, topic: 'calculus', marks: 13, cognitiveLevel: 'L2', title: 'Calculus: First Principles & Differentiation Rules', defaultPastPaperId: 'PP-CALC-01' },
  { qNum: 8, topic: 'calculus', marks: 13, cognitiveLevel: 'L3', title: 'Cubic Functions & Stationary Points', defaultPastPaperId: 'PP-CALC-02' },
  { qNum: 9, topic: 'calculus', marks: 9, cognitiveLevel: 'L4', title: 'Calculus Optimization Problem', defaultPastPaperId: 'PP-CALC-03' },
  { qNum: 10, topic: 'probability', marks: 8, cognitiveLevel: 'L2', title: 'Probability & Contingency Tables', defaultPastPaperId: 'PP-PROB-01' },
  { qNum: 11, topic: 'probability', marks: 7, cognitiveLevel: 'L3', title: 'Fundamental Counting Principle', defaultPastPaperId: 'PP-PROB-02' },
];

export const P2_BLUEPRINT: BlueprintQuestionSpec[] = [
  { qNum: 1, topic: 'statistics', marks: 9, cognitiveLevel: 'L1', title: 'Univariate Statistics & Box-and-Whisker', defaultPastPaperId: 'PP-STAT-01' },
  { qNum: 2, topic: 'statistics', marks: 11, cognitiveLevel: 'L2', title: 'Bivariate Regression & Correlation Line', defaultPastPaperId: 'PP-STAT-02' },
  { qNum: 3, topic: 'analytical_geometry', marks: 20, cognitiveLevel: 'L2', title: 'Analytical Geometry: Lines, Midpoint & Inclination', defaultPastPaperId: 'PP-AG-01' },
  { qNum: 4, topic: 'analytical_geometry', marks: 20, cognitiveLevel: 'L3', title: 'Analytical Geometry: Circles & Tangents', defaultPastPaperId: 'PP-AG-02' },
  { qNum: 5, topic: 'trigonometry', marks: 24, cognitiveLevel: 'L2', title: 'Trigonometry: Identities & General Solutions', defaultPastPaperId: 'PP-TRIG-01' },
  { qNum: 6, topic: 'trigonometry', marks: 10, cognitiveLevel: 'L2', title: 'Trigonometric Graphs & Amplitude', defaultPastPaperId: 'PP-TRIG-02' },
  { qNum: 7, topic: 'trigonometry', marks: 16, cognitiveLevel: 'L3', title: '2D & 3D Non-Right-Angled Trigonometry', defaultPastPaperId: 'PP-TRIG-03' },
  { qNum: 8, topic: 'euclidean_geometry', marks: 12, cognitiveLevel: 'L2', title: 'Euclidean Geometry: Circle Theorems (Centre & Chords)', defaultPastPaperId: 'PP-EUCL-01' },
  { qNum: 9, topic: 'euclidean_geometry', marks: 14, cognitiveLevel: 'L3', title: 'Euclidean Geometry: Cyclic Quads & Tangents', defaultPastPaperId: 'PP-EUCL-02' },
  { qNum: 10, topic: 'euclidean_geometry', marks: 14, cognitiveLevel: 'L4', title: 'Euclidean Geometry: Proportionality & Similarity', defaultPastPaperId: 'PP-EUCL-03' },
];

export function buildMockExamQuestions(paper: PaperId, archetypeId: string = 'EX-01'): Question[] {
  const blueprint = paper === 'P1' ? P1_BLUEPRINT : P2_BLUEPRINT;
  const examQuestions: Question[] = [];

  for (const spec of blueprint) {
    let matchedQ = PAST_PAPER_QUESTIONS.find(
      (q) => q.id === spec.defaultPastPaperId || (q.paper === paper && q.topic === spec.topic && q.cognitiveLevel === spec.cognitiveLevel)
    );

    if (!matchedQ) {
      if (paper === 'P1') {
        matchedQ = generateP1Question(spec.topic, spec.cognitiveLevel);
      } else {
        matchedQ = generateP2Question(spec.topic, spec.cognitiveLevel);
      }
    }

    const qClone: Question = {
      ...matchedQ,
      id: `${archetypeId}-${paper}-Q${spec.qNum}`,
      marks: spec.marks,
      cognitiveLevel: spec.cognitiveLevel,
      nscMemo: {
        ...matchedQ.nscMemo,
        totalMarks: spec.marks,
      },
    };

    examQuestions.push(qClone);
  }

  return examQuestions;
}
