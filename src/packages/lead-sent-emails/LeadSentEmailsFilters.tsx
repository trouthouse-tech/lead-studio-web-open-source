'use client';

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { LeadSentEmailsBuilderActions } from '@/store/builders';
import { getAllLeadSentEmailsThunk } from '@/store/thunks/lead-sent-emails';
import type { DateRangeFilter } from '@/utils/date-time';
import type { StatCardFilter } from '@/store/builders/leadSentEmailsBuilder';

const formatFilterLabel = (filter: StatCardFilter): string => {
  switch (filter) {
    case 'bounced':
      return 'Bounced';
    case 'unique_opens':
      return 'Unique Opens';
    case 'total_opens':
      return 'Total Opens';
    case 'not_opened':
      return 'Not Opened';
    default:
      return '';
  }
};

export const LeadSentEmailsFilters = () => {
  const dispatch = useAppDispatch();
  const dateRangeFilter = useAppSelector(
    (state) => state.leadSentEmailsBuilder.dateRangeFilter
  );
  const statCardFilter = useAppSelector(
    (state) => state.leadSentEmailsBuilder.statCardFilter
  );
  const onlySingleSentPerLead = useAppSelector(
    (state) => state.leadSentEmailsBuilder.onlySingleSentPerLead
  );

  const handleDateRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const filter: DateRangeFilter =
        value === '' ? null : (value as DateRangeFilter);
      dispatch(LeadSentEmailsBuilderActions.setDateRangeFilter(filter));
    },
    [dispatch]
  );

  const handleClearStatFilter = useCallback(() => {
    dispatch(LeadSentEmailsBuilderActions.clearStatCardFilter());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    await dispatch(getAllLeadSentEmailsThunk());
  }, [dispatch]);

  const handleSingleSentPerLeadChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(LeadSentEmailsBuilderActions.setOnlySingleSentPerLead(e.target.checked));
    },
    [dispatch]
  );

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow}>
        <div className={styles.leftFilters}>
          <select
            value={dateRangeFilter ?? ''}
            onChange={handleDateRangeChange}
            className={styles.filterSelect}
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="last_week">Last Week</option>
            <option value="l30">L30</option>
          </select>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={onlySingleSentPerLead}
              onChange={handleSingleSentPerLeadChange}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxText}>
              Follow-up: one sent email per lead
            </span>
          </label>
          {statCardFilter && (
            <div className={styles.activeFilterBadge}>
              <span>Filtered: {formatFilterLabel(statCardFilter)}</span>
              <button
                type="button"
                onClick={handleClearStatFilter}
                className={styles.clearButton}
                aria-label="Clear filter"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className={styles.refreshButton}
          aria-label="Refresh emails"
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  );
};

const styles = {
  filtersContainer: `
    w-full
  `,
  filtersRow: `
    flex items-center justify-between gap-4 flex-wrap
  `,
  leftFilters: `
    flex gap-2 items-center flex-wrap
  `,
  checkboxLabel: `
    inline-flex items-center gap-2 cursor-pointer select-none
  `,
  checkboxInput: `
    h-3.5 w-3.5 rounded border-gray-300 text-blue-600
    focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer
  `,
  checkboxText: `
    text-xs text-gray-700 max-w-[14rem] sm:max-w-none
  `,
  filterSelect: `
    h-7 px-2 py-1 text-xs
    border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500
    bg-white text-gray-900
    cursor-pointer
  `,
  activeFilterBadge: `
    inline-flex items-center gap-1.5
    px-2 py-1
    text-xs text-gray-700
    bg-blue-50 border border-blue-300 rounded
  `,
  clearButton: `
    text-base leading-none font-medium text-gray-500
    hover:text-gray-800 transition-colors
    cursor-pointer
  `,
  refreshButton: `
    h-7 px-3 text-xs font-medium
    text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50
    transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500
    cursor-pointer
  `,
};
