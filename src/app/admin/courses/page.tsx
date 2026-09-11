import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteCourse } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Course } from "@/lib/types";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("*").order("position");

  const courses = (data ?? []) as Course[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-4 py-2 text-sm font-medium text-white"
        >
          New course
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {courses.map((c) => (
          <div key={c.id} className="mw-card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {c.title} {!c.is_published && <span className="text-xs text-muted">(draft)</span>}
              </p>
              <p className="text-xs text-muted">/{c.slug}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link href={`/admin/courses/${c.id}`} className="text-xs text-muted hover:text-foreground">
                Manage lessons
              </Link>
              <DeleteButton action={deleteCourse.bind(null, c.id)} confirmMessage={`Delete "${c.title}" and all its lessons?`} />
            </div>
          </div>
        ))}
        {courses.length === 0 && <p className="text-sm text-muted">No courses yet.</p>}
      </div>
    </div>
  );
}
