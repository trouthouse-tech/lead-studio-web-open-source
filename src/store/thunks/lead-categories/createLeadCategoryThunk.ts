import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { createLeadCategory } from '@/api/lead-categories';
import { normalizeLeadCategoryName } from '@/utils/leads';
import type { AppThunk } from '../../store';
import { getAllLeadCategoriesThunk } from './getAllLeadCategoriesThunk';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const createLeadCategoryThunk = (name: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return 400;
      }

      const response = await createLeadCategory({
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
        event: 'failedToCreateLeadCategory',
        message,
        stack,
        thunkName: 'createLeadCategoryThunk',
      });
      console.error('❌ createLeadCategoryThunk error:', error);
      return 500;
    }
  };
};
