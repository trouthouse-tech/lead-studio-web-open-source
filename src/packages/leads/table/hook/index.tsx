'use client';

import { useMemo, useState, useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import {
  getFilteredSortedLeadsForList,
  getLeadIdsWithAtLeastOneContactSet,
  type LeadsListSortColumn,
  type LeadsListSortDirection,
} from '@/utils/leads';

type SortColumn = LeadsListSortColumn;
type SortDirection = LeadsListSortDirection;

/**
 * Leads table: filtered + sorted list from store filters and local sort state.
 */
export const useLeadsTableData = () => {
  const leadsRecord = useAppSelector((state) => state.leads);
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);
  const leadCategories = useAppSelector((state) => state.leadCategories);
  const leadsFilters = useAppSelector((state) => state.leadsFilters, shallowEqual);

  const [sortColumn, setSortColumn] = useState<SortColumn>('quality_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = useCallback(
    (column: SortColumn) => {
      if (sortColumn === column) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortDirection(
          column === 'updated_at' || column === 'quality_score' ? 'desc' : 'asc'
        );
        setSortColumn(column);
      }
    },
    [sortColumn]
  );

  const leadsList = useMemo(() => Object.values(leadsRecord), [leadsRecord]);

  const leadIdsWithAtLeastOneContact = useMemo(
    () => getLeadIdsWithAtLeastOneContactSet(leadContactsRecord),
    [leadContactsRecord]
  );

  const sortedLeads = useMemo(
    () =>
      getFilteredSortedLeadsForList({
        leads: leadsList,
        leadCategories,
        filters: {
          selectedCategoryIds: leadsFilters.selectedCategoryIds,
          selectedStatus: leadsFilters.selectedStatus,
          searchFilter: leadsFilters.searchFilter,
          qualityFilter: leadsFilters.qualityFilter,
          websiteFilter: leadsFilters.websiteFilter,
          leadContactFilter: leadsFilters.leadContactFilter,
          facebookGoogleSearchFilter: leadsFilters.facebookGoogleSearchFilter,
          playwrightUrlDiscoveryFilter: leadsFilters.playwrightUrlDiscoveryFilter,
          websiteResearchFilter: leadsFilters.websiteResearchFilter,
        },
        leadIdsWithAtLeastOneContact,
        sortColumn,
        sortDirection,
      }),
    [
      leadsList,
      leadCategories,
      leadsFilters,
      leadIdsWithAtLeastOneContact,
      sortColumn,
      sortDirection,
    ]
  );

  const hasFiltersSubset = useMemo(
    () =>
      leadsFilters.selectedCategoryIds.length > 0 ||
      !!leadsFilters.selectedStatus ||
      !!leadsFilters.searchFilter ||
      leadsFilters.qualityFilter !== 'all' ||
      leadsFilters.websiteFilter !== 'all',
    [leadsFilters]
  );

  return {
    sortedLeads,
    sortColumn,
    sortDirection,
    handleSort,
    hasFiltersSubset,
  };
};
