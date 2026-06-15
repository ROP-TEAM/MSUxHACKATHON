# MSU x Hackathon — Event & Ticket Dashboard

Event ticketing platform built for MSU x Hackathon. Real-time ticket simulation, AI-powered insights, and live order feed.

## Tech Stack

- **Next.js 16** (beta) — App Router, React Compiler
- **React 19**
- **TypeScript**
- **Redux Toolkit** — State management (simulation, user)
- **Mantine UI v9** — Component library
- **Google Gemini AI** — Chat + data analysis via `/api/ai/gemini`
- **Sass** — Styling (SCSS modules)
- **PWA** — Service worker + web manifest

## Pages

| Route | Description |
|-------|-------------|
| `/home` | Landing — hero carousel, event sections, live sections, news |
| `/events` | All events listing |
| `/events/[id]` | Event detail — poster, info, zone selection, live sold-out status |
| `/concert` | Concert-specific page |
| `/overviews` | Stage overview with seating map |
| `/mytickets` | User tickets list |
| `/mytickets/[ticketId]` | Individual ticket detail |
| `/api/ai/gemini` | Gemini AI chat + data analysis endpoint |

## Features

- **Live Simulation** — Real-time ticket buying simulation via Redux store, updates sold-out status live
- **Zone Selection** — Interactive zone/seat modal with ticket quantity picker
- **AI Panel** — Gemini-powered chat overlay for event data queries
- **Live Order Feed** — Real-time order stream component
- **User Switching** — Dev tool to switch between mock users
- **PWA Ready** — Service worker, manifest, apple-web-app meta
- **Responsive** — Thai-optimized font (Noto Sans Thai), mobile-first layout

## Setup

1. Copy environment file:

```bash
cp .env.example .env.local
```

2. Add your Gemini API key to `.env.local`:

```env
GEMINI_API_KEY=your_google_ai_studio_key_here
```

3. Install dependencies:

```bash
npm install
```

4. Start dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API key is used only server-side at `/api/ai/gemini`.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/ai/gemini/     # Gemini AI server route
│   ├── concert/           # Concert page
│   ├── events/            # Event listing + detail
│   ├── home/              # Landing page
│   ├── mytickets/         # User tickets
│   └── overviews/         # Stage overview
├── components/            # UI components
│   ├── AiPanel/           # Gemini chat panel
│   ├── eventDetail/       # Event detail sub-components
│   ├── home/              # Home page sections
│   ├── Navbar/            # Navigation
│   ├── realtime/          # Live order feed
│   ├── zoneModal/         # Zone/seat selection modal
│   └── ui/                # Shared UI primitives
├── lib/                   # Data & state
│   ├── ecommerce-data.ts  # Hackathon data pack loader
│   ├── event-adapter.ts   # Event data transform
│   ├── simulation-store.ts # Redux simulation store
│   └── user-store.ts      # Redux user store
└── styles/                # Global SCSS
```

## Scripts

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # ESLint
```
