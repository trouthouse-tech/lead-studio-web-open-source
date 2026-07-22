import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadActivity } from '@/model';
import type { ApiResult } from '../types';

export const getAllLeadActivities = async (): Promise<ApiResult<LeadActivity[]>> => {
  const result = await requestApi<LeadActivity[]>(`${API_CONFIG.SERVER_URL}/api/data/lead-activities`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
