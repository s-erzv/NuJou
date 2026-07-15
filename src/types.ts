// ---- Content model (mirrors the JSON in src/data) ----

/** A single rich content block used by the Reading View. */
export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'quote'; text: string; source?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; title: string; text: string };

/** A reading section within a level (a "sub-bab"). */
export interface Section {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

/** A multiple-choice question, used for both quizzes and exams. */
export interface Question {
  id: string;
  question: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  answer: number;
  /** Short explanation shown after grading. */
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  /** Fraction (0-1) of correct answers required to pass. */
  passRatio: number;
  questions: Question[];
}

export interface Level {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  goal: string;
  estimatedMinutes: number;
  sections: Section[];
  quiz: Assessment;
  exam: Assessment;
}

// ---- Progress model (persisted by Zustand) ----

export interface AssessmentResult {
  score: number; // number correct
  total: number;
  passed: boolean;
  attempts: number;
  lastAttemptAt: string; // ISO date
}

export interface LevelProgress {
  read: boolean;
  quiz?: AssessmentResult;
  exam?: AssessmentResult;
}
