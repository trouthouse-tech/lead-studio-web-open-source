'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import {
  WEBSITE_RESEARCH_FILTER_OPTIONS,
  type LeadWebsiteResearchFilterValue,
} from '@/utils/leads/constants';

export const LeadsFiltersWebsiteResearchInput = () => {
  const dispatch = useAppDispatch();
  const websiteResearchFilter = useAppSelector(
    (state) => state.leadsFilters.websiteResearchFilter
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        LeadsFiltersActions.setWebsiteResearchFilter(
          e.target.value as LeadWebsiteResearchFilterValue
        )
      );
    },
    [dispatch]
  );

  return (
    <select
      value={websiteResearchFilter}
      onChange={handleChange}
      className={styles.select}
    >
      {WEBSITE_RESEARCH_FILTER_OPTIONS.map((o) => (
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
