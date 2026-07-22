'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import { LEAD_STATUSES } from '@/utils/leads/constants';

export const LeadsFiltersStatusInput = () => {
  const dispatch = useAppDispatch();
  const leadsFilters = useAppSelector((state) => state.leadsFilters);
  const selectedStatus = leadsFilters.selectedStatus;

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(LeadsFiltersActions.setSelectedStatus(e.target.value || null));
    },
    [dispatch]
  );

  return (
    <select
      value={selectedStatus ?? ''}
      onChange={handleStatusChange}
      className={styles.select}
    >
      <option value="">All Statuses</option>
      {LEAD_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
};

const styles = {
  select: `text-sm border border-gray-300 rounded px-2 py-1.5 bg-white`,
};
