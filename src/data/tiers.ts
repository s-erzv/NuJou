/**
 * Level tiers — the curriculum's chapters. Levels themselves stay a flat
 * sequential list (unlocking depends on it); tiers are purely a presentation
 * grouping so 50 levels stay navigable on the roadmap.
 */
export interface Tier {
  id: string;
  name: string;
  blurb: string;
  /** Inclusive level id range. */
  from: number;
  to: number;
}

export const TIERS: Tier[] = [
  {
    id: 'fondasi',
    name: 'Fondasi Akademik',
    blurb: 'Bedah bentuk tulisan, struktur IMRaD, sitasi, dan nada akademik.',
    from: 1,
    to: 6,
  },
  {
    id: 'metode',
    name: 'Metode Penelitian & Data',
    blurb: 'Kualitatif, kuantitatif, analisis data, statistik, dan etika riset.',
    from: 7,
    to: 14,
  },
  {
    id: 'jurnal',
    name: 'Menulis & Merevisi Artikel Jurnal',
    blurb: 'Dari abstrak sampai menjawab reviewer dan bangkit setelah ditolak.',
    from: 15,
    to: 22,
  },
  {
    id: 'skripsi',
    name: 'Skripsi & Tesis',
    blurb: 'Bab 1 sampai Bab 5, plus menghadapi sidang.',
    from: 23,
    to: 28,
  },
  {
    id: 'personal',
    name: 'Menulis Personal & Naratif',
    blurb: 'Voice, personal essay, storytelling, Medium, Substack, dan op-ed.',
    from: 29,
    to: 38,
  },
  {
    id: 'digital',
    name: 'Menulis Digital & Publik',
    blurb: 'SEO, headline, komunikasi sains, copywriting, dan kebiasaan menulis.',
    from: 39,
    to: 44,
  },
  {
    id: 'mahir',
    name: 'Mahir & Publikasi Lanjutan',
    blurb: 'Policy brief, authorship, hibah, etika publikasi, dan portofolio.',
    from: 45,
    to: 50,
  },
];

export const tierOf = (levelId: number): Tier | undefined =>
  TIERS.find((t) => levelId >= t.from && levelId <= t.to);
