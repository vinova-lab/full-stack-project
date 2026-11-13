// ──────────────────────────────────────────────────────────────────────────────
// Profile Page
// ──────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import Page from '../components/layout/Page.jsx';
import Card from '../components/ui/Card.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import { Field, Select } from '../components/ui/Field.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useGoal } from '../context/GoalContext.jsx';
import { displayWeight, displayHeight } from '../utils/format.js';
import { useSettings } from '../context/SettingsContext.jsx';

export function Profile() {
  const { profile, saveProfile } = useUser();
  const { session } = useAuth();
  const { settings } = useSettings();
  const { score, streak } = useGoal();
  const { success } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });

  function handleSave() {
    saveProfile({ ...form, age: Number(form.age), heightCm: Number(form.heightCm), weightKg: Number(form.weightKg) });
    success('Profile saved!');
    setEditing(false);
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const stats = [
    { label: 'Wellness Score', value: `${score}/100` },
    { label: 'Current Streak', value: `🔥 ${streak}` },
    { label: 'BMI Range', value: profile?.weightKg && profile?.heightCm ? 'See Health page' : '—' },
  ];

  return (
    <Page title="Profile" subtitle="Your personal information and stats"
      actions={<Button size="sm" onClick={() => { setForm({ ...profile }); setEditing(true); }}>Edit Profile</Button>}>
      <div className="grid grid--two" style={{ gap: '18px', alignItems: 'start' }}>
        <Card>
          <div className="profile-hero">
            <div className="avatar" style={{ width: 76, height: 76, borderRadius: 24, fontSize: '1.6rem' }}>
              {(profile?.name ?? session?.name ?? 'U')[0]?.toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{profile?.name ?? session?.name}</h3>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-3)' }}>{session?.email}</div>
              {session?.isDemo && <span className="demo-flag" style={{ marginTop: '0.4rem' }}>Demo Account</span>}
            </div>
          </div>
          <div className="divider" style={{ margin: '1.25rem 0' }} />
          <div className="stack" style={{ gap: '0.75rem' }}>
            {[
              { label: 'Age', value: profile?.age ? `${profile.age} years` : '—' },
              { label: 'Height', value: profile?.heightCm ? displayHeight(profile.heightCm, settings.units) : '—' },
              { label: 'Weight', value: profile?.weightKg ? displayWeight(profile.weightKg, settings.units) : '—' },
              { label: 'Goal', value: profile?.goal ? { lose: 'Lose Weight', maintain: 'Maintain', gain: 'Gain Weight', build: 'Build Muscle' }[profile.goal] : '—' },
              { label: 'Activity', value: profile?.activityLevel ? { sedentary: 'Sedentary', light: 'Light', moderate: 'Moderate', active: 'Active' }[profile.activityLevel] : '—' },
              { label: 'Diet', value: profile?.dietPreference ? { balanced: 'Balanced', vegetarian: 'Vegetarian', vegan: 'Vegan' }[profile.dietPreference] ?? profile.dietPreference : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="row-between">
                <span style={{ fontSize: '0.84rem', color: 'var(--text-3)' }}>{label}</span>
                <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Today's Stats">
          <div className="stack" style={{ gap: '1rem' }}>
            {stats.map(({ label, value }) => (
              <div key={label} className="row-between">
                <span style={{ fontSize: '0.84rem', color: 'var(--text-3)' }}>{label}</span>
                <span style={{ fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Profile">
        <div className="stack" style={{ gap: '0.75rem' }}>
          <Field label="Name" id="p-name" value={form.name ?? ''} onChange={set('name')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <Field label="Age" id="p-age" type="number" value={form.age ?? ''} onChange={set('age')} />
            <Field label="Height (cm)" id="p-h" type="number" value={form.heightCm ?? ''} onChange={set('heightCm')} />
            <Field label="Weight (kg)" id="p-w" type="number" value={form.weightKg ?? ''} onChange={set('weightKg')} />
          </div>
          <Select label="Goal" id="p-goal" value={form.goal ?? 'maintain'} onChange={set('goal')}
            options={[{ value: 'lose', label: 'Lose Weight' }, { value: 'maintain', label: 'Maintain' }, { value: 'gain', label: 'Gain Weight' }, { value: 'build', label: 'Build Muscle' }]} />
          <Button block onClick={handleSave}>Save Changes</Button>
        </div>
      </Modal>
    </Page>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Settings Page
// ──────────────────────────────────────────────────────────────────────────────
import { Switch, Segmented } from '../components/ui/Field.jsx';
import { useSettings as useSettingsPage } from '../context/SettingsContext.jsx';
import { clearAll } from '../services/storage.js';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const { settings, updateSettings, resetSettings } = useSettingsPage();
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  function handleReset() {
    clearAll();
    resetSettings();
    handleLogout();
    navigate('/');
    success('All data reset.');
  }

  const rows = [
    {
      label: 'Theme', desc: 'App colour scheme',
      control: (
        <Segmented
          options={[{ value: 'dark', label: '🌙 Dark' }, { value: 'light', label: '☀️ Light' }, { value: 'system', label: '💻 System' }]}
          value={settings.theme} onChange={(v) => updateSettings({ theme: v })}
        />
      ),
    },
    {
      label: 'Units', desc: 'Measurement system',
      control: (
        <Segmented
          options={[{ value: 'metric', label: 'Metric' }, { value: 'imperial', label: 'Imperial' }]}
          value={settings.units} onChange={(v) => updateSettings({ units: v })}
        />
      ),
    },
    {
      label: 'Motion', desc: 'Reduce animations for accessibility',
      control: (
        <Segmented
          options={[{ value: 'full', label: 'Full' }, { value: 'reduced', label: 'Reduced' }]}
          value={settings.motion} onChange={(v) => updateSettings({ motion: v })}
        />
      ),
    },
    {
      label: 'Sound', desc: 'Play sounds for goal completions',
      control: <Switch checked={settings.sound} onChange={(v) => updateSettings({ sound: v })} id="sound-toggle" />,
    },
    {
      label: 'Notifications', desc: 'Show in-app wellness notifications',
      control: <Switch checked={settings.notifications} onChange={(v) => updateSettings({ notifications: v })} id="notif-toggle" />,
    },
  ];

  return (
    <Page title="Settings" subtitle="Customise your NutriFlow experience">
      <div className="stack" style={{ gap: '18px' }}>
        <Card title="Preferences">
          {rows.map(({ label, desc, control }) => (
            <div key={label} className="settings-row">
              <div className="settings-row__text">
                <strong>{label}</strong>
                <span>{desc}</span>
              </div>
              {control}
            </div>
          ))}
        </Card>

        <Card title="Data">
          <div className="settings-row">
            <div className="settings-row__text">
              <strong>Reset All Data</strong>
              <span>Permanently clears all local data and logs you out</span>
            </div>
            {confirmReset
              ? <div className="row" style={{ gap: '0.5rem' }}>
                  <Button size="sm" variant="danger" onClick={handleReset}>Confirm Reset</Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
                </div>
              : <Button size="sm" variant="danger" onClick={() => setConfirmReset(true)}>Reset</Button>
            }
          </div>
        </Card>
      </div>
    </Page>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Contact / Help Page
// ──────────────────────────────────────────────────────────────────────────────
import { Field as ContactField } from '../components/ui/Field.jsx';

export function Contact() {
  const { success } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.includes('@')) e.email = 'Valid email required.';
    if (!form.message.trim()) e.message = 'Message is required.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSent(true);
    success('Message sent! We\'ll get back to you soon.');
  }

  const INFO = [
    { icon: '📧', label: 'Email', value: 'hello@nutriflow.app' },
    { icon: '💬', label: 'Live Chat', value: 'Available via NutriAI in the app' },
    { icon: '📖', label: 'Docs', value: 'docs.nutriflow.app' },
  ];

  return (
    <Page title="Help & Contact" subtitle="Get in touch with the NutriFlow team">
      <div className="grid grid--two" style={{ gap: '18px', alignItems: 'start' }}>
        <Card title="Send a Message">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✉️</div>
              <h4>Message received!</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>We'll reply to {form.email} within 24 hours.</p>
              <Button variant="ghost" size="sm" style={{ marginTop: '1rem' }} onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <ContactField label="Name" id="c-name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Your name" />
                <ContactField label="Email" id="c-email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
              </div>
              <ContactField label="Subject" id="c-subject" value={form.subject} onChange={set('subject')} placeholder="How can we help?" />
              <div className="field" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="c-msg">Message</label>
                <textarea id="c-msg" rows={5} value={form.message} onChange={set('message')} placeholder="Tell us what you need…"
                  style={{ resize: 'vertical' }} aria-invalid={!!errors.message} />
                {errors.message && <span className="field__error">{errors.message}</span>}
              </div>
              <Button type="submit" block style={{ marginTop: '0.75rem' }}>Send Message</Button>
            </form>
          )}
        </Card>

        <div className="stack" style={{ gap: '1rem' }}>
          <Card title="Contact Info">
            {INFO.map(({ icon, label, value }) => (
              <div key={label} className="contact-info-row">
                <div className="icon-tile" aria-hidden="true">{icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>{value}</div>
                </div>
              </div>
            ))}
          </Card>
          <Card title="Quick Help">
            <div className="stack" style={{ gap: '0.5rem' }}>
              {['How do I reset my data?', 'Can I export my nutrition log?', 'How is my wellness score calculated?', 'How do I change my calorie target?'].map((q) => (
                <div key={q} style={{ padding: '0.6rem 0.75rem', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', fontSize: '0.84rem', cursor: 'pointer' }}
                  role="button" tabIndex={0}>{q}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Not Found Page
// ──────────────────────────────────────────────────────────────────────────────
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="notfound">
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div className="text-grad" style={{ fontSize: 'clamp(5rem,18vw,10rem)', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1 }}>404</div>
        <h2 style={{ marginTop: '0.5rem' }}>Page not found</h2>
        <p style={{ color: 'var(--text-3)', marginBottom: '2rem', maxWidth: '36ch', margin: '0.75rem auto 2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/app/dashboard" className="btn btn--primary">Go to Dashboard</Link>
          <Link to="/" className="btn btn--ghost">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
