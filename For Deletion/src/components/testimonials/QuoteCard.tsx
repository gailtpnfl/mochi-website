import { Attribution } from "./attribution";
import { pad2, type Testimonial } from "@/data/testimonials";

/** One numbered editorial row. Tag colour alternates teal/accent by position. */
export function QuoteCard({ member, index }: { member: Testimonial; index: number }) {
  return (
    <blockquote className="ml-rowitem">
      <div className="ml-idx" aria-hidden>
        {pad2(index + 1)}
      </div>
      <div>
        <p className="ml-rowquote">{member.quote}</p>
        {member.tag && (
          <span className={`ml-rowtag ${index % 2 === 0 ? "ml-tag-teal" : "ml-tag-accent"}`}>
            {member.tag}
          </span>
        )}
      </div>
      <Attribution member={member} />
    </blockquote>
  );
}
