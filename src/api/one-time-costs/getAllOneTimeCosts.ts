import { getApiClient } from '@/api/client';
import type { OneTimeCost } from './types';
import type { ApiResponse } from '../types';

type OneTimeCostsResponseBody = {
  success: boolean;
  data?: OneTimeCost[];
  error?: string;
};

/**
 * GET /api/data/one-time-costs
 */
export const getAllOneTimeCosts = async (): Promise<ApiResponse<OneTimeCost[]>> => {
  try {
    const { data } = await getApiClient().get<OneTimeCostsResponseBody>('/api/data/one-time-costs');
    if (!data.success) {
      return { success: false, error: data.error ?? 'Failed to load one-time costs' };
    }
    return { success: true, data: data.data ?? [] };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load one-time costs',
    };
  }
};
