# Deploying to Hostinger (Node.js Web App)

Verified against Next.js 16.2.10 on 2026-07-31. Replace `your-domain.com`
throughout with the real domain.

## 1. Pick the right product

On Hostinger's "How do you want to build your website?" screen choose
**Web App** (the Node.js option under *For advanced users*).

Not the other options: Horizons/Builder/WordPress generate a site and discard
this codebase, and **PHP/HTML** is static file hosting. This app cannot be
statically exported — `npm run build` marks all 85 routes `ƒ (Dynamic,
server-rendered on demand)`, because pages query Supabase per request, server
actions post back, and `proxy.ts` (middleware) runs on every request.

**Plan requirement:** Node.js Web Apps need Business Web Hosting or a Cloud
plan (Startup / Professional / Enterprise). They are not available on the
cheaper shared tiers.

## 2. Runtime

| Setting | Value |
| --- | --- |
| Node.js version | **22.x** (24.x also fine) |
| Build command | `npm run build` |
| Start command | `npm start` |

`next` declares `engines: { node: ">=20.9.0" }`, so 18.x will fail — do not
leave the selector on the default if it is 18. Hostinger offers 18.x, 20.x,
22.x, and 24.x; 22.x is the safe LTS pick (local dev runs 24.18.0).

Never use `npm run dev` as the start command.

`next start` reads `PORT` from the environment automatically, so no code change
is needed for Hostinger's port assignment. If their runtime requires it to be
explicit, use `npx next start -p $PORT`.

## 3. Environment variables

Set these in the Hostinger dashboard (Node.js app → Environment Variables).
Never commit them — `.gitignore` excludes `.env*`.

### Required — the app breaks without these

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page. Safe to expose; RLS is the guard |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` — **no trailing slash** |

### Optional — features degrade quietly if unset

| Variable | Effect when unset |
| --- | --- |
| `NEXT_PUBLIC_DISCORD_URL` | Falls back to `https://discord.gg/ZGJm8vKUbz` |
| `NEXT_PUBLIC_MERCH_URL` | Merch links become `#` (dead links) |
| `NEXT_PUBLIC_CALENDLY_URL` | Partners page booking link |
| `NEXT_PUBLIC_TRADINGVIEW_PROFILE_URL` | TradingView page profile link |

### Not needed

`SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` appear in
`.env.local.example` but **no code reads them** — `lib/email.ts` is still a
stub. Leave them unset until something actually uses them; the service role key
bypasses RLS, so don't put it in the environment before it's needed.

### `NEXT_PUBLIC_*` is baked in at build time

These are inlined into the client bundle during `npm run build`, not read at
boot. Changing one in the dashboard requires a **rebuild**, not a restart.

## 4. Supabase configuration

In the Supabase dashboard → Authentication → URL Configuration:

- **Site URL:** `https://your-domain.com`
- **Redirect URLs:** `https://your-domain.com/auth/callback`

`login-form.tsx` builds the callback as `${window.location.origin}/auth/callback`,
so the production origin must be on the allow list or Discord/magic-link login
fails with `auth` errors.

Also apply the pending migrations to the production project — `0006_team_tiers`,
`0007_team_ign`, and `0008_journal_leverage_margin` are new and not yet
committed.

### Proxy gotcha

`src/app/auth/callback/route.ts` redirects using `origin` derived from
`request.url`. Behind a reverse proxy that doesn't forward the original host,
that can resolve to an internal address and bounce users somewhere wrong. If
login lands on the wrong host after deploying, that line is the cause — switch
it to `NEXT_PUBLIC_SITE_URL`.

## 5. Repository

Deploy from GitHub. Before the first push:

- `.gitignore` now excludes `design-assets/`, `ref-package/`, and both
  `.zip` archives (~2.3 MB of design source that never gets served).
- Everything still untracked **is required to build** — `public/images/`,
  `public/fonts/`, `landing.css`, `chrome.css`, `src/components/landing/`,
  `src/components/course/`, `team-org-chart.tsx`, `trade-card.tsx`,
  `src/lib/course/`, `src/app/learn/crypto-trading-101/`, the icons, and the
  three SQL migrations. If these aren't committed, the deployed build fails.

## 6. Verified locally

```
npm run build   ✓ compiled in 4.1s, TypeScript clean, 85 routes, 0 warnings
npm start       ✓ ready in 186ms
```

Smoke test against the production server: `/`, `/partners`, `/team`,
`/learn/crypto-trading-101`, `/login`, `/sitemap.xml` → 200; `/journal` → 307
to login (auth-gated, expected).
