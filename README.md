# 🌿 NutriFlow — AI-Powered Wellness Tracker

> Your Health. Your Data. Your Journey.

A premium, production-ready **frontend-only** React + Vite wellness platform with a complete localStorage backend seam, ready to wire to any REST API.

---

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview the production build
```

**Demo login** — click "Try Demo Account" on the login screen, or use:
- Email: `demo@nutriflow.app`
- Password: `demo1234`

---

## Project Structure

```
nutriflow/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/           Button, Card, Progress, Modal, Field, States
│   │   ├── layout/       AppLayout, Sidebar, Topbar, MobileNav, Page, Footer
│   │   ├── dashboard/    DashboardCards, WaterTracker, MealTimeline
│   │   ├── health/       HealthCards (BMI, ECG, BP, Sleep)
│   │   ├── nutrition/    FoodScanner
│   │   ├── workout/      WorkoutTimer
│   │   ├── ai/           AIChat
│   │   ├── AnimatedBackground.jsx
│   │   └── CelebrationOverlay.jsx
│   ├── context/          ToastContext → SettingsContext → AuthContext →
│   │                     UserContext → NutritionContext → HealthContext → GoalContext
│   ├── data/             demoData, foods, mealPlans, workouts, achievements
│   ├── hooks/            useCountUp, useMediaQuery
│   ├── pages/            Landing, Auth, Onboarding, Dashboard, Health,
│   │                     Analytics, NutritionPages, PlanPages, MiscPages
│   ├── routes/           AppRoutes.jsx
│   ├── services/         storage, apiClient, authService, dayService,
│   │                     scannerService, planService, aiService
│   ├── styles/           tokens → base → animations → layout → components → widgets → pages
│   ├── utils/            dates, calculations, format, motivation, history, confetti, sound
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## Key Components

| Component | What It Does |
|---|---|
| `AppLayout` | Full app shell — sidebar, topbar, mobile nav, AI chat fab, celebration overlay |
| `WellnessScore` | Animated SVG ring (0-100) with nutrition/hydration/activity/sleep breakdown |
| `CalorieCard` | Calorie ring + 3 animated macro progress bars |
| `WaterTracker` | SVG bottle with wave animation, +250ml/+500ml/custom input |
| `MealTimeline` | Sorted meal log with mark-eaten, delete, and AddMeal modal |
| `WorkoutTimer` | Timestamp-accurate exercise timer, pause/resume/reset, per-exercise rings |
| `FoodScanner` | Image upload → scan sweep animation → simulated AI result → log |
| `HealthCards` | BMI scale (neutral language), animated ECG, BP dual bars, sleep chart |
| `AIChat` | Floating FAB → slide panel, quick prompts, typing animation |
| `CelebrationOverlay` | Canvas confetti + WebAudio chime on goal completion |
| `Analytics` | Daily/Weekly/Monthly segmented charts across 6 metrics |

---

## Install & Run

Requirements: **Node.js 18+**

```bash
# Install
npm install

# Development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Backend API Connection Points

Every service file in `src/services/` has a documented REST seam. Replace the localStorage adapter with a real fetch call at each point.

| Service | Current (localStorage) | Replace With |
|---|---|---|
| `authService.login()` | Local account check | `POST /api/auth/login` |
| `authService.register()` | Write to accounts key | `POST /api/auth/register` |
| `dayService.loadDayLog()` | Read `nutriflow:daylog` | `GET /api/log/:date` |
| `dayService.saveDayLog()` | Write `nutriflow:daylog` | `PUT /api/log/:date` |
| `scannerService.analyzeFood()` | Filename-hash lookup | `POST /api/scanner/analyze` (FormData) |
| `planService.generatePlan()` | Local template engine | `POST /api/plans/generate` |
| `aiService.sendMessage()` | Pattern-matched canned replies | `POST /api/ai/chat` |
| `history.getDailySeries()` | `demoMetric()` seeded values | `GET /api/analytics/daily?metric&n` |
| `HealthCards` metrics | Hardcoded demo values | `GET /api/health/metrics` |

Full REST contract: see `src/services/apiClient.js`.

---

## Demo Features (All Functional)

- ✅ Demo login (`demo@nutriflow.app` / `demo1234`) with real registered-account support
- ✅ 6-step onboarding with personalised calorie + macro calculation
- ✅ Wellness score ring (weighted: nutrition 30%, hydration 25%, activity 25%, sleep 20%)
- ✅ Animated calorie + macro progress bars
- ✅ Animated water bottle (SVG clip-path wave) with custom ml input
- ✅ Meal timeline with add/check/delete and quick-select foods
- ✅ Food scanner: image upload → scan sweep → "Estimated nutrition" result → log
- ✅ Workout timer with pause/resume/reset and per-exercise progress rings
- ✅ BMI scale (neutral language: Below Average / Average Range / Above Average / High Range)
- ✅ ECG heart rate animation + blood pressure dual bars
- ✅ Sleep tracker with bar chart history
- ✅ 3 preset diet plans with "Log meal" button
- ✅ AI plan generator (7-day personalised)
- ✅ Goal tracker with inline editing
- ✅ 12-day streak with weekly calendar strip
- ✅ Deterministic daily motivation quote (5 progress bands × 5 quotes)
- ✅ 6 achievements with unlock detection
- ✅ Analytics: Daily/Weekly/Monthly charts (6 metrics)
- ✅ NutriAI chat with contextual responses and quick prompts
- ✅ Goal celebration: canvas confetti + WebAudio chime + spring modal
- ✅ Dark/Light/System theme toggle
- ✅ Metric/Imperial units toggle
- ✅ Sound on/off toggle (never autoplays)
- ✅ Reduced-motion toggle (system preference respected automatically)
- ✅ Contact form with validation
- ✅ Full data reset in Settings
- ✅ Responsive: desktop sidebar / mobile bottom nav
- ✅ Keyboard accessible, ARIA-labelled, focus-visible throughout

---

## Replacing Demo Data with Real APIs

1. **Auth**: In `src/services/authService.js`, replace `login()` and `register()` with `apiFetch('/api/auth/login', ...)` from `apiClient.js`.
2. **Day Log**: Replace `loadDayLog()`/`saveDayLog()` calls in `NutritionContext.jsx` with API calls. The same data shape is used.
3. **Scanner**: Replace `analyzeFood()` in `scannerService.js` with a FormData POST to your vision API endpoint.
4. **AI Chat**: Replace `sendMessage()` in `aiService.js` with a POST to your LLM endpoint. The context object passed to it already captures all live stats.
5. **Health Metrics**: Replace the hardcoded values in `HealthContext.jsx` with a `GET /api/health/metrics` call.
6. **History/Analytics**: Replace `demoMetric()` calls in `history.js` with real history data from your API.
7. **Auth headers**: Un-stub `authHeaders()` in `apiClient.js` and pass the token from `AuthContext.session.token`.

---

*NutriFlow © 2025 · All demo data is synthetic · No real health or medical advice*
