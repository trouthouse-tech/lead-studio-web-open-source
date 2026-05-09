'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import {
  CONTACT_FILTER_OPTIONS,
  type LeadContactFilterValue,
} from '@/utils/leads/constants';

export const LeadsFiltersLeadContactInput = () => {
  const dispatch = useAppDispatch();
  const leadContactFilter = useAppSelector(
    (state) => state.leadsFilters.leadContactFilter
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        LeadsFiltersActions.setLeadContactFilter(
          e.target.value as LeadContactFilterValue
        )
      );
    },
    [dispatch]
  );

  return (
    <select
      value={leadContactFilter}
      onChange={handleChange}
      className={styles.select}
    >
      {CONTACT_FILTER_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

const styles = {
  select: `text-sm border border-gray-300 rounded px-2 py-1.5 bg-white`,
};
