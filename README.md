# TrueRoute — The Honest Travel Companion

Nepal-first travel app: fair prices, places, AI guide, translation, emergency info.

## PWA + offline (for tourists)

TrueRoute is a **Progressive Web App**. Install from the browser (Add to Home Screen).

**Offline travel pack** (IndexedDB + localStorage):
- Fair prices, places, emergency numbers, translation phrases, FAQ
- Profile, chat history, queued price submissions
- Download once on hotel WiFi: **Profile → Download for offline**

Works without internet: `/prices`, `/emergency`, `/translate` (phrases), `/places`, `/chat` (smart offline answers).

## Quick start

```bash
cd trueroute
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin panel (update everything on your website)

1. Go to **http://localhost:3000/admin**
2. Password: `trueroute2025` (change in `.env` → `ADMIN_PASSWORD`)
3. Manage: Cities, Places, Fair Prices, FAQ, Testimonials, Gallery, Emergency numbers, Phrases, Site text, Waitlist

## Optional: live AI chat

Add to `.env`:

```
GROQ_API_KEY=your_key_from_console.groq.com
```

## Deploy (free)

1. Push to GitHub
2. Import on [Vercel](https://vercel.com) — set env vars from `.env.example`
3. For production DB, use [Supabase PostgreSQL](https://supabase.com) and set `DATABASE_URL` to the Postgres connection string

## Founder

Built from Birgunj, Nepal — for every traveler who deserves fair prices.
