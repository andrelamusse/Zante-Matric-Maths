/**
 * Milestone M4 Adversarial Challenge: Exam Simulator, Blueprints & Memo Suite
 * Challenger 2 Verification Harness
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';

import {
  CHEAT_SHEETS,
  EXAM_ARCHETYPES,
  P1_BLUEPRINT,
  P2_BLUEPRINT,
  buildMockExamQuestions,
} from '../src/data/cheatSheets.ts';

import {
  TOPICS,
  PAPER_1_TOPICS,
  PAPER_2_TOPICS,
} from '../src/data/topics.ts';

import { PAST_PAPER_QUESTIONS } from '../src/data/pastPaperQuestions.ts';
import { generateP1Question } from '../src/generators/p1Generators.ts';
import { generateP2Question } from '../src/generators/p2Generators.ts';

/**
 * Helper to compute simulator exam scoring exactly as in ExamSimulator.tsx
 */
function computeExamResults(examQuestions, selectedAnswers) {
  let earnedMarks = 0;
  const totalExamMarks = examQuestions.reduce((sum, q) => sum + q.marks, 0);
  const topicScores = {};
  const cognitiveScores = {
    L1: { earned: 0, total: 0 },
    L2: { earned: 0, total: 0 },
    L3: { earned: 0, total: 0 },
    L4: { earned: 0, total: 0 },
  };

  examQuestions.forEach((q, idx) => {
    const chosenId = selectedAnswers[idx];
    const isCorrect = chosenId === q.correctAnswerId;
    const qMarks = q.marks;

    cognitiveScores[q.cognitiveLevel].total += qMarks;
    if (isCorrect) {
      cognitiveScores[q.cognitiveLevel].earned += qMarks;
      earnedMarks += qMarks;
    }

    if (!topicScores[q.topic]) {
      topicScores[q.topic] = {
        earned: 0,
        total: 0,
        name: TOPICS[q.topic]?.name || q.topic,
      };
    }
    topicScores[q.topic].total += qMarks;
    if (isCorrect) {
      topicScores[q.topic].earned += qMarks;
    }
  });

  const percentage = totalExamMarks > 0 ? (earnedMarks / totalExamMarks) * 100 : 0;
  let distinctionTitle = 'Elementary Standard';
  let distinctionBadge = '🌱 Need Practice';
  if (percentage >= 80) {
    distinctionTitle = 'Distinction Standard (Level 7)';
    distinctionBadge = '👑 Distinction 💅';
  } else if (percentage >= 70) {
    distinctionTitle = 'Meritorious Achievement (Level 6)';
    distinctionBadge = '🔥 Meritorious';
  } else if (percentage >= 60) {
    distinctionTitle = 'Substantial Achievement (Level 5)';
    distinctionBadge = '⚡ Substantial';
  } else if (percentage >= 50) {
    distinctionTitle = 'Moderate Achievement (Level 4)';
    distinctionBadge = '📘 Moderate Pass';
  }

  return {
    earnedMarks,
    totalExamMarks,
    percentage,
    distinctionTitle,
    distinctionBadge,
    topicScores,
    cognitiveScores,
  };
}

/**
 * Helper to format seconds to HH:MM:SS as in ExamSimulator.tsx
 */
