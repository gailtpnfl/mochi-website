import { metaLine, type Testimonial } from "@/data/testimonials";

/**
 * Shared attribution. A <cite> inside a <footer> so the name is announced as
 * the source of the surrounding blockquote rather than as body text.
 */
export function Attribution({
  member,
  className = "ml-rowby",
}: {
  member: Testimonial;
  className?: string;
}) {
  return (
    <footer className={className}>
      <cite className="ml-cite">
        <span className="ml-name">{member.name}</span>
        <span className="ml-meta">{metaLine(member)}</span>
      </cite>
    </footer>
  );
}
