import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Markdown } from "@/components/markdown";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import type { Course, Lesson } from "@/lib/types";

type Params = Promise<{ slug: string; lessonSlug: string }>;

async function getData(slug: string, lessonSlug: string) {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!course) return null;

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("position");

  const allLessons = (lessons ?? []) as Lesson[];
  const index = allLessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return null;

  return {
    course: course as Course,
    lesson: allLessons[index],
    prev: allLessons[index - 1] ?? null,
    next: allLessons[index + 1] ?? null,
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const data = await getData(slug, lessonSlug);
  if (!data) return { title: "Lesson not found" };
  return { title: `${data.lesson.title} — ${data.course.title}` };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { slug, lessonSlug } = await params;
  const data = await getData(slug, lessonSlug);
  if (!data) notFound();

  const { course, lesson, prev, next } = data;
  const user = await getCurrentUser();

  let done = false;
  if (user) {
    const supabase = await createClient();
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id)
      .maybeSingle();
    done = !!progress;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href={`/learn/${course.slug}`} className="text-sm text-muted hover:text-foreground">
        &larr; {course.title}
      </Link>

      {lesson.module_title && (
        <p className="mt-3 text-xs uppercase tracking-wide text-muted">{lesson.module_title}</p>
      )}
      <h1 className="section-title mt-1">{lesson.title}</h1>

      {lesson.video_url && (
        <div className="mt-6 aspect-video overflow-hidden rounded-xl border border-border">
          <iframe
            src={lesson.video_url}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {lesson.content_md && (
        <div className="mt-6">
          <Markdown>{lesson.content_md}</Markdown>
        </div>
      )}

      <div className="mt-8">
        <MarkCompleteButton
          lessonId={lesson.id}
          courseSlug={course.slug}
          initiallyDone={done}
          signedIn={!!user}
        />
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-border pt-6 text-sm">
        {prev ? (
          <Link href={`/learn/${course.slug}/${prev.slug}`} className="text-muted hover:text-foreground">
            &larr; {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/learn/${course.slug}/${next.slug}`} className="text-muted hover:text-foreground">
            {next.title} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
