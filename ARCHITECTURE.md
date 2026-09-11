# Architecture and Technical Specifications

This document outlines the software architecture, design decisions, and central technical components driving the **CoupleFit** application.

## 1. Core Stack
- **Framework**: React 18
- **Build Tool**: Vite (Lightning-fast HMR and optimized production bundles)
- **Styling**: Tailwind CSS (Utility-first framework)
- **Animations**: Framer Motion (Hardware-accelerated gesture and transition engine)
- **Icons**: Lucide React
- **Testing**: Vitest, for pure-logic modules (scoring, persistence, chart math, i18n helpers)
- **Deployment**: GitHub Pages (primary, via GitHub Actions) or Cloudflare Pages — both serve the same static `dist/` build; see README.md

## 2. State Management & Navigation Strategy

### Global Orchestration (`App.jsx`)
Instead of utilizing a heavy global state manager (e.g., Redux or Zustand) or a dedicated URL router (e.g., React Router), the application relies on an **orchestration pattern via a unified finite state machine** housed in `App.jsx`.

Navigation is managed completely through the `appState` variable string (`'login' | 'dashboard' | 'training' | 'endsplash'`).

### Framer Motion "Virtual Routing"
Transitions between screens are natively wrapped in `<AnimatePresence mode="wait">`. This allows the application to:
1. Defer the unmounting of a component until its exit animation completely finishes.
2. Emulate the exact screen-stack pushing and popping mechanisms natively seen in Swift/iOS development (e.g., sliding from the bottom, cross-fades).

### Persistence: one service, one storage shape
All of CoupleFit's data — workout history, active profile, selected day, language, dev flags — lives in `localStorage`, and every read or write to it goes through `src/services/workoutStore.js`. No component calls `localStorage.getItem`/`setItem` directly. This matters because:
- Storage key names live in one place (`src/constants/storageKeys.js`), so a typo'd key can't silently create a data-loss bug in one call site while working everywhere else.
- Workout logs are a single flat JSON array shared across all profiles (`michael` / `lina` / `test`), each session tagged with a `user` field. `workoutStore` exposes intent-revealing operations (`getLogsForUser`, `saveSession`, `updateSession`, `deleteSession`, `replaceLogsForUser`) instead of callers doing their own `JSON.parse`/`filter`/`stringify`.
- There is no server and no cross-device sync: clearing site data, switching browsers, or reinstalling the PWA loses this history. There's no schema-versioning system yet either — if the session shape changes, add a migration inside `workoutStore` rather than reinstating scattered parsing.

### Component decomposition
`Dashboard.jsx` and `TrainingMode.jsx` are thin shells that own only the state that's genuinely shared across their children (which tab is active, the exercise index, the session timer). Everything else is split out:
- `src/components/dashboard/{RoutineTab,AnalyticsTab,TipsTab,SettingsModal}.jsx` — one file per tab; `SettingsModal` owns its own session-editing state since nothing outside it needs that state.
- `src/components/charts/{LineChart,BarChart,chartMath}.js(x)` — the three Analytics charts share one scaling/path-building module (`chartMath.js`) instead of each reimplementing axis math.
- `src/components/training/{ExercisePanel,SetLogger,ExitConfirmDialog}.jsx` — the video/description panel, the sets/reps logging table, and the exit-confirmation dialog.
- `src/utils/{categories,exercises,haptics,youtube,exerciseOptionLabels}.js` — small pure helpers (category translation, time-vs-weight exercise detection, the `navigator.vibrate` wrapper, YouTube embed URL parsing, and the primary/alternative option label lookup) that used to be copy-pasted across components.

## 3. UI/UX Paradigm: Apple HIG Design System

The application was built from the ground up to be virtually indistinguishable from a native iOS app when installed to the Home Screen.

- **Safe Areas & The Dynamic Island**: The UI calculates exact paddings injecting CSS environment variables (`env(safe-area-inset-top)`) to ensure elements do not overlap with iOS notches or the Dynamic Island.
- **Glassmorphism**: Core utilization of backdrop filters (`backdrop-blur-xl`) alongside translucent background opacities (e.g., `bg-ios-bg/80`) to replicate Apple's deep UI layering.

## 4. Technical Workarounds & Optimizations

### Delta-Time Polling Strategy
Unlike standard web stopwatches that rely on `setInterval(..., 1000)` modifying a counter, the CoupleFit timer relies on **Delta Polling**:
```javascript
const diffSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
```
**Why?** Browsers aggressively throttle or completely freeze `setInterval` loops when the user minimizes the browser or locks their phone screen. By comparing against an absolute UNIX timestamp (`Date.now()`), the timer immediately recalculates the exact elapsed time the moment the screen wakes up, solving the classic PWA background-freeze flaw.

## 5. Deployment Topology

CoupleFit builds to a single static `dist/` folder with no server-side code, so it can be deployed to any static host. Two are set up:

### GitHub Pages (`.github/workflows/deploy-gh-pages.yml`)
On every push to `main`, GitHub Actions runs lint + tests, builds with `BASE_PATH=/<repo-name>/` (GitHub Pages project sites are served from `/<repo>/`, not the domain root), and publishes via `actions/deploy-pages`. This requires a one-time manual step: repo **Settings → Pages → Source → GitHub Actions**. See README.md for the GitHub Pages-specific quirks this handles (`.nojekyll`, the `404.html` fallback).

### Cloudflare Pages (`wrangler.toml`)
```toml
name = "vitefit"
compatibility_date = "2024-03-30"

[assets]
directory = "dist"
```
Cloudflare Pages serves from the domain root, so this path builds with `npm run build` (no `BASE_PATH` override) and points Cloudflare's build command at that output.

Because of `vite-plugin-pwa` integration, Service Workers automatically intercept network requests, cache the interface assets, and enable completely offline functionality inside the gym where connectivity drops — regardless of which host serves the static files.

## 6. Testing & Quality Gates

- **Vitest** (`npm test`) covers pure logic: `calculateWorkoutScore`, `workoutStore`'s persistence operations (against an in-memory `localStorage` stand-in), the SVG chart scaling math in `chartMath.js`, category translation fallback behavior, and the YouTube embed URL parser.
- **ESLint** (`npm run lint`, config in `.eslintrc.cjs`) runs `eslint:recommended` plus the React/React Hooks/React Refresh plugin sets.
- Neither a component-rendering test harness (e.g., React Testing Library) nor end-to-end tests exist yet. Given the app's size, the highest-value next addition would be smoke tests for the `App.jsx` state machine's screen transitions.
- The GitHub Pages workflow runs both gates before every deploy; a failing lint or test run blocks the build from publishing.
