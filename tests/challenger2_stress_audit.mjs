import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';

import {
  TOPICS,
  PAPER_1_TOPICS,
  PAPER_2_TOPICS,
  getTopicsForPaper,
  getTotalMarksForPaper,
} from '../src/data/topics.ts';
import {
  FORMULA_SHEET,
  getOfficialFormulas,
  getUnlistedFormulas,
  getFormulaById,
} from '../src/data/formulaSheet.ts';
import {
  GEOMETRY_REASONS,
  getAllGeometryReasons,
} from '../src/data/geometryReasons.ts';
import {
  PAST_PAPER_QUESTIONS,
} from '../src/data/pastPaperQuestions.ts';
import { generateP1Question } from '../src/generators/p1Generators.ts';
import { generateP2Question } from '../src/generators/p2Generators.ts';

function assertStrictKatex(latex, context) {
  assert.ok(typeof latex === 'string', `${context}: must be string`);
  assert.ok(latex.trim().length > 0, `${context}: cannot be empty`);
  assert.ok(!latex.includes('NaN'), `${context}: contains NaN`);
  assert.ok(!latex.includes('undefined'), `${context}: contains undefined`);
  assert.ok(!latex.includes('null'), `${context}: contains null`);

  try {
    katex.renderToString(latex, { throwOnError: true });
  } catch (err) {
    assert.fail(`${context}: KaTeX parse failure: "${err.message}" in raw string: [${latex}]`);
  }
}

test('Challenger 2 Audit 1: Bidirectional Referential Integrity (TOPICS <-> FORMULA_SHEET)', () => {
  const fIds = new Set(FORMULA_SHEET.map((f) => f.id));
  
  // 1. Check all topic formulaIds exist in FORMULA_SHEET
  const missingFromFormulaSheet = [];
  for (const [topicId, topic] of Object.entries(TOPICS)) {
    for (const fid of topic.formulaIds) {
      if (!fIds.has(fid)) {
        missingFromFormulaSheet.push({ topicId, fid });
      }
    }
  }
  assert.equal(
    missingFromFormulaSheet.length,
    0,
    `Found dangling formula IDs in TOPICS: ${JSON.stringify(missingFromFormulaSheet)}`
  );

  // 2. Check each formula in FORMULA_SHEET points to a valid topic and matches its paper
  for (const formula of FORMULA_SHEET) {
    assert.ok(TOPICS[formula.topicId], `Formula ${formula.id} references invalid topicId "${formula.topicId}"`);
    assert.equal(
      formula.paper,
      TOPICS[formula.topicId].paper,
      `Formula ${formula.id} paper (${formula.paper}) does not match topic paper (${TOPICS[formula.topicId].paper})`
    );
  }
});

test('Challenger 2 Audit 2: Past Paper Questions Referential & Data Integrity', () => {
  const fIds = new Set(FORMULA_SHEET.map((f) => f.id));
  const missingFormulaRefs = [];

  for (const q of PAST_PAPER_QUESTIONS) {
    // Referential integrity
    if (q.formulaRefId) {
      if (!fIds.has(q.formulaRefId)) {
        missingFormulaRefs.push({ id: q.id, formulaRefId: q.formulaRefId });
      }
      const formula = getFormulaById(q.formulaRefId);
      assert.ok(formula, `Formula ${q.formulaRefId} not found`);
      assert.equal(
        formula.paper,
        q.paper,
        `Question ${q.id} (Paper ${q.paper}) references formula ${q.formulaRefId} belonging to Paper ${formula.paper}`
      );
    }

    // Distractor integrity: exactly 4 choices, 1 correct, matching correctAnswerId
    assert.equal(q.distractors.length, 4, `Question ${q.id} must have exactly 4 distractors`);
    const correctDistractors = q.distractors.filter((d) => d.isCorrect);
    assert.equal(correctDistractors.length, 1, `Question ${q.id} must have exactly 1 correct distractor`);
    assert.equal(
      correctDistractors[0].id,
      q.correctAnswerId,
      `Question ${q.id} correctAnswerId mismatch with isCorrect flag`
    );

    // Marks check
    assert.equal(q.marks, q.nscMemo.totalMarks, `Question ${q.id} marks != memo totalMarks`);
    let tickCount = 0;
    for (const step of q.nscMemo.steps) {
      const matches = step.tickAllocation.match(/\\checkmark/g);
      assert.ok(matches && matches.length > 0, `Question ${q.id} step missing \\checkmark`);
      tickCount += matches.length;
    }
    assert.equal(tickCount, q.marks, `Question ${q.id} marks (${q.marks}) != tickCount (${tickCount})`);
  }

  assert.equal(missingFormulaRefs.length, 0, `Missing formula references: ${JSON.stringify(missingFormulaRefs)}`);
});

