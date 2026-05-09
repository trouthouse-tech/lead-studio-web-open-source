import type { AppThunk } from '@/store';
import { postLeadCost, type PostLeadCostBody } from '@/api/lead-costs';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates a manual ledger cost row for a lead.
 */
export const postLeadCostThunk = (body: PostLeadCostBody): AppThunk<ResponseType> => {
  return async (): ResponseType => {
    try {
      const response = await postLeadCost(body);
      if (!response.success || !response.data) {
        return 400;
      }
      return 200;
    } catch (error: unknown) {
      console.error('❌ postLeadCostThunk error:', error);
      return 500;
    }
  };
};
