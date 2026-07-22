import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadActivity } from '@/model';
import type { ApiResult } from '../types';

export type CreateLeadActivityInput = {
  lead_id: string;
  customer_id: string;
  customer_name: string;
  activity_type?: 'lead_opened';
};

export const createLeadActivity = async (
  input: CreateLeadActivityInput
): Promise<ApiResult<LeadActivity>> => {
  const result = await requestApi<LeadActivity>(`${API_CONFIG.SERVER_URL}/api/data/lead-activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? (result as ApiResult<LeadActivity>).data! };
};
