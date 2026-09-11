import Link from "next/link";

export function ComingSoon({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: number;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <span className="chip chip-new mb-4">Phase {phase} &mdash; Coming soon</span>
      <h1 className="section-title">{title}</h1>
      <p className="mt-4 text-muted">{description}</p>
      <Link href="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
