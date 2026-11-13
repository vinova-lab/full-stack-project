import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 → target using requestAnimationFrame.
 * Respects reduced-motion preference by returning the final value immediately.
 *
 * @param {number} target   Final value to count to
 * @param {number} duration Animation duration in ms (default 900)
 * @returns {number}        Current animated value
 */
export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const startValueRef = useRef(0);
  const reduced = typeof window !== 'undefined'
    ? document.documentElement.dataset.motion === 'reduced'
    : false;

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    startValueRef.current = 0;

    function tick(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, reduced]);

  return value;
}
