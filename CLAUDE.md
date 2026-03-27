# CLAUDE.md

## Project Overview

Property Portfolio Analyser — a single-page React dashboard for modelling UK rental property financials. Single-user tool, no auth, deployed to Vercel.

## Commands

- `npm run dev` — start local dev server (Vite, port 5173)
- `npm run build` — production build to `dist/`
- `vercel dev` — local dev with Vercel KV env vars
- `vercel --prod` — manual deploy to production

## Architecture

- All financial logic lives in `src/utils/finance.js` as pure functions — no React, no side effects
- State is managed via a single hook `src/store/usePropertyStore.js` with debounced KV sync (800ms)
- KV persistence is optional — app falls back to localStorage if the API is unreachable
- API route at `api/properties.js` is a Vercel serverless function (GET/POST)
- Components are in `src/components/` split into `layout/`, `property/`, and `shared/`

## Conventions

- Tailwind CSS only — no CSS-in-JS libraries
- Custom colour tokens defined in `src/index.css` under `@theme` — use semantic names (`accent-green`, `bg-surface`, etc.)
- Recharts uses hardcoded hex values matching the theme tokens (not Tailwind classes)
- All monetary values formatted as GBP with `£` prefix via `src/utils/format.js`
- Sliders always paired with a numeric input, synced bidirectionally
- DM Sans for UI text, DM Mono for numbers/data values

## Key Files

- `src/store/defaults.js` — default property data (17 Glasgow Street, Northampton)
- `src/utils/finance.js` — calcMonthlyInterestOnly, calcSection24Tax, buildProjection, etc.
- `src/index.css` — theme colour tokens and custom slider/scrollbar styles
- `api/properties.js` — Vercel serverless KV read/write
