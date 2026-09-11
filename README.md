# CoupleFit 🏋️‍♀️💙

> A Progressive Web Application (PWA) for couples syncing their gym routines, built on React + Vite. UI is fully localized (Spanish/English/German); everything else — code, comments, docs — is in English.

![CoupleFit](public/apple-touch-icon.png)

## Core Architecture

CoupleFit is a Vite + React SPA with no router and no global state library. `App.jsx` drives a small finite-state machine (`appState`: `login → dashboard → training → endsplash`) and every screen reads/writes its data through a single persistence layer instead of touching `localStorage` directly. See `ARCHITECTURE.md` for the full picture.

### Key modules

- `src/App.jsx` — screen orchestrator: `appState`, the active user/day, the background session timer, and the wellness/autoregulation check.
- `src/services/workoutStore.js` — the only place that reads or writes `localStorage`. Every screen goes through it.
- `src/data/workoutData.js` — the 3-day workout plan (`workoutPlan`) plus `seedMockDataForTestUser()`, which generates 12 weeks of realistic demo history.
- `src/utils/scoreCalculator.js` — the single scoring formula (completion + volume + pacing), used for both real sessions and the seeded demo data.
- `src/components/Dashboard.jsx` — tab shell; the tabs themselves live in `src/components/dashboard/` (`RoutineTab`, `AnalyticsTab`, `TipsTab`, `SettingsModal`).
- `src/components/charts/` — `LineChart`/`BarChart`, the two SVG chart primitives behind every graph on the Analytics tab.
- `src/components/TrainingMode.jsx` — the workout carousel shell; `src/components/training/` holds `ExercisePanel` (video + description), `SetLogger` (sets/reps table + autoregulation banner), and `ExitConfirmDialog`.
- `src/context/LanguageContext.jsx` — i18n provider backed by the flat dictionary in `src/data/translations.js`.
- `src/components/ErrorBoundary.jsx` — catches render errors app-wide so a bad state doesn't blank the screen.

## Accessibility (a11y)

Segmented controls use `role="tablist"`/`role="tab"`, icon-only paginators carry `aria-label`s, and radio-style day pickers use `role="radiogroup"`.

## Setup & Local Development

### Prerequisites
- Node.js v18+

### Installation

```bash
git clone https://github.com/michael2036/vite_fit.git
cd vite_fit
npm install
npm run dev
```

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` (root-relative paths) |
| `npm run build:gh-pages` | Production build with the `/vite_fit/` base path GitHub Pages needs |
| `npm run lint` | ESLint over `src/` |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run preview` | Serve the last build locally |

## Testing

Vitest covers the pieces most likely to regress silently: `calculateWorkoutScore`, the `workoutStore` persistence layer, the SVG chart math, category translation, and the YouTube URL parser. There's no component-rendering test harness yet — see `ARCHITECTURE.md` for what's intentionally out of scope.

## Deployment

CoupleFit is a static build with no server-side code, so it deploys the same way anywhere: `npm run build` (or `build:gh-pages`) produces a `dist/` folder that any static host can serve.

### GitHub Pages (primary)

`.github/workflows/deploy-gh-pages.yml` builds and deploys `dist/` on every push to `main` via the official `actions/deploy-pages` action. One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions** (this can't be done from a workflow file — it's a one-time manual toggle). After that, every push to `main` that passes lint + tests deploys automatically.

Because GitHub Pages project sites are served from `https://<user>.github.io/<repo>/` rather than the domain root, the workflow builds with `BASE_PATH=/<repo-name>/` so every asset URL, the PWA manifest's `start_url`/`scope`, and the service worker's precache list all resolve correctly under that subpath. Two other GitHub Pages quirks are handled in the build:

- **Jekyll processing** — GitHub Pages runs Jekyll on published sites by default, which can mishandle files/folders and would otherwise interfere with the build output. `public/.nojekyll` (copied into `dist/` by Vite) disables it.
- **No server-side routing** — CoupleFit has no client-side router (navigation is the in-memory `appState` machine), so there's no route to 404 on, but a refreshed or bookmarked URL still needs *something* to serve. A `postbuild` script (`scripts/copy-404.mjs`) copies `dist/index.html` to `dist/404.html` so any URL under the Pages site boots the app instead of GitHub's default 404 page.

To build the same artifact locally: `npm run build:gh-pages`.

### Cloudflare Pages (alternative)

The included `wrangler.toml` still works for Cloudflare Pages: `npm run build` (root-relative, no `BASE_PATH`) produces a `dist/` folder Cloudflare serves directly, with Cloudflare's Pages dashboard configured to run that build command and publish `dist`.

## PWA Capabilities

Uses `vite-plugin-pwa`. Served over HTTPS (GitHub Pages and Cloudflare Pages both provide this automatically), the manifest's `display: 'standalone'` lets it be added to a phone's home screen as a standalone app, and the generated service worker caches the app shell for offline use in gyms with poor connectivity.
