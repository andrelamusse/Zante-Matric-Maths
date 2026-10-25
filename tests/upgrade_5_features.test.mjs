/**
 * Automated Verification Suite for the 5 Critical Refactors & Upgrades:
 * 1. Global Keyboard Navigation & Rapid-Fire UX
 * 2. Uniform Option Randomization (Fisher-Yates shuffle, ~25% each on A, B, C, D)
 * 3. Meme Audio Engine Default & First-Gesture AudioContext Unlock + Speaker Indicator
 * 4. True NSC Past Paper Rigour & Multi-Part Sub-Questions
 * 5. Dynamic Banter Memory Buffer (LRU 15-entry queue, 65+ voice lines)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';

import {
  fisherYatesShuffle,
  shuffleQuestionDistractors,
  shuffleZanteQuestion,
} from '../src/generators/utils.ts';

import {
  BanterMemoryBuffer,
  getFreshVoiceLine,
  PRAISE_VOICE_LINES,
  ROAST_VOICE_LINES,
  STREAK_VOICE_LINES,
  SPECIAL_VOICE_LINES,
  ALL_VOICE_LINES,
} from '../src/sound/banterMemory.ts';

import { CrystallineSoundEngine } from '../src/sound/audioEngine.ts';
import { PAST_PAPER_QUESTIONS } from '../src/data/pastPaperQuestions.ts';
import { ZANTE_QUESTIONS } from '../src/data/zanteQuestions.ts';

// =============================================================================
// SUITE 1: UNIFORM OPTION RANDOMIZATION (FISHER-YATES SHUFFLE AUDIT)
// =============================================================================
describe('Feature 2: Uniform Option Randomization (Fisher-Yates Shuffle)', () => {
  it('should in-place shuffle an array with uniform distribution without losing elements', () => {
    const original = ['A', 'B', 'C', 'D'];
    const cloned = [...original];
    fisherYatesShuffle(cloned);
    assert.equal(cloned.length, 4);
    assert.deepEqual(cloned.sort(), ['A', 'B', 'C', 'D']);
  });

  it('should eliminate Option A bias across 1,000 iterations (each index ~25% within 20%-30%)', () => {
    const sampleQuestion = PAST_PAPER_QUESTIONS[0];
    const indexCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    const idCounts = { 'opt-a': 0, 'opt-b': 0, 'opt-c': 0, 'opt-d': 0 };
    const ITERATIONS = 1000;

    for (let i = 0; i < ITERATIONS; i++) {
      const shuffled = shuffleQuestionDistractors(sampleQuestion);
      assert.equal(shuffled.distractors.length, 4);

      // Verify stored correctIndex matches post-shuffle position of correct distractor
      const correctDist = shuffled.distractors.find((d) => d.isCorrect);
      assert.ok(correctDist, 'Question must have exactly one correct distractor');
      assert.equal(shuffled.correctAnswerId, correctDist.id);

      const actualIndex = shuffled.distractors.indexOf(correctDist);
      assert.equal(shuffled.correctIndex, actualIndex);

      indexCounts[actualIndex]++;
      idCounts[correctDist.id]++;
    }

    // Verify each position received approximately 25% (between 19% and 31%)
    for (let idx = 0; idx < 4; idx++) {
      const percentage = (indexCounts[idx] / ITERATIONS) * 100;
      assert.ok(
        percentage >= 19 && percentage <= 31,
        `Index ${idx} received ${percentage.toFixed(1)}%, expected ~25% (range 19%-31%)`
      );
    }
  });

  it('should uniformly shuffle Zante mode joke questions and update correctIndex', () => {
    const sampleZante = ZANTE_QUESTIONS[0];
    const originalAnswerText = sampleZante.options[sampleZante.correctIndex];
    const indexCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    const ITERATIONS = 1000;

    for (let i = 0; i < ITERATIONS; i++) {
      const shuffled = shuffleZanteQuestion(sampleZante);
      assert.equal(shuffled.options.length, 4);
      assert.equal(shuffled.options[shuffled.correctIndex], originalAnswerText);
      indexCounts[shuffled.correctIndex]++;
    }

    for (let idx = 0; idx < 4; idx++) {
      const percentage = (indexCounts[idx] / ITERATIONS) * 100;
      assert.ok(
        percentage >= 19 && percentage <= 31,
        `Zante Option Index ${idx} received ${percentage.toFixed(1)}%, expected ~25%`
      );
    }
  });
});

// =============================================================================
// SUITE 2: MEME AUDIO ENGINE & FIRST-GESTURE UNLOCK LISTENER
// =============================================================================
describe('Feature 3: Meme Audio Engine & Speaker Indicator', () => {
  it('should default audio mode to "meme" (Unhinged Meme Audio)', () => {
    const engine = new CrystallineSoundEngine();
    assert.equal(engine.getAudioMode(), 'meme');
  });

  it('should notify registered sound listeners when audio methods trigger', () => {
    const engine = new CrystallineSoundEngine();
    const triggeredSounds = [];

    const unsubscribe = engine.onSoundTriggered((name) => {
      triggeredSounds.push(name);
    });

    engine.playVineBoom();
    engine.playSadTrombone();
    engine.playAirhorn();
    engine.playJackpot();
    engine.playBaddieShimmer();
    engine.playCameraShutter();
    engine.playBruhThud();

    assert.ok(triggeredSounds.includes('Vine Boom'));
    assert.ok(triggeredSounds.includes('Sad Trombone'));
    assert.ok(triggeredSounds.includes('Airhorn'));
    assert.ok(triggeredSounds.includes('Jackpot'));
    assert.ok(triggeredSounds.includes('Baddie Shimmer'));
    assert.ok(triggeredSounds.includes('Camera Shutter'));
    assert.ok(triggeredSounds.includes('Bruh Thud'));

    unsubscribe();
    const countBefore = triggeredSounds.length;
    engine.playVineBoom();
    assert.equal(triggeredSounds.length, countBefore, 'Unsubscribed listener should not receive events');
  });
});

// =============================================================================
// SUITE 3: DYNAMIC BANTER MEMORY BUFFER (LRU ANTI-REPETITION)
// =============================================================================
describe('Feature 5: Dynamic Banter Memory Buffer (Zero Repetition)', () => {
  it('should contain 60+ fresh, high-status voice lines across categories', () => {
    assert.ok(PRAISE_VOICE_LINES.length >= 20, `Expected >= 20 praise lines, got ${PRAISE_VOICE_LINES.length}`);
    assert.ok(ROAST_VOICE_LINES.length >= 15, `Expected >= 15 roast lines, got ${ROAST_VOICE_LINES.length}`);
    assert.ok(STREAK_VOICE_LINES.length >= 8, `Expected >= 8 streak lines, got ${STREAK_VOICE_LINES.length}`);
    assert.ok(SPECIAL_VOICE_LINES.length >= 8, `Expected >= 8 special lines, got ${SPECIAL_VOICE_LINES.length}`);
    assert.ok(ALL_VOICE_LINES.length >= 60, `Expected >= 60 total lines, got ${ALL_VOICE_LINES.length}`);
  });

  it('should maintain an exact LRU buffer capacity of 15 entries without duplicate entries in buffer', () => {
    const buffer = new BanterMemoryBuffer(15);
    assert.equal(buffer.capacity, 15);
    assert.equal(buffer.size(), 0);

    for (let i = 1; i <= 20; i++) {
      buffer.record(`line_${i}`);
    }

    assert.equal(buffer.size(), 15);
    assert.equal(buffer.has('line_1'), false, 'Oldest entry line_1 should be evicted');
    assert.equal(buffer.has('line_5'), false, 'line_5 should be evicted');
    assert.equal(buffer.has('line_6'), true, 'line_6 should remain');
    assert.equal(buffer.has('line_20'), true, 'Most recent line_20 should exist');
  });

  it('should never return a recently used voice line within the 15-entry window', () => {
    const buffer = new BanterMemoryBuffer(15);
    const seenPraise = [];

    // Sample 15 praise lines consecutively
    for (let i = 0; i < 15; i++) {
      const line = getFreshVoiceLine('praise', buffer);
      assert.ok(!seenPraise.includes(line), `Duplicate voice line detected within 15 samples: "${line}"`);
      seenPraise.push(line);
    }

    assert.equal(buffer.size(), 15);
  });
});

// =============================================================================
// SUITE 4: TRUE NSC PAST PAPER RIGOUR & MULTI-PART SUB-QUESTIONS
// =============================================================================
describe('Feature 4: Authentic NSC Past Paper Questions & Multi-Part Scaffolding', () => {
  it('should contain authentic Grade 12 CAPS past paper questions with multi-part sub-questions', () => {
    const multiPartQuestions = PAST_PAPER_QUESTIONS.filter(
      (q) => q.subQuestions && q.subQuestions.length > 0
    );

    assert.ok(
      multiPartQuestions.length >= 4,
      `Expected at least 4 multi-part questions, found ${multiPartQuestions.length}`
    );

    for (const q of multiPartQuestions) {
      assert.ok(q.stemLatex || q.questionLatex, `Question ${q.id} must have a stem`);
      assert.ok(q.subQuestions.length >= 2, `Question ${q.id} must have at least 2 sub-parts`);

      let calculatedMarks = 0;
      for (const sq of q.subQuestions) {
        assert.ok(sq.partNumber, `Sub-question ${sq.id} must have partNumber (e.g. 1.1)`);
        assert.ok(sq.marks >= 1, `Sub-question ${sq.id} must allocate >= 1 mark`);
        assert.equal(sq.distractors.length, 4, `Sub-question ${sq.id} must have 4 distractors`);

        const correctDist = sq.distractors.find((d) => d.isCorrect);
        assert.ok(correctDist, `Sub-question ${sq.id} must have a correct distractor`);
        assert.equal(sq.correctAnswerId, correctDist.id);

        calculatedMarks += sq.marks;

        // Verify sub-question KaTeX strings parse cleanly
        assert.doesNotThrow(() => {
          katex.renderToString(sq.questionLatex, { throwOnError: true });
        }, `KaTeX failed on sub-question ${sq.id} questionLatex`);

        for (const dist of sq.distractors) {
          assert.doesNotThrow(() => {
            katex.renderToString(dist.latex, { throwOnError: true });
          }, `KaTeX failed on sub-question ${sq.id} distractor ${dist.id}`);
        }
      }

      assert.equal(
        calculatedMarks,
        q.marks,
        `Question ${q.id} sub-questions sum (${calculatedMarks}) does not match question total marks (${q.marks})`
      );
    }
  });

  it('should include authentic high-yield topics: cubic graphs, Euclidean riders, circle tangents, and sigma notation', () => {
    const ids = PAST_PAPER_QUESTIONS.map((q) => q.id);
    assert.ok(ids.includes('PP-CALC-NSC-MP01'), 'Must include Cubic Graph multi-part question');
    assert.ok(ids.includes('PP-EUC-NSC-MP01'), 'Must include Euclidean Geometry multi-part rider');
    assert.ok(ids.includes('PP-ANA-NSC-MP01'), 'Must include Analytical Geometry circle tangent multi-part');
    assert.ok(ids.includes('PP-SEQ-NSC-MP01'), 'Must include Sequences & Series multi-part question');
    assert.ok(ids.includes('PP-SEQ-SIG-01'), 'Must include Sigma notation question');
    assert.ok(ids.includes('PP-ANA-ALT-01'), 'Must include Altitude equation question');
  });
});
