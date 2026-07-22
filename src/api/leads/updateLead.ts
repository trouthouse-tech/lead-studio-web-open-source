import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { Lead } from '@/model';
import type { ApiResult } from '../types';

export const updateLead = async (
  leadId: string,
  payload: Partial<Lead>
): Promise<ApiResult<Lead>> => {
  const result = await requestApi<Lead>(`${API_CONFIG.SERVER_URL}/api/data/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? (result as ApiResult<Lead>).data! };
};
