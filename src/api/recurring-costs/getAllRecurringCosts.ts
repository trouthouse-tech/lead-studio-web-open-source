import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { RecurringCost } from './types';
import type { ApiResult } from '../types';

type RecurringCostsResponseBody = {
  success: boolean;
  data?: RecurringCost[];
  error?: string;
};

/**
 * GET /api/data/recurring-costs
 */
export const getAllRecurringCosts = async (): Promise<ApiResult<RecurringCost[]>> => {
  const result = await requestApi<RecurringCost[]>(
    `${API_CONFIG.SERVER_URL}/api/data/recurring-costs`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!result.success) return result;
  return { ...result, data: result.data ?? [] };
};
