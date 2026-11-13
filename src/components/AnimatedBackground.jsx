import { useMemo } from 'react';

/** Generate stable random particle props via index seed */
function particle(i) {
  const s0 = (i * 2654435761) >>> 0;
  const rand = (s, min, max) => min + ((s * 1664525 + 1013904223) >>> 0) / 4294967296 * (max - min);
  return {
    left: `${rand(s0, 5, 95).toFixed(1)}%`,
    opacity: rand(s0 ^ 0xdeadbeef, 0.18, 0.55).toFixed(2),
    duration: `${rand(s0 ^ 0xc0ffee, 8, 22).toFixed(1)}s`,
    delay: `-${rand(s0 ^ 0xabcdef, 0, 10).toFixed(1)}s`, // negative delay = start mid-cycle
    width: `${rand(s0 ^ 0x1234, 3, 5).toFixed(1)}px`,
    height: `${rand(s0 ^ 0x5678, 3, 5).toFixed(1)}px`,
  };
}

export default function AnimatedBackground() {
  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => particle(i)), []);

  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__gradient" />
      <div className="aurora__blob aurora__blob--1" />
      <div className="aurora__blob aurora__blob--2" />
      <div className="aurora__blob aurora__blob--3" />

      {/* Subtle food-leaf shapes */}
      <svg
        style={{ position: 'absolute', top: '15%', right: '8%', opacity: 0.05, animation: 'floatY 14s ease-in-out infinite' }}
        width="120" height="120" viewBox="0 0 64 64" fill="currentColor"
        aria-hidden="true"
      >
        <path d="M32 4c14 8 22 18 22 30 0 13-10 24-22 28C20 58 10 47 10 34c0-12 8-22 22-30z" />
        <path d="M18 36h9l3-9 6 16 4-7h12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Rising particles — each with individual duration/delay via CSS vars */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="aurora__particle"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            '--p-opacity': p.opacity,
            '--p-duration': p.duration,
            '--p-delay': p.delay,
          }}
        />
      ))}

      <div className="aurora__grain" />
    </div>
  );
}
