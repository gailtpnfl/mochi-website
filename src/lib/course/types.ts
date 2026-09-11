// Shared types for the self-contained Crypto Trading 101 course.

export type QuizQuestion = {
  q: string;
  options: string[];
  correct: number;
};

export type Quiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
};

export type Chapter = {
  slug: string;
  secId: number;
  title: string;
  emoji: string;
  group: string;
  groupEmoji: string;
  level: string | null;
  /** Sanitized content HTML (inline styles/theme stripped; ct-* classes only). */
  html: string;
  quiz: Quiz | null;
};

export type CourseGroup = {
  name: string;
  emoji: string;
  chapterSlugs: string[];
};

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  groups: CourseGroup[];
  chapters: Chapter[];
  finalQuiz: Quiz | null;
};
