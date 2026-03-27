# Property Portfolio Analyser

A single-page React dashboard for modelling rental property financials, projections, and investment decisions. Built for a non-resident UK landlord.

## Features

- **Property Overview** — key metrics, equity, yield, status alerts
- **Configuration** — all inputs via synced sliders + number fields
- **Cost Breakdown** — full annual P&L with Section 24 tax walkthrough
- **Mortgage Model** — LTV trajectory, exit strategies, repayment vehicle calc
- **Rate Sensitivity** — cashflow impact across interest rates 3%–8%
- **20-Year Projection** — phase 1 (with mortgage) and phase 2 (cleared), charts + year-by-year table
- **Sell vs Hold** — side-by-side comparison with sensitivity analysis at different growth rates

## Tech Stack

- React 18, Vite, Tailwind CSS, Recharts
- Vercel KV (Redis) for cloud persistence — falls back to localStorage locally
- Vercel Serverless Functions for API routes

## Local Development

```bash
npm install
npm run dev
```

No KV credentials needed locally — the app uses localStorage as a fallback automatically.

## Vercel Deployment

```bash
vercel login
vercel link
vercel env pull       # pulls KV env vars into .env.local

# Create a KV store in Vercel dashboard:
# Storage > Create > KV > connect to project

vercel --prod         # or push to main for auto-deploy
```

## Environment Variables

Required only for deployed KV persistence (set via Vercel dashboard):

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