test('Challenger 2 Audit 3: Past Paper Questions KaTeX Strict Parse Audit', () => {
  for (const q of PAST_PAPER_QUESTIONS) {
    assertStrictKatex(q.questionLatex, `PastPaper ${q.id} questionLatex`);
    for (const d of q.distractors) {
      assertStrictKatex(d.latex, `PastPaper ${q.id} distractor ${d.id}`);
    }
    for (let i = 0; i < q.nscMemo.steps.length; i++) {
      const s = q.nscMemo.steps[i];
      assertStrictKatex(s.stepLatex, `PastPaper ${q.id} stepLatex [${i}]`);
      assertStrictKatex(s.tickAllocation, `PastPaper ${q.id} tickAllocation [${i}]`);
    }
  }
});

test('Challenger 2 Audit 4: High-Stress Generator KaTeX & Integrity Audit (1,000 Questions per Paper)', () => {
  const fIds = new Set(FORMULA_SHEET.map((f) => f.id));

  for (let i = 0; i < 1000; i++) {
    const q1 = generateP1Question();
    assert.equal(q1.paper, 'P1');
    assertStrictKatex(q1.questionLatex, `Iter ${i} P1 ${q1.id} questionLatex`);
    assert.equal(q1.distractors.length, 4, `Iter ${i} P1 ${q1.id} must have 4 distractors`);
    for (const d of q1.distractors) {
      assertStrictKatex(d.latex, `Iter ${i} P1 ${q1.id} distractor ${d.id}`);
    }
    for (let sIdx = 0; sIdx < q1.nscMemo.steps.length; sIdx++) {
      const s = q1.nscMemo.steps[sIdx];
      assertStrictKatex(s.stepLatex, `Iter ${i} P1 ${q1.id} stepLatex [${sIdx}]`);
      assertStrictKatex(s.tickAllocation, `Iter ${i} P1 ${q1.id} tickAllocation [${sIdx}]`);
    }
    if (q1.formulaRefId) {
      assert.ok(fIds.has(q1.formulaRefId), `Iter ${i} P1 ${q1.id} references missing formula ${q1.formulaRefId}`);
    }

    const q2 = generateP2Question();
    assert.equal(q2.paper, 'P2');
    assertStrictKatex(q2.questionLatex, `Iter ${i} P2 ${q2.id} questionLatex`);
    assert.equal(q2.distractors.length, 4, `Iter ${i} P2 ${q2.id} must have 4 distractors`);
    for (const d of q2.distractors) {
      assertStrictKatex(d.latex, `Iter ${i} P2 ${q2.id} distractor ${d.id}`);
    }
    for (let sIdx = 0; sIdx < q2.nscMemo.steps.length; sIdx++) {
      const s = q2.nscMemo.steps[sIdx];
      assertStrictKatex(s.stepLatex, `Iter ${i} P2 ${q2.id} stepLatex [${sIdx}]`);
      assertStrictKatex(s.tickAllocation, `Iter ${i} P2 ${q2.id} tickAllocation [${sIdx}]`);
    }
    if (q2.formulaRefId) {
      assert.ok(fIds.has(q2.formulaRefId), `Iter ${i} P2 ${q2.id} references missing formula ${q2.formulaRefId}`);
    }
  }
});
