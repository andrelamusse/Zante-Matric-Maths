/**
 * Zante's Matric Maths Studio — Gamification & Voice Engine Test Suite
 *
 * Test runner: Native Node.js `node --test tests/gamification.test.mjs`
 * Assertion library: `node:assert/strict`
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

// Register TypeScript customization hook for Node ES module loading
try {
  register('./tests/ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered
}

// ---------------------------------------------------------------------------
// Production Imports
// ---------------------------------------------------------------------------
const {
  ZANTE_QUESTIONS,
  getZanteQuestionsByCategory,
  getZanteQuestionById,
  getRandomZanteQuestion,
} = await import('../src/data/zanteQuestions.ts');

const {
  generateZanteQuestion,
  generateElementaryZante,
  generateIcedCoffeeZante,
  generatePassengerPrincessZante,
  generateGirlMathZante,
  generateFlirtyPrioritiesZante,
  generateMatricTropesZante,
  generateZanteQuestionBatch,
} = await import('../src/generators/zanteGenerator.ts');

const {
  HEAT_METER_TIERS,
  getStreakTier,
  getStreakMilestoneToast,
  StreakShieldMachine,
  getModeSwitchRoast,
  isLateNightStudy,
  isLateNight,
  CrownTapDetector,
  ANDRE_VIP_DISCLAIMER,
  DISCLAIMER_SECTIONS,
  unlockVipHypeVault,
  ACHIEVEMENTS_CATALOG,
  getAchievementById,
  evaluateAchievements,
  createInitialStudioState,
  switchPaper,
  switchDifficulty,
  recordQuestionResult,
} = await import('../src/state/studioState.ts');

const {
  STORAGE_KEY,
  CURRENT_STATE_VERSION,
  isStorageAvailable,
  migrateState,
  loadStudioState,
  saveStudioState,
  resetStudioState,
  clearStorage,
  getInMemoryState,
} = await import('../src/state/storage.ts');

// ===========================================================================
// SECTION 1: Curated Zante Question Bank (src/data/zanteQuestions.ts)
// ===========================================================================
describe('Gamification Section 1: Curated Zante Questions Catalog', () => {
  const REQUIRED_CATEGORIES = [
    'elementary',
    'iced_coffee',
    'passenger_princess',
    'girl_math',
    'flirty_priorities',
    'matric_tropes',
  ];

  it('should provide at least 25 curated questions (strictly >= 25)', () => {
    assert.ok(
      ZANTE_QUESTIONS.length >= 25,
      `Expected at least 25 questions, got ${ZANTE_QUESTIONS.length}`
    );
  });

  it('should cover all 6 designated joke categories', () => {
    const presentCategories = new Set(ZANTE_QUESTIONS.map((q) => q.category));
    for (const cat of REQUIRED_CATEGORIES) {
      assert.ok(presentCategories.has(cat), `Missing required category: ${cat}`);
    }
  });

  it('should enforce exactly 4 distinct options per question', () => {
    for (const q of ZANTE_QUESTIONS) {
      assert.equal(q.options.length, 4, `Question ${q.id} does not have exactly 4 options`);
      const distinctOptions = new Set(q.options);
      assert.equal(
        distinctOptions.size,
        4,
        `Question ${q.id} options contain duplicates: ${JSON.stringify(q.options)}`
      );
    }
  });

  it('should enforce valid correctIndex integer in [0, 3]', () => {
    for (const q of ZANTE_QUESTIONS) {
      assert.ok(Number.isInteger(q.correctIndex), `correctIndex must be integer on ${q.id}`);
      assert.ok(
        q.correctIndex >= 0 && q.correctIndex <= 3,
        `correctIndex out of bounds [0, 3] on ${q.id}: ${q.correctIndex}`
      );
    }
  });

  it('should enforce non-empty witty roast and screenshot quote for every question', () => {
    for (const q of ZANTE_QUESTIONS) {
      assert.ok(q.wittyToast && q.wittyToast.trim().length > 10, `Missing wittyToast on ${q.id}`);
      assert.ok(
        q.screenshotQuote && q.screenshotQuote.trim().length > 10,
        `Missing screenshotQuote on ${q.id}`
      );
    }
  });

  it('should guarantee zero NaN or undefined in serialized questions', () => {
    const serialized = JSON.stringify(ZANTE_QUESTIONS);
    assert.ok(!serialized.includes('NaN'), 'Zante questions bank contains NaN');
    assert.ok(!serialized.includes('undefined'), 'Zante questions bank contains undefined');
    assert.ok(!serialized.includes('null'), 'Zante questions bank contains null');
  });

  it('should enforce unique IDs across all curated questions', () => {
    const seenIds = new Set();
    for (const q of ZANTE_QUESTIONS) {
      assert.ok(!seenIds.has(q.id), `Duplicate question ID: ${q.id}`);
      seenIds.add(q.id);
    }
  });

  it('should filter questions correctly by category via getZanteQuestionsByCategory', () => {
    for (const cat of REQUIRED_CATEGORIES) {
      const filtered = getZanteQuestionsByCategory(cat);
      assert.ok(filtered.length >= 4, `Category ${cat} should have >= 4 questions`);
      assert.ok(filtered.every((q) => q.category === cat));
    }
  });

  it('should look up questions by ID via getZanteQuestionById', () => {
    const q1 = getZanteQuestionById('zante_elem_01');
    assert.ok(q1);
    assert.equal(q1.category, 'elementary');
    assert.equal(q1.correctIndex, 0);

    const nonExistent = getZanteQuestionById('non_existent_id');
    assert.equal(nonExistent, undefined);
  });

  it('should pick random questions and honor excludeIds via getRandomZanteQuestion', () => {
    const q = getRandomZanteQuestion();
    assert.ok(q && q.id);

    const exclude = ['zante_elem_01', 'zante_elem_02', 'zante_elem_03'];
    for (let i = 0; i < 20; i++) {
      const sampled = getRandomZanteQuestion(exclude);
      assert.ok(!exclude.includes(sampled.id), `Sampled an excluded question: ${sampled.id}`);
    }
  });
});

// ===========================================================================
// SECTION 2: Parametric Zante Generator (src/generators/zanteGenerator.ts)
// ===========================================================================
describe('Gamification Section 2: Parametric Zante Generator Engine', () => {
  it('should generate valid individual category questions', () => {
    const elem = generateElementaryZante();
    assert.equal(elem.category, 'elementary');
    assert.equal(elem.options.length, 4);

    const coffee = generateIcedCoffeeZante();
    assert.equal(coffee.category, 'iced_coffee');
    assert.equal(coffee.options.length, 4);

    const pass = generatePassengerPrincessZante();
    assert.equal(pass.category, 'passenger_princess');
    assert.equal(pass.options.length, 4);

    const math = generateGirlMathZante();
    assert.equal(math.category, 'girl_math');
    assert.equal(math.options.length, 4);

    const flirt = generateFlirtyPrioritiesZante();
    assert.equal(flirt.category, 'flirty_priorities');
    assert.equal(flirt.options.length, 4);

    const trope = generateMatricTropesZante();
    assert.equal(trope.category, 'matric_tropes');
    assert.equal(trope.options.length, 4);
  });

  it('should run 100 randomized iterations with ZERO NaN, undefined, or duplicate options', () => {
    for (let i = 0; i < 100; i++) {
      const q = generateZanteQuestion();
      assert.ok(q.id && q.id.startsWith('zante_gen_'), `Invalid generated ID: ${q.id}`);
      assert.ok(q.questionText && q.questionText.length > 5, `Prompt empty in iteration ${i}`);
      assert.equal(q.options.length, 4, `Must have 4 options in iteration ${i}`);

      const distinctOptions = new Set(q.options);
      assert.equal(
        distinctOptions.size,
        4,
        `Generated question ${q.id} has duplicate options: ${JSON.stringify(q.options)}`
      );

      assert.ok(
        q.correctIndex >= 0 && q.correctIndex <= 3,
        `correctIndex out of bounds [0, 3] in iteration ${i}: ${q.correctIndex}`
      );

      assert.ok(q.wittyToast && q.wittyToast.length > 5);
      assert.ok(q.screenshotQuote && q.screenshotQuote.length > 5);

      const serialized = JSON.stringify(q);
      assert.ok(!serialized.includes('NaN'), `Generated question contains NaN on iteration ${i}`);
      assert.ok(
        !serialized.includes('undefined'),
        `Generated question contains undefined on iteration ${i}`
      );
    }
  });

  it('should support targeted category generation and batch generation', () => {
    const coffeeBatch = generateZanteQuestionBatch(10, 'iced_coffee');
    assert.equal(coffeeBatch.length, 10);
    assert.ok(coffeeBatch.every((q) => q.category === 'iced_coffee'));

    const mixedBatch = generateZanteQuestionBatch(15);
    assert.equal(mixedBatch.length, 15);
  });
});

// ===========================================================================
// SECTION 3: Studio State Initialization & Transitions (src/state/studioState.ts)
// ===========================================================================
describe('Gamification Section 3: Studio State Management', () => {
  it('should create initial studio state with valid defaults', () => {
    const state = createInitialStudioState();
    assert.equal(state.version, 1);
    assert.equal(state.difficultyMode, 'zante');
    assert.equal(state.activePaper, 'P1');
    assert.equal(state.activeTopic, 'algebra');
    assert.equal(state.streakCount, 0);
    assert.equal(state.highestStreak, 0);
    assert.equal(state.shieldActive, true);
    assert.equal(state.vipHypeVaultUnlocked, false);
    assert.equal(state.crownTapCount, 0);
    assert.deepEqual(state.completedQuestionIds, []);
    assert.deepEqual(state.unlockedAchievements, []);
  });

  it('should handle paper switching cleanly and set default topic', () => {
    const s0 = createInitialStudioState();
    const s1 = switchPaper(s0, 'P2');
    assert.equal(s1.activePaper, 'P2');
    assert.equal(s1.activeTopic, 'statistics');

    const s2 = switchPaper(s1, 'P1');
    assert.equal(s2.activePaper, 'P1');
    assert.equal(s2.activeTopic, 'algebra');
  });

  it('should switch difficulty mode and trigger roast on Andre -> Zante transition', () => {
    const s0 = createInitialStudioState();
    s0.difficultyMode = 'andre';

    const { newState, roastToast } = switchDifficulty(s0, 'zante');
    assert.equal(newState.difficultyMode, 'zante');
    assert.ok(roastToast && roastToast.includes('iced coffee'));
    assert.ok(newState.unlockedAchievements.includes('the_realist_switch'));

    // Zante -> Andre should NOT trigger roast toast
    const backToAndre = switchDifficulty(newState, 'andre');
    assert.equal(backToAndre.newState.difficultyMode, 'andre');
    assert.equal(backToAndre.roastToast, null);
  });
});

// ===========================================================================
// SECTION 4: Heat Meter Tiers & Milestone Toasts (src/state/studioState.ts)
// ===========================================================================
describe('Gamification Section 4: Heat Meter Tiers & Milestone Toasts', () => {
  it('should configure 5 escalating tiers with correct thresholds', () => {
    assert.equal(HEAT_METER_TIERS.length, 5);
    assert.equal(HEAT_METER_TIERS[0].name, 'Pearl Glow');
    assert.equal(HEAT_METER_TIERS[1].name, 'Rose Prism');
    assert.equal(HEAT_METER_TIERS[2].name, 'Golden Aurora');
    assert.equal(HEAT_METER_TIERS[3].name, 'Glacial Prism');
    assert.equal(HEAT_METER_TIERS[4].name, 'Liquid Diamond Supernova');
  });

  it('should classify streak counts accurately into tiers', () => {
    assert.equal(getStreakTier(0).tier, 0);
    assert.equal(getStreakTier(1).tier, 0);
    assert.equal(getStreakTier(2).tier, 0);

    assert.equal(getStreakTier(3).tier, 1);
    assert.equal(getStreakTier(4).tier, 1);

    assert.equal(getStreakTier(5).tier, 2);
    assert.equal(getStreakTier(9).tier, 2);

    assert.equal(getStreakTier(10).tier, 3);
    assert.equal(getStreakTier(19).tier, 3);

    assert.equal(getStreakTier(20).tier, 4);
    assert.equal(getStreakTier(45).tier, 4);
  });

  it('should return milestone toasts for 3, 5, 10, 20 streaks and null otherwise', () => {
    const t3 = getStreakMilestoneToast(3);
    assert.ok(t3 && t3.includes('algebra'));

    const t5 = getStreakMilestoneToast(5);
    assert.ok(t5 && t5.includes('5 in a row'));

    const t10 = getStreakMilestoneToast(10);
    assert.ok(t10 && t10.includes('10 in a row'));

    const t20 = getStreakMilestoneToast(20);
    assert.ok(t20 && t20.includes('20 STREAK'));

    assert.equal(getStreakMilestoneToast(1), null);
    assert.equal(getStreakMilestoneToast(4), null);
    assert.equal(getStreakMilestoneToast(7), null);
  });
});

// ===========================================================================
// SECTION 5: Pretty Privilege / Streak Shield State Machine
// ===========================================================================
describe('Gamification Section 5: Pretty Privilege / Streak Shield State Machine', () => {
  it('should initialize StreakShieldMachine with CHARGED status', () => {
    const sm = new StreakShieldMachine();
    assert.equal(sm.status, 'CHARGED');
    assert.equal(sm.streak, 0);
    assert.equal(sm.highestStreak, 0);
  });

  it('should arm shield when entering an L4 question', () => {
    const sm = new StreakShieldMachine();
    sm.enterQuestion('L4');
    assert.equal(sm.status, 'ARMED');

    // Entering L1, L2, L3 should not arm if CHARGED
    const sm2 = new StreakShieldMachine();
    sm2.enterQuestion('L2');
    assert.equal(sm2.status, 'CHARGED');
  });

  it('should preserve streak when an ARMED L4 question is answered incorrectly', () => {
    const sm = new StreakShieldMachine('CHARGED', 12);
    sm.enterQuestion('L4');
    assert.equal(sm.status, 'ARMED');

    const result = sm.submitAnswer(false, 'L4');
    assert.equal(result.streakProtected, true);
    assert.equal(result.shieldShattered, true);
    assert.equal(sm.status, 'SHATTERED');
    assert.equal(sm.streak, 12, 'Streak must remain frozen at 12');
  });

  it('should reset streak to 0 if answered incorrectly when shield is not ARMED', () => {
    const sm = new StreakShieldMachine('CHARGED', 7);
    sm.enterQuestion('L2'); // Not armed
    const result = sm.submitAnswer(false, 'L2');
    assert.equal(result.streakProtected, false);
    assert.equal(sm.streak, 0);
  });

  it('should recharge shattered shield after 5 consecutive correct answers', () => {
    const sm = new StreakShieldMachine('CHARGED', 5);
    sm.enterQuestion('L4');
    sm.submitAnswer(false, 'L4'); // Shatters shield, preserves streak=5
    assert.equal(sm.status, 'SHATTERED');

    // Submit 4 correct answers
    for (let i = 0; i < 4; i++) {
      const res = sm.submitAnswer(true, 'L2');
      assert.equal(sm.status, 'SHATTERED');
      assert.equal(res.reloaded, false);
    }

    // 5th correct answer
    const res5 = sm.submitAnswer(true, 'L3');
    assert.equal(res5.reloaded, true);
    assert.equal(sm.status, 'CHARGED', 'Shield must be fully reloaded');
    assert.equal(sm.streak, 10);
  });

  it('should record question results and trigger Pretty Privilege in recordQuestionResult', () => {
    let state = createInitialStudioState();
    state.streakCount = 9;
    state.highestStreak = 9;
    state.shieldActive = true;

    // Fail an L4 question with active shield
    const failL4 = recordQuestionResult(state, 'L4-Q01', false, 'L4');
    assert.equal(failL4.streakProtected, true);
    assert.equal(failL4.newState.streakCount, 9);
    assert.equal(failL4.newState.shieldActive, false);
    assert.ok(failL4.newAchievements.includes('pretty_privilege_shielded'));

    // Fail another question when shield is depleted -> streak resets
    const failAgain = recordQuestionResult(failL4.newState, 'L2-Q02', false, 'L2');
    assert.equal(failAgain.streakProtected, false);
    assert.equal(failAgain.newState.streakCount, 0);
  });
});

// ===========================================================================
// SECTION 6: Easter Eggs Engine (src/state/studioState.ts)
// ===========================================================================
describe('Gamification Section 6: Easter Eggs System Contracts', () => {
  it('should generate Andre -> Zante mode switch toast', () => {
    const roast = getModeSwitchRoast('andre', 'zante');
    assert.ok(roast && roast.includes('iced coffee'));

    assert.equal(getModeSwitchRoast('zante', 'andre'), null);
    assert.equal(getModeSwitchRoast('andre', 'andre'), null);
  });

  it('should detect late-night hours between 23:00 and 04:30', () => {
    assert.equal(isLateNightStudy(23, 0), true);
    assert.equal(isLateNightStudy(23, 59), true);
    assert.equal(isLateNightStudy(0, 15), true);
    assert.equal(isLateNightStudy(2, 30), true);
    assert.equal(isLateNightStudy(4, 15), true);
    assert.equal(isLateNightStudy(4, 30), true);

    // Outside late night window
    assert.equal(isLateNightStudy(4, 31), false);
    assert.equal(isLateNightStudy(5, 0), false);
    assert.equal(isLateNightStudy(12, 0), false);
    assert.equal(isLateNightStudy(22, 59), false);

    // Date object overload
    const lateDate = new Date(2026, 9, 23, 1, 45);
    assert.equal(isLateNightStudy(lateDate), true);

    const dayDate = new Date(2026, 9, 23, 14, 0);
    assert.equal(isLateNightStudy(dayDate), false);

    // isLateNight alias
    assert.equal(isLateNight(23, 45), true);
    assert.equal(isLateNight(15, 0), false);
  });

  it('should unlock VIP Hype Vault on 5 crown taps within 2.5 seconds', () => {
    const detector = new CrownTapDetector();
    const base = 20000;

    assert.equal(detector.tap(base), false);
    assert.equal(detector.tap(base + 400), false);
    assert.equal(detector.tap(base + 800), false);
    assert.equal(detector.tap(base + 1200), false);
    assert.equal(detector.tap(base + 1600), true, '5th tap within 2.5s must unlock vault');

    // Test slow taps failing to unlock
    const slowDetector = new CrownTapDetector();
    assert.equal(slowDetector.tap(base), false);
    assert.equal(slowDetector.tap(base + 3000), false); // >2500ms has elapsed
    assert.equal(slowDetector.tap(base + 3500), false);
    assert.equal(slowDetector.tap(base + 4000), false);
    assert.equal(slowDetector.tap(base + 4500), false);
    assert.equal(slowDetector.unlocked, false);
  });

  it('should contain verbatim 4-point disclaimer in ANDRE_VIP_DISCLAIMER', () => {
    assert.equal(DISCLAIMER_SECTIONS.length, 4);
    assert.equal(DISCLAIMER_SECTIONS[0], 'Mathematical Competence');
    assert.equal(DISCLAIMER_SECTIONS[1], 'The Purpose of This App');
    assert.equal(DISCLAIMER_SECTIONS[2], 'Emergency Calculus Protocol');
    assert.equal(DISCLAIMER_SECTIONS[3], 'The Official Guarantee');

    assert.ok(ANDRE_VIP_DISCLAIMER.section1.content.includes('demolishing this exam'));
    assert.ok(ANDRE_VIP_DISCLAIMER.section2.content.includes('0% tolerance for boring textbooks'));
    assert.ok(ANDRE_VIP_DISCLAIMER.section3.content.includes("f'(x) = 0"));
    assert.ok(ANDRE_VIP_DISCLAIMER.section4.content.includes('Potchefstroom'));
  });

  it('should grant VIP achievement and refill shield on unlockVipHypeVault', () => {
    const s0 = createInitialStudioState();
    s0.shieldActive = false;

    const { state: unlockedState, unlocked } = unlockVipHypeVault(s0);
    assert.equal(unlocked, true);
    assert.equal(unlockedState.vipHypeVaultUnlocked, true);
    assert.equal(unlockedState.shieldActive, true);
    assert.ok(unlockedState.unlockedAchievements.includes('vip_hype_vault'));
  });
});

// ===========================================================================
// SECTION 7: 15 Unlockable Achievements Catalog & Evaluation
// ===========================================================================
describe('Gamification Section 7: 15 Achievements Catalog', () => {
  it('should contain exactly 15 achievements', () => {
    assert.equal(ACHIEVEMENTS_CATALOG.length, 15);
  });

  it('should verify all achievements have id, title, description, and icon', () => {
    const ids = new Set();
    for (const a of ACHIEVEMENTS_CATALOG) {
      assert.ok(a.id && a.id.length > 2);
      assert.ok(!ids.has(a.id), `Duplicate achievement ID: ${a.id}`);
      ids.add(a.id);

      assert.ok(a.title && a.title.length > 3);
      assert.ok(a.description && a.description.length > 10);
      assert.ok(a.icon && a.icon.length >= 1);
    }
  });

  it('should evaluate and trigger achievement unlocks based on state', () => {
    const state = createInitialStudioState();
    state.streakCount = 10;
    state.highestStreak = 10;

    const unlocked = evaluateAchievements(state);
    assert.ok(unlocked.includes('first_spark'));
    assert.ok(unlocked.includes('unstoppable_flame'));

    const state20 = createInitialStudioState();
    state20.streakCount = 20;
    const unlocked20 = evaluateAchievements(state20);
    assert.ok(unlocked20.includes('supernova_prodigy'));
  });

  it('should look up achievements by ID via getAchievementById', () => {
    const ach = getAchievementById('supernova_prodigy');
    assert.ok(ach);
    assert.equal(ach.title, 'Supernova Prodigy');

    assert.equal(getAchievementById('fake_id'), undefined);
  });
});

// ===========================================================================
// SECTION 8: Persistence Layer & Storage Wrapper (src/state/storage.ts)
// ===========================================================================
describe('Gamification Section 8: State Persistence & Storage Wrapper', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('should save and load state in memory when window is undefined', () => {
    const s0 = createInitialStudioState();
    s0.streakCount = 8;
    s0.highestStreak = 15;
    s0.difficultyMode = 'andre';

    const saved = saveStudioState(s0);
    assert.equal(saved, true);

    const loaded = loadStudioState();
    assert.equal(loaded.streakCount, 8);
    assert.equal(loaded.highestStreak, 15);
    assert.equal(loaded.difficultyMode, 'andre');
  });

  it('should reset studio state back to default factory settings', () => {
    const s0 = createInitialStudioState();
    s0.streakCount = 15;
    saveStudioState(s0);

    const resetState = resetStudioState();
    assert.equal(resetState.streakCount, 0);
    assert.equal(resetState.highestStreak, 0);

    const loaded = loadStudioState();
    assert.equal(loaded.streakCount, 0);
  });

  it('should migrate partial, legacy, or corrupted states gracefully', () => {
    const corrupted = {
      version: 0,
      streakCount: -5, // Invalid negative
      difficultyMode: 'invalid_mode', // Invalid mode
      activePaper: 'P3', // Invalid paper
      completedQuestionIds: ['Q1', 42, null], // Malformed array
    };

    const migrated = migrateState(corrupted);
    assert.equal(migrated.version, CURRENT_STATE_VERSION);
    assert.equal(migrated.streakCount, 0); // Corrected
    assert.equal(migrated.difficultyMode, 'zante'); // Default fallback
    assert.equal(migrated.activePaper, 'P1'); // Default fallback
    assert.deepEqual(migrated.completedQuestionIds, ['Q1']); // Sanitized
  });

  it('should handle migrateState on null or undefined input', () => {
    const fromNull = migrateState(null);
    assert.equal(fromNull.version, CURRENT_STATE_VERSION);
    assert.equal(fromNull.streakCount, 0);

    const fromUndefined = migrateState(undefined);
    assert.equal(fromUndefined.version, CURRENT_STATE_VERSION);
  });
});
