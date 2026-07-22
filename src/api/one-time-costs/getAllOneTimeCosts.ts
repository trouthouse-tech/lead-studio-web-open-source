import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { OneTimeCost } from './types';
import type { ApiResult } from '../types';

type OneTimeCostsResponseBody = {
  success: boolean;
  data?: OneTimeCost[];
  error?: string;
};

/**
 * GET /api/data/one-time-costs
 */
export const getAllOneTimeCosts = async (): Promise<ApiResult<OneTimeCost[]>> => {
  const result = await requestApi<OneTimeCost[]>(
    `${API_CONFIG.SERVER_URL}/api/data/one-time-costs`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!result.success) return result;
  return { ...result, data: result.data ?? [] };
};
