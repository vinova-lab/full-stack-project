import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import { Field } from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Brand() {
  return (
    <div className="auth-card__brand">
      <span style={{ fontSize: '2rem' }} aria-hidden="true">🌿</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem' }}>NutriFlow</span>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

export function Login() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const res = await handleLogin(email.trim(), password);
    setLoading(false);
    if (res.success) {
      navigate(res.isDemo ? '/app/dashboard' : '/app/dashboard');
    } else {
      setError(res.error ?? 'Login failed.');
    }
  }

  async function demoLogin() {
    setLoading(true);
    const res = await handleLogin('demo@nutriflow.app', 'demo1234');
    setLoading(false);
    if (res.success) navigate('/app/dashboard');
  }

  return (
    <div className="auth-shell">
      <AnimatedBackground />
      <div className="card auth-card">
        <Brand />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Welcome back</h2>
          <p style={{ fontSize: '0.875rem' }}>Sign in to continue your wellness journey</p>
        </div>

        <button className="btn btn--ghost btn--block" onClick={demoLogin} disabled={loading} style={{ border: '1px dashed var(--accent-border)', color: 'var(--accent-2)' }}>
          🌿 Try Demo Account
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-3)' }}>or sign in with your account</div>

        <form onSubmit={submit} noValidate>
          {error && <div role="alert" style={{ padding: '0.6rem 0.9rem', borderRadius: 'var(--r-md)', background: 'var(--danger-soft)', color: 'var(--danger)', fontSize: '0.84rem', border: '1px solid rgba(248,113,113,0.35)' }}>{error}</div>}
          <Field label="Email" id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" required />
          <Field label="Password" id="login-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" required />
          <Button type="submit" loading={loading} block style={{ marginTop: '0.5rem' }}>Sign In</Button>
        </form>

        <div className="auth-alt">
          No account? <Link to="/register">Create one free</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────

export function Register() {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.includes('@')) e.email = 'Enter a valid email address.';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const res = await handleRegister(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/onboarding'), 1200);
    } else {
      setErrors({ form: res.error });
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="auth-shell">
      <AnimatedBackground />
      <div className="card auth-card">
        <Brand />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Create your account</h2>
          <p style={{ fontSize: '0.875rem' }}>Free forever · All data stays on your device</p>
        </div>

        {success ? (
          <div className="auth-success">
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <strong>Account created!</strong>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-3)' }}>Setting up your profile…</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            {errors.form && <div role="alert" style={{ padding: '0.6rem 0.9rem', borderRadius: 'var(--r-md)', background: 'var(--danger-soft)', color: 'var(--danger)', fontSize: '0.84rem', border: '1px solid rgba(248,113,113,0.35)' }}>{errors.form}</div>}
            <Field label="Full Name" id="reg-name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Vino Rajesh" autoComplete="name" />
            <Field label="Email" id="reg-email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" autoComplete="email" />
            <Field label="Password" id="reg-pw" type="password" value={form.password} onChange={set('password')} error={errors.password} placeholder="Min. 6 characters" autoComplete="new-password" hint="At least 6 characters" />
            <Button type="submit" loading={loading} block style={{ marginTop: '0.5rem' }}>Create Account</Button>
          </form>
        )}

        <div className="auth-alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
