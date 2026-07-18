import { TIERS } from './tiers';

/**
 * Learning paths — the two (plus a bonus) independently-unlockable tracks.
 *
 * The curriculum is still one ordered list of levels, but instead of a single
 * global sequential chain, each PATH has its own chain: the first level of a
 * path is open from the start, and each subsequent level in that path unlocks
 * when the previous one in the SAME path is passed. So someone who only wants
 * personal writing can start the Personal path directly, without finishing the
 * Academic path first.
 */
export interface LearningPath {
  id: string;
  name: string;
  /** Short English tagline for the landing/cards. */
  tagline: string;
  description: string;
  /** Ordered level ids that make up this path. */
  levelIds: number[];
  /** Tier ids (from tiers.ts) that belong to this path, for grouping in UI. */
  tierIds: string[];
}

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const PATHS: LearningPath[] = [
  {
    id: 'academic',
    name: 'Jalur Akademik',
    tagline: 'Journals, theses, the whole scholarly machine.',
    description:
      'Fondasi tulisan ilmiah, metode penelitian & data, menembus jurnal, sampai skripsi dan sidang.',
    levelIds: range(1, 28),
    tierIds: ['fondasi', 'metode', 'jurnal', 'skripsi'],
  },
  {
    id: 'personal',
    name: 'Jalur Personal & Publik',
    tagline: 'Voice, essays, Medium, Substack, op-eds.',
    description:
      'Menemukan voice, personal essay, storytelling, terbit di Medium & Substack, op-ed, sampai membangun portofolio.',
    levelIds: range(29, 50),
    tierIds: ['personal', 'digital', 'mahir'],
  },
  {
    id: 'bonus',
    name: 'Modul Tambahan',
    tagline: 'Standalone extras, like writing with AI.',
    description: 'Topik pelengkap yang bisa dibuka kapan saja, di luar dua jalur utama.',
    levelIds: range(51, 60),
    tierIds: ['bonus'],
  },
];

export const pathOf = (levelId: number): LearningPath | undefined =>
  PATHS.find((p) => p.levelIds.includes(levelId));

/** The tiers belonging to a path, in order. */
export const tiersOfPath = (pathId: string) => {
  const path = PATHS.find((p) => p.id === pathId);
  if (!path) return [];
  return TIERS.filter((t) => path.tierIds.includes(t.id));
};

/**
 * True if `levelId` is the first level of its path — those are always open, so
 * every path can be started independently.
 */
export const isPathStart = (levelId: number): boolean => {
  const path = pathOf(levelId);
  return path ? path.levelIds[0] === levelId : false;
};

/** The level that comes before `levelId` within its own path, if any. */
export const prevInPath = (levelId: number): number | undefined => {
  const path = pathOf(levelId);
  if (!path) return undefined;
  const idx = path.levelIds.indexOf(levelId);
  return idx > 0 ? path.levelIds[idx - 1] : undefined;
};
