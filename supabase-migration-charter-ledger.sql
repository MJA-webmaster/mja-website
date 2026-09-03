-- =============================================
-- MJA Website — Charter & Open Ledger migration
-- Run this in your Supabase SQL Editor
-- (safe to run even though `pages` may already exist live —
--  the `if not exists` guards make it idempotent)
-- =============================================

-- Generic CMS pages (already used by /admin/pages — included here so
-- schema stays reproducible from a fresh Supabase project)
create table if not exists pages (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  content text,
  updated_at timestamptz default now()
);

alter table pages enable row level security;

create policy if not exists "Public read pages" on pages
  for select using (true);

create policy if not exists "Admin update pages" on pages
  for all using (auth.role() = 'authenticated');

-- Seed the Charter page if it doesn't exist yet
insert into pages (slug, title, content)
values ('charter', 'MJA Charter', '<p>The MJA Charter content goes here — edit from Admin → Pages.</p>')
on conflict (slug) do nothing;

-- =============================================
-- Open Ledger — financial transparency
-- =============================================
create table if not exists ledger_entries (
  id uuid default gen_random_uuid() primary key,
  entry_date date not null default current_date,
  type text not null check (type in ('income', 'expense')),
  category text not null check (category in ('Advocacy', 'Training', 'Administrative & Others')),
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  created_at timestamptz default now()
);

alter table ledger_entries enable row level security;

create policy if not exists "Public read ledger" on ledger_entries
  for select using (true);

create policy if not exists "Admin manage ledger" on ledger_entries
  for all using (auth.role() = 'authenticated');
