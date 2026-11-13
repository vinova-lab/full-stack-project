import { useEffect, useState } from 'react';

/**
 * Returns true when the given CSS media query matches.
 * Updates reactively when the window is resized or the query changes.
 *
 * @param {string} query  CSS media query, e.g. '(min-width: 900px)'
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const getMatch = () =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false;

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** Convenience: true on desktop (≥ 900px) */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 900px)');
}
