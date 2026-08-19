import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import { Field, Select, OptionGrid } from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import { useUser } from '../context/UserContext.jsx';

const TOTAL = 6;

const GOALS = [
  { value: 'lose', label: 'Lose Weight', emoji: '⬇️', desc: 'Reduce body fat' },
  { value: 'maintain', label: 'Stay Healthy', emoji: '⚖️', desc: 'Maintain current weight' },
  { value: 'gain', label: 'Gain Weight', emoji: '⬆️', desc: 'Healthy weight gain' },
  { value: 'build', label: 'Build Muscle', emoji: '💪', desc: 'Increase lean mass' },
];

const ACTIVITY = [
  { value: 'sedentary', label: 'Sedentary', emoji: '🪑', desc: 'Little or no exercise' },
  { value: 'light', label: 'Light', emoji: '🚶', desc: '1-3 days/week' },
  { value: 'moderate', label: 'Moderate', emoji: '🏃', desc: '3-5 days/week' },
  { value: 'active', label: 'Active', emoji: '⚡', desc: '6-7 days/week' },
];

const DIETS = [
  { value: 'balanced', label: 'Balanced', emoji: '🍽', desc: 'Includes all food groups' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗', desc: 'No meat or fish' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱', desc: 'No animal products' },
  { value: 'keto', label: 'Keto', emoji: '🥑', desc: 'High fat, low carb' },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2 } }),
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState({
    name: '', age: '', heightCm: '', weightKg: '', goal: 'maintain',
    activityLevel: 'moderate', workoutFrequency: '4', workoutTime: '07:00',
    dietPreference: 'balanced', waterGoalMl: '2500', sleepGoalMin: '480',
  });

  function set(k) { return (v) => setData((d) => ({ ...d, [k]: v })); }
  function setE(k) { return (e) => setData((d) => ({ ...d, [k]: e.target.value })); }

  function next() { setDir(1); setStep((s) => Math.min(s + 1, TOTAL - 1)); }
  function back() { setDir(-1); setStep((s) => Math.max(s - 1, 0)); }

  function finish() {
    completeOnboarding({
      ...data,
      age: Number(data.age),
      heightCm: Number(data.heightCm),
      weightKg: Number(data.weightKg),
      workoutFrequency: Number(data.workoutFrequency),
      waterGoalMl: Number(data.waterGoalMl),
      sleepGoalMin: Number(data.sleepGoalMin),
    });
    navigate('/app/dashboard');
  }

  const steps = [
    // 0 — Personal
    <div key="personal" className="onb-step">
      <h3>👋 Let's get to know you</h3>
      <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>This helps us personalise your nutrition targets.</p>
      <Field label="Your Name" id="ob-name" value={data.name} onChange={setE('name')} placeholder="e.g. Vino" autoComplete="given-name" />
      <Field label="Age" id="ob-age" type="number" min={13} max={100} value={data.age} onChange={setE('age')} placeholder="e.g. 24" />
    </div>,

    // 1 — Body measurements
    <div key="body" className="onb-step">
      <h3>📏 Your measurements</h3>
      <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Used to calculate your personalised calorie target.</p>
      <div className="onb-grid2">
        <Field label="Height (cm)" id="ob-h" type="number" min={100} max={250} value={data.heightCm} onChange={setE('heightCm')} placeholder="e.g. 172" />
        <Field label="Weight (kg)" id="ob-w" type="number" min={30} max={300} value={data.weightKg} onChange={setE('weightKg')} placeholder="e.g. 68" />
      </div>
    </div>,

    // 2 — Goal
    <div key="goal" className="onb-step">
      <h3>🎯 What's your goal?</h3>
      <OptionGrid options={GOALS} value={data.goal} onChange={set('goal')} columns={2} />
    </div>,

    // 3 — Activity
    <div key="activity" className="onb-step">
      <h3>⚡ Activity level</h3>
      <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>How active are you on a typical week?</p>
      <OptionGrid options={ACTIVITY} value={data.activityLevel} onChange={set('activityLevel')} columns={2} />
      <div className="onb-grid2">
        <Field label="Workout days / week" id="ob-wf" type="number" min={0} max={7} value={data.workoutFrequency} onChange={setE('workoutFrequency')} />
        <Field label="Preferred time" id="ob-wt" type="time" value={data.workoutTime} onChange={setE('workoutTime')} />
      </div>
    </div>,

    // 4 — Diet
    <div key="diet" className="onb-step">
      <h3>🥗 Dietary preference</h3>
      <OptionGrid options={DIETS} value={data.dietPreference} onChange={set('dietPreference')} columns={2} />
    </div>,

    // 5 — Hydration + sleep
    <div key="prefs" className="onb-step">
      <h3>💧 Daily targets</h3>
      <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>We'll use these for your wellness score.</p>
      <div className="onb-grid2">
        <Field label="Water goal (ml)" id="ob-water" type="number" min={1000} max={5000} step={250} value={data.waterGoalMl} onChange={setE('waterGoalMl')} />
        <Field label="Sleep goal (min)" id="ob-sleep" type="number" min={300} max={600} step={30} value={data.sleepGoalMin} onChange={setE('sleepGoalMin')} />
      </div>
      <div style={{ padding: '1rem', borderRadius: 'var(--r-md)', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>You're all set, {data.name || 'there'}! 🎉</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>We'll calculate your personalised calorie target and macros from your profile.</div>
      </div>
    </div>,
  ];

  return (
    <div className="onb-shell">
      <AnimatedBackground />
      <div className="card onb-card">
        {/* Dot progress */}
        <div className="onb-progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-3)' }}>
            <span>Step {step + 1} of {TOTAL}</span>
            <span>{Math.round(((step + 1) / TOTAL) * 100)}% complete</span>
          </div>
          <div className="onb-dots">
            {Array.from({ length: TOTAL }, (_, i) => (
              <div key={i} className={`onb-dot ${i <= step ? 'filled' : ''}`} />
            ))}
          </div>
        </div>

        {/* Step content with slide animation */}
        <div style={{ overflow: 'hidden', minHeight: '280px' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div className="onb-nav">
          <Button variant="ghost" onClick={back} disabled={step === 0}>← Back</Button>
          {step < TOTAL - 1
            ? <Button onClick={next}>Continue →</Button>
            : <Button onClick={finish}>Start my journey 🚀</Button>
          }
        </div>
      </div>
    </div>
  );
}
