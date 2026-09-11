"use client";

import Link from "next/link";
import { COURSE } from "@/lib/course/crypto-101-data";
import { useProgress } from "@/lib/course/use-progress";

const BASE = `/learn/${COURSE.slug}`;
const QUIZ_COUNT =
  COURSE.chapters.filter((c) => c.quiz).length + (COURSE.finalQuiz ? 1 : 0);
const TOTAL_STEPS = COURSE.chapters.length + (COURSE.finalQuiz ? 1 : 0);

export function CourseHome() {
  const { done, ready, reset } = useProgress();

  const firstUnfinished =
    COURSE.chapters.find((c) => !done.has(c.slug))?.slug ?? COURSE.chapters[0]?.slug;
  const started = done.size > 0;
  const pct = Math.round((done.size / TOTAL_STEPS) * 100);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <span className="section-eyebrow">03 · Education</span>
      <h1 className="section-title">{COURSE.title}</h1>
      <p className="section-sub">{COURSE.subtitle}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
        <span className="chip">{COURSE.chapters.length} chapters</span>
        <span className="chip">{COURSE.groups.length} sections</span>
        <span className="chip">{QUIZ_COUNT} quizzes</span>
      </div>

      {/* progress + start/continue */}
      <div className="mw-card mt-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Your progress</span>
            <span className="text-muted">
              {ready ? `${done.size} / ${TOTAL_STEPS}` : "—"}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] transition-[width] duration-500"
              style={{ width: `${ready ? pct : 0}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {started && (
            <button type="button" onClick={reset} className="btn-secondary">
              Reset
            </button>
          )}
          <Link href={`${BASE}/${firstUnfinished}`} className="btn-primary">
            {started ? "Continue" : "Start course"} →
          </Link>
        </div>
      </div>

      {/* chapters grouped by section */}
      <div className="mt-12 flex flex-col gap-10">
        {COURSE.groups.map((g) => (
          <section key={g.name}>
            <h2 className="mb-4 text-lg font-bold">
              {g.emoji} {g.name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {g.chapterSlugs.map((cs) => {
                const c = COURSE.chapters.find((x) => x.slug === cs)!;
                return (
                  <Link
                    key={cs}
                    href={`${BASE}/${cs}`}
                    className="mw-card mw-card-lift flex items-center gap-3 p-4"
                  >
                    <span className="text-xl" aria-hidden>
                      {c.emoji}
                    </span>
                    <span className="flex-1 font-medium">{c.title}</span>
                    {c.quiz && <span className="chip chip-muted">quiz</span>}
                    {ready && done.has(cs) && (
                      <span className="text-teal-300" aria-label="completed">
                        ✓
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {COURSE.finalQuiz && (
          <section>
            <h2 className="mb-4 text-lg font-bold">🎓 Exam</h2>
            <Link
              href={`${BASE}/final-exam`}
              className="mw-card mw-card-lift flex items-center gap-3 p-4"
            >
              <span className="text-xl" aria-hidden>
                🏁
              </span>
              <span className="flex-1 font-medium">
                Final Exam — {COURSE.finalQuiz.questions.length} questions
              </span>
              {ready && done.has("final-exam") && (
                <span className="text-teal-300" aria-label="completed">
                  ✓
                </span>
              )}
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
