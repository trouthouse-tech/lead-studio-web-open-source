import { DateTime } from 'luxon';

/**
 * Starting at startYmd (Eastern), returns the first YYYY-MM-DD with count &lt; cap (or startYmd after maxSteps).
 */
export const findNextEstDayUnderCap = (
  counts: Map<string, number>,
  startYmd: string,
  cap: number,
  maxSteps: number = 90
): string => {
  let d = DateTime.fromFormat(startYmd, 'yyyy-MM-dd', { zone: 'America/New_York' });
  if (!d.isValid) return startYmd;

  for (let i = 0; i < maxSteps; i++) {
    const key = d.toFormat('yyyy-MM-dd');
    const n = counts.get(key) ?? 0;
    if (n < cap) return key;
    d = d.plus({ days: 1 });
  }

  return d.toFormat('yyyy-MM-dd');
};
