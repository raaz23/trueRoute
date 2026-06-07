# TrueRoute — Complete Project Guide

> **Audience:** Human developers, product owners, and **AI coding assistants** (Cursor, Cline, Copilot, etc.)  
> **Goal:** Understand the whole project in one document — what exists, how to use it, how to extend it, and what is still missing.  
> **Project root:** `trueroute/` (folder containing `package.json`)  
> **Last updated:** May 2026 — includes offline-first Leaflet map (Google Maps fully removed)

---

## How AI assistants should use this document

```
┌─────────────────────────────────────────────────────────────┐
│  BEFORE coding: Read this file + .clinerules + PROJECT_     │
│  CONTEXT.md (shorter technical reference).                  │
│  AFTER behavior changes: Update PROJECT_CONTEXT.md + this   │
│  file if user-facing flows or architecture changed.         │
└─────────────────────────────────────────────────────────────┘
```

| If your task involves… | Start here | Key files |
|------------------------|------------|-----------|
| Map / GPS / tiles | §7 Map system | `components/app/MapView.tsx`, `lib/services/mapService.ts` |
| Auth / login | §5 Authentication | `middleware.ts`, `components/auth/*`, `lib/auth/*` |
| Admin / CMS | §6 Admin panel | `app/admin/(panel)/*`, `components/admin/*` |
| Offline / PWA | §8 Offline & PWA | `lib/offline/*`, `hooks/useOfflineBundle.ts`, `public/sw.js` |
| AI chat | §9 AI guide | `app/api/chat/route.ts`, `lib/ai/gemini.ts` |
| Database | §4 Data architecture | `prisma/schema.prisma`, `supabase/schema.sql` |
| New API route | §10 API reference | `app/api/*` |
| Env / deploy | §11 Environment | `.env.example`, `SETUP.md` |

**Do not** hardcode API keys. **Do not** re-introduce Google Maps — maps are **Leaflet + Stadia + leaflet.offline** only.

---

## Table of contents

