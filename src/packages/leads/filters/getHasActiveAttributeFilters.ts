import type { LeadsFiltersState } from '@/store/filters';

/**
 * True when any attribute filter differs from defaults (toolbar funnel badge + modal footer).
 * Note: `getFilteredSortedLeadsForList` may apply additional
 * semantics; the leads table empty-state uses a smaller subset (`hasFilters`) — keep changes intentional.
 */
export const getHasActiveAttributeFilters = (f: LeadsFiltersState): boolean =>
  !!(
    f.selectedStatus ||
    f.selectedCategoryIds.length > 0 ||
    f.searchFilter ||
    f.qualityFilter !== 'all' ||
    f.websiteFilter !== 'all' ||
    f.leadContactFilter !== 'all' ||
    f.facebookGoogleSearchFilter !== 'all' ||
    f.playwrightUrlDiscoveryFilter !== 'all' ||
    f.websiteResearchFilter !== 'all'
  );
