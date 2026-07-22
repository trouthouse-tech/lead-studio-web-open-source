'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import {
  URL_DISCOVERY_FILTER_OPTIONS,
  type LeadUrlDiscoveryFilterValue,
} from '@/utils/leads/constants';

export const LeadsFiltersUrlDiscoveryInput = () => {
  const dispatch = useAppDispatch();
  const leadsFilters = useAppSelector((state) => state.leadsFilters);
  const playwrightUrlDiscoveryFilter = leadsFilters.playwrightUrlDiscoveryFilter;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        LeadsFiltersActions.setPlaywrightUrlDiscoveryFilter(
          e.target.value as LeadUrlDiscoveryFilterValue
        )
      );
    },
    [dispatch]
  );

  return (
    <select
      value={playwrightUrlDiscoveryFilter}
      onChange={handleChange}
      className={styles.select}
    >
      {URL_DISCOVERY_FILTER_OPTIONS.map((o) => (
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
