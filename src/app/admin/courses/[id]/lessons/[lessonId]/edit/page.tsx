import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "@/components/admin/lesson-form";
import type { Lesson } from "@/lib/types";

type Params = Promise<{ id: string; lessonId: string }>;

export default async function EditLessonPage({ params }: { params: Params }) {
  const { id, lessonId } = await params;
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .eq("course_id", id)
    .maybeSingle();

  if (!lesson) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit lesson</h1>
      <div className="mt-6">
        <LessonForm courseId={id} lesson={lesson as Lesson} />
      </div>
    </div>
  );
}
