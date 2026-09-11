import { Attribution } from "./attribution";
import type { Testimonial } from "@/data/testimonials";

/**
 * The lede pull-quote. `emphasis` names a substring to render in the gradient
 * accent; the quote is split around it so the stored text stays verbatim.
 */
export function HeroQuote({ member }: { member: Testimonial }) {
  const i = member.emphasis ? member.quote.indexOf(member.emphasis) : -1;

  return (
    <blockquote className="ml-lede">
      <p className="ml-lede-quote">
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
      <Attribution member={member} className="ml-lede-by" />
    </blockquote>
  );
}
