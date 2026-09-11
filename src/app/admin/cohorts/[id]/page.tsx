import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CohortForm } from "@/components/admin/cohort-form";
import { ApplicationReviewButtons } from "@/components/admin/application-review-buttons";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSession } from "@/lib/actions/admin";
import type { Cohort, MentorshipSession } from "@/lib/types";

type Params = Promise<{ id: string }>;

interface ApplicationRow {
  id: string;
  status: "pending" | "accepted" | "rejected" | "waitlisted";
  experience_level: string | null;
  motivation_md: string | null;
  created_at: string;
  user: { display_name: string | null; discord_username: string | null } | null;
}

interface MemberRow {
  id: string;
  role: string;
  user: { display_name: string | null } | null;
}

export default async function AdminCohortDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: cohort }, { data: applicationsData }, { data: membersData }, { data: sessionsData }] =
    await Promise.all([
      supabase.from("cohorts").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("cohort_applications")
        .select(
          "id, status, experience_level, motivation_md, created_at, user:users!cohort_applications_user_id_fkey(display_name, discord_username)",
        )
        .eq("cohort_id", id)
        .order("created_at", { ascending: false }),
      supabase.from("cohort_members").select("id, role, user:users(display_name)").eq("cohort_id", id),
      supabase.from("sessions").select("*").eq("cohort_id", id).order("scheduled_at"),
    ]);

  if (!cohort) notFound();

  const applications = (applicationsData ?? []) as unknown as ApplicationRow[];
  const members = (membersData ?? []) as unknown as MemberRow[];
  const sessions = (sessionsData ?? []) as MentorshipSession[];

  return (
    <div>
      <Link href="/admin/cohorts" className="text-sm text-muted hover:text-foreground">
        &larr; Cohorts
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{(cohort as Cohort).name}</h1>

      <div className="mt-6">
        <CohortForm cohort={cohort as Cohort} />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Applications</h2>
        <div className="mt-4 flex flex-col gap-2">
          {applications.map((app) => (
            <div key={app.id} className="mw-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{app.user?.display_name ?? "Unknown"}</p>
                  <p className="text-xs text-muted">
                    {app.experience_level} &middot; {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ApplicationReviewButtons id={app.id} status={app.status} />
              </div>
              {app.motivation_md && <p className="mt-2 text-sm text-muted">{app.motivation_md}</p>}
            </div>
          ))}
          {applications.length === 0 && <p className="text-sm text-muted">No applications yet.</p>}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Roster</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {members.map((m) => (
            <span key={m.id} className="rounded-full border border-border px-3 py-1 text-xs">
              {m.user?.display_name ?? "Unknown"} <span className="text-muted">({m.role})</span>
            </span>
          ))}
          {members.length === 0 && <p className="text-sm text-muted">No members yet.</p>}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sessions</h2>
        <Link
          href={`/admin/cohorts/${id}/sessions/new`}
          className="rounded-full border border-border px-4 py-2 text-sm hover:bg-white/5"
        >
          New session
        </Link>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {sessions.map((s) => (
          <div key={s.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-xs text-muted">
                {new Date(s.scheduled_at).toLocaleString("en-US", {
                  timeZone: "Asia/Manila",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}{" "}
                (Manila)
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link
                href={`/admin/cohorts/${id}/sessions/${s.id}/edit`}
                className="text-xs text-muted hover:text-foreground"
              >
                Edit
              </Link>
              <DeleteButton action={deleteSession.bind(null, id, s.id)} confirmMessage={`Delete "${s.title}"?`} />
            </div>
          </div>
        ))}
        {sessions.length === 0 && <p className="text-sm text-muted">No sessions scheduled yet.</p>}
      </div>
    </div>
  );
}
