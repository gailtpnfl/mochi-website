/**
 * Next.js shows this automatically the instant a navigation to "/" starts
 * (e.g. closing the Partnership or Mentorship overlays, both of which
 * router.push("/")), before the route's own JS chunk has even finished
 * loading on a cold navigation. Solid ink instead of the default white
 * flash — same idea as mentorship/loading.tsx — so the transition already
 * looks like part of the site's dark theme.
 */
export default function HomeLoading() {
  return <div style={{ position: "fixed", inset: 0, background: "#0d0b24", zIndex: 9999 }} />;
}
