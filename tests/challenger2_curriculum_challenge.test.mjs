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
  getGeometryReasonsByCategory,
} from '../src/data/geometryReasons.ts';
import {
  PAST_PAPER_QUESTIONS,
  getQuestionsByTopic,
  getQuestionsByPaper,
} from '../src/data/pastPaperQuestions.ts';
import { generateP1Question } from '../src/generators/p1Generators.ts';
import { generateP2Question } from '../src/generators/p2Generators.ts';

// Strict KaTeX validator that uses the real KaTeX parser
function assertStrictKatex(latex, context) {
  assert.ok(typeof latex === 'string', `${context}: must be a string`);
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

// 1. PAPER 1 & PAPER 2 MARKS SUM
test('Empirical Test 1: Paper 1 & Paper 2 mark allocations sum exactly to 150 each', () => {
  // P1 topic count and sum
  assert.equal(PAPER_1_TOPICS.length, 6, 'P1 must have exactly 6 topics');
  const p1Sum = getTotalMarksForPaper('P1');
  assert.equal(p1Sum, 150, `P1 total marks must equal 150, got ${p1Sum}`);

  // P2 topic count and sum
  assert.equal(PAPER_2_TOPICS.length, 4, 'P2 must have exactly 4 topics');
  const p2Sum = getTotalMarksForPaper('P2');
  assert.equal(p2Sum, 150, `P2 total marks must equal 150, got ${p2Sum}`);

  // Total curriculum marks
  const totalMarks = p1Sum + p2Sum;
  assert.equal(totalMarks, 300, `Grand total curriculum marks must equal 300, got ${totalMarks}`);
});

// 2. FORMULA SHEET INVENTORY & STRICT KATEX SYNTAX
test('Empirical Test 2: Formula sheet has 44 formulas (37 official DBE + 7 unlisted) with valid KaTeX syntax', () => {
  assert.equal(FORMULA_SHEET.length, 44, `Formula sheet must have 44 formulas, got ${FORMULA_SHEET.length}`);

  const official = getOfficialFormulas();
  const unlisted = getUnlistedFormulas();

  assert.equal(official.length, 37, `Must have 37 official DBE formulas, got ${official.length}`);
  assert.equal(unlisted.length, 7, `Must have 7 unlisted essential formulas, got ${unlisted.length}`);

  const seenIds = new Set();
  for (const f of FORMULA_SHEET) {
    assert.ok(!seenIds.has(f.id), `Duplicate formula ID: ${f.id}`);
    seenIds.add(f.id);

    // Verify metadata
    assert.ok(f.name.length > 0, `Formula ${f.id} missing name`);
    assert.ok(f.description.length > 0, `Formula ${f.id} missing description`);
    assert.ok(['P1', 'P2'].includes(f.paper), `Formula ${f.id} invalid paper`);
    assert.ok(Object.keys(TOPICS).includes(f.topicId), `Formula ${f.id} invalid topicId`);

    // KaTeX parse check
    assertStrictKatex(f.latex, `Formula ${f.id}`);
  }
});

// 3. GEOMETRY REASONS VERBATIM DBE CATALOG
test('Empirical Test 3: Geometry reasons contain official DBE acceptable reasons with zero typos', () => {
  const reasons = getAllGeometryReasons();
  assert.ok(reasons.length >= 37, `Must contain at least 37 reasons, got ${reasons.length}`);

  const expectedCategories = [
    'lines_angles',
    'triangles_polygons',
    'circles_chords',
    'circles_cyclic',
    'circles_tangents',
    'proportionality_similarity',
  ];

  for (const cat of expectedCategories) {
    const list = getGeometryReasonsByCategory(cat);
    assert.ok(list.length > 0, `Category ${cat} must not be empty`);
  }

  const seenIds = new Set();
  for (const r of reasons) {
    assert.ok(!seenIds.has(r.id), `Duplicate geometry reason ID: ${r.id}`);
    seenIds.add(r.id);
    assert.ok(r.fullTheorem.length > 5, `Reason ${r.id} theorem text too short`);
    assert.ok(r.acceptableShortReason.length > 2, `Reason ${r.id} short reason too short`);
    assert.ok([8, 9, 10, 11, 12].includes(r.grade), `Reason ${r.id} invalid grade`);
  }
});

// 4. TOPIC FORMULA REFERENTIAL INTEGRITY (ADVERSARIAL CHALLENGE)
test('Empirical Test 4 [ADVERSARIAL]: Every formula ID in TOPICS must exist in FORMULA_SHEET', () => {
  const fIds = new Set(FORMULA_SHEET.map((f) => f.id));
  const missing = [];

  for (const [topicId, topic] of Object.entries(TOPICS)) {
    for (const fid of topic.formulaIds) {
      if (!fIds.has(fid)) {
        missing.push({ topicId, fid });
      }
    }
  }

  assert.equal(
    missing.length,
    0,
    `Found ${missing.length} dangling formula references in TOPICS: ${JSON.stringify(missing)}`
  );
});

// 5. PAST PAPER QUESTION FORMULA REFERENTIAL INTEGRITY (ADVERSARIAL CHALLENGE)
test('Empirical Test 5 [ADVERSARIAL]: Every formulaRefId in PAST_PAPER_QUESTIONS must exist in FORMULA_SHEET', () => {
  const fIds = new Set(FORMULA_SHEET.map((f) => f.id));
  const missing = [];

  for (const q of PAST_PAPER_QUESTIONS) {
    if (q.formulaRefId && !fIds.has(q.formulaRefId)) {
      missing.push({ questionId: q.id, formulaRefId: q.formulaRefId });
    }
  }

  assert.equal(
    missing.length,
    0,
    `Found ${missing.length} questions referencing missing formulas: ${JSON.stringify(missing)}`
  );
});

// 6. PAST PAPER QUESTIONS COVERAGE & TICK MARKS
test('Empirical Test 6: Past paper questions cover all 10 topics and L1-L4 with matching checkmarks', () => {
  assert.ok(PAST_PAPER_QUESTIONS.length >= 10, 'Must have at least 10 past paper questions');

  // Verify all 10 topics covered
  const topicsRepresented = new Set(PAST_PAPER_QUESTIONS.map((q) => q.topic));
  for (const topicId of Object.keys(TOPICS)) {
    assert.ok(topicsRepresented.has(topicId), `Topic ${topicId} has no past paper questions`);
  }

  // Verify cognitive levels represented
  const levels = new Set(PAST_PAPER_QUESTIONS.map((q) => q.cognitiveLevel));
  assert.ok(levels.has('L1'), 'Must include L1');
  assert.ok(levels.has('L2'), 'Must include L2');
  assert.ok(levels.has('L3'), 'Must include L3');
  assert.ok(levels.has('L4'), 'Must include L4');

  // Verify checkmarks count matches marks
  for (const q of PAST_PAPER_QUESTIONS) {
    assert.equal(q.marks, q.nscMemo.totalMarks, `Question ${q.id} marks mismatch memo totalMarks`);
    let tickCount = 0;
    for (const step of q.nscMemo.steps) {
      const matches = step.tickAllocation.match(/\\checkmark/g);
      assert.ok(matches && matches.length > 0, `Step in ${q.id} missing \\checkmark`);
      tickCount += matches.length;
    }
    assert.equal(tickCount, q.marks, `Question ${q.id} tick count (${tickCount}) does not match marks (${q.marks})`);
  }
});

// 7. PAST PAPER QUESTIONS STRICT KATEX SYNTAX (ADVERSARIAL CHALLENGE)
test('Empirical Test 7 [ADVERSARIAL]: All LaTeX strings in PAST_PAPER_QUESTIONS parse cleanly in KaTeX', () => {
  const parseFailures = [];

  for (const q of PAST_PAPER_QUESTIONS) {
    try {
      katex.renderToString(q.questionLatex, { throwOnError: true });
    } catch (err) {
      parseFailures.push({ id: q.id, field: 'questionLatex', error: err.message, raw: q.questionLatex });
    }

    for (const d of q.distractors) {
      try {
        katex.renderToString(d.latex, { throwOnError: true });
      } catch (err) {
        parseFailures.push({ id: q.id, field: `distractor:${d.id}`, error: err.message, raw: d.latex });
      }
    }

    for (let i = 0; i < q.nscMemo.steps.length; i++) {
      const step = q.nscMemo.steps[i];
      try {
        katex.renderToString(step.stepLatex, { throwOnError: true });
      } catch (err) {
        parseFailures.push({ id: q.id, field: `stepLatex:${i}`, error: err.message, raw: step.stepLatex });
      }
      try {
        katex.renderToString(step.tickAllocation, { throwOnError: true });
      } catch (err) {
        parseFailures.push({ id: q.id, field: `tickAllocation:${i}`, error: err.message, raw: step.tickAllocation });
      }
    }
  }

  assert.equal(
    parseFailures.length,
    0,
    `Found ${parseFailures.length} KaTeX parse failures in PAST_PAPER_QUESTIONS: ${JSON.stringify(parseFailures, null, 2)}`
  );
});

// 8. GENERATORS STRICT KATEX SYNTAX (ADVERSARIAL CHALLENGE)
test('Empirical Test 8 [ADVERSARIAL]: 100 generated questions per paper have zero KaTeX parse failures', () => {
  const parseFailures = [];

  for (let i = 0; i < 100; i++) {
    const q1 = generateP1Question();
    for (let sIdx = 0; sIdx < q1.nscMemo.steps.length; sIdx++) {
      const s = q1.nscMemo.steps[sIdx];
      try {
        katex.renderToString(s.tickAllocation, { throwOnError: true });
      } catch (err) {
        parseFailures.push({ id: q1.id, field: `P1 tickAllocation:${sIdx}`, error: err.message, raw: s.tickAllocation });
      }
    }

    const q2 = generateP2Question();
    for (let sIdx = 0; sIdx < q2.nscMemo.steps.length; sIdx++) {
      const s = q2.nscMemo.steps[sIdx];
      try {
        katex.renderToString(s.tickAllocation, { throwOnError: true });
      } catch (err) {
        parseFailures.push({ id: q2.id, field: `P2 tickAllocation:${sIdx}`, error: err.message, raw: s.tickAllocation });
      }
    }
  }

  assert.equal(
    parseFailures.length,
    0,
    `Found ${parseFailures.length} KaTeX parse failures in generated question tickAllocations`
  );
});
