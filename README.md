# CoupleFit 🏋️‍♀️💙

> A production-grade Progressive Web Application (PWA) designed natively for couples syncing their gym routines, built on modern React.

![CoupleFit](public/apple-touch-icon.png)

## Core Architecture

CoupleFit departs from monolithic designs by utilizing a strict component-based architecture inside a Vite + React PWA shell. 
The application achieves a pixel-perfect **iOS Native Interface (HIG)** using Tailwind CSS extensions featuring backdrop-blurs, safe-area-insets to avoid the Dynamic Island, system fonts, and exact Apple system colors.

### Key Components:
- `App.jsx`: Global application state orchestrator. Manages `activeProfile`, `selectedDay`, and the native 60-m background timer state avoiding stale transitions.
- `WorkoutData.js`: Centralized structural data dictionary storing decoupled user paths (Michael vs Lina).
- `Dashboard.jsx`: Segmented-control driven landing page utilizing semantic HTML (`<nav>`, `<section>`), 2x2 radio grid selections, and sticky-action layers.
- `TrainingMode.jsx`: Immersive full-screen workout carousel providing real-time independent rep tracking and embedded progression timers.
- `TimerAlert.jsx`: Absolute-positioned push notification logic bound dynamically to Apple's safe inset properties.

## Accessibility (a11y)
Fully compliant with ARIA tags. Segmented controls are classified as `role="tablist"`, visual SVGs assert `aria-hidden`, and icon-only paginators utilize descriptive `aria-label` attributes for screen readers.

## Setup & Local Development

### Prerequisites
- Node.js (v18 or higher)
- NPM or Pnpm

### Installation

1. Clone or navigate into the repository:
   ```bash
   git clone https://github.com/michael2036/vite_fit.git
   ```
2. Install dependencies (utilizing legacy peer resolution if strict plugin mismatches occur):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite hot-module-replacement server:
   ```bash
   npm run dev
   ```

## Cloudflare Pages Deployment

This project is explicitly configured to deploy flawlessly to **Cloudflare Pages** natively.

To override Cloudflare's unstable automatic full-stack Vite bindings, a pure static `wrangler.toml` file has been implemented:
```toml
name = "vitefit"
compatibility_date = "2024-03-30"

[assets]
directory = "dist"
```
Because of this topology, `git push` directly pushes the pre-built dist folder into Cloudflare's Edge network instantly serving the static assets without backend worker conflicts.

## PWA Capabilities
Uses `vite-plugin-pwa`. When served through HTTPS (like Cloudflare Pages), users traversing on Safari iOS can click `Add to Home Screen`. 
The application manifests with `display: 'standalone'` triggering an edge-to-edge application container indistinguishable from Native Swift iOS apps.
