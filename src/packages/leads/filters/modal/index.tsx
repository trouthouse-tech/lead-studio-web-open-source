'use client';

import type { MouseEvent } from 'react';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import { LeadsFiltersBuilderActions } from '@/store/builders';
import {
  LeadsFiltersCategoryInput,
  LeadsFiltersFacebookSearchInput,
  LeadsFiltersLeadContactInput,
  LeadsFiltersQualityInput,
  LeadsFiltersStatusInput,
  LeadsFiltersUrlDiscoveryInput,
  LeadsFiltersWebsiteInput,
  LeadsFiltersWebsiteResearchInput,
} from './inputs';
import { LeadsSavedFilterModalToolbar } from '../saved-views';

/**
 * Full-screen filters dialog. Reads open state, active-filter badge, and close/clear from Redux (zero props).
 */
export const LeadsFiltersModal = () => {
  const dispatch = useAppDispatch();
  const leadsFiltersBuilder = useAppSelector((s) => s.leadsFiltersBuilder);
  const open = leadsFiltersBuilder.isFiltersModalOpen;
  const hasActiveFilters = leadsFiltersBuilder.hasActiveFilters;

  const close = useCallback(() => {
    dispatch(LeadsFiltersBuilderActions.setFiltersModalOpen(false));
  }, [dispatch]);

  const handleBackdropMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        close();
      }
    },
    [close]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(LeadsFiltersActions.clearFilters());
  }, [dispatch]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leads-filters-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="leads-filters-modal-title" className={styles.title}>
            Filters
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={close}
            aria-label="Close filters"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        <LeadsSavedFilterModalToolbar />

        <div className={styles.panelGrid}>
          <LeadsFiltersStatusInput />
          <LeadsFiltersQualityInput />
          <LeadsFiltersWebsiteInput />
          <LeadsFiltersLeadContactInput />
          <LeadsFiltersFacebookSearchInput />
          <LeadsFiltersUrlDiscoveryInput />
          <LeadsFiltersWebsiteResearchInput />
          <LeadsFiltersCategoryInput />
        </div>

        <div className={styles.panelFooter}>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleClearFilters}
              className={styles.clearButton}
            >
              Clear filters
            </button>
          ) : (
            <span className={styles.muted}>No attribute filters applied</span>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: `
    fixed inset-0 z-50 flex items-start justify-center overflow-y-auto
    bg-black/40 px-3 py-8 sm:py-12
  `,
  dialog: `
    w-full max-w-5xl rounded-xl border border-gray-200 bg-white shadow-xl
    p-4 sm:p-5
  `,
  header: `flex items-center justify-between gap-3 mb-4`,
  title: `text-lg font-semibold text-gray-900`,
  closeButton: `
    flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200
    bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer text-sm
  `,
  panelGrid: `
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4
  `,
  panelFooter: `mt-4 flex items-center gap-2 border-t border-gray-100 pt-4`,
  clearButton: `text-sm text-gray-600 hover:text-gray-900 cursor-pointer border-none bg-transparent`,
  muted: `text-xs text-gray-500`,
};
