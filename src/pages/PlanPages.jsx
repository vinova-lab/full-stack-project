// ──────────────────────────────────────────────────────────────────────────────
// Diet Plans Page
// ──────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import Page from '../components/layout/Page.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { DIET_PLANS } from '../data/mealPlans.js';
import { useNutrition } from '../context/NutritionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const MEAL_EMOJI = { breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙' };

export function DietPlans() {
  const [selected, setSelected] = useState(DIET_PLANS[0].id);
  const { logMeal } = useNutrition();
  const { success } = useToast();

  const plan = DIET_PLANS.find((p) => p.id === selected);
  const day = plan?.days?.[0];

  function handleEat(meal) {
    logMeal({ ...meal, done: true });
    success(`${meal.name} added to today's log!`);
  }

  return (
    <Page title="Diet Plans" subtitle="Pre-built plans tailored to your dietary preference">
      <div className="grid grid--two" style={{ gap: '18px', alignItems: 'start' }}>
        {/* Plan selector */}
        <div className="stack" style={{ gap: '0.75rem' }}>
          {DIET_PLANS.map((p) => (
            <button
              key={p.id}
              className={`card ${selected === p.id ? 'card--glow' : 'card--hover'}`}
              onClick={() => setSelected(p.id)}
              style={{ textAlign: 'left', cursor: 'pointer', border: selected === p.id ? '1px solid var(--accent-border)' : undefined }}
              aria-pressed={selected === p.id}
            >
              <div className="row-between">
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <span className={`chip chip--${p.tagColor}`}>{p.tag}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.3rem' }}>{p.description}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-2)', marginTop: '0.5rem' }}>{p.calories} kcal/day · {p.diet}</div>
            </button>
          ))}
        </div>

        {/* Day view */}
        <div className="stack" style={{ gap: '1rem' }}>
          {day && (
            <>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Sample Day — {day.day}</div>
              {day.meals.map((meal, i) => (
                <div key={i} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.8rem', flexShrink: 0 }} aria-hidden="true">{MEAL_EMOJI[meal.type]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{meal.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{meal.time} · {meal.kcal} kcal · P:{meal.p}g · C:{meal.c}g · F:{meal.f}g</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleEat(meal)}>+ Log</Button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Page>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Plan Builder Page
// ──────────────────────────────────────────────────────────────────────────────
import { generatePlan } from '../services/planService.js';
import { useUser } from '../context/UserContext.jsx';
import { Select } from '../components/ui/Field.jsx';

export function PlanBuilder() {
  const { profile } = useUser();
  const { logMeal } = useNutrition();
  const { success } = useToast();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [diet, setDiet] = useState(profile?.dietPreference ?? 'balanced');
  const [goal, setGoal] = useState(profile?.goal ?? 'maintain');

  async function handleGenerate() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // UX delay
    const generated = generatePlan({ ...profile, dietPreference: diet, goal });
    setPlan(generated);
    setLoading(false);
  }

  function handleLogDay() {
    plan?.days?.[0]?.meals?.forEach((m) => logMeal({ ...m }));
    success('Day 1 meals added to your log!');
  }

  return (
    <Page title="Plan Builder" subtitle="Generate a personalised 7-day meal plan">
      <div className="grid grid--two" style={{ gap: '18px', alignItems: 'start' }}>
        <Card title="Your Preferences">
          <div className="stack" style={{ gap: '1rem' }}>
            <Select label="Dietary Style" id="pb-diet" value={diet} onChange={(e) => setDiet(e.target.value)}
              options={[
                { value: 'balanced', label: '🍽 Balanced' },
                { value: 'vegetarian', label: '🥗 Vegetarian' },
                { value: 'vegan', label: '🌱 Vegan' },
              ]} />
            <Select label="Goal" id="pb-goal" value={goal} onChange={(e) => setGoal(e.target.value)}
              options={[
                { value: 'lose', label: 'Lose Weight' },
                { value: 'maintain', label: 'Maintain Weight' },
                { value: 'gain', label: 'Gain Weight' },
                { value: 'build', label: 'Build Muscle' },
              ]} />
            <Button onClick={handleGenerate} loading={loading} block>
              ✨ Generate My Plan
            </Button>
          </div>
        </Card>

        {plan && (
          <Card title="Your 7-Day Plan" subtitle={`${plan.calorieTarget} kcal/day · ${diet}`}>
            <div className="stack" style={{ gap: '0.75rem' }}>
              {plan.days.slice(0, 3).map((day) => (
                <div key={day.day} style={{ padding: '0.75rem', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>{day.day}</div>
                  {day.meals.map((m, i) => (
                    <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-2)', padding: '0.2rem 0' }}>
                      {MEAL_EMOJI[m.type]} {m.name} · {m.kcal}kcal
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>+ {plan.days.length - 3} more days in your plan</div>
              <Button variant="outline" onClick={handleLogDay}>+ Log Day 1 to Today</Button>
            </div>
          </Card>
        )}
      </div>
    </Page>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Goals Page
// ──────────────────────────────────────────────────────────────────────────────
import { ProgressBar } from '../components/ui/Progress.jsx';
import { useGoal } from '../context/GoalContext.jsx';
import { Field } from '../components/ui/Field.jsx';
import { useUser as useUserGoals } from '../context/UserContext.jsx';

export function Goals() {
  const { progress, goals: goalVals } = useGoal();
  const { goals, saveGoals } = useUserGoals();
  const { success } = useToast();
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');

  function startEdit(key, current) {
    setEditing(key);
    setEditVal(String(current));
  }

  function saveEdit(key) {
    const num = parseFloat(editVal);
    if (!isNaN(num) && num > 0) {
      saveGoals({ [key]: num });
      success('Goal updated!');
    }
    setEditing(null);
  }

  const rows = [
    { key: 'calories', label: 'Daily Calories', unit: 'kcal', value: goals?.calories, pct: progress.calories },
    { key: 'proteinG', label: 'Protein', unit: 'g', value: goals?.proteinG, pct: progress.protein },
    { key: 'carbsG', label: 'Carbs', unit: 'g', value: goals?.carbsG, pct: progress.carbs },
    { key: 'fatG', label: 'Fat', unit: 'g', value: goals?.fatG, pct: progress.fat },
    { key: 'waterMl', label: 'Daily Water', unit: 'ml', value: goals?.waterMl, pct: progress.water },
    { key: 'workoutMin', label: 'Workout', unit: 'min', value: goals?.workoutMin, pct: progress.workout },
    { key: 'sleepMin', label: 'Sleep', unit: 'min', value: goals?.sleepMin, pct: progress.sleep },
  ];

  return (
    <Page title="Goals" subtitle="Set and track your daily wellness targets">
      <Card>
        <div className="stack" style={{ gap: '1.5rem' }}>
          {rows.map(({ key, label, unit, value, pct }) => (
            <div key={key} className="goal-card">
              <div className="row-between">
                <div style={{ fontWeight: 600 }}>{label}</div>
                <div className="row" style={{ gap: '0.5rem' }}>
                  {editing === key ? (
                    <>
                      <input type="number" value={editVal} onChange={(e) => setEditVal(e.target.value)}
                        style={{ width: 80, padding: '4px 8px', borderRadius: 'var(--r-sm)', border: '1px solid var(--accent-border)', background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: '0.85rem' }} autoFocus />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{unit}</span>
                      <button className="btn btn--primary btn--sm" onClick={() => saveEdit(key)}>Save</button>
                      <button className="btn btn--ghost btn--sm" onClick={() => setEditing(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{value} {unit}</span>
                      <button className="btn btn--ghost btn--sm" onClick={() => startEdit(key, value)}>Edit</button>
                    </>
                  )}
                </div>
              </div>
              <ProgressBar value={pct} sublabel={`${pct}%`} />
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Achievements Page
// ──────────────────────────────────────────────────────────────────────────────
import { ACHIEVEMENTS, RARITY_COLORS } from '../data/achievements.js';

export function Achievements() {
  const { unlockedIds, achievementStats } = useGoal();

  return (
    <Page title="Achievements" subtitle="Milestones earned through consistency">
      <div className="grid grid--cards" style={{ gap: '14px' }}>
        {ACHIEVEMENTS.map((a) => {
          const unlocked = unlockedIds.includes(a.id);
          return (
            <div key={a.id} className={`card ach-card ${unlocked ? 'unlocked' : 'locked'}`}>
              <div className="icon-tile" style={{ width: 58, height: 58, borderRadius: 18, fontSize: '1.8rem', background: unlocked ? 'var(--grad-brand)' : 'var(--surface-3)', border: unlocked ? 'none' : '1px solid var(--border)' }}>
                {a.emoji}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{a.title}</div>
                <div style={{ fontSize: '0.78rem', color: RARITY_COLORS[a.rarity], fontWeight: 600 }}>{a.rarity}</div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', margin: 0 }}>{a.description}</p>
              {unlocked
                ? <span className="chip" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-border)', color: 'var(--accent-2)' }}>✓ Unlocked</span>
                : <span className="chip">🔒 Locked</span>
              }
            </div>
          );
        })}
      </div>
    </Page>
  );
}
