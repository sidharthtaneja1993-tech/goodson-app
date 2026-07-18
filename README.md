# Goodson — Next.js app

Concierge care platform for NRIs coordinating support for parents in India.
Built with Next.js (App Router), Tailwind CSS v4, and Supabase (auth + database).

## What's included

- **Public landing page** (`/`) — hero with a live dual-clock (your city / IST),
  services, pricing (monthly/annual toggle + live currency conversion via
  open.er-api.com), a PIN-code coverage checker, and a waitlist form.
- **Auth** (`/login`, `/signup`) — Supabase email/password auth. New sign-ups
  get a `profiles` row automatically via a DB trigger.
- **Customer dashboard** (`/dashboard`) — shows the signed-in user's plan.
  Protected by middleware; redirects to `/login` if signed out.
- **Admin dashboard** (`/admin`) — read-only tables of waitlist signups and
  customer accounts. Gated by a `profiles.is_admin` flag, not just a session.
- **API routes** — `POST /api/waitlist` (public form submissions),
  `GET /api/pin-check` (coverage lookup against `serviceable_pincodes`).

## Setup

### 1. Create a Supabase project

Free tier is fine to start: https://supabase.com/dashboard

### 2. Run the schema

Open the SQL editor in your Supabase project and run the contents of
`supabase/schema.sql`. This creates:

- `profiles` — one row per user, with `plan`, `billing_cycle`, `is_admin`
- `waitlist` — public signups from the landing page (anon insert allowed)
- `serviceable_pincodes` — coverage lookup, pre-seeded with Delhi (110xxx)

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in your project's URL and anon
key (Supabase dashboard → Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install and run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### 5. Make yourself an admin

Sign up through `/signup`, confirm your email, then in the Supabase SQL
editor:

```sql
update public.profiles set is_admin = true where id = '<your-user-uuid>';
```

Find your UUID under Authentication → Users in the Supabase dashboard.
You can then view `/admin`.

## Deploying

Any Next.js host works (Vercel, Netlify). Set the same two environment
variables in your host's dashboard, and add your production URL to
Supabase → Authentication → URL Configuration (Site URL + Redirect URLs,
so `emailRedirectTo` in the signup flow works).

## Still to wire up before launch

- **WhatsApp**: the site currently collects a phone number on the waitlist
  form but doesn't send anything to WhatsApp automatically. Once you have a
  WhatsApp Business number, the natural place to add it is inside
  `app/api/waitlist/route.ts`, after the Supabase insert.
- **Payments**: no payment gateway is wired in yet (Razorpay/Stripe). Plan
  selection currently just tags the waitlist/profile row with a plan name.
- **Admin write actions**: the admin dashboard is read-only (view waitlist +
  customers). Adding actions like "mark contacted" or "assign plan" would be
  straightforward additions to `app/admin/page.tsx` plus a small API route.

## Project structure

```
app/
  page.tsx                landing page
  login/, signup/         auth pages
  dashboard/              customer dashboard (protected)
  admin/                  admin dashboard (protected + role-gated)
  api/waitlist/           waitlist form submission
  api/pin-check/          PIN code coverage lookup
  auth/callback/          Supabase email-confirmation redirect handler
  auth/signout/           sign-out route
components/               landing page sections + shared UI
lib/supabase/             browser/server/middleware Supabase clients
supabase/schema.sql       full DB schema, RLS policies, seed data
```
