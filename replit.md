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
    dashboard/page.tsx  # Dashboard with greeting, picked looks, category cards, build CTA
    dashboard/DashboardGreeting.tsx  # Client component: time-of-day greeting
    explore/page.tsx    # Explore looks with category tabs, filters, look grid (server)
    explore/[category]/page.tsx  # Redirects to /explore?category=X
    looks/[slug]/page.tsx  # Look detail: pieces, styling notes, related looks (server)
    build/page.tsx      # Placeholder
    profile/page.tsx    # Placeholder
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
  survey/
    SurveyShell.tsx     # Main survey orchestrator (step navigation, conditional logic, completion)
    SurveySidebar.tsx   # Left sidebar with progress bar, section dots, substep nav (260px, charcoal)
    StepMultiSelect.tsx # Option card grid for multi/single select steps
    StepPalette.tsx     # Color palette swatch picker (3-col grid)
    StepAvoid.tsx       # Avoid items grid + "I Trust My Stylist" toggle
    StepSizing.tsx      # Body type, height/weight, shirt/pants/shoe sizing
    StepBasics.tsx      # Age range chips + budget min/max inputs
    StepBrands.tsx      # Brand search input + suggestion chips
    StepSwipe.tsx       # Look rating cards with like/pass buttons
  app/
    LookCard.tsx        # Reusable look card with gradient bg, name, badges, hover overlay
    CategoryCard.tsx    # Category card with gradient, name, count, link to explore
    PieceCard.tsx       # Piece card with brand/name/price, metadata, add to bag
    AddToBagButton.tsx  # Client: add piece to bag via BagProvider, shows "In Bag" state
    ExploreFilters.tsx  # Client: vibe/occasion/season/sort filter dropdowns
    DashboardWelcome.tsx # Client: first-time welcome overlay
lib/
  supabase.ts           # Browser Supabase client
  supabase-server.ts    # Server-side Supabase client (server-only, uses next/headers)
  data.ts               # Server-only data fetching: getLooks, getLookBySlug, getCategoryCounts, getRelatedLooks
  types.ts              # Client-safe types and utilities: Look, Piece, gradients, filter options
  survey-data.ts        # Survey step definitions, palettes, avoid items, brand suggestions, types
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
