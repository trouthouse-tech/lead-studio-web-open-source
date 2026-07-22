import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export const deleteLead = async (
  leadId: string
): Promise<ApiResult<null>> => {
  const result = await requestApi<null>(`${API_CONFIG.SERVER_URL}/api/data/leads/${leadId}`, { method: 'DELETE' });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, success: true, data: null };
};
