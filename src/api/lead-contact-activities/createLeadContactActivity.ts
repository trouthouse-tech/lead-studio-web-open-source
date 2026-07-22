import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContactActivity } from '@/model';
import type { ApiResult } from '../types';

export type CreateLeadContactActivityInput = {
  lead_contact_id: string;
  lead_id: string;
  customer_id: string;
  customer_name: string;
  activity_type?: 'lead_contact_opened';
};

export const createLeadContactActivity = async (
  input: CreateLeadContactActivityInput
): Promise<ApiResult<LeadContactActivity>> => {
  const result = await requestApi<LeadContactActivity>(`${API_CONFIG.SERVER_URL}/api/data/lead-contact-activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? (result as ApiResult<LeadContactActivity>).data! };
};
