# Master Blueprint: Premium Haptic-Responsive PWA Fitness Application

This document serves as the **Master Architectural Blueprint** and **Agentic Kick-start Guide** for building, replicating, and extending high-fidelity, high-performance Progressive Web Applications (PWAs) that follow Apple's Human Interface Guidelines (HIG) and premium Human Interface Design (HID) principles.

---

## 1. Core Architecture & Vision

The application is structured as a **zero-dependency-heavy**, single-page progressive web application built on **React**, **Vite**, and **Tailwind CSS**. It is designed to look, feel, and react like a premium, native iOS app, featuring:
* **True Desktop Mockup Containment**: Seamlessly floats inside a beautiful glassmorphic container on large screens but fills 100% of the viewport on mobile devices.
* **Ergonomic Split-Layouts**: Automatically expands into smart multi-column panels on tablets and computers to avoid wasting screen real estate.
* **Tactile Haptic Feedback**: Leverages system-level haptics for interactive elements to mimic physical controller presses.
* **Dynamic Physiological Autoregulation**: Sports science-backed math engines that adjust target loads in real-time based on CNS and recovery levels.
* **Zero-Dependency Lightweight i18n**: Fully localized (ES, EN, DE) with a custom React Context engine that saves bundle size.

---

## 2. PWA & Service Worker Configuration

To enable fully offline operation in gym settings with poor cellular coverage, the build pipeline integrates **Vite PWA Plugin**.

### `vite.config.js` Blueprint
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'CoupleFit PWA',
        short_name: 'CoupleFit',
        description: 'Premium Dynamic Fitness & Autoregulation Training App',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
```

---

## 3. Viewport Containment & Responsive Strategies

To keep a premium look, the layout boundaries are carefully separated by breakpoints:
* **Widescreen Viewports (`md:` / `lg:`)**: Bounded inside a physical device mockup frame centered on screen.
* **Mobile Viewports**: Discharges the frame boundaries, utilizing safe-area pads for status and home indicators.

### The App Glassmorphic Mockup Container (`App.jsx`)
```jsx
export default function App() {
  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center font-sans antialiased text-white selection:bg-ios-blue/30 overflow-hidden">
      {/* Dynamic containment container: mobile takes full screen; tablet/desktop renders centered device mockup */}
      <div className="relative w-full h-full min-h-screen md:min-h-0 md:h-[88vh] md:max-w-4xl lg:max-w-5xl md:rounded-[36px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] md:border md:border-white/10 md:bg-[#1C1C1E] overflow-hidden flex flex-col transition-all duration-300">
        
        {/* All overlays use absolute positioning rather than fixed to remain enclosed within the device shell on widescreen viewports */}
        <Dashboard />
        
      </div>
    </div>
  );
}
```

### CSS Safe Area Layout Utility Classes
In iOS standalone web apps, it is critical to avoid overlaps with the system status bar and home indicator:
```css
/* index.css */
@supports (padding-top: env(safe-area-inset-top)) {
  .safe-area-pt {
    padding-top: env(safe-area-inset-top);
  }
  .safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

---

## 4. Lightweight i18n Localization Engine (0 Dependencies)

Using heavyweight localization libraries introduces latency and bloated bundle chunks. A customized Context-based engine handles localization with browser locale detection and fallback lookups.

### `LanguageContext.jsx`
```jsx
import React, { createContext, useState, useContext } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        try {
            const savedLanguage = localStorage.getItem('vitefit_language');
            if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en' || savedLanguage === 'de')) {
                return savedLanguage;
            }
            const browserLocale = navigator.language || navigator.userLanguage || '';
            const localeCode = browserLocale.substring(0, 2).toLowerCase();
            if (localeCode === 'de') return 'de';
            if (localeCode === 'en') return 'en';
            return 'es'; // default fallback is Spanish
        } catch (e) {
            return 'es';
        }
    });

    const changeLanguage = (locale) => {
        if (locale === 'es' || locale === 'en' || locale === 'de') {
            setLanguage(locale);
            try {
                localStorage.setItem('vitefit_language', locale);
            } catch (e) {
                console.warn(e);
            }
        }
    };

    const t = (key) => {
        try {
            const dictionary = translations[language] || translations['es'];
            const value = dictionary[key];
            if (value !== undefined) return value;
            
            // Fallback to Spanish dictionary
            const fallbackValue = translations['es'][key];
            if (fallbackValue !== undefined) return fallbackValue;
            return key; 
        } catch (e) {
            return key;
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
```

### Segmented Language Selector UI
Styled to emulate physical Apple hardware sliders:
```jsx
<div className="grid grid-cols-3 gap-2 bg-[#2C2C2E]/60 p-1 rounded-xl">
  {[
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' }
  ].map((lang) => (
    <button
      key={lang.code}
      onClick={() => { triggerHaptic(20); changeLanguage(lang.code); }}
      className={`py-2 rounded-lg text-xs font-bold transition-all ${
        language === lang.code
          ? 'bg-ios-blue text-white shadow-md'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {lang.name}
    </button>
  ))}
