import Page from '../components/layout/Page.jsx';
import Card from '../components/ui/Card.jsx';
import { BMICard, HeartRateCard, BloodPressureCard, SleepCard } from '../components/health/HealthCards.jsx';
import { useNutrition } from '../context/NutritionContext.jsx';
import { useUser } from '../context/UserContext.jsx';
import { Field } from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import { useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { minToHM } from '../utils/dates.js';

export default function Health() {
  const { sleepMin, logSleep } = useNutrition();
  const { goals } = useUser();
  const { success } = useToast();
  const [sleepInput, setSleepInput] = useState('');

  function handleLogSleep(e) {
    e.preventDefault();
    const h = parseFloat(sleepInput);
    if (isNaN(h) || h < 0 || h > 24) return;
    const mins = Math.round(h * 60);
    logSleep(mins);
    success(`Sleep logged: ${minToHM(mins)}`);
    setSleepInput('');
  }

  return (
    <Page
      title="Health Metrics"
      subtitle="Track your key biometric indicators"
      actions={<span className="demo-flag">⚠ Sample / Demo Data</span>}
    >
      <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', borderRadius: 'var(--r-md)', background: 'rgba(245,165,36,0.1)', border: '1px solid rgba(245,165,36,0.35)', fontSize: '0.82rem', color: 'var(--warn)' }}>
        These metrics are sample/demo values. Connect a wearable or enter your own readings for personalised tracking.
      </div>

      <div className="grid grid--dashboard" style={{ gap: '18px' }}>
        <Card className="col-6" title="Body Mass Index">
          <BMICard />
        </Card>

        <Card className="col-6" title="Heart Rate">
          <HeartRateCard />
        </Card>

        <Card className="col-6" title="Blood Pressure">
          <BloodPressureCard />
        </Card>

        <Card className="col-6" title="Sleep">
          <SleepCard />
          {/* Log sleep */}
          <form onSubmit={handleLogSleep} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'flex-end' }}>
            <Field label="Log last night (hours)" id="sleep-log" type="number" min={0} max={24} step={0.5}
              value={sleepInput} onChange={(e) => setSleepInput(e.target.value)} placeholder="e.g. 7.5" />
            <Button type="submit" size="sm" disabled={!sleepInput}>Save</Button>
          </form>
        </Card>
      </div>
    </Page>
  );
}
