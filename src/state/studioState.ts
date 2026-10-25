import type {
  DifficultyMode,
  ZanteStudioState,
  Achievement,
} from '../types/gamification.ts';
import type { PaperId, TopicId, CognitiveLevel } from '../types/curriculum.ts';

/**
 * ---------------------------------------------------------------------------
 * Heat Meter Tiers & Milestone Toasts
 * ---------------------------------------------------------------------------
 */
export type HeatTierIndex = 0 | 1 | 2 | 3 | 4;

export interface HeatMeterTierInfo {
  tier: HeatTierIndex;
  name: string;
  badgeTitle: string;
  minStreak: number;
  glowColor: string;
}

export const HEAT_METER_TIERS: HeatMeterTierInfo[] = [
  {
    tier: 0,
    name: 'Pearl Glow',
    badgeTitle: '🌱 WARMING UP',
    minStreak: 0,
    glowColor: 'rgba(148, 163, 184, 0.2)',
  },
  {
    tier: 1,
    name: 'Rose Prism',
    badgeTitle: '🌸 SPARKS FLYING',
    minStreak: 3,
    glowColor: 'rgba(255, 133, 179, 0.4)',
  },
  {
    tier: 2,
    name: 'Golden Aurora',
    badgeTitle: '🔥 ON FIRE',
    minStreak: 5,
    glowColor: 'rgba(253, 186, 116, 0.5)',
  },
  {
    tier: 3,
    name: 'Glacial Prism',
    badgeTitle: '⚡ PRISMATIC OVERDRIVE',
    minStreak: 10,
    glowColor: 'rgba(56, 189, 248, 0.55)',
  },
  {
    tier: 4,
    name: 'Liquid Diamond Supernova',
    badgeTitle: '👑 LIQUID DIAMOND SUPERNOVA',
    minStreak: 20,
    glowColor: 'rgba(255, 255, 255, 0.95)',
  },
];

export function getStreakTier(streak: number): HeatMeterTierInfo {
  if (streak >= 20) return HEAT_METER_TIERS[4];
  if (streak >= 10) return HEAT_METER_TIERS[3];
  if (streak >= 5) return HEAT_METER_TIERS[2];
  if (streak >= 3) return HEAT_METER_TIERS[1];
  return HEAT_METER_TIERS[0];
}

export function getStreakMilestoneToast(streak: number): string | null {
  if (streak === 3) {
    return 'Look at you actually remembering Grade 11 algebra 💅 Sparks flying!';
  }
  if (streak === 5) {
    return '5 in a row! Statistically impressive, aesthetically immaculate 🔥';
  }
  if (streak === 10) {
    return '10 in a row?! Who is this and what have you done with Zante? Prismatic overdrive!';
  }
  if (streak === 20) {
    return '20 STREAK. Call the Department of Basic Education, we have a distinction 👑✨';
  }
  if (streak > 20 && streak % 10 === 0) {
    return `${streak} STREAK! Liquid Diamond God-Tier. Even Andre is taking notes 💅`;
  }
  return null;
}

/**
 * ---------------------------------------------------------------------------
 * Pretty Privilege / Streak Shield State Machine
 * ---------------------------------------------------------------------------
 */
export type ShieldStatus = 'CHARGED' | 'ARMED' | 'SHATTERED';

export class StreakShieldMachine {
  status: ShieldStatus;
  streak: number;
  highestStreak: number;
  recoveryCount: number;

  constructor(initialStatus: ShieldStatus = 'CHARGED', initialStreak: number = 0) {
    this.status = initialStatus;
    this.streak = initialStreak;
    this.highestStreak = initialStreak;
    this.recoveryCount = 0;
  }

  enterQuestion(cognitiveLevel: CognitiveLevel | string): void {
    if (this.status === 'CHARGED' && cognitiveLevel === 'L4') {
      this.status = 'ARMED';
    }
  }

  submitAnswer(
    isCorrect: boolean,
    cognitiveLevel?: CognitiveLevel | string
  ): { streakProtected: boolean; shieldShattered: boolean; reloaded: boolean } {
    let streakProtected = false;
    let shieldShattered = false;
    let reloaded = false;

    if (isCorrect) {
      this.streak++;
      if (this.streak > this.highestStreak) {
        this.highestStreak = this.streak;
      }

      if (this.status === 'SHATTERED') {
        const isEligibleRecovery =
          !cognitiveLevel ||
          cognitiveLevel === 'L2' ||
          cognitiveLevel === 'L3' ||
          cognitiveLevel === 'L4';
        if (isEligibleRecovery) {
          this.recoveryCount++;
          if (this.recoveryCount >= 5) {
            this.status = 'CHARGED';
            this.recoveryCount = 0;
            reloaded = true;
          }
        }
      } else if (this.status === 'ARMED') {
        this.status = 'CHARGED';
      }
    } else {
      if (this.status === 'ARMED') {
        this.status = 'SHATTERED';
        this.recoveryCount = 0;
        streakProtected = true;
        shieldShattered = true;
      } else {
        this.streak = 0;
      }
    }

    return { streakProtected, shieldShattered, reloaded };
  }
}

