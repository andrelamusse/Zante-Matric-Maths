import { PaperId, TopicId } from './curriculum';

export type DifficultyMode = 'zante' | 'andre';

export type ZanteCategory =
  | 'elementary'
  | 'iced_coffee'
  | 'passenger_princess'
  | 'girl_math'
  | 'flirty_priorities'
  | 'matric_tropes';

export interface ZanteQuestion {
  id: string;
  category: ZanteCategory;
  questionText: string;
  options: string[];
  correctIndex: number;
  wittyToast: string;
  screenshotQuote: string;
}

export interface ZanteStudioState {
  version: number;
  difficultyMode: DifficultyMode;
  activePaper: PaperId;
  activeTopic?: TopicId;
  streakCount: number;
  highestStreak: number;
  shieldActive: boolean;
  vipHypeVaultUnlocked: boolean;
  crownTapCount: number;
  lastStudyTimestamp: number;
  completedQuestionIds: string[];
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}
