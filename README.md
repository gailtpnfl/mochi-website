# Mochi Web3 — Phase 1 + Phase 2 + Phase 3 + Phase 4

Next.js 16 (App Router) + Tailwind CSS + Supabase, per `Mochi_Web3_Launch_Plan.md` §6 (Phase 1),
the Phase 2 addendum (Learn Web3, TradingView, Trading Materials), the Phase 3 roadmap
(Mentorship, Trading Journal, Job Opportunities), and the Phase 4 roadmap (NFT Community
Collections). Merch stays an external link-out per the plan's explicit scope guardrail — no
store code was added.

## Viewing the site

This repo holds the **source**, not a rendered site. GitHub only displays files — it does not
run Next.js — so browsing an `.html` file here does **not** show the live site.

To see the real thing:

```
npm run dev     # http://localhost:3000
```

The landing page lives in `src/app/page.tsx` and its section components:

| Section | Where |
|---|---|
| Hero, Opportunities, Funded Traders, Events, Partnership, Join | `src/app/page.tsx` |
| Our Story + About overlay | `src/components/landing/about-section.tsx` |
| What We Offer (sticky slider) | `src/components/landing/offer-slider.tsx` |
| Community Testimonials | `src/components/sections/Testimonials.tsx` |
| Core Team (`/core-team`) | `src/app/core-team/page.tsx` |

Roster and quote content is typed data under `src/data/`; team photos are imported with
`node scripts/import-team-photos.mjs`.

## Setup

### Option A — local Supabase via Docker (fastest, no signup)

```
npm install
npx supabase start   # requires Docker Desktop running
npm run dev
```

`supabase start` applies all migrations and seed files automatically (`supabase/config.toml`
lists `seed.sql`, `seed_phase2.sql`, `seed_phase3.sql`, `seed_phase4.sql`). Copy the printed
`API_URL` / `ANON_KEY` into `.env.local` (see `.env.local.example`) if they differ from the
defaults already there.

### Option B — real Supabase.com cloud project

1. Create a Supabase project.
2. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API.
   - In the Supabase dashboard, enable **Authentication → Providers → Discord** with a
     Client ID/Secret from the [Discord Developer Portal](https://discord.com/developers/applications).
     Add `<your-supabase-url>/auth/v1/callback` as the Discord redirect URL.
   - `NEXT_PUBLIC_DISCORD_URL`, `NEXT_PUBLIC_CALENDLY_URL`, `NEXT_PUBLIC_MERCH_URL`,
     `NEXT_PUBLIC_TRADINGVIEW_PROFILE_URL` as needed.
3. Run migrations in order against your project (SQL editor, `supabase db push`, or `psql`):
   `0001_init.sql` → `0002_grants.sql` → `0003_phase2.sql` → `0004_phase3.sql` →
   `0005_phase4.sql`, then `seed.sql` → `seed_phase2.sql` → `seed_phase3.sql` →
   `seed_phase4.sql`.

### Both options

Promote your own account to admin once you've signed in once (auto-creates a `public.users`
row):

```sql
update public.users set role = 'admin' where id = '<your-auth-user-id>';
```

Then visit `/admin`.

## Notes

- This is Next.js 16 — `middleware.ts` is `proxy.ts` here, and `params`/`searchParams` are
  async. See `AGENTS.md` if extending this further.
- Admin CRUD uses Server Actions (`src/lib/actions/admin.ts`); the newsletter and partnership
  inquiry forms use Route Handlers (`src/app/api/*`), matching the "no separate backend"
  architecture from the launch plan.
- **RLS + grants**: enabling RLS is not enough — PostgREST also requires base table `GRANT`s
  for `anon`/`authenticated`, or every request 401s before RLS is evaluated (`0002_grants.sql`).
  Anything using `.upsert()` also needs `SELECT` on the conflict target column, which
  intentionally-insert-only tables (`newsletter_subscribers`) don't grant to the public — use
  a plain `.insert()` + ignore the `23505` unique-violation instead (see `api/newsletter/route.ts`).
- `src/lib/email.ts` stubs the newsletter welcome email behind an `EmailProvider` interface —
  swap in a Resend-backed implementation when `RESEND_API_KEY` is set.
- Mochi Crypto City still renders as a "Coming soon" page — its concept is intentionally
  undefined per the launch plan's own open questions (R7), not something left unbuilt by
  oversight.
- Learn Web3 course engine: `courses` → `lessons` → `lesson_progress` (owner-only RLS, mirrors
  the journal-entry privacy pattern used later for the Trading Journal). One seeded course,
  "Crypto Trading 101", with 3 lessons across 2 modules.
- Trading Materials hub reads from the `trading_tools` registry (`access`: public/members/
  mentees). The BigBoss Calculator is pure client-side (nothing sent to a server); the FVG
  indicator's Pine Script download is gated behind sign-in when `access != 'public'`.
- **Mentorship**: `cohorts` ("Waves") → `cohort_applications` (apply/accept/reject/waitlist,
  accepting auto-creates a `cohort_members` row) → `sessions` (Manila-time display) →
  `trade_reviews`. There's no dedicated "mentor" auth role yet — `cohort_members.role` tracks
  mentor vs. mentee for future use, but in practice admins act as the reviewer today (assign
  themselves via "Take this review" in `/admin/trade-reviews`).
- **Mochi Trading Journal** (`/journal`): strictly owner-only, verified end-to-end with two
  separate test users — an admin genuinely cannot read another member's `journal_entries`
  (RLS `for all using (auth.uid() = user_id)`, no admin bypass). The only crack in that wall is
  intentional: sharing an entry sets `shared_review_id`, which grants read access to exactly
  that entry to whichever user becomes the `trade_reviews.reviewed_by` for it — confirmed this
  doesn't leak a member's *other*, unshared entries.
- **Job Opportunities** (`/jobs`): public listing + detail pages for `status = 'open'` postings,
  admin CRUD for all.
- **PostgREST embedded-resource ambiguity**: tables with two FKs to the same table (e.g.
  `trade_reviews.user_id` and `trade_reviews.reviewed_by`, both → `users`) make a plain
  `user:users(...)` embed fail with `PGRST201` ("more than one relationship was found") — easy
  to miss since our pages defaulted the failed query to an empty list rather than throwing.
  Disambiguate with `users!<constraint_name>(...)`, e.g. `users!trade_reviews_user_id_fkey(...)`
  (see `admin/trade-reviews/page.tsx` and `admin/cohorts/[id]/page.tsx`).
- **NFT Community Collections** (`/nft`): display-only galleries (`nft_collections` →
  `nft_items`), no minting, no wallet connect, per the plan's hard scope exclusions. Item
  visibility inherits from the parent collection's `is_published` flag via an `EXISTS` RLS
  policy — verified a draft collection's items are invisible to anon and visible to admin.
  Merch remains an external link (`NEXT_PUBLIC_MERCH_URL`) with no `products` table; that
  schema only gets built if/when the store goes native, per the plan's own scope note.
