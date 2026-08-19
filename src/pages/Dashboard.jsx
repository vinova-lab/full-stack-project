import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Page from '../components/layout/Page.jsx';
import Card from '../components/ui/Card.jsx';
import { WellnessScore, CalorieCard, MotivationCard, StreakCard } from '../components/dashboard/DashboardCards.jsx';
import WaterTracker from '../components/dashboard/WaterTracker.jsx';
import MealTimeline from '../components/dashboard/MealTimeline.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { greeting } from '../utils/dates.js';

const SHORTCUTS = [
  { to: '/app/scanner', label: 'Scan Food', icon: '📷' },
  { to: '/app/workout', label: 'Workout', icon: '🏋️' },
  { to: '/app/plans', label: 'Diet Plans', icon: '📋' },
  { to: '/app/analytics', label: 'Analytics', icon: '📈' },
];

const containerVariants = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const { profile } = useUser();
  const { isDemo } = useAuth();
  const name = profile?.name ?? 'there';

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Greeting */}
      <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          {greeting(name)}
        </h2>
        <p style={{ marginTop: '0.35rem', fontSize: '0.875rem', color: 'var(--text-3)' }}>
          {isDemo && <span className="demo-flag" style={{ marginRight: '0.6rem' }}>Demo</span>}
          Here's your wellness snapshot for today.
        </p>
      </motion.div>

      {/* Quick access shortcuts */}
      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {SHORTCUTS.map(({ to, label, icon }) => (
          <Link key={to} to={to} className="btn btn--ghost btn--sm">
            <span aria-hidden="true">{icon}</span> {label}
          </Link>
        ))}
      </motion.div>

      {/* Bento dashboard grid */}
      <div className="grid grid--dashboard" style={{ gap: '18px' }}>
        <motion.div variants={itemVariants} className="col-5">
          <Card glow title="Wellness Score" subtitle="Today's health index">
            <WellnessScore />
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-7">
          <Card title="Calories" subtitle="Intake vs target">
            <CalorieCard />
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-4">
          <Card title="💧 Hydration" subtitle="Daily water">
            <WaterTracker />
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-4">
          <Card title="🔥 Streak" subtitle="Consecutive days">
            <StreakCard />
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-4">
          <Card title="💡 Daily Insight">
            <MotivationCard />
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-12">
          <Card title="Today's Meals">
            <MealTimeline compact />
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <Link to="/app/nutrition" className="btn btn--ghost btn--sm">View all meals →</Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
