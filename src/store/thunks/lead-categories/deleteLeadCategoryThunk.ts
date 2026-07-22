import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { deleteLeadCategory } from '@/api/lead-categories';
import type { AppThunk } from '../../store';
import { getAllLeadCategoriesThunk } from './getAllLeadCategoriesThunk';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteLeadCategoryThunk = (id: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      if (!id) {
        return 400;
      }

      const response = await deleteLeadCategory(id);
      if (!response.success) {
        return mapApiFailureToThunkStatus(response);
      }

      return await dispatch(getAllLeadCategoriesThunk());
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToDeleteLeadCategory',
        message,
        stack,
        thunkName: 'deleteLeadCategoryThunk',
      });
      console.error('❌ deleteLeadCategoryThunk error:', error);
      return 500;
    }
  };
};
