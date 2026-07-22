'use client';

import type { MouseEvent } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import { LeadsFiltersBuilderActions } from '@/store/builders';
import { readPersistedLeadsFilters, writePersistedLeadsFilters } from '@/utils/leads';
import { LeadsHeaderButtons } from '../header/buttons';
import { LeadsFiltersSearchInput } from './inputs';
import { LeadsFiltersModal } from './modal';
import { getHasActiveAttributeFilters } from './getHasActiveAttributeFilters';

export const LeadsFilters = () => {
  const dispatch = useAppDispatch();
  const hasHydratedFiltersRef = useRef(false);

  /**
   * Subscribe to the whole `leadsFilters` slice with `shallowEqual` so we re-render only when a field
   * actually changes, not when unrelated Redux updates produce a new object identity.
   */
  const leadsFilters = useAppSelector((state) => state.leadsFilters, shallowEqual);

  const leadsFiltersBuilder = useAppSelector((state) => state.leadsFiltersBuilder);
  const isFiltersModalOpen = leadsFiltersBuilder.isFiltersModalOpen;

  /**
   * Hydrate persisted filters before paint so the first client render matches localStorage and the
   * persist effect below does not overwrite good persisted data with defaults on the first tick.
   */
  useLayoutEffect(() => {
    if (hasHydratedFiltersRef.current) {
      return;
    }
    const persisted = readPersistedLeadsFilters();
    if (persisted) {
      dispatch(
        LeadsFiltersActions.hydrateFromPersisted({
          ...persisted,
          activeSavedFilterId: persisted.activeSavedFilterId ?? null,
        })
      );
    }
    hasHydratedFiltersRef.current = true;
  }, [dispatch]);

  /**
   * After hydration, mirror any `leadsFilters` slice change to localStorage.
   */
  useEffect(() => {
    if (!hasHydratedFiltersRef.current) {
      return;
    }
    writePersistedLeadsFilters(leadsFilters);
    dispatch(
      LeadsFiltersBuilderActions.setHasActiveFilters(
        getHasActiveAttributeFilters(leadsFilters)
      )
    );
  }, [dispatch, leadsFilters]);

  const openModal = useCallback(() => {
    dispatch(LeadsFiltersBuilderActions.setFiltersModalOpen(true));
  }, [dispatch]);

  const handleFilterIconClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      openModal();
    },
    [openModal]
  );

  const hasActiveForBadge = useMemo(
    () => getHasActiveAttributeFilters(leadsFilters),
    [leadsFilters]
  );

  return (
    <div className={styles.container}>
      <div className={styles.toolbarRow}>
        <div className={styles.searchAndFilters}>
          <LeadsFiltersSearchInput variant="bar" dense />
          <button
            type="button"
            className={styles.filterIconButton}
            onClick={handleFilterIconClick}
            aria-label="Open filters"
            aria-expanded={isFiltersModalOpen}
            aria-haspopup="dialog"
          >
            <span className={styles.filterIconWrap}>
              <FilterFunnelIcon />
              {hasActiveForBadge ? (
                <span className={styles.filterBadge} aria-hidden />
              ) : null}
            </span>
          </button>
        </div>
        <LeadsHeaderButtons />
      </div>
      <LeadsFiltersModal />
    </div>
  );
};

const FilterFunnelIcon = () => (
  <svg
    className={styles.filterSvg}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const styles = {
  container: `mb-3`,
  toolbarRow: `flex flex-wrap items-center justify-between gap-2`,
  searchAndFilters: `flex flex-1 min-w-0 max-w-xl items-stretch gap-1.5`,
  filterIconButton: `
    inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md
    border border-gray-300 bg-white text-gray-700 shadow-sm
    hover:bg-gray-50 hover:text-gray-900 cursor-pointer
  `,
  filterIconWrap: `relative inline-flex`,
  filterSvg: `h-4 w-4`,
  filterBadge: `
    absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-white
  `,
};
