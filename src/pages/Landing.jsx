import { useNavigate, Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import Footer from '../components/layout/Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { TESTIMONIALS, FEATURES, BENEFITS, HERO_STATS } from '../data/demoData.js';

function StarRating({ n = 5 }) {
  return <div className="stars" aria-label={`${n} stars`}>{Array.from({ length: n }, (_, i) => <span key={i}>★</span>)}</div>;
}

export default function Landing() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  async function handleDemo() {
    const res = await handleLogin('demo@nutriflow.app', 'demo1234');
    if (res.success) navigate('/app/dashboard');
  }

  return (
    <div className="landing">
      <AnimatedBackground />

      {/* Nav */}
      <nav className="landing-nav" aria-label="Site navigation">
        <Link to="/" className="row" style={{ gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
          <span aria-hidden="true">🌿</span> NutriFlow
        </Link>
        <div className="landing-nav__links" aria-hidden="true">
          <a href="#features">Features</a>
          <a href="#testimonials">Reviews</a>
          <a href="#pricing">About</a>
        </div>
        <div className="row" style={{ gap: '0.75rem' }}>
          <Link to="/login" className="btn btn--ghost btn--sm">Log in</Link>
          <Link to="/register" className="btn btn--primary btn--sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-section hero" aria-labelledby="hero-heading">
        <div>
          <div className="eyebrow" style={{ marginBottom: '1.25rem' }}>
            <span>🌿</span> Personalised Wellness Platform
          </div>
          <h1 id="hero-heading">
            Your Health.<br />
            Your Data.<br />
            <span className="text-grad">Your Journey.</span>
          </h1>
          <p className="hero__sub">
            Personalised nutrition, fitness and wellness guidance designed around you — not the algorithm.
          </p>
          <div className="hero__ctas">
            <Link to="/register" className="btn btn--primary btn--lg">Start Your Journey</Link>
            <button className="btn btn--ghost btn--lg" onClick={handleDemo}>Explore Dashboard →</button>
          </div>
          <div className="hero__meta">
            {HERO_STATS.map((s) => (
              <div key={s.label}>
                <div className="num" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual — floating mock cards */}
        <div className="hero-visual" aria-hidden="true">
          {/* Wellness ring */}
          <div className="hero-visual__card hero-visual__card--ring">
            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '0.5rem' }}>Wellness Score</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg viewBox="0 0 80 80" width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--surface-3)" strokeWidth="7" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--accent)" strokeWidth="7"
                  strokeDasharray="213.6" strokeDashoffset="38" strokeLinecap="round" />
              </svg>
              <div>
                <div className="num" style={{ fontSize: '1.6rem' }}>84</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>/100</div>
              </div>
            </div>
          </div>

          {/* Water */}
          <div className="hero-visual__card hero-visual__card--water">
            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '0.3rem' }}>Hydration</div>
            <div className="num" style={{ fontSize: '1.3rem' }}>1.8<span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>L</span></div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>of 2.5L</div>
            <div style={{ height: '6px', background: 'var(--surface-3)', borderRadius: '6px', marginTop: '0.5rem' }}>
              <div style={{ width: '72%', height: '100%', background: 'var(--accent-3)', borderRadius: '6px' }} />
            </div>
          </div>

          {/* Meal card */}
          <div className="hero-visual__card hero-visual__card--meal">
            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '0.4rem' }}>🥗 Lunch · 13:00</div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.2rem' }}>Quinoa Buddha Bowl</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>480 kcal · P:22g · C:68g · F:14g</div>
          </div>

          {/* Heart rate */}
          <div className="hero-visual__card hero-visual__card--hr">
            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '0.3rem' }}>Heart Rate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem', animation: 'heartbeat 1.6s infinite' }}>❤️</span>
              <span className="num" style={{ fontSize: '1.4rem' }}>76 <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>BPM</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section" id="features" aria-labelledby="features-heading">
        <div className="section-head">
          <div className="eyebrow">Platform</div>
          <h2 id="features-heading">Everything you need to thrive</h2>
          <p>Built around the science of habit formation — track, analyse, and improve every dimension of your health.</p>
        </div>
        <div className="grid grid--cards">
          {FEATURES.map((f) => (
            <div key={f.title} className="card card--hover feature-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }} aria-hidden="true">{f.icon}</div>
              <h4 style={{ marginBottom: '0.5rem' }}>{f.title}</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section" id="testimonials" aria-labelledby="testimonials-heading">
        <div className="section-head">
          <div className="eyebrow">Reviews</div>
          <h2 id="testimonials-heading">What people are saying</h2>
        </div>
        <div className="grid grid--three" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px,100%),1fr))' }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card testimonial">
              <StarRating n={t.stars} />
              <q>{t.text}</q>
              <div className="testimonial__who">
                <div className="avatar" style={{ width: 40, height: 40, borderRadius: 12, fontSize: '0.85rem' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="landing-section" aria-labelledby="benefits-heading">
        <div className="section-head">
          <div className="eyebrow">Why NutriFlow</div>
          <h2 id="benefits-heading">Built differently, on purpose</h2>
        </div>
        <div className="grid grid--two" style={{ gap: '1rem' }}>
          {BENEFITS.map((b) => (
            <div key={b} className="benefit-row card">
              <span className="icon-tile" aria-hidden="true">✓</span>
              <span style={{ fontSize: '0.9rem' }}>{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="landing-section" aria-labelledby="cta-heading">
        <div className="cta-band">
          <div className="eyebrow">Get started today</div>
          <h2 id="cta-heading">Ready to take ownership of your health?</h2>
          <p style={{ color: 'var(--text-2)', maxWidth: '48ch', textAlign: 'center' }}>
            Free, private, no account required to explore. All data stays on your device.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn--primary btn--lg">Create Free Account</Link>
            <button className="btn btn--ghost btn--lg" onClick={handleDemo}>Try the Demo</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
