-- Phase 2 seed: Crypto Trading 101 course, trading_tools registry, watchlist.
-- Run after seed.sql.

insert into public.courses (id, slug, title, description_md, is_published, position) values
  (
    '33333333-3333-3333-3333-333333333333',
    'crypto-trading-101',
    'Crypto Trading 101',
    'The fundamentals: reading charts, managing risk, and thinking in probabilities instead of predictions.',
    true,
    1
  )
on conflict (id) do nothing;

insert into public.lessons (course_id, slug, title, module_title, content_md, position, is_published) values
  (
    '33333333-3333-3333-3333-333333333333',
    'why-risk-management-first',
    'Why Risk Management Comes First',
    'Foundations',
    E'## The core idea\n\nMost beginners look for the "right" entry. Experienced traders look for the acceptable *loss* first.\n\nBefore every trade, know:\n\n1. How much you''re risking (in % of account, not just $).\n2. Where you''re wrong (your stop).\n3. What you get if you''re right (your target, and your R:R).\n\nThe BigBoss Calculator in Trading Materials does this math for you.',
    1,
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'reading-a-candle',
    'Reading a Single Candlestick',
    'Foundations',
    E'## Anatomy of a candle\n\nOpen, high, low, close. Body vs. wick. A long wick tells a different story than a long body.\n\nThis lesson is a placeholder for the full video walkthrough coming in a later content pass.',
    2,
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'position-sizing-in-practice',
    'Position Sizing in Practice',
    'Risk Management',
    E'## Worked example\n\nAccount: $2,000. Risk: 1% ($20). Entry: $100. Stop: $95 (5% away).\n\nPosition size = risk amount / (entry - stop) = $20 / $5 = 4 units ($400 position).\n\nTry it yourself with the BigBoss Calculator.',
    3,
    true
  )
on conflict (course_id, slug) do nothing;

insert into public.trading_tools (slug, name, description, tool_type, access, position) values
  ('bigboss-calculator', 'BigBoss Calculator', 'Position-size and risk calculator. Fully client-side, nothing is stored unless you save a preset.', 'calculator', 'public', 1),
  ('watchlist', 'Watchlist by BigDaddyDaks', 'A curated, education-framed watchlist maintained by BigDaddyDaks.', 'watchlist', 'public', 2),
  ('fvg-indicator', 'FVG Trading Indicator', 'Fair Value Gap indicator with a TradingView install guide.', 'indicator', 'members', 3),
  ('crypto-city', 'Mochi Crypto City', 'Concept still being defined by the team.', 'page', 'public', 4)
on conflict (slug) do nothing;

insert into public.watchlist_items (symbol, exchange, thesis_md, status) values
  ('BTCUSDT', 'BINANCE', 'Watching reaction at prior range highs. Educational note, not a call — always confirm with your own analysis.', 'watching'),
  ('ETHUSDT', 'BINANCE', 'Relative strength vs. BTC worth tracking through this range. Educational note, not a call.', 'active'),
  ('SOLUSDT', 'BINANCE', 'Closed out this idea after invalidation. Kept here for the post-mortem.', 'closed')
on conflict do nothing;
