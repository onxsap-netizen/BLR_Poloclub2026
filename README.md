# ThePoloClub.BLR

A premium, dark-themed community website for ThePoloClub.BLR — built with Next.js 15, React 19, Tailwind CSS, Framer Motion, and Supabase.

## What's included

- **Home / About / Events / Gallery** — full marketing site with cinematic hero, animated stats, and content sections
- **Join Community** — 4-step application form (personal details → car details with photo upload → community questions → Code of Conduct with scroll-gated acceptance), saved to Supabase
- **Admin Panel** (`/admin`) — open dashboard (no login) with two tabs:
  - **Applications** — search, filter, approve/reject, view uploaded photos, add notes, export to Excel
  - **Events** — create/edit/delete upcoming events with cover image and gallery uploads, publish/unpublish
- **Public Events** — the `/events` page and homepage automatically show published events from the Events tab
- **Member Profiles** (`/profile/[id]`) — auto-created when an application is approved

> **Already deployed before?** If you set up Supabase before the Events feature was added, re-run `supabase/schema.sql` in the SQL Editor — it's safe to run again (`create table if not exists` / `on conflict do nothing`) and will add the new `events` table and `event-images` storage bucket without touching your existing data.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Supabase (free tier is enough)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**, open `supabase/schema.sql` from this project, paste the entire contents, and run it. This creates the `applications` and `members` tables, row-level security policies, and the `car-photos` / `insurance-docs` storage buckets.
3. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (click "reveal") → `SUPABASE_SERVICE_ROLE_KEY` — **keep this secret, server-only**

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`. Admin dashboard is at `http://localhost:3000/admin` — no login required, so don't share this link publicly.

## 5. Deploy to Netlify

1. Push this project to a GitHub repo
2. In Netlify: **Add new site → Import an existing project**, connect the repo
3. Netlify will detect `netlify.toml` automatically (build command `npm run build`, Next.js plugin included)
4. Add the same 3 environment variables from `.env.local` in **Site settings → Environment variables**
5. Deploy

## Folder structure

```
app/                  Next.js App Router pages
  page.tsx            Home
  about/, events/, gallery/, join/    Marketing pages
  admin/              Open dashboard (no login)
  profile/[id]/       Member profile pages
components/
  sections/           Homepage/marketing sections
  forms/               Join form steps + shared field components
  admin/               Admin dashboard UI
  ui/                  Small reusable UI (particles, etc.)
lib/
  supabase/            Browser, server, and admin (service-role) clients
  types.ts             Shared TypeScript types
  formSchema.ts         Zod validation for the join form
  adminAuth.ts          Auth stub (currently always allows access)
  adminActions.ts        Server actions: fetch/approve/reject applications
  exportExcel.ts          Excel export
  codeOfConduct.ts        Rules content shown in Step 4
supabase/schema.sql   Run this in the Supabase SQL editor
```

## Notes

- **The `/admin` dashboard has no password** — anyone with the URL can view applications (including phone numbers, emergency contacts, and insurance uploads) and manage events. Don't link to it from the public site, and only share the URL with people you trust. To add a password back later, see the comment at the top of `lib/adminAuth.ts`.
- Photos upload directly from the browser to Supabase Storage (`car-photos` bucket is public so photos display in the admin panel and future member profiles; `insurance-docs` is private and only readable via the service-role key).
- Replace the placeholder Unsplash imagery in `Hero.tsx`, `GalleryPreview.tsx`, and `GalleryGrid.tsx` with real club photos when available.
