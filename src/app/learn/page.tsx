import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/lib/types";

export const metadata: Metadata = {
  title: "Learn Web3",
  description: "Mochi's course engine — starting with Crypto Trading 101.",
};

export default async function LearnPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("position");

  const courses = (data ?? []) as Course[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <span className="section-eyebrow">03 &middot; Education</span>
      <h1 className="section-title">Learn Web3</h1>
      <p className="section-sub">
        Courses built by the Mochi team. No gamification, no badges — just lessons that get
        you to competent.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/learn/crypto-trading-101"
          className="mw-card mw-card-lift flex flex-col gap-2 p-6 sm:col-span-2"
        >
          <span className="section-eyebrow">Featured</span>
          <h2 className="text-lg font-bold">Crypto Trading 101</h2>
          <p className="text-sm text-muted">
            From candlesticks to Smart Money Concepts — 33 chapters, 8 quizzes, fully self-paced.
          </p>
        </Link>
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/learn/${course.slug}`}
            className="mw-card mw-card-lift flex flex-col gap-2 p-6"
          >
            <h2 className="text-lg font-bold">{course.title}</h2>
            {course.description_md && (
              <p className="text-sm text-muted">{course.description_md}</p>
            )}
          </Link>
        ))}
        {courses.length === 0 && (
          <p className="text-sm text-muted">No courses published yet &mdash; check back soon.</p>
        )}
      </div>
    </div>
  );
}
