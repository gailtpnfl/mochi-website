import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "@/components/admin/lesson-form";

type Params = Promise<{ id: string }>;

export default async function NewLessonPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase.from("courses").select("id").eq("id", id).maybeSingle();
  if (!course) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">New lesson</h1>
      <div className="mt-6">
        <LessonForm courseId={id} />
      </div>
    </div>
  );
}
