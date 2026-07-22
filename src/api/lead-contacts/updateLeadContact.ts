import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContact } from '@/model/lead-contact';
import type { ApiResult } from '../types';

export const updateLeadContact = async (
  contactId: string,
  payload: Partial<Omit<LeadContact, 'id' | 'lead_id' | 'created_at'>>
): Promise<ApiResult<LeadContact>> => {
  const result = await requestApi<LeadContact>(`${API_CONFIG.SERVER_URL}/api/data/lead-contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? (result as ApiResult<LeadContact>).data! };
};
