import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentResult, LevelProgress } from '../types';
import { levels } from '../data';
import { isPathStart, prevInPath } from '../data/paths';

interface ProgressState {
  /** Progress keyed by level id (1..5). */
  progress: Record<number, LevelProgress>;

  // ---- actions ----
  markRead: (levelId: number) => void;
  recordResult: (
    levelId: number,
    kind: 'quiz' | 'exam',
    score: number,
    total: number,
    passRatio: number,
  ) => AssessmentResult;
  resetAll: () => void;

  // ---- derived helpers (pure, read-only) ----
  isLevelUnlocked: (levelId: number) => boolean;
  isExamPassed: (levelId: number) => boolean;
  completedCount: () => number;
  /** Experience points: read = 20, quiz pass = 40, exam pass = 100. */
  xp: () => number;
}

/** XP awarded per achievement. Exported so the UI can show the max. */
export const XP = { read: 20, quiz: 40, exam: 100 } as const;

const EMPTY: LevelProgress = { read: false };

export const useStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      markRead: (levelId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [levelId]: { ...(state.progress[levelId] ?? EMPTY), read: true },
          },
        })),

      recordResult: (levelId, kind, score, total, passRatio) => {
        const prev = get().progress[levelId] ?? EMPTY;
        const prevResult = prev[kind];
        const passed = total > 0 && score / total >= passRatio;
        const result: AssessmentResult = {
          score,
          total,
          passed,
          attempts: (prevResult?.attempts ?? 0) + 1,
          lastAttemptAt: new Date().toISOString(),
        };
        // Keep the best-passing result but always update attempts/date.
        const keep: AssessmentResult =
          prevResult?.passed && !passed
            ? { ...prevResult, attempts: result.attempts, lastAttemptAt: result.lastAttemptAt }
            : result;

        set((state) => ({
          progress: {
            ...state.progress,
            [levelId]: { ...(state.progress[levelId] ?? EMPTY), [kind]: keep },
          },
        }));
        return result;
      },

      resetAll: () => set({ progress: {} }),

      isExamPassed: (levelId) => Boolean(get().progress[levelId]?.exam?.passed),

      isLevelUnlocked: (levelId) => {
        const exists = levels.some((l) => l.id === levelId);
        if (!exists) return false;
        // Each learning path unlocks independently: the first level of a path
        // is always open, and every later level needs the PREVIOUS level in
        // its own path passed (not the previous level overall).
        if (isPathStart(levelId)) return true;
        const prev = prevInPath(levelId);
        if (prev === undefined) return false;
        return Boolean(get().progress[prev]?.exam?.passed);
      },

      completedCount: () =>
        levels.reduce((n, l) => (get().progress[l.id]?.exam?.passed ? n + 1 : n), 0),

      xp: () =>
        levels.reduce((sum, l) => {
          const p = get().progress[l.id];
          if (!p) return sum;
          return (
            sum +
            (p.read ? XP.read : 0) +
            (p.quiz?.passed ? XP.quiz : 0) +
            (p.exam?.passed ? XP.exam : 0)
          );
        }, 0),
    }),
    {
      name: 'nujou-progress-v1',
      version: 1,
      partialize: (state) => ({ progress: state.progress }),
    },
  ),
);
