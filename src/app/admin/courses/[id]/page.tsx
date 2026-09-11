import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CourseForm } from "@/components/admin/course-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLesson } from "@/lib/actions/admin";
import type { Course, Lesson } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function AdminCourseDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: course }, { data: lessonsData }] = await Promise.all([
    supabase.from("courses").select("*").eq("id", id).maybeSingle(),
    supabase.from("lessons").select("*").eq("course_id", id).order("position"),
  ]);

  if (!course) notFound();
  const lessons = (lessonsData ?? []) as Lesson[];

  return (
    <div>
      <Link href="/admin/courses" className="text-sm text-muted hover:text-foreground">
        &larr; Courses
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{(course as Course).title}</h1>

      <div className="mt-6">
        <CourseForm course={course as Course} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lessons</h2>
        <Link
          href={`/admin/courses/${id}/lessons/new`}
          className="rounded-full border border-border px-4 py-2 text-sm hover:bg-white/5"
        >
          New lesson
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {lesson.title} {!lesson.is_published && <span className="text-xs text-muted">(draft)</span>}
              </p>
              <p className="text-xs text-muted">
                {lesson.module_title ?? "No module"} &middot; position {lesson.position}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link
                href={`/admin/courses/${id}/lessons/${lesson.id}/edit`}
                className="text-xs text-muted hover:text-foreground"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteLesson.bind(null, id, lesson.id)}
                confirmMessage={`Delete "${lesson.title}"?`}
              />
            </div>
          </div>
        ))}
        {lessons.length === 0 && <p className="text-sm text-muted">No lessons yet.</p>}
      </div>
    </div>
  );
}
