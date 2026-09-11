# Design reference — read this first

The original `mochiworld-v2.html` is ~3MB because a font and three PNGs were inlined as base64. Reading it blows the context window. **Never open it.** Everything in it is here, split into pieces small enough to read one at a time.

## Read order

1. `css/tokens.css` — the `:root` token set and the `@font-face` rule. Source of truth for every colour, radius, and easing curve. Start here for any UI work.
2. `sections/<name>.html` — markup for one section. Open only the one you're building.
3. `css/*.css` — styles, split by concern. Match the section to its stylesheet using the table below.
4. `js/*.js` — the two behaviour blocks.

## File map

| Section | Markup | Styles |
|---|---|---|
| Nav + mobile menu | `sections/_nav.html`, `sections/_mobile-menu.html` | `00-core.css` |
| Hero | `sections/home.html` | `00-core.css`, `01-mochi-brilliant-patterns.css` |
| Our Story | `sections/story.html` | `03-v2-styles.css` |
| What We Offer (sticky slider) | `sections/what-we-offer.html` | `03-v2-styles.css` |
| Opportunities | `sections/airdrops.html` | `02-brilliant-section-backgrounds.css`, `03-v2-styles.css` |
| Testimonials | `sections/community-love.html` | `04-community-love.css` |
| Funded Traders | `sections/funded.html` | `05-funded-events.css` |
| Events | `sections/events.html` | `05-funded-events.css` |
| Partnership | `sections/partnership.html` | `03-v2-styles.css` |
| Footer | `sections/_footer.html` | `00-core.css`, `03-v2-styles.css` |
| About overlay | `sections/_about-overlay.html` | `03-v2-styles.css` |

`js/00-behaviors.js` — nav scroll state, burger, `.reveal` IntersectionObserver, scroll-progress bar, FAQ accordion.
`js/01-behaviors.js` — About overlay open/close, and the scroll-driven offer slider.

## Assets

- `assets/fonts/urania-black.otf` — headings (`h1`–`h5`). Body is DM Sans via Google Fonts.
- **DM Mono (400/500)** — handles, social labels, and the "SOON" state. Added by the Core Team redesign and now part of the type system; declared in `css/tokens.css` as `--font-dm-mono`.

Unresolved divergences between this reference and later approved work are tracked in `OPEN-QUESTIONS.md` — read it before picking a light-surface colour.
- `assets/brand/mochi-logo.png` — nav and footer mark (downscaled from 1243px to 512px).
- `assets/brand/mochi-crest.png` — hero `hexglow` crest, 256px.

## Whole-file view

`mochiworld-v2.slim.html` is the full reference with assets referenced by path instead of inlined — 120KB, opens in a browser, renders identically. Open it in a browser tab to compare against. Do not read it into context; use the split files instead.
