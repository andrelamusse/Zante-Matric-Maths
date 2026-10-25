export type PaperId = 'P1' | 'P2';

export type CognitiveLevel = 'L1' | 'L2' | 'L3' | 'L4';

export type TopicId =
  | 'algebra'
  | 'patterns'
  | 'functions'
  | 'finance'
  | 'calculus'
  | 'probability'
  | 'statistics'
  | 'analytical_geometry'
  | 'trigonometry'
  | 'euclidean_geometry';

export interface QuestionDistractor {
  id: string;
  latex: string;
  explanation: string;
  isCorrect: boolean;
}

export interface QuestionStep {
  stepLatex: string;
  tickAllocation: string;
}

export interface QuestionMemo {
  steps: QuestionStep[];
  totalMarks: number;
}

export interface SubQuestion {
  id: string;
  partNumber: string; // e.g. "1.1", "1.2", "1.3"
  marks: number;
  questionLatex: string;
  distractors: QuestionDistractor[];
  correctAnswerId: string;
  correctIndex?: number;
  zanteVibeCheck: string;
  nscMemo: QuestionMemo;
  formulaRefId?: string;
}

export interface Question {
  id: string;
  paper: PaperId;
  topic: TopicId;
  cognitiveLevel: CognitiveLevel;
  marks: number;
  questionLatex: string;
  stemLatex?: string;
  svgDiagramType?: string;
  svgDiagramParams?: Record<string, any>;
  distractors: QuestionDistractor[];
  correctAnswerId: string;
  correctIndex?: number;
  zanteVibeCheck: string;
  nscMemo: QuestionMemo;
  formulaRefId?: string;
  subQuestions?: SubQuestion[];
}

export interface TopicCheatSheet {
  topicId: TopicId;
  title: string;
  paper: PaperId;
  examWeightMarks: number;
  formulas: Array<{ name: string; latex: string; description: string }>;
  topTraps: Array<{ trap: string; howToAvoid: string }>;
  stepByStepRecipes: Array<{ title: string; steps: string[] }>;
  geometryReasons?: Array<{ shorthand: string; fullMeaning: string }>;
}

export interface TopicInfo {
  id: TopicId;
  paper: PaperId;
  name: string;
  shortName: string;
  weightMarks: number;
  weightTolerance: number;
  weightPercent: number;
  typicalQuestions: string;
  cognitiveTarget: {
    L1: number;
    L2: number;
    L3: number;
    L4: number;
  };
  formulaIds: string[];
  description: string;
}

export interface FormulaItem {
  id: string;
  paper: PaperId;
  topicId: TopicId;
  category: string;
  name: string;
  latex: string;
  description: string;
  isOfficialDBE: boolean;
  usageNotes?: string;
}

export interface GeometryReason {
  id: string;
  category:
    | 'lines_angles'
    | 'triangles_polygons'
    | 'circles_chords'
    | 'circles_cyclic'
    | 'circles_tangents'
    | 'proportionality_similarity';
  fullTheorem: string;
  acceptableShortReason: string;
  grade: 8 | 9 | 10 | 11 | 12;
}