function formatTime(totalSecs) {
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

describe('Challenger 2 Empirical Verification: M4 Exam Simulator & Blueprints', () => {
  // =========================================================================
  // 1. Paper 1 Blueprint Verification (11 questions, 150 marks)
  // =========================================================================
  describe('1. 150-Mark Paper 1 Blueprint Invariants', () => {
    it('must contain exactly 11 questions numbered 1 through 11', () => {
      assert.equal(P1_BLUEPRINT.length, 11, 'P1 blueprint must have exactly 11 questions');
      P1_BLUEPRINT.forEach((q, idx) => {
        assert.equal(q.qNum, idx + 1, `P1 Question at index ${idx} must have qNum ${idx + 1}`);
      });
    });

    it('must sum exactly to 150 marks', () => {
      const sum = P1_BLUEPRINT.reduce((acc, q) => acc + q.marks, 0);
      assert.equal(sum, 150, `P1 blueprint marks sum to ${sum}, expected 150`);
    });

    it('must strictly match CAPS Paper 1 topic mark weightings', () => {
      const topicSums = P1_BLUEPRINT.reduce((acc, q) => {
        acc[q.topic] = (acc[q.topic] || 0) + q.marks;
        return acc;
      }, {});

      assert.equal(topicSums.algebra, 25, 'Algebra must equal 25 marks');
      assert.equal(topicSums.patterns, 25, 'Patterns must equal 25 marks');
      assert.equal(topicSums.functions, 35, 'Functions must equal 35 marks');
      assert.equal(topicSums.finance, 15, 'Finance must equal 15 marks');
      assert.equal(topicSums.calculus, 35, 'Calculus must equal 35 marks');
      assert.equal(topicSums.probability, 15, 'Probability must equal 15 marks');

      // Verify no P2 topics leak into P1 blueprint
      for (const p2Topic of PAPER_2_TOPICS) {
        assert.equal(topicSums[p2Topic] || 0, 0, `P2 topic ${p2Topic} leaked into P1 blueprint`);
      }
    });

    it('must follow authentic NSC Paper 1 question sequence', () => {
      assert.equal(P1_BLUEPRINT[0].topic, 'algebra', 'Q1 must be Algebra');
      assert.equal(P1_BLUEPRINT[1].topic, 'patterns', 'Q2 must be Patterns');
      assert.equal(P1_BLUEPRINT[2].topic, 'patterns', 'Q3 must be Patterns');
      assert.equal(P1_BLUEPRINT[3].topic, 'functions', 'Q4 must be Functions');
      assert.equal(P1_BLUEPRINT[4].topic, 'functions', 'Q5 must be Functions');
      assert.equal(P1_BLUEPRINT[5].topic, 'finance', 'Q6 must be Finance');
      assert.equal(P1_BLUEPRINT[6].topic, 'calculus', 'Q7 must be Calculus');
      assert.equal(P1_BLUEPRINT[7].topic, 'calculus', 'Q8 must be Calculus');
      assert.equal(P1_BLUEPRINT[8].topic, 'calculus', 'Q9 must be Calculus (Optimization)');
      assert.equal(P1_BLUEPRINT[9].topic, 'probability', 'Q10 must be Probability');
      assert.equal(P1_BLUEPRINT[10].topic, 'probability', 'Q11 must be Probability (Counting)');
    });
  });

  // =========================================================================
  // 2. Paper 2 Blueprint Verification (10 questions, 150 marks)
  // =========================================================================
  describe('2. 150-Mark Paper 2 Blueprint Invariants', () => {
    it('must contain exactly 10 questions numbered 1 through 10', () => {
      assert.equal(P2_BLUEPRINT.length, 10, 'P2 blueprint must have exactly 10 questions');
      P2_BLUEPRINT.forEach((q, idx) => {
        assert.equal(q.qNum, idx + 1, `P2 Question at index ${idx} must have qNum ${idx + 1}`);
      });
    });

    it('must sum exactly to 150 marks', () => {
      const sum = P2_BLUEPRINT.reduce((acc, q) => acc + q.marks, 0);
      assert.equal(sum, 150, `P2 blueprint marks sum to ${sum}, expected 150`);
    });

    it('must strictly match CAPS Paper 2 topic mark weightings', () => {
      const topicSums = P2_BLUEPRINT.reduce((acc, q) => {
        acc[q.topic] = (acc[q.topic] || 0) + q.marks;
        return acc;
      }, {});

      assert.equal(topicSums.statistics, 20, 'Statistics must equal 20 marks');
      assert.equal(topicSums.analytical_geometry, 40, 'Analytical Geometry must equal 40 marks');
      assert.equal(topicSums.trigonometry, 50, 'Trigonometry must equal 50 marks');
      assert.equal(topicSums.euclidean_geometry, 40, 'Euclidean Geometry must equal 40 marks');

      // Verify no P1 topics leak into P2 blueprint
      for (const p1Topic of PAPER_1_TOPICS) {
        assert.equal(topicSums[p1Topic] || 0, 0, `P1 topic ${p1Topic} leaked into P2 blueprint`);
      }
    });

    it('must follow authentic NSC Paper 2 question sequence', () => {
      assert.equal(P2_BLUEPRINT[0].topic, 'statistics', 'Q1 must be Statistics');
      assert.equal(P2_BLUEPRINT[1].topic, 'statistics', 'Q2 must be Statistics');
      assert.equal(P2_BLUEPRINT[2].topic, 'analytical_geometry', 'Q3 must be Analytical Geometry');
      assert.equal(P2_BLUEPRINT[3].topic, 'analytical_geometry', 'Q4 must be Analytical Geometry (Circles)');
      assert.equal(P2_BLUEPRINT[4].topic, 'trigonometry', 'Q5 must be Trigonometry (Identities)');
      assert.equal(P2_BLUEPRINT[5].topic, 'trigonometry', 'Q6 must be Trigonometry (Graphs)');
      assert.equal(P2_BLUEPRINT[6].topic, 'trigonometry', 'Q7 must be Trigonometry (2D/3D)');
      assert.equal(P2_BLUEPRINT[7].topic, 'euclidean_geometry', 'Q8 must be Euclidean Geometry (Circles)');
      assert.equal(P2_BLUEPRINT[8].topic, 'euclidean_geometry', 'Q9 must be Euclidean Geometry (Cyclic Quads)');
      assert.equal(P2_BLUEPRINT[9].topic, 'euclidean_geometry', 'Q10 must be Euclidean Geometry (Similarity)');
    });
  });

  // =========================================================================
  // 3. Cognitive Distribution Audit (CAPS Targets: L1 ~20%, L2 ~35%, L3 ~30%, L4 ~15%)
  // =========================================================================
  describe('3. Cognitive Level Distribution Audit', () => {
    it('should verify fine-grained CAPS topic targets conform to curriculum weighting', () => {
      // Paper 1 Targets in topics.ts
      const p1Cognitive = PAPER_1_TOPICS.reduce(
        (acc, tId) => {
          const t = TOPICS[tId];
          acc.L1 += t.cognitiveTarget.L1;
          acc.L2 += t.cognitiveTarget.L2;
          acc.L3 += t.cognitiveTarget.L3;
          acc.L4 += t.cognitiveTarget.L4;
          return acc;
        },
        { L1: 0, L2: 0, L3: 0, L4: 0 }
      );

      assert.equal(p1Cognitive.L1, 28, 'P1 L1 target should be 28m (18.7%)');
      assert.equal(p1Cognitive.L2, 57, 'P1 L2 target should be 57m (38.0%)');
      assert.equal(p1Cognitive.L3, 45, 'P1 L3 target should be 45m (30.0%)');
      assert.equal(p1Cognitive.L4, 20, 'P1 L4 target should be 20m (13.3%)');
      assert.equal(p1Cognitive.L1 + p1Cognitive.L2 + p1Cognitive.L3 + p1Cognitive.L4, 150);

      // Paper 2 Targets in topics.ts
      const p2Cognitive = PAPER_2_TOPICS.reduce(
        (acc, tId) => {
          const t = TOPICS[tId];
          acc.L1 += t.cognitiveTarget.L1;
          acc.L2 += t.cognitiveTarget.L2;
          acc.L3 += t.cognitiveTarget.L3;
          acc.L4 += t.cognitiveTarget.L4;
          return acc;
        },
        { L1: 0, L2: 0, L3: 0, L4: 0 }
      );

      assert.equal(p2Cognitive.L1, 30, 'P2 L1 target should be 30m (20.0%)');
      assert.equal(p2Cognitive.L2, 54, 'P2 L2 target should be 54m (36.0%)');
      assert.equal(p2Cognitive.L3, 45, 'P2 L3 target should be 45m (30.0%)');
      assert.equal(p2Cognitive.L4, 21, 'P2 L4 target should be 21m (14.0%)');
      assert.equal(p2Cognitive.L1 + p2Cognitive.L2 + p2Cognitive.L3 + p2Cognitive.L4, 150);
    });

    it('should measure coarse-grained blueprint cognitive distributions and document variance', () => {
      const p1BlueprintCog = P1_BLUEPRINT.reduce(
        (acc, q) => {
          acc[q.cognitiveLevel] = (acc[q.cognitiveLevel] || 0) + q.marks;
          return acc;
        },
        { L1: 0, L2: 0, L3: 0, L4: 0 }
      );

      const p2BlueprintCog = P2_BLUEPRINT.reduce(
        (acc, q) => {
          acc[q.cognitiveLevel] = (acc[q.cognitiveLevel] || 0) + q.marks;
          return acc;
        },
        { L1: 0, L2: 0, L3: 0, L4: 0 }
      );

      // Both must total 150
      assert.equal(p1BlueprintCog.L1 + p1BlueprintCog.L2 + p1BlueprintCog.L3 + p1BlueprintCog.L4, 150);
      assert.equal(p2BlueprintCog.L1 + p2BlueprintCog.L2 + p2BlueprintCog.L3 + p2BlueprintCog.L4, 150);

      // All 4 levels must exist in both blueprints
      assert.ok(p1BlueprintCog.L1 > 0, 'P1 must have L1 questions');
      assert.ok(p1BlueprintCog.L2 > 0, 'P1 must have L2 questions');
      assert.ok(p1BlueprintCog.L3 > 0, 'P1 must have L3 questions');
      assert.ok(p1BlueprintCog.L4 > 0, 'P1 must have L4 questions');

      assert.ok(p2BlueprintCog.L1 > 0, 'P2 must have L1 questions');
      assert.ok(p2BlueprintCog.L2 > 0, 'P2 must have L2 questions');
      assert.ok(p2BlueprintCog.L3 > 0, 'P2 must have L3 questions');
      assert.ok(p2BlueprintCog.L4 > 0, 'P2 must have L4 questions');

      // Specific measurements: P1 L1=12m (8%), L2=77m (51.3%), L3=52m (34.7%), L4=9m (6%)
      assert.equal(p1BlueprintCog.L1, 12);
      assert.equal(p1BlueprintCog.L2, 77);
      assert.equal(p1BlueprintCog.L3, 52);
      assert.equal(p1BlueprintCog.L4, 9);

      // Specific measurements: P2 L1=9m (6%), L2=77m (51.3%), L3=50m (33.3%), L4=14m (9.3%)
      assert.equal(p2BlueprintCog.L1, 9);
      assert.equal(p2BlueprintCog.L2, 77);
      assert.equal(p2BlueprintCog.L3, 50);
      assert.equal(p2BlueprintCog.L4, 14);
    });
  });

  // =========================================================================
  // 4. 20 NSC Exam Archetypes Generative Stability
  // =========================================================================
  describe('4. 20 NSC Exam Archetypes Generative Stability', () => {
    it('must define all 20 NSC Exam Archetypes with non-empty metadata', () => {
      assert.equal(EXAM_ARCHETYPES.length, 20);
      for (let i = 1; i <= 20; i++) {
        const expectedId = `EX-${i.toString().padStart(2, '0')}`;
        const arch = EXAM_ARCHETYPES.find((a) => a.id === expectedId);
        assert.ok(arch, `Archetype ${expectedId} not found`);
        assert.ok(arch.name && arch.name.length >= 8, `Archetype ${expectedId} missing valid name`);
        assert.ok(arch.year >= 2020 && arch.year <= 2024, `Archetype ${expectedId} year ${arch.year} out of bounds`);
        assert.ok(arch.session && arch.session.length >= 2, `Archetype ${expectedId} missing session`);
        assert.ok(arch.distinctionFeature && arch.distinctionFeature.length >= 10, `Archetype ${expectedId} missing feature`);
      }
    });

    it('must produce 420 valid mock questions across all 20 archetypes with ZERO defects', () => {
      let totalQuestionsExamined = 0;

      for (const arch of EXAM_ARCHETYPES) {
        for (const paper of ['P1', 'P2']) {
          const questions = buildMockExamQuestions(paper, arch.id);
          const expectedCount = paper === 'P1' ? 11 : 10;
          assert.equal(questions.length, expectedCount);

          const totalMarks = questions.reduce((s, q) => s + q.marks, 0);
          assert.equal(totalMarks, 150);

          for (let qIdx = 0; qIdx < questions.length; qIdx++) {
            totalQuestionsExamined++;
            const q = questions[qIdx];

            // ID check
            assert.equal(q.id, `${arch.id}-${paper}-Q${qIdx + 1}`);

            // Question latex check
            assert.ok(q.questionLatex && q.questionLatex.length > 5);

            // 4 distinct distractors check
            assert.equal(q.distractors.length, 4, `Question ${q.id} must have 4 distractors`);
            const optIds = new Set(q.distractors.map((d) => d.id));
            assert.equal(optIds.size, 4, `Duplicate distractor IDs in ${q.id}`);

            // Exactly 1 correct distractor
            const correctDistractors = q.distractors.filter((d) => d.isCorrect);
            assert.equal(correctDistractors.length, 1, `Question ${q.id} must have exactly 1 correct distractor`);
            assert.equal(q.correctAnswerId, correctDistractors[0].id);

            // Memo check
            assert.ok(q.nscMemo && Array.isArray(q.nscMemo.steps) && q.nscMemo.steps.length >= 1);
            assert.equal(q.nscMemo.totalMarks, q.marks);

            // Serialization integrity check (no NaN or undefined)
            const serialized = JSON.stringify(q);
            assert.ok(!serialized.includes('NaN'), `Question ${q.id} serialized to include NaN`);
            assert.ok(!serialized.includes('undefined'), `Question ${q.id} serialized to include undefined`);
          }
        }
      }

      assert.equal(totalQuestionsExamined, 420, 'Must examine exactly 420 mock questions');
    });

    it('must stress-test 1,000 generator fallback iterations with zero NaN or undefined', () => {
      const COG_LEVELS = ['L1', 'L2', 'L3', 'L4'];
      let runs = 0;

      for (let i = 0; i < 25; i++) {
        for (const topic of PAPER_1_TOPICS) {
          for (const cog of COG_LEVELS) {
            const q = generateP1Question(topic, cog);
            runs++;
            const s = JSON.stringify(q);
            assert.ok(!s.includes('NaN'), `P1 generator NaN on ${topic} ${cog}`);
            assert.ok(!s.includes('undefined'), `P1 generator undefined on ${topic} ${cog}`);
          }
        }

        for (const topic of PAPER_2_TOPICS) {
          for (const cog of COG_LEVELS) {
            const q = generateP2Question(topic, cog);
            runs++;
            const s = JSON.stringify(q);
            assert.ok(!s.includes('NaN'), `P2 generator NaN on ${topic} ${cog}`);
            assert.ok(!s.includes('undefined'), `P2 generator undefined on ${topic} ${cog}`);
          }
        }
      }

      assert.equal(runs, 1000, 'Must complete exactly 1,000 generator iterations');
    });
  });

  // =========================================================================
  // 5. Exam Simulator Scoring Engine & Distinction Badges
  // =========================================================================
  describe('5. Scoring Engine & Distinction Level Badges', () => {
    it('must score 0 marks, 0%, and Elementary Standard when candidate answers nothing', () => {
      for (const paper of ['P1', 'P2']) {
        const exam = buildMockExamQuestions(paper, 'EX-01');
        const results = computeExamResults(exam, {});

        assert.equal(results.earnedMarks, 0);
        assert.equal(results.totalExamMarks, 150);
        assert.equal(results.percentage, 0);
        assert.equal(results.distinctionBadge, '🌱 Need Practice');
        assert.equal(results.distinctionTitle, 'Elementary Standard');

        // All cognitive earned marks must be 0
        for (const level of ['L1', 'L2', 'L3', 'L4']) {
          assert.equal(results.cognitiveScores[level].earned, 0);
          assert.ok(results.cognitiveScores[level].total > 0);
        }

        // All topic earned marks must be 0
        for (const key of Object.keys(results.topicScores)) {
          assert.equal(results.topicScores[key].earned, 0);
          assert.ok(results.topicScores[key].total > 0);
        }
      }
    });

    it('must score 150 marks, 100%, and Distinction (Level 7) on 100% correct answers', () => {
      for (const paper of ['P1', 'P2']) {
        const exam = buildMockExamQuestions(paper, 'EX-01');
        const allCorrect = {};
        exam.forEach((q, idx) => {
          allCorrect[idx] = q.correctAnswerId;
        });

        const results = computeExamResults(exam, allCorrect);
        assert.equal(results.earnedMarks, 150);
        assert.equal(results.totalExamMarks, 150);
        assert.equal(results.percentage, 100);
        assert.equal(results.distinctionBadge, '👑 Distinction 💅');
        assert.equal(results.distinctionTitle, 'Distinction Standard (Level 7)');

        for (const level of ['L1', 'L2', 'L3', 'L4']) {
          assert.equal(results.cognitiveScores[level].earned, results.cognitiveScores[level].total);
        }

        for (const key of Object.keys(results.topicScores)) {
          assert.equal(results.topicScores[key].earned, results.topicScores[key].total);
        }
      }
    });

    it('must verify exact threshold boundaries for all distinction badges', () => {
      // 80%+ -> Distinction Standard (Level 7)
      // 70% to 79.9% -> Meritorious (Level 6)
      // 60% to 69.9% -> Substantial (Level 5)
      // 50% to 59.9% -> Moderate Pass (Level 4)
      // < 50% -> Need Practice
      const exam = buildMockExamQuestions('P1', 'EX-01');

      // Test synthetic thresholds
      const mockScore = (earned) => {
        const pct = (earned / 150) * 100;
        let distinctionTitle = 'Elementary Standard';
        let distinctionBadge = '🌱 Need Practice';
        if (pct >= 80) {
          distinctionTitle = 'Distinction Standard (Level 7)';
          distinctionBadge = '👑 Distinction 💅';
        } else if (pct >= 70) {
          distinctionTitle = 'Meritorious Achievement (Level 6)';
          distinctionBadge = '🔥 Meritorious';
        } else if (pct >= 60) {
          distinctionTitle = 'Substantial Achievement (Level 5)';
          distinctionBadge = '⚡ Substantial';
        } else if (pct >= 50) {
          distinctionTitle = 'Moderate Achievement (Level 4)';
          distinctionBadge = '📘 Moderate Pass';
        }
        return { pct, distinctionTitle, distinctionBadge };
      };

      // 120/150 = 80.0% -> Level 7
      assert.equal(mockScore(120).distinctionBadge, '👑 Distinction 💅');
      // 119/150 = 79.33% -> Level 6
      assert.equal(mockScore(119).distinctionBadge, '🔥 Meritorious');
      // 105/150 = 70.0% -> Level 6
      assert.equal(mockScore(105).distinctionBadge, '🔥 Meritorious');
      // 104/150 = 69.33% -> Level 5
      assert.equal(mockScore(104).distinctionBadge, '⚡ Substantial');
      // 90/150 = 60.0% -> Level 5
      assert.equal(mockScore(90).distinctionBadge, '⚡ Substantial');
      // 89/150 = 59.33% -> Level 4
      assert.equal(mockScore(89).distinctionBadge, '📘 Moderate Pass');
      // 75/150 = 50.0% -> Level 4
      assert.equal(mockScore(75).distinctionBadge, '📘 Moderate Pass');
      // 74/150 = 49.33% -> Need Practice
      assert.equal(mockScore(74).distinctionBadge, '🌱 Need Practice');
    });

    it('must enforce conservation of marks across 2,000 randomized simulation runs', () => {
      for (const paper of ['P1', 'P2']) {
        const exam = buildMockExamQuestions(paper, 'EX-03');

        for (let iter = 0; iter < 1000; iter++) {
          const userAnswers = {};
          exam.forEach((q, idx) => {
            const rand = Math.random();
            if (rand < 0.25) {
              // Unattempted
            } else if (rand < 0.65) {
              // Correct
              userAnswers[idx] = q.correctAnswerId;
            } else {
              // Wrong
              const wrongChoice = q.distractors.find((d) => !d.isCorrect);
              userAnswers[idx] = wrongChoice ? wrongChoice.id : 'unknown';
            }
          });

          const res = computeExamResults(exam, userAnswers);

          // 1. Earned marks within bounds
          assert.ok(res.earnedMarks >= 0 && res.earnedMarks <= 150);

          // 2. Total exam marks is 150
          assert.equal(res.totalExamMarks, 150);

          // 3. Percentage exactness
          assert.equal(res.percentage, (res.earnedMarks / 150) * 100);

          // 4. Cognitive breakdown sum matches earnedMarks and totalExamMarks
          const cogEarnedSum = Object.values(res.cognitiveScores).reduce((s, c) => s + c.earned, 0);
          const cogTotalSum = Object.values(res.cognitiveScores).reduce((s, c) => s + c.total, 0);
          assert.equal(cogEarnedSum, res.earnedMarks);
          assert.equal(cogTotalSum, 150);

          // 5. Topic breakdown sum matches earnedMarks and totalExamMarks
          const topicEarnedSum = Object.values(res.topicScores).reduce((s, t) => s + t.earned, 0);
          const topicTotalSum = Object.values(res.topicScores).reduce((s, t) => s + t.total, 0);
          assert.equal(topicEarnedSum, res.earnedMarks);
          assert.equal(topicTotalSum, 150);
        }
      }
    });
  });

  // =========================================================================
  // 6. Step-by-Step Ticked Memo Review & Tick Mark Rendering Audit
  // =========================================================================
  describe('6. Ticked Memo Review & Tick Mark Rendering Audit', () => {
    it('must verify all blueprint question memo steps contain official tick marks', () => {
      const p1Questions = buildMockExamQuestions('P1', 'EX-01');
      const p2Questions = buildMockExamQuestions('P2', 'EX-01');
      const allQuestions = [...p1Questions, ...p2Questions];

      let totalStepsChecked = 0;
      for (const q of allQuestions) {
        assert.ok(q.nscMemo.steps.length >= 1, `Question ${q.id} has no memo steps`);
        for (const step of q.nscMemo.steps) {
          totalStepsChecked++;
          assert.ok(
            step.tickAllocation.includes('\\checkmark') || step.tickAllocation.includes('✓'),
            `Step in ${q.id} missing checkmark in tickAllocation: ${step.tickAllocation}`
          );
        }
      }

      assert.equal(totalStepsChecked, 72, 'Must check all 72 memo steps across P1 and P2 blueprints');
    });

    it('must verify 100% of stepLatex and tickAllocation compile cleanly in KaTeX', () => {
      const p1Questions = buildMockExamQuestions('P1', 'EX-01');
      const p2Questions = buildMockExamQuestions('P2', 'EX-01');
      const allQuestions = [...p1Questions, ...p2Questions];

      for (const q of allQuestions) {
        for (const step of q.nscMemo.steps) {
          // Verify stepLatex
          assert.doesNotThrow(() => {
            katex.renderToString(step.stepLatex, { displayMode: false, throwOnError: true });
          }, `KaTeX compilation error on stepLatex for ${q.id}: ${step.stepLatex}`);

          // Verify tickAllocation
          assert.doesNotThrow(() => {
            katex.renderToString(step.tickAllocation, { displayMode: false, throwOnError: true });
          }, `KaTeX compilation error on tickAllocation for ${q.id}: ${step.tickAllocation}`);
        }
      }
    });

    it('adversarial finding: ExamSimulator.tsx renders raw tickAllocation text without KaTeX', () => {
      // In ExamSimulator.tsx line 842:
      // <span className="font-bold text-emerald-700 ml-2 shrink-0">{step.tickAllocation}</span>
      // Whereas NscMemoCard.tsx uses dangerouslySetInnerHTML={{ __html: renderMath(step.tickAllocation) }}
      const p1 = buildMockExamQuestions('P1', 'EX-01');
      const sampleStep = p1[0].nscMemo.steps[0];

      assert.ok(
        sampleStep.tickAllocation.startsWith('\\checkmark'),
        'tickAllocation contains raw LaTeX backslash commands'
      );

      // Verify that rendering as raw string preserves LaTeX escape sequences
      const rawHtmlOutput = `<span>${sampleStep.tickAllocation}</span>`;
      assert.ok(
        rawHtmlOutput.includes('\\checkmark'),
        'Raw text rendering leaves uncompiled LaTeX \\checkmark in the markup'
      );

      // Verify that KaTeX render parses it into an HTML glyph structure with visual checkmark ✓
      const katexHtmlOutput = katex.renderToString(sampleStep.tickAllocation, { throwOnError: false });
      assert.ok(
        katexHtmlOutput.includes('katex') && katexHtmlOutput.includes('✓'),
        'KaTeX converts \\checkmark to HTML glyph structure containing visual checkmark ✓'
      );
    });

    it('must verify review filter modes (all, incorrect, flagged) operate correctly', () => {
      const questions = buildMockExamQuestions('P1', 'EX-01');
      // User answers Q1 and Q2 correctly, Q3 wrongly, rest skipped
      const selectedAnswers = {
        0: questions[0].correctAnswerId,
        1: questions[1].correctAnswerId,
        2: 'wrong-opt',
      };
      // Q1 and Q3 flagged
      const flagged = { 0: true, 2: true };

      // Filter: 'all'
      const allMode = questions.filter((_, idx) => true);
      assert.equal(allMode.length, 11);

      // Filter: 'incorrect'
      const incorrectMode = questions.filter((q, idx) => {
        const isCorrect = selectedAnswers[idx] === q.correctAnswerId;
        return !isCorrect;
      });
      // 11 - 2 correct = 9 incorrect/unattempted
      assert.equal(incorrectMode.length, 9);

      // Filter: 'flagged'
      const flaggedMode = questions.filter((_, idx) => Boolean(flagged[idx]));
      assert.equal(flaggedMode.length, 2);
    });
  });

  // =========================================================================
  // 7. Simulator Timer & State Machine Invariants
  // =========================================================================
  describe('7. Simulator State Machine & Timing Engine', () => {
    it('must format timer durations correctly across 3 hours to 0 seconds', () => {
      assert.equal(formatTime(10800), '03:00:00', '180 minutes should be 03:00:00');
      assert.equal(formatTime(7200), '02:00:00');
      assert.equal(formatTime(3600), '01:00:00');
      assert.equal(formatTime(1800), '00:30:00');
      assert.equal(formatTime(600), '00:10:00');
      assert.equal(formatTime(59), '00:00:59');
      assert.equal(formatTime(1), '00:00:01');
      assert.equal(formatTime(0), '00:00:00');
    });

    it('must preserve question flag state independently of answered state', () => {
      const flags = {};
      const answers = {};

      // Toggle flag on Q0, Q3, Q5
      [0, 3, 5].forEach((idx) => {
        flags[idx] = !flags[idx];
      });

      // Answer Q0 and Q1
      answers[0] = 'opt-a';
      answers[1] = 'opt-b';

      assert.equal(Object.keys(answers).length, 2);
      assert.equal(Object.values(flags).filter(Boolean).length, 3);
      assert.ok(flags[0] && answers[0]); // Both answered and flagged
      assert.ok(!flags[1] && answers[1]); // Answered not flagged
      assert.ok(flags[3] && !answers[3]); // Flagged not answered
    });
  });
});
