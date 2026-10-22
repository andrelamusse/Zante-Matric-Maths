import type { ZanteStudioState } from '../types/gamification.ts';
import { createInitialStudioState } from './studioState.ts';

/**
 * Zante's Matric Maths Studio — Persistence Layer
 *
 * Provides a resilient, versioned, migration-safe localStorage wrapper
 * with transparent fallback to in-memory state when localStorage is
 * unavailable, throws security errors, or runs inside Node.js test harnesses.
 */

export const STORAGE_KEY = 'zante_matric_maths_studio_v1';
export const CURRENT_STATE_VERSION = 1;

let inMemoryStateStore: ZanteStudioState | null = null;

/**
 * Safely detect whether window.localStorage is accessible and writable
 */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__zante_storage_probe__';
    window.localStorage.setItem(testKey, 'probe');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Migration helper to ensure loaded state conforms to latest schema
 */
export function migrateState(raw: unknown): ZanteStudioState {
  const initial = createInitialStudioState();

  if (!raw || typeof raw !== 'object') {
    return initial;
  }

  const candidate = raw as Record<string, unknown>;

  const version =
    typeof candidate.version === 'number' && candidate.version >= CURRENT_STATE_VERSION
      ? candidate.version
      : CURRENT_STATE_VERSION;
  const difficultyMode =
    candidate.difficultyMode === 'andre' || candidate.difficultyMode === 'zante'
      ? candidate.difficultyMode
      : initial.difficultyMode;

  const activePaper =
    candidate.activePaper === 'P1' || candidate.activePaper === 'P2'
      ? candidate.activePaper
      : initial.activePaper;

  const activeTopic =
    typeof candidate.activeTopic === 'string'
      ? (candidate.activeTopic as ZanteStudioState['activeTopic'])
      : initial.activeTopic;

  const streakCount =
    typeof candidate.streakCount === 'number' && candidate.streakCount >= 0
      ? candidate.streakCount
      : 0;

  const highestStreak =
    typeof candidate.highestStreak === 'number' && candidate.highestStreak >= 0
      ? Math.max(candidate.highestStreak, streakCount)
      : streakCount;

  const shieldActive =
    typeof candidate.shieldActive === 'boolean' ? candidate.shieldActive : true;

  const vipHypeVaultUnlocked =
    typeof candidate.vipHypeVaultUnlocked === 'boolean'
      ? candidate.vipHypeVaultUnlocked
      : false;

  const crownTapCount =
    typeof candidate.crownTapCount === 'number' ? candidate.crownTapCount : 0;

  const lastStudyTimestamp =
    typeof candidate.lastStudyTimestamp === 'number'
      ? candidate.lastStudyTimestamp
      : Date.now();

  const completedQuestionIds = Array.isArray(candidate.completedQuestionIds)
    ? candidate.completedQuestionIds.filter((id): id is string => typeof id === 'string')
    : [];

  const unlockedAchievements = Array.isArray(candidate.unlockedAchievements)
    ? candidate.unlockedAchievements.filter((id): id is string => typeof id === 'string')
    : [];

  return {
    version,
    difficultyMode,
    activePaper,
    activeTopic,
    streakCount,
    highestStreak,
    shieldActive,
    vipHypeVaultUnlocked,
    crownTapCount,
    lastStudyTimestamp,
    completedQuestionIds,
    unlockedAchievements,
  };
}

/**
 * Load persisted studio state with schema validation and memory fallback
 */
export function loadStudioState(): ZanteStudioState {
  if (isStorageAvailable()) {
    try {
      const rawData = window.localStorage.getItem(STORAGE_KEY);
      if (rawData) {
        const parsed = JSON.parse(rawData);
        const migrated = migrateState(parsed);
        inMemoryStateStore = migrated;
        return migrated;
      }
    } catch {
      // Fall through to memory store if parsing fails
    }
  }

  if (inMemoryStateStore) {
    return inMemoryStateStore;
  }

  const freshState = createInitialStudioState();
  inMemoryStateStore = freshState;
  return freshState;
}

/**
 * Save studio state with automatic sync to in-memory store
 */
export function saveStudioState(state: ZanteStudioState): boolean {
  inMemoryStateStore = { ...state };

  if (isStorageAvailable()) {
    try {
      const serialized = JSON.stringify(state);
      window.localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch {
      return false;
    }
  }

  return true; // Persisted in memory
}

/**
 * Reset studio state back to default factory settings
 */
export function resetStudioState(): ZanteStudioState {
  const fresh = createInitialStudioState();
  inMemoryStateStore = fresh;

  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore removal errors
    }
  }

  return fresh;
}

/**
 * Clear in-memory and local storage stores
 */
export function clearStorage(): void {
  inMemoryStateStore = null;
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}

/**
 * Access in-memory store directly for test assertions
 */
export function getInMemoryState(): ZanteStudioState | null {
  return inMemoryStateStore;
}
