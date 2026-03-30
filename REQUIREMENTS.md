Product Requirements Document (PRD) - CoupleFit

1. Product Overview

CoupleFit is an interactive fitness web application specifically designed for couples who train together but have different experience levels, physical goals, and health needs. The application synchronizes gym times and stations, allowing both users to perform their routines in parallel and efficiently.

2. User Profiles (Personas)

The application handles predefined profiles tailored to specific physiological needs:

User A (Michael): Advanced level. Focus on functional strength and conditioning for Brazilian Jiu-Jitsu (BJJ). Requires management of Central Nervous System (CNS) fatigue.

User B (Lina): Beginner level. Focus on hypertrophy and metabolic health. Requires strict time monitoring due to a tendency for hypoglycemia (blood sugar drops).

Couple Mode: A combined view that allows both users to see their respective exercises simultaneously at the same training station.

3. Functional Specifications

3.1. Welcome Screen (Onboarding)

Requirement: The system must present an initial screen to select the training session profile.

Options: "Michael" (Individual), "Lina" (Individual), or "Couple" (Synchronized).

Action: Upon selecting an option, the application state must transition to the control panel (Dashboard).

3.2. Control Panel (Dashboard)

The main panel must contain tabbed navigation (Tabs):

Tab 1: Daily Plan (Routine)

Training day selector: Day A (Squat), Day B (Hinge), Day C (Full Body), Day D (Zone 2 Cardio).

Training sequence preview: Chronological list of blocks to be executed, showing the category and shared equipment.

Call to Action (CTA) button: "START SESSION NOW".

Tab 2: Science & Tips

Display of informational cards with scientific backing and clinical recommendations (e.g., Autoregulation, Peri-workout Nutrition, Progressive Overload).

3.3. Immersive Training Mode (Training Mode)

Carousel Navigation: The interface must show one exercise at a time to avoid distractions. It must include controls for "Next", "Previous", and "Mark as Completed".

Split-Screen: If "Couple" mode is active, the exercise card must be divided vertically or horizontally to show:

Name and description of the specific exercise for each profile.

Number of sets and repetitions.

Execution notes or "Tips".

External link to a tutorial video (YouTube).

Progress Bar: A visual indicator at the top showing the percentage of completed blocks.

Completion: A dedicated "End Session" button that appears only on the last exercise, allowing a return to the Dashboard and resetting the state.

3.4. Security and Monitoring Module (Timer and Alerts)

Timer: Upon starting the workout, a timer visible in the header must begin.

Hypoglycemia Alert (60-Minute Rule): * The system must monitor the timer.

If the time reaches or exceeds 3600 seconds (60 minutes), a visual alert must be triggered (Red banner / pulsing animation).

The message must specifically warn about consuming carbohydrates/glucose to prevent a blood sugar drop.

The banner must be manually dismissible.

4. Workout Data Structure

The plan must support a JSON structure that assigns:

Main category and Shared equipment (e.g., "Squat Pattern", "Free Weights Zone").

User-specific attributes: name, description, sets, reps, notes, videoUrl.

Distribution:

Day A: Squat / Push Focus

Day B: Hinge / Pull Focus

Day C: Full Body Mix / Correctives

Day D: Zone 2 Cardio / Active Recovery and Core

5. Non-Functional & Technical Requirements

Premium Design (Glassmorphism): Use of dark backgrounds (slate-950), translucent containers (backdrop-blur), subtle borders, and lighting effects (glows).

Color Code: * Cyan/Blue for elements related to User A (Michael).

Pink/Coral for elements related to User B (Lina).

Combined gradients for the couple modality.

Responsiveness: The application must adapt perfectly to mobile device screens (Smartphones) and tablets, given that its main use will be within gym facilities.

Micro-interactions: Visual feedback on hover, smooth component transitions, and animations when changing state (Onboarding -> Dashboard -> Training).

Progressive Web App (PWA) & Offline Use: The application must be deployed as a Progressive Web App (PWA) to ensure uninterrupted functionality in gym environments where internet connectivity might be poor or unavailable. It must support being saved directly to the device's home screen (e.g., via the "Add to Home Screen" feature in Safari on iOS) and implement service workers to cache necessary assets and workout data for offline execution.