/**
 * ---------------------------------------------------------------------------
 * Easter Eggs Engine
 * ---------------------------------------------------------------------------
 */

/**
 * 1. Mode Switch Roast: Andre -> Zante
 */
export const MODE_SWITCH_ROASTS = [
  "Switching to Zante mode? Don't worry, quadratic equations can't hurt you here. Have an iced coffee 💅",
  'Dropping down to Zante mode? Understandable, high-level calculus is bad for the complexion.',
  'Back to passenger princess maths? Your secret is safe with me (and my database).',
  'Welcome back to the stress-free zone. 1 + 1 was getting lonely without you.',
  'Exiting Andre mode. The DBE examiners will miss you, but your mental peace thanks you.',
];

export function getModeSwitchRoast(fromMode: DifficultyMode, toMode: DifficultyMode): string | null {
  if (fromMode === 'andre' && toMode === 'zante') {
    return MODE_SWITCH_ROASTS[0];
  }
  return null;
}

/**
 * 2. Late-Night Study Detector (23:00 to 04:30)
 */
export function isLateNightStudy(hourOrDate?: number | Date, minuteArg?: number): boolean {
  let hour: number;
  let minute: number;

  if (typeof hourOrDate === 'number') {
    hour = hourOrDate;
    minute = minuteArg !== undefined ? minuteArg : 0;
  } else {
    const d = hourOrDate instanceof Date ? hourOrDate : new Date();
    hour = d.getHours();
    minute = d.getMinutes();
  }

  return hour >= 23 || hour < 4 || (hour === 4 && minute <= 30);
}

export function isLateNight(hour: number, minute: number): boolean {
  return isLateNightStudy(hour, minute);
}

export const LATE_NIGHT_MESSAGES = [
  'Late-night math grind detected. Your brain is running on 3% battery and pure spite. Drink some water 🌙✨',
  'It is past midnight. Even the asymptotes are sleeping. Close the laptop or switch to Zante mode.',
  '3 AM calculus hits different, but your pillow misses you more. Rest your brain for tomorrow.',
];

export function getLateNightMessage(): string {
  return LATE_NIGHT_MESSAGES[0];
}

/**
 * 3. 5x Crown Tap VIP Hype Vault Detector
 */
export class CrownTapDetector {
  taps: number[];
  unlocked: boolean;

  constructor() {
    this.taps = [];
    this.unlocked = false;
  }

  tap(timestamp: number = Date.now()): boolean {
    this.taps.push(timestamp);
    this.taps = this.taps.filter((t) => timestamp - t <= 2500);
    if (this.taps.length >= 5) {
      this.unlocked = true;
    }
    return this.unlocked;
  }

  reset(): void {
    this.taps = [];
    this.unlocked = false;
  }
}

/**
 * Verbatim 4-point disclaimer text from Andre
 */
export const ANDRE_VIP_DISCLAIMER = {
  section1: {
    title: 'Mathematical Competence',
    content:
      'Despite any teasing in this app, you are genuinely capable of completely demolishing this exam. 150 marks in Paper 1 and 150 marks in Paper 2 are just numbers waiting for you to collect them.',
  },
  section2: {
    title: 'The Purpose of This App',
    content:
      'This studio was engineered with 0% tolerance for boring textbooks and 100% devotion to helping you walk into the exam hall feeling completely untouchable.',
  },
  section3: {
    title: 'Emergency Calculus Protocol',
    content:
      "If a cubic function ever makes you want to throw your calculator out the window, remember: the turning point is just where f'(x) = 0. Take the derivative, set it to zero, breathe, and keep moving.",
  },
  section4: {
    title: 'The Official Guarantee',
    content:
      'Anyone who finishes all 10 topics in Andre mode is contractually entitled to brag about it indefinitely to everyone in Potchefstroom.',
  },
};

export const DISCLAIMER_SECTIONS = [
  ANDRE_VIP_DISCLAIMER.section1.title,
  ANDRE_VIP_DISCLAIMER.section2.title,
  ANDRE_VIP_DISCLAIMER.section3.title,
  ANDRE_VIP_DISCLAIMER.section4.title,
];

/**
 * Unlock VIP Hype Vault perk
 */
