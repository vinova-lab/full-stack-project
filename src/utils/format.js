/** Format number with one decimal, stripping trailing .0 */
export function n1(v) {
  return Number.isFinite(v) ? (Math.round(v * 10) / 10).toString().replace(/\.0$/, '') : '—';
}

/** Comma-format large numbers */
export function commas(v) {
  if (!Number.isFinite(v)) return '—';
  return v.toLocaleString('en-US');
}

// ─── Unit conversions ─────────────────────────────────────────────────────────

export const convert = {
  /** kg → lb */
  kgToLb: (kg) => Math.round(kg * 2.2046 * 10) / 10,
  /** lb → kg */
  lbToKg: (lb) => Math.round(lb / 2.2046 * 10) / 10,
  /** cm → ft'in" */
  cmToFtIn: (cm) => {
    const totalIn = cm / 2.54;
    const ft = Math.floor(totalIn / 12);
    const inch = Math.round(totalIn % 12);
    return `${ft}'${inch}"`;
  },
  /** ft, in → cm */
  ftInToCm: (ft, inch) => Math.round((ft * 12 + inch) * 2.54),
  /** ml → fl oz */
  mlToFlOz: (ml) => Math.round(ml / 29.5735 * 10) / 10,
  /** fl oz → ml */
  flOzToMl: (fl) => Math.round(fl * 29.5735),
  /** km → miles */
  kmToMi: (km) => Math.round(km * 0.621371 * 10) / 10,
};

/** Format weight with units label */
export function displayWeight(kg, units = 'metric') {
  return units === 'imperial' ? `${convert.kgToLb(kg)} lb` : `${n1(kg)} kg`;
}

/** Format height with units label */
export function displayHeight(cm, units = 'metric') {
  return units === 'imperial' ? convert.cmToFtIn(cm) : `${cm} cm`;
}

/** Format water volume with units label */
export function displayWater(ml, units = 'metric') {
  if (units === 'imperial') return `${n1(convert.mlToFlOz(ml))} fl oz`;
  return ml >= 1000 ? `${n1(ml / 1000)} L` : `${ml} ml`;
}

/** Truncate long strings */
export function truncate(str, n = 24) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

/** Capitalise first letter */
export function cap(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** "82 / 110 g" style macro label */
export function macroLabel(consumed, target, unit = 'g') {
  return `${consumed} / ${target} ${unit}`;
}
