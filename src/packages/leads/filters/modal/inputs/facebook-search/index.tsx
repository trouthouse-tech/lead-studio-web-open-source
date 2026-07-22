'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import {
  FACEBOOK_SEARCH_FILTER_OPTIONS,
  type LeadFacebookSearchFilterValue,
} from '@/utils/leads/constants';

export const LeadsFiltersFacebookSearchInput = () => {
  const dispatch = useAppDispatch();
  const leadsFilters = useAppSelector((state) => state.leadsFilters);
  const facebookGoogleSearchFilter = leadsFilters.facebookGoogleSearchFilter;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        LeadsFiltersActions.setFacebookGoogleSearchFilter(
          e.target.value as LeadFacebookSearchFilterValue
        )
      );
    },
    [dispatch]
  );

  return (
    <select
      value={facebookGoogleSearchFilter}
      onChange={handleChange}
      className={styles.select}
    >
      {FACEBOOK_SEARCH_FILTER_OPTIONS.map((o) => (
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
