/**
 * Lightweight canvas confetti — no external dependencies.
 * Automatically skips when the user prefers reduced motion.
 */

const COLORS = ['#10b981', '#2dd4bf', '#38bdf8', '#f59e0b', '#a78bfa', '#fb7185'];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

/** Fire a confetti burst from the viewport centre-top.
 *  @param {object} opts
 *  @param {number} opts.count  number of particles (default 80)
 *  @param {number} opts.duration duration in ms (default 2800)
 */
export function fireConfetti({ count = 80, duration = 2800 } = {}) {
  // Respect user motion preference
  if (document.documentElement.dataset.motion === 'reduced') return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const startTime = performance.now();

  const particles = Array.from({ length: count }, () => ({
    x: rand(canvas.width * 0.3, canvas.width * 0.7),
    y: rand(-20, 0),
    vx: rand(-6, 6),
    vy: rand(2, 8),
    rotation: rand(0, 360),
    rotationSpeed: rand(-6, 6),
    size: rand(6, 14),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.random() < 0.5 ? 'rect' : 'circle',
    opacity: 1,
  }));

  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function frame(now) {
    const elapsed = now - startTime;
    if (elapsed > duration) {
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = elapsed / duration;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.rotation += p.rotationSpeed;
      p.opacity = t > 0.6 ? 1 - (t - 0.6) / 0.4 : 1;
      drawParticle(p);
    });

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
