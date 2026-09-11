"use client";

import { useActionState } from "react";
import { applyToCohort } from "@/app/mentorship/actions";

type ActionState = { error?: string; ok?: boolean } | undefined;

export function MentorshipApplicationForm({ cohortId }: { cohortId: string }) {
  const boundAction = applyToCohort.bind(null, cohortId);
  const [state, action, pending] = useActionState<ActionState, FormData>(boundAction, undefined);

  if (state?.ok) {
    return (
      <div className="mw-card p-6 text-sm text-muted">
        Application submitted &mdash; we&apos;ll follow up once it&apos;s reviewed.
      </div>
    );
  }

  // Styled to match the Partnership form (partnership-inquiry-form.tsx) on
  // /partners and the homepage overlay — same pf-card header strip and
  // sticker submit button, so applying for a mentorship wave feels like the
  // same product as the rest of the site instead of a separate, plainer form.
  return (
    <form action={action} className="mw-card pf-card flex flex-col gap-4 p-6">
      <div className="pf-head">
        <span className="pf-head-label">TELL US ABOUT YOURSELF</span>
        <span className="pf-head-note">* required.</span>
      </div>

      <div>
        <label htmlFor="experience_level" className="mb-1 block text-sm font-medium">
          Experience level
        </label>
        <select id="experience_level" name="experience_level" className="input" defaultValue="beginner">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div>
        <label htmlFor="motivation_md" className="mb-1 block text-sm font-medium">
          Why do you want to join this wave? *
        </label>
        <textarea id="motivation_md" name="motivation_md" required rows={5} className="input" />
      </div>
      {state?.error && <p className="text-xs text-red-400">{state.error}</p>}

      <div className="pf-actions">
        <button type="submit" disabled={pending} className="btn-dark pf-submit">
          <span>{pending ? "Submitting..." : "Apply"}</span>
          <span className="btn-icon" aria-hidden>
            ↗
          </span>
        </button>
      </div>
    </form>
  );
}
