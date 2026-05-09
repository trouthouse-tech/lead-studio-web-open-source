/**
 * Format an ISO timestamp as time-of-day only (e.g. "2:30 PM") in the user's locale.
 */
export const formatLocaleTimeHourMinute = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};
