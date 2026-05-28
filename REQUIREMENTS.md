# Product Requirements Document (PRD) - CoupleFit

## 1. Product Overview
CoupleFit is an interactive fitness web application specifically designed for couples who train together but have different experience levels, physical goals, and health needs. The application synchronizes gym times and stations, allowing both users to perform their routines in parallel and efficiently.

## 2. User Profiles (Personas)
The application handles predefined profiles tailored to specific physiological needs:

- **User A (Michael)**: Advanced level. Focus on functional strength and conditioning for Brazilian Jiu-Jitsu (BJJ). Requires management of Central Nervous System (CNS) fatigue.
- **User B (Lina)**: Beginner level. Focus on hypertrophy and metabolic health. Requires strict time monitoring due to a tendency for hypoglycemia (blood sugar drops).
- **Couple Mode**: A combined view that allows both users to perform the shared movement base simultaneously at the same training station with their individual progression weights and notes.

## 3. Functional Specifications

### 3.1. Welcome Screen (Onboarding)
- **Requirement**: The system must present an initial screen to select the training session profile.
- **Options**: "Michael" (Individual), "Lina" (Individual), or "Pareja" (Synchronized).
- **Action**: Upon selecting an option, the application state must transition to the control panel (Dashboard).

### 3.2. Control Panel (Dashboard)
The main panel must contain tabbed navigation (Tabs):

#### Tab 1: Daily Plan (Rutina)
- **Training day selector**: 3-day block with Spanish names based on Saturn's moons:
  - **Día 1: Titán** (Fuerza & Core)
  - **Día 2: Encélado** (Tensión Mecánica)
  - **Día 3: Mimas** (Bisagra & Poder)
- **Training sequence preview**: Chronological list of blocks to be executed, showing the category and shared equipment.
- **Call to Action (CTA) button**: "Iniciar Sesión Ahora" (Start Session Now).

#### Tab 2: Science & Tips (Consejos y Ciencia)
- Display of informational cards with scientific backing and clinical recommendations (e.g., Autoregulation, Hypoglycemia Monitoring, and the 6 Methods of Progressive Overload: Volume, Weight, ROM, Tempo, Density, and Technique).

### 3.3. Immersive Training Mode (Training Mode)
- **Carousel Navigation**: The interface must show one exercise at a time to avoid distractions. It must include controls for "Next", "Previous", and "Mark as Completed".
- **Split-Screen**: If "Pareja" mode is active, the exercise card must present:
  - **Unified Header**: The shared exercise name, description, shared equipment, and direct YouTube tutorial link.
  - **Customized Bottom Sections (Side-by-Side)**: Two distinct areas for Michael and Lina showing:
    - Target sets and repetitions.
    - Specific progression notes (e.g., tempo, safety tips).
    - Individualized weight/rep input tracker to record workout data dynamically.
- **Progress Bar**: A visual indicator at the top showing the percentage of completed blocks.
- **Completion**: A dedicated "Finalizar Sesión" (Finish Session) button that appears only on the last exercise. Upon pressing, the application transitions to a celebratory "Splash Screen" (`EndSplash`), providing visual feedback before automatically returning to the Dashboard and resetting the state.

### 3.4. Security and Monitoring Module (Timer and Alerts)
- **Timer**: Upon starting the workout, a timer visible in the header must begin.
- **Hypoglycemia Alert (60-Minute Rule)**:
  - The system must monitor the timer.
  - If the time reaches or exceeds 3600 seconds (60 minutes), a visual alert must be triggered (Red banner / pulsing animation).
  - The message ("Alerta CoupleFit") must specifically warn about consuming carbohydrates/glucose to prevent a blood sugar drop.
  - The banner must be manually dismissible.

## 4. Workout Data Structure
The plan must support a unified JSON structure that assigns:
- **Shared properties**: `name`, `description`, `sets`, `reps`, `sharedEquipment`, and `videoUrl` (plus `videoUrlAlternative` where applicable).
- **User-specific attributes**: `progressionNotes` containing custom guidelines for both `michael` and `lina`.

**Distribution**:
- **Día 1: Titán** (Fuerza & Core)
- **Día 2: Encélado** (Tensión Mecánica)
- **Día 3: Mimas** (Bisagra & Poder)

## 5. Non-Functional & Technical Requirements

- **Premium Design (Apple HIG / iOS Native Feel)**: Uses an iOS-native interface paradigm with `ios-bg` (dark backgrounds), translucent glass containers (`backdrop-blur`), safe-area insets to respect the Dynamic Island, system fonts, and exact Apple system colors.
- **UI Language**: The application's user interface is fully localized in **Spanish**. System notifications and UI elements respect this localization format while internal documentation is kept in English.
- **Color Code**:
  - `ios-blue` for elements related to User A (Michael).
  - `ios-pink` for elements related to User B (Lina).
  - Combined components for the couple modality.
- **Responsiveness**: The application must adapt perfectly to mobile device screens (Smartphones) and tablets, given that its main use will be within gym facilities.
- **Micro-interactions**: Visual feedback on active states (scale downs), smooth Framer-Motion component transitions, and animations when changing state. Native iOS swipe-to-dismiss gestures.
- **Progressive Web App (PWA) & Offline Use**: The application must be deployed as a Progressive Web App (PWA) to ensure uninterrupted functionality in gym environments where internet connectivity might be poor or unavailable. It must support being saved directly to the device's home screen with `display: 'standalone'` capabilities.