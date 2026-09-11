import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSE } from "@/lib/course/crypto-101-data";
import { CourseReader } from "@/components/course/course-reader";

type Params = Promise<{ slug: string }>;

const VALID = new Set([
  ...COURSE.chapters.map((c) => c.slug),
  ...(COURSE.finalQuiz ? ["final-exam"] : []),
]);

export function generateStaticParams() {
  return [...VALID].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = COURSE.chapters.find((c) => c.slug === slug);
  const title = chapter ? `${chapter.title} · ${COURSE.title}` : `Final Exam · ${COURSE.title}`;
  return { title };
}

export default async function ChapterPage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!VALID.has(slug)) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <CourseReader slug={slug} />
    </div>
  );
}
