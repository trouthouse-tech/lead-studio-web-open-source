import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { OneTimeCost, OneTimeCostCategory } from './types';
import type { ApiResult } from '../types';

export type CreateOneTimeCostBody = {
  vendor: string;
  description?: string | null;
  amount_cents: number;
  currency?: string;
  purchased_at?: string;
  category?: OneTimeCostCategory;
  notes?: string | null;
};

/**
 * POST /api/data/one-time-costs
 */
export const createOneTimeCost = async (
  body: CreateOneTimeCostBody,
): Promise<ApiResult<OneTimeCost>> => {
  const result = await requestApi<OneTimeCost>(
    `${API_CONFIG.SERVER_URL}/api/data/one-time-costs`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  if (!result.success || !result.data) {
    return { ...result, success: false, error: result.error ?? 'Failed to create one-time cost' };
  }
  return result;
};
