import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentResult, LevelProgress } from '../types';
import { levels } from '../data';

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
        if (levelId <= 1) return true;
        // A level unlocks only when the PREVIOUS level's exam is passed.
        const exists = levels.some((l) => l.id === levelId);
        if (!exists) return false;
        return Boolean(get().progress[levelId - 1]?.exam?.passed);
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
