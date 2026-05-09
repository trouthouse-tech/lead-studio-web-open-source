import { getApiClient } from '@/api/client';
import type { RecurringCost, RecurringCostBillingInterval } from './types';
import type { ApiResponse } from '../types';

export type CreateRecurringCostBody = {
  name: string;
  vendor?: string | null;
  amount_cents: number;
  billing_interval?: RecurringCostBillingInterval;
  interval_months?: number | null;
  currency?: string;
  started_at?: string;
  next_renewal_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
  notes?: string | null;
};

type CreateResponseBody = {
  success: boolean;
  data?: RecurringCost;
  error?: string;
};

/**
 * POST /api/data/recurring-costs
 */
export const createRecurringCost = async (
  body: CreateRecurringCostBody,
): Promise<ApiResponse<RecurringCost>> => {
  try {
    const { data } = await getApiClient().post<CreateResponseBody>('/api/data/recurring-costs', body);
    if (!data.success || !data.data) {
      return { success: false, error: data.error ?? 'Failed to create recurring cost' };
    }
    return { success: true, data: data.data };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create recurring cost',
    };
  }
};
