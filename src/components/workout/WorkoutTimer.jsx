import { useCallback, useEffect, useRef, useState } from 'react';
import { useNutrition } from '../../context/NutritionContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ProgressRing } from '../ui/Progress.jsx';
import { WORKOUTS, DEFAULT_WORKOUT_ID } from '../../data/workouts.js';
import { minToHM } from '../../utils/dates.js';

const STATES = { idle: 'idle', running: 'running', paused: 'paused', done: 'done' };

export default function WorkoutTimer({ workoutId = DEFAULT_WORKOUT_ID }) {
  const workout = WORKOUTS.find((w) => w.id === workoutId) ?? WORKOUTS[0];
  const exercises = workout.exercises;

  const [phase, setPhase] = useState(STATES.idle);
  const [exIdx, setExIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);    // seconds elapsed in current exercise
  const [totalElapsed, setTotalElapsed] = useState(0); // total seconds
  const intervalRef = useRef(null);
  const startTsRef = useRef(null);
  const elapsedAtPauseRef = useRef(0);

  const { logWorkout } = useNutrition();
  const { success } = useToast();

  const current = exercises[exIdx];
  const totalDuration = exercises.reduce((s, e) => s + e.duration, 0);
  const exPct = current ? Math.min(100, Math.round((elapsed / current.duration) * 100)) : 100;
  const overallPct = Math.min(100, Math.round((totalElapsed / totalDuration) * 100));

  // Tick
  const tick = useCallback(() => {
    const now = Date.now();
    const delta = Math.floor((now - startTsRef.current) / 1000) + elapsedAtPauseRef.current;
    const newElapsed = delta - exercises.slice(0, exIdx).reduce((s, e) => s + e.duration, 0);

    setElapsed(Math.max(0, newElapsed));
    setTotalElapsed(delta);

    if (newElapsed >= current.duration) {
      // Advance to next exercise
      if (exIdx < exercises.length - 1) {
        setExIdx((i) => i + 1);
        setElapsed(0);
      } else {
        // Workout complete
        clearInterval(intervalRef.current);
        setPhase(STATES.done);
        const mins = Math.round(totalDuration / 60);
        logWorkout(mins);
        success(`Workout complete! ${mins} minutes logged 🏆`);
      }
    }
  }, [exIdx, current, exercises, logWorkout, success, totalDuration]);

  useEffect(() => {
    if (phase === STATES.running) {
      intervalRef.current = setInterval(tick, 500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [phase, tick]);

  function start() {
    elapsedAtPauseRef.current = 0;
    startTsRef.current = Date.now();
    setPhase(STATES.running);
    setExIdx(0);
    setElapsed(0);
    setTotalElapsed(0);
  }

  function pause() {
    elapsedAtPauseRef.current = totalElapsed;
    setPhase(STATES.paused);
  }

  function resume() {
    startTsRef.current = Date.now();
    setPhase(STATES.running);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setPhase(STATES.idle);
    setExIdx(0);
    setElapsed(0);
    setTotalElapsed(0);
    elapsedAtPauseRef.current = 0;
  }

  const remaining = current ? current.duration - elapsed : 0;
  const mm = String(Math.floor(Math.max(0, remaining) / 60)).padStart(2, '0');
  const ss = String(Math.max(0, remaining) % 60).padStart(2, '0');

  return (
    <div className="timer-shell">
      {/* Overall ring */}
      <ProgressRing value={overallPct} size={180} color="var(--accent)">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginBottom: '2px' }}>Overall</div>
          <div className="num" style={{ fontSize: '1.6rem' }}>{overallPct}%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
            {minToHM(Math.round(totalElapsed / 60))} / {minToHM(workout.totalMin)}
          </div>
        </div>
      </ProgressRing>

      {/* Current exercise ring */}
      {phase !== STATES.idle && phase !== STATES.done && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <ProgressRing value={exPct} size={110} color="var(--accent-2)">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }} aria-hidden="true">{current.emoji}</div>
              <div className="num" style={{ fontSize: '1.1rem' }}>{mm}:{ss}</div>
            </div>
          </ProgressRing>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{current.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', maxWidth: '28ch', textAlign: 'center' }}>{current.description}</div>
        </div>
      )}

      {phase === STATES.done && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🏆</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Workout Complete!</div>
          <div style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>{minToHM(workout.totalMin)} logged to today</div>
        </div>
      )}

      {/* Controls */}
      <div className="timer-controls">
        {phase === STATES.idle && (
          <button className="btn btn--primary btn--lg" onClick={start}>▶ Start Workout</button>
        )}
        {phase === STATES.running && (
          <button className="btn btn--ghost" onClick={pause}>⏸ Pause</button>
        )}
        {phase === STATES.paused && (
          <button className="btn btn--primary" onClick={resume}>▶ Resume</button>
        )}
        {(phase === STATES.running || phase === STATES.paused) && (
          <button className="btn btn--ghost" onClick={reset}>↺ Reset</button>
        )}
        {phase === STATES.done && (
          <button className="btn btn--outline" onClick={reset}>↺ Do it Again</button>
        )}
      </div>

      {/* Exercise list */}
      <div className="stack" style={{ width: '100%', gap: '0.5rem' }}>
        {exercises.map((ex, i) => (
          <div
            key={ex.id}
            className={`exercise-row ${phase !== STATES.idle && i === exIdx ? 'current' : ''} ${phase !== STATES.idle && i < exIdx ? 'done' : ''}`}
          >
            <span style={{ fontSize: '1.2rem' }} aria-hidden="true">{ex.emoji}</span>
            <span className="exercise-row__name">{ex.name}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
              {i < exIdx && phase !== STATES.idle ? '✓' : minToHM(Math.round(ex.duration / 60))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
