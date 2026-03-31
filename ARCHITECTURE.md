# Architecture and Technical Specifications

This document outlines the software architecture, design decisions, and central technical components driving the **CoupleFit** application.

## 1. Core Stack
- **Framework**: React 18
- **Build Tool**: Vite (Lightning-fast HMR and optimized production bundles)
- **Styling**: Tailwind CSS (Utility-first framework)
- **Animations**: Framer Motion (Hardware-accelerated gesture and transition engine)
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages (Edge network delivery)

## 2. State Management & Navigation Strategy

### Global Orchestration (`App.jsx`)
Instead of utilizing a heavy global state manager (e.g., Redux or Zustand) or a dedicated URL router (e.g., React Router), the application relies on an **orchestration pattern via a unified finite state machine** housed in `App.jsx`. 

Navigation is managed completely through the `appState` variable string (`'onboarding' | 'dashboard' | 'training' | 'endsplash'`).

### Framer Motion "Virtual Routing"
Transitions between screens are natively wrapped in `<AnimatePresence mode="wait">`. This allows the application to:
1. Defer the unmounting of a component until its exit animation completely finishes.
2. Emulate the exact screen-stack pushing and popping mechanisms natively seen in Swift/iOS development (e.g., sliding from the bottom, cross-fades, and native swipe-to-dismiss).

## 3. UI/UX Paradigm: Apple HIG Design System

The application was built from the ground up to be virtually indistinguishable from a native iOS app when installed to the Home Screen.

- **Safe Areas & The Dynamic Island**: The UI calculates exact paddings injecting CSS environment variables (`env(safe-area-inset-top)`) to ensure elements do not overlap with iOS notches or the Dynamic Island.
- **Glassmorphism**: Core utilization of backdrop filters (`backdrop-blur-xl`) alongside translucent background opacities (e.g., `bg-ios-bg/80`) to replicate Apple's deep UI layering.
- **Gestures**: The `useDrag` hook from `@use-gesture/react` is implemented in the `TrainingMode` component to achieve true physics-based native "swipe-down" to dismiss mechanics, mapping pixel velocity and distance to the component's Y-axis via Framer Motion.

## 4. Technical Workarounds & Optimizations

### Delta-Time Polling Strategy
Unlike standard web stopwatches that rely on `setInterval(..., 1000)` modifying a counter, the CoupleFit timer relies on **Delta Polling**:
```javascript
const diffSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
```
**Why?** Browsers aggressively throttle or completely freeze `setInterval` loops when the user minimizes the browser or locks their phone screen. By comparing against an absolute UNIX timestamp (`Date.now()`), the timer immediately recalculates the exact elapsed time the moment the screen wakes up, solving the classic PWA background-freeze flaw.

### Background Web Notifications
The timer system connects natively to the browser's `Notification` API. Once the 60-minute (`3600s`) threshold is reached, it fires a system-level push notification combined with the `navigator.vibrate` hardware API (triggering specific haptic feedback patterns).

## 5. Deployment Topology (Cloudflare Edge)
The application leverages a `wrangler.toml` file mapping explicitly to the `/dist` directory. When pushed, Cloudflare Pages bypasses complex Node.js rendering and statically serves the highly optimized Vite SPA bundles globally.

Because of `vite-plugin-pwa` integration, Service Workers automatically intercept network requests, cache the interface assets, and enable completely offline functionality inside the gym where connectivity drops.
