# Fitted — Men's Fashion Styling App

## Overview
Fitted is a men's fashion styling web application. Users complete an onboarding survey, receive AI-matched outfit recommendations, browse curated looks by category, and shop pieces through affiliate links.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Fitted colour tokens
- **Database + Auth**: Supabase (external — PostgreSQL, auth, auto-generated APIs)
- **Fonts**: Cormorant Garamond (display), DM Sans (body) via next/font/google

## Project Structure
```
app/
  layout.tsx            # Root layout with fonts and global styles
  page.tsx              # Home/landing page
  globals.css           # Tailwind + Fitted colour tokens as CSS variables
  onboarding/page.tsx   # Onboarding flow (outside app group — no nav)
  (app)/                # Route group for authenticated pages (shared nav shell)
    layout.tsx          # App shell: AppNav, MobileMenuDrawer, BagDrawer, Toast, BagProvider
    dashboard/page.tsx
    explore/page.tsx
    explore/[category]/page.tsx
    looks/[slug]/page.tsx
    build/page.tsx
    profile/page.tsx
components/
  AppNav.tsx            # Fixed top nav bar (glass effect, breadcrumbs, bag icon, profile dropdown)
  MobileMenuDrawer.tsx  # Slide-in mobile menu from left
  BagDrawer.tsx         # Slide-in shopping bag drawer from right
  Toast.tsx             # Toast notification with provider and useToast hook
  providers/
    BagProvider.tsx     # Bag state context (items, addItem, removeItem, clearBag)
  landing/
    LandingNav.tsx      # Landing page nav (scroll-aware glass effect, links, Get Started CTA)
    HeroSlideshow.tsx   # 4-slide auto-rotating hero (4.5s interval, gradient backgrounds)
    ScrollReveal.tsx    # Intersection Observer wrapper for scroll-triggered fade-in animations
lib/
  supabase.ts           # Browser Supabase client
  supabase-server.ts    # Server-side Supabase client
middleware.ts           # Supabase auth middleware (protects app routes in production)
```

## Design System Tokens (CSS Variables)
| Token          | Value    | Usage                          |
|----------------|----------|--------------------------------|
| --cream        | #F5F0E8  | Primary background             |
| --warm-white   | #FAF7F2  | Card and panel backgrounds     |
| --sand         | #E8DFD0  | Borders, dividers              |
| --stone        | #C4B89A  | Secondary borders, muted UI    |
| --bark         | #8B7355  | Accent colour, CTAs, highlights|
| --charcoal     | #2C2C2A  | Primary text, dark backgrounds |
| --muted        | #7A7268  | Secondary text, placeholders   |
| --deep         | #1A1A18  | Footer background              |

## Fonts
- **Display**: Cormorant Garamond — headings, look names, hero text
- **Body**: DM Sans — all UI text, buttons, labels

## Tailwind Utilities
- `font-display` → Cormorant Garamond
- `font-body` → DM Sans
- Colour classes: `text-charcoal`, `bg-cream`, `bg-warm-white`, `border-sand`, `text-bark`, `text-muted`, `bg-bark`, `border-stone`
- `--nav-h: 64px` CSS variable for nav bar height

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous/public key

## Running
- Dev server: `npx next dev -p 5000 -H 0.0.0.0`
- The workflow "Start application" runs the dev server on port 5000

## Config Notes
- `package.json` has `"type": "module"` — use `.mjs` for ESM configs, `.cjs` for CommonJS
- `next.config.mjs` (ESM), `postcss.config.cjs` (CommonJS)
- Auth middleware bypasses redirect in development (NODE_ENV !== "production")

## Database (Supabase)
Tables: `looks`, `pieces`, `look_pieces` (join), `user_profiles`, `saved_looks`
Schema defined in the build briefing — must be created via Supabase SQL Editor.
Seeded with 27 looks, 23 pieces, 52 look-piece relationships.

## Reference Documents
- `attached_assets/fitted-spec.docx` — Full product specification
- `attached_assets/fitted-prototype.html` — Interactive prototype (source of truth for visual design)
- `attached_assets/replit-brief.docx` — Build briefing with phased instructions
- `attached_assets/fitted-catalog.xlsx` — Product catalog data
