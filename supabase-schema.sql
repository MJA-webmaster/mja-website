-- =============================================
-- MJA Website - Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Articles (News Room)
create table articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image text,
  category text default 'news-room' check (category in ('latest', 'top-news', 'news-room')),
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Campaigns
create table campaigns (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  hashtag text,
  description text,
  content text,
  cover_image text,
  event_date timestamptz,
  event_location text,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Members Directory
create table members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null check (category in ('category-one', 'category-two', 'category-three')),
  representing text,
  years_in_journalism integer,
  photo text,
  bio text,
  facebook text,
  instagram text,
  linkedin text,
  twitter text,
  member_since date,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Executive Committee (Governance)
create table executive_committee (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  is_president boolean default false,
  representing text,
  years_in_journalism integer,
  photo text,
  bio text,
  facebook text,
  instagram text,
  linkedin text,
  twitter text,
  "order" integer default 0,
  created_at timestamptz default now()
);

-- MJA Team
create table team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  position text not null,
  photo text,
  bio text,
  "order" integer default 0,
  created_at timestamptz default now()
);

-- Resource Hub
create table resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text not null check (category in ('publication', 'photo', 'video', 'code-of-conduct')),
  file_url text,
  external_url text,
  file_size text,
  published boolean default true,
  created_at timestamptz default now()
);

-- Newsletter Subscribers
create table newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  subscribed_at timestamptz default now()
);

-- Member Stats (single row, updatable)
create table member_stats (
  id integer primary key default 1,
  local integer default 0,
  international integer default 0,
  non_member_contributors integer default 0,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- Insert default member stats
insert into member_stats (local, international, non_member_contributors)
values (2000, 1300, 560);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

alter table articles enable row level security;
alter table campaigns enable row level security;
alter table members enable row level security;
alter table executive_committee enable row level security;
alter table team_members enable row level security;
alter table resources enable row level security;
alter table newsletter_subscribers enable row level security;
alter table member_stats enable row level security;

-- Public read access for published content
create policy "Public read articles" on articles
  for select using (published = true);

create policy "Public read campaigns" on campaigns
  for select using (published = true);

create policy "Public read members" on members
  for select using (is_active = true);

create policy "Public read executive committee" on executive_committee
  for select using (true);

create policy "Public read team" on team_members
  for select using (true);

create policy "Public read resources" on resources
  for select using (published = true);

create policy "Public read member stats" on member_stats
  for select using (true);

-- Newsletter: anyone can subscribe
create policy "Anyone can subscribe" on newsletter_subscribers
  for insert with check (true);

-- Admin full access (authenticated users)
create policy "Admin all articles" on articles
  for all using (auth.role() = 'authenticated');

create policy "Admin all campaigns" on campaigns
  for all using (auth.role() = 'authenticated');

create policy "Admin all members" on members
  for all using (auth.role() = 'authenticated');

create policy "Admin all executive committee" on executive_committee
  for all using (auth.role() = 'authenticated');

create policy "Admin all team" on team_members
  for all using (auth.role() = 'authenticated');

create policy "Admin all resources" on resources
  for all using (auth.role() = 'authenticated');

create policy "Admin all newsletter" on newsletter_subscribers
  for all using (auth.role() = 'authenticated');

create policy "Admin update stats" on member_stats
  for all using (auth.role() = 'authenticated');

-- =============================================
-- Storage Buckets
-- =============================================
-- Run these separately in Supabase dashboard > Storage
-- or via API:
--
-- Bucket: "media" (public)
--   - article cover images
--   - campaign images
--   - member photos
--   - team photos
--
-- Bucket: "resources" (public)
--   - PDF publications
--   - downloadable files
-- =============================================

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_articles_updated_at
  before update on articles
  for each row execute function update_updated_at();

create trigger update_campaigns_updated_at
  before update on campaigns
  for each row execute function update_updated_at();
