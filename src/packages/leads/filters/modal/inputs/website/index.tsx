'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import {
  WEBSITE_FILTER_OPTIONS,
  type LeadWebsiteFilterValue,
} from '@/utils/leads/constants';

export const LeadsFiltersWebsiteInput = () => {
  const dispatch = useAppDispatch();
  const websiteFilter = useAppSelector((state) => state.leadsFilters.websiteFilter);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        LeadsFiltersActions.setWebsiteFilter(e.target.value as LeadWebsiteFilterValue)
      );
    },
    [dispatch]
  );

  return (
    <select value={websiteFilter} onChange={handleChange} className={styles.select}>
      {WEBSITE_FILTER_OPTIONS.map((o) => (
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
