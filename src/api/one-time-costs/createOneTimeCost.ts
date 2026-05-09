import { getApiClient } from '@/api/client';
import type { OneTimeCost, OneTimeCostCategory } from './types';
import type { ApiResponse } from '../types';

export type CreateOneTimeCostBody = {
  vendor: string;
  description?: string | null;
  amount_cents: number;
  currency?: string;
  purchased_at?: string;
  category?: OneTimeCostCategory;
  notes?: string | null;
};

type CreateResponseBody = {
  success: boolean;
  data?: OneTimeCost;
  error?: string;
};

/**
 * POST /api/data/one-time-costs
 */
export const createOneTimeCost = async (
  body: CreateOneTimeCostBody,
): Promise<ApiResponse<OneTimeCost>> => {
  try {
    const { data } = await getApiClient().post<CreateResponseBody>('/api/data/one-time-costs', body);
    if (!data.success || !data.data) {
      return { success: false, error: data.error ?? 'Failed to create one-time cost' };
    }
    return { success: true, data: data.data };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create one-time cost',
    };
  }
};
