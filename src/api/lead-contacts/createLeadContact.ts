import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContact, CreateLeadContactInput } from '@/model/lead-contact';
import type { ApiResult } from '../types';

export const createLeadContact = async (
  input: CreateLeadContactInput
): Promise<ApiResult<LeadContact>> => {
  const result = await requestApi<LeadContact>(`${API_CONFIG.SERVER_URL}/api/data/lead-contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? (result as ApiResult<LeadContact>).data! };
};
