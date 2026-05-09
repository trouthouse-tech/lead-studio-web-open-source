/**
 * Builds a tel: href from a display phone string, or null if not dialable.
 */
export const getTelHref = (phone: string | undefined | null): string | null => {
  const trimmed = phone?.trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : null;
};
