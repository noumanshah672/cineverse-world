# CineVerse World

A React + TypeScript + Vite responsive entertainment discovery website starter, with a dedicated Punjabi cinema category.

## Requirements
- Node.js 20+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Included
- Responsive cinematic design
- Local catalog for Punjabi films, international series and anime
- Search, language/genre filters, category tabs, Load More
- Watchlist saved in React state during the session
- Title detail modal and official-trailer discovery links
- Membership pricing cards using the configured PKR prices
- No API key required to run the local demo

## Important limitations
- This is a local discovery demo, not a complete global catalog.
- Poster URLs are optional and may need replacement with verified artwork; the interface includes fallbacks.
- Trailer search links are discovery links, not direct video streams. Verify official links before publishing.
- The pricing cards are display-only. No payment is accepted and no premium access is activated.
- A secure admin approval workflow, accounts, cross-device watchlists, automatic global release updates, and verified streaming availability require a backend and/or authorized data providers.
- Deploy the built `dist` folder to a compatible static host. Configure SPA fallback to `index.html` if needed.
