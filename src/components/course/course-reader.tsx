"use client";

import { useEffect } from "react";
import Link from "next/link";
import { COURSE } from "@/lib/course/crypto-101-data";
import { useProgress } from "@/lib/course/use-progress";
import { CourseQuiz } from "@/components/course/course-quiz";

const BASE = `/learn/${COURSE.slug}`;
const HAS_FINAL = !!COURSE.finalQuiz;
const ORDER = [...COURSE.chapters.map((c) => c.slug), ...(HAS_FINAL ? ["final-exam"] : [])];

export function CourseReader({ slug }: { slug: string }) {
  const { done, markDone } = useProgress();

  // Each chapter should start at the top — otherwise navigating from the bottom
  // "Mark complete & continue" button leaves the next chapter's header hidden
  // under the fixed nav.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  const isFinal = slug === "final-exam";
  const chapter = isFinal ? null : COURSE.chapters.find((c) => c.slug === slug) ?? null;
  const idx = ORDER.indexOf(slug);
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx >= 0 && idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

  return (
    <div className="ct-reader">
      {/* sidebar */}
      <aside className="ct-sidebar" aria-label="Chapters">
        <Link href={BASE} className="text-sm text-muted hover:text-foreground">
          ← Course home
        </Link>
        {COURSE.groups.map((g) => (
          <div key={g.name}>
            <p className="ct-sidebar-group">
              {g.emoji} {g.name}
            </p>
            {g.chapterSlugs.map((cs) => {
              const c = COURSE.chapters.find((x) => x.slug === cs)!;
              return (
                <Link
                  key={cs}
                  href={`${BASE}/${cs}`}
                  className={`ct-sidebar-link${cs === slug ? " active" : ""}`}
                >
                  <span aria-hidden>{c.emoji}</span>
                  <span>{c.title}</span>
                  {done.has(cs) && (
                    <span className="ct-sidebar-check" aria-label="completed">
                      ✓
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
        {HAS_FINAL && (
          <div>
            <p className="ct-sidebar-group">🎓 Exam</p>
            <Link
              href={`${BASE}/final-exam`}
              className={`ct-sidebar-link${isFinal ? " active" : ""}`}
            >
              <span aria-hidden>🏁</span>
              <span>Final Exam</span>
              {done.has("final-exam") && <span className="ct-sidebar-check">✓</span>}
            </Link>
          </div>
        )}
      </aside>

      {/* content */}
      <article>
        {chapter ? (
          <>
            <header className="mb-6 border-b border-border pb-4">
              <p className="text-xs uppercase tracking-widest text-muted">
                {chapter.groupEmoji} {chapter.group}
                {chapter.level ? ` · ${chapter.level}` : ""}
              </p>
              <h1 className="mt-1 text-2xl font-bold">
                {chapter.emoji} {chapter.title}
              </h1>
            </header>

            <div className="course-prose" dangerouslySetInnerHTML={{ __html: chapter.html }} />

            {chapter.quiz && <CourseQuiz quiz={chapter.quiz} onPass={() => markDone(slug)} />}
          </>
        ) : (
          <FinalExam onPass={() => markDone("final-exam")} passed={done.has("final-exam")} />
        )}

        {/* prev / next — a <div>, NOT <nav>: the global `nav { position: fixed }`
            rule is a bare element selector and would pin these buttons to the top. */}
        <div
          role="navigation"
          aria-label="Chapter navigation"
          className="ct-reader-nav mt-10 flex items-center justify-between gap-3 border-t border-border pt-6"
        >
          {prev ? (
            <Link href={`${BASE}/${prev}`} className="btn-secondary">
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`${BASE}/${next}`} className="btn-primary" onClick={() => markDone(slug)}>
              Mark complete & continue →
            </Link>
          ) : (
            <Link href={BASE} className="btn-primary" onClick={() => markDone(slug)}>
              Finish course ✓
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}

function FinalExam({ onPass, passed }: { onPass: () => void; passed: boolean }) {
  return (
    <>
      <header className="mb-6 border-b border-border pb-4">
        <p className="text-xs uppercase tracking-widest text-muted">🎓 Final Exam</p>
        <h1 className="mt-1 text-2xl font-bold">🏁 Comprehensive Final Quiz</h1>
        <p className="mt-2 text-sm text-muted">
          {COURSE.finalQuiz!.questions.length} questions spanning the whole course. Score 67%+ to
          pass.
        </p>
      </header>

      {passed && (
        <div className="ct-quiz-result pass mb-6" role="status">
          🎉 Congratulations, trader! You&apos;ve completed Crypto Trading 101.
        </div>
      )}

      <CourseQuiz quiz={COURSE.finalQuiz!} onPass={onPass} />
    </>
  );
}
