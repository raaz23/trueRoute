# TrueRoute — Project Context

> **Purpose:** Single source of truth for humans and AI assistants working on this codebase.  
> **Product:** Nepal-first honest travel **service** — fair prices, places, AI guide, translation, emergency, offline PWA. **Not a brochure site.**  
> **Founder:** Solo builder, Birgunj, Nepal · budget: free-tier tools only.  
> **Project root:** `trueroute/` (where `package.json` lives)

---

## AI agent workflow (required)

**Any AI agent (Cursor, Cline, Copilot, etc.) working on this project MUST follow this every time:**

### Before starting any task

1. **Read `PROJECT_CONTEXT.md`** (this file) — at minimum sections relevant to your task.
2. **Read `.clinerules`** (`trueroute/.clinerules`) — conventions and constraints.
3. Do not write or change code until you understand how the task fits the existing architecture.

### After completing a task

If your work changed behavior, structure, env vars, auth, APIs, or conventions:

1. **Update `PROJECT_CONTEXT.md`** — revise affected sections; keep accurate for the next agent.
2. **Update `.clinerules`** — add or fix rules.
3. Bump the **“Last updated”** line at the bottom with a one-line changelog.

Skip doc updates only for trivial fixes (typos, formatting) with no behavioral impact.

---

## 1. Product summary

| Item | Detail |
|------|--------|
| Name | **TrueRoute** — “The Honest Travel Companion” |
| Positioning | **Real working travel service** for tourists in Nepal — every main card/button should open a live tool |
| Audience | International tourists (Kathmandu, Pokhara, Chitwan, Lumbini, etc.) |
| **Home `/`** | **Service hub** — `components/home/ServiceHub.tsx` — 8 clickable services → app routes (not a long marketing scroll) |
| Tourist app | `/map`, `/prices`, `/chat`, `/translate`, `/emergency`, `/places`, `/business`, `/profile`, `/submit-price` |
| Business marketplace | `/business` (discovery), `/business/[slug]` (profile), `/business/register`, `/business/dashboard`, `/b/[qrCode]` (QR redirect) |
| Marketing (optional) | `/features`, `/about`, `/faq`, `/cities`, `/how-it-works` — use `MarketingShell` + `components/landing/*` |
| Admin | `/admin` — founder-only CMS + **AI bulk import** at `/admin/import` |
| Auth (production) | Supabase — Google + email, **verified email** required for account features |
| Auth (local dev) | **Guest** + **local profile** (no Supabase) OR Supabase when keys in `.env` |
| Guest mode | Browse map, prices, chat, translate, emergency, places **without login** |

---

## 2. Tech stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19**, **TypeScript**, **Tailwind CSS v4** |
| Animations | **`motion`** package — import from `motion/react` (`motion.div`, etc.) |
| Local DB | **Prisma** + **SQLite** (`DATABASE_URL=file:./dev.db`) |
| Production DB | **Supabase PostgreSQL** (`supabase/schema.sql`) |
| Auth | **Supabase Auth** (`@supabase/ssr`) when configured |
| AI | **Google Gemini** (`GOOGLE_GEMINI_API_KEY`) → **Groq** fallback → offline pack |
| AI import | `lib/ai/import-parser.ts` + `lib/admin/apply-import.ts` |
| Maps | **Leaflet** + **Stadia** + **leaflet.offline**; `MapView.tsx`, `lib/services/mapService.ts`; `/api/map/*` |
| Offline | **IndexedDB** + **localStorage** + **Service Worker** (`public/sw.js`) |
| Validation | **Zod** (`lib/validations/`) |
| SEO | `app/sitemap.ts`, `app/robots.ts`, `components/seo/JsonLd.tsx`, metadata in `app/layout.tsx` |
| Deploy | **Vercel** (recommended) |

**Design tokens** (`app/globals.css`): `--bg` `#060A14`, `--gold` `#D4A017`, `--teal` `#0F9D8D`.

---

## 3. Repository layout

