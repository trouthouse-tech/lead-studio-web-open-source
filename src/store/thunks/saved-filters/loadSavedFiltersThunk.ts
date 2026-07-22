import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { getSavedFilters } from '@/api/saved-filters';
import type { AppThunk } from '../../store';
import { SavedFiltersActions } from '@/store/dumps/savedFilters';
import { LeadsFiltersActions } from '@/store/filters';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads saved leads filter presets for the signed-in user.
 */
export const loadSavedFiltersThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const res = await getSavedFilters();
      if (!res.success || !res.data) {
        return mapApiFailureToThunkStatus(res);
      }
      dispatch(SavedFiltersActions.setSavedFilters(res.data));
      const active = getState().leadsFilters.activeSavedFilterId;
      if (active) {
        const stillExists = res.data.some((r) => r.id === active);
        if (!stillExists) {
          dispatch(LeadsFiltersActions.setActiveSavedFilterId(null));
        }
      }
      return 200;
    } catch (e) {
      const { message, stack } = coerceErrorFields(e);
      reportThunkError({
        event: 'failedToLoadSavedFilters',
        message,
        stack,
        thunkName: 'loadSavedFiltersThunk',
      });
      console.error('loadSavedFiltersThunk', e);
      return 500;
    }
  };
};