export function unlockVipHypeVault(state: ZanteStudioState): { state: ZanteStudioState; unlocked: boolean } {
  const updatedAchievements = state.unlockedAchievements.includes('vip_hype_vault')
    ? state.unlockedAchievements
    : [...state.unlockedAchievements, 'vip_hype_vault'];

  const newState: ZanteStudioState = {
    ...state,
    vipHypeVaultUnlocked: true,
    shieldActive: true,
    unlockedAchievements: updatedAchievements,
  };

  return { state: newState, unlocked: true };
}

/**
 * ---------------------------------------------------------------------------
 * 15 Unlockable Achievements Catalog
 * ---------------------------------------------------------------------------
 */
export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  {
    id: 'passenger_princess_laureate',
    title: 'Passenger Princess Laureate',
    description: 'Mastered 10 Zante Difficulty questions with effortless grace',
    icon: '🚗👑',
  },
  {
    id: 'iced_coffee_economist',
    title: 'Iced Coffee Economist',
    description: 'Solved girl-math and beverage budgeting scenarios with zero financial loss',
    icon: '☕📈',
  },
  {
    id: 'first_spark',
    title: 'First Spark',
    description: 'Ignited your mathematical momentum with a 3-question streak',
    icon: '🌱',
  },
  {
    id: 'unstoppable_flame',
    title: 'Unstoppable Flame',
    description: 'Maintained a blazing 10-question streak without breaking stride',
    icon: '🔥',
  },
  {
    id: 'supernova_prodigy',
    title: 'Supernova Prodigy',
    description: 'Achieved a legendary 20-question streak in Liquid Diamond tier',
    icon: '👑✨',
  },
  {
    id: 'pretty_privilege_shielded',
    title: 'Pretty Privilege Shielded',
    description: 'Protected your hard-earned streak on a brutal Level 4 question',
    icon: '🛡️',
  },
  {
    id: 'night_owl_scholar',
    title: 'Night Owl Scholar',
    description: 'Studied mathematics in the late-night hours between 23:00 and 04:30',
    icon: '🌙',
  },
  {
    id: 'the_realist_switch',
    title: 'The Realist Switch',
    description: 'Exercised emotional self-care by switching from Andre Mode to Zante Mode',
    icon: '💅',
  },
  {
    id: 'vip_hype_vault',
    title: 'The Inner Circle / Andre VIP',
    description: "Tapped Zante's crown badge 5 times to unlock Andre's Official Disclaimer Vault",
    icon: '🗝️',
  },
  {
    id: 'algebra_demolisher',
    title: 'Algebra Demolisher',
    description: 'Conquered Paper 1 Algebra Level 1-3 quadratic, exponential, and surd equations',
    icon: '📐',
  },
  {
    id: 'calculus_whisperer',
    title: 'Calculus Whisperer',
    description: 'Mastered cubic graph tangents, stationary points, and inflection coordinates',
    icon: '📈',
  },
  {
    id: 'circle_theorem_sovereign',
    title: 'Circle Theorem Sovereign',
    description: 'Provided official CAPS acceptable short reasons in 5 Euclidean geometry proofs',
    icon: '⭕',
  },
  {
    id: 'trig_identity_wizard',
    title: 'Trig Identity Wizard',
    description: 'Solved compound angle reductions and general solutions without formula lookup',
    icon: '🔄',
  },
  {
    id: 'distinction_manifested',
    title: 'Distinction Manifested',
    description: 'Scored 80% or higher on a full 150-mark NSC Pure Maths exam simulation',
    icon: '🏆',
  },
  {
    id: 'pure_maths_royalty',
    title: 'Pure Maths Royalty',
    description: 'Completed questions across all 10 CAPS topics in Andre Difficulty Mode',
    icon: '👑💎',
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS_CATALOG.find((a) => a.id === id);
}

/**
 * Evaluate achievements that should be unlocked based on the current studio state
 */
