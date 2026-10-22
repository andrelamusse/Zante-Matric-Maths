import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  CHEAT_SHEETS,
  CHEAT_SHEET_LIST,
  getCheatSheet,
  getCheatSheetsForPaper,
  EXAM_ARCHETYPES,
  P1_BLUEPRINT,
  P2_BLUEPRINT,
  buildMockExamQuestions,
} from '../src/data/cheatSheets.ts';

import { TOPICS, PAPER_1_TOPICS, PAPER_2_TOPICS } from '../src/data/topics.ts';
import { GEOMETRY_REASONS } from '../src/data/geometryReasons.ts';

function hasBalancedBraces(str) {
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '{') {
      if (i > 0 && str[i - 1] === '\\') {
        // escaped literal brace \{
        continue;
      }
      depth++;
    } else if (ch === '}') {
      if (i > 0 && str[i - 1] === '\\') {
        // escaped literal brace \}
        continue;
      }
      depth--;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

describe('Milestone M4: Studio & Exam Assembler Verification Suite', () => {
  // =========================================================================
  // 1. One-Pager Cheat Sheets Completeness & Integrity
  // =========================================================================
  describe('One-Pager Cheat Sheets (All 10 CAPS Topics)', () => {
    const allTopicIds = [
      'algebra',
      'patterns',
      'functions',
      'finance',
      'calculus',
      'probability',
      'statistics',
      'analytical_geometry',
      'trigonometry',
      'euclidean_geometry',
    ];

    it('should contain full cheat sheets for all 10 CAPS topics', () => {
      assert.equal(CHEAT_SHEET_LIST.length, 10, 'Must have exactly 10 topic cheat sheets');
      for (const id of allTopicIds) {
        assert.ok(CHEAT_SHEETS[id], `Cheat sheet for topic ${id} must exist in CHEAT_SHEETS map`);
        const sheet = getCheatSheet(id);
        assert.ok(sheet, `getCheatSheet(${id}) must return valid sheet`);
        assert.equal(sheet.topicId, id);
      }
    });

    it('should partition cheat sheets into 6 Paper 1 and 4 Paper 2 sheets', () => {
      const p1Sheets = getCheatSheetsForPaper('P1');
      const p2Sheets = getCheatSheetsForPaper('P2');
      assert.equal(p1Sheets.length, 6, 'Paper 1 must have 6 cheat sheets');
      assert.equal(p2Sheets.length, 4, 'Paper 2 must have 4 cheat sheets');

      for (const p1 of p1Sheets) {
        assert.equal(p1.paper, 'P1');
        assert.ok(PAPER_1_TOPICS.includes(p1.topicId));
      }
      for (const p2 of p2Sheets) {
        assert.equal(p2.paper, 'P2');
        assert.ok(PAPER_2_TOPICS.includes(p2.topicId));
      }
    });

    it('should verify exam weight marks sum to 150m for P1 and 150m for P2', () => {
      const p1TotalMarks = getCheatSheetsForPaper('P1').reduce((sum, s) => sum + s.examWeightMarks, 0);
      const p2TotalMarks = getCheatSheetsForPaper('P2').reduce((sum, s) => sum + s.examWeightMarks, 0);
      assert.equal(p1TotalMarks, 150, 'Paper 1 cheat sheets total marks must equal 150');
      assert.equal(p2TotalMarks, 150, 'Paper 2 cheat sheets total marks must equal 150');
    });

    it('should verify formula arrays have non-empty metadata and balanced KaTeX braces', () => {
      for (const sheet of CHEAT_SHEET_LIST) {
        assert.ok(sheet.formulas.length >= 3, `Topic ${sheet.topicId} must have at least 3 formulas`);
        for (const f of sheet.formulas) {
          assert.ok(f.name && f.name.length >= 3, `Formula missing name in ${sheet.topicId}`);
          assert.ok(f.latex && f.latex.length > 0, `Formula missing latex in ${sheet.topicId}`);
          assert.ok(f.description && f.description.length >= 10, `Formula missing description in ${sheet.topicId}`);
          assert.ok(hasBalancedBraces(f.latex), `Unbalanced braces in formula ${f.name}: ${f.latex}`);
        }
      }
    });

    it('should verify top examiner traps have clear pitfalls and counter-strategies', () => {
      for (const sheet of CHEAT_SHEET_LIST) {
        assert.ok(sheet.topTraps.length >= 4, `Topic ${sheet.topicId} must have at least 4 top traps`);
        for (const t of sheet.topTraps) {
          assert.ok(t.trap && t.trap.length >= 10, `Trap text too short in ${sheet.topicId}`);
          assert.ok(t.howToAvoid && t.howToAvoid.length >= 15, `HowToAvoid text too short in ${sheet.topicId}`);
        }
      }
    });

    it('should verify step-by-step recipes provide multi-step algorithms', () => {
      for (const sheet of CHEAT_SHEET_LIST) {
        assert.ok(sheet.stepByStepRecipes.length >= 2, `Topic ${sheet.topicId} must have at least 2 recipes`);
        for (const r of sheet.stepByStepRecipes) {
          assert.ok(r.title && r.title.length >= 10, `Recipe missing title in ${sheet.topicId}`);
          assert.ok(r.steps.length >= 3, `Recipe ${r.title} must have at least 3 steps`);
          for (const step of r.steps) {
            assert.ok(step && step.length >= 10, `Recipe step too short in ${r.title}`);
          }
        }
      }
    });

    it('should verify Euclidean Geometry cheat sheet contains official acceptable reasons', () => {
      const euclSheet = CHEAT_SHEETS.euclidean_geometry;
      assert.ok(euclSheet.geometryReasons, 'Euclidean geometry sheet must define geometryReasons');
      assert.ok(euclSheet.geometryReasons.length >= 20, 'Must include >= 20 geometry reasons');

      // Verify essential shorthand reasons exist verbatim
      const reasons = euclSheet.geometryReasons.map((r) => r.shorthand);
      assert.ok(reasons.some((s) => s.includes('line from centre ⊥ chord')));
      assert.ok(reasons.some((s) => s.includes('∠ at centre = 2∠ at circ') || s.includes('∠ at centre = 2 × ∠ at circum')));
      assert.ok(reasons.some((s) => s.includes('∠ in semi-circle')));
      assert.ok(reasons.some((s) => s.includes('∠s in same seg')));
      assert.ok(reasons.some((s) => s.includes('opp ∠s of cyclic quad') || s.includes('opp ∠s of cyclic quad supp') || s.includes('opp ∠s supp')));
      assert.ok(reasons.some((s) => s.includes('tan-chord thm') || s.includes('tan chord thm')));
      assert.ok(reasons.some((s) => s.includes('tan ⊥ radius') || s.includes('tan ⊥ rad')));
      assert.ok(reasons.some((s) => s.includes('line ∥ to one side of △') || s.includes('line ∥ one side of △')));
      assert.ok(reasons.some((s) => s.includes('||| △s') || s.includes('equiangular △s')));
    });

    it('should verify zero NaN or undefined across all serialized cheat sheets', () => {
      const serialized = JSON.stringify(CHEAT_SHEETS);
      assert.ok(!serialized.includes('NaN'), 'Cheat sheets must not contain NaN');
      assert.ok(!serialized.includes('undefined'), 'Cheat sheets must not contain undefined');
    });
  });

  // =========================================================================
  // 2. 20-Exam Simulator Blueprints & Cognitive Calibration
  // =========================================================================
  describe('20-Exam Simulator Blueprints & Cognitive Allocations', () => {
    it('should contain all 20 NSC Exam Archetypes with distinctive themes', () => {
      assert.equal(EXAM_ARCHETYPES.length, 20, 'Must define exactly 20 exam archetypes');
      for (let i = 0; i < 20; i++) {
        const id = `EX-${(i + 1).toString().padStart(2, '0')}`;
        const arch = EXAM_ARCHETYPES.find((a) => a.id === id);
        assert.ok(arch, `Missing archetype ${id}`);
        assert.ok(arch.name && arch.name.length >= 10, `Archetype ${id} missing name`);
        assert.ok(arch.distinctionFeature && arch.distinctionFeature.length >= 15, `Archetype ${id} missing feature`);
      }
    });

    it('should verify Paper 1 Blueprint: 11 questions, 150 marks, CAPS topic distribution', () => {
      assert.equal(P1_BLUEPRINT.length, 11, 'P1 blueprint must have 11 questions');
      const totalMarks = P1_BLUEPRINT.reduce((sum, q) => sum + q.marks, 0);
      assert.equal(totalMarks, 150, 'P1 blueprint total marks must equal 150');

      const topicSums = P1_BLUEPRINT.reduce((acc, q) => {
        acc[q.topic] = (acc[q.topic] || 0) + q.marks;
        return acc;
      }, {});

      assert.equal(topicSums.algebra, 25, 'Algebra must be 25 marks');
      assert.equal(topicSums.patterns, 25, 'Patterns must be 25 marks');
      assert.equal(topicSums.functions, 35, 'Functions must be 35 marks');
      assert.equal(topicSums.finance, 15, 'Finance must be 15 marks');
      assert.equal(topicSums.calculus, 35, 'Calculus must be 35 marks');
      assert.equal(topicSums.probability, 15, 'Probability must be 15 marks');
    });

    it('should verify Paper 2 Blueprint: 10 questions, 150 marks, CAPS topic distribution', () => {
      assert.equal(P2_BLUEPRINT.length, 10, 'P2 blueprint must have 10 questions');
      const totalMarks = P2_BLUEPRINT.reduce((sum, q) => sum + q.marks, 0);
      assert.equal(totalMarks, 150, 'P2 blueprint total marks must equal 150');

      const topicSums = P2_BLUEPRINT.reduce((acc, q) => {
        acc[q.topic] = (acc[q.topic] || 0) + q.marks;
        return acc;
      }, {});

      assert.equal(topicSums.statistics, 20, 'Statistics must be 20 marks');
      assert.equal(topicSums.analytical_geometry, 40, 'Analytical Geometry must be 40 marks');
      assert.equal(topicSums.trigonometry, 50, 'Trigonometry must be 50 marks');
      assert.equal(topicSums.euclidean_geometry, 40, 'Euclidean Geometry must be 40 marks');
    });

    it('should verify cognitive level distribution conforms to NSC targets', () => {
      for (const bp of [P1_BLUEPRINT, P2_BLUEPRINT]) {
        const cog = bp.reduce(
          (acc, q) => {
            acc[q.cognitiveLevel] = (acc[q.cognitiveLevel] || 0) + q.marks;
            return acc;
          },
          { L1: 0, L2: 0, L3: 0, L4: 0 }
        );

        assert.equal(cog.L1 + cog.L2 + cog.L3 + cog.L4, 150);
        assert.ok(cog.L1 >= 9, 'Must have Level 1 knowledge questions');
        assert.ok(cog.L2 >= 50, 'Level 2 routine must be ~35%');
        assert.ok(cog.L3 >= 40, 'Level 3 complex must be ~30%');
        assert.ok(cog.L4 >= 9, 'Level 4 problem solving must be ~15%');
      }
    });
  });

  // =========================================================================
  // 3. Mock Exam Simulation Generation & Grading Flow
  // =========================================================================
  describe('Mock Exam Assembly & Simulation Flow', () => {
    it('should build a complete Paper 1 exam with 11 valid questions and 150 total marks', () => {
      const exam = buildMockExamQuestions('P1', 'EX-01');
      assert.equal(exam.length, 11);
      const totalMarks = exam.reduce((sum, q) => sum + q.marks, 0);
      assert.equal(totalMarks, 150);

      for (let i = 0; i < exam.length; i++) {
        const q = exam[i];
        assert.equal(q.paper, 'P1');
        assert.ok(q.questionLatex && q.questionLatex.length > 5);
        assert.equal(q.distractors.length, 4, 'Must have 4 distractors per question');
        const correctOnes = q.distractors.filter((d) => d.isCorrect);
        assert.equal(correctOnes.length, 1, 'Must have exactly 1 correct distractor');
        assert.equal(q.correctAnswerId, correctOnes[0].id);
        assert.ok(q.nscMemo.steps.length >= 1, 'Must have memo steps');
        assert.equal(q.nscMemo.totalMarks, q.marks, 'Memo total marks must match question marks');
      }
    });

    it('should build a complete Paper 2 exam with 10 valid questions and 150 total marks', () => {
      const exam = buildMockExamQuestions('P2', 'EX-02');
      assert.equal(exam.length, 10);
      const totalMarks = exam.reduce((sum, q) => sum + q.marks, 0);
      assert.equal(totalMarks, 150);

      for (let i = 0; i < exam.length; i++) {
        const q = exam[i];
        assert.equal(q.paper, 'P2');
        assert.ok(q.questionLatex && q.questionLatex.length > 5);
        assert.equal(q.distractors.length, 4, 'Must have 4 distractors');
        const correctOnes = q.distractors.filter((d) => d.isCorrect);
        assert.equal(correctOnes.length, 1, 'Must have exactly 1 correct distractor');
        assert.equal(q.correctAnswerId, correctOnes[0].id);
        assert.ok(q.nscMemo.steps.length >= 1, 'Must have memo steps');
        assert.equal(q.nscMemo.totalMarks, q.marks);
      }
    });

    it('should simulate candidate scoring and verify distinction standards', () => {
      const exam = buildMockExamQuestions('P1', 'EX-01');
      // Candidate answers all correctly
      let candidateMarks = 0;
      for (const q of exam) {
        candidateMarks += q.marks;
      }
      assert.equal(candidateMarks, 150);
      const percentage = (candidateMarks / 150) * 100;
      assert.equal(percentage, 100);
      assert.ok(percentage >= 80, '100% is distinction');

      // Candidate answers with 1 error on 15m question
      candidateMarks -= exam[5].marks; // Q6 finance 15m
      assert.equal(candidateMarks, 135);
      const partialPct = (candidateMarks / 150) * 100;
      assert.equal(partialPct, 90);
      assert.ok(partialPct >= 80, '90% is distinction');
    });

    it('should verify zero NaN or undefined across all 20 archetype mock exams', () => {
      for (const arch of EXAM_ARCHETYPES) {
        const examP1 = buildMockExamQuestions('P1', arch.id);
        const examP2 = buildMockExamQuestions('P2', arch.id);

        const str1 = JSON.stringify(examP1);
        const str2 = JSON.stringify(examP2);

        assert.ok(!str1.includes('NaN'), `P1 Exam ${arch.id} contains NaN`);
        assert.ok(!str1.includes('undefined'), `P1 Exam ${arch.id} contains undefined`);
        assert.ok(!str2.includes('NaN'), `P2 Exam ${arch.id} contains NaN`);
        assert.ok(!str2.includes('undefined'), `P2 Exam ${arch.id} contains undefined`);
      }
    });
  });
});
