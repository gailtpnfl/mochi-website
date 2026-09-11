# Open questions

Divergences between the design reference and later approved work that were
deliberately **not** resolved in code. Each one is live in both forms right now.
Settle it here once, then make the code follow.

---

## 1. Two light palettes

The site's light sections and the Core Team redesign use different, close-but-not-equal
warm neutrals. Nothing was silently swapped either way.

| Role | Existing light section | Core Team redesign |
|---|---|---|
| Page background | `#f9f8f5` | `#f6f4ef` (`--paper`) |
| Body text | `#4a4a6a` | `#615e70` (`--ink-muted`) |
| Heading ink | `#050f1e` | `#0c0b14` (`--ink`) |
| Rules | — | `#d9d3c8` (`--rule`), `#e2ddd3` (`--rule-soft`) |
| Quiet text | — | `#9b96a8` (`--ink-soft`), `#b6b0c2` (`--ink-faint`) |

The redesign's set is warmer and slightly darker in the ink. The existing set is
cooler and slightly blue in the body text.

Where each is used today:

- `--paper` set → `/core-team` only
- `#f9f8f5` set → `.v2-light` sections on the landing page, `/team`, `/story`

**Decide:** one palette for all light surfaces, or keep the warm set as a
deliberate treatment for masthead-style pages. Until then, do not introduce a
third.

`#9522e6` was already `--accent3` and is used as the token — no divergence there.
`#6d5cf0` (link hover) is new, added as `--accent-hover`.

---

## 2. "05 Tiers" in the Core Team stat strip

The redesign's masthead prints **14 People / 05 Tiers / 02 Mentors / 06 Moderators**
as literals. They are now derived from `src/data/coreTeam.ts` so they cannot drift.

Three of the four derive cleanly. "Tiers" does not: the array has **four** groups
(`founder | leadership | mentors | moderators`), so the derived value is `04`,
not the `05` the redesign printed.

`05` is most likely counting the five numbered leadership rows — which include
the Director of Community — as separate tiers, or treating Director as its own
tier alongside the other four.

**Decide:** either accept `04` as correct, or split `director` into its own
group in `coreTeam.ts`, which restores `05` and derives honestly. Do not
hardcode it back.

---

## 3. Two Core Team rosters

`/core-team` renders the static array in `src/data/coreTeam.ts`. `/team` renders
the Supabase `team_members` table, which the admin UI at `/admin/team` edits.
They hold different people and neither updates the other.

The static array carries real names, handles, and social links the database does
not have. The database carries seven trading managers the redesign does not
list.

**Decide:** which is the source of truth, and retire or backfill the other.

---

## 4. `--green` is a genuinely new brand colour

The testimonials redesign introduces `#3ee08f` for the live dot and the
"In person" tag. Nothing in the token set is close to it — the palette has no
green at all — so it was added as `--green` rather than mapped.

Its two uses are both status-ish (a pulsing "live" dot, an "in person" label),
which is a role the palette doesn't otherwise cover.

**Decide:** whether green enters the brand palette properly (in which case it
wants a documented role, and probably hover/muted variants), or whether these
two spots should use `--teal` and the token gets dropped.

The rest of that file's ramp was *not* added. `#b98cff`, `#7ad9f0` and `#9d6bff`
were mapped onto `--accent`, `--teal` and `--accent2`; they sat a few degrees
off the brand tokens and would have read as a rendering fault next to the hero.
Card surfaces and hairlines had no equivalents and became `--card`,
`--card-deep`, `--hairline`, `--hairline-soft`, `--hairline-inner`.

---

## 5. Testimonials: duplicate handle, and what "08 Members" counts

Two things in `src/data/testimonials.ts` that need a human answer:

- **`Mochi | W3BS` appears twice** — once in the 2x2 grid ("From the moment I
  joined…") and once in the In-person panel, both labelled 3–6 months. They are
  carried as two separate submissions (`w3bs-welcome`, `w3bs-meetup`). Confirm
  they are two responses from the same person rather than one duplicated, and
  consolidate if so.
- **The section holds 14 quotes from 13 people**, but the rule above the mini
  grid reads "08 Members". That count is derived from the mini tier only, which
  is the tier the rule introduces. If it is meant to describe the whole section
  it is wrong and should read 13.
- **"Anonymous" sits alongside handles** like `Hide3264` and `riisuix`. A handle
  is still identifying inside the Discord, so if any of those respondents asked
  not to be named, the handle needs replacing with "Anonymous" too. Check
  against the survey before this ships.
