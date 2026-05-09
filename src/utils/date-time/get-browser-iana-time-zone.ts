/**
 * Returns the browser-reported IANA time zone when available (e.g. `America/New_York`).
 */
export const getBrowserIanaTimeZone = (): string | undefined => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
