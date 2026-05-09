/**
 * Formats stored "cents" to a dollar string. Values may be fractional cents
 * (usd × 100) so tiny Haiku calls don't round to $0.00.
 *
 * @param cents - Cost in cents (may be fractional)
 */
export const formatCents = (cents: number): string => {
  const dollars = cents / 100;
  if (dollars === 0) {
    return '$0.00';
  }
  const ad = Math.abs(dollars);
  // Below one cent in USD: show 4 decimal places so sub-cent API costs are visible
  if (ad < 0.01) {
    return `$${dollars.toFixed(4)}`;
  }
  return `$${dollars.toFixed(2)}`;
};
