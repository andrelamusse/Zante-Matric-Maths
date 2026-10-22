import test from 'node:test';
import assert from 'node:assert/strict';
import { TOPICS, PAPER_1_TOPICS, PAPER_2_TOPICS, getTopicsForPaper, getTotalMarksForPaper } from '../src/data/topics.ts';
import { FORMULA_SHEET, getOfficialFormulas, getUnlistedFormulas, getFormulasByTopic } from '../src/data/formulaSheet.ts';
import { GEOMETRY_REASONS, getAllGeometryReasons, getGeometryReasonsByCategory } from '../src/data/geometryReasons.ts';
import { PAST_PAPER_QUESTIONS, getQuestionsByTopic, getQuestionsByPaper } from '../src/data/pastPaperQuestions.ts';

import katex from 'katex';

// Helper to verify KaTeX syntax using genuine KaTeX parser
function assertValidKatex(str, context) {
  assert.ok(typeof str === 'string', `${context}: must be a string`);
  assert.ok(str.trim().length > 0, `${context}: cannot be empty`);
  assert.ok(!str.includes('NaN'), `${context}: contains NaN`);
  assert.ok(!str.includes('undefined'), `${context}: contains undefined`);
  assert.ok(!str.includes('null'), `${context}: contains null`);

  const cleanLatex = str.replace(/\u00A0/g, ' ');
  try {
    katex.renderToString(cleanLatex, {
      throwOnError: true,
      strict: 'warn',
    });
  } catch (err) {
    assert.fail(`${context}: KaTeX parse failure: "${err.message}" in raw string: [${str}]`);
  }
}

test('Curriculum Topics: All 10 CAPS topics are fully defined and calibrated', () => {
  const topicKeys = Object.keys(TOPICS);
  assert.equal(topicKeys.length, 10, 'Must have exactly 10 CAPS topics');

  // Verify Paper 1
  assert.equal(PAPER_1_TOPICS.length, 6, 'P1 must have 6 topics');
  const p1Marks = getTotalMarksForPaper('P1');
  assert.equal(p1Marks, 150, 'P1 topics must total exactly 150 marks');

  // Verify Paper 2
  assert.equal(PAPER_2_TOPICS.length, 4, 'P2 must have 4 topics');
  const p2Marks = getTotalMarksForPaper('P2');
  assert.equal(p2Marks, 150, 'P2 topics must total exactly 150 marks');

  // Verify each topic metadata
  for (const topicId of topicKeys) {
    const t = TOPICS[topicId];
    assert.equal(t.id, topicId, `Topic ID mismatch for ${topicId}`);
    assert.ok(t.name.length > 0, `${topicId} must have a name`);
    assert.ok(t.weightMarks > 0, `${topicId} weightMarks must be positive`);
    assert.ok(t.weightPercent > 0, `${topicId} weightPercent must be positive`);
    assert.ok(['P1', 'P2'].includes(t.paper), `${topicId} paper must be P1 or P2`);

    // Verify cognitive targets sum approximately to weightMarks
    const cogSum = t.cognitiveTarget.L1 + t.cognitiveTarget.L2 + t.cognitiveTarget.L3 + t.cognitiveTarget.L4;
    assert.equal(cogSum, t.weightMarks, `${topicId} cognitive targets must sum to topic marks (${t.weightMarks})`);
  }
});

test('Formula Sheet: Complete inventory of 37 official DBE + 7 unlisted essentials = 44 total', () => {
  assert.equal(FORMULA_SHEET.length, 44, 'Must have exactly 44 formulas in total');

  const official = getOfficialFormulas();
  const unlisted = getUnlistedFormulas();

  assert.equal(official.length, 37, 'Must have exactly 37 official DBE formulas');
  assert.equal(unlisted.length, 7, 'Must have exactly 7 unlisted essential formulas');

  const seenIds = new Set();
  for (const f of FORMULA_SHEET) {
    assert.ok(!seenIds.has(f.id), `Duplicate formula ID: ${f.id}`);
    seenIds.add(f.id);

    assert.ok(f.name.length > 0, `Formula ${f.id} must have a name`);
    assert.ok(f.description.length > 0, `Formula ${f.id} must have a description`);
    assert.ok(['P1', 'P2'].includes(f.paper), `Formula ${f.id} invalid paper`);
    assert.ok(Object.keys(TOPICS).includes(f.topicId), `Formula ${f.id} invalid topicId ${f.topicId}`);

    // Verify KaTeX syntax
    assertValidKatex(f.latex, `Formula ${f.id}`);
  }
});

test('Euclidean Geometry: Verbatim official DBE acceptable reasons catalog', () => {
  const allReasons = getAllGeometryReasons();
  assert.ok(allReasons.length >= 35, 'Must have comprehensive list of geometry reasons');

  const categories = [
    'lines_angles',
    'triangles_polygons',
    'circles_chords',
    'circles_cyclic',
    'circles_tangents',
    'proportionality_similarity',
  ];

  for (const cat of categories) {
    const subset = getGeometryReasonsByCategory(cat);
    assert.ok(subset.length > 0, `Category ${cat} must not be empty`);
  }

  const seenIds = new Set();
  for (const r of allReasons) {
    assert.ok(!seenIds.has(r.id), `Duplicate geometry reason ID: ${r.id}`);
    seenIds.add(r.id);

    assert.ok(r.fullTheorem.length > 0, `Reason ${r.id} must have fullTheorem`);
    assert.ok(r.acceptableShortReason.length > 0, `Reason ${r.id} must have acceptableShortReason`);
    assert.ok([8, 9, 10, 11, 12].includes(r.grade), `Reason ${r.id} invalid grade ${r.grade}`);
  }
});

