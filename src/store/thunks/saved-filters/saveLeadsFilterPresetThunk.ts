import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { createSavedFilter, updateSavedFilter } from '@/api/saved-filters';
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
 * Saves the current filter state: updates the active preset when set, otherwise creates a new row (requires `name`).
 */
export const saveLeadsFilterPresetThunk = (name?: string): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const lf = getState().leadsFilters;
    const filters = pickFilters(lf);
    const activeId = lf.activeSavedFilterId;

    try {
      if (activeId) {
        const res = await updateSavedFilter({
          id: activeId,
          filters,
          ...(typeof name === 'string' && name.trim() ? { name: name.trim() } : {}),
        });
        if (!res.success || !res.data) {
          return mapApiFailureToThunkStatus(res);
        }
        dispatch(SavedFiltersActions.upsertSavedFilter(res.data));
        dispatch(LeadsFiltersActions.setActiveSavedFilterId(res.data.id));
        return 200;
      }

      const trimmed = typeof name === 'string' ? name.trim() : '';
      if (!trimmed) {
        return 400;
      }
      const res = await createSavedFilter({ name: trimmed, filters });
      if (!res.success || !res.data) {
        return mapApiFailureToThunkStatus(res);
      }
      dispatch(SavedFiltersActions.upsertSavedFilter(res.data));
      dispatch(LeadsFiltersActions.setActiveSavedFilterId(res.data.id));
      return 200;
    } catch (e) {
      const { message, stack } = coerceErrorFields(e);
      reportThunkError({
        event: 'failedToSaveLeadsFilterPreset',
        message,
        stack,
        thunkName: 'saveLeadsFilterPresetThunk',
      });
      console.error('saveLeadsFilterPresetThunk', e);
      return 500;
    }
  };
};
