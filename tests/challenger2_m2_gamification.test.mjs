/**
 * Zante's Matric Maths Studio — Challenger 2 Adversarial Gamification Test Suite
 *
 * Validates:
 * 1. Streak increments, highestStreak monotonicity, and Heat Meter tier progression (-5 to 100).
 * 2. Pretty Privilege Shield state transitions, L4 wrong answer protection, 5-question recovery, and re-protection.
 * 3. Normal wrong answers (L1-L3) resetting streak to 0 while preserving highestStreak.
 * 4. Late night study detector exhaustive 24-hour sweep, 04:30 boundary, and Date overloads.
 * 5. 5x Crown Tap VIP Hype Vault detector timing, perk state changes, and disclaimer text integrity.
 * 6. LocalStorage serialization, mock localStorage round-trip, quota errors, and corruption fuzzing.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

try {
  register('./tests/ts_resolver.mjs', import.meta.url);
} catch {
  // Already registered
}

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

// ============================================================================
// SUITE 1: Streak Increments & Heat Meter Tier Progression
// ============================================================================
describe('Challenger 2 Suite 1: Streak Increments & Heat Meter Tier Progression', () => {
  it('1.1 should correctly map negative, zero, and boundary streaks to Heat Meter tiers', () => {
    // Negative streaks should safely resolve to Tier 0
    assert.equal(getStreakTier(-10).tier, 0);
    assert.equal(getStreakTier(-1).tier, 0);

    // Tier 0: Pearl Glow (0 - 2)
    assert.equal(getStreakTier(0).tier, 0);
    assert.equal(getStreakTier(0).name, 'Pearl Glow');
    assert.equal(getStreakTier(1).tier, 0);
    assert.equal(getStreakTier(2).tier, 0);

    // Tier 1: Rose Prism (3 - 4)
    assert.equal(getStreakTier(3).tier, 1);
    assert.equal(getStreakTier(3).name, 'Rose Prism');
    assert.equal(getStreakTier(4).tier, 1);

    // Tier 2: Golden Aurora (5 - 9)
    assert.equal(getStreakTier(5).tier, 2);
    assert.equal(getStreakTier(5).name, 'Golden Aurora');
    assert.equal(getStreakTier(6).tier, 2);
    assert.equal(getStreakTier(9).tier, 2);

    // Tier 3: Glacial Prism (10 - 19)
    assert.equal(getStreakTier(10).tier, 3);
    assert.equal(getStreakTier(10).name, 'Glacial Prism');
    assert.equal(getStreakTier(15).tier, 3);
    assert.equal(getStreakTier(19).tier, 3);

    // Tier 4: Liquid Diamond Supernova (20+)
    assert.equal(getStreakTier(20).tier, 4);
    assert.equal(getStreakTier(20).name, 'Liquid Diamond Supernova');
    assert.equal(getStreakTier(25).tier, 4);
    assert.equal(getStreakTier(50).tier, 4);
    assert.equal(getStreakTier(100).tier, 4);
  });

  it('1.2 should return witty milestone toasts only at defined milestones (3, 5, 10, 20, 30, 40...)', () => {
    // Defined milestones
    const t3 = getStreakMilestoneToast(3);
    assert.ok(t3 && t3.includes('algebra'));

    const t5 = getStreakMilestoneToast(5);
    assert.ok(t5 && t5.includes('5 in a row'));

    const t10 = getStreakMilestoneToast(10);
    assert.ok(t10 && t10.includes('10 in a row'));

    const t20 = getStreakMilestoneToast(20);
    assert.ok(t20 && t20.includes('20 STREAK'));

    const t30 = getStreakMilestoneToast(30);
    assert.ok(t30 && t30.includes('30 STREAK! Liquid Diamond God-Tier'));

    const t50 = getStreakMilestoneToast(50);
    assert.ok(t50 && t50.includes('50 STREAK! Liquid Diamond God-Tier'));

    // Non-milestone values must return null
    for (const nonMilestone of [-5, 0, 1, 2, 4, 6, 7, 8, 9, 11, 14, 19, 21, 25, 29, 31, 39, 41]) {
      assert.equal(
        getStreakMilestoneToast(nonMilestone),
        null,
        `Streak ${nonMilestone} should not produce a milestone toast`
      );
    }
  });

  it('1.3 should monotonically increment streaks and trigger achievements across 30 correct answers', () => {
    let state = createInitialStudioState();
    assert.equal(state.streakCount, 0);
    assert.equal(state.highestStreak, 0);

    for (let step = 1; step <= 30; step++) {
      const qId = `P1_ALG_${step.toString().padStart(3, '0')}`;
      const result = recordQuestionResult(state, qId, true, 'L2');
      state = result.newState;

      assert.equal(state.streakCount, step, `Step ${step}: streakCount mismatch`);
      assert.equal(state.highestStreak, step, `Step ${step}: highestStreak mismatch`);
      assert.ok(state.completedQuestionIds.includes(qId));

      if (step === 3) {
        assert.ok(result.milestoneToast && result.milestoneToast.includes('algebra'));
        assert.ok(state.unlockedAchievements.includes('first_spark'));
      } else if (step === 5) {
        assert.ok(result.milestoneToast && result.milestoneToast.includes('5 in a row'));
      } else if (step === 10) {
        assert.ok(result.milestoneToast && result.milestoneToast.includes('10 in a row'));
        assert.ok(state.unlockedAchievements.includes('unstoppable_flame'));
      } else if (step === 20) {
        assert.ok(result.milestoneToast && result.milestoneToast.includes('20 STREAK'));
        assert.ok(state.unlockedAchievements.includes('supernova_prodigy'));
      } else if (step === 30) {
        assert.ok(result.milestoneToast && result.milestoneToast.includes('30 STREAK'));
      } else {
        assert.equal(result.milestoneToast, null, `Step ${step} should not have milestone toast`);
      }
    }
  });
});

// ============================================================================
// SUITE 2: Pretty Privilege Shield State Machine & Behavior
// ============================================================================
describe('Challenger 2 Suite 2: Pretty Privilege Shield State Machine & Behavior', () => {
  it('2.1 should initialize in CHARGED state and only arm on Level 4 questions', () => {
    const sm = new StreakShieldMachine();
    assert.equal(sm.status, 'CHARGED');
    assert.equal(sm.recoveryCount, 0);
    assert.equal(sm.streak, 0);

    // L1, L2, L3 do NOT arm the shield
    sm.enterQuestion('L1');
    assert.equal(sm.status, 'CHARGED');

    sm.enterQuestion('L2');
    assert.equal(sm.status, 'CHARGED');

    sm.enterQuestion('L3');
    assert.equal(sm.status, 'CHARGED');

    // Only L4 arms the shield
    sm.enterQuestion('L4');
    assert.equal(sm.status, 'ARMED');
  });

  it('2.2 should protect streak on Level 4 wrong answer and shatter shield', () => {
    const sm = new StreakShieldMachine('CHARGED', 14);
    sm.enterQuestion('L4');
    assert.equal(sm.status, 'ARMED');

    const result = sm.submitAnswer(false, 'L4');
    assert.equal(result.streakProtected, true, 'Streak must be protected on L4 failure');
    assert.equal(result.shieldShattered, true, 'Shield must shatter on L4 failure');
    assert.equal(result.reloaded, false);
    assert.equal(sm.status, 'SHATTERED');
    assert.equal(sm.streak, 14, 'Streak must be preserved at 14');
    assert.equal(sm.highestStreak, 14);
  });

  it('2.3 should recharge shattered shield after exactly 5 subsequent eligible correct answers', () => {
    const sm = new StreakShieldMachine('CHARGED', 8);
    sm.enterQuestion('L4');
    sm.submitAnswer(false, 'L4');
    assert.equal(sm.status, 'SHATTERED');
    assert.equal(sm.streak, 8);

    // Answer 4 consecutive questions correctly -> must remain SHATTERED
    for (let i = 1; i <= 4; i++) {
      const res = sm.submitAnswer(true, 'L2');
      assert.equal(sm.status, 'SHATTERED', `After ${i} answers, should still be SHATTERED`);
      assert.equal(sm.recoveryCount, i, `Recovery count should be ${i}`);
      assert.equal(res.reloaded, false);
      assert.equal(sm.streak, 8 + i);
    }

    // 5th consecutive correct answer -> must recharge to CHARGED
    const res5 = sm.submitAnswer(true, 'L3');
    assert.equal(res5.reloaded, true, '5th correct answer must report reloaded: true');
    assert.equal(sm.status, 'CHARGED', 'Shield must be fully reloaded to CHARGED');
    assert.equal(sm.recoveryCount, 0, 'Recovery counter should reset to 0');
    assert.equal(sm.streak, 13);
  });

  it('2.4 should successfully protect streak again on another L4 question after recharge', () => {
    const sm = new StreakShieldMachine('CHARGED', 10);
    sm.enterQuestion('L4');
    sm.submitAnswer(false, 'L4'); // 1st shatter, streak stays 10
    assert.equal(sm.status, 'SHATTERED');
    assert.equal(sm.streak, 10);

    // Recharge with 5 correct answers
    for (let i = 0; i < 5; i++) {
      sm.submitAnswer(true, 'L2');
    }
    assert.equal(sm.status, 'CHARGED');
    assert.equal(sm.streak, 15);

    // Enter another L4 question and fail again
    sm.enterQuestion('L4');
    assert.equal(sm.status, 'ARMED');
    const secondProtection = sm.submitAnswer(false, 'L4');
    assert.equal(secondProtection.streakProtected, true);
    assert.equal(secondProtection.shieldShattered, true);
    assert.equal(sm.status, 'SHATTERED');
    assert.equal(sm.streak, 15, 'Streak must be preserved at 15 on second protection');
  });

  it('2.5 should disarm back to CHARGED if Level 4 question is answered correctly', () => {
    const sm = new StreakShieldMachine('CHARGED', 5);
    sm.enterQuestion('L4');
    assert.equal(sm.status, 'ARMED');

    const result = sm.submitAnswer(true, 'L4');
    assert.equal(result.streakProtected, false);
    assert.equal(result.shieldShattered, false);
    assert.equal(sm.status, 'CHARGED', 'Correct L4 answer should disarm to CHARGED');
    assert.equal(sm.streak, 6);
  });

  it('2.6 should verify recordQuestionResult Pretty Privilege shield protection and achievement unlock', () => {
    let state = createInitialStudioState();
    state.streakCount = 11;
    state.highestStreak = 11;
    state.shieldActive = true;

    // Fail an L4 question with active shield
    const failL4 = recordQuestionResult(state, 'L4-TRIG-01', false, 'L4');
    assert.equal(failL4.streakProtected, true);
    assert.equal(failL4.newState.streakCount, 11, 'Streak must stay at 11');
    assert.equal(failL4.newState.shieldActive, false, 'Shield must be deactivated');
    assert.ok(
      failL4.newAchievements.includes('pretty_privilege_shielded'),
      'Must award pretty_privilege_shielded achievement'
    );

    // Fail another L4 question now that shield is deactivated
    const failL4Again = recordQuestionResult(failL4.newState, 'L4-TRIG-02', false, 'L4');
    assert.equal(failL4Again.streakProtected, false, 'Cannot protect when shield is inactive');
    assert.equal(failL4Again.newState.streakCount, 0, 'Streak must reset to 0');
    assert.equal(failL4Again.newState.highestStreak, 11, 'highestStreak must remain 11');
  });
});

// ============================================================================
// SUITE 3: Normal Wrong Answer (L1-L3) Resets Streak to 0
// ============================================================================
describe('Challenger 2 Suite 3: Normal Wrong Answer (L1-L3) Resets Streak to 0', () => {
  it('3.1 should reset streak to 0 for wrong answers on L1, L2, L3 in StreakShieldMachine', () => {
    for (const level of ['L1', 'L2', 'L3']) {
      const sm = new StreakShieldMachine('CHARGED', 12);
      sm.enterQuestion(level);
      assert.equal(sm.status, 'CHARGED', `${level} must not arm shield`);

      const res = sm.submitAnswer(false, level);
      assert.equal(res.streakProtected, false);
      assert.equal(res.shieldShattered, false);
      assert.equal(sm.streak, 0, `Streak must reset to 0 on wrong ${level}`);
      assert.equal(sm.highestStreak, 12, 'highestStreak must be preserved');
      assert.equal(sm.status, 'CHARGED', 'Shield remains CHARGED for future L4');
    }
  });

  it('3.2 should reset streak to 0 for wrong answers on L1, L2, L3 in recordQuestionResult', () => {
    for (const level of ['L1', 'L2', 'L3']) {
      const state = createInitialStudioState();
      state.streakCount = 9;
      state.highestStreak = 15;
      state.shieldActive = true;

      const res = recordQuestionResult(state, `Q-${level}`, false, level);
      assert.equal(res.streakProtected, false);
      assert.equal(res.newState.streakCount, 0, `Streak must reset to 0 on ${level}`);
      assert.equal(res.newState.highestStreak, 15, 'highestStreak must not be wiped');
      assert.equal(res.newState.shieldActive, true, 'Shield must remain active for future L4');
    }
  });

  it('3.3 should reset streak to 0 when cognitive level is undefined / omitted on wrong answer', () => {
    const state = createInitialStudioState();
    state.streakCount = 7;
    state.highestStreak = 7;

    const res = recordQuestionResult(state, 'Q-UNSPECIFIED', false);
    assert.equal(res.streakProtected, false);
    assert.equal(res.newState.streakCount, 0);
    assert.equal(res.newState.highestStreak, 7);
  });
});

// ============================================================================
// SUITE 4: Late-Night Study Detector Exhaustive Sweep (Hours 0..23)
// ============================================================================
describe('Challenger 2 Suite 4: Late-Night Study Detector Sweep & Boundaries', () => {
  it('4.1 should return true for late night hours (23, 0, 1, 2, 3) and false for normal hours (5..22)', () => {
    const lateHours = [23, 0, 1, 2, 3];
    for (const h of lateHours) {
      assert.equal(isLateNightStudy(h, 0), true, `Hour ${h}:00 should be late night`);
      assert.equal(isLateNightStudy(h, 30), true, `Hour ${h}:30 should be late night`);
      assert.equal(isLateNightStudy(h, 59), true, `Hour ${h}:59 should be late night`);
    }

    const dayHours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    for (const h of dayHours) {
      assert.equal(isLateNightStudy(h, 0), false, `Hour ${h}:00 should NOT be late night`);
      assert.equal(isLateNightStudy(h, 30), false, `Hour ${h}:30 should NOT be late night`);
      assert.equal(isLateNightStudy(h, 59), false, `Hour ${h}:59 should NOT be late night`);
    }
  });

  it('4.2 should strictly test the 04:30 cutoff boundary in hour 4', () => {
    assert.equal(isLateNightStudy(4, 0), true, '04:00 must be late night');
    assert.equal(isLateNightStudy(4, 15), true, '04:15 must be late night');
    assert.equal(isLateNightStudy(4, 29), true, '04:29 must be late night');
    assert.equal(isLateNightStudy(4, 30), true, '04:30 must be late night (inclusive edge)');

    assert.equal(isLateNightStudy(4, 31), false, '04:31 must NOT be late night');
    assert.equal(isLateNightStudy(4, 45), false, '04:45 must NOT be late night');
    assert.equal(isLateNightStudy(4, 59), false, '04:59 must NOT be late night');
  });

  it('4.3 should strictly test the 23:00 boundary in hour 22 vs 23', () => {
    assert.equal(isLateNightStudy(22, 59), false, '22:59 must NOT be late night');
    assert.equal(isLateNightStudy(23, 0), true, '23:00 must be late night');
  });

  it('4.4 should correctly parse Date object inputs across boundaries', () => {
    // 02:45 late night
    const lateDate = new Date(2026, 9, 23, 2, 45);
    assert.equal(isLateNightStudy(lateDate), true);

    // 04:30 late night
    const cutoffDate = new Date(2026, 9, 23, 4, 30);
    assert.equal(isLateNightStudy(cutoffDate), true);

    // 04:31 normal
    const postCutoffDate = new Date(2026, 9, 23, 4, 31);
    assert.equal(isLateNightStudy(postCutoffDate), false);

    // 15:00 normal
    const afternoonDate = new Date(2026, 9, 23, 15, 0);
    assert.equal(isLateNightStudy(afternoonDate), false);
  });

  it('4.5 should verify isLateNight alias is strictly consistent with isLateNightStudy', () => {
    for (let h = 0; h < 24; h++) {
      for (const m of [0, 15, 30, 31, 45, 59]) {
        assert.equal(
          isLateNight(h, m),
          isLateNightStudy(h, m),
          `Inconsistency at ${h}:${m}`
        );
      }
    }
  });

  it('4.6 should award night_owl_scholar achievement when study timestamp is in late hours', () => {
    const state = createInitialStudioState();
    // Set timestamp to 01:30 AM
    const lateNightDate = new Date(2026, 9, 23, 1, 30);
    state.lastStudyTimestamp = lateNightDate.getTime();

    const unlocked = evaluateAchievements(state);
    assert.ok(
      unlocked.includes('night_owl_scholar'),
      'Should award night_owl_scholar for late night study'
    );
  });
});

// ============================================================================
// SUITE 5: 5x Crown Tap VIP Hype Vault & Perk State
// ============================================================================
describe('Challenger 2 Suite 5: 5x Crown Tap VIP Hype Vault & Perk State', () => {
  it('5.1 should unlock on exactly 5 rapid taps within 2500ms', () => {
    const detector = new CrownTapDetector();
    const t0 = 100000;

    assert.equal(detector.tap(t0), false);
    assert.equal(detector.tap(t0 + 200), false);
    assert.equal(detector.tap(t0 + 400), false);
    assert.equal(detector.tap(t0 + 600), false);
    assert.equal(detector.tap(t0 + 800), true, '5th tap must unlock vault');
    assert.equal(detector.unlocked, true);

    // Subsequent taps remain unlocked
    assert.equal(detector.tap(t0 + 1000), true);
  });

  it('5.2 should NOT unlock when taps exceed the 2500ms sliding window', () => {
    const detector = new CrownTapDetector();
    const t0 = 100000;

    // 4 taps spaced across 3000ms
    assert.equal(detector.tap(t0), false);
    assert.equal(detector.tap(t0 + 800), false);
    assert.equal(detector.tap(t0 + 1600), false);
    assert.equal(detector.tap(t0 + 2400), false);
    // 5th tap at t0 + 3200ms -> t0 (diff 3200 > 2500) has expired, leaving 4 taps
    assert.equal(detector.tap(t0 + 3200), false);
    assert.equal(detector.unlocked, false);
  });

  it('5.3 should reset detector state cleanly via reset()', () => {
    const detector = new CrownTapDetector();
    const t0 = 50000;
    for (let i = 0; i < 5; i++) {
      detector.tap(t0 + i * 100);
    }
    assert.equal(detector.unlocked, true);

    detector.reset();
    assert.equal(detector.unlocked, false);
    assert.equal(detector.taps.length, 0);
  });

  it('5.4 should set perk state: refill shield, unlock vault, and grant achievement on unlockVipHypeVault', () => {
    const state = createInitialStudioState();
    state.shieldActive = false; // Shattered
    state.vipHypeVaultUnlocked = false;

    const { state: unlockedState, unlocked } = unlockVipHypeVault(state);
    assert.equal(unlocked, true);
    assert.equal(unlockedState.vipHypeVaultUnlocked, true, 'Vault must be marked unlocked');
    assert.equal(unlockedState.shieldActive, true, 'Shield must be refilled as a perk');
    assert.ok(
      unlockedState.unlockedAchievements.includes('vip_hype_vault'),
      'vip_hype_vault achievement must be awarded'
    );

    // Calling unlock again should be idempotent without duplicate achievements
    const secondUnlock = unlockVipHypeVault(unlockedState);
    const count = secondUnlock.state.unlockedAchievements.filter((a) => a === 'vip_hype_vault').length;
    assert.equal(count, 1, 'Achievement should not be duplicated');
  });

  it('5.5 should contain verbatim 4-point disclaimer text from Andre in ANDRE_VIP_DISCLAIMER', () => {
    assert.equal(DISCLAIMER_SECTIONS.length, 4);
    assert.equal(DISCLAIMER_SECTIONS[0], 'Mathematical Competence');
    assert.equal(DISCLAIMER_SECTIONS[1], 'The Purpose of This App');
    assert.equal(DISCLAIMER_SECTIONS[2], 'Emergency Calculus Protocol');
    assert.equal(DISCLAIMER_SECTIONS[3], 'The Official Guarantee');

    assert.ok(
      ANDRE_VIP_DISCLAIMER.section1.content.includes('demolishing this exam') &&
      ANDRE_VIP_DISCLAIMER.section1.content.includes('150 marks in Paper 1'),
      'Section 1 content mismatch'
    );

    assert.ok(
      ANDRE_VIP_DISCLAIMER.section2.content.includes('0% tolerance for boring textbooks'),
      'Section 2 content mismatch'
    );

    assert.ok(
      ANDRE_VIP_DISCLAIMER.section3.content.includes("f'(x) = 0") &&
      ANDRE_VIP_DISCLAIMER.section3.content.includes('Take the derivative'),
      'Section 3 content mismatch'
    );

    assert.ok(
      ANDRE_VIP_DISCLAIMER.section4.content.includes('Potchefstroom') &&
      ANDRE_VIP_DISCLAIMER.section4.content.includes('Andre mode'),
      'Section 4 content mismatch'
    );
  });
});

// ============================================================================
// SUITE 6: LocalStorage Serialization, Round-Trip Restoration & Corruption
// ============================================================================
describe('Challenger 2 Suite 6: LocalStorage Serialization, Round-Trip & Corruption', () => {
  beforeEach(() => {
    clearStorage();
  });

  afterEach(() => {
    clearStorage();
    if (globalThis.window) {
      delete globalThis.window;
    }
  });

  it('6.1 should serialize and restore complex studio state in-memory', () => {
    const complexState = createInitialStudioState();
    complexState.streakCount = 18;
    complexState.highestStreak = 24;
    complexState.difficultyMode = 'andre';
    complexState.activePaper = 'P2';
    complexState.activeTopic = 'trigonometry';
    complexState.shieldActive = false;
    complexState.vipHypeVaultUnlocked = true;
    complexState.crownTapCount = 5;
    complexState.completedQuestionIds = ['P1-01', 'P1-02', 'P2-01', 'P2-02'];
    complexState.unlockedAchievements = ['first_spark', 'unstoppable_flame', 'vip_hype_vault'];

    const saved = saveStudioState(complexState);
    assert.equal(saved, true);

    const loaded = loadStudioState();
    assert.deepEqual(loaded, complexState);
  });

  it('6.2 should serialize to and restore from mock window.localStorage', () => {
    const mockStorageMap = new Map();
    globalThis.window = {
      localStorage: {
        getItem: (k) => (mockStorageMap.has(k) ? mockStorageMap.get(k) : null),
        setItem: (k, v) => mockStorageMap.set(k, String(v)),
        removeItem: (k) => mockStorageMap.delete(k),
        clear: () => mockStorageMap.clear(),
      },
    };

    assert.equal(isStorageAvailable(), true);

    const state = createInitialStudioState();
    state.streakCount = 22;
    state.highestStreak = 22;
    state.difficultyMode = 'andre';

    const saved = saveStudioState(state);
    assert.equal(saved, true);

    // Verify raw JSON string stored under STORAGE_KEY
    const rawStored = mockStorageMap.get(STORAGE_KEY);
    assert.ok(rawStored, 'Storage key must contain stored JSON');
    assert.ok(!rawStored.includes('NaN'), 'Stored JSON must not contain NaN');
    assert.ok(!rawStored.includes('undefined'), 'Stored JSON must not contain undefined');

    const parsed = JSON.parse(rawStored);
    assert.equal(parsed.streakCount, 22);
    assert.equal(parsed.difficultyMode, 'andre');

    // Load state back
    const restored = loadStudioState();
    assert.equal(restored.streakCount, 22);
    assert.equal(restored.highestStreak, 22);
    assert.equal(restored.difficultyMode, 'andre');

    // Reset state removes key from mock localStorage
    resetStudioState();
    assert.equal(mockStorageMap.has(STORAGE_KEY), false);
  });

  it('6.3 should gracefully handle corrupt JSON syntax in localStorage without crashing', () => {
    const mockStorageMap = new Map();
    mockStorageMap.set(STORAGE_KEY, '{"streakCount": 15, "brokenJson": '); // Truncated JSON
    globalThis.window = {
      localStorage: {
        getItem: (k) => (mockStorageMap.has(k) ? mockStorageMap.get(k) : null),
        setItem: (k, v) => mockStorageMap.set(k, String(v)),
        removeItem: (k) => mockStorageMap.delete(k),
      },
    };

    // loadStudioState should catch JSON syntax error and fall back to fresh default state
    const state = loadStudioState();
    assert.ok(state);
    assert.equal(state.version, CURRENT_STATE_VERSION);
    assert.equal(state.streakCount, 0);
  });

  it('6.4 should fuzz and sanitize malformed data in migrateState', () => {
    // Test null, undefined, primitive inputs
    assert.equal(migrateState(null).version, CURRENT_STATE_VERSION);
    assert.equal(migrateState(undefined).version, CURRENT_STATE_VERSION);
    assert.equal(migrateState(12345).version, CURRENT_STATE_VERSION);
    assert.equal(migrateState('corrupted_string').version, CURRENT_STATE_VERSION);
    assert.equal(migrateState([]).version, CURRENT_STATE_VERSION);

    // Test malformed properties
    const malformed = {
      version: -5,
      streakCount: -100, // Invalid negative streak
      highestStreak: 2, // Less than streakCount when streak is corrected
      difficultyMode: 'hacker_mode', // Invalid mode
      activePaper: 'P3', // Invalid paper
      shieldActive: 'not_a_boolean', // Invalid type
      vipHypeVaultUnlocked: 42, // Invalid type
      crownTapCount: 'five', // Invalid type
      completedQuestionIds: ['Q1', null, 999, 'Q2', undefined, {}], // Contaminated array
      unlockedAchievements: [123, 'first_spark', null], // Contaminated array
    };

    const sanitized = migrateState(malformed);
    assert.equal(sanitized.version, CURRENT_STATE_VERSION);
    assert.equal(sanitized.streakCount, 0, 'Negative streakCount must be clamped to 0');
    assert.equal(sanitized.highestStreak, 2, 'highestStreak should be preserved');
    assert.equal(sanitized.difficultyMode, 'zante', 'Invalid difficultyMode must fall back to zante');
    assert.equal(sanitized.activePaper, 'P1', 'Invalid activePaper must fall back to P1');
    assert.equal(sanitized.shieldActive, true, 'Invalid shieldActive must default to true');
    assert.equal(sanitized.vipHypeVaultUnlocked, false, 'Invalid vipHypeVaultUnlocked must default to false');
    assert.equal(sanitized.crownTapCount, 0, 'Invalid crownTapCount must default to 0');
    assert.deepEqual(sanitized.completedQuestionIds, ['Q1', 'Q2'], 'Must filter to strings only');
    assert.deepEqual(sanitized.unlockedAchievements, ['first_spark'], 'Must filter to strings only');
  });

  it('6.5 should ensure highestStreak is always clamped to at least streakCount', () => {
    const stateWithInconsistentStreaks = {
      version: 1,
      streakCount: 25,
      highestStreak: 5, // Invariant violation: highest < current
    };

    const migrated = migrateState(stateWithInconsistentStreaks);
    assert.equal(migrated.streakCount, 25);
    assert.equal(migrated.highestStreak, 25, 'highestStreak must be clamped to at least streakCount');
  });

  it('6.6 should handle QuotaExceededError when saving without crashing', () => {
    globalThis.window = {
      localStorage: {
        getItem: () => null,
        setItem: (key) => {
          if (key === STORAGE_KEY) {
            throw new Error('QuotaExceededError: storage limit reached');
          }
        },
        removeItem: () => {},
      },
    };

    const state = createInitialStudioState();
    state.streakCount = 5;

    // saveStudioState should catch error, return false, and not throw
    const success = saveStudioState(state);
    assert.equal(success, false, 'Should return false on quota error');

    // In-memory store should still hold the state
    assert.equal(getInMemoryState()?.streakCount, 5);
  });
});

// ============================================================================
// SUITE 7: Adversarial Multi-Step Simulation, Shield Nuances & Fuzzing
// ============================================================================
describe('Challenger 2 Suite 7: Multi-Step Simulation, Shield Nuances & Fuzzing', () => {
  it('7.1 should execute a full user lifecycle journey across all gamification subsystems', () => {
    // 1. Initial State: starts in Zante mode, Paper 1, Algebra
    let state = createInitialStudioState();
    assert.equal(state.difficultyMode, 'zante');
    assert.equal(state.activePaper, 'P1');

    // 2. Switch to Andre mode to study serious maths
    const switchRes = switchDifficulty(state, 'andre');
    state = switchRes.newState;
    assert.equal(state.difficultyMode, 'andre');
    assert.equal(switchRes.roastToast, null, 'Zante -> Andre should NOT trigger roast toast');

    // 3. Answer 10 Andre questions correctly (Level 2/3) -> Streak 10 (Tier 3)
    for (let i = 1; i <= 10; i++) {
      const res = recordQuestionResult(state, `ANDRE_P1_${i}`, true, 'L2');
      state = res.newState;
    }
    assert.equal(state.streakCount, 10);
    assert.equal(state.highestStreak, 10);
    assert.equal(getStreakTier(state.streakCount).tier, 3);
    assert.ok(state.unlockedAchievements.includes('first_spark'));
    assert.ok(state.unlockedAchievements.includes('unstoppable_flame'));

    // 4. Overwhelmed by calculus, switch back to Zante mode -> Roast Toast + Achievement!
    const backToZante = switchDifficulty(state, 'zante');
    state = backToZante.newState;
    assert.equal(state.difficultyMode, 'zante');
    assert.ok(backToZante.roastToast && backToZante.roastToast.includes('iced coffee'));
    assert.ok(state.unlockedAchievements.includes('the_realist_switch'));

    // 5. Late night study at 01:30 AM
    state.lastStudyTimestamp = new Date(2026, 9, 23, 1, 30).getTime();
    const lateNightAchs = evaluateAchievements(state);
    state.unlockedAchievements = [...new Set([...state.unlockedAchievements, ...lateNightAchs])];
    assert.ok(state.unlockedAchievements.includes('night_owl_scholar'));

    // 6. User taps Zante's crown badge 5 times rapidly
    const detector = new CrownTapDetector();
    const tapNow = Date.now();
    for (let i = 0; i < 5; i++) {
      detector.tap(tapNow + i * 150);
    }
    assert.equal(detector.unlocked, true);

    const vaultRes = unlockVipHypeVault(state);
    state = vaultRes.state;
    assert.equal(state.vipHypeVaultUnlocked, true);
    assert.equal(state.shieldActive, true);
    assert.ok(state.unlockedAchievements.includes('vip_hype_vault'));

    // 7. Enters brutal Level 4 problem solving question and fails -> Pretty Privilege triggers!
    const failL4 = recordQuestionResult(state, 'ANDRE_L4_BRUTAL', false, 'L4');
    state = failL4.newState;
    assert.equal(failL4.streakProtected, true, 'Pretty Privilege must protect streak at 10');
    assert.equal(state.streakCount, 10, 'Streak remains frozen at 10');
    assert.equal(state.shieldActive, false, 'Shield is now shattered');
    assert.ok(state.unlockedAchievements.includes('pretty_privilege_shielded'));

    // 8. Subsequent normal wrong answer (L2) with shattered shield -> streak drops to 0!
    const failL2 = recordQuestionResult(state, 'ANDRE_L2_OOPS', false, 'L2');
    state = failL2.newState;
    assert.equal(failL2.streakProtected, false);
    assert.equal(state.streakCount, 0, 'Streak must drop to 0');
    assert.equal(state.highestStreak, 10, 'highestStreak must remain 10');
  });

  it('7.2 should verify StreakShieldMachine recovery behavior with Level 1 vs Level 2-4 questions', () => {
    const sm = new StreakShieldMachine('CHARGED', 6);
    sm.enterQuestion('L4');
    sm.submitAnswer(false, 'L4'); // Shatters shield, streak=6
    assert.equal(sm.status, 'SHATTERED');

    // Level 1 questions (knowledge recall) should NOT count toward recovery
    const resL1 = sm.submitAnswer(true, 'L1');
    assert.equal(resL1.reloaded, false);
    assert.equal(sm.recoveryCount, 0, 'L1 must not increment recoveryCount');
    assert.equal(sm.status, 'SHATTERED');

    // 5 Level 2-4 questions recharge the shield
    sm.submitAnswer(true, 'L2');
    assert.equal(sm.recoveryCount, 1);
    sm.submitAnswer(true, 'L3');
    assert.equal(sm.recoveryCount, 2);
    sm.submitAnswer(true, 'L4');
    assert.equal(sm.recoveryCount, 3);
    sm.submitAnswer(true, 'L2');
    assert.equal(sm.recoveryCount, 4);
    const resFinal = sm.submitAnswer(true, 'L3');
    assert.equal(resFinal.reloaded, true);
    assert.equal(sm.status, 'CHARGED', 'Shield fully recharged');
    assert.equal(sm.recoveryCount, 0);
  });

  it('7.3 should fuzz migrateState with 100 randomly generated corrupt and hostile payloads without throwing', () => {
    const hostileInputs = [
      null,
      undefined,
      0,
      -1,
      1e10,
      NaN,
      Infinity,
      -Infinity,
      '',
      '{"evil": true}',
      true,
      false,
      [],
      [1, 2, 3],
      {},
      { constructor: Object },
      { __proto__: { admin: true } },
      { version: 'NaN', streakCount: {} },
      { activePaper: 'P4', difficultyMode: 'nightmare' },
      { completedQuestionIds: new Array(50).fill(null) },
      { unlockedAchievements: [{}, [], true, 42, null] },
      { lastStudyTimestamp: 'yesterday' },
      { crownTapCount: -999999 },
    ];

    for (let i = 0; i < hostileInputs.length; i++) {
      assert.doesNotThrow(() => {
        const state = migrateState(hostileInputs[i]);
        assert.equal(state.version, CURRENT_STATE_VERSION);
        assert.ok(Number.isInteger(state.streakCount) && state.streakCount >= 0);
        assert.ok(Number.isInteger(state.highestStreak) && state.highestStreak >= state.streakCount);
        assert.ok(state.difficultyMode === 'zante' || state.difficultyMode === 'andre');
        assert.ok(state.activePaper === 'P1' || state.activePaper === 'P2');
        assert.ok(typeof state.shieldActive === 'boolean');
        assert.ok(typeof state.vipHypeVaultUnlocked === 'boolean');
        assert.ok(Array.isArray(state.completedQuestionIds));
        assert.ok(Array.isArray(state.unlockedAchievements));
      }, `migrateState threw an exception on hostile input index ${i}`);
    }

    // Generate 80 randomized randomized fuzz objects
    for (let i = 0; i < 80; i++) {
      const fuzz = {
        version: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : 'v' + i,
        streakCount: Math.random() > 0.5 ? Math.floor((Math.random() - 0.5) * 100) : null,
        highestStreak: Math.floor(Math.random() * 50),
        difficultyMode: ['zante', 'andre', 'hardcore', '', 123][i % 5],
        activePaper: ['P1', 'P2', 'P3', null, {}][i % 5],
        shieldActive: [true, false, 'yes', null, 0][i % 5],
        completedQuestionIds: [Math.random() > 0.5 ? `Q_${i}` : null, 123, undefined],
        unlockedAchievements: [Math.random() > 0.5 ? 'first_spark' : {}],
      };

      assert.doesNotThrow(() => {
        const state = migrateState(fuzz);
        assert.ok(state.version >= CURRENT_STATE_VERSION);
        assert.ok(state.streakCount >= 0);
        assert.ok(state.highestStreak >= state.streakCount);
      });
    }
  });

  it('7.4 should serialize and restore 1,000 completed question IDs and all 15 achievements with zero degradation', () => {
    const largeState = createInitialStudioState();
    largeState.streakCount = 45;
    largeState.highestStreak = 60;
    largeState.difficultyMode = 'andre';
    largeState.activePaper = 'P2';
    largeState.activeTopic = 'euclidean_geometry';
    largeState.shieldActive = true;
    largeState.vipHypeVaultUnlocked = true;
    largeState.crownTapCount = 5;

    // 1,000 distinct completed IDs
    largeState.completedQuestionIds = Array.from({ length: 1000 }, (_, i) => `NSC_2026_Q_${i.toString().padStart(4, '0')}`);
    // All 15 achievements
    largeState.unlockedAchievements = ACHIEVEMENTS_CATALOG.map((a) => a.id);

    // Round-trip through JSON and saveStudioState
    const saved = saveStudioState(largeState);
    assert.equal(saved, true);

    const loaded = loadStudioState();
    assert.equal(loaded.streakCount, 45);
    assert.equal(loaded.highestStreak, 60);
    assert.equal(loaded.completedQuestionIds.length, 1000);
    assert.equal(loaded.completedQuestionIds[999], 'NSC_2026_Q_0999');
    assert.equal(loaded.unlockedAchievements.length, 15);
    assert.deepEqual(loaded.unlockedAchievements, largeState.unlockedAchievements);
  });
});

