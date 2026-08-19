// ──────────────────────────────────────────────────────────────────────────────
// Nutrition Page
// ──────────────────────────────────────────────────────────────────────────────

import Page from '../components/layout/Page.jsx';
import Card from '../components/ui/Card.jsx';
import { CalorieCard } from '../components/dashboard/DashboardCards.jsx';
import MealTimeline from '../components/dashboard/MealTimeline.jsx';
import { ProgressBar } from '../components/ui/Progress.jsx';
import { useNutrition } from '../context/NutritionContext.jsx';
import { useUser } from '../context/UserContext.jsx';

export function Nutrition() {
  const { consumed, waterMl } = useNutrition();
  const { goals } = useUser();

  const macros = [
    { label: 'Protein', consumed: consumed.protein, goal: goals?.proteinG ?? 110, color: 'var(--accent)', unit: 'g' },
    { label: 'Carbohydrates', consumed: consumed.carbs, goal: goals?.carbsG ?? 228, color: 'var(--accent-3)', unit: 'g' },
    { label: 'Fat', consumed: consumed.fat, goal: goals?.fatG ?? 58, color: 'var(--warn)', unit: 'g' },
  ];

  return (
    <Page title="Nutrition" subtitle="Track your daily intake and macros">
      <div className="grid grid--dashboard" style={{ gap: '18px' }}>
        <Card className="col-6" title="Today's Calories">
          <CalorieCard />
        </Card>

        <Card className="col-6" title="Macro Breakdown">
          <div className="stack" style={{ gap: '1.25rem' }}>
            {macros.map((m) => (
              <ProgressBar
                key={m.label}
                value={Math.min(100, (m.consumed / m.goal) * 100)}
                label={m.label}
                sublabel={`${m.consumed} / ${m.goal}${m.unit}`}
                color={m.color}
              />
            ))}
          </div>
        </Card>

        <Card className="col-12" title="Meal Log">
          <MealTimeline />
        </Card>
      </div>
    </Page>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Scanner Page
// ──────────────────────────────────────────────────────────────────────────────

import FoodScanner from '../components/nutrition/FoodScanner.jsx';

export function Scanner() {
  return (
    <Page title="Food Scanner" subtitle="Upload a photo — AI estimates the nutrition automatically">
      <div className="grid grid--two" style={{ gap: '18px', alignItems: 'start' }}>
        <Card>
          <FoodScanner />
        </Card>
        <Card title="How it works">
          <div className="stack" style={{ gap: '1rem' }}>
            {[
              { step: '1', text: 'Upload a photo of your meal or packaged food.' },
              { step: '2', text: 'Our AI analyses the image and identifies the food.' },
              { step: '3', text: 'Review the estimated nutrition values.' },
              { step: '4', text: 'Tap "Add to Today" to log it instantly.' },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', color: 'var(--accent-2)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>{step}</div>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
          <div className="demo-flag" style={{ marginTop: '1.25rem' }}>Results are AI estimates — always verify with nutrition labels.</div>
        </Card>
      </div>
    </Page>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Water Page
// ──────────────────────────────────────────────────────────────────────────────

import WaterTracker from '../components/dashboard/WaterTracker.jsx';
import { useNutrition as useNutrition2 } from '../context/NutritionContext.jsx';
import { demoMetric } from '../utils/history.js';
import { lastNDays, dayLabel } from '../utils/dates.js';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Water() {
  const { waterMl } = useNutrition2();

  const weekData = lastNDays(7).map((key) => ({
    name: dayLabel(key),
    water: demoMetric(key, 'waterMl', 1200, 2800),
    isToday: key === new Date().toISOString().slice(0, 10),
  }));

  return (
    <Page title="Water Tracker" subtitle="Hit your daily hydration goal">
      <div className="grid grid--two" style={{ gap: '18px', alignItems: 'start' }}>
        <Card title="Today's Hydration">
          <WaterTracker />
        </Card>

        <Card title="7-Day History">
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} barSize={22}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: '0.82rem' }}
                  formatter={(v) => [`${(v / 1000).toFixed(1)}L`, 'Water']}
                />
                <Bar dataKey="water" radius={[6, 6, 0, 0]}>
                  {weekData.map((entry, i) => (
                    <Cell key={i} fill={entry.isToday ? 'var(--accent-3)' : 'var(--surface-3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-3)' }}>
            Average: {((weekData.reduce((s, d) => s + d.water, 0) / 7) / 1000).toFixed(1)}L/day
          </div>
        </Card>
      </div>
    </Page>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Workout Page
// ──────────────────────────────────────────────────────────────────────────────

import WorkoutTimer from '../components/workout/WorkoutTimer.jsx';
import { WORKOUTS } from '../data/workouts.js';
import { useState as useWoState } from 'react';

export function Workout() {
  const [selected, setSelected] = useWoState(WORKOUTS[0].id);

  return (
    <Page title="Workout" subtitle="Start a guided session and log your activity">
      <div className="grid grid--two" style={{ gap: '18px', alignItems: 'start' }}>
        {/* Workout selector */}
        <div className="stack" style={{ gap: '0.75rem' }}>
          {WORKOUTS.map((w) => (
            <button
              key={w.id}
              className={`card ${selected === w.id ? 'card--glow' : 'card--hover'}`}
              onClick={() => setSelected(w.id)}
              style={{ textAlign: 'left', cursor: 'pointer', border: selected === w.id ? '1px solid var(--accent-border)' : undefined }}
              aria-pressed={selected === w.id}
            >
              <div style={{ fontWeight: 700 }}>{w.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>{w.subtitle}</div>
            </button>
          ))}
        </div>

        {/* Timer */}
        <Card title={WORKOUTS.find((w) => w.id === selected)?.title}>
          <WorkoutTimer workoutId={selected} />
        </Card>
      </div>
    </Page>
  );
}
