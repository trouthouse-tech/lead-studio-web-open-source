import type { AppThunk } from '../../store';
import { LeadsFiltersActions } from '@/store/filters';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Applies a saved preset to the leads filter state (or clears selection when id is null).
 */
export const applySavedLeadsFilterThunk = (id: string | null): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    if (id === null) {
      dispatch(LeadsFiltersActions.setActiveSavedFilterId(null));
      return 200;
    }
    const row = getState().savedFilters[id];
    if (!row) {
      dispatch(LeadsFiltersActions.setActiveSavedFilterId(null));
      return 400;
    }
    dispatch(
      LeadsFiltersActions.hydrateFromPersisted({
        ...row.filters,
        activeSavedFilterId: row.id,
      })
    );
    return 200;
  };
};
