'use client';

import type { ChangeEvent, MouseEvent } from 'react';
import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { LeadsFiltersState } from '@/store/filters';
import type { PersistedLeadsFilters } from '@/utils/leads';
import {
  applySavedLeadsFilterThunk,
  deleteSavedLeadsFilterThunk,
  duplicateSavedLeadsFilterThunk,
  saveLeadsFilterPresetThunk,
} from '@/store/thunks/saved-filters';
import { LeadsFiltersActions } from '@/store/filters';

const normalizeForCompare = (f: PersistedLeadsFilters): PersistedLeadsFilters => ({
  ...f,
  selectedCategoryIds: [...f.selectedCategoryIds].sort(),
});

const filtersEqual = (a: PersistedLeadsFilters, b: PersistedLeadsFilters): boolean =>
  JSON.stringify(normalizeForCompare(a)) === JSON.stringify(normalizeForCompare(b));

const pickFilters = (s: LeadsFiltersState): PersistedLeadsFilters => {
  const { activeSavedFilterId: _id, ...rest } = s;
  return rest;
};

export const LeadsSavedFilterModalToolbar = () => {
  const dispatch = useAppDispatch();
  const leadsFilters = useAppSelector((s) => s.leadsFilters);
  const savedById = useAppSelector((s) => s.savedFilters);

  const rows = useMemo(
    () => Object.values(savedById).sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [savedById]
  );

  const activeId = leadsFilters.activeSavedFilterId;
  const activeRow = activeId ? savedById[activeId] : undefined;
  const current = pickFilters(leadsFilters);
  const isDirty = !!activeRow && !filtersEqual(current, activeRow.filters);

  const handleSelectPreset = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value;
      if (!v) {
        dispatch(applySavedLeadsFilterThunk(null));
        return;
      }
      dispatch(applySavedLeadsFilterThunk(v));
    },
    [dispatch]
  );

  const handleNew = useCallback(() => {
    dispatch(LeadsFiltersActions.clearFilters());
  }, [dispatch]);

  const handleSave = useCallback(async () => {
    if (activeId) {
      const status = await dispatch(saveLeadsFilterPresetThunk());
      if (status !== 200) {
        window.alert('Could not save filters. Try again.');
        return;
      }
      return;
    }
    const name = window.prompt('Name this filter view');
    if (!name) {
      return;
    }
    const status = await dispatch(saveLeadsFilterPresetThunk(name));
    if (status !== 200) {
      window.alert('Could not save filters. Try again.');
      return;
    }
  }, [dispatch, activeId]);

  const handleDuplicate = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!activeId || !activeRow) {
        return;
      }
      const suggested = `${activeRow.name} (copy)`;
      const name = window.prompt('Name for the duplicate', suggested);
      if (!name) {
        return;
      }
      const status = await dispatch(duplicateSavedLeadsFilterThunk(activeId, name));
      if (status !== 200) {
        window.alert('Could not duplicate this view.');
      }
    },
    [dispatch, activeId, activeRow]
  );

  const handleDelete = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!activeId) {
        return;
      }
      if (!window.confirm('Delete this saved filter view?')) {
        return;
      }
      const status = await dispatch(deleteSavedLeadsFilterThunk(activeId));
      if (status !== 200) {
        window.alert('Could not delete this view.');
      }
    },
    [dispatch, activeId]
  );

  const duplicateDisabled = !activeId;
  const deleteDisabled = !activeId;

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <label className={styles.label} htmlFor="leads-saved-filter-select">
          Saved view
        </label>
        <select
          id="leads-saved-filter-select"
          className={styles.select}
          value={activeId ?? ''}
          onChange={handleSelectPreset}
        >
          <option value="">Custom (unsaved)</option>
          {rows.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <button type="button" className={styles.btnGhost} onClick={handleNew}>
          New
        </button>
      </div>
      <div className={styles.toolbarRight}>
        {isDirty ? <span className={styles.dirty}>Unsaved changes</span> : null}
        <button
          type="button"
          className={styles.btnSave}
          onClick={handleSave}
          disabled={!!activeId && !isDirty}
          title={
            activeId && !isDirty
              ? 'No changes to save'
              : 'Save current filters'
          }
        >
          {activeId ? 'Save' : 'Save as…'}
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={handleDuplicate}
          disabled={duplicateDisabled}
          title="Duplicate this view"
          aria-label="Duplicate saved view"
        >
          <DuplicateIcon />
        </button>
        <button
          type="button"
          className={styles.iconBtnDanger}
          onClick={handleDelete}
          disabled={deleteDisabled}
          title="Delete this view"
          aria-label="Delete saved view"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

const DuplicateIcon = () => (
  <svg
    className={styles.svgIcon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const TrashIcon = () => (
  <svg
    className={styles.svgIcon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const styles = {
  toolbar: `
    flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between
    rounded-lg border border-gray-100 bg-gray-50/90 px-3 py-3
  `,
  toolbarLeft: `flex flex-wrap items-center gap-2`,
  toolbarRight: `flex flex-wrap items-center justify-end gap-2`,
  label: `text-xs font-medium text-gray-500`,
  select: `
    text-sm border border-gray-300 rounded-md px-2 py-2 bg-white shadow-sm
    min-w-[11rem] max-w-[16rem]
  `,
  btnGhost: `
    text-sm px-2 py-2 rounded-md border border-gray-200 bg-white text-gray-800
    hover:bg-gray-50 cursor-pointer
  `,
  btnSave: `
    text-sm px-3 py-2 rounded-md border border-gray-900 bg-gray-900 text-white
    hover:bg-gray-800 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
  `,
  iconBtn: `
    inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200
    bg-white text-gray-700 hover:bg-gray-50 cursor-pointer
    disabled:opacity-40 disabled:cursor-not-allowed
  `,
  iconBtnDanger: `
    inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200
    bg-white text-red-600 hover:bg-red-50 cursor-pointer
    disabled:opacity-40 disabled:cursor-not-allowed
  `,
  svgIcon: `h-[1.125rem] w-[1.125rem]`,
  dirty: `text-xs text-amber-700 mr-1`,
};
