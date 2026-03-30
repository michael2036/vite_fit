# CoupleFit

CoupleFit is a progressive web application (PWA) specifically designed for couples who train together but have different experience levels and goals. It synchronizes gym sessions to optimize time and shared equipment, delivering a native iOS-like experience.

## Features

- **Profile Selection & Onboarding**: Choose between Michael (Advanced/BJJ Focus), Lina (Beginner/Hypertrophy) or Couple Mode (Synchronized viewing).
- **iOS Native Design Aesthetics**: 
  - Glassmorphism & backdrop blurring.
  - Native iOS system fonts, spacing, and large titles.
  - Apple system color palettes matching standard iOS HIG (Human Interface Guidelines).
- **Synchronized Routine Viewer**: See both workouts in a sleek carousel, allowing independent reps/sets data while remaining at the same physical station.
- **Hypoglycemia Alert System**: Built-in 60-minute active timer that visually warns the user with an iOS-style Push Notification popup when it's time to consume fast-acting carbohydrates.
- **PWA Ready**: Can be installed to the iOS Home screen directly from Safari. Runs offline using `vite-plugin-pwa`.

## Setup & Development

### Prerequisites

- Node.js (v16 or higher)
- NPM or Pnpm

### Installation

1. Clone or navigate into the repository `vite_fit` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Preview production build:
   ```bash
   npm run preview
   ```

## Tech Stack
- **React 18** and **Vite** for optimized building and rapid module replacement.
- **Tailwind CSS** configured with strict iOS standard utility classes.
- **Lucide-React** for feather-light, clean SVG icons that resemble Apple SF Symbols.
- **vite-plugin-pwa** configured for standalone `apple-mobile-web-app-capable` directives.
