/**
 * WebAudio chime for celebration events.
 * Only plays when explicitly called and soundEnabled is true.
 * Never autoplays. Degrades gracefully if AudioContext is unavailable.
 */

let ctx = null;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

/**
 * Play a gentle celebratory chime.
 * @param {boolean} soundEnabled - from SettingsContext; pass false to skip.
 */
export function playChime(soundEnabled = true) {
  if (!soundEnabled) return;
  const ac = getCtx();
  if (!ac) return;

  // Resume suspended context (browser autoplay policy)
  if (ac.state === 'suspended') ac.resume().catch(() => {});

  const now = ac.currentTime;

  // Major arpeggio: C5 – E5 – G5 – C6
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const delays = [0, 0.1, 0.2, 0.35];

  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delays[i]);

    gain.gain.setValueAtTime(0, now + delays[i]);
    gain.gain.linearRampToValueAtTime(0.18, now + delays[i] + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delays[i] + 0.6);

    osc.start(now + delays[i]);
    osc.stop(now + delays[i] + 0.65);
  });
}

/**
 * Play a soft water-drop tick (for water bottle increments).
 */
export function playTick(soundEnabled = true) {
  if (!soundEnabled) return;
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === 'suspended') ac.resume().catch(() => {});

  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.start(now);
  osc.stop(now + 0.18);
}
