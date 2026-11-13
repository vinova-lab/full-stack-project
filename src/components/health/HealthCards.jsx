import { useHealth } from '../../context/HealthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { displayWeight, displayHeight } from '../../utils/format.js';
import { useUser } from '../../context/UserContext.jsx';
import { demoMetric } from '../../utils/history.js';
import { ProgressBar } from '../ui/Progress.jsx';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

// ─── BMI Card ─────────────────────────────────────────────────────────────────

export function BMICard() {
  const { bmi, bmiCategory } = useHealth();
  const { profile } = useUser();
  const { settings } = useSettings();
  const position = bmi ? ((Math.min(Math.max(bmi, 14), 40) - 14) / (40 - 14)) * 100 : 22;

  return (
    <div className="stack" style={{ gap: '0.75rem' }}>
      <div className="row-between">
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Body Mass Index</div>
          <div className="num" style={{ fontSize: '2rem' }}>{bmi ?? '—'}</div>
          <div style={{ fontSize: '0.8rem', color: bmiCategory?.color ?? 'var(--accent)' }}>{bmiCategory?.label ?? '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{displayWeight(profile?.weightKg ?? 68, settings.units)}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{displayHeight(profile?.heightCm ?? 172, settings.units)}</div>
        </div>
      </div>
      <div className="bmi-scale">
        <div className="bmi-scale__track">
          <div className="bmi-scale__seg" style={{ background: 'var(--accent-3)', width: '30%' }} />
          <div className="bmi-scale__seg" style={{ background: 'var(--accent)', width: '24%' }} />
          <div className="bmi-scale__seg" style={{ background: 'var(--warn)', width: '19%' }} />
          <div className="bmi-scale__seg" style={{ background: 'var(--danger)', width: '27%' }} />
        </div>
        <div className="bmi-scale__marker" style={{ left: `${position}%` }}>
          <span>{bmi ?? '—'}</span>
        </div>
        <div className="bmi-scale__labels">
          <span>Below Avg</span><span>Average</span><span>Above</span><span>High</span>
        </div>
      </div>
      {bmiCategory?.description && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', margin: 0 }}>{bmiCategory.description}</p>
      )}
      <div className="demo-flag">⚠ Sample / Demo Data</div>
    </div>
  );
}

// ─── Heart Rate Card ──────────────────────────────────────────────────────────

export function HeartRateCard() {
  const { heartRate } = useHealth();
  return (
    <div className="stack" style={{ gap: '1rem' }}>
      <div className="row-between">
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Heart Rate</div>
          <div className="num" style={{ fontSize: '2.2rem' }}>
            {heartRate} <span style={{ fontSize: '1rem', color: 'var(--text-3)' }}>BPM</span>
          </div>
          <span className="chip chip--accent" style={{ fontSize: '0.72rem' }}>Normal</span>
        </div>
        <div style={{ fontSize: '2.2rem', animation: 'heartbeat 1.6s ease-in-out infinite' }} aria-hidden="true">❤️</div>
      </div>
      <div className="ecg-wrap" aria-label="ECG waveform" role="img">
        <div className="ecg-grid" aria-hidden="true" />
        <svg viewBox="0 0 480 80" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none" aria-hidden="true">
          <polyline
            points="0,40 40,40 55,10 60,70 65,40 80,40 120,40 135,5 140,75 145,40 160,40 200,40 215,8 220,72 225,40 240,40 280,40 295,6 300,74 305,40 320,40 360,40 375,9 380,71 385,40 400,40 440,40 455,7 460,73 465,40 480,40"
            stroke="var(--danger)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(248,113,113,0.7))', strokeDasharray: 480, animation: 'ecgTravel 2.6s linear infinite' }}
          />
        </svg>
      </div>
      <div className="demo-flag">⚠ Sample / Demo Data</div>
    </div>
  );
}

// ─── Blood Pressure Card ──────────────────────────────────────────────────────

export function BloodPressureCard() {
  const { systolic, diastolic } = useHealth();
  const sysPct = Math.round(((systolic - 70) / (200 - 70)) * 100);
  const diaPct = Math.round(((diastolic - 40) / (130 - 40)) * 100);
  return (
    <div className="stack" style={{ gap: '1rem' }}>
      <div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Blood Pressure</div>
        <div className="num" style={{ fontSize: '2rem' }}>
          {systolic}<span style={{ color: 'var(--text-3)' }}>/</span>{diastolic}
          <span style={{ fontSize: '0.9rem', color: 'var(--text-3)', marginLeft: '0.3rem' }}>mmHg</span>
        </div>
        <span className="chip" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-border)', color: 'var(--accent-2)', fontSize: '0.72rem' }}>Normal</span>
      </div>
      <div className="stack" style={{ gap: '0.6rem' }}>
        <ProgressBar value={sysPct} label="Systolic" sublabel={`${systolic} mmHg`} color="var(--danger)" />
        <ProgressBar value={diaPct} label="Diastolic" sublabel={`${diastolic} mmHg`} color="var(--accent-3)" />
      </div>
      <div className="demo-flag">⚠ Sample / Demo Data</div>
    </div>
  );
}

// ─── Sleep Card ───────────────────────────────────────────────────────────────

export function SleepCard() {
  const { sleepH, sleepM, sleepGoalMin } = useHealth();
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      sleep: Math.round(demoMetric(key, 'sleepMin', 300, 540) / 60 * 10) / 10,
      isToday: i === 6,
    };
  });
  const goalH = Math.floor(sleepGoalMin / 60);
  const pct = Math.min(100, Math.round(((sleepH * 60 + sleepM) / sleepGoalMin) * 100));

  return (
    <div className="stack" style={{ gap: '1rem' }}>
      <div className="row-between">
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Last Night</div>
          <div className="num" style={{ fontSize: '2rem' }}>
            {sleepH}h <span style={{ fontSize: '1.1rem' }}>{sleepM}m</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Goal: {goalH}h · {pct}%</div>
        </div>
        <div style={{ fontSize: '2rem' }} aria-hidden="true">😴</div>
      </div>
      <ProgressBar value={pct} color="var(--violet)" />
      <div style={{ height: 64 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={14} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
            <Bar dataKey="sleep" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.isToday ? 'var(--violet)' : 'var(--surface-3)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
