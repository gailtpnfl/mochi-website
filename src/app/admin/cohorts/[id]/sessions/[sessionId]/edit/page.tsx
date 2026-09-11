import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SessionForm } from "@/components/admin/session-form";
import type { MentorshipSession } from "@/lib/types";

type Params = Promise<{ id: string; sessionId: string }>;

export default async function EditSessionPage({ params }: { params: Params }) {
  const { id, sessionId } = await params;
  const supabase = await createClient();
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("cohort_id", id)
    .maybeSingle();

  if (!session) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit session</h1>
      <div className="mt-6">
        <SessionForm cohortId={id} session={session as MentorshipSession} />
      </div>
    </div>
  );
}
