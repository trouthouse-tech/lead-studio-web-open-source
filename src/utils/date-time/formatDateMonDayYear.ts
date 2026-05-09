/**
 * Format date like "Apr 4, 2026" (short month, day, year) for dashboard tiles.
 */
export const formatDateMonDayYear = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
