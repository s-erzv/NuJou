import type { Level } from '../types';
import level1 from './level1.json';
import level2 from './level2.json';
import level3 from './level3.json';
import level4 from './level4.json';
import level5 from './level5.json';
import level6 from './level6.json';
import level7 from './level7.json';
import level8 from './level8.json';
import level9 from './level9.json';
import level10 from './level10.json';
import level11 from './level11.json';
import level12 from './level12.json';
import level13 from './level13.json';
import level14 from './level14.json';
import level15 from './level15.json';
import level16 from './level16.json';
import level17 from './level17.json';

// Static, ordered course data. Cast is safe because the JSON is authored
// to match the `Level` shape in ../types.
export const levels: Level[] = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15,
  level16,
  level17,
  // NOTE: levels unlock sequentially (level N requires N-1's exam passed), so
  // only a contiguous run can be registered. Levels 18-22 aren't written yet,
  // which is why the run stops at 17 — level24-27/29-31/39-42 exist as files
  // but stay unregistered until their gaps are filled. Registering them early
  // would render them permanently unreachable.
] as unknown as Level[];

export const getLevel = (idOrSlug: number | string): Level | undefined =>
  levels.find((l) =>
    typeof idOrSlug === 'number' ? l.id === idOrSlug : l.slug === idOrSlug,
  );
