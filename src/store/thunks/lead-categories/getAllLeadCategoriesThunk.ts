import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { getAllLeadCategories } from '@/api/lead-categories';
import { LeadCategoriesActions } from '../../dumps/leadCategories';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllLeadCategoriesThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllLeadCategories();

      if (response.success && response.data) {
        dispatch(LeadCategoriesActions.setLeadCategories(response.data));
        return 200;
      }

      if (
        response.error?.includes('not available yet') ||
        response.error?.includes('not found')
      ) {
        dispatch(LeadCategoriesActions.setLeadCategories([]));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetAllLeadCategories',
        message,
        stack,
        thunkName: 'getAllLeadCategoriesThunk',
      });
      console.error('❌ getAllLeadCategoriesThunk error:', error);
      return 500;
    }
  };
};
