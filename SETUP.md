# TrueRoute — Full setup (PWA + Supabase + offline)

## 1. Run locally (works immediately)

```bash
cd trueroute
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000 → **Profile** → **Download for offline**

Admin: http://localhost:3000/admin — **only** `yadavraj1244@gmail.com` (Google or password in `.env`)

## 2. Supabase (production database)

1. Create project at [supabase.com](https://supabase.com) (e.g. `trueroute-production`)
2. SQL Editor → paste entire file: `supabase/schema.sql` → Run
3. Copy keys to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

4. SQL Editor → run `supabase/auth-trigger.sql` (syncs Google/email users to `public.users`)
5. **Google login:** Authentication → Providers → Google → enable  
   - Google Cloud Console: OAuth client (Web)  
   - Authorized redirect: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`  
   - In Supabase → URL Configuration add: `http://localhost:3000/auth/callback` (and your production URL)
6. Enable **Email** provider for password + magic link sign-in
7. **Confirm email:** Authentication → Providers → Email → turn **ON** “Confirm email” (required — blocks fake signups)
8. Create founder admin user: Authentication → Users → Add user → `yadavraj1244@gmail.com` with your admin password, or sign up once via `/admin/login`

## 3. Stadia Maps (required for production `/map`)

**Local dev:** `http://localhost:3000/map` works **without** an API key (rate-limited).

**Production (your real domain):**

1. Sign up free at [client.stadiamaps.com](https://client.stadiamaps.com/)
2. **Recommended:** Domain authentication — add your domain (e.g. `trueroute.app`) under Authentication → no key in frontend code
3. **Or** API key in `.env`:

```env
NEXT_PUBLIC_STADIA_MAPS_API_KEY=your-key
STADIA_MAPS_API_KEY=your-key
```

4. Restart `npm run dev` or redeploy on Vercel

**`/map` features:** Leaflet map + Stadia tiles, **Search** (autocomplete), **Directions** (route line + km/min), **Near me** (food, hospital, ATM…), GPS, map style picker, TrueRoute 🧭 markers from offline pack.

APIs used (via TrueRoute `/api/map/*`): Stadia geocoding, autocomplete, routing.

## 4. Free API keys (optional but recommended)

```env
GOOGLE_GEMINI_API_KEY=     # https://ai.google.dev — AI chat
OPENWEATHER_API_KEY=       # https://openweathermap.org — weather bar
GROQ_API_KEY=              # fallback AI
```

## 5. PWA install (tourist phone)

1. Open site in Chrome (Android) or Safari (iOS)
2. **Install app** banner or Add to Home Screen
3. Download offline pack once on WiFi

## 6. What works offline (after download)

| Tool | Offline |
|------|---------|
| Fair prices | ✅ full search |
| Emergency | ✅ call + SOS GPS share |
| Translate phrases | ✅ all cached |
| Places | ✅ list + detail |
| Map (search/routes) | ❌ needs internet |
| Map (GPS + TrueRoute pins) | ✅ after offline pack download |
| AI chat | ✅ smart answers from pack |
| Submit price | ✅ queued until online |

## 7. What saves to database (when Supabase configured)

- Every AI chat → `chat_conversations`
- GPS every 30s → `gps_tracking`
- Danger zone checks → `gps_tracking` + alerts
- Translations → `translations`
- Feedback → `feedback`
- All actions → `activity_log`
