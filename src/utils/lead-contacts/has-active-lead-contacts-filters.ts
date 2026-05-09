import type { PersistedLeadContactsFilters } from './persisted-lead-contacts-filters';

/**
 * Returns true when list filters differ from the default "show everything" state.
 */
export const getHasActiveLeadContactsFilters = (
  filters: PersistedLeadContactsFilters
): boolean => {
  return !!filters.searchFilter.trim() || filters.statusFilter !== 'all';
};
