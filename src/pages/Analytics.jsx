import { useState } from 'react';
import Page from '../components/layout/Page.jsx';
import Card from '../components/ui/Card.jsx';
import { Segmented } from '../components/ui/Field.jsx';
import { getDailySeries, getWeeklySeries, getMonthlySeries } from '../utils/history.js';
import { dayShort } from '../utils/dates.js';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';

const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const TOOLTIP_STYLE = {
  contentStyle: { background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-1)' },
  cursor: { fill: 'rgba(45,212,191,0.07)' },
};

function getSeries(period, metric, opts) {
  if (period === 'weekly') return getWeeklySeries(metric, opts).map((d) => ({ name: d.label, value: d.value }));
  if (period === 'monthly') return getMonthlySeries(metric, opts).map((d) => ({ name: d.label, value: d.value }));
  return getDailySeries(metric, opts).map((d) => ({ name: dayShort(d.key), value: d.value }));
}

function ChartCard({ title, metric, color, type = 'bar', min, max, unit = '' }) {
  const [period, setPeriod] = useState('daily');
  const data = getSeries(period, metric, { min, max });

  return (
    <Card className="col-6">
      <div className="card__head">
        <div className="card__title">{title}</div>
        <Segmented options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
      </div>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} width={32} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}${unit}`, title]} />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill={`url(#grad-${metric})`} dot={{ fill: color, r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} width={32} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}${unit}`, title]} />
              <Bar dataKey="value" fill={color} radius={[5, 5, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default function Analytics() {
  return (
    <Page title="Analytics" subtitle="Track your trends across time">
      <div className="grid grid--dashboard" style={{ gap: '18px' }}>
        <ChartCard title="Wellness Score" metric="wellnessScore" color="var(--accent)" type="line" min={40} max={100} unit="/100" />
        <ChartCard title="Calories" metric="calories" color="var(--accent-2)" min={1000} max={2500} unit=" kcal" />
        <ChartCard title="Protein" metric="protein" color="var(--accent)" min={40} max={140} unit="g" />
        <ChartCard title="Hydration" metric="waterMl" color="var(--accent-3)" type="line" min={800} max={3000} unit="ml" />
        <ChartCard title="Sleep" metric="sleepMin" color="var(--violet)" min={300} max={560} unit="min" />
        <ChartCard title="Workout" metric="workoutMin" color="var(--warn)" min={0} max={90} unit="min" />
      </div>
    </Page>
  );
}
