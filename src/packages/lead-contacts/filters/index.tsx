'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadContactsFiltersActions } from '@/store/filters';
import { LeadContactsFiltersBuilderActions } from '@/store/builders';
import type { LeadContactStatus } from '@/model/lead-contact';
import { getAllLeadContactsThunk } from '@/store/thunks/lead-contacts';
import {
  getHasActiveLeadContactsFilters,
  readPersistedLeadContactsFilters,
  STATUS_CONFIG,
  writePersistedLeadContactsFilters,
} from '@/utils/lead-contacts';

const STATUS_OPTIONS = Object.keys(STATUS_CONFIG) as LeadContactStatus[];

export const LeadContactsFilters = () => {
  const dispatch = useAppDispatch();
  const hasHydratedFiltersRef = useRef(false);

  const leadContactsFilters = useAppSelector(
    (state) => state.leadContactsFilters,
    shallowEqual
  );

  const hasActiveFilters = useAppSelector(
    (state) => state.leadContactsFiltersBuilder.hasActiveFilters
  );

  useLayoutEffect(() => {
    if (hasHydratedFiltersRef.current) {
      return;
    }
    const persisted = readPersistedLeadContactsFilters();
    if (persisted) {
      dispatch(LeadContactsFiltersActions.hydrateFromPersisted(persisted));
    }
    hasHydratedFiltersRef.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (!hasHydratedFiltersRef.current) {
      return;
    }
    writePersistedLeadContactsFilters(leadContactsFilters);
    dispatch(
      LeadContactsFiltersBuilderActions.setHasActiveFilters(
        getHasActiveLeadContactsFilters(leadContactsFilters)
      )
    );
  }, [dispatch, leadContactsFilters]);

  const handleClearFilters = useCallback(() => {
    dispatch(LeadContactsFiltersActions.clearFilters());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    await dispatch(getAllLeadContactsThunk());
  }, [dispatch]);

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow}>
        <div className={styles.leftFilters}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Name, email, role, or phone"
            value={leadContactsFilters.searchFilter}
            onChange={(e) =>
              dispatch(LeadContactsFiltersActions.setSearchFilter(e.target.value))
            }
            autoComplete="off"
            aria-label="Search contacts"
          />
          <select
            className={styles.filterSelect}
            value={leadContactsFilters.statusFilter}
            onChange={(e) =>
              dispatch(
                LeadContactsFiltersActions.setStatusFilter(
                  e.target.value as LeadContactStatus | 'all'
                )
              )
            }
            aria-label="Status filter"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_CONFIG[status].label}
              </option>
            ))}
          </select>
          {hasActiveFilters ? (
            <div className={styles.activeFilterBadge}>
              <span>Filters on</span>
              <button
                type="button"
                onClick={handleClearFilters}
                className={styles.clearButton}
                aria-label="Clear filters"
              >
                ×
              </button>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className={styles.refreshButton}
          aria-label="Refresh contacts"
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
    flex gap-2 items-center flex-wrap min-w-0 flex-1
  `,
  searchInput: `
    h-7 min-w-0 w-full max-w-md flex-1 px-2 text-xs
    border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500
    bg-white text-gray-900
    placeholder:text-gray-400
  `,
  filterSelect: `
    h-7 shrink-0 px-2 py-1 text-xs sm:w-44
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
    h-7 px-3 text-xs font-medium shrink-0
    text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50
    transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500
    cursor-pointer
  `,
};