```
trueroute/
├── app/
│   ├── page.tsx                 # Service hub home (ServiceHub)
│   ├── sitemap.ts, robots.ts
│   ├── layout.tsx               # Root metadata + AppProviders
│   ├── (app)/                   # Tourist app → AppChrome
│   ├── (auth)/login, signup     # AuthForm
│   ├── admin/login + (panel)/   # CRUD + import/
│   ├── auth/callback, admin-callback, verify-pending, signout
│   └── api/                     # See §5
├── components/
│   ├── home/ServiceHub.tsx       # Primary homepage — service cards
│   ├── landing/                 # Marketing sections (also on /features etc.)
│   ├── app/                     # AppChrome, MapView, map/*, GPS, tips
│   ├── admin/                   # AdminSidebar, AdminCrud
│   ├── auth/                    # AuthProvider, AuthForm
│   ├── seo/JsonLd.tsx
│   ├── pwa/, providers/, shared/
├── lib/
│   ├── supabase/                # client, server, admin, middleware, config
│   ├── auth/                    # founder, email-validation, admin-session, admin-edge, promote-admin
│   ├── admin/apply-import.ts    # Writes parsed CSV/AI data to Prisma
│   ├── ai/gemini.ts, import-parser.ts
│   ├── offline/, data/travel-pack.ts, validations/, geo.ts, activity/
├── hooks/                       # useAuth, useOfflineBundle, useGPSTracking, useSessionId
├── prisma/                      # schema.prisma, seed.ts
├── supabase/                    # schema.sql, auth-trigger.sql
├── public/                      # sw.js, manifest, offline.html
├── middleware.ts                # Admin guard, verified-email guard, Supabase session refresh
├── scripts/test-demo.mjs
├── PROJECT_CONTEXT.md, .clinerules, SETUP.md, .env.example
```

---

## 4. Data architecture (dual source)

Content reads from **Supabase when configured**, else **Prisma/SQLite**.

| Concern | Prisma (local) | Supabase (production) |
|---------|----------------|------------------------|
| Cities, places, prices | ✅ `npm run db:seed` | ✅ `schema.sql` |
| Admin CRUD | ✅ `/api/admin/[model]` | Same API; cloud optional |
| Admin AI import | ✅ writes Prisma | Extend later if needed |
| Tourist auth | Local profile + guest | `auth.users` + `public.users` |
| Chat / GPS / translate logs | API works; logs if Supabase set | ✅ |
| Offline bundle | `lib/data/travel-pack.ts` | Same when Supabase configured |

### Prisma `Price` model fields (important)

Use **`touristPriceMin`**, **`touristPriceMax`**, **`fairPriceMin`**, **`fairPriceMax`**, **`localTip`** — not `touristPrice` / `fairPrice` / `tip`.

---

## 5. API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/offline-bundle` | GET | Full travel pack for IndexedDB |
| `/api/prices`, `/api/places`, `/api/cities`, `/api/faq` | GET | Public content |
| `/api/content` | GET | Emergency, phrases, photos, settings |
| `/api/chat` | POST | Gemini → Groq → offline (`messages[]`) |
| `/api/ai/chat` | POST | Forwards to `/api/chat` |
| `/api/weather` | GET | OpenWeatherMap |
| `/api/gps/check-danger`, `/api/gps/track` | POST | Danger zones + tracking |
| `/api/translate`, `/api/translate/log` | POST | Translation + logging |
| `/api/feedback`, `/api/waitlist` | POST | Submissions |
| `/api/prices/submit` | POST | Tourist price submission |
| `/api/activity` | POST | Activity log |
| `/api/auth/sync-profile` | POST | Upsert `public.users` (verified only) |
| `/api/admin/login` | POST/DELETE | Founder login (Supabase or local cookie) |
| `/api/admin/import` | POST | **CSV/TXT upload → AI parse → Prisma** |
| `/api/admin/[model]` | CRUD | Admin content (protected) |
| `/api/admin/stats` | GET | Dashboard stats |
| `/api/map/autocomplete` | GET | Map search suggestions |
| `/api/map/search` | GET | Map geocode search |
| `/api/map/directions` | POST | Map routing (Stadia) |
| `/api/map/nearby` | GET | Nearby POI |
| `/api/businesses` | GET | List/search approved businesses |
| `/api/businesses/nearby` | GET | Geo search (`lat`, `lng`, `radius`) |
| `/api/businesses/register` | POST | Business registration (status PENDING) |
| `/api/businesses/[slug]` | GET | Public business profile |
| `/api/businesses/[slug]/reviews` | GET/POST | Reviews + trust score refresh |
| `/api/businesses/[slug]/reports` | POST | Scam/transparency reports |
| `/api/businesses/[slug]/inquiries` | POST | Booking/contact leads |
| `/api/businesses/[slug]/qa` | GET/POST | Customer Q&A |
| `/api/businesses/ai` | POST | AI marketing assist (Gemini) |
| `/api/business/dashboard` | GET | Owner dashboard (`?email=`) |
| `/api/business/upload` | POST | Media/document upload (Supabase Storage or local) |
| `/api/business/owner/[slug]/*` | CRUD | Owner profile, services, media, branches, blog, events, documents |
| `/api/businesses/[slug]/benchmark` | GET | Fair price vs city market |
| `/api/health/supabase` | GET | Supabase DNS/REST/storage health |
| `/api/admin/businesses/approve` | POST | Approve/reject/suspend |
| `/map/tourism` | page | MapLibre GL 3D tourism map + business layer |

