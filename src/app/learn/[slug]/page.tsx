import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Markdown } from "@/components/markdown";
import type { Course, Lesson } from "@/lib/types";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title, description_md")
    .eq("slug", slug)
    .maybeSingle();

  if (!course) return { title: "Course not found" };
  return { title: course.title, description: course.description_md ?? undefined };
}

export default async function CoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!course) notFound();

  const { data: lessonsData } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("position");

  const lessons = (lessonsData ?? []) as Lesson[];

  let completedIds = new Set<string>();
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id);
    completedIds = new Set((progress ?? []).map((p) => p.lesson_id as string));
  }

  const modules = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const key = lesson.module_title ?? "Lessons";
    if (!modules.has(key)) modules.set(key, []);
    modules.get(key)!.push(lesson);
  }

  const typedCourse = course as Course;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/learn" className="text-sm text-muted hover:text-foreground">
        &larr; Learn Web3
      </Link>
      <h1 className="section-title mt-3">{typedCourse.title}</h1>
      {typedCourse.description_md && (
        <div className="mt-3">
          <Markdown>{typedCourse.description_md}</Markdown>
        </div>
      )}

      {!user && (
        <p className="mt-4 rounded-xl border border-border bg-white/5 p-4 text-xs text-muted">
          Progress tracking is unavailable.
        </p>
      )}

      <div className="mt-10 flex flex-col gap-8">
        {[...modules.entries()].map(([moduleTitle, moduleLessons]) => (
          <div key={moduleTitle}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              {moduleTitle}
            </h2>
            <div className="flex flex-col gap-2">
              {moduleLessons.map((lesson) => {
                const done = completedIds.has(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    href={`/learn/${typedCourse.slug}/${lesson.slug}`}
                    className="mw-card mw-card-lift flex items-center gap-3 p-4"
                  >
                    {done ? (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                    ) : (
                      <Circle size={18} className="shrink-0 text-muted" />
                    )}
                    <span className="text-sm">{lesson.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {lessons.length === 0 && (
          <p className="text-sm text-muted">Lessons for this course are coming soon.</p>
        )}
      </div>
    </div>
  );
}