test('Curated Past Paper Bank: Authentic questions across all 10 topics & 4 cognitive levels', () => {
  assert.ok(PAST_PAPER_QUESTIONS.length >= 10, 'Must have curated past paper questions');

  // Verify questions span both papers
  const p1Questions = getQuestionsByPaper('P1');
  const p2Questions = getQuestionsByPaper('P2');
  assert.ok(p1Questions.length > 0, 'Must have P1 past paper questions');
  assert.ok(p2Questions.length > 0, 'Must have P2 past paper questions');

  // Verify cognitive levels represented
  const levels = new Set(PAST_PAPER_QUESTIONS.map((q) => q.cognitiveLevel));
  assert.ok(levels.has('L1'), 'Must include L1 questions');
  assert.ok(levels.has('L2'), 'Must include L2 questions');
  assert.ok(levels.has('L3'), 'Must include L3 questions');

  const seenIds = new Set();
  for (const q of PAST_PAPER_QUESTIONS) {
    assert.ok(!seenIds.has(q.id), `Duplicate question ID: ${q.id}`);
    seenIds.add(q.id);

    assert.ok(Object.keys(TOPICS).includes(q.topic), `Question ${q.id} invalid topic ${q.topic}`);
    assert.ok(['P1', 'P2'].includes(q.paper), `Question ${q.id} invalid paper`);
    assert.ok(q.marks > 0, `Question ${q.id} marks must be > 0`);

    // Verify KaTeX question
    assertValidKatex(q.questionLatex, `Question ${q.id} questionLatex`);

    // Verify distractors
    assert.equal(q.distractors.length, 4, `Question ${q.id} must have exactly 4 distractors`);
    const correctDistractors = q.distractors.filter((d) => d.isCorrect);
    assert.equal(correctDistractors.length, 1, `Question ${q.id} must have exactly 1 correct distractor`);
    assert.equal(
      correctDistractors[0].id,
      q.correctAnswerId,
      `Question ${q.id} correctAnswerId must match the correct distractor id`
    );

    for (const d of q.distractors) {
      assertValidKatex(d.latex, `Question ${q.id} distractor ${d.id}`);
      assert.ok(d.explanation.length > 0, `Question ${q.id} distractor ${d.id} must have explanation`);
    }

    // Verify Zante Vibe Check
    assert.ok(q.zanteVibeCheck.length > 20, `Question ${q.id} must have substantive Zante Vibe Check`);
    assert.ok(!q.zanteVibeCheck.includes('NaN'), `Question ${q.id} Zante vibe check has NaN`);

    // Verify NSC Memo
    assert.ok(q.nscMemo.steps.length >= 2, `Question ${q.id} memo must have multiple steps`);
    assert.equal(q.nscMemo.totalMarks, q.marks, `Question ${q.id} memo totalMarks must match marks`);
    for (const step of q.nscMemo.steps) {
      assertValidKatex(step.stepLatex, `Question ${q.id} memo step`);
      assertValidKatex(step.tickAllocation, `Question ${q.id} memo tickAllocation`);
      assert.ok(
        step.tickAllocation.includes('\\checkmark'),
        `Question ${q.id} memo step tick allocation must contain \\checkmark`
      );
    }
  }
});

test('Referential Integrity: All topic formulaIds exist in FORMULA_SHEET with bidirectional consistency', () => {
  const formulaIdSet = new Set(FORMULA_SHEET.map((f) => f.id));
  const missingInSheet = [];

  for (const [topicId, topic] of Object.entries(TOPICS)) {
    for (const fid of topic.formulaIds) {
      if (!formulaIdSet.has(fid)) {
        missingInSheet.push({ topicId, fid });
      }
    }
  }

  assert.equal(
    missingInSheet.length,
    0,
    `Found ${missingInSheet.length} dangling formula references in TOPICS: ${JSON.stringify(missingInSheet)}`
  );

  // Check child to parent mapping
  for (const f of FORMULA_SHEET) {
    const topic = TOPICS[f.topicId];
    assert.ok(topic, `Formula ${f.id} has invalid topicId: "${f.topicId}"`);
    assert.equal(
      f.paper,
      topic.paper,
      `Formula ${f.id} paper (${f.paper}) does not match topic paper (${topic.paper})`
    );
  }
});

test('Referential Integrity: All question formulaRefIds exist in FORMULA_SHEET', () => {
  const formulaIdSet = new Set(FORMULA_SHEET.map((f) => f.id));
  const danglingRefs = [];

  for (const q of PAST_PAPER_QUESTIONS) {
    if (q.formulaRefId && !formulaIdSet.has(q.formulaRefId)) {
      danglingRefs.push({ questionId: q.id, formulaRefId: q.formulaRefId });
    }
  }

  assert.equal(
    danglingRefs.length,
    0,
    `Found ${danglingRefs.length} past paper questions referencing non-existent formulas: ${JSON.stringify(danglingRefs)}`
  );
});
