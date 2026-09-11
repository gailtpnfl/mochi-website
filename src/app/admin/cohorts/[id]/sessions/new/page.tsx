import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SessionForm } from "@/components/admin/session-form";

type Params = Promise<{ id: string }>;

export default async function NewSessionPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: cohort } = await supabase.from("cohorts").select("id").eq("id", id).maybeSingle();
  if (!cohort) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">New session</h1>
      <div className="mt-6">
        <SessionForm cohortId={id} />
      </div>
    </div>
  );
}
