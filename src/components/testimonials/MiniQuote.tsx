import { initials, metaLine, type Testimonial } from "@/data/testimonials";

/** One tick in the scrolling ticker. `display` variant is set larger. */
export function MiniQuote({ member }: { member: Testimonial }) {
  return (
    <blockquote
      className={`ml-tick${member.variant === "display" ? " ml-tick-feature" : ""}`}
      data-testimonial-id={member.id}
    >
      <div className="ml-tick-top">
        <span className="ml-tick-avatar" aria-hidden>
          {initials(member.name)}
        </span>
        <span className="ml-tick-mark" aria-hidden>
          &rdquo;
        </span>
      </div>
      <p>{member.quote}</p>
      <footer className="ml-tick-by">
        <cite className="ml-cite">
          <span className="ml-name">{member.name}</span>
          <span className="ml-meta">{metaLine(member)}</span>
        </cite>
      </footer>
    </blockquote>
  );
}
