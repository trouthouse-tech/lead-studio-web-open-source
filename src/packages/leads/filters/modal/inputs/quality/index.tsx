'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import {
  QUALITY_FILTER_OPTIONS,
  type LeadQualityFilterValue,
} from '@/utils/leads/constants';

export const LeadsFiltersQualityInput = () => {
  const dispatch = useAppDispatch();
  const leadsFilters = useAppSelector((state) => state.leadsFilters);
  const qualityFilter = leadsFilters.qualityFilter;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        LeadsFiltersActions.setQualityFilter(e.target.value as LeadQualityFilterValue)
      );
    },
    [dispatch]
  );

  return (
    <select value={qualityFilter} onChange={handleChange} className={styles.select}>
      {QUALITY_FILTER_OPTIONS.map((o) => (
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
