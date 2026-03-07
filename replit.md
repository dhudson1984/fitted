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
app/              # Next.js App Router pages and layouts
  layout.tsx      # Root layout with fonts and global styles
  page.tsx        # Home/landing page
  globals.css     # Tailwind + Fitted colour tokens as CSS variables
lib/              # Utility libraries
  supabase.ts     # Browser Supabase client
  supabase-server.ts  # Server-side Supabase client
components/       # Shared React components
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

## Fonts
- **Display**: Cormorant Garamond — headings, look names, hero text
- **Body**: DM Sans — all UI text, buttons, labels

## Tailwind Utilities
- `font-display` → Cormorant Garamond
- `font-body` → DM Sans
- Colour classes: `text-charcoal`, `bg-cream`, `bg-warm-white`, `border-sand`, `text-bark`, `text-muted`, `bg-bark`, `border-stone`

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous/public key

## Running
- Dev server: `npx next dev -p 5000 -H 0.0.0.0`
- The workflow "Start application" runs the dev server on port 5000

## Database (Supabase)
Tables: `looks`, `pieces`, `look_pieces` (join), `user_profiles`, `saved_looks`
Schema defined in the build briefing — must be created via Supabase SQL Editor.

## Reference Documents
- `attached_assets/fitted-spec.docx` — Full product specification
- `attached_assets/fitted-prototype.html` — Interactive prototype (source of truth for visual design)
- `attached_assets/replit-brief.docx` — Build briefing with phased instructions
- `attached_assets/fitted-catalog.xlsx` — Product catalog data
