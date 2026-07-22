import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

/**
 * DELETE /api/data/one-time-costs/:id
 */
export const deleteOneTimeCost = async (id: string): Promise<ApiResult<void>> => {
  const result = await requestApi<void>(
    `${API_CONFIG.SERVER_URL}/api/data/one-time-costs/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!result.success) {
    return { ...result, error: result.error ?? 'Failed to delete one-time cost' };
  }
  return { ...result, success: true };
};