export function evaluateAchievements(state: ZanteStudioState, context?: {
  lastAction?: string;
  zanteCorrectCount?: number;
  modeSwitched?: boolean;
  shieldTriggered?: boolean;
  simulationScore?: number;
  allTopicsCleared?: boolean;
}): string[] {
  const currentUnlocked = new Set(state.unlockedAchievements);
  const newlyUnlocked: string[] = [];

  function tryUnlock(id: string) {
    if (!currentUnlocked.has(id)) {
      currentUnlocked.add(id);
      newlyUnlocked.push(id);
    }
  }

  // Streak milestones
  if (state.streakCount >= 3 || state.highestStreak >= 3) {
    tryUnlock('first_spark');
  }
  if (state.streakCount >= 10 || state.highestStreak >= 10) {
    tryUnlock('unstoppable_flame');
  }
  if (state.streakCount >= 20 || state.highestStreak >= 20) {
    tryUnlock('supernova_prodigy');
  }

  // Vault
  if (state.vipHypeVaultUnlocked) {
    tryUnlock('vip_hype_vault');
  }

  // Contextual triggers
  if (context) {
    if ((context.zanteCorrectCount || 0) >= 10) {
      tryUnlock('passenger_princess_laureate');
    }
    if (context.modeSwitched) {
      tryUnlock('the_realist_switch');
    }
    if (context.shieldTriggered) {
      tryUnlock('pretty_privilege_shielded');
    }
    if (context.simulationScore !== undefined && context.simulationScore >= 80) {
      tryUnlock('distinction_manifested');
    }
    if (context.allTopicsCleared) {
      tryUnlock('pure_maths_royalty');
    }
  }

  // Late night study check
  if (isLateNightStudy(new Date(state.lastStudyTimestamp))) {
    tryUnlock('night_owl_scholar');
  }

  return newlyUnlocked;
}

/**
 * ---------------------------------------------------------------------------
 * Studio State Factory & Actions
 * ---------------------------------------------------------------------------
 */
export function createInitialStudioState(
  initialPaper: PaperId = 'P1',
  initialTopic?: TopicId
): ZanteStudioState {
  const paper = initialPaper;
  const topic = initialTopic || (paper === 'P1' ? 'algebra' : 'statistics');
  return {
    version: 1,
    difficultyMode: 'zante',
    activePaper: paper,
    activeTopic: topic,
    streakCount: 0,
    highestStreak: 0,
    shieldActive: true,
    vipHypeVaultUnlocked: false,
    crownTapCount: 0,
    lastStudyTimestamp: Date.now(),
    completedQuestionIds: [],
    unlockedAchievements: [],
  };
}

export function createInitialPaper2StudioState(): ZanteStudioState {
  return createInitialStudioState('P2', 'statistics');
}

export function switchPaper(state: ZanteStudioState, newPaper: PaperId): ZanteStudioState {
  const defaultTopic: TopicId = newPaper === 'P1' ? 'algebra' : 'statistics';
  return {
    ...state,
    activePaper: newPaper,
    activeTopic: defaultTopic,
  };
}

export function switchDifficulty(
  state: ZanteStudioState,
  newMode: DifficultyMode
): { newState: ZanteStudioState; roastToast: string | null } {
  const roastToast = getModeSwitchRoast(state.difficultyMode, newMode);
  const achievements = [...state.unlockedAchievements];
  if (state.difficultyMode === 'andre' && newMode === 'zante' && !achievements.includes('the_realist_switch')) {
    achievements.push('the_realist_switch');
  }

  return {
    newState: {
      ...state,
      difficultyMode: newMode,
      unlockedAchievements: achievements,
    },
    roastToast,
  };
}

export function recordQuestionResult(
  state: ZanteStudioState,
  questionId: string,
  isCorrect: boolean,
  cognitiveLevel?: CognitiveLevel | string
): {
  newState: ZanteStudioState;
  streakProtected: boolean;
  milestoneToast: string | null;
  newAchievements: string[];
} {
  let streak = state.streakCount;
  let highest = state.highestStreak;
  let shieldActive = state.shieldActive;
  let streakProtected = false;

  const isL4 = cognitiveLevel === 'L4';

  if (isCorrect) {
    streak++;
    if (streak > highest) {
      highest = streak;
    }
  } else {
    if (isL4 && shieldActive) {
      // Shield saves streak
      streakProtected = true;
      shieldActive = false; // Shield shattered
    } else {
      streak = 0;
    }
  }

  const completed = state.completedQuestionIds.includes(questionId)
    ? state.completedQuestionIds
    : [...state.completedQuestionIds, questionId];

  const candidateState: ZanteStudioState = {
    ...state,
    streakCount: streak,
    highestStreak: highest,
    shieldActive,
    completedQuestionIds: completed,
    lastStudyTimestamp: Date.now(),
  };

  const newAchievements = evaluateAchievements(candidateState, {
    shieldTriggered: streakProtected,
  });

  const updatedAchievements = [...candidateState.unlockedAchievements];
  for (const ach of newAchievements) {
    if (!updatedAchievements.includes(ach)) {
      updatedAchievements.push(ach);
    }
  }
  candidateState.unlockedAchievements = updatedAchievements;

  const milestoneToast = isCorrect ? getStreakMilestoneToast(streak) : null;

  return {
    newState: candidateState,
    streakProtected,
    milestoneToast,
    newAchievements,
  };
}
