# MJA Website

Maldives Journalist Association — Next.js 14 + Supabase + Vercel

## Stack
- **Next.js 14** (App Router)
- **Supabase** (Database + Auth + Storage)
- **Framer Motion** (animations)
- **React Quill** (article editor)
- **Tailwind CSS**
- **Finlandica** (Google Fonts)

---

## Setup Guide

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/mja-website
cd mja-website
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your project URL and anon key
3. Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

Fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Copy and run the contents of `supabase-schema.sql`

### 4. Create Storage Buckets

In Supabase Dashboard → Storage:
1. Create bucket called `media` → set to **Public**
2. Create bucket called `resources` → set to **Public**

### 5. Create Admin User

In Supabase Dashboard → Authentication → Users:
1. Click "Invite user" or "Add user"
2. Enter your admin email and password
3. This is your login for `/admin`

### 6. Run Locally

```bash
npm run dev
```

Visit:
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variables (same as `.env.local`)
4. Deploy

Vercel auto-deploys on every push to main.

---

## Project Structure

```
app/
├── page.tsx                 # Home
├── news-room/               # News listing + single article
├── campaigns/               # Campaigns listing + detail
├── members-directory/       # Members by category
├── resource-hub/            # Publications, photos, videos
├── the-association/         # About, governance, team
├── join-mja/                # Membership page
└── admin/                   # Protected admin panel
    ├── articles/            # CRUD with Quill editor
    ├── campaigns/           # CRUD
    ├── members/             # CRUD
    └── resources/           # CRUD

components/
├── Nav.tsx                  # Sticky nav with dropdown + mobile
├── Footer.tsx               # 4-column footer
├── HeroSection.tsx          # Animated hero
├── MemberMeter.tsx          # Animated member stats
├── ArticleCard.tsx          # 3 variants: default, featured, compact
├── ArticleEditor.tsx        # Quill rich text editor
├── NewsletterForm.tsx       # Email subscription
├── GetInvolved.tsx          # Dark section with CTAs
└── AdminSidebar.tsx         # Admin navigation

lib/
├── supabase/
│   ├── client.ts            # Browser client
│   ├── server.ts            # Server client
│   └── middleware.ts        # Auth + route protection
└── types.ts                 # TypeScript types
```

---

## Adding Content

### Articles
1. Go to `/admin/articles/new`
2. Write with Quill editor
3. Set category (Latest, Top News, News Room)
4. Upload cover image
5. Publish or save as draft

### Members
1. Go to `/admin/members`
2. Add members to Category One, Two, or Three

### Campaigns
1. Go to `/admin/campaigns`
2. Add hashtag, description, event date/location

---

## DNS Setup (when Cloudflare access is ready)

Add these records in Cloudflare for `mja.mv`:

```
Type    Name    Value                   
A       @       76.76.21.21             (Vercel)
CNAME   www     cname.vercel-dns.com    (Vercel)
```

For email (Zoho):
```
MX      @       mx.zoho.com             Priority 10
MX      @       mx2.zoho.com            Priority 20
MX      @       mx3.zoho.com            Priority 50
TXT     @       v=spf1 include:zoho.com ~all
```
