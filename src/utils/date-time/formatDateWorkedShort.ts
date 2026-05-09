/**
 * Numeric sort key for a "date worked" string using the calendar day in local time.
 * Avoids UTC parsing (e.g. 2025-04-09T00:00:00.000Z showing/sorting as April 8 in US zones).
 */
export const getWorkedDateSortValue = (date: string): number => {
  const trimmed = date.trim();
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (ymd) {
    const y = Number(ymd[1]);
    const m = Number(ymd[2]);
    const d = Number(ymd[3]);
    const local = new Date(y, m - 1, d);
    const t = local.getTime();
    return Number.isNaN(t) ? 0 : t;
  }
  const parsed = new Date(date);
  const t = parsed.getTime();
  return Number.isNaN(t) ? 0 : t;
};

/**
 * Format a "date worked" for display without shifting the calendar day across timezones.
 */
export const formatDateWorkedShort = (date: string): string => {
  const trimmed = date.trim();
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (ymd) {
    const y = Number(ymd[1]);
    const m = Number(ymd[2]);
    const d = Number(ymd[3]);
    const local = new Date(y, m - 1, d);
    if (!Number.isNaN(local.getTime())) {
      return local.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }
  const fallback = new Date(date);
  if (Number.isNaN(fallback.getTime())) return '';
  return fallback.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
