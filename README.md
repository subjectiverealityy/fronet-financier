# FroNet Financier App

PWA built with React + TypeScript + Vite + Tailwind CSS.

## Quick start

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=https://api.fronet.app
```

For local development against a local backend:

```env
VITE_API_URL=http://localhost:3000
```

## Build for production

```bash
npm run build
npm run preview  # preview the PWA locally
```

## Project structure

```
src/
├── components/
│   ├── ui/           # Shared UI primitives (Badge, Card, Chip, KpiCard, etc.)
│   ├── layout/       # LoginScreen
│   ├── dashboard/    # Dashboard shell, LocationDropdown, KPIStrip, tabs
│   ├── marketplace/  # Marketplace + OfferCard
│   └── kyc/          # KYC form screen
├── pages/            # Thin page wrappers (route targets)
├── store/            # Zustand stores (auth, dashboard)
├── lib/              # API fetch functions, utility helpers
├── types/            # All TypeScript types
└── index.css         # Tailwind directives + component classes
```

## API

All data fetching goes through `src/lib/api.ts`. Every function maps to a
BFF endpoint on your backend. Mock data lives directly in the components for
now — search for `MOCK_` comments to find and replace with real `useQuery` calls.

## Adding a real API call (example)

```tsx
// Before (mock)
const kpis = MOCK_KPIS

// After (real)
import { useQuery } from '@tanstack/react-query'
import { getKPIs } from '@/lib/api'

const { selectedView, selectedMonth, selectedYear } = useDashboardStore()
const { data: kpis, isLoading } = useQuery({
  queryKey: ['kpis', selectedView, selectedMonth, selectedYear],
  queryFn: () => getKPIs({
    locationId: selectedView === 'all' ? undefined : selectedView,
    month: selectedMonth,
    year: selectedYear,
  }),
})
```

## PWA

The app is configured as a PWA via `vite-plugin-pwa`. On build it generates:
- A service worker with offline caching
- A web manifest (`manifest.webmanifest`)
- Workbox runtime caching for API responses (24hr cache, network-first)

Add your app icons to `public/icons/` — you need `icon-192.png`,
`icon-512.png`, and `icon-512-maskable.png`.
