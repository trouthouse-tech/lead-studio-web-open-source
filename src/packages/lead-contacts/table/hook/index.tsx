'use client';

import { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { getFilteredSortedLeadContactsForList } from '@/utils/lead-contacts';

/**
 * Lead contacts table: filtered + sorted list from store filters.
 */
export const useLeadContactsTableData = () => {
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);
  const leadContactsFilters = useAppSelector(
    (state) => state.leadContactsFilters,
    shallowEqual
  );

  const sortedContacts = useMemo(
    () => Object.values(leadContactsRecord),
    [leadContactsRecord]
  );

  const visibleContacts = useMemo(
    () =>
      getFilteredSortedLeadContactsForList(leadContactsRecord, leadContactsFilters),
    [leadContactsRecord, leadContactsFilters]
  );

  const totalCount = sortedContacts.length;

  return {
    visibleContacts,
    totalCount,
  };
};
