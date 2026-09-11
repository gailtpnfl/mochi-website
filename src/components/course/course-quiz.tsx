"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/course/types";

/**
 * Themed quiz: pick one answer per question, Check answers, see per-question
 * feedback + a scored result. Preserves the original check-answer behavior;
 * >= 67% counts as a pass and calls onPass (used for progress tracking).
 */
export function CourseQuiz({ quiz, onPass }: { quiz: Quiz; onPass?: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  const n = quiz.questions.length;
  const score = quiz.questions.reduce((a, q, i) => a + (answers[i] === q.correct ? 1 : 0), 0);
  const pct = n ? Math.round((score / n) * 100) : 0;

  function check() {
    setChecked(true);
    if (score / n >= 0.67) onPass?.();
  }
  function retry() {
    setChecked(false);
    setAnswers({});
  }

  return (
    <section className="ct-quiz" aria-label={`Quiz: ${quiz.title}`}>
      <div className="ct-quiz-head">
        <span aria-hidden>🧠</span>
        <h3>Quick Quiz — {quiz.title}</h3>
        <span className="ct-quiz-badge">
          {n} Question{n === 1 ? "" : "s"}
        </span>
      </div>

      {quiz.questions.map((q, qi) => {
        const chosen = answers[qi];
        return (
          <div className="ct-q" key={qi}>
            <p className="ct-q-text">
              {qi + 1}. {q.q}
            </p>
            {q.options.map((opt, oi) => {
              let cls = "ct-opt";
              if (checked) {
                if (oi === q.correct) cls += chosen === oi ? " is-correct" : " is-answer";
                else if (chosen === oi) cls += " is-wrong";
              }
              return (
                <label className={cls} key={oi}>
                  <input
                    type="radio"
                    name={`${quiz.id}-${qi}`}
                    checked={chosen === oi}
                    disabled={checked}
                    onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
            {checked && (
              <p className={`ct-q-fb ${chosen === q.correct ? "ok" : "no"}`}>
                {chosen === undefined
                  ? "❌ No answer selected — correct answer highlighted."
                  : chosen === q.correct
                    ? "✅ Correct!"
                    : "❌ Not quite — correct answer highlighted."}
              </p>
            )}
          </div>
        );
      })}

      {!checked ? (
        <button type="button" className="btn-primary mt-4" onClick={check}>
          Check answers
        </button>
      ) : (
        <>
          <div
            className={`ct-quiz-result ${pct === 100 ? "pass" : pct >= 67 ? "ok" : "fail"}`}
            role="status"
          >
            {pct === 100
              ? `🏆 Perfect! ${score}/${n} — you nailed it.`
              : pct >= 67
                ? `👍 Good job! ${score}/${n} — review any you missed, then continue.`
                : `📖 ${score}/${n} — re-read this chapter and try again before moving on.`}
          </div>
          <button type="button" className="btn-secondary mt-4" onClick={retry}>
            Try again
          </button>
        </>
      )}
    </section>
  );
}
