import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { RecurringCost, RecurringCostBillingInterval } from './types';
import type { ApiResult } from '../types';

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

/**
 * POST /api/data/recurring-costs
 */
export const createRecurringCost = async (
  body: CreateRecurringCostBody,
): Promise<ApiResult<RecurringCost>> => {
  const result = await requestApi<RecurringCost>(
    `${API_CONFIG.SERVER_URL}/api/data/recurring-costs`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  if (!result.success || !result.data) {
    return { ...result, success: false, error: result.error ?? 'Failed to create recurring cost' };
  }
  return result;
};
