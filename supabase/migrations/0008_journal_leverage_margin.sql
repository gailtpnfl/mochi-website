-- Leverage and margin for journal entries.
--
-- Optional (nullable) on purpose: existing entries predate these fields, and
-- spot trades have no leverage. They feed the shareable Mochi trade card, which
-- derives realised PnL % / USD from entry, exit, leverage and margin.

alter table public.journal_entries
  add column if not exists leverage numeric,
  add column if not exists margin numeric;
