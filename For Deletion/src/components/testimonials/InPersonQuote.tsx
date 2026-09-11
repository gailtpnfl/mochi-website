import { Attribution } from "./attribution";
import type { Testimonial } from "@/data/testimonials";

/** The events strip below the ticker. */
export function InPersonQuote({ member }: { member: Testimonial }) {
  return (
    <blockquote className="ml-events">
      <div className="ml-events-kicker">
        In
        <br />
        person
      </div>
      <p>{member.quote}</p>
      <Attribution member={member} />
    </blockquote>
  );
}
