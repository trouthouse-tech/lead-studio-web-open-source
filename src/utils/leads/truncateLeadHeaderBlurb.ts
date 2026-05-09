const DEFAULT_MAX = 520;

/**
 * Legacy leads may still have a long `description` from the old exhaustive prompt.
 * Prefer sentence boundaries so the header stays scannable for owners.
 */
export const truncateLeadHeaderBlurb = (text: string, maxChars = DEFAULT_MAX): string => {
  const t = text.trim();
  if (t.length <= maxChars) return t;
  const cut = t.slice(0, maxChars);
  const lastPeriod = Math.max(
    cut.lastIndexOf('. '),
    cut.lastIndexOf('! '),
    cut.lastIndexOf('? ')
  );
  if (lastPeriod > 140) {
    return cut.slice(0, lastPeriod + 1).trim();
  }
  return `${cut.trim()}…`;
};
