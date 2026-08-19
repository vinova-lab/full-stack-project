import { useState } from 'react';
import { useNutrition } from '../../context/NutritionContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { playTick } from '../../utils/sound.js';
import { displayWater } from '../../utils/format.js';

export default function WaterTracker() {
  const { waterMl, addWater } = useNutrition();
  const { goals } = useUser();
  const { settings } = useSettings();
  const [custom, setCustom] = useState('');

  const goal = goals?.waterMl ?? 2500;
  const pct = Math.min(100, Math.round((waterMl / goal) * 100));
  const fillH = `${pct}%`;

  function handleAdd(ml) {
    addWater(ml);
    playTick(settings.sound);
  }

  function handleCustom(e) {
    e.preventDefault();
    const ml = parseInt(custom, 10);
    if (ml > 0 && ml <= 2000) { handleAdd(ml); setCustom(''); }
  }

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      {/* Bottle + stats row */}
      <div className="water-wrap">
        {/* Animated bottle */}
        <div
          className="bottle"
          role="img"
          aria-label={`Water intake: ${displayWater(waterMl, settings.units)} of ${displayWater(goal, settings.units)}`}
        >
          <div className="bottle__cap" aria-hidden="true" />
          <div className="bottle__glass" aria-hidden="true">
            <div className="bottle__fill" style={{ height: fillH }}>
              {/* Wave SVG */}
              <svg className="bottle__wave" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 7 Q25 0 50 7 Q75 14 100 7 Q125 0 150 7 Q175 14 200 7 Q225 0 250 7 Q275 14 300 7 Q325 0 350 7 Q375 14 400 7 V14 H0Z"
                  fill="rgba(56,189,248,0.75)" />
              </svg>
              <svg className="bottle__wave bottle__wave--back" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 9 Q30 2 60 9 Q90 16 120 9 Q150 2 180 9 Q210 16 240 9 Q270 2 300 9 Q330 16 360 9 Q390 2 420 9 V14 H0Z"
                  fill="rgba(14,165,233,0.5)" />
              </svg>
            </div>
          </div>
          <div className="bottle__pct" aria-hidden="true">{pct}%</div>
        </div>

        {/* Stats */}
        <div style={{ flex: 1 }}>
          <div className="num" style={{ fontSize: '2rem', lineHeight: 1 }}>{displayWater(waterMl, settings.units)}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
            of {displayWater(goal, settings.units)} goal
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: pct >= 100 ? 'var(--accent-2)' : 'var(--text-3)' }}>
            {pct >= 100 ? '✓ Goal reached! 💧' : `${Math.round((goal - waterMl) / 1000 * 10) / 10}L remaining`}
          </div>
        </div>
      </div>

      {/* Quick-add buttons */}
      <div className="water-actions">
        {[250, 500].map((ml) => (
          <button
            key={ml}
            className="btn btn--outline btn--sm"
            onClick={() => handleAdd(ml)}
            aria-label={`Add ${ml}ml`}
          >
            +{settings.units === 'imperial' ? `${Math.round(ml / 29.574)} fl oz` : `${ml}ml`}
          </button>
        ))}
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => addWater(-waterMl)}
          aria-label="Reset water intake"
          title="Reset to zero"
        >
          ↺
        </button>
      </div>

      {/* Custom amount */}
      <form onSubmit={handleCustom} style={{ display: 'flex', gap: '0.5rem' }} aria-label="Log custom water amount">
        <input
          type="number"
          min={1} max={2000}
          placeholder="Custom ml…"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          aria-label="Custom water amount in ml"
          style={{
            flex: 1, padding: '0.45rem 0.75rem',
            borderRadius: 'var(--r-sm)', border: '1px solid var(--border)',
            background: 'var(--surface-2)', color: 'var(--text-1)', fontSize: '0.85rem',
          }}
        />
        <button type="submit" className="btn btn--primary btn--sm" disabled={!custom}>+ Add</button>
      </form>
    </div>
  );
}