</div>
```

---

## 5. Sports Science Autoregulation & Math Suggestion Engine

To maximize training consistency, the app assesses daily physical status using **Three Recovery Inputs** and automatically recalibrates target intensities.

### Physiological Factors
1. **Sleep Quality**: Determines basic cellular resynthesis.
2. **CNS Fatigue (Central Nervous System)**: Assesses neurological fatigue (crucial for BJJ, sparring, and explosive strength).
3. **DOMS (Delayed Onset Muscle Soreness)**: Gauges local muscle tissue breakdown.

### Autoregulation Algorithm
```javascript
export function calculateAutoregulationFactor(wellness) {
  let factor = 1.0;
  
  if (!wellness) return factor;
  
  // 1. Sleep Quality Degradation
  if (wellness.sleep === 'normal') factor -= 0.05;
  if (wellness.sleep === 'poor') factor -= 0.15;
  
  // 2. CNS Fatigue Degradation
  if (wellness.cns === 'tired') factor -= 0.10;
  if (wellness.cns === 'exhausted') factor -= 0.20;
  
  // 3. DOMS Degradation
  if (wellness.soreness === 'sore') factor -= 0.05;
  if (wellness.soreness === 'very_sore') factor -= 0.10;
  
  // Impose safe recovery boundaries (maximum load degradation of 25%)
  return Math.max(0.75, factor);
}
```

### Smart Target Weight Projection
```javascript
export function getSmartSuggestion(previousLog, currentSetIndex, factor = 1.0) {
  if (!previousLog || !previousLog.sets) return null;
  
  const prevSet = previousLog.sets[currentSetIndex] || previousLog.sets[previousLog.sets.length - 1];
  
  // Apply linear progressive overload baseline + fatigue correction factor
  const baseWeight = prevSet.weight || 0;
  const targetWeight = baseWeight * factor;
  
  return {
    suggestedWeight: Math.round(targetWeight * 2) / 2, // Round to nearest 0.5kg
    suggestedReps: prevSet.reps || 10
  };
}
```

---

## 6. Video Integration & Dynamic Embeds

Vertical tutorials directly in the interface keep user retention high. Utilizing direct regex conversions converts YouTube watch links and mobile YouTube Shorts dynamically into lightweight, responsive iframe anchors.

```javascript
const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
        ? `https://www.youtube.com/embed/${match[2]}` 
        : null;
};
```

### The Responsive Video Container
Applying absolute aspect ratios guarantees perfect aspect scaling on both smartphones and vertical columns on iPads:
```jsx
<div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5 bg-[#1C1C1E]">
  {embedUrl ? (
    <iframe
      src={`${embedUrl}?modestbranding=1&rel=0&playsinline=1`}
      className="absolute inset-0 w-full h-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Exercise Tutorial Video"
    />
  ) : (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
      <span>No Video Tutorial Available</span>
    </div>
  )}
</div>
```

---

## 7. Premium Apple HID Guidelines & Vibration Feedback

A truly premium app must engage the **tactile senses**. Incorporating system-level hardware haptics changes user interaction from passive scrolling to satisfying tactile confirmations.

### Haptic Trigger Utility
```javascript
export const triggerHaptic = (duration = 30) => {
    try {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    } catch (e) {
        console.warn("Hardware haptics blocked by security sandbox or unsupported device.", e);
    }
};
```

### System Vibration Tactile Guide
* **Mild Tap / Selection Change**: `20ms`
* **Success/Record Achieved**: `[30ms, 50ms, 30ms]`
* **Warning/Danger Alert**: `[50ms, 100ms, 50ms]`

---

## 8. Safety & Exit Safeguards (Are You Sure Modal)

Mobile fitness trackers are prone to accidental screen taps, especially in sweaty settings. **Never let a session exit without confirmation**.

### Confirm Exit Dialog Block (`TrainingMode.jsx`)
```jsx
// Trigger state
const [showExitConfirm, setShowExitConfirm] = useState(false);

const handleExit = async () => {
    // Standard downward exit animation sequence
    await controls.start({ y: '100%', transition: { duration: 0.3, ease: 'easeIn' } });
    earlyExit();
};

return (
  <>
    {/* Cancel Button Header */}
    <button onClick={() => { triggerHaptic(20); setShowExitConfirm(true); }}>
      {t('cancel')}
    </button>
    
    {/* Glassmorphic Alert Box Overlay */}
    {showExitConfirm && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
        <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center space-y-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-[19px] font-extrabold text-white">
              {t('train_exit_confirm')}
            </h3>
            <p className="text-[14px] text-gray-400">
              {t('train_exit_warning')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => { triggerHaptic(20); setShowExitConfirm(false); }}
              className="py-3 px-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/15 active:scale-[0.98] transition-all text-[14px]"
            >
              {t('train_exit_continue')}
            </button>
            <button
              onClick={async () => {
                triggerHaptic(30);
                setShowExitConfirm(false);
                await handleExit();
              }}
              className="py-3 px-4 rounded-xl bg-ios-pink text-white font-bold hover:bg-ios-pink/90 active:scale-[0.98] transition-all shadow-lg shadow-ios-pink/20 text-[14px]"
            >
              {t('train_exit_yes')}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
```

---

## 9. Key Performance Optimization Checklist

1. **Lazy Load Heavy Components**: Lazy load deep analytical and graphing modules (`recharts`, stats modules) that are not needed during onboarding or warm-up.
2. **Minimize DOM Nodes**: Reuse table inputs dynamically rather than mounting heavy active lists simultaneously.
3. **Use CSS-driven hardware acceleration**: Add `will-change` on dynamic slide transitions (`EndSplash`, `TrainingMode`) to enforce GPU rendering.
4. **Debounce Input Logs**: Debounce set logging states saved to `localStorage` to avoid micro-lag spikes during active workout flows.
