import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export const deleteLeadCategory = async (
  id: string,
  apiBaseUrl?: string
): Promise<ApiResult<null>> => {
  const baseUrl = apiBaseUrl ?? API_CONFIG.SERVER_URL;
  const result = await requestApi<null>(`${baseUrl}/api/data/lead-categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, success: true, data: null };
};
