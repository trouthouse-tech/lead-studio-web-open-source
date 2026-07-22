import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { createSavedFilter } from '@/api/saved-filters';
import type { LeadsFiltersState } from '@/store/filters';
import type { PersistedLeadsFilters } from '@/utils/leads';
import type { AppThunk } from '../../store';
import { LeadsFiltersActions } from '@/store/filters';
import { SavedFiltersActions } from '@/store/dumps/savedFilters';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

const pickFilters = (s: LeadsFiltersState): PersistedLeadsFilters => {
  const { activeSavedFilterId: _id, ...filters } = s;
  return filters;
};

/**
 * Creates a new preset from the current on-screen filters (including unsaved edits), named from the source row unless overridden.
 */
export const duplicateSavedLeadsFilterThunk = (
  sourceId: string,
  nameOverride?: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const row = getState().savedFilters[sourceId];
    if (!row) {
      return 400;
    }
    const filters = pickFilters(getState().leadsFilters);
    const nextName =
      typeof nameOverride === 'string' && nameOverride.trim()
        ? nameOverride.trim()
        : `${row.name} (copy)`;

    try {
      const res = await createSavedFilter({
        name: nextName,
        filters,
      });
      if (!res.success || !res.data) {
        return mapApiFailureToThunkStatus(res);
      }
      dispatch(SavedFiltersActions.upsertSavedFilter(res.data));
      dispatch(
        LeadsFiltersActions.hydrateFromPersisted({
          ...res.data.filters,
          activeSavedFilterId: res.data.id,
        })
      );
      return 200;
    } catch (e) {
      const { message, stack } = coerceErrorFields(e);
      reportThunkError({
        event: 'failedToDuplicateSavedLeadsFilter',
        message,
        stack,
        thunkName: 'duplicateSavedLeadsFilterThunk',
      });
      console.error('duplicateSavedLeadsFilterThunk', e);
      return 500;
    }
  };
};
