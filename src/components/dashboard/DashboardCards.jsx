import { useGoal } from '../../context/GoalContext.jsx';
import { useNutrition } from '../../context/NutritionContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { ProgressRing, ProgressBar } from '../ui/Progress.jsx';
import { useCountUp } from '../../hooks/useCountUp.js';
import { dailyQuote } from '../../utils/motivation.js';
import { todayKey } from '../../utils/dates.js';
import { lastNDays } from '../../utils/dates.js';
import { demoMetric } from '../../utils/history.js';

// ─── Wellness Score ────────────────────────────────────────────────────────────

export function WellnessScore() {
  const { score, breakdown } = useGoal();
  const animated = useCountUp(score);

  const items = [
    { key: 'nutrition', label: 'Nutrition', color: 'var(--accent)' },
    { key: 'hydration', label: 'Hydration', color: 'var(--accent-3)' },
    { key: 'activity', label: 'Activity', color: 'var(--accent-2)' },
    { key: 'sleep', label: 'Sleep', color: 'var(--c-violet)' },
  ];

  return (
    <div className="wellness">
      <ProgressRing value={score} size={180} color="var(--accent)">
        <div className="wellness__score">
          <span className="num" style={{ fontSize: '2.6rem' }}>{animated}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>/100</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Wellness</span>
        </div>
      </ProgressRing>

      <div className="wellness__breakdown">
        {items.map(({ key, label, color }) => (
          <ProgressBar
            key={key}
            value={breakdown[key]}
            label={label}
            sublabel={`${breakdown[key]}%`}
            color={color}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Calorie Card ─────────────────────────────────────────────────────────────

export function CalorieCard() {
  const { consumed } = useNutrition();
  const { goals } = useUser();
  const { progress } = useGoal();

  const target = goals?.calories ?? 1850;
  const animCal = useCountUp(consumed.calories);

  const macros = [
    { key: 'protein', label: 'Protein', consumed: consumed.protein, goal: goals?.proteinG ?? 110, color: 'var(--accent)' },
    { key: 'carbs', label: 'Carbs', consumed: consumed.carbs, goal: goals?.carbsG ?? 228, color: 'var(--accent-3)' },
    { key: 'fat', label: 'Fat', consumed: consumed.fat, goal: goals?.fatG ?? 58, color: 'var(--c-warn)' },
  ];

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <ProgressRing value={progress.calories} size={90} color="var(--accent)">
          <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
            <span className="num" style={{ fontSize: '1.1rem' }}>{animCal}</span>
          </div>
        </ProgressRing>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Calories Consumed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            <span className="text-grad">{animCal}</span>
            <span style={{ color: 'var(--text-3)', fontSize: '1rem' }}> / {target}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>kcal today</div>
        </div>
      </div>

      <div className="stack" style={{ gap: '0.6rem' }}>
        {macros.map(({ key, label, consumed: c, goal, color }) => (
          <ProgressBar
            key={key}
            value={(c / goal) * 100}
            label={label}
            sublabel={`${c} / ${goal}g`}
            color={color}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Motivation Card ──────────────────────────────────────────────────────────

export function MotivationCard() {
  const { score } = useGoal();
  const { text, author } = dailyQuote(score);

  return (
    <div className="stack" style={{ gap: '0.5rem' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>💡</div>
      <blockquote style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-1)', lineHeight: 1.6, fontSize: '0.95rem' }}>
        "{text}"
      </blockquote>
      <cite style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>— {author}</cite>
    </div>
  );
}

// ─── Streak Card ──────────────────────────────────────────────────────────────

export function StreakCard() {
  const { streak } = useGoal();
  const days = lastNDays(7);
  const today = todayKey();

  return (
    <div className="stack" style={{ gap: '1rem' }}>
      <div className="row-between">
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: '0.25rem' }}>Current Streak</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>🔥 {streak}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>consecutive days</div>
        </div>
        <div className="stat">
          <div className="stat__value">{streak >= 30 ? '🏆' : streak >= 14 ? '⚡' : '🌱'}</div>
          <div className="stat__label">
            {streak >= 30 ? 'Champion' : streak >= 14 ? 'On Fire' : 'Building'}
          </div>
        </div>
      </div>

      {/* Weekly calendar strip */}
      <div className="week-strip">
        {days.map((key) => {
          const isToday = key === today;
          const score = demoMetric(key, 'wellnessScore', 40, 100);
          const done = score >= 70;
          return (
            <div key={key} className={`week-day ${done ? 'done' : ''} ${isToday ? 'today' : ''}`}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>
                {new Date(key + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'narrow' })}
              </div>
              <div style={{ fontSize: '0.75rem' }}>{done ? '✓' : '·'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
