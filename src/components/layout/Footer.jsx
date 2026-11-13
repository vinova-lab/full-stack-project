import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <div className="footer__brand">
            <span aria-hidden="true">🌿</span> NutriFlow
          </div>
          <p className="footer__tagline">Your health, your data, your journey.</p>
          <div className="socials">
            <a href="#" aria-label="Twitter" className="socials__link">𝕏</a>
            <a href="#" aria-label="Instagram" className="socials__link">IG</a>
            <a href="#" aria-label="GitHub" className="socials__link">GH</a>
          </div>
        </div>

        <div>
          <div className="footer__heading">Product</div>
          <ul className="footer__links">
            <li><Link to="/app/dashboard">Dashboard</Link></li>
            <li><Link to="/app/nutrition">Nutrition</Link></li>
            <li><Link to="/app/scanner">Food Scanner</Link></li>
            <li><Link to="/app/workout">Workout</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer__heading">Tools</div>
          <ul className="footer__links">
            <li><Link to="/app/analytics">Analytics</Link></li>
            <li><Link to="/app/plans">Diet Plans</Link></li>
            <li><Link to="/app/goals">Goals</Link></li>
            <li><Link to="/app/achievements">Achievements</Link></li>
          </ul>
        </div>

        <div>
          <div className="footer__heading">Company</div>
          <ul className="footer__links">
            <li><a href="#">About</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><Link to="/app/contact">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__base">
        <span>© {new Date().getFullYear()} NutriFlow · All data stored locally on your device</span>
        <span className="demo-flag">Demo Build</span>
      </div>
    </footer>
  );
}
