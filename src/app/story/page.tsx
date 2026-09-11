import type { Metadata } from "next";
import "./story.css";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Mochi started, what we believe, and where we're headed.",
};

const TIMELINE = [
  {
    date: "November 2024",
    title: "The Beginning",
    body: "Mochi Web3 was founded with a single belief: Web3 education should be free, accessible, and honest. We started with a small group of traders sharing real knowledge — no hype, no paid gatekeeping.",
  },
  {
    date: "Early 2025",
    title: "Community Growth",
    body: "Word spread fast. Our no-nonsense approach to crypto education attracted thousands of learners — from total beginners to experienced traders looking for a disciplined community.",
  },
  {
    date: "Mid 2025",
    title: "Expanding the Ecosystem",
    body: "We launched curated airdrop guides, live trading sessions, and the BigBoss Calculator. 30,000+ members later, Mochi Web3 is becoming the Web3 community for everyday people.",
  },
  {
    date: "Now",
    title: "Building the Future",
    body: "NFT collections, community merch, real-time market tools, and mentorship programs — we're building the most complete free Web3 ecosystem for our members.",
  },
];

export default function StoryPage() {
  return (
    <div className="story-page">
      <div className="story-shell">
        <span className="story-eyebrow">
          <span className="badge-dot" />
          Our Story
        </span>

        <h1 className="story-headline">
          Built to be <em className="story-em">accessible</em>
        </h1>

        <p className="story-sub">
          From a small chat group to a 30,000-strong Web3 community &mdash; here&apos;s how Mochi
          Web3 came to be.
        </p>

        <section className="story-why">
          <p className="story-quote">
            The gap between paid trading signals and <em className="story-em">real, free</em>{" "}
            education is exactly where we live.
          </p>
          <p>
            Most of Web3 education is either locked behind a paywall or buried in hype. We built
            Mochi Web3 in the space between &mdash; a place where the guides are free, the
            community is real, and nobody is trying to sell you a signal. That&apos;s not a
            marketing angle, it&apos;s the whole reason we started.
          </p>
        </section>

        <div className="story-timeline">
          {TIMELINE.map((item) => (
            <div key={item.date} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-date">{item.date}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