1. [What is TrueRoute?](#1-what-is-trueroute)
2. [Tech stack](#2-tech-stack)
3. [Project structure](#3-project-structure)
4. [Data architecture](#4-data-architecture)
5. [Authentication — tourist & admin](#5-authentication--tourist--admin)
6. [Admin panel](#6-admin-panel)
7. [Map system (recent build)](#7-map-system-recent-build)
8. [Offline mode & PWA](#8-offline-mode--pwa)
9. [AI travel guide](#9-ai-travel-guide)
10. [All tourist features (how to use)](#10-all-tourist-features-how-to-use)
11. [API reference](#11-api-reference)
12. [Environment variables](#12-environment-variables)
13. [Local setup & commands](#13-local-setup--commands)
14. [What we built recently (changelog)](#14-what-we-built-recently-changelog)
15. [Missing parts & known gaps](#15-missing-parts--known-gaps)
16. [Conventions for contributors & AI](#16-conventions-for-contributors--ai)
17. [Related documents](#17-related-documents)

---

## 1. What is TrueRoute?

**TrueRoute** is a **Nepal-first honest travel companion** — a working web app (PWA), not a marketing brochure.

| Item | Detail |
|------|--------|
| **Product name** | TrueRoute — “The Honest Travel Companion” |
| **Target users** | International tourists in Nepal (Kathmandu, Pokhara, Chitwan, Lumbini, trekking routes) |
| **Core promise** | Fair prices in NPR, honest place info, AI guide, translation, emergency tools, offline support |
| **Home page `/`** | Service hub — 8 cards that each open a **real tool** (`components/home/ServiceHub.tsx`) |
| **Guest mode** | Most tools work **without login** (map, prices, chat, translate, emergency, places) |
| **Founder** | Solo builder; admin is **founder-only** (`ADMIN_EMAIL` in env, default `yadavraj1244@gmail.com`) |

### Main routes (tourist app)

| Route | Tool |
|-------|------|
| `/` | Service hub (home) |
| `/map` | Live map (Stadia + Leaflet, offline tile packs) |
| `/prices` | Fair price database |
| `/chat` | AI travel guide |
| `/translate` | Phrase translator |
| `/emergency` | Emergency numbers + SOS |
| `/places` | Places list |
| `/places/[slug]` | Place detail |
| `/submit-price` | Submit a price (verified email if Supabase) |
| `/profile` | Account + **download offline pack** |
| `/login`, `/signup` | Tourist auth |

### Marketing pages (optional)

`/features`, `/about`, `/faq`, `/cities`, `/how-it-works` — use `MarketingShell` + `components/landing/*`. Home is **not** a long scroll landing anymore.

---

## 2. Tech stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19**, **TypeScript**, **Tailwind CSS v4** |
| Animations | **`motion`** — import from `motion/react` only |
| Local DB | **Prisma** + **SQLite** (`DATABASE_URL=file:./dev.db`) |
| Production DB | **Supabase PostgreSQL** (`supabase/schema.sql`) |
| Auth | **Supabase Auth** (`@supabase/ssr`) when configured |
| Maps | **react-leaflet** + **Stadia Maps** (Alidade Smooth Dark) + **leaflet.offline** |
| Map APIs | `/api/map/autocomplete`, `search`, `directions`, `nearby` → Stadia geocoding/routing |
| AI | **Google Gemini** → **Groq** fallback → offline pack answers |
| Offline | **IndexedDB** + **localStorage** + **Service Worker** (`public/sw.js`) |
| Validation | **Zod** |
| Deploy | **Vercel** (recommended) |

### Design system (`app/globals.css`)

| Token | Value | Usage |
|-------|-------|--------|
| `--bg` | `#060A14` | Page background (dark navy) |
| `--bg-card` | `#0C1528` | Cards, panels |
| `--gold` | `#D4A017` | Brand accent, map markers |
| `--teal` | `#0F9D8D` | Actions, routes, buttons |
| `--text` | `#EDE8DC` | Body text |

---

## 3. Project structure

```
trueroute/
├── app/
│   ├── page.tsx                    # Home = ServiceHub
│   ├── (app)/                      # Tourist app (AppChrome layout)
│   │   ├── map/page.tsx
│   │   ├── prices/, chat/, translate/, emergency/, places/, profile/, submit-price/
│   ├── (auth)/login, signup
│   ├── admin/login + (panel)/      # Founder CMS
│   ├── auth/callback, admin-callback, verify-pending, signout
│   └── api/                        # REST routes (see §11)
├── components/
│   ├── home/ServiceHub.tsx         # Homepage
│   ├── app/
│   │   ├── MapView.tsx             # ★ Main map (orchestrator)
│   │   └── map/                    # Map subcomponents
│   │       ├── PlaceMarker.tsx
│   │       ├── UserLocationMarker.tsx
│   │       ├── OfflineTileLayer.tsx
│   │       └── MapOfflineManager.tsx
│   ├── admin/                      # AdminSidebar, AdminCrud
│   ├── auth/                       # AuthProvider, AuthForm
│   ├── landing/                    # Marketing sections
│   ├── pwa/                        # Install, offline sync, SW register
│   └── shared/                     # EmergencyPanel, etc.
├── lib/
│   ├── services/mapService.ts      # ★ getPlaces() for map (Supabase → API fallback)
│   ├── supabase/                   # client, server, admin, middleware, config
│   ├── auth/                       # founder, admin-session, admin-edge
│   ├── admin/apply-import.ts       # CSV/AI import → Prisma
│   ├── ai/gemini.ts, import-parser.ts
│   ├── maps/stadia.ts, stadia-server.ts, coords.ts
│   ├── offline/                    # IndexedDB, sync, types
│   └── data/travel-pack.ts         # Offline bundle builder
├── hooks/
│   ├── useMapGeolocation.ts        # ★ Live GPS for map (pulsing dot)
│   ├── useAuth.ts, useOfflineBundle.ts, useGPSTracking.ts, useSessionId.ts
├── prisma/schema.prisma, seed.ts
├── supabase/schema.sql, auth-trigger.sql
├── public/sw.js, manifest.webmanifest, offline.html
├── middleware.ts
├── TRUEROUTE_PROJECT_GUIDE.md      # ★ This file
├── PROJECT_CONTEXT.md              # Shorter AI technical reference
├── SETUP.md                        # Install steps
└── .env.example                    # Env template (placeholders)
```

### Removed files (do not recreate)

| Removed | Reason |
|---------|--------|
| `components/app/GoogleMapView.tsx` | Google Maps removed |
| `components/app/StadiaMapView.tsx` | Merged into `MapView.tsx` |
| `components/app/LeafletMapView.tsx` | Replaced by `MapView.tsx` |
| `lib/maps/google-maps.ts` | Google Maps removed |

---

## 4. Data architecture

TrueRoute uses a **dual-source** pattern:

```
                    ┌─────────────────┐
                    │  isSupabase     │
                    │  configured?    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     ┌────────────────┐           ┌────────────────┐
     │ Supabase (RLS) │           │ Prisma/SQLite  │
     │ production     │           │ local dev      │
     └────────────────┘           └────────────────┘
```

| Content | Prisma (local) | Supabase (production) |
|---------|----------------|------------------------|
| Cities, places, prices | `npm run db:seed` | `supabase/schema.sql` |
| Map markers (`getPlaces`) | `/api/places` fallback | `places` table (RLS: `approved = true`) |
| Admin CRUD | `/api/admin/[model]` | Same API; writes Prisma today |
| Admin AI import | Writes **Prisma only** | Not auto-synced to Supabase yet |
| Tourist auth | Guest + local profile | Supabase `auth.users` + `public.users` |
| Chat / GPS logs | When Supabase configured | Supabase tables |
| Offline bundle | `lib/data/travel-pack.ts` | Merges Supabase when configured |

### Important Prisma field names (`Price` model)

Use these exact names in code and CSV import:

- `touristPriceMin`, `touristPriceMax`
- `fairPriceMin`, `fairPriceMax`
- `localTip`

**Not** `touristPrice`, `fairPrice`, or `tip` in Prisma writes.

### Supabase `places` table (map)

| Column | Maps to app field |
|--------|-------------------|
| `latitude`, `longitude` | `lat`, `lng` |
| `entry_fee_tourist`, `entry_fee_local` | `fairPriceNpr` (tourist fee preferred) |
| `category` | `category` |
| `approved` | Must be `true` for public SELECT (RLS) |

There is **no** `fair_price_npr` column in Supabase — the service layer derives it from entry fees.

---

## 5. Authentication — tourist & admin

### 5.1 Tourist login (`/login`, `/signup`)

#### Mode A — Local dev (no Supabase keys)

| Step | What happens |
|------|----------------|
| 1 | Open `/login` or `/signup` |
| 2 | Enter email + name (validated by `validateTouristEmail()`) |
| 3 | Profile saved in **localStorage** via `saveLocalProfile` |
| 4 | Full guest access to map, prices, chat, etc. |
| 5 | `/profile` and `/submit-price` work without cloud account |

**No Google OAuth** until Supabase keys are in `.env.local`.

#### Mode B — Production (Supabase configured)

| Step | What happens |
|------|----------------|
| 1 | Add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` |
| 2 | Run `supabase/schema.sql` + `auth-trigger.sql` in Supabase SQL Editor |
| 3 | Enable **Google** and **Email** providers in Supabase dashboard |
| 4 | Turn **ON** “Confirm email” for Email provider |
| 5 | Add redirect URL: `http://localhost:3000/auth/callback` (+ production URL) |
| 6 | User signs up → must verify email before `/profile` and `/submit-price` |
| 7 | Google OAuth → `/auth/callback` → redirects to `/map` or `/auth/verify-pending` |

**Guest browsing:** `/map`, `/prices`, `/chat`, `/translate`, `/emergency`, `/places` — **no login required**.

**Verified-only paths** (middleware): `/profile`, `/submit-price` — require `email_confirmed_at` when Supabase user exists.

### 5.2 Admin login (`/admin/login`)

**Only the founder email** (`ADMIN_EMAIL`, default `yadavraj1244@gmail.com`) can access admin.

#### Mode A — Local dev (no Supabase)

```
1. Go to http://localhost:3000/admin/login
2. Email: yadavraj1244@gmail.com (fixed)
3. Password: value of ADMIN_PASSWORD in .env (default in README: trueroute2025)
4. POST /api/admin/login → HMAC cookie tr_admin_session
5. Redirect to /admin dashboard
```

#### Mode B — Supabase production

**Option 1 — Google (recommended)**

```
1. /admin/login → "Sign in with Google (founder Gmail)"
2. OAuth → /auth/admin-callback
3. Middleware checks: founder email + email verified
4. Access /admin/*
```

**Option 2 — Password**

```
1. Create founder user in Supabase Auth (Authentication → Users)
2. Same email as ADMIN_EMAIL
3. /admin/login → email + password → POST /api/admin/login
```

**Error codes on login page:**

| `?error=` | Meaning |
|-----------|---------|
| `verify_email` | Gmail not verified in Supabase |
| `wrong_account` | Logged in but not founder email |
| `supabase_required` | Google clicked without Supabase keys |

### 5.3 Auth flow diagram

```mermaid
flowchart TD
    A[User visits app] --> B{Supabase configured?}
    B -->|No| C[Guest + local profile OK]
    B -->|Yes| D{Needs /profile or /submit-price?}
    D -->|No| E[Guest OK for map/prices/chat]
    D -->|Yes| F{Email verified?}
    F -->|No| G[/auth/verify-pending]
    F -->|Yes| H[Full account features]

    I[Admin /admin/*] --> J{Founder + authorized?}
    J -->|No| K[/admin/login]
    J -->|Yes| L[Admin CMS]
```

### 5.4 Key auth files

| File | Role |
|------|------|
| `middleware.ts` | Admin guard, verified-email guard, session refresh |
| `lib/auth/founder.ts` | `getFounderEmail()`, `isFounderEmail()`, `isEmailVerified()` |
| `lib/auth/admin-edge.ts` | Web Crypto cookie verify (middleware-safe) |
| `lib/auth/admin-session.ts` | Supabase user from request |
| `components/auth/AuthProvider.tsx` | Client auth context, Google sign-in |
| `app/auth/callback/route.ts` | Tourist OAuth callback |
| `app/auth/admin-callback/route.ts` | Admin OAuth callback |

---

## 6. Admin panel

**URL:** `/admin` (after login)

### 6.1 Admin sections

| Path | Purpose |
|------|---------|
| `/admin` | Dashboard stats |
| `/admin/cities` | Cities CRUD |
| `/admin/places` | Places CRUD |
| `/admin/prices` | Fair prices CRUD |
| `/admin/emergency` | Emergency numbers |
| `/admin/phrases` | Translation phrases |
| `/admin/faq` | FAQ entries |
| `/admin/testimonials` | Testimonials |
| `/admin/photos` | Gallery |
| `/admin/settings` | Site text settings |
| `/admin/submissions` | Tourist price submissions |
| `/admin/waitlist` | Waitlist signups |
| `/admin/feedback` | User feedback |
| `/admin/import` | **AI bulk import** (CSV/TXT) |

### 6.2 How to use AI import (`/admin/import`)

1. Log in as founder.
2. Upload `.csv` / `.txt` **or** paste text.
3. System calls `parseImportWithAI()`:
   - If `GOOGLE_GEMINI_API_KEY` set → Gemini parses free-form text.
   - Else → CSV column heuristic.
4. `applyImportPayload()` writes to **Prisma SQLite**.
5. Tourists see data after refresh or re-download offline pack.

**CSV columns (heuristic):** `serviceName`, `city`, `category`, `touristPrice`, `fairPrice`, `routeFrom`, `routeTo`, `tip`

### 6.3 Admin API protection

- All `/api/admin/*` routes require founder session (Supabase user or `tr_admin_session` cookie).
- **Never** use Node `crypto` in `middleware.ts` — use `lib/auth/admin-edge.ts`.

---

## 7. Map system (recent build)

### 7.1 Architecture (MVC)

| Layer | File | Responsibility |
|-------|------|----------------|
| **Model** | `lib/services/mapService.ts` | `getPlaces()`, region bounds for offline cache |
| **View** | `components/app/MapView.tsx` + `components/app/map/*` | UI, Leaflet map, markers, popups |
| **Controller** | `hooks/useMapGeolocation.ts` + mode state in `MapView` | GPS, search, directions, nearby |

### 7.2 Map engine

- **Library:** react-leaflet v5 + Leaflet 1.9
- **Tiles:** Stadia **Alidade Smooth Dark** (default)
- **Tile URL pattern:**  
  `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=KEY`
- **Offline tiles:** `leaflet.offline` → IndexedDB via `OfflineTileLayer.tsx`
- **No Google Maps** anywhere in the codebase

### 7.3 Map components

| Component | File | Purpose |
|-----------|------|---------|
| `MapView` | `components/app/MapView.tsx` | Main orchestrator: modes, loading, routes |
| `PlaceMarker` | `components/app/map/PlaceMarker.tsx` | Gold pin + popup (name, fair price, Get directions) |
| `UserLocationMarker` | `components/app/map/UserLocationMarker.tsx` | Pulsing blue GPS dot |
| `OfflineTileLayer` | `components/app/map/OfflineTileLayer.tsx` | Stadia tiles with offline cache support |
| `MapOfflineManager` | `components/app/map/MapOfflineManager.tsx` | Download Kathmandu / Pokhara tile packs |

### 7.4 How to use the map (end user)

1. Open **`/map`** from home or bottom nav.
2. Allow **location** when prompted (for GPS dot and “Near me”).
3. **Modes** (top tabs):
   - **Places** — TrueRoute markers from database; tap gold pin for fair price.
   - **Search** — Autocomplete via Stadia geocoding; tap Go.
   - **Directions** — Pick From/To, get route line + distance/time.
   - **Near me** — Food, hospital, ATM, etc. near GPS position.
4. **My location** — Re-center on GPS.
5. **Offline map packs** (while on Wi‑Fi):
   - Tap **Kathmandu** or **Pokhara** to pre-download tiles.
   - Progress bar shows download %.
   - After caching, map tiles work in that region without internet.
6. On a place marker popup → **Get directions** switches to Directions mode with destination filled.

### 7.5 How places load (`getPlaces()`)

```
1. If Supabase configured → query places WHERE approved = true (RLS)
2. Map latitude/longitude → lat/lng, entry fees → fairPriceNpr
3. If empty or no Supabase → GET /api/places (Prisma)
4. Render PlaceMarker for each result
```

### 7.6 Map API routes (server)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/map/autocomplete` | GET | Search suggestions (`?text=`) |
| `/api/map/search` | GET | Geocode search |
| `/api/map/directions` | POST | Route polyline + distance/duration |
| `/api/map/nearby` | GET | POI near lat/lon (`?category=`) |

Server uses `STADIA_MAPS_API_KEY` or `NEXT_PUBLIC_STADIA_MAPS_API_KEY` from `lib/maps/stadia-server.ts`.

### 7.7 Map env vars

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_STADIA_MAPS_API_KEY` | Production | Also accepts `NEXT_PUBLIC_STADIA_API_KEY` |
| `STADIA_MAPS_API_KEY` | Optional | Server-side geocoding/routing |
| `NEXT_PUBLIC_SUPABASE_*` | For live markers from cloud | Falls back to Prisma API |

**Localhost:** Stadia tiles work **without** a key (rate-limited).

### 7.8 Mobile UX

- Map container uses `touch-action: none` and `overscroll-behavior: contain` so scrolling the page does not fight map pan/zoom.
- Full viewport height: `min(100dvh - 12rem, 680px)` on mobile.

---

## 8. Offline mode & PWA

### 8.1 Install as app

1. Open site in Chrome (Android) or Safari (iOS).
2. Use **Install app** banner or **Add to Home Screen**.
3. App runs standalone via `public/manifest.webmanifest`.

### 8.2 Download offline travel pack

1. Go to **`/profile`**.
2. Tap **Download for offline**.
3. Pack stored in IndexedDB (`lib/offline/db.ts`).

### 8.3 What works offline (after download)

| Feature | Offline? | Notes |
|---------|----------|-------|
| Fair prices (`/prices`) | ✅ | Full search from pack |
| Emergency (`/emergency`) | ✅ | Numbers + SOS GPS text |
| Translate phrases | ✅ | Cached phrases |
| Places list/detail | ✅ | From pack |
| AI chat | ✅ | Smart answers from pack (no live Gemini) |
| Submit price | ✅ | Queued until online |
| Map — **cached tiles** | ✅ | Only if user downloaded Kathmandu/Pokhara pack |
| Map — search/routes | ❌ | Needs internet |
| Map — GPS dot | ✅ | Device GPS works offline |
| Map — TrueRoute markers | ✅ | From pack if downloaded; live from DB needs net |

### 8.4 Key offline files

| File | Role |
|------|------|
| `hooks/useOfflineBundle.ts` | Download + hydrate |
| `lib/data/travel-pack.ts` | Builds bundle from Prisma/Supabase |
| `lib/offline/sync.ts` | Queue sync when back online |
| `public/sw.js` | Service worker cache (bump version on changes) |
| `components/pwa/OfflineSyncManager.tsx` | Background sync |

---

## 9. AI travel guide

**Page:** `/chat`

### How it works

```
User message → POST /api/chat
    → Try Google Gemini (GOOGLE_GEMINI_API_KEY)
    → Else Groq (GROQ_API_KEY)
    → Else offline pack answers (lib/offline/chat-offline.ts)
```

**Request body:**
```json
{
  "messages": [{ "role": "user", "content": "How much is taxi to Boudha?" }],
  "cityContext": "Kathmandu"
}
```

Conversations logged to Supabase `chat_conversations` when configured.

---

## 10. All tourist features (how to use)

### 💰 Fair Prices (`/prices`)

- Browse verified prices by city/category.
- Compare **tourist price** vs **fair price** in NPR.
- Data from API → Prisma or Supabase.

### 🗺️ Live Map (`/map`)

See [§7 Map system](#7-map-system-recent-build).

### 💬 AI Guide (`/chat`)

- Ask about routes, scams, food, trekking.
- Works offline with cached knowledge after pack download.

### 🌐 Translate (`/translate`)

- Common Nepali/Hindi phrases for tourists.
- Offline after pack download.

### 🆘 Emergency (`/emergency`)

- One-tap call buttons (police, ambulance, tourist police).
- SOS shares GPS link (uses device location).

### 📍 Places (`/places`, `/places/[slug]`)

- Temples, lakes, trails with descriptions and fair price tips.
- Linked from map markers when slug available.

### ➕ Submit Price (`/submit-price`)

- Tourists report what they paid.
- Requires verified email when Supabase is on.
- Queued offline, synced later.

### 👤 Profile (`/profile`)

- Account info, sign out.
- **Download offline pack** — essential before trekking.

---

## 11. API reference

### Public content

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/offline-bundle` | GET | Full travel pack |
| `/api/prices` | GET | Prices list |
| `/api/places` | GET | Places list |
| `/api/cities` | GET | Cities |
| `/api/faq` | GET | FAQ |
| `/api/content` | GET | Emergency, phrases, photos, settings |
| `/api/testimonials` | GET | Testimonials |
| `/api/weather` | GET | OpenWeather (needs `OPENWEATHER_API_KEY`) |

### Tourist actions

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chat` | POST | AI chat |
| `/api/translate` | POST | Translation |
| `/api/translate/log` | POST | Log translation |
| `/api/prices/submit` | POST | Submit price |
| `/api/feedback` | POST | Feedback |
| `/api/waitlist` | POST | Waitlist |
| `/api/gps/check-danger` | POST | Danger zone check |
| `/api/gps/track` | POST | GPS tracking |
| `/api/activity` | POST | Activity log |
| `/api/auth/sync-profile` | POST | Sync user to `public.users` |

### Map

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/map/autocomplete` | GET | Autocomplete |
| `/api/map/search` | GET | Search |
| `/api/map/directions` | POST | Routing |
| `/api/map/nearby` | GET | Nearby POI |

### Admin (protected)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/login` | POST/DELETE | Founder login/logout |
| `/api/admin/import` | POST | AI/CSV import |
| `/api/admin/[model]` | CRUD | Content management |
| `/api/admin/stats` | GET | Dashboard |

---

## 12. Environment variables

Copy `.env.example` → `.env.local` and fill in values. **Never commit real keys.**

| Variable | Required for | Description |
|----------|--------------|-------------|
| `DATABASE_URL` | Local dev | `file:./dev.db` for SQLite |
| `ADMIN_EMAIL` | Admin | Founder Gmail |
| `ADMIN_PASSWORD` | Admin (local) | Password for `/admin/login` |
| `ADMIN_SECRET` | Admin (local) | HMAC secret for admin cookie |
| `NEXT_PUBLIC_SUPABASE_URL` | Production auth | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production auth | Anon key (RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server admin ops | Service role (server only) |
| `NEXT_PUBLIC_STADIA_MAPS_API_KEY` | Map (production) | Stadia tiles + alias `NEXT_PUBLIC_STADIA_API_KEY` |
| `STADIA_MAPS_API_KEY` | Map APIs | Server geocoding/routing |
| `GOOGLE_GEMINI_API_KEY` | AI chat + import | Gemini |
| `GROQ_API_KEY` | AI fallback | Groq |
| `OPENWEATHER_API_KEY` | Weather bar | OpenWeatherMap |
| `NEXT_PUBLIC_SITE_URL` | SEO | Canonical URL for sitemap |

**Current gap:** If only `.env` has admin keys (no Supabase/Stadia), map uses Prisma places and localhost Stadia tiles — still works for dev.

---

## 13. Local setup & commands

```bash
cd trueroute
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:seed` | Seed SQLite with Nepal sample data |
| `npm run db:studio` | Prisma Studio GUI |
| `npm run test:demo` | Smoke test script |

**Smoke-test URLs:** `/`, `/map`, `/prices`, `/chat`, `/login`, `/admin/login`, `/admin/import`

---

## 14. What we built recently (changelog)

### Map overhaul (Leaflet + Stadia + offline-first)

| Done | Detail |
|------|--------|
| ✅ | Removed all Google Maps code and dependencies |
| ✅ | Production `MapView.tsx` with Stadia Alidade Smooth Dark |
| ✅ | `lib/services/mapService.ts` — `getPlaces()` from Supabase (RLS) + Prisma fallback |
| ✅ | `PlaceMarker` — gold pin, fair price NPR, Get directions button |
| ✅ | `useMapGeolocation` — live pulsing blue GPS dot |
| ✅ | `MapOfflineManager` — pre-cache Kathmandu & Pokhara tiles via `leaflet.offline` |
| ✅ | `OfflineTileLayer` — IndexedDB tile storage |
| ✅ | Loading states for tiles and places |
| ✅ | Mobile scroll/touch fixes for map container |
| ✅ | Env alias `NEXT_PUBLIC_STADIA_API_KEY` supported |
| ✅ | Search, Directions, Near me modes preserved from prior StadiaMapView |

### Package added

- `leaflet.offline@3.x`

---

## 15. Missing parts & known gaps

Use this section when planning the **next sprint** or when another AI asks “what’s left?”.

### Critical / high priority

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| **Admin import → Supabase only writes Prisma** | Production Supabase data stale after import | Extend `apply-import.ts` to upsert Supabase when configured |
| **`npm run build` TypeScript error** | `@mapbox/polyline` missing types in `app/api/map/directions/route.ts` | Add `@types/mapbox__polyline` or `declare module` shim |
| **`.env` vs `.env.example`** | Active `.env` may lack Supabase/Stadia keys | Copy full template to `.env.local` for production-like dev |
| **Dual lockfiles** (`H:\trueRoute` + `trueroute`) | Next.js may infer wrong workspace root | Set `turbopack.root` in `next.config.ts` or remove parent lockfile |

### Map-specific gaps

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| No `fair_price_npr` DB column | Fair price derived from entry fees only | Add column or join `prices` table in `getPlaces()` |
| Offline packs limited to 2 regions | Other trekking areas uncached | Add regions (Chitwan, Lumbini, Annapurna) to `MAP_OFFLINE_REGIONS` |
| Search/directions need network | Expected, but UX could warn earlier | Offline banner already partial — extend messaging |
| Place popup has no link to `/places/[slug]` | Less depth from map | Add “View details” link in `PlaceMarker` popup |
| Map style picker removed | Only dark theme now | Re-add style selector if needed (see `STADIA_STYLES` in `lib/maps/stadia.ts`) |

### Auth & admin gaps

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| Single founder only | No team admins | Role-based admin in Supabase `users.role` |
| Prisma `UserRole` ≠ Supabase roles | Confusion in imports | Align enums or document mapping |
| Local profile not synced to cloud | Data lost on new device | Prompt Supabase signup on profile page |

### PWA / offline gaps

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| Service worker version manual | Stale caches | Automate bump in build script |
| No map vector tiles offline | Large PNG tile storage | Consider PMTiles or smaller zoom range |
| Submit-price / feedback queue UI | User doesn’t see pending sync | Show queue count on Profile |

### SEO / product gaps

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| `page_bkp.tsx` in repo | Dead code | Delete or archive |
| Marketing pages separate from hub | OK by design | Keep unless user wants merge |
| No automated E2E tests | Regressions | Playwright for `/map`, `/prices`, admin login |

### Security reminders

- Rotate any keys that were ever committed in `.env.example` (use placeholders only in repo).
- `SUPABASE_SERVICE_ROLE_KEY` must **never** be exposed to the client.
- RLS policies in `supabase/schema.sql` must stay enabled for `places`, `prices`, etc.

---

## 16. Conventions for contributors & AI

1. **Read first:** `TRUEROUTE_PROJECT_GUIDE.md` (this file) → `.clinerules` → `PROJECT_CONTEXT.md`.
2. **Service over marketing** — wire real routes, don’t add brochure-only sections.
3. **Minimize scope** — small focused diffs.
4. **Animations:** `import { motion } from "motion/react"` only.
5. **Guest mode** — don’t force login on `/map`, `/prices`, etc.
6. **Maps:** Leaflet + Stadia + leaflet.offline only — **no Google Maps**.
7. **Middleware:** use `lib/auth/admin-edge.ts`, not Node `crypto`.
8. **Prisma prices:** use `touristPriceMin`, `fairPriceMin`, `localTip`, etc.
9. **Update docs** after behavioral changes.

---

## 17. Related documents

| File | When to use |
|------|-------------|
| **TRUEROUTE_PROJECT_GUIDE.md** | Full onboarding (this file) — **start here** |
| **PROJECT_CONTEXT.md** | Compact technical reference for AI |
| **SETUP.md** | Step-by-step install (Supabase, Stadia, PWA) |
| **.clinerules** | Mandatory AI coding rules |
| **.env.example** | Environment template |
| **supabase/schema.sql** | Production PostgreSQL schema |
| **supabase/auth-trigger.sql** | Auth → `public.users` sync |
| **README.md** | Short quick start |

---

## Quick reference card (printable)

```
┌──────────────────────────────────────────────────────────┐
│ TRUEROUTE QUICK REFERENCE                                │
├──────────────────────────────────────────────────────────┤
│ Dev:     npm install → prisma migrate → db:seed → dev   │
│ Home:    /          (ServiceHub)                         │
│ Map:     /map       (Leaflet + Stadia + offline packs)   │
│ Admin:   /admin/login → founder email + password/Google  │
│ Offline: Profile → Download for offline                  │
│ Map data: lib/services/mapService.ts → getPlaces()       │
│ No Google Maps — removed permanently                     │
└──────────────────────────────────────────────────────────┘
```

---

*Document maintained for TrueRoute — update when features, auth, or map behavior changes.*
