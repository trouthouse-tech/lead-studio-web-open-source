/**
 * Returns the user's local calendar date as `YYYY-MM-DD` (not UTC midnight).
 */
export const getBrowserLocalCalendarDate = (): string => {
  return new Date().toLocaleDateString('en-CA');
};
