import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { Lead } from '@/model';
import type { ApiResult } from '../types';

export const getLeadById = async (
  leadId: string
): Promise<ApiResult<Lead>> => {
  const result = await requestApi<Lead>(`${API_CONFIG.SERVER_URL}/api/data/leads/${leadId}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? (result as ApiResult<Lead>).data! };
};
