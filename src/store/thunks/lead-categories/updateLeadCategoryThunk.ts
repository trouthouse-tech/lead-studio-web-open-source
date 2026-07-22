import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { updateLeadCategory } from '@/api/lead-categories';
import { normalizeLeadCategoryName } from '@/utils/leads';
import type { AppThunk } from '../../store';
import { getAllLeadCategoriesThunk } from './getAllLeadCategoriesThunk';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const updateLeadCategoryThunk = (
  id: string,
  name: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const trimmedName = name.trim();
      if (!id || !trimmedName) {
        return 400;
      }

      const response = await updateLeadCategory(id, {
        name: trimmedName,
        normalizedName: normalizeLeadCategoryName(trimmedName),
      });

      if (!response.success) {
        return mapApiFailureToThunkStatus(response);
      }

      return await dispatch(getAllLeadCategoriesThunk());
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToUpdateLeadCategory',
        message,
        stack,
        thunkName: 'updateLeadCategoryThunk',
      });
      console.error('❌ updateLeadCategoryThunk error:', error);
      return 500;
    }
  };
};
