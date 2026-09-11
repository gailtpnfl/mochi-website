/**
 * Next.js shows this automatically the instant navigation to /mentorship
 * starts, before page.tsx's own module has even finished loading/rendering
 * (a cold nav needs to fetch that route's JS chunk first). Solid navy
 * instead of the default white flash, so the transition already looks like
 * part of the ao-dark theme rather than a blank page — closes the gap with
 * "Partner With Us", which has nothing to load at all since it's already
 * mounted on the homepage.
 */
export default function MentorshipLoading() {
  return <div style={{ position: "fixed", inset: 0, background: "#050f1e", zIndex: 9999 }} />;
}
