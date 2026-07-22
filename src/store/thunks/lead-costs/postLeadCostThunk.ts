import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { postLeadCost, type PostLeadCostBody } from '@/api/lead-costs';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates a manual ledger cost row for a lead.
 */
export const postLeadCostThunk = (body: PostLeadCostBody): AppThunk<ResponseType> => {
  return async (): ResponseType => {
    try {
      const response = await postLeadCost(body);
      if (!response.success || !response.data) {
        return mapApiFailureToThunkStatus(response);
      }
      return 200;
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToPostLeadCost',
        message,
        stack,
        thunkName: 'postLeadCostThunk',
      });
      console.error('❌ postLeadCostThunk error:', error);
      return 500;
    }
  };
};
