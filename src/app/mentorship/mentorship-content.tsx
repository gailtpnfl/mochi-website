import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Markdown } from "@/components/markdown";
import { MentorshipApplicationForm } from "@/components/mentorship-application-form";
import type { Cohort, CohortApplication, MentorshipSession } from "@/lib/types";

const STATUS_LABEL: Record<CohortApplication["status"], string> = {
  pending: "Pending review",
  accepted: "Accepted",
  rejected: "Not selected this wave",
  waitlisted: "Waitlisted",
};

/**
 * All of /mentorship's Supabase-backed content (cohort card, application
 * form/status, sessions), split out of page.tsx so it can sit behind a
 * <Suspense> boundary there. page.tsx's hero now renders synchronously and
 * instantly on navigation; only this part waits on the cohort/user/session
 * queries, streaming in once they resolve instead of blocking the whole
 * page — that's what was making "Apply for mentorship" feel slow to open
 * compared to "Partner With Us" (which has no data to fetch at all).
 */
export async function MentorshipContent() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: cohort } = await supabase
    .from("cohorts")
    .select("*")
    .in("status", ["upcoming", "active"])
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const typedCohort = cohort as Cohort | null;

  let application: CohortApplication | null = null;
  let sessions: MentorshipSession[] = [];

  if (typedCohort && user) {
    const { data: app } = await supabase
      .from("cohort_applications")
      .select("*")
      .eq("cohort_id", typedCohort.id)
      .eq("user_id", user.id)
      .maybeSingle();
    application = app as CohortApplication | null;

    const { data: sessionsData } = await supabase
      .from("sessions")
      .select("*")
      .eq("cohort_id", typedCohort.id)
      .order("scheduled_at");
    sessions = (sessionsData ?? []) as MentorshipSession[];
  }

  return (
    <>
      {!typedCohort && (
        <div className="mw-card p-6 text-sm text-muted">
          No mentorship wave is currently open for applications.
        </div>
      )}

      {typedCohort && (
        <div className="mw-card p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-bold">{typedCohort.name}</h2>
            <span className="chip chip-muted capitalize">{typedCohort.status}</span>
          </div>
          {typedCohort.description_md && (
            <div className="mt-3">
              <Markdown>{typedCohort.description_md}</Markdown>
            </div>
          )}
          {typedCohort.starts_at && (
            <p className="mt-2 text-xs text-muted">
              Starts {new Date(typedCohort.starts_at).toLocaleDateString()}
              {typedCohort.ends_at &&
                ` — ends ${new Date(typedCohort.ends_at).toLocaleDateString()}`}
            </p>
          )}
        </div>
      )}

      {typedCohort && !user && (
        <p className="rounded-xl border border-border bg-white/5 p-4 text-sm text-muted">
          Applications are currently closed.
        </p>
      )}

      {typedCohort && user && !application && (
        <MentorshipApplicationForm cohortId={typedCohort.id} />
      )}

      {typedCohort && user && application && (
        <div className="mw-card p-6">
          <p className="text-sm font-medium">
            Application status: {STATUS_LABEL[application.status]}
          </p>
          <p className="mt-1 text-xs text-muted">
            Submitted {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {sessions.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-white">Upcoming sessions</h2>
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <div key={s.id} className="mw-card p-4">
                <p className="font-medium">{s.title}</p>
                <p className="text-xs text-muted">
                  {new Date(s.scheduled_at).toLocaleString("en-US", {
                    timeZone: "Asia/Manila",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}{" "}
                  (Manila time) &middot; {s.duration_minutes} min
                </p>
                {s.location_url && (
                  <a
                    href={s.location_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-foreground hover:underline"
                  >
                    Join link
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {user && (
        <p className="text-xs text-muted">
          Have a mentor review a trade? Share it from your{" "}
          <Link href="/journal" className="text-foreground hover:underline">
            Trading Journal
          </Link>
          .
        </p>
      )}
    </>
  );
}
