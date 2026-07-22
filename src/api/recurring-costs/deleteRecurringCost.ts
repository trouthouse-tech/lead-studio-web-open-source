import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

/**
 * DELETE /api/data/recurring-costs/:id
 */
export const deleteRecurringCost = async (id: string): Promise<ApiResult<void>> => {
  const result = await requestApi<void>(
    `${API_CONFIG.SERVER_URL}/api/data/recurring-costs/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!result.success) {
    return { ...result, error: result.error ?? 'Failed to delete recurring cost' };
  }
  return { ...result, success: true };
};
