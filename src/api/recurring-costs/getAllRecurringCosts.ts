import { getApiClient } from '@/api/client';
import type { RecurringCost } from './types';
import type { ApiResponse } from '../types';

type RecurringCostsResponseBody = {
  success: boolean;
  data?: RecurringCost[];
  error?: string;
};

/**
 * GET /api/data/recurring-costs
 */
export const getAllRecurringCosts = async (): Promise<ApiResponse<RecurringCost[]>> => {
  try {
    const { data } = await getApiClient().get<RecurringCostsResponseBody>('/api/data/recurring-costs');
    if (!data.success) {
      return { success: false, error: data.error ?? 'Failed to load recurring costs' };
    }
    return { success: true, data: data.data ?? [] };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load recurring costs',
    };
  }
};
