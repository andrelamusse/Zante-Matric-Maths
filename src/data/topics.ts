import type { TopicInfo, TopicId, PaperId } from '../types/curriculum.ts';

export const TOPICS: Record<TopicId, TopicInfo> = {
  algebra: {
    id: 'algebra',
    paper: 'P1',
    name: 'Algebra, Equations & Inequalities',
    shortName: 'Algebra & Equations',
    weightMarks: 25,
    weightTolerance: 3,
    weightPercent: 16.7,
    typicalQuestions: 'Question 1',
    cognitiveTarget: { L1: 4, L2: 10, L3: 8, L4: 3 },
    formulaIds: ['P1-AL-01'],
    description:
      'Quadratic equations, inequalities, simultaneous linear/non-linear systems, surd equations with extraneous checks, and nature of roots (Δ).',
  },
  patterns: {
    id: 'patterns',
    paper: 'P1',
    name: 'Number Patterns, Sequences & Series',
    shortName: 'Sequences & Series',
    weightMarks: 25,
    weightTolerance: 3,
    weightPercent: 16.7,
    typicalQuestions: 'Question 2 & 3',
    cognitiveTarget: { L1: 5, L2: 10, L3: 7, L4: 3 },
    formulaIds: [
      'P1-SQ-01',
      'P1-SQ-02',
      'P1-SQ-03',
      'P1-SQ-04',
      'P1-SQ-05',
      'UN-SQ-01',
    ],
    description:
      'Arithmetic & geometric progressions, quadratic sequences (2a = d₂), sigma notation, and infinite series convergence (-1 < r < 1).',
  },
  functions: {
    id: 'functions',
    paper: 'P1',
    name: 'Functions, Inverses & Graphs',
    shortName: 'Functions & Inverses',
    weightMarks: 35,
    weightTolerance: 3,
    weightPercent: 23.3,
    typicalQuestions: 'Question 4 & 5',
    cognitiveTarget: { L1: 7, L2: 13, L3: 10, L4: 5 },
    formulaIds: ['UN-FN-01'],
    description:
      'Parabolas, hyperbolas, exponentials, logarithmic functions, inverse reflections f⁻¹(x), domain restrictions, and graph inequalities.',
  },
  finance: {
    id: 'finance',
    paper: 'P1',
    name: 'Finance, Growth & Decay',
    shortName: 'Financial Mathematics',
    weightMarks: 15,
    weightTolerance: 3,
    weightPercent: 10.0,
    typicalQuestions: 'Question 6',
    cognitiveTarget: { L1: 2, L2: 6, L3: 5, L4: 2 },
    formulaIds: [
      'P1-FN-01',
      'P1-FN-02',
      'P1-FN-03',
      'P1-FN-04',
      'P1-FN-05',
      'P1-FN-06',
    ],
    description:
      'Compound interest, reducing-balance depreciation, nominal vs effective rates, future & present value annuities, sinking funds, and loan balances.',
  },
  calculus: {
    id: 'calculus',
    paper: 'P1',
    name: 'Differential Calculus',
    shortName: 'Calculus',
    weightMarks: 35,
    weightTolerance: 3,
    weightPercent: 23.3,
    typicalQuestions: 'Question 7, 8 & 9',
    cognitiveTarget: { L1: 7, L2: 13, L3: 10, L4: 5 },
    formulaIds: ['P1-DC-01', 'UN-DC-01'],
    description:
      'First principles derivatives, power rule shortcuts, tangents to curves, cubic polynomials, stationary points, inflection, and optimization.',
  },
  probability: {
    id: 'probability',
    paper: 'P1',
    name: 'Probability & Counting Principles',
    shortName: 'Probability & Counting',
    weightMarks: 15,
    weightTolerance: 3,
    weightPercent: 10.0,
    typicalQuestions: 'Question 10 & 11',
    cognitiveTarget: { L1: 3, L2: 5, L3: 5, L4: 2 },
    formulaIds: ['UN-PR-01', 'UN-PR-02'],
    description:
      'Venn diagrams, independent & mutually exclusive events, contingency tables, tree diagrams, and fundamental counting principle arrangements.',
  },
  statistics: {
    id: 'statistics',
    paper: 'P2',
    name: 'Statistics & Regression',
    shortName: 'Statistics',
    weightMarks: 20,
    weightTolerance: 3,
    weightPercent: 13.3,
    typicalQuestions: 'Question 1 & 2',
    cognitiveTarget: { L1: 4, L2: 8, L3: 6, L4: 2 },
    formulaIds: ['P2-ST-01', 'P2-ST-02', 'P2-ST-03'],
    description:
      'Five-number summary, box-and-whisker plots, cumulative frequency ogives, least-squares regression line (ŷ = a + bx), and correlation r.',
  },
  analytical_geometry: {
    id: 'analytical_geometry',
    paper: 'P2',
    name: 'Analytical Geometry',
    shortName: 'Analytical Geometry',
    weightMarks: 40,
    weightTolerance: 3,
    weightPercent: 26.7,
    typicalQuestions: 'Question 3 & 4',
    cognitiveTarget: { L1: 8, L2: 14, L3: 12, L4: 6 },
    formulaIds: [
      'P2-AG-01',
      'P2-AG-02',
      'P2-AG-03',
      'P2-AG-04',
      'P2-AG-05',
      'P2-AG-06',
      'P2-AG-07',
      'UN-AG-01',
    ],
    description:
      'Distance, midpoint, gradient, inclination (tan θ = m), circle equations (x - a)² + (y - b)² = r², and circle tangent lines (tan ⊥ rad).',
  },
  trigonometry: {
    id: 'trigonometry',
    paper: 'P2',
    name: 'Trigonometry',
    shortName: 'Trigonometry',
    weightMarks: 50,
    weightTolerance: 3,
    weightPercent: 33.3,
    typicalQuestions: 'Question 5, 6 & 7',
    cognitiveTarget: { L1: 10, L2: 18, L3: 15, L4: 7 },
    formulaIds: [
      'P2-TR-01',
      'P2-TR-02',
      'P2-TR-03',
      'P2-TR-04',
      'P2-TR-05',
      'P2-TR-06',
      'P2-TR-07',
      'P2-TR-08',
      'P2-TR-09',
      'P2-TR-10',
      'P2-TR-11',
      'UN-TR-01',
    ],
    description:
      'CAST reductions, co-functions, quotient/square identities, compound & double angles, general solutions, trig graphs, and 2D/3D Sine/Cosine rules.',
  },
  euclidean_geometry: {
    id: 'euclidean_geometry',
    paper: 'P2',
    name: 'Euclidean Geometry',
    shortName: 'Euclidean Geometry',
    weightMarks: 40,
    weightTolerance: 3,
    weightPercent: 26.7,
    typicalQuestions: 'Question 8, 9 & 10',
    cognitiveTarget: { L1: 8, L2: 14, L3: 12, L4: 6 },
    formulaIds: [],
    description:
      'Grade 11 Circle theorems (chords, subtended angles, cyclic quads, tangents) and Grade 12 Proportionality & Triangle Similarity (|||).',
  },
};

export const PAPER_1_TOPICS: TopicId[] = [
  'algebra',
  'patterns',
  'functions',
  'finance',
  'calculus',
  'probability',
];

export const PAPER_2_TOPICS: TopicId[] = [
  'statistics',
  'analytical_geometry',
  'trigonometry',
  'euclidean_geometry',
];

export function getTopicsForPaper(paper: PaperId): TopicInfo[] {
  const ids = paper === 'P1' ? PAPER_1_TOPICS : PAPER_2_TOPICS;
  return ids.map((id) => TOPICS[id]);
}

export function getTotalMarksForPaper(paper: PaperId): number {
  return getTopicsForPaper(paper).reduce((sum, t) => sum + t.weightMarks, 0);
}