**Chat body:**
```json
{ "messages": [{ "role": "user", "content": "..." }], "cityContext": "optional" }
```

**Admin import:** `multipart/form-data` with `file` and/or `text` field.

---

## 6. Authentication & authorization

### Tourist (`/login`, `/signup`)

| Mode | Behavior |
|------|----------|
| **No Supabase** | Guest OK; local email+name via `saveLocalProfile` after `validateTouristEmail()` |
| **With Supabase** | Google OAuth; email signup with **confirm email**; magic link optional |
| **Verified required** | `/profile`, `/submit-price` only when Supabase user has `email_confirmed_at` |
| **Guest** | Always allowed for core app routes |

Callbacks: `/auth/callback` → `/map` or `/auth/verify-pending` if unverified.

### Admin (`/admin`)

| Mode | Behavior |
|------|----------|
| **Supabase configured** | Founder email + verified + Google (`/auth/admin-callback`) or password via `/api/admin/login` |
| **Local dev (no Supabase)** | Founder email + `ADMIN_PASSWORD` → HMAC cookie `tr_admin_session` via `/api/admin/login` |
| **Middleware** | `isFounderAdminUser()` (Supabase) OR `verifyAdminTokenEdge()` (cookie) — see `lib/auth/admin-edge.ts` |

**Never use Node `crypto` in middleware** — use `admin-edge.ts` (Web Crypto).

### Env vars

```env
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="yadavraj1244@gmail.com"
ADMIN_PASSWORD="..."                    # Local admin + Supabase founder password
ADMIN_SECRET="..."                      # HMAC for local admin cookie

GOOGLE_GEMINI_API_KEY="..."             # Chat + admin import AI
GROQ_API_KEY=""                         # Chat fallback
OPENWEATHER_API_KEY=""

NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

NEXT_PUBLIC_STADIA_MAPS_API_KEY=""      # Stadia tiles (prod); localhost works without
STADIA_MAPS_API_KEY=""                  # Server geocoding/routing (optional if NEXT_PUBLIC set)
NEXT_PUBLIC_SITE_URL="https://your-domain.com"   # SEO canonical/sitemap
```

**Never commit real keys** — `.env` is gitignored. Use `.env.example` with placeholders only.

---

## 7. Admin AI import

**Page:** `/admin/import`  
**API:** `POST /api/admin/import`

1. Upload `.csv` / `.txt` or paste text.
2. `parseImportWithAI()` — Gemini if `GOOGLE_GEMINI_API_KEY` set, else CSV heuristic (`lib/ai/import-parser.ts`).
3. `applyImportPayload()` — upserts cities/places/prices/emergency/phrases into Prisma (`lib/admin/apply-import.ts`).

**CSV heuristic columns:** `serviceName`, `city`, `category`, `touristPrice`, `fairPrice`, `routeFrom`, `routeTo`, `tip`

Tourists see updates after refresh or re-download offline pack from Profile.

---

## 8. PWA & offline

| File | Role |
|------|------|
| `public/manifest.webmanifest` | Install metadata |
| `public/sw.js` | Cache — bump version on bundle changes |
| `lib/offline/db.ts` | IndexedDB |
| `hooks/useOfflineBundle.ts` | Download + hydrate pages |

**Works offline (after pack download):** prices, emergency, phrases, places, offline chat fallback. Map: cached tile packs (Kathmandu/Pokhara) + GPS; search/routes need network.

---

## 9. UI patterns

- **Home:** `ServiceHub` — animated service grid; every card links to a real route.
- **App:** `AppChrome` — bottom nav (mobile), sidebar (desktop), `TravelStatusBar`, `GpsDangerBanner`, `FirstVisitBanner`, `TouristQuickTips`.
- **Marketing:** `components/landing/*` — feature cards on `/features` must **link to app routes** (see `Features.tsx`).
- **Animations:** `import { motion } from "motion/react"` — never use `<motion>` as a fake HTML tag.
- **Responsive:** mobile-first; test sm/md/lg breakpoints.

---

## 10. SEO

