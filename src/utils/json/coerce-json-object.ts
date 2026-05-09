/**
 * Coerces JSON values to a plain object (`null`/non-objects → `{}`).
 */
export const coerceJsonObject = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};
