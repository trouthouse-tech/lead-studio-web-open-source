import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { deleteSavedFilter } from '@/api/saved-filters';
import type { AppThunk } from '../../store';
import { LeadsFiltersActions } from '@/store/filters';
import { SavedFiltersActions } from '@/store/dumps/savedFilters';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Deletes a saved preset. Clears active selection when it matches the deleted id.
 */
export const deleteSavedLeadsFilterThunk = (id: string): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const res = await deleteSavedFilter({ id });
      if (!res.success) {
        return mapApiFailureToThunkStatus(res);
      }
      dispatch(SavedFiltersActions.removeSavedFilter(id));
      if (getState().leadsFilters.activeSavedFilterId === id) {
        dispatch(LeadsFiltersActions.setActiveSavedFilterId(null));
      }
      return 200;
    } catch (e) {
      const { message, stack } = coerceErrorFields(e);
      reportThunkError({
        event: 'failedToDeleteSavedLeadsFilter',
        message,
        stack,
        thunkName: 'deleteSavedLeadsFilterThunk',
      });
      console.error('deleteSavedLeadsFilterThunk', e);
      return 500;
    }
  };
};
