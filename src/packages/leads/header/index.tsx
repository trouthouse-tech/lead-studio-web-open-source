'use client';

/**
 * Legacy no-op: the leads toolbar (search, filters, actions) now lives in {@link LeadsFilters}.
 * Kept so imports of `LeadsHeader` from this package do not break.
 */
export const LeadsHeader = () => {
  return null;
};