- `app/layout.tsx` — `metadataBase`, OpenGraph, Twitter, keywords
- `app/sitemap.ts` — includes app routes + marketing pages
- `app/robots.ts` — disallows `/admin/`, `/api/admin/`
- `components/seo/JsonLd.tsx` on home — WebApplication schema
- Set `NEXT_PUBLIC_SITE_URL` in production

---

## 11. Common commands

```bash
cd trueroute
npm install
npx prisma migrate dev
npm run db:seed
npm run dev                    # http://localhost:3000 (or :3001 if busy)
npm run build
npm run test:demo              # TEST_BASE_URL=http://localhost:3001 if needed
```

**Local smoke test paths:** `/`, `/map`, `/prices`, `/chat`, `/login`, `/admin/login`, `/admin/import`

---

## 12. Conventions for contributors / AI

0. **Read first, update after** — [AI agent workflow](#ai-agent-workflow-required).
1. **Service over marketing** — prefer wiring real routes over adding landing copy.
2. **Minimize scope** — small diffs; match existing patterns.
3. **`motion/react` only** — not `<motion>` as HTML.
4. **No secrets in repo** — `.env` / `.env.local` only.
5. **Guest mode** — do not force login for `/map`, `/prices`, etc.
6. **Prisma Price fields** — use Min/Max + `localTip`.
7. **Admin middleware** — use `admin-edge.ts` in middleware, not `lib/auth/admin.ts` (Node crypto).
8. **Don’t commit** `.env`, `dev.db`.

---

## 13. Supabase setup (production)

1. Run `supabase/schema.sql` + `auth-trigger.sql`
2. Enable Google + Email; **Confirm email ON**
3. Redirect URLs: `/auth/callback`, `/auth/admin-callback`
4. Create founder user `ADMIN_EMAIL`
5. Copy keys to `.env.local`

See **SETUP.md**.

---

## 14. Map system (priority) — audit & role protection

**Status:** Map is the **#1 tourist tool**. Two map UIs exist:

| Route | Engine | Purpose |
|-------|--------|---------|
| `/map` | Leaflet + Stadia + `leaflet.offline` | Main map — places, businesses, search, directions, nearby, offline packs |
| `/map/tourism` | MapLibre GL 3D | Verified business discovery layer |

### 14.1 What each role can do on the map

| Role | Map access | Data shown | Protected actions |
|------|------------|------------|-------------------|
| **Guest / tourist (no login)** | Full `/map` — no auth required | Approved places (`approved=true`), approved+verified businesses | Cannot access `/admin/*` or owner APIs |
| **Logged-in tourist (customer)** | Same as guest + `/profile` offline pack | Same public markers; offline pack from Profile | `/profile`, `/submit-price` need verified email (Supabase) |
| **Business owner** | Public map shows their listing **only if** `status=APPROVED` + has `lat`/`lng` | Own dashboard via `/business/dashboard` | Owner APIs (`/api/business/owner/[slug]/*`) require matching `ownerEmail` → 403 otherwise |
| **Admin (founder)** | Full CMS affects map data | `/admin/places`, `/admin/prices`, `/admin/businesses`, `/admin/moderation` | Middleware: founder email + verified Supabase **or** `tr_admin_session` cookie (local dev) |
| **Superadmin / SUB_ADMIN (Prisma RBAC)** | Same public map as tourist | `lib/auth/rbac.ts` supports regional moderation | **Gap:** `/admin/*` middleware is **founder-only** today — SUB_ADMIN roles in Prisma are **not** wired to admin panel yet |

### 14.2 Map API protection (audited)

| Endpoint | Auth | Notes |
|----------|------|-------|
| `/api/map/autocomplete`, `/search`, `/directions`, `/nearby` | **Public** | Stadia geocoding/routing — no rate limit yet |
| `/api/places` | **Public** | Returns only `approved: true` places |
| `/api/businesses`, `/api/businesses/nearby` | **Public** | Returns only `status: APPROVED` businesses |
| `/api/business/owner/[slug]/*` | **Owner email** | `verifyBusinessOwnerBySlug()` → 403 if wrong owner |
| `/api/admin/*` | **Founder only** | 401 JSON or redirect to `/admin/login` |

### 14.3 Code audit findings (agent-checked)

| Check | Result |
|-------|--------|
| Guest can open `/map` without login | ✅ By design (`middleware.ts` does not block app routes) |
| Places on map filtered to approved | ✅ `getPlaces()` + `/api/places` use `approved: true` |
| Businesses on map filtered to approved | ✅ `listBusinesses()` uses `status: APPROVED`; map layer uses `verified=true` |
| Wrong business owner blocked | ✅ Owner routes return 403 |
| Admin APIs blocked for guests | ✅ Middleware returns 401/redirect |
| Tourism map `/map/tourism` builds | ✅ Fixed — page needs `"use client"` for `dynamic(..., { ssr: false })` |
| Turbopack wrong workspace root | ✅ Fixed — `turbopack.root` in `next.config.ts` |
| Offline tile cache TypeScript | ✅ Fixed — `MapOfflineManager` bounds cast |
| SUB_ADMIN regional admin on `/admin` | ❌ **Not implemented** — only founder email passes middleware |
| Map APIs rate-limited | ❌ **Not implemented** (reviews/reports are rate-limited; map APIs are not) |
| Runtime browser/GPS test | ⚠️ **You must verify** — dev server was not stable during agent session |

### 14.4 Manual test checklist (you should run these)

Start dev server from **`trueroute/`** folder:

```bash
cd trueroute
npm run dev
# optional automated audit:
node scripts/check-map-roles.mjs
```

#### As guest (incognito, no login)

1. Open `http://localhost:3000/map` — map tiles load, mode tabs work (Places / Search / Directions / Near me).
2. Allow GPS → blue dot appears; tap **My location**.
3. Tap a **gold place marker** → fair price popup → **Get directions**.
4. **Search** tab → type "Thamel" → pick suggestion or Go.
5. **Directions** → pick From/To from autocomplete → route line + distance.
6. **Near me** → Food / Hospital chips → markers appear.
7. Toggle **🏪 Businesses** layer → verified business markers + profile link.
8. Download **Kathmandu** offline pack (Wi‑Fi) → progress bar completes.
9. Open `http://localhost:3000/map/tourism` — MapLibre 3D map + business click cards.

#### As logged-in tourist (customer)

1. `/login` → sign in (or local profile in dev).
2. `/profile` → **Download for offline** → re-open `/map` offline (airplane mode) — cached tiles + pack places work; search/routes should fail gracefully.

#### As business owner

1. Seed owner: `owner@himalayanguesthouse.demo` (see `prisma/seed.ts`).
2. `/business/dashboard?email=owner@himalayanguesthouse.demo` — see listing.
3. On `/map` — **Himalayan Guest House** marker visible (approved + lat/lng).
4. API: `GET /api/business/owner/himalayan-guest-house-thamel?email=wrong@test.com` → **403**.
5. Same URL with correct owner email → **200**.

#### As admin (founder)

1. `/admin/login` → founder email + `ADMIN_PASSWORD` (local) or Google (Supabase).
2. `/admin/places` — edit a place lat/lng → refresh `/map` → marker moves.
3. `/admin/businesses` or `/admin/moderation` — approve pending business → appears on map layer.
4. Log out → `GET /api/admin/stats` → **401**; `/admin/places` → redirect to login.

#### As superadmin / SUB_ADMIN (known gap)

1. Prisma user with `role: SUB_ADMIN` + `AdminRegionAssignment` exists in schema.
2. **Expected today:** still **cannot** access `/admin` unless email is `ADMIN_EMAIL` founder.
3. Track as future work: wire `lib/auth/rbac.ts` into `middleware.ts` for regional admins.

---

## 15. Known limitations

- Marketing pages (`/features`, etc.) still exist but **home is the service hub** — don’t revert home to a 15-section landing without user request.
- Prisma `UserRole` enum ≠ Supabase `users.role` strings.
- **Map** (`/map`): offline tile packs for Kathmandu/Pokhara; search/routes need network. No Google Maps.
- **Build:** `@mapbox/polyline` types missing in `app/api/map/directions/route.ts` — may fail `npm run build`.
- Admin import writes **Prisma only** today (not auto-sync to Supabase tables).
- Workspace may have duplicate lockfiles at `H:\trueRoute` and `H:\trueRoute\trueroute` — run commands from **`trueroute/`**.

---

## 16. Related docs

| File | Contents |
|------|----------|
| **`TRUEROUTE_PROJECT_GUIDE.md`** | **Full onboarding guide (human + AI) — start here** |
| `SETUP.md` | Install, Supabase, PWA, API keys |
| `.env.example` | Env template (placeholders only) |
| `.clinerules` | AI rules — read before every task |
| `supabase/schema.sql` | Production schema |
| `supabase/auth-trigger.sql` | Auth → public.users sync |

---

*Last updated: Map priority audit — role protection matrix + manual test checklist in §14; fixes for `/map/tourism` client component, `turbopack.root`, `MapOfflineManager` TS; added `scripts/check-map-roles.mjs`.*
