import { initials, metaLine, type Testimonial } from "@/data/testimonials";

/**
 * One card in the testimonial "wall" grid (`.ml-wall`) — replaces the old
 * editorial lede quote + numbered rows with a bento-style mix of cards, one
 * per hero/card-tier member. `variant` picks the color treatment. `className`
 * is appended as-is — Testimonials.tsx uses it to pass an `.ml-wall-pos-N`
 * class that pins the card to its explicit column/row in the 2-3-2 layout.
 */
export function WallCard({
  member,
  variant = "light",
  className,
}: {
  member: Testimonial;
  variant?: "light" | "dark" | "accent";
  className?: string;
}) {
  const i = member.emphasis ? member.quote.indexOf(member.emphasis) : -1;
  const variantClass = variant === "dark" ? " ml-wall-hero" : variant === "accent" ? " ml-wall-accent" : "";

  return (
    <blockquote
      className={`ml-wall-card${variantClass}${className ? ` ${className}` : ""}`}
      data-testimonial-id={member.id}
    >
      <p className="ml-wall-quote">
        {i === -1 ? (
          member.quote
        ) : (
          <>
            {member.quote.slice(0, i)}
            <em>{member.emphasis}</em>
            {member.quote.slice(i + (member.emphasis?.length ?? 0))}
          </>
        )}
      </p>
      <footer className="ml-wall-by">
        <span className="ml-wall-avatar" aria-hidden>
          {initials(member.name)}
        </span>
        <cite className="ml-cite">
          <span className="ml-wall-name">{member.name}</span>
          <span className="ml-wall-meta">{metaLine(member)}</span>
        </cite>
      </footer>
    </blockquote>
  );
}
